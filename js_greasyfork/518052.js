// ==UserScript==
// @name        一键扒图-京东
// @namespace   Mopanda Scripts
// @include     /https:\/\/(item\.jd\.com|npcitem\.jd\.hk)\/\d*\.html/
// @grant       GM_addStyle
// @version     1.0.5
// @author      Mopanda
// @description 一键打包下载京东主图+详情图+视频
// @license MIT
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require     https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require     https://cdn.jsdelivr.net/npm/notiflix@3.2.5/dist/notiflix-aio-3.2.5.min.js

// @downloadURL https://update.greasyfork.org/scripts/518052/%E4%B8%80%E9%94%AE%E6%89%92%E5%9B%BE-%E4%BA%AC%E4%B8%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/518052/%E4%B8%80%E9%94%AE%E6%89%92%E5%9B%BE-%E4%BA%AC%E4%B8%9C.meta.js
// ==/UserScript==
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout))
let done = false
const skuCode = location.href.match(/\/(\d*).html/)[1]
const skuName = $(".sku-name").text().replace(/\s+|\\/g, '')
const zip = new JSZip()
const folder = zip.folder(skuName)
const Loading = Notiflix.Loading

let textArr = []
function pushMessage(message){
  textArr.push(message)
  Loading.change('已下载 '+ textArr.length +' 个文件。' + textArr.join('，'))
}
async function downloadMainImage() {
  const imgUrlList = $("#spec-list ul li img")
    .map(function () {
      //return $(this)
      //  .attr("src")
      //  .replace("n5", "n12")
      //  .replace('.avif', '')
      let src = $(this).attr("src");
      return src.replace("n5", "n12").replace("s54x54", "s800x800").replace('.avif', '');
    })
    .get()
  for (let i = 0; i < imgUrlList.length; i++) {
    const url = imgUrlList[i].replace('.avif', '')
    const fileExt = url.split('.').pop()
    const imgData = await fetch(url).then((res) => res.blob())
    const filename = "主图-" + (i + 1) + "." + fileExt
    folder.file(filename, imgData)
    pushMessage(filename)
  }
}

async function downloadMainContent() {
  const $html = $('html')
  $html.scrollTop(2000)
  $html.scrollTop(100)
  await delay(1000)
  let contentImageUrlList = []
  const $ssdModule = $('.ssd-module')
  if ($ssdModule.length) {
    contentImageUrlList.push(...$ssdModule
      .map(function () {
        let result = $(this).css("background-image").replace('url("', "").replace('")', "")
        if (result === 'none') {
          result = $(this).find('img').attr('src')
        }
        return result
      })
      .get())
  }
  const $ContentImage = $('#J-detail-content img')
  if ($ContentImage.length) {
    contentImageUrlList.push(...$ContentImage
      .map(function () {
        return $(this).attr("data-lazyload") || $(this).attr("src")
      })
      .get()
      .map(url => url.replace('http://', 'https://')))
  }
  for (let i = 0; i < contentImageUrlList.length; i++) {
    const url = contentImageUrlList[i].replace('.avif', '')
    const fileExt = url.split('.').pop()
    const imgData = await fetch(url).then((res) => res.blob())
    const filename = "详情-" + (i + 1) + '.' + fileExt
    folder.file(filename, imgData)
    pushMessage(filename)
  }
}

async function downloadVideo() {
  const $videoIcon = $(".J-video-icon")
  if ($videoIcon.length) {
    $videoIcon.click()
    await delay(1000)
    const $video = $("#video-player_html5_api")
    $video[0].pause()  // 暂停视频
    $video[0].muted = true  // 静音视频
    const videoUrl = $video.attr("src") || $video.find('source').attr("src")
    const videoData = await fetch(videoUrl).then((res) => res.blob())
    folder.file("视频-1.mp4", videoData)
    pushMessage("视频-1.mp4")
  }else{
    console.log("当前商品没有视频可下载")
  }
}

async function downloadWithoutVideo() {
  await showLoading()
  await downloadMainImage()
  await downloadMainContent()
  zip.generateAsync({type: "blob"}).then(function (content) {
    // see FileSaver.js
    saveAs(content, skuName + ".zip")
  })
  await hideLoading()
}

async function downloadAll() {
  await showLoading()
  await downloadMainImage()
  await downloadMainContent()
  await downloadVideo()
  zip.generateAsync({type: "blob"}).then(function (content) {
    // see FileSaver.js
    saveAs(content, skuName + ".zip")
  })
  await hideLoading()
}


async function showLoading() {
  GM_addStyle(`
  #NotiflixLoadingMessage{
  width:600px;
  }
  `)
  Loading.init({
    className: 'notiflix-loading',
    zindex: 4000,
    backgroundColor: 'rgba(0,0,0,0.8)',
    rtl: false,
    fontFamily: 'Quicksand',
    cssAnimation: true,
    cssAnimationDuration: 400,
    clickToClose: false,
    customSvgUrl: null,
    customSvgCode: null,
    svgSize: '80px',
    svgColor: '#32c682',
    messageID: 'NotiflixLoadingMessage',
    messageFontSize: '15px',
    messageMaxLength: 99999,
    messageColor: '#dcdcdc',
  })
  Loading.standard('开始下载...')
}

async function hideLoading() {
  Loading.change('下载完成 ...')
  textArr = []
  Loading.remove(2000)
}

const observer = new MutationObserver(async () => {
  const mainContentLoaded = $("#spec-list ul li img").length
  if (mainContentLoaded && !done) {
    done = true
    const $leftBtns = $(".left-btns")
    $leftBtns.append(
      `
<a class="btn-primary" id="downloadWithoutVideo">
  <span style="color:#fff;">下载主图+详情</span>
</a>
`
    )
    if ($(".J-video-icon").length) {
      $leftBtns.append(
        `
<a class="btn-primary" id="downloadAll">
  <span style="color:#fff;">下载主图+详情+视频</span>
</a>`
      )

      $('#downloadAll').click(downloadAll)
    }
    $('#downloadWithoutVideo').click(downloadWithoutVideo)
  }
})
observer.observe(document.querySelector("body"), {
  attributes: true,
  childList: true,
  subtree: true,
})
