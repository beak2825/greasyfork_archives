// ==UserScript==
// @name         新华网答题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://gdzh.kj2100.com/LimitExamStartNewFace.asp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387825/%E6%96%B0%E5%8D%8E%E7%BD%91%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/387825/%E6%96%B0%E5%8D%8E%E7%BD%91%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var answerItems = [{
        "title": "企业筹资、投资和资金营运活动的总称是",
        "answer": ["A"]
    }, {
        "title": "按照内控要求，负责核对“银行存款日记账”和“银行对账单”，编制“银行存款余额调节表”的岗位人员是",
        "answer": ["B"]
    }, {
        "title": "下列各项中，属于货币资金内部控制环节中存在重大缺陷的是",
        "answer": ["A"]
    }, {
        "title": "下列各项中，属于不相容职务分离控制的核心是",
        "answer": ["D"]
    }, {
        "title": "具备条件的小企业，可以设立来提高内部控制监督的独立性和质量",
        "answer": ["A"]
    }, {
        "title": "下列各项中，小企业建立与实施内部控制应当重点关注的管理领域不包括",
        "answer": ["D"]
    }, {
        "title": "综合考虑风险发生的可能性、风险发生后可能造成的影响程度以及可能持续的时间，对识别的风险进行分析和排序，确定重点关注和优先控制的风险，这个步骤属于",
        "answer": ["B"]
    }, {
        "title": "下列各项中，企业风险评估的起点是",
        "answer": ["D"]
    }, {
        "title": "下列各项风险中，属于企业内部风险的是",
        "answer": ["C"]
    }, {
        "title": "下列各项中，属于风险分析的核心内容是",
        "answer": ["D"]
    }, {
        "title": "下列风险中，可以分散的是",
        "answer": ["B"]
    }, {
        "title": "下列各项中，对本企业内部控制的建立健全和有效实施负责的是",
        "answer": ["B"]
    }, {
        "title": "内部控制应当以为出发点，重点关注对实现内部控制目标造成重大影响的风险领域",
        "answer": ["A"]
    }, {
        "title": "我国当前已经发布的内部控制规范不包括",
        "answer": ["C"]
    }, {
        "title": "下列各项中，不属于《小企业内部控制规范（试行）》制定目的的是",
        "answer": ["D"]
    }, {
        "title": "下列各项中，不属于小企业会计准则附录的内容是（   ）",
        "answer": ["A"]
    }, {
        "title": "下列各项中，不属于小企业会计准则附录的内容是（   ）",
        "answer": ["A"]
    }, {
        "title": "下列各项中，不属于投资活动产生的现金流量的是（   ）",
        "answer": ["D"]
    }, {
        "title": "下列各项中，不属于流动资产项目的是（   ）",
        "answer": ["D"]
    }, {
        "title": "下列各项中，不属于小企业外币货币性项目的是（   ）",
        "answer": ["D"]
    }, {
        "title": "按小企业利润分配的顺序，排在第一的是（   ）",
        "answer": ["A"]
    }, {
        "title": "下列各项中，与营业利润无关的是（   ）",
        "answer": ["D"]
    }, {
        "title": "下列各项中，不应计入销售费用的是（   ）",
        "answer": ["C"]
    }, {
        "title": "对于不跨会计年度的劳务收入，确认收入采用的方法是（　　）",
        "answer": ["A"]
    }, {
        "title": "下列各项中，属于小企业其他业务收入的是（   ）",
        "answer": ["D"]
    }, {
        "title": "下列各项中，小企业开展内部控制日常监督应当重点关注的情形包括",
        "answer": ["A", "B", "C", "D", "E"]
    }, {
        "title": "小企业需要建立适当的内部控制监督机制，内部控制监督可以分为",
        "answer": ["A", "C"]
    }, {
        "title": "小企业根据对内部控制的评价结果，编制年度内部控制报告，该内部控制报告至少应当包括",
        "answer": ["A", "B", "C", "D", "E"]
    }, {
        "title": "小企业针对选择的供应商并不适合自己，不重视小企业的需求的情况，可以采取的应对措施有",
        "answer": ["A", "B"]
    }, {
        "title": "下列关于合同管理中，小企业的做法中正确的有",
        "answer": ["A", "B", "C", "D"]
    }, {
        "title": "下列各项中，小企业内部控制的措施一般包括",
        "answer": ["A", "B", "C", "D"]
    }, {
        "title": "实施内部控制的责任人开展自我检查工作后，可以不再进行内部控制监督",
        "answer": ["2"]
    }, {
        "title": "小企业可以设置一个内部控制监督岗，随意派一个员工来实施内部控制监督",
        "answer": ["2"]
    }, {
        "title": "小企业应当至少每年开展一次全面系统的内部控制评价工作，并可以根据自身实际需要开展不定期专项评价",
        "answer": ["1"]
    }, {
        "title": "企业为了防止资源掌握在关键岗位人员个人手中，可以建立关键岗位人员轮岗制度",
        "answer": ["1"]
    }, {
        "title": "企业进行信息化建设，只能靠引进信息化人才，没有其他选择",
        "answer": ["2"]
    }, {
        "title": "控制活动是企业实施内部控制的基础，一般包括治理结构、机构设置及权责分配、内部审计、人力资源政策、企业文化等",
        "answer": ["2"]
    }, {
        "title": "小企业由于变化不大，开展一次系统全面的风险评估之后，可以不再进行风险评估",
        "answer": ["2"]
    }, {
        "title": "企业在授权过程中，一定要把充分考虑被授权人的知识和才能放在第一位，以便发掘员工潜力，提高人力资源利用率",
        "answer": ["2"]
    }, {
        "title": "风险规避是指在权衡成本收益后，采取适当的控制措施降低风险或者减轻损失，将风险控制在可承受范围内的策略",
        "answer": ["2"]
    }, {
        "title": "企业所面临的一切风险都是可以规避的",
        "answer": ["2"]
    }];

    $(function() {
        var i = 0;
        $(".QuestionTitle").each(function() {
            var answerItem = null;
            var questionTitle = $(this).text().replace(/(\d+\.|\s+|（|）|。)/gi, '');
            answerItems.forEach(e => {
                if (e['title'].replace(/(\d+\.|\s+|（|）|。)/gi, '') == questionTitle) {
                    answerItem = e;
                }
            });
            if (!answerItem || !answerItem['answer']) {
                return;
            }
            var divAnswer = $(this).nextAll('.QuestionAnswer').first();
            answerItem['answer'].forEach(e => {
                divAnswer.find('input[value="' + e + '"]').prop("checked", true);
            });
        });
    });
})();