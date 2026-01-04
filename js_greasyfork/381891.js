// ==UserScript==
// @name         AcFun Area 63 Mobile
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  在手机版文章区添加简单的评论区、夜间模式等BUG
// @author       Approved233
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @match        *://m.acfun.cn/v/?ac=*
// @match        *://m.acfun.cn/list/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/xhook@1.4.9/dist/xhook.min.js
// @require      https://cdn.jsdelivr.net/npm/xss@1.0.3/dist/xss.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381891/AcFun%20Area%2063%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/381891/AcFun%20Area%2063%20Mobile.meta.js
// ==/UserScript==

var remoteScript = unsafeWindow.document.createElement('script');
remoteScript.src = 'https://cdn.jsdelivr.net/npm/xhook@1.4.9/dist/xhook.min.js?ts='+(+new Date());
remoteScript.defer = true;
remoteScript.onload = ()=>{
    xhook.before(function (handler) {
        handler.url = handler.url.replace('http:', 'https:');
        console.log(handler);
    });
};
document.body.appendChild(remoteScript);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hook() {
    if(!unsafeWindow.Zepto)
        return false;


    try{
        unsafeWindow.$.ajax = function(options) {
            console.log('hooked $.ajax for', options.url);
            if(options.url)
                options.url = options.url.replace('http:', 'https:');
            return jQuery.ajax(Object.assign({}, options));
        };
        return true;
    }catch(e){

    }
    return false;
}

let canHook = false;
let intervalId;

intervalId = setInterval(()=>{
    if(hook()){
        canHook = true;
    }
}, 1);

