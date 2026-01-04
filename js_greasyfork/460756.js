// ==UserScript==
// @name                  一键生成uBlock本地黑名单屏蔽代码
// @namespace             https://axutongxue.com/
// @version               2.0
// @author                阿虚同学
// @description           复制用户主页链接后通过左下角「拉黑」按钮或者按下Ctrl+F1即可一键转换为uBlock等扩展可用的屏蔽代码
// @license               MIT
// @match                 *://*.weibo.com/*
// @match                 *://tieba.baidu.com/*
// @match                 *://*.bilibili.com/*
// @match                 *://*.zhihu.com/*
// @match                 *://*.douban.com/*
// @match                 *://*.pixiv.net/*
// @grant                 GM_setClipboard
// @run-at                document-end
// @downloadURL https://update.greasyfork.org/scripts/460756/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90uBlock%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/460756/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90uBlock%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
  if (window.location.hostname === "www.zhihu.com") {
    // 在所有class为"AuthorInfo"的div后面创建按钮
    var authorInfoDivs = document.querySelectorAll('.AuthorInfo-content');
    authorInfoDivs.forEach(function(authorInfoDiv) {
      var button = document.createElement('button');
      button.innerHTML = 'ublock拉黑';

      // 添加按钮样式属性
      button.style.outline = 'none';
      button.style.position = 'relative';
      button.style.display = 'inline-block';
      button.style.fontWeight = '400';
      button.style.whiteSpace = 'nowrap';
      button.style.textAlign = 'center';
      button.style.border = '1px solid transparent';
      button.style.cursor = 'pointer';
      button.style.transition = 'all .3s';
      button.style.userSelect = 'none';
      button.style.touchAction = 'manipulation';
      button.style.lineHeight = '1.5';
      button.style.fontSize = '12px';
      button.style.height = '24px';
      button.style.padding = '2px 6px';
      button.style.borderRadius = '6px';
      button.style.backgroundColor = '#ffffff';
      button.style.borderColor = '#d9d9d9';
      button.style.color = 'rgba(0,0,0,0.88)';
      button.style.boxShadow = '0 2px 0 rgba(0,0,0,0.02)';

      authorInfoDiv.insertAdjacentElement('afterend', button);

      button.onclick = function() {
        navigator.clipboard.readText().then(function(text) {
          let zhihu = text.match(/(?<=https:\/\/www\.zhihu\.com\/(people|org)\/).*/);
          if (zhihu) {
            GM_setClipboard("##.AnswerItem:has(a.UserLink-link[href*=\"" + zhihu[0] + "\"])");
          }

          // 显示弹窗
          var toast = document.createElement('div');
          toast.innerHTML = '屏蔽代码转换成功，请自行右键打开ublock粘贴';
          toast.style.position = 'fixed';
          toast.style.left = '50%';
          toast.style.bottom = '50%';
          toast.style.transform = 'translateX(-50%)';
          toast.style.padding = '10px 20px';
          toast.style.backgroundColor = '#333333';
          toast.style.color = '#ffffff';
          toast.style.borderRadius = '4px';
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s';
          document.body.appendChild(toast);

          // 延迟一定时间后显示和隐藏弹窗
          setTimeout(function() {
            toast.style.opacity = '1';
          }, 1000);
          setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() {
              toast.remove();
            }, 500);
          }, 2000);
        });
      }
    });
  }
})();

