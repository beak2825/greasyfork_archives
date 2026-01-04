// ==UserScript==
// @name         tmall图片视频下载为zip
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  简单下载资源
// @author       windeng
// @match        https://detail.tmall.com/item.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434977/tmall%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%BAzip.user.js
// @updateURL https://update.greasyfork.org/scripts/434977/tmall%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%BAzip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var lastDownloadTime = 0
var doing = false
var speedCtrl = 100 // 搞一次的间隔时间

function include(src) {
  var newscript = document.createElement('script')
  newscript.setAttribute('type', 'text/javascript')
  newscript.setAttribute('src', src)
  var head = document.getElementsByTagName('head')[0]
  head.appendChild(newscript)
}

function url2blob(url) {
  return new Promise((resolve, reject) => {
    if (speedCtrl) {
      if (doing) {
        setTimeout(() => {
          url2blob(url).then(res => {
            resolve(res)
          })
        }, speedCtrl)
      } else {
        doing = true
        var now = new Date().getTime()
        console.log(url, now, lastDownloadTime, speedCtrl - (now - lastDownloadTime))
        if (now - lastDownloadTime < speedCtrl) {
          setTimeout(() => {
            fetch(url).then(res => res.blob().then(blob => {
              lastDownloadTime = now
              doing = false
              resolve(blob)
            }))
          }, speedCtrl - (now - lastDownloadTime))
        } else {
          fetch(url).then(res => res.blob().then(blob => {
            lastDownloadTime = now
            doing = false
            resolve(blob)
          }))
        }
      }
    } else {
      fetch(url).then(res => res.blob().then(blob => {
        resolve(blob)
      }))
    }
  })
}

function downloadFile(fileName, url, zip) {
  return url2blob(url).then(blob => {
    zip.file(fileName, blob)
    // var a = document.createElement('a');
    // var url = window.URL.createObjectURL(blob);
    // a.href = url;
    // a.download = fileName;
    // a.click();
    // window.URL.revokeObjectURL(url);
  })
  // fetch(url).then(res => res.blob().then(blob => {
  //   var a = document.createElement('a');
  //   var url = window.URL.createObjectURL(blob);
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }))
}

function getTitle() {
  var titleDom = document.getElementById('J_DetailMeta').getElementsByTagName('h1')[0]
  var title = titleDom.innerText
  return title
}

// 主图
function getMainImages() {
  return new Promise((resolve, reject) => {
    var event = new MouseEvent('mouseover', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    })

    var thumbDom = document.getElementById('J_UlThumb')
    var thumbLiList = thumbDom.getElementsByTagName('li')
    for (let i=0; i<thumbLiList.length; ++i) {
      let li = thumbLiList[i]
      setTimeout(() => {
        console.log(li)
        li.dispatchEvent(event);
        if (i+1 === thumbLiList.length) {
          setTimeout(() => {
            resolve()
          }, 300)
        }
      }, i * 300)
    }
  }).then(() => {
    var dom = document.getElementsByTagName('div')[0]
    var imgList = dom.getElementsByTagName('img')
    var title = getTitle()
    var res = []
    var idx = 0;
    for (var i=0; i<imgList.length; ++i) {
      var img = imgList[i]
      var src = img.getAttribute('src')
      if (src.match(/\d+x\d+/)) continue
      var imgName = `${title}_主图_${idx+1}.${src.split('.').pop()}`
      res.push({url: src, name: imgName})
      ++idx
    }
    return res
  })
}

// 主视频
function getMainVideos() {
  return new Promise((resolve, reject) => {
    var startDom = document.getElementsByClassName('J_playVideo')[0]
    console.log('startDom', startDom)
    if (startDom) startDom.click()

    setTimeout(() => {
      var title = getTitle()
      var res = []
      var videos = document.getElementsByTagName('video')
      for (var i=0; i<videos.length; ++i) {
        var video = videos[i]
        var source = video.getElementsByTagName('source')[0]
        var url = source.getAttribute('src')
        var name = `${title}_主视频_${i+1}.${url.split('.').pop()}`
        res.push({url: url, name: name})
      }
      resolve(res)
    }, 1000)
  })
}

// 详情中的图片
function getDetailImages() {
  return new Promise((resolve, reject) => {
    var imageDom = document.getElementById('description')
    var title = getTitle()
    var imgs = imageDom.getElementsByTagName('img')
    var res = []
    for (var i=0; i<imgs.length; ++i) {
      var img = imgs[i]
      console.log(img)
      var oriName = ''
      if (img.getAttribute('alt')) {
        oriName = img.getAttribute('alt').split('.').slice(0,-1).join('.')
      }
      var url = img.getAttribute('src').replace('http://', 'https://')
      var name = `${title}_细节图_${i+1}_${oriName}.${url.split('.').pop()}`
      res.push({url: url, name: name})
    }
    resolve(res)
  })
}

function run(zip) {
  // var script = document.createElement('script')
  // script.src = 'https://cdn.bootcdn.net/ajax/libs/jszip/3.3.0/jszip.min.js'
  // script.async = false
  // document.getElementsByTagName('body')[0].appendChild(script)

  var input = document.getElementById('_this_speedCtrl')
  speedCtrl = parseInt(input)

  getMainImages().then(mainImages => {
    var getMainImagesPromises = []
    mainImages.forEach(obj => {
      console.log('main img', obj)
      var p = downloadFile(obj.name, obj.url, zip)
      getMainImagesPromises.push(p)
    })
    return Promise.all(getMainImagesPromises).then(() => {
      return Promise.resolve()
    })
  }).then(() => {
    return getMainVideos().then(mainVideos => {
      var getMainVideosPromises = []
      mainVideos.forEach(obj => {
        console.log('video obj', obj)
        var p = downloadFile(obj.name, obj.url, zip)
        getMainVideosPromises.push(p)
      })
      return Promise.all(getMainVideosPromises).then(() => {
        return Promise.resolve()
      })
    })
  }).then(() => {
    return getDetailImages().then(detailImgs => {
      var getDetailImagesPromises = []
      detailImgs.forEach(obj => {
        console.log('detail img', obj)
        var p = downloadFile(obj.name, obj.url, zip)
        getDetailImagesPromises.push(p)
      })
      return Promise.all(getDetailImagesPromises).then(() => {
        return Promise.resolve()
      })
    })
  }).then(() => {
    return zip.generateAsync({type:"blob"}).then((blob) => {
      var offerid = document.URL.match(/id=(\d+)/)[1]
      var title = getTitle()

      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${offerid}_${title}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  })
}

function main() {
  import('https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js').then(module => {
    var zip = new JSZip()
    console.log(zip)

    var titleDom = document.getElementById('J_DetailMeta').getElementsByTagName('h1')[0]

    var input = document.createElement('input')
    input.id = '_this_speedCtrl'
    input.type = 'text'
    input.placeholder = '下载间隔(ms)'
    input.value = speedCtrl
    input.style = `outline-style: none ;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 4px;
    margin-right: 3px;
    font-size: 1em;
    font-family: "Microsoft soft";`
    titleDom.appendChild(input)

    var node = document.createElement('button')
    node.onclick = run.bind(this, zip)
    node.innerHTML = '下载资源'
    node.style = `padding: 4px 6px;
    outline-style: none;
    border: none;
    background-color: #269FF7;
    font-size: 1em;
    color: #fff;
    font-family: "Microsoft soft";`
    titleDom.appendChild(node)
  })
}

window.onload = main
// main()

})();