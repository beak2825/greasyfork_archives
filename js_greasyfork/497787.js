// ==UserScript==
// @name         电子科技大学自动评教脚本
// @namespace    https://github.com/FoxSuzuran
// @version      1.0
// @description  电子科技大学自动评教脚本,只需要进到评教界面（打星那个界面）点击运行即可,最后要手动点一下提交
// @author       Suzuran
// @match        https://eams.uestc.edu.cn/eams/*
// @icon         http://picgo.malossov.top/malpicbed/UESTCico.jpg
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497787/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/497787/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var mainPage = "https://eams.uestc.edu.cn/eams/evaluate/*";
var tearcherStarPage = "https://eams.uestc.edu.cn/eams/evaluate!search.action";
var textbookSelectPage1 = "https://eams.uestc.edu.cn/eams/evaluate!textbookEvalIndex.action";
var textbookSelectPage2 = "https://eams.uestc.edu.cn/eams/evaluate!finishAnswer.action";
var textbookCommentPage = "https://eams.uestc.edu.cn/eams/evaluate!textbookEval.action?evaTextbook.id";
var teacherCommentPage = "https://eams.uestc.edu.cn/eams/evaluate!loadQtnaire.action";
var nowurl = location.pathname;
var last_classname = "";

// 给老师的评语
let evaluations = {
    prefix: [
        '认真负责',
        '很好',
        '太可爱了',
        '非常好',
        '非常和蔼',
        '很和蔼',
        '和蔼可亲',
        '非常喜欢笑',
        '总是微笑着',
        '让人感到非常的温暖',
        '非常可爱',
        '很善良',
        '很和善也非常可爱',
        '讲课很有水平',
        '的讲课很有水平',
        '很亲和',
        '非常温柔',
        '非常有爱心',
        '很亲近学生',
        '平时兢兢业业',
        '平时勤勤恳恳',
        '教导有方',
        '循循善诱',
        '教学一丝不苟',
        '是我们的良师益友',
        '对待教学良工心苦',
        '会因材施教',
        '为我们的教育呕心沥血',
        '比较严格',
        '教学过程中尊重学生',
        '教学内容丰富有效',
        '授课的方式非常适合我们',
        '治学严谨，要求严格',
        '对待教学认真负责',
        '教学认真',
        '治学严谨',
        '传道授业解惑',
        '教学经验丰富',
        '认真细致',
        '对工作认真负责',
        '对学生因材施教',
        '严于律己',
        '富有经验，工作认真负责',
    ],
    suffix: [
        '能深入了解学生的学习和生活状况',
        '授课有条理，有重点',
        '批改作业认真及时并注意讲解学生易犯错误',
        '教学过程中尊重学生，有时还有些幽默，很受同学欢迎',
        '授课内容详细，我们学生大部分都能跟着老师思路学习',
        '理论联系实际，课上穿插实际问题，使同学们对自己所学专业有初步了解，为今后学习打下基础',
        '从不迟到早退，给学生起到模范表率作用',
        '常常对学生进行政治教育，开导学生，劝告我们努力学习，刻苦奋进，珍惜今天的时光',
        '上课气氛活跃，老师和学生的互动性得到了充分的体现',
        '对学生课堂作业的批改总结认真，能及时，准确的发现同学们存在的问题并认真讲解，解决问题。',
        '采用多媒体辅助教学，制作的电子教案详略得当，重点与难点区分的非常清楚',
        '从学生实际出发，适当缓和课堂气氛',
        '授课时生动形象，极具幽默感',
        '授课时重点突出，合理使用各种教学形式',
        '上课诙谐有趣，非常能调动课堂气氛',
        '善于用凝练的语言将复杂难于理解的过程公式清晰、明确的表达出来',
        '讲课内容紧凑、丰富，并附有大量例题和练习题',
        '我们学生大部分都能跟着老师思路学习，气氛活跃，整节课学下来有收获',
        '上课例题丰富，不厌其烦，细心讲解，使学生有所收获',
        '理论和实际相结合，通过例题使知识更条理化',
        '上课深入浅出，易于理解',
        '上课不迟到、不早退',
        '与同学们相处融洽',
        '上课很认真也很负责',
        '上课幽默风趣，让学生听了很容易把知识吸收',
        '讲课由浅入深，一步一步引导学生思考',
        '精彩的教学让我对这门课程有了浓厚的兴趣',
        '在课间休息时间，老师会与大家一起讨论问题，会耐心解答同学们的问题',
        '对于每一个人都非常好，非常照顾',
        '我也非常希望能够成为老师那样的人',
        '上课认真，从不迟到',
        '让我非常的亲切，非常喜欢他',
        '从简单到深刻，他引导学生一步一步思考，让我对这门课产生了兴趣',
        '从简单到深刻，他会引导学生一步一步思考',
        '对每个人都很好，很有爱心',
        '上课条理清晰，很容易理解',
        '讲课通俗易懂，条理清晰',
        '上课认真又幽默风趣',
        '课间，老师会和大家讨论问题，耐心回答学生的问题',
        '讲课时会一步一步引导学生思考',
        '上课时会引导学生循序渐进地思考',
        '常让人感到如沐春风',
        '讲课非常认真，对于每一个同学都非常好',
        '会耐心回答学生的问题',
        '对每一个学生都非常好',
        '非常爱护学生，教育学生的方法也非常正确',
        '对每一个学生都非常关爱，对每一个人也非常友善',
        '讲课非常认真，让人感到如沐春风',
    ],
};

