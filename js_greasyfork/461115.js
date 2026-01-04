// ==UserScript==
// @name          GitHub 访问代理助手
// @namespace     lzwme.github.fast
// @author        lzwme
// @homepageURL   https://github.com/lzwme/vm-gh-proxy-cn
// @supportURL    https://github.com/lzwme/vm-gh-proxy-cn/issues
// @license       MIT License
// @description   GitHub 访问加速助手。支持 GitHub 的 clone、release/raw/zip 下载加速
// @include       *://github.com/*
// @include       *://github*
// @include       *://hub.fastgit.xyz/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @icon          https://github.githubassets.com/favicon.ico
// @version       1.0.4
// @downloadURL https://update.greasyfork.org/scripts/461115/GitHub%20%E8%AE%BF%E9%97%AE%E4%BB%A3%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461115/GitHub%20%E8%AE%BF%E9%97%AE%E4%BB%A3%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  const clonePrefix = 'git clone --depth 1 ';
  const Mirrors = {
    ghproxynet: {
      url: 'https://ghproxy.net/github.com',
      name: 'gh-net',
      desc: 'ghproxy.net 代理',
      types: ['clone', 'download', 'raw'],
      format: url => `${Mirrors.ghproxy.url}/${url.replace(/^\//, '')}`,
    },
    ghproxy: {
      url: 'https://mirror.ghproxy.com/github.com',
      name: 'ghproxy',
      desc: 'ghproxy 代理',
      types: ['clone', 'download', 'raw'],
      format: url => `${Mirrors.ghproxy.url}/${url.replace(/^\//, '')}`,
    },
    ghproxy1: {
      url: 'https://gh.api.99988866.xyz/github.com',
      name: 'gh-xyz',
      desc: 'ghproxy 代理（演示站）',
      types: ['clone', 'download', 'raw'],
      format: url => `${Mirrors.ghproxy1.url}/${url.replace(/^\//, '')}`,
    },
    netnr: {
      "url": "https://cors.zme.ink/https://github.com",
      "name": "netnr",
      "desc": "由@netnr提供",
      types: ['mirror', 'raw', 'download'],
    },
    gitclone: {
      "url": "https://gitclone.com/github.com",
      "name": "gitclone加速",
      "desc": "gitclone加速",
      types: ['clone'],
    },
    jsDelivr: {
      "url": "https://cdn.jsdelivr.net/gh",
      "name": "jsDelivr",
      "desc": "项目当前分支总文件大小不可超过 50MB",
      types: ['raw'], // download
    },
    staticaly: {
      "url": "https://cdn.staticaly.com/gh",
      "name": "Statically",
      "desc": "只能浏览图片和源代码文件，文件大小限制为30MB",
      types: ['raw'],
    },
    gitmirror: {
      // url: 'https://gitmirror.com',
      url: 'https://hub.gitmirror.com',
      desc: 'GitMirror 为您提供 Github 静态资源加速服务',
      types: ['download', 'raw'],
    },
    fastgitSsh: {
      "url": "git@ssh.fastgit.org",
      "name": "FastGit",
      "desc": "fastgit ssh",
      types: ['clone'],
    },
    fastgitSsh: {
      "url": "https://raw.fastgit.org",
      "name": "FastGit-raw",
      "desc": "fastgit raw",
      types: ['raw'],
    },
    zhlh6: {
      "url": "git@git.zhlh6.cn",
      "name": "加速你的Github",
      "desc": "利用ucloud提供的GlobalSSH",
      types: ['clone'],
    },
    // fastgitdl: {
    //   url: 'https://download.fastgit.org', // todo: only release files、zip
    //   name: 'fastgit-dl',
    //   desc: 'fastgit download',
    //   types: ['download'],
    // },
    // wuyanzheshui: {
    //   url: 'https://github.wuyanzheshui.workers.dev',
    //   name: 'CF加速 1',
    //   desc: '【CF加速】每日10万次调用上限,由 wuyanzheshui 提供',
    //   types: ['mirror', 'clone', 'download'],
    // },
    // rc1844: {
    //   "url": "https://github.rc1844.workers.dev",
    //   "name": "CF加速 2",
    //   "desc": "【CF加速】每日10万次调用上限,由 @rc1844 提供",
    //   types: ['clone', 'download', 'raw'],
    // },
    // lzwme: {
    //   "url": "https://gh.lzwme.workers.dev",
    //   "name": "CF加速 2",
    //   "desc": "【CF加速】每日10万次调用上限,由 @renxia 提供",
    //   types: ['clone', 'download', 'raw', 'mirror'],
    // },
    // gitclone: {
    //   "url": "https://gitclone.com/github.com",
    //   "name": "GitClone",
    //   "desc": "GitHub clone 缓存加速网站",
    //   types: ['clone'],
    // },
  };
  const OtherUrl = [
    ["https://github.com/lzwme/vm-gh-proxy-cn", "脚本Github仓库地址，点个赞谢谢"],
    ["https://greasyfork.org/zh-CN/scripts/461115", "GreasyFork 地址，请评分收藏"],
    ["https://doc.fastgit.org/", "FastGit，请仔细甄别"],
    ["https://d.serctl.com", "GitHub中转下载"],
    ["https://gitee.com/organizations/mirrors/projects", "Gitee 极速下载"],
  ];
  const MirrorsList = Object.values(Mirrors);

  MirrorsList.forEach(item => {
    if (!item.format) {
      item.format = (href, type) => {
        if (type === 'raw' && ['Statically', 'jsDelivr'].includes(item.name)) {
          return item.url + href.replace(`${repo}/raw/`, `${repo}@`);
        }
        const sep = item.url.includes('@') ? ':' : '/';
        return `${item.url}${sep}${href.replace(/^\//, '')}`;
      };
    }

    if (!item.types) item.types = ['raw'];
    if (!item.name) item.name = item.url.split('.')[1];
    if (!item.desc) item.desc = item.name;
  });

  const CloneSet = MirrorsList.filter(d => d.types.includes('clone'));
  const MirrorSet = MirrorsList.filter(d => d.types.includes('mirror'));
  const DownloadSet = MirrorsList.filter(d => d.types.includes('download'));
  const RawSet = MirrorsList.filter(d => d.types.includes('raw'));
  const isPC = !/Android|iPhone|iPad|iPod|Windows Phone|SymbianOS/i.test(navigator.userAgent);
  const observer = new MutationObserver(() => setTimeout(run, 1500));
  observer.observe(document.querySelector('head'), { attributes: true, childList: true });

  let pathname = '';
  let repo = '';
  function run() {
    if (location.pathname != pathname) {
      pathname = location.pathname;
      repo = location.href.match(/github.com\/([^\/]+\/[^\/]+)\/?/)?.[1];
      addMenus();
      addRawList();
      if (location.pathname.split("/")[3] == "releases") addReleasesList();
      if (isPC) addDownloadZip();
    }
  }
  run();
  initProxyButton();
  initEvents();

  /**
   * 添加Raw列表
   */
  function addRawList() {
    let rawUrl = $("#raw-url");
    if (!rawUrl.length) rawUrl = $(`a[data-testid="raw-button"]:last`);
    const rawHref = rawUrl.attr('href');
    if (!rawHref) return;

    $('.raw-btn-proxy').remove();
    RawSet.forEach((item) => {
      const span = rawUrl.clone().removeAttr('id');

      span.attr({
        href: item.format(rawHref, 'raw'),
        title: item.desc,
        target: "_blank",
      });
      span.text(item.name).addClass('raw-btn-proxy');
      rawUrl.before(span);
    });
  }

  /**
   * Fast Download ZIP
   */
  function addDownloadZip() {
    $("a[data-open-app='link']").each(function () {
      const span = $(`<li class="Box-row p-0"></li>`);
      const href = $(this).attr("href");
      const clone = $(this)
        .clone()
        .removeAttr("data-hydro-click data-hydro-click-hmac data-ga-click")
        .addClass("Box-row Box-row--hover-gray");

      DownloadSet.forEach(item => {
        const span1 = $(clone.html().replace("Download ZIP", `Download ZIP(${item.name})`)).attr({
          href: item.format(href),
          title: item.desc,
        });
        span.append(span1);
      });
      $(this).parent().after(span);
    });
  }
  /**
   * 添加Releases列表
   */
  function addReleasesList(retry = 3) {
    const $alist = $(".Box--condensed").find("[href]");
    if (!$alist.length && retry) return setTimeout(() => addReleasesList(--retry), 1000);
    $alist.each(function() {
      const $el = $(this);
      const href = $el.attr('href');
      $el.parent()
      .after(`<div style="position: absolute; right: 180px; top: 0;">${
        DownloadSet.map((item) => {
          return `<a class="flex-1 btn btn-outline get-repo-btn BtnGroup-item" style="float: none; border-color: var(--color-btn-outline-text)"
            href="${item.format(href)}" title="${item.desc}">${item.name}</a>`;
        }).join('')
      }</div>`);
      $el.parent().parent().css({ position: 'relative' });
    });
  }
  /**
   * 添加菜单列表
   */
  function addMenus() {
    if (!repo) return;
    const repoGit = `${repo}.git`;
    const info = `<details class="details-reset details-overlay mr-0 mb-0" id="mirror-menu">
      <summary class="btn  ml-2 btn-primary" data-hotkey="m" title="打开列表" aria-haspopup="menu" role="button">
        <span class="css-truncate-target" data-menu-button="">克隆与镜像</span>
        <span class="dropdown-caret"></span>
      </summary>

      <details-menu class="SelectMenu SelectMenu--hasFilter" role="menu">
        <div class="SelectMenu-modal" style="width: 400px;">
          <header class="SelectMenu-header">
            <span class="SelectMenu-title">镜像站点与快速克隆</span>
            <button class="SelectMenu-closeButton" type="button" data-toggle-for="mirror-menu"><svg aria-label="Close menu"
                class="octicon octicon-x" width="16" height="16" role="img">
                <path fill-rule="evenodd"
                  d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z">
                </path>
              </svg></button>
          </header>

          <tab-container class="d-flex flex-column js-branches-tags-tabs" style="min-height: 0;">
            <div class="SelectMenu-tabs" role="tablist">
              <button class="SelectMenu-tab" type="button" role="tab"
                aria-selected="true" tabindex="0">主要</button>
              <button class="SelectMenu-tab" type="button" role="tab"
                aria-selected="false" tabindex="-1">其他</button>
            </div>

            <div role="tabpanel" class="flex-column flex-auto overflow-auto" tabindex="0">
              <div class="SelectMenu-list" data-filter-list="">
                <div class="btn-block" style="padding: 4px;background-color: #ffffdd;color: #996600;" role="alert">clone、depth命令的插入可手动编辑代码关闭</div>
                <div class="btn-block flash-error" style="padding: 4px;color: #990000;" role="alert">请不要在镜像网站登录账号,若因此造成任何损失本人概不负责</div> ${
                    CloneSet.map((item) => cloneHtml(`${clonePrefix}${item.format(repoGit, 'clone')}`, item.name)).join('')
                  }${
                    cloneHtml("git remote set-url origin https://github.com/" + repoGit, "还原GitHub仓库地址")
                  } ${
                    addBrowseList()
                  }</div>
              </div>
              <div role="tabpanel" class="flex-column flex-auto overflow-auto" tabindex="0" hidden="">
                <div class="SelectMenu-list">${
                  OtherUrl.map((d) => listHtml(d[0], d[1])).join('')
                }</div>
              </div>
            </tab-container>
          </div>
        </details-menu>
    </details>`;

    $('#mirror-menu').remove(); // remove old
    $(".pagehead-actions").before(info);

    function cloneHtml(Url, Tip) {
      return `<div class="input-group notranslate" title="${Tip}">
        <input type="text" class="form-control input-monospace input-sm" value="${Url}" readonly=""
          data-autoselect="">
        <div class="input-group-button">
          <clipboard-copy value="${Url}" class="btn btn-sm"><svg class="octicon octicon-clippy"
              viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z">
              </path>
            </svg></clipboard-copy>
        </div>
      </div>`;
    }
  }

  /**
   * 添加镜像浏览列表
   */
  function addBrowseList() {
    const path = window.location.pathname;
    const info = MirrorSet.map(item => listHtml(item.format(path, 'mirror'), `镜像浏览(${item.name})`, item.desc));

    if (location.hostname != "github.com") info.push(listHtml(`https://github.com${path}`, "返回GitHub"));

    return info.join('');
  }

  function initProxyButton() {
    $('#js-repo-pjax-container').off('mouseenter', 'a').on('mouseenter', 'a', function(ev) {
      const $el = $(this);
      if ($el.attr('id') === 'gh-proxy-btn') return;

      const preBtn = $('#gh-proxy-btn');
      const href =$el.attr('href').replace(/^https:\/\/github\.com/, '');
      const proxyHref = `${Mirrors.ghproxy.url}${href}`;
      if (!/\/(blob|release|archive)\//.test(href) || href.startsWith('http') || preBtn.attr('href') === proxyHref) return;

      $('#gh-proxy-btn').remove();
      const $btn = $(`<a class="btn" href="${proxyHref}" target="_blank" title="proxy link" id="gh-proxy-btn">🚀</a>`);

      $el.parent().append($btn).css({ position: 'relative', overflow: 'visible' });
      $btn.css({ position: 'absolute', left: 120, top: 2 });
      $btn.on('mouseleave', () => $btn.remove());
    });
  }

  function initEvents() {
    $(document).on('click', 'a', function(ev) {
      const $el = $(this);
      const href = $el.attr('href');

      if (['cors.zme.ink'].includes(location.host) && href.startsWith('/')) {
        ev.preventDefault();
        const hrefFixed = `${location.origin}/https://github.com${href}`;
        $el.attr('target') === '_blank' ? window.open(hrefFixed) : location.href = hrefFixed;
      }
    });
  }

  function listHtml(url, name, desc = "") {
    return `<a class="SelectMenu-item" href="${url}" target="_blank" title="${desc}" role="menuitemradio" aria-checked="false" rel="nofollow">
      <span class="css-truncate css-truncate-overflow" style="text-align:center;">${name}</span></a>`;
  }
})();
