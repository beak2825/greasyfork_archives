// ==UserScript==
// @name         SUNFLOWER_ASSIST_GD
// @namespace    http://tampermonkey.net/gdcho
// @version      3.6
// @description  sunflower-land 自动收菜脚本
// @author       GDCHO
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444041/SUNFLOWER_ASSIST_GD.user.js
// @updateURL https://update.greasyfork.org/scripts/444041/SUNFLOWER_ASSIST_GD.meta.js
// ==/UserScript==
// SUNFLOWER全自动防封版，配置请看autoFarm函数
// 脚本联系:gd_cho
// 如果觉得好用，欢迎打赏: 0x52542247bcd813d1c77f2600Ed3d4397e13fBa00
// 功能:
// 1. 自动种植(防封版升级:仅在土地为空的时候种植)
// 2. 网络错误自动重连、探测宝箱自动领取
// 3. 自动登录
// 4. 自动买卖
// -----------
// 更新:
// 2.4
// 新增对土地4的挖掘
// 修复crops2有农作物不自动种植问题
// 2.5
// 买: 默认不会购买9号农作物，(划不来)
// 卖: 解锁4块地后，不卖10、8、7、4号农作物，(稀有需要的农作物都不会卖)
// 2.6
// 9号农作物更改回会进行购买
// 增加不卖9号农作物
// 2.7
// 修复官方更新内容
// 收菜
// 买卖，暂时不行
// 更换农作物优化
// 2.8
// 优化: 没有种子不种地，降低被系统检测概率
// 2.9
// 修复官方更新导致的不自动种植问题
// 3.0
// 修复官方更新导致的不自动种植问题
// 3.1
// 优化: 采集一个洞，探测一次宝箱
// 3.2
// 优化: 探测宝箱后重新种植原来的地坑
// 3.3
// 修复官方新添加的地精偷铲子，导致的种不了菜
// 3.4
// 修复官方更新的找不到地精
// 3.5
// 修复官方更新的找不到地精
// 3.6
// 修复官方更新内容

