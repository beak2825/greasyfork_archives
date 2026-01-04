// ==UserScript==
// @name 万方教务网查看学分和平均绩点
// @namespace http://tampermonkey.net/
// @version 2.0
// @description 万方教务网查看单个学期的学分和平均绩点
// @compatible chrome
// @include *.edu.cn/kbcx/xskbqr_cxXskbqrIndex.html*
// @include *.edu.cn/cjcx/cjcx_cxDgXscj.html*
// @include *.edu.cn/js/plugins/pdfjs/generic/web/viewer.htm*
// @license MIT
// @require https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436894/%E4%B8%87%E6%96%B9%E6%95%99%E5%8A%A1%E7%BD%91%E6%9F%A5%E7%9C%8B%E5%AD%A6%E5%88%86%E5%92%8C%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436894/%E4%B8%87%E6%96%B9%E6%95%99%E5%8A%A1%E7%BD%91%E6%9F%A5%E7%9C%8B%E5%AD%A6%E5%88%86%E5%92%8C%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9.meta.js
// ==/UserScript==

(function () {
    $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                console.clear();
                let url = window.location.href;

                if(url.indexOf("js/plugins/pdfjs/generic/web/viewer") != -1){
                    let $td = $(".textLayer").children();
                    let XueQi = [];
                    let n = 1;
                    let text = null;
                    let XueFen = 0;
                    let ChengJi = 0;
                    let JiDian = 0;
                    let sumXF;
                    let sumXFJD;
                    let AllXF = 0;
                    let AllXFJD = 0;
                    let XnXf=0;
                    let XnXfJd=0;
                    for (let i = 0; i < $td.length; i++) {
                        text = $td.eq(i).text().trim();
                        if (text.indexOf("学期") !== -1 || text.indexOf("白") !== -1) {
                            XueQi[n] = i;
                            n++;
                        }
                    }
                    for (let i = 1; i < n-1; i++) {
                        console.log("\n-----" + $td.eq(XueQi[i]).text().trim() + "-----");
                        sumXF = 0;
                        sumXFJD = 0;
                        for (let j = XueQi[i] + 2; j < XueQi[i + 1]; j += 4) {
                            XueFen = parseFloat($td.eq(j).text().trim());
                            if (isNaN(XueFen)) {
                                j += 6;
                                XueFen = parseFloat($td.eq(j).text());
                            }
                            ChengJi = $td.eq(j + 1).text().trim();
                            JiDian = GetJiDian(ChengJi);
                            sumXF += XueFen;
                            sumXFJD += XueFen * JiDian;
                        }
                        console.log("总学分：" + sumXF + "\t总学分绩点" + decimal(sumXFJD,2) + "\t平均学分绩点：" + decimal((sumXFJD / sumXF),2));
                        AllXF += sumXF;
                        AllXFJD += sumXFJD;

                        XnXf += sumXF;
                        XnXfJd += sumXFJD;
                        if(i%2==0){
                            console.log("\n-----大"+(i/2)+ "   平均学分绩点：" + decimal((XnXfJd / XnXf),2)+"-----");
                            console.log("\n");
                            XnXf=0;
                            XnXfJd=0;
                        }
                    }

                    console.log("\n")
                    console.log(n - 2 + "个学期\t总学分：" + AllXF + "\t平均学分绩点：" + decimal((AllXFJD / AllXF),2));

                }else{
                    if($("#sp_1_pager").text()!=1){
                        alert("当前表格为"+$("#sp_1_pager").text()+"页，请增加列数，使表格只有一页");
                        console.log("当前表格为"+$("#sp_1_pager").text()+"页，请增加列数，使表格只有一页");
                    }else{
                        let text="";
                        let xn=$("#xnm_chosen").find("span").text();
                        let xq=$("#xqm_chosen").find("span").text();
                        text+="第" + xn+"学年 第"+xq+"学期\n";
                        console.log("第" + xn+"学年 第"+xq+"学期");
                        if(url.indexOf("kbcx/xskbqr_cxXskbqrIndex") != -1){
                            let $td_xf = $("td[aria-describedby='tabGrid_xf']");
                            let sum = 0;
                            for (let i = 0; i < $td_xf.length; i++) {
                                let xf = $td_xf.eq(i).attr("title");
                                sum += parseFloat(xf);
                            }
                            alert(text+"总学分：" + sum);
                            console.log("总学分：" + sum);
                        }else{
                            let $td_XF = $("td[aria-describedby='tabGrid_xf']");
                            let $td_JD = $("td[aria-describedby='tabGrid_jd']");
                            let Sum_XF = 0;
                            let Sum_XFJD = 0;
                            for (let i = 0; i < $td_XF.length; i++) {
                                Sum_XF+=parseFloat($td_XF.eq(i).text());
                                Sum_XFJD+=parseFloat($td_XF.eq(i).text())*parseFloat($td_JD.eq(i).text());
                            }
                            alert(text+"平均学分绩点："+decimal((Sum_XFJD/Sum_XF),2));
                            console.log("平均学分绩点："+decimal((Sum_XFJD/Sum_XF),2));
                        }
                    }
                }
            }

        });

    function GetJiDian(CJ) {
                        let grade;
                        let JD = 0;
                        switch (CJ) {
                            case "优秀":
                                grade = 95;
                                break;
                            case "良好":
                                grade = 85;
                                break;
                            case "中等":
                                grade = 75;
                                break;
                            case "及格":
                                grade = 65;
                                break;
                            default:
                                grade = decimal(CJ,0);
                        }
                        JD += (grade % 10) / 10;
                        grade /= 10;
                        switch (parseInt(grade)) {
                            case 10:
                                JD = 5;
                                break;
                            case 9:
                                JD += 4;
                                break;
                            case 8:
                                JD += 3;
                                break;
                            case 7:
                                JD += 2;
                                break;
                            case 6:
                                JD += 1;
                                break;
                            default:
                                JD = 0;
                        }
                        return JD;
                    }
    function decimal(num,v){
        let vv = Math.pow(10,v);
        return Math.round(num*vv)/vv;
    }
})();