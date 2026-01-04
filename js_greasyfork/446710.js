// ==UserScript==
// @name         单条微博阅读模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在旧版微博中，对于单条微博，仅显示微博主体、以原图大小展开的所有图片。在药方脚本的勾选隐藏全部下显示效果更佳。对转发类型的微博，显示原微博内容。
// @author       vv
// @match        *://weibo.com/*
// @match        *://t.cn/*
// @include      *://weibo.com/*
// @include      *://t.cn/*
// @exclude      *://weibo.com/a/bind/*
// @exclude      *://account.weibo.com/*
// @exclude      *://kefu.weibo.com/*
// @exclude      *://photo.weibo.com/*
// @exclude      *://security.weibo.com/*
// @exclude      *://verified.weibo.com/*
// @exclude      *://vip.weibo.com/*
// @exclude      *://open.weibo.com/*
// @exclude      *://passport.weibo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446710/%E5%8D%95%E6%9D%A1%E5%BE%AE%E5%8D%9A%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/446710/%E5%8D%95%E6%9D%A1%E5%BE%AE%E5%8D%9A%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

/*
描述
 - 在旧版微博中，对于单条微博，仅显示微博主体、以原图大小展开的所有图片。在药方脚本的勾选隐藏全部下显示效果更佳。
 - 对转发类型的微博，显示原微博内容。
 
参考：
 - [药方脚本](https://tiansh.github.io/yawf/)
 - [微博图片全显示脚本](https://greasyfork.org/zh-TW/scripts/10870-%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA)

 使用场景：
- Windows10+Chrome，在药方脚本的勾选隐藏全部下，通过Zotero-Connector插件将干净的网页存储到Zotero中。
- Zotero-Connector插件保存网页快照时，会重新向服务器发起请求获取图片，在微博上存在跨域问题，导致获取图片失败。可通过安装Chrome插件Allow CORS: Access-Control-Allow-Origin、允许所有Chrome网页跨域来解决。

bug：
- 有时候，从微博列表等第一次进入微博详情页时脚本获取元素失败，再次刷新页面后成功。也可以认为是特色，确定要收集时需手动刷新一下（雾）。
*/

/*============ 脚本实际运行部分 开始===============*/
window.onload = function() {
  console.log('------running script starting------');

  readermode();
  
  console.log('------running script ends------');
}
/*============ 脚本实际运行部分 结束===============*/

/*============ 功能函数部分 开始 ===============*/
function readermode() {
  page_width = 860;

  /* 获取微博主体 */
  let wb = getWB(page_width + 'px');

  /* 获取以原图大小展开的所有图片 */
  // let imgs_div = document.querySelector("#expaned_imgs_div");
  let imgs_div = getNewImgsDiv(page_width);

  /* 重新建构页面 */
  let page = document.createElement('body');

  page.appendChild(wb);
  page.appendChild(document.createElement('br'));
  page.appendChild(imgs_div);

  document.body = page;
}

function getWB(page_width) {
  let wb = document.createElement('div');
  wb.id = 'wb_detail';
  wb.style.width = page_width;
  wb.style.margin = 'auto';

  // 整体的微博内容
  let origin_wb = document.querySelector("div.WB_feed_detail.clearfix[node-type='feed_content']");
  

  // 博主头像
  let wb_face = origin_wb.querySelector("div.WB_face.W_fl div.face");
  wb_face.id = 'wb_face';
  wb_face.style.float = 'left';
  wb_face.style.marginRight = '20px';
  
  let wb_info = document.createElement('div');
  wb_info.id = 'wb_info';

  let wb_detail = origin_wb.querySelector("div.WB_detail");
  let wb_author = wb_detail.querySelector("div.WB_info");
  let wb_from = wb_detail.querySelector("div.WB_from.S_txt2");
  
  /* 修改微博时间的展示 今天 13:14 改成 2022-06-19 13:14 */
  let wb_time = wb_from.querySelector("a[node-type='feed_list_item_date']");
  wb_time.innerHTML = wb_time.title;
  
  // 微博正文
  let wb_text = wb_detail.querySelector("div.WB_text.W_f14");
  // 如果是转发
  let wb_forword =document.createElement('div');
  wb_forword.className = 'WB_feed_v3';  // 利用原本样式缩小视频框
  wb_forword.appendChild(wb_detail.querySelector("div.WB_feed_expand"));

  wb_info.appendChild(wb_face);
  wb_info.appendChild(wb_author);
  wb_info.appendChild(wb_from);
  wb.appendChild(wb_info);
  wb.appendChild(document.createElement('br'));
  wb.appendChild(wb_text);
  wb.appendChild(wb_forword);
  return wb;
}

/*
微博小图和原图的区别只在中间的url是large
小图：
https://wx4.sinaimg.cn/mw690/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg
原图：
https://wx4.sinaimg.cn/large/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg
*/

// 返回新建的装着所有图片的div，id为expaned_imgs
function getNewImgsDiv(img_width) {
  let imgs_div = document.createElement('div');
  // 设置div的id
  imgs_div.id = 'expaned_imgs'

  // 原本是判断图片的个数来渲染图片视图，这里用来获取该条微博的所有图片
  let media_prev = document.querySelector("div.WB_media_wrap.clearfix[node-type='feed_list_media_prev']");
  if (media_prev === null) {
    return imgs_div;
  }

  // 里面是形似 `<img src="//wx4.sinaimg.cn/thumb150/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg">`的标签列表
  let imgs_tabs = media_prev.getElementsByTagName('img');

  // 图片居中
  imgs_div.style.textAlign = 'center';
  for (let i = 0; i < imgs_tabs.length; i++) {
    let large_img_src = imgs_tabs[i].src;
    if (/sinaimg.c(om|n)\/(orj|thumb)\d{3}/.test(large_img_src)) {
      /* 存为 https://wx4.sinaimg.cn/large/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg */
      large_img_src = large_img_src.replace(/(sinaimg\.c(om|n)\/)(orj|thumb)\d{3}/, "$1large");

      let img_tag = document.createElement('img');
      img_tag.src = large_img_src;
      // 设置图片宽度
      img_tag.width = img_width;

      imgs_div.appendChild(img_tag);
      // 一张图片之后换行
      imgs_div.appendChild(document.createElement('br'));
      // 图片之间空一行
      imgs_div.appendChild(document.createElement('br'));
    }
  }
  return imgs_div;
}
/*============ 功能函数部分 结束 ===============*/