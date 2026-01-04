// ==UserScript==
// @name         什么值得买-营销号屏蔽器
// @namespace    http://blog.ywwzwb.pw/
// @version      1.14
// @description  smzdm user block 什么值得买  原创页面营销号屏蔽
// @author       ywwzwb
// @match        https://post.smzdm.com/*
// @match        https://zhiyou.smzdm.com/member/*
// @grant GM_xmlhttpRequest
// @grant GM.xmlhttpRequest
// @grant GM_setValue
// @grant GM.setValue
// @grant GM_getValue
// @grant GM.getValue
// @grant GM_listValues
// @grant GM.listValues
// @grant GM_deleteValue
// @grant GM.deleteValue
// @grant GM_addValueChangeListener
// @grant GM.addValueChangeListener
// @connect smzdm.com
// @downloadURL https://update.greasyfork.org/scripts/453622/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0-%E8%90%A5%E9%94%80%E5%8F%B7%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453622/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0-%E8%90%A5%E9%94%80%E5%8F%B7%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!GM_xmlhttpRequest) {
        GM_xmlhttpRequest = GM.xmlhttpRequest;
    }
    if (!GM_setValue) {
        GM_setValue = GM.setValue;
    }
    if (!GM_getValue) {
        GM_getValue = GM.getValue;
    }
    if (!GM_listValues) {
        GM_listValues = GM.listValues;
    }
    if (!GM_deleteValue) {
        GM_deleteValue = GM.deleteValue;
    }
    if (!GM_addValueChangeListener) {
        if (GM.addValueChangeListener) {
            GM_addValueChangeListener = GM.addValueChangeListener;
        } else {
            GM_addValueChangeListener = (gmKey, listener) => { };
        }
    }
    // css
    const customCSS = `
  .icon-block-left {
    width: 16px;
    height: 16px;
    fill: currentColor
  }
  .left-layer>div.J_block{
    height: auto;
    padding-bottom: 6px
  }
  .feed-grid-wrap #feed-main-list a.z-group-data.card-icon-with-block {
    width: 65px;
    padding-left: 0px;
    text-align: center;
  }
  .feed-grid-wrap #feed-main-list a.z-group-data.card-icon-with-block-btn {
    width: auto;
  }

  .icon-block-card {
    width: 16px;
    height: 16px;
    fill: currentColor;
    vertical-align: top;
    margin-top: 1px;
    margin-right: 5px;
  }
  .icon-block-homepage {
    width: 16px;
    height: 16px;
    fill: #e62828;
    vertical-align: top;
    margin-top: 5px;
    margin-right: 3px;
    margin-left: 5px;
  }
  a.block-homepage.focus-other {
    width:auto;
    margin-left:10px;
  }
  a.block-homepage>span {
    margin-right:5px;
    color:currentColor;
  }
  .block-setting-box-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,.5);
    z-index: 9999;
    display: none;
  }
  .block-setting-box {
    width: 80%;
    z-index: 10000;
    position: fixed;
    left: 10%;
    top: 10%;
    background-color: #fff;
  }
  .block-setting-box-head-close:hover {
    fill: #e62828
  }
  .block-setting-box-head-close {
    width: 32px;
    float: right;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .block-setting-box-head-title {
    font-size: 16px;
    color: #333;
    float: left;
  }
  .block-setting-box-head {
    height: 44px;
    line-height: 45px;
    padding: 0 14px;
    border-bottom: 1px solid #f5f5f5;
  }
  .block-user-ul {
    width:100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    border-bottom: 1px solid #f5f5f5;
  }
  .block-setting-box-content-li {
    float: left;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-right: 10px;
    width: calc(25% - 20px);
    height:92px;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, .2);
    border-radius: 4px;
  }
  .block-setting-box-content-li-user-left {
    float: left;
    width: 84px;
    height: 84px;
    margin-right: 14px;
    font-size: 0;
    text-align: center;
    overflow: hidden;
    margin-top: 5px;
    margin-left: 7px;
  }
  .block-setting-box-content-li-user-right {
    float: left;
    width: calc(100% - 105px);
    height: 80px;
  }
  .block-setting-box-content-li-user-avatar {
    border-radius: 100%;
    overflow: hidden;
    width: 100%;
    height: auto;
  }
  .block-setting-box-content-li-user-title {
    font-size: 14px;
    color: #333;
    line-height: 18px;
    height: 35px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-right: 4px;
  }
  .block-setting-box-content-li-user-block-btn {
    margin-top: 8px;
    margin-bottom: 8px;
    display: inline-block;
    line-height: 26px;
    border: 1px solid #fee4e4;
    text-align: center;
    width: 66px;
    color: #e62828;
    border-radius: 2px;
    background: #feecec;
  }
  .block-setting-box .pagenation-list-self {
    text-align: center;
    cursor: pointer;
    margin-bottom: 10px;
    margin-top: 10px;
    width:100%
  }
  .pagenation-list-self {
    font-size: 0;
  }

  .pagenation-list-self li {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 0 5px;
    color: #666;
    font-size: 14px;
    border-radius: 2px;
    background: #f7f7f7;
    overflow: hidden
  }

  .pagenation-list-self li a,.pagenation-list-self li span {
    display: block;
    width: 100%;
    height: 100%;
    color: #666;
  }

  .pagenation-list-self li.current,.pagenation-list-self li.current a,.pagenation-list-self li.page-number:hover,.pagenation-list-self li.page-turn:hover,.pagenation-list-self li a:hover {
    background-color: #e62828;
    color: #fff;
  }

  .pagenation-list-self li i {
    font-size: 12px;
  }
  #search-user{
    height: 24px;
    line-height: 24px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: #f5f5f5;
    border: 0;
    color: #333;
    padding: 2px 10px;
    border-radius: 4px;
    width: 100%;
  }
  .block-tab {
    float: left;
    display: inline;
    margin-left: 40px;
  }
  .block-tab-box{
    box-sizing: border-box;
    margin-top: 10px;
    padding: 0 10px;
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    border-bottom: 1px solid #f5f5f5;xie
    min-height:120px;
  }
  .block-setting-tab{
    display: inline;
    padding: 2px;
    cursor: pointer;
  }
  .block-setting-tab.active{
    border-bottom-width: 2px;
    border-bottom-style: solid;
    color: #e62828;
  }
  .block-keyword-item {
    display: inline-flex;
    border: 1px solid #e62828;
    margin: 2px;
    border-radius: 3px;
    cursor: default;
  }
  .block-keyword-item>span {
    padding: 2px 4px 2px 4px;
  }
  .block-keyword-item>svg {
    background: #e62828;
    width: 20px;
    cursor: pointer;
  }
  .block-keywork-new {
    display: inline-flex;
    border: 1px solid #e62828;
    margin: 2px;
    border-radius: 3px;
  }
  .block-keywork-new>input{
    border: 0;
    margin: 2px 4px 2px 4px;
    width:100px;
  }
  .block-keywork-new>div{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #e62828;
    width: 20px;
    cursor: pointer;
  }
  .block-keywork-new>div>i{
    color: white;
  }
  .tab-block-more-option-column {
    width: 50%;
  }
  .tab-block-more-option-item {
    width: 100%;
  }
  .tab-block-more-option-item {
    width: 100%;
    margin-bottom: 8px;
  }
  .tab-block-more-option-item>label {
    margin-left:4px;
  }
  .block-highlight {
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-color: red;
    color: red;
  }
  .block-tag-sticky {
    right: 0;
    top: 0;
    z-index: 2;
    position: absolute;
    background-color: gray;
    color: #fff;
    height: 18px;
    padding: 0 5px;
    border-radius: 2px;
    line-height: 19px;
    font-size: 12px;
  }
  .user-block-tag {
    overflow: hidden;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  `
    var styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerText = customCSS
    document.head.appendChild(styleSheet)
    // classes
    class BlockConfig {
        static BLOCK_ENABLE = "block_enable";
        static BLOCK_USER_KEYWORD = "block_user_keyword";
        static BLOCK_TITLE_KEYWORD = "block_title_keyword";
        static BLOCK_ZHONG_CE = "block_zhong_ce";
        static BLOCK_SHAI_WU = "block_shai_wu";
        static BLOCK_PING_CE = "block_ping_ce";
        static BLOCK_NOTE = "block_note";
        static BLOCK_MEDIA_ACCOUNT = "block_media_account";
        static BLOCK_SPAMMER_ACCOUNT = "block_spammer_account";
        static BLOCK_OFFICIAL_ACCOUNT = "block_official_account";
        static BLOCK_MERCHANT_ACCOUNT = "block_merchant_account";
        static BLOCK_USER_DESC_KEYWORD = "block_user_desc_keyword";
        static BLOCK_ANONYMOUS = "block_anonymous";
        static BLOCK_TAG = "block_tag";
        static BLOCK_CATETORY = "block_category";
        #config;
        #gmKey;
        /**
         *
         * @param {string} gmKey
         * @param {(newData:Map<string, boolean>) => void} onChange
         * @returns
         */
        constructor(gmKey, onChange) {
            this.#gmKey = gmKey;
            this.#config = new Map();
            for (const key of BlockConfig.allConfigKeyNames()) {
                // 默认全部启用
                this.#config.set(key, true);
            }
            let config = GM_getValue(gmKey);
            if (config != undefined) {
                Object.entries(config).forEach((item) => {
                    this.#config.set(item[0], item[1]);
                });
                this.#save();
            }
            GM_addValueChangeListener(gmKey, (key, oldValue, newValue, remote) => {
                if (key != gmKey) {
                    return;
                }
                if (!remote) {
                    return;
                }
                Object.entries(newValue).forEach((item) => {
                    this.#config.set(item[0], item[1]);
                });
                onChange(this.#config);
            });
        }
        /**
         * 保存配置
         * @param {string} key 配置的 key
         * @param {boolean} value 配置值
         */
        saveConfig(key, value) {
            this.#config.set(key, value);
            this.#save();
        }
        /**
         * 使用key 读取配置
         * @param {string} key
         */
        getConfig(key) {
            return this.#config.get(key) == true;
        }
        /**
         * 获取配置 key 的描述
         * @param {*} key 配置的key
         * @returns {string} 返回描述
         */
        static getConfigKeyName(key) {
            const keyNames = new Map([
                [BlockConfig.BLOCK_ENABLE, "屏蔽总开关"],
                [BlockConfig.BLOCK_ZHONG_CE, "屏蔽众测"],
                [BlockConfig.BLOCK_SHAI_WU, "屏蔽晒物"],
                [BlockConfig.BLOCK_PING_CE, "屏蔽评测"],
                [BlockConfig.BLOCK_MEDIA_ACCOUNT, "屏蔽媒体号"],
                [BlockConfig.BLOCK_SPAMMER_ACCOUNT, "屏蔽营销号"],
                [BlockConfig.BLOCK_OFFICIAL_ACCOUNT, "屏蔽值得买官方号"],
                [BlockConfig.BLOCK_MERCHANT_ACCOUNT, "屏蔽运营号"],
                [BlockConfig.BLOCK_NOTE, "屏蔽笔记"],
                [BlockConfig.BLOCK_USER_KEYWORD, "按用户关键字屏蔽"],
                [BlockConfig.BLOCK_USER_DESC_KEYWORD, "按用户签名关键字屏蔽"],
                [BlockConfig.BLOCK_TITLE_KEYWORD, "按标题关键字屏蔽"],
                [BlockConfig.BLOCK_ANONYMOUS, "屏蔽匿名文章"],
                [BlockConfig.BLOCK_TAG, "按话题屏蔽"],
                [BlockConfig.BLOCK_CATETORY, "按分类屏蔽"]]);
            return keyNames.get(key);
        }
        /**
         * 获取所有的配置 key
         * @returns {Array<string>} key 数组
         */
        static allConfigKeyNames() {
            return [
                BlockConfig.BLOCK_ENABLE,
                BlockConfig.BLOCK_USER_KEYWORD,
                BlockConfig.BLOCK_TITLE_KEYWORD,
                BlockConfig.BLOCK_ZHONG_CE,
                BlockConfig.BLOCK_SHAI_WU,
                BlockConfig.BLOCK_PING_CE,
                BlockConfig.BLOCK_NOTE,
                BlockConfig.BLOCK_MEDIA_ACCOUNT,
                BlockConfig.BLOCK_SPAMMER_ACCOUNT,
                BlockConfig.BLOCK_OFFICIAL_ACCOUNT,
                BlockConfig.BLOCK_MERCHANT_ACCOUNT,
                BlockConfig.BLOCK_USER_DESC_KEYWORD,
                BlockConfig.BLOCK_ANONYMOUS,
                BlockConfig.BLOCK_TAG,
                BlockConfig.BLOCK_CATETORY,
            ];
        }
        get enable() {
            return this.#config.get(BlockConfig.BLOCK_ENABLE) == true;
        }
        get blockZhongce() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_ZHONG_CE) == true;
        }
        get blockShaiwu() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_SHAI_WU) == true;
        }
        get blockPingce() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_PING_CE) == true;
        }
        get blockMediaAcount() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_MEDIA_ACCOUNT) == true;
        }
        get blockSpammer() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_SPAMMER_ACCOUNT) == true;
        }
        get blockOfficial() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_OFFICIAL_ACCOUNT) == true;
        }
        get blockMerchant() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_MERCHANT_ACCOUNT) == true;
        }
        get blockNote() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_NOTE) == true;
        }
        get blockUserKeyword() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_USER_KEYWORD) == true;
        }
        get blockTitleKeyword() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_TITLE_KEYWORD) == true;
        }
        get blockUserDescKeyword() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_USER_DESC_KEYWORD) == true;
        }
        get blockAnonymous() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_ANONYMOUS) == true;
        }
        get blockTag() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_TAG) == true;
        }
        get blockCategory() {
            return this.enable && this.#config.get(BlockConfig.BLOCK_CATETORY) == true;
        }
        // private:
        #save() {
            let object = {};
            for (const [key, val] of this.#config) {
                object[key] = val;
            }
            GM_setValue(this.#gmKey, object);
        }
    }
    class KeywordBlockList {
        #gmkey;
        #keywords;
        /**
         * create block list
         * @param {string} gmKey
         * @param {(newData)=>void} onChange
         */
        constructor(gmKey, onChange) {
            this.#gmkey = gmKey;
            this.#keywords = new Set(GM_getValue(gmKey, []));
            GM_addValueChangeListener(gmKey, (key, oldValue, newValue, remote) => {
                if (key != gmKey) {
                    return;
                }
                if (!remote) {
                    return;
                }
                this.#keywords = new Set(newValue);
                onChange(this.#keywords);
            });
        }
        /**
         * add keyword
         * @param {string} keyword
         * @returns true if keyword is not exist before
         */
        push(keyword) {
            if (keyword.length == 0) {
                return false;
            }
            if (this.#keywords.has(keyword)) {
                return false;
            }
            this.#keywords.add(keyword);
            this.#save();
            return true;
        }
        /**
         * remove keyword
         * @param {string} keyword
         * @returns true if keyword exist and delete
         */
        delete(keyword) {
            if (!this.#keywords.has(keyword)) {
                return false;
            }
            this.#keywords.delete(keyword);
            this.#save();
            return true;
        }
        /**
         * test string contain any keyword
         * @param {string} str
         */
        test(str) {
            if (!str || str.length == 0) {
                return "";
            }
            const lowerStr = str.toLowerCase();
            for (const keyword of this.#keywords) {
                if (lowerStr.indexOf(keyword.toLowerCase()) >= 0) {
                    return keyword;
                }
            }
            return "";
        }
        get keywordList() {
            return this.#keywords
        }
        // private:
        #save() {
            GM_setValue(this.#gmkey, Array.from(this.#keywords));
        }
    }
    class CategoryBlockList {
        #gmkey;
        #categories;
        #articleCategories;
        /**
         * create block list
         * @param {string} gmKey
         * @param {(newData)=>void} onChange
         */
        constructor(gmKey, onChange) {
            this.#gmkey = gmKey;
            this.#categories = new Set(GM_getValue(gmKey, []));
            this.#articleCategories = new Map();
            GM_addValueChangeListener(gmKey, (key, oldValue, newValue, remote) => {
                if (key != gmKey) {
                    return;
                }
                if (!remote) {
                    return;
                }
                this.#categories = new Set(newValue);
                onChange(this.#categories);
            });
        }
        /**
         * add category
         * @param {string} category
         * @returns true if category is not exist before
         */
        push(category) {
            if (category.length == 0) {
                return false;
            }
            if (this.#categories.has(category)) {
                return false;
            }
            this.#categories.add(category);
            this.#save();
            return true;
        }
        /**
         * remove category
         * @param {string} category
         * @returns true if category exist and delete
         */
        delete(category) {
            if (!this.#categories.has(category)) {
                return false;
            }
            this.#categories.delete(category);
            this.#save();
            return true;
        }
        /**
         * test match any category
         * @param {[string]} categories
         */
        test(categories) {
            if (!categories || categories.length == 0) {
                return "";
            }
            // const lowerStr = str.toLowerCase();
            for (const category of categories) {
                if (this.#categories.has(category)) {
                    return category
                }
            }
            return "";
        }
        get categories() {
            return this.#categories
        }
        // private:
        #save() {
            GM_setValue(this.#gmkey, Array.from(this.#categories));
        }
        /**
         * 获取文章分类
         * @param {string} articleId
         * @param {(categories: [string])=>void} cb
         */
        getArticleCategories(articleId, cb) {
            let categories = this.#articleCategories.get(articleId);
            if (categories != undefined) {
                cb(categories);
                return
            }
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://post.smzdm.com/api/cards/detail/long_article',
                data: 'article_id=' + articleId,
                headers:
                    { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                responseType: 'json',
                onload: response => {
                    var data = response.response;
                    let categories = data.data.tongji_data.main_category.map((x) => x.title);
                    this.#articleCategories.set(articleId, categories);
                    cb(categories);
                },
                onerror: response => {
                    cb([]);
                }
            });
        }
    }
    class ManaualAction {
        static None = 0;
        static FORCE_BLOCK = 1;
        static FORCE_ALLOW = 2;
    }
    class UserInfo {
        manualOverrideAction = ManaualAction.None;
        /**
         *
         * @param {string} uid
         * @param {string} uname
         * @param {string} iconUrl
         * @param {int} manualOverrideAction
         * @param {boolean} isSpammer        营销号
         * @param {boolean} isOffical        官方号
         * @param {boolean} isMedia          媒体号
         * @param {boolean} isMerchant       运营号
         * @param {boolean} userDesc         用户签名
         * @param {number} lastRefreshTime   资料刷新时间
         *
         */
        constructor(uid, uname, iconUrl, manualOverrideAction = ManaualAction.None, isSpammer = false, isOffical = false, isMedia = false, isMerchant = false, userDesc = "", lastRefreshTime = 0) {
            this.uid = uid;
            this.uname = uname;
            this.iconUrl = iconUrl;
            this.manualOverrideAction = manualOverrideAction;
            this.isSpammer = isSpammer == true;
            this.isOffical = isOffical == true;
            this.isMedia = isMedia == true;
            this.isMerchant = isMerchant == true;
            this.userDesc = userDesc;
            this.lastRefreshTime = lastRefreshTime;

        }
        static parseFromUInfoObject(uinfo) {
            return new UserInfo(uinfo.uid,
                uinfo.uname,
                uinfo.uicon,
                uinfo.manual_override_action,
                uinfo.is_spammer == true,
                uinfo.is_offical == true,
                uinfo.is_media == true,
                uinfo.is_merchant == true,
                uinfo.user_desc == undefined ? "" : uinfo.user_desc,
                uinfo.last_refresh_time == undefined ? 0 : uinfo.last_refresh_time);
        }
        toUInfoObject() {
            return {
                "uid": this.uid,
                "uname": this.uname,
                "uicon": this.iconUrl,
                "manual_override_action": this.manualOverrideAction,
                "is_spammer": this.isSpammer,
                "is_offical": this.isOffical,
                "is_media": this.isMedia,
                "is_merchant": this.isMerchant,
                "user_desc": this.userDesc,
                "last_refresh_time": this.lastRefreshTime
            }
        }

    }
    class UserBlocker {
        #gmKey;
        #userKeywordBlockList;
        #userDescriptionKeyword;
        #userList
        /**
         *
         * @param {string} gmKey
         * @param {KeywordBlockList} userKeywordBlockList
         * @param {KeywordBlockList} userDescriptionKeyword
         * @param {(map:Map<string, UserInfo>)=>void} onChange
         */
        constructor(gmKey, userKeywordBlockList, userDescriptionKeyword, onChange) {
            this.#gmKey = gmKey;
            this.#userKeywordBlockList = userKeywordBlockList;
            this.#userDescriptionKeyword = userDescriptionKeyword;
            this.#userList = new Map();
            GM_addValueChangeListener(gmKey, (key, oldValue, newValue, remote) => {
                if (key != gmKey) {
                    return;
                }
                if (!remote) {
                    return;
                }
                this.#userList.clear();
                Object.entries(newValue).forEach((item) => {
                    this.#userList.set(item[0], UserInfo.parseFromUInfoObject(item[1]));
                })
                onChange(this.#userList);
            });
            let list = GM_getValue(gmKey);
            if (list != undefined) {
                Object.entries(list).forEach((item) => {
                    this.#userList.set(item[0], UserInfo.parseFromUInfoObject(item[1]));
                })
                return;
            }
            // convert v1 to v2
            let allKeys = GM_listValues();
            for (var uid of allKeys) {
                let oldUInfo = GM_getValue(uid);
                if (oldUInfo.oldUInfo.uid == undefined) {
                    continue;
                }
                let userInfo = new UserInfo(oldUInfo.uid,
                    oldUInfo.uname,
                    oldUInfo.uicon,
                    oldUInfo.flag
                );
                this.#userList.set(uid, userInfo)
                GM_deleteValue(uid);
            }
            this.#save();
        }

        /**
         * 屏蔽用户
         * @param {UserInfo} uinfo
         */
        manualBlockUser(uinfo) {
            uinfo.manualOverrideAction = ManaualAction.FORCE_BLOCK;
            this.saveUserInfo(uinfo);
        }
        /**
         * 解除屏蔽
         * @param {UserInfo} uinfo
         */
        manualUnblockUser(uinfo) {
            uinfo.manualOverrideAction = ManaualAction.FORCE_ALLOW;
            this.saveUserInfo(uinfo);
        }
        /**
         * 保存用户信息
         * @param {UserInfo} uinfo
         * @returns
         */
        saveUserInfo(uinfo) {
            if (uinfo == undefined) {
                return;
            }
            if (uinfo instanceof UserInfo) {
                this.#userList.set(uinfo.uid, uinfo);
                this.#save();
            }
        }
        /**
         * 检查用户是否屏蔽
         * @param {UserInfo} uinfo
         * @returns {boolean}
         */
        isUserBlock(uinfo) {
            uinfo = this.getUserInfo(uinfo.uid, uinfo);
            if (!blockConfig.enable) {
                // 屏蔽功能未启用
                return false;
            }
            if (uinfo.manualOverrideAction == ManaualAction.FORCE_ALLOW) {
                // force allow
                return false;
            }
            if (uinfo.manualOverrideAction == ManaualAction.FORCE_BLOCK) {
                // force block
                return true;
            }
            if (uinfo.isSpammer && blockConfig.blockSpammer) {
                // 营销号
                return true;
            }
            if (uinfo.isOffical && blockConfig.blockOfficial) {
                // 官方号
                return true;
            }
            if (uinfo.isMerchant && blockConfig.blockMerchant) {
                // 运营号
                return true;
            }
            if (uinfo.isMedia && blockConfig.blockMediaAcount) {
                // 媒体号
                return true;
            }
            if (blockConfig.blockUserKeyword && this.#userKeywordBlockList.test(uinfo.uname)) {
                //用户名屏蔽
                return true;
            }
            if (blockConfig.blockUserDescKeyword && uinfo.userDesc != "" && this.#userDescriptionKeyword.test(uinfo.userDesc)) {
                //用户签名屏蔽
                return true;
            }
            // TODO: 按其他信息阻断
            return false;
        }
        /**
         * 获取用户信息
         * @param {string} id
         * @param {UserInfo} defaultUserInfo
         * @returns {UserInfo}
         */
        getUserInfo(id, defaultUserInfo) {
            let uinfo = this.#userList.get(id);
            if (uinfo == undefined) {
                return defaultUserInfo;
            }
            return uinfo;
        }
        /**
         * 检查用户屏蔽原因
         * @param {UserInfo} uinfo
         * @returns {string[]}
         */
        getUserTag(uinfo) {
            let result = new Array()
            do {
                if (uinfo.manualOverrideAction == ManaualAction.FORCE_BLOCK) {
                    // force block
                    result.push("手动屏蔽");
                } else if (uinfo.manualOverrideAction == ManaualAction.FORCE_ALLOW) {
                    // force allow
                    result.push("手动放行");
                }
                if (uinfo.isSpammer) {
                    // 营销号
                    result.push("营销号");
                }
                if (uinfo.isOffical) {
                    // 官方号
                    result.push("官方号");
                }
                if (uinfo.isMerchant) {
                    // 运营号
                    result.push("运营号");
                }
                if (uinfo.isMedia) {
                    // 媒体号
                    result.push("媒体号");
                }
                if (this.#userKeywordBlockList.test(uinfo.uname).length > 0) {
                    //用户名屏蔽
                    result.push("用户关键字");
                }
                if (this.#userDescriptionKeyword.test(uinfo.userDesc).length > 0) {
                    //用户签名屏蔽
                    result.push("签名关键字");
                }
                // TODO: 按其他信息阻断
            } while (0);
            return result;
        }
        get list() {
            return this.#userList;
        }
        // private:
        #save() {
            let object = {};
            this.#userList.forEach((userInfo, uid) => {
                object[uid] = userInfo.toUInfoObject();
            });
            GM_setValue(this.#gmKey, object);
        }

    };

    let postBlockKeywordList = new KeywordBlockList("block_post_keyword_list", (newData) => {
        refreshKeywordBlockTab("tab-block-title-keyword", newData);
        refreshArticalList();
    });
    let userBlockKeywordList = new KeywordBlockList("block_user_keyword_list", (newData) => {
        refreshKeywordBlockTab("tab-block-user-keyword", newData);
        refreshArticalList();
    });
    let userDescriptionBlockKeywordList = new KeywordBlockList("block_user_desc_keyword_list", (newData) => {
        refreshKeywordBlockTab("tab-block-user-desc-keyword", newData);
        refreshArticalList();
    });
    let articleTagBlockKeywordList = new KeywordBlockList("article_tag_block_keyword_list", (newData) => {
        refreshKeywordBlockTab("tab-article-tag-block-keyword-list", newData);
        refreshArticalList();
    });

    let articleCategoryBlockKeywordList = new CategoryBlockList("article_category_block_list", (newData) => {
        refreshKeywordBlockTab("tab-article-category-block-list", newData);
        refreshArticalList();
    });
    let userList = new UserBlocker("user_list", userBlockKeywordList, userDescriptionBlockKeywordList, (newData) => {
        refreshUserBlockTab();
        refreshArticalList();
    });
    let blockConfig = new BlockConfig("block_config", (newData) => {
        refreshMoreOptionTab();
        refreshArticalList();
    });

    addSettingBtn();
    addSettingDiv();


    if (window.location.href.startsWith('https://post.smzdm.com/p/')) {
        // post
        addBlockInPost();
        return;
    }
    if (window.location.href.startsWith('https://zhiyou.smzdm.com/member/')) {
        // homepage
        addBlockInHomepage();
        return;
    }
    refreshArticalList();
    $(document).ajaxComplete(function (event, xhr, settings) {
        // 下拉加载时屏蔽
        if (settings.url.startsWith('https://post.smzdm.com/json_more')) {
            refreshArticalList();
        }
    });

    // 刷新界面, 屏蔽特定的文章
    function refreshArticalList() {
        $.each($('#feed-main-list>li'), function (index, obj) {
            // 恢复状态
            $(obj).show();
            //添加屏蔽按钮
            if ($(obj).find('.card-icon-with-block-btn').length == 0) {
                addBlockBtnTo(obj);
            }
            let titleEle = $(obj).find('.z-feed-title .z-feed-titleThree .titleOne a');
            var title = titleEle.text();
            let tags = new Set()
            let hide = false;
            let articleTags = getArticleTag(obj);
            // 屏蔽众测广告
            if (isZhongce(obj)) {
                tags.add("众测");
                hide |= blockConfig.blockZhongce;
            }
            // 屏蔽晒物
            if (isShaiwu(obj)) {
                tags.add("晒物");
                hide |= blockConfig.blockShaiwu;
            }
            // 屏蔽评测文章
            if (isPingce(obj)) {
                tags.add("评测");
                hide |= blockConfig.blockPingce;
            }
            // 屏蔽评测文章
            if (isNote(obj)) {
                tags.add("笔记");
                hide |= blockConfig.blockNote;
            }
            let articleBlockTag = articleTagBlockKeywordList.test(articleTags);
            if (articleBlockTag.length > 0) {
                tags.add("文章标签");
                hide |= blockConfig.blockTag;
            }

            // 屏蔽标题关键字
            let blockKeyword = postBlockKeywordList.test(title);
            if (blockKeyword.length > 0) {
                tags.add("标题关键字");
                hide |= blockConfig.blockTitleKeyword;
                titleEle.html(title.replace(blockKeyword, `<span class="block-highlight">${blockKeyword}</span>`));
            }
            // 查询屏蔽数据库
            var uinfo = getUserForLi(obj);
            if (!uinfo) {
                tags.add("匿名");
                hide |= blockConfig.blockAnonymous;
            }
            if (uinfo) {
                uinfo = userList.getUserInfo(uinfo.uid, uinfo);
                // 屏蔽媒体号
                if (isMediaAccountSimple(obj)) {
                    uinfo.isMedia = true;
                    userList.saveUserInfo(uinfo);
                    tags.add("媒体号");
                    hide |= blockConfig.blockMediaAcount;
                }
                // 屏蔽垃圾营销号
                // 从数据库中查找垃圾账号
                if (userList.isUserBlock(uinfo)) {
                    hide |= true;
                    userList.getUserTag(uinfo).forEach(userTag => tags.add(userTag));
                } else if (Date.now() - uinfo.lastRefreshTime > 30 * 24 * 60 * 60 * 1000) {
                    testSpammer(uinfo, block => {
                        if (block) {
                            $(obj).hide();
                            //autoNextPage();
                        } else {
                            userList.getUserTag(uinfo).forEach(userTag => tags.add(userTag));
                            if ($(obj).find('.card-icon-with-block-btn').length == 0) {
                                addBlockBtnTo(obj);
                            }
                            setBlockTagTo(obj, tags);
                        }
                    });
                }
            }
            if (blockConfig.blockCategory) {
                let articleId = $(obj).attr("data-article-id");
                articleCategoryBlockKeywordList.getArticleCategories(articleId, (categories) => {
                    if (articleCategoryBlockKeywordList.test(categories)) {
                        $(obj).hide();
                        //autoNextPage();
                    }
                });
            }
            if (hide) {
                $(obj).hide();
            }
            setBlockTagTo(obj, tags);
        });
        //autoNextPage();
    }
    function autoNextPage() {
        if ($('#feed-main-list>li:visible').length == 0) {
            // next page
            $("#J_feed_pagenation > li.page-turn.next-page").click();
        }
    }
    // 众测软文屏蔽
    function isZhongce(item) {
        return $(item).find('.z-tag-sticky').text().trim() == '众测';
    }
    // 晒物文章屏蔽
    function isShaiwu(item) {
        return $(item).find('.z-tag-sticky').text().trim() == '晒物';
    }
    // 评测文章屏蔽
    function isPingce(item) {
        return $(item).find('.z-tag-sticky').text().trim() == '评测';
    }
    // 笔记文章屏蔽
    function isNote(item) {
        return $(item).find('.z-tag-sticky').text().trim() == '笔记';
    }
    // 判断媒体账号, 简易版
    function isMediaAccountSimple(item) {
        var imgsrc = $(item).find('.feed-talent-ordinary').attr('src');
        return imgsrc && imgsrc.includes('media_medal');
    }
    function getArticleTag(item) {
        return $(item).find(".titleTwo").text().trim();
    }
    /**
     *
     * @param {UserInfo} uinfo
     * @param {(uinfo: UserInfo, success: boolean) => void} cb
     */
    function refreshUserFullInfo(uinfo, cb) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.smzdm.com/v1/users/info',
            data: 'user_smzdm_id=' + uinfo.uid,
            headers:
                { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            responseType: 'json',
            onload: response => {
                var data = response.response;
                if (parseInt(data.error_code) != 0) {
                    cb(uinfo, false);
                    return;
                }
                if (parseInt(data.data.role.is_media) != 0) {
                    // 媒体号
                    uinfo.isMedia = true;
                }
                if (parseInt(data.data.role.is_official) != 0) {
                    // 官方号
                    uinfo.isOffical = true;
                }
                if (parseInt(data.data.role.is_merchant) != 0) {
                    // 运营号
                    uinfo.isMerchant = true;
                }
                //   评论 / 文章 < 5 or 评论 == 0 则是营销号
                const articalsCount = parseInt(data.data.articles.article);
                const commentsCount = parseInt(data.data.comments);
                if (articalsCount > 0 && (commentsCount == 0 || commentsCount / articalsCount < 5)) {
                    uinfo.isSpammer = true;
                }
                uinfo.userDesc = data.data.meta.description;
                uinfo.lastRefreshTime = Date.now();
                userList.saveUserInfo(uinfo);

                cb(uinfo, true);
            },
            onerror: response => {
                cb(uinfo, false);
            }
        });
    }
    // 检查用户是否是垃圾账号
    /**
     *
     * @param {UserInfo} uinfo
     * @param {(block: boolean) => void} cb
     */
    function testSpammer(uinfo, cb) {
        if (userList.isUserBlock(uinfo)) {
            cb(true);
            return;
        }
        refreshUserFullInfo(uinfo, (uinfo, success) => {
            if (!success) {
                cb(false);
                return;
            }
            cb(userList.isUserBlock(uinfo));
        });
    }

    // 获取用户信息
    function getUserForLi(li_item) {
        var a = $(li_item).find('.z-feed-foot-l .z-avatar-name');
        var uname = a.text().trim();
        var href = a.attr('href');
        if (!href) {
            return null;
        }
        var uidResult = /\/(\d+)\/?$/.exec(href);
        if (!uidResult) {
            return null;
        }
        var uicon = $(li_item).find('.z-feed-foot-l .z-avatar-pic>img')
            .attr('src')
            .replace('-small.', '-middle.');
        return new UserInfo(uidResult[1], uname, uicon);
    }
    // 文章列表页面屏蔽按钮
    function addBlockBtnTo(item) {
        $(item).find('.z-feed-foot-r').children('a').addClass('card-icon-with-block');
        var a = $(`<a class='z-group-data card-icon-with-block card-icon-with-block-btn' title='屏蔽'></a>`);
        var blockIcon = $(`
      <svg class='icon-block-card' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 1024 1024" >
        <path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" p-id="2813"></path>
      </svg>`);
        var span = $(`<span>屏蔽作者</span>`)
        a.append(blockIcon);
        a.append(span);
        $(item).find('.z-feed-foot-r').append(a);
        a.click(function () {
            var li = a.parents('li');
            var uinfo = getUserForLi(li);
            if (uinfo) {
                userList.manualBlockUser(uinfo);
            }
            refreshArticalList();
            refreshKeywordBlockTab();
        });
    }
    // 添加屏蔽原因到标签
    function setBlockTagTo(item, tags) {
        let imgEle = $(item).find(".z-feed-img");
        let tagEle = imgEle.find(".block-tag-sticky");
        if (tags.size == 0) {
            if (tagEle.length == 0) {
                // 不需要添加标签
                return;
            } else {
                // 已经有了，就去除
                tagEle.remove();
                return;
            }
        }
        // 需要添加标签
        if (tagEle.length == 0) {
            tagEle = $(`<a class="block-tag-sticky""></a>`);
            imgEle.append(tagEle);
        }
        tagEle.text("标签: " + Array.from(tags).join("/"));
    }
    // 文章内部屏蔽按钮
    function addBlockInPost() {
        if ($('.author-title').length == 0) {
            return;
        }
        var authorA = $($('.author-title')[0]);
        var authorHref = authorA.attr('href');
        if (!authorHref) {
            return null;
        }
        var uidResult = /\/(\d+)\/?$/.exec(authorHref);
        if (!uidResult || uidResult.length < 2) {
            return null;
        }
        var uid = uidResult[1];
        var uname = authorA.text().trim();
        var uicon = $('.tx_name>img').attr('src').replace('-big.', '-middle.');
        let user = userList.getUserInfo(uid, new User(uid, uname, uicon));
        user.uname = uname;
        user.iconUrl = uicon;
        userList.saveUserInfo(user);
        var span = $(`<span></span>`)
        var blockIcon = $(`
        <svg class='icon-block-left' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 1024 1024" >
          <path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" p-id="2813"></path>
        </svg>`);
        var div = $('<div class="J_block comment"> </div>');
        div.append(blockIcon);
        div.append(span);
        $('.qrcode').before(div)
        div.click(function () {
            var isBlock = $(this).attr('data-block') == 'true'
            isBlock = !isBlock;
            $(this).attr('data-block', isBlock);
            if (isBlock) {
                span.html('取消<br/>屏蔽')
                userList.manualBlockUser(user);
            } else {
                span.html('屏蔽<br/>作者');
                userList.manualUnblockUser(user);
            }
            refreshUserBlockTab();
        });
        testSpammer(user, block => {
            if (block) {
                span.html('取消<br/>屏蔽');
            } else {
                span.html('屏蔽<br/>作者');
            }
            div.attr('data-block', block);
        });
    };
    // 用户首页屏蔽按钮
    function addBlockInHomepage() {
        if ($('.info-stuff-nickname>a').length == 0) {
            return;
        }
        var authorA = $('.info-stuff-nickname>a');
        var authorHref = authorA.attr('href');
        if (!authorHref) {
            return null;
        }
        var uidResult = /\/(\d+)\/?$/.exec(authorHref);
        if (!uidResult || uidResult.length < 2) {
            return null;
        }
        var uid = uidResult[1];
        var uname = authorA.text().trim();
        var uicon = $('.avatar-box>img').attr('src');
        let user = userList.getUserInfo(uid, new UserInfo(uid, uname, uicon));
        userList.saveUserInfo(user);
        var blockIcon = $(`
      <svg class='icon-block-homepage' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 1024 1024" >
        <path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" p-id="2813"></path>
      </svg>`);
        var a = $(`<a class="focus-other block-homepage"></a>`);
        var span = $(`<span>屏蔽作者</span>`);
        a.append(blockIcon);
        a.append(span);
        $('.info-stuff-set').append(a)
        a.click(function () {
            var isBlock = $(this).attr('data-block') == 'true'
            isBlock = !isBlock;
            $(this).attr('data-block', isBlock);
            if (isBlock) {
                span.text('取消屏蔽');
                userList.manualBlockUser(user);
            } else {
                span.text('屏蔽作者');
                userList.manualUnblockUser(user);
            }
            refreshUserBlockTab();
        });
        testSpammer(user, block => {
            if (block) {
                span.html('取消屏蔽');
            } else {
                span.html('屏蔽作者');
            }
            a.attr('data-block', block);
        });
    };
    // 添加屏蔽设置按钮
    function addSettingBtn() {
        var li = $(`
      <li>
        <span class="elevator-report">屏蔽<br>设置</span>
      </li>`);
        $('#elevator>.back-top').before(li);
        li.click(function () {
            $('.block-setting-box-bg').show();
            $('#search-user').val("");
            setPageDataForSettingBox(1, 12, '');
        });
    };
    // 添加设置框
    function addSettingDiv() {
        var bg = $(`<div class="block-setting-box-bg"></div>`);
        var box = $(`<div class="block-setting-box"></div>`);
        var boxHead = $(`<div class="block-setting-box-head"></div>`);
        var closeIcon = $(`<svg class='block-setting-box-head-close' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 1024 1024" >
            <path d="M676.44928 688.042667L542.17728 553.813333 675.510613 420.437333a21.290667 21.290667 0 0 0 0-30.165333 21.290667 21.290667 0 0 0-30.165333 0L512.011947 523.605333 378.635947 390.272a21.333333 21.333333 0 1 0-30.208 30.165333L481.846613 553.813333 347.574613 688.042667a21.333333 21.333333 0 0 0 30.208 30.165333L512.011947 583.978667l134.229333 134.229333a21.248 21.248 0 0 0 30.208 0 21.333333 21.333333 0 0 0 0-30.165333" p-id="3802"></path>
        </svg>`);
        var title = $(`<span class="block-setting-box-head-title">屏蔽设置</span>`);
        var tabChoose = $(`<ul class= "block-tab">
            <li class="block-setting-tab active" tabid="tab-block-user">屏蔽作者</li>
            <li class="block-setting-tab" tabid="tab-block-title-keyword">标题关键字屏蔽</li>
            <li class="block-setting-tab" tabid="tab-block-user-keyword">作者关键字屏蔽</li>
            <li class="block-setting-tab" tabid="tab-block-user-desc-keyword">作者签名关键字屏蔽</li>
            <li class="block-setting-tab" tabid="tab-article-tag-block-keyword-list">文章话题屏蔽</li>
            <li class="block-setting-tab" tabid="tab-article-category-block-list">文章分类屏蔽</li>
            <li class="block-setting-tab" tabid="tab-block-more-option">更多选项</li>
        </ul>`);
        var userBlockTab = createUserBlockTab();
        var postKeywordBlockTab = createKeywordBlockTab("tab-block-title-keyword", postBlockKeywordList.keywordList, keyword => {
            const ret = postBlockKeywordList.push(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        }, keyword => {
            const ret = postBlockKeywordList.delete(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        });
        var userKeywordBlockTab = createKeywordBlockTab("tab-block-user-keyword", userBlockKeywordList.keywordList, keyword => {
            const ret = userBlockKeywordList.push(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        }, keyword => {
            const ret = userBlockKeywordList.delete(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        });
        var userDescriptionKeywordBlockTab = createKeywordBlockTab("tab-block-user-desc-keyword", userDescriptionBlockKeywordList.keywordList, keyword => {
            const ret = userDescriptionBlockKeywordList.push(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        }, keyword => {
            const ret = userDescriptionBlockKeywordList.delete(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        });
        var articleTagKeywordBlockTab = createKeywordBlockTab("tab-article-tag-block-keyword-list", articleTagBlockKeywordList.keywordList, keyword => {
            const ret = articleTagBlockKeywordList.push(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        }, keyword => {
            const ret = articleTagBlockKeywordList.delete(keyword);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        });

        var articleCategoryBlockTab = createKeywordBlockTab("tab-article-category-block-list", articleCategoryBlockKeywordList.categories, category => {
            const ret = articleCategoryBlockKeywordList.push(category);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        }, category => {
            const ret = articleCategoryBlockKeywordList.delete(category);
            if (ret) {
                refreshArticalList();
            }
            return ret;
        });
        var moreOptionTab = createMoreOptionTab();
        boxHead.append(title);
        boxHead.append(tabChoose);
        boxHead.append(closeIcon);
        box.append(boxHead);
        box.append(userBlockTab);
        box.append(postKeywordBlockTab);
        box.append(userKeywordBlockTab);
        box.append(userDescriptionKeywordBlockTab);
        box.append(articleTagKeywordBlockTab);
        box.append(articleCategoryBlockTab);
        box.append(moreOptionTab);
        bg.append(box);
        $('body').append(bg);
        closeIcon.click(function () {
            $('.block-setting-box-bg').hide();
        });
        bg.click(event => {
            if (event.target != event.currentTarget) {
                return;
            }
            $('.block-setting-box-bg').hide();
        })
        $(".block-tab li").click(function () {
            console.log("click tab");
            for (const tab of $(".block-tab li")) {
                if (tab == this) {
                    $(tab).addClass("active");
                } else {
                    $(tab).removeClass("active");
                }
            }
            let displayTab = $(this).attr("tabid");
            for (const tabBox of $(".block-tab-box")) {
                if ($(tabBox).attr("id") == displayTab) {
                    $(tabBox).show();
                } else {
                    $(tabBox).hide();
                }
            }
        });
    }
    function createUserBlockTab() {
        var userBlockTab = $(`<div class="block-tab-box" id="tab-block-user"></div>`);
        var searchUserBox = $(`<input id="search-user" type="text" value="" placeholder="筛选"/>`);
        var blockUserUL = $(`<ul class="block-user-ul" id="list-block-user"></ul>`);
        var blockUserPageUL = $(`<ul class="pagenation-list-self" id="list-block-user-page"></ul>`);
        userBlockTab.append(searchUserBox);
        userBlockTab.append(blockUserUL);
        userBlockTab.append(blockUserPageUL);
        searchUserBox.keyup(e => {
            var value = e.target.value;
            setPageDataForSettingBox(1, 12, value);
        });
        return userBlockTab;
    }
    function refreshUserBlockTab() {
        // 暂时跳转到第 1 页
        $(`#search-user`).val("");
        setPageDataForSettingBox(1, 12, "");
    }
    function createKeywordBlockTab(id, blockListData, onInsertKeyword, onRemoveKeyword) {
        let closeBtnSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path fill="#fff" d="M676.44928 688.042667L542.17728 553.813333 675.510613 420.437333a21.290667 21.290667 0 0 0 0-30.165333 21.290667 21.290667 0 0 0-30.165333 0L512.011947 523.605333 378.635947 390.272a21.333333 21.333333 0 1 0-30.208 30.165333L481.846613 553.813333 347.574613 688.042667a21.333333 21.333333 0 0 0 30.208 30.165333L512.011947 583.978667l134.229333 134.229333a21.248 21.248 0 0 0 30.208 0 21.333333 21.333333 0 0 0 0-30.165333" p-id="3802"></path>
        </svg>`;
        let tab = $(`<div class="block-tab-box" style="display:none; padding-bottom: 16px"></div>`);
        tab.attr("id", id);
        let ul = $(`<ul></ul>`);
        tab.append(ul);
        // 新建屏蔽词
        let newBlockKeyworkLi = $(`<li class="block-keywork-new"></li>`);
        let newBlockKeyworkinput = $(`<input type="text" placeholder="添加屏蔽词"/>`);
        let newBlockKeyworkAddBtn = $(`<div><i>+</i></div>`);
        newBlockKeyworkLi.append(newBlockKeyworkinput);
        newBlockKeyworkLi.append(newBlockKeyworkAddBtn);
        ul.append(newBlockKeyworkLi);
        ul.append($("<br/>"));
        newBlockKeyworkAddBtn.on("click", (event) => {
            let keyword = newBlockKeyworkinput.val().trim();
            newBlockKeyworkinput.val("");
            if (onInsertKeyword(keyword)) {
                createBlockKeywordItem(ul, keyword);
            }
        });
        newBlockKeyworkinput.keyup((event) => {
            if (event.keyCode == 13) {
                newBlockKeyworkAddBtn.click();
            }
        });
        // 关键词列表
        for (const keyword of blockListData) {
            createBlockKeywordItem(ul, keyword);
        }
        // UI
        ul.on("mouseenter", ".block-keyword-item", (event) => {
            $(event.currentTarget).append($(closeBtnSVG));
        });
        ul.on("mouseleave", ".block-keyword-item", (event) => {
            $(event.currentTarget).find("svg").remove();
        });
        // 删除
        ul.on("click", "svg", (event) => {
            let item = $(event.currentTarget).parent(".block-keyword-item");
            let keyword = item.find(".block-keyword").text().trim();
            item.remove();
            onRemoveKeyword(keyword);
        });
        return tab;
    }
    function refreshKeywordBlockTab(id, blockListData) {
        let ul = $(`#${id}>ul`);
        ul.find(".block-keyword-item").remove();
        for (const keyword of blockListData) {
            createBlockKeywordItem(ul, keyword);
        }
    }
    function setPageDataForSettingBox(
        page /*: int*/,
        pageSize /*: int*/,
        usernameFilter /*: string*/) {
        if (page <= 0) {
            page = 1
        }
        if (pageSize <= 0) {
            pageSize = 10;
        }

        $('#list-block-user').empty();
        $('#list-block-user-page').empty();
        let filterdUser = [...userList.list.values()];
        usernameFilter = usernameFilter.trim();
        if (usernameFilter.length > 0) {
            filterdUser = filterdUser.filter(uinfo => {
                return uinfo.uname.includes(usernameFilter)
            });
        }
        const blockedUser = filterdUser.filter(uinfo => userList.getUserTag(uinfo).length > 0);
        const userInPage = blockedUser.filter((uinfo, index) => {
            return index >= (page - 1) * pageSize && index < page * pageSize;
        });
        for (const uinfo of userInPage) {
            $('#list-block-user').append(createUserBlockCard(uinfo, () => {
                setPageDataForSettingBox(page, pageSize, usernameFilter);
                refreshArticalList();
            }));
        }
        const totalPageCount = Math.ceil(blockedUser.length / pageSize);
        createPagerForUserBlock(page, totalPageCount, (newPage) => {
            setPageDataForSettingBox(newPage, pageSize, usernameFilter);
        });
    }
    /**
     *
     * @param {UserInfo} uinfo
     * @param {*} onReloadCallback
     * @returns
     */
    function createUserBlockCard(uinfo, onReloadCallback) {
        let img = $(`<img class="block-setting-box-content-li-user-avatar"></img>`);
        if (uinfo.iconUrl == undefined ||
            uinfo.iconUrl.length == 0) {
            getICONForUser(user.uid, function (success, url) {
                img.attr('src', url);
                if (success) {
                    uinfo.iconUrl = url;
                    userList.saveUserInfo(uinfo);
                }
            });
        } else {
            img.attr('src', uinfo.iconUrl);
        }
        let imga = $(`<a class="block-setting-box-content-li-user-left"></a>`);
        imga.attr('href', 'https://zhiyou.smzdm.com/member/' + uinfo.uid);
        imga.append(img);
        let title = $(`<a class="block-setting-box-content-li-user-title"></a>`);
        title.text(uinfo.uname);
        title.attr('href', 'https://zhiyou.smzdm.com/member/' + uinfo.uid);
        let blockBtn =
            $(`<a class="block-setting-box-content-li-user-block-btn"><span>取消屏蔽</span></a>`);
        let li = $(`<li class="block-setting-box-content-li"></li>`);
        li.append(imga);
        let userRight =
            $(`<div class="block-setting-box-content-li-user-right"></div>`);
        let blockReasons = userList.getUserTag(uinfo)
            .filter(reason => reason && reason.length > 0);
        let blockReasonDiv = $(`<div class="user-block-tag"/>`);
        blockReasonDiv.text("标签:" + blockReasons.join("/"));
        userRight.append(title);
        userRight.append(blockReasonDiv);
        userRight.append(blockBtn);
        li.append(userRight);
        blockBtn.click(function () {
            userList.manualUnblockUser(uinfo);
            onReloadCallback();
        });
        return li;
    }
    function createPagerForUserBlock(currentPage, totalPageCount, gotoPageCallback) {
        let maxPagerCount = 5;
        let pagerStart = currentPage - parseInt((maxPagerCount / 2));
        if (pagerStart <= 0) {
            pagerStart = 1;
        }
        let pagerEnd = pagerStart + maxPagerCount;
        if (pagerEnd > totalPageCount) {
            pagerEnd = totalPageCount;
        }
        if (pagerStart != 1) {
            let lastPage =
                $(`<li class=""><i class="icon-angle-left-o-thin"></i></li>`);
            $('#list-block-user-page').append(lastPage);
            lastPage.click(function () {
                gotoPageCallback(currentPage - 1);
            });
            let firstPage = $(`<li class="page-number">1</li>`);
            $('#list-block-user-page').append(firstPage);
            firstPage.click(function () {
                gotoPageCallback(1);
            });
            $('#list-block-user-page').append($(`<li class="noHover">...</li>`));
        }
        for (let i = pagerStart; i <= pagerEnd; i++) {
            let pager = $(`<li class="page-number"></li>`);
            pager.text(i);
            if (i == currentPage) {
                pager.addClass('current');
            }
            pager.click(function () {
                gotoPageCallback(i);
            });
            $('#list-block-user-page').append(pager);
        }
        if (pagerEnd != totalPageCount) {
            $(`<li class=""><i class="icon-angle-left-o-thin"></i></li>`);
            $('#list-block-user-page').append($(`<li class="noHover">...</li>`));
            let nextPage = $(
                `<li class="page-turn next-page"><i class="icon-angle-right-o-thin"></i></li>`);
            $('#list-block-user-page').append(nextPage);
            nextPage.click(function () {
                gotoPageCallback(currentPage + 1);
            });
        }
    }
    function createBlockKeywordItem(ul, keyword) {
        let span = $(`<span class="block-keyword"></span>`);
        span.text(keyword);
        let li = $(`<li class="block-keyword-item"></li>`);
        li.append(span);
        ul.append(li);
    }
    function createMoreOptionTab() {
        var tab = $(`<div class="block-tab-box" id="tab-block-more-option" style="display:none; padding-bottom: 16px"></div>`);
        var column0 = $(`<div class="tab-block-more-option-column"></div>`)
        var column1 = $(`<div class="tab-block-more-option-column"></div>`)
        let createOption = (id, title, initValue, cb) => {
            let div = $(`<div class="tab-block-more-option-item"></div>`);
            let checkbox = $(`<input type="checkbox" id="${id}">`);
            let checkboxLabel = $(`<label for="${id}">${title}</label>`);
            checkbox.prop('checked', initValue);
            div.append(checkbox);
            div.append(checkboxLabel);
            checkbox.change(function () {
                cb(id, this.checked);
            });
            return div;
        }
        let allConfigKeys = BlockConfig.allConfigKeyNames();
        let i = 0;
        for (const key of allConfigKeys) {
            let item = createOption(
                `option_block_item_${key}`,
                BlockConfig.getConfigKeyName(key),
                blockConfig.getConfig(key),
                (id, newValue) => {
                    blockConfig.saveConfig(key, newValue);
                    refreshArticalList();
                });
            if (i % 2 == 0) {
                column0.append(item);
            } else {
                column1.append(item);
            }
            i++;

        }
        tab.append(column0);
        tab.append(column1);
        return tab;
    }
    /**
     * 刷新配置
     * @param {BlockConfig} config
     */
    function refreshMoreOptionTab(config) {
        let allConfigKeys = BlockConfig.allConfigKeyNames();
        for (const key of allConfigKeys) {
            $(`option_block_item_${key}`).prop('checked', config.getConfig(key));
        }
    }
    function getICONForUser(uid, cb) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.smzdm.com/v1/users/info',
            data: 'user_smzdm_id=' + uid,
            headers:
                { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            responseType: 'json',
            onload: response => {
                var data = response.response;
                if (parseInt(data.error_code) != 0) {
                    cb(false,
                        'https://res.smzdm.com/images/user_logo/default_avatar/5-middle.png');
                    return;
                }
                cb(true, data.data.meta.avatar);
            },
            onerror: response => {
                cb(false,
                    'https://res.smzdm.com/images/user_logo/default_avatar/5-middle.png');
            }
        });
    }
})();