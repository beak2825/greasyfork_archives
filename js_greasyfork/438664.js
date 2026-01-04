// ==UserScript==
// @name         bilibili视频下载
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  bilibili视频
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438664/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/438664/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

window.myVideoAndAudio = 1

function ajax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('get', url)
        xhr.withCredentials = true

        xhr.addEventListener('load', function () {
            resolve(xhr.response)
        })

        xhr.send()
    })
}

function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

// 通过id查询cid，返回cid和名字组成的数组
async function getCidFromAvidAndBvid({ aid, bvid }) {
    let msgRet = await ajax(`https://api.bilibili.com/x/player/pagelist?${aid ? 'aid=' + aid + '&' : ''}${bvid ? 'bvid=' + bvid : ''}`)

    return JSON.parse(msgRet).data.map(item => {
        return {
            cid: item.cid,
            name: item.part
        }
    })
}

class Download {
    static baseInfo = {
        jsonrpc: "2.0",
        method: "aria2.addUri",
        id: "0",
        params: [
            [""],
            {
                "out": "",
                "referer": "https://www.bilibili.com/"
            }
        ]
    }

    constructor(videoInfoArr, divDownload) {
        this.videoInfoArr = videoInfoArr
        this.divDownload = divDownload
    }

    async startDownload() {
        this.divDownload.innerHTML = '正发送'
        while (this.videoInfoArr.length) {
            await this.sendAria2DownloadInfo(this.videoInfoArr.splice(0, 1))
            await delay(2000)
        }
        this.divDownload.innerHTML = '发送成功'
        await delay(1500)
        this.divDownload.innerHTML = '下载'
    }

    async sendAria2DownloadInfo(videoInfoWillDownload) {
        let Aria2DownloadInfo = await this.makeAria2DownloadInfo(videoInfoWillDownload)
        let xhr = new XMLHttpRequest()
        xhr.open('post', 'http://127.0.0.1:6800/jsonrpc')
        xhr.addEventListener('load', function () {
            console.log('successs')
        })
        console.log(Aria2DownloadInfo)

        xhr.send(JSON.stringify(Aria2DownloadInfo))
    }

    async makeAria2DownloadInfo(videoInfoWillDownload) {
        let videoDownloadUrl = await this.getDownloadUrl(videoInfoWillDownload)

        let videoAria2DownloadInfoArr = []

        videoInfoWillDownload.forEach((videoInfoArrItem, index) => {

            let videoName = this.checkName(videoInfoArrItem.name)

            if (window.myVideoAndAudio) {
                let videoInfo = JSON.parse(JSON.stringify(Download.baseInfo))
                videoInfo.id = index
                let videoParams = videoInfo.params
                videoParams[0][0] = videoDownloadUrl[index].videoUrl
                videoParams[1]['out'] = videoName + '.mp4'

                videoAria2DownloadInfoArr.push(videoInfo)
            }

            let audioInfo = JSON.parse(JSON.stringify(Download.baseInfo))
            audioInfo.id = index
            let audioParams = audioInfo.params
            audioParams[0][0] = videoDownloadUrl[index].audioUrl
            audioParams[1]['out'] = videoName + '.m4a'


            videoAria2DownloadInfoArr.push(audioInfo)
        })

        return videoAria2DownloadInfoArr
    }

    async getDownloadUrl(videoInfoWillDownload) {
        let videoDownloadPromiseArr = []
        videoInfoWillDownload.forEach((item) => {
            let { avid, bvid, cid } = item
            let videoDownloadPromise = this.getVideoDownloadUrlPromise(avid, bvid, cid)

            videoDownloadPromiseArr.push(videoDownloadPromise)
        })

        let retArr = await Promise.all(videoDownloadPromiseArr)

        return retArr.map(item => {
            return {
                 videoUrl: item.data.dash.video[0].backupUrl ? item.data.dash.video[0].backupUrl[0] : item.data.dash.video[0].baseUrl,
                 audioUrl: item.data.dash.audio[0].backupUrl ? item.data.dash.audio[0].backupUrl[0] : item.data.dash.audio[0].baseUrl
            }
        })
    }

    getVideoDownloadUrlPromise(avid, bvid, cid) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('get', `https://api.bilibili.com/x/player/playurl?${avid ? 'avid=' + avid + '&' : ''}${bvid ? 'bvid=' + bvid + '&' : ''}${cid ? 'cid=' + cid + '&' : ''}&qn=120&fnver=0&fnval=2000&fourk=1`)
            xhr.withCredentials = true

            xhr.addEventListener('load', function () {
                resolve(JSON.parse(xhr.response))
            })

            xhr.send()
        })
    }

    checkName(videoName) {
        return videoName.replaceAll('/', '').replaceAll('\\', '').replaceAll(':', '').replaceAll('|', '').replaceAll('*', '').replaceAll('?', '').replaceAll('"', '').replaceAll('<', '').replaceAll('>', '')
    }

}

