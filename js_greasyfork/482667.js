// ==UserScript==
// @name         FF14石之家美化
// @description  美化，一键盖章
// @namespace    none
// @version      0.0.4
// @author       gogofishman
// @license      MIT
// @match        *://*.ff14risingstones.web.sdo.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482667/FF14%E7%9F%B3%E4%B9%8B%E5%AE%B6%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482667/FF14%E7%9F%B3%E4%B9%8B%E5%AE%B6%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

'use strict'

GM_addStyle(`/*头部和背景*/
.head_sub_line {
    background-color: #1f1f1f !important;
    margin-bottom: 30px !important;

    & .el-menu {
        background-color: #1f1f1f !important;
    }
}

#app.overflow {
    padding: 0;
}

.headerCls {
    background-color: #3f3e3e !important;

    & .hit100 {
        filter: invert(1);
    }

    & .head_line {
        display: none !important;
    }
}

.headerCls + div {
    background-image: url('https://p.sda1.dev/14/ab5d5f5a6351d6a35ca8fffaca8e581b/1.webp');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
}

/*body{*/
/*    background-image: url('https://p.sda1.dev/14/ab5d5f5a6351d6a35ca8fffaca8e581b/1.webp');*/
/*    background-attachment: fixed;*/
/*    background-repeat: no-repeat;*/
/*    background-size: cover;*/
/*}*/

.main-layout {
    width: 1250px !important;
}


/*帖子区域*/
.tiebox {
    border-radius: 4px;
    overflow: hidden;

    & li {
        margin: 0 !important;
        border-bottom: 1px solid #434343;
        color: white;

        &:hover .post-main {
            background-color: rgba(60, 60, 60, .8) !important;
        }

        & .post-main {
            transition: background-color .2s;
            background-color: rgba(11, 11, 11, .8) !important;

            & .comment-num {
                margin-left: 45px !important;
            }

            & .tag {
                width: 146px !important;
                padding-left: 66px !important;
            }
        }

        & .comment-num {
            background-color: #ffffff38 !important;

            & span {
                color: #aaa !important;
            }
        }
    }

    & .tieCont {
        margin: 0 !important;
    }

    & .info_area {
        color: #aaa;

        & .name {
            color: #ffffff;
            padding: 0;
        }

        & .a_box {
            flex-direction: row-reverse;
        }
    }

    & .el-col-3 {
        max-width: 15% !important;
        flex: 0 0 15% !important;
    }

    & .el-col-13 {
        max-width: 60% !important;
        flex: 0 0 60% !important;
    }

    & .el-col-8 {
        max-width: 25% !important;
        flex: 0 0 25% !important;
    }
}

.mt3 {
    margin-top: 20px !important;
}

.el-tabs__item {
    color: #a5a8ae !important;
}

.mb10 {
    margin: 0 !important;;
}

.bdr10 {
    border-radius: 0 !important;
}

.post-main {
    border-radius: 0 !important;
}

/*右侧区域*/
.el-card {
    border: 0 !important;
    background-color: rgba(11, 11, 11, .8) !important;
    color: rgb(225, 225, 225) !important;

    & .el-divider--horizontal {
        border-top: 1px #4d4d4d var(--el-border-style);
    }
}


/*最前端*/
.el-image-viewer__mask {
    opacity: .8 !important;
}

.el-image-viewer__canvas img {
    transform: scale(0.8) !important;
}

._stamp_{
    position: absolute;
    top: 147px;
    right: 17px;
    background-color: rgba(11, 11, 11, .8);
    color: #c4a86a;
    font-size: 20px;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 4px;

    transition: all .2s;

    &:hover{
        color: white;
        cursor: pointer;
        background-color: rgba(60, 60, 60, .8)
    }

    &:active{
        background-color: rgba(11, 11, 11, .8);
    }
}

._stamp_no{
    position: absolute;
    top: 147px;
    right: 17px;
    background-color: rgba(11, 11, 11, .8);
    color: #c4a86a;
    font-size: 20px;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 4px;
}
`);

