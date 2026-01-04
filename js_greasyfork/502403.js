// ==UserScript==
// @name        emby首页轮播图
// @namespace   https://github.com/jqtmviyu/UserScripts
// @match        *://*/web/index.html*
// @grant       none
// @version     0.2
// @author      jqtmviyu
// @description https://github.com/Nolovenodie/emby-crx的脚本版,加入图片滑动功能
// @downloadURL https://update.greasyfork.org/scripts/502403/emby%E9%A6%96%E9%A1%B5%E8%BD%AE%E6%92%AD%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502403/emby%E9%A6%96%E9%A1%B5%E8%BD%AE%E6%92%AD%E5%9B%BE.meta.js
// ==/UserScript==

;(function () {
  function md5(a){function b(a,b){return(a<<b)|(a>>>(32-b))}function c(a,b){var c,d,e,f,g;return(e=2147483648&a),(f=2147483648&b),(c=1073741824&a),(d=1073741824&b),(g=(1073741823&a)+(1073741823&b)),c&d?2147483648^g^e^f:c|d?(1073741824&g?3221225472^g^e^f:1073741824^g^e^f):g^e^f}function d(a,b,c){return(a&b)|(~a&c)}function e(a,b,c){return(a&c)|(b&~c)}function f(a,b,c){return a^b^c}function g(a,b,c){return b^(a|~c)}function h(a,e,f,g,h,i,j){return(a=c(a,c(c(d(e,f,g),h),j))),c(b(a,i),e)}function i(a,d,f,g,h,i,j){return(a=c(a,c(c(e(d,f,g),h),j))),c(b(a,i),d)}function j(a,d,e,g,h,i,j){return(a=c(a,c(c(f(d,e,g),h),j))),c(b(a,i),d)}function k(a,d,e,f,h,i,j){return(a=c(a,c(c(g(d,e,f),h),j))),c(b(a,i),d)}function l(a){for(var b,c=a.length,d=c+8,e=(d-(d%64))/64,f=16*(e+1),g=new Array(f-1),h=0,i=0;c>i;)(b=(i-(i%4))/4),(h=(i%4)*8),(g[b]=g[b]|(a.charCodeAt(i)<<h)),i++;return(b=(i-(i%4))/4),(h=(i%4)*8),(g[b]=g[b]|(128<<h)),(g[f-2]=c<<3),(g[f-1]=c>>>29),g}function m(a){var b,c,d="",e="";for(c=0;3>=c;c++)(b=(a>>>(8*c))&255),(e="0"+b.toString(16)),(d+=e.substr(e.length-2,2));return d}function n(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?(b+=String.fromCharCode(d)):d>127&&2048>d?((b+=String.fromCharCode((d>>6)|192)),(b+=String.fromCharCode((63&d)|128))):((b+=String.fromCharCode((d>>12)|224)),(b+=String.fromCharCode(((d>>6)&63)|128)),(b+=String.fromCharCode((63&d)|128)))}return b}var o,p,q,r,s,t,u,v,w,x=[],y=7,z=12,A=17,B=22,C=5,D=9,E=14,F=20,G=4,H=11,I=16,J=23,K=6,L=10,M=15,N=21;for(a=n(a),x=l(a),t=1732584193,u=4023233417,v=2562383102,w=271733878,o=0;o<x.length;o+=16)(p=t),(q=u),(r=v),(s=w),(t=h(t,u,v,w,x[o+0],y,3614090360)),(w=h(w,t,u,v,x[o+1],z,3905402710)),(v=h(v,w,t,u,x[o+2],A,606105819)),(u=h(u,v,w,t,x[o+3],B,3250441966)),(t=h(t,u,v,w,x[o+4],y,4118548399)),(w=h(w,t,u,v,x[o+5],z,1200080426)),(v=h(v,w,t,u,x[o+6],A,2821735955)),(u=h(u,v,w,t,x[o+7],B,4249261313)),(t=h(t,u,v,w,x[o+8],y,1770035416)),(w=h(w,t,u,v,x[o+9],z,2336552879)),(v=h(v,w,t,u,x[o+10],A,4294925233)),(u=h(u,v,w,t,x[o+11],B,2304563134)),(t=h(t,u,v,w,x[o+12],y,1804603682)),(w=h(w,t,u,v,x[o+13],z,4254626195)),(v=h(v,w,t,u,x[o+14],A,2792965006)),(u=h(u,v,w,t,x[o+15],B,1236535329)),(t=i(t,u,v,w,x[o+1],C,4129170786)),(w=i(w,t,u,v,x[o+6],D,3225465664)),(v=i(v,w,t,u,x[o+11],E,643717713)),(u=i(u,v,w,t,x[o+0],F,3921069994)),(t=i(t,u,v,w,x[o+5],C,3593408605)),(w=i(w,t,u,v,x[o+10],D,38016083)),(v=i(v,w,t,u,x[o+15],E,3634488961)),(u=i(u,v,w,t,x[o+4],F,3889429448)),(t=i(t,u,v,w,x[o+9],C,568446438)),(w=i(w,t,u,v,x[o+14],D,3275163606)),(v=i(v,w,t,u,x[o+3],E,4107603335)),(u=i(u,v,w,t,x[o+8],F,1163531501)),(t=i(t,u,v,w,x[o+13],C,2850285829)),(w=i(w,t,u,v,x[o+2],D,4243563512)),(v=i(v,w,t,u,x[o+7],E,1735328473)),(u=i(u,v,w,t,x[o+12],F,2368359562)),(t=j(t,u,v,w,x[o+5],G,4294588738)),(w=j(w,t,u,v,x[o+8],H,2272392833)),(v=j(v,w,t,u,x[o+11],I,1839030562)),(u=j(u,v,w,t,x[o+14],J,4259657740)),(t=j(t,u,v,w,x[o+1],G,2763975236)),(w=j(w,t,u,v,x[o+4],H,1272893353)),(v=j(v,w,t,u,x[o+7],I,4139469664)),(u=j(u,v,w,t,x[o+10],J,3200236656)),(t=j(t,u,v,w,x[o+13],G,681279174)),(w=j(w,t,u,v,x[o+0],H,3936430074)),(v=j(v,w,t,u,x[o+3],I,3572445317)),(u=j(u,v,w,t,x[o+6],J,76029189)),(t=j(t,u,v,w,x[o+9],G,3654602809)),(w=j(w,t,u,v,x[o+12],H,3873151461)),(v=j(v,w,t,u,x[o+15],I,530742520)),(u=j(u,v,w,t,x[o+2],J,3299628645)),(t=k(t,u,v,w,x[o+0],K,4096336452)),(w=k(w,t,u,v,x[o+7],L,1126891415)),(v=k(v,w,t,u,x[o+14],M,2878612391)),(u=k(u,v,w,t,x[o+5],N,4237533241)),(t=k(t,u,v,w,x[o+12],K,1700485571)),(w=k(w,t,u,v,x[o+3],L,2399980690)),(v=k(v,w,t,u,x[o+10],M,4293915773)),(u=k(u,v,w,t,x[o+1],N,2240044497)),(t=k(t,u,v,w,x[o+8],K,1873313359)),(w=k(w,t,u,v,x[o+15],L,4264355552)),(v=k(v,w,t,u,x[o+6],M,2734768916)),(u=k(u,v,w,t,x[o+13],N,1309151649)),(t=k(t,u,v,w,x[o+4],K,4149444226)),(w=k(w,t,u,v,x[o+11],L,3174756917)),(v=k(v,w,t,u,x[o+2],M,718787259)),(u=k(u,v,w,t,x[o+9],N,3951481745)),(t=c(t,p)),(u=c(u,q)),(v=c(v,r)),(w=c(w,s));var O=m(t)+m(u)+m(v)+m(w);return O.toLowerCase()}

class CommonUtils {
	static selectWait(selector, func, times, interval) {
		var _times = times || 100, //100次
			_interval = interval || 500, //20毫秒每次
			_jquery = null,
			_iIntervalID;

		_iIntervalID = setInterval(() => {
			if (!_times) {
				clearInterval(_iIntervalID);
			}
			_times <= 0 || _times--;
			_jquery = $(selector);
			if (_jquery.length) {
				func && func.call(func);
				clearInterval(_iIntervalID);
			}
		}, _interval);
		return this;
	}

	static selectNotWait(selector, func, interval) {
		let _jquery,
			_interval = interval || 20,
			_iIntervalID;

		_iIntervalID = setInterval(() => {
			_jquery = $(selector);
			if (_jquery.length < 1) {
				func && func.call(func);
				clearInterval(_iIntervalID);
			}
		}, _interval);
	}

	static copyText(value, cb) {
		const textarea = document.createElement("textarea");
		textarea.readOnly = "readonly";
		textarea.style.position = "absolute";
		textarea.style.left = "-9999px";
		textarea.value = value;
		document.body.appendChild(textarea);
		textarea.select();
		textarea.setSelectionRange(0, textarea.value.length);
		document.execCommand("Copy");
		document.body.removeChild(textarea);
		if (cb && Object.prototype.toString.call(cb) === "[object Function]") {
			cb();
		}
	}

	/**
	 * 休眠
	 * @param {number} ms 休眠多少毫秒
	 */
	static sleep(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("完成");
			}, ms);
		});
	}

	static checkType() {
		if (navigator && navigator.userAgent && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
			if (navigator && navigator.userAgent && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
				return 'ios';
			} else {
				return 'android';
			}
		} else {
			return 'pc';
		}
	};
}

