// ==UserScript==
// @name         SpecialUser
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  1.01
// @author       zhangchun
// @match        https://global-oss.zmqdez.com/front_end/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407491/SpecialUser.user.js
// @updateURL https://update.greasyfork.org/scripts/407491/SpecialUser.meta.js
// ==/UserScript==

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


    var timer;
    var uid;
    var btnDisplay = 0;
    var punishBtn;
    var punishBtnLen;
    var SpeicalUser = {
        //币商
        "cash":
        {
            uid: ["1515212164",
                "1746261122",
                "1886272857",
                "1859792999",
                "1802262553",
                "1842209742",
                "30017",
                "1786251638",
                "431647691",
                "1556149150",
                "1633431337",
                "30001",
                "1750070182",
                "1847530133",
                "1830836317",
                "30020",
                "1834211171",
                "1695887829",
                "1549697972",
                "1701291960",
                "1514779902",
                "1845679559",
                "1575305382",
                "1656051607",
                "1575177343",
                "1633278929",
                "1747642254",
                "1794528845",
                "427861940",
                "1809568337",
                "1826349714",
                "1667599877",
                "1869359140",
                "1542295670",
                "1617284231",
                "441055458",
                "1762061254",
                "1519781332",
                "1669099811",
                "1680272091",
                "30004",
                "1542178311",
                "1808397913",
                "1829592562",
                "426451312",
                "1835143733",
                "1863219844",
                "1888716147",
                "1780399911",
                "30026",
                "1622568423",
                "30027",
                "1696311777",
                "1887353059",
                "1786174928",
                "441556200",
                "30014",
                "423131112",
                "1569355579",
                "1852609540",
                "1757594037",
                "1866359432",
                "1571005190",
                "1687019167",
                "30009",
                "1836387009",
                "1661545985",
                "1866887919",
                "424913547",
                "1812729501",
                "1867671778",
                "1515075094",
                "1548987587",
                "30021",
                "1840660755",
                "413925800",
                "1503840878",
                "1590463280",
                "1579004657",
                "1596120550",
                "1869447908",
                "1830836317",
                "1630940654",
                "1552522413",
                "1748498244",
                "1831062231",
                "1580001711",
                "1559521862",
                "1792042509",
                "30025",
                "1606096975",
                "30002",
                "1733598057",
                "1840646536",
                "1768792939",
                "1868832299",
                "1698759557",
                "1745558643",
                "401790652",
                "30022",
                "422590157",
                "1745848842",
                "1798246685",
                "1639156185",
                "1748761852",
                "30024",
                "30013",
                "437650445",
                "1709345140",
                "402166232",
                "1601513103",
                "30003",
                "30011",
                "1709797995",
                "1743026981",
                "1867694300",
                "1745664338",
                "1581685259",
                "417588679",
                "30019",
                "411387327",
                "1834317503",
                "30018",
                "413900153",
                "1855060137",
                "1814361907",
                "30007",
                "1827986356",
                "1792096885",
                "30005",
                "30010",
                "30023",
                "1828901428",
                "1561613072"
            ],
            rules: "<div style='font-size:20px'></div><span>该用户为币商，请勿封禁</span>",
            style: "width:200px;height:35px;line-height:35px;position:absolute;top:300px;left:1000px;background-color: orange;font-size:15px;display:block;text-align: center;color:white;opacity: 0.8;border-radius:25px;"
        },



        "setTips": function (uid) {
            var result = 0;
            if (SpeicalUser.cash.uid.includes(uid)) {
                //币商
                result = 1;
                document.getElementById("tip").innerHTML = SpeicalUser.cash.rules;
                document.getElementById("tip").style.cssText = SpeicalUser.cash.style;
            }
            else {
                //普通用户
                result = 0;
                document.getElementById("tip").style.cssText = "display:none;";
            }
            return result;

        }
    }





    creatNewElement("div", 'tip', '文字', [], document.body);
    timer = setInterval(function () {
        try {

            if (document.querySelector(".ant-btn-danger").innerText == "停止审核" && document.querySelector(".ant-select-selection-selected-value").innerText == "bigolive" && document.querySelector(".ant-breadcrumb-link>span").innerText == "内容审核后台") {
                uid = document.querySelector(".profile-meta>p:nth-child(3)>a").innerText;
                btnDisplay = SpeicalUser.setTips(uid);
                punishBtn = document.querySelectorAll(".operation-btns>button");
                punishBtnLen = punishBtn.length;
                if (btnDisplayvar == 1) {
                    for (var i = 0; i < punishBtnLen - 1; i++) {
                        punishBtn[i + 1].style.display = "none";
                    }
                } else {
                    for (var j = 0; j < punishBtnLen - 1; j++) {
                        punishBtn[i + j].style.display = "block";
                    }
                }


            }

        } catch (error) {
            document.getElementById("tip").style.cssText = "display:none;";
        }

    }, 100);

})();