// ==UserScript==
// @name         Nyaa.si - Load More Thumbnail
// @name:zh-CN   Nyaa.si - 自动加载更多预览图
// @namespace    none
// @description  Load image from cover/screenshot links.
// @description:zh-CN  从封面/截图链接加载图片并显示。
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sukebei.nyaa.si
// @version      0.9.8
// @license      MIT
// @author       York Wang
// @match        https://sukebei.nyaa.si/*
// @match        https://hentai-covers.site/*
// @match        https://www.dlsite.com/*
// @match        https://e-hentai.org/*
// @match        https://pics.dmm.co.jp/*
// @match        https://javtenshi.com/*
// @match        https://3xplanet.net/*
// @match        https://3xplanet.com/*
// @match        https://xpic.org/*
// @match        https://imgrock.pw/*
// @match        https://picrok.com/*
// @match        https://picbaron.com/*
// @match        https://imgbaron.com/*
// @match        https://kvador.com/*
// @match        https://kropic.com/*
// @match        https://imgsto.com/*
// @match        https://imgsen.com/*
// @match        https://imgstar.eu/*
// @match        https://picdollar.com/*
// @match        https://pics4you.net/*
// @match        https://silverpic.com/*
// @match        https://fotokiz.com/*
// @match        https://premalo.com/*
// @match        https://piczhq.com/*
// @match        https://trypicz.com/*
// @match        http://imglord.com/*
// @match        https://croea.com/*
// @match        https://imgtaxi.com/*
// @match        https://imgadult.com/*
// @match        https://imgdrive.net/*
// @match        https://xxxwebdlxxx.org/*
// @match        https://xxxwebdlxxx.top/*
// @match        https://uvonahaze.xyz/*
// @match        https://trans.firm.in/*
// @match        https://imgdawgknuttz.com/*
// @match        https://imagetwist.netlify.app/*
// @match        https://imagetwist.com/*
// @match        https://imagexport.com/*
// @match        https://imagenimage.com/*
// @match        https://imagehaha.com/*
// @match        https://hentai4free.net/*
// @match        https://pixhost.to/*
// @match        https://imgair.net/*
// @match        http://imgair.net/*
// @match        http://imgfrost.net/*
// @match        http://imgblaze.net/*
// @match        https://pig69.com/*
// @match        https://ai18.pics/*
// @match        https://porn4f.com/*
// @match        https://porn4f.org/*
// @match        https://hentai4f.com/*
// @match        https://javball.com/*
// @match        https://ovabee.com/*
// @match        https://image.javbee.me/*
// @match        https://image.javbee.vip/*
// @match        https://idol69.net/*
// @match        https://sweetie-fox.com/*
// @match        https://javsunday.com/*
// @match        https://cnpics.org/*
// @match        https://fikfok.net/*
// @match        https://cnxx.me/*
// @match        https://cosplay18.pics/*
// @match        https://kin8-av.com/*
// @match        https://555fap.com/*
// @match        https://4fuk.me/*
// @match        https://hentaipig.com/*
// @match        https://3minx.com/*
// @match        https://fc2ppv.stream/*
// @match        https://xcamcovid.com/*
// @match        https://hentaicovid.org/*
// @match        https://chinese-pics.com/*
// @match        https://kr-av.com/*/*
// @match        https://cn-av.com/*
// @match        https://anime-jav.com/*
// @match        https://hentai-sub.com/*
// @match        https://cosplay-xxx.com/*
// @match        https://porn-pig.com/*
// @match        https://javtele.net/*
// @match        https://gofile.download/*
// @match        https://xxpics.org/*
// @match        https://hentaixnx.com/*
// @match        https://blackwidof.org/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437269/Nyaasi%20-%20Load%20More%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/437269/Nyaasi%20-%20Load%20More%20Thumbnail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function Handler(pattern, process, processNyaa) {
        this.pattern = (typeof pattern === 'string') ? new RegExp(pattern) : pattern
        this.process = process
        this.processNyaa = processNyaa
    }
    Handler.prototype.canHandle = function(url) {
        return this.pattern.test(url)
    }
    Handler.prototype.handle = function(url) {
        this.process && this.process((href, referer) => {
            document.location.href = href
            unsafeWindow.top.postMessage({"LMT": href, "LMT_SRC": referer||url}, '*')
        })
    }
    Handler.prototype.handleNyaa = function(url) {
        if(this.processNyaa) {
            this.processNyaa(url, href => {
                unsafeWindow.top.postMessage({"LMT": href, "LMT_SRC": url}, '*')
            })
        } else {
            unsafeWindow.LMT_Frame.src = url
        }
    }
    const handlers = []
    const addHandler = (pattern, process, processNyaa) => handlers.push(new Handler(pattern, process, processNyaa))

    const doGet = async (url, pattern) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: res => {
                    const src = res.responseText.match(pattern)
                    if(src.length > 1) resolve(src[1])
                },
                onerror: err => {
                    console.error(err)
                }
            })
        })
    }

    addHandler(/^https?:\/\/(hentai-covers\.site)\/image\/\w+/, null, async (url, callback) => {
        callback(await doGet(url, /id="image-main" src="(.+?)"/))
    })
    addHandler(/^https?:\/\/(www\.dlsite\.com)\/maniax\/work\/=\/product_id\/RJ\d+.html$/, null, async (url, callback) => {
        callback(await doGet(url, /twitter:image:src" content="(.+?)"/))
    })
    addHandler(/^https?:\/\/(e-hentai\.org)\/g\/\w+\/\w+\//, null, async (url, callback) => {
        callback(await doGet(url, /url\((https:\/\/.+?)\) no-repeat/))
    })
    addHandler(/^https?:\/\/c\.fantia\.jp\/uploads\/product\/image\/\d+\/[\w-]+\.webp/, null, (url, callback) => {
        callback(url)
    })
    addHandler(/^https?:\/\/(a.2img.org)/, null, (url, callback) => {
        callback(url)
    })
    addHandler(/^https?:\/\/(iwtf1\.caching\.ovh|i\.postimg\.cc|i\.imgur\.com|cdn\.faleno\.net|img169\.com|qpic\.ws|img\.blr844\.com|3xplanetimg2\.com|pics4you\.net|www\.javbus\.com|\w+\.turboimg\.net|cctv123456\.com|images\d\.imagebam\.com|files\.catbox\.moe|tezimg\.campus-av\.com|i\.97p\.org|(\w+\.)+steamstatic\.com|pics\.dmm\.co\.jp)(\/[\w-]+)+\.(jpg|png|gif)$/, null, (url, callback) => {
        callback(url)
    })
    addHandler(/^https?:\/\/(javtenshi\.com|3xplanet\.net|3xplanet\.com)\/viewimage\/\d+\.html/, null, async (url, callback) => {
        callback(await doGet(url, /scale\(this\);" src="(.+)/))
    })
    addHandler(/^https?:\/\/xpic\.org(\/\w+)+/, callback => {
        unsafeWindow.wuLu && unsafeWindow.wuLu()
        const img = document.querySelector('img.attachment-original.size-original')
        if(img) {
            callback(img.src)
        }
    }, async (url, callback) => {
        callback(await doGet(url, /src="(.*)" class="attachment-original size-original"/))
    })
    addHandler(/^https?:\/\/(imgrock\.pw)(\/[\w\-]+)+(\.[\w\-]+)+/, callback => {
        // pause on CAPTCHA
        const iframe = document.querySelector('iframe')
        if(iframe && iframe.src.indexOf('captcha') > -1) return

        const img = document.querySelector('.picview')
        if(img) {
            callback(img.src)
        } else {
            const btns = document.querySelectorAll('input[name=fnext]')
            for(let i=0;i<btns.length;i++) {if(!btns[i].style.display) btns[i].click()}
            const forms = document.querySelectorAll('form')
            for(let i=0;i<forms.length;i++) {if(forms[i].hito) {forms[i].submit()}}
        }
    })
    addHandler(/^https?:\/\/(picrok\.com)(\/[\w\-]+)+\.php/, callback => {
        // pause on CAPTCHA
        const iframe = document.querySelector('iframe')
        if(iframe && iframe.src.indexOf('captcha') > -1) return

        const img = document.querySelector('.picview')
        if(img) {
            callback(img.src)
        } else {
            unsafeWindow.setTimeout(() => {
              const forms = document.querySelectorAll('form')
              const btns = document.querySelectorAll('form>button')
              // for(let i=0;i<btns.length;i++) {if(btns[i].style.display) forms[i-1].submit()}
            }, 5000)
        }
    })
    addHandler(/^https?:\/\/(picbaron\.com|imgbaron\.com|kvador\.com|kropic\.com|imgsto\.com|imgsen\.com|imgstar\.eu|picdollar\.com|pics4you\.net|silverpic\.com|fotokiz\.com|premalo\.com|piczhq\.com|trypicz\.com|imglord\.com)(\/.+)+(\.[\w\-]+)+/, callback => {
        const img = document.querySelector('.pic')
        if(img) {
            callback(img.src)
        } else {
            const form = document.querySelector('form')
            form && form.submit()
        }
    })
    addHandler(/^https?:\/\/(croea\.com)(\/\w+)+/, callback => {
        const img = document.querySelector('.pic')
        if(img) {
            callback(img.src)
        } else {
            const form = document.querySelector('form')
            form && form.submit()
        }
    }, async (url, callback) => {
        const src = await doGet(url, /src="(.*)" class="pic img img-responsive"/)
        if(src) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: "blob",
                url: src,
                onload: res => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        callback(reader.result)
                    }
                    reader.readAsDataURL(res.response)
                }
            })
        }
    })
    addHandler(/^https?:\/\/(imgtaxi\.com|imgadult\.com|imgdrive\.net)(\/\w+)+/, callback => {
        unsafeWindow.ctipops = []
        unsafeWindow.adbctipops = []
        const img = document.querySelector('img.centred') || document.querySelector('img.centred_resized')
        if(img) {
            callback(img.src)
        } else {
            unsafeWindow.setTimeout(() => {
                const btn = document.querySelector('.overlay_ad_link')
              if(btn) {
                btn.focus()
                btn.click()
              }
            }, 1000)
        }
    }, async (url, callback) => {
        callback(await doGet(url, /og:image:secure_url" content="(.*)"/))
    })
    addHandler(/^https?:\/\/(xxxwebdlxxx\.org|xxxwebdlxxx\.top)(\/\w+)+/, callback => {
        unsafeWindow.ctipops = []
        unsafeWindow.adbctipops = []
        const img = document.querySelector('img.centred') || document.querySelector('img.centred_resized')
        if(img) {
            callback(img.src)
        } else {
            unsafeWindow.setTimeout(() => {
                const btn = document.querySelector('.overlay_ad_link')
              if(btn) {
                btn.focus()
                btn.click()
              }
            }, 1000)
        }
    })
    addHandler(/^https?:\/\/(uvonahaze\.xyz|trans\.firm\.in||imgdawgknuttz\.com)(\/\w+)+/, callback => {
        const img = document.querySelector('img.centred') || document.querySelector('img.centred_resized')
        if(img) {
            callback(img.src)
        } else {
            const btn = document.querySelector('input[name=imgContinue]')
            btn && btn.click()
        }
    })
    addHandler(/^https?:\/\/(imagetwist\.netlify\.app)(\/\w+)+/, async callback => {
        const redirect = await doGet(document.location.href, /<center><a href="(https?:\/\/imagetwist\.com(\/[\w-]+)+\.jpg)"/)
        document.location.href = redirect + '#' + document.location.href
    })
    addHandler(/^https?:\/\/(imagetwist\.com|imagexport\.com|imagenimage\.com|imagehaha\.com)(\/[\w-.]+)+\.jpg#https?:\/\/(imagetwist\.netlify\.app)(\/[\w-]+)+\.jpg/, callback => {
        const img = document.querySelector('.img-responsive')
        if(img) {
            const referer = document.location.href.split('#')[1]
            callback(img.src, referer)
        }
    })
    addHandler(/^https?:\/\/(imagetwist\.com|imagexport\.com|imagenimage\.com|imagehaha\.com)(\/[\w-.]+)+\.jpg$/, callback => {
        const img = document.querySelector('.img-responsive')
        if(img) {
            callback(img.src)
        }
    })
    addHandler(/^https?:\/\/hentai4free\.net(\/\w+)+/, callback => {
        unsafeWindow.wuLu && unsafeWindow.wuLu()
        const img = document.querySelector('#image-viewer-container>img')
        if(img) {
            callback(img.src)
        }
    })
    addHandler(/^https?:\/\/pixhost\.to(\/\w+)+/, callback => {
        const img = document.querySelector('img.image-img')
        if(img) {
            callback(img.src)
        } else {
            const btn = document.querySelector('a.continue')
            btn && btn.click()
        }
    })
    addHandler(/^https?:\/\/(imgair\.net|imgfrost\.net|imgblaze\.net)(\/\w+)$/, callback => {
        unsafeWindow.wuLu && unsafeWindow.wuLu()
        const img = document.querySelector('#newImgE')
        if(img) {
            callback(img.src)
        }
    }, (url, callback) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url.replace(/^https?:\/\/(imgfrost\.net|imgblaze\.net)/, 'https://imgair.net'),
            onload: res => {
                const mat = res.responseText.match(/imgbg.src = "(.*)";/)
                if(!mat || mat.length<2) return false
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: mat[1],
                    responseType: 'blob',
                    headers: {'Referer': 'https://imgair.net'},
                    onload: res => {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            callback(reader.result)
                        };
                        reader.readAsDataURL(res.response);
                    }
                })
            }
        })
    })
    const jav_hosts = 'pig69\\.com|ai18\\.pics|porn4f\\.com|porn4f\\.org|hentai4f\\.com|javball\\.com|ovabee\\.com|image.javbee\\.me|image.javbee\\.vip|idol69\\.net|sweetie-fox\\.com|javsunday\\.com|cnpics\\.org|fikfok\\.net|cnxx\\.me|cosplay18\\.pics|kin8\\-av\\.com|555fap\\.com|4fuk\\.me|hentaipig\\.com|3minx\\.com|fc2ppv\\.stream|xcamcovid\\.com|hentaicovid\\.org|chinese\\-pics\\.com|kr\\-av\\.com|cn\\-av\\.com|anime\\-jav\\.com|hentai\\-sub\\.com|cosplay\\-xxx\\.com|porn\\-pig\\.com|javtele\\.net|gofile\\.download|xxpics\\.org|hentaixnx\\.com|blackwidof\\.org'
    const jav_exp1 = new RegExp(`^https?:\/\/(${jav_hosts})(\/\\w+)+`)
    const jav_exp2 = new RegExp(`"https?:\/\/((${jav_hosts})(\/upload)?\/Application\/storage\/app\/public\/uploads\/users\/\.\*)"`)
    addHandler(jav_exp1, callback => {
        const img = document.querySelector('#fileOriginalModal img')
        if(img) {
            callback(img.src)
        } else {
            const btn = document.querySelector('a.continue')
            btn && btn.click()
        }
    }, (url, callback) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: res => {
                const src = res.responseText.match(jav_exp2)
                if(src.length > 1) callback("http://"+src[1])
            }
        })
    })
    addHandler(/^https:\/\/manko\.fun\|/, callback => {
        return false
    }, (url, callback) => {
        if(/^https:\/\/sukebei\.nyaa\.si\/(\?.*)?$/.test(href)) {
            callback(url.substr(18))
        }
    })

    const href = document.location.href
    if(/^https?:\/\/(sukebei\.nyaa\.si).+/g.test(href)) {

        let LMT_Wrap, LMT_Frame, LMT_Loading, LMT_panel, LMT_img
        const panelWidth = 480
        const panelHeight = 480
        function createWrap(parent) {
            parent.parentNode.insertAdjacentHTML('afterend', '<div class="panel panel-default"><div class="panel-body" id="LMT_Wrap"></div></div>')
            LMT_Wrap = document.querySelector('#LMT_Wrap')

            LMT_Loading = document.createElement('div')
            LMT_Loading.innerText = 'Loading Images...'
            LMT_Wrap.appendChild(LMT_Loading)
        }
        function createPanel() {
            LMT_panel = document.createElement('div')
            LMT_panel.style.position = 'fixed'
            LMT_panel.style.top = '-1000px'
            LMT_panel.style.left = '-1000px'
            LMT_panel.style.backgroundColor = '#f5f5f5'
            LMT_panel.style.backgroundSize = 'contain'
            LMT_panel.style.backgroundRepeat = 'no-repeat'
            LMT_panel.style.backgroundPosition = 'center'
            LMT_panel.style.border = '1px solid #ddd'
            LMT_panel.style.borderRadius = '6px'
            LMT_panel.style.boxShadow = '0 1px 1px rgba(0,0,0,.05)'
            LMT_panel.style.width = `${panelWidth}px`
            LMT_panel.style.height = `${panelHeight}px`
            document.body.appendChild(LMT_panel)

            LMT_img = document.createElement('img')
            LMT_img.style.width = '100%'
            LMT_img.style.height = '100%'
            LMT_img.style.objectFit = 'contain'
            LMT_img.onerror = (e) => {
                LMT_panel.style.top = '-1000px'
                LMT_panel.style.left = '-1000px'
                LMT_img.style.display = 'none'
                const a = document.querySelector(`a[data-lmt="${decodeURI(e.target.src)}"]`)
                if(a && a.dataset.lmtSrc) {
                    // extract bad url locally, stop retry
                    delete a.dataset.lmt
                    a.dataset.lmtSrc = '#'
                } else if(a) {
                    // load bad url from server, do retry
                    delete a.dataset.lmt
                    delete a.dataset.lmtSrc
                }
                const span = document.querySelector(`span[data-lmt="${decodeURI(e.target.src)}"]`)
                if(span) span.remove()
            }
            LMT_panel.appendChild(LMT_img)

            LMT_Frame = document.createElement('iframe')
            LMT_Frame.id = 'LMT_Frame'
            LMT_Frame.sandbox = 'allow-forms allow-scripts allow-same-origin'
            LMT_Frame.style.display = 'none'
            document.body.appendChild(LMT_Frame)
        }

        const imgList = []
        function addToImgQueue(q) {
            if(imgList.filter(a=>a.href===q.href).length === 0) imgList.push(q)
        }
        let running = false
        let timeoutCounter = 0
        const imgListConsumer = setInterval(() => {
            if(timeoutCounter > 500) {
                running = false
                timeoutCounter = 0
            }
            timeoutCounter++
            if(running) return
            timeoutCounter = 0
            if(imgList.length) {
                let url = imgList.shift()
                url.handler.handleNyaa(url.href)
                running = true
            } else if(LMT_Loading) {
                LMT_Loading.innerText = ''
            }
        }, 10)
        function process() {
            if(imgList.length) {
                let url = imgList.shift()
                url.handler.handleNyaa(url.href)
            } else {
                if(LMT_Wrap) {
                    LMT_Loading.innerText = ''
                    LMT_Frame.remove()

                    if(!Array.apply(null, document.querySelectorAll('#LMT_Wrap > img')).length) {
                        document.querySelector('.panel:has(#LMT_Wrap)').style.display = 'none'
                    }
                } else {
                    LMT_Frame.src = 'about:blank'
                }
            }
        }

        unsafeWindow.addEventListener('message', function (e) {
            if(!e.data.LMT) return false
            if(LMT_Wrap) {
                LMT_Frame.src = ''
                const img = document.createElement('img')
                img.src = e.data.LMT
                img.style['max-width'] = '100%'
                LMT_Wrap.appendChild(img)
            }
            if(e.data.LMT_SRC) {
                const url_src = e.data.LMT_SRC.toLowerCase()
                const a = document.querySelector(`a[data-lmt-src="${decodeURI(url_src)}"]`)
                if(a && !a.dataset.lmt) {
                    a.dataset.lmt = e.data.LMT
                    const span = document.createElement("span");
                    span.innerHTML='🖼️'
                    span.style.cursor = 'pointer'
                    span.dataset.lmt = e.data.LMT
                    a.before(span)

                    if(/^https?:\/\/(sukebei\.nyaa\.si\/view\/).+/g.test(a.href)) {
                        const id = a.href.substr(a.href.lastIndexOf('/')+1)
                        saveThumb(id, e.data.LMT)
                    }
                }
            }
            // process()
            running = false
        })

        let windowWidth = unsafeWindow.innerWidth
        let windowHeight = unsafeWindow.innerHeight
        unsafeWindow.addEventListener('resize', function (e) {
            windowWidth = unsafeWindow.innerWidth
            windowHeight = unsafeWindow.innerHeight
        })
        unsafeWindow.addEventListener('mouseover', function (e) {
            const a = e.target
            if(a.dataset.lmt) {
                LMT_panel.style.backgroundImage = `url('${a.dataset.lmt}')`
                LMT_img.src = a.dataset.lmt
                LMT_img.style.display = 'block'
            }
        })
        unsafeWindow.addEventListener('mousemove', function (e) {
            const a = e.target
            if(LMT_img.style.display == 'block') {
                const offset = 20;
                const panelRightEdge = e.clientX + offset + panelWidth;
                const panelBottomEdge = e.clientY + offset + panelHeight;

                // Horizontal positioning
                let newLeft = e.clientX + offset;
                if(panelRightEdge > windowWidth) {
                    newLeft = e.clientX - offset - panelWidth;
                }
                newLeft = Math.max(5, Math.min(newLeft, windowWidth - panelWidth - 5));

                // Vertical positioning
                let newTop = e.clientY + offset;
                if(panelBottomEdge > windowHeight) {
                    newTop = e.clientY - offset - panelHeight;
                }
                newTop = Math.max(5, Math.min(newTop, windowHeight - panelHeight - 5));

                LMT_panel.style.left = newLeft + 'px';
                LMT_panel.style.top = newTop + 'px';
            }
        })
        unsafeWindow.addEventListener('mouseout', function (e) {
            const a = e.target
            if(a.dataset.lmt) {
                LMT_panel.style.top = '-1000px'
                LMT_panel.style.left = '-1000px'
                LMT_img.style.display = 'none'
            }
        })

        const CLOUD_URL = 'https://oc1.bigsm.art'
        const getThumbs = ids => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CLOUD_URL}/thumbs/?ids=${ids}`,
                    onload: res => { resolve(JSON.parse(res.responseText)) },
                    onError: err => { console.log(err);resolve([]) }
                })
            })
        }
        const saveThumb = (id, thumb) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CLOUD_URL}/thumb/${id}`,
                data: `{"url": "${thumb}"}`,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        if(/^https?:\/\/(sukebei\.nyaa\.si\/view\/).+/g.test(href)) {
            // Detail Page
            if(document.title === '429 Too Many Requests') {
                document.location.href = document.location.href
                return
            }
            const desc = document.querySelector('#torrent-description')
            const links = desc.querySelectorAll('a')

            if(!desc || !links) return

            for(let i = 0; i < links.length; i++) {
                if(!links[i].href) continue
                links[i].dataset.lmtSrc = decodeURI(links[i].href)
                handlers.forEach(h => {
                    if(h.canHandle(links[i].href)) {
                        links[i].dataset.lmtSrc = links[i].href.toLowerCase()
                        addToImgQueue({href:links[i].href,handler:h})
                    }
                })
            }

            if(!LMT_Frame) {
                createWrap(desc)
            }
            createPanel()
            // process()
        } else {
            // List Page
            // try to load thumb from cloud
            const links = document.querySelectorAll('.torrent-list>tbody>tr>td:nth-child(2)>a:last-child')
            const ids = Array.apply(null, links).map(a => a.href.substr(a.href.lastIndexOf('/')+1)).join(',')
            getThumbs(ids).then(thumbs => {
                for(let i in thumbs) {
                    if(!thumbs[i]) continue
                    links[i].dataset.lmt = thumbs[i]
                    const span = document.createElement("span");
                    span.innerHTML='🖼️'
                    span.style.cursor = 'pointer'
                    span.dataset.lmt = thumbs[i]
                    links[i].before(span)
                }
            })

            document.querySelector('.torrent-list').addEventListener('mouseover', async (e) => {
                const a = e.target
                if(a.dataset.lmt || a.dataset.lmtSrc || !a.href || !/.*\/view\/\d+$/.test(a.href)) return

                // Serialize requests, to avoid '429 Too Many Requests'
                const unlock = await lock()
                const detail = await getDetail(a.href)
                unlock()

                // Find image markdown '![text](image url)'
                let imgs = detail.responseText.match(/]\((https?:\/\/[^)]+)/)
                if(imgs && imgs[1] && imgs[1].indexOf('nyaa.si') < 0) {
                    a.dataset.lmtSrc = imgs[1]
                    addToImgQueue({href: imgs[1], handler: {handleNyaa: (url) => { unsafeWindow.top.postMessage({"LMT": url, "LMT_SRC": url}, '*') }}})
                    return
                }

                let desc = detail.responseText.match(/id="torrent-description">(.*?)<\/div>/)
                if(!desc) return false
                desc = desc[1].replaceAll('&#10;', '\n').replaceAll(')]', ' )]').replaceAll('\*\*', ' \*\* ')
                let hrefs = desc.match(/(https?:\/\/[^\s\)]+)/g) || []
                let info = detail.responseText.match(/noopener noreferrer nofollow" href="(https?:\/\/.+?)"/)
                if(info) hrefs = [...hrefs, info[1]]
                let comments = detail.responseText.match(/id="torrent-comment\d+">(https?:\/\/.+?)(&#10;.*)*<\/div>/)
                if(comments) hrefs = [...hrefs, comments[1]]
                console.log('found links:', hrefs)

                let flag = false
                for (let i in hrefs) {
                    let href = hrefs[i]
                    // skip nyaa.si
                    if (href.indexOf('nyaa.si') >= 0) {
                        continue
                    }
                    // for links '[![Visit manko.fun](https://...)](https://manko.fun)'
                    if (href.trim() === 'https://manko.fun') {
                        href = desc.match(/(https?:\/\/.+?)\)\]\(https:\/\/manko\.fun\)/)
                        if(href) {
                            href = 'https://manko.fun|' + href[1].trim()
                        } else {
                            continue
                        }
                    }

                    for(let j in handlers) {
                        const h = handlers[j]
                        if(href.indexOf('nyaa') < 0 && h.canHandle(href)) {
                            a.dataset.lmtSrc = href.toLowerCase()
                            addToImgQueue({href:href,handler:h})
                            flag = true
                            break
                        }
                    }
                    if(flag) {
                        // process()
                        break
                    }
                }
                if(!flag) {
                    a.dataset.lmtSrc = '#'
                }
            })
            createPanel()

            let isLock = false;
            let lockList = [];
            async function lock() {
                function unlock() {
                    let waitFunc = lockList.shift();
                    if (waitFunc) {
                        waitFunc.resolve(unlock);
                    } else {
                        isLock = false;
                    }
                }
                if (isLock) {
                    return new Promise((resolve, reject) => {
                        lockList.push({ resolve, reject });
                    });
                } else {
                    isLock = true;
                    return unlock;
                }
            }
            const getDetail = url => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: res => { resolve(res) },
                        onError: err => { reject(err) }
                    })
                })
            }
        }
    } else {
        // Image Host Websites
        handlers.forEach(h=>{h.canHandle(href) && h.handle(document.location.href)})
    }
})();
