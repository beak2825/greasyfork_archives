// ==UserScript==
// @name         【字典神器】国学大师页码链接工具兼汉典增强
// @namespace    https://greasyfork.org/zh-CN/scripts/463924
// @version      1.2.6
// @description  为国学大师网查询到的页码添加超链接以打开在线资源或本地PDF文件对应页面；汉典增强，去广告
// @author       微笑如此美妙
// @match        *.guoxuedashi.net/*
// @match        *dict.variants.moe.edu.tw/*
// @match        *humanum.arts.cuhk.edu.hk/Lexis/lexi-can/*
// @match        *www.zdic.net/*
// @match        *homeinmists.ilotus.org/hd/*
// @match        *.homeinmists.com/hd/search2.html*
// @match        *.kaom.net/*
// @match        *.shufazidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463924/%E3%80%90%E5%AD%97%E5%85%B8%E7%A5%9E%E5%99%A8%E3%80%91%E5%9B%BD%E5%AD%A6%E5%A4%A7%E5%B8%88%E9%A1%B5%E7%A0%81%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7%E5%85%BC%E6%B1%89%E5%85%B8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463924/%E3%80%90%E5%AD%97%E5%85%B8%E7%A5%9E%E5%99%A8%E3%80%91%E5%9B%BD%E5%AD%A6%E5%A4%A7%E5%B8%88%E9%A1%B5%E7%A0%81%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7%E5%85%BC%E6%B1%89%E5%85%B8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
// 本脚本需配合浏览器扩展方可点开本地文件链接，扩展下载链接：https://chrome.google.com/webstore/detail/enable-local-file-links/nikfmfgobenbhmocjaaboihbeocackld
// 扩展名称：Enable local file links，版本：v0.9.3；备用下载链接：https://crxdl.com/；下载后将crx文件拖入浏览器管理扩展页（edge://extensions/）即可安装；安装后点开该扩展的详情，勾选「允许访问文件URL/网址」
// 汉语大字典目前可以直接访问，其他工具书PDF请重命名为拼音直接放置D盘即可调用，如字源为ziyuan.pdf、汉语大词典第1卷为hanyudacidian1.pdf，以此类推

