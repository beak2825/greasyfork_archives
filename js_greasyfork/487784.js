// ==UserScript==
// @name        Disable YouTube Video Ads
// @namespace   DisableYouTubeVideoAds
// @version     1.3.38
// @license     AGPLv3
// @author      Elline312
// @description Disable YouTube video & screen based ads at home page, and right before or in the middle of the main video playback. Also disable YouTube's anti-adblocker popup dialog. For new YouTube layout (Polymer) only.
// @website     https://greasyfork.org/en/users/1215420-elline312
// @match     https://www.youtube.com/*
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/487784/Disable%20YouTube%20Video%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/487784/Disable%20YouTube%20Video%20Ads.meta.js
// ==/UserScript==

((window, fn) => {

  fn = (a, ipse, haia, hca, rpo, et) => {

    if ((a = document.scripts[document.scripts.length - 1]) && (a.id === "dyvaUjs")) a.remove();

    et = document.styleSheetSetsz ? "beforescriptexecute" : false; //Firefox workaround

    JSON.parse_dyva = JSON.parse;
    JSON.parse = function(a) {
      var m, z;
      if (rpo) {
        a = rpo; //JSON.parse_dyva(a); //from xhr/fetch
        try {
          if (a.forEach) {
            a.forEach((p, a) => {
              if (p.player && p.player.args && (p.player.args.raw_player_response || p.player.args.player_response)) {
                patchPlayerResponse(a = p.player_response_);
                if (p.player.args.raw_player_response) {
                  p.raw_player_response = JSON.stringify(a)
                } else p.player_response = JSON.stringify(a)
              } else if (p.playerResponse) {
                patchPlayerResponse(p.playerResponse);
              }
            });
          } else patchPlayerResponse(a);
        } catch(z) {}
        rpo = null;
      } else if ((a = JSON.parse_dyva(a)).playerResponse) patchPlayerResponse(a.playerResponse);
      return a;
    };

    var ftc = window.fetch_dyva = window.fetch;
    window.fetch = function(u) {
      if (u) {
        if (u.substr && /\/v1\/player\/ad_break/.test(u)) return new Promise(() => {});
        if (u.url && u.url.substr && /\/v1\/player\/ad_break/.test(u.url)) return new Promise(() => {});
      }
      return ftc.apply(this, arguments);
    };

    var rj = Response.prototype.json_dyva = Response.prototype.json;
    Response.prototype.json = function() {
      var rs = this, p = rj.apply(this, arguments), pt = p.then;
      p.then = function(fn) {
        var fn_ = fn;
        fn = function(j) {
          if (/\/v1\/player\?/.test(rs.url)) rpo = j;
          if ("function" === typeof fn_) return fn_.apply(this, arguments);
        };
        return pt.apply(this, arguments);
      };
      return p;
    };
    var rt = Response.prototype.text;
    Response.prototype.text = function() {
      var rs = this, p = rt.apply(this, arguments), pt = p.then;
      p.then = function(fn) {
        var fn_ = fn;
        fn = function(t) {
          if (/\/v1\/player\?/.test(rs.url)) rpo = JSON.parse_dyva(t);
          if ("function" === typeof fn_) return fn_.apply(this, arguments);
        };
        return pt.apply(this, arguments);
      };
      return p;
    };

    window.XMLHttpRequest.prototype.open_dyva = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(mtd, url) {
      if (!(/get_midroll_info/).test(url) && !((/^\/watch/).test(location.pathname) && (/get_video_info/).test(url))) {
        this.url_dyva = url;
        return this.open_dyva.apply(this, arguments);
      }
    };
    window.XMLHttpRequest.prototype.addEventListener_dyva = window.XMLHttpRequest.prototype.addEventListener;
    window.XMLHttpRequest.prototype.addEventListener = function(typ, fn) {
      if (typ === "readystatechange") {
        var f = fn;
        fn = function() {
          var z;
          if (this.readyState === 4) {
            if (this.url_dyva?.includes("youtubei/v1/player")) {
              rpo = JSON.parse_dyva(this.responseText);
              try {
                patchPlayerResponse(rpo);
              } catch(z) {}
            } else if ((/\/watch\?|get_video_info/).test(this.url_dyva)) {
              rpo = JSON.parse_dyva(this.responseText);
              try {
                rpo.forEach(p => {
                  if (p.player && p.player.args && (p.player.args.raw_player_response || p.player.args.player_response)) {
                    p.playerResponse_ = JSON.parse_dyva(p.player.args.raw_player_response || p.player.args.player_response);
                    if (p.playerResponse_.playabilityStatus && (p.playerResponse_.playabilityStatus.status === "LOGIN_REQUIRED")) {
                      nav.navigate({commandMetadata: {webCommandMetadata: {url: location.href, webPageType: "WEB_PAGE_TYPE_BROWSE"}}}, false);
                      return;
                    }
                    patchPlayerResponse(p.playerResponse_);
                    if (p.player.args.raw_player_response) {
                      p.player.args.raw_player_response = JSON.stringify(p.playerResponse_)
                    } else p.player.args.player_response = JSON.stringify(p.playerResponse_)
                  } else if (p.playerResponse) {
                    patchPlayerResponse(p.playerResponse);
                  }
                });
              } catch(z) {}
            }
          }
          return f.apply(this, arguments);
        };
      }
      return this.addEventListener_dyva.apply(this, arguments);
    };

    window.Node.prototype.appendChild_dyva = window.Node.prototype.appendChild;
    window.Node.prototype.appendChild = function(node) {
      var a;
      if (!ipse && (a = document.querySelector('ytd-watch-flexy')) && (a = a.constructor.prototype) && a.isPlaShelfEnabled_) {
        a.isPlaShelfEnabled_ = () => false;
        ipse = true;
      }
      if ((!hca || !haia) && (a = document.querySelector('ytd-watch-next-secondary-results-renderer')) && (a = a.constructor.prototype)) {
        if (a.hasAllowedInstreamAd_ && !haia) {
          a.hasAllowedInstreamAd_ = () => false;
          haia = true;
        }
        if (a.hasCompanionAds_ && !hca) {
          a.hasCompanionAds_ = () => false;
          hca = true;
        }
      }
      if ((node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) && Array.from(node.childNodes).some((n, i) => {
        if (n.id === "masthead-ad") {
          n.style.setProperty("display", "none", "important");
          //n.remove();
          return true;
        }
      })); //window.Node.prototype.appendChild = window.Node.prototype.appendChild_dyva;
      if (node.querySelector && (a = node.querySelector('.ytp-ad-skip-button'))) a.click();
      return this.appendChild_dyva.apply(this, arguments);
    };

    function patchPlayerResponse(playerResponse) {
      delete playerResponse.adBreakHeartbeatParams;
      if (playerResponse.adPlacements) playerResponse.adPlacements = [];
      if (playerResponse.adSlots) playerResponse.adSlots = [];
      if (playerResponse.auxiliaryUi?.messageRenderers?.bkaEnforcementMessageViewModel) {
        delete playerResponse.auxiliaryUi.messageRenderers.bkaEnforcementMessageViewModel;
        if (!Object.keys(playerResponse.auxiliaryUi.messageRenderers).length) {
          delete playerResponse.auxiliaryUi.messageRenderers;
          if (!Object.keys(playerResponse.auxiliaryUi).length) delete playerResponse.auxiliaryUi
        }
        var vd = playerResponse.videoDetails;
        delete playerResponse.videoDetails;
        Object.defineProperty(playerResponse, "videoDetails", {
          get() {
            return vd
          },
          set(v) {
            if (this.playabilityStatus?.errorScreen) {
              delete this.playabilityStatus.errorScreen;
              this.playabilityStatus.status = "OK"
            }
            return v
          }
        });
      }
      if (playerResponse.playerAds) playerResponse.playerAds = [];
      if (playerResponse.playbackTracking) {
        delete playerResponse.playbackTracking.googleRemarketingUrl;
        delete playerResponse.playbackTracking.youtubeRemarketingUrl;
      }
    }

    function patchPlayerArgs(args, a) {
      if (args.ad_device) args.ad_device = "0";
      if (args.ad_flags) args.ad_flags = 0;
      if (args.ad_logging_flag) args.ad_logging_flag = "0";
      if (args.ad_preroll) args.ad_preroll = "0";
      if (args.ad_slots) delete args.ad_slots;
      if (args.ad_tag) delete args.ad_tag;
      if (args.ad3_module) args.ad3_module = "0";
      if (args.adsense_video_doc_id) delete args.adsense_video_doc_id;
      if (args.afv) args.afv = false;
      if (args.afv_ad_tag) delete args.afv_ad_tag;
      if (args.allow_html5_ads) args.allow_html5_ads = 0;
      if (args.csi_page_type) args.csi_page_type = args.csi_page_type.replace(/watch7ad/, "watch7");
      if (args.enable_csi) args.enable_csi = "0";
      if (args.pyv_ad_channel) delete args.pyv_ad_channel;
      if (args.show_pyv_in_related) args.show_pyv_in_related = false;
      if (args.vmap) delete args.vmap;
      if (args.raw_player_response) {
        patchPlayerResponse(a = args.raw_player_response.charAt ? JSON.parse_dyva(args.raw_player_response) : args.raw_player_response);
        if (args.raw_player_response.charAt) args.raw_player_response = JSON.stringify(a)
      } else if (args.player_response) {
        patchPlayerResponse(a = JSON.parse_dyva(args.player_response));
        args.player_response = JSON.stringify(a);
      }
    }

    function patchSpf() {
      if (window.spf && !spf.request_dyva) {
        spf.request_dyva = spf.request;
        spf.request = function(a, b) {
          if (b && b.onDone) {
            var onDone_ = b.onDone;
            b.onDone = function(response) {
              var a = response;
              if (a && (/\/watch\?/).test(a.url) && (a = a.response) && (a = a.parts)) {
                a.forEach((p, a) => {
                  if (p.player && p.player.args && (p.player.args.raw_player_response || p.player.args.player_response)) {
                    p = p.player.args;
                    patchPlayerResponse(a = JSON.parse_dyva(p.raw_player_response || p.player_response));
                    if (p.raw_player_response) {
                      p.raw_player_response = JSON.stringify(a)
                    } else p.player_response = JSON.stringify(a)
                  } else if (p.playerResponse) {
                    patchPlayerResponse(p.playerResponse);
                  }
                });
              }
              return onDone_.apply(this, arguments);
            };
          }
          return this.request_dyva.apply(this, arguments);
        };
        return;
      }
    }

    var ldh, docnt = 5 * 60;

    function do1(ev, a) {

      if ((a = document.scripts[document.scripts.length - 1]) && /"adPlacements"/.test(a.text)) {
        a.text = a.text.replace(/"adPlacements"/, '"adPlacements":[],"zadPlacements"');
      }
      if (window.loadDataHook) {
        if (!window.loadDataHook.dyva) {
          ldh = window.loadDataHook;
          window.loadDataHook = function(ep, dt) {
            if (dt.playabilityStatus && (dt.playabilityStatus === "LOGIN_REQUIRED")) {
              location.href = location.href;
              throw "Ain't gonna login";
            }
            patchPlayerResponse(dt);
            return ldh.apply(this, arguments);
          };
          window.loadDataHook.dyva = true;
        }
      }
      if (window.ytcfg && window.ytcfg.set) {
        if (!window.ytcfg.set.dyva) {
          var ytcfgSet = window.ytcfg.set;
          window.ytcfg.set = function(ytConfig, ytValue){
            if (window.ytInitialPlayerResponse) {
              if (ytInitialPlayerResponse.playabilityStatus && (ytInitialPlayerResponse.playabilityStatus === "LOGIN_REQUIRED")) {
                location.href = location.href;
                throw "Ain't gonna login";
              }
              patchPlayerResponse(window.ytInitialPlayerResponse);
            }
            patchSpf();
            if (ytConfig) {
              var a;
              if (a = ytConfig.EXPERIMENT_FLAGS) {
                if (a.enable_auto_play_param_fix_for_masthead_ad) a.enable_auto_play_param_fix_for_masthead_ad = false;
                if (a.html5_check_both_ad_active_and_ad_info) a.html5_check_both_ad_active_and_ad_info = false;
                if (a.web_enable_ad_signals_in_it_context) a.web_enable_ad_signals_in_it_context = false;
              }
              if (ytConfig.SKIP_RELATED_ADS === false) ytConfig.SKIP_RELATED_ADS = true;
              if (ytConfig.TIMING_ACTION) ytConfig.TIMING_ACTION = ytConfig.TIMING_ACTION.replace(/watch7ad/, "watch7");
              if (a = ytConfig.TIMING_INFO) {
                if (a.yt_ad) a.yt_ad = 0;
                if (a.yt_ad_an) delete a.yt_ad_an;
                if (a.yt_ad_pr) a.yt_ad_pr = 0;
              }
              if (
                (a = ytConfig.WEB_PLAYER_CONTEXT_CONFIGS) && (a = a.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH) &&
                a.serializedExperimentFlags && a.serializedExperimentFlags.replace
              ) {
                a.serializedExperimentFlags = a.serializedExperimentFlags.replace(
                  /([a-z][^=]+)=([^&]+)/g, (s, a, b) => {
                    switch (a) {
                      case "enable_ad_break_end_time_on_pacf_tvhtml5":
                      case "enable_auto_play_param_fix_for_masthead_ad":
                      case "html5_check_both_ad_active_and_ad_info": b = false; break;
                      case "web_enable_ad_signals_in_it_context":
                      case "web_player_gvi_wexit_adunit": b = false; break;
                    }
                    return a + "=" + b;
                  }
                );
              }
            }
            return ytcfgSet.apply(this, arguments);
          };
          window.ytcfg.set.dyva = true;
        }
      }
      if (window.yt) {
        if (window.yt.player && window.yt.player.Application) {
          if (window.yt.player.Application.create) {
            if (!window.yt.player.Application.create.dyva) {
              var ytPlayerApplicationCreate = window.yt.player.Application.create;
              window.yt.player.Application.create = function(id, ytPlayerConfig) {
                if ((id === "player-api") && ytPlayerConfig && ytPlayerConfig.args) {
                  if (ytPlayerConfig.args.raw_player_response) patchPlayerResponse(ytPlayerConfig.args.raw_player_response);
                  if (ytPlayerConfig.args.vmap) delete ytPlayerConfig.args.vmap;
                }
                return ytPlayerApplicationCreate.apply(this, arguments);
              };
              window.yt.player.Application.create.dyva = true;
            }
          }
          if (window.yt.player.Application.createAlternate) {
            if (!window.yt.player.Application.createAlternate.dyva) {
              var ytPlayerApplicationCreateAlternate = window.yt.player.Application.createAlternate;
              window.yt.player.Application.createAlternate = function(id, ytPlayerConfig) {
                if ((id === "player-api") && ytPlayerConfig && ytPlayerConfig.args) {
                  if (ytPlayerConfig.args.raw_player_response) patchPlayerResponse(ytPlayerConfig.args.raw_player_response);
                  if (ytPlayerConfig.args.vmap) delete ytPlayerConfig.args.vmap;
                }
                return ytPlayerApplicationCreateAlternate.apply(this, arguments);
              };
              window.yt.player.Application.createAlternate.dyva = true;
            }
          }
        }
        if (window.yt.setConfig) {
          if (!window.yt.setConfig.dyva) {
            var ytSetConfig = window.yt.setConfig;
            window.yt.setConfig = function(ytConfig){
              if (ytConfig && ytConfig.ADS_DATA) delete ytConfig.ADS_DATA;
              return ytSetConfig.apply(this, arguments);
            };
            window.yt.setConfig.dyva = true;
          }
        }
      }
      if (window.ytplayer && window.ytplayer.config && window.ytplayer.config.args) {
        if (!window.ytplayer.config.args.dvya) {
          patchPlayerArgs(window.ytplayer.config.args);
          window.ytplayer.config.args.dvya = true;
        }
      }
      if (document.readyState !== "complete") {
        if ((et === false) && (--docnt > 0)) requestAnimationFrame(do1)
      } else if (et !== false) removeEventListener(et, do1)
    }
    addEventListener(et, do1);
    do1();

    addEventListener("spfpartprocess", function(ev) { //old youtube
      if (ev.detail && ev.detail.part && ev.detail.part.data &&
          ev.detail.part.data.swfcfg && ev.detail.part.data.swfcfg.args) {
        patchPlayerArgs(ev.detail.part.data.swfcfg.args);
      }
    }, true);

    addEventListener("load", a => {
      if (!(a = window.ayvp_cssOverride)) {
        a = document.createElement("STYLE");
        a.id = "ayvp_cssOverride";
        a.innerHTML = `\/*
.video-ads{display:none!important}
.ytp-ad-overlay-open .caption-window.ytp-caption-window-bottom{margin-bottom:4em}
.ytp-autohide .caption-window.ytp-caption-window-bottom, .ytp-hide-controls .caption-window.ytp-caption-window-bottom{margin-bottom:0!important}`;
        document.documentElement.appendChild(a);
      }
      if (et === "message") {
        if (document.readyState !== "complete") {
          postMessage({});
        } else removeEventListener(et, do1);
      }
    });

    var dce = document.createElement;
    document.createElement = function(tag) {
      if ((tag === "meta") && window.ytInitialPlayerResponse && ytInitialPlayerResponse.adPlacements && ytInitialPlayerResponse.adPlacements.length) {
        patchPlayerResponse(window.ytInitialPlayerResponse)
      }
      return dce.apply(this, arguments)
    };
  };
  if (("object" === typeof GM_info) && ["FireMonkey", "Greasemonkey"].includes(GM_info.scriptHandler)) {
    //FireMonkey and new Greasemonkey workaround for compatibility with the original (unrestricted) Greasemonkey version.
    let e = document.createElement("SCRIPT");
    e.id = "dyvaUjs";
    e.text = "(" + fn + ")()";
    document.documentElement.appendChild(e);
  } else fn();

})(unsafeWindow);
