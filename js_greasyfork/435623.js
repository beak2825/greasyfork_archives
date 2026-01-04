// ==UserScript==
// @name         B站直播随看随录
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  无需打开弹幕姬，必要时直接录制的快速切片工具
// @author       Eric Lam
// @license      MIT
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435623/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%9A%8F%E7%9C%8B%E9%9A%8F%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435623/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%9A%8F%E7%9C%8B%E9%9A%8F%E5%BD%95.meta.js
// ==/UserScript==


class StreamUrlGetter {

    constructor() {
        if (this.constructor == StreamUrlGetter){
            throw new Error('cannot initialize abstract class')
        }
    }

    async getUrl(roomid){
    }

}

let enableIndexedDB = false;
let limit1gb = false;

(async function() {
    'use strict';
    const uidRegex = /\/\/space\.bilibili\.com\/(?<id>\d+)\//g
    const roomLink =  $('.room-owner-username').attr('href')
    const uid = uidRegex.exec(roomLink)?.groups?.id

    const roomReg = /^\/(blanc\/)?(?<id>\d+)/
    let roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

    let res = await fetcher('https://api.live.bilibili.com/room/v1/Room/room_init?id='+roomId)
    roomId = res.data.room_id

    console.log('正在测试获取B站直播流')

    if (res.data.live_status != 1){
        console.log('此房间目前没有直播')
        return
    }

    // ========= indexdb 操作 =========================
    const key = `stream_record.${roomId}`

    if (window.indexedDB){
       try {
           await connect(key)
           enableIndexedDB = true
       }catch(err){
          console.error(err)
          alert(`連接資料庫時出現錯誤: ${err.message}, 没办法使用 IndexedDB。(尝试刷新?)`)
          closeDatabase()
       }
    }else{
        alert('你的瀏覽器不支援IndexedDB。')
    }

    if (!enableIndexedDB) {
        limit1gb = confirm('由于 IndexedDB 无法被使用，是否应该限制每次最多录制 1gb 视频以防止浏览器崩溃？')
    }

    // ======== 更改方式实作 , 如无法寻找可以更改别的 class =====
    const urlGetter = new RoomPlayInfo()
    // ===================================================



    const rows = $('.rows-ctnr')
    rows.append(`<button id="record">开始录制</button>`)

    //刷新一次可用线路
    //await findSuitableURL(stream_urls)

    $('#record').on('click', async () => {
        try {
            if (stop_record){
                const startDate = new Date().toString().substring(0, 24).replaceAll(' ', '-').replaceAll(':', '-')
                startRecord(urlGetter, roomId).then(data => download_flv(data, `${roomId}-${startDate}.flv`)).catch(err => { throw new Error(err) })
            }else{
               stopRecord()
            }
        }catch(err){
          alert(`啟用录制时出现错误: ${err?.message ?? err}`)
          console.error(err)
        }
    })

})().catch(console.warn);

async function findSuitableURL(stream_urls){
   for (const stream_url of stream_urls){
        try {
           await testUrlValid(stream_url)
           console.log(`找到可用线路: ${stream_url}`)
           return stream_url
        }catch(err){
          console.warn(`测试线路 ${stream_url} 时出现错误: ${err}, 寻找下一个节点`)
        }
    }
   return undefined
}

async function fetcher(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // 五秒timeout
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(id)
    if (!res.ok){
        throw new Error(res.statusText)
    }

    const data = await res.json()
    console.debug(data)
    if (data.code != 0){
        throw new Error(`B站API请求错误: ${data.message}`)
    }
    return data
}


let stop_record = true
let timer_interval = -1

async function testUrlValid(url){
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok){
     throw new Error(res.statusText)
  }
}


function toTimer(secs){
    let min = 0;
    let hr = 0;
    while(secs >= 60){
        secs -= 60
        min++
    }
    while (min >= 60){
        min -= 60
        hr++
    }
    const mu = min > 9 ? `${min}`: `0${min}`
    const ms = secs > 9 ? `${secs}` : `0${secs}`
    return `${hr}:${mu}:${ms}`
}

function isFlvHeader(buf) {
	if (!buf || buf.length < 4) {
		return false;
	}
	return buf[0] === 0x46 && buf[1] === 0x4c && buf[2] === 0x56 && buf[3] === 0x01;
}


let symbol = '🔴'
function startTimer(){
  let seconds = 0
  timer_interval = setInterval(() => {
     seconds += 1
     symbol = seconds % 2 == 0 ? '🔴' : '⚪'
  }, 1000)
}

