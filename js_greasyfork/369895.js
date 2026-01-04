// ==UserScript==
// @name              Linkify·改
// @version           1.1.5.2
// @author            极品小猫
// @description        文本转超链接
// @en:description      Looks for things in the page that look like URLs but aren't hyperlinked, and converts them to clickable links.
// @include           *://*/*
// @exclude           http*://www.baidu.com/*
// @exclude           http*://www.google.com/*
// @exclude           http*://note.sdo.com/*
// @exclude           https://pan.baidu.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at            document-idle
// @grant             GM_addStyle
// @grant             GM_notification
// @grant             GM_registerMenuCommand
// @grant             unsafeWindow
// @namespace https://greasyfork.org/users/3128
// @license           GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/369895/Linkify%C2%B7%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/369895/Linkify%C2%B7%E6%94%B9.meta.js
// ==/UserScript==

function Linkify() {
    GM_addStyle('.newhref{border:2px dashed red!important;display:inline-block!important;padding:5px!important;margin:5px 0!important;}.newhref:hover{border-color:#E9aa2f!important;}');

    let matchRule = `[^\\s+"\\\'<>，\\[\\]（）\:\\*\\u4E00-\\u9FFF]`,
        urlRegexRule=[ //协议规则，正则模式，\需要转义\\
        `https?:\\/\\/[^\\/]+/?(${matchRule}+|$)`, //ALL，http通用规则
        '(?:https?:\\/\\/)?\\w+(%E7%82%B9|点)\\w+(%E7%82%B9|点)\\w+\\/[^\\s+"\\\'<>，\\[\\]（）\:\\*\\u4E00-\\u9FFF]+', //域名中包含中文 . → 点
        'https?:\\/\\/mega.nz\\/#!\w+![^\\s+"\'<>，\\]]+', //mega 专用规则
        'ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/', //ed2k专用规则
        'magnet:\\?xt=urn:btih:\\w{40}(&[\\w\\s]+)?' //magnet 专用规则
    ], urlRegexStr=urlRegexRule.join('|');
    var urlRegex=new RegExp(`\\b(${urlRegexStr})`,'ig'); //协议规则，正则模式，\需要转义\\

    //ed2k://|file|mura-041616_381.mp4|1874185231|E7D60A7A854CF7AE0FF77AC306808760|h=SYGOH7KKTWHJNA4OBVAEOANW27FT5RJE|/

    // tags we will scan looking for un-hyperlinked urls
    var allowedParents = [	//允许处理的文本的父标签
        "body",
        "code", "blockquote",
        "abbr", "acronym", "address", "applet", "b", "bdo", "big",
        "caption", "center", "cite",  "dd", "del", "div", "dfn", "dt", "em",
        "fieldset", "font", "form",  "i", "iframe",
        "ins", "kdb", "li", "object", "pre[not(contains(@class, 'brush'))]", "p", "q", "samp", "small", "span", "strike", "font",
        "s", "strong", "sub", "sup", "td", "th", "tt", "u", "var",
        "h1", "h2", "h3", "h4", "h5", "h6",
        'url','img'
    ];
    //[not(contains(@class, "brush"))]，避免与 SyntaxHighlighter 高亮插件冲突

    let allowedParentsRule = allowedParents.join(" or parent::");
    let xpath = `//text()[(parent::${allowedParentsRule}) and (contains(translate(., 'HTTP', 'http'), 'http') or contains(translate(., 'MAGNET', 'magnet'), 'magnet') or contains(translate(., 'ED2K', 'ed2k'), 'ed2k'))]`;

    var candidates = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
        if (urlRegex.test(cand.nodeValue)) {
            var span = document.createElement("span");	//为超链接创建span标签作为容器
            var source = cand.nodeValue;
            //console.log(cand);

            cand.parentNode.replaceChild(span, cand);

            urlRegex.lastIndex = 0;
            for (var match = null, lastLastIndex = 0; (match = urlRegex.exec(source)); )
            {
                span.appendChild(document.createTextNode(source.substring(lastLastIndex, match.index)));
                //console.log(match);

                if(/\.(?:gif|jpg|png|bmp|webp)(?:\?.+?)?$/.test(match[0])){//如果是图片链接，则创建有图片地址的连接
                    span.innerHTML='<img src="'+match[0]+'" class="newhref"/><br>';
                }

                var Mtxt=match[0];	//取得链接
                var Rtxt=/paco-\d{6}_\d{3}/i.test(Mtxt) ? Mtxt.replace(/paco-(\d{6}_\d{3})/i,'pacopacomama $1') : Mtxt;	//替换链接内容

                var a = document.createElement("a");
                a.href=Rtxt;
                a.className='newhref';
                a.target="blank";
                a.appendChild(document.createTextNode(decodeURIComponent(Rtxt)));
                span.appendChild(a);

                lastLastIndex = urlRegex.lastIndex;
            }

            span.appendChild(document.createTextNode(source.substring(lastLastIndex)));
            span.normalize();
        }
    }
}

