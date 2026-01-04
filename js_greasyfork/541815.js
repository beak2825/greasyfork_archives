// ==UserScript==
// @name         手机视频播放器增强
// @description  滑动快进快退，双击播放/暂停，长按16倍速
// @version      1.0
// @author       WJ
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/541815/%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541815/%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(() => {

  // 动态监听
  let videoen;
  const scan = el => {
    if (el._scanned) return;
    if (el.tagName === 'IFRAME') {
      el._scanned = true;
      el.allowFullscreen = true;
    } else if (el.tagName === 'VIDEO') {
      !videoen && (runVideo(),videoen = true);
      el._scanned = true;
      const a = el.closest('a');
      if (a && !a._videoFi) {
        a._videoFi = true;
        a.draggable = false;
        a.target = '_blank';
        a.oncontextmenu = e => e.preventDefault();
        a.addEventListener('click', e => e.preventDefault(), { capture: true });
      }
    } else {
    el.querySelectorAll('iframe, video').forEach(child => scan(child));
    }
  };
  setTimeout(() => document.body.querySelectorAll('iframe,video').forEach(scan), 1000);
  new MutationObserver(ms => {
    ms.forEach(m => {
      requestIdleCallback(() =>
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1 && !n._scanned) scan(n);
        })
      );
    });
  }).observe(document.body, { childList: true, subtree: true });

  // 横屏锁定
  if (top === window) {
    const nativeLock = screen.orientation.lock;
    screen.orientation.lock = () => {};
    addEventListener('message', async e => {
      if (e.data === '锁定横屏' && document.fullscreenElement) {
        screen.orientation.lock = nativeLock;
        await screen.orientation.lock('landscape').catch(()=>{});
        screen.orientation.lock = () => {};
      }
    });
  }

  // 👌视频增强主功能
  function runVideo() {
  console.log('手势监听启动');

    // 全屏检测
    let Quanp,Cvideo;
    const QingTZ = () => document.body.querySelectorAll('video').forEach(
      v => v.Notice && (v.Notice.remove(), v.Notice = false)
    );
    window.addEventListener('resize', () => setTimeout(() => {
      const QuanpYS = document.fullscreenElement;
      if (QuanpYS?.tagName === 'IFRAME') return;
      if (!Quanp && QuanpYS) {
        Cvideo = QuanpYS.tagName === 'VIDEO'
          ? [QuanpYS] : [...QuanpYS.querySelectorAll('video')];
        if (!Cvideo.length) return;
        Quanp = true;QingTZ();
        Cvideo = Cvideo.length === 1
          ? Cvideo[0] : Cvideo.sort((a, b) =>
              Math.abs(a.getBoundingClientRect().top) -
              Math.abs(b.getBoundingClientRect().top)
          )[0];
        const Hengp = () => {
          if (Cvideo.videoWidth > Cvideo.videoHeight) {
            top.postMessage('锁定横屏', '*');
            Cvideo.play();
          }
        };
        Cvideo.readyState > 0 ? Hengp()
          : Cvideo.addEventListener('loadedmetadata', Hengp, { once: true });
      } else if (Quanp && !QuanpYS) {
        Quanp = false;QingTZ();
      }
    }, 300));

    // 查找视频元素
    const DuanSP = (target, video) =>
      !document.fullscreenElement && top === window && !video.controls &&
      target.clientHeight > window.innerHeight * 0.8 && target.clientWidth  > window.innerWidth  * 0.8;
    function CZvideo(el) {
      const target = el;
      const maxK = el.clientWidth;
      const maxG = el.clientHeight;
      while ((el = el.parentElement) && el !== document.body) {
        if (maxG * 1.2 < el.clientHeight || maxK * 1.2 < el.clientWidth) continue;
        const videog = [...el.querySelectorAll('video')]
             .filter(v => DuanSP(target, v) || maxG < v.clientHeight * 1.5);
        if (!videog.length) continue;
        return videog.length === 1 ? videog[0] : videog.find(v => !v.paused) || false;
      }
      return false;
    }

    // 播放速率锁定
    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
    const SLsuo = (videoYS, lock = true) => {
      Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', lock
        ? { set(v) { desc.set.call(this, 16); }, get: desc.get, configurable: true }
        : desc);
      SLsuo.locked = lock;
      videoYS.playbackRate = lock ? 16 : 1;
    };

    // 提示条UI
    function uiBL (videoYS) {
      if (videoYS.Notice) {
      videoYS.Notice.style.display = 'flex'
      return videoYS.Notice}
      const host = videoYS.parentElement;
      const cr = host.getBoundingClientRect();
      const vr = videoYS.getBoundingClientRect();
      const tishiT = document.createElement('div');
      tishiT.className = 'tishiT';
      tishiT.style.cssText = `
        left:${vr.left - cr.left + vr.width / 2}px;transform:translateX(-50%);
        top:${vr.top - cr.top + vr.height / 6}px;border-radius:5px;position:absolute;
        background:rgba(0,0,0,.9);color:#fff;display:flex;justify-content:center;
        align-items:center;text-align:center;font-size:24px;padding:8px 10px;z-index:99999`;
      host.appendChild(tishiT);
      return videoYS.Notice = tishiT;
    }

    // 添加全局样式
    GM_addStyle(`
      video{user-select:none !important;touch-action:manipulation !important;
      -webkit-touch-callout:none !important;-webkit-tap-highlight-color:transparent !important}
      .gsl-play-mask,.dplayer-menu,.mplayer-time{display:none !important}
    `);

    // 👍触摸事件主流程
    let last = 0,last1 = 0;
    const killev = e => (e.preventDefault(), e.stopPropagation());
    const fmt = t => new Date(t * 1e3).toISOString().substr(11, 8).replace(/^(00:)?/, '');
    document.addEventListener('touchstart', e => {
      const videoYS = e.target.tagName === 'VIDEO' ? e.target : CZvideo(e.target);
      if (!videoYS || !isFinite(videoYS.duration) || e.touches.length !== 1) return;

      // 拦截触摸元素右键菜单
      const target = e.target;
      if (!target._videoFi) {
        target._videoFi = true;
        target.oncontextmenu = ev => ev.preventDefault();
        if (target.tagName === 'IMG') {target.draggable = false;}
      }

      // 全屏边缘区域判断
      const { screenX, screenY } = e.touches[0];
      if (document.fullscreenElement &&
        (screenX < screen.width * 0.05 || screenX > screen.width * 0.95 ||
        screenY < screen.height * 0.05 || screenY > screen.height * 0.95)) return;

      // 双击播放/暂停
      const bfzt = !videoYS.paused;
      if (Date.now() - last < 300) {
        killev(e);
        last = 0;
        !bfzt ? videoYS.play() : videoYS.pause(); return;
      }

      // 长按16倍速
      const Chang = setTimeout(() => {
        killev(e);
        SLsuo(videoYS,true);
        !bfzt && videoYS.play();
        uiBL(videoYS).textContent = '16 X';
        target.removeEventListener('touchmove', huadJT);
      }, 500);

      // 滑动快进快退
      let Huad,Ting;
      const videoK = window.innerWidth;
      const kill = !DuanSP(target,videoYS);
      const videoMiao = videoYS.duration;
      const { clientX, clientY } = e.touches[0];
      target.addEventListener('touchmove', huadJT = (e) => {
        if (kill) killev(e);
        if (Ting == 1) return;
        if (!Ting) clearTimeout(Chang);
        const [dx,dy] = [e.touches[0].clientX-clientX,e.touches[0].clientY-clientY];
        if (!Ting && Math.abs(dy) > Math.abs(dx) * 0.46) return Ting = 1;
        if (Math.abs(dx) < 10 && !Ting) return Ting = 3;
        Huad = dx / videoK * videoMiao | 0;
        if (Date.now() - last1 < 100) return;
        last1 = Date.now();
        if (Ting !== 2) {Ting = 2;uiBL(videoYS)}
        const Time = Math.max(0, Math.min(videoMiao, videoYS.currentTime + Huad));
        videoYS.Notice.textContent = `${Huad > 0 ? '▶▶' : '◀◀'}${fmt(Time)}/${fmt(videoMiao)}`;
      }, { passive: false });

      // 触摸结束处理
      target.addEventListener('touchend', () => {
        if (videoYS.Notice) videoYS.Notice.style.display = 'none';
        if (SLsuo.locked) {
          SLsuo(videoYS,false);return;
        } else if (Huad) {
          videoYS.currentTime += Huad;
        } else if (!Ting) {
          last = Date.now();
          clearTimeout(Chang);
          videoYS.muted && (videoYS.muted = false);
          setTimeout(() => last && bfzt && videoYS.paused && kill && videoYS.play(), 500);
        };
        target.removeEventListener('touchmove', huadJT);
      }, { once: true });

    },{capture: true,passive: false});
  }
})();