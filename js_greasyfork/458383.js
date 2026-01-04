// ==UserScript==
// @name           Save KakaoPage
// @description    image batch download for kakaopage
// @namespace https://greasyfork.org/users/976225
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20230118123204
// @downloadURL https://update.greasyfork.org/scripts/458383/Save%20KakaoPage.user.js
// @updateURL https://update.greasyfork.org/scripts/458383/Save%20KakaoPage.meta.js
// ==/UserScript==
 
(function() {
  function deferredAddZip(url, filename, zip) {
    let deferred = $.Deferred();
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        console.log(`failed : ${filename}, ${url}`);
        deferred.reject(err);
      } else {
        zip.file(filename, data, {binary: true});
        deferred.resolve(data);
      }
    });
    return deferred;
  }
 
  downloadToon = (zipname, imgname) => {
    let pageNum = 0;
    let zip = new JSZip();
    let deferreds = [];

    // 전체 페이지 검색
    let pages = document.getElementsByClassName('swiper-slide');
    for (let page of pages) {
      let imgTag = page.firstChild.firstChild.firstChild;
      if (null === imgTag) continue;
      if ('IMG' == imgTag.tagName) {
        //console.log(imgTag.src);
        deferreds.push(deferredAddZip(imgTag.src, `${imgname}${String(pageNum).padStart(3, '0')}.jpg`, zip));
        ++pageNum;
      }
    }

    // when everything has been downloaded, we can trigger the dl
    $.when.apply($, deferreds).done(() => {
      zip.generateAsync({type: "blob"}).then((content) => {
        saveAs(content, zipname);
      });
      console.log('done!');
    }).fail((err) => {
      console.log('err!!');
    });
  };

  function start() {
    let bWait = false;
    if (typeof(jQuery) == 'undefined') {
      let jquery = document.createElement('script');
      jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
      document.body.appendChild(jquery);
      bWait = true;
    }
 
    if (typeof(JSZip) == 'undefined') {
      let jscript = document.createElement('script');
      jscript.src = 'https://stuk.github.io/jszip/dist/jszip.js';
      document.body.appendChild(jscript);
      bWait = true;
    }

    if (typeof(JSZipUtils) == 'undefined') {
      let jscript = document.createElement('script');
      jscript.src = 'https://stuk.github.io/jszip-utils/dist/jszip-utils.js';
      document.body.appendChild(jscript);
      bWait = true;
    }

    if (typeof(saveAs) == 'undefined') {
      let jscript = document.createElement('script');
      jscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
      document.body.appendChild(jscript);
      bWait = true;
    }
 
    if (bWait) {
      setTimeout(start, 100);
      return;
    }

    let id = (document.location.href.match(/\/viewer\/(\d+)/) ? RegExp.$1 : null);
    if (null === id) {
      console.log('invalid url');
      return;
    }

    let title = __NEXT_DATA__.props.pageProps.initialState.json.singleInfo.singlePreview[id].data.seriesPreview.title;
    let ep = __NEXT_DATA__.props.pageProps.initialState.json.singleInfo.singlePreview[id].data.title;

    let imgname = '';
    if (ep.match(/(\d+)[^\s]*(?:\s*\-\s*(\d+)[^\s]*)?$/)) {
      imgname += ('' !== RegExp.$1 ? `${RegExp.$1.padStart(3, '0')}_` : '000_');
      imgname += ('' !== RegExp.$2 ? `${RegExp.$2.padStart(3, '0')}_` : '000_');
    }
    console.log(imgname);
    let zipname = `${title} ${ep}.zip`;
    zipname = zipname.replace(/[\\\/:\*\?"<>\|]/, "_");

    downloadToon(zipname, imgname);
  }
 
  start();
})();