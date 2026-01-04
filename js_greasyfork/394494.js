// ==UserScript==
// @name         优学院答题
// @namespace    Brush-JIM
// @version      2020.01.01
// @description  优学院自动答题，配合优学院看视频脚本使用
// @author       Brush-JIM
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        unsafeWindow
// ==/UserScript==

function Short_Answer_Question(questionid, data) {
    $.ajax({
        url: 'https://api.ulearning.cn/questionAnswer/' + /question(\d*)/gi.exec(questionid)[1],
        async: false,
        success: function (result) {
            let Inputs = data.querySelectorAll('textarea');
            let evt = document.createEvent("Events");
            evt.initEvent("change", true, true);
            if (Inputs.length == 1) {
                if (result['correctreply'] != '' && result['correctreply'] != null) {
                    Inputs[0].value = result['correctreply']
                } else if (result['correctAnswerList'].length != 0) {
                    if (result['correctAnswerList'][0] != '' && result['correctAnswerList'][0] != null) {
                        Inputs[0].value = result['correctAnswerList'][0]
                    } else {
                        Inputs[0].value = '答案言之有理即可'
                    }
                } else {
                    Inputs[0].value = '答案言之有理即可'
                }
                Inputs[0].dispatchEvent(evt);
            } else if (Inputs.length > 1) {
                if (result['correctAnswerList'].length === Inputs.length) {
                    for (let g = 0; Inputs.length > g; g++) {
                        Inputs[g].value = result['correctAnswerList'][g].replace(/<([\s\S]*?)>/gi, '');
                        Inputs[g].dispatchEvent(evt);
                    }
                } else if (result['correctAnswerList'].length > Inputs.length) {
                    for (let g = 0; Inputs.length > g; g++) {
                        Inputs[g].value = result['correctAnswerList'][g].replace(/<([\s\S]*?)>/gi, '');
                        Inputs[g].dispatchEvent(evt);
                    }
                } else if (result['correctAnswerList'].length < Inputs.length) {
                    for (let g = 0; result['correctAnswerList'].length > g; g++) {
                        Inputs[g].value = result['correctAnswerList'][g].replace(/<([\s\S]*?)>/gi, '');
                        Inputs[g].dispatchEvent(evt);
                    }
                } else { ;
                }
            } else { ;
            }
        },
        error: function () {
            console.log('Ajax Failure.');
        }
    })
}