(async ()=>{
    while(!canHook){
        await sleep(1);
    }

    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        },
        url: `http://down.hualuoo.com:66/%E7%A7%81%E4%BA%BA%E4%BA%91/fangsi/acfun/dark.css?_=${GM_info.script.version}`,
        onload: function (res) {
            GM_addStyle(res.responseText);
        }
    });

    if(unsafeWindow.location.pathname === '/list/'){
        let system = unsafeWindow.system, a = system.handle, n = system.func, $ = unsafeWindow.$, $$ = unsafeWindow.$$;
        n.getList = function(e) {
            var t, s, l, i;
            switch (l = {
                sort: 4,
                pageNo: 1,
                pageSize: 20
            },
                    $.extend(l, e),
                    !1) {
                case !($.inArray(a.channelId, function() {
                    var e, n, s, l;
                    for (s = a.channelList,
                         l = [],
                         e = 0,
                         n = s.length; e < n; e++)
                        t = s[e],
                            l.push(t.id);
                    return l
                }()) > -1):
                    l.parentChannelId = a.channelId;
                    break;
                default:
                    l.channelIds = isNaN(a.channelId) ? 1 : a.channelId
            }
            return (a.sort || config.channel.sort) && (l.sort = a.sort || config.channel.sort),
                $$("#loading ").html('<i class="icon waiting"></i><span>正在加载数据...</span>').addClass("active"),
                $.inArray(a.channelId, a.alist) !== -1 && 71 !== a.channelId ? (a.type = "article",
                                                                                $$("#stage").addClass("article"),
                                                                                i = s = '<div class="item logunit" data-show="false" data-id="[ac]" data-num="[num]" data-ac="[ac]"><a href="[url]" target="_blank" class="inner"><div class="hint"><span class="[ccomms]">[comms]</span><span class="b">评论</span></div><h3 class="title">[title]</h3><p class="article-info"><span class="name">[name]</span> / <span class="time">[time]</span> / <span class="pts">[views]</span>人围观</p><p class="desc">[desc]</p></a></div>') : (a.type = "video",
            $$("#stage").removeClass("article"),
            s = '<div class="unit logunit" data-show="false" data-id="[id]" data-ac="[ac]" data-num="[num]"><a href="[url]" target="_blank" class="inner"><div class="l"><div id="[coverid]" class="cover"></div></div><div class="r"><div class="title"><h3>[title]</h3></div><div class="info"><p class="author">UP主：<span class="name">[name]</span></p><p class="pts">' + ("article" === a.type ? "点击" : "播放") + '：<span class="count">[views]</span></p></div></div></a></div>',
            i = '<div class="unit logunit" data-show="false" data-id="[id]" data-ac="[ac]" data-num="[num]"><a href="[url]" target="_blank" class="inner"><div class="l"><div style="background-image:url(\'[image]\')" class="cover"></div></div><div class="r"><div class="title"><h3>[title]</h3></div><div class="info"><p class="author">UP主：<span class="name">[name]</span></p><p class="pts">' + ("article" === a.type ? "点击" : "播放") + '：<span class="count">[views]</span></p></div></div></a></div>'),
                n.getListData(l).done(function(e) {
                var t, c, o, r, d, h, m, u, g, p, f, v, I, w, b, N, y, C, _;
                if (200 === e.code) {
                    if ($$("#stage").hasClass("loading") && $$("#stage").removeClass("loading"),
                        l.recommendSize && e.data.recommendPage && (w = e.data.recommendPage.list,
                                                                    $.isArray(w) && w.length)) {
                        for (b = "",
                             u = h = 0,
                             g = w.length; h < g; u = ++h)
                            t = w[u],
                                t.comments > 9999 && (t.comments = 9999),
                                r = t.contentId.replace("ac", ""),
                                _ = "/v/ac" + r,
                                $.inArray(t.channelId, a.alist) !== -1 && (_ = "/a/ac" + r),
                                C = "/v/?ac=" + r,
                                $.os.wp && $.browser.ie && (C = _),
                                b += i.replace(/\[comms\]/g, "article" === a.type ? t.comments : "").replace("[url]", C).replace("[id]", r).replace("[ac]", r).replace("[num]", u).replace("[image]", $.parseSafe(t.cover)).replace("[title]", $.parseSafe(t.title)).replace("[name]", $.parseSafe(t.user.username)).replace("[views]", $.parsePts(t.views)).replace("[time]", $.parseTime(t.releaseDate)).replace("[ccomms]", t.comments > 999 ? "c" : "a").replace("[desc]", $.parseSafe(null != (N = t.description) ? N.slice(0, 25) : void 0));
                        $$("#recom .mainer").html(b)
                    }
                    if (o = e.data,
                        f = o.list,
                        $.isArray(f) && f.length) {
                        for (a.totalPageCount || (a.totalPageCount = parseInt(o.totalCount / o.pageSize) + 1),
                             d = "",
                             u = m = 0,
                             p = f.length; m < p; u = ++m)
                            c = f[u],
                                r = c.contentId.replace("ac", ""),
                                C = "/v/?ac=" + r,
                                _ = "/v/ac" + r,
                                $.inArray(c.channelId, a.alist) !== -1 && (_ = "/a/ac" + c.contentId),
                                $.os.wp && $.browser.ie && (C = _),
                                "video" === a.type && (a.contentCount++,
                                                       I = {
                                id: "cover-" + a.contentCount,
                                img: $.parseSafe(c.cover)
                            },
                                                       a.contentList.push(I)),
                                c.comments > 9999 && (c.comments = 9999),
                                d += s.replace(/\[comms\]/g, "article" === a.type ? c.comments : "").replace("[url]", C).replace("[id]", r).replace("[ac]", r).replace("[num]", u).replace("[title]", $.parseSafe(c.title)).replace("[name]", $.parseSafe(c.user.username)).replace("[views]", $.parsePts(c.views)).replace("[time]", $.parseTime(c.releaseDate)).replace("[ccomms]", c.comments > 999 ? "c" : "a").replace("[coverid]", "cover-" + a.contentCount).replace("[desc]", $.parseSafe(null != (y = c.description) ? y.slice(0, 50) : void 0));
                        return $$("#content .mainer").append('<div class="part">' + d + "</div>"),
                            $$("#stage").hasClass("loading") && $$("#stage").removeClass("loading"),
                            a.totalPage > 4 && !$.browser.ie && (
                            v = window.pageYOffset - a.partHeight),
                            a.firstList ? ($("#btn-more-list").length || $$("#content").append('<div id="btn-more-list"><button>加载更多...</button></div>'),
                                           a.scrollStarted || n.handleScroll(),
                                           a.flagMoreList = !1,
                                           a.firstList = !1,
                                           a.partHeight = $$("#content .mainer").find(".part").height() + 12) : a.flagMoreList = !0,
                            a.pageNo++,
                            a.totalPage++,
                            $$("#loading").removeClass("active"),
                            n.loadImage()
                    }
                    return a.firstList && $("#btn-more-list").length && $("#btn-more-list").hide(),
                        $$("#loading").text("没有更多结果了。")
                }
            }).fail(function() {
                return $$("#loading").html('加载失败(つд⊂)<a class="retry" onclick="location.reload()">重试</a>'),
                    a.flagMoreList = !0
            })
        }
        return;
    }

    let urlParams = new URLSearchParams(unsafeWindow.location.search);
    let acId = urlParams.get('ac');

    unsafeWindow.acInvoke.jumpToApp = () => {
        console.log('hooked jumpToApp');
    };
    $('.gradient').click();
    $('.comment-img').remove();
    $('.comment-title').parent().append('<div id="area-comment"><div id="area-comment-inner"><div class="comment-list"></div></div></div>');
    $('<link>').appendTo('head').attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: '//cdn.aixifan.com/acfun-pc/2.5.98/css/comm-floor.min.css'
    });
    $('.to-app-region').each(function() {
        $(this).insertAfter($(this).parent().find('.content'));
    });

    let regex = /globalConfig\s+=\s+([^}]+})/g;

    let currentPage, isLoading;

    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        },
        url: `https://www.acfun.cn/a/ac${acId}`,
        onload: function (res) {
            let html = res.responseText.replace(/\n/g, ' ');
            $('head').append(`<script>window.globalConfig = ${regex.exec(html)[1].replace(/ /g, '')}</script>`);
            fetchComment(1);
            $(window).scroll(function() {
                if($(window).scrollTop() + $(window).height() == $(document).height()) {
                    fetchComment(currentPage + 1);
                }
            });
        }
    });

    function fetchComment(page){
        if(isLoading)
            return;

        currentPage = page;
        isLoading = true;
        GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
            },
            url: `https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=${acId}&sourceType=1&page=${currentPage}`,
            responseType: 'json',
            onload: function (res) {
                isLoading = false;
                let comments = parseFloorList(res.response.commentIds, res.response.commentsMap);
                buildCommentArea(comments)
            }
        });
    }

    function parseFloorList(commentIds, commentsMap){
        let alreadyParse = [],
            finalFloors = [];

        let maxStacks = 2000;

        for(let cid of commentIds){
            let comment = commentsMap[`c${cid}`];
            alreadyParse.push(comment.cid);
            let r = [{
                comment: comment,
                isRepeated: false,
                isMainComment: true,
                isParallel: false
            }];

            let quoteId = comment.quoteId;

            for(let stack = 0; stack < maxStacks; stack++){
                let quoteComment = commentsMap[`c${quoteId}`]
                if(!quoteComment)
                    break;

                r.push({
                    comment: quoteComment,
                    isRepeated: alreadyParse.indexOf(quoteId) >= 0,
                    isMainComment: false,
                    isParallel: stack > 10
                });

                quoteId = quoteComment.quoteId;
            }

            finalFloors.push(r);
        }

        return finalFloors;
    }

    function buildCommentArea(comments){
        let list = $('.comment-list');
        comments.forEach(comment => {
            for(let i in comment){
                let subComment = comment[i];
                if(i == 0)
                    list.append(buildComment(subComment.comment));
                // else {
                //     if(subComment.isRepeated){
                //         var d = new s(o).getQuotedComment();
                //         o.isParallel ? i.getNode().before(d.getNode()) : i.getNode().prepend(d.getNode()),
                //         i = d
                //     }
                // }
            }
        })
    }

    function buildComment(comment){
        return $('<div/>').addClass('main-comment-item').append($('<li/>').addClass('avatar').append(buildAvatar(comment))).append($('<li/>').addClass('content').append(buildBasicComment(comment)));
    }

    function buildBasicComment(comment){
        return $('<div/>').addClass('comment-item').attr({
            'data-cid': comment.cid
        }).append(buildNameBar(comment)).append(buildContent(comment));
        //, buildContent(comment), buildFooter(comment)
    }

    function buildNameBar(comment){
        let name = filterXSS(comment.userName),
            verifiedHtml = "";

        if(comment.verified != 0){
            let verifiedTitle = "";
            switch(comment.verified){
                case 1:
                    verifiedTitle = '猴子';
                    break;
                case 2:
                    verifiedTitle = '猴山官方认证';
                    break;
                case 3:
                    verifiedTitle = '猴山认证'
                    break;
            }
            verifiedHtml = `<li><span class="verified-ico verified-${comment.verified}" title="${verifiedTitle}"></span></li>`
        }

        let numberFloorHtml = `<li><span class="comment-floor">#${comment.floor}</span></li>`;
        let nameColor = "";
        switch(comment.nameRed){
            case 1:
            case 10:
                nameColor = 'nameRed';
                break;
            case 9:
                nameColor = 'nameOrange';
                break;
            case 8:
                nameColor = 'namePurple';
                break;
        }

        let nameHtml = `<li><a class="name ${nameColor}" data-uid="${comment.userId}">${name}</a></li>`;

        return $(`<div class="comment-name-bar"><ul>${numberFloorHtml}${nameHtml}${verifiedHtml}</ul></div>`);
    }

    function buildContent(comment){
        let parseContent = (content = comment.content)=>{
            let c = content;
            c = c.search(/(?:\[[^\]]*?\[)|(?:\][^\[]*?\])/) ? c : c.replace(/\[.*?\]/g, "").replace(/\[|\]/g, "");
            c = c.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/(&quot;|&#34;)/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/<br\s?\/?>/g, "").replace(/((\s|&nbsp;)*\r?\n){3,}/g, "\r\n\r\n").replace(/^((\s|&nbsp;)*\r?\n)+/g, "").replace(/((\s|&nbsp;)*\r?\n)+$/g, "");
            c = c.replace(/\[p\]/g, "<p>").replace(/\[\/p\]/g, "</p>");
            c = c.replace(/\[ac\=(\S+?)\](\S+?)\[\/ac\]/g, '<a class="ac title" data-aid="$1" href="/v/ac$1" target="_blank"><i class="icon icon-play-circle"></i>$2</a>').replace(/\[aa\=(\S+?)\](\S+?)\[\/aa\]/g, '<a class="aa " href="/a/aa$1" target="_blank" title="该链接通向AcFun合辑"><i class="icon icon-list"></i>$2</a>').replace(/\[sm\=(\S+?)\](\S+?)\[\/sm\]/g, '<a class="sm" href="http://www.nicovideo.jp/watch/sm$1" target="_blank" title="该链接通向ニコニコ动画"><i class="icon icon-film"></i>$2</a>').replace(/\[email\](\S+?)\[\/email\]/g, '<a class="email " href="mailto:$1" target="_blank" title="点击以发送邮件"><i class="icon icon-envelope"></i>$1</a>').replace(/\[wiki\=(\S+?)\](\S+?)\[\/wiki\]/g, '<a class="wiki " href="http://wiki.acfun.cn/index.php/$1" target="_blank" title="该链接通向AC百科"><i class="icon icon-tag"></i>$2</a>');
            c = c.replace(/\[emot\=(\S+?)\,(\S+?)\/\]/g, '<img class="emotion" src="' + globalConfig.oldPath + '/umeditor/dialogs/emotion/images/$1/$2.gif">')
            c = c.replace(/\[acimg.*?\](.*?)\[\/acimg\]/g, '<img src="$1" class="comment-thumbnail"/>');
            c = c.replace(/\[img\](\S+?)\[\/img\]/g, '<a class="btn-img" href="$1" target="_blank" title="点击以浏览图像"><img src="$1" class="comment-thumbnail"/></a>').replace(/\[img\=(\S+?)\](\S+?)\[\/img\]/g, function(t, e, i) {
                var n, o;
                return n = i.replace(/javascript(:|\s+:)/gi, ""),
                    o = n.match(/.*(acfun.tv|acfun.cn|tudou.acfun.com)/) ? "" : n,
                    '<a class="btn-img" href="' + o + '" target="_blank" title="点击以浏览图像"><img src="' + o + '" class="comment-thumbnail"/></a>'
            }),
                c = c.replace(/\[at\]([\s\S]+?)\[\/at\]/g, '<a class="name" target="_blank" href="/member/findUser.aspx?userName=$1">@$1</a>').replace(/\[\/?back.*?\]/g, "").replace(/\[username\]([\s\S]+?)\[\/username\]/g, '<a  class="name" target="_blank" href="/member/findUser.aspx?userName=$1">$1</a>').replace(/\[.*?\]/g, "").replace(/([\s\W\_])[o|O][n|N]\w+?\s*?\=/g, "$1data-event="),
                $.trim(content),
                c = c.replace(/&amp;/g, "&").replace(/&#91;/g, "[").replace(/&#93;/g, "]")
            return c;
        }
        return $(`<div class="comment-content">${parseContent()}</div>`)
    }

    function buildAvatar(comment){
        let defaultAvatar = `${unsafeWindow.globalConfig.oldPath}/style/image/avatar.jpg`,
            avatar = defaultAvatar;
        if(comment.headUrl && comment.headUrl.length > 0)
            avatar = comment.headUrl[0].url;

        let node = $('<a/>').addClass('avatar');

        let avatarNode = $('<img/>').attr({
            class: 'avatar',
            src: avatar,
            'data-name': comment.userName
        });
        avatarNode.one("error", function() {
            $(this).attr("src", defaultAvatar);
        });
        node.append(avatarNode);

        if(comment.avatarFrame)
            node.append($('<img/>').addClass('avatar-bg').attr({
                src: comment.avatarImage
            }))

        return node;
    }
})();


