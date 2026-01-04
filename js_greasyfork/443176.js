// ==UserScript==
// @name        梦蓝增强
// @version     1.0
// @match       https://mlsub.net/*.html
// @description 增加了快捷操作和播放历史记录
// @license     MIT
// @namespace https://greasyfork.org/users/900364
// @downloadURL https://update.greasyfork.org/scripts/443176/%E6%A2%A6%E8%93%9D%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443176/%E6%A2%A6%E8%93%9D%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
  const 已观看的剧集_键名 = "UserScript__watched" + location.pathname, 播放进度_键名 = "UserScript__last-watch" + location.pathname;
  const 已观看的剧集按钮_样式class = "btn-outline-watched", 上次观看的剧集按钮_样式class = "btn-outline-lastwatch";
  const 已观看的剧集按钮_样式颜色 = "7E9E46", 上次观看的剧集按钮_样式颜色 = "FA5C7C";
  const 下一集图标str = '<svg t="1628685511410" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1204" width="16" height="16"><path d="M515.725955 0c14.640477 0 28.666668 6.347619 39.007144 17.609525l391.300018 426.928591c32.864287 35.833335 35.32143 92.245242 7.166667 131.150006l-7.57619 9.316667-391.095257 421.502401a52.009526 52.009526 0 0 1-77.809527-0.307143 62.247622 62.247622 0 0 1-15.971429-41.976193V666.090507L145.004509 1006.50719a52.009526 52.009526 0 0 1-77.809528-0.307143 62.247622 62.247622 0 0 1-15.971429-41.976193V59.585717C51.223552 26.72143 75.794982 0 106.202126 0c14.640477 0 28.666668 6.347619 39.007145 17.609525L460.747381 361.916683V59.585717C460.747381 26.72143 485.31881 0 515.725955 0z" p-id="1205" fill="#e6e6e6"></path></svg>';
  function getWatchList() {
    const watched_storage = localStorage.getItem(已观看的剧集_键名), last_storage = localStorage.getItem(播放进度_键名);
    return {
      watched: watched_storage ? JSON.parse(watched_storage) : [],
      last: last_storage ? Object.assign({ is_void: false }, JSON.parse(last_storage)) : { is_void: true }
    };
  }
  function addWatched(href) {
    const watched = getWatchList().watched;
    if (watched.indexOf(href) >= 0)
      return;
    else {
      watched.push(href);
      localStorage.setItem(已观看的剧集_键名, JSON.stringify(watched));
    }
  }
  function changeLastWatch(path, time = 0) {
    localStorage.setItem(播放进度_键名, JSON.stringify({ path, time }));
  }
  function goNext(href) {
    addWatched(href);
    changeLastWatch(href);
    window.location.href = href;
  }
  const title = document.getElementsByClassName("col-md-8")[0]
    .getElementsByClassName("card-body")[0]
    .getElementsByClassName("mt-0")[0];
  const _last = getWatchList().last;
  if (!_last.is_void)
    title.innerHTML = "<a href=\"" + _last.path + "\">（恢复播放）" + title.innerHTML + "</a>";
  else
    title.innerHTML = "（无播放进度）" + title.innerHTML;
  const btn_style_dom = document.createElement("style");
  btn_style_dom.innerHTML = `
.${已观看的剧集按钮_样式class}:hover {
	color: #fff;
	background-color: #${已观看的剧集按钮_样式颜色};
	border-color: #${已观看的剧集按钮_样式颜色};
}
.${已观看的剧集按钮_样式class} {
	color: #${已观看的剧集按钮_样式颜色};
	border-color: #${已观看的剧集按钮_样式颜色};
}
.${上次观看的剧集按钮_样式class}:hover {
	color: #fff;
	background-color: #${上次观看的剧集按钮_样式颜色};
	border-color: #${上次观看的剧集按钮_样式颜色};
}
.${上次观看的剧集按钮_样式class} {
	color: #${上次观看的剧集按钮_样式颜色};
	border-color: #${上次观看的剧集按钮_样式颜色};
}
`;
  document.body.append(btn_style_dom);
  function changeClass(dom, new_class, title) {
    const old_class = dom.getAttribute("class");
    dom.setAttribute("class", old_class ?
      old_class.replace("btn-outline-primary", new_class)
      : new_class);
    dom.setAttribute("title", title);
  }
  const btns = Array.from(document.getElementsByClassName("btn-space"));
  btns.forEach(btn => {
    btn.onclick = () => {
      const href = btn.getAttribute("href");
      if (!href)
        return console.warn("cannot find btn's href!", btn);
      addWatched(href);
      changeLastWatch(href);
    };
  });
  const doms = Array.from(document.getElementsByClassName("btn-outline-primary"));
  doms.forEach(dom => {
    const href = dom.getAttribute("href");
    if (!href)
      return console.warn("cannot find btn's href!", dom);
    const { last, watched } = getWatchList();
    if (!last.is_void && last.path === href)
      changeClass(dom, 上次观看的剧集按钮_样式class, "上次观看");
    else {
      if (watched.indexOf(href) >= 0)
        changeClass(dom, 已观看的剧集按钮_样式class, "已观看过");
    }
  });
  Array.from(document.getElementsByTagName("span"))
    .find(d => d.innerHTML === "剧集")
    .innerHTML = "剧集 - 按钮颜色说明 绿：已观看过、 粉：上次观看、 蓝：未观看";
  const controls = document.getElementsByClassName("plyr__controls");
  if (controls.length > 0) {
    const video = document.getElementsByTagName("video")[0];
    const _last = getWatchList().last;
    if (!_last.is_void) {
      const { path, time } = _last;
      if (path === location.href) {
        video.currentTime = time;
        video.autoplay = true;
      }
    }
    const btn_list = document.getElementsByClassName("card-body button-list")[0];
    const now_btn_index = Array.from(btn_list.children)
      .indexOf(btn_list.getElementsByClassName("btn-primary")[0]);
    setInterval(function () {
      const last = getWatchList().last;
      if (!last.is_void && last.path !== location.href)
        return;
      else
        changeLastWatch(location.href, video.currentTime);
    }, 5555);
    if (now_btn_index < 0 || now_btn_index === btn_list.children.length - 1)
      return;
    const next_btn = btn_list.children[now_btn_index + 1];
    const next_icon = document.createElement("button");
    next_icon.setAttribute("class", "plyr__controls__item plyr__control");
    next_icon.setAttribute("type", "button");
    next_icon.innerHTML = 下一集图标str;
    next_icon.onclick = () => goNext(next_btn.href);
    var bar = controls[0];
    bar.insertBefore(next_icon, bar.children[1]);
    setInterval(function () {
      if (video.ended)
        goNext(next_btn.href);
    }, 1111);
  }
})();