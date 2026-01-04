// ==UserScript==
// @name         🚀🚀🚀🚀国科大自动评教
// @namespace     auto_class_evaluation
// @version       2.6.3
// @description  国科大自动评教脚本, 这个脚本可以帮助你一键生成评教内容。
// @author       LLinkedList771 Modified by SpiritWalking
// @run-at       document-start
// @match        https://jwxk.ucas.ac.cn/evaluate*
// @match        https://xkcts.ucas.ac.cn/evaluate*
// @match        https://*.ucas.ac.cn/evaluate*
 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491542/%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80%E5%9B%BD%E7%A7%91%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/491542/%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80%E5%9B%BD%E7%A7%91%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
    function selectAllValue5Inputs() {
        const inputs = document.querySelectorAll('input[value="5"]');
        inputs.forEach(input => {
            input.checked = true;
        });
    }
 
 
    
    // ----------------- Styles -----------------
    function addEvaluationStyles() {
        const styles = `
            .tools-logger-panel {
                position: fixed;
                top: 10%;
                right: 2%;
                background-color: white;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                width: 250px;
            }
            .head {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .switch {
                display: inline-block;
                vertical-align: middle;
            }
            .close {
                cursor: pointer;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
 
    // ----------------- UI Creation -----------------
    function createEvaluationUI() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'tools-logger-panel';
    
        controlDiv.innerHTML = `
            <div class="head">
                <span>评教助手</span>
                <span class="close" style="float:right; cursor:pointer; margin-right:5px;">x</span>
            </div>
            <div class="main">
                <button id="courseEvaluationBtn">完成课程评教</button>
                <button id="teacherEvaluationBtn">完成老师评教</button>
            </div>
        `;
    
        document.body.appendChild(controlDiv);
    
        controlDiv.querySelector(".close").onclick = function() {
            controlDiv.remove();
        };
    
        // 重新为按钮添加事件监听器
        document.getElementById("courseEvaluationBtn").addEventListener("click", performCourseEvaluation);
        document.getElementById("teacherEvaluationBtn").addEventListener("click", performTeacherEvaluation);
    }
    // ----------------- Evaluation Logic -----------------
    function selectAllValue5Inputs() {
        const inputs = document.querySelectorAll('input[value="5"]');
        inputs.forEach(input => {
            input.checked = true;
        });
    }
 
    function generateRandomCourseFeedback() {
        const feedbackOptions = {
            1: [
                "我最喜欢这门课程的实践性内容。每次上课，老师都会为我们带来真实的案例，让我们亲自动手去解决。这种实践的方式不仅让我更深入地理解了理论，还锻炼了我的实际操作能力，真的受益匪浅。",
                "我喜欢这门课的教学方式。老师总是能够用简单易懂的语言解释复杂的概念，课堂上的互动也非常多，每次都能吸引我全神贯注地听课。这种教学方式让我对这个学科产生了浓厚的兴趣。",
                "我最喜欢的是课程中的互动环节。每当我们对某个问题有疑惑时，老师都会耐心地为我们解答，并鼓励我们提出自己的看法。这种互动让我感到非常受尊重，也激发了我的学习热情。"
            ],
            2: [
                "我认为这门课程的教材需要更新。虽然现有的教材内容很丰富，但有些知识点已经过时了。如果能够引入一些最新的研究成果和技术，我相信这门课程会更加吸引人。",
                "我希望有更多的实践机会。理论知识固然重要，但真正能够加深记忆的还是实践。如果能够有更多的实验和项目，让我们亲自动手去做，我相信学习效果会更好。",
                "我认为课程的难度可以适当提高。现在的课程内容对我来说稍微有点简单，如果能够加入一些深入的内容，挑战我们的思维，我相信会更有助于我们的成长。"
            ],
            3: [
                "我平均每周在这门课程上花费5小时。除了上课的时间，我还会花费大量的时间去复习和预习。我认为只有这样，才能够真正掌握这门课程的内容。每次深入研究一个问题，都会让我有很大的收获。",
                "我每周大约花费3小时。虽然时间不长，但我会确保这3小时都是高效的学习时间。我会选择一个安静的地方，全神贯注地学习，确保每分钟都不浪费。",
                "我大约每周在这门课上花费7小时。我认为学习就像是锻炼，只有持续不断地努力，才能够取得好的效果。所以我愿意投入更多的时间，确保我能够掌握这门课程的所有内容。"
            ],
            4: [
                "我对这个学科领域非常感兴趣。从小我就对这个领域充满了好奇，总是想要探索其中的奥秘。这门课程为我提供了一个很好的平台，让我能够深入地学习和研究，每次上课都像是一次探险。",
                "在参与这门课之前，我对这个领域知之甚少。但随着学习的深入，我逐渐发现了这个学科的魅力。每一个知识点都像是一个新大陆，等待我去探索。",
                "我之前对这个学科领域有一些了解。但这门课程为我打开了一个新的视角，让我看到了更多的可能性。每次上课，我都会有很多新的收获，这让我对学习充满了期待。"
            ],
            5: [
                "我经常参与课堂讨论，几乎每次都回答问题。我认为这是一个很好的学习机会，可以让我更深入地理解课程内容。每次参与讨论，都会让我有很大的收获。",
                "我总是准时出勤，但不太经常回答问题。我更喜欢在课后深入思考，然后再与老师和同学讨论。这种学习方式让我能够更加深入地理解课程内容。",
                "我对课堂的参与度一般。虽然我不常回答问题，但我总是认真听课，确保不错过任何一个知识点。我认为每个人都有自己的学习方式，关键是要确保学到了东西。"
            ]
        };
        
    
        let selectedFeedback = {};
        for (let key in feedbackOptions) {
            const randomIndex = Math.floor(Math.random() * feedbackOptions[key].length);
            selectedFeedback[key] = feedbackOptions[key][randomIndex];
        }
        return selectedFeedback;
    }
 
    function findStartIndex() {
        for (let i = 1; i <= 2000; i++) {
            const textarea = document.getElementById(`item_${i}`);
            if (document.getElementById(`item_${i}`)) {
                console.log(i);
                return i;
            }
        }
        return 1;
    }

    function fillCourseFeedbackTextareas() {
        const startIndex = findStartIndex();
        const selectedFeedback = generateRandomCourseFeedback();
        for (let i = startIndex; i < startIndex+5; i++) {
            const textarea = document.getElementById(`item_${i}`);
            if (textarea) {
                textarea.value = selectedFeedback[i - startIndex + 1];
            }
        }
    }
 
    function selectRandomCourseQualityRating() {
        const startIndex = findStartIndex();
        const radios = Array.from({length: 5}, (_, i) => document.getElementById((startIndex + 6 + i).toString())).filter(Boolean);
        const randomRadio = radios[Math.floor(Math.random() * radios.length)];
        if (randomRadio) {
            randomRadio.checked = true;
        }
    }
 
    function selectRandomCourseSelectionReasons() {
        const startIndex = findStartIndex();
        const checkboxes = Array.from({length: 6}, (_, i) => document.getElementById((startIndex + 12 + i).toString())).filter(Boolean);
        const numToSelect = Math.floor(Math.random() * (checkboxes.length + 1));
        checkboxes.sort(() => Math.random() - 0.5);
        for (let i = 0; i < numToSelect; i++) {
            checkboxes[i].checked = true;
        }
    }
 
    function performCourseEvaluation() {
        selectAllValue5Inputs();
        fillCourseFeedbackTextareas();
        selectRandomCourseQualityRating();
        selectRandomCourseSelectionReasons();
        showCourseCompletionAlert();
    }
 
 
    // ----------------- Teacher Evaluation -----------------
    function generateRandomTeacherFeedback() {
        const feedbackOptions = {
            1: [
                "这位老师的教学方法非常实用。每次上课，他都能够深入浅出地解释复杂的概念，使得我这样的初学者也能够轻松理解。他的教学方式结合了理论与实践，让我在学习的过程中既能够掌握知识，又能够培养实际操作的能力。",
                "我非常喜欢这位老师的互动教学方式。课堂上，他总是鼓励我们提问和发表自己的观点，这使得课堂氛围非常活跃。每次的互动都让我感到受益匪浅，也激发了我的学习兴趣和热情。",
                "这位老师总是能够用简单的方式解释复杂的问题。他有一种特殊的能力，可以将难以理解的概念转化为生动有趣的故事，这让我每次上课都感到非常轻松和愉快。他的教学方法不仅让我学到了知识，还让我学会了如何思考。"
            ],
            2: [
                "我希望老师能够增加一些实际案例分析。虽然他的课堂上已经有很多实用的内容，但如果能够结合一些真实的案例，我相信会使得学习更加有趣和实用。通过分析真实的案例，我们可以更好地理解理论知识，并学会如何将其应用于实际中。",
                "老师的课堂内容非常丰富，但我还是希望能有更多的互动环节。我认为互动是学习的一个非常重要的部分，它可以帮助我们更好地理解和记忆知识。如果能够增加一些小组讨论或者实践活动，我相信会使得课堂更加生动有趣。",
                "我建议老师可以考虑使用一些现代教学工具，如多媒体或在线互动平台。这些工具不仅可以使得教学内容更加生动有趣，还可以提高我们的学习效率。通过在线互动平台，我们还可以与其他同学进行交流和讨论，这将大大增强我们的学习体验。"
            ]
        };
        
        
        let selectedFeedback = {};
        for (let key in feedbackOptions) {
            const randomIndex = Math.floor(Math.random() * feedbackOptions[key].length);
            selectedFeedback[key] = feedbackOptions[key][randomIndex];
        }
        
        return selectedFeedback;
    }
    
    function fillTeacherFeedbackTextareas() {
        const startIndex = findStartIndex();
        const selectedFeedback = generateRandomTeacherFeedback();
        const textareas = [
            document.getElementById(`item_${startIndex}`),
            document.getElementById(`item_${startIndex+1}`)
        ];
        
        textareas.forEach((textarea, index) => {
            if (textarea) {
                textarea.value = selectedFeedback[index + 1];
            }
        });
    }
 
    function performTeacherEvaluation() {
        // 1.完成自动评分
        selectAllValue5Inputs();
        // 2.完成对老师的评价
        fillTeacherFeedbackTextareas();
        // 3.提示用户手动提交
        showTeacherCompletionAlert();
    }
 
 
    // ----------------- Notifications -----------------
    function showCourseCompletionAlert() {
        alert("课程评教已完成, 请手动提交!");
    }
    function showTeacherCompletionAlert() {
        alert("老师评教已完成, 请手动提交!");
    }
   // ----------------- Initialization -----------------
   addEvaluationStyles();
 
   // 确保在DOM完全加载后再创建UI
   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', createEvaluationUI);
   } else {
       createEvaluationUI();
   }
 
})();