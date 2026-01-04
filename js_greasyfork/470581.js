// ==UserScript==
// @name         咪咕视频快速作业脚本
// @namespace    http://your-namespace.com
// @version      4.9.5
// @description  包含快速提交及通过判断标题和简介是否包含违禁词
// @author       AI数据标注猿
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470581/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/470581/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


var floatingDiv = document.createElement('div');
floatingDiv.setAttribute('id', 'floatingDiv');
floatingDiv.style.position = 'fixed';
floatingDiv.style.top = '50%';
floatingDiv.style.left = '50%';
floatingDiv.style.transform = 'translate(-50%, -50%)';
floatingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
floatingDiv.style.color = '#fff';
floatingDiv.style.padding = '10px';
floatingDiv.style.borderRadius = '5px';
floatingDiv.style.zIndex = '9999';
floatingDiv.style.fontFamily = 'Arial, sans-serif';
floatingDiv.style.fontSize = '14px';
floatingDiv.style.textAlign = 'center';
// 初始状态隐藏
floatingDiv.style.visibility = 'hidden';
// 是否正在拖拽
var isDragging = false;
// 拖拽开始时的鼠标相对于悬浮窗的水平偏移量
var startOffsetX = 0;
// 拖拽开始时的鼠标相对于悬浮窗的垂直偏移量
var startOffsetY = 0;
floatingDiv.textContent = '快捷操作提示：`：通过。h：巡查。';

document.body.appendChild(floatingDiv);


function showFloatingDiv() {
    floatingDiv.style.visibility = 'visible';
}

function hideFloatingDiv() {
    floatingDiv.style.visibility = 'hidden';
}

function showFloatingDivAtPosition(x, y) {
    floatingDiv.style.left = x + '%';
    floatingDiv.style.top = y + '%';
    showFloatingDiv();
}

function startDragging(event) {
    isDragging = true;
    startOffsetX = event.clientX - floatingDiv.offsetLeft;
    startOffsetY = event.clientY - floatingDiv.offsetTop;
}

function stopDragging() {
    isDragging = false;
}

function moveFloatingDiv(event) {
    if (isDragging) {
        var x = ((event.clientX - startOffsetX) / window.innerWidth) * 100;
        var y = ((event.clientY - startOffsetY) / window.innerHeight) * 100;
        floatingDiv.style.left = x + '%';
        floatingDiv.style.top = y + '%';
    }
}

floatingDiv.addEventListener('mousedown', startDragging);
floatingDiv.addEventListener('mouseup', stopDragging);
floatingDiv.addEventListener('mousemove', moveFloatingDiv);
// 在屏幕中心显示悬浮窗
showFloatingDivAtPosition(65, 10);