var currentDomain = window.location.hostname;
if (["www.douban.com", "www.bilibili.com", "www.weibo.com", "tieba.baidu.com", "www.pixiv.net"].includes(currentDomain)) {
  let btn = document.createElement("button");
  btn.innerHTML = "拉黑";
  btn.setAttribute("style", "position:fixed;bottom: 5rem;left:2rem;z-index:999;");
  btn.onclick = function() {
    navigator.clipboard.readText().then(function(text) {
      let weibo = text.match(/(?<=https:\/\/weibo\.com).*/);
      let bilibili = text.match(/(?<=https:\/\/space\.bilibili\.com\/).*/);
      let tieba = text.match(/(?<=https:\/\/tieba\.baidu\.com\/home\/main\?id=).*?(?=\?t|&fr=pb)/);
      let zhihu = text.match(/(?<=https:\/\/www\.zhihu\.com\/people\/).*/);
      let douban = text.match(/(?<=https:\/\/www\.douban\.com\/people\/).*?(?=\/)/);
      let pixiv = text.match(/(?<=https:\/\/www\.pixiv\.net\/users\/)\d+/);

      if (weibo) {
        GM_setClipboard("##.item1:has(a[href=\"" + weibo[0] + "\"])");
      } else if (bilibili) {
        GM_setClipboard("##.reply-item:has(div.user-name[data-user-id=\"" + bilibili[0] + "\"])");
      } else if (tieba) {
        GM_setClipboard("##.l_post:has(a.p_author_name[href*=\"" + tieba[0] + "\"])");
      } else if (zhihu) {
        GM_setClipboard("##.AnswerItem:has(a.UserLink-link[href*=\"" + zhihu[0] + "\"])");
      } else if (douban) {
        GM_setClipboard("##.reply-item:has(div.user-face>a[href*=\"" + douban[0] + "\"])");
      } else if (pixiv) {
        GM_setClipboard("#?#li:has(a[href=\"/users/" + pixiv[0] + "\"])");
      }
      btn.innerHTML = "屏蔽代码转换成功，请自行右键打开ublock粘贴";
      setTimeout(function() {
        btn.innerHTML = "拉黑";
      }, 3000);
    });
  };
  document.body.append(btn);

  document.addEventListener('keydown', async keydown => {
    if (keydown.ctrlKey && keydown.keyCode == 112) {
      let text = await readClipboard();
      let weibo = text.match(/(?<=https:\/\/weibo\.com).*/);
      let bilibili = text.match(/(?<=https:\/\/space\.bilibili\.com\/).*/);
      let tieba = text.match(/(?<=https:\/\/tieba\.baidu\.com\/home\/main\?id=).*?(?=\?t|&fr=pb)/);
      let zhihu = text.match(/(?<=https:\/\/www\.zhihu\.com\/(people|org)\/).*/);
      let douban = text.match(/(?<=https:\/\/www\.douban\.com\/people\/).*?(?=\/)/);
      let pixiv = text.match(/(?<=https:\/\/www\.pixiv\.net\/users\/)\d+/);

      if (weibo) {
        GM_setClipboard("##.item1:has(a[href=\"" + weibo[0] + "\"])");
      } else if (bilibili) {
        GM_setClipboard("##.reply-item:has(div.user-name[data-user-id=\"" + bilibili[0] + "\"])");
      } else if (tieba) {
        GM_setClipboard("##.l_post:has(a.p_author_name[href*=\"" + tieba[0] + "\"])");
      } else if (zhihu) {
        GM_setClipboard("##.AnswerItem:has(a.UserLink-link[href*=\"" + zhihu[0] + "\"])");
      } else if (douban) {
        GM_setClipboard("##.reply-item:has(div.user-face>a[href*=\"" + douban[0] + "\"])");
      } else if (pixiv) {
        GM_setClipboard("#?#li:has(a[href=\"/users/" + pixiv[0] + "\"])");
      }
      btn.innerHTML = "屏蔽代码转换成功，请自行右键打开ublock粘贴";
      setTimeout(function() {
        btn.innerHTML = "拉黑";
      }, 3000);
    }
  });
}

async function readClipboard() {
  if (!window.isSecureContext) {
    alert('不安全页面不允许读取剪贴板！');
    return;
  }
  await navigator.permissions.query({ name: 'clipboard-read' });
  try {
    return await navigator.clipboard.readText();
  } catch (ex) {
    alert('请允许读取剪贴板！');
  }
}
