// ==UserScript==
// @name         脚本管理器
// @namespace    非主流小明
// @version      0.0.2
// @author       非主流小明
// @description  jsm 通用脚本设置界面
// @license      MIT
// @icon         https://www.tampermonkey.net/favicon.ico
// @defaulticon  https://avatars.githubusercontent.com/u/114138419?s=200&v=4
// @homepage     https://greasyfork.org/zh-CN/users/816325-非主流小明
// @homepageURL  https://github.com/nicepkg/nice-scripts/tree/master/packages/jsm-view
// @website      https://space.bilibili.com/83540912
// @source       https://github.com/nicepkg/nice-scripts/tree/master/packages/jsm-view
// @supportURL   https://github.com/nicepkg/nice-scripts/issues
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/@remix-run/router@1.13.0/dist/router.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react-router/6.20.0/react-router.production.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/6.20.0/react-router-dom.production.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/antd/5.10.2/antd.min.js
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482866/%E8%84%9A%E6%9C%AC%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482866/%E8%84%9A%E6%9C%AC%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function (React, require$$0, antd, reactRouter, reactRouterDom, remixRouter, dayjs) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
  const reactRouter__namespace = /*#__PURE__*/_interopNamespaceDefault(reactRouter);
  const remixRouter__namespace = /*#__PURE__*/_interopNamespaceDefault(remixRouter);

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m = require$$0;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const StoreContext = React.createContext({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    isXxl: false,
    isXxxl: false,
    isMobile: false,
    isDesktop: true,
    refreshKey: "",
    isModalOpen: false,
    closeModal: () => {
    },
    selectedTopNavKey: "/",
    setSelectedTopNavKey: () => {
    },
    siderBarPathStateMap: {},
    getSelectedSiderBarItemKey: () => "",
    setSelectedSiderBarItemKey: () => {
    },
    getOpenSiderBarItemKeys: () => [],
    setOpenSiderBarItemKeys: () => {
    }
  });
  const StoreProvider = (props) => {
    const { children, ...others } = props;
    const [selectedTopNavKey, setSelectedTopNavKey] = React.useState("/");
    const [siderBarPathStateMap, setSiderBarPathStateMap] = React.useState({});
    const updateSiderBarPathState = (siderBarPath, state) => {
      setSiderBarPathStateMap((prev) => ({
        ...prev,
        [siderBarPath]: {
          ...prev[siderBarPath],
          ...state
        }
      }));
    };
    const getSelectedSiderBarItemKey = React.useCallback((siderBarPath) => {
      var _a;
      return ((_a = siderBarPathStateMap[siderBarPath]) == null ? void 0 : _a.selectedSiderBarItemKey) || "";
    }, [siderBarPathStateMap]);
    const setSelectedSiderBarItemKey = React.useCallback((siderBarPath, key) => {
      updateSiderBarPathState(siderBarPath, {
        selectedSiderBarItemKey: key
      });
    }, []);
    const getOpenSiderBarItemKeys = React.useCallback((siderBarPath) => {
      var _a;
      return ((_a = siderBarPathStateMap[siderBarPath]) == null ? void 0 : _a.openSiderBarItemKeys) || [];
    }, [siderBarPathStateMap]);
    const setOpenSiderBarItemKeys = React.useCallback((siderBarPath, keys) => {
      updateSiderBarPathState(siderBarPath, {
        openSiderBarItemKeys: keys
      });
    }, []);
    const context = {
      ...others,
      selectedTopNavKey,
      setSelectedTopNavKey,
      siderBarPathStateMap,
      getSelectedSiderBarItemKey,
      setSelectedSiderBarItemKey,
      getOpenSiderBarItemKeys,
      setOpenSiderBarItemKeys
    };
    return jsxRuntimeExports.jsx(StoreContext.Provider, { value: context, children });
  };
  const useStore = () => {
    const ctx = React.useContext(StoreContext);
    return ctx;
  };
  const useSiderBar = (props) => {
    const { defaultExpandedAll = false, siderBarRoutePath, sideBarConfig } = props;
    const { getOpenSiderBarItemKeys, setOpenSiderBarItemKeys, getSelectedSiderBarItemKey, setSelectedSiderBarItemKey } = useStore();
    const location2 = reactRouter.useLocation();
    const selectedSiderBarItemKey = getSelectedSiderBarItemKey(siderBarRoutePath);
    const openSiderBarItemKeys = getOpenSiderBarItemKeys(siderBarRoutePath);
    React.useEffect(() => {
      const { pathname } = location2;
      sideBarConfig.forEach((siderBarItemConfig) => {
        const { routePath, subSiderBarItems } = siderBarItemConfig;
        if (routePath === pathname) {
          setSelectedSiderBarItemKey(siderBarRoutePath, routePath);
        }
        if (subSiderBarItems) {
          subSiderBarItems.forEach((subSiderBarItemConfig) => {
            if (subSiderBarItemConfig.routePath === pathname) {
              setOpenSiderBarItemKeys(siderBarRoutePath, [
                ...openSiderBarItemKeys,
                siderBarItemConfig.routePath
              ]);
              setSelectedSiderBarItemKey(siderBarRoutePath, subSiderBarItemConfig.routePath);
            }
          });
        }
      });
    }, [location2, sideBarConfig]);
    React.useEffect(() => {
      if (defaultExpandedAll) {
        const openKeys = sideBarConfig.map((siderBarItemConfig) => {
          return siderBarItemConfig.routePath;
        });
        setOpenSiderBarItemKeys(siderBarRoutePath, openKeys);
      }
    }, [defaultExpandedAll, sideBarConfig]);
    const siderMenuProps = {
      mode: "inline",
      selectedKeys: [selectedSiderBarItemKey],
      openKeys: openSiderBarItemKeys,
      items: sideBarConfig.map((siderBarItemConfig) => {
        const { title, routePath, subSiderBarItems } = siderBarItemConfig;
        return {
          key: routePath,
          label: title,
          "data-search-key": title,
          children: subSiderBarItems == null ? void 0 : subSiderBarItems.map((subSiderBarItemConfig) => ({
            key: subSiderBarItemConfig.routePath,
            "data-search-key": subSiderBarItemConfig.title,
            label: jsxRuntimeExports.jsx(reactRouterDom.Link, { style: {
              textDecoration: "none"
            }, to: subSiderBarItemConfig.routePath, children: subSiderBarItemConfig.title })
          }))
        };
      }),
      onOpenChange: (openKeys) => {
        setOpenSiderBarItemKeys(siderBarRoutePath, openKeys);
      }
    };
    return {
      siderMenuProps,
      openSiderBarItemKeys,
      setSelectedSiderBarItemKey,
      selectedSiderBarItemKey,
      setOpenSiderBarItemKeys
    };
  };
  const { Content, Sider } = antd.Layout;
  const SideBarLayout = (props) => {
    const { siderBarMenuProps, children, siderBarTop, contentStyle } = props;
    const { refreshKey } = useStore();
    const { token: { colorBgContainer, colorSplit } } = antd.theme.useToken();
    const [searchTerm, setSearchTerm] = React.useState("");
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
    const filteredMenuItems = React.useMemo(() => {
      var _a;
      if (!searchTerm)
        return siderBarMenuProps.items;
      const siderBarMenuItems = [];
      const isMenuItemMatched = (item) => {
        var _a2;
        return (_a2 = item == null ? void 0 : item["data-search-key"]) == null ? void 0 : _a2.toLowerCase().includes(searchTerm.toLowerCase());
      };
      (_a = siderBarMenuProps.items) == null ? void 0 : _a.forEach((item) => {
        var _a2;
        if (item == null ? void 0 : item.children) {
          const matchedChildren = (_a2 = item.children) == null ? void 0 : _a2.filter((child) => isMenuItemMatched(child));
          if (matchedChildren.length > 0) {
            siderBarMenuItems.push({
              ...item,
              children: matchedChildren
            });
          }
        } else if (isMenuItemMatched(item)) {
          siderBarMenuItems.push(item);
        }
      });
      return siderBarMenuItems;
    }, [searchTerm, siderBarMenuProps.items]);
    const openKeys = React.useMemo(() => {
      if (!searchTerm)
        return siderBarMenuProps.openKeys;
      return filteredMenuItems == null ? void 0 : filteredMenuItems.map((item) => String((item == null ? void 0 : item.key) || ""));
    }, [searchTerm, siderBarMenuProps.openKeys, filteredMenuItems]);
    return jsxRuntimeExports.jsxs(antd.Layout, { style: {
      height: "100%"
    }, children: [jsxRuntimeExports.jsx(Sider, { breakpoint: "lg", collapsedWidth: "0", width: 300, style: {
      background: colorBgContainer,
      height: "100%",
      borderRight: `1px solid ${colorSplit}`
    }, children: jsxRuntimeExports.jsxs("div", { style: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [jsxRuntimeExports.jsxs("div", { style: {
      flexShrink: 0
    }, children: [siderBarTop, jsxRuntimeExports.jsx(antd.Input.Search, { placeholder: "搜索...", onChange: handleSearchChange, style: { padding: "10px" }, size: "large" })] }), jsxRuntimeExports.jsx("div", { style: {
      flex: 1,
      overflowY: "hidden"
    }, children: jsxRuntimeExports.jsx(antd.Menu, { style: { height: "100%", borderRight: 0, overflowY: "auto" }, ...siderBarMenuProps, items: filteredMenuItems, openKeys }, "Menu" + refreshKey) })] }) }, "Sider" + refreshKey), jsxRuntimeExports.jsx(antd.Layout, { style: {
      height: "100%",
      flexShrink: 0
    }, children: jsxRuntimeExports.jsx(Content, { style: {
      padding: 24,
      margin: 0,
      height: "100%",
      overflow: "auto",
      background: colorBgContainer,
      ...contentStyle
    }, children }, "Content" + refreshKey) })] });
  };
  SideBarLayout.displayName = "SideBarLayout";
  const JSM_ID = "script-manage-root";
  const JSM_APP_CONFIG_CHANGE_ARRAY_EVENT_NAME = "jsm-app-config-array-change";
  const JSM_GM_API_NAMESPACE = "__JSM_GM_API__";
  const JSM_APP_CONFIGS = "__JSM_APP_CONFIGS__";
  var RoutePaths;
  (function(RoutePaths2) {
    RoutePaths2["ScriptsSettingsList"] = "/scripts-settings-list";
    RoutePaths2["ScriptsMarket"] = "/scripts-market";
    RoutePaths2["SiteNavigation"] = "/site-navigation";
    RoutePaths2["NotFound"] = "/404";
  })(RoutePaths || (RoutePaths = {}));
  const siteMatcherThemeColorMap = /* @__PURE__ */ new Map([
    [/\.baidu\.com/, "#3385ff"]
    // 百度
  ]);
  const categories$1 = [
    {
      title: "📦 白嫖资源",
      name: "free-resource",
      subCategories: [
        {
          title: "影视资源",
          name: "video-resource"
        },
        {
          title: "视频下载",
          name: "download-video"
        },
        {
          title: "音乐资源",
          name: "music-resource"
        },
        {
          title: "音乐下载",
          name: "download-music"
        },
        {
          title: "书籍资源",
          name: "reading-resource"
        },
        {
          title: "漫画资源",
          name: "comic-resource"
        },
        {
          title: "图库素材",
          name: "image-resource"
        },
        {
          title: "壁纸下载",
          name: "download-wallpaper"
        },
        {
          title: "办公资源",
          name: "office-resource"
        },
        {
          title: "文档下载",
          name: "download-document"
        },
        {
          title: "资源分享",
          name: "share-resource"
        },
        {
          title: "资源搜索",
          name: "search-resource"
        },
        {
          title: "其他资源",
          name: "other-resource"
        }
      ]
    },
    {
      title: "🖥️ 白嫖软件",
      name: "free-software",
      subCategories: [
        {
          title: "windows 软件",
          name: "windows-software"
        },
        {
          title: "mac 软件",
          name: "mac-software"
        },
        {
          title: "安卓软件",
          name: "android-software"
        },
        {
          title: "ios 软件",
          name: "ios-software"
        },
        {
          title: "游戏资源",
          name: "game"
        }
      ]
    },
    {
      title: "🤖 白嫖 ai",
      name: "free-ai",
      subCategories: [
        {
          title: "chatgpt",
          name: "chatgpt"
        },
        {
          title: "聊天 ai",
          name: "chat-ai"
        },
        {
          title: "图像 ai",
          name: "image-ai"
        },
        {
          title: "其他 ai",
          name: "other-ai"
        }
      ]
    }
  ];
  const sites = [
    // 影视资源
    {
      title: "搜片",
      description: "找影片，高清在线、BT磁力下载、网盘以及字幕资源，轻松为你找到",
      link: "https://soupian.pro",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "厂长资源",
      description: "高清晰画质的在线电影网，观看完全免费、无须注册、高速播放、致力为所有影迷们提供最好看的影视大全。",
      link: "https://www.czspp.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "BT世界网",
      description: "最新高清1080P电影BT种子、高清美剧BT种子迅雷下载网站，迅雷下载磁力天堂。",
      link: "https://www.btsj6.com",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "樱花动漫",
      description: "一个拥有上万集高清晰画质的在线动漫，观看完全免费、无须注册、高速播放、更新及时的专业在线动漫网站",
      link: "https://www.yhdmp.cc",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "AcFun弹幕视频网",
      description: "简称“A站”国内首家弹幕视频网站",
      link: "https://www.acfun.cn",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "VIP视频在线解析",
      description: "腾讯、爱奇艺、优酷等平台的VIP视频解析，支持在线看蓝光VIP视频，可配合IDM下载，无敌！！!",
      link: "https://imyshare.com/free-movie",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "影视资源合集",
      description: "全网免费在线影视、影视下载、影视App、电视盒子合集。首页找不到的看这里！",
      link: "https://imyshare.com/article/32",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "全能VIP视频在线解析",
      description: "腾讯、爱奇艺、优酷等平台的VIP视频解析，支持在线看蓝光VIP视频，可配合IDM下载",
      link: "https://www.whg6.com/html/video",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "电影狗",
      description: "电影、电视剧、动漫等聚合搜索",
      link: "http://www.dianyinggou.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "橘子盘搜",
      description: "一个专注于影视网盘资源搜索引擎，可搜索百度网盘、阿里云盘等网盘的影视资源",
      link: "https://www.nmme.xyz",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "MVCAT",
      description: "电影推荐平台，推荐经典、好看的电影，支持播放和下载",
      link: "http://www.mvcat.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "随便看看",
      description: "⎛⎝随便看看⎠⎞ – 高分电影推荐,看图猜电影,GIF动态图分享平台",
      link: "https://www.sbkk.me",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "人人影视整站资源",
      description: "人人影视凉了，但是热心网友在倒闭前，爬取了整站资源，供大家下载！",
      link: "https://v.dsb.ink",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "莫扎兔",
      description: "一个免费看最新最热电影和电视剧等等的新网站，质量还行",
      link: "https://www.mozhatu.com",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "低端影视",
      description: "画质超棒的免费在线看电影、电视剧网站",
      link: "https://ddrk.me",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "BT部落天堂",
      description: "注重体验与质量的影视资源下载网站",
      link: "http://www.btbuluo.net",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "注视",
      description: "一个简洁的在线影视网站，电影电视剧清晰度都很高，播放流畅",
      link: "http://gaze.run",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "94神马电影网",
      description: "在线影视网站（有最新的SH资源），虽然界面看起来老，但是视频质量和播放速度没毛病",
      link: "http://www.9rmb.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "茶杯狐",
      description: "聚合搜索全网最好的影视资源站，支持免费在线看和下载，从此再也不怕找不到资源",
      link: "https://www.cupfox.app",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "悟空视频",
      description: "最新电影、电视剧在线免费看",
      link: "http://wukongshipin.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "動漫花園",
      description: "超高质量的动漫资源下载网站",
      link: "https://www.dmhy.org",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AGE动漫",
      description: "海量高质量动漫在线免费看，并提供下载",
      link: "https://www.agedm.org",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "SeedHub",
      description: "专注分享4K、蓝光、3D、原盘高清视频资源",
      link: "http://seedhub.info",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "豌豆PRO",
      description: "一个影视资源聚合搜索引擎",
      link: "https://wandou.la",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "布谷TV",
      description: "一个专注于4K原盘的影视资源网站，一般是提供的磁力下载链接",
      link: "https://www.bugutv.org/",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "看片狂人",
      description: "在线看热播电影、电视剧等，提供BT和百度网盘下载",
      link: "https://www.kpkuang.org",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "高分影院",
      description: "高分电影，最新电影电视剧在线免费看",
      link: "https://www.gaofen1.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "影视森林",
      description: "一个影视资源导航网站",
      link: "http://549.tv",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "NBA直播",
      description: "一个综合体育视频网站",
      link: "https://live.qq.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "稀饭影视",
      description: "一个提供免费在线观看最新影片的平台",
      link: "https://www.xifanys.com",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "影猫の仓库",
      description: "一个简单高效的影视搜索引擎",
      link: "https://search.ymck.me",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "臭蛋蛋影视",
      description: "最全电影、电视剧、综艺、动漫、纪录片高清网站",
      link: "https://cddys.vip",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "热播之家",
      description: "一个免费在线追剧平台",
      link: "https://rebozj.pro",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "FreeOK",
      description: "一个免费在线观看影片网站",
      link: "https://www.freeok.vip",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "大米星球",
      description: "一个免费提供最新电影电视剧综艺动漫在线观看的影视聚合网站",
      link: "https://dami6.vip",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "番茄影视",
      description: "一个免费追剧网站,无需会员,全部免费",
      link: "https://fqys1.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "A8影视",
      description: "全网最热门的电影、电视剧、韩剧、综艺节目、海外剧、动漫和纪录片免费看,一应俱全",
      link: "https://a8ys.cc",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "皮皮影视",
      description: "一个专业的追剧网站,收录全网各大影视平台一手资源",
      link: "https://www.ppys66.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "毛驴影视",
      description: "一个追剧网站,有着海量的精品影视为您分享",
      link: "https://www.maolvys.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "可乐影视",
      description: "一个最全面最优质的影视导航网站",
      link: "https://klyingshi.net",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "无限影视网",
      description: "全网最全影视库",
      link: "https://www.wxtv.net",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "APP影院",
      description: "一个提供最新最快的影视资讯和在线播放网站",
      link: "https://www.appmovie.cc",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "NO视频",
      description: "一个汇集各类影视资源的网站",
      link: "https://www.novipnoad.net",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "l0l影院",
      description: "一个免费在线视频网站",
      link: "https://www.l0l.tv",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "360影视",
      description: "一个在线观看的影视网站",
      link: "https://www.360kan.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "多剧蓝光影院",
      description: "一个免费在线影院,为广大影迷提供提供无广告无弹窗无删减高最新热播高清电影在线观看",
      link: "https://duoju.vip",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "东京不够热",
      description: "一个影视剧资源网站",
      link: "https://www.tnhzmz.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "音范丝",
      description: "一个专注于高清蓝光和4K资源的电影精选网站",
      link: "https://www.yinfans.me",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "蚂蚁4K",
      description: "一个提供高质量影片下载的网站",
      link: "https://www.mayi4k.com",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "IPTV Link Search",
      description: "一个电视直播源搜索引擎",
      link: "http://tonkiang.us",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "剧圈圈",
      description: "一个多功能的聚合影视播放平台",
      link: "https://www.jqqzx.cc",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "在线之家",
      description: "在线看热播电影、电视剧等",
      link: "https://www.zxzjhd.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "批哩啪哩",
      description: "在线看热播电影、电视剧等",
      link: "http://pilipali.cc",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "音范丝",
      description: "电影爱好者的分享站，人工精选高质量蓝光4K原盘影视资源",
      link: "http://www.yinfans.me",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "哔嘀影视",
      description: "最新电影电视剧，高清免费下载",
      link: "https://www.bdys10.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "电影天堂",
      description: "电影电视剧BT资源下载",
      link: "https://www.dy2018.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "字幕库",
      description: "电影电视剧字幕下载网站",
      link: "http://www.zimuku.la",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "30直播",
      description: "在线免费看体育直播、体育赛事直播、电竞直播等等TV直播",
      link: "http://www.30.tv",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "电视眼",
      description: "网络电视直播网，CCTV、卫视、体育直播等高清电视直播免费在线观看，支持回看",
      link: "http://www.tvyan.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "火星直播",
      description: "免费无广告的电视直播软件",
      link: "https://wuyuqh.lanzoui.com/i9kgOrv38cb",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "简悦电视直播",
      description: "一款Windows版的高清电视直播软件，目前只有微软商店版本的",
      link: "https://www.microsoft.com/store/productId/9P0V9QLRGB18",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "电视直播",
      description: "电视直播网提供网络电视直播，比如CCTV、湖南卫视等，网络电视在线观看！",
      link: "http://iptv.xiner.store",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "国内外直播源",
      description: "数万个国内外无广告频道，包含：国内直播电视频道、影视剧场等等，可配合黑鸟播放器、PotPlayer等免费看",
      link: "https://imyshare.com/static/others/Tvlist-awesome-m3u-m3u8-master.zip",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "高清电视直播",
      description: "高清电视直播免费看，无广告卡顿，支持1080P，回放，节目预告",
      link: "https://www.baiduyun.wiki/tool/tv.html",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "TVB经典电视剧",
      description: "TVB经典电视剧百度网盘资源，所有电视剧均是高清无水印的，建议收藏！",
      link: "https://www.isharepc.com/tvb.html",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "M3U8播放器",
      description: "一个在线M3U8播放器，内置电影、美剧、韩剧、动漫、漫画等M3U8资源",
      link: "https://m3u8play.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "央视影音",
      description: "全平台看所有央视节目",
      link: "https://app.cctv.com",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿里云盘TV",
      description: "一款由第三方开发的电视云盘软件，可以在电视和手机上看阿里云盘中的视频，支持不限速以及倍速播放，外挂字幕等等",
      link: "https://wtjperi2003.gitlab.io/alipan-tv-web",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "美女热舞",
      description: "🈲在线看抖音、快手等多个平台的小姐姐火辣短视频👄",
      link: "https://imyshare.com/hot-girl",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "UrleBird",
      description: "一个在线刷tiktok视频的网站",
      link: "https://urlebird.com/trending",
      categoryNames: ["video-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Browse TikToks",
      description: "国内在线刷Tiktok短视频，看国外小姐姐",
      link: "https://tik.fail/browse#random",
      categoryNames: ["video-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 视频下载
    {
      title: "无水印视频下载",
      description: "免费的无水印短视频在线解析下载工具，下载无水印抖音、快手、西瓜视频等",
      link: "https://imyshare.com/parsevideo",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ApowerSoft视频下载王",
      description: "万能的视频下载工具，支持视频嗅探下载",
      link: "https://imyshare.com/article/6",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Video DownloadHelper",
      description: "网页视频嗅探（浏览器插件），免费版有每天下载数量限制",
      link: "https://www.downloadhelper.net",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Stream Recorder",
      description: "一款网页视频下载插件，支持高级的嗅探捕捉模式下载视频",
      link: "https://www.hlsloader.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "DownSub-Youtube字幕下载",
      description: "一款非常流行的在线字幕下载工具,不需要下载或安装任何软件",
      link: "http://downsub.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "iSkysoft iTube Studio",
      description: "Mac上的视频下载软件，支持10000+网站，且支持任何网站录制",
      link: "https://xclient.info/s/iskysoft-itube-studio.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "哔哩下载姬",
      description: "B站视频下载助手-支持登录、4K下载、清晰度选择、去水印",
      link: "https://www.52pojie.cn/thread-1217615-1-1.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "B23Downloader",
      description: "B 站 视频 / 直播 / 漫画下载器",
      link: "https://git.nju.edu.cn/zero/B23Downloader",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "B站下载助手",
      description: "Bilibili视频下载插件，支持下载分段的视频",
      link: "https://docs.qq.com/doc/DQ2lhaWRpS0tubVVF",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "贝贝の站",
      description: "B站视频在线下载",
      link: "https://xbeibeix.com/bilibili",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Allavsoft视频下载器",
      description: "支持全球1000+的网站下载视频",
      link: "https://carrotchou.lanzoux.com/b0gw5kib",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Allavsoft Mac视频下载器",
      description: "支持全球1000+的网站下载视频",
      link: "https://xclient.info/s/allavsoft-video-downloader-converter.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Downie for Mac",
      description: "Mac上的视频下载工具，支持700+网站",
      link: "https://carrotchou.lanzoux.com/b03ykefif",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "m3u8视频在线提取工具",
      description: "一个程序员小哥开发的m3u8视频在线提取工具，可以用来下载m3u8视频",
      link: "http://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "TSmaster",
      description: "提取码：jr1n，用在m3u8、TS文件和CKplayer的视频下载、解密、合并",
      link: "https://pan.baidu.com/s/1fotn1XXvyZXWimHw3h2Vlw",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "网页视频下载APP",
      description: "一款下载网页视频的Android App",
      link: "https://m3w.cn/wyspxz",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AG视频解析",
      description: "在线解析m3u8视频工具，可以解析腾讯视频、爱奇艺、优酷、芒果TV、搜狐视频、B站、乐视、央视等十几个主流平台",
      link: "https://ziyuanhuishequ.lanzoui.com/i9zdWwsepuj",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "GIFRun",
      description: "从YouTube，Facebook，Twitter，Vimeo和许多其他网站下载视频为高清GIF",
      link: "https://gifrun.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Happy-crawler",
      description: "抖音、快手、西瓜视频、B站、acfun、漫画猫、下载器",
      link: "https://www.52pojie.cn/thread-1450767-1-1.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "抖音热门工具",
      description: "可查看抖音热门视频，最热音乐，支持抖音视频无水印下载，支持抖音音乐下载",
      link: "https://1app1.lanzoui.com/iTf8hwtd8na",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "微信视频号视频下载工具",
      description: "由吾爱大佬开发的一款PC版微信视频号视频下载软件",
      link: "https://www.52pojie.cn/thread-1507737-1-1.html",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "FLVCD",
      description: "一个微视频/音乐专辑批量解析下载门户网站",
      link: "http://www.flvcd.com",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Twitter Video Downloader",
      description: "一个在线推特视频下载网站",
      link: "https://twdown.net/index.php",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Y2mate",
      description: "一个在线下载YouTube等视频的网站",
      link: "https://www.y2mate.com",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "简单动漫",
      description: "一个资源免费、画质高清的动漫下载网站",
      link: "https://www.36dm.club",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "唧唧Down",
      description: "一个用于下载 bilibili 视频的在线工具和PC应用程序",
      link: "http://www.jijidown.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "DmSave——视频下载",
      description: "一款在线视频下载器",
      link: "https://dmsave.top/en",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "光影存图",
      description: "图片、视频设计素材下载网站",
      link: "https://www.obcuntu.com",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "B站录播姬",
      description: "一个方便好用免费开源的哔哩哔哩直播录制工具",
      link: "https://rec.danmuji.org",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Youtube视频下载器",
      description: "一个免费在线YouTube视频转换与下载网站",
      link: "https://www.online-downloader.com/index-Chinese",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "微博秒拍视频下载",
      description: "一个微博秒拍视频解析下载在线工具",
      link: "https://weibomiaopai.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Download bilibili videos",
      description: "一个免费的B站视频下载工具",
      link: "https://keepv.id/download-bilibili-videos",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "映客小视频解析下载",
      description: "映客小视频在线解析下载工具",
      link: "https://inke.iiilab.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "贝贝BiliBili",
      description: "B站视频解析下载",
      link: "https://www.xbeibeix.com/api/bilibili",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "抖音去水印视频下载",
      description: "一个多平台去水印视频下载网站",
      link: "http://www.zgei.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "不太灵影视",
      description: "一个高清电影下载网站",
      link: "https://www.2bt0.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ParseVideo",
      description: "一个在线视频解析工具，提供视频地址在线解析服务",
      link: "https://www.parsevideo.com",
      categoryNames: ["download-video"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "SuperParse",
      description: "一个免费在线解析并下载视频网站",
      link: "https://superparse.com",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "TikTok Video Download",
      description: "一个下载海外TikTok高清视频网站",
      link: "https://snaptik.app",
      categoryNames: ["download-video"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 音乐资源
    {
      title: "爱上Radio",
      description: "一个非常受欢迎的电台直播平台，原名为优听Radio，收录丰富电台资源，涵盖各种类型",
      link: "http://www.idomyradio.com/#menu=index&url=main.html?v=1",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "猫耳FM",
      description: "一个弹幕音图站，同时也是中国声优基地，在这里可以听电台、音乐、翻唱、小说和广播剧等内容",
      link: "https://www.missevan.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "HiFiNi - 音乐磁场",
      description: "音乐分享网站，提供多格式下载，资源丰富（VIP需要10元）",
      link: "https://www.hifini.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "MyFreeMP3",
      description: "免费在线听歌，支持搜索下载无损音乐！",
      link: "https://tools.liumingye.cn/music",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "全网免费音乐资源合集",
      description: "聚合全网免费听歌，免费下载音乐的网站、手机app、电脑软件，以及免费音乐资源的合集",
      link: "https://imyshare.com/article/26",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "铜钟",
      description: "多平台歌曲在线听，支持下载！登录后可创建歌单并同步",
      link: "https://tonzhon.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "一起听歌吧",
      description: "比较有意思的在线听歌网站，可以创建属于自己的音乐屋，让有相同喜好的人聚在一起实时听歌、分享、互动",
      link: "http://music.alang.run",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "YesPlayMusic",
      description: "开源的在线听网易云音乐，界面好看，软件有特殊功能",
      link: "https://github.com/qier222/YesPlayMusic",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "歌曲大全",
      description: "在线听歌，音乐聚合搜索，下载",
      link: "http://gequdaquan.net/gqss",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "百乐米",
      description: "专注于分享好听稀有音乐！",
      link: "https://bailemi.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "车载收音机",
      description: "一款免费的电台软件，收录非常丰富的车载电台，全部免费收听！！",
      link: "https://dazhong.lanzoui.com/ikAB2rbosid",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "一听音乐",
      description: "一个在线音乐网站，集正版音乐、原创歌曲平台、网络电台为一体",
      link: "https://www.1ting.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "私房歌",
      description: "一个经典歌曲分享平台",
      link: "http://www.ningmeng.name",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "清风DJ音乐网",
      description: "精品DJ舞曲汇聚网站",
      link: "https://www.vvvdj.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "田园轻音乐网",
      description: "中国风纯音乐，田园田野轻音乐",
      link: "http://www.tyqyyw.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "串串烧音乐论坛",
      description: "一个电音和潮流聚集的地方",
      link: "http://www.ccsdj.com/forum.php",
      categoryNames: ["music-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "DJ嗨吧",
      description: "DJ原创网站,提供国内外DJ舞曲",
      link: "http://www.djhaiba.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "好听轻音乐——imoongo",
      description: "经典轻音乐、好听纯音乐、轻音乐博客",
      link: "https://imoongo2.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "DJ嗨吧",
      description: "DJ原创网站,提供国内外DJ舞曲",
      link: "http://www.djye.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "音乐港湾",
      description: "一个在收录音乐网站",
      link: "http://www.yygangwan.com",
      categoryNames: ["music-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    // 音乐下载
    {
      title: "熊猫无损音乐",
      description: "一个免费提供高品质音乐下载的网站",
      link: "https://www.xmwav.com",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "全网免费音乐下载工具合集",
      description: "聚合全网免费听歌，免费下载音乐的网站、手机app、电脑软件的合集",
      link: "https://imyshare.com/article/26",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "果核音乐",
      description: "果核大佬开发的在线音乐搜索下载网站，支持QQ、网易云和酷狗，重点是支持无损！",
      link: "https://music.ghxi.com",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "下歌吧",
      description: "音乐下载平台，支持下载无损",
      link: "http://music.y444.cn",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Ringer-手机铃声制作",
      description: "一个免费的网页在线剪辑音乐的网站,可以用来制作手机铃声",
      link: "http://ringer.org",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "音乐搜索器",
      description: "在线音乐聚合搜索下载，轻松下载全网音乐，仅支持标准音质",
      link: "http://music.itzo.cn",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "洛雪音乐助手",
      description: "全网音乐免费在线听，及下载，支持Win、Mac、Linux",
      link: "https://github.com/lyswhut/lx-music-desktop#readme",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Milk-Tea DJ&音乐",
      description: "DJ音乐下载工具，内置14个下载源",
      link: "https://www.52pojie.cn/thread-1276755-1-1.html",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Mp3tag",
      description: "免费的音乐封面、名称、艺术家、专辑等数信息编辑",
      link: "https://download.mp3tag.de/mp3tagv301setup.exe",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "九酷音乐",
      description: "一个专业的在线音乐试听mp3下载网站",
      link: "https://www.9ku.com",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "放屁音乐网",
      description: "一个在线音乐搜索和下载网站",
      link: "https://www.fangpi.net",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "古曲网",
      description: "一个提供中国古典音乐试听和下载网站",
      link: "http://www.guqu.net",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "牛五音乐网",
      description: "一个全网音乐免费下载网",
      link: "http://www.6002255.com",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "MP3BST",
      description: "一个免费音乐下载器网站",
      link: "https://mp3bst.com",
      categoryNames: ["download-music"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 书籍资源
    {
      title: "多媒体数字报纸",
      description: "一款基于asp.net mvc技术的多媒体数字报刊管理系统",
      link: "http://www.53bk.com/baokan",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "蜻蜓FM",
      description: "一款网络音频应用，汇聚广播电台等优质音频。",
      link: "https://www.qingting.fm",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "逐浪网",
      description: "集阅读与创作为一体的原创文学平台",
      link: "https://www.zhulang.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小说阅读网",
      description: "国内知名原创网络文学门户,拥有海量好看的免费全本小说,提供原创小说和畅销出版书籍的在线阅读和下载",
      link: "https://www.readnovel.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "起点女生网",
      description: "国内知名女性原创网络文学门户，拥有海量的全本小说作品，提供原创小说免费在线阅读",
      link: "https://www.qdmm.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "书享家",
      description: "集公益网络图书馆、一站式读书服务为一体的网络数字化阅读平台",
      link: "https://www.shuxiangjia.cn",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "TheFuture",
      description: "免费的电子书搜索引擎，虽然还是测试阶段，但是蓝奏云的搜索结果还不错",
      link: "https://bks.thefuture.top",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阅读链",
      description: "电子书搜索下载网站",
      link: "https://www.yuedu.pro",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "鸠摩搜书",
      description: "文档搜索引擎",
      link: "https://www.jiumodiary.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "易阅通",
      description: "免费在线看300W+高质量PDF电子书",
      link: "https://www.cnpereading.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "掌阅/Kindle/有声书籍打包",
      description: "掌阅/Kindle/有声书籍资源合集，缺点是城通网盘",
      link: "https://sn9.us/dir/17192461-27868687-4e3441",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "城通网盘2W+电子书打包",
      description: "城通网盘2W+电子书打包，缺点是城通网盘",
      link: "https://545c.com/dir/7823036-11625293-090948",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小鱼速读",
      description: "一个很简洁的在线读书网站，可以读豆瓣排行榜上的书",
      link: "http://www.xysudu.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "爱巴士书房",
      description: "爱巴士书房，阅读者的知识之窗，涵盖了丰富文学作品、小说资源，全都是精校版本的",
      link: "https://www.18sbook.com",
      categoryNames: ["reading-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "知识库",
      description: "免费的电子书分享网站",
      link: "https://book.zhishikoo.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "偶书",
      description: "免费的电子书分享网站，文学类书籍居多",
      link: "https://obook.cc",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "SoBooks",
      description: "优质电子书资源免费下载网站",
      link: "https://sobooks.net",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "脚本之家电子书",
      description: "脚本之家PDF扫描版电子书，计算机类居多（需要关注公众号）",
      link: "https://www.jb51.net/books",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "码农之家",
      description: "计算机类电子书下载网站",
      link: "https://www.xz577.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "七秒书盘",
      description: "收揽全网电子书资源，千万资源一搜即达",
      link: "https://www.7sebook.com/disk",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "云海电子图书馆",
      description: "免费电子书下载网站",
      link: "http://www.pdfbook.cn",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "映月读书",
      description: "文学、名著、小说在线免费阅读，重点是有文学作品~",
      link: "https://www.zuopj.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "轻阅",
      description: "开源阅读软件，内置1472个书源，再也不用担心找不到书看了！",
      link: "https://lanzoui.com/iwbVVit5zda",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "七猫免费小说",
      description: "数百万本小说免费看，旗号：免费看书100年！",
      link: "https://www.qimao.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Uncle小说",
      description: "开源的电脑版全网小说下载神器，支持搜索全网文本小说、有声小说，下载和阅读小说",
      link: "https://github.com/unclezs/uncle-novel",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PC端小说下载器",
      description: "吾爱大佬开发的PC版小说下载器，支持多个书源搜索下载，在线看小说也是OK的",
      link: "https://www.52pojie.cn/thread-1378350-1-1.html",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "eRead",
      description: "eBook是一款吾爱出品的纯净、安全、无广告的在线小说阅读器（电脑版），可以免费在线看全网小说！",
      link: "https://www.52pojie.cn/forum.php",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Clibrary",
      description: "一个Z-Library电子书搜索引擎网站",
      link: "https://clibrary.cn/#",
      categoryNames: ["reading-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "安娜的档案",
      description: "一个免费的在线电子书下载网站",
      link: "https://zh.annas-archive.org",
      categoryNames: ["reading-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "无名图书",
      description: "一个支持免费下载电子书的资源网站",
      link: "https://www.book123.info",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "贼吧网",
      description: "txt小说下载在线阅读的电子书门户网站",
      link: "https://www.zei8.me",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "棉花糖小说网",
      description: "无需注册即可免费下载全网 txt 小说",
      link: "http://www.mhtwx.la",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "书格",
      description: "一个自由开放的在线古籍图书馆",
      link: "https://new.shuge.org",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "搬书匠",
      description: "一个收录各种“编程语言、软件开发”相关的电子书网站",
      link: "http://www.banshujiang.cn",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "精校吧",
      description: "一个给书友提供下载网络精校txt小说、完本电子书的网站",
      link: "https://www.jingjiaoba.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "书荒部落",
      description: "精校全面小说下载",
      link: "http://noveless.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "SoDu小说网",
      description: "一个集合网络各大小说最新章节的搜索引擎",
      link: "https://www.sodu9.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "鬼怪屋",
      description: "一个免费的在线鬼故恐怖故事集合网站，你可以尽情阅读各种恐怖故事。",
      link: "http://www.guiguaiwu.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "盐神阁",
      description: "一个收录知乎盐选小说的网站，支持搜索功能",
      link: "https://www.ysg0.com",
      categoryNames: ["reading-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "owllook",
      description: "一个网络小说搜索引擎",
      link: "https://owlook.com.cn",
      categoryNames: ["reading-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "笔尖中文",
      description: "一个提供最新的热门小说免费阅读网站",
      link: "http://www.xbiquzw.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "期刊杂志",
      description: "期刊杂志免费在线阅读",
      link: "http://new-qk.lifves.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "免费小说阅读网",
      description: "一个提供免费小说阅读的网站",
      link: "http://www.mianfeixiaoshuoyueduwang.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "有声小说吧",
      description: "一个免费提供MP3有声小说网站",
      link: "http://www.ysxs8.vip/index.html",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "参考网",
      description: "中文杂志、中文期刊在线阅读网站",
      link: "https://www.fx361.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "读写人",
      description: "一个聚合了书评杂志、书评博客、中英文读书资源的网站",
      link: "https://www.duxieren.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "中国诗歌网",
      description: "一个原创诗歌第一平台",
      link: "https://www.zgshige.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PDF之家",
      description: "一个PDF杂志、图书等资源下载网站",
      link: "https://pdfzj.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Magazinelib",
      description: "国外杂志免费下载",
      link: "https://magazinelib.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "心情",
      description: "心理学书籍免费在线阅读",
      link: "http://www.ixinqing.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "微信读书助手",
      description: "自动组队，一键听书，备份笔记，整理书架，再也不用求人组队无限卡了！",
      link: "https://weread.qnmlgb.tech",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "一单书",
      description: "全网优质书单精选，给喜欢阅读的用户推荐有价值的书籍参考",
      link: "https://yidanshu.com",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "微信读书排行榜",
      description: "微信读书排行榜榜单，支持阅读热门标注内容",
      link: "http://klib.me/weread/hot/all.html",
      categoryNames: ["reading-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    // 漫画资源
    {
      title: "动漫屋",
      description: "日本漫画追番神器,汇聚海量精品日漫,带给你最快最全面的日系体验。",
      link: "https://www.dm5.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "漫漫漫画",
      description: "国内二次元漫画平台，连载大量原创正版国漫，精美的漫画图片、高品质的漫画大全",
      link: "https://www.manmanapp.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "半次元",
      description: "国内二次元爱好者社区，汇聚了包括Coser、绘师、写手等创作者在内的众多二次元同好",
      link: "https://bcy.net",
      categoryNames: ["comic-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "全是漫画App",
      description: "专门阅读漫画的工具，内置超多资源，无需注册完全免费",
      link: "https://github.com/hongchacha/cartoon",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Mangabz",
      description: "资源比较全的在线漫画、日本漫画阅读平台",
      link: "https://www.mangabz.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "极速漫画",
      description: "极速漫画，好漫画，为看漫画的人而生",
      link: "http://www.1kkk.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "MOXI动漫",
      description: "MOXI动漫-专注于PGC动漫内容自制",
      link: "http://www.moxidongman.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "漫画柜",
      description: "拥有海量的国产漫画、日韩漫画、欧美漫画等丰富漫画资源，免费在线看",
      link: "https://www.manhuagui.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "动漫之家",
      description: "海量漫画,全天更新在线漫画欣赏",
      link: "https://comic.dmzj.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "快看漫画",
      description: "快看漫画，官方漫画大全免费在线观看",
      link: "https://www.kuaikanmanhua.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "漫画台",
      description: "国内漫画免费看",
      link: "https://www.manhuatai.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "漫本",
      description: "华人原创漫画发行平台，也是一个在线漫画的阅读平台",
      link: "http://www.manben.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "特别版漫画软件合集",
      description: "几十款特别版本的漫画软件合集，看漫画不求人",
      link: "https://pan.lanzoui.com/b765262",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "动漫&漫画资源合集",
      description: "全网免费动漫资源、免费漫画资源合集",
      link: "https://imyshare.com/article/31",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "学外漫画",
      description: "一个提供了大量的免费漫画资源的网站",
      link: "https://www.xuewailx.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Animex动漫社",
      description: "一个致力于分享动漫及日本文化的网站",
      link: "https://www.animetox.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "动漫星空",
      description: "一个以动漫资讯、动漫壁纸、动漫音乐等内容为主打的综合动漫门户",
      link: "https://acg.gamersky.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "泡面菌",
      description: "一个动漫资讯平台",
      link: "http://www.pmjun.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "ACGN社区",
      description: "一个二次元动漫资源论坛网站",
      link: "https://www.acgnsq.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "包子漫画",
      description: "一个经典漫画网站,拥有全网最好看的漫画资源",
      link: "https://cn.baozimh.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "酷漫屋",
      description: "一个在线推荐全网最新最全漫画网站",
      link: "http://www.kumw9.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "土蛋漫画",
      description: "一个提供全网最新最全的免费漫画网站",
      link: "http://www.tudanmh.cc",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "仙漫网",
      description: "一个有着超多优质漫画资源网站",
      link: "https://www.gaonaojin.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "次元小镇",
      description: "一个动漫爱好者分享社区,动漫资源、资讯、动漫美图壁纸、音乐和cosplay资源小站",
      link: "https://dimtown.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Tachiyomi",
      description: "一个开源免费漫画阅读安卓APP下载网站",
      link: "https://tachiyomi.org",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "漫自由",
      description: "一个专门提供漫画下载的网站",
      link: "https://mhx12.com",
      categoryNames: ["comic-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ACG爱动漫",
      description: "一个ACG交流平台",
      link: "https://www.aidm12.com",
      categoryNames: ["comic-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    // 图库素材
    {
      title: "Blobmaker-矢量不规则图形设计",
      description: "一键生成各种不规则形状，快速创建随机、独特且有机外观的 SVG 形状。",
      link: "https://www.blobmaker.app",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "自媒体家园",
      description: "自媒体人必备的万能素材资源导航，一个免费高清视频素材下载网站",
      link: "https://www.zmthome.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pexels",
      description: "一个提供免费的图片和视频下载的大型素材网站，由来自世界各地充满才华的摄影师拍摄上传",
      link: "https://www.pexels.com/zh-cn",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "素材国度",
      description: "一个专注于设计素材下载的网站，为设计师提供PNG免抠素材、PSD图片素材、矢量图库、PS等素材",
      link: "https://www.dc10000.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "60Logo",
      description: "一个专门为设计师们提供各大知名品牌logo的网站",
      link: "http://www.60logo.com",
      categoryNames: ["image-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "甲方叭叭",
      description: "一个收录高质量设计内容的网站，网罗大量设计素材，随时随地访问收藏为设计灵感保驾护航",
      link: "https://jiafangbb.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "pictogram2-象形图",
      description: "一个分享非常人性化的人物动作、形象、神态矢量标识网站",
      link: "http://pictogram2.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Buttsss-屁股插图合集",
      description: "一个收录了非常多圆屁股的GIF动图网站",
      link: "https://www.buttsss.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "凌点视频素材网",
      description: "一个高清正版视频素材下载网站",
      link: "https://www.2amok.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "典尚视频网",
      description: "一个拥有300万+免费视频素材的网站",
      link: "http://sp.jzsc.net",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "爱给网",
      description: "一款免费提供各种短视频素材的网站",
      link: "https://www.aigei.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PICKFREE",
      description: "聚合了免版权图片、免费商用字体、免费音频、视频等设计素材下载资源站的导航",
      link: "http://www.pickfree.cn",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "The Stocks",
      description: "无版权图片网站合集，全部为 CC0 协议，无版权免费可用于商业！",
      link: "http://thestocks.im",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "搜图神器",
      description: "一键搜索多家免版权图库，再也不用担心商用图片侵权了",
      link: "https://www.logosc.cn/so",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "聚搜图",
      description: "全球可用的图片网站合集，分类齐全，包括：3D、插画、UI/UX、LOGO、室内、景观、家具等等",
      link: "http://www.jusotu.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Inspiration DE",
      description: "分享全球创意设计作品和素材的网站，可在国内替代Pinterest使用",
      link: "https://www.inspirationde.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "StorySet",
      description: "一个免费可自定义的插画网站，风格多样，可拓展性强",
      link: "https://storyset.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "unDraw",
      description: "开源的SVG插图库",
      link: "https://undraw.co/illustrations",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Delesign",
      description: "免费可商用的插图素材下载",
      link: "https://delesign.com/free-designs/graphics",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "LUKASZADAM",
      description: "免费可商用的插画图库",
      link: "https://lukaszadam.com/illustrations",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Many Pixels",
      description: "免费可商用的插图库",
      link: "https://www.manypixels.co/gallery",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "IRA Design",
      description: "免费商用矢量插画素材下载网站",
      link: "https://iradesign.io",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PSD REPO",
      description: "免费的UI套件，App/网页设计源文件，PSD源文件，XD模板，样机等下载网站",
      link: "https://psdrepo.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "UI STORE",
      description: "526个高质量的UI Kit项目源文件免费下载",
      link: "https://www.uistore.design",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PSDDD",
      description: "免费的PSD，sketch模板下载网站",
      link: "https://psddd.co",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Is",
      description: "免费高质量的样机下载网站",
      link: "https://www.ls.graphics/free-mockups",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "MOCKUP CLUB",
      description: "免费的样机下载网站",
      link: "https://themockup.club",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "CG资源网",
      description: "CG资源网内容涵盖AE模板,AE插件,AE教程,PR模板,FCPX插件,C4D插件,C4D教程,3D模型",
      link: "https://www.cgown.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "CG爱好者网",
      description: "CG爱好者网致力于分享ae模板，3D模型， AE素材等CG资",
      link: "http://www.cgahz.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "50个免费的3D模型下载网站合集",
      description: "50个最好的免费下载3D模型的网站（内附网址）",
      link: "https://zhuanlan.zhihu.com/p/40680702",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Free3D",
      description: "免费的3D模型下载网站",
      link: "https://free3d.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "TFMSTYLE",
      description: "高质量的3D源文件免费下载",
      link: "https://www.tfmstyle.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "3DModelFree",
      description: "免费的3D素材下载网站",
      link: "http://www.3dmodelfree.com/3dmodel/list500-1.htm",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Sketchfab",
      description: "高质量的3D模型下载，部分免费",
      link: "https://sketchfab.com/3d-models/popular",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Mixkit",
      description: "免费的视频、音乐、Premiere源文件下载网站",
      link: "https://mixkit.co",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "天空之城",
      description: "航拍视频作品大全",
      link: "https://www.skypixel.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AirPano",
      description: "足不出户，看全世界风景，360°照片，360°视频",
      link: "https://www.airpano.com/360photo_list.php",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PNG图库",
      description: "PNG免抠素材图库",
      link: "http://pngimg.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Smartmockups",
      description: "样机、产品模板素材生成下载",
      link: "https://smartmockups.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "FILMGRAB",
      description: "高清电影截图网站，每一张截图都是有灵魂的",
      link: "https://film-grab.com",
      categoryNames: ["image-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Cool Backgrounds",
      description: "五个背景图生成工具，从动态粒子到流行的Unsplash",
      link: "https://coolbackgrounds.io",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "发散光生成器",
      description: "自动生成炫酷的发散光背景图",
      link: "https://wangyasai.github.io/Stars-Emmision",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "双色图生成器",
      description: "将图片转换为双色，可提升背景图的高级感",
      link: "https://duotone.shapefactory.co",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Get Waves",
      description: "在线生成优美的波浪线",
      link: "https://getwaves.io",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pixel Map",
      description: "矢量地图下载，支持选择区域",
      link: "https://pixelmap.amcharts.com",
      categoryNames: ["image-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "GIPHY",
      description: "在线动态GIF图片搜索引擎，号称GIF界的Google",
      link: "https://giphy.com",
      categoryNames: ["image-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "The Pattern Library",
      description: "一个提供免费纹理图资源的网站",
      link: "http://thepatternlibrary.com",
      categoryNames: ["image-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    // 壁纸下载
    {
      title: "油画云彩图片集-IAN FISHER",
      description: "一个收藏了众多油画版云彩图片的网站",
      link: "https://www.ianfisherart.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "3G壁纸",
      description: "壁纸种类多，既可以下载手机壁纸，又可以下载电脑壁纸。壁纸都是免费高清的！",
      link: "https://www.3gbizhi.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "WallHere",
      description: "世界著名的壁纸网站，超多精美壁纸，不过电脑壁纸居多",
      link: "https://wallhere.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Digital Blasphemy",
      description: "8K壁纸免费下载！",
      link: "https://digitalblasphemy.com/toprated.shtml",
      categoryNames: ["download-wallpaper"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "动漫壁纸",
      description: "免费的动漫壁纸下载，支持动漫壁纸搜索",
      link: "https://anime-pictures.net",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Game Wallpapers",
      description: "CG壁纸下载，游戏壁纸下载",
      link: "https://www.gamewallpapers.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "美图131",
      description: "一个收集并分享美女模特的相关图片网站",
      link: "https://www.meitu131.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "彼岸桌面壁纸",
      description: "一个提供最新最全的高清壁纸下载网站",
      link: "http://www.netbian.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "元气桌面",
      description: "一款免费桌面美化软件，包含元气壁纸和桌面整理",
      link: "https://desk.duba.com",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "极简壁纸",
      description: "一个拥有海量电脑桌面壁纸美图网站",
      link: "https://bz.zzzmh.cn/index",
      categoryNames: ["download-wallpaper"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 办公资源
    {
      title: "第一范文网",
      description: "一个以提供应用文范文、作文、教案、试题等实用性资料为主的网站。",
      link: "https://www.diyifanwen.com",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "红森林",
      description: "一个专注平面设计、影视特效等设计工具、教程，素材资源的分享交流网站，为自媒体及视觉设计人员提供灵感和动力",
      link: "http://www.hoslin.cn",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Doyoudo设计资源",
      description: "创意设计软件学习平台，看幽默、超清、干货的视频教程",
      link: "https://www.doyoudo.com/free",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "OfficePLUS",
      description: "微软官方免费office模板网站，简洁和商务风居多",
      link: "https://www.officeplus.cn/PPT/template",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Creative Market",
      description: "素材交易平台，作品逼格高，可下载单张预览图，照着做",
      link: "https://creativemarket.com/templates/presentations",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Slidor",
      description: "质量超级无敌高的PPT模板",
      link: "https://www.slidor.fr",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Just Free Slide",
      description: "免费PPT模板下载，数量不多但是质量还行",
      link: "https://justfreeslide.com",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "优品PPT",
      description: "免费PPT模板下载网站",
      link: "https://www.ypppt.com",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PPT超级市场",
      description: "免费质量还行的PPT下载网站",
      link: "http://ppt.sotary.com/web/wxapp/index.html",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "1PPT",
      description: "算是国内为数不多的免费PPT下载网站了，网站简陋了些，但是免费",
      link: "http://www.1ppt.com",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "AboutPPT",
      description: "PPT演示设计资源导航网站",
      link: "https://www.aboutppt.com",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Hippter",
      description: "PPT资源综合导航网站",
      link: "http://www.hippter.com/index.html",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "方案通",
      description: "一款营销、活动方案查询神器，为活动策划人提供策划创意灵感的平台",
      link: "https://www.heimaohui.com/programme",
      categoryNames: ["office-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 文档下载
    {
      title: "My Graph Paper-方格纸制作",
      description: "一款自定义纸张模板的网页,主要用来制作各种大小的田字格/拼音、作业本、信纸、分镜表等模板",
      link: "https://mygraphpaper.com",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "文库下载器BY小叶",
      description: "密码:5wup，比冰点文库支持的网站更多，并且支持转换为office文档",
      link: "https://wwe.lanzouq.com/iQhg700vp1ra",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "冰点文库下载",
      description: "下载文档利刃当之首选！百度、豆丁、丁香等",
      link: "https://gmengshuai.lanzoui.com/iqNxJqlnlne",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "wkDownloader",
      description: "一款吾爱出品的免费的百度文库文档下载软件",
      link: "https://wws.lanzoui.com/iXVVpvbd4aj",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "文档下载插件",
      description: "一款文档下载Chrome插件，支持VIP文档下载",
      link: "https://yiguotang.lanzoui.com/iej08uoo6wb",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "巴法文库下载",
      description: "免费下载需要下载券的百度文库文档",
      link: "http://wenku.bemfa.com",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "静思书屋",
      description: "一个免费图书 epub pdf mobi txt 下载网站",
      link: "https://book.tinynews.org",
      categoryNames: ["download-document"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "淘链客",
      description: "一个主要收集文档类资源下载链接的聚合型搜索引擎",
      link: "https://www.toplinks.cc/s",
      categoryNames: ["download-document"],
      normalAvailable: false,
      vpnAvailable: true
    },
    // 资源分享
    {
      title: "小小树洞",
      description: "400T阿里云盘资源文档，电影动漫综艺学习教程软件音乐等",
      link: "https://docs.qq.com/doc/DS3F5bFpDbU1WT013",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿里云盘资源合集",
      description: "专门收录各位网友分享的精品阿里云盘资源，海量资源，只等你来存！",
      link: "https://imyshare.com/article/35",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "个人网盘资源合集",
      description: "世纪互联、个人网盘、谷歌网盘资源合集，软件类偏多，所有资源均可高速下载！",
      link: "https://imyshare.com/static/others/PersonalDrive.txt",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "不死鸟",
      description: "每日资源分享，分享为王！",
      link: "https://iui.su",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "书签地球",
      description: "浏览器书签共享平台，提供浏览器书签分享、在线制作、下载等",
      link: "https://www.bookmarkearth.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿虚同学",
      description: "阿虚同学是资源分享界的大佬，粉丝无数",
      link: "https://www.axutongxue.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "资源汇社区",
      description: "各种资源分享，比如知乎live合集、樊登合集、Keep合集等等",
      link: "http://ziyuanhuishequ.ys168.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "哆啦A梦的神奇口袋",
      description: "各种资源分享，包括：游戏、音乐、软件、学习资源等等",
      link: "http://baozangku.ys168.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "搜网通",
      description: "搜网通是一个网络资源聚合整合站点，每天将各类资源网站中有价值的网络资源精选进行分类并分享",
      link: "https://www.s5t.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "懒人找资源",
      description: "知识应该平等的流向每一个人，一个资源分享网站，包含学习资源、影视、模板、电子书、软件等资源",
      link: "http://lazymovie.me",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "布客新知",
      description: "布客新知是一个整理和开放知识的计划，打算做知识付费领域的破晓或轻，所有知识采用三个渠道稳定备份。",
      link: "http://it-ebooks.flygon.net",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "图欧学习资源库",
      description: "一个网盘资源分享网站，主要是学习资源、考证考级资源等",
      link: "https://tuostudy.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "挖互联网",
      description: "一个专门挖掘和收录有趣有用的互联网产品的网站",
      link: "https://tigg.cc",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿里小站",
      description: "阿里云盘资源共享网站",
      link: "https://www.pan666.cn",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿里云盘资源分享社区",
      description: "由24k导航大佬搭建的阿里云盘资源分享网站",
      link: "https://alyunpan.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "天翼小站",
      description: "天翼云盘资源分享",
      link: "https://yun.hei521.cn",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "免费资源网",
      description: "收集各类免费资源服务，包括免费空间、免费域名、免费网盘和云存储、免费邮箱、免费相册，免费电话手机流量等等",
      link: "https://www.freeaday.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "技术资源分享",
      description: "互联网相关的技术学习资源分享网站，包括：开发、数据分析、UI设计、产品经理等等",
      link: "https://tech.ziyuan.iters.cn",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "OneGO导航",
      description: "个人网盘索引导航站，里面很多网盘资源量大！",
      link: "https://ionego.net",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Gimhoy图书",
      description: "Gimhoy图书是一个供大家自由上传和下载电子书的网站，目前已经汇集了不少书籍",
      link: "https://books.gimhoy.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Gimhoy音乐盘",
      description: "Gimhoy音乐盘是一个供大家自由上传和下载音乐的网站，目前已经汇集了几万首音乐",
      link: "https://music.gimhoy.com/list",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Noiseyp",
      description: "新媒体行业相关资源分享，比如adobe软件，各种设计插件，学习教程等等",
      link: "https://noiseyp.top",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "学习教程分享",
      description: "访问码：2svg，一个教程分享网盘，包含设计教程、运营教程、开发教程等等",
      link: "https://cloud.189.cn/t/JRzayiFneURf",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "阿里云盘资源分享",
      description: "一个长期更新的阿里云盘资源分享文档，里面记录了很多作者收集的阿里云盘资源",
      link: "https://docs.qq.com/sheet/DVHpJVmRhT3ViV09Q",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "优质课程知识库",
      description: "由网友维护更新的课程知识库在线文档，包含大学课程、其他课程、非专业知识区、up主推荐、书籍推荐等",
      link: "https://docs.qq.com/sheet/DRU5MWHZCTHFGQnhM",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "1750部电影",
      description: "网友分享的阿里云盘1750部电影，可以收藏",
      link: "https://www.aliyundrive.com/s/nzF8vyowREt",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "人人影视整站数据库",
      description: "人人影视整个网站数据库文件，包含人人影视网站的所有影视资源，赶紧收藏哦！",
      link: "https://github.com/tgbot-collection/YYeTsBot",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Telegram群组推荐",
      description: "一个专门推荐精品Telegram群组、频道、机器人、主题等的网站，玩TG的自然懂！",
      link: "https://tgtw.cc",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Telemetrio",
      description: "全网Telegram频道排行榜，帮助大家轻松找到自己想要的Telegram频道！",
      link: "https://telemetr.io/en/channels",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Telegram Analytics",
      description: "Telegram群组频道的集合网站，可搜索自己想找的Telegram组群频道",
      link: "https://tgstat.com",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "考证考级教程资料分享",
      description: "一个专门分享各类考证考级视频教程/课程、真题资料、面试技巧等的网站，所有资料提供网盘链接",
      link: "http://jcjys.edudisk.cn/allshare.aspx",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "山己几子木",
      description: "一个提供系统MSDN 镜像的资源网站",
      link: "https://msdn.sjjzm.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "猎手导航搜索",
      description: "集搜索引擎搜索、社交搜索、BT磁力搜索、学术文档搜索等各行业常用网站于等一身的导航网站",
      link: "http://www.lsdhss.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "免费考试课件",
      description: "含会计／自考／考研／建造师／造价师／消防／监理／公务员／等等视频资源的永硕E盘",
      link: "http://mfkskj.ys168.com",
      categoryNames: ["share-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "灰铲",
      description: "如名字，一个发布灰需求，找灰服务商的交流社区，电脑模拟手机访问见技巧",
      link: "https://huichan.com",
      categoryNames: ["share-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    // 资源搜索
    {
      title: "奈斯搜索",
      description: "🔥🔥🔥阿里云盘资源搜索引擎",
      link: "https://www.niceso.net",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Telegram中文搜索",
      description: "Telegram频道搜索，帮助大家搜Telegram频道里的资源",
      link: "https://tg.qianfan.app",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "点点文档",
      description: "在线的文档搜索工具。专注于文档搜索",
      link: "https://www.torrent.org.cn/bd",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AnyPaper",
      description: "学术搜索神器，论文搜索终结者，科学研究好助手",
      link: "https://ifish.fun/paper/search",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "库问搜索",
      description: "免费的学术文档、文献搜索下载网站",
      link: "http://www.koovin.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "iData",
      description: "免费下载学术文献，免费论文下载（每日免费1 - 2篇）",
      link: "https://www.cn-ki.net",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "F搜",
      description: "一个聚合搜索引擎，或许有超出百度、搜狗以外的搜索体验",
      link: "https://fsoufsou.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Searx.space",
      description: "里面收录了目前基于「Searx」开源项目搭建的搜索引擎网站，保留隐私的好用搜索引擎都在这里了",
      link: "https://searx.space",
      categoryNames: ["search-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "MBA智库百科",
      description: "一个内容开放的百科全书网站",
      link: "https://www.mbalib.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Ecosia",
      description: "一个绿色公益搜索引擎，利润捐赠给非营利组织种植树木",
      link: "https://www.ecosia.org",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "多搜搜",
      description: "一个图片搜索引擎",
      link: "https://www.duososo.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "老王磁力",
      description: "一个磁力链接搜索引擎",
      link: "https://laowangsu.top",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "FilePursuit",
      description: "一个强大的免费资源搜索引擎",
      link: "https://filepursuit.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "中国搜索",
      description: "一个搜索引擎，贴近民生、服务大众的应用服务和垂直搜索频道",
      link: "https://www.chinaso.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "百度图片",
      description: "一个百度图片搜索引擎",
      link: "https://image.baidu.com",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "文津搜索",
      description: "一个国家图书馆自建数据和部分已购买了服务的各类数字资源网站",
      link: "http://find.nlc.cn",
      categoryNames: ["search-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    // 其他资源
    {
      title: "移动芯片性能天梯图-Socpk",
      description: "一个实时的移动芯片性能天梯排行网站",
      link: "https://www.socpk.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "锦囊菜谱",
      description: "提供各种菜谱大全、食谱大全、家常菜做法大全，丰富的菜谱大全，一个菜谱分享的平台",
      link: "https://jncaipu.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "纪妖",
      description: "一个收录中华上下具有历史意义的怪力乱神文化网站，带你了解古今中外不同的文化知识",
      link: "http://www.cbaigui.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "知乎搬运工",
      description: "知乎盐文章、知乎高质量文章搬运网站，提供给大家无广告免费看，定期更新！",
      link: "https://www.zhihuban.ml",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "知乎盐选文章",
      description: "密码：19v5，将知乎盐选文章转成PDF分享给大家，持续更新！",
      link: "https://wwa.lanzoux.com/b00oj8isd",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "虫部落",
      description: "各种资源分享论坛",
      link: "https://www.chongbuluo.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "VIP账号分享1",
      description: "百度网盘，爱奇艺，迅雷，优酷，腾讯虾米等VIP账号分享",
      link: "https://github.com/VIP-Share/Baidu-XunleiVIP",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "免费直播",
      description: "免费看高清直播，内容很丰富，请勿轻易相信视频直播之外的内容！",
      link: "http://down.kanqiu01.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "VIP账号分享2",
      description: "百度网盘，爱奇艺，迅雷，优酷，腾讯虾米等VIP账号分享",
      link: "https://github.com/lpg-it/BaiduYunVIP/blob/master/baiduYunVIP.md",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "分享大师",
      description: "各种会员账号分享",
      link: "https://www.fenxiangdashi.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "肥鱼网",
      description: "各种VIP账号分享",
      link: "https://www.feiyuka.com",
      categoryNames: ["other-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "VIP部落",
      description: "各类VIP账号分享",
      link: "http://www.vipbuluo.com",
      categoryNames: ["other-resource"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "虚拟手机号",
      description: "长期稳定的虚拟手机号码，可用于注册各类账号，接收任何验证码等，支持200多个国家",
      link: "https://sms-man.com/blog/new-feautures-smsman-bot-cn",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "在线接码",
      description: "在线使用临时手机号接收短信验证码",
      link: "https://jiemahao.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "临时手机号",
      description: "可用于临时接收短信，注册临时账号等",
      link: "https://www.jishuqq.com/QQjiqiao/2019/0108/62573.html",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "临时邮箱",
      description: "可用于临时接收邮件，注册临时账号等",
      link: "http://24mail.chacuo.net",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "联图云 · 光盘",
      description: "一个书籍光盘收集网站，支持免费下载",
      link: "http://discx.yuntu.io",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Pixiv Now",
      description: "一个 Pixiv 代理服务网站",
      link: "https://www.pixivs.cn",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "畅想之星光盘数据库",
      description: "畅想之星随书光盘下载",
      link: "http://cd.lib.uir.cn/bookcd/index/index.do",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "摸鱼网",
      description: "一个二次元插画网站",
      link: "https://www.mooyuu.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "一些数据库",
      description: "微博、圆通、酒店、房产网等等的数据库，懂的都懂",
      link: "https://chjina.blogspot.com/2021/01/blog-post.html",
      categoryNames: ["other-resource"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "次元街",
      description: "一个提供资讯、壁纸、音乐、cosplay、游戏、评测、攻略、漫展信息等内容的ACG分享平台",
      link: "https://www.ciyuanjie.cn",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "chinaSMACK",
      description: "一个解释和翻译新闻的网站",
      link: "http://www.chinasmack.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "MSDN系统库",
      description: "一个提供MSDN原版系统和安装教程的个人网站",
      link: "https://next.itellyou.cn/Identity/Account/Login?ReturnUrl=%2FOriginal%2FIndex",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "轻之国度",
      description: "国内最大轻小说论坛",
      link: "https://www.lightnovel.us/cn",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "不思议导航",
      description: "一个支持很多的搜索引擎网站",
      link: "https://orxing.top/nav",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Sao.Fm-思奥FM",
      description: "一个全球音乐、新闻和播客电台网站",
      link: "https://sao.fm",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "沙发网",
      description: "一个为智能电视/盒子用户提供优质的TV应用网站",
      link: "http://app.shafa.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "DirectX修复工具",
      description: "一款DirectX修复工具，检测当前系统的DirectX状态，如果发现异常则进行修复。程序主要针对0xc0000",
      link: "https://blog.csdn.net/vbcom/article/details/6962388",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "书法字典",
      description: "一个在线查询历代书法家作品的网站",
      link: "http://www.shufazidian.com",
      categoryNames: ["other-resource"],
      normalAvailable: true,
      vpnAvailable: false
    },
    // windows 软件
    {
      title: "Watt Toolkit",
      description: "一个开源跨平台的多功能Steam游戏工具箱，使用开源项目进行本地反代来支持更快的访问游戏网站",
      link: "https://steampp.net/download",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Google Chrome 浏览器",
      description: "Google Chrome浏览器官网，下载最新版谷歌浏览器，以及其他版抢先体验",
      link: "https://www.google.cn/intl/zh-CN/chrome",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Awesome Windows",
      description: "Windows最佳应用程序和工具的精选列表",
      link: "https://github.com/Awesome-Windows/Awesome",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PowerToys",
      description: "微软出品的实用工具箱",
      link: "https://github.com/microsoft/PowerToys",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "HEU KMS Activator",
      description: "Windows、Office激活工具",
      link: "https://lanzoux.com/b674789",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Dism++",
      description: "Windows系统盘清理，系统备份&还原",
      link: "https://github.com/Chuyu-Team/Dism-Multi-language/releases/tag/v10.1.1002.1",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "黑科技工具箱",
      description: "吾爱大佬将多款使用工具整合成的一个工具包，比如文库下载，OCR识别等。提取码：whlp",
      link: "https://pan.baidu.com/s/1UsSVOZZJfAEgIz01XtF85A",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Office Tool Plus",
      description: "Office下载、安装、激活、扩展",
      link: "https://otp.landian.vip/zh-cn",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Geek Uninstaller",
      description: "超级小巧的软件卸载工具，支持删除卸载后的残留文件以及注册表等",
      link: "https://geekuninstaller.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PotPlayer",
      description: "备受欢迎的超强视频播放器（纯净版）",
      link: "https://lanzoux.com/b0gw7r0h",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ZY Player",
      description: "跨平台在线看视频，下载视频神器，支持Win/Mac/Linux",
      link: "http://zyplayer.fun",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "班迪录屏",
      description: "班迪录屏Bandicam，一款Windows平台非常好用且老牌的录屏工具",
      link: "https://423down.lanzouo.com/b0f197pud",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Neat Reader",
      description: "Epub阅读器，Neat Reader v6.0.4 去广告&去各种限制&可珍藏",
      link: "https://www.52pojie.cn/thread-1280997-1-1.html",
      categoryNames: ["windows-software"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "逍遥安卓模拟器",
      description: "PC端Android模拟器，免费、无广告、性能强",
      link: "https://www.xyaz.cn",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "WebDav小秘",
      description: "助用户快速搭建文件分享/同步环境，免去普通用户在文件分享/同步过程中的烦恼",
      link: "https://lightzhan.xyz/index.php/webdavhelper",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "9平台音频保存",
      description: "9平台歌曲、喜马拉雅、蜻蜓、荔枝、音悦台保存软件",
      link: "https://lanzoui.com/i7t5iba",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "水印管家",
      description: "一款专业的图片和视频去水印/加水印软件",
      link: "https://www.apowersoft.cn/online-watermark-remover",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "腾讯视频格式转换器",
      description: "将腾讯的加密QLV格式视频转换为任意可播放的格式",
      link: "https://molipan.lanzoui.com/icjcYkyryte",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "爱奇艺视频格式转换器",
      description: "将爱奇艺的加密QSV格式视频转换为任意可播放的格式",
      link: "https://molipan.lanzoui.com/iCKpkkyryyj",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "分屏助手",
      description: "Windows端的屏幕分屏助手，一个显示器分成多个屏幕使用",
      link: "https://ziyuanhuishequ.lanzouw.com/i8lQBx7k79g",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "致美化",
      description: "专业的桌面美化平台，个性化你的设备，从这里开始！",
      link: "https://zhutix.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "压缩宝",
      description: "一款文件压缩软件",
      link: "https://www.apowersoft.cn/compress-file-online",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Lively Wallpaper",
      description: "开源且免费的视频桌面",
      link: "https://github.com/rocksdanister/lively",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "人工桌面",
      description: "Windows桌面动态壁纸软件，凭借内置的3D少女动画，俘获粉丝几十万，可爱的鹿鸣小姐姐等你唤醒~",
      link: "https://n0va.mihoyo.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "f.lux",
      description: "电脑护眼神器，自动调整屏幕色温亮度",
      link: "https://justgetflux.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "BitDock",
      description: "BitDock比特工具栏，支持Mac的工具栏样式",
      link: "http://www.bitdock.cn/bbs/forum.php",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "HEIC图片转换器",
      description: "一款高效的HEIC图片转换器",
      link: "https://www.apowersoft.cn/heic-to-jpg",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "人脸融合",
      description: "一款将两个人的脸完美融合，并生成新的脸的软件，由百度提供的技术",
      link: "https://ziyuanhuishequ.lanzoui.com/iMbyou78n6j",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "截屏王",
      description: "一款多功能截图软件，轻松实现屏幕截取、编辑",
      link: "https://www.apowersoft.cn/free-screen-capture",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Vcs Core",
      description: "电脑端的变声器，特别版本！",
      link: "https://www.yuque.com/docs/share/5f3d40f1-8904-46ee-a115-ec42b6db6e73",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "美硕音频",
      description: "一键变声软件，特别版本！",
      link: "https://www.yuque.com/docs/share/edea3b14-1f30-4ef7-ae82-b69b27ed8434",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "JPEGmini",
      description: "一款无损压缩图片的工具",
      link: "http://www.jpegmini.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "微PE工具箱",
      description: "一个集成多种系统修复工具的U盘启动工具、Win iSO镜像，类似Ultimate Boot CD",
      link: "https://www.wepe.com.cn/download.html",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "极速浏览器",
      description: "极速浏览器网站",
      link: "https://tsbrowser.xiangtatech.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "智图",
      description: "一个高效优质的图片优化平台",
      link: "https://zhitu.isux.us",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "图吧工具箱",
      description: "DIY爱好者的必备工具合集",
      link: "http://www.tbtool.cn",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "极速图片压缩器",
      description: "一个压缩速度极快的桌面端图片压缩软件",
      link: "https://www.ticompressor.com/online",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "IrfanView",
      description: "一款超级强大且小巧的看图软件",
      link: "https://www.irfanview.com",
      categoryNames: ["windows-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // mac 软件
    {
      title: "Awesome Mac",
      description: "收集各种类别非常好用的Mac应用程序、软件以及工具",
      link: "http://wangchujiang.com/awesome-mac/index.zh.html",
      categoryNames: ["mac-software"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Awesome macOS",
      description: "精选的macOS应用程序，软件，工具和出色产品清单",
      link: "https://github.com/iCHAIT/awesome-macOS",
      categoryNames: ["mac-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "IINA",
      description: "Mac上比较好用的免费开源视频播放器",
      link: "https://iina.io",
      categoryNames: ["mac-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 安卓软件
    {
      title: "ReXdll",
      description: "国内可访问的国外Android软件下载网站，特别版本！",
      link: "https://rexdl.com",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "海阔视界",
      description: "一个支持运行各种规则的浏览器，社区活跃，功能非常强大且丰富，什么在线搜索资源、免费看电影等等杠杠的！",
      link: "https://haikuo.lanzouq.com/u/GoldRiver",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Kiwi Browser",
      description: "一款开源的支持安装Chrome扩展插件，油猴脚本的安卓浏览器",
      link: "https://github.com/kiwibrowser/src/releases/tag/1019022375",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AdGuard",
      description: "提取码：4pgr，Adguard安卓版去广告大杀器，无需ROOT权限，可拦截所有应用和浏览器的广告",
      link: "https://soso.lanzous.com/b00ob0dwb",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Fake Location",
      description: "一款可以实现自由定位的手机app，支持和很多种软件一起使用，比如钉钉、微信等，免费版已够用",
      link: "http://lerist.net/fakelocation",
      categoryNames: ["android-software"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Tiktok特别版",
      description: "国内无任何限制使用抖音海外版TikTok，并且支持切换地区，下载无水印视频！",
      link: "https://423down.lanzouo.com/b0f199a5a",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "万能去水印",
      description: "（pojie版）Android端去水印软件，支持短视频去水印，视频硬去水印",
      link: "https://yiguotang.lanzoux.com/icrtddzhs3g",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "语音文字互转",
      description: "一款语音转文字，文字转语音的安卓app",
      link: "https://pan.lanzoux.com/b03ba9uih",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "变声器",
      description: "Android版的变声器，高级会员版！",
      link: "https://www.yuque.com/docs/share/1bc29a14-059f-43dc-9229-413c37b0f1bf",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "WIFI万能钥匙显密版",
      description: "（内含电脑版）一个屏蔽了WIFI万能钥匙广告，直接显示WIFI密码版本的WIFI万能钥匙",
      link: "https://afengkeji.lanzoui.com/b0d2i19yd",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "喵惠助手",
      description: "一款可以辅助完成各种双十一活动，以及日常抢购、薅羊毛等活动的app",
      link: "https://ziyuanhuishequ.lanzoui.com/iyw89vn55aj",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小影剪辑",
      description: "一款超实用的视频剪辑工具",
      link: "https://www.xiaoying.tv",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "椒盐音乐",
      description: "一个安卓本地音乐播放器",
      link: "https://moriafly.xyz/HiMoriafly/docs/salt-player",
      categoryNames: ["android-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // ios 软件
    {
      title: "爱思助手",
      description: "iOS设备辅助工具，包括数据传输、备份、铃声导入、刷机越狱、付费应用下载",
      link: "https://www.i4.cn",
      categoryNames: ["ios-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "iPhone虚拟定位",
      description: "无需越狱即可将苹果设备定位到任意地点，足不出户就能让朋友圈、微博等内容显示到想要的位置",
      link: "https://www.i4.cn/news_detail_31175.html",
      categoryNames: ["ios-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "鲜面连线",
      description: "苹果iOS的每日精品限免、促销应用推荐",
      link: "https://app.so/xianmian",
      categoryNames: ["ios-software"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "香色闺阁",
      description: "一款iOS端支持换源的小说、漫画、听书、听歌、电影、电视剧开源软件，免费看小说、漫画、听书、听歌、电影的神器",
      link: "https://apps.apple.com/cn/app/id1521205149",
      categoryNames: ["ios-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "GM浏览器",
      description: "一款免费的iOS浏览器，内置音频和视频嗅探下载功能，并且支持m3u8和ts视频流",
      link: "https://apps.apple.com/cn/app/id1448335477",
      categoryNames: ["ios-software"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 游戏资源
    {
      title: "Crazy Games",
      description: "免费的在线游戏网站，游戏质量都非常高，而且没有恶劣的广告，值得推荐！",
      link: "https://www.crazygames.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "133游戏库",
      description: "全球最大的游戏下载中心-专注于单机游戏分享！",
      link: "https://www.133game.net",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小叽资源",
      description: "一个免费分享各种游戏的下载网站，让你免费白嫖各种游戏",
      link: "https://steamzg.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Switch520",
      description: "是一个专门免费白嫖Switch游戏的网站，提供了各种各样的Switch专属游戏",
      link: "https://xxxxx520.com",
      categoryNames: ["game"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Byrut",
      description: "俄罗斯PJ游戏免费下载网站，基本上是把steam中的游戏全搬过来了",
      link: "https://byrut.org",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "GBT小组游戏空间",
      description: "老牌的优质游戏下载源",
      link: "http://gbtgame.ys168.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "盖伦下载器",
      description: "内置几十T左右的游戏，利用下载器快速下载",
      link: "http://115.236.47.204:8000",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "3DM GAME",
      description: "免费的游戏下载论坛",
      link: "https://bbs.3dmgame.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "悪魔の小站",
      description: "一些免费的游戏压制",
      link: "http://www.mubolin.cn:99/games",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "猿猴森林",
      description: "2000款单机游戏免费下载",
      link: "https://www.iapp.wiki",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "FreeROMS",
      description: "一个提供经典街机模拟器ROM的网站",
      link: "http://www.freeroms.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Steam++",
      description: "一个包含 多种 Steam 工具功能的工具箱，比如：游戏加速、插件、库存管理、令牌管理等等",
      link: "https://steampp.net",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "葫芦侠",
      description: "免费的Android游戏修改神器，并且内置海量游戏下载",
      link: "http://www.huluxia.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "骑士下载",
      description: "安卓游戏手机助手，提供大量pojie游戏和无限金币手机游戏",
      link: "http://www.vqs.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "爱吾游戏",
      description: "上万款安卓pojie游戏下载",
      link: "https://www.25game.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "TapTap",
      description: "推荐高质量好玩的手机游戏",
      link: "https://www.taptap.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "网易云游戏",
      description: "网易游戏推出的云游戏服务平台，通过平台的云游戏技术和服务器资源让玩家畅玩游戏，还有云手机和云电脑免费体验",
      link: "https://cg.163.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "畅玩空间",
      description: "怀旧云游戏平台，搭载：街机、FC、GBA、MD",
      link: "https://www.wo1wan.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "腾讯云游戏",
      description: "START是腾讯面向未来的跨终端游戏平台，通过云游戏让你在电视、手机、电脑等任何设备随时可",
      link: "https://start.qq.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "LOL鼠标练习",
      description: "一个LOL鼠标操作练习网站，游戏玩的6不6，就看练习够不够😂",
      link: "https://loldodgegame.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "在线打台球",
      description: "一个在线用鼠标和键盘打台球的网站",
      link: "http://www.heyzxz.me/pcol",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "红狼游戏网",
      description: "国人自制游戏发布分享平台",
      link: "http://www.kdsrpg.com/index.php",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "叽哩叽哩游戏网ACG",
      description: "G站，为ACG爱好者提供最新最好玩的ACG资源下载",
      link: "https://www.jiligamefun.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小霸王——其乐无穷",
      description: "一个让你爷青回的小游戏网站,里面包含了上百个经典小游戏",
      link: "https://www.yikm.net",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "小霸王-在线玩",
      description: "一个经典游戏、复古游戏、在线即玩网站",
      link: "https://www.wexyx.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "游侠网",
      description: "一个国内外单机游戏下载网站",
      link: "https://www.ali213.net",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Poki",
      description: "拥有最好的在线游戏选择，提供了最有趣的游戏体验",
      link: "https://poki.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "科学主题小游戏合集-TestTubeGames",
      description: "一个制作并发布了多款科学主题的小游戏，在玩的过程中，让你了解到关于原子、分子、重力、相对论、进化论等等科学知识",
      link: "https://www.testtubegames.com",
      categoryNames: ["game"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // chatgpt
    // 聊天 ai
    {
      title: "GPT4.0+Mj绘画中文站",
      description: "支持GPT3.5、GPT4.0、Claude多个大模型及MidJourney绘画，强大到超出你想象...",
      link: "https://aiplus.pw",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ChatGPT",
      description: "一个由美国OpenAI研发的聊天机器人程序",
      link: "https://chat.openai.com/auth/login",
      categoryNames: ["chat-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "文心一言",
      description: "百度全新一代知识增强大语言模型",
      link: "https://yiyan.baidu.com/welcome",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Copy.ai",
      description: "一个基于AI人工智能的文章写作助手",
      link: "https://www.copy.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "讯飞星火",
      description: "一个认知大模型，是由科大讯飞自主研发，基于讯飞最新的认知智能大模型技术",
      link: "https://xinghuo.xfyun.cn/desk",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Rytr",
      description: "一个AI写作助手",
      link: "https://rytr.me",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Grammarly",
      description: "一款在线语法纠正和校对工具",
      link: "https://app.grammarly.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Notion Ai",
      description: "个人觉得仅次于OneNote的笔记软件，个人用户免费",
      link: "https://www.notion.so/product/ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "QuillBot",
      description: "一个AI论文写作润色工具",
      link: "https://quillbot.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "火山写作",
      description: "字节跳动旗下团队推出的免费Al写作助手",
      link: "https://www.writingo.net/home",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "DeepL Write",
      description: "一个人工智能驱动的写作助手网站",
      link: "https://www.deepl.com/write",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "NovelAI",
      description: "一款基于人工智能的AI创作辅助工具",
      link: "https://novelai.net",
      categoryNames: ["chat-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Bearly",
      description: "人工智能工具，可以让你的工作效率提升10倍",
      link: "https://bearly.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "奇妙文",
      description: "一款由出门问问科技有限公司开发的AI智能写作助手",
      link: "https://wen.mobvoi.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "魔撰写作",
      description: "一款AI智能写作工具",
      link: "https://x.moyin.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "有道写作",
      description: "网易有道出品的智能英文写作修改和润色工具",
      link: "https://write.youdao.com/#/homepage",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Cohesive",
      description: "一个人工智能文案内容创作和编辑工具",
      link: "https://cohesive.so",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "万彩AI",
      description: "🔥提供AI自动短视频生成、AI智能写作、AI换脸和照片数字人生成等多种AI功能！",
      link: "https://ai.kezhan365.com/inviteCode/rk5W83",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Moonbeam",
      description: "一个长文章Al内容创作助手",
      link: "https://www.gomoonbeam.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PepperType AI",
      description: "一个基于人工智能的AI写作文章生成工具",
      link: "https://www.peppercontent.io",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Effidit",
      description: "腾讯智能创作助手 Efficient and Intelligent Editing",
      link: "https://effidit.qq.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "悉语",
      description: "阿里旗下智能文案工具，一键生成电商营销文案",
      link: "https://chuangyi.taobao.com/pages/aiCopy",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: false
    },
    {
      title: "Spell.tools",
      description: "一个高颜值AI内容营销创作工具",
      link: "https://spell.tools",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "火龙果智能写作",
      description: "一个Al驱动的文字生产力工具",
      link: "https://www.mypitaya.com/#home",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "HeyFriday",
      description: "一个人工智能AI写作工具",
      link: "https://www.heyfriday.cn/home",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "爱改写",
      description: "一款在线AI内容创作工具",
      link: "https://www.aigaixie.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "易撰",
      description: "一个新媒体AI内容创作助手",
      link: "https://www.yizhuan5.com/work.html#1-4",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Giiso写作机器人",
      description: "一款内容创作AI辅助工具,",
      link: "https://www.giiso.com/#",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "创作王",
      description: "一款功能强大的AI智能创作软件",
      link: "https://aiapp.cc/login",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "字符狂飙——WordFury",
      description: "一款基于人工智能技术的文档生成应用",
      link: "https://vgoapp.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "讯飞智检",
      description: "讯飞推出的智能写作SaaS工具，支持智能写作后的校对与合规审核",
      link: "https://zj.xfyun.cn/exam/text",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "5118",
      description: "一个SEOer必备的站长工具平台",
      link: "https://www.5118.com/ai/articlegenius",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ContentBot",
      description: "一个使用GPT-3技术的人工智能写作工具",
      link: "https://contentbot.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Texta",
      description: "一个AI博客和文章一键生成网站",
      link: "https://texta.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Sudowrite",
      description: "一个基于人工智能的AI写作文章生成工具",
      link: "https://www.sudowrite.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "快文CopyDone",
      description: "一款AI原创营销文案写作神器",
      link: "https://copyai.cn",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Compose Al",
      description: "一个免费的Chrome浏览器自动化写作扩展",
      link: "https://www.compose.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AI帮个忙",
      description: "一个ai智能创作工具",
      link: "https://aibang.run",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Yaara",
      description: "一个ai人工智能写作工具网站",
      link: "https://www.yaara.ai",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "思默问答",
      description: "一个在线人工智能原创文章生成器",
      link: "https://www.sitesmo.com",
      categoryNames: ["chat-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    // 图像 ai
    {
      title: "Midjourney",
      description: "一个AI绘画工具",
      link: "https://midjourney.com/home",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Stable Diffusion",
      description: "Stability AI推出的文本到图像生成AI网站",
      link: "https://stablediffusionweb.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "DreamStudio",
      description: "由Stability Al推出的文本到图像生成AI工具",
      link: "https://beta.dreamstudio.ai/generate",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Bing lmage Creator",
      description: "一个由微软上线基于文字生成图像服务",
      link: "https://bing.com/create",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "标小智",
      description: "一个智能LOGO设计生成器",
      link: "https://www.logosc.cn",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Upscayl",
      description: "一个免费开源的AI图片无损放大工具",
      link: "https://www.upscayl.org",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Ribbet.ai",
      description: "一个AI图片处理工具箱",
      link: "https://ribbet.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "remove.bg",
      description: "AI在线自动抠图，无限使用，免费版只能下载2500像素以内的结果图",
      link: "https://www.remove.bg/zh",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ARC",
      description: "腾讯旗下ARC实验室推出的AI图片处理工具",
      link: "https://arc.tencent.com/zh/ai-demos/faceRestoration",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "文心一格",
      description: "一个AI艺术和创意辅助平台",
      link: "https://yige.baidu.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PhotoRoom",
      description: "免费的AI图片背景移除和添加",
      link: "https://www.photoroom.com/background-remover",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AI画匠",
      description: "创客贴推出的AI艺术画生成工具",
      link: "https://aiart.chuangkit.com/landingpage",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Adobe Firefly",
      description: "Adobe最新推出的AI图片生成工具",
      link: "https://www.adobe.com/sensei/generative-ai/firefly.html",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "6pen Art",
      description: "面包多团队推出的从文本描述生成绘画艺术作品",
      link: "https://6pen.art",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "造梦日记",
      description: "一款AI绘画工具,覆盖多模态模型训练和图像生成",
      link: "https://www.printidea.art",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "美图AI创作工具",
      description: "美图推出的AI文本生成图片的工具",
      link: "https://account.meitu.com/#!/login/sms",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "画宇宙",
      description: "人工智能 AI 作画网站",
      link: "https://creator.nolibox.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "天工巧绘SkyPaint",
      description: "免费的AI插画绘制工具，由昆仑万维与奇点智源合作推出",
      link: "https://sky-paint.singularity-ai.com/index.html#",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Leonardo.ai",
      description: "一个Ai创建游戏素材网站",
      link: "https://leonardo.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "稿定抠图",
      description: "稿定在线一键AI抠图，证件照换背景工具",
      link: "https://koutu.gaoding.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Stockimg.Al",
      description: "一个AI生成各种类型的图像和插画网站",
      link: "https://stockimg.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "美图抠图",
      description: "美图秀秀推出的AI智能抠图工具，一键移除背景",
      link: "https://cutout.meitu.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "ClipDrop免费AI抠图",
      description: "一个免费的AI抠图神器，一键抠图，抠图效果非常完美，发丝级别的抠图！",
      link: "https://clipdrop.co",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "MagicStudio",
      description: "高颜值AI图像处理工具",
      link: "https://magicstudio.com/zh",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Booltool",
      description: "在线AI图像工具箱",
      link: "https://booltool.boolv.tech/home",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Skybox Al",
      description: "一个AI生成和合成360°全景图像插画网站",
      link: "https://skybox.blockadelabs.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Cutout.Pro",
      description: "一个AI在线处理图片网站",
      link: "https://www.cutout.pro",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Graviti Diffus",
      description: "开箱即用的 Stable Diffusion WebUl 在线图像生成服务",
      link: "https://www.diffus.graviti.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "AI万能图片编辑器",
      description: "一个万能的在线图片编辑器",
      link: "https://img.logosc.cn",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "悟空图像PhotoSir",
      description: "一款智能好用的专业图像处理软件",
      link: "https://www.photosir.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "DrawDraw秘塔捉捉猫",
      description: "秘塔写作猫推出的AI文字到图像生成工具",
      link: "https://drawdraw.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "言之画",
      description: "由出门问问推出的AI图像内容创作平台",
      link: "https://paint.mobvoi.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Facet",
      description: "AI图片修图和优化工具",
      link: "https://facet.ai",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Hotpot.ai",
      description: "AI图片图像处理和生成工具",
      link: "https://hotpot.ai",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "DeepAI",
      description: "在线AI图片生成和编辑",
      link: "https://deepai.org",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Hama",
      description: "免费在线抠图工具",
      link: "https://www.hama.app/zh",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "BigJPG",
      description: "AI人工智能图片无损放大工具",
      link: "https://bigjpg.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "FlagStudio",
      description: "智源研究院推出的AI文本图像绘画生成工具",
      link: "https://flagstudio.baai.ac.cn",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "NightCafe",
      description: "AI艺术插画在线生成",
      link: "https://nightcafe.studio",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "niji · journey",
      description: "魔法般的二次元绘画生成网站",
      link: "https://nijijourney.com/en",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Deep Dream Generator",
      description: "AI创建生成梦幻般的插画图片，刻画你的梦中场景",
      link: "https://deepdreamgenerator.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "无限画",
      description: "千库网推出的AI图片插画生成工具",
      link: "https://588ku.com/ai/wuxianhua/Home",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Blue Willow",
      description: "免费的AI图像艺术画生成工具",
      link: "https://www.bluewillow.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Waifu Labs",
      description: "免费在线AI生成二次元动漫头像",
      link: "https://waifulabs.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "dreamlike.art",
      description: "免费在线插画生成工具",
      link: "https://dreamlike.art",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "tiamat",
      description: "AI艺术画生成工具",
      link: "https://www.tiamat.world",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Artbreeder",
      description: "在线图片合成工具，通过AI将多张图自动合成为一张，创意无限！",
      link: "https://www.artbreeder.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Vega Al",
      description: "在线免费AI插画创作平台，支持文生图，图生图，条件生图等多种绘画模式",
      link: "https://rightbrain.art",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: false
    },
    {
      title: "Wepik Al",
      description: "Freepik推出的AI文本到图像的在线生成工具",
      link: "https://wepik.com/ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Craiyon",
      description: "免费在线文本到图像生成",
      link: "https://www.craiyon.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Profile Picture AI",
      description: "一个超强的头像生成器",
      link: "https://www.profilepicture.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pixela AI",
      description: "一个可人工智能生成的游戏纹理的网站",
      link: "https://pixela.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "万兴爱画",
      description: "一个AI生成艺术创意灵感平台",
      link: "https://aigc.wondershare.cn",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Photosonic",
      description: "Writesonic推出的AI艺术插画生成工具",
      link: "https://writesonic.com/photosonic-ai-art-generator",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Astria",
      description: "可定制的人工智能图像生成",
      link: "https://www.astria.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "getimg.ai",
      description: "在线AI图像和插画创作工具",
      link: "https://getimg.ai",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "DreamUp",
      description: "DeviantArt推出的AI插画生成工具",
      link: "https://www.dreamup.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Scribble Diffusion",
      description: "一个将草图转变为精美的插画网站",
      link: "https://scribblediffusion.com",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Lexica",
      description: "一个基于Stable Diffusion的在线插画生成网站",
      link: "https://lexica.art",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Generated Photos",
      description: "AI人脸头像生成工具",
      link: "https://generated.photos",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Picsart AI",
      description: "Picsart推出的AI图片生成器",
      link: "https://picsart.com/ai-image-generator",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Imagine by Magic Studio",
      description: "一个AI文字到图片生成网站",
      link: "https://magicstudio.com/zh/imagine",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "神采",
      description: "AI生成创意插画",
      link: "https://www.promeai.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "neural.love",
      description: "AI艺术图片生成",
      link: "https://neural.love",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "cons8 Background Remover",
      description: "lcons8出品的免费图片背景移除工具",
      link: "https://igoutu.cn/bgremover",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Erase.bg",
      description: "在线抠图和去除图片背景",
      link: "https://www.erase.bg/zh",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "GoProd",
      description: "lcons8推出的智能图片背景移除和无损放大二合一Mac应用",
      link: "https://icons8.com/goprod",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Removal.Al",
      description: "AI图片背景移除工具",
      link: "https://removal.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Background Eraser",
      description: "AI自动删除图片背景",
      link: "https://magicstudio.com/zh/backgrounderaser",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Slazzer",
      description: "免费在线抠除图片背景",
      link: "https://www.slazzer.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "BGremover",
      description: "Vance AI推出的图片背景移除工具",
      link: "https://bgremover.vanceai.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Quicktools Background Remover",
      description: "Picsart旗下的Quicktools推出的图片背景移除工具",
      link: "https://tools.picsart.com/image/background-remover",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Zyro Al Background Remover",
      description: "Zyro推出的AI图片背景移除工具",
      link: "https://zyro.com/tools/image-background-remover",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PhotoScissors",
      description: "免费自动图片背景去除",
      link: "https://photoscissors.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "一键抠图",
      description: "在线一键抠图换背景网站",
      link: "https://www.yijiankoutu.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Stylized",
      description: "AI产品图背景替换",
      link: "https://www.stylized.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pebblely",
      description: "AI产品图精美背景添加",
      link: "https://pebblely.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Mokker AI",
      description: "AI产品图添加背景",
      link: "https://mokker.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "booth.ai",
      description: "高质量AI产品展示效果图生成",
      link: "https://www.booth.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pixelcut",
      description: "AI产品背景移除和替换",
      link: "https://www.pixelcut.ai",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Let's Enhance",
      description: "AI在线免费放大图片并保持图像质量",
      link: "https://letsenhance.io",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Img.Upscaler",
      description: "免费的AI图片放大工具",
      link: "https://imgupscaler.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Fotor Al lmage Upscaler",
      description: "Fotor推出的AI图片放大工具",
      link: "https://www.fotor.com/image-upscaler",
      categoryNames: ["image-ai"],
      normalAvailable: false,
      vpnAvailable: true
    },
    {
      title: "Zyro Al lmage Upscaler",
      description: "Zyro出品的人工智能图片放大工具",
      link: "https://zyro.com/tools/image-upscaler",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Media.io Al lmage Upscaler",
      description: "Media.io推出的AI图片放大工具",
      link: "https://www.media.io/image-upscaler.html",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Upscale.media",
      description: "AI图片放大和分辨率修改",
      link: "https://www.upscale.media/zh",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Nero lmage Upscaler",
      description: "AI免费图片无损放大",
      link: "https://ai.nero.com/image-upscaler",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "VanceAl lmage Resizer",
      description: "VanceAI推出的在线图片尺寸调整工具",
      link: "https://vanceai.com/image-resizer",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "PhotoAid lmage Upscaler",
      description: "PhotoAid出品的免费在线人工智能图片放大工具",
      link: "https://photoaid.com/en/tools/ai-image-enlarger",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Upscalepics",
      description: "在线图片放大工具",
      link: "https://upscalepics.com",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "lmage Enlarger",
      description: "AI无损放大图片",
      link: "https://magicstudio.com/zh/enlarger",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    },
    {
      title: "Pixelhunter",
      description: "一个AI智能调整图片尺寸用于社交媒体平台发帖的网站",
      link: "https://pixelhunter.io",
      categoryNames: ["image-ai"],
      normalAvailable: true,
      vpnAvailable: true
    }
    // 其他 ai
  ];
  const Redirector = (props) => {
    const navigate = reactRouterDom.useNavigate();
    React.useEffect(() => {
      navigate(props.redirectPath || RoutePaths.NotFound);
    }, [navigate]);
    return null;
  };
  Redirector.displayName = "Redirector";
  const SiteList = (props) => {
    const { categoriesNames } = props;
    const currentSites = React.useMemo(() => {
      return sites.filter((site) => (site.normalAvailable || site.vpnAvailable) && categoriesNames.some((categoryName) => site.categoryNames.includes(categoryName)));
    }, [categoriesNames]);
    return jsxRuntimeExports.jsx(antd.Row, { gutter: [16, 16], children: currentSites.map((site) => {
      return jsxRuntimeExports.jsx(antd.Col, { span: 24, md: 12, xxl: 8, children: jsxRuntimeExports.jsxs(antd.Card, { title: site.title, extra: jsxRuntimeExports.jsx(antd.Badge, { size: "small", color: "red", count: !site.normalAvailable && site.vpnAvailable ? "VPN" : "", children: jsxRuntimeExports.jsx(antd.Button, { shape: "round", type: "primary", href: site.link, target: "_blank", children: "访问" }) }), style: {
        height: "100%"
      }, children: [jsxRuntimeExports.jsx("p", { children: site.description }), jsxRuntimeExports.jsx("a", { href: site.link, target: "_blank", rel: "noreferrer", children: site.link })] }) }, site.link);
    }) });
  };
  SiteList.displayName = "SiteList";
  const SiteNavigation = () => {
    var _a;
    const siderBarConfig = React.useMemo(() => {
      return categories$1.map((category) => {
        return {
          title: category.title,
          routePath: `${RoutePaths.SiteNavigation}/${category.name}`,
          subSiderBarItems: category.subCategories.map((subCategory) => ({
            title: subCategory.title,
            routePath: `${RoutePaths.SiteNavigation}/${category.name}/${subCategory.name}`
          }))
        };
      });
    }, []);
    const location2 = reactRouter.useLocation();
    const currentSubCategoryName = React.useMemo(() => {
      const pathParts = location2.pathname.split("/");
      return pathParts[3];
    }, [location2.pathname]);
    const { siderMenuProps, selectedSiderBarItemKey } = useSiderBar({
      siderBarRoutePath: RoutePaths.SiteNavigation,
      sideBarConfig: siderBarConfig,
      defaultExpandedAll: true
    });
    const firstAppRoutePath = (_a = siderBarConfig == null ? void 0 : siderBarConfig[0]) == null ? void 0 : _a.routePath;
    const indexRedirectPath = selectedSiderBarItemKey ? selectedSiderBarItemKey : firstAppRoutePath;
    return jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: indexRedirectPath ? jsxRuntimeExports.jsx(Redirector, { redirectPath: indexRedirectPath }) : null }), categories$1.map((category) => {
      return jsxRuntimeExports.jsx(reactRouter.Route, { path: category.name + "/*", element: jsxRuntimeExports.jsx(SideBarLayout, { siderBarMenuProps: siderMenuProps, children: jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: jsxRuntimeExports.jsx(Redirector, { redirectPath: `${RoutePaths.SiteNavigation}/${category.name}/${category.subCategories[0].name}` }) }), category.subCategories.map((subCategory) => {
        return jsxRuntimeExports.jsx(reactRouter.Route, { path: subCategory.name, element: jsxRuntimeExports.jsx(SiteList, { categoriesNames: [currentSubCategoryName] }) }, subCategory.name);
      })] }) }) }, category.name);
    })] });
  };
  SiteNavigation.displayName = "SiteNavigation";
  const DEFAULT_GM_API_NAMESPACE = "__NICE_SCRIPTS_GM_API__";
  const initGMApi = (gmApi, namespace = DEFAULT_GM_API_NAMESPACE) => {
    if (!gmApi.unsafeWindow) {
      throw new Error("initGMApi unsafeWindow is required");
    }
    if (!self.document.__UNSAFE_WINDOW__) {
      self.document.__UNSAFE_WINDOW__ = gmApi.unsafeWindow;
    }
    const win = self.document.__UNSAFE_WINDOW__;
    if (!(win == null ? void 0 : win[namespace])) {
      win[namespace] = gmApi;
      return;
    }
    Object.entries(gmApi).forEach(([key, value]) => {
      if ((!win[namespace])[key]) {
        win[namespace][key] = value;
      }
    });
  };
  const getGMApi = (namespace = DEFAULT_GM_API_NAMESPACE) => {
    const win = self.document.__UNSAFE_WINDOW__;
    if (!(win == null ? void 0 : win[namespace])) {
      console.warn("GM API is not initialized");
    }
    return (win == null ? void 0 : win[namespace]) || {};
  };
  const isLinkAccessible = async (url) => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        // 使用 HEAD 方法只获取 headers，不下载整个资源
        mode: "no-cors"
        // 尝试在没有 CORS 的情况下获取资源（可能受到限制）
      });
      return response.ok;
    } catch (error) {
      console.error(`Error checking link accessibility: ${error}`);
      return false;
    }
  };
  const isFullscreen = (win = window) => {
    return Boolean(win.document.fullscreenElement || // @ts-ignore
    win.document.webkitFullscreenElement || // @ts-ignore
    win.document.mozFullScreenElement || // @ts-ignore
    win.document.msFullscreenElement);
  };
  const getUnsafeWindow = (defaultWindow = window, namespace = DEFAULT_GM_API_NAMESPACE) => {
    return getGMApi(namespace).unsafeWindow || defaultWindow;
  };
  class GMStorage {
    constructor(namespace = DEFAULT_GM_API_NAMESPACE) {
      this.setItem = (key, value) => {
        var _a, _b;
        return (_b = (_a = this.gmApi).GM_setValue) == null ? void 0 : _b.call(_a, key, value);
      };
      this.getItem = (key, defaultValue) => {
        var _a, _b;
        return ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_getValue) == null ? void 0 : _b.call(_a, key, defaultValue)) ?? defaultValue ?? null;
      };
      this.removeItem = (key) => {
        var _a, _b;
        (_b = (_a = this.gmApi) == null ? void 0 : _a.GM_deleteValue) == null ? void 0 : _b.call(_a, key);
      };
      this.key = (index) => {
        var _a, _b;
        const keys = ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) || [];
        return index < keys.length ? keys[index] : null;
      };
      this.clear = () => {
        var _a, _b;
        const keys = ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) || [];
        keys.forEach((key) => {
          var _a2, _b2;
          (_b2 = (_a2 = this.gmApi) == null ? void 0 : _a2.GM_deleteValue) == null ? void 0 : _b2.call(_a2, key);
        });
      };
      this.namespace = namespace;
    }
    get gmApi() {
      return getGMApi(this.namespace);
    }
    // Get the number of stored items
    get length() {
      var _a, _b, _c;
      return ((_c = (_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.length) || 0;
    }
  }
  const initJsmGMApi = (gmApi) => {
    return initGMApi(gmApi, JSM_GM_API_NAMESPACE);
  };
  const getJsmUnsafeWindow = () => {
    return getUnsafeWindow(window, JSM_GM_API_NAMESPACE);
  };
  const jsmGmStorage = new GMStorage(JSM_GM_API_NAMESPACE);
  const getJsmAppConfigsFromWindow = () => {
    if (!document[JSM_APP_CONFIGS]) {
      document[JSM_APP_CONFIGS] = [];
    }
    return document[JSM_APP_CONFIGS];
  };
  const getAppConfigList = () => {
    const appConfigListFromWindow = getJsmAppConfigsFromWindow();
    return appConfigListFromWindow.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  };
  const useAppConfigList = () => {
    const [appConfigList, setAppConfigList] = React.useState(getAppConfigList());
    React.useEffect(() => {
      const updateConfigList = () => {
        const newConfigs = getAppConfigList();
        setAppConfigList(newConfigs);
      };
      getJsmUnsafeWindow().addEventListener(JSM_APP_CONFIG_CHANGE_ARRAY_EVENT_NAME, updateConfigList);
      return () => {
        getJsmUnsafeWindow().removeEventListener(JSM_APP_CONFIG_CHANGE_ARRAY_EVENT_NAME, updateConfigList);
      };
    }, []);
    return appConfigList;
  };
  const COMPONENT_MAP = {
    autocomplete: antd.AutoComplete,
    cascader: antd.Cascader,
    checkbox: antd.Checkbox,
    "checkbox-group": antd.Checkbox.Group,
    "color-picker": antd.ColorPicker,
    "date-picker": antd.DatePicker,
    "date-range-picker": antd.DatePicker.RangePicker,
    input: antd.Input,
    textarea: antd.Input.TextArea,
    password: antd.Input.Password,
    search: antd.Input.Search,
    "input-number": antd.InputNumber,
    radio: antd.Radio,
    "radio-group": antd.Radio.Group,
    select: antd.Select,
    slider: antd.Slider,
    switch: antd.Switch,
    "time-picker": antd.TimePicker,
    "time-range-picker": antd.TimePicker.RangePicker,
    upload: antd.Upload
  };
  const XField = React.memo((props) => {
    const { type, __storageKeyPrefix__, ...rest } = props;
    const Component = COMPONENT_MAP[type];
    React.useMemo(() => __storageKeyPrefix__ + "/" + rest.name, [__storageKeyPrefix__, rest.name]);
    return Component ? jsxRuntimeExports.jsx(Component, { ...rest }) : null;
  });
  XField.displayName = "XField";
  const getFormDefaultValues = ({ initialValues, fields }) => {
    const _defaultValues = { ...initialValues };
    fields.forEach((field) => {
      if (["switch", "checkbox", "radio", "checkbox-group", "radio-group"].includes(field.type)) {
        _defaultValues[field.name] = field.defaultChecked ?? (initialValues == null ? void 0 : initialValues[field.name]);
      } else {
        _defaultValues[field.name] = field.defaultValue ?? (initialValues == null ? void 0 : initialValues[field.name]);
      }
    });
    return _defaultValues;
  };
  function XForm$(props) {
    const { formInstance: formInstanceFromProps, id, initialValues, fields, disabled, showSubmitResultTips = true, onSubmit, onReset, onValuesChange, onFieldsChange, onFinish, onFinishFailed, validateTrigger, validateMessages, __storageKeyPrefix__ } = props;
    const [formInstanceFromState] = antd.Form.useForm();
    const formInstance = formInstanceFromProps || formInstanceFromState;
    const storageKeyPrefix = React.useMemo(() => __storageKeyPrefix__ + "/" + id, [__storageKeyPrefix__, id]);
    const defaultValues = React.useMemo(() => {
      return getFormDefaultValues({
        fields,
        initialValues
      });
    }, [fields, initialValues]);
    const isInitValuesRef = React.useRef(false);
    React.useEffect(() => {
      if (isInitValuesRef.current)
        return;
      isInitValuesRef.current = true;
      const fieldNames = fields.map((field) => field.name);
      const initialValuesToSet = fieldNames.reduce((values, fieldName) => {
        const fieldStorageKey = `${storageKeyPrefix}/${fieldName}`;
        const fieldValue = jsmGmStorage.getItem(fieldStorageKey, defaultValues == null ? void 0 : defaultValues[fieldName]);
        return { ...values, [fieldName]: fieldValue };
      }, {});
      formInstance.setFieldsValue({ ...initialValuesToSet });
    }, [formInstance, fields, defaultValues, storageKeyPrefix]);
    const handleValuesChange = React.useCallback((changedValues, allValues) => {
      onValuesChange == null ? void 0 : onValuesChange(changedValues, allValues);
    }, [onValuesChange]);
    const handleReset = React.useCallback(() => {
      formInstance.resetFields();
      defaultValues && formInstance.setFieldsValue({ ...defaultValues });
      onReset == null ? void 0 : onReset(formInstance);
    }, [onReset, formInstance, defaultValues]);
    const handleFinish = React.useCallback((values) => {
      Object.entries(values).forEach(([fieldName, fieldValue]) => {
        const fieldStorageKey = `${storageKeyPrefix}/${fieldName}`;
        jsmGmStorage.setItem(fieldStorageKey, fieldValue);
      });
      onFinish == null ? void 0 : onFinish(values);
      onSubmit == null ? void 0 : onSubmit(values, formInstance);
      if (!showSubmitResultTips)
        return;
      antd.message.success("保存成功，刷新页面后生效");
    }, [showSubmitResultTips, onFinish, onSubmit, formInstance]);
    const handleFinishFailed = React.useCallback((errorInfo) => {
      onFinishFailed == null ? void 0 : onFinishFailed(errorInfo);
      if (!showSubmitResultTips)
        return;
      antd.message.error("保存失败");
    }, [showSubmitResultTips, onFinishFailed]);
    const getValuePropName = React.useCallback((field) => {
      const { type } = field;
      if (["switch", "checkbox", "radio", "checkbox-group", "radio-group"].includes(type)) {
        return "checked";
      }
      return "value";
    }, []);
    return jsxRuntimeExports.jsxs(antd.Form, { form: formInstance, name: id, labelCol: { span: 10 }, wrapperCol: { span: 14 }, style: { maxWidth: 600 }, disabled, autoComplete: "off", requiredMark: "optional", onFinish: handleFinish, onFinishFailed: handleFinishFailed, onFieldsChange, onValuesChange: handleValuesChange, validateMessages, validateTrigger, children: [fields.map((fieldProps) => {
      const { name, label, description, required, rules, ...otherFieldProps } = fieldProps;
      return jsxRuntimeExports.jsx(antd.Form.Item, { label: label ?? name, name, rules, required, tooltip: description, "data-storage-key": `${storageKeyPrefix}/${name}`, valuePropName: getValuePropName(fieldProps), children: jsxRuntimeExports.jsx(XField, { ...otherFieldProps, __storageKeyPrefix__: storageKeyPrefix }) }, name);
    }), jsxRuntimeExports.jsx(antd.Form.Item, { wrapperCol: { span: 14, offset: 10 }, children: jsxRuntimeExports.jsxs(antd.Space, { children: [jsxRuntimeExports.jsx(antd.Button, { type: "primary", htmlType: "submit", disabled, children: "提交" }), jsxRuntimeExports.jsx(antd.Button, { htmlType: "button", onClick: handleReset, disabled, children: "重置" })] }) })] });
  }
  const XForm = React.memo(XForm$);
  XForm$.displayName = "XForm";
  const isMatchSite = (matcher, siteUrl = window.location.href) => {
    const siteMatch = typeof matcher === "string" || matcher instanceof RegExp ? [matcher] : matcher;
    if (!siteMatch)
      return true;
    return siteMatch.some((site) => siteUrl.match(site));
  };
  const { Title: Title$1, Paragraph: Paragraph$2 } = antd.Typography;
  function XConfigPage$(props) {
    const { id, title, forms, view, __storageKeyPrefix__, onlyShowMatchedSite } = props;
    const finalForms = onlyShowMatchedSite ? forms == null ? void 0 : forms.filter((form) => form.siteMatchers.some((matcher) => isMatchSite(matcher, self.location.href))) : forms;
    return jsxRuntimeExports.jsxs(antd.Typography, { children: [jsxRuntimeExports.jsx(Title$1, { level: 2, children: title }), (finalForms == null ? void 0 : finalForms.length) ? finalForms.map((form, i) => jsxRuntimeExports.jsxs(React.Fragment, { children: [form.title ? jsxRuntimeExports.jsx(Title$1, { level: 3, children: form.title }) : null, jsxRuntimeExports.jsx(Paragraph$2, { children: jsxRuntimeExports.jsx(XForm, { ...form, __storageKeyPrefix__: __storageKeyPrefix__ + "/" + id }) })] }, i)) : jsxRuntimeExports.jsx(antd.Empty, { style: {
      margin: "16px auto"
    } }), view] });
  }
  const XConfigPage = React.memo(XConfigPage$);
  XConfigPage$.displayName = "XConfigPage";
  const { Title, Paragraph: Paragraph$1 } = antd.Typography;
  const ScriptHomePage = React.memo((props) => {
    const { iconUrl, name, description, author, authorAvatarUrl } = props;
    const { isMobile } = useStore();
    return jsxRuntimeExports.jsxs(antd.Typography, { children: [jsxRuntimeExports.jsx(Title, { level: 2, children: "关于" }), jsxRuntimeExports.jsx(Paragraph$1, { children: jsxRuntimeExports.jsxs(antd.Descriptions, { bordered: true, column: 1, labelStyle: {
      width: isMobile ? "80px" : "200px"
    }, children: [jsxRuntimeExports.jsx(antd.Descriptions.Item, { label: "名称", children: jsxRuntimeExports.jsx(Title, { style: {
      marginBottom: "0"
    }, level: 3, children: jsxRuntimeExports.jsxs(antd.Space, { wrap: true, size: 16, children: [jsxRuntimeExports.jsx(antd.Avatar, { shape: "square", size: "large", src: iconUrl, alt: name }), name] }) }) }), jsxRuntimeExports.jsx(antd.Descriptions.Item, { label: "作者", children: jsxRuntimeExports.jsxs(antd.Space, { children: [jsxRuntimeExports.jsx(antd.Avatar, { src: authorAvatarUrl, alt: author }), author] }) }), jsxRuntimeExports.jsx(antd.Descriptions.Item, { label: "描述", children: description })] }) })] });
  });
  ScriptHomePage.displayName = "ScriptHomePage";
  function XConfigApp$(props) {
    const { namespace, pages, emitter, onlyShowMatchedSite, ...scriptHomePageProps } = props;
    const navigate = reactRouterDom.useNavigate();
    const location2 = reactRouterDom.useLocation();
    React.useEffect(() => {
      emitter == null ? void 0 : emitter.emit("mounted");
      return () => {
        emitter == null ? void 0 : emitter.emit("destroyed");
      };
    }, [emitter]);
    React.useEffect(() => {
      const handleGoToPage = (pageId) => {
        navigate(RoutePaths.ScriptsSettingsList + "/" + namespace + "/" + pageId);
      };
      emitter == null ? void 0 : emitter.on("goToPage", handleGoToPage);
      return () => {
        emitter == null ? void 0 : emitter.off("goToPage", handleGoToPage);
      };
    }, [emitter, navigate, namespace]);
    const firstRoutePathPart = React.useMemo(() => {
      return location2.pathname.split("/").slice(0, 2).join("/");
    }, [location2.pathname]);
    return jsxRuntimeExports.jsxs(reactRouterDom.Routes, { children: [jsxRuntimeExports.jsx(reactRouterDom.Route, { index: true, element: jsxRuntimeExports.jsx(Redirector, { redirectPath: firstRoutePathPart + "/" + namespace + "/about" }) }), pages.length ? pages.map((page) => {
      return jsxRuntimeExports.jsx(reactRouterDom.Route, { path: page.id, element: jsxRuntimeExports.jsx(XConfigPage, { ...page, __storageKeyPrefix__: namespace, onlyShowMatchedSite }) }, page.id);
    }) : jsxRuntimeExports.jsx(antd.Empty, { style: {
      margin: "16px auto"
    } }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: "about", element: jsxRuntimeExports.jsx(ScriptHomePage, { ...scriptHomePageProps }) }, "about")] });
  }
  const XConfigApp = XConfigApp$;
  XConfigApp$.displayName = "XConfigApp";
  const AllSiteSettings = (props) => {
    var _a;
    const { siderBarTop } = props;
    const appConfigList = useAppConfigList();
    const siderBarConfig = React.useMemo(() => {
      return appConfigList.map((config) => {
        const appRoutePath = `${RoutePaths.ScriptsSettingsList}/${config.namespace}`;
        return {
          title: config.name,
          routePath: appRoutePath,
          subSiderBarItems: config.pages.map((page) => ({
            title: page.title,
            routePath: `${appRoutePath}/${page.id}`
          })).sort((a, b) => a.title.localeCompare(b.title)).concat([
            {
              title: "关于",
              routePath: `${appRoutePath}/about`
            }
          ])
        };
      });
    }, [appConfigList]);
    const { siderMenuProps, selectedSiderBarItemKey, openSiderBarItemKeys } = useSiderBar({
      siderBarRoutePath: RoutePaths.ScriptsSettingsList,
      sideBarConfig: siderBarConfig
    });
    const firstAppRoutePath = (_a = siderBarConfig == null ? void 0 : siderBarConfig[0]) == null ? void 0 : _a.routePath;
    const indexRedirectPath = selectedSiderBarItemKey ? selectedSiderBarItemKey : firstAppRoutePath;
    return (appConfigList == null ? void 0 : appConfigList.length) ? jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: indexRedirectPath ? jsxRuntimeExports.jsx(Redirector, { redirectPath: indexRedirectPath }) : null }), appConfigList.length ? appConfigList.map((config) => {
      return jsxRuntimeExports.jsx(reactRouter.Route, { path: config.namespace + "/*", element: jsxRuntimeExports.jsx(SideBarLayout, { siderBarTop, siderBarMenuProps: siderMenuProps, children: jsxRuntimeExports.jsx(XConfigApp, { ...config }) }) }, config.namespace);
    }) : null] }) : jsxRuntimeExports.jsx(antd.Empty, { style: {
      margin: "16px auto"
    } });
  };
  AllSiteSettings.displayName = "AllSiteSettings";
  const CurrentSiteSettings = (props) => {
    var _a;
    const { siderBarTop } = props;
    const appConfigList = useAppConfigList();
    const siderBarConfig = React.useMemo(() => {
      const href = self.location.href;
      const configs = [];
      const routePathAppSiderConfigMap = {};
      const routePathPageSiderConfigMap = {};
      const addPageSiderBarConfig = (app, page) => {
        const appRoutePath = `${RoutePaths.ScriptsSettingsList}/${app.namespace}`;
        const pageRoutePath = `${appRoutePath}/${page.id}`;
        let appSiderConfig = routePathAppSiderConfigMap[appRoutePath];
        let pageSiderConfig = routePathPageSiderConfigMap[pageRoutePath];
        if (!appSiderConfig) {
          appSiderConfig = {
            title: app.name,
            routePath: appRoutePath,
            subSiderBarItems: []
          };
          routePathAppSiderConfigMap[appRoutePath] = appSiderConfig;
          configs.push(appSiderConfig);
        }
        if (!pageSiderConfig) {
          pageSiderConfig = {
            title: page.title,
            routePath: pageRoutePath
          };
          routePathPageSiderConfigMap[pageRoutePath] = pageSiderConfig;
          appSiderConfig.subSiderBarItems.push(pageSiderConfig);
        }
      };
      appConfigList.forEach((app) => {
        let isAppMatchSite = false;
        app.pages.forEach((page) => {
          var _a2;
          const isFormMatchSite = (_a2 = page.forms) == null ? void 0 : _a2.some((form) => {
            var _a3;
            return (_a3 = form.siteMatchers) == null ? void 0 : _a3.some((siteMatcher) => isMatchSite(siteMatcher, href));
          });
          if (isFormMatchSite) {
            isAppMatchSite = true;
            addPageSiderBarConfig(app, page);
          }
        });
        if (isAppMatchSite) {
          addPageSiderBarConfig(app, {
            id: "about",
            title: "关于"
          });
        }
      });
      return configs;
    }, [appConfigList]);
    const { siderMenuProps, selectedSiderBarItemKey } = useSiderBar({
      siderBarRoutePath: RoutePaths.ScriptsSettingsList,
      sideBarConfig: siderBarConfig
    });
    const firstAppRoutePath = (_a = siderBarConfig == null ? void 0 : siderBarConfig[0]) == null ? void 0 : _a.routePath;
    const indexRedirectPath = selectedSiderBarItemKey ? selectedSiderBarItemKey : firstAppRoutePath;
    return jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: indexRedirectPath ? jsxRuntimeExports.jsx(Redirector, { redirectPath: indexRedirectPath }) : null }), appConfigList.length ? appConfigList.map((config) => {
      return jsxRuntimeExports.jsx(reactRouter.Route, { path: config.namespace + "/*", element: jsxRuntimeExports.jsx(SideBarLayout, { siderBarTop, siderBarMenuProps: siderMenuProps, children: jsxRuntimeExports.jsx(XConfigApp, { ...config }) }) }, config.namespace);
    }) : null] });
  };
  CurrentSiteSettings.displayName = "CurrentSiteSettings";
  const ScriptsSettingsList = () => {
    const [showAllSiteSettings, setShowAllSiteSettings] = React.useState(true);
    const siderBarTop = React.useMemo(() => {
      return jsxRuntimeExports.jsx(antd.Checkbox, { style: { padding: "10px 10px 0 10px" }, checked: showAllSiteSettings, onChange: (e) => setShowAllSiteSettings(e.target.checked), children: showAllSiteSettings ? "所有网站设置" : "当前网站设置" });
    }, [showAllSiteSettings]);
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllSiteSettings ? jsxRuntimeExports.jsx(AllSiteSettings, { siderBarTop }) : jsxRuntimeExports.jsx(CurrentSiteSettings, { siderBarTop }) });
  };
  ScriptsSettingsList.displayName = "ScriptsSettingsList";
  var IconContext = /* @__PURE__ */ React.createContext({});
  const Context = IconContext;
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit(r, l2) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n2, i, u, a = [], f2 = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l2) {
          if (Object(t) !== t)
            return;
          f2 = false;
        } else
          for (; !(f2 = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f2 = true)
            ;
      } catch (r2) {
        o = true, n2 = r2;
      } finally {
        try {
          if (!f2 && null != t["return"] && (u = t["return"](), Object(u) !== u))
            return;
        } finally {
          if (o)
            throw n2;
        }
      }
      return a;
    }
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n2 = Object.prototype.toString.call(o).slice(8, -1);
    if (n2 === "Object" && o.constructor)
      n2 = o.constructor.name;
    if (n2 === "Map" || n2 === "Set")
      return Array.from(o);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
      return _arrayLikeToArray(o, minLen);
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null)
      return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object")
        return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  var classnames = { exports: {} };
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function(module) {
    (function() {
      var hasOwn = {}.hasOwnProperty;
      function classNames2() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg)
            continue;
          var argType = typeof arg;
          if (argType === "string" || argType === "number") {
            classes.push(arg);
          } else if (Array.isArray(arg)) {
            if (arg.length) {
              var inner = classNames2.apply(null, arg);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (argType === "object") {
            if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
              classes.push(arg.toString());
              continue;
            }
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          }
        }
        return classes.join(" ");
      }
      if (module.exports) {
        classNames2.default = classNames2;
        module.exports = classNames2;
      } else {
        window.classNames = classNames2;
      }
    })();
  })(classnames);
  var classnamesExports = classnames.exports;
  const classNames = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
  function bound01(n2, max) {
    if (isOnePointZero(n2)) {
      n2 = "100%";
    }
    var isPercent = isPercentage(n2);
    n2 = max === 360 ? n2 : Math.min(max, Math.max(0, parseFloat(n2)));
    if (isPercent) {
      n2 = parseInt(String(n2 * max), 10) / 100;
    }
    if (Math.abs(n2 - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n2 = (n2 < 0 ? n2 % max + max : n2 % max) / parseFloat(String(max));
    } else {
      n2 = n2 % max / parseFloat(String(max));
    }
    return n2;
  }
  function isOnePointZero(n2) {
    return typeof n2 === "string" && n2.indexOf(".") !== -1 && parseFloat(n2) === 1;
  }
  function isPercentage(n2) {
    return typeof n2 === "string" && n2.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n2) {
    if (n2 <= 1) {
      return "".concat(Number(n2) * 100, "%");
    }
    return n2;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function hue2rgb(p2, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p2 + (q2 - p2) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    }
    return p2;
  }
  function hslToRgb(h, s, l2) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l2 = bound01(l2, 100);
    if (s === 0) {
      g = l2;
      b = l2;
      r = l2;
    } else {
      var q2 = l2 < 0.5 ? l2 * (1 + s) : l2 + s - l2 * s;
      var p2 = 2 * l2 - q2;
      r = hue2rgb(p2, q2, h + 1 / 3);
      g = hue2rgb(p2, q2, h);
      b = hue2rgb(p2, q2, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, v };
  }
  function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f2 = h - i;
    var p2 = v * (1 - s);
    var q2 = v * (1 - f2 * s);
    var t = v * (1 - (1 - f2) * s);
    var mod = i % 6;
    var r = [v, q2, p2, p2, t, v][mod];
    var g = [t, v, v, q2, p2, p2][mod];
    var b = [p2, p2, t, v, v, q2][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l2 = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l2 = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l2);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var hueStep = 2;
  var saturationStep = 0.16;
  var saturationStep2 = 0.05;
  var brightnessStep1 = 0.05;
  var brightnessStep2 = 0.15;
  var lightColorCount = 5;
  var darkColorCount = 4;
  var darkColorMap = [{
    index: 7,
    opacity: 0.15
  }, {
    index: 6,
    opacity: 0.25
  }, {
    index: 5,
    opacity: 0.3
  }, {
    index: 5,
    opacity: 0.45
  }, {
    index: 5,
    opacity: 0.65
  }, {
    index: 5,
    opacity: 0.85
  }, {
    index: 4,
    opacity: 0.9
  }, {
    index: 3,
    opacity: 0.95
  }, {
    index: 2,
    opacity: 0.97
  }, {
    index: 1,
    opacity: 0.98
  }];
  function toHsv(_ref) {
    var r = _ref.r, g = _ref.g, b = _ref.b;
    var hsv = rgbToHsv(r, g, b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v
    };
  }
  function toHex(_ref2) {
    var r = _ref2.r, g = _ref2.g, b = _ref2.b;
    return "#".concat(rgbToHex(r, g, b, false));
  }
  function mix(rgb1, rgb2, amount) {
    var p2 = amount / 100;
    var rgb = {
      r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
      g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
      b: (rgb2.b - rgb1.b) * p2 + rgb1.b
    };
    return rgb;
  }
  function getHue(hsv, i, light) {
    var hue;
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  function getSaturation(hsv, i, light) {
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    var saturation;
    if (light) {
      saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
      saturation = hsv.s + saturationStep;
    } else {
      saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Number(saturation.toFixed(2));
  }
  function getValue(hsv, i, light) {
    var value;
    if (light) {
      value = hsv.v + brightnessStep1 * i;
    } else {
      value = hsv.v - brightnessStep2 * i;
    }
    if (value > 1) {
      value = 1;
    }
    return Number(value.toFixed(2));
  }
  function generate$1(color) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var patterns = [];
    var pColor = inputToRGB(color);
    for (var i = lightColorCount; i > 0; i -= 1) {
      var hsv = toHsv(pColor);
      var colorString = toHex(inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      }));
      patterns.push(colorString);
    }
    patterns.push(toHex(pColor));
    for (var _i = 1; _i <= darkColorCount; _i += 1) {
      var _hsv = toHsv(pColor);
      var _colorString = toHex(inputToRGB({
        h: getHue(_hsv, _i),
        s: getSaturation(_hsv, _i),
        v: getValue(_hsv, _i)
      }));
      patterns.push(_colorString);
    }
    if (opts.theme === "dark") {
      return darkColorMap.map(function(_ref3) {
        var index = _ref3.index, opacity = _ref3.opacity;
        var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index]), opacity * 100));
        return darkColorString;
      });
    }
    return patterns;
  }
  var presetPrimaryColors = {
    red: "#F5222D",
    volcano: "#FA541C",
    orange: "#FA8C16",
    gold: "#FAAD14",
    yellow: "#FADB14",
    lime: "#A0D911",
    green: "#52C41A",
    cyan: "#13C2C2",
    blue: "#1677FF",
    geekblue: "#2F54EB",
    purple: "#722ED1",
    magenta: "#EB2F96",
    grey: "#666666"
  };
  var presetPalettes = {};
  var presetDarkPalettes = {};
  Object.keys(presetPrimaryColors).forEach(function(key) {
    presetPalettes[key] = generate$1(presetPrimaryColors[key]);
    presetPalettes[key].primary = presetPalettes[key][5];
    presetDarkPalettes[key] = generate$1(presetPrimaryColors[key], {
      theme: "dark",
      backgroundColor: "#141414"
    });
    presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
  });
  var blue = presetPalettes.blue;
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function canUseDom() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }
  function contains(root, n2) {
    if (!root) {
      return false;
    }
    if (root.contains) {
      return root.contains(n2);
    }
    var node = n2;
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
  var APPEND_ORDER = "data-rc-order";
  var APPEND_PRIORITY = "data-rc-priority";
  var MARK_KEY = "rc-util-key";
  var containerCache = /* @__PURE__ */ new Map();
  function getMark() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
    if (mark) {
      return mark.startsWith("data-") ? mark : "data-".concat(mark);
    }
    return MARK_KEY;
  }
  function getContainer(option) {
    if (option.attachTo) {
      return option.attachTo;
    }
    var head = document.querySelector("head");
    return head || document.body;
  }
  function getOrder(prepend) {
    if (prepend === "queue") {
      return "prependQueue";
    }
    return prepend ? "prepend" : "append";
  }
  function findStyles(container) {
    return Array.from((containerCache.get(container) || container).children).filter(function(node) {
      return node.tagName === "STYLE";
    });
  }
  function injectCSS(css) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!canUseDom()) {
      return null;
    }
    var csp = option.csp, prepend = option.prepend, _option$priority = option.priority, priority = _option$priority === void 0 ? 0 : _option$priority;
    var mergedOrder = getOrder(prepend);
    var isPrependQueue = mergedOrder === "prependQueue";
    var styleNode = document.createElement("style");
    styleNode.setAttribute(APPEND_ORDER, mergedOrder);
    if (isPrependQueue && priority) {
      styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
    }
    if (csp !== null && csp !== void 0 && csp.nonce) {
      styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
    }
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
      if (isPrependQueue) {
        var existStyle = findStyles(container).filter(function(node) {
          if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) {
            return false;
          }
          var nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
          return priority >= nodePriority;
        });
        if (existStyle.length) {
          container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
          return styleNode;
        }
      }
      container.insertBefore(styleNode, firstChild);
    } else {
      container.appendChild(styleNode);
    }
    return styleNode;
  }
  function findExistNode(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var container = getContainer(option);
    return findStyles(container).find(function(node) {
      return node.getAttribute(getMark(option)) === key;
    });
  }
  function syncRealContainer(container, option) {
    var cachedRealContainer = containerCache.get(container);
    if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
      var placeholderStyle = injectCSS("", option);
      var parentNode = placeholderStyle.parentNode;
      containerCache.set(container, parentNode);
      container.removeChild(placeholderStyle);
    }
  }
  function updateCSS(css, key) {
    var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var container = getContainer(option);
    syncRealContainer(container, option);
    var existNode = findExistNode(key, option);
    if (existNode) {
      var _option$csp, _option$csp2;
      if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
        var _option$csp3;
        existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
      }
      if (existNode.innerHTML !== css) {
        existNode.innerHTML = css;
      }
      return existNode;
    }
    var newNode = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
  }
  function getRoot(ele) {
    var _ele$getRootNode;
    return ele === null || ele === void 0 || (_ele$getRootNode = ele.getRootNode) === null || _ele$getRootNode === void 0 ? void 0 : _ele$getRootNode.call(ele);
  }
  function inShadow(ele) {
    return getRoot(ele) instanceof ShadowRoot;
  }
  function getShadowRoot(ele) {
    return inShadow(ele) ? getRoot(ele) : null;
  }
  var warned = {};
  var preMessage = function preMessage2(fn) {
  };
  function warning$1(valid, message2) {
  }
  function note(valid, message2) {
  }
  function resetWarned() {
    warned = {};
  }
  function call(method, valid, message2) {
    if (!valid && !warned[message2]) {
      method(false, message2);
      warned[message2] = true;
    }
  }
  function warningOnce(valid, message2) {
    call(warning$1, valid, message2);
  }
  function noteOnce(valid, message2) {
    call(note, valid, message2);
  }
  warningOnce.preMessage = preMessage;
  warningOnce.resetWarned = resetWarned;
  warningOnce.noteOnce = noteOnce;
  function camelCase(input) {
    return input.replace(/-(.)/g, function(match, g) {
      return g.toUpperCase();
    });
  }
  function warning(valid, message2) {
    warningOnce(valid, "[@ant-design/icons] ".concat(message2));
  }
  function isIconDefinition(target) {
    return _typeof(target) === "object" && typeof target.name === "string" && typeof target.theme === "string" && (_typeof(target.icon) === "object" || typeof target.icon === "function");
  }
  function normalizeAttrs() {
    var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return Object.keys(attrs).reduce(function(acc, key) {
      var val = attrs[key];
      switch (key) {
        case "class":
          acc.className = val;
          delete acc.class;
          break;
        default:
          delete acc[key];
          acc[camelCase(key)] = val;
      }
      return acc;
    }, {});
  }
  function generate(node, key, rootProps) {
    if (!rootProps) {
      return /* @__PURE__ */ React.createElement(node.tag, _objectSpread2({
        key
      }, normalizeAttrs(node.attrs)), (node.children || []).map(function(child, index) {
        return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
      }));
    }
    return /* @__PURE__ */ React.createElement(node.tag, _objectSpread2(_objectSpread2({
      key
    }, normalizeAttrs(node.attrs)), rootProps), (node.children || []).map(function(child, index) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }
  function getSecondaryColor(primaryColor) {
    return generate$1(primaryColor)[0];
  }
  function normalizeTwoToneColors(twoToneColor) {
    if (!twoToneColor) {
      return [];
    }
    return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
  }
  var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
  var useInsertStyles = function useInsertStyles2(eleRef) {
    var _useContext = React.useContext(Context), csp = _useContext.csp, prefixCls = _useContext.prefixCls;
    var mergedStyleStr = iconStyles;
    if (prefixCls) {
      mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
    }
    React.useEffect(function() {
      var ele = eleRef.current;
      var shadowRoot = getShadowRoot(ele);
      updateCSS(mergedStyleStr, "@ant-design-icons", {
        prepend: true,
        csp,
        attachTo: shadowRoot
      });
    }, []);
  };
  var _excluded$1 = ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"];
  var twoToneColorPalette = {
    primaryColor: "#333",
    secondaryColor: "#E6E6E6",
    calculated: false
  };
  function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
    twoToneColorPalette.calculated = !!secondaryColor;
  }
  function getTwoToneColors() {
    return _objectSpread2({}, twoToneColorPalette);
  }
  var IconBase = function IconBase2(props) {
    var icon = props.icon, className = props.className, onClick = props.onClick, style = props.style, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, restProps = _objectWithoutProperties(props, _excluded$1);
    var svgRef = React__namespace.useRef();
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor,
        secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
      };
    }
    useInsertStyles(svgRef);
    warning(isIconDefinition(icon), "icon should be icon definiton, but got ".concat(icon));
    if (!isIconDefinition(icon)) {
      return null;
    }
    var target = icon;
    if (target && typeof target.icon === "function") {
      target = _objectSpread2(_objectSpread2({}, target), {}, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return generate(target.icon, "svg-".concat(target.name), _objectSpread2(_objectSpread2({
      className,
      onClick,
      style,
      "data-icon": target.name,
      width: "1em",
      height: "1em",
      fill: "currentColor",
      "aria-hidden": "true"
    }, restProps), {}, {
      ref: svgRef
    }));
  };
  IconBase.displayName = "IconReact";
  IconBase.getTwoToneColors = getTwoToneColors;
  IconBase.setTwoToneColors = setTwoToneColors;
  const ReactIcon = IconBase;
  function setTwoToneColor(twoToneColor) {
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return ReactIcon.setTwoToneColors({
      primaryColor,
      secondaryColor
    });
  }
  function getTwoToneColor() {
    var colors = ReactIcon.getTwoToneColors();
    if (!colors.calculated) {
      return colors.primaryColor;
    }
    return [colors.primaryColor, colors.secondaryColor];
  }
  var _excluded = ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"];
  setTwoToneColor(blue.primary);
  var Icon = /* @__PURE__ */ React__namespace.forwardRef(function(props, ref) {
    var _classNames;
    var className = props.className, icon = props.icon, spin = props.spin, rotate = props.rotate, tabIndex = props.tabIndex, onClick = props.onClick, twoToneColor = props.twoToneColor, restProps = _objectWithoutProperties(props, _excluded);
    var _React$useContext = React__namespace.useContext(Context), _React$useContext$pre = _React$useContext.prefixCls, prefixCls = _React$useContext$pre === void 0 ? "anticon" : _React$useContext$pre, rootClassName = _React$useContext.rootClassName;
    var classString = classNames(rootClassName, prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), _defineProperty(_classNames, "".concat(prefixCls, "-spin"), !!spin || icon.name === "loading"), _classNames), className);
    var iconTabIndex = tabIndex;
    if (iconTabIndex === void 0 && onClick) {
      iconTabIndex = -1;
    }
    var svgStyle = rotate ? {
      msTransform: "rotate(".concat(rotate, "deg)"),
      transform: "rotate(".concat(rotate, "deg)")
    } : void 0;
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return /* @__PURE__ */ React__namespace.createElement("span", _extends({
      role: "img",
      "aria-label": icon.name
    }, restProps, {
      ref,
      tabIndex: iconTabIndex,
      onClick,
      className: classString
    }), /* @__PURE__ */ React__namespace.createElement(ReactIcon, {
      icon,
      primaryColor,
      secondaryColor,
      style: svgStyle
    }));
  });
  Icon.displayName = "AntdIcon";
  Icon.getTwoToneColor = getTwoToneColor;
  Icon.setTwoToneColor = setTwoToneColor;
  const AntdIcon = Icon;
  var CloseOutlined$2 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" } }] }, "name": "close", "theme": "outlined" };
  const CloseOutlinedSvg = CloseOutlined$2;
  var CloseOutlined = function CloseOutlined2(props, ref) {
    return /* @__PURE__ */ React__namespace.createElement(AntdIcon, _extends({}, props, {
      ref,
      icon: CloseOutlinedSvg
    }));
  };
  const CloseOutlined$1 = /* @__PURE__ */ React__namespace.forwardRef(CloseOutlined);
  var SettingOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z" } }] }, "name": "setting", "theme": "outlined" };
  const SettingOutlinedSvg = SettingOutlined$2;
  var SettingOutlined = function SettingOutlined2(props, ref) {
    return /* @__PURE__ */ React__namespace.createElement(AntdIcon, _extends({}, props, {
      ref,
      icon: SettingOutlinedSvg
    }));
  };
  const SettingOutlined$1 = /* @__PURE__ */ React__namespace.forwardRef(SettingOutlined);
  const { Header } = antd.Layout;
  const BaseLayout = () => {
    const { refreshKey, closeModal } = useStore();
    const { token: { colorBgBase } } = antd.theme.useToken();
    const location2 = reactRouterDom.useLocation();
    const { selectedTopNavKey, setSelectedTopNavKey } = useStore();
    const navConfigs = React.useMemo(() => {
      return [
        {
          title: "网站导航",
          routePath: RoutePaths.SiteNavigation
        },
        {
          title: "脚本设置",
          routePath: RoutePaths.ScriptsSettingsList
        },
        {
          title: "脚本市场",
          routePath: RoutePaths.ScriptsMarket
        }
      ];
    }, []);
    React.useEffect(() => {
      const pathParts = location2.pathname.split("/");
      const matchingTopNav = navConfigs.find((nav) => nav.routePath.startsWith("/" + (pathParts[1] || "")));
      if (matchingTopNav) {
        setSelectedTopNavKey(matchingTopNav.routePath);
      }
    }, [location2.pathname, navConfigs]);
    const topNavItems = navConfigs.map((config) => ({
      key: config.routePath,
      label: jsxRuntimeExports.jsx(reactRouterDom.Link, { style: {
        textDecoration: "none"
      }, to: config.routePath, children: config.title })
    }));
    return jsxRuntimeExports.jsxs(antd.Layout, { style: {
      height: "100%"
    }, children: [jsxRuntimeExports.jsxs(Header, { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 0
    }, children: [jsxRuntimeExports.jsx(antd.Menu, { theme: "dark", mode: "horizontal", items: topNavItems, selectedKeys: [selectedTopNavKey] }, "Menu" + refreshKey), jsxRuntimeExports.jsx(antd.Button, { type: "text", onClick: closeModal, style: {
      margin: "0 16px"
    }, icon: jsxRuntimeExports.jsx(CloseOutlined$1, { style: {
      fontSize: "20px",
      color: colorBgBase,
      cursor: "pointer"
    } }) })] }, "Header" + refreshKey), jsxRuntimeExports.jsx(reactRouterDom.Outlet, {}, "Outlet" + refreshKey)] });
  };
  BaseLayout.displayName = "BaseLayout";
  const NotFound = () => {
    return jsxRuntimeExports.jsx("div", { children: jsxRuntimeExports.jsx(antd.Empty, { description: "这里什么都没有" }) });
  };
  const categories = [
    {
      // 综合脚本
      title: "📦 综合脚本",
      name: "general-script",
      subCategories: [
        {
          title: "今日安装",
          name: "recommended-script",
          url: "https://greasyfork.org/zh-CN/scripts"
        },
        {
          title: "总安装量",
          name: "total-install-script",
          url: "https://greasyfork.org/zh-CN/scripts?sort=total_installs"
        },
        {
          title: "得分最高",
          name: "highest-score-script",
          url: "https://greasyfork.org/zh-CN/scripts?sort=ratings"
        },
        {
          title: "最近更新",
          name: "recent-updated-script",
          url: "https://greasyfork.org/zh-CN/scripts?sort=updated"
        },
        {
          title: "最新作品",
          name: "recent-created-script",
          url: "https://greasyfork.org/zh-CN/scripts?sort=created"
        }
      ]
    },
    {
      title: "🎬 视频网站脚本",
      name: "video-website-script",
      subCategories: [
        {
          title: "哔哩哔哩",
          name: "bilibili.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=bilibili.com"
        },
        {
          title: "爱奇艺",
          name: "iqiyi.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=iqiyi.com"
        },
        {
          title: "优酷",
          name: "youku.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=youku.com"
        },
        {
          title: "腾讯视频",
          name: "v.qq.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=v.qq.com"
        },
        {
          title: "芒果TV",
          name: "mgtv.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=mgtv.com"
        },
        {
          title: "抖音",
          name: "douyin.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=douyin.com"
        },
        {
          title: "快手",
          name: "kuaishou.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=kuaishou.com"
        },
        {
          title: "西瓜视频",
          name: "xigua.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=xigua.com"
        },
        {
          title: "虎牙",
          name: "huya.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=huya.com"
        }
      ]
    },
    {
      title: "🎵 音乐网站脚本",
      name: "music-website-script",
      subCategories: [
        {
          title: "网易云音乐",
          name: "music.163.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=music.163.com"
        },
        {
          title: "QQ音乐",
          name: "y.qq.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=y.qq.com"
        },
        {
          title: "酷狗音乐",
          name: "kugou.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=kugou.com"
        },
        {
          title: "酷我音乐",
          name: "kuwo.cn",
          url: "https://greasyfork.org/zh-CN/scripts?q=kuwo.cn"
        }
      ]
    },
    {
      title: "📚 电子书网站脚本",
      name: "ebook-website-script",
      subCategories: [
        {
          title: "起点中文网",
          name: "qidian.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=qidian.com"
        },
        {
          title: "纵横中文网",
          name: "zongheng.com",
          url: "https://greasyfork.org/zh-CN/scripts?q=zongheng.com"
        },
        {
          title: "笔趣阁",
          name: "biquge",
          url: "https://greasyfork.org/zh-CN/scripts?q=biquge"
        }
      ]
    }
  ];
  const tryParseJson = (json, defaultValue) => {
    try {
      return JSON.parse(json);
    } catch (e) {
      return defaultValue;
    }
  };
  const tryStringifyJson = (json, defaultValue = "") => {
    try {
      return JSON.stringify(json);
    } catch (e) {
      return defaultValue;
    }
  };
  const useFetch = (options) => {
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const timeoutTimerRef = React.useRef(null);
    const controllerRef = React.useRef();
    const { autoFetch = true, timeout = 12 * 1e3, args = [], fetchFn, cacheKeys, cacheStorage = window.sessionStorage, enableRequest = true } = options;
    const cacheKey = React.useMemo(() => {
      if (!cacheKeys)
        return null;
      const keys = Array.isArray(cacheKeys) ? cacheKeys : [cacheKeys];
      return keys.join(":");
    }, [cacheKeys]);
    const cancelTimeout = () => {
      if (timeoutTimerRef.current)
        window.clearTimeout(timeoutTimerRef.current);
    };
    const cancelRequest = () => {
      var _a;
      cancelTimeout();
      (_a = controllerRef.current) == null ? void 0 : _a.abort();
    };
    const abortRequestWhenTimeout = () => {
      if (!timeout)
        return;
      cancelTimeout();
      timeoutTimerRef.current = window.setTimeout(() => {
        cancelRequest();
        setError(new Error("Request timed out"));
        setIsLoading(false);
      }, timeout);
    };
    const createRes = () => {
      return {
        data,
        error
      };
    };
    const reFetch = async (...args2) => {
      if (enableRequest === false) {
        setIsLoading(false);
        return createRes();
      }
      if (cacheStorage && cacheKey) {
        const cachedData = cacheStorage.getItem(cacheKey);
        if (cachedData) {
          setData(tryParseJson(cachedData, null));
          setIsLoading(false);
          return createRes();
        }
      }
      setIsLoading(true);
      setError(null);
      abortRequestWhenTimeout();
      try {
        controllerRef.current = new AbortController();
        const response = await fetchFn({
          abortController: controllerRef.current
        })(...args2);
        if (!controllerRef.current.signal.aborted) {
          setData(response);
          if (cacheStorage && cacheKey) {
            cacheStorage.setItem(cacheKey, tryStringifyJson(response));
          }
        }
      } catch (err) {
        console.warn("useFetch error", err);
        if ((err == null ? void 0 : err.name) !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsLoading(false);
        cancelTimeout();
      }
      return createRes();
    };
    const doFetch = () => reFetch(...args);
    React.useEffect(() => {
      if (autoFetch) {
        doFetch();
      }
      return () => {
        cancelRequest();
      };
    }, [autoFetch, cacheKey]);
    return {
      data,
      isLoading,
      error,
      cancel: cancelRequest,
      fetchWithCache: reFetch,
      fetchWithoutCache: (...args2) => {
        if (cacheStorage && cacheKey) {
          cacheStorage.removeItem(cacheKey);
        }
        return reFetch(...args2);
      }
    };
  };
  const formatHeaders = (headers) => {
    const result = {};
    if (headers) {
      const headerObj = new Headers(headers);
      headerObj.forEach((value, key) => {
        result[key] = value;
      });
    }
    return result;
  };
  const formatBody = async (body) => {
    if (body === null || body === void 0)
      return void 0;
    if (body instanceof ReadableStream) {
      return new Response(body).arrayBuffer();
    }
    return body;
  };
  const gmFetch = (input, init) => {
    return new Promise(async (resolve, reject) => {
      const gmApi = getGMApi();
      const GM_xmlhttpRequest2 = gmApi == null ? void 0 : gmApi.GM_xmlhttpRequest;
      if (typeof GM_xmlhttpRequest2 !== "function") {
        throw new TypeError("Request failed, GM_xmlhttpRequest is not a function");
      }
      const request = new Request(input, init);
      let gmOptions = {
        method: request.method,
        url: request.url,
        headers: formatHeaders(init == null ? void 0 : init.headers),
        // 这里需要将init中可能存在的headers转换为GM_xmlhttpRequest能理解的格式
        data: await formatBody(request.body),
        onload: function(response) {
          const headers = new Headers();
          response.responseHeaders.split("\n").forEach((header) => {
            let parts = header.split(":");
            if (parts.length > 1) {
              let key = parts.shift().trim();
              let value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          const blob = new Blob([response.responseText], {
            type: headers.get("Content-Type") || "text/plain"
          });
          resolve(new Response(blob, {
            status: response.status,
            statusText: response.statusText,
            headers
          }));
        },
        onerror(error) {
          reject(new TypeError("Network request failed"));
        },
        ontimeout() {
          reject(new TypeError("Network request failed"));
        }
      };
      if (init && init.headers) {
        gmOptions.headers = formatHeaders(init.headers);
      }
      GM_xmlhttpRequest2(gmOptions);
    });
  };
  const resolveApiConfig = (apiConfig) => {
    const { url, method, params, query, headers, responseType } = apiConfig;
    const init = {
      method,
      headers,
      body: params ? JSON.stringify(params) : void 0
    };
    const finalUrl = new URL(url);
    if (query) {
      Object.keys(query).forEach((key) => {
        finalUrl.searchParams.append(key, query[key]);
      });
    }
    const processResponse = async (res) => {
      if (responseType === "json") {
        return await res.json();
      }
      if (responseType === "text") {
        return await res.text();
      }
      if (typeof responseType === "function") {
        return await responseType(res);
      }
      return res;
    };
    return {
      url: finalUrl.toString(),
      init,
      processResponse
    };
  };
  const createFetchFn = (apiConfig, fetcher = window.fetch) => {
    return ({ abortController } = {}) => async ({ params, query } = {}) => {
      const { url, init, processResponse } = resolveApiConfig({
        ...apiConfig,
        params,
        query
      });
      const res = await fetcher(url, {
        ...init,
        signal: abortController == null ? void 0 : abortController.signal
      });
      if (res.ok) {
        return await processResponse(res);
      }
      throw new Error(res.statusText);
    };
  };
  const createGmFetchFn = (apiConfig) => {
    return createFetchFn(apiConfig, gmFetch);
  };
  const getFirstAccessibleLink = async (_urls) => {
    const urls = _urls.filter((url) => typeof url === "string");
    if (urls.length === 0) {
      return null;
    }
    const results = await Promise.allSettled(urls.map(isLinkAccessible));
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "fulfilled" && results[i].value) {
        return urls[i];
      }
    }
    return null;
  };
  const fixUrl = (hostname, url) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return new URL(url, hostname).href;
    }
    if (parsedUrl.host !== new URL(hostname).host) {
      return new URL(parsedUrl.pathname, hostname).href;
    }
    return url;
  };
  const $dom = (selector, win = window) => win.document.querySelector(selector);
  const getHrefFromElementWithFix = (element, hostname) => {
    if (!element) {
      return "";
    }
    const href = element.getAttribute("href") || "";
    return fixUrl(hostname, href);
  };
  const getGreasyForkRecommendScripsConfig = (url = "https://greasyfork.org/zh-CN/scripts") => {
    return {
      url,
      method: "GET",
      responseType: async (res) => {
        var _a, _b, _c;
        const html = await res.text();
        const dom = new DOMParser().parseFromString(html, "text/html");
        const scriptList = Array.from(dom.querySelectorAll("#browse-script-list > li[data-script-id]"));
        const hostname = "https://greasyfork.org";
        const scripts = scriptList.filter((script) => {
          return script.dataset.scriptId && script.dataset.scriptName && script.dataset.codeUrl;
        }).map((script) => {
          var _a2;
          const scriptId = Number(script.dataset.scriptId);
          const scriptName = script.dataset.scriptName;
          const scriptDescription = ((_a2 = script.querySelector(".script-description")) == null ? void 0 : _a2.innerText) || "";
          const scriptAuthors = tryParseJson(script.dataset.scriptAuthors) || {};
          const scriptDailyInstalls = Number(script.dataset.scriptDailyInstalls || 0);
          const scriptTotalInstalls = Number(script.dataset.scriptTotalInstalls || 0);
          const scriptCreatedDate = script.dataset.scriptCreatedDate || "";
          const scriptUpdatedDate = script.dataset.scriptUpdatedDate || "";
          const scriptRatingScore = script.dataset.scriptRatingScore || "0";
          const scriptVersion = script.dataset.scriptVersion || "1.0.0";
          const scriptDetailUrl = getHrefFromElementWithFix(script.querySelector("a.script-link"), hostname);
          const scriptAuthorUrl = getHrefFromElementWithFix(script.querySelector(".script-list-author a"), hostname);
          const codeUrl = script.dataset.codeUrl || "";
          return {
            scriptId,
            scriptName,
            scriptDescription,
            scriptAuthors,
            scriptDailyInstalls,
            scriptTotalInstalls,
            scriptCreatedDate,
            scriptUpdatedDate,
            scriptRatingScore,
            scriptVersion,
            scriptDetailUrl,
            scriptAuthorUrl,
            codeUrl
          };
        });
        const currentPage = ((_a = dom.querySelector('.pagination a[aria-current^="page"]')) == null ? void 0 : _a.innerText) || "1";
        const totalPage = ((_c = (_b = Array.from(dom.querySelectorAll('.pagination a[aria-label^="Page"]'))) == null ? void 0 : _b.at(-1)) == null ? void 0 : _c.innerText) || "1";
        return {
          scripts,
          currentPage: Number(currentPage),
          totalPage: Number(totalPage),
          pageSize: 50
        };
      }
    };
  };
  const { Search } = antd.Input;
  const { Paragraph } = antd.Typography;
  const ScriptList = (props) => {
    const { url } = props;
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(50);
    const listRef = React.useRef(null);
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const { token: { colorBorderSecondary } } = antd.theme.useToken();
    const finalUrl = React.useMemo(() => {
      const requestUrl = new URL(url);
      requestUrl.searchParams.set("page", currentPage.toString());
      if (searchKeyword) {
        requestUrl.searchParams.set("q", searchKeyword);
      }
      return requestUrl.toString();
    }, [currentPage, searchKeyword, url]);
    const { data, isLoading } = useFetch({
      enableRequest: !!finalUrl,
      cacheKeys: [finalUrl],
      fetchFn: createGmFetchFn(getGreasyForkRecommendScripsConfig(finalUrl))
    });
    const { scripts = [], totalPage = 1 } = data || {};
    const totalSize = totalPage * pageSize;
    React.useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }, [currentPage]);
    return jsxRuntimeExports.jsx("div", { style: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      padding: "24px"
    }, children: jsxRuntimeExports.jsxs("div", { style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }, children: [jsxRuntimeExports.jsx(antd.Row, { style: {
      flexShrink: 0
    }, children: jsxRuntimeExports.jsx(antd.Col, { span: 24, md: 12, children: jsxRuntimeExports.jsx(Search, { size: "large", autoFocus: true, enterButton: "搜索", placeholder: "搜索脚本", loading: Boolean(searchKeyword && isLoading), onSearch: (value) => {
      setCurrentPage(1);
      setSearchKeyword(value);
    } }) }) }), jsxRuntimeExports.jsx("div", { style: {
      width: "100%",
      marginTop: "16px",
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden"
    }, ref: listRef, children: jsxRuntimeExports.jsx(antd.Spin, { spinning: isLoading, children: jsxRuntimeExports.jsx(antd.Row, { gutter: [16, 16], children: scripts ? scripts.map((script) => {
      return jsxRuntimeExports.jsx(antd.Col, { sm: 24, xxl: 12, children: jsxRuntimeExports.jsx(antd.Card, { title: script.scriptName, extra: jsxRuntimeExports.jsx(antd.Dropdown.Button, { type: "primary", getPopupContainer: () => listRef.current || document.body, menu: {
        items: [
          {
            key: "1",
            label: "查看详情",
            onClick: () => {
              window.open(script.scriptDetailUrl);
            }
          },
          {
            key: "2",
            label: "查看作者",
            onClick: () => {
              window.open(script.scriptAuthorUrl);
            }
          }
        ]
      }, onClick: () => {
        window.open(script.codeUrl);
      }, children: "安装" }), headStyle: {
        backgroundColor: colorBorderSecondary
      }, style: {
        height: "100%"
      }, children: jsxRuntimeExports.jsx(Paragraph, { ellipsis: {
        rows: 3,
        expandable: true,
        symbol: "更多"
      }, children: script.scriptDescription }) }) }, script.scriptId);
    }) : jsxRuntimeExports.jsx(antd.Empty, { style: {
      margin: "16px auto"
    } }) }) }) }), jsxRuntimeExports.jsx(antd.Pagination, { style: {
      marginTop: "16px",
      flexShrink: 0
    }, showQuickJumper: true, defaultCurrent: currentPage, defaultPageSize: pageSize, total: totalSize, showSizeChanger: false, hideOnSinglePage: true, onChange: (_page, _pageSize) => {
      setCurrentPage(_page);
      setPageSize(_pageSize);
    } })] }) });
  };
  ScriptList.displayName = "ScriptList";
  const ScriptsMarket = () => {
    var _a;
    const siderBarConfig = React.useMemo(() => {
      return categories.map((category) => {
        return {
          title: category.title,
          routePath: `${RoutePaths.ScriptsMarket}/${category.name}`,
          subSiderBarItems: category.subCategories.map((subCategory) => ({
            title: subCategory.title,
            routePath: `${RoutePaths.ScriptsMarket}/${category.name}/${subCategory.name}`
          }))
        };
      });
    }, []);
    const { siderMenuProps, selectedSiderBarItemKey } = useSiderBar({
      siderBarRoutePath: RoutePaths.ScriptsMarket,
      sideBarConfig: siderBarConfig
    });
    const firstAppRoutePath = (_a = siderBarConfig == null ? void 0 : siderBarConfig[0]) == null ? void 0 : _a.routePath;
    const indexRedirectPath = selectedSiderBarItemKey ? selectedSiderBarItemKey : firstAppRoutePath;
    return jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: indexRedirectPath ? jsxRuntimeExports.jsx(Redirector, { redirectPath: indexRedirectPath }) : null }), categories.map((category) => {
      return jsxRuntimeExports.jsx(reactRouter.Route, { path: category.name + "/*", element: jsxRuntimeExports.jsx(SideBarLayout, { siderBarMenuProps: siderMenuProps, contentStyle: {
        padding: "0"
      }, children: jsxRuntimeExports.jsxs(reactRouter.Routes, { children: [jsxRuntimeExports.jsx(reactRouter.Route, { index: true, element: jsxRuntimeExports.jsx(Redirector, { redirectPath: `${RoutePaths.ScriptsMarket}/${category.name}/${category.subCategories[0].name}` }) }), category.subCategories.map((subCategory) => {
        return jsxRuntimeExports.jsx(reactRouter.Route, { path: subCategory.name, element: jsxRuntimeExports.jsx(ScriptList, { url: subCategory.url }) }, subCategory.name);
      })] }) }) }, category.name);
    })] });
  };
  ScriptsMarket.displayName = "ScriptsMarket";
  var zh_CN$6 = {};
  var interopRequireDefault = { exports: {} };
  (function(module) {
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    module.exports = _interopRequireDefault2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(interopRequireDefault);
  var interopRequireDefaultExports = interopRequireDefault.exports;
  var zh_CN$5 = {};
  Object.defineProperty(zh_CN$5, "__esModule", {
    value: true
  });
  zh_CN$5.default = void 0;
  var _default = {
    // Options.jsx
    items_per_page: "条/页",
    jump_to: "跳至",
    jump_to_confirm: "确定",
    page: "页",
    // Pagination.jsx
    prev_page: "上一页",
    next_page: "下一页",
    prev_5: "向前 5 页",
    next_5: "向后 5 页",
    prev_3: "向前 3 页",
    next_3: "向后 3 页",
    page_size: "页码"
  };
  zh_CN$5.default = _default;
  var zh_CN$4 = {};
  var zh_CN$3 = {};
  var zh_CN$2 = {};
  Object.defineProperty(zh_CN$2, "__esModule", {
    value: true
  });
  zh_CN$2.default = void 0;
  var locale$2 = {
    locale: "zh_CN",
    today: "今天",
    now: "此刻",
    backToToday: "返回今天",
    ok: "确定",
    timeSelect: "选择时间",
    dateSelect: "选择日期",
    weekSelect: "选择周",
    clear: "清除",
    month: "月",
    year: "年",
    previousMonth: "上个月 (翻页上键)",
    nextMonth: "下个月 (翻页下键)",
    monthSelect: "选择月份",
    yearSelect: "选择年份",
    decadeSelect: "选择年代",
    yearFormat: "YYYY年",
    dayFormat: "D日",
    dateFormat: "YYYY年M月D日",
    dateTimeFormat: "YYYY年M月D日 HH时mm分ss秒",
    previousYear: "上一年 (Control键加左方向键)",
    nextYear: "下一年 (Control键加右方向键)",
    previousDecade: "上一年代",
    nextDecade: "下一年代",
    previousCentury: "上一世纪",
    nextCentury: "下一世纪"
  };
  zh_CN$2.default = locale$2;
  var zh_CN$1 = {};
  Object.defineProperty(zh_CN$1, "__esModule", {
    value: true
  });
  zh_CN$1.default = void 0;
  const locale$1 = {
    placeholder: "请选择时间",
    rangePlaceholder: ["开始时间", "结束时间"]
  };
  zh_CN$1.default = locale$1;
  var _interopRequireDefault$2 = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$3, "__esModule", {
    value: true
  });
  zh_CN$3.default = void 0;
  var _zh_CN$2 = _interopRequireDefault$2(zh_CN$2);
  var _zh_CN2$1 = _interopRequireDefault$2(zh_CN$1);
  const locale = {
    lang: Object.assign({
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      rangeYearPlaceholder: ["开始年份", "结束年份"],
      rangeMonthPlaceholder: ["开始月份", "结束月份"],
      rangeQuarterPlaceholder: ["开始季度", "结束季度"],
      rangeWeekPlaceholder: ["开始周", "结束周"]
    }, _zh_CN$2.default),
    timePickerLocale: Object.assign({}, _zh_CN2$1.default)
  };
  locale.lang.ok = "确定";
  zh_CN$3.default = locale;
  var _interopRequireDefault$1 = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$4, "__esModule", {
    value: true
  });
  zh_CN$4.default = void 0;
  var _zh_CN$1 = _interopRequireDefault$1(zh_CN$3);
  zh_CN$4.default = _zh_CN$1.default;
  var _interopRequireDefault = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$6, "__esModule", {
    value: true
  });
  zh_CN$6.default = void 0;
  var _zh_CN = _interopRequireDefault(zh_CN$5);
  var _zh_CN2 = _interopRequireDefault(zh_CN$4);
  var _zh_CN3 = _interopRequireDefault(zh_CN$3);
  var _zh_CN4 = _interopRequireDefault(zh_CN$1);
  const typeTemplate = "${label}不是一个有效的${type}";
  const localeValues = {
    locale: "zh-cn",
    Pagination: _zh_CN.default,
    DatePicker: _zh_CN3.default,
    TimePicker: _zh_CN4.default,
    Calendar: _zh_CN2.default,
    // locales for all components
    global: {
      placeholder: "请选择"
    },
    Table: {
      filterTitle: "筛选",
      filterConfirm: "确定",
      filterReset: "重置",
      filterEmptyText: "无筛选项",
      filterCheckall: "全选",
      filterSearchPlaceholder: "在筛选项中搜索",
      selectAll: "全选当页",
      selectInvert: "反选当页",
      selectNone: "清空所有",
      selectionAll: "全选所有",
      sortTitle: "排序",
      expand: "展开行",
      collapse: "关闭行",
      triggerDesc: "点击降序",
      triggerAsc: "点击升序",
      cancelSort: "取消排序"
    },
    Modal: {
      okText: "确定",
      cancelText: "取消",
      justOkText: "知道了"
    },
    Tour: {
      Next: "下一步",
      Previous: "上一步",
      Finish: "结束导览"
    },
    Popconfirm: {
      cancelText: "取消",
      okText: "确定"
    },
    Transfer: {
      titles: ["", ""],
      searchPlaceholder: "请输入搜索内容",
      itemUnit: "项",
      itemsUnit: "项",
      remove: "删除",
      selectCurrent: "全选当页",
      removeCurrent: "删除当页",
      selectAll: "全选所有",
      removeAll: "删除全部",
      selectInvert: "反选当页"
    },
    Upload: {
      uploading: "文件上传中",
      removeFile: "删除文件",
      uploadError: "上传错误",
      previewFile: "预览文件",
      downloadFile: "下载文件"
    },
    Empty: {
      description: "暂无数据"
    },
    Icon: {
      icon: "图标"
    },
    Text: {
      edit: "编辑",
      copy: "复制",
      copied: "复制成功",
      expand: "展开"
    },
    PageHeader: {
      back: "返回"
    },
    Form: {
      optional: "（可选）",
      defaultValidateMessages: {
        default: "字段验证错误${label}",
        required: "请输入${label}",
        enum: "${label}必须是其中一个[${enum}]",
        whitespace: "${label}不能为空字符",
        date: {
          format: "${label}日期格式无效",
          parse: "${label}不能转换为日期",
          invalid: "${label}是一个无效日期"
        },
        types: {
          string: typeTemplate,
          method: typeTemplate,
          array: typeTemplate,
          object: typeTemplate,
          number: typeTemplate,
          date: typeTemplate,
          boolean: typeTemplate,
          integer: typeTemplate,
          float: typeTemplate,
          regexp: typeTemplate,
          email: typeTemplate,
          url: typeTemplate,
          hex: typeTemplate
        },
        string: {
          len: "${label}须为${len}个字符",
          min: "${label}最少${min}个字符",
          max: "${label}最多${max}个字符",
          range: "${label}须在${min}-${max}字符之间"
        },
        number: {
          len: "${label}必须等于${len}",
          min: "${label}最小值为${min}",
          max: "${label}最大值为${max}",
          range: "${label}须在${min}-${max}之间"
        },
        array: {
          len: "须为${len}个${label}",
          min: "最少${min}个${label}",
          max: "最多${max}个${label}",
          range: "${label}数量须在${min}-${max}之间"
        },
        pattern: {
          mismatch: "${label}与模式不匹配${pattern}"
        }
      }
    },
    Image: {
      preview: "预览"
    },
    QRCode: {
      expired: "二维码过期",
      refresh: "点击刷新"
    },
    ColorPicker: {
      presetEmpty: "暂无"
    }
  };
  zh_CN$6.default = localeValues;
  var zh_CN = zh_CN$6;
  const zhCN = /* @__PURE__ */ getDefaultExportFromCjs(zh_CN);
  var isBrowser = typeof window !== "undefined";
  var getInitialState = function(query, defaultState) {
    if (defaultState !== void 0) {
      return defaultState;
    }
    if (isBrowser) {
      return window.matchMedia(query).matches;
    }
    return false;
  };
  var useMedia = function(query, defaultState) {
    var _a = React.useState(getInitialState(query, defaultState)), state = _a[0], setState = _a[1];
    React.useEffect(function() {
      var mounted = true;
      var mql = window.matchMedia(query);
      var onChange = function() {
        if (!mounted) {
          return;
        }
        setState(!!mql.matches);
      };
      mql.addListener(onChange);
      setState(mql.matches);
      return function() {
        mounted = false;
        mql.removeListener(onChange);
      };
    }, [query]);
    return state;
  };
  const useMedia$1 = useMedia;
  const useBreakPoint = () => {
    const isXs = useMedia$1("(max-width: 480px)");
    const isSm = useMedia$1("(min-width: 480px) and (max-width: 576px)");
    const isMd = useMedia$1("(min-width: 576px) and (max-width: 768px)");
    const isLg = useMedia$1("(min-width: 768px) and (max-width: 992px)");
    const isXl = useMedia$1("(min-width: 992px) and (max-width: 1200px)");
    const isXxl = useMedia$1("(min-width: 1200px) and (max-width: 1600px)");
    const isXxxl = useMedia$1("(min-width: 1600px)");
    const isMobile = isXs || isSm || isMd;
    return {
      isXs,
      isSm,
      isMd,
      isLg,
      isXl,
      isXxl,
      isXxxl,
      isMobile,
      isDesktop: !isMobile
    };
  };
  const colorToRgba = (color) => {
    if (/^rgba?/.test(color)) {
      let [r, g, b, a = 255] = color.replace(/(rgba?|\(|\)|\s)/gi, "").split(",").map((item) => parseFloat(item));
      a = a <= 1 ? a * 255 : a;
      return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
        a: Math.round(a)
      };
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(color);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? parseInt(result[4], 16) : 255
        // If alpha channel is not provided in HEX color, set it to full (255)
      };
    }
    return { r: 0, g: 0, b: 0, a: 255 };
  };
  const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l2 = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l2 > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l2 * 100 };
  };
  const hslToHex = (h, s, l2) => {
    l2 /= 100;
    const a = s * Math.min(l2, 1 - l2) / 100;
    const f2 = (n2) => {
      const k2 = (n2 + h / 30) % 12;
      const color = l2 - a * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f2(0)}${f2(8)}${f2(4)}`;
  };
  const calculateDarkThemeColor = (themeColor) => {
    const { r, g, b } = colorToRgba(themeColor);
    const { h, s, l: l2 } = rgbToHsl(r, g, b);
    if (l2 < 50) {
      return themeColor;
    }
    return hslToHex(h, s, 50);
  };
  async function getSiteThemeColor(defaultColor = "#ffffff", win = window) {
    const getColorFromMeta = () => {
      const metaThemeColor = win.document.querySelector('meta[name="theme-color"]');
      return metaThemeColor ? metaThemeColor.getAttribute("content") : null;
    };
    const getColorFromFavicon = async () => {
      var _a, _b;
      const unsafeWin = getUnsafeWindow(win);
      const faviconUrls = [
        unsafeWin.location.origin + "/favicon.ico",
        (_a = win.document.querySelector('link[rel="icon"]')) == null ? void 0 : _a.href,
        (_b = win.document.querySelector('link[rel="shortcut icon"]')) == null ? void 0 : _b.href
      ];
      const faviconUrl = await getFirstAccessibleLink(faviconUrls);
      if (!faviconUrl) {
        return null;
      }
      const imgRes = await fetch(faviconUrl, {
        method: "GET",
        mode: "cors"
      });
      if (!imgRes.ok) {
        return null;
      }
      const imgBlob = await imgRes.blob();
      const img = unsafeWin.document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(imgBlob);
      await img.decode();
      const canvas = unsafeWin.document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return null;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorCount = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        if (alpha < 128 || r === g && g === b) {
          continue;
        }
        const color = `rgb(${r},${g},${b})`;
        colorCount[color] = (colorCount[color] || 0) + 1;
      }
      return Object.keys(colorCount).reduce((a, b) => colorCount[a] > colorCount[b] ? a : b);
    };
    const colorFromMeta = getColorFromMeta();
    if (colorFromMeta) {
      const colorFromMetaRgba = colorToRgba(colorFromMeta);
      if (colorFromMetaRgba.r !== colorFromMetaRgba.g || colorFromMetaRgba.g !== colorFromMetaRgba.b) {
        return colorFromMeta;
      }
    }
    const colorFromFavicon = await getColorFromFavicon();
    return colorFromFavicon || colorFromMeta || defaultColor;
  }
  function useSiteThemeColor(defaultColor = "#1677ff") {
    const [themeColor, setThemeColor] = React.useState(defaultColor);
    const initThemeColor = async () => {
      for (const [matcher, color] of siteMatcherThemeColorMap) {
        if (isMatchSite(matcher)) {
          setThemeColor(color);
          return;
        }
      }
      const themeColorFromStorage = localStorage.getItem("jsm-theme-color");
      if (themeColorFromStorage) {
        setThemeColor(themeColorFromStorage);
        return;
      }
      const themeColorFromSite = await getSiteThemeColor(defaultColor);
      setThemeColor(calculateDarkThemeColor(themeColorFromSite));
      localStorage.setItem("jsm-theme-color", themeColorFromSite);
    };
    React.useEffect(() => {
      initThemeColor();
    }, []);
    return themeColor;
  }
  const useIsFullscreen = (win = window) => {
    const [isFullscreen$1, setIsFullscreen] = React.useState(isFullscreen(win));
    React.useEffect(() => {
      const onFullScreenChange = () => {
        setIsFullscreen(isFullscreen(win));
      };
      win.document.addEventListener("fullscreenchange", onFullScreenChange);
      win.document.addEventListener("webkitfullscreenchange", onFullScreenChange);
      win.document.addEventListener("mozfullscreenchange", onFullScreenChange);
      win.document.addEventListener("MSFullscreenChange", onFullScreenChange);
      return () => {
        win.document.removeEventListener("fullscreenchange", onFullScreenChange);
        win.document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
        win.document.removeEventListener("mozfullscreenchange", onFullScreenChange);
        win.document.removeEventListener("MSFullscreenChange", onFullScreenChange);
      };
    }, []);
    return isFullscreen$1;
  };
  const useDraggable = (options) => {
    const { rememberPosition = true, cacheStorage = window.sessionStorage } = options;
    const key = "useDraggable:" + options.key;
    const getInitialPosition = () => {
      if (rememberPosition) {
        const savedPosition = cacheStorage.getItem(key);
        return savedPosition ? tryParseJson(savedPosition) : { x: 0, y: 0 };
      }
      return { x: 0, y: 0 };
    };
    const [position, _setPosition] = React.useState(getInitialPosition());
    const updatePosition = (newPosition) => {
      if (rememberPosition && newPosition) {
        cacheStorage.setItem(key, JSON.stringify(newPosition));
      }
      _setPosition((prevPosition) => ({ ...prevPosition, ...newPosition }));
    };
    const ref = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const startDrag = (clientX, clientY) => ({
      x: clientX - position.x,
      y: clientY - position.y
    });
    const duringDrag = (clientX, clientY, startPosition) => {
      const newX = clientX - startPosition.x;
      const newY = clientY - startPosition.y;
      updatePosition({ x: newX, y: newY });
      setIsDragging(newX !== 0 || newY !== 0);
    };
    const endDrag = () => {
      setTimeout(() => {
        setIsDragging(false);
      }, 0);
    };
    React.useEffect(() => {
      const element = ref.current;
      if (!element)
        return;
      const handleMouseDown = (e) => {
        let startPosition = { x: 0, y: 0 };
        if (e instanceof MouseEvent) {
          startPosition = startDrag(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent && e.touches.length === 1) {
          const touch = e.touches[0];
          startPosition = startDrag(touch.clientX, touch.clientY);
        } else {
          return;
        }
        const handleMouseMove = (moveEvent) => {
          if (moveEvent instanceof MouseEvent) {
            duringDrag(moveEvent.clientX, moveEvent.clientY, startPosition);
          } else if (moveEvent instanceof TouchEvent && moveEvent.touches.length === 1) {
            const touch = moveEvent.touches[0];
            duringDrag(touch.clientX, touch.clientY, startPosition);
          }
        };
        const handleMouseUp = (e2) => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.removeEventListener("touchmove", handleMouseMove);
          document.removeEventListener("touchend", handleMouseUp);
          endDrag();
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleMouseMove);
        document.addEventListener("touchend", handleMouseUp);
      };
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("touchstart", handleMouseDown);
      return () => {
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("touchstart", handleMouseDown);
      };
    }, [position]);
    React.useEffect(() => {
      const element = ref.current;
      if (element) {
        element.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }, [position]);
    return {
      ref,
      position,
      isDragging
    };
  };
  const App = () => {
    const siteThemeColor = useSiteThemeColor();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const useBreakPointReturns = useBreakPoint();
    const { isMobile } = useBreakPointReturns;
    const [refreshKey, setRefreshKey] = React.useState(0);
    const isFullscreen2 = useIsFullscreen();
    const { ref: dragRef, isDragging } = useDraggable({
      key: "jsm-view-floating-button"
    });
    React.useEffect(() => {
      setRefreshKey((prev) => prev + 1);
    }, [isModalOpen]);
    const handleModalOk = React.useCallback(() => {
      setIsModalOpen(false);
    }, []);
    const handleModalCancel = React.useCallback(() => {
      setIsModalOpen(false);
    }, []);
    return jsxRuntimeExports.jsxs(antd.ConfigProvider, { theme: {
      token: {
        colorPrimary: siteThemeColor,
        colorInfo: siteThemeColor
      }
    }, locale: zhCN, children: [jsxRuntimeExports.jsx(antd.Modal, { getContainer: false, open: isModalOpen, width: "100vw", onCancel: handleModalCancel, onOk: handleModalOk, style: {
      height: "100%",
      top: "0",
      padding: isMobile ? "16px" : "10vh 10vw",
      margin: "0",
      maxWidth: "100%",
      overflow: "hidden"
    }, styles: {
      content: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: 0
      },
      body: {
        width: "100%",
        height: "100%"
      }
    }, closable: false, footer: null, forceRender: true, children: jsxRuntimeExports.jsx(StoreProvider, { refreshKey: String(refreshKey), isModalOpen, closeModal: handleModalCancel, ...useBreakPointReturns, children: jsxRuntimeExports.jsx(reactRouterDom.Routes, { children: jsxRuntimeExports.jsxs(reactRouterDom.Route, { path: "/", element: jsxRuntimeExports.jsx(BaseLayout, {}), children: [jsxRuntimeExports.jsx(reactRouterDom.Route, { index: true, element: jsxRuntimeExports.jsx(Redirector, { redirectPath: RoutePaths.SiteNavigation }) }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: RoutePaths.SiteNavigation + "/*", element: jsxRuntimeExports.jsx(SiteNavigation, {}) }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: RoutePaths.ScriptsSettingsList + "/*", element: jsxRuntimeExports.jsx(ScriptsSettingsList, {}) }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: RoutePaths.ScriptsMarket + "/*", element: jsxRuntimeExports.jsx(ScriptsMarket, {}) }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: RoutePaths.NotFound, element: jsxRuntimeExports.jsx(NotFound, {}) }), jsxRuntimeExports.jsx(reactRouterDom.Route, { path: "*", element: jsxRuntimeExports.jsx(NotFound, {}) })] }) }) }) }), !isFullscreen2 && jsxRuntimeExports.jsx(antd.FloatButton, { ref: dragRef, icon: jsxRuntimeExports.jsx(SettingOutlined$1, {}), onClick: () => {
      if (isDragging)
        return;
      setIsModalOpen(true);
    }, style: {
      zIndex: 999,
      insetInlineEnd: isMobile ? "32px" : "50px",
      insetBlockEnd: isMobile ? "48px" : "100px"
    } })] });
  };
  const waitUntil = (conditionFn, timeout = 1e4) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let timer;
      let isCompleted = false;
      const maskAsCompleted = () => {
        timer && clearInterval(timer);
        isCompleted = true;
      };
      const intervalFn = () => {
        if (conditionFn()) {
          maskAsCompleted();
          resolve();
        } else if (Date.now() - startTime > timeout) {
          maskAsCompleted();
          console.warn("waitUntil timeout with function", conditionFn.toString());
          reject(new Error("waitUntil timeout"));
        }
      };
      intervalFn();
      if (isCompleted)
        return;
      timer = setInterval(intervalFn, 100);
    });
  };
  const insertCss = (css, options) => {
    const { win = window, keepStyle = false } = options || {};
    let style;
    const createStyle = () => {
      style = win.document.createElement("style");
      style.innerHTML = css;
      style.type = "text/css";
      win.document.head.appendChild(style);
    };
    createStyle();
    let observer;
    if (keepStyle) {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.removedNodes.length && Array.from(mutation.removedNodes).includes(style)) {
            createStyle();
          }
        }
      });
      observer.observe(win.document.head, {
        childList: true
      });
    }
    return () => {
      style.remove();
      observer == null ? void 0 : observer.disconnect();
    };
  };
  const insertCssOnMatchSite = (configs) => {
    const disposes = [];
    configs.forEach((config) => {
      const { siteMatch, css, keepStyle = true, win = window } = config;
      if (!isMatchSite(siteMatch))
        return;
      disposes.push(insertCss(css, { keepStyle, win }));
    });
    return () => {
      disposes.forEach((dispose) => {
        dispose();
      });
    };
  };
  const fixBilibiliStyle = () => {
    insertCssOnMatchSite([
      {
        siteMatch: [/\.bilibili\.com/],
        css: `
      #${JSM_ID} li {
        line-height: inherit;
      }
      `
      }
    ]);
  };
  const fixGlobalStyle = () => {
    insertCss(`
    #${JSM_ID}  {
      text-align: left;
    }

    #${JSM_ID} .ant-btn-primary {
      color: #fff;
    }
  `, {
      keepStyle: true
    });
  };
  const isAntStyleElement = (node) => {
    return node.tagName === "STYLE" && (node.hasAttribute("data-token-hash") || node.hasAttribute("data-cache-path") || node.hasAttribute("data-css-hash"));
  };
  const fixSpa = async () => {
    let currentHref = location.href;
    const observer = new MutationObserver((mutationsList) => {
      const newHref = location.href;
      if (newHref === currentHref)
        return;
      currentHref = newHref;
      for (const mutation of mutationsList) {
        const removedStyleEls = Array.from(mutation.removedNodes).filter(isAntStyleElement);
        if (removedStyleEls.length) {
          removedStyleEls.forEach((el) => {
            const newStyleEl = el.cloneNode(true);
            newStyleEl.innerHTML = el.innerHTML;
            document.head.appendChild(newStyleEl);
          });
        }
      }
    });
    observer.observe(document.head, {
      childList: true
    });
  };
  const fixStyles = () => {
    fixSpa();
    fixGlobalStyle();
    fixBilibiliStyle();
  };
  const renderJsm = async () => {
    await waitUntil(() => {
      var _a;
      return Boolean((_a = document == null ? void 0 : document.body) == null ? void 0 : _a.prepend);
    });
    if ($dom("#" + JSM_ID)) {
      return;
    }
    if (React.version && require$$0.version && remixRouter__namespace && reactRouter__namespace && Boolean(dayjs)) {
      console.log("react script manager is ready");
    }
    const rootElement = document.createElement("div");
    rootElement.id = JSM_ID;
    Object.assign(rootElement.style, {
      position: "relative",
      zIndex: 999999999
    });
    document == null ? void 0 : document.body.prepend(rootElement);
    client.createRoot(rootElement).render(jsxRuntimeExports.jsx(reactRouterDom.MemoryRouter, { children: jsxRuntimeExports.jsx(App, {}) }));
    fixStyles();
  };
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
  var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
  var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  const GMApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    GM: _GM,
    GM_addElement: _GM_addElement,
    GM_addStyle: _GM_addStyle,
    GM_addValueChangeListener: _GM_addValueChangeListener,
    GM_cookie: _GM_cookie,
    GM_deleteValue: _GM_deleteValue,
    GM_download: _GM_download,
    GM_getResourceText: _GM_getResourceText,
    GM_getResourceURL: _GM_getResourceURL,
    GM_getTab: _GM_getTab,
    GM_getTabs: _GM_getTabs,
    GM_getValue: _GM_getValue,
    GM_info: _GM_info,
    GM_listValues: _GM_listValues,
    GM_log: _GM_log,
    GM_notification: _GM_notification,
    GM_openInTab: _GM_openInTab,
    GM_registerMenuCommand: _GM_registerMenuCommand,
    GM_removeValueChangeListener: _GM_removeValueChangeListener,
    GM_saveTab: _GM_saveTab,
    GM_setClipboard: _GM_setClipboard,
    GM_setValue: _GM_setValue,
    GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
    GM_webRequest: _GM_webRequest,
    GM_xmlhttpRequest: _GM_xmlhttpRequest,
    monkeyWindow: _monkeyWindow,
    unsafeWindow: _unsafeWindow
  }, Symbol.toStringTag, { value: "Module" }));
  const onEarliestPageLoad = (callback, win = window) => {
    let isLoad = false;
    const load = () => {
      if (isLoad) {
        return;
      }
      isLoad = true;
      callback();
    };
    win.document.addEventListener("DOMContentLoaded", load);
    win.addEventListener("load", load);
  };
  initGMApi(GMApi);
  initJsmGMApi(GMApi);
  const originalConsole = { ...getUnsafeWindow().console };
  onEarliestPageLoad(() => {
    renderJsm();
    getUnsafeWindow().console = originalConsole;
  });

})(React, ReactDOM, antd, ReactRouter, ReactRouterDOM, RemixRouter, dayjs);