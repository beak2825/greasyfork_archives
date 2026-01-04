// ==UserScript==
// @name         2021广东省教师公需课学习
// @namespace    https://www.v587.com/
// @version      1.26
// @description  教师公需课学习不弹窗口刷
// @author       penrcz
// @match        https://jsglpt.gdedu.gov.cn/ncts/study/course/c_*
// @match        https://jsglpt.gdedu.gov.cn/ncts/a_*
// @match        https://jsxx.gdedu.gov.cn/a_*
// @match        https://jsxx.gdedu.gov.cn/study/course/c_*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://lib.baomitu.com/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427844/2021%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/427844/2021%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    //定时刷新session时间
    var resetTime = 0;

    //定时reload
    var reload = 0;

    //观看时间
    var viewTime = Number($(".g-study-prompt span").first().text());


    //删除弹出窗口
    $("input[id^=time_]").remove();

    //缩小播放窗口
    $(".video-frame-wrap").css({ width: "128px", height: "128px" });
    $("#video").css({ height: "128px" });

    if(unsafeWindow.player != null && unsafeWindow.player.volume != 0){
        unsafeWindow.player.volume = 0;
    }

    //判断是否考核
    var _kaohe = $(".txt:contains('当前活动：《考核》')");
    if(_kaohe.length > 0){
        _tiku();
    }else{
        nextC();
        window.setInterval(nextC, 120000);//2分钟
    };

    function nextC(){

        if(reload >= (viewTime + 2)){
            //unsafeWindow.goNext();
            //return;
            window.location.reload(true);
        }

        var _time = unsafeWindow.time;

        if(typeof(_time) == "undefined"){
            window.clearInterval(nextC);
            return;
        }

        _p(_time + "是否已完成:"+(unsafeWindow.isComplete ? "是" : "否") + ";resetTime=" +resetTime + ";reload="+reload+";viewTime="+viewTime);
        if(unsafeWindow.isComplete){
            unsafeWindow.goNext();
            return;
        }else{
            if(resetTime > 26){
                resetTime = 0;
                $.ajax({
                url: '/ncts/resetSession',
                success: function(data){
                    if(data.responseCode == '00'){
                        console.clear();
                        _p("刷新session成功");
                    }else{
                         _p('访问超时, 请重新登录');
                    }
                }});
            }
        }

        resetTime += 2;
        reload += Math.ceil(Math.random()*8);

        if(unsafeWindow.player.V != null && unsafeWindow.player.V.paused){
            unsafeWindow.player.V.play();
        }

        if(unsafeWindow.player != null && unsafeWindow.player.volume != 0){
            unsafeWindow.player.volume = 0;
        }
    }

})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}

