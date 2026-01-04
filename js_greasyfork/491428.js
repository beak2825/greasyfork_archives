// ==UserScript==
// @name         Tuxun Homepage Reset
// @namespace    tuxun-reset
// @version      0.1.7
// @description  reset tuxun homepage to 2024.3 version
// @author       strombooli
// @license      MIT
// @match        https://tuxun.fun/
// @grant        GM_xmlhttpRequest


// @downloadURL https://update.greasyfork.org/scripts/491428/Tuxun%20Homepage%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/491428/Tuxun%20Homepage%20Reset.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.removeChild(document.getElementById('root')) // remove default
    document.head.innerHTML += "<link href=\"https://s.chao-fan.com/chunk-common.331711941309576.css\" rel=\"stylesheet\"></link><link href=\"https://s.chao-fan.com/chunk-710a3322.331711941309576.css\" rel=\"stylesheet\"></link>"

    var htmlTxt = "<script>var _hmt=_hmt||[];!function(){var e=document.createElement(\"script\");e.src=\"https://hm.baidu.com/hm.js?e7166bd8d0c253eb08e345c1bc6e0ed7\";var t=document.getElementsByTagName(\"script\")[0];t.parentNode.insertBefore(e,t)}()</script><div data-v-1f7123f2=\"\" id=\"tuxun\"><div data-v-1f7123f2=\"\" class=\"container\" style=\"background-image:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.5)),url(&quot;https://i.chao-fan.com/front/niu.jpg?x-oss-process=image/quality,q_50&quot;);background-size:cover;background-position:center center\"><div data-v-1f7123f2=\"\" class=\"game\"><div data-v-1f7123f2=\"\" class=\"top-right\"><button id=\"user\" data-v-1f7123f2=\"\" type=\"button\" class=\"el-button el-button--default el-button--medium\"><span>个人首页</span></button><div data-v-1f7123f2=\"\" style=\"height:5px\"></div><button id=\"friend\" data-v-1f7123f2=\"\" type=\"button\" class=\"el-button el-button--default el-button--medium\"><span>我的好友</span></button><div data-v-1f7123f2=\"\" style=\"height:5px\"></div><button id=\"message\" data-v-1f7123f2=\"\" type=\"button\" class=\"el-button el-button--default el-button--medium\" style=\"position:relative\"><span>消息通知</span></button><div data-v-1f7123f2=\"\" style=\"height:5px\"></div><button id=\"point-rank\" data-v-1f7123f2=\"\" type=\"button\" class=\"el-button el-button--default el-button--medium\"><span>积分排行</span></button></div><div data-v-1f7123f2=\"\" class=\"top\"><div data-v-1f7123f2=\"\" class=\"top-left\"><div data-v-1f7123f2=\"\" style=\"display:flex\"><img data-v-1f7123f2=\"\" src=\"https://s.chao-fan.com/tuxun/images/logo.svg\" style=\"width:5rem;height:3rem\"><div data-v-1f7123f2=\"\" style=\"cursor:pointer;padding-left:5px;text-decoration:underline;font-size:16px;color:#fff;display:inline-block;align-self:flex-end\" id=\"doc2\">教程文档</div></div><div data-v-1f7123f2=\"\" style=\"color:#fff;padding-top:5px\">探索真实世界，找到你在的位置</div></div></div>ACTIVITIES<section class=\"game_entrance\"><div data-v-1f7123f2=\"\" class=\"first_session_head\">单人</div><div data-v-1f7123f2=\"\" class=\"line\"></div><div data-v-1f7123f2=\"\" class=\"grid_main\"><div data-v-1f7123f2=\"\" class=\"card\" id=\"daily-challenge\"><div data-v-1f7123f2=\"\" class=\"title\">每日挑战</div><div data-v-1f7123f2=\"\" class=\"describe\">每天五题，神清气爽</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"streak\"><div data-v-1f7123f2=\"\" class=\"title\">连胜挑战</div><div data-v-1f7123f2=\"\" class=\"describe\">探索者，坚持到一百题啊！</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"maps\"><div data-v-1f7123f2=\"\" class=\"title\">题库</div><div data-v-1f7123f2=\"\" class=\"describe\">走遍大江南北</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"interact\"><div data-v-1f7123f2=\"\" class=\"title\">互动</div><div data-v-1f7123f2=\"\" class=\"describe\">你出题，我做题</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"interact/challenge\"><div data-v-1f7123f2=\"\" class=\"title\">网络迷踪</div><div data-v-1f7123f2=\"\" class=\"describe\">经典模式</div></div></div><div data-v-1f7123f2=\"\" class=\"first_session_head\">积分</div><div data-v-1f7123f2=\"\" class=\"line\"></div><div data-v-1f7123f2=\"\" class=\"grid_main\"><div data-v-1f7123f2=\"\" class=\"card\" id=\"world-match\"><div data-v-1f7123f2=\"\" class=\"title\">全球积分</div><div data-v-1f7123f2=\"\" class=\"describe\">全球街景的积分比赛</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"china-match\"><div data-v-1f7123f2=\"\" class=\"title\">中国积分</div><div data-v-1f7123f2=\"\" class=\"describe\">江山如此多娇</div></div></div><div data-v-1f7123f2=\"\" class=\"first_session_head\">娱乐</div><div data-v-1f7123f2=\"\" class=\"line\"></div><div data-v-1f7123f2=\"\" class=\"grid_main\"><div data-v-1f7123f2=\"\" class=\"card\" id=\"team\"><div data-v-1f7123f2=\"\" class=\"title\">匹配</div><div data-v-1f7123f2=\"\" class=\"describe\">一个人或者和朋友合作挑战对手</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"party\"><div data-v-1f7123f2=\"\" class=\"title\">派对</div><div data-v-1f7123f2=\"\" class=\"describe\">邀请好友对决</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"join\"><div data-v-1f7123f2=\"\" class=\"title\">加入派对</div><div data-v-1f7123f2=\"\" class=\"describe\">通过派对码加入派对</div></div></div><div data-v-1f7123f2=\"\" class=\"first_session_head\">探索</div><div data-v-1f7123f2=\"\" class=\"line\"></div><div data-v-1f7123f2=\"\" class=\"grid_main\"><div data-v-1f7123f2=\"\" class=\"card\" id=\"event\"><div data-v-1f7123f2=\"\" class=\"title\">寻景</div><div data-v-1f7123f2=\"\" class=\"describe\">寻友地图</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"wonders\"><div data-v-1f7123f2=\"\" class=\"title\">街景奇观</div><div data-v-1f7123f2=\"\" class=\"describe\">光怪陆离，怪奇物语</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"random\"><div data-v-1f7123f2=\"\" class=\"title\">随机街景</div><div data-v-1f7123f2=\"\" class=\"describe\">漫步孤独星球</div></div></div><div data-v-1f7123f2=\"\" class=\"first_session_head\">扩展</div><div data-v-1f7123f2=\"\" class=\"line\"></div><div data-v-1f7123f2=\"\" class=\"grid_main\"><div data-v-1f7123f2=\"\" class=\"card\" id=\"vid\"><div data-v-1f7123f2=\"\" class=\"title\">直播/视频/教程</div><div data-v-1f7123f2=\"\" class=\"describe\">看看图寻er们都创作了哪些内容吧</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"forum\"><div data-v-1f7123f2=\"\" class=\"title\">讨论区</div><div data-v-1f7123f2=\"\" class=\"describe\">一起来讨论图寻技巧吧</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"mizong\"><div data-v-1f7123f2=\"\" class=\"title\">网络迷踪</div><div data-v-1f7123f2=\"\" class=\"describe\">一个发图片找地方的交流社区</div></div><div data-v-1f7123f2=\"\" class=\"card\" id=\"xiaoce\"><div data-v-1f7123f2=\"\" class=\"title\">炒饭小测验</div><div data-v-1f7123f2=\"\" class=\"describe\">地理小测验，帮助你玩好图寻</div></div></div><div data-v-1f7123f2=\"\" style=\"display:flex;flex-wrap:wrap\"><div data-v-1f7123f2=\"\" style=\"cursor:pointer;color:#fff;font-size:medium;padding-top:1rem;padding-right:1rem;text-decoration:underline\" id=\"doc1\">图寻文档</div><div data-v-1f7123f2=\"\" style=\"cursor:pointer;color:#fff;font-size:medium;padding-top:1rem;padding-right:1rem;text-decoration:underline\" id=\"log\">更新日志</div><div data-v-1f7123f2=\"\" style=\"cursor:pointer;color:#fff;font-size:medium;padding-top:1rem;padding-right:1rem;text-decoration:underline\" id=\"app\">App</div><div data-v-1f7123f2=\"\" style=\"cursor:pointer;color:#fff;font-size:medium;padding-top:1rem;padding-right:1rem;text-decoration:underline\" id=\"mall\">商店</div></div><div data-v-1f7123f2=\"\" class=\"thx\"><p data-v-1f7123f2=\"\" class=\"times\">总轮次数：<span style=\"font-size:18px\">83706930</span></p><p data-v-1f7123f2=\"\">交流QQ群：<a rel=\"noreferrer\" target=\"_blank\" href=\"http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&amp;k=YRq8jU3MFd-ylHCFC0lcJX9npaG0FRmi&amp;authKey=W3wNh8n8zybypY08JK4g4YCcA0o3GdiwKXFqYCff4Ejan%2BKymBCWUSwjplXsZJva&amp;noverify=0&amp;group_code=943507031\">943507031</a></p><p data-v-1f7123f2=\"\">微信公众号：图寻</p><p data-v-1f7123f2=\"\">开发者微博：<a rel=\"noreferrer\" target=\"_blank\" href=\"https://weibo.com/u/3050203537\">@此间ZY</a></p><p data-v-1f7123f2=\"\">地图审图号：GS（2022）2885号</p><p data-v-1f7123f2=\"\">问题反馈：图寻公众号，图寻群, 电话：15058139992 可能有会员奖励</p><p data-v-1f7123f2=\"\"><a rel=\"noreferrer\" target=\"_blank\" href=\"https://www.yuque.com/chaofun/tuxun/changelog\">更新日志</a></p><p data-v-1f7123f2=\"\"><a rel=\"noreferrer\" target=\"_blank\" href=\"https://beian.miit.gov.cn/\">浙ICP备2022031450号</a></p></div></section></div></div></div>"
    var activityList = []
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://tuxun.fun/api/v0/tuxun/activity/list",
        headers: {"Content-Type": "application/json"},
        onload: function(response) {
            activityList = JSON.parse(response.responseText).data.normalActivities
            let activityHtml = ""
            for(let i=0;i<activityList.length;i++){
                activityHtml += "<div data-v-1f7123f2=\"\" class=\"second-info\" id=\"link" + i + "\">" + activityList[i].title + "</div>"
            }
            if (activityHtml == "") activityHtml = "<br></br>";

            htmlTxt = htmlTxt.replace("ACTIVITIES", activityHtml)

            var doc = new DOMParser().parseFromString(htmlTxt, "text/html");
            document.body.appendChild(doc.body.children[0])

            bindInLinks()
            bindOutLinks()
            bindPersonal()
            setTotalGuess()
            setInterval(function(){setTotalGuess()}, 5000)
        }
    });


    function bindInLinks(){
        let reDirs = ["friend", "message", "point-rank", "world-match", "china-match", "streak", "maps", "daily-challenge", "interact/challenge", "interact", "team", "party", "join", "event", "wonders", "random", "app", "mall"]

        reDirs.forEach(function(e){
            document.getElementById(e).addEventListener("click", function(){
                location.href = "https://tuxun.fun/" + e;
                console.log(e);
            })
        })
    }

    function bindOutLinks(){
        let reDirOut = [["doc1", "https://www.yuque.com/chaofun/tuxun"],
                        ["doc2", "https://www.yuque.com/chaofun/tuxun"],
                        ["log", "https://www.yuque.com/chaofun/tuxun/changelog"],
                        ["vid", "https://search.bilibili.com/all?keyword=%E5%9B%BE%E5%AF%BB"],
                        ["forum", "https://choa.fun/f/753"],
                        ["mizong", "https://choa.fun/f/84"],
                        ["xiaoce", "https://xiaoce.fun"],
                       ]

        for(let i=0;i<activityList.length;i++){
            reDirOut.push(["link" + i, activityList[i].link])
        }

        reDirOut.forEach(function(e){
            document.getElementById(e[0]).addEventListener("click", function(){
                location.href = e[1];
            })
        });

    }

    function bindPersonal(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://tuxun.fun/api/v0/tuxun/user/getSelfProfile",
            headers: {"Content-Type": "application/json"},
            onload: function(response) {
                let user = JSON.parse(response.responseText).data || -1
                let userLink = "https://tuxun.fun/user/login?redirect=https%3A%2F%2Ftuxun.fun%2F";
                if(user != -1){
                    userLink = "https://tuxun.fun/user/" + user.userId;
                }
                document.getElementById("user").addEventListener("click", function(){
                    location.href = userLink;
                })
            }
        });
    }

    function setTotalGuess(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://tuxun.fun/api/v0/tuxun/getTotalGuess",
            headers: {"Content-Type": "application/json"},
            onload: function(response) {
                let totalGuess = JSON.parse(response.responseText).data;
                document.getElementsByClassName("times")[0].children[0].innerText = totalGuess;
            }
        });
    }

})();