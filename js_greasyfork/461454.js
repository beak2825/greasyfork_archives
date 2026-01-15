// ==UserScript==
// @name         微博帖子一键收藏、屏蔽、新页面打开
// @namespace    http://tampermonkey.net/
// @version      20260110
// @description  在微博网页端，为每个帖子创建一个收藏和新页面打开按钮。
// @author       Fat Cabbage
// @license      MIT
// @match        https://www.weibo.com/*
// @match        https://weibo.com/*
// @match        https://s.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/461454/%E5%BE%AE%E5%8D%9A%E5%B8%96%E5%AD%90%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F%E3%80%81%E5%B1%8F%E8%94%BD%E3%80%81%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/461454/%E5%BE%AE%E5%8D%9A%E5%B8%96%E5%AD%90%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F%E3%80%81%E5%B1%8F%E8%94%BD%E3%80%81%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

let blockConfig = new Map();
let onScrollFlag = false;
let needUpdateNodeList = [];
let blogCaches = new Map();
let menuSettingFav;
let menuSettingBlock;
let menuSettingHide;
let buttonBlockHide;
let buttonOpenHide;
let buttonFavHide;

class ClassName {
    static button = 'button_a656';
    static buttonFavorite = 'button_a656_favorite';
    static buttonOpenNewTab = 'button_a656_open_new_tab';
}

class Domain {
    static WEIBO = 'weibo.com';
    static WEIBO_S = 's.weibo.com';
    static WEIBO_3W = 'www.weibo.com';
    static domain = location.hostname;
}

class Const {
    static ID = 'ID';
    static BLOG_ID = 'blogID';
    static IS_FAVORITE = 'isFavorites';
    static LAST_UPDATED = 'lastUpdated';
    static IS_LOADING = 'isLoading';

    static RES_OK = 'ok';
    static RES_CODE = 'code';

    static FAV_TOTAL_FAV = 'fav_total_num';
    static FAV_TAGS = 'tags';
    static FAV_TAGS_TAG = 'tag';
    static FAV_TAGS_COUNT = 'count';
    static FAV_TOTAL_TAG = 'total_number';
    static FAV_SELECT_TAGS = 'CONST_FAV_SELECT_TAGS';
    static BLOCK_SELECT_LEVEL = 'CONST_BLOCK_SELECT_LEVEL';
    static BUTTON_SELECT_HIDE = 'CONST_BUTTON_SELECT_HIDE';

    static LIST_TO_BE_BLOCK = 'LIST_TO_BE_BLOCK';
    static LIST_TO_BE_BLOCK_UPDATING = 'LIST_TO_BE_BLOCK_UPDATING';

    static BLOCK_FULL_LIST_STORE = 'BLOCK_FULL_LIST_STORE';
    static BLOCK_FULL_LIST_STORE_LAST_UPDATE_DATE = 'BLOCK_FULL_LIST_STORE_LAST_UPDATE_DATE';

    static PROMPT_TIME_MS = 1000;
}

class Selector {
    static expandButtonSelector = 'button[title="展开"]';
    static rootNodeClass;
    static postNodeFullClass;
    static buttonLocateSelector;
    static userASector;
    static userTitleSector;
    static timeASector;
    static forwardNodeStartClass;
    static forwardNodeSelector;
    static likeButtonSelector;

    static {
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            Selector.rootNodeClass = 'vue-recycle-scroller__item-wrapper';
            // Selector.rootNodeClass = 'Main_full';
            Selector.postNodeFullClass = `Feed_wrap`;
            Selector.buttonLocateSelector = 'header > div[class*="woo-box-flex"] > :nth-child(1)';
            Selector.userASector = `a[class*="head_name"]`;
            Selector.userTitleSector = `a[class*="head_name"] > span`;
            // Selector.timeASector = `a[class^="head-info_time"]`;
            Selector.timeASector = `a[class^="_time_"]`;
            Selector.forwardNodeStartClass = 'retweet Feed_retweet'
            Selector.forwardNodeSelector = 'div.retweet[class*="Feed_retweet"]'
            Selector.likeButtonSelector = 'button[title="赞"]';
        } else if (Domain.domain === Domain.WEIBO_S) {
            Selector.rootNodeClass = 'main-full';
            Selector.postNodeFullClass = 'card';
            Selector.buttonLocateSelector = 'div.menu.s-fr';
            // buttonLocateSelector = 'div.from > a:last-child';
            Selector.userASector = `div.info > :nth-child(2) > a:first-child`;
            Selector.userTitleSector = Selector.userASector;
            Selector.timeASector = `div.from > a:first-child`;
            Selector.likeButtonSelector = 'a[title="赞"]';
        }
    }
}

class BlogCache {
    static get(blogID, key) {
        if (!blogCaches.has(blogID)) {
            let blogCache = {};
            blogCaches.set(blogID, blogCache);
        }
        return blogCaches.get(blogID)[key];
    }

