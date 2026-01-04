// ==UserScript==
// @name         EZTVx enhancement
// @name:zh      EZTVx 网站增强
// @author       Zhonggh@gmail.com
// @version      0.1.5
// @namespace    http://tampermonkey.net/
// @description  EZTVx Add show's poster preview on info icon at the left of torrent list's Mouseover, move "Aired today" list to the left side, etc. find out yourself.
// @description:zh  增加剧集海报预览功能，将鼠标放到列表左边的i图标上即可显示；将"Aired today"列表放到左边栏，在右边栏增加yysub的美剧播出时间表，在剧集详情页增加搜索豆瓣的链接，其他增强细节自己体会。
// @match        https://eztvx.to/home
// @match        https://eztvx.to/shows/*
// @match        https://eztvx.to/search/*
// @match        https://eztvx.to/cat/tv-packs*
// @connect      eztvx.to
// @connect      www.yysub.cc
// @grant        GM_xmlhttpRequest
// @license      aGPL License
// @downloadURL https://update.greasyfork.org/scripts/534359/EZTVx%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/534359/EZTVx%20enhancement.meta.js
// ==/UserScript==
//document.querySelectorAll("#header_holder > table > tbody > tr > td:nth-child(2) > a").forEach(element => { element.innerHTML = element.title ? element.title : element.innerHTML});

try {
    document.querySelectorAll("#header_holder > table").forEach(element => { element.width = "1220";});
    document.getElementsByClassName("forum_header_border_normal")[0].setAttribute('width', 'max-content');
} catch (error) {console.error(error);};

const $position = document.querySelector("body");
$position.insertAdjacentHTML('afterend', '<div id="divFloat" style="position:absolute;"><img height="500px" id="minipics" src=""></div><div style="height:450px;"> </div>');
const gmFetch = (url, {method,headers,anonymous} = {}) => new Promise((onload, onerror) => {GM_xmlhttpRequest({url, method, headers, anonymous, onload, onerror})});
const parseHTML = (str) => {const tmp = document.implementation.createHTMLDocument(); tmp.body.innerHTML = str; return tmp;};

const YYSchedule = async() => {
    try {
        document.querySelectorAll("#header_holder > table > tbody > tr > td:nth-child(1) > a").forEach(element => {
            var hrefs = element.href.split("/");
            element.childNodes[0].title = "https://eztvx.to/ezimg/thumbs/" + hrefs[5] + "-" + hrefs[4] + ".jpg";
            element.addEventListener("mouseover", () => {
                document.querySelector("#minipics").src = element.childNodes[0].title;
                document.querySelector("#divFloat").style.setProperty("Left", (window.event.pageX + 20 || window.event.clientX + scrollX + 20) + "px");
                document.querySelector("#divFloat").style.setProperty("Top", (window.event.pageY + 20 || window.event.clientY + scrollY + 20) + "px");
                document.querySelector("#divFloat").style.setProperty("display", "block");
            });
            element.addEventListener("mouseout", () => {
                document.querySelector("#divFloat").style.setProperty("display", "none");
            });
        })
    } catch (error) {console.error(error);}

    try {
        const $position = document.querySelector("#header_holder");$position.style="display, inline-block;position: absolute;left: 50%;transform: translate(-50%, 0px);";
        const html = '<div id="lside" style="float: left; position: absolute; left: 0px;top: 138px;width:'+(screen.width-1300)/2+'px;">'
			+'<a href="/calendar/" class="forum_thread_header" style="color:#c0dbf6"><b>Aired today on EZTV 今日播放:'
            +new Array(" Sunday 星期天", " Monday 星期一", " Tuesday 星期二", " Wednesday 星期三", " Thursday 星期四", " Friday 星期五", " Saturday 星期六")[new Date().getDay()] + '</b></a>'
            +document.getElementsByClassName("section_header_column")[1].innerHTML + '<div style="height:520px;"> </div></div>';
        $position.insertAdjacentHTML('afterend', html);
    } catch (error) {console.error(error);}

    try {
        const res = await gmFetch('https://www.yysub.cc/tv/schedule', {method: 'GET', anonymous: true, headers: {'User-Agent': 'Android'},});
        const yysubs = parseHTML(res.responseText).getElementsByClassName("ihbg");
        var array = Array.from(yysubs);
        array.forEach(element => {element.innerHTML = element.innerHTML.toString().replaceAll('/resource', 'https://www.yysub.cc/resource');});
        const yysub = array[new Date().getDate() - 1].innerHTML;
        const $position = document.querySelector("#header_holder"); //if (!$position) return;
        const html = '<div id="rside" style="float:right; position:relative; top:136px; display:block;"><div>'
            +document.getElementsByClassName("section_header_column")[2].innerHTML + '</div><br><div>' + document.getElementsByClassName("section_header_column")[3].innerHTML + '</div><br><div>' + yysub
             + '</div></div><style>.start{display:inline-block;color:#FFFFFF;background:#39BB66;border-radius:4px;}.new{display:inline-block;color:#FFFFFF;background:#3866C5;border-radius:4px;}'
             + '.completed{display:inline-block;color:#FFFFFF;background:#EF4238;border-radius:4px;}.end{display:inline-block;color:#FFFFFF;background:rgb(72,94,105);border-radius:4px;}</style>';
        $position.insertAdjacentHTML('afterend', html);
    } catch (error) {console.error(error);}

    try {
        document.querySelectorAll("#lside > table > tbody > tr > td > a").forEach(element => {
            var hrefs = element.href.split("/");
            element.title = "https://eztvx.to/ezimg/thumbs/" + hrefs[5] + "-" + hrefs[4] + ".jpg";
            element.addEventListener("mouseover", () => {
                document.querySelector("#minipics").src = element.title;
                document.querySelector("#divFloat").style.setProperty("Left", (window.event.pageX + 20 || window.event.clientX + scrollX + 20) + "px");
                document.querySelector("#divFloat").style.setProperty("Top", (window.event.pageY + 20 || window.event.clientY + scrollY + 20) + "px");
                document.querySelector("#divFloat").style.setProperty("display", "block");
            });
            element.addEventListener("mouseout", () => {
                document.querySelector("#divFloat").style.setProperty("display", "none");
            });
        })
    } catch (error) {console.error(error);};

     //document.querySelectorAll("#header_holder > table")[1].remove();
    try {document.querySelector("#header_holder > table:nth-child(9)").remove();} catch (error) {}
    try {document.querySelectorAll("#header_holder > table > tbody > tr > td:nth-child(2) > a").forEach(element => { element.innerHTML = element.title ? element.title : element.innerHTML});} catch (error) {}
};
YYSchedule();

try {
    const douban = document.querySelector("#header_holder > div > table > tbody > tr > td > center > table > tbody > tr > td > a");
    const imdb = douban.href.split("/");
    const html = '<br><a href="https://search.douban.com/movie/subject_search?search_text=' + imdb[4] + '" target="douban">在豆瓣中搜索 ' + douban.text.replace(" on IMDb", "") + '</a>';
    const $position = douban;
    $position.insertAdjacentHTML('afterend', html);
} catch (error) {console.error(error);};