(function() {
    'use strict';

    //获取用户名称的地址
    var userInfoUrl = 'https://oes-coss.miguvideo.com:1443/user/authentication';
    //存放当前用户名称
    var userName1 ;

    //媒资ID
    var assetId;
    //账号ID
    var author;
    //通道地址
    var aisleId;
    //存放通道连接地址
    var authenticationAisleList = [];
    //存放维护的违禁词
    var tencentDocUrl = ' https://docs.qq.com/document/DZWhaTlBYRklpRUFD';

     //存放违禁词
    var searchWordLibrary = ['随刻','腾讯视频','好看视频','优酷','土豆','搜狐','乐视','西瓜视频','秒拍','抖音','快手','火山','最右','微博视频号','梨视频','皮这一下','皮皮虾','爱奇艺','小红书','直播吧','今日头条','百度视频','网易视频','哔哩哔哩','bilibili','西瓜体育','头条体育','爱奇艺体育','火山官方','火山美食','搜狐体育','头条',
                             '我的英雄学院','逃学威龙','头文字','大时代','地球停转之日','罪恶之城','巫师3','隐入尘烟','死亡笔记','暗杀教室','恶搞之家','辛普森一家','瑞奇和莫迪','一九四二','猫汤','我推的孩子','伊拉克恶狼谷','娜珍之交','禁忌女孩','有多卑微',
                             '黑白校园','疾速追杀','天龙八部','宁安如梦','人体蜈蚣','进击巨人','刃艾伦','阿尔敏','少林足球','奇幻潮','终极一班','全民目击','山河令','叶问大战约翰威克','澳门风云','相爱十年','剑雨','风云','隐如尘烟','情深深雨蒙蒙','康斯坦丁','大盗','黑客帝国','小时代','上海滩','欢乐今宵',
                             '徐濠萦','王全安','谭小环','罗志祥','翟天临','吴启明','林建明','叶德娴','李易峰','毛宁','张默','林夕','胡瓜','陈冠希','黄秋生','赵薇','张耀扬','薇娅','李云迪','李铁','范冰冰','炎亚纶','赵立新','孙兴','柯震东','张元','高虎','邓伦','唐诗咏','张哲瀚','黄海波','高晓松','周峻纬','朴明秀',
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
                             '父亲纳妾后气的原配投河自尽','男子为离世女友查真相十年不婚','华语乐坛最大的败笔','2022年最新的史诗级空战片','月老','男星谦让起来有多可怕','果然是烂片出神曲','明星喜欢冷漠全写在脸上','世界上没有真正正确的地图','父母一时冲动丢下孩子','霍尊','人走茶凉',
                             '黄晓明不再沉默','镜头捕捉到的','国家队出手','女星同台互相有多瞧不上','内地和港台女星驻颜差距','如果影视中的改装枪械有段位','大佬女儿颜值对比','以凡人之躯与众神为敌','华灯初上','真假社交','突发时刻','一部让女主迅速走红的国产电影',
                             '嫁给富豪后破产的女星','孟丽君','为抢镜明星能有多拼','明星假唱翻车现场','多尬死','资本态度成咖位','大力女子姜南顺','写脸上','包装后','落花时节又逢君','才是王道','晚节不保老戏骨','13082353318','被嫌弃如何应对','韩国歌撞调','男星红毯','疯狂往事陈意涵',
                             '潘金莲','女娲传说之灵珠','疯批太师将她困在身边','明星医美过度有多尴尬','林志玲被太子辉','明星穿衣暴露爱国情怀','整顿流量鲜肉','曾轶可唱的最惨的一首歌','群嘲林志炫','四大天王背后的女人','嫁负心汉的女星今昔','明星偶像包袱碎一地','热线','微信','13881286073',
                             '三六九等','双缝干涉实验有多可怕','确定是配音不是原声','娱乐圈离谱的谣言','意外走光都是','台湾黑帮老大张安乐','表里不一','写脸上的男星','咖位决定明星的C位','芭莎内场','恒大','候场社交暴露明星真实关系','王一博到底做了什么','次次提名次次都陪跑','明星红毯突发尴尬',
                             '记录的社死瞬间','曾风光今落魄的港姐','繁华一梦终归去','这几位原唱太厉害','女星对男星态度','当白色死神遇到蓝色','古惑仔女演员','被镜头记录的明星社交','地球班往事','选秀界五大狠人','轮回的空椅子','刻进骨子里的','自信过头的满级人类','黄晓明对不同女星的差距',
                             '明星反应','危险罗曼史','明星脱口而出','地球诺贝尔奖','火到出圈的说唱歌曲','明星被排挤有多尴尬','就该被冷落','资本弃子','WJSN','金晶恩','女星同框抢镜小心机','谭小环','两个妃子争夺皇后','女星对男星态度看细节','张凌赫白鹿超甜互动','离婚仅仅8年','足协彻底',
                             '北京奥运会开幕式','模范出租车','王后伞下','13166376525','东北话搞笑配音','当霸道总裁遇上女流氓','颜丹晨跨界当主持','女人必看的爱情电影之一','鬼眼刑警','终于知道上帝','白鹿合作的男演员','伤害不大却侮辱性极强','高天鹤','叶蕴仪','确定是来颁奖不是说相声',
                             '他们要不换个星球生活吧','看明星红不红','灭门惨案','快来看大师如何押韵的','粉丝视角暴露明星真假',


                            ];


    // 获取违禁词的描述
    function getDescriptionForWord(word) {
        // 存放违禁词描述
        var descriptions = {
            '随刻': '竞品','腾讯视频': '竞品','好看视频': '竞品','优酷': '竞品','土豆': '竞品', '搜狐': '竞品','乐视': '竞品','西瓜视频': '竞品','秒拍': '竞品','抖音': '竞品','快手': '竞品','火山': '竞品','最右': '竞品','微博': '可能存在微博视频号','梨视频': '竞品','皮这一下': '可能存在竞品皮皮虾','皮皮虾': '竞品','爱奇艺': '竞品',
            '小红书': '竞品','直播吧': '竞品','今日头条': '竞品','百度视频': '竞品','网易视频': '竞品','哔哩哔哩': '竞品','西瓜体育': '竞品','头条体育': '竞品','爱奇艺体育': '竞品','火山官方': '竞品','火山美食': '竞品','搜狐体育': '竞品','头条': '竞品', '生化危机': '违禁游戏', '使徒行者': '可能存在黄翠如',
            '红警': '封禁游戏红色警戒的简称','红色警戒': '封禁游戏','我的小尾巴': '可能存在周俊伟','沙雕动画': '可能存在涉黄涉暴','哥布林': '该动漫存在大量黄色画面','氰化欢乐秀': '大量低俗内容','Talk That Talk': '可能存在周子瑜','奇异博士2': '封禁电影', '疯狂的多元宇宙': '封禁电影','旺达寻亲记': '封禁影片奇异博士2的简称',
            '妲己': '影片封神榜苏妲己饰演者傅艺伟','傅艺伟': '劣迹艺人','封神榜': '可能存在苏妲己傅艺伟','九五至尊': '可能存在角色岑尹天娜饰演者谭小环与角色高劲饰演者郑敬基','奇葩说第4季': '可能存在劣迹艺人卡姆','2day1夜': '第一季的一二期存在房祖名','吴倩莲': '可能关联到劣迹黄秋生与劣迹张耀扬','壮志凌云': '可能联系到封禁影片壮志凌云2',
            '黑白森林': '高危影片易出现黄秋生、杜汶泽','东京暗鸦': '封禁动漫','式神': '封禁动漫东京暗鸦中的角色','四大名捕': '可能存在劣迹黄秋生','我和僵尸有个约会': '可能存在劣迹杜汶泽','不能说的夏天': '可能存在劣迹徐若瑄与劣迹戴立忍','我们没有明天': '可能存在劣迹刘亚仁','思悼': '可能存在劣迹刘亚仁',
            '六龙飞天': '可能存在刘亚仁','地狱公使': '可能存在教主刘亚仁','永不磨灭的番号': '可能存在黄海波','雾里看花': '可能存在劣迹毛宁','失恋33天': '可能存在劣迹陈羽凡与劣迹张默','门第': '影片可能存在劣迹张博','罗小贝': '高危影片重案六组角色张博','马小龙': '高危影片重案六组联系到劣迹张博','重案六组': '易出现劣迹张博',
            '千机变': '可能存在劣迹黄秋生，陈冠希','囚禁': '大量血腥画面驳回处理','诺贝尔': '可能存在展示个人信息','牙医': '可能存在展示个人信息','无间道': '可能存在劣迹黄秋生','真相': '港剧真相可能存在李绮雯','放映厅': '存在竞品抖音','沈世': '关联到沈世豪劣迹艺人孙兴','美俄': '可能关联到俄乌战争',
            '浙江卫视': '涉“李玟生前控诉中国好声音”相关审核规则，关联攻击、抵制浙江卫视泛化炒作及行煽类的内容均驳回。如：蓝台杀人台、杀人蓝台、蓝台杀人、浙江杀人台等。','足球': '可能关联到敏感人物李铁','世界杯': '无问题可上，重保项目','一口气看完': '该用户可能上传的视频存在大量违禁内容',
            '洪水': '注意涉小清河断桥现场冲击性视频相关画面以及河北地区领导发言相关内容','大碗宽面': '劣迹艺人吴亦凡演唱歌曲','青簪行': '劣迹艺人吴亦凡主演的电视剧可能联系到邓伦','爵迹': '该剧存在劣迹艺人范冰冰与吴亦凡','我叫白小飞': '其中第一季中的第1-3集、21集含有血腥暴力、恐怖猎奇等违规内容','尸兄': '违禁动漫我叫白小飞剧中角色名称',
            '小李飞刀': '劣迹艺人范冰冰参演的电视剧','北京欢迎你': '群星演唱的歌曲，注意劣迹艺人陈羽凡','我的小尾巴': '劣迹艺人周俊伟参演的综艺','生死时速': '注意基努·里维斯','终极一班': '该片为违禁影片也可能存在劣迹艺人炎亚纶','黄致列': '劣迹艺人黄致列','见面吧就现在': '劣迹艺人周俊伟参演的综艺','遇见你之后': '劣迹艺人周俊伟参演的综艺',
            '还珠格格': '该片存在劣迹艺人范冰冰与赵薇','网红直播': '违禁影片禁忌女孩的简称','儿童睡前故事': '可能存在竞品或者其他违规点','康熙来了': '20040517期涉六四高危内容。20080618期你不相信的艺能界宅女，视频内容有明显的传播藏独旗帜的内容。','真相': '韩剧真相存在劣迹艺人李绮雯','赖清德': '可能涉及新闻一般为无资质',
            '柬埔寨': '一般会关联到缅甸负面', '缅北': '一般会关联到缅北负面','男儿本色': '劣迹艺人房祖名参演的影视','中国有嘻哈': '可能存在王昊或吴亦凡', '吕不韦': '吕不韦传奇存在劣迹艺人高虎', '嬴异人': '吕不韦传奇里劣迹艺人高虎的角色名', '中国最后一个太监': '劣迹艺人莫少聪主演的影视', 'twice': '韩国女团TWICE可能存在劣迹艺人周子瑜',
            '天盛长歌': '容易出现劣迹艺人赵立新', '兄妹恋': '一般会关联到劣迹艺人周峻纬或者不正常恋爱观', '雪花神剑': '剧中存在劣迹艺人袁文杰', '聂小凤': '可能联系到雪花神剑中劣迹艺人袁文杰', '中国新说唱': '注意画面劣迹艺人吴亦凡或竞品', '同性': '注意出现不正常的恋爱观', '双男': '注意出现不正常的恋爱观', '练成了': '此类节目可能存在大量低俗内容',
            '森美': '劣迹艺人森美', '新知创作人': '此类节目可能存在大量低俗内容', '破坏之王': '注意剧中出现旭日旗', '刘丞以': '劣迹艺人刘丞以', '思悼': '影片可能出现劣迹艺人刘亚仁', '刘亚仁': '劣迹艺人刘亚仁','我赌5包辣条': '此类节目可能存在大量违规点','徐濠萦': '劣迹艺人徐濠萦','王全安': '劣迹艺人王安全',
            '谭小环': '劣迹艺人谭小环','罗志祥': '劣迹艺人罗志祥','翟天临': '劣迹艺人翟天临','吴启明': '劣迹艺人吴启明','林建明': '劣迹艺人林建明','叶德娴': '劣迹艺人叶德娴','李易峰': '劣迹艺人李易峰','毛宁': '劣迹艺人毛宁','张默': '劣迹艺人张默','林夕': '劣迹艺人林夕','胡瓜': '劣迹艺人胡瓜','陈冠希': '劣迹艺人陈冠希','黄秋生': '劣迹艺人黄秋生',
            '赵薇': '劣迹艺人赵薇','张耀扬': '劣迹艺人张耀扬','薇娅': '劣迹艺人薇娅','李云迪': '劣迹艺人李云迪','李铁': '敏感人物李铁','范冰冰': '劣迹艺人范冰冰','炎亚纶': '劣迹艺人炎亚纶','赵立新': '劣迹艺人赵立新','孙兴': '劣迹艺人孙兴','李易峰': '劣迹艺人李易峰','柯震东': '劣迹艺人柯震东','张元': '劣迹艺人张元','高虎': '劣迹艺人高虎','邓伦': '劣迹艺人邓伦',
            '唐诗咏': '劣迹艺人唐诗咏','张哲瀚': '劣迹艺人张哲瀚','黄海波': '劣迹艺人黄海波','高晓松': '劣迹艺人高晓松','周峻纬': '劣迹艺人周俊伟','朴明秀': '劣迹艺朴明秀','我的英雄学院': '违禁动漫', '逃学威龙': '可能存在劣迹艺人叶德娴','头文字': '可能出现未定性艺人陈冠希','大时代': '劣迹艺人吴启明', '地球停转之日': '劣迹艺人基努·里维斯', '罪恶之城': '正片及含违规点内容不通过',
            '巫师3': '除血腥暴力、低俗色情场景及其它审核违规点的可正常通过', '隐入尘烟': '违规影片','死亡笔记': '违禁动漫，正片及含违规点片段删除', '暗杀教室': '日本动漫内容保持删除，真人作品可以通过','恶搞之家': '第一季第一集影射64相关涉政有害内容驳回，其中未成年形象持枪、爆粗口内容驳回','辛普森一家': '涉及敏感政治话题，包含但不限于坦克人、藏独、辱华等内容，及未成年形象持枪、爆粗口等违规内容保持删除',
            '瑞奇和莫迪': '未成年持枪暴力血腥画面删除','一九四二': '存在劣迹艺人张默','猫汤': '出现全部驳回','我推的孩子': '出现全部驳回', '伊拉克恶狼谷': '出现全部驳回','娜珍之交': '出现全部驳回','禁忌女孩': '出现全部驳回','李明': '网红李明自称其缅甸遇险花30万自救相关内容，审核不通过。','徐若瑄': '劣迹艺人徐若瑄','达叔': '注意关联到劣迹艺人叶德娴',
            '娱乐圈': '可能存在劣迹艺人的情况','电锯人': '日本动漫《电锯人》，其中较多血暴场面，注意有违规点的保持删除','博彩': '注意关联到违禁品赌博博彩','丁蟹': '大时代的主要人物注意劣迹艺人吴启明','以爱为名': '注意劣迹艺人吴启明','爱神': '违禁动漫爱神巧克力，多处情节存在过度娱乐、过度宣扬校园爱情、性暗示及露骨行为等低俗违规内容','我唾弃你的坟墓': '封禁影片该片存在大量血腥暴力、淫秽色情内容。',
            '进击的巨人': '违禁动漫动画其', '战地': '其中战地3、战地4为文化部封杀违法游戏', '郑爽': '劣迹艺人郑爽', '活跳尸': '违禁影片出现全部驳回', '段云': '违禁影片我叫刘金凤中的角色名称段云嶂', '纵横四海': '可能出现劣迹艺人叶德娴','大富豪': '关联到影片纵横四海中可能出现劣迹艺人叶德娴','民国': '涉及建国后中华民国等字样驳回处理','鬼灭之刃': '该动漫可能存在大量血腥恐怖画面',
            '佩洛西': '美国前国务卿，推特存在声援六四的行文。审核标准：该人物关联六四的内容保持删除，其余内容正常审核。','活着': '张艺谋导演的影视作品，相关内容全部驳回','太白金星': '春光灿烂猪八戒中角色名易出现劣迹艺人孙兴','小鱼儿与花无缺': '注意劣迹艺人范冰冰','铁心兰': '小鱼儿与花无缺影视中范冰冰饰演者','安石海': '涉朝鲜安石海涂受灾金正恩视察中批评内阁处置不力、尸位素餐，将此次受灾定义为人灾相关内容审核不通过',
            '人面鱼': '注意劣迹艺人徐若瑄','名侦探学院': '劣迹艺人周俊伟参演的综艺','红色按钮': '此类视频含有西瓜视频搜索框，需下线','社内相亲': '违禁影片，出现全部驳回','安孝燮': '违禁影片社内相亲角色名，出现全部驳回','女作家': '可能涉及违禁影片我唾弃你的坟墓','骨瘦如柴': '劣迹艺人基努里维斯参演的影片','镜双城': '劣迹艺人李易峰主演的影片','宋冬野': '劣迹艺人宋冬野','极限挑战': '可能涉及罗志祥与邓伦',
            '赵氏孤儿': '可能涉及劣迹艺人范冰冰','黄飞鸿': '可能涉及劣迹艺人莫少聪','痞子老师': '违禁影片出现全部驳回','民兵葛二蛋': '可能涉及劣迹艺人高虎','萧峰': '可能涉及劣迹艺人高虎','芈月传': '可能涉及劣迹艺人赵立新','如懿传': '可能涉及劣迹艺人赵立新','苏州河': '涉及劣迹艺人贾宏声','贾宏声': '劣迹艺人贾宏声','山河令': '劣迹艺人邓伦参演的影视','极限男团': '劣迹艺人邓伦参演的综艺',' 桃色交易': '违禁影片出现全部驳回',
            '乱世三义': '劣迹艺人黄海波主演的影片','唐子义': '可能涉及劣迹艺人黄海波','斗音': '竞品抖音的别称','小燕子': '劣迹艺人赵薇的角色名', '吴亦凡': '劣迹艺人吴亦凡','乐火团队': '涉及赌博等违规内容',


        };
        return descriptions[word] || "暂无描述"; // 如果找不到描述，则返回空字符串
    }

    // 创建一个集合来存放高危账号的 ID,'哥布林'
    var highRiskAccounts = ["961209152","1075995195","1609200398","183677998","1599801105","1607917886","1606919819","903952714","1599834789","1234519225","672155831","1569044386","1601292640","1574516673"];

    //var searchWordLibrary = getTencentDocContent(tencentDocUrl);
    var mySentence;
    //存储判断是否有违规词
    var titleContainsChineseWordResult = false;
    //记录每日完成总量
    var todayTotal;
    //记录每小时完成总量
    var hoursTotal;
    //记录月
    var hoursl;
    // 拼接成当天的时间字符串
    var currentTime;
    //获取月初
    var currentTime1
    //获取月末
    var currentTime2
    //当小时的字符串
    var currentHoursTime = 0;
    //存储查询数据量的连接'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=zbs003baiyuezhou&startTime=2023-07-09 00:00:00&endTime=2023-07-09 23:59:59&current=1&size=10
    //var auditStatisticsUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=';

    //获取用户信息
    async function getUserInfo(){
        try {
            // 等待获取数据
            var data = await getContent(userInfoUrl);
            // 在控制台输出获取到的数据
            console.log(data);
            var userInfo = data.result;
            // 在此处将数据赋值给全局变量
            userName1 = userInfo.userName;

            getTotayTotal()

        } catch (error) {
            // 处理请求错误
            console.error(error);
        }
    }

    getUserInfo();
    //获取当天日期
    getCurrentTime();
    //获取当小时
    getCurrentHoursTime();
    //获取当月
    getCurrentMonth();

    async function getTotayTotal() {
        var url = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/statistics/auditStatistics?account=';

        // 拼接当天日期
        var auditStatisticsUrl =
            url +
            userName1 +
            '&startTime=' +
            currentTime +
            ' 00:00:00&endTime=' +
            currentTime +
            ' 23:59:59&current=1&size=10';
        // 拼接当小时url
        var currentHoursTimeUrl = url + userName1 + currentHoursTime;

        // 拼接当月
        var monthUrl =
            url +
            userName1 +
            '&startTime=' +
            currentTime1 +
            ' 00:00:00&endTime=' +
            currentTime2 +
            ' 23:59:59&current=1&size=10';

        // 获取每天的目标完成量
        var dailyTarget = 1200;

        try {
            // 等待获取数据
            var data = await getContent(auditStatisticsUrl);
            var hoursData = await getContent(currentHoursTimeUrl);
            var ho = await getContent(monthUrl);

            // 在控制台输出获取到的数据
            console.log(data);
            console.log(hoursData);
            console.log(ho);

            // 在此处将数据赋值给全局变量
            var myData = data.data;
            var records = myData.records;
            todayTotal = records[0].total;
            console.log('当日总量：' + records[0].total);

            // 获取当小时的工作量
            var myHoursData = hoursData.data;
            var recordsHours = myHoursData.records;
            hoursTotal = recordsHours[0].total;
            console.log('当时总量：' + recordsHours[0].total);

            // 获取月度总量
            var myHo = ho.data;
            var re = myHo.records;
            var monthTotal = 0;
            for (var i = 0; i < re.length; i++) {
                monthTotal += parseInt(re[i].total, 10);
            }
            console.log('月度总量：' + monthTotal);

            // 获取当前月份的天数，并根据实际的工作日历进行调整
            var totalWorkDays;
            var currentMonth = new Date().getMonth();
            var totalDays = daysInMonth(currentMonth);
            if (totalDays === 30) {
                totalWorkDays = 21;
            } else if (totalDays === 31) {
                totalWorkDays = 22;
            }

            // 计算差多少完成目标
            var remainingTarget = dailyTarget * totalWorkDays - monthTotal;
            console.log('差多少完成目标：' + remainingTarget);
            //计算已完成的百分比
            var bfb= monthTotal/(dailyTarget * totalWorkDays)* 100;
            // 计算完成的百分比
            var percentageCompleted =(todayTotal/dailyTarget)*100;
            //计算未完成百分比
            var percentageTodayRemaining=100-percentageCompleted;

            console.log('已完成百分比：' + percentageCompleted.toFixed(2) + '%');

            floatingDiv.textContent = '当前账号：月审核量：' +monthTotal +
                '。日审核量：' +
                todayTotal +
                '。小时审核量：' +
                hoursTotal +
                '。目标差额：' +
                remainingTarget +
                '。差百分比：' +
                percentageTodayRemaining.toFixed(2) +
                '%'+
                '。总百分比：' +
                bfb.toFixed(2) +
                '%';
        } catch (error) {
            // 处理请求错误
            console.error(error);
        }
    }



    // 获取当前月份的天数，并根据实际的工作日历进行调整
    function daysInMonth() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var days = new Date(year, month, 0).getDate();

        // 根据实际情况调整天数
        if (month === 2) { // 二月份特殊处理，可根据实际情况调整
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                days = 29; // 闰年二月29天
            } else {
                days = 28; // 平年二月28天
            }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            days = 30; // 4月、6月、9月、11月每月30天
        }

        return days;
    }


    // 监听XMLHttpRequest的响应
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            //拦截目前有在处理的通道
            if(url === '/oes-csas-manage/aisle/authenticationAisleList'){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response2 = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    console.log(response2);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    parseJSONAuthenticationAisleList(response2);
                }
            }
            //对正在处理的通道做处理
            if (authenticationAisleList.indexOf(url) !== -1) {
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    //console.log(response);

                    // 解析 JSON 数据并进行处理
                    parseJSONData(response);

                }
            }

            //拦截所有通道获取每个通道剩余数据
            if(url === '/oes-csas-manage/statistics/aisleYetAuditStatistics'){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response3 = JSON.parse(this.responseText);
                    // 在控制台输出响应数据
                    console.log(response3);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    // ...
                }
            }
            //拦截账号风险标签
            if(url.includes('/oes-csas-manage/detail/allUserRiskLabels?author=')){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response4 = JSON.parse(this.responseText);

                    // 在控制台输出响应数据（新闻资质合规账号）
                    console.log(response4);

                    // 在这里可以进行对返回的 JSON 数据的操作
                    if(response4.data.riskLabelName === '新闻资质合规账号'){
                        alert('请注意本账号是：新闻资质合规账号');
                    }else if(response4.data.riskLabelName === '体育快审账号'){
                        alert('请注意本账号是：体育快审账号');
                    }

                }
            }
            //拦截AI审核信息
            if(url.includes('/oes-csas-manage/aia-record/video/result?assetId=')){
                if (this.getResponseHeader('content-type').indexOf('application/json') !== -1 ) {
                    var response5 = JSON.parse(this.responseText);

                    // 在控制台输出响应数据
                    //console.log(response5);

                }
            }
        });
        open.apply(this, arguments);
    };


    // 监听键盘按下事件
    document.addEventListener('keydown',async function(event) {
        var jsonData;
        var shouldSubmit;

        // 检查按下的键是否为数字 1
        if (event.key === '`'&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {

            // 获取 span 元素
            var spanEle = document.querySelector("span.el-tooltip");
            // 获取 span 元素的文本内容
            var spanTt = spanEle.textContent.trim();

            // 检查 span 元素的文本内容是否在高危账号集合中
            if (highRiskAccounts.includes(spanTt)) {
                // 弹窗提醒高危
                alert('当前视频账号【 ' + spanTt + ' 】为严重高危敏感账号，请仔细检查视频内容！');
                return; // 不继续执行后续代码
            }

            // 拼接JSON对象
            jsonData = {
                auditType: 7,
                labelId: '',
                queryAudit:0,
                remark:'',
                voList:[{aisleId:aisleId,assetId:assetId,modifyFields:[],objectStatus:1,videoType:1}]
            };


            // 判断标题和简介是否有违禁词
            // 存放违禁词
            var prohibitedWords = titleContainsChineseWord(mySentence);
            var result = await searchInferiorArtistOrProhibitedWord();

            if (prohibitedWords.length > 0) {
                var alertMessage = '请注意当前视频标题或简介中存在以下违禁词：【 ';
                alertMessage += prohibitedWords + ' 】'+result+ '：请仔细检查简介、影片内容、视频标题，无法机器判断通过！';
                // 弹出提示框
                alert(alertMessage);
            } else if (result !== '') {
                // 弹出确认对话框
                alert(result);
            } else {
                // 弹出确认对话框
                shouldSubmit = confirm('判断为：通过。确认要提交数据吗？');
            }

            // 根据用户的选择决定是否继续提交
            if (shouldSubmit) {
                submitData(jsonData);
                localStorage.setItem('tongguo', assetId);
            } else {
                // 用户选择取消提交，执行相应操作或不执行任何操作
            }

        }


    });



    // 弹出输入密码的页面
    var passwordVerified = false; // 添加一个标志位

    function showInputPassword() {
        var password = prompt('请输入密码：');
        if (password === null) {
            // 点击取消，返回
            return;
        } else {
            // 点击确定，执行密码验证
            if (password === 'MGSPSH2580') { // 替换为你要验证的密码
                passwordVerified = true; // 设置密码验证成功标志位为true
            } else {
                // 密码错误
                alert('密码错误，请重新输入！');
                showInputPassword(); // 继续弹出输入密码的页面
            }
        }
    }

    // 判断长视频通道的驳回
    document.addEventListener('click', function(event) {
        if (passwordVerified) { // 如果密码已经验证成功，则直接返回，不再执行下面的逻辑
            return;
        }

        var buttons = document.getElementsByClassName('el-button el-button--default el-button--small');
        for (var i = 4; i <= 6; i++) {
            var button = buttons[i];
            if (button.textContent.includes('驳回') || button.textContent.includes('驳回当前') || button.textContent.includes('小屏介质不合规')) {
                if (button.classList.contains('highlight')) {
                    var confirmResult = confirm('请注意当前为【长视频】或【无条件】通道！你当前选择了【驳回】或【小屏介质不合规】按钮，请前往【微信群里进行报备并询问是否驳回此视频】注意报备前请先取消驳回按钮的点击操作，以免操作失误，造成无法挽回的后果！');
                    if (confirmResult) {
                        showInputPassword();
                    } else {
                        return;
                    }
                }
            }
        }
    });





    //判断手动提交按钮的关键词检测
    document.addEventListener('click', async function(event) {
        var buttons = document.getElementsByClassName('el-button el-button--default el-button--small');
        for (var i = 2; i <= 3; i++) {
            var button = buttons[i];
            if (button.textContent.includes('通过')) {
                if (button.classList.contains('highlight')) {
                    var prohibitedWord = titleContainsChineseWord(mySentence);
                    var result = await searchInferiorArtistOrProhibitedWord();
                    // 获取 span 元素
                    var spanEle = document.querySelector("span.el-tooltip");

                    // 获取 span 元素的文本内容
                    var spanTt = spanEle.textContent.trim();

                    // 检查 span 元素的文本内容是否在高危账号集合中
                    if (highRiskAccounts.includes(spanTt)) {
                        if (!button.hasAttribute('data-displayed-alert')) {
                            alert('当前视频账号【 ' + spanTt + ' 】为严重高危敏感账号，请仔细检查视频内容！');
                            button.setAttribute('data-displayed-alert', true);
                        }
                        return; // 不继续执行后续代码
                    }

                    if (prohibitedWord !== '') {
                        var hasDisplayedAlert = button.hasAttribute('data-displayed-alert');
                        if (!hasDisplayedAlert) {
                            alert('请注意当前视频标题或简介中存在违禁词：【 ' + prohibitedWord + ' 】' + result + '：请仔细检查简介、影片内容、视频标题，无法机器判断通过！');
                            button.setAttribute('data-displayed-alert', true);

                        } else {
                            // 已经弹窗过了，不执行弹窗逻辑
                        }
                    } else if (result !== '') {
                        // 只弹出一次
                        if (!button.hasAttribute('data-displayed-alert')) {
                            alert(result);
                            button.setAttribute('data-displayed-alert', true);
                        }
                    } else {
                        // 没有违禁词，继续执行其他逻辑
                    }
                }
            }
        }
    });


    // 解析 JSON 数据并进行处理的函数
    function parseJSONData(data) {
        // 在控制台输出完整的 JSON 数据
        console.log(data);

        // 访问和操作 JSON 数据中的属性和值;
        // 解析和处理数组数据
        var arrayData = data.data;

        arrayData.forEach(function(element) {
            //获取媒资ID
            assetId = element.assetId;
            aisleId = element.aisleId;
            author = element.author;
            mySentence = element.description + '_____' + element.assetName;
            console.log('assetId:',element.assetId,'+aisleId:',aisleId);
        });
    }

    //解析正在做的通道数据
    function parseJSONAuthenticationAisleList(data){
        // 访问和操作 JSON 数据中的属性和值;
        // 解析和处理数组数据
        var arrayData = data.data;

        arrayData.forEach(function(element) {
            //获取正在处理通道ID进行拼接
            authenticationAisleList.push('/oes-csas-manage/audit/fetch?aisleId='+element.aisleId+'&listLength=1');
            console.log('通道连接:','/oes-csas-manage/audit/fetch?aisleId='+element.aisleId+'&listLength=1');
        });
    }


    // 创建用于展示提交成功提示的悬浮窗
    const floatingDiv1 = document.createElement('div');
    floatingDiv1.style = `
    position: fixed;
    top: 11%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #4CAF50;
    color: #fff;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    display: none;
    `;
    document.body.appendChild(floatingDiv1);


    // 创建用于展示提交成功提示的悬浮窗
    const floatingDiv2 = document.createElement('div');
    floatingDiv2.style = `
    position: fixed;
    top: 7%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
    background-color: #4CAF50;
    color: #fff;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    display: none;
    `;
    document.body.appendChild(floatingDiv2);
    // 显示悬浮窗
    function showFloatingDiv1() {

        floatingDiv1.innerText = '提交成功 ' + assetId;

        floatingDiv1.style.display = 'block';

        // 1秒后自动隐藏悬浮窗
        setTimeout(function() {
            hideFloatingDiv1();
        }, 1500);
    }
    // 隐藏悬浮窗
    function hideFloatingDiv1() {
        floatingDiv1.style.display = 'none';
    }

    // 显示悬浮窗
    function showFloatingDiv2() {
        floatingDiv1.innerText = '提交失败！';
        floatingDiv1.style.display = 'block';

        // 1秒后自动隐藏悬浮窗
        setTimeout(function() {
            hideFloatingDiv2();
        }, 1500);
    }
    // 隐藏悬浮窗
    function hideFloatingDiv2() {
        floatingDiv1.style.display = 'none';
    }


    //查询标题违禁词
    var queryContentListUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
    // 存放待查询的内容
    // 账号
    var searchAuditor;
    var searchTitleKeyword;
    var keyword= searchWordLibrary;
    // 按键触发查询和显示框切换
    var isDialogVisible = false; // 初始显示框为可见状态
    // 逐个对人员进行查询
    function searchAuditorContent(keyword) {
        // 拼接Post查询的JSON
        var jsonData = {
            "aiAuditStatus": "",
            "aisleEndTime": "",
            "aisleId": "",
            "aisleStartTime": "",
            "assetId": "",
            "auditor": userName1,
            "auditStatus": "1",
            "auditType": "",
            "author": "",
            "collectEndTime": "",
            "collectStartTime": "",
            "costTime": "",
            "createTimeEndTime": "",
            "createTimeStartTime": "",
            "displayName": "",
            "endTime": "",
            "exclusiveKeyword": "",
            "keywords": "",
            "labelId": "",
            "location": "2",
            "MD5": "",
            "mediumStatus": "",
            "occurred": "",
            "otherKeyword": "",
            "pageNum": 1,
            "pageSize": 100,
            "riskList": [],
            "secondClassCode": "",
            "startTime": "",
            "thirdClassCode": "",
            "titleKeyword": keyword,
            "userId": "",
            "userRiskList": [],
            "videoType": ""
        };

        searchData(jsonData);
        //console.log('违禁词输出：',jsonData.titleKeyword, jsonData);
    }

    // 创建显示框
    var dialog = document.createElement('div');
    dialog.style.display = 'none'; // 初始隐藏
    dialog.style.position = 'fixed';
    dialog.style.top = '55%';
    dialog.style.left = '55%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.background = '#fff';
    dialog.style.width = '75%';
    dialog.style.border = '1px solid #ccc';
    dialog.style.boxShadow = '0 0 10px rgba(0,0,0,.3)';
    dialog.style.overflowY = 'scroll'; // 添加垂直滚动条
    dialog.style.maxHeight = '600px'; // 设置最大高度
    document.body.appendChild(dialog);

    // 记录行和列的计数器
    var rowCounter = 0;
    var colCounter = 0;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'h'&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            searchWordLibrary.forEach(function(keyword) {
                searchAuditorContent(keyword, '');
            });
        } else if (event.key === 'z'&& event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            if (dialog.style.display === 'none') {
                dialog.style.display = 'block';
                isDialogVisible = false;
            } else {
                dialog.style.display = 'none';
                isDialogVisible = true;
            }
        }
    });

    // 显示显示框
    if (isDialogVisible) {
        dialog.style.display = 'block';
    } else {
        dialog.style.display = 'none';
    }

    // 查询数据
    function searchData(jsonData) {
        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', queryContentListUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //console.log(response); // 在控制台输出结果
                var message = '违禁词：' + jsonData.titleKeyword + ' 数据数量：' + response.data.total;

                ;
                // 创建单元格并添加内容
                var cell = document.createElement('td');
                cell.innerText = message;
                cell.style.padding='10px';

                // 如果数据数量大于0，添加红褐色的样式
                if (response.data.total > 0) {
                    cell.style.color = 'red';
                }

                // 添加单元格到表格中
                if (colCounter === 0) {
                    var row = document.createElement('tr');
                    dialog.appendChild(row);
                }
                dialog.lastChild.appendChild(cell);

                // 更新行和列的计数器
                colCounter++;
                if (colCounter >= 10) {
                    colCounter = 0;
                    rowCounter++;
                }

                // 如果超过30行，移除第一行以保持显示框大小不变
                if (rowCounter > 30) {
                    dialog.firstChild.remove();
                    rowCounter--;
                }

                // 显示显示框
                dialog.style.display = 'block';
            } else {
                //console.log('提交失败，请手动提交！');
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }


    // 提交数据
    function submitData(jsonData) {

        // 将 JSON 数据转换为字符串
        var jsonString = JSON.stringify(jsonData);
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 设置请求信息
        // 替换为目标服务器的URL
        xhr.open('POST', 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/audit/submit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 设置回调函数
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //alert('提交成功！');

                // 提交成功后显示悬浮窗
                showFloatingDiv1();

                // 在控制台输出响应数据
                console.log(response);
                // 调用另一个 GET 接口刷新页面
                //refreshPartialPage('https://oes-coss.miguvideo.com:1443/oes-csas-manage/audit/fetch?aisleId=1640366366593208321&listLength=1');

                //模拟点击确定按钮
                //simulateClickAndRefresh();
            } else {
                //alert('提交失败，请手动提交！');
                showFloatingDiv2();
            }
        };

        // 发送请求
        xhr.send(jsonString);
    }


    // 查询劣迹艺人或违禁词
    async function searchInferiorArtistOrProhibitedWord() {
        // 存放返回结果
        var result = '';

        // 存放链接
        var aiUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/aia-record/video/result?assetId=' + assetId;
        var aiResult = await getContent(aiUrl);

        // 人脸名称
        console.log(aiResult);

        // 判断AI质检结果及文本结果是否存在
        if (aiResult.data) { // 添加判断条件进行数据有效性检查
            var dataAI = JSON.parse(aiResult.data);

            if (dataAI && dataAI.auditReason !== '通过') { // 添加判断条件进行数据有效性检查
                var auditReason = dataAI.auditReason;
                var dataList = dataAI.dataList;
                var faceNameSet = 'faceNameSet';
                var textSet = 'textSet';


                // 使用前清空set
                localStorage.removeItem(faceNameSet);
                localStorage.removeItem(textSet);

                if (dataList && dataList.length > 0) {
                    for (var i = 0; i < dataList.length; i++) {
                        var dataListValue = dataList[i];

                        addToSet(dataListValue.text, textSet);
                        if ('faces' in dataListValue) {
                            for (var j = 0; j < dataListValue.faces.length; j++) {
                                var name = dataListValue.faces[j].name;
                                console.log('人物：'+name)
                                if (name === null || name === undefined || name === '') {
                                    continue; // 不允许存储空值
                                } else {
                                    addToSet(dataListValue.faces[j].name, faceNameSet);
                                }
                            }
                        }
                    }
                }else {
                    // 处理 dataList 未定义或为空的情况
                }

                // 判断视频内文字是否存在违禁词
                var prohibitedWord = titleContainsChineseWord(getSet(textSet));

                // 存放违禁词
                if (prohibitedWord !== '') {
                    result = '当前AI提示此视频字幕存在违禁词：【 ' + prohibitedWord + ' 】';
                    console.log('当前AI提示此视频内容文字部分存在违禁词：' + prohibitedWord);
                }

                // 判断人名是否是劣迹艺人
                var searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                var searchInferiorArtistName;
                var faceSet = getSet(faceNameSet);
                if (faceSet.length !== 0) {
                    for (var item of faceSet) {
                        searchInferiorArtistUrl = searchInferiorArtistUrl + item + '&formerName=&country=&genre=&badProblem=&bak1=&bak2=';
                        var searchInferiorArtisResult = await getContent(searchInferiorArtistUrl);

                        // 添加判断条件进行数据有效性检查
                        if (searchInferiorArtisResult && searchInferiorArtisResult.data) {
                            var total = searchInferiorArtisResult.data.total;
                            if (total !== 0) {
                                searchInferiorArtistName = item;
                                var records = searchInferiorArtisResult.data.records;
                                var searchResult = '';
                                for (var g = 0; g < records.length; g++) {
                                    var artistName = records[g].name;
                                    var artistGenre = records[g].genre;
                                    var artistControlDescription = records[g].controlDescription;
                                    searchResult = searchResult + '人物库查询结果：劣迹艺人名称：【 ' + artistName + ' 】。劣迹类型：' + artistGenre + '。管控描述：' + artistControlDescription;
                                }
                                result += 'AI提示视频内容出现违禁艺人：【' + searchInferiorArtistName + '】【' + searchResult + ' 】';
                                console.log('AI提示视频内容出现违禁艺人：' + searchInferiorArtistName + searchResult);
                            }
                        }

                        searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                    }
                }
            }
        }

        return result;
    }



    // 刷新页面的函数
    function refreshPartialPage(reloadUrl) {
        // 调用 Fetch API 或其他适合的技术，加载或更新指定区域的内容
        fetch(reloadUrl, {
            method: 'GET'
        })
            .then(function(response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('加载局部页面失败');
            }
        })
            .then(function(data) {
            // 更新指定区域的内容// 替换为目标元素的选择器或ID
            var targetElement = document.getElementByClass('content');
            targetElement.innerHTML = data;
        })
            .catch(function(error) {
            console.error(error);
        });
    }


    // 模拟点击 tree 中的一个 div 并刷新局部页面
    function simulateClickAndRefresh() {
        // 替换为 tree div 的 ID 或选择器
        var treeDiv = document.getElementsByClassName('el-tree');
        if (treeDiv) {
            // 替换为要点击的目标 div 的类名
            var targetDiv = treeDiv.querySelector('.el-tree-node is-current is-focusable');
            if (targetDiv) {
                // 监听目标 div 的点击事件
                // 阻止默认的点击事件，防止页面跳转
                targetDiv.addEventListener('click', function(event) {
                    event.preventDefault();

                    // 在点击事件中刷新局部页面
                    // 替换为局部内容的容器元素的 ID 或选择器
                    var partialContentElement = document.getElementsByClassName('aisle_content');
                    if (partialContentElement) {
                        // 使用 AJAX 或其他方式获取新的局部内容，这里仅作为示例直接设置文本内容
                        // 替换为实际获取的局部内容
                        partialContentElement.textContent = 'New partial content';
                    }
                });

                // 触发模拟点击事件
                var event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                targetDiv.dispatchEvent(event);
            }
        }
    }


    // 获取词库数据


    // 判断中文语句中是否包含特定中文词语
    function containsChineseWord(sentence, word) {
        // 使用 "u" 标志启用 Unicode 正则匹配
        var regex = new RegExp(word, 'u');
        return regex.test(sentence);
    }

    // 判断标题和介绍中是否存在违禁词语
    function titleContainsChineseWord(mySentence) {
        var matchedWords = []; // 存放匹配到的关键词
        for (var i = 0; i < searchWordLibrary.length; i++) {
            var searchWord = searchWordLibrary[i];
            if (containsChineseWord(mySentence, searchWord)) {
                matchedWords.push(searchWord); // 将匹配到的关键词添加到数组中
            }
        }
        var matchedDescriptions = matchedWords.map(function(word) {
            var description = getDescriptionForWord(word);
            return word + (description ? ' => ' + description : '');
        });
        return matchedDescriptions.join('、'); // 使用逗号和空格将关键词和描述分隔开
    }


    // 发起 GET 请求获取腾讯文档内容
    function getTencentDocContent(url) {
        var xhr = new XMLHttpRequest();
        var response;
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                response = JSON.parse(xhr.responseText);
                return response;
            }
        };
        xhr.send();
    }



    // 发起 GET 请求获取通用方法
    function getContent(url) {
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                return response.json();
                console.log(response.json())
            })
                .then(function(data) {
                resolve(data);
                console.log(data)
            })
                .catch(function(error) {
                reject(error);
            });
        });
    }


    // 获取当天时间
    function getCurrentTime() {
        var currentDate = new Date();

        // 获取年份、月份、日期、小时、分钟和秒数
        var year = currentDate.getFullYear();
        // 月份从0开始，需要加1，并确保两位数格式
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        // 获取日期，并确保两位数格式
        var day = ('0' + currentDate.getDate()).slice(-2);
        // 获取小时，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        // 获取分钟，并确保两位数格式
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        // 获取秒数，并确保两位数格式
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        // 拼接成当天的时间字符串
        currentTime = year + '-' + month + '-' + day;

        // 在控制台输出当天时间
        console.log('当天时间:', currentTime);
    }

    // 获取当天时间
    function getCurrentHoursTime() {
        var currentDate = new Date();

        // 获取年份、月份、日期、小时、分钟和秒数
        var year = currentDate.getFullYear();
        // 月份从0开始，需要加1，并确保两位数格式
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        // 获取日期，并确保两位数格式
        var day = ('0' + currentDate.getDate()).slice(-2);
        // 获取小时，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        // 获取分钟，并确保两位数格式
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        // 获取秒数，并确保两位数格式
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        if(parseInt(hours) === 23){
            //下一个小时
            var dayHours = parseInt(day) + 1;
            //拼接当小时时间段
            currentHoursTime = '&startTime=' + year + '-' + month + '-' + day + ' 23:00:00&endTime='+ year + '-' + month + '-' + dayHours + ' 00:00:00&current=1&size=10';
        }else{
            //下一个小时
            var nextHours = parseInt(hours) + 1;
            //拼接当小时时间段
            currentHoursTime = '&startTime=' + year + '-' + month + '-' + day + ' ' + hours + ':00:00&endTime='+ year + '-' + month + '-' + day + ' ' + nextHours + ':00:00&current=1&size=10';
        }


        // 在控制台输出当天时间
        console.log('当小时时间:', currentHoursTime);
    }




    // 获取当月时间
    function getCurrentMonth() {
        var currentDate = new Date();

        // 获取年份、月份，并确保两位数格式
        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);

        // 获取当月第一天和最后一天日期对象
        var firstDay = new Date(year, currentDate.getMonth(), 1);
        var lastDay = new Date(year, currentDate.getMonth() + 1, 0);

        // 获取小时、分钟和秒数，并确保两位数格式
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        // 拼接成当月第一天和最后一天的字符串
        currentTime1 = year + '-' + month + '-' + firstDay.getDate();
        currentTime2 = year + '-' + month + '-' + lastDay.getDate();

        // 在控制台输出当天时间
        console.log('当月时间:', currentTime1, currentTime2);
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
})();
