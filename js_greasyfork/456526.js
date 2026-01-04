// ==UserScript==
// @name         [自改]妖火网增强插件
// @namespace    https://yaohuo.me/
// @version      1.2
// @description  修改：1.评论默认全表情展示、2.评论全UBB、3.Via可用、4.自动吃肉
// @author       原作：外卖不用券(id:23825)
// @match        *yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456526/%5B%E8%87%AA%E6%94%B9%5D%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456526/%5B%E8%87%AA%E6%94%B9%5D%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// 是否自动吃肉
var isAutoEat = true; // 是否自动吃肉: true --吃 flase--不吃
// 是否直接显示表情于输入框上方 
var isDirectEmotion = true; //true --显示 flase--不显示

const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
const postPage = ["/bbs/book_view_add.aspx", "/bbs/book_view_sendmoney.aspx", "/bbs/book_view_addvote.aspx", "/bbs/book_view_addfile.aspx", "/bbs/book_view_mod.aspx"];
const spanstyle = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #ccc;';

if (/^\/bbs-.*\.html$/.test(window.location.pathname) || viewPage.includes(window.location.pathname)) {

    // 直接显示表情
    if (isDirectEmotion) {
        directEmotion()
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 吃肉 必须放在后面
    // const fileTag = document.querySelector("body > div.viewContent > div.sticky > form > span.kuaisuhuifu > a");
    var eatMeat = document.createElement('input');
    eatMeat.type = 'submit';
    eatMeat.value = "一键吃肉"
    eatMeat.addEventListener("click", (e) => {
        e.preventDefault();
        var eatWordsArr = ["吃..", "吃了..", "吃肉..", "口乞..", "chile..", "7肉..", "7了.."];
        var index = Math.round((Math.random() * 10) % (eatWordsArr.length - 1));
        console.log("吃肉回复：", eatWordsArr[index])
        commentSkipInput(eatWordsArr[index])
        // insertText(textarea, eatWordsArr[index], 0);
        // replyBtn.click()
    });

    const meatTag = document.querySelector("body > div.content > div.paibi > span.shengyu > span.yushuzi");

    if (!isAutoEat) {
        console.log("未开启自动吃肉，可在编辑脚本进行开启")
    } else {
        if (meatTag == undefined) {
            console.log("非肉勿7")
        }
        else if (parseInt(meatTag.innerHTML) <= 0) {
            console.log("无肉怎7")
        } else {
            console.log("有肉快7")
            eatMeat.click()
        }
    }
    let replySpan = document.querySelector("body > div.viewContent > div.sticky > form > span.kuaisuhuifu")
    replySpan.appendChild(eatMeat)
    //replySpan.insertBefore(eatMeat,fileTag )
    // 吃肉 END


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 妖火图床、超链接、图片
    const form = document.getElementsByName('f')[0];
    form.removeChild(form.lastChild);
    form.insertAdjacentHTML(
        "beforeend",
        `
        <hr>
        <span id='ubb_url' style="${spanstyle}">链接</span>
        <span id='ubb_img' style="${spanstyle}">图片</span>
        <span id='ubb_audio' style="${spanstyle}">音频</span>
        <span id='ubb_movie' style="${spanstyle}">视频</span>
        <br>
        <span id='ubb_text' style="${spanstyle}">半角</span>
        <span id='ubb_br' style="${spanstyle}">换行</span>
        <span id='ubb_b' style="${spanstyle}">加粗</span>
        <span id='ubb_i' style="${spanstyle}">斜体</span>
        <span id='ubb_color' style="${spanstyle}">颜色字</span>
        <span id='ubb_u' style="${spanstyle}">下划线</span>
        <span id='ubb_strike' style="${spanstyle}">删除线</span>
        <span id='ubb_hr' style="${spanstyle}">分割线</span>
        <br>
        <span id='ubb_sms' style="${spanstyle}">短信</span>
        <span id='ubb_call' style="${spanstyle}">拨号</span>
        <span id='ubb_now' style="${spanstyle}">时间</span>
        <span id='ubb_codo' style="${spanstyle}">倒计天</span>
        <br>
        <a href='https://yaohuo.me/tuchuang/' target="_blank" style="${spanstyle}">图床</a>
        <a href='https://aapi.eu.org/ppx' target="_blank" style="${spanstyle}">皮皮</a>
        <a href='https://aapi.eu.org/bili' target="_blank" style="${spanstyle}">b站</a>
        <a href='https://aapi.eu.org/dy' target="_blank" style="${spanstyle}">抖音</a>
        <a href='https://aapi.eu.org/ks' target="_blank" style="${spanstyle}">快手</a>
        <a href='https://pan.whgpc.com/upload.php' target="_blank" style="${spanstyle}">外链</a>
        <a href='https://urlify.cn/' target="_blank" style="${spanstyle}">短链接</a>
        <hr>
        `
    );


    // 超链接
    const content = form.getElementsByTagName('textarea')[0];
    const textarea = content;
    document.getElementById("ubb_url").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[url=网址]文字说明[/url]", 0);
    });
    document.getElementById("ubb_movie").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[movie=100%*100%]视频直链地址|封面图片地址[/movie]", 0);
    });

    document.getElementById("ubb_text").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "全角转半角：[text]代码内容[/text]", 0);
    });
    document.getElementById("ubb_br").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "///", 0);
    });

    document.getElementById("ubb_hr").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[hr]", 0);
    });

    document.getElementById("ubb_b").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[b]加粗文字[/b]", 0);
    });
    document.getElementById("ubb_i").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[i]斜体文字[/i]", 0);
    });
    document.getElementById("ubb_u").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[u]下划线文字[/y]", 0);
    });
    document.getElementById("ubb_color").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[forecolor=red]颜色文字，默认红[/forecolor]", 0);
    });
    document.getElementById("ubb_img").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[img]图片链接[/img]", 0);
    });
    document.getElementById("ubb_strike").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[strike]删除线文字[/strike]", 0);
    });
    document.getElementById("ubb_call").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[call]拨号手机号码[/call]", 0);
    });
    document.getElementById("ubb_sms").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[url=sms:手机号码?body=短信内容]点此发送[/url]", 0);
    });
    document.getElementById("ubb_now").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "当前系统日期和时间：[now]", 0);
    });
    document.getElementById("ubb_codo").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "倒计天：[codo]2030-01-01[/codo]", 0);
    });
    document.getElementById("ubb_audio").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[audio=X]音频直链地址[/audio]", 0);
    });


}

