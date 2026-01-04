// ==UserScript==
// @name        Ginoa Tools
// @description 右クリックから便利なScriptを呼び出す
// @author      GinoaAI
// @namespace   https://greasyfork.org/ja/users/119008-ginoaai
// @version     2.7
// @match       *://*
// @match       *://*/*
// @match       *://*/*/*
// @include     http://*
// @include     https://*
// @include     http://*/*
// @include     https://*/*
// @include     http://*/*/*
// @include     https://*/*/*
// @icon        https://pbs.twimg.com/profile_images/1099150852390977536/nvzJU-oD_400x400.png
// @run-at      document-end
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/374204/Ginoa%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/374204/Ginoa%20Tools.meta.js
// ==/UserScript==

var body = document.body;
var menu = body.appendChild(document.createElement("menus"));
menu.outerHTML = '<menu id="GinoaTools" type="context">\
                    <menu label="Ginoa Tools">\
                    <menuitem id="ArchiveSearch" label="Archive Search"\
                              icon=" data:image/png;base64,\
                              iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAB0UlEQVRIx8WWSyiEURiGh7EguaxIIcUws1DKPashLIQNyrhFFgob\
                              YxRqIkoTZWdFYcNsSFjY2NiLshsrNiiXsiD398+bvo7zM/TLqaepp3f+b+Z85zszNlv4KxJkgxqQAiJsFqxoUAy8YA2cgVfyAkJg\
                              EXQDF7CH89BEUA0mwC64FQ8Nh3OwAQZBKT/kpzUAtizErStSB4IWkqErMvTD7fmOPF2RQjAOAtxXLxkGM3z1CnxgGvgVPwUmQZJZ\
                              8494cpzCjfCTjSnZKvpt5fA8gauvTtgJ31gkXIBuVsk20O8Jl0p3D6LMilwzVCHcHN28ku2kPxDOSWd8m3hdAWOY7hiqFX6JbkXJ\
                              99GHhMsXjdf2JAY8MNAofJBuXckP0p8KVyaKpOmKxIFHBlqEX9c0WB6Ic+Hcokim2bXyxECH8Jt0O0reT38pXKUokvNvReR2tYax\
                              XaP0F8KViyJZZlf7nzfeziEyAvXCL9OtKvl++mPhCkSRZLNhvPliGBeUbBf9oXCu74bxp9dK42+vlX023yGcj5fmqJI1mvys9CqB\
                              t8aZWYF04AHtoFmhQ+OamfUoro3D7NAVabL4R6tXLRBre/+r02Mh9Zy9j5XLGbGaEuPhb5FuBO3PWbDSAAAAAElFTkSuQmC\
                              C"></menuitem>\
\
                    <menuitem id="ReTweetHide" label="ReTweet Hide"\
                              icon="data:image/png;base64,\
                              iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABkklEQVRIx2MQrd69UXbRl7+0wuLtp48zgDkLP/2nJR61hD6WGK/6\
                              /D9x77f/Plu+/pcj1RK5RZ/+p+z7hldT97kf/3///Q8HZ1/9+Z+2/9v/pTd//bdd94WwJVZrv/z/++///8ZTP7BakAB0PTYA1PJ/\
                              1e1f/6N3fSNsCcglMLDj4W+wpcjym+//+o8LnHjx57/Wss+ELZEHBtfN94iw+AVkbgdaVnj4+3/XTV/+H3n2G6cl1uu/EBcnhis/\
                              g4Pqx+9//0kBINVGqz4TZ4neis9g15MKPv74R1oSnnX1J8mWbHnwmzRLQMm47/yP/59/Eh9kcXu+kZ4ZDz39/f8fkXaA8gnIYSRb\
                              Yr7m8//Lb/4QtODrr3//nTd+Ib9YASXnxpOouRsZfAe6IXbPN9LLLlBmDNz29X/xke//dz/6Dc792MDDT3//+wPVkVVA6iz//L8T\
                              WDY9+Pj3P7r5IAuvv/37vw7oO5UlVCiFZYDYdPXn/2E7vv5PBAZJ0Pav//WBeUh6tNIaHpaA2kW0tEBq0p0HALXsPROX9mw0AAAA\
                              AElFTkSuQmCC"></menuitem>\
\
                    <menuitem id="AdFlySkipper" label="AdFly Skipper"\
                              icon="data:image/png;base64,\
                              iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAEFUlEQVRIx72Wj1OTdRzH/U8SdYC4MZKoDg10eHjqXUcR2FV3RSVl\
                              Vk4tOeBIIqTi8AcUOMAfGGFo2oLJr0sQhI2jbQwWOpgI+/Vsg4dtsEc2tsHefZ8HorxOHPTjuXvd9jz3fT6v7+fHc8+zDv/DsS6U\
                              RUYnA/qhF8H/QjLrC0BrdUBtmYLW5sIDB4PAQvDflbC7l+nMaLhnRqveij6LA/cmZ1YtWlFiY7y4fteMa0NmXOWwoH2MxjDNLK+Z\
                              J0Kzi4FjlpQzGKIkuJTBJBGM0G5c+c2M77VmfKe14PKgBTWE1gc06FkfGJ8f3WM2NJNs+0w0Zrz+0DNxzM7B6vZAT3pQQ4JfJIHP\
                              D1hQRZBoLKgcoKCgptFMSvjj0GKmbaN2WGY8oUsY0nD2BtO0Bxe0FM6RwOWEb/oplKopnCF8q6FwaXBxAyw/j0zAML0KyQIprplI\
                              jISf9DTOkqCnCSUqCsVKCl8RviSw18v6WSyQknV2UsJVNd5J6jtOdqaZYFCsWgx68lcKBYR8wok+CoXsNcLXaivaTdOYf0znHyth\
                              p9TknsOoy4uGMSc+Xwr82V+o66lDtbwJtcOTsM361zbCfmLS01O4a2xB1Z1fkKcwPSIZ6HoHLaUxeCM9Gbc7OtYmUSqVGNZIoBqU\
                              oqDyMnIktTivlJOe6DnJkU/3Y9P6MGx8aj33WyWRrE6ikMvxRe7rYGzXcbNJho6ubqjUMthN50DdFyM7Nw2RkVGc4A/it/JgH+8N\
                              TeLz+SBKTMR9ZQ4UnTXoutMDijLBN9WEOWsxOm6kLmfAEr4hDEUfbgHVKIBLnr6yxGgwQFJRgeysLLy4OwZe42EUncxD9YUa9PdJ\
                              4bNXwmM6jn27hMsCfsQGNJ8Vwq0Rw+9UYUb1HuaZ0ZUzkTU2gr85Cscyn4VVk45X0vbjQOZB9LTlEKkYvTdfwkY2CwIvLAwNp4Rw\
                              diYjOO/l7veMXYTXIn1yuSrKy5F9MA4j7Xsh2pmEPXv2orshDQ+HU1CS9wKiIiI5st4Wgm6LATN0Alfr63FULIa7/zAneqJEp9Mh\
                              I1UA061ERPMFiH16KxqrRaQUSfg4I547j4uNxVB9LOhWIWbUHyBpx04UHdtNzgUk4x9Cm65DmW/B2hKHpG1bsDk8AmXZz8Bx+zkc\
                              eC0B2+K348207SQLkklrNIe2LhoTzXzyn4/AtDY0iWF8HDdOJ6LwUDQiNvHwbiqfK81HGSKIRLtQeCRhWcDung3O4pKnLr0wQnwY\
                              KaMOOqkIwqhwDrMsBoVH2R7tQ1luwlLwPwVTt55HwK1b/YfEgteOS2WfIJLHQ22BAPUlO5CS8jLO5CY/mkHvqwgw+rV/rXDv+wkr\
                              lJ1XYFDkIz+/ANWlx8kgvE8m7hT8DuXfSrQmyT85fgdO6IC0cvHTHAAAAABJRU5ErkJggg=="></menuitem>\
                  </menu>';

