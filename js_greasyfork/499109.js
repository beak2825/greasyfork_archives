// ==UserScript==
// @name              番茄在线免费读
// @namespace         https://github.com/xxxxx
// @version           6.30
// @description       番茄小说免费网页阅读
// @author            xxxxx
// @license           MIT License
// @match             https://fanqienovel.com/*
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon              data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zNS40Mjg2IDQuODg0MzVDMzkuNjQ2MyA0Ljg4NDM1IDQzLjA4MTYgOC4zMTk3MyA0My4wODE2IDEyLjUzNzRWMzUuNDI4NkM0My4wODE2IDM5LjY0NjMgMzkuNjQ2MyA0My4wODE2IDM1LjQyODYgNDMuMDgxNkgxMi41Mzc0QzguMzE5NzMgNDMuMDgxNiA0Ljg4NDM1IDM5LjY0NjMgNC44ODQzNSAzNS40Mjg2VjEyLjUzNzRDNC44ODQzNSA4LjMxOTczIDguMzE5NzMgNC44ODQzNSAxMi41Mzc0IDQuODg0MzVIMzUuNDI4NlpNMzUuNDI4NiA0SDEyLjUzNzRDNy44MDk1MiA0IDQgNy44MDk1MiA0IDEyLjUzNzRWMzUuNDI4NkM0IDQwLjE1NjUgNy44MDk1MiA0My45NjYgMTIuNTM3NCA0My45NjZIMzUuNDI4NkM0MC4xNTY1IDQzLjk2NiA0My45NjYgNDAuMTU2NSA0My45NjYgMzUuNDI4NlYxMi41Mzc0QzQ0IDcuODA5NTIgNDAuMTU2NSA0IDM1LjQyODYgNFoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMjkuMTAxNiA0VjEyLjQwMTRMMzIuMzMyOSAxMC41NjQ2TDM1LjU2NDEgMTIuNDAxNFY0SDI5LjEwMTZaIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTI0LjAzNCAxOC4yODU4QzE1LjgzNjcgMTguMjg1OCA4LjU1NzgyIDIxLjg1NzIgNCAyNy4zNjc0VjM1LjQyODZDNCA0MC4xNTY1IDcuODA5NTIgNDMuOTY2IDEyLjUzNzQgNDMuOTY2SDM1LjQyODZDNDAuMTU2NSA0My45NjYgNDMuOTY2IDQwLjE1NjUgNDMuOTY2IDM1LjQyODZWMjcuMjY1NEMzOS40MDgyIDIxLjc4OTIgMzIuMTk3MyAxOC4yODU4IDI0LjAzNCAxOC4yODU4Wk0xNC42MTIyIDM3LjY3MzVDMTMuMTE1NiAzNy42NzM1IDEyLjQwMTQgMzcuMTI5MyAxMi40MDE0IDM2LjQxNUMxMi40MDE0IDM1LjcwMDcgMTMuMDgxNiAzNS4xMjI1IDE0LjU3ODIgMzUuMTIyNUMxNi4wNzQ4IDM1LjEyMjUgMTcuODc3NiAzNi4zODEgMTcuODc3NiAzNi4zODFDMTcuODc3NiAzNi4zODEgMTYuMTA4OCAzNy42NzM1IDE0LjYxMjIgMzcuNjczNVpNMTUuODM2NyAzMS4yMTA5QzE0Ljc0ODMgMzAuMTU2NSAxNC42NDYzIDI5LjI3MjIgMTUuMTU2NSAyOC43NjJDMTUuNjY2NyAyOC4yNTE4IDE2LjU1MSAyOC4zMTk4IDE3LjYzOTUgMjkuNDA4MkMxOC43Mjc5IDMwLjQ2MjYgMTkuMDY4IDMyLjYwNTUgMTkuMDY4IDMyLjYwNTVDMTkuMDY4IDMyLjYwNTUgMTYuODkxMiAzMi4yNjU0IDE1LjgzNjcgMzEuMjEwOVpNMjQuMDM0IDMwLjQ2MjZDMjQuMDM0IDMwLjQ2MjYgMjIuNzQxNSAyOC43Mjc5IDIyLjcwNzUgMjcuMTk3M0MyMi43MDc1IDI1LjcwMDcgMjMuMjUxNyAyNC45ODY0IDIzLjk2NiAyNC45ODY0QzI0LjY4MDMgMjQuOTg2NCAyNS4yNTg1IDI1LjY2NjcgMjUuMjU4NSAyNy4xNjMzQzI1LjI5MjUgMjguNjkzOSAyNC4wMzQgMzAuNDYyNiAyNC4wMzQgMzAuNDYyNlpNMzAuMzYwNSAyOS4zNzQyQzMxLjQ0OSAyOC4zMTk4IDMyLjMzMzMgMjguMjUxOCAzMi44NDM1IDI4LjcyNzlDMzMuMzUzNyAyOS4yMzgxIDMzLjI1MTcgMzAuMTIyNSAzMi4xNjMzIDMxLjE3NjlDMzEuMDc0OCAzMi4yMzEzIDI4LjkzMiAzMi41Mzc1IDI4LjkzMiAzMi41Mzc1QzI4LjkzMiAzMi41Mzc1IDI5LjI3MjEgMzAuNDI4NiAzMC4zNjA1IDI5LjM3NDJaTTMzLjM1MzcgMzcuNjczNUMzMS44NTcxIDM3LjY3MzUgMzAuMDg4NCAzNi4zNDcgMzAuMDg4NCAzNi4zNDdDMzAuMDg4NCAzNi4zNDcgMzEuODU3MSAzNS4wODg1IDMzLjM4NzggMzUuMDg4NUMzNC44ODQ0IDM1LjA4ODUgMzUuNTk4NiAzNS43MDA3IDM1LjU2NDYgMzYuMzgxQzM1LjU2NDYgMzcuMTI5MyAzNC44NTAzIDM3LjY3MzUgMzMuMzUzNyAzNy42NzM1WiIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499109/%E7%95%AA%E8%8C%84%E5%9C%A8%E7%BA%BF%E5%85%8D%E8%B4%B9%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/499109/%E7%95%AA%E8%8C%84%E5%9C%A8%E7%BA%BF%E5%85%8D%E8%B4%B9%E8%AF%BB.meta.js
// ==/UserScript==

