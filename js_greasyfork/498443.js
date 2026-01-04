// ==UserScript==
// @name         B站大杂烩成分指示器（极简版）
// @name:en      Bilibili_Agent_Simple
// @version           3.0.3
// @author            trychen,miayoshi,TenSin,klxf,hmjz100,xulaupuz,
// @license           GPLv3
// @description  自动标注成分，原:A畜3畜野狗大杂烩指示器·改,极简版，无倾向性（太nt除外eg伪史论者），侵删
// @description:en  Automatic labeling of ingredients, original: A livestock 3 animal wild dog hodgepodge indicator change, simply, no tendency,  if invasion else deletion
// @match             *://*.bilibili.com/*
// @connect           bilibili.com
// @connect           api.aicu.cc
// @connect           gcore.jsdelivr.net
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM_setClipboard
// @grant             unsafeWindow
// @run-at            document-idle
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal     https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @resource SwalDark https://unpkg.com/@sweetalert2/theme-dark@5/dark.min.css
// @namespace https://greasyfork.org/users/1110013
// @downloadURL https://update.greasyfork.org/scripts/498443/B%E7%AB%99%E5%A4%A7%E6%9D%82%E7%83%A9%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E6%9E%81%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/498443/B%E7%AB%99%E5%A4%A7%E6%9D%82%E7%83%A9%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E6%9E%81%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function BiliChecker() {
	/**
	 * 是否在控制台显示大多数错误消息
	 */
	let debug = false;
	/**
	 * 是否在查询按钮旁显示复制按钮
	 * 开启后点击复制按钮可以复制该用户对应的成分规则
	 * 复制的信息大概就是这样：UID, // 用户名
	 */
	let copyName = false;
	/**
	 * 注释~
	 * 在这里配置要检查的成分，或者直接拉黑（使用指定UID评论的人会被直接添加标签）。
	 * 假设你要直接给指定UID添加一个标签的话，就这样写：blacklist: [1234567890,0987654321]
	 * 成分列表后有一个 支持含注释快速排序 UID 的函数，到了那里，您可以查看相关使用说明
	 * 借此脚本守护我们最好的噼里啪啦捏~
	 */
	const checkers = [
        {
			displayName: "抽奖",
			displayIcon: "🎁",
			keywords: ["互动抽奖", "转发本条动态"],
		}
		,

        {
            displayName: "",
            displayIcon: "@600w_600h_1c_1s.webp",
            keywords: [""],
            followings: []
        }
        ,

        {
            displayName: "地平论者",//你没事吧
            displayIcon: "https://i0.hdslb.com/bfs/face/051056a87a1cbdc56cce513714aa2a3ad6490c98.jpg@600w_600h_1c_1s.webp",
            keywords: [""],
            followings: [
			    563479941,//天圆地方地球骗局
				1030963504,//平坦的陆地
				//待续
				]
        }
        ,
        {
            displayName: "伪史论者",  //难绷,直接一滴血原则
            displayIcon: "https://shufa.supfree.net/k/104074.gif",
            keywords: ["神都俗人","周楚山","何新","河清"],
            followings: [
				167541240,//神都俗人
				351610385,//周楚山
				386840843,//阿波罗登月造假，原名：数学名师汇
				310877780,//何新老家伙——伪史论亚圣
				1761823456,//河清
				387542456,//驰豹_
				1543803026,//云影方寸
				2123823309,//老Q
				3546387329321268,//栖梧辨史
				3546597122116354,//老丁说文
				3493091193391214,//孔言史语
				385959641,//历史集结号
				634980447,//我所认知的历史
				2031292544,//老雪文史
				1162474667,//程咬金说明朝故事
				5262093,//时空盒
				49623845,//范宇平LALIN先生
				668180012,//东哥说文史
				1604012612,//生民无疆
				30929648,//碎尘凡星
				2059646713,//朱恪远
				1091922158,//通利明堂
				687708004,//谈史有料
				527239433,//诸葛小叭
				522474063,//崔哥侃
				480768335,//陈成诚_1644
				53069167,//六艺伏羲
				235467006,//布衣老朱
				218818485,//郑青春谈天地
				3546842713294994,//老福觉醒人生
				3546637980928672,//某大叔的全能小破站
				3546598051154187,//西史证伪
				15213992,//天涯何处遇知音啊
				26609222,//楚子莫疑
				303599142,//吃瓜蒙主
				240225127,494747562,3546815037180838,283204666//吃瓜蒙主切片
				

				//待续
			]
        }
        ,
		        {
            displayName: "电哥",
            displayIcon: "https://i1.hdslb.com/bfs/face/c277af542ef1ad8657dab6cff68c2744a842724c.jpg@600w_600h_1c_1s.webp",
            keywords: ["电哥"],
            followings: [2053632613,1526687911,436361773,603781744,3493272299243771]
        }
        ,
		{
            displayName: "七哥",
            displayIcon: "https://i1.hdslb.com/bfs/face/d862ad470125a518ddbaab50d88ffb8332de9e3d.jpg@240w_240h_1c_1s.webp",
            keywords: ["七哥"],
            followings: [323397658,3546588567833451,3546688025266313,626116668,1908575732,650014862,37948129,698056492,77701536,416952165]
        }
		,
        {
            displayName: "阿甘",
            displayIcon: "https://i1.hdslb.com/bfs/face/787bec68454f36ebfdc78bf828a88cfdee98df2e.jpg@600w_600h_1c_1s.webp",
            keywords: ["军情阿甘"],
            followings: [3546620310326128]
        }
        ,
        {
            displayName: "卢克文",
            displayIcon: "https://i0.hdslb.com/bfs/face/a8f3ef0a71de565c059c46fa95967058d4e8e37f.jpg@600w_600h_1c_1s.webp",
            keywords: ["卢克文"],
            followings: [438173577]
        }
        ,
        {
            displayName: "赛雷",
            displayIcon: "https://i1.hdslb.com/bfs/face/4eb764b8c6afc48ad1e7aaf84b0f58db3d4dbb3f.jpg@600w_600h_1c_1s.webp",
            keywords: ["赛雷"],
            followings: [26108626,151482404,510362725]
        }
        ,
        {
            displayName: "独夫之心",
            displayIcon: "https://i0.hdslb.com/bfs/face/ce1df7657719267a4ca8b95009cfa98ae28f5079.jpg@600w_600h_1c_1s.webp",
            keywords: ["独夫之心"],
            followings: [10850097]
        }
        ,
        {
            displayName: "小Q",
            displayIcon: "https://i0.hdslb.com/bfs/face/3b59fb5c73d1de935acab4447f3f000e1aa783f1.jpg@600w_600h_1c_1s.webp",
            keywords: ["小Q"],
            followings: [546189]
        }
        ,
        {
            displayName: "vv",
            displayIcon: "https://i2.hdslb.com/bfs/face/4cd3272c73227218ff18ff5273d7f2b94beabd4a.jpg@600w_600h_1c_1s.webp",
            keywords: ["维为"],
            followings: [1458767615]
        }
        ,
        {
            displayName: "荷兰人",
            displayIcon: "https://i0.hdslb.com/bfs/face/0339cce3092b22d20f6cd33edc041459fd86d9fe.jpg@600w_600h_1c_1s.webp",
            keywords: ["天空飞翔荷兰人","天空的荷兰人"],
            followings: [401861362,372383049]
        }
        ,
        {
            displayName: "新华社",
            displayIcon: "https://i1.hdslb.com/bfs/face/396b93a7f619882afa711879dbf2cb98a40e7367.jpg@600w_600h_1c_1s.webp",
            keywords: ["新华网","新华社"],
            followings: [473837611]
        }
        ,
        {
            displayName: "胡律师",
            displayIcon: "https://i2.hdslb.com/bfs/face/88424e8eaeb3466fc7cf93429651f59a70c38b4d.jpg@600w_600h_1c_1s.webp",
            keywords: ["胡律师"],
            followings: [8440892]
        }
        ,
        {
            displayName: "二流媒体",
            displayIcon: "https://i2.hdslb.com/bfs/face/19a041ba0e78ed43b7a3eab35edfc998eaa7db8e.jpg@600w_600h_1c_1s.webp",
            keywords: ["人民日报","人民网"],
            followings: [1131457022,33775467]
        }
        ,
		{
            displayName: "央视",
            displayIcon: "https://i1.hdslb.com/bfs/face/2dc9c34444ba9f8e891fdc98e6c331fa3c02d127.jpg@600w_600h_1c_1s.webp",
            keywords: ["央视"],
            followings: [456664753,222103174,433587902,451320374]
        }
		,
		{
            displayName: "黑神话",
            displayIcon: "https://i1.hdslb.com/bfs/face/5fdac7d9820175f5f0ae1b6c33968bb8f64cc82c.jpg@240w_240h_1c_1s.webp",
            keywords: ["黑神话"],
            followings: [642389251]
        }
		,
		{
            displayName: "老猫",
            displayIcon: "折腾的老猫",
            keywords: ["https://i2.hdslb.com/bfs/face/7c943a916e46c53170426f286c33bb3a116a483c.jpg@240w_240h_1c_1s.webp"],
            followings: [1175509358]
        }
		,
		{
            displayName: "户晨风",
            displayIcon: "https://i1.hdslb.com/bfs/face/06f1ead2473e5af54d4f6ae35ce2baf825d31414.jpg@240w_240h_1c_1s.webp",
            keywords: ["戶晨风","户晨风"],
            followings: [9047380,49869761]
        }
		,
		{
            displayName: "峰哥",
            displayIcon: "https://i2.hdslb.com/bfs/face/ae439693d6fd79a55b1b5f935ed6474ae6fba35b.jpg@240w_240h_1c_1s.webp",
            keywords: ["峰哥"],
            followings: [35847683,476655153,322296103]
        }
		,
		{
            displayName: "胜利文绉绉",
            displayIcon: "https://i0.hdslb.com/bfs/face/2235f4376c1cc61919bbf7972a8236b59ff50409.jpg@240w_240h_1c_1s.webp",
            keywords: ["胜利文绉绉"],
            followings: [12300996]
        }
		,
		{
            displayName: "环球",
            displayIcon: "https://i0.hdslb.com/bfs/face/c8a2502a53adf1b6d309171e15c167e73beaad44.jpg@240w_240h_1c_1s.webp",
            keywords: ["环球时报","环球网"],
            followings: [10303206,483787858]
        }
		,
		{
            displayName: "夹头",
            displayIcon: "https://i2.hdslb.com/bfs/face/0b542ee82fa15dd80a722053dfd679358d793a09.jpg@240w_240h_1c_1s.webp",
            keywords: ["司马南"],
            followings: [612492134]
        }
		,
		{
            displayName: "赵灵敏",
            displayIcon: "https://i1.hdslb.com/bfs/face/6d74df8b444250f534ff75068189d78bb246ed87.jpg@240w_240h_1c_1s.webp",
            keywords: ["赵灵敏"],
            followings: [488066419]
        }
		,
		{
            displayName: "极客小冷",
            displayIcon: "https://i0.hdslb.com/bfs/face/00c0713a09ded3f5e319ad8da2c964f784b16b8d.jpg@240w_240h_1c_1s.webp",
            keywords: ["极客小冷"],
            followings: [316410045]
        }
		,
		{
            displayName: "心医",
            displayIcon: "https://i1.hdslb.com/bfs/face/560914dab69fde91b1f493deab08431395cde9db.jpg@600w_600h_1c_1s.webp",
            keywords: ["心医","林霖"],
            followings: [1482025194,492808243,1671690277,3546613272284121,385421054,3494349717375890,3546610338367633]  //分身好多
        }
		,
		{
            displayName: "素材库",
            displayIcon: "https://i0.hdslb.com/bfs/face/7bbf5c68622f61a0d33d4beebaa9bbdbfccf235d.jpg@600w_600h_1c_1s.webp",
            keywords: ["虫类素材库"],
            followings: [1456398987]
        }
		,
		{
            displayName: "章北海",
            displayIcon: "https://i1.hdslb.com/bfs/face/645f6e958a0b6bf8d34a1ae396302cf112dd1a3c.jpg@600w_600h_1c_1s.webp",
            keywords: ["章北海official"],
            followings: [570064]
        }
		,
		{
            displayName: "MHY",
            displayIcon: "https://i2.hdslb.com/bfs/face/f7e24cfec824e0aaf67fdd62c960c13026768f70.jpg@600w_600h_1c_1s.webp",
            keywords: ["MHYY"],
            followings: [199676483]
        }
		,
		{
            displayName: "水东",
            displayIcon: "https://i0.hdslb.com/bfs/face/6d4403558d95515ca3e95e296b0648c7931bef32.jpg@600w_600h_1c_1s.webp",
            keywords: ["水东揭秘"],
            followings: [486404538]
        }
		,
        {
            displayName: "异化",
            displayIcon: "https://i1.hdslb.com/bfs/face/f586d7a72b4e1d891bd46abdb2614ead33b71435.jpg@600w_600h_1c_1s.webp",
            keywords: ["灵笼","艺画"],
            followings: [3494361474009190,14328316]
        }
        ,
        {
            displayName: "HOLO",
            displayIcon: "https://i1.hdslb.com/bfs/face/52f316ed4b89f48f3fea7cc165585c04c32f32df.jpg@600w_600h_1c_1s.webp",
            keywords: ["holo"],
            followings: [286700005]
        }
        ,
        {
            displayName: "饭-wyb",
            displayIcon: "https://i0.hdslb.com/bfs/face/3621591c438b83798cf32287837a10f16c1eb5a6.jpg@600w_600h_1c_1s.webp",
            keywords: ["YIBO-OFFICIAL"],
            followings: [688694784]
        }
        ,
        {
            displayName: "饭-exo",
            displayIcon: "https://i0.hdslb.com/bfs/face/b77988a74a83ade540857045781ad9485685554d.jpg@600w_600h_1c_1s.webp",
            keywords: ["EXO"],
            followings: [3493262484572295]
        }
        ,
        {
            displayName: "饭-zyx",
            displayIcon: "https://i1.hdslb.com/bfs/face/6fda05166cc55cdeed94475e2a944427f64ec7f4.jpg@600w_600h_1c_1s.webp",
            keywords: ["张艺兴"],
            followings: [161158015]
        }
        ,
        {
            displayName: "未明子",
            displayIcon: "https://i0.hdslb.com/bfs/face/71ad8ea7787e8acc85bd2a70b554150c35fc1e57.jpg@600w_600h_1c_1s.webp",
            keywords: ["未明子"],
            followings: [23191782]
        }
        ,
        {
            displayName: "蜗牛柯基",
            displayIcon: "https://i1.hdslb.com/bfs/face/939bc84b0ff28599c31e5b274ce70121268649b4.jpg@600w_600h_1c_1s.webp",
            keywords: ["蜗牛柯基weibo"],
            followings: [153890218]
        }
        ,
        {
            displayName: "观察者",
            displayIcon: "https://i0.hdslb.com/bfs/face/3d0dba3789065512f5217387ab135a093ae10c45.jpg@600w_600h_1c_1s.webp",
            keywords: ["观察者网","观视频工作室"],
            followings: [10330740,54992199,677410823,649926500]
        }
        ,
        {
            displayName: "共青团",
            displayIcon: "https://i1.hdslb.com/bfs/face/05725218e6cd8d0916da4f27ab56ca0957545c48.jpg@600w_600h_1c_1s.webp",
            keywords: ["共青团"],
            followings: [20165629]
        }
        ,
        {
            displayName: "孤烟暮蝉",
            displayIcon: "https://i2.hdslb.com/bfs/face/b6ef567cc83c4ab09b7682c729e85a145aa0b4e2.jpg@600w_600h_1c_1s.webp",
            keywords: ["孤烟暮蝉"],
            followings: [19248926]
        }
        ,
        {
            displayName: "白话频道",
            displayIcon: "https://i0.hdslb.com/bfs/face/59156298fd2f29265cb6496a6208ca3c4c8ee89a.jpg@600w_600h_1c_1s.webp",
            keywords: ["白话频道"],
            followings: [92241267]
        }
        ,
		{
            displayName: "阿吞啊",
            displayIcon: "https://i0.hdslb.com/bfs/face/3f4964d1015329a1a548be584a0261079045c7c5.jpg@600w_600h_1c_1s.webp",
            keywords: ["阿吞啊"],
            followings: [622986240]
        }
        ,
		{
            displayName: "俄罗斯",
            displayIcon: "https://i1.hdslb.com/bfs/face/d1a491998bc767ccc5cd914f336e83fb6fed3f82.jpg@600w_600h_1c_1s.webp",
            keywords: ["RT今日俄罗斯","俄罗斯卫星通讯社官网","RT娱乐"],
            followings: [501247999,1156910727,493270535539606,3493081961728612,1638603244,1208659620]
        }
        ,
		{
            displayName: "杰哥",
            displayIcon: "https://i1.hdslb.com/bfs/face/1799d75c67b9d1e447973610df9842a3fc5562ea.jpg@600w_600h_1c_1s.webp",
            keywords: ["鹏城杰森"],
            followings: [664086886]
        }
		,
		{
        displayName: "欧肯",
        displayIcon: "https://i2.hdslb.com/bfs/face/6333b48c19de82716cbfe9ab4b4dcef4f48f006d.jpg@600w_600h_1c_1s.webp",
        keywords: ["欧肯视线"],
        followings: [6859997]
        }
        ,
		{
            displayName: "尼禄",
            displayIcon: "https://i2.hdslb.com/bfs/face/5423011a2b2547003fe46d354e82f35c32e5d95e.jpg@600w_600h_1c_1s.webp",
            keywords: ["神皇尼禄","装甲尼禄","装甲NERO","傲慢尼禄","懒惰尼禄","愤怒尼禄"],
            followings: [335504294,1058667278,368081298,3546687668750650,3493121803421956]
        }
        ,
		{
            displayName: "马超",
            displayIcon: "https://i1.hdslb.com/bfs/face/1c56737dfc0deffffc31c78e0cefb0c3ecf7e000.jpg@600w_600h_1c_1s.webp",
            keywords: ["马督工","小黛晨读","睡前消息"],
            followings: [316568752,1556651916,59104725,64219557,2097311046]
        }
        ,
		{
            displayName: "￥3000",
            displayIcon: "https://i0.hdslb.com/bfs/face/8bb0b1ea83b892a1f396bd75849d60b61a49273f.jpg@600w_600h_1c_1s.webp",
            keywords: ["陈平眉山论剑"],
            followings: [526559715]
        }
        ,
				{
            displayName: "火星方阵",
            displayIcon: "https://i1.hdslb.com/bfs/face/8699bb487e1768f3990688eec7231ea7318d7bd2.jpg@600w_600h_1c_1s.webp",
            keywords: ["火星方阵"],
            followings: [649022917]
        }
        ,
        {
            displayName: "磊哥",
            displayIcon: "https://i1.hdslb.com/bfs/face/4897372932374c750fd3999e933885af1a1d0a93.jpg@600w_600h_1c_1s.webp",
            keywords: ["磊哥聊政经"],
            followings: [303981427]
        }
        ,
        {
            displayName: "金灿荣",
            displayIcon: "https://i2.hdslb.com/bfs/face/0bf6685ac1ef31832fe141416a98a4897f716195.jpg@600w_600h_1c_1s.webp",
            keywords: ["金灿荣"],
            followings: [1488338933]
        }
        ,
        {
            displayName: "圆脸",
            displayIcon: "https://i2.hdslb.com/bfs/face/f8f0fc4114bb06a87481abe12faa006a383cbe6d.jpg@600w_600h_1c_1s.webp",
            keywords: ["波士顿圆脸"],
            followings: [346563107]
        }
        ,
        {
            displayName: "王骁",
            displayIcon: "https://i0.hdslb.com/bfs/face/4b7f791af4dec3b9017c6fd9993dcd2087da3159.jpg@600w_600h_1c_1s.webp",
            keywords: ["王骁"],
            followings: [52165725,1140672573]
        }
        ,
        {
            displayName: "Lex",
            displayIcon: "https://i2.hdslb.com/bfs/face/27e06996840a7cb3ee0fee52f6b4616cd6567def.jpg@600w_600h_1c_1s.webp",
            keywords: ["LexBurner"],
            followings: [777536]
        }
        ,
        {
            displayName: "沈逸",
            displayIcon: "https://i2.hdslb.com/bfs/face/14633072e31671d939bd49bf2c2077f64929f9e8.jpg@600w_600h_1c_1s.webp",
            keywords: ["沈逸老师","沈逸"],
            followings: [648113003]
        }
        ,
        {
            displayName: "美食王刚",
            displayIcon: "https://i1.hdslb.com/bfs/face/1463fa4ea6bffd867dc257dca87248bb1d671cde.jpg@600w_600h_1c_1s.webp",
            keywords: ["美食作家王刚R","王刚"],
            followings: [290526283]
        }
        ,
        {
            displayName: "大漠叔叔",
            displayIcon: "https://i2.hdslb.com/bfs/face/bd405797f0d4d6305b76caafff66c98ae1062a35.jpg@600w_600h_1c_1s.webp",
            keywords: ["大漠叔叔",""],
            followings: [67141499]
        }
        ,
        {
            displayName: "哈米伦的弄笛者",
            displayIcon: "https://i1.hdslb.com/bfs/face/0909d7649e770b94d4f4cfd5628ee68206018ae4.jpg@600w_600h_1c_1s.webp",
            keywords: ["哈米伦的弄笛者",""],
            followings: [11742550]
        }
        ,
        {
            displayName: "A",
            displayIcon: "https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@240w_240h_1c_1s.jpg",
            keywords: ["想到晚的瞬间","晚晚","嘉晚饭","乃贝","贝极星空间站","乃琳夸夸群","顶碗人","皇珈骑士","贝极星","乃宝","嘉心糖的手账本","嘉心糖","拉姐","然然","asoul","A-SOUL","水母","来点然能量","奶淇琳","珈乐","贝拉拉的717片星空"],
            followings: [703007996,672342685,672328094,672353429,672346917,351609538]
        }
        ,
        {
            displayName: "塔",
            displayIcon: "https://i1.hdslb.com/bfs/face/4907464999fbf2f2a6f9cc8b7352fceb6b3bfec3.jpg@240w_240h_1c_1s.jpg",
            keywords: ["谢谢喵","taffy","雏草姬"],
            followings: [1265680561]
        }
        ,
        {
            displayName: "莲宝",
            displayIcon: "https://i0.hdslb.com/bfs/face/ced15dc126348dc42bd5c8eefdd1de5e48bdd8e6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["東雪蓮Official","东雪莲","莲宝"],
            followings: [1437582453]
        }
        ,
        {
            displayName: "T",
            displayIcon: "https://i0.hdslb.com/bfs/face/6be92dec2240b0593a40d2c696b37aa75c704ff6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["小星星","瞳宝","瞳子","瞳瞳","瞳星结","星瞳"],
            followings: [401315430,2122506217]
        }
        ,
        {
            displayName: "梓",
            displayIcon: "https://i2.hdslb.com/bfs/face/ba9ce36ef60a53e24a97f54429e62bdb951530a0.jpg@240w_240h_1c_1s.jpg",
            keywords: ["阿梓从小就很可爱","阿梓","小孩梓","达达","AME"],
            followings: [7706705]
        }
        ,
        {
            displayName: "小米",
            displayIcon: "https://i0.hdslb.com/bfs/face/77feb972004154b08ded4f1d388dbc1058fad2d9.jpg@600w_600h_1c_1s.webp",
            keywords: ["小米"],
            followings: [1476167907]
        }
        ,
        {
            displayName: "华为",
            displayIcon: "https://i2.hdslb.com/bfs/face/d09290cd18c3e048ca0b2eefa3647a487ed11b77.jpg@600w_600h_1c_1s.webp",
            keywords: ["华为"],
            followings: [102999485,578227337,439499363]
        }
        ,
        {
            displayName: "荣耀",
            displayIcon: "https://i0.hdslb.com/bfs/face/0cdc6b649da44ea38e71591b0297d47d86844f0e.jpg@600w_600h_1c_1s.webp",
            keywords: ["荣耀手机"],
            followings: [99748932]
        }
        ,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #原神", "#原神", "#米哈游#", "#miHoYo#", "原神", "芙宁娜", "白术", "赛诺", "神里绫人", "神里绫华", "夏洛蒂", "珊瑚宫", "九条裟罗", "班尼特", "夜阑", "那维莱特", "枫原万叶", "万叶", "钟离", "纳西妲", "香菱", "八重神子", "久岐忍", "菲谢尔", "艾尔海森", "胡桃", "林尼", "达达利亚", "提纳里", "宵宫", "莫娜", "甘雨", "罗莎莉亚", "刻晴", "九条裟罗", "温迪", "阿贝多", "云堇", "芭芭拉", "可莉", "迪卢克", "烟绯", "重云", "雷泽", "凝光", "坎蒂丝", "辛焱"],
			followings: [401742377] // 原神官方号的 UID
		}
        ,
				{
			displayName: "",
			displayIcon: "https://cf.qq.com/favicon.ico",
			keywords: ["穿越火线"],
			followings: [
				315554376, // 穿越火线官方号的 UID
				204120111, // CF农哥吊打小怪兽
				1083400219, // cf孙某
				398597510, // CF教父
				456180476, // CF猫七
				33281681, // CF威廉I黑化版
				440017413, // 穿越火线兴兴
				474595618, // 穿越火线赛事
			]
		},
		{
			displayName: "",
			displayIcon: "https://dnf.qq.com/favicon.ico",
			keywords: ["地下城与勇士", "DNF"],
			followings: [
				102176172, // 地下城与勇士官方号的 UID
				90179837, // dnf老搬
				27253173, // DNF面码
				8233456, // DNF枪魂冰子
				332349, // DNF死兔子
				168090912, // 17173DNF官方
				353944511, // DNF手游假猪
				325314188
			]
		},
		{
			displayName: "",
			displayIcon: "https://pubg.qq.com/favicon.ico",
			keywords: ["绝地求生", "PUBG"],
			followings: [
				449704680, // 意识DT
				6528910, // 小贝的游戏食堂
				46708782, // 鲁大能
				50329485, // 吃鸡赛事
				552064023, // 吃鸡小表弟
			]
		},
		{
			displayName: "",
			displayIcon: "https://lol.qq.com/favicon.ico",
			keywords: ["英雄联盟", "LOL"],
			followings: [
				50329118, // 哔哩哔哩英雄联盟赛事官方号的 UID
				4895244, // LOL丶诺诺
				470840543, // LOL楠神李青
				178778949, // 英雄联盟
				50329220, // 哔哩哔哩LOL赛事直播
				302651406, // WBG英雄联盟分部
				652663378, // LOL小超梦
				23364027, // 英雄联盟-小白鸦
			]
		},
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/c4cbdafecef76836b94f2ba8832d0a04d709a499.jpg@100w_100h.webp",
			keywords: ["第五人格", "#第五人格", "互动抽奖 #第五人格"],
			followings: [
				211005705, // 网易第五人格手游官方号的 UID
				105022844, // 第五人格赛事
				452627895, // 狼队电竞第五人格分部
				1385707562, // TE溯第五人格分部
			]
		},
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/6afedb4d85ea6c4115f5548146dc8d7127886ca0.jpg@100w_100h.webp",
			keywords: ["蛋仔派对", "#蛋仔派对", "互动抽奖 #蛋仔派对"],
			followings: [
				1306451842, // 网易蛋仔派对官方号的 UID
			]
		},
        {
            displayName: "",
            displayIcon: "https://i2.hdslb.com/bfs/face/57b6e8c16b909a49bfc8d8394d946f908cabe728.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #崩坏星穹铁道","崩坏星穹铁道"],
            followings: [1340190821]
        }
        ,
        {
            displayName: "",
            displayIcon: "https://i0.hdslb.com/bfs/face/049b47e0e73fc5cc1564343bb0aeacce8ae8e6f8.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #绝区零","绝区零"],
            followings: [1636034895]
        }
        ,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #王者荣耀", "#王者荣耀", "王者荣耀"],
			followings: [
				57863910, // 王者荣耀
				392836434, // 哔哩哔哩王者荣耀赛事
			]
		},
				{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/fe2e1a6e3dc702a6c91378e096ef37ca71bf4629.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #三国杀", "#三国杀", "三国杀", "#2023三国杀"],
			followings: [1254932367] // 三国杀十周年官方号的 UID
		},
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg@100w_100h.webp",
			keywords: ["我的世界", "minecraft", "#我的世界", "我的世界拜年祭", "MCBBS", "我的世界中文论坛", "MC玩家"],
			followings: [
				43310262, // 我的世界官方号的 UID
				39914211, // 我的世界中文论坛(MCBBS)官方号的 UID
			]
		},
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/a7591e5e0278aafb76cc083b11ca5dd46f049420.jpg@100w_100h.webp",
			keywords: ["mnsj", "迷你世界", "miniworld", "#迷你世界", "迷你世界拜年祭"],
			followings: [
				470935187, // 迷你世界官方号的 UID
			]
		},
        {
            displayName: "",
            displayIcon: "https://i0.hdslb.com/bfs/face/89154378c06a5ed332c40c2ca56f50cd641c0c90.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #明日方舟","危机合约","《明日方舟》"],
            followings: [161775300]
        }
        ,
        {
            displayName: "",
            displayIcon: "https://i0.hdslb.com/bfs/face/764412727f7dda317f2fd7a6cbc5ab5abe71e8cc.jpg@600w_600h_1c_1s.webp",
            keywords: ["命运-冠位指定"],
            followings: [233108841]
        }
        ,
        {
            displayName: "",
            displayIcon: "https://i1.hdslb.com/bfs/face/063ffbf06d3115d94f6a5241500ee63c4cae9915.jpg@600w_600h_1c_1s.webp",
            keywords: ["战舰世界"],
            followings: [573693898]
        }
        ,
        {
            displayName: "",
            displayIcon: "https://i1.hdslb.com/bfs/face/b00fa47b1b1f6d929aca215c909928859993b5d4.jpg@600w_600h_1c_1s.webp",
            keywords: ["少女前线2","少前2"],
            followings: [697654195]
        }
        ,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/9859fc14160795f4a7700053342494b3c71945ce.jpg@100w_100h.webp",
			keywords: ["无期迷途", "#无期迷途"],
			followings: [647409444]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i1.hdslb.com/bfs/face/f2635e09fe667d4ad29229c6ed0b5f4bdea09bd1.jpg@100w_100h.webp",
			keywords: ["蔚蓝档案"],
			followings: [3493265644980448,3493282386545566]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/e2a7e30399860cfa7c1ec5c958ab9e519290e181.jpg@100w_100h.webp",
			keywords: ["尘白禁区", "#尘白禁区"],
			followings: [1409863611,241036]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/5ec39858e751638ad389a5412696c7efbd31c7bf.jpg@100w_100h.webp",
			keywords: ["来自星尘", "#来自星尘"],
			followings: [1883857209]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i2.hdslb.com/bfs/face/0abd6b9df304334a9388e968740b5b9b7d1a84be.jpg@100w_100h.webp",
			keywords: ["鸣潮"],
			followings: [1955897084]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i2.hdslb.com/bfs/face/6a1936d5cb5b315311fedbf2d4793c4d404cac83.jpg@100w_100h.webp",
			keywords: ["重返未来1999", "#重返未来1999"],
			followings: [1197454103]
		}
		,
		{
			displayName: "",
			displayIcon: "https://i0.hdslb.com/bfs/face/1fd5b43d5f619e6df8c8adcf13c962a3e80ee971.jpg@100w_100h.webp",
			keywords: ["碧蓝航线", "#碧蓝航线", "#舰船新增#"],
			followings: [
				233114659, // 碧蓝航线官方号的 UID
			]
		}
		,
        {
            displayName: "",
            displayIcon: "https://i2.hdslb.com/bfs/face/667e4b1ca39300bff0672774f1980c02c2353b11.jpg@600w_600h_1c_1s.webp",
            keywords: ["少女前线","少前"],
            followings: [32472953]
        }
	]

	const checkerSpecial = [
		{
			displayName: "伪成分",
			displayIcon: "🤩",
			reason: "在同一内容中重复检测到成分",
		}
	]

	// 加入检测仙家军成分，目前仅支持黑名单和关注列表，数据来源：仙家军成分查询Helper
	request({ url: "https://gcore.jsdelivr.net/gh/Darknights1750/XianLists@main/xianLists.json" })
		.then(res => {
			console.log(`【（改）B站成分检测器】即时\n仙家军列表加载完成\n`, res)
			checkers.push({
				displayName: "仙家军",
				displayIcon: "仙",
				blacklist: [...res.xianList, ...res.xianLv1List, ...res.xianLv2List, ...res.xianLv3List],
				followings: [...res.xianList, ...res.xianLv1List, ...res.xianLv2List, ...res.xianLv3List]
			});
		})
		.catch(error => {
			console.error(`【（改）B站成分检测器】即时\n仙家军列表加载失败\n`, error);
		});

	/**
	 * 对输入的UID数字进行排序，并保留注释。
	 * 已暴露到脚本作用域的全局窗口，您可直接在浏览器控制台调用该函数。
	 *
	 * 运行：
	   sort(`1661612, // Hex今天切墙了吗
	   3227461, // 乔伊奥斯托雷
	   115545042, // 梅西杰的西餐厅
	   3933162,
	   140403337, // 塔塔kira
	   98991109, // 角社区
	   17098554, // 豆豆最棒
	   1932102,
	   415890389 // 高板大芥末`)
	 * 输出：
	   1661612, // Hex今天切墙了吗
	   1932102,
	   3227461, // 乔伊奥斯托雷
	   3933162,
	   17098554, // 豆豆最棒
	   98991109, // 角社区
	   115545042, // 梅西杰的西餐厅
	   140403337, // 塔塔kira
	   415890389, // 高板大芥末
	 *
	 * @param {string} inputText - 输入包含数字和注释的文本。
	 * @returns {string} - 排序后的文本，保留了注释。
	 */
	unsafeWindow.sort = function (inputText) {
		const regex = /(\d+),?\s*(?:\/\/(.*))?/g;
		let entries = [];
		let match;
		let seenNumbers = new Set(); // 用于记录已经出现的数字

		while ((match = regex.exec(inputText)) !== null) {
			let number = parseInt(match[1]);
			if (!seenNumbers.has(number)) { // 如果这个数字还没有出现过
				entries.push({
					number: number,
					comment: match[2] ? match[2].trim() : '' // 处理可能不存在的注释
				});
				seenNumbers.add(number); // 将这个数字标记为已出现
			}
		}

		entries.sort((a, b) => a.number - b.number);

		let sortedText = entries.map(entry => entry.comment
			? `${entry.number}, // ${entry.comment}`
			: `${entry.number},`).join('\n');

		console.log(sortedText);
	}

	unsafeWindow.getc = function () {
		let text
		for (let item of checkers) {
			text = (text ? text : "") + item.displayName + "、"
		}
		for (let item of checkerSpecial) {
			text = (text ? text : "") + item.displayName + "、"
		}
		console.log(`【（改）B站成分检测器】即时\n${text.slice(0, -1)}`)
	}

	/**
	 * 防止代码因其他原因被执行多次
	 * 这段代码出自 Via轻插件，作者谷花泰
	 */
	let key = encodeURIComponent('（改）B站成分检测器:主代码');
	if (window[key]) return;
	window[key] = true;
	console.log("【（改）B站成分检测器】即时\n运行中...")

	// 创建样式
	addCheckerStyle(false);

	// 图标、声明
	const searchIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></path></svg>`
	const checkButton = `<div class="composition-checkable"><div class="composition-badge-control"><span class="composition-name-control" title="点击查询用户成分">${searchIcon}</span></div></div>`
	const copyIcon = `<svg width="12" height="12" viewBox="0 0 17 17" fill="none"><path d="M0 0H10V4H4V10H0V0Z" fill="currentColor"/><path d="M16 6H6V16H16V6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></path></svg>`
	const tickIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><g><polyline points="3.7 14.3 9.6 19 20.3 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`
	const copyButton = `<div class="composition-copy"><div class="composition-badge-control"><span class="composition-name-control" title="点击复制用户规则">${copyIcon}</span></div></div>`
	const checked = {}
	const checking = {}
	let dom = ''

	// 支持 pakku? (建议开启“隐藏用户成分名称”)
	/*waitForKeyElements('.pakku-panel-footer div p a[href]', (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			let initialText = element.text().trim();

			if (element.parent().find(".composition-checkable, .composition-checked, .composition-copy"))
				element.parent().find(".composition-checkable, .composition-checked, .composition-copy").remove()

			element.parent().after(button);
			button.css({ "margin": "8px 5px" });
			button.one('click', function () {
				checkComposition(element.text().trim().split(' ').shift(), element.text().trim().split(' ').pop(), element, button.find(".composition-name-control"), element.parent(), (GM_getValue('Lite') === 'true' ? { "margin": "10px 0 10px 8px" } : { "margin": "10px 0" }))
			})
			button.click()

			// 可能只会有一个元素，所以监听用户名刷新
			element.on('DOMSubtreeModified', function () {
				let button = $(checkButton)
				let currentText = $(this).text().trim();
				if (currentText === initialText) return;

				initialText = currentText;
				if (element.parent().find(".composition-checkable, .composition-checked, .composition-copy"))
					element.parent().find(".composition-checkable, .composition-checked, .composition-copy").remove()

				button.css({ "margin": "8px 5px" });
				button.off('click').one('click', function () {
					checkComposition(element.text().trim().split(' ').shift(), element.text().trim().split(' ').pop(), element, button.find(".composition-name-control"), element.parent(), (GM_getValue('Lite') === 'true' ? { "margin": "10px 0 10px 8px" } : { "margin": "10px 0" }))
				})

				element.after(button);
				button.click()
			})
		}
	})*/

	// 2024版评论
	waitForKeyElements("div#info div#user-name[data-user-profile-id]", (element) => {
		if (element && element.length > 0) {
			let style = document.createElement("style");
			style.rel = 'stylesheet';
			style.innerHTML = addCheckerStyle(true)
			element.before(style)

			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-user-profile-id"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-user-profile-id")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2024版 回复、纯@评论
	waitForKeyElements("p#contents a[data-user-profile-id]", (element) => {
		if (element && element.length > 0) {
			let style = document.createElement("style");
			style.rel = 'stylesheet';
			style.innerHTML = addCheckerStyle(true)
			element.before(style)

			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-user-profile-id"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-user-profile-id")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2024版用户卡片
	waitForKeyElements("div#wrap div#view div#body div#title a#name", (element) => {
		if (element && element.length > 0 && element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let style = document.createElement("style");
			style.rel = 'stylesheet';
			style.innerHTML = addCheckerStyle(true)
			element.parent().parent().before(style)

			let button = $(checkButton)
			let initialText = element.text().trim();

			if (element.parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy"))
				element.parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy").remove()

			button.css({ "margin": "8px 5px" });
			button.one('click', function () {
				checkComposition(element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().parent(), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }))
			})
			element.parent().parent().after(button);
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			copy.css({ "margin": "8px 5px" });
			if (copyName === true) element.parent().parent().next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})

			// jQuerty 不支持监听 shadowRoot DOM 元素变化，所以这里用原生 MutationObserver 来监听元素变化
			const observer = new MutationObserver(mutations => {
				for (let mutation of mutations) {
					if (mutation.type === 'childList' || mutation.type === 'characterData') {
						let button = $(checkButton)
						let currentText = element.text().trim();
						if (currentText === initialText) return;

						initialText = currentText;
						if (element.parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy"))
							element.parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy").remove();

						button.css({ "margin": "8px 5px" });
						button.off('click').one('click', function () {
							checkComposition(element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().parent(), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }));
						});

						element.parent().parent().after(button);
						if (GM_getValue('Auto') === 'true') button.click();

						let copy = $(copyButton)
						copy.css({ "margin": "8px 5px" });
						if (copyName === true) element.parent().parent().next().after(copy)
						copy.off('click').on('click', function () {
							let eltx = element.text().trim()
							let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
							let id = element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
							let info = `${id}, // ${name}`
							GM_setClipboard(info)
							copy.find('svg').replaceWith(tickIcon)
							setTimeout(function () {
								copy.find('svg').replaceWith(copyIcon)
							}, 2000)
						})
					}
				};
			});

			// 配置观察器
			observer.observe(element.get(0), {
				childList: true,
				subtree: true,
				characterData: true
			});

			// 清理观察器的函数
			element.data('observer', observer);
		}
	});

	// 2022版评论
	waitForKeyElements("div.content-warp div.user-info div.user-name[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-user-id"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-user-id")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2022版子评论
	waitForKeyElements("div > div.sub-user-info div.sub-user-name[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-user-id"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-user-id")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2022版含@的评论
	waitForKeyElements("span a.jump-link.user[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-user-id"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-user-id")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2022版用户卡片
	waitForKeyElements("div.user-card div.card-content div.card-user-info a.card-user-name", (element) => {
		if (element && element.length > 0 && element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let button = $(checkButton)
			element.parent().parent().after(button);
			button.css({ "margin": "8px 5px" });
			button.one('click', function () {
				checkComposition(element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().parent(), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }))
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			copy.css({ "margin": "8px 5px" });
			if (copyName === true) element.parent().parent().next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 2022版动态用户卡片
	waitForKeyElements("div.bili-user-profile div.bili-user-profile-view div.bili-user-profile-view__info div.bili-user-profile-view__info__header a.bili-user-profile-view__info__uname", (element) => {
		if (element && element.length > 0 && element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let button = $(checkButton)
			let initialText = element.text().trim();

			if (element.parent().parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy"))
				element.parent().parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy").remove()

			element.parent().parent().parent().after(button);
			button.css({ "margin": "8px 5px" });
			button.one('click', function () {
				checkComposition(element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().parent().parent(), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }))
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.parent().parent().parent().next().after(copy)
			copy.css({ "margin": "8px 5px" });
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})

			// 可能只会有一个元素，所以监听用户名刷新
			element.on('DOMSubtreeModified', function () {
				let button = $(checkButton)
				let currentText = $(this).text().trim();
				if (currentText === initialText) return;

				initialText = currentText;
				if (element.parent().parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy"))
					element.parent().parent().parent().parent().find(".composition-checkable, .composition-checked, .composition-copy").remove()

				button.css({ "margin": "8px 5px" });
				button.off('click').one('click', function () {
					checkComposition(element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().parent().parent(), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }))
				})

				element.parent().parent().parent().after(button);
				if (GM_getValue('Auto') === 'true') button.click()

				let copy = $(copyButton)
				if (copyName === true) element.parent().parent().parent().next().after(copy)
				copy.css({ "margin": "8px 5px" });
				copy.off('click').on('click', function () {
					let eltx = element.text().trim()
					let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
					let id = element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
					let info = `${id}, // ${name}`
					GM_setClipboard(info)
					copy.find('svg').replaceWith(tickIcon)
					setTimeout(function () {
						copy.find('svg').replaceWith(copyIcon)
					}, 2000)
				})
			})
		}
	});

	// 旧版评论
	waitForKeyElements("div.reply-wrap > div > div.user a.name[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-usercard-mid"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-usercard-mid")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 旧版用户卡片
	waitForKeyElements("div.user-card div.info p.user a.name", (element) => {
		if (element && element.length > 0 && element.parent().parent().parent().find("a.like").attr("mid")) {
			let button = $(checkButton)
			element.parent().parent().parent().find("div.btn-box").after(button);
			button.css({ "margin": "8px 5px" });
			button.one('click', function () {
				checkComposition(element.parent().parent().parent().find("a.like").attr("mid"), "", element, button.find(".composition-name-control"), element.parent().parent().parent().find("div.btn-box"), (GM_getValue('Lite') === 'true' ? { "margin": "2px 0 10px 8px" } : { "margin": "0 0 10px" }))
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			copy.css({ "margin": "8px 5px" });
			if (copyName === true) element.parent().parent().parent().find("div.btn-box").next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.parent().parent().parent().find("a.like").attr("mid")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 用户中心 关注列表、粉丝列表
	waitForKeyElements("div.content a.title span.fans-name", (element) => {
		if (element && element.length > 0) {
			if (element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
				let button = $(checkButton)
				button.css({ "overflow": "hidden", "margin-bottom": "10px" });
				element.parent().after(button)
				button.one('click', function () {
					checkComposition(element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent(), { "overflow": "hidden", "margin-bottom": "10px" })
				})
				if (GM_getValue('Auto') === 'true') button.click()

				let copy = $(copyButton)
				copy.css({ "overflow": "hidden", "margin-bottom": "10px" });
				if (copyName === true) element.parent().next().after(copy)
				copy.on('click', function () {
					let eltx = element.text().trim()
					let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
					let id = element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
					let info = `${id}, // ${name}`
					GM_setClipboard(info)
					copy.find('svg').replaceWith(tickIcon)
					setTimeout(function () {
						copy.find('svg').replaceWith(copyIcon)
					}, 2000)
				})
			}
		}
	});

	// 旧版包含@的评论
	waitForKeyElements("div.reply-wrap > div > p.text a[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-usercard-mid"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-usercard-mid")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 旧版 回复、纯@评论
	waitForKeyElements("span.text-con a[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-usercard-mid"), "", element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr("data-usercard-mid")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 用户搜索结果
	waitForKeyElements("li.user-item div.info-wrap div.headline a[href]", (element) => {
		if (element && element.length > 0 && element.attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let button = $(checkButton)
			element.parent().children().last().after(button)
			button.one('click', function () {
				checkComposition(element.attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], "", element, button.find(".composition-name-control"), element.parent().children().last(), '')
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.parent().children().last().after(copy)
			copy.on('click', function () {
				let eltx = element.text().trim()
				let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx
				let id = element.attr('href').match(/space\.bilibili\.com\/(\d+)/)[1]
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})
		}
	});

	// 直播间弹幕列表评论
	waitForKeyElements("div.chat-items div.chat-item", (element) => {
		if (element && element.length > 0) {
			let point = $(`<span class="chat-item">👆</span>`)
			element.after(point)
			let button = $(checkButton)
			element.next().after(button)
			button.one('click', function () {
				checkComposition(element.attr("data-uid"), element.attr("data-uname"), element, button.find(".composition-name-control"), element, '')
				point.remove()
			})
			if (GM_getValue('Auto') === 'true') button.click()

			let copy = $(copyButton)
			if (copyName === true) element.next().next().after(copy)
			copy.on('click', function () {
				let name = element.attr("data-uname")
				let id = element.attr("data-uid")
				let info = `${id}, // ${name}`
				GM_setClipboard(info)
				copy.find('svg').replaceWith(tickIcon)
				setTimeout(function () {
					copy.find('svg').replaceWith(copyIcon)
				}, 2000)
			})

			// 众生平等，删掉除了名字和文本之外的元素
			// element.find('.danmaku-item-left').children(':not(.common-nickname-wrapper, .action, [class*="gift-"], [class^="composition"])').remove();
			// element.children(':not(.common-nickname-wrapper, .action, [class*="danmaku-item-"], [class*="gift-"], [class*="dp-i"], [class^="composition"])').remove();
		}
	});

	// 移除掉不显示内容的 .level-link 来确保评论与按钮的间隔正常
	waitForKeyElements("a.level-link", (element) => {
		if (element.attr('href') && element.attr('href').includes('help.html') && element.find('img').length === 0) {
			element.remove();
		}
	})

	let dn

	// 添加标签
	function installComposition(rule, elemload, eleminst, elemcss) {
		let badge = $(`<div class="composition-checked" title="${!rule.sure ? '（此成分可能是误判，请注意判别）' : ""}此图标为“${rule.displayName}”，标记原因是${rule.reason}，点击查看已识别用户" style="${GM_getValue('Lite') === 'true' ? 'margin:2px 0 2px 8px!important;' : ""}${!rule.sure ? 'opacity:0.5!important' : ""}"><div class="composition-badge">
			<span class="composition-name" ${GM_getValue('Lite') === 'true' ? 'style="padding:0px!important;"' : ""}>${GM_getValue('Lite') === 'true' ? "" : rule.displayName}</span>
			${rule.displayIcon ? (
				rule.displayIcon.match("https:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${rule.displayIcon}" class="composition-icon" ${GM_getValue('Lite') === 'true' ? 'style="margin-right:-6px!important;"' : ""}>` :
					rule.displayIcon.match("http:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${rule.displayIcon}" class="composition-icon" ${GM_getValue('Lite') === 'true' ? 'style="margin-right:-6px!important;"' : ""}>` :
						rule.displayIcon.match("data:") ? `<img src="${rule.displayIcon}" class="composition-icon" ${GM_getValue('Lite') === 'true' ? 'style="margin-right:-6px!important;"' : ""}>` :
							`<span class="composition-icon" ${GM_getValue('Lite') === 'true' ? 'style="margin-right:-6px!important;"' : ""}>${rule.displayIcon}</span>`
			) : ''}
			</div></div>`)
		badge.on('click', function () {
			showAllUser()
		})
		if (elemcss) badge.css(elemcss);
		if (eleminst) eleminst.after(badge);
		elemload.parent().parent().remove();
	}

	// 检查标签
	function checkComposition(id, elemname, element, elemload, eleminst, elemcss) {
		// 用户名称获取
		let eltx = element.text().trim()
		let name = elemname || (eltx.charAt(0) == "@" ? eltx.substring(1) : eltx)

		elemload.text('…')
		elemload.attr('title', '正在查询中，等下吧...')

		if (checked[id] != undefined) {
			let found = checked[id]
			if (found.length > 0) {
				for (let rule of found) {
					installComposition(rule, elemload, eleminst, elemcss)
				}
				console.log(`【（改）B站成分检测器】缓存\n检测到 ${name} ${id} 的成分为\n`, found.map(it => ({ name: it.displayName, reason: it.reason, sure: it.sure, item: it.item, keyword: it.keyword, uid: it.uid, full: it.full })))
			} else {
				console.log(`【（改）B站成分检测器】缓存\n检测到 ${name} ${id} 的成分为 无`)
				elemload.parent().parent().attr('class', 'composition-checked');
				elemload.text('无')
				elemload.attr('title', '点击查看已查询过的用户')
				elemload.on('click', function () {
					showAllUser()
				})
			}
		} else if (checking[id] != undefined) {
			if (checking[id].indexOf(element) < 0)
				checking[id].push({
					element: element,
					elemload: elemload,
					eleminst: eleminst,
					elemcss: elemcss,
				});
		} else {
			checking[id] = [{
				element: element,
				elemload: elemload,
				eleminst: eleminst,
				elemcss: elemcss
			}];
			detectComposition(id, name)
				.then((found) => {
					if (found.length > 0) {
						value = found.map(it => ({
							name: it.displayName,
							img: it.displayIcon,
							reason: it.reason,
							sure: it.sure,
							item: it.item,
							keyword: it.keyword,
							uid: it.uid,
							full: it.full
						}))
						dom += `
						<div style="margin-top: 25px">
							<div style="margin:0;font-size:large;">${name}</div>
							<div id="tips" style="color: #fb7299;font-size:medium;"><a href="https://space.bilibili.com/${id}/" target="_blank" style="color: #fb7299;">UID ${id}</a></div>
							`;
						for (let i = 0; i < value.length; i++) {
							let reason = value[i].keyword || value[i].uid
							let icon = value[i].img ? (
								value[i].img.match("https:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${value[i].img}" class="composition-icon">` :
									value[i].img.match("http:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${value[i].img}" class="composition-icon">` :
										value[i].img.match("data:") ? `<img src="${value[i].img}" class="composition-icon">` :
											`<span class="composition-icon">${value[i].img}</span>`
							) : ''
							dom += `
							<div style="margin-top: 10px;">
								<div class="composition-badge" style="cursor: default!important;">
									<span class="composition-name">${value[i].name}</span>
									${icon}
								</div>
								<div style="margin-top: 8px;">
									${!value[i].sure ? '<div class="composition-name">此成分可能是误判，请注意判别</div>' : ''}
									<div class="composition-name">原因：${value[i].reason}</div>
									<div class="composition-name">匹配：${reason}</div>
									${typeof value[i].item === 'string' ? '<div class="composition-name">内容：' + value[i].item + '</div>' : ''}
								</div>
							</div>`;
						}
						dom += `</div>`

						let displayNameSet = new Set();
						found = found.filter(item => {
							if (displayNameSet.has(item.displayName)) {
								return false;
							} else {
								displayNameSet.add(item.displayName);
								return true;
							}
						});

						// 给所有用到的地方添加标签
						if (found.length > 0) found.reverse();
						for (let elements of checking[id]) {
							if (found.length > 0) {
								for (let rule of found) {
									installComposition(rule, elements.elemload, elements.eleminst, elements.elemcss);
								}
							} else {
								elements.elemload.parent().parent().attr('class', 'composition-checked');
								elements.elemload.text('无');
								elements.elemload.attr('title', '点击查看已查询过的用户');
								elements.elemload.on('click', function () {
									showAllUser();
								});
							}
						}
					} else {
						for (let elements of checking[id]) {
							elements.elemload.parent().parent().attr('class', 'composition-checked');
							elements.elemload.text('无');
							elements.elemload.attr('title', '点击查看已查询过的用户');
							elements.elemload.on('click', function () {
								showAllUser();
							});
						}
					}
					delete checking[id];
					checked[id] = found
				})
				.catch((error) => {
					if (debug) console.error(`【（改）B站成分检测器】即时\n检测 ${name} ${id} 的成分失败`, error);
					for (let elements of checking[id]) {
						elements.elemload.text('重试')
						elements.elemload.attr('title', '点击重新查询此用户成分')
						elements.elemload.parent().parent().one('click', function () {
							checkComposition(id, name, elements.element, elements.elemload, elements.eleminst, elements.elemcss)
						})
					}
					delete checking[id];
				});
		}
	}
	dom = `<div>
	<div id="tips">因判断关键词较为广泛，可能会出现误杀的现象</div>
	<div id="tips">脚本还在测试阶段，喜欢的话还请留下你的评论</div>
	<div id="tips">Ctrl+F 可以快速在本页中搜索内容</div>
	${dom}</div>`;
	function showAllUser() {
		Swal.fire({
			title: '已识别用户',
			html: dom,
			icon: 'info',
			heightAuto: false,
			scrollbarPadding: false,
			showCloseButton: true,
			confirmButtonText: '关闭'
		})
	}

	GM_registerMenuCommand("查看已检查的用户", () => {
		showAllUser();
	});
	GM_registerMenuCommand("手动输入 ID 检查", () => {
		uidChecker();
	});

	GM_registerMenuCommand("慢速点击已有按钮(少触发风控,不适用新版评论)", () => {
		let timeout = 2000 + (Math.floor(Math.random() * 2000) + 1);
		let count = 0;
		$('.composition-checkable').each(function () {
			let element = $(this);
			count++;
			setTimeout(function () {
				element.click();
			}, count * timeout);
		});
	});

	GM_registerMenuCommand("快速点击已有按钮(易触发风控,不适用新版评论)", () => {
		let timeout = 1000;
		let count = 0;
		$('.composition-checkable').each(function () {
			let element = $(this);
			count++;
			setTimeout(function () {
				element.click();
			}, count * timeout);
		});
	});

	function request(option) {
		return new Promise((resolve, reject) => {
			let httpRequest = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;
			httpRequest({
				method: 'get',
				...option,
				onload: (response) => {
					let res
					try {
						res = JSON.parse(response.responseText);
					} catch (e) {
						res = response.response;
					}
					resolve(res);
				},
				onerror: (error) => {
					reject(error);
				},
			});
		});
	}

	function setting(conf_name, tips) {
		if (GM_getValue(conf_name) === 'true') {
			GM_setValue(conf_name, 'false');
			message.info(`已禁用 ${tips}<br/>新内容已生效，旧内容刷新后生效。`, true);
		} else {
			GM_setValue(conf_name, 'true');
			message.info(`已启用 ${tips}<br/>新内容已生效，旧内容刷新后生效。`, true);
		}
	}

	function uidChecker() {
		// 用户卡片Api
		const cardApiUrl = 'https://api.bilibili.com/x/web-interface/card?mid='
		Swal.fire({
			title: '成分检测',
			imageUrl: 'https://www.bilibili.com/favicon.ico',
			imageAlt: `哔哩哔哩 干杯~`,
			imageWidth: 40,
			imageHeight: 40,
			input: 'number',
			inputAttributes: {
				autocapitalize: 'off'
			},
			allowOutsideClick: false,
			showCloseButton: true,
			confirmButtonText: '确定并查询',
			showLoaderOnConfirm: true,
			heightAuto: false,
			scrollbarPadding: false,
			text: '请输入要查询的 UID 号码',
			preConfirm: (uid) => {
				return new Promise(async (resolve) => {
					// 获取用户卡片
					try {
						if (!uid) throw new CodeError("请输入完整的用户 UID")
						let cardRequest = await request({
							url: cardApiUrl + uid,
							headers: {
								"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
								"referer": "https://www.bilibili.com",
								"cookies": {
									"buvid3": generateBuvid3(),
								},
							},
						});
						let cardContent = cardRequest;
						if (cardContent && cardContent.code !== undefined) {
							if (cardContent.code === 0) {
								let card = cardContent.data.card
								detectComposition(card.mid, card.name)
									.then((found) => {
										let result = {
											mid: card.mid,
											name: card.name,
											level: card.level_info.current_level,
											face: card.face,
											sign: card.sign ? card.sign : '',
											official_title: card.Official.title ? card.Official.title : '',
											official_desc: card.Official.desc ? card.Official.desc : '',
											official_role: card.Official.role !== 0 ? (
												card.Official.role === 1 ? '个人认证 - 知名UP主' : card.Official.role === 2 ? '个人认证 - 大V达人' : card.Official.role === 3 ? '机构认证 - 企业' : card.Official.role === 4 ? '机构认证 - 组织' : card.Official.role === 5 ? '机构认证 - 媒体' : card.Official.role === 6 ? '机构认证 - 政府' : card.Official.role === 7 ? '个人认证 - 高能主播' : card.Official.role === 9 ? '个人认证 - 社会知名人士' : '未知认证角色(' + card.Official.role + ')'
											) : '',
											official_type: card.Official.type !== -1 ? (
												card.Official.type === 0 ? 'UP主认证' : card.Official.type === 1 ? '机构认证' : '未知认证类型(' + card.Official.type + ')'
											) : '',
											vip: card.vip.vipType !== 0 ? (
												card.vip.vipType === 1 ? '月度大会员' : card.vip.vipType === 2 ? '年度大会员(或以上)' : '未知会员(' + card.vip.vipType + ')'
											) : '',
											found: found.map(it => ({
												name: it.displayName,
												img: it.displayIcon,
												reason: it.reason,
												sure: it.sure,
												item: it.item,
												keyword: it.keyword,
												uid: it.uid,
												full: it.full
											}))
										}
										resolve(result)
									})
									.catch(error => {
										throw error
									})
							} else {
								throw new CodeError(`获取用户信息失败，错误码：${cardContent.code}`)
							}
						} else {
							throw new CodeError(`获取用户信息失败`)
						}
					} catch (error) {
						resolve(null);
						Swal.showValidationMessage(`失败: ${error}`)
					}
				})
			},
		}).then((result) => {
			if (result.value) {
				let info = result.value
				let value = result.value.found;
				let final = '';
				for (let i = 0; i < value.length; i++) {
					let reason = value[i].keyword || value[i].uid
					let icon = value[i].img ? (
						value[i].img.match("https:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${value[i].img}" class="composition-icon">` :
							value[i].img.match("http:") ? `<img referrer="no-referrer" referrerPolicy="no-referrer" src="${value[i].img}" class="composition-icon">` :
								value[i].img.match("data:") ? `<img src="${value[i].img}" class="composition-icon">` :
									`<span class="composition-icon">${value[i].img}</span>`
					) : ''
					final += `
					<div style="margin-top: 25px;">
						<div class="composition-badge">
							<span class="composition-name">${value[i].name}</span>
							${icon}
						</div>
						<div style="margin-top: 12px;">
							${!value[i].sure ? '<div class="composition-name">此成分可能是误判，请注意判别</div>' : ''}
							<div class="composition-name">原因：${value[i].reason}</div>
							<div class="composition-name">匹配：${reason}</div>
							${typeof value[i].item === 'string' ? '<div class="composition-name">内容：' + value[i].item + '</div>' : ''}
						</div>
					</div>`;
				}
				Swal.fire({
					title: info.name,
					imageUrl: info.face,
					imageAlt: `${info.name}的头像`,
					imageWidth: 200,
					imageHeight: 200,
					html: `<div>
							<div id="tips">${info.sign}</div>
							<br/>
							<div id="tips" style="color: #fb7299;">LV${info.level}</div>
							<div id="tips" style="color: #fb7299;"><a href="https://space.bilibili.com/${info.mid}/" target="_blank" style="color: #fb7299;">UID ${info.mid}</a></div>
							<div id="tips" style="color: #fb7299;">${info.vip}</div>
							<br/>
							<div id="tips" style="color: #ffd700;">${info.official_type}</div>
							<div id="tips" style="color: #ffd700;">${info.official_role}</div>
							<div id="tips" style="color: #ffd700;">${info.official_title}</div>
							<div id="tips" style="color: #ffd700;">${info.official_desc}</div>
							<br/>
							<div id="tips">因判断关键词较为广泛，可能会出现识别错误的现象<br/>脚本还在测试阶段，喜欢的话还请留下你的评论</div>
							${final}
						</div>`,
					allowOutsideClick: false,
					showCloseButton: true,
					showConfirmButton: false,
					heightAuto: false,
					scrollbarPadding: false,
				})
			}
		})
	}

	if (GM_getValue('Reply') === 'true') {
		GM_registerMenuCommand('查询用户历史评论(AICU数据库)：✅ 已启用', function () {
			setting('Reply', '查询用户历史评论')
		});
	} else {
		GM_registerMenuCommand('查询用户历史评论(AICU数据库)：❌ 已禁用', function () {
			setting('Reply', '查询用户历史评论')
		});
	}

	if (GM_getValue('Lite') === 'true') {
		GM_registerMenuCommand('隐藏用户成分名称(仅显示图片)：✅ 已启用', function () {
			setting('Lite', '隐藏用户成分名称')
		});
	} else {
		GM_registerMenuCommand('隐藏用户成分名称(仅显示图片)：❌ 已禁用', function () {
			setting('Lite', '隐藏用户成分名称')
		});
	}

	if (GM_getValue('Auto') === 'true') {
		GM_registerMenuCommand('自动检测用户成分(易触发风控)：✅ 已启用', function () {
			setting('Auto', '自动检测用户成分')
		});
	} else {
		GM_registerMenuCommand('自动检测用户成分(易触发风控)：❌ 已禁用', function () {
			setting('Auto', '自动检测用户成分')
		});
	}

	function addStyle(id, tag, css) {
		tag = tag || 'style';
		let doc = document, styleDom = doc.getElementById(id);
		if (styleDom) styleDom.remove();
		let style = doc.createElement(tag);
		style.rel = 'stylesheet';
		style.id = id;
		tag === 'style' ? style.innerHTML = css : style.href = css;
		$('body').before(style);
	}


	function addCheckerStyle(text) {
		let color = "#574AB8";

		let swalcss = `
			.swal2-styled{transition: all 0.2s ease;}
			.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:${color} transparent }
			.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:${color};color:#fff;font-size:1em}
			.swal2-styled.swal2-confirm:hover,.swal2-styled.swal2-deny:hover{opacity:0.8;background-image:none!important}
			.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px ${color}80}
			.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px #dc374180}
			.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}
			.swal2-timer-progress-bar{width:100%;height:.25em;background:${color}33 }
			.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:${color};color:#fff;line-height:2em;text-align:center}
			.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:${color} }
			.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:${color}}
			.swal2-popup {padding:1.25em 0 1.25em;flex-direction:column}
			.swal2-close {position:absolute;top:1px;right:1px;transition: all 0.2s ease;}
			div:where(.swal2-container) .swal2-html-container{padding: 1.3em 1.3em 0.3em;}
			div:where(.swal2-container) button:where(.swal2-close):hover {color:${color}!important;font-size:60px!important}
			div:where(.swal2-icon) .swal2-icon-content {font-family: sans-serif;}
			.swal2-container {z-index: 1145141919810;}
			`;
		let bilicss = `
			[class^="composition-c"] {
				display: inline-block !important;
				cursor: pointer !important;
			}

			.composition-name-control svg {
				vertical-align: middle !important;
			}

			.composition-badge {
				display: inline-flex !important;
 				justify-content: center !important;
 				align-items: center !important;
				width: fit-content !important;
 				background: ${color}25 !important;
 				border-radius: 10px !important;
 				margin: 0 6px 0 6px !important;
 				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
				font-weight: normal !important;
				cursor: pointer !important;
			}

			.composition-name {
 				line-height: 13px !important;
 				font-size: 13px !important;
				color: ${color} !important;
				padding: 2px 8px !important;
			}

			.composition-icon {
				color: ${color} !important;
				background: transparent !important;
				border-radius: 50% !important;
				width: 25px !important;
				height: 25px !important;
				border: 2px solid ${color}80 !important;
				margin: -6px !important;
				margin-right: 6px !important;
				display: flex !important;
				justify-content: center !important;
				align-items: center !important;
				font-size: 20px !important;
			}

			.composition-badge-control {
				display: inline-flex !important;
				justify-content: center !important;
				align-items: center !important;
				width: fit-content !important;
				background: #574AB830 !important;
				border-radius: 10px !important;
				margin: 0 0 0 6px !important;
				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
			}

			.composition-name-control {
				line-height: 13px !important;
				font-size: 12px !important;
				color: #7367F0 !important;
				padding: 2px 8px !important;
			}

			/* 调整下评论中的粉丝勋章部分，防止按不到按钮 */
			.sailing {
				z-index: -1 !important;
			}
			`;
		if (text === true) return bilicss;

		// 先监听颜色方案变化 SweetAlert2-Default
		window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
			if (e.matches) {
				// 切换到暗色主题
				addStyle('swal-pub-style', 'style', GM_getResourceText('SwalDark'));
			} else {
				// 切换到浅色主题
				addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
			}
		});

		// 再修改主题 SweetAlert2-Default
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			// 切换到暗色主题
			addStyle('swal-pub-style', 'style', GM_getResourceText('SwalDark'));
		} else {
			// 切换到浅色主题
			addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
		}
		addStyle('SweetAlert2-User', 'style', swalcss);
		addStyle('BiliChecker-Style', 'style', bilicss);
	};

	// 准备好右上角的Toast提示
	async function toast(type = 'success', text, refreshOnClick = false) {
		let dialog = await Swal.mixin({
			toast: true,
			position: 'bottom-start',
			showConfirmButton: refreshOnClick,
			confirmButtonText: '刷新',
			showCloseButton: true,
			timer: 5000,
			scrollbarPadding: true,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);

			}
		}).fire({ html: `<span>${text}</span>`, icon: type })
		if (dialog.isConfirmed && refreshOnClick) {
			window.location.reload(); // 刷新
		}
	}

	// 提示信息
	const message = {
		success: (text, refresh = false) => {
			toast('success', text, refresh)
		},
		error: (text, refresh = false) => {
			toast('error', text, refresh)
		},
		warning: (text, refresh = false) => {
			toast('warning', text, refresh)
		},
		info: (text, refresh = false) => {
			toast('info', text, refresh)
		},
		question: (text, refresh = false) => {
			toast('question', text, refresh)
		}
	};


	class CodeError extends Error {
		constructor(message) {
			super(message);
			this.name = '';
		}
	}

	function generateBuvid3() {
		const uuid = () => {
			return 'xxxxxx'.replace(/[x]/g, function () {
				return Math.floor(Math.random() * 16).toString(16);
			});
		};
		const randomInt = Math.floor(Math.random() * 99999) + 1;
		const buvid3 = `${uuid()}${randomInt.toString().padStart(5, '0')}infoc`;
		return buvid3;
	}

	function detectComposition(id, name) {
		return new Promise(async (resolve, reject) => {
			try {
				// 空间动态Api
				const dynamicApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid='
				const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='
				const replyApiUrl = 'https://api.aicu.cc/api/v3/search/getreply?uid='
				// 存储检测结果的数组
				let found = [];
				// 存储错误的数组
				let errors = [];

				// 设定请求
				async function followingRequest() {
					let currentPage = 1, maxPages = 2, pageSize, totalPages, totalFollowings, fetchedFollowings = [];
					while (true) {
						try {
							console.log(`【（改）B站成分检测器】即时\n正在获取 ${name} ${id} 关注列表的第 ${currentPage} 页`);

							// 发起请求
							let followingContent = await request({
								url: `${followingApiUrl}${id}&pn=${currentPage}`,
								headers: {
									'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
								},
							});

							if (followingContent && followingContent.code !== undefined) {
								if (followingContent.code === 0) {
									let following = followingContent.data.list.map(it => it.mid);
									fetchedFollowings = fetchedFollowings.concat(following);

									if (currentPage === 1) {
										totalFollowings = followingContent.data.total; // 获取关注总数
										if (totalFollowings === 0) break; // 啥都没关注时，直接结束
										pageSize = followingContent.data.list.length; // 获取每页数量
										totalPages = Math.min(Math.ceil(totalFollowings / pageSize), maxPages);// 先得到 大致页数 并与 最多可获取页数 对比然后取其中最小数
										if (totalPages === 1) break; // 只有一页时，直接结束
									}
									if (currentPage >= totalPages) break; // 达到最大页数时结束
									currentPage++; // 获取下一页
								} else if (followingContent.code === 22115) {
									console.warn(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表失败，对方已关闭展示关注列表，错误码：${followingContent.code}`);
									break;
								} else if (followingContent.code === -352) {
									console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表的第 ${currentPage} 页失败，已触发哔哩哔哩风控，错误码：${followingContent.code}`);
									errors.push(new CodeError(`获取关注列表的第 ${currentPage} 页失败，已触发哔哩哔哩风控，错误码：${followingContent.code}`));
									break;
								} else {
									if (fetchedFollowings.length > 0) {
										if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表的第 ${currentPage} 页失败，错误码：${followingContent.code}`);
									} else {
										errors.push(new CodeError(`获取关注列表的第 ${currentPage} 页失败，错误码：${followingContent.code}`));
									}
								}
							} else {
								if (fetchedFollowings.length > 0) {
									if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表的第 ${currentPage} 页失败`);
								} else {
									errors.push(new CodeError(`获取关注列表的第 ${currentPage} 页失败`));
								}
							}
						} catch (error) {
							console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表的第 ${currentPage} 页时发生错误`, error);
							errors.push(error);
						}
					}
					return fetchedFollowings;
				}

				// 设定请求
				async function dynamicRequest() {
					let currentPage = 1, maxPages = 2, offset, fetchedDynamics = [];
					while (true) {
						try {
							console.log(`【（改）B站成分检测器】即时\n正在获取 ${name} ${id} 空间动态的第 ${currentPage} 页`);

							// 发起请求
							let dynamicContent = await request({
								url: `${dynamicApiUrl}${id}${offset ? ('&offset=' + offset) : ""}`,
								headers: {
									"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
									"referer": "https://www.bilibili.com"
								},
							});

							if (dynamicContent && dynamicContent.code !== undefined) {
								if (dynamicContent.code === 0) {
									let items = dynamicContent.data.items;
									fetchedDynamics = fetchedDynamics.concat(items);

									offset = dynamicContent.data.offset; // 更新下一页的 offset

									// 是否有更多内容或者已达到最大页数
									if (!dynamicContent.data.has_more || currentPage >= maxPages) {
										break;
									}

									currentPage++; // 获取下一页
								} else if (dynamicContent.code === -352) {
									console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 空间动态的第 ${currentPage} 页失败，已触发哔哩哔哩风控，错误码：${dynamicContent.code}`);
									throw new CodeError(`获取空间动态的第 ${currentPage} 页失败，已触发哔哩哔哩风控，错误码：${dynamicContent.code}`);
								} else {
									if (found.length > 0) {
										if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 空间动态的第 ${currentPage} 页失败，错误码：${dynamicContent.code}`);
									} else {
										throw new CodeError(`获取空间动态的第 ${currentPage} 页失败，错误码：${dynamicContent.code}`);
									}
								}
							} else {
								if (found.length > 0) {
									if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 空间动态的第 ${currentPage} 页失败`);
								} else {
									throw new CodeError(`获取空间动态的第 ${currentPage} 页失败`);
								}
								break;
							}
						} catch (error) {
							if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 空间动态的第 ${currentPage} 页失败`, error);
							errors.push(error);
							break;
						}
					}
					return fetchedDynamics;
				}

				async function replyRequest() {
					let currentPage = 1, maxPages = 1, pageSize = 50, totalPages, totalReplys, fetchedReplys = [];
					while (true) {
						try {
							console.log(`【（改）B站成分检测器】即时\n正在获取 ${name} ${id} 历史评论的第 ${currentPage} 页`);

							// 发起请求
							let replyContent = await request({
								url: `${replyApiUrl}${id}&pn=${currentPage}&ps=${pageSize}&mode=0`,
								headers: {
									'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
								},
							});

							if (replyContent && replyContent.code !== undefined) {
								if (replyContent.code === 0) {
									let items = replyContent.data.replies;
									let cursor = replyContent.data.cursor;
									fetchedReplys = fetchedReplys.concat(items);

									if (currentPage === 1) {
										totalReplys = cursor.all_count;
										if (totalReplys === 0) break; // 啥都没评论时，直接结束
										totalPages = Math.min(Math.ceil(totalReplys / pageSize), maxPages);// 先得到 大致页数 并与 最多可获取页数 对比然后取其中最小数
										if (totalPages === 1 || cursor.is_end) break; // 只有一页或者达到最大页数时，直接结束
									}
									if (currentPage >= totalPages || cursor.is_end) break; // 达到最大页数时结束
									currentPage++; // 获取下一页
								} else {
									if (fetchedReplys.length > 0) {
										if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 历史评论的第 ${currentPage} 页失败，错误码：${replyContent.code}`);
									} else {
										errors.push(new CodeError(`获取历史评论的第 ${currentPage} 页失败，错误码：${replyContent.code}`));
									}
								}
							} else {
								if (fetchedReplys.length > 0) {
									if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 历史评论的第 ${currentPage} 页失败`);
								} else {
									errors.push(new CodeError(`获取历史评论的第 ${currentPage} 页失败`));
								}
								break;
							}
						} catch (error) {
							console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 历史评论的第 ${currentPage} 页时发生错误`, error);
							errors.push(error);
						}
					}
					return fetchedReplys;
				}

				console.log(`【（改）B站成分检测器】即时\n正在检查用户 ${name} ${id} 的成分...`);
				if (dn) return resolve([]);

				// 检查用户是否在黑名单中
				try {
					for (let rule of checkers) {
						if (rule.blacklist) {
							for (let mid of rule.blacklist) {
								mid = mid.toString()
								if (id === mid) {
									found.push({
										...rule,
										reason: `黑名单`,
										sure: true,
										keyword: "uid" + mid
									});
								}
							}
						}
					}
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 是否在命中名单失败`, error);
					errors.push(error);
				}

				// 检查关注列表
				try {
					let following = await followingRequest();
					for (let rule of checkers) {
						if (rule.followings) {
							for (let mid of rule.followings) {
								// 直接比较 mid 和 following 中的值
								if (following.some(f => f === mid)) {
									found.push({
										...rule,
										uid: "uid" + mid,
										sure: true,
										reason: `关注列表`
									});
								}
							}
						}
					}
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 关注列表失败`, error);
					errors.push(error);
				}


				// 检查动态内容
				try {
					let dynamic = await dynamicRequest();
					let dynamicFound = [];
					for (let rule of checkers) {
						if (rule.keywords) {
							for (let i = 0; i < dynamic.length; i++) {
								let item = dynamic[i]
								let text = item.modules?.module_dynamic?.desc?.text;
								let videoTitle = item.modules?.module_dynamic?.major?.archive?.title;
								let videoDesc = item.modules?.module_dynamic?.major?.archive?.desc;
								let orig = item.orig?.modules?.module_dynamic?.desc?.text;
								let origName = item.orig?.modules?.module_author?.name;

								let matchedRule = null;
								let matchedContent = null;
								let matchedSure = null;
								let matchedReason = '';

								// 检测内容
								if (text && rule.keywords.find(keyword => text.includes(keyword))) {
									matchedRule = rule;
									matchedContent = text;
									matchedSure = true;
									matchedReason = `空间动态内容`;
								}

								// 检测转发
								if (orig && rule.keywords.find(keyword => orig.includes(keyword))) {
									matchedRule = rule;
									matchedContent = `${origName} - ${orig}`;
									matchedSure = checkers[0].keywords ? (checkers[0].keywords.find(keyword => orig.includes(keyword))) : false;
									matchedReason = `空间动态转发`;
								}

								// 检测视频标题
								if (videoTitle && rule.keywords.find(keyword => videoTitle.includes(keyword))) {
									matchedRule = rule;
									matchedContent = videoTitle;
									matchedSure = true;
									matchedReason = `空间动态视频标题`;
								}

								// 检测视频简介
								if (videoDesc && rule.keywords.find(keyword => videoDesc.includes(keyword))) {
									matchedRule = rule;
									matchedContent = videoDesc;
									matchedSure = true;
									matchedReason = `空间动态视频简介`;
								}

								if (rule.keywordsReverse) {
									// 检测内容
									if (text && rule.keywordsReverse.find(keyword => text.includes(keyword))) {
										continue;
									}
									// 检测转发
									if (orig && rule.keywordsReverse.find(keyword => orig.includes(keyword))) {
										continue;
									}
									// 检测视频标题
									if (videoTitle && rule.keywordsReverse.find(keyword => videoTitle.includes(keyword))) {
										continue;
									}
									// 检测视频简介
									if (videoDesc && rule.keywordsReverse.find(keyword => videoDesc.includes(keyword))) {
										continue;
									}
								}

								if (matchedRule) {
									dynamicFound.push({
										...matchedRule,
										full: item,
										reason: matchedReason,
										sure: matchedSure,
										item: matchedContent,
										keyword: matchedRule.keywords ? matchedRule.keywords.find(keyword => matchedContent.includes(keyword)) : "无"
									});
								}
							}
						}
					}
					let countMap = {}, finalFound = [];
					// 先统计好重复出现次数
					dynamicFound.forEach(found => {
						let item = found.item;
						countMap[item] = (countMap[item] || 0) + 1;
					});
					// 过滤伪成分
					dynamicFound.forEach(found => {
						let item = found.item;
						if ((countMap[item] >= 5 && item.includes("、")) || countMap[item] > 8) {
							finalFound.push({
								...checkerSpecial[0],
								full: found.full,
								item: found.item,
								sure: false,
								keyword: `${found.displayName} - ${found.keyword}`
							})
						} else {
							finalFound.push(found);
						}
					});
					found.push(...finalFound);
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 空间动态失败`, error);
					errors.push(error);
				}

				// 检查历史评论
				if (GM_getValue('Reply') === 'true') try {
					let reply = await replyRequest();
					let replyFound = [];
					for (let rule of checkers) {
						if (rule.keywords) {
							for (let i = 0; i < reply.length; i++) {
								let item = reply[i]
								let text = item.message;
								let orig = item.dyn?.oid;
								let root = item.parent?.rootid || item.rpid;

								let matchedRule = null;
								let matchedContent = null;
								let matchedReason = '';

								// 检测内容
								if (text && rule.keywords.find(keyword => text.includes(keyword))) {
									matchedRule = rule;
									matchedContent = text;
									matchedReason = `视频(av${orig})中的历史评论(id#${root})`;
								}

								if (rule.keywordsReverse) {
									// 检测内容
									if (text && rule.keywordsReverse.find(keyword => text.includes(keyword))) {
										continue;
									}
								}

								if (matchedRule) {
									replyFound.push({
										...matchedRule,
										full: item,
										reason: matchedReason,
										sure: false,
										item: matchedContent,
										keyword: matchedRule.keywords ? matchedRule.keywords.find(keyword => matchedContent.includes(keyword)) : "无"
									});
								}
							}
						}
					}
					found.push(...replyFound);
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 历史评论失败`, error);
					errors.push(error);
				}

				if (found.length > 0) {
					// 先按原始排序（按照 checkers 列表来排序）
					found.sort((a, b) => {
						const indexA = checkers.findIndex(c => c.displayName === a.displayName);
						const indexB = checkers.findIndex(c => c.displayName === b.displayName);
						return indexA - indexB;
					});

					let notReply = found.filter(item => !item.reason.includes("评论"));
					let isReply = found.filter(item => item.reason.includes("评论"));

					// 再按出现次数排序（成分相关程度越高越靠前）
					let nameCount = {};
					notReply.forEach(item => {
						nameCount[item.displayName] = (nameCount[item.displayName] || 0) + 1;
					});
					notReply.sort((a, b) => nameCount[b.displayName] - nameCount[a.displayName]);

					found = [...notReply, ...isReply];

					console.log(`【（改）B站成分检测器】即时\n检测到 ${name} ${id} 的成分为\n`, found.map(it => ({ name: it.displayName, reason: it.reason, sure: it.sure, item: it.item, keyword: it.keyword, uid: it.uid, full: it.full })))
				} else if (errors.length > 0) {
					throw new CodeError(errors)
				}

				// 返回检测结果
				resolve(found);
			} catch (error) {
				if (debug) console.error(`【（改）B站成分检测器】即时\n检测 ${name} ${id} 的成分失败`, error);
				reject(error)
			}
		})
	}

	/*--- waitForKeyElements(): 一个实用函数，用于 Greasemonkey 脚本，
	它可以检测和处理AJAX加载的内容。
	此外，此函数还支持在使用 `shadowRoot` 的页面上运行。
	使用示例：
		base.waitForKeyElements (
			"div.comments"
			, commentCallbackFunction
		);
		// 页面特定的函数，用于在找到节点时执行我们想要的操作。
		function commentCallbackFunction (jNode) {
			jNode.text ("waitForKeyElements() 更改了这段注释。");
		}
	重要提示：这个函数需要你的脚本加载了jQuery。
	*/
	function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
		function findInShadowRoots(root, selector) {
			let elements = $(root).find(selector).toArray();
			$(root).find('*').each(function () {
				const shadowRoot = this.shadowRoot;
				if (shadowRoot) {
					elements = elements.concat(findInShadowRoots(shadowRoot, selector));
				}
			});
			return elements;
		}
		var targetElements;
		if (iframeSelector) {
			targetElements = $(iframeSelector).contents();
		} else {
			targetElements = $(document);
		}
		let allElements = findInShadowRoots(targetElements, selectorTxt);
		if (allElements.length > 0) {
			for (let element of allElements) {
				var jThis = $(element);
				var alreadyFound = jThis.data('alreadyFound') || false;
				if (!alreadyFound) {
					var cancelFound = actionFunction(jThis);
					if (cancelFound) {
						return false;
					} else {
						jThis.data('alreadyFound', true);
					}
				}
			};
		}
		var controlObj = waitForKeyElements.controlObj || {};
		var controlKey = selectorTxt.replace(/[^\w]/g, "_");
		var timeControl = controlObj[controlKey];
		if (allElements.length > 0 && bWaitOnce && timeControl) {
			clearInterval(timeControl);
			delete controlObj[controlKey];
		} else {
			if (!timeControl) {
				timeControl = setInterval(function () {
					waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
				}, 500);
				controlObj[controlKey] = timeControl;
			}
		}
		waitForKeyElements.controlObj = controlObj;
	}
})()
// 我们不反对游戏，我们反对的只是逆天人。