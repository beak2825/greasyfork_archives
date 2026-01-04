// ==UserScript==
// @name         研招网小助
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  研招网助手，更好显示高校的title、区域（A、B区）、是否是自划线（半透明红色表示）、精确检索对应学校研招网（点击高校名前箭头）
// @author       3hex
// @match        https://yz.chsi.com.cn/zsml/queryAction.do
// @icon         https://ts3.cn.mm.bing.net/th?id=ODLS.80f9714e-2fee-4c9f-a818-9a80fee06c67&w=32&h=32&qlt=90&pcl=fffffa&o=6&cb=1027&pid=1.2
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/478473/%E7%A0%94%E6%8B%9B%E7%BD%91%E5%B0%8F%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/478473/%E7%A0%94%E6%8B%9B%E7%BD%91%E5%B0%8F%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
GM_addStyle(`
  @import url('https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
`);
    'use strict';
    var is_985 = false;
    var is_b_loc = false;
    var list_str_985 = ['中国科学技术大学','清华大学','北京大学','北京理工大学','西安交通大学','浙江大学','哈尔滨工业大学','武汉大学','华中科技大学','复旦大学','南开大学','天津大学','中国人民大学','北京航空航天大学','北京师范大学','中国农业大学','中央民族大学','厦门大学','兰州大学','中山大学','华南理工大学','中南大学','湖南大学','国防科技大学','吉林大学','南京大学','东南大学','大连理工大学','东北大学','山东大学','中国海洋大学','西北工业大学','西北农林科技大学','同济大学','上海交通大学','四川大学','电子科技大学','重庆大学','华东师范大学'];
    var list_str_211 = ['清华大学','北京大学','中国人民大学','北京交通大学','北京工业大学','北京航空航天大学','北京理工大学','北京科技大学','北京化工大学','北京邮电大学','中国农业大学','北京林业大学','中国传媒大学','中央民族大学','北京师范大学','中央音乐学院','对外经济贸易大学','北京中医药大学','北京外国语大学','中国地质大学(北京)','中国矿业大学(北京)','中国石油大学(北京)','中国石油大学','中国政法大学','中央财经大学','华北电力大学','北京体育大学','南开大学','天津大学','天津医科大学','河北工业大学','上海外国语大学','复旦大学','华东师范大学','上海大学','东华大学','上海财经大学','华东理工大学','同济大学','上海交通大学','海军军医大学','重庆大学','西南大学','华北电力大学(保定)','太原理工大学','内蒙古大学','大连理工大学','东北大学','辽宁大学','大连海事大学','吉林大学','东北师范大学','延边大学','哈尔滨工业大学','哈尔滨工程大学','东北农业大学','东北林业大学','南京大学','东南大学','苏州大学','南京师范大学','中国矿业大学','中国药科大学','河海大学','南京理工大学','江南大学','南京农业大学','南京航空航天大学','浙江大学','中国科学技术大学','安徽大学','合肥工业大学','厦门大学','福州大学','南昌大学','山东大学','中国海洋大学','中国石油大学(华东)','郑州大学','武汉大学','华中科技大学','武汉理工大学','中南财经政法大学','华中师范大学','华中农业大学','中国地质大学(武汉)','中国地质大学','湖南大学','中南大学','湖南师范大学','国防科技大学','中山大学','暨南大学','华南理工大学','华南师范大学','广西大学','四川大学','电子科技大学','西南交通大学','西南财经大学','四川农业大学','云南大学','贵州大学','西北大学','西安交通大学','西北工业大学','长安大学','西北农林科技大学','陕西师范大学','西安电子科技大学','空军军医大学','兰州大学','海南大学','宁夏大学','青海大学','西藏大学','新疆大学','石河子大学']
    var list_str_dfc = ['北京大学','中国人民大学','清华大学','北京交通大学','北京工业大学','北京航空航天大学','北京理工大学','北京科技大学','北京化工大学','北京邮电大学','中国农业大学','北京林业大学','北京协和医学院','北京中医药大学','北京师范大学','首都师范大学','北京外国语大学','中国传媒大学','中央财经大学','对外经济贸易大学','外交学院','中国人民公安大学','北京体育大学','中央音乐学院','中国音乐学院','中央美术学院','中央戏剧学院','中央民族大学','中国政法大学','南开大学','天津大学','天津工业大学','天津医科大学','天津中医药大学','华北电力大学','河北工业大学','山西大学','太原理工大学','内蒙古大学','辽宁大学','大连理工大学','东北大学','大连海事大学','吉林大学','延边大学','东北师范大学','哈尔滨工业大学','哈尔滨工程大学','东北农业大学','东北林业大学','复旦大学','同济大学','上海交通大学','华东理工大学','东华大学','上海海洋大学','上海中医药大学','华东师范大学','上海外国语大学','上海财经大学','上海体育学院','上海音乐学院','上海大学','南京大学','苏州大学','东南大学','南京航空航天大学','南京理工大学','中国矿业大学','南京邮电大学','河海大学','江南大学','南京林业大学','南京信息工程大学','南京农业大学','南京医科大学','南京中医药大学','中国药科大学','南京师范大学','浙江大学','中国美术学院','安徽大学','中国科学技术大学','合肥工业大学','厦门大学','福州大学','南昌大学','山东大学','中国海洋大学','中国石油大学华东','郑州大学','河南大学','武汉大学','华中科技大学','中国地质大学武汉','武汉理工大学','华中农业大学','华中师范大学','中南财经政法大学','湘潭大学','湖南大学','中南大学','湖南师范大学','中山大学','暨南大学','华南理工大学','华南农业大学','广州医科大学','广州中医药大学','华南师范大学','海南大学','广西大学','四川大学','重庆大学','西南交通大学','电子科技大学','西南石油大学','成都理工大学','四川农业大学','成都中医药大学','西南大学','西南财经大学','贵州大学','云南大学','西藏大学','西北大学','西安交通大学','西北工业大学','西安电子科技大学','长安大学','西北农林科技大学','陕西师范大学','兰州大学','青海大学','宁夏大学','新疆大学','石河子大学','中国矿业大学北京','中国石油大学北京','中国地质大学北京','宁波大学','南方科技大学','上海科技大学','中国科学院大学','国防科技大学','海军军医大学','空军军医大学'];
    var list_b_loc = ['内蒙古自治区','广西壮族自治区','海南省','贵州省','云南省','西藏自治区','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区'];

    const u_985_label = '<span class="label label-danger">985</span>';
    const u_211_label = '<span class="label label-primary">211</span>';
    const u_dfc_label = '<span class="label label-success">双一流</span>';
    const u_a_loc_label = '<span class="label label-warning">A区</span>';
    const u_b_loc_label = '<span class="label label-info">B区</span>';
    const u_quick_start_btn = '<a target="_blank" style="border:0.5px solid black;"  href="https://www.baidu.com/s?&wd=inurl:.edu %27@wd@%27 研招网">⬅</a>';

    const path = "//table[@class='ch-table']/tbody//tr";
    const u_name_form_path = ".//form[@id='form3']"
    const u_name_path = ".//form[@id='form3']/a";
    const u_location_path = "./td[2]";
    const u_self_path = "./td[4]/i";

    const u_info_elem_list = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log(u_info_elem_list.snapshotLength);
    for(let i = 0; i < u_info_elem_list.snapshotLength; i++) {
        const element = u_info_elem_list.snapshotItem(i);

        const u_name_form = document.evaluate(u_name_form_path, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const u_name = document.evaluate(u_name_path, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);

        const u_location = document.evaluate(u_location_path, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // 自划线判断
        const u_self_flag = document.evaluate(u_self_path, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log(u_self_flag.snapshotItem(0));
        if(u_self_flag.snapshotItem(0) != null)// 自划线?
        {
            element.style.background = 'rgba(255, 0, 0, 0.05)';
        }

        // 正则表达式匹配高校名
        var regex_1 = /\((\d+)\)(.+)/;
        var match_name = u_name.innerHTML.match(regex_1)[2];
        var match_loc = u_location.snapshotItem(0).innerHTML.match(regex_1)[2];

        // 一键直达对应学校研招网
        u_name_form.snapshotItem(0).innerHTML = u_quick_start_btn.replace("@wd@", match_name) + u_name_form.snapshotItem(0).innerHTML;

        // 匹配A、B区
        is_b_loc = false;
        for (let k = 0; k < list_b_loc.length; k++) {
            if(match_loc==list_b_loc[k])// B区?
            {
                is_b_loc = true;
                u_location.snapshotItem(0).innerHTML = u_b_loc_label + u_location.snapshotItem(0).innerHTML;
                break;
            }
        }
        if(!is_b_loc)
        {
            u_location.snapshotItem(0).innerHTML = u_a_loc_label + u_location.snapshotItem(0).innerHTML;
        }

        // 匹配学校title
        is_985 = false;
        for (let j = 0; j < list_str_985.length; j++) {
            if(match_name==list_str_985[j])// 985?
            {
                is_985 = true;
                u_name_form.snapshotItem(0).innerHTML += u_985_label;
                u_name_form.snapshotItem(0).innerHTML += u_211_label;
                u_name_form.snapshotItem(0).innerHTML += u_dfc_label;
                break;
            }
        }
        if(!is_985) // not 985
        {
            for (let j = 0; j < list_str_211.length; j++) {
                if(match_name==list_str_211[j])// 211?
                {
                    u_name_form.snapshotItem(0).innerHTML += u_211_label;
                    break;
                }
            }

            for (let j = 0; j < list_str_dfc.length; j++) {
                if(match_name==list_str_dfc[j])// 双一流?
                {
                    u_name_form.snapshotItem(0).innerHTML += u_dfc_label;
                    break;
                }
            }
        }
    }

    // Your code here...
})();