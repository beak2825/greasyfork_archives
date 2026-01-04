// ==UserScript==
// @name         LuoguEmojiSender
// @namespace    https://github.com/Maxmilite/LuoguEmojiSender
// @version      1.4.4
// @description  一款可以帮助您在洛谷轻松发送 QQ 表情信息的插件.
// @author       Maxmilite
// @match        https://www.luogu.com.cn/*
// @match        http://www.luogu.com.cn/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426868/LuoguEmojiSender.user.js
// @updateURL https://update.greasyfork.org/scripts/426868/LuoguEmojiSender.meta.js
// ==/UserScript==

(function () {
    // 这是第一代 LuoguEmojiSender 的最终版本，内容已经相当完善，此后作者将会着力于第二代的开发，第一代基本不会更新。
    // 最后更新时间 2021.6.14
    // 最后版本 1.4.4
    // 第二代目标：实现图形化，近似于 QQ 发送表情
    // 作者在这个版本留下了一个臭了的彩蛋

    // 1.1 更新内容：
    // 优化操作逻辑，增加用户配置区
    // 1.2 更新内容：
    // 增加了更多的 QQ 图片，更改了图床
    // 1.3 更新内容：
    // 进一步优化操作逻辑，修复了图片加载的一个BUG，现在可以无忧无虑使用无缝模式了
    // 1.3.1 更新内容：
    // 紧急修复一个由菜刀表情引发的严重BUG
    // 1.4 更新内容：
    // 修复了 1.3.1 版本更新日志版本号的bug，修复输入问题，第一代最终版本
    // 修复光标漂移问题，修复无缝衔接问题，修复菜刀表情问题，修复若干问题
    // 1.4.1 更新内容：
    // 更换表情源，增加 “替换表情” 按钮，具体详见说明文档
    // 1.4.2 更新内容：
    // 修复一个无缝模式的 bug，添加了部分表情
    // 1.4.3 更新内容：
    // 增加了一个开关自动替换按钮，现在您可以自行决定是否自动替换文中内容了，修复了一个bug，更新了雀魂表情库
    // 1.4.4 更新内容：
    // 增加设置菜单，现在允许对插件进行有关设置了，所有设置将会保存在本地，不会因为版本更新而丢失；增加快速查询表情按钮

    var functionIsOn = true, seamlessMode = false, queryIsOn = true;

    var prefix = "{", suffix = "}";

    var userElement = {
        "样例1": "XXX1.com",
        "样例2": "XXX2.com",
        "样例3": "XXX3.com",
        "样例4": "XXX4.com"
    };

    const replaceElement = {
        "/ybyb": "![qq_emoji: ybyb](https://z3.ax1x.com/2021/05/30/2VUvAH.png)",
        "/wosl": "![qq_emoji: wosl](https://z3.ax1x.com/2021/05/30/2VUSyT.png)",
        "/hs": "![qq_emoji: hs](https://z3.ax1x.com/2021/05/30/2VNzlV.png)",
        "/psj": "![qq_emoji: psj](https://z3.ax1x.com/2021/05/30/2VNjWq.png)",
        "/na": "![qq_emoji: na](https://z3.ax1x.com/2021/05/30/2VNqoj.png)",
        "/bx": "![qq_emoji: bx](https://z3.ax1x.com/2021/05/30/2VNbwQ.png)",
        "/qdqd": "![qq_emoji: qdqd](https://z3.ax1x.com/2021/05/30/2VNTOS.png)",
        "/zy": "![qq_emoji: zy](https://z3.ax1x.com/2021/05/30/2VNIQf.png)",
        "/nqct": "![qq_emoji: nqct](https://z3.ax1x.com/2021/05/30/2VNlR0.png)",
        "/nzqk": "![qq_emoji: nzqk](https://z3.ax1x.com/2021/05/30/2VNQGq.png)",
        "/mjl": "![qq_emoji: mjl](https://z3.ax1x.com/2021/05/30/2VNuIs.png)",
        "/gun": "![qq_emoji: gun](https://z3.ax1x.com/2021/05/30/2VtyUs.png)",
        "/cb": "![qq_emoji: cb](https://z3.ax1x.com/2021/05/30/2Vtagf.png)",
        "/my": "![qq_emoji: my](https://z3.ax1x.com/2021/05/30/2VtGEd.png)",
        "/mwbq": "![qq_emoji: mwbq](https://z3.ax1x.com/2021/05/30/2Vtu36.png)",
        "/kx": "![qq_emoji: kx](https://z3.ax1x.com/2021/05/30/2VYvAs.png)",
        "/jl": "![qq_emoji: jl](https://z3.ax1x.com/2021/05/30/2VY5tI.png)",
        "/wyx": "![qq_emoji: wyx](https://z3.ax1x.com/2021/05/30/2VY8f0.png)",
        "/ww": "![qq_emoji: ww](https://z3.ax1x.com/2021/05/30/2VYiTA.png)",
        "/mdfq": "![qq_emoji: mdfq](https://z3.ax1x.com/2021/05/30/2VJQG6.png)",
        "/banzz": "![qq_emoji: banzz](https://z3.ax1x.com/2021/05/30/2VJMPx.png)",
        "/mgx": "![qq_emoji: mgx](https://z3.ax1x.com/2021/05/30/2VGyU1.png)",
        // ----------------- 以上为 1.4.2 更新内容 -----------------
        "/aini": "![qq_emoji: aini](https://xn--9zr.tk/aini)",
        "/aiq": "![qq_emoji: aiq](https://xn--9zr.tk/aiq)",
        "/am": "![qq_emoji: am](https://xn--9zr.tk/am)",
        "/azgc": "![qq_emoji: azgc](https://z3.ax1x.com/2021/05/30/2VJqoR.png)",
        "/baiy": "![qq_emoji: baiy](https://xn--9zr.tk/baiy)",
        "/bangbangt": "![qq_emoji: bangbangt](https://xn--9zr.tk/bangbangt)",
        "/baojin": "![qq_emoji: baojin](https://xn--9zr.tk/baojin)",
        "/bb": "![qq_emoji: bb](https://xn--9zr.tk/bb)",
        "/bkx": "![qq_emoji: bkx](https://xn--9zr.tk/bkx)",
        "/bl": "![qq_emoji: bl](https://xn--9zr.tk/bl)",
        "/bobo": "![qq_emoji: bobo](https://xn--9zr.tk/bobo)",
        "/bp": "![qq_emoji: bp](https://xn--9zr.tk/bp)",
        "/bq": "![qq_emoji: bq](https://xn--9zr.tk/bq)",
        "/bs": "![qq_emoji: bs](https://xn--9zr.tk/bs)",
        "/bt": "![qq_emoji: bt](https://xn--9zr.tk/bt)",
        "/bu": "![qq_emoji: bu](https://xn--9zr.tk/bu)",
        "/bz": "![qq_emoji: bz](https://xn--9zr.tk/bz)",
        // "/cd": "![qq_emoji: cd](https://xn--9zr.tk/cd)",
        "/cengyiceng": "![qq_emoji: cengyiceng](https://xn--9zr.tk/cengyiceng)",
        "/cg": "![qq_emoji: cg](https://z3.ax1x.com/2021/05/30/2VJxSK.png)",
        "/ch": "![qq_emoji: ch](https://xn--9zr.tk/ch)",
        "/chi": "![qq_emoji: chi](https://xn--9zr.tk/chi)",
        "/cj": "![qq_emoji: cj](https://xn--9zr.tk/cj)",
        "/cp": "![qq_emoji: cp](https://xn--9zr.tk/cp)",
        "/cs": "![qq_emoji: cs](https://z3.ax1x.com/2021/05/30/2VJWiq.png)",
        "/cy": "![qq_emoji: cy](https://xn--9zr.tk/cy)",
        "/dan": "![qq_emoji: dan](https://xn--9zr.tk/dan)",
        "/dao": "![qq_emoji: dao](https://xn--9zr.tk/dao)",
        "/db": "![qq_emoji: db](https://xn--9zr.tk/db)",
        "/dg": "![qq_emoji: dg](https://xn--9zr.tk/dg)",
        "/dgg": "![qq_emoji: dgg](https://xn--9zr.tk/dgg)",
        "/dk": "![qq_emoji: dk](https://xn--9zr.tk/dk)",
        "/dl": "![qq_emoji: dl](https://xn--9zr.tk/dl)",
        "/doge": "![qq_emoji: doge](https://xn--9zr.tk/doge)",
        "/dx": "![qq_emoji: dx](https://xn--9zr.tk/dx)",
        "/dy": "![qq_emoji: dy](https://xn--9zr.tk/dy)",
        "/dz": "![qq_emoji: dz](https://xn--9zr.tk/dz)",
        "/ee": "![qq_emoji: ee](https://xn--9zr.tk/ee)",
        "/emm": "![qq_emoji: emm](https://z3.ax1x.com/2021/05/30/2VJjW6.png)",
        "/fad": "![qq_emoji: fad](https://xn--9zr.tk/fad)",
        "/fade": "![qq_emoji: fade](https://xn--9zr.tk/fade)",
        "/fan": "![qq_emoji: fan](https://xn--9zr.tk/fan)",
        "/fd": "![qq_emoji: fd](https://xn--9zr.tk/fd)",
        "/fendou": "![qq_emoji: fendou](https://xn--9zr.tk/fendou)",
        "/fj": "![qq_emoji: fj](https://xn--9zr.tk/fj)",
        "/fn": "![qq_emoji: fn](https://xn--9zr.tk/fn)",
        "/fw": "![qq_emoji: fw](https://xn--9zr.tk/fw)",
        "/gg": "![qq_emoji: gg](https://xn--9zr.tk/gg)",
        "/gy": "![qq_emoji: gy](https://xn--9zr.tk/gy)",
        "/gz": "![qq_emoji: gz](https://xn--9zr.tk/gz)",
        "/hanx": "![qq_emoji: hanx](https://xn--9zr.tk/hanx)",
        "/haob": "![qq_emoji: haob](https://xn--9zr.tk/haob)",
        "/hb": "![qq_emoji: hb](https://xn--9zr.tk/hb)",
        "/hc": "![qq_emoji: hc](https://xn--9zr.tk/hc)",
        "/hd": "![qq_emoji: hd](https://xn--9zr.tk/hd)",
        "/hec": "![qq_emoji: hec](https://xn--9zr.tk/hec)",
        "/hhd": "![qq_emoji: hhd](https://z3.ax1x.com/2021/05/30/2VYpOe.png)",
        "/hn": "![qq_emoji: hn](https://xn--9zr.tk/hn)",
        "/hp": "![qq_emoji: hp](https://xn--9zr.tk/hp)",
        "/hq": "![qq_emoji: hq](https://xn--9zr.tk/hq)",
        "/hsh": "![qq_emoji: hsh](https://xn--9zr.tk/hsh)",
        "/ht": "![qq_emoji: ht](https://xn--9zr.tk/ht)",
        "/huaix": "![qq_emoji: huaix](https://xn--9zr.tk/huaix)",
        "/hx": "![qq_emoji: hx](https://xn--9zr.tk/hx)",
        "/jd": "![qq_emoji: jd](https://xn--9zr.tk/jd)",
        "/jh": "![qq_emoji: jh](https://xn--9zr.tk/jh)",
        "/jiaybb": "![qq_emoji: jiaybb](https://xn--9zr.tk/jiaybb)",
        "/jiaybs": "![qq_emoji: jiaybs](https://xn--9zr.tk/jiaybs)",
        "/jie": "![qq_emoji: jie](https://xn--9zr.tk/jie)",
        "/jk": "![qq_emoji: jk](https://xn--9zr.tk/jk)",
        "/jw": "![qq_emoji: jw](https://xn--9zr.tk/jw)",
        "/jx": "![qq_emoji: jx](https://xn--9zr.tk/jx)",
        "/jy": "![qq_emoji: jy](https://xn--9zr.tk/jy)",
        "/ka": "![qq_emoji: ka](https://xn--9zr.tk/ka)",
        "/kb": "![qq_emoji: kb](https://xn--9zr.tk/kb)",
        "/kel": "![qq_emoji: kel](https://xn--9zr.tk/kel)",
        "/kf": "![qq_emoji: kf](https://xn--9zr.tk/kf)",
        "/kg": "![qq_emoji: kg](https://xn--9zr.tk/kg)",
        "/kk": "![qq_emoji: kk](https://xn--9zr.tk/kk)",
        "/kl": "![qq_emoji: kl](https://xn--9zr.tk/kl)",
        "/kt": "![qq_emoji: kt](https://xn--9zr.tk/kt)",
        "/kuk": "![qq_emoji: kuk](https://xn--9zr.tk/kuk)",
        "/kun": "![qq_emoji: kun](https://xn--9zr.tk/kun)",
        "/kzht": "![qq_emoji: kzht](https://xn--9zr.tk/kzht)",
        "/lb": "![qq_emoji: lb](https://xn--9zr.tk/lb)",
        "/lengh": "![qq_emoji: lengh](https://xn--9zr.tk/lengh)",
        "/lh": "![qq_emoji: lh](https://xn--9zr.tk/lh)",
        "/ll": "![qq_emoji: ll](https://xn--9zr.tk/ll)",
        "/lm": "![qq_emoji: lm](https://xn--9zr.tk/lm)",
        "/lq": "![qq_emoji: lq](https://xn--9zr.tk/lq)",
        "/lw": "![qq_emoji: lw](https://xn--9zr.tk/lw)",
        "/lyj": "![qq_emoji: lyj](https://z3.ax1x.com/2021/05/30/2VJhWV.png)",
        "/meigui": "![qq_emoji: meigui](https://xn--9zr.tk/mg)",
        "/mm": "![qq_emoji: mm](https://xn--9zr.tk/mm)",
        "/ng": "![qq_emoji: ng](https://xn--9zr.tk/ng)",
        "/nkt": "![qq_emoji: nkt](https://z3.ax1x.com/2021/05/30/2VJrQS.png)",
        "/oh": "![qq_emoji: oh](https://xn--9zr.tk/oh)",
        "/oy": "![qq_emoji: oy](https://z3.ax1x.com/2021/05/30/2VJ4zT.png)",
        "/pch": "![qq_emoji: pch](https://xn--9zr.tk/pch)",
        "/pj": "![qq_emoji: pj](https://xn--9zr.tk/pj)",
        "/pp": "![qq_emoji: pp](https://xn--9zr.tk/pp)",
        "/pt": "![qq_emoji: pt](https://xn--9zr.tk/pt)",
        "/px": "![qq_emoji: px](https://xn--9zr.tk/px)",
        "/qd": "![qq_emoji: qd](https://xn--9zr.tk/qd)",
        "/qiang": "![qq_emoji: qiang](https://xn--9zr.tk/qiang)",
        "/qiao": "![qq_emoji: qiao](https://xn--9zr.tk/qiao)",
        "/qq": "![qq_emoji: qq](https://xn--9zr.tk/qq)",
        "/qt": "![qq_emoji: qt](https://xn--9zr.tk/qt)",
        "/ruo": "![qq_emoji: ruo](https://xn--9zr.tk/ruo)",
        "/sa": "![qq_emoji: sa](https://xn--9zr.tk/sa)",
        "/se": "![qq_emoji: se](https://xn--9zr.tk/se)",
        "/sh": "![qq_emoji: sh](https://xn--9zr.tk/sh)",
        "/shd": "![qq_emoji: shd](https://xn--9zr.tk/shd)",
        "/shl": "![qq_emoji: shl](https://xn--9zr.tk/shl)",
        "/shuai": "![qq_emoji: shuai](https://xn--9zr.tk/shuai)",
        "/shui": "![qq_emoji: shui](https://xn--9zr.tk/shui)",
        "/shxi": "![qq_emoji: shxi](https://xn--9zr.tk/shxi)",
        "/sr": "![qq_emoji: sr](https://xn--9zr.tk/sr)",
        "/tiao": "![qq_emoji: tiao](https://xn--9zr.tk/tiao)",
        "/tl": "![qq_emoji: tl](https://xn--9zr.tk/tl)",
        "/tnl": "![qq_emoji: tnl](https://xn--9zr.tk/tnl)",
        "/tp": "![qq_emoji: tp](https://xn--9zr.tk/tp)",
        "/ts": "![qq_emoji: ts](https://xn--9zr.tk/ts)",
        "/tsh": "![qq_emoji: tsh](https://xn--9zr.tk/tsh)",
        "/tt": "![qq_emoji: tt](https://z3.ax1x.com/2021/05/30/2VJIQU.png)",
        "/tuu": "![qq_emoji: tuu](https://xn--9zr.tk/tuu)",
        "/tx": "![qq_emoji: tx](https://xn--9zr.tk/tx)",
        "/taiyang": "![qq_emoji: ty](https://xn--9zr.tk/ty)",
        "/tyt": "![qq_emoji: tyt](https://xn--9zr.tk/tyt)",
        "/wbk": "![qq_emoji: wbk](https://xn--9zr.tk/wbk)",
        "/whl": "![qq_emoji: whl](https://z3.ax1x.com/2021/05/30/2VJHeJ.png)",
        "/wl": "![qq_emoji: wl](https://xn--9zr.tk/wl)",
        "/wn": "![qq_emoji: wn](https://xn--9zr.tk/wn)",
        "/wq": "![qq_emoji: wq](https://xn--9zr.tk/wq)",
        "/ws": "![qq_emoji: ws](https://xn--9zr.tk/ws)",
        "/wul": "![qq_emoji: wul](https://z3.ax1x.com/2021/05/30/2VJfJ0.png)",
        "/wx": "![qq_emoji: wx](https://xn--9zr.tk/wx)",
        "/wzm": "![qq_emoji: wzm](https://xn--9zr.tk/wzm)",
        "/xhx": "![qq_emoji: xhx](https://xn--9zr.tk/xhx)",
        "/xia": "![qq_emoji: xia](https://xn--9zr.tk/xia)",
        "/xig": "![qq_emoji: xig](https://xn--9zr.tk/xig)",
        "/xin": "![qq_emoji: xin](https://xn--9zr.tk/xin)",
        "/xjj": "![qq_emoji: xjj](https://xn--9zr.tk/xjj)",
        "/xk": "![qq_emoji: xk](https://xn--9zr.tk/xk)",
        "/xs": "![qq_emoji: xs](https://xn--9zr.tk/xs)",
        "/xu": "![qq_emoji: xu](https://xn--9zr.tk/xu)",
        "/xw": "![qq_emoji: xw](https://xn--9zr.tk/xw)",
        "/xy": "![qq_emoji: xy](https://xn--9zr.tk/xy)",
        "/xyx": "![qq_emoji: xyx](https://xn--9zr.tk/xyx)",
        "/yao": "![qq_emoji: yao](https://xn--9zr.tk/yao)",
        "/yb": "![qq_emoji: yb](https://xn--9zr.tk/yb)",
        "/yhh": "![qq_emoji: yhh](https://xn--9zr.tk/yhh)",
        "/yiw": "![qq_emoji: yiw](https://xn--9zr.tk/yiw)",
        "/yl": "![qq_emoji: yl](https://xn--9zr.tk/yl)",
        "/youl": "![qq_emoji: youl](https://xn--9zr.tk/youl)",
        "/youtj": "![qq_emoji: youtj](https://xn--9zr.tk/youtj)",
        "/yt": "![qq_emoji: yt](https://xn--9zr.tk/yt)",
        "/yun": "![qq_emoji: yun](https://xn--9zr.tk/yun)",
        "/yx": "![qq_emoji: yx](https://xn--9zr.tk/yx)",
        "/zhd": "![qq_emoji: zhd](https://xn--9zr.tk/zhd)",
        "/zhem": "![qq_emoji: zhem](https://xn--9zr.tk/zhem)",
        "/zhh": "![qq_emoji: zhh](https://xn--9zr.tk/zhh)",
        "/zhm": "![qq_emoji: zhm](https://xn--9zr.tk/zhm)",
        "/zhq": "![qq_emoji: zhq](https://xn--9zr.tk/zhq)",
        "/zj": "![qq_emoji: zj](https://xn--9zr.tk/zj)",
        "/zk": "![qq_emoji: zk](https://xn--9zr.tk/zk)",
        "/zq": "![qq_emoji: zq](https://xn--9zr.tk/zq)",
        "/zt": "![qq_emoji: zt](https://xn--9zr.tk/zt)",
        "/zuotj": "![qq_emoji: zuotj](https://xn--9zr.tk/zuotj)",
        "/114514": "[![为什么您会找到一个在 QQ 表情里没有的东西](https://z3.ax1x.com/2021/05/30/2Eook9.png)](https://github.com/Maxmilite/LuoguEmojiSender)",
        "/maj-1!": "![majsoul: 1](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-1.png)",
        "/maj-2!": "![majsoul: 2](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-2.png)",
        "/maj-3!": "![majsoul: 3](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-3.png)",
        "/maj-4!": "![majsoul: 4](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-4.png)",
        "/maj-5!": "![majsoul: 5](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-5.png)",
        "/maj-6!": "![majsoul: 6](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-6.png)",
        "/maj-7!": "![majsoul: 7](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-7.png)",
        "/maj-8!": "![majsoul: 8](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-8.png)",
        "/maj-9!": "![majsoul: 9](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-9.png)",
        "/maj-10!": "![majsoul: 10](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-10.png)",
        "/maj-11!": "![majsoul: 11](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-11.png)",
        "/maj-12!": "![majsoul: 12](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-12.png)",
        "/maj-13!": "![majsoul: 13](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-13.png)",
        "/maj-14!": "![majsoul: 14](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-14.png)",
        "/maj-15!": "![majsoul: 15](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-15.png)",
        "/maj-16!": "![majsoul: 16](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-16.png)",
        "/maj-17!": "![majsoul: 17](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-17.png)",
        "/maj-18!": "![majsoul: 18](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-18.png)",
        "/maj-19!": "![majsoul: 19](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-19.png)",
        "/maj-20!": "![majsoul: 20](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-20.png)",
        "/maj-21!": "![majsoul: 21](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-21.png)",
        "/maj-22!": "![majsoul: 22](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-22.png)",
        "/maj-23!": "![majsoul: 23](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-23.png)",
        "/maj-24!": "![majsoul: 24](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-24.png)",
        "/maj-25!": "![majsoul: 25](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-25.png)",
        "/maj-26!": "![majsoul: 26](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-26.png)",
        "/maj-27!": "![majsoul: 27](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-27.png)",
        "/maj-28!": "![majsoul: 28](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-28.png)",
        "/maj-29!": "![majsoul: 29](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-29.png)",
        "/maj-30!": "![majsoul: 30](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-30.png)",
        "/maj-31!": "![majsoul: 31](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-31.png)",
        "/maj-32!": "![majsoul: 32](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-32.png)",
        "/maj-33!": "![majsoul: 33](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-33.png)",
        "/maj-34!": "![majsoul: 34](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-34.png)",
        "/maj-35!": "![majsoul: 35](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-35.png)",
        "/maj-36!": "![majsoul: 36](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-36.png)",
        "/maj-37!": "![majsoul: 37](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-37.png)",
        "/maj-38!": "![majsoul: 38](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-38.png)",
        "/maj-39!": "![majsoul: 39](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-39.png)",
        "/maj-40!": "![majsoul: 40](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-40.png)",
        "/maj-41!": "![majsoul: 41](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-41.png)",
        "/maj-42!": "![majsoul: 42](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-42.png)",
        "/maj-43!": "![majsoul: 43](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-43.png)",
        "/maj-44!": "![majsoul: 44](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-44.png)",
        "/maj-45!": "![majsoul: 45](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-45.png)",
        "/maj-46!": "![majsoul: 46](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-46.png)",
        "/maj-47!": "![majsoul: 47](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-47.png)",
        "/maj-48!": "![majsoul: 48](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-48.png)",
        "/maj-49!": "![majsoul: 49](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-49.png)",
        "/maj-50!": "![majsoul: 50](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-50.png)",
        "/maj-51!": "![majsoul: 51](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-51.png)",
        "/maj-52!": "![majsoul: 52](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-52.png)",
        "/maj-53!": "![majsoul: 53](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-53.png)",
        "/maj-54!": "![majsoul: 54](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-54.png)",
        "/maj-55!": "![majsoul: 55](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-55.png)",
        "/maj-56!": "![majsoul: 56](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-56.png)",
        "/maj-57!": "![majsoul: 57](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-57.png)",
        "/maj-58!": "![majsoul: 58](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-58.png)",
        "/maj-59!": "![majsoul: 59](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-59.png)",
        "/maj-60!": "![majsoul: 60](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-60.png)",
        "/maj-61!": "![majsoul: 61](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-61.png)",
        "/maj-62!": "![majsoul: 62](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-62.png)",
        "/maj-63!": "![majsoul: 63](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-63.png)",
        "/maj-64!": "![majsoul: 64](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-64.png)",
        "/maj-65!": "![majsoul: 65](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-65.png)",
        "/maj-66!": "![majsoul: 66](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-66.png)",
        "/maj-67!": "![majsoul: 67](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-67.png)",
        "/maj-68!": "![majsoul: 68](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-68.png)",
        "/maj-69!": "![majsoul: 69](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-69.png)",
        "/maj-70!": "![majsoul: 70](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-70.png)",
        "/maj-71!": "![majsoul: 71](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-71.png)",
        "/maj-72!": "![majsoul: 72](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-72.png)",
        "/maj-73!": "![majsoul: 73](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-73.png)",
        "/maj-74!": "![majsoul: 74](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-74.png)",
        "/maj-75!": "![majsoul: 75](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-75.png)",
        "/maj-76!": "![majsoul: 76](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-76.png)",
        "/maj-77!": "![majsoul: 77](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-77.png)",
        "/maj-78!": "![majsoul: 78](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-78.png)",
        "/maj-79!": "![majsoul: 79](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-79.png)",
        "/maj-80!": "![majsoul: 80](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-80.png)",
        "/maj-81!": "![majsoul: 81](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-81.png)",
        "/maj-82!": "![majsoul: 82](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-82.png)",
        "/maj-83!": "![majsoul: 83](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-83.png)",
        "/maj-84!": "![majsoul: 84](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-84.png)",
        "/maj-85!": "![majsoul: 85](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-85.png)",
        "/maj-86!": "![majsoul: 86](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-86.png)",
        "/maj-87!": "![majsoul: 87](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-87.png)",
        "/maj-88!": "![majsoul: 88](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-88.png)",
        "/maj-89!": "![majsoul: 89](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-89.png)",
        "/maj-90!": "![majsoul: 90](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-90.png)",
        "/maj-91!": "![majsoul: 91](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-91.png)",
        "/maj-92!": "![majsoul: 92](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-92.png)",
        "/maj-93!": "![majsoul: 93](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-93.png)",
        "/maj-94!": "![majsoul: 94](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-94.png)",
        "/maj-95!": "![majsoul: 95](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-95.png)",
        "/maj-96!": "![majsoul: 96](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-96.png)",
        "/maj-97!": "![majsoul: 97](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-97.png)",
        "/maj-98!": "![majsoul: 98](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-98.png)"
    };

    const $ = unsafeWindow.$ || jQuery, markdownPalettes = unsafeWindow.markdownPalettes;

    function ShowTip(tip, type) {
        var $tip = $('#tip');
        if ($tip.length == 0) {
            $tip = $('<span id="tip" style="position:fixed; top:50px; left: 50%; z-index:9999; height: 35px; padding: 0 20px; line-height: 35px; background-color: white; border: 5px; opacity: 75%"></span>');
            $('body').append($tip);
        }
        $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(250).delay(500).fadeOut(250);
    }

    function ShowMsg(msg) {
        ShowTip(msg, 'info');
    }

    function ShowSuccess(msg) {
        ShowTip(msg, 'success');
    }

    function ShowFailure(msg) {
        ShowTip(msg, 'danger');
    }

    function ShowWarn(msg, $focus, clear) {
        ShowTip(msg, 'warning');
        if ($focus) {
            $focus.focus();
            if (clear) $focus.val('');
        }
        return false;
    }

    function getSubString(sourceString = "", findPos = -1) {
        if (findPos == -1) {
            return "zr.tk";
        }
        if (findPos <= 5) {
            return "";
        }
        let resultString = "";
        for (let i = findPos - 5; i < findPos; i++) {
            resultString += sourceString[i];
        }
        // if (resultString == "tps:/") {
        //     return "9zr.tk";
        // }
        return resultString;
    }

    function sliceString(sourceString = "", leftSide = 0, rightSide = 0) {
        let resultString = ""
        for (let i = leftSide; i <= rightSide; i++) {
            resultString += sourceString[i];
        }
        return resultString;
    }

    function replaceString(stringToChange = "") {
        let isChanged = false;
        for (let i in replaceElement) {
            let changedStr = prefix + i + suffix;
            while (getSubString(stringToChange, stringToChange.lastIndexOf(changedStr)) != "zr.tk" && getSubString(stringToChange, stringToChange.lastIndexOf(changedStr)) != "jsoul") {
                // console.log(getSubString(stringToChange, stringToChange.lastIndexOf(changedStr)))
                isChanged = true;
                // stringToChange = stringToChange.replace(changedStr, replaceElement[i]);
                stringToChange = sliceString(stringToChange, 0, stringToChange.lastIndexOf(changedStr) - 1) + replaceElement[i] + sliceString(stringToChange, stringToChange.lastIndexOf(changedStr) + changedStr.length, stringToChange.length - 1);
            }
        }
        for (let i in userElement) {
            let changedStr = prefix + i + suffix;
            while (getSubString(stringToChange, stringToChange.lastIndexOf(changedStr)) != "zr.tk" && getSubString(stringToChange, stringToChange.lastIndexOf(changedStr)) != "jsoul") {
                isChanged = true;
                // stringToChange = stringToChange.replace(changedStr, userElement[i]);
                stringToChange = sliceString(stringToChange, 0, stringToChange.lastIndexOf(changedStr) - 1) + userElement[i] + sliceString(stringToChange, stringToChange.lastIndexOf(changedStr) + changedStr.length, stringToChange.length - 1);
            }
        }
        if (isChanged == true) {
            return stringToChange;
        }
        else {
            return undefined;
        }
    }

    function main() {
        if (functionIsOn == false) {
            return;
        }
        if (typeof markdownPalettes != "undefined") {
            let changedStr = replaceString($(".CodeMirror-wrap textarea").val());
            if (changedStr != undefined) {
                $(".CodeMirror-wrap textarea").val(changedStr);
                $(".CodeMirror-wrap textarea").trigger("input");
            }
        }
        if (document.getElementById("feed-content") != null) {
            let changedStr = replaceString(document.getElementById("feed-content").value);
            if (changedStr != undefined) {
                document.getElementById("feed-content").value = changedStr;
            }
        }
    }

    function replaceAll() {
        if (replaceString(markdownPalettes.content) != undefined) {
            markdownPalettes.content = replaceString(markdownPalettes.content);
            ShowSuccess("文中所有表情已手动替换");
            return;
        }
        else {
            return;
        }
    }

    function writeConfig() {
        lsSet("LuoguEmojiSenderPrefix", prefix);
        lsSet("LuoguEmojiSenderSuffix", suffix);
        lsSet("LuoguEmojiSenderIsOn", JSON.stringify(functionIsOn));
        lsSet("LuoguEmojiSenderIsSeamless", JSON.stringify(seamlessMode));
        lsSet("LuoguEmojiSenderQueryIsOn", JSON.stringify(queryIsOn));
        lsSet("LuoguEmojiSenderUserElements", JSON.stringify(userElement, null, 4));
    }

    function readConfig() {
        prefix = lsGet("LuoguEmojiSenderPrefix");
        suffix = lsGet("LuoguEmojiSenderSuffix");
        functionIsOn = JSON.parse(lsGet("LuoguEmojiSenderIsOn"));
        seamlessMode = JSON.parse(lsGet("LuoguEmojiSenderIsSeamless"));
        queryIsOn = JSON.parse(lsGet("LuoguEmojiSenderQueryIsOn"));
        if (seamlessMode == true) {
            prefix = "", suffix = "";
        }
        userElement = JSON.parse(lsGet("LuoguEmojiSenderUserElements"));
    }

    function lsGet(x = "") {
        return unsafeWindow.localStorage.getItem(x);
    }

    function lsSet(x = "", content = "") {
        unsafeWindow.localStorage.setItem(x, content);
    }

    var setting = new Object;

    setting.openSetting = function () {
        $("#lesSettingDiv").slideToggle();
        if (seamlessMode == true) {
            document.getElementsByName("seamless")[0].click();
        }
        else {
            document.getElementsByName("seamless")[1].click();
        }
        if (queryIsOn == true) {
            document.getElementsByName("query")[0].click();
        }
        else {
            document.getElementsByName("query")[1].click();
        }
    }

    setting.cancelSetting = function () {
        if (confirm("当前设置未保存，确认取消？") == true) {
            location.reload();
        }
    }

    setting.saveSetting = function () {
        if (confirm("确认保存当前设置？") == true) {
            seamlessMode = $("[name='seamless']")[0].checked;
            userElement = JSON.parse($("#userElementBox")[0].value);
            prefix = $("[name='prefix']")[0].value;
            suffix = $("[name='suffix']")[0].value;
            queryIsOn = $("[name='query']")[0].checked;
            writeConfig();
            alert("保存成功");
            location.reload();
        }
    }

    function init() {

        $(`<li data-v-6d5597b1 id="replaceEmoji">
                <a data-v-6d5597b1="" title="手动替换表情" unselectable="on">
                    <img style="margin: 2px 0; padding: 0; inline-size: 22px; align-items: center; justify-content: center" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/grinning-face-with-sweat_1f605.png">
                </a>
            </li>`).appendTo($(".mp-editor-menu"));
        $("#replaceEmoji").on("click", function () {
            replaceAll();
        });

        if (localStorage.getItem("LuoguEmojiSender") == null) {
            localStorage.setItem("LuoguEmojiSender", "哇这里竟然有彩蛋");
            writeConfig();
            ShowSuccess("自动发表情插件初始化完毕");
        }
        else {
            readConfig();
        }

        if (functionIsOn == true) {
            addOnButton();
        }
        else {
            addOffButton();
        }

        document.addEventListener("input", function () {
            main();
        })

        if (document.getElementById("feed-content") != null) {
            $(` <p>
                <strong>插件设置</strong><br>
                <a id="LuoguEmojiSenderSetting" target="_blank">LuoguEmojiSender 设置</a>
                <br>
            </p>`).appendTo($(".am-hide-sm"));
            $("#LuoguEmojiSenderSetting").on("click", function () {
                setting.openSetting();
            });
            $(` 
            <div id="lesSettingDiv" style="display: none">
            <p style="text-align: center; font-weight: bold">LuoguEmojiSender 设置</p>
            <hr>
            <form name="lesSetting">
                <strong>
                    无缝模式：
                </strong>
                <input type="radio" name="seamless" value="enabled" >启用</input>
                <input type="radio" name="seamless" value="disabled" >禁用</input>
                <br>
                自定义前缀: <input type="text" name="prefix" style="width: 100px; text-align: center">
                <br>
                自定义后缀: <input type="text" name="suffix" style="width: 100px; text-align: center">
                <br>
                <strong>
                    查表情按钮：
                </strong>
                <input type="radio" name="query" value="enabled" >启用</input>
                <input type="radio" name="query" value="disabled" >禁用</input>
                <br>
                用户定义表情：<br>
                <textarea style="height: 200px; font-size: 12px; width: 218.59px; padding: 10px" id="userElementBox"></textarea>
                <p style="text-align: center; color: red; user-select:none;" id=resetPlugin>点击重置 LuoguEmojiSender</p>
            </form>
            <br>
            <button id="saveSetting" onclick="setting.saveSetting()" style="color: white; background-color: #dd514c; border: none; width: 80px; height: 32px; font-size: 16px; float: left;">
                保存
            </button>
            <button id="cancelSetting" onclick="setting.cancelSetting()" style="color: white; background-color: #dd514c; border: none; width: 80px; height: 32px; font-size: 16px; float: right;">
                取消
            </button>
            <br>
        </div>
            `).appendTo($(".am-hide-sm"));
            $("#saveSetting").on("click", function () {
                setting.saveSetting();
            });
            $("#cancelSetting").on("click", function () {
                setting.cancelSetting();
            });
            $("#resetPlugin").on("click", function () {
                if (prompt("您确定要重置 LuoguEmojiSender 设置吗？如果确定，请在下面的输入框里输入 “确定” 两个汉字：") == "确定") {
                    localStorage.removeItem("LuoguEmojiSender");
                    alert("重置完成")
                    location.reload();
                }
            });
            $("#userElementBox")[0].value = JSON.stringify(userElement, null, 4);
            $("[name='seamless']").on("click", function () {
                if ($("[name='seamless']")[1].checked == true) {
                    $("[name='prefix']")[0].disabled = false;
                    $("[name='suffix']")[0].disabled = false;
                    $("[name='prefix']")[0].value = prefix;
                    $("[name='suffix']")[0].value = suffix;
                }
                else {
                    $("[name='prefix']")[0].disabled = true;
                    $("[name='suffix']")[0].disabled = true;
                    $("[name='prefix']")[0].value = "";
                    $("[name='suffix']")[0].value = "";
                }
            });
        }

        if ((markdownPalettes != undefined || document.getElementById("feed-content") != null) && queryIsOn == true) {
            $(`
                <div id="queryButton" style="margin: 0; padding: 0; position: fixed; width: 100px; height: 32px; right: 0px; bottom: 50vh; color: black; background: white; opacity: 80%;">
                <a href="https://maxmilite.gitee.io/archive/emoji-library.html" target="_blank"><p style="text-align: center; padding: 4px 0; margin: 0; font-size: 16px; user-select:none; color: black">查看表情</p></a>
                </div>
                <div id="switchQuery" style="margin: 0; padding: 0; position: fixed; width: 20px; height: 32px; right: 100px; bottom: 50vh; color: black; background: white; opacity: 80%;">
                    <p style="text-align: center; padding: 4px 4px; margin: 0;font-size: 16px; user-select:none;" id="switchContent">></p>
                </div>
            `).appendTo($("body")[0]);
            $("#switchQuery").on("click", function () {
                if ($("#queryButton").width() != 0) {
                    $("#queryButton").animate({width: "0px"});
                    $("#switchQuery").animate({right: "0px"});
                    $("#switchContent")[0].innerText = "<";
                }
                else {
                    $("#queryButton").animate({width: "100px"});
                    $("#switchQuery").animate({right: "100px"});
                    $("#switchContent")[0].innerText = ">";
                }
            });
        }
        

        if (markdownPalettes != undefined || document.getElementById("feed-content") != null) {
            ShowSuccess("自动发表情插件已加载完毕");
        }
    }

    function addOffButton() {
        if (document.getElementById("buttonOff") != null) {
            document.getElementById("buttonOff").remove();
            ShowSuccess("自动替换表情功能已关闭");
        }
        $(`<li data-v-6d5597b1 id="buttonOn">
                <a data-v-6d5597b1="" title="开启自动替换" unselectable="on">
                    关
                </ a>
            </li>`).appendTo($(".mp-editor-menu"));
        $("#buttonOn").on("click", function () {
            addOnButton();
        });
        functionIsOn = false;
        writeConfig();
    }

    function addOnButton() {
        if (document.getElementById("buttonOn") != null) {
            document.getElementById("buttonOn").remove();
            ShowSuccess("自动替换表情功能已开启");
        }
        $(`<li data-v-6d5597b1 id="buttonOff">
                <a data-v-6d5597b1="" title="关闭自动替换" unselectable="on">
                    开
                </a>
            </li>`).appendTo($(".mp-editor-menu"));
        $("#buttonOff").on("click", function () {
            addOffButton();
        });
        functionIsOn = true;
        writeConfig();
    }

    // It seemed this function didn't work :(
    // To be fixed
    // Fixed on 2021.5.30

    init();

})();
