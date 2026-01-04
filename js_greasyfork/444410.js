// ==UserScript==
// @name        MyFigureCollection: 图片下载器
// @name:en     MyFigureCollection: Image Downloader
// @name:zh-CN  MyFigureCollection: 图片下载器
// @name:zh-TW  MyFigureCollection: 图片下载器
// @description 下载原始图片，相册下拉自动加载
// @description:en The original fullsize images downloader. The album pull down to load next page.
// @description:zh-CN 下载原始图片，相册下拉自动加载
// @description:zh-TW 下载原始图片，相册下拉自动加载
// @namespace   http://tampermonkey.net/
// @match       https://myfigurecollection.net/item/*
// @match       https://myfigurecollection.net/picture/*
// @match       https://myfigurecollection.net/pictures.php*
// @match       https://myfigurecollection.net/browse.v4.php*
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://greasyfork.org/scripts/444466-mini-mvvm/code/mini%20mvvm.js?version=1047822
// @license     GPL-3.0
// @compatible  Chrome
// @version     1.6.8
// @author      ayan0312
// @downloadURL https://update.greasyfork.org/scripts/444410/MyFigureCollection%3A%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/444410/MyFigureCollection%3A%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
const TIME_OUT = 40 * 1000
const REQUEST_URL = GM_getValue('REQUEST_URL')
const FILTER_URLS = [
    'https://static.myfigurecollection.net/ressources/nsfw.png',
    'https://static.myfigurecollection.net/ressources/spoiler.png'
]
const LOCATION_ITEM_ID = (new URL(location.href)).searchParams.get('itemId') || location.href.split('/item/')[1] || ''

const logger = {
    info(...args) {
        console.log('[Image Downloader]:', ...args)
    },
    warn(...args) {
        console.log('%c[Image Downloader]:', "color: brown; font-weight: bold", ...args)
    },
    error(...args) {
        console.log('%c[Image Downloader]:', "color: red; font-weight: bold", ...args)
    },
    success(...args) {
        console.log('%c[Image Downloader]:', "color: green; font-weight: bold", ...args)
    },
}

function downloadImage(opts) {
    return new Promise((resolve, reject) => {
        if (!REQUEST_URL) {
            GM_download({
                url: opts.url,
                name: opts.name,
                timeout: TIME_OUT,
                onload: () => {
                    resolve(null)
                },
                onerror: (err) => reject({
                    status: 'error',
                    err,
                }),
                ontimeout: (err) => reject({
                    status: 'timeout',
                    err
                }),
            })
            return
        }

        GM_xmlhttpRequest({
            url: `${REQUEST_URL}?opts=${btoa(JSON.stringify(opts))}`,
            responseType: 'json',
            onload: ({ response }) => {
                if (response.success) {
                    resolve(response)
                    return
                }

                if (response.code === 3) {
                    reject({
                        status: 'timeout',
                        err: response.message
                    })
                    return
                }

                reject({
                    status: 'error',
                    err: response.message,
                })
            },
            onerror: (err) => reject({
                status: 'error',
                err,
            }),
            ontimeout: (err) => reject({
                status: 'timeout',
                err
            })
        })
    })
}

function download({ downloadButton, picture, group, count, origin }) {
	const pictureURL = picture.split('&')[0]
    const end = (status) => {
        downloadButton.downloadStatus = status
        GM_setValue(pictureURL, { origin, group, count, downloadStatus: status })
    }
    const [originName, fileType] = origin.split('/').pop().split('.')
    let name = `${group}_${count}_${pictureURL.split('/').pop()}`

    if (!REQUEST_URL)
        name = `${name}.${fileType}`

    downloadImage({
        url: origin,
        name,
		timeout:TIME_OUT * (downloadButton.timeoutTimes + 1)
    })
        .then((res) => {
            end('downloaded')
            logger.success(name,res)
        })
        .catch(({ status, err }) => {
            end(status)
            logger.warn(err)
        })
}

