// ==UserScript==
// @name         咪咕自动巡检脚本工具
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  咪咕视频自动巡检脚本工具
// @author       AI数据标注猿
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firefoxchina.cn
// @grant         GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478584/%E5%92%AA%E5%92%95%E8%87%AA%E5%8A%A8%E5%B7%A1%E6%A3%80%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/478584/%E5%92%AA%E5%92%95%E8%87%AA%E5%8A%A8%E5%B7%A1%E6%A3%80%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';
     //存放通道连接地址
     var authenticationAisleList = [];
     //媒资ID
     var assetId;
    //账号ID
    var author;
    //通道地址
     var aisleId;
    //存储全量查询AI
    var url = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
    //存储判断是否有违规词
    var titleContainsChineseWordResult = false;
     //存放待查询人员名单(每行10个账号)
    var auditorList = ['zbs003yaomingwei'];

    //开始查询时间
    var startTime = '';
    //查询结束时间
    var endTime = '';

    //查询结果记录在csv中的表头,violationDescription(违规说明)
    const queryData = [
            ['auditor1', 'assetId1','author', 'assetName1','auditStatusStr1','labelName1','auditRemark1','aisleTime1','violationDescription1'], // 表头行
        ];

    //记录当前查询数据
    var auditor = '';
   //存放违禁词
    var searchWordLibrary = ['随刻','腾讯视频','好看视频','优酷','土豆','搜狐','乐视','西瓜视频','秒拍','抖音','快手','火山','最右','微博视频号','梨视频','皮这一下','皮皮虾','爱奇艺','小红书','直播吧','今日头条','百度视频','网易视频','哔哩哔哩','bilibili','西瓜体育','头条体育','爱奇艺体育','火山官方','火山美食','搜狐体育','头条',
                             '我的英雄学院','逃学威龙','头文字','大时代','地球停转之日','罪恶之城','巫师3','隐入尘烟','死亡笔记','暗杀教室','恶搞之家','辛普森一家','瑞奇和莫迪','一九四二','猫汤','我推的孩子','伊拉克恶狼谷','娜珍之交','禁忌女孩','有多卑微',
                             '黑白校园','疾速追杀','天龙八部','宁安如梦','人体蜈蚣','进击巨人','刃艾伦','阿尔敏','少林足球','奇幻潮','终极一班','全民目击','山河令','叶问大战约翰威克','澳门风云','相爱十年','剑雨','风云','隐如尘烟','情深深雨蒙蒙','康斯坦丁','大盗','黑客帝国','小时代','上海滩','欢乐今宵',
                             '徐濠萦','王全安','谭小环','罗志祥','翟天临','吴启明','林建明','叶德娴','李易峰','毛宁','张默','林夕','胡瓜','陈冠希','黄秋生','赵薇','张耀扬','薇娅','李云迪','李铁','范冰冰','炎亚纶','赵立新','孙兴','李易峰','柯震东','张元','高虎','邓伦','唐诗咏','张哲瀚','黄海波','高晓松','周峻纬','朴明秀',
                             '钙片','烟酰胺','鱼油','维生素','益生菌','护肝片','叶黄素','保健品推广','上海养老金', '康士坦丁','大佛普拉斯','里维斯','乐火团队','维尼熊','谢文东','绣春刀','特警新人类','虚竹','乔峰','段誉','鸠摩智','撒旦','夜神月','殷桃疑似恋情','陈奕迅最难唱的一首歌',
                             '特朗普','俄乌','美俄','老拜','拜登','泽连斯基','逃学威龙','城管','动漫推荐','头文字','AE86','缅北','鬼灭之刃','鸭脖','小萝莉','人生若如初见','我的英雄学院','人面鱼','李诞','香蜜沉沉烬如霜','珂珂动漫','岸田','香蜜','十月围城','为什么赵丽颖能大火',
                             '一口气看完','无间道','红色按钮','bbc','增肌粉','steam','战地','问诊','黑金','旺角监狱','阳光普照','梁家辉','那年那兔','太保','上海人寿','民国','中华民国','民国纪年','狂赌之渊','小清河','断桥','围栏','护城河','洪水','倪岳峰','晴雅集','楚乔传','白鹿原','封神',
                             '徐若瑄','达叔','娱乐圈','电锯人','梅根','博彩','丁蟹','以爱为名','光刻机','佩洛西','温州','祠堂','鹰酱','爱神','我唾弃你的坟墓','进击的巨人','情深深雨蒙蒙','talk','兔瓦斯','梅塔塔','江浩','爱神巧克力','周子瑜','瑞克和莫蒂','瑞克','车祸模拟器','一千零一夜','台湾名嘴','化工厂',
                             '我赌5包辣条','双男','↗️↘️↗️','房地产','刘亚仁','思悼','刘丞以','破坏之王','新知创作人','森美','练成了','韩剧双男','泰剧双男','同性','中国新说唱','聂小凤','雪花神剑','兄妹恋','天盛长歌','twice','以你的心诠释我的爱','中国最后一个太监','吕不韦','嬴异人','陷入通缩','负增长','中国有嘻哈',
                             '大碗宽面','青簪行','爵迹','我叫白小飞','尸兄','小李飞刀','北京欢迎你','我的小尾巴','生死时速','终极一班','黄致列','见面吧就现在','遇见你之后','还珠格格','网红直播','儿童睡前故事','康熙来了','埃塞俄比亚','中埃','赖清德','柬埔寨','重案六组','男儿本色',
                             '千机变','马小龙','罗小贝','门第','疯狂熊孩子','急诊室故事','失恋33天','梨花泪','雾里看花','永不磨灭的番号','地狱公使','六龙飞天','思悼','格斗yulao少年','不名誉的一家','我们没有明天','不能说的夏天','我和僵尸有个约会','四大名捕','二胎奖','中国影史上的美人',
                             '翻越','高墙','式神','东京暗鸦','黑白森林','壮志凌云','吴倩莲','2day1夜','奇葩说第4季','九五至尊','封神榜','傅艺伟','妲己','旺达寻亲记','奇异博士2','Talk That Talk','氰化欢乐秀','哥布林','沙雕动画','生化危机','使徒行者','红警','红色警戒','疯狂的多元宇宙',
                             '囚禁','诺贝尔','牙医','放映厅','沈世','浙江卫视','李明','郑爽','活跳尸','段云','纵横四海','大富豪','太白金星','小鱼儿与花无缺','铁心兰','安石海','名侦探学院','社内相亲','安孝燮','女作家','骨瘦如柴','镜双城','宋冬野','极限挑战','赵氏孤儿','如懿传',
                             '黄飞鸿','痞子老师','民兵葛二蛋','萧峰','芈月传','苏州河','极限男团',' 桃色交易','乱世三义','唐子义','斗音','小燕子','吴亦凡','关于我和鬼','缠爱之根','陈羽凡','曹达华','使命召唤','无耻之徒','第七段','快讯','快报','时政','早知道','军事','楚乔终于',
                             '7纳米','搭载新型','两个怪异女孩','只要不进密逃','电锯惊魂','阴声','天津大爷','汉朝帝王图鉴','陈戌源','食人魔','下水道的美人鱼','禁忌之恋','夕阳天使','这就是街舞','职业球队','月里青山淡如画','以谁之名','绝路','慈禧','活着','古装男神','天赋都用来损人',
                             '杨钰莹','喀秋莎','王芳','乌鸦哥','海清','孝文','洛丽塔','七日杀','刘春洋','交响乐团','元首的愤怒','小s鉴茶','恐怖蜡像馆','祝卿好','袁冰妍','老九门','褚璇玑','杨铠豪','杨幂','琉璃','将夜','倾城亦清欢','dha','核桃油','少林五祖','赵丽颖与大佬谈笑风声',
                             '台湾史诗级电影，将婚姻不堪的一面','春夏','氨糖','与凤行','拥有公司最多的12位明星','港台十大爱国明星','明星偶像包袱碎一地','“普通发”行为大赏','事业爱情双丰收的黄晓明','共闯娱圈的兄弟姐妹','千万别和专业歌手同台飙歌','张玉安&文凯_护国狂魔','玉无心为救',
                             '同样是男星穿军装','陈思诚与新欢阮巨现身约会','无缝衔接合拍，就是那么的丝滑','冷血狂宴：银尘双重身份曝光','主办方有多尴尬','放弃中国籍却在中国捞金的明星','把嫌弃写脸上谁有陈坤硬核','被镜头捕捉的明星尬死瞬间','候场暴露异性缘','不红就被冷落','咖位低就该',
                             '暴露真假社交的候场','父亲纳妾后气的原配投河自尽','男子为离世女友查真相十年不婚','华语乐坛最大的败笔','2022年最新的史诗级空战片','月老','男星谦让起来有多可怕','果然是烂片出神曲','明星喜欢冷漠全写在脸上','世界上没有真正正确的地图','父母一时冲动丢下孩子',
                             '黄晓明不再沉默','镜头捕捉到的','国家队出手','女星同台互相有多瞧不上','内地和港台女星驻颜差距','如果影视中的改装枪械有段位','大佬女儿颜值对比','以凡人之躯与众神为敌','华灯初上','候场暴露真假社交','突发时刻','一部让女主迅速走红的国产电影',
                             '嫁给富豪后破产的女星','孟丽君','为抢镜明星能有多拼','明星假唱翻车现场','多尬死','资本态度成咖位','大力女子姜南顺','写脸上的明星','包装后','落花时节又逢君','才是王道','晚节不保老戏骨','13082353318','被嫌弃如何应对','韩国歌撞调','男星红毯','疯狂往事陈意涵',
                             '潘金莲','女娲传说之灵珠','疯批太师将她困在身边','明星医美过度有多尴尬','林志玲被太子辉','明星穿衣暴露爱国情怀','整顿流量鲜肉','曾轶可唱的最惨的一首歌','群嘲林志炫','四大天王背后的女人','嫁负心汉的女星今昔','明星偶像包袱碎一地','热线','微信','13881286073',
                             '三六九等','双缝干涉实验有多可怕','确定是配音不是原声','娱乐圈离谱的谣言','意外走光都是','台湾黑帮老大张安乐','表里不一','写脸上的男星','咖位决定明星的C位','芭莎内场','恒大','候场社交暴露明星真实关系','王一博到底做了什么','次次提名次次都陪跑','明星红毯突发尴尬',
                             '记录的社死瞬间','曾风光今落魄的港姐','繁华一梦终归去','这几位原唱太厉害','女星对男星态度','当白色死神遇到蓝色','古惑仔女演员','被镜头记录的明星社交','地球班往事','选秀界五大狠人','轮回的空椅子','刻进骨子里的','自信过头的满级人类','黄晓明对不同女星的差距',
                             '明星反应','危险罗曼史','明星脱口而出','地球诺贝尔奖','火到出圈的说唱歌曲',


                            ]


    // 创建悬浮窗口
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '50%';
    floatingWindow.style.left = '50%';
    floatingWindow.style.transform = 'translate(-50%, -50%)';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.border = '1px solid black';
    floatingWindow.style.zIndex = '9999';
    floatingWindow.style.cursor = 'move'; // 添加拖拽光标样式

    // 添加开始日期和时间输入框
    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'datetime-local';
    startTimeInput.id = 'start-time';
    startTimeInput.style.marginRight = '10px';
    floatingWindow.appendChild(startTimeInput);

    // 添加结束日期和时间输入框
    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'datetime-local';
    endTimeInput.id = 'end-time';
    endTimeInput.style.marginRight = '10px';
    floatingWindow.appendChild(endTimeInput);

     // 创建人员输入框
    const input = document.createElement('input');
    input.setAttribute('list', 'peopleNames');
    input.id = 'nameInput';
    input.placeholder = '输入或选择名字...';


    // 设置默认值
    // 这里我选择了列表中的第一个名字作为默认值
    input.value = 'zbs003yaomingwei';

    // 创建datalist
    const dataList = document.createElement('datalist');
    dataList.id = 'peopleNames';

    // 添加人名选项
    const peopleNames = ['zbs003yaomingwei','zbs003baiyuezhou','zbs003liuji','zbs003zhangsuya','zbs003guoshiyang','zbs003wangxiaotong','zbs003zhangwenbo','zbs003hewei','zbs003jinlong','zbs003wangli',
                      'zbs004liuyang','zbs003zhuhuayue','zbs003zhaohaibo','zbs001zhangyu','zbs003zhanxinxin','zbs003zangtianyu','zbs003xuxiaoying','zbs003xinjunda','zbs003cuishengnan','zbs003shice',
                       'zbs003dongyue','zbs003liyitong','zbs003shijian','zbs003zhangxiaochen','zbs003tianlixiang','zbs003liurongxian','zbs003wangyan','zbs003wangyunqi','zbs003yaoweibin','zbs003jiangnan',
                      'zbs003liping','zbs003dengyanhui','zbs003hongjiaxin','zbs003hanqitong','zbs003xiaochangsheng','zbs003jianglianghan','zbs002liyan','zbs003zhouxinyu','zbs003lvwentao'];

    for (const name of peopleNames) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;

        dataList.appendChild(option);
    }

      // 创建清除按钮
    const clearButton = document.createElement('span');
    clearButton.innerHTML = "&times;";
    clearButton.style.cursor = 'pointer';
    clearButton.style.position = 'absolute';
    clearButton.style.right = '30px'; // 调整此值以使其正确地对齐到输入框的右侧
    clearButton.style.top = '1px'; // 调整此值以使其垂直居中
    clearButton.onclick = function() {
        input.value = ''; // 清除输入框的值
    };

    // 将清除按钮添加到输入框的容器
    const inputWrapper = document.createElement('div');
    inputWrapper.style.position = 'relative'; // 使清除按钮相对于此容器定位
    inputWrapper.style.display = 'inline-block'; // 确保容器不占据额外的空间
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(clearButton);

    floatingWindow.appendChild(inputWrapper);
    floatingWindow.appendChild(dataList);

    // 添加“自动巡检”按钮
    const inspectButton = document.createElement('button');
    inspectButton.textContent = '自动巡检';
    floatingWindow.appendChild(inspectButton);

    // 创建一个状态变量，跟踪日志文本区域的状态
    let isLogVisible = true;

    // 创建一个控制日志显示/隐藏的按钮
    const toggleLogButton = document.createElement('button');
    toggleLogButton.textContent = '隐藏日志'; // 默认状态为显示日志，所以按钮显示“隐藏日志”
    toggleLogButton.onclick = function() {
        if (isLogVisible) {
            logArea.style.display = 'none'; // 隐藏日志文本区域
            toggleLogButton.textContent = '显示日志';
            isLogVisible = false;
        } else {
            logArea.style.display = 'block'; // 显示日志文本区域
            toggleLogButton.textContent = '隐藏日志';
            isLogVisible = true;
        }
    };
    floatingWindow.appendChild(toggleLogButton);

    // 添加悬浮窗口到页面
    document.body.appendChild(floatingWindow);

    let offsetX, offsetY; // 鼠标位置和悬浮窗口位置的差值

    // 鼠标按下时记录差值
    floatingWindow.addEventListener('mousedown', (event) => {
        offsetX = event.clientX - floatingWindow.offsetLeft;
        offsetY = event.clientY - floatingWindow.offsetTop;
    });

    // 鼠标移动时更新悬浮窗口位置
    document.addEventListener('mousemove', (event) => {
        if (offsetX !== undefined && offsetY !== undefined) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            floatingWindow.style.left = x + 'px';
            floatingWindow.style.top = y + 'px';
        }
    });

    // 鼠标释放时重置差值
    document.addEventListener('mouseup', () => {
        offsetX = undefined;
        offsetY = undefined;
    });

    // 创建一个用于显示日志的文本区域
    const logArea = document.createElement('pre');

    // 设置文本区域的最大高度为屏幕高度的50%
    const maxHeight = window.innerHeight * 0.5;
    logArea.style.maxHeight = `${maxHeight}px`;

    // 设置文本区域的最大宽度为屏幕宽度的50%
    const maxWidth = window.innerWidth * 0.5;
    logArea.style.maxWidth = `${maxWidth}px`;
    logArea.style.overflow = 'auto';
    logArea.style.borderTop = '1px solid black';
    logArea.style.marginTop = '10px';
    logArea.style.overflowY = 'auto';
    floatingWindow.appendChild(logArea);


    // 创建一个标志以确定是否捕获日志
    let shouldCaptureLogs = false;

      // 设置开始时间输入框默认值为当天
    const today = new Date();
    const startYear = today.getFullYear();
    const startMonth = String(today.getMonth() + 1).padStart(2, '0');
    const startDay = String(today.getDate()).padStart(2, '0');
    const defaultStartTime = `${startYear}-${startMonth}-${startDay} 00:00:00`;
    startTimeInput.value = defaultStartTime;

    // 设置结束时间输入框默认值为当天的23:59:59
    const defaultEndTime = `${startYear}-${startMonth}-${startDay} 23:59:59`;
    endTimeInput.value = defaultEndTime;

    // 点击“自动巡检”按钮的事件处理程序
    inspectButton.addEventListener('click',async () => {
        // 开始捕获日志
        shouldCaptureLogs = true;

        logArea.textContent = '正在巡检导出中......，请耐心等待!\n'; // 添加开始消息到文本区域

        // 获取选择的开始时间和结束时间
        startTime = formatDateTime(startTimeInput.value).replace('T', ' ');
        endTime = formatDateTime(endTimeInput.value).replace('T', ' ');
        // 获取选择的人名
        const selectedName = input.value;

        // 在这里执行查询操作，根据实际需求自行处理
        customLog('开始时间:'+ startTime);
        customLog('结束时间:'+ endTime);
        customLog('账号ID:'+ selectedName);

        // 在这里调用查询函数进行数据查询
       await performQuery(startTime, endTime,selectedName);
       
    });

    // 在这里定义查询函数
    async function performQuery(startTime, endTime,selectedName) {
        await searchAllData(startTime, endTime,selectedName);
        // 在这里执行查询操作，根据实际需求自行处理
        customLog('开始执行查询操作，开始时间:'+ startTime + ',结束时间:'+ endTime);
        // 在这里根据查询结果进行相应的处理
    }


    async function searchAllData(startTime, endTime,selectedName){
            //赋值当前数据
            auditor = selectedName;
            // 拼接JSON对象
            var jsonData = {
                "aiAuditStatus": "",
                "aisleEndTime": "",
                "aisleId": "",
                "aisleStartTime": "",
                "assetId": "",
                "auditor":auditor,
                "auditStatus": "",
                "auditType": "",
                "author": "",
                "collectEndTime": "",
                "collectStartTime": "",
                "costTime": "",
                "createTimeEndTime": "",
                "createTimeStartTime": "",
                "displayName": "",
                "endTime": endTime,
                "exclusiveKeyword": "",
                "keywords": "",
                "labelId": "",
                "location": "2",
                "MD5": "",
                "mediumStatus": "",
                "occurred": "",
                "otherKeyword": "",
                "pageNum": 1,
                "pageSize": 500,
                "riskList": [],
                "secondClassCode": "",
                "startTime": startTime,
                "thirdClassCode": "",
                "titleKeyword": "",
                "userId": "",
                "userRiskList": [],
                "videoType": ""
            };
            //查询一个人的查询数据
            await postData(jsonData);

    }


    // 提交数据
    async function postData(jsonData) {

            // 将 JSON 数据转换为字符串
            var jsonString = JSON.stringify(jsonData);
            // 创建 XMLHttpRequest 对象
            var xhr = new XMLHttpRequest();
            // 设置请求信息
            // 替换为目标服务器的URL
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            // 设置回调函数
            xhr.onreadystatechange =async function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);

                    await checkData(response);

                } else {
                  //alert('提交失败，请手动提交！');

                }
            };

            // 发送请求
            xhr.send(jsonString);
    }

    //查询解析数据
   async function checkData(response){
        var searchResultData = response.data;
        var pageSize = searchResultData.pageSize;
        var pages = searchResultData.pages;


       customLog('本次自动巡检共导出：'+searchResultData.total + '条数据，共分'+ pages + '页导出，每页'+pageSize+'条数据。');

        //页循环
        for(var i = 1; i < pages + 1; i++){
            //存放违禁词
            var prohibitedWord = '';
            //判断视频内容是否违规
            var result = '';

            if(i === 1){
                //每一页数据循环查询
                for(var j = 0; j < searchResultData.dataList.length; j++){
                    var data = searchResultData.dataList[j];
                    //媒资ID
                    var assetId = data.assetId;
                    //标题
                    var assetName = data.assetName;
                    //审核结果
                    var auditStatusStr = data.auditStatusStr;
                    //违规处置标签
                    var labelName = data.labelName;
                    //备注
                    var auditRemark = data.auditRemark;
                    //进入通道时间
                    var aisleTime = data.aisleTime;
                    //AI审核通过结果
                    var aiAuditStatus = data.aiAuditStatus;
                    //上传用户ID
                    var author = data.author;


                    //标题敏感词审核
                    //判断标题和简介是否有违禁词
                    //存放违禁词
                    prohibitedWord = await titleContainsChineseWord(assetName);

                    if(aiAuditStatus !== '1' || aiAuditStatus !== 1){
                        //判断视频内容是否违规
                        result = await searchInferiorArtistOrProhibitedWord(assetId);
                        customLog(assetId + '，AI提示视频内容文字部分存在违禁词:'+prohibitedWord + result);
                    }
                    

                    //写入csv
                    const auditor1 = auditor;
                    const assetId1 = assetId;
                    const assetName1 = assetName.replace(/,/g, '，');
                    const auditStatusStr1 = auditStatusStr;
                    const labelName1= labelName;
                    const auditRemark1 = auditRemark.replace(/,/g, '，');
                    const aisleTime1 = aisleTime;
                    const violationDescription1 = prohibitedWord + result;
                    await queryData.push([auditor1, assetId1, author,assetName1,auditStatusStr1,labelName1,auditRemark1,aisleTime1,violationDescription1]);
                    customLog('成功写入第'+i+'页，第' + j + '条数据');
                }
            }else{
                //从第二页起需要重新请求数据
                // 拼接JSON对象
                var jsonData1 = {
                    "aiAuditStatus": "",
                    "aisleEndTime": "",
                    "aisleId": "",
                    "aisleStartTime": "",
                    "assetId": "",
                    "auditor":auditor,
                    "auditStatus": "",
                    "auditType": "",
                    "author": "",
                    "collectEndTime": "",
                    "collectStartTime": "",
                    "costTime": "",
                    "createTimeEndTime": "",
                    "createTimeStartTime": "",
                    "displayName": "",
                    "endTime": endTime,
                    "exclusiveKeyword": "",
                    "keywords": "",
                    "labelId": "",
                    "location": "2",
                    "MD5": "",
                    "mediumStatus": "",
                    "occurred": "",
                    "otherKeyword": "",
                    "pageNum": i,
                    "pageSize": 500,
                    "riskList": [],
                    "secondClassCode": "",
                    "startTime": startTime,
                    "thirdClassCode": "",
                    "titleKeyword": "",
                    "userId": "",
                    "userRiskList": [],
                    "videoType": ""
                };



                  // 调用发送POST请求的函数，并使用then()处理结果
                await sendPostRequest(jsonData1).then(async (response) => {
                    // 在这里执行后续代码
                    var responseData = response.data;
                    customLog('POST请求成功:'+ responseData);
                    //处理每页数据
                    await makeData(responseData,i);

                }).catch((error) => {
                    // 在这里处理请求失败或错误
                    customLog.error('处理请求失败或错误:'+ error);
                    // 在这里执行后续代码
                });
            }
        }
       //写入csv中
       await saveDataAsCSV(queryData);
       //查询结果记录在csv中的表头,violationDescription(违规说明)
       // 清空 queryData 数组，只保留表头行
       queryData.length = 1; // 或 queryData.splice(1);

        // 添加完成消息到文本区域
       customLog('自动巡检导出已完成！\n');
        // 结束捕获日志
       shouldCaptureLogs = false;
    }

    //处理第二页后的每页数据
   async function makeData(responseData,i){
        //存放违禁词
        var prohibitedWord = '';
        //判断视频内容是否违规
        var result = '';
        // 在这里处理返回的数据
        //每一页数据循环查询
        for(let j = 0; j < responseData.dataList.length; j++){

            var data = responseData.dataList[j];
            //AI审核通过结果
            var aiAuditStatus = data.aiAuditStatus;

            //标题敏感词审核
            //判断标题和简介是否有违禁词
            //存放违禁词
            prohibitedWord = await titleContainsChineseWord(data.assetName);
            //通过AI返回判断是否需要查询
            if(aiAuditStatus !== '1' || aiAuditStatus !== 1){
                //判断视频内容是否违规
                result = await searchInferiorArtistOrProhibitedWord(data.assetId);
                customLog(data.assetId + '，AI提示视频内容文字部分存在违禁词:'+prohibitedWord + result);
            }
            //写入csv
            const auditor1 = auditor;
            //媒资ID
            const assetId1 = data.assetId;
            //上传用户ID
            var author = data.author;
            //标题
            const assetName1 = data.assetName.replace(/,/g, '，');
            //审核结果
            const auditStatusStr1 = data.auditStatusStr;
            //违规处置标签
            const labelName1= data.labelName;
            //备注
            const auditRemark1 = data.auditRemark.replace(/,/g, '，');
            //进入通道时间
            const aisleTime1 = data.aisleTime;
            const violationDescription1 = prohibitedWord + result;
            queryData.push([auditor1, assetId1,author, assetName1,auditStatusStr1,labelName1,auditRemark1,aisleTime1,violationDescription1]);

            customLog('成功写入第'+i+'页，' + j + '条数据!');
        }


    }

    // 发送POST请求，并返回一个Promise对象
    function sendPostRequest(jsonData1) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(jsonData1),
                onload: function(response) {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        customLog('POST请求成功:'+responseData);
                        resolve(responseData); // 请求成功，将返回的数据传递给resolve
                    } else {
                        customLog.error('POST请求失败:'+ response.status + response.statusText);
                        reject(new Error('POST请求失败')); // 请求失败，传递错误对象给reject
                    }
                },
                onerror: function(error) {
                    customLog.error('发生错误:'+ error);
                    reject(error); // 请求发生错误，传递错误对象给reject
                }
            });
        });
    }
     //判断标题和介绍中是否存在违纪词语
    function titleContainsChineseWord(mySentence){
        var searchReturnWord = '';
        for (var i = 0; i < searchWordLibrary.length; i++) {
            var searchWord = searchWordLibrary[i];
            if(containsChineseWord(mySentence, searchWord)){
                searchReturnWord += searchWord;
            }
            //console.log(searchWord + ": " + containsChineseWord(mySentence, searchWord)+'-'+titleContainsChineseWordResult);
        }
        customLog(searchReturnWord);
        return searchReturnWord;
    }

    //查询劣迹艺人或许内容有违禁词
   async function searchInferiorArtistOrProhibitedWord(assetId){
        //存放返回结果
        var result = '';
         //存放链接
        var aiUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/aia-record/video/result?assetId='+assetId;
        var aiResult = await getContent2(aiUrl);

       //等待0.5秒继续执行
       await wait(500);
        // 人脸名称
        //console.log(aiResult);
        //AI质检结果及文本结果
       // 访问其中的属性
       if(aiResult.data !== null){
           var dataAI = JSON.parse(aiResult.data);
           if(dataAI.hasOwnProperty("auditReason")){
               var auditReason = dataAI.auditReason;
               var dataList = dataAI.dataList;
               var faceNameSet = 'faceNameSet';
               var textSet = 'textSet';
               //使用前清空set
               localStorage.removeItem(faceNameSet);
               localStorage.removeItem(textSet);

               if(auditReason !== '通过'){
                   for(var i = 0; i < dataList.length; i++){
                       var dataListValue = dataList[i];

                       addToSet(dataListValue.text,textSet);
                       if('faces' in dataListValue ){
                           for(var j = 0; j < dataListValue.faces.length; j++){
                               var name = dataListValue.faces[j].name;
                               if (name === null || name === undefined || name === '') {
                                   continue; // 不允许存储空值
                               }else{
                                   addToSet(dataListValue.faces[j].name,faceNameSet);
                               }
                           }
                       }
                   }
                   //判断视频内文字是否存在违禁词
                   var prohibitedWord = await titleContainsChineseWord(getSet(textSet));

                   //存放违禁词
                   if(prohibitedWord !== ''){
                       result = '，AI提示视频字幕存在违禁词:'+prohibitedWord;
                       customLog('，AI提示视频内容文字部分存在违禁词:'+prohibitedWord);
                   }

                   //判断人名是否是劣迹艺人https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=程峰&formerName=&country=&genre=&badProblem=&bak1=&bak2
                   var searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                   //违禁艺人名称
                   var searchInferiorArtistName;
                   var faceSet = getSet(faceNameSet);
                   if(faceSet.length !== 0){
                       for(var item of faceSet){
                           searchInferiorArtistUrl = searchInferiorArtistUrl + item + '&formerName=&country=&genre=&badProblem=&bak1=&bak2=';
                           var searchInferiorArtisResult = await getContent(searchInferiorArtistUrl);
                           //等待0.5秒继续执行
                           await wait(500);
                           var total = searchInferiorArtisResult.data.total;
                           if(total !== 0){
                               searchInferiorArtistName = item;
                               var records = searchInferiorArtisResult.data.records;
                               var searchResult = '';
                               for(var g = 0; g < records.length; g++){
                                   var artistName = records[g].name;
                                   var artistGenre = records[g].genre;
                                   var artistControlDescription = records[g].controlDescription;
                                   searchResult = searchResult + '，人物库查询结果:劣迹艺人名称：'+ artistName +'，劣迹类型：' + artistGenre + '，管控描述：'+ artistControlDescription;
                               }
                               result += '，AI提示视频内容出现违禁艺人:'+searchInferiorArtistName + searchResult;
                               customLog('AI提示视频内容出现违禁艺人:'+searchInferiorArtistName + searchResult);
                           }
                           searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                       }
                   }
               }
           }else{
               //老版本的AI结果查询
               var results = dataAI.results;
               var resultWord = '';
               for(var h = 0; h < results.length; h ++){

                  resultWord = resultWord + '违禁内容提示：' + results[h].label + ',' + results[h].scene;
               }
               //场景结果存储
               result = resultWord;

           }
       }
           

        return result;

    }

        // 判断中文语句中是否包含特定中文词语
    function containsChineseWord(sentence, word) {
        // 使用 "u" 标志启用 Unicode 正则匹配
        var regex = new RegExp(word, 'u');
        return regex.test(sentence);
    }

    // 发起 GET 请求获取通用方法
    async function getContent(url) {
        return new Promise(await function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                resolve(data);
            })
                .catch(function(error) {
                reject(error);
            });
        });
    }
    // 发起 GET 请求获取腾讯文档内容
    async function getContent2(url) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        //customLog.log('GET请求成功:', responseData);
                        resolve(responseData); // 请求成功，将返回的数据传递给resolve
                    } else {
                        console.error('GET请求失败:', response.status, response.statusText);
                        reject(new Error('GET请求失败')); // 请求失败，传递错误对象给reject
                    }
                },
                onerror: function(error) {
                    console.error('发生错误:', error);
                    reject(error); // 请求发生错误，传递错误对象给reject
                }
            });
        });
    }

     // 函数：添加元素到Set
    function addToSet(value,setName) {
         if (value === null || value === undefined || value === '') {
            return; // 不允许存储空值
        }
        var set = getSet(setName);
        if (!set.includes(value)) {
            set.push(value);
            saveSet(set,setName);
        }
    }

        // 函数：从Set中移除元素
    function removeFromSet(value,setName) {
        var set = getSet(setName);
        var index = set.indexOf(value);
        if (index !== -1) {
            set.splice(index, 1);
            saveSet(set,setName);
        }
    }

    // 函数：获取Set
    function getSet(setName) {
        var setString = localStorage.getItem(setName);
        if (setString) {
            return JSON.parse(setString);
        } else {
            return [];
        }
    }

    // 函数：保存Set
    function saveSet(set,setName) {
        localStorage.setItem(setName, JSON.stringify(set));
    }


    // 示例数据
    //const dynamicData = [
    //    ['Name', 'Age', 'Email'], // 表头行
    //    ['John', 30, 'john@example.com'],
    //    ['Jane', 25, 'jane@example.com']
    //];

    // 生成CSV格式数据
    function convertToCSV(data) {
        const csv = data.map(row => row.join(',')).join('\n');
        return csv;
    }

    // 创建并下载CSV文件
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 保存数据为CSV文件
    function saveDataAsCSV(data) {
        const csvContent = convertToCSV(data);
        const filename = 'data.csv';
        downloadCSV(csvContent, filename);
    }

    // 在需要的时候调用 saveDataAsCSV 函数来保存数据为CSV文件
    // 替换为实际的动态数据
    //saveDataAsCSV(dynamicData);


    // 格式化时间函数
    function formatDateTime(dateTimeStr) {
        const dateTime = new Date(dateTimeStr);
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    //等待方法
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

        // 无法重写log方法，就重新构建一个方法
    function customLog(message) {
        // 将消息发送到原始的console.log
        console.log(message);

        // 检查是否需要捕获日志，并在需要时将其添加到文本区域
        if (shouldCaptureLogs) {
            logArea.textContent += message + '\n';
            // 自动滚动到底部
            logArea.scrollTop = logArea.scrollHeight;
        }
    }


})();