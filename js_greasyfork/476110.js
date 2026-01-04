// ==UserScript==
// @name         豆瓣随机漫步者 - 手气不错 - 拯救选择困难症!
// @version      0.1.5.4
// @namespace    Black Rabbit
// @author       Black Rabbit
// @description  豆瓣随机漫步者脚本，为电影、读书、音乐的wish、do、collect添加了随机按钮和高亮显示，节省决策资源，拯救选择困难症！目前仅适配栅格视图，列表视图待适配。
// @match      http*://book.douban.com/*
// @match      http*://movie.douban.com/*
// @match      http*://music.douban.com/*
// @match      http*://*.douban.com/mine*
// @match      http*://*.douban.com/people/*/wish*
// @match      http*://*.douban.com/people/*/do*
// @match      http*://*.douban.com/people/*/collect*
// @match      http*://search.douban.com/book/*
// @match      http*://search.douban.com/movie/*
// @match      http*://search.douban.com/music/*
// @icon       https://img1.doubanio.com/favicon.ico
// @original_icon https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @supportURL     https://greasyfork.org/scripts/476110
// @grant      GM_xmlhttpRequest
// @grant      GM_log
// @downloadURL https://update.greasyfork.org/scripts/476110/%E8%B1%86%E7%93%A3%E9%9A%8F%E6%9C%BA%E6%BC%AB%E6%AD%A5%E8%80%85%20-%20%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%20-%20%E6%8B%AF%E6%95%91%E9%80%89%E6%8B%A9%E5%9B%B0%E9%9A%BE%E7%97%87%21.user.js
// @updateURL https://update.greasyfork.org/scripts/476110/%E8%B1%86%E7%93%A3%E9%9A%8F%E6%9C%BA%E6%BC%AB%E6%AD%A5%E8%80%85%20-%20%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%20-%20%E6%8B%AF%E6%95%91%E9%80%89%E6%8B%A9%E5%9B%B0%E9%9A%BE%E7%97%87%21.meta.js
// ==/UserScript==

// Domain and Type Process
var domain = window.location.hostname;
var url = window.location.href;
var hlcolor;
//var imdbid = 2543698;
var type;
var cat;
// Type Decide
function judgetype(){
    var bookkw = ["book.douban", "search.douban.com/book"];
    var moviekw = ["movie.douban", "search.douban.com/movie"];
    var musickw = ["music.douban", "search.douban.com/music"];
    if (bookkw.some(function (substring) {
        return url.includes(substring);
    })) { return "book" }
    else if (moviekw.some(function (substring) { // includes keyword then run
        return url.includes(substring);
    })) { return "movie" }
    else if (musickw.some(function (substring) { // includes keyword then run
        return url.includes(substring);
    })) { return "music" }
}
// Handle type, cat, highlight color
if (judgetype()=="book"){ type = "book" ; cat = "1001" ; hlcolor = "rgb(40,153,160)"; }//rgb(38,143,149) rgb(234,161,100)
else if (judgetype()=="movie") { type = "movie" ; cat = "1002" ; hlcolor = "rgb(0,144,217)"; if(url.includes("typerank?type_name")){moviepick();}} //rgb(40,156,229)
else if (judgetype()=="music"){ type = "music" ; cat = "1003" ; hlcolor = "rgb(249,92,68)";} //rgb(250,128,0)

// Try get newest imdbid
// (function() {
//     var imdburl = "https://www.imdb.com/pressroom/stats/";
//     GM_xmlhttpRequest({
//         method: "GET",
//         url: imdburl,
//         onload: function(response) {
//             // Parse the response text as HTML
//             var parser = new DOMParser();
//             var doc = parser.parseFromString(response.responseText, "text/html");
//             // Find the <li> element that contains the text "Titles w/ Primary Image:"
//             var li = doc.querySelector("li:contains('Titles w/ Primary Image:')");
//             // Get the text content of the <li> element
//             var text = li.textContent;
//             // Extract the number from the text and remove the commas
//             var number = text.replace("Titles w/ Primary Image: ", "").replace(/,/g, "");
//             // Convert the number to a numeric value
//             number = Number(number);
//             // Store the number in a variable for later use
//             imdbid = number;
//         }
//     });
//     //console.log("imdbid = " + imdbid);
//     GM_log("imdbid = " + imdbid);
//     //console.log("imdbid = 111");
//     GM_log("imdbid = 111");
// })();