const downloadBtnVMs = {}
let waitRedownloadVMs = []

const globalState = observe({
    group: GM_getValue('groupCount', 1),
    count: GM_getValue('picCount', 0),
    componentDownloadStatus: {},
    downloadStates: {
        total: 0,
        normal: 0,
        loading: 0,
        error: 0,
        timeout: 0,
        downloaded: 0,
    },
    autoloadStatus: 'normal'
})

window.onbeforeunload = (e) => {
    const { loading, error, timeout } = globalState.downloadStates
    if (loading || error || timeout)
        e.returnValue = '1'
}

new Watcher(null, () => {
    return globalState.count
}, (newVal) => {
    GM_setValue('picCount', newVal)
})

new Watcher(null, () => {
    return globalState.group
}, (newVal) => {
    GM_setValue('groupCount', newVal)
    globalState.count = 0
})

new Watcher(null, () => {
    return globalState.componentDownloadStatus
}, (newVal) => {
    Object.assign(globalState.downloadStates, {
        total: 0,
        normal: 0,
        loading: 0,
        error: 0,
        timeout: 0,
        downloaded: 0,
    })
    const states = globalState.downloadStates
    waitRedownloadVMs = []
    Object.keys(newVal).forEach(key => {
        const status = newVal[key]
        if (states[status] != null) {
            states[status] += 1
            states.total += 1
        }

        if (status === 'timeout' || status === 'error')
            waitRedownloadVMs.push(downloadBtnVMs[key])
    })
}, true)

const DownloadSequence = {
    template: `
        <span>Group: </span>
        <button v-on:click="decreaseGroup">-</button>
        <span style="margin:0 10px">{{global.group}}</span>
        <button v-on:click="increaseGroup">+</button>
        <span style="margin-left:10px">Item: </span>
        <button v-on:click="decreaseCount">-</button>
        <span style="margin:0 10px">{{global.count}}</span>
        <button v-on:click="increaseCount">+</button>
  `,
    data() {
        return {
            global: globalState,
        }
    },
    methods: {
        increaseCount() {
            this.global.count += 1
        },
        decreaseCount() {
            this.global.count -= 1
        },
        increaseGroup() {
            this.global.group += 1
        },
        decreaseGroup() {
            this.global.group -= 1
        }
    }
}

const DownloadButton = {
    template: `
        <button v-on:click="download" v-style="downloadBtnStyle">
            {{downloadedMsg}}
        </button>
    `,
    data() {
        return {
            oldStatus: 'normal',
            downloadStatus: 'normal', // 'normal' 'loading' 'error' 'timeout' 'downloaded'
            requestButtonStyles: {
                normal: {},
                loading: { background: 'white', color: 'black', cursor: 'wait' },
                error: { background: 'red', color: 'white' },
                timeout: { background: 'yellow', color: 'black' },
                downloaded: { background: 'green', color: 'white' }
            },
            group: globalState.group,
            count: globalState.count,
			timeoutTimes: 0
        }
    },
    computed: {
        downloadBtnStyle() {
            return this.requestButtonStyles[this.downloadStatus]
        },
        downloadedMsg() {
            const messages = {
                normal: 'Download',
                loading: 'Downloading...',
                error: 'Failed',
                timeout: 'Timeout',
                downloaded: 'Redownload'
            }
            return messages[this.downloadStatus]
        }
    },
    watch: {
        downloadStatus(newStatus, oldStatus) {
            this.oldStatus = oldStatus
			if(newStatus === 'timeout')
				this.timeoutTimes++
            globalState.componentDownloadStatus[this.cid] = newStatus
        },
    },
    created() {
        globalState.componentDownloadStatus[this.cid] = this.downloadStatus
        downloadBtnVMs[this.cid] = this
    },
    destoryed() {
        delete globalState.componentDownloadStatus[this.cid]
        delete downloadBtnVMs[this.cid]
    },
    methods: {
        download() {
            if (this.downloadStatus === 'loading') return
            this.downloadStatus = 'loading'

            if (LOCATION_ITEM_ID && !GM_getValue(LOCATION_ITEM_ID)) {
                GM_setValue(LOCATION_ITEM_ID, true)
                this.first = true
            }
            if (this.oldStatus !== 'error' && this.oldStatus !== 'timeout')
                this.refreshGroupAndCount()

            this.$emit('download', { group: this.group, count: this.count })
        },
        refreshGroupAndCount() {
            const newestGroup = GM_getValue('groupCount', 1)
            const newestCount = GM_getValue('picCount', 0)
            if (globalState.group !== newestGroup)
                globalState.group = newestGroup
            if (globalState.count !== newestCount)
                globalState.count = newestCount

            if (this.first && globalState.count > 0) {
                globalState.group += 1
                this.first = false
            }

            globalState.count += 1

            this.group = globalState.group
            this.count = globalState.count
        }
    }
}

