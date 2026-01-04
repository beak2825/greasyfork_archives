// ==UserScript==
// @name        ISCS with IDB - arca.live
// @namespace   Violentmonkey Scripts
// @match       https://arca.live/b/*
// @match       https://p-ac.namu.la/*
// @match       https://ac-p.namu.la/*
// @match       https://ac2-p.namu.la/*
// @match       https://i.ibb.co/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @version     2.0.2.6
// @author      -
// @description arcalive file attach script
// @downloadURL https://update.greasyfork.org/scripts/428268/ISCS%20with%20IDB%20-%20arcalive.user.js
// @updateURL https://update.greasyfork.org/scripts/428268/ISCS%20with%20IDB%20-%20arcalive.meta.js
// ==/UserScript==

// IDB init
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

let useIDB = true
if (!window.indexedDB) {
  console.log("IDB를 지원하지 않는 브라우저이므로, 대신 RAM을 사용합니다.");
  useIDB = false
}

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

// IDB db 존재확인
function IDBdbExist(name) {
  return new Promise((resolve, reject) => {
    var request = window.indexedDB.open(name);
    request.onupgradeneeded = function(e) {
      e.target.transaction.abort();
      resolve(false);
    }
    request.onsuccess = function(e) {
      resolve(true);
    }
  })
}

// IDB db 레코드 개수 세기
function IDBdbCount(name) {
  return new Promise((resolve, reject) => {
    var requestOpen = window.indexedDB.open(name);
    requestOpen.onsuccess = function(e) {
      var db = e.target.result;
      var transaction = db.transaction(["DATA"], 'readonly');
      var objectStore = transaction.objectStore("DATA");
      var countRequest = objectStore.count();
      countRequest.onsuccess = function() {
        resolve(countRequest.result);
      }
      countRequest.onerror = function() {
        console.log("DB의 store에 접근하지 못했습니다 : " + name)
      }
    }
    requestOpen.onerror = function(e) {
      console.log("DB를 열지 못했습니다 : " + name)
    }
  })
}

// IDB db key로 value 얻기
function IDBdbGetValue(name, key) {
  return new Promise((resolve, reject) => {
    var requestOpen = window.indexedDB.open(name);
    requestOpen.onsuccess = function(e) {
      var db = e.target.result;
      var transaction = db.transaction(["DATA"], 'readonly');
      var objectStore = transaction.objectStore("DATA");
      var getRequest = objectStore.get(key);
      getRequest.onsuccess = function() {
        resolve(getRequest.result);
      }
      getRequest.onerror = function(e) {
        console.log("IDBdbGetValue 에러: ", e)
        alert("IDB의 store에 접근하지 못했습니다 : " + name)
      }
    }
    requestOpen.onerror = function(e) {
      console.log("IDBdbGetValue 에러: ", e)
      alert("IDB를 열지 못했습니다 : " + name)
    }
  })
}

// IDB db 모든 key 얻은 후 하나씩 가져오기 // 2.0.2 firefox 대용량 파일 문제
function IDBdbGetAll(name) {
  return new Promise((resolve, reject) => {
    var requestOpen = window.indexedDB.open(name);
    requestOpen.onsuccess = function(e) {
      var db = e.target.result;
      var transaction = db.transaction(["DATA"], 'readonly');
      var objectStore = transaction.objectStore("DATA");
      var getAllKeyRequest = objectStore.getAllKeys();
      getAllKeyRequest.onsuccess = async function() {
        let keyList = getAllKeyRequest.result
        let bufferList = [];
        for (let key of keyList) {
          let tmp = await IDBdbGetValue(name, key).then((buffer) => {
            bufferList.push(buffer)
          })
        }
        resolve(bufferList)
      }
      getAllKeyRequest.onerror = function(e) {
        console.log("IDBdbGetAllKey 에러: ", e)
        alert("IDB의 store에 접근하지 못했습니다 : " + name)
      }
    }
    requestOpen.onerror = function(e) {
      console.log("IDBdbGetAllKey 에러: ", e)
      alert("IDB를 열지 못했습니다 : " + name)
    }
  })
}
/* // 2.0.2 파이어폭스 버그로 인해 제거
// IDB db 모든 value 얻기
function IDBdbGetAll(name) {
  return new Promise((resolve, reject) => {
    var requestOpen = window.indexedDB.open(name);
    requestOpen.onsuccess = function(e) {
      var db = e.target.result;
      var transaction = db.transaction(["DATA"], 'readonly');
      var objectStore = transaction.objectStore("DATA");
      var getAllRequest = objectStore.getAll();
      getAllRequest.onsuccess = function() {
        resolve(getAllRequest.result);
      }
      getAllRequest.onerror = function(e) {
        console.log("IDBdbGetAll 에러: ", e)
        alert("IDB의 store에 접근하지 못했습니다 : " + name)
      }
    }
    requestOpen.onerror = function(e) {
      console.log("IDBdbGetAll 에러: ", e)
      alert("IDB를 열지 못했습니다 : " + name)
    }
  })
}
*/
// IDB db 지우기
function IDBdelete(name) {
  var DBDeleteRequest = window.indexedDB.deleteDatabase(name);
  DBDeleteRequest.onerror = function(e) {
    console.log("IDBdelete 에러: ", e)
    alert("IDB를 삭제하지 못했습니다 : " + name);
  };
  DBDeleteRequest.onsuccess = function(event) {};
}

// IDB 다운로드 백업 지우기 // 2.0.2
function IDBbackupDelete() {
  try {
    if (useIDB) {
      let indexeddbs = window.indexedDB.databases()
      let ISCS_dbs = [];
      indexeddbs.then((dbs) => {
        for (let db of dbs) {
          if (db.name.includes("ISCS_IDB_download")) {
            ISCS_dbs.push(db.name)
          }
        }
        let conf = window.confirm(ISCS_dbs.length + "개의 백업이 삭제됩니다.")
        if (conf && ISCS_dbs.length > 0) {
          for (let ISCS_db of ISCS_dbs) {
            IDBdelete(ISCS_db)
          }
        }
      })
    }
  } catch {
    alert("다운로드 백업을 삭제하지 못했습니다! (파이어폭스의 경우 삭제를 지원하지 않습니다.)")
  }
}

