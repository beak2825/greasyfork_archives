// ==UserScript==
// @name         梦幻西游装备属性计算工具
// @namespace    https://github.com/dongliangzxc/xyqhelp
// @version      0.4
// @description  try to take over the world!
// @author       Jason Dong
// @match        *://xyq.cbg.163.com/cgi-bin/query.py?*
// @include      *://xyq.cbg.163.com/cgi-bin/equipquery.py?act=show_overall_search_equip
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422634/%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8%E8%A3%85%E5%A4%87%E5%B1%9E%E6%80%A7%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/422634/%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8%E8%A3%85%E5%A4%87%E5%B1%9E%E6%80%A7%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bolZhuangbei = 0;
    // Your code here...
    var zhongzu = localStorage.TM_zhongzu;
    var leixing = localStorage.TM_leixing;
    if(!zhongzu){
        zhongzu = "ren";
        localStorage.TM_zhongzu = "ren";
    }
    if(!leixing){
        leixing = "fa";
        localStorage.TM_leixing = "fa";
    }

    var url = document.URL;
    if(url == "https://xyq.cbg.163.com/cgi-bin/equipquery.py?act=show_overall_search_equip"){
        bolZhuangbei = 1;
    }else{
        var getJueSezhuangbeiStr = document.getElementsByName('equip_kind')[0].labels[0].innerText;
        if(getJueSezhuangbeiStr == "角色装备"){
            bolZhuangbei = 1;
        }
    }
    if(bolZhuangbei == 1){
        $(document).ready(function(){
        var newElement = "<tr>";
            newElement += "<td colspan='10' align='right'>&nbsp;种族：";
            newElement += "<input type='text' class='txt1' size='3' id='txt_zhongzu' value="+zhongzu+">";
            newElement += "&nbsp;&nbsp;是否法系：";
            newElement += "<input type='text' class='txt1' size='6' id='txt_leixing' value="+leixing+">";
            newElement += "&nbsp;&nbsp;&nbsp;&nbsp; <input type='button' id='helperBtn' class='btn1' value='计算'></td>";
            newElement += "</tr>";
            $("tbody")[0].lastChild.after($(newElement)[0]);
            addBtnEvent("helperBtn");
        });
    }

    function isQuanFu(){
        return document.URL == "https://xyq.cbg.163.com/cgi-bin/equipquery.py?act=show_overall_search_equip";
    }

    var objPrev = {'zhongzu':null, 'leixing':null};
    function addBtnEvent(id){
        $("#"+id).bind("click", function(){
                var obj = getInput();
                newPriceList(obj.zhongzu, obj.leixing);
                objPrev = obj;
        });
    }

    function isFinish(obj){
        var temp1 = $("input:text[id='txt_zhongzu']").val();
        var temp2 = $("input:text[id='txt_leixing']").val();
        if(temp1 == obj.zhongzu && temp2 == obj.leixing){
            return true;
        }else{
            return false;
        }
    }

    function getInput(){
        var zhongzu = null;
        var leixing = null;
        var reg = /(^ren$)|(^mo$)|(^xian$)/;
        let temp = $("input:text[id='txt_zhongzu']").val();
        if(temp == ""){
            zhongzu = localStorage.TM_zhongzu;
        }else{
            if(reg.test(temp) == true){
                zhongzu = temp;
                localStorage.TM_zhongzu = zhongzu;
            }else{
                alert("请输入:ren mo xian 随机一个");
                return false;
            }
        }

        temp = $("input:text[id='txt_leixing']").val();
        leixing = temp;
        localStorage.TM_leixing = leixing;
        return {
            'zhongzu' : zhongzu,
            'leixing' : leixing
        }
    }

    function newPriceList(zhongzu, leixing){
        var list = document.getElementById('soldList').getElementsByTagName('tr');
        for(var i = 0; i < list.length; i++){
            if(list[i].id == 'order_menu'){
                continue;
            }
            var price = calPrice(list[i], zhongzu, leixing);
            addCalPrice(list[i], price);
        }
    }

    function addCalPrice(role, price){
        var priceClass = ['p100','p1000','p10000','p100000','p1000000'];
        var key = 1;
        if(isQuanFu()){
            key = 12;
        }
        for (var i=0;i<priceClass.length;i++){
            var oldPrice=role.getElementsByClassName(priceClass[i]);
            if(oldPrice.length > 0 ){
                if(!oldPrice[0].parentNode.children[1] || oldPrice[0].parentNode.children[1].nodeName != "SPAN"){ //判断是否存在计算价格
                    let newElement = document.createElement('span');
                    newElement.innerHTML = "【"+price+"】";
                    for(let j=4;j>-1;j--){
                        if(price<Math.pow(10,j+2)) newElement.className = priceClass[j];  //可以改变计算价格的显示颜色
                    }
                    oldPrice[0].parentNode.insertBefore(newElement, oldPrice[0].nextSibling); //售价后添加计算值
                    break; //添加价格后立即退出循环
                }
                else {
                    let newElement = document.createElement('span');
                    newElement.innerHTML = "【"+price+"】";
                    for(let j=4;j>-1;j--){
                        if(price<Math.pow(10,j+2)) newElement.className = priceClass[j];
                    }
                    oldPrice[0].parentNode.replaceChild(newElement,oldPrice[0].parentNode.children[1]); //售价后添加计算值
                    break;
                }
            }
        }
    }

    function getXiangqianBaoshi(str){
        var baoshi = str.match(/镶嵌宝石 (\S+)#r/);
        if(baoshi){
            return baoshi[1];
        }
        return "";
    }

    function calFangju(equipObj, zhongzu, leixing){
        var shuxingzhuanhuan = {
            fa:{
                防御: 4 / 10.5,
                气血: 3 / 7 / 5,
                敏捷: 1,
                灵力: 1 / 0.7,
                速度: 1 / 0.7,
                体质: 1,
                魔力: 1,
                力量: 5 / 7,
                耐力: 1,
            },
            wu:{
                防御: 1 / 1.5,
                气血: 1 / 5,
                敏捷: 1,
                灵力: 1 / 0.7,
                速度: 1 / 0.7,
                体质: 1,
                魔力: 1 / 7,
                力量: 1,
                耐力: 1,
            },
            other:{
                防御: 6 / 7 / 1.5,
                气血: 6 / 7 / 1.5,
                敏捷: 1,
                灵力: 1 / 0.7,
                速度: 1 / 0.7,
                体质: 1,
                魔力: 1 / 7,
                力量: 1 / 7,
                耐力: 1,
            }
        };
        var xiuzheng = {
            ren:{
                防御:1,
                气血:1,
                敏捷:1,
                灵力:1,
                速度:1,
                体质:1,
                魔力:1,
                力量:1,
                耐力:1,
            },
            mo:{
                防御:1.5 / 1.4,
                气血: 5 / 6,
                敏捷:1,
                灵力:1,
                速度:1,
                体质:1,
                魔力:1,
                力量:1,
                耐力:1,
            },
            xian:{
                防御:1.5 / 1.6,
                气血: 5 / 4.5,
                敏捷:1,
                灵力:1,
                速度:1,
                体质:1,
                魔力:1,
                力量:1,
                耐力:1,
            }
        }
        var shuxing = {
            防御:0,
            气血:0,
            敏捷:0,
            灵力:0,
            速度:0,
            体质:0,
            魔力:0,
            力量:0,
            耐力:0,
        };
        var baoshi_shuxing_map = {
            黑宝石:'速度',
            月亮石:'防御',
            舍利子:'灵力',
            光芒石:'气血',
        };
        var baoshi_number = {
            黑宝石:8,
            月亮石:12,
            舍利子:6,
            光芒石:40,
        }
        for(var i = 0; i < equipObj.main_attrs.length; i++){
            if(shuxing[equipObj.main_attrs[i][0]] >= 0){
                shuxing[equipObj.main_attrs[i][0]] += parseInt(equipObj.main_attrs[i][1]);
            }
        }
        var arrMatch = [];
        if(equipObj.add_melt_attrs){
            for(i = 0; i < equipObj.add_melt_attrs.length; i++){
                arrMatch = equipObj.add_melt_attrs[i].match(/(\S+) ([+|-]\d+)/);
                if(arrMatch){
                    shuxing[arrMatch[1]] += parseInt(arrMatch[2]);
                }
            }
        }
        if(equipObj.gem_level != 0){
            var strBaoshi = getXiangqianBaoshi(equipObj.desc);
            if(baoshi_number[strBaoshi]){
                shuxing[baoshi_shuxing_map[strBaoshi]] -= baoshi_number[strBaoshi] * equipObj.gem_level;
            }
        }
        var shuxingdian = 0;
        for(i in shuxing){
            shuxingdian += shuxingzhuanhuan[leixing][i] * xiuzheng[zhongzu][i] * shuxing[i];
        }
        return shuxingdian.toFixed(2) + '属性点';
    }

    function calPrice(role, zhongzu , leixing){
        var shuxingzhuanfashang = {
            体质:0.3,
            敏捷:0,
            耐力:0.2,
            魔力:0.7,
            力量:0.4,
        };
        var equipInfo = role.getElementsByTagName("textarea");
        var equipObj = JSON.parse(equipInfo[0].value);

        //先计算武器
        var type_wuqi = ['剑'];
        var type_fangju = ['男衣', '女衣', '女头', '男头', '腰带', '鞋子', '饰品'];
        var kind_fangju = [18, 59, 17, 58, 20, 19, 21];
        var equipType;

        if(isQuanFu()){
            equipType = parseInt(role.getElementsByTagName("img")[0].attributes[14].value);
        }else{
            equipType = parseInt(role.getElementsByTagName("img")[0].attributes[16].value);
        }

        // var equipType = document.getElementById('s_role_type').selectedOptions[0].outerText;

        var defaultShuxing = 0;
        if(kind_fangju.indexOf(equipType) >= 0){
            return calFangju(equipObj, zhongzu, leixing);
        }

        if(equipObj.gem_level != 0){
            var test = equipObj.desc.match(/镶嵌宝石 (\S+)#r/);
            if(test){
                if(test[1] == '太阳石'){
                    defaultShuxing -= equipObj.gem_level * 2;
                }
            }
        }
        //计算属性
        for(var i = 0; i < equipObj.main_attrs.length; i++){
            if(equipObj.main_attrs[i][0] == '伤害'){
                defaultShuxing += parseInt(equipObj.main_attrs[i][1])/4;
            }
        }
        if(equipObj.vice_attrs){
            for(i = 0; i < equipObj.vice_attrs.length; i++){
                var temp = equipObj.vice_attrs[i];
                defaultShuxing += parseFloat(shuxingzhuanfashang[temp[0]]) * parseInt(temp[1]);
            }
        }

        if(equipObj.melt_attrs){
            for(i = 0; i < equipObj.melt_attrs.length; i++){
                temp = equipObj.melt_attrs[i];
                defaultShuxing += parseFloat(shuxingzhuanfashang[temp[0]]) * parseInt(temp[1]);
            }
        }

        return defaultShuxing.toFixed(2) + "法伤";
        // return defaultShuxing;
    }

})();