function directEmotion() {

    const form = document.getElementsByName('f')[0];
    const content = form.getElementsByTagName('textarea')[0];

    content.insertAdjacentHTML('beforebegin', '<div id="facearea"></div>');;
    const facearea = document.getElementById('facearea');
    // 20230930 输入框样式错位
    document.querySelector(".centered-container").style.display = "BLOCK"

    // 快捷表情区
    let idPrefix = "myEmotion-"
    let allfacehtml = '';
    let emotionList = document.querySelectorAll(".select_option input.select_input")
    // faceList.slice(0, faceList.length).forEach((faceStr, i) => {
    //     allfacehtml += '<img id="setFace' + i + '" style="width: 32px; height: 32px" src="face/' + faceStr + '" value="' + faceStr.split('.')[0] + '.gif"></img>';
    // })
    //拼接HTML
    emotionList.forEach((emotion, idx) => {
        allfacehtml += '<img id="' + idPrefix + idx + '" style="width: 32px; height: 32px" src="face/' + emotion.value + '" value="' + emotion.value + '"></img>';
    })

    facearea.innerHTML += allfacehtml;
    // 设置表情点击事件
    emotionList.forEach((emotion, idx) => {
        // 点击事件     
        document.getElementById(idPrefix + idx).addEventListener("click", function (event) {
            emotion.checked = true
            emotion.parentNode.parentNode.style.display = "block"
            console.log(emotion.parentNode.parentNode.style.display)
            console.log("选择了表情 " + emotion.value)
        })
    })

}

function insertText(obj, str, offset) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (
        typeof obj.selectionStart === "number" &&
        typeof obj.selectionEnd === "number"
    ) {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value =
            tmpStr.substring(0, startPos) +
            str +
            tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos - offset;
    } else {
        obj.value += str;
    }
    obj.focus();

}