function stopTimer() {
   clearInterval(timer_interval)
   $('#record')[0].innerText = '开始录制'
}

function round(float){
  return Math.round(float * 10) / 10
}

function formatSize(size) {
  const mb = round(size/1024/1024)
  if (mb > 1000){
     return `${round(mb / 1000).toFixed(1)}GB`
  }else{
     return `${mb.toFixed(1)}MB`
  }
}


const banned_urls = new Set();

async function startRecord(urlGetter, roomId) {
    await clearRecords() // 清空之前的记录

    $('#record').attr('disabled', '')
    $('#record')[0].innerText = '寻找线路中'

    const urls = await urlGetter.getUrl(roomId)

    if (urls.length == 0){
        throw new Error('没有可用线路，稍后再尝试？')
    }

    let res = undefined
    for (const url of urls) {
       try {
          console.log('正在测试目前线路...')
          if (banned_urls.has(url)) {
            console.warn('该线路在黑名单内，已略过')
            continue
          }
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 1000);
          res = await fetch(url, { credentials: 'same-origin', signal: controller.signal })
          clearTimeout(id)
          if (res.ok && !res.bodyUsed) break
       }catch(err){
           console.warn(`使用线路 ${url} 时出现错误: ${err}, 使用下一个节点`)
       }
    }
    if (!res) {
      throw new Error('没有可用线路，稍后再尝试？')
    }
    console.log('线路请求成功, 正在开始录制')
    startTimer()
    const reader = res.body.getReader();
    stop_record = false
    const chunks = [] // 不支援 indexeddb 时采用
    let size = 0
    console.log('录制已经开始...')
    $('#record').removeAttr('disabled')
    while (!stop_record){
      const {done, value } = await reader.read()
      // 下播
      if (done){
         if (size == 0) {
            banned_urls.add(res.url)
            throw new Error('此线路不可用，请再尝试一次。')
         }
         stop_record = true
         break
      }
      size += value.length
      $('#record')[0].innerText = `${symbol}录制中(${formatSize(size)})` // hover 显示目前录制视频大小
      const blob = new Blob([value], { type: 'application/octet-stream'})
      if (enableIndexedDB){
         await pushRecord(blob)
      }else{
         chunks.push(blob)
         if (limit1gb && round(size/1024/1024) > 1000){ // 采用非 indexeddb 且启用了限制 1gb 大小录制
            stop_record = true
            break
         }
      }
    }
    stopTimer()
    console.log('录制已中止。')
    if (enableIndexedDB){
       return await pollRecords()
    }else{
       return chunks
    }
}


async function stopRecord(){
   stop_record = true
}


function download_flv(chunks, file = 'test.flv'){
  if (!chunks || chunks.length == 0){
     console.warn('没有可以下载的资料')
     alert('没有可以下载的资料')
     return
  }
  const blob = new Blob(chunks, { type: 'video/x-flv' }, file)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a');
  a.style.display = "none";
  a.setAttribute("href", url);
  a.setAttribute("download", file);
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}


class RoomPlayUrl extends StreamUrlGetter {

    async getUrl(roomid){
        const stream_urls = []
        const res = await fetcher(`http://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomid}&qn=10000`)

        const durls = res.data.durl
        if (durls.length == 0){
            console.warn('没有可用的直播视频流')
            return stream_urls
        }

        for (const durl of durls){
            stream_urls.push(durl.url)
        }

        return stream_urls
    }
}


class RoomPlayInfo extends StreamUrlGetter {

