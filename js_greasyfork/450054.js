// ==UserScript==
// @name        去广告 
// @namespace   VIP
// @grant       none
// @version     5.0
// @include /^https?:\/\/(?!(?:[^\/]+?\.)?(?:(?:ggpht|qpic|gstatic|[yg]timg|youtu|google)|(?:jd|tmall|taobao|meizu|asus|nike|vmall|fliggy|adidas|gome|\w*?suning|liangxinyao|xiaomiyoupin)\.))(?:www\.ixigua\.com\/\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[avw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/(?:v\/|.+?\/index\.shtml)|m\.tv\.sohu\.com\/|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/|[vm]\.pptv\.com\/show\/|(?:[^\/]+?\.)?1905\.com\/(?:m|.*?play)\/|www\.ixigua\.com\/|player\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/|www\.youku\.com\/|\w+?\.youku\.com\/$|vip\.1905\.com\/|m\.ixigua\.com\/|[^\/]*?cupfox\.|pan.baidu.com\/share\/init\?surl=.+?&pwd=.+|www\.bumimi.+?\/search\/|(?:greasyfork|sleazyfork)\.org\/.+?\/(?:users\/|scripts(?:\/by-site\/|$|\?))|www\.(?:douyin|kuaishou)\.com\/|haokan\.(?:baidu|hao123)\.com\/v|quanmin\.baidu\.com\/v|m\.baidu\.com\/video\/|www\.similarsites\.com\/site\/|[^\/]+?m1907\.|my\.qiqtv\.|www\.zhaojiaoben\.cn\/|(?:www\.wbdyba\.com|www\.ikukk\.com)\/|[^\/]+?\/(?:tv|acg|mov|zongyi)\/|(?:m\.)?music\.migu\.cn\/|kg\.qq\.com\/node\/|www\.yinyuetai\.com\/play\?id=|(?:y\.)?music\.163\.com\/|(?:(?:bd|www)\.)?kuwo\.cn\/|m\.kuwo\.cn\/newh5|www\.kugou\.com\/(?:song|mvweb)\/|m3ws\.kugou\.com\/(?:kgsong|mv)\/|m\.kugou\.com\/|(?:i\.)?y\.qq\.com\/|(?:www|h|m)\.xiami\.com\/|5sing\.kugou\.com\/|(?:www|m)\.ximalaya\.com\/|www\.app-echo\.com\/|radio\.sky31\.com\/|www\.1ting\.com\/|(?:www|m)\.9ku\.com\/play\/|www\.lrts\.me\/playlist|[^\/]+?\/(?:play|share)\/[a-zA-Z0-9]+?$|(?!.+?https?(?::\/\/|:\\\/\\\/|%3A%2F%2F)).+?\/\w+?\.php\?(?:url|rul|vid)=[^\/]+?$|.+?(?:douyinvod.+?\/video\/|\.mp3|(?:\/upic\/20|\.bdstatic\.).+?\.mp4|(?:&submit=|(?:\/vod\/\d{3,8}|detail\/(?:[^\/]+?\/[^\/]+?|\d{3,8})|p(?:lay|h)\/(?:(?:\d+?[\-_]){0,}|id\/.+?\/sid\/\d+?\/nid\/)\d+?|play\/(?:[^\/]+?\/){1,}[^\/]+?|vip)\.html|(?:detail\/\d{3,8}|play\/(?:\d+?[\-_]){0,}\d+?)\/|(?:\.(?:php|html)\?|=vod-search&)wd=[^\/]+|\/(?:vod\/detail|htm_data).*?\/\d{4,8}\.html|(?:\/embed\/(?:\d+?\/){0,}\d+|\/[^\/]*?video[^\/]*?\.php\?id=\d+)(?:#\w+)?|\/[^\/]*?lay[^\/]*?(?:\/[^\/]+?)?\.html)$|[\?&](?:url|rul)=(?!http).{5,}|\/linkjump\/[^\/]{123,}$|\/(?!(?:so\.|[^\/\.]*?search))(?:\w+?|\W+?)\.php\?(?:jx|url|rul|v?id|v)=(?:[^\/]+?$|https?(?::\/\/|:\\\/\\\/|%3A%2F%2F))|(?:search|jx|url|rul|ref|v?id|v|&[^\/]+?|_\w+?|\.html(?:\?\w+?)?)(?<!referrer)[&#=\?]https?(?::\/\/|:\\\/\\\/|%3A%2F%2F)(?:[^\/]+?\.(?:ixigua|youku|miguvideo|fun|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun)\.|.+?\.(?:m3u8|mp4|flv))|\d+?&type=(?:ximalaya|1ting)|&title=(?:.+?=https?(?::\/\/|:\\\/\\\/|%3A%2F%2F)|[^\/]+?$)|\?eps=\d+?&jx=))/
// @author      YJP
// @description 2023/11/12 上午10:13:35
// @downloadURL https://update.greasyfork.org/scripts/450054/%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450054/%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    // 需要隐藏的元素数组
    const clearElementArr = [
        // 在这里添加元素
        '腾讯', '.at-feed-stream-header','.at-feed-stream-tab','.playlist-side__sub','.page-content__bottom','._footer-wrap_yjuq2_1',
        '优酷', '.root-boh','.nav-mamu-new','.gFooter_3CQ3Z','#app > div > div.play-top-container-new > div.l-container-new > div > div > div.listbox-new > div.right-wrap > div.contents-wrap.contentsNode > div.fee-wrap-new.full-mode','.surround-wrap',
        '爱奇艺', '.qy-player-side-list',
         ];

    console.log("准备隐藏以下元素 >>> " + clearElementArr);
    
    function pageC(clearElements) {
        if (!Array.isArray(clearElements)) {
            console.error("param error, require array!");
            return;
        }
        
        const style = document.createElement("style");
        style.innerText = clearElements.map(cE => `${cE} {display: none !important;}`).join(" ");
        document.head.appendChild(style);
    }

    pageC(clearElementArr);
    console.log("清理完成！");
})();