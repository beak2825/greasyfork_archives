// ==UserScript==
// @name         mafengwo
// @namespace    https://www.mafengwo.cn/poi/*.html
// @version      0.1
// @description  旅游网站马蜂窝景点页面游客评论爬取下载
// @author       gisgo njnu
// @match        https://www.mafengwo.cn/poi/*.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424817/mafengwo.user.js
// @updateURL https://update.greasyfork.org/scripts/424817/mafengwo.meta.js
// ==/UserScript==

(function() {
    function downloadFileByBlob (blobUrl, filename) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blobUrl, filename)
        } else {
            let eleLink = document.createElement('a')
            eleLink.download = filename
            eleLink.style.display = 'none'
            eleLink.href = blobUrl
            document.body.appendChild(eleLink)
            eleLink.click()
            window.URL.revokeObjectURL(eleLink.href)
            document.body.removeChild(eleLink)
        }
    }

    class Comment {
        constructor (name, content) {
            this.游客姓名 = name || " "
            this.游客评论 = content || " "
        }
    }

    function getComment () {
        let commentArray = []

        let pushData = (name, revTxt) => {
            for (let i = 0; i < name.length; i++) {
                commentArray.push(new Comment(name[i].innerText, revTxt[i].innerText))
            }
            return commentArray
        }

        return new Promise((resolve, reject) =>{
            let timeOutFunc = () => {
                let revTxt = document.getElementsByClassName('rev-txt')
                let name = document.getElementsByClassName('name')
                let titleName = document.getElementById('_j_sharecnt').attributes[2].textContent
                let pgNext = document.getElementsByClassName('pg-next')

                if (name && revTxt && titleName && (pgNext.length != 0)) {
                    pushData(name, revTxt)
                    pgNext[0].click()
                    setTimeout(timeOutFunc, 5000 + Math.random() * 2000)
                } else if (name && revTxt && titleName && (pgNext.length === 0)) {
                    let commentData = pushData(name, revTxt)
                    resolve({commentData, titleName})
                } else {
                    reject('getDomObj error!')
                }
            }
            setTimeout(timeOutFunc, 3000 + Math.random() * 2000)
        })
    }

    function main () {
        console.log('start main func \n')

        let downloadFile = (data, fileName) => {
            let r = confirm('数据爬取完成，是否下载数据？点击确定下载数据！')
            if (r === true) {

                let blobContent = new Blob(
                    [JSON.stringify(data, null, 2)],
                    { type: 'text/plain' }
                )

                let blobUrl = window.URL.createObjectURL(blobContent)
                downloadFileByBlob(blobUrl, `${fileName}_${new Date().valueOf()}.json`)

            } else {
                console.log(data)
            }
        }

        getComment()
            .then((commentData) => {
            console.log(commentData)
            downloadFile(commentData.commentData, commentData.titleName)
        })
            .catch((error) => {
            console.log(error)
            throw new Error(error)
        })

        console.log('\n end main func')

        return -9999
    }

    let bt = document.createElement('button')
    let fa = document.getElementsByClassName('head-logo')
    let btc = document.createTextNode('爬取')
    bt.appendChild(btc)
    bt.style.cssText = "color: red; width: 50px; height: 50px; postion: position: absolute; top: 10px;"
    bt.onclick = main
    fa[0].appendChild(bt)

})();