    async getUrl(roomid){
        const stream_urls = []
        const url = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,2&codec=0,1&qn=10000&platform=web&ptype=16`
       const res = await fetcher(url)

       if (res.data.is_hidden){
           console.warn('此直播間被隱藏')
           return stream_urls
       }

        if (res.data.is_locked){
            console.warn('此直播間已被封鎖')
            return stream_urls
        }

        if (res.data.encrypted && !res.data.pwd_verified){
            console.warn('此直播間已被上鎖')
            return stream_urls
        }

        const streams = res?.data?.playurl_info?.playurl?.stream ?? []
        if (streams.length == 0){
            console.warn('没有可用的直播视频流')
            return stream_urls
        }

        for (const st of streams){
            for (const format of st.format){
                if (format.format_name !== 'flv'){
                    console.warn(`线路 ${index} 格式 ${f_index} 并不是 flv, 已经略过`)
                    continue
                }

                for (const codec of format.codec.sort((a,b) => b.current_qn - a.current_qn)){
                     const base_url = codec.base_url
                     for (const url_info of codec.url_info){
                         const real_url = url_info.host + base_url + url_info.extra
                         stream_urls.push(real_url)
                     }
                }

                return stream_urls
            }


        }
    }

}

// ========== indexdb ==========

function log(msg){
    console.log(`[IndexedDB] ${msg}`)
}

let db = undefined
const storeName = 'stream_record'

async function connect(key){
    return new Promise((res, rej) => {
        const open = window.indexedDB.open(key, 1)
        log('connecting to indexedDB')
        open.onerror = function(event){
            log('connection error: '+event.target.error.message)
            rej(event.target.error)
        }
        open.onsuccess = function(event){
            db = open.result
            log('connection success')
            createObjectStoreIfNotExist(db, rej)
            res(event)
        }
        open.onupgradeneeded = function(event) {
            db = event.target.result;
            log('connection success on upgrade needed')
            createObjectStoreIfNotExist(db, rej)
            res(event.target.error)
        }
    })

}

function closeDatabase(){
    db?.close()
}

async function drop(key){
    return new Promise((res, rej) => {
        const req = window.indexedDB.deleteDatabase(key);
        req.onsuccess = function () {
            log("Deleted database successfully");
            res()
        };
        req.onerror = function () {
            log("Couldn't delete database");
            rej(req.error)
        };
        req.onblocked = function () {
            log("Couldn't delete database due to the operation being blocked");
            rej(req.error)
        };
    })
}

function createObjectStoreIfNotExist(db, rej){
    if(!db) return
    try{
        if (!db.objectStoreNames.contains(storeName)) {
            log(`objectStore ${storeName} does not exist, creating new one.`)
            db.createObjectStore(storeName, { autoIncrement: true })
            log('successfully created.')
        }
    }catch(err){
        log('error while creating object store: '+err.message)
        rej(err)
    }
    db.onerror = function(event) {
        log("Database error: " + event.target.error.message);
    }
    db.onclose = () => {
        console.log('Database connection closed');
    }
}


async function pushRecord(object){
   return new Promise((res, rej)=>{
        if (!db){
            log('db not defined, so skipped')
            rej(new Error('db is not defined'))
        }
        try{
            const tran = db.transaction([storeName], 'readwrite')
            handleTrans(rej, tran)
            const s = tran.objectStore(storeName).add(object)
            s.onsuccess = (e) => {
                //log('pushing successful')
                res(e)
            }
            s.onerror = () => {
                log('error while adding byte: '+s.error.message)
                rej(s.error)
            }
        }catch(err){
            rej(err)
        }
   })
 }

 function handleTrans(rej, tran){
    tran.oncomplete = function(){
        //log('transaction completed')
    }
    tran.onerror = function(){
        log('transaction error: '+tran.error.message)
        rej(tran.error)
    }
 }

async function pollRecords(){
    const buffer = await listRecords()
    await clearRecords()
    return buffer
}

async function listRecords(){
   return new Promise((res, rej) => {
    if (!db){
        log('db not defined, so skipped')
        rej(new Error('db is not defined'))
      }
      try{
        const tran = db.transaction([storeName], 'readwrite')
        handleTrans(rej, tran)
        const cursors = tran.objectStore(storeName).openCursor()
        const records = []
        cursors.onsuccess = function(event){
           let cursor = event.target.result;
           if (cursor) {
              records.push(cursor.value)
              cursor.continue();
           }
           else {
             log("total bytes: "+records.length);
             res(records)
           }
        }
        cursors.onerror = function(){
            log('error while fetching data: '+cursors.error.message)
            rej(cursors.error)
        }
      }catch(err){
          rej(err)
      }
   })
 }

async function clearRecords(){
   return new Promise((res, rej) => {
        if (!db){
            log('db not defined, so skipped')
            rej(new Error('db is not defined'))
        }
       try{
            const tran = db.transaction([storeName], 'readwrite')
            handleTrans(rej, tran)
            const req = tran.objectStore(storeName).clear()
            req.onsuccess = (e) => {
            log('clear success')
            res(e)
            }
            req.onerror = () =>{
                log('error while clearing data: '+req.error.message)
                rej(req.error)
            }
       }catch(err){
           rej(err)
       }
   })
}