    static set(blogID, key, value) {
        let blogCache = blogCaches.get(blogID);
        if (blogCache == null) {
            blogCache = {};
        }
        blogCache[key] = value;
        blogCache[Const.LAST_UPDATED] = new Date();
        blogCaches.set(blogID, blogCache);
    }
}

class TimeConvert {
    static toSeconds(milliseconds) {
        return milliseconds / 1000;
    }

    static toMinutes(milliseconds) {
        return TimeConvert.toSeconds(milliseconds) / 60;
    }

    static toHours(milliseconds) {
        return TimeConvert.toMinutes(milliseconds) / 60;
    }

    static toDays(milliseconds) {
        return TimeConvert.toHours(milliseconds) / 24;
    }
}

class Do {
    static setFavTags() {
        function getFavTagInfo() {
            let url = 'https://weibo.com/ajax/favorites/tags?is_show_total=1';
            let token = Cookie.get('XSRF-TOKEN');
            return $.ajax({
                url: url, type: 'GET', headers: {
                    'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                }
            }).then(res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res;
            });
        }

        getFavTagInfo().then(async res => {
            if (res) {
                let tagList = res[Const.FAV_TAGS];
                let tagText = [];
                for (let i = 0; i < tagList.length; i++) {
                    let t = tagList[i];
                    let name = t[Const.FAV_TAGS_TAG];
                    let count = t[Const.FAV_TAGS_COUNT];
                    tagText.push(`${i} ${name} ( 共 ${count} 条 )`);
                }
                let tagTmp = tagText.join('\n');

                GM_.get(Const.FAV_SELECT_TAGS).then(selected => {
                    if (selected === '') {
                        selected = '无';
                    }

                    let info = `收藏总数: ${res[Const.FAV_TOTAL_FAV]}
标签总数：${res[Const.FAV_TOTAL_TAG]}
当前标签选择：${selected}
1. 输入标签索引，以空格分隔，最多可设置两个标签
2. 输入为空表示不设置标签
3. 如需新建标签，请通过微博手动添加
示例：要选择第1个与第3个已有标签，输入“0 2”\n
${tagTmp}`;

                    let input = prompt(info).trim()
                    let nameTmp;
                    if (input === '') {
                        nameTmp = '';
                    } else {
                        let split = input.split(' ');
                        let nameList = [];
                        for (let i = 0; i < split.length; i++) {
                            let j = parseInt(split[i]);
                            if (j < 0 || j > tagList.length - 1) {
                                alert(`第${i + 1}个输入不合法，需要重新输入`);
                                return;
                            }
                            let t = tagList[j];
                            let name = t[Const.FAV_TAGS_TAG];
                            nameList.push(name);
                        }
                        nameTmp = nameList.join(' ');
                    }
                    GM_.set(Const.FAV_SELECT_TAGS, nameTmp);

                    GM_.unregisterMenuCommand(menuSettingFav);
                    if (nameTmp === '') {
                        nameTmp = '无';
                    }
                    menuSettingFav = GM_.registerMenuCommand(`设置收藏标签 当前：${nameTmp}`, () => {
                        Do.setFavTags();
                    });

                    if (input === '') {
                        alert('标签设置已清空，即时生效');
                    } else {
                        alert(`标签已设置: ${nameTmp}，即时生效`);
                    }
                });
            } else {
                alert('获取标签列表失败');
            }
        })
    }

    static setBlockLevels() {
        let levelList = ['不看微博', '禁止互动', '禁止关注'];
        let levelText = [];
        for (let i = 0; i < levelList.length; i++) {
            let item = levelList[i];
            levelText.push(`${i} ${item}`);
        }
        let tagTmp = levelText.join('\n');

        GM_.get(Const.BLOCK_SELECT_LEVEL).then(selected => {
            if (selected === '') {
                selected = '不看微博';
            }

            let info = `当前屏蔽设置：${selected}
1. 输入屏蔽级别索引，以空格分隔
2. 输入为空表示默认设置（${levelList[0]}）
示例：要选择第1个与第3个屏蔽级别，输入“0 2”\n
${tagTmp}`;

            let input = prompt(info).trim()
            let nameTmp;
            if (input === '') {
                nameTmp = '不看微博';
            } else {
                let split = input.split(' ');
                let nameList = [];
                for (let i = 0; i < split.length; i++) {
                    let j = parseInt(split[i]);
                    if (j < 0 || j > levelList.length - 1) {
                        alert(`第${i + 1}个输入不合法，需要重新输入`);
                        return;
                    }
                    let name = levelList[j];
                    nameList.push(name);
                }
                nameTmp = nameList.join(' ');
            }
            GM_.set(Const.BLOCK_SELECT_LEVEL, nameTmp);

            GM_.unregisterMenuCommand(menuSettingBlock);
            if (nameTmp === '') {
                nameTmp = '无';
            }
            menuSettingBlock = GM_.registerMenuCommand(`设置屏蔽级别 当前：${nameTmp}`, () => {
                Do.setBlockLevels();
            });

            if (input === '') {
                alert('屏蔽已设为默认，即时生效');
            } else {
                alert(`屏蔽已设置: ${nameTmp}，即时生效`);
            }
        });
    }

