// ==UserScript==
// @name         Google：多引擎同屏
// @namespace    http://userscripts.org/users/86496
// @version      2.0.2
// @description  在Google搜索页面同时显示多个搜索引擎的结果
// @author       hzhbest
// @match        https://www.google.com/*
// @icon         https://www.google.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      www.baidu.com
// @connect      www.so.com
// @connect      www.sogou.com
// @connect      cn.bing.com
// @connect      s.weibo.com
// @connect      www.izito.com
// @connect      duckduckgo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/4633/Google%EF%BC%9A%E5%A4%9A%E5%BC%95%E6%93%8E%E5%90%8C%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/4633/Google%EF%BC%9A%E5%A4%9A%E5%BC%95%E6%93%8E%E5%90%8C%E5%B1%8F.meta.js
// ==/UserScript==


(function () {

    if (window.top.document.location.href != window.self.document.location.href) return; // 在iframe中则不运行

    setTimeout(init, 500);                          //首次运行

    //判断并推进主进程，重新观察
    function init() {
        var thisurl = document.location.href;
        var kw = getUriParam(thisurl, 'q');
        // log('kw: ', kw);
        if (!kw) return;
        // https://www.google.com/search?q=AAAA&tbs=cdr%3A1%2Ccd_min%3A4%2F11%2F2012%2Ccd_max%3A4%2F11%2F2013
        let tbs = getUriParam(thisurl, 'tbs');
        var arri, dateset;
        if (!!tbs) arri = tbs.match(/\d{1,2}\%2F\d{1,2}\%2F\d{4}/g);  // 提取网址中的时间数组
        if (!!arri) {
            dateset = arri.map(ds => ggdateTOdate(ds)); // 有时间范围则引入到多引擎加载中
            console.log('dateset: ', dateset);
            go(kw, dateset);
        } else {
            go(kw);
        }
    }

    //主进程
    function go(kw, dateset) {

        //  ===设置开始=========================================================================

        // > 是否只在第一页显示（true ／ false）
        var onlyPageOne = true;

        //  **以下一行并非设置项，请勿修改！ //如果只在第一页显示则在非第一页的页面直接退出
        if (onlyPageOne && getUriParam(document.location.href, 'start') > 0) return;

        // > 直接展示的搜索结果数量（个）；一般小于等于10，因为一般搜索结果一页就10项
        var resultNumber = 3;

        // > 搜索结果的显示高度（像素）；小于此高度的将按实际高度显示，大于此高度的在鼠标移上时展开；
        //     要想不收缩显示，将该值设得较大（例如1000）即可
        var disHeight = 120;

        // > 与主搜索结果的水平间距（像素）
        var lgap = 50;

        // > 获取搜索结果最长尝试（超时）时间（秒）。
        var resultTimeout = 30;

        var xEngs = [

            // > 外部搜索引擎（提取结果信息线索）
            // 说明： xEngs[x].name - 搜索引擎的名字（用作标识）
            //		  xEngs[x].enable - 启用开关，1－启用，0－禁用
            //		  xEngs[x].boxname - 同屏结果框元素的 ID
            //		  xEngs[x].url - 搜索引擎的搜索 Url，其中“--keyword--”用于替换实际搜索关键词
            //		  xEngs[x].resultcss - 指向每条搜索结果的 css selector
            //		  xEngs[x].em - 搜索引擎对关键词强调的 css selector
            //        xEngs[x].timepara - 搜索引擎自由指定始末时间的URL参数模版
            //        xEngs[x].timeformat - 用于将时间对象转换为始末时间格式的函数
            //		  x - 显示顺序。放在前面的搜索引擎靠上显示结果

            {
                name: 'Baidu',
                enable: 1,
                boxname: "bdResult",
                url: 'https://www.baidu.com/s?wd=--keyword--',
                resultcss: '#content_left>div[class*="result"][id]:not([tpl="recommend_list"])',
                em: 'em',
                timepara: '&gpc=stf%3D--sdate--%2C--edate--%7Cstftype%3D2',
                timeformat: function (dateobj) {
                    return dateobj / 1000;
                }
            },
            {
                name: '360',
                enable: 1,
                boxname: "360Result",
                url: 'http://www.so.com/s?ie=utf-8&q=--keyword--',
                resultcss: '#main li.res-list',
                em: 'em'
            },
            {
                name: 'Bing',
                enable: 1,
                boxname: "bingResult",
                url: 'http://cn.bing.com/search?q=--keyword--',
                resultcss: 'li.b_algo',
                em: 'strong',
                timepara: '&filters=ex1%3a%22ez5_--sdate--_--edate--%22',
                timeformat: function (dateobj) {
                    const d0 = Date.parse('1970-1-1');
                    const msxd = 24 * 60 * 60 * 1000;
                    return (dateobj - d0) / msxd;
                }
            },
            {
                name: 'Sogou',
                enable: 1,
                boxname: "sogouResult",
                url: 'http://www.sogou.com/web?query=--keyword--',
                resultcss: 'div.results>div>div.struct201102',
                em: 'em'
            },
            {
                name: 'GoogleCN',
                enable: 0,
                boxname: "gcnResult",
                url: 'http://www.google.com.hk/search?q=--keyword--',
                resultcss: 'div#rso div.g',
                em: 'em',
                timepara: '&tbs=cdr%3A1%2Ccd_min%3A--sdate--%2Ccd_max%3A--edate--',
                timeformat: function (dateobj) {
                    let d = dateobj.getDate();
                    let m = dateobj.getMonth();
                    let y = dateobj.getFullYear();
                    return d + '%2F' + m + '%2F' + y;
                }
            },
            {
                name: 'Weibo',
                enable: 0,
                boxname: "weiboResult",
                url: 'https://s.weibo.com/weibo?q=--keyword--',
                resultcss: 'div#pl_feedlist_index>div>div.card-wrap'
            },
            {
                name: 'izito',
                enable: 0,
                boxname: "izitoResult",
                url: 'https://www.izito.com/search?q=--keyword--',
                resultcss: 'li.organic-results__item.organic-results-item',
                em: 'strong'
            }
        ]
        //  ===Config END | 设置结束=========================================================================


        var _ID = 'resultPlus';     //同屏结果主框架ID
        var _xID = '#' + _ID;

        var b;  //同屏结果主框架

        // 页面框架提取
        var bctn = qElem('div#rcnt');          //主搜索结果容器；该容器未载入时继续等待
        if (!bctn) { setTimeout(go, 300); return; }
        var lcol = qElem('div#center_col');       //搜索结果条目容器；以此容器位置确定插入同屏结果位置
        var lmar = (!!lcol) ? (getX(lcol) + lcol.offsetWidth + lgap) : (window.innerWidth * 0.56);    //插入同屏结果的左边缘
        var b_width = Math.min(504, window.innerWidth - lmar - 30); //同屏结果的宽度
        var wcol = lcol.offsetWidth;

        // 样式表
        //同屏结果主框架位置大小和底色
        var bxstyle = _xID + '{position:absolute; top:100px; left:' + lmar + 'px; background:white; z-index:300; width:' + b_width + 'px;'
            + ' line-height: 130%; border-bottom:1px solid #AACCFF;}';
        //分引擎框架样式
        var xestyle = _xID + ' .xe{border-top:1px solid #7799cc; padding: 1px 3px 3px 4px; '
            + 'background:linear-gradient(5deg, rgba(170, 204, 255,0.1) 0%, rgba(255, 255, 255,0.7) 100%),linear-gradient(0deg, rgba(255,255,255,0.65) 0%, rgba(127, 127, 203,0.3) 10%, rgb(170, 204, 255) 100%);}';
        //分引擎名称样式
        var exstyle = _xID + ' ._external {color: #6868b0 !important;}'
            + _xID + ' ._external:after {content:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAFVBMVEVmmcwzmcyZzP8AZswAZv////////9E6giVAAAAB3RSTlP///////8AGksDRgAAADhJREFUGFcly0ESAEAEA0Ei6/9P3sEcVB8kmrwFyni0bOeyyDpy9JTLEaOhQq7Ongf5FeMhHS/4AVnsAZubxDVmAAAAAElFTkSuQmCC");}';
        //关闭按钮样式
        var clstyle = _xID + ' .close{position: absolute; top: 0; right: 0; padding: 0 10px;}'
            + _xID + ' .close:hover{outline: 1px solid #731616; outline-offset: -1px; background-color: #F28E8E!important; color: #731616!important;}';
        //刷新链接样式
        var rfstyle = _xID + ' ._refresh{display: none; margin: 0 10px;}'
            + _xID + ' .xe:hover ._refresh{display: inline-block;}'
        //同屏搜索结果通用样式
        var glo_style = 'body{overflow: auto !important; min-height: 1200px;}'  /*不加这个在百度自己搜索结果太少时会使同屏结果显示不全 */
            + _xID + ' p, ' + _xID + ' ul {margin: 0; padding:0;}'
            + _xID + ' li{list-style: none outside none;}'
            + _xID + ' a{color: #2626A8;}'
            + _xID + ' a div>div{display: inline;}' /*链接中的图片之类*/
            + _xID + ' svg{height: 14px !important; width: 14px !important;}' /*svg图片限制大小；通常是图标*/
            + _xID + '>div>*{height: auto!important;}' /*收缩搜索结果自带高度*/
            /*同屏结果框架样式*/
            + _xID + ' div._result{max-height:' + disHeight + 'px; margin-bottom:5px; background:white; overflow:hidden; transition: height, max-height 2.5s ease-out 1s;}'
            + _xID + ' div._result:hover{max-height: 100000px; margin-bottom:0px; padding-bottom:5px; background: #F0F7F9; transition: height, max-height 0.2s ease-out; outline: 1px solid #82BDCE;}'
            + _xID + ' div._result h3, ' + _xID + ' div._result h2{font-size:13pt!important; font-weight: 800; border-bottom: 1px solid white; margin-bottom:2px;}'
            + _xID + ' div._result:hover h3, ' + _xID + ' div._result:hover h2{border-bottom: 1px solid #a7cDd6;}'
            /*更多结果框架样式*/
            + _xID + ' ._resultMore{max-height: none!important;}'
            + _xID + ' ._re_hide>div,' + _xID + ' ._no_result{display:none;}'
            + _xID + ' ._re_more{display: block; height: 20px; width: 100%; text-align: center; background: #ddd; cursor: pointer;}'
            + _xID + ' ._re_more:hover{background: #F0F7F9!important;}'
            + _xID + ' ._re_hide ._re_more{background: white;}'
            + _xID + ' div._result+div._result,' + _xID + ' ._resultMore{border-top: 1px solid #aaccff;}';
        //应付搜索结果特殊元素变样的样式
        var tablestyle = _xID + ' td{padding: 5px 0 5px 13px !important; color: #000!important; width: fit-content !important;}'
            + _xID + ' tr+tr>td{padding: 0px 0 8px 13px !important;}' + _xID + ' td>h3{margin-left: -8px; line-height: 1.3em;}';
        var li_style = _xID + ' div._result>li {padding: 5px 0 8px 13px !important; background-image: none;}'
            + _xID + ' li h3>a:first-child,' + _xID + ' li h3>em {font-size: 13pt !important; margin-left: -8px;}'
            + _xID + ' li>div, ' + _xID + ' li>p {font-size: small;}';
        //特殊结果：与主搜索结果相同
        var mat_style = _xID + ' div._match {background: #eee; background:linear-gradient(to bottom, #eee, white); max-height:1.1em;}' + _xID + ' div._match:hover{max-height: 1000px;}'
            + '._hilire{background: #ffd!important; background: linear-gradient(to bottom, #ffd, white)!important;}'
        //同屏搜索结果-引擎专属样式
        var _w;
        var gg_style = /*Google style*/`
            .xhjkHe{max-width: ${wcol}px !important;}
            #rhs {position: fixed; left: 10px; bottom: 10px; transform-origin: bottom left; transform: scale(0.45); background: white; transition: all 0.2s 1s; max-height: 60vh; overflow-y:auto;}
            #rhs:hover {transition: transform 0.3s; transform: scale(1); box-shadow: 0 0 6px -1px #333; padding: 5px; z-index: 9999999;}
            `;
        _w = 'div[id^="bingResult_"] ';
        var bg_style = /*Bing style*/ _w + '.crch,' + _w + '.sb_tsuf{display:none!important;}'
            + _w + 'h2{margin:5px 0;}' + _w + '.inner,' + _w + '.HeroTab{display: none;}'
            + _w + 'div.tptt{background: #e9e9ffed; width: fit-content; outline: 1px solid #bac4e0; border-radius: 1em; padding: 1px 0.5em;}';
        _w = 'div[id^="sogouResult_"] ';
        var sg_style = /*Sogou style*/ _w + '>div {padding: 7px 0 8px 13px !important;background-image:none;} '
            + _w + '>div>h3 {margin-left:-8px;} '
            + _w + '.img-height{float: right;} '
            + _w + '.tit-ico {background-position: left 1px;background-repeat: no-repeat;padding-left: 20px;}'
            + _w + '.item-list{display: grid; grid-template-columns: auto auto auto auto auto auto auto auto auto;}'
            + _w + '.citeurl{position: sticky; bottom: 3px; background: #e9e9ffed; width: fit-content; outline: 1px solid #bac4e0; border-radius: 1em; padding: 1px 0.5em;}';
        _w = 'div[id^="360Result_"] ';
        var sz_style = /*360 style*/ _w + 'h3>a>img {width:16px !important; height:16px !important; float: none !important;}'
            + _w + 'img {float: right;}'
            + _w + 'li:hover div>a>img {float: none;}'
            + _w + '.g-linkinfo{position: sticky; bottom: 3px; background: #e9e9ffed; width: fit-content; outline: 1px solid #bac4e0; border-radius: 1em; padding: 1px 6px !important;}';
        _w = 'div[id^="weiboResult_"] ';
        var wb_style = /*Weibo style*/ _w + 'div.menu,' + _w + '.WB_video_h5 {display: none;} '
            + _w + 'div.media{max-height: 200px; overflow: hidden;}' + _w + 'div.media:hover{overflow: auto; scrollbar-width: thin;} '
            + _w + 'div.avator{width: fit-content; float: left;} '
            + _w + 'div.avator img{float: left; margin: 3px; height:32px; width:32px;} '
            + _w + 'img.face{height:18px !important; width:18px !important;} '
            + _w + '.card-act{position: sticky; bottom: 3px; left: 300px; background: #e9e9ffed; width: fit-content; border-top: 1px solid #bac4e0;}'
            + _w + '.woo-font--retweet{margin-left: 1em; display: inline-block; height: 16px !important; content:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2NCA2NDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDY0IDY0IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMxMzQ1NjM7fQo8L3N0eWxlPjxnPjxnIGlkPSJJY29uLUV4dGVybmFsLUxpbmsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM4Mi4wMDAwMDAsIDM4MC4wMDAwMDApIj48cG9seWxpbmUgY2xhc3M9InN0MCIgaWQ9IkZpbGwtMTE4IiBwb2ludHM9Ii0zNTIuMywtMzQzLjQgLTM1NC42LC0zNDUuNyAtMzI4LjgsLTM3MS40IC0zMjYuNiwtMzY5LjIgLTM1Mi4zLC0zNDMuNCAgICAiLz48cG9seWxpbmUgY2xhc3M9InN0MCIgaWQ9IkZpbGwtMTE5IiBwb2ludHM9Ii0zMjYsLTM1NC45IC0zMjkuNCwtMzU0LjkgLTMyOS40LC0zNjguNiAtMzQzLjEsLTM2OC42IC0zNDMuMSwtMzcyIC0zMjYsLTM3MiAgICAgIC0zMjYsLTM1NC45ICAgICIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0tMzM0LjYtMzI0aC0zNC4zYy0yLjgsMC01LjEtMi4zLTUuMS01LjF2LTM0LjNjMC0yLjgsMi4zLTUuMSw1LjEtNS4xaDE4Ljl2My40aC0xOC45ICAgICBjLTAuOSwwLTEuNywwLjgtMS43LDEuN3YzNC4zYzAsMC45LDAuOCwxLjcsMS43LDEuN2gzNC4zYzAuOSwwLDEuNy0wLjgsMS43LTEuN1YtMzQ4aDMuNHYxOC45Qy0zMjkuNC0zMjYuMy0zMzEuNy0zMjQtMzM0LjYtMzI0ICAgICAiIGlkPSJGaWxsLTEyMCIvPjwvZz48L2c+PC9zdmc+");} '
            + _w + '.woo-font--comment{margin-left: 1em; display: inline-block; height: 16px !important; content:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIxMDBweCIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iLTI0NyAzNzAuOSAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IC0yNDcgMzcwLjkgMTAwIDEwMDsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTS0xNDcuNywzOTAuNGMtMC4zLTUuNS00LjctOS44LTEwLTkuOGgtNzguOGMtNS42LDAtMTAuMSw0LjYtMTAuMSwxMC4ydjQyLjNjMCw1LjUsNC42LDEwLjIsMTAuMSwxMC4yaDIuM3YxNC4xDQoJCWMwLDEuNSwwLjgsMi44LDIuMiwzLjRjMC42LDAuMywxLjEsMC40LDEuNywwLjRjMSwwLDEuOS0wLjQsMi42LTEuMWwxNy4zLTE2LjloNTIuOGM1LjQsMCwxMC00LjcsMTAtMTAuMnYtNDIuNkwtMTQ3LjcsMzkwLjR6DQoJCSBNLTE1Mi43LDQzMy4xYzAsMi44LTIuMyw1LjItNSw1LjJoLTU0LjhsLTE2LjcsMTYuM3YtMTYuM2gtNy4zYy0yLjcsMC01LjEtMi40LTUuMS01LjJ2LTQyLjNjMC0yLjgsMi4zLTUuMiw1LjEtNS4yaDc4LjgNCgkJYzIuNywwLDQuOCwyLjIsNSw1VjQzMy4xeiIvPg0KCTxwYXRoIGQ9Ik0tMjIyLjcsMzk5LjJoNTAuNWMxLjQsMCwyLjUtMS4xLDIuNS0yLjVsMCwwYzAtMS40LTEuMS0yLjUtMi41LTIuNWgtNTAuNWMtMS40LDAtMi41LDEuMS0yLjUsMi41bDAsMA0KCQlDLTIyNS4yLDM5OC4xLTIyNC4xLDM5OS4yLTIyMi43LDM5OS4yeiIvPg0KCTxwYXRoIGQ9Ik0tMjIyLjcsNDA4LjdoNTAuNWMxLjQsMCwyLjUtMS4xLDIuNS0yLjVsMCwwYzAtMS40LTEuMS0yLjUtMi41LTIuNWgtNTAuNWMtMS40LDAtMi41LDEuMS0yLjUsMi41bDAsMA0KCQlDLTIyNS4yLDQwNy42LTIyNC4xLDQwOC43LTIyMi43LDQwOC43eiIvPg0KCTxwYXRoIGQ9Ik0tMjIyLjcsNDE4LjJoNTAuNWMxLjQsMCwyLjUtMS4xLDIuNS0yLjVsMCwwYzAtMS40LTEuMS0yLjUtMi41LTIuNWgtNTAuNWMtMS40LDAtMi41LDEuMS0yLjUsMi41bDAsMA0KCQlDLTIyNS4yLDQxNy4xLTIyNC4xLDQxOC4yLTIyMi43LDQxOC4yeiIvPg0KCTxwYXRoIGQ9Ik0tMjIyLjcsNDI3LjdoMjkuNmMxLjQsMCwyLjUtMS4xLDIuNS0yLjVsMCwwYzAtMS40LTEuMS0yLjUtMi41LTIuNWgtMjkuNmMtMS40LDAtMi41LDEuMS0yLjUsMi41bDAsMA0KCQlDLTIyNS4yLDQyNi42LTIyNC4xLDQyNy43LTIyMi43LDQyNy43eiIvPg0KPC9nPg0KPC9zdmc+DQo=");} '
            + _w + 'button{border: 0; background: transparent; margin-left: 1em;}'
            + _w + '.card-top{float: right; margin-right: 6px;}' + _w + '.card-top h4{margin: 0;}'
            + _w + 'ul{display: grid; grid-template-columns: auto auto auto auto auto auto auto auto auto;}' + _w + 'ul>li{display: inline;} ' + _w + 'ul>li img{top:0 !important;}'
            + _w + '.thumbnail{min-height:0 !important;} ' + _w + '.card-wrap{padding: 10px;} ' + _w + '.info{float: left;}' + _w + '.info span{vertical-align: middle;}'
            + _w + '.from{width: 150px; float: right; height: 1.3em; overflow: hidden;}' + _w + '.from:hover{overflow: visible; background: #e3f5f1;}'
            + _w + '.txt{clear: both;}';


        var hl_styles = new Array();    //高亮样式数组
        var xEng_boxes = new Array();   //同屏搜索结果分引擎框架

        for (const i in xEngs) {
            if (xEngs[i].enable == 1) {
                xEngs[i].url = xEngs[i].url.replace('--keyword--', kw);        //替换搜索关键词到引擎网址
                console.log('xEngs[i].url: ', xEngs[i].url);
                if (!!xEngs[i].timepara && !!dateset) {                        // 若多引擎支持时间范围且主引擎使用了时间范围
                    let sdate = xEngs[i].timeformat(dateset[0]);
                    let edate = xEngs[i].timeformat(dateset[1]);
                    let timepara = xEngs[i].timepara.replace('--sdate--', sdate).replace('--edate--', edate);
                    xEngs[i].url += timepara;
                    xEngs[i].dateset = "[ " + dateTOymd(dateset[0]) + " - " + dateTOymd(dateset[1]) + " ] ";
                }
            }
            if (!!xEngs[i].em) {
                hl_styles[i] = _xID + ' div[id^="' + xEngs[i].resultcss + '_"] ' + xEngs[i].em;
            }   //形成高亮样式
        }
        var hili_style = hl_styles.join(',') + '{color: #CC0033 !important; background: #fffcec;}';


        // 插入 CSS
        var headID = document.getElementsByTagName("head")[0];
        var cssNode = creaElemIn('style', headID);
        cssNode.type = 'text/css';
        cssNode.id = '__xEngs';
        cssNode.innerHTML = hili_style + bxstyle + xestyle + clstyle + rfstyle + glo_style + exstyle + tablestyle + li_style + mat_style + gg_style + bg_style + sg_style + sz_style + wb_style;

        // 提取Google搜索结果
        var resls = qaElem('div#rso>div>div>div');        //Google各条搜索结果
        var ggRes = [], ggResUrls = [], ggResNo = 0;
        // var speIDs = /imagebox_bigimages|imagebox|newsbox|videobox|blogbox/;
        for (let h = 0; h < resls.length; h++) {
            // if (speIDs.test(resls[h]).id) continue;
            var gglnk = qElem('span>a', resls[h]);
            if (!gglnk) continue;
            ggResUrls.push(gglnk.href.toLowerCase());               //提取主链接网址推入结果网址数组
            ggResNo++;
            resls[h].title = '第 ' + ggResNo + ' 结果';
            ggRes.push(resls[h]);                                   //推入结果数组
        }

        // 准备同屏搜索结果主框架
        b = creaElemIn('div', document.body);
        b.id = _ID;
        // 构建关闭按钮
        var close = creaElemIn('a', b);
        close.href = '#';
        close.className = 'close';
        close.addEventListener('click', () => {
            headID.removeChild(cssNode);
            document.body.removeChild(b);
        }, false);
        close.innerHTML = 'X';
        close.title = '关闭';

        // 按启用的多引擎构建结果框并获取搜索结果填入
        for (const i in xEngs) {
            if (xEngs[i].enable == 1) {
                xEng_boxes[i] = new Array();
                resultbox(b, xEng_boxes[i], xEngs[i], resultNumber);    //构建同屏各搜索引擎结果框架
                addresult(xEng_boxes[i], xEngs[i], resultNumber);       //插入搜索结果节点
            }
        }


        // FUNCTIONS

        // 构建一个搜索引擎结果框架
        function resultbox(root, box, engObj, rescnt) { //root：供插入引擎结果的主框架，box：供写入引擎结果的盒框架，engArr：供写入引擎标志的信息数组，rescnt：先显的结果数
            var c, d, e, f, r;
            //引擎名称框
            c = creaElemIn('div', root);
            c.className = 'xe';
            c.id = engObj.boxname;
            //引擎跳转链
            d = creaElemIn('a', c);
            addtext(d, engObj.name + ' ' + (engObj?.dateset || ''));
            d.href = engObj.url;
            d.target = '_blank';
            d.className = '_external';
            // 引擎刷新链
            r = creaElemIn('a', c);
            r.className = '_refresh';
            addtext(r, "刷新结果");
            r.addEventListener('click', () => {
                addresult(box, engObj, rescnt);
            }, false);
            //先显结果框
            for (let k = 0; k < rescnt; k++) {
                box[k] = creaElemIn('div', root);
                box[k].id = engObj.boxname + '_' + (k + 1);
                box[k].innerHTML = (k == 0) ? '正在获取结果...' : '...';
            }
            //后显结果框
            if (rescnt == 10) return;
            e = creaElemIn('div', root);
            e.className = '_resultMore _re_hide';
            e.id = engObj.boxname + 'More';
            for (let k = rescnt; k < 10; k++) {
                box[k] = creaElemIn('div', e);
                box[k].id = engObj.boxname + '_' + (k + 1);
            }
            //后显结果展开按钮
            f = creaElemIn('a', e);
            f.className = '_re_more';
            f.innerHTML = '↓展开↓';
            f.title = '展开更多结果';
            f.href = '#' + engObj.boxname;
            f.addEventListener('click', function (ev) {
                ev.preventDefault();
                var s = (this.parentNode.className == '_resultMore _re_hide');
                this.parentNode.className = (s) ? '_resultMore ' : '_resultMore _re_hide';
                this.innerHTML = (s) ? '↑收起↑' : '↓展开↓';
                this.title = (s) ? '收起更多结果' : '展开更多结果';
            }, false);
        }

        // 发送请求并转递返回数据
        function addresult(box, engObj, rescnt) { //box：供写入引擎结果的盒框架，engArr：供写入引擎标志的信息数组，rescnt：先显的结果数
            var timeout = function () {
                for (const i in box) {
                    set(box[i], (i == 0) ? '* 获取结果超时 *' : '');
                }
            };
            var errortimer = setTimeout(timeout, resultTimeout * 1000);

            var option = {
                method: "GET",
                url: engObj.url,
                onload: function (_h) {
                    clearTimeout(errortimer);
                    var _Node = document.createElement('div');
                    _Node.innerHTML = _h.responseText;              //包含整个页面的div
                    initresult(_Node, box, engObj.name, engObj.resultcss, rescnt);
                }
            }
            GM_xmlhttpRequest(option);
        }

        // Initialize results
        function initresult(_Node, box, engName, resSelector, rescnt) { //_Node：需处理的搜索结果，box：供写入引擎结果的盒框架，engName：引擎名称，resSelector：从搜索结果中提取单条搜索结果的选择器，rescnt：先显的结果数
            var _result = [], _resultLinkHref;
            var no_result_con = "* 无返回结果，请尝试直接访问 *";
            for (let i = 0; i < 10; i++) {
                _result[i] = (i == 0) ? no_result_con : '';      //初始化搜索结果临时容器
            }
            var _ns = qaElem(resSelector, _Node);               //按选择器提取的搜索结果数组
            for (let i = 0, j = 0; i < 12; i++) {                   //遍历搜索结果数组，排除特殊内容，放入临时容器，以j为索引
                var _n = _ns[i];
                //log(engName+" i "+i);
                if (_n == null) { //log(engName+" j "+j);
                    if (j <= rescnt && rescnt != 10) box[rescnt].parentNode.className = '_no_result';   //若无结果需要放入后显结果框，则包含展开按钮的后显结果鵟直接不显示
                    break;
                } else {  //log(engName+" j "+j);

                    //GCN url fix
                    if (engName == 'GoogleCN') fixgcn(_n);

                    //Google url fix
                    if (engName == 'Google') fixgl(_n);

                    //360 img flx
                    if (engName == '360') fixso(_n);

                    //Bing img url fix
                    if (engName == 'Bing') {
                        fixbmg(_n);
                        if (!_n.firstChild || (!_n.firstChild.firstChild && !_n.firstChild.nextSibling) || (_n.firstChild.localName == 'script' && !_n.firstChild.nextSibling)) continue;
                    }

                    //链接都在新标签页打开
                    var _resultLinks = _n.getElementsByTagName('a');
                    for (const o in _resultLinks) {
                        if (!!_resultLinks[o].href && /\:\/\//.test(_resultLinks[o].href)) {
                            _resultLinks[o].target = '_blank';
                        }
                    }

                    //处理图片框架
                    var _imgs = _n.getElementsByTagName('img');
                    for (const o in _imgs) {
                        if (!!_imgs[o].src && _imgs[o].src.indexOf('data:') == 0) {
                            _imgs[o].parentNode.style = 'width: fit-content; height: fit-content;';
                        }
                    }

                    //将处理后的结果放入临时容器
                    _result[j] = getoutterHTML(_n);

                    //检查同屏引擎搜索结果的主链接和主引擎搜索结果，找出同归结果
                    if (!_resultLinks[0]) continue;     //跳过无链接的结果
                    if (!!_resultLinks[0].href) {
                        _resultLinkHref = _resultLinks[0].href.toLowerCase();
                        for (const p in ggResUrls) {
                            if (_resultLinkHref == ggResUrls[p] || _resultLinkHref + '/' == ggResUrls[p]) {  //deal with bing's result url
                                box[j].className = '_match';
                                _result[j] = '同 Google 第 <b>' + (Number(p) + 1) + '</b> 结果' + _result[j];
                                if (ggRes[p].className.indexOf('_hilire') == -1) {
                                    ggRes[p].className += ' _hilire';
                                    ggRes[p].title += '；同时为 ' + engName + ' 第 ' + (j + 1) + ' 结果';
                                } else {
                                    ggRes[p].title += '及 ' + engName + ' 第 ' + (j + 1) + ' 结果';
                                }
                            }
                        }
                    }
                    j++;
                    if (j == 10) break;
                }
            }
            for (let i = 0; i < 10; i++) {      //将临时结果转入结果框
                set(box[i], _result[i]);
                if (_result[i]) box[i].className += ' _result';
            }
        }


        // 修复360懒图片
        function fixso(_resultcontent) {
            var imgs = qaElem('.so-lazyimg', _resultcontent);
            if (!imgs.length) return;
            for (const i in imgs) {
                if (!!imgs[i].dataset && !!imgs[i].dataset.isrc) imgs[i].src = imgs[i].dataset.isrc;
            }
        }

        // "修复"GoogleCN链接
        function fixgcn(_resultcontent) {
            var Links = qaElem('a', _resultcontent);
            for (const i in Links) {
                if (Links[i].href && Links[i].href.match(/^http:\/\/www\.google\..*\/url\?q=/i)) {
                    Links[i].href = Links[i].href.replace(/^http:\/\/www\.google\..*\/url\?q=(.*?)&.*/i, "$1");
                }
            }
        }

        // "修复"Google链接
        function fixgl(_resultcontent) {
            var Links = qaElem('a', _resultcontent);
            for (const i in Links) {
                if (Links[i].href && Links[i].href.indexOf('/') == 0) {
                    Links[i].href = 'https://www.google.com/' + Links[i].href.slice(1);
                }
            }
        }

        // 修复Bing图片地址
        function fixbmg(_resultcontent) {
            var Imgs = qaElem('img', _resultcontent);
            for (const i in Imgs) {
                if (Imgs[i].src && Imgs[i].src.indexOf('http://') != 0 && Imgs[i].src.indexOf('data:') != 0) {
                    Imgs[i].src = 'http://www.bing.com' + Imgs[i].src;
                }
            }
        }
    }


    //
    /** 从url中提取名为【param】的参数的值；提取不到返回空字符
     * @param {string} surl 网址
     * @param {string} param 参数名称
     * @returns {string} 参数值
     */
    function getUriParam(surl, param) {
        var result = surl.match(new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)"));
        return result ? result[3] : '';
    }

    function ggdateTOdate(string) { // 4%2F11%2F2012
        return new Date(string.replaceAll("%2F", '/'));
    }

    // 将日期对象转成“YYYY-MM-DD”格式
    function dateTOymd(odate) {
        return odate.getFullYear() + "-" + twodg(odate.getMonth() + 1) + "-" + twodg(odate.getDate());
    }

    // 补足两位数字
    function twodg(s) {
        if (s.length == 1) {
            s = "0" + s;
        }
        return s;
    }

    function log() {	//debug
        var args = Array.prototype.slice.call(arguments);
        console.log.apply(console, args);
    }


    // Create and insert an element
    function creaElemIn(tagname, destin) {
        var theElem = destin.appendChild(document.createElement(tagname));
        return theElem;
    }

    // scroll node into view
    function scrTo(node) {
        if (!node) return;
        if (node.getBoundingClientRect) {
            var pos = node.getBoundingClientRect();
            /*var pos_h = node.offsetHeight;*/
            document.documentElement.scrollTop = document.body.scrollTop = pos.top + window.pageYOffset - window.innerHeight / 10;
        } else {
            node.scrollIntoView();
        }
    }

    // Set content
    function set(elem, str) {
        elem.innerHTML = str;
    }

    // Get full HTML nodes in string
    function getoutterHTML(elem) {
        var a = elem.attributes, str = "<" + elem.tagName, i = 0; for (; i < a.length; i++)
            if (a[i].specified) str += " " + a[i].name + '="' + a[i].value + '"';
        if (!canHaveChildren(elem)) return str + " />";
        return str + ">" + elem.innerHTML + "</" + elem.tagName + ">";
    }
    function canHaveChildren(elem) {
        return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(elem.tagName.toLowerCase());
    }

    // Add text node
    function addtext(obj, text) {
        var content = document.createTextNode(text);
        obj.appendChild(content);
    }

    function qElem(cssSelector, root) {
        let _r = root || document;
        return _r.querySelector(cssSelector);
    }

    // get all elements by css selector
    function qaElem(cssSelector, root) {
        let _r = root || document;
        return _r.querySelectorAll(cssSelector);
    }

    // get the accumulative offsetleft of target element
    function getX(oElement) {
        var iReturnValue = 0;
        while (oElement != null) {
            iReturnValue += oElement.offsetLeft;
            oElement = oElement.offsetParent;
        }
        return iReturnValue;
    }


})();