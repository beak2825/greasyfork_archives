// ==UserScript==
// @name        E-hentai tag
// @version     1.160219.1
// @author 17yard
// @description 将e绅士页面TAG换成中文
// @include     http://exhentai.org/g/*
// @include     http://g.e-hentai.org/g/*
// @run-at document-end
// @grant       none
// @icon        http://ww3.sinaimg.cn/large/5cf8ff8dgw1ehu56yclmpj20280283yb.jpg
// @namespace https://greasyfork.org/scripts/2975
// @downloadURL https://update.greasyfork.org/scripts/2976/E-hentai%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/2976/E-hentai%20tag.meta.js
// ==/UserScript==

(function() {
	//行名翻译数据库
	var rData={
	//行名
	"artist":"艺 术 家","female":"女 性","parody":"同 人","misc":"杂 项","group":"团 队","character":"角 色","male":"男 性","language":"语 言"
	}
	//TAG翻译数据库
	var tData={
	//艺术家
	"oouso":"大嘘","korie riko":"捆枝りこ","peko":"ぺこ","akaza":"あかざ","ishikei":"石惠","happoubi jin":"八宝备仁(はっぽうび じん)","kizuki aruchu":"鬼月あるちゅ","harumi chihiro":"晴见千寻(ハルミチヒロ)",
	//语言和色彩类
	"chinese":"中文本","translated":"翻译本","Italian":"意大利文","english":"英文","portuguese":"葡萄牙文","french":"法文","full color":"全彩本",
        //人物
        "reimu hakurei":"博丽灵梦[reimu hakurei]","marisa kirisame":"雾雨 魔理沙[marisa kirisame]","rumia":"露米娅[rumia]","cirno":"⑨[cirno]","daiyousei":"大妖精[daiyousei]","hong meiling":"红 美铃","patchouli knowledge":"帕秋莉·诺蕾姬[patchouli knowledge]","koakuma":"小恶魔[koakuma]","sakuya izayoi":"十六夜 咲夜[sakuya izayoi]","remilia scarlet":"蕾米莉亚·斯卡雷特(大小姐)[remilia scarlet]","flandre scarlet":"芙兰朵露·斯卡雷特[flandre scarlet]","letty whiterock":"蕾迪·霍瓦特罗克[letty whiterock]","chen":"橙",
	//外观类
	"small breasts":"小胸部[small breasts]","big breasts":"大胸部[big breasts]","huge breasts":"超级大胸部[huge breasts]","pantyhose":"连裤袜[pantyhose]","stockings":"长筒袜[stockings]","bloomers":"灯笼裤[bloomers]","glasses":"戴眼镜的[glasses]","exhibitionism":"暴露狂[exhibitionism]","breast expansion":"乳房膨胀[breast expansion]","swimsuit":"泳装[swimsuit]","leotard":"紧身衣[leotard]","lingerie":"女用贴身内衣裤[lingerie]","mind break":"失神或精神受创(嘿咻到失去意识或两眼无神，呆若木鸡，宛如死鱼者)[mind break]","ahegao":"アヘ颜=因高潮而崩坏的脸[ahegao]","drunk":"喝醉了的[drunk]","kimono":"和服[kimono]","yukata":"浴衣[yukata]","school swimsuit":"死库水[school swimsuit]","bikini":"比基尼[bikini]","apron":"围裙[apron]","big ass":"大屁股(至少有两个人头那么大)[big ass]","collar":"项圈(人类宠物带的项圈)[collar]","BDSM":"顺从(也就是SM啦~)[BDSM]","oppai loli":"巨乳萝莉[oppai loli]","tiara":"头饰[tiara]","crown":"皇冠[crown]","fisting":"拳交[fisting]","garter belt":"吊带袜[garter belt]","dark skin":"黑皮肤[dark skin]","dougi":"各种武术类的服装[dougi]","butler":"带领结的燕尾服[butler]","hotpants":"紧身短裤[hotpants]","tracksuit":"运动服[tracksuit]","corset":"紧身胸衣[corset]","latex":"橡胶衣物(紧身)[latex]","big balls":"异常大的睾丸[big balls]","bandages":"绷带[bandages]","bbm":"胖男人[bbm]","lab coat":"实验室外套[lab coat]","bike shorts":"自行车短裤[bike shorts]","thigh high boots":"长筒靴[thigh high boots]","metal armor":"金属盔甲[metal armor]","inverted nipples":"乳头凹陷[inverted nipples]","human pet":"把人当成宠物来对待[human pet]","bunny girl":"兔女、兔女郎[bunny girl]",
	//年龄、职业或身份类
	"sister":"姐姐或妹妹[sister]","mother":"母亲[mother]","father":"父亲[father]","brother":"哥哥或弟弟[brother]","aunt":"阿姨[aunt]","uncle":"叔叔[uncle]","daughter":"女儿[daughter]","lolicon":"萝莉[lolicon]","shotacon":"正太[shotacon]","mature":"成熟的(通常指年纪较大的人)[mature]","schoolgirl":"女学生[schoolgirl]","maid":"女仆[maid]","nurse":"护士[nurse]","teacher":"教师[teacher]","bride":"新娘[bride]","princess":"公主[princess]","nun":"修女[nun]","vampire":"吸血鬼[vampire]","catgirl":"猫女[catgirl]","dog":"狗[dog]","interracial":"不同人种间的[interracial]","futanari":"扶她[futanari]","shemale":"人妖(后天的)[shemale]","gender bender":"跟异性的举动、打扮一样的人(伪娘或伪男)[gender bender]","crossdressing":"穿异性服装(女装或男装)[crossdressing]","age regression":"返老还童[age regression]","virginity":"处女[virginity]","school boy":"男学生[school boy]","demon":"恶魔[demon]","angel":"天使[angel]","policewoman":"女警察[policewoman]","miko":"巫女[miko]","military":"军服[military]","milf":"年龄在30-50岁的女人[milf]","harem":"后宫[harem]","fairy":"仙女[fairy]","dilf":"年龄在30-50岁的老男人[dilf]","magical girl":"马猴烧酒(魔法少女)[magical girl]","elf":"精灵[elf]","kunoichi":"女忍者[kunoichi]","witch":"女巫[witch]",
	//动作类
	"defloration":"上了处女[defloration]","bondage":"绑缚[bondage]","group":"群P[group]","discipline":"调教[discipline]","x-ray":"透视(内部器官从内部或者透过皮肤可见)[x-ray]","paizuri":"乳交[paizuri]","blowjob":"口交[blowjob]","footjob":"足交[footjob]","anal":"肛交[anal]","enema":"灌肠[enema]","rape":"强奸[rape]","scat":"排泄[scat]","pregnant":"怀孕的(怀孕的女性发生性行为)[pregnant]","birth":"分娩[birth]","double penetration":"双洞插入[double penetration]","lactation":"乳汁[lactation]","sex toys":"性玩具[sex toys]","urination":"排尿[urination]","armpit sex":"腋下性爱[armpit sex]","blindfold":"蒙住眼睛[blindfold]","shibari":"绳缚[shibari]","masturbation":"自慰(自我愉悦)[masturbation]","handjob":"手淫(别人帮忙)[handjob]","fingering":"用手指拨弄[fingering]","prostate massage":"前列腺按摩(通常涉及摩擦肛门睾丸附近的墙)[prostate massage]","cum bath":"精液浴[cum bath]","fisting":"拳交(用拳头OX)fisting","large insertions":"大的插入large insertions","urethra insertion":"尿道插入urethra insertion","necrophilia":"恋尸癖[necrophilia]","bukkake":"颜射[bukkake]","gag":"塞口器[gag]","piss drinking":"喝尿[piss drinking]","nakadashi":"中出(内射)[nakadashi]","deepthroat":"深喉(口交时欧JJ深入喉咙)[deepthroat]","swinging":"交换性伴侣[swinging]","blackmail":"性勒索[blackmail]","tanlines":"晒黑的(皮肤)[tanlines]","squirting":"强烈的喷潮(潮吹)[squirting]","chloroform":"氯仿(即三氯甲烷，有麻醉性，然后啪啪啪~)[chloroform]","drugs":"药物(媚药，用于鼓励滥交或者快乐)[drugs]","sleeping":"睡觉(不清醒的情况下被啪啪啪)[sleeping]","spanking":"被打屁股[spankin]","cunnilingus":"舔阴部[cunnilingus]","time stop":"时间停止[time stop]","dick growth":"阴茎生长[dick growth]","selfcest":"自己X自己(外貌一样但是不相同的两个人)[selfcest]","electric shocks":"电击[electric shocks]","body painting":"人体彩绘(油漆不只是一小部分)[body painting]","body writing":"人体写作(各种字体或者图画)[body writing]","ryona":"虐待[ryona]","piercing":"穿刺[piercing]","filming":"拍摄[filming]",
	//类型类
	"incest":"乱伦(包括没有血缘关系的)[incest]","netorare":"NTR[netorare]","guro":"猎奇[guro]","yuri":"女同(GL)[yuri]","yaoi":"男同(BL)[yaoi]","femdom":"女性支配[femdom]","original":"原创[original]","mind control":"精神控制[mind control]","body swap":"身体交换[body swap]","tentacles":"触手[tentacles]","bestiality":"兽奸[bestiality]","cheating":"不忠贞=偷腥、出轨或外遇(和NTR的分类不同)[cheating]","monster":"怪物[monster]","wore":"丸吞[wore]","inflation":"膨胀(丸吞后独自涨大)[inflation]","unbirth":"从B钻出来[unbirth]","skinsuit":"皮类(一个男的穿女人的皮成了女人)[skinsuit]","absorb":"融合(皮类常用标签)[absorb]","psssession":"占据(皮类常用标签)[possession]","birth":"出产[birth]","eggs":"生蛋[eggs]","furry":"毛皮(主角身上长毛带皮，或是动物x动物)[furry]","worm":"虫子[worm]","amputee":"残肢(四肢切断的人棍)[amputee]","bbw":"胖女人[bbw]","wings":"翅膀[wings]","christmas":"圣诞服装[christmas]","waiter":"服务员[waiter]","waitress":"女服务员[waitress]","mmf threesome":"二男一女[mmf threesome]","ffm threesome":"二女一男[ffm threesome]","condom":"避孕套[condom]","eyepatch":"眼罩[eyepatch]","multiple penises":"多个阴茎[multiple penises]","impregnation":"啪啪啪后怀孕的行为[impregnation]","stomach deformation":"胃变形(通常指被大欧金金X到变形)[stomach deformation]","tankoubon":"单行本[tankoubon]","machine":"性机器[machine]","big penis":"大阴茎(至少和它的主人的前臂一样大)[big penis]","strap-on":"可连接的假阳具[strap-on]","anthology":"选集(多个作者)[anthology]","full censorship":"全面审查(检查play~)[full censorship]","leg locks":"脚锁[leg locks]","art book":"画集[art book]","full body tattoo":"纹身[full body tattoo]","uncensored":"未经审查的(通常是无码的)[uncensored]","vomit":"呕吐物[vomit]","torture":"酷刑[torture]","bdsm":"SM [bdsm]","tube":"管子[tube]","wooden horse":"木马[wooden horse]","public use":"公众使用[public use]","speculum":"窥器[speculum]","smegma":"包皮垢[smegma]","insect":"昆虫[insect]","slime":"粘液[slime]","huge penis":"巨大的阴茎[huge penis]","zombie":"丧尸[zombie]","diaper":"尿布[diaper]","octopus":"章鱼[octopus]",
        //新加入【17yard柚棒150128】
	"niece":"侄女外甥女[niece]",
	};

	function translateR(word){
		word = word.substr(0,word.length-1);
		//寻找翻译
		var text = eval('rData["'+word+'"]');
		//翻译不存在返回原文本，否则返回翻译后的文本。
		if (typeof text == "undefined") {
			return word+":";
	　　}else{
			return text+":";
		}
	}
	//英语翻译函数
	function translate(word){
		//寻找翻译
		var text = eval('tData["'+word+'"]');
		//翻译不存在返回原文本，否则返回翻译后的文本。
		if (typeof text == "undefined") {
			return word;
	　　}else{
			return text;
		}
	}
	//TAG列表
	var taglist = document.getElementById("taglist");
	//TAG列表里的表格
	var tab = taglist.getElementsByTagName("table").item(0);
	//行数
	var rowsl = tab.rows.length;
	for(var ir=0;ir<rowsl;ir++){
		//该行
		var rowt = tab.rows.item(ir);
		//该行名
		var cell_rowname = rowt.cells.item(0);
		//该行TAG
		var cell_tags = rowt.cells.item(1);
		var tags = cell_tags.getElementsByTagName("div");
		
		//去掉行名的冒号
		var eword = cell_rowname.innerHTML;
		//翻译
		cell_rowname.innerHTML = translateR(eword);
		
		var tagsl = tags.length;
		for(var ic=0;ic<tagsl;ic++){
			//该TAG
			var tag = tags.item(ic);
			//该TAG的连接
			var taga = tag.getElementsByTagName("a").item(0);
			//该TAG的文字
			var eword = taga.innerHTML;
			//翻译
			taga.innerHTML = translate(eword);
		}
	}
})();