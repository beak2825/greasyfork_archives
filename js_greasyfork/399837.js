// ==UserScript==
// @name            Endless Google And Baidu
// @description     谷歌和百度搜索时候免翻页自动加载搜索结果 + 搜索页面去广告.
// @author          zhengshangchao
// @namespace       zhengshangchao@icloud.com
// @icon            https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQFx1p53_ITBIbIJ01mkd-9whP3CvzIwrNiUKjqeC2G5XvHg2Uk&usqp=CAU
// @include         http://www.baidu.com*
// @include         https://www.baidu.com*
// @include         http://www.google*
// @include         https://www.google*
// @run-at          document-start
// @version         0.0.4
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/399837/Endless%20Google%20And%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/399837/Endless%20Google%20And%20Baidu.meta.js
// ==/UserScript==

// 不能用于百度图片搜索或者谷歌的图片搜索
if (location.href.indexOf("tn=baiduimage") !== -1 || location.href.indexOf("tbm=isch") !== -1) return;
// 不能运行在iframes内嵌的场景
if (window.top !== window.self) return;
let flag = null;
// 判断百度还是谷歌搜索
if(location.href.includes("www.baidu.com")) {
    flag = "baidu";
} else if(location.href.includes("www.google.com")) {
    flag = "google";
} else{
    return;
}

// 百度搜索结果区和尾部的百度声明和翻页部分元素
const centerBaiduElement = "#container";
const filtersBaidu = ["#page","#content_right","#rs", "#rs_top_new", ".head_nums_cont_outer"];
const filtersBaiduCol = filtersBaidu.concat(["#content_bottom"]);

// 谷歌搜索结果区和尾部的谷歌声明和翻页部分元素
const centerGoogleElement = "#center_col";
const filtersGoogle = ["#foot"];
const filtersGoogleCol = filtersGoogle.concat(["#extrares", "#imagebox_bigimages"]);

// 自定义div部分的样式
const css = `
.page-number {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
	margin-bottom: 2em;
	color: #808080;
}
.page-number::before {
  content: "";
  background-color: #ededed;
  height: 1px;
  width: 90%;
  margin: 1em 3em;
}
.endless-msg {
  position:fixed;
  bottom:0;
  left:0;
  padding:5px 10px;
  background: darkred;
  color: white;
  font-size: 11px;
  display: none;
}
.endless-msg.shown {
  display:block;
}
`;

// 公共变量声明部分
const loadWindowSize = 1.6
let pageNumber = 1;
let prevScrollY = 0;
let nextPageLoading = false;
let msg = "";

function requestNextPage() {
    nextPageLoading = true;
    // 将当前页的超链接作为下一页初始化的值
    let nextPage = new URL(location.href);
    // 如果没有查询参数就直接返回
    if ((flag == "baidu") && !nextPage.searchParams.has("wd")) return;
    if ((flag == "google") && !nextPage.searchParams.has("q")) return;
    // 请求下一页的页码
    if(flag == "baidu") {
        nextPage.searchParams.set("pn", String(pageNumber * 10));
    } else if(flag == "google") {
        nextPage.searchParams.set("start", String(pageNumber * 10));
    }
    !msg.classList.contains("shown") && msg.classList.add("shown");
    // 请求下一页
    fetch(nextPage.href)
        .then(response => response.text())
        // 提取请求下一页的返回结果
        .then(text => {
            // 新建dom解析器
            let parser = new DOMParser();
            // 解析并提取text/html
            let htmlDocument = parser.parseFromString(text, "text/html");
            // 解析并提取搜索页的结果
            let content = null;
            if(flag == "baidu"){
                if(!hasNextPage(htmlDocument.querySelector("#page"))) {
                    onScrollPageEnd()
                }
                content = htmlDocument.documentElement.querySelector(centerBaiduElement);
                filter(content, filtersBaiduCol);
            } else if(flag == "google") {
                content = htmlDocument.documentElement.querySelector(centerGoogleElement);
                if(!content.querySelector("#rso")) {
                    onScrollPageEnd()
                }
                filter(content, filtersGoogleCol);
            } else {
                return;
            }
            // 拼接center_col的div的id
            content.id = "col_" + pageNumber;
            // 新建div元素 作为分页间的分割线
            let pageMarker = document.createElement("div");
            // 设置页码+1
            pageMarker.textContent = String(pageNumber);
            // 设置class
            pageMarker.className = "page-number";
            // 创建div
            let col = document.createElement("div");
            // 设置next-col作为下一页内容的存放容器
            col.className = "next-col";
            // 添加页码分割线作为子元素
            col.appendChild(pageMarker);
            // 添加下一页的内容作为子元素
            col.appendChild(content);
            // 找到centerElement后并添加next-col的div
            (flag == "baidu") && document.querySelector(centerBaiduElement).appendChild(col);
            (flag == "google") && document.querySelector(centerGoogleElement).appendChild(col);
            // 执行一次页面自增1
            pageNumber++;
            // 下一页翻页置为false
            nextPageLoading = false;
            // 如果包含分割线的样式则移除
            msg.classList.contains("shown") && msg.classList.remove("shown");
        });
}

