// ==UserScript==
// @name       XJTU-WebVPN
// @namespace   XJTU-WebVPN
// @license MIT
// @description    连接西安交通大学的WebVPN
// @match     *://kns.cnki.net/*
// @match     *://cn.gtadata.com/*
// @match     *://www.lib.xjtu.edu.cn/*
// @match     *://stat.lib.xjtu.edu.cn/*
// @match     *://jiaocai.lib.xjtu.edu.cn/*
// @match     *://space.lib.xjtu.edu.cn/*
// @match     *://eprint.lib.xjtu.edu.cn/*
// @match     *://oc.xjtu.edu.cn/*
// @match     *://ms.xjtu.edu.cn/*
// @match     *://pts.xjtu.edu.cn/*
// @match     *://www.cnki.net/*
// @match     *://innopac.lib.xjtu.edu.cn/*
// @match     *://www.tandfonline.com/*
// @match     *://www.sciencedirect.com/*
// @match     *://insights.ceicdata.com/*
// @match     *://docdown.cnki.net/*
// @match     *://chn.oversea.cnki.net/*
// @version     1.0
// @author     LyuFG
// @grant       none
// @icon        https://gitee.com/LyuFG1999/xjtu-webvpn/raw/master/xiaobiao.ico

// @downloadURL https://update.greasyfork.org/scripts/459440/XJTU-WebVPN.user.js
// @updateURL https://update.greasyfork.org/scripts/459440/XJTU-WebVPN.meta.js
// ==/UserScript==
//停止加载页面
window.stop()
//配置
var sum = 16 //总数
var a1=['kns.cnki.net','fbf952d2243e635930068cb8']
var a2=['cn.gtadata.com','f3f90f9b33316c516a09c7af9758']
var a3=['www.lib.xjtu.edu.cn','e7e056d22b396a1e66029db9d6502720b439c3']
var a4=['stat.lib.xjtu.edu.cn','e3e34088693c6152301083b88d1b2631e9cd6fc8']
var a5=['jiaocai.lib.xjtu.edu.cn','fafe40932431611e72018be2805f3720598531843c7f7f']
var a6=['space.lib.xjtu.edu.cn','f5e753952924265c770ac7b49241367bdeddf48cea5a']
var a7=['oc.xjtu.edu.cn','fff40f842d247d1e7b0c9ce29b5b']
var a8=['ms.xjtu.edu.cn','fde40f842d247d1e7b0c9ce29b5b']
var a9=['pts.xjtu.edu.cn','e0e352d23f3a7c45300d8db9d6562d']
var a10=['www.cnki.net','e7e056d2243e635930068cb8']
var a11=['innopac.lib.xjtu.edu.cn','f9f94f9337316b1e72018be2805f372054d5c12423ad05']
var a12=['www.tandfonline.com','e7e056d233316654780787a0915b267b559aba']
var a13=['www.sciencedirect.com','e7e056d234336155700b8ca891472636a6d29e640e']
var a14=['insights.ceicdata.com','f9f9529520387c43300b8ca59b512221f0d6a6f06d']
var a15=['docdown.cnki.net','f4f842982827661e7d0682a5d65b2621']
var a16=['chn.oversea.cnki.net','f3ff4fd228266d426d0d88e29b5b283c13d3673f']

//http和https
if(['https://'].indexOf(location.host) == 0){var st = 'webvpn.xjtu.edu.cn/https/77726476706e69737468656265737421'}
else{var st = 'webvpn.xjtu.edu.cn/http/77726476706e69737468656265737421'}

//函数
function run(v,st)
{if([v[0]].indexOf(location.host) == 0){location.replace(location.href.replace(v[0], st+v[1]))}}

//运行
for (var i=1; i<=sum; i++)
{var s = i.toString(); run(eval('a'+s),st);}






