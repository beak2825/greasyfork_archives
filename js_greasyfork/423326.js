// ==UserScript==
// @name         云学堂CCAP最终考试答案查询脚本
// @namespace    www.wlfcss.com
// @version      0.0.1
// @description  本脚本严禁外传
// @author       wlfcss
// @match        http://*.yunxuetang.cn/exam/test/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/423326/%E4%BA%91%E5%AD%A6%E5%A0%82CCAP%E6%9C%80%E7%BB%88%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423326/%E4%BA%91%E5%AD%A6%E5%A0%82CCAP%E6%9C%80%E7%BB%88%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// @match        *://*/*
 
//去除切屏页面监听
window.onmouseleave = window.onblur = window.onmouseout = document.onmouseleave = document.onblur = document.onmouseout = document.body.onmouseleave = document.body.onblur = document.body.onmouseout = onmouseleave = onblur = onmouseout = null;
 
(function() {
 
    //主函数
    console.log('Hello Answer!');
    for(var i=0; i < $('div.col-18.font-size-16').length; i++){
        if($('div.col-18.font-size-16').eq(i).children("div:lt(1)").text()){
            var stem =$.trim($('div.col-18.font-size-16').eq(i).children("div:lt(1)").text());
            console.log(i/2+1 +'. ' + stem)
            var answers= findAnswer(stem)
            if (answers == false || answers == 'false'){
                console.log('本题暂无正确答案');
                console.log('');
            }else if(answers=='error'){
                console.log('发生错误！，本题无法匹配到任何答案（题干）');
                console.log('');
 
            }else{
                //console.log(answers.toString());
                for(var x=0; x<answers.length;x++){
                    console.log('选项',x+1,': ',answers[x])
                }
                console.log('');
            }
        }
    }
 
    //字符串相似度比较函数
    function compare1(x, y) {
        var z = 0;
        //console.log(typeof x);
        //判断是否为字符串
        if(typeof x == "string"){
            x=x.split("");
            y=y.split("");
        }
        var s = x.length + y.length;;
        x.sort();
        y.sort();
        var a = x.shift();
        var b = y.shift();
        while(a !== undefined && b !== undefined) {
            if (a === b) {
                z++;
                a = x.shift();
                b = y.shift();
            } else if (a < b) {
                a = x.shift();
            } else if (a > b) {
                b = y.shift();
            }
        }
        return z/s * 200;
    }
 
 
    //找答案函数，DATA_STEM 是题干，DATA_ANSWER是答案，按照顺序一一匹配
    function findAnswer(stem){
        //-------------- CCAA -----------------
         //-------------- CCAP最终考试 -----------------
        var DATA_STEM= ['下面属于云从公有云平台提供的基础应用是（）', '以下关于视频全量结构化说法错误的是？', '以下关于票据OCR训练平台说法不正确的是？', '户型关注功能主要是依靠哪种AI技术实现的？()', '城市管理五位一体的要求是：', '关于NLP，以下哪一项还不是能成熟应用的技术？', '轻舟在交通行业的应用主要有', '云从REID技术具有多方面的特点，关于REID技术的说法，不正确的是？', '以下关于OCR部署方式，说法有误的是哪一项？', '以下关于AI服务对接调用的说法错误的是？', '云从已经具有多种卡证票据OCR产品，关于这些产品以下说法正确的是？', '轻舟在智慧城市中可以起到什么作用？', '以下关于人机交互的NLP技术，以下哪一项的说法是错误的？', '智慧案场中渠道风控功能为客户带来的核心价值是什么？（）', '人脸对齐直接依赖于哪一项步骤？', '关于特定场景设备说法正确的是？', '以下关于人脸识别说法错误的是？', '以下关于声纹识别的应用，使用不正确的是？', '目前通过与轻舟平台的AI服务接口对接，可以获取哪些服务能力？', '关于语音识别，以下说法正确的有哪些？', '智慧图书馆方案中基于轻舟提供哪些能力？', '轻舟平台可支持哪些行业场景的应用？', '轻舟应用于教育场景以下那些说法正确', '云从公有云产品主要服务方式有（）', '零售解决方案中涉及到的主要功能有', '关于云从通用表格识别的说法正确的有？', '关于语音识别的应用，以下说法正确的有哪些？', '以下哪几项是属于云从OCR产品的优势？', '关于实体提取算法及其应用，以下说法正确的有哪些？', '消息总线与系统交互的数据主要包括哪些？', '轻舟平台已接入下面哪些类型的设备？', '轻舟自带的标准应用集有哪些？', '公有云SAAS服务的优势包括以下哪些？（）', 'REID技术目前有哪些重要的研究方向？', '以下哪些是设备的基本协议？', '云从公有云平台提供的产品类型包括哪些？（）', '以下关于自然场景下的OCR识别说法正确的是？', '关于云从公有平台架构说法正确的是？（）', '图书馆方案中,AR眼镜有哪些作用', '智慧图书馆方案人脸收集的方式包括', '以下那几项属于CWOS层？', '公有云API接口调用的收费模式一般有哪些（）', '轻舟松耦合的平台架构主要包含？', '采用混合云方式实现的智慧案场方案中包括了主要以下哪些产品？（）', '通过轻舟平台提供的API接口，可以与哪些基础功能模块实现对接？', '商业抓拍机的产品特性有哪些？（）', '轻舟平台通常添加设备包括哪些步骤？', '公有云SAAS平台应用服务适合的客户特点包括哪些？（）', '轻舟在教育行业都可以做到那些方面的具体应用', '以下对轻舟平台价值描述正确的是？']
        var DATA_ANSWER= [['访客管理'], ['人脸人体关联，需要用户手动关联；'], ['票据OCR训练平台面向固定版式的图像识别，版式不列举出来也可通用'], ['REID'], ['以上说法都正确。'], ['阅读理解'], ['客流统计'], ['REID技术不对人脸进行属性分析，故行人人脸遮挡现象不会影响REID分析应用性能'], ['不支持离线部署'], ['consul组件是一种服务管理软件，对于AI服务调用的对接实现没有实际关联意义'], ['某些证件版本过老，比如房产证，目前无法识别'], ['以上都正确'], ['检索式和任务式是两种不同的交互模式，不能二者结合应用'], ['降本'], ['人脸关键点'], ['需要通过智能网关接入CWOS，通过特定协议接口进行事件定制，轻舟平台进行事件消费，轻舟平台充当数据通道。'], ['每次特征值提取都需要进行人脸识别算法训练；'], ['将说话人的音频转换为文字'], ['人脸识别', '人体识别', '车辆识别'], false, ['地磁导航', '刷脸借阅', '残障人士识别', 'AR眼镜'], ['零售行业', '交通行业', '政务行业', '医疗行业'], ['校园走廊', '图书馆管理', '教学楼、操场', '校园安全'], ['API接口调用', '平台SAAS服务'], ['会员画像', '证件识别', '会员洞察', '人脸识别'], ['通用表格识别支持对各类表格图片、文档中的表格、财务报表、保险单及各类信息登记表进行识别', '采用深度学习技术，训练表格信息的行列版式提取模型，以适应非固定版本的表格版式', '是一种基于高精度通用文本识别的表格文档识别技术'], ['通过语速、音量、情感、互动次数、通话静默检测客服代表的服务质量水平及情绪变化情况', '将会议和访谈的音频转换成文字存稿，让后期的信息检索和整理更方便快捷。', '语音交互是基于语音识别（ASR）、语音合成（TTS）、自然语言理解（NLU）等技术'], ['训练所需数据少', '强大的后台管理能力', '开发周期短', '自研的具有领先性的算法', '识别精度高'], ['实体提取的两个关键指标是精准率和召回率', '可以从一段文本中提取人名、机构名、地理位置、数字、时间、产品等实体信息', '是从给定的自然语言的文本中提取出指定实体信息的技术', '通过对文档的实体提取，可以对文档信息进行结构化'], ['RTSP流分析抓拍数据', '前端比对数据', '后端识别抓拍数据'], ['智能人脸测温一体机', '视频流摄像机', '智慧工地安全帽识别终端', '人脸识别终端', '人脸抓拍机'], ['区域布控', '社区人口管理', '.门禁、考勤管理'], ['无需自建平台', '只需注册开通服务即可', '建设成本低'], ['姿态识别', '动作识别', '行人跟踪', '行人检测及行人分割'], ['获取服务器时间', '上报终端基本信息', 'http心跳、tcp心跳'], ['行业类应用', '基础通用类产品', '解决方案类应用'], ['道路监控下，对车辆车牌的识别，是一个自然场景OCR识别的应用场景', '自然场景中的图像空间结构复杂，图像内的文本行可能存在大量干扰畸变，鲜有规律可循，是实现OCR识别的一大难点。', '目前自然场景下的集装箱号识别，卡口车牌识别，识别率均能达到95%以上', '是基于云从科技自研的通用OCR技术框架在特定自然场景中的应用'], ['多种分布式基础组件确保平台的大规模处理能力', '可提供场景基础应用或行业解决方案', 'IAAS层支持多种平台'], ['精准化服务', '智能推荐', '贴心服务', '无感服务'], ['认证合一终端；', '终端办证机', '微信小程序'], ['引擎算法', '智能网关', '分布式引擎'], ['按调用次数', '包时收费', '次数套餐包'], ['设备层', '应用层', '系统层'], ['渠道风控云', '人证核验设备', '人脸抓拍机', '轻舟云'], ['人员管理', '设备管理', '资源管理'], ['选择了200万分辨 率的最优秀的sensor，并进行了专有的ISP优化以自动适应多种环境。', '在动态抓拍效果上，抓拍的人脸图像更为清晰。', '在低照度的环境下，图像相对一般摄像机更为明亮。', '飞跃的抓拍性能，在正确安装情况下，抓拍率可达到到99%'], ['填写设备账户名密码', '填写设备IP或编码', '选择设备前后端识别类型', '选择设备类型'], ['无定制化要求', '对成本控制要求高'], ['校园精细化管理', '校园安全管理', '教学量化管理', '教学过程管理'], ['项目中多种设备可选', '支持ISV自建生态', '具有行业领先的AI能力', '具有标准的应用簇']]
 
        var answerFateRatio=0;
        var theNumber=0;
        for (var i=0; i < DATA_STEM.length; i++){
            var ratio=compare1(DATA_STEM[i],stem);
            if (ratio>answerFateRatio){
                answerFateRatio = ratio;
                theNumber = i;
            }
        }
        if(answerFateRatio>85){
            //console.log('对比相似度:',answerFateRatio)
            if (DATA_ANSWER[theNumber] == false){
                return false;
            }
            else{
                return DATA_ANSWER[theNumber]
            }
        }else if(answerFateRatio>60){
            console.warn('警告！对比相似度偏低:',answerFateRatio)
            if (DATA_ANSWER[theNumber] == false){
                return false;
            }
            else{
                return DATA_ANSWER[theNumber]
            }
        }else{
            console.error('错误！对比相似度过低(请检查脚本代码！是否打开了对应考试的数据记录！):',answerFateRatio,'\n',DATA_ANSWER[theNumber])
            return 'error'
        }
    }
})();