function main() {
  class Home {
    static start() {
      this.cache = {
        items: undefined,
        item: new Map(),
      }
      this.itemQuery = {
        ImageTypes: 'Backdrop',
        EnableImageTypes: 'Logo,Backdrop',
        IncludeItemTypes: 'Movie,Series',
        SortBy: 'ProductionYear, PremiereDate, SortName',
        Recursive: true,
        ImageTypeLimit: 1,
        Limit: 10,
        Fields: 'ProductionYear',
        SortOrder: 'Descending',
        EnableUserData: false,
        EnableTotalRecordCount: false,
      }
      this.coverOptions = { type: 'Backdrop', maxWidth: 3000 }
      this.logoOptions = { type: 'Logo', maxWidth: 3000 }
      this.initStart = false
      setInterval(() => {
        if (window.location.href.indexOf('!/home') != -1) {
          if ($('.view:not(.hide) .misty-banner').length == 0 && $('.misty-loading').length == 0) {
            this.initStart = false
            this.initLoading()
          }
          if ($('.hide .misty-banner').length != 0) {
            $('.hide .misty-banner').remove()
          }
          if (
            !this.initStart &&
            $('.section0 .card').length != 0 &&
            $('.view:not(.hide) .misty-banner').length == 0
          ) {
            this.initStart = true
            this.init()
          }
        }
      }, 233)
    }

    static async init() {
      // Beta
      $('.view:not(.hide)').attr('data-type', 'home')
      // Loading
      const serverName = await this.injectCall('serverName', '')
      $('.misty-loading h1').text(serverName).addClass('active')
      // Banner
      await this.initBanner()
      this.initEvent()
    }

    /* 插入Loading */
    static initLoading() {
      const load = `
      <div class="misty-loading">
        <h1></h1>
        <div class="mdl-spinner"><div class="mdl-spinner__layer mdl-spinner__layer-1"><div class="mdl-spinner__circle-clipper mdl-spinner__left"><div class="mdl-spinner__circle mdl-spinner__circleLeft"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle mdl-spinner__circleRight"></div></div></div></div>
      </div>
      `
      $('body').append(load)
    }

    static injectCode(code) {
      let hash = md5(code + Math.random().toString())
      return new Promise((resolve, reject) => {
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel(hash)
          channel.addEventListener('message', event => resolve(event.data))
        } else if ('postMessage' in window) {
          window.addEventListener('message', event => {
            if (event.data.channel === hash) {
              resolve(event.data.message)
            }
          })
        }
        const script = `
        <script class="I${hash}">
          setTimeout(async ()=> {
            async function R${hash}(){${code}};
            if ("BroadcastChannel" in window) {
              const channel = new BroadcastChannel("${hash}");
              channel.postMessage(await R${hash}());
            } else if ('postMessage' in window) {
              window.parent.postMessage({channel:"${hash}",message:await R${hash}()}, "*");
            }
            document.querySelector("script.I${hash}").remove()
          }, 16)
        </script>
        `
        $(document.head || document.documentElement).append(script)
      })
    }

    static injectCall(func, arg) {
      const script = `
      // const client = (await window.require(["ApiClient"]))[0];
      const client = await new Promise((resolve, reject) => {
        setInterval(() => {
          if (window.ApiClient != undefined) resolve(window.ApiClient);
        }, 16);
      });
      return await client.${func}(${arg})
      `
      return this.injectCode(script)
    }

    static getItems(query) {
      if (this.cache.items == undefined) {
        this.cache.items = this.injectCall(
          'getItems',
          'client.getCurrentUserId(), ' + JSON.stringify(query)
        )
      }
      return this.cache.items
    }

    static async getItem(itemId) {
      // 双缓存 优先使用 WebStorage
      if (
        typeof Storage !== 'undefined' &&
        !localStorage.getItem('CACHE|' + itemId) &&
        !this.cache.item.has(itemId)
      ) {
        const data = JSON.stringify(
          await this.injectCall('getItem', `client.getCurrentUserId(), "${itemId}"`)
        )
        if (typeof Storage !== 'undefined') localStorage.setItem('CACHE|' + itemId, data)
        else this.cache.item.set(itemId, data)
      }
      return JSON.parse(
        typeof Storage !== 'undefined'
          ? localStorage.getItem('CACHE|' + itemId)
          : this.cache.item.get(itemId)
      )
    }

    static getImageUrl(itemId, options) {
      return this.injectCall('getImageUrl', itemId + ', ' + JSON.stringify(options))
    }

    /* 插入Banner */
    static async initBanner() {
      const banner = `
      <div class="misty-banner">
        <div class="misty-banner-body">
        </div>
        <div class="misty-banner-library">
          <div class="misty-banner-logos"></div>
        </div>
      </div>
      `
      $('.view:not(.hide) .homeSectionsContainer').prepend(banner)
      // $(".view:not(.hide) .section0").detach().appendTo(".view:not(.hide) .misty-banner-library");

      // 插入数据
      const data = await this.getItems(this.itemQuery)
      console.log(data)
      data.Items.forEach(async item => {
        const detail = await this.getItem(item.Id),
          itemHtml = `
        <div class="misty-banner-item" id="${detail.Id}">
          <img draggable="false" loading="eager" decoding="async" class="misty-banner-cover" src="${await this.getImageUrl(
            detail.Id,
            this.coverOptions
          )}" alt="Backdrop" style="">
          <div class="misty-banner-info padded-left padded-right">
            <h1>${detail.Name}</h1>
            <div><p>${detail.Overview}</p></div>
            <div><button onclick="appRouter.showItem('${detail.Id}')">MORE</button></div>
          </div>
        </div>
        `,
          logoHtml = `
        <img id="${
          detail.Id
        }" draggable="false" loading="auto" decoding="lazy" class="misty-banner-logo" data-banner="img-title" alt="Logo" src="${await this.getImageUrl(
            detail.Id,
            this.logoOptions
          )}">
        `
        if (detail.ImageTags && detail.ImageTags.Logo) {
          $('.misty-banner-logos').append(logoHtml)
        }
        $('.misty-banner-body').append(itemHtml)
        console.log(item.Id, detail)
      })

      // 只判断第一张海报加载完毕, 优化加载速度
      await new Promise((resolve, reject) => {
        let waitLoading = setInterval(() => {
          if (document.querySelector('.misty-banner-cover')?.complete) {
            clearInterval(waitLoading)
            resolve()
          }
        }, 16)
      })

      // 判断section0加载完毕
      await new Promise((resolve, reject) => {
        let waitsection0 = setInterval(() => {
          if (
            $('.view:not(.hide) .section0 .emby-scrollbuttons').length > 0 &&
            $('.view:not(.hide) .section0.hide').length == 0
          ) {
            clearInterval(waitsection0)
            resolve()
          }
        }, 16)
      })

      $('.view:not(.hide) .section0 .emby-scrollbuttons').remove()
      const items = $('.view:not(.hide) .section0 .emby-scroller .itemsContainer')[0].items
      if (CommonUtils.checkType() === 'pc') {
        $('.view:not(.hide) .section0').detach().appendTo('.view:not(.hide) .misty-banner-library')
      }

      $('.misty-loading').fadeOut(500, () => $('.misty-loading').remove())
      await CommonUtils.sleep(150)
      $('.view:not(.hide) .section0 .emby-scroller .itemsContainer')[0].items = items

      // 置入场动画
      let delay = 80 // 动媒体库画间隔
      let id = $('.misty-banner-item').eq(0).addClass('active').attr('id') // 初次信息动画
      $(`.misty-banner-logo[id=${id}]`).addClass('active')

      await CommonUtils.sleep(200) // 间隔动画
      $('.section0 > div').addClass('misty-banner-library-overflow') // 关闭overflow 防止媒体库动画溢出
      $('.misty-banner .card').each((i, dom) =>
        setTimeout(() => $(dom).addClass('misty-banner-library-show'), i * delay)
      ) // 媒体库动画
      await CommonUtils.sleep(delay * 8 + 1000) // 等待媒体库动画完毕
      $('.section0 > div').removeClass('misty-banner-library-overflow') // 开启overflow 防止无法滚动

      // 滚屏逻辑
      var index = 0
      clearInterval(this.bannerInterval)
      this.bannerInterval = setInterval(() => {
        // 背景切换
        if (window.location.href.endsWith('home') && !document.hidden) {
          index += index + 1 == $('.misty-banner-item').length ? -index : 1
          $('.misty-banner-body').css('left', -(index * 100).toString() + '%')
          // 信息切换
          $('.misty-banner-item.active').removeClass('active')
          let id = $('.misty-banner-item').eq(index).addClass('active').attr('id')
          // LOGO切换
          $('.misty-banner-logo.active').removeClass('active')
          $(`.misty-banner-logo[id=${id}]`).addClass('active')
        }
      }, 15000)

      // 鼠标按住滑动事件
      $('.misty-banner-body').on('mousedown', function (event) {
        console.log(event)
        if (event.button === 0) {
          // 左键按下
          let startX = event.clientX
          let endX

          $(document).on('mousemove', moveHandler)
          $(document).on('mouseup', upHandler)

          function moveHandler(event) {
            endX = event.clientX
          }

          function upHandler(event) {
            $(document).off('mousemove', moveHandler)
            $(document).off('mouseup', upHandler)

            if (endX !== undefined) {
              console.log('endX , startX', endX, startX)
              if (endX - startX >= 50) {
                index -= index == 0 ? -($('.misty-banner-item').length - 1) : 1
              } else if (endX - startX <= -50) {
                index += index + 1 == $('.misty-banner-item').length ? -index : 1
              } else {
                return
              }
              $('.misty-banner-body').css('left', -(index * 100).toString() + '%')
              $('.misty-banner-item.active').removeClass('active')
              let id = $('.misty-banner-item').eq(index).addClass('active').attr('id')
              $('.misty-banner-logo.active').removeClass('active')
              $(`.misty-banner-logo[id=${id}]`).addClass('active')
            }
          }
        }
      })
    }

    /* 初始事件 */
    static initEvent() {
      // 通过注入方式, 方可调用appRouter函数, 以解决Content-Script window对象不同步问题
      const script = `
      // 挂载appRouter
      if (!window.appRouter) window.appRouter = (await window.require(["appRouter"]))[0];
      /* // 修复library事件参数
      const serverId = ApiClient._serverInfo.Id,
        librarys = document.querySelectorAll(".view:not(.hide) .section0 .card");
      librarys.forEach(library => {
        library.setAttribute("data-serverid", serverId);
        library.setAttribute("data-type", "CollectionFolder");
      }); */
      `
      this.injectCode(script)
    }
  }

  // 运行
  if ('BroadcastChannel' in window || 'postMessage' in window) {
    if (
      $('meta[name=application-name]').attr('content') == 'Emby' ||
      $('.accent-emby') != undefined
    ) {
      Home.start()
    }
  }
}