function _tiku(){
    var $ = $ || window.$;
    //判断题,正确的
    var pd_true = new Array();

    pd_true.push("工业互联网是实现创造业智能化的核心，目前全球主要国家正加快工业互联网战略布局，以抢占未来制造业竞争的制高点。");
    pd_true.push("积极推动区块链在教育、就业、养老、精准扶贫、医疗健康、商品防伪、食品安全等领域的应用");
    pd_true.push("目前，我国人工智能的各个领域全面发展，包括机器人机器学习、计算机视觉、专家系统、自然语言处理");
    pd_true.push("我国智慧城市发展大体上经历了四个时期：探索实践期、规范调整期、战略攻坚期、全面发展期。");
    pd_true.push("使面向工业制造的CPS集成应用系统开发利用速度得到提升。");
    pd_true.push("当前大数据的数据规模为：从数十GB到十几ZB级。");

    //
    pd_true.push("广东省建设起步早");
    pd_true.push("互联网络、内部网络、外部网络");
    pd_true.push("对具体运营时间不做要求是粤港澳科技企业孵化载体的认定特点之一");
    pd_true.push("大湾区经济社会整合的困境有“两制”差异制约公共产品供给合作");
    pd_true.push("RFID");


    //2022
    pd_true.push("碳市场价格的影响因素包括配额总量设定、市场结构、产业结构、政策预期等");
    pd_true.push("广东碳市场的参与主体包括控排企业、机构投资者、个人投资者");
    pd_true.push("数字能源建模与方法进一步针对能源系统微观主体行为的仿真建模方法");
    pd_true.push("环境污染具有很强的负外部性");

    var _t = "制造业的数字化转型是个系统工程|说的数据是指任何以电子或者其他方式对信息的记|人需要学习操作机|创新的认知属性有相对优势|数据既可以是连续的值也可以是离散的值|数据是数字经济时代新的生产要素|区块链应用到元宇宙中主要是";

    var _ts = _t.split("|");
    $.each(_ts,function(i,n){
        pd_true.push(n);
    });

    $.each(pd_true,function(i,n){
        var _find = $(".m-topic:contains('"+n+"')");
        _find.find(".m-radio-tick:contains('正确')").find("input").click();
    });

    // 判断题 错误
    var pd_false = new Array();
    pd_false.push("北美和欧洲是全球人工智能发展最为迅速的地区，亚洲的人工智能发展相对缓慢。");
    pd_false.push("现阶段所实现的人工智能大部分指强人工智能，并且已经被广泛使用。");
    pd_false.push("我国目前属于人工智能整体水平、技术、人才等优势明显的第一梯队。");
    pd_false.push("因此“新零售”仅仅局限于“阿里巴巴新零售”。");

    pd_false.push("信息储存量小，获取低效，慢速");
    pd_false.push("申报主体应为广东省内注册的独立法人，机构实际注册并运营满2年");
    pd_false.push("数字化、智能化、网络化并非是一场思维、思想与系统管理的革命");
    pd_false.push("三螺旋—场相互作用模型");
    pd_false.push("重塑世界经济结构和国");

    //2022
    pd_false.push("碳中和是指一定时间内某地区所有排放的二氧化碳");
    pd_false.push("工业是我国二氧化碳排放最高的终端部门");
    pd_false.push("我国承诺二氧化碳排放量力争在2030年前达到峰值，2050年前实现碳中和的目标承诺");
    pd_false.push("“碳中和”是指二氧化碳和氮氧化物的中和");
    pd_false.push("能源在其开发利用过程中，存在着诸如市场、价格、供求关系等各种各样的经济现象，");
    pd_false.push("碳达峰和碳中和之间没有关系");

    var _f = "全国1/3地方平台实现五级覆盖|数据共享流通激励充足|虚拟人是一类以真实存在的";

    var _fs = _f.split("|");
    $.each(_fs,function(i,n){
        pd_false.push(n);
    });

    $.each(pd_false,function(i,n){
        var _find = $(".m-topic:contains('"+n+"')");
        _find.find(".m-radio-tick:contains('错误')").find("input").click();
    });

    //单选题
    var _dx = new Array();
    _dx.push(["人工智能产业发展的关键技术除了大数据以外还包括","以上都是"]);
    _dx.push(["智能制造、智慧城市、智能医疗、智慧教育等产业具有","融合特征"]);
    _dx.push(["下列先阶段“人工智能＋制造”主要面临的挑战中，哪个描述的不对","全部领域数据资产管理能力有待提升"]);
    _dx.push(["以下关于语音识别技术涉及的领域，哪个选项是错误的","语音整合"]);
    _dx.push(["知识抽取的关键技术是","实体识别、关系抽取、事件抽取"]);
    _dx.push(["世界各国对战略性新兴产业的发展普遍予以高度重视","十二五"]);
    _dx.push(["强调要加快创新成果转化应用、彻底打通官咖、破解实现","技术突破、产品制造、市场模式、产业发展"]);
    _dx.push(["知识抽取的关键技术是","实体识别、关系抽取、事件抽取"]);
    _dx.push(["在以下信息抽取实例中，哪个抽取类别和内容是不一致的","姓名"]);
    _dx.push(["世界各国对战略性新兴产业的发展普遍予以高度重视，但中国在","十二五"]);
    _dx.push(["金融领域的科技应用可以分为","金融信息化、互联网金融、科技金融"]);
    _dx.push(["以下数据量可以称为大数据的是","100PB"]);
    _dx.push(["习近平总书记高度重视科技创新与成果转化工作，强调要加快创新成果转化应用","技术突破、产品制造、市场模式、产业发展"]);


    _dx.push(["广东省有多少家国家级大学科技园","3"]);
    _dx.push(["太阳能光伏设备代表企业","江苏省"]);
    _dx.push(["中大创新谷的服务模式","投资促进型"]);
    _dx.push(["机器人可以分为","工业机器人和服务机器人"]);
    _dx.push(["2019年全球风机制制造商前十五强中","8"]);
    _dx.push(["广东未来技术发展唯","自主创新"]);
    _dx.push(["新高技术战略——创新","智能交通"]);
    _dx.push(["2025十大重点","新一代信息通信技术产业"]);
    _dx.push(["互联网+","2015"]);

    //2022 年题目
    _dx.push(["不属于温室气体","二氧化硫"]);
    _dx.push(["将三氟化氮NF3","2008"]);
    _dx.push(["什么是碳达峰","碳排放达到最高点"]);
    _dx.push(["什么是碳中和","人为碳排放与人为碳吸收达到平衡"]);
    _dx.push(["全球第一部具有法律约束力的国际公约是","联合国气候变化框架公约"]);
    _dx.push(["中国提出达峰目标和碳中和的愿景的目的","发展方式"]);
    _dx.push(["已实现碳中和的国家是哪些","不丹"]);
    _dx.push(["比2005年下降","48.4"]);
    _dx.push(["我国煤炭占能源消费总量比重由2005年的72.4%下降至2020年","56.8"]);
    _dx.push(["哪些企业没有承诺到2060年实现碳中和","雪佛龙"]);

    _dx.push(["目前我国数字经济占比最高的产业领域是","第三产业"]);
    _dx.push(["推动我国数字经济健康发展","2021年"]);
    _dx.push(["处理个人信息无须对个人予以告知的情形包括","法律、法规规定应当保密"]);
    _dx.push(["违反《个人","五千万元以下或者上一年度营"]);
    _dx.push(["释放数据价值的有效路径","数据治理"]);
    _dx.push(["数字经济时代的关键生产要","数据"]);
    _dx.push(["中利用的东部优势资源主要","数据与算力资源"]);
    _dx.push(["以下哪些领域不属于新基建","公路建设"]);
    _dx.push(["经济增长的贡献率最高","数字经济"]);
    _dx.push(["数字化转型岗位占比提升最","第三产业"]);


    $.each(_dx,function(i,n){
        var _find = $(".m-topic:contains('"+_dx[i][0]+"')");
        _find.find(".m-radio-tick:contains('"+_dx[i][1]+"')").find("input").click();
    });

    //多选题
    var _dxs = new Array();
    _dxs.push(["以下关于人工智能的定义，哪些是正确的",["指包括计算、数据资源、人工智能算法和计算研究","基于指人工智能算法和技术进行研发及拓展应用的产业"]]);
    _dxs.push(["人工智能三要素是什么",["数据","算法","算力"]]);
    _dxs.push(["农业智能化有哪些特征",["农业生产要素数字化","农业决策大数据化","全天候服务个性化","农业管理信用化"]]);
    _dxs.push(["从基础支撑技术层面对大数据智能本身基础关键体术体系进行研究",["数据采集清洗","数据的存储管理","数据的可视化分析"]]);
    _dxs.push(["图像处理的一般过程包含",["图像增强","图像变换","图像生成"]]);
    _dxs.push(["在自然语言处理中子任务——自动摘要中",["抽取式","抽象式"]]);
    _dxs.push(["云边协同的内容包括",["资源","智能","数据","服务"]]);
    _dxs.push(["大数据具有那些特点",["数据体量巨大","数据种类繁多","价值密度低","处理速度快"]]);
    _dxs.push(["列不属于边缘智能面对的技术挑战类别的是",["数据样本过多","人才短缺"]]);
    _dxs.push(["知识图谱体系中，哪几个选",["语义搜索","智能问答","辅助决策"]]);

    _dxs.push(["三螺旋空间具",["A","B","C"]]);
    _dxs.push(["广东省数字经济发展面临的形势",["A","B","C","D"]]);
    _dxs.push(["孵化器模式的基本要素包括以下哪几项",["B","C","D"]]);
    _dxs.push(["发达国家新一代信息技术发展战略重点包括以下哪几项",["A","B","C"]]);
    _dxs.push(["广东省启动的第一批省实验室包括以下哪些",["A","B","C"]]);
    _dxs.push(["基于功能的数字平台可分为哪几类",["A","B","D"]]);
    _dxs.push(["制造业转型升级的重点有以下哪些",["A","B","C"]]);
    _dxs.push(["数据引发的新模式、新业态包括以下哪些",["A","B","C","D"]]);
    _dxs.push(["粤港澳大湾区发展规划纲要",["A","B","C"]]);
    _dxs.push(["习近平总书记多次提及高质量发展",["A","B","C"]]);

    //2022
    _dxs.push(["二氧化碳CO₂排放来源包括",["A","C","D"]]);
    _dxs.push(["甲烷排放CH4来源包括",["B","D","E"]]);
    _dxs.push(["以下不属于可再生能源的是",["B","C","D"]]);
    _dxs.push(["我国2060年实现碳中和的路线图为",["A","B","C"]]);
    _dxs.push(["自愿减排机制下可交易的品种有",["B、","C、","D、"]]);
    _dxs.push(["绿色金融助力碳达峰碳中和的功能有",["A","B","D"]]);
    _dxs.push(["目前鼓励作为零碳工程示范的措施其中包括",["A","B","C","D"]]);
    _dxs.push(["目前可在零碳示范区推广的最成熟的技术为",["A","C"]]);
    _dxs.push(["要实现温升1.5度目标",["B","D"]]);
    _dxs.push(["下列哪些属于气候变化带来的灾害",["A","B","C","D"]]);


    _dxs.push(["数字经济体系的主要内容包括",["A","B","C","D"]]);
    _dxs.push(["数字化转型将在",["A","B","C","D"]]);
    _dxs.push(["下列属于敏感个人信息的是",["A","B","C","D"]]);
    _dxs.push(["下列属于《数据",["A","B","D"]]);
    _dxs.push(["零售业经历的阶段",["A","B","C","D"]]);
    _dxs.push(["零售行业的发展从战略层面经历了哪几个阶段",["A","B","C"]]);
    _dxs.push(["东数西算对西部企业的影响包括",["A","B","C"]]);
    _dxs.push(["东数西算”对全国区域发展格局的意义有",["A","B","C","D"]]);
    _dxs.push(["模块化数据中心技术大致可分为",["A","B","C"]]);
    _dxs.push(["数据要素的新特征",["A","C","D"]]);

    $.each(_dxs,function(i,n){
        var _find = $(".m-topic:contains('"+_dxs[i][0]+"')");
        var _as = _dxs[i][1];
        $.each(_as,function(ai,an){
            _find.find(".m-checkbox-tick:contains('"+_as[ai]+"')").find("input").click();
        });
        
    });
}