body.setAttribute("contextmenu", "GinoaTools");



document.querySelector("#ArchiveSearch").onclick = Script => {
    var url = location.href;
    GM_openInTab("http://web.archive.org/web/*/" + (url) + "*");
}



document.querySelector("#ReTweetHide").onclick = Script => {
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.ReTweetHide {display: none;}');

function ReTweetHideNow() {
    const svgIcons = document.querySelectorAll('article svg:first-child');
    const retweetIcons = [...svgIcons].filter(icon => icon.innerHTML.match(/M23\.615/));
    const getRetweet = (element) => {
        const count = element.parentNode.childElementCount;
        return count < 5 ? getRetweet(element.parentNode) : element;
    }
    const retweets = retweetIcons.map(icon => {
        return getRetweet(icon);
    });
    for (let i = 0; i < retweets.length; i++) {
        ;
        const retweet = retweets[i];
        retweet.classList.add('ReTweetHide');
    }
}

ReTweetHideNow();

document.getElementsByClassName("ReTweetHide")[0].parentNode.setAttribute("id", "TweetList");
var target = document.getElementById('TweetList');
function example() {
    ReTweetHideNow();
}
var mo = new MutationObserver(example);
mo.observe(target, {
    childList: true
});
}



document.querySelector("#AdFlySkipper").onclick = Script => {
var AdFlyUrl = location.href;
var AdFlyGoto = decodeURIComponent(AdFlyUrl.replace(/.*?\&.*?=(https?(%3A%2F%2F|:\/\/).*?)(&.*)?$/, "$1"));
window.location.href = AdFlyGoto;
}