// LocalStorage 업로드 백업 지우기 // 2.0.2
function LSbackupDelete() {
  try {
    let backups = []
    let keys = Object.keys(localStorage)
    let i = keys.length;
    while (i--) {
      if (keys[i].includes("ISCS_IDB_upload")) {
        backups.push(keys[i])
      }
    }
    let conf = window.confirm(backups.length + "개의 백업이 삭제됩니다.")
    if (conf && backups.length > 0) {
      for (let key of backups) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    alert("업로드 백업을 삭제하지 못했습니다!")
  }
}

// 백업 지우기 registerMenuCommand // 2.0.2
function registerMenuCommand() {
  GM_registerMenuCommand("다운로드 백업 삭제", IDBbackupDelete, "D");
  GM_registerMenuCommand("업로드 백업 삭제", LSbackupDelete, "U");
};

registerMenuCommand()


// jQuery contains 함수
function jQcontains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function(element) {
    return RegExp(text).test(element.textContent);
  });
}

// 바이트값 정리 함수
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 문자열을 바이트어레이로 변환
function stringToAsciiByteArray(str) {
  var bytes = [];
  for (let i = 0; i < str.length; ++i) {
    var charCode = str.charCodeAt(i);
    if (charCode > 0xFF) {
      throw new Error('stringToAsciiByteArray 에러');
    }
    bytes.push(charCode);
  }
  return bytes;
}

// url로 Blob 다운로드 함수
function getBlob(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 60 * 1000,
      responseType: 'blob',
      onprogress: event => {
        if (onProgress) onProgress(event);
      },
      onload: response => {
        if (onLoad) onLoad();
        resolve(response.response);
      },
      onerror: error => {
        console.log(error)
        if (error.finalUrl === "" && error.readyState === 4 && error.status === 0) {
          console.log("저장공간에 충분한 여유가 없을 수 있습니다.\n이 에러가 계속 발생한다면, 저장공간을 정리한 후 다시 시도해 주십시오.")
        }
        console.log("getBlob 에러", error)
        reject(new Error("Blob 다운로드 오류"));
      },
      ontimeout: timeout => {
        console.log("getBlob 타임아웃")
        console.log(timeout)
        alert("파일 다운로드 대기 시간이 초과되었습니다.(1분)")
        reject(new Error("Blob 다운로드 시간초과"));
      }
    })
  });
};

// 재시도 횟수
const retryNum = 5

// 2.0.2.3: 아카라이브 새로운 이미지 서버 주소 대응 
function newArcaUrl(url) {
  if (url.includes('p-ac2.namu.la')) {
    url = url.replace('p-ac2.namu.la', 'ac2-p.namu.la')
  }
  if (url.includes('p-ac.namu.la')) {
    url = url.replace('p-ac.namu.la', 'ac-p.namu.la')
  }
  return url
}

// url로 파일 다운로드 및 버퍼로 변환 함수
function getFile(url) {
  url = newArcaUrl(url)
  return new Promise(async function(resolve, reject) {
    for (let retry = 0; retry < retryNum; retry++) {
      try {
        const file = await getBlob(url, e => {
          const progress = console.log("다운로드 중")
        }, () => {
          console.log("다운로드 완료");
        });
        FileToArrayBuffer(file).then(function(buffer) {
          resolve(restorData(buffer))
        })
      } catch {
        if (retry >= retryNum) {
          console.log("Blob 다운로드 최대 시도 횟수 초과")
          alert("Blob 다운로드 최대 시도 횟수를 초과했습니다.\n새로고침 후 다시 시도해 주십시오.")
          throw Error('Blob 다운로드 최대 시도 횟수 초과.');
        } else {
          console.log("Blob 다운로드 재시도: " + (retry + 1))
          await sleep(3000) // 3초 후 재시도
        }
      }
    }
  })
}

// GET으로 HTML을 요청하는 함수
function getRequestHTML(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onprogress: event => {
        if (onProgress) onProgress(event);
      },
      onload: response => {
        if (onLoad) onLoad();
        resolve(response.responseText);
      },
      onerror: error => {
        reject(new Error('로드 오류', error));
      }
    });
  });
}

// url로 html을 string으로 가져오는 함수
function getUrl(url) {
  return new Promise((resolve, reject) => {
    const req = getRequestHTML(url, e => {
      const progress = console.log("로드 중")
    }, () => {
      console.log("로드 완료");
    });
    req.then(function(data) {
      resolve(data)
    })
  })
}

// imgbb 토큰 얻는 함수
function getImgbbToken() {
  return new Promise((resolve, reject) => {
    getUrl("https://imgbb.com/").then((data) => {
      resolve(data.match(/auth_token="\w+"/)[0].split("\"")[1])
    })
  })
}

// 이미지(Blob) 업로드 함수
function UploadImageFile(Blob, server, pretoken = null) {

  // arca.live 서버 이용시
  if (server === "arca.live") {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      formData.append('upload', Blob, Math.random().toString(36).substring(7) + '.jpg');
      formData.append('token', pretoken || document.querySelector("#article_write_form > input[name=token]").value);
      formData.append('saveExif', true);
      formData.append('saveFilename', false);

      xhr.onload = function() {
        responseJSON = JSON.parse(xhr.responseText)
        if (responseJSON.uploaded === true) {
          resolve(responseJSON.url)
        } else {
          console.error(xhr.responseText);
        }
      }
      xhr.open("POST", "https://arca.live/b/upload");
      xhr.send(formData);
    });
  }

  // imgbb.com 서버 이용시
  if (server === "imgbb.com") {
    return new Promise((resolve, reject) => {
      getImgbbToken().then(function(token) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();

        formData.append('source', Blob, Math.random().toString(36).substring(7) + '.jpg');
        formData.append('type', "file");
        formData.append('action', "upload");
        formData.append('timestamp', new Date().getTime());
        formData.append('token', token);

        xhr.onload = function() {
          responseJSON = JSON.parse(xhr.responseText)
          if (responseJSON.status_code === 200) {
            resolve(responseJSON)
          } else {
            console.error(xhr.responseText);
          }
        }
        xhr.open("POST", "https://imgbb.com/json");
        xhr.send(formData);
      })
    });
  }

}

