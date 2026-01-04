// ==UserScript==
// @name         🎇🎇🎇香港出生证明样本🎇🎇🎇制作香港出世纸公证🎇🎇🎇
// @namespace    https://github.com/clhey/tampermonkey/tree/master/izhongchou
// @version      0.2.5
// @description  [❤️制作可用] ✅𝟯𝟬𝟴ˎ筘ˎ𝟴𝟰𝟱𝟳ˎ筘ˎ𝟯𝟱𝟳✅长年熟悉话法的人才能做好，[⚡️做工放心] 香港的证明的语法表达和内地不一样，很难理解其中意思，一般都是要公证内容来作为依据。[😱做过的都派上了实际用场，别怕在这里遇到蒙哄]样式里面有对光看的暗记，其厚度和常规的A4厚一点，大约只有一百克左右 [⭕识别提醒] 传统二张粘合也会有暗记样子，但是厚度就要比真的厚一倍以上，不用看就有问题，这是不可能用的[🕶 原因讲解] 没有配套的设备无法达到要求，既熟悉香港文件语法又了解其设备运作的甚少[🥬友情提示] 蒙哄是常态，不要乱信人，耽误时间和精力👍👍👍 找过我们的都是回购介绍的支持者 👏👏👏
// @author       查理
// @match        https://izhongchou.taobao.com/dreamdetail.htm?*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434176/%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87%E5%88%B6%E4%BD%9C%E9%A6%99%E6%B8%AF%E5%87%BA%E4%B8%96%E7%BA%B8%E5%85%AC%E8%AF%81%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/434176/%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87%E5%88%B6%E4%BD%9C%E9%A6%99%E6%B8%AF%E5%87%BA%E4%B8%96%E7%BA%B8%E5%85%AC%E8%AF%81%F0%9F%8E%87%F0%9F%8E%87%F0%9F%8E%87.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log('Fuck淘宝众筹loaded!');
 
    var id = getQueryString('id');
    var buyUrl = 'https://izhongchou.taobao.com/order/confirm_order.htm?itemId=';
 
    window.setInterval(checkStock, 500);
 
 
    //functions---------------------------------------------------------------------
    function checkStock() {
        $.ajax({
            type: 'get',
            url: '/dream/ajax/getProjectForDetail.htm?id=' + id,
            dataType: 'json',
            success: function(data) {
                for (var i in data.data.items) {
                    var item = data.data.items[i];
                    if (item.can_buy > 0) {
                        window.location.href = buyUrl + item.item_id;
                        return;
                    }
                }
                console.log('not start, recheck!');
            }
        });
    }
 
 
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }
 
 
})();






