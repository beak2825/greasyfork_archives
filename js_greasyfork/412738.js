// ==UserScript==
// @name         Zhihu Blocklist Helper
// @name:zh      知乎黑名单助手
// @namespace    https://github.com/mixterjim
// @version      0.7
// @author       MixterJim
// @description  完善知乎黑名单功能，屏蔽黑名单用户回答
// @homepage     https://greasyfork.org/zh-CN/scripts/412738-zhihu-blocklist-helper
// @icon         https://static.zhihu.com/static/favicon.ico
// @supportURL   https://gist.github.com/mixterjim/a1f4d28e7aafcff12d4fa1d18db85fb6
// @include      *://www.zhihu.com/*
// @connect      www.zhihu.com
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @nocompat     Chrome
// @license      GPL-3.0
// @create       2020.08.20
// @note         2020.08.31-V0.7 增加设置面板
// @thanks       Google Closure
// @downloadURL https://update.greasyfork.org/scripts/412738/Zhihu%20Blocklist%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412738/Zhihu%20Blocklist%20Helper.meta.js
// ==/UserScript==


(function() {
    var zbh = {
        array: {
            // *
            //  * Removes all duplicates from an array.
            //  *
            //  * Runtime: N,
            //  * Worstcase space: 2N
            //  *
            //  * @param {Array} arr The array from which to remove.
            //  *     duplicates.

            removeDuplicates: function(arr) {
                let seen = {},
                    cursorInsert = 0,
                    cursorRead = 0;
                while (cursorRead < arr.length) {
                    let current = arr[cursorRead++];
                    if (!Object.prototype.hasOwnProperty.call(seen, current)) {
                        seen[current] = true;
                        arr[cursorInsert++] = current;
                    }
                };
                arr.length = cursorInsert;
            },

            /**
             * Removes the first occurrence of a particular value from an array.
             * @param {IArrayLike<T>} arr Array from which to remove
             *     value.
             * @param {T} obj Object to remove.
             * @template T
             */
            remove: function(arr, obj) {
                var i = arr.indexOf(obj);
                if (i >= 0) {
                    Array.prototype.splice.call(arr, i, 1);
                }
            },
        },

        /**
         * Get blocked id from API.
         *
         * @param {Array} arr The array in which to save the results.
         * @param {string} url An link for which we are getting blocked id.
         * @param {number|string} offset The index at where we start to
         *      get the blocked id.
         */
        getBlockedIdList: function(arr, url, offset) {
            let request = new XMLHttpRequest();
            request.onload = function() {
                request.response.data.forEach(function(item, index, array) {
                    arr.push(item.id);
                });
                if (request.response.paging.totals > arr.length) {
                    zbh.getBlockedIdList(arr, url, arr.length);
                } else {
                    zbh.array.removeDuplicates(arr);
                    GM_setValue("blockedIdList", arr);
                }
            };
            request.open("GET", url + offset, true);
            request.responseType = 'json';
            request.send();
        },

        /**
         * Set block button.
         *
         * @param {string} name The author name.
         * @param {string} isBlocked Is the author blocded?
         * @param {object} button The block botton.
         */
        blockButton: function(name, isBlocked, button) {
            let request = new XMLHttpRequest();
            if (isBlocked === "true") {
                request.open("DELETE", "https://www.zhihu.com/api/v4/members/" + name + "/actions/block", true);
                button.textContent = "Block";
                button.setAttribute('blocked', "false");
                button.className = "Button Button--primary Button--blue";
                zbh.array.remove(blockedIdList, button.id)
            } else {
                request.open("POST", "https://www.zhihu.com/api/v4/members/" + name + "/actions/block", true);
                button.textContent = "Blocked";
                button.setAttribute('blocked', "true");
                button.className = "Button Button--primary Button--red";
                blockedIdList.push(button.id);
            }
            request.send();
            GM_setValue("blockedIdList", blockedIdList);
            console.log(blockedIdList)
        },

        settingButtonClick: function() {
            if (document.querySelector(".setting-panel").style.display == "block") {
                document.querySelector(".setting-panel").style.display = "none";
            } else {
                document.querySelector(".isBlockHidden").checked = Config.isBlockHidden;
                document.querySelector(".isBlockTempShow").checked = Config.isBlockTempShow;
                document.querySelector(".isBlockBtnNotHidden").checked = Config.isBlockBtnNotHidden;
                document.querySelector(".isBlockPost").checked = Config.isBlockPost;
                document.querySelector(".setting-panel").style.display = "block";
            }
        },

        hidenAnswer: function() {
            let answerItemList = document.querySelectorAll(".List-item");
            while (index < answerItemList.length) {
                let item = answerItemList[index].querySelector(".ContentItem.AnswerItem");
                let name = answerItemList[index].querySelector(".UserLink-link").href.slice(29);
                let id = JSON.parse(item.getAttribute("data-za-extra-module")).card.content.author_member_hash_id;
                if (blockedIdList.indexOf(id) != -1) {
                    item.hidden = true;
                    item.querySelector(".AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related").innerHTML += '<button style="float:right" class="Button Button--primary Button--red" blocked="true" id=' + index + ' value=' + name + '>Blocked</button>';
                    answerItemList[index].innerHTML += '<div class="Blockeditem" style="text-align:center"><span class="blockShow" id=' + id + '>Block by ' + JSON.parse(item.getAttribute("data-zop")).authorName + '</span></div>';
                    // answerItemList[index].querySelector(".blockShow").onclick=function(){answerItemList[this.id].querySelector(".ContentItem.AnswerItem").hidden = false;this.hidden = true};
                    // <BUG> 取消隐藏后原 click 侦听器消失
                } else {
                    item.querySelector(".AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related").innerHTML += '<button style="float:right" class="Button Button--primary Button--blue" blocked="false" id=' + id + ' value=' + name + '>Block</button>';
                }
                item.querySelector(".Button.Button--primary").onclick = function() {
                    zbh.blockButton(this.value, this.getAttribute("blocked"), this);
                };
                index++;
            };
            return index;
        },

        hidenPost: function() {
            let itemList = document.querySelectorAll(".Card.TopstoryItem.TopstoryItem-isRecommend");
            while (questionIndex < itemList.length) {
                let item = itemList[questionIndex].firstChild;
                try {
                    let itemType = JSON.parse(item.getAttribute("data-za-extra-module")).card.content.type;
                    if (itemType != "Answer") {
                        let data = JSON.parse(item.firstChild.getAttribute("data-zop"));
                        let authorName, postName;
                        if (data != null) {
                            authorName = data.authorName;
                            postName = data.title;
                        } else {
                            authorName = "视频";
                            postName = item.querySelector(".ContentItem-title").textContent;
                        }
                        let title = authorName + " 《" + postName + "》";
                        item.firstChild.hidden = true;
                        console.log(questionIndex, "hidden")
                        item.innerHTML += '<div class="Blockeditem" style="text-align:center"><span class="blockShow" id=' + questionIndex + '>Block by ' + title + '</span></div>';
                        itemList[questionIndex].querySelector(".blockShow").onclick = function() {
                            itemList[this.id].firstChild.firstChild.hidden = false;
                            this.hidden = true
                        };
                        // <BUG> 取消隐藏后原 click 侦听器消失
                    }
                } catch (e) {
                    /* 此处应该是广告 */
                    questionIndex++;
                    continue;
                }
                questionIndex++;
            }
        },

        zbhsettingButton: function() {
            let settingButton = `
      <div class="Setting">
          <button class="Button AppHeader-notifications css-79elbk Button--plain">
              <span style="display: inline-flex; align-items: center;">​&#8203;
                  <svg class="Zi Zi--Settings" fill="currentColor" viewBox="0 0 24 24" width="22" height="22">
                      <path d="M20.868 17.185a.896.896 0 0 1-.452.137c-.123 0-1.397-.26-1.617-.233-1.354.014-1.78 1.276-1.835 1.742-.055.453 0 .892.191 1.303a.8.8 0 0 1-.068.851C16.224 21.877 14.922 22 14.73 22a.548.548 0 0 1-.356-.151c-.11-.096-.685-1.138-1.069-1.468-1.304-.955-2.247-.329-2.63 0-.398.33-.672.7-.836 1.125a.632.632 0 0 1-.329.37c-1.354.426-2.918-.919-3.014-1.056a.564.564 0 0 1-.123-.356c-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673a3.192 3.192 0 0 0-.918.178.873.873 0 0 1-.59-.055c-.887-.462-1.136-2.332-1.109-2.51.055-.315.192-.521.438-.604.425-.164.809-.452 1.151-.85.931-1.262.343-2.25 0-2.634-.342-.356-.726-.645-1.15-.809-.138-.041-.234-.151-.33-.316-.38-1.434.613-2.552.867-2.77.255-.22.6-.055.723 0 .425.164.877.219 1.343.15C6.7 6.636 6.784 5.141 6.81 4.908c.014-.247-.11-1.29-.137-1.4a.488.488 0 0 1 .027-.315C7.317 2.178 9.071 2 9.222 2a.56.56 0 0 1 .439.178c.11.124.63 1.111 1 1.4.4.338 1.583.83 2.59.013.397-.274.959-1.29 1.082-1.413A.55.55 0 0 1 14.717 2c1.56 0 2.329 1.029 2.438 1.22a.458.458 0 0 1 .069.371c-.028.151-.329 1.152-.26 1.605.365 1.537 1.383 1.742 1.89 1.783.493.028 1.644-.356 1.809-.343a.63.63 0 0 1 .424.206c.535.31.85 1.715.905 2.14.027.233-.014.439-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.069 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356a4.576 4.576 0 0 0 1.493-1.016 4.694 4.694 0 0 0 1-1.495c.247-.562.357-1.18.357-1.81 0-.659-.11-1.262-.356-1.825a4.79 4.79 0 0 0-1-1.481 4.542 4.542 0 0 0-1.494-1.002 4.796 4.796 0 0 0-3.631 0 4.627 4.627 0 0 0-1.48 1.002c-.424.425-.767.919-1 1.481a4.479 4.479 0 0 0-.37 1.825c0 .644.124 1.248.37 1.81a4.62 4.62 0 0 0 1 1.495c.425.426.918.768 1.48 1.016a4.677 4.677 0 0 0 1.809.356z" fill-rule="evenodd"></path>
                  </svg>
              </span>
          </button>
      </div>
    `;
            let settingPanel = `
      <div class="setting-panel">
        <style type="text/css">
          .setting-panel {
            position: fixed;
            top: 3vw;
            right: 18vw;
            z-index: 203;
            background-color: #fff;
            padding-bottom: 8px;
            display: none;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            -webkit-box-shadow: 0 5px 20px rgba(26,26,26,.1);
          }
          .setting-header {
            padding: 14px 0;
            text-align: center;
            border-bottom: 1px solid rgb(246, 246, 246);
          }
          .setting-list {
            margin: 8px auto 9px;
            padding: 0 16px;
          }
          .setting-button {
            margin: 0 16px;
            border-top: 1px solid rgb(246, 246, 246);
            padding: 10px 8px;
          }
          .setting-list li {
            position: relative;
            font-size: 14px;
            line-height: 24px;
            color: #1a1a1a;
          }
          .clear {
            float: right;
            color: #8590a6;
            font-size: 13px;
          }
        </style>
        <div class="setting-header">知乎黑名单助手</div>
        <div class="setting-list">
          <li>
            <label><input type="checkbox" class="isBlockHidden">隐藏拦截条目</label>
            <label><input type="checkbox" class="isBlockTempShow">临时显示拦截条目</label>
          </li>
          <li>
            <label><input type="checkbox" class="isBlockBtnNotHidden">显示拉黑按钮</label>
          </li>
          <li>
            <label><input type="checkbox" class="isBlockPost">屏蔽专栏</label>
            <button class="clear" title="恢复默认设置，清空黑名单">复位</button>
          </li>
        </div>
        <div class="setting-button">
          <span class="cancel" style="position: relative; float: left;">取消</span>
          <span class="save" style="position: relative; float: right;">保存</span>
        </div>
        <script type="text/javascript">
          // document.(".cancel").addEventListener("click", function(){document.querySelector(".setting-panel").style.display = "none";});
          // document.getElementById("isBlockHidden").checked=Config.isBlockHidden;
        </script>
      </div>
    `;
            document.querySelector(".AppHeader-userInfo").insertAdjacentHTML("afterbegin", settingButton);
            document.querySelector(".Setting").addEventListener("click", zbh.settingButtonClick);
            document.querySelector(".Sticky.AppHeader.AppHeader--old").insertAdjacentHTML("afterend", settingPanel);
            document.querySelector(".cancel").addEventListener("click", function() {
                document.querySelector(".setting-panel").style.display = "none";
            });
            document.querySelector(".save").addEventListener("click", function() {
                Config.isBlockHidden = document.querySelector(".isBlockHidden").checked;
                Config.isBlockTempShow = document.querySelector(".isBlockTempShow").checked;
                Config.isBlockBtnNotHidden = document.querySelector(".isBlockBtnNotHidden").checked;
                Config.isBlockPost = document.querySelector(".isBlockPost").checked;
                GM_setValue("Config", Config);
                document.querySelector(".setting-panel").style.display = "none";
            });
            document.querySelector(".clear").addEventListener("click", function() {
                GM_deleteValue("blockedIdList");
                GM_deleteValue("Config");
                location.reload();
                // document.querySelector(".setting-panel").style.display = "none";
            });
        },

    };

    /*--------------------------------Main-----------------------------------*/

    var Config = GM_getValue("Config", {
        isBlockHidden: false, // 是否隐藏已拦截的条目
        isBlockTempShow: false, //是否允许临时显示拦截条目
        isBlockBtnNotHidden: false, // 是否隐藏拉黑按钮
        isBlockPost: true, //是否屏蔽专栏
    });

    var getBlockedUserUrl = "/api/v3/settings/blocked_users?limit=20&offset=";

    var blockedIdList = GM_getValue("blockedIdList", []);
    if (blockedIdList.length === 0) {
        console.log("Loading");
        zbh.getBlockedIdList(blockedIdList, getBlockedUserUrl, blockedIdList.length);
    }

    // if (/.*zhihu.com\/question.*/.test(document.URL)) {
    // // if (/.*zhihu.com\/question.*/.test(document.URL) && !/answer/.test(document.URL)) {
    //     var index = 0;
    //     setInterval(zbh.hidenAnswer, 1000);
    //     document.addEventListener('readystatechange', function() {
    //         document.querySelectorAll(".QuestionMainAction.ViewAll-QuestionMainAction").forEach(function(item, index, array) {
    //             item.addEventListener('click',function(){
    //                 window.location.href=item.getAttribute("href")
    //             })
    //             console.log(item)
    //         });
    //     });
    //     console.log("Start hidenAnswer")
    // }

    if (/.*zhihu.com\/question.*/.test(document.URL)) {
    // if (/.*zhihu.com\/question.*/.test(document.URL) && !/answer/.test(document.URL)) {
        var index = 0;
        setInterval(zbh.hidenAnswer, 1000);
        document.addEventListener('readystatechange', function() {
            var viewAllButton = document.getElementsByClassName("QuestionMainAction ViewAll-QuestionMainAction")
            for(var i=0;i<viewAllButton.length;i++) {
                viewAllButton[i].addEventListener('click',function(){
                    window.location.href=viewAllButton[i].href;
                });
                console.log("Start hidenAnswer")
            }
        });
    }

    if ((location.pathname === "/" || /.*zhihu.com\/search?.*/.test(document.URL)) & Config.isBlockPost) {
        var questionIndex = 0;
        setInterval(zbh.hidenPost, 1000);
    }

    if (/.*zhihu.com\/people\/.*/.test(document.URL)) {
        document.addEventListener('readystatechange', function() {
            if (document.readyState === 'complete') {
                try {
                    document.querySelector("div.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons Button.Button--primary.Button--red").addEventListener("click", function() {
                        GM_deleteValue("blockedIdList");
                    })
                } catch (e) {
                    console.log('ok')
                }
            }
        });
    }

    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
            zbh.zbhsettingButton();
        }
    });

    document.addEventListener(
        /* 解除复制版权限制，删除复制时附带的版权声明 */
        "copy",
        function(e) {
            e.stopPropagation();
        },
        true
    );

})();