function randomNum(maxNum, minNum = 0) {
    if (maxNum < minNum) {
        let tmp = maxNum;
        maxNum = minNum;
        minNum = tmp;
    }
    return parseInt(Math.random() * (maxNum - minNum) + minNum, 10);
}

unsafeWindow.confirm = function confirm() {
    return true;
}

function AutoEvaluate() {
    if (nowurl.includes("evaluate")) {
        setInterval(StartEvaluate, 400);
    }
}

var begin = setInterval(WindowDraw, 5);

function WindowDraw() {
    nowurl = location.pathname;
    if (nowurl.includes("evaluate")) {
        // 主题
        var style_btn = 'background:none; color:#9370DB; padding:4px 8px; margin:4px; border:2px solid #9370DB; border-radius:6px; cursor:pointer; text-align:center; text-decoration:none; display:inline-block; font-size:12px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);';
        var style_win = 'z-index:998; padding:10px; background-color:#ffebef; box-shadow:0 0 15px rgba(0,0,0,0.3); border-radius:10px; position:fixed; left:10px; top:10px; border:1px solid #C71585; width:180px;';

        // 开始绘制
        var newDiv = document.createElement("div");
        newDiv.id = "controlWindow";
        newDiv.align = "left";
        document.body.appendChild(newDiv);
        GM_addStyle("#controlWindow{" + style_win + "}");

        var header = document.createElement("div");
        header.style.fontSize = "14px";
        header.style.marginBottom = "10px";
        header.style.color = "#C71585";
        header.style.textAlign = "center";
        header.innerHTML = "UESTC Evaluator";
        newDiv.appendChild(header);

        var btnContainer = document.createElement("div");
        btnContainer.style.display = "grid";
        btnContainer.style.gridTemplateColumns = "1fr 1fr";
        btnContainer.style.gap = "4px";
        btnContainer.style.justifyItems = "center";
        newDiv.appendChild(btnContainer);

        var close = document.createElement("button");
        close.id = "close";
        close.innerHTML = "关闭弹窗";
        close.addEventListener("click", function () { document.body.removeChild(document.getElementById("controlWindow")); }, false);
        close.style.cssText = style_btn;
        btnContainer.appendChild(close);

        var score = document.createElement("button");
        score.id = "score";
        score.innerHTML = "开始评教";
        score.addEventListener("click", AutoEvaluate);
        score.style.cssText = style_btn;
        btnContainer.appendChild(score);

        var star = document.createElement("button");
        star.id = "star";
        star.innerHTML = "联系作者";
        star.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran", "_blank"); });
        star.style.cssText = style_btn;
        btnContainer.appendChild(star);

        var open = document.createElement("button");
        open.id = "open";
        open.innerHTML = "项目地址";
        open.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran/UESTCAutoEvaluator", "_blank"); });
        open.style.cssText = style_btn;
        btnContainer.appendChild(open);

        clearInterval(begin);
    }
}

function StartEvaluate() {
    nowurl = location.pathname;
    console.log(nowurl);

    if (tearcherStarPage.includes(nowurl)) {
        const fiveStarsNum = 4;
        const items = [...document.querySelectorAll("input[type='hidden']")].filter(
            item => item.id.includes("starNum")
        );
        items.slice(0, fiveStarsNum).forEach(item => (item.value = "5"));
        items.slice(fiveStarsNum).forEach(item => (item.value = "4"));
        document.querySelector("input[value='下一步']").click();
    }
    if (textbookSelectPage1.includes(nowurl) || textbookSelectPage2.includes(nowurl)) {
        var items = [...document.querySelectorAll("a[onclick]")];
        if (items.length != 0) {
            items[0].click();
        } else {
            document.querySelector("input[value='提交，进入教师评教']").click();
        }
    }
    if (textbookCommentPage.includes(nowurl)) {
        document
            .querySelectorAll("input[type='radio'][value='0']")
            .forEach(item => (item.checked = true));
        document.querySelector("#sub").click();
    }
    if (teacherCommentPage.includes(nowurl)) {
        var now_classname = document.querySelectorAll("tr")[1].textContent;
        [...document.querySelectorAll("input[type='hidden']")]
            .filter(item => item.id.includes("starNum"))
            .forEach(item => (item.value = "5"));
        document
            .querySelectorAll("input[type='checkbox']")
            .forEach(item => (item.checked = true));
        document.querySelector("#evaText").textContent=`${evaluations.prefix[randomNum(0, evaluations.prefix.length - 1)]}，${evaluations.suffix[randomNum(0, evaluations.suffix.length - 1)]}。 `
        try {
            if (now_classname != last_classname) {
                console.log("click");
                document.querySelector("input[value='下一步']").click();
                last_classname = now_classname;
            }
        } catch {
            document.querySelector("input[value='确认']").click();
        }
    }
}