window.onload = () => {
    if (window.location.href !== 'https://ff14risingstones.web.sdo.com/pc/index.html#/post') return

    //检查是否需要盖章
    let needStamp = true
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://apiff14risingstones.web.sdo.com/api/home/active/online2312/myTaskInfo',
        headers: {
            'Origin': 'https://ff14risingstones.web.sdo.com',
            'Referer': 'https://ff14risingstones.web.sdo.com/'
        },
        onload: function (response) {
            let re = JSON.parse(response.response)
            if (re.data.onceTask.seal_total === 3) {
                needStamp = false
            }

            // 一键盖章
            let div = document.createElement('div')
            if (needStamp) {
                div.innerHTML = '一键盖章'
                div.classList.add('_stamp_')
                div.onclick = async () => {
                    //点赞5次
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://apiff14risingstones.web.sdo.com/api/home/posts/postsCommentDetail?id=19038&order=latest&page=1&limit=10',
                        headers: {
                            'Origin': 'https://ff14risingstones.web.sdo.com',
                            'Referer': 'https://ff14risingstones.web.sdo.com/'
                        },
                        onload: function (response) {
                            let idList = []
                            let re = JSON.parse(response.response)
                            re.data.rows.forEach(e => {
                                idList.push(e.id)
                            })

                            for (let i = 0; i < 5; i++) {
                                let formData = new FormData()
                                formData.append('id', idList[i].toString())
                                formData.append('type', '2')

                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: 'https://apiff14risingstones.web.sdo.com/api/home/posts/like',
                                    headers: {
                                        'Origin': 'https://ff14risingstones.web.sdo.com',
                                        'Referer': 'https://ff14risingstones.web.sdo.com/'
                                    },
                                    data: formData,
                                    onload: function (response) {
                                        console.log(response)
                                    },
                                })
                            }
                        },
                    })

                    await sleep(3000)

                    //评论一次
                    let formData = new FormData()
                    formData.append('content', '<p><span class="at-emo">[emo18]</span>&nbsp;</p>')
                    formData.append('posts_id', '9365')
                    formData.append('parent_id', '0')
                    formData.append('root_parent', '0')
                    formData.append('comment_pic', '')

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://apiff14risingstones.web.sdo.com/api/home/posts/comment',
                        headers: {
                            'Origin': 'https://ff14risingstones.web.sdo.com',
                            'Referer': 'https://ff14risingstones.web.sdo.com/'
                        },
                        data: formData,
                        onload: function (response) {
                            console.log(response)
                        },
                    })

                    await sleep(3000)

                    //盖章
                    for (let i = 1; i < 4; i++) {
                        formData = new FormData()
                        formData.append('type', i.toString())
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://apiff14risingstones.web.sdo.com/api/home/active/online2312/doSeal',
                            headers: {
                                'Origin': 'https://ff14risingstones.web.sdo.com',
                                'Referer': 'https://ff14risingstones.web.sdo.com/'
                            },
                            data: formData,
                            onload: function (response) {
                                console.log(response)
                            },
                        })
                    }

                    //
                    div.innerHTML = '今日已盖章'
                    div.classList.remove('_stamp_')
                    div.classList.add('_stamp_no')
                }
            } else {
                div.innerHTML = '今日已盖章'
                div.classList.add('_stamp_no')
            }
            document.body.append(div)
        },
    })

    // 自动签到
    WaitUntilAction(() => document.querySelector('button[class="el-button text-center signin"]')
        , (e) => {
            if (e.getAttribute('aria-disabled') === 'true') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://apiff14risingstones.web.sdo.com/api/home/sign/signIn',
                    headers: {
                        'Origin': 'https://ff14risingstones.web.sdo.com',
                        'Referer': 'https://ff14risingstones.web.sdo.com/'
                    },
                    onload: function (response) {
                        let re = JSON.parse(response.response)
                        console.log(re.msg)
                    },
                })
            }
        })
}

function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 异步执行当某个元素出现时立马某个动作
 * @param {function} element 返回指定元素的函数
 * @param {function} action 执行动作,参数为element得到的元素,默认remove
 * @param {number} num action执行次数，默认1次，-1为不限定次数直到超时才停止
 * @param {number} step 每次检查间隔时间 ms
 * @param {number} timeOut 超时时间 ms
 * @returns {Promise<void>}
 * @constructor
 */
async function WaitUntilAction (element, action = () => {},
    num = 1, step = 50, timeOut = 1000 * 10) {
    let count = 0
    let _num = 0
    let outCount = timeOut / step

    try {
        while (count <= outCount) {
            count++
            await sleep(step)

            let _c = element()
            if (_c) {
                //执行动作
                action(_c)
                if (_num < num) {
                    break
                }
                _num++
            }

        }
    } catch (e) {
        console.log('WaitUntilAction错误：', e)
    }
}