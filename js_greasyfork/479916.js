// ==UserScript==
// @name         浏览器就有知乎点击记录、以及软文广告相关关键词屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license GPL
// @description  try to take over the world!
// @author       Zjsxwc
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @require       https://static.hdslb.com/js/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-umd-min.js
// @downloadURL https://update.greasyfork.org/scripts/479916/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B0%B1%E6%9C%89%E7%9F%A5%E4%B9%8E%E7%82%B9%E5%87%BB%E8%AE%B0%E5%BD%95%E3%80%81%E4%BB%A5%E5%8F%8A%E8%BD%AF%E6%96%87%E5%B9%BF%E5%91%8A%E7%9B%B8%E5%85%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479916/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B0%B1%E6%9C%89%E7%9F%A5%E4%B9%8E%E7%82%B9%E5%87%BB%E8%AE%B0%E5%BD%95%E3%80%81%E4%BB%A5%E5%8F%8A%E8%BD%AF%E6%96%87%E5%B9%BF%E5%91%8A%E7%9B%B8%E5%85%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
(function() {

    window.pushTheZhihuHistory = function(data) {
        let title = data.title;
        let url = data.url;
        const nurl = new URL(url);
        document.title = title;
        history.pushState({}, "", nurl);
    }
    function hookClick() {
      $("div:not([title]).RichContent.is-collapsed").each(function(index,elem){
          let p = $(elem).parent();
          let title = p.find("h2").text();
          if (!title) {console.log("no title");return;}
          let m = p.find("meta[itemprop='url']")[1];
          if (!m) {
              m = p.find("meta[itemprop='url']")[0];
          }
          let url = $(m).attr("content");
          if (!url) {console.log("no url");return;}
          if (url.indexOf("zhuanlan.zhihu.com") > -1) {
              url = "https://www.zhihu.com/?url=" + url;
              //https://link.zhihu.com/?target=http%3A//zhuanlan.zhihu.com/p/656687442
              //url = "https://link.zhihu.com/?target=" + encodeURIComponent(url);
          }
          if (url.indexOf("https") === -1) {
              url = "https:" + url;
          }

          let data = {title:title, url:url};
          data = JSON.stringify(data);
          $(elem).attr("onclick",  "javascript:pushTheZhihuHistory("+data+");");
      });
    }
    hookClick = _.debounce(hookClick, 1000);
    hookClick();

    // 广告相关关键词屏蔽
    // 黑名单的分组
    let blacklist = {
        "电子产品": [
            "学习机",
            "电视",
            "手机 and 推荐 and 购买",
            "手机 and 哪个好",
            "洗衣机",
            "oppo",
            "投影仪",
            "耳机",
            "一体机",
            "净水器",
            "油烟",
            "家电",
            "华为",
            "空调",
            "入手",
            "浴霸",
            "音响",
            "沐浴",
            "净化",
            "净水",
            "空气消毒机",
            "扫地机",
            "马桶",
            "按摩",
            "拼多多 and 赚",
            "AR and 眼镜"
        ],
        "健康和美容": [
            "头发",
            "发量",
            "植发",
            "甲醛",
            "护眼",
            "法令纹",
            "脱发",
            "护肤品",
            "鼾 or 呼噜",
            "须刀",
            "牙齿",
            "烟酰胺",
            "护肤",
            "隆胸",
            "美白",
            "口臭",
            "洗发水",
            "鼻子",
            "沐浴露",
            "牙刷"
        ],
        "工作和学习": ["教程", "做抖音", "做自媒体", "兼职", "副业"],
        "其他": [
            "推荐",
            "流量卡",
            "测评 or 横评",
            "为何如此受欢迎",
            "赚到 and 万元",
            "为什么 and 没 and 效果",
            "！ or 就够了",
            "买"
        ]
    }
    ;


    // 词法分析
    function tokenize(expression) {
        return expression.split(/(and|or|\(|\))/).map(e => e.trim()).filter(e => e);
    }

    // 语法分析
    function parse(tokens) {
        function parseExpression() {
            let node = parseTerm();
            while (tokens[0] === "and") {
                tokens.shift();
                let right = parseTerm();
                node = { type: "AND", left: node, right: right };
            }
            return node;
        }

        function parseTerm() {
            let node = parseFactor();
            while (tokens[0] === "or") {
                tokens.shift();
                let right = parseFactor();
                node = { type: "OR", values: [node, right] };
            }
            return node;
        }

        function parseFactor() {
            let token = tokens.shift();
            if (token === "(") {
                let node = parseExpression();
                tokens.shift(); // pop ")"
                return node;
            }
            return token;
        }

        return parseExpression();
    }

    // 逻辑表达式的求值
    function evaluate(node, content) {
        if (node.type === "AND") {
            return evaluate(node.left, content) && evaluate(node.right, content);
        } else if (node.type === "OR") {
            return evaluate(node.values[0], content) || evaluate(node.values[1], content);
        } else {
            return content.includes(node);
        }
    }

    function matchesExpression(expression, content) {
        let tokens = tokenize(expression);
        let ast = parse(tokens);
        return evaluate(ast, content);
    }

    // 黑名单检查
    function matchesBlacklist(content) {
        content = content.toLowerCase();
        for (let category in blacklist) {
            for (let item of blacklist[category]) {
                if (matchesExpression(item, content)) {
                    return [true, item];
                }
            }
        }
        return [false, null];
    }

    // 移除广告内容的函数
    function removeAds(){
        $('.Topstory-recommend .Card.TopstoryItem-isRecommend').each(function() {
//             if($(this).find('button').filter((i,e)=>$(e).text() == '​添加评论').length>0){
//                 $(this).remove();
//                 console.log('Removed:' + $(this).find('h2.ContentItem-title a').text() + ' by rule: no comment')
//                 return;
//             }

            let ct = $(this).find('h2.ContentItem-title a').text();
            var r = matchesBlacklist(ct);
            if (ct && r[0]) {
                console.log($(this))
                $(this).hide();
                console.log('hide:' + ct + ' by rule: ' + r[1])
            }
        });
    }
    removeAds = _.debounce(removeAds, 1000);

    // 调用定时器来定期移除广告
    window.setTimeout(function(){
        removeAds();
    }, 200);



    $(".css-1fsnuue").bind("DOMSubtreeModified", function() {
        hookClick();
        removeAds();
    });
})();