// dataURI로 다운로드 함수
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

// 파일을 어레이버퍼로 변환
function FileToArrayBuffer(myFile, start, end) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(myFile.slice(start, end));
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var arrayBuffer = evt.target.result
        resolve(arrayBuffer)
      }
      reject(new Error("ArrayBuffer 변환 실패"));
    }
  })
}

// 어레이버퍼 덧셈
function _appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

// 어레이버퍼 총합
function _concatBuffer(buffers) {
  return new Promise((resolve, reject) => {
    let tmpBuffer = new ArrayBuffer();
    for (let i = 0; i < buffers.length; i++) {
      tmpBuffer = _appendBuffer(tmpBuffer, buffers[i])
    }
    resolve(tmpBuffer)
  })
}

// 작은 JPG 파일 바이트어레이
const BaseArray = [255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 1, 0, 120, 0, 120, 0, 0, 255, 225, 0, 34, 69, 120, 105, 102, 0, 0, 77, 77, 0, 42, 0, 0, 0, 8, 0, 1, 1, 18, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 255, 219, 0, 67, 0, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 5, 3, 3, 3, 3, 3, 6, 4, 4, 3, 5, 7, 6, 7, 7, 7, 6, 7, 7, 8, 9, 11, 9, 8, 8, 10, 8, 7, 7, 10, 13, 10, 10, 11, 12, 12, 12, 12, 7, 9, 14, 15, 13, 12, 14, 11, 12, 12, 12, 255, 219, 0, 67, 1, 2, 2, 2, 3, 3, 3, 6, 3, 3, 6, 12, 8, 7, 8, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 255, 192, 0, 17, 8, 0, 16, 0, 16, 3, 1, 34, 0, 2, 17, 1, 3, 17, 1, 255, 196, 0, 31, 0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 255, 196, 0, 181, 16, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125, 1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 255, 196, 0, 31, 1, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 255, 196, 0, 181, 17, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119, 0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250, 255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63, 0, 254, 127, 232, 162, 138, 0, 255, 217]
const BaseArrayBuffer = new Uint8Array(BaseArray).buffer;

// 이미지에서 데이터 복원
function restorData(buffer) {
  return buffer.slice(BaseArray.length)
}

// 데이터 JPG처리 및 업로드 (jpg헤더 붙이기, 업로드)
function DoUpload(buffer, server, pretoken) {
  return new Promise(function(resolve, reject) {
    UploadImageFile(new Blob([new Uint8Array(_appendBuffer(BaseArrayBuffer, buffer))]), server, pretoken)
      .then(function(result) {
        if (server === "arca.live") {
          // 아카라이브 원본이미지 URL로 변환
          var processed = "https://p-" + result.slice(2) + "?type=orig"
          resolve(processed)
        }
        if (server === "imgbb.com") {
          var processed = result.image.url
          resolve(processed)
        }
      })
  })
}

// 단위 바이트: 2.5MB
const sliceUnit = 1024 * 1024 * 2.5

// 다운로드: sliceUnit씩 다운로드 후 IDB에 저장, 이후 합치기
async function DownloadProcessData(JSON, filename, fileSpeed, fileProgress, fileAbort) {
  fileSpeed.innerText = "다운로드 중..."
  fileProgress.setAttribute("value", 0)
  let DNum = Object.keys(JSON).length;
  let downloadedBufferArray = [];
  let firstStep = 0
  let IDBname = "ISCS_IDB_download_" + window.location.pathname + "_" + filename
  let fileStore;
  var tmpPromise = await IDBdbExist(IDBname).then(async function(exist) { // 다운로드 중단 감지
    if (exist) {
      fileSpeed.innerText = "이전에 중단된 다운로드 복구중..."
      var tmpPromise = await IDBdbCount(IDBname).then(async function(count) {
        firstStep = count - 1 // 2.0.2 복구 step 변경
      });
    }
  })
  if (useIDB) {
    fileStore = idbKeyval.createStore(IDBname, 'DATA'); // 파일에 해당하는 IDB
  }
  for (let step = firstStep; step < DNum; step++) {
    if (fileAbort.getAttribute("value") === "true") {
      fileSpeed.innerText = "다운로드 취소 중..."
      fileProgress.setAttribute("value", 0)
      if (useIDB) {
        IDBdelete(IDBname) // DB 삭제
      } else {
        delete downloadedBufferArray
      }
      fileSpeed.innerText = "다운로드 취소됨"
      fileAbort.setAttribute("value", false)
      Gpause = false
      break;
    } else {
      let start = new Date();
      fileProgress.setAttribute("value", 100 * step / DNum)
      var tmpPromise = await getFile(JSON[step])
        .then(async function(buffer) {
          if (useIDB) { // IDB 사용시
            await idbKeyval.set(step, buffer, fileStore)
          } else { // IDB 미사용시
            var tmpBuffer = await buffer
            downloadedBufferArray.push(tmpBuffer)
          }
          let end = new Date();
          fileSpeed.innerText = "전송 속도: " + formatBytes(sliceUnit / ((end - start) / 1000)) + "/s,  전송량: " + String(Math.ceil(((step + 1) / DNum) * 10000) / 100) + "%"
          if (step + 1 === DNum) {
            fileProgress.setAttribute("value", "100")
            fileSpeed.innerText = "다운로드 완료, 디스크에서 처리중..."
            Gpause = false // 파일 다운로드 완료 후 일시정지 해제
            if (useIDB) { // IDB 사용시
              var tmpPromise = await IDBdbGetAll(IDBname).then(async function(buffers) {
                var blob = new Blob(buffers);
                delete buffers
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                delete blob
                link.download = filename;
                link.click();
                delete link
                fileSpeed.innerText = "다운로드 완료!"
                IDBdelete(IDBname) // DB 삭제
              })
            } else { // IDB 미사용시
              var blob = new Blob(downloadedBufferArray);
              delete downloadedBufferArray
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              delete blob
              link.download = filename;
              link.click();
              delete link
            }
            fileAbort.setAttribute("value", false) // 다운로드 과정 종료 후 취소 값 변경
          }
        })
        .catch((error) => {
          console.log("getFile 에러: ", error)
          fileSpeed.innerText = "다운로드 에러, 새로고침 후 재시도 할 수 있습니다."
          Gpause = false // 파일 다운로드 에러, 일시정지 해제
        })
    }
  }
}

