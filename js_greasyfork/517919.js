// ==UserScript==
// @name         教师学习平台-有分钟显示的-cas.study.yanxiu-有效期2024
// @namespace    cas.study.yanxiu
// @version      0.2
// @description  自动学习|自动换课|全自动|切勿手动|vx:shuake345
// @author       vx:shuake345
// @match        *://cas.study.yanxiu.jsyxsq.com/*
// @icon         http://files.study.yanxiu.jsyxsq.com/el/uc/face/user-default.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517919/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%9C%89%E5%88%86%E9%92%9F%E6%98%BE%E7%A4%BA%E7%9A%84-casstudyyanxiu-%E6%9C%89%E6%95%88%E6%9C%9F2024.user.js
// @updateURL https://update.greasyfork.org/scripts/517919/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%9C%89%E5%88%86%E9%92%9F%E6%98%BE%E7%A4%BA%E7%9A%84-casstudyyanxiu-%E6%9C%89%E6%95%88%E6%9C%9F2024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var FirstTimeLook
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState == "visible") {
            if(document.URL.search('newCourse/list')>1 ){
                setTimeout(sxrefere,1254)
            }
        }
    });

    var dRq = new Date();
    var yr = dRq.getFullYear()+''

    window.alert=function(){}
    window.onbeforeunload = null
    window.confirm=function(){
        return true
    }
    function fhback() {
        window.history.go(-1)
    }

    function gbclose() {
        window.close()
    }

    function sxrefere() {
        window.location.reload()
    }

    function Zy(){
        if(document.URL.search('newCourse/list')>20){
            var Allpoint=document.querySelector(" div.info-content-left > div > div> span").innerText
            if(Allpoint!=='25分'){
                document.querySelectorAll("div> div.top > div.right > div > span")[0].click()
            }else{//Day note
                document.querySelector("div.drop_menu > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > p > span").click()
                setInterval(XIEPIANDUAN,10001)
                setInterval(NOTe,10001)
            }
            /*var Looked = localStorage.getItem('key')
            var Name0=document.getElementsByClassName('kcal_title')//15个标题
            var NameNum=Name0.length
            var Clicked=document.getElementsByClassName('qxx')//15个’开始学习‘按钮
            var Jindu=document.querySelectorAll("p.xk_rs.clear > span:nth-child(2)")//15个进度‘100%’
            for (var i=0;i<Jindu.length;i++){
                if(Jindu[i].innerText.search('100')<1){
                    Clicked[i].click()
                    break;
                }else if(i==Jindu.length-1){
                    if(document.getElementsByClassName('page_label')[document.getElementsByClassName('page_label').length-1].innerText.search('页')>0){
                        document.getElementsByClassName('page_label')[document.getElementsByClassName('page_label').length-1].click()
                        setTimeout(Zy,3254)
                    }
                }
            }*/

        }
    }
    setTimeout(Zy,14254)

    function Cy(){
        if(document.URL.search('yanxiu')>5){
            var Rtime
            var Nowtime
            var Name
            var SeeTime
            var Alltime=document.querySelectorAll('div.title_tab_lists>div>div.introduce_list')
            //--------------------------------------------------------------到期限制-----这里是定时的----------------------------------------------------------------------
            if(yr.search('4')>2){//这里是定时的
                setInterval(CYbofang,5230)

            }
        }
    }
    setTimeout(Cy,5230)
    function CYbofang(){
        if(document.URL.search('stu/studyNew')>20){
            var Zshichang= Number(document.querySelector("div:nth-child(8) > span:nth-child(2)").innerText.replace(/[^\d]/g,'') )
            if(document.getElementsByTagName('video').length!==0){
                if(document.getElementsByTagName('video')[0].paused){
                    if(document.querySelector("em.ccH5TimeCurrent").innerText!==document.querySelector("em.ccH5TimeTotal").innerText){
                        document.getElementsByTagName('video')[0].play()
                    }else if(document.querySelectorAll(" div > div.step_bottom > span:nth-child(2) > span > span").length!==0){//hanve 微刊
                        var WEIKAN= document.querySelectorAll(" div > div.step_bottom > span:nth-child(2) > span > span")//[1].innerText
                        for (var i=0;i<WEIKAN.length;i++){
                            if(WEIKAN[i].innerText.search('已学')>-1){//为学
                                WEIKAN[i].click()
                                break;
                            }
                        }
                    }else{//WEI看=0
                        document.querySelector("#app > div.studyNew > div.header > div.header_btn").click()
                    }
                }
            }
            if(document.querySelector("body > div > div > div > div> button > span")!==null){
                document.querySelector("body > div > div > div > div> button > span").click()
            }
            /* if(Number(document.querySelector("span.oragen").innerText.split('分钟')[0])+Number(document.querySelectorAll("span.oragen")[1].innerText.split('分钟')[0])>=Zshichang){
            document.querySelector("#app > div.studyNew > div.header > div.header_btn").click()
            window.close();

        }*/
        }
    }

    function Sy(){
        if(document.URL.search('courseListNew')>20){
            window.close();
        }
    }
    setInterval(Sy,1520)
    function NOTe(){
        if(document.URL.search('selfHost/studyPlace')>10){

            if(document.querySelector("div.filter-res > span")!==null){
                if(document.querySelector("div.filter-res > span").innerText=='1'){//提交过一次
                    localStorage.setItem('key',"1")
                }else if(document.querySelector("div.filter-res > span").innerText=='2'){
                    localStorage.setItem('key',"2")
                }else if(document.querySelector("div.filter-res > span").innerText!=='1'){
                    localStorage.setItem('key',"0")
                }
            }
            if(document.querySelector(" div.info-content-left > div > div> span")!==null){
                var Allpoint=document.querySelector(" div.info-content-left > div > div> span").innerText
                if(Allpoint!=='10分'){
                    document.querySelector("div.h-button.h-button-success > span").click()
                }
            }




        }
    }
    function XIEPIANDUAN(){//主要是写日志
        if(document.URL.search('selfHost/studyPlace')>10){
            if(document.querySelectorAll('.el-select-dropdown__item').length!==0){
                document.querySelectorAll('.el-select-dropdown__item')[1].click()//研修新的
                const editorContent = document.querySelector('.ql-editor');
                if(localStorage.getItem('key')=="1"){
                    const inputElement = document.querySelector('.el-input__inner');
                    inputElement.value = '研修日志：《新时代背景下思政课一体化建设的必要性与策略》';
                    const inputEvent = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(inputEvent);
                    editorContent.innerHTML ="研修日志：一、研修主题背景在新时代，培养德智体美劳全面发展的社会主义建设者和接班人，是教育的根本任务。思政课作为落实立德树人根本任务的关键课程，其一体化建设具有重大的现实意义。二、必要性分析1. 适应学生成长规律- 不同年龄段的学生在认知水平、思维方式、情感需求等方面存在差异。思政课一体化建设能够根据学生的成长特点，有针对性地设计教学内容和方法，使思政教育更加符合学生的实际需求。例如，小学阶段可以通过生动有趣的故事、游戏等形式，培养学生的良好品德和行为习惯；中学阶段则可以结合学科知识和社会热点，引导学生树立正确的世界观、人生观和价值观；大学阶段可以深入开展理论学习和社会实践，提高学生的政治素养和社会责任感。- 从学生的心理发展角度看，一体化建设有助于形成连贯的思政教育体系，避免教育内容的重复或脱节，为学生的成长提供持续的思想引领。2. 应对时代发展挑战- 当今世界正经历百年未有之大变局，国际形势复杂多变，各种思想文化相互激荡。思政课一体化建设能够帮助学生增强国家意识、民族意识和文化自信，提高学生的辨别能力和批判思维，使他们在多元文化的冲击下保持正确的政治方向。- 新时代我国经济社会快速发展，对人才的综合素质提出了更高要求。思政课一体化建设能够培养学生的创新精神、实践能力和社会责任感，为国家培养具有高尚品德和过硬本领的建设者和接班人。3. 落实立德树人根本任务- 思政课一体化建设是实现立德树人根本任务的重要途径。从小学到大学，思政课贯穿学生的整个学习生涯，通过一体化建设，可以确保思政教育的目标一致、内容连贯、方法协同，使立德树人根本任务得到有效落实。- 一体化建设能够整合学校、家庭、社会等各方教育资源，形成育人合力，共同为学生的成长创造良好的环境。三、策略探讨1. 课程目标一体化- 明确不同学段思政课的教学目标，既要体现层次性，又要保持连贯性。小学阶段注重启蒙道德情感，培养良好行为习惯；中学阶段引导学生树立正确的价值观和人生观；大学阶段则要提高学生的政治素养和理论水平。- 制定统一的思政课课程标准，确保各学段教学内容的有机衔接。2. 课程内容一体化- 构建螺旋上升的课程内容体系。根据学生的认知发展规律，将思政教育内容进行系统规划，使不同学段的教学内容相互呼应、逐步深化。例如，在爱国主义教育方面，小学可以从爱家乡、爱学校入手，中学进一步扩展到爱祖国的历史文化和自然风光，大学则深入探讨爱国主义的内涵和时代价值。- 加强教材建设。编写适合不同学段的思政课教材，注重教材内容的时代性、针对性和可读性。同时，要加强教材的审核和管理，确保教材质量。3. 教学方法一体化- 针对不同学段的学生特点，采用多样化的教学方法。小学可以采用游戏教学、故事教学等趣味性强的方法；中学可以运用案例教学、讨论教学等互动性强的方法；大学可以采用专题教学、实践教学等深入性强的方法。- 加强信息技术在思政课教学中的应用。利用多媒体教学资源、在线教学平台等，丰富教学形式，提高教学效果。例如，通过播放视频、展示图片等方式，增强教学的直观性；利用在线讨论、问卷调查等功能，促进师生互动和学生自主学习。4. 教师队伍一体化- 加强教师培训。开展跨学段的教师培训活动，提高教师对思政课一体化的认识和教学能力。培训内容可以包括课程标准解读、教学方法交流、教材分析等。- 建立教师交流机制。鼓励不同学段的思政课教师相互听课、评课，分享教学经验和教学资源。同时，可以组织教师开展联合教研活动，共同探讨教学中的问题和解决方案。- 提高教师综合素质。思政课教师不仅要具备扎实的专业知识，还要有高尚的师德师风和较强的教育教学能力。要加强教师的思想政治教育和师德师风建设，提高教师的责任感和使命感。5. 评价体系一体化- 建立科学合理的评价体系。评价内容要涵盖学生的知识掌握、能力发展、情感态度等方面，既要注重结果评价，也要重视过程评价。- 统一评价标准。根据不同学段的教学目标和要求，制定相对统一的评价标准，确保评价的公平性和客观性。- 加强评价反馈。及时将评价结果反馈给教师和学生，帮助教师改进教学方法，引导学生调整学习策略。四、研修总结新时代背景下，思政课一体化建设是一项系统工程，需要教育部门、学校、教师和社会各方共同努力。通过课程目标、课程内容、教学方法、教师队伍和评价体系的一体化建设，可以提高思政课的教学质量和育人效果，为培养德智体美劳全面发展的社会主义建设者和接班人奠定坚实的思想基础。作为一名教师，我将积极参与思政课一体化建设，不断提高自己的教学水平，为学生的成长和发展贡献自己的力量。"
                    setTimeout(tijiao,3252)
                }else if(localStorage.getItem('key')=="0"){
                    const inputElement = document.querySelector('.el-input__inner');
                    inputElement.value = '研修日志：《从“四有”好老师到教育家精神》';
                    const inputEvent = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(inputEvent);
                    editorContent.innerHTML ="研修日志二：《从“四有”好老师到教育家精神》一、研修主题背景习近平总书记提出的“四有”好老师标准，即有理想信念、有道德情操、有扎实学识、有仁爱之心，为广大教师指明了努力的方向。而教育家精神则是在“四有”好老师的基础上，对教师提出的更高要求。本次研修旨在深入探讨从“四有”好老师到教育家精神的内涵与实践路径。二、“四有”好老师的内涵与重要性1.有理想信念-教师要有正确的政治方向和坚定的共产主义信仰，忠诚于党和人民的教育事业。只有心中有理想信念，才能在教学中引导学生树立正确的世界观、人生观和价值观。-例如，一位优秀的历史老师，通过讲述中国近现代史，让学生深刻认识到中国共产党的领导是历史的选择、人民的选择，激发学生的爱国之情和报国之志。2.有道德情操-教师要具备高尚的道德品质和职业道德，以身作则，为学生树立榜样。教师的言行举止对学生有着深远的影响，因此，教师要严格要求自己，做到言行一致、表里如一。-比如，一位语文老师在日常生活中尊老爱幼、乐于助人，这种良好的品德会潜移默化地影响学生，使他们也养成良好的道德习惯。3.有扎实学识-教师要具备扎实的专业知识和教育教学能力，不断学习和更新自己的知识体系，提高教学水平。只有具备扎实的学识，才能满足学生的求知需求，激发学生的学习兴趣。-例如，一位数学老师不仅精通数学学科知识，还了解数学史、数学文化等方面的内容，能够在教学中拓宽学生的视野，提高学生的学习积极性。4.有仁爱之心-教师要关爱每一个学生，尊重学生的个性差异，因材施教。教师的爱是无私的，它能够温暖学生的心灵，激发学生的潜能，让学生在关爱中成长。-比如，一位班主任老师关注每一个学生的成长，对学习困难的学生给予耐心的辅导和鼓励，对家庭困难的学生给予关心和帮助，让学生感受到老师的关爱和温暖。三、教育家精神的内涵与体现1.教育情怀-教育家精神首先体现为对教育事业的热爱和执着。教育家们把教育视为自己的生命，为了教育事业无私奉献，不计个人得失。-例如，陶行知先生放弃了优越的生活条件，投身于乡村教育事业，为中国的教育改革和发展做出了巨大贡献。他的“捧着一颗心来，不带半根草去”的教育情怀，激励着无数教育工作者。2.教育智慧-教育家们具有卓越的教育智慧，能够根据不同的教育情境和学生特点，灵活运用教育教学方法，达到最佳的教育效果。-比如，苏霍姆林斯基在教育实践中，总结出了许多行之有效的教育方法，如“让每一个学生都抬起头来走路”“用心灵去认识学生”等。他的教育智慧为广大教育工作者提供了宝贵的借鉴。3.教育创新-教育家们敢于创新，勇于突破传统的教育模式和观念，探索适合时代发展和学生需求的教育新途径。-例如，叶圣陶先生提出了“教是为了不教”的教育理念，强调培养学生的自主学习能力和创新精神。他的教育创新思想对中国现代教育的发展产生了深远的影响。4.教育担当-教育家们具有强烈的社会责任感和使命感，他们不仅关注学生的成长和发展，还关注社会的进步和民族的未来。-比如，晏阳初先生致力于平民教育，他认为“欲‘化农民’，必先‘农民化’”，深入农村，为提高农民的素质和生活水平而努力奋斗。他的教育担当精神为中国的乡村教育和社会改革做出了重要贡献。四、从“四有”好老师到教育家精神的实践路径1.坚定理想信念，增强教育情怀-教师要不断加强思想政治学习，提高自己的政治觉悟和理论水平，坚定共产主义信仰和中国特色社会主义信念。-要树立正确的职业观和价值观，把教育事业作为自己的终身追求，增强教育情怀，热爱教育、热爱学生、热爱学校。2.提升道德修养，展现人格魅力-教师要加强道德修养，提高自己的道德品质和职业道德水平。要做到言行一致、表里如一，以身作则，为学生树立榜样。-要注重自身的人格魅力培养，以高尚的人格感染学生、影响学生，赢得学生的尊重和信任。3.加强学习研究，提高专业素养-教师要树立终身学习的理念，不断学习和更新自己的知识体系，提高自己的专业素养和教育教学能力。-要积极参加各种培训和教研活动，与同行交流经验，分享教学成果，共同提高教学水平。要开展教育教学研究，探索教育教学规律，创新教育教学方法，提高教育教学质量。4.关爱学生成长，践行仁爱之心-教师要关爱每一个学生，尊重学生的个性差异，因材施教。要关注学生的身心健康，关心学生的学习和生活，帮助学生解决实际困难。-要建立良好的师生关系，与学生平等对话，倾听学生的心声，理解学生的需求，做学生的良师益友。5.勇于创新实践，担当教育使命-教师要敢于创新，勇于突破传统的教育模式和观念，探索适合时代发展和学生需求的教育新途径。-要积极参与教育改革和实践，为推动教育事业的发展贡献自己的力量。要担当起教育的使命，培养德智体美劳全面发展的社会主义建设者和接班人，为实现中华民族伟大复兴的中国梦而努力奋斗。五、研修总结从“四有”好老师到教育家精神，是教师专业发展的更高追求。在新时代，我们要以“四有”好老师为标准，不断提升自己的综合素质，努力向教育家精神迈进。通过本次研修，我深刻认识到了“四有”好老师和教育家精神的内涵与重要性，明确了自己的努力方向。在今后的教学工作中，我将坚定理想信念，提升道德修养，加强学习研究，关爱学生成长，勇于创新实践，为培养更多的优秀人才贡献自己的力量。"
                    setTimeout(tijiao,3252)
                }
            }
        }
    }
    function tijiao(){
        document.querySelector("div.flex.f16 > div.bottom_btn.ml15.on.f20").click()
    }

})();
