// ==UserScript==
// @name         百度网盘视频播放助手
// @namespace    https://github.com/junbinding/mini-scripts
// @version      1.0.1
// @description  修复百度网盘的Web端排序容易出现异常，比如 10-2-xx 的视频出现在 2-xxx 前面。
// @author       丫丫爸爸
// @match        https://pan.baidu.com/play/video
// @icon         https://pic.imgdb.cn/item/62d4b9faf54cd3f9377a7127.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448032/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448032/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 所有的视频列表
var allVideos = [];
// 修改注入 define 函数
var originDefine = null;

// 获取连接参数
function getLinkParam(name, url) {
  url = url || location.href;
  var reg = new RegExp(`(^|&|#)${name}=([^#&]*)(?=#|&|$)`, 'g');
  var r = url.split('?')[1]; // search,查询？后面的参数，并匹配正则
  var res = r && reg.exec(r);
  while (res) {
    let curr = reg.exec(r);
    if (!curr) {
      return decodeURIComponent(res[2] || '');
    }

    res = curr;
  }

  return null;
}

// 获取下一个视频路径
function getNextPath() {
  const currentPath = getLinkParam('path', location.href);
  if (!currentPath) {
    return;
  }
  const idx = allVideos.findIndex(
    (n) => n.path === decodeURIComponent(currentPath),
  );
  if (idx === -1) {
    return;
  }

  if (idx === allVideos.length - 1) {
    return;
  }

  return allVideos[idx + 1].path;
}

