// ==UserScript==
// @license MIT
// @name:en         Pack to download-wnacg
// @name         打包下载wnacg的图片
// @namespace    raincore
// @version      2.0.3
// @description 由于wnacg的直接下载通道无法使用，所以我想通过脚本请求每一张图片，之后打包保存。
// @description:en  Try downloading the wnacg image as a package
// @author       raincore
// @icon        http://www.wnacg.com/favicon.ico
// @match       *://*.wnacg.com/photos-index-*
// @match       *://*.wnacg.wtf/photos-index-*
// @match       *://*.wnacg.org/photos-index-*
// @match       *://*.wnacg1.com/photos-index-*
// @match       *://*.wnacg1.org/photos-index-*
// @match       *://*.wnacg1.cc/photos-index-*
// @match       *://*.hentaicomic.org/photos-index-*
// @match       *://*.wnacg.fun/photos-index-*
// @match       *://*.qy1.ru/photos-index-*
// @match       *://*.qy0.ru/photos-index-*
// @match       *://*.qy8.ru/photos-index-*
// @require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require https://cdn.staticfile.org/FileSaver.js/1.3.8/FileSaver.min.js
// @require https://cdn.staticfile.org/jszip/3.3.0/jszip.min.js
// @connect *
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/403202/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BDwnacg%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/403202/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BDwnacg%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var a = document.createElement('a');
    var tab = $('.uwthumb')[0];
    a.className = "btn";
    a.style = "width:130px;";
    a.text = "打包下载";
    a.onclick = onClick;
    tab.append(a);
    var is_downloading = false
    let curWwwPath = window.document.location.href
    var aid = curWwwPath.substring(curWwwPath.indexOf("aid") + 4, curWwwPath.lastIndexOf(".html"))
    var title = $('#bodywrap h2').text()
    var finished = 0
    var erred = 0
    var total = 0

    function request(url,overridType) {
        return new Promise((resolve, reject) => {
            let request_config = {
                url,
                method: 'GET',
                // headers: {
                //     "Cache-Control": "no-cache",
                //     referrer: referrerStr
                // },
                timeout: 100000,
                onload: response => {
                    console.log(`fetch ${url} success`)
                    resolve(response);
                },
                onabort: response => {
                    reject(`abort:${url}`);
                },
                onerror: response => {
                    reject(`error:${url}`);
                },
                ontimeout: response => {
                    reject(`timeout:${url}`);
                },
            }
            if (overridType){
                request_config['overrideMimeType'] = 'text/plain; charset=x-user-defined'
            }
            GM_xmlhttpRequest(request_config);
        })
    }
    function retry_request(url,overridType) {
        return new Promise((resolve, reject) => {
            request(url,overridType).then(resp => {
                resolve(resp)
            }).catch(e => {
                console.log(e)
                request(url).then(resp => {
                    resolve(resp)
                }).catch(e => {
                    console.log(e)
                    request(url).then(resp => {
                        resolve(resp)
                    }).catch(e => {
                        console.log(e)
                        reject(`fetch ${url} failed`)
                    })
                })
            })
        })
    }
    function getImgList(aid) {
        return new Promise((resolve, reject) => {
            retry_request("/photos-gallery-aid-" + aid + ".html",false).then(gallery_resp => {
                let rawText = gallery_resp.response;
                rawText = rawText.split('\n');
                let raw = "";
                for (let i = 2; i < rawText.length - 5; i++) {
                    rawText[i] = rawText[i].substring(18);
                    rawText[i] = rawText[i].substring(0, rawText[i].indexOf('");'));
                    rawText[i] = rawText[i].replace(/\\/g, "");
                    raw += rawText[i];
                }
                raw += 'imglist;'
                let imglist = eval(raw);
                imglist.splice(-1, 1)//去掉最后一个无用的图片
                a.text = '列表加载成功!'
                resolve(imglist)
            }).catch(e => {
                a.text = '列表加载失败!'
                reject(e)
            })
        })
    }
    function get_img(img_url) {
        return new Promise((resolve, reject) => {
            retry_request(img_url,true).then(resp => {
                let resp_text = resp.responseText;
                let data = new Uint8Array(resp_text.length);
                let i = 0;
                while (i < resp_text.length) {
                    data[i] = resp_text.charCodeAt(i);
                    i++;
                }
                resp.type
                let blob = new Blob([data], { type: `image/${getSuffix(img_url)}` });
                resolve(blob)
            }).catch(e => {
                reject()
            })
        })
    }
    function onClick() {
        if (!is_downloading) {
            startDownload()
        }
    }
    function prefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
    function updateProgress() {
        if (erred > 0) {
            a.text = `正在下载:${finished}/${total},失败:${erred}`
        } else {
            a.text = `正在下载:${finished}/${total}`
        }

    }
    function getSuffix(url){
        let suffix = 'png'
        let dot_index = url.lastIndexOf('.')
        if (dot_index>0){
            suffix = url.substring(dot_index+1)
        }
        return suffix
    }
    function startDownload() {
        let zip = new JSZip()
        let folder = zip.folder(title)
        is_downloading = true
        finished = 0
        erred = 0
        total = 0
        a.text = '开始下载...'

        getImgList(aid).then(imgList => {
            total = imgList.length
            updateProgress()
            let promises = []
            for (let i = 0; i < imgList.length; i++) {
                let p = get_img(`https:${imgList[i].url}`)
                let img_name = `${prefixInteger(i, 5)}.${getSuffix(imgList[i].url)}`
                p.then(blob => {
                    folder.file(img_name, blob, { binary: true })
                    finished++
                    updateProgress()
                }).catch(e => {
                    erred++
                    updateProgress()
                })
                promises.push(p)
            }
            Promise.all(promises).then(() => {
                a.text = '下载完成，正在压缩...'
                zip.generateAsync({ type: 'blob', base64: true },
                    metadata => {
                        a.text = "正在压缩:" + metadata.percent.toFixed(2) + " %";
                    })
                    .then(content => {
                        saveAs(content, `${title}.zip`)
                        if (erred > 0) {
                            a.text = `保存成功!其中失败${erred}个，点击重试`
                        } else {
                            a.text = '保存成功!'
                        }
                    })
            }).catch(e => {
                console.error(e)
                a.text = `出现错误，点击重试`
            })
        }).finally(() => {
            is_downloading = false
        })
    }
})();