    static setButtonHide() {
        let buttonList = ['屏蔽用户', '新页面打开', '收藏'];
        let buttonText = [];
        for (let i = 0; i < buttonList.length; i++) {
            let item = buttonList[i];
            buttonText.push(`${i} ${item}`);
        }
        let tagTmp = buttonText.join('\n');

        GM_.get(Const.BUTTON_SELECT_HIDE).then(selected => {
            if (selected === '') {
                selected = '无';
            }

            let info = `当前显示按钮：${selected}
1. 输入要显示的按钮，以空格分隔
2. 输入为空表示默认设置（三个按钮全部显示）
3. 刷新页面后生效
示例：要隐藏“屏蔽用户”“新页面打开”按钮，输入“0 1”\n
${tagTmp}`;

            let input = prompt(info).trim()
            let nameTmp;
            if (input === '') {
                nameTmp = '';
            } else {
                let split = input.split(' ');
                let nameList = [];
                for (let i = 0; i < split.length; i++) {
                    let j = parseInt(split[i]);
                    if (j < 0 || j > buttonList.length - 1) {
                        alert(`第${i + 1}个输入不合法，需要重新输入`);
                        return;
                    }
                    let name = buttonList[j];
                    nameList.push(name);
                }
                nameTmp = nameList.join(' ');
            }
            GM_.set(Const.BUTTON_SELECT_HIDE, nameTmp);

            GM_.unregisterMenuCommand(menuSettingHide);
            if (nameTmp === '') {
                nameTmp = '无';
            }
            menuSettingHide = GM_.registerMenuCommand(`设置按钮隐藏 当前：${nameTmp}`, () => {
                Do.setButtonHide();
            });

            if (input === '') {
                alert('按钮已全部显示，刷新页面以生效');
            } else {
                alert(`按钮已隐藏: ${nameTmp}，刷新页面以生效`);
            }
        });
    }
}

class Locate {
    static articleNode(node, type = 'default') {
        let headerNode = node.closest('div.vue-recycle-scroller__item-view');
        if (headerNode) {
            return headerNode;
        }
        console.log('else')
        // let postList = node.querySelectorAll(`article[class*="woo-panel-main"]`);
        // if (postList.length > 0) {
        //     return postList[0];
        // }
        // while (node != null) {
        //     if (node.className == null) {
        //         return null;
        //     }
        //     if (type === 'default') {
        //         if (node.className.indexOf(Selector.postNodeFullClass) >= 0) {
        //             return node;
        //         }
        //     } else if (type === 'forward') {
        //         if (node.className.indexOf(Selector.forwardNodeStartClass) >= 0) {
        //             return node;
        //         }
        //     }
        //     node = node.parentNode;
        // }
        return null;
    }

    static likeButton(articleNode) {
        return articleNode.querySelector(Selector.likeButtonSelector)
    }
}

class BlogView {
    static getBlogID(articleNode) {
        // console.log(articleNode)
        let timeA = articleNode.querySelector(Selector.timeASector);
        let url = timeA.href;
        let index = url.lastIndexOf('/');
        return url.substring(index + 1);
    }

    static getUserID(articleNode) {
        let url = articleNode.querySelector(Selector.userASector).href;
        let slashIndex = url.lastIndexOf('/');
        let questionIndex = url.lastIndexOf('?');
        if (questionIndex >= 0) {
            return url.substring(slashIndex + 1, questionIndex);
        } else {
            return url.substring(slashIndex + 1);
        }
    }

    static getUsername(articleNode) {
        return articleNode.querySelector(Selector.userTitleSector).text;
    }

    static getBlogIDNum(articleNode) {
        if (Domain.domain === Domain.WEIBO_S) {
            let node = articleNode;
            while (node != null) {
                let actionType = node.getAttribute(`action-type`);
                if (actionType === `feed_list_item`) {
                    return node.getAttribute(`mid`);
                }

                node = node.parentNode;
            }
            return null;
        }
        return null;
    }

    static getLink(articleNode) {
        return articleNode.querySelector(Selector.timeASector).href;
    }
}

class Button {
    static buttonClassList;

    static addBaseClass(node) {
        if (Button.buttonClassList == null) {
            let settingButton = document.querySelector(Selector.expandButtonSelector)
            Button.buttonClassList = settingButton.classList;
        }
        for (let cl of Button.buttonClassList) {
            node.classList.add(cl);
        }
    }

