// ==UserScript==
// @name         aoguai-智慧树（知到）习惯分平时分问答半自动复读垃圾话生成器
// @namespace    http://tampermonkey.net/
// @version      1.1.9.1
// @description  智慧树（知到）习惯分平时分问答半自动复读垃圾话生成器
// @author       aoguai
// @copyright    2023, aoguai (https://github.com/aoguai)
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        https://qah5.zhihuishu.com/qa.html
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437990/aoguai-%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%88%E7%9F%A5%E5%88%B0%EF%BC%89%E4%B9%A0%E6%83%AF%E5%88%86%E5%B9%B3%E6%97%B6%E5%88%86%E9%97%AE%E7%AD%94%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A4%8D%E8%AF%BB%E5%9E%83%E5%9C%BE%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437990/aoguai-%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%88%E7%9F%A5%E5%88%B0%EF%BC%89%E4%B9%A0%E6%83%AF%E5%88%86%E5%B9%B3%E6%97%B6%E5%88%86%E9%97%AE%E7%AD%94%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A4%8D%E8%AF%BB%E5%9E%83%E5%9C%BE%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

/**
 * 主要配置参数
 */
const publish_p = 0; // 进入问答后是否自动点击发表。可改为1或0。1为自动点击发表，0为手动点击发表。默认为0
const nonsense_p = 0; // 进入问答后自动输入时，是否需要中立与否定回答。可改为0、1、2、3。0为都不需要，1为需要中立回答，2为需要否定回答，3为都需要，默认为0
const close_p = 0; // 进入问答发表后是否自动关闭问答。（需要配合publish_p实现，仅publish_p开启时有效）可改为1或0。1为是，0为否。默认为0


