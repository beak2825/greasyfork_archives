// ==UserScript==
// @note                2019.10.25更新V1.1 新增鼠标移入单词时，单词静止，等待主人去临幸，鼠标移出时，继续开始背单词;新增双击单词模式，可以暂停背单词或者重新开始背单词
// @name                轻松背单词
// @name:zh-TW          輕松背單詞
// @name:zh-CN          轻松背单词
// @name:ja             簡単に言葉を暗唱する
// @description         利用上网碎片时间，轻松记住单词，每多记住一个单词你就赚到了，日积月累
// @description:zh-TW   利用上網碎片時間，輕松記住單詞，每多記住壹個單詞妳就賺到了，日積月累
// @description:zh-CN   利用上网碎片时间，轻松记住单词，每多记住一个单词你就赚到了，日积月累
// @description:ja      インターネット上の断片化の時間を使用して、単語を簡単に覚えることができます。
// @namespace            HopefulSun
// @version              1.1 
// @author               HopefulSun
// @include              http://*
// @include              https://*
// @require              http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant                none
// @run-at               document-body
// @license              CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/391539/%E8%BD%BB%E6%9D%BE%E8%83%8C%E5%8D%95%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/391539/%E8%BD%BB%E6%9D%BE%E8%83%8C%E5%8D%95%E8%AF%8D.meta.js
// ==/UserScript==
(function() {
	var a = new Array("absolute [ˈæbsəluːt] a.绝对的；纯粹的", "abundant [əˈbʌndənt] a.丰富的；大量的", "abuse [əˈbjuːz] vt.滥用；虐待 n.滥用", "academic [ˌækəˈdemik] a.学院的；学术的", "academy [əˈkædəmi] n.私立中学；专科院校", "accelerate [ækˈseləreit] vt.(使)加快；促进", "accomplish [əˈkɔmpli∫] vt.达到(目的)；完成", "acid [ˈæsid] n.酸；酸的，酸性的", "acquire [əˈkwaiə] vt.取得；获得；学到", "adapt [əˈdæpt] vt.使适应；改编", "adequate [ˈædikwit] a.足够的；可以胜任的", "adjust [əˈdʒʌst] vt.调整，调节；校正", "adopt [əˈdɔpt] vt.收养；采用；采取", "adult [ˈædʌlt] n.成年人 a.成年的", "advertisement [ədˈvəːtismənt] n.广告；公告；登广告", "agency [ˈeidʒənsi] n.经办；代理；代理处", "agent [ˈeidʒənt] n.代理人，代理商", "alcohol [ˈælkəhɔl] n.酒精，乙醇", "alter [ˈɔːltə] vt.改变，变更；改做", "apparent [əˈpærənt] a.表面上的；明显的", "appeal [əˈpiːl] vi.&n.呼吁；申述", "appetite [ˈæpitait] n.食欲，胃口；欲望", "appliance [əˈplaiəns] n.用具，器具，器械", "applicable [ˈæplikəbl] a.能应用的；适当的", "appoint [əˈpɔint] vt.任命，委任；约定", "appreciate [əˈpriː∫ieit] vt.欣赏；领会；感谢", "approach [əˈprəut∫] vt.向…靠近 n.靠近", "appropriate [əˈprəupriit] a.适当的，恰当的", "approve [əˈpruːv] vt.赞成，称许；批准", "approximate [əˈprɔksimeit] a.近似的 vt.近似", "arbitrary [ˈɑːbitrəri] a.随心所欲的；专断的", "architecture [ˈɑːkitekt∫ə] n.建筑学；建筑式样", "arise [əˈraiz] vi.出现；由…引起", "arouse [əˈrauz] vt.引起，唤起；唤醒", "aspect [ˈæspekt] n.方面；样子，外表", "attach [əˈtæt∫] vt.缚，系，贴；附加", "attitude [ˈætitjuːd] n.态度，看法；姿势", "authority [ɔːˈθɔriti] n.当局，官方；权力", "automatic [ˌɔːtəˈmætik] a.自动的；机械的", "auxiliary [ɔːgˈziljəri] a.辅助的；附属的", "available [əˈveiləbl] a.可利用的；通用的", "avenue [ˈævinjuː] n.林荫道，道路；大街", "award [əˈwɔːd] n.奖，奖品；判定", "aware [əˈweə] a.知道的，意识到的", "awful [ˈɔːful] a.令人不愉快的", "awkward [ˈɔːkwəd] a.笨拙的；尴尬的", "bacteria [bækˈtiəriə] n.细菌", "bargain [ˈbɑːgin] n.交易 vi.议价；成交", "barrel [ˈbærəl] n.桶；圆筒；枪管", "barrier [ˈbæriə] n.栅栏，屏障；障碍", "battery [ˈbætəri] n.电池；一套，一组", "biology [baiˈɔlədʒi] n.生物学；生态学", "blast [blɑːst] n.爆炸，冲击波 vt.炸", "bother [ˈbɔðə] vt.烦扰，迷惑 n.麻烦", "boundary [ˈbaundəri] n.分界线，办界", "brake [breik] n.闸，刹车 vi.制动", "breadth [bredθ] n.宽度，幅度；幅面", "breed [briːd] n.品种 vt.使繁殖", "bunch [bʌnt∫] n.束，球，串；一群", "bundle [ˈbʌndl] n.捆，包，束；包袱", "burden [ˈbəːdn] n.担子，重担；装载量", "bureau [bjuəˈrəu] n.局，司，处；社，所", "burst [bəːst] vt.使爆裂 vi.&n.爆炸", "calculate [ˈkælkjuleit] vt.计算；估计；计划", "calendar [ˈkælində] n.日历，历书；历法", "campus [ˈkæmpəs] n.校园，学校场地", "cancel [ˈkænsəl] vt.取消，撤消；删去", "candidate [ˈkændidit] n.候选人；投考者", "capture [ˈkæpt∫ə] vt.捕获，俘获；夺得", "career [kəˈriə] n.生涯，职业，经历", "cargo [ˈkɑːgəu] n.船货，货物", "casual [ˈkæʒuəl] a.偶然的；随便的", "catalog [ˈkætəlɔg] n.目录，目录册", "ceremony [ˈseriməni] n.典礼，仪式；礼节", "cliff [klif] n.悬崖，峭壁", "clue [kluː] n.线索，暗示，提示", "coach [kəut∫] n.长途公共汽车", "coarse [kɔːs] a.粗的，粗糙的", "code [kəud] n.准则；法典；代码", "coil [kɔil] n.(一)卷；线圈 vt.卷", "collision [kəˈliʒən] n.碰撞；冲突", "column [ˈkɔləm] n.柱，支柱，圆柱", "comment [ˈkɔment] n.评论，意见；注释", "commit [kəˈmit] vt.犯(错误);干(坏事) ", "community [kəˈmjuːniti] n.社区；社会；公社", "comparative [kəmˈpærətiv] a.比较的，相对的", "compete [kəmˈpiːt] vi.比赛；竞争；对抗", "competent [ˈkɔmpitənt] a.有能力的；应该做的", "competition [kɔmpiˈti∫ən] n.竞争，比赛", "conquer [ˈkɔŋkə] vt.征服，战胜；破除", "consent [kənˈsent] n.同意，赞成 vi.同意", "conservation [ˌkɔnsə(ː)ˈvei∫ən] n.保存，保护；守恒", "conservative [kənˈsəːvətiv] a.保守的 n.保守的人", "consistent [kənˈsistənt] a.坚持的，一贯的", "constant [ˈkɔnstənt] a.经常的；永恒的", "consume [kənˈsjuːm] vt.消耗，消费；消灭", "continual [kənˈtinjuəl] a.不断的；连续的", "continuous [kənˈtinjuəs] a.连续不断的，持续的", "cope [kəup] vi.对付，应付", "core [kɔː] n.果实的心，核心", "dash [dæ∫] vt.使猛撞；溅 n.猛冲", "data [ˈdeitə] n.数据; 资料", "deaf [def] a.聋的；不愿听的", "debate [diˈbeit] n.&vi.争论，辩论", "debt [det] n.债，债务，欠债", "decade [ˈdekeid] n.十年，十年期", "decay [diˈkei] vi.腐烂；衰败 n.腐烂", "decent [ˈdiːsnt] a.正派的；体面的", "decorate [ˈdekəreit] vt.装饰，装璜，修饰", "defect [diˈfekt] n.缺点，缺陷，欠缺", "delay [diˈlei] vt.推迟；耽搁；延误", "delicate [ˈdelikit] a.纤细的；易碎的", "deposit [diˈpɔzit] vt.使沉淀；存放", "derive [diˈraiv] vt.取得 vi.起源", "descend [diˈsend] vi.下来，下降；下倾", "deserve [diˈzəːv] vt.应受，值得", "device [diˈvais] n.器械，装置；设计", "devise [diˈvaiz] vt.设计，发明", "discipline [ˈdisiplin] n.纪律；训练 vt.训练", "display [diˈsplei] vt.陈列，展览；显示", "dispose [disˈpəuz] vi.去掉，丢掉；销毁", "distinguish [disˈtiŋgwi∫] vt.区别，辨别，认别", "distress [disˈtres] n.忧虑，悲伤；不幸", "distribute [disˈtribju(ː)t] vt.分发，分送；分布", "disturb [disˈtəːb] vt.打扰，扰乱；弄乱", "dive [daiv] vi.跳水；潜水；俯冲", "diverse [daiˈvəːs] a.不一样的，相异的", "domestic [dəˈmestik] a.本国的；家庭的", "drift [drift] vi.漂流，漂泊 n.漂流", "drip [drip] vi.滴下；漏水 n.水滴", "dumb [dʌm] a.哑的；无言的", "dump [dʌmp] vt.倾卸，倾倒；倾销", "durable [ˈdjuərəbl] a.耐久的，耐用的", "duration [djuəˈrei∫ən] n.持续，持久", "dusk [dʌsk] n.薄暮，黄昏，幽暗", "earthquake [ˈəːθkweik] n.地震；大震荡", "echo [ˈekəu] n.回声，反响 vi.重复", "elaborate [iˈlæbərət] a.复杂的；精心制作的", "elastic [iˈlæstik] n.松紧带 a.有弹性的", "elbow [ˈelbəu] n.肘，肘部；弯管", "electron [iˈlektrɔn] n.电子", "emotion [iˈməu∫ən] n.情感，感情；激动", "emotional [iˈməu∫ənl] a.感情的，情绪的", "emphasize [ˈemfəsaiz] vt.强调，着重", "enclose [inˈkləuz] vt.围住，圈起；附上", "encounter [inˈkauntə] vt.遭遇，遇到 n.遭遇", "enthusiasm [inˈθjuːziæzəm] n.热情/心，热忱", "entitle [inˈtaitl] vt.给…权利(或资格)", "entry [ˈentri] n.入口处；登记；进入", "equation [iˈkwei∫ən] n.方程(式)；等式", "equivalent [iˈkwivələnt] a.相等的；等量的", "erect [iˈrekt] vt.建造；使竖立", "essential [iˈsen∫əl] a.必要的，本质的", "estimate [ˈestimeit] vt.估计，评价 n.估计", "evil [ˈiːvl] n.邪恶；祸害 a.坏的", "evolution [evəˈluː∫ən] n.进化，演化；发展", "evolve [iˈvɔlv] vt.使进化；使发展", "exaggerate [igˈzædʒəreit] vt.&vi.夸大，夸张", "exceed [ikˈsiːd] vt.超过，胜过；超出", "exceedingly [ikˈsiːdiŋli] ad.极端地，非常", "excess [ˈekses] n.超越；过量；过度", "exclaim [iksˈkleim] vi.呼喊；惊叫", "exclude [iksˈkluːd] vt.把…排除在外", "excursion [iksˈkəː∫ən] n.远足；短途旅行", "expand [iksˈpænd] vt.扩大；使膨胀", "expansion [iksˈpæn∫ən] n.扩大，扩充；扩张", "expense [ikˈspens] n.花费，消费；费用", "expensive [iksˈpensiv] a.昂贵的，花钱多的", "explode [iksˈpləud] vt.使爆炸 vi.爆炸", "exploit [iksˈplɔit] vt.剥削；利用；开拓", "explore [iksˈplɔː] vt.&vi.探险，探索", "explosion [iksˈpləuʒən] n.爆炸，爆发，炸裂", "explosive [iksˈpləusiv] n.炸药 a.爆炸的", "export [ˈekspɔːt] vt.输出，出口；运走", "extent [iksˈtent] n.广度；范围；程度", "exterior [eksˈtiəriə] a.外部的；对外的", "external [eksˈtəːnl] a.外部的，外面的", "extraordinary [ikˈstrɔːdəneri] a.非同寻常的，特别的", "extreme [ikˈstriːm] a.极度的；尽头的", "facility [fəˈsiliti] n.设备；容易；便利", "faculty [ˈfækəlti] n.才能，能力；系，科", "fatal [ˈfeitl] a.致命的；命运的", "fate [feit] n.命运，天数", "fatigue [fəˈtiːg] n.疲劳，劳累", "faulty [ˈfɔːlti] a.有错误的，有缺点的", "female [ˈfiːmeil] n.雌性的动物；女子", "fertilizer [ˈfəːtiˌlaizə] n.肥料", "flash [flæ∫] n.闪光 vi.闪，闪烁", "flexible [ˈfleksəbl] a.易弯曲的；灵活的", "flock [flɔk] n.羊群，群；大量", "focus [ˈfəukəs] vi.聚焦，注视 n.焦点", "forbid [fəˈbid] vt.禁止，不许；阻止", "frown [fraun] vi.皱眉，蹙额", "gallery [ˈgæləri] n.长廊，游廊；画廊", "gallon [ˈgælən] n.加仑", "gap [gæp] n.缺口；间隔；差距", "garbage [ˈgɑːbidʒ] n.垃圾，污物，废料", "gasoline [ˈgæsəliːn] n.(美)汽油", "gaze [geiz] vi.凝视，盯，注视", "generate [ˈdʒenəˌreit] vt.发生；引起；生殖", "genius [ˈdʒiːnjəs] n.天才，天赋，天资", "genuine [ˈdʒenjuin] a.真的；真正的", "geography [dʒiˈɔgrəfi] n.地理，地理学", "geometry [dʒiˈɔmitri] n.几何，几何学", "germ [dʒəːm] n.微生物，细菌，幼芽", "gesture [ˈdʒest∫ə] n.姿势，手势；姿态", "giant [ˈdʒaiənt] n.巨人；巨物", "glimpse [glimps] vt.瞥见 n.一瞥，一看", "globe [gləub] n.地球，世界；地界仪", "glorious [ˈglɔːriəs] a.光荣的；壮丽的", "glory [ˈglɔːri] n.光荣；荣誉的事", "golf [gɔlf] n.高尔夫球", "grand [grænd] a.宏伟的；重大的", "grant [grɑːnt] n.授给物 vt.授予", "grateful [ˈgreitful] a.感激的；令人愉快的", "gratitude [ˈgrætitjuːd] a.感激，感谢，感恩", "guarantee [ˌgærənˈtiː] n.保证；担保物", "guilty [ˈgilti] a.内疚的；有罪的", "hardware [ˈhɑːdweə] n.五金器具；硬件", "harmony [ˈhɑːməni] n.调合，协调，和谐", "haste [heist] n.急速，急忙；草率", "hatred [ˈheitrid] n.憎恶，憎恨，仇恨", "hence [hens] ad.因此，所以；今后", "herd [həːd] n.兽群，牧群 vt.放牧", "hint [hint] n.暗示，示意；建议", "hollow [ˈhɔləu] a.空的；空洞的", "holy [ˈhəuli] a.神圣的；圣洁的", "hook [huk] n.钩，挂钩 vt.钩住", "horror [ˈhɔrə] n.恐怖；战栗；憎恶", "hostile [ˈhɔstail] a.敌方的；不友善的", "household [ˈhaushəuld] n.家庭，户；家务", "humble [ˈhʌmbl] a.谦逊的；地位低下的", "hydrogen [ˈhaidrəudʒən] n.氢", "identify [aiˈdentifai] vt.认出，识别，鉴定", "idle [ˈaidl] a.空闲的；懒散的", "illegal [iˈliːgəl] a.不合法的，非法的", "import [imˈpɔːt] vt.&n.输入，进口", "impose [imˈpəuz] vt.把…强加；征(税)", "incident [ˈinsidənt] n.发生的事；事件", "index [ˈindeks] n.索引；指数；指标", "individual [ˌindiˈvidjuəl] a.个别的；独特的", "inevitable [inˈevitəbl] a.不可避免的，必然的", "infant [ˈinfənt] n.婴儿 a.婴儿的", "infect [inˈfekt] vt.传染；感染", "infer [inˈfəː] vt.推论，推断；猜想", "inferior [inˈfiəriə] a.下等的；劣等的", "infinite [ˈinfinit] a.无限的；无数的", "inhabitant [inˈhæbitənt] n.居民，住户", "insurance [inˈ∫uərəns] n.保险；保险费", "insure [inˈ∫uə] vt.给…保险；确保", "interfere [ˌintəˈfiə] vi.干涉，干预；妨碍", "internal [inˈtəːnl] a.内的；国内的", "interpret [inˈtəːprit] vt.解释，说明；口译", "interpretation [inˌtəːpriˈtei∫ən] n.解释；口译", "invade [inˈveid] vt.入侵，侵略；侵袭", "isolate [ˈaisəleit] vt.使隔离，使孤立", "issue [ˈisjuː] n.问题；发行 vt.发行", "jail [dʒeil] n.监狱 vi.监禁", "jam [dʒæm] n.果酱", "jam vt.使塞满；使堵塞", "jealous [ˈdʒeləs] a.妒忌的；猜疑的", "jewel [ˈdʒuːəl] n.宝石；宝石饰物", "joint [dʒɔint] n.接头，接缝；关节", "jungle [ˈdʒʌŋgl] n.丛林，密林，莽丛", "junior [ˈdʒuːnjə] a.年少的 n.晚辈", "kneel [niːl] vi.跪，跪下，跪着", "knot [nɔt] n.(绳的)结，(树的)节", "label [ˈleibl] n.标签；标记，符号", "laser [ˈleizə] n.激光", "launch [lɔːnt∫] vt.发射，投射；发动", "leak [liːk] vi.漏；泄露 n.漏洞", "lean [liːn] vi.倾斜，屈身；靠", "leap [liːp] vi.跳，跃 n.跳跃", "leather [ˈleðə] n.皮革；皮革制品", "leisure [ˈliːʒə] n.空闲时间；悠闲", "lest [lest] conj.惟恐，以免", "liable [ˈlaiəbl] a.易于…的；可能的", "liberal [ˈlibərəl] a.心胸宽大的；慷慨的", "liberty [ˈlibəti] n.自由；释放；许可", "liquor [ˈlikə] n.酒；溶液，液剂", "loose [luːs] a.松的；宽松的", "loosen [ˈluːsn] vt.解开；使松驰", "luxury [ˈlʌk∫əri] n.奢侈，奢华；奢侈品", "magnet [ˈmægnit] n.磁铁，磁石，磁体", "mainland [ˈmeinlənd", "maintain [meinˈtein] vt.维持；赡养；维修", "male [meil] a.男的，雄的 n.男子", "manual [ˈmænjuəl] a.体力的 n.手册", "manufacture [ˌmænjuˈfækt∫ə] vt.制造 n.制造；产品", "marine [məˈriːn] a.海的；海上的", "mature [məˈtjuə] a.成熟的 vt.使成熟", "maximum [ˈmæksiməm] n.最大量 a.最大的", "medium [ˈmiːdjəm] n.媒质；中间 a.中等的", "merchant [ˈməːt∫ənt] n.商人；零售商", "mere [miə] a.仅仅的；纯粹的", "mild [maild] a.和缓的；温柔的", "minimum [ˈminiməm] n.最小量 a.最小的", "missile [ˈmisail] n.发射物；导弹", "mission [ˈmi∫ən] n.使命，任务；使团", "mist [mist] n.薄雾", "mixture [ˈmikst∫ə] n.混合；混合物", "modest [ˈmɔdist] a.有节制的；谦虚的", "modify [ˈmɔdifai] vt.更改，修改；修饰", "moist [mɔist] a.湿润的；多雨的", "moisture [ˈmɔist∫ə] n.潮湿，湿气；温度", "molecule [ˈmɔlikjuːl n.分子，克分子", "mood [muːd] n.心情，情绪；语气", "moral [ˈmɔrəl] a.道德的；合乎道德的", "motivate [ˈməutiveit] vt.促动；激励，激发", "motive [ˈməutiv] n.动机，目的", "mutual [ˈmjuːtjuəl] a.相互的；共同的", "naked [ˈneikid] a.裸体的；无遮敝的", "naval [ˈneivəl] n.海军的，军舰的", "navigation [ˌnæviˈgei∫ən] n.航行;航海术;导航", "necessity [niˈsesiti] n.必要性；必然性", "negative [ˈnegətiv] a.否定的；消极的", "neglect [niˈglekt] vt.忽视，忽略；疏忽", "network [ˈnetwəːk] n.网状物；网络", "neutral [ˈnjuːtrəl] a.中立的；中性的", "nevertheless [ˌnevəðəˈles] conj.然而 ad.仍然", "nonsense [ˈnɔnsəns] n.胡说，废话", "noticeable [ˈnəutisəbl] a.显而易见/重要的", "nuclear [ˈnjuːkliə] a.原子核的；核心的", "nucleus [ˈnjuːkliəs] n.核，核心；(原子)核", "nuisance [ˈnjuːsns] n.讨厌的东西", "nylon [ˈnailən] n.尼龙，耐纶", "oblige [əˈblaidʒ] vt.迫使；施恩惠于", "obstacle [ˈɔbstəkl] n.障碍，障碍物，妨害", "odd [ɔd] a.奇数的；单只的", "offend [əˈfend] vt.冒犯 vi.犯过错", "omit [əuˈmit] vt.省略，省去；遗漏", "onion [ˈʌnjən] n.洋葱，洋葱头", "opponent [əˈpəunənt] n.对手", "opportunity [ˌɔpəˈtjuːniti] n.机会，良机", "optimistic [ˌɔptiˈmistik] a.乐观/乐观主义的", "optional [ˈɔp∫ənəl] a.可以任意选择的", "oral [ˈɔːrəl] a.口头的；口的", "orbit [ˈɔːbit] n.运行轨道 vt.环绕", "orchestra [ˈɔːkistrə] n.管弦乐队", "organ [ˈɔːgən] n.器官；机构；管风琴", "origin [ˈɔridʒin] n.起源，由来；出身", "outset [ˈautset] n.开始，开端", "outstanding [autˈstændiŋ] a.突出的，杰出的", "parade [pəˈreid] n.游行；检阅 vi.游行", "parallel [ˈpærəlel] a.平行的；相同的", "partial [ˈpɑː∫əl] a.部分的；不公平的", "participate [pɑːˈtisipeit] vi.参与/加；分享", "particle [ˈpɑːtikl] n.粒子，微粒", "particularly [pəˈtikjuləli] ad.特别", "passion [ˈpæ∫ən] n.激情，热情；爱好", "passive [ˈpæsiv] a.被动的；消极的", "passport [ˈpɑːspɔːt] n.护照", "pat [pæt] n.&vt.&n.轻拍", "peak [piːk] n.山顶，巅 a.最高的", "personal [ˈpəːsənl] a.个人的；本人的", "personnel [ˌpəːsəˈnel] n.全体人员，全体职员", "petrol [ˈpetrəl] n.(英)汽油", "petroleum [piˈtrəuliəm] n.石油", "phenomenon [fiˈnɔminən] n.现象", "portable [ˈpɔːtəbl] a.轻便的；手提的", "portion [ˈpɔː∫ən] n.一部分；一分", "poverty [ˈpɔvəti] n.贫穷，贫困", "powder [ˈpaudə] n.粉末；药粉；火药", "precaution [priˈkɔː∫ən] n.预防；警惕", "prescribe [prisˈkraib] vt.命令；处(方)", "preserve [priˈzəːv] vt.保护；保存；腌渍", "prevail [priˈveil] vi.胜，优胜；流行", "previous [ˈpriːviəs] a.先的；前的 ad.在前", "primitive [ˈprimitiv] a.原始的；粗糙的", "principal [ˈprinsip(ə)l] a.主要的 n.负责人", "principle [ˈprinsəpl] n.原则，原理；主义", "prior [ˈpraiə] a.在先的；优先的", "private [ˈpraivit] a.私人的；私下的", "professional [prəˈfe∫ənl] a.职业的 n.专业人员", "profit [ˈprɔfit] n.益处；利润 vi.得益", "prohibit [prəˈhibit] vt.禁止，阻止", "prominent [ˈprɔminənt] a.实起的；突出的", "promote [prəˈməut] vt.促进，发扬；提升", "prompt [prɔmpt] a.及时的 vt.敦促", "prospect [ˈprɔspekt] n.展望；前景，前程", "prosperity [prɔsˈperiti] n.繁荣；昌盛，兴旺", "provision [prəˈviʒən] n.供应；预备；存粮", "pursue [pəˈsjuː] vt.追赶，追踪；进行", "quit [kwit] vt.离开，退出；停止", "quotation [kwəuˈtei∫ən] n.引用；引文；报价单", "racial [ˈrei∫əl] a.种族的，人种的", "radiation [ˌreidiˈei∫ən] n.放/发射；辐射能", "range [reindʒ] n.排，行；山脉；范围", "region [ˈriːdʒən] n.地区，地带；领域", "register [ˈredʒistə] n.&vt.登记，注册", "regulate [ˈregjuleit] vt.管理，控制；调整", "reinforce [ˌriːinˈfɔːs] vt.增援，支援；加强", "reject [riˈdʒekt] vt.拒绝；丢掉；驳回", "release [riˈliːs] vt.释放；放松；发表", "relevant [ˈrelivənt] a.有关的，贴切的", "reliable [riˈlaiəbl] a.可靠的，可信赖的", "relief [riˈliːf] n.减轻；救济；援救", "religion [riˈlidʒən] n.宗教；宗教信仰", "religious [riˈlidʒəs] a.宗教的；虔诚的", "reluctant [riˈlʌktənt] a.不愿的，勉强的", "rely [riˈlai] vi.依赖，依靠；信赖", "remarkable [riˈmɑːkəbl] a.异常的，非凡的", "remedy [ˈremidi] n.&vt.治疗；补救", "remote [riˈməut] a.相隔很远的；冷淡的", "removal [riˈmuːvəl] n.移动；迁移；除掉", "render [ˈrendə] vt.表示，给予；使得", "repetition [ˌrepiˈti∫ən] n.重复，反复", "reputation [ˌrepju(ː)ˈtei∫ən] n.名誉/声；好名声", "rescue [ˈreskjuː] vt.&n.援救，营救", "resemble [riˈzembl] vt.像，类似", "resistant [riˈzistənt] a.抵抗的，反抗的", "resolve [riˈzɔlv] vt.解决；决心 n.决心", "respond [risˈpɔnd] vi.作答；响应", "response [risˈpɔns] n.作答，回答；响应", "restrain [risˈtrein] vt.抑制，遏制；限制", "restraint [risˈtreint] n.抑制；遏制；克制", "restrict [risˈtrikt] vt 限制，限定，约束", "resume [riˈzjuːm] vt.恢复；重新开始", "retain [riˈtein] vt.保持，保留，保有", "reveal [riˈviːl] vt.展现；揭示，揭露", "ridge [ridʒ] n.脊；岭，山脉；垄", "ridiculous [riˈdikjuləs] a.荒谬的，可笑的", "rival [ˈraivəl] n.竞争者 a.竞争的", "route [ruːt] n.路，路线，路程", "ruin [ˈruːin] n.毁灭；废墟 vt.毁坏", "sake [seik] n.缘故，理由", "satellite [ˈsætəlait] n.卫星；人造卫星", "scale [skeil] n.天平，磅秤，秤", "scale n.标度；比例；大小", "scan [skæn] vt.细看；浏览；扫描", "scratch [skræt∫] vt.&vi.&n.搔；抓", "secure [siˈkjuə] a.安心的；安全的", "security [siˈkjuəriti] n.安全，安全感", "semester [siˈmestə] n.半年；学期，半学年", "semiconductor [ˈsemikənˈdʌktə] n.半导体", "sensible [ˈsensəbl] a.感觉得到的；明智的", "sensitive [ˈsensitiv] a.敏感的；灵敏的", "sequence [ˈsiːkwəns] n.连续，继续；次序", "severe [siˈviə] a.严格的；严厉的", "shallow [ˈ∫æləu] a.浅的；浅薄的", "shelter [ˈ∫eltə] n.隐蔽处；掩蔽，庇护", "shield [∫iːld] n.盾；防护物 vt.保护", "shift [∫ift] vt.替换，转移 n.转换", "shiver [ˈ∫ivə] vi.颤抖，哆嗦 n.冷颤", "shrink[∫riŋk] vi.收缩；缩小；退缩", "signature [ˈsignit∫ə] n.署名，签字，签名", "significance [sigˈnifikəns] n.意义，意味；重要性", "simplicity [simˈplisiti] n.简单，简易；朴素", "simplify [ˈsimplifai] vt.简化，使单纯", "sincere [sinˈsiə] a.真诚的；真挚的", "sketch [sket∫] n.略图；速写；概略", "skim [skim] vt.掠过，擦过；略读", "slender [ˈslendə] a.细长的；微薄的", "slide [slaid] vi.滑 vt.使滑动 n.滑", "slip [slip] vi.滑跤；滑落；溜", "slippery [ˈslipəri] a.滑的，使人滑跤的", "slope [sləup] n.倾斜；斜面 vi.倾斜", "solar [ˈsəulə] a.太阳的，日光的", "sophisticated [səˈfistikeitid] a.老于世故的;高级的", "sorrow [ˈsɔrəu] n.悲痛，悲哀，悲伤", "spill [spil] vt.使溢出 vi.溢出", "spit [spit] vi.吐 vi.吐唾沫", "splendid [ˈsplendid] a.壮丽的；显著的", "split [split] vt.劈开 vi.被劈开", "sponsor [ˈspɔnsə] n.发起者 vt.发起", "spot [spɔt] n.点，斑点；地点", "spray [sprei] n.浪花；喷雾 vt.喷", "spur [spəː] n.刺激物 vt.刺激", "stable [ˈsteibl] a.稳定的，不变的", "stable n.厩，马厩，牛棚", "stale [steil] n.陈腐的；走了气的", "stimulate [ˈstimjuleit] vt.刺激，激励，激发", "strategy [ˈstrætidʒi] n.战略；策略", "stripe [straip] n.条纹，条子", "stuff [stʌf] n.材料 vt.装，填，塞", "submerge [səbˈməːdʒ] vt.浸没 vi.潜入水中", "submit [səbˈmit] vt.使服从 vi.服从", "subsequent [ˈsʌbsikwənt] a.随后的，后来的", "substance [ˈsʌbstəns] n.物质；实质；本旨", "substantial [səbˈstæn∫əl] a.物质的；坚固的", "substitute [ˈsʌbstitjuːt] n.代替人 vt.用…代替", "subtract [səbˈtrækt] vt.减，减去，去掉", "suburb [ˈsʌbəːb] n.郊区，郊外，近郊", "subway[ ˈsʌbwei] n.地道；地下铁路", "survey [səːˈvei] vt.俯瞰；检查；测量", "suspicion [səsˈpi∫ən] n.怀疑，疑心，猜疑", "swallow [ˈswɔləu] n.燕子", "swallow vt.&vi.吞下，咽下", "talent [ˈtælənt] n.天才；才能；人才", "target [ˈtɑːgit] n.靶，标的；目标", "tedious [ˈtiːdiəs] a.冗长乏味的，沉闷的", "temple [ˈtempl] n.圣堂，神殿，庙宇", "temporary [ˈtempərəri] a.暂时的，临时的", "temptation [tempˈtei∫ən] n.诱惑，引诱", "tend [tend] vt.照管，照料，护理", "tend vi.走向，趋向；倾向", "tendency [ˈtendənsi] n.趋向，趋势，倾向", "tender [ˈtendə] a.嫩的；脆弱的", "tense [tens] n.时态，时", "tense a.拉紧的，绷紧的", "terminal [ˈtəːminl] a.末端的 n.末端", "territory [ˈteritəri] n.领土，版图；领域", "terror [ˈterə] n.恐怖，惊骇", "textile [ˈtekstail] n.纺织品 a.纺织的", "the [ðə] art.(定冠词)这，那", "thrust [θrʌst] vt.插，刺 n.插；讽刺", "tide [taid] n.潮，潮汐；潮流", "tidy [ˈtaidi] a.整洁的；整齐的", "timber [ˈtimbə] n.木材，木料", "tissue [ˈtisjuː] n.薄绢；薄纸；组织", "title [ˈtaitl] n.标题，题目；称号", "tone [təun] n.音；腔调；声调", "torture [ˈtɔːt∫ə] n.拷问；折磨 vt.拷打", "trace [treis] n.痕迹；丝毫 vt.跟踪", "transform [trænsˈfɔːm] vt.改变/造；变换", "transmit [trænzˈmit] vt.传送，传达；发射", "transport [trænsˈpɔːt] vt.运输 n.运输", "trap [træp] n.陷阱；诡计 vt.诱骗", "treaty [ˈtriːti] n.条约；协议，协定", "tremble [ˈtrembl] vi.发抖，哆嗦；摇动", "tremendous [triˈmendəs] a.极大的，非常的", "trend [trend] vi.伸向；倾向 n.倾向", "trial [ˈtraiəl] n.试，试验；审判", "triangle [ˈtraiæŋgl] n.三角(形)", "triumph [ˈtraiəmf] n.凯旋；胜利 vi.成功", "tropical [ˈtrɔpikl] a.热带的", "tuition [tjuːˈi∫ən] n.教，教诲；学费", "twist [twist] vt.捻；拧 vi.&n.扭弯", "ultimate [ˈʌltimit] a.最后的，最终的", "undergo [ˌʌndəˈgəu] vt.经历，经受，忍受", "undergraduate [ˌʌndəˈgrædjuit] n.大学肆业生", "undertake [ˌʌndəˈteik] vt.从事；承担；保证", "unique [juːˈniːk] a.唯一的，独一无二的", "universal [ˌjuːniˈvəːsəl] a.宇宙的；普遍的", "universe [ˈjuːnivəːs] n.宇宙，世界", "urge [əːdʒ] vt.推进；催促 n.冲动", "urgent [ˈəːdʒənt] a.紧急的；强求的", "usage [ˈjuːsidʒ] n.使用，对待；惯用法", "utter [ˈʌtə] a.完全的，彻底的", "utter vt.发出，说，讲", "vacant [ˈveikənt] a.空的；未被占用的", "vacuum [ˈvækjuəm] n.真空；真空吸尘器", "vague [veig] a.模糊的，含糊的", "vain [vein] a.徒劳的；自负的", "valid [ˈvælid] a.有效的；正当的", "valley [ˈvæli] n.(山)谷，溪谷；流域", "vanish [ˈvæni∫] vi.突然不见，消失", "variable [ˈveəriəbl] a.易变的 n.变量", "variation [ˌveəriˈei∫ən] n.变化，变动；变异", "vary [ˈveəri] vt.改变；使多样化", "vehicle [ˈviːikl] n.车辆，机动车", "venture [ˈvent∫ə] n.&vi.冒险 vt.敢于", "version [ˈvəː∫(ə)n; (US) ˈvərʒn] n.译文；说法；改写本", "vertical [ˈvəːtik(ə)l] a.垂直的，竖式的", "vessel [ˈvesl] n.容器；船，飞船；管", "via [ˈvaiə] prep.经过；通过", "vibrate [vaiˈbreit] vt.使颤动 vi.颤动", "victim [ˈviktim] n.牺牲者，受害者", "video [ˈvidiəu] a.电视的 n.电视", "violence [ˈvaiələns] n.猛烈，激烈；暴力", "violent[ˈvaiələnt] a.猛烈的；狂暴的", "violet [ˈvaiəlit] n.紫罗兰", "virtue [ˈvəːtjuː] n.善；美德；优点", "vital [ˈvaitl] a.生命的；有生命力的", "vivid [ˈvivid] a.鲜艳的；生动的", "vocabulary [vəˈkæbjuləri] n.词汇表;词汇，语汇", "volcano [vɔlˈkeinəu] n.火山", "volume [ˈvɔljuːm] n.卷，册；容积；音量", "voluntary [ˈvɔləntəri; (US) -teri] a.自/志愿的", "vote [vəut] n.选举，投票，表决", "waist [weist] n.腰，腰部", "wander [ˈwɔndə] vi.漫游；迷路；离题", "wax [wæks] n.蜡，蜂蜡", "wealthy [ˈwelθi] a.富的，富裕的", "weave [wiːv] vt.织，编 vi.纺织", "weed [wiːd] n.杂草，野草 vi.除草", "weld [weld] vt.&n.焊接，熔接", "welfare [ˈwelfeə] n.幸福，福利", "withdraw [wiðˈdrɔː] vt.收回；撤回 vi.撤退", "withstand [wiðˈstænd] vt.抵挡，反抗", "witness [ˈwitnis] n.证据；证人 vt.目击", "wonder [ˈwʌndə] n.惊异，惊奇；奇迹", "yawn [jɔːn] vi.打呵欠 n.呵欠", "yield [jiːld] vt.&vi.出产 n.产量", "zone [zəun] n.地区，区域，范围");
	var cs = 1;
	var dsqdc;
	var sjx = 584;
	var sjy = 0;
	var a_idx = parseInt(Math.random() * (sjx - sjy + 1) + sjy);
	var y = $(window).height() / 2;
	var x = $(window).width() / 2;
	var e = {
		pageX: x,
		pageY: y
	};
	var x_color;
	var dsq1;
	var dsq2;
	var dbclk = 1;
	$("body").first().mousemove(function(ele) {
		e = ele
	});
	var count2 = function() {
			if (cs <= 1 && 1 == dbclk) {
				cs++;
				var $i = $("<span/>").text(a[a_idx]);
				a_idx = parseInt(Math.random() * (sjx - sjy + 1) + sjy);
				x = e.pageX;
				y = e.pageY;
				x_color = "#" + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
				$i.css({
					"z-index": 99999,
					"top": y - 50,
					"left": x,
					"position": "absolute",
					"color": x_color,
					"font-size": "18px",
					"text-shadow": "0 0 3px white"
				});
				$("body").first().append($i);
				dsq1 = setTimeout(function() {
					$i.animate({
						"top": y - 100,
						"font-size": "20px",
						"opacity": 0.8
					}, 300);
					$i.animate({
						"opacity": 0.7
					}, 1000, function() {
						$i.remove();
						cs--
					})
				}, 2500);
				$i.on({
					mouseover: function() {
						if (1 == dbclk) {
							cs = 1000;
							$i.stop(true);
							clearTimeout(dsq1);
						}
					},
					dblclick: function() {
						if (1 == dbclk) {
							dbclk = 2;
							$i.css({
								"position": "fixed",
								"top": 100,
								"left": $(window).width() * 0.85,
							})
						} else {
							dbclk = 1;
							$i.css({
								"position": "absolute",
							});
							$i.trigger("mouseout")
						}
					},
					mouseout: function() {
						if (1 == dbclk) {
							$i.animate({
								"opacity": 0.7
							}, 500, function() {
								$i.remove();
								cs = 1
							})
						}
					}
				})
			}
			return count2
		}
	setInterval(count2(), 2000)
})();