function ViewIMG(){
    var oA=document.getElementsByTagName('a');
    for(var i in oA){
        //console.log(oA[i].href);
        if(!oA.selector('img')) {
            if(/\.(?:jpg|png|gif)$/i.test(oA[i].href)){
                oA[i].innerHTML+='<img src="'+oA[i].href+'">';
            }
        }
    }
}

function ViewVideo(){
    $('a[href*=".mp4"], a[href*=".m3u8"]').each(function(){
        $('<video controls preload>').attr({'src':this.href}).insertAfter(this);
    });
}

var Host=location.hostname.replace(/^www\./i,'').toLowerCase();
var paths=location.pathname;
var search=location.search;

if(localStorage['Linkify']){
    Linkify();
} else if(/(\/thread-\d+-)/i.test(paths)||/mod=viewthread/i.test(search)) {
    //DZ论坛监听
    Linkify();
    window.addEventListener('load', function(){
        addMutationObserver('#postlist', Linkify);
    });
}

function addMutationObserver(selector, callback, Kill) {
    var watch = document.querySelector(selector);

    if (!watch) return;
    var observer = new MutationObserver(function(mutations){
        var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0;});
        if (nodeAdded) {
            callback(mutations);
        }
    });
    observer.observe(watch, {childList: true, subtree: true});
}

function LS_Setting(conf_name, tips, fn){
    if(localStorage[conf_name]) {
        delete localStorage[conf_name];
        NotifMe('已关闭【自动】' + tips + '，\n请刷新页面。');
    } else {
        localStorage[conf_name]=true;
        NotifMe('已打开【自动】' + tips);
        fn();
    }
}