/**
 * 鼠标滚动事件触发翻页动作
 */
function onScrollDocumentEnd() {
    // 记录当前鼠标滚动的时候的坐标y值
    let y = window.scrollY;
    // 滚动窗口与上个滚动窗口的差值
    let delta = y - prevScrollY;
    // 如果下一页没加载且滚动差值大于0且当前窗口滚动值超过body的高度值则触发翻页
    if (!nextPageLoading && delta > 0 && isDocumentEnd(y)) {
        // 请求下一页
        requestNextPage();
    }
    // 将上一页的窗口y值暂存
    prevScrollY = y;
}

/**
 * 鼠标滚动事件触发翻页动作
 */
function isDocumentEnd(y) {
    // 当窗口内在高度和当前滚动高度值*1.6的和大于浏览器body可见区域的高度
    return y + window.innerHeight * loadWindowSize >= document.body.clientHeight;
}

/**
 * 在指定的div元素中移除不需要的元素
 */
function filter(node, filters) {
    for (let filter of filters) {
        let child = node.querySelector(filter);
        if (child) {
           child.hidden = true;
        }
    }
}

/**
 * 百度翻页显示没有【下一页】的话证明是尾页
 */
function hasNextPage(node) {
    // 是否有下一页
    let hasNextPage = true;
    for (let page of node.children) {
       if(page.textContent.indexOf("下一页") == -1) {
           hasNextPage = false;
       }
       if(page.textContent.indexOf("下一页") == 0) {
           hasNextPage = true;
       }
    }
    return hasNextPage;
}

/**
 * 尾页处理
 */
function onScrollPageEnd() {
    // 则说明搜索结果不需要再翻页了，移除鼠标滚动事件
    window.removeEventListener("scroll", onScrollDocumentEnd);
    // 翻页的布尔值设置为false
    nextPageLoading = false;
    // 如果包含shown的元素则移除
    msg.classList.contains("shown") && msg.classList.remove("shown");
    return;
}

/**
 * 初始化
 */
function init() {
    // 当前窗口鼠标滚动的高度值
    prevScrollY = window.scrollY;
    // 添加鼠标滚动事件的回调方法
    window.addEventListener("scroll", onScrollDocumentEnd);
    // 过滤掉不需要的元素
    (flag == "baidu") && filter(document, filtersBaidu);
    (flag == "google") && filter(document, filtersGoogle);
    // 创建样式元素
    let style = document.createElement("style");
    // 指定元素类型为css
    style.type = "text/css";
    // 添加css为文本节点
    style.appendChild(document.createTextNode(css));
    // 将css样式元素添加到document的head元素中
    document.head.appendChild(style);
    // 添加div元素
    msg = document.createElement("div");
    // 新增加载下一页的提醒框
    msg.setAttribute("class", "endless-msg");
    // 添加提醒框的提示语
    msg.innerText = "自动加载下一页...";
    // 将提醒框元素添加到document的body中
    document.body.appendChild(msg);
}

// 初始化DOMContentLoaded监听（html文档完全被加载和解析事件）
document.addEventListener("DOMContentLoaded", init);
