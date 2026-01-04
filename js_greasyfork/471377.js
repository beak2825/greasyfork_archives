// ==UserScript==
// @name         学学学
// @namespace    http://tampermonkey.net/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAMSSURBVDhPbZNJaBRBFIarJ8lk0UmcJTFuKCJ6iIJGUIILirghoqBiDkLwEBQVXAhRQUUjuIAK6sHoRRF3CEQQURBBEDyIGxJxi2J6Jt3Ts3XPTHdnMun6fVWTnLSheI/u/r/313tVzGKhg0kWMjUWcnUWtHUWcv636LszyPwitzVfxE0qYVNoWYaFUwkWRpSF+CDFf1cIMVYHrW460q076b9yDDCFG75qWEp9igm6EEeVoBdVKMpcxKDMVV89V1mAD/ir+XD/b55q38OTm7d5ZudxrrHxrgDYopIQxRTphFYQMaWeYq2ohmhZLYyV61CMGxCPxzlPrN5I7sod6WAMUBKHSRwmIUMsPAXJ1jbkb90FLwzDGxkBJ8Dw934erQqAHIwCSpUJEKFYJ8Wptnbk7z4g8T1kL1xB9vxFeLkcigMqAX7y/OVucuAngBImB1RZiRBgHNSKGuTvPITd85iEV2GR2Dp5BubhEyi8/QhjzQYq4ONG81LoNY1jDiJQ2Xiu1tRi6N0H2Pd7YB47DfthDzIHOpG72o3cjVuwzl3AH3JXcltFWwiOOQgStZy7L19h6PUbJLe3YSQ6CGP9Zgy9fY/Mvg4UPn+BWhmQWxQAsW1RnGlKvaMS1Tx+SvQH8RXU7WgM6YOdyN++h9y1m7Af9SJ7pbtUvUxMp3RmJGCQVTr6rCahRf76TaR275d5vHk5vGwemY5OFPr6YJ0ete8bBYw5iDHm5M5fkiJjayvcZy9Q1DTozUvku8yBI3DIQeH9RzkdMWYBiFHjdYUAuj9kF7/9oBl7XJ/bIu0P06i0OQvlzJ2nz5HYtEXC0u17R5s4gRxESoDEghaXk9izsp42s5kXjYTshTZ/MXdfvJR5csdObnadlbl5oourZQFPZZV0lIMuy63dmMKvARQ+9XF96my4vU/AczbSbbuQWLUBnpFC8etPxOctgtVxFDyThdP7hJvL1iLNgmmW8TceSldOsvSqia6u0HUuCznxqkZHr5lCV3ico1eEHT0wzYlPmOGIfsUrIna8YbabmdxkWeUNh/4CLOKGDB5Kaf8AAAAASUVORK5CYII=
// @version      2.0.5
// @description  学学学学学学学学学学
// @author       H
// @license      Apache Licence
// @match        https*://mooc1.chaoxing.com/mycourse/studentstudy*
// @match        https*://mooc1.chaoxing.com/knowledge/cards*
// @match        https*://mooc1.chaoxing.com/work/doHomeWorkNew*
// @match        https://mooc1.chaoxing.com/course*
// @match        https://mooc1.chaoxing.com/ztnodedetailcontroller/visitnodedetail*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.min.js
// @require      https://greasyfork.org/scripts/471126-%E5%AD%A6%E5%AD%A6%E5%AD%A6%E5%82%A8%E5%AD%98%E5%BA%93/code/%E5%AD%A6%E5%AD%A6%E5%AD%A6%E5%82%A8%E5%AD%98%E5%BA%93.js?version=1221842
// @require      https://greasyfork.org/scripts/471127-%E5%AD%A6%E5%AD%A6%E5%AD%A6%E9%A2%98%E5%BA%93/code/%E5%AD%A6%E5%AD%A6%E5%AD%A6%E9%A2%98%E5%BA%93.js?version=1221826
// @resource     svg-logo https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/css/all.min.css
// @connect      free.tikuhai.com
// @downloadURL https://update.greasyfork.org/scripts/471377/%E5%AD%A6%E5%AD%A6%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/471377/%E5%AD%A6%E5%AD%A6%E5%AD%A6.meta.js
// ==/UserScript==

