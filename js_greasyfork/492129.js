// ==UserScript==
// @name         B站助手（Hook）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  B站助手（Hook） XmlhttpRequest Hook | 显示视频、文章详情页评论的IP属地
// @author       myaijarvis
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/cv*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://update.greasyfork.org/scripts/455943/1186873/ajaxHooker.js
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/492129/B%E7%AB%99%E5%8A%A9%E6%89%8B%EF%BC%88Hook%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/492129/B%E7%AB%99%E5%8A%A9%E6%89%8B%EF%BC%88Hook%EF%BC%89.meta.js
// ==/UserScript==

/*

脚本必须运行在 document-start
【参考：[ajaxHooker](https://scriptcat.org/zh-CN/script-show-page/637/ )】
【参考：[ajax劫持库ajaxHooker-油猴中文网](https://bbs.tampermonkey.net.cn/thread-3284-1-1.html )】
【参考：[使用filter后导致网站 部分正常请求 出现问题 · 反馈 #769 · ajaxHooker - ScriptCat](https://scriptcat.org/zh-CN/script-show-page/637/issue/769/comment )】
使用1.2.4版本

*/

ajaxHooker.filter([
    {url: '//api.bilibili.com/x/v2/reply/wbi/main',type: 'fetch'},
    {url: '//api.bilibili.com/x/v2/reply/reply',type: 'fetch'}, // 评论回复
]);

ajaxHooker.hook(request => {

    //console.log(request.url); // 注意打印出url看看，有的url没有前面的域名，【大部分情况下需要去掉前面域名来匹配】

    if (request.url.includes('//api.bilibili.com/x/v2/reply/wbi/main?') || request.url.includes('//api.bilibili.com/x/v2/reply/reply?')) {
        // fetch 请求
        // request.url为//api.bilibili.com/x/v2/reply/wbi/main?
        // https://api.bilibili.com/x/v2/reply/wbi/main?oid=1452344692&type=1&mode=3&pagination_str=%7B%22offset%22:%22%22%7D&plat=1&seek_rpid=&web_location=1315875&w_rid=29386c6fb998b28ab7d0a3740ba401a1&wts=1711878262
        //console.log(request.url);
        request.response = res => {
            //console.log(res); // 使用res.text字段无效果
            let text=res.json
            //console.log(text);
            text.data.replies=handleText(text.data.replies);
            if(text.data.top?.upper)
                text.data.top.upper=handleText(text.data.top.upper);
            if(text.data?.top_replies)
            text.data.top_replies=handleText(text.data.top_replies);

            /*
            console.log(text.data.replies);
            for(let i=0; i<text.data.replies.length; i++){

                let location=text.data.replies[i].reply_control.location;
                //console.log(location);
                text.data.replies[i].member.uname += ' | '+ location+'';

                if(text.data.replies[i].replies){ // 第一次就显示的回复

                    for(let j=0; j<text.data.replies[i].replies.length; j++){
                        let location=text.data.replies[i].replies[j].reply_control.location;
                        //console.log(location);
                        text.data.replies[i].replies[j].member.uname += ' | '+ location+'';
                    }
                }

            }*/
            res.json=text;// 填充修改数据
        };
    }

});
function handleText(comment){
    // comment中只存在一层或者两层,每一层需要有replies与reply_control字段

    for(let i=0; i<comment.length; i++){

        let location=comment[i].reply_control.location;
        //console.log(location);
        if(!location) location='无'
        comment[i].member.uname += ' | '+ location+'';

        if(comment[i].replies){ // 第一次就显示的回复

            for(let j=0; j<comment[i].replies.length; j++){
                let location=comment[i].replies[j].reply_control.location;
                //console.log(location);
                if(!location) location='无'
                comment[i].replies[j].member.uname += ' | '+ location+'';
            }
        }

    }
    return comment;
}
