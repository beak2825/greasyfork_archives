// ==UserScript==
// @name         湖南科技大学迎新入学教育自动答题脚本
// @namespace    https://github.com/Delta658/HNUST-Welcome-Education-Auto-Answer
// @version      1.1
// @description  在迎新入学教育考试页面添加一个按钮，点击后开始自动答题，完成后弹窗提醒。
// @author       Delta658
// @match        https://xgxt.hnust.edu.cn/xsfw/sys/yxapp/*default/index.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546798/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%BF%8E%E6%96%B0%E5%85%A5%E5%AD%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546798/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%BF%8E%E6%96%B0%E5%85%A5%E5%AD%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const questionBank = [
        { question: "一墙之隔的湘潭工学院和湘潭师范学院合并组建成湖南科技大学", answer: "D.2003" },
        { question: "一学期请假时间超过该学期总学时", answer: "D.1/3（或6周）" },
        { question: "学校对学生承担监护职责", answer: "B.错误" },
        { question: "学生自杀、自伤的，学校已履行了相应职责", answer: "A.正确" },
        { question: "下列属于先进集体评选基本条件的是", answer: "C.学习风气浓" },
        { question: "优秀个人评选基本条件一共有", answer: "D.4" },
        { question: "优秀心理委员评选具体条件一共有", answer: "D.2" },
        { question: "校级综合一等奖学金，综合素质测评成绩名列同年级、同专业", answer: "D.前10%" },
        { question: "优秀学生干部的综合素质测评成绩要求名列同年级、同专业前", answer: "A.50%" },
        { question: "优秀毕业生的评选比例是", answer: "C.10%" },
        { question: "优秀学生干部的评选比例是", answer: "C.3%" },
        { question: "优秀青年志愿者评选具体条件有", answer: "A.2" },
        { question: "创业类专项奖学金，奖学金发放参照", answer: "A.二类B档" },
        { question: "学术研究先进个人的评选具体条件有", answer: "D.2" },
        { question: "学生未经批准连续（）未参加学校规定的教学活动", answer: "D.两周" },
        { question: "当学年获得一等及以上综合奖学金，并有2项以上", answer: "B.错误" },
        { question: "科技创新先进个人的评奖比例是1%", answer: "A.正确" },
        { question: "有一门课程重修，不符合综合奖学金的申报要求", answer: "B.正确" },
        { question: "取得辅修专业学习资格的学生", answer: "A.结业证书" },
        { question: "自强类专项奖学金的评选比例为全校学生的5%", answer: "B.错误" },
        { question: "文明宿舍的评选比例是5%", answer: "A.正确" },
        { question: "下列（）不是奖学金申报的基本条件", answer: "B.二等以上综合奖学金要求英语专业学生需通过英语专业四级考试（TEM-4）及以上，非英语专业需通过大学英语四级考试（CET-4）及以上,艺体类专业需通过大学英语三级考试（PETS）及以上。" },
        { question: "青年五四奖章评选具体条件有", answer: "D.2" },
        { question: "是为全面提高学生综合素质，促进学生社会责任感", answer: "C.专项奖学金" },
        { question: "一学期内累计旷课达到或超过（ ）者，按《湖南科技大学学生违纪处理办法》", answer: "D.5学时" },
        { question: "按学生平均学分绩排名取同年级、同专业第一名", answer: "D.学业类专项奖学金" },
        { question: "学生独立或合伙注册了公司", answer: "A.正确" },
        { question: "主动参与、组织非法传销活动者", answer: "C.记过或留校察看" },
        { question: "竞赛类专项奖学金，各类竞赛以中国高等教育学会最新全国普通高校大学生竞赛分析报告竞赛目录", answer: "A.正确" },
        { question: "综合奖学金申报要求学生综合素质测评在同年级、同专业排名前40%以内", answer: "A.正确" },
        { question: "学生评优评先工作注重集体奖励与个人奖励相结合", answer: "C.精神奖励；物质奖励" },
        { question: "优秀学生的综合素质测评成绩要求名列同年级、同专业前", answer: "D.20%" },
        { question: "一学期旷课累计达到30-39学时者", answer: "B.记过" },
        { question: "优秀学生党员的综合素质测评成绩要求名列同年级、同专业前", answer: "D.20%" },
        { question: "本科生综合奖学金不重复发放", answer: "A.正确" },
        { question: "在籍学生在规定的学习年限内修完培养方案规定的内容", answer: "A.毕业证书" },
        { question: "多次参加赌博者", answer: "A.开除学籍" },
        { question: "在宿舍内私藏管制刀具、枪具及易燃、易爆等危险物品者", answer: "C.记过" },
        { question: "在宿舍内私拉私接电线、网线者", answer: "B.严重警告" },
        { question: "非法集会、游行、示威为首者和参加非法组织者", answer: "C.留校察看" },
        { question: "违反工商行政管理法规和学校规定，从事各种经营、开发活动者", answer: "D.严重警告" },
        { question: "在公共场所起哄、闹事、掷砸物品者", answer: "C.记过" },
        { question: "上课迟到、早退，屡教不改者", answer: "D.警告" },
        { question: "一学期旷课累计达到（）者，给予严重警告处分", answer: "C.20-29学时" },
        { question: "湖南科技大学“十四五”发展目标及2035年远景目标是", answer: "A.特色鲜明、国内一流、国际有影响的高水平综合性" },
        { question: "一学期旷课累计达（）者，给予警告处分", answer: "B.10-19学时" },
        { question: "学位论文、公开发表的研究成果存在抄袭、篡改、伪造等学术不端行为", answer: "B.正确" },
        { question: "不按时就寝且影响他人休息", answer: "B.错误" },
        { question: "擅自在外租房居住、夜不归宿", answer: "A.正确" },
        { question: "组织、发动、引诱他人参与非法网络借贷", answer: "B.错误" },
        { question: "偷窃、诈骗国家、集体和他人财物，造成重大经济损失或社会危害者", answer: "A.正确" },
        { question: "在调查处理打架事件过程中，故意提供伪证", answer: "B.错误" },
        { question: "被开除学籍的学生，由学校发给学习证明", answer: "A.正确" },
        { question: "从事或者参与卖淫、嫖娼等有损大学生形象", answer: "A.正确" },
        { question: "在宿舍窃电，情节严重者", answer: "C.记过" },
        { question: "学生综合素质测评成绩按百分制计分，其中知识与学习能力所占比例为", answer: "B.60%" },
        { question: "违反学校消防安全管理规定、交通管理有关办法者", answer: "A.警告" },
        { question: "故意损坏公私财物者", answer: "A.正确" },
        { question: "考试作弊者，该课程考核成绩记零分", answer: "A.正确" },
        { question: "批评教育包括口头批评和通报批评", answer: "B.错误" },
        { question: "猥亵、调戏他人或者故意裸露身体及进行其他流氓活动者", answer: "A.正确" },
        { question: "学生综合素质测评结果作为评定学生奖学金的直接依据", answer: "A.正确" },
        { question: "家庭经济困难学生认定，在原则上不得超过在校全日制本科学生总人数的", answer: "D.30%" },
        { question: "学生综合素质测评内容不包括", answer: "D.基本素质" },
        { question: "国家助学金分为（）个等级", answer: "B.3" },
        { question: "德育测评共五个考核项目", answer: "A.正确" },
        { question: "国家励志奖学金奖励人数约占在校学生总人数的3%", answer: "A.正确" },
        { question: "学校勤工助学工作坚持“学生为本、立足校园、济困助学、实践锻炼”的宗旨", answer: "B.正确" },
        { question: "勤工助学岗位的固定岗位，薪酬按平均", answer: "B.360" },
        { question: "生源地信用助学贷款主要由国家开发银行等金融机构", answer: "A.正确" },
        { question: "每学年第一学期学分清理工作结束前，达到学分清理条件的", answer: "B.正确" },
        { question: "特殊困难补助单次补助标准原则上不超过2000元/次", answer: "A.正确" },
        { question: "中国共产党的根本组织制度和领导制度是", answer: "D.民主集中制" },
        { question: "中国共产党是中国（）的先锋队", answer: "C.工人阶级" },
        { question: "申请入党的人，要填写入党志愿书", answer: "A.2名" },
        { question: "中国共产党第二十次全国代表大会的主题是", answer: "B.自信自强、守正创新，全面推进中华民族伟大复兴" },
        { question: "目前我国通用的火灾报警电话是", answer: "A.119" },
        { question: "全国“119”消防宣传日是每年的", answer: "C.11-9" },
        { question: "在使用银行自动柜员机时，随意丢弃取款凭条是安全的", answer: "A.错误" },
        { question: "应对陌生人求助，要做到不轻信、不盲从", answer: "B.正确" },
        { question: "学校校庆日为每年", answer: "A.11月18日" },
        { question: "湖南科技大学校友会是学校依法注册成立的非营利性社团组织", answer: "A.正确" },
        { question: "在课程考核期间请假者，还须按《湖南科技大学课程考核管理办法》办理缓考手续", answer: "B.错误" },
        { question: "结业生在规定的学习年限内，满足毕业条件后", answer: "B.错误" },
        { question: "无法在学校规定的学习年限内完成学业的", answer: "A.正确" },
        { question: "学校不受理三年级及以上学生的转专业申请", answer: "A.正确" },
        { question: "新生必须持录取通知书和有关证件", answer: "B.2周" },
        { question: "本科各专业的学制都是四年制", answer: "B.错误" },
        { question: "学生休学期间可以随班听课或参加课程考核", answer: "B.错误" },
        { question: "成绩100分的课程学分绩点为3.8", answer: "B.错误" },
        { question: "退学学生按学校规定办理完离校手续后", answer: "A.正确" },
        { question: "因故不能如期注册的学生，应事先请假并办理暂缓注册手续", answer: "B.2周" },
        { question: "对以作弊、剽窃、抄袭等学术不端行为或者其他不正当手段获得的学历证书", answer: "A.正确" },
        { question: "结业学生满足学士学位授予条件后", answer: "B.错误" },
        { question: "热爱劳动，珍惜他人和社会劳动成果属于", answer: "A.勤俭节约，艰苦奋斗" },
        { question: "学生在一学年度内取得的学分数（通识教育课程除外）低于（），给予降级处理", answer: "B.13（含13）" },
        { question: "已经转过1次专业的，不允许再申请转专业", answer: "A.正确" },
        { question: "学生休学原则上以1年为期", answer: "A.正确" },
        { question: "学生在一学期内无故未取得任何课程学分的", answer: "B.正确" },
        { question: "课程考核（通识教育课程、公共选修课除外）不合格者按学校相关规定参加补考或重修", answer: "B.错误" },
        { question: "对造成学生伤害事故负有责任的学生", answer: "A.司法机关" },
        { question: "奖学金申报的基本条件一共有", answer: "A.4" },
        { question: "专项奖学金一类一等奖B档奖励金额是", answer: "A.3000元" },
        { question: "校级优秀班集体的评选比例和奖励金额是", answer: "D.10%，800元" },
        { question: "校级综合三等奖学金的评奖比例是8%", answer: "B.错误" },
        { question: "连续两年被评为优秀班集体，授予模范班集体荣誉称号", answer: "A.错误" },
        { question: "优秀共青团员属于优秀个人的综合奖", answer: "A.正确" },
        { question: "学业类专项奖学金发放参照二类一等奖B档标准执行", answer: "B.错误" },
        { question: "特殊贡献奖的评选比例是5%", answer: "A.正确" },
        { question: "未请假离校连续两周未参加学校规定的教学活动者", answer: "C.开除学籍" },
        { question: "不是优秀共青团员的评选具体条件", answer: "B.上年度团员教育评议等级为优秀等次；获得校级三等及以上综合奖学金。" },
        { question: "不服从管理，侮辱、威胁、打击报复宿舍管理人员", answer: "C.严重警告" },
        { question: "违反学生宿舍卫生管理规定，破坏公共卫生", answer: "C.警告" },
        { question: "持器械打架斗殴者", answer: "A.留校察看" },
        { question: "综合奖学金评定以学生综合素质测评结果为直接依据", answer: "A.正确" },
        { question: "擅自留宿外来人员，造成不良后果者", answer: "B.记过" },
        { question: "优秀学生标兵的综合素质测评成绩要求名列同年级、同专业前", answer: "A.5%" },
        { question: "在校期间擅自下水游泳者", answer: "D.警告" },
        { question: "擅自举办募捐、接受赞助、收取活动经费或协会会费者", answer: "C.严重警告" },
        { question: "在学校组织进行宗教活动者", answer: "A.记过" },
        { question: "学生必须修满培养方案规定的所有学分才能毕业", answer: "A.正确" },
        { question: "一学期旷课累计达到（）者，给予通报批评处分", answer: "D.5-9学时" },
        { question: "我国首台（）海底大孔深保压取芯钻机系统", answer: "A.海牛Ⅱ号" },
        { question: "被处以行政拘留者", answer: "B.错误" },
        { question: "各专业学生修读的课程按照修读性质分为必修课程和选修课程", answer: "A.正确" },
        { question: "谎报火警、匪警或医疗急救者", answer: "A.正确" },
        { question: "动手打人者给予警告处分", answer: "B.错误" },
        { question: "偷窃、诈骗国家、集体和他人财物价值在2000元以上者", answer: "B.错误" },
        { question: "偷窃、诈骗国家、集体和他人财物价值在1000-2000元者", answer: "B.错误" },
        { question: "考试课程的成绩由考试成绩和平时成绩按一定比例综合计算", answer: "A.正确" },
        { question: "两次以上（含两次）偷盗者", answer: "B.错误" },
        { question: "在学生宿舍区焚烧物品", answer: "A.正确" },
        { question: "制造、贩卖、运输毒品者", answer: "A.正确" },
        { question: "学生所修课程如出现重修，知识与学习能力测评按重修前的成绩计算", answer: "A.正确" },
        { question: "创新与实践能力测评的职业技能类，同一项目以最高分计", answer: "A.正确" },
        { question: "申请国家助学金的资助人数约占当年在校学生总人数的", answer: "D.20%" },
        { question: "校内勤工助学岗位分固定岗位和临时岗位", answer: "A.正确" },
        { question: "学生参加勤工助学的时间原则上每周不超过8小时", answer: "A.正确" },
        { question: "家庭经济困难学生认定等级依据学生困难程度分为", answer: "A.正确" },
        { question: "中国共产党的宗旨是", answer: "B.全心全意为人民服务" },
        { question: "党员如果没有正当理由，连续（ ）不参加党的组织生活", answer: "B.六个月" },
        { question: "党的群众路线就是一切为了群众", answer: "C.一切依靠群众" },
        { question: "学生在宿舍不能乱拉电线、乱接电源", answer: "C.着火源" },
        { question: "用灭火器灭火时，灭火器的喷射口应该对准火焰的火苗", answer: "A.错误" },
        { question: "休学期满不按时办理复学手续或申请复学经审查不合格者", answer: "A.正确" },
        { question: "对违反国家招生规定取得入学资格或者学籍者", answer: "A.正确" },
        { question: "课程考核方式分为两类：考试和考查", answer: "A.正确" },
        { question: "在培养方案规定的各类学分中，所有课程都是16学时为1学分", answer: "B.错误" },
        { question: "休学期间可以申请转专业", answer: "B.错误" },
        { question: "学生提交转专业申请后，即可到申请转入专业学习", answer: "B.错误" },
        { question: "准予退学者须在批准之日起7个工作日内办理离校手续", answer: "B.错误" },
        { question: "平时成绩的确定以各阶段检查结果为依据", answer: "C.20%-40%" },
        { question: "在籍学生应征参加中国人民解放军", answer: "C.2年" },
        { question: "学生一学年内取得的学分数（通识教育课程除外）低于（）（含），且曾受到过降级处理的", answer: "C.13" },
        { question: "对尚未修读、但转入专业已经开设完毕的课程", answer: "A.正确" },
        { question: "如学生本人主动申请留级", answer: "A.正确" },
        { question: "用（）和（）来综合评价学生的学习质量", answer: "B.绩点，平均学分绩点" },
        { question: "校级综合特等奖学金的评选比例及奖励金额是", answer: "C.1.5‰，3000元" },
        { question: "对于违反校纪校规、受到警告及以上处分的同学", answer: "A.正确" },
        { question: "所有奖励奖金由学校财务统一发放到获奖学生本人银行账户", answer: "A.错误" },
        { question: "专项奖学金的一类三等奖B档的奖励金额为300元", answer: "B.错误" },
        { question: "校级科技创新先进个人评选具体条件中", answer: "A.正确" },
        { question: "典型示范类专项奖学金的先进集体按照特等A档标准执行", answer: "B.正确" },
        { question: "伪造、贩卖各类证件、印章和证明文件（材料）者", answer: "B.开除学籍" },
        { question: "擅自调换、占用学生宿舍、床位", answer: "D.警告" },
        { question: "未按学校规定缴费不能办理注册手续", answer: "A.正确" },
        { question: "违反宪法，反对四项基本原则", answer: "C.开除学籍" },
        { question: "一学期旷课累计达到（）者，给予留校察看处分", answer: "C.40-49学时" },
        { question: "干扰、妨碍、阻挠正常查处工作者", answer: "B.正确" },
        { question: "使用热得快、电炉、电饭煲等大功率电器", answer: "B.错误" },
        { question: "偷窃、诈骗国家、集体和他人财物价值在1000元以下者", answer: "B.错误" },
        { question: "以“劝架”为名偏袒一方，致使事态恶化者", answer: "B.错误" },
        { question: "学生思想品德考核采取（）和（）形式", answer: "A.个人小结和师生民主评议" },
        { question: "违反学校计算机网络安全管理规定", answer: "B.错误" },
        { question: "端正入党动机的基本要求是树立为共产主义和中国特色社会主义奋斗终身的坚定理想信念", answer: "A.先锋模范" },
        { question: "预备党员的权利，除了没有表决权、选举权和", answer: "C.被选举权" },
        { question: "党员的党龄，从（ ）之日算起", answer: "B.预备期满转为正式党员" },
        { question: "中国共产党党徽为（）组成的图案", answer: "D.镰刀和锤头" },
        { question: "横穿没有人行横道的道路时，行人", answer: "C.应先看左、再看右，确保安全后再走" },
        { question: "宿舍有空床位时，可以留宿外人", answer: "B.错误" },
        { question: "在宿舍发现可疑人员，应主动盘问，及时报告", answer: "A.正确" },
        { question: "辅修专业课程包括该专业作为主修专业的全部专业核心课程", answer: "A.正确" },
        { question: "学历证书和学位证书遗失或者损坏的", answer: "B.错误" },
        { question: "休学创业学生的学习年限可在弹性学习年限的基础上再延长", answer: "D.2" }
    ];

    function createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = '开始自动答题';

        Object.assign(startButton.style, {
            position: 'fixed',
            top: '150px',
            right: '30px',
            zIndex: '9999',
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s'
        });

        startButton.onmouseover = () => startButton.style.backgroundColor = '#218838';
        startButton.onmouseout = () => startButton.style.backgroundColor = '#28a745';

        document.body.appendChild(startButton);

        startButton.addEventListener('click', function() {
            startButton.textContent = '正在自动答题...';
            startButton.disabled = true;
            startButton.style.backgroundColor = '#aaa';
            startButton.style.cursor = 'not-allowed';

            setTimeout(() => {
                runAutoAnswer();
                startButton.style.display = 'none';
            }, 500);
        });
    }

    function runAutoAnswer() {
        const answerBody = document.getElementById('answer-body');
        if (!answerBody) {
            console.log('油猴脚本提示：未检测到答题区域，脚本未执行。');
            alert('错误：未找到答题区域，请确认您在正确的考试页面。');
            return;
        }

        console.log('自动答题脚本已启动...');
        let questionsAnsweredCount = 0;
        let questionsNotFound = 0;

        const questionContainers = answerBody.children;

        if (questionContainers.length === 0) {
            console.error('错误：未找到任何题目。');
            alert('错误：页面上没有找到任何题目。');
            return;
        }

        console.log(`总共找到 ${questionContainers.length} 道题目，开始作答...`);

        // 使用 Array.from 转换 HTMLCollection 以便使用 forEach
        Array.from(questionContainers).forEach((container, index) => {
            const questionTitleDiv = container.querySelector('div[title]');
            const questionTextOnPage = questionTitleDiv ? questionTitleDiv.title.trim() : '';

            if (!questionTextOnPage) {
                console.warn(`警告：第 ${index + 1} 题未能获取到题目文本。`);
                return;
            }

            const matchedQuestion = questionBank.find(item => questionTextOnPage.includes(item.question));

            if (matchedQuestion) {
                const correctAnswerText = matchedQuestion.answer;
                const answerContainer = container.querySelector('.bh-row');
                if (!answerContainer) {
                     console.warn(`警告：第 ${index + 1} 题未能找到答案选项的容器。`);
                     questionsNotFound++;
                     return;
                }

                const optionLabels = answerContainer.querySelectorAll('label.mh-question__radio');
                let foundAnswer = false;

                optionLabels.forEach(label => {
                    if (label.textContent.trim().startsWith(correctAnswerText)) {
                        const radioInput = label.querySelector('input[type="radio"]');
                        if (radioInput && !radioInput.checked) {
                            radioInput.click();
                        }
                        console.log(`第 ${index + 1} 题: 匹配成功, 已选择 -> ${correctAnswerText}`);
                        questionsAnsweredCount++;
                        foundAnswer = true;
                    }
                });

                if (!foundAnswer) {
                    console.warn(`警告：第 ${index + 1} 题在页面上未找到答案选项：“${correctAnswerText}”。`);
                    questionsNotFound++;
                }
            } else {
                console.error(`错误：第 ${index + 1} 题在题库中未找到。题目：“${questionTextOnPage}”`);
                questionsNotFound++;
            }
        });

        console.log('\n======================== 答题总结 ========================');
        console.log(`成功作答: ${questionsAnsweredCount} 题`);
        console.log(`未找到或匹配失败: ${questionsNotFound} 题`);
        console.log('========================================================\n');

        if (questionsNotFound === 0) {
            console.log('所有题目已成功作答完毕！');
            alert('自动答题已全部完成！\n\n请您仔细检查一遍答案，确认无误后，请手动点击页面下方的【交卷】按钮进行提交。');
        } else {
            alert(`答题完成，但有 ${questionsNotFound} 道题未能自动回答。\n\n请您手动检查并完成这些题目，然后再点击【交卷】按钮。`);
            console.error('存在未能自动回答的题目，请手动检查后再提交。');
        }

        console.log('脚本执行完毕。');
    }

    // --- 脚本主入口 ---
    window.addEventListener('load', createStartButton);

})();