    static createFavorite(type = 'default', like = false) {
        let buttonNode = document.createElement('button');

        buttonNode.classList.add(ClassName.button);
        buttonNode.classList.add(ClassName.buttonFavorite);
        Button.addBaseClass(buttonNode);

        buttonNode.style.display = buttonFavHide;
        buttonNode.style.width = 'auto';
        buttonNode.style.minWidth = '46.667px';
        buttonNode.style.height = '28px';
        buttonNode.style.marginLeft = '0px';
        buttonNode.style.marginRight = '5px';
        buttonNode.style.paddingLeft = '10px';
        buttonNode.style.paddingRight = '10px';

        buttonNode.addEventListener('click', ev => {
            let buttonNode = ev.target;
            let articleNode = Locate.articleNode(buttonNode, type);
            let blogID = BlogView.getBlogID(articleNode);
            let ID = BlogCache.get(blogID, Const.ID)

            let isFavorites = BlogCache.get(blogID, Const.IS_FAVORITE)
            let error = false;

            if (isFavorites) {
                Favorite.remove(ID).then(res => {
                    if (res) {
                        BlogCache.set(blogID, Const.IS_FAVORITE, false);
                        buttonNode.innerText = `已取消收藏`;
                        setTimeout(() => {
                            buttonNode.innerText = `收藏`;
                        }, Const.PROMPT_TIME_MS);
                    } else {
                        buttonNode.innerText = `取消收藏失败`;
                        error = true;
                    }
                });
            } else {
                Favorite.set(ID).then(res => {
                    if (res) {
                        BlogCache.set(blogID, Const.IS_FAVORITE, true);
                        buttonNode.innerText = `已收藏`;
                        setTimeout(() => {
                            buttonNode.innerText = `取消收藏`;
                        }, Const.PROMPT_TIME_MS);
                    } else {
                        buttonNode.innerText = `收藏失败`;
                        error = true;
                    }
                });
            }
        });
        return buttonNode;
    }

    static createOpen(type = 'default') {
        let buttonNode = document.createElement('button');
        buttonNode.textContent = '新页面打开';

        buttonNode.classList.add(ClassName.button);
        buttonNode.classList.add(ClassName.buttonOpenNewTab);
        Button.addBaseClass(buttonNode);

        buttonNode.setAttribute('href', '#woo_svg_nav_sun');

        buttonNode.style.display = buttonOpenHide;
        buttonNode.style.width = 'auto';
        buttonNode.style.minWidth = '46.667px';
        buttonNode.style.height = '28px';
        buttonNode.style.marginRight = '5px';
        buttonNode.style.marginLeft = '0px';
        buttonNode.style.paddingLeft = '10px';
        buttonNode.style.paddingRight = '10px';

        buttonNode.addEventListener('click', ev => {
            let buttonNode = ev.target;
            let articleNode = Locate.articleNode(buttonNode, type);
            let link = BlogView.getLink(articleNode);
            window.open(link);
        });
        return buttonNode;
    }

    static createBlock(type = 'default') {
        let buttonNode = document.createElement('button');
        buttonNode.textContent = '屏蔽用户';

        buttonNode.classList.add(ClassName.button);
        buttonNode.classList.add(ClassName.buttonOpenNewTab);
        Button.addBaseClass(buttonNode);

        buttonNode.style.display = buttonBlockHide;
        buttonNode.style.width = 'auto';
        buttonNode.style.minWidth = '46.667px';
        buttonNode.style.height = '28px';
        buttonNode.style.marginLeft = '0px';
        buttonNode.style.marginRight = '5px';
        buttonNode.style.paddingLeft = '10px';
        buttonNode.style.paddingRight = '10px';

        buttonNode.addEventListener('click', ev => {
            let buttonNode = ev.target;
            let articleNode = Locate.articleNode(buttonNode, type);
            let userID = BlogView.getUserID(articleNode);
            let username = BlogView.getUsername(articleNode);
            Block.set(userID, username).then(res => {
                if (res) {
                    buttonNode.innerText = `已屏蔽`;
                } else {
                    buttonNode.innerText = `屏蔽失败`;
                }
            });
        });
        return buttonNode;
    }
}

class Favorite {
    static get(ID) {
        BlogCache.set(ID, Const.IS_LOADING, true);
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {

            let url;
            if (Domain.domain === Domain.WEIBO) {
                url = `https://weibo.com/ajax/statuses/show?id=${ID}`;
            } else {
                url = `https://www.weibo.com/ajax/statuses/show?id=${ID}`;
            }

            return $.ajax({
                url: url, type: 'GET',
            }).then(res => {
                BlogCache.set(ID, Const.ID, res['id']);
                BlogCache.set(ID, Const.BLOG_ID, ID);
                BlogCache.set(ID, Const.IS_FAVORITE, res['favorited']);
                BlogCache.set(ID, Const.IS_LOADING, false);
            });
        } else if (Domain.domain === Domain.WEIBO_S) {
            return new Promise(() => {
                BlogCache.set(ID, Const.BLOG_ID, ID);
                BlogCache.set(ID, Const.IS_FAVORITE, false);
                BlogCache.set(ID, Const.IS_LOADING, false);
            })
        }
    }

