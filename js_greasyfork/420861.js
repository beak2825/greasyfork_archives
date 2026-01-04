// ==UserScript==
// @name         淘宝店铺 产品资料上传 清除敏感词
// @namespace    https://www.calendarLi.com
// @version      1.1
// @description  淘宝店铺上传资料时清除产品详情中的敏感词
// @author       CalendarLi
// @match        *://item.upload.taobao.com/*
// @icon         https://upyun.calendarli.com/logo.png
// @require      http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @grant        none
// @copyright    该脚本完全由 CalendarLi@greasyfork 原创，谢绝抄袭部分或全部代码！如有借鉴代码，请声明并标注脚本链接。
// @copyright:en   This script is completely original by CalendarLi@greasyfork, please do not copy part or all of the code! If you have reference code, please declare and mark the script link.
// @copyright:ja   このスクリプトはCalendarLi @ greasyforkによって完全にオリジナルです。コードの一部または全部をコピーしないでください。 参照コードがある場合は、スクリプトリンクを宣言してマークを付けてください。

// @downloadURL https://update.greasyfork.org/scripts/420861/%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%20%E4%BA%A7%E5%93%81%E8%B5%84%E6%96%99%E4%B8%8A%E4%BC%A0%20%E6%B8%85%E9%99%A4%E6%95%8F%E6%84%9F%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/420861/%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%20%E4%BA%A7%E5%93%81%E8%B5%84%E6%96%99%E4%B8%8A%E4%BC%A0%20%E6%B8%85%E9%99%A4%E6%95%8F%E6%84%9F%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        $('#cke_1_top').append($('<div class="CL_MGC">').html('清除敏感词').attr({style:'position: absolute; right: 17px; top: 44px; background: #a057d8;color: aliceblue;padding: 3px 5px;border-radius: 6px;cursor: pointer;'}))
    },2000)
    var words=['轮功','游戏','联系','理想','卸任','受欢迎','先进','巡逻','击锤','全方位','航空','技术支持','专利','国家级产品','全球级','宇宙级','世界级','顶级','尖端','顶尖','顶级工艺','顶级享受','极品','极佳','绝佳','绝对','终极','极致','第一','中国第一','全网第一','销量第一','排名第一','唯一','第一品牌','NO.1','TOP.1','独一无二','全国第一','一流','一天','仅此一次','仅此一款','最后一波','全国X大品牌之一','最佳','最具','最爱','最赚','最优','最优秀','最好','最大','最大程度','最高','最高级','最高档','最奢侈','最低','最低级','最低价','最底','最便宜','时尚最低价','最流行','最受欢迎','最时尚','最聚拢','最符合','最舒适','最先','最先进','最先进科学','最先进加工工艺','最先享受','最后','最后一波','最新科技','最新科学首个','首选','独家','独家配方','全国首发','首款','全国销量冠军','国家级产品','国家','国家免检','国家领导人','填补国内空白','王牌','领袖品牌','世界领先','领导者','缔造者','创领品牌','领先上市','至尊','巅峰','领袖','之王','王者','冠军','史无前例','前无古人','永久','万能','祖传','特效','无敌','纯天然','点击领奖','恭喜获奖','全民免单','点击有惊喜','点击获取','点击转身','点击试穿','点击翻转','领取奖品','抢爆','再不抢就没了','不会更便宜了','错过就没机会了','万人疯抢','全民疯抢','全民抢购','卖疯了','抢疯了','最佳','最具','最爱','最赚','最优','最优秀','最好','最大','最大程度','最高','最高级','最高档','最奢侈','最低','最低级','最低价','最底','最便宜','时尚最低价','最流行','最受欢迎','最时尚','最聚拢','最符合','最舒适','最先','最先进','最先进科学','最先进加工工艺','最先享受','最后','最后一波','最新科技','最新科学','今日','今天','几天几夜','倒计时','趁现在','就','仅限','周末','周年庆','特惠趴','购物大趴','闪购','品牌团','精品团','单品团','随时涨价','马上降价','金牌','名牌','优秀','顶级','独家','全网销量第一全球首发','全网首发','世界领先','顶级工艺','王牌','销量冠军','永久','王牌','掌门人','领袖品牌','绝无仅有','史无前例','万能','大牌','精确','超赚','领导品牌','领先上市','巨星','著名','奢侈']
    $(document).on('click','.CL_MGC', function(ev) {
        var conte=$('.cke_wysiwyg_div')[0].innerHTML
        for(var i=0;i<words.length;i++){
            conte=conte.replace(new RegExp(words[i],'ig'), '')
        }
        $('.cke_wysiwyg_div')[0].innerHTML=conte
    })
})();