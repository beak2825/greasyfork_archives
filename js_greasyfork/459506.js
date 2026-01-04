// ==UserScript==
// @name         animefun danmaku filter
// @name:zh-TW   動畫瘋彈幕過濾器
// @namespace    https://github.com/jtdjdu6868
// @version      1.1.2
// @description        advanced danmaku filter for animefun, allows you to filter unlimited black list and filter out simplified chinese
// @description:zh-TW  增強型的彈幕過濾器，可自訂無上限列表與過濾簡體字
// @author       jtdjdu6868
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @icon         https://ani.gamer.com.tw/favicon.ico
// @license      BY
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459506/animefun%20danmaku%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/459506/animefun%20danmaku%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filter_szh(list)
    {
        const pure_szh = /[碍肮袄坝办帮报币毙标别补灿层搀谗馋缠忏偿厂彻尘衬惩迟冲础处聪丛导邓敌籴递淀电吨夺儿矾范飞坟奋粪凤肤妇复盖赶个巩沟构购顾关观柜汉轰壶护怀坏欢环还获击鸡积极际继价艰歼茧拣硷舰浆桨奖讲酱胶阶疖洁仅惊竞剧据惧开垦恳夸块亏腊蜡兰拦栏烂垒类隶帘联怜炼练粮疗辽猎临邻岭庐陆驴么梦庙灭亩恼脑拟酿疟盘苹凭扑仆朴启签牵纤窍庆琼权劝确让扰热认洒伞丧扫涩伤胜实适势兽书术树帅苏虽态坛叹誊粜铁听厅头图涂团椭洼袜网卫稳务雾牺习戏虾吓咸显宪县响协胁亵衅兴须悬选压盐阳养痒样钥药爷亿忆应痈拥佣忧优邮吁渊园远愿跃运酝杂赃脏凿枣斋毡战赵这证钟肿种众烛筑庄桩妆浊总钻爱罢备贝笔毕边宾仓产长尝车齿刍从窜达带单东动对队尔发丰风冈广归龟过华汇几夹戋监见荐节进举壳乐离历丽两灵刘龙娄卢虏卤录虑仑罗马买卖门黾难鸟聂宁农齐岂气迁佥乔亲穷啬杀审圣师时肃岁孙为韦乌无乡寻亚严厌尧业页义艺阴隐犹鱼云郑执质专嗳嫒叆瑷暧摆罴惫贞则负贡呗员财狈责厕贤账贩贬败贮贪贫侦侧货贯测浈恻贰贲贳费郧勋帧贴贶贻贱贵钡贷贸贺陨涢资祯贾损贽埙桢唝唢赅圆贼贿赆赂债赁渍惯琐赉匮掼殒勚赈婴啧赊帻偾铡绩溃溅赓愦愤蒉赍蒇赔赕遗赋喷赌赎赏赐赒锁馈赖赪碛赗腻赛赘撄槚嘤赚赙罂镄箦鲗缨璎聩樱赜篑濑瘿懒赝豮赠鹦獭赞赢赡癞攒籁缵瓒臜赣趱躜戆滗荜哔筚跸笾傧滨摈嫔缤殡槟膑镔髌鬓渗掺骖毵瘆碜糁伧创沧怆苍抢呛炝玱枪戗疮鸧舱跄浐萨铲伥怅帐张枨账胀涨鲿轧军轨厍阵库连轩诨郓轫轭匦转轮斩软浑恽砗轶轲轱轷轻轳轴挥荤轹轸轺涟珲载莲较轼轾辂轿晕渐惭皲琏辅辄辆堑啭崭裤裢辇辋辍辊椠辎暂辉辈链翚辏辐辑输毂辔辖辕辗舆辘撵鲢辙錾辚龀啮龆龅龃龄龇龈龉龊龌龋蛊诌邹驺绉皱趋雏苁纵枞怂耸撺镩蹿闼挞哒鞑郸惮阐掸弹婵殚瘅蝉箪蕲冁挡档裆铛谠傥镋冻陈岽栋胨鸫恸簖怼坠迩玺猕泼废拨沣艳滟讽沨岚枫疯飒砜飓飔飕飗飘飙刚岗纲钢邝圹扩犷纩旷矿岿阄帼腘蝈挝哗骅烨桦晔铧婳刽郐侩浍荟哙狯绘烩脍鲙讥叽饥机玑矶虮郏侠陕浃荚惬硖铗颊蛱瘗箧刬饯线栈贱盏钱笺溅滥蓝尴槛褴篮苋岘觃视规现枧觅觉砚觇览宽蚬觊笕觋觌靓搅揽缆窥榄觎觏觐觑髋鞯锵栉浕荩烬赆琎榉悫涞莱崃徕赉睐铼泺烁栎轹砾铄漓篱沥坜苈呖枥疬雳俪郦逦骊鹂酾鲡俩唡辆满瞒颟螨魉懑蹒棂浏陇泷宠庞垄拢茏咙珑栊昽胧砻袭聋龚龛笼偻溇蒌搂嵝喽缕屡瘘褛窭镂屦蝼篓耧薮擞髅泸垆栌轳胪鸬颅舻鲈掳鹾箓滤摅论伦沦抡囵纶轮瘪萝啰逻猡椤锣箩冯驭闯吗犸驮驰驯妈玛驱驳码驼驻驵驾驿驷驶驹驺骀驸驽骂蚂笃骇骈骁骄骅骆骊骋验骏骎骑骐骒骓骖骗骘骛骚骞骜蓦腾骝骟骠骢骡羁骤骥骧荬读渎续椟觌赎犊牍窦黩唛麸闩闪们闭闯问扪闱闵闷闰闲间闹闸钔阂闺闻闼闽闾闿阁阀润涧悯阆阅阃阄娴阏阈阉阊阍阌阋阐阎焖阑裥阔痫鹇阕阒搁锏锎阙阖阗榈简谰阚蔺澜斓镧躏渑绳鼋蝇鼍傩滩摊瘫凫鸠岛茑鸢鸣枭鸩鸦鸥鸨鸧窎莺鸪捣鸫鸬鸭鸯鸮鸲鸰鸳鸵袅鸱鸶鸾鸿鸷鸸鸼鸽鸹鸺鸻鹈鹇鹁鹂鹃鹆鹄鹅鹑鹒鹉鹊鹋鹌鹏鹐鹚鹕鹖鹗鹘鹙鹜鹛鹤鹣鹞鹡鹧鹥鹦鹨鹫鹩鹪鹬鹰鹯鹭鹳慑滠摄嗫镊颞蹑泞拧咛狞柠聍侬浓哝脓剂侪济荠挤脐蛴跻霁鲚齑剀凯恺闿垲桤觊硙皑铠忾饩跹剑俭险捡猃验检殓敛脸裣睑签潋蔹侨挢荞峤骄娇桥轿硚矫鞒榇讴伛沤怄抠奁呕岖妪驱瓯鸥眍躯蔷墙嫱樯穑铩谉婶柽蛏浉狮蛳筛埘莳鲥俦涛焘畴铸筹踌瞩萧啸潇箫蟏刿哕秽荪狲逊涤绦鲦厉迈疠虿趸砺粝蛎伪沩妫讳伟闱违苇韧帏围纬炜祎玮韨涠韩韫韪韬邬坞呜钨怃庑抚芜呒妩谳芗飨泻浔荨挦鲟垩垭挜哑娅恶氩壶俨酽恹厣靥餍魇黡侥浇挠荛峣哓娆骁绕饶烧桡晓硗铙翘蛲跷邺顶顷项顸顺须颃烦顼顽顿颀颁颂倾预庼硕颅领颈颇颏颊颉颍颌颋滪颐蓣频颓颔颖颗额颜撷题颙颛缬濒颠颟颞颡嚣颢颤巅颥癫灏颦颧议仪蚁呓荫瘾莸鱽渔鲂鱿鲁鲎蓟鲆鲏鲅鲈鲇鲊稣鲋鲍鲐鲞鲝鲚鲛鲜鲑鲒鲟鲔鲟鲗鲖鲙鲨噜鲡鲠鲢鲫鲥鲩鲣鲤鲦鲧橹氇鲸鲭鲮鲰鲲鲻鲳鲱鲵鲷鲶藓鲿鳊鲽鳁鳃鳄镥鳅鳆鳇鳌鳒鳍鳎鳏鳑癣鳖鳙鳛鳕鳔鳓鳘鳗鳝鳟鳞鳜鳣鳢屿欤昙叆叇掷踯垫挚贽鸷蛰絷锧踬传抟转砖啭计订讣讥议讨讧讦记讯讪训讫访讶讳讵讴诀讷设讽讹许论讼讻诂诃评诏词译诎诇诅识诌诋诉诈诊诒诨该详诧诓诖诘诙试诗诩诤诠诛诔诟诣话诡询诚诞浒诮说诫诬语诵罚误诰诳诱诲诶狱谊谅谈谆谉谇请诺诸读诼诹课诽诿谁谀调谄谂谛谙谜谚谝谘谌谎谋谍谐谏谞谑谒谔谓谖谕谥谤谦谧谟谠谡谢谣储谪谫谨谬谩谱谮谭谰谲谯蔼槠谴谵谳辩雠谶霭饥饦饧饨饭饮饫饩饪饬饲饯饰饱饴饳饸饷饺饻饼饵饶蚀饹饽馁饿馆馄馃馅馉馇馈馊馐馍馎馏馑馒馓馔馕汤扬场旸饧炀杨肠疡砀畅钖殇荡烫觞丝纠纩纡纣红纪纫纥约纨级纺纹纬纭纯纰纽纳纲纱纴纷纶纸纵纾纼咝绊线绀绁绂绋绎经绍组细绅织绌终绉绐哟绖荮荭绞统绒绕绔结绗给绘绝绛络绚绑莼绠绨绡绢绣绥绦鸶综绽绾绻绩绫绪续绮缀绿绰绲绳绯绶绸绷绺维绵缁缔编缕缃缂缅缘缉缇缈缗缊缌缆缓缄缑缒缎辔缞缤缟缣缢缚缙缛缜缝缡潍缩缥缪缦缨缫缧蕴缮缯缬缭橼缰缳缲缱缴辫缵坚贤肾竖悭紧铿鲣劳茕茔荧荣荥荦涝崂莹捞唠莺萤营萦痨嵘铹耢蝾览揽缆榄鉴识帜织炽职钆钇钌钋钉针钊钗钎钓钏钍钐钒钖钕钔钬钫钚钪钯钭钙钝钛钘钮钞钢钠钡钤钧钩钦钨铋钰钱钲钳钴钺钵钹钼钾铀钿铎铃铅铂铄铆铍钶铊钽铌钷铈铉铒铑铕铟铷铯铥铪铞铫铵衔铲铰铳铱铓铗铐铏铙银铛铜铝铡铠铨铢铣铤铭铬铮铧铩揿锌锐锑锒铺铸嵚锓锃链铿锏销锁锄锅锉锈锋锆铹锔锕锎铽铼锇锂锧锘锞锭锗锝锫错锚锛锯锰锢锟锡锣锤锥锦锨锱键镀镃镁镂锲锵锷锶锴锾锹锿镅镄锻锸锼镎镓镋镔镒镑镐镉镊镇镍镌镏镜镝镛镞镖镚镗镘镩镦镨镧镥镤镢镣镫镪镰镱镭镬镮镯镲镳镴镶峃觉搅喾鲎黉译泽怿择峄绎驿铎萚释箨劲刭陉泾经烃轻氢胫痉羟颈巯变孪峦娈栾挛鸾脔滦銮剐涡埚莴娲祸脶窝锅蜗讠饣纟钅呙]/g;
        const szh_jp_intersection = /[医欧殴画会学旧峡挟狭区径茎芸献号国参蚕惨残辞湿写寿将称条状触嘱寝尽随枢数声窃浅践禅双壮装属堕体滞担胆断虫昼点灯当党独麦蛮宝万弥与余誉来乱礼励恋炉楼湾桧祢祷蒋祷沪芦弯掴]/g;
        const kana = /[ぁ-んァ-ヶｦ-ﾝ]/g;
        return list.filter(({text:x}) => {
            // if has pure szh
            let content;
            if((content = (x.match(pure_szh) || [])).length >= config.pure_szh_threshold) return false || console.log(`filtered: ${x} (pure szh: ${content})`);
            if((content = (x.match(szh_jp_intersection) || [])).length >= config.intersection_threshold)
            {
                kana.lastIndex = 0;
                if(kana.test(x)) return true;
                else return false || console.log(`filtered: ${x} (intersection: ${content})`);
            }
            return true;
        });
    }
    function filter_custom(list)
    {
        const keywordList = config.keywords;
        if(keywordList.length <= 0) return list;
        const re = keywordList.map(({keyword:x, type}) => "(" + (type !== "regex" ? x.replace(/([\^\$\(\)\*\+\?\.\[\\\{\|])/g, "\\$1") : x) + ")").join("|");
        // console.log(re);
        let content;
        return list.filter(({text: x}) => (content = x.match(re) || []).length <= 0 || console.log(`filtered: ${x} (user custom)`));
    }

    // config
    const config_properties = [
        {
            key: "enable_filter_szh",
            type: "bool",
            default_value: true
        },
        {
            key: "enable_filter_custom",
            type: "bool",
            default_value: true
        },
        {
            key: "pure_szh_threshold",
            type: "int",
            default_value: 1
        },
        {
            key: "intersection_threshold",
            type: "int",
            default_value: 2,
        },
        {
            key: "keywords",
            type: "json",
            default_value: []
        }
    ];
    const config = {};
    for(let {key, type, default_value} of config_properties)
    {
        Object.defineProperty(config, key, {
            set: function(x) {
                switch(type)
                {
                    case "bool":
                        localStorage.setItem(key, x ? "enable" : "disable");
                        break;
                    case "int":
                        if(isNaN(parseInt(x)))
                            localStorage.setItem(key, default_value);
                        else
                            localStorage.setItem(key, x);
                        break;
                    case "json":
                        localStorage.setItem(key, JSON.stringify(x));
                        break;
                    default:
                        localStorage.setItem(key, x);
                }
                animefun.refreshdanmu();
            },
            get: function() {
                const raw_value = localStorage.getItem(key);
                switch(type)
                {
                    case "bool":
                        return (raw_value || (localStorage.setItem(key, "enable"), "enable")) == "enable";
                        break;
                    case "int":
                        return raw_value === null ? (localStorage.setItem(key, default_value), default_value) : raw_value;
                        break;
                    case "json":
                        return (raw_value === null || raw_value == "") ? (localStorage.setItem(key, default_value), default_value) : JSON.parse(raw_value);
                }
            }
        });
    }

    function addKeywordOptionLabel({keyword: newkeyword, type})
    {
        $("<option></option>", {
            value: newkeyword,
            "class": `adv-filter-keyword-optionlabel keyword-${type}`,
            text: newkeyword,
            "data-type": type,
            click: function() {
                event.stopPropagation();
            }
        }).appendTo(keywordBody);
    }
    function addKeywords(newkeywords)
    {
        const keywordList = config.keywords;
        // remove duplicated keyword
        newkeywords = newkeywords.filter((v) => !keywordList.find((e) => (e.keyword === v.keyword && e.type === v.type)));
        // add label
        newkeywords.forEach((e) => addKeywordOptionLabel(e));
        // set selection
        keywordBody.val(newkeywords.map((e) => e.keyword).join(" "));
        config.keywords = keywordList.concat(newkeywords);
        return newkeywords.length;
    }
    function removeKeywords(removekeywordList)
    {
        const keywordList = config.keywords.filter((e) => !removekeywordList.find((x) => e.keyword == x.keyword && e.type == x.type));
        config.keywords = keywordList;
    }

    // add option
    function createOption(onclick, text, default_value)
    {
        return $("<div></div>", {
            "class": "ani-setting-item ani-flex",
        }).append($("<div></div>", {
            "class": "ani-setting-label"
        }).append($("<span></span>", {
            "class": "ani-setting-label__mian",
            text: text
        }))).append($("<div></div>", {
            "class": "ani-setting-value ani-set-flex-right"
        }).append($("<div></div>", {
            "class": "ani-checkbox"
        }).append($("<label></label>", {
            "class": "ani-checkbox__label"
        }).append($("<input />", {
            type: "checkbox",
            checked: default_value,
            click: onclick
        })).append($("<div></div>", {
            "class": "ani-checkbox__button"
        })))));
    }
    function createInput(onset, id, label, options)
    {
        return $("<div></div>", {
            "class": "ani-setting-item ani-flex"
        }).append($("<div></div>", {
            "class": "ani-setting-label"
        }).append($("<span></span>", {
            "class": "ani-setting-label__mian",
            text: label
        }))).append($("<input />", {
            "class": "ani-input adv-filter-input",
            id: id,
            ...options
        })).append($("<a></a>", {
            href: "#" + id,
            role: "button",
            "class": "bluebtn advf-bluebtn",
            click: function() {
                onset($($(this).attr("href")).val());
                return false;
            },
            text: "設定"
        }));
    }

    function initCSS()
    {
        // css
        $(`<style>
			   .adv-filter-keyword-header
			   {
				   display: flex;
				   margin-bottom: 8px;
				   align-items: center
			   }
			   .advf-bluebtn
			   {
				   flex: 0 0 auto;
				   position: relative;
				   padding: 6px 12px;
				   vertical-align: middle;
				   border: none;
				   cursor: pointer;
			   }
			   .adv-filter-keyword-body
			   {
				   width: 100%;
				   height: 200px;
				   border: 1px solid var(--border-divid-line);
				   border-radius: 4px;
				   font-size: 13px;
				   margin-bottom: 8px;
				   background: var(--card-history-bg);
				   overflow: auto;
			   }
			   #newadvfkeyword
			   {
				   width: 100%;
			   }
			   .adv-filter-keyword-optionlabel
			   {
				   padding: 3px 6px;
			   }
			   .keyword-regex::after
			   {
				   content: "[regex]";
				   color: red;
				   font-size: 10px;
				   vertical-align: bottom;
				   margin-left: 2px;
			   }
			   .keyword-regex:checked::after
			   {
				   color: pink;
			   }
			   .adv-filter-keyword-optionlabel
			   {
				   color: var(--text-default-color);
			   }
			   .adv-filter-keyword-optionlabel:checked
			   {
				   background: linear-gradient(0, var(--anime-primary-color), var(--anime-primary-color));
			   }
			   .adv-filter-input
			   {
				   background: var(--input-bg);
			   }
			   .adv-filter-input[type="number"]
			   {
				   width: 50px;
				   margin-left: auto;
			   }
			   select.adv-filter-input option
			   {
				   background: var(--anime-background-base);
			   }
			   .advf-operation-buttons .advf-bluebtn
			   {
				   margin-right: 8px;
			   }
		  </style>`).appendTo("head");
    }

    function initCustomUI()
    {
        // tab item
        $("<div></div>", {
            "class": "ani-tabs__item"
        }).append($("<a></a>", {
            "class": "ani-tabs-link",
            href: "#adv-filter-tab-content-1",
            text: "進階過濾"
        }).click(function() {
            $(".ani-tabs-link.is-active").removeClass("is-active");
            $(this).addClass("is-active");
            $(".ani-tab-content__item").css("display", "none");
            $($(this).attr("href")).css("display", "block");
            return false
        })).appendTo($(".ani-tabs"));

        // keyword body
        const keywordBody = $("<select></select>", {
            "class": "adv-filter-keyword-body",
            multiple: "multiple",
            click: function() {
                $(this).val(null);
            }
        });
        for(let keyword of config.keywords)
        {
            addKeywordOptionLabel(keyword);
        }

        // tab content
        $(".ani-tab-content").append($("<div></div>", {
            id: "adv-filter-tab-content-1",
            "class": "ani-tab-content__item",
            style: "display: none"
        }).append($("<div></div>", {
            "class": "ani-setting-section"
        }).append($("<h4></h4>", {
            "class": "ani-setting-title",
            text: "簡體字過濾器"
        })).append(createOption(function() {config.enable_filter_szh = $(this).is(":checked");}, "過濾簡體字", config.enable_filter_szh)).append(createInput((v) => config.pure_szh_threshold = v, "pure_szh_threshold", "簡體字過濾門檻", {
            type: "number",
            min: 1,
            value: config.pure_szh_threshold,
            placeholder: "1"
        })).append(createInput((v) => config.intersection_threshold = v, "intersection_threshold", "簡日交疊過濾門檻", {
            type: "number",
            min: 1,
            value: config.intersection_threshold,
            placeholder: "2"
        }))).append($("<div></div>", {
            "class": "ani-setting-section"
        }).append($("<h4></h4>", {
            "class": "ani-setting-title",
            text: "進階過濾器設定"
        })).append(createOption(function() {config.enable_filter_custom = $(this).is(":checked")}, "過濾關鍵字", config.enable_filter_custom)).append($("<div></div>", {
            "class": "ani-setting-item"
        }).append($("<div></div>", {
            "class": "adv-filter-keyword-header"
        }).append($("<input />", {
            "class": "ani-input adv-filter-input",
            type: "text",
            id: "newadvfkeyword",
            placeholder: "請輸入想要過濾的字詞，再按下新增"
        })).append($("<select></select>", {
            "class": "ani-input adv-filter-input",
            "id": "newkeyword-type"
        }).append($("<option value=\"text\">文字</option><option value=\"regex\">regex</option>"))).append($("<a></a>", {
            href: "#addadvfkeyword",
            text: "新增",
            "class": "bluebtn advf-bluebtn",
            role: "button",
            click: function() {
                const newkeyword = $("#newadvfkeyword").val();
                if(newkeyword == "")
                {
                    alert("關鍵字不能為空");
                    return false;
                }
                $("#newadvfkeyword").val("");
                const type = $("#newkeyword-type").val();
                if(addKeywords([{
                    keyword: newkeyword,
                    type: type
                }]) <= 0)
                    alert("關鍵字已經存在");
                $("adv-filter-keyword-body").val(newkeyword);
            }
        }))).append(keywordBody).append($("<div></div>", {
            "class": "advf-operation-buttons"
        }).append($("<button></button>", {
            "class": "advf-bluebtn bluebtn",
            text: "刪除",
            click: function() {
                if($(".adv-filter-keyword-body").val() === null)
                {
                    alert("請先選取要刪除的關鍵字");
                    return false;
                }
                removeKeywords($(".adv-filter-keyword-optionlabel:selected").map((i, e) => ({keyword: e.value, type: e.dataset.type})).get());
                $(".adv-filter-keyword-optionlabel:selected").remove();
            }
        })).append($("<button></button>", {
            "class": "advf-bluebtn bluebtn",
            text: "匯出",
            click: function() {
                let exportKeyword;
                if($(".adv-filter-keyword-body").val() === null)
                {
                    if(!confirm("確定要匯出全部關鍵字嗎"))
                        return;
                    else
                        exportKeyword = config.keywords;
                }
                else
                {
                    if(!confirm("確定要匯出所選取的關鍵字嗎"))
                        return;
                    else
                    {
                        const selectedKeyword = $(".adv-filter-keyword-optionlabel:selected").map((i, v) => v.value).get();
                        exportKeyword = config.keywords.filter((e) => selectedKeyword.find((v) => e.keyword === v));
                    }
                }
                const textData = new Blob([JSON.stringify(exportKeyword)], {type: "text/json"});
                const url = window.URL.createObjectURL(textData);
                $("<a></a>", {
                    href: url,
                    download: "export.json"
                }).get()[0].click();
            }
        })).append($("<button></button>", {
            "class": "advf-bluebtn bluebtn",
            id: "advf-import-keyword",
            text: "匯入",
            click: async () => {
                try
                {
                    const fileHandles = await showOpenFilePicker.call(undefined, {
                        types: [
                            {
                                description: "JSON",
                                accept: {
                                    "json/*": [".json"]
                                }
                            }
                        ],
                        multiple: true
                    });
                    try
                    {
                        for(let fileHandle of fileHandles)
                        {
                            const data = JSON.parse(await (await fileHandle.getFile()).text());
                            if(confirm("確定要匯入以下清單嗎: \n" + data.map((e) => `${e.type}: \t${e.keyword}`).join("\n"))) addKeywords(data);
                        }
                    }
                    catch(exp)
                    {
                        alert("匯入錯誤: \n" + exp.toString());
                        console.error(exp);
                    }
                }
                catch(_) {}
            }
        }))))));
    }
    window.addEventListener("load", () => {
        initCSS();
        initCustomUI();
    });
    // inject filter
    /* Object.defineProperty(animefun, "danmu", {
        set: function(i) {
            if(config.enable_filter_szh)
            {
                i = filter_szh(i);
            }
            if(config.enable_filter_custom)
            {
                i = filter_custom(i);
            }
            this._danmu = i;
        },
        get: function() {
            return this._danmu;
        }
    }); */
    (function(originalFetch) {
        console.log("fetch inject");
        window.fetch = async function(url, options) {
            const response = await originalFetch(url, options);
            // url.url for kaspersky override version of fetch
            if(url.toString().includes("danmu.php") || url?.url?.includes?.("danmu.php"))
            {
                let danmuJson = await response.json();
                console.log("capture danmu");
                if(config.enable_filter_szh)
                {
                    danmuJson.data.danmu = filter_szh(danmuJson.data.danmu);
                }
                if(config.enable_filter_custom)
                {
                    danmuJson.data.danmu = filter_custom(danmuJson.data.danmu);
                }
                return new Response(JSON.stringify(danmuJson), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
            else
            {
                return response;
            }
        };
    })(window.fetch);
})();