class Create {
    constructor() {
        this.videoInfoAll = []
        this.videoInfoIWant = []

        this.divStart = {}
        this.divWrap = {}
        this.divVideoAndAudio = {}
        this.divSelectAllOrNot = {}
        this.divConfirm = {}
        this.divDownload = {}
        this.input1 = {}
        this.input2 = {}
        this.ul = {}
        this.liArr = []
    }

    createStartDom() {
        this.divStart = document.createElement('div')
        this.divStart.innerHTML = '开始'
        this.divStart.style.position = 'absolute'
        this.divStart.style.left = '9px'
        this.divStart.style.top = '135px'
        this.divStart.style.zIndex = 999
        document.body.append(this.divStart)

        this.divStart.addEventListener('click', async () => {
            this.divStart.style.display = 'none'

            await this.getVideoInfoAll()
            this.createDom()
            this.listenDom()
        })
    }

    createDom() {
        this.divWrap = document.createElement('div')
        this.divWrap.style.position = 'absolute'
        this.divWrap.style.left = '9px'
        this.divWrap.style.top = '135px'
        this.divWrap.style.fontSize = '10px'
        this.divWrap.style.zIndex = 999
        document.body.append(this.divWrap)

        this.divVideoAndAudio = document.createElement('div')
        this.divVideoAndAudio.innerHTML = '音视频'
        this.divWrap.append(this.divVideoAndAudio)

        this.divSelectAllOrNot = document.createElement('div')
        this.divSelectAllOrNot.innerHTML = '全选'
        this.divSelectAllOrNot.style.margin = '5px 0 5px 0'
        this.divWrap.append(this.divSelectAllOrNot)

        this.input1 = document.createElement('input')
        this.input1.style.width = '20px'
        this.divWrap.append(this.input1)

        this.input2 = document.createElement('input')
        this.input2.style.width = '20px'
        this.divWrap.append(this.input2)

        this.divConfirm = document.createElement('div')
        this.divConfirm.innerHTML = '选择'
        this.divConfirm.style.display = 'inline-block'
        this.divWrap.append(this.divConfirm)

        this.divDownload = document.createElement('div')
        this.divDownload.innerHTML = '下载'
        this.divDownload.style.margin = '5px 0 5px 0'
        this.divWrap.append(this.divDownload)

        this.ul = document.createElement('ul')
        this.ul.style.padding = '0'
        this.ul.style.height = '300px'
        this.ul.style.width = '150px'
        this.ul.style.overflow = 'auto'
        this.divWrap.append(this.ul)

        let liLength = this.videoInfoAll.length

        for (let i = 0; i < liLength; ++i) {
            let li = document.createElement('li')
            li.innerHTML = (i + 1) + ' ' + this.videoInfoAll[i].name
            li.style.listStyle = 'none'

            li.myIndex = i
            this.ul.append(li)
            this.liArr.push(li)
        }
    }

    listenDom() {
        this.listenDivDownload()

        this.divVideoAndAudio.addEventListener('click', () => {
            if (this.divVideoAndAudio.innerHTML === '音视频') {
                this.divVideoAndAudio.innerHTML = '仅音频'
                window.myVideoAndAudio = 0
            } else {
                this.divVideoAndAudio.innerHTML = '音视频'
                window.myVideoAndAudio = 1
            }
        })

        this.divSelectAllOrNot.addEventListener('click', () => {
            let text = this.divSelectAllOrNot.innerHTML === '全选' ? '全不选' : '全选'
            this.divSelectAllOrNot.innerHTML = text
            this.changeColor()
        })

        // 默认全选
        this.divSelectAllOrNot.click()

        this.divConfirm.addEventListener('click', () => {
            let start = this.input1.value - 1
            let end = this.input2.value - 1
            if (start <= end) {
                this.changeColor([start, end])
            }
        })

        this.ul.addEventListener('click', (e) => {
            let index = e.target.myIndex
            this.changeColor([index, index])
        })
    }

    listenDivDownload() {
        // 监听下载按钮
        this.divDownload.addEventListener('click', async () => {
            await this.findSelected()
            let download = new Download(this.videoInfoIWant, this.divDownload)
            download.startDownload()
        })
    }

    changeColor(arrStartAndEnd) {
        if (Object.prototype.toString.call(arrStartAndEnd) === '[object Array]') {
            let targetColor = this.liArr[arrStartAndEnd[0]].style.color === 'rgb(251, 114, 153)' ? 'rgba(0, 0, 0)' : 'rgb(251, 114, 153)'

            let start = arrStartAndEnd[0]
            let end = arrStartAndEnd[1]
            for (; start <= end; ++start) {
                this.liArr[start].style.color = targetColor
            }

        } else {
            let targetColor = this.liArr[0].style.color === 'rgb(251, 114, 153)' ? 'rgba(0, 0, 0)' : 'rgb(251, 114, 153)'
            this.liArr.forEach(function (item) {
                item.style.color = targetColor
            })
        }
    }

