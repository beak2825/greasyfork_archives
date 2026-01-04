// ==UserScript==
// @name Booru+
// @namespace -
// @version 1.0.4
// @description adds new useful features for booru-like websites, such as: ad block, back to top button, fast image view etc. works for rule34.xxx, e621.net and more.
// @author NotYou
// @match *://rule34.xxx/*
// @match *://e621.net/*
// @match *://e926.net/*
// @match *://tbib.org/*
// @match *://gelbooru.com/*
// @match *://danbooru.donmai.us/*
// @match *://hypnohub.net/*
// @match *://xbooru.com/*
// @match *://safebooru.org/*
// @run-at document-end
// @compatible Firefox Version 78
// @compatible Chrome Version 88
// @compatible Edge Version 88
// @compatible Opera Version 74
// @compatible Safari Version 14
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/456048/Booru%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/456048/Booru%2B.meta.js
// ==/UserScript==

(function() {
    let adBlockEnabled = 'true' // change to 'false' if you want to support original website authors

    // Image View

    let movementSensitivity = 1
    let scaleSensitivity = 1

    // Selectors

    let contentSelector = location.host === 'xbooru.com' ? 'html > body' : '#content, #static-index, #page, #container'
    let firstPosts = ':where(.thumb, article.post-preview, .thumbnail-preview):not(:where(:nth-child(3) ~ *))'
    let thumbSelector = '.thumb img:not([style*="border"]), .post-preview:not([data-tags*="video"]) img, .thumbnail-preview img'
    let navigationSelector = '#subnavbar, #container header, #nav > :last-child'
    let tagSelector = '[class*="tag-type"] a:not([href*="://"]), .search-tag'
    let paginatorSelector = '#paginator, .paginator'
    let pagesSelector = '#paginator a, [class*="tag"] a:nth-last-child(2), .paginator .numbered-page a, .arrow a'
    let postListSelector = '#post-list, #c-posts, .thumbnail-container'

    // Styling

    let accentColor = (function() {
        switch(location.host) {
            case 'rule34.xxx':
                return 'rgb(147, 195, 147)'
            case 'e621.net':
            case 'e926.net':
                return 'rgb(21, 47, 86)'
            case 'tbib.org':
            case 'gelbooru.com':
            case 'danbooru.donmai.us':
            case 'safebooru.org':
                return 'rgb(7, 115, 251)'
            case 'hypnohub.net':
                return 'rgb(238, 136, 135)'
            case 'xbooru.com':
                return 'rgb(122, 89, 30)'
            default:
                return 'rgb(0, 0, 0)'
        }
    })()

    let css = `
    :root {
      --accent: ${accentColor};
    }

    ${strToBool(adBlockEnabled) ? `
    /* rule34.xxx */
    #post-list > :not(:where(.content, .sidebar)),
    [src*="${location.origin}/images/"],
    [href*="kanako.store"],
    #navbar > :nth-last-child(3),
    #paginator ~ .horizontalFlexWithMargins,

    /* e621.net / e926.net */

    #ad-leaderboard,
    .adzone,

    /* tbib.org / xbooru.com */

    iframe[width][height][frameborder="0"],

    /* gelbooru.org */

    .headerAd,
    .exo_wrapper,
    .exo-native-widget-outer-container,
    .exo-native-widget,
    .footerAd, .footerAd2,
    main .mainBodyPadding > :where(:first-child, :last-child),

    /* hypnohub.net */

    #content #right-col .flexi > :not([id]),
    #post-list .content > span[data-nosnippet]

    {
      display: none !important;
    }` : ''}

    .loading::before {
      content: '';
      width: 50px;
      height: 50px;
      display: block;
      border-radius: 50%;
      border: 10px solid rgb(255, 255, 255);
      border-top: var(--accent) 10px solid;
      position: fixed;
      animation: 1s infinite loading-ani;
      left: calc(50% - 25px);
      top: calc(50% - 25px);
      z-index: 2147483646;
    }

    .loading {
      opacity: 0.65;
    }

    #backtotop {
      position: fixed;
      right: 10px;
      bottom: 10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, .35);
      transition: .3s;
    }

    #backtotop {
      cursor: pointer;
    }

    #backtotop::before {
      transform: rotate(45deg);
      left: 20px;
      top: 20px;
    }

    #backtotop::after {
      transform: rotate(-45deg);
      left: 10px;
      top: 13px;
    }

    #backtotop::after, #backtotop::before {
      content: '';
      display: block;
      width: 20px;
      height: 8px;
      background-color: var(--accent);
      position: relative;
      border-radius: 10px;
    }

    .image-view {
      position: fixed;
      left: 0;
      top: 0;
      transition: .5s opacity;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, .7);
      z-index: 100;
    }

    .image-view img {
      height: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, .1);
    }

    .image-view div {
      position: fixed;
      right: 5px;
      top: 5px;
      width: 50px;
      height: 50px;
      opacity: .5;
      transition: .2s opacity;
      background: none;
    }

    .image-view div:hover {
      opacity: 1;
    }

    .image-view div::before, .image-view div::after {
      content: '';
      display: block;
      width: 100%;
      height: 4px;
      background-color: rgb(255, 255, 255);
      position: absolute;
      top: calc(50% - 5px);
      border-radius: 10px;
    }

    .image-view div::before {
      transform: rotate(45deg);
    }

    .image-view div::after {
      transform: rotate(-45deg);
    }

    .blockquote {
      padding-left: 15px;
      border-left: 5px solid var(--accent);
      border-radius: 2px;
    }

    #tag-view {
      position: absolute;
      z-index: 50;
      background-color: var(--accent);
      border-radius: 10px;
      padding-top: 20px;
      left: 0;
      top: 0;
      display: flex;
    }

    #tag-view::before {
      content: '';
      display: block;
      position: absolute;
      top: -8px;
      z-index: 40;
      border-right: transparent 15px;
      border-top: transparent 15px;
      border-left: var(--accent) 15px;
      border-bottom: var(--accent) 7.5px;
      border-style: solid;
    }

    .error-notification-box {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2147483647;
      background: rgba(0, 0, 0, .5);
    }

    .error-notification-body {
      width: 70%;
      height: 40%;
      background: var(--accent);
      position: absolute;
      padding: 1em;
      left: calc(15% - 1em); /* 15% = 100% - 70% / 2 */
      top: calc(30% - 1em); /* 30% = 100% - 40% / 2 */
      border-radius: 4px;
    }

    .error-notification-body h1 {
      display: block;
      width: 100%;
    }

    @keyframes loading-ani {
      0% { rotate: 0deg }
      100% { rotate: 360deg }
    }`

    let style = document.createElement('style')
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)

    init(location.search.includes('s=view') && document.querySelector(pagesSelector))

    window.addEventListener('popstate', () => {
        replaceBody(location.href)
    })

    function init(isComms) {
        let postList = document.querySelector(postListSelector)
        let content = document.querySelector(contentSelector)
        let tags = document.querySelectorAll(tagSelector)
        let enterTimeout
        let show = true

        if(tags.length) {
            let tagView = document.createElement('div')
            tagView.id = 'tag-view'

            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i]

                tag.addEventListener('mouseenter', () => {
                    show = true

                    enterTimeout = setTimeout(() => {
                        let url = tag.href

                        getDocument(url).then(doc => {
                            if(show) {
                                let thumbs = doc.querySelectorAll(firstPosts)
                                let result = ''

                                for (let j = 0; j < thumbs.length; j++) {
                                    let thumb = thumbs[j].outerHTML

                                    result += thumb
                                }

                                tagView.innerHTML = result

                                setVisibility(1, tagView)
                                tagView.style.left = tag.offsetLeft + 'px'
                                tagView.style.top = tag.offsetTop + tag.offsetHeight + 8 + 'px'
                            }
                        })
                    }, 1e3)
                })

                tag.addEventListener('mouseleave', () => {
                    setVisibility(0, tagView)
                    clearTimeout(enterTimeout)
                    show = false
                })
            }

            setVisibility(0, tagView)
            content.appendChild(tagView)
        }

        if((location.search.includes('s=list') || matches(/\/posts[^\/]/)) || postList) {
            let searchForm = document.querySelector('form[action*="search"]')

            if(searchForm) {
                searchForm.addEventListener('submit', e => {
                    e.preventDefault()
                    let url = location.origin + '/index.php?page=post&s=list&tags=' + searchForm.querySelector('input[name="tags"]').value.replace(/\s/g, '+')
                    replaceBody(url)
                })
            }

            if(postList) {
                fastView()
            }

            function fastView() {
                let fastViewEl = document.createElement('div')
                let f_img = document.createElement('img')
                let f_close = document.createElement('div')

                fastViewEl.className = 'image-view'
                setVisibility(0, fastViewEl)

                fastViewEl.appendChild(f_img)
                fastViewEl.appendChild(f_close)

                fastViewEl.addEventListener('contextmenu', e => {
                    if(e.target !== f_img) {
                        e.preventDefault()
                    }
                })

                postList.addEventListener('contextmenu', e => {
                    if(e.target.matches(thumbSelector)) {
                        e.preventDefault()
                    }
                })

                postList.addEventListener('auxclick', e => {
                    if(e.button === 2 && e.which === 3) {
                        e.preventDefault()

                        let image = e.target

                        if(image.matches(thumbSelector)) {
                            setVisibility(1, fastViewEl)

                            getDocument(image.closest('a').href).then(doc => {
                                try {
                                    let _image = doc.querySelector('#image')

                                    f_img.src = _image.poster || _image.src
                                } catch(_) {
                                    notifyError('cannot get access to image')
                                }
                            })

                            f_img.addEventListener('load', () => {
                                f_img.style.left = `calc(50% - ${f_img.offsetWidth / 2}px)`

                                let scale = 1
                                let x = 0, y = 0
                                let reTranslate = /translate\(.*?\)/
                                let reScale = /scale\(.*?\)/
                                let _y = window.pageYOffset

                                f_img.addEventListener('mousedown', e => {
                                    e.preventDefault()
                                    window.addEventListener('mousemove', onMouseMove)
                                })

                                window.addEventListener('mouseup', () => {
                                    window.removeEventListener('mousemove', onMouseMove)
                                })

                                f_img.addEventListener('wheel', e => {
                                    window.scrollTo(window.pageXOffset, _y)
                                    _y = window.pageYOffset

                                    scale = convert(scale, 0.5, 5, 0.1 * scaleSensitivity) // scale - current; 0.5 - minimal; 5 - maximal; 0.1 - difference;

                                    setTransform(reScale, `scale(${scale})`)

                                    function convert(n, min, max, diff) {
                                        return Math.max(min, Math.min(max, (n + (e.deltaY < 0 ? diff : (diff * -1)))))
                                    }
                                })

                                function onMouseMove(e) {
                                    x += convert(e.movementX)
                                    y += convert(e.movementY)

                                    setTransform(reTranslate, `translate(${x}px, ${y}px)`)

                                    function convert(value) {
                                        return value / scale * movementSensitivity
                                    }
                                }

                                function setTransform(re, prop) {
                                    f_img.style.transform = f_img.style.transform.replace(re, prop)
                                }
                            })
                        }
                    }
                })

                let defaultFImgStyle = 'scale(1) translate(0, 0)'

                fastViewEl.addEventListener('click', e => {
                    if(e.target.tagName.toLowerCase() === 'div') {
                        setVisibility(0, fastViewEl)
                        f_img.style.transform = defaultFImgStyle
                        f_img.removeAttribute('src')
                    }
                })

                f_img.style.transform = defaultFImgStyle

                content.appendChild(fastViewEl)
            }
        }

        if(location.search.includes('s=view')) {
            let rightCol = document.querySelector('#right-col,  #a-show #content')
            let similarPosts = document.createElement('div')
            let _tags = Array.from(tags).filter((_, i) => i % 2 !== 0)
            let amoutOfTags = Math.floor(Math.sqrt(_tags.length))
            let tries = 0

            if(rightCol) {
                similarPosts.innerHTML = '<h2>You may also like:</h2>'

                rightCol.append(similarPosts)

                getSimilar()

                function getSimilar() {
                    let _continue = true
                    let searchUrl = location.host === 'danbooru.donmai.us' ? location.origin + '/posts?tags=' : location.origin + '/index.php?page=post&s=list&tags='
                    let __tags = 0

                    _tags.forEach(e => {
                        if(Math.floor(Math.random() * 2) === 1 && _continue) {
                            searchUrl += (__tags === 0 ? '' : '+') + e.textContent.replace(/\s/g, '_')

                            __tags++

                            if(__tags >= amoutOfTags) {
                                _continue = false
                            }
                        }
                    })

                    getDocument(searchUrl).then(doc => {
                        let posts = doc.querySelectorAll(firstPosts+`:not([id*="${new URLSearchParams(location.search).get('id')}"])`)
                        let _posts = ''

                        tries++

                        posts.forEach(e => {
                            _posts += e.innerHTML
                        })

                        similarPosts.innerHTML += _posts

                        if(posts === '' && tries < 3) {
                            getSimilar()
                        } else if (_posts === '') {
                            similarPosts.innerHTML = '<h1>Not Found Similar Posts</h1>'
                        }
                    })
                }
            }

            let commentList = document.querySelector('#comment-list, .mainBodyPadding')

            if(commentList && commentList.children.length > 1) {
                let comments = commentList.querySelectorAll('br ~ [id^="c"], h2 + br ~ div')

                for (let i = 0; i < comments.length; i++) {
                    let comment = comments[i]

                    if(comment.matches(':not([style])')) {
                        let commentText = comment.querySelector('.col2, .comment-right-col') || comment.querySelector('.commentBody br + br').nextSibling
                        let commentActualText = commentText.textContent.replace(/\\n/g, '').trim()
                        let prevComment = comment
                        let j = 0

                        if(commentActualText.startsWith('^')) {
                            let col2 = prevComment.querySelector('.col2')

                            while(commentActualText[j++] === '^') {
                                prevComment = prevComment.previousElementSibling
                            }

                            col2 = prevComment.querySelector('.col2')

                            if(col2) {
                                commentText.innerHTML = `<div class="blockquote">${col2.innerHTML}</div>` + commentText.textContent.replace(/\^/g, '')
                            }
                        }
                    }
                }
            }
        }

        backToTop()

        function matches(re) {
            return re.test(location.href)
        }

        function backToTop() {
            let backtotop = document.createElement('div')
            backtotop.id = 'backtotop'
            setVisibility(0, backtotop)

            window.addEventListener('scroll', () => {
                if(window.pageYOffset > 0) {
                    setVisibility(1, backtotop)
                } else {
                    setVisibility(0, backtotop)
                }
            })

            backtotop.addEventListener('click', () => {
                document.body.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                })
            })

            content.appendChild(backtotop)
        }

        function setVisibility(n, el) {
            if(n === 1) {
                el.style.opacity = '1'
                el.style.pointerEvents = 'auto'
            } else {
                el.style.opacity = '0'
                el.style.pointerEvents = 'none'
            }
        }

        initPagesEvs(isComms)
    }

    function getStyles(el) {
        return window.getComputedStyle(el)
    }

    function initPagesEvs(isComms) {
        let pages = document.querySelectorAll(pagesSelector)

        for (let i = 0; i < pages.length; i++) {
            pages[i].onclick = e => {
                e.preventDefault()

                let target = e.target
                let url = target.getAttribute('onclick') && isComms ? location.pathname+target.getAttribute('onclick').match(/'(.*?)'/)[1] : target.href

                target.onclick = null

                replaceBody(url, isComms)
            }
        }
    }

    function replaceBody(url, isComms) {
        let content = document.querySelector(contentSelector)

        if(content) {
            content.classList.add('loading')
        }

        getDocument(url).then(doc => {
            let htmlEl = document.documentElement
            let scrollToEl = isComms ? document.querySelector('.image-sublinks, .response-list') ?? htmlEl : htmlEl
            let hiddenImages = doc.querySelectorAll('img[data-cfsrc]')

            if(hiddenImages) {
                for (let i = 0; i < hiddenImages.length; i++) {
                    let hiddenImage = hiddenImages[i]

                    hiddenImage.style.cssText = ''
                    hiddenImage.src = hiddenImage.dataset.cfsrc
                }
            }

            content.innerHTML = doc.querySelector(contentSelector).innerHTML
            scrollToEl.scrollIntoView()
            content.classList.remove('loading')

            history.pushState('', '', '?'+url.split('?')[1])
            document.title = doc.title

            let autocomplete = window.autocomplete_setup

            if(autocomplete) {
                autocomplete()
            }

            let paginator = document.querySelector(paginatorSelector)
            let _paginator = doc.querySelector(paginatorSelector)

            if(paginator) {
                paginator.innerHTML = (_paginator || paginator).innerHTML
            }

            init(isComms)
        }).catch(expection => {
            let timeout = 1e4

            notifyError(expection, timeout)

            setTimeout(() => {
                location.replace(url)
            }, timeout)
        })
    }

    function notifyError(body, time) {
        let notify = document.createElement('div')
        let notifBody = document.createElement('div')

        notify.className = 'error-notification-box'
        notifBody.className = 'error-notification-body'

        notifBody.innerHTML = '<h1>Rule34+</h1>Hey! Looks like you just got error, probably that\'s reason: "' + body + '"!, you got do a report about problem <a target="_blank" href="//greasyfork.org/scripts/456048/feedback">here</a>.'

        if(time) {
            notifBody.innerHTML += ' You will be redirected in ' + time / 1e3 + ' seconds.'
        }

        notify.appendChild(notifBody)
        document.body.appendChild(notify)
    }

    function getDocument(url) {
        return fetch(url).then(r => r.text()).then(c => new DOMParser().parseFromString(c, 'text/html'))
    }

    function strToBool(str) {
        return str === 'fasle' ? false : true
    }
})()











