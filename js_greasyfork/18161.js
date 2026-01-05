// ==UserScript==
// @name        shanbay_word
// @description show word of shanbay
// @namespace   https://github.com/chenshengzhi
// @homepageURL https://greasyfork.org/zh-CN/scripts/18161
// @include     *www.shanbay.com*
// @version     0.0.16
// @grant       none
// @description show word of shanbay
// @downloadURL https://update.greasyfork.org/scripts/18161/shanbay_word.user.js
// @updateURL https://update.greasyfork.org/scripts/18161/shanbay_word.meta.js
// ==/UserScript==


function buttonClickIfExist(id) {
    var btn = $(id);
    if (btn && btn.length > 0) {
        btn.click();
        return true;
    }
    return false;
}

function autoFillWordOrJumpToNextSentence(sentence_view, target) {
    //正在测试中
    if ($('input.sentence-word-input').length > 0) {
        //都输入完成, 跳到下一句
        if ($('input.sentence-word-input:not(.right-answer)').length == 0) {
            sentence_view.show_sentence_when_finished_or_next();
        } else {
            document.activeElement.value = document.activeElement.getAttribute('data')
            //sentence_view.check_answer_by_press_key里需要用到currentTarget
            $(target).keypress(function(e){
                sentence_view.check_answer_by_press_key(e);
            });
            setTimeout(function(){
                var keyevent = new KeyboardEvent('keypress', {'key': ' ', 'keyCode': 32});
                target.dispatchEvent(keyevent);
            }, 10);
        }
    } else {
        window.location.href = 'https://www.shanbay.com/listen/';
    }
}

function myHintHandler(sentence_view) {
    sentence_view.peek_hints();
    sentence_view.data.num_hints_total += 1;
    sentence_view.delta_hints_used -= 1;
    sentence_view.render_hint_num_total(sentence_view.data.num_hints_total);
}

function articleTrainViewActionHandler(event) {
    var sentence_view = app.article_train_view.sentence_view;

    //测试界面
    if (sentence_view instanceof TestView) {
        //数字9键
        if (event.key == '9') {
            autoFillWordOrJumpToNextSentence(sentence_view, event.target);
            return false;
        } else if (event.key == '5') {
            myHintHandler(sentence_view);
            return false;
        }
    } else if (sentence_view instanceof PreviewView) {
        if (event.key == '9') {
            if (!buttonClickIfExist('#btn-start-listen-review')) {
                if (!buttonClickIfExist('#btn-start-listen-test')) {
                    sentence_view.know(event);
                }
            }
            return false;
        }
    }
    return true;
}

function sentenceTrainViewActionHandler(event) {
    var sentence_view = app.sentence_train_view.sentence_view;

    //测试界面
    if (sentence_view instanceof TestView) {
        //数字8键
        if (event.key == '8') {
            autoFillWordOrJumpToNextSentence(sentence_view, event.target);
            return false;
        } else if (event.key == '5') {
            myHintHandler(sentence_view);
            return false;
        }
    } else if (sentence_view instanceof PreviewView) {
        if (event.key == '8') {
            if (!buttonClickIfExist('#btn-start-listen-review')) {
                if (!buttonClickIfExist('#btn-start-listen-test')) {
                    sentence_view.know(event);
                }
            }
            return false;
        }
    }
    return true;
}

function keyDownHandler(event) {
    console.log(event.keyCode, event.key);

    if (window.location.href == 'https://www.shanbay.com/listen/') {
        if (event.key == '9') {
            navigate_view.start_article_train();
        } else if (event.key == '8') {
            window.location.href = 'https://www.shanbay.com/listen/sentence/';
        }
        return false;
    }

    if (app && app.article_train_view && app.article_train_view.sentence_view) {
        return articleTrainViewActionHandler(event);

    } else if (app && app.sentence_train_view && app.sentence_train_view.sentence_view) {
        return sentenceTrainViewActionHandler(event);

    } else {
        if (event.key == '9' || event.key == '8') {
            if (!buttonClickIfExist('#btn-start-listen-review')) {
                if (!buttonClickIfExist('#btn-start-listen-test')) {
                    window.location.href = 'https://www.shanbay.com/listen/';
                }
            }
            return false;
        }
    }
}

function addCircleButton(title, url, index) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = title;
    btn.style.position = 'fixed';
    var top = (30 + 60 * index) + 'px';
    btn.style.top = top;
    btn.style.right = '30px';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.backgroundColor = '#208F72';
    btn.style.borderStyle = 'none';
    btn.style.borderRadius = '30px';
    btn.style.color = 'white';
    btn.style.fontSize = '16px';
    btn.onclick = function(){
        window.location.href = url;
    };
    document.body.appendChild(btn);
}

String.prototype.endWith = function(str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

var href = window.location.href;
var targetLocation = 'www.shanbay.com/listen/';
if (href.indexOf(targetLocation) >= 0) {
    if (href.endWith(targetLocation)) {
        document.getElementsByClassName("section sentence")[0].style = "display: none;";
        document.getElementsByClassName("section article")[0].style = "display: none;";
        document.getElementsByClassName("entry sentence hide")[0].style = "display: block;";
        document.getElementsByClassName("entry article hide")[0].style = "display: block;";
    }
    document.onkeydown = keyDownHandler;
}

addCircleButton('听力\n列表', "https://www.shanbay.com/listen/", 0);
addCircleButton('新闻\n列表', "https://www.shanbay.com/read/news/", 1);
