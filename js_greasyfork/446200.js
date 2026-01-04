// ==UserScript==
// @name        老王论坛屏蔽绿帽,鸡等低质量帖子
// @version 1.3
// @namespace   lolicraft
// @match        *://laowang.vip/forum.php*mod=forumdisplay*
// @match        *://www.cunhua.online/forum*
// @require		 http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       none
// @run-at		 document-end
// @license MIT
// @description 通过关键词和大小筛选,屏蔽老王论坛不需要的一格. 
// @downloadURL https://update.greasyfork.org/scripts/446200/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E7%BB%BF%E5%B8%BD%2C%E9%B8%A1%E7%AD%89%E4%BD%8E%E8%B4%A8%E9%87%8F%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/446200/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E7%BB%BF%E5%B8%BD%2C%E9%B8%A1%E7%AD%89%E4%BD%8E%E8%B4%A8%E9%87%8F%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

// 屏蔽关键词
const reg = RegExp(
    /(唐伯虎|破处|性交|艳照门|寸止|推油|jvid|强上|足交|HongKongDoll|包养|外围女|玩偶姐姐|淑怡|紫萱|抽插|大屌|熟女|大尺度|合成|无套|SM|寻花|Onlyfans|OnlyFans|onlyfans|李寻欢|约炮|性爱|91|内射|伪娘|TS|群P|口爆|强奸|换脸|口交|已失效|后入|性爱|酒店|男友|男朋友|良家|AI换脸|Cos☆|COS☆ぱこ|精液|AV|传媒|颜射|帅哥|情侣|啪啪|换妻|精东|女友|内射|麻豆|91|抖音|快手|不雅|大爷|人妻|双飞|母狗|招嫖|妻|先生|操|直播|下海|黑人|约炮|肛交|啪|大神|主播|调教|斗鱼|群p|炮友|BT|鸡巴|迷奸|土豪|一炮|老婆|绿帽|少妇|种子|中出|探花|技师|国产|磁力|出轨|做爱)/
);

const regex = /\b(\d+(\.\d+)?)\s*[Mm](?:[Bb]?)\b/g;

function isMatch(input) {
  let match;
  while ((match = regex.exec(input)) !== null) {
    const number = parseFloat(match[1]);
     // 屏蔽资源小于300mb的
    if (!isNaN(number) && number < 300) {
      return true;
    }
  }
  return false;
}

function Main() {
    if ($("#wp.wp")[0]) $("#wp.wp")[0].style.width = "100%";
    if ($(".sd.content_right")[0]) $(".sd.content_right")[0].style.display = "none";
    if ($("#ct .mn")[0]) $("#ct .mn")[0].style.width = "100%";
    $("#waterfall")[0].style.display = "flex"
    $("#waterfall")[0].style.flexWrap = "wrap"
    const node = $("#waterfall .xw0")
    //console.log("😎😎😎node", node)
    for (let index = 0; index < node.length; index++) {
        const element = node[index];
        element.style.float = "none"
        const outerText = node[index].outerText;
        const flag = reg.test(outerText)||isMatch(outerText)
        if (flag) {
            console.log('outerText结果===>', outerText)
            element.parentNode.style.display = "none"
        }
    }
}
Main()