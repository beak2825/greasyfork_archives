// ==UserScript==
// @name         yaohuo
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Polygon
// @match        https://yaohuo.me/bbs*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429473/yaohuo.user.js
// @updateURL https://update.greasyfork.org/scripts/429473/yaohuo.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function makeBtn(div) {
        if (div.querySelector('#floor')) { return }
        let floor = div.innerHTML.match(/\[(.+?)\]/)[1]
        div.innerHTML = '[' + `<a id="floor">${floor}</a>` + div.innerHTML.match(/\[.+?(\].+)/)[1]
        div.querySelector('#floor').onclick = () => {
            console.log(div.querySelector('a[href^="/bbs/userinfo"]'))
            viewUserInfo.call(
                div.querySelector('a[href^="/bbs/userinfo"]'),
                {
                    fromElement: {
                        className: div.className
                    }
                }
            )
        }
    }

    let addStyle = (document, iframeDocument) => {
        if (document.body.querySelector('#user-info-box-style') && iframeDocument.body.querySelector('#user-info-box-style')) { return }
        let style = `
        body {
            box-shadow: none;
        }
        #user-info-box {
            position: absolute;
            display: flex;
            height: 160px;
            background-color: #e5f3ee;
            border-radius: 20px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 12px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.23);
            transition: width 0.3s linear;
        }
        #user-info-box .userTop {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
        }
        #user-info-box .userTop img {
            width: 130px;
            height: 130px;
            border-radius: 75px;
        }
        #user-info-box .userTop #info {
            display: flex;
            margin-left: 20px;
            line-height: 1.5em;
            font-size: 18px;
            flex-direction: column;
        }
        #user-info-box .userBottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 100%;
            font-size: 20px;
        }
        #user-info-box .userBottom img {
            line-height: 1em;
            width: 20px;
            height: 20px;
        }
        `
        if (document) {
            let styleEle = document.createElement('style')
            styleEle.innerHTML = style
            styleEle.setAttribute('id', 'user-info-box-style')
            document.body.append(styleEle)
        }
        if (iframeDocument) {
            let styleEle = iframeDocument.createElement('style')
            styleEle.innerHTML = style
            styleEle.setAttribute('id', 'user-info-box-style')
            iframeDocument.body.append(styleEle)
        }
    }
    // 生成详细信息 a[href^="bbs/userinfo"]
    let viewUserInfo = function (e) {
        this.parentNode.style.position = 'relative'
        let height
        if (e.fromElement.className == "subtitle") {
            height = this.parentNode.scrollHeight
        } else {
            height = 45
        }
        let userBox = $(`
        <div id="user-info-box" style="bottom: ${height}px">
            <span id="loading">${'正在加载' + this.textContent + '的信息...'}</span>
            <div class="userTop"></div>
            <div class="userBottom"></div>
        </div>
        `)
        $(this.parentNode).append(userBox)
        // 获取数据
        let userURL = location.protocol + '//' + location.host + this.getAttribute('href')
        fetch(userURL, { credentials: 'include' })
            .then(e => e.text())
            .then(html => {
                let hideDiv = document.createElement('div')
                hideDiv.innerHTML = html
                hideDiv.style.display = 'none'
                // 头像
                userBox.find('.userTop').append($(hideDiv).find('.content img')[0])
                // 信息
                let infoStr = $(hideDiv).find('.content')[0].innerText
                console.log(infoStr)
                let userID = /ID号:(\d+)昵称/g.exec(infoStr)[1]
                let userName = /昵称:(.+?)妖晶/g.exec(infoStr)[1]
                let money = /妖晶:(\d+)/g.exec(infoStr)[1]
                let level = /等级:(\d+级) 头衔:.+勋章/g.exec(infoStr)[1]
                let levelInfo = /等级:\d+级 头衔:(.+)勋章/g.exec(infoStr)[1]
                userBox.find('.userTop').append($(`
                            <div id="info">
                                <span>用户: ${userID}</span>
                                <span>昵称: ${userName}</span>
                                <span>妖晶: ${money}</span>
                                <span>等级: ${level}</span>
                                <span>头衔: ${levelInfo}</span>
                            </div>
                            `))
                let medals = /勋章<\/b>:(<img src=".+" alt=".">)*/g.exec($(hideDiv).find('.content')[0].innerHTML)[1]
                if (medals) {
                    userBox.find('.userBottom').html(medals)
                } else {
                    userBox.find('.userBottom').html('这个人很穷，没有勋章')
                }
                // 加载完毕
                userBox.find('#loading').remove()
                userBox.css('justify-content', 'space-between')
                userBox.click(function () {
                    delUserInfo.call(this, null)
                })
            })
    }

    let delUserInfo = function (e) {
        this.parentNode.style.position = 'inherit'
        this.parentNode.querySelector('#user-info-box') && this.parentNode.removeChild(this.parentNode.querySelector('#user-info-box'))
    }

    // 显示全评论
    let nextPageURL = null
    let nextPageButton = document.querySelector('.more a')
    if (nextPageButton) {
        nextPageURL = nextPageButton.getAttribute('href')
    } else {
        addStyle(document)
        if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
            makeBtn(document.querySelectorAll('.subtitle')[1])
        } else {
            $('a[href^="/bbs/userinfo"]').unbind('mouseenter').unbind('mouseleave').hover(viewUserInfo, delUserInfo)
        }
        return
    }
    let haveMore = parseInt(nextPageURL.match(/Total=(\d+)/g)[0].split('=')[1]) > 15

    // 获取更多评论地址
    let commentURL = location.protocol + '//' + location.host + nextPageURL.replace('page=2', 'page=1')
    // 移除简短评论url 第一个是正文，第二个是评论
    let commentDiv = document.querySelectorAll('.content')[1]
    commentDiv.innerHTML = ""
    let iframe = document.createElement('iframe')
    iframe.id = 'full-comment'
    iframe.src = commentURL
    iframe.width = '100%'
    iframe.setAttribute('frameborder', 'no')
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute('border', '0')
    iframe.style = `
        transition: height 0.3s linear;
    `
    iframe.onload = function () {
        let iframeDocument = document.getElementById('full-comment').contentWindow.document
        let frameBody = iframeDocument.body // frameBody.querySelector('.tip')
        if (frameBody.querySelector('.tip') && !frameBody.querySelector('input')) {
            document.getElementById('full-comment').contentWindow.history.back()
            location.reload()
        } else {
            let refresh = (mutations, observer) => {
                let removeEles = ['a[href^="/bbs/message"] + .btBox',
                    'a[href^="/bbs/message"]',
                    '.showpage + .btBox',
                    '.subtitle'].concat((haveMore) ? [] : '.btBox')
                for (let i = 0; i < removeEles.length; i++) {
                    let node = frameBody.querySelector(removeEles[i])
                    if (node) {
                        node.parentNode.removeChild(node)
                    }
                }
                if (iframeDocument.querySelector('.showpage')) {
                    iframeDocument.querySelector('.showpage').style['background-color'] = 'white'
                }
                if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
                    // 把x楼换成可点击
                    makeBtn(document.querySelectorAll('.subtitle')[1])
                    iframeDocument.querySelectorAll('[class^="line"]').forEach(makeBtn)
                } else {
                    // hover效果实现
                    // 楼主信息
                    $('a[href^="/bbs/userinfo"]').unbind('mouseenter').unbind('mouseleave').hover(viewUserInfo, delUserInfo)
                    // 评论区用户信息
                    iframeDocument.querySelectorAll('a[href^="/bbs/userinfo"]').forEach(
                        (userTag) => {
                            $(userTag).unbind('mouseenter').unbind('mouseleave').hover(viewUserInfo, delUserInfo)
                        }
                    )
                }
                console.log('调整高度')
                setTimeout(() => {
                    iframe.height = iframeDocument.body.scrollHeight
                }, 500)
            }
            addStyle(document, iframeDocument)
            // 观察
            var config = { attribute: true, childList: true, subtree: true }
            var observer = new MutationObserver(refresh)
            observer.observe(frameBody, config)
            refresh()
        }
    }
    commentDiv.appendChild(iframe)
})();