const DownloadState = {
    template: `
        <div style="display:flex;flex-direction:row;padding:10px;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;border-top: 1px dashed #ccc;">
            <div style="margin-right:15px;color:black">
                <span style="">Total: </span>
                <span>{{states.total}}</span>
            </div>
            <div style="margin-right:15px;color:green">
                <span style="">Downloaded: </span>
                <span>{{states.downloaded}}</span>
            </div>
            <div style="margin-right:15px;color:grey">
                <span style="">Downloading: </span>
                <span>{{states.loading}}</span>
            </div>
            <div style="margin-right:15px;color:brown">
                <span style="">Timeout: </span>
                <span>{{states.timeout}}</span>
            </div>
            <div style="color:red">
                <span>Failed: </span>
                <span>{{states.error}}</span>
            </div>
            <button style="margin-left:10px" v-show="waitCount" v-on:click="redownload">Redownload Timeout&Error</button>
        </div>
  `,
    data() {
        return {
            states: globalState.downloadStates
        }
    },
    computed: {
        waitCount() {
            return this.states.timeout + this.states.error > 0
        }
    },
    methods: {
        redownload() {
            waitRedownloadVMs.forEach(vm => vm.download())
        }
    }
}

const createPictureDownload = (origin) => {
    return {
        components: {
            'download-button': DownloadButton,
            'download-sequence': DownloadSequence,
        },
        template: `
            <div>
                <download-sequence></download-sequence>
                <span v-show:downloaded>{{msg}}</span>
                <download-button v-ref="downloadButton" v-on:download="download"></download-button>
            </div>
      `,
        data() {
            return {
                group: 0,
                count: 0,
                downloaded: false
            }
        },
        computed: {
            msg() {
                return `Group: ${this.group} Item: ${this.count}`
            }
        },
        mounted() {
            const value = GM_getValue(window.location.href.split('&')[0])
            if (!value) return
            this.$refs.downloadButton.downloadStatus = value.downloadStatus
            this.$refs.downloadButton.group = value.group
            this.$refs.downloadButton.count = value.count

            this.downloaded = true
            this.group = value.group
            this.count = value.count
        },
        methods: {
            download({ group, count }) {
                this.downloaded = true
                this.group = group
                this.count = count

                download({
                    group,
                    count,
                    origin,
                    picture: window.location.href,
                    downloadButton: this.$refs.downloadButton,
                })
            }
        }
    }
}

