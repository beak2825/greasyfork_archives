// ==UserScript==
// @name         View More Videos by Same YouTube Channel
// @namespace    https://greasyfork.org/users/649
// @version      1.2.3
// @description  Displays a list of more videos by the same channel inline
// @author       Adrien Pyke
// @match        *://www.youtube.com/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @require      https://unpkg.com/mithril
// @resource     pageTokens https://cdn.rawgit.com/Quihico/handy.stuff/7e47f4f2/yt.pagetokens.00000-00999
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/370637/View%20More%20Videos%20by%20Same%20YouTube%20Channel.user.js
// @updateURL https://update.greasyfork.org/scripts/370637/View%20More%20Videos%20by%20Same%20YouTube%20Channel.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CLASS_PREFIX = 'YVM_';

  GM_addStyle(/* css */ `
		.${CLASS_PREFIX}slider {
			display: flex;
			align-items: center;
			margin-top: 8px;
		}
		.${CLASS_PREFIX}thumbnails-wrap {
			flex-grow: 1;
			overflow-x: hidden;
		}
		.${CLASS_PREFIX}thumbnails {
			display: flex;
			position: relative;
			top: 0;
			transition: left 300ms ease-out;
		}
		.${CLASS_PREFIX}thumbnail {
			display: flex;
			flex-direction: column;
			margin-right: 8px;
			min-width: 168px;
		}
    .${CLASS_PREFIX}thumbnail ytd-thumbnail {
      margin-right: 8px;
      height: 94px;
      width: 168px;
    }
		.${CLASS_PREFIX}thumbnail.${CLASS_PREFIX}active {
			background-color: var(--yt-thumbnail-placeholder-color);
		}
		#${CLASS_PREFIX}mount-point {
			margin-top: 8px;
		}
		.${CLASS_PREFIX}slider ytd-thumbnail.ytd-compact-video-renderer {
			margin: 0;
		}
		.${CLASS_PREFIX}slider #video-title.ytd-compact-video-renderer {
			max-height: 4.8rem;
		}
	`);

  const API_URL = 'https://www.googleapis.com/youtube/v3/';
  const API_KEY = 'AIzaSyDEAM1cSePslXRBk1Bkoo4FCXYBnEZSsgI';
  const RESULTS_PER_FETCH = 50;
  const LAZY_LOAD_BUFFER = 10;

  const icons = {
    'chevron-left':
      '<g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>',
    'chevron-right':
      '<g id="chevron-right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g>'
  };

  const Util = {
    btn(options, text) {
      return m(
        'paper-button[role=button][subscribed].style-scope.ytd-subscribe-button-renderer',
        options,
        text
      );
    },
    iconBtn(icon, options = {}) {
      return m(
        'ytd-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-default.size-default[button-renderer][is-icon-button]',
        { icon },
        [m('paper-icon-button', Object.assign(options))]
      );
    },
    initCmp(cmp) {
      const oninit = cmp.oninit;
      return Object.assign({}, cmp, {
        oninit(vnode) {
          if (typeof cmp.model === 'function') vnode.state.model = cmp.model();
          if (oninit) oninit(vnode);
        }
      });
    },
    delayedRedraw(func, delay = 50) {
      return new Promise(resolve =>
        setTimeout(() => {
          func();
          m.redraw();
          resolve();
        }, delay)
      );
    },
    fillIcons(vnode) {
      Array.from(
        vnode.dom.querySelectorAll('ytd-button-renderer[icon]')
      ).forEach(
        btn =>
          (btn.querySelector('iron-icon').innerHTML = /* html */ `
						<svg viewBox="0 0 24 24"
							preserveAspectRatio="xMidYMid meet"
							focusable="false"
							class="style-scope yt-icon"
							style="pointer-events: none;
								display: block;
								width: 100%;
								height: 100%;">
							${icons[btn.getAttribute('icon')]}
						</svg>
					`)
      );
    },
    decode(text) {
      const elem = document.createElement('textarea');
      elem.innerHTML = text;
      return elem.value;
    }
  };

  const Api = {
    pageTokens: GM_getResourceText('pageTokens').split('\n'),
    request(endpoint, data, method = 'GET') {
      return m.request({
        method,
        background: true,
        url: API_URL + endpoint,
        params: Object.assign(data, { key: API_KEY })
      });
    },
    parseVideo(data) {
      return {
        id: data.snippet.resourceId ? data.snippet.resourceId.videoId : data.id,
        title: data.snippet.title,
        channelId: data.snippet.channelId,
        channelTitle: data.snippet.channelTitle,
        publishedAt: new Date(data.snippet.publishedAt),
        thumbnail: data.snippet.thumbnails.medium.url
      };
    },
    sortVideos(a, b) {
      if (a.publishedAt > b.publishedAt) return -1;
      else if (a.publishedAt < b.publishedAt) return 1;
      return 0;
    },
    async getVideo(id) {
      const data = await Api.request('videos', {
        part: 'snippet',
        id
      });
      if (data && data.items.length > 0) return Api.parseVideo(data.items[0]);
    },
    async getPlaylistId(channelId) {
      const data = await Api.request('channels', {
        part: 'contentDetails',
        id: channelId
      });
      return data.items[0].contentDetails.relatedPlaylists.uploads;
    },
    async getVideos(playlistId, pageToken) {
      const data = await Api.request('playlistItems', {
        part: 'snippet',
        maxResults: RESULTS_PER_FETCH,
        playlistId,
        ...(pageToken ? { pageToken } : {})
      });
      return {
        pageToken: data.nextPageToken,
        videos: data.items.map(Api.parseVideo)
      };
    },
    get currentVideoId() {
      const url = new URL(location.href);
      return url.searchParams.get('v');
    }
  };

  const Components = {
    App: Util.initCmp({
      model: () => ({
        hidden: true
      }),
      actions: {
        toggle: model => (model.hidden = !model.hidden)
      },
      view(vnode) {
        const { model, actions } = vnode.state;
        return m('div', [
          Util.btn(
            {
              onclick: () => actions.toggle(model)
            },
            'View More Videos'
          ),
          m(Components.Slider, {
            hidden: model.hidden,
            videoId: Api.currentVideoId
          })
        ]);
      }
    }),
    Slider: Util.initCmp({
      model: () => ({
        currentVideo: null,
        playlistId: null,
        videos: [],
        pageToken: null,
        loading: false,
        position: 0,
        shiftLeft() {
          this.position = Math.max(this.position - 1, 0);
        },
        shiftRight() {
          this.position = Math.min(this.position + 1, this.videos.length - 1);
        },
        get leftPx() {
          return this.position * -176;
        }
      }),
      actions: {
        async fetchInitialVideos(model, currentVideoId) {
          model.currentVideo = await Api.getVideo(currentVideoId);
          model.playlistId = await Api.getPlaylistId(
            model.currentVideo.channelId
          );
          await this.loadVideos(model);
          model.position = Math.max(
            (model.videos.findIndex(v => v.id === model.currentVideo.id) || 0) -
              1,
            0
          );
        },
        async loadVideos(model) {
          model.loading = true;
          const { pageToken, videos } = await Api.getVideos(
            model.playlistId,
            model.pageToken
          );
          model.videos.push(...videos);
          model.pageToken = pageToken;
          model.loading = false;
          m.redraw();
        },
        moveLeft(model) {
          model.shiftLeft();
          m.redraw();
        },
        async moveRight(model) {
          if (model.loading) return;
          if (
            model.position + LAZY_LOAD_BUFFER > model.videos.length &&
            model.pageToken
          ) {
            await this.loadVideos(model, true);
            Util.delayedRedraw(() => {
              model.shiftRight();
              model.loading = false;
            });
          } else {
            model.shiftRight();
          }
        }
      },
      oninit(vnode) {
        const { model, actions } = vnode.state;
        actions.fetchInitialVideos(model, vnode.attrs.videoId);
      },
      oncreate: Util.fillIcons,
      view(vnode) {
        const { model, actions } = vnode.state;
        return m(`div.${CLASS_PREFIX}slider`, { hidden: vnode.attrs.hidden }, [
          Util.iconBtn('chevron-left', {
            onclick: () => actions.moveLeft(model)
          }),
          m(`div.${CLASS_PREFIX}thumbnails-wrap`, [
            m(
              `div.${CLASS_PREFIX}thumbnails`,
              {
                style: `left: ${model.leftPx}px;transition-property:${
                  model.loading ? 'none' : ''
                };`
              },
              model.videos.map(video =>
                m(Components.Thumbnail, {
                  key: video.id,
                  active: video.id === model.currentVideo.id,
                  video
                })
              )
            )
          ]),
          Util.iconBtn('chevron-right', {
            onclick: () => actions.moveRight(model)
          })
        ]);
      }
    }),
    Thumbnail: Util.initCmp({
      model: () => ({
        video: null
      }),
      oninit(vnode) {
        vnode.state.model.video = vnode.attrs.video;
      },
      view(vnode) {
        const { model } = vnode.state;
        const title = Util.decode(model.video.title);
        return m(
          `div.${CLASS_PREFIX}thumbnail${
            vnode.attrs.active ? `.${CLASS_PREFIX}active` : ''
          }`,
          [
            m(
              'ytd-thumbnail.style-scope.ytd-compact-video-renderer',
              { width: 168 },
              [
                m(
                  'a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail',
                  { rel: 'nofollow', href: `/watch?v=${model.video.id}` },
                  [
                    m(
                      'yt-img-shadow.style-scope.ytd-thumbnail.no-transition[loaded]',
                      [
                        m('img.style-scope.yt-img-shadow', {
                          width: 168,
                          src: model.video.thumbnail
                        })
                      ]
                    )
                  ]
                )
              ]
            ),
            m(
              'a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer',
              { rel: 'nofollow', href: `/watch?v=${model.video.id}` },
              [
                m('h3.style-scope.ytd-compact-video-renderer', [
                  m(
                    'span#video-title.style-scope.ytd-compact-video-renderer',
                    { title },
                    title
                  )
                ])
              ]
            )
          ]
        );
      }
    })
  };

  let wait;
  const mountId = `${CLASS_PREFIX}mount-point`;
  waitForUrl(
    () => true,
    () => {
      if (wait) wait.stop();
      const oldMount = document.getElementById(mountId);
      if (oldMount) {
        m.mount(oldMount, null);
        oldMount.remove();
      }
      wait = waitForElems({
        sel: 'ytd-video-secondary-info-renderer > #container',
        stop: true,
        onmatch(container) {
          const mount = document.createElement('div');
          mount.id = mountId;
          container.prepend(mount);
          m.mount(mount, Components.App);
        }
      });
    }
  );
})();
