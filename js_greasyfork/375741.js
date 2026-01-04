// ==UserScript==
// @name         Acfun助手
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  Acfun助手 2020/04/13 更新 抽奖按钮样式 清除默认评论文字
// @author       styang
// @require      https://lib.baomitu.com/axios/0.19.0/axios.min.js
// @require      https://lib.baomitu.com/jquery/3.4.1/jquery.min.js
// @match        https://www.acfun.cn/a/ac*
// @match        https://www.acfun.cn/v/ac*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375741/Acfun%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375741/Acfun%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var AID = location.href.replace('https://www.acfun.cn/a/ac','').replace('https://www.acfun.cn/v/ac','').split('#')[0]
    var video = location.href.includes("/v/")
    var baseUrl = 'https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=AID&sourceType=1&page=PAGE&pivotCommentId=0'.replace('AID',AID)
    var getComments = function(page){
        return axios.get(baseUrl.replace('PAGE',page))
    }
    var totalPage = 0
    var comments = []
    var users = new Set()
    var luckcount = 1
    window.lottery = function(){
     if(comments.length > 0){
        let commentsindex = Math.floor(Math.random() * comments.length)
        if(comments.length === 1){
            commentsindex = 0
        }
        let user = comments[commentsindex]
        comments.splice(commentsindex,1)
        console.log(`第${luckcount}位天选之子【${ user.userName}】`)
        if($('.edui-body-container').text().indexOf('评论一时爽') >= 0){
            $('.edui-body-container').empty()
        }
        $('.edui-body-container').append(`<p>第${luckcount}位天选之子${user.floor}楼的 @${user.userName}</p>`)
        luckcount++
    }

}
$(function(){
    getComments(1).then(res =>{
        const data = res.data
        if(data.isUp){
            console.log('确认为up主，载入抽奖助手...')
            totalPage = data.totalPage
            for(var key in data.commentsMap){
                var comment = data.commentsMap[key]
                if(!users.has(comment.userId) && !comment.isUp){
                    users.add(comment.userId)
                    comments.push(comment)
                }
            }
            for(var page = 2; page < totalPage + 1; page ++ ){
                getComments(page).then(pageres => {
                    for(var key in pageres.data.commentsMap){
                        var comment = pageres.data.commentsMap[key]
                        if(!users.has(comment.userId) && !comment.isUp){
                            users.add(comment.userId)
                            comments.push(comment)
                        }
                    }
                })
            }
            var button = document.createElement('div');
            var jqButton = $(button);
            var buttonCss = {
                'border-radius':'15px',
                'padding':'5px 10px',
                'background':'#fd4c5b',
                'display':'inline-block',
                'cursor':'pointer',
                'margin-left':'20px',
                'height': 'auto',
                'color':'#fff'
            };
            if(video){
                buttonCss.margin = '20px 5px'
            }
            jqButton.css(buttonCss);
            jqButton.attr('onclick',"lottery()");
            jqButton.text('开始抽奖');
            $('#art-operate').append(button.outerHTML);
            if(video){
                $('.banana').after(button.outerHTML);
            }
        }
    })
})
if(document.querySelector(".article-list")){
 setTimeOut(()=>{
    var observer = new MutationObserver(function (mutationsList) {
        var articleset = new Set()
        document.querySelectorAll('.article-item').forEach(e => {
          if(!articleset.has(e.dataset.id)){
            articleset.add(e.dataset.id)
        } else{
            e.style.display = 'none'
            e.nextElementSibling.style.display = 'none'
        }
    })
    });
    observer.observe(document.querySelector(".article-list"),{
        childList:true
    })
},1500)    
}
})();
