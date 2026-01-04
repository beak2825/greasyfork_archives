// ==UserScript==
// @name         贝壳房屋列表追加户型图
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  贝壳房屋列表追加户型图，方便搜索
// @author       bond.pan
// @match        https://*.ke.com/ershoufang/
// @match        https://*.ke.com/ershoufang/*/
// @match        https://*.ke.com/ditiefang/*/
// @icon         https://sy.ke.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428221/%E8%B4%9D%E5%A3%B3%E6%88%BF%E5%B1%8B%E5%88%97%E8%A1%A8%E8%BF%BD%E5%8A%A0%E6%88%B7%E5%9E%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/428221/%E8%B4%9D%E5%A3%B3%E6%88%BF%E5%B1%8B%E5%88%97%E8%A1%A8%E8%BF%BD%E5%8A%A0%E6%88%B7%E5%9E%8B%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        get_custom_info();
    }, 2000);
})();


function get_custom_info(){
    $("ul.sellListContent li.clear").each(function(){

        if($(this).find(".follow-text").html() == '取消关注'){
            $(this).css("background", "#d0fdd0")
        }
        
        var house_id = $(this).find("div.unitPrice").attr("data-hid");
        // console.log(house_id);

        var house_link = $(this).find("a.maidian-detail").attr("href");
        // console.log(house_link);

        var house_total_price = $(this).find("div.totalPrice span").eq(0).html();

        //var pic_dom = "<img src='https://ke-image.ljcdn.com/110000-inspection/pc1_Xd8YbQ1gi_1.jpg!m_fill,w_280,h_210,f_jpg?from=ke.com' />"
        var pic_dom = ""

        //$(this).find("div.houseInfo span").after("<select><option>1F</option><option>2F</option></select>")

        var hxt_style = "position: relative; height: 150px; width: 300px; left: -300px; top: -200px;"
        var area_style = "position: relative; height: 150px; width: 300px; left: 920px; top: -100px; line-height: 32px; font-size: 12px; "

        //$(this).find("div.followInfo").after("<div class='houseInfo houseInfo_script_2'><span class='houseIcon'></span></div>")
        $(this).find("div.followInfo").after("<div class='houseInfo houseInfo_script_1'><span class='houseIcon'></span></div>")
        $(this).append("<div class='detail_info' id='detail_"+house_id+"'><div class='origin' style='display:none;'></div><div class='show_hxt' style='"+hxt_style+"'>"+pic_dom+"</div></div>");
        var li_obj = $(this)

        $("#detail_"+house_id+" .origin").load(house_link + ' div.sellDetailPage', function(){
            // 户型图
            var pic_url = $("#detail_"+house_id+" .origin div.sellDetailPage div#topImg ul.smallpic li[data-desc='户型图']").attr("data-src");
            $("#detail_"+house_id+" .show_hxt").html("<img src='"+pic_url+"' />")

            // 总面积
            var house_area = $("#detail_"+house_id+" .origin div.sellDetailPage div.houseInfo div.area div.mainInfo").html()
            house_area = house_area.replace("平米", "")
            house_area = Number(house_area)

            // 套内面积
            var layout_list = $("#detail_"+house_id+" .origin div.sellDetailPage div#layout div#infoList div.row")
            var actual_area = 0;
            $.each(layout_list, function(index, value){
                var area_text = $(this).find("div.col").eq(1).html()
                var area_value = area_text.replace("平米", "")
                actual_area += Number(area_value)
            });
            li_obj.find("div.houseInfo_script_1").append(" 套内实际："+actual_area.toFixed(2)+"平米")

            // 公摊
            var public_area = (house_area - actual_area).toFixed(2)
            var public_rate = (public_area/house_area*100).toFixed(2)
            li_obj.find("div.houseInfo_script_1").append(" | 公摊+墙体："+public_area+"平米("+public_rate+"%)")

            // 实际单价
            /*var one_square_meter_price = 0;
            if (actual_area > 0) {
                one_square_meter_price = (Number(house_total_price)*10000/Number(actual_area)).toFixed(2)
            }
            li_obj.find("div.houseInfo_script_2").append(" 实际单价："+one_square_meter_price+"元/平米")*/
        });
    });
}