var NotifMe = function(text){
    GM_notification(
        {
            'text' : text,
            'timeout' : 5*1000,
            'image' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABgFBMVEX///8AAAAiIiIkJCT///8AAAD///////////////8AAAD///////////////8mJib///8GBgYDAwP///8MDAz///8JCQn///8ODg4cHBwZGRkUFBT///8REREhISH////AwMAeHh7///////9bW1tycnL///////////////8WFhYAAABcXFwrKyvGxsb///8fHx9xcXH////////X19f///////////////////////////////8/Pz9lZWWpqak8PDx6enrDw8Py8vL///9FRUVsbGx1dXWHh4eLi4ucnJyysrL////19fX///84ODhMTExPT09YWFhgYGCWlpaurq69vb3////MzMzo6Oj///////////////////////////////////////////////////8yMjI1NTVUVFSUlJSRkZGioqK6urrMzMzb29vs7Oz19fX///////9/f3+kpKShoaGhoaGsrKzQ0NDg4OD39/dUVFRZWVn///////+LY0rSAAAAgHRSTlOZAOvqjPuTkZeY+bOpnI7qifb3lfSk9Yrz7u7xn/Lssa3tt6bYy5CEd2fv/dfnrHrszLWrpIJVU1BGNRYI3dC44Mitmn/czsvFw72xoZqG4NvY1NO+t6+up6BuYVdNQTw6NykjFAsG5OPWwMC3saujoZ6DEsq6ura0o6KU2th0EeQqZS4AAAWWSURBVFjDtZf3U9swFMfdWLZl2XE84pGdkJKdpoWy96asQhmF7r333v3XK9lxHUAO3PWqH7iL8Oer9/SGJOZMyBi7e/N6pQwEAZQr12/eHQv7ji5wb3AgKks5uWjiUZRzkhwdGLx3WoGHI++KkpyOMh0jmpal4ruRh6cQGB8y8HoMZWCbjKHxkwRu8ZLJiAx1iIwp8be6Coy1JFkMwRloGJCRpdZYuMCddC4agvNAFQyoqADm0nfCBG7kZEjHBbD+aXlyeuLC8hdeNXM36ALVvjSdF8HBTEzntIyD/zx+zvM9VZrAtZ4Q8w17NcFlsmwED/Z8vP5kH/RcOy5QDeN5MIMsTPuDRdae7dsQCAyF871cEvPBiMX1WdAzdFhgNJcO5xOEZwspK54qsK6C9ZqXRjsFfq/J8ARes5pPt5qW5f5Am4q59r5DoJIL4y9wBdd+NL06x/NzX6YR+ZVFL1WpFQjc7ouewHM/SzYPIW+XziI8wepbgijd9gUeGbLYlc9yDaXkzSnKhI6nkok3gmw8agsM94XwvSjBkthz24rgz9qv4olI5Lz+CYh9w57AuGGKXdZnE9wiEIK0gpczxIcrAjSNcVdgRKLWHlji3PVTaAbzwbwwqWGvMtOMwUgjrsBAP80AdcXjM/qOzTPHBJwJaIj9A0TgPrX/gFdaCvMxR1tVgxAHLqBJRcQ96j4WGKR5APkneozknJafB/5kxyYW4nsK/iENYoF5mSJgT6GIu/65yu5z0GFCSZkmYUzFGOKXPH+GeRBN0wxY0Ei0nXOVPKp/DpwQQAOxrgeAbFw6+oAZ7adsAf+mkCT5u/xrVnNq6IUttnmlwZHETFqvFbdR948yw7QtAB+185FILbKet+IxHMgptc2fdfkIt2R7H0rDTPXqEeuJx/YlREK19T3BNd1Q5kEHz6LHRjszrlaZinzYeDgFecZ+TgSsKyDvWMRlKzknRH37WS2JHfCGXGHKxUM8WKwvAt6zIDMNy/spVwFnI1/y+dpF2/++WGaAeaR+aqgXbDzTs3irkgcl+2LSYbEWK5Y26+xRnjEBI5hH+0+CW1IPkm4ULqjixkv9PK4+tKtuowLb5gMBwRcI+AibrS+BhTgWSGj5DShsxl0fNvB/CzGfDwSAebR+Y4419W6FI+ZmrFlVfYa84lGwf3rS4wMXgk00vPolPfecyq/HHNarhdYKypLcfWvwYNvx+WAT/TCK6qWAJ8XAYdeJNfldnQg03/I4xt9KbTIIo59IYE+veWsSnoHKZN09ReofpvRIW4CBQWfxE8lPZWEuYQXrt9Men4fcpLLpuEnF0zq/NOwXE/iAAr6tsM0luUbrhbud3LJK4UkxeeWMNy1D+p+D+aB0e+s/5vc14lnBmlWO86Sc2w0FfCQ7lUVT5c68FHbtr7rjHiQTAs0Ded5vafYyx5Jg88ahm0VrX4/HSEahWUDhSUvzmirkr1gkdZ8ddlTNay4fwQUmUnjSVL22boiXM0Rgx6byXKPEU3jc1v2DxRAnHCKwolL5s4pAc8A/WMahCUuLJFv0C0A8PS+acNw/XBmcx6QLZ96A06+PD9fgeAerpIuy2pbihRtu7J3IB8f7mdsShE8cN+Ea31XB4G3wwnK680zUv2CQ0cqpO17D1h/vHMytrz5FqRN4KFU67kjv19aEpk4Q1kGxZjOuZ9kTeDm4ZJExKvHnNMeFsrUUuc1158W0NHr0ogle6nHC+YPNduGjfUPHr7p23kIR9i+fqjfC+Z4q7bINvi5wWjJL8ESKq10qhfK0yzaxgVc+LyR1PRNHmWbvRdWg8zDdVw15cEimKnxbeXp5YWZ2DpSYEL6Yu9HlySMKQDAgUAwxzHz85On+6GKgATFNx0Xy6PrHZ99/fHgGT98y/elbHnn4Hx7f//z8/wPVQMFGiQjPbgAAAABJRU5ErkJggg==',
        });
}

GM_registerMenuCommand('开/关【自动】文本转超链接', function(){
    LS_Setting('Linkify', '文本转超链接功能', Linkify)
});
GM_registerMenuCommand('开/关【自动】图片链接显示', function(){
    LS_Setting('LinkifyIMG', '图片链接显示', ViewIMG);
})

GM_registerMenuCommand('文本转链接', Linkify);
GM_registerMenuCommand('显示直连链接图片', ViewIMG);
GM_registerMenuCommand('显示直连视频', ViewVideo);