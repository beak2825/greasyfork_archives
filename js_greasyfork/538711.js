// ==UserScript==
// @name         BerrizDown
// @namespace    https://userscripts.crux.cx
// @version      0.2.0
// @author       Crux (@iu_crux)
// @description  Get download links for Berriz videos (https://berriz.in/)
// @icon         data:image/png;base64,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
// @match        https://berriz.in/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/@tanstack/react-query@4.39.1/build/umd/index.production.js
// @downloadURL https://update.greasyfork.org/scripts/538711/BerrizDown.user.js
// @updateURL https://update.greasyfork.org/scripts/538711/BerrizDown.meta.js
// ==/UserScript==

(function (require$$0, require$$0$1, reactQuery) {
  'use strict';

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
  var hasRequiredReactJsxRuntime_production_min;
  function requireReactJsxRuntime_production_min() {
    if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
    hasRequiredReactJsxRuntime_production_min = 1;
    var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    reactJsxRuntime_production_min.Fragment = l;
    reactJsxRuntime_production_min.jsx = q;
    reactJsxRuntime_production_min.jsxs = q;
    return reactJsxRuntime_production_min;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production_min();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  var client = {};
  var hasRequiredClient;
  function requireClient() {
    if (hasRequiredClient) return client;
    hasRequiredClient = 1;
    var m = require$$0$1;
    {
      client.createRoot = m.createRoot;
      client.hydrateRoot = m.hydrateRoot;
    }
    return client;
  }
  var clientExports = requireClient();
  const queryClient = new reactQuery.QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });
  const ErrorBoundaryContext = require$$0.createContext(null);
  const initialState = {
    didCatch: false,
    error: null
  };
  class ErrorBoundary extends require$$0.Component {
    constructor(props) {
      super(props);
      this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
      this.state = initialState;
    }
    static getDerivedStateFromError(error) {
      return {
        didCatch: true,
        error
      };
    }
    resetErrorBoundary() {
      const {
        error
      } = this.state;
      if (error !== null) {
        var _this$props$onReset, _this$props;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        (_this$props$onReset = (_this$props = this.props).onReset) === null || _this$props$onReset === void 0 ? void 0 : _this$props$onReset.call(_this$props, {
          args,
          reason: "imperative-api"
        });
        this.setState(initialState);
      }
    }
    componentDidCatch(error, info) {
      var _this$props$onError, _this$props2;
      (_this$props$onError = (_this$props2 = this.props).onError) === null || _this$props$onError === void 0 ? void 0 : _this$props$onError.call(_this$props2, error, info);
    }
    componentDidUpdate(prevProps, prevState) {
      const {
        didCatch
      } = this.state;
      const {
        resetKeys
      } = this.props;
      if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
        var _this$props$onReset2, _this$props3;
        (_this$props$onReset2 = (_this$props3 = this.props).onReset) === null || _this$props$onReset2 === void 0 ? void 0 : _this$props$onReset2.call(_this$props3, {
          next: resetKeys,
          prev: prevProps.resetKeys,
          reason: "keys"
        });
        this.setState(initialState);
      }
    }
    render() {
      const {
        children,
        fallbackRender,
        FallbackComponent,
        fallback
      } = this.props;
      const {
        didCatch,
        error
      } = this.state;
      let childToRender = children;
      if (didCatch) {
        const props = {
          error,
          resetErrorBoundary: this.resetErrorBoundary
        };
        if (typeof fallbackRender === "function") {
          childToRender = fallbackRender(props);
        } else if (FallbackComponent) {
          childToRender = require$$0.createElement(FallbackComponent, props);
        } else if (fallback !== void 0) {
          childToRender = fallback;
        } else {
          throw error;
        }
      }
      return require$$0.createElement(ErrorBoundaryContext.Provider, {
        value: {
          didCatch,
          error,
          resetErrorBoundary: this.resetErrorBoundary
        }
      }, childToRender);
    }
  }
  function hasArrayChanged() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
  }
  function sleep(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
  const mediaRegex = /https:\/\/berriz\.in\/(?:ko|en)\/[a-zA-Z0-9]+\/(media\/content|live\/replay)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
  const needAppLabels = ["앱 실행이 필요합니다", "Open the app"];
  function useBerrizMedia() {
    const [media, setMedia] = require$$0.useState(null);
    require$$0.useEffect(() => {
      var _a;
      let counter = 0;
      detect();
      async function detect() {
        var _a2;
        const matches = mediaRegex.exec(window.location.href);
        if (matches) {
          counter++;
          const currentCounter = counter;
          const type = matches[1];
          const id = matches[2];
          let el = null;
          for (let retry = 0; retry < 100; retry++) {
            el = document.querySelector(".muscat-ui-modal-layer h3");
            if (el) {
              break;
            }
            await sleep(0);
            if (currentCounter !== counter) {
              return;
            }
          }
          if ((type === "media/content" || type === "live/replay") && el && el.textContent && needAppLabels.includes(el.textContent)) {
            el.textContent = "BerrizDown";
            (_a2 = document.querySelector(".muscat-ui-modal-layer")) == null ? void 0 : _a2.classList.add("hidden");
            setMedia({ type, id });
          } else {
            setMedia(null);
          }
        } else {
          setMedia(null);
        }
      }
      (_a = window.navigation) == null ? void 0 : _a.addEventListener("navigatesuccess", detect);
      return () => {
        var _a2;
        (_a2 = window.navigation) == null ? void 0 : _a2.removeEventListener("navigatesuccess", detect);
      };
    }, []);
    return media;
  }
  function getCookieValue(name) {
    var _a;
    return ((_a = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")) == null ? void 0 : _a.pop()) || "";
  }
  function getVodPlaybackAreaContextQueryKey(mediaId) {
    return ["vodPlaybackAreaContext", mediaId];
  }
  async function getVodPlaybackAreaContext(context) {
    const mediaId = context.queryKey[1];
    const response = await fetch(
      `https://svc-api.berriz.in/service/v1/medias/vod/${mediaId}/playback_area_context`,
      {
        credentials: "include"
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    if (data.code !== "0000" || data.message !== "SUCCESS") {
      throw new Error(data.message);
    }
    return data;
  }
  function Modal({ children }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-wrapper", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal", children }) });
  }
  function formatSeconds(seconds) {
    if (seconds < 0) {
      throw new Error("Seconds cannot be negative");
    }
    if (!Number.isInteger(seconds)) {
      seconds = Math.floor(seconds);
    }
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (totalMinutes > 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${totalMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  function Preview({ mediaInfo, playbackInfo }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "video-preview", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "video-wrapper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "video-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            alt: mediaInfo.title,
            loading: "lazy",
            decoding: "async",
            "data-nimg": "fill",
            className: "object-contain",
            sizes: "(max-width: 1320px) 33vw, 25vw",
            srcSet: `
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/256/quality/75/optimize   256w,
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/384/quality/75/optimize   384w,
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/768/quality/75/optimize   768w,
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/1080/quality/75/optimize 1080w,
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/1320/quality/75/optimize 1320w,
              ${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/1920/quality/75/optimize 1920w
            `,
            src: `${mediaInfo.thumbnailUrl}/dims/autorotate/on/resize/1920/quality/75/optimize`,
            style: {
              position: "absolute",
              width: "100%",
              height: "100%",
              inset: 0,
              color: "transparent"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "video-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "duration-text", children: formatSeconds(playbackInfo.duration) }) }),
        mediaInfo.isFanclubOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "badge-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "18",
            height: "18",
            fill: "none",
            viewBox: "0 0 18 18",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: "url(#ic_bullet_fanclub_shadow_18_svg__a)", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "8.5", r: "7.5", fill: "#6870FF" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "8.5", r: "8", stroke: "#525BF9" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  fill: "#fff",
                  d: "M9 2.875A5.62 5.62 0 0 1 3.375 8.5 5.63 5.63 0 0 1 9 14.125 5.62 5.62 0 0 1 14.625 8.5 5.63 5.63 0 0 1 9 2.875"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "filter",
                {
                  id: "ic_bullet_fanclub_shadow_18_svg__a",
                  width: "17",
                  height: "18",
                  x: "0.5",
                  y: "0",
                  colorInterpolationFilters: "sRGB",
                  filterUnits: "userSpaceOnUse",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "feFlood",
                      {
                        floodOpacity: "0",
                        result: "BackgroundImageFix"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "feColorMatrix",
                      {
                        in: "SourceAlpha",
                        result: "hardAlpha",
                        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("feOffset", { dy: "1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in2: "hardAlpha", operator: "out" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "feBlend",
                      {
                        in2: "BackgroundImageFix",
                        result: "effect1_dropShadow_21279_44665"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "feBlend",
                      {
                        in: "SourceGraphic",
                        in2: "effect1_dropShadow_21279_44665",
                        result: "shape"
                      }
                    )
                  ]
                }
              ) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "video-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "video-title", children: mediaInfo.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "meta-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "14",
              height: "13",
              fill: "none",
              viewBox: "0 0 14 13",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#ic_list_video_14_svg__a)", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      width: "13",
                      height: "12",
                      x: "0.5",
                      y: "0.5",
                      stroke: "#A0A0A0",
                      rx: "1.9"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      fill: "#A0A0A0",
                      fillRule: "evenodd",
                      d: "M9.167 6.163a.5.5 0 0 1 0 .8l-2.667 2a.5.5 0 0 1-.8-.4v-4a.5.5 0 0 1 .8-.4z",
                      clipRule: "evenodd"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "ic_list_video_14_svg__a", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#fff", d: "M0 0h14v13H0z" }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta-details", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "meta-text", children: "영상" }),
            mediaInfo.isFanclubOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "2",
                  height: "3",
                  fill: "none",
                  viewBox: "0 0 2 3",
                  className: "dot",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "1", cy: "1.5", r: "1", fill: "#A0A0A0" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fanclub-text", children: "Fanclub Only" })
            ] })
          ] })
        ] }) })
      ] })
    ] }) });
  }
  function DrmInfo({ drmInfo }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "drm-info-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 9h.01" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11 12h1v4h1" })
            ]
          }
        ),
        "This video is DRM-protected and requires manual decryption. Please use the information below to decrypt it yourself."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "drm-info", children: JSON.stringify({ drmInfo }, null, 2) })
    ] });
  }
  function Media({ mediaInfo, playbackInfo }) {
    const [copied, setCopied] = require$$0.useState(false);
    const handleCopy = async () => {
      await navigator.clipboard.writeText(playbackInfo.dash.playbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "modal-title", children: "BerrizDown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Preview, { mediaInfo, playbackInfo }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-input-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "modal-input",
            value: playbackInfo.dash.playbackUrl,
            readOnly: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "copy-button", onClick: handleCopy, title: "Copy URL", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" })
            ]
          }
        ) }),
        copied && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "copied-message", children: "Copied!" })
      ] }),
      playbackInfo.isDrm && /* @__PURE__ */ jsxRuntimeExports.jsx(DrmInfo, { drmInfo: playbackInfo.drmInfo }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "modal-button", onClick: () => navigation == null ? void 0 : navigation.back(), children: "Cancel" })
    ] });
  }
  function Vod({ mediaId }) {
    const { data } = reactQuery.useSuspenseQuery({
      queryKey: getVodPlaybackAreaContextQueryKey(mediaId),
      queryFn: getVodPlaybackAreaContext
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Media, { mediaInfo: data.data.media, playbackInfo: data.data.media.vod });
  }
  function getLiveReplayPlaybackAreaContextQueryKey(mediaId) {
    return ["liveReplayPlaybackAreaContext", mediaId];
  }
  async function getLiveReplayPlaybackAreaContext(context) {
    const mediaId = context.queryKey[1];
    const response = await fetch(
      `https://svc-api.berriz.in/service/v1/medias/live/replay/${mediaId}/playback_area_context`,
      {
        credentials: "include"
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    if (data.code !== "0000" || data.message !== "SUCCESS") {
      throw new Error(data.message);
    }
    return data;
  }
  function LiveReplay({ mediaId }) {
    const { data } = reactQuery.useSuspenseQuery({
      queryKey: getLiveReplayPlaybackAreaContextQueryKey(mediaId),
      queryFn: getLiveReplayPlaybackAreaContext
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Media,
      {
        mediaInfo: data.data.media,
        playbackInfo: data.data.media.live.replay
      }
    );
  }
  function NotLoggedIn() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "modal-title", children: "BerrizDown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "modal-content", children: "Use after login." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "modal-button", onClick: () => navigation == null ? void 0 : navigation.back(), children: "Back" })
    ] });
  }
  function Loading() {
    const [showLoading, setShowLoading] = require$$0.useState(false);
    require$$0.useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 200);
      return () => clearTimeout(timer);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "modal-title", children: "BerrizDown" }),
      showLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "loading-text", children: "Loading video information..." })
      ] })
    ] });
  }
  function ErrorFallback({
    error,
    resetErrorBoundary
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "modal-title", children: "Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "modal-content", style: { whiteSpace: "pre" }, children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "modal-button", onClick: resetErrorBoundary, children: "Try Again" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "modal-button", onClick: () => navigation == null ? void 0 : navigation.back(), children: "Cancel" })
      ] })
    ] });
  }
  function App() {
    const media = useBerrizMedia();
    const authStatus = getCookieValue("auth_status") === "authenticated";
    const { reset } = reactQuery.useQueryErrorResetBoundary();
    return media ? authStatus ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { onReset: reset, fallbackRender: ErrorFallback, children: /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Loading, {}), children: media.type === "media/content" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Vod, { mediaId: media.id }) : media.type === "live/replay" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LiveReplay, { mediaId: media.id }) : null }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(NotLoggedIn, {}) : null;
  }
  function Root() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactQuery.QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) });
  }
  const injectedStyle = "*{box-sizing:border-box;padding:0;margin:0}h3{margin:0}.modal-wrapper{position:absolute;top:0;left:0;z-index:100;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}.modal{min-width:400px;max-width:70vw;border-radius:20px;background-color:#2a2a2a;padding:24px;text-align:center;display:flex;flex-direction:column;row-gap:24px}.modal-title{font-size:18px;font-weight:600;line-height:24px;color:#fff}.modal-content{font-size:15px;font-weight:400;line-height:20px;color:#e5e5e5}.modal-button{font-size:15px;font-weight:600;line-height:20px;color:#fff;padding:12px 30px;border:1px solid hsla(0,0%,100%,.22);border-radius:8px;background:none;display:flex;flex:1 1 0%;height:44px;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}.modal-button:active{transform:scale(.95)}.modal-button:disabled{color:#ffffff38;border-color:#ffffff1a}.modal-input{width:700px;max-width:100%;outline:2px solid transparent;outline-offset:2px;background-color:transparent;color:#fafafa;font-size:15px;font-weight:400;line-height:20px;padding:16px 40px 16px 16px;border:1px solid hsla(0,0%,100%,.22);border-radius:8px;flex-grow:1}.modal-input-container{display:flex;align-items:center;position:relative}.copy-button{background:none;border:none;color:#fff;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;width:24px;height:24px;position:absolute;right:10px;top:50%;z-index:1;transform:translateY(-50%) scale(1);transition:transform .2s cubic-bezier(.4,0,.2,1)}.copy-button:active{transform:translateY(-50%) scale(.8)}.copied-message{position:absolute;right:40px;top:50%;transform:translateY(-50%);font-size:12px;color:#fff;background-color:#000000b3;padding:2px 5px;border-radius:4px;white-space:nowrap;z-index:2}.debug{font-size:15px;font-weight:400;line-height:20px;color:#e5e5e5;font-family:monospace;text-align:left;line-break:anywhere;-webkit-user-select:text;user-select:text}.drm-info-container{text-align:left}.drm-info-container p{display:inline-flex;align-items:center;margin-bottom:8px;font-size:.75rem;font-weight:400;line-height:1rem;color:#999}.drm-info-container p svg{margin-right:4px}.drm-info{width:700px;max-width:100%;overflow-x:auto;background-color:#202020;padding:16px;border-radius:8px;-webkit-user-select:text;user-select:text}.video-preview{width:100%}.video-preview .video-wrapper{display:flex;width:100%;max-width:707px;flex-direction:column}.video-preview .video-container{position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:12px}.video-preview .object-contain{object-fit:contain}.video-preview .video-overlay{position:absolute;bottom:0;left:0;display:flex;height:60px;width:100%;align-items:flex-end;justify-content:flex-end;padding-left:14px;padding-right:14px;padding-bottom:14px;background:linear-gradient(to top,#00000080,#0000)}.video-preview .duration-text{color:#fff;font-size:13px;font-weight:400;line-height:17px}.video-preview .badge-container{position:absolute;left:10px;top:10px}.video-preview .video-border{border:1px solid hsla(0,0%,100%,.1);position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;border-radius:12px;border-style:solid}.video-preview .mt-8{margin-top:8px}.video-preview .video-title{color:#fafafa;font-size:1rem;font-weight:400;line-height:1.5rem;overflow:hidden;word-break:break-all;text-align:left}.video-preview .meta-container{margin-top:6px;display:flex;flex-direction:column}.video-preview .meta-row{display:flex;align-items:center}.video-preview .meta-details{display:flex;align-items:center;margin-left:6px}.video-preview .meta-text{font-size:.75rem;font-weight:400;line-height:1rem;color:#999}.video-preview .dot{flex-shrink:0;margin-left:4px}.video-preview .fanclub-text{font-size:.75rem;font-weight:400;line-height:1rem;color:#969bf5;flex-shrink:0;margin-left:6px}.loading-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:20px}.loading-spinner{width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}.loading-text{color:#999;font-size:14px;margin:0}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}";
  const root = document.createElement("div");
  root.id = "berriz-userscript-content-view-root";
  document.body.append(root);
  const rootIntoShadow = document.createElement("div");
  rootIntoShadow.id = "shadow-root";
  const shadowRoot = root.attachShadow({ mode: "open" });
  if (navigator.userAgent.includes("Firefox")) {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = injectedStyle;
    shadowRoot.appendChild(styleElement);
  } else {
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(injectedStyle);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }
  shadowRoot.appendChild(rootIntoShadow);
  clientExports.createRoot(rootIntoShadow).render(/* @__PURE__ */ jsxRuntimeExports.jsx(Root, {}));

})(React, ReactDOM, ReactQuery);