//==脚本系统操作==
function deleteAllVar(){
    while(GM_listValues().length > 0){
        GM_deleteValue(GM_listValues()[0]);
    }
    console.log("变量已清空！");
}
function deleteVar(varname){
    GM_deleteValue(varname);
    console.log("删除了一个变量：" + varname);
}
function setVar(varname, vardata){
    GM_setValue(varname, vardata);
    console.log("设置了一个变量：\n" + varname + " => " + vardata);
}
function showAllVar() {
    var all_value="";
    for (var i = -1; i <= GM_listValues().length; i++) {
        if (i == -1) {
            all_value += "\n=========这里是储存的变量=========\n\n";
        } else if (i == GM_listValues().length) {
            all_value += "\n=========/这里是储存的变量=========";
        } else {
            all_value += GM_listValues()[i]+"："+GM_getValue(GM_listValues()[i])+"\n";
        }
    }
    console.log(all_value);
}
//删除所有变量
//deleteAllVar();

//删除变量
//deleteVar("news_goals");

//设置变量
//setVar("date", "2022-12-25");

//输出所有储存的变量
showAllVar();

//绑定到控制台
unsafeWindow.deleteAllVar = deleteAllVar;
unsafeWindow.deleteVar = deleteVar;
unsafeWindow.setVar = setVar;
unsafeWindow.showAllVar = showAllVar;
//==/脚本系统操作==


//==函数区==

//随机数
function random(min, max){
    return parseInt(Math.random()*(max-min+1)+min,10);
}

//等待执行
function justWait(min, max, log = true){
    var waitmsg,waittime;
    if (max == 0) {
        waittime = min;
        waitmsg = "==等待了："+(waittime / 1000)+" 秒==";
    } else {
        waittime = random(min, max);
        waitmsg = "==随机等待了："+(waittime / 1000)+" 秒==";
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (log) {
                console.log(waitmsg);
            }
            resolve();
        }, waittime);
    });
}

function base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}

//更改字体
function changeFont() {
    var md5 = $.md5;
    var $tip = $("style:contains(font-cxsecret)");
    if (!$tip.length) return;
    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
    font = Typr.parse(base64ToUint8Array(font))[0];
    var match = {};
    for (var i = 19968; i < 40870; i++) {
        $tip = Typr.U.codeToGlyph(font, i);
        if (!$tip) continue;
        $tip = Typr.U.glyphToPath(font, $tip);
        $tip = md5(JSON.stringify($tip)).slice(24);
        match[i] = table[$tip];
    }
    $(".font-cxsecret").html(function(index, html) {
        $.each(match, function(key, value) {
            key = String.fromCharCode(key);
            key = new RegExp(key, "g");
            value = String.fromCharCode(value);
            html = html.replace(key, value);
        });
        return html;
    }).removeClass("font-cxsecret");
}

function changeFontNew() {
    var $tip = $("style:contains(font-cxsecret)");
    if (!$tip.length) return;
    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
    //alert(1)
    console.log(font)

    font = Typr.parse(base64ToUint8Array(font))[0];
    console.log(font)

    var match = {};
    for (var i = 19968; i < 40870; i++) {
        $tip = Typr.U.codeToGlyph(font, i);
        if (!$tip) continue;
        $tip = Typr.U.glyphToPath(font, $tip);
        $tip = MD5(JSON.stringify($tip)).slice(24);
        match[i] = table[$tip];
    }
    $(".font-cxsecret").html(function(index, html) {
        $.each(match, function(key, value) {
            key = String.fromCharCode(key);
            key = new RegExp(key, "g");
            value = String.fromCharCode(value);
            html = html.replace(key, value);
        });
        return html;
    }).removeClass("font-cxsecret");
}