const createPicturePreview = ({ thumb, origin, picture }, preview) => {
    return {
        components: {
            'download-button': DownloadButton
        },
        template: `
            <div v-style="containerStyle">
                <div style="margin-bottom:10px;display:flex;flex-direction:row;justify-content:center;align-items:center;width:100%;">
                    <div style="margin:0 10px;flex-shrink:0;width:100%">
                        <img style="cursor:pointer;width:100%;min-width:140px;min-height:60px" v-on:click="openPicturePreview" [src]="thumb" />
                    </div>
                </div>
                <div style="display:flex;justify-content:center;align-items:center;flex-direction:column">
                    <download-button v-ref="downloadButton" v-on:download="download"></download-button>
                    <br v-show:downloaded />
                    <div v-show:downloaded>
                        <span>Group:</span>
                        <span >{{group}}</span>
                        <span>Item:</span>
                        <span >{{count}}</span>
                    </div>
                    <br />
                    <button v-on:click="openPicturePage">Open</button>
                    <br v-show:refresh />
                    <button v-show:refresh v-on:click="refreshOrigin" v-style="refreshBtnStyle">
                        {{refreshMsg}}
                    </button>
                </div>
            </div>
      `,
        data() {
            return {
                thumb,
                origin,
                refresh: FILTER_URLS.includes(origin),
                originalImage: false,
                group: 0,
                count: 0,
                downloaded: false,
                refreshStatus: 'normal',
                downloadStatus: 'normal',
                requestBorderStyle: {
                    normal: { border: '2px solid black' },
                    loading: { border: '2px solid grey' },
                    error: { border: '2px solid red' },
                    timeout: { border: '2px solid yellow' },
                    downloaded: { border: '2px dashed green' }
                },
                requestButtonStyles: {
                    normal: {},
                    loading: { background: 'white', color: 'black', cursor: 'wait' },
                    error: { background: 'red', color: 'white' },
                    timeout: { background: 'yellow', color: 'black' },
                    downloaded: { background: 'green', color: 'white' }
                },
                commonStyle: {
                    'margin': '10px 10px',
                    'padding': '10px',
                    'border-radius': '5px',
                    'background': '#fff',
                    'transition': 'all 0.5s',
                    'box-sizing': 'border-box',
                    'max-width': '300px'
                }
            }
        },
        computed: {
            containerStyle() {
                const borderStyle = this.requestBorderStyle[this.downloadStatus]
                return Object.assign({}, borderStyle, this.commonStyle)
            },
            refreshBtnStyle() {
                return this.requestButtonStyles[this.refreshStatus]
            },
            refreshMsg() {
                const messages = {
                    normal: 'Show Spoiler/NSFW',
                    loading: 'Showing...',
                    error: 'Failed',
                    timeout: 'Timeout',
                    downloaded: 'Reshow'
                }
                return messages[this.refreshStatus]
            }
        },
        mounted() {
            this.$watch(() => this.$refs.downloadButton.downloadStatus, (newVal) => {
                this.downloadStatus = newVal
            })

            const value = GM_getValue(picture.split('&')[0])
            if (!value) return
            this.$refs.downloadButton.downloadStatus = value.downloadStatus
            this.$refs.downloadButton.group = value.group
            this.$refs.downloadButton.count = value.count

            this.downloaded = true
            this.group = value.group
            this.count = value.count
        },
        methods: {
            download({ group, count }) {
                this.downloaded = true
                this.group = group
                this.count = count

                const params = {
                    group,
                    count,
                    origin: this.origin,
                    picture: picture,
                    downloadButton: this.$refs.downloadButton
                }

                if (this.refresh && this.refreshStatus !== 'downloaded') {
                    this.refreshOrigin()
                        .then(() => {
                            params.origin = this.origin
                            download(params)
                        })
                    return
                }

                download(params)
            },
            openPicturePage() {
                window.open(picture)
            },
            refreshOrigin() {
                if (this.refreshStatus === 'loading') return
                this.refreshStatus = 'loading'
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url: picture,
                        responseType: 'document',
                        timeout: TIME_OUT,
                        onload: (data) => {
                            const doc = data.response
                            const a = doc.querySelector('.the-picture>a')
                            if (a) {
                                this.origin = a.href
                                const thumb = a.href.split('/')
                                thumb.splice(thumb.length - 1, 0, 'thumbnails')
                                this.thumb = thumb.join('/')
                                this.refreshStatus = 'downloaded'
                                resolve()
                                return
                            }
                            this.refreshStatus = 'error'
                            reject({
                                status: 'error',
                                err: data
                            })
                        },
                        onerror: (err) => {
                            this.refreshStatus = 'error'
                            reject({
                                status: 'error',
                                err,
                            })
                        },
                        ontimeout: (err) => {
                            this.refreshStatus = 'timeout'
                            reject({
                                status: 'timeout',
                                err,
                            })
                        }
                    })
                })
            },
            openPicturePreview() {
                if (this.refresh && this.refreshStatus !== 'downloaded') {
                    this.refreshOrigin()
                        .then(() => {
                            preview.open(this.origin)
                        })
                    return
                }
                preview.open(this.origin)
            }
        }
    }
}

