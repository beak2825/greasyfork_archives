// ==UserScript==



// @name         bigo_new_rules_tip



// @namespace    http://tampermonkey.net/



// @version      2.0.0.7



// @description  2.0.0.7版本



// @author       zhangchun



// @match        https://global-oss.zmqdez.com/front_end/index.html*



// @grant        none



// @downloadURL https://update.greasyfork.org/scripts/418902/bigo_new_rules_tip.user.js
// @updateURL https://update.greasyfork.org/scripts/418902/bigo_new_rules_tip.meta.js
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



            rules: "<div style='font-size:20px'><strong>《标准版》</strong></div><span>12月12，大部分推荐降权，印尼泰国男性聚焦/揉捏乳头警告</strong></br><strong>聚焦下体泰国警告</span>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: green;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"



        },



        //偏严版



        "slight_strict":



        {



            country: ["偏严版", "IN", "TR", "CN", "TW", "HK", "MO", "SG", "AU", "NZ", "MY", "BN"],



            rules: "<div  style='font-size:20px'><strong>《偏严版》</strong></div><span>12月12日更新，赤膊澳新不处罚</span>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color:yellow;font-size:15px;display:block;text-align: center;opacity: 1;border-radius:25px;font-color:black;"



        },



        //严格版



        "strict":



        {



            country: ["AE", "SA", "KW", "LB", "IQ", "PS", "JO", "YE", "OM", "SY", "QA", "BH", "EG", "SD", "LY", "TN", "DZ", "MA", "SO", "IR", "IL", "MR", "DJ", "KM","PK","BD"],



            rules: "<div  style='font-size:20px'><strong>《严格版》</strong></div><span>12月12日更新</span>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: red;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"



        },







        "JP_KR_rule":



        {



            country: ["日韩特殊规则", "JP", "KR"],



            rules: "<div  style='font-size:20px;line-height:20px'><strong>1.日韩规则尺度较特殊，请谨慎处理，日本赤膊推荐降权</strong></br></br><strong>2.摸下体/抓摸胸：需明确判断是故意性质（结合上下图），无意则忽略</strong></div>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: pink;font-size:15px;display:block;text-align: center;color:#800080;opacity: 0.8;border-radius:25px;"



        },







        "MX_AR_CO_BO_CL_DO_EC_SV_HN_NI_PA_PE_ES_UY_PR_BR_US_CA_NP_GB_CU_PT_rule":



        {



            country: ["拉美区", "MX", "AR", "CO", "BO", "CL", "DO", "EC", "EC", "SV", "GT", "HN", "NI", "PA", "PY", "PE", "ES", "UY", "VE", "PR", "BR","US","CA","NP","GB","CU","PT"],



            rules: "<div  style='font-size:20px;line-height:20px'><strong>标准版，热门降权</strong></br></br><strong>US赤膊警告</strong></div>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: blue;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"



        },







        "DE_CH_AT_FR_BE_rule":



        {



            country: ["北欧区挂机", "DE", "CH", "AT", "FR", "BE"],



            rules: "<div  style='font-size:20px;line-height:20px'><strong>挂机警告，签约B，德国，瑞士，奥地利，法国，比利时推荐降权</strong></div>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: violet;font-size:15px;display:block;text-align: center;color:black;opacity: 0.8;border-radius:25px;"



        },






                "ZA_NG_rule":



        {



            country: ["南非，尼日利亚赤膊B", "ZA", "NG"],



            rules: "<div  style='font-size:20px;line-height:20px'><strong>南非，尼日利亚赤膊B，ZA,NG</strong></div>",



            style: "width:700px;height:85px;position:absolute;top:50px;left:550px;background-color: black;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"



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



            else if (BigoRulesConfig.MX_AR_CO_BO_CL_DO_EC_SV_HN_NI_PA_PE_ES_UY_PR_BR_US_CA_NP_GB_CU_PT_rule.country.includes(countryCode)) {



                //拉美区



                document.getElementById("tip").innerHTML = BigoRulesConfig.MX_AR_CO_BO_CL_DO_EC_SV_HN_NI_PA_PE_ES_UY_PR_BR_US_CA_NP_GB_CU_PT_rule.rules;



                document.getElementById("tip").style.cssText = BigoRulesConfig.MX_AR_CO_BO_CL_DO_EC_SV_HN_NI_PA_PE_ES_UY_PR_BR_US_CA_NP_GB_CU_PT_rule.style;



            }





             else if (BigoRulesConfig.DE_CH_AT_FR_BE_rule.country.includes(countryCode)) {



                //北欧区挂机



                document.getElementById("tip").innerHTML = BigoRulesConfig.DE_CH_AT_FR_BE_rule.rules;



                document.getElementById("tip").style.cssText = BigoRulesConfig.DE_CH_AT_FR_BE_rule.style;






            }


             else if (BigoRulesConfig.ZA_NG_rule.country.includes(countryCode)) {



                //南非，尼日利亚赤膊B



                document.getElementById("tip").innerHTML = BigoRulesConfig.ZA_NG_rule.rules;



                document.getElementById("tip").style.cssText = BigoRulesConfig.ZA_NG_rule.style;



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
