// ==UserScript==
// @name         妖火网辅助插件
// @namespace    https://yaohuo.me/
// @version      2.1
// @description  发帖ubb、回帖表情等功能
// @author       ID12167
// @match        *yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/460711/%E5%A6%96%E7%81%AB%E7%BD%91%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460711/%E5%A6%96%E7%81%AB%E7%BD%91%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


//定义一些常量
const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
const postPage = ["/bbs/book_view_add.aspx", "/bbs/book_view_sendmoney.aspx", "/bbs/book_view_addvote.aspx", "/bbs/book_view_addfile.aspx", "/bbs/book_view_mod.aspx"];
//原表情包预览
const faceList = ['踩.gif', '狂踩.gif', '淡定.gif', '囧.gif', '不要.gif', '重拳出击.gif', '砳砳.gif', '滑稽砳砳.gif', '沙发.gif', '汗.gif', '亲亲.gif', '太开心.gif', '酷.gif', '思考.gif', '发呆.gif', '得瑟.gif', '哈哈.gif', '泪流满面.gif', '放电.gif', '困.gif', '超人.gif', '害羞.gif', '呃.gif', '哇哦.gif', '要死了.gif', '谢谢.gif', '抓狂.gif', '无奈.gif', '不好笑.gif', '呦呵.gif', '感动.gif', '喜欢.gif', '疑问.gif', '委屈.gif', '你不行.gif', '流口水.gif', '潜水.gif', '咒骂.gif', '耶耶.gif', '被揍.gif', '抱走.gif'];

const spanstyle = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #ccc; display:none;border-radius: 10%;';

const a1style = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #66ccff;border-radius: 10%;';

const a2style = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #d19275; border-radius: 10%; text-align: center;';

const a3style = 'color: #fff; padding: 2px 4px; font-size: 14px; background-color: #66ccff;float: right;border-radius: 20%;font-weight: bold;margin-right: 5px;';

const bt4style = 'margin-bottom:10px; margin-top:10px;';

// 一键删除
const url = window.location.href;
const shouldExecute = url.includes("siteid") && url.includes("classid") && url.includes("key") && url.includes("type");
const isSearchAction = !url.endsWith("action=search");

if (shouldExecute && isSearchAction) {
  const listData = document.querySelectorAll(".listdata");
  const deleteStyle = "padding: 0px 4px; font-size: 14px; border-radius: 10%; font-weight: bold; color: #fff; background: #ff8080; display: none; margin-bottom: -10px;";

  const toggleDeleteButton = document.createElement("input");
  toggleDeleteButton.type = "button";
  toggleDeleteButton.value = "打开一键删除";
  toggleDeleteButton.style.cssText = "padding: 2px 4px; font-size: 14px; background-color: #66ccff; border-radius: 10%; color: #fff; margin-left: auto;";
  
  const titleDiv = document.querySelector(".title");
  titleDiv.style.display = "flex";
  titleDiv.style.justifyContent = "space-between";
  titleDiv.appendChild(toggleDeleteButton);

  listData.forEach((data, index) => {
    const deleteSpan = document.createElement("span");
    deleteSpan.textContent = `删除${"①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮"[index]}`;
    deleteSpan.style.cssText = deleteStyle;

    data.appendChild(deleteSpan);

    deleteSpan.addEventListener("click", () => {
      const link = data.querySelector("a:nth-of-type(2)");
      const href = link.getAttribute("href");
      const pattern = /classid=(\d+).*id=(\d+)/;
      const match = pattern.exec(href);
      const classid = match[1];
      const id = match[2];

      window.location.href = `https://yaohuo.me/bbs/book_view_del.aspx?action=godel&id=${id}&siteid=1000&classid=${classid}&lpage=1`;
    });
  });

  toggleDeleteButton.addEventListener("click", toggleDelete);

  function toggleDelete() {
    const deleteSpans = document.querySelectorAll(".listdata span:not(.right)");
    const isOpen = toggleDeleteButton.value === "打开一键删除";

    deleteSpans.forEach(span => {
      span.style.display = isOpen ? "inline-block" : "none";
    });

    toggleDeleteButton.value = isOpen ? "关闭一键删除" : "打开一键删除";
  }
}