const styleElement = document.createElement("style");
const cssRule = `
    @keyframes hideAnimation {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.75;
      }
      100% {
        opacity: 0;
        display: none;
      }
    }

    option:checked {
        background-color: #ffb144;
        color: white;
    }
    `;
const CODE_ST = 58344;
const CODE_ED = 58715;
const charset = ['D', '在', '主', '特', '家', '军', '然', '表', '场', '4', '要', '只', 'v', '和', '?', '6', '别', '还', 'g',
'现', '儿', '岁', '?', '?', '此', '象', '月', '3', '出', '战', '工', '相', 'o', '男', '直', '失', '世', 'F',
'都', '平', '文', '什', 'V', 'O', '将', '真', 'T', '那', '当', '?', '会', '立', '些', 'u', '是', '十', '张',
'学', '气', '大', '爱', '两', '命', '全', '后', '东', '性', '通', '被', '1', '它', '乐', '接', '而', '感',
'车', '山', '公', '了', '常', '以', '何', '可', '话', '先', 'p', 'i', '叫', '轻', 'M', '士', 'w', '着', '变',
'尔', '快', 'l', '个', '说', '少', '色', '里', '安', '花', '远', '7', '难', '师', '放', 't', '报', '认',
'面', '道', 'S', '?', '克', '地', '度', 'I', '好', '机', 'U', '民', '写', '把', '万', '同', '水', '新', '没',
'书', '电', '吃', '像', '斯', '5', '为', 'y', '白', '几', '日', '教', '看', '但', '第', '加', '候', '作',
'上', '拉', '住', '有', '法', 'r', '事', '应', '位', '利', '你', '声', '身', '国', '问', '马', '女', '他',
'Y', '比', '父', 'x', 'A', 'H', 'N', 's', 'X', '边', '美', '对', '所', '金', '活', '回', '意', '到', 'z',
'从', 'j', '知', '又', '内', '因', '点', 'Q', '三', '定', '8', 'R', 'b', '正', '或', '夫', '向', '德', '听',
'更', '?', '得', '告', '并', '本', 'q', '过', '记', 'L', '让', '打', 'f', '人', '就', '者', '去', '原', '满',
'体', '做', '经', 'K', '走', '如', '孩', 'c', 'G', '给', '使', '物', '?', '最', '笑', '部', '?', '员', '等',
'受', 'k', '行', '一', '条', '果', '动', '光', '门', '头', '见', '往', '自', '解', '成', '处', '天', '能',
'于', '名', '其', '发', '总', '母', '的', '死', '手', '入', '路', '进', '心', '来', 'h', '时', '力', '多',
'开', '已', '许', 'd', '至', '由', '很', '界', 'n', '小', '与', 'Z', '想', '代', '么', '分', '生', '口',
'再', '妈', '望', '次', '西', '风', '种', '带', 'J', '?', '实', '情', '才', '这', '?', 'E', '我', '神', '格',
'长', '觉', '间', '年', '眼', '无', '不', '亲', '关', '结', '0', '友', '信', '下', '却', '重', '己', '老',
'2', '音', '字', 'm', '呢', '明', '之', '前', '高', 'P', 'B', '目', '太', 'e', '9', '起', '稜', '她', '也',
'W', '用', '方', '子', '英', '每', '理', '便', '四', '数', '期', '中', 'C', '外', '样', 'a', '海', '们',
'任'];

