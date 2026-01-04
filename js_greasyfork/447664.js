// ==UserScript==
// @name         Ehentai漫画查看器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ehentai漫画查看器,自动加载下一页并显示进度
// @author       You
// @match        https://e-hentai.org/s/*/*
// @downloadURL https://update.greasyfork.org/scripts/447664/Ehentai%E6%BC%AB%E7%94%BB%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/447664/Ehentai%E6%BC%AB%E7%94%BB%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==
(function (window) {
  function getNext (url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var response = xhr.responseText;
        var m = response.match(
          /<div id="i3"><a[^>]+>(<img.*?src="(.*?)".*?)<[^>]+>/
        );
        var imageTag = m && m[1];
        var imgSrc = m && m[2];
        var $img = new Image();
        $img.src = imgSrc;
        // loadImage(imgSrc);
        $img.onload = function () {
          var i3 = document.getElementById("i3");
          i3.innerHTML += `<a href="${url}">${imageTag}</a>`;
          m = response.match(/<a id="next".*?href="([^"]+)"/);
          var next = m && m[1];
          console.log(m)
          m = response.match(/<div class="sn".*?<div><span>(\d+)<\/span>.*?\/.*?<span>(\d+)<\/span><\/div>/);
          var curPage = m && m[1];
          var totalPage = m && m[2];
          console.log(m)
          updatePages(curPage, totalPage)
          if (next && next !== url) {
            if (stop) {
              stopNext = next;
            } else {
              var delay = ~~(Math.random() * 3000);
              setTimeout(getNext, delay, next);
            }
          } else if (next === url) {
            var btn = document.getElementById("loading-control-btn");
            btn.innerHTML = "加载完成";
            btn.style.background = "#ff0000";
          }
        };
        $img.onerror = function () {
          getNext(url);
        };
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  function updatePages(curPage, totalPage) {
    var btn = document.getElementById('cdb-pages-btn')
    btn.innerHTML = `${curPage}/${totalPage}`
    updateProgress(curPage, totalPage)
  }
  
  function createButton (id, text, style, fn) {
    var btn = document.createElement("div");
    btn.id = id || "custom-define-btn";
    var btnStyle = Object.assign({
      position: "fixed",
      right: "0",
      top: "0",
      padding: "2vw 5vw",
      background: "rgba(46,223,163, 0.8)",
      color: "#fff",
      fontSize: "10vw",
      fontWeight: "700",
      zIndex: "9999"
    }, style)
    css(btn, btnStyle);
    btn.innerHTML = text;
    btn.onclick = function () {
      fn && fn(btn);
    };
    document.body.appendChild(btn);
    return btn;
  }
  function css (div, style) {
    for (let key in style) {
      var val = style[key];
      if (typeof val === 'number') {
        div.style[key] = val + 'px';
      } else {
        div.style[key] = style[key];
      }
    }
  }
  function updateProgress (loaded, total) {
    console.log(loaded, total)
    var bar = document.getElementById('progress-bar')
    bar.style.width = ~~(loaded / total * 100) + '%'
  }
  function createProgress () {
    var progress = document.createElement('div');
    progress.id = 'progress-bar-container'
    progress.innerHTML = `
      <div style="position: absolute;">
        <span id="cdb-current-page">${currentPage}/</span><span id="cdb-pages-btn">0/0</span>
      </div>
    `
    var bar = document.createElement('div')
    bar.id = 'progress-bar'
    css(bar, {
      background: '#eacd76',
      height: '10vw',
      width: '0%'
    })
    progress.appendChild(bar)
    css(progress, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      height: '10vw',
      lineHeight: '10vw',
      color: '#ffffff',
      fontSize: '8vw',
      background: 'rgba(46,223,163, 0.8)',
      zIndex: '100'
    })
    document.body.appendChild(progress)
  }
  var stopNext = "";
  var stop = false;
  var $next = document.getElementById("next");
  var currentPage = 0
  if ($next) {
    getNext($next.href);
    createButton('loading-control-btn', "暂停加载", { top: 0 }, function (btn) {
      if (btn.innerHTML === "暂停加载") {
        stop = true;
        btn.innerHTML = "继续加载";
      } else if (btn.innerHTML === "继续加载") {
        stop = false;
        getNext(stopNext || $next.href);
        btn.innerHTML = "暂停加载";
      }
    });
    currentPage = +document.querySelector('.sn').querySelector('div span:nth-child(1)').innerHTML
    createProgress()

    console.log({ currentPage})

    window.addEventListener('scroll', function () {
      var scrollTop = document.documentElement.scrollTop
      var cp = document.getElementById('cdb-current-page')
      var imgs = document.querySelectorAll('#img')
      var indexOfImgs = 0
      for (;indexOfImgs < imgs.length; indexOfImgs+=1) {
        var img = imgs[indexOfImgs]
        if (img.offsetTop > scrollTop) {
          break
        }
      }
      cp.innerHTML = (currentPage + indexOfImgs - 1) + '/'
    })

  }
})(window);
