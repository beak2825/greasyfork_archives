// ==UserScript==
// @name        SoulPlus|soulplus|North-Plus|north-plus|魂+|北+论坛自动加载图墙列表
// @namespace   http://north-plus.net
// @description 下拉到页面底部自动获取下一页的图墙列表
// @match     http://north-plus.net/thread_new.php?fid-*-page-*.html
// @match     http://bbs.north-plus.net/thread_new.php?fid-*-page-*.html
// @match     http://www.north-plus.net/thread_new.php?fid-*-page-*.html
// @match     http://bbs.imoutolove.me/thread_new.php?fid-*-page-*.html
// @match     http://bbs.soulxplus.net/thread_new.php?fid-*-page-*.html
// @match     http://106.185.27.223/thread_new.php?fid-*-page-*.html
// @match     https://bbs.white-plus.net/thread_new.php?fid-*-page-*.html
// @match     https://www.south-plus.net/thread_new.php?fid-*-page-*.html
// @match     https://www.summer-plus.net/thread_new.php?fid-*-page-*.html
// @match     http://north-plus.net/thread_new.php?fid=*
// @match     http://bbs.north-plus.net/thread_new.php?fid=*
// @match     http://www.north-plus.net/thread_new.php?fid=*
// @match     http://bbs.imoutolove.me/thread_new.php?fid=*
// @match     http://bbs.soulxplus.net/thread_new.php?fid=*
// @match     http://106.185.27.223/thread_new.php?fid=*
// @match     https://bbs.white-plus.net/thread_new.php?fid=*
// @match     https://www.south-plus.net/thread_new.php?fid=*
// @match     https://www.summer-plus.net/thread_new.php?fid=*
// @match     http://north-plus.net/thread_new.php?fid-*
// @match     http://bbs.north-plus.net/thread_new.php?fid-*
// @match     http://www.north-plus.net/thread_new.php?fid-*
// @match     http://bbs.imoutolove.me/thread_new.php?fid-*
// @match     http://bbs.soulxplus.net/thread_new.php?fid-*
// @match     http://106.185.27.223/thread_new.php?fid-*
// @match     https://bbs.white-plus.net/thread_new.php?fid-*
// @match     https://www.south-plus.net/thread_new.php?fid-*
// @match     https://www.summer-plus.net/thread_new.php?fid-*

// @version     0.2

// @downloadURL https://update.greasyfork.org/scripts/29505/SoulPlus%7Csoulplus%7CNorth-Plus%7Cnorth-plus%7C%E9%AD%82%2B%7C%E5%8C%97%2B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%9B%BE%E5%A2%99%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/29505/SoulPlus%7Csoulplus%7CNorth-Plus%7Cnorth-plus%7C%E9%AD%82%2B%7C%E5%8C%97%2B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%9B%BE%E5%A2%99%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

var Pages = document.querySelector(".pagesone").innerText.match('([0-9].?)\/([0-9].?)');
var allPages = parseInt(Pages[2]);
var nowPageNum = parseInt(Pages[1]);
var closeAjax = false;

/* 创建动画样式表开始 */
var fadeOut = document.createElement('style'),// 创建内部样式对象
    head = document.head || document.getElementsByTagName('head')[0],// 获取head标签对象
    cssText = '@keyframes fadeout{from{opacity:100%;}to{opacity:0;display:none;}}',// 淡出动画样式表内容
    newCss = document.createTextNode(cssText);// 创建样式表节点对象

fadeOut.appendChild(newCss);// 把创建的newCss插入到fadeOut中
head.appendChild(fadeOut); // 把创建的style元素插入到head中
/* 创建动画样式表结束 */

// 没有更多数据的提示函数
function noMoreData() {
  var noMoreData = document.createElement('div');
  noMoreData.setAttribute('style','position:fixed;z-index:99999;width:100%;top:0;left:0;color:#F0E443;text-align:center;font-size:18px;background-color:#E83049;line-height:18px;padding:10px 0;animation:fadeout 5s 1;animation-fill-mode:forwards;');
  noMoreData.innerText = '没有更多数据了';
  var isTips = document.body.lastChild;
  if (isTips.innerText != '没有更多数据了') {
    document.body.appendChild(noMoreData);
  } else {
    document.body.removeChild(isTips);
    document.body.appendChild(noMoreData);
  }
}

// 获取下一页数据的 URL 函数
function getNextPage() {
  var nowPageUrl = window.location.href;
  var nowPageUrlLeft = nowPageUrl.match('http.*fid');
  var new_fid = '';
  var fid = nowPageUrl.match('fid(.*)')[1];
  var fid_arr = fid.split("");
  for (var i = 1; i < fid_arr.length; i++) {
    if (!isNaN(fid_arr[i])) {
      new_fid += fid_arr[i];
    } else {
      break;
    }
  }
  if (nowPageNum < allPages) {
    nowPageNum++;
    var nowPageUrlRight = '-'+new_fid+'-page-'+nowPageNum+'.html';
    return nowPageUrlLeft+nowPageUrlRight;
  } else {
    return false;
  }
}

