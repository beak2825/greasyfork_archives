// ==UserScript==
// @name         妖火网增强插件
// @namespace    https://yaohuo.me/
// @version      0.46
// @description  获得焦点时回复框自动停靠、加载更多楼层、回复任意楼层、异步评论、双击定位评论区、发帖增强、图床直达、超链图片回复、表情展开
// @author       外卖不用券(id:23825)
// @match        https://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441341/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441341/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
const postPage = ["/bbs/book_view_add.aspx", "/bbs/book_view_sendmoney.aspx", "/bbs/book_view_addvote.aspx", "/bbs/book_view_addfile.aspx", "/bbs/book_view_mod.aspx"];
const faceList = ['踩.gif', '狂踩.gif', '淡定.gif', '囧.gif', '不要.gif', '重拳出击.gif', '砳砳.gif', '滑稽砳砳.gif', '沙发.gif', '汗.gif', '亲亲.gif', '太开心.gif', '酷.gif', '思考.gif', '发呆.gif', '得瑟.gif', '哈哈.gif', '泪流满面.gif', '放电.gif', '困.gif', '超人.gif', '害羞.gif', '呃.gif', '哇哦.gif', '要死了.gif', '谢谢.gif', '抓狂.gif', '无奈.gif', '不好笑.gif', '呦呵.gif', '感动.gif', '喜欢.gif', '疑问.gif', '委屈.gif', '你不行.gif', '流口水.gif', '潜水.gif', '咒骂.gif', '耶耶.gif', '被揍.gif', '抱走.gif'];
const spanstyle = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #ccc;';

if (/^\/bbs-.*\.html$/.test(window.location.pathname) || viewPage.includes(window.location.pathname)) {
    const form = document.getElementsByName('f')[0];
    const face = form.getElementsByTagName('select')[0];
    const sendmsg = form.getElementsByTagName('select')[1];
    const content = form.getElementsByTagName('textarea')[0];
    sendmsg.insertAdjacentHTML('afterend', '<span style="' + spanstyle + '" id="unfold">表情展开</span>');
    let unfold = document.getElementById('unfold');
    let spread = false;
    unfold.onclick = function unfoldFace() {
        let facehtml = '';
        if (!spread) {
            spread = true;
            faceList.slice(0, 10).forEach((faceStr, i) => {
                facehtml += '<img id="setFace' + i + '" style="width: 32px; height: 32px" src="face/' + faceStr + '" value="' + faceStr.split('.')[0] + '.gif"></img>';
            })
            content.insertAdjacentHTML('beforebegin', '<div id="facearea">' + facehtml + '<span style="font-size: 12px; color: #ccc; vertical-align: text-bottom;" id="moreface">...</span></div>');
            let moreface = document.getElementById('moreface');
            const facearea = document.getElementById('facearea');
            for (const i of new Array(10).keys()) {
                document.getElementById('setFace' + i).onclick = function setFace() {
                    face.value = faceList[i];
                    form.removeChild(facearea);
                    spread = false;
                };
            }
            moreface.onclick = function() {
                facearea.removeChild(moreface);
                let allfacehtml = '';
                faceList.slice(10, faceList.length).forEach((faceStr, i) => {
                    allfacehtml += '<img id="setFace' + (i + 10) + '" style="width: 32px; height: 32px" src="face/' + faceStr + '" value="' + faceStr.split('.')[0] + '.gif"></img>';
                })
                facearea.innerHTML += allfacehtml;
                for (let i = 0; i < faceList.length; i++) {
                    document.getElementById('setFace' + i).onclick = function setFace() {
                        face.value = faceList[i];
                        form.removeChild(facearea);
                        spread = false;
                    };
                }
            }
        } else {
            spread = false;
            form.removeChild(document.getElementById('facearea'));
        }
    };
    // 妖火图床、超链接、图片
    form.removeChild(form.lastChild);
    form.insertAdjacentHTML(
        "beforeend",
        `<span style='float: right; padding-right: 10px'>
          <span id='ubb_url' style="${spanstyle}">超链</span>
        <span id='ubb_img' style="${spanstyle}">图片</span>
        <a href='https://yh-pic.ihcloud.net/' target="_blank" style="${spanstyle}">图床</a>
        </span><br>`
    );
    // 超链接
    const textarea = document.querySelector(
        "body > div.sticky > form > textarea"
    );
    document.getElementById("ubb_url").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[url][/url]", 6);
    });
    document.getElementById("ubb_img").addEventListener("click", (e) => {
        e.preventDefault();
        insertText(textarea, "[img][/img]", 6);
    });
} else if (
    postPage.includes(window.location.pathname)
) {
    // 发帖UBB增强
    let bookContent = document.getElementsByName("book_content")[0];
    bookContent.insertAdjacentHTML(
        "beforebegin",
        `<div class='btBox'>
          <div class='bt2'>
              <a style='width:25%' id='ubb_a'>超链接</a>
              <a style='width:25%' id='ubb_img'>图片</a>
              <a style='width:25%' id='ubb_movie'>视频</a>
              <a style='width:25%' id='ubb_more'">更多...</a>
          </div>
      </div>
      <div class='more_ubb_tools' style='display: none'>
          <div class='btBox'>
              <div class='bt2'>
                  <a style='width:25%' id='ubb_f'>颜色</a>
                  <a style='width:25%' id='ubb_b'">加粗</a>
                  <a style='width:25%' id='ubb_s'>删除</a>
                  <a style='width:25%' id='ubb_audio'>音频</a>
              </div>
          </div>
          <div class='btBox'>
              <div class='bt2'>
                  <a href='https://yaohuo.me/tuchuang/'>妖火图床</a>
                  <a href='https://aapi.eu.org/dy'>好记解析</a>
              </div>
          </div>
      </div>`
    );
    document.getElementById("ubb_a").addEventListener("click", () => insertText(bookContent, "[url][/url]", 6));
    document.getElementById("ubb_f").addEventListener("click", () => insertText(bookContent, "[forecolor=#FF0000][/forecolor]", 12));
    document.getElementById("ubb_b").addEventListener("click", () => insertText(bookContent, "[b][/b]", 4));
    document.getElementById("ubb_s").addEventListener("click", () => insertText(bookContent, "[strike][/strike]", 9));
    document.getElementById("ubb_img").addEventListener("click", () => insertText(bookContent, "[img][/img]", 6));
    document.getElementById("ubb_movie").addEventListener("click", () => insertText(bookContent, "[movie=100%*100%][/movie]", 8));
    document.getElementById("ubb_audio").addEventListener("click", () => insertText(bookContent, "[audio=X][/audio]", 8));
    document.getElementById("ubb_more").addEventListener("click", () => {
        let ubb_tool = document.getElementsByClassName("more_ubb_tools")[0];
        ubb_tool.style.display = ubb_tool.style.display === "none" ? "block" : "none";
    });
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