// 업로드: 파일 sliceUnit씩 슬라이스 및 전처리 후 배열 중계, 완료 후 마스터URL 첨부
async function UploadProcessData(file, count, sever) {
  let UNum = Math.ceil(file.size / sliceUnit)
  let firstStep = 0
  let uploadedUrlJson = new Object();
  fileProgress.setAttribute("value", 0)
  fileSpeed.innerText = count + ", 업로드 준비 중..."
  let startOver = localStorage.getItem("ISCS_IDB_upload_" + file.name + "_" + file.size)
  if (startOver) {
    fileSpeed.innerText = count + ", 이전에 중단된 업로드 복구중..."
    uploadedUrlJson = JSON.parse(startOver)
    firstStep = Object.keys(uploadedUrlJson).length
  }
  for (let step = firstStep; step < UNum; step++) {
    if (Uabort) {
      fileSpeed.innerText = "업로드 취소 중..."
      localStorage.removeItem("ISCS_IDB_upload_" + file.name + "_" + file.size);
      fileProgress.setAttribute("value", 0)
      fileSpeed.innerText = "업로드 취소됨"
      Uabort = false
      break;
    } else {
      let start = new Date();
      var tmpPromise = await FileToArrayBuffer(file, step * sliceUnit, (step + 1) * sliceUnit).then(async function(buffer) {
        var tmpUrl = await DoUpload(buffer, sever)
        uploadedUrlJson[step] = tmpUrl
        localStorage.setItem("ISCS_IDB_upload_" + file.name + "_" + file.size, JSON.stringify(uploadedUrlJson));
        fileProgress.setAttribute("value", String(((step + 1) / UNum) * 100))
        let end = new Date();
        fileSpeed.innerText = count + ", 전송 속도: " + formatBytes(sliceUnit / ((end - start) / 1000)) + "/s, 전송량: " + String(Math.ceil(((step + 1) / UNum) * 10000) / 100) + "%"
        if (step + 1 === UNum) {
          fileProgress.setAttribute("value", "100")
          fileSpeed.innerText = file.name + ", 파일 리스트 업로드 중..."
          let utf8Encode = new TextEncoder()
          var masterUrl = await DoUpload(utf8Encode.encode(JSON.stringify(uploadedUrlJson)), sever)
          // 파일 첨부 요소 추가
          WriteDOMchanger(file.name, formatBytes(file.size), masterUrl)
          fileSpeed.innerText = count + ", 업로드 완료"
          localStorage.removeItem("ISCS_IDB_upload_" + file.name + "_" + file.size);
        }
      })
    }
  }
}

// 2.0.1: base64 자동 디코드 충돌 해결: 문자열마다 "|" 삽입
function insertAllString(str, n = 1) {
  var ret = [];
  var i;
  var len;
  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }
  return ret.join("|")
};

// 파일 첨부 요소
let fileBtn = document.createElement("input");
fileBtn.setAttribute("type", "file")
fileBtn.setAttribute("id", "myFile")
fileBtn.setAttribute("style", "margin-bottom:10px;")

let fileSpeed = document.createElement("p");
fileSpeed.setAttribute("style", "padding-left:5%;display:inline")
fileSpeed.innerText = "전송 대기 중"
fileSpeed.setAttribute("id", "fileSpeed")

let fileProgress = document.createElement("progress");
fileProgress.setAttribute("value", "0")
fileProgress.setAttribute("max", "100")
fileProgress.setAttribute("style", "width:100%;")
fileProgress.setAttribute("id", "fileProgress")

let fileAbort = document.createElement("div");
fileAbort.setAttribute("cursor", "pointer")
fileAbort.append("취소")
fileAbort.setAttribute("class", "btn btn-arca btn-sm float-right")
fileAbort.setAttribute("id", "fileAbort")

// 서버 선택 요소
let radioLabel = document.createElement("label");
radioLabel.setAttribute("style", "margin: 0 10px!important")
radioLabel.append("서버: ")

let radioImgbbLabel = document.createElement("label");
radioImgbbLabel.setAttribute("for", "upload-image-server-imgbb")
radioImgbbLabel.append("imgbb.com")

let radioImgbb = document.createElement("input");
radioImgbb.setAttribute("type", "radio")
radioImgbb.setAttribute("name", "upload-image-server")
radioImgbb.setAttribute("id", "upload-image-server-imgbb")
radioImgbb.setAttribute("checked", "checked")
radioImgbb.setAttribute("value", "imgbb.com")
radioImgbb.setAttribute("style", "margin:10px 5px!important")

let radioArcaLabel = document.createElement("label");
radioArcaLabel.setAttribute("for", "upload-image-server-arca")
radioArcaLabel.append("arca.live")

let radioArca = document.createElement("input");
radioArca.setAttribute("type", "radio")
radioArca.setAttribute("name", "upload-image-server")
radioArca.setAttribute("id", "upload-image-server-arca")
radioArca.setAttribute("value", "arca.live")
radioArca.setAttribute("style", "margin:10px 5px!important")

// 복구 버튼
let restoreBtn = document.createElement("div");
restoreBtn.setAttribute("id", "restoreBtn")
restoreBtn.setAttribute("class", "btn btn-arca btn-sm float-right")
restoreBtn.append("파일 복구")

// 부모 요소
let fileDiv = document.createElement("div");
fileDiv.setAttribute("style", "margin:10px 15px;width:100%;")
fileDiv.appendChild(fileBtn)
fileDiv.appendChild(fileSpeed)
fileDiv.appendChild(fileAbort)
fileDiv.appendChild(document.createElement("br"))
fileDiv.appendChild(fileProgress)
fileDiv.appendChild(radioLabel)
fileDiv.appendChild(radioImgbbLabel)
fileDiv.appendChild(radioImgbb)
fileDiv.appendChild(radioArcaLabel)
fileDiv.appendChild(radioArca)
fileDiv.appendChild(restoreBtn)