Object.defineProperty(window, 'define', {
  get() {
    if (!originDefine) {
      return undefined;
    }

    return (...args) => {
      if (
        args[0] ===
        'disk-system:widget/pageModule/video/VideoHorList/listInit.js'
      ) {
        originDefine(
          'disk-system:widget/pageModule/video/VideoHorList/listInit.js',
          function (e, t, i) {
            var n = e('base:widget/libs/jquerypacket.js'),
              o = e('base:widget/tools/service/tools.path.js'),
              r = e('system-core:context/context.js').instanceForSystem,
              a = r.router,
              s = e(
                'disk-system:widget/pageModule/video/VideoHorList/VideoHorList.js',
              ),
              l = r.tools.shareDirManager,
              d = {
                conf: {
                  videoListView: null,
                  entranceQuery: {},
                  listFileCache: !1,
                  videoPlaying: !1,
                  refresh: !0,
                },
                refreshList: function () {
                  var e = a.query.getAll();
                  if (!l.getFakepathInfo(e.path)) {
                    n('[node-type="video-other-video"]').show(),
                      window.disk.DEBUG &&
                        console.log('Start to navigate to = ', e.path),
                      d.conf.entranceQuery || (d.conf.entranceQuery = e),
                      d.conf.videoListView || d.initVideoListView();
                    var t = e.path;
                    if ('undefined' != typeof t) {
                      var i = o.parseDirFromPath(t),
                        r = i.substring(0, i.lastIndexOf('.'));
                      n('.video-title span').text(r).attr('title', r),
                        d.loadDir.call(null, t, function (e) {
                          var t = e.playing;
                          (d.conf.videoPlaying = t),
                            d.conf.refresh
                              ? ((d.conf.refresh = !1),
                                n('#videoListView-tips').hide(),
                                d.conf.videoListView.setBackedData(
                                  e,
                                  d.conf.videoPlaying,
                                  e.playingIndex,
                                ))
                              : (d.conf.videoListView.updatePlaying(
                                  e.playingIndex,
                                ),
                                d.conf.videoListView.horListPanel &&
                                  d.conf.videoListView.horListPanel.focus(
                                    e.playingIndex,
                                  ));
                        });
                    }
                  }
                },
                initVideoListView: function () {
                  (d.conf.videoListView = new s(
                    {
                      listContainer: document.getElementById('videoListView'),
                      upArrow: document.getElementById('video-menu-left'),
                      downArrow: document.getElementById('video-menu-right'),
                    },
                    {},
                  )),
                    d.conf.videoListView.on('updatePlaying', function (e) {
                      var t = e.data,
                        i = t.path,
                        o = t.position,
                        r = n.extend({}, d.conf.entranceQuery, {
                          path: i,
                          t: o,
                        });
                      a.push({
                        name: 'video',
                        query: r,
                      });
                    });
                },
                loadDir: function (e, t) {
                  if (d.conf.listFileCache)
                    return void (
                      'function' == typeof t &&
                      t(d.filterCurrentVideo(e, d.conf.listFileCache))
                    );
                  var i = function () {
                      n('#videoListView-tips').html(
                        '哦噢，播放列表加载失败，请刷新页面后重试',
                      );
                    },
                    r = o.parseFullDirFromPath(e) || '/',
                    a = {
                      parent_path: r,
                      page: 1,
                      num: 500,
                      category: 1,
                    },
                    s = [],
                    l = function () {
                      d.loadFileList(
                        a,
                        function (e) {
                          Array.prototype.push.apply(s, e),
                            e.length >= a.num
                              ? ((a.page = a.page + 1), l())
                              : c();
                          allVideos = s;
                        },
                        i,
                      );
                    },
                    c = function () {
                      s.length > 0
                        ? 'function' == typeof t &&
                          (s.sort(d.sortByName),
                          (d.conf.listFileCache = s),
                          t(d.filterCurrentVideo(e, s)))
                        : i();
                    };
                  l();
                },
                filterCurrentVideo: function (e, t) {
                  var i = [],
                    n = !1,
                    o = !1,
                    r = !1,
                    a = !1,
                    s = !1;
                  if (t && t.length)
                    for (var l = 0; l < t.length; ++l) {
                      var d = t[l];
                      d.path === e
                        ? ((n = d), (o = i.length), (a = r))
                        : (r === n && (s = d), (r = d)),
                        i.push(d);
                    }
                  return (
                    (i.playing = n),
                    (i.playingIndex = o),
                    (i.prev = a),
                    (i.next = s),
                    i
                  );
                },
                loadFileList: function (e, t, i) {
                  n.getJSON('/api/categorylist', e, function (e) {
                    e && 0 === e.errno && e.info
                      ? 'function' == typeof t && t.call(null, e.info)
                      : i.call(null);
                  }).error(function () {
                    i.call(null);
                  });
                },
                sortByName: function (a, b) {
                  const aKey = a.server_filename.slice(0, 9).match(/(\d+)/g);
                  const bKey = b.server_filename.slice(0, 9).match(/(\d+)/g);
                  if (aKey && bKey) {
                    if (aKey[0] * 1 < bKey[0] * 1) {
                      return -1;
                    } else if (aKey[0] * 1 > bKey[0] * 1) {
                      return 1;
                    }

                    if (aKey[1] * 1 < bKey[1] * 1) {
                      return -1;
                    } else if (aKey[1] * 1 > bKey[1] * 1) {
                      return 1;
                    }

                    if (aKey[2] * 1 < bKey[2] * 1) {
                      return -1;
                    } else if (aKey[2] * 1 > bKey[2] * 1) {
                      return 1;
                    }
                  }

                  return a < b ? -1 : 1;
                },
              };
            i.exports = {
              refreshList: function () {
                d.refreshList();
              },
            };
          },
        );
        return;
      } else if (
        args[0] ===
        'file-widget-1:videoPlay/HTML5Player/videoPrivilegesMixin.js'
      ) {
        originDefine(
          'file-widget-1:videoPlay/HTML5Player/videoPrivilegesMixin.js',
          function (e, t, i) {
            function a() {
              m.getContext().ui.tip({
                mode: 'caution',
                msg: '网络错误，请稍候重试',
                hasClose: !1,
                autoClose: !0,
              });
            }
            function o(e, t) {
              var i = e ? 'vjs-noble-privilege' : '';
              return (i = t ? i + ' vjs-playback-resolution-badge' : i);
            }
            function n(e) {
              e = e || '';
              var t = [480, 360],
                i = e.match(/width:(\d+),height:(\d+)/) || ['', '', ''],
                a = +i[1] * +i[2];
              return a
                ? (a > 409920 && t.unshift(720),
                  a > 921600 && t.unshift(1080),
                  t)
                : t;
            }
            function s() {
              (F.isEndedReplayFlag = !1),
                (F.isEndedReplayFlagFirstFrame = !1),
                (F.palyTimestamp = 0),
                (F.isLag = !1),
                (F.firstFrameTime = 0),
                (F.seekingStamp = 0),
                (F.lagTimesecond = 0),
                (F.waitingStamp = 0),
                (F.palyingStamp = 0),
                (F.isSeekedStamp = 0),
                (F.isStartPlayingStamp = 0),
                (F.cacheRetryLogID = 0),
                (F.cacheRetryLogIDFrame = 0),
                (F.isStartPlaying = !0),
                (F.seekedStamp = 0),
                (F.waitingCurTime = 0),
                (F.isChangeResolution = !1),
                clearTimeout(F.startPlayerTimer),
                clearTimeout(F.seekTimer);
            }
            function r(e) {
              e.player.on('play', function () {
                (F.palyTimestamp = +new Date()), p(e);
              }),
                e.player.on('playing', function () {
                  (F.palyingStamp = +new Date()), u(e), d(e);
                }),
                e.player.on('ended', function () {
                  (F.isEndedReplayFlag = !0),
                    (F.isEndedReplayFlagFirstFrame = !0);
                  // 如果有下个视频，则直接跳转
                  const nextVideo = getNextPath();
                  if (nextVideo) {
                    location.hash =
                      '#/video?path=' + encodeURIComponent(nextVideo);
                  }
                }),
                e.player.on('seeking', function () {
                  F.seekingStamp = +new Date();
                }),
                e.player.on('seeked', function () {
                  F.seekedStamp = +new Date();
                }),
                e.player.on('waiting', function () {
                  !F.firstFrameTime ||
                    +new Date() - F.seekingStamp < 500 ||
                    F.isStartPlayingStamp ||
                    F.isSeekedStamp ||
                    ((F.waitingCurTime = e.player.currentTime()),
                    (F.waitingStamp = +new Date()),
                    (F.isLag = !0));
                });
            }
            function l(e) {
              e.player.one('ready', function () {
                var t = m.getContext().useNewSDK;
                if (S.levelDict.h265 === t && e.player && e.player.tech) {
                  var i = e.player.tech({
                    IWillNotUseThisInPlugins: !0,
                  });
                  i &&
                    (i.on('avnosync', function (e) {
                      var t = e || {};
                      N.push({
                        out_sync_start: t.start,
                        out_sync_end: t.end,
                        out_sync_pos: t.pos,
                      });
                    }),
                    i.wasmPlayer &&
                      i.wasmPlayer.on('REQUEST_DATA', function (t) {
                        var i = t || {};
                        0 === i.type &&
                          h.sendLog({
                            type: 'video_request_h5_h265',
                            video_source: encodeURIComponent(i.url || ''),
                            resolution: e.currentResolution,
                          });
                      }));
                }
              });
            }
            function p(e) {
              var t = window.__LOG_INFO__ || {};
              t.retryLogID &&
                t.retryLogID !== F.cacheRetryLogID &&
                ((F.cacheRetryLogID = t.retryLogID),
                _.sendVideoLog(
                  {
                    op: 'vast_player_user_number',
                    pv_type: 'retry_play',
                  },
                  e,
                ),
                (window.ERROR_RETRY_TIMES = 1)),
                F.isEndedReplayFlag &&
                  ((F.isEndedReplayFlag = !1),
                  (F.firstFrameTime = 0),
                  _.sendVideoLog(
                    {
                      op: 'vast_player_user_number',
                      pv_type: 'replay_video',
                    },
                    e,
                  ));
            }
            function u(e) {
              if (!F.firstFrameTime) {
                F.firstFrameTime = F.palyingStamp - F.palyTimestamp;
                var t,
                  i = window.__LOG_INFO__ || {};
                i.subLogID && F.lastSubLogID !== i.subLogID
                  ? ((F.lastSubLogID = i.subLogID), (t = 'change_video'))
                  : F.isEndedReplayFlagFirstFrame
                  ? ((F.isEndedReplayFlagFirstFrame = !1), (t = 'replay_video'))
                  : i.retryLogID && i.retryLogID !== F.cacheRetryLogIDFrame
                  ? ((F.cacheRetryLogIDFrame = i.retryLogID),
                    (t = 'retry_play'))
                  : F.isChangeResolution
                  ? ((F.isChangeResolution = !1), (t = 'change_resolution'))
                  : (t = 'into_page'),
                  (V.length || N.length) && c(E),
                  (F.isStartPlaying = !0),
                  _.sendVideoLog(
                    {
                      op: 'vast_player_summary_info',
                      activity_create_time: F.palyTimestamp,
                      first_video_frame_rendered_time: F.palyingStamp,
                      first_frame_type: t,
                    },
                    e,
                  ),
                  clearTimeout(F.startPlayerTimer),
                  clearTimeout(F.seekTimer);
              }
            }
            function d(e) {
              (E = e),
                F.isStartPlaying &&
                  ((F.isStartPlaying = !1),
                  (F.seekedStamp = 0),
                  (F.isStartPlayingStamp = F.palyingStamp),
                  (F.startPlayerTimer = setTimeout(function () {
                    F.isStartPlayingStamp = 0;
                  }, 2e3))),
                !F.isStartPlaying &&
                  F.palyingStamp - F.seekedStamp < 500 &&
                  ((F.isSeekedStamp = F.palyingStamp),
                  (F.seekTimer = setTimeout(function () {
                    F.isSeekedStamp = 0;
                  }, 2e3))),
                F.isLag &&
                  (V.push({
                    stutter_begin: F.waitingStamp,
                    stutter_pos: F.waitingCurTime,
                    stutter_end: F.palyingStamp,
                  }),
                  (F.isLag = !1));
            }
            function c(e) {
              var t,
                i = m.getContext().useNewSDK;
              (t =
                S.isNewSDK(i) && j.length
                  ? j
                  : [
                      {
                        set_speed_time: 0,
                        speed: 1,
                      },
                    ]),
                V.length &&
                  (_.sendVideoLog(
                    {
                      op: 'vast_player_summary_info',
                      video_width: e.player.height_,
                      video_height: e.player.width_,
                      play_speed: t,
                      play_stutter: V,
                    },
                    e,
                  ),
                  (V = []),
                  (j = [])),
                N.length &&
                  (_.sendVideoLog(
                    {
                      op: 'vast_player_summary_info',
                      video_width: e.player.height_,
                      video_height: e.player.width_,
                      play_speed: t,
                      play_avnosync_list: N,
                    },
                    e,
                  ),
                  (N = []));
            }
            function y(e) {
              (e.prototype.createPlayer = function () {
                function e() {
                  var e = {
                    controlBar: {
                      children: [
                        'playToggle',
                        {
                          name: 'VolumeControlPanel',
                          inline: !1,
                          percent: !0,
                        },
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'progressControl',
                      ],
                    },
                    needPauseAd: f.needPauseAd,
                    pauseAdConfig: f.pauseAdConfig,
                  };
                  if (S.isNewSDK(f.useNewSDK)) {
                    var a = o(v.sources.noble, x),
                      s = {
                        name: 'ResolutionSwitcherMenu',
                        text: '流畅',
                        htmlTitle: '清晰度',
                        badge: R,
                        className: a,
                        rememberPosition: !1,
                        title: {
                          icon: C,
                          text: '选择画质清晰度',
                        },
                        list: v.sources,
                        hooks: {
                          beforeChange: p,
                          mouseenter: t,
                          mouseleave: n,
                        },
                      },
                      r = {
                        name: 'PlaybackRateMenu',
                        text: '倍速',
                        badge: R,
                        className: x && 'vjs-playback-rate-badge',
                        defaultValue: 1,
                        title: {
                          icon: C,
                          text: 'SVIP专享倍速播放',
                        },
                        list: [
                          {
                            text: '0.75倍',
                            value: 0.75,
                            controlBadge: R,
                          },
                          {
                            text: '正常',
                            value: 1,
                            controlText: '倍速',
                            controlBadge: R,
                          },
                          {
                            text: '1.25倍',
                            value: 1.25,
                            controlBadge: R,
                          },
                          {
                            text: '1.5倍',
                            value: 1.5,
                            controlBadge: R,
                          },
                          {
                            text: '2.0倍',
                            value: 2,
                            controlBadge: R,
                          },
                        ],
                        footnote: v.userInfo.isSVip
                          ? null
                          : {
                              btnText: '立即开通SVIP',
                              onClick: function () {
                                m.getContext().log.send({
                                  type: 'videoplayback_nonsvip_straibuy',
                                }),
                                  window.open(k + 'videoplayback_web');
                              },
                            },
                        hooks: {
                          beforeChange: u,
                          mouseenter: i,
                          mouseleave: n,
                        },
                      };
                    e.controlBar.children.push(s),
                      e.controlBar.children.push(r);
                  }
                  return e.controlBar.children.push('fullscreenToggle'), e;
                }
                function t() {
                  a(),
                    m.getContext().log.send({
                      type: 'video_resolution_switcher_menu_show',
                    });
                }
                function i() {
                  a(),
                    m.getContext().log.send({
                      type: 'video_playback_rate_menu_show',
                    });
                }
                function a() {
                  g('.video-content .video-functions-tips').hide();
                }
                function n() {
                  g('.video-content .video-functions-tips').show();
                }
                function s() {
                  v.toast(
                    y({
                      state: 'success',
                      autoClose: !0,
                    }),
                  );
                }
                function r() {
                  v.toast(
                    y({
                      state: 'failed',
                      autoClose: !0,
                    }),
                  );
                }
                function p(e, t) {
                  var i = m.getContext(),
                    a = i.originSDKType === S.levelDict.h265,
                    o = i.useNewSDK,
                    n = T.hasAudioVisualProduct(),
                    p = 'video_definition_nonsvipclick';
                  if (
                    (v.userInfo.isSVip
                      ? (p = 'video_definition_svipclick')
                      : n && (p = 'video_definition_packageclick'),
                    i.log.send({
                      type: p,
                    }),
                    v.player.src() !== e.value)
                  ) {
                    var u = Number((e.label.match(/\d+/) || [0])[0]),
                      g = e.label.replace(/\s.*/, '');
                    return v.userInfo.isSVip ||
                      v.userInfo.freeList.indexOf(u) > -1 ||
                      n
                      ? (v.player.off('canplay', s),
                        v.player.off('error', r),
                        v.toast(
                          y({
                            text: g,
                            state: 'start',
                          }),
                        ),
                        v.player.one('canplay', s),
                        v.player.one('error', r),
                        v.antiSpam(),
                        t(),
                        a &&
                          (i.useNewSDK =
                            u > 480 ? S.levelDict.v7 : S.levelDict.h265),
                        o !== S.levelDict.h265 &&
                          i.useNewSDK === S.levelDict.h265 &&
                          l(v),
                        (v.currentResolution = u),
                        d(e, u),
                        (v.segementType = ''),
                        (F.firstFrameTime = 0),
                        (F.isChangeResolution = !0),
                        _.sendVideoLog(
                          {
                            op: 'vast_player_user_number',
                            pv_type: 'change_resolution',
                          },
                          v,
                        ),
                        h.updatePlayLoadFlag(!1),
                        h.startCheckLoadeTimeout(),
                        void _.sendH5Log(
                          {
                            type: 'video_resolution_change',
                          },
                          v,
                        ))
                      : void c(17);
                  }
                }
                function u(e, t) {
                  var i = 'videoplayback_nonsvipclick',
                    a = T.hasAudioVisualProduct();
                  return (
                    v.userInfo.isSVip
                      ? (i = 'videoplayback_svipclick')
                      : a && (i = 'videoplayback_packageclick'),
                    m.getContext().log.send({
                      type: i,
                    }),
                    v.userInfo.currentRate !== e.rate
                      ? v.userInfo.isSVip || a
                        ? (v.toast(
                            y({
                              type: 'rate',
                              state: 'start',
                            }),
                          ),
                          (v.userInfo.currentRate = e.rate),
                          j.push({
                            set_speed_time: +new Date(),
                            speed: e.rate,
                          }),
                          v.antiSpam(),
                          t(),
                          d(e, e.rate),
                          void v.toast(
                            v.player.paused()
                              ? y({
                                  type: 'rate',
                                  state: 'paused',
                                  text: e.label,
                                  autoClose: !0,
                                })
                              : y({
                                  type: 'rate',
                                  state: 'success',
                                  text: e.label,
                                  autoClose: !0,
                                }),
                          ))
                        : void c(3)
                      : void 0
                  );
                }
                function d(e, t) {
                  (1 !== t && 360 > t) || t > 480
                    ? e.addMenuClass('vjs-noble-privilege')
                    : e.removeMenuClass('vjs-noble-privilege');
                }
                function c(e) {
                  v.player.isFullscreen() && v.player.exitFullscreen();
                  var t = {
                    user_status: v.userInfo.isSVip
                      ? 2
                      : v.userInfo.isVip
                      ? 1
                      : 0,
                    try_count: 0,
                  };
                  v.stashState();
                  var i =
                      3 === e
                        ? 'videoplayback_guide_click'
                        : 17 === e
                        ? 'video_definition_guide_click'
                        : '',
                    a = {
                      sourceConf: {
                        from: i,
                        width: 474,
                        configuration: !0,
                        afterGuide: function () {
                          var e = g(
                            '<em>（若已开通，请刷新当前页面重试）</em>',
                          ).css({
                            fontSize: '12px',
                          });
                          g('#vip-guide-vip-intro')
                            .find('.dialog-header-title')
                            .append(e);
                        },
                      },
                      apiParams: {
                        sid: e,
                        version: '11.10.0',
                        data: g.stringify(t),
                      },
                    };
                  m
                    .getContext()
                    .message.callPlugin('会员引导@com.baidu.pan', a),
                    17 === e &&
                      m.getContext().log.send({
                        type: 'video_definition_guide',
                      }),
                    3 === e &&
                      m.getContext().log.send({
                        type: 'videoplayback_guide',
                      });
                }
                function y(e) {
                  var t = e.type || 'resolution',
                    i = !v.userInfo.isSVip,
                    a = v.userInfo.isSVip,
                    o = i ? '#06A7FF' : '#F9D680',
                    n = v.userInfo.vipLevel,
                    s = a ? '尊敬的v' + n + '超级会员，' : '',
                    r = i ? '免费' : '',
                    l = {
                      start: {
                        text:
                          s +
                          '正在为您切换到<span style="color: ' +
                          o +
                          ';">' +
                          e.text +
                          '</span>清晰度...',
                      },
                      success: {
                        text: s + '切换清晰度成功',
                      },
                      failed: {
                        text: s + '清晰度切换失败，请重试',
                      },
                    },
                    p = {
                      start: {
                        text: s + '正在' + r + '切换倍速播放...',
                      },
                      paused: {
                        text:
                          s +
                          '播放时将' +
                          r +
                          '开启<span style="color: ' +
                          o +
                          ';">' +
                          e.text +
                          '</span>速度',
                      },
                      success: {
                        text:
                          s +
                          '已为您' +
                          r +
                          '开启<span style="color: ' +
                          o +
                          ';">' +
                          e.text +
                          '</span>速度播放',
                      },
                      failed: {
                        text: s + '倍速切换失败，请重试',
                      },
                    },
                    u = {
                      resolution: l,
                      rate: p,
                    },
                    d = g.extend({}, u[t][e.state]);
                  return (d.icon = i ? '' : C), (d.autoClose = e.autoClose), d;
                }
                var v = this,
                  f = m.getContext();
                _.getVideoJS().then(
                  function () {
                    v._createPlayerCore(e());
                  },
                  function () {
                    _.sendVideoLog(
                      {
                        op: 'vast_player_play_error',
                        error_type: 'CLIENT_ERROR',
                        error_info: {
                          player_error: {
                            system_time: +new Date(),
                            error_code: 400004,
                          },
                        },
                      },
                      v,
                    ),
                      f.message.trigger('video-trigger-list-error', {
                        msg: '视频出错了，请稍后重试...',
                        addRetry: !0,
                        currentResolution: v.currentResolution,
                      });
                  },
                );
              }),
                (e.prototype.createPlayerCore = function (e) {
                  var t = this;
                  return t.browser.safari
                    ? void g
                        .ajax({
                          url: t.src,
                        })
                        .done(function () {
                          t._createPlayerCore(e);
                        })
                        .fail(function (e) {
                          t.handleError('pretreatment', e);
                        })
                    : void t._createPlayerCore(e);
                }),
                (e.prototype._createPlayerCore = function (e) {
                  s();
                  var t = m.getContext(),
                    i = t.useNewSDK,
                    a = this;
                  clearTimeout(D.resetRate), this.createEl();
                  var o =
                      'https://nd-static.bdstatic.com/m-static/base/thirdParty/video-player/_nomd5_nomod/',
                    n = o + 'WasmPlayer_1649232797535';
                  n.indexOf('http') < 0 && (n = location.origin + n);
                  var r = S.levelDict.h265 === i,
                    l = {
                      smartHost: !0,
                      segmentTimeout: 2e4,
                      retryCount: 30,
                      retryDelay: 1e3,
                      retryCode: [31341],
                      segmentRetryCount: 50,
                      segmentRetryDelay: 1e3,
                    },
                    p = videoPlayer(
                      this.container.find('video')[0],
                      g.extend(
                        {
                          html5: {
                            preRequest: function () {
                              return !!a.browser.safari;
                            },
                            vhs: g.extend({}, l, {
                              prohibitSwitchPlaylist: !0,
                              retryText: '努力加载中，请耐心等待',
                              overrideNative: !1,
                              segmentStartTimeKey:
                                a.browser.chrome && a.browser.chrome < 75
                                  ? 'dtsTime'
                                  : 'ptsTime',
                            }),
                          },
                          language: 'zh-cn',
                          wasmTech: {
                            scriptSrc: n + '.min.js',
                            wasmSrc: n + '.wasm',
                            xhr: l,
                          },
                          techOrder: r ? ['WasmTech', 'html5'] : ['html5'],
                        },
                        e,
                      ),
                    );
                  p.done(
                    function (e) {
                      a.afterCreated(e);
                    },
                    function (e, t) {
                      (t = t || {}), a.handleError('pretreatment', t);
                    },
                  );
                }),
                (e.prototype.afterCreated = function (e) {
                  var t = m.getContext(),
                    i = t.useNewSDK,
                    a = this;
                  (this.player = e),
                    h.bindPlayerLog(this),
                    t.needPauseAd &&
                      f(t.channel, function (t) {
                        var i = {
                          list: t,
                          isShowAdWhenUserClose: !locals.get('is_svip'),
                        };
                        !e.isDisposed_ &&
                          e.trigger({
                            type: 'pause_ad_config_ready',
                            data: i,
                          });
                      }),
                    !i && t.needPauseAd && v(e),
                    e.on('loadedmetadata', function () {
                      h.updatePlayLoadFlag(!0);
                      try {
                        w.decodeTest();
                      } catch (e) {
                        h.sendLog({
                          type: 'web_h265_decode_error',
                          message: e.message,
                        });
                      }
                    }),
                    e.on('hostchange', function (e, t) {
                      var t = t || {};
                      h.sendLog({
                        type: 'web_video_req_host',
                        host: t.host,
                      });
                    }),
                    _.sendH5Log(
                      {
                        type: 'vedio_h5_init_real_video',
                      },
                      this,
                    ),
                    r(this),
                    l(this),
                    this.player.on('ratechange', function () {
                      a.userInfo.isSVip ||
                        T.hasAudioVisualProduct() ||
                        t.log.send({
                          type: 'videoplayback_nonsvip_change',
                          uk: (window.__LOG_INFO__ || {}).uk,
                          status: a.userInfo.isVip ? 1 : 0,
                        });
                    }),
                    this.player.on('segementType', function (e) {
                      var i = e.data,
                        o = !1;
                      a.segementType || (o = !0),
                        (a.segementType = i.segementType),
                        o &&
                          t.log.send({
                            type: 'web_video_segement_type',
                            useNewSDK: t.useNewSDK,
                            from: a.segementType,
                          });
                    }),
                    this.antiSpam(),
                    this.checkPoster(),
                    this.bindEvents(),
                    g.isFunction(this.callback) && this.callback(this);
                }),
                (e.prototype.stashState = function () {
                  this.player &&
                    ((this.preStateIsPaused = this.player.paused()),
                    this.player.pause());
                }),
                (e.prototype.popState = function () {
                  this.player &&
                    this.preStateIsPaused === !1 &&
                    (this.player.play(), (this.preStateIsPaused = null));
                }),
                (e.prototype.getSources = function () {
                  function t(e, t, a) {
                    var o = m.getContext().useNewSDK;
                    _.sendH5Log(
                      {
                        type: 'vedio_h5_toget_privilege',
                      },
                      s,
                    ),
                      (s.userInfo.isSVip = !!e),
                      (s.userInfo.isVip = !!t),
                      (s.userInfo.vipLevel = a),
                      (s.userInfo.isNormal = !e && !t),
                      S.isNewSDK(o)
                        ? (i(),
                          (s.type = 'application/x-mpegURL'),
                          (l = n(s.file.resolution)))
                        : (_.sendH5Log(
                            {
                              type: 'vedio_h5_get_real_m3u8',
                            },
                            s,
                          ),
                          (s.currentResolution = 480),
                          (s.src =
                            s.options.getUrl(s.BPSType) +
                            '&isplayer=1&check_blue=1&adToken=' +
                            encodeURIComponent(s.adToken ? s.adToken : '')),
                          s.run());
                  }
                  function i() {
                    g.ajax({
                      url: '/api/getconfig',
                      data: {
                        type: 'fetch',
                        version: 0,
                        keys: g.stringify({
                          private_video_quality_setting: 0,
                        }),
                      },
                      dataType: 'json',
                    })
                      .done(function (e) {
                        if (e && e.list) {
                          var t,
                            i = e.list,
                            a = 0;
                          if (!i.length) return;
                          for (; a < i.length; a++)
                            if (
                              ((t = i[a]),
                              'private_video_quality_setting' === t.conf_key)
                            ) {
                              p = g.parseJSON(t.value || '{}');
                              break;
                            }
                        }
                      })
                      .fail(a)
                      .always(o);
                  }
                  function o() {
                    function t(e) {
                      if (!(720 > e) && n) {
                        var t = 'super_quality',
                          i = I;
                        return (
                          720 === e && (t = 'high_quality'),
                          '限免' === n[t] && (i = L),
                          i
                        );
                      }
                    }
                    _.sendH5Log(
                      {
                        type: 'vedio_h5_get_privilege',
                      },
                      s,
                    );
                    var i = m.getContext(),
                      a = i.useNewSDK,
                      o = s.userInfo.isSVip
                        ? 'svip'
                        : s.userInfo.isVip
                        ? 'vip'
                        : 'normal',
                      n = p[o],
                      u = s.options.currentResolution,
                      d = !1,
                      c = S.levelDict.h265 === a,
                      y = g.map(l, function (i, a) {
                        var o = e.getBPSType(i, c),
                          n =
                            s.options.getUrl(o) +
                            '&isplayer=1&check_blue=1' +
                            (c && 480 >= i ? '&trans=hevc:1' : '') +
                            '&adToken=' +
                            encodeURIComponent(s.adToken ? s.adToken : ''),
                          l = u
                            ? u === i
                            : s.userInfo.isSVip
                            ? 0 === a
                            : 480 === i;
                        return (
                          l &&
                            ((s.src = n),
                            (s.BPSType = o),
                            (s.currentResolution = i),
                            i > 480 && !d && (d = !0),
                            c && 480 >= i && (s.type = 'wasm')),
                          {
                            text: r[i].des + ' ' + r[i].clarity,
                            type:
                              c && 480 >= i ? 'wasm' : 'application/x-mpegURL',
                            value: n,
                            badge: t(i),
                            default: l,
                            controlText: r[i].des,
                            controlBadge: R,
                          }
                        );
                      });
                    p.xm_switch && s.userInfo.freeList.push(720),
                      _.sendH5Log(
                        {
                          type: 'vedio_h5_get_real_m3u8',
                        },
                        s,
                      ),
                      (s.sources = y),
                      (y.noble = d),
                      s.createPlayer();
                  }
                  var s = this,
                    r = {
                      1080: {
                        des: '超清',
                        clarity: '1080P',
                      },
                      720: {
                        des: '高清',
                        clarity: '720P',
                      },
                      480: {
                        des: '流畅',
                        clarity: '480P',
                      },
                      360: {
                        des: '省流',
                        clarity: '360P',
                      },
                    },
                    l = [480, 360],
                    p = {};
                  (s.userInfo = {
                    isSVip: !1,
                    isVip: !1,
                    vipLevel: 0,
                    isNormal: !0,
                    overCount: 0,
                    freeList: [360, 480],
                    currentRate: 1,
                  }),
                    (s.type = e.supportsNativeHls
                      ? 'application/x-mpegURL'
                      : 'application/x-flvURL'),
                    (s.BPSType = e.getBPSType()),
                    m
                      .getContext()
                      .locals.get('is_svip', 'is_vip', 'vip_level', t);
                }),
                (e.prototype.window = function (e) {
                  e = e || {};
                  var t = (this.dialog = m.getContext().ui.window(e));
                  return t.show(), t;
                }),
                (e.prototype.toast = function (e) {
                  this.$toast_ && this.$toast_.remove(), (e = e || {});
                  var t = e.icon,
                    i = e.text;
                  if (t || i) {
                    var a = [
                        '<div class="html5-video-notice">',
                        t ? '<span class="html5-video-icon"></span>' : '',
                        '<span class="html5-video-text">' + e.text + '</span>',
                        '</div>',
                      ].join(''),
                      o = g(e.container || '#video-wrap-outer');
                    o.get(0) || (o = g('#video-warp-outer'));
                    var n = (this.$toast_ = g(a).appendTo(o));
                    return (
                      e.autoClose &&
                        setTimeout(function () {
                          n && n.remove();
                        }, 3e3),
                      n
                    );
                  }
                }),
                (e.prototype.antiSpam = function () {
                  var e = this,
                    t = g(e.player.el()).get(0),
                    i = g(t).find('video').get(0),
                    a = T.hasAudioVisualProduct();
                  return e.userInfo.isSVip || a
                    ? void (
                        e.__antiSpam &&
                        (clearTimeout(D.resetRate),
                        i && delete i.playbackRate,
                        (e.__antiSpam = !1))
                      )
                    : void (
                        e.__antiSpam ||
                        ((e.__antiSpam = !0),
                        (D.resetRate = setTimeout(function o() {
                          e.userInfo.isSVip ||
                            a ||
                            (e.player &&
                              e.player.playbackRate(e.userInfo.currentRate),
                            (D.resetRate = setTimeout(o, 500)));
                        }, 500)),
                        t &&
                          (g(t).on('contextmenu', function (e) {
                            e.preventDefault();
                          }),
                          i &&
                            Object.defineProperty &&
                            !e.browser.firefox &&
                            Object.defineProperty(i, 'playbackRate', {
                              configurable: !0,
                              get: function () {
                                return e.player && e.player.playbackRate();
                              },
                              set: function () {},
                            })))
                      );
                });
            }
            var g = e('base:widget/libs/jquerypacket.js'),
              m = e('file-widget-1:videoPlay/context.js'),
              _ = e('file-widget-1:videoPlay/utils.js'),
              v = e('file-widget-1:videoPlay/HTML5Player/pauseAd.js'),
              f = e('file-widget-1:videoPlay/HTML5Player/getPauseAd.js'),
              h = e('file-widget-1:videoPlay/log/logger.js'),
              S = e('file-widget-1:videoPlay/utils/dict.js'),
              w = e('file-widget-1:videoPlay/WasmPlayer/wasmProbe.js'),
              T = e('file-widget-1:videoPlay/utils/user-info.js'),
              P = 'https://staticsns.cdn.bcebos.com/amis/2020-12/',
              b = (window.host && window.host.HOST_PAN) || 'pan.baidu.com',
              k = 'https://' + b + '/buy/checkoutcounter?svip=1&from=',
              x = 16172064e5 - g.now() > 0,
              R = x && P + '1608641372233/ic_new.png',
              C = P + '1608641306889/logo_svip.png',
              I = P + '1608641343156/ic_svip.png',
              L = P + '1608641408780/ic_free.png',
              D = {
                resetRate: 0,
              },
              F = {
                isEndedReplayFlag: !1,
                isEndedReplayFlagFirstFrame: !1,
                palyTimestamp: 0,
                isLag: !1,
                firstFrameTime: 0,
                seekingStamp: 0,
                cacheRetryLogID: 0,
                cacheRetryLogIDFrame: 0,
                isChangeResolution: !1,
                lastSubLogID: window.__LOG_INFO__ || 0,
                waitingStamp: 0,
                palyingStamp: 0,
                seekedStamp: 0,
                isStartPlaying: !0,
                isStartPlayingStamp: 0,
                isSeekedStamp: 0,
                waitingCurTime: 0,
                startPlayerTimer: null,
                seekTimer: null,
              },
              V = [],
              N = [],
              j = [],
              E = null;
            g(window).on('unload', function () {
              (V.length || N.length) && c(E);
            }),
              (i.exports = y);
          },
        );
        return;
      }
      originDefine && originDefine(...args);
    };
  },
  set(newValue) {
    originDefine = newValue;
  },
  enumerable: true,
  configurable: true,
});
