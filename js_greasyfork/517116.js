// ==UserScript==
// @name         标注平台辅助校准
// @version      0.5
// @description  对AI研判内容有问题点击选择问题
// @author       my
// @match        *://qgpt-mark.skyeye.qianxin-inc.cn/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js
// @require      https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/index.min.js
// @require      https://unpkg.com/react-trigger-change/dist/react-trigger-change.js
// @license MIT
// @namespace https://greasyfork.org/users/1362442
// @downloadURL https://update.greasyfork.org/scripts/517116/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E6%A0%A1%E5%87%86.user.js
// @updateURL https://update.greasyfork.org/scripts/517116/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E6%A0%A1%E5%87%86.meta.js
// ==/UserScript==


class MarkTool {


    constructor() {
        console.log("这是构造函数");
    }

    run() {
        var that = this;
        // 设置定时器，定时添加各种按钮
        window.setInterval(function () {
            if (window.location.href.indexOf("/data-management/mark-data/list/calibrate/") != -1) {
                that.addRemoveEmptyLineBtn();
                that.addSuggestionSelect();
            }
        }, 1000);

    }
    addSuggestionSelect() {
        // 级联选择器
        const template = `
    <div class="suggestion-select1">
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ expandTrigger: 'hover' }"
      @change="handleChange"
      clearable></el-cascader>
  </div>
    `;
        if (!document.querySelector(".suggestion-select1")) {
            var header = document.querySelector(
                "#pane-model > div > div:nth-child(4) > div.header > div > div.item-header-left"
            );
            if (header) {
                var that = this;
                console.log("找到元素");
                const div = document.createElement("div");
                div.innerHTML = template;

                header.append(div);
            }
        }
    }

    // 增加去除空行按钮
    addRemoveEmptyLineBtn() {
        var that = this;
        if (!document.querySelector(".my-remove-empty-line")) {
            let header = document.querySelector(
                "#pane-model > div > div:nth-child(4) > div.header > div > div.item-header-left"
            );
            if (header) {
                //var div = document.createElement('div')
                let removeEmptyLineBtn = document.createElement("button");
                removeEmptyLineBtn.type = "button";
                removeEmptyLineBtn.onclick = function () {
                    //this.preventDefault();
                    console.log("点击了去除空行");
                    that.del_suggestion_empty_line();
                };
                removeEmptyLineBtn.className =
                    "q-button q-button--primary q-button--mini my-remove-empty-line";
                let span = document.createElement("span");
                span.textContent = "删除空行&序号重排";
                removeEmptyLineBtn.appendChild(span);
                header.append(removeEmptyLineBtn);
            }
        }
    }

    del_suggestion_empty_line() {
        var that = this;
        let value = that.get_suggestion();
        console.log("1211:", value);
        if (value.length == 0) {
        } else {
            // 去掉开头的空格
            value = value.trim();

            // 将连续的多个换行符替换为一个换行符
            value = value.replace(/\n+/g, "\n");

            // 重新计算编号
            let n = 1;
            value = value.replace(/^\d{1,2}\.\s/gm, () => {
                return `${n++}. `;
            });
            console.log("del_suggestion_empty_line:", value);
            that.setSuggestion(value);
        }
    }

    setSuggestion(selectedValue) {
        const textarea = document.querySelector("#pane-model > div > div:nth-child(5) > div > textarea");
        if (textarea) {
            console.log("textarea:", textarea);
            // 清空文本框内容
            textarea.value = '';
            // 更新文本区域的值
            textarea.focus();

            document.execCommand('insertText', false, selectedValue);

            // 可选：在控制台打印最终内容以进行调试
            console.log("Final content:", selectedValue);
        }
        else {
            console.log("没有找到textarea");
        }
    }
    get_suggestion() {
        let suggestionMarkdownEle = document.querySelector(
            "#pane-model > div > div:nth-child(5) > div > textarea"
        );
        if (suggestionMarkdownEle) {

            let value = suggestionMarkdownEle.value;
            return value;
        } else {
            return "";
        }
    }


}

function addElementUICSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
        "https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/theme-chalk/index.min.css";
    document.head.appendChild(link);
}
function findyanpanSelectElement() {
    console.log("油猴脚本测试");
    // 建议选择器的vue渲染
    const element = document.querySelector(".suggestion-select1");
    const vue_element = document.querySelector(".el-input.el-input--suffix");
    const jiaozhun_btn = document.querySelector(
        "#pane-model > div > div:nth-child(2) > div.header > div > div.radio > div > label:nth-child(1) > span.q-radio__label"
    );
    if (jiaozhun_btn && element && !vue_element) {
        console.log("渲染建议选择");
        var Main = {
            data() {
                return {
                    currentNumber: 1,
                    showLoading: false,
                    value: [],
                    options: [
                        {
                            value: "缺少信息",
                            label: "缺少信息",
                            children: [
                                {
                                    value: "缺少Payload分析",
                                    label: "缺少Payload分析",
                                },
                                {
                                    value: "缺少Payload对应的攻击者意图判断",
                                    label: "缺少Payload对应的攻击者意图判断",
                                },
                                {
                                    value: "缺少Payload攻击成功的判断原理",
                                    label: "缺少Payload攻击成功的判断原理",
                                },
                                {
                                    value: "缺少判断报文中的Payload是否攻击成功",
                                    label: "缺少判断报文中的Payload是否攻击成功",
                                },
                                {
                                    value: "缺少结论",
                                    label: "缺少结论",
                                },
                            ],
                        },
                        {
                            value: "分析错误",
                            label: "分析错误",
                            children: [
                                {
                                    value: "告警介绍内容错误",
                                    label: "告警介绍内容错误",
                                },
                                {
                                    value: "payload分析错误",
                                    label: "payload分析错误",
                                },
                                {
                                    value: "攻击者意图分析错误",
                                    label: "攻击者意图分析错误",
                                },
                                {
                                    value: "成功原理分析错误",
                                    label: "成功原理分析错误",
                                },
                                {
                                    value: "报文中的Payload是否攻击成功分析错误",
                                    label: "报文中的Payload是否攻击成功分析错误",
                                },
                                {
                                    value: "结论错误",
                                    label: "结论错误",
                                },
                            ],
                        },
                        {
                            value: "模型问题",
                            label: "模型问题",
                            children: [
                                {
                                    value: "模型幻觉",
                                    label: "模型幻觉",
                                },
                                {
                                    value: "模型异常错误",
                                    label: "模型异常错误",
                                }
                            ],
                        },
                        {
                            value: "其他",
                            label: "其他",
                            children: [
                                {
                                    value: "解码错误",
                                    label: "解码错误",
                                },
                                {
                                    value: "计算错误",
                                    label: "计算错误",
                                },
                                {
                                    value: "格式错误",
                                    label: "格式错误",
                                },
                                {
                                    value: "非脆弱性类告警",
                                    label: "非脆弱性类告警",
                                },
                                {
                                    value: "非业务/误报类告警",
                                    label: "非业务/误报类告警",
                                },
                                {
                                    value: "非需要核实类告警",
                                    label: "非需要核实类告警",
                                },
                                {
                                    value: "非情报类告警",
                                    label: "非情报类告警",
                                },
                                {
                                    value: "非攻击类告警",
                                    label: "非攻击类告警",
                                },
                            ],
                        },
                    ],
                };
            },
            methods: {
                handleChange(value) {
                    this.setSuggestion(value);
                },
                get_suggestion() {
                    let suggestionMarkdownEle = document.querySelector(
                        "#pane-model > div > div:nth-child(5) > div > textarea"
                    );
                    if (suggestionMarkdownEle) {

                        let value = suggestionMarkdownEle.value;
                        return value;
                    } else {
                        return "";
                    }
                },
                setSuggestion(selectedValue) {
                    const textarea = document.querySelector("#pane-model > div > div:nth-child(5) > div > textarea");
                    if (textarea) {
                        console.log("textarea:", textarea);
                        // 将选中的值转换为字符串，并用冒号分隔
                        const selectedText = selectedValue.join('：');

                        finalContent = `${this.currentNumber}. ${selectedText}\n`

                        // 更新文本区域的值
                        textarea.focus();

                        document.execCommand('insertText', false, finalContent);

                        // 递增编号，以便下次添加时使用
                        this.currentNumber++;

                        // 可选：在控制台打印最终内容以进行调试
                        console.log("Final content:", finalContent);
                    }
                    else {
                        console.log("没有找到textarea");
                    }
                },

            },
        };
        var Ctor = Vue.extend(Main);
        new Ctor().$mount(".suggestion-select1");
    }
}

