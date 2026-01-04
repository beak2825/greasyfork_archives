// ==UserScript==
// @name        易班自动投票/发布
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  易班自动发布投票/参与投票
// @author       Chenl
// @include       *yiban.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384266/%E6%98%93%E7%8F%AD%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/384266/%E6%98%93%E7%8F%AD%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

(function() {
var addHref = window.location.href;
		window.ddd = function() {
			if(addHref.indexOf("http://www.yiban.cn/newgroup/showMorePub/puid/") == -1) {
				document.getElementById("MSG_content").innerHTML = "运行出错了！<br />该功能必须得在“更多投票”页面下运行！<br /> 班级主页-投票-更多"
                sessionStorage.removeItem("choose")
			}else{
				window.location.reload();
			}
		}
		//		=======================================================
		window.aaa = function() {
			var e = document.createElement("div");
			document.body.appendChild(e);
			e.innerHTML = "<div id='MSG' style='width: 500px;height: 500px;background-color: #70c7ff;position: fixed;top: 50%;border-radius: 5px;margin-top: -250px; z-index: 999;'><div id='MSG_Top' style='width: 100%;text-align: center;height: 50px;line-height: 50px;background-color: #587dff;border-radius: 5px 5px 0 0;'>易班自动投票/发布投票脚本</div><div id='MSG_content' style='text-align: center;font-size: 25px;color: red;font-style: italic;'><span>使用说明：</span><br><span>点击下方功能按钮即可执行相应功能</span><br><span>批量投票需在“更多投票”页面运行</span></div><div id='MSG_buttons' style='width: 100%;height: 50px;line-height: 50px;text-align: center;margin-right: 50px;margin: 5px;position: absolute;bottom: 1%;'><input type='button' id='MSG_button' value='一键发布投票' style='margin-right: 130px;height: 50px;' onclick='choose1()'><input type='button' id='MSG_button' value='批量投票' style='height: 50px;'onclick='choose2()'></div></div>"
			window.choose1 = function() {
				setTimeout(function() {
					document.getElementsByClassName("font-publish-vote")[0].click()
				}, 300)
				sessionStorage.choose = 1;
				localStorage.aa = 1; //生成定义已发起投票的次数本地存储
			}
			window.choose2 = function() {
					sessionStorage.choose = 2;
					ddd();//判断页面是否为投票列表页
			}
		}
		//		=======================================================
		window.bbb = function() {
			var content=["行尸走肉","金玉满堂","情非得已","卧虎藏龙","珠光宝气","金玉良缘","相濡以沫","壮志凌云","三人成虎","破釜沉舟","厚德载物",
		"国士无双","塞翁失马","叶公好龙","群雄逐鹿","时光荏苒","雾里看花","金戈铁马","声色犬马","庖丁解牛","南辕北辙","未雨绸缪","杯弓蛇影","缘木求鱼",
		"红颜知己","纸醉金迷","纵横捭阖","岁寒三友","乐不思蜀","大智若愚","天马行空","相得益彰","叱咤风云","殊途同归","作茧自缚","镜花水月","杞人忧天",
		"望其项背","釜底抽薪","悬梁刺股","草船借箭","无为而治","出水芙蓉","礼仪之邦","捉襟见肘","瓜田李下","贻笑大方","宁缺毋滥","韦编三绝","毛遂自荐",
		"中庸之道","草木皆兵","五花大绑","露水夫妻","迷途知返","竭泽而渔","君子好逑","囊萤映雪","振聋发聩","自怨自艾","运筹帷幄","矫枉过正","杯水车薪",
		"睚眦必报","退避三舍","沆瀣一气","桀骜不驯"]
		var content2=["讽刺没有理想，无所作为的人。糊里糊涂混日子，虽然活着，同死人一样。",
		"形容财富极多。也形容学识丰富。","指情况出于不得已。","指隐藏着未被发现的人才，也指隐藏不露的人才。","形容服饰、陈设等非常华丽。",
		"原指符合封建秩序的姻缘。后泛指美好的姻缘。","比喻同处困境，相互救助。","形容理想宏伟远大。凌云：直上云霄。","比喻讹传一再重复，就可能以假充真。","比喻下定决心彻底干一场，不达目的决不罢休",
		"旧指道德高尚者能承担重大任务。【出处】	《周易·坤》:君子以厚德载物。","才能超群，国内无人可比。【出处】	《史记·淮阴侯列传》:诸将易得耳，至如信者，国士无双。","比喻虽然受到暂时的损失，但也许因此得到好处。常与“安知非福”连用。[出处]	宋·魏泰《东轩笔录》：“鲁公有柬别之；略曰：‘寒翁失马；今未足悲；楚相断蛇；后必为福。’”",
		"比喻说是爱好某事物，其实并不真爱好。","形容各派势力争夺最高统治地位。出自西汉司马迁《史记·淮阴侯列传》。",
		"时间一点一点地流逝、不知不觉中便稍纵即逝，犹如白驹过隙。","比喻老眼昏花、模糊不清。唐杜甫《小寒食舟中作》诗：“春水船如天上坐，老年花似雾中看。” 后比喻看不清事物的本质。",
		"指战事。也用以形容战士的雄姿。宋辛弃疾《永遇乐·京口北固亭怀古》：“想当年金戈铁马，气吞万里如虎。” 金戈：金属制作的戈。铁马：披着铁甲的战马。","泛指旧时统治阶级的淫乐方式。亦作“声色狗马”。",
		"比喻经过反复实践，掌握了事物的客观规律，做事得心应手，运用自如。","《战国策·魏策四》记载，有个人要到南方楚国去，却驾着车往北走。比喻行动和目的相反。","在天还没下雨的时候，就修补好房屋的门窗。后用以比喻事先做好准备",
		"比喻疑神疑鬼，妄自惊慌。","比喻方向、方法不对，一定达不到目的。","也叫红粉知己，就是一个与你在精神上独立、灵魂上平等，并能够达成深刻共鸣的女性朋友。","也说金迷纸醉。宋陶穀《清异录·居室》记载，唐末有个叫孟斧的人，他把自己房间里的家具都包上了金纸，闪闪发光。到过他家的人就说，在那房里呆一会儿，能让人金迷纸醉。后多用“纸醉金迷”形容奢侈糜烂的生活。",
		"宋·李文叔《书战国策后》：“战国策所载；大抵皆纵横捭阖谲诳相轻倾夺之说也。”","指松树、竹子和梅花。松、竹经冬不凋，梅耐寒，早春开放，故名。","《三国志·蜀书·后主传》裴松之注引《汉晋春秋》记载，蜀亡后，后主刘禅被安置在晋都洛阳。司马昭问他：“颇思蜀否？” 他说：“此间乐，不思蜀。” 后泛指乐而忘返或乐而忘本。",
		"也说大智如愚。意本《老子 四十五章》：“大直若屈，大巧若拙。” 形容聪明的人，不炫耀自己，从表面看好像很 愚笨。","比喻气势豪放，不受拘束（多用在评价写作、绘画和书法等方面）。天马：汉武帝时从大宛（古代西域国名）得到的汗血马称为天马，意思是神马。见《史记·大宛列传》。行空：形容骏马奔驰，如腾空飞行。",
		"两者互相配合或映衬，双方的长处和作用更能显示出来。汉王褒《圣主得贤臣颂》：“聚精会神，相得益章（同“彰”）。”益：更加。彰：明显。",
		"唐骆宾王《代徐敬业传檄天下文》：“叱咤则风云变色。” 意思是大声怒喝，可使风云变色。形容威力、声势极大。咤（zhà）。","《周易·系辞下》：“天下同归而殊途。” 原意是通过不同的路径走到同一个目的地。比喻用的方法虽不同，但目标与结果都一样。殊：不同。途：道路，路径。归：趋向。",
		"蚕吐丝结茧，把自己包在里面。比喻自己使自己陷入困境。宋陆游《书叹》诗：“人生如春蚕，作茧自缠裹。” 缚：束缚。","镜中之花，水中之月。比喻诗中自有美妙的意境。宋严羽《沧浪诗话·诗辨》：“故其妙处，透彻玲珑，不可凑泊，如空中之音，相中之色，水中之月，镜中之像，言有尽而意无穷。” 后也比喻虚幻的景象。",
		"《列子·天瑞》中说，杞国有个人担心天会塌下来，自己无处安身，以致吃不下饭，睡不好觉。唐李白在《梁甫吟》中用这个典故写出“杞国无事忧天倾”的诗句。后用“杞人忧天”比喻毫无必要的忧虑和担心。",
		"能够望见别人的颈项和背脊，表示赶得上或比得上（多用于否定式）：难以～。","从锅底下抽去 燃烧的柴火，使水停沸。比喻从根本上解决问题。北齐魏收《为侯景叛移梁朝文》：“抽薪止沸，剪草 除根。” 明俞汝楫《礼部志稿·奏疏·戚元佐〈议处宗潘疏〉》：“谚云：‘扬汤止沸，不如釜底抽薪。",
		"《战国策·秦策一》记载，苏秦“读书欲睡，引锥自刺其股。”《太平御览》卷三六三引《汉书》说孙敬好学，“晨夕不休，及至眠睡疲寝，以绳系头，悬屋梁。”后用“悬梁刺股”形容刻苦学习。股：大腿。",
		"运用智谋，凭借他人的人力或财力来达到自己的目的。","无为：顺其自然，不必有所作为，是古代道家的一种处世态度和政治思想；治：治理。顺应自然，不求有所作为而使国家得到治理。原指舜当政的时候，沿袭尧的主张，不做丝毫改变。后泛指以德化民。",
		"芙蓉：荷花。刚开放的荷花。比喻诗文清新不俗。也形容天然艳丽的女子。","礼仪：礼节和仪式；邦：国家。指讲究礼节和仪式的国家。","也说捉襟肘见。拉一下衣襟，胳膊肘就露了出来。《庄子·让王》：“曾子居卫…十年不制衣，正冠而缨绝，捉衿（同“襟”）而肘见。”形容衣服破烂，生活穷困。后也比喻顾此失彼，穷于应付。",
		"古诗《君子行》：“瓜田不纳履，李下不正冠。”经过瓜田，不弯下身来提鞋，免得人家怀疑摘瓜；走过李树下面，不举起手来整理帽子，免得人家怀疑摘李子。后用“瓜田李下”比喻容易引起嫌疑的地方","也说见笑大方。给懂行的人留下笑柄。《庄子·秋水》：“今我睹子之难穷也，吾非至于子之门，则殆矣。吾长见笑于大方之家。” 贻笑：见笑。大方：专家，内行人。",
		"宁可缺少些，也不要不顾标准，凑数求多。","孔子晚年很爱读《周易》，翻来覆去地读，使穿连《周易》竹简的皮条断了好几次（见于《史记·孔子世家》）。后来用“韦编三绝”形容读书勤奋。","毛遂是战国时代赵国平原君的门客。秦兵攻打赵国，平原君奉命到楚国求救，毛遂自动请求跟着去。到了楚国，平原君跟楚王谈了一上午没有结果。毛遂挺身而出，陈述利害，楚王才答应派春申君带兵去救赵国（见于《史记·平原君列传》）。后来用“毛遂自荐”比喻自己推荐自己。",
		"待人处世采取不偏不倚，调和折中的态度。《论语·雍也》：“中庸之为德矣，其至矣乎！”","公元383年，前秦苻坚出兵攻晋，前锋在安徽寿春洛涧被晋军打败。苻坚登寿春城瞭望，看到晋兵布阵严整，又望见八公山上的草木，以为都是晋兵，认为遇到了劲敌，因而感到害怕。后来就用草木皆兵形容神经过敏、疑神疑鬼的惊恐心理。",
		"绑人的一种方法，用绳索套住脖子并绕到背后反剪两臂。[出处]	李季《王贵与李香香》第二部二:“顺着捆来横着绑，五花大绑吊在二梁上。”","指暂时结合的非正式夫妻；亦指不正当的男女关系。","迷失道路，知道回来。比喻觉察了自己的错误，知道改正。《三国志·魏书·袁术传》：“以身试祸，岂不痛哉！若迷而知反，尚可以免。”",
		"排干了塘里的水来捕鱼。比喻只顾眼前，不顾将来。《吕氏春秋·义赏》：“竭泽而渔，岂不获得，而明年无鱼。” 渔：捕鱼。","逑，通“仇”。仇：配偶，故好逑即好配偶，原指君子的佳偶。后遂用为男子追求佳偶之套语。","原是车胤用口袋装萤火虫来照书本，孙康利用雪的反光勤奋苦学的故事。后形容刻苦攻读。",
		"响声很大，使聋人都能听见。","《孟子·万章上》：“太甲悔过，自怨自艾。” 原意是自己悔恨自己的错误，自己改正。后只指自我悔恨。艾（yì）：治理，改正。","在帷幕之中指挥、谋划。后泛指策划机要。《史记·太史公自序》：“运筹帷幄之中，制胜于无形，子房计谋其事，无知名，无勇功，图难于易，为大于细。",
		"把弯曲的东西扭直，结果过了头，又歪向另一方。比喻纠正错误超过了应有的限度。《汉书·诸侯王表》：“而藩国大者跨州兼郡…可谓矫枉过其正矣。” 矫：纠正。枉：弯曲。过正：过了头，超过了应有的限度。","《孟子·告子上》：“今之为仁者，犹以一杯水救一车薪之火也。” 比喻无济于事，解决不了问题。薪：柴草。",
		"像被人瞪了一眼那样极小的仇恨也一定要报复，形容心胸极其狭窄。","春秋时，晋国同楚国在城濮（在今山东鄄城西南）作战，晋文公遵守以前的诺言，把军队撤退九十里（见于《左传·僖公二十八年》；舍：古代行军三十里为一舍）。后用来比喻对人让步，不与相争。",
		"宋钱易《南部新书·戊集》记载，唐朝有个主考官崔沆，录取了他的门生崔瀣。当时有人嘲笑他们：“座主门生，沆瀣一气。” 后用来比喻臭味相投的人勾结在一起。","性情强暴倔强，不受管束，不驯顺。"]
		var num=Math.ceil(Math.random()*66)
			var e = document.createElement("div");
			document.body.appendChild(e);
			e.innerHTML = "<div id='MSG' style='width: 500px;height: 500px;background-color: #70c7ff;position: fixed;top: 50%;border-radius: 5px;margin-top: -250px; z-index: 999;'><div id='MSG_Top' style='width: 100%;text-align: center;height: 50px;line-height: 50px;background-color: #587dff;border-radius: 5px 5px 0 0;'>脚本</div><div id='MSG_content' style='text-align: center;font-size: 25px;color: red;font-style: italic;'><span>这是第一行内容</span><br><span>这是第一行内容</span><br><span>这是第一行内容</span><br></div><div id='MSG_buttons' style='width: 100%;height: 50px;line-height: 50px;text-align: center;margin-right: 50px;margin: 5px;position: absolute;bottom: 1%;'></div></div>"
			document.getElementById("MSG_content").innerHTML = "<span>正在进行第" + localStorage.aa + "次操作</span>"
			localStorage.aa = parseInt(localStorage.aa) + 1;
			setTimeout(function() {
				var doctext = document.getElementsByClassName("text");
				doctext[0].value = "【"+content[num]+"】"
				document.getElementsByClassName("textarea")[0].value = "【"+content2[num]+"】"
				doctext[1].value = '没用的投票1'
				doctext[2].value = '没用的投票2'
				doctext[3].value = '没用的投票3'
				document.getElementsByClassName("iradio")[2].className = 'iradio checked' //选择18软件3班
				document.getElementsByClassName("iradio")[2].click();
				var myDate = new Date(); //获取当前时间
				document.getElementsByClassName("text-datatime")[0].value = myDate.getFullYear() + "-" + parseInt(myDate.getMonth() + 1) + "-" + parseInt(myDate.getDate() + 1) + " 12:00"; //日期定义为第二天的12点
				document.getElementsByClassName("icheckbox")[1].click(); //验证码开关
				document.getElementsByClassName("btn-huge")[0].click(); //提交
				setTimeout(function (){var check=document.getElementsByClassName("pop-alert-content")
				if(check.length!=0){
				document.getElementById("MSG_content").innerHTML = "<span>检测到验证码，推荐切换账号继续发布。</span>"
				}
				},1500)
			}, 1000)
		}
		//		=======================================================
		window.ccc = function() {
			var e = document.createElement("div");
			document.body.appendChild(e);
			e.innerHTML = "<div id='MSG' style='width: 500px;height: 500px;background-color: #70c7ff;position: fixed;top: 50%;border-radius: 5px;margin-top: -250px; z-index: 999;'><div id='MSG_Top' style='width: 100%;text-align: center;height: 50px;line-height: 50px;background-color: #587dff;border-radius: 5px 5px 0 0;'>脚本</div><div id='MSG_content' style='text-align: center;font-size: 25px;color: red;font-style: italic;'><span>这是第一行内容</span><br><span>这是第一行内容</span><br><span>这是第一行内容</span><br></div><div id='MSG_buttons' style='width: 100%;height: 50px;line-height: 50px;text-align: center;margin-right: 50px;margin: 5px;position: absolute;bottom: 1%;'></div></div>"
			document.getElementById("MSG_content").innerHTML = "<span>当前投票发布完毕，正在关闭窗口...</span>"
			document.getElementsByClassName("font-publish-vote")[0].click();
			setTimeout(function() {
				window.close();
			}, 1000)

		}
		//		=======================================================
		window.eee=function (){
            var e = document.createElement("div");
			document.body.appendChild(e);
			e.innerHTML = "<div id='MSG' style='width: 500px;height: 500px;background-color: #70c7ff;position: fixed;top: 50%;border-radius: 5px;margin-top: -250px; z-index: 999;'><div id='MSG_Top' style='width: 100%;text-align: center;height: 50px;line-height: 50px;background-color: #587dff;border-radius: 5px 5px 0 0;'>脚本</div><div id='MSG_content' style='text-align: center;font-size: 25px;color: red;font-style: italic;'><span>这是第一行内容</span><br><span>这是第一行内容</span><br><span>这是第一行内容</span><br></div></div>"
			document.getElementById("MSG_content").innerHTML = "<span>正在自动投票...</span>"
			var t = 36;
				var i = 0;
				var timer = setInterval(a, 2000)
				var timer2;
				function a() {
					document.getElementsByTagName("a")[i + t].click();
					i = i + 2;
					if(i + t == 56) {
						document.getElementById("MSG_content").innerHTML = "当前页面所有投票已完成！<br />10秒后自动跳转下一页！"
						clearInterval(timer);
						timer2 = setTimeout(function() {
							document.getElementsByClassName("next")[0].click()
						}, 10000)
					}
				}
				document.onkeydown = function(event) {
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode == 113) {
						document.getElementById("MSG_content").innerHTML = "已手动停止运行"
						clearTimeout(timer2);
						clearInterval(timer);
					}
				}
		}
//		=============================================
	window.fff=function (){
        var e = document.createElement("div");
			document.body.appendChild(e);
			e.innerHTML = "<div id='MSG' style='width: 500px;height: 500px;background-color: #70c7ff;position: fixed;top: 50%;border-radius: 5px;margin-top: -250px; z-index: 999;'><div id='MSG_Top' style='width: 100%;text-align: center;height: 50px;line-height: 50px;background-color: #587dff;border-radius: 5px 5px 0 0;'>易班自动投票/发布投票脚本</div><div id='MSG_content' style='text-align: center;font-size: 25px;color: red;font-style: italic;'></div></div>"
			document.getElementById("MSG_content").innerHTML = "<span>正在进行投票...</span>"
		if(document.getElementsByClassName("btn_end")[0].innerHTML=="已投票"){
    	window.close();
    }
	setTimeout(function (){
    if(document.getElementsByClassName("fonts")[0].innerHTML!='取消赞'){
    document.getElementsByClassName("fonts")[0].click()
        }
	},1000)
	setTimeout(function (){
		document.getElementsByTagName("input")[1].value=Math.ceil(Math.random()*100)
		document.getElementsByClassName("submit")[0].click();
	},1500)
	setTimeout(function (){
		document.getElementsByClassName("desc")[0].click();
	},2000)
	setTimeout(function (){
		document.getElementsByClassName("btn_vote")[0].click()
	},2500)
     setTimeout(function (){
		window.close();
	},3000)
    }

//		=============================================
		if(addHref == "http://www.yiban.cn/my/publishvote") {
			if(sessionStorage.choose == 1) {
				bbb(); //如果页面是发起投票页面
			}else {
            aaa();
            }
		} else if(addHref.indexOf("http://www.yiban.cn/vote/vote/showDetail/vote_id/") != -1) {
			if(sessionStorage.choose == 1) {
				ccc(); //如果是点击第一个按钮后来到此页面
			}else if(sessionStorage.choose == 2){
				fff();//如果是点击第二个按钮后来到此页面
			}else{
                aaa();
            }
		} else if(addHref.indexOf("http://www.yiban.cn/newgroup/showMorePub/puid/") != -1 ||addHref.indexOf("http://www.yiban.cn/Newgroup/showMorePub/group_id/")!=-1) {
			if(sessionStorage.choose == 2){
				eee();//如果是投票列表页
				}else{
				aaa();
				}
		}else{
			aaa(); //其他页面
		}
})();