//toast输出
function createToast(id, mes, time = 5) {
    const notifications = document.querySelector('.notifications');
    const toastDetails = {
        success:{
            icon: 'fa-circle-check',
            text: 'Success: This is a success toast.'
        },
        error:{
            icon: 'fa-circle-xmark',
            text: 'Error: This is a error toast.'
        },
        warning:{
            icon: 'fa-circle-exclamation',
            text: 'Warning: This is a warning toast.'
        },
        info:{
            icon: 'fa-circle-info',
            text: 'Info: This is a info toast.'
        }
    };
    if (document.querySelector("style.i"+time)){
        document.querySelector("style.i"+time).innerHTML = ".toast.i"+time+"::before{animation-duration: "+time+"s;}";
    } else {
        var style = document.createElement("style");
        style.className = "i"+time;
        style.innerHTML = ".toast.i"+time+"::before{animation-duration: "+time+"s;}";
        document.getElementsByTagName("head")[0].appendChild(style);
    }
    // console.log(id)
    const {icon, text} = toastDetails[id];
    let txt;
    if (mes == "" || mes == null || typeof(mes) == "undefined"){
        txt = text;
    } else {
        txt = mes;
    }
    const toast = document.createElement('li') // 创建li元素
    toast.setAttribute("time", time);
    toast.setAttribute("style", "::before{animation-duration: "+time+"}")
    toast.className = `toast ${id} i${time}` // 为li元素新增样式
    toast.innerHTML = `<div class="column">
    <i class="fa-solid ${icon}"></i>
    <span>${txt}</span>
    </div>
    <i class="fa-solid fa-xmark" onClick="removeToast(this.parentElement)"></i>`
    notifications.appendChild(toast) // 添加元素到 notifications ul
    // 隐藏toast
    if (time != 0){
        toast.timeoutId = setTimeout(()=> removeToast(toast), time * 1000);
    }
}

//toast移除
function removeToast(toast) {
    toast.classList.add('hide')
    if( toast.timeoutId) clearTimeout(toast.timeoutId) // 清楚setTimeout
    // 移除li元素
    setTimeout(() => {
        toast.remove()
    },500)
}

function getAnswer(input) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            // $input
            url: `http://free.tikuhai.com/q?q=${input}`,
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: (response) => {
                const apiResponse = JSON.parse(response.responseText);
                resolve(apiResponse);
            },
            onerror: () => {
                resolve({
                    code: -1,
                    data: "",
                    msg: "请求出错"
                });
            },
            ontimeout: () => {
                resolve({
                    code: -1,
                    data: "",
                    msg: "请求超时"
                });
            }
        });
    });
};

// 解析查询字符串，并将参数存储在一个对象中
function parseQueryString() {
    var queryString = window.location.search;
    var params = {};
    var keyValues = queryString.substr(1).split("&");
    for (var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i].split("=");
        var key = decodeURIComponent(keyValue[0]);
        var value = decodeURIComponent(keyValue[1] || "");
        params[key] = value;
    }
    return params;
}
//==/函数区==

//==变量区==
const currentUrl = window.location.href;
const regexp = /习近平|中共|毛泽东|中央领导|共产党|主权|三股势力|政府|钓鱼岛|威胁论|全职|网络|江泽民/g
const query = parseQueryString();
const currentPath = window.location.pathname;
//==/变量区==

//==开始==
console.log("插件【学学学】开始运行...");

if (GM_getValue("errorItem") == undefined) {
    GM_setValue("errorItem", []);
}

changeFontNew();

GM_addStyle(css_main);
GM_addStyle(css_notifications);
GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));

unsafeWindow.createToast = createToast;
unsafeWindow.removeToast = removeToast;
unsafeWindow.changeFontNew = changeFontNew;

var Video, Observer = new MutationObserver(callback);

if (currentPath == "/knowledge/cards" && query.num == "0") {
    return;
} else if (currentPath == "/ananas/modules/video/index.html") {
    return;
}

window.onload = () => {
    start();
}

async function start() {
    //插入toast列表
    var ul = document.createElement("ul");
    ul.className = "notifications";
    $("body").append(ul);
    //createToast("success", "测试消息", 0);

    //判断页面
    console.log("判断当前页面...");
    if (currentUrl.indexOf("/studentstudy") != -1) {
        console.log("视频页");

        //初始化变量
        GM_setValue("finish", false);

        var div = document.createElement("div");
        div.setAttribute("class", "startcard");
        div.innerHTML = `
        <div class="startcard2">
			<div style="height: 100%;width:150px;display: flex;justify-content: center;align-items: center;">
				<button type="start" class="startbutton">开始学习</button>
			</div>
		</div>
    `;
        $("body").append(div);
        $(".startbutton").on("click", function() {
            var button = $(".startbutton");
            if (button.attr("type") == "start") {
                $(".startbutton").text("停止学习");
                $(".startbutton").attr("type", "stop");
                createToast("info", "开始学习", 0);
                study();
            } else {
                location.reload();
            }
        });
    } else if (/\/course\/\d+\.html/.test(currentPath) || currentPath == "/ztnodedetailcontroller/visitnodedetail") {
        console.log("阅读页");
        read();
    }
}