    static set(ID) {
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            let data = JSON.stringify({'id': `${ID}`});
            let token = Cookie.get('XSRF-TOKEN');

            let url;
            if (Domain.domain === Domain.WEIBO) {
                url = `https://weibo.com/ajax/statuses/createFavorites`;
            } else {
                url = `https://www.weibo.com/ajax/statuses/createFavorites`;
            }

            return $.ajax({
                url: url, type: 'POST', data: data, headers: {
                    'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                }
            }).then(async res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return GM_.get(Const.FAV_SELECT_TAGS).then(tags => {
                    if (tags !== '') {
                        tags = tags.split(' ');
                        tags = tags.join(',');
                        Favorite.setTags(ID, tags);
                    }
                    return res[Const.RES_OK] === 1;
                });
            });
        } else if (Domain.domain === Domain.WEIBO_S) {
            let data = {
                'mid': `${ID}`
            };
            return $.ajax({
                url: `https://s.weibo.com/ajax_Mblog/favAdd`, type: 'POST', data: data
            }).then(res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res[Const.RES_CODE] === `100000`;
            });
        }
    }

    static remove(ID) {
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            let data = JSON.stringify({'id': `${ID}`});
            let token = Cookie.get('XSRF-TOKEN');

            let url;
            if (Domain.domain === Domain.WEIBO) {
                url = `https://weibo.com/ajax/statuses/destoryFavorites`;
            } else {
                url = `https://www.weibo.com/ajax/statuses/destoryFavorites`;
            }

            return $.ajax({
                url: url, type: 'POST', data: data, headers: {
                    'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                }
            }).then(res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res[Const.RES_OK] === 1;
            });
        } else if (Domain.domain === Domain.WEIBO_S) {
            let data = {
                'mid': `${ID}`
            };
            return $.ajax({
                url: `https://s.weibo.com/ajax_Mblog/favDel`, type: 'POST', data: data
            }).then(res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res[Const.RES_CODE] === `100000`;
            });
        }
    }

    static setTags(ID, tags) {
        let data = JSON.stringify({'id': `${ID}`, 'tags': `${tags}`});
        let token = Cookie.get('XSRF-TOKEN');

        let url = 'https://weibo.com/ajax/favorites/tags/update';
        return $.ajax({
            url: url, type: 'POST', data: data, headers: {
                'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
            }
        }).then(res => {
            if (typeof res === `string`) {
                console.log(res);
                return false;
            }
            return res[Const.RES_OK] === 1;
        });
    }
}

class Block {
    static get(ID) {
        return Block.getList().then(list => {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === id) {
                    return true;
                }
            }
            return false;
        });
    }

    static set(ID, username) {
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            return GM_.get(Const.BLOCK_SELECT_LEVEL).then(tags => {
                let tmp = tags.split(' ')
                let _status = tmp.indexOf('不看微博') === -1 ? 0 : 1;
                let _interact = tmp.indexOf('禁止互动') === -1 ? 0 : 1;
                let _follow = tmp.indexOf('禁止关注') === -1 ? 0 : 1;

                if ([_status, _interact, _follow].indexOf(1) === -1) {
                    _status = 1;
                }

                let data = JSON.stringify({
                    'uid': `${ID}`,
                    'screen_name': `${username}`,
                    'status': _status,
                    'interact': _interact,
                    'follow': _follow
                });
                let token = Cookie.get('XSRF-TOKEN');

                let url;
                if (Domain.domain === Domain.WEIBO) {
                    url = `https://weibo.com/ajax/statuses/filterUser`;
                } else {
                    url = `https://www.weibo.com/ajax/statuses/`;
                }

                return $.ajax({
                    url: url, type: 'POST', data: data, headers: {
                        'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                    }
                }).then(async res => {
                    if (typeof res === `string`) {
                        console.log(res);
                        return false;
                    }
                    return res[Const.RES_OK] === 1;
                });
            });
        } else if (Domain.domain === Domain.WEIBO_S) {
            return GMHelper.addBlockItem(ID, username);
        }
    }

    static remove(ID, username) {
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            let data = JSON.stringify({
                'uid': `${ID}`,
                'screen_name': `${username}`
            });
            let token = Cookie.get('XSRF-TOKEN');

            let url;
            if (Domain.domain === Domain.WEIBO) {
                url = `https://weibo.com/ajax/setting/deleteFilteredUser`;
            } else {
                url = `https://www.weibo.com/ajax/statuses/`;
            }

            return $.ajax({
                url: url, type: 'POST', data: data, headers: {
                    'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                }
            }).then(async res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res[Const.RES_OK] === 1;
            });
        } else if (Domain.domain === Domain.WEIBO_S) {
            return GMHelper.removeBlockItem(ID);
        }
    }

    static getList() {
        return GM_.get(Const.BLOCK_FULL_LIST_STORE);
        // return GM_.get(Const.BLOCK_FULL_LIST_STORE).then(res => {
        //     console.log(res);
        //     return res.split(' ');
        // });
    }

    static addFromServer() {
        function loadPage(page) {
            let token = Cookie.get('XSRF-TOKEN');
            let url = `https://weibo.com/ajax/setting/getFilteredUsers?page=${page}`;
            return $.ajax({
                url: url, type: 'GET', headers: {
                    'Content-Type': 'application/json; charset=utf-8', 'X-Xsrf-Token': `${token}`
                }
            }).then(async res => {
                if (typeof res === `string`) {
                    console.log(res);
                    return false;
                }
                return res;
            });
        }

        function getBlockListRec(list, page, total = 0, rememberTotal = true) {
            return new Promise(resolve => {
                loadPage(page).then(res => {
                    if (rememberTotal) {
                        total = res['total'];
                    }

                    res['card_group'].forEach(item => {
                        let scheme = item['scheme'];
                        let lastIndex = scheme.lastIndexOf('=');
                        let ID = scheme.substring(lastIndex + 1);
                        list.push(ID);
                    });

                    if (list.length < total) {
                        let random = Math.random() * (200 - 50) + 50;
                        let timeout = 300 + random;
                        setTimeout(() => {
                            getBlockListRec(list, page + 1, total, false).then(() => resolve());
                        }, timeout);
                    } else {
                        resolve();
                    }
                });
            });
        }

        if (Domain.domain === Domain.WEIBO) {
            let blockList = [];
            return getBlockListRec(blockList, 1).then(() => {
                Block.getList().then(list => {
                    let split = blockList.join(' ');
                    list = list.concat(split);
                    list = [...new Set(list)];
                    GM_.set(Const.BLOCK_FULL_LIST_STORE, list);
                    GM_.set(Const.BLOCK_FULL_LIST_STORE_LAST_UPDATE_DATE, new Date().toString());
                });
            });
        }
    }

    static logStore() {
        Block.getList().then(list => {
            GM_.get(Const.BLOCK_FULL_LIST_STORE_LAST_UPDATE_DATE).then(res => {
                console.log(`存储的用户屏蔽数量：${list.length}，上次更新时间：${res}`);
            });
        });
    }
}