// ADD Big Button
(function () {
    $("div.inp-btn").css("display","inline-block");
    var input = $("div.inp-btn");
    var button = $('<button class="feelinglucky"></button>');
    button.css({
        "width": "83px",
        "height": "33px",
        "border": "none",
        "margin-left":"14px",
        "background-color": hlcolor,
        "border-radius": "4px",
        "font-size": "12px",
        "color": "white",
        "cursor":"pointer",
        "display": "inline-block",
        "vertical-align": "top"
    });
    button.hover(function() {
        $( this ).css("opacity","0.88");
    }, function() {
        $( this ).css("opacity","1");
    });
    button.text("🎲 随机漫步");
    button.on("click", function () {
        //var roll = Math.floor(Math.random() * imdbid ) + 1; // roll a random imdb subject
        //var rdimdb = roll.toString().padStart(7, '0');
        //window.open("https://" + domain + "/subject/" + randomsj + "/", "_self");
        //window.open("https://search.douban.com/"+ type +"/subject_search?search_text=tt" + rdimdb + "&cat=" + cat , "_self");
        var rdlink;
        if (judgetype()=="book"){ }//rgb(38,143,149) rgb(234,161,100)
        else if (judgetype()=="movie") {
            var list = {
                "纪录片": 1,
                "传记": 2,
                "犯罪": 3,
                "历史": 4,
                "动作": 5,
                "情色": 6,
                "歌舞": 7,
                "儿童": 8,
                "悬疑": 10,
                "剧情": 11,
                "灾难": 12,
                "爱情": 13,
                "音乐": 14,
                "冒险": 15,
                "奇幻": 16,
                "科幻": 17,
                "运动": 18,
                "惊悚": 19,
                "恐怖": 20,
                "战争": 22,
                "短片": 23,
                "喜剧": 24,
                "动画": 25,
                "同性": 26,
                "西部": 27,
                "家庭": 28,
                "武侠片": 29,
                "古装": 30,
                "黑色电影": 31
            };
            var index = Math.floor(Math.random () * 29);
            var keys = Object.keys(list);
            var key = keys[index];
            var value = list[key];
            var rdrange = (Math.floor(Math.random () * 19) + 2 )*5; //2~20 *5
            rdlink = "https://movie.douban.com/typerank?type_name=" + key + "&type=" + value + "&interval_id="+ rdrange +":"+ (rdrange-10) + "&action=#rd";
        }
        else if (judgetype()=="music"){ } //rgb(250,128,0)
        if (url.includes("typerank?type_name")){
            window.open(rdlink, "_self");
        } else if (judgetype()=="movie"){
            window.open(rdlink);
        }
        return false;
    });
    input.after(button);
    $("span.operator-count").after(button.clone(true).css({"vertical-align":"middle","height": "26px"}).text("🎲 再来一次"));
})();

// Movie RANDOM Picking Process
function moviepick(){
    var hash = window.location.hash;
    // 如果有 #
    if (hash && hash.slice(1)==="rd") {
        //var span = $("span.operator-count");
        //var spantxt = span.text();
        // 创建一个 MutationObserver 对象，传入一个回调函数
        var already = false;
        var span = $("span.operator-count").get(0);
        var mlp = $("div.movie-list-panel.pictext").get(0);
        var spantxt;
        var observer = new MutationObserver(function (mutations) {
            // 遍历 mutations 数组，检查每个变化记录
            mutations.forEach(function (mutation) {
                // 如果变化类型是 characterData 或者 childList，说明 span 元素的文本发生了变化
                if (!already && (mutation.type === "characterData" || mutation.type === "childList")) {
                    already = true;
                    // 获取 span 元素的文本，并赋值给变量 spantxt
                    //spantxt = mutation.target.textContent;
                    spantxt = span.textContent;
                    // 在控制台中输出 spantxt 的值
                    var sjcount = Number(spantxt.replace("(", "").replace(")", ""));
                    var div = $("div.movie-list-item").first();
                    var ranknum = Number(div.find("span.rank-num").text());
                    var roll = Math.floor(Math.random () * sjcount);
                    var rdsj = ranknum + roll;
                    console.log("spantxt= "+ spantxt);
                    console.log("sjcount= "+ sjcount);
                    console.log("roll= "+ roll);
                    checkAndScroll("div.movie-list-panel.pictext","div.movie-list-item", roll);
                    observer.disconnect();
                }
            });
        });
        observer.observe(mlp, { characterData: true, childList: true }); //span
        //findTarget("div.movie-list-panel.pictext","div.movie-list-item", roll);
    }
}