if (/^\/bbs-.*\.html$/.test(window.location.pathname) || viewPage.includes(window.location.pathname)) {
    const form = document.getElementsByName('f')[0];
    const face = form.getElementsByTagName('select')[0];
    const sendmsg = form.getElementsByTagName('select')[1];
    sendmsg.insertAdjacentHTML('afterend', '<span style="' + a1style + '" id="unfold">表情展开</span>' + '<span id="facelong"></span>');
    let unfold = document.getElementById('unfold');
    let spread = false;
    unfold.onclick = function unfoldFace() {
        let facehtml = '';
        if (!spread) {
            spread = true;
            faceList.forEach((faceStr, i) => {
                facehtml += '<img id="setFace' + i + '" style="width: 32px; height: 32px" src="face/' + faceStr + '" value="' + faceStr.split('.')[0] + '.gif"></img>';
            });
            facelong.insertAdjacentHTML('beforebegin', '<div id="facearea">' + facehtml + '</div>');
            const facearea = document.getElementById('facearea');
            for (let i = 0; i < faceList.length; i++) {
                document.getElementById('setFace' + i).onclick = function setFace() {
                    face.value = faceList[i];
                    form.removeChild(facearea);
                    spread = false;
                };
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
        `
        <span id='ubb_znhf' type="submit" style="${a3style};">一键回复</span>

<select name="diyface" style='background-color: #fffafa;float: right;font-weight: bold;font-size: 15px;margin-top: 5px;margin-right: 10px;'>
    <option name="1" value="">选择表情</option>
    <option id="ubb_jw" value="ubb_jw">稽舞</option>
    <option id="ubb_sj" value="ubb_sj">色稽</option>
    <option id="ubb_nn" value="ubb_nn">扭扭</option>
    <option id="ubb_jy" value="ubb_jy">摸鱼</option>
    <option id="ubb_pt" value="ubb_pt">拍头</option>
    <option id="ubb_jg" value="ubb_jg">稽狗</option>
    <option id="ubb_sq" value="ubb_sq">手枪</option>
    <option id="ubb_dq" value="ubb_dq">打拳</option>
    <option id="ubb_tp" value="ubb_tp">躺平</option>
    <option id="ubb_jj" value="ubb_jj">撒娇</option>
    <option id="ubb_mq" value="ubb_mq">没钱</option>
    <option id="ubb_tg" value="ubb_tg">听歌</option>
    <option id="ubb_nt" value="ubb_nt">男同</option>
    <option id="ubb_gj" value="ubb_gj">跪稽</option>
    <option id="ubb_qy" value="ubb_qt">乞讨</option>
    <option id="ubb_gz" value="ubb_gz">鼓掌</option>
    <option id="ubb_sw" value="ubb_sw">骚舞</option>
    <option id="ubb_bs" value="ubb_bs">鄙视</option>
    <option id="ubb_cs" value="ubb_cs">吃屎</option>
    <option id="ubb_tt" value="ubb_tt">踢腿</option>
    <option id="ubb_st" value="ubb_st">伸头</option>
    <option id="ubb_zj" value="ubb_zj">追稽</option>
    <option id="ubb_lsj" value="ubb_lsj">司稽</option>
    <option id="ubb_dn" value="ubb_dn">刀你</option>
    <option id="ubb_cc" value="ubb_dp">冲刺</option>
    <option id="ubb_zq" value="ubb_zq">转圈</option>
    <option id="ubb_cj" value="ubb_cj">吃稽</option>
    <option id="ubb_fj" value="ubb_fj">犯贱</option>
    <option id="ubb_nb" value="ubb_nb">牛掰</option>
    <option id="ubb_yb" value="ubb_yb">拥抱</option>
  </select>

        <br><center><a id='ubb_nzgsa' style="${a2style}">你真该死啊</a>
        <a id='ubb_hr' style="${a2style}">分割线</a>
        <a id='ubb_jz' style="${a2style}; display: none;">居左</a>
        <a id='ubb_hhf' style="${a2style}">换行符</a>
        <a id='ubb_jyo' style="${a2style}; display: none;">居右</span>
        <a id='ubb_url' style="${a1style}">超链</a>
         <a id='ubb_img' style="${a1style}">图片</a>
         <a href='https://www.yaohuo.me/tuchuang/' target="_blank" style="${a1style}">图床</a>
         <a href='https://img.ink/' target="_blank" style="${a1style}">水墨图床</a>
        </a>
      `
    );

//选择表情后自动点击评论区调出输入法
var selectElem = document.querySelector('[name="diyface"]');
selectElem.addEventListener('change', function () {
  var selectedValue = this.value;
  if (selectedValue !== '') {
    var textareaElem = document.querySelector('[name="content"]');
    textareaElem.focus();
  }
});

//监测select选项的变化
var textareaname = document.querySelector('[name="content"]');
var selectElement = document.querySelector('[name="diyface"]');
var lastValue = "";
selectElement.addEventListener('change', function() {
  var selectedOption = selectElement.selectedOptions[0];
  var selectedValue = "[" + selectedOption.value + "]"; // 在选项值前后添加中括号
  // 将上一次插入的值用空字符串替换掉
  textareaname.value = textareaname.value.replace(lastValue, "");
  // 记录本次插入的值
  lastValue = selectedValue;
});

    // 超链接
    const textarea = document.querySelector(
        "body > div.sticky > form > textarea"
    );

//diy表情包
const quickReplyBtn = document.querySelector("input[name='g']");
document.getElementById("ubb_znhf").addEventListener("click", (e) => {
  e.preventDefault();

  const textarea = document.querySelector("textarea[name='content']");

  //返回值匹配表情包ID
  if (textarea.value !== "") {
    // 获取所选UBB代码
    const selectedValue = document.querySelector("select[name='diyface']").value;
    //把光标移到文本框最前面
    textarea.focus();
    textarea.setSelectionRange(0, 0);
    // 根据所选UBB代码插入不同的表情包
    if (selectedValue === "ubb_jy") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FhBfMfl4sGC3QJVTMaLqEKkE90Ia#.gif[/img]", 0);
    } else if (selectedValue === "ubb_jw") {
      insertText(textarea, "[img=46,70]http://static2.51gonggui.com/FmNyrjU8Wq0m3PiwHQJwDhHdv-EJ#.gif[/img]", 0);
    } else if (selectedValue === "ubb_sj") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FoKvdu89eiq0q-24IfOM2mFB0vIq#.gif[/img]", 0);
    } else if (selectedValue === "ubb_dq") {
      insertText(textarea, "[img=70,70]https://pic.ziyuan.wang/2023/10/10/Mayun_4a977157e17fa.gif[/img]", 0);
    } else if (selectedValue === "ubb_jj") {
      insertText(textarea, "[img=57,70]http://static2.51gonggui.com/FrZ6GDJiOAz3pp4e5_8uSShSXXXk#.gif[/img]", 0);
    } else if (selectedValue === "ubb_jg") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/FiZiSSyXSa8eCzwOXmIfOOpfA_7a#.gif[/img]", 0);
    } else if (selectedValue === "ubb_mq") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/FqNDzswUNJ-AsSHXyxXB4Qm1X0y-#.gif[/img]", 0);
    } else if (selectedValue === "ubb_sw") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/Fsq-HyBc5lP6vZY_qeWofOM9mRVH#.gif[/img]", 0);
    } else if (selectedValue === "ubb_cs") {
      insertText(textarea, "[img=70,51]http://static2.51gonggui.com/FhCk4emkrO9f8ICFxKlm8wBcTOgT#.gif[/img]", 0);
    } else if (selectedValue === "ubb_bs") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/FkEHwSlEfQ7bWya6-wg366Xy91qW#.gif[/img]", 0);
    } else if (selectedValue === "ubb_tg") {
      insertText(textarea, "[img]http://static2.51gonggui.com/Fi2hY7M9DPgD9s0aCWemwk2iYUDW#.gif[/img]", 0);
    } else if (selectedValue === "ubb_st") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/Fhry6EpdUBqFCt3OOyQTkLZMZGFR#.gif[/img]", 0);
    } else if (selectedValue === "ubb_gz") {
      insertText(textarea, "[img=70,86]http://static2.51gonggui.com/FhgYnWJ-apnyjSXOpInJhLbfUQFY#.gif[/img]", 0);
    } else if (selectedValue === "ubb_tt") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FvSxOEIhyA7ID1J8emIME7tBT7Io#.gif[/img]", 0);
    } else if (selectedValue === "ubb_nt") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/10/05/yaohuo007_0d2c7f295ce74.jpg[/img]", 0);
    } else if (selectedValue === "ubb_sq") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FgXUeACmKWWMDT9hrpVAnQp4dCqF#.gif[/img]", 0);
    } else if (selectedValue === "ubb_pt") {
      insertText(textarea, "[img]http://static2.51gonggui.com/Fg_qtra3abNozPxaoEMVKO7VIsuX#.gif[/img]", 0);
    } else if (selectedValue === "ubb_tp") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FnNg1vOiuOlSe7WFWRyNZfO_4H3U#.gif[/img]", 0);
    } else if (selectedValue === "ubb_zj") {
      insertText(textarea, "[img]http://static2.51gonggui.com/Fj7WAkv87tpL1I26WQgSaXlsyYBL#.gif[/img]", 0);
    } else if (selectedValue === "ubb_lsj") {
      insertText(textarea, "[img=70,70]http://static2.51gonggui.com/FgwFBazeUavJcw-SL7FS6wUkcUTk#.gif[/img]", 0);
    } else if (selectedValue === "ubb_qt") {
      insertText(textarea, "[img=70,45]http://static2.51gonggui.com/FjXNVx-MUgAVq62aNqekSPOUjDAC#.gif[/img]", 0);
    } else if (selectedValue === "ubb_gj") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FjudMlJdd8dLXuGjyASN7JldAxqe#.gif[/img]", 0);
    } else if (selectedValue === "ubb_dn") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/10/05/yaohuo007_fd6d0ab3998ca.gif[/img]", 0);
    } else if (selectedValue === "ubb_dp") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/10/05/yaohuo007_4f00b418adcc6.gif[/img]", 0);
    } else if (selectedValue === "ubb_zq") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/10/05/yaohuo007_6d248534e18f5.gif[/img]", 0);
    } else if (selectedValue === "ubb_cj") {
      insertText(textarea, "[img]http://static2.51gonggui.com/Fmf5aWS5yqycKebxTno7un53h9HW#.gif[/img]", 0);
    } else if (selectedValue === "ubb_fj") {
      insertText(textarea, "[img]http://static2.51gonggui.com/FhUkLD2khZ7hn1uzArWkT47Pd9jq#.gif[/img]", 0);
    } else if (selectedValue === "ubb_nb") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/10/05/yaohuo007_725ca2fc60ace.gif[/img]", 0);
    } else if (selectedValue === "ubb_yb") {
      insertText(textarea, "[img]https://pic.ziyuan.wang/2023/05/17/177e4e0e2f28d.gif[/img]", 0);
    } else if (selectedValue === "ubb_nn") {
      insertText(textarea, "[img=70,70]https://pic.ziyuan.wang/2023/06/27/e9a2be0a1139f.gif[/img]", 0);
    }

    // 插入智能回复的内容
    //insertText(textarea, "[right]", 0);
    // 触发快速回复按钮的点击事件
    quickReplyBtn.click();
    textarea.value = "";
    textarea.blur();
  }
});


