// ==UserScript==
// @name         在本地修改内容
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  可以用来修改不理想的成绩, 只会在本地有效噢.
// @author       You
// @match        需要修改的网址
// @grant        none
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/486136/%E5%9C%A8%E6%9C%AC%E5%9C%B0%E4%BF%AE%E6%94%B9%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/486136/%E5%9C%A8%E6%9C%AC%E5%9C%B0%E4%BF%AE%E6%94%B9%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
// 使用规则及需要注意的事:
// 在页面加载的早期阶段修改多处文本内容. 这个脚本的核心是replaceRules数组, 脚本会遍历这个数组, 应用每个规则来修改页面上的文本内容.所以你需要在目标网址的控制台中找到你要修改的具体的body中的内容, 然后复制到replaceRules中
// 某某考试考得不太理想呢, 我发誓我会更加努力, 但终究逃不过家长这一关. 怎么办呢? 我写了这个脚本, 它可以在你的电脑本地显示出你修改后的成绩, 祈祷你的家长不会自己查你的成绩吧! 记得要继续努力噢!
// 免责声明:
// 1. 使用范围限制： 本脚本旨在提供用于学习和研究网页技术的工具。任何人使用本脚本应遵守所有适用的法律法规，并对其使用方式承担全部责任。
// 2. 禁止用于不道德或非法目的： 本脚本不得用于任何不道德或非法的活动，包括但不限于篡改、伪造、误导他人的数据或信息。
// 3. 无保证： 本脚本按“现状”提供，不附带任何形式的明示或暗示保证。作者不保证脚本的功能或其对特定用途的适用性。
// 4. 责任限制： 在任何情况下，脚本的作者或贡献者均不对因使用或滥用本脚本所引起的任何形式的直接、间接、偶然、特殊或后果性损害负责。
// 5. 遵守网站政策： 用户应尊重并遵守目标网站的使用条款和隐私政策。使用本脚本修改或操作网站内容可能违反这些条款。
// 6. 版权声明： 本脚本的版权归原作者所有。任何形式的转载、分发或修改应注明原作者。
// 7. 最终解释权： 对本免责声明的最终解释权归脚本的作者所有。
//    请确保您了解并同意上述条款。若您决定使用或分享此脚本，您应承担由此产生的所有责任。如果您不确定您的用途是否合法或符合道德标准，建议您先咨询专业法律顾问。

(function() {
    'use strict';

    // 在DOM加载开始时隐藏页面内容
    document.documentElement.style.display = 'none';

    // 监听DOM内容的加载
    document.addEventListener('DOMContentLoaded', function () {
        // 修改内容
        modifyContent();

        // 内容修改完成后显示页面
        document.documentElement.style.display = '';
    });

    // 内容修改函数
    function modifyContent() {
        // 定义替换规则数组
        var replaceRules = [
            { oldText: '旧文本', newText: '新文本' },
            { oldText: '旧文本', newText: '新文本' },
            { oldText: '旧文本', newText: '新文本'},

            // 可以继续添加更多替换规则
        ];

        var elements = document.getElementsByTagName('*');

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];

                if (node.nodeType === 3) {
                    var text = node.nodeValue;

                    // 应用所有替换规则
                    replaceRules.forEach(function(rule) {
                        text = text.replace(rule.oldText, rule.newText);
                    });

                    if (text !== node.nodeValue) {
                        element.replaceChild(document.createTextNode(text), node);
                    }
                }
            }
        }
    }
})();
