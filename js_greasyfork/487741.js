// ==UserScript==
// @name         妖狐吧ios移动端适配
// @namespace    https://smlsy.com/
// @version      0.0.24
// @description  妖狐吧ios移动端适配，增加使用体验
// @author       生机勃勃的勃勃
// @match        https://smlsy.com/*
// @match        https://www.smlsy.com/*
// @match        https://yaohubaba.com/*
// @icon         https://smlsy.com/images/logo/fox.png
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487741/%E5%A6%96%E7%8B%90%E5%90%A7ios%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/487741/%E5%A6%96%E7%8B%90%E5%90%A7ios%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let ENV = window.location.href.includes('dev=1') ? 'dev' : 'production'
    if (ENV === 'dev') {
        await erudaInit()
    }

    function erudaInit () {
        return new Promise((resolve, reject) => {
            var head = document.getElementsByTagName('head')[0]
            var script = document.createElement('script')
            script.setAttribute('type', 'text/javascript')
            script.setAttribute('src', '//cdn.jsdelivr.net/npm/eruda')
            head.appendChild(script)
            script.onload = function () {
                eruda.init()
                resolve()
            }
        })
    }

    let isLogin = false
    const loginEnterBtn = document.querySelector('.personal-center .login')
    if (loginEnterBtn) {
        isLogin = true
        loginEnterBtn.addEventListener('click', () => {
            // 自动回填上次登录账号信息 （本地化存储）
            const loginFormInfo = JSON.parse(localStorage.getItem('loginFormInfo')) || {}
            setTimeout(() => {
                const loginForm = document.querySelector('#popupLoginForm')
                if (loginForm) {
                    const username = loginForm.querySelector('#popupLoginForm input[name=username]')
                    const password = loginForm.querySelector('#popupLoginForm input[name=password]')
                    username && (username.value = loginFormInfo.username || '')
                    password && (password.value = loginFormInfo.password || '')
                    const poploginBtn = loginForm.querySelector('button.poplogin')
                    poploginBtn.addEventListener('click', () => {
                        const info = { username: username?.value, password: password?.value }
                        localStorage.setItem('loginFormInfo', JSON.stringify(info))
                    })
                }
            }, 100);
        })
    }

    function setCookie(name, value, expires) {
        var d = new Date();
        d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000));
        var expiresDate = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expiresDate + ";path=/";
    }

    function getCookie(name) {
        var cookieName = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

    function getAllCookies() {
        var cookies = document.cookie.split(';');
        var cookieArray = [];

        cookies.forEach(function(cookie) {
            var cookiePair = cookie.trim().split('=');
            var cookieObject = {
                name: cookiePair[0],
                value: cookiePair[1]
            };
            cookieArray.push(cookieObject);
        });

        return cookieArray;
    }

    var token_key = 'PHPSESSID'
    var token_value = getCookie(token_key)

    // 延长登录校验时间 - 30天内不需要重复登录 - 不知道对不对
    const aws = JSON.parse(localStorage.getItem('aws_waf_token_challenge_attempts'))
    if (aws) {
        aws.lastAttemptTimestamp = +new Date() + (3600000 * 24 *30)
        localStorage.setItem('aws_waf_token_challenge_attempts', JSON.stringify(aws))
    }
    localStorage.setItem('awswaf_token_refresh_timestamp', +new Date() + (3600000 * 24 *30))
    
    setCookie(token_key, token_value, 30)


    if (window.screen.width > 600) return

    window.addEventListener("orientationchange", function() {
        var orientation = window.orientation;

        console.log(orientation)
    
        // 检测到横向
        if (orientation === 90 || orientation === -90) {
            document.body.classList.add('orientation-col')
            // 强制滚动到顶部
            window.scrollTo(0, 0);
        } else {
            document.body.classList.remove('orientation-col')
        }
    });

    // 预览图放大
    const previewSerFlagPhone = document.getElementById('cdn_server_flag_phone')
    if (previewSerFlagPhone) {
        var previewImageDomList = previewSerFlagPhone.querySelectorAll('.preview-picture img')
        if (previewImageDomList) {
            previewImageDomList.forEach(ele => {
                const highImageSrc = ele.dataset.org
                if (highImageSrc) {
                    ele.dataset.org = ele.src
                    ele.src = highImageSrc
                }
            })
        }
    }
    
    // 推荐视频本地存储一下
    const relatedVideoDom = document.querySelector('div[alt=\"Related Video\"]')

    if (relatedVideoDom) {
        const videoList = Array.from(document.querySelectorAll('div[alt=\"Related Video\"] > div'))
        const relatedVideoInfo = []
        videoList.forEach(video => {
            const isVideo = video.querySelector('.video_related_list_item')
            if (isVideo) {
                const image = video.querySelector('.video_related_list_item img')
                const videoTitle = video.querySelector('.vrli_title').innerText
                const videoPath = video.dataset.href
                const saleInfo = video.querySelectorAll('div[style=\"float: left;font-size: 14px;color: #7c7c7c;\"]')
                console.log(saleInfo)
                relatedVideoInfo.push({
                    videoPath, videoTitle, imagePath: image.src,
                    salePrice: saleInfo[0]?.innerText.trim() || '',
                    saleCount: saleInfo[1]?.innerText.trim() || '0',
                    duration: video.querySelector('.vrli_duration')?.innerText.trim() || ''
                })
                image.src = image.src.replace('/mip', '') // 推荐视频预览图放大
            }
        })
        setRecommendVideoStorage(relatedVideoInfo)
        console.log('relatedVideoInfo', relatedVideoInfo)
    }

    function setRecommendVideoStorage (list) {
        const maxRecommendVideoLength = 60
        let videoList = JSON.parse(localStorage.getItem('recommendVideo')) || []
        list.forEach(item => item.createTime = +new Date())
        list.sort(calcSort)
        const firstRecommend = list.splice(0, 7)
        videoList.unshift(...list)
        videoList.sort(calcSort)
        videoList.unshift(...firstRecommend)
        const uniquePaths = new Set();
        videoList = videoList.filter(item => {
            if (uniquePaths.has(item.videoPath)) {
                // 如果已经包含当前视频的路径，则返回 false，过滤掉当前视频
                return false
            } else {
                // 如果不包含当前视频的路径，则将其添加到 uniquePaths 中，并返回 true
                uniquePaths.add(item.videoPath)
                return true
            }
        })
        localStorage.setItem('recommendVideo', JSON.stringify(videoList.slice(0, maxRecommendVideoLength)))

        function calcSort (a, b) {
            // 根据销售数量排序（作为主要因素）
            const saleCountDiff = parseInt(b.saleCount) - parseInt(a.saleCount)
            if (saleCountDiff !== 0) {
                return saleCountDiff
            }
            
            // 如果销售数量相同，则根据创建时间排序（作为次要因素）
            const createTimeDiff = Number(b.createTime) - Number(a.createTime)
            if (createTimeDiff !== 0) {
                return createTimeDiff
            }

            // 如果创建时间也相同，则可以考虑其他因素，例如观看次数、视频长度等

            const durationA = timeStringToMinutes(a.duration);
            const durationB = timeStringToMinutes(b.duration);
            const durationDiff = durationB - durationA;
            if (durationDiff !== 0) {
                return durationDiff;
            }

            // 如果其他因素都相同，则保持原顺序
            return 0;
        }
    }

    function timeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    const videoUploaderDom = document.querySelector('html div[alt="uploader"] > div:nth-child(2) > div:nth-child(1)')
    if (videoUploaderDom) {
        const fansCount = videoUploaderDom.querySelector('span') && videoUploaderDom.querySelector('span#following').innerText
        if (Number(fansCount)) {
            const userName = videoUploaderDom.innerText.split('[' + fansCount + '人关注]')[0]
            videoUploaderDom.style.display = 'flex'
            videoUploaderDom.style.flexDirection = 'column'
            videoUploaderDom.innerHTML = `<span style="font-size: 36px">${userName}</span><span style="font-size: 30px">[${fansCount}]人关注</span>`
        }
    }

    const randomCateContainerDom = document.querySelectorAll('html .random_cate_container')
    if (randomCateContainerDom && randomCateContainerDom.length) {
        randomCateContainerDom.forEach(parent => {
            const tagsList = parent.querySelectorAll('a')
            parent.innerHTML = ''
            tagsList.forEach(tag => {
                parent.appendChild(tag)
            })
        })
    }

    const pagesDom = document.querySelectorAll('html div:has(> div.pages)')
    if (pagesDom && pagesDom.length) {
        if (pagesDom.length > 1) {
            pagesDom[0].style.display = 'none'
        }
    }
    // const sortButtonDom = document.createElement('div')
    // sortButtonDom.classList.add('pages-sort-button')
    // pagesDom.forEach(pagesWrapper => {
    //     pagesWrapper.querySelector('.pages').appendChild(sortDom)
    // })

    /** 筛选条件数据 */
    const sortList = []
    let sortCount = 0
    const sortDomList = document.querySelectorAll('html .sort_container')
    if (sortDomList && sortDomList.length) {
        sortDomList.forEach(sort => {
            sort.style.display = 'none'
            const operationDom = sort.querySelectorAll('.button-group li button')
            const operationList = []
            operationDom.forEach(op => {
                operationList.push({
                    label: op.innerText,
                    operation: op.getAttribute('onclick'),
                    active: op.hasAttribute('disabled'),
                    remove_query: op.getAttribute('remove_query') || ''
                })
            })
            sortList.push({
                label: sort.querySelector('span')?.innerText || '',
                sort: operationList
            })
        })
    }

    /** 自定义筛选栏 */
    const navBarList = []
    const navBarListDom = document.querySelector('html .nav-bar')
    if (navBarListDom) {
        const navTitleDom = navBarListDom.querySelectorAll('.nav-title')
        navTitleDom.forEach((nav, index) => {
            const title = nav.querySelector('li').innerText
            if (["APP下载", "林子菌"].includes(title)) {
                nav.style.display = 'none'
                return
            }
            const navOptionsDom = nav.querySelectorAll('.nav-title-down li a')
            const navOptions = []
            navOptionsDom.forEach(option => {
                navOptions.push({
                    label: option.innerText,
                    link: option.getAttribute('href')
                })
            })
            navBarList.push({
                key: 'nav-title-' + index,
                title: nav.querySelector('li').innerText,
                options: navOptions
            })
        })
        /** 重构navBar 交互不太好 不要了 */
        // if (navBarList.length) {
        //     navBarListDom.innerHTML = ''
        //     navBarList.forEach(nav => {
        //         let navContent = ''
        //         const navTitle = document.createElement('div')
        //         navTitle.classList.add('self-nav-title')
        //         navTitle.innerHTML = nav.title
        //         nav.options.forEach(link => {
        //             navContent += `<a href=\"${link.link}\">${link.label}</a>`
        //         })
        //         navTitle.addEventListener('click', () => togglePopupLayer(nav.key, {
        //             mask: false,
        //             height: '60%',
        //             content: navContent
        //         }))
        //         navBarListDom.appendChild(navTitle)
        //     })
        // }
        if (sortList && sortList.length) {
            const sortDom = document.createElement('div')
            sortDom.classList.add('nav-sort')
            let sortListContent = ''
            sortList.forEach(sort => {
                let sortButton = ''
                if (sort.label === '显示') sortCount--
                sort.sort.forEach(btn => {
                    if (btn.active) sortCount++
                    const removeFun = `window.location.href = window.location.href.replace(new RegExp('[&?]' + '${btn.remove_query}' + '(?:=[^&]*)?'), '').replace(/&$/, '').replace(/\\?$/, '');`
                    sortButton += `<div class="nav-sort-button ${btn.active ? 'active' : ''}" onclick="${btn.active ? removeFun : btn.operation}">${btn.label}</div>`
                })
                sortListContent += `<div class="nav-sort">
                    <div class="nav-sort-title">${sort.label}</div>
                    <div class="nav-sort-button-list">${sortButton}</div>
                </div>`
            })
            sortDom.innerHTML = `<div class="nav-sort-text">
            <svg t="1710679274017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7357" width="36" height="36"><path d="M925.918257 211.615069c-0.818627 1.125612-2.762866 2.251224-3.786149 3.17218L674.906765 459.966024v402.662136c0 46.354752-35.507944 84.011592-81.965024 84.011592-21.488958 0-39.703408-8.18627-55.359648-22.921555-1.125612-0.716299-2.251224-1.637254-3.17218-2.558209L465.645248 853.21395c-8.493255-8.390926-8.595583-22.0006-0.204656-30.596182l29.265913-29.470571c8.288598-8.083941 21.591286-8.18627 29.982213-0.102328l62.829619 65.080843c0.920955 0.818627 1.330269 1.637254 2.455881 2.660538-0.61397-172.832617-0.818627-378.61497-0.818627-419.750975v-7.265314c0-5.730389 5.116419-11.563106 9.209553-15.553912l264.211852-261.960628c0.716299-0.920955 1.534926-3.479165 2.353553-3.479164h-705.042471c0.818627 0 0.716299 2.455881 1.330269 3.376836L421.644049 418.625362c4.093135 4.093135 4.502448 9.516538 4.502448 15.246927V606.090936c0 0.204657 0.61397 0.511642 0.613971 0.716299-0.511642 23.330868-18.726092 41.852303-41.647647 41.852303-23.330868 0-44.819826-19.033077-44.819826-42.363945v-146.329569l-242.415909-245.588089c-0.920955-0.920955 0.61397-2.455881-0.102328-3.479164-14.837614-15.860897-23.126212-36.735885-23.023884-58.429499 0-46.354752 37.65684-85.648846 83.909264-85.648846h707.600679c22.409913 0 43.489557 10.335165 59.350455 26.196062 15.860897 15.860897 24.047167 37.759169 24.047167 60.169082-0.204657 21.591286-8.902568 42.773259-23.740182 58.429499zM388.182672 665.850705c25.786749 0.920955 45.945438 22.512241 45.024483 48.29899-0.818627 24.558809-20.568002 44.205856-45.024483 45.024483-25.786749-0.920955-45.945438-22.512241-45.024483-48.298991 0.818627-24.45648 20.465674-44.205856 45.024483-45.024482z" p-id="7358" fill="#e6e6e6"></path></svg>
                过滤<span class="nav-sort-count">${sortCount}</span>
            </div>`
            sortDom.addEventListener('click', () => togglePopupLayer('nav-sort-popup', {
                placement: 'left',
                width: '65%',
                height: '100%',
                style: {
                    borderRadius: '0 70px 70px 0',
                    overflow: 'scroll'
                },
                content: sortListContent
            }))
            navBarListDom.insertBefore(sortDom, navBarListDom.firstChild);
            // const statusBarDom = document.querySelector('.status-bar')
            // if (statusBarDom) {
            //     const sortDomCopy = sortDom.cloneNode(true);
            //     statusBarDom.insertBefore(sortDomCopy, statusBarDom.firstChild);
            // }
        }
    }

    const personalCenterInfo = {}
    const aboutMeInfo = {}
    const personalCenterDom = document.querySelector('.nav-bag .personal-center')
    if (personalCenterDom) {
        const userIcoImg = personalCenterDom.querySelector('.user-ico img')
        if (userIcoImg && userIcoImg.src) personalCenterInfo.userIco = userIcoImg.src
        const userNewsCount = personalCenterDom.querySelector('.user-news a')
        if (userNewsCount) {
            personalCenterInfo.userNews = {
                count: userNewsCount.innerText,
                href: userNewsCount.href
            }
        }
        /** 个人中心数据 */
        const aboutMeDom = personalCenterDom.querySelector('.about-me')
        if (aboutMeDom) {
            const userName = aboutMeDom.querySelector('.vip-name')?.innerText.trim().split('昵称:')[0].trim()
            const nickName = aboutMeDom.querySelector('.vip-name .nick_name')?.innerText.split('昵称:')[1]
            const levelDom = aboutMeDom.querySelector('.portrait p')
            aboutMeInfo.accountInfo = {
                userAvatar: personalCenterInfo.userIco,
                userName: userName,
                nickName: nickName,
                level: levelDom.innerText,
                levelHandler: levelDom.getAttribute('onclick')
            }
            aboutMeInfo.history = []
            const userHistory = Array.from(aboutMeDom.querySelectorAll('.personal-more .user-history'))
            userHistory.forEach(history => {
                const aboutArr = Array.from(history.querySelectorAll('.history-about a'))
                const historyInfo = []
                aboutArr.forEach(about => {
                    historyInfo.push({
                        title: about.innerText,
                        link: about.href
                    })
                })
                aboutMeInfo.history.push(historyInfo)
            })

            aboutMeInfo.coin = personalCenterDom.querySelector('.personal-center-coin').innerText.trim()
            aboutMeInfo.diamond = personalCenterDom.querySelector('.personal-center-diamond').innerText.trim()

            console.log('--', aboutMeInfo) //////////////////////////////////////////////////////////////////////////

            let contentStr = ''
    
            const headerTopStr = `
                <div class="popup-header">
                    <div class="go-back" onclick="togglePopupLayer('user-center-popup')">
                        <svg t="1710690949128" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8582" width="60" height="60"><path d="M781.566553 1011.699354L168.659015 540.690841c-20.402945-16.0254-20.402945-42.009075 0-58.034474L781.566553 11.647854c20.377345-16.0254 53.400932-16.0254 73.778278 0 20.377345 15.9998 20.377345 42.009075 0 58.008875L279.326431 511.686404l576.0184 442.004075c20.377345 15.9998 20.377345 41.983475 0 58.008875-20.377345 16.0254-53.400932 16.0254-73.778278 0z" fill="#ffffff" p-id="8583"></path></svg>
                    </div>
                    <div class="header-title">个人中心</div>
                    <div class="tw-relative center-toast">
                        <svg t="1711643134235" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7426" width="70" height="70"><path d="M938.77 911h-854A78.88 78.88 0 0 1 6 832.2v-640a78.88 78.88 0 0 1 78.79-78.79h854a78.87 78.87 0 0 1 78.79 78.79v640a78.87 78.87 0 0 1-78.81 78.8z m-854-736.07a17.53 17.53 0 0 0-17.3 17.3v640a17.53 17.53 0 0 0 17.3 17.29h854a17.53 17.53 0 0 0 17.3-17.29v-640a17.53 17.53 0 0 0-17.3-17.3z" fill="#ffffff" p-id="7427"></path><path d="M512.38 612.78a87.54 87.54 0 0 1-58.6-21.91l-429-333.95 42.68-47.69 429 333.95c8.33 7.45 23.51 7.45 31.84 0l429-333.95 42.7 47.69-429 334a87.54 87.54 0 0 1-58.62 21.86z" fill="#ffffff" p-id="7428"></path></svg>
                        <span class="center-toast-count" onclick="window.location.href='${personalCenterInfo.userNews.href}'">${personalCenterInfo.userNews.count}</span>
                    </div>
                </div>
            `
    
            contentStr += headerTopStr
    
            const userInfoBox = `
                <div class="user-info-box tw-flex tw-items-center">
                    <div class="user-avatar"><img src="${aboutMeInfo.accountInfo.userAvatar}" alt="user_avatar" /></div>
                    <div class="tw-flex tw-flex-col">
                        <div class="user-nick-name tw-flex tw-items-center">
                            ${aboutMeInfo.accountInfo.nickName}
                            <a class="change-account" href="profile.php">修改资料</a>
                        </div>
                        <div class="tw-flex" onclick="${aboutMeInfo.accountInfo.levelHandler}">
                            <span class="user-level">${aboutMeInfo.accountInfo.level}</span>
                            <div class="user-coin"><i class="iconfont icon-weibiaoti-"></i>${aboutMeInfo.coin}</div>
                            <div class="user-diamond"><i class="iconfont icon-zuanshi"></i>${aboutMeInfo.diamond}</div>
                        </div>
                    </div>
                </div>
            `
    
            const historyInfoBox = `
                <div class="history-info-box">
                    ${
                        aboutMeInfo.history.map(list => {
                            return `
                                <div class="history-list">
                                    ${
                                        list.map(item => {
                                            return `<div class="history-item ${window.location.href === item.link ? 'active' : ''}" onclick="window.location.href = '${item.link}'">
                                                <span>${item.title}<span>
                                            </div>`
                                        }).join('')
                                    }
                                </div>
                            `
                        }).join('')
                    }
                </div>
            `
    
            const userCenterWrapper = `
                <div class="user-center-wrapper">
                    ${userInfoBox}
                    ${historyInfoBox}
                </div>
            `
    
            contentStr += userCenterWrapper

            personalCenterDom.style.display = "none"
    
            createPopupLayer('user-center-popup', {
                placement: 'right',
                width: '100%',
                height: '100%',
                content: contentStr,
                style: {
                    overflow: 'scroll'
                }
            }, false)
        }
    }

    GM_addStyle(`
        #user-center-popup .popup-header {
            position: sticky;
            display: flex;
            top: 0;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #625192;
            background-color: #413075;
        }
        #user-center-popup .popup-header .go-back {
            padding: 40px;
        }
        #user-center-popup .popup-header .header-title {
            font-size: 50px;
            font-weight: bold;
        }
        #user-center-popup .popup-header .center-toast {
            padding: 30px;
        }
        #user-center-popup .popup-header .center-toast span.center-toast-count {
            position: absolute;
            font-size: 24px;
            left: 75px;
            top: 17px;
            padding: 0px 13px;
            background: #f00;
            border-radius: 50px;
        }
        #user-center-popup .user-center-wrapper {
            height: calc(100% - 140px);
            overflow-y: scroll;
            box-sizing: border-box;
            padding-bottom: calc(40px + constant(safe-area-inset-bottom));
            padding-bottom: calc(40px + env(safe-area-inset-bottom));
        }
        #user-center-popup .user-center-wrapper .user-info-box .user-avatar img {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            margin: 40px;
            margin-right: 60px;
        }
        #user-center-popup .user-center-wrapper .user-info-box .user-nick-name {
            font-size: 50px;
            font-weight: 600;
            margin-bottom: 30px;
        }
        #user-center-popup .user-center-wrapper .user-info-box .user-nick-name .change-account{
            font-size: 28px;
            font-weight: normal;
            color: #ccc;
            margin-left: 30px;
            padding: 10px 27px;
            background: #333;
            border-radius: 50px;
        }
        #user-center-popup .user-center-wrapper .user-info-box span.user-level {
            font-size: 36px;
            background-color: rgba(51, 40, 96, 0.8);
            padding: 10px 20px;
            border-radius: 40px;
            border: 2px solid #999;
            margin-right: 20px;
        }
        #user-center-popup .user-center-wrapper .user-info-box .user-coin {
            font-size: 36px;
            color: #f8873b;
            padding: 10px 20px;
            margin-right: 20px;
        }
        #user-center-popup .user-center-wrapper .user-info-box .user-diamond {
            font-size: 36px;
            color: #00b9f2;
            padding: 10px 20px;
            margin-right: 20px;
        }
        #user-center-popup .user-center-wrapper .history-info-box {
            font-size: 40px;
        }
        #user-center-popup .user-center-wrapper .history-info-box .history-list {
            margin-bottom: 30px;
            background-color: #333;
        }
        #user-center-popup .user-center-wrapper .history-info-box .history-item {
            line-height: 100px;
            border-bottom: 1px solid #ffffff;
            padding: 10px 40px;
        }
        #user-center-popup .user-center-wrapper .history-info-box .history-item.active {
            background: #4A3F78;
        }
    `)


    /** 自定义头部搜索栏 */
    const statusBarDom = document.querySelector('header.status-bar')
    if (statusBarDom) {
        const headerBarDom = document.createElement('div')
        headerBarDom.classList.add('header-bar')

        const logoBarDom = document.querySelector('.nav-bag .nav .logo-bar')
        if (logoBarDom) {
            logoBarDom.style.position = 'relative'
            logoBarDom.style.marginRight = '20px'
            const logo = logoBarDom.querySelector('.logo')
            logo && (logo.style.marginTop = '0')
            const logoRight = logoBarDom.querySelector('.logo_right')
            logoRight && (logoRight.style.display = 'none')
            headerBarDom.appendChild(logoBarDom)
        }

        const searchBarDom = document.createElement('div')
        searchBarDom.classList.add('header-search-wrapper')

        const searchMediaTypeDom = statusBarDom.querySelector('#search_media_type')
        const searchMediaType = { value: searchMediaTypeDom.value, label: searchMediaTypeDom.innerText }
        const originSearchDom = statusBarDom.querySelector('#search').value

        searchBarDom.innerHTML = `
            <div class="fake-search-container">
                <i class="iconfont icon-sousuo"></i>
                <div class="fake-search">${originSearchDom || '关键词搜索。支持搜索上传用户'}</div>
            </div>
        `
        headerBarDom.appendChild(searchBarDom)
        searchBarDom.addEventListener('click', () => {
            togglePopupLayer('header-search-popup')
            const realSearchInput = document.querySelector('#popup-search')
            realSearchInput && realSearchInput.focus()
        })
        if (personalCenterInfo.userIco) {
            const userIco = document.createElement('div')
            userIco.classList.add('user-avatar')
            userIco.classList.add('tw-relative')
            userIco.innerHTML = `
                <img alt="avatar" src="${personalCenterInfo.userIco}">
                <span class="toast-count">${personalCenterInfo.userNews.count}</span>
            `
            userIco.addEventListener('click', () => {
                togglePopupLayer('user-center-popup')
            })
            headerBarDom.appendChild(userIco)
        }
        statusBarDom.innerHTML = ''
        statusBarDom.insertBefore(headerBarDom, statusBarDom.firstChild)

        let contentStr = ''

        const searchPopupLayer = `
            <div class="search-popup-header">
                <div class="go-back" onclick="togglePopupLayer('header-search-popup')">
                <svg t="1710690949128" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8582" width="60" height="60"><path d="M781.566553 1011.699354L168.659015 540.690841c-20.402945-16.0254-20.402945-42.009075 0-58.034474L781.566553 11.647854c20.377345-16.0254 53.400932-16.0254 73.778278 0 20.377345 15.9998 20.377345 42.009075 0 58.008875L279.326431 511.686404l576.0184 442.004075c20.377345 15.9998 20.377345 41.983475 0 58.008875-20.377345 16.0254-53.400932 16.0254-73.778278 0z" fill="#ffffff" p-id="8583"></path></svg>
                </div>
                <div class="search-container">
                    <i class="iconfont icon-sousuo" id="popup-search-button"></i>
                    <div class="search-input-choice">
                        <div class="dropdown">
                            <button id="search_media_type" value="${searchMediaType.value}" type="button" class="btn btn-secondary dropdown-toggle search-choice" data-toggle="dropdown">
                                ${searchMediaType.label}
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" data-mediatype="picture" href="javascript:void(0)" onclick="media_type(this)">图片</a>
                                <a class="dropdown-item active" data-mediatype="video" href="javascript:void(0)" onclick="media_type(this)">视频</a>
                                <a class="dropdown-item" data-mediatype="fiction" href="javascript:void(0)" onclick="media_type(this)">小说</a>
                            </div>
                        </div>
                    </div>
                    <input type="text" id="popup-search" value="${originSearchDom || ''}" placeholder="请输入关键词/用户名">
                </div>
            </div>
        `
        contentStr += searchPopupLayer

        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        const searchHistoryStr = `<div class="popup-search-wrapper">
            <div class="popup-search-wrapper-title">
                <span>搜索历史</span>
            </div>
            <div class="tw-flex tw-flex-wrap">
                ${
                    searchHistory.map(item => {
                        if (item.type === 'search') {
                            return `<div class="label tw-lines-1" onclick="popupSearchByValue('${item.label}')">${item.label}</div>`
                        } else if (item.type === 'tag') {
                            return `<div class="label tag tw-lines-1" onclick="window.location.href = '${item.href}'">${item.label}</div>`
                        }
                    }).join('')
                }
            </div>
        </div>`

        if (searchHistory.length) {
            contentStr += searchHistoryStr
        }

        const randomCateContainerDom = Array.from(document.querySelectorAll('html .random_cate_container'))
        if (randomCateContainerDom && randomCateContainerDom.length) {
            randomCateContainerDom.forEach(dom => {
                Array.from(dom.querySelectorAll('a')).forEach(tag => {
                    tag.addEventListener('click', (e) => {
                        clickTag(e, true)
                    })
                })
            })
        }
        let tagsList = []
        const detailTagListDom = Array.from(document.querySelectorAll('div[alt="tag"] .video_tag'))
        if (randomCateContainerDom && randomCateContainerDom.length) {
            tagsList = Array.from(randomCateContainerDom[0].querySelectorAll('a'))
        } else if (detailTagListDom && detailTagListDom.length) {
            tagsList = Array.from(detailTagListDom).map(tag => {
                const tagId = tag.className.split('video_tag_').find(num => Number(num))
                if (tagId) {
                   tag.href = './video_list.php?tag_id=' + tagId
                   return tag
                } else {
                    return ''
                }
            }).filter(Boolean)
        }
        if (tagsList && tagsList.length) {
            const tagListStr = `<div class="popup-search-wrapper">
                <div class="popup-search-wrapper-title">
                    <span>推荐标签</span>
                    <a href="advance_search.php" style="margin-left: 30px;font-size: 36px;"><svg t="1711298108933" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4334" width="60" height="60"><path d="M298.666667 117.333333a181.333333 181.333333 0 0 1 181.333333 181.333334v181.333333H298.666667a181.333333 181.333333 0 1 1 0-362.666667z m117.333333 298.666667V298.666667a117.333333 117.333333 0 1 0-117.333333 117.333333h117.333333zM725.333333 117.333333a181.333333 181.333333 0 1 1 0 362.666667h-181.333333V298.666667A181.333333 181.333333 0 0 1 725.333333 117.333333z m-117.333333 298.666667H725.333333a117.333333 117.333333 0 1 0-117.333333-117.333333v117.333333zM298.666667 906.666667a181.333333 181.333333 0 1 1 0-362.666667h181.333333V725.333333a181.333333 181.333333 0 0 1-181.333333 181.333334z m117.333333-298.666667H298.666667a117.333333 117.333333 0 1 0 117.333333 117.333333v-117.333333z m309.333333 298.666667a181.333333 181.333333 0 0 1-181.333333-181.333334v-181.333333H725.333333a181.333333 181.333333 0 1 1 0 362.666667z m-117.333333-298.666667V725.333333a117.333333 117.333333 0 1 0 117.333333-117.333333h-117.333333z" fill="#ffffff" p-id="4335"></path></svg></a>
                </div>
                <div class="tw-flex tw-flex-wrap">
                    ${
                        tagsList.map(tag => {
                            return `<div class="label tag tw-lines-1"  data-href="${tag.href}" onclick="clickTag(event)">${tag.innerText}</div>`
                        }).join('')
                    }
                </div>
            </div>`
            contentStr += tagListStr
        }


        const recommendVideo = JSON.parse(localStorage.getItem('recommendVideo')) || []
        if (recommendVideo.length) {
            const recommendVideoContent = `<div class="popup-search-wrapper">
                <div class="popup-search-wrapper-title">
                    <span>推荐视频</span>
                </div>
                <div class="row-video-list">
                    ${
                        recommendVideo.slice(0, 30).map(video => {
                            return `<div data-href="${video.videoPath}" onclick="window.location.href = '${video.videoPath}'" class="row-video-item">
                                <div class="video-image">
                                    <img class="main-image" src="${video.imagePath}" alt="" />
                                    <span class="duration">${video.duration}</span>
                                </div>
                                <div class="video-info">
                                    <p class="video-title tw-lines-3">${video.videoTitle}</p>
                                    <div class="sale-info">
                                        <div class="sale-item">售价：${video.salePrice}</div>
                                        <div class="sale-item">购买次数：${video.saleCount}</div>
                                    </div>
                                </div>
                            </div>`
                        }).join('')
                    }
                </div>
            </div>`
            contentStr += recommendVideoContent
        }

        createPopupLayer('header-search-popup', {
            placement: 'opacity',
            width: '100%',
            height: '100%',
            // animation: false,
            content: contentStr,
            style: {
                backgroundColor: 'rgba(9, 9, 9, 0.7)',
                // backdropFilter: 'blur(25px)',
                overflow: 'scroll'
            }
        }, false)

        setTimeout(() => {
            const popupSearchButton = document.querySelector('#popup-search-button')
            const popupSearchInput = document.querySelector('#popup-search')
            popupSearchInput.addEventListener('keydown', function(event) {
                if(event.keyCode == "13") {
                    setTimeout(function () {
                        popupSearchButton.click();
                    }, 400)
                }
            });
            popupSearchButton.addEventListener('click', () => {
                const searchTxt = popupSearchInput.value
                storageSearchTxt({ label: searchTxt, type: 'search' })
                const media_type = document.querySelector("#search_media_type").value
                if (searchTxt.indexOf('\'') > -1 || searchTxt.indexOf('"') > -1) {
                    swal(MLANG.search.no_quote);
                } else if (searchTxt == popupSearchInput.getAttribute('defaultVal') || searchTxt == '') {
                    swal(MLANG.search.not_empty);
                } else if (searchTxt.length <= 1) {
                    swal(MLANG.search.length_error);
                } else {
                    if (media_type == "picture") {
                        window.location.href = "./home.php?search=" + encodeURIComponent(searchTxt);
                    } else if (media_type == "fiction") {
                        window.location.href = "./fiction_list.php?search=" + encodeURIComponent(searchTxt);
                    } else {
                        window.location.href = "./video_list.php?search=" + encodeURIComponent(searchTxt);
                    }
                }
                togglePopupLayer('header-search-popup')
            })
        }, 300)
    }
    function popupSearchByValue (value) {
        const popupSearchButton = document.querySelector('#popup-search-button')
        const popupSearchInput = document.querySelector('#popup-search')
        if (popupSearchInput) {
            popupSearchInput.value = value
            setTimeout(() => {
                popupSearchButton.click()
            }, 200)
        }
    }

    const maxHistoryLength = 25
    function storageSearchTxt (searchInfo) {
        // 从LocalStorage获取搜索历史，如果不存在则返回一个空数组
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // 如果搜索内容不重复，则添加到搜索历史中
        const index = searchHistory.findIndex(item => item.label === searchInfo.label && item.type === searchInfo.type)
        if (index === -1) {
            if (searchHistory.length >= maxHistoryLength) { // 删除数组第一个元素
                searchHistory.pop()
            }
            searchHistory.unshift(searchInfo);
        } else {
            const repeatedSearch = searchHistory.splice(index, 1)
            repeatedSearch && searchHistory.unshift(repeatedSearch[0])
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }


    // index.css 公共样式
    GM_addStyle(`
        .tw-flex {
            display: flex;
        }
        .tw-flex-col {
            flex-direction: column;
        }
        .tw-font-bold {
            font-weight: bold;
        }
        .tw-font-28 {
            font-size: 28px;
        }
        .tw-font-32 {
            font-size: 32px;
        }
        .tw-font-36 {
            font-size: 36px;
        }
        .tw-font-42 {
            font-size: 42px;
        }
        .tw-font-50 {
            font-size: 50px;
        }
        .tw-flex-wrap {
            flex-wrap: wrap;
        }
        .tw-flex-center {
            justify-content: center;
            align-items: center;
        }
        .tw-items-center {
            align-items: center;
        }
        .tw-justify-center {
            justify-content: center;
        }
        .tw-justify-between {
            justify-content: space-between;
        }
        .tw-relative {
            position: relative;
        }
        .tw-lines-1 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tw-lines-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .tw-lines-3 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
        .orientation-col {
            transform: rotate(270deg) translateX(-100%);
            transform-origin: left top;
            width: 100vh;
            height: 100vw;
            position: relative;
            overflow: scroll hidden;
        }
    `)

    GM_addStyle(`
        html header.status-bar .header-bar {
            display: flex;
            align-items: center;
            padding: 20px;
        }

        html header.status-bar .header-bar .user-avatar img {
            width: 87px;
            height: 87px;
            border-radius: 50%;
            object-fit: cover;
            margin-left: 20px;
        }

        html header.status-bar .header-bar .user-avatar span.toast-count {
            position: absolute;
            font-size: 24px;
            left: 0px;
            top: -10px;
            padding: 0px 13px;
            background: #f00;
            border-radius: 50px;
        }

        html header.status-bar .header-bar .header-search-wrapper {
            flex: 1;
        }

        html header.status-bar .header-bar .header-search-wrapper .fake-search-container {
            width: 100%;
            padding: 8px 15px;
            border-radius: 50px;
            border: 4px solid #e2e2e2;
            position: relative;
        }
        html header.status-bar .header-bar .header-search-wrapper .fake-search-container .icon-sousuo {
            font-size: 52px;
            top: 1px;
            left: 34px;
            color: #ccc;
            font-weight: bold;
        }
        html header.status-bar .header-bar .header-search-wrapper .fake-search-container .fake-search {
            font-size: 42px;
            padding-left: 96px;
            color: #b8b8b8;
        }

        #header-search-popup {
            -webkit-backdrop-filter: blur(25px);
            backdrop-filter: blur(25px);
        }

        #header-search-popup .search-popup-header {
            display: flex;
            align-items: center;
            padding-top: 40px;
            position: sticky;
            top: 0;
            z-index: 9;
            padding-bottom: 20px;
            background-image: linear-gradient(181deg, rgba(9, 9, 9) 80%, transparent);
        }

        #header-search-popup .search-popup-header .go-back {
            padding: 20px;
        }

        #header-search-popup .search-popup-header .search-container {
            display: flex;
            flex: 1;
            margin-right: 40px;
            border: 1px solid #ccc;
            border-radius: 60px;
        }

        #header-search-popup .search-popup-header .search-container .icon-sousuo {
            font-size: 59px;
            top: 57px;
            right: 86px;
            left: unset;
        }

        #header-search-popup .search-popup-header .search-container .search-input-choice {
            flex: unset;
        }

        #header-search-popup .search-popup-header .search-container .search-input-choice button {
            font-size: 45px;
            line-height: 45px;
            border-radius: 50px 0 0 50px;
            padding: 40px 20px 40px 30px;
        }

        #header-search-popup .search-popup-header .search-container .search-input-choice .dropdown-menu {
            background-color: #545b62;
            border-radius: 16px;
            top: 10px !important;
        }

        #header-search-popup .search-popup-header .search-container .search-input-choice .dropdown-menu .dropdown-item  {
            padding: 15px 80px;
            color: #FFFFFF;
            text-align: center;
            font-size: 40px;
        }

        #header-search-popup .search-popup-header .search-container #popup-search {
            flex: 1;
            background-color: transparent;
            font-size: 52px;
            border: none;
            padding: 20px 130px 20px 20px;
            color: #FFF;
        }

        #header-search-popup .popup-search-wrapper {
            padding: 40px;
        }

        #header-search-popup .popup-search-wrapper .popup-search-wrapper-title {
            font-size: 50px;
            font-weight: bold;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
        }

        #header-search-popup .popup-search-wrapper .label {
            display: inline-block;
            padding: 20px 40px;
            font-size: 36px;
            border-radius: 50px;
            background-color: #333;
            max-width: 500px;
            margin-right: 30px;
            margin-bottom: 30px;
        }

        #header-search-popup .popup-search-wrapper .label.tag {
            border-radius: 28px;
            color: beige;
            background: darkslateblue;
        }

        /** 系统弹窗 */
        .swal2-container .swal2-modal {
            width: 80%;
            font-size: 50px;
        }

        .row-video-list {
            color: #FFFFFF;
        }

        .row-video-list .row-video-item {
            display: flex;
            margin-bottom: 40px;
            position: relative;
        }

        .row-video-list .row-video-item::after {
            content: "";
            position: absolute;
            bottom: -20px;
            height: 1px;
            width: 100%;
            left: 0;
            background-color: #ccc;
        }

        .row-video-list .row-video-item .video-image {
            position: relative;
            border-radius: 20px 0 0 20px;
            overflow: hidden;
        }

        .row-video-list .row-video-item .video-image .main-image {
            width: 320px;
            height: 320px;
            object-fit: cover;
        }

        .row-video-list .row-video-item .video-image .duration {
            position: absolute;
            right: 15px;
            bottom: 10px;
            font-size: 30px;
            padding: 10px 20px;
            border-radius: 16px;
            background-color: rgba(0, 0, 0, .6);
        }

        .row-video-list .row-video-item .video-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            margin-left: 30px;
            font-size: 40px;
        }
        .row-video-list .row-video-item .video-info .sale-info {
            display: flex;
            font-size: 34px;
        }
        .row-video-list .row-video-item .video-info .sale-info .sale-item {
            margin-right: 30px;
        }
    `)

    /** 悬浮窗 暂时没规划好 */
    var sortDraggableDom = document.getElementById('sort-draggable')
    if (!sortDraggableDom) {
        sortDraggableDom = document.createElement('div')
        sortDraggableDom.setAttribute('id', 'sort-draggable')
        sortDraggableDom.innerHTML = `<svg t="1710608587816" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1733" width="120" height="120"><path d="M512 74.666667c241.536 0 437.333333 195.797333 437.333333 437.333333S753.536 949.333333 512 949.333333 74.666667 753.536 74.666667 512 270.464 74.666667 512 74.666667z m0 64C305.813333 138.666667 138.666667 305.813333 138.666667 512S305.813333 885.333333 512 885.333333 885.333333 718.186667 885.333333 512 718.186667 138.666667 512 138.666667z m138.666667 170.666666a32 32 0 0 1 31.850666 28.928L682.666667 341.333333v106.666667a32 32 0 0 1-63.850667 3.072L618.666667 448v-106.666667a32 32 0 0 1 32-32z m-277.333334 0a32 32 0 0 1 31.850667 28.928L405.333333 341.333333v106.666667a32 32 0 0 1-63.850666 3.072L341.333333 448v-106.666667a32 32 0 0 1 32-32z" fill="#cdcdcd" p-id="1734"></path></svg>`
        document.body.appendChild(sortDraggableDom)

        sortDraggableDom.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            togglePopupLayer('header-search-popup')
            const realSearchInput = document.querySelector('#popup-search')
            realSearchInput && realSearchInput.focus()
        })

        // 触摸开始事件处理程序
        sortDraggableDom.addEventListener('touchstart', function(event) {
            // 阻止事件冒泡
            event.stopPropagation();

            sortDraggableDom.style.transition = 'unset'
            // 获取触摸点相对于悬浮窗左上角的偏移量
            var offsetX = event.touches[0].clientX - sortDraggableDom.offsetLeft;
            var offsetY = event.touches[0].clientY - sortDraggableDom.offsetTop;

            // 获取页面宽高
            var pageWidth = window.innerWidth;
            var pageHeight = window.innerHeight;

            // 触摸移动事件处理程序
            document.addEventListener('touchmove', onTouchMove,  { passive: false });

            // 触摸结束事件处理程序
            document.addEventListener('touchend', onTouchEnd);

            // 触摸移动事件处理函数
            function onTouchMove(event) {
                // 阻止默认事件
                event.preventDefault();
                // 计算悬浮窗的新位置
                var newX = event.touches[0].clientX - offsetX;
                var newY = event.touches[0].clientY - offsetY;

                // 设置悬浮窗的新位置
                sortDraggableDom.style.left = newX + 'px';
                sortDraggableDom.style.top = newY + 'px';
            }

            // 触摸结束事件处理函数
            function onTouchEnd() {
                sortDraggableDom.style.transition = 'left 0.2s cubic-bezier(0.37, 0.5, 0.02, 1.32) 0s'
                if (parseInt(sortDraggableDom.offsetLeft) < (pageWidth / 2)) {
                    sortDraggableDom.style.left = '3%'
                } else {
                    sortDraggableDom.style.left = `calc(97% - ${sortDraggableDom.clientWidth + 'px'})`
                }
                // 移除触摸移动事件处理程序
                document.removeEventListener('touchmove', onTouchMove);

                // 移除触摸结束事件处理程序
                document.removeEventListener('touchend', onTouchEnd);
            }
        });
    }

    let activePopupLayer = ''

    /** 抽屉弹出 - 组件 */
    function createPopupLayer (id, customOptions, toggle = true) {
        if (!id) return
        const options = {
            placement: 'bottom',
            height: '80%',
            width: '100%',
            style: {},
            closable: true,
            content: '',
            mask: true,
            animation: true,
            ...customOptions
        }
        const popupLayerMaskDom = document.querySelector('.popup-layer-mask')
        if (!popupLayerMaskDom) createPopupLayerMask()
        const closeTemplate = `` // 关闭按钮
        const popupLayerTemplate = `
            ${options.closable ? closeTemplate : ''}
            <div class="popup-layer-drawer-content">
                ${options.content}
            </div>
        `
        const popupLayerDom = document.createElement('div')
        popupLayerDom.id = id
        popupLayerDom.classList.add('popup-layer-drawer')
        popupLayerDom.classList.add('placement-' + options.placement)
        popupLayerDom.mask = options.mask
        Object.keys(options.style).forEach(key => {
            popupLayerDom.style[key] = options.style[key]
        })
        if (['top', 'bottom'].includes(options.placement)) {
            popupLayerDom.style[options.placement] = `-${options.height}`
        } else if (['left', 'right'].includes(options.placement)) {
            popupLayerDom.style.top = '0'
            popupLayerDom.style[options.placement] = `-${options.width}`
        } else if (['opacity'].includes(options.placement)) {
            popupLayerDom.style.opacity = '0'
        }
        popupLayerDom.style.width = options.width
        popupLayerDom.style.height = options.height
        popupLayerDom.innerHTML = popupLayerTemplate
        if (!options.animation) popupLayerDom.style.transition = 'unset'
        document.body.appendChild(popupLayerDom)
        setTimeout(() => {
            toggle && togglePopupLayer(id)
        })
    }

    function createPopupLayerMask () {
        const maskDom = document.createElement('div')
        maskDom.classList.add('popup-layer-mask')
        maskDom.style.display = 'none'
        maskDom.addEventListener('click', () => {
            activePopupLayer && togglePopupLayer(activePopupLayer)
        })
        document.body.appendChild(maskDom)
    }

    function transitionEndHiddenPopupMask () {
        const popupLayerMaskDom = document.querySelector('.popup-layer-mask')
        if (popupLayerMaskDom) {
            popupLayerMaskDom.style.display = 'none'
            popupLayerMaskDom.removeEventListener('transitionend', transitionEndHiddenPopupMask)
        }
    }

    function togglePopupLayer (id, options = {}) {
        if (activePopupLayer && activePopupLayer !== id) {
           togglePopupLayer(activePopupLayer)
        }
        const layerDom = document.querySelector('div.popup-layer-drawer#' + id)
        const popupLayerMaskDom = document.querySelector('.popup-layer-mask')
        if (layerDom && popupLayerMaskDom) {
            const showMask = layerDom.mask
            if (layerDom.classList.contains('open')) {
                showMask && popupLayerMaskDom.addEventListener('transitionend', transitionEndHiddenPopupMask)
                activePopupLayer = ''
                document.body.style.overflow = 'unset'
            } else {
                activePopupLayer = id
                showMask && (popupLayerMaskDom.style.display = 'block')
                document.body.style.overflow = 'hidden'
            }
            setTimeout(() => {
                layerDom.classList.toggle('open')
                showMask && popupLayerMaskDom.classList.toggle('open')
            })
        } else {
            createPopupLayer(id, options)
        }
    }

    unsafeWindow.togglePopupLayer = togglePopupLayer
    unsafeWindow.popupSearchByValue = popupSearchByValue
    unsafeWindow.clickTag = function (e, onlyStorage = false) {
        const tag = e.target
        storageSearchTxt({ label: tag.innerText.trim(), type: 'tag', href: tag.href || tag.dataset.href})
        if (!onlyStorage) {
            window.location.href = tag.href || tag.dataset.href
        }
    }

    GM_addStyle(`
        #sort-draggable {
            width: 160px;
            height: 160px;
            position: fixed;
            z-index: 20;
            background: rgba(0, 0, 0, .5);
            top: 85%;
            left: 3%;
            border-radius: 40px;
            box-shadow: 0 0 10px 0 #000;
            transition: unset;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .popup-layer-mask {
            position: fixed;
            z-index: 101;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.5);
            top: 0;
            left: 0;
            transition: all .3s;
            opacity: 0;
        }
        .popup-layer-mask.open {
            opacity: 1;
        }
        .popup-layer-drawer {
            position: fixed;
            z-index: 102;
            position: fixed;
            width: 100%;
            background-color: rgba(33, 33, 33);
            transition: all .3s;
        }
        .popup-layer-drawer .popup-layer-drawer-content {
            position: relative;
            min-height: 100%;
        }
        .popup-layer-drawer.open.placement-bottom {
            bottom: 0 !important;
        }
        .popup-layer-drawer.open.placement-top {
            top: 0 !important;;
        }
        .popup-layer-drawer.open.placement-left {
            left: 0 !important;
        }
        .popup-layer-drawer.open.placement-right {
            right: 0 !important;;
        }
        .popup-layer-drawer.open.placement-opacity {
            opacity: 1 !important;;
            top: 0;
        }
        

        #nav-sort-popup .nav-sort {
            padding: 60px 0 0 60px;
        }
        #nav-sort-popup .nav-sort .nav-sort-title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 40px;
        }
        #nav-sort-popup .nav-sort .nav-sort-button-list {
            display: flex;
            flex-wrap: wrap;
        }
        #nav-sort-popup .nav-sort .nav-sort-button-list .nav-sort-button {
            font-size: 38px;
            background-color: #111;
            padding: 15px 34px;
            border-radius: 46px;
            margin-right: 36px;
            margin-bottom: 20px;
        }
        #nav-sort-popup .nav-sort .nav-sort-button-list .nav-sort-button.active {
            background-color: #423165;
            border: 2px solid #8463cb;
            box-sizing: border-box;
        }
    `)

    /** 头部搜索框 */
    GM_addStyle(`
        .status-bar .bar-main {
            display: flex;
        }
        .status-bar .bar-main .search-bar {
            flex-shrink: 0;
        }
        .status-bar .bar-main .search-bar input, input#search {
            width: 759px !important;
        }
        .status-bar .bar-main .language {
            display: none;
        }
    `)

    GM_addStyle(`
        @media screen and (max-device-width: 600px) {
            #locate_0 {
                padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
                padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
            }

            #buy_vip_layer_bg {
                z-index: 120 !important;
            }
            .side-bar {
                display: none;
            }
            .nav-bag .nav {
                height: auto;
            }
            .nav-bag .nav .personal-center {
                display: flex;
                justify-content: flex-end;
                padding: 30px 0;
                position: relative;
            }
            .nav-bag .nav-bar {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                padding: 8px 0;
                padding-top: 60px;
            }
            .nav-bag .nav-bar .self-nav-title {
                font-size: 42px;
                line-height: 42px;
            }
            .nav-bag .nav-bar .nav-sort {
                padding: 14px 30px 20px 0;
                position: relative;
                border-right: 1px solid #ccc;
            }
            .nav-bag .nav-bar .nav-sort-text {
                font-size: 34px;
                line-height: 42px;
                padding: 16px 28px;
                background-color: #333;
                border-radius: 16px;
                display: flex;
                align-items: center;
            }
            .nav-bag .nav-bar .nav-sort-text svg {
                margin: 5px 5px 0 0;
            }
            .nav-bag .nav-bar .nav-sort-count {
                font-size: 24px;
                line-height: 24px;
                padding: 10px 15px;
                background-color: #2d568d;
                border-radius: 16px;
                font-weight: bold;
                margin-left: 12px;
            }
            .nav-bag .nav-title {
                font-size: 38px;
                line-height: 42px;
                border-right: none;
                position: relative;
                margin: 0;
                padding: 30px 20px;
            }
            .nav-bar .nav-title:hover .nav-title-down {
                max-height: 100vh;
            }
            .nav-bag .nav-title .nav-title-down {
                top: 100%;
                width: auto;
                left: 50%;
                transform: translateX(-50%);
                max-height: 0;
                display: block;
                overflow: hidden;
                transition: all .3s;
                z-index: 15;
                padding-bottom: 0;
            }
            .nav-bag .nav-title .nav-title-down a {
                padding: 42px 50px;
                width: auto;
                height: auto;
                line-height: unset;
                font-size: 38px;
            }
            #locate_bottom {
                display: none;
            }
        }
    `)

    // 列表
    GM_addStyle(`
        @media screen and (max-device-width: 600px) {
            html .random_cate_container {
                display: flex;
                align-items: center;
                margin: 15px 20px 0 20px;
                height: auto;
                line-height: 32px;
                overflow-x: scroll;
                margin: 15px 20px;
            }
            html .random_cate_container a {
                font-size: 40px;
                padding: 15px 20px;
                background-color: #333;
                outline: none;
                border-radius: 15px;
                white-space: nowrap;
                margin-right: 20px;
            }
            html .item_video {
                width: calc(50% - 36px);
                margin-left: 18px;
                margin-right: 18px;
                border: 3px solid #e8e8e8;
                border-radius: 12px;
                margin-top: 30px;
                overflow: hidden;
                padding-bottom: 20px;
                box-sizing: border-box;
            }
            html .item_video .item_video_yuanchuang {
                width: 90px;
                height: 141px;
                background-size: 90px 141px;
                top: 9px;
            }

            html .item_video .video_duration {
                font-size: 30px;
                border-radius: 8px;
                padding: 4px 12px;
                background: rgba(0,0,0,.6);
                top: 4px;
            }
            html .item_video .new_video_icon {
                top: 47px;
                right: 6px;
                z-index: 3;
            }
            html .item_video .new_video_icon img {
                height: 66px;
            }
            html .item_video .save_to_icon {
                display: none;
            }

            html .item_video .playlist_on_video_list_s {
                height: auto;
                padding: 6px 8px;
            }

            html .item_video .playlist_on_video_list_s td {
                font-size: 28px;
            }

            html .item_video .playlist_on_video_list_s .povl_icon_s {
                width: 40px
                height: 40px;
            }

            html .item_video .playlist_on_video_list_s .povl_icon_s img {
                width: 40px;
                height: 40px;
                margin-right: 10px
            }

            html .item_video .video_list_discount_line_tile_in {
                font-size: 24px;
                font-weight: bold;
                text-align: right;
                padding-right: 30px;
            }


            html .item_video .video_title {
                font-size: 36px;
            }
            html .item_video .video_title .video_fav_num {
                top: -40px;
                left: 3px;
                font-size: 39px;
                text-shadow: 2px 2px 12px #ff6161;
                background: none;
            }
            html .item_video .video_txt_float {
                margin: 30px 4px 10px 8px;
                width: calc(50% - 12px);
            }
            html .item_video .video_txt_float p {
                font-size: 34px !important;
                width: auto;
            }
            html .item_video .go_to_support_btn {
                margin-bottom: -16px;
                margin-top: 15px;
                font-size: 30px;
                border-radius: 8px;
            }
            /* 竖排列表 */
            html .video_vertical_list {
                margin: 0px;
            }
            html .video_vertical_list .video_list_box {
                padding: 50px 25px;
                display: flex;
                flex-wrap: wrap;
                border-width: 5px;
                background: #111;
                width: 1140px;
                margin: 0 auto;
                margin-bottom: 40px;
                border-radius: 30px;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block {
                width: 100% !important;
                min-height: 410px !important;
                margin-right: 0 !important;
                flex-shrink: 0;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_purchase_del_btn {
                display: none;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_list_discount_line_tile_not_yet {
                font-size: 32px !important;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_list_thumbnail_new_outside_for_list .video_list_thumbnail_new {
                width: 76px;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_list_thumbnail_fav_for_list {
                font-size: 45px;
                padding: 0px 15px;
                border-radius: 0px 0 0 15px;
                color: #ff9595;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_list_discount_line_tile.video_list_discount_line_tile_in {
                display: none;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block .video_list_thumbnail {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block div[style="position: relative;margin-top: 0px;"] {
                display: flex;
                flex-direction: column;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block div[style="position: relative;margin-top: 0px;"] > div {
                float: unset !important;
                width: unset !important;
                height: unset !important;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block div[style="position: relative;margin-top: 0px;"] img {
                width: 100% !important;
                height: auto !important;
                margin-top: 15px;
                object-fit: cover;
            }

            html .video_vertical_list .video_list_box .video_list_thumbnail_block div[style="position: relative;margin-top: 0px;"] img[src=""] {
                display: none;
            }


            html .video_vertical_list .video_list_box > div:nth-child(2) {
                flex: 1;
                width: auto !important;
                float: unset !important;
                word-break: break-word;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_title {
                font-size: 42px;
                padding: 15px 0;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_title a {
                text-decoration: none;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_content div[style="background-color: #e8e8e8; margin: 4px; padding: 4px 8px; color:#d7003a; font-size:12px;"] {
                font-size: 32px !important;
                background-color: #3a3a3a !important;
                width: fit-content;
                padding: 15px 20px !important;
                border-radius: 20px;
                color: #abaa1c !important;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_content .video_list_content_text {
                font-size: 42px;
                line-height: 1.6;
                margin-bottom: 30px;
                text-decoration: none;
                color: #b8b8b8 !important;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip_s {
                font-size: 40px;
                margin-right: 20px;
                height: auto;
                padding: 20px;
                background: #333;
                border-radius: 10px;
                margin-top: 30px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip_s:nth-child(2) {
                display: none;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip_s .video_list_tip_vcenter > div {
                width: 30px !important;
                height: 30px !important;
                vertical-align: unset !important;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip_s img {
                height: 30px !important;
                vertical-align: unset !important;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_content .go_to_support_btn {
                font-size: 32px;
                padding: 25px 20px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip {
                display: flex;
                justify-content: space-between;
                height: auto;
                align-items: center;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip {
                display: flex;
                justify-content: start;
                height: auto;
                align-items: center;
                margin-top: 16px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip > div:nth-child(1) {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 40px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip > div:nth-child(1) .video_list_avator_bg {
                width: 125px;
                height: 125px;
                border-radius: 25px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip > div:nth-child(1) .video_list_tip_name {
                font-size: 32px;
                margin-top: 10px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip .video_list_tip_s1 {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 200px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip .video_list_tip_s1 > div:nth-child(1) {
                transform: scale(2);
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip .video_list_tip_s1 > div:nth-child(2) {
                font-size: 30px;
                margin-top: 20px;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip .video_list_tip_s1.interactToUserBlock {
                display: none;
            }
            html .video_vertical_list .video_list_box > div:nth-child(2) .video_list_tip > div[style="clear: both;"] {
                display: none;
            }
        }
    `)
    // 竖排列表 Todo...
    const videoVerticalList = document.querySelector('.video_vertical_list')
    if (videoVerticalList) {
        const videoBox = Array.from(videoVerticalList.querySelectorAll('.video_list_box'))
        if (videoBox && videoBox.length) {
            videoBox.forEach(video => {
                const imageArea = Array.from(video.querySelectorAll('.video_list_thumbnail_block a > img'))
                imageArea.forEach(image => {
                    if (/\/mip/.test(image.src)) {
                        image.src = image.src.replace('/mip', '') // 推荐视频预览图放大
                    }
                })
            })
        }
    }

    // 筛选
    GM_addStyle(`
        @media screen and (max-device-width: 600px) {
            html div:has(> div.pages), html .container_above_limited_width {
                position: sticky;
                bottom: 0;
                background-color: #1d1d1e;
                padding-bottom: calc(12px + constant(safe-area-inset-bottom)) !important;
                padding-bottom: calc(12px + env(safe-area-inset-bottom)) !important;
            }
            html .pages {
                font-size: 40px !important;
                height: auto;
                line-height: unset;
                margin-bottom: 15px;
            }
            html .pages a, html .pages strong {
                margin: 0;
                padding: 2px 15px;
                text-decoration: none!important;
                margin-top: 22px;
                display: inline-block;
                border-radius: 10px;
            }
            html .pages .next {
                padding: 2px 18px;
                text-decoration: none!important;
            }
        }
    `)
    // 登录
    GM_addStyle(`
        @media screen and (max-device-width: 600px) {
            #login_panel .login_form_table input {
                height: 123px;
                line-height: 123px;
                font-size: 60px !important;
            }
        }
    `)
    /*********************************************************** */
    // 视频播放页
    GM_addStyle(`
        @media screen and (max-device-width: 600px) {
            html div.videoTitle {
                display: none;
            }
            html .column_table_on_video_detail_page div.line_box {
                display: none;
            }
            /** 上传作者信息 ******************************************************************/
            html div:has(>div>div[alt="uploader"]) {
                display: flex;
                flex-direction: column;
                padding: 20px 40px;
                background: #333;
                margin-top: 0 !important;
                position: relative;
            }
            html div:has(>div[alt="uploader"]) {
                width: auto !important;
                flex-grow: 1;
            }
            html div[alt="uploader"] {
                display: flex;
                width: 100%;
            }
            hteml div[alt="uploader"] > div:nth-child(1) {
                flex-shrink: 0;
            }
            html div[alt="uploader"] > div:nth-child(1) {
                font-size: 32px !important;
                width: 120px !important;
                height: 120px !important;
                border-radius: 60px !important;
                position: unset !important;
            }
            html div[alt="uploader"] > div:nth-child(1) div:has(>button.follow_btn_on_avatar) {
                width: auto !important;
                right: 40px !important;
                bottom: 20px !important;
            }
            html div[alt="uploader"] > div:nth-child(1) button.follow_btn_on_avatar {
                font-size: 30px;
                padding: 8px 20px;
                border-radius: 6px;
                background-color: #5f5f5f;
                border: none;
            }
            html div[alt="uploader"] > div:nth-child(2) {
                font-size: 32px !important;
                display: flex;
                align-items: center;
                flex: 1;
            }
            html div[alt="uploader"] > div:nth-child(2) > div:nth-child(1) {
                margin-left: 4px;
                flex: 1;
            }
            html div[alt="uploader"] > div:nth-child(2) > div:nth-child(2) {
                flex-shrink: 0;
            }
            html div[alt="uploader"] > div:nth-child(2) .userActionContainer {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            html div[alt="uploader"] > div:nth-child(2) .userActionContainer > div:nth-child(2) {
                font-size: 24px !important;
                text-align: center !important;
            }
            html div[alt="uploader"] > div:nth-child(2) .userActionContainer > div:nth-child(1) {
                transform: scale(1.8);
                margin: 8px 25px !important;
            }
            html div:has(>div>div[alt="uploader"]) > div:nth-child(2) {
                display: flex;
                width: 100% !important;
                font-size: 24px !important;
                align-items: center;
                border-bottom: none !important;
                border-top: 2px solid #666 !important;
                padding-bottom: 0px !important;
            }
            html div:has(>div>div[alt="uploader"]) > div:nth-child(2) > div {
                margin-right: 12px !important;
            }
            html div:has(>div>div[alt="uploader"]) > div:nth-child(2) > div:nth-child(1) button {
                font-size: 20px !important;
                padding: 12px 30px !important;
                border-radius: 11px !important;;
                background: #131313 !important;;
                outline: none;
                border: none;
            }
            html .descript_content {
                font-size: 40px;
                padding: 20px 40px;
                word-break: break-word;
            }
            html .descript_title {
                font-size: 36px;
                padding: 20px 40px;
                word-break: break-word;
                line-height: 1.5;
                border-top: 1px solid #666;
            }
            html div[alt="tag"] {
                padding: 0 40px !important;
                margin-top: 40px;
            }
            html div[alt="tag"] .video_tag {
                font-size: 32px !important;
                margin-right: 18px !important;
                margin-bottom: 20px;
                border-radius: 16px;
            }
            html #comment_top {
                display: none;
            }
            html .comment_body {
                margin: 40px;
                padding: 20px;
                background: #333;
                border-radius: 18px;
            }
            html .comment_body {
                margin: 40px;
                padding: 28px;
                background: #333;
                border-radius: 40px;
            }
            html .comment_body .comment_item {
                font-size: 30px;
                display: flex;
                width: auto !important;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 7px;
                margin-right: 0;
                padding: 10px 20px;
            }
            html .comment_body .comment_item .comment_username {
                border-radius: 0 10px 10px 0px;
            }
            html .comment_body .comment_submit {
                width: 100%;
                display: flex;
                margin-top: 16px;
            }
            html .comment_body .comment_submit .comment_submit_input {
                width: 100%;
            }
            html .comment_body .comment_submit .comment_submit_input input {
                width: 100% !important;
                font-size: 36px !important;
                line-height: 58px !important;
                border-radius: 30px 0 0 30px !important;
                text-indent: 2rem !important;
            }
            html .comment_body .comment_submit .comment_submit_btn {
                flex-shrink: 0;
                width: auto;
            }
            html .comment_body .comment_submit .comment_submit_btn .green-btn-wraper span,
            html .comment_body .comment_submit .comment_submit_btn .green-btn span {
                font-size: 26px !important;
                line-height: 60px !important;
            }
            html .comment_body .comment_submit .comment_submit_btn .green-btn-wraper,
            html .comment_body .comment_submit .comment_submit_btn .green-btn {
                background: #8d8d8d;
                height: 60px;
                border-radius: 0px 30px 30px 0px !important;
                color: #ffffff;
                font-weight: normal;
            }
            html button#fav_button {
                line-height: 1.5;
                padding: 13px 0;
                border: 0;
                box-shadow: inset 0 0 18px -2px #ad7f7f;
            }
            html .video_baseinfo {
                background: #8e8e8e;
            }
            html #cdn_server_flag_phone {
                display: flex;
                overflow-x: scroll;
            }
            html #cdn_server_flag_phone .preview-picture {
                flex-shrink: 0;
            }
            html .preview-picture-slide img {
                height: 640px;
            }
            /*** 相关视频推荐 ******************************************/
            html div.comment_top:has(+div[alt="Related Video"]) {
                display: none;
            }
            html div[alt="Related Video"] {
                display: flex;
                flex-direction: column;
                background-color: #000000;
            }
            html div[alt="Related Video"] > div {
                width: auto !important;
                padding: 30px 40px;
                margin: 15px 0 0 0 !important;
                box-sizing: border-box;
                background: #1d1d1e;
            }
            html div[alt="Related Video"] > div .video_related_list_item {
                margin-bottom: 0;
                display: flex;
            }
            html div[alt="Related Video"] > div .video_related_list_item:hover {
                background: none;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(1) {
                width: 365px !important;
                min-height: 410px !important;
                margin-right: 20px !important;
                flex-shrink: 0;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(1) > img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(1) > div.vrli_duration {
                font-size: 32px;
                padding: 6px 15px;
                border-radius: 11px;
                background-color: rgba(0,0,0,.7);
                right: 13px !important;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) {
                flex: 1;
                width: 100% !important;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) .vrli_title {
                text-overflow: unset !important;
                overflow: unset !important;
                white-space: break-spaces !important;
                font-size: 34px !important;
                padding: 0 !important;
                margin-bottom: 15px;
                font-weight: normal;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) > div:nth-child(2) > div {
                font-size: 28px !important;
                width: auto !important;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) {
                min-height: unset !important;
                margin-bottom: 20px !important;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) {
                display: none;
            }
            html div[alt="Related Video"] > div .video_related_list_item > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) {
                margin-right: 50px;
            }

            /** 小说 */
            html .fiction_list_item_container {
                border-bottom: 5px dashed #333;
                background-color: #111;
                border-radius: 30px;
                padding: 40px;
            }
            html .fli_cover_picture {
                width: 40%;
                height: 400px;
            }
            html .fli_cover_picture .fiction_fav_num {
                font-size: 34px;
                padding: 8px 10px;
                height: auto;
                line-height: 40px;
                border-radius: 0px 0 0 10px;
                color: #ff9595;
            }
            html .fli_text_container {
                height: auto;
                width: 100%;
            }
            html .fli_text_container .fli_title {
                font-size: 45px;
                font-weight: bold;
                padding: 35px 0;
                white-space: normal;
                height: auto;
                line-height: 52px;
            }
            html .fli_text_container .fli_brief {
                font-size: 36px;
                margin-bottom: 12px;
            }
            html .fli_text_container .fli_summary {
                font-size: 42px;
                line-height: 65px;
                height: auto;
                padding: 20px 0;
            }
            html .fli_text_container .fli_summary a {
                text-decoration: none;
                color: #acacac !important;
            }
            html .fli_text_container div[style="background-color: #e8e8e8; margin: 4px; padding: 4px 8px; color:#d7003a; font-size:12px;"] {
                font-size: 32px !important;
                background-color: #3a3a3a !important;
                width: fit-content;
                padding: 15px 20px !important;
                border-radius: 20px;
                color: #abaa1c !important;
            }
            html .fli_text_container .fli_new_chapters {
                font-size: 34px;
                background-color: #111;
                padding: 10px;
                height: auto;
                padding: 20px 10px;
                margin-bottom: 20px;
            }
            html .fli_text_container .fli_new_chapters .fli_new_chapter_item {
                font-size: 34px;
                padding: 10px;
                width: auto;
                height: auto;
            }
            html .fli_text_container .fli_price_summary, html .fli_text_container .fli_purchase_info {
                font-size: 32px;
                line-height: 45px;
                margin-bottom: 20px;
            }
            /** 小说详情 */
            html #container_with_limited_width .fd_chapter_list_container .fd_chapter_item {
                font-size: 40px;
                padding: 40px 10px;
                height: auto;
            }
            html #container_with_limited_width .fd_chapter_list_container .fd_chapter_item .fd_chapter_title {
                width: 69%;
            }
            html #container_with_limited_width .fd_chapter_list_container .fd_chapter_item .fd_chapter_word_count {
                width: 16%;
            }
            html #container_with_limited_width .cd_navi_container {
                font-size: 42px;
                padding: 20px 0;
            }
            html #container_with_limited_width .cd_main_container .cdm_content {
                font-size: 60px;
                line-height: 1.5;
                margin-top: 90px;
            }
            html #container_with_limited_width .cd_main_container .cdm_title {
                font-size: 70px;
                font-weight: bold;
                line-height: 2;
                height: auto;
            }
            html #container_with_limited_width .cd_main_container .cdm_info {
                font-size: 28px;
                line-height: 1.8;
                margin-top: 30px;
            }
            html #container_with_limited_width .cd_chapter_navi_container {
                height: auto;
            }
            html #container_with_limited_width .cd_chapter_navi_container .cd_chapter_navi_item {
                font-size: 42px;
                padding: 20px;
                height: auto;
            }
        }
    `)
})();