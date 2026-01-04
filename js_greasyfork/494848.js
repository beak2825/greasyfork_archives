// ==UserScript==
// @name         阿里云盘标清替换成最高画质
// @namespace    http://tampermonkey.net/
// @version      1.2.3.2
// @description  阿里云盘第三方权益包正式上线，未购买将无法获取到高清链接，本脚本就没什么意义了将不再更新
// @author       bygavin
// @match        https://www.aliyundrive.com/drive*
// @match        https://www.alipan.com/drive*
// @match        https://www.aliyundrive.com/s/*
// @match        https://www.alipan.com/s/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494848/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%A0%87%E6%B8%85%E6%9B%BF%E6%8D%A2%E6%88%90%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494848/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%A0%87%E6%B8%85%E6%9B%BF%E6%8D%A2%E6%88%90%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

var openapiclient_id = GM_getValue('openapiclient_id') || '55091393987b4cc090b090ee17e85e0a';
var wdusername = GM_getValue('webdav_user') || '';
var wdpassword = GM_getValue('webdav_pwd') || '';
var wdurl = GM_getValue('webdav_url') || '';
var webfullscreen = GM_getValue('webfullscreen') || false;
var authHeader = 'Basic ' + btoa(wdusername + ':' + wdpassword);
var newurl, sdlurl, isfullscreen, sinfo, openapicode_verifier, observer, storedBlob, savedevice_id, playinfo, syncing
var vtthearder = function () {
    return 'WEBVTT\n0:00:00.000 --> 0:00:02.500\n' + (document.querySelector('.header-file-name--WmDpM,.text--KBVB3')?.innerText || '') + '\n\n0:00:00.000 --> 0:00:02.500\n脚本制作人：bygavin（星峰）\n'
}
var oldxhr = unsafeWindow.XMLHttpRequest
var oldfetch = unsafeWindow.fetch
function newobj() { }
if (openapiclient_id) {
        (function (send) {
        unsafeWindow.XMLHttpRequest.prototype.send = function (sendParams) {
            const sendurl = this.__recordInfo__.url
            if (sendurl.indexOf("/file/list") > 0 || sendurl.indexOf("/file/list_by_share") > 0) {
                const oldargument = JSON.parse(sendParams)
                oldargument.limit && (oldargument.limit = 200)
                sendurl.indexOf("/file/list_by_share") <= 0 && (savedevice_id = oldargument?.drive_id)
                arguments[0] = JSON.stringify(oldargument);
            }
            send.apply(this, arguments);
        };
    })(unsafeWindow.XMLHttpRequest.prototype.send);
            unsafeWindow.XMLHttpRequest = function () {
        let tagetobk = new newobj();
        tagetobk.oldxhr = new oldxhr();
        let handle = {
            get: function (target, prop) {
                if (prop === 'oldxhr')
                    return Reflect.get(target, prop);
                if (typeof Reflect.get(target.oldxhr, prop) === 'function') {
                    if (Reflect.get(target.oldxhr, prop + 'proxy') === undefined) {
                        target.oldxhr[prop + 'proxy'] = new Proxy(Reflect.get(target.oldxhr, prop), {
                            apply: function (target, thisArg, argumentsList) {
                                return Reflect.apply(target, thisArg.oldxhr, argumentsList);
                            }
                        });
                    }
                    return Reflect.get(target.oldxhr, prop + 'proxy')
                }
                const responseURL = target.oldxhr.responseURL
                const lpfn = localStorage.getItem('last_play_file_name')?.split('›').pop()
                if (responseURL.indexOf("/file/get_video_preview_play_info") > 0 && prop.indexOf('response') !== -1) {
                    const isshare = responseURL.indexOf("/file/get_video_preview_play_info_by_share") > 0
                    const response = target.oldxhr?.response || target.oldxhr?.responseText
                    var res = JSON.parse(response);
                    res.punish_flag = 0
                    const tasklist = res?.video_preview_play_info?.live_transcoding_task_list
                    if (!lpfn) {
                        const share_token = target.oldxhr.__reqCtx__.headers["x-share-token"]
                        sinfo = { share_token: share_token, file_id: res.file_id }
                        sdlurl = ''
                        newurl = getsetnewurl(res.file_id)
                        if (newurl) {
                            newurl.length > 1 && (sdlurl = newurl[1])
                            newurl = newurl[0]
                        }
                        else {
                            var preinfo = res
                            isshare && (preinfo = savefile(res.file_id, share_token).responses[0].body)
                            newurl = getVideoPreviewPlayInfo(preinfo.drive_id, preinfo.file_id)
                            if (newurl === 'Forbidden') {
                                GM_setValue('openapitoken', null)
                                newurl = getVideoPreviewPlayInfo(preinfo.drive_id, preinfo.file_id)
                            }
                            isshare && deletefile(preinfo.file_id)
                            newurl && getsetnewurl(res.file_id, [newurl])
                        }
                        newurl && (tasklist.forEach(item => item.template_id === 'SD' && (item.url = newurl, item.preview_url = newurl)))
                        createVttBlob(res)
                        res = JSON.stringify(res);
                        if (newurl)
                            return res;
                    }
                    else {
                        sdlurl = ''
                        newurl = tasklist[0].url || tasklist[0].preview_url
                        return response;
                    }
                }
                else if (responseURL.indexOf("/file/get_video_preview_play_info") > 0 && prop === "statusText")
                    morerate()
                else if ((responseURL.indexOf("/file/list") > 0 || responseURL.indexOf("/file/list_by_share") > 0) && prop === "statusText" && lpfn && observer === undefined) {
                    observer = new MutationObserver(function () {
                        if (document.querySelector('.text-primary--JzAb9,.node-card-container--TLrx5')) {
                            observer.disconnect();
                            const lastvideo = document.querySelector('.text-primary--JzAb9[title="' + lpfn + '"],.node-card-container--TLrx5[title="' + lpfn + '"] p');
                            const anyvideo = document.querySelector('img[alt="video"]')
                            lastvideo ? (localStorage.removeItem('last_play_file_name'), lastvideo.click()) : (anyvideo ? anyvideo.click() : localStorage.removeItem('last_play_file_name'))
                        }
                    });
                    observer.observe(document, { childList: true, subtree: true });
                }
                return Reflect.get(target.oldxhr, prop);
            },
            set(target, prop, value) {
                return Reflect.set(target.oldxhr, prop, value);
            },
            has(target, key) {
                return Reflect.has(target.oldxhr, key);
            }
        }
        return new Proxy(tagetobk, handle);
    }
            unsafeWindow.fetch = function (...bianliang) {
        return new Promise(function (resolve) {
            oldfetch(...bianliang).then(function (response) {
                let handler = {
                    get: function (target, prop) {
                        if (typeof Reflect.get(target, prop) === 'function') {
                            if (Reflect.get(target, prop + 'proxy') === undefined) {
                                target[prop + 'proxy'] = (...funcargs) => {
                                    let result = target[prop].call(target, ...funcargs)
                                    if (bianliang.length > 0 && prop === 'blob' && bianliang[0].startsWith('blob')) {
                                        return new Promise(function (resolve) {
                                            result.then(
                                                function (data) {
                                                    resolve(bianliang[0].endsWith('#bygavin') && storedBlob ? new Blob([storedBlob], { type: 'application/octet-stream;charset=utf-8;' }) : data)
                                                }
                                            )
                                        });
                                    }
                                    return result
                                }
                            }
                            return Reflect.get(target, prop + 'proxy')
                        }
                        return Reflect.get(target, prop);
                    },
                    set(target, prop, value) {
                        return Reflect.set(target, prop, value);
                    },
                };
                resolve(new Proxy(response, handler))
            })
        });
    }
    }