class GMHelper {
    static waitValue(name, expectedValue, timeout = 100, nullValue = expectedValue) {
        GM_.get(name, nullValue).then(res => {
            if (res === expectedValue) {
                return;
            }
            let inspection = setInterval(() => {
                GM_.get(name, nullValue).then(res => {
                    if (res === expectedValue) {
                        clearInterval(inspection);
                    }
                });
            }, timeout);
        });
    }

    static addBlockItem(ID, username) {
        GMHelper.waitValue(Const.LIST_TO_BE_BLOCK_UPDATING, 'false');
        GM_.set(Const.LIST_TO_BE_BLOCK_UPDATING, 'true');

        GM_.get(Const.LIST_TO_BE_BLOCK, '').then(res => {
            let split = res.split(';');
            for (let i = 0; i < split.length; i++) {
                let iID = split[i].split(' ')[0];
                if (iID === ID) {
                    GM_.set(Const.LIST_TO_BE_BLOCK_UPDATING, 'false');
                    return;
                }
            }
            let item = `${ID} ${username}`;
            split.push(item);
            let text = split.join(' ');
            GM_.set(Const.LIST_TO_BE_BLOCK, text);
            GM_.set(Const.LIST_TO_BE_BLOCK_UPDATING, 'false');
        });
        return Promise.resolve();
    }

    static removeBlockItem(ID) {
        GMHelper.waitValue(Const.LIST_TO_BE_BLOCK_UPDATING, 'false');
        GM_.set(Const.LIST_TO_BE_BLOCK_UPDATING, 'true');

        GM_.get(Const.LIST_TO_BE_BLOCK, '').then(res => {
            let split = res.split(';');
            split = split.filter(s => {
                let sID = s.split(' ')[0];
                return sID === ID;
            })
            let text = split.join(' ');
            GM_.set(Const.LIST_TO_BE_BLOCK, text);
            GM_.set(Const.LIST_TO_BE_BLOCK_UPDATING, 'false');
        });
    }
}

class GM_ {
    static async get(name, defaultV = '') {
        let value = await GM.getValue(name);
        if (value === undefined || (typeof value == 'string' && value.trim() === '')) {
            value = defaultV;
        }
        return Promise.resolve(value);
    }

    static set(name, value) {
        GM.setValue(name, value);
    }

    static registerMenuCommand(name, fun) {
        return GM_registerMenuCommand(name, fun);
    }

    static unregisterMenuCommand(name) {
        GM_unregisterMenuCommand(name)
    }
}

class Cookie {
    static get(name) {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }
}

