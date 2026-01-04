// ==UserScript==
// @name         宝宝装计算器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  baobaozhuang计算器
// @author       You
// @match        *://xyq.cbg.163.com/cgi-bin/query.py?*
// @match        *://xyq.cbg.163.com/cgi-bin/xyq_overall_search.py?*
// @match        *://xyq.cbg.163.com/cgi-bin/equipquery.py?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440163/%E5%AE%9D%E5%AE%9D%E8%A3%85%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/440163/%E5%AE%9D%E5%AE%9D%E8%A3%85%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var num;
    num = 0;
    $(document).ready(function(){
    	var newElement = "<tr>";
    		newElement += "<td><input type='text' size='3' id='testdl' value=''></td>";
    		newElement += "<td><input type='button' id='dlxiayiye' value='下一页' class='btn1'></td>";
            newElement += "<td><input type='button' id='helperBtn' class='btn1' value='计算'></td>";
            newElement += "</tr>";
            var length = $(".searchForm").length
            console.log(length)
            $(".searchForm")[length-1].lastChild.after($(newElement)[0]);
            addBtnEvent("helperBtn");
	})

	function addBtnEvent(id){
		$("#"+id).bind("click", function(){
    		newPriceList();
		})
		$("#dlxiayiye").click(function(){
            $("#testdl").attr("value","");
			var length = document.querySelector("#pager_bar").getElementsByTagName("a").length;
			document.querySelector("#pager_bar").getElementsByTagName("a")[length-2].click();
		})
	}

    function newPriceList(){
    	var list = $("#soldList tr")
    	num = 0;
        for(var i = 0; i < list.length; i++){
            if(list[i].id == 'order_menu'){
                continue;
            }
            var price = calPrice(list[i]);
            addCalPrice(list[i], price);
        }
        console.log(num)
        if (num >0){
        	console.log($("#testdl").innerHTML);
        	$("#testdl").attr("value", num)
        }
    }

    function selectNumber(str, match){
    	var test = str.match(match);
    	if(test){
    		return test[1];
    	}
    	return 0;
    }

    //0是护腕 1是项圈 2是铠甲
    function getLeixing(str){
    	var test = str.match(/防御 \+(\d+)/)
    	if(test){
    		return 2
    	}
    	test = str.match(/速度 \+(\d+)/)
    	if(test){
    		return 1
    	}
    	return 0
    }

    function calBumoXianglianPrice(desc){
        var chushiMap = {
            170:600,
            180:1000,
            190:2000,
            200:3000,
            210:5000,
            220:8000,
            230:13000,
        }
        var baoshiMap = {
            0:0,
            1:0,
            2:0,
            3:0,
            4:0,
            5:0,
            6:20,
            7:70,
            8:150,
            9:300,
            10:800,
            11:1600,
            12:3200,
        }
        var lingli,ronglian,dengji,xiangqiandengji,baoshileixing
        lingli=ronglian=dengji=xiangqiandengji=baoshileixing=0
        var test
        test = desc.match(/灵力 \+(\d+)/)
        if(test){
             lingli = parseInt(test[1]);
        }
        test = desc.match(/锻炼等级 (\d+)/)
        if(test){
             xiangqiandengji = parseInt(test[1]);
        }
        test = desc.match(/#r等级 (\d+)/)
        if(test){
             dengji = parseInt(test[1]);
        }
        test = desc.match(/\+(\d+)灵力/)
        if(test){
            ronglian = parseInt(test[1])
        }
        var chushi = 0
        var price = 0
        chushi = lingli - 6 * xiangqiandengji + ronglian
        if(chushi==169){
            price = 600
        }else{
            var value = parseInt(chushi / 10) * 10
            price = chushiMap[value]
            price += (chushiMap[value+10] - chushiMap[value]) / 10 * (chushi - value)
        }

        price += baoshiMap[xiangqiandengji]
        console.log("price:",price,"灵力:",lingli, "初始:", chushi,"锻炼等级",xiangqiandengji,"等级",dengji, "熔炼灵力",ronglian)
        return price
    }

    function calShanghaiPrice(equipInfoMap){
        //#r等级 115  #r速度 +37 伤害 +57#r耐久度 379#r#G#G力量 +25#Y#Y#r#c4DBAF4套装效果：附加状态#c4DBAF4高级吸血#Y#Y#r#W制造者：āī骚尼姑#Y#r#Y镶嵌效果：#r#Y+60速度 镶嵌等级：10#Y
        //#r等级 105  #r防御 +68 伤害 +38#r耐久度 500#r#G#G力量 +25#Y#Y#r#W制造者：笙歌白云上ι#Y
        var shanghaiMap = {
            50:35,
            51:38,
            52:41,
            53:45,
            54:55,
            55:65,
            56:80,
            57:95,
            58:110,
            59:130,
            60:150,
            61:170,
            62:190,
            63:210,
            64:240,
            65:270,
            66:300,
            67:350,
            68:400,
            69:450,
            70:500,
            71:600,
            72:700,
            73:800,
            74:900,
            75:1000,
            76:1250,
            77:1500,
            78:1750,
            79:2000,
            80:2400,
            81:2700,
            82:3000,
            83:3500,
            84:4000,
        };
        var dianshu
        //如果是 50 伤以下就别看了
        if(equipInfoMap.shanghai<40){
            return 0
        }
        if(equipInfoMap.qixue>0){
            dianshu = equipInfoMap.shanghai + parseInt(equipInfoMap.qixue / 12)
        }
        //加耐且不是铠甲
        if(equipInfoMap.naili>0 && leixing != 2){
            if(equipInfoMap.naili + equipInfoMap.shanghai > 70){
                dianshu = equipInfoMap.shanghai + parseInt(equipInfoMap.naili * 0.9)
            }else if(equipInfoMap.naili + equipInfoMap.shanghai > 60){
                dianshu = equipInfoMap.shanghai + parseInt(equipInfoMap.naili * 0.8)
            }else{
                dianshu = equipInfoMap.shanghai + parseInt(equipInfoMap.naili * 0.65)
            }
        }
        if(equipInfoMap.minjie>0 && leixing != 1){
            dianshu = equipInfoMap.shanghai + parseInt(equipInfoMap.minjie / 2)
        }
        if(equipInfoMap.liliang > 0){
            dianshu = equipInfoMap.shanghai+equipInfoMap.liliang
        }
        var leixing = equipInfoMap.leixing
        if(leixing == 1 && dianshu >= 60){
            var sudu = equipInfoMap.sudu
            if(sudu<35){
                dianshu -= 2
            }
            if(sudu<38){
                dianshu -= 1
            }
            if(sudu<30){
                dianshu -= 3
            }
        }
        if(leixing == 2 && dianshu >= 60){
            var fangyu = equipInfoMap.fangyu
            if(fangyu<100){
                dianshu -= (10 - parseInt(fangyu / 10))
            }else if(fangyu<108){
                if(dianshu>=75){
                    dianshu -= 2
                }else{
                    dianshu -= 1
                }
            }else{
                dianshu -= 1
            }
        }

        var price = shanghaiMap[dianshu];
        if(equipInfoMap.shanghai < 50){
            price *= 0.9
        }
        if(price == 0){
            return 0;
        }
        return price;
    }

    function calFaPrice(equip){
        var faMap = {
            21:20,
            22:40,
            23:60,
            24:80,
            25:100,
            26:150,
            27:200,
            28:250,
            29:300,
            30:400,
            31:600,
            32:900,
            33:1800,
        };
        var dianshu = equip.fali * 1.1 + equip.lingli + equip.liliang * 0.4 + equip.naili * 0.2 + equip.tizhi * 0.3
        var dianshuDefault = parseInt(dianshu)
        var price = faMap[dianshuDefault] + (faMap[dianshuDefault+1] - faMap[dianshuDefault]) * (dianshu - dianshuDefault)
        return price
    }

    //计算敏法宝宝装价格
    function calMinFaPrice(equip){
        var minfaMap = {
            21:10,
            22:20,
            23:30,
            24:40,
            25:50,
            26:60,
            27:70,
            28:80,
            29:90,
            30:100,
            31:130,
            32:160,
            33:200,
            34:250,
            35:300,
            36:400,
            37:500,
            38:600,
            39:700,
            40:800,
            41:1000,
            42:1300,
            43:1600,
            44:2000,
        };
        //非敏法直接返回
        if(equip.minjie<=0){
            return 0
        }
        var dianshu
        var leixing = equip.leixing
        //敏法如果是项圈需要修正属性
        if(leixing == 1){
            equip.minjie = equip.minjie + (equip.sudu - 35) / 1.25
        }
        if(equip.fali > 0){
            dianshu = equip.fali * 1.1 + equip.minjie
        }
        if(equip.liliang > 0){
            dianshu = equip.liliang * 0.4 + equip.minjie
        }
        if(equip.lingli > 0){
            dianshu = equip.lingli + equip.minjie
        }
        if(equip.leixing == 0 && dianshu >= 35){
            dianshu -= 1
        }
        var priceDefault = minfaMap[parseInt(dianshu)]
        if(priceDefault <= 0){
            return 0
        }
        var price = parseInt(priceDefault + (minfaMap[parseInt(dianshu)+1] - priceDefault) * (dianshu - parseInt(dianshu)))
        return price
    }

    function getShuxing(desc){
        var tizhi,minjie,liliang,naili,fali,qixue,sudu,fangyu,lingli,shanghai
        fali=minjie=liliang=fangyu=sudu=shanghai=qixue=lingli=naili=tizhi=0
        var test
        test = desc.match(/法力 \+(\d+)/)
        if(test){
            fali = parseInt(test[1]);
        }
        test = desc.match(/敏捷 \+(\d+)/)
        if(test){
            minjie = parseInt(test[1]);
        }
        test = desc.match(/力量 \+(\d+)/)
        if(test){
            liliang = parseInt(test[1]);
        }
        test = desc.match(/体质 \+(\d+)/)
        if(test){
            tizhi = parseInt(test[1]);
        }
        test = desc.match(/耐力 \+(\d+)/)
        if(test){
            naili = parseInt(test[1]);
        }
        test = desc.match(/气血 \+(\d+)/)
        if(test){
            qixue = parseInt(test[1]);
        }
        test = desc.match(/伤害 \+(\d+)/)
        if(test){
            shanghai = parseInt(test[1]);
        }
        test = desc.match(/灵力 \+(\d+)/)
        if(test){
            lingli = parseInt(test[1]);
        }
        test = desc.match(/速度 \+(\d+)/)
        if(test){
            sudu = parseInt(test[1]);
        }
        test = desc.match(/防御 \+(\d+)/)
        if(test){
            fangyu = parseInt(test[1]);
        }
        var leixing = 0
        if(sudu > 0){
            leixing = 1
        }
        if (fangyu > 0){
            leixing = 2
        }
        return {
            shanghai:parseInt(shanghai),
            qixue: parseInt(qixue),
            fangyu: parseInt(fangyu),
            sudu: parseInt(sudu),
            liliang:liliang,
            tizhi:tizhi,
            minjie:minjie,
            fali:fali,
            naili:naili,
            lingli:lingli,
            leixing:leixing,
        }
    }

    function calPrice(role){
    	//获取原价格
        var priceClass = ['p100','p1000','p10000','p100000','p1000000'];
        for(var i = 0; i <priceClass.length; i++){
        	var oldPrice = role.getElementsByClassName(priceClass[i])
        	if(oldPrice.length > 0){
        		var className = oldPrice[0].parentNode.className
        		if(className.match(/cDGray/)){
        			continue
        		}
        		var priceOri = parseFloat(oldPrice[0].textContent.replace("￥",""))
        		break
        	}
        }

        var equipInfo = role.getElementsByTagName("textarea");
        var equipObj = JSON.parse(equipInfo[0].value);
        var desc = equipObj.desc
        var zongshu

        if(document.URL == "https://xyq.cbg.163.com/cgi-bin/equipquery.py?act=show_overall_search_equip"){
            price = calBumoXianglianPrice(desc)
            return price.toFixed(2).toString()
        }
        var equipInfoMap = getShuxing(desc)
        var price = 0
        var minfaPrice = calMinFaPrice(equipInfoMap)
        if(price < minfaPrice){
            price = minfaPrice
        }
        var shanghaiPrice = calShanghaiPrice(equipInfoMap)
        if(price < shanghaiPrice){
            price = shanghaiPrice
        }
        var faPrice = calFaPrice(equipInfoMap)
        if(price < faPrice){
            price = faPrice
        }

        var yingli =  (price * 0.95) - priceOri
        if(yingli > 0){
        	return price.toFixed(2).toString() + "::" + yingli.toFixed(2).toString()
        }
        return price.toFixed(2).toString()
    }

    function addCalPrice(role, price){
    	if(price == 0){
    		return
    	}
    	num++;
        var priceClass = ['p100','p1000','p10000','p100000','p1000000'];
        for (var i = 0; i < priceClass.length; i++){
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
    // Your code here...
})();