function getVideoPreviewPlayInfo(drive_id, file_id, times) {
    times = times || 0
    const access_token = getopenapitoken();
    var xhr = new oldxhr();
    xhr.open("POST", "https://openapi.aliyundrive.com/adrive/v1.0/openFile/getVideoPreviewPlayInfo", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", access_token);
    xhr.send(JSON.stringify({ "drive_id": drive_id, "file_id": file_id, "category": "live_transcoding", "url_expire_sec": 14400 }));
    if (xhr.status === 200)
        return JSON.parse(xhr.responseText).video_preview_play_info?.live_transcoding_task_list.pop().url
    else if (xhr.statusText === 'Bad Request' && times < 3)
        return getVideoPreviewPlayInfo(drive_id, file_id, ++times)
    else
        return xhr.statusText
}
function getDownloadUrl(drive_id, file_id) {
    const access_token = getopenapitoken();
    var xhr = new oldxhr();
    xhr.open("POST", "https://openapi.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", access_token);
    xhr.send(JSON.stringify({ "drive_id": drive_id, "file_id": file_id, "expire_sec": 14400 }));
    return xhr.status === 200 ? JSON.parse(xhr.responseText).url : xhr.statusText;
}
function savefile(sharefileid, share_token) {
    const token = JSON.parse(localStorage.getItem('token'))
    const saveinfo = GM_getValue('saveinfo') || {}
    const shareid = location.pathname.split('/')[2]
    const sharefiles = [sharefileid].flat().map((item, index) => { return { "body": { "file_id": item, "share_id": shareid, "auto_rename": true, "to_parent_file_id": saveinfo?.savefile_id || 'root', "to_drive_id": saveinfo?.savedevice_id || token.default_drive_id }, "headers": { "Content-Type": "application/json" }, "id": index + "", "method": "POST", "url": "/file/copy" } })
    const savedata = { "requests": sharefiles, "resource": "file" }
    var xhr = new oldxhr();
    xhr.open("POST", "https://api.aliyundrive.com/adrive/v3/batch", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", token.access_token);
    xhr.setRequestHeader("X-Share-Token", share_token);
    xhr.send(JSON.stringify(savedata));
    return xhr.status === 200 ? JSON.parse(xhr.responseText) : xhr.statusText;
}
function deletefile(file_id) {
    const token = JSON.parse(localStorage.getItem('token'))
    const saveinfo = GM_getValue('saveinfo') || {}
    const files = [file_id].flat().map(item => { return { "body": { "drive_id": saveinfo?.savedevice_id || token.default_drive_id, "file_id": item }, "headers": { "Content-Type": "application/json" }, "id": item, "method": "POST", "url": "/file/delete" } })
    const deleteinfo = { "requests": files, "resource": "file" }
    var xhr = new oldxhr();
    xhr.open("POST", "https://api.aliyundrive.com/adrive/v3/batch", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", token.access_token);
    xhr.send(JSON.stringify(deleteinfo));
    return xhr.status === 200 ? JSON.parse(xhr.responseText) : xhr.statusText;
}
function getopenapicode() {
    openapicode_verifier = new Date().getTime();
    const accesstk = JSON.parse(localStorage.getItem('token')).access_token
    var xhr = new oldxhr();
    var url = 'https://open.aliyundrive.com/oauth/users/authorize';
    var data = { scope: 'user:base,file:all:read,file:all:write', authorize: 1, drives: ['backup', 'resource'] };
    var params = '?client_id=' + openapiclient_id + '&redirect_uri=oob&scope=user:base,file:all:read,file:all:write&code_challenge=' + openapicode_verifier + '&code_challenge_method=plain';
    xhr.open('POST', url + params, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('authorization', 'Bearer ' + accesstk);
    xhr.send(JSON.stringify(data));
    return xhr.status === 200 ? JSON.parse(xhr.responseText).redirectUri.split('=')[1] : xhr.statusText;
}
function getopenapitoken() {
    const nowtime = new Date().getTime();
    const openapitoken = GM_getValue('openapitoken') || {}
    if (openapitoken?.access_token && openapitoken.createdate + openapitoken.expires_in > nowtime)
        return openapitoken.access_token
    const openapicode = getopenapicode()
    var xhr = new oldxhr();
    var url = 'https://openapi.aliyundrive.com/oauth/access_token';
    var data = { client_id: openapiclient_id, grant_type: 'authorization_code', code: openapicode, code_verifier: openapicode_verifier }
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    if (xhr.status === 200) {
        const tokejson = JSON.parse(xhr.responseText)
        tokejson.createdate = nowtime
        NewGM_setValue('openapitoken', tokejson)
        return tokejson.access_token;
    } else
        return (xhr.statusText);
}
function createVttBlob(json) {
    const blob = new Blob([vtthearder()], { type: 'application/octet-stream;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    let sublist = json.video_preview_play_info?.live_transcoding_subtitle_task_list || []
    if (sublist.length > 0) {
        const newsublist = []
        var xhr = new oldxhr();
        sublist.forEach(function (item) {
            xhr.open('GET', item.url, false);
            xhr.send();
            if (xhr.status === 200) {
                const subvalue = xhr.responseText
                if (subvalue.length > 1000) {
                    const newblob = new Blob([subvalue.replace('WEBVTT', vtthearder())], { type: 'application/octet-stream;charset=utf-8;' });
                    item.url = URL.createObjectURL(newblob) + "#byweb";
                    newsublist.push(item)
                }
            }
        })
        sublist = newsublist
    }
    sublist.push({ "status": "finished", url: url + "#bygavin" })
    json.video_preview_play_info.live_transcoding_subtitle_task_list = sublist
}
function NewGM_setValue(key, value) {
    GM_setValue('timestamp', new Date().getTime())
    GM_setValue(key, value)
}
function addkeyboardevent(e) {
    const videoElement = document.querySelector('video')
    var isvideo = true
    let volume = parseInt(videoElement.volume * 100)
    const volumeflag = volume < 6 ? 1 : volume < 33 ? 5 : 10
    if (e && e.key === 'ArrowLeft') videoElement.currentTime -= 5
    else if (e && e.key === 'ArrowRight') videoElement.currentTime += 5;
    else if (e && e.key === 'ArrowUp') volume += volumeflag;
    else if (e && e.key === 'ArrowDown') volume -= volumeflag;
    else isvideo = false
    videoElement.volume = (volume > 100 ? 100 : volume < 0 ? 0 : volume) / 100
    return isvideo
}
document.addEventListener('keydown', function (e) {
    if (document.querySelector('video')) {
        (e.key === 'Home' || e.key === 'End') && changevideo(e.key === 'Home' ? -1 : 1)
        e.key === 'Enter' && document.querySelector('.action--HeWYA:not([data-active])').click()
        addkeyboardevent(e)
    }
    if (e.altKey && e.code == 'KeyS') {
        savedevice_id && confirm("确定设置此目录为临时转存目录") && NewGM_setValue("saveinfo", { savedevice_id: savedevice_id, savefile_id: (this.location.pathname.split('/')[4] || 'root') })
    }
    else if (e.altKey && e.code == 'KeyD') {
        var userInput = prompt("输入阿里云盘开放平台的client_id");
        if (userInput !== null) {
            NewGM_setValue('openapiclient_id', userInput)
            openapiclient_id = userInput;
            NewGM_setValue('openapitoken', null)
        }
    }
});
document.addEventListener('wheel', function (event) {
    const videoElement = document.querySelector('video')
    if (event.target === videoElement) {
        let volume = parseInt(videoElement.volume * 100)
        const volumeflag = volume < 6 ? 1 : volume < 33 ? 5 : 10
        volume += volumeflag * (event.deltaY > 0 ? -1 : 1);
        videoElement.volume = (volume > 100 ? 100 : volume < 0 ? 0 : volume) / 100
    }
    else if (event.target.tagName === "INPUT" && event.target.type === "time") {
        const times = event.target.value.split(':')
        const maxtimes = event.target.max.split(':')
        const changeindex = event.offsetX > 30 ? 2 : 1
        let newvalue = parseInt(times[changeindex]) + (event.deltaY > 0 ? -1 : 1)
        let maxvalue = parseInt(maxtimes[changeindex])
        newvalue > maxvalue && (newvalue = 0)
        newvalue < 0 && (newvalue = maxvalue)
        times[changeindex] = ("0" + (newvalue)).slice(-2);
        event.target.value = times.join(':')
    }
})
function morerate() {
    storedBlob = null
    let playbackRate = GM_getValue("playbackRate") || 1
    let video = document.querySelector("video");
    if (video) {
        video.onplay = function () {
            video.playbackRate = playbackRate
            video.volume = GM_getValue('volume') || 1
            video.volume < 1 && (video.volume += .01, video.volume -= .01)
            setTimeout(() => {
                const allsubel = document.querySelectorAll('.meta--iPZhB')
                const subInput = allsubel[allsubel.length - 1]
                subInput.querySelector('.text--G8ymN').textContent = '本地外挂字幕'
                subInput.querySelector('.text--G8ymN').title = '本地外挂字幕'
            }, 0)
            playing();
        };
    }
    else
        return
    const ul = document.querySelector('div[class^="drawer-list-grid"]')
    if (!ul || !video || document.querySelector('.btndownload'))
        return
    addsubcolor();
    adddownloadbut();
    setfullscreen();
    video.addEventListener('dblclick', function () {
        document.querySelector('.video-player--k1J-M .btn--UrTVT').click()
    });
    video.addEventListener('mousedown', function (event) {
        event.button === 1 && document.querySelector('.action--HeWYA:not([data-active])').click()
    });
    video.addEventListener('volumechange', function () {
        NewGM_setValue('volume', video.volume)
        const volume = video.volume * 100
        let volumelevel = parseInt((volume - 2) / 33) + 1
        volumelevel = volume == 0 ? 0 : volumelevel
        Array.from(document.querySelectorAll('.current--Dbz2w.current--0tS5B')).pop().style.width = volume + '%'
        Array.from(document.querySelectorAll('.indicator--oPSic.indicator--qlLq-')).pop().style = `left: ${volume}%; transform: translate(-${volume}%, -50%);`
        Array.from(document.querySelectorAll('.icon--EkKaB.icon--D3kMk use')).pop().setAttribute('xlink:href', '#PDSvolume' + volumelevel)
    })
    video.parentElement.parentElement.removeEventListener('keydown', null);
    video.parentElement.parentElement.addEventListener('keydown', function (e) {
        document.querySelector('.drawers--t3zFN').contains(e.target) ? e.stopPropagation() : addkeyboardevent(e) && e.stopPropagation()
    })
    function closeupdate() { updateConfigIfNecessary(); }
    const closebtn = document.querySelector('.header-left--Kobd9:not(.closebtn),.header-icon--zUd3C.icon--D3kMk:not(.closebtn)')
    if (closebtn) {
        const newfathernode = closebtn.parentElement.parentElement
        closebtn.parentNode.removeChild(closebtn);
        if (closebtn.tagName === 'SPAN') {
            newfathernode.insertAdjacentHTML('beforeend', '<div class="header-left--Kobd9 closebtn"></div>');
            newfathernode.querySelector('.closebtn').appendChild(closebtn);
            closebtn.setAttribute('class', 'icon--BObaC icon--D3kMk')
            closebtn.setAttribute('style', 'width:28px;height:28px;')
        } else {
            closebtn.classList.add('closebtn')
            newfathernode.appendChild(closebtn);
        }
        closebtn.removeEventListener('click', closeupdate)
        closebtn.addEventListener('click', closeupdate)
    }
    const selector = ul.parentElement
    ul.remove()
    var playhistory = GM_getValue('playhistory') || []
    var file_path = location.pathname
    var index = playhistory.findIndex(item => item.file_path === file_path)
    playinfo = index === -1 ? { file_path: file_path } : playhistory[index]
    selector.innerHTML += `<ul class="drawer-list--qzUDz"><li class="drawer-item--22XTO playbackRate" data-is-current="true"><div class="text--dp1BR"  style="margin:auto">${playbackRate} 倍速</div><span data-role="icon" style="position: absolute;right: 10px;" data-render-as="svg" data-icon-type="PDSCheckmark"class="icon--TBY0u icon--D3kMk "><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSCheckmark"></use></svg></span></li></ul>`
    const ratelist = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16]
    let moreratehtml = `<ul class="drawer-list--qzUDz ratemenulist" style="position:absolute;width:100%;top:15px;overflow:hidden;height:111px;padding-top:0px;padding-bottom:0px;display:none"><div style="width:91%;position:absolute;">${[ratelist[ratelist.length - 1], ...ratelist, ratelist[0]].map(ratenub => { return `<li class="drawer-item--22XTO" data-is-current="false"><div class="text--dp1BR" style="margin:auto">${ratenub} 倍速</div></li>` }).join('')}</div></ul><div class="drawer-label--FWKBs" ><span>跳过片头时长</span><div class="media-label-action--PwF31" style="margin:auto;" settype="default" >设置默认</div><span>跳过片尾时长</span><div></div></div><div class="drawer-label--FWKBs setautojump"><div class="media-label-action--PwF31" settype="start" >设置</div><input class="ant-input ant-input-borderless input--TWZaN" type="time" value="${playinfo?.startTime || "00:00:00"}" min="00:00:00" max="00:09:59" step="1" ></input><div class="media-label-action--PwF31" style="margin:auto;" settype="now" >设置播放进度</div><input class="ant-input ant-input-borderless input--TWZaN" type="time" value="${playinfo?.endTime || "00:00:00"}" min="00:00:00" max="00:09:59" step="1"></input><div class="media-label-action--PwF31" settype="end" >设置</div></div>`
    selector.innerHTML += moreratehtml
    const playbr = document.querySelector('.playbackRate')
    const ratemenulist = document.querySelector('.ratemenulist')
    const nowratediv = playbr.querySelector('div')
    playbr.addEventListener('click', (e) => {
        let nowrate = parseFloat(nowratediv.textContent.replace(' 倍速', ''))
        nowratediv.textContent = '　'
        ratemenulist.style.display = 'block'
        const nowrateindex = ratelist.indexOf(nowrate)
        ratemenulist.firstChild.style.top = (nowrateindex * -37) + 'px';
        e.stopPropagation();
    })
    ratemenulist.addEventListener('click', (event) => {
        let newSpeedStr = ''
        event.target.tagName === 'LI' && (newSpeedStr = event.target.firstChild.textContent)
        event.target.tagName === 'DIV' && (newSpeedStr = event.target.textContent)
        playbackRate = parseFloat(newSpeedStr.replace(' 倍速', ''));
        video.playbackRate = playbackRate
        NewGM_setValue("playbackRate", playbackRate)
        nowratediv.textContent = newSpeedStr;
        ratemenulist.style.display = 'none';
    })
    ratemenulist.addEventListener('wheel', function (event) {
        event.preventDefault();
        const flag = (event.deltaY > 0 ? -1 : 1);
        let newtop = parseInt(ratemenulist.firstChild.style.top.replace('px', '')) + flag * 37
        let mintop = -37 * (ratelist.length - 1)
        newtop > 0 && (newtop = mintop)
        newtop < mintop && (newtop = 0)
        ratemenulist.firstChild.style.top = newtop + 'px';
    });
    selector.addEventListener("click", (event) => {
        const target = event.target
        const classList = target.classList
        if (!target.classList.contains('playbackRate')) {
            ratemenulist.style.display = 'none';
            nowratediv.textContent = playbackRate + ' 倍速';
        }
        if (classList.contains('media-label-action--PwF31')) {
            let buttype = target.getAttribute('settype')
            const timetxts = document.querySelectorAll('input[type="time"]')
            let t = ''
            var playhistory = GM_getValue('playhistory') || []
            var file_path = location.pathname
            var index = playhistory.findIndex(item => item.file_path === file_path)
            playinfo = index === -1 ? { file_path: file_path } : playhistory[index]
            if (buttype === 'default') {
                const defaulttime = '00:02:00'
                playinfo.startTime = defaulttime
                playinfo.endTime = defaulttime
                timetxts[0].value = defaulttime
                timetxts[1].value = defaulttime
            }
            else {
                if (buttype === 'now') {
                    t = parseInt(video.currentTime);
                    buttype = t < video.duration / 2 ? 'start' : 'end';
                    t = buttype === 'start' ? t : parseInt(video.duration - t)
                    t = Math.min(t, 599)
                    let date = new Date(t * 1000);
                    t = ("0" + (date.getHours() - 8)).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2)
                    timetxts[buttype === 'start' ? 0 : 1].value = t
                }
                else
                    t = timetxts[buttype === 'start' ? 0 : 1].value
                buttype === 'start' ? (playinfo.startTime = t) : (playinfo.endTime = t)
            }
            index === -1 && playhistory.unshift(playinfo)
            NewGM_setValue('playhistory', playhistory)
        }
    })
}
function playing() {
    const lpfn = localStorage.getItem('last_play_file_name')?.split('›').pop()
    if (lpfn) {
        document.querySelector('.title--RYadk[title="' + lpfn + '"]')?.click()
        localStorage.removeItem('last_play_file_name')
    }
    else {
        const video = document.querySelector('video')
        let file_id = new URLSearchParams(newurl).get('f')
        const playhistory = GM_getValue('playhistory') || []
        let file_path = location.pathname
        const index = playhistory.findIndex(item => item.file_path === file_path)
        playinfo = index === -1 ? { file_path: file_path } : playhistory[index]
        var listItems = Array.from(document.querySelectorAll('.list--5o17x li'));
        listItems.length && listItems.find(li => li.getAttribute('data-is-current') === 'true').scrollIntoView({ behavior: 'smooth', block: 'center' })
        const currentTime = JSON.parse(localStorage.getItem('currentTime') || '{}')
        if (currentTime?.currentTime) {
            const currentTimeindex = playhistory.findIndex(item => item.file_path === currentTime.file_path)
            if (currentTimeindex !== -1) {
                playhistory[currentTimeindex].currentTime = currentTime.currentTime
                index === currentTimeindex && (playinfo.currentTime = currentTime.currentTime)
            }
        }
        if (playinfo.currentTime && playinfo.file_id === file_id)
            video.currentTime = playinfo.currentTime
        else if (playinfo.startTime)
            video.currentTime = playinfo.startTime.split(':').reduce((acc, v) => 60 * acc + +v);
        const nameel = document.querySelectorAll('.breadcrumb--gnRPG[data-calc="true"] .breadcrumb-item--j8J5H,.header-file-name--WmDpM,.text--KBVB3')
        playinfo.file_id = file_id
        playinfo.file_name = Array.from(nameel).slice(1).map(element => element.textContent || element.innerText).join('');
        index !== -1 && playhistory.splice(index, 1)
        playhistory.unshift(playinfo)
        NewGM_setValue('playhistory', playhistory.slice(0, 10))
        video.removeEventListener('timeupdate', null)
        video.addEventListener('timeupdate', function () {
            video.currentTime && localStorage.setItem('currentTime', JSON.stringify({ file_path: file_path, currentTime: video.currentTime }))
            playinfo.endTime && video.currentTime > video.duration - playinfo.endTime.split(':').reduce((acc, v) => 60 * acc + +v) && changevideo(1)
            video.currentTime >= video.duration - 2 && changevideo(1)
        })
    }
}
const settingsvg = '<svg style="cursor: pointer;" fill="#637dff" height="1.5em" width="2em"><use xlink:href="#PDSsetting"></use></svg>'
const potplayerdiv = '<svg class="potplayerdiv" fill="#637dff" width="3em" height="3em"><use xlink:href="#PDSPlayBoxFill"></use></svg>'
function setStyle() {
    function ColorReverse(OldColorValue) {
        var OldColorValue = '0x' + OldColorValue.replace(/#/g, "");
        var str = '000000' + (0xFFFFFF - OldColorValue).toString(16);
        return '#' + str.substring(str.length - 6, str.length);
    }
    const fontcolor = GM_getValue('fontColor') || '#ffffff'
    const fontborder = GM_getValue('fontborderColor') || ColorReverse(fontcolor)
    document.querySelector('#newsetstyle')?.remove();
    var style = document.createElement('style');
    style.id = 'newsetstyle'
    style.innerHTML = `
    #playhistory-panel .breadcrumb-item-link--9zcQY,#webdav-panel .breadcrumb-item-link--9zcQY{color:var(--theme_hover)}
    .history-item{display:flex;margin-bottom:10px}.history-item .breadcrumb-item--j8J5H{max-width:50%}.history-item .breadcrumb-item-link--9zcQY{overflow: hidden;text-overflow: ellipsis;}
    .potplayerdiv{position:relative;right:-47px;transition:right 0.3s}.potplayerdiv:hover{fill:var(--theme_hover);right:0px;}.membership-wrapper--6egJF:hover{.potplayerdiv{fill:var(--theme_hover);right:0px;}}
    #playhistory-panel,#webdav-panel{position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:99}
    #playhistory-panel>div,#webdav-panel>div{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);width:800px}
    #webdav-panel .ant-input{box-shadow:0 0 0 1px var(--theme_primary)}
    .btnsetting{position:absolute;right:10px}
    .btnsetting:hover>.mymemu:not(:empty){display:flex}
    .mymemu{position:relative;display:none;top:-20px}
    .mymemu button{padding:5px 10px;border:none;color:#fff;border-radius:4px;cursor:pointer;margin-top:15px;margin-right:10px}
    .breadcrumb--gnRPG.play-button:hover{color:rebeccapurple}
    body:has(video){.header-actions--M4C21{margin-left:auto}#fontborder{display:flex;margin-right: 10px;cursor: pointer;}
    .closebtn {-webkit-transform: translateY(-50%);top:20px !important;left:10px !important;;z-index:999;position:absolute}div:not(.closebtn)>span[data-icon-type="PDSClose"]{display:none !important}
    .media-label-action--PwF31[settype]{margin-left:2px;margin-right:2px;color:white}
    .media-label-action--PwF31[settype]:hover{color:var(--theme_primary)}
    input[type="time"]{color:white !important;text-indent:-11px;width:61px;height:27px;top:-3px}
    input[type="time"]::-webkit-inner-spin-button,input[type="time"]::-webkit-calendar-picker-indicator{display:none;-webkit-appearance:none}
    .action--H2mi0:first-of-type,.drawers--t3zFN .drawer-container--tMDPx:first-of-type .title--6eEg9{text-indent:-9999px;display:flex}
    .action--H2mi0:first-of-type::after,.drawers--t3zFN .drawer-container--tMDPx:first-of-type .title--6eEg9::after{content:"设置";text-indent:0px}
    .list--5o17x,.scroll-container--MsQem{scrollbar-width:none;-ms-overflow-style:none}
    :fullscreen .video-player--k1J-M{bottom:0px;opacity:0 !important}
    .video-player--k1J-M{bottom:-80px;opacity:0.8 !important;width:595px}
    .text-primary--3DHOJ{overflow:visible;font-weight:bold}
    .loader--3P7-4,.loader--zXBWG{opacity:0.8 !important}
    .outer-wrapper--3ViSy{opacity:0 !important}
    .outer-wrapper--3ViSy:hover,.video-player--k1J-M:hover{opacity:0.8 !important}
    .ant-tooltip-inner,.button--1pH7M,.container--CIvrv,.loading--zyXaT,.ended-container--Tz5lR,.content-wrapper--A93tB,.feature-blocker--vh7jp,.sign-bar--1XrSl,.ai-summary-btn--fQnJ{display:none !important}
    ${webfullscreen ? '.video-previewer--6slx7,.video-previewer--Rg9fI{padding:0}.header--u7XR-,.header--96Glp,.toolbar-wrapper--SUoJx{display:none !important}.video-player--k1J-M{bottom: 0px;opacity:0!important;}' : ''}
    .cue--rlq6T,#colorPreview{color:${fontcolor} !important;cursor: pointer;}
    :has(#fontborder.PDSCheckmarkFill){.cue--rlq6T,#colorPreview{text-shadow: -1px -1px ${fontborder}, 1px -1px ${fontborder}, -1px 1px ${fontborder}, 1px 1px ${fontborder} !important;}}
    }`;
    document.head.appendChild(style);
}
setStyle();
function getsetnewurl(file_id, setnewurl) {
    const today = new Date().toLocaleDateString()
    const newurls = GM_getValue('newurls') || {}
    newurls.date = newurls?.date || today
    if (setnewurl) {
        newurls[file_id] = setnewurl;
        NewGM_setValue('newurls', newurls)
    }
    else {
        if (today === newurls.date) {
            let geturl = newurls[file_id]
            if (geturl) {
                if (typeof geturl === "string")
                    geturl = [geturl]
                const newsearch = new URLSearchParams(geturl[0])
                if (parseInt(newsearch.get('x-oss-expires') + '000') < new Date().getTime())
                    geturl = undefined
            }
            return geturl
        }
        else {
            NewGM_setValue('newurls', null)
            return undefined;
        }
    }
}
function setfullscreen() {
    isfullscreen && document.fullscreenElement === null && document.querySelector('.action--HeWYA:not([data-active])').click()
    document.querySelector('.video-player--k1J-M .btn--UrTVT').click()
    var elements = document.querySelectorAll('.list--5o17x li, .next--k9RTS');
    elements.forEach(function (element) {
        element.addEventListener('click', function () {
            isfullscreen = document.fullscreenElement !== null
        });
    });
}
function addsubcolor() {
    const fontcss = GM_getValue('fontColor') || '#ffffff'
    const fontbordercss = GM_getValue('fontbordercss') || 'PDSCheckmark1'
    document.querySelectorAll('.scroll-wrapper--aByOe .drawer-label--FWKBs')[1].insertAdjacentHTML('beforeend', '<input value="' + fontcss + '" style="margin-left: auto;margin-right: 33px;top:-50px;position:relative;" type="color" id="colorInput"><span id="fontborder" class="' + fontbordercss + '"><svg fill="#637dff" width="1.5em" height="1.5em"><use xlink:href="#' + fontbordercss + '"></use></svg>边框颜色</span><span id="colorPreview">字幕颜色</span>')
    var colorInput = document.querySelector('#colorInput');
    var colorPreview = document.querySelector('#colorPreview');
    colorPreview.addEventListener('click', () => { colorInput.click(); });
    colorInput.addEventListener('change', function () {
        NewGM_setValue(colorInput.getAttribute('colorType') ? 'fontborderColor' : 'fontColor', colorInput.value)
        colorInput.removeAttribute('colorType')
        setStyle();
    });
    const fontborder = document.querySelector('#fontborder')
    fontborder.addEventListener('click', (e) => {
        if (e.target.tagName.toUpperCase() !== 'SPAN') {
            let newcss = fontborder.classList.contains('PDSCheckmark1') ? 'PDSCheckmarkFill' : 'PDSCheckmark1'
            fontborder.removeAttribute('class')
            fontborder.classList.add(newcss)
            fontborder.querySelector('svg use').setAttribute('xlink:href', '#' + newcss)
            NewGM_setValue('fontbordercss', newcss)
        }
        else {
            colorInput.setAttribute('colorType', 'border');
            colorInput.click();
        }
    })
    const loadsubbtn = document.querySelector('.meta--iPZhB').parentElement.parentElement
    loadsubbtn.insertAdjacentHTML('beforeend', loadsubbtn.innerHTML.replace('手动添加外挂字幕', '添加本地外挂字幕').replace('data-is-current', 'style="margin-left: auto;" data-is-current'))
    loadsubbtn.style.display = 'flex'
    loadsubbtn.querySelectorAll('li .meta--iPZhB')[1].parentElement.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                storedBlob = event.target.result;
                file.name.toLowerCase().endsWith('.ass') && (storedBlob = convertAssToVtt(storedBlob))
                file.name.toLowerCase().endsWith('.srt') && (storedBlob = convertSrtToVtt(storedBlob))
                document.body.removeChild(input);
                document.querySelector('.action--H2mi0[data-active="true"]')?.click()
                const subInput = Array.from(document.querySelectorAll('.meta--iPZhB')).pop()
                subInput.querySelector('.text--G8ymN').textContent = file.name
                subInput.querySelector('.text--G8ymN').title = file.name
                subInput.parentElement.getAttribute('data-is-current') === 'true' && subInput.click()
                subInput.click()
            };
            reader.readAsText(file);
        });
        input.click()
    })
}
function convertAssToVtt(assSubtitles) {
    const assLines = assSubtitles.split('\n');
    let vttOutput = vtthearder();
    assLines.forEach((line) => {
        if (!line.trim() || line.trim().startsWith(';') || !line.trim().startsWith('Dialogue:')) return;
        const lines = line.split(',');
        const startTime = lines[1];
        const endTime = lines[2];
        const text = lines.slice(9).join(',');
        const startTimeVtt = convertAssTimeToVttTime(startTime);
        const endTimeVtt = convertAssTimeToVttTime(endTime);
        vttOutput += `\n${startTimeVtt} --> ${endTimeVtt}\n${text}\n`
    });
    return vttOutput;
}
function convertAssTimeToVttTime(assTime) {
    const assTimes = assTime.split('.')
    const parts = ('00:00:00:' + assTimes[0]).split(':').map(part => part.padStart(2, '0'));
    const seconds = parts.pop();
    const minutes = parts.pop();
    const hours = parts.pop();
    const milliseconds = (assTimes[1] || '').padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds.substring(milliseconds.length - 3)}`;
}
function convertSrtToVtt(srtSubtitles) {
    const assLines = srtSubtitles.split('\n');
    let vttOutput = vtthearder();
    assLines.forEach((line) => {
        if (/^\d+$/.test(line.trim())) return;
        line.indexOf('-->') !== -1 && (line = line.replaceAll(',', '.'))
        vttOutput += line + '\n';
    });
    return vttOutput;
}
function adddownloadbut() {
    function createdla(ispotplayer) {
        const dl = document.createElement('a');
        if (!sdlurl) {
            const sss = new URLSearchParams(newurl)
            const sfile_id = sss.get('f')
            const newurls = GM_getValue('newurls') || {}
            if (selffile) {
                sdlurl = getDownloadUrl(sss.get('dr'), sfile_id)
                newurls[sfile_id] = [newurl, sdlurl]
            }
            else {
                const saveinfo = savefile(sinfo.file_id, sinfo.share_token).responses[0].body
                sdlurl = getDownloadUrl(saveinfo.drive_id, saveinfo.file_id)
                deletefile(saveinfo.file_id)
                newurls[sinfo.file_id] = [newurl, sdlurl]
            }
            NewGM_setValue('newurls', newurls)
        }
        // + 
        dl.href = ispotplayer ? ('potplayer://' + sdlurl + (sdlurl.length < 2018 ? ('%20/seek=' + new Date(document.querySelector('video').currentTime * 1000).toISOString().substr(12, 7)) : '')) : sdlurl
        dl.download = ''
        if (sdlurl.length > 2034 && ispotplayer) {
            GM_setClipboard(sdlurl)
            dl.href = 'potplayer://https://cn-beijing-data.aliyundrive.net/show?response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27URL已复制，请粘贴播放'
        }
        dl.click();
    }
    const selffile = location.pathname.startsWith('/drive/file')
    const div = document.querySelector('.actions--YfXrK')
    div.insertAdjacentHTML('beforeend', '<div class="action--H2mi0 btndownload" data-active="false" data-disabled="false">下载</div>');
    document.querySelector('.btndownload').addEventListener("click", () => {
        createdla()
    })
    div.insertAdjacentHTML('beforeend', '<div class="action--H2mi0 btnpotplay" data-active="false" data-disabled="false"><span style="width: 25px;height: 25px;fill: white;" ><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSPlayBoxFill"></use></svg></span></div>');
    document.querySelector('.btnpotplay').addEventListener('click', () => {
        createdla(true)
    })
    setTimeout(() => {
        const allmenubtn = document.querySelectorAll('.action--H2mi0:not(.btndownload,.btnpotplay)')
        let showtime = []
        allmenubtn.forEach(function (element, index) {
            showtime.push(false)
            const allshowdiv = document.querySelectorAll('.drawer-container--tMDPx')
            const menudiv = allshowdiv[index + allshowdiv.length - allmenubtn.length];
            [element, menudiv].forEach((el) => {
                el.addEventListener('mouseenter', function () {
                    if (!document.querySelector('.action--H2mi0:not(.btndownload,.btnpotplay)[data-active="true"]')) {
                        showtime[index] && clearTimeout(showtime[index])
                        showtime[index] = setTimeout(() => {
                            menudiv.setAttribute('data-open', 'true')
                            menudiv.style.height = '384px'
                        }, 111);
                    }
                });
                el.addEventListener('mouseleave', function () {
                    if (!document.querySelector('.action--H2mi0:not(.btndownload,.btnpotplay)[data-active="true"]')) {
                        showtime[index] && clearTimeout(showtime[index])
                        showtime[index] = setTimeout(() => {
                            menudiv.setAttribute('data-open', 'false')
                            menudiv.style.height = '68px'
                        }, 111);
                    }
                });
            })
        });
    }, 0)
    const fulldiv = document.querySelector('.action--HeWYA:not([data-active])')
    const newdiv = document.createElement('div')
    fulldiv.parentNode.insertBefore(newdiv, fulldiv);
    newdiv.outerHTML = '<div class="action--HeWYA webfullscreen" data-disabled="false" data-active="false"><span data-role="icon" data-render-as="svg" data-icon-type="PDSArrowRULD" class="icon--D3kMk "><svg viewBox="0 0 1024 1024" style="transform: rotate(-45deg);"><use xlink:href="' + (webfullscreen ? '#PDSArrowLDRU' : '#PDSArrowRULD') + '"></use></svg></span></div>'
    const webfulldiv = document.querySelector('.webfullscreen')
    webfulldiv.addEventListener('click', () => {
        if (document.fullscreenElement === null) {
            webfullscreen = !webfullscreen
            webfulldiv.querySelector('use').setAttribute('xlink:href', webfullscreen ? '#PDSArrowLDRU' : '#PDSArrowRULD')
            NewGM_setValue('webfullscreen', webfullscreen)
            setStyle()
        }
    })
}
function changevideo(direction) {
    var listItems = Array.from(document.querySelectorAll('.list--5o17x li'));
    var currentIndex = listItems.findIndex(li => li.getAttribute('data-is-current') === 'true');
    if ((direction === -1 && currentIndex > 0) || (direction === 1 && currentIndex < listItems.length - 1)) {
        isfullscreen = document.fullscreenElement !== null
        listItems[currentIndex + direction]?.click();
    }
}
(function () {
    !localStorage.getItem('last_play_file_name') && updateConfigIfNecessary();
    var settingsButton = document.createElement('div');
    settingsButton.innerHTML = `<div style="position: fixed; right: 0px; bottom:0px; z-index:112;border:none;width:auto;" class='membership-wrapper--6egJF'>${potplayerdiv}</div>`;
    document.body.appendChild(settingsButton);
    settingsButton.addEventListener('click', showManagementPanel);
    new MutationObserver(function () {
        document.querySelector('.error--3ZTlN') && document.querySelector('.video-player--k1J-M .btn--UrTVT').click()
    }).observe(document.body, { childList: true, subtree: true });
})()
function showManagementPanel() {
    document.querySelector('#webdav-panel,#playhistory-panel')?.remove()
    var playlist = GM_getValue('playhistory') || [];
    var panel = document.createElement('div');
    panel.id = 'playhistory-panel';
    panel.innerHTML =
        `<div><div style="display: flex; "><h2 style="margin-top: 0; margin-bottom: 10px; font-size: 24px;">历史播放记录</h2><div style="display: flex; justify-content: flex-end;top:30px" class="btnsetting"><div class="mymemu" style="right:0px"><button class="reset-button" playinfo-index="-1" style="background-color: #ffa31a;">重置所有设置</button><button class="clear-button" playinfo-index="-1" style="background-color: #ff4d4f;">清空播放记录</button><button class="webdav-button" playinfo-index="-1" style="background-color: #00c270;">WebDav设置</button></div>${!syncing ? settingsvg : ''}</div></div><hr style="margin-bottom: 20px;"><div style="overflow-y: auto; max-height: 600px;">${syncing ? '数据同步中。。。' : playlist.map(function (playinfo, index) {
            let filenamelist = playinfo.file_name.split('›').filter(item => { return item !== "" }); const filename = filenamelist.pop(); let anotherNamehtml = ''; playinfo.anotherName && (filenamelist = [playinfo.anotherName]); filenamelist.map((fn) => { anotherNamehtml += `<div class="breadcrumb-item--j8J5H" data-hide="false" data-more="false"><div class="breadcrumb-item-link--9zcQY" title="${fn}">${fn}</div><div class="breadcrumb-item-separator--MnbFV">›</div></div>` }); return `<div class="history-item"><div playinfo-index="${index}" style="display: flex;max-width:100%;margin-top: auto;margin-bottom: auto;flex: 1;padding-right: 36px;cursor: pointer;" class="breadcrumb--gnRPG play-button" data-calc="true">${anotherNamehtml + '<span title="' + filename + '" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' + filename}</span></div><div style="display: flex; justify-content: flex-end;" class="btnsetting"><div class="mymemu" style="right:0px"><button class="rename-button" playinfo-index="${index}" style="background-color: #ffa31a;">别名</button><button class="delete-button" playinfo-index="${index}" style="background-color: #ff4d4f;">删除</button></div>${settingsvg}</div></div>`;
        }).join('')}</div></div>`;
    document.body.appendChild(panel);
    panel.addEventListener('click', function (e) {
        var playhistory = GM_getValue('playhistory') || [];
        let target = e.target
        if (target == panel)
            panel.parentNode.removeChild(panel);
        else if (target.classList.contains('webdav-button')) {
            document.querySelector('#webdav-panel,#playhistory-panel')?.remove()
            var panelwebdav = document.createElement('div');
            panelwebdav.id = 'webdav-panel';
            panelwebdav.style = `z-index: 100;`
            panelwebdav.innerHTML =
                `<div><div style="display: flex; "><h2 style="margin-top: 0; margin-bottom: 10px; font-size: 24px;">WebDav设置</h2><div style="display: flex; justify-content: flex-end;top:30px" class="btnsetting"><div class="mymemu" style="right:10px;display:block"><button class="sync-button" playinfo-index="-1" style="background-color: #ffa31a;">强制同步</button><button class="save-button" playinfo-index="-1" style="background-color: #00c270;">保存</button></div></div></div><hr style="margin-bottom: 20px;"><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">配置文件完整地址</div></div><input value='${wdurl}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">账号</div></div><input value='${wdusername}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div><div class="history-item"><div data-more="false" data-hide="false" class="breadcrumb-item--j8J5H" style="flex: 1;"><div class="breadcrumb-item-link--9zcQY">密码</div></div><input value='${wdpassword}' style="margin-left: 13px;height: 100%;flex: 4;" class="ant-input ant-input-borderless input--TWZaN" type="text"></div>
            </div>`
            document.body.appendChild(panelwebdav);
            panelwebdav.addEventListener('click', function (event) {
                if (event.target == panelwebdav)
                    panelwebdav.parentNode.removeChild(panelwebdav);
                else if (event.target.classList.contains('save-button')) {
                    const inputs = panelwebdav.querySelectorAll('input')
                    GM_setValue('webdav_url', inputs[0].value)
                    GM_setValue('webdav_user', inputs[1].value)
                    GM_setValue('webdav_pwd', inputs[2].value)
                    location.reload()
                }
                else if (event.target.classList.contains('sync-button'))
                    updateConfigIfNecessary(true)
            })
        }
        else {
            if (target.parentElement.getAttribute('playinfo-index'))
                target = target.parentElement
            if (target.parentElement.parentElement.getAttribute('playinfo-index'))
                target = target.parentElement.parentElement
            let index = target.getAttribute('playinfo-index')
            if (target.classList.contains('play-button')) {
                localStorage.setItem('last_play_file_name', playhistory[index].file_name)
                location.href = playhistory[index].file_path
            }
            else if (target.classList.contains('delete-button')) {
                playhistory.splice(index, 1)
                NewGM_setValue('playhistory', playhistory)
            }
            else if (target.classList.contains('rename-button')) {
                var userInput = prompt("设置别名为：");
                if (userInput) {
                    playhistory[index].anotherName = userInput
                    NewGM_setValue('playhistory', playhistory)
                }
            }
            else if (target.classList.contains('reset-button'))
                confirm("确定要重置所有设置吗？") && clearsetValue(['openapiclient_id', 'openapitoken', 'saveinfo', 'playbackRate', 'volume', 'fontColor', 'newurls', 'playhistory', 'webdav_url', 'webdav_user', 'webdav_pwd', 'webfullscreen'])
            else if (target.classList.contains('clear-button'))
                confirm("确定要清空播放记录吗？") && clearsetValue(['newurls', 'playhistory'])
            showManagementPanel()
        }
        function clearsetValue(keys) {
            keys.map(key => GM_setValue(key, null))
        }
    });
    document.querySelectorAll('.history-item .breadcrumb-item-link--9zcQY,.history-item span').forEach((element) => element.offsetWidth === element.scrollWidth && element.removeAttribute('title'));
}
function getAllGMdata() {
    const GMkey = ['openapiclient_id', 'saveinfo', 'playbackRate', 'volume', 'fontColor', 'playhistory', 'timestamp', 'webfullscreen']
    const allGMdata = {}
    GMkey.map(key => {
        const GMvalue = GM_getValue(key)
        GMvalue && (allGMdata[key] = GMvalue)
    })
    return allGMdata
}
function updateGMdata(jsobject) {
    Object.keys(jsobject).map((key) => { GM_setValue(key, jsobject[key]) })
}
function updateConfigIfNecessary(updateflag) {
    const currentTime = JSON.parse(localStorage.getItem('currentTime') || '{}')
    if (currentTime?.currentTime) {
        const playhistory = GM_getValue('playhistory') || []
        const index = playhistory.findIndex(item => item.file_path === currentTime.file_path)
        if (index !== -1) {
            localStorage.removeItem('currentTime')
            playhistory[index].currentTime = currentTime.currentTime
            GM_setValue('playhistory', playhistory)
        }
    }
    if (wdpassword !== '' && wdurl !== '' && wdusername !== '') {
        syncing = true
        const configPath = wdurl + '#' + new Date().getTime()
        GM_xmlhttpRequest({
            method: 'GET', url: configPath, headers: { 'Authorization': authHeader },
            onload: function (response) {
                if (response.status === 200) {
                    const serverConfigObject = JSON.parse(response.responseText);
                    const lctimestamp = GM_getValue('timestamp') || 0
                    lctimestamp > serverConfigObject.timestamp && !updateflag && updateWebDAVConfig();
                    (lctimestamp < serverConfigObject.timestamp || updateflag) && updateGMdata(serverConfigObject)
                }
                response.status !== 200 && updateWebDAVConfig()
                updateflag && alert('同步成功')
                syncing = false
                document.querySelector('#playhistory-panel') && showManagementPanel()
            }
        });
    }
}
function updateWebDAVConfig() {
    const newConfigData = getAllGMdata()
    const configPath = wdurl + '#' + new Date().getTime()
    newConfigData.timestamp = newConfigData?.timestamp || new Date().getTime()
    GM_xmlhttpRequest({
        method: 'PUT', url: configPath, data: JSON.stringify(newConfigData),
        headers: { 'Authorization': authHeader, 'Content-Type': 'application/json;charset=UTF-8' }
    });
}