// 최종 부모 요소
let fileSummary = document.createElement("summary");
fileSummary.append("파일 첨부")
let fileSpace = document.createElement("details");
fileSpace.setAttribute("style", "margin:0 15px 5px 15px;width:93.5%")
fileSpace.appendChild(fileSummary)
fileSpace.appendChild(fileDiv)

// 윈도우 로드시 한번만 실행
window.addEventListener(onloadInit(), {
  once: true
});

// 윈도우 로드시 주소에 따라 기능 부여
function onloadInit() {
  // 글쓰기, 글수정 시 파일 첨부 요소 추가 및 input파일 감지
  if (window.location.pathname.match(/\/b\/.*?\/(write|edit)/)) {
    UploadInit()
  }
  // 글 조회시 첨부파일 감지
  if (window.location.pathname.match(/\/b\/.*?\/\d+/)) {
    DownloadInit()
  }
  // URL리스트 점검시: https://i.ibb.co/, https://i.ibb.co/a/?=[rawFileUrl]
  if (window.location.href.match(/i\.ibb\.co\/a\/\?=/)) {
    UrlCheckDOMchanger()
    let sever = "imgbb.com"
    let rawFileUrl = window.location.href.split("https://i.ibb.co/a/?=")[1]
    checkDataInit(sever, rawFileUrl)
  }
  // URL리스트 점검시: https://p-ac.namu.la/, https://p-ac.namu.la/a/?=[rawFileUrl]
  if (window.location.href.match(/p\-ac\.namu\.la\/a\/\?=/)) {
    UrlCheckDOMchanger()
    let sever = "arca.live"
    let rawFileUrl = window.location.href.split("https://p-ac.namu.la/a/?=")[1]
    checkDataInit(sever, rawFileUrl)
  }
  // URL리스트 점검시: https://ac-p.namu.la/, https://ac-p.namu.la/a/?=[rawFileUrl]
  if (window.location.href.match(/ac\-p\.namu\.la\/a\/\?=/)) {
    UrlCheckDOMchanger()
    let sever = "arca.live"
    let rawFileUrl = window.location.href.split("https://ac-p.namu.la/a/?=")[1]
    checkDataInit(sever, rawFileUrl)
  }
  // URL리스트 점검시: https://ac2-p.namu.la/, https://ac2-p.namu.la/a/?=[rawFileUrl]
  if (window.location.href.match(/ac2\-p\.namu\.la\/a\/\?=/)) {
    UrlCheckDOMchanger()
    let sever = "arca.live"
    let rawFileUrl = window.location.href.split("https://ac2-p.namu.la/a/?=")[1]
    checkDataInit(sever, rawFileUrl)
  }
}

// 업로드 시작 함수
function UploadInit() {
  let oldBtnDiv = document.querySelector("#article_write_form > div.row")
  oldBtnDiv.appendChild(fileSpace)
  let fileAbort = document.querySelector("#fileAbort")
  let inputFile = document.querySelector("#myFile")
  inputFile.setAttribute("multiple", "")
  inputFile.oninput = async function() {
    checkRadio("upload-image-server").then(async function(val) {
      let server = val
      let UfileList = inputFile.files
      let count;
      let pause = Gpause
      while (pause) { // 이미 다른 파일이 업로드 중이라면 완료시까지 대기
        await sleep(1000)
        pause = Gpause
      }
      Gpause = true // 다른 업로드 작업들은 대기시키기
      for (let i = 0; i < UfileList.length; i++) {
        if (UfileList[i].size > sliceUnit * 200) {
          alert("단일 파일은 500MB 이하로 제한됩니다. 큰 파일은 분할 압축을 사용해주세요.")
          let tmpDiv = document.createElement("div");
          tmpDiv.setAttribute("style", "margin:5px 15px;width:100%;")
          tmpDiv.append("실패(허용 용량 초과) : " + UfileList[i].name)
          oldBtnDiv.appendChild(tmpDiv)
          delete UfileList[i]
        } else {
          count = UfileList[i].name + " [" + (i + 1) + "/" + UfileList.length + "]"
          await UploadProcessData(UfileList[i], count, server)
        }
      }
      Gpause = false
    })
  }
  fileAbort.onclick = function() {
    fileSpeed.innerText = "업로드 취소 중..."
    Uabort = true
    Gpause = false
  }
  if (window.location.pathname.match(/\/b\/.*?\/edit/)) { // 글 수정시 복구 기능 활성화
    let restoreBtn = document.querySelector("#restoreBtn")
    let restoreToken = document.querySelector("#article_write_form > input[name=token]").value
    const originalHTML = document.querySelector('html').outerHTML
    restoreBtn.onclick = function() {
      UrlCheckDOMchanger()
      setTimeout(function() {
        RestoreInit(originalHTML, restoreToken)
      }, 100)
    }
  }
}

