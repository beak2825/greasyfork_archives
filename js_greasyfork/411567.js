// ==UserScript==
// @name         在成绩查询中直接显示通选课的类别！
// @namespace    https://wr786.github.io/
// @version      0.1.2
// @description  upd patch for new score page
// @author       wr786
// @match        *://pkuhelper.pku.edu.cn/my_score/*
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/411567/%E5%9C%A8%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E4%B8%AD%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%80%9A%E9%80%89%E8%AF%BE%E7%9A%84%E7%B1%BB%E5%88%AB%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/411567/%E5%9C%A8%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E4%B8%AD%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%80%9A%E9%80%89%E8%AF%BE%E7%9A%84%E7%B1%BB%E5%88%AB%EF%BC%81.meta.js
// ==/UserScript==

function getElementsByClass(Parent,Class){
    var Result = [];
    var Node = Parent.getElementsByTagName("*");
    for(var i=0; i<Node.length; i++){
        if(Node[i].className == Class){
            Result.push(Node[i]);
        }
    }
    return Result;
}

function addCourseArea() {
    getElementsByClass(document, 'viewer')[0].childNodes.forEach(function(semester) {
        var typeA = ['古今数学思想','数值方法:原理、算法及应用','普通统计学','音乐与数学','演示物理学','人类生存发展与核科学','可再生能源与低碳社会','自然科学中的混沌和分形','大气概论','理论物理导论','物理宇宙学基础','纳米科学前沿','今日物理','公共物理学','今日新材料','功能化学','魅力化学','化学与社会','大学化学','普通生物学实验','生物进化论','人类的性、生育与健康','保护生物学','普通生物学（B）','普通生物学（A）','太空探索','地球与空间','矿产资源经济概论','自然资源与社会发展','地球历史概要','地震概论','地史中的生命','地球环境与人类社会','世界文化地理','中国历史地理','自然保护学','生态学导论','中国自然地理','心理学概论','电子资源的检索与利用','数字化艺术','微电子学概论','社会科学中的计算思维方法','海洋科学导论','人类生存发展与环境保护','全球环境问题','环境科学导论','环境材料导论','环境伦理概论','中医养生学','医学发展概论'];
        var typeB = ['世界文化地理','广告学概论','跨文化交流学','影像与社会','影像与中国社会（英文）','战后东亚政治发展','日本及日本人论','明清经济与社会','管理哲学','美国文化与社会','中国政治概论','中国边疆问题概论','亚太概论','世界政治中的民族问题','中东：政治、社会与文化','中东地区的国家关系','晚清对外关系的历史与人物','国际关系与东亚安全','中苏关系及其对中国社会发展的影响','台湾政治概论','当代国际政治','伊斯兰与世界政治','微观经济学','宏观经济学','外国经济史','中华人民共和国经济史','经济学原理（I）','经济学原理（Ⅱ）','公共经济学','中国经济思想史','中国经济导论','社会企业家精神培养实验','风险管理与保险','管理学','营销学原理','金融学概论','微观经济学','外国刑法','外国宪法','法学流派与思潮','犯罪通论','国际人权法','刑法学','英美侵权法','法律导论','广告学概论','社会性别研究','教育社会学思考','人类学导论','社会学导论','民族与社会','自杀社会问题研究','生物学对社会科学的启示','人口资源环境社会学','中国社会：结构与变迁','政治学原理','日本经济','圣经概述和导读','奥林匹克文化','学术规范与论文写作','社会科学中的计算思维方法','经济学原理','博弈与社会','当代国防','孙子兵法导读','健康的生活方式与健康传播'];
        var typeC = ['社会心理学(B)','组织管理心理学','爱的心理学','大学生心理健康','心理学概论','哲学导论','逻辑导论','现代西方哲学','科学哲学导论','伦理学导论','美学原理','宗教学导论','美国环境思想','管理哲学','西方美学史','中国美学史','悖论研究','逻辑与批判性思维','印度佛教史','基督教和中国文化','东正教艺术','道教史','西方政治思想（中世纪）','西方政治思想（中世纪）讨论班','西方政治思想（现代）','佛教导论','坛经','中国佛教史','分析哲学概论','现代中国的建立：制度、思潮与人物','政治哲学','西方政治思想（古代）','近代西方哲学','环境伦理学','中国古代思想世界','西方哲学史','庄子哲学','孔子与老子','《四书》精读','文学与伦理','世界文明中的科学技术','尼采《查拉图斯特拉如是说》','西方思想经典（一）','西方思想经典（二）','西方思想经典(三)','哲学与人生','心理卫生学概论','阿拉伯伊斯兰文化','周易精读'];
        var typeD = ['中国历史地理','中国图书出版史','世界电影史','中华人民共和国史专题','中华民国史专题','中国古代史（上）','中国古代史（下）','中国通史（近代部分）','世界通史（上）','世界通史（下）','基督教文明史','中国古代政治与文化','二十世纪中外关系史','欧洲文艺复兴','二十世纪世界史','西方文明史导论','人类发展与环境变迁','欧洲启蒙运动','中国传统官僚政治制度','二战以来影视中的两岸关系','近现代中日关系史','埃及学专题','中世纪西欧社会史','美国史通论','西方文化通论','当代印度史','拉美国家现代化进程研究','战后东亚政治发展','日本及日本人论','伊斯兰教与现代世界','西方当代历史学流派','大国崛起','中国近代政治与外交','文艺复兴经典名著选读','韩国史通论','艺术史','印度文明史','中国通史（古代部分）','秦汉魏晋南北朝政治历程','古希腊罗马历史经典','中国近代思想史','中国现代社会史','明清经济与社会','中国古代妇女史专题','罗马史','中国古代物质文化史','世界遗产概论','考古学与古史重建','道教史','中国佛教史','世界文明中的科学技术','晚清对外关系的历史与人物','外国经济史','中华人民共和国经济史','中国经济思想史','中国文化史','古代东方文明','中日文化交流史','中国美术史','中国电影史','西方美术史'];
        var typeE = ['金庸小说研究','音乐与数学','现当代建筑赏析','汉语修辞学','世界电影史','英语新闻阅读','民俗学','小说的艺术','鲁迅小说研究','中国现代文学名著研究','中文工具书及古代典籍概要','《论语》、《孟子》导读','台湾文学','老舍与现代中国文化','中国古籍入门','中国古代文学经典（一）','中国古代文学经典（二）','大学国文','中国现代文学经典选讲','唐宋诗词名篇精读(一)','国学经典讲论','古代小说名著导读','影片精读','文学概论','民俗研究','二战以来影视中的两岸关系','艺术史','美学原理','基督教和中国文化','东正教艺术','美国文化与社会','中国名著导读','视觉圣经--西方艺术中的基督教','东方文学史','泰戈尔导读','古代东方文明','日本文化艺术专题','东南亚文化','中日文化交流史','印度宗教','德语名家中国著述选读','禅与园林艺术','传记文学：经典人物研究','西方文学名著导读','俄罗斯艺术史','中俄文化交流史','欧洲文学选读','圣经释读','莎士比亚名篇赏析','西方音乐欣赏','中国美术史','经典昆曲欣赏','浪漫主义时代的欧洲音乐','影视鉴赏','艺术与审美','基本乐理与管弦乐基础','中外名曲赏析','中国电影史','中国流行音乐流变','中国美术概论','西方歌剧简史与名作赏析','西方美术史'];
        var typeEMT = ['音乐与数学','现当代建筑赏析','世界电影史','影片精读','东正教艺术','视觉圣经--西方艺术中的基督教','日本文化艺术专题','禅与园林艺术','俄罗斯艺术史','西方音乐欣赏','中国美术史','经典昆曲欣赏','浪漫主义时代的欧洲音乐','影视鉴赏','艺术与审美','基本乐理与管弦乐基础','中外名曲赏析','中国电影史','中国流行音乐流变','中国美术概论','西方歌剧简史与名作赏析','西方美术史'];
        var typeF = ['地球环境与人类社会', '环境伦理概论', '人类发展与环境变迁', '自然保护学', '可再生能源与低碳社会', '矿产资源经济概论'];

        var typeA_EN = ['语音与听说词汇','英语阅读','英语听说','实用基础英语写作'];
        var typeB_EN = ['高级英语听说','高级英语阅读','高级英语写作','高级英语口语','英语词汇的意义与用法','英语词汇与英美文化','英语名著与电影','英美戏剧和电影','美国短篇小说与电影','英美短篇小说赏析','汉英翻译：理论与实践','影视中的英美文化','当代英美纪录片中的中国文化和社会','英美戏剧概况','博雅英语阅读','美国文化概览','希腊罗马神话赏析','英语创意表述-TED 演讲视听说'];
        var typeC_EN = ['美国重要历史文献选读','西方文化选读','英美经典散文节选阅读','英国传统诗歌精华','语言、文化与交际','美国政治制度','英语语境中的中国历史与文化','英语非虚构作品中的近当代中国社会与文化','商务沟通与表达','学术英语阅读','英汉名作名译研读','经典英美诗歌翻译与鉴赏','西方人文英语','学术英语听说','科技前沿英语','语言、技术与社会','学术英语写作','新西兰历史与文化'];
        var typeD_EN = ['批判性思维与学术写作'];


        semester.childNodes.forEach(function(course) {
            if(course.className == 'course-row') {
                var courseInfo = course.firstElementChild.childNodes[1].firstChild.firstChild;
                if(courseInfo.firstChild.firstChild.nodeValue == null) {
                    var courseName = courseInfo.firstChild.firstChild.firstChild.nextSibling.nodeValue;
                    var courseType = courseInfo.childNodes[1].firstChild.nodeValue;
                    if(courseType.indexOf('任选') != -1 || courseType.indexOf('通选课') != -1) {
                        var courseTypeSuffix = [];
                        if(typeA.indexOf(courseName) != -1) courseTypeSuffix.push('A');
                        if(typeB.indexOf(courseName) != -1) courseTypeSuffix.push('B');
                        if(typeC.indexOf(courseName) != -1) courseTypeSuffix.push('C');
                        if(typeD.indexOf(courseName) != -1) courseTypeSuffix.push('D');
                        if(typeE.indexOf(courseName) != -1) courseTypeSuffix.push('E');
                        if(typeEMT.indexOf(courseName) != -1) courseTypeSuffix.push('(艺美)');
                        if(typeF.indexOf(courseName) != -1) courseTypeSuffix.push('F');
                        if(courseTypeSuffix.join()) {
                            console.log(courseName + ': ' + courseTypeSuffix.join());
                            courseInfo.childNodes[1].firstChild.nodeValue = courseType + '通选类别: ' + courseTypeSuffix;
                        }
                    } else {    // 再判断一下英语课类别
                        var courseTypeSuffix = [];
                        if(typeA_EN.indexOf(courseName) != -1) courseTypeSuffix.push('A');
                        if(typeB_EN.indexOf(courseName) != -1) courseTypeSuffix.push('B');
                        if(typeC_EN.indexOf(courseName) != -1) courseTypeSuffix.push('C');
                        if(typeD_EN.indexOf(courseName) != -1) courseTypeSuffix.push('C+');
                        if(courseTypeSuffix.join()) {
                            console.log(courseName + ': ' + courseTypeSuffix.join());
                            courseInfo.childNodes[1].firstChild.nodeValue = courseType + '英语课类别: ' + courseTypeSuffix;
                        }
                    }
                }
            }
        })
    })
}

var itv;

function checkStatus() {
    if(getElementsByClass(document, 'osu-button')[0] == undefined) {    // 只有点了查询才能显示啊
        addCourseArea();
        itv = window.clearInterval(itv)
    }
}

(function() {
    itv = window.setInterval(checkStatus, 1000);
})();