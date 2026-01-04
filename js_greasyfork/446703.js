// ==UserScript==
// @name         对于单条微博，隐藏导航栏、隐藏评论、以原图大小展开所有图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在旧版微博中，对于单条微博，隐藏导航栏、隐藏评论、以原图大小展开所有图片。在药方脚本的勾选隐藏全部模块和阅读模式下效果更佳。
// @author       vv
// @match        *://*.weibo.com/*
// @match        *://t.cn/*
// @include      *://weibo.com/*
// @include      *://*.weibo.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/446703/%E5%AF%B9%E4%BA%8E%E5%8D%95%E6%9D%A1%E5%BE%AE%E5%8D%9A%EF%BC%8C%E9%9A%90%E8%97%8F%E5%AF%BC%E8%88%AA%E6%A0%8F%E3%80%81%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA%E3%80%81%E4%BB%A5%E5%8E%9F%E5%9B%BE%E5%A4%A7%E5%B0%8F%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/446703/%E5%AF%B9%E4%BA%8E%E5%8D%95%E6%9D%A1%E5%BE%AE%E5%8D%9A%EF%BC%8C%E9%9A%90%E8%97%8F%E5%AF%BC%E8%88%AA%E6%A0%8F%E3%80%81%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA%E3%80%81%E4%BB%A5%E5%8E%9F%E5%9B%BE%E5%A4%A7%E5%B0%8F%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

/*
描述
 - 适用于旧版微博，在药方脚本的勾选隐藏全部模块和阅读模式下效果更佳。
 - 适用于单条微博，在全部微博的页面运行测试，发现脚本会出错结束运行，就不另外加判断了。
 - 隐藏导航栏、隐藏评论、以原图大小展开所有图片这三个功能被分开在三个函数中，在「脚本实际运行部分」注释掉相应函数调用即可关闭该功能。
 
参考：
 - [药方脚本](https://tiansh.github.io/yawf/)
 - [微博图片全显示脚本](https://greasyfork.org/zh-TW/scripts/10870-%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA)

 使用场景：
- Windows10+Chrome，在药方脚本的勾选隐藏全部和阅读模式下，通过Zotero-Connector插件将干净的网页存储到Zotero中。
- Zotero-Connector插件保存网页快照时，会重新向服务器发起请求获取图片，在微博上存在跨域问题，导致获取图片失败。可通过安装Chrome插件Allow CORS: Access-Control-Allow-Origin、允许所有Chrome网页跨域来解决。

bug：
- 有时候，从微博列表等第一次进入微博详情页时脚本获取元素失败，再次刷新页面后成功。也可以认为是特色，确定要收集时需手动刷新一下（雾）。
*/

/*============ 脚本实际运行部分 开始===============*/
window.onload = function() {
  console.log('------running hide starting------');

  // 隐藏导航栏
  hideNav();

  // 隐藏评论
  // 这个函数调用注释掉以后，可以显示评论，展开的图片在微博正文和评论之间。
  hideComments();

  console.log('------running hide ends------');
  

  // 展开显示所有图片
  expandImgs();
}
/*============ 脚本实际运行部分 结束===============*/

/*============ 功能函数部分 开始 ===============*/
/* 隐藏导航栏 */
function hideNav() {
  let nav_bar = document.querySelector("#pl_common_top");
  nav_bar.style.display = 'none';
}

/* 隐藏评论 */
function hideComments() {
  let comment_bg = document.querySelector("div.WB_feed_handle[node-type='feed_list_options']");
  let comment_body = document.querySelector("div.WB_feed_repeat.S_bg1.WB_feed_repeat_v3[node-type='comment_detail']");
  comment_bg.style.display = 'none';
  comment_body.style.display = 'none';
}


/*
微博小图和原图的区别只在中间的url是large
小图：
https://wx4.sinaimg.cn/mw690/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg
原图：
https://wx4.sinaimg.cn/large/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg
*/

/* 展开显示所有图片 */
function expandImgs() {
  console.log('------running expandImgs starting------');

  /* 
  原本图片所在的Element
  class为WB_expand_media_box的div有两个，node-type='feed_list_media_disp'的只有一个
  */
  let origin_imgs = document.querySelector("div.WB_expand_media_box[node-type='feed_list_media_disp']");
  if (origin_imgs === null) {
    return;
  }
  // let parent = document.querySelector('#plc_main').parentNode.parentNode;
  let parent = origin_imgs.parentNode;
  
  let imgs_div = getNewImgsDiv(parent.offsetWidth);
  
  parent.appendChild(imgs_div);
  
  /* 删去原来的图片样式 */
  if (!!origin_imgs) origin_imgs.parentNode.removeChild(origin_imgs);

  // 微博主体下面有个东西，隐藏掉
  wb_b = document.querySelector("div.WB_frame_b");
  wb_b.style.display = 'none';

  console.log('------running expandImgs ends------');
}

// 返回新建的装着所有图片的div，id为expaned_imgs
function getNewImgsDiv(img_width) {
  // 原本是判断图片的个数来渲染图片视图，这里用来获取该条微博的所有图片
  let media_prev = document.querySelector("div.WB_media_wrap.clearfix[node-type='feed_list_media_prev']");
  // 里面是形似 `<img src="//wx4.sinaimg.cn/thumb150/6ea15bbfly1gs9sa2uwwhj20u015y4qs.jpg">`的标签列表
  let imgs_tabs = media_prev.getElementsByTagName('img');

  let imgs_div = document.createElement('div');
  // 设置div的id
  imgs_div.id = 'expaned_imgs'
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
/*
let imgs_div = document.querySelector("#expaned_imgs");
let imgs_tabs = imgs_div.getElementsByTagName('img');
*/