const AutoloadMessageBox = {
    template: `
        <div style="width:100%;box-sizing:border-box;text-align:center;padding:15px">{{msg}}</div>
    `,
    data() {
        return {}
    },
    computed: {
        msg() {
            const messages = {
                normal: 'Pull Down',
                loading: 'Auto Loading...',
                error: 'Failed',
                timeout: 'Timeout',
                downloaded: 'Loaded',
                empty: 'Loaded All'
            }

            return messages[globalState.autoloadStatus]
        }
    },
}

const createItemTips = (itemId) => {
    return {
        template: `
            <span v-show="existItemId">Have been downloaded</span>
        `,
        data() {
            return {
            }
        },
        computed: {
            existItemId() {
                return !!GM_getValue(itemId)
            }
        }
    }
}

const Preview = {
    template: `
        <div v-show:show style="
            width:100%;
            height:100%;
            position:fixed;
            top:0;
            left:0;
            z-index: 11;
        ">
            <div v-on:click="close" style="
                display:flex;
                justify-content:center;
                align-items:center;
                height:100%;
                width:100%;
                background:rgba(0,0,0,0.5);
            ">
                <img [alt]="source" style="max-width:90%;max-height:90%" [src]="source" />
            </div>

        </div>
    `,
    data() {
        return {
            source: '',
            show: false
        }
    },
    methods: {
        open(source) {
            this.updateSource(source)
            this.show = true
        },
        close() {
            this.show = false
        },
        updateSource(source) {
            this.source = source
        }
    }
}

class DocumentUtility {
    static getElements(selector, doc = document) {
        const thumbs = []
        const pics = doc.querySelectorAll(selector) || []
        pics.forEach(thumb => {
            thumbs.push(thumb)
        })
        return thumbs
    }

    static insertAfter(targetNode, afterNode) {
        const parentNode = afterNode.parentNode
        const beforeNode = afterNode.nextElementSibling
        if (beforeNode == null)
            parentNode.appendChild(targetNode)
        else
            parentNode.insertBefore(targetNode, beforeNode)
    }
}

class Renderer {
    render() {
        throw new Error('Not implemented')
    }

    disposeRenderError(err, name) {
        logger.error(err || 'Unknown error')
        logger.error('Fail to render extension of ' + name)
    }
}

class PictureRenderer extends Renderer {
    constructor() {
        super()
        this.objectMetaNode = document.querySelector('.object-meta')
        this.pictureNode = document.querySelector('.the-picture>a')
    }

    render() {
        if (this.objectMetaNode && this.pictureNode) {
            try {
                this.renderThePictureExtension()
            } catch (err) {
                this.disposeRenderError(err, 'picture')
            }
        }
    }

    renderThePictureExtension() {
        MVVMComponent.appendChild( createPictureDownload(this.pictureNode.href),this.objectMetaNode)
    }
}

class AutoloadListRenderer extends Renderer {
    constructor(listNode, callback) {
        super()
        this.listNode = listNode
        this.nextURL = this._getNextPageURL()
        this.callback = callback
        this.scrollingElement = document.scrollingElement
    }

    render() {
        if (this.listNode) {
            try {
                this.renderAutoloadListExtension()
            } catch (err) {
                this.disposeRenderError(err, 'autoloading list')
            }
        }
    }