function applyStyle() {
  let style = `
  .mainAnimatedPages.skinBody * {
    scrollbar-width: none;
  }

  .mdl-spinner {
    zoom: 0.5;
  }

  .skinHeader-withBackground {
    right: 0 !important;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), transparent);
    background-color: unset;
  }

  .view:not(.hide) .skinHeader,
  .skinHeader-withBackground.headroom-scrolling {
    width: auto;
    background-image: linear-gradient(black, transparent) !important;
    background-color: unset !important;
  }

  .view[data-type='home']:not(.hide) > div:nth-child(1) .scrollSlider.padded-top-page {
    padding-top: 0 !important;
  }

  .view:not(.hide) .itemsContainer-finepointerwrap {
    flex-wrap: initial !important;
    -webkit-flex-wrap: initial !important;
  }

  .view:not(.hide) .section0 {
    z-index: 2;
  }

  .view:not(.hide) .section0 .cardText {
    position: absolute;
    top: 0;
    display: flex; /* 如果不需要媒体库标题显示, 请将flex改为none */
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: rgba(0, 0, 0, 0.5);
    font-weight: bolder;
    font-size: larger;
    border-radius: 0.3em;
    transition: 0.2s;
    opacity: 0;
  }

  .view:not(.hide) .section0 .backdropCard:hover .cardText {
    opacity: 1;
  }

  .view:not(.hide) .section0 .cardText button {
    text-decoration: none;
    width: 100%;
  }

  .view:not(.hide) .section0 .cardOverlayContainer {
    background: none;
  }

  .view:not(.hide) .section0 .cardOverlayContainer label,
  .view:not(.hide) .section0 .sectionTitleContainer {
    display: none !important;
  }

  .view:not(.hide) .section0 .cardBox-touchzoom {
    box-shadow: 0 8px 10px rgb(0 0 0 / 15%);
  }

  .view:not(.hide) .section0 .backdropCard {
    transition: all 1.5s cubic-bezier(0, 1.75, 0.25, 1) 0s;
  }

  .view:not(.hide) .section0 .backdropCard:hover {
    transform: scale(1.1) !important;
  }

  .view:not(.hide) .section0 .scrollbuttoncontainer {
    top: 0;
    bottom: calc(0.8em - min(0.72em, max(0.48em, 1.78vw)) / 2);
    background-color: rgba(0, 0, 0, 0);
    overflow: visible;
  }

  .view:not(.hide) .section0 .scrollbuttoncontainer:hover > .emby-scrollbuttons-scrollbutton {
    background-color: rgba(0, 0, 0, 0.5);
    transform: scale(0.85) !important;
  }

  .tabs-viewmenubar-backgroundcontainer:not(.tabs-viewmenubar-backgroundcontainer-tv) {
    background: 0 0 !important;
    -webkit-backdrop-filter: blur(10px) !important;
    backdrop-filter: blur(10px) !important;
  }

  .misty-banner {
    position: relative;
    overflow: hidden;
  }

  .misty-banner-cover {
    width: 100%;
    max-height: 100vh;
    user-select: none;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(to top, transparent 0%, black 30%);
    mask-image: linear-gradient(to top, transparent 0%, black 30%);
  }

  .misty-banner-logo {
    position: absolute;
    user-select: none;
    object-fit: contain;
    height: clamp(0rem, -2.182rem + 10.91vw, 6rem);
    /* width: fit-content; */
    transform: translateY(calc(-50% - clamp(-2rem, -3.455rem + 7.27vw, 2rem)));
    right: calc(3.4% + min(0.72em, max(0.48em, 1.78vw)));
    opacity: 0;
    transition: 1s;
    transition-delay: 0.8s;
  }

  .misty-banner-logo.active {
    transform: translateY(calc(-100% - clamp(-2rem, -3.455rem + 7.27vw, 2rem)));
    opacity: 1;
  }

  .misty-loading {
    z-index: 99999999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .misty-loading h1 {
    margin: 0;
    margin-bottom: 3rem;
    text-transform: uppercase;
    transition: 0.8s;
    transform: scale(1.15);
    opacity: 0;
  }

  .misty-loading h1.active {
    transform: scale(1);
    opacity: 1;
  }

  .misty-loading .mdl-spinner {
    margin: 0;
    position: initial;
  }

  .misty-loading .mdl-spinner__layer-1 {
    border-color: #fff;
  }

  .misty-banner-library {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    padding: clamp(0rem, -1.313rem + 3.75vw, 1.5rem) 0;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.6), transparent);
  }

  .misty-banner-body {
    display: flex;
    position: relative;
    left: 0;
    transition: all 1.5s cubic-bezier(0.15, 0.07, 0, 1) 0s;
  }

  .misty-banner-item {
    min-width: 100%;
  }

  .misty-banner-info {
    width: 100%;
    margin: min(0.72em, max(0.48em, 1.78vw));
    margin-top: 0;
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100%;
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
  }

  .misty-banner-info > * {
    transition: all 2.5s cubic-bezier(0, 1.41, 0.36, 0.93) 0.4s;
    transform: translateY(150%);
    opacity: 0 !important;
  }

  .misty-banner-item.active .misty-banner-info > * {
    transform: translateY(0);
    opacity: 1 !important;
  }

  .misty-banner-info > div:nth-child(2) {
    transition-delay: 0.6s;
  }
  .misty-banner-info > div:nth-child(3) {
    transition-delay: 0.8s;
  }

  .misty-banner-info h1 {
    color: #fff !important;
    font-size: clamp(2rem, -0.362rem + 6.75vw, 4.7rem);
    font-weight: bolder;
    margin: 0;
    text-shadow: 0 4px 10px rgb(0 0 0 / 20%);
    /* margin-bottom: clamp(0rem, -.545rem + 2.73vw, 1.5rem); */
    max-width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .misty-banner-info p {
    color: #fff !important;
    font-size: clamp(0.6rem, 0.4rem + 1vw, 1.6rem);
    font-weight: bold;
    max-width: 47%;
    opacity: 0.7;
    /* overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .misty-banner-info button {
    cursor: pointer;
    margin-top: clamp(0rem, -2.625rem + 7.5vw, 3rem);
    width: 6em;
    height: 1.8em;
    background-color: #fff;
    border: none;
    font-size: clamp(0.6rem, -0.275rem + 2.5vw, 1.6rem);
    border-radius: 10px;
    font-weight: bold;
    letter-spacing: 2px;
    box-shadow: 0 2px 7px rgba(1, 1, 1, -0.8);
    font-family: system-ui;
    transition: 0.2s;
  }

  .misty-banner-info button:hover {
    transform: scale(0.95);
  }

  @media screen and (max-width: 62.5em) {
    .misty-banner-info button {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
    }
  }

  @media screen and (max-width: 35em) {
    .misty-banner-info {
      height: auto;
      bottom: 0;
      top: unset;
    }
    .misty-banner-info > div > p {
      font-size: 1rem;
    }

    .misty-banner-info button {
      transition-duration: 0s;
      transition-delay: 0s;
    }
    .misty-banner-logo {
      display: none !important;
    }

    .section0 > div > div > .backdropCard {
      --backdrop-cards: 1.5;
    }
  }

  .misty-banner .backdropCard {
    transition-duration: 0;
    transform: translateY(80%);
    opacity: 0;
  }

  .misty-banner-library-show {
    transition-duration: 1.7s !important;
    transform: translateY(0) !important;
    opacity: 1 !important;
  }

  .misty-banner-library-overflow {
    overflow: visible !important;
  }
  `
  let styleElement = document.createElement('style')
  styleElement.textContent = style
  document.head.appendChild(styleElement)
}

// 加载jQuery
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
  script.type = 'text/javascript';
  document.head.appendChild(script);
  script.onload = function() {
    // jQuery加载完成后执行
    $(document).ready(function() {
        console.log("jQuery 已动态加载并可用");
        main()
        applyStyle()
    });
  };
})();

})()