async function callback(mutationList, observer) {
    while (!$("iframe#iframe").length) {
        await justWait(500,0)
    }
    $("iframe#iframe")[0].onload = async function() {
        if (GM_getValue("current_Item") == $(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text() && !GM_getValue("first")) {
            return;
        }
        GM_setValue("current_Item", $(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text());
        if (GM_getValue("first")) {
            GM_setValue("first", false);
        }
        if ($(".prev_list").css("display") == "none") {
            if ($(".posCatalog_select.posCatalog_active > span.posCatalog_name").attr("title") == "阅读") {
                createToast("info", `前往阅读页面`, 0);
                $("iframe#iframe").contents().find("iframe").contents().find("iframe").contents().find("span[tabindex=0][role=option]").click();
                return;
            } else if (!$("li[title=视频]").hasClass("active")) {
                createToast("info", `开始答题`, 10);
                $("li#dct1").click();
                await exam();
                await justWait(8000, 10000);
                var click = false;
                if ($("span.orangeNew").length) {
                    var error_item = GM_getValue("errorItem");
                    for (let i = 0; i < $("span.orangeNew").length; i++) {
                        if (error_item.indexOf($("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name > em").text() + $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").attr("title")) != -1) {
                            continue;
                        }
                        click = true;
                        $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").click();
                        break;
                    }
                }
                if (!click && !GM_getValue("finish")) {
                    GM_setValue("finish", true);
                    createToast("success", "任务已完成", 0);
                    if ($("span.orangeNew").length) {
                        createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
                    }
                }
                return;
            } else {
                while (true) {
                    if ($("iframe#iframe").contents().find(".ans-attach-online").contents().find("video").length) {
                        console.log($("iframe#iframe").contents().find(".ans-attach-online").contents().find("video"))
                        break;
                    }
                    await justWait(500, 0);
                }
                if (!$(".posCatalog_select.posCatalog_active > span.catalog_points_yi.prevTips > span.orangeNew").length) {
                    await justWait(8000, 10000);
                    var click = false;
                    if ($("span.orangeNew").length) {
                        var error_item = GM_getValue("errorItem");
                        for (let i = 0; i < $("span.orangeNew").length; i++) {
                            if (error_item.indexOf($("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name > em").text() + $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").attr("title")) != -1) {
                                continue;
                            }
                            click = true;
                            $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").click();
                            break;
                        }
                    }
                    if (!click && !GM_getValue("finish")) {
                        GM_setValue("finish", true);
                        createToast("success", "任务已完成", 0);
                        if ($("span.orangeNew").length) {
                            createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
                        }
                    }
                    return;
                } else if ($(".posCatalog_select.posCatalog_active > span.catalog_points_yi.prevTips > span.orangeNew").text() == "1") {
                    watch();
                    return;
                }
            }
            createToast("error", "出现错误，学习终止", 0);
            return;
        }
        if (!$("li[title=视频]").hasClass("active")) {
            $("li[title=视频]").click();
        }
        while (true) {
            if ($("iframe#iframe").contents().find(".ans-attach-online").contents().find("video").length) {
                console.log($("iframe#iframe").contents().find(".ans-attach-online").contents().find("video"))
                break;
            }
            await justWait(500, 0);
        }
        if (!$(".posCatalog_select.posCatalog_active > span.catalog_points_yi.prevTips > span.orangeNew").length) {
            await justWait(8000, 10000);
            if ($("span.orangeNew").length) {
                $("span.orangeNew").eq(0).parent().parent().find("span.posCatalog_name").click();
            } else {
                GM_setValue("finish", true);
                createToast("success", "任务已完成", 0);
                if ($("span.orangeNew").length) {
                    createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
                }
            }
            return;
        } else if ($(".posCatalog_select.posCatalog_active > span.catalog_points_yi.prevTips > span.orangeNew").text() == "1") {
            if ($("li[title=章节测验]").length) {
                createToast("info", `开始答题`, 10);
                $("li[title=章节测验]").click();
                await exam();
                await justWait(8000, 10000);
                var click = false;
                if ($("span.orangeNew").length) {
                    var error_item = GM_getValue("errorItem");
                    for (let i = 0; i < $("span.orangeNew").length; i++) {
                        if (error_item.indexOf($("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name > em").text() + $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").attr("title")) != -1) {
                            continue;
                        }
                        click = true;
                        $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").click();
                        break;
                    }
                }
                if (!click && !GM_getValue("finish")) {
                    GM_setValue("finish", true);
                    createToast("success", "任务已完成", 0);
                    if ($("span.orangeNew").length) {
                        createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
                    }
                }
                return;
            }
            return;
        } else if ($(".posCatalog_select.posCatalog_active > span.catalog_points_yi.prevTips > span.orangeNew").text() == "2") {
            watch();
            return;
        }
        createToast("error", "出现错误，学习终止", 0);
    }
}

async function study() {
    GM_setValue("current_Item", $(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text());
    var config = { characterData: true, subtree: true, childList: true };
    Observer.observe($("#mainid")[0], config);
    GM_setValue("first", true);
    var click = false;
    if ($("span.orangeNew").length) {
        var error_item = GM_getValue("errorItem");
        for (let i = 0; i < $("span.orangeNew").length; i++) {
            if (error_item.indexOf($("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name > em").text() + $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").attr("title")) != -1) {
                continue;
            }
            click = true;
            $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").click();
            break;
        }
    }
    if (!click && !GM_getValue("finish")) {
        GM_setValue("finish", true);
        createToast("success", "任务已完成", 0);
        if ($("span.orangeNew").length) {
            createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
        }
    }
    return;
}

async function watch() {
    const Video_Iframe = (message)=>{return $("iframe#iframe").contents().find(".ans-attach-online").contents().find(message);}
    if (Video_Iframe(".vjs-big-play-button[title=播放视频]").css("display") == "block") {
        createToast("info", `开始观看 ${$(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text()}`, 10);
        while (Video_Iframe(".vjs-big-play-button[title=播放视频]").css("display") == "block") {
            Video_Iframe(".vjs-big-play-button[title=播放视频]").click();
            await justWait(500, 0);
        }
    }
    Video = Video_Iframe("video")[0];
    Video.addEventListener('pause', async function() {
        if (Video.ended) {
            await justWait(1000, 2000);
            createToast("success", `${$(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text()} 观看完毕`, 10);
            if ($("li[title=章节测验]").length) {
                createToast("info", `开始答题`, 10);
                $("li[title=章节测验]").click();
                await exam();
            }
            await justWait(8000, 10000);
            var click = false;
            if ($("span.orangeNew").length) {
                var error_item = GM_getValue("errorItem");
                for (let i = 0; i < $("span.orangeNew").length; i++) {
                    if (error_item.indexOf($("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name > em").text() + $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").attr("title")) != -1) {
                        continue;
                    }
                    click = true;
                    $("span.orangeNew").eq(i).parent().parent().find("span.posCatalog_name").click();
                    break;
                }
            }
            if (!click && !GM_getValue("finish")) {
                GM_setValue("finish", true);
                createToast("success", "任务已完成", 0);
                if ($("span.orangeNew").length) {
                    createToast("warning", "疑似存在未完成的章节，请手动检查", 0);
                }
            }
            return;
        }
        if ($("iframe#iframe").contents().find(".ans-attach-online").contents().find(".tkTopic").length) {
            createToast("info", "视频内检测", 10);
            const Video_Iframe = (message)=>{return $("iframe#iframe").contents().find(".ans-attach-online").contents().find(message);}
            Video_Iframe(".tkTopic").find(".tkItem_ul label:first").click();
            await justWait(800, 1500);
            Video_Iframe("#videoquiz-submit.ans-videoquiz-submit.bntLinear.fr")[0].click();
            await justWait(2000, 3000);
            if (Video_Iframe(".tkTopic").length) {
                createToast("error", "答案错误，重试", 10);
                Video_Iframe(".tkTopic").find(".tkItem_ul label:nth-child(1)").click();
                await justWait(800, 1500);
                Video_Iframe("#videoquiz-submit.ans-videoquiz-submit.bntLinear.fr")[0].click();
            }
            return;
        }
        console.log("播放被暂停");
        await justWait(800, 1000, false);
        createToast("info", "播放被暂停，继续播放", 2);
        Video.play();
    });
    return;
}

async function exam() {
    return new Promise((resolve, reject) => {
        $("iframe#iframe")[0].onload = async function() {
            const $$ = (message)=>{return $("iframe#iframe").contents().find("iframe").contents().find("iframe").contents().find(message);}
            var question_total = $$("div.TiMu"), question_title, answer, ok = true, click, select;
            if (!question_total.length) {
                createToast("warning", `${$(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text()} 页面错误`, 10);
                var errorItem = GM_getValue("errorItem");
                var errorTitle = $(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text() + $(".posCatalog_select.posCatalog_active > span.posCatalog_name").attr("title");
                if (errorItem.indexOf(errorTitle) == -1) {
                    errorItem.push(errorTitle);
                }
                GM_setValue("errorItem", errorItem);
                return resolve(false);
            }
            for (let i = 0; i < question_total.length; i++) {
                question_title = question_total.eq(i).find(".Zy_TItle > div").text().replace(/【.+】/g, "");
                //console.log(question_title)
                answer = await getAnswer(question_title);
                //console.log(answer);
                click = false;
                if (answer.msg == "获取成功") {
                    createToast("success", `第 ${i+1} 题：${answer.data}`, 10);
                    if (question_total.eq(i).find("ul.Zy_ulTop > li").length) {
                        answer = answer.data.split(/[#\x01|]/);
                        question_total.eq(i).find("ul.Zy_ulTop > li").each(function() {
                            select = $(this).find("a").text();
                            if (answer.indexOf(select) != -1 || answer.indexOf(select + "；") != -1 || answer.indexOf(select + "。") != -1 || answer.indexOf(select.replace(/\s/g, "")) != -1) {
                                $(this).find("input").click();
                                click = true;
                            } else {
                                answer.forEach((value) => {
                                    if (value.indexOf(select) != -1) {
                                        $(this).find("input").click();
                                        click = true;
                                    }
                                });
                            }
                        });
                    } else if (question_total.eq(i).find("ul.Zy_ulBottom > li").length) {
                        if (answer.data == "正确" || answer.data == "√") {
                            question_total.eq(i).find("[aria-label=对选择]").find("input").click();
                            click = true;
                        } else if (answer.data == "错误" || answer.data == "×") {
                            question_total.eq(i).find("[aria-label=错选择]").find("input").click();
                            click = true;
                        }
                    }
                    if (!click) {
                        createToast("warning", `第 ${i+1} 题：未匹配到答案`, 10);
                        ok = false;
                    }
                } else {
                    ok = false;
                    createToast("warning", `第 ${i+1} 题：未检索到答案`, 10);
                }
                await justWait(2000, 3000);
            }
            if (GM_getValue("finish")) {
                createToast("warning", `请自行提交`, 10);
                return resolve(false);
            }
            console.log(GM_getValue("finish"))
            if (!ok) {
                document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.alert = function() {
                    console.log("alert");
                };
                $$(".btnGray_1.workBtnIndex").click();
                await justWait(5000, 6000);
                createToast("error", `${$(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text()} 答题错误`, 0);
                var errorItem = GM_getValue("errorItem");
                var errorTitle = $(".posCatalog_select.posCatalog_active > span.posCatalog_name > em").text() + $(".posCatalog_select.posCatalog_active > span.posCatalog_name").attr("title");
                if (errorItem.indexOf(errorTitle) == -1) {
                    errorItem.push(errorTitle);
                }
                GM_setValue("errorItem", errorItem);
                return resolve(false);
            } else {
                $$("a.Btn_blue_1.marleft10.workBtnIndex").click();
                while (true) {
                    if ($$("div.AlertCon02") && $$("div.AlertCon02").css("display") != "none") {
                        break;
                    }
                    await justWait(500, 0);
                }
                $$("a.bluebtn").click();
                await justWait(5000, 6000);
                createToast("success", `答题完毕`, 10);
                return resolve(true);
            }
        };
    });
}

async function read() {
    if (GM_getValue("read_page") == undefined) {
        GM_setValue("read_page", 0);
    }
    createToast("info", `开始阅读`, 0);
    await justWait(2000, 3000);
    var height = parseInt(window.getComputedStyle(document.querySelector("#courseMainBox")).height);
    for (let j = 0; j <= height; j += random(400, 600)) {
        createToast("info", `阅读至 ${j}`, 10);
        try {
            $("html,body").animate({ scrollTop: j }, 1000);
        } catch (e) {
            window.scrollTo(0, j);
        }
        if (j >= height) {
            j = height;
        }
        await justWait(10000, 15000);
    }
    createToast("info", `阅读完毕`, 0);
    await justWait(10000, 15000);
    //await justWait(60000 * 10, 60000 * 20);
    if (GM_getValue("read_page") >= $(".mb15.course_section.fix").length - 1) {
        GM_setValue("read_page", 0);
    } else {
        GM_setValue("read_page", GM_getValue("read_page") + 1);
    }
    $(".mb15.course_section.fix").eq(GM_getValue("read_page")).find("a")[0].click();
}
