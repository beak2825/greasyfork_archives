// ==UserScript==
// @name         Inspection_rule_tips
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/index*
// @match        https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/push-new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414972/Inspection_rule_tips.user.js
// @updateURL https://update.greasyfork.org/scripts/414972/Inspection_rule_tips.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let timer = null;
    let country = null;
    let ruleConfig = {
        //国家码对应规则配置
        "BR": [
            "第一行是最新规则", 
            "特殊规则1", 
            "特殊规则2"
            ],
        "US": [
            "美国的最新规则1", 
            "特殊规则1", 
            "特殊规则2"
        ]
        
    }


    //功能：创建DOM，并设置id、innerText、css
    function creatNewEle(eleName, id, text, style, fatherEle) {
        //功能：创建DOM，并设置id、innerText、css
        let ele = document.createElement(eleName);
        ele.id = id;
        ele.innerText = text;
        ele.style.cssText = style.join(";");
        fatherEle.appendChild(ele);
    }

    //功能：检查元素是否存在，存在返回true，不存在返回false
    function checkDom(domSelect, index) {
        //功能：检查元素是否存在，存在返回true，不存在返回false
        //例如#show-detail-modal-ifr

        let result = false;

        try {
            if (document.querySelectorAll(domSelect)[index]) {
                result = true;
            }
        } catch (error) {
            console.log("警告：当前页面无此元素");
        }

        return result;
    }

    //功能：创建一个规则提示区域，并在区域里面创建三个div，用作规则提示
    function ruleAreaCreat(select, index) {

        //功能：创建一个规则提示区域，并在区域里面创建三个div，用作规则提示
        if (checkDom(select, index) == true) {

            console.log("iframe的父元素存在");

            //添加规则提示区域

            let mainDom = document.querySelectorAll(select)[index]
            let rulrArea_style = [
                "width: 100%",
                "height: 100px",
                "border: 1px solid black",
                "background-color:white",
                "margin-top: 5px",
            ];
            creatNewEle("div", "rule-area", "", rulrArea_style, mainDom);

            //在规则区域内添加三个div元素

            let ruleArea = document.querySelector("#rule-area");
            let rule_style = [
                "width:60%",
                "margin:0 auto",
                "font-size:25px",
                "font-weight:bolder",
                "text-align:center"
            ];
            for (let i = 0; i < 3; i++) {
                creatNewEle("div", "new_rule" + i, "", rule_style, ruleArea);
            }
            document.querySelector("#new_rule0").style.color = "red";
        }

    }

    //功能：获取iframe网页中的国家码，获取成功则返回国家码，不成功则返回"未成功获取国家码"
    function getCountryCode(select, index, ifr_id) {
        //功能：获取iframe网页中的国家码，获取成功则返回国家码，不成功则返回"未成功获取国家码"
        //参数：select:iframe的父元素的css选择器，字符串；
        //     index:索引
        //     ifr_id:iframe的id
        let ifr = "";
        let ifr_doc_country = "";
        let result = null;
        try {
            ifr = document.querySelectorAll(select)[index].querySelector(ifr_id).contentWindow;
            ifr_doc_country = ifr.document.querySelector(".feed-video>.row>div:nth-child(2)").innerText;

        } catch (error) {
            // console.log("iframe网页还未打开");
        }
        if (ifr_doc_country === null || ifr_doc_country == "") {
            ifr_doc_country = "未成功获取国家码";
        }
        result = ifr_doc_country;
        return result;
    }

    //1.脚本开始（完成）
    //2.检查业务类型：巡查业务/告警推送,确定要选中的iframe父元素的CSS选择器（完成）在选中的iframe父元素中生成规则提示区域，并在提示区域内增加三个div，id分别为new_rule0，new_rule1，new_rule2
    //3.(完成)
    //4.获取父元素的iframe中的网页（）中的国家码，并匹配国家码对应的规则，并更改3中的三个div的innerHtml---定时器(基本完成，待实际数据)




    let dom = (function () {
        let select = null;
        let ifr_id = null;
        let index = 0;
        //判断业务类型，要选中的iframe父元素的css选择器和index，并生成相应的dom和css样式；
        switch (document.location.href) {
            case "https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/index?app_id=60&level_start=&level_end=&count_start=&count_end=&uid=&people_start=&people_end=&live_start=&live_end=&impeach_start=&impeach_end=&user_nickname=&live_title="://巡查业务
                select = "div[id='show-detail-modal']>.modal-dialog>.modal-content>.modal-body";
                index = 0;
                ifr_id = "#show-detail-modal-ifr";
                console.log("这是巡查业务");
                ruleAreaCreat(select, index)
                break;

            case "https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/push-new":
                select = "div[id='push-new-modal']>.modal-dialog>.modal-content>.modal-body";//告警业务
                index = 0;
                ifr_id = "#push-new-modal-ifr";
                console.log("这是告警业务");
                ruleAreaCreat(select, index)
                break;

            default:
                break;
        }

        return [select, index, ifr_id];
    })();

    let ruleArea_dom = document.querySelector("#rule-area");
    let rule_0_dom = document.querySelector("#new_rule0");
    let rule_1_dom = document.querySelector("#new_rule1");
    let rule_2_dom = document.querySelector("#new_rule2");


    timer = setInterval(function () {
        country = getCountryCode(dom[0], dom[1], dom[2]);
        // console.log(country);
        if (country != "未成功获取国家码" && country in ruleConfig) {
            console.log("当前国家码：" + country);
            rule_0_dom.innerHTML = ruleConfig[country][0];
            rule_1_dom.innerHTML = ruleConfig[country][1];
            rule_2_dom.innerHTML = ruleConfig[country][2];
        }
        else{
            rule_0_dom.innerHTML = "";
            rule_1_dom.innerHTML = "";
            rule_2_dom.innerHTML = "";
        }

    }, 1000);



})();