(function () {
    'use strict';

    GM_.get(Const.FAV_SELECT_TAGS, '无').then(selected => {
        menuSettingFav = GM_.registerMenuCommand(`设置收藏标签 当前：${selected}`, () => {
            Do.setFavTags();
        });
    });

    GM_.get(Const.BLOCK_SELECT_LEVEL, '不看微博').then(selected => {
        menuSettingBlock = GM_.registerMenuCommand(`设置屏蔽 当前：${selected}`, () => {
            Do.setBlockLevels();
        });
    });

    GM_.get(Const.BUTTON_SELECT_HIDE, '无').then(selected => {
        menuSettingHide = GM_.registerMenuCommand(`设置按钮隐藏 当前：${selected}`, () => {
            Do.setButtonHide();
        });

        let tmp = selected.split(' ')
        buttonBlockHide = tmp.indexOf('屏蔽用户') === -1 ? '' : 'none';
        buttonOpenHide = tmp.indexOf('新页面打开') === -1 ? '' : 'none';
        buttonFavHide = tmp.indexOf('收藏') === -1 ? '' : 'none';
    });

    setTimeout(() => {
        document.addEventListener('DOMContentLoaded', function () {
            onScrollFlag = true;
        });
        window.onscroll = () => {
            onScrollFlag = true;
        }
        updateFavoriteButton();
        updateFavoriteButton2();
        listenRootBlock();

        GM_.get(Const.BLOCK_FULL_LIST_STORE_LAST_UPDATE_DATE, '').then(lastDate => {
            Block.logStore();
            if (lastDate !== '') {
                let time_diff = new Date() - new Date(lastDate);
                time_diff = TimeConvert.toDays(time_diff);
                if (time_diff <= 1) {
                    return;
                }
            }
            // Block.addFromServer().then(() => Block.logStore());
        });
    }, 2000);
})();

function updateFavoriteButton() {
    onScrollFlag = true;
    setInterval(() => {
        if (onScrollFlag) {
            for (let [articleNode, config] of blockConfig) {
                function isInViewPortOfOne(el) {
                    let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

                    let screenTop = document.documentElement.scrollTop
                    let screenBottom = screenTop + viewPortHeight

                    let bounding = el.getBoundingClientRect();
                    let top = screenTop + bounding.top;
                    let bottom = bounding.bottom;

                    return screenTop <= top && top <= screenBottom
                }

                let isVisible = isInViewPortOfOne(articleNode)
                if (isVisible) {
                    needUpdateNodeList.push(articleNode);
                } else {
                    needUpdateNodeList = needUpdateNodeList.filter(item => item !== articleNode);
                }
            }
            onScrollFlag = false;
        }
    }, 100);
}

function updateFavoriteButton2() {
    setInterval(() => {
        let articleNode = needUpdateNodeList.pop();
        if (articleNode) {
            let res = updateFavoriteButton3(articleNode);
            if (!res) {
                needUpdateNodeList.push(articleNode);
            }
            let forwardNode = articleNode.querySelector(Selector.forwardNodeSelector);
            if (forwardNode != null) {
                updateFavoriteButton3(forwardNode);
            }
        }
    }, 100);
}

function updateFavoriteButton3(articleNode) {
    let blogID = BlogView.getBlogID(articleNode);

    let isLoading = BlogCache.get(blogID, Const.IS_LOADING);
    if (isLoading) {
        return false;
    }

    let buttonNode = articleNode.querySelector(`button[class*="${ClassName.buttonFavorite}"]`);

    if (blogCaches.has(blogID)) {

        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            let lastUpdate = BlogCache.get(blogID, Const.LAST_UPDATED);
            if (lastUpdate) {
                let time_diff = new Date() - new Date(lastUpdate);
                time_diff = TimeConvert.toHours(time_diff);

                // Greater than 1 hour
                if (time_diff > 1) {
                    Favorite.get(blogID).then(() => {
                        updateButtonText(blogID, buttonNode)
                    });
                } else {
                    updateButtonText(blogID, buttonNode);
                }
            } else {
                Favorite.get(blogID).then(() => {
                    updateButtonText(blogID, buttonNode)
                });
            }

        } else if (Domain.domain === Domain.WEIBO_S) {
            // s.weibo.com do not update status, due to lack of API support
            updateButtonText(blogID, buttonNode);
        }

    } else {
        Favorite.get(blogID).then(() => {
            updateButtonText(blogID, buttonNode)
        });
    }

    let likeButton = Locate.likeButton(articleNode)
    likeButton.parentElement.onclick = () => {
        likeButton.click();
    }

    return true;
}

