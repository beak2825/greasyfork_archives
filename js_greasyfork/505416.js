// ==UserScript==
// @name         luogu_better
// @namespace    https://www.luogu.com.cn
// @version      0.1.2
// @license      MIT
// @description	 更好的洛谷！
// @author       rabbit
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/505416/luogu_better.user.js
// @updateURL https://update.greasyfork.org/scripts/505416/luogu_better.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    console.log("luogu_beautification loaded | Made by Rabbit");
    // 函数：应用样式
    function applyStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
        body {
            background-image: url('https://bing.img.run/uhd.php') !important;
            background-size: cover;
        }
        .lg-article {
            border-radius: 9px !important;
        }
        .lg-article .lg-index-stat {
            border-radius: 9px !important;
        }
        .card.padding-default {
            border-radius: 9px !important;
        }
        .card.wrapper.padding-none {
            border-radius: 9px !important;
        }
        .lfe-form-sz-middle {
            border-radius: 9px !important;
        }
        .refined-input.input-wrap.frame {
            border-radius: 18px !important;
            padding: 5px;
        }
        input {
            border-radius: 18px !important;
            padding: 5px;
        }
        .center {
            border-radius: 9px !important;
        }
        .card.user-header-container.padding-0 {
            border-radius: 9px !important;
        }
        .card {
            border-radius: 9px !important;
        }
        .l-card {
            border-radius: 9px !important;
        }
        .columba-content-wrap {
            border-radius: 9px !important;
        }
        .text {
            border-radius: 18px !important;
            padding: 5px;
        }
        .casket {
            border-radius: 9px !important;
        }
        .dropdown {
            border-radius: 9px !important;
        }
        .am-comments-list {
            background-color:rgb(250,250,250);
            border-radius: 9px !important;
            overflow: auto;
        }
        textarea {
            border-radius: 9px !important;
        }
        `;

        document.head.appendChild(style);
    }

    // 首次加载时应用样式
    applyStyles();

    // 创建 MutationObserver 以监控 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                applyStyles(); // 当有新元素被添加时重新应用样式
            }
        });
    });

    // 开始监听 document.body 的子元素变化（包括整个 DOM 树的变化）
    observer.observe(document.body, { childList: true, subtree: true });
});
window.back = "https://bing.img.run/uhd.php";
setInterval(function(){
    document.querySelector('body').style=`background: url(${window.back}) fixed center;background-size: cover;`;
    if(document.querySelector('main[style="background-color: rgb(239, 239, 239);"]') != null)
        document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style="opacity: 0.9;";
    if(document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]') != null)
        document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
    if(document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]') != null)
        document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
    if(document.querySelector('div[class="mdui-panel mdui-panel-gapless"]') != null)
        document.querySelector('div[class="mdui-panel mdui-panel-gapless"]').style="opacity: 0.9;";
    if(document.querySelector("div[data-v-0a593618]") != null){
        document.querySelector("div[data-v-0a593618]").remove();
    }
},100);
(function(){
    const $=document.getElementsByClassName.bind(document);

    window.onload=function(){
        var myVar = setInterval(function(){
            //alert("Hello");
            const findElem=findElemByText.bind($("lfe-form-sz-small"))
            const sub=findElem("关闭");
            if(sub){
                sub.click();
                clearInterval(myVar);
            }
        }, 100);
    }

    function findElemByText(text) {
        for (const elem of this) {
            if (elem.innerText.includes(text)) {
                return elem
            }
        }
        return null
    }
})();
(function() {
    'use strict';
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div:nth-child(1)").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div.lg-article.am-hide-sm").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-8").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right > div:nth-child(2)").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div").className="am-u-md-12 lg-punch am-text-center";
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
})();
$('document').ready(function(){
    var x=document.querySelectorAll(".lg-punch-result");
    var y=document.querySelectorAll(".am-u-sm-6");
    if(x[0].innerHTML=="§ 大凶 §"){
        var sum="<span id='yi' style='font-weight:bold'>宜：</span>学习<br><span style='font-size:10px;color:#7f7f7f'>学业有成</span></br>";
        sum+="<span id='yi' style='font-weight:bold'>宜：</span>继续完成WA的题<br><span style='font-size:10px;color:#7f7f7f'>下一次就可以AC了</span></br>";
        y[0].innerHTML=sum;
    }
    x[0].innerHTML="§ 大吉 §";
    x[0].style="color:#e74c3c!important";
    y[1].innerHTML="万事皆宜";
    y[1].style="color:rgba(0, 0, 0, .75)!important";
    y[1].style="font-weight:bold";
});
//随机跳题 参考自叶ID的作品
setTimeout(function () {
    document.querySelector('div[class="am-u-md-3"]').innerHTML = `
        <div class="lg-article" id="rand-problem-form">
        <h2>随机跳题 v1.0</h2>
        <select class="am-form-field" style="background-color:#DDD;" name="rand-problem-rating" autocomplete="off" placeholder="选择难度">
            <option value="0">暂无评定</option>
            <option value="1">入门</option>
            <option value="2">普及-</option>
            <option value="3">普及/提高-</option>
            <option value="4">普及+/提高</option>
            <option selected value="5">提高+/省选-</option>
            <option value="6">省选/NOI-</option>
            <option value="7">NOI/NOI+/CTSC</option>
        </select>
        <select class="am-form-field" style="background-color:#DDD;margin-top:16px;" name="rand-problem-source" autocomplete="off" placeholder="选择来源">
            <option selected value="P">洛谷题库</option>
            <option value="CF">CodeForces</option>
            <option value="SP">SPOJ</option>
            <option value="AT">AtCoder</option>
            <option value="UVA">UVa</option>
        </select>
        <button class="am-btn am-btn-sm am-btn-primary" style="margin-top:16px;visibility:hidden">跳转</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="rand-problem-button" style="margin-top:16px;">跳转</button>
        </div>`;
    $('#rand-problem-button').click(function() {
            $('#rand-problem-button').addClass('am-disabled');
            $.get("https://www.luogu.com.cn/problem/list?difficulty=" + $('[name=rand-problem-rating]')[0].value + "&type=" + $('[name=rand-problem-source]')[0].value + "&page=1&_contentOnly=1",
                function (data) {
            var arr = data;
            if (arr['code'] != 200) {
                $('#rand-problem-button').removeClass('am-disabled');
                show_alert("出现了一些问题~", arr["message"]);
            }
            else {
                var problem_count = arr['currentData']['problems']['count'];
                var page_count = Math.ceil(problem_count / 50);
                var rand_page = Math.floor(Math.random()*page_count) + 1;
                $.get("https://www.luogu.com.cn/problem/list?difficulty=" + $('[name=rand-problem-rating]')[0].value + "&type=" + $('[name=rand-problem-source]')[0].value + "&page=" + rand_page + "&_contentOnly=1",
                        function(data) {
                    var list = data['currentData']['problems']['result'];
                    var rand_idx = Math.floor(Math.random()*list.length);
                    var pid = list[rand_idx]['pid'];
                    location.href = "https://www.luogu.com.cn/problem/" + pid;
                }
                        );
            }
        }
                );
    });
},499);
$('document').ready(function () {
    'use strict';
    if (window._feInjection.currentUser == null) return;
    const color = window._feInjection.currentUser.color;
    const uid = window._feInjection.currentUser.uid.toString();
    const username = window._feInjection.currentUser.name;
    console.log(color);
    console.log(uid);
    console.log(username);
    var classname = "lg-fg-"+color.toLowerCase();
    if (color.toLowerCase() == "red" || color.toLowerCase() == "orange") classname += " lg-bold";
    if (color.toLowerCase() == "blue") classname += "light";
    var tar = document.getElementsByClassName(classname);
    var ele = "&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg></a>";
    for (var i = 0; i < tar.length; i++)
    {
        if (tar[i].attributes['href'].value == "/user/"+uid)
        {
            tar[i].innerHTML = username+"&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg>";
            if(tar[i].nextElementSibling != null) {
                tar[i].nextElementSibling.innerHTML="";
            }
            //$(tar[i]).after(ele);
        }
    }
    var css = "";
if (false || (new RegExp("^((?!blog).)*https://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*https://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href)){
    css += [
        "a[class^=\"lg-fg-\"][href*=\""+uid+"\"] {",
"    color: #8e44ad !important;",
"}",
"a[class^=\"lg-fg-\"][href*=\""+uid+"\"]:after {",
"    content:\"管理员\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    border-radius: 50px;",
"    margin-left: 3px;",
"    padding-left: 10px;",
"    padding-right: 10px;",
"    padding-top: 4px;",
"    padding-bottom: 4px;",
"    transition: all .15s;",
"}"
	].join("\n");
    // 如果你没有使用氩洛谷

  /* css += [
      "a[class^=\"lg-fg-\"][href*=\""+uid+"\"] {",
"    color: #8e44ad !important;",
"}",
"a[class^=\"lg-fg-\"][href*=\""+uid+"\"]:after {",
"    content:\"管理员\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    margin-left: 3px;",
"    transition: all .15s;",
"}"
      ].join("\n"); */
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}});