(function() {
    'use strict';

    function generateLinks(keyword) {
        let $0 = `https://www.guoxuedashi.net/zidian/so.php?sokeyzi=${keyword}&submit=&kz=1`; // 国学大师
        let $1 = `https://dict.revised.moe.edu.tw/search.jsp?md=1&word=${keyword}`; // 重编国语辞典修订本
        let $2 = `https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD=${keyword}#direct`; // 异体字字典
        let $3 = `https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/#q=${keyword}`; // 粤语审音配词字库
        let $4 = `http://www.czyzd.com/search?keyword=${keyword}`; // 潮州音字典
        let $5 = `https://www.syndict.com/w2p.php?word=${keyword}&item=hak`; // 薪典
        let $6 = `https://www.zdic.net/hans/${keyword}`; // 汉典
        let $7 = `https://www.shufazidian.com/#wd=${keyword}`; // 书法字典
        let $8 = `https://homeinmists.ilotus.org/hd/hydzd.php#keyword=${keyword}`; // 汉语大字典
        let $9 = `https://homeinmists.ilotus.org/hd/hydcd.php#keyword=${keyword}`; // 汉语大词典文字版
        let $10 = `http://www.homeinmists.com/hd/search2.html#keyword=${keyword}`; // 汉语大字典文字版
        let $11 = `http://www.kaom.net/book_hanyudacidian.php#keyword=${keyword}`; // 汉语大词典文字版2
        return {
            $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        };
    }

    // 国学大师
    if (window.location.href.includes(".guoxuedashi.net/")) {
        // 国语辞典、异体字典与粤语字库等链接的放置
        let keyword = document.querySelector(".info_tree h1")?.innerText;
        let res;
        if (window.location.href.startsWith("https://www.guoxuedashi.net/zidian/") && !window.location.href.startsWith("https://www.guoxuedashi.net/zidian/_")) {
            res = document.querySelector(".tit03");
        } else if (window.location.href.startsWith("https://www.guoxuedashi.net/zidian/_") || window.location.href.startsWith("https://www.guoxuedashi.net/hydcd/") || window.location.href.startsWith("https://www.guoxuedashi.net/chengyu/")) {
            res = document.querySelector(".info_tree");
            var inInfoTree = true;
        } else if (window.location.href.includes("m.guoxuedashi.net/")) {
            res = document.querySelector(".panel-heading.m-path");
            keyword = document.querySelector(".breadcrumb li.active").innerText;
            var isMobile = true;
        }
        let links = generateLinks(keyword); // 调用generateLinks函数并传入最新的keyword值
        // res.innerHTML += ` 　 <a href="${link1}" target="_blank">📙国语辞典</a> ∣<a href="${link2}" target="_blank">📕异体字典</a> ∣<a href="${link3}" target="_blank">📒粤语字库</a> ∣<a href="${link4}" target="_blank">📘潮州字典</a> ∣<a href="${link5}" target="_blank">📓客典</a> ∣<a href="${link6}" target="_blank">📚汉典</a>`;
        if (isMobile) {
            res.innerHTML += `
                <div class="links" style="background-color: #f8f8f8; padding: 12px; text-align: center;">
                    <div style="display: inline-block; width: 12%;">  <a href="${links.$1}" target="_blank">国语</a>  </div>
                    <div style="display: inline-block; width: 12%;">  <a href="${links.$2}" target="_blank">异体</a>  </div>
                    <div style="display: inline-block; width: 12%;">  <a href="${links.$3}" target="_blank">粤语</a>  </div>
                    <div style="display: inline-block; width: 15%;">  <a href="${links.$4}" target="_blank">潮州音</a>  </div>
                    <div style="display: inline-block; width: 15%;">  <a href="${links.$5}" target="_blank">客家话</a>  </div>
                    <div style="display: inline-block; width: 12%;">  <a href="${links.$6}" target="_blank">汉典</a>  </div>
                    <div style="display: inline-block; width: 12%;">  <a href="${links.$7}" target="_blank">书法</a>  </div>
                </div>
            `;
        } else {
            res.innerHTML += `　 ➟　<div class="links" style="display: inline-block;"><a href="${links.$1}" target="_blank">国语辞典</a> ∣ <a href="${links.$2}" target="_blank">异体字典</a> ∣ <a href="${links.$3}" target="_blank">粤语字库</a> ∣ <a href="${links.$4}" target="_blank">潮州字典</a> ∣ <a href="${links.$5}" target="_blank">客典</a> ∣ <a href="${links.$6}" target="_blank">汉典</a> ∣ <a href="${links.$7}" target="_blank">书法字典</a></div>`;
            if (inInfoTree) { res.innerHTML += ` ∣ <a href="${links.$9}" target="_blank">汉语大词典</a>`; }
        }
        let hydcdElements = document.querySelectorAll(".info_txt2.clearfix > h2 > font"); // 查找词典页的汉语大词典元素
        if (hydcdElements.length === 0) { hydcdElements = document.querySelectorAll(".panel-body.info_txt > font"); } // 如果查找不到则查找移动版元素
        hydcdElements?.forEach(fontElement => {
            if (fontElement.innerHTML.includes("汉语大词典")) {
                fontElement.innerHTML = `<a href="${links.$9}" target="_blank">${fontElement.innerHTML}</a>`;
            }
        });
        //《汉语大字典》《中华字海》《字源》《汉语大词典》
        const tds = document.querySelectorAll("#shupage td:first-child");
        for (const td of tds) {
            let content = td.innerText.trim();
            if (content === "汉语大字典") {
                let pageNumber = parseInt(td.nextElementSibling.textContent.match(/\d+/)[0]) + 0;
                let link = `https://homeinmists.ilotus.org/hd/hydzd3.php?st=term&kw=${pageNumber}`;
                td.nextElementSibling.innerHTML = `<a href="${link}" target="_blank">${td.nextElementSibling.innerHTML}</a>`;
                td.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `<a href="${links.$10}" target="_blank">文字版 (新)</a>`;
            } else if (content === "中华字海") {
                let pageNumber = parseInt(td.nextElementSibling.textContent.match(/\d+/)[0]) + 84;
                let link = `file:///D:/zhonghuazihai.pdf#page=${pageNumber}`;
                td.nextElementSibling.innerHTML = `<a href="${link}" target="_blank">${td.nextElementSibling.innerHTML}</a>`;
            } else if (content === "字　源") {
                let matchedNumbers = td.nextElementSibling.textContent.match(/\d+/g);
                if (matchedNumbers && matchedNumbers.length >= 1) {
                    for (let i = 0; i < matchedNumbers.length; i++) {
                        let pageNumber = parseInt(matchedNumbers[i]);
                        if (pageNumber <= 467) {
                            pageNumber += 12;
                        } else if (pageNumber <= 870) {
                            pageNumber += 13;
                        } else if (pageNumber > 870) {
                            pageNumber += 15;
                        }
                        matchedNumbers[i] = pageNumber;
                    }
                }
                let originTextArray = td.nextElementSibling.innerHTML.split(/[\u3000\s]+/); // 按全角空格分隔源文本
                let link0 = `file:///D:/ziyuan.pdf#page=${matchedNumbers[0]}`;
                let link1 = `file:///D:/ziyuan.pdf#page=${matchedNumbers[1]}`;
                td.nextElementSibling.innerHTML = `<a href="${link0}" target="_blank">${originTextArray[0]}</a>　<a href="${link1}" target="_blank">${originTextArray[1]}</a>`;
            } else if (content === "汉语大词典") {
                const pageOffsets = { // 各卷页码偏移表
                    "第1卷": 29,
                    "第2卷": -1744 + 12, // 检字表为3页
                    "第3卷": -3406 + 14, // 检字表为5页
                    "第4卷": -5068 + 13, // 检字表为4页
                    "第5卷": -6455 + 13, // 检字表为4页
                    "第6卷": -7983 + 14, // 检字表为5页
                    "第7卷": -9602 + 14, // 检字表为5页
                    "第8卷": -11156 + 14, // 检字表为5页
                    "第9卷": -12517 + 15, // 检字表为6页
                    "第10卷": -13967 + 13, // 检字表为4页
                    "第11卷": -15359 + 14, // 检字表为5页
                    "第12卷": -16801 + 20 // 检字表为8页，人员名单略长
                };
                const volume = td.nextElementSibling.nextElementSibling.innerText.match(/第(\d+)卷/)[0];
                const volumeNumber = volume.match(/\d+/)[0];
                const pageNumber = parseInt(td.nextElementSibling.textContent.match(/\d+/)[0]) + pageOffsets[volume];
                const link = `file:///D:/hanyudacidian${volumeNumber}.pdf#page=${pageNumber}`;
                td.nextElementSibling.innerHTML = `<a href="${link}" target="_blank">${td.nextElementSibling.innerHTML}</a>`;
                console.log(`${links.$9}`);
                td.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `<a href="${links.$9}" target="_blank">文字版1</a>　<a href="${links.$11}" target="_blank">文字版2</a>`;
            }else if (content === "康熙字典 (内府)") {
                let pageNumber = parseInt(td.nextElementSibling.textContent.match(/\d+/)[0]) + 0;
                let link = `http://www.homeinmists.com/kangxi/orgpage.html?page=${pageNumber}`;
                td.nextElementSibling.innerHTML = `<a href="${link}" target="_blank">${td.nextElementSibling.innerText} (新)</a>`;
            }
        }
        //《王力古汉语字典》异步加载故每隔1秒（1000毫秒）自动执行直至加载完成并完成修改
        let hasModified = false; // 添加一个标记，标记是否已经执行过修改操作
        const intervalId = setInterval(function() {
            const tds = document.querySelectorAll("#shupage td:first-child");
            for (const td of tds) {
                let content = td.innerText.trim();
                if (content === "王力古汉语字典" && !hasModified) { // 添加判断语句判断是否已经修改过
                    let pageNumber = parseInt(td.nextElementSibling.textContent.match(/\d+/)[0]) + 113;
                    let link = `file:///D:/wangliguhanyuzidian.pdf#page=${pageNumber}`;
                    td.nextElementSibling.innerHTML = `<a href="${link}" target="_blank">${td.nextElementSibling.innerHTML}</a>`;
                    hasModified = true; // 修改标记为已执行过修改操作
                    clearInterval(intervalId); // 停止定时器
                }
            }
        }, 1000);
    } else

    // 异体字字典自动搜索
    if (window.location.href.startsWith("https://dict.variants.moe.edu.tw/")) {
        if (window.location.href.startsWith("https://dict.variants.moe.edu.tw/search.jsp?QTP=0&WORD=") && window.location.href.includes("#direct")) {
            document.querySelector("#searchL > a").click();
        }
    } else

    // 粤语审音配词字库自动搜索
    if (window.location.href.startsWith("https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/")) {
        const leftFrame = document.querySelector("frame[name='left']");
        if (leftFrame){
            leftFrame.src = "left.php#" + window.location.href.match(/q=([^&]+)/)[0]; // 主网页URL尾部关键词拷贝到子网页URL尾部
        }
        if (window.location.href.startsWith("https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/left.php#q=")) {
            document.querySelector("input[type='text']").value = decodeURIComponent(window.location.href.match(/q=([^&]+)/)[1]); // 将关键词赋值给搜索框
            document.querySelector("input[type='submit']").click();
        }
    } else

    // 汉典
    if (window.location.href.startsWith("https://www.zdic.net/")) {
        // 去广告
        const intervalLength = 100; // 间隔时长
        const totalTime = 5000; // 总时长5秒
        const intervalId = setInterval(function() { // 间隔定时器
            let elToRemove = [
                document.querySelector("body > main > div.res_c_left.res_s.res_t > div.gc_lslot_a.sticky.res_h.res_s"), // 左（小视图）
                document.querySelector("body > main > div.res_c_left.res_s.res_t > div.gc_lslot_b.sticky.res_d.res_t.res_s"), // 左（大视图）
                document.querySelector("body > main > div.zdict > div.topslot_container"), // 上
                document.querySelector("#gg_rslot"), // 右
                document.querySelector("#gg_rslot2"), // 右下
                document.getElementsByClassName("adsbygoogle adsbygoogle-noablate")[1], // 下
                document.querySelector("#xxjs > div.content.definitions.xnr > div.mpuslot_b-container"), // 详细解释
                document.querySelector("#gg_cslot_1"), // 说文解字
                document.querySelector("#gg_cslot_2"), // 末尾
                document.querySelector("#gg_lslot_a"), // ts页左
                document.querySelector("body > main > div.browse_wrapper > div.topslot_container"), // ts页上
                document.querySelector("#gg_bslot_a"), // ts页下
                // document.querySelector("#gg_bslot_b"), // ts页方形广告，若去除留空则不美观
                document.querySelector("#ad_topslot"), // aboutus页上
                document.querySelector("#ad_leftslot_a"), // aboutus页左
                document.querySelector("#ad_btmslot_a") // aboutus末尾
            ];
            elToRemove.filter(el => el).forEach(el => el.remove());
        }, intervalLength);
        setTimeout(function() { // 延时定时器
            clearInterval(intervalId);
        }, totalTime);
        // 定义keyword和各个链接
        let keyword = document.querySelector("div.nr-box-header > h2 > span.orth").textContent.trim();
        const noGuoyuDict = (!document.querySelector("a[class='tab'][data-type-block-tab='國語辭典']") && !document.querySelector("a[class='tab'][data-type-block-tab='國語詞典']"));
        // const fanti = [...document.querySelectorAll("span + a")].find(a => a.previousElementSibling?.textContent === "繁体")?.textContent;
        const fanti = [...document.querySelectorAll("h2 > span + span")].find(span => span.textContent === " 《康熙字典》")?.previousElementSibling.textContent;
        if (noGuoyuDict && fanti) { keyword = fanti; } // 若无国语辞典又有繁体，则繁体为关键词
        let links = generateLinks(keyword); // 调用generateLinks函数并传入最新的keyword值
        // 选择导航栏，创建并添加多链接元素
        const tabsNavigation = document.querySelector("body > main > div.zdict > div.res_c_center > div > div.navigation > div");
        const tabs = document.createElement("links"); // 创建多链接的元素
        tabs.innerHTML = `<a class="tab" href="${links.$0}" target="_blank">📚国学大师</a>` +
          (noGuoyuDict ? `<a class="tab" href="${links.$1}" target="_blank">📙国语辞典</a>` : "") +
                         `<a class="tab" href="${links.$2}" target="_blank">📕异体字典</a>
                          <a class="tab" href="${links.$3}" target="_blank">📒粤语字库</a>
                          <a class="tab" href="${links.$4}" target="_blank">📘潮州字典</a>
                          <a class="tab" href="${links.$5}" target="_blank">📓客家薪典</a>
                          <a class="tab" href="${links.$7}" target="_blank">📗书法字典</a>
                          <a class="tab" href="${links.$8}" target="_blank">📖汉语大字典</a>
                          <a class="tab" href="${links.$9}" target="_blank">📋汉语大词典</a>`; // 条件 ? 返回值1 : 返回值2
        tabsNavigation.appendChild(tabs); // 添加创建好的元素
        // 国语辞典优化
        const header = document.querySelector("#gyjs > div.nr-box-header"); // 修改背景色和字体色
        header.style.backgroundColor = "rgb(148, 63, 22)";
        header.style.color = "rgb(250, 250, 250)";
        const entry = document.querySelector("#gyjs > div.nr-box-header > h2"); // 修改对齐方式
        entry.style.display = "flex";
        entry.style.alignItems = "flex-start";
        const dictname = document.querySelector("#gyjs > div.nr-box-header > h2 > span.span.dictname"); // 去除dictname
        dictname.remove();
        const img = `　<a href="${links.$1}" target="_blank" style="border-bottom: none;">
                           <img src="https://dict.revised.moe.edu.tw/img/logo1.png" style="width: 300px; max-width: 100%;" alt="國語辭典">
                       </a>`; // 创建并添加logo
        entry.innerHTML += img;
    } else

    // 汉语大字典与汉语大词典
    if (window.location.href.includes("homeinmists")) {
        const mappings = [
            { selector: ".fa.fa-caret-left", symbol: "◀" },
            { selector: ".fa.fa-caret-right", symbol: "▶" },
            { selector: ".fa.fa-step-backward", symbol: "|◀" },
            { selector: ".fa.fa-step-forward", symbol: "▶|" },
            { selector: ".fas.fa-chevron-up", symbol: "▴", opacity: "0.68" }
        ];
        mappings.forEach(({ selector, symbol, opacity }) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (opacity) {
                    element.parentNode.style.opacity = opacity;
                }
                element.parentNode.innerHTML = symbol;
            });
        });
        document.querySelectorAll("tbody td > a").length === 1 && document.querySelector("tbody a").click(); // 汉语大字典扫描版只有1个结果则直接点开
        document.querySelector("body > p")?.innerHTML?.includes("Error selecting records:") && (document.querySelector("body > p").innerHTML += `<br><br>您查询的可能是生僻字，请 <button class="windowClose">关闭页面</button> 后从国学大师网进入即可访问。`); // 汉语大字典扫描版
        document.querySelector(".windowClose")?.addEventListener("click", function() { window.close(); }); // 关闭错误页面按钮的功能
        document.querySelector(".form-control") && (document.querySelector(".form-control").value = decodeURIComponent(window.location.href.match(/keyword=([^&]+)/)[1])); // 汉语大字典扫描版和汉语大词典文字版搜索框
        document.querySelector("button[type=submit]")?.click(); // 点击搜索
        document.querySelector("#queryString1") && (document.querySelector("#queryString1").value = decodeURIComponent(window.location.href.match(/keyword=([^&]+)/)[1])); // 汉语大字典文字版搜索框
        document.querySelector("#queryString1")?.nextElementSibling?.click();
    } else

    // 汉语大词典2
    if (window.location.href.includes(".kaom.net/")) {
        document.querySelector("td > form > input.form_1").value = decodeURIComponent(window.location.href.match(/keyword=([^&]+)/)[1]); // 汉语大字典文字版搜索框
        document.querySelector("td > form > input.form_2").click(); // 点击搜索
        setTimeout(function() {
            window.close();
        }, 2000);
    } else

    // 书法字典
    if (window.location.href.includes(".shufazidian.com/")) {
        const mask = document.querySelector("#fullbg");
        const dialog = document.querySelector("#dialog");
        const Loading = document.querySelector("#fancybox-loading");
        if (Loading) {
            const observer = new MutationObserver(function(mutationsList) {
                if (Loading.style.display === "block") {
                    mask.style.display = "none";
                    dialog.style.display = "none";
                }
            });
            observer.observe(Loading, { attributes: true }); // 观察指定节点的属性变化
        }
        document.querySelector("#ad_a")?.remove();
        document.querySelector("#ad_b")?.remove();
        /* window.onload = () => { */ document.querySelector("iframe")?.remove(); /* } */ // 移动版广告
        let keyword = document.querySelector("#wd").value;
        let links = generateLinks(keyword); // 调用generateLinks函数并传入最新的keyword值
        document.querySelector(".zidian_new_js") && (document.querySelector(".zidian_new_js").innerHTML += `　 ➟　<div class="links" style="display: inline-block;"><a href="${links.$0}" target="_blank">国学大师</a> ∣ <a href="${links.$1}" target="_blank">国语辞典</a> ∣ <a href="${links.$2}" target="_blank">异体字典</a> ∣ <a href="${links.$3}" target="_blank">粤语字库</a> ∣ <a href="${links.$4}" target="_blank">潮州字典</a> ∣ <a href="${links.$5}" target="_blank">客典</a> ∣ <a href="${links.$6}" target="_blank">汉典</a> ∣ <a href="${links.$8}" target="_blank">汉语大字典</a> ∣ <a href="${links.$9}" target="_blank">汉语大词典</a></div>`);
        window.location.href.includes("/s.php") && document.querySelector(".newinfo") && (document.querySelector(".newinfo").style = "display: flex;height: auto"); // 非移动版释义框改为自适应大小以应对内容换行
        document.querySelector("#wd").value = decodeURIComponent(window.location.href.match(/wd=([^&]+)/)[1]); // 将关键词赋值给搜索框
        document.querySelector("form > button")?.click(); // 点击搜索
        !document.querySelector(".j") && document.querySelector("input[type='submit']")?.click(); // 移动版点击搜索，排除搜索结果页
    }
})();
