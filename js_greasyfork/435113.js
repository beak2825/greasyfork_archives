// ==UserScript==
// @name         实验中学问卷填写
// @namespace    74747Alice_QuestionnaireAnswering
// @version      1.0.3
// @description  自动填写北京师范大学附属实验中学的评教评学问卷。
// @author       LTSlw, 74 桌
// @match        https://service.sdsz.com.cn/fe-pc/b/galaxy-portal2/fe_evaluate_student
// @icon         http://www.sdsz.com.cn/sdsz.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435113/%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E9%97%AE%E5%8D%B7%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/435113/%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E9%97%AE%E5%8D%B7%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    const cookies = document.cookie.split(';');
    let token = '';
    for (let i = 0; i < cookies.length; i++) {
        cookies[i] = cookies[i].trim();
        if (cookies[i].length > 5 && cookies[i].substr(0, 5) === 'token') {
            token = cookies[i].substr(6);
        }
    }
    console.log('token', token);

    // 参考：https://www.letianbiji.com/web-front-end/js-string-format.html丨https://www.runoob.com/jsref/jsref-random.html
    String.prototype.format = function()
    {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number)
        {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match;
        });
     };
    function randInt(min, max)
    {
          return Math.floor(Math.random() * (max - min)) + min;
    }

    function createEvaluation(name) {
        var i = randInt(0, text.length);
        var j = randInt(0, text.length);
        if (i == j)
        {
            i = 1;
            j = 2;
        }
        var result = text[i].format(name + "老师");
        var result1 = text[j].format(name + "老师");
        return result + result1;
    }

    var text =
    [
        "{0}，人生旅程上，您给我引领方向，点开我的迷津，使我在人生大道上，快速地前进着，我衷心地感谢您。您如一根红烛，照亮了我们，燃烧了自己。您是辛勤的园丁，细心地呵护我们这些娇嫩的花朵。您善待学生，让我们成为了祖国的希望。{0}，您是我的导师，您的谆谆教诲，化成了我脑中的智慧。",
        "您在黑板写的每一个字，您在讲台上讲的每一句话，都将深深地印在我的脑海里，挥之不去。您讲出的道理，使我明白了人生的哲理，您在我心中播下了知识的种子，给它浇水、施肥，使它慢慢地发芽，茁壮地成长。{0}，您是蔚蓝的大海，我是精致的贝壳，您给了我美丽的花纹和斑谰的色彩。",
        "生活是丰富多彩的，充满了七色阳光，也弥漫着风霜雨雪。生命的长河，注定要流过宽阔的平原，也难免要经过险峻的峡谷。我们成长的历程，不仅仅是宽阔大道，同时也布满了荆棘险滩。是{0}谆谆教导，为我们点亮了前进的明灯，托起了明天的太阳。如果我们是祖国的花朵，{0}就是辛勤的园丁；如果我们是勇敢的水手，{0}就是智慧的导航者。是{0}在莘莘学子的心中建立了永远的丰碑。",
        "花儿感激阳光，因为阳光抚育它成长；雄鹰感激蓝天，因为蓝天让它自由飞翔；{0}，我感激您，因为您给我传授知识，让我健康成长，{0}，您辛苦了！{0}，作为您的学生，我感激您为我们无私的奉献出青春。虽然我们只是一轮初升的太阳，我们也要学着释放温暖，更要怀着对{0}感恩的心去思考、行动，毕竟{0}为我们付出的太多太多。居里夫人以往说过不管一个人取得多么值得骄傲的成绩，都应当饮水思源，应当记住是{0}为他们的成长播下了最初的种子。",
        "在这漫长的学习生活中，我清楚的记着您那沾满粉笔末的双手；我曾记得您那慈善的谆谆教诲；我曾记得您那新增的几根银发；因为有您莘莘学子才能成才。因为有您世界才会如此文明。{0}，您是明灯，为迷失方向的孩子找回温暖的家。{0}，您是美的耕耘者。是您用美的阳光普照，用美的雨露滋润，我们的心才绿草如茵繁花似锦！您为花的盛开，果的成熟忙碌着，默默地垂着叶的绿荫！啊，{0}，您的精神，永记我心中！",
        "或许，刚才您还在讲台前面对着您的学生侃侃而谈；或许，您此刻还没来得及拍拍沾满粉笔灰的衣衫；或许，在这短暂的相聚之间您又要站在黑板前……是的，{0}，您是山中的石级，默默地把别人送向光辉的顶峰；您是一盏明灯，无声无息地照亮了别人前进的道路；您是一位出色的根雕艺术家，把块块粗糙的根神奇地雕刻成工艺品！",
        "{0}，多少的谀词，多少的赞颂也不能表达我们心中的感激。还记得，每次上课时，白色的粉笔末，一阵阵的飘落，它染白了您的黑发，却将您青春的绿色映衬得更加浓郁。还记得，每次交谈时，一滴滴水珠在鲜花上折射太阳的七彩，一句句鼓励的话语在我们心头永远荡漾……作为{0}您的学生，我们将永远记住，永远怀念与您相处的每一个场景，与您交流的每一个片段，与您共唱的每一支插曲……",
        "红烛，是您人生的写照，燃烧得越旺，您心里越是欢畅，燃烧得越彻底，您心里越感欣慰，即使燃烧到最后，也还要进行勇敢的冲刺。“为人作嫁衣”、“为伊憔悴”，更是您的道德风范……如果没有您思想之泉的滋润，怎会绽开那么多美好的灵魂之花？{0}，您不仅是人类文明的传播者，而且是无可替代的人类灵魂工程师！",
        "花园里，园丁的汗水，在绿叶上闪光；讲台上，教师的汗水，在心灵中结果。园丁的梦境，常常是花的芳香，叶的浓荫；教师的梦境，常常是甜甜的笑脸，琅琅的书声……啊，有了您，花园才这般艳丽，大地才充满春意！{0}，快推开窗子看吧，这满园春色，这满园桃李，都在向您敬礼！我很幸运，我是{0}您的学生。我拥有了您，就拥有了色彩斑斓的世界！",
        "{0}，当我们上课犹豫不决是否要举手时，您总是鼓励我们要勇敢，答错了不要紧；当我们在学习中碰到困难的时候，您总是会鼓励我们要坚强，勇敢地去克服困难；当我们考试中没有取得好成绩时，您也是一样，用您那亲切的口吻来鼓励我们要努力，加油，不要灰心、放弃。",
        "{0}，当我们在班上学习突出时，您也教育过我们不要骄傲，应该继续努力。{0}，我知道，每当我们在进入美丽的梦想时，您正在为我们不分昼夜地批改作业，而我们有些人却不知道您的艰辛。作业布置多了就埋怨您；上课严肃了，就在背后偷偷的说您。{0}，您不仅在学习上关心和鼓励我们，还在我们的生活、安全上为我们操心。",
        "{0}，您是我心目中最敬重的好老师，您虽然十分严厉，但是您把一颗心扑在我们身上。您起早贪黑，琢磨着更好的教学方法。您就像蜡烛一样，让我感到前途无限的光明，却燃烧了自己。树木的成长，离不开阳光雨露，只有它们无私施舍，才会生机勃勃。花朵的生活，离不开大地，有了大地提供的营养，才会有花儿的艳丽动人。而我们的生活，离不开老师您，有了您的热情帮助，有了您的谆谆教诲，才能有我们的健康成长。"
    ];

    async function getTargets(projectId) {
        const url = 'https://prod-api.dbxiao.com/phoenix/evaluate/api/v1/pc/answer/targets';
        const data = {'projectId':projectId};
        const resp = await (await fetch(url, {
            method: 'POST',
            headers: {
                token: token
            },
            body: JSON.stringify(data)
        })).json();
        console.log('[getTargets]', resp);
        if (resp.msg === 'SUCCESS') {
            return resp.data;
        }
        else {
            console.error('[getTargets]', resp.msg);
            return false;
        }
    }

    async function submitForm(projectId, groupId, targetId, name) {
        const url = 'https://prod-api.dbxiao.com/phoenix/evaluate/api/v1/pc/answer/submit';
        const evaluation = createEvaluation(name);
        const data = {
            "projectId": projectId,
            "groupId": groupId,
            "targetId": targetId,
            "answers": [{ "questionId": "1", "answer": "1" },
                        { "questionId": "2", "answer": "1" },
                        { "questionId": "3", "answer": "1" },
                        { "questionId": "4", "answer": "1" },
                        { "questionId": "5", "answer": "1" },
                        { "questionId": "6", "answer": "1" },
                        { "questionId": "7", "answer": "1" },
                        { "questionId": "8", "answer": "1" },
                        { "questionId": "9", "answer": "1" },
                        { "questionId": "10", "answer": evaluation }],
            "lastPeople": false
        };
        const resp = await (await fetch(url, {
            method: 'POST',
            headers: {
                token: token
            },
            body: JSON.stringify(data)
        })).json();
        if (resp.msg === 'SUCCESS') {
            return true;
        }
        else {
            console.error(`[submitForm]${name}(${targetId})`, resp.msg);
            return false;
        }
    }

    async function fastEvaluate(projectId) {
        console.log('[fastEvaluate]', projectId);
        const targets = await getTargets(projectId);
        if (targets === false) {
            alert('获取评价列表失败');
            return;
        }
        for (let i = 0; i < targets.length; i++) {
            await submitForm(projectId, targets[i].groupId, targets[i].targetId, targets[i].targetName);
        }
        document.getElementById('theButton').innerHTML = '<span style="top: -1.4px;position: relative;">成功评价</span>';
    }

    function init() {
        const evaluateButtons = document.getElementsByClassName('ant-btn ant-btn-link');
        console.log('evaluateButtons', evaluateButtons);
        // AddFastEvaluateButton
        for (let i = 0; i < evaluateButtons.length; i++) {
            evaluateButtons[i].style='margin-left:0px !important;';
            let button = document.createElement('button');
            button.className = 'ant-btn ant-btn-primary';
            button.id = 'theButton';
            button.style = 'width: 50px; height: 24px;margin-left:0px !important;';
            button.innerHTML = '<span style="top: -1.4px;position: relative;">一键评价</span>';
            let parent = evaluateButtons[i].parentNode;
            button.projectId = parent.parentNode.parentNode.attributes['data-row-key'].value;
            button.addEventListener('click', () => {fastEvaluate(button.projectId).then()}, false);
            parent.appendChild(button);
        }
    }

   setTimeout(() => {init()},3000);
})();