// ==UserScript==
// @name         up_tk
// @author       trprr
// @version      1.0.0
// @description  up_tk_1.0.0        
// ==/UserScript==


function upLoadWork(index, doms, dom) {
    let $CyHtml = $(dom).contents().find(".CeYan");
    let TiMuList = $CyHtml.find(".TiMu");
    let data = [];
    for (let i = 0; i < TiMuList.length; i++) {
        let _a = {};
        let questionFull = $(TiMuList[i]).find(".Zy_TItle.clearfix > div.clearfix").html().trim();
        let _question = tidyQuestion(questionFull);
        let _TimuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[questionFull.match(/^<span.*?newZy_TItle.*?【(.*?)】<\/span>|$/)[1]];
        _a["question"] = _question;
        _a["type"] = _TimuType;
        let _selfAnswerCheck = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .answerScore .CorrectOrNot span").attr("class");
        switch (_TimuType) {
            case 0:
                if (_selfAnswerCheck == "marking_dui") {
                    let _selfAnswer = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[$(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").text().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim()];
                    let _answerForm2 = $(TiMuList[i]).find(".Zy_ulTop li");
                    let _answer2 = $(_answerForm2[_selfAnswer]).find("a.fl").html();
                    _a["answer"] = tidyStr(_answer2);
                }
                break;
            case 1:
                let _answerArr = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").text().trim().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
                let _answerForm = $(TiMuList[i]).find(".Zy_ulTop li");
                let _answer = [];
                if (_selfAnswerCheck == "marking_dui" || _selfAnswerCheck == "marking_bandui") {
                    for (let i2 = 0; i2 < _answerArr.length; i2++) {
                        let _answerIndex = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[_answerArr[i2]];
                        _answer.push($(_answerForm[_answerIndex]).find("a.fl").html());
                    }
                } else {
                    break;
                }
                _a["answer"] = tidyStr(_answer.join("#"));
                break;
            case 2:
                let _TAnswerArr = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer");
                let _TAnswer = [];
                for (let i2 = 0; i2 < _TAnswerArr.length; i2++) {
                    let item = _TAnswerArr[i2];
                    if ($(item).find("i").attr("class") == "marking_dui") {
                        _TAnswer.push($(item).find("p").html().replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
                    }
                }
                if (_TAnswer.length <= 0) {
                    break;
                }
                _a["answer"] = tidyStr(_TAnswer.join("#"));
                break;
            case 3:
                if (_selfAnswerCheck == "marking_dui") {
                    let _answer2 = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
                    _a["answer"] = tidyStr(_answer2);
                } else {
                    if ($(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html()) {
                        let _answer2 = $(TiMuList[i]).find(".newAnswerBx > .myAnswerBx > .myAnswer").html().replace(/正确答案[:：]/, "").replace(/我的答案[:：]/, "").trim();
                        if ("对|√|正确".indexOf(tidyStr(_answer2)) != -1) {
                            _a["answer"] = "错";
                        } else {
                            _a["answer"] = "对";
                        }
                    } else {
                        break;
                    }
                }
                break;
        }
        if (_a["answer"] != void 0) {
            data.push(_a);
        } else {
            continue;
        }
    }
    uploadAnswer(data, 0).then(() => {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        setTimeout(() => {
            startDoCyWork(index + 1, doms);
        }, 3e3);
    });
}

function uploadExam() {
    logger("考试答案收录功能处于bate阶段，遇到bug请及时反馈!!", "red");
    logger("开始收录考试答案", "green");
    let TimuList = $(".mark_table .mark_item .questionLi");
    let data = [];
    $.each(TimuList, (i, t) => {
        let _a = {};
        let _answer;
        let _answerTmpArr, _answerList = [];
        let TiMuFull = tidyQuestion($(t).find("h3").html());
        let _type = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/,.*?分/, "")];
        let _question = TiMuFull.replace(/^[(].*?[)]|$/, "").trim();
        let _rightAns = $(t).find(".mark_answer").find(".colorGreen").text().replace(/正确答案[:：]/, "").trim();
        switch (_type) {
            case 0:
                if (_rightAns.length <= 0) {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isZero != "0") {
                        _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
                    } else {
                        break;
                    }
                }
                _answerTmpArr = $(t).find(".mark_letter li");
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
                });
                let _i = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[_rightAns];
                _answer = _answerList[_i];
                _a["question"] = _question;
                _a["type"] = _type;
                _a["answer"] = _answer;
                data.push(_a);
                break;
            case 1:
                _answer = [];
                if (_rightAns.length <= 0) {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isTrue2 == "marking_bandui" || _isZero != "0") {
                        _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
                    } else {
                        break;
                    }
                }
                _answerTmpArr = $(t).find(".mark_letter li");
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
                });
                $.each(_rightAns.split(""), (c, d) => {
                    let _i2 = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d];
                    _answer.push(_answerList[_i2]);
                });
                _a["question"] = _question;
                _a["type"] = _type;
                _a["answer"] = _answer.join("#");
                data.push(_a);
                break;
            case 2:
                _answerTmpArr = [];
                let answers = $(t).find(".mark_answer").find(".colorDeep").find("dd");
                if (_rightAns.length <= 0) {
                    $.each(answers, (i2, t2) => {
                        _isTrue = $(t2).find("span:eq(1)").attr("class");
                        if (_isTrue == "marking_dui") {
                            _rightAns = $(t2).find("span:eq(0)").html();
                            _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
                        } else {
                            return;
                        }
                    });
                    _answer = _answerTmpArr.join("#");
                } else {
                    _answer = _rightAns.replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^#*/, "");
                }
                if (_answer.length != 0) {
                    _a["question"] = _question;
                    _a["type"] = _type;
                    _a["answer"] = _answer;
                    data.push(_a);
                }
                break;
            case 3:
                if (_rightAns.length <= 0) {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isZero != "0") {
                        _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
                    } else {
                        let _true = "正确|是|对|√|T|ri";
                        _rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/我的答案[:：]/, "").trim();
                        if (_true.indexOf(_rightAns) != -1) {
                            _rightAns = "错";
                        } else {
                            _rightAns = "对";
                        }
                    }
                }
                _a["question"] = _question;
                _a["type"] = _type;
                _a["answer"] = _rightAns;
                data.push(_a);
                break;
            case 4:
                if (_rightAns.length <= 0) {
                    break;
                }
                _a["question"] = _question;
                _a["type"] = _type;
                _a["answer"] = _rightAns;
                data.push(_a);
                break;
        }
    });
    setTimeout(() => {
        uploadAnswer(data, 0);
    }, 1500);
}
function uploadHomeWork() {
    logger("开始收录答案", "green");
    let $_homeworktable = $(".mark_table");
    let TiMuList = $_homeworktable.find(".mark_item").find(".questionLi");
    let data = [];
    $.each(TiMuList, (i, t) => {
        let _a = {};
        let _answer;
        let _answerTmpArr, _answerList = [];
        let TiMuFull = tidyQuestion($(t).find("h3.mark_name").html());
        let TiMuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/, .*?分/, "")];
        let TiMu = TiMuFull.replace(/^[(].*?[)]|$/, "").trim();
        let rightAns_path = $(t).find(".mark_answer").find(".colorGreen")[0];
        switch (TiMuType) {
            case 0:
                let d_rightAns;
                if (rightAns_path) {
                    d_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorGreen").text());
                } else {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isZero != "0") {
                        d_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorDeep").text());
                    } else {
                        return;
                    }
                }
                _answerTmpArr = $(t).find(".mark_letter li");
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
                });
                let _i = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d_rightAns];
                _answer = _answerList[_i];
                _a["question"] = TiMu;
                _a["type"] = TiMuType;
                _a["answer"] = _answer;
                data.push(_a);
                break;
            case 1:
                _answer = [];
                let m_rightAns;
                if (rightAns_path) {
                    m_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorGreen").text());
                } else {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isTrue2 == "marking_bandui" || _isZero != "0") {
                        m_rightAns = filterAnswerIndex($(t).find(".mark_answer").find(".colorDeep").text());
                    } else {
                        break;
                    }
                }
                _answerTmpArr = $(t).find(".mark_letter li");
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ""));
                });
                $.each(m_rightAns.split(""), (c, d) => {
                    let _i2 = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }[d];
                    _answer.push(_answerList[_i2]);
                });
                _a["question"] = TiMu;
                _a["type"] = TiMuType;
                _a["answer"] = _answer.join("#");
                data.push(_a);
                break;
            case 2:
                _answerTmpArr = [];
                let t_rightAns;
                let answers = $(t).find(".mark_answer").find(".colorDeep").find("dd");
                if (rightAns_path) {
                    t_rightAns = $(rightAns_path).text().replace(/\s/g, "").replace(/[(][0-9].*?[)]/g, "#").replace(/第.*?空:/g, "#").replace(/^正确答案[:：]#*/, "");
                    _answer = t_rightAns;
                } else {
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isZero && _isZero != 0) {
                        $.each(answers, (i2, t2) => {
                            t_rightAns = $(t2).find("span:eq(0)").text();
                            _answerTmpArr.push(t_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
                        });
                    } else {
                        $.each(answers, (i2, t2) => {
                            let _isTrue2 = $(t2).find("span:eq(1)").attr("class");
                            if (_isTrue2 == "marking_dui") {
                                t_rightAns = $(t2).find("span:eq(0)").text();
                                _answerTmpArr.push(t_rightAns.replace(/[(][0-9].*?[)]/, "").replace(/第.*?空:/, "").trim());
                            } else {
                                return;
                            }
                        });
                    }
                    _answer = _answerTmpArr.join("#");
                }
                if (_answer.length != 0) {
                    _a["question"] = TiMu;
                    _a["type"] = TiMuType;
                    _a["answer"] = _answer;
                    data.push(_a);
                }
                break;
            case 3:
                let p_rightAns;
                if (rightAns_path) {
                    p_rightAns = $(rightAns_path).text().replace(/\s/g, "").replace(/^正确答案[:：]/, "");
                } else {
                    let _isTrue2 = $(t).find(".mark_answer").find(".mark_score span").attr("class");
                    let _isZero = $(t).find(".mark_answer").find(".mark_score .totalScore.fr i").text();
                    if (_isTrue2 == "marking_dui" || _isZero != "0") {
                        p_rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/\s/g, "").replace(/^我的答案[:：]/, "");
                    } else {
                        let _true = "正确|是|对|√|T|ri";
                        p_rightAns = $(t).find(".mark_answer").find(".colorDeep").text().replace(/\s/g, "").replace(/^我的答案[:：]/, "");
                        if (_true.indexOf(p_rightAns) != -1) {
                            p_rightAns = "错";
                        } else {
                            p_rightAns = "对";
                        }
                    }
                }
                _a["question"] = TiMu;
                _a["type"] = TiMuType;
                _a["answer"] = p_rightAns;
                data.push(_a);
                break;
            case 4:
                let j_rightAns;
                if (rightAns_path) {
                    j_rightAns = $(rightAns_path).text().replace(/\s/g, "");
                } else {
                    break;
                }
                _a["question"] = TiMu;
                _a["type"] = TiMuType;
                _a["answer"] = j_rightAns;
                data.push(_a);
                break;
        }
    });
    setTimeout(() => {
        uploadAnswer(data, 0);
    }, 1500);
}
function uploadAnswer(a, t) {
    a.forEach((item) => {
        item.type = item.type + "";
    });
    return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
            url: atob(_host) + "/api/v1/upload",
            data: JSON.stringify({
                "v": _GM_info["script"]["version"],
                "data": a,
                "uid": "13f2f52f434d44d6e595088b8f5a4baf"
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (xhr) {
                try {
                    if (t == 1) {
                        resolve();
                    } else {
                        let res = JSON.parse(xhr.responseText);
                        if (res["code"] == 1e3) {
                            logger("Upload Success.", "green");
                        } else {
                            logger("Upload Error. Next Part.", "red");
                        }
                        resolve();
                    }
                } catch {
                    let res = xhr.responseText;
                    if (res.indexOf("防火墙") != -1) {
                        logger("Upload Error. Please contact the author.", "red");
                    } else {
                        logger("Upload Unknow Error. Please contact the author.", "red");
                    }
                    resolve();
                }
            }
        });
    });
}