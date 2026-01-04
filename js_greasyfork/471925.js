// ==UserScript==
// @name         你果然关注了这些人（微博特征用户关注检测）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  新浪微博，查看用户关注「典型」用户的数量。一个常见的应用场景就是看ta关注了哪些你会拉黑的人。
// @author       evalcony
// @homepageURL  https://github.com/evalcony/weibo_feature_user_maching
// @match        https://weibo.com/*
// @match        https://m.weibo.cn/*
// @icon         data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/471925/%E4%BD%A0%E6%9E%9C%E7%84%B6%E5%85%B3%E6%B3%A8%E4%BA%86%E8%BF%99%E4%BA%9B%E4%BA%BA%EF%BC%88%E5%BE%AE%E5%8D%9A%E7%89%B9%E5%BE%81%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E6%A3%80%E6%B5%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471925/%E4%BD%A0%E6%9E%9C%E7%84%B6%E5%85%B3%E6%B3%A8%E4%BA%86%E8%BF%99%E4%BA%9B%E4%BA%BA%EF%BC%88%E5%BE%AE%E5%8D%9A%E7%89%B9%E5%BE%81%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E6%A3%80%E6%B5%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 这里填写要匹配的用户名，以英文逗号分隔
    // 例如 'aaa','bbb','ccc'
    const target_user_list = [
        ''
    ]

    // ----------------------------------------------------------------------------------------

    const MY_COOKIE = document.cookie

    // 用户关注列表是否被禁止查看
    let focus_list_forbid = false

    // 已经搜索过的用户缓存数据
    let searched_user_cach = []
    // 用户关注的 target_user_list 命中数
    let searched_user_target_match_num_cache = []
    // 用户关注的具体 target_user
    let searched_user_target_match_user_cache = new Map();

    // 最大查询分页数 <= 11 (11是微博设置的查看上限)
    let max_page = 5
    // 命中数
    const buf = new ArrayBuffer(4);
    const total_match_num = new Int32Array(buf);

    // 命中的 user_list
    let match_user_list = []

    let showFlag = 0

    new MutationObserver((mutations) => {
        let mutation = mutations[0]

        showFlag += 1

        if (showFlag % 2 == 0) {
            // 移除
            document.querySelector('#my_div').remove()
            document.querySelector('#my_focus_user_div').remove()
            return
        }

        let popCard = mutation.target
        let nameCard = popCard.childNodes[0].childNodes[0].childNodes[2].childNodes[1]
        let hrefCard = popCard.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1]
        let username = nameCard.innerText
        let href = hrefCard.href
        // 获得uid
        let uid = getUserId(href)
        // console.log(href)
        console.log(username)

        search(uid, username)
        // 渲染
        flushEle(popCard, username)

    }).observe(document.querySelector('.popcard'), {
        //childList: true,
        attributes: true,
        //subtree: true,
    });

    // console.log(Atomics.load(total_match_num, 0))


function flushEle(popCard, name) {
    let div = makeFocusDiv(name)
    popCard.appendChild(div)

    let div_user_list = makeFocusUserListDiv(name)
    popCard.appendChild(div_user_list)
}

function getUserId(href) {
    // https://weibo.com/u/page/follow/123123123?relate=fans
    let l = href.indexOf('follow/')
    let r = href.indexOf('?')
    let text = href.substring(l+'follow/'.length, r)
    return text
}

function makeFocusDiv(name) {

    // 获取缓存的命中user数量
    let cachedPos = cached(name)
    console.log(searched_user_cach)
    console.log(searched_user_target_match_num_cache)
    let num = 0
    if (cachedPos != -1) {
        num = searched_user_target_match_num_cache[cachedPos]
    } else {
        num = '正在请求数据...请稍后'
    }

    let div = document.createElement('div');
    div.id = 'my_div'
    if (focus_list_forbid) {
        div.textContent = '只有粉丝才能查看关注列表'
    } else {
        div.textContent = num
    }
    return div
}

function makeFocusUserListDiv(name) {
    let div = document.createElement('div');
    div.id = 'my_focus_user_div'

    let user_list = ''
    let cachedPos = cached(name)
    if (cachedPos != -1) {
        let u_list = searched_user_target_match_user_cache.get(name)
        if (u_list.length > 0) {

            u_list.forEach(item => {
                const p = document.createElement('p');
                p.textContent = item;
                div.appendChild(p); 
            });
        }
    } else {

    }
    // div.textContent = user_list
    return div
}

// 查询用户关注列表
async function search(uid, name) {
    if (cached(name) != -1) {
        // do cached job

        return
    }

    focus_list_forbid = false

    // 初始化
    match_user_list = []

    // 遍历关注列表
    Atomics.store(total_match_num, 0, 0); // 原子写入
    for (var i = 1; i <= max_page; i++) {
        await async_fetch(uid, i)
    }
    console.log("查询结果：" + name + "_" + Atomics.load(total_match_num, 0))

    if (focus_list_forbid) {
        searched_user_cach.push(name)
        searched_user_target_match_num_cache.push('只有粉丝才能查看关注列表')
        searched_user_target_match_user_cache.set(name, [])
    } else {
        searched_user_cach.push(name)
        searched_user_target_match_num_cache.push('命中特征用户数量：' + Atomics.load(total_match_num, 0))
        searched_user_target_match_user_cache.set(name, match_user_list)
    }
}

// 查找缓存数组的下标
function cached(name) {
    for (var i in searched_user_cach) {
        if (name == searched_user_cach[i]) {
            return i
        }
    }
    return -1
}

// 同步请求数据
async function async_fetch(uid, page_num) {

    if (focus_list_forbid) {
        return
    }

    var myHeaders = new Headers();
    myHeaders.append('Cookie', MY_COOKIE); // 设置Cookie
    myHeaders.append("Referer", "https://m.weibo.cn/");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Origin", "https://weibo.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");
    myHeaders.append("Client-Version", "v2.40.83");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    var url = 'https://weibo.com/ajax/friendships/friends?page=${page_num}&uid=${uid}'
    url = url.replace('${page_num}', page_num).replace('${uid}', uid);

    await fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => fetchPromise(result))
        .catch(error => console.log('error', error));
}

async function fetchPromise(result) {
    var r = result.indexOf('博主设置仅针对粉丝展示全部关注')
    if (r != -1) {
        console.log('博主设置仅针对粉丝展示全部关注')
        focus_list_forbid = true
        return
    }
    friendsDataSolver(result)
}


// 数据解析
function friendsDataSolver(result) {
    console.log('网络请求')
    const parsedData = JSON.parse(result);
    // 设置最大页数
    let total_number = parsedData.total_number
    var total_page_size = parseInt(total_number/20)
    if (total_page_size < 11) {
        max_page = total_page_size
    }

    var users = parsedData.users
    for (var i in users) {
        const u = users[i]
        let f = isInTargetUserList(u.screen_name)
        //console.log(f + ' ' + u.screen_name)
        if (f) {
            console.log(f + ' ' + u.screen_name)
            Atomics.add(total_match_num, 0, 1)
            match_user_list.push(u.screen_name)
        }
    }
}
// 是否命中
function isInTargetUserList(name) {
    for (var i in target_user_list) {
        if (name == target_user_list[i]) {
            return true
        }
    }
    return false
}

})();