function commentSkipInput(content) {
    let form = document.getElementsByName('f')[0];
    if (!form) {
        return;
    }
    let submitBtn = form.querySelector('[name="g"]');
    if (!submitBtn) {
        return;
    }
    const formData = new FormData(form);
    const entries = formData.entries();
    const data = Object.fromEntries(entries);
    data.content = content
    data.g = '快速回复';
    if (data.content.length > 0) {
        try {
            data.content = data.content.replace(/\n/g, '[br]');
            sendFriendMsg();
        } catch { }
        fetch('/bbs/book_re.aspx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            },
            body: new URLSearchParams(data)
        }).then(res => res.text())
            .then(html => {
                let recontenttip = /class="tip">(.*?)<\/div>/.exec(html)[1];
                let tip = '';
                let timeoutDuration = 800;

                if (recontenttip.includes('回复成功')) {
                    let successMatch = /获得妖晶:(\d+)，获得经验:(\d+)/.exec(recontenttip);
                    if (successMatch) {
                        let yaogem = successMatch[1];
                        let exp = successMatch[2];
                        tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">回复成功</h4><div>获得妖晶' + yaogem + '，经验' + exp + '</div> </div></div></div>';
                        timeoutDuration = 300;
                        // 重置表情选项
                        emoticonContainer.style.display = "none";
                        selectOptions.style.display = "block";
                        const emoticonInputs = document.querySelectorAll(".select_option input.select_input");
                        emoticonInputs.forEach(input => {
                            input.checked = false;
                        });
                        // 清空文本框内容
                        document.getElementsByName("content")[0].value = '';
                    }
                } else if (recontenttip.includes('回复内容最少')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">回复内容最少</h4><div>' + /回复内容最少(.*?)字/.exec(recontenttip)[1] + '</div> </div></div></div>';
                    timeoutDuration = 1200;
                } else if (recontenttip.includes('回复内容最多')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">回复内容最多</h4><div>' + /回复内容最多(.*?)字/.exec(recontenttip)[1] + '</div> </div></div></div>';
                    timeoutDuration = 1200;
                } else if (recontenttip.includes('请不要发重复内容')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">请不要发重复内容</h4></div></div></div>';
                    timeoutDuration = 1200;
                } else if (recontenttip.includes('请再过')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">请再过</h4><div>' + /请再过(.*?)秒后操作/.exec(recontenttip)[1] + '</div> </div></div></div>';
                    timeoutDuration = 2000;
                } else if (recontenttip.includes('今天已达回帖上限')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">今天已达回帖上限</h4><div>' + /今天已达回帖上限 (.*?) 条/.exec(recontenttip)[1] + '</div> </div></div></div>';
                    timeoutDuration = 2000;
                } else if (recontenttip.includes('您已被加入黑名单')) {
                    tip = '<div class="ui__alert"><div class="ui__alert_bg in"></div> <div class="ui__alert_content in"> <div class="ui__content_body"><h4 class="ui__title">您已被加入黑名单</h4><div>请注意发帖规则</div> </div></div></div>';
                    timeoutDuration = 5000;
                }

                document.getElementsByName("content")[0].value = '';
                let recontent = document.getElementsByClassName('recontent')[0];
                fetch('/bbs-' + data.id + '.html').then(res => res.text()).then(html => {
                    let newcontent = /recontent">([\s\S]*?)<div class="more"/.exec(html)[1];
                    recontent.innerHTML = '<div id="retip">' + tip + '</div>' + newcontent;
                    if (isCustomLayoutEnabled) {
                        applyNewLayoutToNewContent();
                    }
                    let sticky = document.getElementsByClassName("sticky")[0];
                    sticky.style.cssText = "";
                    replyAny();
                    const textContentElements = document.querySelectorAll(".retext");
                    textContentElements.forEach((element) => {
                        processTextContent(element);
                    });
                    const retip = document.getElementById('retip');
                    const alertBg = retip.querySelector('.ui__alert_bg');
                    const clearTip = () => {
                        if (hideTipTimeout) {
                            retip.style.display = 'none';
                            clearTimeout(hideTipTimeout);
                        }
                    };

                    let hideTipTimeout = setTimeout(clearTip, timeoutDuration);
                    alertBg.addEventListener('click', () => {
                        clearTip();
                    });
                    const closeBtn = retip.querySelector('.ui__title');
                    closeBtn.addEventListener('click', () => {
                        clearTip();
                    });
                });
            }).catch(error => {
                console.error('Error during fetch:', error);
            });
    }

}
