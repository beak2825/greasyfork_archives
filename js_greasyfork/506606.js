// ==UserScript==
// @name         链家省心租带看单生成1.33
// @version      1.33
// @description  普租房子查看页面，把信息加工出来
// @author       链家员工
// @match        https://trusteeship.link.lianjia.com/house/detail/agent/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/1360117
// @downloadURL https://update.greasyfork.org/scripts/506606/%E9%93%BE%E5%AE%B6%E7%9C%81%E5%BF%83%E7%A7%9F%E5%B8%A6%E7%9C%8B%E5%8D%95%E7%94%9F%E6%88%90133.user.js
// @updateURL https://update.greasyfork.org/scripts/506606/%E9%93%BE%E5%AE%B6%E7%9C%81%E5%BF%83%E7%A7%9F%E5%B8%A6%E7%9C%8B%E5%8D%95%E7%94%9F%E6%88%90133.meta.js
// ==/UserScript==


(function () {
    'use strict';
    init()

//构建道具窗口
    function init() {
        const Panel_DIV = document.createElement('div');
        Panel_DIV.id = "Panel_DIV";
        Panel_DIV.className = "Panel_DIV";
        Panel_DIV.style.position = 'fixed';
        Panel_DIV.style.top = '36px';
        Panel_DIV.style.right = '65px';
        //Panel_DIV.style.transform = 'translateX(-50%)';
        Panel_DIV.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        Panel_DIV.style.padding = '6px 16px'; // 修改内边距
        Panel_DIV.style.color = 'white';
        Panel_DIV.style.fontSize = '11px';
        Panel_DIV.style.textAlign = 'center';
        Panel_DIV.style.zIndex = '9999';
        Panel_DIV.style.width = '105px'; // 设置宽度
        //Panel_DIV.style.height = '250px'; // 设置高度

        Panel_DIV.innerHTML = '省心租带看单';

// 创建一个确认按钮
        const buttonKaiGuan = document.createElement('button');
        buttonKaiGuan.style.display = 'block';
        buttonKaiGuan.style.margin = "auto";
        buttonKaiGuan.style.textAlign = 'center';
        buttonKaiGuan.style.backgroundColor = '';
        buttonKaiGuan.style.color = 'black';
        buttonKaiGuan.style.border = 'none';
        buttonKaiGuan.style.cursor = 'pointer';
        buttonKaiGuan.style.outline = 'none';
        buttonKaiGuan.innerHTML = '生成';
// 为按钮添加点击事件
        buttonKaiGuan.addEventListener('click', () => {
            //alert("点击了生成按钮")
            //调用函数生成带看单
            puzuDAIKAN();
        });

// 将div和按钮添加到body中
        Panel_DIV.appendChild(buttonKaiGuan);
// 设置焦点到确认按钮
        buttonKaiGuan.focus();
        document.body.appendChild(Panel_DIV);
    }

//预设各种变量
    //小区名称
    var xiaoquNAME = "啥小区啊"
    //居室
    var houseJUSHI = "啥居室啊"
    //面积
    var houseMIANJI = "面积多大啊"
    //朝向
    var houseCHAOXIANG = "啥朝向啊"
    //入住时间
    var ruzhuTIME = "啥入住时间啊"
    //租期要求
    var houseZUQI = "啥租期啊"
    //价格
    var housePRICE = "啥价格啊"
    //楼层
    var houseLOUCENG = "啥楼层啊"
    //房源编码
    var houseCODE = "-"

    //有没有房管人，房管人是否存在
    var weihuPEOPLE_exists = false
    //房管人
    var weihuPEOPLE = "房管人是谁啊"
    //房管人门店
    var weihuPEOPLE_mendian = "房管人哪个店的啊"

    //有没有钥匙人，钥匙人是否存在
    var yaoshiINFO_exists = false
    //钥匙人
    var yaoshiINFO = "钥匙有木有"

    //两个角色人信息
    var juesePEOPLE001 = "张三";
    var juesePEOPLE002 = "李四";
    var svgERWEI = document.createElement("svg")
    svgERWEI.innerHTML = '<svg id="svgERWEI" width="80" height="81" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>background</title><rect fill="#0fffff" id="canvas_background" height="102" width="102" y="-1" x="-1"/><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g></g><g><title>Layer 1</title><text transform="rotate(-45 42.81383514404296,39.558170318603516) " opacity="0.75" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="37" id="svg_1" y="52.232558" x="-1.372098" stroke-width="0" stroke="#000" fill="#000000">OMG</text><line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_15" y2="264" x2="-60.5" y1="239" x1="-60.5" fill-opacity="null" stroke-opacity="null" stroke-width="99" stroke="#000" fill="none"/><text opacity="0.75" transform="rotate(135 60.4881935119629,57.2325439453125) " xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="37" id="svg_16" y="69.906928" x="16.302272" stroke-width="0" stroke="#000" fill="#000000">OMG</text></g></svg>'
    // var hoseERWEI_new = ""
    var hoseERWEI_new = document.createElement("svg")


//单击"生成"按钮触发这个函数
    function puzuDAIKAN() {
        //获取各种参数
        //小区名称
        xiaoquNAME = document.querySelector("#content-wrapper div.house-address-wrap--xW6Tr7ch > span").textContent
        console.log("----------" + xiaoquNAME + "===========")
        //居室
        houseJUSHI = document.querySelector("#content-wrapper div.basic-info-center--1lbAhtyq > div:nth-child(1) > div:nth-child(2)").textContent
        console.log("----------" + houseJUSHI + "===========")
        //面积
        houseMIANJI = document.querySelector("#content-wrapper div.basic-info-center--1lbAhtyq > div:nth-child(2) > div:nth-child(2)").textContent
        console.log("----------" + houseMIANJI + "===========")
        //朝向
        houseCHAOXIANG = document.querySelector("#content-wrapper div.basic-info-center--1lbAhtyq > div:nth-child(3) > div:nth-child(2)").textContent
        console.log("----------" + houseCHAOXIANG + "===========")
        //入住时间
        ruzhuTIME = document.querySelector("#content-wrapper div.basic-info-bottom--VinC11gQ > div:nth-child(1) > div:nth-child(6)").textContent.split("：")[1]
        console.log("----------" + ruzhuTIME + "===========")
        //租期要求
        houseZUQI = "|" + document.querySelector("#content-wrapper div.basic-info-bottom--VinC11gQ > div:nth-child(1) > div:nth-child(1)").textContent.split("：")[1]
        console.log("----------" + houseZUQI + "===========")
        //如果租期要求为空
        // if (houseZUQI === "-") {
        //     houseZUQI = "";
        // }
        //获取楼层
        // if (document.querySelector("#content-wrapper div.basic-info-center--1lbAhtyq > div:nth-child(4) > div.key--1n37ZimX").textContent === "楼层") {
        //     houseLOUCENG = "|" +
        // } else {
        //     console.log("楼层132验证不通过，无法点击楼层")
        // }
        //价格
        housePRICE = document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.info-top--1l0J53lf > div.basicInfo--fraJyibi > div.basic-info-top--1nXjr0BN > div.left--IUztUm89 > div.price--nexqIAr-").textContent
        //房源编号
        houseCODE = document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.detail-header--3vyOfIqP > div.house-code-wrap--2luvgXwV > div:nth-child(1) > span").textContent.split("：")[1]

        //有没有房管人，房管人是否存在
        weihuPEOPLE_exists = true
        console.log("房管人存在吗？")
        if (weihuPEOPLE_exists) {
            //房管人
            weihuPEOPLE = document.querySelector("#content-wrapper div.ant-collapse-content.ant-collapse-content-active > div > div > div > div.role-desc > div.name").textContent
            console.log("房管人姓名：" + weihuPEOPLE)
            console.log(weihuPEOPLE.length)
            //房管人门店
            weihuPEOPLE_mendian = document.querySelector("#content-wrapper div.store").textContent.split("：")[1]
        }

        //是否随时可看
        yaoshiINFO_exists = document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.info-top--1l0J53lf > div.basicInfo--fraJyibi > div.basic-info-bottom--VinC11gQ > div:nth-child(1) > div:nth-child(7)").textContent === '钥匙信息：查看'
        if (yaoshiINFO_exists) {
            //钥匙人
            yaoshiINFO = "有密码，随时可看"
        } else {
            yaoshiINFO = document.querySelector("#content-wrapper div.basicInfo--fraJyibi > div.basic-info-bottom--VinC11gQ > div:nth-child(1) > div:nth-child(8) > span").textContent
        }

        //处理角色人信息
        //如果房管人健在
        console.log("房管人在吗？")
        console.log(weihuPEOPLE_exists)
        if (weihuPEOPLE_exists) {
            juesePEOPLE001 = "房管人:" + weihuPEOPLE;
        }
        // //如果钥匙人健在
        // if (yaoshiINFO_exists) {
        //     //如果角色人1没出现
        //     if (juesePEOPLE001.length === 2) {
        //         juesePEOPLE001 = "--省心租:" + yaoshiINFO;
        //         //如果角色人2没出现
        //     } else if (juesePEOPLE002.length === 2) {
        //         juesePEOPLE002 = "省心租:" + yaoshiINFO;
        //     }
        // }
        //如果钥匙人健在
        //如果角色人1没出现
        if (juesePEOPLE001.length === 2) {
            juesePEOPLE001 = "==省心租:" + yaoshiINFO;
            //如果角色人2没出现
        } else if (juesePEOPLE002.length === 2) {
            juesePEOPLE002 = "==省心租:" + yaoshiINFO;
        }
        //如果角色人1没出现
        if (juesePEOPLE001.length === 2) {
            juesePEOPLE001 = "---"
            //如果角色人2没出现
        }
        if (juesePEOPLE002.length === 2) {
            juesePEOPLE002 = "---888"
        }


        //加入特制的普租style
        document.querySelector("style").innerHTML += ".DaikanDIV {display: inline-block;background-color: #fff;padding: 10px;border: 2px solid #171717;height: 202px;position: fixed;top: 25%;left: 50%;transform: translateX(-50%);z-index: 99;/*overflow: hidden;*/}.DaiKanDan {width: 866px;height: 140px;/* background-color: #d01c1c; padding-top: 6px;*/padding-left: 13px;padding-right: 6px;display: flex;border-bottom: #eee 2px solid;}div.fengMian {width: 135px;}ul.infoUL {/*background-color: aqua;*/color: #1d1d1d;height: 136px;width: 555px;display: inline-block;padding-top: 0;padding-left: 12px;margin-top: 0;list-style: none;font-size: 18px;}ul.infoUL > li:nth-child(1) {color: #000;font-size: 25px;font-weight: 800;}ul.infoUL > li:nth-child(2) {margin-top: 0;position: relative;left: -2px;}ul.infoUL > li:nth-child(2) > span {padding: 0 2px;}ul.infoUL > li:nth-child(3) {padding-top: 0;}ul.infoUL > li:nth-child(4) {padding-top: 0;}ul.infoUL > li:nth-child(5) {padding-top: 5px;}ul.infoUL > li > div {/*background-color: yellow;*/display: inline-block;position: relative;/*left: 20px;*//*width: 3000px;*/}ul.infoUL > li > div > input {position: absolute;width: 206px;left: 7px;transform: translateY(-75%);border: none;/*background-color: yellow;*/}ul.infoUL > li:nth-child(1) > div > input {font-size: 24px;font-style: italic;font-weight: 500;/*background-color: yellow;*/}ul.infoUL > li:nth-child(2) > div > input {font-size: 18px;color: blue;left: -3px;}ul.infoUL > li:nth-child(3) > div > input {font-size: 18px;color: crimson;}ul.infoUL > li:nth-child(4) > div > input {font-size: 18px;color: #cdcd00;}ul.price {list-style: none;position: relative;top: -5px;color: red;line-height: 35px;}ul > li.price {font-size: 26px;font-weight: 800;}ul > li.erWM {position: relative;left: 1px;}ul > li.erWM > svg {position: relative;left: 52px;}div.okk {/*margin: auto;*/position: relative;}div.okk > button#closeInfo {font-size: 22px;width: 20%;height: 40px;position: absolute;right: -10px;bottom: -40px;/*transform: translateX(50%);*/}#houseBIANMA {position: relative;top: -19px;left: 26px;color: #000;font-size: 16px;}    "
        //加入新的body
        document.body.innerHTML += "<div class=\"DaikanDIV\">"+
            "<div style=\"background: rgba( 255, 255, 255, 0.25 );backdrop-filter: blur( 1px );-webkit-backdrop-filter: blur( 1.5px );position: fixed;top: -200px;left: -200px;height: 9999px;width: 1272px;z-index: -1;\"></div>"+
            "<hr style=\"margin-bottom: 0;\"><div class=\"DaiKanDan\"><div class=\"fengMian\"><img width=\"100%\"src=\"https://vrlab-image4.ljcdn.com/release/auto3dhd/2547e39f88748e547992a88959c6cd33/screenshot/1693644757_0/pc1_mKj3kwxf4.jpg?imageMogr2/quality/70\"alt=\"\"></div><div>" +
            "<ul class=\"infoUL\"><li>" + xiaoquNAME + "<div><input type=\"text\"></div></li><li><span>" + houseJUSHI + "</span>|<span>" + houseMIANJI + "㎡</span>|<span>" + houseCHAOXIANG + "</span>|<span>" + ruzhuTIME + "" + houseZUQI + "" + houseLOUCENG + "</span> <div><input type=\"text\"></div></li><li>" + juesePEOPLE001 + "<div><input type=\"text\"></div></li><li>" + juesePEOPLE002 + "<div><input type=\"text\"></div></li></ul></div>" +
            "<ul class=\"price\"><li class=\"price\">" + housePRICE + "元/月</li><li class=\"erWM\">" +
            "<svg id=\"svgERWEI\" width=\"80\" height=\"80\"  viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>background</title><rect fill=\"#0fffff\" id=\"canvas_background\" height=\"102\" width=\"102\" y=\"-1\" x=\"-1\"/><g display=\"none\" overflow=\"visible\" y=\"0\" x=\"0\" height=\"100%\" width=\"100%\" id=\"canvasGrid\"><rect fill=\"url(#gridpattern)\" stroke-width=\"0\" y=\"0\" x=\"0\" height=\"100%\" width=\"100%\"/></g></g><g><title>Layer 1</title><text transform=\"rotate(-45 42.81383514404296,39.558170318603516) \" opacity=\"0.75\" xml:space=\"preserve\" text-anchor=\"start\" font-family=\"Helvetica, Arial, sans-serif\" font-size=\"37\" id=\"svg_1\" y=\"52.232558\" x=\"-1.372098\" stroke-width=\"0\" stroke=\"#000\" fill=\"#000000\">OMG</text><line stroke-linecap=\"undefined\" stroke-linejoin=\"undefined\" id=\"svg_15\" y2=\"264\" x2=\"-60.5\" y1=\"239\" x1=\"-60.5\" fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"99\" stroke=\"#000\" fill=\"none\"/><text opacity=\"0.75\" transform=\"rotate(135 60.4881935119629,57.2325439453125) \" xml:space=\"preserve\" text-anchor=\"start\" font-family=\"Helvetica, Arial, sans-serif\" font-size=\"37\" id=\"svg_16\" y=\"69.906928\" x=\"16.302272\" stroke-width=\"0\" stroke=\"#000\" fill=\"#000000\">OMG</text></g></svg>" +
            "</li><div id=\"houseBIANMA\">" + houseCODE + "</div><hr style=\"position: absolute;bottom: -3px;right: -22px;\"></ul></div><div class=\"okk\"><button id=\"closeInfo\" class=\"closeInfo\" onclick=\"location.reload();for (let i = 0; i < document.getElementsByClassName('DaikanDIV').length + 1; i++) {document.getElementsByClassName('DaikanDIV')[0].remove();/*location.reload();*/}\">OK</button></div></div>"

        //找到封面图片src
        var fengmianSRC = document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.info-top--1l0J53lf > div:nth-child(1) > div > div.img-content-wrap > div.img-content > img").src
        //创建img元素
        const fengmian_DIV = document.createElement('img');
        document.querySelector("div.fengMian > img").src = fengmianSRC;

        //把房源二维码贴上去
        document.querySelector("#svgERWEI").innerHTML = "";
        document.querySelector("#svgERWEI").append(hoseERWEI_new)
        //把房源二维码贴上去
        // document.querySelector("#svgERWEI").innerHTML = (hoseERWEI_new);

        //删除工具窗口
        //document.getElementsByClassName("Panel_DIV")[0].remove()
        init()

    }


//寻找房子二维码
    var hoseERWEI = false;
    setTimeout(findERWEI, 900);

    function findERWEI() {
        console.log("寻找房源二维码函数启动")
        if (document.querySelector("#content-wrapper div.basic-info-center--1lbAhtyq > div:nth-child(4) > div.key--1n37ZimX").textContent === "楼层") {
            //获取楼层
            // //实际楼层
            // var louceng_SHIJI = document.querySelector("body > div:nth-child(10) > div > div > div > div.ant-popover-inner > div > div > div > div:nth-child(1) > div:nth-child(1)").innerHTML.split("</span>")[1]
            // //标号楼层
            // var louceng_BIAOHAO =document.querySelector("body > div:nth-child(11) > div > div > div > div.ant-popover-inner > div > div > div > div:nth-child(1) > div:nth-child(2)").innerHTML.split("</span>")[1]
            // //总楼层
            // var louceng_ZONG =document.querySelector("body > div:nth-child(11) > div > div > div > div.ant-popover-inner > div > div > div > div:nth-child(3)").innerHTML.split("</span>")[1]
            // houseLOUCENG = "|" + louceng_SHIJI+"/"+louceng_BIAOHAO+"/"+louceng_ZONG

            //获取楼层
            houseLOUCENG = "|" + document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.info-top--1l0J53lf > div.basicInfo--fraJyibi > div.basic-info-center--1lbAhtyq > div:nth-child(4) > div.value--2IW87Z5L > span").textContent
        } else {
            houseLOUCENG = "|楼层"
            console.log("楼层240验证不通过，无法点击楼层")
        }
        //点击暴露二维码
        document.querySelector("#content-wrapper div.detail-header--3vyOfIqP > div.house-code-wrap--2luvgXwV > div:nth-child(2) > div > div > span.qr-code-text--IfpdMMvm").click()
        //房源二维码出现了没有
        if (document.querySelector("div.qr-code-pic > svg") != null) {
            hoseERWEI = true
            hoseERWEI_new = document.querySelector("div.qr-code-pic > svg")
            //再次点击，关闭二维码
            document.querySelector("#content-wrapper > div.ant-spin-nested-loading > div > div > div.house-detail-main--1QRXCyqO > div.page-left--3VUyyB2E > div.detail-header--3vyOfIqP > div.house-code-wrap--2luvgXwV > div:nth-child(2) > div > div > span.qr-code-text--IfpdMMvm").click()
        }
        if (!hoseERWEI) {
            setTimeout(findERWEI, 2000)
        } else {
            console.log("找到了！！")
            document.querySelector("#Panel_DIV > button").style.backgroundColor="#ff0"
            console.log(document.querySelector("div.qr-code-pic > svg"))
        }
    }


})();