// loading提示模块函数
function loadingBox(operation) {
  var dataBox = document.querySelector(".stream");

  if (operation == 'insert') {
    var loadDataBox = document.createElement('li');
    loadDataBox.setAttribute('class','dcsns-li dcsns-rss dcsns-feed-0 loading-data');
    var loadDataBoxDivIn = document.createElement('div');
    loadDataBoxDivIn.setAttribute('class','inner');
    var loadDataBoxDivInIn = document.createElement('div');
    loadDataBoxDivInIn.setAttribute('style','text-align: center;height: 334px;');
    var loadDataBoxPIn = document.createElement('p');
    loadDataBoxPIn.setAttribute('style','font-size: 30px;line-height: 30px;color: #521eaa;padding: 145px 0;');
    loadDataBoxPIn.innerText = '数据获取中,请稍后。。。';

    loadDataBoxDivInIn.appendChild(loadDataBoxPIn);
    loadDataBoxDivIn.appendChild(loadDataBoxDivInIn);
    loadDataBox.appendChild(loadDataBoxDivIn);

    dataBox.appendChild(loadDataBox);
  } else if (operation == 'remove') {
    var loadDataBox = document.querySelector('.loading-data');
    if (loadDataBox) {
      dataBox.removeChild(loadDataBox);
    }
  }
}

// 创建失效图片替换提示图
function createTipsPic() {
  // 初始化尺寸
  var cvw = 183;
  var cvh = 260;
  // 创建画布,设置画布尺寸
  var canvas = document.createElement('canvas');
  canvas.width = cvw.toString();
  canvas.height = cvh.toString();
  // 创建2D绘图API环境
  var cav = canvas.getContext("2d");
  // 填充背景
  cav.fillStyle="#fff";
  cav.fillRect(0,0,cvw,cvh);
  // 开始绘制线条
  cav.beginPath();
  cav.strokeStyle = 'red';
  cav.lineWidth = 5;
  // 设置绘制边框路径
  cav.moveTo(0, 0);
  cav.lineTo(cvw, 0);
  cav.lineTo(cvw, cvh);
  cav.lineTo(0, cvh);
  cav.lineTo(0, 0);
  // 设置左斜线路径
  cav.moveTo(0, 0);
  cav.lineTo(cvw, cvh);
  // 设置右斜线路径
  cav.moveTo(cvw, 0);
  cav.lineTo(0, cvh);
  // 绘制线条
  cav.stroke();
  cav.closePath();
  // 返回base64数据
  return canvas.toDataURL();
}

// 移除图片懒加载函数
function rmLazyLoad() {
  var lazyLoadImg = document.querySelectorAll('.lazy');
  [].forEach.call(lazyLoadImg, function(tag) {
    var imgSrc = tag.getAttribute('data-original');
    tag.removeAttribute('class');
    tag.removeAttribute('data-original');
    tag.setAttribute('style', 'display:block;');
    tag.setAttribute('src', createTipsPic());
    tag.setAttribute('src', imgSrc);
    tag.onerror = function () {
      // 替换无法加载的图片
      this.setAttribute('src',createTipsPic());
    };
  });
}

// 更新页面内容函数
function changeContent(data,pages) {
  // 替换分页
  var oldPages = document.querySelectorAll('.pages');
  oldPages[0].innerHTML = pages;
  oldPages[1].innerHTML = pages;
  // 移除提示模块
  loadingBox('remove');
  // 插入新数据
  var dataBox = document.querySelector(".stream");
  dataBox.innerHTML += data;
  closeAjax = false;//解除禁止下拉获取下页数据动作
  // 关闭图片懒加载
  rmLazyLoad();
}

// 获取下一页数据函数
function getNextPageData() {
  closeAjax = true;//禁止下拉获取下页数据动作
  loadingBox('insert');
  var nextPageUrl = getNextPage();
  if (closeAjax) {
    if (nextPageUrl) {
      fetch(nextPageUrl).then(response=>response.text()).then(newPageData=>{
        var dataPreg = '<ul class="stream">(.*)<\/ul>.*<div class="clear"';
        var pagesPreg = '<div id="menu_cate".*<div class="pages">(.*<\/ul>)<\/div>.*<div id="menu_post"';
        var data = newPageData.match(dataPreg)[1];
        var pages = newPageData.match(pagesPreg)[1];
        changeContent(data,pages);
      })
    } else {
      // 没有更多数据，直接移除提示模块
      loadingBox('remove');
      // 提示没有更多数据
      noMoreData();
      //解除禁止下拉获取下页数据动作
      closeAjax = false;
    }
  }
}

// 关闭图片懒加载
rmLazyLoad();

// 页面滚动到底部触发异步获取函数
window.addEventListener("scroll",
function(event) {
  var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

  if (document.documentElement.scrollHeight == document.documentElement.clientHeight + scrollTop) {
    var loadData = document.querySelector(".loading-data");
    if (!closeAjax) {
      if (!loadData) {
        getNextPageData();
      }
    }
  }
});