function scrollToBottom () {
    // 使用 jQuery 的 animate 方法，把页面滚动到底部，时间为 100 毫秒
    $("html, body").animate ( { scrollTop: $(document).height () }, 100);
}

// 定义一个函数，用来寻找目标元素
function findTarget (panel, item, num) {
    // 使用 jQuery 的选择器，找到 class 为 movie-list-panel pictext 的 div 元素，并赋值给变量 panel
    var p = $(panel);
    // 在 panel 元素中，找到 class 包含 movie-list-item 的 div 元素，并赋值给变量 items
    var items = p.find(item);
    // 判断 items 元素的长度是否大于等于 100，如果是，说明已经出现了第 100 个 movie-list-item 的元素
    if (items.length >= num) {
        // 在 items 元素中，找到第 100 个 div 元素，并赋值给变量 target
        var target = items.eq(num);
        // 返回 true，表示找到了目标元素
        console.log("Found: " + num);
        var element = target.get(0);
        element.classList.add("highlighted");
        //element.style.border = "5px solid yellow"; // 添加一个 5px 的边框
        element.style.setProperty("border", "5px solid "+ hlcolor, "important"); // 添加一个带有!important标记的5px边框
        element.style.setProperty("border-radius", "8px");
        element.scrollIntoView({
            behavior: "smooth", // 平滑滚动
            block: "center", // 垂直方向居中对齐
            inline: "center" // 水平方向居中对齐
        });
        return true;
    } else {
        // 返回 false，表示没有找到目标元素
        console.log("Not found");
        return false;
    }
}

// 定义一个函数，用来检查是否找到目标元素，如果没有，就继续滚动
function checkAndScroll(panel, item, num) {
    // 调用 findTarget 函数，开始寻找目标元素，并把结果赋值给变量 found
    var found = findTarget(panel, item, num);
    // 如果 found 是 false，说明没有找到目标元素
    if (!found) {
        // 调用 scrollToBottom 函数，滚动到页面底部
        scrollToBottom ();
        // 使用 setTimeout 方法，在 2000 毫秒后再次调用 checkAndScroll 函数，继续检查和滚动
        setTimeout ( (function(){checkAndScroll(panel, item, num);}), 800);
    }
    return false;
}

// TUNE the Annual position
(function () {
    var anltarget = $("fieldset");
    if (judgetype()=="book"){
        $(".bookannual").appendTo(anltarget);
        $(".bookannual").attr("style","margin-left:200px !important; top:-11px;");
    }
    else if (judgetype()=="movie") {
        $(".movieannual").appendTo(anltarget);
        $(".movieannual").attr("style","margin-left:200px !important; top:-11px;");
    }
    else if (judgetype()=="music"){
        $(".musicannual").appendTo(anltarget);
        $(".musicannual").attr("style","margin-left:270px !important; top:-11px;");
    }
})();

(function () {
    var type = $('.types span:last-child');
    var txing = $('<span><a href="/typerank?type_name=同性&amp;type=26&amp;interval_id=100:90&amp;action=">同性</a></span>');
    type.after(txing);
    if (url.includes("type=26")) {
        $('#wrapper #content h1').text($("#wrapper #content h1").text() + " 同性");
    }
})();