function get_answerResultEle() {
    let answerResultEle = document.querySelector(
        '#pane-answer > div > div.ai-judgment-result > div > form > div:nth-child(1) > div > div > span'
    );
    if (answerResultEle) {
        let value = answerResultEle.textContent; // 使用 textContent 获取文本内容
        // console.log("answerResultEle text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_jiaozhunResultEle() {
    let jiaozhunResultEle = document.querySelector(
        '#pane-model > div > div.result > form > div:nth-child(1) > div:nth-child(1) > div > span'
    );
    if (jiaozhunResultEle) {
        let value = jiaozhunResultEle.textContent; // 使用 textContent 获取文本内容
        // console.log("jiaozhunResultEle text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_resultShenheEle() {
    let resultShenhe = document.querySelector(
        '#pane-model > div > div.result > form > div:nth-child(1) > div:nth-child(2) > div > div > label.q-radio.q-radio--small.is-checked > span.q-radio__label'
    );
    if (resultShenhe) {
        let value = resultShenhe.textContent; // 使用 textContent 获取文本内容
        // console.log("resultShenhe text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_answerBusinessEle() {
    let answerBusinessEle = document.querySelector(
        '#pane-answer > div > div.ai-judgment-result > div > form > div:nth-child(2) > div > div > span'
    );
    if (answerBusinessEle) {
        let value = answerBusinessEle.textContent; // 使用 textContent 获取文本内容
        // console.log("answerResultEle text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_jiaozhunBusinessEle() {
    let jiaozhunBusinessEle = document.querySelector(
        '#pane-model > div > div.result > form > div:nth-child(2) > div:nth-child(1) > div > span'
    );
    if (jiaozhunBusinessEle) {
        let value = jiaozhunBusinessEle.textContent; // 使用 textContent 获取文本内容
        // console.log("jiaozhunResultEle text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_businessShenheEle() {
    let businessShenhe = document.querySelector(
        '#pane-model > div > div.result > form > div:nth-child(2) > div:nth-child(2) > div > div > label.q-radio.q-radio--small.is-checked > span.q-radio__label'
    );
    if (businessShenhe) {
        let value = businessShenhe.textContent; // 使用 textContent 获取文本内容
        // console.log("resultShenhe text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}

function get_markIDEle() {
    let markID = document.querySelector(
        '#pane-model > div > div.info > div > span:nth-child(2)'
    );
    if (markID) {
        let value = markID.textContent; // 使用 textContent 获取文本内容
        // console.log("markID text: ", value);
        return value; // 返回文本内容
    } else {
        return "";
    }
}


function addAlert(markID) {
    let answerResult = get_answerResultEle();
    let jiaozhunResult = get_jiaozhunResultEle();
    let resultShenhe = get_resultShenheEle().trim(); // 使用 trim() 去除空格

    let answerBusiness = get_answerBusinessEle();
    let jiaozhunBusiness = get_jiaozhunBusinessEle();
    let businessShenhe = get_businessShenheEle().trim(); // 使用 trim() 去除空格

    // console.log(answerResult);
    // console.log(jiaozhunResult);
    // console.log(resultShenhe);
    // console.log(answerBusiness);
    // console.log(jiaozhunBusiness);
    // console.log(businessShenhe);

    if ((answerResult === jiaozhunResult && resultShenhe === "错误") || (answerResult !== jiaozhunResult && resultShenhe === "正确") ||
        (answerBusiness === jiaozhunBusiness && businessShenhe === "错误") || (answerBusiness !== jiaozhunBusiness && businessShenhe === "正确")) {
        // console.log("2222");
        if (confirm("校准攻击结果以及业务触发和标准答案不一致")) {
            // console.log("3333:", markID);
            return markID; // 只返回更新后的 strmarkID
        } else {
            console.log("用户点击了取消");
            // 如果取消，则不返回或更新任何值（或者可以返回当前的 strmarkID）
            return markID; // 仍然返回当前的 strmarkID
        }
    }
    return -1
}

var strmarkID = -1;

var markTool = new MarkTool();
(function () {
    "use strict";
    addElementUICSS();
    markTool.run();

    window.setInterval(function () {
        if (window.location.href.indexOf("/data-management/mark-data/list/calibrate/") != -1) {
            findyanpanSelectElement();
        }
        let markID = get_markIDEle();
        // console.log("now markid", markID);
        // console.log("old markid", strmarkID);

        if (markID != strmarkID) {
            // 调用 addAlert 并更新 strmarkID（如果需要）
            strmarkID = addAlert(markID);
        }
    }, 1000);
})();