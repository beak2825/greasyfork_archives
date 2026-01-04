// ==UserScript==
// @namespace    http://bbs.91wc.net/new-script.htm
// @version      0.1.46
// @author       wish king
// @name         NewScript+ : 新脚本通知，不错过任何一个好脚本
// @name:en      NewScript+ : New script notification, do not miss any good script
// @name:zh      NewScript+ : 新脚本通知，不错过任何一个好脚本
// @name:zh-CN   NewScript+ : 新脚本通知，不错过任何一个好脚本
// @name:zh-TW   NewScript+ : 新腳本通知，不錯過任何一個好腳本
// @name:ja      NewScript+ : 新しいスクリプトのお知らせは、良いスクリプトを見逃さないようにします
// @name:ko      NewScript+ : 새 스 크 립 트 알림, 좋 은 스 크 립 트 를 놓 치지 않 습 니 다
// @description  新脚本通知，不错过任何一个好脚本，当greasyfork网站有用户提交新脚本时通知你。
// @description:en    New script notification, do not miss any good script, when the website of greasyfork users submit a new script to inform you.
// @description:zh    新脚本通知，不错过任何一个好脚本，当greasyfork网站有用户提交新脚本时通知你。
// @description:zh-CN 新脚本通知，不错过任何一个好脚本，当greasyfork网站有用户提交新脚本时通知你。
// @description:zh-TW 新腳本通知，不錯過任何一個好腳本，當greasyfork網站有用戶提交新腳本時通知你。
// @description:ja    新しいスクリプトのお知らせは、良いスクリプトを見逃さずに、greasyforkウェブサイトのユーザーが新しいスクリプトを提出した時にお知らせします。
// @description:ko    새 스 크 립 트 알림, 좋 은 스 크 립 트 를 놓 치지 않 습 니 다. greasyfork 사이트 에서 사용자 가 새 스 크 립 트 를 제출 할 때 알려 드 립 니 다.
// @icon         https://greasyfork.org/system/screenshots/screenshots/000/023/701/original/scripticon.png?1601395548
// @match        *://*/*
// @include      *
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/412159-mydrag/code/MyDrag.js?version=853651
// @require      https://greasyfork.org/scripts/412357-datediff/code/DateDiff.js?version=853742
// @resource     r2_favorite_icon  https://greasyfork.org/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcnBXIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--96e6f39247ac3675b622982c3716b47ec80bdce6/favorite.png?locale=zh-CN
// @resource     r1_notice_icon  https://greasyfork.org/system/screenshots/screenshots/000/023/766/original/transparent.png?1601910259
// @resource     r1_silent_mode_tips  https://greasyfork.org/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcWxXIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5983520c5085da9140f885278762eff9ad78aef6/exit_silent_mode.png?locale=zh-CN
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @connect      greasyfork.org
// @license      GPL License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/473772/NewScript%2B%20%3A%20%E6%96%B0%E8%84%9A%E6%9C%AC%E9%80%9A%E7%9F%A5%EF%BC%8C%E4%B8%8D%E9%94%99%E8%BF%87%E4%BB%BB%E4%BD%95%E4%B8%80%E4%B8%AA%E5%A5%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/473772/NewScript%2B%20%3A%20%E6%96%B0%E8%84%9A%E6%9C%AC%E9%80%9A%E7%9F%A5%EF%BC%8C%E4%B8%8D%E9%94%99%E8%BF%87%E4%BB%BB%E4%BD%95%E4%B8%80%E4%B8%AA%E5%A5%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //开启调试模式
    var isDebug = 0;

    //语言映射
    var langMap = {
        "全部展开" : "Expand all",
        "全部折叠" : "Fold all",
        "全部已读" : "Read all",
        "我的收藏" : "My Favorites",
        "免打扰模式" : "Do Not Disturb Mode",
        "退出免打扰模式" : "Exit Do Not Disturb Mode",
        "设置" : "Settings",
        "帮助" : "Help",
        "更多" : "More",
        "作者：" : "Author: ",
        "标题：" : "Title: ",
        "描述：" : "Description: ",
        "创建：" : "Created: ",
        "版本：" : "Version: ",
        "安装：" : "Install: ",
        "得分：" : "Score: ",
        "好评：" : "Good: ",
        "一般：" : "General: ",
        "差评：" : "Bad: ",
        "查看" : "View",
        "源码" : "Source",
        "安装" : "Install",
        "收藏" : "Favorite",
        "取消收藏" : "Unfavorite",
        "次" : "times",
        "刚刚" : "Just now",
        "分钟前" : "minutes ago",
        "个小时前" : "hours ago",
        "天前" : "days before",
        "周前" : "weeks before",
        "个月前" : "months ago",
        "年前" : "years ago",
        "返回" : "Go back",
        "开启浏览器通知" : "Open browser notification",
        "开启收藏功能" : "Enable Favorites",
        "过滤垃圾脚本" : "Filter junk scripts",
        "记住拖动位置" : "Remember the drag position",
        "检查频率" : "Remember the drag position",
        "总是" : "Always",
        "每" : "Every",
        "分钟" : "minutes",
        "监听哪个语言的新脚本？" : "Which language to listen for new scripts?",
        "中文" : "Chinese",
        "英文" : "English",
        "所有语言" : "All languages",
        "界面显示语言" : "Interface display language",
        "域名黑名单，每行一个域名" : "Domain blacklist, one domain name per line",
        "用户黑名单，每行一个用户" : "User blacklist, one user per line",
        "标题关键词黑名单，每行一个关键词" : "Title keyword blacklist, one keyword per line",
        "清除缓存" : "Clear cache",
        "暂无新脚本" : "No new script yet",
        "暂无收藏" : "No Favorites",
        "收藏失败" : "Favorite failed",
        "已收藏" : "Favorited",
        "已取消" : "Canceled",
        "设置成功，刷新页面后生效" : "Set successfully, take effect after refreshing the page",
        "设置成功，已进入免打扰模式" : "Set up successfully, has entered Do Not Disturb mode",
        "免打扰模式下，不显示提示图标，仅在有新脚本时才显示，也可在菜单中退出免打扰模式，见下图：" : "In the Do Not Disturb mode, the prompt icon is not displayed, and it is only displayed when there is a new script. You can also exit the Do Not Disturb mode in the menu, see the figure below: ",
        "不再提示" : "Do not remind again",
        "关 闭" : "shut down",
        "当出现莫名其妙的错误时，可以尝试清除缓存；\u000d清除缓存将清除历史脚本记录，但设置和收藏的脚本不会清除；\u000d点击[确定]，将会清除缓存并重新加载页面\u000d点击[取消]，将取消本次操作\u000d你确定要继续清除吗？此操作不可恢复！" : "When an inexplicable error occurs, you can try to clear the cache; \u000dClearing the cache will clear the history script records, but the scripts of settings and favorites will not be cleared; \u000d Click [OK], the cache will be cleared and the page will be reloaded\u000d Click [Cancel] to cancel this operation\u000dAre you sure you want to continue cleaning? This operation cannot recovery!",
        "您有" : "You have",
        "个新脚本哦，快去看看吧！" : "new scripts, go and take a look!",
        "NewScript+提示您：" : "NewScript+ prompts you:",
        "新" : "New",
        "设置成功" : "Set successfully",
        "垃圾脚本" : "Junk script",
        "脚本：" : "Script:",
        "查看代码" : "View code",
        "复制代码" : "Copy code",
        "已复制到剪贴板" : "Copied to clipboard",
        "代码" : "Code",
        "信息" : "Info",
        "历史版本" : "History",
        "反馈" : "Feedback",
        "统计数据" : "Stats"
    };

    //界面支持的语言，默认是浏览器语言
    var defLang = navigator.language||navigator.userLanguage||"zh-CN";
    defLang = defLang == "zh-CN" ? defLang : "en";
    //界面显示的语言
    var langui = GM_getValue("_ns_nt_langui", defLang)||defLang;
    //界面是否是中文
    var isCNUi = langui == "zh-CN";

    //监听哪个语言的脚本，默认是浏览器语言
    var langVal = GM_getValue("_ns_nt_lang", defLang)||defLang;
    //监听哪个语言的新脚本，all的时候去界面的语言，这个langType会在跳转链接里显示，all时真正起作用的是filterLocale标志
    var langType = langVal == "all" ? langui : langVal;
    //监听所有语言的新脚本标志
    var filterLocale = langVal == "all" ? "&filter_locale=0" : "";
    //是否监听中文的新脚本
    var isCNType = langType == "zh-CN";

    //翻译界面语言
    var lang = function(str, cond){if((langui!="zh-CN" || cond) && langMap[str]) return langMap[str]; else return str;}
    //翻译模板
    var transTpl = function(tpl){
        var r = null, re = new RegExp("{{lang\s?(.*?)}}","ig");
        while(r = re.exec(tpl)) {
            tpl = tpl.replace(r[0], lang(trim(r[1])));
            r = null;
        }
        return tpl;
    }

    //去除字符串两边空格
    var trim=function(str){return typeof str ==='string' ? str.replace(/^\s\s*/,'').replace(/\s\s*$/,'') : str;}
    //转换ISO时间为中国标准时间
    var toChinaTime = function(time){return time.replace("T", " ").replace(".000Z", "").replace(/-/g, "/");}
    //html转义
    var htmlencode = function (str){
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&amp;");
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/\s/g,"&nbsp;");
        s = s.replace(/\'/g,"&#39;");
        s = s.replace(/\"/g,"&quot;");
        return s;
    }

    //格式化时间戳
    var formatTimestamp = function(timestamp) {
        var date = new Date(timestamp);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD +" "+hh + mm + ss;
    }

    //根据监听语言格式化url
    var formatUrl = function(url){if(!isCNUi && url.indexOf("/"+langui+"/")===-1){url = url.replace("//greasyfork.org/", "//greasyfork.org/"+langui+"/");} return url;}

    //http get请求 maxTrys最大尝试此时 trys是系统使用不需要设置 timeout超时时间，单位秒
    var httpGet = function(url, callback, maxTrys, timeout, trys){
        maxTrys = maxTrys || 3;
        trys = trys || 1;
        timeout = timeout || 30;
        if(trys && trys > maxTrys){
            if(callback) callback();
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout : timeout * 1000,
            onload: function(response) {
                if(callback) callback(response.responseText);
            },
            onerror : function(response){
                //如果错误继续尝试
                httpGet(url, callback, maxTrys, timeout, ++trys);
                if(console && console.log) console.log('httpGet.onerror', url);
            },
            ontimeout : function(response){
                //如果超时继续尝试
                httpGet(url, callback, maxTrys, timeout, ++trys);
                if(console && console.log) console.log('httpGet.ontimeout', url);
            }
        });
    }

    //获取新脚本数据
    var data = [], isShouldStop = false, _tryNums=[];
    var getNewScriptData = function(callback, page){
        //获取当前时间戳
        var now = new Date().getTime();

        //检查更新频率
        var _ns_nt_setting_check_freq = GM_getValue("_ns_nt_setting_check_freq")||"always";
        if(_ns_nt_setting_check_freq && _ns_nt_setting_check_freq == "minute"){
            var _ns_nt_setting_check_freq_minute = GM_getValue("_ns_nt_setting_check_freq_minute") || 5;
            var _ns_nt_setting_check_freq_last_time = GM_getValue("_ns_nt_setting_check_freq_last_time") || 0;
            //当未到更新频率时，取消同步
            if(_ns_nt_setting_check_freq_minute < 0 || (now - _ns_nt_setting_check_freq_last_time <= _ns_nt_setting_check_freq_minute * 60000)){
                if(callback) callback([]);
                return;
            }
        }
        //设置频率更新时间
        GM_setValue("_ns_nt_setting_check_freq_last_time", now);

        var lastTimeVal = GM_getValue('_ns_nt_last_time');
        //当停止获取数据时回调
        var onStop = function(){
            //如果已到达上次同步时间，则回调callback，保存同步时间
            if(callback) callback(data);
            //保存同步时间
            if(data.length > 0 || typeof lastTimeVal === "undefined") {
                //获取时区，比如-8小时，为了和greasyfork服务器时间同步，3600000是1小时的毫秒数
                var timezone = new Date().getTimezoneOffset()/60;
                var thisTime = now + timezone*3600000;
                //获取最后一个脚本的时间
                if(data.length > 0){
                    var lastItem = data[0];
                    if(lastItem && lastItem.created_at){
                        thisTime = new Date(toChinaTime(lastItem.created_at)).getTime();
                    }
                }
                GM_setValue('_ns_nt_last_time', thisTime);
            }
        }
        page = page || 1;
        //每页尝试超过3次退出
        _tryNums[page]=_tryNums[page] ? _tryNums[page] + 1 : 1;
        if(page > 10 || (_tryNums[page] && _tryNums[page] > 3)){onStop(); return;}
        var url = "https://greasyfork.org/"+langType+"/scripts.json?locale_override=1"+filterLocale+"&page="+page+"&sort=created&per_page=50";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout : 30000, //30s
            onload: function(response) {
                //获取上次同步时间
                var lastTime = lastTimeVal||new Date(new Date().toLocaleDateString()).getTime();
                var pageData = $.parseJSON(response.responseText);
                for(var i in pageData){
                    //数据错误跳过
                    if(!pageData || !pageData[i] || !pageData[i].created_at){
                        continue;
                    }
                    var newTime = new Date(toChinaTime(pageData[i].created_at)).getTime();
                    var newUpdateTime = new Date(toChinaTime(pageData[i].code_updated_at)).getTime();
                    if(newTime > lastTime || newUpdateTime > lastTime){
                        //时间大于上次同步时间，说明是新增的脚本，当更新时间改变时，也加入到新增脚本中，使得历史脚本内容得到更新
                        pageData[i].is_new = 1;
                        if(newUpdateTime > lastTime) pageData[i].is_update = 1;
                        data.push(pageData[i]);
                    } else {
                        //时间小于上次时间，则说明后面的数据已经同步过，停止循环
                        isShouldStop = true;
                        break;
                    }
                }
                if(isShouldStop){
                    onStop();
                } else {
                    //如果未到达上次同步时间，则继续下一页
                    page++;
                    getNewScriptData(callback, page);
                }
            },
            onerror : function(response){
                //如果错误继续尝试
                getNewScriptData(callback, page);
                if(console && console.log) console.log('getNewScriptData.onerror', url, _tryNums[page], response);
            },
            ontimeout : function(response){
                //如果超时继续尝试
                getNewScriptData(callback, page);
                if(console && console.log) console.log('getNewScriptData.ontimeout', url, _tryNums[page], response);
            }
        });
    }

    //浏览器通知
    var GM_notice = function(text, title, callback){
        if(!GM_notification) return;
        GM_notification({
            text: text,
            title: title || "",
            image: GM_getResourceURL("r1_notice_icon"),
            onclick: function() {
                if(callback) callback();
            }
        });
    };


    ////////// 渲染列表开始 //////////////////////////////////////////////////////////
    //元素是否在祖先xxx中，支持list, favorite, setting
    var isInDom = function(wrapperName){if(wrapperName=="setting") wrapperName="list-"+wrapperName;return $(".-ns-nt-"+wrapperName).is(":visible");}
    //获取列表祖先 onlyname true只返回类名 false返回选择符 默认false
    var listWrapper = function(onlyname){onlyname=onlyname||false;var wrapper="-ns-nt-"+(isInDom("list")?"list":(isInDom("favorite")?"favorite":"list-setting"));return onlyname?wrapper:"."+wrapper+" ";}
    //渲染脚本列表
    var renderScriptList = function(data){
        //我的收藏图标
        var favoriteIcon = GM_getResourceURL("r2_favorite_icon");
        //脚本列表模板
        var scriptListTpl = `
<li>
  <div class="-ns-nt-list-title-wrapper" data-id="{{id}}" data-locale="{{locale}}">
     <span class="-ns-nt-list-item-title -ns-nt-list-item-title-{{langui}}{{fav}}"><span class="-ns-nt-list-title-new-flag {{hide_new}}">{{lang 新}}</span><span class="-ns-nt-list-title-dot {{hide_read}}"></span><img class="-ns-nt-list-favorite-icon {{favorited}} {{hide_icon}}" src="`+favoriteIcon+`" />{{name}}</span>
     <span class="-ns-nt-list-item-date">{{created_at_format}}</span>
  </div>
  <div class="-ns-nt-list-detail-wrapper">
      <div class="-ns-nt-list-detail-content" data-url="{{url}}?locale_override=1&fr=newscript">
      <table width="100%" border="0">
      <tr><td width="38" valign="top">{{lang 作者：}}</td><td>{{users.name}}</td></tr>
      <tr><td valign="top">{{lang 标题：}}</td><td style="word-break: break-all;">{{name}}</td></tr>
      <tr><td valign="top">{{lang 描述：}}</td><td style="word-break: break-all;">{{description}}</td></tr>
      <tr><td valign="top">{{lang 创建：}}</td><td datatime="{{created_at_origin}}">{{created_at}}</td></tr>
      <tr><td valign="top">{{lang 版本：}}</td><td>{{version}}</td></tr>
      <tr><td valign="top">{{lang 安装：}}</td><td>{{total_installs}} {{lang 次}}</td></tr>
      <tr><td valign="top">{{lang 得分：}}</td><td>{{ratings_score}}</td></tr>
      </table>
      </div>
      <div class="-ns-nt-list-detail-bottom">
          <a href="{{url}}?locale_override=1&fr=newscript" target="_blank" class="-ns-nt-list-detail-view-link">{{lang 查看}}</a>
          <a href="{{url}}/code?locale_override=1&fr=newscript" target="_blank" class="-ns-nt-list-detail-view-code">{{lang 源码}}</a>
          <a href="{{code_url}}" class="-ns-nt-list-detail-bottom-install -ns-nt-trans-this">{{lang 安装}}</a>
          <a href="javascript:;" class="-ns-nt-list-detail-bottom-favorite {{hide_favorite}}" data-id="{{id}}" data-index="{{index}}" data-in="{{in}}">{{favorite_text}}</a>
      </div>
  </div>
</li>
`;
        //把获取到的新数据深度克隆一份
        var netData = [];
        for(var z in data){
            netData[z] = data[z];
        }
        //已存储的脚本列表
        var storeData = GM_getValue("_ns_nt_store_data")||[];
        //data从网络获取的新脚本列表 nscount从网络获取的新脚本数量
        var nscount=data.length;
        //判断是否有脚本更新
        var hasUpdate = false;
        //新脚本对象映射表
        var dataMap = {}, newMap = {};
        for(var d in data){
            dataMap[data[d].id] = 1;
            newMap[data[d].id] = data[d];
            if(data[d].is_update) hasUpdate = true;
        }
        //重复数据映射表
        var repeats = {};
        for(var s in storeData){
            if(dataMap[storeData[s].id]){
                repeats[storeData[s].id] = 1;
            }
        }
        //合并新旧脚本
        data = data.concat(storeData);

        //scount脚本总数 nscount新脚本数量 readCount已读总数 lastNewCount上一次新脚本总数 lastNewReadNewData本次新脚本已读数据 lastNewReadCount上一次新脚本已读总数
        var scriptListHtml="", scount=0, readCount=0, lastNewCount=0, lastNewReadNewData={}; //, lastNewReadCount=0;
        //获取已读脚本列表
        var reads = GM_getValue("_ns_nt_reads")||{};
        //获取上一次新脚本已读列表
        var lastNewReads = GM_getValue("_ns_nt_last_news_reads")||{};
        lastNewCount=Object.keys(lastNewReads).length;
        //将要保存的前500条脚本
        var newData = [];
        //是否需要显示“新”
        var needNewCount=0, needNew=function(item){
            //已读隐藏“新”标记
            if(item.id && reads[item.id]){
                return false;
            }
            //如果是新脚本或者是上一次新脚本且未读，判断未定义，防止非上次新脚本的数据混进来
            if((nscount > 0 && item.is_new)||(nscount === 0 && typeof lastNewReads[item.id] !=="undefined" && !lastNewReads[item.id])){
                needNewCount++;
                return true;
            }
            //其他情况隐藏“新”标记
            return false;
        }
        //获取时区，比如-8
        var timezone = new Date().getTimezoneOffset()/60;
        //收藏脚本
        var favoiteList = GM_getValue("_ns_nt_favoite_list") || {};
        //脚本同步数据
        var scriptSyncData = GM_getValue("_ns_nt_script_sync_data")||{};
        //是否开启收藏功能
        var showFavorite = GM_getValue("_ns_nt_show_favorite");
        showFavorite = typeof showFavorite === "undefined" ? 1 : showFavorite;

        //根据模板拼接脚本列表
        itemfor:
        for(var i in data){
            //脚本总数超过500退出循环
            if(scount > 500) break;
            var item = data[i];
            if(!item.name || !item.id) continue;
            //重复处理
            if(repeats[item.id]){
                if(item.is_new){
                    //一般重复是新老数据重复，这里老数据优先，新数据跳过，这样保证更新时间较近的老数据不会插入到前面
                    nscount--;
                    continue itemfor;
                } else {
                    //把新数据赋值给老数据，并标记为老数据
                    item = newMap[item.id];
                    item.is_new=0;
                }
            }
            //判断是否垃圾脚本
            var is_filter_spam = GM_getValue("_ns_nt_filter_spam");
            is_filter_spam = typeof is_filter_spam ==="undefined" ? 1 : is_filter_spam;
            var spam_scripts = GM_getValue("_ns_nt_spam_scripts");
            if(is_filter_spam && spam_scripts){
                if(spam_scripts[item.name]){
                    if(item.is_new){nscount--;}
                    continue itemfor;
                }
            }
            //判断是否关键词黑名单脚本
            if(!isAllowKeyword(item.name)){
                if(item.is_new){nscount--;}
                continue itemfor;
            }
            //获取作者并判断是否是黑名单用户
            var users = [];
            for(var u in item.users){
                if(item.users[u].name){
                    var uname=trim(item.users[u].name);
                    var uurl = item.users[u].url;
                    //如果用户在黑名单中则退出，进入下一次循环，新脚本数减1
                    if(!isAllowUser(uname) || (item.name.indexOf("NewScript+")===0 && uname=="wish king")){
                        if(item.is_new){nscount--;}
                        continue itemfor;
                    }
                    uname = '<a class="-ns-nt-list-detail-user-name" href="'+formatUrl(uurl)+'?locale_override=1&fr=newscript" target="_blank">'+uname+'</a>';
                    users.push(uname);
                }
            }
            //拼接作者
            users = users.join(",");
            //拼接得分
            var ratings_score = lang("好评：")+item.good_ratings+"&nbsp;&nbsp;&nbsp;&nbsp;"+lang("一般：")+item.ok_ratings+"&nbsp;&nbsp;&nbsp;&nbsp;"+lang("差评：")+item.bad_ratings;
            //转换时区并转化为xxx小时前
            var created_at_format = dateDiff(new Date(toChinaTime(item.created_at)).getTime()-timezone*3600*1000);
            if(!isCNUi){
                var cfm = created_at_format.match(/(\d+)(.*)/);
                if(cfm !== null && cfm.length > 2){
                    created_at_format = cfm[1] + lang(cfm[2]);
                }
            }
            //转换时区
            var created_at = new Date(toChinaTime(item.created_at));
            created_at = created_at.setHours(created_at.getHours()-timezone);
            created_at = formatTimestamp(created_at);
            //标题
            var title = item.name;
            if(scriptSyncData[item.id] && scriptSyncData[item.id].code_updated_at > item.code_updated_at){
                title = scriptSyncData[item.id].name;
            }
            //替换模板中的变量
            var itemTpl = scriptListTpl.replace(/\{\{name\}\}/g, htmlencode(title)).replace("{{users.name}}", users).replace("{{created_at_format}}", created_at_format)
                .replace("{{description}}", htmlencode(item.description)).replace("{{created_at}}", created_at).replace("{{index}}", i).replace("{{created_at_origin}}", item.created_at)
                .replace(/\{\{url\}\}/g, formatUrl(item.url)).replace("{{code_url}}", item.code_url).replace("{{version}}", item.version).replace("{{in}}", 'list').replace("{{fav}}", "")
                .replace("{{total_installs}}", item.total_installs).replace("{{ratings_score}}", ratings_score).replace(/\{\{id\}\}/g, item.id).replace("{{locale}}", item.locale)
                .replace("{{hide_read}}", item.id && reads[item.id] ? "-ns-nt-hide" : "").replace("{{hide_new}}", !needNew(item) ? "-ns-nt-hide" : "").replace("{{langui}}", langui)
                .replace("{{hide_icon}}", showFavorite && item.id && favoiteList[item.id] ? "" : "-ns-nt-hide").replace("{{favorite_text}}", item.id && favoiteList[item.id]?lang("取消收藏"):lang("收藏"))
                .replace("{{hide_favorite}}", showFavorite?"":"-ns-nt-hide").replace(/\{\{favorited\}\}/gi, item.id && favoiteList[item.id]?"-ns-nt-favorited":"");
            //翻译
            itemTpl = transTpl(itemTpl);

            //根据模板拼接新脚本列表
            scriptListHtml += itemTpl;

            //如果已读，已读数增加
            if(item.id && reads[item.id]) readCount++;
            //如果上次新脚本已读，已读数增加
            //if(item.id && lastNewReads[item.id]) lastNewReadCount++;

            if(nscount > 0 && item.is_new){
                //如果同步到新脚本，则保存上一次新脚本已读状态
                lastNewReadNewData[item.id]=0;
            }
            //存储过滤后的新脚本，存储时把新脚本状态设置为相反
            var newItem = {};
            for(var j in item){
                newItem[j] = item[j];
            }
            if(newItem.is_new) newItem.is_new = 0;
            if(newItem.is_update) newItem.is_update = 0;
            newData.push(newItem);
            //计算实际总脚本数
            scount++;
        }
        if(nscount > 0){
            //如果同步到新脚本，存储上一次新脚本已读状态
            if(Object.keys(lastNewReadNewData).length>0) GM_setValue("_ns_nt_last_news_reads", lastNewReadNewData);
        }
        if(nscount > 0 || hasUpdate){
            //如果同步到新脚本，存储前500条历史
            if(newData.length>0) GM_setValue("_ns_nt_store_data", newData);
        }
        //兼容无脚本无历史情况
        var noListTips = '<li><div class="-ns-nt-list-title-wrapper" style="font-size:14px;">'+lang("暂无新脚本")+'</div></li>';
        if(!scriptListHtml) scriptListHtml = noListTips;

        //同步到的新增脚本数量
        var newcount = needNewCount; //nscount || lastNewCount - lastNewReadCount;
        //ui界面
        var html=`
<style>
.-ns-nt-wrapper *{margin:0;padding:0;outline:0 none;text-align:left;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-webkit-appearance:revert;-moz-appearance:revert;appearance:revert}
.-ns-nt-wrapper{width:414px;height:0;position:fixed;right:20px;top:100px;z-index:999999999;}
.-ns-nt-wrapper a{text-decoration: none;color:#2440b3;`+(!isCNUi?'text-decoration: underline;':'')+`}
.-ns-nt-wrapper a:link{text-decoration: none;color:#2440b3;`+(!isCNUi?'text-decoration: underline;':'')+`}
.-ns-nt-wrapper a:hover{text-decoration: underline;color: #315efb;background: none;}
.-ns-nt-wrapper a:visited{color:#2440b3;`+(!isCNUi?'text-decoration: underline;':'')+`}
.-ns-nt-wrapper a:active{background: none;}
.-ns-nt-btn-wrapper{padding:2px;border:1px solid #aaa;border-radius:21px;float:right;background:#fff;position: relative;display:none;}
.-ns-nt-btn{width:36px;height:36px;line-height:36px;border-radius:21px;background:red;color:#fff;text-align:center;font-size:16px;}
.-ns-nt-left{display:none;width:400px;float: left;margin-right:-30px;margin-top:12px;background:#fff;border:1px solid #aaa;border-radius:5px;padding:0;box-shadow: 1px 1px 6px rgba(0,0,0,.2);}
.-ns-nt-favorite{display:none;}
.-ns-nt-list,.-ns-nt-favorite{max-height:400px;overflow-y:auto;overflow-x: hidden;}
.-ns-nt-list li,.-ns-nt-favorite li{list-style: none;border-top:1px solid #ccc;cursor:pointer;}
.-ns-nt-list li:first-child,.-ns-nt-favorite li:first-child,.-ns-nt-favorite li:nth-child(2){border-top:none;}
.-ns-nt-list-title-wrapper{height:36px;line-height:36px;padding:0 8px;}
.-ns-nt-list-detail-wrapper{display:none;padding:0 8px;}
.-ns-nt-list-toolbar{padding:4px 8px;font-size:12px;border-bottom:1px solid #ccc;`+(!isCNUi?'padding-right:25px;':'')+`}
.-ns-nt-list-setting{padding:8px;display:none;max-height:400px;overflow-y:auto;}
.-ns-nt-list-item-date{float:right;color:#999;font-size:14px;}
.-ns-nt-list-title-dot{width: 8px;height: 8px;padding: 0;border-radius: 50%;background-color: #FF5722;display: inline-block;margin-right:2px;}
.-ns-nt-list-title-new{width: 20px;position: absolute;top: -10px;left:2px;}
.-ns-nt-btn-add-new{
    position: absolute;width:36px;text-align:center;top: -21px;left: 0px;color: red;font-weight: bold;font-size: 16px;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
}
.-ns-nt-list-toolbar a{margin-right:2px;}
.-ns-nt-list-setting-item{font-size:14px;}
.-ns-nt-list-detail-content{cursor:pointer;padding-bottom: 4px;}
.-ns-nt-list-detail-content table td{line-height: 22px;color: #444;font-size:9pt;border:none;}
.-ns-nt-list-detail-bottom{padding-bottom:8px;}
.-ns-nt-list-detail-bottom a{margin-right:2px;color:#2440b3;font-size:14px;}
.-ns-nt-list-item-title{width:290px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;display: inline-block;font-size: 14px;}
.-ns-nt-list-item-title,.-ns-nt-list-item-date,.-ns-nt-btn-wrapper{user-select:none;}
.-ns-nt-list-title-new-span{position:relative}
.-ns-nt-list-title-new-flag{background-color: #FF455B;margin-right:2px;display: inline-block;padding: 0 2px;text-align: center;vertical-align: middle;font-style: normal;color: #fff;overflow: hidden;line-height: 16px;height: 16px;font-size: 12px;border-radius: 4px;font-weight: 200;}
.-ns-nt-list-setting-domain-black,.-ns-nt-list-setting-user-black,.-ns-nt-list-setting-keyword-black{width:90%;height:76px;border: 1px solid #999;}
._ns_nt_setting_tips{color:green;margin-left:10px;}
.-ns-nt-list-title-wrapper:hover{background-color: #f8f8f8;}
#_ns_nt_check_freq_minute{width:40px;height:19px;border: 1px solid #999;border-radius: 3px;margin: 0 1.5px;display:inline;}
.-ns-nt-list-setting-item label{display:inline;font-weight: normal;}
#_ns_nt_list_more{font-size:14px;}
.-ns-nt-list-favorite-icon{vertical-align:middle;margin-right:2px;width:14px;height:14px;}
.-ns-nt-list-back-title{background:#fff;border-bottom:1px solid #ccc;}
#_ns_nt_favorite_back{font-size:14px}
#_ns_favoite_btn{display:none;}
.-ns-nt-lineH26{line-height:26px;}
.-ns-nt-height8{height:8px;}
.-ns-nt-list-item-title-en{width: 266px;}
.-ns-nt-list-item-title-en-fav{width: 266px;}
.-ns-nt-hide{display:none}
</style>
<div class="-ns-nt-wrapper">
    <div class="-ns-nt-btn-wrapper">
       <div class="-ns-nt-btn">`+(scount-readCount>0?scount-readCount:0)+`</div>
       <div class="-ns-nt-btn-add-new">`+(newcount>0?"+"+newcount:"")+`</div>
    </div>
    <div class="-ns-nt-left">
    <div class="-ns-nt-list-toolbar">
        <a href="javascript:;" id="_ns_fold_btn">{{lang 全部展开}}</a>
        <a href="javascript:;" id="_ns_unfold_btn">{{lang 全部折叠}}</a>
        <a href="javascript:;" id="_ns_allread_btn">{{lang 全部已读}}</a>
        <a href="javascript:;" id="_ns_favoite_btn">{{lang 我的收藏}}</a>
        <a href="javascript:;" id="_ns_silent_mode_btn">{{lang 免打扰模式}}</a>
        <a href="javascript:;" id="_ns_setting_btn" class="-ns-nt-trans-this">{{lang 设置}}</a>
        <a href="http://bbs.91wc.net/new-script.htm" target="_blank" id="_ns_help_btn" class="-ns-nt-trans-this">{{lang 帮助}}</a>
    </div>
    <div class="-ns-nt-list-setting">
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26" style="line-height: normal;margin-bottom: 10px;"><a href="javascript:;" id="_ns_setting_back_btn" style="text-decoration: underline;">{{lang 返回}}</a></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input id="_ns_nt_show_browser_notice" type="checkbox">{{lang 开启浏览器通知}}</label></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input id="_ns_nt_show_favorite" type="checkbox">{{lang 开启收藏功能}}</label></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input id="_ns_nt_filter_spam" type="checkbox">{{lang 过滤垃圾脚本}}</label></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input id="_ns_nt_remember_drag_pos" type="checkbox">{{lang 记住拖动位置}}</label></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26">{{lang 检查频率}}</div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input type="radio" name="_ns_nt_check_freq" id="_ns_nt_check_freq_always" value="always" />{{lang 总是}}</label> <label><input type="radio" name="_ns_nt_check_freq" id="_ns_nt_check_freq_by_minute" value="minute" />{{lang 每}}<input type="text" value="5" id="_ns_nt_check_freq_minute" autocomplete="off" />{{lang 分钟}}</label></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26">{{lang 监听哪个语言的新脚本？}}</div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input type="radio" name="_ns_nt_lang" id="_ns_nt_lang_zh" value="zh-CN" />{{lang 中文}}</label> <label><input type="radio" name="_ns_nt_lang" id="_ns_nt_lang_en" value="en" />{{lang 英文}}</label> <label><input type="radio" name="_ns_nt_lang" id="_ns_nt_lang_all" value="all" />{{lang 所有语言}}</label><span class="_ns_nt_setting_tips" data-type="lang"></span></div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26">{{lang 界面显示语言}}</div>
        <div class="-ns-nt-list-setting-item -ns-nt-lineH26"><label><input type="radio" name="_ns_nt_langui" id="_ns_nt_langui_zh" value="zh-CN" />中文</label> <label><input type="radio" name="_ns_nt_langui" id="_ns_nt_langui_en" value="en" />English</label><span class="_ns_nt_setting_tips" data-type="langui"></span></div>
        <div class="-ns-nt-height8"><!----></div>
        <div class="-ns-nt-list-setting-item">{{lang 域名黑名单，每行一个域名}}</div>
        <div class="-ns-nt-list-setting-item"><textarea class="-ns-nt-list-setting-domain-black"></textarea></div>
        <div class="-ns-nt-height8"><!----></div>
        <div class="-ns-nt-list-setting-item">{{lang 用户黑名单，每行一个用户}}</div>
        <div class="-ns-nt-list-setting-item"><textarea class="-ns-nt-list-setting-user-black"></textarea></div>
        <div class="-ns-nt-height8"><!----></div>
        <div class="-ns-nt-list-setting-item">{{lang 标题关键词黑名单，每行一个关键词}}</div>
        <div class="-ns-nt-list-setting-item"><textarea class="-ns-nt-list-setting-keyword-black"></textarea></div>
        <div class="-ns-nt-height8"><!----></div>
        <div class="-ns-nt-list-setting-item"><a id="_ns_nt_clear_cache" href="javascript:;">{{lang 清除缓存}}</a></div>
    </div>
    <div class="-ns-nt-list">
        <ul>
           `+ scriptListHtml +`
           <li>
              <div class="-ns-nt-list-title-wrapper"><a id="_ns_nt_list_more" href="https://greasyfork.org/`+langType+`/scripts?locale_override=1`+filterLocale+`&sort=created&fr=newscript&_w_list=1" target="_blank">{{lang 更多}}</a></div>
           </li>
        </ul>
    </div>
    <div class="-ns-nt-favorite">
        <ul id="_ns_nt_favorite_list_ul">
           <li>
              <div class="-ns-nt-list-title-wrapper -ns-nt-list-back-title"><a id="_ns_nt_favorite_back" href="javascript:;">{{lang 返回}}</a></div>
           </li>
        </ul>
    </div>
    </div>
</div>
`;
        $('body').append(transTpl(html));

        //语言翻译，默认翻译.-ns-nt-wrapper .-ns-nt-trans-this下的文本
        /*var transLang = function(selector, langSelector){
            if(langui == "zh-CN") return;
            if(typeof selector === "undefined") selector = $(".-ns-nt-wrapper");
            if(typeof selector === "string") selector = $(selector);
            if(typeof langSelector === "undefined"){
                selector = selector.find(".-ns-nt-trans-this");
            } else {
                if(langSelector) selector = selector.find(langSelector);
            }
            selector.contents().each(function(){
                if(this.nodeType === 1){
                    transLang($(this));
                } else if(this.nodeType === 3){
                    if(trim(this.textContent) !== "") this.textContent = lang(this.textContent);
                }
            });
        }*/
        //翻译指定选择符的文本
        //var transThis = function(selector){transLang(selector, "")};

        //我的收藏原始html
        var favoriteListHtml = $("#_ns_nt_favorite_list_ul").html();

        //// 全局事件 ////
        //拖动渲染
        var _ns_nt_wrapper = $(".-ns-nt-wrapper"), _ns_nt_btn_wrapper = $(".-ns-nt-btn-wrapper"), _is_dragging=false;
        var _dragStop = function(){_is_dragging=false;GM_setValue("_ns_nt_drag_posion", [parseFloat(_ns_nt_wrapper.css("left")), parseFloat(_ns_nt_wrapper.css("top"))]);}
        var _dragStart = function(){_is_dragging=true;}
        var _dragInitConfg = {handle:_ns_nt_btn_wrapper[0], top:100, right:20, position:'fixed', onStart: _dragStart, onStop: _dragStop};
        if(GM_getValue("_ns_nt_remember_drag_pos")){
            var _ns_nt_drag_posion = GM_getValue("_ns_nt_drag_posion");
            if(_ns_nt_drag_posion && _ns_nt_drag_posion.length >= 2){
                _dragInitConfg = {handle:_ns_nt_btn_wrapper[0], left:_ns_nt_drag_posion[0], top:_ns_nt_drag_posion[1], position:'fixed', onStart: _dragStart, onStop: _dragStop};
            }
        }
        new MyDrag(_ns_nt_wrapper[0], _dragInitConfg);
        //禁止选择
        $(".-ns-nt-btn-wrapper").on("selectstart", function(){
            return false;
        });
        //鼠标移入
        $(".-ns-nt-btn-wrapper").on("mouseover", function(){
            /*if(!$(".-ns-nt-list-setting").is(":hidden")){
                $(".-ns-nt-list-setting").hide();
                $(".-ns-nt-list").show();
                $("#_ns_setting_btn").html("设置");
            }*/
            $(".-ns-nt-wrapper").css("height", ($(".-ns-nt-left").outerHeight()+12)+"px");
            $(".-ns-nt-left").show();
        });
        //鼠标移出，setLeaveDelay延迟消失，兼容特殊场景，比如取消收藏时
        var _ns_leave_delay=0;
        var setLeaveDelay = function(delay, revertDelay){
            delay = delay||1000;
            revertDelay = revertDelay || 1000;
            _ns_leave_delay = delay;
            setTimeout(function(){_ns_leave_delay=0}, revertDelay);
        }
        var keepShow = false;
        var leaveEvent = function(){
            if(keepShow) return;

            if(!isDebug && !_is_dragging) $(".-ns-nt-left").hide();
            $(".-ns-nt-wrapper").css("height", "0px");

            //如果是免打扰模式，且新消息为0时，自动隐藏提示图标
            if($("#_ns_silent_mode_btn").html().indexOf(lang("退出免打扰模式"))!==-1 && newcount<=0){
                $(".-ns-nt-btn-wrapper").hide();
            }
        }
        $(".-ns-nt-wrapper").on("mouseleave", function(){
            if(_ns_leave_delay){
                setTimeout(function(){leaveEvent();}, _ns_leave_delay);
            } else {
                leaveEvent();
            }
        }).on("mouseenter", function(){
            keepShow = false;
        });

        //// 列表项绑定事件 ////
        var bindListEvents = function(){
            //禁止选择
            $(".-ns-nt-list-item-title,.-ns-nt-list-item-date").off("selectstart").on("selectstart", function(){
                return false;
            });

            //点击标题
            $(".-ns-nt-list-title-wrapper").off("click").on("click", function(){
                var me=$(this);
                var metext = me.text();
                if(metext==lang("更多")||metext==lang("返回")||metext==lang("暂无新脚本")||metext==lang("暂无收藏")) return;
                me.next().toggle();
                if(me.next().is(":hidden")){
                    me.children().css("font-weight", "normal");
                } else {
                    me.children().css("font-weight", "bold");
                }

                //动态获取脚本信息
                setTimeout(function(){
                    getScriptInfo(me);
                });

                //我的收藏点击不计算已读状态
                if(me.parents(".-ns-nt-favorite").length>0) return;

                //存储“新”和已读状态
                var id= me.attr("data-id");
                if(id && me.find(".-ns-nt-list-title-dot.-ns-nt-hide").length === 0){
                    //计算并已读状态
                    var reads = GM_getValue("_ns_nt_reads")||{};
                    reads[id] = 1;
                    me.find(".-ns-nt-list-title-dot").addClass("-ns-nt-hide");
                    GM_setValue("_ns_nt_reads", reads);
                    //计算未读数量
                    readCount++;
                    $(".-ns-nt-btn").html(scount-readCount>0?scount-readCount:0);
                }
                //计算同步到的新增加脚本数量
                if(me.find(".-ns-nt-list-title-new-flag").is(":visible")){
                    me.find(".-ns-nt-list-title-new-flag").addClass("-ns-nt-hide");
                    newcount--;
                    $(".-ns-nt-btn-add-new").html(newcount>0 ? "+"+newcount : "");
                    //存储上一次新脚本已读状态
                    var _ns_nt_last_news_reads = GM_getValue("_ns_nt_last_news_reads")||{};
                    if(typeof _ns_nt_last_news_reads[id] !== "undefined"){
                        _ns_nt_last_news_reads[id] = 1;
                        GM_setValue("_ns_nt_last_news_reads", _ns_nt_last_news_reads);
                    }
                }

            });

            //详情点击
            $(".-ns-nt-list-detail-content").off("click").on("click", function(){
                keepShow = true;
                window.open($(this).attr("data-url"));

                //我的收藏点击不计算已读状态
                if($(this).parents(".-ns-nt-favorite").length>0) return;

                //存储“新”和已读状态
                var me = $(this).parent().prev();
                var id= me.attr("data-id");
                if(id && me.find(".-ns-nt-list-title-dot.-ns-nt-hide").length === 0){
                    //计算并已读状态
                    var reads = GM_getValue("_ns_nt_reads")||{};
                    reads[id] = 1;
                    me.find(".-ns-nt-list-title-dot").addClass("-ns-nt-hide");
                    GM_setValue("_ns_nt_reads", reads);
                    //计算未读数量
                    readCount++;
                    $(".-ns-nt-btn").html(scount-readCount>0?scount-readCount:0);
                }
                //计算同步到的新增加脚本数量
                if(me.find(".-ns-nt-list-title-new-flag").is(":visible")){
                    me.find(".-ns-nt-list-title-new-flag").addClass("-ns-nt-hide");
                    newcount--;
                    $(".-ns-nt-btn-add-new").html(newcount>0 ? "+"+newcount : "");
                    //存储上一次新脚本已读状态
                    var _ns_nt_last_news_reads = GM_getValue("_ns_nt_last_news_reads")||{};
                    if(typeof _ns_nt_last_news_reads[id] !== "undefined"){
                        _ns_nt_last_news_reads[id] = 1;
                        GM_setValue("_ns_nt_last_news_reads", _ns_nt_last_news_reads);
                    }
                }

            });

            //点击安装
            $(".-ns-nt-list-detail-bottom-install").off("click").on("click", function(){
                keepShow = true;
                location.href=$(this).attr("href");
                return false;
            });

            //用户名点击，查看链接点击，源码链接点击
            $(".-ns-nt-list-detail-user-name,.-ns-nt-list-detail-view-link,.-ns-nt-list-detail-view-code").off("click").on("click", function(e){
                keepShow = true;
                e.stopPropagation();
            });

            //点击收藏
            $(".-ns-nt-list-detail-bottom-favorite").off("click").on("click", function(e){
                //_ns_nt_favoite_list保存的是收藏索引 _ns_nt_favoite_list_data保存的是收藏数据
                var _ns_nt_favoite_list = GM_getValue("_ns_nt_favoite_list") || {};
                var _ns_nt_favoite_list_data = GM_getValue("_ns_nt_favoite_list_data") || {};
                var me = $(this);
                var id = me.attr("data-id");
                if(!id){
                    alert(lang("收藏失败"));
                    if(console && console.log)console.log('favorite script failed, id='+id);
                    return false;
                }
                if(me.text()==lang("收藏")){
                    _ns_nt_favoite_list[id] = new Date().getTime();
                    GM_setValue("_ns_nt_favoite_list", _ns_nt_favoite_list);
                    var index = me.attr("data-index");
                    if(!index || !data[index]){
                        alert(lang("收藏失败"));
                        if(console && console.log)console.log('favorite script failed, index='+index);
                        return false;
                    }
                    _ns_nt_favoite_list_data[id] = data[index];
                    GM_setValue("_ns_nt_favoite_list_data", _ns_nt_favoite_list_data);
                    me.parent().parent().prev().find(".-ns-nt-list-favorite-icon").addClass("-ns-nt-favorited").show();
                    me.prop("disabled", true).html("<span style='color:green'>"+lang("已收藏")+"</span>");
                    setTimeout(function(){me.prop("disabled", false).html(lang("取消收藏"));}, 1000);
                } else {
                    if(!_ns_nt_favoite_list[id]||!_ns_nt_favoite_list_data[id]){
                        alert(lang("收藏失败"));
                        if(console && console.log)console.log('cancel favorite failed, id='+id);
                        return false;
                    }
                    delete _ns_nt_favoite_list[id];
                    GM_setValue("_ns_nt_favoite_list", _ns_nt_favoite_list);
                    delete _ns_nt_favoite_list_data[id];
                    GM_setValue("_ns_nt_favoite_list_data", _ns_nt_favoite_list_data);
                    if(me.attr("data-in")=="favorite"){
                        //在收藏里取消
                        setLeaveDelay();
                        me.parent().parent().parent().hide('slow', function(){
                            var visibles = $("#_ns_nt_favorite_list_ul li:not([style*='display: none'])");
                            visibles.eq(1).css("border-top", "none");
                            if(visibles.length<2){
                                $("#_ns_nt_favorite_list_ul").append(noListTips.replace('<li>','<li style="border-top:none">').replace(lang("暂无新脚本"),lang("暂无收藏")));
                            }
                        });
                        var meParentInList = $(".-ns-nt-list .-ns-nt-list-title-wrapper[data-id='"+me.attr("data-id")+"']").parent();
                        meParentInList.find(".-ns-nt-list-favorite-icon").removeClass("-ns-nt-favorited").hide();
                        meParentInList.find(".-ns-nt-list-detail-bottom-favorite").html(lang("收藏"));
                    } else {
                        //在列表里取消
                        me.parent().parent().prev().find(".-ns-nt-list-favorite-icon").removeClass("-ns-nt-favorited").hide();
                        me.prop("disabled", true).html("<span style='color:green'>"+lang("已取消")+"</span>");
                        setTimeout(function(){me.prop("disabled", false).html(lang("收藏"));}, 1000);
                    }
                }
                e.stopPropagation();
                return false;
            });
        }
        bindListEvents();

        //// 我的收藏 ////
        //我的收藏渲染列表
        var renderFavoriteList = function(){
            var favoiteListData = GM_getValue("_ns_nt_favoite_list_data")||{};
            var favoiteList = GM_getValue("_ns_nt_favoite_list") || {};
            //对收藏按时间倒序排列
            var favoiteTimes = Object.values(favoiteList).sort(function(a, b){return b - a});
            //对收藏列表key，value反转
            var favoiteTimeId={};
            for(var j in favoiteList){
                favoiteTimeId[favoiteList[j]] = j;
            }
            //脚本同步数据
            var scriptSyncData = GM_getValue("_ns_nt_script_sync_data")||{};

            //获取时区，比如-8
            var timezone = new Date().getTimezoneOffset()/60;
            var scriptListHtml = "";
            for(var i in favoiteTimes){
                var id = favoiteTimeId[favoiteTimes[i]];
                var item = favoiteListData[id];
                if(!id || !item) continue;
                var users = [];
                for(var u in item.users){
                    if(item.users[u].name){
                        var uname=trim(item.users[u].name);
                        var uurl = item.users[u].url;
                        uname = '<a class="-ns-nt-list-detail-user-name" href="'+formatUrl(uurl)+'?locale_override=1&fr=newscript" target="_blank">'+uname+'</a>';
                        users.push(uname);
                    }
                }
                //拼接作者
                users = users.join(",");
                //拼接得分
                var ratings_score = lang("好评：")+item.good_ratings+"&nbsp;&nbsp;&nbsp;&nbsp;"+lang("一般：")+item.ok_ratings+"&nbsp;&nbsp;&nbsp;&nbsp;"+lang("差评：")+item.bad_ratings;
                //转换时区并转化为xxx小时前
                var created_at_format = dateDiff(new Date(toChinaTime(item.created_at)).getTime()-timezone*3600*1000);
                if(!isCNUi){
                    var cfm = created_at_format.match(/(\d+)(.*)/);
                    if(cfm !== null && cfm.length > 2){
                        created_at_format = cfm[1] + lang(cfm[2]);
                    }
                }

                //.replace(/(\d+).*/, "$1bbb")
                //转换时区
                var created_at = new Date(toChinaTime(item.created_at));
                created_at = created_at.setHours(created_at.getHours()-timezone);
                created_at = formatTimestamp(created_at);
                //标题
                var title = item.name;
                if(scriptSyncData[item.id] && scriptSyncData[item.id].code_updated_at > item.code_updated_at){
                    title = scriptSyncData[item.id].name;
                }
                //替换模板中的变量
                var itemTpl = scriptListTpl.replace(/\{\{name\}\}/g, htmlencode(title)).replace("{{users.name}}", users).replace("{{created_at_format}}", created_at_format)
                    .replace("{{description}}", htmlencode(item.description)).replace("{{created_at}}", created_at).replace("{{index}}", "").replace("{{fav}}", "-fav")
                    .replace(/\{\{url\}\}/g, formatUrl(item.url)).replace("{{code_url}}", item.code_url).replace("{{version}}", item.version).replace("{{in}}", 'favorite')
                    .replace("{{total_installs}}", item.total_installs).replace("{{ratings_score}}", ratings_score).replace(/\{\{id\}\}/g, item.id)
                    .replace("{{hide_read}}", "-ns-nt-hide").replace("{{hide_new}}", "-ns-nt-hide").replace("{{created_at_origin}}", item.created_at)
                    .replace("{{hide_icon}}", "").replace("{{favorite_text}}", lang("取消收藏")).replace("{{locale}}", item.locale).replace("{{langui}}", langui)
                    .replace("{{hide_favorite}}", "").replace(/\{\{favorited\}\}/gi, "");
                //翻译
                itemTpl = transTpl(itemTpl);
                //根据模板拼接新脚本列表
                scriptListHtml += itemTpl;
            }
            if(!scriptListHtml) scriptListHtml = noListTips.replace(lang("暂无新脚本"),lang("暂无收藏"));
            $("#_ns_nt_favorite_list_ul").html(favoriteListHtml + scriptListHtml);
        }
        //收藏返回事件
        var favoriteBackEvent = function(){
            $(".-ns-nt-list-setting").hide();
            $(".-ns-nt-favorite").hide();
            $(".-ns-nt-list").show();
            $("#_ns_favoite_btn").html(lang("我的收藏"));
            $("#_ns_setting_btn").html(lang("设置"));
            return false;
        };
        //我的收藏点击
        $("#_ns_favoite_btn").on("click", function(){
            //兼容某些页面或插件强行把功能型a链接转为新窗口
            if($(this).attr("target") && $(this).attr("target").indexOf("blank")!==-1) $(this).attr("target", "_self");
            if($(".-ns-nt-favorite").is(":hidden")){
                //渲染列表
                renderFavoriteList();
                //重新绑定列表事件
                bindListEvents();
                //重新绑定返回事件
                $("#_ns_nt_favorite_back").off('click', favoriteBackEvent)
                    .on("click", favoriteBackEvent);
                $(".-ns-nt-list").hide();
                $(".-ns-nt-list-setting").hide();
                $(".-ns-nt-favorite").show();
                $(this).html('<span style="color:red">'+lang("我的收藏")+'<span>');
                $("#_ns_setting_btn").html(lang("设置"));
            } else {
                favoriteBackEvent();
            }
            return false;
        });
        //收藏滚动
        $(".-ns-nt-favorite").on("scroll", function(){
            var me = $(this);
            var mewidth = me.width();
            var backTitle = $(".-ns-nt-list-back-title");
            var _ns_nt_placeholder = $("#_ns_nt_placeholder");
            if(me.scrollTop()>0){
                if(_ns_nt_placeholder.length ===0){
                    //兼容某种高度导致无法滚动问题
                    var placeholder = '<li id="_ns_nt_placeholder"><div class="-ns-nt-list-title-wrapper">&nbsp;</div></li>';
                    backTitle.after(placeholder);
                }
                var scrollbarWidth = me[0].offsetWidth - me[0].scrollWidth;
                backTitle.css({position:"fixed", width:(mewidth-scrollbarWidth)+"px"});
            } else {
                if(_ns_nt_placeholder.length > 0) _ns_nt_placeholder.remove();
                backTitle.css({position:"static", width:mewidth+"px"});
            }
        });

        //// 设置事件 ////
        //设置成功提示
        var show_setting_tips = function(type, tips, delay){
            type = type || "";
            tips = tips || lang("设置成功");
            delay = delay || 2000;
            var successtip = $("._ns_nt_setting_tips[data-type='"+type+"']");
            successtip.html(!isCNUi ? "<br />"+tips : tips);
            setTimeout(function(){successtip.html("");}, delay);
        }
        //开启浏览器通知
        var _ns_nt_setting_show_browser_notice = GM_getValue("_ns_nt_setting_show_browser_notice");
        _ns_nt_setting_show_browser_notice = typeof _ns_nt_setting_show_browser_notice === "undefined" ? 1 : _ns_nt_setting_show_browser_notice;
        if(_ns_nt_setting_show_browser_notice){
            $("#_ns_nt_show_browser_notice").prop("checked", true);
        }
        $("#_ns_nt_show_browser_notice").on("change", function(){
            if($(this).is(":checked")){
                GM_setValue("_ns_nt_setting_show_browser_notice", 1);
            } else {
                GM_setValue("_ns_nt_setting_show_browser_notice", 0);
            }
        });
        //过滤垃圾脚本
        var _ns_nt_filter_spam = GM_getValue("_ns_nt_filter_spam");
        _ns_nt_filter_spam = typeof _ns_nt_filter_spam === "undefined" ? 1 : _ns_nt_filter_spam;
        if(_ns_nt_filter_spam){
            $("#_ns_nt_filter_spam").prop("checked", true);
        }
        $("#_ns_nt_filter_spam").on("change", function(){
            if($(this).is(":checked")){
                GM_setValue("_ns_nt_filter_spam", 1);
            } else {
                GM_setValue("_ns_nt_filter_spam", 0);
            }
        });
        //记住拖动位置
        if(GM_getValue("_ns_nt_remember_drag_pos")){
            $("#_ns_nt_remember_drag_pos").prop("checked", true);
        }
        $("#_ns_nt_remember_drag_pos").on("change", function(){
            if($(this).is(":checked")){
                GM_setValue("_ns_nt_remember_drag_pos", 1);
            } else {
                GM_setValue("_ns_nt_remember_drag_pos", 0);
            }
        });
        //监听哪个语言的脚本
        if(langVal == "zh-CN"){
            $("#_ns_nt_lang_zh").prop("checked", true);
        }else if(langVal == "en"){
            $("#_ns_nt_lang_en").prop("checked", true);
        }else{
            $("#_ns_nt_lang_all").prop("checked", true);
        }
        $("input[name=_ns_nt_lang]").on("change", function(){
            var thisval = $(this).val();
            GM_setValue("_ns_nt_lang", thisval);
            show_setting_tips("lang", lang("设置成功，刷新页面后生效"));
        });
        //界面显示语言
        if(langui == "zh-CN"){
            $("#_ns_nt_langui_zh").prop("checked", true);
        }else{
            $("#_ns_nt_langui_en").prop("checked", true);
        }
        $("input[name=_ns_nt_langui]").on("change", function(){
            var thisval = $(this).val();
            GM_setValue("_ns_nt_langui", thisval);
            show_setting_tips("langui", lang("设置成功，刷新页面后生效"));
        });
        //开启收藏功能
        if(showFavorite){
            $("#_ns_favoite_btn").css("display", "inline");
            $("#_ns_nt_show_favorite").prop("checked", true);
        }
        $("#_ns_nt_show_favorite").on("change", function(){
            if($(this).is(":checked")){
                GM_setValue("_ns_nt_show_favorite", 1);
                //_ns_favoite_btn顶部导航我的收藏，-ns-nt-favorited标记为收藏的星标 -ns-nt-list-detail-bottom-favorite收藏/取消收藏
                $("#_ns_favoite_btn, .-ns-nt-favorited, .-ns-nt-list-detail-bottom-favorite").css("display", "inline");
            } else {
                GM_setValue("_ns_nt_show_favorite", 0);
                $("#_ns_favoite_btn, .-ns-nt-favorited, .-ns-nt-list-detail-bottom-favorite").hide();
            }
        });
        //检查频率
        var _ns_nt_setting_check_freq = GM_getValue("_ns_nt_setting_check_freq");
        _ns_nt_setting_check_freq = typeof _ns_nt_setting_check_freq === "undefined" ? 'always' : _ns_nt_setting_check_freq;
        $("input[name=_ns_nt_check_freq][value="+_ns_nt_setting_check_freq+"]").prop("checked", true);

        var _ns_nt_setting_check_freq_minute = GM_getValue("_ns_nt_setting_check_freq_minute");
        _ns_nt_setting_check_freq_minute = typeof _ns_nt_setting_check_freq_minute === "undefined" ? 5 : _ns_nt_setting_check_freq_minute;
        $("#_ns_nt_check_freq_minute").val(_ns_nt_setting_check_freq_minute);

        $("#_ns_nt_check_freq_minute").on("focus", function(){
            $("#_ns_nt_check_freq_by_minute").prop("checked", true);
        });
        $("#_ns_nt_check_freq_minute").on("change keyup", function(){
            var me = $(this);
            var val = parseInt(me.val());
            me.val(val?val:5);
        });
        $("#_ns_nt_check_freq_minute").on("blur", function(){
            GM_setValue("_ns_nt_setting_check_freq_minute", $(this).val());
        });
        $("input[name=_ns_nt_check_freq]").on("change", function(){
            GM_setValue("_ns_nt_setting_check_freq", $(this).val());
        });

        //域名黑名单
        var _ns_nt_setting_domain_black = GM_getValue("_ns_nt_setting_domain_black");
        _ns_nt_setting_domain_black = typeof _ns_nt_setting_domain_black === "undefined" ? "" : _ns_nt_setting_domain_black;
        if(_ns_nt_setting_domain_black){
            $(".-ns-nt-list-setting-domain-black").val(_ns_nt_setting_domain_black);
        }
        $(".-ns-nt-list-setting-domain-black").on("blur", function(){
            var me = $(this);
            var thisval = me.val();
            var domains = thisval.split(/\r*?\n|\r/);
            for(var j in domains){
                if(!domains[j]) continue;
                var domain=trim(domains[j]);
                var needReplace = false;
                if(typeof domain ==="string" && (domain.indexOf("http://")!==-1 || domain.indexOf("https://")!==-1)){
                    domain=domain.replace(/http:\/\//i, "").replace(/https:\/\//i, "");
                    needReplace = true;
                }
                if(typeof domain ==="string" && domain.indexOf("/")){
                    domain = domain.split("/")[0];
                    needReplace = true;
                }
                if(typeof domain ==="string" && domain.indexOf("?")){
                    domain = domain.split("?")[0];
                    needReplace = true;
                }
                if(needReplace){
                    thisval = thisval.replace(domains[j], domain);
                }
            }
            me.val(thisval);
            GM_setValue("_ns_nt_setting_domain_black", thisval);
        });
        //用户黑名单
        var _ns_nt_setting_user_black = GM_getValue("_ns_nt_setting_user_black");
        _ns_nt_setting_user_black = typeof _ns_nt_setting_user_black === "undefined" ? "" : _ns_nt_setting_user_black;
        if(_ns_nt_setting_user_black){
            $(".-ns-nt-list-setting-user-black").val(_ns_nt_setting_user_black);
        }
        $(".-ns-nt-list-setting-user-black").on("blur", function(){
            GM_setValue("_ns_nt_setting_user_black", $(this).val());
        });
        //标题关键词黑名单
        var _ns_nt_setting_keyword_black = GM_getValue("_ns_nt_setting_keyword_black");
        _ns_nt_setting_keyword_black = typeof _ns_nt_setting_keyword_black === "undefined" ? "" : _ns_nt_setting_keyword_black;
        if(_ns_nt_setting_keyword_black){
            $(".-ns-nt-list-setting-keyword-black").val(_ns_nt_setting_keyword_black);
        }
        $(".-ns-nt-list-setting-keyword-black").on("blur", function(){
            GM_setValue("_ns_nt_setting_keyword_black", $(this).val());
        });

        //// 导航栏事件 ////
        //设置返回事件
        var settingBackEvent = function(){
            $(".-ns-nt-list-setting").hide();
            $(".-ns-nt-favorite").hide();
            $(".-ns-nt-list").show();
            $("#_ns_setting_btn").html(lang("设置"));
            $("#_ns_favoite_btn").html(lang("我的收藏"));
            return false;
        }
        //点击设置
        $("#_ns_setting_btn").on("click", function(){
            if($(".-ns-nt-list-setting").is(":hidden")){
                $(".-ns-nt-list").hide();
                $(".-ns-nt-favorite").hide();
                $(".-ns-nt-list-setting").show();
                $(this).html('<span style="color:red">'+lang("设置")+'<span>');
                $("#_ns_favoite_btn").html(lang("我的收藏"));
            } else {
                settingBackEvent();
            }
            return false;
        });
        //点击设置返回
        $("#_ns_setting_back_btn").on("click", settingBackEvent);

        //展开
        $("#_ns_fold_btn").on("click", function(){
            var wrapper = listWrapper();
            if(trim(wrapper) == ".-ns-nt-list-setting") return;
            $(wrapper+".-ns-nt-list-title-wrapper").each(function(){
                var me = $(this);
                var metext = me.text();
                if(metext==lang("更多")||metext==lang("返回")||metext==lang("暂无新脚本")||metext==lang("暂无收藏")) return true;
                $(this).children().css("font-weight", "bold");
                $(this).next().show();
            });
            $(wrapper+"#_ns_nt_list_more").css("font-weight", "normal");

            //鼠标停留2秒，获取脚本信息
            getScriptInfoByHover();
        });
        //折叠
        $("#_ns_unfold_btn").on("click", function(){
            var wrapper = listWrapper();
            if(trim(wrapper) == ".-ns-nt-list-setting") return;
            $(wrapper+".-ns-nt-list-title-wrapper").each(function(){
                $(this).children().css("font-weight", "normal");
                $(this).next().hide();
            });

            //取消对鼠标停留的监听
            cancelGetScriptInfoByHover();
        });
        //全部已读
        $("#_ns_allread_btn").on("click", function(){
            if($(".-ns-nt-btn").html()==="0" && $(".-ns-nt-btn-add-new").html()==="") return;
            var reads = GM_getValue("_ns_nt_reads")||{};
            var _ns_nt_last_news_reads = GM_getValue("_ns_nt_last_news_reads")||{};
            $(".-ns-nt-list .-ns-nt-list-title-wrapper").each(function(){
                var me = $(this);
                //设置已读状态
                me.find(".-ns-nt-list-title-dot").addClass("-ns-nt-hide");
                me.find(".-ns-nt-list-title-new-flag").addClass("-ns-nt-hide");
                var id= me.attr("data-id");
                if(id) {
                    reads[id] = 1;

                    //设置上次新脚本已读
                    if(typeof _ns_nt_last_news_reads[id] !== "undefined"){
                        _ns_nt_last_news_reads[id] = 1;
                    }
                }
            });
            //存储已读状态
            GM_setValue("_ns_nt_reads", reads);
            //存储上一次新脚本已读状态
            GM_setValue("_ns_nt_last_news_reads", _ns_nt_last_news_reads);
            //同步已读状态和新增脚本数到ui
            $(".-ns-nt-btn").html(0);
            $(".-ns-nt-btn-add-new").html("");

            newcount = 0;
        });

        //免打扰模式提示弹窗
        setTimeout(function(){
            var _ns_nt_silent_mode_tips_off = GM_getValue("_ns_nt_silent_mode_tips_off") || 0;
            if(!_ns_nt_silent_mode_tips_off){
                var tipsImg = GM_getResourceURL("r1_silent_mode_tips");
                $("body").append(`<div id="_ns_nt_silent_mode_tips" style="position: fixed;top:`+parseFloat(_ns_nt_wrapper.css("top"))+`px;left:`+parseFloat(_ns_nt_wrapper.css("left"))+`px;z-index:`+(parseInt(_ns_nt_wrapper.css("z-index"))+1)+`;width: 400px;background: #fff;border: 1px solid #aaa;border-radius: 5px;box-shadow: 1px 1px 6px rgba(0,0,0,.2);padding:10px;display:none;">
<div style="text-align:left;">
<p style="margin:14px 0;font-size:14px;color:#333;color:green;">`+lang("设置成功，已进入免打扰模式")+`</p>
<p style="margin:14px 0;font-size:14px;color:#333;">`+lang("免打扰模式下，不显示提示图标，仅在有新脚本时才显示，也可在菜单中退出免打扰模式，见下图：")+`</p>
<a href="`+tipsImg+`" target="_blank"><img border="0" style="max-width:100%;" src="`+tipsImg+`" /></a>
</div>
<div style="padding:14px 0;text-align:left;font-size:14px;"><label style="display:inline;font-weight: normal;cursor:pointer;"><input id="_ns_nt_silent_mode_tips_off" type="checkbox" value="1" style="cursor:pointer;">`+lang("不再提示")+`</label></div>
<div style="text-align: center;"><button id="_ns_nt_silent_mode_tips_close" style="background: #4395ff;color: #fff;text-align: center;border: 1px solid #fff;border-radius: 5px;padding: 4px 10px;cursor:pointer;"> `+lang("关 闭")+` </button></div>
</div>`);
                $("#_ns_nt_silent_mode_tips_off").on("change", function(){
                    if($(this).is(":checked")){
                        GM_setValue("_ns_nt_silent_mode_tips_off", 1);
                    } else {
                        GM_setValue("_ns_nt_silent_mode_tips_off", 0);
                    }
                });
                $("#_ns_nt_silent_mode_tips_close").on("click", function(){
                    $("#_ns_nt_silent_mode_tips").hide();
                });
            }
        });
        //显示免打扰模式提示
        var showSilentModeTips = function(delay){
            delay = delay || 0;
            var _ns_nt_silent_mode_tips_off = GM_getValue("_ns_nt_silent_mode_tips_off") || 0;
            if(_ns_nt_silent_mode_tips_off) return;
            $("#_ns_nt_silent_mode_tips").css({top:parseFloat(_ns_nt_wrapper.css("top")),left:parseFloat(_ns_nt_wrapper.css("left")),zIndex:(parseInt(_ns_nt_wrapper.css("z-index"))+1)}).show();
            if(delay) setTimeout(function(){$("#_ns_nt_silent_mode_tips").hide();}, delay);
        }
        //免打扰模式
        var silentModeMenu = null;
        //删除菜单
        var delSilentModeMenu = function(){if(silentModeMenu) GM_unregisterMenuCommand(silentModeMenu);}
        //创建菜单
        var createSilentModeMenu = function(){
            silentModeMenu = GM_registerMenuCommand(lang("退出免打扰模式"), function(){
                $("#_ns_silent_mode_btn").html(lang("免打扰模式"));
                $(".-ns-nt-btn-wrapper").show();
                GM_setValue("_ns_nt_silent_mode", "off");
                delSilentModeMenu();
            });
        }
        //如果开启免打扰模式，则不显示提示框
        var _ns_nt_silent_mode =  GM_getValue("_ns_nt_silent_mode") || "off";
        if(_ns_nt_silent_mode == "on"){
            $(".-ns-nt-btn-wrapper").hide();
            createSilentModeMenu();
            $("#_ns_silent_mode_btn").html("<b>"+lang("退出免打扰模式")+"</b>");
        } else {
            $(".-ns-nt-btn-wrapper").show();
        }
        //如果有新消息，则显示提示框
        if(newcount > 0){
            $(".-ns-nt-btn-wrapper").show();
        }
        //免打扰模式点击事件
        $("#_ns_silent_mode_btn").on("click", function(){
            var me = $(this);
            if(me.text()==lang("免打扰模式")){
                $(".-ns-nt-btn-wrapper").hide();
                $(".-ns-nt-wrapper").trigger("mouseleave");
                showSilentModeTips();
                GM_setValue("_ns_nt_silent_mode", "on");
                createSilentModeMenu();
            } else {
                $("#_ns_silent_mode_btn").html(lang("免打扰模式"));
                GM_setValue("_ns_nt_silent_mode", "off");
                delSilentModeMenu();
            }
        });

        //翻译文本
        /*if(langui != "zh-CN"){
            setTimeout(function(){
                //transLang();
                //for(var i in langMap){
                //    var target=$(".-ns-nt-wrapper, #_ns_nt_silent_mode_tips").find(":contains('"+i+"'):last");
                //    if(target.length > 0) transThis(target);
                //}
            });
        }*/

        //清除缓存点击事件
        $("#_ns_nt_clear_cache").on("click", function(){
            if(confirm(lang("当出现莫名其妙的错误时，可以尝试清除缓存；\u000d清除缓存将清除历史脚本记录，但设置和收藏的脚本不会清除；\u000d点击[确定]，将会清除缓存并重新加载页面\u000d点击[取消]，将取消本次操作\u000d你确定要继续清除吗？此操作不可恢复！"))){
                GM_deleteValue("_ns_nt_last_time"); //上次同步时间
                GM_deleteValue("_ns_nt_reads"); //已读列表
                GM_deleteValue("_ns_nt_last_news_reads"); //上次同步数据已读列表
                GM_deleteValue("_ns_nt_last_get_spam_time"); //上传同步垃圾脚本时间
                GM_deleteValue("_ns_nt_spam_scripts"); //垃圾脚本列表
                GM_deleteValue("_ns_nt_setting_check_freq_last_time"); //上次检查更新的时间
                GM_deleteValue("_ns_nt_store_data"); //历史脚本记录
                GM_deleteValue("_ns_nt_script_sync_data"); //动态同步的脚本信息记录
                location.href=location.href; //刷新页面
            }
        });

        //浏览器通知
        var is_show_browser_notice = GM_getValue("_ns_nt_setting_show_browser_notice");
        is_show_browser_notice = typeof is_show_browser_notice !== "undefined" ? is_show_browser_notice : 1;
        if(nscount > 0 && is_show_browser_notice){
            GM_notice(lang("您有")+" "+nscount+" "+lang("个新脚本哦，快去看看吧！"), lang("NewScript+提示您："));
        }

        //兼容某些页面或插件强行把功能型a连链转为新窗口
        $("#_ns_fold_btn,#_ns_unfold_btn,#_ns_allread_btn,#_ns_favoite_btn,#_ns_silent_mode_btn,#_ns_setting_btn,#_ns_nt_favorite_back,#_ns_setting_back_btn,#_ns_nt_clear_cache").on("click", function(){
            if($(this).attr("target") && $(this).attr("target").indexOf("blank")!==-1) $(this).attr("target", "_self");
        });

        //调用我的收藏数据更新
        setTimeout(function(){favoriteUpdate(netData);});

    }
    ///////// 渲染列表结束 renderScriptList ////////////


    //我的收藏数据更新
    var favoriteUpdate = function(netData){
        var favoiteData = GM_getValue("_ns_nt_favoite_list_data")||{};
        if(Object.keys(favoiteData).length==0) return;
        var needUpdate = false;
        for(var i in netData){
            if(typeof netData[i] !== "object") continue;
            var id = netData[i].id;
            if(!id) continue;
            if(netData[i].is_update && favoiteData[id]){
                needUpdate = true;
                favoiteData[id] = netData[i];
                favoiteData[id].is_new=0;
                favoiteData[id].is_update=0;
            }
        }
        if(needUpdate) GM_setValue("_ns_nt_favoite_list_data", favoiteData);
    }

    //动态获取脚本信息
    var getScriptInfo = function(title){
        if(!title.next().is(":hidden")){
            var scriptSyncData = GM_getValue("_ns_nt_script_sync_data")||{};
            var id = title.attr("data-id");
            var now = new Date().getTime();
            var setDetailData = function(data){
                var detail = title.next();
                if(data.name){
                    detail.find("td:contains('"+lang("标题：")+"')").next().html(data.name);
                    title.find(".-ns-nt-list-item-title").contents().filter(function(){return this.nodeType===3;})[0].textContent=data.name;
                }
                if(data.description){
                    detail.find("td:contains('"+lang("描述：")+"')").next().html(data.description);
                }
                if(data.version){
                    detail.find("td:contains('"+lang("版本：")+"')").next().html(data.version);
                }
                if(data.total_installs){
                    detail.find("td:contains('"+lang("安装：")+"')").next().html(data.total_installs+" "+lang("次"));
                }
                var score = detail.find("td:contains('"+lang("得分：")+"')").next();
                var scorehtml=score.html();
                if(data.good_ratings){
                    scorehtml = scorehtml.replace(new RegExp(lang("好评：")+"\\d+&nbsp;", "i"), lang("好评：")+data.good_ratings+"&nbsp;");
                    score.html(scorehtml);
                }
                if(data.ok_ratings){
                    scorehtml = scorehtml.replace(new RegExp(lang("一般：")+"\\d+&nbsp;", "i"), lang("一般：")+data.ok_ratings+"&nbsp;");
                    score.html(scorehtml);
                }
                if(data.bad_ratings){
                    scorehtml = scorehtml.replace(new RegExp(lang("差评：")+"\\d+$", "i"), lang("差评：")+data.bad_ratings+"");
                    score.html(scorehtml);
                }
            }
            //每10分钟同步一次
            if(scriptSyncData[id] && now - scriptSyncData[id].sync_time < 600000){
                setDetailData(scriptSyncData[id]);
                return;
            }
            var url = "https://greasyfork.org/"+langType+"/scripts/"+id+".json?locale_override=1";
            httpGet(url, function(data){
                if(!data) return;
                data = $.parseJSON(data);
                setDetailData(data);

                //存储同步数据
                var newData = {};
                newData.name = data.name;
                newData.description = data.description;
                newData.version = data.version;
                newData.total_installs = data.total_installs;
                newData.good_ratings = data.good_ratings;
                newData.ok_ratings = data.ok_ratings;
                newData.bad_ratings = data.bad_ratings;
                newData.code_updated_at = data.code_updated_at;
                newData.sync_time = now;
                scriptSyncData[id] = newData
                GM_setValue("_ns_nt_script_sync_data", scriptSyncData);
            });
        }
    }

    //全部展开时，当鼠标停留2秒，动态获取脚本信息
    var _ns_nt_tid = 0, _ns_nt_tid_cancel=0;
    var getScriptInfoByHover = function(){
        cancelGetScriptInfoByHover();
        $(listWrapper()+".-ns-nt-list-detail-wrapper").hover(function(){
            var me=$(this);
            _ns_nt_tid = setTimeout(function(){
                getScriptInfo(me.prev());
            }, 2000);
        }, function(){
            clearTimeout(_ns_nt_tid);
        });
        //10分钟后取消对鼠标停留的监听
        _ns_nt_tid_cancel = setTimeout(function(){cancelGetScriptInfoByHover();}, 600000);
    }
    //取消对鼠标停留的监听
    var cancelGetScriptInfoByHover = function(){
        $(listWrapper()+".-ns-nt-list-detail-wrapper").unbind("mouseenter").unbind("mouseleave");
        if(_ns_nt_tid_cancel) clearTimeout(_ns_nt_tid_cancel);
    }

    //是否允许的域名
    var isAllowDomain = function(domain){
        domain = domain || document.domain;
        var domains = GM_getValue("_ns_nt_setting_domain_black");
        if(!domains) return true;
        domains = domains.split(/\r*?\n|\r/);
        for(var j in domains){
            if(!domains[j]) continue;
            var domain2 = trim(domains[j]);
            if(domain == domain2){
                return false;
            }
        }
        return true;
    }

    //是否允许的用户
    var users=[],isAllowUser = function(user){
        if(users.length == 0){
            users = GM_getValue("_ns_nt_setting_user_black");
            if(!users){
                users=[]
            } else {
                users = users.split(/\r*?\n|\r/);
            }
        }
        if(users.length === 0) return true;
        for(var j in users){
            if(!users[j]) continue;
            var user2 = trim(users[j]);
            if(user == user2){
                return false;
            }
        }
        return true;
    }

    //是否允许的关键词
    var keywords=[],isAllowKeyword = function(str){
        if(keywords.length == 0){
            keywords = GM_getValue("_ns_nt_setting_keyword_black");
            if(!keywords){
                keywords=[]
            } else {
                keywords = keywords.split(/\r*?\n|\r/);
            }
        }
        if(keywords.length === 0) return true;
        for(var j in keywords){
            if(!keywords[j]) continue;
            var keyword = trim(keywords[j]);
            if(str.indexOf(keyword)!==-1){
                return false;
            }
        }
        return true;
    }

    //获取垃圾脚本列表，每4小时抓取一次
    var spamScripts = GM_getValue("_ns_nt_spam_scripts")||{};
    var getSpamScripts = function(callback, maxpage, page, trys){
        maxpage = maxpage || 2;
        page = page || 1;
        if(page > maxpage){
            //设定每天抓取一次
            var now = new Date();
            GM_setValue("_ns_nt_last_get_spam_time", now.setHours(now.getHours()+4, 0, 0, 0));
            //存储垃圾脚本
            GM_setValue("_ns_nt_spam_scripts", spamScripts);
            //开始抓取新脚本
            if(callback) callback();
            return;
        }
        //获取是否开启垃圾脚本过滤
        var _ns_nt_filter_spam = GM_getValue("_ns_nt_filter_spam");
        _ns_nt_filter_spam = typeof _ns_nt_filter_spam ==="undefined" ? 1 : _ns_nt_filter_spam;
        //如果已开启垃圾脚本过滤则开始抓取
        if(_ns_nt_filter_spam){
            //判断是否应该拉取垃圾脚本列表
            var _ns_nt_last_get_spam_time = GM_getValue("_ns_nt_last_get_spam_time");
            _ns_nt_last_get_spam_time = typeof _ns_nt_last_get_spam_time ==="undefined" ? 0 : _ns_nt_last_get_spam_time;
            var inTime = new Date().getTime() > _ns_nt_last_get_spam_time;
            if(callback || inTime){
                trys = trys || 1;
                //尝试3次后仍失败，则放弃，开始获取新脚本
                if(trys > 3){
                    //存储垃圾脚本
                    GM_setValue("_ns_nt_spam_scripts", spamScripts);
                    //回调
                    if(callback) callback();
                    return;
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://greasyfork.org/"+langType+"/moderator_actions?locale_override=1&page="+page,
                    timeout : 30000, //30s
                    onload: function(response) {
                        //获取操作日志数据
                        var logData = response.responseText;

                        ////过滤关键词 empty script， ad， ads， spam
                        logData = logData.split('<table class="text-content log-table">');
                        logData = logData[logData.length-1].split('<div role="navigation" aria-label="Pagination" class="pagination">')[0];
                        logData = "<table>" + logData;
                        logData = $(logData);
                        logData.find("td:contains('"+lang("脚本：")+"')").each(function(){
                            var me = $(this);
                            //跳过minified code类型的脚本
                            if(me.next().next().find(".possibly-long-text:contains('minified code')").length > 0){
                                //continue
                                return true;
                            }
                            var projectName = trim(me.text());
                            //把垃圾脚本存储到垃圾脚本黑名单
                            if(projectName.indexOf(lang("脚本："))!==-1){
                                spamScripts[projectName.replace(lang("脚本："), "")] = new Date().getTime();
                            }
                        });

                        //抓取下一页
                        getSpamScripts(callback, maxpage, ++page);
                    },
                    onerror : function(response){
                        //如果错误继续尝试
                        getSpamScripts(callback, maxpage, page, ++trys);
                        if(console && console.log) console.log('getSpamScripts.onerror', response, trys);
                    },
                    ontimeout : function(response){
                        //如果超时继续尝试
                        getSpamScripts(callback, maxpage, page, ++trys);
                        if(console && console.log) console.log('getSpamScripts.ontimeout', response, trys);
                    }
                });
            }
        } else {
            //如果未开启垃圾脚本过滤，则直接获取新脚本
            if(callback) callback();
        }
    }

    //垃圾清理，清除一些无效的存储，每天清理一次
    var clearGarbage = function(){
        var lastClearTime = GM_getValue("_ns_nt_last_clear_time") || 0;
        if(new Date().getTime() < lastClearTime){
           return;
        }
        try{
            //设定清理时间，每天清理一次
            GM_setValue("_ns_nt_last_clear_time", new Date().setHours(23, 59, 59, 0));

            //读取当前的脚本列表
            var storeData = GM_getValue("_ns_nt_store_data")||[];
            var storeScriptIds = {};
            for(var i in storeData){
                var item = storeData[i];
                if(item && item.id){
                    storeScriptIds[item.id]=1;
                }
            }
            //清理已读列表
            var reads = GM_getValue("_ns_nt_reads")||{};
            for(var j in reads){
                if(!storeScriptIds[j]){
                    delete reads[j];
                }
            }
            GM_setValue("_ns_nt_reads", reads);

            //清理7天前的垃圾脚本列表
            var spamScripts = GM_getValue("_ns_nt_spam_scripts")||{};
            var now = new Date().setHours(0,0,0,0);
            for(var s in spamScripts){
                if(now - spamScripts[s] > 7 * 86400000){
                    delete spamScripts[s];
                }
            }
            GM_setValue("_ns_nt_spam_scripts", spamScripts);
        }catch(e){
            if(console && console.log) console.log('clearGarbage', e);
        }
    }

    //开始执行
    if(isAllowDomain()){
        //初始化关键词黑名单，每行一个用户
        if(typeof GM_getValue("_ns_nt_setting_keyword_black")==="undefined"){
            GM_setValue("_ns_nt_setting_keyword_black", "捐卵\n供卵\n借卵\n代孕\n\代妈\n专业出黑科\n蹇猪猪\n包生男孩\n华纳网投开户\n网上赌被黑\n");
        }
        if(GM_getValue("_ns_nt_spam_scripts")){
            //如果已存储过垃圾脚本列表则直接获取新脚本，每天会自动更新一次垃圾脚本列表
            setTimeout(function(){
                //获取新脚本数据
                getNewScriptData(function(data){
                    //渲染脚本列表
                    renderScriptList(data);
                });
            });
            //后台获取并存储垃圾脚本列表
            setTimeout(function(){
                getSpamScripts();
            });
        } else {
            //如果没有存储过垃圾脚本列表(通常是第一次执行时)，则先查找垃圾脚本列表并存储
            setTimeout(function(){
                getSpamScripts(function(){
                    //获取新脚本数据
                    getNewScriptData(function(data){
                        //渲染脚本列表
                        renderScriptList(data);
                    });
                });
            });
        }
        //垃圾清理
        setTimeout(function(){
            clearGarbage();
        });
    }

    //////////////////////////////////// greasyfork.org /////////////////////////////////////
    //格式化greasyfork.org时区问题
    if(document.domain == "greasyfork.org" && location.href.indexOf("fr=newscript")!==-1){
        setTimeout(function(){
            //获取greasyfork的语言是否中文
            var grIsCN = location.href.indexOf("/zh-CN/")!==-1 ? true : false;
            //获取时区，比如-8
            var timezone = new Date().getTimezoneOffset()/60;
            //格式化时间及转换时区
            $("time").each(function(){
                var me = $(this);
                if(!me.attr("formated")){
                    var medate = me.attr("datetime").replace("T", " ").replace("+00:00", "").replace(/-/g, "/");
                    medate = new Date(medate);
                    medate = medate.setHours(medate.getHours()-timezone);
                    medate = formatTimestamp(medate);
                    me.html(medate);
                    me.attr("formated", 1);
                }
            });

            //脚本标题对象集合
            var allTitleObjs = [];

            //列表页（更多）
            if(location.href.indexOf("_w_list=1")!==-1){
                //给链接加fr=newscript
                $("article h2 a:first-child").each(function(){
                    var me = $(this);
                    var mehref=me.attr("href");
                    if(mehref.indexOf("fr=newscript")===-1){
                        me.attr("href", mehref + (mehref.indexOf("?")===-1?"?":"&") + "fr=newscript");
                    }
                    if(!me.attr("data-codea")){
                        me.attr("data-codea", 1).after('<a href="'+mehref+'/code?fr=newscript" style="float:right;font-weight:normal;font-size:16px">'+lang("查看代码", !grIsCN)+'</a>');
                    }
                    //列表标题标记垃圾脚本
                    allTitleObjs.push(me);
                });
            }

            //查看和代码标题标记垃圾脚本
            var stitle = $("header h2");
            if(stitle.length > 0){
                stitle.css("display", "inline");
                allTitleObjs.push(stitle);
            }

            //开始标记垃圾脚本
            if(allTitleObjs.length>0){
                $("head").append(`<style>
.-ns-nt-greasyfork-spam-flag-arrow{display:inline-block;color:red;position:relative;top:3px;left:3px;transform:rotate(-9deg);-ms-transform:rotate(9deg);-moz-transform:rotate(9deg);-webkit-transform:rotate(-9deg);-o-transform:rotate(9deg);}
.-ns-nt-greasyfork-spam-flag{font-size:12px;color:yellow;border-radius:20px;background:red;padding:0 4px;}
</style>`);
                var markSpam = function(by_way){
                    by_way = by_way || "by_title";
                    var spamFlags = {};
                    if(by_way == "by_title"){
                        spamFlags=GM_getValue("_ns_nt_spam_scripts");
                        if(!spamFlags || Object.keys(spamFlags).length === 0) return;
                    }
                    var doMark = function(item){item.after('<sup class="-ns-nt-greasyfork-spam-flag-arrow">←</sup><sup class="-ns-nt-greasyfork-spam-flag">'+lang("垃圾脚本", !grIsCN)+'</sup>');}
                    for(var i in allTitleObjs){
                        var item=allTitleObjs[i];
                        var marked=item.parent().find(".-ns-nt-greasyfork-spam-flag").length > 0;
                        if(!marked){
                            var title = trim(item.text());
                            if(by_way == "by_title"){
                                if(spamFlags[title]) doMark(item);
                            }
                            if(by_way == "by_keyword"){
                                if(!isAllowKeyword(title)) doMark(item);
                            }
                        }
                    }
                }
                //匹配标题
                markSpam("by_title");
                //匹配关键词
                setTimeout(function(){
                    markSpam("by_keyword");
                });
            }

            //给代码链接添加fr=newscript
            $("#script-links").find("a:contains('"+lang("代码",!grIsCN)+"'),a:contains('"+lang("信息",!grIsCN)+"'),a:contains('"+lang("历史版本",!grIsCN)+"'),a:contains('"+lang("反馈",!grIsCN)+"'),a:contains('"+lang("统计数据",!grIsCN)+"')").each(function(){
                var a = $(this);
                a.attr("href", a.attr("href")+"?fr=newscript");
            });

            //给列表链接添加fr=newscript
            var scriptIndexBtn = $(".scripts-index-link a");
            if(scriptIndexBtn.length > 0){
                scriptIndexBtn.attr("href", scriptIndexBtn.attr("href")+"?fr=newscript&_w_list=1");
            }

            //添加复制代码按钮
            if(location.href.indexOf("/code")!==-1 && $("#_w_copy_code").length===0 && $("#install-area").length > 0){
                $("#install-area").append('<a id="_w_copy_code" class="install-link" rel="nofollow" href="javascript:;" style="margin-left:12px">'+lang("复制代码", !grIsCN)+'</a>');
                $("#_w_copy_code").click(function(){
                    GM_setClipboard($(".prettyprint")[0].innerText);
                    var me = $(this);
                    me.html(lang("已复制到剪贴板", !grIsCN));
                    setTimeout(function(){
                        me.html(lang("复制代码", !grIsCN));
                    }, 1000);
                });
            }
        });
        //end setTimeout
    }
    //end domain if
})();