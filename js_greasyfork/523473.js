// ==UserScript==
// @name         批量拉黑微博点赞用户 解除拉黑
// @namespace    https://github.com/comdotwww/batchBlockWeiboLikeUser
// @version      1.2
// @description  用于批量拉黑微博点赞用户 解除拉黑
// @author       comdotwww
// @match        http*://service.account.weibo.com/reportspam*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license           GPL-3.0
// @icon         data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIADAAMAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APXqKKZJKkMZdzhR7Z//AF10nYPrLn1Z4pJSluGhhcI7l8HJ9BTZ9dSJ9qQl/q4H8s1nWl9ardNPd2paVnLeaDu2+nHtj3NOzK5XudPSUyKWOeMSRuHQ9CDT6RItYeoXD39/HZWsgII5YdAec5+gH6+9blc9p5ZLmVbdU+1Q2rqA448wNxnp7VFSTjFtFI2bfSLKCML5CSN3eRQxP59KZc6LZTqQsQhbs0fGPw6Vj+Fb/wAWXd1cr4jsdPtoQoMJtXyxOec/O3bHpUHiLU/GdrrsUOiaXY3GnEKXlmcBhk/MPvj65xXnqUk99R38izpztpupS2s7qqngknAz1B/Ef09K6Cuf1PyTrcjSKrgR8KRncxTAH5kVvqNqBSc4GMnvXowk5JNiluOqtdW7SvHNC4S4iJ2EjIIPUH2NWajlEhiYRMFcj5SRkA02rqzJKn9rWs3mWsjSw3A4YRAsc/7JAOaZLr1rAEijWWV8hAWG0Z/2ien5VNpVgmnxPuIeVzkvjt6U3VdMi1EAgiOToWxnIrkVBc9raF3Q2zsGSeS7uyj3DnPA4X6fp+VX6it43it0jkk8x1GC2MZqWu1KxJ//2Q==
// @homepageURL       https://github.com/comdotwww/batchBlockWeiboLikeUser
// @supportURL        https://github.com/comdotwww/batchBlockWeiboLikeUser/issues
// @downloadURL https://update.greasyfork.org/scripts/523473/%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E5%BE%AE%E5%8D%9A%E7%82%B9%E8%B5%9E%E7%94%A8%E6%88%B7%20%E8%A7%A3%E9%99%A4%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/523473/%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E5%BE%AE%E5%8D%9A%E7%82%B9%E8%B5%9E%E7%94%A8%E6%88%B7%20%E8%A7%A3%E9%99%A4%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', async function() {
        // 获取report元素
        const reportElement = document.querySelector('a.mod-btn') || document.querySelector('dl dd p.module-infobox').parentNode;
        if (!reportElement) {
            console.log('未找到report元素');
            return;
        }

        /**
         * 休眠指定毫秒
         *
         * @param {Number} time
         * @returns
         */
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }


        /**
         * 获取点赞用户 uid 分页列表
         *
         * @param {string} actionData
         * @param {string} page
         * @returns
         */
        async function getLikePage(actionData, page = 1) {
            if (!actionData) {
                return {}
            }
            let uidArray = [0, []]
            return new Promise(function(resolve, reject) {
                let rnd = Math.floor(Math.random() * 1e4 + 1.5788995e12);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://weibo.com/aj/like/object/big?ajwvr=6&object_type=comment&page=${page}&object_id=${actionData}&__rnd=${rnd}`,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'referer': 'https://weibo.com/',
                    },
                    onload(res) {
                        if (res.status === 200) {
                            const json = JSON.parse(res.responseText);
                            uidArray = [json.data.page.totalpage, Array.from(json.data.html.matchAll(/uid=['"](.+?)['"]/ig))
                                .map(x => x[1]), json.data.like_counts
                            ]
                        } else {
                            alert(res.statusText);
                        }
                        resolve(uidArray);
                    },
                    onerror: function(error) {
                        console.error('请求失败:', error);
                        alert('请求失败，请检查控制台');
                    },
                });
            });

        }

        /**
         * 循环获取所有点赞用户 uid 集合
         *
         * @param {string} actionData
         * @returns
         */
        async function getLikeData(actionData) {
            const uids = []
            const uuu = await getLikePage(actionData)
            const page = uuu[0] || 0
            const uid = uuu[1] || []
            uids.push(...uid);
            if (page > 1) {
                // 休眠
                await sleep(Math.floor(Math.floor((Math.random() * 1000) + 1000)));
                const pages = new Array(page - 1).fill(0).map((x, i) => i + 2)
                const datas = await Promise.all(pages.map(x => getLikePage(actionData, x)))
                datas.forEach(x => {
                    uids.push(...x[1])
                })
            }
            return uids
        }

        /**
         * 根据用户的 uid 拉黑指定用户
         *
         * @param {string} uid
         * @returns
         */
        async function blockUser(uid) {
            let rnd = Math.floor(Math.random() * 1e4 + 1.5788995e12);
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://weibo.com/ajax/statuses/filterUser',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'referer': `https://weibo.com/u/${uid}`,
                        'origin': 'https://weibo.com',
                    },
                    data: JSON.stringify({ "uid": uid, "status": 1, "interact": 1, "follow": 1, "__rnd": rnd }),
                    onload(res) {
                        resolve(JSON.parse(res.responseText));
                    }
                });
            });
        }


        /**
         * 根据用户的 uid 解除拉黑指定用户
         *
         * @param {string} uid
         * @returns
         */
        async function unblockUser(uid) {
            let rnd = Math.floor(Math.random() * 1e4 + 1.5788995e12);
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://weibo.com/ajax/statuses/deleteFilters',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'referer': `https://weibo.com/u/${uid}`,
                        'origin': 'https://weibo.com',
                    },
                    data: JSON.stringify({ "uid": uid, "__rnd": rnd }),
                    onload(res) {
                        resolve(JSON.parse(res.responseText));
                    }
                });
            });
        }

        /**
         * 获取用户黑名单信息
         *
         * @returns
         */
        async function getUserBlockListInfo() {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://weibo.com/ajax/setting/getFilteredUsers?page=1&__rnd=' + Math.floor(Math.random() * 1e4 + 1.5788995e12),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'referer': 'https://weibo.com/set/shield?type=user',
                        'origin': 'https://weibo.com',
                    },
                    onload(res) {
                        resolve(JSON.parse(res.responseText));
                    }
                });
            });
        }

        /**
         * 获取用户VIP信息
         *
         * @returns
         */
        async function getUserInfo() {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://new.vip.weibo.cn/aj/vipcenter/home?F=vipcenter_jump&from=&lang=zh_CN',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'referer': 'https://new.vip.weibo.cn/vipcenter?portrait_only=1&topnavstyle=1&immersiveScroll=100&F=vipcenter_jump',
                        'origin': 'https://new.vip.weibo.cn',
                    },
                    onload(res) {
                        resolve(JSON.parse(res.responseText));
                    }
                });
            });
        }

        /**
         * 拉黑所有点赞用户 uid 集合
         *
         * @param {Array} actionData
         */
        async function blockAll(actionData) {
            if (confirm('确认拉黑该微博/该评论所有点赞用户吗？') == false || !actionData) {
                return;
            }

            const link = this
            link.onclick = undefined

            this.innerText = `正在获取点赞用户...`
            const uids = await getLikeData(actionData)
            let failed = [...uids]



            const blockUsers = async function(evt) {
                const refailed = []
                link.innerText = `已拉黑 0/${failed.length}`

                for (var i = 0; i < failed.length; i++) {
                    // 休眠
                    if (i % 5 == 0) {
                        await sleep(Math.floor(Math.floor((Math.random() * 1000) + 1000)));
                    }
                    const data = await blockUser(failed[i])
                    if (data.ok != 1) refailed.push(failed[i])

                    link.innerText = `已拉黑 ${i + 1}/${failed.length}: ${data.card.desc1} ${data.card.desc2} ${data.card.title_sub}`

                    if (data.card.pic) {
                        link.style.display = 'flex';
                        link.style.alignItems = 'center'; // 使文字和图片垂直居中
                        // 创建图片元素
                        let image = document.createElement('img');
                        image.style.width = '16px'; // 设置图片宽度
                        image.style.height = '16px'; // 设置图片高度
                        image.style.marginLeft = '5px'; // 设置图片与文字的间距
                        image.src = data.card.pic;
                        // 将图片插入到按钮中
                        link.appendChild(image);
                    }
                }

                if (refailed.length > 0) {
                    link.innerText = `再次尝试拉黑剩余${refailed.length}人`
                    link.onclick = blockUsers

                } else {
                    link.onclick = undefined
                    link.innerText = uids.length + '人已全部拉黑'
                    link.style.color = '#CCC'
                }

                failed = refailed
                evt && evt.stopPropagation()
            }
            await blockUsers()

        }

        /**
         * 取消拉黑所有点赞用户 uid 集合
         *
         * @param {Array} actionData
         */
        async function unblockAll(actionData) {
            if (confirm('确认取消拉黑该微博/该评论所有点赞用户吗？') == false || !actionData) {
                return;
            }

            const link = this
            link.onclick = undefined

            this.innerText = `正在获取点赞用户...`
            const uids = await getLikeData(actionData)
            let failed = [...uids]

            const blockUsers = async function(evt) {
                const refailed = []
                link.innerText = `已取消拉黑 0/${failed.length}`

                for (var i = 0; i < failed.length; i++) {
                    // 休眠
                    if (i % 5 == 0) {
                        await sleep(Math.floor(Math.floor((Math.random() * 1000) + 1000)));
                    }
                    const data = await unblockUser(failed[i])
                    if (data.ok != 1) refailed.push(failed[i])

                    link.innerText = `已取消拉黑 ${i + 1}/${failed.length}: ${data.card.title_sub}`

                    if (data.card.pic) {
                        link.style.display = 'flex';
                        link.style.alignItems = 'center'; // 使文字和图片垂直居中
                        // 创建图片元素
                        let image = document.createElement('img');
                        image.style.width = '16px'; // 设置图片宽度
                        image.style.height = '16px'; // 设置图片高度
                        image.style.marginLeft = '5px'; // 设置图片与文字的间距
                        image.src = data.card.pic;
                        // 将图片插入到按钮中
                        link.appendChild(image);
                    }
                }

                if (refailed.length > 0) {
                    link.innerText = `再次尝试取消拉黑剩余${refailed.length}人`
                    link.onclick = blockUsers

                } else {
                    link.onclick = undefined
                    link.innerText = uids.length + '人已全部取消拉黑'
                    link.style.color = '#CCC'
                }

                failed = refailed
                evt && evt.stopPropagation()
            }
            await blockUsers()

        }

        // 获取hid元素
        const hidElement = document.getElementById('extra_data');
        if (!hidElement) {
            console.log('未找到extra_data元素');
            return;
        }
        // 解析hid元素中的value参数
        const params = new URLSearchParams(hidElement.value);

        // 当前用户黑名单信息
        const userBlockListInfo = document.createElement('div');
        userBlockListInfo.classList.add('mod-txt');
        userBlockListInfo.textContent = '';

        // 创建“拉黑评论用户”按钮
        const blockCommentUserButton = document.createElement('button');
        blockCommentUserButton.textContent = '拉黑该用户';
        blockCommentUserButton.style.marginLeft = '10px';
        blockCommentUserButton.style.padding = '5px 10px';
        blockCommentUserButton.style.backgroundColor = '#ff4d4f';
        blockCommentUserButton.style.color = '#fff';
        blockCommentUserButton.style.border = 'none';
        blockCommentUserButton.style.borderRadius = '4px';
        blockCommentUserButton.style.cursor = 'pointer';
        blockCommentUserButton.style.marginTop = '10px'; // 设置容器与上方元素的间距

        // 创建“取消拉黑评论用户”按钮
        const unblockCommentUserButton = document.createElement('button');
        unblockCommentUserButton.textContent = '取消拉黑该用户';
        unblockCommentUserButton.style.marginLeft = '10px';
        unblockCommentUserButton.style.padding = '5px 10px';
        unblockCommentUserButton.style.backgroundColor = '#228B22';
        unblockCommentUserButton.style.color = '#fff';
        unblockCommentUserButton.style.border = 'none';
        unblockCommentUserButton.style.borderRadius = '4px';
        unblockCommentUserButton.style.cursor = 'pointer';
        unblockCommentUserButton.style.marginTop = '10px'; // 设置容器与上方元素的间距

        // 创建“拉黑点赞用户”按钮
        const blockLikeUserButton = document.createElement('button');
        const firstLikePage = await getLikePage(params.get('rid'), 1);
        blockLikeUserButton.textContent = `拉黑点赞用户：共 ${firstLikePage[2]||0} 位`;
        blockLikeUserButton.style.marginLeft = '10px';
        blockLikeUserButton.style.padding = '5px 10px';
        blockLikeUserButton.style.backgroundColor = '#ff4d4f';
        blockLikeUserButton.style.color = '#fff';
        blockLikeUserButton.style.border = 'none';
        blockLikeUserButton.style.borderRadius = '4px';
        blockLikeUserButton.style.cursor = 'pointer';
        blockLikeUserButton.style.marginTop = '10px'; // 设置容器与上方元素的间距

        // 创建“解除拉黑点赞用户”按钮
        const unblockLikeUserButton = document.createElement('button');
        unblockLikeUserButton.textContent = `解除拉黑点赞用户：共 ${firstLikePage[2]||0} 位`;
        unblockLikeUserButton.style.marginLeft = '10px';
        unblockLikeUserButton.style.padding = '5px 10px';
        unblockLikeUserButton.style.backgroundColor = '#228B22';
        unblockLikeUserButton.style.color = '#fff';
        unblockLikeUserButton.style.border = 'none';
        unblockLikeUserButton.style.borderRadius = '4px';
        unblockLikeUserButton.style.cursor = 'pointer';
        unblockLikeUserButton.style.marginTop = '10px'; // 设置容器与上方元素的间距

        // 拉黑提提示信息
        const blockInfo = document.createElement('div')
        blockInfo.innerHTML = '<div class="mod-txt" style="margin-top: 10px;">屏蔽拉黑用户，目前非会员用户可以屏蔽或拉黑5000个微博用户，会员用户屏蔽上限如下（更新时间：2025年6月6日），信息来源：<a href="https://kefu.weibo.com/faqdetail?id=18937" target="_blank">微博客服</a><br><img src="https://cs.s.weibo.com/knowledge/atts/1d548ecddabf5d504cbfd7d439a54325.png"></div>'

        reportElement.parentNode.style.flexDirection = 'column'; // 垂直排列

        // 将按钮插入到report元素后面
        reportElement.parentNode.insertBefore(userBlockListInfo, reportElement.nextSibling);
        // 换行
        const br0 = document.createElement('div')
        br0.innerHTML = ''
        reportElement.parentNode.insertBefore(br0, userBlockListInfo.nextSibling);
        reportElement.parentNode.insertBefore(blockCommentUserButton, br0.nextSibling);

        const br1 = document.createElement('div')
        br1.innerHTML = ''
        reportElement.parentNode.insertBefore(br1, blockCommentUserButton.nextSibling);
        reportElement.parentNode.insertBefore(unblockCommentUserButton, br1.nextSibling);

        const br2 = document.createElement('div')
        br2.innerHTML = ''
        reportElement.parentNode.insertBefore(br2, unblockCommentUserButton.nextSibling);
        reportElement.parentNode.insertBefore(blockLikeUserButton, br2.nextSibling);
        const br3 = document.createElement('div')
        br3.innerHTML = ''
        reportElement.parentNode.insertBefore(br3, blockLikeUserButton.nextSibling);
        reportElement.parentNode.insertBefore(unblockLikeUserButton, br3.nextSibling);
        const br4 = document.createElement('div')
        br4.innerHTML = ''
        reportElement.parentNode.insertBefore(br4, unblockLikeUserButton.nextSibling);
        reportElement.parentNode.insertBefore(blockInfo, br4.nextSibling);

        const userBlockData = await getUserBlockListInfo();
        if (userBlockData && userBlockData.total) {
            userBlockListInfo.textContent = `当前用户黑名单人数: ${userBlockData.total} 人, 用户VIP信息: `;
            const userVipData = await getUserInfo();
            if (userVipData && userVipData.data.baseInfo.user_info.gif_icon) {
                // 创建图片元素
                const image = document.createElement('img');
                image.src = userVipData.data.baseInfo.user_info.gif_icon
                image.style.width = '50px'; // 设置图片宽度
                image.style.height = '25px'; // 设置图片高度

                // 将图片插入到按钮中
                userBlockListInfo.appendChild(image);
            } else {
                userBlockListInfo.textContent = `当前用户黑名单人数: ${userBlockData.total} 人, 用户VIP信息: 无`;
            }
        }

        // 为“拉黑评论用户”按钮添加点击事件
        blockCommentUserButton.onclick = async function() {
            const rUid = params.get('r_uid');
            if (rUid) {
                // 当前用户昵称
                const n = document.querySelector('.mod-user .m-box .mod-text-box p a') || document.querySelector('dl dd p.module-infobox a')
                const nickname = n ? n.innerText : ''
                if (confirm(`确认拉黑该微博/该评论用户：${nickname} 吗？`) == true) {
                    // 在这里添加拉黑评论用户的逻辑
                    const data = await blockUser(rUid)
                    if (data.ok != 1) {
                        alert('拉黑失败，请重试。');
                    } else {
                        this.onclick = undefined
                        this.innerText = '已拉黑 ' + data.card.title_sub
                        this.style.color = '#CCC'
                        if (data.card.pic) {
                            this.style.display = 'flex';
                            this.style.alignItems = 'center'; // 使文字和图片垂直居中
                            // 创建图片元素
                            const image = document.createElement('img');
                            image.src = data.card.pic;
                            image.style.width = '16px'; // 设置图片宽度
                            image.style.height = '16px'; // 设置图片高度
                            image.style.marginLeft = '5px'; // 设置图片与文字的间距

                            // 将图片插入到按钮中
                            this.appendChild(image);
                        }
                    }
                }
            } else {
                alert('未找到用户id参数');
            }
        };

        // 为“取消拉黑评论用户”按钮添加点击事件
        unblockCommentUserButton.onclick = async function() {
            const rUid = params.get('r_uid');
            if (rUid) {
                // 当前用户昵称
                const n = document.querySelector('.mod-user .m-box .mod-text-box p a') || document.querySelector('dl dd p.module-infobox a')
                const nickname = n ? n.innerText : ''
                if (confirm(`确认取消拉黑该微博/该评论用户：${nickname} 吗？`) == true) {
                    // 在这里添加拉黑评论用户的逻辑
                    const data = await unblockUser(rUid)
                    if (data.ok != 1) {
                        alert('取消拉黑失败，请重试。');
                    } else {
                        this.onclick = undefined
                        this.innerText = '已取消拉黑 ' + data.card.title_sub
                        this.style.color = '#CCC'
                        if (data.card.pic) {
                            this.style.display = 'flex';
                            this.style.alignItems = 'center'; // 使文字和图片垂直居中
                            // 创建图片元素
                            const image = document.createElement('img');
                            image.src = data.card.pic;
                            image.style.width = '16px'; // 设置图片宽度
                            image.style.height = '16px'; // 设置图片高度
                            image.style.marginLeft = '5px'; // 设置图片与文字的间距

                            // 将图片插入到按钮中
                            this.appendChild(image);
                        }
                    }
                }
            } else {
                alert('未找到用户id参数');
            }
        };

        if ((firstLikePage[2] || 0) == 0) {
            blockLikeUserButton.onclick = undefined
            unblockLikeUserButton.onclick = undefined
        } else {
            // 为“拉黑点赞用户”按钮添加点击事件
            blockLikeUserButton.onclick = blockAll.bind(blockLikeUserButton, params.get('rid'));
            // 为“取消拉黑点赞用户”按钮添加点击事件
            unblockLikeUserButton.onclick = unblockAll.bind(unblockLikeUserButton, params.get('rid'));
        }

    });
})();