function Fill_In_The_Blanks(questionid, data) {
    $.ajax({
        url: 'https://api.ulearning.cn/questionAnswer/' + /question(\d*)/gi.exec(questionid)[1],
        async: false,
        success: function (result) {
            if (result['correctAnswerList'].length != 0) {
                let Inputs = data.querySelectorAll('input[type="text"]');
                if (result['correctAnswerList'].length === Inputs.length) {
                    for (let f = 0; Inputs.length > f; f++) {
                        if (result['correctAnswerList'][f].search(/\/\//) === -1) {
                            Inputs[f].value = result['correctAnswerList'][f];
                        } else {
                            Inputs[f].value = /([\s\S]*)\/\//gi.exec(result['correctAnswerList'][f])[1]
                        }
                    }
                } else if (result['correctAnswerList'].length > Inputs.length) {
                    for (let f = 0; Inputs.length > f; f++) {
                        if (result['correctAnswerList'][f].search(/\/\//) === -1) {
                            Inputs[f].value = result['correctAnswerList'][f];
                        } else {
                            Inputs[f].value = /([\s\S]*)\/\//gi.exec(result['correctAnswerList'][f])[1]
                        }
                    }
                } else if (result['correctAnswerList'].length < Inputs.length) {
                    for (let f = 0; result['correctAnswerList'].length > f; f++) {
                        if (result['correctAnswerList'][f].search(/\/\//) === -1) {
                            Inputs[f].value = result['correctAnswerList'][f];
                        } else {
                            Inputs[f].value = /([\s\S]*)\/\//gi.exec(result['correctAnswerList'][f])[1]
                        }
                    }
                } else { ;
                }
            }
        },
        error: function () {
            console.log('Ajax Failure.');
        }
    })
}

function True_Or_False(questionid, data) {
    $.ajax({
        url: 'https://api.ulearning.cn/questionAnswer/' + /question(\d*)/gi.exec(questionid)[1],
        async: false,
        success: function (result) {
            if (result['correctAnswerList'].length != 0) {
                let Choose = undefined;
                if (result['correctAnswerList'][0] === 'false') {
                    Choose = false;
                } else if (result['correctAnswerList'][0] === 'true') {
                    Choose = true;
                } else {
                    console.log('Unknown Choice.');
                    return undefined;
                }
                if (Choose === true && data.querySelector('[class="choice-btn right-btn"]') != null) {
                    data.querySelector('[class="choice-btn right-btn"]').click();
                } else if (Choose === false && data.querySelector('[class="choice-btn wrong-btn"]') != null) {
                    data.querySelector('[class="choice-btn wrong-btn"]').click();
                } else if (Choose === true && data.querySelector('[class="choice-btn right-btn selected"]') != null) { ;
                } else if (Choose === false && data.querySelector('[class="choice-btn wrong-btn selected"]') != null) { ;
                } else {
                    console.log('Unknown Error.');
                }
            }
        },
        error: function () {
            console.log('Ajax Failure.');
        }
    })
}

function Multiple_Choices(questionid, data) {
    $.ajax({
        url: 'https://api.ulearning.cn/questionAnswer/' + /question(\d*)/gi.exec(questionid)[1],
        async: false,
        success: function (result) {
            if (result['correctAnswerList'].length != 0) {
                let Reset_Choices = data.querySelectorAll('div[id^="choice"] div[class="checkbox selected"]');
                for (let e = 0; Reset_Choices.length > e; e++) {
                    Reset_Choices[e].click();
                }
                let Choices = data.querySelectorAll('div[id^="choice"]');
                for (let c = 0; Choices.length > c; c++) {
                    let Option = Choices[c].querySelector('div[class="option"]').innerText.replace(/\./, '');
                    for (let d = 0; result['correctAnswerList'].length > d; d++) {
                        if (Option === result['correctAnswerList'][d]) {
                            Choices[c].click();
                        }
                    }
                }
            }
        },
        error: function () {
            console.log('Ajax Failure.');
        }
    })
}

function Single_Choice_Question(questionid, data) {
    $.ajax({
        url: 'https://api.ulearning.cn/questionAnswer/' + /question(\d*)/gi.exec(questionid)[1],
        async: false,
        success: function (result) {
            if (result['correctAnswerList'].length != 0) {
                let Choices = data.querySelectorAll('div[id^="choice"]');
                for (let c = 0; Choices.length > c; c++) {
                    let Option = Choices[c].querySelector('div[class="option"]').innerText.replace(/\./, '');
                    if (Option === result['correctAnswerList'][0]) {
                        Choices[c].querySelector('div[class="option"]').click();
                        break;
                    }
                }
            }
        },
        error: function () {
            console.error('Ajax Failure.');
        }
    })
}

function answer() {
    $('button[type="button"][class="btn-hollow btn-redo"]').click()
    var data = {};
    for (let a = 0; $('div[id^="question"]').length > a; a++) {
        if ($('div[id^="question"]:eq(' + a + ') div[id^="question"]').length == 0) {
            let questionid = $('div[id^="question"]:eq(' + a + ')')[0].id;
            if (/question(\d+)/gi.test(questionid) == true) {
                data[questionid] = $('div[id^="question"]:eq(' + a + ')')[0];
            } else { ;
            }
        } else { ;
        }
    }
    var data_1 = {};
    for (let key in data) {
        let Type = data[key].querySelector('span[class="question-type-tag"]');
        if (Type === undefined) {
            console.log('Unknown Type.');
        } else {
            data_1[key] = {};
            data_1[key]['Type'] = Type.innerText;
            data_1[key]['Location'] = data[key];
        }
    }
    for (let key_1 in data_1) {
        let Type_1 = data_1[key_1]['Type'];
        let Location_1 = data_1[key_1]['Location'];
        if (Type_1 === '单选题') {
            Single_Choice_Question(key_1, Location_1);
        } else if (Type_1 === '多选题') {
            Multiple_Choices(key_1, Location_1);
        } else if (Type_1 === '判断题') {
            True_Or_False(key_1, Location_1);
        } else if (Type_1 === '填空题') {
            Fill_In_The_Blanks(key_1, Location_1);
        } else if (Type_1 === '简答题') {
            Short_Answer_Question(key_1, Location_1);
        } else {
            console.log('Unknown Type.');
        }
    }
    $('[data-bind="text: $root.i18nMessageText().submit, click: submitQuiz"]').click()
}
