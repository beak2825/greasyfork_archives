// ==UserScript==
// @name        anon cannon
// @namespace   Violentmonkey Scripts
// @match       https://anonfiles.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021. 8. 28. 오후 2:44:08
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.jsdelivr.net/npm/streamsaver@2.0.5/StreamSaver.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/431593/anon%20cannon.user.js
// @updateURL https://update.greasyfork.org/scripts/431593/anon%20cannon.meta.js
// ==/UserScript==


// idbKeyval init
let idbKeyval = function(t) {
  "use strict";

  function e(t) {
    return new Promise(((e, n) => {
      t.oncomplete = t.onsuccess = () => e(t.result), t.onabort = t.onerror = () => n(t.error)
    }))
  }

  function n(t, n) {
    const r = indexedDB.open(t);
    r.onupgradeneeded = () => r.result.createObjectStore(n);
    const o = e(r);
    return (t, e) => o.then((r => e(r.transaction(n, t).objectStore(n))))
  }
  let r;

  function o() {
    return r || (r = n("keyval-store", "keyval")), r
  }

  function u(t, n) {
    return t("readonly", (t => (t.openCursor().onsuccess = function() {
      this.result && (n(this.result), this.result.continue())
    }, e(t.transaction))))
  }
  return t.clear = function(t = o()) {
    return t("readwrite", (t => (t.clear(), e(t.transaction))))
  }, t.createStore = n, t.del = function(t, n = o()) {
    return n("readwrite", (n => (n.delete(t), e(n.transaction))))
  }, t.entries = function(t = o()) {
    const e = [];
    return u(t, (t => e.push([t.key, t.value]))).then((() => e))
  }, t.get = function(t, n = o()) {
    return n("readonly", (n => e(n.get(t))))
  }, t.getMany = function(t, n = o()) {
    return n("readonly", (n => Promise.all(t.map((t => e(n.get(t)))))))
  }, t.keys = function(t = o()) {
    const e = [];
    return u(t, (t => e.push(t.key))).then((() => e))
  }, t.promisifyRequest = e, t.set = function(t, n, r = o()) {
    return r("readwrite", (r => (r.put(n, t), e(r.transaction))))
  }, t.setMany = function(t, n = o()) {
    return n("readwrite", (n => (t.forEach((t => n.put(t[1], t[0]))), e(n.transaction))))
  }, t.update = function(t, n, r = o()) {
    return r("readwrite", (r => new Promise(((o, u) => {
      r.get(t).onsuccess = function() {
        try {
          r.put(n(this.result), t), o(e(r.transaction))
        } catch (t) {
          u(t)
        }
      }
    }))))
  }, t.values = function(t = o()) {
    const e = [];
    return u(t, (t => e.push(t.value))).then((() => e))
  }, t
}({});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