function listenRootBlock() {
    setInterval(() => {
        let rootNode = document.querySelector(`div[class*="${Selector.rootNodeClass}"]`);
        if (rootNode == null) {
            return;
        }

        let isLoadEvent = rootNode.getAttribute('data_a656_is_load_event');
        if (isLoadEvent != null) {
            return;
        }

        rootNode.setAttribute('data_a656_is_load_event', true.toString());

        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {

            new MutationObserver((mutationsLi) => {
                for (let mutations of mutationsLi) {
                    if (mutations.type === 'childList') {
                        mutations.addedNodes.forEach(node => {
                            if (node.nodeName === '#text' || node.nodeName === '#comment') {
                                return;
                            }

                            let articleNode = Locate.articleNode(node, 'default');
                            if (articleNode == null) {
                                return;
                            }

                            if (blockConfig.get(articleNode) == null) {
                                blockConfig.set(articleNode, {});
                            }

                            placeButtons(articleNode);
                        })
                    }
                }
            }).observe(rootNode, {childList: true, subtree: true});
            onScrollFlag = true;

            let postList = rootNode.querySelectorAll(`div.vue-recycle-scroller__item-view`);
            console.log(postList);
            postList.forEach(articleNode => {
                if (!blockConfig.has(articleNode)) {
                    blockConfig.set(articleNode, {});
                }

                let blogID = BlogView.getBlogID(articleNode);
                Favorite.get(blogID);
                placeButtons(articleNode)
            });

        } else if (Domain.domain === Domain.WEIBO_S) {
            let postList = rootNode.querySelectorAll(`div[class="${Selector.postNodeFullClass}"]`);
            onScrollFlag = true;

            postList = Array.from(postList).filter(function (div) {
                return !div.querySelector('div.wb-ad-tile');
            });

            postList.forEach(articleNode => {
                if (!blockConfig.has(articleNode)) {
                    blockConfig.set(articleNode, {});
                }

                let blogID = BlogView.getBlogID(articleNode);

                let id = BlogView.getBlogIDNum(articleNode);
                BlogCache.set(blogID, Const.ID, id);

                Favorite.get(blogID);
                placeButtons(articleNode)
            });
        }
    }, 500);
}

function placeButtons(node) {
    if (node == null) {
        return;
    }
    console.log('node', node)
    if (node.getAttribute('data_a656_value1') === 'true') {
        return;

    }

    node.setAttribute('data_a656_value1', true.toString());
    let favoriteButtonNode = Button.createFavorite();
    let openButton = Button.createOpen();

    let blockButton = Button.createBlock();
    let targetNode = node.querySelector(Selector.buttonLocateSelector);

    if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
        targetNode.parentNode.insertBefore(favoriteButtonNode, targetNode);
        targetNode.parentNode.insertBefore(openButton, targetNode);
        if (Domain.domain === Domain.WEIBO) {
            targetNode.parentNode.insertBefore(blockButton, targetNode);
        }
    } else if (Domain.domain === Domain.WEIBO_S) {
        let wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.style.top = '-10px';
        wrap.style.right = '18px';
        wrap.style.width = '300px';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'row-reverse';

        wrap.appendChild(favoriteButtonNode);
        wrap.appendChild(openButton);
        // wrap.appendChild(blockButton);
        targetNode.appendChild(wrap);
    }

    let forwardNode = node.querySelector(Selector.forwardNodeSelector);
    if (forwardNode != null) {
        let favoriteButtonNode = Button.createFavorite('forward');
        let openButton = Button.createOpen('forward');
        let blockButton = Button.createBlock('forward');

        let targetNode = forwardNode.querySelector('a').parentNode;
        if (Domain.domain === Domain.WEIBO || Domain.domain === Domain.WEIBO_3W) {
            openButton.style.marginLeft = 'auto';
            favoriteButtonNode.style.marginRight = '26px';
            targetNode.appendChild(blockButton);
            targetNode.appendChild(openButton);
            targetNode.appendChild(favoriteButtonNode);
        }
    }
}

function updateButtonText(blogID, buttonNode) {
    if (BlogCache.get(blogID, Const.IS_FAVORITE)) {
        buttonNode.innerText = '取消收藏';
    } else {
        buttonNode.innerText = '收藏';
    }
}

function toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    let m = document.createElement('div');
    m.innerHTML = msg;

    m.style.setProperty('font-size', '20px', 'important');
    m.style.setProperty('color', 'rgb(255, 255, 255)', 'important');
    m.style.setProperty('background-color', 'rgba(0,0,0,0.6)', 'important');
    m.style.setProperty('border-style', 'solid', 'important');
    m.style.setProperty('border-color', '#ffffff', 'important');
    m.style.setProperty('z-index', '256', 'important');

    m.style.cssText = 'font-size: 20px; ' + 'color: rgb(255, 255, 255); ' + 'background-color: rgba(0,0,0,0.6); ' + 'border-style: solid; ' + 'border-color: #ffffff; ' + 'z-index: 256; ' + 'padding: 10px 15px; ' + 'margin: 0 0 0 -60px; ' + 'border-radius: 4px; ' + 'position: fixed; ' + 'top: 50%; ' + 'left: 50%; ' + 'width: 130px; ' + 'text-align: center;';

    document.body.appendChild(m);
    setTimeout(function () {
        let d = 0.5;
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}