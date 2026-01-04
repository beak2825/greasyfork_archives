// ==UserScript==
// @name         问卷星_JS
// @version     4.3
// @description JS版本
// @author      Buruhuaqi
// @include     https://www.wjx.cn/jq/*.aspx
// @include     https://www.wjx.cn/vj/*.aspx
// @include     https://www.wjx.cn/hj/*.aspx
// @include     https://www.wjx.cn/wjx/join/complete.aspx*
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/463402/%E9%97%AE%E5%8D%B7%E6%98%9F_JS.user.js
// @updateURL https://update.greasyfork.org/scripts/463402/%E9%97%AE%E5%8D%B7%E6%98%9F_JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置填空的答案项,如果不配置,默认填无
    var config = [
        {
            id:17,
            answer:["和其他同学相比不是很活跃","体现社团、学生干部经历优势","显示了他的诚实和勇敢","有较强的亲和力"]
        },
        {
            id:18,
            answer:["公司的团队建设、分类培训令人满意：","公司的薪酬体系、激励体系有待改进：","生产类员工采用计件工资制、管理类采用固定工资制","员工的价值体现与安全感需要加强"]
        },
        {
            id:19,
            answer:["","年前网络还是2G，现在已经是4G跟5G的时代，网络更普及","十年前汽车开始普及，高端车保有量还少，现在电动汽车也都普及","年前好多没有攻克的医学难题，现在已经成为过去式"]
        }
    ];

    function Rand_generate(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function RandomChoose() {
        this.Choose = function (subject)
        {
            var list = subject.querySelectorAll("li");
            var index = Rand_generate(0, list.length - 1);
            list[index].click();

        }

        this.singleSlider = function (subject) {
            var max = Number(subject.querySelectorAll(".slider")[0].getAttribute("maxvalue"));
            var min = Number(subject.querySelectorAll(".slider")[0].getAttribute("minvalue"));
            //模拟鼠标点击的事件, 关键参数ClientX
            var evt = new MouseEvent("click", {
                clientX: getClientX(Rand_generate(min, max), min, max, subject),
                type: "click",
                __proto__: MouseEvent,
            });
            subject.querySelectorAll(".ruler")[0].dispatchEvent(evt);
        }

    }

    function judgeType()
    {
        var question = $(".div_question");
        var rc = new RandomChoose();
        var sigle_i = $(".div_question"+"textarea");
        for (var i = 0; i < question.length; i++) 
        {
            //单选
            if ((question[i].querySelectorAll(".ulradiocheck")[0]) )
            {
                var input = question[i].querySelectorAll("input");
                console.log("单选题", i);
                rc.Choose(question[i]);
                // 填空题
            }
            else if (sigle_i)
            {
                for (var j = 0; j < config.length; j++)
                {
                    if (question[i].querySelectorAll("textarea")[0].id == ("q" + config[j].id))
                    {
                        question[i].querySelectorAll("textarea")[0].value = config[j].answer[Math.floor(Math.random() * config[j].answer.length)];
                        console.log("填空题", i);
                    }
                }
            }
        }
    }
    judgeType();

})();