function doFetch(url, options = {
  method: 'GET',
  responseType: 'blob'
}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: url,
      method: options.method,
      responseType: options.responseType,
      headers: options.headers,
      data: options.data,
      onload: result => {
        console.debug(result)
        if (result.status == 206 || result.status == 200) {
          resolve(result.response);
        } else {
          console.log(result)
          alert("불러오기 에러 발생 : " + url)
          reject(result.status);
        }
      }
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const fileID = location.href.match(/anonfiles.com\/([a-zA-Z0-9]+)/)[1]
let cdn = document.querySelector("#download-url").href

const unit = 1024 * 256

let globalQueue = []
let globalQueueDone = []
let globalQueueNum = 16
let globalCurrentDownloaded = 0

let dw = document.querySelector("#download-wrapper > div.col-xs-12.col-md-4.text-center")

function getInfo() {
  return new Promise((resolve, reject) => {
    fetch(`https://api.anonfiles.com/v2/file/${fileID}/info`)
      .then(res => res.json())
      .then(json => resolve(json))
  })
}

function byteDivider(byteSize) {
  let byteDivide = Object()
  const iter = parseInt(byteSize / unit)
  for (let i = 0; i < iter; i++) {
    byteDivide[i] = [i * unit, (i + 1) * unit - 1]
    if (i === iter - 1) {
      byteDivide[i] = [i * unit, byteSize - 1]
    }
  }
  return [iter, byteDivide]
}

function downloadRange(name, num, range, link) {
  const queueName = `${name}_${num}`
  return new Promise(async (resolve, reject) => {
    let done = false
    while (!done && globalQueue.indexOf(queueName) === -1 && globalQueueDone.indexOf(queueName) === -1) {
      if (globalQueue.length < globalQueueNum) {

        console.debug(`${num}_download_start`)

        globalQueue.push(queueName)

        idbKeyval.keys()
          .then(k => {
            if (k.indexOf(`${name}_${num}`) === -1) {
              doFetch(link, {
                  method: 'GET',
                  headers: {
                    'Range': `bytes=${range[0]}-${range[1]}`
                  },
                  responseType: 'arraybuffer'
                })
                .then(buffer => {
                  idbKeyval.set(`${name}_${num}`, buffer)
                    .then(e => {
                      globalCurrentDownloaded += range[1] - range[0] + 1
                      globalQueue.splice(globalQueue.indexOf(queueName), 1)
                      globalQueueDone.push(queueName)

                      console.debug(`${num}_download_end`)

                      done = true
                    })
                })
            } else {
              globalCurrentDownloaded += range[1] - range[0] + 1
              globalQueue.splice(globalQueue.indexOf(queueName), 1)
              globalQueueDone.push(queueName)

              console.debug(`${num}_download_backup`)

              done = true
            }
          })


      } else {
        await sleep(100)
      }
    }
  })
}

function queueMaker() {
  getInfo()
    .then(async json => {
      const fileSize = json.data.file.metadata.size.bytes
      const divided = byteDivider(fileSize)
      const fileName = document.querySelector("#site-wrapper h1").innerText
      
      let cdnNum = await GM_getValue('cdn')
      if (cdnNum) {
        cdn = `https://cdn-${cdnNum}.anonfiles.com/${cdn.match(/anonfiles.com\/(.*)/)[1]}`
      }
      for (let i = 0; i < divided[0]; i++) {
        downloadRange(fileName, i, divided[1][i], cdn)
      }
      supervisor(fileName, fileSize, divided[0])
    })
}

function progressMaker(max) {
  let progress = document.createElement('progress')
  progress.setAttribute('id', 'anon-cannon-progress')
  progress.setAttribute('value', '0')
  progress.setAttribute('max', `${max}`)
  progress.setAttribute('style', 'width: 100%')

  let text = document.createElement('p')
  text.innerText = '준비 중...'

  dw.appendChild(progress)
  dw.appendChild(text)

  return [progress, text]
}

async function supervisor(name, totalSize, iter) {
  let allDone = false
  let pastSize = 0
  let sizeDelta = 0
  let downloadSpeend = 0

  let progresses = progressMaker(totalSize)

  while (!allDone) {
    await sleep(1000)
    sizeDelta = globalCurrentDownloaded - pastSize
    progresses[0].setAttribute('value', `${globalCurrentDownloaded}`)
    progresses[1].innerText = `${formatBytes(globalCurrentDownloaded)}/${formatBytes(totalSize)}`
    pastSize = globalCurrentDownloaded
    if (globalCurrentDownloaded === totalSize) {
      progresses[1].innerText = `다운로드 완료, 디스크에서 처리 중...`
      await idbDownload(name, totalSize, iter)
      progresses[1].innerText = `다운로드 완료!`
      allDone = true
    }
  }
}

async function idbDownload(fileName, fileSize, iter) {
  let fileStream = streamSaver.createWriteStream(fileName, {
    size: fileSize
  })
  let writer = fileStream.getWriter()
  for (let step = 0; step < iter; step++) {
    await idbKeyval.get(`${fileName}_${step}`)
      .then(b => {
        writeRetry(writer, new Uint8Array(b), 10)
      })
  }
  await writer.close()
  for (let step = 0; step < iter; step++) {
    idbKeyval.del(`${fileName}_${step}`)
      .catch(e => {
        alert("IDB 삭제 에러")
        alert(e)
      })
  }
}

function writeRetry(writer, data, counter) {
  try {
    writer.write(data)
  } catch (e) {
    if (counter) {
      writeRetry(writer, data, counter - 1)
    } else {
      alert("IDB 다운로드 에러")
      writer.abort()
      alert(e)
    }
  }
}

function main() {
  queueMaker()
}

GM_registerMenuCommand('Anonfiles 다운로드', main, 'D')

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'))
    }, ms)

    promise
      .then(value => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch(reason => {
        clearTimeout(timer)
        reject(reason)
      })
  })
}

function ping(url) {
  return new Promise((resolve, reject) => {
    const startFetch = performance.now();
    doFetch(url, {method: 'HEAD'})
    .then((response) => {
      resolve(performance.now() - startFetch)
    })
    .catch(e => {
      reject(false)
    })
  })
}

function scan() {
  let pings = Object()
  return new Promise(async (resolve, reject) => {
    let tmpP = document.createElement('p')
    tmpP.innerText = '검색 준비중...'
    dw.appendChild(tmpP)
    for (let i = 101; i < 134; i++) {
      tmpP.innerText = `${i-100}/${33}`
      await timeout(500, ping(`https://cdn-${i}.anonfiles.com/${cdn.match(/anonfiles.com\/(.*)/)[1]}`))
        .then(function(delta) {
        pings[i] = Math.floor(delta)
      }).catch(function(err) {});
    }
    dw.removeChild(tmpP)
    let best = 500
    let cdnNum = 0
    for (let k of Object.keys(pings)) {
      if (pings[k] < best) {
        cdnNum = k
        best = pings[k]
      }
    }
    
    if (cdnNum) {
      await GM_setValue('cdn', cdnNum)
      alert(`검색이 완료되었습니다 : cdn-${cdnNum}, ${best}ms, 다운로드 서버를 전환했습니다`)
    } else {
      alert(`검색이 완료되었습니다 : 모든 서버에 대한 ping이 100ms를 초과합니다.`)
    }
  })
}

GM_registerMenuCommand('Anonfiles 최적 서버 검색', scan, 'S')