//其他评论ubb模块
document.getElementById("ubb_jyo").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "[right]", 0);
    });
document.getElementById("ubb_jz").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "[left]", 0);
    });
document.getElementById("ubb_hhf").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "///", 0);
    });
document.getElementById("ubb_hr").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "[hr]", 0);
    });
document.getElementById("ubb_nzgsa").addEventListener("click", () => {
    const textarea = document.querySelector('[name="content"]');
    if (textarea.value !== "") {
        const regex = /\[audio=[\w]+\].*\[\/audio\]/;
        if (regex.test(textarea.value)) {
            alert("你已经插入一个啦，别太贪心！");
        } else {
            insertText(textarea, "[audio=X]https://file.uhsea.com/2304/3deb45e90564252bf281f47c7b47a153KJ.mp3[/audio]", 0);
        }
    } else {
        alert("不要无意义灌水啦！");
    }
});

document.getElementById("ubb_url").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "[url][/url]", 6);
    });
document.getElementById("ubb_img").addEventListener("click", (e) => {
        const textarea = document.querySelector('[name="content"]');
        e.preventDefault();
        insertText(textarea, "[img][/img]", 6);
    });
} else if (
    postPage.includes(window.location.pathname)
) {
    // 发帖UBB增强
    // 2023-10-5修复新版UI问题
    let textarea = document.querySelector('textarea[name="book_content"]');
    let container = textarea.parentNode;
    container.style.display = 'flex';
    container.style.flexDirection = 'column';


    let bookContent = document.getElementsByName("book_content")[0];
    bookContent.insertAdjacentHTML(
        "beforebegin",
        `<div class='bt4'>
  <a id='ubb_a'>超链接</a>
  <a id='ubb_img'>图片</a>
  <a id='ubb_movie'>视频</a>
  <a id='ubb_more'>更多</a>
</div>
<div class='' id='more_ubb_tools' style='display: none; width:100%;'>
<div class='bt4' style='${bt4style};'>
  <a id='ubb_s'>删除线</a>
  <a id='ubb_f'>文字颜色</a>
  <a id='ubb_back'>背景色</a>
  <a id='ubb_font'>字体</a>
</div>
<div class='bt4' style='${bt4style};'>
  <a id='ubb_b'>加粗</a>
  <a id='ubb_on'>在线人数</a>
  <a id='ubb_u'>下划线</a>
  <a id='ubb_i'>斜体</a>
</div>
<div class='bt4'style='${bt4style};'>
  <a id='ubb_ip'>ip</a>
  <a id='ubb_id'>id</a>
  <a id='ubb_audio'>音频</a>
  <a id='ubb_left'>居左</a>
</div>
<div class='bt4'style='${bt4style};'>
  <a id='ubb_center'>居中</a>
  <a id='ubb_right'>居右</a>
  <a id='ubb_textind'>文本缩进</a>
  <a id='ubb_hr'>分割线</a>
</div>
<div class='bt4'style='${bt4style};'>
  <a id='ubb_next'>下一页</a>
  <a href='https://scflover.cf/dy'>抖音解析</a>
  <a href='https://www.yaohuo.me/tuchuang/'>妖火图床</a>
  <a href='https://img.ink/'>水墨图床</a>
</div>
</div>`
    );

document.getElementById("ubb_more").addEventListener("click", () => {
    let ubb_tool = document.getElementById("more_ubb_tools");
    ubb_tool.style.display = ubb_tool.style.display === "none" ? "block" : "none";
});

document.getElementById("ubb_next").addEventListener("click", () => insertText(bookContent, "[next]", 0));

document.getElementById("ubb_right").addEventListener("click", () => insertText(bookContent, "[right]", 0));

document.getElementById("ubb_id").addEventListener("click", () => insertText(bookContent, "[userid]", 0));

document.getElementById("ubb_on").addEventListener("click", () => insertText(bookContent, "[online]", 0));

document.getElementById("ubb_ip").addEventListener("click", () => insertText(bookContent, "[ip]", 0));

document.getElementById("ubb_u").addEventListener("click", () => insertText(bookContent, "[u][/u]", 4));

document.getElementById("ubb_i").addEventListener("click", () => insertText(bookContent, "[i][/i]", 4));
 document.getElementById("ubb_hr").addEventListener("click", () => insertText(bookContent, "[hr]", 0));

document.getElementById("ubb_font").addEventListener("click", () => insertText(bookContent, "[font=serif][/font]", 7));

document.getElementById("ubb_left").addEventListener("click", () => insertText(bookContent, "[left]", 0));

document.getElementById("ubb_center").addEventListener("click", () => insertText(bookContent, "[center]", 0));

document.getElementById("ubb_textind").addEventListener("click", () => insertText(bookContent, "[tab][tab][tab][tab][tab][tab]", 0));

document.getElementById("ubb_a").addEventListener("click", () => insertText(bookContent, "[url][/url]", 6));

const colors = [
  "#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#00FFFF", "#FFFF00", 
  "#000000", "#70DB93", "#5C3317", "#9F5F9F", "#B5A642", "#D9D919", "#A67D3D", 
  "#8C7853", "#5F9F9F", "#D98719", "#B87333", "#FF7F00", "#42426F", 
  "#5C4033", "#2F4F2F", "#4A766E", "#9932CD", "#871F78", "#6B238E", 
  "#2F4F4F", "#97694F", "#32CD32", "#E47833", "#8E236B", "#32CD99", "#3232CD", 
  "#6B8E23", "#EAEAAE", "#9370DB", "#426F42", "#7F00FF", "#7FFF00", "#70DBDB", 
  "#DB7093", "#A68064", "#23238E", "#4D4DFF", "#FF6EC7", "#00009C", 
  "#EBC79E", "#CFB53B", "#FF7F00", "#FF2400", "#DB70DB", "#8FBC8F", "#BC8F8F", 
  "#EAADEA", "#D9D9F3", "#5959AB", "#6F4242", "#BC1717", "#238E68", "#6B4226", 
  "#8E6B23", "#E6E8FA", "#3299CC", "#007FFF", "#FF1CAE", "#00FF7F", "#236B8E", 
  "#38B0DE", "#DB9370", "#D8BFD8", "#ADEAEA", "#CDCDCD", "#4F2F4F", 
  "#CC3299", "#D8D8BF", "#99CC32"
];

function generateRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

document.getElementById("ubb_f").addEventListener("click", () => {
  const attribute = document.getElementById("ubb_back").checked ? "backcolor" : "forecolor";
  const randomColor = generateRandomColor();
  insertText(bookContent, `[${attribute}=${randomColor}][/${attribute}]`, 12);
});

document.getElementById("ubb_back").addEventListener("click", () => {
  const randomColor = generateRandomColor();
  insertText(bookContent, `[backcolor=${randomColor}][/backcolor]`, 12);
});

document.getElementById("ubb_b").addEventListener("click", () => insertText(bookContent, "[b][/b]", 4));

document.getElementById("ubb_s").addEventListener("click", () => insertText(bookContent, "[strike][/strike]", 9));
    
document.getElementById("ubb_img").addEventListener("click", () => insertText(bookContent, "[img][/img]", 6));
    document.getElementById("ubb_movie").addEventListener("click", () => insertText(bookContent, "[movie=100%*100%]|[/movie]", 9));
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

//自动吃肉
const yushuzi = document.querySelector('.yushuzi').textContent;
const id = document.querySelector('input[name="id"]').value;
const textarea = document.querySelector('textarea.retextarea');
const timeid = new Date().toISOString().substr(0, 10).replace(/-/g, '') + id;
const timeidArray = JSON.parse(localStorage.getItem('timeid') || '[]');
const previousText = localStorage.getItem('previousText') || '';

if (parseInt(yushuzi) > 0 && !timeidArray.includes(timeid)) {
  const insertText = previousText === '吃肉' ? '吃吃吃' : '吃肉';
  localStorage.setItem('previousText', insertText);
  textarea.value = insertText + ' ' + textarea.value;
  document.querySelector('input[name="g"]').click();
  timeidArray.push(timeid);
  localStorage.setItem('timeid', JSON.stringify(timeidArray));
  console.log("timeid:", timeid);
}