function interpreter(cc) {
let bias = cc - CODE_ST;
if (bias < 0 || bias >= charset.length || charset[bias] === '?') {
return String.fromCharCode(cc);
}
return charset[bias];
}

function r_content(content) {
    let newText = '';
    try {
        for (var text of content) {
            let len = text.length;

            for (var ind = 0; ind < len; ind++) {
                let cc = text.charCodeAt(ind);
                var ch = text.charAt(ind);
                if (cc >= CODE_ST && cc <= CODE_ED) {
                    ch = interpreter(cc);
                }
                newText += ch;
            }
        }
    } catch(err) {
        console.log(err);
    }
    return newText;
};



styleElement.innerHTML = cssRule;
document.head.appendChild(styleElement);

function hideElement(ele) {
  ele.style.animation = "hideAnimation 1.5s ease";
  ele.addEventListener("animationend", function () {
    ele.style.display = "none";
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



const mark=(ele)=>ele.style.boxShadow = "0px 0px 50px rgba(0, 0, 0, 0.2)";

(function() {
    'use strict';

            const div=document.querySelector("#app > div > div > div > div.reader-toolbar > div > div.reader-toolbar-item.reader-toolbar-item-download")
            const text=div.querySelector('div:nth-child(2)')
            mark(div)
            div.querySelector('div:nth-child(2)').innerHTML='处理中'

            document.title=document.title.replace(/在线免费阅读_番茄小说官网$/, '')

            var currentURL=window.location.href
            setInterval(() => window.location.href !== currentURL ? location.reload() : null, 1000);

            const cdiv=document.getElementsByClassName('muye-reader-content noselect')[0]
            cdiv.classList=cdiv.classList[0]
            const url = window.location.href;
            const regex = /\/(\d+)/;
            const match = url.match(regex);
            const extractedId = match[1];
            //const apiUrl = `https://fqnovel.api-server.onflashdrive.app/content/${extractedId}`;
            const apiUrl = `https://fanqienovel.com/api/reader/full?itemId=${extractedId}`;
            const cookie = "novel_web_id=7357767624615331362;"

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                timeout:15000,
                headers: {
                        "Content-Type": "application/json",
                        "Accept":"application/json, text/plain, */*",
                    },
                anonymous:  true,
                cookie:cookie,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);

                        const rcontent = r_content(data.data.chapterData.content);
                        console.log(rcontent);
                        document.getElementsByClassName('muye-to-fanqie')[0] ?. remove();

                        cdiv.innerHTML=data.data.chapterData.content

    

                        div.style.backgroundColor='#B0E57C'
                        text.innerHTML='成功'
                        hideElement(div)
                    }
                },
                onerror: function() {
                    div.style.backgroundColor='pink'
                    text.innerHTML='失败'
                    hideElement(div)

                }
            });

    }

)();
