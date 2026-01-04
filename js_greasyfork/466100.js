// ==UserScript==
// @name         weiback
// @namespace    https://github.com/Shapooo/
// @version      0.9.6
// @author       Shapooo
// @description  微博数据下载备份
// @license      GPL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @homepageURL  https://github.com/Shapooo/WeiBack
// @match        *://*.weibo.com/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466100/weiback.user.js
// @updateURL https://update.greasyfork.org/scripts/466100/weiback.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const domain$2 = window.location.host;
  const STATUSES_LONGTEXT_API = `https://${domain$2}/ajax/statuses/longtext`;
  async function generateHTMLPage(posts, storage) {
    return Promise.all(posts.map((post) => generateHTMLPost(post, storage))).then((posts2) => posts2.join(""));
  }
  function composePost(postMeta, isRetweet = false) {
    let prefix = "bk-post";
    if (isRetweet) {
      prefix = "bk-retweet";
    }
    const postDiv = document.createElement("div");
    postDiv.className = prefix;
    if (postMeta.posterName) {
      const posterDiv = document.createElement("div");
      posterDiv.className = prefix + "er";
      const avatar = document.createElement("img");
      avatar.className = prefix + "er-avatar";
      avatar.alt = "头像";
      avatar.src = postMeta.posterAvatar;
      posterDiv.appendChild(avatar);
      const name = document.createElement("a");
      name.className = prefix + "er-name";
      name.href = postMeta.posterUrl;
      name.innerText = postMeta.posterName;
      posterDiv.appendChild(name);
      const createDetail = document.createElement("p");
      createDetail.className = "bk-create-detail";
      createDetail.innerHTML = `&nbsp&nbsp&nbsp${postMeta.createdAt} ${postMeta.regionName}`;
      posterDiv.appendChild(createDetail);
      postDiv.appendChild(posterDiv);
    }
    const textDiv = document.createElement("div");
    textDiv.className = prefix + "-text bk-content";
    textDiv.innerHTML = postMeta.text;
    postDiv.appendChild(textDiv);
    if (postMeta.medium) {
      const mediaDiv = document.createElement("div");
      mediaDiv.className = prefix + "-media bk-content";
      mediaDiv.innerHTML = postMeta.medium.join("");
      postDiv.appendChild(mediaDiv);
    }
    if (postMeta.postUrl) {
      const postUrl = document.createElement("a");
      postUrl.innerHTML = "[原贴链接]";
      postUrl.href = postMeta.postUrl;
      postUrl.className = "bk-link bk-content";
      postDiv.appendChild(postUrl);
    }
    return postDiv;
  }
  async function generateHTMLPost(post, storage) {
    const wrapper = document.createElement("div");
    wrapper.className = "bk-post-wrapper";
    wrapper.appendChild(composePost(await parsePost(post, storage)));
    if (post.retweeted_status) {
      wrapper.appendChild(composePost(await parsePost(post.retweeted_status, storage), true));
    }
    return wrapper.outerHTML;
  }
  function getMedium(post, storage) {
    const imageDefinition2 = globalThis.imageDefinition;
    if (post.mix_media_info) {
      return post.mix_media_info.items.map((item) => {
        const data = item.data;
        if (item.type === "pic") {
          const pic = document.createElement("img");
          pic.className = "bk-pic";
          pic.alt = "[图片]";
          let picObj;
          if (imageDefinition2 === 3) {
            picObj = item.data.mw2000 || item.data.largest || item.data.original || item.data.large || item.data.bmiddle;
          } else if (imageDefinition2 === 2) {
            picObj = item.data.large || item.data.bmiddle;
          } else {
            picObj = item.data.bmiddle || item.data.thumbnail;
          }
          pic.src = picObj.url;
          return pic.outerHTML;
        } else if (item.type === "video") {
          const video = document.createElement("a");
          video.className = "bk-link";
          video.innerHTML = data.page_title;
          video.href = data.media_info && data.media_info.h5_url;
          const pic = document.createElement("img");
          pic.className = "bk-pic";
          pic.alt = "[视频]";
          pic.src = url2path(data.page_pic, storage);
          video.appendChild(pic);
          return video.outerHTML;
        } else {
          return "";
        }
      });
    } else if (post.pic_ids && post.pic_infos) {
      return post.pic_ids.map((id) => {
        const tmpObj = post.pic_infos[id];
        let picObj;
        if (imageDefinition2 === 3) {
          picObj = tmpObj.mw2000 || tmpObj.largest || tmpObj.original || tmpObj.large || tmpObj.bmiddle;
        } else if (imageDefinition2 === 2) {
          picObj = tmpObj.large || tmpObj.bmiddle;
        } else {
          picObj = tmpObj.bmiddle || tmpObj.thumbnail;
        }
        return url2path(picObj.url, storage);
      }).map((loc) => {
        const pic = document.createElement("img");
        pic.className = "bk-pic";
        pic.alt = "[图片]";
        pic.src = loc;
        return pic.outerHTML;
      });
    } else {
      return [];
    }
  }
  async function parsePost(post, storage) {
    let text = post.isLongText && await fetchLongText(post.mblogid) || post.text_raw;
    text = await transText(text || post.text_raw, post.topic_struct, post.url_struct, storage);
    let posterAvatar;
    if (post.user && post.user.id) {
      let avatarUrl;
      switch (imageDefinition) {
        case 1:
          avatarUrl = post.user.profile_image_url || post.user.avatar_large || post.user.avatar_hd;
          break;
        case 2:
          avatarUrl = post.user.avatar_large || post.user.avatar_hd || post.user.profile_image_url;
          break;
        default:
          avatarUrl = post.user.avatar_hd || post.user.avatar_large || post.user.profile_image_url;
      }
      posterAvatar = avatarUrl && url2path(avatarUrl, storage);
    }
    return {
      posterName: post.user && post.user.screen_name,
      posterUrl: post.user && "https://weibo.com" + post.user.profile_url,
      posterAvatar,
      text,
      postUrl: post.user && post.user.id && `https://weibo.com/${post.user.idstr}/${post.mblogid}`,
      mblogid: post.mblogid,
      createdAt: new Date(post.created_at).toLocaleString("zh-CN"),
      regionName: post.region_name ? post.region_name : "",
      medium: getMedium(post, storage)
    };
  }
  async function fetchLongText(mblogid) {
    const api = `${STATUSES_LONGTEXT_API}?id=${mblogid}`;
    const res = await fetch(api);
    if (res.ok) {
      const jsn = await res.json();
      return jsn.data && jsn.data.longTextContent || "";
    } else {
      return "";
    }
  }
  async function transText(text, topicStruct, urlStruct, storage) {
    const o = {
      url: "(http|https)://[a-zA-Z0-9$%&~_#/.\\-:=,?]{5,280}",
      stock: "\\$([^\\$]+)\\$",
      br: "\\n"
    };
    const atExpr = /@[\u4e00-\u9fa5|\uE7C7-\uE7F3|\w_\-·]+/g;
    const emojiExpr = /(\[.*?\])(?!#)/g;
    const r = new RegExp(Object.values(o).join("|"), "g");
    const emailExpr = /[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}/g;
    const topicExpr = /#([^#]+)#/g;
    const u = [];
    const ret = text && (text = text.replace(emailExpr, function(t) {
      if (t.match(atExpr)) {
        const e = t.match(atExpr);
        u.push(e && e[0]);
      }
      return t;
    }), text = text.replace(r, function(e) {
      if (e) {
        const o2 = e.slice(0, 1);
        return e === "\n" ? transBr() : o2 === "h" || urlStruct ? transUrl(e, urlStruct) : e;
      }
    }), text = text.replace(atExpr, function(e) {
      return u.indexOf(e) !== -1 ? e : transUser(e);
    }), text = text.replace(topicExpr, function(e) {
      const a = e.slice(0, 1);
      return a === "#" && "#&#" && isSuperTopic(e, urlStruct) !== e ? transTopic(e, topicStruct) : e;
    }), console.assert(globalThis.globalConfig.emoticon), text = text.replace(emojiExpr, function(e) {
      return transEmoji(e, storage);
    }), text);
    return ret;
  }
  function isSuperTopic(input, urlStruct) {
    input = input !== void 0 ? input : "";
    urlStruct = urlStruct !== void 0 ? urlStruct : [];
    return input && urlStruct.length && urlStruct.find(function(e) {
      return e.short_url === input;
    });
  }
  function transUrl(input, urlStruct) {
    const urlObj = urlStruct && urlStruct.find(function(e) {
      return e.short_url === input;
    });
    const urlExpr = /(http|https):\/\/([\w.]+\/?)\S*/;
    if (!urlExpr.test(input)) {
      return input;
    }
    const u = /^http:\/\/t\.cn/;
    u.test(input) && (input = input.replace(/http:/, "https:"));
    let urlTitle = "网页链接";
    let url = input;
    if (urlObj && urlObj.url_title) {
      urlTitle = urlObj.url_title;
    }
    if (urlObj && urlObj.long_url) {
      url = urlObj.long_url;
    }
    return `<a class="bk-link" target="_blank" href="${url}"><img class="bk-icon-link" src="https://h5.sinaimg.cn/upload/2015/09/25/3/timeline_card_small_web_default.png"/>${urlTitle}</a>`;
  }
  function transTopic(t, topicStruct) {
    const i = t && t.slice(1, -1);
    const a = topicStruct && topicStruct.find(function(t2) {
      return t2.topic_title === i && t2.is_invalid === 1;
    });
    if (a) {
      return t;
    }
    const o = "https://s.weibo.com/weibo?q=".concat(encodeURIComponent(t));
    const n = "_blank";
    return '<a class ="bk-link" href="'.concat(o, '" target="').concat(n, '">').concat(t, "</a>");
  }
  function transUser(t) {
    const e = t.slice(1);
    return e ? '<a class="bk-user" href=https://weibo.com/n/'.concat(e, ">").concat(t, "</a>") : t;
  }
  function transBr() {
    return "<br />";
  }
  function transEmoji(t, storage) {
    const location = getEmoji(t, storage);
    const o = t.slice(1, -1);
    return location ? '<img class="bk-emoji" alt="['.concat(o, ']" title="[').concat(o, ']" src="').concat(location, '" />') : t;
  }
  function getEmoji(e, storage) {
    const emoticon = globalThis.globalConfig.emoticon;
    if (emoticon === void 0) {
      return "";
    }
    const url = emoticon.get(e);
    if (url) {
      return url2path(url, storage);
    } else {
      return "";
    }
  }
  function getFilename(url) {
    return url.split("/").slice(-1)[0].split("?")[0];
  }
  function url2path(url, storage) {
    const fileName = getFilename(url);
    const filePath = `./${storage.taskName}-${storage.index}_files/` + fileName;
    storage.picUrls.add(url);
    return filePath;
  }
  function LRUCache(capacity) {
    this.capacity = capacity;
    this.next = new Uint16Array(capacity);
    this.prev = new Uint16Array(capacity);
    this.K = new Array(capacity);
    this.V = new Array(capacity);
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.items = /* @__PURE__ */ new Map();
  }
  LRUCache.prototype.splayOnTop = function(pointer) {
    const oldHead = this.head;
    if (this.head === pointer) {
      return this;
    }
    const previous = this.prev[pointer];
    const next = this.next[pointer];
    if (this.tail === pointer) {
      this.tail = previous;
    } else {
      this.prev[next] = previous;
    }
    this.next[previous] = next;
    this.prev[oldHead] = pointer;
    this.head = pointer;
    this.next[pointer] = oldHead;
    return this;
  };
  LRUCache.prototype.set = function(key, value) {
    let pointer = this.items.get(key);
    if (typeof pointer !== "undefined") {
      this.splayOnTop(pointer);
      this.V[pointer] = value;
      return;
    }
    if (this.size < this.capacity) {
      pointer = this.size++;
    } else {
      pointer = this.tail;
      this.tail = this.prev[pointer];
      this.items.delete(this.K[pointer]);
    }
    this.items.set(key, pointer);
    this.K[pointer] = key;
    this.V[pointer] = value;
    this.next[pointer] = this.head;
    this.prev[this.head] = pointer;
    this.head = pointer;
  };
  LRUCache.prototype.get = function(key) {
    const pointer = this.items.get(key);
    if (typeof pointer === "undefined") {
      return;
    }
    this.splayOnTop(pointer);
    return this.V[pointer];
  };
  const domain$1 = window.location.host;
  const HTML_GEN_TEMP = '<html lang="zh-CN"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background-color:#f1f2f5}.bk-post-wrapper{border-radius:4px;background:#fff;width:700px;margin:8px auto;padding:10px 0}.bk-poster{display:flex;align-items:center;vertical-align:middle;height:60px}.bk-poster-avatar,.bk-retweeter-avatar{height:60px;width:60px;border-radius:50%;margin:auto 8px}.bk-retweeter-avatar{height:40px;width:40px}.bk-post-text{background:#fff}.bk-content{margin:8px 24px 8px 76px;font-size:15px;line-height:24px}.bk-retweeter{display:flex;align-items:center;vertical-align:middle;height:40px;margin:8px 24px 8px 76px}.bk-retweet{background:#f9f9f9;padding:2px 0}.bk-pic{max-width:600px;max-height:400px;margin:auto}.bk-poster-name,.bk-retweeter-name{color:#000;font-weight:700;text-decoration:none;font-family:Arial,Helvetica,sans-serif}.bk-poster-name:hover,.bk-retweeter-name:hover{color:#eb7350}.bk-icon-link{height:20px;filter:sepia(100%) saturate(3800%) contrast(75%);vertical-align:middle;margin-bottom:4px}.bk-link,.bk-user{color:#eb7350;text-decoration:none}.bk-link:hover,.bk-user:hover{text-decoration:underline}.bk-emoji{height:20px;vertical-align:middle;margin-bottom:4px}.bk-create-detail{font-size:10px;color:#939393}</style><title>微博备份</title></head><body></body></html>';
  const STATUSES_MY_MICRO_BLOG_API = `https://${domain$1}/ajax/statuses/mymblog`;
  const STATUSES_CONFIG_API = `https://${domain$1}/ajax/statuses/config`;
  const STATUSES_LIKE_LIST_API = `https://${domain$1}/ajax/statuses/likelist`;
  const FAVORITES_ALL_FAV_API = `https://${domain$1}/ajax/favorites/all_fav`;
  async function fetchPostMeta(uid = 0, page = 1, type = "myblog") {
    let api = `${STATUSES_MY_MICRO_BLOG_API}?uid=${uid}&page=${page}&feature=0`;
    if (type === "fav") {
      api = `${FAVORITES_ALL_FAV_API}?uid=${uid}&page=${page}`;
    }
    if (type === "like") {
      api = `${STATUSES_LIKE_LIST_API}?uid=${uid}&page=${page}`;
    }
    console.log(`request ${api}`);
    const req = await fetch(api);
    const data = await req.json();
    return data;
  }
  async function fetchAllPosts(type = "myblog", range, downloadPic, uid) {
    console.log(`fetching ${type} post ${range}`);
    const storage = {
      cache: new LRUCache(200),
      taskName: `WeiBack-${type}-${Date.now()}`,
      picUrls: /* @__PURE__ */ new Set(),
      index: 1
    };
    await fetchEmoticon();
    uid = uid ? uid : globalConfig.uid;
    const downloadPeriod = globalThis.downloadPeriod || 10;
    let allPageData = [];
    let noMore = false;
    let index = 0;
    const zip = new JSZip();
    const name = storage.taskName;
    const resources = /* @__PURE__ */ new Map();
    for (let page = range[0]; page <= range[1]; page++) {
      console.log("scan", "page", page);
      showTip(`正在备份第 ${page} 页<br>因微博速率限制，过程可能较长，先干点别的吧`);
      let data;
      for (let i = 0; i < 10; i++) {
        const pageData = await fetchPostMeta(uid, page, type);
        if (pageData.ok) {
          data = type === "fav" ? pageData.data : pageData.data.list;
          if (data.length === 0) noMore = true;
          break;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 8 * 1e3);
        });
        console.log("retry", i);
        showTip(
          `[重试]备份第 ${index} 页，错误内容： ${JSON.stringify(pageData)}`
        );
      }
      allPageData.push(await generateHTMLPage(data, storage));
      if (downloadPic) {
        for (const url of storage.picUrls) {
          if (resources.get(url)) {
            continue;
          }
          const blob = storage.cache.get(url);
          if (blob) {
            resources.set(url, blob);
          } else {
            const blob2 = await fetchPic(url);
            storage.cache.set(url, blob2);
            resources.set(url, blob2);
          }
        }
      }
      storage.picUrls.clear();
      index++;
      if (index % downloadPeriod === 0 || page === range[1] || noMore) {
        const taskName = `${name}-${storage.index}`;
        storage.index++;
        const doc = new DOMParser().parseFromString(HTML_GEN_TEMP, "text/html");
        doc.body.innerHTML = allPageData.join("");
        allPageData = [];
        zip.file(taskName + ".html", doc.documentElement.outerHTML);
        const resourcesFolder = zip.folder(taskName + "_files");
        resources.forEach((blob, url) => {
          resourcesFolder.file(getFilename(url), blob, { base64: true });
        });
        zip.generateAsync({ type: "blob" }).then(function(content) {
          saveAs(content, taskName + ".zip");
        }).catch((err) => {
          console.error(err);
        });
        zip.remove(taskName);
        resources.clear();
      }
      if (noMore || page === range[1]) break;
      await new Promise((resolve) => {
        setTimeout(resolve, 10 * 1e3);
      });
    }
    showTip("数据拉取完成，等待下载到本地");
    console.log("all done");
    showTip("完成，可以进行其它操作");
  }
  async function fetchPic(url) {
    for (let i = 0; i < 5; ++i) {
      try {
        const res = await fetch(url);
        return await res.blob();
      } catch (err) {
        console.log("fic fetch occurs: ", err);
        await new Promise((resolve) => {
          setTimeout(resolve, i * 300);
        });
      }
    }
    console.log(`pic ${url} download failed`);
  }
  async function fetchEmoticon() {
    const api = STATUSES_CONFIG_API;
    const res = await fetch(api);
    const rawEmoticon = (await res.json()).data.emoticon;
    console.assert(rawEmoticon !== void 0);
    const emoticon = /* @__PURE__ */ new Map();
    for (const lang in rawEmoticon) {
      const emojiSets = rawEmoticon[lang];
      for (const setName in emojiSets) {
        for (const obj of emojiSets[setName]) {
          emoticon.set(obj.phrase, obj.url);
        }
      }
    }
    globalThis.globalConfig.emoticon = emoticon;
  }
  const bkBoxStyle = ".bkBox{position:fixed;border-radius:5px;background:#fff;top:80px;right:20px;z-index:100000;padding:10px 15px;text-align:center;border:1px solid #a7a6a6}.bkBox-title{font-size:20px;color:#ff8200;margin:8px 0;font-weight:400;border:1px solid transparent;border-bottom-color:#a7a6a6}.bkBox-button{border-radius:2.25rem;display:block;background:#ffd3a3;padding:5px 8px;color:#fff;text-align:center;cursor:pointer;margin:16px auto 7px;border:0;font:white}.bkBox-button:hover{background:#ff8200}.box,.nav{width:320px;margin:auto;display:flex}.nav{height:30px;background-color:#fff;border:1px gray}.box{overflow:hidden}.bk-naviItem{color:#000;height:30px;width:80px;margin:auto;border:8px #000;float:left}.bk-naviItem,.bk-naviItem:hover{text-decoration:none}.bk-navi-inner{border-radius:8px;height:30px}.bk-navi-inner:hover{background-color:#f2f0ef}.bk-pageNumIndicator{margin:16px}.bk-settingPage{border-radius:5px;width:320px;height:220px;background-color:#f2f0ef;flex-shrink:0}.bk-input{border-radius:1em;border:2px solid #ffd3a3;height:20px;width:50px;text-align:center}.bk-input:hover{border:2px solid #ff8200}.bk-textinput{width:120px}.bkBox-tip{height:100px;width:320px;display:flex;align-items:center;justify-content:center}";
  const SETTINGS_TEMP = '<div class="bk-pageNumIndicator"></div><div>下载范围：<input type="number" value="1" min="1" max="22" class="bk-input range"> 至 <input type="number" value="22" min="1" max="1" class="bk-input range"> 页</div><div>分段下载：每 <input type="number" value="10" min="1" max="20" class="bk-input period"> 页分段</div><div>图片清晰度：<input type="number" value="3" min="1" max="3" class="bk-input definition">(越大越清晰)</div><div><input type="checkbox" id="download-pic" name="download-pic" checked /><label for="download-pic">同时下载图片</label></div><div><button class="bkBox-button">开始下载</button></div>';
  const OTHERS_SETTINGS_TEMP = '<div>用户id:<input type="text" class="bk-input bk-textinput" required minlength="10" maxlength="10"><div>下载范围：<input type="number" value="1" min="1" max="22" class="bk-input range"> 至 <input type="number" value="22" min="1" max="1" class="bk-input range"> 页</div><div>分段下载：每 <input type="number" value="10" min="1" max="20" class="bk-input period"> 页分段</div><div>图片清晰度：<input type="number" value="3" min="1" max="3" class="bk-input definition">(越大越清晰)</div><div><input type="checkbox" id="download-pic" name="download-pic" checked /><label for="download-pic">同时下载图片</label></div><div><button class="bkBox-button">开始下载</button></div>';
  const TITLE_PIC = '<img src="data:image/png;base64,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">';
  const BKBOX_TEMP = `<div class='bkBox-title'>${TITLE_PIC}</div><nav><div class='navi'></div></nav><section><div class='box'></div></section>`;
  const domain = window.location.host;
  const FAVORITES_TAGS_API = `https://${domain}/ajax/favorites/tags?page=1&is_show_total=1`;
  const PROFILE_INFO_API = `https://${domain}/ajax/profile/info`;
  const globalConfig$1 = {
    uid: $CONFIG.uid
  };
  globalThis.globalConfig = globalConfig$1;
  const backType = (type, name) => {
    return (async () => {
      const amount = await getPageAmount(type);
      console.log(`get amount of ${type} post: ${amount}`);
      return { type, name, pageAmount: amount };
    })();
  };
  const bkBox = document.createElement("div");
  bkBox.className = "bkBox";
  bkBox.innerHTML = BKBOX_TEMP;
  const bkBoxStyleSheet = document.createElement("style");
  bkBoxStyleSheet.innerText = bkBoxStyle;
  bkBox.appendChild(bkBoxStyleSheet);
  const bkBoxTip = document.createElement("div");
  bkBoxTip.className = "bkBox-tip";
  bkBox.appendChild(bkBoxTip);
  globalThis.downloadPeriod = 10;
  globalThis.imageDefinition = 3;
  const bkTypes = [backType("fav", "我的收藏"), backType("myblog", "我的发布"), backType("like", "我的点赞"), backType("others", "他人发布")];
  Promise.all(bkTypes).then((values) => {
    values.map((t) => {
      return {
        type: t.type,
        name: t.name,
        settingsPage: (() => {
          const type = t.type;
          const name = t.name;
          const pageAmount = t.pageAmount;
          const page = document.createElement("div");
          if (type === "others") {
            page.innerHTML = OTHERS_SETTINGS_TEMP;
          } else {
            page.innerHTML = SETTINGS_TEMP;
          }
          if (type !== "like" && type !== "others") {
            const pageNumIndicator = page.getElementsByClassName("bk-pageNumIndicator")[0];
            pageNumIndicator.innerHTML = name + "的总页数约为 " + pageAmount;
            pageNumIndicator.title = "微博每页返回博文数目不定，每页接近二十条博文。如果设置最高页数，则默认下载完全部";
            const pageEndInput = page.querySelectorAll(".range")[1];
            pageEndInput.max = pageAmount;
            pageEndInput.value = pageAmount;
          }
          const btn = page.getElementsByClassName("bkBox-button")[0];
          btn.addEventListener("click", async () => {
            const range = page.querySelectorAll(".range");
            let dlRange = [parseInt(range[0].value), parseInt(range[1].value)];
            dlRange = dlRange === pageAmount ? Infinity : dlRange;
            const period = page.querySelector(".period");
            globalThis.downloadPeriod = parseInt(period.value);
            globalThis.downloadPeriod = globalThis.downloadPeriod > 20 ? 20 : globalThis.downloadPeriod;
            globalThis.downloadPeriod = globalThis.downloadPeriod < 1 ? 1 : globalThis.downloadPeriod;
            globalThis.imageDefinition = parseInt(page.querySelector(".definition").value);
            globalThis.imageDefinition = globalThis.imageDefinition > 3 ? 3 : globalThis.imageDefinition;
            globalThis.imageDefinition = globalThis.imageDefinition < 1 ? 1 : globalThis.imageDefinition;
            const downloadPic = page.querySelector("#download-pic").checked;
            try {
              hideAllButton();
              if (type === "others") {
                const uid = page.querySelector(".bk-textinput").value;
                await fetchAllPosts(type, dlRange, downloadPic, uid);
              } else {
                await fetchAllPosts(type, dlRange, downloadPic);
              }
              showAllButton();
            } catch (err) {
              showTip(`程序崩了，原因: ${err}`);
              console.error(err);
            }
          });
          return page;
        })()
      };
    }).forEach((c) => {
      settleDownBkTypes(c.type, c.name, c.settingsPage);
      console.log(`settled post type ${c.type} to bkBox`);
    });
    document.body.appendChild(bkBox);
  });
  function hideAllButton() {
    const buttons = document.getElementsByClassName("bkBox-button");
    Array.from(buttons).forEach((btn) => {
      btn.style.display = "none";
    });
  }
  function showAllButton() {
    const buttons = document.getElementsByClassName("bkBox-button");
    Array.from(buttons).forEach((btn) => {
      btn.style.display = "block";
    });
  }
  function settleDownBkTypes(type, name, settingsPage) {
    const nav = bkBox.getElementsByClassName("navi")[0];
    const settingBox = bkBox.getElementsByClassName("box")[0];
    const naviButton = document.createElement("a");
    naviButton.innerHTML = '<div class="bk-navi-inner">' + name + "</div>";
    naviButton.className = "bk-naviItem";
    naviButton.href = "#" + type;
    nav.appendChild(naviButton);
    const page = document.createElement("div");
    page.id = type;
    page.className = "bk-settingPage";
    page.appendChild(settingsPage);
    settingBox.appendChild(page);
  }
  async function getPageAmount(type) {
    if (type === "like") {
      return Infinity;
    }
    if (type === "fav") {
      const req2 = await fetch(FAVORITES_TAGS_API);
      const json2 = await req2.json();
      return json2 && json2.ok && Math.ceil(json2.fav_total_num / 20);
    }
    const req = await fetch(`${PROFILE_INFO_API}?uid=${globalConfig$1.uid}`);
    const json = await req.json();
    return json && json.ok && Math.ceil(json.data.user.statuses_count / 20);
  }
  function showTip(msg) {
    bkBoxTip.innerHTML = msg;
  }

})();
