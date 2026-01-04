// ==UserScript==
// @name         链家普租带看单生成2.43
// @version      2.43
// @description  普租房子查看页面，把信息加工出来
// @author       链家员工
// @match        https://lease-pz.link.lianjia.com/rent/house/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/1360117
// @downloadURL https://update.greasyfork.org/scripts/506607/%E9%93%BE%E5%AE%B6%E6%99%AE%E7%A7%9F%E5%B8%A6%E7%9C%8B%E5%8D%95%E7%94%9F%E6%88%90243.user.js
// @updateURL https://update.greasyfork.org/scripts/506607/%E9%93%BE%E5%AE%B6%E6%99%AE%E7%A7%9F%E5%B8%A6%E7%9C%8B%E5%8D%95%E7%94%9F%E6%88%90243.meta.js
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
        Panel_DIV.style.padding = '6px 10px'; // 修改内边距
        Panel_DIV.style.color = 'white';
        Panel_DIV.style.fontSize = '11px';
        Panel_DIV.style.textAlign = 'center';
        Panel_DIV.style.zIndex = '9999';
        Panel_DIV.style.width = '105px'; // 设置宽度
        //Panel_DIV.style.height = '250px'; // 设置高度

        Panel_DIV.innerHTML = '普租带看单生成';

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

    //有没有维护人，维护人是否存在
    var weihuPEOPLE_exists = false
    //维护人
    var weihuPEOPLE = "维护人是谁啊"
    //维护人门店
    var weihuPEOPLE_mendian = "维护人哪个店的啊"

    //有没有钥匙人，钥匙人是否存在
    var yaoshiPEOPLE_exists = false
    //钥匙人
    var yaoshiPEOPLE = "钥匙人是谁啊"
    //钥匙人门店
    var yaoshiPEOPLE_mendian = "钥匙人哪个店的啊"

    //录入人
    var luruPEOPLE = "录入人是谁啊"
    //录入人门店
    var luruPEOPLE_mendian = "录入人哪个店的啊"

    //两个角色人信息
    var juesePEOPLE001 = "张三";
    var juesePEOPLE002 = "李四";
    var svgERWEI = document.createElement("svg")
    svgERWEI.innerHTML = '<svg id="svgERWEI" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>background</title><rect fill="#0fffff" id="canvas_background" height="102" width="102" y="-1" x="-1"/><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g></g><g><title>Layer 1</title><text transform="rotate(-45 42.81383514404296,39.558170318603516) " opacity="0.75" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="37" id="svg_1" y="52.232558" x="-1.372098" stroke-width="0" stroke="#000" fill="#000000">OMG</text><line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_15" y2="264" x2="-60.5" y1="239" x1="-60.5" fill-opacity="null" stroke-opacity="null" stroke-width="99" stroke="#000" fill="none"/><text opacity="0.75" transform="rotate(135 60.4881935119629,57.2325439453125) " xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="37" id="svg_16" y="69.906928" x="16.302272" stroke-width="0" stroke="#000" fill="#000000">OMG</text></g></svg>'
    var hoseERWEI_new = document.createElement("svg")


