// ==UserScript==
// @name         Bangumi User Hover Panel
// @name:zh-CN   Bangumi 用户悬浮面板
// @namespace    https://github.com/CryoVit/jioben/tree/master/bangumi/
// @version      0.6.5
// @description  fork of https://bgm.tv/dev/app/953. Display a hover panel when mouse hover on user link.
// @description:zh-CN  https://bgm.tv/dev/app/953 的修改版，鼠标悬浮在用户链接上方时出现悬浮框
// @author       cureDovahkiin + CryoVit
// @match        https://bangumi.tv/*
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465490/Bangumi%20User%20Hover%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/465490/Bangumi%20User%20Hover%20Panel.meta.js
// ==/UserScript==

(function () {
    /*
        2 = timeline
        4 = stats
        8 = sinkuro
        16 = anime
        32 = game
        64 = book
        128 = [reserved] for music
        256 = [reserved] for real
        the value is the sum of the entries to show,
        e.g. 28 = 4 + 8 + 16, means show stats, sinkuro and anime
    */
    if (localStorage.getItem('hover-panel-config') === null) { // default config
        localStorage.setItem('hover-panel-config', '28'); // 4 + 8 + 16
    }
    const entryStates = [
        ['在看', '看过', '想看', '搁置', '抛弃'],
        ['在玩', '玩过', '想玩', '搁置', '抛弃'],
        ['在读', '读过', '想读', '搁置', '抛弃']
    ];
    const cfgNames = ['时间线', '统计', '同步率', '动画', '游戏', '书籍'];
    const cfgTimeline = 2;
    const cfgStats = 4;
    const cfgSinkuro = 8;
    const cfgAnime = 16;
    let locker = false
    $('[href*="/user/"],#pm_sidebar a[onclick^="AddMSG"]').each(function () {
        let timer = null
        $(this).hover(function () {
            timer = setTimeout(() => {
                if (locker) return false
                if (this.text == "查看好友列表" || $(this).find('.avatarSize75').length > 0) return false
                locker = true
                const layout = document.createElement('div')
                let timer = null
                $(layout).addClass('user-hover')
                if ($(this).hasClass('avatar')) {
                    $(layout).addClass('fix-avatar-hover')
                }
                if (document.body.clientWidth - this.getBoundingClientRect().right < 430) {
                    $(layout).addClass('fix-right-hover')
                }
                layout.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
                const userData = {}
                if (this.onclick) {
                    userData.id = this.onclick.toString().split("'")[1]
                } else {
                    let urlSplit = /.*\/user\/([^\/]*)\/?(.*)/.exec(this.href)
                    if (urlSplit[2]) return
                    userData.id = urlSplit[1]
                }
                userData.href = '/user/' + userData.id
                const req = {
                    req1: null,
                    req2: null
                }
                Promise.all([
                    new Promise((r, j) => {
                        req.req1 = $.ajax({
                            url: userData.href,
                            dataType: 'text',
                            success: e => {
                                userData.self = /<a class="avatar" href="([^"]*)">/.exec(e)[1].split('/').pop()
                                if (userData.self != userData.id) {
                                    userData.sinkuro = /mall class="hot">\/([^<]*)<\/small>/.exec(e)[1]
                                    userData.sinkuroritsu = /<span class="percent" style="width:([^"]*)">/.exec(e)[1]
                                    userData.addFriend = /<a href="([^"']*)" id="connectFrd" class="chiiBtn">/.exec(e)
                                    userData.addFriend = userData.addFriend ? userData.addFriend[1] : false
                                }
                                userData.joinDate = /Bangumi<\/span> <span class="tip">([^<]*)<\/span>/.exec(e)[1]
                                // userData.lastEvent = /<small class="time">([^<]*)<\/small><\/li>/.exec(e)
                                userData.entry = [
                                    Array.from(e.match(/<a href="\/anime\/list[^>=]*>([0-9]{1,4}[^<]*)/g) || [], el => />([0-9]{1,5}.*)/.exec(el)[1]).map(el => el.split('部')),
                                    Array.from(e.match(/<a href="\/game\/list[^>=]*>([0-9]{1,4}[^<]*)/g) || [], el => />([0-9]{1,5}.*)/.exec(el)[1]).map(el => el.split('部')),
                                    Array.from(e.match(/<a href="\/book\/list[^>=]*>([0-9]{1,4}[^<]*)/g) || [], el => />([0-9]{1,5}.*)/.exec(el)[1]).map(el => el.split('本'))
                                ]
                                userData.stats = /<div class="gridStats">([\s\S]*)<\/div>/.exec(e)[1]
                                userData.stats = Array.from(userData.stats.match(/<div[^>]*>([\s\S]*?)<\/div>/g).slice(0, 6), el => /<div[^>]*>([\s\S]*?)<\/div>/.exec(el)[1])
                                userData.stats = userData.stats.map(el => Array.from(el.match(/<span[^>]*>([\s\S]*?)<\/span>/g), el => /<span[^>]*>([\s\S]*?)<\/span>/.exec(el)[1]))
                                userData.timeline = /<ul class="timeline">([\s\S]*?)<\/ul>/.exec(e)[1]
                                // console.log(userData)
                                r()
                            },
                            error: () => {
                                j()
                            }
                        })
                    }),
                    new Promise((r, j) => {
                        req.req2 = $.ajax({
                            url: 'https://api.bgm.tv/user/' + userData.id,
                            dataType: 'json',
                            success: e => {
                                userData.name = e.nickname
                                userData.avatar = e.avatar.large.replace(/https?/, 'https')
                                userData.sign = e.sign
                                userData.url = e.url
                                userData.message = `https://bgm.tv/pm/compose/${e.id}.chii`
                                r()
                            },
                            error: () => {
                                j()
                            }
                        })
                    })
                ]).then(() => {
                    layout.innerHTML = `
                        <img class='avater' src="${userData.avatar}"/>
                        <div class='user-info'>
                            <p class='user-name'><a href="${userData.href}" target="_blank">${userData.name}</a></p>
                            <p class='user-joindate'>${userData.joinDate}</p><span class='user-id'>@${userData.id}</span>
                            <p class='user-sign'>${userData.sign}</p>
                        </div>
                        ${
                        ((localStorage.getItem('hover-panel-config') & cfgSinkuro) && userData.sinkuro) ? `
                            <div class="shinkuro">
                            <div style="width:${userData.sinkuroritsu}" class="shinkuroritsu"></div>
                            <div class="shinkuro-text">
                                <span>${userData.sinkuro}</span> 
                                <span>同步率：${userData.sinkuroritsu}</span> 
                            </div>                                      
                            </div>
                            `: ''
                        }                
                        <div class='user-stats'>
                            ${(function () {
                                const cfg = localStorage.getItem('hover-panel-config')
                                let html = ''
                                let odd = true
                                for (let i = 0; i < 3; i++) {
                                    if (cfg & (cfgAnime << i)) {
                                        html += '<div class="stats-' + (odd ? 'odd' : 'even') + '">'
                                        let dt_j = 0
                                        for (let st_j = 0; st_j < 5; st_j++) {
                                            if (dt_j >= userData.entry[i].length || userData.entry[i][dt_j][1] != entryStates[i][st_j]) {
                                                html += `<span class="stats-zero">${entryStates[i][st_j]} <strong>0</strong></span>`
                                            } else {
                                                html += `<span>${entryStates[i][st_j]} <strong>${userData.entry[i][dt_j][0]}</strong></span>`
                                                dt_j++
                                            }
                                        }
                                        html += '</div>'
                                        odd = !odd
                                    }
                                }
                                if (cfg & cfgStats) {
                                    html += '<div class="stats-' + (odd ? 'odd' : 'even') + '">'
                                    for (let i = 0; i < 6; i++) {
                                        if (i == 2) {
                                            continue
                                        }
                                        if (userData.stats[i][0] == 0) { // '0.00' == 0
                                            html += `<span class="stats-zero">${userData.stats[i][1]} <strong>${userData.stats[i][0]}</strong></span>`
                                        } else {
                                            html += `<span>${userData.stats[i][1]} <strong>${userData.stats[i][0]}</strong></span>`
                                        }
                                    }
                                    html += '</div>'
                                    odd = !odd
                                }
                                return html
                            })()}
                        </div>
                        ${
                        (localStorage.getItem('hover-panel-config') & cfgTimeline) ? `
                            <ul class="timeline" id="panel-timeline">${userData.timeline}</ul>
                            `: ''
                        }
                        <!-- <span class='user-lastevent'>Last @ ${userData.lastEvent ? userData.lastEvent[1] : ''}</span> -->
                        <a class = 'hover-panel-btn' href="${userData.message}" target="_blank">发送短信</a>
                        <span id="panel-friend">
                        ${ userData.addFriend ? `
                                <a class='hover-panel-btn' href="${userData.addFriend}" id='PanelconnectFrd' href="javascript:void(0)">添加好友</a>                    
                            `: `
                        ${ userData.id == userData.self ? '' : `<span class = 'my-friend' >我的好友</span>`}
                            `}
                        </span>
                        `
                    
                    let cb = document.createElement('a')
                    cb.className = 'hover-panel-btn'
                    cb.id = 'cfg-btn'
                    cb.href = 'javascript:void(0)'
                    cb.onclick = function () {
                        let cfg = localStorage.getItem('hover-panel-config')
                        let sub = document.createElement('div')
                        sub.className = 'user-hover'
                        sub.id = 'hover-panel-sub'
                        sub.innerHTML = `
                            <fieldset>
                                <legend>设置显示项目</legend>
                                ${(function () {
                                    let html = ''
                                    for (let i = 0; i < 6; i++) {
                                        html += `<div class='hover-cfg-item'>
                                            <input type='checkbox' id='hover-cfg-${i}' ${cfg & (2 << i) ? 'checked' : ''}>
                                            <label for='hover-cfg-${i}'>${cfgNames[i]}</label>
                                        </div>`
                                    }
                                    return html
                                })()}
                                </div>
                            </fieldset>
                        `

                        let cancel = document.createElement('a')
                        cancel.className = 'hover-panel-btn'
                        cancel.id = 'cfg-cancel-btn'
                        cancel.href = 'javascript:void(0)'
                        cancel.innerText = '取消'
                        cancel.onclick = function () {
                            $('#hover-panel-sub').remove()
                        }
                        sub.appendChild(cancel)

                        let save = document.createElement('a')
                        save.className = 'hover-panel-btn'
                        save.id = 'cfg-save-btn'
                        save.href = 'javascript:void(0)'
                        save.innerText = '保存'
                        save.onclick = function () {
                            let cfg = 0
                            for (let i = 0; i < 6; i++) {
                                if (document.getElementById(`hover-cfg-${i}`).checked) {
                                    cfg |= (2 << i)
                                }
                            }
                            localStorage.setItem('hover-panel-config', cfg)
                            $('#hover-panel-sub').remove()
                        }
                        sub.appendChild(save)
                        document.body.appendChild(sub)
                    }
                    cb.innerText = '设置'
                    layout.appendChild(cb)

                    $(layout).addClass('dataready')
                    $('#PanelconnectFrd').click(function () {
                        $('#panel-friend').html(`<span class='my-friend'>正在添加</span>`)
                        $("#robot").fadeIn(500)
                        $("#robot_balloon").html(AJAXtip['wait'] + AJAXtip['addingFrd'])
                        $.ajax({
                            type: "GET",
                            url: this + '&ajax=1',
                            success: function (html) {
                                $('#PanelconnectFrd').hide()
                                $('#panel-friend').html(`<span class = 'my-friend' >我的好友</span>`)
                                $("#robot_balloon").html(AJAXtip['addFrd'])
                                $("#robot").animate({
                                    opacity: 1
                                }, 1000).fadeOut(500)
                                localStorage.removeItem('bgmFriends')
                            },
                            error: function (html) {
                                $("#robot_balloon").html(AJAXtip['error'])
                                $("#robot").animate({
                                    opacity: 1
                                }, 1000).fadeOut(500)
                                $('#panel-friend').html(`<span class='my-friend-fail'>添加失败</span>`)
                            }
                        })
                        return false
                    })
                }).catch(() => {
                    layout.innerHTML = `
                        <p style='font-size:16px; margin:25px 30px'>
                        <img style="height:15px;width:16px" src='/img/smiles/tv/15.gif'/><br/>
                        请求失败，请稍后再试。<br/><br/>或者使用<a href='https://bgm.tv'>bgm.tv</a>域名，</p>`
                    $(layout).addClass('dataready')
                })
                function removeLayout () {
                    setTimeout(() => {
                        $(layout).remove()
                        locker = false
                        req.req1.abort()
                        req.req2.abort()
                    }, 200);
                }
                $(this).after(layout).mouseout(function () {
                    timer = setTimeout(() => {
                        removeLayout()
                    }, 500);
                })
                $(layout).hover(function () {
                    clearTimeout(timer)
                }, function () {
                    removeLayout()
                })
                return false
            }, 500)
        },
            function () {
                clearTimeout(timer)
            }
        )
    })

    // prevent user link at (1) page header (2) footer dock (3) reply form (4) timeline
    // from triggering hover panel
    $("#headerNeue2, #dock, #reply_wrapper, .tml_item").find("a[href*='/user/']").unbind();

    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
        :root {
            --bg-color: #fff;
            --text-color: #010101;
            --bg-pink: #fce9e9;
            --bg-sky: #c2e1fc;
            --box-shadow: #ddd;
            --text-gray: #6e6e6e;
            --bg-filter: blur(10px) contrast(90%);
        }
        [data-theme='dark'] {
            --bg-color: #2d2e2f;
            --text-color: #f7f7f7;
            --bg-pink: #3c3c3c;
            --bg-sky: #3c3c3c;
            --box-shadow: #6e6e6e;
            --text-gray: #aaa;
            --bg-filter: blur(10px) contrast(50%);
        }
        .user-hover {
            position: absolute;
            width: 430px;
            /* background: var(--bg-color); */
            box-shadow: 0px 0px 4px 1px var(--box-shadow);
            transition: all .2s ease-in;
            transform: translate(0,6 px);
            font-size: 12px;
            z-index:999;
            color: var(--text-color);
            line-height: 130%;
            border-radius: 15px;
            -webkit-border-radius: 15px;
            backdrop-filter: var(--bg-filter);
            -webkit-backdrop-filter: var(--bg-filter);
        }
        .fix-avatar-hover {
            transform: translate(55px, 20px)
        }
        .fix-right-hover {
            transform: translate(-430px, 6px)
        }
        .fix-avatar-hover.fix-right-hover {
            transform: translate(-485px, 20px)
        }

        /* basic info */
        div.dataready {
            padding: 8px;
            font-weight: normal;
            text-align: left;
        }
        /* span.user-lastevent {
            margin-top: 3px;
            display: inline-block;
            vertical-align: top;
            color: var(--text-gray);
        } */
        div.dataready img {
            height: 75px;
            width:75px;
            border-radius: 5px;
        }
        .user-info {
            display: inline-block;
            vertical-align: top;
            max-width: 250px;
            margin: 0 0 10px 10px;
        }
        .user-info .user-name {
            font-size: 20px;
            font-weight: bold;
        }
        .user-info .user-joindate {
            background-color: #f09199;
            display: inline-block;
            color: #f7f7f7;
            border-radius: 10px;
            padding: 0 10px;
            margin: 8px 4px 3px 0;
        }
        .user-info .user-id{
            font-size: 12px;
            font-weight:normal;
            color: var(--text-gray);
        }
        .user-info .user-sign {
            word-break: break-all;
            margin-top: 3px;
            color: var(--text-gray);
        }

        /* stats */
        .user-stats {
            padding: 10px 0px 5px;
            margin-bottom: 0;
        }
        .user-stats span {
            display: inline-block;
            padding: 4px;
            width: 19%;
            box-sizing: border-box;
            border-left: 4px solid #f09199;
            background-color: var(--bg-pink);
            color: var(--text-color);
            margin: 0 1% 1% 0;
        }
        .stats-even span {
            border-left: 4px solid #369cf8;
            background-color: var(--bg-sky);
        }
        .stats-zero {
            opacity: 0.5;
        }

        /* shinkuro */
        .shinkuro {
            width: 100%;
            height: 20px;
            background-color: var(--bg-sky);
            line-height: 20px;
            border-radius: 10px;
            margin-top: 5px;
        }
        .shinkuro-text {
            position: absolute;
            width: 100%;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .shinkuro-text span {
            color: var(--text-color);
        }
        .shinkuroritsu {
            height: 20px;
            float: left;
            border-radius: 10px;
            background: #369cf8;
        }
        .shinkuro-text span:nth-of-type(1) {
            margin-left: 10px;
        }
        .shinkuro-text span:nth-of-type(2) {
            margin-right: 26px;
        }

        /* timeline */
        #panel-timeline li {
            margin-top: 0;
        }
        #panel-timeline a {
            display: inline !important;
        }
        #panel-timeline .time {
            color: var(--text-gray);
        }

        /* buttons */
        a.hover-panel-btn, span.my-friend, span.my-friend-fail {
            display: inline-block;
            float: right;
            color: white;
            padding: 1px 8px;
            border-radius: 10px;
            margin: 8px 0 0 10px;
            transition: all .2s ease-in;
        }
        a.hover-panel-btn {
            background: #f09199;
            transition: all .2s ease-in;
        }
        span.my-friend {
            background: #6eb76e;
        }
        span.my-friend-fail {
            background: red;
        }
        #cfg-btn {
            background: #369cf8;
            float: left;
            margin-left: 0;
        }

        /* animation */
        .lds-roller {
            display: inline-block;
            position: relative;
            width: 64px;
            height: 64px;
            margin:10px 20px
        }
        .lds-roller div {
            animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            transform-origin: 32px 32px;
        }
        .lds-roller div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #f09199;
            margin: -3px 0 0 -3px;
        }
        .lds-roller div:nth-child(1) {
            animation-delay: -0.036s;
        }
        .lds-roller div:nth-child(1):after {
            top: 50px;
            left: 50px;
        }
        .lds-roller div:nth-child(2) {
            animation-delay: -0.072s;
        }
        .lds-roller div:nth-child(2):after {
            top: 54px;
            left: 45px;
        }
        .lds-roller div:nth-child(3) {
            animation-delay: -0.108s;
        }
        .lds-roller div:nth-child(3):after {
            top: 57px;
            left: 39px;
        }
        .lds-roller div:nth-child(4) {
            animation-delay: -0.144s;
        }
        .lds-roller div:nth-child(4):after {
            top: 58px;
            left: 32px;
        }
        .lds-roller div:nth-child(5) {
            animation-delay: -0.18s;
        }
        .lds-roller div:nth-child(5):after {
            top: 57px;
            left: 25px;
        }
        .lds-roller div:nth-child(6) {
            animation-delay: -0.216s;
        }
        .lds-roller div:nth-child(6):after {
            top: 54px;
            left: 19px;
        }
        .lds-roller div:nth-child(7) {
            animation-delay: -0.252s;
        }
        .lds-roller div:nth-child(7):after {
            top: 50px;
            left: 14px;
        }
        .lds-roller div:nth-child(8) {
            animation-delay: -0.288s;
        }
        .lds-roller div:nth-child(8):after {
            top: 45px;
            left: 10px;
        }
        @keyframes lds-roller {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        #comment_list div.sub_reply_collapse {
            opacity: 1;
        }

        /* config panel */
        #hover-panel-sub {
            width: 150px;
            height: 160px;
            padding: 5px;
            line-height: 1.5;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        }
        #hover-panel-sub legend {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
        }
        #hover-panel-sub fieldset {
            padding: 0 5px;
        }
        #hover-panel-sub .hover-panel-btn {
            display: inline-block;
            text-align: center;
        }
        #cfg-cancel-btn {
            position: absolute;
            left: 14px;
            bottom: 6px;
            background: #f09199;
        }
        #cfg-save-btn {
            position: absolute;
            right: 24px;
            bottom: 6px;
            background: #6eb76e;
        }
    `
    heads[0].append(style)
})();