    renderAutoloadListExtension() {
        let wait = false
        const complete = (status) => {
            wait = false
            globalState.autoloadStatus = status
        }

        if (!this.nextURL) {
            complete('empty')
            return
        }

        this._mountAutoloadMessageBox()
        window.onscroll = (e) => {
            const bottom = this.listNode.offsetTop + this.listNode.clientHeight + 50
            const top = this.scrollingElement.scrollTop + window.screen.height
            if (top < bottom || wait || !this.nextURL) return
            wait = true
            globalState.autoloadStatus = 'loading'
            GM_xmlhttpRequest({
                url: this.nextURL,
                responseType: 'document',
                timeout: TIME_OUT,
                onload: (data) => {
                    const doc = data.response
                    if (!doc) {
                        complete('error')
                        return
                    }

                    this.callback(doc)
                    this.nextURL = this._getNextPageURL(doc)
                    if (!this.nextURL) {
                        complete('empty')
                        return
                    }

                    complete('downloaded')
                },
                onerror: () => complete('error'),
                ontimeout: () => complete('timeout')
            })
        }
    }

    _getNextPageURL(doc = document) {
        const nextAnchor = doc.querySelector('.nav-next.nav-end')
        return nextAnchor ? nextAnchor.href : ''
    }

    _mountAutoloadMessageBox() {
        const countPages = document.querySelector('.listing-count-pages')
        if (countPages) {
            this.listNode.parentNode.insertBefore(countPages.cloneNode(true), this.listNode)
            MVVMComponent.mount(AutoloadMessageBox, countPages)
        }
    }
}

class PreviewRenderer extends Renderer {
    constructor() {
        super()
        this.body = document.body
    }

    render() {
        if (this.body) {
            try {
                this.renderPreviewExtension()
            } catch (err) {
                this.disposeRenderError(err, 'preview')
            }
        }
    }

    renderPreviewExtension() {
        this.vm = MVVMComponent.appendChild(Preview, this.body)
    }
}

class PicturesRenderer extends Renderer {
    constructor() {
        super()
        this.pictureNodes = DocumentUtility.getElements('.picture-icon.tbx-tooltip')
        this.autoloadList = new AutoloadListRenderer(document.querySelector('.listing-item'), (doc) => {
            const nextPictureNodes = DocumentUtility.getElements('.picture-icon.tbx-tooltip', doc)
            this._rewritePictureNodes(nextPictureNodes)
        })
        this.preview = new PreviewRenderer()
        this.tasks = []
        this._schedule = false
    }

    render() {
        if (this.pictureNodes.length > 0) {
            try {
                this.renderPicturesExtension()
            } catch (err) {
                this.disposeRenderError(err, 'pictures')
            }
        }
    }

    renderPicturesExtension() {
        this.preview.render()
        this.picturesParent = this.pictureNodes[0].parentNode
        this._initPicturesParent()
        this._rewritePictureNodes(this.pictureNodes)
        this.autoloadList.render()
    }

    _initPicturesParent() {
        this.picturesParent.innerHTML = ''
        this.picturesParent.style.setProperty('display', 'flex')
        this.picturesParent.style.setProperty('flex-direction', 'row')
        this.picturesParent.style.setProperty('flex-wrap', 'wrap')
        this.picturesParent.style.setProperty('justify-content', 'center')
        this.picturesParent.style.setProperty('align-items', 'center')
        const div = document.createElement('div')
        div.style.padding = '10px'
        this.picturesParent.parentNode.insertBefore(div, this.picturesParent)
        MVVMComponent.appendChild(DownloadSequence, div)
        this._renderDownloadState()
    }

    _renderDownloadState() {
        const div = document.createElement('div')
        div.style.position = 'fixed'
        div.style.bottom = 0
        div.style.right = 0
        div.style.width = '100%'
        div.style.backgroundColor = 'white'
        document.body.appendChild(div)
        MVVMComponent.appendChild(DownloadState, div)
    }

    _rewritePictureNodes(pictures) {
        pictures.forEach(picture_node => {
            this.tasks.push(() => {
                MVVMComponent.appendChild(this._createPicturePreview(picture_node), this.picturesParent)
            })
        })
        this._scheduler()
    }