(function() {
    /**
   * 初始化事件
   */
    const e = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    });
    const input = new Event("input");

    const CASLOGC = document.cookie.split(';')
    .filter(item => item.includes('CASLOGC'))
    .toString().trim()
    .replace(/\"/g, "'").split('=')[1]
    const uuid = JSON.parse(decodeURIComponent(CASLOGC)).uuid
    let params = {
        uuid: uuid, dateFormate: new Date() * 1,
        pageIndex: 0, pageSize: 50
    }
    params.recruitId = document.URL.split('?')[1].split('&')
        .filter( item => item.includes('recruitId'))[0].split('=')[1]
    params.courseId = document.URL.split('/')[6].split('?')[0]

    /**
   * 转换肯定句为否定句的函数
   * @param {string} sentence 原始句子
   * @returns {string} 转换后的句子
   */
    function convertPositiveToNegative(sentence) {
        const patterns = [
            { regex: /是/g, replacement: '不是' },
            { regex: /有/g, replacement: '没有' },
            // 添加更多的替换规则...
        ];

        let result = sentence;
        patterns.forEach(pattern => {
            result = result.replace(pattern.regex, pattern.replacement);
        });

        return result;
    }

    /**
   * 垃圾话生成函数
   * @param {string} mode 生成模式
   * @returns {string} 垃圾话
   */
    function generateTrashTalk(mode) {
        const answerContentElement = document.querySelector('.answer-content');
        const questionElement = answerContentElement ? answerContentElement.children[0] : null;
        let question = '';
        let ans = '';
        if (questionElement) {
            question = questionElement.innerText;
            ans = question;
        } else {
            const alternativeQuestionElement = document.querySelector('.question-content > p > span');
            if (alternativeQuestionElement) {
                question = alternativeQuestionElement.innerText;
                ans = question
                    .replace(/\?|。|！|!|？|\.|{是|对}{吗|嘛|么}|什么|/g, '')
                    .replace(/嘛|吗|么/g, '')
                    .replace(/是{否|不是}/g, '是')
                    .replace(/你们|你/g, '我')
                    .replace(/有没有/, '有')
                    .replace(/能不能/, '能')
                    .replace(/[\(|（][\u4E00-\u9FA5A-Za-z0-9_]+[\)|）]/g, '');
            }
        }
        const answer = {
            positive: [ans],
            negative: [convertPositiveToNegative(ans)],
            nonsense: [
                '我们需要辩证看待，有些是好的，有些是不好的',
                '这不是绝对的，我们要理性看待',
                '没有绝对是好的，还是坏的'
            ]
        };
        let answerArray = Object.values(answer);
        if (mode === '') {
            if (nonsense_p === 0) {
                answerArray = answer.positive;
            } else if (nonsense_p === 1) {
                answerArray = answer.nonsense.concat(answer.positive);
            } else if (nonsense_p === 2) {
                answerArray = answer.negative.concat(answer.positive);
            } else if (nonsense_p === 3) {
                answerArray = answer.nonsense.concat(answer.positive, answer.negative);
            }
        } else if (Object.keys(answer).includes(mode)) {
            answerArray = answer[mode];
        }
        const randomIndex = parseInt(Math.random() * 100) % answerArray.length;
        return answerArray[randomIndex];
    }


    /**
   * 渲染按钮样式
   * @returns {string} 按钮样式的 HTML
   */
    function Render() {
        return `
    <div class="wheel-panel">
      <button class="wheel-button wheel-positive">肯定</button>
      <button class="wheel-button wheel-negative">否定</button>
      <button class="wheel-button wheel-nonsense">中立</button>
    </div>
    <style>
      .wheel-panel {
        position: fixed;
        right: 30em;
        top: 12em;
        width: 8em;
        height: 3em;
        z-index: 3000;
      }
      .wheel-button {
        cursor:pointer;
        margin: .5em 0;
        padding: 0 .5em;
        height: 3em;
        width: 8em;
        border: 0;
        outline: 0;
        border-radius: .5em;
        color: #f0f8ff;
        font-size: 1.5em;
        letter-spacing: .1em;
      }
      .wheel-positive {
        background: #7fd826;
      }
      .wheel-negative {
        background: #d82626;
      }
      .wheel-positive:hover {
        background: #99e051;
      }
      .wheel-negative:hover {
        background: #e05151;
      }
      .wheel-nonsense {
        background: black;
      }
      .wheel-nonsense:hover {
        background: #333333;
      }
    </style>
  `;
    }

    /**
   * 绑定按钮事件
   */
    function binding() {
        const panel = document.querySelector('.wheel-panel');
        if (!panel) {
            console.log('panel not found');
            return;
        }

        panel.addEventListener('click', (e) => {
            const text = document.querySelector('.comment-input.el-textarea > textarea');
            const mode = e.target.classList[1].split('wheel-')[1];
            const trashTalk = generateTrashTalk(mode);
            console.log(trashTalk);
            console.log(text);
            text.value = trashTalk;
            text.dispatchEvent(input);
            publish();
        });
    }

    /**
   * 自动点击发表函数
   */
    const publish = () => {
        if (publish_p === 0) return;
        const btn = document.querySelector("div.up-btn.set-btn");
        if (!btn) return;
        btn.click();

        // 获取所有具有指定类名的 <span> 元素
        const spanElements = document.querySelectorAll('.ative-btn > span.ZHIHUISHU_QZMD');

        // 判断是否存在第二个匹配的元素，并点击它
        if (spanElements.length >= 2) {
            const secondSpanElement = spanElements[1];
            secondSpanElement.click();
            // 添加延时，延时时间为1秒（1000毫秒）
            setTimeout(() => {
                // 获取第一个具有指定类名的 <i> 元素
                const firstIElement = document.querySelector('i.iconfont.icondianzan1');

                // 判断是否存在匹配的 <i> 元素，并执行点击操作
                if (firstIElement) {
                    firstIElement.click();
                }
            }, 1000); // 设置延时为1秒
        }

        // 2秒后自动关闭当前窗口
        const delay = async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (close_p === 1) {
                const ua = navigator.userAgent;
                if (/MSIE/.test(ua)) {
                    // close IE
                    if (/MSIE 6.0/.test(ua)) {
                        window.opener = null;
                        window.close();
                    } else {
                        window.open("", "_top");
                        window.top.close();
                    }
                } else {
                    // close chrome;It is effective when it is only one.
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            }
        };

        delay();
    };

    /**
   * 添加按钮函数
   */
    function addWheelPanel() {
        const dialog = document.querySelector('.questionDialog.ZHIHUISHU_QZMD');
        if (dialog) {
            dialog.insertAdjacentHTML('beforeend', Render());
            binding();
        }
    }

    /**
   * 处理添加按钮可见性变化的回调
   */
    function handleIntersection(entries) {
        const wheelPanel = document.querySelector('.wheel-panel');
        if (entries[0].isIntersecting) {
            wheelPanel.style.display = 'block';
        } else {
            wheelPanel.style.display = 'none';
        }
    }

    /**
   * 调整添加按钮可见函数
   */
    function observeHeaderTitle() {
        const headerTitle = document.querySelector('.el-dialog__wrapper');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };
        const observer = new IntersectionObserver(handleIntersection, options);
        observer.observe(headerTitle);
    }

    window.onload = () => {
        async function detail() {
            const btn = document.querySelector('.my-answer-btn')
            if (btn == null) return
            btn.dispatchEvent(e)
            setTimeout(() => {
                const text = document.querySelector('textarea')
                if (!text) return
                text.innerText = generateTrashTalk("")
                text.dispatchEvent(input)
                binding()
            }, 200)
            setTimeout(function () {
                publish()
            }, 1000);
        }
        setTimeout(detail, 1000);
        // 在合适的时机调用该函数来添加渲染的按钮样式
        addWheelPanel();
        // 在合适的时机调用该函数来监听并处理可见性变化
        observeHeaderTitle();
    }
})();