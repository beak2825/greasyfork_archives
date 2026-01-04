// ==UserScript==
// @name        discord黑白名单
// @namespace   http://tampermonkey.net/
// @version     0.8.0
// @description 通过Dicord唯一的用户ID，可以跨群识别用户，并根据黑白名单给用户头像加标记。还可以根据与白名单名字的相似程度预警
// 
// @author     devplugin@protonmail.com
// @match      https://discord.com/*
// @grant      GM_setValue
// @grant      GM_getValue
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js
// @downloadURL https://update.greasyfork.org/scripts/420853/discord%E9%BB%91%E7%99%BD%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420853/discord%E9%BB%91%E7%99%BD%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let config = { "alertTH": 0.7 };
    ///////////////////////////////////////
    /// 基本操作
    ///////////////////////////////////////
    // Array Remove - By John Resig (MIT Licensed)
    function array_remove_pos(array, from, to) {
        let rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }
    function array_remove_value(array, value) {
        let pos = array.indexOf(value);
        while (pos >= 0) {
            array_remove_pos(array, pos);
            pos = array.indexOf(value);
        }
    }

    const log = {
        debug() { extLogger ? extLogger('debug', arguments) : console.debug.apply(console, arguments); },
        info() { extLogger ? extLogger('info', arguments) : console.info.apply(console, arguments); },
        verb() { extLogger ? extLogger('verb', arguments) : console.log.apply(console, arguments); },
        warn() { extLogger ? extLogger('warn', arguments) : console.warn.apply(console, arguments); },
        error() { extLogger ? extLogger('error', arguments) : console.error.apply(console, arguments); },
        success() { extLogger ? extLogger('success', arguments) : console.info.apply(console, arguments); }
    };
    const insertCss = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    };
    const createElm = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    };

    //文本相似度计算
    function similar(s, t, f) {
        if (!s || !t) {
            return 0;
        }
        var l = s.length > t.length ? s.length : t.length;
        var n = s.length;
        var m = t.length;
        var d = [];
        f = f || 3;
        var min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c);
        };
        var i, j, si, tj, cost;
        if (n === 0) return m;
        if (m === 0) return n;
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1);
                if (si === tj) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        let res = (1 - d[n][m] / l);
        return res.toFixed(f);
    }

    let namecache = {};
    //提取纯文本，去除字符串中的空格标点符号表情符号等
    function cleanString(str) {
        if (str === undefined)
            return str;
        if (str in namecache)
            return namecache[str];
        const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        const regStr2 = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~¡¦«¸»¿‐—―‖‘’“”•…‹›、。〈〉《》「」『』【】〔〕〖〗〝〞︰﹐﹑﹔﹕﹖﹝﹞﹟﹠﹡﹢﹤﹦﹩﹪﹫！＂＇（），：；？￥\s\r\n]/g
        const regStr3 = /﹌﹏﹋´ˊˋ︳︴¯＿￣˜﹨﹍﹉﹎﹊ˇ︵︶︷︸︹︿﹀︺︽︾ˉ﹁﹂﹃﹄︻︼/g;
        let simple_str = str.replace(regStr, "").replace(regStr2, "").replace(regStr3, "");
        namecache[str] = simple_str;
        return simple_str;
    }
    ///////////////////////////////////////
    /// 数据操作
    ///////////////////////////////////////
    let userdb = { "users": {}, "whitelist": [], "blacklist": [] };
    let db_changed = 0;
    function usereq(u1, u2) {
        return u1["uid"] === u2["uid"] && u1["name"] === u2["name"] && u1["imgsrc"] === u2["imgsrc"];
    }
    function adduser(user) {
        if (user["name"] === undefined || user["name"] === "") {
            return;
        }
        let uid = user["uid"];
        if (!(uid in userdb)) {
            userdb["users"][uid] = [user];
            db_changed += 1;
        }
        else {
            let flag = 1;
            for (let i = 0; i < userdb["users"][uid].length; i++) {
                if (usereq(user, userdb[uid][0])) {
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                userdb["users"][uid].splice(0, 0, user);
                db_changed += 1;
            }
        }
    }

    function remove_user_from_whitelist(uid) {
        array_remove_value(userdb["whitelist"], uid);
    }
    function remove_user_from_blacklist(uid) {
        array_remove_value(userdb["blacklist"], uid);
    }
    function adduser_to_whitelist(uid) {
        if (userdb["whitelist"].indexOf(uid) < 0) {
            userdb["whitelist"].push(uid);
        }
        array_remove_value(userdb["blacklist"], uid);
        db_changed += 1;
    }
    function adduser_to_blacklist(uid) {
        if (userdb["blacklist"].indexOf(uid) < 0) {
            userdb["blacklist"].push(uid);
        }
        array_remove_value(userdb["whitelist"], uid);
        db_changed += 1;
    }

    function getUserCount() {
        return Object.keys(userdb["users"]).length;
    }
    function getUserName(uid) {
        return userdb["users"][uid][0]["name"];
    }
    function userIsDangerous(uid) {
        if (!(uid in userdb["users"])) return;
        const cur_name = cleanString(getUserName(uid));

        for (let i = 0; i < userdb["whitelist"].length; i++) {
            const w_uid = userdb["whitelist"][i];
            if (!(w_uid in userdb["users"])) continue;
            const w_name = cleanString(getUserName(w_uid));
            const sx = similar(cur_name, w_name);

            if (sx > config["alertTH"]) {
                return true;
            }
        }
        return false;
    }
    function getSimilarUserFromWhitelist(uid) {
        let result = [];
        const cur_name = cleanString(getUserName(uid));
        for (let i = 0; i < userdb["whitelist"].length; i++) {
            const w_uid = userdb["whitelist"][i];
            const w_name = cleanString(getUserName(w_uid));
            const sx = similar(cur_name, w_name);
            if (sx > config["alertTH"]) {
                result.push([w_uid, sx]);
            }
        }
        return result;
    }

    ///////////////////////////////////////
    /// 数据导入导出
    ///////////////////////////////////////
    function initUserDB() {
        userdb = { "users": {}, "whitelist": [], "blacklist": [] };
    }
    function clearWhiteList() {
        userdb["whitelist"] = [];
    }
    function clearBlackList() {
        userdb["blacklist"] = [];
    }

    function saveUserDB() {
        //console.log(userdb);
        const cdd = pako.gzip(encodeURIComponent(JSON.stringify(userdb)));
        GM_setValue("lt_userdb_for_discord", cdd);
        db_changed = 0;
        console.log("[TM] user count=", getUserCount());
        console.log("[TM] compressed length=", cdd.length);
    }
    function loadUserDB() {
        const cdd = GM_getValue("lt_userdb_for_discord");
        if (!cdd) {
            return;
        }
        console.log(Object.keys(cdd).length);
        console.log("[TM]　Load DB....... ");
        const data = pako.inflate(cdd);
        console.log("[TM] data length=", data.length);
        const strData = new TextDecoder("utf-8").decode(data);
        console.log("[TM] string length=", strData.length);
        userdb = JSON.parse(decodeURIComponent(strData));
        db_changed = 0;
        console.log("[TM] user count=", getUserCount());
    }
    function exportDBToFile() {
        // 创建a标签
        var elementA = document.createElement('a');
        //文件的名称为时间戳加文件名后缀
        elementA.download = "db-" + new Date() + ".json";
        elementA.style.display = 'none';

        //生成一个blob二进制数据，内容为json数据
        var blob = new Blob([JSON.stringify(userdb)]);

        //生成一个指向blob的URL地址，并赋值给a标签的href属性
        elementA.href = URL.createObjectURL(blob);
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA);
    }
    //从json文件导入数据库
    function importDBFromFile(event) {
        const fileInputControl = event.srcElement;
        const filepath = fileInputControl.files[0];
        if (filepath) {
            let reader = new FileReader();
            reader.onload = function (evt) {
                const jsontext = evt.target.result;
                userdb = JSON.parse(jsontext);
                showWhiteBlackList();
            };
            reader.readAsText(filepath);
        }
    }
    ///////////////////////////////////////
    /// 界面交互
    ///////////////////////////////////////
    let resource = {
        "whiteiconhtml": `<svg class="ltmainui-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" id="white_user"><path d="M511.872032 1024a511.872032 511.872032 0 1 1 511.872032-511.872032 511.872032 511.872032 0 0 1-511.872032 511.872032z m-114.147463-310.962259a53.490627 53.490627 0 0 0 75.501125 0l323.247188-323.247189a53.490627 53.490627 0 0 0-75.501125-76.780804L433.043739 597.610597l-127.968008-127.968008a53.490627 53.490627 0 1 0-76.780805 75.501125z" fill="#41CC8B"></path></svg>`,
        "blackiconhtml": `<svg class="ltmainui-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" id="black_user"><path d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m259.072-680.192a42.752 42.752 0 0 0-60.672-60.16l-183.296 183.296-183.04-183.296a43.008 43.008 0 0 0-30.208-12.544 41.984 41.984 0 0 0-30.208 12.544 42.496 42.496 0 0 0 0 60.16l183.552 183.808-183.296 183.552a42.752 42.752 0 0 0 60.416 60.16L527.104 588.8l183.296 183.296a42.752 42.752 0 0 0 60.672-60.16L588.8 527.616l183.296-183.808z" fill="#FF4040"></path></svg>`,
        "warningiconhtml": `<svg class="ltmainui-icon" id="warning_user" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 512A512 512 0 1 0 512 0 512 512 0 0 0 0 512z" fill="#FF8040"></path><path d="M513.28 819.2a55.552 55.552 0 0 1 0-110.336 55.552 55.552 0 0 1 0 110.336z m0-179.2c-17.664 0-32.256-32.768-32.256-73.216L449.024 236.8A69.12 69.12 0 0 1 512 163.584a69.376 69.376 0 0 1 64.256 73.216l-31.232 329.728c0.256 40.448-14.08 73.472-31.744 73.472z" fill="#FFFFFF"></path></svg>`,
        "startbuttonhtml": `<div id="ltmainui-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages">
		                    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                                    <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="499"><path d="M804.58752 102.4H219.53536A117.01248 117.01248 0 0 0 102.4 219.41248v585.1136C102.4 869.18144 154.75712 921.6 219.41248 921.6h585.1136C869.18144 921.6 921.6 869.18144 921.6 804.52608V219.47392C921.6 154.81856 869.18144 102.4 804.52608 102.4h0.06144z m58.63424 702.31552a58.3168 58.3168 0 0 1-58.1888 58.4448H219.66336a58.3168 58.3168 0 0 1-41.51808-17.11616 58.0608 58.0608 0 0 1-17.23904-41.32864V219.47392c0-32.38912 26.30656-58.63424 58.69568-58.63424h585.05216c32.32768 0 58.56768 26.24512 58.56768 58.5728V804.7104zM768.2048 365.63968h-234.0864a29.25056 29.25056 0 1 0 0 58.50624h234.0864a29.25056 29.25056 0 1 0 0-58.50624z m0 234.2144h-234.0864a29.21984 29.21984 0 1 0 0 58.43968h234.0864a29.21984 29.21984 0 1 0 0-58.43968z m-409.66144-73.14944a102.43072 102.43072 0 1 0 0 204.8c55.13216-1.94048 98.82624-47.19616 98.82624-102.36928 0-55.168-43.69408-100.42368-98.82624-102.36416v-0.06656z m31.05792 133.49376a43.9296 43.9296 0 1 1-62.7456-61.4912 43.9296 43.9296 0 0 1 62.7456 61.4912z m36.06528-344.37632L329.32352 412.16l-37.90848-37.77536a29.22496 29.22496 0 0 0-41.32352 41.32864L308.59264 474.2144a29.23008 29.23008 0 0 0 41.32864 0L466.9952 357.21216a29.24544 29.24544 0 1 0-41.32864-41.39008z" p-id="500"></path></svg>
		                    </svg>
		                    <br><progress style="display:none; width:24px;"></progress>
		                    </div>`,
        "css": `
			#ltmainui-btn{position: relative; height: 24px;width: auto;-webkit-box-flex: 0;-ms-flex: 0 0 auto;flex: 0 0 auto;margin: 0 8px;cursor:pointer; color: var(--interactive-normal);}
			#ltmainui{position:fixed;top:100px;right:10px;bottom:10px;width:780px;z-index:99;color:var(--text-normal);background-color:var(--background-secondary);box-shadow:var(--elevation-stroke),var(--elevation-high);border-radius:4px;display:none;flex-direction:column}
			#ltmainui a{color:#00b0f4}
			#ltmainui.redact .priv{display:none!important}
			#ltmainui:not(.redact) .mask{display:none!important}
			#ltmainui.redact [priv]{-webkit-text-security:disc!important}
			#ltmainui .toolbar span{margin-right:8px}
			#ltmainui button,#ltmainui .btn{color:#fff;background:#7289da;border:0;border-radius:4px;font-size:14px;line-height:100%;}
            #ltmainui .filePicker{height:100%;}
            #ltmainui button:disabled{display:none}
			#ltmainui input[type="text"],#ltmainui input[type="search"],#ltmainui input[type="password"],#ltmainui input[type="datetime-local"],#ltmainui input[type="number"]{background-color:#202225;color:#b9bbbe;border-radius:4px;border:0;padding:0 .5em;height:24px;width:144px;margin:2px}
			#ltmainui input#file {display:none}
			#ltmainui hr{border-color:rgba(255,255,255,0.1)}
			#ltmainui .header{padding:12px 16px;background-color:var(--background-tertiary);color:var(--text-muted)}
			#ltmainui .form{padding:8px;background:var(--background-secondary);box-shadow:0 1px 0 rgba(0,0,0,.2),0 1.5px 0 rgba(0,0,0,.05),0 2px 0 rgba(0,0,0,.05)}
			#ltmainui .logarea{overflow:auto;font-size:.75rem;font-family:Consolas,Liberation Mono,Menlo,Courier,monospace;flex-grow:1;padding:10px}
			.ltmainui-icon{position: absolute;left: 42px;top: 0px;width: 1.25em;height: 1.25em;vertical-align: middle;overflow: hidden;z-index: 99;}
			#ltmainui .container{display: flex;}
			#ltmainui .rightbox {left: 200px;}
			#ltmainui .avatar {width: 32px;height: 32px;vertical-align: middle;fill: currentColor;overflow: hidden;}
			#ltmainui .proterties {display: inline-block;width: 202px;}
			#ltmainui .property-item {line-height: 34px;left: 9px;top: 0;text-align: initial;white-space: nowrap;right: 9px;height: 64px;width: 200px;background-color: #fff;border: 1px solid #c8c8c8;border-radius: 3px;color: #ccc;font-weight: 400;font-size: 10px;}
            #ltmainui table{border-spacing: 0; border-collapse: collapse; text-align: center; border: 3px solid purple; font-family: verdana,arial,sans-serif; font-size: 11px; color: #333333; border-width: 1px; border-color: #666666; border-collapse: collapse; height: 300px; width: 350px;}
            #ltmainui table tbody{display: block; width: 100%; height: 100%; overflow-y: scroll; }
            #ltmainui table td{ border-width: 1px; padding: 1px; border-style: solid; border-color: #666666; background-color: #ffffff; }
            #ltmainui .cellimg {width: 32px; height: 32px; border-radius: 50%; }
			`,

        "UIhtml": `
            <div id="ltmainui">
        <div class="header">
            拉清单 - 记录Discord用户的唯一ID，跨群识别用户，与白名单相似的名字会被提示风险
        </div>
        <div class="form">
            <div class="container">
                <div class="rightbox">
                    <div style="display:flex;">
                        <div id="removefromuserlist" class="droppable" style="border: 1px solid #c8c8c8;">
	                        <svg class="avatar"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M623.209832 236.950168H401.705475c-15.10257 0-27.344804 12.242235-27.344805 27.344804v31.463687h276.079553V264.294972c0-15.10257-12.242235-27.344804-27.230391-27.344804zM512 0C229.284469 0 0 229.284469 0 512S229.284469 1024 512 1024 1024 794.715531 1024 512 794.715531 0 512 0z m223.563799 727.326034c0 46.33743-37.642011 83.979441-83.979441 83.979441H373.33095c-46.33743 0-83.979441-37.642011-83.979442-83.979441v-315.781006c0-15.10257 12.242235-27.344804 27.344805-27.344805s27.344804 12.242235 27.344804 27.344805v315.781006c0 16.246704 13.157542 29.404246 29.404246 29.404245h278.138995c16.246704 0 29.404246-13.157542 29.404245-29.404245v-315.781006c0-15.10257 12.242235-27.344804 27.344805-27.344805s27.344804 12.242235 27.344804 27.344805v315.781006z m-318.641341-67.732738V411.545028c0-15.10257 12.242235-27.344804 27.344805-27.344805s27.344804 12.242235 27.344804 27.344805v248.048268c0 15.10257-12.242235 27.344804-27.344804 27.344805s-27.344804-12.242235-27.344805-27.344805z m136.380782 0V411.545028c0-15.10257 12.242235-27.344804 27.344805-27.344805s27.344804 12.242235 27.344804 27.344805v248.048268c0 15.10257-12.242235 27.344804-27.344804 27.344805s-27.344804-12.242235-27.344805-27.344805z m241.755531-309.259441H229.742123c-15.10257 0-27.344804-12.242235-27.344805-27.344805s12.242235-27.344804 27.344805-27.344804h90.043352v-31.463687c0-45.193296 36.726704-81.92 81.92-81.92h221.504357c45.193296 0 81.92 36.726704 81.92 81.92v31.463687H795.173184c15.10257 0 27.344804 12.242235 27.344805 27.344804s-12.356648 27.344804-27.459218 27.344805z" fill="#EEEEEE" ></path>
                            </svg>
                        </div>
                        <span class="btn" id="exporttofile">导出数据</span>
                        <label class="btn" for="dbfileInput">导入数据<input type="file" id="dbfileInput"  name="dbfileInput" style="display:none" accept="text/json"></label>
                        <label>可疑用户预警阈值<input id="alertTH" type="range" min="0" max="1000" value="700" /></label>

                        <button id="test" style="background:#f04747;width:80px;">测试</button>
                    </div>
                </div>
            </div>
            <hr>
            <div style="display:flex">
                <div>
                <span>白名单<span>
                <button id="clearwhitelist" style="background:#BBBBBB;">清空</button>
                <br>
                <table id="whitelisttable" class="gridtable droppable">
                    <tbody></tbody>
                </table>
                </div>
                <div>
                <span>黑名单<span>
                <button id="clearblacklist" style="background:#BBBBBB;">清空</button>
                <br>
                <table id="blacklisttable" class="gridtable droppable">
                    <tbody></tbody>
                </table>
                </div>
            </div>            
        </div>
        <pre class="logarea">
        <center>Star this project on <a href="https://github.com/mplugin/discordwblist" target="_blank">github.com/mplugin/discordwblist</a>!\n\n
        <a href="https://github.com/mplugin/discordwblist/issues" target="_blank">Issues or help</a>
                    </center>
        </pre>
    </div>
         `
    }
    function getServerNameFromUI() {
        const servername = $(".name-1jkAdW").text();
        return servername;
    }
    function getUidFromImgsrc(imgsrc) {
        const items = imgsrc.split("/");
        if (items.length === 6) {
            return items[4];
        }
        return undefined;
    }
    function AddIconToUser(userimagenode, icontype) {
        let nextnode = userimagenode.next();
        if (nextnode[0].className.animVal === "ltmainui-icon") {
            nextnode.remove();
        }
        let html = "";
        if (icontype === "white") {
            html = resource["whiteiconhtml"];
        }
        else if (icontype === "black") {
            html = resource["blackiconhtml"];
        }
        else if (icontype === 'warning') {
            html = resource["warningiconhtml"];
        }
        const iconnode = $(html);
        let prenode = userimagenode.parent().prev();
        if (prenode.length > 0) {
            iconnode.css("top", "20px");
        }
        userimagenode.after(iconnode);
        return iconnode;
    }

    function showReason() {
        const uid = getUidFromImgsrc($(this).prev().attr("src"));
        const uname = getUserName(uid);
        const suserids = getSimilarUserFromWhitelist(uid);
        console.log(uid, uname, suserids);
        let msg = "[" + uname + "]与白名单中的下列名字相似:\n";
        for (let i = 0; i < suserids.length; i++) {
            let name = getUserName(suserids[i][0]);
            const sx = suserids[i][1]
            msg += "        " + name + "  相似度=" + sx + "\n";
        }
        alert(msg);
        return;
    }
    function updateOneUserIconInMessage(userimagenode) {
        //console.log("[TM] [updateOneUserIconInMessage] ", userimagenode);
        const imgsrc = userimagenode.attr("src");
        if (imgsrc === undefined) { return; }
        const uid = getUidFromImgsrc(imgsrc);
        if (uid === undefined) return;
        if (userdb["whitelist"].indexOf(uid) >= 0) {
            AddIconToUser(userimagenode, "white");
        }
        else if (userdb["blacklist"].indexOf(uid) >= 0) {
            AddIconToUser(userimagenode, "black");
        }
        else if (userIsDangerous(uid)) {
            let iconnode = AddIconToUser(userimagenode, "warning");
            iconnode.click(showReason);
        }
        else {
            let nextnode = userimagenode.next();
            if (nextnode[0].className.animVal === "ltmainui-icon") {
                nextnode.remove();
            }
        }
    }
    function updateUsersIconInMessage() {
        $(".contents-2mQqc9").each(function (i, messagenode) {
            let imagenode = $(messagenode.childNodes[0]);
            updateOneUserIconInMessage(imagenode.first());
        });
    }
    function getUsersFromMemberList() {
        $(".member-3-YXUe").each(function (i, n) {
            const imgsrc = $("img", n).first().attr("src");
            if (imgsrc === undefined) { return; }
            const uid = getUidFromImgsrc(imgsrc);
            if (uid === undefined) return;
            const name = $("span.roleColor-rz2vM0", n).first().text();
            if (name === undefined || name === "") return;
            adduser({ "uid": uid, "name": name, "img": imgsrc });
        });
    }
    function getUsersFromMessageList() {
        $(".contents-2mQqc9").each(function (i, messagenode) {
            let imagenode = $(messagenode.childNodes[0]);
            const imgsrc = imagenode.attr("src");
            if (imgsrc === undefined) return;
            const uid = getUidFromImgsrc(imgsrc);
            if (uid === undefined) return;
            const name = $(messagenode.childNodes[1].childNodes[0].childNodes[0]).text();
            if (name === undefined || name === "") return;
            adduser({ "uid": uid, "name": name, "img": imgsrc });
        });
    }

    function appendToUserList(uid, iswhite) {
        const name = userdb["users"][uid][0]["name"];
        const img = userdb["users"][uid][0]["img"];
        let newRow = `<tr><td><img class="cellimg" src="${img}"></img></td><td>${uid}</td><td>${name}</td></tr>`;
        if (iswhite) {
            $("#whitelisttable tbody").append(newRow);
        }
        else {
            $("#blacklisttable tbody").append(newRow);
        }
    }
    function clearUserList(iswhite) {
        if (iswhite) {
            $("#whitelisttable tbody").empty();
        }
        else {
            $("#blacklisttable tbody").empty();
        }
    }
    function showUserList(iswhite) {
        clearUserList(iswhite);
        let userlist = null;
        if (iswhite)
            userlist = userdb["whitelist"];
        else
            userlist = userdb["blacklist"];

        for (let i = 0; i < userlist.length; i++) {
            const uid = userlist[i];
            appendToUserList(uid, iswhite);
        }
    }
    function addToUserList(uid, iswhite) {
        if (uid === undefined || uid === null || uid === "") return;
        const remove_listname = (!iswhite) ? "whitelist" : "blacklist";
        let should_delete = userdb[remove_listname].indexOf(uid) >= 0;
        if (iswhite)
            adduser_to_whitelist(uid);
        else
            adduser_to_blacklist(uid);
        appendToUserList(uid, iswhite);
        if (should_delete) {
            showUserList(!iswhite);
        }
        updateUsersIconInMessage();
    }
    function showWhiteBlackList() {
        showUserList(true);
        showUserList(false);
    }

    function addUserToWhitelist(uid) {
        addToUserList(uid, true);
    }
    function addUserToBlacklist(uid) {
        addToUserList(uid, false);
    }
    ///////////////////////////////////////
    //支持拖动头像功能
    ///////////////////////////////////////
    function mountDropFunc(popover) {
        const droppables = $('.droppable', popover);
        for (const droppable of droppables) {
            droppable.addEventListener('dragover', dragOver);
            droppable.addEventListener('dragleave', dragLeave);
            droppable.addEventListener('dragenter', dragEnter);
            droppable.addEventListener('drop', dragDrop);
        }
        function dragOver(e) {
            e.dataTransfer.dropEffect = 'copy';
            e.preventDefault();
            e.stopPropagation();
        }
        function dragEnter(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.className += ' drag-over';
        }
        function dragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.className = 'droppable';
        }
        function dragDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.className = 'droppable';
            console.log(this.nodeName, this.nodeType, this.nodeValue);
            const imgsrc = e.dataTransfer.getData('text');
            const uid = getUidFromImgsrc(imgsrc);
            $("#discord_photo").attr("src", imgsrc);
            $("#discord_uid").attr("value", uid);
            $("#discord_uname").attr("value", getUserName(uid));
            if (this.nodeName == "TABLE") {
                if (this.id == "whitelisttable") {
                    if (userdb["whitelist"].indexOf(uid) < 0)
                        addUserToWhitelist(uid);
                } else {
                    if (userdb["blacklist"].indexOf(uid) < 0)
                        addUserToBlacklist(uid);
                }
            } else if (this.id == "removefromuserlist") {
                if (uid === undefined || uid === null || uid === "") return;
                remove_user_from_whitelist(uid);
                remove_user_from_blacklist(uid);
                updateUsersIconInMessage();
                showWhiteBlackList();
            }
        }
    }
    ///////////////////////////////////////
    /// UI
    ///////////////////////////////////////
    function initUI() {
        //构建用户界面
        //  添加CSS
        insertCss(resource["css"]);
        //  添加UI
        let popover = createElm(resource["UIhtml"]);
        document.body.appendChild(popover);
        window.DebugX = popover;
        //  添加启动按钮
        let btn = createElm(resource["startbuttonhtml"]);
        btn.onclick = function togglePopover() {
            if (popover.style.display !== 'none') {
                popover.style.display = 'none';
                btn.style.color = 'var(--interactive-normal)';
            }
            else {
                popover.style.display = 'block';
                btn.style.color = '#f04747';
            }
        };
        //  关联按钮事件
        const $$ = s => popover.querySelector(s);
        function setupButtonFunc() {
            const exporttofileBtn = $$('#exporttofile');
            const alertTHBtn = $$('input#alertTH');
            const clearwhitelistBtn = $$('button#clearwhitelist');
            const clearblacklistBtn = $$('button#clearblacklist');

            clearwhitelistBtn.onclick = function () {
                console.log("[TM][clearwhitelistBtn.onclick]")
                clearWhiteList();
                updateUsersIconInMessage();
                saveUserDB();
                showWhiteBlackList();
            };
            clearblacklistBtn.onclick = function () {
                clearBlackList();
                updateUsersIconInMessage();
                saveUserDB();
                showWhiteBlackList();
            };

            exporttofileBtn.onclick = function () {
                exportDBToFile();
            };

            alertTHBtn.onchange = function () {
                config["alertTH"] = $("#alertTH").val() / 1000.0;
            }

            let fileInput = document.getElementById("dbfileInput");
            fileInput.addEventListener('change', importDBFromFile, fileInput);
        }
        setupButtonFunc();

        //////////////////////////
        //  构建监视器
        //////////////////////////
        function mountBtn() {
            const toolbar = document.querySelector('[class^=toolbar]');
            if (toolbar) toolbar.appendChild(btn);
        }
        function mountObserver() {
            if ($(".membersWrap-2h-GB4").length === 1) {
                console.log("[TM]", "Setup moniter for member list");
                member_observer.disconnect();
                member_observer.observe($(".membersWrap-2h-GB4")[0], { attributes: false, childList: true, subtree: true });
            }
            if ($(".chat-3bRxxu").length === 1) {//scrollerInner-2YIMLh
                console.log("[TM]", "Setup moniter for message list");
                message_observer.disconnect();
                message_observer.observe($(".scrollerInner-2YIMLh")[0], { attributes: false, childList: true, subtree: false });
            }
        }
        const member_observer = new MutationObserver(function (_mutationsList, _observer) {
            getUsersFromMemberList();
        });
        const message_observer = new MutationObserver(function (_mutationsList, _observer) {
            getUsersFromMessageList();
            for (let idx = 0; idx < _mutationsList.length; idx += 1) {
                if (!("addedNodes" in _mutationsList[idx])) {
                    continue;
                }
                for (let nidx = 0; nidx < _mutationsList[idx].addedNodes.length; nidx++) {
                    let addednode = _mutationsList[idx].addedNodes[nidx];
                    let nodeid = $(addednode).attr("id");
                    if (nodeid === undefined) continue;
                    if (nodeid.startsWith('chat-messages')) {
                        let imgnode = $(".contents-2mQqc9 > img", addednode).first();
                        if (imgnode.length === 0) continue;
                        if (imgnode.get(0).tagName.toUpperCase() === "IMG") {
                            updateOneUserIconInMessage(imgnode);
                        }
                    }
                }
            }
        });

        const observer = new MutationObserver(function (_mutationsList, _observer) {
            if (!document.body.contains(btn)) {
                mountBtn(); // re-mount the button to the toolbar
                mountObserver();
            }
        });
        observer.observe(document.body, { attributes: false, childList: true, subtree: true });
        //添加监视器
        mountBtn();

        //TODO::滚动右侧列表
        let isMemberListRolling = 0;
        function wheel() {
            console.log("[TM] wheel");
            $(".content-3YMskv").animate({ scrollTop: "0" });
            if (isMemberListRolling === 1) {
                setTimeout(wheel, 5000);
            }
        }
        function start_role(element) {
            isMemberListRolling = 1;
            setTimeout(wheel, 1000);
        }
        function stop_role() {
            isMemberListRolling = 0;
        }

        //加载数据库
        loadUserDB();

        //////////////////////////////////////////
        // 启动定时存储数据任务
        //////////////////////////////////////////
        setInterval(function () {
            if (db_changed !== 0) {
                console.log("[TM] auto save db");
                saveUserDB();
            }
        }, 60000);
        setInterval(updateUsersIconInMessage, 10000);
        //安装拖放功能
        mountDropFunc(popover);
        //创建黑白名单显示
        showWhiteBlackList();
    }
    initUI();
})();