    _scheduler() {
        if (this._schedule) return
        this._schedule = true
        const scheduler = () => {
            if (this.tasks.length === 0) {
                this._schedule = false
                return
            }
            this.tasks.shift()()
            requestAnimationFrame(scheduler)
        }
        requestAnimationFrame(scheduler)
    }

    _createPicturePreview(pictureNode) {
        return createPicturePreview(this._getImageURLs(pictureNode), this.preview.vm)
    }

    _getImageURLs(picture_node) {
        const picture = picture_node.querySelector('a').href
        const viewport = picture_node.querySelector('.viewport')
        const thumb = viewport.style.background.split('"')[1]
        const origin = FILTER_URLS.includes(thumb) ? thumb : this._parseOriginalImageURL(thumb)
        return { thumb, origin, picture }
    }

    _parseOriginalImageURL(thumb_url) {
        let url = thumb_url
        if (thumb_url.indexOf('thumbnails/') > -1) {
            url = thumb_url.split('thumbnails/').join('')
        } else {
            const paths = thumb_url.split('pictures/')[1].split('/')
            if (paths.length > 2) {
                paths.splice(3, 1)
                url = [thumb_url.split('pictures/')[0], paths.join('/')].join('pictures/')
            }
        }
        return url
    }
}

class DiaporamasRenderer extends Renderer {
    constructor() {
        super()
        this.diaporamaNodes = DocumentUtility.getElements('.diaporama')
    }

    render() {
        if (this.diaporamaNodes.length > 0) {
            try {
                this.renderDiaporamasExtension()
            } catch (err) {
                this.disposeRenderError(err, 'diaporamas')
            }
        }
    }

    renderDiaporamasExtension() {
        this._updateDiaporamaNodes()
    }

    _updateDiaporamaNodes() {
        this.diaporamaNodes.forEach(diaporamaNode => {
            const a = diaporamaNode.querySelector('a')
            const itemId = a.href.split('/item/')[1]
            MVVMComponent.appendChild(createItemTips(itemId), a)
        })
    }
}

class ItemRenderer extends Renderer {
    constructor() {
        super()
        this.itemNode = document.querySelector('.split-left.righter')
    }

    render() {
        if (this.itemNode) {
            try {
                this.renderItemExtension()
            } catch (err) {
                this.disposeRenderError(err, 'item')
            }
        }
    }

    renderItemExtension() {
        this._moveRelatedItems()
        this._initItemNode()
        MVVMComponent.appendChild(createItemTips(LOCATION_ITEM_ID), this.itemNode)
        this._overwritePicturesNavigatingParameters()
    }

    _moveRelatedItems() {
        DocumentUtility.insertAfter(document.querySelector('.tbx-target-ITEMS'), document.querySelector('.tbx-target-LISTS'))
    }

    _initItemNode() {
        this.itemNode.style.display = 'flex'
        this.itemNode.style.flexDirection = 'column'
        this.itemNode.style.justifyContent = 'center'
        this.itemNode.style.alignItems = 'center'
    }

    _overwritePicturesNavigatingParameters() {
        const navigator = document.querySelector('.icon.icon-camera+a.count')
        navigator.href = `/pictures.php?itemId=${LOCATION_ITEM_ID}&sort=date&order=asc`
    }
}

class ExtensionRenderer extends Renderer {
    static renderer = new ExtensionRenderer()
    static rendered = false

    static render() {
        if (!this.rendered) {
            this.rendered = true
            this.renderer.render()
        }
    }

    constructor() {
        super()
        this.item = new ItemRenderer()
        this.picture = new PictureRenderer()
        this.pictures = new PicturesRenderer()
        this.diaporamas = new DiaporamasRenderer()
    }

    render() {
        this.item.render()
        this.picture.render()
        this.pictures.render()
        this.diaporamas.render()
    }

}

ExtensionRenderer.render()