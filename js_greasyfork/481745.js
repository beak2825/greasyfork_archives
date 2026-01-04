// ==UserScript==
// @name         虎扑黑名单
// @description  虎扑黑名单，隐藏拉黑的帖子
// @author       Amamiya
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @match        https://bbs.hupu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license MIT
// @version 1.4.1
// @namespace https://greasyfork.org/users/801480
// @downloadURL https://update.greasyfork.org/scripts/481745/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/481745/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function() {
        var currentURL = window.location.href;
        const hiddenUserListString = GM_getValue('hiddenUserList', '');
        const hiddenKeywordListString = GM_getValue('hiddenKeywordList', '');



        if (!currentURL.includes('.html')) {



            if (hiddenUserListString || hiddenKeywordListString) {
                const hiddenUserList = hiddenUserListString.split(',');
                const hiddenKeywordList = hiddenKeywordListString.split(',');
                const posts = document.querySelectorAll('.bbs-sl-web-post-layout');
                posts.forEach(post => {
                    const postAuthor = post.children[2].textContent;
                    const postTitle = post.children[0].textContent;
                    if (hiddenUserListString && hiddenUserList.includes(postAuthor)) {
                        post.closest('li').style.display = 'none';
                    }
                    if (hiddenKeywordListString && hiddenKeywordList.some(item => postTitle.includes(item) && item.trim().length != 0)) {
                        post.closest('li').style.display = 'none';
                    }
                });

            }

            const posts = document.querySelectorAll('.post-auth');
            posts.forEach(post => {
                const span = document.createElement('span');
                span.textContent = '黑';
                span.style.cursor = 'pointer';
                span.style.color = 'red';
                span.style.marginRight = '10px';
                if (post.firstChild) {
                    post.insertBefore(span, post.firstChild);
                } else {
                    post.appendChild(span);
                }
                span.addEventListener('click', function(event) {
                    const id = event.target.parentElement.querySelector('a').textContent;
                    if (confirm('是否确定将用户 "' + id + '" 拉入黑名单?')) {
                        let hiddenUserList = GM_getValue('hiddenUserList', '');
                        if (hiddenUserList === '') {
                            hiddenUserList = id;
                        } else {
                            hiddenUserList += ',' + id;
                        }
                        GM_setValue('hiddenUserList', hiddenUserList);
                        event.target.closest('li').style.display = 'none';
                    }
                });
            });


        } else {
            const posts = document.querySelectorAll('.user-base-info');
            posts.forEach(post => {
                const span = document.createElement('span');
                span.textContent = '黑';
                span.style.cursor = 'pointer';
                span.style.color = 'red';
                span.style.marginRight = '10px';
                post.insertBefore(span, post.childNodes[1]);
                span.addEventListener('click', function(event) {
                    const id = event.target.parentElement.querySelector('a').textContent;
                    if (confirm('是否确定将用户 "' + id + '" 拉入黑名单?')) {
                        let hiddenUserList = GM_getValue('hiddenUserList', '');
                        if (hiddenUserList === '') {
                            hiddenUserList = id;
                        } else {
                            hiddenUserList += ',' + id;
                        }
                        GM_setValue('hiddenUserList', hiddenUserList);
                        event.target.closest('.post-reply-list-wrapper').style.display = 'none';

                    }
                });
            });

            if (hiddenUserListString) {
                const hiddenUserList = hiddenUserListString.split(',');
                const posts = document.querySelectorAll('.post-reply-list-container');
                posts.forEach(post => {
                    const postAuthor = post.querySelector('.user-base-info').querySelector('a').textContent;
                    const replyAuthorDom = post.querySelector('.index_bbs-thread-comp-container__QkBRG');
                    var replayAuthor = '';
                    if (replyAuthorDom) {
                        replayAuthor = replyAuthorDom.querySelector('a').textContent.replace(/^\s+|\s+$/g, '');
                    }
                    if (hiddenUserList.includes(postAuthor) || (replayAuthor != '' && hiddenUserList.includes(replayAuthor))) {
                        post.closest('.post-reply-list-wrapper').style.display = 'none';
                    }
                });

            }

        }
        GM_registerMenuCommand('移除黑名单', function() {
            const hiddenUserListString = GM_getValue('hiddenUserList', '');
            if (hiddenUserListString) {
                const hiddenUserList = hiddenUserListString.split(',');
                const htmlList = hiddenUserList.map(user => "<div class='userItem'>" + user + "</div>").join('');
                const html = "<div id='removeBlacklistDialog'><div class='title'>选择要移除的用户：</div><div id='userList'>" + htmlList + "</div><button id='closeButton'>关闭</button></div>";
                const div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);

                document.getElementById('closeButton').addEventListener('click', function() {
                    div.remove();
                });

                const userList = document.getElementById('userList');
                userList.addEventListener('click', function(event) {
                    if (event.target.classList.contains('userItem')) {
                        const userInput = event.target.textContent;
                        const index = hiddenUserList.indexOf(userInput);
                        hiddenUserList.splice(index, 1);
                        const updatedHiddenUserList = hiddenUserList.join(',');
                        GM_setValue('hiddenUserList', updatedHiddenUserList);
                        userList.innerHTML = hiddenUserList.map(user => "<div class='userItem'>" + user + "</div>").join('');
                    }
                });
                $('#removeBlacklistDialog').draggable();
            } else {
                alert('当前黑名单为空');
            }
        });

        GM_registerMenuCommand('关键词屏蔽', function() {
            const hiddenKeywordListString = GM_getValue('hiddenKeywordList', '');
            const html = "<div id='keywordBlockDialog'><div class='title'>输入要屏蔽的关键词,用英文逗号隔开：</div><input type='text' id='keywordInput' value='" + hiddenKeywordListString + "'><div id='buttonContainer'><button id='saveButton'>保存</button><button id='closeButton'>关闭</button></div></div>";
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);

            document.getElementById('closeButton').addEventListener('click', function() {
                div.remove();
            });

            document.getElementById('saveButton').addEventListener('click', function() {
                const updatedHiddenKeywordList = document.getElementById('keywordInput').value;
                GM_setValue('hiddenKeywordList', updatedHiddenKeywordList);
                div.remove();
            });

            $('#keywordBlockDialog').draggable();
        });
        GM_registerMenuCommand('备份黑名单', function() {
            const hiddenUserListString = GM_getValue('hiddenUserList', '');
            const hiddenKeywordListString = GM_getValue('hiddenKeywordList', '');
            const backupData = {
                users: hiddenUserListString.split(','),
                keywords: hiddenKeywordListString.split(',')
            };
            const backupString = JSON.stringify(backupData);
            const blob = new Blob([backupString], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'HupuBlackList.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        GM_registerMenuCommand('恢复黑名单', function() {
            const restoreContainer = document.createElement('div');
            restoreContainer.id = 'restoreBlacklistDialog';

            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = '请选择备份文件（会清除现有记录，请做好备份）：';
            restoreContainer.appendChild(title);

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            restoreContainer.appendChild(fileInput);

            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            restoreContainer.appendChild(closeButton);

            document.body.appendChild(restoreContainer);

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = function(event) {
                    try {
                        const backupString = event.target.result;
                        const backupData = JSON.parse(backupString);

                        if (!backupData.users || !backupData.keywords) {
                            throw new Error('备份文件格式不正确！');
                        }

                        var hiddenUserListString = GM_getValue('hiddenUserList', '');
                        var hiddenUserList = hiddenUserListString ? hiddenUserListString.split(',') : [];
                        hiddenUserList = backupData.users;
                        GM_setValue('hiddenUserList', hiddenUserList.join(','));

                        var hiddenKeywordListString = GM_getValue('hiddenKeywordList', '');
                        var hiddenKeywordList = hiddenKeywordListString ? hiddenKeywordListString.split(',') : [];
                        hiddenKeywordList = backupData.keywords;
                        GM_setValue('hiddenKeywordList', hiddenKeywordList.join(','));

                        alert('黑名单已成功恢复！');
                        restoreContainer.remove();
                    } catch (error) {
                        console.log(error)
                        alert('恢复失败：备份文件格式不正确！');
                    }
                };

                reader.readAsText(file);
            });

            closeButton.addEventListener('click', function() {
                restoreContainer.remove();
            });

            $('#restoreBlacklistDialog').draggable();
        });




    };

GM_addStyle(`
    #removeBlacklistDialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        padding: 10px;
        text-align: center;
    }
            .title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 10px;
            }
            #userList {
                margin-bottom: 20px;
            }
            #closeButton {
                position: absolute;
                bottom: 10px;
                right: 10px;
            }
            .userItem {
                margin:10px;
            }

            #keywordBlockDialog {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                padding: 10px;
                text-align: center;
            }
            #keywordInput {
                width: 80%;
                height: 30px;
                margin-bottom: 20px;
            }
            #buttonContainer {
                display: flex;
                justify-content: center;
                width: 100%;
            }
#restoreBlacklistDialog {
  position: fixed;
        top: 50%;
        left: 50%;
  transform: translateX(-50%);
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  width: 300px;
}

#restoreBlacklistDialog .title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

#restoreBlacklistDialog input[type="file"] {
  margin-bottom: 20px;
}

#restoreBlacklistDialog button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#restoreBlacklistDialog input[type="file"] {
  width: 100%;

`);
})();