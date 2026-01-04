// ==UserScript==
// @name        DLSite Links+
// @namespace   Loli-A-Best
// @include     *://boards.4chan.org/vg/thread/*
// @include     *://boards.4chan.org/h/thread/*
// @include     *://boards.4chan.org/*/thread/*
// @include     *://boards.4channel.org/vg/thread/*
// @include     *://boards.4channel.org/h/thread/*
// @include     *://boards.4channel.org/*/thread/*
// @include     *://arch.b4k.co/*/thread/*
// @include     *://ipfs.io/ipfs/*
// @include     *://ipfs.infura.io/ipfs/*
// @include     *://yuki.la/vg/*
// @version     1.12z
// @description Provide links from RJ, RE, VJ, DMM, VG and RG codes as well as providing thumbnails for community distributed files.
// @icon        data:image/png;base64,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
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/424134/DLSite%20Links%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/424134/DLSite%20Links%2B.meta.js
// ==/UserScript==
(() => {
    'use strict'
    const d = document
    const Chan = {
        DMMCode: /(?:(?:dmm|www|https?)[^>\s]+)?(?:cid=)?(?:d_|DMM)(\d{6})/gi,
        RJCode: /((?:(?:dlsite|www|http|maniax)[^>\s]+)?[rv][jea]a?((\d{3})\d{3})(?:\.html)?)/gi,
        RGBlog: /(http:\/\/\S*b\.dlsite\.net\/(?:rg\d{5}\/)?archives\/\d{3,8}\.html)/gi,
        RGCirc: /(?:(?:http|www)?\S*com\S*|^|\s)[rv]g(\d{5})(?:\.html)?/gi,
        // 4chan-X specific variables
        fourchanxLinkifyRegex: /((https?|mailto|git|magnet|ftp|irc):([a-z\d%\/?])|([-a-z\d]+[.])+(aero|asia|biz|cat|com|coop|dance|info|int|jobs|mobi|moe|museum|name|net|org|post|pro|tel|travel|xxx|xyz|edu|gov|mil|[a-z]{2})([:\/]|(?![^\s"]))|[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}|[-\w\d.@]+@[a-z\d.-]+\.[a-z\d])/gi,
        thread: d.querySelector('.thread'),
        games: [],
        linkify: false,
        fourchanx: false,
        oneechan: false,
        prev: d.createElement('img'),
        container: d.createElement('div'),
        content: d.createElement('div'),
        toggle: d.createElement('a'),
        CSS: {
            hgg2dCSS: ('' +
                '#preview { display: block; position: fixed; top: 0; padding: 0; margin: 0; z-index: 8;}\n' +
                '.previewBar { position: fixed; right: 3em; width: 6.5em; bottom: 12em; z-index: 6; padding: 0; margin: 0; max-height: 35%; overflow-y: auto; overflow-x: hidden; }\n' +
                '.previewBar > div { padding: 0; margin: 0; width: 100%; }\n' +
                '.previewBar > div > a { display: block; }\n' +
                '.previewBarToggle { float: right; }\n' +
                '.previewBarToggle::before { content: "["; color: #000 !important; }\n' +
                '.previewBarToggle::after { content: "]"; color: #000 !important; }\n' +
                '.hgg2dOverlay { background: rgba(0,0,0,0.8); display: none; height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 7; }\n' +
                '.hgg2dBox { position: fixed; top: 20%; left: 20%; width:50%; padding: 2em; border: 1em solid #34345C; overflow: hidden; }\n' +
                '.hgg2dOverlay:target { outline:none; display: block; }\n' +
                '.hgg2dBox table { display: block; }\n' +
                '.hgg2dTut { float: right; margin-right: 5px; }\n' +
                '.hgg2dTut::before { content: "["; color: #000 !important; }\n' +
                '.hgg2dTut::after { content: "]"; color: #000 !important; }'),
            init: () => {
                const style = d.createElement('style')
                style.appendChild(d.createTextNode(Chan.CSS.hgg2dCSS))
                d.head.appendChild(style)
            }
        },
        Firstrun: {
            init: () => {
                const lightbox = d.createElement('div')
                const div = d.createElement('div')
                const close = d.createElement('a')
                const showTutorial = d.createElement('a')

                close.textContent = 'Click me to close'
                close.href = '#'
                close.style.fontWeight = 'bold'
                div.innerHTML = ('<div class="hgg2dBox">\n' +
                    ' <h2>Quicklink Script Tutorial</h2>\n' +
                    ' <hr>\n' +
                    ' <p>This script is designed to make browsing and sharing hentai games more comfy in /hgg*/ threads.</p>\n' +
                    ' <p>Syntax: The codes are parsed in the following ways.</p>\n' +
                    ' <table><tbody>\n' +
                    '     <tr>\n' +
                    '         <td>DLSite Releases:</td>\n' +
                    '         <td><a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/work/=/product_id/RJ146992" class="lewds">RJ146992</a> and <a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/work/=/product_id/RJ146992" class="lewds">https://www.dlsite.com/maniax/work/=/product_id/RJ146992</a></td>\n' +
                    '     </tr>\n' +
                    '     <tr>\n' +
                    '     <td></td><td><a rel="noreferrer" target="_blank" href="https://www.dlsite.com/pro/work/=/product_id/VJ010879" class="lewds">VJ010879</a> and <a rel="noreferrer" target="_blank" href="https://www.dlsite.com/pro/work/=/product_id/VJ010879" class="lewds">https://www.dlsite.com/pro/work/=/product_id/VJ010879</a> work for Professional works as well.</td>\n' +
                    '     </tr>\n' +
                    '     <tr>\n' +
                    '         <td>DLSite Announces:</td>\n' +
                    '         <td><a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/announce/=/product_id/RJ197797" class="lewds">RJA197797</a> and <a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/announce/=/product_id/RJ197797" class="lewds">RA197797</a> and <a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/announce/=/product_id/RJ197797" class="lewds">https://www.dlsite.com/maniax/announce/=/product_id/RJ197797</a></td>\n' +
                    '     </tr>\n' +
                    '     <tr>\n' +
                    '         <td>DLSite Circles:</td>\n' +
                    '         <td><a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/circle/profile/=/maker_id/RG11840" class="lewds">RG11840</a> and <a rel="noreferrer" target="_blank" href="https://www.dlsite.com/maniax/circle/profile/=/maker_id/RG11840" class="lewds">https://www.dlsite.com/maniax/circle/profile/=/maker_id/RG11840</a></td>\n' +
                    '     </tr>\n' +
                    '     <tr>\n' +
                    '         <td>DLSite Blogs:</td>\n' +
                    '         <td><a rel="noreferrer" target="_blank" href="http://b.dlsite.net/RG23067/">http://b.dlsite.net/RG23067/</a> Full URLs only, you may link to specific posts as well.</td>\n' +
                    '     </tr>\n' +
                    '     <tr>\n' +
                    '         <td>DMM Releases:</td>\n' +
                    '         <td><a rel="noreferrer" target="_blank" href="https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_107232/" class="lewds">DMM107232</a> and <a rel="noreferrer" target="_blank" href="https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_107232/" class="lewds">d_107232</a> and <a rel="noreferrer" target="_blank" href="https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_107232/" class="lewds">https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_107232/</a></td>\n' +
                    '     </tr>\n' +
                    ' </tbody></table>\n' +
                    ' <hr>\n' +
                    ' <p>Note that if you link using an RJ code rather than an RJA code the script will attempt to take you to a Releases page.\n' +
                    ' This is by design so that you have more control over where links are headed.</p>\n' +
                    '</div>')
                lightbox.id = 'hgg2dTutorial'
                lightbox.classList.add('hgg2dOverlay')
                lightbox.appendChild(div)
                div.firstElementChild.appendChild(close)
                div.firstElementChild.style.borderColor = window.getComputedStyle(d.body).backgroundColor;
                div.firstElementChild.style.backgroundColor = window.getComputedStyle(d.body).backgroundColor;
                d.body.appendChild(lightbox)
                if (!localStorage.getItem('hgg2dFirstrun')) {
                    d.location.href = d.location.href.split('#')[0] + '#hgg2dTutorial'
                    localStorage.setItem('hgg2dFirstrun', true)
                }
                showTutorial.classList.add('hgg2dTut')
                showTutorial.textContent = 'Quicklinks Tutorial'
                showTutorial.href = '#hgg2dTutorial'
                d.querySelector('.navLinks.desktop').appendChild(showTutorial)
            }
        },
        handlePrevError: e => {
            return (err) => {
                if (!e.target.origHref)
                    e.target.origHref = e.target.href
                // Change link if necessary
                if (e.numErrors == 1)
                    e.target.href = e.target.href.match(/announce/) != null ? e.target.href : e.target.href.replace(/work(.*)R(.\d+)/ig, 'announce$1R$2')
                else
                    e.target.href = e.target.origHref

                Chan.prev.style.visibility = 'hidden'
                Chan.prev.onerror = null

                // Try redoing the hover with the new link
                Chan.hover(e)
            }
        },
        // Check every post for if the linkify setting is toggled on shortcircuiting
        // when a definitive answer is found, else repeating
        checkForLinkify: () => {
            Chan.linkify = !!Chan.thread.querySelector('.linkify')
            if (Chan.linkify) return
            const posts = Array.from(Chan.thread.querySelectorAll('.postMessage'))
            for (let i = 0; i < posts.length; i++) {
                if (Chan.fourchanxLinkifyRegex.test(posts[i].textContent) && !!posts[i].querySelector('.linkify')) {
                    Chan.linkify = false
                    return
                }
            }
            if (!Chan.linkify) setTimeout(Chan.checkForLinkify, 3000)
        },
        // Reached threshold of saving lines by adding in a generic method
        createAnch: (text) => {
            const anch = d.createElement('a')
            anch.rel = 'noreferrer'
            anch.target = '_blank'
            anch.textContent = text
            return anch
        },
        // createX functions are called with the element, followed by each of its regex capture groups
        createBlog: (el, match) => {
            const anch = Chan.createAnch(match)
            anch.href = match
            return anch
        },
        createCirc: (el, match, code) => {
            const anch = Chan.createAnch(match)
            if (match.includes('RG')) {
                if (match.includes('ecchi-eng')) {
                    anch.href = `https://www.dlsite.com/ecchi-eng/circle/profile/=/maker_id/RG${code}`
                } else {
                    anch.href = `https://www.dlsite.com/maniax/circle/profile/=/maker_id/RG${code}`
                }
            } else {
                anch.href = `https://www.dlsite.com/pro/circle/profile/=/maker_id/VG${code}`
            }
            return anch
        },
        createDMM: (el, match, code) => {
            const anch = Chan.createAnch(match)
            anch.href = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_${code}`
            anch.classList.add('lewds')
            if (Chan.games.indexOf('DMM' + code) === -1) {
                Chan.games.push('DMM' + code)
                const text = d.createTextNode('DMM' + code)
                const node = anch.cloneNode()
                node.appendChild(text)
                Chan.content.appendChild(node)
            }
            return anch
        },
        createRJ: (el, match, text, code) => {
            const anch = Chan.createAnch(text)
            const pattern = 'https://www.dlsite.com/{0}/{1}/=/product_id/{2}{3}'
            let circleType = []
            let workType = ''
            if (text.includes('announce') || /[rv]j?a/i.test(text))
                workType = 'announce'
            else
                workType = 'work'
            if (text.includes('VJ'))
                circleType.push('pro', 'VJ')
            else if (text.includes('RE'))
                circleType.push('ecchi-eng', 'RE')
            else
                circleType.push('maniax', 'RJ')
            anch.href = pattern.format(circleType[0], workType, circleType[1], code)
            anch.classList.add('lewds')
            if (workType.includes('announce'))
                circleType[1] = circleType[1].replace('J', 'A')
            if (Chan.games.indexOf(circleType[1] + code) === -1) {
                Chan.games.push(circleType[1] + code)
                const text = d.createTextNode(circleType[1] + code)
                const node = anch.cloneNode()
                node.appendChild(text)
                Chan.content.appendChild(node)
            }
            return anch
        },
        hover: (e) => {
            const t = e.target.classList.contains('lewds') ? e.target : undefined
            if (!e.numErrors)
                e.numErrors = 0;
            if (t === undefined || e.numErrors > 2) {
                Chan.prev.style.visibility = 'hidden'
                Chan.prev.onerror = null
                return
            }

            const pattern = 'https://img.dlsite.jp/modpub/images2/{0}/{1}/{2}{3}000/{2}{4}{5}_img_main.jpg'
            const rect = e.target.getBoundingClientRect()
            // announce or work
            let pageType = []
            // doujin or pro
            let circleType = []
            if (e.target.href.includes('dlsite')) {
                const code = e.target.href.split('/product_id/')[1].substr(2, 6)
                if (e.target.href.includes('announce'))
                    pageType.push('ana', '_ana')
                else
                    pageType.push('work', '')
                if (e.target.href.includes('VJ'))
                    circleType.push('professional', 'VJ')
                else if (e.target.href.includes('RE'))
                    circleType.push('doujin', 'RE')
                else
                    circleType.push('doujin', 'RJ')

                e.numErrors++;
                Chan.prev.onerror = Chan.handlePrevError(e)
                if (e.numErrors == 3)
                    circleType[1] = 'RJ'
                let roundCode = parseInt(code.substr(0, 3))
                if (code % 1000 != 0)
                    roundCode++
                Chan.prev.src = pattern.format(pageType[0], circleType[0], circleType[1], Chan.padLeft(roundCode, 3), code, pageType[1]);
            } else if (e.target.href.includes('dmm.co')) {
                const code = e.target.href.split('cid=')[1].substr(0, 8)
                Chan.prev.src = `https://pics.dmm.co.jp/digital/game/${code}/${code}pr.jpg`
            }
            Chan.prev.style.visibility = ''
            Chan.prev.style.top = ((window.innerHeight - rect.top < 420) ? window.innerHeight - 435 : rect.top - 15) + 'px'
            Chan.prev.style.left = ((window.innerWidth - rect.left < 560) ? rect.left - 565 : rect.right + 5) + 'px'
        },
        // Alexander Dickson's replace text function with minor changes
        matchText: (node, regex, callback, excludeElements) => {
            excludeElements = excludeElements || ['a']
            var child = node.firstChild || -1
            while (child) {
                switch (child.nodeType) {
                    case 1:
                        if (excludeElements.includes(child.tagName.toLowerCase()))
                            break
                        Chan.matchText(child, regex, callback, excludeElements)
                        break
                    case 3:
                        let bk = 0
                        child.data.replace(regex, function (all) {
                            let args = [...arguments],
                                offset = args[args.length - 2],
                                newTextNode = child.splitText(offset + bk),
                                tag
                            bk -= child.data.length + all.length
                            newTextNode.data = newTextNode.data.substr(all.length)
                            tag = callback.apply(window, [child].concat(args))
                            child.parentNode.insertBefore(tag, newTextNode)
                            child = newTextNode
                        })
                        regex.lastIndex = 0
                        break
                }
                child = child.nextSibling
            }
            return node
        },
        // Hide and unload src to prevent it looking like two codes are the same game until the new image loads.
        out: (e) => {
            const t = e.target.classList.contains('lewds') ? e.target : undefined
            if (t === undefined) return
            Chan.prev.style.visibility = 'hidden'
            Chan.prev.src = ''
        },
        // Cached padLeft because input will always be 0-2 characters in our use case
        padLeft: (str, len) => {
            const cache = [
                '',
                '0',
                '00'
            ]
            // ensure str is string
            str = String(str)
            len = len - str.length
            return cache[len] + str
        },
        setPreviewBar: () => {
            if (localStorage.getItem('hgg2d previewbar') === 'true') {
                Chan.container.style.visibility = ''
                Chan.toggle.textContent = 'Previewbar Off'
            }
            else {
                Chan.container.style.visibility = 'hidden'
                Chan.toggle.textContent = 'Previewbar On'
            }
            if (Chan.fourchanx && Chan.oneechan) {
                Chan.container.style.bottom = '4em'
            } else if (Chan.fourchanx) {
                Chan.container.style.bottom = '9em'
            } else if (Chan.oneechan) {
                Chan.container.style.bottom = '5em'
            }
        },
        togglePreviewBar: e => {
            localStorage.setItem('hgg2d previewbar', !(localStorage.getItem('hgg2d previewbar') === 'true'))
            Chan.setPreviewBar()
        },
        work: el => {
            // <wbr>s get in the way with little benefit, easier to work with if simply removed
            Array.from(el.querySelectorAll('wbr')).forEach(t => {
                const parent = t.parentNode
                parent.removeChild(t)
                parent.normalize()
            })
             
            Chan.matchText(el, Chan.DMMCode, Chan.createDMM)
            Chan.matchText(el, Chan.RJCode, Chan.createRJ)
            Chan.matchText(el, Chan.RGBlog, Chan.createBlog)
            Chan.matchText(el, Chan.RGCirc, Chan.createCirc)

            if (Chan.linkify) Array.from(el.querySelectorAll('.linkify:not(lewds)')).forEach(link => link.classList.add('lewds'))
        },
        init: () => {
            if (!String.prototype.format) {
                String.prototype.format = function () {
                    const args = arguments
                    return this.replace(/{(\d+)}/g, (match, number) => {
                        return typeof args[number] != 'undefined'
                            ? args[number]
                            : match
                    })
                }
            }
            new MutationObserver(function (mutations) {
                const posts = []
                // If someone wants to show me some meme magic on how to map/reduce this
                // I would be more than happy to accept the Pull request
                // Looks aids because it has to play nice with 4chan-X which separates
                // every post insertion into separate mutation events, and also creates
                // two mutation events every time you come back to or leave the tab
                for (let i = 0; i < mutations.length; i++) {
                    if (mutations[i].addedNodes.length > 0) {
                        for (let x = 0; x < mutations[i].addedNodes.length; x++) {
                            if (mutations[i].addedNodes[x].tagName === 'DIV') {
                                posts.push(mutations[i].addedNodes[x].lastElementChild.lastElementChild)
                            }
                        }
                    }
                }
                posts.forEach(post => Chan.work(post))
            }).observe(Chan.thread, {
                childList: true,
                attributes: true
            })
            // HTML Area
            Chan.prev.setAttribute('id', 'preview')
            Chan.prev.setAttribute('style', 'visibility: hidden;')
            Chan.prev.onerror = () => { Chan.prev.style.visibility = 'hidden' }
            d.body.appendChild(Chan.prev)

            Chan.container.classList.add('previewBar')
            d.body.appendChild(Chan.container)

            Chan.container.appendChild(Chan.content)

            Chan.toggle.setAttribute('href', 'javascript:;')
            Chan.toggle.classList.add('previewBarToggle')
            Chan.toggle.appendChild(d.createTextNode('toggle'))
            if(document.location.hostname !== 'arch.b4k.co') d.querySelector('.navLinksBot').appendChild(Chan.toggle) // Zero_G modified line

            // Events Area
            d.body.addEventListener('mouseover', Chan.hover, false)
            d.body.addEventListener('mouseout', Chan.out, false)
            Chan.toggle.addEventListener('click', Chan.togglePreviewBar, false)

            // With all settings removed, and additional extensions installed, 4chan-X
            // will add the 'fourchan-x' class to the documentElement.
            setTimeout(() => {
                Chan.fourchanx = d.documentElement.classList.contains('fourchan-x')
                Chan.oneechan = d.documentElement.classList.contains('oneechan')
                if (Chan.fourchanx) {
                    Chan.checkForLinkify()
                }
                Chan.setPreviewBar()
            }, 500)
            if(document.location.hostname === 'arch.b4k.co') Array.from(d.querySelectorAll('.text')).forEach(el => Chan.work(el)) // Zero_G added line
            else Array.from(d.querySelectorAll('.postMessage')).forEach(el => Chan.work(el))                                      // Zero_G modified line
            Chan.CSS.init()
            Chan.Firstrun.init()
        },

    }
    const Ipfs = {
        init: () => {
            Ipfs.CSS()
            Ipfs.HTML()
            const anchors = Array.from(d.querySelectorAll('a')).filter(el => /R[JE]\d{6}/gi.test(el.textContent))
            anchors.forEach(anchor => Ipfs.generateRoot(anchor))
        },
        generateRoot: (anchor) => {
            // div to house the images
            // img to test whether or not the image is there
            const div = d.createElement('div')
            const img = d.createElement('img')
            div.classList.add('x-scrollable')
            img.addEventListener('error', Ipfs.retry)
            img.addEventListener('load', Ipfs.continue)
            img.target = div
            img.retry = true
            anchor.parentNode.appendChild(div)
            anchor = anchor.textContent
            anchor = /(R[JE])(\d{3})\d{3}/gi.exec(anchor)
            img.src = `https://img.dlsite.jp/modpub/images2/work/doujin/${anchor[1]}${Chan.padLeft(Number(anchor[2]) + 1, 3)}000/${anchor[0]}_img_main.jpg`
        },
        generateNext: (current, img) => {
            if (current === 0)
                return img.src.replace('main', 'smp1')
            return img.src.replace(/smp\d+\.jpg/gi, `smp${Number(/smp(\d+)\.jpg/gi.exec(img.src)[1]) + 1}.jpg`)
        },
        continue: (loadEvent) => {
            // loadEvent's members are currentTarget (img) and srcElement (img as well)
            const img = loadEvent.currentTarget
            const container = img.target
            Ipfs.createNew(img.src, container)
            img.retry = true
            if (localStorage.getItem('singlePreview') === 'true') return
            if (img.src.includes('main.jpg')) {
                img.src = Ipfs.generateNext(0, img)
                return
            }
            img.src = Ipfs.generateNext(/smp(\d+)/gi.exec(img.src)[1], img)
        },
        retry: (errorEvent) => {
            const img = errorEvent.currentTarget
            if (img.src.includes('main.jpg') && img.retry) {
                img.retry = false
                const replacer = img.src.includes('RJ') ? 'RE' : 'RJ'
                img.src = img.src.replace(/R[JE]/gi, replacer)
            }
        },
        createNew: (src, container) => {
            const image = d.createElement('img')
            image.classList.add('x-inline')
            image.src = src

            if (src.includes('main.jpg')) {
                const a = d.createElement('a')
                const href = `https://www.dlsite.com/${src.includes('RE') ? 'ecchi-eng' : 'maniax'}/work/=/product_id/${/(R[JE]\d{6})_/gi.exec(src)[1]}`
                a.href = href
                image.setAttribute('title', 'Click here to got to DLSite')
                a.appendChild(image)
                container.appendChild(a)
                return
            }
            container.appendChild(image)
        },
        CSS: () => {
            const css = d.createElement('style')
            const tds = Array.from(d.querySelector('tr').querySelectorAll('td'))
            css.textContent = '.x-inline {'
                + 'display: inline-block;'
                + 'max-height: 220px;'
                + '}'
                + 'table {'
                + 'table-layout: fixed;'
                + '}'
                + '.x-scrollable {'
                + 'overflow-x: auto;'
                + 'white-space: nowrap;'
                + '}'
                + '.x-container:empty {'
                + 'display: none;'
                + '}'
                + '.x-toggle {'
                + 'margin: 10px;'
                + '}'
            d.head.appendChild(css)
            // Sets the widths of the first data columns such that the table doesn't get fucked
            // from being set to fixed-layout (needed for the scrolling preview bar)
            tds[0].style = 'width: 32px;'
            tds[2].style = 'width: 117.15px;'
        },
        HTML: () => {
            const button = d.createElement('button')
            button.textContent = `Toggle Multiple Previews: ${localStorage.getItem('singlePreview') === 'true' ? 'On' : 'Off'}`
            button.classList.add('x-toggle')
            button.addEventListener('click', () => {
                localStorage.setItem('singlePreview', !(localStorage.getItem('singlePreview') === 'true'))
                const singlePreview = localStorage.getItem('singlePreview') === 'true'
                button.textContent = `Toggle Multiple Previews: ${singlePreview ? 'On' : 'Off'}`
                button.disabled = true
                setTimeout(() => { document.querySelector('button').disabled = false }, 2000)
                // Reload page when the user toggles the multi-preview on.
                if (singlePreview === 'false') d.location.reload()
                // If we reached this point then the user has disabled seeing the extra
                // images that are already loaded. Future extra images will not continue
                // to load.
                const style = d.createElement('style')
                style.textContent = '.x-inline:not(:first-child) { display: none; }'
                d.head.appendChild(style)
            })
            d.querySelector('#header').appendChild(button)
        }
    }

    switch (document.location.hostname) {
            
        case 'boards.4channel.org':
        case 'boards.4chan.org':
        case 'yuki.la':     // Zero_G added line
        case 'arch.b4k.co': // Zero_G added line
            Chan.init()
            break
        case 'ipfs.io':
        case 'ipfs.infura.io':
            Ipfs.init()
            break
    }
}).call(this)