//单击"生成"按钮触发这个函数
    function puzuDAIKAN() {
        //获取各种参数
        //小区名称
        xiaoquNAME = document.querySelector("#leaseroot span.title").innerHTML.split("<")[0]
        //居室
        houseJUSHI = document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner.inner-desc-center>div:nth-child(1)>div:nth-child(2)").textContent
        //面积
        houseMIANJI = document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner.inner-desc-center>div:nth-child(2)>div:nth-child(2)").innerHTML.split(" ")[0]
        //朝向
        houseCHAOXIANG = document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner.inner-desc-center>div:nth-child(3)>div:nth-child(2)").textContent
        //入住时间
        ruzhuTIME = document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner-form-bottom > div > div:nth-child(5)").innerHTML.split("</span>")[1]
        //租期要求
        houseZUQI = "|" + document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner-form-bottom > div > div:nth-child(7)").innerHTML.split("</span>")[1]
        //如果租期要求为空
        if (houseZUQI === "-") {
            houseZUQI = "";
        }
        //获取楼层
        if (document.querySelector("#leaseroot div.page-header-part > div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.key").textContent === "楼层") {
            if (document.querySelector("#leaseroot  div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span > span.floor-number") !== null) {
                houseLOUCENG = "|" + document.querySelector("#leaseroot  div.page-header-part > div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span").textContent
            } else {
                console.log("楼层129验证不通过，无法点击楼层")
            }
        } else {
            console.log("楼层132验证不通过，无法点击楼层")
        }
        //价格
        housePRICE = document.querySelector("#leaseroot div.price").textContent
        //房源编号
        houseCODE = document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div.house-detail-main > div.left-detail > div.header.flex.align-items > div > span").textContent.split("：")[1]

        //有没有维护人，维护人是否存在
        weihuPEOPLE_exists = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(2) > div >div").childElementCount === 2
        console.log("维护人存在？")
        if (weihuPEOPLE_exists) {
            //维护人
            weihuPEOPLE = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(2) > div> div > div.name").textContent
            console.log("维护人姓名：" + weihuPEOPLE)
            console.log(weihuPEOPLE.length)
            //维护人门店
            weihuPEOPLE_mendian = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(2) > div >div span.cct-ellipsis").textContent
        }

        //有没有钥匙人，钥匙人是否存在
        yaoshiPEOPLE_exists = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(3) > div >div").childElementCount === 2
        if (yaoshiPEOPLE_exists) {
            //钥匙人
            yaoshiPEOPLE = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(3) > div > div > div.name").textContent
            //钥匙人门店
            yaoshiPEOPLE_mendian = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(3) > div >div span.cct-ellipsis").textContent
        }

        //录入人
        luruPEOPLE = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(1) > div> div > div.name").textContent
        //录入人门店
        luruPEOPLE_mendian = document.querySelector("#leaseroot div.ant-collapse-content.ant-collapse-content-active > div > div > div:nth-child(1) > div >div span.cct-ellipsis").textContent

        //处理角色人信息
        //如果维护人健在
        console.log("维护人在吗？")
        console.log(weihuPEOPLE_exists)
        if (weihuPEOPLE_exists) {
            // // console.log("维护人:" + weihuPEOPLE + "(" + weihuPEOPLE_mendian + ")")
            juesePEOPLE001 = "维护人:" + weihuPEOPLE;
            // juesePEOPLE001 = "维护人:" + weihuPEOPLE + "(" + weihuPEOPLE_mendian + ")"
        }
        //如果钥匙人健在
        if (yaoshiPEOPLE_exists) {
            //如果角色人1没出现
            if (juesePEOPLE001.length === 2) {
                juesePEOPLE001 = "--钥匙人:" + yaoshiPEOPLE;
                // juesePEOPLE001 = "--钥匙人:" + yaoshiPEOPLE + "(" + weihuPEOPLE_mendian + ")"
                //如果角色人2没出现
            } else if (juesePEOPLE002.length === 2) {
                juesePEOPLE002 = "--钥匙人:" + yaoshiPEOPLE;
                // juesePEOPLE002 = "--钥匙人:" + yaoshiPEOPLE + "(" + weihuPEOPLE_mendian + ")"
            }
        }
        //如果角色人1没出现
        if (juesePEOPLE001.length === 2) {
            juesePEOPLE001 = "录入人:" + luruPEOPLE;
            // juesePEOPLE001 = "录入人:" + luruPEOPLE + "(" + luruPEOPLE_mendian + ")"
            //如果角色人2没出现
        } else if (juesePEOPLE002.length === 2) {
            juesePEOPLE002 = "录入人:" + luruPEOPLE;
            // juesePEOPLE002 = "录入人:" + luruPEOPLE + "(" + luruPEOPLE_mendian + ")"
        }
        //如果角色人1没出现
        if (juesePEOPLE001.length === 2) {
            juesePEOPLE001 = "---"
            //如果角色人2没出现
        }
        if (juesePEOPLE002.length === 2) {
            juesePEOPLE002 = "---"
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
        var fengmianSRC = document.querySelector("#leaseroot div.img-ImgDesc > div.left.pr > div > div.img-content-wrap > div.img-content > img:nth-child(1)").src
        //创建img元素
        const fengmian_DIV = document.createElement('img');
        document.querySelector("div.fengMian > img").src = fengmianSRC;

        //把房源二维码贴上去
        document.querySelector("#svgERWEI").innerHTML = "";
        // document.querySelector("#svgERWEI").append(document.querySelector("body > div:nth-child(10) > div > div > div > div.ant-popover-inner > div > div > svg"))
        document.querySelector("#svgERWEI").append(hoseERWEI_new)

        //删除工具窗口
        //document.getElementsByClassName("Panel_DIV")[0].remove()
        init()

    }


//寻找房子二维码
    var hoseERWEI = false;
    setTimeout(findERWEI, 900);

    function findERWEI() {
        console.log("寻找房源二维码函数启动")
        if (document.querySelector("#leaseroot div.page-header-part > div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.key").textContent === "楼层") {
            if (document.querySelector("#leaseroot div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span > span") !== null) {
                //获取楼层
                document.querySelector("#leaseroot div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span > span").click()
            } else {
                console.log("楼层238验证不通过，无法点击楼层")
            }
            /*if (document.querySelector("#leaseroot div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span > span.S-txt-theme.cursorP") !== null) {
                //获取楼层
                document.querySelector("#leaseroot div.img-ImgDesc > div.right > div > div.inner.inner-desc-center > div.col.col-4 > div.value.floor > span > span.S-txt-theme.cursorP").click()
            } else {
                console.log("楼层238验证不通过，无法点击楼层")
            }*/
        } else {
            console.log("楼层240验证不通过，无法点击楼层")
        }
        //点击暴露二维码
        document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div.house-detail-main > div.left-detail > div.header.flex.align-items > div > div").click()
        //房源二维码出现了没有
        if (document.querySelector("div.ant-popover-inner-content>svg") != null) {
        //if (document.querySelector("body > div:nth-child(10) > div > div > div > div.ant-popover-inner > div > div > svg") != null) {
            hoseERWEI = true
            hoseERWEI_new = document.querySelector("div.ant-popover-inner-content>svg")
            //再次点击，关闭二维码
            document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div.house-detail-main > div.left-detail > div.header.flex.align-items > div > div").click()
            document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div.house-detail-main > div.left-detail > div.header.flex.align-items > div > div").click()
        }else{
              console.log("二维码不在271")
        }
        if (!hoseERWEI) {
            setTimeout(findERWEI, 2000)
        } else {
            console.log("找到了！！")
            document.querySelector("#Panel_DIV > button").style.backgroundColor="#ff0"
            console.log(document.querySelector("div.ant-popover-inner-content>svg"))
        }
    }


})();