// 복구 시작 함수
async function RestoreInit(originalDoc, token) {
  let progressBar = document.querySelector("#progress")
  let percent = document.querySelector("#percent")
  let count = document.querySelector("#count")
  let text = document.querySelector("#text")
  let inputFile = document.querySelector("#file")
  let server
  text.innerText = "대기중"
  let restoreCodeList;
  let promptText = prompt("복구 코드를 입력해주십시오.");
  if (promptText && promptText !== "") {
    restoreCodeList = promptText.split("|")
  }
  if (restoreCodeList && restoreCodeList.length === 2) {
    let restoreUrl = restoreCodeList[0]
    let restoreIndexList = restoreCodeList[1].split(",")
    if (restoreUrl.includes("p-ac.namu.la")) {
      server = "arca.live"
    }
    if (restoreUrl.includes("i.ibb.co")) {
      server = "imgbb.com"
    }
    alert("복구할 파일을 첨부해 주십시오.\n(완전히 동일한 파일이어야 합니다.)")
    inputFile.removeAttribute("style")
    inputFile.oninput = async function() {
      let file = inputFile.files[0]
      let RNum = restoreIndexList.length
      text.innerText = "복구중"
      getUrlList(restoreUrl).then(async function(restoreUrlJSON) {
        for (let n = 0; n < RNum; n++) {
          let step = parseInt(restoreIndexList[n], 10)
          let percentVal = Math.ceil((n + 1) * 100 / RNum)
          percent.innerText = percentVal + "%"
          progressBar.setAttribute("class", "progress-circle progress-" + percentVal)
          count.innerText = (n + 1) + "/" + RNum
          var tmpPromise = await FileToArrayBuffer(file, step * sliceUnit, (step + 1) * sliceUnit).then(async function(buffer) {
            var tmpUrl = await DoUpload(buffer, server, token)
            restoreUrlJSON[step] = tmpUrl
            if (n + 1 === RNum) {
              let utf8Encode = new TextEncoder()
              var masterUrl = await DoUpload(utf8Encode.encode(JSON.stringify(restoreUrlJSON)), server, token)
              alert("복구가 완료되었습니다. 글을 자동으로 수정합니다.")
              document.querySelector('html').innerHTML = originalDoc
              setTimeout(function() {
                let writeForm = document.querySelector('#content')
                let writeText = writeForm.value
                writeForm.value = writeText.replace(insertAllString(window.btoa(restoreUrl).replace(/\//g, '_').replace(/\+/g, '-')), insertAllString(window.btoa(masterUrl).replace(/\//g, '_').replace(/\+/g, '-')))
                setTimeout(function() {
                  let articleForm = document.querySelector("#article_write_form")
                  let submitBtn = document.createElement("button")
                  submitBtn.setAttribute("type", "submit")
                  articleForm.appendChild(submitBtn)
                  submitBtn.click()
                }, 100)
              }, 100)
            }
          })
        }
      })
    }
  } else { // 복구 코드가 없으므로 나가기
    alert("복구 코드를 읽을 수 없습니다. 이전 페이지로 돌아갑니다.")
    window.location = window.location.href
  }
}

// 다운로드 시작 함수
function DownloadInit() {
  window.onload = function() {
    var fileSpace = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-body > div.fr-view.article-content > div > table")
    var fileNote = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-body > div.fr-view.article-content > div > table > tbody > tr > td:nth-child(4) > p > a")
    var fileContent = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-body > div.fr-view.article-content > div > table > tbody > tr > td:nth-child(1) > p")
    var fileName = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div.article-view > div.article-wrapper > div.article-body > div.fr-view.article-content > div > table > tbody > tr > td:nth-child(2) > p")
    // 구버전 호환
    if (fileContent != null && fileNote.getAttribute("href") != null && fileContent.innerText.includes("*A|@$|D*")) {
      rawFilelist = fileContent.innerText.split("*A|@$|D*")
      rawFilename = rawFilelist[1]
      rawFiledata = rawFilelist[2].replace(/_/g, '/').replace(/-/g, '+');
      fileNote.removeAttribute("href")
      fileNote.setAttribute("style", "cursor: pointer;")
      fileSpace.setAttribute("class", "btn btn-arca")
      fileSpace.setAttribute("style", "border: lightgray solid 1px;padding:0;")
      // 첨부파일 누를 시 다운로드
      fileSpace.onclick = function() {
        alert("첨부파일을 다운로드합니다.")
        downloadURI(rawFiledata, rawFilename);
      };
    }
    // 신버전
    else {
      let fileSpaceList = jQcontains("table", "[:ArcaDownloadManager:]")
      if (fileSpaceList) {
        fileSpaceList.forEach(function(d) {
          try {
            var fileSpace = d
            var fileDownlodaBtn = fileSpace.querySelector("tbody > tr > td:nth-child(4)")
            var fileNote = fileSpace.querySelector("tbody > tr > td:nth-child(4) > p > a")
            var fileContent = fileSpace.querySelector("tbody > tr > td:nth-child(1) > p").innerText.split("[:ArcaDownloadManager:]")[1]
            var fileName = fileSpace.querySelector("tbody > tr > td:nth-child(2)")
            var fileRestore = fileSpace.querySelector("tbody > tr > td:nth-child(5) > a")
            var rawFileUrl = window.atob(fileContent.replace(/_/g, '/').replace(/-/g, '+').replace(/\|/g, "")) // 2.0.1: base64 자동 디코드 충돌 해결: 문자열마다 "|" 삽입
            rawFileUrl = newArcaUrl(rawFileUrl)

            fileDownlodaBtn.setAttribute("style", "cursor: pointer;")
            fileSpace.setAttribute("class", "btn btn-arca")
            fileSpace.setAttribute("style", "border: lightgray solid 1px;padding:0;")
            fileNote.removeAttribute("href")
            fileRestore.setAttribute("href", "https://" + rawFileUrl.split("/")[2] + "/a/?=" + rawFileUrl)

            let fileSpeed = document.createElement("p");
            fileSpeed.setAttribute("style", "padding-left:10%;display:inline")
            fileSpeed.innerText = "다운로드 대기 중"
            fileSpeed.setAttribute("id", "fileSpeed-" + fileName.innerText)
            let fileProgress = document.createElement("progress");
            fileProgress.setAttribute("value", "0")
            fileProgress.setAttribute("max", "100")
            fileProgress.setAttribute("style", "width:100%;")
            fileProgress.setAttribute("id", "fileProgress-" + fileName.innerText)
            let fileAbort = document.createElement("div");
            fileAbort.setAttribute("cursor", "pointer")
            fileAbort.append("취소")
            fileAbort.setAttribute("class", "btn btn-arca btn-sm float-right")
            fileAbort.setAttribute("id", "fileAbort-" + fileName.innerText)
            fileAbort.setAttribute("value", false)

            // 첨부파일 누를 시 다운로드
            fileDownlodaBtn.onclick = async function() {
              fileSpace.closest("div").append(fileSpeed)
              fileSpace.closest("div").append(fileAbort)
              fileSpace.closest("div").append(fileProgress)
              let pause = Gpause
              while (pause) { // 이미 다른 파일이 다운로드 중이라면 완료시까지 대기
                await sleep(1000)
                pause = Gpause
              }
              Gpause = true // 다른 다운로드 작업들은 대기시키기
              fileSpeed.innerText = "파일 리스트 다운로드 중..."
              getFile(rawFileUrl)
                .then(function(buffer) {
                  fileSpeed.innerText = "파일 리스트 다운로드 완료"
                  let utf8decoder = new TextDecoder();
                  let downloadList = JSON.parse(utf8decoder.decode(buffer))
                  DownloadProcessData(downloadList, fileName.innerText, fileSpeed, fileProgress, fileAbort)
                })
                .catch((error) => {
                  console.log("getFile 에러: ", error)
                  fileSpeed.innerText = "파일 리스트 다운로드 에러, 새로고침 후 재시도 할 수 있습니다."
                  Gpause = false
                })
            }
            fileAbort.onclick = function() {
              fileSpeed.innerText = "다운로드 취소중..."
              fileAbort.setAttribute("value", true)
              Gpause = false
            }
          } catch (e) {
            console.log(e)
          }
        })
      }
    }
  }
}

// 글로벌 일시정지
let Gpause = false

// 글로벌 업로드 취소
let Uabort = false

// 대기 함수
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 라디오버튼 체크 함수
function checkRadio(name) {
  return new Promise((resolve, reject) => {
    var radios = document.getElementsByName(name);
    for (let i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        resolve(radios[i].value)
      }
    }
  })
}

// 게시글에 파일 첨부
function WriteDOMchanger(name, size, content, restore = false) {
  var tagPtemp = document.createElement("p");
  tagPtemp.setAttribute("style", "font-size: 0px;")

  var bData = window.btoa(content)
  var urlSafebData = bData.replace(/\//g, '_').replace(/\+/g, '-');
  tagPtemp.append("[:ArcaDownloadManager:]" + insertAllString(urlSafebData)) // 2.0.1: base64 자동 디코드 충돌 해결: 문자열마다 "|" 삽입 - insertAllString

  var tagPrestore = document.createElement("a");
  tagPrestore.append("검사")

  var fileBetween = document.createElement("p");

  // 태그 생성
  var tagTable = document.createElement("table");
  tagTable.setAttribute("style", "width: 100%;")
  var tagTbody = document.createElement("tbody");
  var tagTr = document.createElement("tr");
  var tagTd1 = document.createElement("td");
  tagTd1.setAttribute("style", "width: 1%;")
  var tagTd2 = document.createElement("td");
  tagTd2.setAttribute("style", "width: 55%;")
  var tagTd3 = document.createElement("td");
  tagTd3.setAttribute("style", "width: 20%;")
  var tagTd4 = document.createElement("td");
  tagTd4.setAttribute("style", "width: 16%;")
  var tagTd5 = document.createElement("td");
  tagTd5.setAttribute("style", "width: 8%;")

  var tempPtag = document.createElement("p");
  var scriptHref = document.createElement("a");
  scriptHref.setAttribute("href", "https://arca.live/b/smpeople/29257100") // 스크립트 없을 경우 설명 게시글로 이동
  scriptHref.append('다운로드')
  tempPtag.append(scriptHref)

  // 요소 상속
  tagTd1.append(tagPtemp)
  tagTd2.append(name)
  tagTd3.append(size)
  tagTd4.append(tempPtag)
  tagTd5.append(tagPrestore)

  tagTr.append(tagTd1)
  tagTr.append(tagTd2)
  tagTr.append(tagTd3)
  tagTr.append(tagTd4)
  tagTr.append(tagTd5)

  tagTbody.append(tagTr)
  tagTable.append(tagTbody)

  var contentArea = document.createElement("div");
  contentArea.append(tagTable);

  if (restore) {
    return contentArea
  } else {
    // 글 작성 요소
    document.querySelector("#content").value += contentArea.outerHTML + fileBetween.outerHTML
    var contentInput = document.querySelector("#article_write_form > div.write-body > div > div.fr-wrapper > div")
    contentInput.append(contentArea)
    contentInput.append(fileBetween)
  }
}

// GET/HEAD요청으로 URL존재 점검
function urlIntegrityCheck(url, req) {
  url = newArcaUrl(url)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: req,
      url: url,
      onload: function(response) {
        if (response.status === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      onerror: error => {
        resolve(false)
      }
    })
  })
}

// URL리스트 손상 확인 함수
function urlListCheck(server, urlList) {
  let progressBar = document.querySelector("#progress")
  let percent = document.querySelector("#percent")
  let count = document.querySelector("#count")
  let text = document.querySelector("#text")
  let QNum = urlList.length
  let brokenUrlList = [];
  let req;
  if (server === "imgbb.com") {
    req = "GET"
  }
  if (server === "arca.live") {
    req = "HEAD"
  }
  return new Promise(async (resolve, reject) => {
    for (let n = 0; n < urlList.length; n++) {
      let percentVal = Math.ceil((n + 1) * 100 / QNum)
      percent.innerText = percentVal + "%"
      progressBar.setAttribute("class", "progress-circle progress-" + percentVal)
      count.innerText = (n + 1) + "/" + QNum
      let tmp = await urlIntegrityCheck(urlList[n], req).then((e) => {
        if (!e) {
          brokenUrlList.push(n)
        }
      })
    }
    resolve(brokenUrlList)
  })
}

// URL리스트 점검
function checkDataInit(server, rawFileUrl) {
  UrlCheckDOMchanger()
  let progressBar = document.querySelector("#progress")
  let percent = document.querySelector("#percent")
  let count = document.querySelector("#count")
  let text = document.querySelector("#text")
  text.innerText = "검사중"
  rawFileUrl = newArcaUrl(rawFileUrl)
  getUrlList(rawFileUrl).then(function(json) {
    let allList = Object.values(json)
    let QNum = allList.length
    urlListCheck(server, allList).then(function(brokenList) {
      text.innerText = "검사종료"
      if (brokenList.length !== 0) {
        alert("일부 링크가 손상되어 있습니다.")
        alert("손상 코드를 출력합니다.\n본 파일이 들어있는 게시글의 수정 버튼을 누른 후,\n복구 버튼을 눌러 코드를 입력해주세요.")
        alert(rawFileUrl + "|" + String(brokenList))
      } else {
        alert("손상된 링크는 없습니다.")
      }
    })
  })
}

// url리스트 출력 함수
function getUrlList(url) {
  return new Promise((resolve, reject) => {
    getFile(url)
      .then(function(buffer) {
        let utf8decoder = new TextDecoder();
        let downloadList = JSON.parse(utf8decoder.decode(buffer))
        resolve(downloadList)
      })
      .catch((error) => {
        console.log("getUrlList 에러: ", error)
        alert("URL리스트를 얻을 수 없었습니다.\n다시 시도하여도 계속 에러가 발생한다면, URL리스트가 손실되었을 수 있습니다.")
      })
  })
}

// 커스텀 HTML로 바꾸기
function UrlCheckDOMchanger() {
  document.querySelector('html').innerHTML = '<head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title> <style>body{font-family: "Open Sans Condensed", sans-serif; width: 100%; height: 100vh; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center;}.progress-circle{position: relative; display: inline-block; width: 360px; height: 360px; border-radius: 50%; background-color: #ebebeb; vertical-align: middle}.progress-circle:after{content: ""; display: inline-block; width: 100%; height: 100%; border-radius: 50%; -webkit-animation: colorload 2s; animation: colorload 2s; vertical-align: middle}.progress-circle span{font-size: 1rem; color: #8b8b8b; position: absolute; display: block; width: 340px; height: 340px; margin-top: 10px; margin-left: 10px; text-align: center; border-radius: 50%; background: #fff; z-index: 1;}.percent{color: #8d8d8d; display: inline; position: absolute; top: 30px; left: 70px; font-size: 100px; z-index: 10;}.content{color: #8d8d8d; display: inline; position: absolute; top: 160px; left: 130px; font-size: 40px; z-index: 10;}.notice{color: #8d8d8d; display: inline; position: absolute; top: 220px; left: 130px; font-size: 35px; z-index: 10; margin: 0 auto;}.file{color: #8d8d8d; display: inline; position: absolute; top: 280px; left: 95px; z-index: 10; margin: 0 auto;}</style></head><body><div class="progress-circle-container" style="text-align: center;"> <div id="progress" class="progress-circle progress-0"> <span></span> <div class="percent" id="percent">00%</div><div class="content" id="count">00/00</div><div class="notice" id="text">대기중</div><input class="file" id="file" type="file" style="display:none"> </div></div></body><style>.progress-circle.progress-0:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(90deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-1:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(93.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-2:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(97.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-3:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(100.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-4:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(104.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-5:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(108deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-6:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(111.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-7:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(115.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-8:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(118.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-9:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(122.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-10:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(126deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-11:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(129.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-12:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(133.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-13:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(136.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-14:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(140.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-15:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(129.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-16:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(133.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-17:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(136.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-18:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(140.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-19:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(144deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-20:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(151.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-21:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(158.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-22:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(161.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-23:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(165.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-24:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(169.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-25:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(180deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-26:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(183.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-27:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(187.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-28:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(190.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-29:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(194.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-30:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(198deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-31:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(201.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-32:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(205.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-33:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(208.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-34:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(212.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-35:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(216deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-40:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(234deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-36:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(219.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-37:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(223.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-38:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(226.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-39:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(230.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-41:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(237.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-42:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(241.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-43:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(244.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-44:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(248.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-45:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(252deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-46:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(255.6deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-47:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(259.2deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-48:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(262.8deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-49:after{background-image: linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(266.4deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-50:after{background-image: linear-gradient(-90deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-51:after{background-image: linear-gradient(-86.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-52:after{background-image: linear-gradient(-82.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-53:after{background-image: linear-gradient(-79.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-54:after{background-image: linear-gradient(-75.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-55:after{background-image: linear-gradient(-72deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-56:after{background-image: linear-gradient(-68.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-57:after{background-image: linear-gradient(-64.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-58:after{background-image: linear-gradient(-61.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-59:after{background-image: linear-gradient(-57.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-60:after{background-image: linear-gradient(-54deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-61:after{background-image: linear-gradient(-50.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-62:after{background-image: linear-gradient(-46.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-63:after{background-image: linear-gradient(-43.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-64:after{background-image: linear-gradient(-39.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-65:after{background-image: linear-gradient(-36deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-66:after{background-image: linear-gradient(-32.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-67:after{background-image: linear-gradient(-28.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-68:after{background-image: linear-gradient(-25.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-69:after{background-image: linear-gradient(-21.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-70:after{background-image: linear-gradient(-18deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-71:after{background-image: linear-gradient(-14.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-72:after{background-image: linear-gradient(-10.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-73:after{background-image: linear-gradient(-7.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-74:after{background-image: linear-gradient(-3.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-75:after{background-image: linear-gradient(0deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-76:after{background-image: linear-gradient(3.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-77:after{background-image: linear-gradient(7.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-78:after{background-image: linear-gradient(10.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-79:after{background-image: linear-gradient(14.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-80:after{background-image: linear-gradient(18deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-81:after{background-image: linear-gradient(21.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-82:after{background-image: linear-gradient(25.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-83:after{background-image: linear-gradient(28.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-84:after{background-image: linear-gradient(32.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-85:after{background-image: linear-gradient(36deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-86:after{background-image: linear-gradient(39.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-87:after{background-image: linear-gradient(43.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-88:after{background-image: linear-gradient(46.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-89:after{background-image: linear-gradient(50.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-90:after{background-image: linear-gradient(54deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-91:after{background-image: linear-gradient(57.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-92:after{background-image: linear-gradient(61.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-93:after{background-image: linear-gradient(64.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-94:after{background-image: linear-gradient(68.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-95:after{background-image: linear-gradient(72deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-96:after{background-image: linear-gradient(75.6deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-97:after{background-image: linear-gradient(79.2deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-98:after{background-image: linear-gradient(82.8deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-99:after{background-image: linear-gradient(86.4deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}.progress-circle.progress-100:after{background-image: linear-gradient(90deg, #66b8ff 50%, transparent 50%, transparent), linear-gradient(270deg, #66b8ff 50%, #ebebeb 50%, #ebebeb);}</style>'
}