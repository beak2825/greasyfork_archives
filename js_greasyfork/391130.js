// ==UserScript==
// @name         实验室安全测试自动化（适用于杭州创高软件科技有限公司的旧版平台）
// @namespace    myetyet
// @version      4.4.2
// @description  实验室安全网上考试答案自动填充，支持单位：南京信息工程大学、西北农林科技大学、广东海洋大学、曲阜师范大学、唐山工业职业技术学院、台州学院、福建农业职业技术学院、郑州航空工业管理学院、无锡学院、嘉兴学院、中山大学、扬州大学广陵学院、宁夏大学、河北科技大学、仲恺农业工程学院（已失效）、江苏海洋大学、淮阴工学院、湖南文理学院、南通职业大学、暨南大学、青岛大学、玉林师范学院、中国农业大学、华侨大学、燕山大学、东北大学、湖南师范大学、西安建筑科技大学、河北科技大学、上海海洋大学、电子科技大学、湖南大学、中南大学、福建技术师范学院、温州理工学院、宁波大学、上海师范大学、常州大学、广州大学
// @author       myetyet
// @match        http://examsafety.nuist.edu.cn/redir.php?catalog_id=6&cmd=dati
// @match        https://labsafe.nwafu.edu.cn/redir.php?catalog_id=6&cmd=dati
// @match        http://210.38.136.71:8090/redir.php?catalog_id=6&cmd=dati
// @match        http://aqjy.qfnu.edu.cn/redir.php?catalog_id=6&cmd=dati
// @match        http://aqks.tsgzy.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=
// @match        https://sys.tzc.edu.cn/labexam/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://192.168.61.191/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://sxxt.fjny.com:11200/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://10.66.100.207/aqzrui/model/TwoGradePage/joinexam.aspx?kind=4&setid=*
// @match        http://10.1.80.140/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://10.110.73.8/redir.php?catalog_id=6&cmd=dati
// @match        http://202.116.65.193/redir.php?catalog_id=6&cmd=dati
// @match        http://58.192.130.29/redir.php?catalog_id=6&cmd=dati
// @match        https://sysaq.nxu.edu.cn/labexam/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://202.206.64.193/redir.php?catalog_id=6&cmd=dati&moni=*
// @match        http://192.168.2.51/redir.php?catalog_id=6&cmd=dati*
// @match        http://labexam.jou.edu.cn/redir.php?catalog_id=6&cmd=dati
// @match        http://172.16.5.224/redir.php?catalog_id=6&cmd=dati&moni=0
// @match        http://172.26.0.150/aqzrui/model/TwoGradePage/joinexam.aspx?kind=4&setid=*
// @match        http://labsafe.ntvu.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=0
// @match        https://aqpx.jnu.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=*
// @match        https://webvpn.qdu.edu.cn/http-80/*/redir.php?catalog_id=6&cmd=dati&mode=test
// @match        http://210.36.241.11/redir.php?catalog_id=6&cmd=dati&moni=0
// @match        http://aqks.cau.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://labsafety-hqu-edu-cn.w.hqu.edu.cn:8118/redir.php?catalog_id=6&cmd=dati*
// @match        http://202.206.247.8/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://aqks.neu.edu.cn/redir.php?catalog_id=6&cmd=dati&mode=*
// @match        https://labexam.hunnu.edu.cn/labexam/redir.php?catalog_id=6&cmd=dati&moni=
// @match        https://labexam.xauat.edu.cn/redir.php?catalog_id=6&cmd=dati*
// @match        http://sysaqksxt.hebust.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=0
// @match        http://202.121.64.63:8035/redir.php?catalog_id=6&cmd=dati
// @match        https://labsafetest.uestc.edu.cn/redir.php?catalog_id=6&cmd=dati
// @match        https://labsafe.hnu.edu.cn/labexam/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://202.197.71.93/redir.php?catalog_id=6&cmd=dati*
// @match        http://syaqks.fpnu.edu.cn/redir.php?catalog_id=6&cmd=dati&moni=
// @match        http://10.0.8.137/redir.php?catalog_id=6&cmd=dati*
// @match        http://10.22.107.77/redir.php?catalog_id=6&cmd=dati&moni=*
// @match        http://172.20.32.19/redir.php?catalog_id=6&cmd=dati
// @match        https://sysaqgl.cczu.edu.cn/labexam/redir.php?catalog_id=6&cmd=dati&moni=0
// @match        http://labexamen.gzhu.edu.cn/redir.php?catalog_id=6&cmd=dati
// @require      https://greasyfork.org/scripts/391129-nuist-examsafety-question-bank/code/NUIST%20examsafety%20Question%20Bank.js?version=996976
// @run-at       document-end
// @grant        none
// @compatible   chrome
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/391130/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E5%8C%96%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%9D%AD%E5%B7%9E%E5%88%9B%E9%AB%98%E8%BD%AF%E4%BB%B6%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E7%9A%84%E6%97%A7%E7%89%88%E5%B9%B3%E5%8F%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/391130/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E5%8C%96%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%9D%AD%E5%B7%9E%E5%88%9B%E9%AB%98%E8%BD%AF%E4%BB%B6%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E7%9A%84%E6%97%A7%E7%89%88%E5%B9%B3%E5%8F%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = window.location.host;
    if (host != "10.66.100.207" && host != "172.26.0.150") {
        var questions = document.getElementsByClassName("shiti");
        var _question, question, index, answer;
        var notfounds = new Array(), dislocations = new Array();
        var notfound = 0, dislocation = 0;
        for (let i = 0, __qlength__ = questions.length; i < __qlength__; ++i) {
            _question = questions[i].children[0].textContent.split("\u3001");
            index = _question.shift();
            question = _question.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "").replace(/^(\u5224\u65ad|\u5355\u9009|\u591a\u9009)\u9898/, "");
            answer = findAnswer(question);
            var _text, _c, c, answers;
            var answered = false;
            if (answer != "") {
                answers = answer.split("\u000a");
                for (let choice = 0, __clength__ = questions[i].children[1].childElementCount; choice < __clength__; ++choice) {
                    var ipt = document.getElementById("ti_" + index + "_" + String(choice));
                    _text = ipt.parentNode.children[1].textContent.replace(/[\s\?]/g, "");
                    if (_text.length == 0) {
                        dislocations[dislocation++] = String(index);
                        questions[i].children[0].setAttribute("style", "color: red");
                    } else {
                        _c = _text.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                        if (_c.length > 1) {
                            _c.shift();
                        }
                        c = _c.join("\u3001");
                        c = c.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                        for (let ai = 0, __alength__ = answers.length; ai < __alength__; ++ai) {
                            if (answers[ai] == c) {
                                ipt.click();
                                answered = true;
                                break;
                            }
                        }
                    }
                }
                if (!answered) {
                    notfounds[notfound++] = String(index);
                    questions[i].children[0].setAttribute("style", "color: red");
                }
            } else {
                notfounds[notfound++] = String(index);
                questions[i].children[0].setAttribute("style", "color: red");
            }
        }
        if (notfound > 0 || dislocation > 0) {
            if (notfound > 0) {
                alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
            }
            if (dislocation > 0) {
                alert("\u6b64\u9875\u9762\u5171\u6709" + String(dislocation) + "\u9053\u9898\u7531\u4e8e\u9009\u9879\u9519\u4f4d\uff0c\u5df2\u9009\u62e9\u6b63\u786e\u4f46\u4e0d\u5f97\u5206\u9009\u9879\uff1a" + dislocations.join("\u3001"));
            }
        } else {
            var next = document.getElementsByClassName("nav")[0].children[0];
            if (next && next.value == "\u4e0b\u4e00\u9875") {
                next.click();
            } else {
                document.getElementsByClassName("nav")[0].children[1].click();
            }
        }
    } else {
        let Qs = new Array();
        let __QsLen__ = 0;
        if (document.getElementById("DataGridA")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridA").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        if (document.getElementById("DataGridB")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridB").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        if (document.getElementById("DataGridC")) {
            for (let i = 0, __Q__ = document.getElementById("DataGridC").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                Qs[__QsLen__++] = __Q__.children[i];
            }
        }
        let notfounds = new Array();
        let notfound = 0;
        for (let i = 0; i < __QsLen__; ++i) {
            let t = Qs[i].children[0].children[0].children[0];
            let _Q = t.children[0].children[0].children[0].textContent.split("\u3001");
            let index = _Q.shift();
            let Q = _Q.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "");
            let A = findAnswer(Q);
            let As = A.split("\u000a");
            let Cs = t.children[1].children[0].children[0].children[0].children[0];
            let answered = false;
            for (let j = 0, __CsLen__ = Cs.childElementCount; j < __CsLen__; ++j) {
                let _C = Cs.children[j].children[1].textContent.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                if (_C.length > 1) {
                    _C.shift();
                }
                let C = _C.join("\u3001");
                C = C.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                for (let k = 0, __AsLen__ = As.length; k < __AsLen__; ++k) {
                    if (C == As[k]) {
                        Cs.children[j].children[0].click();
                        answered = true;
                        break;
                    }
                }
            }
            if (!answered) {
                notfounds[notfound++] = String(index);
                t.children[0].children[0].children[0].setAttribute("style", "color: red");
            }
        }
        if (notfound > 0) {
            alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
        }
    }
})();