function i(i) {
  if (i) return i.querySelectorAll('img');
}
const h = (d) => {
    'use strict';
    return new Promise((i) => setTimeout(i, d));
  },
  d = async () => {
    let i = 0;
    for (; i < 5; ) {
      var d =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div > button.bg-brown-200.w-full.p-1.shadow-sm.text-white.text-shadow.object-contain.justify-center.items-center.hover\\:bg-brown-300.cursor-pointer.flex.disabled\\:opacity-50.overflow-hidden.mb-2'
        ) || '';
      if (d) return await s(d, 5, 10), !0;
      i++, await h(2e3);
    }
  },
  s = async (i, d, t) => {
    'use strict';
    d = 1e3 * u(d, t);
    i.click(), await h(d);
  },
  t = async () => {
    var i =
      document.querySelector(
        '#gameboard > div:nth-child(4) > div.w-5\\/12.sm\\:w-60.fixed.top-2.left-2.z-50.shadow-lg > div > div.flex.justify-center.p-1 > button:nth-child(2)'
      ) || '';
    i && (await s(i, 1, 5));
  },
  l = async () => {
    var i =
      document.querySelector(
        'body > div.fade.modal.show > div > div > div > div > div > div > img.w-16.hover\\:img-highlight.cursor-pointer'
      ) || '';
    if (i)
      return (
        await s(i, 1, 2),
        (i =
          document.querySelector(
            'body > div.fade.modal.show > div > div > div > div > div > button'
          ) || '') && (await s(i, 1, 2)),
        !0
      );
    i =
      document.querySelector(
        'body > div.fade.modal.show > div > div > div > div > div > button'
      ) || '';
    if (i) return await s(i, 1, 2), !0;
    t = 20;
    var t,
      d = new Array(30 - t)
        .fill(t)
        .map((i, d) => `#root > div > div > img:nth-child(${t + d})`)
        .filter((i) => {
          const d = document.querySelector(i);
          if (d) {
            const t = d?.getAttribute('src');
            return -1 !== t?.indexOf('shovel');
          }
        });
    if (d) {
      for (const h of d) await s(document.querySelector(h), 1, 2);
      return (
        (document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div.flex > button'
        ) ||
          '') &&
          (await s(i, 1, 2)),
        !0
      );
    }
    return !1;
  },
  v = async () => {
    const i =
      document.querySelector(
        'body > div.fade.modal.show > div > div > div > div > div > span:nth-child(1)'
      )?.innerText || '';
    i &&
      -1 !== i.toLocaleLowerCase().indexOf('something went wrong') &&
      (await t(), unsafeWindow.location.reload(!0));
  },
  e = async (i) => {
    try {
      var d = i.i;
      await s(d, 1, 3);
    } catch (i) {
      console.log('进入商店错误，', i.message);
    }
  },
  o = async () => {
    var i =
      document.querySelector(
        'body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img'
      ) || '';
    i && (await s(i, 1, 3));
  },
  c = async () => {
    var i = new x(),
      d = i.t,
      t = i.h;
    let h = 0,
      v = 0,
      e = 0;
    try {
      i.v || (v = 5);
    } catch (i) {}
    d && (h = 3), t && (e = 7);
    var o,
      i =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > div > div:nth-child(2)'
        ) || '',
      l = (await s(i, 1, 3), new w()),
      c = l.o,
      n = l.l;
    for (let i = 0; i < c.length; ++i)
      (h || v || e) - 1 !== i &&
        ((o = i + 1),
        (h ||
          v ||
          e ||
          (10 !== o && 8 !== o && 7 !== o && 4 !== o && 9 !== o)) &&
          n[i] &&
          (await s(c[i], 1, 3),
          (o = l.u),
          await s(o, 1, 3),
          (o =
            document.querySelector(
              'body > div:nth-child(18) > div > div > div > div > div.flex.justify-content-around.p-1 > button:nth-child(1)'
            ) || '') && (await s(o, 1, 3))));
  },
  n = async (d) => {
    var i =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > div > div:nth-child(1)'
        ) || '',
      i = (await s(i, 1, 3), new w()),
      t = i.o;
    for (let i = 0; i < t.length; ++i)
      if ((d || 0) - 1 !== i) {
        if (
          (await s(t[i], 1, 2),
          (parseFloat(
            document.querySelector(
              '#gameboard > div:nth-child(4) > div.bg-brown-300.p-1.fixed.top-2.right-2.z-50.flex.items-center.shadow-lg.cursor-pointer > span'
            )?.innerText
          ) || '') <
            (document.querySelector(
              'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > div > div.flex.justify-center.items-end > span'
            ) || ''))
        )
          break;
        var h =
            document.querySelector(
              'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(6)'
            ) || '',
          v =
            document.querySelector(
              'body > div:nth-child(4) > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(5)'
            ) || '';
        if (h && v) {
          for (let i = 0; i < 10; ++i) await s(h, 1, 3), await s(v, 1, 3);
          break;
        }
      }
  },
  r = async (i, d) => {
    var t = i.m,
      h = i.p,
      i = i.g,
      v = parseInt(t.innerText) || 0,
      e = parseInt(h.innerText) || 0,
      o = parseInt(i.innerText) || 0;
    (!t || 1 === v) && 1 < o
      ? await s(i, 1, 3)
      : (!t || 1 === v) && 1 < e && (await s(h, 1, 3));
  },
  u = (i, d) => {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * i + 1, 10);
      case 2:
        return parseInt(Math.random() * (d - i + 1) + i, 10);
      default:
        return 1;
    }
  },
  a = async (i) => {
    var d = new g(),
      t = new y(),
      h = new x(),
      v = d.j,
      e = t.k,
      o = async (i, d) => {
        if (!i) {
          const click = d;
          await s(click, 1, 2), await s(click, 1, 2);
        }
        (await l()) && (await s(click, 1, 2));
      };
    if (i.m)
      for (let i = 0; i < v.length; ++i) {
        try {
          0 <= i && i <= 4 && (await o(e[i], v[i]));
        } catch (i) {
          console.log('农田1错误，', i.message);
        }
        try {
          5 <= i && i <= 9 && (h.t || (await o(e[i], v[i])));
        } catch (i) {
          console.log('农田2错误，', i.message);
        }
        try {
          10 <= i && i <= 15 && (h.v || (await o(e[i], v[i])));
        } catch (i) {
          console.log('农田3错误，', i.message);
        }
        try {
          16 <= i && i <= 21 && (h.h || (await o(e[i], v[i])));
        } catch (i) {
          console.log('农田4错误，', i.message);
        }
      }
  },
  m = async () => {
    var i = new p();
    await d(), await v(), await a(i), await h(1e3 * u(1, 3)), await r(i, 0);
  };
