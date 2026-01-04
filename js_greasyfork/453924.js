// ==UserScript==
// @name         掘金文章评论区评论用户UID获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取当前文章评论区评论用户UID，用于后续抽奖工具
// @author       小鑫同学
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453924/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%AF%84%E8%AE%BA%E7%94%A8%E6%88%B7UID%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453924/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%AF%84%E8%AE%BA%E7%94%A8%E6%88%B7UID%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

const getCommentsApi = (articleId) => {
    const users = [];

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: `{"client_type": 2608, "item_id":"${articleId}","item_type":2,"cursor":"0","limit":99999,"sort":0}`,
        credentials: 'include'
    };

    fetch('https://api.juejin.cn/interact_api/v1/comment/list', options)
        .then(response => response.json())
        .then(response => {
        const {err_msg, err_no, data} = response;
        if(err_msg === "success" && err_no === 0 && data){
            console.log(data.length)
            for (let i = 0; i < data.length; i++) {
                const commit = data[i];
                const { user_id, user_name } = commit.user_info;
                users.push(`${user_id}`);
            }
            const result = `参与共计${users.length}人：\n${users.join('\n')}`;
            console.log(window)
            window.swal(result);
        }else{
            window.swal('错误提示', err_msg, "error");
        }
    })
        .catch(err => console.error(err));
}

(function() {
    // 移除已有的元素
    if(document.querySelector('#get-comment-uid')){
        document.querySelector('#get-comment-uid').remove();
    }
    // 创建新元素并插入
    const getCommentUid = document.createElement("span");
    getCommentUid.id = "get-comment-uid"
    getCommentUid.textContent = '获取评论区UID';
    getCommentUid.style = 'font-weight: bold; color: rgb(30, 128, 255); cursor: pointer; border: 2px solid rgb(30, 128, 255); border-radius: 5px; padding: 2px 3px;';
    getCommentUid.addEventListener("click", () => {
        getCommentsApi(location.pathname.split("/").pop());
    })
    setTimeout(()=>{
        document.querySelector('.meta-box').appendChild(getCommentUid);
    }, 500)
})();