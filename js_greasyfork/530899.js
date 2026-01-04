
//test
window.alipanArtPlugins =
  (function (t) {
    var e = {
      version: "1.0.3",
      init: (t) =>
        Promise.all([
          e.readyHls(),
          e.readyArtplayer(),
          e.readyM3u8Parser(),
        ]).then(() => e.initArtplayer(t)),
      readyHls: function () {
        return window.Hls || unsafeWindow.Hls
          ? Promise.resolve()
          : e.loadJs("https://unpkg.com/hls.js/dist/hls.min.js");
      },
      readyArtplayer: function () {
        return window.Artplayer || unsafeWindow.Artplayer
          ? Promise.resolve()
          : e.loadJs("https://unpkg.com/artplayer/dist/artplayer.js");
      },
      readyM3u8Parser: function () {
        return window.m3u8Parser || unsafeWindow.m3u8Parser
          ? Promise.resolve()
          : e.loadJs("https://unpkg.com/m3u8-parser/dist/m3u8-parser.min.js");
      },
      initArtplayer: function (n) {
        if (
          ((n = e.initOption(n)),
          !Array.isArray(n.quality) || !n.quality.find((t) => t?.url))
        )
          return (
            alert("获取播放信息失败，请刷新网页重试"),
            Promise.reject("No available playUrl")
          );
        const s = window.Artplayer || unsafeWindow.Artplayer;
        Object.assign(s, {
          PLAYBACK_RATE: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5],
          ASPECT_RATIO: ["default", "4:3", "16:9", "自动拉伸"],
        });
        const i = new s(n, (e) => {
          t.length % 8 !== t.length &&
            t.forEach((t) => {
              e.plugins.add(t());
            });
        });
        return Promise.resolve(i);
      },
      initOption: function (t) {
        const e = {
            container: "#artplayer",
            url: "",
            quality: [],
            type: "hls",
            autoplay: !0,
            autoPlayback: !0,
            aspectRatio: !0,
            contextmenu: [],
            customType: {
              hls: function (t, e, n) {
                const s = window.Hls || unsafeWindow.Hls;
                if (s.isSupported()) {
                  n.hls && n.hls.destroy();
                  const i = new s({ maxBufferLength: 60 });
                  i.loadSource(e),
                    i.attachMedia(t),
                    (n.hls = i),
                    n.on("destroy", () => i.destroy());
                } else
                  t.canPlayType("application/vnd.apple.mpegurl")
                    ? (t.src = e)
                    : (n.notice.show = "Unsupported playback format: m3u8");
              },
            },
            flip: !0,
            icons: {
              loading:
                '<img src="https://artplayer.org/assets/img/ploading.gif">',
              state:
                '<img width="150" heigth="150" src="https://artplayer.org/assets/img/state.svg">',
              indicator:
                '<img width="16" heigth="16" src="https://artplayer.org/assets/img/indicator.svg">',
            },
            id: "",
            pip: !0,
            playbackRate: !0,
            screenshot: !0,
            setting: !0,
            subtitle: {
              url: "",
              type: "vtt",
              style: { color: "#fe9200", fontSize: "25px" },
              encoding: "utf-8",
            },
            subtitleOffset: !1,
            hotkey: !0,
            fullscreen: !0,
            fullscreenWeb: !0,
          },
          { video_info: n, video_file: s, video_items: i } = t || {},
          a = s || {},
          o = a.file_id;
        o && Object.assign(e, { file: a, id: o });
        const {
            live_transcoding_subtitle_task_list: r,
            live_transcoding_task_list: l,
            meta: c,
            quick_video_list: u,
            quick_video_subtitle_list: p,
          } = n?.video_preview_play_info || {},
          d = u || l;
        if (!Array.isArray(d) || !d.length) return e;
        {
          const t = {
            QHD: "2K 超清",
            QHD: "1440 超清",
            FHD: "1080 全高清",
            HD: "720 高清",
            SD: "540 标清",
            LD: "360 流畅",
          };
          d.forEach((e, n) => {
            Object.assign(e, {
              html:
                t[e.template_id] +
                (e.description ? "（三方VIP）" : e.url ? "" : "（VIP）"),
              type: "hls",
            });
          }),
            d.sort((t, e) => t.template_height - e.template_height),
            (d.findLast((t) => t.url).default = !0),
            Object.assign(e, { quality: d });
        }
        const { url: h, type: f } = d.find((t) => t.default) || d[0] || {};
        if (!h || !f) return e;
        Object.assign(e, { url: h, type: f });
        const m = p || r;
        if (Array.isArray(m) && m.length) {
          const t = { chi: "中文字幕", eng: "英文字幕", jpn: "日文字幕" };
          m.forEach(function (e, n) {
            Object.assign(e, {
              html: (t[e.language] || e.language || "未知语言") + "（vtt）",
              name: "内置字幕",
              type: "vtt",
            });
          }),
            ((
              m.find((t) => ["chi"].includes(t.language)) ||
              m.find((t) => t.url) ||
              {}
            ).default = !0),
            Object.assign(e, { subtitlelist: m });
        }
        const g = i || [];
        return (
          Array.isArray(g) &&
            g.length &&
            (((g.find((t) => t.file_id === o) || {}).default = !0),
            Object.assign(e, { playlist: g })),
          e
        );
      },
      loadJs: function (t) {
        return (
          window.instances || (window.instances = {}),
          window.instances[t] ||
            (window.instances[t] = new Promise((e, n) => {
              const s = document.createElement("script");
              (s.src = t),
                (s.type = "text/javascript"),
                (s.onload = e),
                (s.onerror = n),
                Node.prototype.appendChild.call(document.head, s);
            })),
          window.instances[t]
        );
      },
    };
    return e;
  })([
    function () {
      return (t) => {
        const e = window.Hls || unsafeWindow.Hls,
          { hls: n, option: s, notice: i } = t;
        var a = Date.now(),
          o = 0;
        return (
          n.on(e.Events.ERROR, (r, l) => {
            if (l.fatal)
              switch (
                ((i.show = `当前带宽: ${
                  Math.round((n.bandwidthEstimate / 1024 / 1024 / 8) * 100) /
                  100
                } MB/s`),
                l.type)
              ) {
                case e.ErrorTypes.NETWORK_ERROR:
                  l.details === e.ErrorDetails.MANIFEST_LOAD_ERROR ||
                  l.details === e.ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
                  l.details === e.ErrorDetails.MANIFEST_PARSING_ERROR
                    ? n.loadSource(n.url)
                    : l.details === e.ErrorDetails.FRAG_LOAD_ERROR
                    ? ++o < 10 &&
                      (n.loadSource(n.url),
                      (n.media.currentTime = t.currentTime),
                      n.media.play())
                    : n.startLoad();
                  break;
                case e.ErrorTypes.MEDIA_ERROR:
                  n.recoverMediaError();
                  break;
                default:
                  (i.show = "视频播放异常，请刷新重试"), n.destroy();
              }
            else if (l.type === e.ErrorTypes.NETWORK_ERROR)
              l.details === e.ErrorDetails.FRAG_LOAD_ERROR &&
                (function (t) {
                  var e =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : 6e3,
                    n = t.match(/&x-oss-expires=(\d+)&/);
                  return n
                    ? +"".concat(n[1], "000") - e < Date.now()
                    : Date.now() - a > 3e5 - e;
                })(n.url) &&
                ((o = 0),
                (a = Date.now()),
                n.stopLoad(),
                t.emit("reload-start", s.quality));
          }),
          t.on("reload-can", (e) => {
            !(function (e) {
              s.quality = e;
              const a = (n.url = (
                e.find((t) => t.default) ||
                e.findLast((t) => t.url) ||
                {}
              ).url);
              fetch(a)
                .then((t) => (t.ok ? t.text() : Promise.reject()))
                .then((e) => {
                  const s = new (
                    window.m3u8Parser || unsafeWindow.m3u8Parser
                  ).Parser();
                  s.push(e), s.end();
                  const i = a.replace(/media.m3u8.+/, ""),
                    o = s.manifest.segments;
                  n.bufferController.details.fragments.forEach(function (t, e) {
                    const n = o[e];
                    Object.assign(t, {
                      baseurl: a,
                      relurl: n.uri,
                      url: i + n.uri,
                    });
                  }),
                    n.startLoad(t.currentTime);
                })
                .catch((t) => {
                  throw ((i.show = t), t);
                });
            })(e);
          }),
          { name: "hlsevents" }
        );
      };
    },
    function () {
      return function (t) {
        const { controls: e, option: n, notice: s, i18n: i } = t;
        function a() {
          const a =
            n.quality.find((t) => t.default) ||
            n.quality.findLast((t) => t.url);
          e.update({
            name: "quality",
            html: a ? a.html : "",
            selector: n.quality,
            onSelect: function (e) {
              e.url
                ? (t.switchQuality(e.url),
                  (s.show = `${i.get("Switch Video")}: ${e.html}`))
                : (s.show = e.description || "视频地址不可用");
            },
          });
        }
        return (
          a(),
          t.on("playlist-switch-can", () => {
            setTimeout(a, 1e3);
          }),
          t.on("reload-can", () => {
            setTimeout(a, 1e3);
          }),
          { name: "quality" }
        );
      };
    },
    function () {
      return function (t) {
        const { option: e, notice: n } = t;
        if (!(e.playlist && e.playlist.length > 1)) return;
        const s = {
          showtext: !0,
          icon: '<i class="art-icon"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M810.666667 384H85.333333v85.333333h725.333334V384z m0-170.666667H85.333333v85.333334h725.333334v-85.333334zM85.333333 640h554.666667v-85.333333H85.333333v85.333333z m640-85.333333v256l213.333334-128-213.333334-128z" fill="#ffffff"></path></svg></i>',
          onchanged: (n) => {
            (e.file = n), t.emit("playlist-switch-start", n);
          },
        };
        var i = e.playlist.findIndex((t) => t.default);
        function a(n) {
          e.playlist[n]
            ? "function" == typeof s.onchanged && s.onchanged(e.playlist[n])
            : n >= e.playlist.length && (t.notice.show = "没有下一集了");
        }
        return (
          t.controls.add({
            html: s.showtext ? "播放列表" : s.icon,
            name: "play-list",
            position: "right",
            style: { paddingLeft: "10px", paddingRight: "10px" },
            selector: e.playlist.map((t, e) => ({
              html: t.name,
              style: { textAlign: "left" },
              index: e,
              default: i === e,
            })),
            onSelect: (t) => (
              a((i = t.index)), s.showtext ? "播放列表" : s.icon
            ),
          }),
          t.on("playlist-switch-can", (s) => {
            const { file_id: i, name: a } = e.file || {},
              {
                live_transcoding_subtitle_task_list: o,
                live_transcoding_task_list: r,
                meta: l,
                quick_video_list: c,
                quick_video_subtitle_list: u,
              } = s?.video_preview_play_info || {},
              p = (function (t) {
                if (Array.isArray(t) && t.length) {
                  let e = {
                    QHD: "2K 超清",
                    FHD: "1080 全高清",
                    HD: "720 高清",
                    SD: "540 标清",
                    LD: "360 流畅",
                  };
                  return (
                    t.forEach((t, n) => {
                      Object.assign(t, {
                        html:
                          e[t.template_id] +
                          (t.description
                            ? "（三方VIP）"
                            : t.url
                            ? ""
                            : "（VIP）"),
                        type: "hls",
                      });
                    }),
                    t.sort((t, e) => t.template_height - e.template_height),
                    (t.findLast((t) => t.url).default = !0),
                    t
                  );
                }
                return [];
              })(c || r);
            if (!p.length) return alert("获取播放信息失败，无法切换视频");
            {
              const { url: s, type: o } =
                p.find((t) => t.default) || p[0] || {};
              Object.assign(e, { id: i, quality: p, url: s, type: o }),
                t
                  .switchUrl(s)
                  .then(() => {
                    ((
                      document.querySelector(
                        "[class^=header-file-name], [class^=header-center] div span"
                      ) || {}
                    ).innerText = a),
                      (n.show = `切换视频: ${a}`);
                  })
                  .catch(() => {
                    n.show = `视频地址不可用: ${a}`;
                  });
            }
            e.subtitlelist = (function (t) {
              if (Array.isArray(t) && t.length) {
                const e = { chi: "中文字幕", eng: "英文字幕", jpn: "日文字幕" };
                return (
                  t.forEach(function (t, n) {
                    Object.assign(t, {
                      html:
                        (e[t.language] || t.language || "未知语言") + "（vtt）",
                      name: "内置字幕",
                      type: "vtt",
                    });
                  }),
                  ((
                    t.find((t) => ["chi"].includes(t.language)) ||
                    t[0] ||
                    {}
                  ).default = !0),
                  t
                );
              }
              return [];
            })(o);
          }),
          t.on("video:ended", () => {
            t.storage.get("auto-next") && i < s.playlist.length && a((i += 1));
          }),
          { name: "playlist" }
        );
      };
    },
    function () {
      return function (t) {
        const e = t.storage.get("auto-next");
        return (
          t.setting.add({
            html: "自动连播",
            name: "auto-next",
            icon: '<img width="22" heigth="22" src="https://artplayer.org/assets/img/state.svg">',
            tooltip: e ? "开启" : "关闭",
            switch: !!e,
            onSwitch: function (e) {
              return (
                (e.tooltip = e.switch ? "关闭" : "开启"),
                t.storage.set("auto-next", !e.switch),
                (t.notice.show =
                  "自动连续播放：" + (e.switch ? "关闭" : "开启")),
                !e.switch
              );
            },
          }),
          { name: "autonext" }
        );
      };
    },
    function () {
      return (t) => {
        const {
            controls: e,
            subtitle: n,
            template: s,
            option: i,
            notice: a,
          } = t,
          o = !0,
          r =
            '<i class="art-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg></i>';
        function l(t = []) {
          const s = Object.assign(
              {},
              i.subtitle,
              t.find((t) => t.default) || t[0] || {}
            ),
            { url: l, type: c } = s;
          Object.assign(i.subtitle, { url: l, type: c }),
            n.init({ ...s }).then(() => {
              a.show = "加载字幕成功";
            }),
            e.update({
              html: o ? "字幕列表" : r,
              name: "subtitle-list",
              position: "right",
              style: { paddingLeft: "10px", paddingRight: "10px" },
              selector: t.map((t, e) => ({ ...t })),
              onSelect: function (t, e) {
                const { url: s, type: a } = t;
                return (
                  Object.assign(i.subtitle, { url: s, type: a }),
                  n.switch(t.url, t),
                  t.html
                );
              },
            });
        }
        function c(t) {
          return (function (t) {
            return new Promise((e, n) => {
              var s = new FileReader();
              s.readAsText(t, "UTF-8"),
                (s.onload = function (n) {
                  var i = s.result;
                  return i.indexOf("�") > -1 && !s.markGBK
                    ? ((s.markGBK = !0), s.readAsText(t, "GBK"))
                    : i.indexOf("") > -1 && !s.markBIG5
                    ? ((s.markBIG5 = !0), s.readAsText(t, "BIG5"))
                    : void e(i);
                }),
                (s.onerror = function (t) {
                  n(t);
                });
            });
          })(t).then((t) => {
            const e = new Blob([t], { type: "text/plain" });
            return URL.createObjectURL(e);
          });
        }
        function u(t, e) {
          return (
            e instanceof Element
              ? Node.prototype.appendChild.call(t, e)
              : t.insertAdjacentHTML("beforeend", String(e)),
            t.lastElementChild || t.lastChild
          );
        }
        return (
          (s.$subtitleLocalFile = u(
            s.$container,
            '<input class="subtitleLocalFile" type="file" accept="webvtt,.vtt,.srt,.ssa,.ass" style="display: none;">'
          )),
          t.setting.add({
            width: 220,
            html: "字幕设置",
            name: "subtitle-setting",
            tooltip: "显示",
            icon: '<img width="22" heigth="22" src="https://artplayer.org/assets/img/subtitle.svg">',
            selector: [
              {
                html: "显示",
                tooltip: "显示",
                switch: !0,
                onSwitch: function (e) {
                  return (
                    (e.tooltip = e.switch ? "隐藏" : "显示"),
                    (t.subtitle.show = !e.switch),
                    !e.switch
                  );
                },
              },
              {
                html: "字幕偏移",
                name: "subtitle-offset",
                tooltip: "0s",
                range: [0, -5, 5, 0.1],
                onChange: (e) => ((t.subtitleOffset = e.range), e.range + "s"),
              },
              {
                html: "字幕位置",
                name: "subtitle-bottom",
                tooltip: "5%",
                range: [5, 1, 90, 1],
                onChange: (e) => (
                  t.subtitle.style({ bottom: e.range + "%" }), e.range + "%"
                ),
              },
              {
                html: "字体大小",
                name: "subtitle-fontSize",
                tooltip: "25px",
                range: [25, 10, 60, 1],
                onChange: (e) => (
                  t.subtitle.style({ fontSize: e.range + "px" }), e.range + "px"
                ),
              },
              {
                html: "字体粗细",
                name: "subtitle-fontWeight",
                tooltip: "400",
                range: [4, 1, 9, 1],
                onChange(e) {
                  const n = 100 * e.range;
                  return t.subtitle.style({ fontWeight: n }), n;
                },
              },
              {
                html: "字体颜色",
                name: "subtitle-color",
                tooltip: "",
                selector: [
                  {
                    name: "color-presets",
                    html: '<style>.panel-setting-color label{font-size: 0;padding: 6px;display: inline-block;}.panel-setting-color input{display: none;}.panel-setting-color span{width: 22px;height: 22px;display: inline-block;border-radius: 50%;box-sizing: border-box;cursor: pointer;}</style><div class="panel-setting-color"><label><input type="radio" value="#fff"><span style="background: #fff;"></span></label><label><input type="radio" value="#e54256"><span style="background: #e54256"></span></label><label><input type="radio" value="#ffe133"><span style="background: #ffe133"></span></label><label><input type="radio" name="dplayer-danmaku-color-1" value="#64DD17"><span style="background: #64DD17"></span></label><label><input type="radio" value="#39ccff"><span style="background: #39ccff"></span></label><label><input type="radio" value="#D500F9"><span style="background: #D500F9"></span></label></div>',
                  },
                  { name: "color-default", html: "默认颜色" },
                  { name: "color-picker", html: "颜色选择器" },
                ],
                onSelect: function (t, e, i) {
                  switch (t.name) {
                    case "color-presets":
                      "INPUT" === i.target.nodeName &&
                        n.style({ color: i.target.value });
                      break;
                    case "color-default":
                      n.style({ color: "#FE9200" });
                      break;
                    case "color-picker":
                      s.$colorPicker ||
                        ((s.$colorPicker = u(
                          s.$player,
                          '<input hidden type="color">'
                        )),
                        (s.$colorPicker.oninput = (t) => {
                          n.style({ color: t.target.value });
                        })),
                        s.$colorPicker.click();
                  }
                  return (
                    '<label style="display: flex;"><span style="width: 18px;height: 18px;display: inline-block;border-radius: 50%;box-sizing: border-box;cursor: pointer;background: ' +
                    s.$subtitle.style.color +
                    ';"></span></label>'
                  );
                },
              },
              {
                html: "字体类型",
                name: "subtitle-fontFamily",
                selector: [
                  { html: "默认", text: "" },
                  {
                    html: "等宽 衬线",
                    text: '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace',
                  },
                  {
                    html: "比例 衬线",
                    text: '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif',
                  },
                  {
                    html: "等宽 无衬线",
                    text: '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace',
                  },
                  {
                    html: "比例 无衬线",
                    text: '"YouTube Noto", Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif',
                  },
                  {
                    html: "Casual",
                    text: '"Comic Sans MS", Impact, Handlee, fantasy',
                  },
                  {
                    html: "Cursive",
                    text: '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive',
                  },
                  {
                    html: "Small Capitals",
                    text: '"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif',
                  },
                ],
                onSelect: function (e, n, s) {
                  return t.subtitle.style({ fontFamily: e.text }), e.html;
                },
              },
              {
                html: "描边样式",
                name: "subtitle-textShadow",
                selector: [
                  {
                    html: "默认",
                    text: "rgb(0 0 0) 1px 0 1px, rgb(0 0 0) 0 1px 1px, rgb(0 0 0) -1px 0 1px, rgb(0 0 0) 0 -1px 1px, rgb(0 0 0) 1px 1px 1px, rgb(0 0 0) -1px -1px 1px, rgb(0 0 0) 1px -1px 1px, rgb(0 0 0) -1px 1px 1px",
                  },
                  {
                    html: "重墨",
                    text: "rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px",
                  },
                  {
                    html: "描边",
                    text: "rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px",
                  },
                  {
                    html: "45°投影",
                    text: "rgb(0, 0, 0) 1px 1px 2px, rgb(0, 0, 0) 0px 0px 1px",
                  },
                  {
                    html: "阴影",
                    text: "rgb(34, 34, 34) 1px 1px 1.4875px, rgb(34, 34, 34) 1px 1px 1.98333px, rgb(34, 34, 34) 1px 1px 2.47917px",
                  },
                  { html: "凸起", text: "rgb(34, 34, 34) 1px 1px" },
                  {
                    html: "下沉",
                    text: "rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px",
                  },
                  {
                    html: "边框",
                    text: "rgb(34, 34, 34) 0px 0px 1px, rgb(34, 34, 34) 0px 0px 1px, rgb(34, 34, 34) 0px 0px 1px, rgb(34, 34, 34) 0px 0px 1px, rgb(34, 34, 34) 0px 0px 1px",
                  },
                ],
                onSelect: function (e, n, s) {
                  return t.subtitle.style({ textShadow: e.text }), e.html;
                },
              },
              {
                name: "subtitle-localfile",
                html: "加载本地字幕",
                selector: [{ html: "文件", name: "file" }],
                onSelect: function (t, e, n) {
                  var a;
                  return (
                    "file" === t.name &&
                      ((a = s.$subtitleLocalFile),
                      a.click(),
                      new Promise(function (t, e) {
                        a.onchange = (e) => {
                          if (e.target.files.length) {
                            const n = e.target.files[0],
                              s = n.name.split(".").pop().toLowerCase();
                            c(n).then((e) => {
                              const i = {
                                url: e,
                                type: s,
                                name: n.name,
                                html: "本地字幕（" + s + "）",
                              };
                              t(i);
                            });
                          }
                          e.target.value = "";
                        };
                      })).then((t) => {
                        (i.subtitlelist = (i.subtitlelist || []).concat([t])),
                          l(i.subtitlelist);
                      }),
                    !1
                  );
                },
              },
            ],
          }),
          (i.subtitlelist || []).length && l(i.subtitlelist),
          t.on("restart", () => {
            (i.subtitlelist || []).length
              ? l(i.subtitlelist)
              : e["subtitle-list"] && e.remove("subtitle-list");
          }),
          t.on("subtitlelist-add", (t) => {
            (i.subtitlelist = (i.subtitlelist || []).concat(t)),
              (i.subtitlelist || []).length && l(i.subtitlelist);
          }),
          { name: "subtitle" }
        );
      };
    },
    function () {
      return (t) => {
        function e() {
          t.libass &&
            t.subtitle.show &&
            ((t.template.$subtitle.style.display = "none"),
            ((t.libass.canvasParent || t.libass._canvasParent).style.display =
              "block"),
            t.libass.resize());
        }
        function n() {
          t.libass &&
            ((t.template.$subtitle.style.display = t.subtitle.show
              ? "block"
              : "none"),
            ((t.libass.canvasParent || t.libass._canvasParent).style.display =
              "none"));
        }
        function s(e) {
          let n = "https://unpkg.com/jassub@1.7.17/dist/jassub.umd.js";
          return (function (t) {
            window.instances || (window.instances = {});
            window.instances[t] ||
              (window.instances[t] = new Promise((e, n) => {
                const s = document.createElement("script");
                (s.src = t),
                  (s.type = "text/javascript"),
                  (s.onload = e),
                  (s.onerror = n),
                  Node.prototype.appendChild.call(document.head, s);
              }));
            return window.instances[t];
          })(n).then(
            () => (
              Object.assign(e, {
                workerUrl: new URL("jassub-worker.js", n).href,
                wasmUrl: new URL("jassub-worker.wasm", n).href,
                legacyWorkerUrl: new URL("jassub-worker.wasm.js", n).href,
                modernWasmUrl: new URL("jassub-worker-modern.wasm", n).href,
              }),
              (function ({ workerUrl: t }) {
                return fetch(t)
                  .then((t) => t.text())
                  .then((t) => {
                    const e = new Blob([t], { type: "text/javascript" }),
                      n = URL.createObjectURL(e);
                    return (
                      setTimeout(() => {
                        URL.revokeObjectURL(n);
                      }),
                      n
                    );
                  });
              })(e).then((n) => {
                (e.workerUrl = n), (t.libass = new unsafeWindow.JASSUB(e));
                return (
                  ((
                    t.libass.canvasParent || t.libass._canvasParent
                  ).style.cssText =
                    "position: absolute;top: 0;left: 0;width: 100%;height: 100%;user-select: none;pointer-events: none;z-index: 20;"),
                  t.libass
                );
              })
            )
          );
        }
        return (
          t.on("subtitle", (t) => {
            t ? e() : n();
          }),
          t.on("subtitleLoad", function () {
            return (function () {
              if (t.libass) return Promise.resolve(t.libass);
              const e = {
                video: t.template.$video,
                subContent: "[Script Info]\nScriptType: v4.00+",
                subUrl: "",
                availableFonts: {
                  思源黑体:
                    "https://artplayer.org/assets/misc/SourceHanSansCN-Bold.woff2",
                },
              };
              return (function (t) {
                if (unsafeWindow.queryLocalFonts) {
                  const e = {};
                  return (
                    t && (e.postscriptNames = Array.isArray(t) ? t : [t]),
                    unsafeWindow
                      .queryLocalFonts(e)
                      .then((t) => (t && t.length ? t : Promise.reject()))
                  );
                }
                return console.warn("Not Local fonts API"), Promise.reject();
              })().then(
                (t) => {
                  const n = t.filter((t) =>
                      t.fullName.match(/[\u4e00-\u9fa5]/)
                    ),
                    i =
                      n.find((t) => ["微软雅黑"].some((e) => t?.fullName === e))
                        ?.fullName ||
                      n.sort(() => 0.5 - Math.random())[0]?.fullName;
                  return (
                    Object.assign(e, { useLocalFonts: !0, fallbackFont: i }),
                    s(e)
                  );
                },
                () => (
                  Object.assign(e, {
                    fallbackFont: Object.keys(e.availableFonts)[0],
                  }),
                  s(e)
                )
              );
            })()
              .then(() => {
                const { url: s, type: i } = t?.option?.subtitle || {};
                !s || ("ass" !== i && "ssa" !== i)
                  ? (n(), t.libass.freeTrack())
                  : (!(function (e) {
                      t.libass &&
                        e &&
                        (t.libass.freeTrack(), t.libass.setTrackByUrl(e));
                    })(s),
                    e());
              })
              .catch((t) => {
                console.error("加载特效字幕组件 错误！", t);
              });
          }),
          t.on("subtitleOffset", (e) => {
            !(function (e) {
              t.libass && (t.libass.timeOffset = e);
            })(e);
          }),
          t.on("restart", () => {
            t.libass && t.libass.freeTrack();
          }),
          t.once("destroy", function () {
            t.libass &&
              (t.libass.destroy && t.libass.destroy(),
              t.libass.dispose && t.libass.dispose(),
              (t.libass = null));
          }),
          { name: "libass" }
        );
      };
    },
    function () {
      return (t) => {
        const { template: e, setting: n, storage: s, notice: i } = t;
        const a = t.storage.get("sound-enhancer");
        return (
          n.add({
            width: 220,
            html: "声音设置",
            name: "sound-setting",
            tooltip: "正常",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" data-spm-anchor-id="0.0.0.i11.83206c7554HZzm"><path d="M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zm4.258-.872a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path><path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path></svg>',
            selector: [
              {
                html: "音质增强",
                name: "sound-enhancer",
                tooltip: a ? "开启" : "关闭",
                switch: !!a,
                onSwitch: function (e) {
                  return (
                    (e.tooltip = e.switch ? "关闭" : "开启"),
                    t.storage.set("sound-enhancer", !e.switch),
                    t.joySound && t.joySound.setEnabled(!e.switch),
                    (i.show = "音质增强：" + (e.switch ? "关闭" : "开启")),
                    !e.switch
                  );
                },
              },
              {
                html: "音量增强",
                name: "volume-enhancer",
                tooltip: "0x",
                range: [0, 0, 10, 0.1],
                onRange: function (e) {
                  const n = e.range / 10;
                  return (
                    t.joySound && t.joySound.setVolume(n),
                    (i.show = "音量增强：" + (100 + 100 * n) + "%"),
                    e.range + "x"
                  );
                },
              },
            ],
          }),
          t.once("video:playing", function () {
            const s = window.Joysound || unsafeWindow.Joysound;
            s &&
              s.isSupport() &&
              ((t.joySound = t.joySound || new s()),
              t.joySound.hasSource() || t.joySound.init(e.$video),
              t.storage.get("sound-enhancer") &&
                (t.joySound.setEnabled(!0),
                n.update({
                  name: "sound-enhancer",
                  html: "音质增强",
                  switch: !0,
                })));
          }),
          { name: "sound" }
        );
      };
    }
  ]);