    find(container) {
        let liLength = this.liArr.length

        for (let i = 0; i < liLength; i++) {
            if (this.liArr[i].style.color === 'rgb(251, 114, 153)') {
                container.push(this.videoInfoAll[i])
            }
        }
    }
}

class ListDownload extends Create {
    constructor() {
        super()
    }

    findSelected() {
        this.find(this.videoInfoIWant)
    }

}

class AnimationDownload extends ListDownload {
    constructor() {
        super()
    }

    getVideoInfoAll() {
        this.videoInfoAll = window.__INITIAL_STATE__.epList.map(item => {
            return {
                avid: item.aid,
                bvid: item.bvid,
                cid: item.cid,
                name: item.share_copy
            }
        })
    }
}

class UpVideoDownload extends ListDownload {
    constructor() {
        super()
    }

    getVideoInfoAll() {
        let { avid, bvid, pages } = window.__INITIAL_STATE__.videoData

        this.videoInfoAll = pages.map(item => {
            return {
                avid,
                bvid,
                cid: item.cid,
                name: item.part
            }
        })
    }

}

class SeriesVideoDownload extends Create {
    constructor() {
        super()
    }

    async findSelected() {
        let tmpVideoInfoIWant = []
        this.find(tmpVideoInfoIWant)

        let tmpVideoInfoIWantLength = tmpVideoInfoIWant.length

        for (let i = 0; i < tmpVideoInfoIWantLength; i++) {
            for (let j = 0; j < tmpVideoInfoIWant[i].archives.length; j++) {
                let ret = await getCidFromAvidAndBvid(tmpVideoInfoIWant[i].archives[j])
                let tmpArr = ret.map(item => {
                    return {
                        cid: item.cid,
                        name: item.name,
                        avid: tmpVideoInfoIWant[i].archives[j].aid,
                        bvid: tmpVideoInfoIWant[i].archives[j].bvid
                    }
                })

                Array.prototype.push.apply(this.videoInfoIWant, tmpArr)
                await delay(100)
            }
        }


    }

    async getVideoInfoAll() {
        this.videoInfoAll = await SeriesVideoDownload.getVideoFromMid(window.mid)
    }

    // 通过mid查询合集
    static async getVideoFromMid(mid) {
        let msgRet = await ajax(`https://api.bilibili.com/x/polymer/space/seasons_series_list?mid=${mid}&page_num=1&page_size=18`)

        let seasons_list = JSON.parse(msgRet).data.items_lists.seasons_list
        let series_list = JSON.parse(msgRet).data.items_lists.series_list

        return seasons_list.concat(series_list).map(item => {
            return {
                name: item.meta.name,
                archives: item.archives
            }
        })
    }
}

class DownloadAllVideo extends Create {
    constructor() {
        super()
    }

    async findSelected() {
        let liLength = this.liArr.length

        for (let i = 0; i < liLength; i++) {
            if (this.liArr[i].style.color === 'rgb(251, 114, 153)') {
                let aid = this.videoInfoAll[i].avid
                let bvid = this.videoInfoAll[i].bvid
                let ret = await getCidFromAvidAndBvid({ aid, bvid })

                let tmparr = ret.map(item => {
                    return Object.assign({ cid: item.cid }, this.videoInfoAll[i])
                })
                Array.prototype.push.apply(this.videoInfoIWant, tmparr)
            }
        }


    }

    async getVideoInfoAll() {
        let countNow = 0

        while (1) {
            let ret = await ajax(`https://api.bilibili.com/x/space/arc/search?mid=${window.mid}&ps=50&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp`)
            let msg = JSON.parse(ret)

            let tmpArr = msg.data.list.vlist.map(item => {
                return {
                    name: item.title,
                    avid: item.aid,
                    bvid: item.bvid
                }
            })

            Array.prototype.push.apply(this.videoInfoAll, tmpArr)

            countNow += 50
            if (countNow >= msg.data.page.count) {
                break
            }

        }
    }

}

let test
if ('__INITIAL_STATE__' in window && 'epList' in window.__INITIAL_STATE__) {
   test  = new AnimationDownload()

} else if ('__INITIAL_STATE__' in window && 'videoData' in window.__INITIAL_STATE__) {
    test = new UpVideoDownload()

} else if (location.href.includes('space') && location.href.includes('series')) {
    test = new SeriesVideoDownload()

} else if (location.href.includes('space') && location.href.includes('video')) {
    test = new DownloadAllVideo()

}

test.createStartDom()

