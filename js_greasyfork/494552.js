// ==UserScript==
// @name         Luogu QQ 表情显示
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  一款可以帮助您在洛谷信息中使用QQ表情的脚本
// @author       dreaum
// @license      GPL-3.0-or-later
// @match        https://www.luogu.com.cn/*
// @exclude      https://www.luogu.com.cn/record/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494552/Luogu%20QQ%20%E8%A1%A8%E6%83%85%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494552/Luogu%20QQ%20%E8%A1%A8%E6%83%85%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 感谢Maxmilite提供的部分表情图址（参考LuoguEmojiSender插件）
    //配合LuoguEmojiSender脚本使用更佳

    //1.0.0 正式发布
    //1.0.1 修复 ScatteredHope 反馈的"cy"表情链接失效
    //1.1.0 增加排除替换页面（新建文章、剪切板、评论等）
    //1.2.0 优化搜索算法，感谢 Maxmilite 的推广
    //1.2.1 增加代码注释并上传greasyfork
    //1.3.0 重构搜索算法，减少遍历节点，使页面更流畅，感谢 ScatteredHope 反馈
    //1.3.1 修复搜索时间过长
    //1.3.2 修复提交记录页面无法加载
    //1.5.0 全面更新表情列表链接，去除无效网址，替换成自部署的qqemoji.pages.dev

    // QQ 表情列表
    const emojiMap = {
        "/aini": "https://qqemoji.pages.dev/aini.gif",
        "/aiq": "https://qqemoji.pages.dev/aiq.gif",
        "/am": "https://qqemoji.pages.dev/am.gif",
        "/azgc": "https://qqemoji.pages.dev/azgc.gif",
        "/baiy": "https://qqemoji.pages.dev/baiy.gif",
        "/bangbangt": "https://qqemoji.pages.dev/bangbangt.gif",
        "/baojin": "https://qqemoji.pages.dev/baojin.gif",
        "/bb": "https://qqemoji.pages.dev/bb.gif",
        "/bkx": "https://qqemoji.pages.dev/bkx.gif",
        "/bl": "https://qqemoji.pages.dev/bl.gif",
        "/bobo": "https://qqemoji.pages.dev/bobo.gif",
        "/bp": "https://qqemoji.pages.dev/bp.gif",
        "/bq": "https://qqemoji.pages.dev/bq.gif",
        "/bs": "https://qqemoji.pages.dev/bs.gif",
        "/bt": "https://qqemoji.pages.dev/bt.gif",
        "/bu": "https://qqemoji.pages.dev/bu.gif",
        "/bz": "https://qqemoji.pages.dev/bz.gif",
        "/cengyiceng": "https://qqemoji.pages.dev/cengyiceng.gif",
        "/ch": "https://qqemoji.pages.dev/ch.gif",
        "/chi": "https://qqemoji.pages.dev/chi.gif",
        "/cj": "https://qqemoji.pages.dev/cj.gif",
        "/cp": "https://qqemoji.pages.dev/cp.gif",
        "/dan": "https://qqemoji.pages.dev/dan.gif",
        "/dao": "https://qqemoji.pages.dev/dao.gif",
        "/db": "https://qqemoji.pages.dev/db.gif",
        "/dg": "https://qqemoji.pages.dev/dg.gif",
        "/dgg": "https://qqemoji.pages.dev/dgg.gif",
        "/dk": "https://qqemoji.pages.dev/dk.gif",
        "/dl": "https://qqemoji.pages.dev/dl.gif",
        "/doge": "https://qqemoji.pages.dev/doge.gif",
        "/dx": "https://qqemoji.pages.dev/dx.gif",
        "/dy": "https://qqemoji.pages.dev/dy.gif",
        "/dz": "https://qqemoji.pages.dev/dz.gif",
        "/ee": "https://qqemoji.pages.dev/ee.gif",
        "/fad": "https://qqemoji.pages.dev/fad.gif",
        "/fade": "https://qqemoji.pages.dev/fade.gif",
        "/fan": "https://qqemoji.pages.dev/fan.gif",
        "/fd": "https://qqemoji.pages.dev/fd.gif",
        "/fendou": "https://qqemoji.pages.dev/fendou.gif",
        "/fj": "https://qqemoji.pages.dev/fj.gif",
        "/fn": "https://qqemoji.pages.dev/fn.gif",
        "/fw": "https://qqemoji.pages.dev/fw.gif",
        "/gg": "https://qqemoji.pages.dev/gg.gif",
        "/gy": "https://qqemoji.pages.dev/gy.gif",
        "/gz": "https://qqemoji.pages.dev/gz.gif",
        "/hanx": "https://qqemoji.pages.dev/hanx.gif",
        "/haob": "https://qqemoji.pages.dev/haob.gif",
        "/hb": "https://qqemoji.pages.dev/hb.gif",
        "/hc": "https://qqemoji.pages.dev/hc.gif",
        "/hd": "https://qqemoji.pages.dev/hd.gif",
        "/hec": "https://qqemoji.pages.dev/hec.gif",
        "/hn": "https://qqemoji.pages.dev/hn.gif",
        "/hp": "https://qqemoji.pages.dev/hp.gif",
        "/hq": "https://qqemoji.pages.dev/hq.gif",
        "/hsh": "https://qqemoji.pages.dev/hsh.gif",
        "/ht": "https://qqemoji.pages.dev/ht.gif",
        "/huaix": "https://qqemoji.pages.dev/huaix.gif",
        "/hx": "https://qqemoji.pages.dev/hx.gif",
        "/jd": "https://qqemoji.pages.dev/jd.gif",
        "/jh": "https://qqemoji.pages.dev/jh.gif",
        "/jiaybb": "https://qqemoji.pages.dev/jiaybb.gif",
        "/jiaybs": "https://qqemoji.pages.dev/jiaybs.gif",
        "/jie": "https://qqemoji.pages.dev/jie.gif",
        "/jk": "https://qqemoji.pages.dev/jk.gif",
        "/jw": "https://qqemoji.pages.dev/jw.gif",
        "/jx": "https://qqemoji.pades.dev/jx.gif",
        "/jy": "https://qqemoji.pages.dev/jy.gif",
        "/ka": "https://qqemoji.pages.dev/ka.gif",
        "/kb": "https://qqemoji.pages.dev/kb.gif",
        "/kel": "https://qqemoji.pages.dev/kel.gif",
        "/kf": "https://qqemoji.pages.dev/kf.gif",
        "/kg": "https://qqemoji.pages.dev/kg.gif",
        "/kk": "https://qqemoji.pages.dev/kk.gif",
        "/kl": "https://qqemoji.pages.dev/kl.gif",
        "/kt": "https://qqemoji.pages.dev/kt.gif",
        "/kuk": "https://qqemoji.pages.dev/kuk.gif",
        "/kun": "https://qqemoji.pages.dev/kun.gif",
        "/kzht": "https://qqemoji.pages.dev/kzht.gif",
        "/lb": "https://qqemoji.pages.dev/lb.gif",
        "/lengh": "https://qqemoji.pages.dev/lengh.gif",
        "/lh": "https://qqemoji.pages.dev/lh.gif",
        "/ll": "https://qqemoji.pages.dev/ll.gif",
        "/lm": "https://qqemoji.pages.dev/lm.gif",
        "/lq": "https://qqemoji.pages.dev/lq.gif",
        "/lw": "https://qqemoji.pages.dev/lw.gif",
        "/meigui": "https://qqemoji.pages.dev/mg.gif",
        "/mm": "https://qqemoji.pages.dev/mm.gif",
        "/ng": "https://qqemoji.pages.dev/ng.gif",
        "/oh": "https://qqemoji.pages.dev/oh.gif",
        "/ou": "https://qqemoji.pages.dev/ou.gif",
        "/pch": "https://qqemoji.pages.dev/pch.gif",
        "/pj": "https://qqemoji.pages.dev/pj.gif",
        "/pp": "https://qqemoji.pages.dev/pp.gif",
        "/pt": "https://qqemoji.pages.dev/pt.gif",
        "/px": "https://qqemoji.pages.dev/px.gif",
        "/qd": "https://qqemoji.pages.dev/qd.gif",
        "/qiang": "https://qqemoji.pages.dev/qiang.gif",
        "/qiao": "https://qqemoji.pages.dev/qiao.gif",
        "/qidao": "https://qqemoji.pages.dev/qidao.gif",
        "/qq": "https://qqemoji.pages.dev/qq.gif",
        "/qt": "https://qqemoji.pages.dev/qt.gif",
        "/ruo": "https://qqemoji.pages.dev/ruo.gif",
        "/sa": "https://qqemoji.pages.dev/sa.gif",
        "/se": "https://qqemoji.pages.dev/se.gif",
        "/sh": "https://qqemoji.pages.dev/sh.gif",
        "/shd": "https://qqemoji.pages.dev/shd.gif",
        "/shl": "https://qqemoji.pages.dev/shl.gif",
        "/shuai": "https://qqemoji.pages.dev/shuai.gif",
        "/shui": "https://qqemoji.pages.dev/shui.gif",
        "/shxi": "https://qqemoji.pages.dev/shxi.gif",
        "/sr": "https://qqemoji.pages.dev/sr.gif",
        "/tiao": "https://qqemoji.pages.dev/tiao.gif",
        "/tl": "https://qqemoji.pages.dev/tl.gif",
        "/tnl": "https://qqemoji.pages.dev/tnl.gif",
        "/tp": "https://qqemoji.pages.dev/tp.gif",
        "/ts": "https://qqemoji.pages.dev/ts.gif",
        "/tsh": "https://qqemoji.pages.dev/tsh.gif",
        "/tuu": "https://qqemoji.pages.dev/tuu.gif",
        "/tx": "https://qqemoji.pages.dev/tx.gif",
        "/taiyang": "https://qqemoji.pages.dev/ty.gif",
        "/tyt": "https://qqemoji.pages.dev/tyt.gif",
        "/wbk": "https://qqemoji.pages.dev/wbk.gif",
        "/wl": "https://qqemoji.pages.dev/wl.gif",
        "/wn": "https://qqemoji.pages.dev/wn.gif",
        "/wq": "https://qqemoji.pages.dev/wq.gif",
        "/ws": "https://qqemoji.pages.dev/ws.gif",
        "/wx": "https://qqemoji.pages.dev/wx.gif",
        "/wzm": "https://qqemoji.pages.dev/wzm.gif",
        "/xhx": "https://qqemoji.pages.dev/xhx.gif",
        "/xia": "https://qqemoji.pages.dev/xia.gif",
        "/xig": "https://qqemoji.pages.dev/xig.gif",
        "/xin": "https://qqemoji.pages.dev/xin.gif",
        "/xjj": "https://qqemoji.pages.dev/xjj.gif",
        "/xk": "https://qqemoji.pages.dev/xk.gif",
        "/xs": "https://qqemoji.pages.dev/xs.gif",
        "/xu": "https://qqemoji.pages.dev/xu.gif",
        "/xw": "https://qqemoji.pages.dev/xw.gif",
        "/xy": "https://qqemoji.pages.dev/xy.gif",
        "/xyx": "https://qqemoji.pages.dev/xyx.gif",
        "/yao": "https://qqemoji.pages.dev/yao.gif",
        "/yb": "https://qqemoji.pages.dev/yb.gif",
        "/yhh": "https://qqemoji.pages.dev/yhh.gif",
        "/yiw": "https://qqemoji.pages.dev/yiw.gif",
        "/yl": "https://qqemoji.pages.dev/yl.gif",
        "/youl": "https://qqemoji.pages.dev/youl.gif",
        "/youtj": "https://qqemoji.pages.dev/youtj.gif",
        "/yt": "https://qqemoji.pages.dev/yt.gif",
        "/yun": "https://qqemoji.pages.dev/yun.gif",
        "/yx": "https://qqemoji.pages.dev/yx.gif",
        "/zhd": "https://qqemoji.pages.dev/zhd.gif",
        "/zhem": "https://qqemoji.pages.dev/zhem.gif",
        "/zhh": "https://qqemoji.pages.dev/zhh.gif",
        "/zhm": "https://qqemoji.pages.dev/zhm.gif",
        "/zhq": "https://qqemoji.pages.dev/zhq.gif",
        "/zj": "https://qqemoji.pages.dev/zj.gif",
        "/zk": "https://qqemoji.pages.dev/zk.gif",
        "/zq": "https://qqemoji.pages.dev/zq.gif",
        "/zt": "https://qqemoji.pages.dev/zt.gif",
        "/zuotj": "https://qqemoji.pages.dev/zuotj.gif",
        "/zyj": "https://qqemoji.pages.dev/zyj.gif",
        "/QQmua": "https://qqemoji.pages.dev/QQmua.gif",
        "/QQ比心": "https://qqemoji.pages.dev/QQ比心.gif",
        "/QQ车身": "https://qqemoji.pages.dev/QQ车身.gif",
        "/QQ扯": "https://qqemoji.pages.dev/QQ扯.gif",
        "/QQ大笑": "https://qqemoji.pages.dev/QQ大笑.gif",
        "/QQ袋子": "https://qqemoji.pages.dev/QQ袋子.gif",
        "/QQ得意": "https://qqemoji.pages.dev/QQ得意.gif",
        "/QQ灯泡": "https://qqemoji.pages.dev/QQ灯泡.gif",
        "/QQ凋谢": "https://qqemoji.pages.dev/QQ凋谢.gif",
        "/QQ发财": "https://qqemoji.pages.dev/QQ发财.gif",
        "/QQ方块": "https://qqemoji.pages.dev/QQ方块.gif",
        "/QQ肥皂": "https://qqemoji.pages.dev/QQ肥皂.gif",
        "/QQ风车": "https://qqemoji.pages.dev/QQ风车.gif",
        "/QQ滚": "https://qqemoji.pages.dev/QQ滚.gif",
        "/QQ戒指": "https://qqemoji.pages.dev/QQ戒指.gif",
        "/QQ卷纸": "https://qqemoji.pages.dev/QQ卷纸.gif",
        "/QQ考虑中": "https://qqemoji.pages.dev/QQ考虑中.gif",
        "/QQ狂笑": "https://qqemoji.pages.dev/QQ狂笑.gif",
        "/QQ栗子": "https://qqemoji.pages.dev/QQ栗子.gif",
        "/QQ厉害": "https://qqemoji.pages.dev/QQ厉害.gif",
        "/QQ略略": "https://qqemoji.pages.dev/QQ略略.gif",
        "/QQ面条": "https://qqemoji.pages.dev/QQ面条.gif",
        "/QQ面无表情": "https://qqemoji.pages.dev/QQ面无表情.gif",
        "/QQ闹钟": "https://qqemoji.pages.dev/QQ闹钟.gif",
        "/QQ气球": "https://qqemoji.pages.dev/QQ气球.gif",
        "/QQ汽车": "https://qqemoji.pages.dev/QQ汽车.gif",
        "/QQ青蛙": "https://qqemoji.pages.dev/QQ青蛙.gif",
        "/QQ扔粪": "https://qqemoji.pages.dev/QQ扔粪.gif",
        "/QQ伞": "https://qqemoji.pages.dev/QQ伞.gif",
        "/QQ沙发": "https://qqemoji.pages.dev/QQ沙发.gif",
        "/QQ扇脸": "https://qqemoji.pages.dev/QQ扇脸.gif",
        "/QQ帅": "https://qqemoji.pages.dev/QQ帅.gif",
        "/QQ哇哦": "https://qqemoji.pages.dev/QQ哇哦.gif",
        "/QQ下雨": "https://qqemoji.pages.dev/QQ下雨.gif",
        "/QQ香蕉": "https://qqemoji.pages.dev/QQ香蕉.gif",
        "/QQ享受": "https://qqemoji.pages.dev/QQ享受.gif",
        "/QQ信封": "https://qqemoji.pages.dev/QQ信封.gif",
        "/QQ熊猫": "https://qqemoji.pages.dev/QQ熊猫.gif",
        "/QQ右车头": "https://qqemoji.pages.dev/QQ右车头.gif",
        "/QQ云": "https://qqemoji.pages.dev/QQ云.gif",
        "/QQ左车头": "https://qqemoji.pages.dev/QQ左车头.gif",
        "/cy": "https://s21.ax1x.com/2024/05/05/pkAotn1.png",
        "/mgx": "https://z3.ax1x.com/2021/05/30/2VGyU1.png",
        "/oy": "https://z3.ax1x.com/2021/05/30/2VJ4zT.png",
        "/whl": "https://z3.ax1x.com/2021/05/30/2VJHeJ.png",
        "/tt": "https://z3.ax1x.com/2021/05/30/2VJIQU.png",
        "/banzz": "https://z3.ax1x.com/2021/05/30/2VJMPx.png",
        "/mdfq": "https://z3.ax1x.com/2021/05/30/2VJQG6.png",
        "/cs": "https://z3.ax1x.com/2021/05/30/2VJWiq.png",
        "/wul": "https://z3.ax1x.com/2021/05/30/2VJfJ0.png",
        "/lyj": "https://z3.ax1x.com/2021/05/30/2VJhWV.png",
        "/emm": "https://z3.ax1x.com/2021/05/30/2VJjW6.png",
        "/nkt": "https://z3.ax1x.com/2021/05/30/2VJrQS.png",
        "/cg": "https://z3.ax1x.com/2021/05/30/2VJxSK.png",
        "/zy": "https://z3.ax1x.com/2021/05/30/2VNIQf.png",
        "/nzqk": "https://z3.ax1x.com/2021/05/30/2VNQGq.png",
        "/qdqd": "https://z3.ax1x.com/2021/05/30/2VNTOS.png",
        "/bx": "https://z3.ax1x.com/2021/05/30/2VNbwQ.png",
        "/psj": "https://z3.ax1x.com/2021/05/30/2VNjWq.png",
        "/nqct": "https://z3.ax1x.com/2021/05/30/2VNlR0.png",
        "/na": "https://z3.ax1x.com/2021/05/30/2VNqoj.png",
        "/mjl": "https://z3.ax1x.com/2021/05/30/2VNuIs.png",
        "/hs": "https://z3.ax1x.com/2021/05/30/2VNzlV.png",
        "/wosl": "https://z3.ax1x.com/2021/05/30/2VUSyT.png",
        "/ybyb": "https://z3.ax1x.com/2021/05/30/2VUvAH.png",
        "/jl": "https://z3.ax1x.com/2021/05/30/2VY5tI.png",
        "/wyx": "https://z3.ax1x.com/2021/05/30/2VY8f0.png",
        "/ww": "https://z3.ax1x.com/2021/05/30/2VYiTA.png",
        "/hhd": "https://z3.ax1x.com/2021/05/30/2VYpOe.png",
        "/kx": "https://z3.ax1x.com/2021/05/30/2VYvAs.png",
        "/my": "https://z3.ax1x.com/2021/05/30/2VtGEd.png",
        "/cb": "https://z3.ax1x.com/2021/05/30/2Vtagf.png",
        "/mwbq": "https://z3.ax1x.com/2021/05/30/2Vtu36.png",
        "/gun": "https://z3.ax1x.com/2021/05/30/2VtyUs.png",
        "/maj-1!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-1.png",
        "/maj-10!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-10.png",
        "/maj-11!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-11.png",
        "/maj-12!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-12.png",
        "/maj-13!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-13.png",
        "/maj-14!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-14.png",
        "/maj-15!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-15.png",
        "/maj-16!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-16.png",
        "/maj-17!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-17.png",
        "/maj-18!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-18.png",
        "/maj-19!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-19.png",
        "/maj-2!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-2.png",
        "/maj-20!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-20.png",
        "/maj-21!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-21.png",
        "/maj-22!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-22.png",
        "/maj-23!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-23.png",
        "/maj-24!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-24.png",
        "/maj-25!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-25.png",
        "/maj-26!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-26.png",
        "/maj-27!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-27.png",
        "/maj-28!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-28.png",
        "/maj-29!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-29.png",
        "/maj-3!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-3.png",
        "/maj-30!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-30.png",
        "/maj-31!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-31.png",
        "/maj-32!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-32.png",
        "/maj-33!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-33.png",
        "/maj-34!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-34.png",
        "/maj-35!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-35.png",
        "/maj-36!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-36.png",
        "/maj-37!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-37.png",
        "/maj-38!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-38.png",
        "/maj-39!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-39.png",
        "/maj-4!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-4.png",
        "/maj-40!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-40.png",
        "/maj-41!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-41.png",
        "/maj-42!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-42.png",
        "/maj-43!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-43.png",
        "/maj-44!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-44.png",
        "/maj-45!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-45.png",
        "/maj-46!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-46.png",
        "/maj-47!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-47.png",
        "/maj-48!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-48.png",
        "/maj-49!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-49.png",
        "/maj-5!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-5.png",
        "/maj-50!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-50.png",
        "/maj-51!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-51.png",
        "/maj-52!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-52.png",
        "/maj-53!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-53.png",
        "/maj-54!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-54.png",
        "/maj-55!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-55.png",
        "/maj-56!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-56.png",
        "/maj-57!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-57.png",
        "/maj-58!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-58.png",
        "/maj-59!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-59.png",
        "/maj-6!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-6.png",
        "/maj-60!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-60.png",
        "/maj-61!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-61.png",
        "/maj-62!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-62.png",
        "/maj-63!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-63.png",
        "/maj-64!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-64.png",
        "/maj-65!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-65.png",
        "/maj-66!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-66.png",
        "/maj-67!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-67.png",
        "/maj-68!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-68.png",
        "/maj-69!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-69.png",
        "/maj-7!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-7.png",
        "/maj-70!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-70.png",
        "/maj-71!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-71.png",
        "/maj-72!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-72.png",
        "/maj-73!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-73.png",
        "/maj-74!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-74.png",
        "/maj-75!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-75.png",
        "/maj-76!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-76.png",
        "/maj-77!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-77.png",
        "/maj-78!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-78.png",
        "/maj-79!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-79.png",
        "/maj-8!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-8.png",
        "/maj-80!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-80.png",
        "/maj-81!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-81.png",
        "/maj-82!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-82.png",
        "/maj-83!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-83.png",
        "/maj-84!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-84.png",
        "/maj-85!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-85.png",
        "/maj-86!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-86.png",
        "/maj-87!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-87.png",
        "/maj-88!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-88.png",
        "/maj-89!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-89.png",
        "/maj-9!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-9.png",
        "/maj-90!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-90.png",
        "/maj-91!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-91.png",
        "/maj-92!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-92.png",
        "/maj-93!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-93.png",
        "/maj-94!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-94.png",
        "/maj-95!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-95.png",
        "/maj-96!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-96.png",
        "/maj-97!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-97.png",
        "/maj-98!": "https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-98.png"
    };

    // 要搜索的 class 列表
    const searchClasses = ['message', 'am-comment-bd', 'content'];

    // 替换 QQ 表情
    function replaceQQEmojis(element) {
        if (!element) return;

        // 创建遍历器
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(node) {
                // 只搜索指定 class 的节点
                if (node.classList && searchClasses.some(className => node.classList.contains(className))) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        }, false);

        let node;
        while (node = walker.nextNode()) {
            // 排除包含 "https://" 或 "http://" 的文本
            if (!node.innerHTML.includes('https://') && !node.innerHTML.includes('http://')) {
                // 遍历表情列表
                Object.keys(emojiMap).forEach(key => {
                    const regex = new RegExp(key, 'g');
                    node.innerHTML = node.innerHTML.replace(regex, `<img src="${emojiMap[key]}" alt="${key}">`);
                });
            }
        }
    }

    // 初始页面替换
    replaceQQEmojis(document.body);

    // 监听 DOM 变化，实时替换表情
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceQQEmojis(node);
                    }
                });
            }
        });
    });

    // 开始观察 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });
})();