// grid-view list-view Process
var urlkw = ["/wish", "/do", "/collect", "/mine?"];
if (urlkw.some(function (substring) { // includes keyword then run
    return url.includes(substring);
})) {
    // Get link reference
    var pageslc;
    var href;
    var range = 15;
    var paginator = document.getElementsByClassName("paginator");
    var pexist = Array.from(paginator).find(function(element) {
        return element.className === "paginator";
    });
    if (pexist) {
        pageslc = pexist.getElementsByTagName("a")[0];
        href = pageslc.href;
    } else { // paginator is not exist
        href = window.location.href.split("#")[0]; // use default url
    }
    // calculate max PAGE nums
    var sjnumspan = document.getElementsByClassName ("subject-num")[0];
    var parts = sjnumspan.textContent.split ("/");
    var total = Number(parts[1].trim());
    if (total <= 15) {
        range = total;
    }
    var pagemax = Math.ceil (total / 15);
    //var pagemax = Number(document.getElementsByClassName("thispage")[0].getAttribute("data-total-page")) || sjnum;

    // Function: Add fixed RANDOM links in Grid mode
    (function() {
        'use strict';
        if (domain.includes("book.douban")){
            $('div.opt-bar.clearfix').after('<div class="nicetry" style="width:675px; height:24px ;"><a id="random" href="#" style="float: right; margin-right: 0px;">🎲 手气不错! </a></div>');
        }
        else {
            $('div.opt-bar.mb30.clearfix').css("margin-bottom","0px");
            $('div.opt-bar.mb30.clearfix').after('<div class="nicetry" style="width:675px; height:24px ;"><a id="random" href="#" style="float: right; margin-right: 0px;">🎲 手气不错! </a></div>');
            $('div.grid-view > div.item.comment-item:first-child').css({"padding-top":"20px","border-top-width":"1px","border-top-style":"dashed","border-top-color":"rgb(221,221,221)","margin-top":"5px"});
            $('div.grid-view').css({"border-top-width":"0px","padding-top":"0px"});
        }
        //$('div.mode').after('<div class="nicetry" style="width:200px; height:21px ;"><a id="random" href="#" style="float: right; margin-right: 0px;">🎲 手气不错! </a></div>');
        $('#random').on({
            click: function () {
                amble();
                return false;//阻止默认行为
            }
        });
        // $('#random').after('<span class="gray-dot">·</span>');
    })();

    // Function: Locate to RANDOM subject then highlight it -- according the #num at the end of Url
    var hash = window.location.hash;
    // 如果有 #
    if (hash) {
        // 去掉 # 号并转换为数字
        var index = Number(hash.slice(1));
        // 如果是有效的数字
        if (index >= 1 && index <= 15) {
            // 根据 CSS 选择器获取特定的元素
            var element;
            if (domain.includes("book.douban")){
                var interest = document.getElementsByClassName("interest-list")[0];
                var icount = interest.children.length;
                if (icount<15) { index = index % icount + 1; }
                element = document.querySelector(
                    "ul.interest-list > li.subject-item:nth-child(" + (index) + ")"
                );
            } else {
                var grid = document.getElementsByClassName("grid-view")[0];
                var count = grid.children.length;
                if (count<15) { index = index % count + 1; } // % 求余
                element = document.querySelector(
                    "div.grid-view > div.item.comment-item:nth-child(" + (index) + ")"
                );
            }
            // 如果找到元素
            if (element) {
                // 给元素添加一个样式类
                element.classList.add("highlighted");
                //element.style.border = "5px solid yellow"; // 添加一个 5px 的黄色边框
                element.style.setProperty("border", "5px solid "+ hlcolor, "important"); // 添加一个带有!important标记的5px黄色边框
                element.style.setProperty("border-radius", "8px");
                if (domain.includes("book.douban")){
                    $('li.highlighted > div.info > div.short-note > div.opt-l > a.d_link').after('<a id="again" href="#" style="float: right; margin-right: 0px;">🎲 再来一次! </a>');
                } else {
                    $('div.highlighted > div.info > ul > li > span.date').after('<a id="again" href="#" style="float: right; margin-right: 10px;">🎲 再来一次! </a>');
                }
                $('#again').on({
                    click: function () {
                        amble();
                        return false;
                    }
                });
                // 让元素滚动到可视区域
                element.scrollIntoView({
                    behavior: "smooth", // 平滑滚动
                    block: "center", // 垂直方向居中对齐
                    inline: "center" // 水平方向居中对齐
                });
            }
        }
    }

    // Function: wish do collect random method
    function amble(){
        var randomsj = Math.floor(Math.random() * total ) + 1; // 根据 total 生成一个随机项目 1 ~ total
        var pg = Math.floor(randomsj / 15) * 15; // 随机项目位于第几页 0 ~ pagemax-1
        var sj = randomsj % 15 + 1; // randomsj / 15 的余数，显示在 pg 的第 1 ~ 15 项
        var oldHref = location.href.split("#")[0]; // storage opening href
        var newHref = href.replace(/start=\d+/, "start=" + pg); // 替换 start 参数
        window.open(newHref + "#" + sj,"_self");
        //location.replace(newHref + "#" + sj);
        if (total<=15 || newHref==oldHref){
            location.reload();
        }
    }
}

// Function: Add RANDOM links in List mode