var f = 0;
!(async function i() {
  var d = new Date().getTime();
  try {
    await m();
  } catch (i) {
    console.log('出错，重新循环', i.message);
  }
  clearTimeout(f), (f = setTimeout(i, 1e3 * u(61, 65)));
  var t = new Date().getTime();
  console.log('执行时间：', (t - d) / 1e3 + 's');
})();
class p {
  constructor() {
    (this.I =
      i(
        document.querySelector(
          '#gameboard > div:nth-child(6) > div:nth-child(2)'
        )
      ) || ''),
      (this.A = i(document.querySelector('#cropzone-two')) || ''),
      (this.T = i(document.querySelector('#cropzone-three')) || ''),
      (this.D = i(document.querySelector('#cropzone-four')) || ''),
      (this.i =
        document.querySelector(
          '#shop > div > div.bg-brown-300.p-1.text-white.text-shadow.text-xs.w-fit'
        ) || ''),
      (this.M =
        i(
          document.querySelector(
            'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit'
          )
        ) || ''),
      (this.P =
        i(
          document.querySelector(
            'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit'
          )
        ) || ''),
      (this.m =
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(1) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(5) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(1) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(1) > div > div.bg-silver-300.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10 > div'
        ) ||
        ''),
      (this.p =
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(2) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(5) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(2) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(2) > div > div.bg-silver-300.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10 > div'
        ) ||
        ''),
      (this.g =
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(3) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(5) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(3) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(3) > div > div.bg-silver-300.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10 > div'
        ) ||
        '');
  }
}
class w {
  constructor() {
    (this.S =
      document.querySelector(
        'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(1) > div > img'
      ) || ''),
      (this.K =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(2) > div > img'
        ) || ''),
      (this.N =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(3) > div > img'
        ) || ''),
      (this.W =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(4) > div > img'
        ) || ''),
      (this.q =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(5) > div > img'
        ) || ''),
      (this.C =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(6) > div > img'
        ) || ''),
      (this.F =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(7) > div > img'
        ) || ''),
      (this.J =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(8) > div > img'
        ) || ''),
      (this.L =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(9) > div > img'
        ) || ''),
      (this.R =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(10) > div > img'
        ) || ''),
      (this.o = [
        this.S,
        this.K,
        this.N,
        this.W,
        this.q,
        this.C,
        this.F,
        this.J,
        this.L,
        this.R,
      ]),
      (this.V =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(1) > div > div'
        ) || ''),
      (this.Z =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(2) > div > div'
        ) || ''),
      (this.$ =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(3) > div > div'
        ) || ''),
      (this.B =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(4) > div > div'
        ) || ''),
      (this.G =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(5) > div > div'
        ) || ''),
      (this.H =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(6) > div > div'
        ) || ''),
      (this.O =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(7) > div > div'
        ) || ''),
      (this.U =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(8) > div > div'
        ) || ''),
      (this.X =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(9) > div > div'
        ) || ''),
      (this.Y =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(10) > div > div'
        ) || ''),
      (this.l = [
        this.V,
        this.Z,
        this.$,
        this.B,
        this.G,
        this.H,
        this.O,
        this.U,
        this.X,
        this.Y,
      ]),
      (this.u =
        document.querySelector(
          'body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button.bg-brown-200.w-full.p-1.shadow-sm.text-white.text-shadow.object-contain.justify-center.items-center.hover\\:bg-brown-300.cursor-pointer.flex.disabled\\:opacity-50.text-xs.mt-1.whitespace-nowrap'
        ) || '');
  }
}
class y {
  constructor() {
    (this._ =
      document.querySelector(
        '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
      ) ||
      document.querySelector(
        '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
      ) ||
      ''),
      (this.ii =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.di =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div.flex.justify-center > div > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div.flex.justify-center > div > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ti =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.hi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.vi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ei =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.oi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div.flex.justify-center > div > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div.flex.justify-center > div > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.li =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ci =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ni =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.si =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ri =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ui =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.ai =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.mi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.fi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.pi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.wi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.yi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.gi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.xi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > img'
        ) ||
        ''),
      (this.k = [
        this._,
        this.ii,
        this.di,
        this.ti,
        this.hi,
        this.vi,
        this.ei,
        this.oi,
        this.li,
        this.ci,
        this.ni,
        this.si,
        this.ri,
        this.ui,
        this.ai,
        this.mi,
        this.fi,
        this.pi,
        this.wi,
        this.yi,
        this.gi,
        this.xi,
      ]);
  }
}
class g {
  constructor() {
    (this.bi =
      document.querySelector(
        '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
      ) ||
      document.querySelector(
        '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
      ) ||
      ''),
      (this.zi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.ji =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.ki =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ii =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ai =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Qi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ti =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Di =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Mi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Pi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Si =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ei =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ki =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ni =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Wi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.qi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ci =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Fi =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ji =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Li =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.Ri =
        document.querySelector(
          '#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        document.querySelector(
          '#root > div > div > div:nth-child(7) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer'
        ) ||
        ''),
      (this.j = [
        this.bi,
        this.zi,
        this.ji,
        this.ki,
        this.Ii,
        this.Ai,
        this.Qi,
        this.Ti,
        this.Di,
        this.Mi,
        this.Pi,
        this.Si,
        this.Ei,
        this.Ki,
        this.Ni,
        this.Wi,
        this.qi,
        this.Ci,
        this.Fi,
        this.Ji,
        this.Li,
        this.Ri,
      ]);
  }
}
class x {
  constructor() {
    (this.t =
      document.querySelector(
        '#gameboard > div:nth-child(6) > img.absolute.z-10.hover\\:img-highlight.cursor-pointer'
      ) || ''),
      (this.v =
        document.querySelector(
          '#gameboard > div:nth-child(6) > img:nth-child(7)'
        ) || ''),
      (this.Vi = 'Q2KmiWanJ2Se6ENrZoCaSionmAPfyiVKQwQELSTNby9qim8vyMQPRAhADs='),
      (this.h =
        document.querySelector(
          '#gameboard > div:nth-child(6) > img.absolute.z-20.hover\\:img-highlight.cursor-pointer.-scale-x-100'
        ) || '');
  }
}
