// ==UserScript==
// @name         bigo_new_rules_tip
// @namespace    http://tampermonkey.net/
// @version      2.0.0.3
// @description  2.0.0.3版本
// @author       zhangchun
// @match        https://global-oss.zmqdez.com/front_end/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403323/bigo_new_rules_tip.user.js
// @updateURL https://update.greasyfork.org/scripts/403323/bigo_new_rules_tip.meta.js
// ==/UserScript==


(function () {
    var timer;
    timer = setInterval(function () {
        var oldTips = this.document.querySelector(".custom-msg");
        if (oldTips) {
            oldTips.style.display = "none";
        }
    }, 100);
})();

(function () {
    function creatNewElement(childElementName, childElementid, childElementText, styleArry, fatherElement) {
        /*
        功能：快速创建新的元素，并设置相关样式

        childElementName,要创建的元素名（参数类型：字符串）
        childElementid,要创建的元素id（参数类型：字符串）
        childElementTextAryy,要创建的元素文字内容（参数类型：字符串）
        styleArry,要创建的元素样式（参数类型：数组）
        fatherElement,父亲元素，用来容纳新创建的元素（参数类型：对象类型）
        */
        var childElement = document.createElement(childElementName);//创建新的元素
        childElement.id = childElementid;
        childElement.innerText = childElementText;
        childElement.style.cssText = styleArry.join(";");
        fatherElement.appendChild(childElement);//将新添加的元素加入父元素中
        return
    }


    var BigoRulesConfig = {
        //标准版
        "standard":
        {
            country: ["标准版", 'Other'],
            rules: "<div style='font-size:20px'><strong>《标准版》</strong></div><span>7月21日更新，有需要提醒的规则请反馈至组长</span>",
            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: green;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"
        },
        //偏严版
        "slight_strict":
        {
            country: ["偏严版", "IN", "TR", "CN", "TW", "HK", "MO", "SG", "AU", "NZ", "MY", "BN"],
            rules: "<div  style='font-size:20px'><strong>《偏严版》</strong></div><span>7月21日更新，有需要提醒的规则请反馈至组长</span>",
            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:yellow;font-size:15px;display:block;text-align: center;opacity: 1;border-radius:25px;font-color:black;"
        },
        //严格版
        "strict":
        {
            country: ["AE", "SA", "KW", "LB", "IQ", "PS", "JO", "YE", "OM", "SY", "QA", "BH", "EG", "SD", "LY", "TN", "DZ", "MA", "SO", "IR", "IL", "MR", "DJ", "KM","PK","BD"],
            rules: "<div  style='font-size:20px'><strong>《严格版》</strong></div><span>7月21日更新，有需要提醒的规则请反馈至组长</span>",
            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: red;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"
        },

        "JP_KR_rule":
        {
            country: ["日韩特殊规则", "JP", "KR"],
            rules: "<div  style='font-size:20px;line-height:20px'><strong>1.日韩规则尺度较特殊，请谨慎处理</strong></br></br><strong>2.摸下体/抓摸胸：需明确判断是故意性质（结合上下图），无意则忽略</strong></div>",
            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: pink;font-size:15px;display:block;text-align: center;color:#800080;opacity: 0.8;border-radius:25px;"
        },



        "setRules": function (countryCode) {
            if (BigoRulesConfig.strict.country.includes(countryCode)) {
                //严格版
                document.getElementById("tip").innerHTML = BigoRulesConfig.strict.rules;
                document.getElementById("tip").style.cssText = BigoRulesConfig.strict.style;
            }
            else if (BigoRulesConfig.slight_strict.country.includes(countryCode)) {
                //偏严版
                document.getElementById("tip").innerHTML = BigoRulesConfig.slight_strict.rules;
                document.getElementById("tip").style.cssText = BigoRulesConfig.slight_strict.style;

            }
            else if (BigoRulesConfig.JP_KR_rule.country.includes(countryCode)) {
                //日韩
                document.getElementById("tip").innerHTML = BigoRulesConfig.JP_KR_rule.rules;
                document.getElementById("tip").style.cssText = BigoRulesConfig.JP_KR_rule.style;
            }
            else {
                //标准版
                document.getElementById("tip").innerHTML = BigoRulesConfig.standard.rules;
                document.getElementById("tip").style.cssText = BigoRulesConfig.standard.style;
            }

        }
    }

    function Business(countryNode, index) {
        this.countryNode = countryNode;//国家码对应的节点名称（字符串）
        this.index = index;//国家码对应的节点名称索引（字符串）
        this.getCountryCodeRun = function (countryNode) {
            var timerr = null;
            var country = null;
            var countryCode = null;
            timerr = setInterval(function () {

                if (document.querySelectorAll("." + countryNode).length > 0) {

                    try {
                        country = document.querySelectorAll("." + countryNode)[0].innerText;
                        countryCode = country.slice(3, 5);
                        BigoRulesConfig.setRules(countryCode);
                        // console.log(countryCode);
                        clearInterval(timerr);


                        // country = document.getElementsByClassName(countryNode);
                        // countryCode = country[index].innerText;
                        // console.log(countryCode);
                        // clearInterval(timerr);

                    } catch (error) {
                        // country = document.getElementsByClassName(countryNode);
                        // countryCode = country[index].innerText;
                        // console.log(countryCode);
                        // clearInterval(timerr);
                    }

                }

            }, 100);
            return 0;
        }
    }

    var BusinessCofig = {
        //可扩展业务
        "firstCheck": { "titleName": "直播初审", "countryNode": "ant-row>div:nth-child(1)>p" },
        "finalReview": { "titleName": "终审审核", "countryNode": "final-user-detail-wrapper>p:nth-child(6)" }
    }



    //----------------以上都是配置--------------
    var timer = null;
    var title = null;

    creatNewElement("div", 'tip', '文字', [], document.body);
    timer = setInterval(
        function () {
            try {
                if (document.querySelectorAll(".ant-breadcrumb-link>span")[0] && document.querySelectorAll(".ant-card-body>button")[4].innerText == "退出审核") {
                    title = document.querySelectorAll(".ant-breadcrumb-link>span")[0].innerText;
                    switch (title) {
                        case "直播初审":
                            var Bigofirst = new Business(BusinessCofig.firstCheck.countryNode, BusinessCofig.firstCheck.index);
                            Bigofirst.getCountryCodeRun(BusinessCofig.firstCheck.countryNode, BusinessCofig.firstCheck.index);
                            break;
                        case "终审审核":
                            var Bigofinal = new Business(BusinessCofig.finalReview.countryNode, BusinessCofig.finalReview.index);
                            Bigofinal.getCountryCodeRun(BusinessCofig.finalReview.countryNode, BusinessCofig.finalReview.index);
                            break;

                        default:
                            break;
                    }

                }
                else {
                    document.getElementById("tip").style.cssText = "display:none";
                }
            } catch (error) {

            }
        }, 100);
})();