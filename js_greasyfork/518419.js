// ==UserScript==
// @name         Random Word in Title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  随机将JSON数据中的单词与释义显示在所有网页的标题中
// @author       JONEE
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518419/Random%20Word%20in%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/518419/Random%20Word%20in%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // JSON 数据示例
    const words = [
    {
        "word": "a",
        "definition": "n. 字母A；第一流的；学业成绩达最高标准的评价符号 abbr. 安（ampere）"
    },
    {
        "word": "an",
        "definition": "art. 一（在元音音素前）"
    },
    {
        "word": "abandon",
        "definition": "n. 放任；狂热 vt. 遗弃；放弃"
    },
    {
        "word": "able",
        "definition": "adj. 能； 有能力的；能干的"
    },
    {
        "word": "ability",
        "definition": "n. 能力，能耐；才能"
    },
    {
        "word": "aboard",
        "definition": "prep. 在…上 adv. 在飞机上； 在船上；在火车上"
    },
    {
        "word": "abolish",
        "definition": "vt. 废除，废止；取消，革除"
    },
    {
        "word": "abolition",
        "definition": "n. 废除；废止"
    },
    {
        "word": "about",
        "definition": "prep. 关于；大约 n. 大致；粗枝大叶；不拘小节的人 adj. 在附近的；四处走动的；在起作用的 adv. 大约；周围；到处"
    },
    {
        "word": "above",
        "definition": "prep. 超过；在……上面；在……之上 n. 上文 adj. 上文的 adv. 在上面；在上文"
    },
    {
        "word": "abroad",
        "definition": "n. 海外；异国 adj. 往国外的 adv. 在国外；到海外"
    },
    {
        "word": "absent",
        "definition": "adj. 缺席的；缺少的；心不在焉的；茫然的 vt. 使缺席"
    },
    {
        "word": "absence",
        "definition": "n. 没有；缺乏；缺席；不注意"
    },
    {
        "word": "absolute",
        "definition": "n. 绝对；绝对事物 adj. 绝对的；完全的；专制的"
    },
    {
        "word": "absorb",
        "definition": "vt. 吸收；吸引；承受；理解；使…全神贯注"
    },
    {
        "word": "absorption",
        "definition": "n. 吸收；全神贯注，专心致志"
    },
    {
        "word": "abstract",
        "definition": "n. 摘要；抽象；抽象的概念 adj. 抽象的；深奥的 vt. 摘要；提取；使……抽象化；转移(注意力、兴趣等)；使心不在焉 vi. 做摘要；写梗概"
    },
    {
        "word": "abundant",
        "definition": "adj. 丰富的；充裕的；盛产"
    },
    {
        "word": "abundance",
        "definition": "n. 充裕，丰富"
    },
    {
        "word": "abuse",
        "definition": "n. 滥用；虐待；辱骂；弊端；恶习，陋习 vt. 滥用；虐待；辱骂"
    },
    {
        "word": "abusive",
        "definition": "adj. 辱骂的；滥用的；虐待的"
    },
    {
        "word": "academy",
        "definition": "n. 学院；研究院；学会；专科院校"
    },
    {
        "word": "academic",
        "definition": "n. 大学生，大学教师；学者 adj. 学术的；理论的；学院的"
    },
    {
        "word": "academician",
        "definition": "n. 院士；大学生；学会会员；大学教师"
    },
    {
        "word": "accelerate",
        "definition": "vt. 使……加快；使……增速 vi. 加速；促进；增加"
    },
    {
        "word": "acceleration",
        "definition": "n. 加速，促进； 加速度"
    },
    {
        "word": "accent",
        "definition": "n. 口音；重音；强调；特点；重音符号 vt. 强调；重读；带…口音讲话"
    },
    {
        "word": "accept",
        "definition": "vi. 承认；同意；承兑 vt. 接受；承认；承担；承兑；容纳"
    },
    {
        "word": "acceptance",
        "definition": "n. 接纳；赞同；容忍"
    },
    {
        "word": "acceptable",
        "definition": "adj. 可接受的；合意的；可忍受的"
    },
    {
        "word": "access",
        "definition": "n. 进入；使用权；通路 vt. 使用；存取；接近"
    },
    {
        "word": "accessible",
        "definition": "adj. 易接近的；可进入的；可理解的"
    },
    {
        "word": "accident",
        "definition": "n. 事故；意外； 意外事件；机遇"
    },
    {
        "word": "accidental",
        "definition": "n. 次要方面；非主要的特性；临时记号 adj. 意外的；偶然的；附属的；临时记号的"
    },
    {
        "word": "accommodate",
        "definition": "vi. 适应；调解 vt. 容纳；使适应；供应；调解"
    },
    {
        "word": "accommodation",
        "definition": "n. 住处，膳宿；调节；和解；预订铺位"
    },
    {
        "word": "accompany",
        "definition": "vt. 陪伴，伴随；伴奏 vi. 伴奏，伴唱"
    },
    {
        "word": "accomplish",
        "definition": "vt. 完成；实现；达到"
    },
    {
        "word": "accomplishment",
        "definition": "n. 成就；完成；技艺，技能"
    },
    {
        "word": "accord",
        "definition": "n. 符合；一致；协议；自愿 vt. 使一致；给予 vi. 符合；一致"
    },
    {
        "word": "accordance",
        "definition": "n. 一致；和谐"
    },
    {
        "word": "according to",
        "definition": "prep. 根据；按照；据（…所说）；按（…所报道）  依照；根据…所说；依据"
    },
    {
        "word": "accordingly",
        "definition": "adv. 因此，于是；相应地；照著"
    },
    {
        "word": "account",
        "definition": "n. 账户；解释；账目，账单；理由；描述 vt. 认为；把…视为 vi. 解释；导致；报账"
    },
    {
        "word": "accounting",
        "definition": "n. 会计，会计学；账单 v. 解释（account的ing形式）；叙述"
    },
    {
        "word": "accountant",
        "definition": "n. 会计师；会计人员"
    },
    {
        "word": "accountancy",
        "definition": "n. 会计工作；会计学；会计师之职"
    },
    {
        "word": "accountable",
        "definition": "adj. 有责任的；有解释义务的；可解释的"
    },
    {
        "word": "accountability",
        "definition": "n. 有义务；有责任；可说明性"
    },
    {
        "word": "accumulate",
        "definition": "vt. 积攒 vi. 累积；积聚"
    },
    {
        "word": "accumulation",
        "definition": "n. 积聚，累积；堆积物"
    },
    {
        "word": "accumulative",
        "definition": "adj. 累计的；累积的；积聚而成的"
    },
    {
        "word": "accurate",
        "definition": "adj. 精确的"
    },
    {
        "word": "accuracy",
        "definition": "n.  精确度，准确性"
    },
    {
        "word": "accuse",
        "definition": "vt. 控告，指控；谴责；归咎于 vi. 指责；控告"
    },
    {
        "word": "accusation",
        "definition": "n. 控告，指控；谴责"
    },
    {
        "word": "accustom",
        "definition": "vt. 使习惯于"
    },
    {
        "word": "accustomed",
        "definition": "v. 使习惯于（accustom的过去分词） adj. 习惯的；通常的；独有的"
    },
    {
        "word": "ace",
        "definition": "n. 幺点；直接得分的发球；佼佼者；（俚）最好的朋友 adj. 一流的，突出的 vt. 以发球赢一分；击败 int. 太棒了；太好了"
    },
    {
        "word": "ache",
        "definition": "n. 疼痛 vi. 疼痛；渴望"
    },
    {
        "word": "achieve",
        "definition": "vt. 取得；获得；实现；成功 vi. 达到预期的目的，实现预期的结果，如愿以偿"
    },
    {
        "word": "achievement",
        "definition": "n. 成就；完成；达到；成绩"
    },
    {
        "word": "acid",
        "definition": "n. 酸；<俚>迷幻药 adj. 酸的；讽刺的；刻薄的"
    },
    {
        "word": "acidity",
        "definition": "n. 酸度；酸性；酸过多；胃酸过多"
    },
    {
        "word": "acknowledge",
        "definition": "vt. 承认；答谢；报偿；告知已收到"
    },
    {
        "word": "acknowledgement",
        "definition": "n. 承认；确认；感谢"
    },
    {
        "word": "acquaint",
        "definition": "vt. 使熟悉；使认识"
    },
    {
        "word": "acquaintance",
        "definition": "n. 熟人；相识；了解；知道"
    },
    {
        "word": "acquire",
        "definition": "vt. 获得；取得；学到；捕获"
    },
    {
        "word": "acquisition",
        "definition": "n. 获得物，获得；收购"
    },
    {
        "word": "acre",
        "definition": "n. 土地，地产；英亩"
    },
    {
        "word": "across",
        "definition": "prep. 穿过；横穿 adv. 横过；在对面"
    },
    {
        "word": "act",
        "definition": "n. 行为，行动；法令，法案；（戏剧，歌剧的）一幕，段；装腔作势 vt. 扮演；装作，举动像 vi. 行动；扮演，充当；表现，举止；假装，演戏；起作用，见效"
    },
    {
        "word": "action",
        "definition": "n. 行动；活动；功能；战斗；情节"
    },
    {
        "word": "acting",
        "definition": "n. 演技；演戏；假装 adj. 代理的；装腔作势的"
    },
    {
        "word": "active",
        "definition": "n. 主动语态；积极分子 adj. 积极的；活跃的；主动的；有效的；现役的"
    },
    {
        "word": "activity",
        "definition": "n. 活动；行动；活跃"
    },
    {
        "word": "activist",
        "definition": "n. 积极分子；激进主义分子"
    },
    {
        "word": "actor",
        "definition": "n. 男演员；行动者；作用物"
    },
    {
        "word": "actress",
        "definition": "n. 女演员"
    },
    {
        "word": "actual",
        "definition": "adj. 真实的，实际的；现行的，目前的"
    },
    {
        "word": "actually",
        "definition": "adv. 实际上；事实上"
    },
    {
        "word": "acute",
        "definition": "adj. 严重的， 急性的；敏锐的；激烈的；尖声的"
    },
    {
        "word": "adapt",
        "definition": "vi. 适应 vt. 使适应；改编"
    },
    {
        "word": "adaptation",
        "definition": "n. 适应；改编；改编本，改写本"
    },
    {
        "word": "adaptive",
        "definition": "adj. 适应的，适合的"
    },
    {
        "word": "add",
        "definition": "n. 加法，加法运算 vi. 加；增加；加起来；做加法 vt. 增加，添加；补充说；计算…总和"
    },
    {
        "word": "addition",
        "definition": "n. 添加； 加法；增加物"
    },
    {
        "word": "additional",
        "definition": "adj. 附加的，额外的"
    },
    {
        "word": "addict",
        "definition": "n. 有瘾的人；入迷的人 vt. 使沉溺；使上瘾"
    },
    {
        "word": "addiction",
        "definition": "n. 上瘾，沉溺；癖嗜"
    },
    {
        "word": "addictive",
        "definition": "adj. 使人上瘾的"
    },
    {
        "word": "address",
        "definition": "n. 地址；演讲；致辞；说话的技巧；称呼 vt. 演说；从事；忙于；写姓名地址；向…致辞；与…说话；提出；处理"
    },
    {
        "word": "adequate",
        "definition": "adj. 充足的；适当的；胜任的"
    },
    {
        "word": "adequacy",
        "definition": "n. 足够；适当；妥善性"
    },
    {
        "word": "adequately",
        "definition": "adv. 充分地；足够地；适当地"
    },
    {
        "word": "adjective",
        "definition": "n. 形容词 adj. 形容词的；从属的"
    },
    {
        "word": "adjust",
        "definition": "vt. 调整，使…适合；校准 vi. 调整，校准；适应"
    },
    {
        "word": "adjustment",
        "definition": "n. 调整，调节；调节器"
    },
    {
        "word": "administer",
        "definition": "vt. 管理；执行；给予 vi. 给予帮助；执行遗产管理人的职责；担当管理人"
    },
    {
        "word": "administrate",
        "definition": "vt. 管理；经营，实施"
    },
    {
        "word": "administration",
        "definition": "n. 管理；行政；实施；行政机构"
    },
    {
        "word": "administrative",
        "definition": "adj. 管理的，行政的"
    },
    {
        "word": "admire",
        "definition": "vt. 钦佩；赞美 vi. 钦佩；称赞"
    },
    {
        "word": "admiration",
        "definition": "n. 钦佩；赞赏；羡慕；赞美"
    },
    {
        "word": "admirable",
        "definition": "adj. 令人钦佩的；极好的；值得赞扬的"
    },
    {
        "word": "admit",
        "definition": "vi. 承认；容许 vt. 承认；准许进入；可容纳"
    },
    {
        "word": "admission",
        "definition": "n. 承认；入场费；进入许可；坦白；录用"
    },
    {
        "word": "admittance",
        "definition": "n. 进入；入场权；通道"
    },
    {
        "word": "admittedly",
        "definition": "adv. 公认地；无可否认地；明白地"
    },
    {
        "word": "adopt",
        "definition": "vi. 采取；过继 vt. 采取；接受；收养；正式通过"
    },
    {
        "word": "adoption",
        "definition": "n. 采用；收养；接受"
    },
    {
        "word": "adult",
        "definition": "n. 成年人 adj. 成年的；成熟的"
    },
    {
        "word": "adulthood",
        "definition": "n. 成年；成人期"
    },
    {
        "word": "advance",
        "definition": "n. 发展；前进；增长；预付款 adj. 预先的；先行的 vt. 提出；预付；使……前进；将……提前 vi. 前进；进展；上涨"
    },
    {
        "word": "advancement",
        "definition": "n. 前进，进步；提升"
    },
    {
        "word": "advanced",
        "definition": "adj. 先进的；高级的；晚期的；年老的 v. 前进；增加；上涨（advance的过去式和过去分词形式）"
    },
    {
        "word": "advantage",
        "definition": "n. 优势；利益；有利条件 vt. 有利于；使处于优势 vi. 获利"
    },
    {
        "word": "advantageous",
        "definition": "adj. 有利的；有益的"
    },
    {
        "word": "adventure",
        "definition": "n. 冒险；冒险精神；投机活动 vt. 冒险；大胆说出 vi. 冒险"
    },
    {
        "word": "adventurer",
        "definition": "n. 冒险家；投机商人"
    },
    {
        "word": "adventurous",
        "definition": "adj. 爱冒险的；大胆的；充满危险的"
    },
    {
        "word": "adverb",
        "definition": "n. 副词 adj. 副词的"
    },
    {
        "word": "advertise",
        "definition": "vt. 通知；为…做广告；使突出 vi. 做广告，登广告；作宣传"
    },
    {
        "word": "advertisement",
        "definition": "n. 广告，宣传"
    },
    {
        "word": "ad",
        "definition": "n. 公元；广告（ad）"
    },
    {
        "word": "advertising",
        "definition": "n. 广告；广告业；登广告 adj. 广告的；广告业的 v. 公告；为…做广告（advertise的ing形式）"
    },
    {
        "word": "advice",
        "definition": "n. 建议；忠告；劝告；通知"
    },
    {
        "word": "advise",
        "definition": "vt. 建议；劝告，忠告；通知；警告 vi. 建议；与…商量"
    },
    {
        "word": "advisor",
        "definition": "n. 顾问；指导教师；劝告者"
    },
    {
        "word": "adviser",
        "definition": "n. 顾问；劝告者；指导教师（等于advisor）"
    },
    {
        "word": "advisory",
        "definition": "n. 报告；公告 adj. 咨询的；顾问的；劝告的"
    },
    {
        "word": "advisable",
        "definition": "adj. 明智的，可取的，适当的"
    },
    {
        "word": "advocate",
        "definition": "n. 提倡者；支持者；律师 vt. 提倡，主张，拥护"
    },
    {
        "word": "advocacy",
        "definition": "n. 主张；拥护；辩护"
    },
    {
        "word": "aerial",
        "definition": "n.  天线 adj. 空中的，航空的；空气的；空想的"
    },
    {
        "word": "affair",
        "definition": "n. 事情；事务；私事；（尤指关系不长久的）风流韵事"
    },
    {
        "word": "affect",
        "definition": "n. 情感；引起感情的因素 vt. 影响；感染；感动；假装 vi. 倾向；喜欢"
    },
    {
        "word": "affection",
        "definition": "n. 喜爱，感情；影响；感染"
    },
    {
        "word": "affectionate",
        "definition": "adj. 深情的； adj. 充满爱的；"
    },
    {
        "word": "affluent",
        "definition": "n. 支流；富人 adj. 富裕的；丰富的；流畅的"
    },
    {
        "word": "affluence",
        "definition": "n. 富裕；丰富；流入；汇聚"
    },
    {
        "word": "afford",
        "definition": "vt. 给予，提供；买得起"
    },
    {
        "word": "affordable",
        "definition": "adj. 负担得起的"
    },
    {
        "word": "affordability",
        "definition": "n. 支付能力；负担能力；可购性"
    },
    {
        "word": "afraid",
        "definition": "adj. 害怕的；恐怕；担心的"
    },
    {
        "word": "after",
        "definition": "conj. 在……之后 prep. 在……之后 adj. 以后的 adv. 后来，以后"
    },
    {
        "word": "afternoon",
        "definition": "n. 午后，下午"
    },
    {
        "word": "afterward",
        "definition": "adv. 以后，后来"
    },
    {
        "word": "afterwards",
        "definition": "adv. 后来；然后"
    },
    {
        "word": "again",
        "definition": "adv. 又，此外；再一次；再说；增加 n. （英、保）阿盖恩"
    },
    {
        "word": "against",
        "definition": "prep. 反对，违反；靠；倚；防备 adj. 不利的；对立的"
    },
    {
        "word": "age",
        "definition": "n. 年龄；时代；寿命，使用年限；阶段 vt. 使成熟；使变老，使上年纪 vi. 成熟；变老"
    },
    {
        "word": "aged",
        "definition": "v. 老化（age的过去式）；成熟；变老 adj. 年老的；…岁的；老年人特有的"
    },
    {
        "word": "aging",
        "definition": "n. 老化；陈化，熟化"
    },
    {
        "word": "ageing",
        "definition": "n. 老化；变老，成熟 adj. 变老的，老化的 v. 变老（age的现在分词）"
    },
    {
        "word": "agenda",
        "definition": "n. 议程；日常工作事项；日程表"
    },
    {
        "word": "agent",
        "definition": "n. 代理人，代理商；药剂；特工 adj. 代理的 vt. 由…作中介；由…代理"
    },
    {
        "word": "agency",
        "definition": "n. 代理，中介；代理处，经销处"
    },
    {
        "word": "aggressive",
        "definition": "adj. 侵略性的；好斗的；有进取心的；有闯劲的"
    },
    {
        "word": "aggression",
        "definition": "n. 侵略；进攻；侵犯；侵害"
    },
    {
        "word": "ago",
        "definition": "adj. 以前的；过去的 adv. 以前，以往"
    },
    {
        "word": "agree",
        "definition": "vi. vi. 同意，意见一致；约定，商定 vt. 同意，赞成；承认；约定，商定"
    },
    {
        "word": "agreement",
        "definition": "n. 协议；同意，一致"
    },
    {
        "word": "agreeable",
        "definition": "adj. 令人愉快的；适合的；和蔼可亲的"
    },
    {
        "word": "agriculture",
        "definition": "n. 农业；农耕；农业生产；农艺，农学"
    },
    {
        "word": "agricultural",
        "definition": "adj. 农业的；农艺的"
    },
    {
        "word": "ahead",
        "definition": "adj. 向前；在前的；领先 adv. 向前地；领先地；在（某人或某事物的）前面；预先；在将来，为未来"
    },
    {
        "word": "aid",
        "definition": "n. 援助；帮助；助手；帮助者 vt. 援助；帮助；有助于 vi. 帮助"
    },
    {
        "word": "AIDS",
        "definition": "abbr. 获得性免疫缺乏综合征；爱滋病（Acquired Immune Deficiency Syndrome）"
    },
    {
        "word": "aim",
        "definition": "n. 目的；目标；对准 vt. 目的在于；引导；把…对准 vi. 打算；对准目标；瞄准"
    },
    {
        "word": "air",
        "definition": "n. 空气，大气；天空；样子；曲调 vt. 使通风，晾干；夸耀 vi. 通风"
    },
    {
        "word": "air-conditioning",
        "definition": "n. 空调系统；空气调节"
    },
    {
        "word": "air-conditioner",
        "definition": "n. 空调"
    },
    {
        "word": "aircraft",
        "definition": "n. 飞机，航空器"
    },
    {
        "word": "airline",
        "definition": "n. 航空公司；航线 adj. 航线的"
    },
    {
        "word": "airplane",
        "definition": "n. 飞机"
    },
    {
        "word": "aeroplane",
        "definition": "n. 飞机（等于airplane）"
    },
    {
        "word": "airport",
        "definition": "n. 机场；航空站"
    },
    {
        "word": "aisle",
        "definition": "n. 通道，走道；侧廊"
    },
    {
        "word": "alarm",
        "definition": "n. 闹钟；警报，警告器；惊慌 vt. 警告；使惊恐"
    },
    {
        "word": "album",
        "definition": "n. 相簿；唱片集；集邮簿；签名纪念册"
    },
    {
        "word": "alcohol",
        "definition": "n. 酒精，乙醇"
    },
    {
        "word": "alcoholic",
        "definition": "n. 酒鬼，酗酒者 adj. 酒精的，含酒精的"
    },
    {
        "word": "alert",
        "definition": "n. 警戒，警惕；警报 adj. 警惕的，警觉的；留心的 vt. 警告；使警觉，使意识到"
    },
    {
        "word": "algebra",
        "definition": "n. 代数学"
    },
    {
        "word": "alike",
        "definition": "adj. 相似的；相同的 adv. 以同样的方式；类似于"
    },
    {
        "word": "alive",
        "definition": "adj. 活着的；活泼的；有生气的"
    },
    {
        "word": "all",
        "definition": "n. 全部 adj. 全部的 adv. 全然地；越发 pron. 全部"
    },
    {
        "word": "allege",
        "definition": "vt. 宣称，断言；提出…作为理由"
    },
    {
        "word": "allegation",
        "definition": "n. 指控; 陈述，主张; 宣称; 陈词，陈述;"
    },
    {
        "word": "alleged",
        "definition": "v. 宣称（allege的过去式和过去分词）；断言 adj. 所谓的；声称的；被断言的"
    },
    {
        "word": "allegedly",
        "definition": "adv. 依其申述；据说，据称"
    },
    {
        "word": "alley",
        "definition": "n. 小巷；小路；小径"
    },
    {
        "word": "allow",
        "definition": "vi. 容许；考虑 vt. 允许；给予；认可"
    },
    {
        "word": "allowance",
        "definition": "n. 津贴，零用钱；允许；限额 vt. 定量供应"
    },
    {
        "word": "ally",
        "definition": "n. 同盟国；伙伴；同盟者；助手 vt. 使联盟；使联合 vi. 联合；结盟"
    },
    {
        "word": "alliance",
        "definition": "n. 联盟，联合；联姻"
    },
    {
        "word": "almost",
        "definition": "adv. 差不多，几乎"
    },
    {
        "word": "alone",
        "definition": "adj. 独自的；单独的；孤独的 adv. 独自地；单独地"
    },
    {
        "word": "along",
        "definition": "prep. 沿着；顺着 adv. 一起；向前；来到"
    },
    {
        "word": "alongside",
        "definition": "prep. 在……旁边 adv. 在旁边"
    },
    {
        "word": "aloud",
        "definition": "adv. 大声地；出声地"
    },
    {
        "word": "alphabet",
        "definition": "n. 字母表，字母系统；入门，初步 n. Google创建的名为Alphabet的公司，改变Google原有公司架构，旨在使其当下主要业务和长期投资项目间的区别更加清晰。"
    },
    {
        "word": "alphabetic",
        "definition": "adj. 字母的；照字母次序的"
    },
    {
        "word": "alphabetical",
        "definition": "adj. 字母的； 依字母顺序的"
    },
    {
        "word": "already",
        "definition": "adv. 已经，早已；先前"
    },
    {
        "word": "also",
        "definition": "conj. 并且；另外 adv. 也；而且；同样"
    },
    {
        "word": "alter",
        "definition": "vt. 改变，更改 vi. 改变；修改"
    },
    {
        "word": "alteration",
        "definition": "n. 修改，改变；变更"
    },
    {
        "word": "alternative",
        "definition": "n. 二中择一；供替代的选择 adj. 供选择的；选择性的；交替的"
    },
    {
        "word": "although",
        "definition": "conj. 尽管；虽然；但是；然而"
    },
    {
        "word": "altitude",
        "definition": "n. 高地；高度； 顶垂线；（等级和地位等的）高级；海拔"
    },
    {
        "word": "altogether",
        "definition": "n. 整个；裸体 adv. 完全地；总共；总而言之"
    },
    {
        "word": "aluminum",
        "definition": "n. 铝"
    },
    {
        "word": "aluminium",
        "definition": "n. 铝 adj. 铝的"
    },
    {
        "word": "always",
        "definition": "adv. 永远，一直；总是；常常"
    },
    {
        "word": "am",
        "definition": ""
    },
    {
        "word": "amateur",
        "definition": "n. 爱好者；业余爱好者；外行 adj. 业余的；外行的"
    },
    {
        "word": "amaze",
        "definition": "vt. 使吃惊"
    },
    {
        "word": "amazing",
        "definition": "adj. 令人惊异的 v. 使吃惊（amaze的ing形式）"
    },
    {
        "word": "amazement",
        "definition": "n. 惊异；惊愕"
    },
    {
        "word": "ambassador",
        "definition": "n. 大使；代表；使节"
    },
    {
        "word": "ambition",
        "definition": "n. 野心，雄心；抱负，志向 vt. 追求；有…野心"
    },
    {
        "word": "ambitious",
        "definition": "adj. 野心勃勃的；有雄心的；热望的；炫耀的"
    },
    {
        "word": "ambulance",
        "definition": "n.  救护车；战时流动医院"
    },
    {
        "word": "amid",
        "definition": "prep. 在其中，在其间"
    },
    {
        "word": "amidst",
        "definition": "prep. 在…当中"
    },
    {
        "word": "among",
        "definition": "prep. 在…中间；在…之中"
    },
    {
        "word": "amongst",
        "definition": "prep. 在…之中；在…当中（等于among）"
    },
    {
        "word": "amount",
        "definition": "n. 数量；总额，总数 vi. 总计，合计；相当于；共计；产生…结果"
    },
    {
        "word": "ample",
        "definition": "adj. 丰富的；足够的；宽敞的"
    },
    {
        "word": "amuse",
        "definition": "vt. 娱乐；消遣；使发笑；使愉快"
    },
    {
        "word": "amusing",
        "definition": "adj. 有趣的，好玩的；引人发笑的 v. 逗乐；打发；使…高兴（amuse的ing形式）"
    },
    {
        "word": "amusement",
        "definition": "n. 消遣，娱乐；乐趣"
    },
    {
        "word": "analyze",
        "definition": "vt. 对…进行分析，分解（等于analyse）"
    },
    {
        "word": "analyse",
        "definition": "vt. 分析；分解；细察"
    },
    {
        "word": "analysis",
        "definition": "n. 分析；分解；验定"
    },
    {
        "word": "analytic",
        "definition": "adj. 分析的；解析的；善于分析的"
    },
    {
        "word": "analytical",
        "definition": "adj. 分析的；解析的；善于分析的"
    },
    {
        "word": "analyst",
        "definition": "n. 分析者；精神分析医师；分解者"
    },
    {
        "word": "ancestor",
        "definition": "n. 始祖，祖先；被继承人"
    },
    {
        "word": "ancestry",
        "definition": "n. 祖先；血统"
    },
    {
        "word": "anchor",
        "definition": "n. 锚；抛锚停泊；靠山；新闻节目主播 adj. 末棒的；最后一棒的 vt. 抛锚；使固定；主持节目 vi. 抛锚"
    },
    {
        "word": "anchorage",
        "definition": "n. 锚地；下锚；停泊税"
    },
    {
        "word": "ancient",
        "definition": "n. 古代人；老人 adj. 古代的；古老的，过时的；年老的"
    },
    {
        "word": "and",
        "definition": "conj. 和，与；就；而且；但是；然后"
    },
    {
        "word": "anew",
        "definition": "adv. 重新；再"
    },
    {
        "word": "angel",
        "definition": "n. 天使；守护神；善人 vt. 出钱支持"
    },
    {
        "word": "angle",
        "definition": "n. 角度，角，方面 vi. 钓鱼；谋取"
    },
    {
        "word": "angry",
        "definition": "adj. 生气的；愤怒的；狂暴的；（伤口等）发炎的"
    },
    {
        "word": "anger",
        "definition": "n. 怒，愤怒；忿怒 vt. 使发怒，激怒；恼火 vi. 发怒；恼火"
    },
    {
        "word": "animal",
        "definition": "n. 动物 动物的"
    },
    {
        "word": "ankle",
        "definition": "n. 踝关节，踝"
    },
    {
        "word": "anniversary",
        "definition": "n. 周年纪念日"
    },
    {
        "word": "announce",
        "definition": "vt. 宣布；述说；预示；播报 vi. 宣布参加竞选；当播音员"
    },
    {
        "word": "announcement",
        "definition": "n. 公告；宣告；发表；通告"
    },
    {
        "word": "annoy",
        "definition": "n. 烦恼（等于annoyance） vt. 骚扰；惹恼；打搅 vi. 惹恼；令人讨厌；打搅"
    },
    {
        "word": "annoyance",
        "definition": "n. 烦恼；可厌之事；打扰"
    },
    {
        "word": "annual",
        "definition": "n. 年刊，年鉴；一年生植物 adj. 年度的；每年的"
    },
    {
        "word": "anonymity",
        "definition": "n. 匿名；匿名者；无名之辈"
    },
    {
        "word": "another",
        "definition": "prep. 另一个；另一个人 adj. 又一，另一；另外的；不同的 pron. 另一个；又一个"
    },
    {
        "word": "answer",
        "definition": "n. 回答；答案；答辩 vt. 回答；符合 vi. 回答；符合"
    },
    {
        "word": "ant",
        "definition": "n. 蚂蚁"
    },
    {
        "word": "anticipate",
        "definition": "vt. 预期，期望；占先，抢先；提前使用"
    },
    {
        "word": "anticipation",
        "definition": "n. 希望；预感；先发制人；预支"
    },
    {
        "word": "antique",
        "definition": "n. 古董，古玩；古风，古希腊和古罗马艺术风格 adj. 古老的，年代久远的；过时的，古董的；古风的，古式的 vi. 觅购古玩"
    },
    {
        "word": "anxious",
        "definition": "adj. 焦虑的；担忧的；渴望的；急切的"
    },
    {
        "word": "anxiety",
        "definition": "n. 焦虑；渴望；挂念；令人焦虑的事"
    },
    {
        "word": "any",
        "definition": "adj. 任何的；所有的；丝毫 pron. 任何；任何一个；若干 adv. 稍微；少许"
    },
    {
        "word": "anybody",
        "definition": "n. 重要人物 pron. 任何人"
    },
    {
        "word": "anyone",
        "definition": "pron. 任何人；任何一个"
    },
    {
        "word": "anyhow",
        "definition": "adv. 总之；无论如何；不管怎样"
    },
    {
        "word": "anything",
        "definition": "pron. 任何事"
    },
    {
        "word": "anyway",
        "definition": "adv. 无论如何，不管怎样；总之"
    },
    {
        "word": "anywhere",
        "definition": "n. 任何地方 adv. 在任何地方；无论何处"
    },
    {
        "word": "apart",
        "definition": "adj. 分离的；与众不同的 adv. 相距；与众不同地；分离着"
    },
    {
        "word": "apartment",
        "definition": "n. 公寓；房间"
    },
    {
        "word": "apt.",
        "definition": "abbr. airportable 空降的"
    },
    {
        "word": "apology",
        "definition": "n. 道歉；谢罪；辩护；勉强的替代物"
    },
    {
        "word": "apologize",
        "definition": "vi. 道歉；辩解；赔不是 vt. 道歉；谢罪；辩白"
    },
    {
        "word": "apologise",
        "definition": "vi. 道歉（等于apologize）"
    },
    {
        "word": "apologetic",
        "definition": "adj. 道歉的；赔罪的"
    },
    {
        "word": "app",
        "definition": ""
    },
    {
        "word": "apparatus",
        "definition": "n. 装置，设备；仪器；器官"
    },
    {
        "word": "apparent",
        "definition": "adj. 显然的；表面上的"
    },
    {
        "word": "apparently",
        "definition": "adv. 显然地；似乎，表面上"
    },
    {
        "word": "appeal",
        "definition": "n. 呼吁，请求；吸引力，感染力；上诉；诉诸裁判 vt. 将…上诉，对…上诉 vi. 呼吁，恳求；上诉；诉诸，求助；有吸引力，迎合爱好；（体育比赛中）诉诸裁判"
    },
    {
        "word": "appealing",
        "definition": "v. 恳求（appeal的ing形式）；将…上诉 adj. 吸引人的；动人的；引起兴趣的；恳求似的"
    },
    {
        "word": "appear",
        "definition": "vi. 出现；显得；似乎；出庭；登场"
    },
    {
        "word": "appearance",
        "definition": "n. 外貌，外观；出现，露面"
    },
    {
        "word": "appetite",
        "definition": "n. 食欲；嗜好"
    },
    {
        "word": "applaud",
        "definition": "vt. 赞同；称赞；向…喝彩 vi. 喝彩；鼓掌欢迎"
    },
    {
        "word": "applause",
        "definition": "n. 欢呼，喝采；鼓掌欢迎"
    },
    {
        "word": "apple",
        "definition": "n. 苹果，苹果树，苹果似的东西；炸弹，手榴弹，（棒球的）球；人，家伙。"
    },
    {
        "word": "appliance",
        "definition": "n. 器具；器械；装置"
    },
    {
        "word": "apply",
        "definition": "vi. 申请；涂，敷；适用；请求 vt. 申请；涂，敷；应用"
    },
    {
        "word": "application",
        "definition": "n. 应用；申请；应用程序；敷用"
    },
    {
        "word": "applicant",
        "definition": "n. 申请人，申请者；请求者"
    },
    {
        "word": "applicable",
        "definition": "adj. 可适用的；可应用的；合适的"
    },
    {
        "word": "appoint",
        "definition": "vt. 任命；指定；约定 vi. 任命；委派"
    },
    {
        "word": "appointment",
        "definition": "n. 任命；约定；任命的职位"
    },
    {
        "word": "appreciate",
        "definition": "vi. 增值；涨价 vt. 欣赏；感激；领会；鉴别"
    },
    {
        "word": "appreciation",
        "definition": "n. 欣赏，鉴别；增值；感谢"
    },
    {
        "word": "appreciative",
        "definition": "adj. 感激的；赏识的；有欣赏力的；承认有价值的"
    },
    {
        "word": "approach",
        "definition": "n. 方法；途径；接近 vt. 接近；着手处理 vi. 靠近"
    },
    {
        "word": "appropriate",
        "definition": "adj. 适当的；恰当的；合适的 vt. 占用，拨出"
    },
    {
        "word": "approve",
        "definition": "vi. 批准；赞成；满意 vt. 批准；赞成；为…提供证据"
    },
    {
        "word": "approval",
        "definition": "n. 批准；认可；赞成"
    },
    {
        "word": "approximate",
        "definition": "adj.  近似的；大概的 vt. 近似；使…接近；粗略估计 vi. 接近于；近似于"
    },
    {
        "word": "approximately",
        "definition": "adv. 大约，近似地；近于"
    },
    {
        "word": "approximation",
        "definition": "n.  近似法；接近； 近似值"
    },
    {
        "word": "April",
        "definition": "n. 四月"
    },
    {
        "word": "aptitude",
        "definition": "n. 天资；自然倾向；适宜"
    },
    {
        "word": "arbitrary",
        "definition": "adj.  任意的；武断的；专制的"
    },
    {
        "word": "arbitrarily",
        "definition": "adv. 武断地；反复无常地；专横地"
    },
    {
        "word": "architect",
        "definition": "n. 建筑师 缔造者"
    },
    {
        "word": "architecture",
        "definition": "n. 建筑学；建筑风格；建筑式样；架构"
    },
    {
        "word": "area",
        "definition": "n. 区域，地区；面积；范围"
    },
    {
        "word": "argue",
        "definition": "vi. 争论，辩论；提出理由 vt. 辩论，争论；证明；说服"
    },
    {
        "word": "argument",
        "definition": "n. 论证；论据；争吵；内容提要"
    },
    {
        "word": "argumentation",
        "definition": "n. 论证；争论；辩论"
    },
    {
        "word": "argumentative",
        "definition": "adj. 好辩的；辩论的；争辩的"
    },
    {
        "word": "arguable",
        "definition": "adj. 可论证的；可议的；可疑的"
    },
    {
        "word": "arise",
        "definition": "vi. 出现；上升；起立"
    },
    {
        "word": "arithmetic",
        "definition": "n. 算术，算法"
    },
    {
        "word": "arm",
        "definition": "n. 手臂；武器；袖子；装备；部门 vt. 武装；备战 vi. 武装起来"
    },
    {
        "word": "armament",
        "definition": "n. 武器；军备"
    },
    {
        "word": "army",
        "definition": "n. 陆军，军队"
    },
    {
        "word": "around",
        "definition": "prep. 四处；在…周围 adv. 大约；到处；在附近"
    },
    {
        "word": "arouse",
        "definition": "vt. 引起；唤醒；鼓励 vi. 激发；醒来；发奋"
    },
    {
        "word": "arousal",
        "definition": "n. 觉醒；激励"
    },
    {
        "word": "arrange",
        "definition": "vi. 安排；排列；协商 vt. 安排；排列；整理"
    },
    {
        "word": "arrangement",
        "definition": "n. 布置；整理；准备"
    },
    {
        "word": "arrest",
        "definition": "n. 逮捕；监禁 vt. 逮捕；阻止；吸引"
    },
    {
        "word": "arrive",
        "definition": "vi. 到达；成功；达成；出生"
    },
    {
        "word": "arrival",
        "definition": "n. 到来；到达；到达者"
    },
    {
        "word": "arrow",
        "definition": "n. 箭，箭头；箭状物；箭头记号 vt. 以箭头指示；箭一般地飞向"
    },
    {
        "word": "art",
        "definition": "n. 艺术；美术；艺术品 v. 是（be的变体） adj. 艺术的；艺术品的"
    },
    {
        "word": "artist",
        "definition": "n. 艺术家；美术家（尤指画家）；大师"
    },
    {
        "word": "artistic",
        "definition": "adj. 艺术的；风雅的；有美感的"
    },
    {
        "word": "artistically",
        "definition": "adv. 在艺术上；富有艺术地"
    },
    {
        "word": "article",
        "definition": "n. 文章；物品；条款； 冠词 vt. 订约将…收为学徒或见习生；使…受协议条款的约束 vi. 签订协议；进行控告"
    },
    {
        "word": "artificial",
        "definition": "adj. 人造的；仿造的；虚伪的；非原产地的；武断的"
    },
    {
        "word": "as",
        "definition": "conj. 因为；随着；虽然；依照；当…时 prep. 如同；当作；以…的身份 adv. 同样地；和…一样的"
    },
    {
        "word": "ash",
        "definition": "n. 灰；灰烬"
    },
    {
        "word": "ashamed",
        "definition": "adj. 惭愧的，感到难为情的；耻于……的"
    },
    {
        "word": "ashore",
        "definition": "adj. 在岸上的；在陆上的 adv. 在岸上；向岸"
    },
    {
        "word": "aside",
        "definition": "prep. 在…旁边 n. 旁白；私语，悄悄话；离题的话 adv. 离开，撇开；在旁边"
    },
    {
        "word": "ask",
        "definition": "vt. 问，询问；要求；需要；邀请；讨价 vi. 问，询问；要求"
    },
    {
        "word": "asleep",
        "definition": "adj. 睡着的；麻木的；长眠的 adv. 熟睡地；进入睡眠状态"
    },
    {
        "word": "aspect",
        "definition": "n. 方面；方向；形势；外貌"
    },
    {
        "word": "ass",
        "definition": "n. 屁股；驴子；蠢人"
    },
    {
        "word": "assemble",
        "definition": "vt. 集合，聚集；装配；收集 vi. 集合，聚集"
    },
    {
        "word": "assembly",
        "definition": "n. 装配；集会，集合"
    },
    {
        "word": "assess",
        "definition": "vt. 评定；估价；对…征税"
    },
    {
        "word": "assessment",
        "definition": "n. 评定；估价"
    },
    {
        "word": "asset",
        "definition": "n. 资产；优点；有用的东西；有利条件；财产；有价值的人或物"
    },
    {
        "word": "assign",
        "definition": "vt. 分配；指派； 赋值 vi. 将财产过户（尤指过户给债权人）"
    },
    {
        "word": "assignment",
        "definition": "n. 分配；任务；作业；功课"
    },
    {
        "word": "assist",
        "definition": "n. 帮助；助攻 vi. 参加；出席 vt. 帮助；促进"
    },
    {
        "word": "assistance",
        "definition": "n. 援助，帮助；辅助设备"
    },
    {
        "word": "assistant",
        "definition": "n. 助手，助理，助教 adj. 辅助的，助理的；有帮助的"
    },
    {
        "word": "associate",
        "definition": "n. 同事，伙伴；关联的事物 adj. 副的；联合的 vt. 联想；使联合；使发生联系 vi. 交往；结交"
    },
    {
        "word": "association",
        "definition": "n. 协会，联盟，社团；联合；联想"
    },
    {
        "word": "assume",
        "definition": "vt. 僭取；篡夺；夺取；擅用；侵占 vi. 假定；设想；承担；采取"
    },
    {
        "word": "assumption",
        "definition": "n. 假定；设想；担任；采取"
    },
    {
        "word": "assure",
        "definition": "vt. 保证；担保；使确信；弄清楚"
    },
    {
        "word": "assurance",
        "definition": "n. 保证，担保；（人寿）保险；确信；断言；厚脸皮，无耻"
    },
    {
        "word": "astonish",
        "definition": "vt. 使惊讶"
    },
    {
        "word": "astonishment",
        "definition": "n. 惊讶；令人惊讶的事物"
    },
    {
        "word": "astronaut",
        "definition": "n. 宇航员，航天员；太空旅行者"
    },
    {
        "word": "astronomy",
        "definition": "n. 天文学"
    },
    {
        "word": "astronomer",
        "definition": "n. 天文学家"
    },
    {
        "word": "astronomical",
        "definition": "adj. 天文的，天文学的；极大的"
    },
    {
        "word": "at",
        "definition": "prep. 在（表示存在或出现的地点、场所、位置、空间）；以（某种价格、速度等）；向；达；因为；朝；忙于 n. 阿特（老挝货币基本单位att）；砹（极不稳定放射性元素） abbr. 密封的（airtight）；气温（air temperature）"
    },
    {
        "word": "athlete",
        "definition": "n. 运动员，体育家；身强力壮的人"
    },
    {
        "word": "athletic",
        "definition": "adj. 运动的，运动员的；体格健壮的"
    },
    {
        "word": "atmosphere",
        "definition": "n. 气氛；大气；空气"
    },
    {
        "word": "atmospheric",
        "definition": "adj. 大气的，大气层的"
    },
    {
        "word": "atom",
        "definition": "n. 原子"
    },
    {
        "word": "atomic",
        "definition": "adj. 原子的，原子能的；微粒子的"
    },
    {
        "word": "atop",
        "definition": "prep. 在…的顶上 adv. 在顶上"
    },
    {
        "word": "attach",
        "definition": "vi. 附加；附属；伴随 vt. 使依附；贴上；系上；使依恋"
    },
    {
        "word": "attachment",
        "definition": "n. 附件；依恋；连接物；扣押财产"
    },
    {
        "word": "attack",
        "definition": "n. 攻击；抨击；疾病发作 vt. 攻击；抨击；动手干 vi. 攻击；腐蚀"
    },
    {
        "word": "attain",
        "definition": "n. 成就 vt. 达到，实现；获得；到达 vi. 达到；获得；到达"
    },
    {
        "word": "attainment",
        "definition": "n. 达到；成就；学识"
    },
    {
        "word": "attempt",
        "definition": "n. 企图，试图；攻击 vt. 企图，试图；尝试"
    },
    {
        "word": "attend",
        "definition": "vi. 出席；致力于；照料；照顾 vt. 出席；上（大学等）；照料；招待；陪伴"
    },
    {
        "word": "attendance",
        "definition": "n. 出席；到场；出席人数；考勤"
    },
    {
        "word": "attendant",
        "definition": "n. 服务员，侍者；随员，陪从 adj. 伴随的；侍候的"
    },
    {
        "word": "attention",
        "definition": "n. 注意力；关心；立正！（口令）"
    },
    {
        "word": "attentive",
        "definition": "adj. 留意的，注意的"
    },
    {
        "word": "attic",
        "definition": "n. 阁楼；顶楼；鼓室上的隐窝"
    },
    {
        "word": "attitude",
        "definition": "n. 态度；看法；意见；姿势"
    },
    {
        "word": "attorney",
        "definition": "n. 律师；代理人；检查官"
    },
    {
        "word": "attract",
        "definition": "vt. 吸引；引起 vi. 吸引；有吸引力"
    },
    {
        "word": "attraction",
        "definition": "n. 吸引，吸引力；引力；吸引人的事物"
    },
    {
        "word": "attractive",
        "definition": "adj. 吸引人的；有魅力的；引人注目的"
    },
    {
        "word": "attribute",
        "definition": "n. 属性；特质 vt. 归属；把…归于"
    },
    {
        "word": "attributable",
        "definition": "adj. 可归于…的；可归属的"
    },
    {
        "word": "attributive",
        "definition": "n. 定语 adj. 定语的；归属的；属性的"
    },
    {
        "word": "audience",
        "definition": "n. 观众；听众；读者；接见；正式会见；拜会"
    },
    {
        "word": "audio",
        "definition": "adj. 声音的； 音频的， 声频的"
    },
    {
        "word": "auditorium",
        "definition": "n. 礼堂，会堂；观众席"
    },
    {
        "word": "August",
        "definition": ""
    },
    {
        "word": "aunt",
        "definition": "n. 阿姨；姑妈；伯母；舅妈"
    },
    {
        "word": "auntie",
        "definition": "n. 伯母；阿姨；姑妈；姨妈；舅妈（aunt的昵称）"
    },
    {
        "word": "authentic",
        "definition": "adj. 真正的，真实的；可信的"
    },
    {
        "word": "authenticity",
        "definition": "n. 真实性，确实性；可靠性"
    },
    {
        "word": "author",
        "definition": "n. 作者；作家；创始人 vt. 创作出版"
    },
    {
        "word": "authority",
        "definition": "n. 权威；权力；当局"
    },
    {
        "word": "authoritative",
        "definition": "adj. 有权威的；命令式的；当局的"
    },
    {
        "word": "authorize",
        "definition": "vt. 批准，认可；授权给；委托代替"
    },
    {
        "word": "authorise",
        "definition": "vt. 授权；批准；允许；委任（等于authorize）"
    },
    {
        "word": "authorization",
        "definition": "n. 授权，认可；批准，委任"
    },
    {
        "word": "authorisation",
        "definition": "n. 授权；批准"
    },
    {
        "word": "auto",
        "definition": "n. 汽车（等于automobile）；自动 vi. 乘汽车"
    },
    {
        "word": "automobile",
        "definition": "n. 汽车 vt. 驾驶汽车 "
    },
    {
        "word": "automate",
        "definition": "vt. 使自动化，使自动操作 vi. 自动化，自动操作"
    },
    {
        "word": "automation",
        "definition": "n. 自动化；自动操作"
    },
    {
        "word": "automatic",
        "definition": "n. 自动机械；自动手枪 adj. 自动的；无意识的；必然的"
    },
    {
        "word": "automatically",
        "definition": "adj. 不经思索的 adv. 自动地；机械地；无意识地"
    },
    {
        "word": "autumn",
        "definition": "n. 秋天；成熟期；渐衰期，凋落期 adj. 秋天的，秋季的"
    },
    {
        "word": "available",
        "definition": "adj. 可获得的；可购得的；可找到的；有空的"
    },
    {
        "word": "availability",
        "definition": "n. 可用性；有效性；实用性"
    },
    {
        "word": "avenue",
        "definition": "n. 大街；林荫大道；(达到某物的)途径，手段，方法，渠道"
    },
    {
        "word": "average",
        "definition": "n. 平均；平均数；海损 adj. 平均的；普通的；通常的 vt. 算出…的平均数；将…平均分配；使…平衡 vi. 平均为；呈中间色"
    },
    {
        "word": "aviation",
        "definition": "n. 航空；飞行术；飞机制造业"
    },
    {
        "word": "avoid",
        "definition": "vt. 避免；避开，躲避；消除"
    },
    {
        "word": "avoidance",
        "definition": "n. 逃避；废止；职位空缺"
    },
    {
        "word": "await",
        "definition": "vt. 等候，等待；期待"
    },
    {
        "word": "awake",
        "definition": "adj. 醒着的 vt. 唤醒；使觉醒；激起，唤起 vi. 觉醒，意识到；醒来；被唤起"
    },
    {
        "word": "award",
        "definition": "n. 奖品；判决 vt. 授予；判定"
    },
    {
        "word": "aware",
        "definition": "adj. 意识到的；知道的；有…方面知识的；懂世故的"
    },
    {
        "word": "awareness",
        "definition": "n. 意识，认识；明白，知道 n. 人群对品牌或产品的认知"
    },
    {
        "word": "away",
        "definition": "adv. 离去，离开；在远处"
    },
    {
        "word": "awe",
        "definition": "n. 敬畏 vt. 使敬畏；使畏怯"
    },
    {
        "word": "awesome",
        "definition": "adj. 令人敬畏的；使人畏惧的；可怕的；极好的"
    },
    {
        "word": "awful",
        "definition": "adj. 可怕的；极坏的；使人敬畏的"
    },
    {
        "word": "awkward",
        "definition": "adj. 尴尬的；笨拙的；棘手的；不合适的"
    },
    {
        "word": "ax",
        "definition": "n. 斧头 vt. 削减；用斧修整；解雇"
    },
    {
        "word": "axe",
        "definition": "n. 斧 vt. 削减；用斧砍"
    },
    {
        "word": "axis",
        "definition": "n. 轴；轴线；轴心国"
    },
    {
        "word": "baby",
        "definition": "n. 婴儿，婴孩；孩子气的人 adj. 婴儿的；幼小的 vt. 纵容，娇纵；把……当婴儿般对待"
    },
    {
        "word": "baby boom",
        "definition": "n. 婴儿潮；生育高峰  战后婴儿潮；我家四个宝；人口增长的高峰期"
    },
    {
        "word": "baby boomer",
        "definition": "n. 在生育高峰期中出生的人  婴儿潮；婴儿潮世代；战后婴儿潮"
    },
    {
        "word": "bachelor",
        "definition": "n. 学士；单身汉；（尚未交配的）小雄兽"
    },
    {
        "word": "back",
        "definition": "n. 后面；背部；靠背；足球等的后卫；书报等的末尾 adj. 后面的；过去的；拖欠的 vt. 支持；后退；背书；下赌注 adv. 以前；向后地；来回地；上溯；回来；回原处 vi. 后退；背靠；倒退"
    },
    {
        "word": "background",
        "definition": "n. 背景；隐蔽的位置 adj. 背景的；发布背景材料的 vt. 作…的背景"
    },
    {
        "word": "backup",
        "definition": "n. 支持；后援；阻塞 adj. 支持的；候补的 vt. 做备份"
    },
    {
        "word": "backward",
        "definition": "adj. 向后的；反向的；发展迟缓的 adv. 向后地；相反地"
    },
    {
        "word": "backwards",
        "definition": "adv. 倒；向后；逆"
    },
    {
        "word": "backyard",
        "definition": "n. 后院；后庭"
    },
    {
        "word": "bacon",
        "definition": "n. 咸肉；腌肉；熏猪肉"
    },
    {
        "word": "bacteria",
        "definition": "n.  细菌"
    },
    {
        "word": "bad",
        "definition": "n. 坏事；坏人 adj. 坏的；严重的；劣质的 adv. 很，非常；坏地；邪恶地"
    },
    {
        "word": "badge",
        "definition": "n. 徽章；证章；标记 vt. 授给…徽章"
    },
    {
        "word": "badly",
        "definition": "adv. 非常，很；严重地，厉害地；恶劣地"
    },
    {
        "word": "badminton",
        "definition": "n. 羽毛球"
    },
    {
        "word": "bag",
        "definition": "n. 袋；猎获物；（俚）一瓶啤酒 vt. 猎获；把…装入袋中；占据，私吞；使膨大 vi. 松垂"
    },
    {
        "word": "baggage",
        "definition": "n. 行李； 辎重（军队的）"
    },
    {
        "word": "bail",
        "definition": "n. 保释，保释人；保释金；杓 vt. 保释，帮助某人脱离困境；往外舀水"
    },
    {
        "word": "bait",
        "definition": "n. 饵；诱饵 vt. 引诱；在…中放诱饵；折磨 vi. 中途休息"
    },
    {
        "word": "bake",
        "definition": "n. 烤；烘烤食品 vi. 烘面包；被烤干；受热 vt. 烤，烘焙"
    },
    {
        "word": "bakery",
        "definition": "n. 面包店"
    },
    {
        "word": "balance",
        "definition": "n. 平衡；余额；匀称 vt. 使平衡；结算；使相称 vi. 保持平衡；相称；抵销"
    },
    {
        "word": "balcony",
        "definition": "n. 阳台；包厢；戏院楼厅"
    },
    {
        "word": "ball",
        "definition": "n. 球；舞会 vt. 捏成球形 vi. 成团块"
    },
    {
        "word": "ballet",
        "definition": "n. 芭蕾舞剧；芭蕾舞乐曲"
    },
    {
        "word": "balloon",
        "definition": "n. 气球 adj. 像气球般鼓起的 vt. 使像气球般鼓起；使激增 vi. 激增；膨胀如气球"
    },
    {
        "word": "ballot",
        "definition": "n. 投票；投票用纸；投票总数 vt. 使投票表决；拉选票 vi. 投票；抽签决定"
    },
    {
        "word": "bamboo",
        "definition": "n. 竹，竹子 adj. 竹制的；土著居民的 vt. 为…装上篾条"
    },
    {
        "word": "ban",
        "definition": "n. 禁令，禁忌 vt. 禁止，取缔"
    },
    {
        "word": "banana",
        "definition": "n. 香蕉；喜剧演员；大鹰钩鼻"
    },
    {
        "word": "band",
        "definition": "n. 带，环； 波段；(演奏流行音乐的) 乐队 n. n.乐队；队；一群 vi. 用带绑扎；给...镶边"
    },
    {
        "word": "bandage",
        "definition": "n. 绷带 vt. 用绷带包扎"
    },
    {
        "word": "bang",
        "definition": "n. 刘海；重击；突然巨响 vt. 重击；发巨响 adv. 直接地；砰然地；突然巨响地"
    },
    {
        "word": "bank",
        "definition": "n. 银行；岸；浅滩；储库 vt. 将…存入银行；倾斜转弯 vi. 堆积；倾斜转弯"
    },
    {
        "word": "banking",
        "definition": "n. 银行业；银行业务；银行家的职业；筑堤 v. 把钱存入银行；做银行家；在…边筑堤（bank的现在分词）"
    },
    {
        "word": "banker",
        "definition": "n. 银行家；银行业者；掘土工"
    },
    {
        "word": "banknote",
        "definition": "n. 纸币"
    },
    {
        "word": "bankrupt",
        "definition": "n.  破产者 adj. 破产的 vt. 使破产"
    },
    {
        "word": "bankruptcy",
        "definition": "n. 破产"
    },
    {
        "word": "banner",
        "definition": "n. 横幅图片的广告模式 n. 旗帜，横幅,标语"
    },
    {
        "word": "banquet",
        "definition": "n. 宴会，盛宴；宴请，款待 vt. 宴请，设宴款待 vi. 参加宴会"
    },
    {
        "word": "bar",
        "definition": "n. 条，棒；酒吧；障碍；法庭 prep. 除……外 vt. 禁止；阻拦"
    },
    {
        "word": "barbecue",
        "definition": "n. 烤肉；吃烤肉的野宴 vt. 烧烤；烤肉"
    },
    {
        "word": "BBQ",
        "definition": ""
    },
    {
        "word": "barber",
        "definition": "n. 理发师 vt. 为…理发；修整 vi. 当理发师"
    },
    {
        "word": "bare",
        "definition": "adj. 空的；赤裸的，无遮蔽的 vt. 露出，使赤裸"
    },
    {
        "word": "barely",
        "definition": "adv. 仅仅，勉强；几乎不；公开地；贫乏地"
    },
    {
        "word": "bargain",
        "definition": "n. 交易；便宜货；契约 v. 讨价还价；议价；(谈价钱后)卖"
    },
    {
        "word": "bark",
        "definition": "n. 树皮；深青棕色；毛皮；皮肤；狗叫 vt. 狗叫；尖叫；剥皮"
    },
    {
        "word": "barrel",
        "definition": "n. 桶；枪管，炮管 vt. 把……装入桶内 vi. 快速移动"
    },
    {
        "word": "barrier",
        "definition": "n. 障碍物，屏障；界线 vt. 把…关入栅栏"
    },
    {
        "word": "base",
        "definition": "n. 基础；底部；垒 adj. 卑鄙的；低劣的 vt. 以…作基础"
    },
    {
        "word": "baseball",
        "definition": "n. 棒球；棒球运动"
    },
    {
        "word": "basement",
        "definition": "n. 地下室；地窖"
    },
    {
        "word": "basic",
        "definition": "n. 基础；要素 adj. 基本的；基础的"
    },
    {
        "word": "basically",
        "definition": "adv. 主要地，基本上"
    },
    {
        "word": "basin",
        "definition": "n. 水池；流域；盆地；盆"
    },
    {
        "word": "basis",
        "definition": "n. 基础；底部；主要成分；基本原则或原理"
    },
    {
        "word": "basket",
        "definition": "n. 篮子；（篮球比赛的）得分；一篮之量；篮筐 vt. 装入篮"
    },
    {
        "word": "basketball",
        "definition": "n. 篮球；篮球运动"
    },
    {
        "word": "bat",
        "definition": "n. 蝙蝠；球棒；球拍；批处理文件的扩展名 vt. 用球棒击球；击球率达… vi. 轮到击球；用球棒击球"
    },
    {
        "word": "batch",
        "definition": "n. 一批；一炉；一次所制之量 vt. 分批处理"
    },
    {
        "word": "bath",
        "definition": "n. 沐浴；浴室；浴盆 vt. 洗澡 vi. 洗澡"
    },
    {
        "word": "bathe",
        "definition": "n. 洗澡；游泳 vt. 沐浴；用水洗 vi. 洗澡；沐浴"
    },
    {
        "word": "bathroom",
        "definition": "n. 浴室；厕所；盥洗室"
    },
    {
        "word": "battalion",
        "definition": "n. 营，军营；军队，部队"
    },
    {
        "word": "battery",
        "definition": "n.  电池，蓄电池 n. 殴打 n. 炮台，炮位"
    },
    {
        "word": "battle",
        "definition": "n. 战役；斗争 vt. 与…作战 vi. 斗争；作战"
    },
    {
        "word": "bay",
        "definition": "n. 海湾；狗吠声 vt. 向…吠叫 vi. 吠叫；大声叫嚷"
    },
    {
        "word": "be",
        "definition": "vt. 是； 有，存在； 做，成为； 发生"
    },
    {
        "word": "beach",
        "definition": "n. 海滩；湖滨 vt. 将…拖上岸 vi. 搁浅；定居"
    },
    {
        "word": "beam",
        "definition": "n. 横梁；光线；电波；船宽； 秤杆 vt. 发送；以梁支撑；用…照射；流露 vi. 照射；堆满笑容"
    },
    {
        "word": "bean",
        "definition": "n. 豆；嘴峰；毫无价值的东西 vt. 击…的头部"
    },
    {
        "word": "bear",
        "definition": "n. 熊 vt. 结果实，开花（正式） vt. 忍受；承受；具有；支撑"
    },
    {
        "word": "beard",
        "definition": "n. 胡须；颌毛 vt. 公然反对；抓…的胡须 vi. 充当掩护；充当男随员"
    },
    {
        "word": "bearing",
        "definition": "n.  轴承；关系；方位；举止 v. 忍受（bear的ing形式）"
    },
    {
        "word": "beast",
        "definition": "n. 野兽；畜生，人面兽心的人"
    },
    {
        "word": "beat",
        "definition": "n. 拍子；敲击；有规律的一连串敲打 adj. 筋疲力尽的；疲惫不堪的 vt. 打；打败 vi. 打；打败；拍打；有节奏地舒张与收缩"
    },
    {
        "word": "beauty",
        "definition": "n. 美；美丽；美人；美好的东西"
    },
    {
        "word": "beautiful",
        "definition": "adj. 美丽的 出色地 出色的 迷人的 迷人地"
    },
    {
        "word": "beautify",
        "definition": "vt. 使美化，使变美 vi. 美化"
    },
    {
        "word": "because",
        "definition": "conj. 因为"
    },
    {
        "word": "become",
        "definition": "vt. 适合；相称 vi. 成为；变得；变成"
    },
    {
        "word": "bed",
        "definition": "n. 床；基础；河底， 海底 vt. 使睡觉；安置，嵌入；栽种 vi. 上床；分层"
    },
    {
        "word": "bedding",
        "definition": "n. 寝具；（建筑） 基床；（家畜）草垫 adj. 适于花坛种植的 vt. 把…栽入苗床（bed的ing形式） vi. 睡（bed的ing形式）"
    },
    {
        "word": "bee",
        "definition": "n. 蜜蜂，蜂；勤劳的人"
    },
    {
        "word": "beef",
        "definition": "n. 牛肉；肌肉；食用牛；牢骚 vt. 养；加强 vi. 抱怨，告发；发牢骚"
    },
    {
        "word": "beer",
        "definition": "n. 啤酒 vi. 喝啤酒"
    },
    {
        "word": "before",
        "definition": "prep. 在…之前，先于 conj. 在…以前；在…之前 adv. 以前；在前"
    },
    {
        "word": "beforehand",
        "definition": "adj. 提前的；预先准备好的 adv. 事先；预先"
    },
    {
        "word": "beg",
        "definition": "vi. 乞讨；请求 vt. 乞讨；恳求；回避正题"
    },
    {
        "word": "beggar",
        "definition": "n. 乞丐；穷人；家伙 vt. 使贫穷；使沦为乞丐"
    },
    {
        "word": "begin",
        "definition": "vi. 开始；首先 vt. 开始"
    },
    {
        "word": "beginning",
        "definition": "n. 开始；起点 v. 开始；创建（begin的ing形式）"
    },
    {
        "word": "behalf",
        "definition": "n. 代表；利益"
    },
    {
        "word": "behave",
        "definition": "vi. 表现；（机器等）运转；举止端正；（事物）起某种作用 vt. 使守规矩；使表现得…"
    },
    {
        "word": "behavior",
        "definition": "n. 行为，举止；态度；反应"
    },
    {
        "word": "behaviour",
        "definition": "n. 行为；习性；运行状况（=behavior）"
    },
    {
        "word": "behavioral",
        "definition": "adj. 行为的"
    },
    {
        "word": "behavioural",
        "definition": "adj. 行为的；动作的"
    },
    {
        "word": "behind",
        "definition": "prep. 落后于；支持；晚于 n. 屁股 adv. 在后地；在原处"
    },
    {
        "word": "being",
        "definition": "n. 存在；生命；本质；品格 adj. 存在的；现有的"
    },
    {
        "word": "belief",
        "definition": "n. 相信，信赖；信仰；教义"
    },
    {
        "word": "believe",
        "definition": "vi. 信任；料想；笃信宗教 vt. 相信；认为；信任"
    },
    {
        "word": "bell",
        "definition": "n. 铃，钟；钟声，铃声；钟状物 vt. 装钟于，系铃于 vi. 鸣钟；成钟状鼓起"
    },
    {
        "word": "belly",
        "definition": "n. 腹部；胃；食欲 vt. 使鼓起 vi. 涨满；鼓起"
    },
    {
        "word": "belong",
        "definition": "vi. 属于，应归入；居住；适宜；应被放置"
    },
    {
        "word": "belongings",
        "definition": "n.  财产，所有物；亲戚"
    },
    {
        "word": "beloved",
        "definition": "n. 心爱的人；亲爱的教友 adj. 心爱的；挚爱的"
    },
    {
        "word": "below",
        "definition": "prep. 在…下面 adv. 在下面，在较低处；在本页下面"
    },
    {
        "word": "belt",
        "definition": "n. 带；腰带；地带 vt. 用带子系住；用皮带抽打 vi. 猛击"
    },
    {
        "word": "bench",
        "definition": "n. 长凳；工作台；替补队员 vt. 给…以席位；为…设置条凳"
    },
    {
        "word": "bend",
        "definition": "n. 弯曲 vt. 使弯曲；使屈服；使致力；使朝向 vi. 弯曲，转弯；屈服；倾向；专心于"
    },
    {
        "word": "beneath",
        "definition": "prep. 在…之下 adv. 在下方"
    },
    {
        "word": "benefit",
        "definition": "n. 利益，好处；救济金 vt. 有益于，对…有益 vi. 受益，得益"
    },
    {
        "word": "beneficial",
        "definition": "adj. 有益的，有利的；可享利益的"
    },
    {
        "word": "beneficiary",
        "definition": "n.  受益人，受惠者；封臣 adj. 拥有封地的；受圣俸的"
    },
    {
        "word": "berry",
        "definition": "n. 浆果（葡萄，番茄等） vi. 采集浆果"
    },
    {
        "word": "beside",
        "definition": "prep. 在旁边；与…相比；和…无关"
    },
    {
        "word": "besides",
        "definition": "prep. 除…之外 adv. 此外；而且"
    },
    {
        "word": "best",
        "definition": "n. 最好的人，最好的事物；最佳状态 adj. 最好的 vt. 打败，胜过 adv. 最好地"
    },
    {
        "word": "best-seller",
        "definition": "n. 畅销书；畅销唱片"
    },
    {
        "word": "best-selling",
        "definition": "n. 畅销品 adj. 最畅销的；畅销作品的"
    },
    {
        "word": "bet",
        "definition": "n. 打赌，赌注；被打赌的事物 vt. 打赌；敢断定，确信 vi. 打赌"
    },
    {
        "word": "betray",
        "definition": "vt. 背叛；出卖；泄露（秘密）；露出…迹象"
    },
    {
        "word": "betrayal",
        "definition": "n. 背叛；辜负；暴露"
    },
    {
        "word": "better",
        "definition": "n. 长辈；较好者；打赌的人（等于bettor） adj. 较好的 vt. 改善；胜过 adv. 更好的；更多的；较大程度地 vi. 变得较好"
    },
    {
        "word": "between",
        "definition": "prep. 在…之间 adv. 在中间"
    },
    {
        "word": "beverage",
        "definition": "n. 饮料"
    },
    {
        "word": "beyond",
        "definition": "prep. 超过；越过；那一边；在...较远的一边 n. 远处 adv. 在远处；在更远处"
    },
    {
        "word": "bias",
        "definition": "n. 偏见；偏爱；斜纹；乖离率 adj. 偏斜的 vt. 使存偏见 adv. 偏斜地"
    },
    {
        "word": "Bible",
        "definition": ""
    },
    {
        "word": "Biblical",
        "definition": ""
    },
    {
        "word": "biblical",
        "definition": "adj. 圣经的；依据圣经的（等于biblical）"
    },
    {
        "word": "bicycle",
        "definition": "n. 自行车 vt. 骑自行车运送 vi. 骑脚踏车"
    },
    {
        "word": "bike",
        "definition": "n. 自行车；脚踏车 vi. 骑自行车（或摩托车）"
    },
    {
        "word": "bid",
        "definition": "n. 出价；叫牌；努力争取 vi. 投标；吩咐 vt. 投标；出价；表示；吩咐"
    },
    {
        "word": "big",
        "definition": "adj. 大的；重要的；量大的 adv. 大量地；顺利；夸大地"
    },
    {
        "word": "bill",
        "definition": "n.  法案；广告；账单； 票据；钞票；清单 vt. 宣布；开账单；用海报宣传"
    },
    {
        "word": "billion",
        "definition": "num. 十亿 n. 十亿；大量 adj. 十亿的"
    },
    {
        "word": "billionaire",
        "definition": "n. 亿万富翁"
    },
    {
        "word": "bin",
        "definition": "n. 箱子，容器；二进制 vt. 把…放入箱中"
    },
    {
        "word": "bind",
        "definition": "n. 捆绑；困境；讨厌的事情；植物的藤蔓 vt. 绑；约束；装订；包扎；凝固 vi. 结合；装订；有约束力；过紧"
    },
    {
        "word": "biochemistry",
        "definition": "n. 生物化学 生物化学过程"
    },
    {
        "word": "biochemical",
        "definition": "adj. 生物化学的"
    },
    {
        "word": "biochemist",
        "definition": "n. 生物化学家"
    },
    {
        "word": "biography",
        "definition": "n. 传记；档案；个人简介"
    },
    {
        "word": "biographical",
        "definition": "adj. 传记的，传记体的"
    },
    {
        "word": "biographer",
        "definition": "n. 传记作者"
    },
    {
        "word": "biology",
        "definition": "n. （一个地区全部的）生物；生物学"
    },
    {
        "word": "biological",
        "definition": "adj. 生物的；生物学的"
    },
    {
        "word": "biologist",
        "definition": "n. 生物学家"
    },
    {
        "word": "biotechnology",
        "definition": "n.  生物技术； 生物工艺学"
    },
    {
        "word": "bird",
        "definition": "n. 鸟；家伙；羽毛球 vt. 向…喝倒彩；起哄 vi. 猎鸟；观察研究野鸟"
    },
    {
        "word": "birth",
        "definition": "n. 出生；血统，出身；起源"
    },
    {
        "word": "birthday",
        "definition": "n. 生日，诞辰；诞生的日子"
    },
    {
        "word": "biscuit",
        "definition": "n. 小点心，饼干"
    },
    {
        "word": "bit",
        "definition": "n.  比特（二进位制信息单位）；少量；马嚼子；辅币；老一套；一点，一块 adj. 很小的；微不足道的 vt. 咬（bite的过去式和过去分词） vt. 控制 adv. 有点儿；相当"
    },
    {
        "word": "bitch",
        "definition": "n. 母狗，母狼；泼妇；牢骚事 vt. 糟蹋；弄糟 vi. 发牢骚"
    },
    {
        "word": "bite",
        "definition": "n. 咬；一口；咬伤；刺痛 abbr. 机内测试设备（Built-In Test Equipment） vt. 咬；刺痛 vi. 咬；刺痛"
    },
    {
        "word": "bitter",
        "definition": "n. 苦味；苦啤酒 adj. 苦的；痛苦的；尖刻的；充满仇恨的 vt. 使变苦 adv. 激烈地；严寒刺骨地"
    },
    {
        "word": "black",
        "definition": "n. 黑色；黑人；黑颜料 adj. 黑色的；黑人的；邪恶的 vt. 使变黑；把鞋油等涂在…上；把（眼眶）打成青肿 vi. 变黑"
    },
    {
        "word": "blackboard",
        "definition": "n. 黑板"
    },
    {
        "word": "blade",
        "definition": "n. 叶片；刀片，刀锋；剑"
    },
    {
        "word": "blame",
        "definition": "n. 责备；责任；过失 vt. 责备；归咎于"
    },
    {
        "word": "blank",
        "definition": "n. 空白；空虚；空白表格 adj. 空白的；空虚的；单调的 vt. 使…无效；使…模糊；封锁 vi. 消失；成为空白"
    },
    {
        "word": "blanket",
        "definition": "n. 毛毯，毯子；毯状物，覆盖层 adj. 总括的，全体的；没有限制的 vt. 覆盖，掩盖；用毯覆盖"
    },
    {
        "word": "blast",
        "definition": "n. 爆炸；冲击波；一阵 vt. 爆炸；损害；使枯萎 vi. 猛攻"
    },
    {
        "word": "bleed",
        "definition": "vt. 使出血；榨取 vi. 流血；渗出；悲痛"
    },
    {
        "word": "blend",
        "definition": "n. 混合；掺合物 vi. 混合；协调 vt. 混合"
    },
    {
        "word": "bless",
        "definition": "vt. 祝福；保佑；赞美"
    },
    {
        "word": "blessing",
        "definition": "n. 祝福；赐福；祷告 v. 使幸福（bless的ing形式）；使神圣化；为…祈神赐福"
    },
    {
        "word": "blind",
        "definition": "n. 掩饰，借口；百叶窗 adj. 盲目的；瞎的 vt. 使失明；使失去理智 adv. 盲目地；看不见地"
    },
    {
        "word": "block",
        "definition": "n. 块；街区；大厦；障碍物 adj. 成批的，大块的；交通堵塞的 vt. 阻止；阻塞；限制；封盖"
    },
    {
        "word": "blog",
        "definition": "n. 博客；部落格；网络日志"
    },
    {
        "word": "blond",
        "definition": "adj. 金发的 n. 白肤碧眼金发的人"
    },
    {
        "word": "blonde",
        "definition": "n. 白肤金发碧眼的女人 adj. 亚麻色的；金色的；白皙的；白肤金发碧眼的"
    },
    {
        "word": "blood",
        "definition": "n. 血，血液；血统 vt. 从…抽血；使先取得经验"
    },
    {
        "word": "bloody",
        "definition": "adj. 血腥的；非常的；嗜杀的，残忍的；血色的 vt. 使流血 adv. 很"
    },
    {
        "word": "bloom",
        "definition": "n. 花；青春；旺盛 vt. 使开花；使茂盛 vi. 开花；茂盛"
    },
    {
        "word": "blossom",
        "definition": "n. 花；开花期；兴旺期；花开的状态 vi. 开花；兴旺；发展成"
    },
    {
        "word": "blouse",
        "definition": "n. 宽松的上衣；女装衬衫 vt. 使…宽松下垂 vi. 宽松下垂"
    },
    {
        "word": "blow",
        "definition": "n. 吹；打击；殴打 vt. 风吹 vi. 风吹；喘气"
    },
    {
        "word": "blue",
        "definition": "adj. 蓝色的；沮丧的，忧郁的；下流的 n. 蓝色；（美国海、陆、空三军穿的）蓝色制服；蓝颜料；布鲁斯（歌曲）（一种伤感的美国黑人民歌 vi. 变成蓝色，呈蓝色 vt. 把…染成蓝色；使成蓝色；给…用上蓝剂；用上蓝剂于"
    },
    {
        "word": "blueprint",
        "definition": "n. 蓝图，设计图；计划 vt. 计划；制成蓝图"
    },
    {
        "word": "blur",
        "definition": "n. 污迹；模糊不清的事物 vt. 涂污；使…模糊不清；使暗淡；玷污 vi. 沾上污迹；变模糊"
    },
    {
        "word": "board",
        "definition": "n. 董事会；木板；甲板；膳食 vt. 上（飞机、车、船等）；用板盖上；给提供膳宿 vi. 寄宿"
    },
    {
        "word": "boast",
        "definition": "n. 自夸；值得夸耀的事物，引以为荣的事物 vi. 自吹自擂 vt. 夸口说，自吹自擂说；以有…而自豪"
    },
    {
        "word": "boastful",
        "definition": "adj. 自夸的；自负的；喜夸耀的"
    },
    {
        "word": "boat",
        "definition": "n. 小船；轮船 vi. 划船"
    },
    {
        "word": "body",
        "definition": "n. 身体；主体；大量；团体；主要部分 vt. 赋以形体"
    },
    {
        "word": "bodily",
        "definition": "adj. 身体的；肉体的 adv. 整体地；亲自地；以肉体形式"
    },
    {
        "word": "boil",
        "definition": "n. 沸腾，煮沸；疖子 vt. 煮沸，烧开；使…激动；使…蒸发 vi. 煮沸，沸腾；激动，激昂"
    },
    {
        "word": "boiler",
        "definition": "n. 锅炉；烧水壶，热水器；盛热水器"
    },
    {
        "word": "bold",
        "definition": "adj. 大胆的，英勇的；黑体的；厚颜无耻的；险峻的"
    },
    {
        "word": "bolt",
        "definition": "n. 螺栓，螺钉；闪电，雷电；门闩；弩箭;（布的）一匹，一卷 vt. 筛选；囫囵吞下；（把门、窗等）闩上；突然说出，脱口说出 vi. （门窗等）闩上，拴住；冲出，跳出；（马等的）脱缰；囫囵吞下 adv. 突然地；像箭似地；直立地"
    },
    {
        "word": "bomb",
        "definition": "n. 炸弹 vt. 轰炸，投弹于 vi. 轰炸，投弹；失败"
    },
    {
        "word": "bond",
        "definition": "n. 债券；结合；约定；粘合剂；纽带 vt. 使结合；以…作保 vi. 结合，团结在一起"
    },
    {
        "word": "bondage",
        "definition": "n. 奴役，束缚；奴役身份"
    },
    {
        "word": "bone",
        "definition": "n. 骨；骨骼 vt. 剔去...的骨；施骨肥于 vi. 苦学；专心致志"
    },
    {
        "word": "bony",
        "definition": "adj. 骨的；多骨的；瘦骨嶙峋的；似骨的"
    },
    {
        "word": "bonus",
        "definition": "n. 奖金；红利；额外津贴"
    },
    {
        "word": "book",
        "definition": "n. 书籍；卷；帐簿；名册；工作簿 vt. 预订；登记"
    },
    {
        "word": "boom",
        "definition": "n. 繁荣；吊杆；隆隆声 vt. 使兴旺；发隆隆声 vi. 急速发展；发隆隆声"
    },
    {
        "word": "boost",
        "definition": "n. 推动；帮助；宣扬 vi. 宣扬；偷窃 vt. 促进；增加；支援"
    },
    {
        "word": "boot",
        "definition": "n. 靴子；踢；汽车行李箱 vt. 引导；踢；解雇；使穿靴"
    },
    {
        "word": "booth",
        "definition": "n. 货摊；公用电话亭"
    },
    {
        "word": "border",
        "definition": "n. 边境；边界；国界 vt. 接近；与…接壤；在…上镶边 vi. 接界；近似"
    },
    {
        "word": "bore",
        "definition": "n. 孔；令人讨厌的人 vt. 钻孔；使烦扰 vi. 钻孔"
    },
    {
        "word": "boring",
        "definition": "n. 钻孔 adj. 无聊的；令人厌烦的 v. 钻孔；使厌烦；挖空（bore的ing形式）"
    },
    {
        "word": "born",
        "definition": "v. 出世（bear的过去分词） adj. 天生的"
    },
    {
        "word": "borrow",
        "definition": "vt. 借；借用 vi. 借；借用；从其他语言中引入"
    },
    {
        "word": "boss",
        "definition": "n. 老板；首领；工头 vt. 指挥，调遣；当…的领导 vi. 当首领，发号施令"
    },
    {
        "word": "both",
        "definition": "conj. 既…且… adj. 两个的；两者的 pron. 双方都；两者都 adv. 并；又；两者皆"
    },
    {
        "word": "bother",
        "definition": "n. 麻烦；烦恼 vt. 烦扰，打扰；使……不安；使……恼怒 vi. 操心，麻烦；烦恼"
    },
    {
        "word": "bottle",
        "definition": "n. 瓶子；一瓶的容量 vt. 控制；把…装入瓶中 vi. （街头艺人演出后）收拢钱币"
    },
    {
        "word": "bottom",
        "definition": "n. 底部；末端；臀部；尽头 adj. 底部的 vt. 装底；测量深浅；查明真相 vi. 到达底部；建立基础"
    },
    {
        "word": "bounce",
        "definition": "n. 跳；弹力；活力 vt. 弹跳；使弹起 vi. 弹跳；弹起，反跳；弹回"
    },
    {
        "word": "bound",
        "definition": "n. 范围；跳跃 adj. 有义务的；必定的；受约束的；装有封面的 vt. 束缚；使跳跃 vi. 限制；弹起"
    },
    {
        "word": "boundary",
        "definition": "n. 边界；范围；分界线"
    },
    {
        "word": "bow",
        "definition": "n. 弓；鞠躬；船首 adj. 弯曲的 vi. 鞠躬；弯腰 vt. 鞠躬；弯腰"
    },
    {
        "word": "bowel",
        "definition": "n. 肠；内部；同情 vt. 将……的肚肠取出"
    },
    {
        "word": "bowl",
        "definition": "n. 碗；木球；大酒杯 vt. 投球；旋转；平稳快速移动 vi. 玩保龄球；滑动；平稳快速移动"
    },
    {
        "word": "box",
        "definition": "n. 箱，盒子；包厢；一拳 vt. 拳击；装…入盒中；打耳光 vi. 拳击"
    },
    {
        "word": "boxing",
        "definition": "n. 拳击；装箱；围模；做箱的材料 v. 将…装入盒中（box的ing形式）"
    },
    {
        "word": "boy",
        "definition": "n. 男孩；男人"
    },
    {
        "word": "bracket",
        "definition": "n. 支架；括号；墙上凸出的托架 vt. 括在一起；把…归入同一类；排除"
    },
    {
        "word": "brag",
        "definition": "n. 吹牛，自夸 vi. 吹牛，自夸 vt. 吹牛，吹嘘"
    },
    {
        "word": "brain",
        "definition": "n. 头脑，智力；脑袋 vt. 猛击…的头部"
    },
    {
        "word": "brake",
        "definition": "n. 闸，刹车；阻碍 vt. 刹车 vi. 刹车"
    },
    {
        "word": "branch",
        "definition": "n. 树枝，分枝；分部；支流 vt. 分支；出现分歧 vi. 分支；出现分歧"
    },
    {
        "word": "brand",
        "definition": "n. 商标，牌子；烙印 vt. 铭刻于，铭记；打烙印于；印…商标于"
    },
    {
        "word": "brand-new",
        "definition": "adj. 崭新的；最近获得的"
    },
    {
        "word": "brandy",
        "definition": "n. 白兰地酒"
    },
    {
        "word": "brass",
        "definition": "n. 黄铜；黄铜制品；铜管乐器；厚脸皮"
    },
    {
        "word": "brave",
        "definition": "n. 勇士 adj. 勇敢的；华丽的 vt. 勇敢地面对"
    },
    {
        "word": "bravery",
        "definition": "n. 勇敢；勇气"
    },
    {
        "word": "bread",
        "definition": "n. 面包；生计 vt. 在…上洒面包屑"
    },
    {
        "word": "break",
        "definition": "vi. 打破；折断；弄坏；削弱 vt. （使）破；打破（纪录）；（常指好天气）突变；开始 vi. （嗓音）突变；突破；破晓；（价格）突然下跌 n. 破裂；间断；（持续一段时间的状况的）改变；间歇"
    },
    {
        "word": "breakdown",
        "definition": "n. 故障；崩溃；分解；分类；衰弱；跺脚曳步舞"
    },
    {
        "word": "breakfast",
        "definition": "n. 早餐；早饭 vt. 为…供应早餐 vi. 吃早餐"
    },
    {
        "word": "breakthrough",
        "definition": "n. 突破；突破性进展"
    },
    {
        "word": "breast",
        "definition": "n. 乳房，胸部；胸怀；心情 vt. 以胸对着；与…搏斗"
    },
    {
        "word": "breath",
        "definition": "n. 呼吸，气息；一口气，（呼吸的）一次；瞬间，瞬息；微风；迹象；无声音，气音"
    },
    {
        "word": "breathe",
        "definition": "vi. 呼吸；低语；松口气；（风）轻拂 vt. 呼吸；使喘息；流露；低声说"
    },
    {
        "word": "breed",
        "definition": "n.  品种；种类，类型 vt. 繁殖；饲养；养育，教育；引起 vi. 繁殖；饲养；产生"
    },
    {
        "word": "breeze",
        "definition": "n. 微风；轻而易举的事；煤屑；焦炭渣；小风波 vi. 吹微风；逃走"
    },
    {
        "word": "bribe",
        "definition": "n. 贿赂 vt. 贿赂，收买 vi. 行贿"
    },
    {
        "word": "bribery",
        "definition": "n.  贿赂；受贿；行贿"
    },
    {
        "word": "brick",
        "definition": "n. 砖，砖块；砖形物；心肠好的人 adj. 用砖做的；似砖的 vt. 用砖砌"
    },
    {
        "word": "bride",
        "definition": "n. 新娘；姑娘，女朋友"
    },
    {
        "word": "bridegroom",
        "definition": "n. 新郎"
    },
    {
        "word": "bridge",
        "definition": "n. 桥；桥牌；桥接器；船桥 vt. 架桥；渡过"
    },
    {
        "word": "brief",
        "definition": "n. 摘要，简报；概要，诉书 adj. 简短的，简洁的；短暂的，草率的 vt. 简报，摘要；作…的提要"
    },
    {
        "word": "briefing",
        "definition": "n. 简报；作战指示 v. 概述；作…的摘要（brief的现在分词）"
    },
    {
        "word": "briefcase",
        "definition": "n. 公文包"
    },
    {
        "word": "bright",
        "definition": "n. 车头灯光 adj. 明亮的，鲜明的；聪明的；愉快的 adv. 明亮地；光明地；欢快地"
    },
    {
        "word": "brighten",
        "definition": "vt. 使闪亮；使生辉；使快乐高兴 vi. 明亮；变亮；活跃；快乐高兴"
    },
    {
        "word": "brilliant",
        "definition": "adj. 灿烂的，闪耀的；杰出的；有才气的；精彩的，绝妙的"
    },
    {
        "word": "brilliance",
        "definition": "n. 光辉；才华；宏伟"
    },
    {
        "word": "bring",
        "definition": "vt. 带来；促使；引起；使某人处于某种情况或境地"
    },
    {
        "word": "broad",
        "definition": "n. 宽阔部分 adj. 宽的，辽阔的；显著的；大概的 adv. 宽阔地"
    },
    {
        "word": "broaden",
        "definition": "vt. 使扩大；使变宽 vi. 扩大，变阔；变宽，加宽"
    },
    {
        "word": "breadth",
        "definition": "n. 宽度，幅度；宽宏"
    },
    {
        "word": "broadcast",
        "definition": "n. 广播；播音；广播节目 adj. 广播的 vt. 播送，播放；（无线电或电视）广播；播撒（种子） vi. 广播，播送；播放"
    },
    {
        "word": "brochure",
        "definition": "n. 手册，小册子"
    },
    {
        "word": "broke",
        "definition": "v. 打破，断掉（break的过去式） adj. 一文不名的，破产的"
    },
    {
        "word": "broker",
        "definition": "n. 经纪人，掮客 vt. 以中间人等身分安排... vi. 作为权力经纪人进行谈判"
    },
    {
        "word": "broom",
        "definition": "n. 扫帚；金雀花 vt. 扫除 vi. 桩顶开花或开裂"
    },
    {
        "word": "brother",
        "definition": "n. 兄弟；同事；战友 int. 我的老兄！"
    },
    {
        "word": "brow",
        "definition": "n. 眉，眉毛；额；表情"
    },
    {
        "word": "brown",
        "definition": "n. 褐色，棕色 adj. 棕色的，褐色的；太阳晒黑的 vt. 使变成褐色 vi. 变成褐色"
    },
    {
        "word": "browse",
        "definition": "n. 浏览；吃草 vt. 浏览；吃草 vi. 浏览；吃草；漫不经心地看商品"
    },
    {
        "word": "browser",
        "definition": "n.  浏览器；吃嫩叶的动物；浏览书本的人"
    },
    {
        "word": "brunch",
        "definition": "n. 早午餐"
    },
    {
        "word": "brush",
        "definition": "n. 刷子；画笔；毛笔；争吵；与某人有效冲突；灌木丛地带；矮树丛；狐狸尾巴 vi. 刷；擦过；掠过；（经过时）轻触 vt. 刷；画；"
    },
    {
        "word": "brutal",
        "definition": "adj. 残忍的；野蛮的，不讲理的"
    },
    {
        "word": "brutality",
        "definition": "n. 无情；残忍；暴行（需用复数形式）"
    },
    {
        "word": "bubble",
        "definition": "n. 气泡，泡沫，泡状物；透明圆形罩，圆形顶 vt. 使冒泡；滔滔不绝地说 vi. 沸腾，冒泡；发出气泡声"
    },
    {
        "word": "buck",
        "definition": "n. （美）钱，元；雄鹿；纨绔子弟；年轻的印第安人或黑人"
    },
    {
        "word": "bucket",
        "definition": "n. 桶，水桶；铲斗；一桶的量 v. 倾盆而下；颠簸着行进"
    },
    {
        "word": "buckle",
        "definition": "n. 皮带扣，带扣 vi. 扣住；变弯曲 vt. 扣住；使弯曲"
    },
    {
        "word": "bud",
        "definition": "n. 芽，萌芽；蓓蕾 vt. 使发芽 vi. 发芽，萌芽"
    },
    {
        "word": "buddy",
        "definition": "n. 伙伴，好朋友；密友；小男孩 vi. 做好朋友，交朋友"
    },
    {
        "word": "budget",
        "definition": "n. 预算，预算费 adj. 廉价的 vt. 安排，预定；把…编入预算 vi. 编预算，做预算"
    },
    {
        "word": "budgetary",
        "definition": "adj. 预算的"
    },
    {
        "word": "buffet",
        "definition": "n. 自助餐；小卖部；打击；猛烈冲击 adj. 自助的；自助餐的 vi. 斗争；奋勇前进 vt. 与…搏斗；连续猛击"
    },
    {
        "word": "bug",
        "definition": "n. 臭虫，小虫；故障；窃听器 vt. 烦扰，打扰；装窃听器 vi. 装置窃听器；打扰"
    },
    {
        "word": "build",
        "definition": "n. 构造；体形；体格 vi. 建筑；建造 vt. 建立；建筑"
    },
    {
        "word": "building",
        "definition": "n. 建筑；建筑物 v. 建筑；建立；增加（build的ing形式）"
    },
    {
        "word": "bulb",
        "definition": "n. 电灯泡；鳞茎；球状物 vi. 生球茎；膨胀成球状"
    },
    {
        "word": "bulk",
        "definition": "n. 体积，容量；大多数，大部分；大块 vt. 使扩大，使形成大量；使显得重要"
    },
    {
        "word": "bulky",
        "definition": "adj. 体积大的；庞大的；笨重的"
    },
    {
        "word": "bull",
        "definition": "n. 公牛；看好股市者；粗壮如牛的人；胡说八道；印玺 adj. 大型的；公牛似的；雄性的 vt. 企图抬高证券价格；吓唬；强力实现 vi. 价格上涨；走运；猛推；吹牛"
    },
    {
        "word": "bullet",
        "definition": "n. 子弹；只选某党全部候选人的投票；豆子 vi. 射出；迅速行进"
    },
    {
        "word": "bulletin",
        "definition": "n. 公告，公报 vt. 公布，公告"
    },
    {
        "word": "bully",
        "definition": "n. 欺凌弱小者；土霸 vt. 欺负；威吓 adj. 第一流的；特好的 vi. 欺侮人 adv. 很；十分 int. 好；妙"
    },
    {
        "word": "bump",
        "definition": "n. 肿块，隆起物；撞击 vi. 碰撞，撞击；颠簸而行 vt. 碰，撞；颠簸 adv. 突然地，猛烈地"
    },
    {
        "word": "bumper",
        "definition": "n. 缓冲器，保险杆，减震物 adj. 丰盛的，丰富的 vt. 装满；为…祝酒 vi. 干杯"
    },
    {
        "word": "bunch",
        "definition": "n. 群；串；突出物 vt. 使成一串；使打褶 vi. 隆起；打褶；形成一串"
    },
    {
        "word": "bundle",
        "definition": "n. 束；捆 vt. 捆 vi. 匆忙离开"
    },
    {
        "word": "burden",
        "definition": "n. 负担；责任；船的载货量 vt. 使负担；烦扰；装货于"
    },
    {
        "word": "bureau",
        "definition": "n. 局，处；衣柜；办公桌"
    },
    {
        "word": "burn",
        "definition": "n. 灼伤，烧伤；烙印 vt. 燃烧；烧毁，灼伤；激起…的愤怒 vi. 燃烧；烧毁；发热"
    },
    {
        "word": "burst",
        "definition": "n. 爆发，突发；爆炸 vt. 爆发，突发；爆炸 vi. 爆发，突发；爆炸"
    },
    {
        "word": "bury",
        "definition": "vt. 埋葬；隐藏"
    },
    {
        "word": "burial",
        "definition": "n. 埋葬；葬礼；弃绝 adj. 埋葬的"
    },
    {
        "word": "bus",
        "definition": "n. 公共汽车 乘公共汽车"
    },
    {
        "word": "bush",
        "definition": "n. 灌木；矮树丛 adj. 如灌木般长得低矮的；粗野的 vt. 以灌木装饰；使…精疲力竭 vi. 丛生；浓密地生长"
    },
    {
        "word": "bushy",
        "definition": "adj. 浓密的；灌木茂密的；多毛的"
    },
    {
        "word": "business",
        "definition": "n. 商业； 生意； 交易；事情"
    },
    {
        "word": "businessman",
        "definition": "n. 商人"
    },
    {
        "word": "busy",
        "definition": "adj. 忙碌的；热闹的；正被占用的 vt. 使忙于"
    },
    {
        "word": "but",
        "definition": "conj. 但是；而是；然而 adv. 仅仅，只 prep. 除…以外"
    },
    {
        "word": "butcher",
        "definition": "n. 屠夫 vt. 屠杀"
    },
    {
        "word": "butter",
        "definition": "n. 黄油；奶油；奉承话 vt. 涂黄油于；讨好"
    },
    {
        "word": "butterfly",
        "definition": "n. 蝴蝶；蝶泳；举止轻浮的人；追求享乐的人"
    },
    {
        "word": "button",
        "definition": "n. 按钮；纽扣 vt. 扣住；扣紧；在…上装纽扣 vi. 扣住；装有纽扣；扣上纽扣"
    },
    {
        "word": "buy",
        "definition": "n. 购买，买卖；所购的物品 vi. 买，采购 vt. 购买；获得；贿赂"
    },
    {
        "word": "buyer",
        "definition": "n. 买主；采购员"
    },
    {
        "word": "by",
        "definition": "prep. 通过；被；依据；经由；在附近；在……之前 adv. 通过；经过；附近； 白俄罗斯的国家代码顶级域名"
    },
    {
        "word": "bypass",
        "definition": "n. 旁路； 支路 vt. 绕开；忽视；设旁路；迂回"
    },
    {
        "word": "bystander",
        "definition": "n. 旁观者；看热闹的人"
    },
    {
        "word": "cab",
        "definition": "n. 驾驶室；出租汽车；出租马车 vi. 乘出租马车（或汽车）"
    },
    {
        "word": "cabbage",
        "definition": "n. 卷心菜，甘蓝菜，洋白菜；（俚)脑袋；（非正式、侮辱）植物人（常用于英式英语）；（俚）钱，尤指纸币（常用于美式俚语）"
    },
    {
        "word": "cabin",
        "definition": "n. 小屋；客舱；船舱 vt. 把…关在小屋里 vi. 住在小屋里"
    },
    {
        "word": "cabinet",
        "definition": "n. 内阁；橱柜；展览艺术品的小陈列室 adj. 内阁的；私下的，秘密的"
    },
    {
        "word": "cable",
        "definition": "n. 缆绳；电缆；海底电报 vt. 打电报 vi. 打海底电报"
    },
    {
        "word": "cafe",
        "definition": "n. 咖啡馆；小餐馆"
    },
    {
        "word": "cafeteria",
        "definition": "n. 自助餐厅"
    },
    {
        "word": "cage",
        "definition": "n. 笼，兽笼；牢房，监狱 vt. 把…关进笼子；把…囚禁起来"
    },
    {
        "word": "cake",
        "definition": "n. 蛋糕；块状物；利益总额 vt. 使结块 vi. 结成块状"
    },
    {
        "word": "calculate",
        "definition": "vt. 计算；预测；认为；打算 vi. 计算；以为；作打算"
    },
    {
        "word": "calculation",
        "definition": "n. 计算；估计；计算的结果；深思熟虑"
    },
    {
        "word": "calculator",
        "definition": "n. 计算器；计算者"
    },
    {
        "word": "calculating",
        "definition": "adj. 计算的；深谋远虑的；审慎的 v. 计算（calculate的ing形式）"
    },
    {
        "word": "calendar",
        "definition": "n. 日历； 历法；日程表 vt. 将…列入表中；将…排入日程表"
    },
    {
        "word": "calf",
        "definition": "n.  腓肠，小腿；小牛；小牛皮；(鲸等大哺乳动物的)幼崽"
    },
    {
        "word": "call",
        "definition": "n. 电话；呼叫；要求；访问 vi. 呼叫；拜访；叫牌 vt. 呼叫；称呼；召集"
    },
    {
        "word": "calling",
        "definition": "n. 职业；欲望；点名；召集；邀请 v. 召；呼唤（call的现在分词）；称之为"
    },
    {
        "word": "calm",
        "definition": "n. 风平浪静 adj. 静的，平静的；沉着的 vt. 使平静；使镇定 vi. 平静下来；镇定下来"
    },
    {
        "word": "calorie",
        "definition": "n. 卡路里（热量单位）"
    },
    {
        "word": "camel",
        "definition": "n.  骆驼；打捞浮筒；工作作风官僚 adj. 驼色的；暗棕色的 vi. 工作刻板平庸"
    },
    {
        "word": "camera",
        "definition": "n. 照相机；摄影机"
    },
    {
        "word": "camp",
        "definition": "n. 露营 vt. 扎营；使扎营 vi. 露营；扎营"
    },
    {
        "word": "campaign",
        "definition": "n. 运动；活动；战役 vi. 作战；参加竞选；参加活动"
    },
    {
        "word": "campus",
        "definition": "n. （大学）校园；大学，大学生活；校园内的草地"
    },
    {
        "word": "can",
        "definition": "aux. 能； 能够； 可以； 可能 n. 罐头； （用金属或塑料制作的）容器； （马口铁或其他金属制作的）食品罐头 vt. 将…装入密封罐中保存"
    },
    {
        "word": "canal",
        "definition": "n. 运河； 水道； 管道；灌溉水渠 vt. 在…开凿运河"
    },
    {
        "word": "cancel",
        "definition": "vi. 取消，撤销 vt. 取消；删去 vi. 取消；相互抵消 n. 取消，撤销"
    },
    {
        "word": "cancellation",
        "definition": "n. 取消；删除"
    },
    {
        "word": "cancer",
        "definition": " 巨蟹座"
    },
    {
        "word": "candidate",
        "definition": "n. 候选人，候补者；应试者"
    },
    {
        "word": "candidacy",
        "definition": "n. 候选资格；候选状态"
    },
    {
        "word": "candle",
        "definition": "n. 蜡烛；烛光；烛形物 vt. 对着光检查"
    },
    {
        "word": "candy",
        "definition": "n. 糖果（等于sweets）；冰糖（等于sugar candy，rock candy）；毒品 adj. 新潮的（服饰）；甜言蜜语的 vt. 用糖煮；使结晶为砂糖；美化 vi. 糖煮；成为结晶"
    },
    {
        "word": "cane",
        "definition": "n. 手杖；藤条；细长的茎 vt. 以杖击；以藤编制"
    },
    {
        "word": "canteen",
        "definition": "n. 食堂，小卖部；水壶"
    },
    {
        "word": "cap",
        "definition": "n. 盖；帽子 vt. 覆盖；胜过；给…戴帽；加盖于 vi. 脱帽致意"
    },
    {
        "word": "capable",
        "definition": "adj. 能干的，能胜任的；有才华的"
    },
    {
        "word": "capability",
        "definition": "n. 才能，能力；性能，容量"
    },
    {
        "word": "capacity",
        "definition": "n. 能力；容量；资格，地位；生产力"
    },
    {
        "word": "capital",
        "definition": "n. 首都，省会；资金；大写字母；资本家 adj. 首都的；重要的；大写的"
    },
    {
        "word": "capitalist",
        "definition": "n. 资本家；资本主义者 adj. 资本主义的；资本家的"
    },
    {
        "word": "capitalism",
        "definition": "n. 资本主义"
    },
    {
        "word": "captain",
        "definition": "n. 队长，首领；船长；上尉；海军上校 vt. 指挥；率领"
    },
    {
        "word": "capture",
        "definition": "n. 捕获；战利品，俘虏 vt. 俘获；夺得；捕捉，拍摄,录制"
    },
    {
        "word": "car",
        "definition": "n. 汽车；车厢"
    },
    {
        "word": "carbon",
        "definition": "n.  碳；碳棒；复写纸 adj. 碳的；碳处理的"
    },
    {
        "word": "card",
        "definition": "n. 卡片；纸牌；明信片 vt. 记于卡片上"
    },
    {
        "word": "cardboard",
        "definition": "n.  硬纸板；纸板箱；卡纸板 adj. 不真实的；硬纸板制的"
    },
    {
        "word": "care",
        "definition": "n. 关怀；照料；谨慎；忧虑 vt. 在意；希望或喜欢 vi. 照顾；关心；喜爱；顾虑"
    },
    {
        "word": "careful",
        "definition": "adj. 仔细的，小心的"
    },
    {
        "word": "careless",
        "definition": "adj. 粗心的；无忧无虑的；淡漠的"
    },
    {
        "word": "career",
        "definition": "n. 生涯；职业；事业；速度，全速 adj. 作为毕生职业的 vi. 全速前进，猛冲"
    },
    {
        "word": "cargo",
        "definition": "n. 货物，船货"
    },
    {
        "word": "carpenter",
        "definition": "n. 木匠，木工 vt. 制作 vi. 当木匠，做木匠工作"
    },
    {
        "word": "carpet",
        "definition": "n. 地毯；地毯状覆盖物 vt. 在…上铺地毯，把地毯铺在…上；斥责"
    },
    {
        "word": "carriage",
        "definition": "n. 运输；运费；四轮马车；举止；客车厢"
    },
    {
        "word": "carrier",
        "definition": "n.  载体；运送者；带菌者；货架"
    },
    {
        "word": "carrot",
        "definition": "n. 胡萝卜 诱饵"
    },
    {
        "word": "carry",
        "definition": "n. 运载； 进位；射程 vi. 能达到；被携带；被搬运 vt. 拿，扛；携带；支持；搬运"
    },
    {
        "word": "cart",
        "definition": "n. 二轮运货马车 vt. 用车装载 vi. 驾运货马车；用运货车运送"
    },
    {
        "word": "cartoon",
        "definition": "n. 卡通片， 动画片；连环漫画 vt. 为…画漫画 vi. 画漫画"
    },
    {
        "word": "cartoonist",
        "definition": "n. 漫画家"
    },
    {
        "word": "case",
        "definition": "n. 情况；实例；箱 vt. 包围；把…装于容器中"
    },
    {
        "word": "cash",
        "definition": "n. 现款，现金 vt. 将…兑现；支付现款"
    },
    {
        "word": "cashier",
        "definition": "n. 出纳员；司库；收银员 vt. 解雇；抛弃"
    },
    {
        "word": "cast",
        "definition": "n. 投掷，抛；铸件， 铸型；演员阵容；脱落物 vt. 投，抛；计算；浇铸；投射（光、影、视线等） vi. 投，抛垂钓鱼钩；计算，把几个数字加起来"
    },
    {
        "word": "castle",
        "definition": "n. 城堡；象棋中的车 vt. 置…于城堡中；筑城堡防御"
    },
    {
        "word": "casual",
        "definition": "n. 便装；临时工人；待命士兵 adj. 随便的；非正式的；临时的；偶然的"
    },
    {
        "word": "cat",
        "definition": "n. 猫，猫科动物"
    },
    {
        "word": "catalog",
        "definition": "n.  目录；登记 vt. 登记；为…编目录 vi. 编目录；按确定价格收入目录（等于catalogue）"
    },
    {
        "word": "catalogue",
        "definition": "n. 目录；（美）大学情况一览 vt. 把…编入目录"
    },
    {
        "word": "catch",
        "definition": "n. 捕捉；捕获物；窗钩 vt. 赶上；抓住；感染；了解 vi. 赶上；抓住"
    },
    {
        "word": "category",
        "definition": "n. 种类，分类； 范畴"
    },
    {
        "word": "cater",
        "definition": "vt. 投合，迎合；满足需要；提供饮食及服务"
    },
    {
        "word": "cattle",
        "definition": "n. 牛；牲畜（骂人的话）；家畜；无价值的人"
    },
    {
        "word": "cause",
        "definition": "n. 原因；事业；目标 vt. 引起；使遭受"
    },
    {
        "word": "caution",
        "definition": "n. 小心，谨慎；警告，警示 vt. 警告"
    },
    {
        "word": "cautious",
        "definition": "adj. 谨慎的；十分小心的"
    },
    {
        "word": "cave",
        "definition": "n. 洞穴，窑洞 vi. 凹陷，塌落；投降 vt. 使凹陷，使塌落；在…挖洞穴"
    },
    {
        "word": "cease",
        "definition": "n. 停止 vi. 停止；终了 vt. 停止；结束"
    },
    {
        "word": "ceiling",
        "definition": "n. 天花板；上限"
    },
    {
        "word": "celebrate",
        "definition": "vt. 庆祝；举行；赞美；祝贺；宣告 vi. 庆祝；过节；举行宗教仪式"
    },
    {
        "word": "celebration",
        "definition": "n. 庆典，庆祝会；庆祝；颂扬"
    },
    {
        "word": "cell",
        "definition": "n. 细胞；电池；蜂房的巢室；单人小室 vi. 住在牢房或小室中"
    },
    {
        "word": "cellar",
        "definition": "n. 地窖；酒窖；地下室 vt. 把…藏入地窖"
    },
    {
        "word": "cell-phone",
        "definition": "手机（等于cellular phone）"
    },
    {
        "word": "Celsius",
        "definition": ""
    },
    {
        "word": "cement",
        "definition": "n. 水泥；接合剂 vt. 巩固，加强；用水泥涂；接合 vi. 粘牢"
    },
    {
        "word": "cent",
        "definition": "n. 分；一分的硬币；森特（等于半音程的百分之一）"
    },
    {
        "word": "center",
        "definition": "n. 中心，中央；中锋；中心点 adj. 中央的，位在正中的 vt. 集中，使聚集在一点；定中心 vi. 居中，被置于中心"
    },
    {
        "word": "centre",
        "definition": "n. 中心 adj. 中央的 vt. 集中；将…放在中央 vi. 以…为中心"
    },
    {
        "word": "central",
        "definition": "n. 电话总机 adj. 中心的；主要的；中枢的"
    },
    {
        "word": "centralize",
        "definition": "vt. 使集中；使成为…的中心；使集权 vi. 集中；实行中央集权"
    },
    {
        "word": "centralise",
        "definition": "vt. 把…集中起来；形成中心"
    },
    {
        "word": "centigrade",
        "definition": "adj. 摄氏的； 摄氏温度的；百分度的"
    },
    {
        "word": "centimeter",
        "definition": "n.  厘米； 公分"
    },
    {
        "word": "centimetre",
        "definition": "n. 厘米；公分"
    },
    {
        "word": "century",
        "definition": "n. 世纪，百年；（板球）一百分"
    },
    {
        "word": "cereal",
        "definition": "n. 谷类，谷物；谷类食品；谷类植物 adj. 谷类的；谷类制成的"
    },
    {
        "word": "ceremony",
        "definition": "n. 典礼，仪式；礼节，礼仪；客套，虚礼"
    },
    {
        "word": "ceremonial",
        "definition": "n. 仪式，礼节 adj. 仪式的；正式的，礼仪的"
    },
    {
        "word": "certain",
        "definition": "adj. 某一；必然的；确信；无疑的；有把握的 pron. 某些；某几个"
    },
    {
        "word": "certainly",
        "definition": "adv. 当然；行（用于回答）；必定"
    },
    {
        "word": "certainty",
        "definition": "n. 必然；确实；确实的事情"
    },
    {
        "word": "certificate",
        "definition": "n. 证书；执照，文凭 vt. 发给证明书；以证书形式授权给…；用证书批准"
    },
    {
        "word": "chain",
        "definition": "n. 链；束缚；枷锁 vt. 束缚；囚禁；用铁链锁住"
    },
    {
        "word": "chair",
        "definition": "n. 椅子；讲座；（会议的）主席位；大学教授的职位 vt. 担任（会议的）主席；使…入座；使就任要职"
    },
    {
        "word": "chairman",
        "definition": "n. 主席，会长；董事长"
    },
    {
        "word": "chairperson",
        "definition": "n. 主席；议长"
    },
    {
        "word": "chalk",
        "definition": "n. 粉笔；白垩；用粉笔划的记号 adj. 用粉笔写的 vt. 用粉笔写；用白垩粉擦；记录；规划 vi. 变成白垩状"
    },
    {
        "word": "challenge",
        "definition": "n. 挑战；怀疑 vt. 向…挑战；对…质疑"
    },
    {
        "word": "challenging",
        "definition": "v. 要求；质疑；反对；向…挑战；盘问（challenge的ing形式） adj. 挑战的；引起挑战性兴趣的"
    },
    {
        "word": "champagne",
        "definition": "n. 香槟酒；香槟酒色"
    },
    {
        "word": "champion",
        "definition": "n. 冠军；拥护者；战士 adj. 优胜的；第一流的 vt. 支持；拥护"
    },
    {
        "word": "championship",
        "definition": "n. 锦标赛；冠军称号；冠军的地位"
    },
    {
        "word": "chance",
        "definition": "n. 机会，际遇；运气，侥幸；可能性 vt. 偶然发生；冒……的险 vi. 碰巧；偶然被发现"
    },
    {
        "word": "change",
        "definition": "n. 变化；找回的零钱 vt. 改变；交换 vi. 改变；兑换"
    },
    {
        "word": "channel",
        "definition": "n. 通道；频道；海峡 vt. 引导，开导；形成河道"
    },
    {
        "word": "chaos",
        "definition": "n. 混沌，混乱"
    },
    {
        "word": "chaotic",
        "definition": "adj. 混沌的；混乱的，无秩序的"
    },
    {
        "word": "chapter",
        "definition": "n. 章，回；（俱乐部、协会等的）分会；人生或历史上的重要时期 vt. 把…分成章节"
    },
    {
        "word": "character",
        "definition": "n. 性格，品质；特性；角色； 字符 vt. 印，刻；使具有特征"
    },
    {
        "word": "characteristic",
        "definition": "n. 特征；特性；特色 adj. 典型的；特有的；表示特性的"
    },
    {
        "word": "characterize",
        "definition": "vt. 描绘…的特性；具有…的特征 vi. 塑造人物"
    },
    {
        "word": "characterise",
        "definition": "vt. 是…的特征; 以…为特征; 描述（人或物）的特性; 描绘"
    },
    {
        "word": "charge",
        "definition": "n. 费用；电荷；掌管；控告；命令；负载 vt. 使充电；使承担；指责；装载；对…索费；向…冲去 vi. 充电；控告；索价；向前冲；记在账上"
    },
    {
        "word": "charity",
        "definition": "n. 慈善；施舍；慈善团体；宽容；施舍物"
    },
    {
        "word": "charitable",
        "definition": "adj. 慈善事业的；慷慨的，仁慈的；宽恕的"
    },
    {
        "word": "charm",
        "definition": "n. 魅力，吸引力；魔力 vt. 使陶醉；行魔法 vi. 有魔力；用符咒"
    },
    {
        "word": "charming",
        "definition": "adj. 迷人的；可爱的 v. 使陶醉（charm的现在分词）"
    },
    {
        "word": "chart",
        "definition": "n. 图表；海图；图纸；排行榜 vt. 绘制…的图表；在海图上标出；详细计划；记录；记述；跟踪（进展或发展"
    },
    {
        "word": "charter",
        "definition": "n. 宪章；执照；特许状 vt. 特许；包租；发给特许执照"
    },
    {
        "word": "chase",
        "definition": "n. 追逐；追赶；追击 vt. 追逐；追捕；试图赢得；雕镂 vi. 追逐；追赶；奔跑"
    },
    {
        "word": "chat",
        "definition": "n. 聊天；闲谈 vt. 与…搭讪；与…攀谈 vi. 聊天；闲谈"
    },
    {
        "word": "cheap",
        "definition": "adj. 便宜的；小气的；不值钱的 adv. 便宜地"
    },
    {
        "word": "cheat",
        "definition": "n. 欺骗，作弊；骗子 vt. 欺骗；骗取 vi. 欺骗；作弊"
    },
    {
        "word": "check",
        "definition": "n. <美>支票；制止，抑制；检验，核对 vi. 核实，查核；中止；打勾；将一军 vt. 检查，核对；制止，抑制；在…上打勾"
    },
    {
        "word": "cheque",
        "definition": "n. 支票"
    },
    {
        "word": "cheek",
        "definition": "n. 面颊，脸颊；臀部 vt. 无礼地向…讲话，对…大胆无礼"
    },
    {
        "word": "cheer",
        "definition": "n. 欢呼；愉快；心情；令人愉快的事 vt. 欢呼；使高兴；为…加油 vi. 欢呼；感到高兴"
    },
    {
        "word": "cheerful",
        "definition": "adj. 快乐的；愉快的；高兴的"
    },
    {
        "word": "cheese",
        "definition": "n.  奶酪；干酪；要人 adj. 叛变的；胆小的 vt. 停止"
    },
    {
        "word": "chef",
        "definition": "n. 厨师，大师傅"
    },
    {
        "word": "chemistry",
        "definition": "n. 化学；化学过程"
    },
    {
        "word": "chemical",
        "definition": "n. 化学制品，化学药品 adj. 化学的"
    },
    {
        "word": "chemist",
        "definition": "n. 化学家；化学工作者；药剂师；炼金术士"
    },
    {
        "word": "cherish",
        "definition": "vt. 珍爱 vt. 怀有（感情等）；抱有（希望等）"
    },
    {
        "word": "chess",
        "definition": "n. 国际象棋，西洋棋"
    },
    {
        "word": "chest",
        "definition": "n. 胸，胸部；衣柜；箱子；金库"
    },
    {
        "word": "chew",
        "definition": "n. 咀嚼；咀嚼物 vi. 细想，深思 vt. 嚼碎，咀嚼"
    },
    {
        "word": "chicken",
        "definition": "n. 鸡肉；小鸡；胆小鬼，懦夫 adj. 鸡肉的；胆怯的；幼小的"
    },
    {
        "word": "chief",
        "definition": "n. 首领；酋长；主要部分 adj. 首席的；主要的；主任的 adv. 主要地；首要地"
    },
    {
        "word": "child",
        "definition": "n. 儿童，小孩，孩子；产物；子孙；幼稚的人；弟子"
    },
    {
        "word": "childish",
        "definition": "adj. 幼稚的，孩子气的"
    },
    {
        "word": "chill",
        "definition": "n. 寒冷；寒意；寒心 vt. 冷冻，冷藏；使寒心；使感到冷 adj. 寒冷的；冷漠的；扫兴的 vi. 冷藏；变冷"
    },
    {
        "word": "chilly",
        "definition": "adj. 寒冷的；怕冷的"
    },
    {
        "word": "chimney",
        "definition": "n. 烟囱"
    },
    {
        "word": "chin",
        "definition": "n. 下巴；聊天；引体向上动作 vt. 用下巴夹住；与…聊天；在单杠上作引体向上动作 vi. 闲谈；作引体向上动作"
    },
    {
        "word": "china",
        "definition": ""
    },
    {
        "word": "chip",
        "definition": "n.  芯片；筹码；碎片；(食物的) 小片; 薄片 vt. 削，凿；削成碎片 vi. 剥落；碎裂"
    },
    {
        "word": "chocolate",
        "definition": "n. 巧克力，巧克力糖；巧克力色 adj. 巧克力色的；巧克力口味的"
    },
    {
        "word": "choice",
        "definition": "n. 选择；选择权；精选品 adj. 精选的；仔细推敲的"
    },
    {
        "word": "choke",
        "definition": "n. 窒息；噎； 阻气门 vi. 窒息；阻塞；说不出话来 vt. 呛；使窒息；阻塞；抑制；扑灭"
    },
    {
        "word": "cholesterol",
        "definition": "n.  胆固醇"
    },
    {
        "word": "choose",
        "definition": "vt. 选择，决定 vi. 选择，挑选"
    },
    {
        "word": "choosy",
        "definition": "adj. 好挑剔的"
    },
    {
        "word": "chop",
        "definition": "n. 砍；排骨；商标；削球 (俚)丑人 vt. 剁碎；砍"
    },
    {
        "word": "chopstick",
        "definition": "n. 筷子"
    },
    {
        "word": "chore",
        "definition": "n. 家庭杂务；日常的零星事务；讨厌的或累人的工作"
    },
    {
        "word": "chorus",
        "definition": "n. 合唱队；齐声；歌舞队 vt. 合唱；异口同声地说 vi. 合唱；异口同声地说话"
    },
    {
        "word": "Christ",
        "definition": "n. 基督；救世主 int. 天啊！"
    },
    {
        "word": "Christmas",
        "definition": "n. 圣诞节；圣诞节期间"
    },
    {
        "word": "Christian",
        "definition": "n. 基督徒，信徒 adj. 基督教的；信基督教的"
    },
    {
        "word": "Christianity",
        "definition": "n. 基督教；基督教精神，基督教教义"
    },
    {
        "word": "church",
        "definition": "n. 教堂；礼拜；教派 adj. 教会的；礼拜的 vt. 领…到教堂接受宗教仪式"
    },
    {
        "word": "cigar",
        "definition": "n. 雪茄"
    },
    {
        "word": "cigaret",
        "definition": "n. 香烟；纸烟（等于cigarette）"
    },
    {
        "word": "cigarette",
        "definition": "n. 香烟；纸烟"
    },
    {
        "word": "cinema",
        "definition": "n. 电影；电影院；电影业，电影制作术"
    },
    {
        "word": "circle",
        "definition": "n. 循环，周期；圆；圈子；圆形物 vt. 画圆圈；环绕…移动 vi. 盘旋，旋转；环行"
    },
    {
        "word": "circular",
        "definition": "n. 通知，传单 adj. 循环的；圆形的；间接的"
    },
    {
        "word": "circuit",
        "definition": "n.  电路，回路；巡回；一圈；环道 vt. 绕回…环行 vi. 环行"
    },
    {
        "word": "circulate",
        "definition": "vt. 使循环；使流通；使传播 vi. 传播，流传；循环；流通"
    },
    {
        "word": "circulation",
        "definition": "n. 流通，传播；循环；发行量"
    },
    {
        "word": "circumstance",
        "definition": "n. 环境，情况；事件；境遇"
    },
    {
        "word": "circus",
        "definition": "n. 马戏；马戏团"
    },
    {
        "word": "cite",
        "definition": "vt. 引用；传讯；想起；表彰"
    },
    {
        "word": "citation",
        "definition": "n. 引用，引证； 传票；褒扬"
    },
    {
        "word": "citizen",
        "definition": "n. 公民；市民；老百姓"
    },
    {
        "word": "citizenship",
        "definition": "n.  公民身份，公民资格；国籍；公民权"
    },
    {
        "word": "city",
        "definition": "n. 城市，都市 adj. 城市的；都会的"
    },
    {
        "word": "civil",
        "definition": "adj. 公民的；民间的；文职的；有礼貌的；根据民法的"
    },
    {
        "word": "civilize",
        "definition": "vt. 使文明；教化；使开化 vi. 变得文明"
    },
    {
        "word": "civilise",
        "definition": "vt. 教化；文明化；使开化 vi. 变成文明社会（等于civilize）"
    },
    {
        "word": "civilization",
        "definition": "n. 文明；文化"
    },
    {
        "word": "civilisation",
        "definition": "n. （英）文明（等于civilization）"
    },
    {
        "word": "civilian",
        "definition": "n. 平民，百姓 adj. 民用的；百姓的，平民的"
    },
    {
        "word": "claim",
        "definition": "n. 要求；声称；索赔；断言；值得 vt. 要求；声称；需要；认领 vi. 提出要求"
    },
    {
        "word": "clap",
        "definition": "n. 鼓掌；拍手声 vt. 拍手，鼓掌；轻轻拍打某人 vi. 鼓掌，拍手；啪地关上"
    },
    {
        "word": "clarity",
        "definition": "n. 清楚，明晰；透明"
    },
    {
        "word": "clarify",
        "definition": "vt. 澄清；阐明 vi. 得到澄清；变得明晰；得到净化"
    },
    {
        "word": "clarification",
        "definition": "n. 澄清，说明；净化"
    },
    {
        "word": "clash",
        "definition": "n. 冲突，不协调；碰撞声，铿锵声 vt. 使碰撞作声 vi. 冲突，抵触；砰地相碰撞，发出铿锵声"
    },
    {
        "word": "class",
        "definition": "n. 阶级；班级；种类；班；等级 adj. 极好的；很好的，优秀的，出色的 vt. 分类；把…分等级；把…归入某等级，把…看作（或分类、归类）；把…编入某一班级 vi. 属于…类（或等级），被列为某类（或某级）"
    },
    {
        "word": "classic",
        "definition": "n. 名著；经典著作；大艺术家 adj. 经典的；古典的，传统的；最优秀的"
    },
    {
        "word": "classical",
        "definition": "n. 古典音乐 adj. 古典的；经典的；传统的；第一流的"
    },
    {
        "word": "classify",
        "definition": "vt. 分类；分等"
    },
    {
        "word": "classification",
        "definition": "n. 分类；类别，等级"
    },
    {
        "word": "classified",
        "definition": "n. 分类广告 v. 把…分类（classify的过去分词） adj. 分类的；类别的；机密的"
    },
    {
        "word": "classmate",
        "definition": "n. 同班同学"
    },
    {
        "word": "classroom",
        "definition": "n. 教室"
    },
    {
        "word": "clause",
        "definition": "n. 条款； 子句"
    },
    {
        "word": "claw",
        "definition": "n. 爪；螯，钳；爪形器具 vi. 用爪抓（或挖） vt. 用爪抓（或挖）"
    },
    {
        "word": "clay",
        "definition": "n.  粘土；泥土；肉体；似黏土的东西 vt. 用黏土处理"
    },
    {
        "word": "clean",
        "definition": "n. 打扫 adj. 清洁的，干净的；清白的 vt. 使干净 vi. 打扫，清扫 adv. 完全地"
    },
    {
        "word": "clear",
        "definition": "n. 清除；空隙 adj. 清楚的；清澈的；晴朗的；无罪的 vt. 通过；清除；使干净；跳过 vi. 放晴；变清澈 adv. 清晰地；完全地"
    },
    {
        "word": "clearly",
        "definition": "adv. 清晰地；明显地；无疑地；明净地"
    },
    {
        "word": "clear-cut",
        "definition": "adj. 清晰的；轮廓鲜明的"
    },
    {
        "word": "clerk",
        "definition": "n. 职员，办事员；店员；书记；记账员；<古>牧师，教士 vi. 当销售员，当店员；当职员"
    },
    {
        "word": "clerical",
        "definition": "n. 牧师 adj. 书记的；牧师的；办事员的"
    },
    {
        "word": "clever",
        "definition": "adj. 聪明的；机灵的；熟练的 "
    },
    {
        "word": "click",
        "definition": "n. 单击；滴答声 vi. 作咔哒声 vt. 点击；使发咔哒声"
    },
    {
        "word": "client",
        "definition": "n.  客户；顾客；委托人"
    },
    {
        "word": "cliff",
        "definition": "n. 悬崖；绝壁"
    },
    {
        "word": "climate",
        "definition": "n. 气候；风气；思潮；风土"
    },
    {
        "word": "climatic",
        "definition": "adj. 气候的；气候上的；由气候引起的；受气候影响的"
    },
    {
        "word": "climax",
        "definition": "n. 高潮；顶点；层进法；极点"
    },
    {
        "word": "climb",
        "definition": "n. 爬；攀登 vi. 爬；攀登；上升 vt. 爬；攀登；上升"
    },
    {
        "word": "cling",
        "definition": "vi. 坚持，墨守；紧贴；附着"
    },
    {
        "word": "clinic",
        "definition": "n. 临床；诊所"
    },
    {
        "word": "clinical",
        "definition": "adj. 临床的；诊所的"
    },
    {
        "word": "clip",
        "definition": "vi. 剪；修剪；剪下报刊上的文章（或新闻、图片等）；迅速行动；用别针别在某物上，用夹子夹在某物上 n. （塑料或金属的）夹子；回纹针；修剪；剪报 vt. 剪；剪掉；缩短；给…剪毛（或发）用别针别在某物上，用夹子夹在某物上"
    },
    {
        "word": "clock",
        "definition": "n. 时钟；计时器 vt. 记录；记时 vi. 打卡；记录时间"
    },
    {
        "word": "clockwise",
        "definition": "adj. 顺时针方向的 adv. 顺时针方向地"
    },
    {
        "word": "clone",
        "definition": "n. 克隆；无性系；无性繁殖；靠营养生殖而由母体分离繁殖的植物 vt. 无性繁殖，复制"
    },
    {
        "word": "close",
        "definition": "n. 结束 adj. 紧密的；亲密的；亲近的 vt. 关；结束；使靠近 vi. 关；结束；关闭 adv. 紧密地"
    },
    {
        "word": "cloth",
        "definition": "n. 布；织物；桌布 adj. 布制的"
    },
    {
        "word": "clothe",
        "definition": "vt. 给…穿衣；覆盖；赋予"
    },
    {
        "word": "clothing",
        "definition": "n. （总称） 服装；帆装 v. 覆盖（clothe的ing形式）；给…穿衣"
    },
    {
        "word": "clothes",
        "definition": "n. 衣服"
    },
    {
        "word": "cloud",
        "definition": "n. 云；阴云；云状物；一大群；黑斑 vt. 使混乱；以云遮敝；使忧郁；玷污 vi. 阴沉；乌云密布"
    },
    {
        "word": "cloudy",
        "definition": "adj. 多云的；阴天的；愁容满面的"
    },
    {
        "word": "clown",
        "definition": "n. 小丑；乡下人；粗鲁笨拙的人 vi. 扮小丑；装傻"
    },
    {
        "word": "club",
        "definition": "n. 俱乐部，社团；夜总会；棍棒；（扑克牌中的）梅花 adj. 俱乐部的 vt. 用棍棒打；募集 vi. 集资；组成俱乐部"
    },
    {
        "word": "clue",
        "definition": "n. 线索；（故事等的）情节 vt. 为…提供线索；为…提供情况"
    },
    {
        "word": "clumsy",
        "definition": "adj. 笨拙的 笨拙地 不得当的 不得当地"
    },
    {
        "word": "coach",
        "definition": "n. 教练；旅客车厢；长途公车；四轮大马车 vt. 训练；指导 vi. 作指导；接受辅导；坐马车旅行 n. ?蔻驰（皮革品牌）"
    },
    {
        "word": "coal",
        "definition": "n. 煤；煤块；木炭 vt. 给…加煤；把…烧成炭 vi. 上煤；加煤"
    },
    {
        "word": "coarse",
        "definition": "adj. 粗糙的；粗俗的；下等的"
    },
    {
        "word": "coast",
        "definition": "n. 海岸；滑坡 vt. 沿…岸航行 vi. 滑行；沿岸航行"
    },
    {
        "word": "coastal",
        "definition": "adj. 沿海的；海岸的"
    },
    {
        "word": "coat",
        "definition": "n. 外套 vt. 覆盖…的表面"
    },
    {
        "word": "cock",
        "definition": "n. 公鸡；龙头；雄鸟；头目 vt. 使竖起；使耸立；使朝上 vi. 翘起；竖起；大摇大摆"
    },
    {
        "word": "code",
        "definition": "n. 代码，密码；编码；法典 vt. 编码；制成法典 vi. 指定遗传密码"
    },
    {
        "word": "coffee",
        "definition": "n. 咖啡；咖啡豆；咖啡色"
    },
    {
        "word": "coherent",
        "definition": "adj. 连贯的，一致的；明了的；清晰的；凝聚性的；互相耦合的；粘在一起的"
    },
    {
        "word": "coherence",
        "definition": "n. 一致；连贯性；凝聚"
    },
    {
        "word": "cohesion",
        "definition": "n. 凝聚；结合； 内聚力"
    },
    {
        "word": "cohesive",
        "definition": "adj. 凝聚的；有结合力的；紧密结合的；有粘着力的"
    },
    {
        "word": "coil",
        "definition": "n. 线圈；卷 vt. 盘绕，把…卷成圈 vi. 成圈状"
    },
    {
        "word": "coin",
        "definition": "n. 硬币，钱币 vt. 铸造（货币）；杜撰，创造"
    },
    {
        "word": "coinage",
        "definition": "n. 造币； 货币制度；新造的字及其语等"
    },
    {
        "word": "cold",
        "definition": "n. 寒冷；感冒 adj. 寒冷的；冷淡的，不热情的；失去知觉的 adv. 完全地"
    },
    {
        "word": "collaborate",
        "definition": "vi. 合作；勾结，通敌"
    },
    {
        "word": "collaboration",
        "definition": "n. 合作；勾结；通敌"
    },
    {
        "word": "collaborative",
        "definition": "adj. 合作的，协作的"
    },
    {
        "word": "collapse",
        "definition": "n. 倒塌；失败；衰竭 vt. 使倒塌，使崩溃；使萎陷；折叠 vi. 倒塌；瓦解；暴跌"
    },
    {
        "word": "collar",
        "definition": "n. 衣领；颈圈 vt. 抓住；给…上领子；给…套上颈圈"
    },
    {
        "word": "colleague",
        "definition": "n. 同事，同僚"
    },
    {
        "word": "collect",
        "definition": "vt. 收集；募捐 adj. 由收件人付款的 vi. 收集；聚集；募捐 adv. 由收件人付款地"
    },
    {
        "word": "collection",
        "definition": "n. 采集，聚集； 征收；收藏品；募捐"
    },
    {
        "word": "collective",
        "definition": "n. 集团；集合体；集合名词 adj. 集体的；共同的；集合的；集体主义的"
    },
    {
        "word": "college",
        "definition": "n. 大学；学院；学会"
    },
    {
        "word": "colon",
        "definition": "n.  结肠；冒号（用于引语、说明、例证等之前）；科郎（哥斯达黎加货币单位）"
    },
    {
        "word": "semi-colon",
        "definition": "分号"
    },
    {
        "word": "colony",
        "definition": "n. 殖民地；移民队；种群；动物栖息地"
    },
    {
        "word": "colonial",
        "definition": "n. 殖民地居民 adj. 殖民地的，殖民的"
    },
    {
        "word": "colonialism",
        "definition": "n. 殖民主义；殖民政策"
    },
    {
        "word": "colonize",
        "definition": "vt. 将…开拓为殖民地；移于殖民地；从他地非法把选民移入 vi. 开拓殖民地；移居于殖民地"
    },
    {
        "word": "colonise",
        "definition": "vt. 开拓殖民地，移民于殖民地"
    },
    {
        "word": "color",
        "definition": "n. 颜色；肤色；颜料；脸色 vt. 粉饰；给...涂颜色；歪曲 vi. 变色；获得颜色"
    },
    {
        "word": "colour",
        "definition": "n. 颜色；风格；气色，面色；外貌 vt. 把…涂颜色，粉饰；歪曲；使脸红 vi. 变色"
    },
    {
        "word": "colorful",
        "definition": "adj. 华美的；有趣的；富有色彩的"
    },
    {
        "word": "colourful",
        "definition": "adj. 鲜艳的；生动的；色彩丰富的；富有趣味的"
    },
    {
        "word": "column",
        "definition": "n. 纵队，列；专栏；圆柱，柱形物"
    },
    {
        "word": "columnist",
        "definition": "n. 专栏作家"
    },
    {
        "word": "comb",
        "definition": "n. 梳子；蜂巢；鸡冠 vt. 梳头发；梳毛 vi. （浪）涌起"
    },
    {
        "word": "combat",
        "definition": "n. 战斗；争论 adj. 战斗的；为…斗争的 vi. 战斗；搏斗 vt. 反对；与…战斗"
    },
    {
        "word": "combative",
        "definition": "adj. 好战的；好事的"
    },
    {
        "word": "combine",
        "definition": "n. 联合收割机；联合企业 vt. 使化合；使联合，使结合 vi. 联合，结合；化合"
    },
    {
        "word": "combination",
        "definition": "n. 结合；组合；联合； 化合"
    },
    {
        "word": "come",
        "definition": "vi. 来；开始；出现；发生；变成；到达 vt. 做；假装；将满（…岁） int. 嗨！"
    },
    {
        "word": "comedy",
        "definition": "n. 喜剧；喜剧性；有趣的事情"
    },
    {
        "word": "comfort",
        "definition": "n. 安慰；舒适；安慰者 vt. 安慰；使（痛苦等）缓和"
    },
    {
        "word": "comfortable",
        "definition": "n. 盖被 adj. 舒适的，舒服的"
    },
    {
        "word": "comma",
        "definition": "n. 逗号；停顿"
    },
    {
        "word": "command",
        "definition": "n. 指挥，控制；命令；司令部 vt. 命令，指挥；控制；远望 vi. 命令，指挥；控制"
    },
    {
        "word": "commander",
        "definition": "n. 指挥官；司令官"
    },
    {
        "word": "commence",
        "definition": "v. 开始；着手；<英>获得学位"
    },
    {
        "word": "commencement",
        "definition": "n. 开始，发端；毕业典礼"
    },
    {
        "word": "comment",
        "definition": "n. 评论；意见；批评 vi. 发表评论；发表意见 vt. 为…作评语"
    },
    {
        "word": "commentary",
        "definition": "n. 评论；注释；评注；说明"
    },
    {
        "word": "commentator",
        "definition": "n. 评论员，解说员；实况播音员；时事评论者"
    },
    {
        "word": "commerce",
        "definition": "n. 贸易；商业；商务"
    },
    {
        "word": "commercial",
        "definition": "n. 商业广告 adj. 商业的；营利的；靠广告收入的"
    },
    {
        "word": "commercialize",
        "definition": "vt. 使商业化；使商品化"
    },
    {
        "word": "commercialise",
        "definition": "vt. 使商业化，使经营化，使成为营利手段"
    },
    {
        "word": "commission",
        "definition": "n. 委员会；佣金；犯；委任；委任状 vt. 委任；使服役；委托制作"
    },
    {
        "word": "commit",
        "definition": "vt. 犯罪，做错事；把...交托给；指派…作战；使…承担义务"
    },
    {
        "word": "commitment",
        "definition": "n. 承诺，保证；委托；承担义务；献身"
    },
    {
        "word": "committee",
        "definition": "n. 委员会"
    },
    {
        "word": "commodity",
        "definition": "n. 商品，货物；日用品"
    },
    {
        "word": "common",
        "definition": "n. 普通；平民；公有地 adj. 共同的；普通的；一般的；通常的"
    },
    {
        "word": "commonplace",
        "definition": "n. 老生常谈；司空见惯的事；普通的东西 adj. 平凡的；陈腐的"
    },
    {
        "word": "communicate",
        "definition": "vi. 通讯，传达；相通；交流；感染 vt. 传达；感染；显露"
    },
    {
        "word": "communication",
        "definition": "n. 通讯， 通信；交流；信函"
    },
    {
        "word": "communicative",
        "definition": "adj. 交际的；爱说话的，健谈的；无隐讳交谈的"
    },
    {
        "word": "commune",
        "definition": "n. 公社 vi. 谈心，亲密交谈；密切联系"
    },
    {
        "word": "communist",
        "definition": "n. 共产党员；共产主义者 adj. 共产主义的"
    },
    {
        "word": "communism",
        "definition": "n. 共产主义"
    },
    {
        "word": "community",
        "definition": "n. 社区； 群落；共同体；团体"
    },
    {
        "word": "commute",
        "definition": "n. 通勤（口语） vt. 减刑；交换；用……交换；使……变成 vi. （搭乘车、船等）通勤；代偿"
    },
    {
        "word": "commuter",
        "definition": "n. 通勤者，经常乘公共车辆往返者； 月季票乘客"
    },
    {
        "word": "compact",
        "definition": "n. 合同，契约；小粉盒 adj. 紧凑的，紧密的；简洁的 vt. 使简洁；使紧密结合"
    },
    {
        "word": "companion",
        "definition": "n. 同伴；朋友；指南；手册 vt. 陪伴"
    },
    {
        "word": "companionship",
        "definition": "n. 友谊；陪伴；交谊"
    },
    {
        "word": "company",
        "definition": "n. 公司；陪伴，同伴；连队 vt. 陪伴 vi. 交往"
    },
    {
        "word": "compare",
        "definition": "vi. 相比，匹敌；比较，区别；比拟（常与to连用） vt. 比拟，喻为；构成 n. 比较"
    },
    {
        "word": "comparison",
        "definition": "n. 比较；对照；比喻；比较关系"
    },
    {
        "word": "comparative",
        "definition": "n. 比较级；对手 adj. 比较的；相当的"
    },
    {
        "word": "comparable",
        "definition": "adj. 可比较的；比得上的"
    },
    {
        "word": "compass",
        "definition": "n. 指南针，罗盘；圆规 vt. 包围"
    },
    {
        "word": "compatible",
        "definition": "adj. 兼容的；能共处的；可并立的"
    },
    {
        "word": "compatibility",
        "definition": "n.  兼容性"
    },
    {
        "word": "compel",
        "definition": "vt. 强迫，迫使；强使发生"
    },
    {
        "word": "compelling",
        "definition": "adj. 引人注目的；强制的；激发兴趣的 v. 强迫；以强力获得（compel的ing形式）"
    },
    {
        "word": "compensate",
        "definition": "vt. 补偿，赔偿；付报酬 vi. 补偿，赔偿；抵消"
    },
    {
        "word": "compensation",
        "definition": "n. 补偿；报酬；赔偿金"
    },
    {
        "word": "compensatory",
        "definition": "adj. 补偿的，赔偿的"
    },
    {
        "word": "compete",
        "definition": "vi. 竞争；比赛；对抗"
    },
    {
        "word": "competition",
        "definition": "n. 竞争；比赛，竞赛"
    },
    {
        "word": "competitive",
        "definition": "adj. 竞争的；比赛的；求胜心切的"
    },
    {
        "word": "competitor",
        "definition": "n. 竞争者，对手"
    },
    {
        "word": "competent",
        "definition": "adj. 胜任的；有能力的；能干的；足够的"
    },
    {
        "word": "competence",
        "definition": "n. 能力，胜任；权限；作证能力；足以过舒适生活的收入"
    },
    {
        "word": "complain",
        "definition": "vi. 投诉；发牢骚；诉说 vt. 抱怨；控诉"
    },
    {
        "word": "complaint",
        "definition": "n. 抱怨；诉苦；疾病；委屈"
    },
    {
        "word": "complete",
        "definition": "adj. 完整的；完全的；彻底的 vt. 完成"
    },
    {
        "word": "completion",
        "definition": "n. 完成，结束；实现"
    },
    {
        "word": "complex",
        "definition": "n. 复合体；综合设施 adj. 复杂的；合成的"
    },
    {
        "word": "complexity",
        "definition": "n. 复杂，复杂性；复杂错综的事物"
    },
    {
        "word": "complicate",
        "definition": "vt. 使复杂化；使恶化；使卷入"
    },
    {
        "word": "complicated",
        "definition": "adj. 难懂的，复杂的"
    },
    {
        "word": "complication",
        "definition": "n. 并发症；复杂；复杂化；混乱"
    },
    {
        "word": "comply",
        "definition": "vi. 遵守；顺从，遵从；答应"
    },
    {
        "word": "compliance",
        "definition": "n. 顺从，服从；承诺"
    },
    {
        "word": "component",
        "definition": "n. 成分；组件； 元件 adj. 组成的，构成的"
    },
    {
        "word": "compose",
        "definition": "vt. 构成；写作；使平静；排…的版 vi. 组成；作曲；排字"
    },
    {
        "word": "composition",
        "definition": "n. 作文，作曲，作品； 构成；合成物；成分"
    },
    {
        "word": "composer",
        "definition": "n. 作曲家；作家，著作者；设计者"
    },
    {
        "word": "compound",
        "definition": "n.  化合物；混合物；复合词 adj. 复合的；混合的 v. 合成；混合；恶化，加重；和解，妥协"
    },
    {
        "word": "comprehend",
        "definition": "vt. 理解；包含；由…组成"
    },
    {
        "word": "comprehension",
        "definition": "n. 理解；包含"
    },
    {
        "word": "comprehensive",
        "definition": "n. 综合学校；专业综合测验 adj. 综合的；广泛的；有理解力的"
    },
    {
        "word": "comprise",
        "definition": "vt. 包含；由…组成"
    },
    {
        "word": "compromise",
        "definition": "n. 妥协，和解；折衷 vt. 妥协；危害 vi. 妥协；让步"
    },
    {
        "word": "compulsory",
        "definition": "n. （花样滑冰、竞技体操等的）规定动作 adj. 义务的；必修的；被强制的"
    },
    {
        "word": "compute",
        "definition": "n. 计算；估计；推断 vt. 计算；估算；用计算机计算 vi. 计算；估算；推断"
    },
    {
        "word": "computer",
        "definition": "n. 计算机；电脑；电子计算机"
    },
    {
        "word": "computerize",
        "definition": "vt. 使电脑化；使计算机化；用电脑处理"
    },
    {
        "word": "computerise",
        "definition": "vt. 用计算机做，使计算机化; 将（资料）存入计算机"
    },
    {
        "word": "computation",
        "definition": "n. 估计，计算"
    },
    {
        "word": "comrade",
        "definition": "n. 同志；伙伴"
    },
    {
        "word": "conceal",
        "definition": "vt. 隐藏；隐瞒"
    },
    {
        "word": "concealment",
        "definition": "n. 隐藏，隐蔽；隐匿处"
    },
    {
        "word": "concentrate",
        "definition": "n. 浓缩，精选；浓缩液 vi. 集中；浓缩；全神贯注；聚集 vt. 集中；浓缩"
    },
    {
        "word": "concentration",
        "definition": "n. 浓度；集中；浓缩；专心；集合"
    },
    {
        "word": "concept",
        "definition": "n. 观念，概念"
    },
    {
        "word": "conceptual",
        "definition": "adj. 概念上的"
    },
    {
        "word": "concern",
        "definition": "n. 关系；关心；关心的事；忧虑 vt. 涉及，关系到；使担心"
    },
    {
        "word": "concerned",
        "definition": "v. 关心（concern的过去时和过去分词）；与…有关 adj. 有关的；关心的"
    },
    {
        "word": "concerning",
        "definition": "prep. 关于；就…而言 v. 涉及；使关心（concern的ing形式）；忧虑"
    },
    {
        "word": "concert",
        "definition": "n. 音乐会；一致；和谐 adj. 音乐会用的；在音乐会上演出的 vt. 使协调；协同安排 vi. 协调；协力"
    },
    {
        "word": "concerted",
        "definition": "adj. 协调的；协定的；商议定的"
    },
    {
        "word": "conclude",
        "definition": "vi. 推断；断定；决定 vt. 推断；决定，作结论；结束"
    },
    {
        "word": "conclusion",
        "definition": "n. 结论；结局；推论"
    },
    {
        "word": "conclusive",
        "definition": "adj. 决定性的；最后的；确实的；确定性的"
    },
    {
        "word": "concrete",
        "definition": "n. 具体物；凝结物 adj. 混凝土的；实在的，具体的；有形的 vt. 使凝固；用混凝土修筑 vi. 凝结"
    },
    {
        "word": "condemn",
        "definition": "vt. 谴责；判刑，定罪；声讨"
    },
    {
        "word": "condemnation",
        "definition": "n. 谴责；定罪；非难的理由；征用"
    },
    {
        "word": "condense",
        "definition": "vt. 使浓缩；使压缩 vi. 浓缩；凝结"
    },
    {
        "word": "condensation",
        "definition": "n. 冷凝；凝结；压缩；缩合聚合"
    },
    {
        "word": "condition",
        "definition": "n. 条件；情况；环境；身份 vt. 决定；使适应；使健康；以…为条件"
    },
    {
        "word": "conditional",
        "definition": "n. 条件句；条件语 adj. 有条件的；假定的"
    },
    {
        "word": "conditioner",
        "definition": "n. 调节器；调节剂；调料槽"
    },
    {
        "word": "conduct",
        "definition": "n. 进行；行为；实施 vi. 导电；带领 vt. 管理；引导；表现"
    },
    {
        "word": "conductor",
        "definition": "n. 导体；售票员；领导者；管理人"
    },
    {
        "word": "conference",
        "definition": "n. 会议；讨论；协商；联盟；（正式）讨论会；（每年的）大会 vi. 举行或参加（系列）会议"
    },
    {
        "word": "confess",
        "definition": "vi. 承认；坦白；忏悔；供认 vt. 承认；坦白；忏悔；供认"
    },
    {
        "word": "confession",
        "definition": "n. 忏悔，告解；供认；表白"
    },
    {
        "word": "confidence",
        "definition": "n. 信心；信任；秘密 adj. （美）诈骗的；骗得信任的"
    },
    {
        "word": "confident",
        "definition": "adj. 自信的；确信的"
    },
    {
        "word": "confidential",
        "definition": "adj. 机密的；表示信任的；获信任的"
    },
    {
        "word": "confine",
        "definition": "n. 界限，边界;约束；限制 vt. 限制；禁闭"
    },
    {
        "word": "confinement",
        "definition": "n. 限制；监禁；分娩"
    },
    {
        "word": "confirm",
        "definition": "vt. 确认；确定；证实；批准；使巩固"
    },
    {
        "word": "confirmation",
        "definition": "n. 确认；证实；证明；批准"
    },
    {
        "word": "conflict",
        "definition": "n. 冲突，矛盾；斗争；争执 vi. 冲突，抵触；争执；战斗"
    },
    {
        "word": "conform",
        "definition": "adj. 一致的；顺从的 vi. 符合；遵照；适应环境 vt. 使遵守；使一致；使顺从"
    },
    {
        "word": "conformity",
        "definition": "n. 一致，适合；符合；相似"
    },
    {
        "word": "confront",
        "definition": "vt. 面对；遭遇；比较"
    },
    {
        "word": "confrontation",
        "definition": "n. 对抗；面对；对质"
    },
    {
        "word": "Confucian",
        "definition": "n. 儒家，儒家学者；孔子的门徒 adj. 孔子的，儒家的；儒家学说的"
    },
    {
        "word": "Confucianism",
        "definition": "n. 孔子学说；儒家思想"
    },
    {
        "word": "confuse",
        "definition": "vt. 使混乱；使困惑"
    },
    {
        "word": "confusion",
        "definition": "n. 混淆，混乱；困惑"
    },
    {
        "word": "congratulate",
        "definition": "vt. 祝贺；恭喜；庆贺"
    },
    {
        "word": "congratulation",
        "definition": "n. 祝贺；贺辞"
    },
    {
        "word": "congratulatory",
        "definition": "adj. 祝贺的；庆祝的"
    },
    {
        "word": "congress",
        "definition": "n. 国会；代表大会；会议；社交"
    },
    {
        "word": "congressional",
        "definition": "adj. 国会的；会议的；议会的"
    },
    {
        "word": "conjunction",
        "definition": "n. 结合； 连接词；同时发生"
    },
    {
        "word": "connect",
        "definition": "vt. 连接；联合；关连 vi. 连接，连结；联合"
    },
    {
        "word": "connection",
        "definition": "n. 连接；关系；人脉；连接件"
    },
    {
        "word": "connexion",
        "definition": "n. 连接，联系（等于connection）"
    },
    {
        "word": "conquer",
        "definition": "vt. 战胜，征服；攻克，攻取 vi. 胜利；得胜"
    },
    {
        "word": "conqueror",
        "definition": "n. 征服者；胜利者"
    },
    {
        "word": "conquest",
        "definition": "n. 征服，战胜；战利品"
    },
    {
        "word": "conscience",
        "definition": "n. 道德心，良心"
    },
    {
        "word": "conscientious",
        "definition": "adj. 认真的；尽责的；本着良心的；小心谨慎的"
    },
    {
        "word": "conscious",
        "definition": "adj. 意识到的；故意的；神志清醒的"
    },
    {
        "word": "consciousness",
        "definition": "n. 意识；知觉；觉悟；感觉"
    },
    {
        "word": "consensus",
        "definition": "n. 一致；舆论；合意"
    },
    {
        "word": "consent",
        "definition": "n. 同意；（意见等的）一致；赞成 vi. 同意；赞成；答应"
    },
    {
        "word": "consequence",
        "definition": "n. 结果；重要性；推论"
    },
    {
        "word": "consequent",
        "definition": "n. 结果 adj. 随之发生的；作为结果的"
    },
    {
        "word": "consequently",
        "definition": "adv. 因此；结果；所以"
    },
    {
        "word": "conservative",
        "definition": ""
    },
    {
        "word": "consider",
        "definition": "vi. 考虑；认为；细想 vt. 考虑；认为；考虑到；细想"
    },
    {
        "word": "consideration",
        "definition": "n. 考虑；原因；关心；报酬"
    },
    {
        "word": "considering",
        "definition": "conj. 考虑到 prep. 考虑到；就...而论 v. 考虑到（consider的ing形式）"
    },
    {
        "word": "considerable",
        "definition": "adj. 相当大的；重要的，值得考虑的"
    },
    {
        "word": "considerate",
        "definition": "adj. 体贴的；体谅的；考虑周到的"
    },
    {
        "word": "consist",
        "definition": "vi. 由…组成；在于；符合"
    },
    {
        "word": "consistent",
        "definition": "adj. 始终如一的，一致的；坚持的"
    },
    {
        "word": "consistency",
        "definition": "n.  一致性；稠度；相容性"
    },
    {
        "word": "consolidate",
        "definition": "vt. 巩固，使固定；联合 vi. 巩固，加强"
    },
    {
        "word": "consolidation",
        "definition": "n. 巩固；合并；团结"
    },
    {
        "word": "constant",
        "definition": "n.  常数；恒量 adj. 不变的；恒定的；经常的"
    },
    {
        "word": "constitute",
        "definition": "vt. 组成，构成；建立；任命"
    },
    {
        "word": "constitution",
        "definition": "n. 宪法；体制；章程；构造；建立，组成；体格"
    },
    {
        "word": "constitutional",
        "definition": "n. 保健散步；保健运动 adj. 宪法的；本质的；体质上的；保健的"
    },
    {
        "word": "construct",
        "definition": "n. 构想，概念 vt. 建造，构造；创立"
    },
    {
        "word": "construction",
        "definition": "n. 建设；建筑物；解释；造句"
    },
    {
        "word": "consult",
        "definition": "vi. 请教；商议；当顾问 vt. 查阅；商量；向…请教"
    },
    {
        "word": "consultation",
        "definition": "n. 咨询；磋商； 会诊；讨论会"
    },
    {
        "word": "consultative",
        "definition": "adj. 咨询的"
    },
    {
        "word": "consultant",
        "definition": "n. 顾问；咨询者；会诊医生"
    },
    {
        "word": "consume",
        "definition": "vt. 消耗，消费；使…着迷；挥霍 vi. 耗尽，毁灭；耗尽生命"
    },
    {
        "word": "consumer",
        "definition": "n. 消费者；用户，顾客"
    },
    {
        "word": "consumption",
        "definition": "n. 消费；消耗；肺痨"
    },
    {
        "word": "contact",
        "definition": "n. 接触，联系 vt. 使接触，联系 vi. 使接触，联系"
    },
    {
        "word": "contain",
        "definition": "vi. 含有；自制 vt. 包含；控制；容纳；牵制（敌军）"
    },
    {
        "word": "container",
        "definition": "n. 集装箱；容器"
    },
    {
        "word": "containment",
        "definition": "n. 包含；牵制；容量；密闭度；抑制, 牵制；牵制  政策"
    },
    {
        "word": "contaminate",
        "definition": "vt. 污染，弄脏"
    },
    {
        "word": "contamination",
        "definition": "n. 污染，玷污；污染物"
    },
    {
        "word": "contemporary",
        "definition": "n. 同时代的人；同时期的东西 adj. 当代的；同时代的；属于同一时期的"
    },
    {
        "word": "contempt",
        "definition": "n. 轻视，蔑视；耻辱"
    },
    {
        "word": "contemptible",
        "definition": "adj. 可鄙的；卑劣的；可轻视的"
    },
    {
        "word": "contend",
        "definition": "vi. 竞争；奋斗；斗争；争论 vt. 主张；为...斗争"
    },
    {
        "word": "contention",
        "definition": "n. 争论，争辩；争夺；论点"
    },
    {
        "word": "contentious",
        "definition": "adj. 诉讼的；有异议的，引起争论的；爱争论的"
    },
    {
        "word": "content",
        "definition": "n. 内容，目录；满足；容量 adj. 满意的 vt. 使满足"
    },
    {
        "word": "contented",
        "definition": "v. 使…满足；使…安心（content的过去式和过去分词） adj. 满足的；心安的"
    },
    {
        "word": "contest",
        "definition": "n. 竞赛；争夺；争论 vt. 争辩；质疑 vi. 竞争；争辩"
    },
    {
        "word": "contestant",
        "definition": "n. 竞争者；争辩者"
    },
    {
        "word": "context",
        "definition": "n. 环境；上下文；来龙去脉"
    },
    {
        "word": "contextual",
        "definition": "adj. 上下文的；前后关系的"
    },
    {
        "word": "continent",
        "definition": "n. 大陆，洲，陆地 adj. 自制的，克制的"
    },
    {
        "word": "continental",
        "definition": "n. 欧洲人 adj. 大陆的；大陆性的"
    },
    {
        "word": "continue",
        "definition": "vt. 继续说…；使…继续；使…延长 vi. 继续，延续；仍旧，连续"
    },
    {
        "word": "continuation",
        "definition": "n. 继续；续集；延长；附加部分；扩建物"
    },
    {
        "word": "continual",
        "definition": "adj. 持续不断的；频繁的"
    },
    {
        "word": "continuous",
        "definition": "adj. 连续的，持续的；继续的；连绵不断的"
    },
    {
        "word": "continuity",
        "definition": "n. 连续性；一连串；分镜头剧本"
    },
    {
        "word": "contract",
        "definition": "n. 合同；婚约 vt. 感染；订约；使缩短 vi. 收缩；感染；订约"
    },
    {
        "word": "contractor",
        "definition": "n. 承包人；立契约者"
    },
    {
        "word": "contraction",
        "definition": "n. 收缩，紧缩；缩写式；害病"
    },
    {
        "word": "contradict",
        "definition": "vt. 反驳；否定；与…矛盾；与…抵触 vi. 反驳；否认；发生矛盾"
    },
    {
        "word": "contradiction",
        "definition": "n. 矛盾；否认；反驳"
    },
    {
        "word": "contradictory",
        "definition": "n. 对立物；矛盾因素 adj. 矛盾的；反对的；反驳的；抗辩的"
    },
    {
        "word": "contrary",
        "definition": "n. 相反；反面 adj. 相反的；对立的 adv. 相反地"
    },
    {
        "word": "contrast",
        "definition": "n. 对比；差别；对照物 vt. 使对比；使与…对照 vi. 对比；形成对照"
    },
    {
        "word": "contribute",
        "definition": "vt. 贡献，出力；投稿；捐献 vi. 贡献，出力；投稿；捐献 "
    },
    {
        "word": "contribution",
        "definition": "n. 贡献；捐献；投稿"
    },
    {
        "word": "contributor",
        "definition": "n. 贡献者；投稿者；捐助者"
    },
    {
        "word": "control",
        "definition": "n. 控制；管理；抑制；操纵装置 vt. 控制；管理；抑制"
    },
    {
        "word": "controversy",
        "definition": "n. 争论；论战；辩论"
    },
    {
        "word": "controversial",
        "definition": "adj. 有争议的；有争论的"
    },
    {
        "word": "convenient",
        "definition": "adj. 方便的；适当的；近便的；实用的"
    },
    {
        "word": "convenience",
        "definition": "n. 便利；厕所；便利的事物"
    },
    {
        "word": "convention",
        "definition": "n. 大会； 惯例； 约定； 协定；习俗"
    },
    {
        "word": "conventional",
        "definition": "adj. 符合习俗的，传统的；常见的；惯例的"
    },
    {
        "word": "converse",
        "definition": "n. 逆行，逆向；倒；相反的事物 adj. 相反的，逆向的；颠倒的 vi. 交谈，谈话；认识 n. 匡威（服装品牌）"
    },
    {
        "word": "conversation",
        "definition": "n. 交谈，会话；社交；交往，交际；会谈；（人与计算机的）人机对话"
    },
    {
        "word": "convert",
        "definition": "n. 皈依者；改变宗教信仰者 vt. 使转变；转换…；使…改变信仰 vi. 转变，变换；皈依；改变信仰"
    },
    {
        "word": "conversion",
        "definition": "n. 转换；变换； 兑换；改变信仰"
    },
    {
        "word": "convertible",
        "definition": "n. 有活动折篷的汽车 adj. 可改变的；同意义的；可交换的"
    },
    {
        "word": "convey",
        "definition": "vt. 传达；运输；让与"
    },
    {
        "word": "conveyance",
        "definition": "n. 运输；运输工具；财产让与"
    },
    {
        "word": "convince",
        "definition": "vt. 说服；使确信，使信服"
    },
    {
        "word": "convincing",
        "definition": "v. 使相信；使明白（convince的现在分词） adj. 令人信服的；有说服力的"
    },
    {
        "word": "cook",
        "definition": "n. 厨师，厨子 vt. 烹调，煮 vi. 烹调，做菜"
    },
    {
        "word": "cooker",
        "definition": "n. 炊具；烹饪用水果；窜改者"
    },
    {
        "word": "cookie",
        "definition": "n. 饼干；小甜点"
    },
    {
        "word": "cool",
        "definition": "n. 凉爽；凉爽的空气 adj. 凉爽的；冷静的；出色的 vt. 使…冷却；使…平静下来 vi. 变凉；平息 adv. 冷静地"
    },
    {
        "word": "cooperate",
        "definition": "vi. 合作，配合；协力"
    },
    {
        "word": "cooperation",
        "definition": "n. 合作，协作； 协力"
    },
    {
        "word": "cooperative",
        "definition": "n. 合作社 adj. 合作的；合作社的"
    },
    {
        "word": "coordinate",
        "definition": "n. 坐标；同等的人或物 vt. 调整；整合 adj. 并列的；同等的 vi. 协调"
    },
    {
        "word": "coordination",
        "definition": "n. 协调，调和；对等，同等"
    },
    {
        "word": "coordinator",
        "definition": "n. 协调者； 协调器；同等的人或物"
    },
    {
        "word": "cop",
        "definition": "n. 巡警，警官 vt. 抓住"
    },
    {
        "word": "cope",
        "definition": "n. 长袍 vi. 处理；对付；竞争"
    },
    {
        "word": "copper",
        "definition": "n. 铜；铜币；警察 adj. 铜制的 vt. 镀铜"
    },
    {
        "word": "copy",
        "definition": "n. 副本；一册；摹仿 vt. 复制；复印；抄袭 vi. 复制；复印；抄袭"
    },
    {
        "word": "copyright",
        "definition": "n. 版权，著作权 adj. 版权的；受版权保护的 vt. 保护版权；为…取得版权"
    },
    {
        "word": "cord",
        "definition": "n. 绳索；束缚 vt. 用绳子捆绑"
    },
    {
        "word": "core",
        "definition": ""
    },
    {
        "word": "corn",
        "definition": "n. （美）玉米；（英）谷物； 鸡眼 vt. 腌；使成颗粒"
    },
    {
        "word": "corner",
        "definition": "n. 角落，拐角处；地区，偏僻处；困境，窘境 vt. 垄断；迫至一隅；使陷入绝境；把…难住 vi. 囤积；相交成角"
    },
    {
        "word": "cornerstone",
        "definition": "n. 基础；柱石；地基"
    },
    {
        "word": "corporation",
        "definition": "n. 公司；法人（团体）；社团；大腹便便；市政当局"
    },
    {
        "word": "corporate",
        "definition": "adj. 法人的；共同的，全体的；社团的；公司的；企业的"
    },
    {
        "word": "corps",
        "definition": "n. 军团；兵种；兵队；（德国大学的）学生联合会"
    },
    {
        "word": "correct",
        "definition": "adj. 正确的；恰当的；端正的 vt. 改正；告诫 vi. 调整；纠正错误"
    },
    {
        "word": "correction",
        "definition": "n. 改正，修正"
    },
    {
        "word": "corrective",
        "definition": "n. 矫正物；改善法 adj. 矫正的；惩治的"
    },
    {
        "word": "correspond",
        "definition": "vi. 符合，一致；相应；通信"
    },
    {
        "word": "correspondence",
        "definition": "n. 通信；一致；相当"
    },
    {
        "word": "correspondent",
        "definition": "n. 通讯记者；客户；通信者；代理商行"
    },
    {
        "word": "corresponding",
        "definition": "adj. 相当的，相应的；一致的；通信的 v. 类似（correspond的ing形式）；相配"
    },
    {
        "word": "corridor",
        "definition": "走廊"
    },
    {
        "word": "corrupt",
        "definition": "adj. 腐败的，贪污的；堕落的 vt. 使腐烂；使堕落，使恶化 vi. 堕落，腐化；腐烂"
    },
    {
        "word": "corruption",
        "definition": "n. 贪污，腐败；堕落"
    },
    {
        "word": "cosmos",
        "definition": "n. 宇宙；和谐；秩序；大波斯菊"
    },
    {
        "word": "cosmic",
        "definition": "adj. 宇宙的（等于cosmical）"
    },
    {
        "word": "cost",
        "definition": "n. 费用，代价，成本；损失 vt. 花费；使付出；使花许多钱 vi. 花费"
    },
    {
        "word": "costly",
        "definition": "adj. 昂贵的；代价高的"
    },
    {
        "word": "costume",
        "definition": "n. 服装，装束；戏装，剧装 vt. 给…穿上服装"
    },
    {
        "word": "cottage",
        "definition": "n. 小屋；村舍；（农舍式的）小别墅"
    },
    {
        "word": "cotton",
        "definition": "n. 棉花；棉布；棉线 adj. 棉的；棉制的 vi. 一致；理解；和谐；亲近"
    },
    {
        "word": "couch",
        "definition": "vt. 使躺下；表达；弯下 vi. 蹲伏，埋伏；躺着 n. 睡椅，长沙发；床；卧榻"
    },
    {
        "word": "cough",
        "definition": "n. 咳嗽，咳嗽声；咳嗽病 vt. 咳出 vi. 咳嗽"
    },
    {
        "word": "could",
        "definition": "aux. 能够 v. 能（can的过去式）"
    },
    {
        "word": "council",
        "definition": "n. 委员会；会议；理事会；地方议会；顾问班子"
    },
    {
        "word": "councilor",
        "definition": "n. 顾问；评议员；参赞"
    },
    {
        "word": "councillor",
        "definition": "n. 议员；顾问；参赞（等于councilor）"
    },
    {
        "word": "counsel",
        "definition": "n. 法律顾问；忠告；商议；讨论；决策 vt. 建议；劝告 vi. 商讨；提出忠告"
    },
    {
        "word": "counselor",
        "definition": "n. 顾问；法律顾问；参事（等于counsellor）"
    },
    {
        "word": "counsellor",
        "definition": "n. 顾问；参赞；辅导员（等于counselor）；律师；法律顾问"
    },
    {
        "word": "count",
        "definition": "n. 计数；计算；伯爵 vt. 计算；认为 vi. 计数；有价值"
    },
    {
        "word": "countdown",
        "definition": "n. 倒数计秒"
    },
    {
        "word": "counter",
        "definition": "n. 柜台；对立面；计数器；（某些棋盘游戏的）筹码 vi. 逆向移动，对着干；反驳 adj. 相反的 vt. 反击，还击；反向移动，对着干；反驳，回答 adv. 反方向地；背道而驰地"
    },
    {
        "word": "counterpart",
        "definition": "n. 副本；配对物；极相似的人或物"
    },
    {
        "word": "country",
        "definition": "n. 国家，国土；国民；乡下，农村；乡村；故乡 adj. 祖国的，故乡的；地方的，乡村的；国家的；粗鲁的；乡村音乐的"
    },
    {
        "word": "countryside",
        "definition": "n. 农村，乡下；乡下的全体居民"
    },
    {
        "word": "county",
        "definition": "n. 郡，县"
    },
    {
        "word": "couple",
        "definition": "n. 对；夫妇；数个 vt. 结合；连接；连合 vi. 结合；成婚"
    },
    {
        "word": "coupon",
        "definition": "n. 息票；赠券；联票； 配给券"
    },
    {
        "word": "courage",
        "definition": "n. 勇气；胆量"
    },
    {
        "word": "courageous",
        "definition": "adj. 有胆量的，勇敢的"
    },
    {
        "word": "course",
        "definition": "n. 科目；课程；过程；进程；道路；路线，航向；一道菜 vt. 追赶；跑过 vi. 指引航线；快跑"
    },
    {
        "word": "court",
        "definition": "n. 法院；球场；朝廷；奉承 vt. 招致（失败、危险等）；向…献殷勤；设法获得 vi. 求爱"
    },
    {
        "word": "courtyard",
        "definition": "n. 庭院，院子；天井"
    },
    {
        "word": "cousin",
        "definition": "n. 堂兄弟姊妹；表兄弟姊妹"
    },
    {
        "word": "cover",
        "definition": "n. 封面，封皮；盖子；掩蔽物;幌子，借口 vt. 包括；采访，报导；涉及 vi. 覆盖；代替"
    },
    {
        "word": "coverage",
        "definition": "n. 覆盖，覆盖范围；新闻报道"
    },
    {
        "word": "cow",
        "definition": "n. 奶牛，母牛；母兽 vt. 威胁，恐吓"
    },
    {
        "word": "coward",
        "definition": "n. 懦夫，懦弱的人 adj. 胆小的，懦怯的"
    },
    {
        "word": "cowardly",
        "definition": "adj. 怯懦的，懦弱的；胆小的 adv. 胆怯地"
    },
    {
        "word": "cowardice",
        "definition": "n. 怯懦；胆小"
    },
    {
        "word": "cowboy",
        "definition": "n. 牛仔；牧童；莽撞的人"
    },
    {
        "word": "crab",
        "definition": "n. 螃蟹；蟹肉；脾气乖戾的人；起重机 vt. 抱怨；破坏；使偏航 vi. 捕蟹；发牢骚；抱怨"
    },
    {
        "word": "crack",
        "definition": "n. 裂缝；声变；噼啪声 adj. 最好的；高明的 vi. 破裂；爆裂 vt. 使破裂；打开；变声"
    },
    {
        "word": "cracker",
        "definition": "n. 爆竹；饼干；胡桃钳；解密高手"
    },
    {
        "word": "craft",
        "definition": "n. 工艺；手艺；太空船 vt. 精巧地制作"
    },
    {
        "word": "crane",
        "definition": "n. 吊车，起重机；鹤 vt. 用起重机起吊；伸长脖子 vi. 伸着脖子看；迟疑，踌躇"
    },
    {
        "word": "crash",
        "definition": "n. 撞碎；坠毁；破产；轰隆声；睡觉 vi. 摔碎；坠落；发出隆隆声；(金融企业等)破产 vt. 打碎；使坠毁、撞坏；擅自闯入"
    },
    {
        "word": "crawl",
        "definition": "n. 爬行；养鱼池；匍匐而行 vt. 爬行；缓慢地行进 vi. 爬行；匍匐行进"
    },
    {
        "word": "crazy",
        "definition": "adj. 疯狂的；狂热的，着迷的"
    },
    {
        "word": "craze",
        "definition": "n. 狂热 vt. 使发狂；使产生纹裂 vi. 发狂；产生纹裂"
    },
    {
        "word": "cream",
        "definition": "n. 奶油，乳脂；精华；面霜；乳酪"
    },
    {
        "word": "creamy",
        "definition": "adj. 奶油色的；乳脂状的；含乳脂的"
    },
    {
        "word": "create",
        "definition": "vt. 创造，创作；造成"
    },
    {
        "word": "creation",
        "definition": "n. 创造，创作；创作物，产物"
    },
    {
        "word": "creative",
        "definition": "adj. 创造性的"
    },
    {
        "word": "creator",
        "definition": ""
    },
    {
        "word": "creature",
        "definition": "n. 动物，生物；人；创造物"
    },
    {
        "word": "credit",
        "definition": "n. 信用，信誉； 贷款；学分；信任；声望 vt. 相信，信任；把…归给，归功于；赞颂"
    },
    {
        "word": "creditable",
        "definition": "adj. 可信的；声誉好的；值得称赞的"
    },
    {
        "word": "creep",
        "definition": "n. 爬行；毛骨悚然的感觉；谄媚者 vi. 爬行；蔓延；慢慢地移动；起鸡皮疙瘩"
    },
    {
        "word": "crew",
        "definition": "n. 队，组；全体人员，全体船员 vt. 使当船员 vi. 一起工作"
    },
    {
        "word": "crime",
        "definition": "n. 罪行，犯罪；罪恶；犯罪活动 vt. 控告……违反纪律"
    },
    {
        "word": "criminal",
        "definition": "n. 罪犯 adj. 刑事的；犯罪的；罪恶的"
    },
    {
        "word": "crisis",
        "definition": "n. 危机；危险期；决定性时刻 adj. 危机的；用于处理危机的"
    },
    {
        "word": "criterion",
        "definition": "n. （批评判断的）标准；准则；规范；准据"
    },
    {
        "word": "criticize",
        "definition": "vi. 批评；评论；苛求 vt. 批评；评论；非难"
    },
    {
        "word": "criticise",
        "definition": "vt. 批评；吹毛求疵；非难 vi. 批评；吹毛求疵；非难"
    },
    {
        "word": "criticism",
        "definition": "n. 批评；考证；苛求"
    },
    {
        "word": "critic",
        "definition": "n. 批评家，评论家；爱挑剔的人"
    },
    {
        "word": "critical",
        "definition": "adj. 鉴定的； 临界的；批评的，爱挑剔的；危险的；决定性的；评论的"
    },
    {
        "word": "crocodile",
        "definition": "n. 鳄鱼"
    },
    {
        "word": "crop",
        "definition": "n. 产量；农作物；庄稼；平头 vt. 种植；收割；修剪；剪短 vi. 收获"
    },
    {
        "word": "cross",
        "definition": "n. 交叉，十字；十字架，十字形物 adj. 交叉的，相反的；乖戾的；生气的 vt. 杂交；渡过；使相交 vi. 交叉；杂交；横过"
    },
    {
        "word": "crossing",
        "definition": "n. 十字路口；杂交；横渡；横道 v. 横越（cross的现在分词）"
    },
    {
        "word": "crowd",
        "definition": "n. 群众,一伙;一堆,许多,大众 v. 拥挤,挤满,挤进 vt. 挤满,将...塞进;催促,催逼 vi. 挤,拥挤,聚集"
    },
    {
        "word": "crowded",
        "definition": "adj. 拥挤的；塞满的 v. 拥挤（crowd的过去分词）"
    },
    {
        "word": "crown",
        "definition": "n. 王冠；花冠；王权；顶点 vt. 加冕；居…之顶；表彰；使圆满完成"
    },
    {
        "word": "crucial",
        "definition": "adj. 重要的；决定性的；定局的；决断的"
    },
    {
        "word": "cruel",
        "definition": "adj. 残酷的，残忍的；使人痛苦的，让人受难的；无情的，严酷的"
    },
    {
        "word": "cruelty",
        "definition": "n. 残酷；残忍；残酷的行为"
    },
    {
        "word": "cruise",
        "definition": "n. 巡航，巡游；乘船游览 vt. 巡航，巡游；漫游 vi. 巡航，巡游；漫游"
    },
    {
        "word": "cruiser",
        "definition": "n. 巡洋舰；巡航飞机，警察巡逻车"
    },
    {
        "word": "crush",
        "definition": "n. 粉碎；迷恋；压榨；拥挤的人群 vt. 压碎；弄皱，变形；使…挤入 vi. 挤；被压碎"
    },
    {
        "word": "cry",
        "definition": "n. 叫喊；叫声；口号；呼叫 vi. 哭；叫；喊 vt. 叫喊；哭出；大声说"
    },
    {
        "word": "crystal",
        "definition": "n. 结晶，晶体；水晶；水晶饰品 adj. 水晶的；透明的，清澈的"
    },
    {
        "word": "cube",
        "definition": "n. 立方；立方体；骰子 vt. 使成立方形；使自乘二次；量…的体积"
    },
    {
        "word": "cubic",
        "definition": "adj. 立方体的，立方的"
    },
    {
        "word": "cucumber",
        "definition": "n. 黄瓜；胡瓜"
    },
    {
        "word": "cue",
        "definition": "n. 提示，暗示；线索 vt. 给…暗示"
    },
    {
        "word": "cultivate",
        "definition": "vt. 培养；陶冶；耕作"
    },
    {
        "word": "cultivation",
        "definition": "n. 培养；耕作；耕种；教化；文雅"
    },
    {
        "word": "culture",
        "definition": "n. 文化，文明；修养；栽培 vt.  培养（等于cultivate）"
    },
    {
        "word": "cultural",
        "definition": "adj. 文化的；教养的"
    },
    {
        "word": "cup",
        "definition": "n. 杯子；奖杯；酒杯 vt. 使成杯状；为…拔火罐"
    },
    {
        "word": "cupboard",
        "definition": "n. 碗柜；食橱"
    },
    {
        "word": "curb",
        "definition": "n. 抑制；路边；勒马绳 vt. 控制；勒住"
    },
    {
        "word": "cure",
        "definition": "n. 治疗；治愈； 疗法 vt. 治疗；治愈；使硫化；加工处理 vi. 治病；痊愈；受治疗；被硫化；被加工处理"
    },
    {
        "word": "curable",
        "definition": "adj. 可治愈的；可医治的；可矫正的"
    },
    {
        "word": "curious",
        "definition": "adj. 好奇的，有求知欲的；古怪的；爱挑剔的"
    },
    {
        "word": "curiosity",
        "definition": "n. 好奇，好奇心；珍品，古董，古玩"
    },
    {
        "word": "curl",
        "definition": "n. 卷曲；卷发；螺旋状物 vt. 使…卷曲；使卷起来 vi. 卷曲；盘绕"
    },
    {
        "word": "currency",
        "definition": "n. 货币；通货"
    },
    {
        "word": "current",
        "definition": "n. （水，气，电）流；趋势；涌流 adj. 现在的；流通的，通用的；最近的；草写的"
    },
    {
        "word": "currently",
        "definition": "adv. 当前；一般地"
    },
    {
        "word": "curriculum",
        "definition": "n. 课程 总课程"
    },
    {
        "word": "curse",
        "definition": "n. 诅咒；咒骂 vt. 诅咒；咒骂 vi. 诅咒；咒骂"
    },
    {
        "word": "curtain",
        "definition": "n. 幕；窗帘 vt. 遮蔽；装上门帘"
    },
    {
        "word": "curve",
        "definition": "n. 曲线；弯曲；曲线球；曲线图表 adj. 弯曲的；曲线形的 vt. 弯；使弯曲 vi. 成曲形"
    },
    {
        "word": "cushion",
        "definition": "n. 垫子；起缓解作用之物；（猪等的）臀肉；银行储蓄 vt. 给…安上垫子；把…安置在垫子上；缓和…的冲击"
    },
    {
        "word": "custom",
        "definition": "n. 习惯，惯例；风俗；海关，关税；经常光顾；（经常性的）顾客 adj. （衣服等）定做的，定制的"
    },
    {
        "word": "customary",
        "definition": "n. 习惯法汇编 adj. 习惯的；通常的"
    },
    {
        "word": "customer",
        "definition": "n. 顾客；家伙"
    },
    {
        "word": "customs",
        "definition": "n. 海关；风俗（custom的复数）；习惯；关税"
    },
    {
        "word": "cut",
        "definition": "n. 伤口；切口；削减；（服装等的）式样；削球；切入 adj. 割下的；雕过的；缩减的 vt.  切割；削减；缩短；刺痛 vi.  切割；相交；切牌；停拍；不出席"
    },
    {
        "word": "cute",
        "definition": "adj. 可爱的；漂亮的；聪明的，伶俐的"
    },
    {
        "word": "cyberspace",
        "definition": "n. 网络空间；赛博空间"
    },
    {
        "word": "cycle",
        "definition": "n. 循环；周期；自行车；整套；一段时间 vt. 使循环；使轮转 vi. 循环；骑自行车；轮转"
    },
    {
        "word": "cycling",
        "definition": "n. 骑脚踏车消遣；骑脚踏车兜风"
    },
    {
        "word": "cyclist",
        "definition": "n. 骑自行车的人"
    },
    {
        "word": "dad",
        "definition": "n. 爸爸；爹爹"
    },
    {
        "word": "daddy",
        "definition": "n. 爸爸"
    },
    {
        "word": "daily",
        "definition": "n. 日报；朝来夜去的女佣 adj. 日常的；每日的 adv. 日常地；每日；天天"
    },
    {
        "word": "dairy",
        "definition": "n. 奶制品；乳牛；制酪场；乳品店；牛奶及乳品业 adj. 乳品的；牛奶的；牛奶制的；产乳的"
    },
    {
        "word": "dam",
        "definition": "n.  水坝；障碍 v. 控制；筑坝"
    },
    {
        "word": "damage",
        "definition": "vi. 损害；损毁 vt. 损害，毁坏 n. 损害；损毁；赔偿金"
    },
    {
        "word": "damn",
        "definition": "n. 一点；诅咒 vt. 谴责；罚…下地狱 adj. 可恶的 adv. 非常 vi. 谴责 int. 讨厌"
    },
    {
        "word": "damp",
        "definition": "n. 潮湿，湿气 adj. 潮湿的 vt. 使潮湿；使阻尼；使沮丧，抑制 vi. 减幅，阻尼；变潮湿"
    },
    {
        "word": "dampen",
        "definition": "vt. 抑制；使…沮丧；使…潮湿 vi. 潮湿；丧气"
    },
    {
        "word": "dance",
        "definition": "n. 舞蹈；舞会；舞曲 adj. 舞蹈的；用于跳舞的 vt. 跳舞；使跳跃 vi. 跳舞；跳跃；飘扬"
    },
    {
        "word": "danger",
        "definition": "n. 危险；危险物，威胁"
    },
    {
        "word": "dangerous",
        "definition": "adj. 危险的 危险地"
    },
    {
        "word": "dare",
        "definition": "n. 挑战；挑动 vt. 敢冒；不惧 vi. 敢；胆敢"
    },
    {
        "word": "daring",
        "definition": "n. 胆量，勇气 v. 敢（dare的现在分词） adj. 大胆的，勇敢的"
    },
    {
        "word": "dark",
        "definition": "n. 黑暗；夜；黄昏；模糊 adj. 黑暗的，深色的；模糊的；无知的；忧郁的"
    },
    {
        "word": "darkness",
        "definition": "n. 黑暗；模糊；无知；阴郁"
    },
    {
        "word": "darken",
        "definition": "vt. 使变暗；使模糊 vi. 变黑；变得模糊"
    },
    {
        "word": "darling",
        "definition": "n. 心爱的人；亲爱的"
    },
    {
        "word": "dash",
        "definition": "n. 破折号；冲撞 vi. 猛冲；撞击 vt. 使…破灭；猛撞；泼溅"
    },
    {
        "word": "data",
        "definition": "n. 数据（datum的复数）；资料"
    },
    {
        "word": "datum",
        "definition": "n. 数据，资料 n. 基点，基线，基面； 论据，作为论据的事实 n. 已知数 n. （pl.）data"
    },
    {
        "word": "database",
        "definition": "n. 数据库，资料库"
    },
    {
        "word": "date",
        "definition": "n. 日期；约会；年代；枣椰子 vt. 确定…年代；和…约会 vi. 过时；注明日期；始于（某一历史时期）"
    },
    {
        "word": "dating",
        "definition": "n. 约会；记日期的；注明日期 v. 约会；定日期（date的ing形式）"
    },
    {
        "word": "daughter",
        "definition": "n. 女儿； 子代 adj. 女儿的；子代的"
    },
    {
        "word": "dawn",
        "definition": "n. 黎明；开端 vt. 破晓；出现；被领悟"
    },
    {
        "word": "day",
        "definition": "n. 一天；时期；白昼 adj. 日间的；逐日的 adv. 每天；经常在白天地"
    },
    {
        "word": "daylight",
        "definition": "n. 白天；日光；黎明；公开"
    },
    {
        "word": "dead",
        "definition": "n. 死者 adj. 无生命的；呆板的；废弃了的 adv. 完全地"
    },
    {
        "word": "deadline",
        "definition": "n. 截止期限，最后期限"
    },
    {
        "word": "deadly",
        "definition": "adj. 致命的；非常的；死一般的 adv. 非常；如死一般地"
    },
    {
        "word": "deaf",
        "definition": "adj. 聋的"
    },
    {
        "word": "deal",
        "definition": "n. 交易；（美）政策；待遇；份量 vi. 处理；讨论；对待；做生意 vt. 处理；给予；分配；发牌"
    },
    {
        "word": "dealer",
        "definition": "n. 经销商；商人 n. 发牌员 n. 毒品贩子，贩毒者"
    },
    {
        "word": "dealing",
        "definition": "n. 交易；行为"
    },
    {
        "word": "dean",
        "definition": "n. 院长；系主任；教务长；主持牧师"
    },
    {
        "word": "dear",
        "definition": "n. 亲爱的人 adj. 亲爱的；尊敬的；昂贵的 adv. 高价地；疼爱地 int. 哎呀"
    },
    {
        "word": "death",
        "definition": "n. 死；死亡；死神；毁灭"
    },
    {
        "word": "debate",
        "definition": "n. 辩论；辩论会 vt. 辩论，争论，讨论 vi. 辩论，争论，讨论"
    },
    {
        "word": "debt",
        "definition": "n. 债务；借款；罪过"
    },
    {
        "word": "debtor",
        "definition": "n. 债务人； 借方"
    },
    {
        "word": "decade",
        "definition": "n. 十年，十年期；十"
    },
    {
        "word": "decay",
        "definition": "n. 衰退， 衰减；腐烂，腐朽 vt. 使腐烂，使腐败；使衰退，使衰落 vi. 衰退， 衰减；腐烂，腐朽"
    },
    {
        "word": "deceive",
        "definition": "v. 欺骗；行骗"
    },
    {
        "word": "deceit",
        "definition": "n. 欺骗；谎言；欺诈手段"
    },
    {
        "word": "deception",
        "definition": "n. 欺骗，欺诈；骗术"
    },
    {
        "word": "deceptive",
        "definition": "adj. 欺诈的；迷惑的；虚伪的"
    },
    {
        "word": "December",
        "definition": "n. 十二月"
    },
    {
        "word": "decent",
        "definition": "adj. 正派的；得体的；相当好的"
    },
    {
        "word": "decide",
        "definition": "vi. 决定，下决心 vt. 决定；解决；判决"
    },
    {
        "word": "decision",
        "definition": "n. 决定，决心；决议"
    },
    {
        "word": "decisive",
        "definition": "adj. 决定性的；果断的，坚定的"
    },
    {
        "word": "deck",
        "definition": "n. 甲板；行李仓；露天平台 vt. 装饰；装甲板；打扮"
    },
    {
        "word": "declare",
        "definition": "vt. 宣布，声明；断言，宣称 vi. 声明，宣布"
    },
    {
        "word": "declaration",
        "definition": "n. （纳税品等的）申报；宣布；公告；申诉书"
    },
    {
        "word": "declarative",
        "definition": "adj. 宣言的；陈述的，说明的"
    },
    {
        "word": "decline",
        "definition": "n. 下降；衰退；斜面 vt. 谢绝；婉拒 vi. 下降；衰落；谢绝"
    },
    {
        "word": "decorate",
        "definition": "vt. 装饰；布置；授勋给 vi. 装饰；布置"
    },
    {
        "word": "decoration",
        "definition": "n. 装饰，装潢；装饰品；奖章"
    },
    {
        "word": "decorative",
        "definition": "adj. 装饰性的；装潢用的"
    },
    {
        "word": "decrease",
        "definition": "n. 减少，减小；减少量 vt. 减少，减小 vi. 减少，减小"
    },
    {
        "word": "deed",
        "definition": "n. 行动；功绩；证书； 契据 vt. 立契转让"
    },
    {
        "word": "deem",
        "definition": "vt. 认为，视作；相信 vi. 认为，持某种看法；作某种评价"
    },
    {
        "word": "deep",
        "definition": "n. 深处；深渊 adj. 深的；低沉的；深奥的 adv. 深入地；深深地；迟"
    },
    {
        "word": "deeply",
        "definition": "adv. 深刻地；浓浓地；在深处"
    },
    {
        "word": "depth",
        "definition": "n.  深度；深奥"
    },
    {
        "word": "deer",
        "definition": "n. 鹿"
    },
    {
        "word": "defeat",
        "definition": "n. 失败的事实；击败的行为 vt. 击败，战胜；挫败；使…失败"
    },
    {
        "word": "defect",
        "definition": "n. 缺点，缺陷；不足之处 vi. 变节；叛变"
    },
    {
        "word": "defective",
        "definition": "n. 有缺陷的人；不完全变化词 adj. 有缺陷的；不完美的"
    },
    {
        "word": "defection",
        "definition": "n. 背叛；缺点；变节；脱党"
    },
    {
        "word": "defend",
        "definition": "vi. 保卫；防守 vt. 辩护；防护"
    },
    {
        "word": "defense",
        "definition": "n. 防卫，防护；防御措施；防守 vt. 谋划抵御"
    },
    {
        "word": "defence",
        "definition": "n. 防御；防卫；答辩；防卫设备"
    },
    {
        "word": "defensive",
        "definition": "n. 防御；守势 adj. 自卫的；防御用的"
    },
    {
        "word": "defendant",
        "definition": "n. 被告 adj. 辩护的；为自己辩护的"
    },
    {
        "word": "deficient",
        "definition": "adj. 不足的；有缺陷的；不充分的"
    },
    {
        "word": "deficiency",
        "definition": "n. 缺陷，缺点；缺乏；不足的数额"
    },
    {
        "word": "deficit",
        "definition": "n. 赤字；不足额"
    },
    {
        "word": "define",
        "definition": "vt. 定义；使明确；规定"
    },
    {
        "word": "definition",
        "definition": "n. 定义； 清晰度；解说"
    },
    {
        "word": "definite",
        "definition": "adj. 一定的；确切的"
    },
    {
        "word": "definitely",
        "definition": "adv. 清楚地，当然；明确地，肯定地"
    },
    {
        "word": "defy",
        "definition": "n. 挑战；对抗 vt. 藐视；公然反抗；挑衅；使落空"
    },
    {
        "word": "defiance",
        "definition": "n. 蔑视；挑战；反抗"
    },
    {
        "word": "defiant",
        "definition": "adj. 挑衅的；目中无人的，蔑视的；挑战的"
    },
    {
        "word": "degree",
        "definition": "n. 程度，等级；度；学位；阶层"
    },
    {
        "word": "delay",
        "definition": "n. 延期；耽搁；被耽搁或推迟的时间 vt. 延期；耽搁 vi. 延期；耽搁"
    },
    {
        "word": "delegate",
        "definition": "n. 代表 vt. 委派…为代表"
    },
    {
        "word": "delegation",
        "definition": "n. 代表团；授权；委托"
    },
    {
        "word": "delete",
        "definition": "vt. 删除"
    },
    {
        "word": "deletion",
        "definition": "n. 删除； 缺失；删除部分"
    },
    {
        "word": "deliberate",
        "definition": "adj. 故意的；深思熟虑的；从容的 vt. 仔细考虑；商议"
    },
    {
        "word": "deliberation",
        "definition": "n. 审议；考虑；从容；熟思"
    },
    {
        "word": "delicate",
        "definition": "adj. 微妙的；精美的，雅致的；柔和的；易碎的；纤弱的；清淡可口的"
    },
    {
        "word": "delicious",
        "definition": "adj. 美味的；可口的"
    },
    {
        "word": "delight",
        "definition": "n. 高兴 vt. 使高兴 vi. 高兴"
    },
    {
        "word": "delightful",
        "definition": "adj. 可爱的，可喜的；讨人喜欢的；令人愉快的"
    },
    {
        "word": "deliver",
        "definition": "n. 投球 vt. 交付；发表；递送；释放；给予（打击）；给…接生 vi. 实现；传送；履行；投递"
    },
    {
        "word": "delivery",
        "definition": "n.  交付；分娩；递送"
    },
    {
        "word": "demand",
        "definition": "n.  需求；要求；需要 vt. 要求；需要；查询 vi. 需要；请求；查问"
    },
    {
        "word": "demanding",
        "definition": "v. 要求；查问（demand的ing形式） adj. 苛求的；要求高的；吃力的"
    },
    {
        "word": "democracy",
        "definition": "n. 民主，民主主义；民主政治"
    },
    {
        "word": "democratic",
        "definition": "adj. 民主的；民主政治的；大众的"
    },
    {
        "word": "democrat",
        "definition": "n. 民主党人；民主主义者；民主政体论者"
    },
    {
        "word": "demonstrate",
        "definition": "vt. 证明；展示；论证 vi. 示威"
    },
    {
        "word": "demonstration",
        "definition": "n. 示范；证明；示威游行"
    },
    {
        "word": "demo",
        "definition": ""
    },
    {
        "word": "demonstrative",
        "definition": "adj. 说明的；证明的；公开表露感情的 n. 指示词"
    },
    {
        "word": "dense",
        "definition": "adj. 稠密的；浓厚的；愚钝的"
    },
    {
        "word": "density",
        "definition": "n. 密度"
    },
    {
        "word": "dent",
        "definition": "n. 凹痕；削弱；减少；齿 vt. 削弱；使产生凹痕 vi. 产生凹陷；凹进去；削减"
    },
    {
        "word": "dental",
        "definition": "n. 齿音 adj. 牙科的；牙齿的，牙的"
    },
    {
        "word": "dentist",
        "definition": "n. 牙科医生 牙医诊所"
    },
    {
        "word": "deny",
        "definition": "vi. 否认；拒绝 vt. 否定，否认；拒绝给予；拒绝…的要求"
    },
    {
        "word": "denial",
        "definition": "n. 否认；拒绝；节制；背弃"
    },
    {
        "word": "depart",
        "definition": "adj. 逝世的 vi. 离开；出发，起程；违反；去世"
    },
    {
        "word": "departure",
        "definition": "n. 离开；出发；违背"
    },
    {
        "word": "department",
        "definition": "n. 部；部门；系；科；局"
    },
    {
        "word": "depend",
        "definition": "vi. 依赖，依靠；取决于；相信，信赖"
    },
    {
        "word": "dependent",
        "definition": "n. 依赖他人者；受赡养者 adj. 依靠的；从属的；取决于…的"
    },
    {
        "word": "dependence",
        "definition": "n. 依赖；依靠；信任；信赖"
    },
    {
        "word": "dependable",
        "definition": "adj. 可靠的，可信赖的；可信任的"
    },
    {
        "word": "deposit",
        "definition": "n. 存款；押金；订金；保证金；沉淀物 vt. 使沉积；存放 vi. 沉淀"
    },
    {
        "word": "depress",
        "definition": "vt. 压抑；使沮丧；使萧条"
    },
    {
        "word": "depression",
        "definition": "n. 沮丧；洼地；不景气；忧愁；低气压区"
    },
    {
        "word": "deprive",
        "definition": "vt. 使丧失，剥夺"
    },
    {
        "word": "deprivation",
        "definition": "n. 剥夺；损失；免职；匮乏；贫困"
    },
    {
        "word": "deputy",
        "definition": "n. 代理人，代表 adj. 副的；代理的"
    },
    {
        "word": "derive",
        "definition": "vt. 源于；得自；获得 vi. 起源"
    },
    {
        "word": "derivative",
        "definition": "n.  衍生物，派生物；导数 adj. 派生的；引出的"
    },
    {
        "word": "derivation",
        "definition": "n. 引出；来历；词源；派生词"
    },
    {
        "word": "descend",
        "definition": "vi. 下降；下去；下来；遗传；屈尊 vt. 下去；沿…向下"
    },
    {
        "word": "descent",
        "definition": "n. 下降；血统；袭击 vt. 除去…的气味；使…失去香味"
    },
    {
        "word": "descendant",
        "definition": "n. 后裔；子孙 adj. 下降的；祖传的"
    },
    {
        "word": "describe",
        "definition": "vt. 描述，形容；描绘"
    },
    {
        "word": "description",
        "definition": "n. 描述，描写；类型；说明书"
    },
    {
        "word": "descriptive",
        "definition": "adj. 描写的，叙述的；描写性的"
    },
    {
        "word": "desert",
        "definition": "n. 沙漠；荒原；应得的赏罚 vt. 遗弃；放弃；逃跑 adj. 沙漠的；荒凉的；不毛的 vi. 遗弃；开小差；逃掉"
    },
    {
        "word": "desertion",
        "definition": "n. 遗弃；开小差；逃亡"
    },
    {
        "word": "deserve",
        "definition": "vi. 应受，应得 vt. 应受，应得"
    },
    {
        "word": "design",
        "definition": "n. 设计；图案 vt. 设计；计划；构思 vi. 设计"
    },
    {
        "word": "designer",
        "definition": "n. 设计师；谋划者 adj. 由设计师专门设计的；享有盛名的；赶时髦的"
    },
    {
        "word": "desire",
        "definition": "n. 欲望；要求，心愿；性欲 vt. 想要；要求；希望得到… vi. 渴望"
    },
    {
        "word": "desirable",
        "definition": "n. 合意的人或事物 adj. 令人满意的；值得要的"
    },
    {
        "word": "desirability",
        "definition": "n. 愿望；有利条件；值得向往的事物；合意"
    },
    {
        "word": "desirous",
        "definition": "adj. 渴望的；想要的"
    },
    {
        "word": "desk",
        "definition": "n. 办公桌；服务台；编辑部；（美）讲道台；乐谱架 adj. 书桌的；桌上用的；伏案做的"
    },
    {
        "word": "desktop",
        "definition": "n. 桌面；台式机"
    },
    {
        "word": "despair",
        "definition": "n. 绝望；令人绝望的人或事 vi. 绝望，丧失信心"
    },
    {
        "word": "desperate",
        "definition": "adj. 不顾一切的；令人绝望的；极度渴望的"
    },
    {
        "word": "despatch",
        "definition": "n. 派遣；发送（等于dispatch） vt. 派遣；发送；匆匆吃下 vi. 匆匆离开"
    },
    {
        "word": "despite",
        "definition": "prep. 尽管，不管 n. 轻视；憎恨；侮辱"
    },
    {
        "word": "dessert",
        "definition": "n. 餐后甜点；甜点心"
    },
    {
        "word": "destination",
        "definition": "n. 目的地，终点"
    },
    {
        "word": "destroy",
        "definition": "vt. 破坏；消灭；毁坏"
    },
    {
        "word": "destruction",
        "definition": "n. 破坏，毁灭；摧毁"
    },
    {
        "word": "destructive",
        "definition": "adj. 破坏的；毁灭性的；有害的，消极的"
    },
    {
        "word": "detail",
        "definition": "n. 细节，详情 vt. 详述；选派 vi. 画详图"
    },
    {
        "word": "detailed",
        "definition": "adj. 详细的，精细的；复杂的，详尽的 v. 详细说明（detail的过去分词）"
    },
    {
        "word": "detect",
        "definition": "vt. 察觉；发现；探测"
    },
    {
        "word": "detection",
        "definition": "n. 侦查，探测；发觉，发现；察觉"
    },
    {
        "word": "detective",
        "definition": "n. 侦探 adj. 侦探的"
    },
    {
        "word": "deteriorate",
        "definition": "vi. 恶化，变坏 vt. 恶化"
    },
    {
        "word": "deterioration",
        "definition": "n. 恶化；退化；堕落"
    },
    {
        "word": "determine",
        "definition": "v. （使）下决心，（使）做出决定 vt. 决定，确定；判定，判决；限定 vi. 确定；决定；判决，终止；了结，终止，结束"
    },
    {
        "word": "determination",
        "definition": "n. 决心；果断；测定"
    },
    {
        "word": "determined",
        "definition": "v. 决定；断定（determine的过去分词） adj. 决定了的；坚决的"
    },
    {
        "word": "develop",
        "definition": "vi. 发育；生长；进化；显露 vt. 开发；进步；使成长；使显影"
    },
    {
        "word": "development",
        "definition": "n. 发展；开发；发育；住宅小区（专指由同一开发商开发的）； 显影"
    },
    {
        "word": "developmental",
        "definition": "adj. 发展的；启发的"
    },
    {
        "word": "developer",
        "definition": "n. 开发者； 显影剂"
    },
    {
        "word": "device",
        "definition": "n. 装置；策略；图案"
    },
    {
        "word": "devil",
        "definition": "n. 魔鬼；撒旦；家伙；恶棍；淘气鬼；冒失鬼 vt. 虐待，折磨；（用扯碎机）扯碎；（替作家，律师等）做助手；抹辣味料烤制或煎煮"
    },
    {
        "word": "devise",
        "definition": "n. 遗赠 vt. 设计；想出；发明；图谋；遗赠给"
    },
    {
        "word": "devote",
        "definition": "vt. 致力于；奉献"
    },
    {
        "word": "devotion",
        "definition": "n. 献身，奉献；忠诚；热爱"
    },
    {
        "word": "dew",
        "definition": "n. 珠，滴；露水；清新 vt. （露水等）弄湿 vi. 结露水"
    },
    {
        "word": "diabetes",
        "definition": "n. 糖尿病；多尿症"
    },
    {
        "word": "diagnose",
        "definition": "vt. 诊断；断定 vi. 诊断；判断"
    },
    {
        "word": "diagnosis",
        "definition": "n. 诊断"
    },
    {
        "word": "diagram",
        "definition": "n. 图表；图解 vt. 用图解法表示"
    },
    {
        "word": "dial",
        "definition": "n. 转盘；刻度盘；钟面 vt. 给…拨号打电话 vi. 拨号"
    },
    {
        "word": "dialect",
        "definition": "n. 方言，土话；同源语；行话；个人用语特征 adj. 方言的"
    },
    {
        "word": "dialog",
        "definition": "n. 对话；会话"
    },
    {
        "word": "dialogue",
        "definition": "n. 对话；意见交换 vt. 用对话表达 vi. 对话"
    },
    {
        "word": "diameter",
        "definition": "n. 直径"
    },
    {
        "word": "diamond",
        "definition": "n. 钻石，金刚石；菱形；方块牌 adj. 菱形的；金刚钻的"
    },
    {
        "word": "diary",
        "definition": "n. 日志，日记；日记簿"
    },
    {
        "word": "dictate",
        "definition": "n. 命令；指示 vt. 命令；口述；使听写 vi. 口述；听写"
    },
    {
        "word": "dictation",
        "definition": "n. 听写；口述；命令"
    },
    {
        "word": "dictator",
        "definition": "n. 独裁者；命令者"
    },
    {
        "word": "dictionary",
        "definition": "n. 字典；词典"
    },
    {
        "word": "die",
        "definition": "n. 冲模，钢模；骰子 vi. 死亡；凋零；熄灭 vt. 死，死于…"
    },
    {
        "word": "dying",
        "definition": "n. 死，死亡 v. 死，死亡；枯萎；失去活力（die的ing形式） adj. 临终的，垂死的"
    },
    {
        "word": "diet",
        "definition": "n. 饮食；食物；规定饮食 vt.  照规定饮食 vi. 节食"
    },
    {
        "word": "dietary",
        "definition": "n. 规定的食物；饮食的规定；食谱 adj. 饮食的，饭食的，规定食物的"
    },
    {
        "word": "differ",
        "definition": "vi. 相异；意见分歧 vt. 使…相异；使…不同"
    },
    {
        "word": "difference",
        "definition": "n. 差异；不同；争执"
    },
    {
        "word": "different",
        "definition": "adj. 不同的；个别的，与众不同的"
    },
    {
        "word": "difficult",
        "definition": "adj. 困难的；不随和的；执拗的"
    },
    {
        "word": "difficulty",
        "definition": "n. 困难，困境"
    },
    {
        "word": "dig",
        "definition": "n. 戳，刺；挖苦 vi. 挖掘 vt. 挖，掘；探究"
    },
    {
        "word": "digest",
        "definition": "n. 文摘；摘要 vt. 消化；吸收；融会贯通 vi. 消化"
    },
    {
        "word": "digestion",
        "definition": "n. 消化；领悟"
    },
    {
        "word": "digestive",
        "definition": "n. 助消化药 adj. 消化的；助消化的"
    },
    {
        "word": "digit",
        "definition": "n. 数字；手指或足趾；一指宽"
    },
    {
        "word": "digital",
        "definition": "n. 数字；键 adj. 数字的；手指的"
    },
    {
        "word": "dignity",
        "definition": "n. 尊严；高贵"
    },
    {
        "word": "dignify",
        "definition": "vt. 使高贵；增威严；授以荣誉"
    },
    {
        "word": "dilemma",
        "definition": "n. 困境；进退两难；两刀论法"
    },
    {
        "word": "diligent",
        "definition": "adj. 勤勉的；用功的，费尽心血的"
    },
    {
        "word": "diligence",
        "definition": "n. 勤奋，勤勉；注意的程度"
    },
    {
        "word": "dim",
        "definition": "n. 笨蛋，傻子 adj. 暗淡的，昏暗的；模糊的，看不清的；悲观的，怀疑的 vt. 使暗淡，使失去光泽；使变模糊 vi. 变模糊，变暗淡"
    },
    {
        "word": "dime",
        "definition": "n. 一角硬币"
    },
    {
        "word": "dimension",
        "definition": "n. 方面; 维；尺寸；次元；容积 vt. 标出尺寸 adj. 规格的"
    },
    {
        "word": "dimensional",
        "definition": "adj. 空间的；尺寸的"
    },
    {
        "word": "dine",
        "definition": "vi. 进餐，用餐 vt. 宴请"
    },
    {
        "word": "diner",
        "definition": "n. 用餐者；路边小饭店；餐车式简便餐厅"
    },
    {
        "word": "dinner",
        "definition": "n. 晚餐，晚宴；宴会；正餐"
    },
    {
        "word": "dioxide",
        "definition": "n. 二氧化物"
    },
    {
        "word": "dip",
        "definition": "n. 下沉，下降；倾斜；浸渍，蘸湿 vi. 浸；下降，下沉；倾斜；舀，掏 vt. 浸，泡，蘸；舀取；把伸入"
    },
    {
        "word": "diploma",
        "definition": "n. 毕业证书，学位证书；公文，文书；奖状 vt. 发给…毕业文凭"
    },
    {
        "word": "diplomat",
        "definition": "n. 外交家，外交官；有外交手腕的人；处事圆滑机敏的人"
    },
    {
        "word": "diplomatic",
        "definition": "adj. 外交的；外交上的；老练的"
    },
    {
        "word": "diplomacy",
        "definition": "n. 外交；外交手腕；交际手段"
    },
    {
        "word": "direct",
        "definition": "adj. 直接的；直系的；亲身的；恰好的 vt. 管理；指挥；导演；指向 adv. 直接地；正好；按直系关系 vi. 指导；指挥"
    },
    {
        "word": "direction",
        "definition": "n. 方向；指导；趋势；用法说明"
    },
    {
        "word": "director",
        "definition": "n. 主任，主管；导演；人事助理"
    },
    {
        "word": "dirt",
        "definition": "n. 污垢，泥土；灰尘，尘土；下流话"
    },
    {
        "word": "dirty",
        "definition": "adj. 下流的，卑鄙的；肮脏的；恶劣的；暗淡的 vt. 弄脏 vi. 变脏"
    },
    {
        "word": "disable",
        "definition": "vt. 使失去能力；使残废；使无资格"
    },
    {
        "word": "disabled",
        "definition": "adj. 残废的，有缺陷的 v. 使…失去能力（disable的过去分词）"
    },
    {
        "word": "disability",
        "definition": "n. 残疾；无能；无资格；不利条件"
    },
    {
        "word": "disagree",
        "definition": "vi. 不同意；不一致；争执；不适宜"
    },
    {
        "word": "disagreement",
        "definition": "n. 不一致；争论；意见不同"
    },
    {
        "word": "disappear",
        "definition": "vi. 消失；失踪；不复存在 vt. 使…不存在；使…消失"
    },
    {
        "word": "disappearance",
        "definition": "n. 消失；不见"
    },
    {
        "word": "disappoint",
        "definition": "vt. 使失望"
    },
    {
        "word": "disappointment",
        "definition": "n. 失望；沮丧"
    },
    {
        "word": "disappointing",
        "definition": "adj. 令人失望的；令人扫兴的 v. 令人失望（disappoint的ing形式）；辜负…的期望"
    },
    {
        "word": "disapprove",
        "definition": "vi. 不赞成；不喜欢 vt. 不赞成；不同意"
    },
    {
        "word": "disapproval",
        "definition": "n. 不赞成；不喜欢"
    },
    {
        "word": "disaster",
        "definition": "n. 灾难，灾祸；不幸"
    },
    {
        "word": "disastrous",
        "definition": "adj. 灾难性的；损失惨重的；悲伤的"
    },
    {
        "word": "discard",
        "definition": "n. 抛弃；被丢弃的东西或人 vt. 抛弃；放弃；丢弃 vi. 放弃"
    },
    {
        "word": "discharge",
        "definition": "n. 排放；卸货；解雇 vt. 解雇；卸下；放出；免除 vi. 排放；卸货；流出"
    },
    {
        "word": "discipline",
        "definition": "n. 学科；纪律；训练；惩罚 vt. 训练，训导；惩戒"
    },
    {
        "word": "disciplined",
        "definition": "adj. 遵守纪律的；受过训练的 v. 使有纪律（discipline的过去分词）；训导"
    },
    {
        "word": "disciplinary",
        "definition": "adj. 规律的；训练的；训诫的"
    },
    {
        "word": "disco",
        "definition": "n. 迪斯科舞厅；的士高"
    },
    {
        "word": "discount",
        "definition": "n. 折扣；贴现率 vt. 打折扣；将…贴现；贬损；低估；忽视 vi. 贴现；打折扣出售商品"
    },
    {
        "word": "discourage",
        "definition": "vt. 阻止；使气馁"
    },
    {
        "word": "discover",
        "definition": "vi. 发现 vt. 发现；发觉"
    },
    {
        "word": "discovery",
        "definition": "n. 发现，发觉；被发现的事物"
    },
    {
        "word": "discriminate",
        "definition": "vi. 区别；辨别 vt. 歧视；区别；辨别"
    },
    {
        "word": "discrimination",
        "definition": "n. 歧视；区别，辨别；识别力"
    },
    {
        "word": "discriminatory",
        "definition": "adj. 有辨识力的；差别对待的"
    },
    {
        "word": "discuss",
        "definition": "vt. 讨论；论述，辩论"
    },
    {
        "word": "discussion",
        "definition": "n. 讨论，议论"
    },
    {
        "word": "disease",
        "definition": "n. 病， 疾病；弊病 vt. 传染；使…有病"
    },
    {
        "word": "disguise",
        "definition": "n. 伪装；假装；用作伪装的东西 vt. 掩饰；假装；隐瞒"
    },
    {
        "word": "disgust",
        "definition": "n. 厌恶，嫌恶 vt. 使厌恶；使作呕"
    },
    {
        "word": "disgusting",
        "definition": "adj. 令人厌恶的 令人极不能接受的"
    },
    {
        "word": "dish",
        "definition": "n. 盘；餐具；一盘食物；外貌有吸引力的人 vt. 盛于碟盘中；分发；使某人的希望破灭；说（某人）的闲话 vi. 成碟状；闲谈"
    },
    {
        "word": "disintegrate",
        "definition": "vi. 瓦解；碎裂；衰变 vt. 使分解；使碎裂；使崩溃；使衰变"
    },
    {
        "word": "disintegration",
        "definition": "n. 瓦解，崩溃；分解"
    },
    {
        "word": "disk",
        "definition": "n.  磁盘，磁碟片；圆盘，盘状物；唱片"
    },
    {
        "word": "disc",
        "definition": "n. 圆盘， 唱片（等于disk） vt. 灌唱片"
    },
    {
        "word": "dislike",
        "definition": "n. 嫌恶，反感，不喜爱 vt. 不喜欢，厌恶"
    },
    {
        "word": "dismiss",
        "definition": "vt. 解散；解雇；开除；让...离开；不予理会、不予考虑 vi. 解散"
    },
    {
        "word": "dismissal",
        "definition": "n. 解雇；免职"
    },
    {
        "word": "disorder",
        "definition": "n. 混乱；骚乱 vt. 使失调；扰乱"
    },
    {
        "word": "display",
        "definition": "n. 显示；炫耀 vt. 显示；表现；陈列 adj. 展览的；陈列用的 vi.  作炫耀行为"
    },
    {
        "word": "dispose",
        "definition": "n. 处置；性情 vi. 处理；安排；（能够）决定 vt. 处理；处置；安排"
    },
    {
        "word": "disposal",
        "definition": "n. 处理；支配；清理；安排"
    },
    {
        "word": "dispute",
        "definition": "n. 辩论；争吵 vt. 辩论；怀疑；阻止；抗拒 vi. 争论"
    },
    {
        "word": "disputable",
        "definition": "adj. 有讨论余地的；真假可疑的"
    },
    {
        "word": "disrupt",
        "definition": "vt. 破坏；使瓦解；使分裂；使中断；使陷于混乱 adj. 分裂的，中断的；分散的"
    },
    {
        "word": "disruptive",
        "definition": "adj. 破坏的；分裂性的；制造混乱的"
    },
    {
        "word": "disruption",
        "definition": "n. 破坏，毁坏；分裂，瓦解"
    },
    {
        "word": "dissolve",
        "definition": "n. 叠化画面；画面的溶暗 vt. 使溶解；使分解；使液化 vi. 溶解；解散；消失"
    },
    {
        "word": "distance",
        "definition": "n. 距离；远方；疏远；间隔 vt. 疏远；把…远远甩在后面"
    },
    {
        "word": "distant",
        "definition": "adj. 遥远的；冷漠的；远隔的；不友好的，冷淡的"
    },
    {
        "word": "distinct",
        "definition": "adj. 明显的；独特的；清楚的；有区别的"
    },
    {
        "word": "distinction",
        "definition": "n. 区别；差别；特性；荣誉、勋章"
    },
    {
        "word": "distinctive",
        "definition": "adj. 有特色的，与众不同的"
    },
    {
        "word": "distinguish",
        "definition": "vi. 区别，区分；辨别 vt. 区分；辨别；使杰出，使表现突出"
    },
    {
        "word": "distinguishable",
        "definition": "adj. 可区别的；辨认得出的；可辨识的"
    },
    {
        "word": "distract",
        "definition": "vt. 转移；分心"
    },
    {
        "word": "distraction",
        "definition": "n. 注意力分散；消遣；心烦意乱"
    },
    {
        "word": "distress",
        "definition": "n. 危难，不幸；贫困；悲痛 vt. 使悲痛；使贫困"
    },
    {
        "word": "distressful",
        "definition": "adj. 苦难重重的；使苦恼的；不幸的"
    },
    {
        "word": "distribute",
        "definition": "vt. 分配；散布；分开；把…分类"
    },
    {
        "word": "distribution",
        "definition": "n. 分布；分配"
    },
    {
        "word": "distributive",
        "definition": "n.  分配词 adj. 分配的；分布的；分发的"
    },
    {
        "word": "district",
        "definition": "n. 区域；地方；行政区"
    },
    {
        "word": "disturb",
        "definition": "vt. 打扰；妨碍；使不安；弄乱；使恼怒 vi. 打扰；妨碍"
    },
    {
        "word": "disturbance",
        "definition": "n. 干扰；骚乱；忧虑"
    },
    {
        "word": "ditch",
        "definition": "n. 沟渠；壕沟 vt. 在…上掘沟；把…开入沟里；丢弃 vi. 开沟；掘沟"
    },
    {
        "word": "dive",
        "definition": "n. 潜水；跳水；俯冲；扑 vi. 潜水；跳水；俯冲；急剧下降"
    },
    {
        "word": "diverse",
        "definition": "adj. 不同的；多种多样的；变化多的"
    },
    {
        "word": "diversify",
        "definition": "vt. 使多样化，使变化；增加产品种类以扩大"
    },
    {
        "word": "diversity",
        "definition": "n. 多样性；差异"
    },
    {
        "word": "divide",
        "definition": "n.  分水岭，分水线 vt. 划分；除；分开；使产生分歧 vi. 分开；意见分歧"
    },
    {
        "word": "division",
        "definition": "n.  除法；部门；分配；分割；师（军队）；赛区"
    },
    {
        "word": "divisive",
        "definition": "adj. 分裂的；区分的；造成不和的"
    },
    {
        "word": "divorce",
        "definition": "n. 离婚；分离 vt. 使离婚，使分离；与…离婚 vi. 离婚"
    },
    {
        "word": "dizzy",
        "definition": "adj. 晕眩的；使人头晕的；昏乱的；心不在焉的；愚蠢的 vt. 使头晕眼花；使混乱；使茫然"
    },
    {
        "word": "do",
        "definition": "vi. 行，足够；生长 n. 要求；规定；C大调音阶中的第一音 v. 做；干；学习；研究；进行；完成；解答；整理；算出；引起；行过 aux. 助动词（构成疑问句和否定句）；（代替动词）；（用于加强语气） n. （口语）事件；（主英国口语）诈骗；（主英国、新西兰口语）宴会；（口语）必须做到的事情"
    },
    {
        "word": "dock",
        "definition": "n. 码头；船坞；被告席；尾巴的骨肉部分 vt. 使靠码头；剪短 vi. 入船坞"
    },
    {
        "word": "doctor",
        "definition": "vt. 修理；篡改，伪造；为…治病；授以博士学位 n. 医生；博士 vi. 就医；行医"
    },
    {
        "word": "doctorate",
        "definition": "n. 博士学位；博士头衔"
    },
    {
        "word": "doctoral",
        "definition": "n. 博士论文 adj. 博士的；博士学位的；有博士学位的"
    },
    {
        "word": "document",
        "definition": "n. 文件，公文； 文档；证件 vt. 用文件证明"
    },
    {
        "word": "documentary",
        "definition": "n. 纪录片 adj. 记录的；文件的；记实的"
    },
    {
        "word": "dog",
        "definition": "n. 狗；丑女人；卑鄙的人；(俚)朋友 vt. 跟踪；尾随"
    },
    {
        "word": "doll",
        "definition": "n. 洋娃娃；玩偶；无头脑的美丽女人 vt. 把…打扮得花枝招展"
    },
    {
        "word": "dollar",
        "definition": "n. 美元"
    },
    {
        "word": "dolphin",
        "definition": "n. 海豚"
    },
    {
        "word": "domestic",
        "definition": "n. 国货；佣人 adj. 国内的；家庭的；驯养的；一心只管家务的"
    },
    {
        "word": "dominate",
        "definition": "vt. 控制；支配；占优势；在…中占主要地位 vi. 占优势；处于支配地位"
    },
    {
        "word": "domination",
        "definition": "n. 控制；支配"
    },
    {
        "word": "dominance",
        "definition": "n. 优势；统治；支配"
    },
    {
        "word": "dominant",
        "definition": "n. 显性 adj. 显性的；占优势的；支配的，统治的"
    },
    {
        "word": "donate",
        "definition": "n. 捐赠；捐献 vt. 捐赠；捐献 vi. 捐赠；捐献"
    },
    {
        "word": "donation",
        "definition": "n. 捐款，捐赠物；捐赠"
    },
    {
        "word": "donor",
        "definition": "n. 捐赠者；供者；赠送人 adj. 捐献的；经人工授精出生的"
    },
    {
        "word": "donkey",
        "definition": "n. 驴子；傻瓜；顽固的人"
    },
    {
        "word": "doom",
        "definition": "n. 厄运；死亡；判决；世界末日 vt. 注定；判决；使失败"
    },
    {
        "word": "door",
        "definition": "n. 门；家，户；门口；通道"
    },
    {
        "word": "dormitory",
        "definition": "n. 宿舍，学生宿舍 adj. 住宅区的"
    },
    {
        "word": "dorm",
        "definition": "n. 宿舍（等于dormitory）"
    },
    {
        "word": "dose",
        "definition": "n. 剂量；一剂，一服 vt. 给药；给…服药 vi. 服药"
    },
    {
        "word": "dosage",
        "definition": "n. 剂量，用量"
    },
    {
        "word": "dot",
        "definition": "n. 点，圆点；嫁妆 vt. 加小点于 vi. 打上点"
    },
    {
        "word": "double",
        "definition": "n. 两倍；双精度型 adj. 双重的；两倍的 vt. 使加倍 adv. 双重地；两倍地；弓身地 vi. 加倍，加倍努力；快步走"
    },
    {
        "word": "doubt",
        "definition": "n. 怀疑；疑问；疑惑 v. 怀疑；不信；恐怕；拿不准"
    },
    {
        "word": "doubtful",
        "definition": "adj. 可疑的；令人生疑的；疑心的；不能确定的"
    },
    {
        "word": "doubtless",
        "definition": "adj. 无疑的；确定的 adv. 无疑地；确定地；大概，多半"
    },
    {
        "word": "dove",
        "definition": "n. 鸽子；鸽派人士 v. 潜水（dive的过去式）"
    },
    {
        "word": "down",
        "definition": "prep. 沿着，往下 n. 软毛，绒毛； 开阔的高地 adj. 向下的 vt. 打倒，击败 adv. 向下，下去；在下面 vi. 下降；下去"
    },
    {
        "word": "download",
        "definition": "vt.  下载"
    },
    {
        "word": "downstairs",
        "definition": "n. 楼下 adj. 楼下的 adv. 在楼下"
    },
    {
        "word": "downtown",
        "definition": "n. 市中心区；三分线以外 adj. 市中心的 adv. 往闹市区；在市区"
    },
    {
        "word": "downward",
        "definition": "adj. 向下的，下降的 adv. 向下"
    },
    {
        "word": "downwards",
        "definition": "adv. 向下，往下"
    },
    {
        "word": "dozen",
        "definition": "n. 十二个，一打 adj. 一打的"
    },
    {
        "word": "draft",
        "definition": "n. 汇票；草稿；选派；（尤指房间、烟囱、炉子等供暖系统中的）（小股）气流 vt. 起草；制定；征募 vi. 拟稿；绘样；作草图 adj. 初步画出或（写出）的；（设计、草图、提纲或版本）正在起草中的，草拟的；以草稿形式的；草图的"
    },
    {
        "word": "drag",
        "definition": "n. 拖；拖累 vi. 拖曳；缓慢而吃力地行进 vt. 拖累；拖拉；缓慢而吃力地行进"
    },
    {
        "word": "dragon",
        "definition": "n. 龙；凶暴的人，凶恶的人；严厉而有警觉性的女人"
    },
    {
        "word": "drain",
        "definition": "n. 排水；下水道，排水管；消耗 vt. 喝光，耗尽；使流出；排掉水 vi. 排水；流干"
    },
    {
        "word": "drainage",
        "definition": "n. 排水；排水系统；污水；排水面积"
    },
    {
        "word": "drama",
        "definition": "n. 戏剧，戏剧艺术；剧本；戏剧性事件"
    },
    {
        "word": "dramatic",
        "definition": "adj. 戏剧的；急剧的；引人注目的；激动人心的"
    },
    {
        "word": "dramatically",
        "definition": "adv. 戏剧地；引人注目地 adv. 显著地，剧烈地"
    },
    {
        "word": "drastic",
        "definition": "n. 烈性泻药 adj. 激烈的；猛烈的"
    },
    {
        "word": "drastically",
        "definition": "adv. 彻底地；激烈地"
    },
    {
        "word": "draw",
        "definition": "n. 平局；抽签 vi. 拉；拖 vt. 画；拉；吸引"
    },
    {
        "word": "drawing",
        "definition": "n. 图画；牵引；素描术 v. 绘画；吸引（draw的ing形式）；拖曳"
    },
    {
        "word": "drawer",
        "definition": "n. 抽屉；开票人；出票人；起草者；酒馆侍"
    },
    {
        "word": "dream",
        "definition": "n. 梦想，愿望；梦 adj. 梦的；理想的；不切实际的 vt. 梦想；做梦；想到 vi. 梦想；做梦，梦见；想到"
    },
    {
        "word": "dreamy",
        "definition": "adj. 梦想的；空幻的；轻柔的；恍惚的"
    },
    {
        "word": "dress",
        "definition": "n. 连衣裙；女装 vt. 给…穿衣 vi. 穿衣"
    },
    {
        "word": "drift",
        "definition": "n. 漂流，漂移；趋势；漂流物 vi. 漂流，漂移；漂泊 vt. 使…漂流；使…受风吹积"
    },
    {
        "word": "drill",
        "definition": "n. 训练；钻孔机；钻子；播种机 vt. 钻孔；训练；条播 vi. 钻孔；训练"
    },
    {
        "word": "drink",
        "definition": "n. 酒，饮料；喝酒 vt. 喝，饮；吸收；举杯庆贺 vi. 喝酒；饮水；干杯"
    },
    {
        "word": "drip",
        "definition": "n. 水滴，滴水声；静脉滴注；使人厌烦的人 vt. 使滴下；溢出，发出 vi. 滴下；充满；漏下"
    },
    {
        "word": "drive",
        "definition": "n. 驱动器；驾车； 内驱力，推进力；快车道 vi. 开车；猛击；飞跑 vt. 推动，发动（机器等）；驾驶（马车，汽车等）；驱赶"
    },
    {
        "word": "driver",
        "definition": "n. 驾驶员；驱动程序；起子；传动器"
    },
    {
        "word": "drop",
        "definition": "n. 滴；落下；空投；微量；滴剂 vt. 滴；使降低；使终止；随口漏出 vi. 下降；终止"
    },
    {
        "word": "dropout",
        "definition": "n. 中途退学；辍学学生"
    },
    {
        "word": "drought",
        "definition": "n. 干旱；缺乏"
    },
    {
        "word": "drown",
        "definition": "vt. 淹没；把…淹死 vi. 淹死；溺死"
    },
    {
        "word": "drug",
        "definition": "n. 药；毒品；麻醉药；滞销货 vt. 使服麻醉药；使服毒品；掺麻醉药于 vi. 吸毒"
    },
    {
        "word": "drum",
        "definition": "n. 鼓；鼓声 vi. 击鼓；大力争取 vt. 击鼓；大力争取"
    },
    {
        "word": "drunk",
        "definition": "v. 喝酒（drink的过去分词） adj. 喝醉了的"
    },
    {
        "word": "drunken",
        "definition": "adj. 喝醉的；酒醉的；常醉的"
    },
    {
        "word": "drunkard",
        "definition": "n. 酒鬼，醉汉"
    },
    {
        "word": "dry",
        "definition": "n. 干涸 adj. 干的；口渴的；枯燥无味的；禁酒的 vt. 把…弄干 vi. 变干"
    },
    {
        "word": "dryer",
        "definition": "n. 烘干机； 干燥剂"
    },
    {
        "word": "dual",
        "definition": "n. 双数；双数词 adj. 双的；双重的"
    },
    {
        "word": "duck",
        "definition": "n. 鸭子；鸭肉；（英）宝贝儿；零分 vt. 躲避；猛按…入水 vi. 闪避；没入水中"
    },
    {
        "word": "due",
        "definition": "n. 应付款；应得之物 adj. 到期的；预期的；应付的；应得的 adv. 正（置于方位词前）"
    },
    {
        "word": "duly",
        "definition": "adv. 适当地；充分地；按时地"
    },
    {
        "word": "dull",
        "definition": "adj. 钝的；迟钝的；无趣的；呆滞的；阴暗的 vt. 使迟钝；使阴暗；缓和 vi. 减少；变迟钝"
    },
    {
        "word": "dumb",
        "definition": "adj. 哑的，无说话能力的；不说话的，无声音的"
    },
    {
        "word": "dump",
        "definition": "n. 垃圾场；仓库；无秩序地累积 vt. 倾倒；倾卸；丢下，卸下；摆脱，扔弃；倾销 vi. 倒垃圾；突然跌倒或落下；卸货；转嫁（责任等）"
    },
    {
        "word": "durable",
        "definition": "n. 耐用品 adj. 耐用的，持久的"
    },
    {
        "word": "durability",
        "definition": "n. 耐久性；坚固；耐用年限"
    },
    {
        "word": "duration",
        "definition": "n. 持续，持续的时间，期间 音长，音延"
    },
    {
        "word": "during",
        "definition": "prep. 在…的时候，在…的期间"
    },
    {
        "word": "dusk",
        "definition": "n. 黄昏，薄暮；幽暗，昏暗 vt. 使变微暗 adj. 微暗的 vi. 变微暗"
    },
    {
        "word": "dust",
        "definition": "n. 灰尘；尘埃；尘土 vt. 撒；拂去灰尘 vi. 拂去灰尘；化为粉末"
    },
    {
        "word": "dusty",
        "definition": "adj. 落满灰尘的"
    },
    {
        "word": "duty",
        "definition": "n. 责任； 关税；职务"
    },
    {
        "word": "dye",
        "definition": "n. 染料；染色 vt. 染；把…染上颜色 vi. 被染色"
    },
    {
        "word": "dynamic",
        "definition": "n. 动态；动力 adj. 动态的；动力的；动力学的；有活力的"
    },
    {
        "word": "dynamics",
        "definition": "n. 动力学，力学"
    },
    {
        "word": "dynasty",
        "definition": "n. 王朝，朝代"
    },
    {
        "word": "each",
        "definition": "adj. 每；各自的 pron. 每个；各自 adv. 每个；各自"
    },
    {
        "word": "eager",
        "definition": "adj. 渴望的；热切的；热心的"
    },
    {
        "word": "eagle",
        "definition": "n. 鹰；鹰状标饰"
    },
    {
        "word": "ear",
        "definition": "n. 耳朵；穗；听觉；倾听 vi. （美俚）听见；抽穗"
    },
    {
        "word": "early",
        "definition": "adj. 早期的；早熟的 adv. 提早；在初期"
    },
    {
        "word": "earn",
        "definition": "vt. 赚，赚得；获得，挣得；使得到；博得"
    },
    {
        "word": "earnings",
        "definition": "n. 收入"
    },
    {
        "word": "earnest",
        "definition": "n. 认真；定金；诚挚 adj. 认真的，热心的；重要的"
    },
    {
        "word": "earth",
        "definition": "n. 地球；地表，陆地；土地，土壤；尘事，俗事；兽穴 vt. 把（电线） 接地；盖（土）；追赶入洞穴 vi. 躲进地洞"
    },
    {
        "word": "earthquake",
        "definition": "n. 地震；大动荡"
    },
    {
        "word": "ease",
        "definition": "n. 轻松，舒适；安逸，悠闲 vt. 减轻，缓和；使安心 vi. 减轻，缓和；放松；灵活地移动"
    },
    {
        "word": "east",
        "definition": "n. 东方；东风；东方国家 adj. 东方的；向东的；从东方来的 adv. 向东方，在东方"
    },
    {
        "word": "eastern",
        "definition": "n. 东方人；（美国）东部地区的人 adj. 东方的；朝东的；东洋的"
    },
    {
        "word": "easy",
        "definition": "adj. 容易的；舒适的 vt. 发出停划命令 adv. 不费力地，从容地 vi. 停止划桨"
    },
    {
        "word": "easily",
        "definition": "adv. 容易地；无疑地"
    },
    {
        "word": "easy-going",
        "definition": "adj. 随和的，容易相处的"
    },
    {
        "word": "eat",
        "definition": "vt. 吃，喝；腐蚀；烦扰 vi. 进食；腐蚀，侵蚀"
    },
    {
        "word": "echo",
        "definition": "n. 回音；效仿 vt. 反射；重复 vi. 随声附和；发出回声"
    },
    {
        "word": "ecology",
        "definition": "n. 生态学；社会生态学"
    },
    {
        "word": "ecological",
        "definition": "adj. 生态的，生态学的"
    },
    {
        "word": "economics",
        "definition": "n. 经济学；国家的经济状况"
    },
    {
        "word": "economist",
        "definition": "n. 经济学者；节俭的人"
    },
    {
        "word": "economy",
        "definition": "n. 经济；节约；理财"
    },
    {
        "word": "economic",
        "definition": "adj. 经济的，经济上的；经济学的"
    },
    {
        "word": "economical",
        "definition": "adj. 经济的；节约的；合算的"
    },
    {
        "word": "edge",
        "definition": "n. 边缘；优势；刀刃；锋利 vt. 使锐利；将…开刃；给…加上边 vi. 缓缓移动；侧着移动"
    },
    {
        "word": "edit",
        "definition": "vt. 编辑；校订 n. 编辑工作"
    },
    {
        "word": "editor",
        "definition": "n. 编者，编辑；社论撰写人；编辑装置"
    },
    {
        "word": "edition",
        "definition": "n. 版本 版次 集"
    },
    {
        "word": "editorial",
        "definition": "n. 社论 adj. 编辑的；社论的"
    },
    {
        "word": "educate",
        "definition": "vt. 教育；培养；训练 vi. 教育；训练"
    },
    {
        "word": "education",
        "definition": "n. 教育；培养；教育学"
    },
    {
        "word": "educational",
        "definition": "adj. 教育的；有教育意义的"
    },
    {
        "word": "educator",
        "definition": "n. 教育家；教育工作者；教师"
    },
    {
        "word": "effect",
        "definition": "n. 影响；效果；作用 vt. 产生；达到目的"
    },
    {
        "word": "effective",
        "definition": "adj. 有效的，起作用的；实际的，实在的；给人深刻印象"
    },
    {
        "word": "efficient",
        "definition": "adj. 有效率的；有能力的；生效的"
    },
    {
        "word": "efficiency",
        "definition": "n. 效率；效能；功效"
    },
    {
        "word": "effort",
        "definition": "n. 努力；成就"
    },
    {
        "word": "egg",
        "definition": "n. 蛋；卵子；家伙；鸡蛋 vt. 煽动；怂恿"
    },
    {
        "word": "eggplant",
        "definition": "n. 茄子 adj. 深紫色的"
    },
    {
        "word": "eight",
        "definition": "num. 八；八个；第八 n. 八字形 adj. 八的"
    },
    {
        "word": "eighteen",
        "definition": "n. 十八，十八个 num. 十八 adj. 十八个的，十八的"
    },
    {
        "word": "eighth",
        "definition": "num. 第八；八分之一 adj. 第八的；八分之一的"
    },
    {
        "word": "eighty",
        "definition": "num. 八十 n. 八十；八十岁；八十年代 adj. 八十的，八十个的；八十岁的"
    },
    {
        "word": "either",
        "definition": "conj. 也（用于否定句或否定词组后）；根本 prep. 任何一个 adj. 两者之中任一的；两者之中每一的 pron. 任一，两方，随便哪一个；两者中的一个或另一个"
    },
    {
        "word": "elbow",
        "definition": "n. 肘部；弯头；扶手 vt. 推挤；用手肘推开"
    },
    {
        "word": "elder",
        "definition": "n. 老人；长辈；年长者；父辈 adj. 年长的；年龄较大的；资格老的"
    },
    {
        "word": "elderly",
        "definition": "adj. 上了年纪的；过了中年的；稍老的"
    },
    {
        "word": "elect",
        "definition": "n. 被选的人；特殊阶层；上帝的选民 adj. 选出的；当选的；卓越的 vi. 作出选择；进行选举 vt. 选举；选择；推选"
    },
    {
        "word": "election",
        "definition": "n. 选举；当选；选择权；上帝的选拔"
    },
    {
        "word": "elective",
        "definition": "adj. 选修的；选举的；选任的 n. 选修课程"
    },
    {
        "word": "electricity",
        "definition": "n. 电力；电流；强烈的紧张情绪"
    },
    {
        "word": "electric",
        "definition": "n. 电；电气车辆；带电体 adj. 电的；电动的；发电的；导电的；令人震惊的"
    },
    {
        "word": "electrical",
        "definition": "adj. 有关电的；电气科学的"
    },
    {
        "word": "electrician",
        "definition": "n. 电工；电气技师"
    },
    {
        "word": "electron",
        "definition": "n. 电子"
    },
    {
        "word": "electronic",
        "definition": "adj. 电子的 n. 电子电路；电子器件"
    },
    {
        "word": "electronically",
        "definition": "adv. 电子地"
    },
    {
        "word": "electronics",
        "definition": "n. 电子学；电子工业"
    },
    {
        "word": "elegant",
        "definition": "adj. 高雅的，优雅的；讲究的；简炼的；简洁的"
    },
    {
        "word": "elegance",
        "definition": "n. 典雅；高雅"
    },
    {
        "word": "element",
        "definition": "n. 元素；要素；原理；成分；自然环境"
    },
    {
        "word": "elementary",
        "definition": "adj. 基本的；初级的； 元素的"
    },
    {
        "word": "elephant",
        "definition": "n. 象；大号图画纸"
    },
    {
        "word": "elevate",
        "definition": "vt. 提升；举起；振奋情绪等；提升…的职位"
    },
    {
        "word": "elevation",
        "definition": "n. 高地；海拔；提高；崇高；正面图"
    },
    {
        "word": "elevator",
        "definition": "n. 电梯；升降机；升降舵；起卸机"
    },
    {
        "word": "eleven",
        "definition": "num. 十一；十一个 n. 十一；十一个 adj. 十一的；十一个的"
    },
    {
        "word": "eliminate",
        "definition": "vt. 消除；排除"
    },
    {
        "word": "elimination",
        "definition": "n. 消除；淘汰；除去"
    },
    {
        "word": "elite",
        "definition": "n. 精英；精华；中坚分子"
    },
    {
        "word": "else",
        "definition": "adj. 别的；其他的 adv. 其他；否则；另外"
    },
    {
        "word": "elsewhere",
        "definition": "adv. 在别处；到别处"
    },
    {
        "word": "email",
        "definition": "n. 电子信函 vt. 给…发电子邮件"
    },
    {
        "word": "embarrass",
        "definition": "vt. 使局促不安；使困窘；阻碍"
    },
    {
        "word": "embarrassment",
        "definition": "n. 窘迫，难堪；使人为难的人或事物；拮据"
    },
    {
        "word": "embassy",
        "definition": "n. 大使馆；大使馆全体人员"
    },
    {
        "word": "embrace",
        "definition": "n. 拥抱 vt. 拥抱；信奉，皈依；包含 vi. 拥抱"
    },
    {
        "word": "emerge",
        "definition": "vi. 浮现；摆脱；暴露"
    },
    {
        "word": "emergence",
        "definition": "n. 出现，浮现；发生；露头"
    },
    {
        "word": "emergency",
        "definition": "n. 紧急情况；突发事件；非常时刻 adj. 紧急的；备用的"
    },
    {
        "word": "emit",
        "definition": "vt. 发出，放射；发行；发表"
    },
    {
        "word": "emission",
        "definition": "n. （光、热等的）发射，散发；喷射；发行"
    },
    {
        "word": "emotion",
        "definition": "n. 情感；情绪"
    },
    {
        "word": "emotional",
        "definition": "adj. 情绪的；易激动的；感动人的"
    },
    {
        "word": "emperor",
        "definition": "n. 皇帝，君主"
    },
    {
        "word": "empress",
        "definition": "n. 皇后；女皇"
    },
    {
        "word": "emphasis",
        "definition": "n. 重点；强调；加强语气"
    },
    {
        "word": "emphasize",
        "definition": "vt. 强调，着重"
    },
    {
        "word": "emphasise",
        "definition": "vt. （英）强调；加强…的语气（等于emphasize ）"
    },
    {
        "word": "emphatic",
        "definition": "adj. 着重的；加强语气的；显著的"
    },
    {
        "word": "empire",
        "definition": "n. 帝国；帝王统治，君权"
    },
    {
        "word": "employ",
        "definition": "n. 使用；雇用 vt. 使用，采用；雇用；使忙于，使从事于"
    },
    {
        "word": "employment",
        "definition": "n. 使用；职业；雇用"
    },
    {
        "word": "employer",
        "definition": "n. 雇主，老板"
    },
    {
        "word": "employee",
        "definition": "n. 雇员；从业员工"
    },
    {
        "word": "empty",
        "definition": "n. 空车；空的东西 adj. 空的；无意义的；无知的；徒劳的 vt. 使失去；使…成为空的 vi. 成为空的；流空"
    },
    {
        "word": "emptiness",
        "definition": "n. 空虚；无知"
    },
    {
        "word": "enable",
        "definition": "vt. 使能够，使成为可能；授予权利或方法"
    },
    {
        "word": "encounter",
        "definition": "n. 遭遇，偶然碰见 vi. 遭遇；偶然相遇 vt. 遭遇，邂逅；遇到"
    },
    {
        "word": "encourage",
        "definition": "vt. 鼓励，怂恿；激励；支持"
    },
    {
        "word": "encouragement",
        "definition": "n. 鼓励"
    },
    {
        "word": "encouraging",
        "definition": "v. 鼓励，支持（encourage的ing形式） adj. 令人鼓舞的；鼓励的，奖励的"
    },
    {
        "word": "end",
        "definition": "n. 结束；目标；尽头；末端；死亡 vi. 结束，终止；终结 vt. 结束，终止；终结"
    },
    {
        "word": "ending",
        "definition": "n. 结局；结尾"
    },
    {
        "word": "endless",
        "definition": "adj. 无止境的；连续的；环状的；漫无目的的"
    },
    {
        "word": "endanger",
        "definition": "vt. 危及；使遭到危险"
    },
    {
        "word": "endure",
        "definition": "vt. 忍耐；容忍 vi. 忍耐；持续"
    },
    {
        "word": "endurance",
        "definition": "n. 忍耐力；忍耐；持久；耐久"
    },
    {
        "word": "enemy",
        "definition": "n. 敌人，仇敌；敌军 adj. 敌人的，敌方的"
    },
    {
        "word": "energy",
        "definition": "n.  能量；精力；活力；精神"
    },
    {
        "word": "energetic",
        "definition": "adj. 精力充沛的；积极的；有力的"
    },
    {
        "word": "energetically",
        "definition": "adv. 积极地；精力充沛地"
    },
    {
        "word": "enforce",
        "definition": "vt. 实施，执行；强迫，强制"
    },
    {
        "word": "enforcement",
        "definition": "n. 执行，实施；强制"
    },
    {
        "word": "engage",
        "definition": "vi. 从事；答应，保证；交战；啮合 vt. 吸引，占用；使参加；雇佣；使订婚；预定"
    },
    {
        "word": "engagement",
        "definition": "n. 婚约；约会；交战；诺言 n. 参与度（指用户点赞、转发、评论、下载文档、观看视频、咨询等交互行为）"
    },
    {
        "word": "engine",
        "definition": "n. 引擎，发动机；机车，火车头；工具"
    },
    {
        "word": "engineer",
        "definition": "n. 工程师；工兵；火车司机 vt. 设计；策划；精明地处理 vi. 设计；建造"
    },
    {
        "word": "engineering",
        "definition": "n. 工程，工程学 v. 设计；管理（engineer的ing形式）；建造"
    },
    {
        "word": "enhance",
        "definition": "vt. 提高；加强；增加"
    },
    {
        "word": "enhancement",
        "definition": "n. 增加；放大"
    },
    {
        "word": "enjoy",
        "definition": "vt. 欣赏，享受；喜爱；使过得快活"
    },
    {
        "word": "enjoyable",
        "definition": "adj. 快乐的；有乐趣的；令人愉快的"
    },
    {
        "word": "enjoyment",
        "definition": "n. 享受；乐趣；享有"
    },
    {
        "word": "enlarge",
        "definition": "vt. 扩大；使增大；扩展 vi. 扩大；放大；详述"
    },
    {
        "word": "enlighten",
        "definition": "vt. 启发，启蒙；教导，开导；照耀"
    },
    {
        "word": "enlightenment",
        "definition": "n. 启迪；启蒙运动；教化"
    },
    {
        "word": "enlightening",
        "definition": "adj. 使人领悟的；有启发作用的 v. 启蒙；通知（enlighten的ing形式）"
    },
    {
        "word": "enormous",
        "definition": "adj. 庞大的，巨大的；凶暴的，极恶的"
    },
    {
        "word": "enough",
        "definition": "n. 很多；充足 adj. 充足的 adv. 足够地，充足地 int. 够了！"
    },
    {
        "word": "enquire",
        "definition": "vi. 询问；调查；问候（等于inquire） vt. 询问；打听"
    },
    {
        "word": "enquiry",
        "definition": "n.  询问， 询盘"
    },
    {
        "word": "enrich",
        "definition": "vt. 使充实；使肥沃；使富足"
    },
    {
        "word": "enrol",
        "definition": "vi. 注册；参军 vt. 登记；卷起；入学；使入会"
    },
    {
        "word": "enroll",
        "definition": "vi. 参加；登记；注册；记入名册 vt. 登记；使加入；把...记入名册；使入伍"
    },
    {
        "word": "enrolment",
        "definition": "n. 登记，注册；入学"
    },
    {
        "word": "enrollment",
        "definition": "n. 登记；入伍"
    },
    {
        "word": "ensure",
        "definition": "vt. 保证，确保；使安全"
    },
    {
        "word": "enter",
        "definition": "n.  输入；回车 vt. 进入；开始；参加 vi. 参加，登场；进去"
    },
    {
        "word": "entrance",
        "definition": "n. 入口；进入 vt. 使出神，使入迷"
    },
    {
        "word": "entry",
        "definition": "n. 进入；入口；条目；登记；报关手续；对土地的侵占"
    },
    {
        "word": "enterprise",
        "definition": "n. 企业；事业；进取心；事业心"
    },
    {
        "word": "enterprising",
        "definition": "adj. 有事业心的；有进取心的；有魄力的；有胆量的"
    },
    {
        "word": "entertain",
        "definition": "vt. 娱乐；招待；怀抱；容纳 vi. 款待"
    },
    {
        "word": "entertainment",
        "definition": "n. 娱乐；消遣；款待"
    },
    {
        "word": "entertaining",
        "definition": "v. 款待（entertain的ing形式） adj. 令人愉快的"
    },
    {
        "word": "enthusiasm",
        "definition": "n. 热心，热忱，热情"
    },
    {
        "word": "enthusiastic",
        "definition": "adj. 热情的；热心的；狂热的"
    },
    {
        "word": "enthusiastically",
        "definition": "adv. 热心地；满腔热情地"
    },
    {
        "word": "enthusiast",
        "definition": "n. 狂热者，热心家"
    },
    {
        "word": "entire",
        "definition": "adj. 全部的，整个的；全体的"
    },
    {
        "word": "entirety",
        "definition": "n. 全部；完全"
    },
    {
        "word": "entitle",
        "definition": "vt. 称做…；定名为…；给…称号；使…有权利"
    },
    {
        "word": "entrepreneur",
        "definition": "n. 企业家；承包人；主办者"
    },
    {
        "word": "entrepreneurial",
        "definition": "adj. 企业家的，创业者的；中间商的"
    },
    {
        "word": "envelope",
        "definition": "n. 信封，封皮；包膜； 包层；包迹"
    },
    {
        "word": "environment",
        "definition": "n. 环境，外界"
    },
    {
        "word": "environmental",
        "definition": "adj. 环境的，周围的；有关环境的"
    },
    {
        "word": "environmentalist",
        "definition": "n. 环保人士；环境论者；研究环境问题的专家"
    },
    {
        "word": "envy",
        "definition": "n. 嫉妒，妒忌；羡慕 vt. 嫉妒，妒忌；羡慕 vi. 感到妒忌；显示出妒忌"
    },
    {
        "word": "envious",
        "definition": "adj. 羡慕的；嫉妒的"
    },
    {
        "word": "episode",
        "definition": "n. 插曲；一段情节；插话；有趣的事件"
    },
    {
        "word": "equal",
        "definition": "n. 对手；匹敌；同辈；相等的事物 adj. 平等的；相等的；胜任的 vt. 等于；比得上"
    },
    {
        "word": "equally",
        "definition": "adv. 同样地；相等地，平等地；公平地"
    },
    {
        "word": "equality",
        "definition": "n. 平等；相等； 等式"
    },
    {
        "word": "equip",
        "definition": "vt. 装备，配备"
    },
    {
        "word": "equipment",
        "definition": "n. 设备，装备；器材"
    },
    {
        "word": "equivalent",
        "definition": "n. 等价物，相等物 adj. 等价的，相等的；同意义的"
    },
    {
        "word": "equivalence",
        "definition": "n. 等值；相等"
    },
    {
        "word": "era",
        "definition": "n. 时代；年代；纪元"
    },
    {
        "word": "erase",
        "definition": "vt. 抹去；擦除 vi. 被擦去，被抹掉"
    },
    {
        "word": "eraser",
        "definition": "n. 橡皮；擦除器； 清除器"
    },
    {
        "word": "err",
        "definition": "vi. 犯错；做错；犯罪；走上歧途"
    },
    {
        "word": "error",
        "definition": "n. 误差；错误；过失"
    },
    {
        "word": "erroneous",
        "definition": "adj. 错误的；不正确的"
    },
    {
        "word": "escape",
        "definition": "n. 逃跑；逃亡；逃走；逃跑工具或方法；野生种；泄漏 vi. 逃脱；避开；溜走；（气体，液体等）漏出；（未受伤或只受了一点伤害而）逃脱；声音（不自觉地）由…发出 vt. 逃避，避开，避免；被忘掉；被忽视"
    },
    {
        "word": "especially",
        "definition": "adv. 特别；尤其；格外"
    },
    {
        "word": "essay",
        "definition": "n. 散文；试图；随笔 vt. 尝试；对…做试验"
    },
    {
        "word": "essayist",
        "definition": "n. 随笔作家，散文家；评论家"
    },
    {
        "word": "essence",
        "definition": "n. 本质，实质；精华；香精"
    },
    {
        "word": "essential",
        "definition": "n. 本质；要素；要点；必需品 adj. 基本的；必要的；本质的；精华的"
    },
    {
        "word": "establish",
        "definition": "vi. 植物定植 vt. 建立；创办；安置"
    },
    {
        "word": "establishment",
        "definition": "n. 确立，制定；公司；设施"
    },
    {
        "word": "estate",
        "definition": "n. 房地产；财产；身份"
    },
    {
        "word": "estimate",
        "definition": "n. 估计，估价；判断，看法 vt. 估计，估量；判断，评价 vi. 估计，估价"
    },
    {
        "word": "estimation",
        "definition": "n. 估计；尊重"
    },
    {
        "word": "eternal",
        "definition": "adj. 永恒的；不朽的"
    },
    {
        "word": "eternity",
        "definition": "n. 来世，来生；不朽；永世；永恒"
    },
    {
        "word": "ethic",
        "definition": "n. 伦理；道德规范 adj. 伦理的；道德的（等于ethical）"
    },
    {
        "word": "ethics",
        "definition": "n. 伦理学；伦理观；道德标准"
    },
    {
        "word": "ethnic",
        "definition": "adj. 种族的；人种的"
    },
    {
        "word": "euro",
        "definition": "n. 欧元（欧盟的统一货币单位）"
    },
    {
        "word": "evaluate",
        "definition": "vt. 评价；估价；求…的值 vi. 评价；估价"
    },
    {
        "word": "evaluation",
        "definition": "n. 评价； 评估；估价；求值"
    },
    {
        "word": "eve",
        "definition": "n. 前夕；傍晚；重大事件关头"
    },
    {
        "word": "even",
        "definition": "adj.  偶数的；平坦的；相等的 adv. 甚至；即使；还；实际上 vt. 使平坦；使相等 vi. 变平；变得可比较；成为相等"
    },
    {
        "word": "evenly",
        "definition": "adv. 均匀地；平衡地；平坦地；平等地"
    },
    {
        "word": "evening",
        "definition": "n. 晚上；傍晚；（联欢性的）晚会；后期 adj. 在晚上的；为晚上的；晚上用的 int. 晚上好（等于good evening）"
    },
    {
        "word": "event",
        "definition": "n. 事件，大事；项目；结果"
    },
    {
        "word": "eventful",
        "definition": "adj. 多事的；重要的；多变故的；重大的"
    },
    {
        "word": "eventually",
        "definition": "adv. 最后，终于"
    },
    {
        "word": "eventual",
        "definition": "adj. 最后的，结果的；可能的；终于的"
    },
    {
        "word": "eventuality",
        "definition": "n. 可能性；可能发生的事；不测的事"
    },
    {
        "word": "ever",
        "definition": "adv. 永远；曾经；究竟"
    },
    {
        "word": "every",
        "definition": "adj. 每一的，每个的；每隔…的"
    },
    {
        "word": "everybody",
        "definition": "pron. 每个人；人人"
    },
    {
        "word": "everyday",
        "definition": "n. 平时；寻常日子 adj. 每天的，日常的"
    },
    {
        "word": "everyone",
        "definition": "n. 每个人 pron. 每个人；人人"
    },
    {
        "word": "everything",
        "definition": "pron. 每件事物；最重要的东西；（有关的）一切；万事"
    },
    {
        "word": "everywhere",
        "definition": "n. 每个地方 adv. 到处"
    },
    {
        "word": "evident",
        "definition": "adj. 明显的；明白的"
    },
    {
        "word": "evidence",
        "definition": "n. 证据，证明；迹象；明显 vt. 证明"
    },
    {
        "word": "evil",
        "definition": "n. 罪恶，邪恶；不幸 adj. 邪恶的；不幸的；有害的；讨厌的"
    },
    {
        "word": "evolve",
        "definition": "vi. 发展，进展；进化；逐步形成 vt. 发展，进化；进化；使逐步形成；推断出"
    },
    {
        "word": "evolution",
        "definition": "n. 演变；进化论；进展"
    },
    {
        "word": "evolutionary",
        "definition": "adj. 进化的；发展的；渐进的"
    },
    {
        "word": "exact",
        "definition": "adj. 准确的，精密的；精确的 vt. 要求；强求；急需 vi. 勒索钱财"
    },
    {
        "word": "exaggerate",
        "definition": "vt. 使扩大；使增大 vi. 夸大；夸张"
    },
    {
        "word": "exaggeration",
        "definition": "n. 夸张；夸大之词；夸张的手法"
    },
    {
        "word": "examine",
        "definition": "vt. 检查；调查； 检测；考试 vi. 检查；调查"
    },
    {
        "word": "exam",
        "definition": "n. 考试；测验"
    },
    {
        "word": "examination",
        "definition": "n. 考试；检查；查问"
    },
    {
        "word": "examiner",
        "definition": "n. 检验员；主考人； 审查员"
    },
    {
        "word": "examinee",
        "definition": "n. 应试者；受审查者；受检查者"
    },
    {
        "word": "example",
        "definition": "n. 例子；榜样 vt. 作为…的例子；为…做出榜样 vi. 举例"
    },
    {
        "word": "exemplary",
        "definition": "adj. 典范的；惩戒性的；可仿效的"
    },
    {
        "word": "exemplify",
        "definition": "vt. 例证；例示"
    },
    {
        "word": "exceed",
        "definition": "vt. 超过；胜过 vi. 超过其他"
    },
    {
        "word": "exceedingly",
        "definition": "adv. 非常；极其；极度地；极端"
    },
    {
        "word": "excel",
        "definition": "vt. 超过；擅长 vi. (在某方面)胜过(或超过)别人"
    },
    {
        "word": "excellent",
        "definition": "adj. 卓越的；极好的；杰出的"
    },
    {
        "word": "excellence",
        "definition": "n. 优秀；美德；长处"
    },
    {
        "word": "except",
        "definition": "conj. 除了；要不是 prep. 除…之外 vt. 不计；把…除外 vi. 反对"
    },
    {
        "word": "exception",
        "definition": "n. 例外；异议"
    },
    {
        "word": "exceptional",
        "definition": "n. 超常的学生 adj. 异常的，例外的"
    },
    {
        "word": "excess",
        "definition": "n. 超过，超额；过度，过量；无节制 adj. 额外的，过量的；附加的"
    },
    {
        "word": "excessive",
        "definition": "adj. 过多的，极度的；过分的"
    },
    {
        "word": "exchange",
        "definition": "n. 交换；交流；交易所；兑换 vt. 交换；交易；兑换 vi. 交换；交易；兑换"
    },
    {
        "word": "excite",
        "definition": "vt. 激起；刺激…，使…兴奋 vi. 激动"
    },
    {
        "word": "exciting",
        "definition": "adj. 令人兴奋的；使人激动的 v. 激动；刺激（excite的ing形式）；唤起"
    },
    {
        "word": "excitement",
        "definition": "n. 兴奋；刺激；令人兴奋的事物"
    },
    {
        "word": "exclaim",
        "definition": "vt. 大声说出 vi. 呼喊，惊叫；大声叫嚷"
    },
    {
        "word": "exclamation",
        "definition": "n. 感叹；惊叫；惊叹词"
    },
    {
        "word": "exclamatory",
        "definition": "adj. 感叹的；惊叫的"
    },
    {
        "word": "exclude",
        "definition": "vt. 排除；排斥；拒绝接纳；逐出"
    },
    {
        "word": "exclusion",
        "definition": "n. 排除；排斥；驱逐；被排除在外的事物"
    },
    {
        "word": "exclusive",
        "definition": "n. 独家新闻；独家经营的项目；排外者 adj. 独有的；排外的；专一的"
    },
    {
        "word": "excursion",
        "definition": "n. 偏移；远足；短程旅行；离题；游览，游览团"
    },
    {
        "word": "excuse",
        "definition": "n. 借口；理由 vt. 原谅；为…申辩；给…免去 vi. 作为借口；请求宽恕；表示宽恕"
    },
    {
        "word": "execute",
        "definition": "vt. 实行；执行；处死"
    },
    {
        "word": "execution",
        "definition": "n. 执行，实行；完成；死刑"
    },
    {
        "word": "executive",
        "definition": "n. 总经理；执行委员会；执行者；经理主管人员 adj. 行政的；经营的；执行的，经营管理的"
    },
    {
        "word": "exercise",
        "definition": "n. 运动；练习；运用；操练；礼拜；典礼 vt. 锻炼；练习；使用；使忙碌；使惊恐 vi. 运动；练习"
    },
    {
        "word": "exert",
        "definition": "vt. 运用，发挥；施以影响"
    },
    {
        "word": "exertion",
        "definition": "n. 发挥；运用；努力"
    },
    {
        "word": "exhaust",
        "definition": "n. 排气；废气；排气装置 vt. 排出；耗尽；使精疲力尽；彻底探讨 vi. 排气"
    },
    {
        "word": "exhaustion",
        "definition": "n. 枯竭；耗尽；精疲力竭"
    },
    {
        "word": "exhaustive",
        "definition": "adj. 详尽的；彻底的；消耗的"
    },
    {
        "word": "exhibit",
        "definition": "n. 展览品；证据；展示会 vt. 展览；显示；提出（证据等） vi. 展出；开展览会"
    },
    {
        "word": "exhibition",
        "definition": "n. 展览，显示；展览会；展览品"
    },
    {
        "word": "exile",
        "definition": "n. 流放，充军；放逐，被放逐者；流犯 vt. 放逐，流放；使背井离乡"
    },
    {
        "word": "exist",
        "definition": "vi. 存在；生存；生活；继续存在"
    },
    {
        "word": "existence",
        "definition": "n. 存在，实在；生存，生活；存在物，实在物"
    },
    {
        "word": "existent",
        "definition": "n. 生存者；存在的事物 adj. 存在的；生存的"
    },
    {
        "word": "existing",
        "definition": "adj. 目前的；现存的 v. 存在（exist的现在分词）"
    },
    {
        "word": "exit",
        "definition": "n. 出口，通道；退场 vi. 退出；离去"
    },
    {
        "word": "expand",
        "definition": "vt. 扩张；使膨胀；详述 vi. 发展；张开，展开"
    },
    {
        "word": "expansion",
        "definition": "n. 膨胀；阐述；扩张物"
    },
    {
        "word": "expansive",
        "definition": "adj. 广阔的；扩张的；豪爽的"
    },
    {
        "word": "expect",
        "definition": "vi. 期待；预期 vt. 期望；指望；认为；预料"
    },
    {
        "word": "expectation",
        "definition": "n. 期待；预期；指望"
    },
    {
        "word": "expectancy",
        "definition": "n. 期望，期待"
    },
    {
        "word": "expel",
        "definition": "vt. 驱逐；开除"
    },
    {
        "word": "expend",
        "definition": "vt. 花费；消耗；用光；耗尽"
    },
    {
        "word": "expenditure",
        "definition": "n. 支出，花费；经费，消费额"
    },
    {
        "word": "expense",
        "definition": "n. 损失，代价；消费；开支 vt. 向…收取费用 vi. 被花掉"
    },
    {
        "word": "expensive",
        "definition": "adj. 昂贵的；花钱的"
    },
    {
        "word": "experience",
        "definition": "n. 经验；经历；体验 vt. 经验；经历；体验"
    },
    {
        "word": "experienced",
        "definition": "adj. 老练的，熟练的；富有经验的"
    },
    {
        "word": "experiment",
        "definition": "n. 实验，试验；尝试 vi. 尝试；进行实验"
    },
    {
        "word": "experimental",
        "definition": "adj. 实验的；根据实验的；试验性的"
    },
    {
        "word": "expert",
        "definition": "n. 专家；行家；能手 adj. 熟练的；内行的；老练的 vt. 当专家；在…中当行家"
    },
    {
        "word": "expertise",
        "definition": "n. 专门知识；专门技术；专家的意见"
    },
    {
        "word": "explain",
        "definition": "v. 说明；解释"
    },
    {
        "word": "explanation",
        "definition": "n. 说明，解释；辩解"
    },
    {
        "word": "explanatory",
        "definition": "adj. 解释的；说明的"
    },
    {
        "word": "explicit",
        "definition": "adj. 明确的；清楚的；直率的；详述的"
    },
    {
        "word": "explode",
        "definition": "vi. 爆炸，爆发；激增 vt. 使爆炸；爆炸；推翻"
    },
    {
        "word": "explosion",
        "definition": "n. 爆炸；爆发；激增"
    },
    {
        "word": "explosive",
        "definition": "n. 炸药；爆炸物 adj. 爆炸的；爆炸性的；爆发性的"
    },
    {
        "word": "exploit",
        "definition": "n. 勋绩；功绩 vt. 开发，开拓；剥削；开采"
    },
    {
        "word": "exploitation",
        "definition": "n. 开发，开采；利用；广告推销；剥削"
    },
    {
        "word": "explore",
        "definition": "vi. 探索；探测；探险 vt. 探索；探测；探险"
    },
    {
        "word": "exploration",
        "definition": "n. 探测；探究；踏勘"
    },
    {
        "word": "export",
        "definition": "n. 输出，出口；出口商品 vt. 输出，出口 vi. 输出物资"
    },
    {
        "word": "exportation",
        "definition": "n. 出口"
    },
    {
        "word": "expose",
        "definition": "vt. 揭露，揭发；使曝光；显示"
    },
    {
        "word": "exposure",
        "definition": "n. 暴露；曝光；揭露；陈列"
    },
    {
        "word": "express",
        "definition": "n. 快车，快递，专使；捷运公司 vt. 表达；快递 adj. 明确的；迅速的；专门的"
    },
    {
        "word": "expression",
        "definition": "n. 表现，表示，表达；表情，脸色，态度，腔调，声调；式，符号；词句，语句，措辞，说法"
    },
    {
        "word": "expressive",
        "definition": "adj. 表现的；有表现力的；表达…的"
    },
    {
        "word": "expressway",
        "definition": "n. （美）高速公路"
    },
    {
        "word": "extend",
        "definition": "vt. 延伸；扩大；推广；伸出；给予；使竭尽全力；对…估价 vi. 延伸；扩大；伸展；使疏开"
    },
    {
        "word": "extension",
        "definition": "n. 延长；延期；扩大；伸展；电话分机"
    },
    {
        "word": "extensive",
        "definition": "adj. 广泛的；大量的；广阔的"
    },
    {
        "word": "extended",
        "definition": "v. 延长；扩充（extend的过去分词） adj. 延伸的；扩大的；长期的；广大的"
    },
    {
        "word": "extent",
        "definition": "n. 程度；范围；长度"
    },
    {
        "word": "exterior",
        "definition": "n. 外部；表面；外型；外貌 adj. 外部的；表面的；外在的"
    },
    {
        "word": "external",
        "definition": "n. 外部；外观；外面 adj. 外部的；表面的； 外用的；外国的；外面的"
    },
    {
        "word": "extinguish",
        "definition": "vt. 熄灭；压制；偿清"
    },
    {
        "word": "extra",
        "definition": "n. 临时演员；号外；额外的事物；上等产品 adj. 额外的，另外收费的；特大的 adv. 特别地，非常；另外"
    },
    {
        "word": "extraordinary",
        "definition": "adj. 非凡的；特别的；离奇的；临时的；特派的"
    },
    {
        "word": "extreme",
        "definition": "n. 极端；末端；最大程度；极端的事物 adj. 极端的；极度的；偏激的；尽头的"
    },
    {
        "word": "extremity",
        "definition": "n. 极端；绝境；非常手段；手足"
    },
    {
        "word": "eye",
        "definition": "n. 眼睛；视力；眼光；见解，观点 vt. 注视，看"
    },
    {
        "word": "eyebrow",
        "definition": "n. 眉毛 v. 为…描眉；用皱眉蹙额迫使"
    },
    {
        "word": "eyesight",
        "definition": "n. 视力；目力"
    },
    {
        "word": "fable",
        "definition": "n. 寓言；无稽之谈 vt. 煞有介事地讲述；虚构 vi. 编寓言；虚构"
    },
    {
        "word": "fabric",
        "definition": "n. 织物；布；组织；构造；建筑物"
    },
    {
        "word": "face",
        "definition": "n. 脸；表面；面子；面容；外观；威信 vi. 向；朝 vt. 面对；面向；承认；抹盖"
    },
    {
        "word": "facial",
        "definition": "n. 美容，美颜；脸部按摩 adj. 面部的，表面的；脸的，面部用的"
    },
    {
        "word": "facility",
        "definition": "n. 设施；设备；容易；灵巧"
    },
    {
        "word": "facilitate",
        "definition": "vt. 促进；帮助；使容易"
    },
    {
        "word": "facilitation",
        "definition": "n. 简易化； 助长；容易"
    },
    {
        "word": "fact",
        "definition": "n. 事实；实际；真相"
    },
    {
        "word": "factual",
        "definition": "adj. 事实的；真实的"
    },
    {
        "word": "factor",
        "definition": "n. 因素；要素； 因数；代理人 vt. 把…作为因素计入；代理经营；把…分解成 vi. 做代理商"
    },
    {
        "word": "factory",
        "definition": "n. 工厂；制造厂；代理店"
    },
    {
        "word": "faculty",
        "definition": "n. 科，系；能力；全体教员"
    },
    {
        "word": "fade",
        "definition": "n.  淡出； 淡入 adj. 平淡的；乏味的 vi. 褪色；凋谢；逐渐消失 vt. 使褪色"
    },
    {
        "word": "fail",
        "definition": "n. 不及格 vi. 失败，不及格；破产；缺乏；衰退 vt. 不及格；使失望；忘记；舍弃"
    },
    {
        "word": "failure",
        "definition": "n. 失败；故障；失败者；破产"
    },
    {
        "word": "faint",
        "definition": "n.  昏厥，昏倒 adj. 模糊的；头晕的；虚弱的； 衰弱的 vi. 昏倒；变得微弱；变得没气力"
    },
    {
        "word": "fair",
        "definition": "n. 展览会；市集；美人 adj. 公平的；美丽的，白皙的； 晴朗的 vi. 转晴 adv. 公平地；直接地；清楚地"
    },
    {
        "word": "fairly",
        "definition": "adv. 相当地；公平地；简直"
    },
    {
        "word": "fairy",
        "definition": "n. 仙女，小精灵；漂亮姑娘 adj. 虚构的；仙女的"
    },
    {
        "word": "faith",
        "definition": "n. 信仰；信念；信任；忠实"
    },
    {
        "word": "faithful",
        "definition": "adj. 忠实的，忠诚的；如实的；准确可靠的"
    },
    {
        "word": "fake",
        "definition": "n. 假货；骗子；假动作 adj. 伪造的 vt. 捏造；假装…的样子 vi. 假装；做假动作"
    },
    {
        "word": "fall",
        "definition": "n. 下降；秋天；瀑布 adj. 秋天的 vi. 落下；变成；来临；减弱 vt. 砍倒；击倒"
    },
    {
        "word": "FALSE",
        "definition": "adj. 错误的；虚伪的；伪造的 adv. 欺诈地"
    },
    {
        "word": "falsehood",
        "definition": "n. 说谎；假话；不真实；错误的信仰"
    },
    {
        "word": "fame",
        "definition": "n. 名声，名望；传闻，传说 vt. 使闻名，使有名望"
    },
    {
        "word": "famous",
        "definition": "adj. 著名的；极好的，非常令人满意的"
    },
    {
        "word": "familiar",
        "definition": "n. 常客；密友 adj. 熟悉的；常见的；亲近的"
    },
    {
        "word": "familiarity",
        "definition": "n. 熟悉，精通；亲密；随便"
    },
    {
        "word": "familiarize",
        "definition": "vt. 使熟悉"
    },
    {
        "word": "familiarise",
        "definition": "vt. 使熟悉（等于familiarize）"
    },
    {
        "word": "family",
        "definition": "n. 家庭；亲属；家族；子女；科；语族；族 adj. 家庭的；家族的；适合于全家的"
    },
    {
        "word": "famine",
        "definition": "n. 饥荒；饥饿，奇缺"
    },
    {
        "word": "fan",
        "definition": "n. 迷；风扇；爱好者 vt. 煽动；刺激；吹拂 vi. 成扇形散开；飘动"
    },
    {
        "word": "fancy",
        "definition": "n. 幻想；想象力；爱好 adj. 想象的；奇特的；昂贵的；精选的 vt. 想象；喜爱；设想；自负 vi. 幻想；想象"
    },
    {
        "word": "fantasy",
        "definition": "n. 幻想；白日梦；幻觉 adj. 虚幻的 vt. 空想；想像 vi. 耽于幻想；奏幻想曲（等于phantasy）"
    },
    {
        "word": "fantastic",
        "definition": "n. 古怪的人 adj. 奇异的；空想的；异想天开的；古怪的；极好的，极出色的；不可思议的；不切实际的"
    },
    {
        "word": "far",
        "definition": "n. 远方 adj. 远的；久远的 adv. 很；遥远地；久远地；到很远的距离；到很深的程度"
    },
    {
        "word": "fare",
        "definition": "n. 票价；费用；旅客；食物 vi. 经营；进展；遭遇；过活"
    },
    {
        "word": "farewell",
        "definition": "n. 告别，辞别；再见；再会 adj. 告别的 int. 别了！（常含有永别或不容易再见面的意思）；再会！"
    },
    {
        "word": "farm",
        "definition": "n. 农场；农家；畜牧场 vt. 养殖；耕种；佃出（土地） vi. 种田，务农；经营农场"
    },
    {
        "word": "farmer",
        "definition": "n. 农夫，农民"
    },
    {
        "word": "farming",
        "definition": "n. 农业，耕作 v. 耕种；出租（farm的ing形式）"
    },
    {
        "word": "farther",
        "definition": "adj. 进一步的；更远的（far的比较级） adv. 更远地；此外；更进一步地"
    },
    {
        "word": "fascinate",
        "definition": "vt. 使着迷，使神魂颠倒 vi. 入迷"
    },
    {
        "word": "fascinating",
        "definition": "adj. 迷人的；吸引人的；使人神魂颠倒的 v. 使…着迷；使…陶醉（fascinate的ing形式）"
    },
    {
        "word": "fascination",
        "definition": "n. 魅力；魔力；入迷"
    },
    {
        "word": "fashion",
        "definition": "n. 时尚；时装；样式；时髦人物 vt. 使用；改变；做成…的形状"
    },
    {
        "word": "fashionable",
        "definition": "adj. 流行的；时髦的；上流社会的"
    },
    {
        "word": "fast",
        "definition": "n. 斋戒；绝食 adj. 快速的，迅速的；紧的，稳固的 adv. 迅速地；紧紧地；彻底地 vi. 禁食，斋戒"
    },
    {
        "word": "fasten",
        "definition": "vt. 使固定；集中于；扎牢；强加于 vi. 扣紧；抓住；集中注意力"
    },
    {
        "word": "fat",
        "definition": "n. 脂肪，肥肉 adj. 肥的，胖的；油腻的；丰满的 vt. 养肥；在…中加入脂肪 vi. 长肥"
    },
    {
        "word": "fatal",
        "definition": "adj. 致命的；重大的；毁灭性的；命中注定的"
    },
    {
        "word": "fatality",
        "definition": "n. 死亡；宿命；致命性；不幸；灾祸"
    },
    {
        "word": "fate",
        "definition": "n. 命运 vt. 注定"
    },
    {
        "word": "father",
        "definition": "n. 父亲，爸爸；神父；祖先；前辈 vt. 发明，创立；当…的父亲"
    },
    {
        "word": "fatherly",
        "definition": "adj. 父亲的；父亲般的；慈爱的"
    },
    {
        "word": "fatigue",
        "definition": "n. 疲劳，疲乏；杂役 adj. 疲劳的 vt. 使疲劳；使心智衰弱 vi. 疲劳"
    },
    {
        "word": "fault",
        "definition": "n. 故障； 断层；错误；缺点；毛病；（网球等）发球失误 vt. （通常用于疑问句或否定句）挑剔 vi. 弄错；产生断层"
    },
    {
        "word": "faulty",
        "definition": "adj. 有错误的；有缺点的"
    },
    {
        "word": "favor",
        "definition": "n. 喜爱；欢心；好感 vt. 赞成；喜欢；像；赐予；证实"
    },
    {
        "word": "favour",
        "definition": "n. 偏爱；赞同；善行 vt. 赞成；喜爱；有助于"
    },
    {
        "word": "favorable",
        "definition": "adj. 有利的；良好的；赞成的，赞许的；讨人喜欢的"
    },
    {
        "word": "favourable",
        "definition": "n. 有利 adj. 有利的，顺利的；赞成的"
    },
    {
        "word": "favorite",
        "definition": "n. 幸运儿；喜欢的事物；特别喜欢的人 adj. 最喜爱的；中意的；宠爱的"
    },
    {
        "word": "favourite",
        "definition": "n. 特别喜爱的人（或物） adj. 特别受喜爱的"
    },
    {
        "word": "fax",
        "definition": ""
    },
    {
        "word": "fear",
        "definition": "n. 害怕；恐惧；敬畏；担心 vt. 害怕；敬畏；为…担心 vi. 害怕；敬畏；为…担心"
    },
    {
        "word": "fearful",
        "definition": "adj. 可怕的；担心的；严重的"
    },
    {
        "word": "feasible",
        "definition": "adj. 可行的；可能的；可实行的"
    },
    {
        "word": "feasibility",
        "definition": "n. 可行性；可能性"
    },
    {
        "word": "feather",
        "definition": "n. 羽毛 vt. 用羽毛装饰 vi. 长羽毛"
    },
    {
        "word": "feature",
        "definition": "n. 特色，特征；容貌；特写或专题节目 vt. 特写；以…为特色；由…主演 vi. 起重要作用"
    },
    {
        "word": "February",
        "definition": "n. 二月"
    },
    {
        "word": "federal",
        "definition": "adv. 联邦政府地 adj. 联邦的；同盟的；联邦政府的； 联邦制的"
    },
    {
        "word": "federation",
        "definition": "n. 联合；联邦；联盟；联邦政府"
    },
    {
        "word": "fee",
        "definition": "n. 费用；酬金；小费 vt. 付费给……"
    },
    {
        "word": "feed",
        "definition": "n. 饲料；饲养；（动物或婴儿的）一餐 vt. 喂养；供给；放牧；抚养（家庭等）；靠…为生 vi. 吃东西；流入"
    },
    {
        "word": "feedback",
        "definition": "n. 反馈；成果，资料；回复"
    },
    {
        "word": "feel",
        "definition": "n. 感觉；触摸 vi. 觉得；摸索 vt. 感觉；认为；触摸；试探"
    },
    {
        "word": "feeling",
        "definition": "n. 感觉，触觉；感情，情绪；同情 v. 感觉；认为（feel的现在分词）；触摸 adj. 有感觉的；有同情心的；富于感情的"
    },
    {
        "word": "fellow",
        "definition": "n. 家伙；朋友；同事；会员 adj. 同伴的，同事的；同道的 vt. 使…与另一个对等；使…与另一个匹敌"
    },
    {
        "word": "fellowship",
        "definition": "n. 团体；友谊；奖学金；研究员职位"
    },
    {
        "word": "female",
        "definition": "n. 女人； 雌性动物 adj. 女性的；雌性的；柔弱的，柔和的"
    },
    {
        "word": "fence",
        "definition": "n. 栅栏；围墙；剑术 vt. 防护；用篱笆围住；练习剑术 vi. 击剑；搪塞；围以栅栏；跳过栅栏"
    },
    {
        "word": "ferry",
        "definition": "n. 渡船；摆渡；渡口 vt. （乘渡船）渡过；用渡船运送；空运 vi. 摆渡；来往行驶"
    },
    {
        "word": "fertile",
        "definition": "adj. 富饶的，肥沃的；能生育的"
    },
    {
        "word": "fertility",
        "definition": "n. 多产；肥沃； 生产力；丰饶"
    },
    {
        "word": "fertilizer",
        "definition": "n.  肥料；受精媒介物；促进发展者"
    },
    {
        "word": "fertiliser",
        "definition": "n. 化肥（等于fertilizer）"
    },
    {
        "word": "festival",
        "definition": "n. 节日；庆祝，纪念活动；欢乐 adj. 节日的，喜庆的；快乐的"
    },
    {
        "word": "fetch",
        "definition": "n. 取得；诡计 vt. 取来；接来；到达；吸引 vi. 拿；取物；卖得"
    },
    {
        "word": "fever",
        "definition": "n. 发烧，发热；狂热 vt. 使发烧；使狂热；使患热病 vi. 发烧；狂热；患热病"
    },
    {
        "word": "feverish",
        "definition": "adj. 发热的；极度兴奋的"
    },
    {
        "word": "few",
        "definition": "n. 很少数 adj. 很少的；几乎没有的 pron. 很少"
    },
    {
        "word": "fiber",
        "definition": "n. 纤维；光纤（等于fibre）"
    },
    {
        "word": "fibre",
        "definition": "n. 纤维；纤维制品"
    },
    {
        "word": "fiction",
        "definition": "n. 小说；虚构，编造；谎言"
    },
    {
        "word": "fictional",
        "definition": "adj. 虚构的；小说的"
    },
    {
        "word": "field",
        "definition": "n. 领域；牧场；旷野；战场；运动场 adj. 扫描场；田赛的；野生的 vt. 把暴晒于场上；使上场 vi. 担任场外队员"
    },
    {
        "word": "fierce",
        "definition": "adj. 凶猛的；猛烈的；暴躁的"
    },
    {
        "word": "fifteen",
        "definition": "n. 十五；十五个；十五人组成的橄榄球队 num. 十五 adj. 十五的"
    },
    {
        "word": "fifth",
        "definition": "num. 第五 n. 第五；五分之一 adj. 第五的；五分之一的"
    },
    {
        "word": "fifty",
        "definition": "n. 五十；五十个；编号为50的东西 adj. 五十的；五十个的；众多的"
    },
    {
        "word": "fight",
        "definition": "n. 打架；战斗，斗志 vi. 打架；与…打仗，与…斗争；反对…提案"
    },
    {
        "word": "figure",
        "definition": "n. 数字；人物；图形；价格；（人的）体形；画像 vt. 计算；认为；描绘；象征 vi. 计算；出现；扮演角色"
    },
    {
        "word": "figurative",
        "definition": "adj. 比喻的；修饰丰富的；形容多的"
    },
    {
        "word": "file",
        "definition": "n. 文件；档案；文件夹；锉刀 vt. 提出；锉；琢磨；把…归档 vi. 列队行进；用锉刀锉"
    },
    {
        "word": "fill",
        "definition": "n. 满足；填满的量；装填物 vt. 装满，使充满；满足；堵塞；任职 vi. 被充满，膨胀"
    },
    {
        "word": "filling",
        "definition": "n. 填充；填料 v. 填满；遍及（fill的ing形式）"
    },
    {
        "word": "film",
        "definition": "n. 电影；薄膜；胶卷；轻烟 vt. 在…上覆以薄膜；把…拍成电影 vi. 摄制电影；生薄膜；变得朦胧"
    },
    {
        "word": "filter",
        "definition": "n. 滤波器； 过滤器；筛选；滤光器 vt. 过滤；渗透；用过滤法除去 vi. 滤过；渗入；慢慢传开"
    },
    {
        "word": "final",
        "definition": "n. 决赛；期末考试；当日报纸的末版 adj. 最终的；决定性的；不可更改的"
    },
    {
        "word": "finally",
        "definition": "adv. 最后；终于；决定性地"
    },
    {
        "word": "finalize",
        "definition": "vt. 完成；使结束 vi. 把最后定下来；定案"
    },
    {
        "word": "finalise",
        "definition": "vt. 使…结束；把最后定下来"
    },
    {
        "word": "finance",
        "definition": "n. 财政，财政学；金融 vt. 负担经费，供给…经费 vi. 筹措资金"
    },
    {
        "word": "financial",
        "definition": "adj. 金融的；财政的，财务的"
    },
    {
        "word": "find",
        "definition": "n. 发现 vi. 裁决 vt. 查找，找到；发现；认为；感到；获得"
    },
    {
        "word": "finding",
        "definition": "n. 发现；裁决；发现物 v. 找到；感到（find的ing形式）；遇到"
    },
    {
        "word": "fine",
        "definition": "n. 罚款 adj. 好的；优良的；细小的，精美的；健康的；晴朗的 vt. 罚款；澄清 adv. 很好地；精巧地"
    },
    {
        "word": "finger",
        "definition": "n. 手指；指针，指状物 vt. 伸出；用手指拨弄 vi. 用指触摸；拨弄"
    },
    {
        "word": "fingerprint",
        "definition": "n. 指纹；手印 vt. 采指纹"
    },
    {
        "word": "finish",
        "definition": "n. 结束；完美；回味（葡萄酒） vt. 完成；结束；用完 vi. 结束，终止；终结"
    },
    {
        "word": "fire",
        "definition": "n. 火；火灾；炮火；炉火；热情；激情；磨难 vt. 点燃；解雇；开除；使发光；烧制；激动；放枪 vi. 着火；射击；开枪；激动；烧火"
    },
    {
        "word": "fireman",
        "definition": "n. 消防队员；救火队员；锅炉工"
    },
    {
        "word": "fireplace",
        "definition": "n. 壁炉"
    },
    {
        "word": "fireworks",
        "definition": "n. 烟火, 激烈争论  焰火"
    },
    {
        "word": "firm",
        "definition": "n. 公司；商号 adj. 坚定的；牢固的；严格的；结实的 vt. 使坚定；使牢固 adv. 稳固地 vi. 变坚实；变稳固"
    },
    {
        "word": "first",
        "definition": "num. 第一 n. 第一；开始；冠军 adj. 第一的；基本的；最早的 adv. 第一；首先；优先；宁愿"
    },
    {
        "word": "firstly",
        "definition": "adv. 首先（主要用于列举条目、论点时）；第一"
    },
    {
        "word": "fish",
        "definition": "n. 鱼，鱼类 vt. 钓鱼，捕鱼；搜寻 vi. 捕鱼，钓鱼；用钩捞取"
    },
    {
        "word": "fishing",
        "definition": "n. 渔业；捕鱼（术）；试探；装配 adj. 钓鱼的；钓鱼用的 v. 捕鱼（fish的ing形式）"
    },
    {
        "word": "fisherman",
        "definition": "n. 渔夫；渔人"
    },
    {
        "word": "fist",
        "definition": "n. 拳，拳头；笔迹；掌握；指标参见号 vt. 紧握；握成拳；用拳打"
    },
    {
        "word": "fit",
        "definition": "n. 合身；发作；痉挛 adj. 健康的；合适的；恰当的；准备好的 vt. 安装；使……适应；使……合身；与……相符 vi. 符合，配合；适合；合身"
    },
    {
        "word": "five",
        "definition": "num. 五，五个 n. 五，五个；五美元钞票 adj. 五的；五个的"
    },
    {
        "word": "fix",
        "definition": "n. 困境；方位；贿赂 vt. 使固定；修理；安装；准备 vi. 固定；注视"
    },
    {
        "word": "fixed",
        "definition": "adj. 确定的；固执的；<美口>处境...的；准备好的 v. 修理（过去式）"
    },
    {
        "word": "fixture",
        "definition": "n. 设备；固定装置；固定于某处不大可能移动之物"
    },
    {
        "word": "fixation",
        "definition": "n. 异常依恋，固恋，痴迷；癖 n. 固定；定位；定影"
    },
    {
        "word": "flag",
        "definition": "n. 标志；旗子 vt. 标记；插旗 vi. 标记；衰退；枯萎"
    },
    {
        "word": "flame",
        "definition": "n. 火焰；热情；光辉 v. 焚烧；泛红"
    },
    {
        "word": "flash",
        "definition": "n. 闪光，闪现；一瞬间 adj. 闪光的，火速的 vt. 使闪光；反射 vi. 闪光，闪现；反射"
    },
    {
        "word": "flat",
        "definition": "n. 平地；公寓；平面 adj. 平的；单调的；不景气的；干脆的；平坦的；扁平的；浅的 vi. 逐渐变平；以降调唱（或奏） vt. 使变平；使（音调）下降，尤指降半音 adv. （尤指贴着另一表面）平直地；断然地；水平地；直接地，完全地"
    },
    {
        "word": "flavor",
        "definition": "n. 情味，风味；香料；滋味 vt. 加味于"
    },
    {
        "word": "flavour",
        "definition": "n. 香味；滋味 vt. 给……调味；给……增添风趣"
    },
    {
        "word": "flaw",
        "definition": "n. 瑕疵，缺点；一阵狂风；短暂的风暴；裂缝，裂纹 v. 使生裂缝，使有裂纹；使无效；使有缺陷 vi. 生裂缝；变的有缺陷"
    },
    {
        "word": "flawless",
        "definition": "adj. 完美的；无瑕疵的；无裂缝的"
    },
    {
        "word": "flee",
        "definition": "vt. 逃跑，逃走；逃避 vi. 逃走；消失，消散"
    },
    {
        "word": "fleet",
        "definition": "n. 舰队；港湾；小河 adj. 快速的，敏捷的 vt. 消磨 vi. 飞逝；疾驰；掠过"
    },
    {
        "word": "flesh",
        "definition": "n. 肉；肉体 vt. 喂肉给…；使发胖 vi. 长胖"
    },
    {
        "word": "flexible",
        "definition": "adj. 灵活的；柔韧的；易弯曲的"
    },
    {
        "word": "flexibility",
        "definition": "n. 灵活性；弹性；适应性"
    },
    {
        "word": "float",
        "definition": "n. 彩车，花车；漂流物；浮舟；浮萍 vi. 浮动；飘动，散播；摇摆；付诸实施 vt. 使漂浮；实行"
    },
    {
        "word": "flock",
        "definition": "n. 群；棉束（等于floc） vi. 聚集；成群而行 vt. 用棉束填满"
    },
    {
        "word": "flood",
        "definition": "n. 洪水；泛滥；一大批 vt. 淹没；充满；溢出 vi. 涌出；涌进；为水淹没"
    },
    {
        "word": "floor",
        "definition": "n. 地板，地面；楼层；基底；议员席 vt. 铺地板；打倒，击倒；（被困难）难倒"
    },
    {
        "word": "flour",
        "definition": "n. 面粉；粉状物质 vt. 撒粉于；把…磨成粉"
    },
    {
        "word": "flourish",
        "definition": "n. 兴旺；茂盛；挥舞；炫耀；华饰 vi. 繁荣，兴旺；茂盛；活跃；处于旺盛时期 vt. 夸耀；挥舞"
    },
    {
        "word": "flow",
        "definition": "n. 流动；流量；涨潮，泛滥 vt. 淹没，溢过 vi. 流动，涌流；川流不息；飘扬"
    },
    {
        "word": "flower",
        "definition": "n. 花；精华；开花植物 vt. 使开花；用花装饰 vi. 成熟，发育；开花；繁荣；旺盛"
    },
    {
        "word": "fluctuate",
        "definition": "vi. 波动；涨落；动摇 vt. 使波动；使动摇"
    },
    {
        "word": "fluctuation",
        "definition": "n. 起伏，波动"
    },
    {
        "word": "fluent",
        "definition": "adj. 流畅的，流利的；液态的；畅流的"
    },
    {
        "word": "fluency",
        "definition": "n. （语言、文章）流利；（技能）娴熟 n. 流畅度（写作演讲等）"
    },
    {
        "word": "fluid",
        "definition": "n. 流体；液体 adj. 流动的；流畅的；不固定的"
    },
    {
        "word": "fly",
        "definition": "n. 飞行；苍蝇；两翼昆虫 adj. 敏捷的 vi. 飞；驾驶飞机；飘扬 vt. 飞行；飞越；使飘扬"
    },
    {
        "word": "flight",
        "definition": "n. 飞行；班机；逃走 vt. 射击；使惊飞 vi. 迁徙"
    },
    {
        "word": "focus",
        "definition": "n. 焦点；中心；清晰；焦距 vt. 使集中；使聚焦 vi. 集中；聚焦；调节焦距"
    },
    {
        "word": "fog",
        "definition": "n. 雾；烟雾，尘雾；迷惑 vt. 使模糊；使困惑；以雾笼罩 vi. 被雾笼罩；变模糊"
    },
    {
        "word": "foggy",
        "definition": "adj. 有雾的；模糊的，朦胧的"
    },
    {
        "word": "fold",
        "definition": "n. 折痕；信徒；羊栏 vt. 折叠；合拢；抱住；笼罩 vi. 折叠起来；彻底失败"
    },
    {
        "word": "folk",
        "definition": "n. 民族；人们；亲属（复数） adj. 民间的"
    },
    {
        "word": "follow",
        "definition": "n. 跟随；追随 vi. 跟随；接着 vt. 跟随；遵循；追求；密切注意，注视；注意；倾听"
    },
    {
        "word": "following",
        "definition": "n. 下列事物；一批追随者 v. 跟随；沿行（follow的ing形式） adj. 下面的；其次的，接着的"
    },
    {
        "word": "fond",
        "definition": "adj. 喜欢的；温柔的；宠爱的"
    },
    {
        "word": "food",
        "definition": "n. 食物；养料"
    },
    {
        "word": "fool",
        "definition": "n. 傻瓜；愚人；受骗者 vt. 欺骗，愚弄 adj. 傻的 vi. 欺骗；开玩笑；戏弄"
    },
    {
        "word": "foolish",
        "definition": "adj. 愚蠢的；傻的"
    },
    {
        "word": "foot",
        "definition": "n. 脚；英尺；步调；末尾 vt. 支付；给……换底 vi. 步行；跳舞；总计"
    },
    {
        "word": "football",
        "definition": "n. 足球，橄榄球 vi. 踢足球；打橄榄球"
    },
    {
        "word": "footprint",
        "definition": "n. 足迹；脚印"
    },
    {
        "word": "for",
        "definition": "prep. 为，为了；因为；给；对于；至于；适合于 conj. 因为"
    },
    {
        "word": "forbid",
        "definition": "vt. 禁止；不准；不允许；严禁"
    },
    {
        "word": "force",
        "definition": "n. 力量；武力；军队；魄力 vt. 促使，推动；强迫；强加"
    },
    {
        "word": "forceful",
        "definition": "adj. 强有力的；有说服力的；坚强的"
    },
    {
        "word": "forecast",
        "definition": "n. 预测，预报；预想 vt. 预报，预测；预示 vi. 进行预报，作预测"
    },
    {
        "word": "forehead",
        "definition": "n. 额，前额"
    },
    {
        "word": "foreign",
        "definition": "adj. 外国的；外交的；异质的；不相关的"
    },
    {
        "word": "foreigner",
        "definition": "n. 外地人，外国人"
    },
    {
        "word": "foremost",
        "definition": "adj. 最重要的；最先的 adv. 首先；居于首位地"
    },
    {
        "word": "foresee",
        "definition": "vt. 预见；预知"
    },
    {
        "word": "foreseeable",
        "definition": "adj. 可预知的；能预测的"
    },
    {
        "word": "foresight",
        "definition": "n. 先见，远见；预见；深谋远虑"
    },
    {
        "word": "forest",
        "definition": "n. 森林 vt. 植树于，使成为森林"
    },
    {
        "word": "forestry",
        "definition": "n. 林业；森林地；林学"
    },
    {
        "word": "forever",
        "definition": "adv. 永远；不断地；常常"
    },
    {
        "word": "forge",
        "definition": "n. 熔炉，锻铁炉；铁工厂 vt. 伪造；锻造；前进 vi. 伪造；做锻工；前进"
    },
    {
        "word": "forgery",
        "definition": "n. 伪造；伪造罪；伪造物"
    },
    {
        "word": "forget",
        "definition": "vi. 忘记 vt. 忘记；忽略"
    },
    {
        "word": "forgetful",
        "definition": "adj. 健忘的；不注意的；疏忽的；使遗忘的"
    },
    {
        "word": "forgettable",
        "definition": "adj. 可忘记的；容易被忘的"
    },
    {
        "word": "forgive",
        "definition": "vt. 原谅；免除（债务、义务等） vi. 表示原谅"
    },
    {
        "word": "forgiving",
        "definition": "adj. 宽恕的；宽容的；宽大的 v. 原谅；豁免（forgive的ing形式）"
    },
    {
        "word": "fork",
        "definition": "n. 叉；餐叉；耙 vt. 叉起；使成叉状 vi. 分叉；分歧"
    },
    {
        "word": "form",
        "definition": "n. 形式，形状；形态，外形；方式；表格 vt. 构成，组成；排列，组织；产生，塑造 vi. 形成，构成；排列"
    },
    {
        "word": "formation",
        "definition": "n. 形成；构造；编队"
    },
    {
        "word": "formal",
        "definition": "n. 正式的社交活动；夜礼服 adj. 正式的；拘谨的；有条理的"
    },
    {
        "word": "formality",
        "definition": "n. 礼节；拘谨；仪式；正式手续"
    },
    {
        "word": "format",
        "definition": "n. 格式；版式；开本 vt. 使格式化；规定…的格式 vi. 设计版式"
    },
    {
        "word": "former",
        "definition": "n. 模型，样板；起形成作用的人 adj. 从前的，前者的；前任的"
    },
    {
        "word": "formula",
        "definition": "n.  公式，准则；配方；婴儿食品"
    },
    {
        "word": "formulate",
        "definition": "vt. 规划；用公式表示；明确地表达"
    },
    {
        "word": "formulation",
        "definition": "n. 构想，规划；公式化；简洁陈述"
    },
    {
        "word": "forth",
        "definition": "adv. 向前，向外；自…以后"
    },
    {
        "word": "forthcoming",
        "definition": "n. 来临 adj. 即将来临的"
    },
    {
        "word": "fortune",
        "definition": "n. 财富；命运；运气 vt. 给予财富 vi. 偶然发生"
    },
    {
        "word": "fortunate",
        "definition": "adj. 幸运的；侥幸的；吉祥的；带来幸运的"
    },
    {
        "word": "forty",
        "definition": "n. 四十 adj. 四十的；四十个的"
    },
    {
        "word": "forum",
        "definition": "n. 论坛，讨论会；法庭；公开讨论的广场"
    },
    {
        "word": "forward",
        "definition": "n. 前锋 adj. 向前的；早的；迅速的 adv. 向前地；向将来 vt. 促进；转寄；运送"
    },
    {
        "word": "fossil",
        "definition": "n. 化石；僵化的事物；顽固不化的人 adj. 化石的；陈腐的，守旧的"
    },
    {
        "word": "found",
        "definition": "v. 找到（find的过去分词） vt. 创立，建立；创办"
    },
    {
        "word": "founding",
        "definition": "n.  铸造；溶解 adj. 创办的；发起的 v.  铸造；建造；以…为基础（found的ing形式）"
    },
    {
        "word": "founder",
        "definition": "n. 创始人；建立者；翻沙工 vt. 破坏；使摔倒；垮掉 vi. 失败；沉没；倒塌；变跛"
    },
    {
        "word": "foundation",
        "definition": "n. 基础；地基；基金会；根据；创立"
    },
    {
        "word": "fountain",
        "definition": "n. 喷泉，泉水；源泉"
    },
    {
        "word": "four",
        "definition": "num. 四；四个 adj. 四的；四个的"
    },
    {
        "word": "fourteen",
        "definition": "num. 十四；十四个；第十四 n. 十四的记号；十四岁；十四点钟；十五世纪"
    },
    {
        "word": "fox",
        "definition": "n. 狐狸；狡猾的人 vt. 欺骗；使变酸 vi. 假装；耍狡猾手段"
    },
    {
        "word": "fraction",
        "definition": "n. 分数；部分；小部分；稍微"
    },
    {
        "word": "fragment",
        "definition": "n. 碎片；片断或不完整部分 vt. 使成碎片 vi. 破碎或裂开"
    },
    {
        "word": "fragmentation",
        "definition": "n. 破碎；分裂； 存储残片"
    },
    {
        "word": "fragmentary",
        "definition": "adj. 碎片的；不完全的；断断续续的"
    },
    {
        "word": "frame",
        "definition": "n. 框架；结构； 画面 adj. 有木架的；有构架的 vt. 设计；建造；陷害；使…适合 vi. 有成功希望"
    },
    {
        "word": "framework",
        "definition": "n. 框架，骨架；结构，构架"
    },
    {
        "word": "frank",
        "definition": "n. 免费邮寄特权 adj. 坦白的，直率的；老实的 vt. 免费邮寄"
    },
    {
        "word": "free",
        "definition": "adj. 免费的；自由的，不受约束的； 游离的 vt. 使自由，解放；释放 adv. 自由地；免费"
    },
    {
        "word": "freedom",
        "definition": "n. 自由，自主；直率"
    },
    {
        "word": "freeway",
        "definition": "n. 高速公路"
    },
    {
        "word": "freeze",
        "definition": "n. 冻结；凝固 vt. 使…冻住；使…结冰 vi. 冻结；冷冻；僵硬"
    },
    {
        "word": "freight",
        "definition": "n. 货运；运费；船货 vt. 运送；装货；使充满"
    },
    {
        "word": "frequent",
        "definition": "adj. 频繁的；时常发生的；惯常的 vt. 常到，常去；时常出入于"
    },
    {
        "word": "frequency",
        "definition": "n. 频率；频繁"
    },
    {
        "word": "fresh",
        "definition": "n. 开始；新生；泛滥 adj. 新鲜的；清新的；淡水的；无经验的 adv. 刚刚，才；最新地"
    },
    {
        "word": "freshman",
        "definition": "n. 新手，生手；大学一年级学生"
    },
    {
        "word": "Friday",
        "definition": "n. 星期五"
    },
    {
        "word": "friend",
        "definition": "n. 朋友；助手；赞助者"
    },
    {
        "word": "friendly",
        "definition": "adj. 友好的；亲切的；支持的；融洽的，和睦的 adv. 友善地；温和地"
    },
    {
        "word": "friendship",
        "definition": "n. 友谊；友爱；友善"
    },
    {
        "word": "fright",
        "definition": "n. 惊吓；惊骇 vt. 使惊恐"
    },
    {
        "word": "frighten",
        "definition": "vt. 使惊吓；吓唬… vi. 害怕，惊恐"
    },
    {
        "word": "frog",
        "definition": "n. 青蛙； 辙叉；饰扣 vi. 捕蛙"
    },
    {
        "word": "from",
        "definition": "prep. 来自，从；由于；今后"
    },
    {
        "word": "front",
        "definition": "n. 前面；正面；前线 adj. 前面的；正面的 vt. 面对；朝向；对付 vi. 朝向 adv. 在前面；向前"
    },
    {
        "word": "frontier",
        "definition": "n. 前沿；边界；国境 adj. 边界的；开拓的"
    },
    {
        "word": "frost",
        "definition": "n. 霜；冰冻，严寒；冷淡 vi. 结霜；受冻 vt. 结霜于；冻坏"
    },
    {
        "word": "frosty",
        "definition": "adj. 结霜的，严寒的；冷淡的；灰白的"
    },
    {
        "word": "fruit",
        "definition": "n. 水果；产物 vt. 使……结果实 vi. 结果实"
    },
    {
        "word": "fruitful",
        "definition": "adj. 富有成效的；多产的；果实结得多的"
    },
    {
        "word": "frustrate",
        "definition": "vt. 挫败；阻挠；使感到灰心 adj. 挫败的；无益的 vi. 失败；受挫"
    },
    {
        "word": "frustration",
        "definition": "n. 挫折"
    },
    {
        "word": "frustrating",
        "definition": "v. 使沮丧（frustrate的ing形式） adj. 令人沮丧的"
    },
    {
        "word": "fry",
        "definition": "n. 鱼苗；油炸食物 vt. 油炸；油煎 vi. 油炸；油煎"
    },
    {
        "word": "fuck",
        "definition": "n. 性交；杂种；一丁点儿 vt. 与...性交；诅咒；欺骗 int. 他妈的 vi. 性交；鬼混"
    },
    {
        "word": "fuel",
        "definition": "n. 燃料；刺激因素 vt. 供以燃料，加燃料 vi. 得到燃料"
    },
    {
        "word": "fulfil",
        "definition": "vt. 履行；完成；实践；满足"
    },
    {
        "word": "fulfill",
        "definition": "vt. 履行；实现；满足；使结束（等于fulfil）"
    },
    {
        "word": "fulfilment",
        "definition": "n. 实现；成就"
    },
    {
        "word": "fulfillment",
        "definition": "n. 履行；实行"
    },
    {
        "word": "full",
        "definition": "n. 全部；完整 adj. 完全的，完整的；满的，充满的；丰富的；完美的；丰满的；详尽的 vt. 把衣服缝得宽大 adv. 十分，非常；完全地；整整"
    },
    {
        "word": "fun",
        "definition": "n. 乐趣；玩笑；有趣的人或事 adj. 供娱乐用的 vi. 开玩笑"
    },
    {
        "word": "funny",
        "definition": "n. 滑稽人物；笑话，有趣的故事；滑稽连环漫画栏；（英）（比赛用）单人双桨小艇 adj. 有趣的，好笑的，滑稽的；（口）稀奇的，古怪的，奇异的；有病的，不舒服的；狡猾的，欺骗（性）的，可疑的，不光明"
    },
    {
        "word": "function",
        "definition": "n. 功能； 函数；职责；盛大的集会 vi. 运行；活动；行使职责"
    },
    {
        "word": "functional",
        "definition": "adj. 功能的"
    },
    {
        "word": "fund",
        "definition": "n. 基金；资金；存款 vt. 投资；资助"
    },
    {
        "word": "funding",
        "definition": "n. 提供资金；用发行长期债券的方法来收回短期债券 v. 提供资金；积存（fund的ing形式）"
    },
    {
        "word": "fundamental",
        "definition": "n. 基本原理；基本原则 adj. 基本的，根本的"
    },
    {
        "word": "funeral",
        "definition": "n. 葬礼；麻烦事 adj. 丧葬的，出殡的"
    },
    {
        "word": "fur",
        "definition": "n. 皮，皮子；毛皮；软毛 n. 水垢 vt. 用毛皮覆盖；使穿毛皮服装"
    },
    {
        "word": "furnace",
        "definition": "n. 火炉，熔炉"
    },
    {
        "word": "furnish",
        "definition": "vt. 提供；供应；装备"
    },
    {
        "word": "furniture",
        "definition": "n. 家具；设备；储藏物"
    },
    {
        "word": "further",
        "definition": "adj. 更远的；深一层的 vt. 促进，助长；增进 adv. 进一步地；而且；更远地"
    },
    {
        "word": "furthermore",
        "definition": "adv. 此外；而且"
    },
    {
        "word": "fuss",
        "definition": "n. 大惊小怪，大惊小怪的人；小题大作；忙乱 vt. 使烦恼，使烦忧 vi. 小题大作；忙乱；焦燥；焦急；无事自扰"
    },
    {
        "word": "future",
        "definition": "n. 未来；前途；期货；将来时 adj. 将来的，未来的"
    },
    {
        "word": "gadget",
        "definition": "n. 小玩意；小器具；小配件；诡计"
    },
    {
        "word": "gadgetry",
        "definition": "n. 小配件；小玩意；小机件"
    },
    {
        "word": "gain",
        "definition": "n. 增加；利润；收获 vi. 增加；获利 vt. 获得；增加；赚到"
    },
    {
        "word": "gallery",
        "definition": "n. 画廊；走廊；旁听席；地道 vt. 在…修建走廊；在…挖地道 vi. 挖地道"
    },
    {
        "word": "gallon",
        "definition": "n. 加仑（容量单位）"
    },
    {
        "word": "gamble",
        "definition": "n. 赌博；冒险；打赌 vi. 赌博；孤注一掷；投机；打赌 vt. 赌博；孤注一掷；冒险假设"
    },
    {
        "word": "game",
        "definition": "n. 游戏；比赛 adj. 勇敢的 vi. 赌博"
    },
    {
        "word": "gang",
        "definition": "n. 群；一伙；一组 vt. 使成群结队；结伙伤害或恐吓某人 vi. 成群结队"
    },
    {
        "word": "gangster",
        "definition": "n. 歹徒，流氓；恶棍"
    },
    {
        "word": "gaol",
        "definition": "n. 监狱 vt. 监禁"
    },
    {
        "word": "gap",
        "definition": "n. 间隙；缺口；差距；分歧 vt. 使形成缺口 vi. 裂开"
    },
    {
        "word": "garage",
        "definition": "n. 车库；汽车修理厂；飞机库 vt. 把……送入车库；把（汽车）开进车库"
    },
    {
        "word": "garbage",
        "definition": "n. 垃圾；废物"
    },
    {
        "word": "garden",
        "definition": "n. 花园；菜园 vt. 栽培花木 vi. 从事园艺；在园中种植"
    },
    {
        "word": "gardener",
        "definition": "n. 园丁；花匠；园艺家"
    },
    {
        "word": "gardening",
        "definition": "n. 园艺；园林工人的工作"
    },
    {
        "word": "garment",
        "definition": "n. 衣服，服装；外表，外观 vt. 给…穿衣服"
    },
    {
        "word": "gas",
        "definition": "n. 气体； 瓦斯；汽油；毒气 vt. 加油；毒（死） vi. 加油；放出气体；空谈"
    },
    {
        "word": "gasoline",
        "definition": "n. 汽油"
    },
    {
        "word": "petrol",
        "definition": "n. （英）汽油"
    },
    {
        "word": "gate",
        "definition": "n. 大门；出入口；门道 vt. 给…装大门"
    },
    {
        "word": "gather",
        "definition": "n. 聚集；衣褶；收获量 vt. 收集；收割；使…聚集；使…皱起 vi. 聚集；化脓；皱起"
    },
    {
        "word": "gathering",
        "definition": "n. 聚集；集会；收款 v. 聚集（gather的ing形式）"
    },
    {
        "word": "gay",
        "definition": "n. 同性恋者 adj. 快乐的；放荡的；艳丽的"
    },
    {
        "word": "gaze",
        "definition": "n. 凝视；注视 vi. 凝视；注视"
    },
    {
        "word": "gear",
        "definition": "n. 齿轮；装置，工具；传动装置 adj. 好极了 vt. 开动；搭上齿轮；使……适合；使……准备好 vi. 适合；搭上齿轮；开始工作"
    },
    {
        "word": "gender",
        "definition": "n. 性；性别；性交 vt. 生（过去式gendered，过去分词gendered，现在分词gendering，第三人称单数genders，形容词genderless）"
    },
    {
        "word": "gene",
        "definition": "n.  基因，遗传因子"
    },
    {
        "word": "genetic",
        "definition": "adj. 遗传的；基因的；起源的"
    },
    {
        "word": "genetically",
        "definition": "adv. 从遗传学角度；从基因方面"
    },
    {
        "word": "general",
        "definition": "n. 一般；将军，上将；常规 adj. 一般的，普通的；综合的；大体的"
    },
    {
        "word": "generally",
        "definition": "adv. 通常；普遍地，一般地"
    },
    {
        "word": "generalize",
        "definition": "vi. 形成概念 vt. 概括；推广；使...一般化"
    },
    {
        "word": "generalise",
        "definition": "vi. 推广；笼统地讲；概括（等于generalize） vt. 概括；归纳；普及"
    },
    {
        "word": "generate",
        "definition": "vt. 使形成；发生；生殖；产生物理反应"
    },
    {
        "word": "generator",
        "definition": "n. 发电机；发生器；生产者"
    },
    {
        "word": "generation",
        "definition": "n. 一代；产生；一代人；生殖"
    },
    {
        "word": "generous",
        "definition": "adj. 慷慨的，大方的；宽宏大量的；有雅量的"
    },
    {
        "word": "generosity",
        "definition": "n. 慷慨，大方；宽宏大量"
    },
    {
        "word": "genius",
        "definition": "n. 天才，天赋；精神"
    },
    {
        "word": "gentle",
        "definition": "n. 蛆，饵 adj. 温和的；文雅的 vt. 使温和，使驯服"
    },
    {
        "word": "gentleman",
        "definition": "n. 先生；绅士；有身份的人"
    },
    {
        "word": "genuine",
        "definition": "adj. 真实的，真正的；诚恳的"
    },
    {
        "word": "geography",
        "definition": "n. 地理；地形"
    },
    {
        "word": "geographic",
        "definition": "adj. 地理的；地理学的"
    },
    {
        "word": "geographically",
        "definition": "adv. 在地理上；地理学上"
    },
    {
        "word": "geology",
        "definition": "n. 地质学；地质情况"
    },
    {
        "word": "geological",
        "definition": "adj. 地质的，地质学的"
    },
    {
        "word": "geologically",
        "definition": "adv. 从地质学角度"
    },
    {
        "word": "geometry",
        "definition": "n. 几何学 几何结构"
    },
    {
        "word": "geometric",
        "definition": "adj. 几何学的； 几何学图形的"
    },
    {
        "word": "geometrically",
        "definition": "adv. 用几何学；几何学上地；按几何级数地"
    },
    {
        "word": "germ",
        "definition": "n.  胚芽，萌芽；细菌 vi. 萌芽"
    },
    {
        "word": "gesture",
        "definition": "n. 姿态；手势 vt. 用动作表示 vi. 作手势；用动作示意"
    },
    {
        "word": "get",
        "definition": "n. 生殖；幼兽 vi. 成为；变得；到达 vt. 使得；获得；受到；变成"
    },
    {
        "word": "ghost",
        "definition": "n. 鬼，幽灵 vt. 作祟于；替…捉刀；为人代笔 vi. 替人代笔"
    },
    {
        "word": "giant",
        "definition": "n. 巨人；伟人； 巨大的动物 adj. 巨大的；巨人般的"
    },
    {
        "word": "gigantic",
        "definition": "adj. 巨大的，庞大的"
    },
    {
        "word": "gift",
        "definition": "n. 礼物；天赋；赠品 vt. 赋予；向…赠送"
    },
    {
        "word": "gifted",
        "definition": "adj. 有天赋的；有才华的 v. 给予（gift的过去分词）"
    },
    {
        "word": "girl",
        "definition": "n. 女孩；姑娘，未婚女子；女职员，女演员；（男人的）女朋友 n. （捷）吉尔"
    },
    {
        "word": "give",
        "definition": "n. 弹性；弯曲；伸展性 vi. 捐赠；面向；有弹性；气候转暖 vt. 给；产生；让步；举办；授予"
    },
    {
        "word": "given",
        "definition": "prep. 考虑到 v. 给予（give的过去分词） adj. 赠予的；沉溺的；规定的"
    },
    {
        "word": "glad",
        "definition": "adj. 高兴的；乐意的；令人高兴的；灿烂美丽的 vt. 使高兴"
    },
    {
        "word": "glance",
        "definition": "n. 一瞥；一滑；闪光 vt. 扫视；瞥见；擦过 vi. 扫视，匆匆一看；反光；瞥闪，瞥见"
    },
    {
        "word": "glass",
        "definition": "n. 玻璃；玻璃制品；镜子 vt. 反映；给某物加玻璃 vi. 成玻璃状"
    },
    {
        "word": "glimpse",
        "definition": "n. 一瞥，一看 vt. 瞥见 vi. 瞥见"
    },
    {
        "word": "globe",
        "definition": "n. 地球；地球仪；球体 vt. 使…成球形 vi. 成球状"
    },
    {
        "word": "global",
        "definition": "adj. 全球的；总体的；球形的"
    },
    {
        "word": "globalize",
        "definition": "vt. 使全球化"
    },
    {
        "word": "globalise",
        "definition": "使全球化（英式英语）"
    },
    {
        "word": "gloom",
        "definition": "n. 昏暗；阴暗"
    },
    {
        "word": "gloomy",
        "definition": "adj. 黑暗的；沮丧的；阴郁的"
    },
    {
        "word": "glory",
        "definition": "n. 光荣，荣誉；赞颂 vi. 自豪，骄傲；狂喜"
    },
    {
        "word": "glorious",
        "definition": "adj. 光荣的；辉煌的；极好的"
    },
    {
        "word": "glove",
        "definition": "n. 手套 vt. 给…戴手套"
    },
    {
        "word": "glow",
        "definition": "n. 灼热；色彩鲜艳；兴高采烈 vi. 发热；洋溢；绚丽夺目"
    },
    {
        "word": "glue",
        "definition": "n. 胶；各种胶合物 vt. 粘合；似胶般固着于"
    },
    {
        "word": "go",
        "definition": "n. 去；进行；尝试 vi. 走；达到；运转；趋于 vt. 忍受；出产；以…打赌 "
    },
    {
        "word": "goal",
        "definition": "n. 目标；球门，得分数；终点 vi. 攻门，射门得分"
    },
    {
        "word": "goat",
        "definition": "n. 山羊；替罪羊（美俚）；色鬼（美俚）"
    },
    {
        "word": "god",
        "definition": ""
    },
    {
        "word": "gold",
        "definition": "n. 金，黄金；金色；金币 adj. 金的，金制的；金色的"
    },
    {
        "word": "golden",
        "definition": "adj. 金色的，黄金般的；珍贵的；金制的"
    },
    {
        "word": "golf",
        "definition": "n. 高尔夫球；高尔夫球运动 vi. 打高尔夫球"
    },
    {
        "word": "good",
        "definition": "n. 好处；善行；慷慨的行为 adj. 好的；优良的；愉快的；虔诚的 adv. 好"
    },
    {
        "word": "goodbye",
        "definition": "int. 再见 放弃 告别"
    },
    {
        "word": "goodness",
        "definition": "n. 善良，优秀 ；精华，养分 int. 天哪"
    },
    {
        "word": "goods",
        "definition": "n. 商品；动产；合意的人；真本领"
    },
    {
        "word": "goose",
        "definition": "n. 鹅；鹅肉；傻瓜；雌鹅 vt. 突然加大油门；嘘骂"
    },
    {
        "word": "gorgeous",
        "definition": "adj. 华丽的，灿烂的；极好的"
    },
    {
        "word": "gossip",
        "definition": "n. 小道传闻；随笔；爱说长道短的人 vi. 闲聊；传播流言蜚语"
    },
    {
        "word": "govern",
        "definition": "vt. 管理；支配；统治；控制 vi. 居支配地位；进行统治"
    },
    {
        "word": "government",
        "definition": "n. 政府；政体；管辖"
    },
    {
        "word": "governor",
        "definition": "n. 主管人员；统治者，管理者； 调节器；地方长官"
    },
    {
        "word": "gown",
        "definition": "n. 长袍，长外衣；礼服；睡袍；法衣 vt. 使穿睡衣"
    },
    {
        "word": "grab",
        "definition": "n. 攫取；霸占；夺取之物 vt. 攫取；霸占；将…深深吸引 vi. 攫取；夺取"
    },
    {
        "word": "grace",
        "definition": "n. 优雅；恩惠；魅力；慈悲 vt. 使优美"
    },
    {
        "word": "graceful",
        "definition": "adj. 优雅的；优美的"
    },
    {
        "word": "gracious",
        "definition": "adj. 亲切的；高尚的；和蔼的；雅致的 int. 天哪；哎呀"
    },
    {
        "word": "grade",
        "definition": "n. 年级；等级；成绩；级别；阶段 vt. 评分；把…分等级 vi. 分等级；逐渐变化"
    },
    {
        "word": "gradual",
        "definition": "n. 弥撒升阶圣歌集 adj. 逐渐的；平缓的"
    },
    {
        "word": "gradually",
        "definition": "adv. 逐步地；渐渐地"
    },
    {
        "word": "graduate",
        "definition": "n. 研究生；毕业生 adj. 毕业的；研究生的 vt. 授予…学位；分等级；标上刻度 vi. 毕业；渐变"
    },
    {
        "word": "graduation",
        "definition": "n. 毕业；毕业典礼；刻度，分度；分等级"
    },
    {
        "word": "grain",
        "definition": "n. 粮食；颗粒； 谷物；纹理 vt. 使成谷粒 vi. 成谷粒"
    },
    {
        "word": "gram",
        "definition": "n. 克；鹰嘴豆（用作饲料）"
    },
    {
        "word": "gramme",
        "definition": "n. 克"
    },
    {
        "word": "grammar",
        "definition": "n. 语法；语法书"
    },
    {
        "word": "grammatical",
        "definition": "adj. 文法的；符合语法规则的"
    },
    {
        "word": "grand",
        "definition": "n. 大钢琴；一千美元 adj. 宏伟的；豪华的；极重要的"
    },
    {
        "word": "grandchild",
        "definition": "n. 孙子；孙女；外孙；外孙女"
    },
    {
        "word": "grandchildren",
        "definition": "n. 孙子；孙（女），外孙（女）( grandchild的名词复数 )"
    },
    {
        "word": "grandson",
        "definition": "n. 孙子；外孙"
    },
    {
        "word": "granddaughter",
        "definition": "n. 孙女；外孙女"
    },
    {
        "word": "grandparent",
        "definition": "n. 祖父母；祖父或祖母；外祖父母；外祖父或外祖母"
    },
    {
        "word": "grandfather",
        "definition": "n. 祖父；始祖 vt. 不受新规定限制"
    },
    {
        "word": "grandmother",
        "definition": "n. 祖母；女祖先 vt. 当…的祖母 vi. 当祖母"
    },
    {
        "word": "grant",
        "definition": "n. 拨款； 授予物 vt. 授予；允许；承认 vi. 同意"
    },
    {
        "word": "granted",
        "definition": "conj. 诚然 adv. 的确 vt. grant的过去式"
    },
    {
        "word": "grape",
        "definition": "n. 葡萄；葡萄酒；葡萄树；葡萄色"
    },
    {
        "word": "graph",
        "definition": "n. 图表；曲线图 vt. 用曲线图表示"
    },
    {
        "word": "graphic",
        "definition": "adj. 形象的；图表的；绘画似的"
    },
    {
        "word": "graphically",
        "definition": "adv. 生动地；活灵活现地；用图表表示；轮廓分明地"
    },
    {
        "word": "grasp",
        "definition": "n. 抓住；理解；控制 vi. 抓 vt. 抓住；领会"
    },
    {
        "word": "grass",
        "definition": "n. 草；草地，草坪 vt. 放牧；使……长满草；使……吃草 vi. 长草"
    },
    {
        "word": "grassy",
        "definition": "adj. 长满草的；草绿色的"
    },
    {
        "word": "grateful",
        "definition": "adj. 感谢的；令人愉快的，宜人的"
    },
    {
        "word": "gratitude",
        "definition": "n. 感谢（的心情）；感激"
    },
    {
        "word": "grave",
        "definition": "n. 墓穴，坟墓；死亡 adj. 重大的；严肃的；黯淡的 vt. 雕刻；铭记"
    },
    {
        "word": "gravitation",
        "definition": "n. 重力；万有引力；地心吸力"
    },
    {
        "word": "gravity",
        "definition": "n. 重力，地心引力；严重性；庄严"
    },
    {
        "word": "gray",
        "definition": "n. 灰色；暗淡的光线 adj. 灰色的；苍白的；灰白头发的；阴郁的 vt. 使成灰色或灰白 vi. 成为灰色或灰白"
    },
    {
        "word": "grey",
        "definition": "n. 灰色 adj. 灰色的；灰白的 vt. 使变成灰色；使变老 vi. 变成灰色；老化"
    },
    {
        "word": "great",
        "definition": "n. 大师；大人物；伟人们 adj. 伟大的，重大的；极好的，好的；主要的"
    },
    {
        "word": "green",
        "definition": "n. 绿色；青春 adj. 绿色的；青春的 vt. 使…变绿色 vi. 变绿色"
    },
    {
        "word": "greenhouse",
        "definition": "n. 温室 造成温室效应的"
    },
    {
        "word": "greet",
        "definition": "vt. 欢迎，迎接；致敬，致意；映入眼帘"
    },
    {
        "word": "greeting",
        "definition": "n. 问候，招呼；祝贺 v. 致敬，欢迎（greet的现在分词）"
    },
    {
        "word": "grief",
        "definition": "n. 悲痛；忧伤；不幸"
    },
    {
        "word": "grieve",
        "definition": "vi. 悲痛，哀悼 vt. 使悲伤，使苦恼"
    },
    {
        "word": "grievous",
        "definition": "adj. 痛苦的；剧烈的"
    },
    {
        "word": "grin",
        "definition": "n. 露齿笑 v. 露齿而笑，咧着嘴笑"
    },
    {
        "word": "grind",
        "definition": "n. 磨；苦工作 vt. 磨碎；磨快 vi. 磨碎；折磨"
    },
    {
        "word": "grip",
        "definition": "n. 紧握；柄；支配；握拍方式；拍柄绷带 vt. 紧握；夹紧 vi. 抓住"
    },
    {
        "word": "grocer",
        "definition": "n. 杂货店；食品商"
    },
    {
        "word": "grocery",
        "definition": "n. 食品杂货店 食品杂货"
    },
    {
        "word": "gross",
        "definition": "n. 总额，总数 adj. 总共的；粗野的；恶劣的；显而易见的 vt. 总共收入"
    },
    {
        "word": "ground",
        "definition": "n. 地面；土地；范围；战场;根据 v. 研磨（grind的过去分词）；压迫 adj. 土地的；地面上的；磨碎的；磨过的 vt. 使接触地面；打基础；使搁浅 vi. 着陆；搁浅"
    },
    {
        "word": "group",
        "definition": "n. 组；团体 adj. 群的；团体的 vt. 把…聚集；把…分组 vi. 聚合"
    },
    {
        "word": "grow",
        "definition": "vi. 发展；生长；渐渐变得… vt. 使生长；种植；扩展"
    },
    {
        "word": "growth",
        "definition": "n. 增长；发展；生长；种植"
    },
    {
        "word": "guarantee",
        "definition": "n. 保证；担保；保证人；保证书；抵押品 vt. 保证；担保"
    },
    {
        "word": "guard",
        "definition": "n. 守卫；警戒；护卫队；防护装置 vi. 警惕 vt. 保卫；监视"
    },
    {
        "word": "guardian",
        "definition": "n.  监护人，保护人；守护者 adj. 守护的"
    },
    {
        "word": "guess",
        "definition": "n. 猜测；推测 vi. 猜；推测；猜中 vt. 猜测；认为；推测；猜中 n. 盖尔斯（美国服装品牌）"
    },
    {
        "word": "guest",
        "definition": "n. 客人，宾客；顾客 adj. 客人的；特邀的，客座的 vt. 款待，招待 vi. 作客，寄宿"
    },
    {
        "word": "guide",
        "definition": "n. 指南；向导；入门书 vt. 引导；带领；操纵 vi. 担任向导"
    },
    {
        "word": "guidance",
        "definition": "n. 指导，引导；领导"
    },
    {
        "word": "guideline",
        "definition": "n. 指导方针 参考"
    },
    {
        "word": "guilt",
        "definition": "n. 犯罪，过失；内疚"
    },
    {
        "word": "guilty",
        "definition": "adj. 有罪的；内疚的"
    },
    {
        "word": "guitar",
        "definition": "n. 吉他，六弦琴 vi. 弹吉他"
    },
    {
        "word": "guitarist",
        "definition": "n. 吉他弹奏者"
    },
    {
        "word": "gulf",
        "definition": "n. 海湾；深渊；分歧；漩涡 vt. 吞没"
    },
    {
        "word": "gum",
        "definition": "n. 口香糖；树胶；橡皮 vt. 用胶粘，涂以树胶；使…有粘性"
    },
    {
        "word": "gun",
        "definition": "n. 枪支；枪状物；持枪歹徒 vt. 向…开枪；开大油门 vi. 用枪射击；加大油门快速前进"
    },
    {
        "word": "gut",
        "definition": "n. 内脏；肠子；剧情；胆量；海峡；勇气；直觉；肠 vt. 取出内脏；摧毁（建筑物等）的内部 adj. 简单的；本质的，根本的；本能的，直觉的"
    },
    {
        "word": "guy",
        "definition": "n. 男人，家伙 vt. 嘲弄，取笑 vi. 逃跑"
    },
    {
        "word": "gym",
        "definition": "n. 健身房；体育；体育馆"
    },
    {
        "word": "gymnasium",
        "definition": "n. 体育馆；健身房"
    },
    {
        "word": "habit",
        "definition": "n. 习惯，习性；嗜好 vt. 使穿衣"
    },
    {
        "word": "habitual",
        "definition": "adj. 习惯的；惯常的；习以为常的"
    },
    {
        "word": "habitat",
        "definition": "n.  栖息地，产地"
    },
    {
        "word": "hack",
        "definition": "n. 砍，劈；出租马车 vt. 砍；出租 vi. 砍"
    },
    {
        "word": "hacker",
        "definition": "n. 电脑黑客，企图不法侵入他人电脑系统的人"
    },
    {
        "word": "hail",
        "definition": "n. 冰雹；致敬；招呼；一阵 vt. 致敬；招呼；向...欢呼；猛发；使像下雹样落下（过去式hailed，过去分词hailed，现在分词hailing，第三人称单数hails） int. 万岁；欢迎 vi. 招呼；下雹"
    },
    {
        "word": "hair",
        "definition": "n. 头发；毛发；些微 adj. 毛发的；护理毛发的；用毛发制成的 vt. 除去…的毛发 vi. 生长毛发；形成毛状纤维"
    },
    {
        "word": "hairy",
        "definition": "adj. 多毛的；毛状的；长毛的"
    },
    {
        "word": "half",
        "definition": "n. 一半；半场；半学年 adj. 一半的；不完全的；半途的 adv. 一半地；部分地"
    },
    {
        "word": "halfway",
        "definition": "adj. 中途的；不彻底的 adv. 到一半；在中途"
    },
    {
        "word": "hall",
        "definition": "n. 过道，门厅，走廊；会堂；食堂；学生宿舍；大厅，前厅；娱乐中心，会所"
    },
    {
        "word": "halt",
        "definition": "n. 停止；立定；休息 vt. 使停止；使立定 vi. 停止；立定；踌躇，犹豫"
    },
    {
        "word": "ham",
        "definition": "adj. 过火的；做作的 vi. 表演过火 vt. 演得过火 n. 火腿；业余无线电爱好者；蹩脚演员"
    },
    {
        "word": "hamburger",
        "definition": "n. 汉堡包，火腿汉堡；牛肉饼，肉饼；碎牛肉"
    },
    {
        "word": "burger",
        "definition": "n. 汉堡包"
    },
    {
        "word": "hammer",
        "definition": "n. 铁锤；链球； 锤骨；音锤 vi. 锤击；敲打；重复 vt. 锤击；锤打"
    },
    {
        "word": "hand",
        "definition": "n. 手，手艺；帮助；指针；插手 vt. 传递，交给；支持；搀扶"
    },
    {
        "word": "handful",
        "definition": "n. 少数；一把；棘手事"
    },
    {
        "word": "handbook",
        "definition": "n. 手册；指南"
    },
    {
        "word": "handicap",
        "definition": "n. 障碍；不利条件，不利的因素 vt. 妨碍，阻碍；使不利"
    },
    {
        "word": "handicapped",
        "definition": "n. 残疾人；缺陷者 adj. 残废的；有生理缺陷的"
    },
    {
        "word": "handle",
        "definition": "n.  把手；柄；手感；口实 vt. 处理；操作；运用；买卖；触摸 vi. 搬运；易于操纵"
    },
    {
        "word": "handsome",
        "definition": "adj. （男子）英俊的；可观的；大方的，慷慨的；健美而端庄的"
    },
    {
        "word": "handwriting",
        "definition": "n. 笔迹；书法；书写；手稿 v. 亲手写（handwrite的ing形式）"
    },
    {
        "word": "handy",
        "definition": "adj. 便利的；手边的，就近的；容易取得的；敏捷的"
    },
    {
        "word": "hang",
        "definition": "n. 悬挂；暂停，中止 vt. 悬挂，垂下；装饰；绞死；使悬而未决 vi. 悬着，垂下；被绞死；悬而不决"
    },
    {
        "word": "happen",
        "definition": "vi. 发生；碰巧；偶然遇到"
    },
    {
        "word": "happy",
        "definition": "adj. 幸福的；高兴的；巧妙的"
    },
    {
        "word": "happiness",
        "definition": "n. 幸福"
    },
    {
        "word": "happily",
        "definition": "adv. 快乐地；幸福地；幸运地；恰当地"
    },
    {
        "word": "harbor",
        "definition": "n. 海港；避难所 vt. 庇护；怀有 vi. 居住，生存；入港停泊；躲藏"
    },
    {
        "word": "harbour",
        "definition": "n. 海港（等于harbor）；避难所 vt. 庇护；藏匿；入港停泊 vi. 藏匿；入港停泊；庇护"
    },
    {
        "word": "hard",
        "definition": "adj. 努力的；硬的；困难的；辛苦的；确实的；严厉的；猛烈的；冷酷无情的 adv. 努力地；困难地；辛苦地；接近地；猛烈地；牢固地"
    },
    {
        "word": "harden",
        "definition": "vi. 变硬，变坚固；变坚强；变冷酷 vt. 使…变硬；使…坚强；使…冷酷；使…麻木不仁"
    },
    {
        "word": "hardly",
        "definition": "adv. 几乎不，简直不；刚刚"
    },
    {
        "word": "hardship",
        "definition": "n. 困苦；苦难；艰难险阻"
    },
    {
        "word": "hardware",
        "definition": "n. 计算机硬件；五金器具"
    },
    {
        "word": "harm",
        "definition": "n. 伤害；损害 vt. 伤害；危害；损害"
    },
    {
        "word": "harmful",
        "definition": "adj. 有害的；能造成损害的"
    },
    {
        "word": "harmless",
        "definition": "adj. 无害的；无恶意的"
    },
    {
        "word": "harmony",
        "definition": "n. 协调；和睦；融洽；调和"
    },
    {
        "word": "harmonious",
        "definition": "adj. 和谐的，和睦的；协调的；悦耳的"
    },
    {
        "word": "harness",
        "definition": "n. 马具；甲胄；挽具状带子；降落伞背带；日常工作 vt. 治理；套；驾驭；披上甲胄；利用"
    },
    {
        "word": "harsh",
        "definition": "adj. 严厉的；严酷的；刺耳的；粗糙的；刺目的"
    },
    {
        "word": "harvest",
        "definition": "n. 收获；产量；结果 vt. 收割；得到 vi. 收割庄稼"
    },
    {
        "word": "haste",
        "definition": "n. 匆忙；急忙；轻率 vt. 赶快 vi. 匆忙；赶紧"
    },
    {
        "word": "hasty",
        "definition": "adj. 轻率的；匆忙的；草率的；懈怠的 "
    },
    {
        "word": "hasten",
        "definition": "vt. 加速；使赶紧；催促 vi. 赶快；急忙"
    },
    {
        "word": "hat",
        "definition": "n. 帽子 vt. 给……戴上帽子 vi. 供应帽子；制造帽子"
    },
    {
        "word": "hatch",
        "definition": "n. 孵化；舱口 vt. 孵；策划 vi. 孵化"
    },
    {
        "word": "hate",
        "definition": "n. 憎恨；反感 vt. 憎恨；厌恶；遗憾 vi. 仇恨"
    },
    {
        "word": "hatred",
        "definition": "n. 憎恨；怨恨；敌意"
    },
    {
        "word": "hateful",
        "definition": "adj. 可憎的；可恨的；可恶的"
    },
    {
        "word": "haul",
        "definition": "n. 拖，拉；用力拖拉；努力得到的结果；捕获物；一网捕获的鱼量；拖运距离 vt. 拖运；拖拉 vi. 拖，拉；改变主意；改变方向"
    },
    {
        "word": "haunt",
        "definition": "n. 栖息地；常去的地方 vt. 常出没于…；萦绕于…；经常去… vi. 出没；作祟"
    },
    {
        "word": "have",
        "definition": "aux. 已经 vt. 有；让；拿；从事；允许"
    },
    {
        "word": "hay",
        "definition": "n. 干草 vt. 把晒干 vi. 割草晒干"
    },
    {
        "word": "hazard",
        "definition": "n. 危险，冒险；冒险的事 vt. 赌运气；冒…的危险，使遭受危险"
    },
    {
        "word": "hazardous",
        "definition": "adj. 有危险的；冒险的；碰运气的"
    },
    {
        "word": "haze",
        "definition": "n. 阴霾；薄雾；疑惑 vt. 使变朦胧；使变糊涂 vi. 变朦胧；变糊涂"
    },
    {
        "word": "hazy",
        "definition": "adj. 朦胧的；模糊的；有薄雾的"
    },
    {
        "word": "he",
        "definition": "n. 男孩，男人；它（雄性动物） pron. 他"
    },
    {
        "word": "head",
        "definition": "n. 头；头痛；上端；最前的部分；理解力 adj. 头的；主要的；在顶端的 vt. 前进；用头顶；作为…的首领；站在…的前头；给…加标题 vi. 出发；成头状物；船驶往"
    },
    {
        "word": "headache",
        "definition": "n. 头痛；麻烦；令人头痛之事"
    },
    {
        "word": "heading",
        "definition": "n. 标题；（足球）头球；信头 v. 用头顶（head的ing形式）"
    },
    {
        "word": "headline",
        "definition": "n. 大标题；内容提要；栏外标题；头版头条新闻 vt. 给…加标题；使成为注意中心；大力宣传"
    },
    {
        "word": "headmaster",
        "definition": "n. 校长"
    },
    {
        "word": "headmistress",
        "definition": "n. 女校长"
    },
    {
        "word": "headquarters",
        "definition": "n. 总部；指挥部；司令部"
    },
    {
        "word": "heal",
        "definition": "vt. 治愈，痊愈；和解 vi. 痊愈"
    },
    {
        "word": "health",
        "definition": "n. 健康；卫生；保健；兴旺"
    },
    {
        "word": "healthy",
        "definition": "adj. 健康的，健全的；有益于健康的"
    },
    {
        "word": "healthful",
        "definition": "adj. 健康的；有益健康的；卫生的"
    },
    {
        "word": "heap",
        "definition": "n. 堆；许多；累积 vt. 堆；堆积 vi. 堆起来"
    },
    {
        "word": "hear",
        "definition": "vi. 听；听见 vt. 听到，听；听说；审理"
    },
    {
        "word": "hearing",
        "definition": "n. 听力；审讯，听讯 v. 听见（hear的ing形式）"
    },
    {
        "word": "heart",
        "definition": "n. 心脏；感情；勇气；心形；要点 vt. 鼓励；铭记 vi. 结心"
    },
    {
        "word": "hearty",
        "definition": "n. 朋友们；伙伴们 adj. 衷心的；丰盛的；健壮的；精神饱满的"
    },
    {
        "word": "heartfelt",
        "definition": "adj. 衷心的；真诚的；真心真意的"
    },
    {
        "word": "heat",
        "definition": "n. 高温；压力；热度；热烈 vt. 使激动；把…加热"
    },
    {
        "word": "heated",
        "definition": "adj. 热的；激昂的；激动的 v. 加热；使兴奋（heat的过去分词）"
    },
    {
        "word": "heating",
        "definition": "n.  加热； 供暖；暖气设备 v.  加热（heat的现在分词） adj. 加热的；供热的"
    },
    {
        "word": "heaven",
        "definition": "n. 天堂；天空；极乐"
    },
    {
        "word": "heavy",
        "definition": "n. 重物；严肃角色 adj. 沉重的；繁重的，巨大的；拥挤的；阴沉的 adv. 大量地；笨重地"
    },
    {
        "word": "hectare",
        "definition": "n. 公顷（等于1万平方米）"
    },
    {
        "word": "hedge",
        "definition": "v. 用树篱笆围住；避免作正面答复 n. 对冲，套期保值；树篱；障碍"
    },
    {
        "word": "heel",
        "definition": "n. 脚后跟；踵 vt. 倾侧 vi. 倾侧"
    },
    {
        "word": "height",
        "definition": "n. 高地；高度；身高；顶点"
    },
    {
        "word": "heighten",
        "definition": "vt. 提高；增高；加强；使更显著 vi. 升高；变强"
    },
    {
        "word": "heir",
        "definition": "n.  继承人；后嗣；嗣子"
    },
    {
        "word": "heiress",
        "definition": "n. 女继承人"
    },
    {
        "word": "helicopter",
        "definition": "n.  直升飞机 vt. 由直升机运送 vi.  乘直升飞机"
    },
    {
        "word": "hell",
        "definition": "n. 地狱；究竟（作加强语气词）；训斥；黑暗势力 vi. 过放荡生活；飞驰 int. 该死；见鬼（表示惊奇、烦恼、厌恶、恼怒、失望等）"
    },
    {
        "word": "hello",
        "definition": "n. 表示问候， 惊奇或唤起注意时的用语 int. 喂；哈罗"
    },
    {
        "word": "help",
        "definition": "n. 帮助；补救办法；帮忙者；有益的东西 vt. 帮助；促进；治疗；补救 vi. 帮助；有用；招待"
    },
    {
        "word": "helpful",
        "definition": "adj. 有帮助的；有益的"
    },
    {
        "word": "helpless",
        "definition": "adj. 无助的；无能的；没用的"
    },
    {
        "word": "helplessly",
        "definition": "adv. 无助地；无能为力地"
    },
    {
        "word": "hen",
        "definition": "n. 母鸡；女人；雌禽"
    },
    {
        "word": "hence",
        "definition": "adv. 因此；今后"
    },
    {
        "word": "her",
        "definition": "pron. 她（she的宾格）；她的（she的所有格）；她（指某个国家；一艘船）"
    },
    {
        "word": "herd",
        "definition": "n. 兽群，畜群；放牧人 vt. 放牧；使成群 vi. 成群，聚在一起"
    },
    {
        "word": "here",
        "definition": "n. 这里 adv. 在这里；此时 int. 嘿！；喂！"
    },
    {
        "word": "hereby",
        "definition": "adv. 以此方式，据此；特此"
    },
    {
        "word": "heritage",
        "definition": "n. 遗产；传统；继承物；继承权"
    },
    {
        "word": "hero",
        "definition": "n. 英雄；男主角，男主人公"
    },
    {
        "word": "heroine",
        "definition": "n. 女主角；女英雄；女杰出人物"
    },
    {
        "word": "heroic",
        "definition": "n. 史诗；英勇行为 adj. 英雄的；英勇的；记叙英雄及其事迹的；夸张的"
    },
    {
        "word": "heroism",
        "definition": "n. 英勇，英雄气概；英雄行为；勇敢的事迹"
    },
    {
        "word": "hers",
        "definition": "pron. 她的（所有格）"
    },
    {
        "word": "herself",
        "definition": "pron. 她自己（she的反身代词）；她亲自"
    },
    {
        "word": "hesitate",
        "definition": "vt. 踌躇，犹豫；有疑虑，不愿意 vi. 踌躇，犹豫；不愿"
    },
    {
        "word": "hesitation",
        "definition": "n. 犹豫"
    },
    {
        "word": "hesitant",
        "definition": "adj. 迟疑的；踌躇的；犹豫不定的"
    },
    {
        "word": "hi",
        "definition": "int. 嗨！（表示问候或用以唤起注意）"
    },
    {
        "word": "hide",
        "definition": "n. 躲藏；兽皮；躲藏处 vt. 隐藏；隐瞒；鞭打 vi. 隐藏"
    },
    {
        "word": "hiding",
        "definition": "n. 隐匿；躲藏处；殴打"
    },
    {
        "word": "high",
        "definition": "n. 高水平；天空；由麻醉品引起的快感；高压地带 adj. 高的；高级的；崇高的；高音调的 adv. 高；奢侈地"
    },
    {
        "word": "highly",
        "definition": "adv. 高度地；非常；非常赞许地"
    },
    {
        "word": "highlight",
        "definition": "n. 最精彩的部分；最重要的事情；加亮区 vt. 突出；强调；使显著；加亮"
    },
    {
        "word": "high-tech",
        "definition": "n. 高科技 adj. 高科技的，高技术的；仿真技术的"
    },
    {
        "word": "highway",
        "definition": "n. 公路，大路；捷径"
    },
    {
        "word": "hijack",
        "definition": "n. 劫持；威逼；敲诈 vt. 抢劫；揩油 vi. 拦路抢劫"
    },
    {
        "word": "hill",
        "definition": "n. 小山；丘陵；斜坡；山冈"
    },
    {
        "word": "hilly",
        "definition": "adj. 丘陵的；陡的；多小山的；多坡的"
    },
    {
        "word": "him",
        "definition": "pron. 他（宾格）"
    },
    {
        "word": "himself",
        "definition": "pron. 他自己；他亲自，他本人"
    },
    {
        "word": "hinder",
        "definition": "vt. 阻碍；打扰 adj. 后面的 vi. 成为阻碍"
    },
    {
        "word": "hindrance",
        "definition": "n. 障碍；妨碍；妨害；阻碍物"
    },
    {
        "word": "hint",
        "definition": "n. 暗示；线索 vt. 暗示；示意 vi. 示意"
    },
    {
        "word": "hip",
        "definition": "n. 臀部；蔷薇果；忧郁 adj. 熟悉内情的；非常时尚的"
    },
    {
        "word": "hire",
        "definition": "n. 雇用，租用；租金，工钱 vt. 雇用；出租 vi. 雇用，租用；受雇"
    },
    {
        "word": "his",
        "definition": "pron. 他的"
    },
    {
        "word": "history",
        "definition": "n. 历史，历史学；历史记录；来历"
    },
    {
        "word": "historic",
        "definition": "adj. 有历史意义的；历史上著名的"
    },
    {
        "word": "historical",
        "definition": "adj. 历史的；史学的；基于史实的"
    },
    {
        "word": "historian",
        "definition": "n. 历史学家"
    },
    {
        "word": "hit",
        "definition": "n. 打；打击；（演出等）成功；讽刺 vt. 打击；袭击；碰撞；偶然发现；伤…的感情 vi. 打；打击；碰撞；偶然碰上"
    },
    {
        "word": "hobby",
        "definition": "n. 嗜好；业余爱好"
    },
    {
        "word": "hold",
        "definition": "n. 控制；保留 vi. 支持；有效；持续 vt. 持有；拥有；保存；拘留；约束或控制 又作“Hold住”使用，中英混用词汇，表示轻松掌控全局。 "
    },
    {
        "word": "hole",
        "definition": "n. 洞，孔；洞穴，穴；突破口 vt. 凿洞 vi. 凿洞，穿孔；（高尔夫球等）进洞"
    },
    {
        "word": "holiday",
        "definition": "n. 假日；节日；休息日 vi. 外出度假"
    },
    {
        "word": "hollow",
        "definition": "n. 洞；山谷；窟窿 adj. 空的；中空的，空腹的；凹的；虚伪的 vt. 使成为空洞 adv. 彻底地；无用地 vi. 形成空洞"
    },
    {
        "word": "holy",
        "definition": "n. 神圣的东西 adj. 圣洁的，神圣的；至善的 （俚）太棒了"
    },
    {
        "word": "holiness",
        "definition": "n. 神圣；圣座（大写，对教宗等的尊称）"
    },
    {
        "word": "home",
        "definition": "n. 家，住宅；产地；家乡；避难所 adj. 国内的，家庭的；有效的 vt. 归巢，回家 adv. 在家，回家；深入地"
    },
    {
        "word": "homeless",
        "definition": "adj. 无家可归的 无家可归的人 无家可归"
    },
    {
        "word": "homely",
        "definition": "adj. 家庭的；平凡的；不好看的"
    },
    {
        "word": "homeland",
        "definition": "n. 祖国；故乡"
    },
    {
        "word": "homework",
        "definition": "n. 家庭作业，课外作业"
    },
    {
        "word": "homosexual",
        "definition": "n. 同性恋者 adj. 同性恋的"
    },
    {
        "word": "homo",
        "definition": ""
    },
    {
        "word": "honest",
        "definition": "adj. 诚实的，实在的；可靠的；坦率的"
    },
    {
        "word": "honesty",
        "definition": "n. 诚实，正直"
    },
    {
        "word": "honey",
        "definition": "n. 蜂蜜；宝贝；甜蜜 adj. 甘美的；蜂蜜似的 vt. 对…说甜言蜜语；加蜜使甜 vi. 奉承；说甜言蜜语"
    },
    {
        "word": "honeymoon",
        "definition": "n. 蜜月；蜜月假期；（新生事物、新建关系等的）短暂的和谐时期 vi. 度蜜月"
    },
    {
        "word": "honor",
        "definition": "n. 荣誉；信用；头衔 vt. 尊敬（等于honour）；给…以荣誉"
    },
    {
        "word": "honour",
        "definition": "n. 荣誉；尊敬；勋章 vt. 尊敬； 承兑；承兑远期票据"
    },
    {
        "word": "honorable",
        "definition": "adj. 光荣的；可敬的；高贵的"
    },
    {
        "word": "honourable",
        "definition": "adj. 荣誉的；值得尊敬的；表示尊敬的；正直的"
    },
    {
        "word": "honorary",
        "definition": "n. 名誉学位；获名誉学位者；名誉团体 adj. 荣誉的；名誉的；道义上的"
    },
    {
        "word": "honourary",
        "definition": " 荣誉"
    },
    {
        "word": "hook",
        "definition": "n. 挂钩，吊钩 vt. 钩住；引上钩 vi. 钩住；弯成钩状"
    },
    {
        "word": "hope",
        "definition": "n. 希望；期望；信心 vi. 希望；期待；信赖 vt. 希望；期望"
    },
    {
        "word": "hopeful",
        "definition": "n. 有希望成功的人 adj. 有希望的；有前途的"
    },
    {
        "word": "hopeless",
        "definition": "adj. 绝望的；不可救药的"
    },
    {
        "word": "horizon",
        "definition": "n.  地平线；视野；眼界；范围"
    },
    {
        "word": "horizontal",
        "definition": "n. 水平线，水平面；水平位置 adj. 水平的；地平线的；同一阶层的"
    },
    {
        "word": "horn",
        "definition": "n. 喇叭，号角；角 vt. 装角于"
    },
    {
        "word": "horror",
        "definition": "n. 惊骇；惨状；极端厌恶；令人恐怖的事物"
    },
    {
        "word": "horrible",
        "definition": "adj. 可怕的；极讨厌的"
    },
    {
        "word": "horrify",
        "definition": "vt. 使恐惧；惊骇；使极度厌恶"
    },
    {
        "word": "horse",
        "definition": "n. 马；骑兵；脚架；海洛因 vt. 使骑马；系马于；捉弄 vi. 骑马；作弄人"
    },
    {
        "word": "horsepower",
        "definition": "n. 马力（功率单位）"
    },
    {
        "word": "hospital",
        "definition": "n. 医院"
    },
    {
        "word": "hospitalize",
        "definition": "vt. 就医；送…进医院治疗"
    },
    {
        "word": "hospitable",
        "definition": "adj. 热情友好的；（环境）舒适的"
    },
    {
        "word": "hospitality",
        "definition": "n. 好客；殷勤"
    },
    {
        "word": "host",
        "definition": "n.  主机；主人；主持人；许多 vt. 主持；当主人招待 vi. 群集；做主人"
    },
    {
        "word": "hostess",
        "definition": "n. 女主人，女老板；女服务员；舞女；女房东"
    },
    {
        "word": "hostile",
        "definition": "n. 敌对 adj. 敌对的，敌方的；怀敌意的"
    },
    {
        "word": "hostility",
        "definition": "n. 敌意；战争行动"
    },
    {
        "word": "hot",
        "definition": "adj. 热的；辣的；热情的；激动的；紧迫的 vt. 增加；给…加温 adv. 热；紧迫地 vi. 变热"
    },
    {
        "word": "hotdog",
        "definition": "v. 卖弄 n. 热狗（面包）"
    },
    {
        "word": "hotel",
        "definition": "n. 旅馆，饭店；客栈 vt. 使…在饭店下榻 vi. 进行旅馆式办公"
    },
    {
        "word": "hour",
        "definition": "n. 小时；钟头；课时；…点钟"
    },
    {
        "word": "hourly",
        "definition": "adj. 每小时的，以钟点计算的；频繁的 adv. 每小时地；频繁地，随时"
    },
    {
        "word": "house",
        "definition": "n. 住宅；家庭；机构；议会；某种用途的建筑物 vt. 覆盖；给…房子住；把…储藏在房内 vi. 住"
    },
    {
        "word": "housing",
        "definition": "n. 房屋；住房供给； 外壳；遮盖物；机器等的防护外壳或外罩"
    },
    {
        "word": "household",
        "definition": "n. 全家人，一家人；(包括佣工在内的)家庭，户 adj. 家庭的；日常的；王室的"
    },
    {
        "word": "housewife",
        "definition": "n. 家庭主妇"
    },
    {
        "word": "housework",
        "definition": "n. 家务事"
    },
    {
        "word": "how",
        "definition": "adv. 如何；多少；多么 n. 方法；方式 conj. 如何"
    },
    {
        "word": "however",
        "definition": "conj. 无论以何种方式; 不管怎样 adv. 无论如何；不管怎样（接副词或形容词）；然而；可是"
    },
    {
        "word": "hug",
        "definition": "n. 拥抱；紧抱；固执 vi. 拥抱；紧抱在一起；挤在一起 vt. 拥抱；紧抱；抱有，坚持"
    },
    {
        "word": "huge",
        "definition": "adj. 巨大的；庞大的；无限的"
    },
    {
        "word": "human",
        "definition": "n. 人；人类 adj. 人的；人类的"
    },
    {
        "word": "humanity",
        "definition": "n. 人类；人道；仁慈；人文学科"
    },
    {
        "word": "humble",
        "definition": "adj. 谦逊的；简陋的；（级别或地位）低下的；不大的 vt. 使谦恭；轻松打败（尤指强大的对手）；低声下气"
    },
    {
        "word": "humbly",
        "definition": "adv. 谦逊地；卑贱地；低声下气地"
    },
    {
        "word": "humor",
        "definition": "n. 幽默，诙谐；心情 vt. 迎合，迁就；顺应"
    },
    {
        "word": "humour",
        "definition": "n. 幽默（等于humor）；诙谐 vt. 迁就；使满足"
    },
    {
        "word": "humorous",
        "definition": "adj. 诙谐的，幽默的；滑稽的，可笑的"
    },
    {
        "word": "humourous",
        "definition": "a. 富幽默感的, 滑稽的"
    },
    {
        "word": "hundred",
        "definition": "num. 百；百个 n. 一百；许多 adj. 一百的；许多的"
    },
    {
        "word": "hunger",
        "definition": "n. 饿，饥饿；渴望 vt. 使……挨饿 vi. 渴望；挨饿"
    },
    {
        "word": "hungry",
        "definition": "adj. 饥饿的；渴望的；荒年的；不毛的"
    },
    {
        "word": "hunt",
        "definition": "n. 狩猎；搜寻 vt. 打猎；搜索 vi. 打猎；搜寻"
    },
    {
        "word": "hunting",
        "definition": "n. 打猎；追逐；搜索 v. 狩猎；寻找（hunt的ing形式）；追捕 adj. 打猎的；振荡的"
    },
    {
        "word": "hunter",
        "definition": "n. 猎人；猎犬；搜寻者"
    },
    {
        "word": "hurry",
        "definition": "n. 匆忙，急忙 v. 仓促（做某事）；催促；（朝某方向）迅速移动；迅速处理"
    },
    {
        "word": "hurriedly",
        "definition": "adv. 匆忙地；仓促地"
    },
    {
        "word": "hurt",
        "definition": "n. 痛苦；危害；痛苦的原因 vt. 使受伤；损害；使疼痛；使痛心 adj. 受伤的；痛苦的；受损的 vi. 感到疼痛；有坏处；带来痛苦"
    },
    {
        "word": "hurtful",
        "definition": "adj. 造成损害的"
    },
    {
        "word": "husband",
        "definition": "n. 丈夫 vt. 节约地使用（或管理）"
    },
    {
        "word": "hut",
        "definition": "n. 小屋；临时营房 vt. 使住在小屋中；驻扎 vi. 住在小屋中；驻扎"
    },
    {
        "word": "hydrogen",
        "definition": "n.  氢"
    },
    {
        "word": "hyphen",
        "definition": "n. 连字号 vt. 以连字号连接"
    },
    {
        "word": "I",
        "definition": "n. 碘元素；英语字母I pron. 我"
    },
    {
        "word": "ice",
        "definition": "n. 冰；冰淇淋；矜持；（俚）钻石 adj. 冰的 vt. 冰镇；结冰 vi. 结冰"
    },
    {
        "word": "icy",
        "definition": "adj. 冰冷的；冷淡的；结满冰的"
    },
    {
        "word": "ice-cream",
        "definition": "a. 冰淇淋的, 乳白色的"
    },
    {
        "word": "idea",
        "definition": "n. 想法；主意；概念"
    },
    {
        "word": "ideal",
        "definition": "n. 理想；典范 adj. 理想的；完美的；想象的；不切实际的"
    },
    {
        "word": "idealistic",
        "definition": "adj. 理想主义的；唯心论的；唯心主义者的；空想家的"
    },
    {
        "word": "idealism",
        "definition": "n. 唯心主义，理想主义；理念论"
    },
    {
        "word": "identify",
        "definition": "vt. 确定；鉴定；识别，辨认出；使参与；把…看成一样 vi. 确定；认同；一致"
    },
    {
        "word": "identification",
        "definition": "n. 鉴定，识别；认同；身份证明"
    },
    {
        "word": "identity",
        "definition": "n. 身份；同一性，一致；特性；恒等式"
    },
    {
        "word": "identical",
        "definition": "n. 完全相同的事物 adj. 同一的；完全相同的"
    },
    {
        "word": "idiom",
        "definition": "n. 成语，习语；土话"
    },
    {
        "word": "idiomatic",
        "definition": "adj. 惯用的；符合语言习惯的；通顺的"
    },
    {
        "word": "idle",
        "definition": "adj. 闲置的；懒惰的；停顿的 vt. 虚度；使空转 vi. 无所事事；虚度；空转"
    },
    {
        "word": "idly",
        "definition": "adv. 无所事事地；懒惰地，空闲地；无益地"
    },
    {
        "word": "if",
        "definition": "conj. （表条件）如果；即使；是否；（表假设）假如 n. 条件；设想"
    },
    {
        "word": "ignorant",
        "definition": "adj. 无知的；愚昧的"
    },
    {
        "word": "ignorance",
        "definition": "n. 无知，愚昧；不知，不懂"
    },
    {
        "word": "ignore",
        "definition": "vt. 驳回诉讼；忽视；不理睬"
    },
    {
        "word": "ill",
        "definition": "n. 疾病；不幸 adj. 生病的；坏的；邪恶的；不吉利的 adv. 不利地；恶劣地；几乎不"
    },
    {
        "word": "illness",
        "definition": "n. 病；疾病"
    },
    {
        "word": "illegal",
        "definition": "n. 非法移民，非法劳工 adj.  非法的；违法的；违反规则的"
    },
    {
        "word": "illusion",
        "definition": "n. 幻觉，错觉；错误的观念或信仰"
    },
    {
        "word": "illusory",
        "definition": "adj. 错觉的；幻影的；虚假的；产生幻觉的"
    },
    {
        "word": "illustrate",
        "definition": "vi. 举例 vt. 阐明，举例说明；图解"
    },
    {
        "word": "illustration",
        "definition": "n. 说明；插图；例证；图解"
    },
    {
        "word": "illustrative",
        "definition": "adj. 说明的；作例证的；解说的"
    },
    {
        "word": "image",
        "definition": "n. 影像；想象；肖像；偶像 vt. 想象；反映；象征；作…的像"
    },
    {
        "word": "imaging",
        "definition": "n. 成像 v. 想像（image的ing形式）；画…的像"
    },
    {
        "word": "imagine",
        "definition": "vi. 想像；猜想；想像起来 vt. 想像；猜想；臆断"
    },
    {
        "word": "imagination",
        "definition": "n.  想象力；空想；幻想物"
    },
    {
        "word": "imaginative",
        "definition": "adj. 富于想象的；有创造力的"
    },
    {
        "word": "imaginary",
        "definition": "adj. 虚构的，假想的；想像的；虚数的"
    },
    {
        "word": "imitate",
        "definition": "vt. 模仿，仿效；仿造，仿制"
    },
    {
        "word": "imitation",
        "definition": "n. 模仿，仿造；仿制品 adj. 人造的，仿制的"
    },
    {
        "word": "imitative",
        "definition": "adj. 模仿的；仿制的"
    },
    {
        "word": "immediate",
        "definition": "adj. 立即的；直接的；最接近的"
    },
    {
        "word": "immediately",
        "definition": "conj. 一…就 adv. 立即，立刻；直接地"
    },
    {
        "word": "immense",
        "definition": "adj. 巨大的，广大的；无边无际的；非常好的"
    },
    {
        "word": "immensely",
        "definition": "adv. 极大地；无限地；广大地；庞大地"
    },
    {
        "word": "immensity",
        "definition": "n. 巨大；无限；广大"
    },
    {
        "word": "immigrate",
        "definition": "vi. 移入 vt. 使移居入境"
    },
    {
        "word": "immigration",
        "definition": "n. 外来移民；移居"
    },
    {
        "word": "immigrant",
        "definition": "n. 移民，侨民 adj. 移民的；迁入的"
    },
    {
        "word": "immune",
        "definition": "n. 免疫者；免除者 adj. 免疫的；免于……的，免除的"
    },
    {
        "word": "immunity",
        "definition": "n. 免疫力；豁免权；免除"
    },
    {
        "word": "immunize",
        "definition": "vt. 使免疫；赋予免疫性"
    },
    {
        "word": "immunise",
        "definition": "vt. 使某人免疫"
    },
    {
        "word": "impact",
        "definition": "vi. 影响；撞击；冲突；压紧（on，upon，with） n. 影响；效果；碰撞；冲击力 vt. 挤入，压紧；撞击；对…产生影响"
    },
    {
        "word": "impatient",
        "definition": "adj. 焦躁的；不耐心的"
    },
    {
        "word": "impatience",
        "definition": "n. 急躁；无耐心"
    },
    {
        "word": "imperial",
        "definition": "n. 纸张尺寸；特等品 adj. 帝国的；皇帝的；至高无上的；威严的"
    },
    {
        "word": "imperialism",
        "definition": "n. 帝国主义"
    },
    {
        "word": "imperialist",
        "definition": "n. 帝国主义者 adj. 帝国主义的"
    },
    {
        "word": "implement",
        "definition": "n. 工具，器具；手段 vt. 实施，执行；实现，使生效"
    },
    {
        "word": "implementation",
        "definition": "n.  实现；履行；安装启用"
    },
    {
        "word": "implicit",
        "definition": "adj. 含蓄的；暗示的；盲从的"
    },
    {
        "word": "imply",
        "definition": "vt. 意味；暗示；隐含"
    },
    {
        "word": "implication",
        "definition": "n. 含义；暗示；牵连，卷入；可能的结果，影响"
    },
    {
        "word": "import",
        "definition": "n. 进口，进口货；输入；意思，含义；重要性 vt. 输入，进口；含…的意思 vi. 输入，进口"
    },
    {
        "word": "importation",
        "definition": "n. 进口；输入品"
    },
    {
        "word": "important",
        "definition": "adj. 重要的，重大的；有地位的；有权力的"
    },
    {
        "word": "importance",
        "definition": "n. 价值；重要；重大；傲慢"
    },
    {
        "word": "impose",
        "definition": "vt. 强加；征税；以…欺骗 vi. 利用；欺骗；施加影响"
    },
    {
        "word": "imposition",
        "definition": "n. 征收；强加；欺骗；不公平的负担"
    },
    {
        "word": "imposing",
        "definition": "v. impose的ing形式 adj. （建筑物等）壮观的；威风的；（仪表）堂堂的；给人深刻印象的"
    },
    {
        "word": "impossible",
        "definition": "n. 不可能；不可能的事 adj. 不可能的；不可能存在的；难以忍受的；不真实的"
    },
    {
        "word": "impossibility",
        "definition": "n. 不可能；不可能的事"
    },
    {
        "word": "impress",
        "definition": "n. 印象，印记；特征，痕迹 vi. 给人印象 vt. 盖印；强征；传送；给予某人深刻印象"
    },
    {
        "word": "impression",
        "definition": "n. 印象；效果，影响；压痕，印记；感想；曝光（衡量广告被显示的次数。打开一个带有该广告的网页，则该广告的impression 次数增加一次）"
    },
    {
        "word": "impressive",
        "definition": "adj. 感人的；令人钦佩的；给人以深刻印象的"
    },
    {
        "word": "improve",
        "definition": "vt. 改善，增进；提高…的价值 vi. 增加；变得更好"
    },
    {
        "word": "improvement",
        "definition": "n. 改进，改善；提高"
    },
    {
        "word": "impulse",
        "definition": "n. 冲动； 脉冲；刺激；神经冲动；推动力 vt. 推动"
    },
    {
        "word": "impulsive",
        "definition": "adj. 冲动的；受感情驱使的；任性的"
    },
    {
        "word": "in",
        "definition": "prep. 按照（表示方式）；从事于；在…之内 n. 执政者；门路；知情者 adj. 在里面的；时髦的 adv. 进入；当选；（服装等）时髦；在屋里"
    },
    {
        "word": "incentive",
        "definition": "n. 动机；刺激 adj. 激励的；刺激的"
    },
    {
        "word": "inch",
        "definition": "n. 英寸；身高；少许 vt. 使缓慢地移动 vi. 慢慢前进"
    },
    {
        "word": "incidence",
        "definition": "n. 发生率；影响； 入射；影响范围"
    },
    {
        "word": "incident",
        "definition": "n. 事件，事变；插曲 adj.  入射的；附带的；易发生的，伴随而来的"
    },
    {
        "word": "incidental",
        "definition": "n. 附带事件；偶然事件；杂项 adj. 附带的；偶然的；容易发生的"
    },
    {
        "word": "incidentally",
        "definition": "adv. 顺便；偶然地；附带地"
    },
    {
        "word": "incline",
        "definition": "n. 倾斜；斜面；斜坡 vt. 使倾斜；使倾向于 vi. 倾斜；倾向；易于"
    },
    {
        "word": "inclined",
        "definition": "v. 使…倾向（incline的过去分词） adj. 趋向于…的"
    },
    {
        "word": "inclination",
        "definition": "n. 倾向，爱好；斜坡"
    },
    {
        "word": "include",
        "definition": "vt. 包含，包括"
    },
    {
        "word": "inclusion",
        "definition": "n. 包含；内含物"
    },
    {
        "word": "inclusive",
        "definition": "adj. 包括的，包含的"
    },
    {
        "word": "including",
        "definition": "prep. 包含，包括"
    },
    {
        "word": "income",
        "definition": "n. 收入，收益；所得"
    },
    {
        "word": "increase",
        "definition": "n. 增加，增长；提高 vt. 增加，加大 vi. 增加，增大；繁殖"
    },
    {
        "word": "increasingly",
        "definition": "adv. 越来越多地；渐增地"
    },
    {
        "word": "incredible",
        "definition": "adj. 难以置信的，惊人的"
    },
    {
        "word": "incredibly",
        "definition": "adv. 难以置信地；非常地"
    },
    {
        "word": "indeed",
        "definition": "adv. 的确；实在；真正地；甚至 int. 真的（表示惊讶、怀疑、讽刺等）"
    },
    {
        "word": "independent",
        "definition": "n. 独立自主者；无党派者 adj. 独立的；单独的；无党派的；不受约束的"
    },
    {
        "word": "independence",
        "definition": "n. 独立性，自立性；自主"
    },
    {
        "word": "index",
        "definition": "n. 指标；指数；索引；指针 vt. 指出；编入索引中 vi. 做索引"
    },
    {
        "word": "indicate",
        "definition": "vt. 表明；指出；预示；象征"
    },
    {
        "word": "indication",
        "definition": "n. 指示，指出；迹象；象征"
    },
    {
        "word": "indicative",
        "definition": "n. 陈述语气；陈述语气的动词形式 adj. 象征的；指示的；表示…的"
    },
    {
        "word": "indicator",
        "definition": "n. 指示器； 指示剂； 指示符；压力计"
    },
    {
        "word": "indifferent",
        "definition": "adj. 漠不关心的；无关紧要的；中性的，中立的"
    },
    {
        "word": "indifference",
        "definition": "n. 漠不关心；冷淡；不重视；中立"
    },
    {
        "word": "indispensable",
        "definition": "n. 不可缺少之物；必不可少的人 adj. 不可缺少的；绝对必要的；责无旁贷的"
    },
    {
        "word": "individual",
        "definition": "n. 个人，个体 adj. 个人的；个别的；独特的"
    },
    {
        "word": "individualism",
        "definition": "n. 个人主义；利己主义；个人特征"
    },
    {
        "word": "indoor",
        "definition": "adj. 室内的，户内的"
    },
    {
        "word": "indoors",
        "definition": "adv. 在室内，在户内"
    },
    {
        "word": "induce",
        "definition": "vt. 诱导；引起；引诱；感应"
    },
    {
        "word": "inducement",
        "definition": "n. 诱因，刺激物"
    },
    {
        "word": "industry",
        "definition": "n. 产业；工业；勤勉"
    },
    {
        "word": "industrial",
        "definition": "n. 工业股票；工业工人 adj. 工业的，产业的；从事工业的；供工业用的；来自勤劳的"
    },
    {
        "word": "industrialize",
        "definition": "vt. 使工业化 vi. 实现工业化"
    },
    {
        "word": "industrialise",
        "definition": "vt. 使工业化（等于industrialize）"
    },
    {
        "word": "industrious",
        "definition": "adj. 勤勉的"
    },
    {
        "word": "inevitable",
        "definition": "adj. 必然的，不可避免的"
    },
    {
        "word": "infant",
        "definition": "n. 婴儿；幼儿；未成年人 adj. 婴儿的；幼稚的；初期的；未成年的"
    },
    {
        "word": "infect",
        "definition": "vt. 感染，传染"
    },
    {
        "word": "infection",
        "definition": "n. 感染；传染；影响；传染病"
    },
    {
        "word": "infectious",
        "definition": "adj. 传染的；传染性的；易传染的"
    },
    {
        "word": "infer",
        "definition": "vi. 推断；作出推论 vt. 推断；推论"
    },
    {
        "word": "inference",
        "definition": "n. 推理；推论；推断"
    },
    {
        "word": "inferior",
        "definition": "n. 下级；次品 adj. 差的；自卑的；下级的，下等的"
    },
    {
        "word": "inferiority",
        "definition": "n. 自卑；下属；次等；下部"
    },
    {
        "word": "infinite",
        "definition": "n. 无限； 无穷大；无限的东西（如空间，时间） adj. 无限的，无穷的；无数的；极大的"
    },
    {
        "word": "infinity",
        "definition": "n. 无穷；无限大；无限距"
    },
    {
        "word": "infinitive",
        "definition": "adj. 原形的，不定式的 n. 原形，原形动词，不定式"
    },
    {
        "word": "inflate",
        "definition": "vt. 使充气；使通货膨胀 vi. 膨胀；充气"
    },
    {
        "word": "inflation",
        "definition": "n. 膨胀；通货膨胀；夸张；自命不凡"
    },
    {
        "word": "infliction",
        "definition": "n. 施加；处罚，刑罚"
    },
    {
        "word": "influence",
        "definition": "n. 影响；势力；感化；有影响的人或事 vt. 影响；改变"
    },
    {
        "word": "influential",
        "definition": "adj. 有影响的；有势力的 n. 有影响力的人物"
    },
    {
        "word": "influenza",
        "definition": "n.  流行性感冒（简写flu）；家畜流行性感冒"
    },
    {
        "word": "flu",
        "definition": "n. 流感"
    },
    {
        "word": "inform",
        "definition": "vi. 告发；告密 vt. 通知；告诉；报告"
    },
    {
        "word": "information",
        "definition": "n. 信息，资料；知识；情报；通知"
    },
    {
        "word": "informative",
        "definition": "adj. 教育性的，有益的；情报的；见闻广博的"
    },
    {
        "word": "informant",
        "definition": "n. 被调查者；告密者；提供消息者"
    },
    {
        "word": "infrastructure",
        "definition": "n. 基础设施；公共建设；下部构造"
    },
    {
        "word": "ingredient",
        "definition": "n. 原料；要素；组成部分 adj. 构成组成部分的"
    },
    {
        "word": "inhabit",
        "definition": "vt. 栖息；居住于；占据 vi. （古）居住；栖息"
    },
    {
        "word": "inhabitant",
        "definition": "n. 居民；居住者"
    },
    {
        "word": "inherit",
        "definition": "vt. 继承；遗传而得 vi. 成为继承人"
    },
    {
        "word": "inheritance",
        "definition": "n. 继承；遗传；遗产"
    },
    {
        "word": "initial",
        "definition": "n. 词首大写字母 adj. 最初的；字首的 vt. 用姓名的首字母签名"
    },
    {
        "word": "initially",
        "definition": "adv. 最初，首先；开头"
    },
    {
        "word": "initiate",
        "definition": "n. 开始；新加入者，接受初步知识者 vt. 开始，创始；发起；使初步了解 adj. 新加入的；接受初步知识的"
    },
    {
        "word": "initiation",
        "definition": "n. 启蒙，传授；开始；入会"
    },
    {
        "word": "initiative",
        "definition": "n. 主动权；首创精神 adj. 主动的；自发的；起始的"
    },
    {
        "word": "injure",
        "definition": "vt. 伤害，损害"
    },
    {
        "word": "injury",
        "definition": "n. 伤害，损害；受伤处"
    },
    {
        "word": "injurious",
        "definition": "adj. 有害的；诽谤的"
    },
    {
        "word": "ink",
        "definition": "n. 墨水，墨汁；油墨 vt. 签署；涂墨水于"
    },
    {
        "word": "inland",
        "definition": "n. 内地；内陆 adj. 内陆的；内地的；国内的 adv. 在内地；向内地；向内陆；在内陆"
    },
    {
        "word": "inn",
        "definition": "n. 客栈；旅馆 vi. 住旅馆"
    },
    {
        "word": "inner",
        "definition": "n. 内部 adj. 内部的；内心的；精神的"
    },
    {
        "word": "innocent",
        "definition": "n. 天真的人；笨蛋 adj. 无辜的；无罪的；无知的"
    },
    {
        "word": "innocence",
        "definition": "n. 清白，无罪；天真无邪"
    },
    {
        "word": "innovate",
        "definition": "vi. 创新；改革；革新 vt. 改变；创立；创始；引人"
    },
    {
        "word": "innovation",
        "definition": "n. 创新，革新；新方法"
    },
    {
        "word": "innovative",
        "definition": "adj. 革新的，创新的；新颖的；有创新精神的"
    },
    {
        "word": "input",
        "definition": "n. 投入；输入电路 vt.  输入；将…输入电脑"
    },
    {
        "word": "inquire",
        "definition": "vi. 询问；查究；询价 vt. 询问；查究；问明"
    },
    {
        "word": "inquiry",
        "definition": "n. 探究；调查；质询"
    },
    {
        "word": "inquisitive",
        "definition": "adj. 好奇的；好问的，爱打听的"
    },
    {
        "word": "insane",
        "definition": "adj. 疯狂的；精神病的；极愚蠢的"
    },
    {
        "word": "insanity",
        "definition": "n. 疯狂；精神错乱；精神病；愚顽"
    },
    {
        "word": "insect",
        "definition": "n. 昆虫；卑鄙的人"
    },
    {
        "word": "insert",
        "definition": "n. 插入物；管芯；镶块；刀片 vt. 插入；嵌入"
    },
    {
        "word": "insertion",
        "definition": "n. 插入；嵌入；插入物"
    },
    {
        "word": "inside",
        "definition": "prep. 少于；在…之内 n. 里面；内部；内情；内脏 adj. 里面的；内部的；秘密的 adv. 在里面"
    },
    {
        "word": "insider",
        "definition": "n. 内部的人，会员；熟悉内情者"
    },
    {
        "word": "insight",
        "definition": "n. 洞察力；洞悉"
    },
    {
        "word": "insightful",
        "definition": "adj. 有深刻见解的，富有洞察力的"
    },
    {
        "word": "insist",
        "definition": "vi. 坚持，强调 vt. 坚持，强调"
    },
    {
        "word": "insistence",
        "definition": "n. 坚持，强调；坚决主张"
    },
    {
        "word": "insistent",
        "definition": "adj. 坚持的；迫切的；显著的；引人注目的；紧急的"
    },
    {
        "word": "inspect",
        "definition": "vt. 检查；视察；检阅 vi. 进行检查；进行视察"
    },
    {
        "word": "inspection",
        "definition": "n. 视察，检查"
    },
    {
        "word": "inspector",
        "definition": "n. 检查员；巡视员"
    },
    {
        "word": "inspire",
        "definition": "vt. 激发；鼓舞；启示；产生；使生灵感"
    },
    {
        "word": "inspiration",
        "definition": "n. 灵感；鼓舞；吸气；妙计"
    },
    {
        "word": "inspirational",
        "definition": "adj. 鼓舞人心的；带有灵感的，给予灵感的"
    },
    {
        "word": "instal",
        "definition": "vt. 安装；使就任；设置"
    },
    {
        "word": "install",
        "definition": "vt. 安装；任命；安顿"
    },
    {
        "word": "installation",
        "definition": "n. 安装，装置；就职"
    },
    {
        "word": "instalment",
        "definition": "n. 分期付款；装设；就职"
    },
    {
        "word": "installment",
        "definition": "n. 安装；分期付款；部分；就职"
    },
    {
        "word": "instance",
        "definition": "n. 实例；情况；建议 vt. 举...为例"
    },
    {
        "word": "instant",
        "definition": "n. 瞬间；立即；片刻 adj. 立即的；紧急的；紧迫的"
    },
    {
        "word": "instantaneous",
        "definition": "adj. 瞬间的；即时的；猝发的"
    },
    {
        "word": "instead",
        "definition": "adv. 代替；反而；相反"
    },
    {
        "word": "instinct",
        "definition": "n. 本能，直觉；天性 adj. 充满着的"
    },
    {
        "word": "instinctive",
        "definition": "adj. 本能的；直觉的；天生的"
    },
    {
        "word": "institute",
        "definition": "n. 学会，协会；学院 vt. 开始（调查）；制定；创立；提起（诉讼）"
    },
    {
        "word": "institution",
        "definition": "n. 制度；建立；（社会或宗教等）公共机构；习俗"
    },
    {
        "word": "institutional",
        "definition": "adj. 制度的；制度上的 学会的；由来已久的； 习以为常的 公共机构的； 慈善机构的"
    },
    {
        "word": "instruct",
        "definition": "vt. 指导；通知；命令；教授"
    },
    {
        "word": "instruction",
        "definition": "n. 指令，命令；指示；教导；用法说明"
    },
    {
        "word": "instructor",
        "definition": "n. 指导书；教员；指导者"
    },
    {
        "word": "instructive",
        "definition": "adj. 有益的；教育性的"
    },
    {
        "word": "instrument",
        "definition": "n. 仪器；工具；乐器；手段；器械"
    },
    {
        "word": "instrumental",
        "definition": "n. 器乐曲；工具字，工具格 adj. 乐器的；有帮助的；仪器的，器械的"
    },
    {
        "word": "insult",
        "definition": "n. 侮辱；凌辱；无礼 vt. 侮辱；辱骂；损害"
    },
    {
        "word": "insure",
        "definition": "vt. 确保，保证；给…保险 vi. 确保；投保"
    },
    {
        "word": "insurance",
        "definition": "n. 保险；保险费；保险契约；赔偿金"
    },
    {
        "word": "intact",
        "definition": "adj. 完整的；原封不动的；未受损伤的"
    },
    {
        "word": "intake",
        "definition": "n. 摄取量；通风口；引入口；引入的量"
    },
    {
        "word": "intangible",
        "definition": "adj. 无形的，触摸不到的；难以理解的"
    },
    {
        "word": "integrate",
        "definition": "n. 一体化；集成体 adj. 整合的；完全的 vi. 求积分；取消隔离；成为一体 vt. 使…完整；使…成整体；求…的积分；表示…的总和"
    },
    {
        "word": "integration",
        "definition": "n. 集成；综合"
    },
    {
        "word": "integrity",
        "definition": "n. 完整；正直；诚实；廉正"
    },
    {
        "word": "intellectual",
        "definition": "n. 知识分子；凭理智做事者 adj. 智力的；聪明的；理智的"
    },
    {
        "word": "intelligent",
        "definition": "adj. 智能的；聪明的；理解力强的"
    },
    {
        "word": "intelligence",
        "definition": "n. 智力；情报工作；情报机关；理解力；才智，智慧；天分"
    },
    {
        "word": "intend",
        "definition": "vi. 有打算 vt. 打算；想要；意指"
    },
    {
        "word": "intention",
        "definition": "n. 意图；目的；意向；愈合"
    },
    {
        "word": "intent",
        "definition": "n. 意图；目的；含义 adj. 专心的；急切的；坚决的"
    },
    {
        "word": "intentional",
        "definition": "adj. 故意的；蓄意的；策划的"
    },
    {
        "word": "intense",
        "definition": "adj. 强烈的；紧张的；非常的；热情的"
    },
    {
        "word": "intensity",
        "definition": "n. 强度；强烈； 亮度；紧张"
    },
    {
        "word": "intensify",
        "definition": "vt. 使加强，使强化；使变激烈 vi. 增强，强化；变激烈"
    },
    {
        "word": "intensive",
        "definition": "n. 加强器 adj. 加强的；集中的；透彻的；加强语气的"
    },
    {
        "word": "interact",
        "definition": "n. 幕间剧；幕间休息 vt. 互相影响；互相作用 vi. 互相影响；互相作用"
    },
    {
        "word": "interaction",
        "definition": "n. 相互作用； 交互作用 n. 互动"
    },
    {
        "word": "interactive",
        "definition": "adj. 交互式的；相互作用的"
    },
    {
        "word": "interest",
        "definition": "n. 兴趣，爱好；利息；趣味；同行 vt. 使……感兴趣；引起……的关心；使……参与"
    },
    {
        "word": "interesting",
        "definition": "adj. 有趣的；引起兴趣的，令人关注的"
    },
    {
        "word": "interested",
        "definition": "v. 使…感兴趣（interest的过去分词） adj. 感兴趣的；有权益的；有成见的"
    },
    {
        "word": "interfere",
        "definition": "vi. 干涉；妨碍；打扰 vt. 冲突；介入"
    },
    {
        "word": "interference",
        "definition": "n. 干扰，冲突；干涉"
    },
    {
        "word": "interior",
        "definition": "n. 内部；本质 adj. 内部的；国内的；本质的"
    },
    {
        "word": "intermediate",
        "definition": "n.  中间物；媒介 adj. 中间的，中级的 vi. 起媒介作用"
    },
    {
        "word": "intermediary",
        "definition": "n. 中间人；仲裁者；调解者；媒介物 adj. 中间的；媒介的；中途的"
    },
    {
        "word": "internal",
        "definition": "n. 内脏；本质 adj. 内部的；里面的；体内的；（机构）内部的"
    },
    {
        "word": "international",
        "definition": "n. 国际组织；国际体育比赛；外国居留者；国际股票 adj. 国际的；两国（或以上）国家的；超越国界的；国际关系的；世界的"
    },
    {
        "word": "Internet",
        "definition": ""
    },
    {
        "word": "internet",
        "definition": "n. 因特网"
    },
    {
        "word": "interpret",
        "definition": "vi. 解释；翻译 vt. 说明；口译"
    },
    {
        "word": "interpretation",
        "definition": "n. 解释；翻译；演出"
    },
    {
        "word": "interpreter",
        "definition": "n. 解释者；口译者；注释器"
    },
    {
        "word": "interrupt",
        "definition": "n. 中断 vt. 中断；打断；插嘴；妨碍 vi. 打断；打扰"
    },
    {
        "word": "interruption",
        "definition": "n. 中断；干扰；中断之事"
    },
    {
        "word": "interval",
        "definition": "n. 间隔；间距；幕间休息"
    },
    {
        "word": "interview",
        "definition": "n. 接见，采访；面试，面谈 vt. 采访；接见；对…进行面谈；对某人进行面试"
    },
    {
        "word": "interviewer",
        "definition": "n. 采访者；会见者；面谈者；进行面试者"
    },
    {
        "word": "interviewee",
        "definition": "n. 被接见者；被访问者"
    },
    {
        "word": "intimate",
        "definition": "n. 知己；至交 adj. 亲密的；私人的；精通的；有性关系的 vt. 暗示；通知；宣布"
    },
    {
        "word": "intimacy",
        "definition": "n. 性行为；亲密；亲昵行为；隐私"
    },
    {
        "word": "into",
        "definition": "prep. 到…里；深入…之中；成为…状况；进入到…之内"
    },
    {
        "word": "introduce",
        "definition": "vt. 介绍；引进；提出；采用"
    },
    {
        "word": "introduction",
        "definition": "n. 介绍；引进；采用；入门；传入"
    },
    {
        "word": "introductory",
        "definition": "adj. 引导的，介绍的；开端的"
    },
    {
        "word": "intrude",
        "definition": "vi. 闯入；侵入；侵扰 vt. 把…强加；把…硬挤"
    },
    {
        "word": "intrusion",
        "definition": "n. 侵入；闯入"
    },
    {
        "word": "intruder",
        "definition": "n. 侵入者；干扰者；妨碍者"
    },
    {
        "word": "invade",
        "definition": "vt. 侵略；侵袭；侵扰；涌入 vi. 侵略；侵入；侵袭；侵犯"
    },
    {
        "word": "invasion",
        "definition": "n. 入侵，侵略；侵袭；侵犯"
    },
    {
        "word": "invader",
        "definition": "n. 侵略者；侵入物"
    },
    {
        "word": "invasive",
        "definition": "adj. 侵略性的；攻击性的"
    },
    {
        "word": "invalid",
        "definition": "n. 病人；残疾者 adj. 无效的；有病的；残疾的 vt. 使伤残；使退役 vi. 变得病弱；因病而奉命退役"
    },
    {
        "word": "invaluable",
        "definition": "adj. 无价的；非常贵重的"
    },
    {
        "word": "invariably",
        "definition": "adv. 总是；不变地；一定地"
    },
    {
        "word": "invent",
        "definition": "vt. 发明；创造；虚构"
    },
    {
        "word": "invention",
        "definition": "n. 发明；发明物；虚构；发明才能"
    },
    {
        "word": "inventor",
        "definition": "n. 发明家； 发明人；创造者"
    },
    {
        "word": "invest",
        "definition": "vi. 投资，入股；花钱买 vt. 投资；覆盖；耗费；授予；包围"
    },
    {
        "word": "investment",
        "definition": "n. 投资；投入；封锁"
    },
    {
        "word": "investor",
        "definition": "n. 投资者"
    },
    {
        "word": "investigate",
        "definition": "v. 调查；研究"
    },
    {
        "word": "investigation",
        "definition": "n. 调查；调查研究"
    },
    {
        "word": "investigator",
        "definition": "n. 研究者；调查者；侦查员"
    },
    {
        "word": "invisible",
        "definition": "adj. 无形的，看不见的；无形的；不显眼的，暗藏的"
    },
    {
        "word": "invite",
        "definition": "n. 邀请 vt. 邀请，招待；招致"
    },
    {
        "word": "invitation",
        "definition": "n. 邀请；引诱；请帖；邀请函"
    },
    {
        "word": "inviting",
        "definition": "v. 邀请（invite的ing形式） adj. 诱人的；有魅力的"
    },
    {
        "word": "involve",
        "definition": "vt. 包含；牵涉；使陷于；潜心于"
    },
    {
        "word": "involvement",
        "definition": "n. 牵连；包含；混乱；财政困难"
    },
    {
        "word": "involved",
        "definition": "v. 涉及；使参与；包含（involve的过去式和过去分词） adj. 有关的；卷入的；复杂的"
    },
    {
        "word": "inward",
        "definition": "n. 内部；内脏；密友 adj. 向内的；内部的；精神的；本质上的；熟悉的 adv. 向内；内心里"
    },
    {
        "word": "iron",
        "definition": "n. 熨斗；烙铁；坚强 adj. 铁的；残酷的；刚强的 vt. 熨；用铁铸成 vi. 熨衣；烫平"
    },
    {
        "word": "irony",
        "definition": "n. 讽刺；反语；具有讽刺意味的事 adj. 铁的；似铁的"
    },
    {
        "word": "ironic",
        "definition": "adj. 讽刺的；反话的"
    },
    {
        "word": "ironical",
        "definition": "adj. 讽刺的（等于ironic）；用反语的"
    },
    {
        "word": "ironically",
        "definition": "adv. 讽刺地；说反话地"
    },
    {
        "word": "irrational",
        "definition": "n.  无理数 adj. 不合理的；无理性的；荒谬的"
    },
    {
        "word": "irregular",
        "definition": "n. 不规则物；不合规格的产品 adj. 不规则的；无规律的；非正规的；不合法的"
    },
    {
        "word": "irrigate",
        "definition": "vt. 灌溉；冲洗；使清新 vi. 灌溉；冲洗"
    },
    {
        "word": "irrigation",
        "definition": "n. 灌溉； 冲洗；冲洗法"
    },
    {
        "word": "island",
        "definition": "n. 岛；岛屿；安全岛；岛状物 adj. 岛的 vt. 孤立；使成岛状"
    },
    {
        "word": "isolate",
        "definition": "n.  隔离种群 vt. 使隔离；使孤立；使绝缘 adj. 隔离的；孤立的 vi. 隔离；孤立"
    },
    {
        "word": "isolation",
        "definition": "n. 隔离；孤立； 绝缘； 离析"
    },
    {
        "word": "issue",
        "definition": "n. 问题；流出；期号；发行物 vt. 发行，发布；发给；放出，排出 vi. 发行；流出；造成…结果；传下"
    },
    {
        "word": "it",
        "definition": "abbr. 信息技术information technology abbr. 意大利Italy；意大利的Italian"
    },
    {
        "word": "item",
        "definition": "n. 条款，项目；一则；一件商品（或物品） adj. 又，同上 v. 记下；逐条列出"
    },
    {
        "word": "its",
        "definition": "pron. 它的"
    },
    {
        "word": "itself",
        "definition": "pron. 它自己；它本身"
    },
    {
        "word": "jacket",
        "definition": "n. 羽绒滑雪衫；西装短外套；短上衣，夹克；土豆皮；书籍的护封；文件套，公文夹 vt. 给…穿夹克；给…装护套；给…包上护封；打"
    },
    {
        "word": "jail",
        "definition": "n. 监狱；监牢；拘留所 vt. 监禁；下狱"
    },
    {
        "word": "jam",
        "definition": "n. 果酱；拥挤；困境；扣篮 vt. 使堵塞；挤进，使塞满；混杂；压碎 vi. 堵塞；轧住"
    },
    {
        "word": "January",
        "definition": "n. 一月"
    },
    {
        "word": "jar",
        "definition": "n. 罐；广口瓶；震动；刺耳声 vi. 冲突；不一致；震惊；发刺耳声 vt. 震动；刺激；使震动"
    },
    {
        "word": "jaw",
        "definition": "n. 颌；下巴；狭窄入口；唠叨 vt. 教训；对…唠叨 vi. 教训；唠叨"
    },
    {
        "word": "jazz",
        "definition": "n. 爵士乐，爵士舞；喧闹 vi. 奏爵士乐，跳爵士舞；游荡 vt. 奏爵士乐；使活泼 adj. 爵士乐的；喧吵的"
    },
    {
        "word": "jealous",
        "definition": "adj. 妒忌的；猜疑的；唯恐失去的；戒备的"
    },
    {
        "word": "jealousy",
        "definition": "n. 嫉妒；猜忌；戒备"
    },
    {
        "word": "jeans",
        "definition": "n. 牛仔裤；工装裤"
    },
    {
        "word": "jeep",
        "definition": "n. 吉普车"
    },
    {
        "word": "jet",
        "definition": "n. 喷射，喷嘴；喷气式飞机；黑玉 adj. 墨黑的 vt. 射出 vi. 射出； 乘喷气式飞机"
    },
    {
        "word": "jetlag",
        "definition": "n. 时差综合症（跨时区高速飞行后生理节奏的破坏）"
    },
    {
        "word": "jewel",
        "definition": "n. 宝石；珠宝 vt. 镶以宝石；饰以珠宝"
    },
    {
        "word": "jewelery",
        "definition": "n. 珠宝（总称）"
    },
    {
        "word": "jewellery",
        "definition": "n. 珠宝（等于jewelry）"
    },
    {
        "word": "job",
        "definition": "n. 工作；职业 vt. 承包；代客买卖 vi. 做零工"
    },
    {
        "word": "jog",
        "definition": "vt. 慢跑；轻推；蹒跚行进；使颠簸 vi. 慢跑；轻推；蹒跚行进；颠簸着移动 n. 慢跑；轻推，轻撞"
    },
    {
        "word": "join",
        "definition": "vt. 参加；结合；连接 vi. 加入；参加；结合 n. 结合；连接；接合点"
    },
    {
        "word": "joint",
        "definition": "n. 关节；接缝；接合处，接合点；（牛，羊等的腿）大块肉 adj. 共同的；连接的；联合的，合办的 vt. 连接，贴合；接合；使有接头 vi. 贴合；生节"
    },
    {
        "word": "joke",
        "definition": "n. 玩笑，笑话；笑柄 vt. 开…的玩笑 vi. 开玩笑"
    },
    {
        "word": "journal",
        "definition": "n. 日报，杂志；日记；分类账"
    },
    {
        "word": "journalism",
        "definition": "n. 新闻业，新闻工作；报章杂志"
    },
    {
        "word": "journalist",
        "definition": "n. 新闻工作者；报人；记日志者"
    },
    {
        "word": "journey",
        "definition": "n. 旅行；行程 vi. 旅行"
    },
    {
        "word": "joy",
        "definition": "n. 欢乐，快乐；乐趣；高兴 vi. 欣喜，欢喜 vt. 高兴，使快乐"
    },
    {
        "word": "joyous",
        "definition": "adj. 令人高兴的；充满欢乐的（等于joyful）"
    },
    {
        "word": "joyful",
        "definition": "adj. 欢喜的；令人高兴的"
    },
    {
        "word": "judge",
        "definition": "vt. 判断；审判 n. 法官；裁判员 vi. 审判；判决"
    },
    {
        "word": "judgment",
        "definition": "n. 判断；裁判；判决书；辨别力"
    },
    {
        "word": "judgement",
        "definition": "n. 意见；判断力； 审判；评价"
    },
    {
        "word": "juice",
        "definition": "n. （水果）汁，液；果汁"
    },
    {
        "word": "juicy",
        "definition": "adj. 多汁的；利润多的；生动的"
    },
    {
        "word": "July",
        "definition": "n. 七月"
    },
    {
        "word": "jump",
        "definition": "n. 跳跃；暴涨；惊跳 vt. 跳跃；使跳跃；跳过；突升 vi. 跳跃；暴涨；猛增"
    },
    {
        "word": "June",
        "definition": "n. 六月；琼（人名，来源于拉丁语，含义是“年轻气盛的六月”）"
    },
    {
        "word": "jungle",
        "definition": "n. 丛林，密林；危险地带 adj. 丛林的；蛮荒的"
    },
    {
        "word": "junior",
        "definition": "adj. 年少的；后进的；下级的 n. 年少者，晚辈；地位较低者；大学三年级学生"
    },
    {
        "word": "junk",
        "definition": "n. 垃圾，废物；舢板"
    },
    {
        "word": "jury",
        "definition": "n.  陪审团；评判委员会 adj. 应急的"
    },
    {
        "word": "juror",
        "definition": "n. 审查委员，陪审员"
    },
    {
        "word": "just",
        "definition": "adv. 只是，仅仅；刚才，刚刚；正好，恰好；实在；刚要 adj. 公正的，合理的；正直的，正义的；正确的；公平的；应得的"
    },
    {
        "word": "justice",
        "definition": "n. 司法，法律制裁；正义；法官，审判员"
    },
    {
        "word": "justify",
        "definition": "vi. 证明合法；整理版面 vt. 证明…是正当的；替…辩护"
    },
    {
        "word": "justification",
        "definition": "n. 理由；辩护；认为有理，认为正当；释罪"
    },
    {
        "word": "keen",
        "definition": "adj. 敏锐的，敏捷的；渴望的；强烈的；热心的；锐利的 n. 痛哭，挽歌"
    },
    {
        "word": "keep",
        "definition": "vt. 保持；经营；遵守；饲养 vi. 保持；继续不断 n. 保持；生计；生活费"
    },
    {
        "word": "kettle",
        "definition": "n. 壶； 釜；罐；鼓"
    },
    {
        "word": "key",
        "definition": "n. （打字机等的）键；关键；钥匙 vt. 键入；锁上；调节…的音调；提供线索 vi. 使用钥匙 adj. 关键的"
    },
    {
        "word": "keyboard",
        "definition": "n. 键盘 vt. 键入；用键盘式排字机排字 vi. 用键盘进行操作；作键盘式排字机排字"
    },
    {
        "word": "kick",
        "definition": "vt. 踢；反冲，朝后座 n. 踢；反冲，后座力 vi. 踢；反冲"
    },
    {
        "word": "kid",
        "definition": "n. 小孩；小山羊 vt. 欺骗；取笑；戏弄 vi. 欺骗；取笑；戏弄 adj. 小山羊皮制的；较年幼的"
    },
    {
        "word": "kill",
        "definition": "vt. 杀死；扼杀；使终止；抵消 vi. 杀死 n. 杀戮；屠杀 adj. 致命的；致死的"
    },
    {
        "word": "kilogram",
        "definition": "n. 公斤；千克"
    },
    {
        "word": "kilogramme",
        "definition": "n. 公斤; 千克"
    },
    {
        "word": "kilo",
        "definition": "n. 千克"
    },
    {
        "word": "kilometer",
        "definition": "n.  公里； 千米（等于kilometre）"
    },
    {
        "word": "kilometre",
        "definition": "n.  公里； 千米"
    },
    {
        "word": "kin",
        "definition": "n. 亲戚；家族；同族 adj. 同类的；有亲属关系的；性质类似的"
    },
    {
        "word": "kind",
        "definition": "n. 种类；性质 adj. 和蔼的；宽容的；令人感激的"
    },
    {
        "word": "kindness",
        "definition": "n. 仁慈；好意；友好的行为"
    },
    {
        "word": "kindergarten",
        "definition": "n. 幼儿园；幼稚园"
    },
    {
        "word": "king",
        "definition": "n. 国王；最有势力者；王棋 vi. 统治；做国王 vt. 立…为王 adj. 主要的，最重要的，最大的"
    },
    {
        "word": "kingdom",
        "definition": "n. 王国；界；领域"
    },
    {
        "word": "kiss",
        "definition": "vt. 吻；（风等）轻拂 vi. 接吻；（风等）轻触 n. 吻；轻拂"
    },
    {
        "word": "kit",
        "definition": "n. 工具箱；成套工具 vt. 装备 vi. 装备"
    },
    {
        "word": "kitchen",
        "definition": "n. 厨房；炊具；炊事人员"
    },
    {
        "word": "kite",
        "definition": "n. 风筝 vi. 使用空头支票；像风筝一样飞；轻快地移动 vt. 骗钱；涂改（支票）"
    },
    {
        "word": "knee",
        "definition": "n. 膝盖，膝 vt. 用膝盖碰"
    },
    {
        "word": "kneel",
        "definition": "vi. 跪下，跪"
    },
    {
        "word": "knife",
        "definition": "n. 刀；匕首 vt. 用刀切；（口）伤害 vi. 劈开；划过"
    },
    {
        "word": "knit",
        "definition": "vi. 编织；结合；皱眉 vt. 编织；结合 n. 编织衣物；编织法"
    },
    {
        "word": "knock",
        "definition": "vi. 敲；打；敲击 vt. 敲；打；敲击；批评 n. 敲；敲打；爆震声"
    },
    {
        "word": "knot",
        "definition": "n. （绳等的）结；节瘤，疙瘩；海里/小时（航速单位） vt. 打结 vi. 打结"
    },
    {
        "word": "knotty",
        "definition": "adj. 棘手的，难解决的； 多节的；有结的"
    },
    {
        "word": "know",
        "definition": "vt. 知道；认识；懂得 vi. 了解；熟悉；确信"
    },
    {
        "word": "knowledge",
        "definition": "n. 知识，学问；知道，认识；学科"
    },
    {
        "word": "knowledgeable",
        "definition": "adj. 知识渊博的，有知识的；有见识的；聪明的"
    },
    {
        "word": "knowhow",
        "definition": "n. 诀窍，技巧；情报；实际的能力；专门技术"
    },
    {
        "word": "label",
        "definition": "vt. 标注；贴标签于 n. 标签；商标；签条"
    },
    {
        "word": "labor",
        "definition": "n. 劳动；工作；劳工；分娩 vi. 劳动；努力；苦干 vt. 详细分析；使厌烦"
    },
    {
        "word": "labour",
        "definition": "n. （英国）工党"
    },
    {
        "word": "laborious",
        "definition": "adj. 勤劳的；艰苦的；费劲的"
    },
    {
        "word": "laboratory",
        "definition": "n. 实验室，研究室"
    },
    {
        "word": "lab",
        "definition": "n. 实验室，研究室"
    },
    {
        "word": "lace",
        "definition": "n. 花边；鞋带；饰带；少量烈酒 vt. 饰以花边；结带子 vi. 系带子"
    },
    {
        "word": "lack",
        "definition": "vt. 缺乏；不足；没有；需要 vi. 缺乏；不足；没有 n. 缺乏；不足"
    },
    {
        "word": "ladder",
        "definition": "n. 阶梯；途径；梯状物 vi. 成名；发迹 vt. 在……上装设梯子"
    },
    {
        "word": "lady",
        "definition": "n. 女士，夫人；小姐；妻子"
    },
    {
        "word": "lag",
        "definition": "n. 落后；迟延；防护套；囚犯；桶板 vt. 落后于；押往监狱；加上外套 vi. 滞后；缓缓而行；蹒跚 adj. 最后的"
    },
    {
        "word": "lake",
        "definition": "n. 湖；深红色颜料；胭脂红 vt. （使）血球溶解 vi. （使）血球溶解"
    },
    {
        "word": "lamb",
        "definition": "n. 羔羊，小羊；羔羊肉 vt. 生小羊，产羔羊 vi. 生小羊，产羔羊"
    },
    {
        "word": "lame",
        "definition": "adj. 跛足的；僵痛的；不完全的；无说服力的；差劲的，蹩脚的 vi. 变跛 vt. 使跛；使成残废"
    },
    {
        "word": "lamp",
        "definition": "n. 灯；照射器 vt. 照亮 vi. 发亮"
    },
    {
        "word": "land",
        "definition": "n. 国土；陆地；地面 vt. 使…登陆；使…陷于；将…卸下 vi. 登陆；到达"
    },
    {
        "word": "landing",
        "definition": "n. 登陆；码头；楼梯平台 v. 登陆（land的ing形式）"
    },
    {
        "word": "landlord",
        "definition": "n. 房东，老板；地主"
    },
    {
        "word": "landlady",
        "definition": "n. 女房东；女地主；女店主"
    },
    {
        "word": "landscape",
        "definition": "n. 风景；风景画；景色；山水画；乡村风景画；地形；（文件的）横向打印格式 vt. 对…做景观美化，给…做园林美化；从事庭园设计 vi. 美化（环境等），使景色宜人；从事景观美化工作，做庭园设计师"
    },
    {
        "word": "lane",
        "definition": "n. 小巷； 航线；车道；罚球区"
    },
    {
        "word": "language",
        "definition": "n. 语言；语言文字；表达能力"
    },
    {
        "word": "lap",
        "definition": "n. 一圈；膝盖；下摆；山坳 vt. 使重叠；拍打；包围 vi. 重叠；轻拍；围住"
    },
    {
        "word": "laptop",
        "definition": "n. 膝上型轻便电脑，笔记本电脑"
    },
    {
        "word": "large",
        "definition": "adj. 大的；多数的；广博的 adv. 大大地；夸大地 n. 大"
    },
    {
        "word": "largely",
        "definition": "adv. 主要地；大部分；大量地"
    },
    {
        "word": "laser",
        "definition": "n. 激光"
    },
    {
        "word": "lass",
        "definition": "n. 小姑娘；情侣；（苏格兰）女佣"
    },
    {
        "word": "last",
        "definition": "n. 末尾，最后；上个；鞋楦（做鞋的模型） adj. 最后的；最近的，最新的；仅剩的；最不可能…的 vi. 持续；维持，够用；持久 vt. 度过，拖过；使维持 adv. 最后地；上次，最近；最后一点"
    },
    {
        "word": "lastly",
        "definition": "adv. 最后，终于"
    },
    {
        "word": "late",
        "definition": "adj. 晚的；迟的；已故的；最近的 adv. 晚；迟；最近；在晚期"
    },
    {
        "word": "later",
        "definition": "adv. 后来；稍后；随后 adj. 更迟的；更后的"
    },
    {
        "word": "lately",
        "definition": "adv. 近来，不久前"
    },
    {
        "word": "latter",
        "definition": "adj. 后者的；近来的；后面的；较后的"
    },
    {
        "word": "laugh",
        "definition": "n. 笑；引人发笑的事或人 vi. 笑 vt. 以笑表示；使…笑得"
    },
    {
        "word": "laughter",
        "definition": "n. 笑；笑声"
    },
    {
        "word": "launch",
        "definition": "vt. 发射（导弹、火箭等）；发起，发动；使…下水 vi. 开始；下水；起飞 n. 发射；发行，投放市场；下水；汽艇"
    },
    {
        "word": "laundry",
        "definition": "n. 洗衣店，洗衣房；要洗的衣服；洗熨；洗好的衣服"
    },
    {
        "word": "lavatory",
        "definition": "n. 厕所，盥洗室"
    },
    {
        "word": "law",
        "definition": "n. 法律；规律；法治；法学；诉讼；司法界 vi. 起诉；控告 vt. 控告；对…起诉"
    },
    {
        "word": "lawful",
        "definition": "adj. 合法的；法定的；法律许可的"
    },
    {
        "word": "lawn",
        "definition": "n. 草地；草坪"
    },
    {
        "word": "lawyer",
        "definition": "n. 律师；法学家"
    },
    {
        "word": "lay",
        "definition": "vt. 躺下；产卵；搁放；放置；铺放；涂，敷 adj. 世俗的；外行的；没有经验的 n. 位置；短诗；花纹方向；叙事诗；性伙伴 vi. 下蛋；打赌 v. 躺；位于（lie的过去式）"
    },
    {
        "word": "layer",
        "definition": "n. 层，层次；膜；压条；放置者，计划者 vt. 把…分层堆放；借助压条法；生根繁殖；将（头发）剪成不同层次 vi. 形成或分成层次；通过压条法而生根"
    },
    {
        "word": "layoff",
        "definition": "n. 活动停止期间；临时解雇；操作停止；失业期"
    },
    {
        "word": "layout",
        "definition": "n. 布局；设计；安排；陈列"
    },
    {
        "word": "lazy",
        "definition": "adj. 懒惰的；懒洋洋的；怠惰的；慢吞吞的"
    },
    {
        "word": "laziness",
        "definition": "n. 怠惰；无精打采"
    },
    {
        "word": "lead",
        "definition": "n. 领导；铅；导线；榜样 vt. 领导；致使；引导；指挥 vi. 领导；导致；用水砣测深 adj. 带头的；最重要的"
    },
    {
        "word": "leader",
        "definition": "n. 领导者；首领；指挥者"
    },
    {
        "word": "leadership",
        "definition": "n. 领导能力；领导阶层"
    },
    {
        "word": "leading",
        "definition": "adj. 领导的；主要的 n. 领导；铅板；行距 v. 领导（lead的ing形式）"
    },
    {
        "word": "leaf",
        "definition": "n. 叶子；（书籍等的）一张；扇页 vi. 生叶；翻书页 vt. 翻…的页，匆匆翻阅"
    },
    {
        "word": "league",
        "definition": "n. 联盟；社团；范畴 vt. 使…结盟；与…联合 vi. 团结；结盟"
    },
    {
        "word": "leak",
        "definition": "n. 泄漏；漏洞，裂缝 vt. 使渗漏，泄露 vi. 漏，渗；泄漏出去"
    },
    {
        "word": "lean",
        "definition": "vi. 倾斜；倚靠；倾向；依赖 adj. 瘦的；贫乏的，歉收的 vt. 使倾斜 n. 瘦肉；倾斜；倾斜度"
    },
    {
        "word": "leap",
        "definition": "vi. 跳，跳跃 n. 飞跃；跳跃 vt. 跳跃，跳过；使跃过"
    },
    {
        "word": "learn",
        "definition": "vt. 学习；得知；认识到 vi. 学习；获悉"
    },
    {
        "word": "learned",
        "definition": "adj. 博学的；有学问的；学术上的"
    },
    {
        "word": "learning",
        "definition": "n. 学习；学问 v. 学习（learn的现在分词）"
    },
    {
        "word": "learner",
        "definition": "n. 初学者，学习者"
    },
    {
        "word": "lease",
        "definition": "n. 租约；租期；租赁物；租赁权 vt. 出租；租得 vi. 出租"
    },
    {
        "word": "least",
        "definition": "adj. 最小的；最少的（little的最高级） adv. 最小；最少 n. 最小；最少"
    },
    {
        "word": "leather",
        "definition": "n. 皮革；皮革制品 vt. 用皮革包盖；抽打 adj. 皮的；皮革制的"
    },
    {
        "word": "leave",
        "definition": "vt. 离开；留下；遗忘；委托 vi. 离开，出发；留下 n. 许可，同意；休假"
    },
    {
        "word": "lecture",
        "definition": "n. 演讲；讲稿；教训 vt. 演讲；训诫 vi. 讲课；讲演"
    },
    {
        "word": "lecturer",
        "definition": "n. 讲师，演讲者"
    },
    {
        "word": "left",
        "definition": "adj. 左边的；左派的；剩下的 adv. 在左面 n. 左边；左派；激进分子 v. 离开（leave的过去式）"
    },
    {
        "word": "leftist",
        "definition": "n. 左派；急进派；左翼的人；左撇子 adj. 左派的；左撇子的；急进派的"
    },
    {
        "word": "leg",
        "definition": "n. 腿；支柱"
    },
    {
        "word": "legal",
        "definition": "adj. 法律的；合法的；法定的；依照法律的"
    },
    {
        "word": "legalize",
        "definition": "vt. 使合法化；公认；法律上认为…正当"
    },
    {
        "word": "legalise",
        "definition": "vt. 使合法化（等于legalize）"
    },
    {
        "word": "legend",
        "definition": "n. 传奇；说明；图例；刻印文字"
    },
    {
        "word": "legendary",
        "definition": "adj. 传说的，传奇的 n. 传说集；圣徒传"
    },
    {
        "word": "legislate",
        "definition": "vt. 用立法规定；通过立法 vi. 立法；制定法律"
    },
    {
        "word": "legislation",
        "definition": "n. 立法；法律"
    },
    {
        "word": "legislative",
        "definition": "adj. 立法的；有立法权的 n. 立法权；立法机构"
    },
    {
        "word": "legislator",
        "definition": "n. 立法者"
    },
    {
        "word": "leisure",
        "definition": "n. 闲暇；空闲；安逸 adj. 空闲的；有闲的；业余的"
    },
    {
        "word": "leisurely",
        "definition": "adj. 悠闲的；从容的 adv. 悠闲地；从容不迫地"
    },
    {
        "word": "lemon",
        "definition": "adj. 柠檬色的 n. 柠檬"
    },
    {
        "word": "lemonade",
        "definition": "n. 柠檬水"
    },
    {
        "word": "lend",
        "definition": "vt. 贷；增添，提供；把……借给 vi. 贷款"
    },
    {
        "word": "lens",
        "definition": "n. 透镜，镜头；眼睛中的水晶体；晶状体；隐形眼镜；汽车的灯玻璃 vt. 给……摄影"
    },
    {
        "word": "less",
        "definition": "adv. 较少地；较小地；更小地 adj. 较少的；较小的 prep. 减去 n. 较少；较小"
    },
    {
        "word": "lesson",
        "definition": "n. 教训；课 vt. 教训；上课"
    },
    {
        "word": "lest",
        "definition": "conj. 唯恐，以免；担心"
    },
    {
        "word": "let",
        "definition": "vt. 允许，让；出租；假设；妨碍 vi. 出租；被承包 n. 障碍；出租屋"
    },
    {
        "word": "letter",
        "definition": "n. 信；字母，文字；证书；文学，学问；字面意义 vt. 写字母于 vi. 写印刷体字母"
    },
    {
        "word": "level",
        "definition": "n. 水平；标准；水平面 adj. 水平的；平坦的；同高的 vi. 瞄准；拉平；变得平坦 vt. 使同等；对准；弄平"
    },
    {
        "word": "liable",
        "definition": "adj. 有责任的，有义务的；应受罚的；有…倾向的；易…的"
    },
    {
        "word": "liability",
        "definition": "n. 责任；债务；倾向；可能性；不利因素"
    },
    {
        "word": "liberal",
        "definition": "adj. 自由主义的；慷慨的；不拘泥的；宽大的 n. 自由主义者"
    },
    {
        "word": "liberate",
        "definition": "vt. 解放；放出；释放"
    },
    {
        "word": "liberation",
        "definition": "n. 释放，解放"
    },
    {
        "word": "liberty",
        "definition": "n. 自由；许可；冒失"
    },
    {
        "word": "library",
        "definition": "n. 图书馆，藏书室；文库"
    },
    {
        "word": "librarian",
        "definition": "n. 图书馆员；图书管理员"
    },
    {
        "word": "license",
        "definition": "n. 执照，许可证；特许 vt. 许可；特许；发许可证给"
    },
    {
        "word": "licence",
        "definition": "n. 许可证，执照；特许 vt. 特许，许可；发给执照"
    },
    {
        "word": "lick",
        "definition": "vt. 舔；卷过；鞭打 vt. （非正式）战胜 vi. 舔；轻轻拍打 n. 舔；打；少许"
    },
    {
        "word": "lid",
        "definition": "n. 盖子；眼睑；限制 vt. 给…盖盖子"
    },
    {
        "word": "lie",
        "definition": "vi. 躺；说谎；位于；展现 vt. 谎骗 n. 谎言；位置"
    },
    {
        "word": "liar",
        "definition": "n. 说谎的人"
    },
    {
        "word": "life",
        "definition": "n. 生活，生存；寿命"
    },
    {
        "word": "lift",
        "definition": "vt. 举起；提升；鼓舞；空运；抄袭 vi. 消散；升起；耸立 n. 电梯；举起；起重机；搭车"
    },
    {
        "word": "light",
        "definition": "n. 光；光线；灯；打火机；领悟；浅色；天窗 adj. 轻的；浅色的；明亮的；轻松的；容易的；清淡的 vi. 点着；变亮；着火 vt. 照亮；点燃；着火 adv. 轻地；清楚地；轻便地"
    },
    {
        "word": "lighting",
        "definition": "n. 照明设备，舞台灯光 v. 照明；点燃（light的ing形式）"
    },
    {
        "word": "lightning",
        "definition": "adj. 闪电的；快速的 n. 闪电 vi. 闪电"
    },
    {
        "word": "like",
        "definition": "vt. 喜欢；想；愿意 vi. 喜欢；希望 prep. 像；如同 adj. 同样的；相似的 n. 爱好；同样的人或物 adv. 可能 conj. 好像"
    },
    {
        "word": "likely",
        "definition": "adj. 很可能的；合适的；有希望的 adv. 很可能；或许"
    },
    {
        "word": "likelihood",
        "definition": "n. 可能性，可能"
    },
    {
        "word": "likewise",
        "definition": "adv. 同样地；也"
    },
    {
        "word": "lily",
        "definition": "n. 百合花，百合；类似百合花的植物；洁白之物 adj. 洁白的，纯洁的"
    },
    {
        "word": "limb",
        "definition": "n. 肢，臂；分支；枝干 vt. 切断…的手足；从…上截下树枝"
    },
    {
        "word": "limit",
        "definition": "n. 限制；限度；界线 vt. 限制；限定"
    },
    {
        "word": "limitation",
        "definition": "n. 限制；限度；极限；追诉时效；有效期限；缺陷"
    },
    {
        "word": "limited",
        "definition": "adj. 有限的 n. 高级快车"
    },
    {
        "word": "line",
        "definition": "n. 路线，航线；排；绳 vt. 排成一行；划线于；以线条标示；使…起皱纹 vi. 排队；站成一排"
    },
    {
        "word": "linear",
        "definition": "adj. 线的，线型的；直线的，线状的；长度的"
    },
    {
        "word": "link",
        "definition": "n.  链环，环节；联系，关系 vt. 连接，连结；联合，结合 vi. 连接起来；联系在一起；将人或物连接或联系起来"
    },
    {
        "word": "linkage",
        "definition": "n. 连接；结合；联接；联动装置"
    },
    {
        "word": "lion",
        "definition": "n. 狮子；名人；勇猛的人；社交场合的名流"
    },
    {
        "word": "lioness",
        "definition": "n. 母狮子；雌狮"
    },
    {
        "word": "lip",
        "definition": "n. 嘴唇；边缘 vt. 以嘴唇碰 adj. 口头上的 vi. 用嘴唇"
    },
    {
        "word": "liquid",
        "definition": "adj. 液体的；清澈的；明亮的；易变的 n. 液体，流体；流音"
    },
    {
        "word": "liquor",
        "definition": "n. 酒，含酒精饮料；溶液；液体；烈酒 vi. 喝酒，灌酒 vt. 使喝醉"
    },
    {
        "word": "list",
        "definition": "n.  列表；清单；目录 vi. 列于表上 vt. 列出；记入名单内"
    },
    {
        "word": "listen",
        "definition": "vi. 听，倾听；听从，听信 n. 听，倾听"
    },
    {
        "word": "listener",
        "definition": "n. 听众 倾听者"
    },
    {
        "word": "liter",
        "definition": "n.  公升（容量单位）"
    },
    {
        "word": "litre",
        "definition": "n.  公升（米制容量单位）"
    },
    {
        "word": "literal",
        "definition": "adj. 文字的；逐字的；无夸张的"
    },
    {
        "word": "literally",
        "definition": "adv. 照字面地；逐字地；不夸张地；正确地；简直"
    },
    {
        "word": "literary",
        "definition": "adj. 文学的；书面的；精通文学的"
    },
    {
        "word": "literature",
        "definition": "n. 文学；文献；文艺；著作"
    },
    {
        "word": "literate",
        "definition": "adj. 受过教育的；精通文学的 n. 学者"
    },
    {
        "word": "literacy",
        "definition": "n. 读写能力；精通文学"
    },
    {
        "word": "litter",
        "definition": "n. 垃圾；轿，担架；一窝（动物的幼崽）；凌乱 vt. 乱丢；给…垫褥草；把…弄得乱七八糟 vi. 产仔；乱扔废弃物"
    },
    {
        "word": "little",
        "definition": "adj. 小的；很少的；短暂的；小巧可爱的 adv. 完全不 n. 少许；没有多少；短时间"
    },
    {
        "word": "live",
        "definition": "adj. 活的；生动的；实况转播的；精力充沛的 vt. 经历；度过 vi. 活；居住；生存"
    },
    {
        "word": "living",
        "definition": "adj. 活的；现存的；活跃的；逼真的 n. 生活；生存；生计 v. 生活；居住（live的ing形式）；度过"
    },
    {
        "word": "livelihood",
        "definition": "n. 生计，生活；营生"
    },
    {
        "word": "lively",
        "definition": "adj. 活泼的；生动的；真实的；生气勃勃的"
    },
    {
        "word": "liver",
        "definition": "n. 肝脏；生活者，居民"
    },
    {
        "word": "living-room",
        "definition": "n. 起居室；客厅"
    },
    {
        "word": "load",
        "definition": "n. 负载，负荷；工作量；装载量 vi.  加载；装载；装货 vt. 使担负；装填"
    },
    {
        "word": "loaf",
        "definition": "n. 条，一条面包；块；游荡 vt. 游荡；游手好闲；虚度光阴 vi. 游荡；游手好闲；虚度光阴"
    },
    {
        "word": "loan",
        "definition": "n. 贷款；借款 vi. 借出 vt. 借；借给"
    },
    {
        "word": "lobby",
        "definition": "n. 大厅；休息室；会客室；游说议员的团体 vt. 对……进行游说 vi. 游说议员"
    },
    {
        "word": "lobbyist",
        "definition": "n. 说客；活动议案通过者"
    },
    {
        "word": "local",
        "definition": "n.  局部；当地居民；本地新闻 adj. 当地的；局部的；地方性的；乡土的"
    },
    {
        "word": "locality",
        "definition": "n. 所在；位置；地点"
    },
    {
        "word": "locate",
        "definition": "vt. 位于；查找…的地点 vi. 定位；定居"
    },
    {
        "word": "location",
        "definition": "n. 位置（形容词locational）；地点；外景拍摄场地"
    },
    {
        "word": "lock",
        "definition": "vt. 锁，锁上；隐藏 vi. 锁；锁住；卡住 n. 锁；水闸；刹车"
    },
    {
        "word": "locker",
        "definition": "n. 柜，箱；上锁的人；有锁的橱柜；锁扣装置；有锁的存物柜"
    },
    {
        "word": "lodge",
        "definition": "n. 旅馆；门房；集会处；山林小屋 vt. 提出；寄存；借住；嵌入 vi. 寄宿；临时住宿"
    },
    {
        "word": "lodging",
        "definition": "n. 寄宿；寄宿处；出租的房间、住房；倒伏"
    },
    {
        "word": "log",
        "definition": "vi. 伐木 vt. 切；伐木；航行 n. 记录；航行日志；原木"
    },
    {
        "word": "logic",
        "definition": "n. 逻辑；逻辑学；逻辑性 adj. 逻辑的"
    },
    {
        "word": "logical",
        "definition": "adj. 合逻辑的，合理的；逻辑学的"
    },
    {
        "word": "logo",
        "definition": "n. 商标，徽标；标识语"
    },
    {
        "word": "lonely",
        "definition": "adj. 寂寞的；偏僻的 n. 孤独者"
    },
    {
        "word": "loneliness",
        "definition": "n. 寂寞，孤独"
    },
    {
        "word": "long",
        "definition": "n. 长时间； 长音节；（服装的）长尺寸；长裤 adj. 长的；过长的；做多头的；长时间的；冗长的，长音 vi. 渴望；热望 adv. 长期地；始终"
    },
    {
        "word": "length",
        "definition": "n. 长度，长；时间的长短；（语）音长"
    },
    {
        "word": "lengthy",
        "definition": "adj. 漫长的，冗长的；啰唆的"
    },
    {
        "word": "look",
        "definition": "vt. 看；期待；注意；面向；看上去像 vi. 看；看起来；注意；面向 n. 看；样子；面容"
    },
    {
        "word": "loophole",
        "definition": "n. 漏洞；枪眼；换气孔；射弹孔"
    },
    {
        "word": "loose",
        "definition": "adj. 宽松的；散漫的；不牢固的；不精确的 vt. 释放；开船；放枪 vi. 变松；开火 adv. 松散地 n. 放纵；放任；发射"
    },
    {
        "word": "loosen",
        "definition": "vt. 放松；松开 vi. 放松；松开"
    },
    {
        "word": "lord",
        "definition": "n. 主；上帝 int. 主，天啊 vt. 使成贵族 vi. 作威作福，称王称霸"
    },
    {
        "word": "lorry",
        "definition": "n. （英）卡车； 货车；运料车"
    },
    {
        "word": "lose",
        "definition": "vt. 浪费；使沉溺于；使迷路；遗失；错过 vi. 失败；受损失"
    },
    {
        "word": "loss",
        "definition": "n. 减少；亏损；失败；遗失"
    },
    {
        "word": "lot",
        "definition": "n. 份额；许多；命运；阄 adv. （与形容词和副词连用）很，非常；（与动词连用）非常 pron. 大量，许多 vt. 分组，把…划分（常与out连用）；把（土地）划分成块 vi. 抽签，拈阄"
    },
    {
        "word": "loud",
        "definition": "adj. 大声的，高声的；不断的；喧吵的 adv. 大声地，高声地，响亮地"
    },
    {
        "word": "loudly",
        "definition": "adv. 大声地，响亮地"
    },
    {
        "word": "love",
        "definition": "n. 恋爱；亲爱的；酷爱；喜爱的事物；爱情，爱意；疼爱；热爱；爱人，所爱之物 v. 爱，热爱；爱戴；赞美，称赞；喜爱；喜好；喜欢；爱慕"
    },
    {
        "word": "lovely",
        "definition": "adj. 可爱的；令人愉快的；爱恋的；秀丽的，优美的 n. 美女；可爱的东西"
    },
    {
        "word": "lover",
        "definition": "n. 爱人，恋人；爱好者 n. 小三；第三者"
    },
    {
        "word": "low",
        "definition": "adj. 低的，浅的；卑贱的；粗俗的；消沉的 adv. 低声地；谦卑地，低下地 n. 低；低价；低点；牛叫声 vi. 牛叫"
    },
    {
        "word": "lower",
        "definition": "vt. 减弱，减少；放下，降下；贬低 vi. 降低；减弱；跌落 adj. 下游的；下级的；下等的"
    },
    {
        "word": "loyal",
        "definition": "adj. 忠诚的，忠心的；忠贞的 n. 效忠的臣民；忠实信徒"
    },
    {
        "word": "loyalty",
        "definition": "n. 忠诚；忠心；忠实；忠于…感情"
    },
    {
        "word": "luck",
        "definition": "n. 运气；幸运；带来好运的东西 vi. 靠运气，走运；凑巧碰上"
    },
    {
        "word": "lucky",
        "definition": "adj. 幸运的；侥幸的"
    },
    {
        "word": "luggage",
        "definition": "n. 行李；皮箱"
    },
    {
        "word": "lump",
        "definition": "n. 块，块状；肿块；瘤；很多；笨人 vt. 混在一起；使成块状；忍耐；笨重地移动 vi. 结块 adj. 成团的；总共的 adv. 很；非常"
    },
    {
        "word": "lunar",
        "definition": "adj. 月亮的，月球的；阴历的；银的；微亮的"
    },
    {
        "word": "lunch",
        "definition": "n. 午餐 vt. 吃午餐；供给午餐 vi. 吃午餐；供给午餐"
    },
    {
        "word": "luncheon",
        "definition": "n. 午宴；正式的午餐会"
    },
    {
        "word": "lung",
        "definition": "n. 肺；呼吸器"
    },
    {
        "word": "luxury",
        "definition": "n. 奢侈，奢华；奢侈品；享受 adj. 奢侈的"
    },
    {
        "word": "luxurious",
        "definition": "adj. 奢侈的；丰富的；放纵的；特级的"
    },
    {
        "word": "machine",
        "definition": "n. 机械，机器；机构；机械般工作的人 vt. 用机器制造"
    },
    {
        "word": "machinery",
        "definition": "n. 机械；机器；机构；机械装置"
    },
    {
        "word": "mad",
        "definition": "adj. 疯狂的；发疯的；愚蠢的；着迷的 n. 狂怒"
    },
    {
        "word": "madden",
        "definition": "vt. 使疯狂；激怒 vi. 发狂"
    },
    {
        "word": "madam",
        "definition": "n. 夫人；女士；鸨母"
    },
    {
        "word": "magazine",
        "definition": "n. 杂志；弹药库；胶卷盒"
    },
    {
        "word": "magic",
        "definition": "n. 巫术；魔法；戏法 adj. 不可思议的；有魔力的；魔术的"
    },
    {
        "word": "magical",
        "definition": "adj. 魔术的；有魔力的"
    },
    {
        "word": "magnet",
        "definition": "n. 磁铁； 磁体；磁石"
    },
    {
        "word": "magnetic",
        "definition": "adj. 地磁的；有磁性的；有吸引力的"
    },
    {
        "word": "magnificent",
        "definition": "adj. 高尚的；壮丽的；华丽的；宏伟的"
    },
    {
        "word": "magnificence",
        "definition": "n. 壮丽；宏伟；富丽堂皇"
    },
    {
        "word": "maid",
        "definition": "n. 女仆；少女 vt. 侍候；做新娘的女傧相 vi. 当女仆"
    },
    {
        "word": "maiden",
        "definition": "adj. 未婚的，处女的；初次的 n. 少女；处女"
    },
    {
        "word": "mail",
        "definition": "n. 邮件；邮政，邮递；盔甲 vt. 邮寄；给…穿盔甲 vi. 邮寄；寄出"
    },
    {
        "word": "main",
        "definition": "n. 主要部分，要点；体力；总管道 adj. 主要的，最重要的；全力的"
    },
    {
        "word": "mainland",
        "definition": "n. 大陆；本土 adj. 大陆的；本土的"
    },
    {
        "word": "mainstream",
        "definition": "n. 主流"
    },
    {
        "word": "maintain",
        "definition": "vt. 维持；继续；维修；主张；供养"
    },
    {
        "word": "maintenance",
        "definition": "n. 维护，维修；保持；生活费用"
    },
    {
        "word": "major",
        "definition": "adj. 主要的；重要的；主修的；较多的 n.  成年人；主修科目；陆军少校 vi. 主修"
    },
    {
        "word": "majority",
        "definition": "n. 多数；成年"
    },
    {
        "word": "make",
        "definition": "vt. 使得；进行；布置，准备，整理；制造；认为；获得；形成；安排；引起；构成 vi. 开始；前进；增大；被制造 n. 制造；构造；性情"
    },
    {
        "word": "makeup",
        "definition": "n. 化妆品；组成；补充；补考"
    },
    {
        "word": "male",
        "definition": "adj. 男性的；雄性的；有力的 n. 男人；雄性动物"
    },
    {
        "word": "mall",
        "definition": "n. 购物商场；林荫路；铁圈球场"
    },
    {
        "word": "mammal",
        "definition": "n.  哺乳动物"
    },
    {
        "word": "man",
        "definition": "n. 人；男人；人类；丈夫；雇工 vt. 操纵；给…配置人员；使增强勇气；在…就位"
    },
    {
        "word": "manly",
        "definition": "adj. 男子气概的；强壮的；适于男人的 adv. 雄赳赳地"
    },
    {
        "word": "manhood",
        "definition": "n. 成年；男子；男子气概"
    },
    {
        "word": "manage",
        "definition": "vt. 管理；经营；控制；设法 vi. 处理；应付过去"
    },
    {
        "word": "management",
        "definition": "n. 管理；管理人员；管理部门；操纵；经营手段"
    },
    {
        "word": "manager",
        "definition": "n. 经理；管理人员"
    },
    {
        "word": "managerial",
        "definition": "adj.  管理的；经理的"
    },
    {
        "word": "manipulate",
        "definition": "vt. 操纵；操作；巧妙地处理；篡改"
    },
    {
        "word": "manipulation",
        "definition": "n. 操纵；操作；处理；篡改"
    },
    {
        "word": "manipulative",
        "definition": "adj. 巧妙处理的；操纵的，用手控制的"
    },
    {
        "word": "mankind",
        "definition": "n. 人类；男性"
    },
    {
        "word": "manner",
        "definition": "n. 方式；习惯；种类；规矩；风俗"
    },
    {
        "word": "manual",
        "definition": "adj. 手工的；体力的 n. 手册，指南"
    },
    {
        "word": "manufacture",
        "definition": "n. 制造；产品；制造业 vt. 制造；加工；捏造 vi. 制造"
    },
    {
        "word": "manufacturer",
        "definition": "n. 制造商； 厂商"
    },
    {
        "word": "many",
        "definition": "pron. 许多；许多人 adj. 许多的"
    },
    {
        "word": "map",
        "definition": "vt. 映射；计划；绘制地图；确定基因在染色体中的位置 n. 地图；示意图；染色体图 vi. 基因被安置"
    },
    {
        "word": "marathon",
        "definition": "n. 马拉松赛跑；耐力的考验 adj. 马拉松式的；有耐力的 vi. 参加马拉松赛跑"
    },
    {
        "word": "March",
        "definition": ""
    },
    {
        "word": "march",
        "definition": "n. 三月"
    },
    {
        "word": "margin",
        "definition": "n. 边缘；利润，余裕；页边的空白 vt. 加边于；加旁注于"
    },
    {
        "word": "marginal",
        "definition": "adj. 边缘的；临界的；末端的"
    },
    {
        "word": "marine",
        "definition": "adj. 船舶的；海生的；海产的；航海的，海运的 n. 海运业；舰队；水兵；（海军）士兵或军官"
    },
    {
        "word": "mark",
        "definition": "n. 标志；马克；符号；痕迹；分数 vi. 作记号 vt. .标志；做标记于；打分数 n. . 标志；做标记于；打分数"
    },
    {
        "word": "market",
        "definition": "n. 市场；行情；股票市场；市面；集市；销路；商店 vt. 在市场上出售 vi. 做买卖"
    },
    {
        "word": "marketing",
        "definition": "n. 行销，销售 v. 出售；在市场上进行交易；使…上市（market的ing形式）"
    },
    {
        "word": "marry",
        "definition": "vt. 嫁；娶；与……结婚 vi. 结婚"
    },
    {
        "word": "marriage",
        "definition": "n. 结婚；婚姻生活；密切结合，合并"
    },
    {
        "word": "marital",
        "definition": "adj. 婚姻的；夫妇间的"
    },
    {
        "word": "marsh",
        "definition": "n. 沼泽；湿地 adj. 沼泽的；生长在沼泽地的"
    },
    {
        "word": "marshal",
        "definition": "n. 元帅；司仪 vt. 整理；引领；编列 vi. 排列"
    },
    {
        "word": "marvel",
        "definition": "n. 奇迹 vt. 对…感到惊异 vi. 感到惊讶"
    },
    {
        "word": "marvelous",
        "definition": "adj. 了不起的；非凡的；令人惊异的；不平常的"
    },
    {
        "word": "marvellous",
        "definition": "adj. 不可思议的；惊人的"
    },
    {
        "word": "Marxism",
        "definition": "n. 马克思主义 adj. 马克思的；马克思主义的"
    },
    {
        "word": "Marxist",
        "definition": "n. 马克思主义者 adj. 马克思主义的"
    },
    {
        "word": "mask",
        "definition": "n. 面具；口罩；掩饰 vi. 掩饰；戴面具；化装 vt. 掩饰；戴面具；使模糊"
    },
    {
        "word": "mass",
        "definition": "n. 块，团；群众，民众；大量，众多；质量 adj. 群众的，民众的；大规模的，集中的 vi. 聚集起来，聚集 vt. 使集合"
    },
    {
        "word": "massive",
        "definition": "adj. 大量的；巨大的，厚重的；魁伟的"
    },
    {
        "word": "massage",
        "definition": "vt. 按摩；揉 n. 按摩；揉"
    },
    {
        "word": "master",
        "definition": "vt. 控制；精通；征服 n. 硕士；主人；大师；教师 adj. 主人的；主要的；熟练的"
    },
    {
        "word": "mastery",
        "definition": "n. 掌握；精通；优势；征服；统治权"
    },
    {
        "word": "masterpiece",
        "definition": "n. 杰作；绝无仅有的人"
    },
    {
        "word": "mat",
        "definition": "n. 垫；垫子；衬边 vt. 缠结；铺席于……上 vi. 纠缠在一起 adj. 无光泽的"
    },
    {
        "word": "match",
        "definition": "vt. 使比赛；使相配；敌得过，比得上；相配；与…竞争 vi. 比赛；匹配；相配，相称；相比 n. 比赛，竞赛；匹配；对手；火柴"
    },
    {
        "word": "mate",
        "definition": "n. 助手，大副；配偶；同事；配对物 vt. 使配对；使一致；结伴 vi. 交配；成配偶；紧密配合"
    },
    {
        "word": "material",
        "definition": "adj. 重要的；物质的，实质性的；肉体的 n. 材料，原料；物资；布料"
    },
    {
        "word": "materialism",
        "definition": "n. 唯物主义；唯物论；物质主义"
    },
    {
        "word": "materialist",
        "definition": "n. 唯物主义者；实利主义者"
    },
    {
        "word": "materialize",
        "definition": "vt. 使具体化，使有形；使突然出现；使重物质而轻精神 vi. 实现，成形；突然出现"
    },
    {
        "word": "materialise",
        "definition": "vt. 物质化（等于materialize） vi. 突然出现（等于materialize）"
    },
    {
        "word": "math",
        "definition": "n. 数学（等于mathematics）"
    },
    {
        "word": "mathematics",
        "definition": "n. 数学；数学运算"
    },
    {
        "word": "maths",
        "definition": "n. 数学（等于mathematics）"
    },
    {
        "word": "mathematical",
        "definition": "adj. 数学的，数学上的；精确的"
    },
    {
        "word": "matter",
        "definition": "n. 物质；事件 vi. 有关系；要紧"
    },
    {
        "word": "mature",
        "definition": "adj. 成熟的；充分考虑的；到期的；成年人的 vi. 成熟；到期 vt. 使…成熟；使…长成；慎重作出"
    },
    {
        "word": "maturity",
        "definition": "n. 成熟；到期；完备"
    },
    {
        "word": "maximum",
        "definition": "n.  极大，最大限度；最大量 adj. 最高的；最多的；最大极限的"
    },
    {
        "word": "maximize",
        "definition": "vt. 取…最大值；对…极为重视 vi. 尽可能广义地解释；达到最大值"
    },
    {
        "word": "maximise",
        "definition": "vt. 把…增加到最大限度；尽量增大（等于maximize）"
    },
    {
        "word": "maximal",
        "definition": "adj. 最高的，最大的；最全面的"
    },
    {
        "word": "May",
        "definition": ""
    },
    {
        "word": "may",
        "definition": "aux. 可以，能够；可能，也许；祝，愿；会，能"
    },
    {
        "word": "maybe",
        "definition": "adv. 也许；可能；大概 n. 可能性；不确定性"
    },
    {
        "word": "mayor",
        "definition": "n. 市长"
    },
    {
        "word": "me",
        "definition": "pron. 我（宾格） n. 自我；极端自私的人；自我的一部分"
    },
    {
        "word": "meal",
        "definition": "n. 一餐，一顿饭；膳食 vi. 进餐"
    },
    {
        "word": "mean",
        "definition": "adj. 平均的；卑鄙的；低劣的；吝啬的 vt. 意味；想要；意欲 n. 平均值 vi. 用意"
    },
    {
        "word": "meaning",
        "definition": "n. 意义；含义；意图 adj. 意味深长的 v. 意味；意思是（mean的ing形式）"
    },
    {
        "word": "meaningful",
        "definition": "adj. 有意义的；意味深长的"
    },
    {
        "word": "means",
        "definition": "n. 手段；方法；财产 v. 意思是；打算（mean的第三人称单数） "
    },
    {
        "word": "meantime",
        "definition": "n. 其时，其间 adv. 同时；其间"
    },
    {
        "word": "meanwhile",
        "definition": "adv. 同时，其间 n. 其间，其时"
    },
    {
        "word": "measure",
        "definition": "n. 测量；措施；程度；尺寸 vt. 测量；估量；权衡 vi. 测量；估量"
    },
    {
        "word": "measurement",
        "definition": "n. 测量； 度量；尺寸；量度制"
    },
    {
        "word": "measurable",
        "definition": "adj. 可测量的；重要的；重大的"
    },
    {
        "word": "meat",
        "definition": "n. 肉，肉类（食用）"
    },
    {
        "word": "meaty",
        "definition": "adj. 肉的；多肉的；似肉的"
    },
    {
        "word": "mechanic",
        "definition": "n. 技工，机修工 adj. 手工的"
    },
    {
        "word": "mechanical",
        "definition": "adj. 机械的；力学的；呆板的；无意识的；手工操作的"
    },
    {
        "word": "mechanics",
        "definition": "n. 力学（用作单数）；结构；技术；机械学（用作单数）"
    },
    {
        "word": "mechanism",
        "definition": "n. 机制；原理，途径；进程；机械装置；技巧"
    },
    {
        "word": "mechanize",
        "definition": "vt. 使机械化；机动化；用机械装置"
    },
    {
        "word": "mechanise",
        "definition": "vt. 使……用机械装置；使……机械化"
    },
    {
        "word": "mechanization",
        "definition": "n. 机械化；机动化"
    },
    {
        "word": "mechanisation",
        "definition": " 机械化"
    },
    {
        "word": "medal",
        "definition": "n. 勋章，奖章；纪念章"
    },
    {
        "word": "medical",
        "definition": "adj. 医学的；药的；内科的 n. 医生；体格检查"
    },
    {
        "word": "Medicare",
        "definition": ""
    },
    {
        "word": "medicine",
        "definition": "n. 药；医学；内科；巫术 vt. 用药物治疗；给…用药"
    },
    {
        "word": "medicinal",
        "definition": "adj. 药的；药用的；治疗的（等于medicinable）；有益的"
    },
    {
        "word": "medium",
        "definition": "adj. 中间的，中等的；半生熟的 n. 方法；媒体；媒介；中间物"
    },
    {
        "word": "media",
        "definition": "n. 媒体；媒质（medium的复数）；血管中层；浊塞音；中脉"
    },
    {
        "word": "meet",
        "definition": "vt. 满足；遇见；对付 vi. 相遇；接触 n. 集会 adj. 合适的；适宜的"
    },
    {
        "word": "meeting",
        "definition": "n. 会议；会见；集会；汇合点 v. 会面；会合（meet的ing形式）"
    },
    {
        "word": "melon",
        "definition": "n. 瓜；甜瓜；大肚子；圆鼓鼓像瓜似的东西"
    },
    {
        "word": "melt",
        "definition": "vi. 熔化，溶解；渐混 vt. 使融化；使熔化；使软化；使感动 n. 熔化；熔化物"
    },
    {
        "word": "member",
        "definition": "n. 成员；会员；议员"
    },
    {
        "word": "membership",
        "definition": "n. 资格；成员资格；会员身份"
    },
    {
        "word": "memorandum",
        "definition": "n. 备忘录；便笺"
    },
    {
        "word": "memo",
        "definition": "n. 备忘录"
    },
    {
        "word": "memorial",
        "definition": "n. 纪念碑，纪念馆；纪念仪式；纪念物 adj. 记忆的；纪念的，追悼的"
    },
    {
        "word": "memory",
        "definition": "n. 记忆，记忆力；内存， 存储器；回忆"
    },
    {
        "word": "memorize",
        "definition": "vt. 记住，背熟；记忆"
    },
    {
        "word": "memorise",
        "definition": "vt. （英）记忆；存储（等于memorize）"
    },
    {
        "word": "mend",
        "definition": "vt. 修理，修补；改善；修改 vi. 改善，好转 n. 好转，改进；修补处"
    },
    {
        "word": "mental",
        "definition": "adj. 精神的；脑力的；疯的 n. 精神病患者"
    },
    {
        "word": "mentality",
        "definition": "n. 心态； 智力；精神力；头脑作用"
    },
    {
        "word": "mention",
        "definition": "vt. 提到，谈到；提及，论及；说起 n. 提及，说起"
    },
    {
        "word": "menu",
        "definition": "n. 菜单 饭菜"
    },
    {
        "word": "merchant",
        "definition": "n. 商人，批发商；店主 adj. 商业的，商人的"
    },
    {
        "word": "mercy",
        "definition": "n. 仁慈，宽容；怜悯；幸运；善行"
    },
    {
        "word": "merciful",
        "definition": "adj. 仁慈的；慈悲的；宽容的"
    },
    {
        "word": "mere",
        "definition": "adj. 仅仅的；只不过的 n. 小湖；池塘"
    },
    {
        "word": "merely",
        "definition": "adv. 仅仅，只不过；只是"
    },
    {
        "word": "merit",
        "definition": "n. 优点，价值；功绩；功过 vt. 值得 vi. 应受报答"
    },
    {
        "word": "meritorious",
        "definition": "adj. 有功绩的；有价值的；值得称赞的"
    },
    {
        "word": "merry",
        "definition": "adj. 愉快的；微醉的；嬉戏作乐的 n. 甜樱桃"
    },
    {
        "word": "merriment",
        "definition": "n. 欢喜；嬉戏"
    },
    {
        "word": "mess",
        "definition": "n. 混乱；食堂，伙食团；困境；脏乱的东西 vt. 弄乱，弄脏；毁坏；使就餐 vi. 把事情弄糟；制造脏乱；玩弄"
    },
    {
        "word": "messy",
        "definition": "adj. 凌乱的，散乱的；肮脏的，污秽的；麻烦的"
    },
    {
        "word": "message",
        "definition": "n. 消息；差使；启示；预言；广告词 vi. 报信，报告； 报文 vt. 通知"
    },
    {
        "word": "messenger",
        "definition": "n. 报信者，送信者；先驱"
    },
    {
        "word": "metal",
        "definition": "n. 金属；合金 vt. 以金属覆盖 adj. 金属制的"
    },
    {
        "word": "metallic",
        "definition": "adj. 金属的，含金属的"
    },
    {
        "word": "meter",
        "definition": "n. 米；仪表； 公尺；韵律 vt. 用仪表测量 vi. 用表计量"
    },
    {
        "word": "metre",
        "definition": "n. 米；公尺；韵律"
    },
    {
        "word": "metric",
        "definition": "adj. 公制的；米制的；公尺的 n. 度量标准"
    },
    {
        "word": "method",
        "definition": "n. 方法；条理；类函数 adj. 使用体验派表演方法的"
    },
    {
        "word": "methodical",
        "definition": "adj. 有系统的；有方法的"
    },
    {
        "word": "methodology",
        "definition": "n. 方法学，方法论"
    },
    {
        "word": "metro",
        "definition": "n. 地铁；大都市；伦敦地下铁道；麦德隆（财富500强公司之一，总部所在地德国，主要经营零售）"
    },
    {
        "word": "microphone",
        "definition": "n. 扩音器，麦克风"
    },
    {
        "word": "microscope",
        "definition": "n. 显微镜"
    },
    {
        "word": "microscopic",
        "definition": "adj. 微观的；用显微镜可见的"
    },
    {
        "word": "microwave",
        "definition": "n. 微波"
    },
    {
        "word": "microwavable",
        "definition": "n. 微波；微波炉 vt. 用微波炉加热"
    },
    {
        "word": "midday",
        "definition": "n. 中午；正午 adj. 正午的"
    },
    {
        "word": "middle",
        "definition": "adj. 中间的，中部的；中级的，中等的 n. 中间，中央；腰部"
    },
    {
        "word": "middle-class",
        "definition": "adj. 中产阶级的；中层社会的"
    },
    {
        "word": "midnight",
        "definition": "n. 午夜，半夜12点钟 adj. 半夜的；漆黑的"
    },
    {
        "word": "might",
        "definition": "n. 力量；威力；势力 v. 可以；或许（may的过去式）；应该 aux. 可能；也许"
    },
    {
        "word": "mighty",
        "definition": "adj. 有力的；强有力的；有势力的 adv. 很；极；非常 n. 有势力的人"
    },
    {
        "word": "migrate",
        "definition": "vi. 移动；随季节而移居；移往 vt. 使移居；使移植"
    },
    {
        "word": "migration",
        "definition": "n. 迁移；移民；移动"
    },
    {
        "word": "migrant",
        "definition": "n. 候鸟；移居者；随季节迁移的民工 adj. 移居的；流浪的"
    },
    {
        "word": "mild",
        "definition": "adj. 温和的；轻微的；淡味的；文雅的；不含有害物质的的 n. （英国的一种）淡味麦芽啤酒"
    },
    {
        "word": "mile",
        "definition": "n. 英里；一英里赛跑；较大的距离"
    },
    {
        "word": "mileage",
        "definition": "n. 英里数"
    },
    {
        "word": "military",
        "definition": "adj. 军事的；军人的；适于战争的 n. 军队；军人"
    },
    {
        "word": "milk",
        "definition": "n. 牛奶；乳状物 vt. 榨取；挤…的奶 vi. 挤奶"
    },
    {
        "word": "milky",
        "definition": "adj. 乳白色的；牛奶的；乳状的；柔和的；混浊不清的"
    },
    {
        "word": "mill",
        "definition": "vi. 乱转；被碾磨 n. 工厂；磨坊；磨粉机；制造厂；压榨机 vt. 搅拌；碾磨；磨细；使乱转"
    },
    {
        "word": "millimeter",
        "definition": "n.  毫米"
    },
    {
        "word": "millimetre",
        "definition": "n. 毫米；公厘"
    },
    {
        "word": "million",
        "definition": "n. 百万；无数 adj. 百万的；无数的 num. 百万"
    },
    {
        "word": "millionaire",
        "definition": "n. 百万富翁；大富豪 adj. 100万以上人口的"
    },
    {
        "word": "mind",
        "definition": "n. 理智，精神；意见；智力；记忆力 vt. 介意；专心于；照料 vi. 介意；注意"
    },
    {
        "word": "mine",
        "definition": "n. 矿，矿藏；矿山，矿井；地雷，水雷 vt. 开采，采掘；在…布雷 vi. 开矿，采矿；埋设地雷 pron. 我的"
    },
    {
        "word": "mineral",
        "definition": "n. 矿物；（英）矿泉水；无机物；苏打水（常用复数表示） adj. 矿物的；矿质的"
    },
    {
        "word": "mining",
        "definition": "n. 矿业；采矿"
    },
    {
        "word": "minimum",
        "definition": "n. 最小值；最低限度；最小化；最小量 adj. 最小的；最低的"
    },
    {
        "word": "minimal",
        "definition": "adj. 最低的；最小限度的"
    },
    {
        "word": "minimize",
        "definition": "vt. 使减到最少；小看，极度轻视 vi. 最小化"
    },
    {
        "word": "minimise",
        "definition": "vt. 使缩到最小；成极小；求最小值"
    },
    {
        "word": "minister",
        "definition": "n. 部长；大臣；牧师 vi. 执行牧师职务；辅助或伺候某人"
    },
    {
        "word": "ministry",
        "definition": "n. （政府的）部门"
    },
    {
        "word": "ministerial",
        "definition": "adj. 部长的；内阁的；公使的；牧师的"
    },
    {
        "word": "minor",
        "definition": "adj. 未成年的；次要的；较小的；小调的；二流的 n. 未成年人；小调；副修科目 vi. 副修"
    },
    {
        "word": "minority",
        "definition": "n. 少数民族；少数派；未成年 adj. 少数的；属于少数派的"
    },
    {
        "word": "minus",
        "definition": "prep. 减，减去 n. 负号，减号；不足；负数 adj. 减的；负的"
    },
    {
        "word": "minute",
        "definition": "n. 分，分钟；片刻，一会儿；备忘录，笔记；会议记录 vt. 将…记录下来 adj. 微小的，详细的 "
    },
    {
        "word": "miracle",
        "definition": "n. 奇迹，奇迹般的人或物；惊人的事例"
    },
    {
        "word": "miraculous",
        "definition": "adj. 不可思议的，奇迹的"
    },
    {
        "word": "mirror",
        "definition": "n. 镜子；真实的写照；榜样 vt. 反射；反映"
    },
    {
        "word": "miserable",
        "definition": "adj. 悲惨的；痛苦的；卑鄙的"
    },
    {
        "word": "misery",
        "definition": "n. 痛苦，悲惨；不幸；苦恼；穷困"
    },
    {
        "word": "misfortune",
        "definition": "n. 不幸；灾祸，灾难"
    },
    {
        "word": "mislead",
        "definition": "vt. 误导；带错"
    },
    {
        "word": "misleading",
        "definition": "adj. 令人误解的；引入歧途的 v. 给…带错路；把…引入歧途（mislead的ing形式）"
    },
    {
        "word": "miss",
        "definition": "n. 女士，小姐，年轻未婚女子 vt. 错过，想念，缺（勤）"
    },
    {
        "word": "missile",
        "definition": "n. 导弹；投射物 adj. 导弹的；可投掷的；用以发射导弹的"
    },
    {
        "word": "missing",
        "definition": "adj. 失踪的；缺少的 v. 错过（miss的ing形式）；想念；漏掉"
    },
    {
        "word": "mission",
        "definition": "n. 使命，任务；代表团；布道 vt. 派遣；向……传教"
    },
    {
        "word": "mist",
        "definition": "n. 薄雾；视线模糊不清；模糊不清之物 vi. 下雾；变模糊 vt. 使模糊；使蒙上薄雾"
    },
    {
        "word": "misty",
        "definition": "adj. 模糊的；有雾的"
    },
    {
        "word": "mistake",
        "definition": "n. 错误；误会；过失 vt. 弄错；误解 vi. 弄错；误解"
    },
    {
        "word": "mistaken",
        "definition": "adj. 错误的；弄错的；被误解的 v. 弄错（mistake的过去分词）"
    },
    {
        "word": "mister",
        "definition": ""
    },
    {
        "word": "mistress",
        "definition": "n. 情妇；女主人；主妇；女教师；女能人"
    },
    {
        "word": "misunderstand",
        "definition": "vt. 误解；误会"
    },
    {
        "word": "misunderstanding",
        "definition": "n. 误解；误会；不和"
    },
    {
        "word": "mix",
        "definition": "vt. 配制；混淆；使混和；使结交 vi. 参与；相混合；交往 n. 混合；混合物；混乱"
    },
    {
        "word": "mixture",
        "definition": "n. 混合；混合物；混合剂"
    },
    {
        "word": "mixer",
        "definition": "n. 混合器；搅拌器； 混频器"
    },
    {
        "word": "mobile",
        "definition": "adj. 可移动的；机动的；易变的；非固定的 n. 运动物体"
    },
    {
        "word": "mode",
        "definition": "n. 模式；方式；风格；时尚"
    },
    {
        "word": "model",
        "definition": "n. 模型；典型；模范；模特儿；样式 vt. 模拟；塑造；模仿 vi. 做模型；做模特儿 adj. 模范的；作模型用的"
    },
    {
        "word": "moderate",
        "definition": "adj. 稳健的，温和的；适度的，中等的；有节制的 vi. 变缓和，变弱 vt. 节制；减轻"
    },
    {
        "word": "moderation",
        "definition": "n. 适度；节制；温和；缓和"
    },
    {
        "word": "moderator",
        "definition": "n.  慢化剂；仲裁人；调解人；缓和剂"
    },
    {
        "word": "modern",
        "definition": "adj. 现代的，近代的；时髦的 n. 现代人；有思想的人"
    },
    {
        "word": "modernize",
        "definition": "vt. 使…现代化 vi. 现代化"
    },
    {
        "word": "modernise",
        "definition": "vi. 现代化（等于modernize） vt. 使…现代化（等于modernize）"
    },
    {
        "word": "modernization",
        "definition": "n. 现代化"
    },
    {
        "word": "modernisation",
        "definition": "n. <主英>=modernization"
    },
    {
        "word": "modest",
        "definition": "adj. 谦虚的，谦逊的；适度的；端庄的；羞怯的"
    },
    {
        "word": "modesty",
        "definition": "n. 谦逊；质朴；稳重"
    },
    {
        "word": "modify",
        "definition": "vt. 修改，修饰；更改 vi. 修改"
    },
    {
        "word": "modification",
        "definition": "n. 修改，修正；改变"
    },
    {
        "word": "modifier",
        "definition": "n.  改性剂； 修饰语；修正的人"
    },
    {
        "word": "moist",
        "definition": "adj. 潮湿的；多雨的；含泪的 n. 潮湿"
    },
    {
        "word": "moisture",
        "definition": "n. 水分；湿度；潮湿；降雨量"
    },
    {
        "word": "mold",
        "definition": "vt. 塑造；使发霉；用模子制作 vi. 发霉 n. 霉菌；模子"
    },
    {
        "word": "mould",
        "definition": "vi. 发霉 vt. 浇铸；用泥土覆盖 n. 模具；霉"
    },
    {
        "word": "moldy",
        "definition": "adj. 发霉的；乏味的；陈腐的"
    },
    {
        "word": "mouldy",
        "definition": "n. 鱼雷 adj. 发霉的；旧式的；腐朽的"
    },
    {
        "word": "mom",
        "definition": "n. 妈妈"
    },
    {
        "word": "mommy",
        "definition": "n. 妈咪"
    },
    {
        "word": "moment",
        "definition": "n. 片刻，瞬间，时刻；重要，契机"
    },
    {
        "word": "momentary",
        "definition": "adj. 瞬间的；短暂的；随时会发生的"
    },
    {
        "word": "momentarily",
        "definition": "adv. 随时地；暂时地；立刻"
    },
    {
        "word": "Monday",
        "definition": "n. 星期一"
    },
    {
        "word": "money",
        "definition": "n. 钱；货币；财富"
    },
    {
        "word": "monetary",
        "definition": "adj. 货币的；财政的"
    },
    {
        "word": "monitor",
        "definition": "n. 监视器；监听器；监控器；显示屏；班长 vt. 监控"
    },
    {
        "word": "monkey",
        "definition": "n. 猴子；顽童 vi. 胡闹；捣蛋 vt. 嘲弄"
    },
    {
        "word": "monster",
        "definition": "n. 怪物；巨人，巨兽；残忍的人 adj. 巨大的，庞大的"
    },
    {
        "word": "monstrous",
        "definition": "adj. 巨大的；怪异的；荒谬的；畸形的"
    },
    {
        "word": "month",
        "definition": "n. 月，一个月的时间"
    },
    {
        "word": "monthly",
        "definition": "adj. 每月的，每月一次的；有效期为一个月的 n. 月刊 adv. 每月，每月一次"
    },
    {
        "word": "monument",
        "definition": "n. 纪念碑；历史遗迹；不朽的作品 vt. 为…树碑"
    },
    {
        "word": "monumental",
        "definition": "adj. 不朽的；纪念碑的；非常的"
    },
    {
        "word": "mood",
        "definition": "n. 情绪，语气；心境；气氛"
    },
    {
        "word": "moody",
        "definition": "adj. 喜怒无常的；易怒的；郁郁寡欢的"
    },
    {
        "word": "moon",
        "definition": "n. 月亮；月球；月光；卫星 vi. 闲荡；出神 vt. 虚度"
    },
    {
        "word": "mop",
        "definition": "vt. 擦干；用拖把拖洗 vi. 用拖把擦洗地板；扮鬼脸 n. 拖把；蓬松的头发；鬼脸"
    },
    {
        "word": "moral",
        "definition": "adj. 道德的；精神上的；品性端正的 n. 道德；寓意"
    },
    {
        "word": "morality",
        "definition": "n. 道德；品行，美德"
    },
    {
        "word": "more",
        "definition": "adv. 更多；此外；更大程度地 adj. 更多的；附加的 pron. 更多的数量 n. 更多"
    },
    {
        "word": "moreover",
        "definition": "adv. 而且；此外"
    },
    {
        "word": "morning",
        "definition": "n. 早晨；黎明；初期"
    },
    {
        "word": "mortgage",
        "definition": "vt. 抵押 n. 抵押 房屋抵押贷款"
    },
    {
        "word": "most",
        "definition": "adv. 最；非常，极其；最多；几乎 adj. 大部分的，多数的；最多的 n. 大部分，大多数"
    },
    {
        "word": "mostly",
        "definition": "adv. 主要地；通常；多半地"
    },
    {
        "word": "motel",
        "definition": "n. 汽车旅馆"
    },
    {
        "word": "mother",
        "definition": "n. 母亲；大娘；女修道院院长 vt. 生下；养育；像母亲般关怀或照管 adj. 母亲的；出生地的"
    },
    {
        "word": "motherly",
        "definition": "adj. 母亲的；慈母般的"
    },
    {
        "word": "motion",
        "definition": "n. 动作；移动；手势；请求；意向；议案 vi. 运动；打手势 vt. 运动；向…打手势"
    },
    {
        "word": "motivate",
        "definition": "vt. 刺激；使有动机；激发…的积极性"
    },
    {
        "word": "motivation",
        "definition": "n. 动机；积极性；推动"
    },
    {
        "word": "motive",
        "definition": "n. 动机，目的；主题 adj. 发动的；成为动机的 vt. 使产生动机，激起"
    },
    {
        "word": "motor",
        "definition": "n. 发动机，马达；汽车 adj. 汽车的；机动的 vi. 乘汽车 vt. 以汽车载运"
    },
    {
        "word": "motorway",
        "definition": "n. 高速公路，汽车高速公路"
    },
    {
        "word": "mount",
        "definition": "vt. 增加；爬上；使骑上马；安装，架置；镶嵌，嵌入；准备上演；成立（军队等） vi. 爬；增加；上升 n. 山峰；底座；乘骑用马；攀，登；运载工具；底座 v. 登上；骑上"
    },
    {
        "word": "mounting",
        "definition": "n. 装备，装配；上马；衬托纸 v. 增加（mount的ing形式）；爬上 adj. 逐渐增加的"
    },
    {
        "word": "mountain",
        "definition": "n. 山；山脉"
    },
    {
        "word": "mountainous",
        "definition": "adj. 多山的；巨大的；山一般的"
    },
    {
        "word": "mouse",
        "definition": "n. 鼠标；老鼠；胆小羞怯的人 vt. 探出 vi. 捕鼠；窥探"
    },
    {
        "word": "mouth",
        "definition": "n. 口，嘴；河口 vt. 做作地说，装腔作势地说；喃喃地说出 vi. 装腔作势说话"
    },
    {
        "word": "mouthful",
        "definition": "n. 一口，满口"
    },
    {
        "word": "move",
        "definition": "n. 移动；步骤；迁居；策略 vi. 移动；搬家，迁移；离开 vt. 移动；感动"
    },
    {
        "word": "movement",
        "definition": "n. 运动；活动；运转；乐章"
    },
    {
        "word": "movie",
        "definition": "n. 电影；电影院；电影业 adj. 电影的"
    },
    {
        "word": "much",
        "definition": "adv. 非常，很 adj. 大量的 n. 许多，大量 pron. 许多，大量"
    },
    {
        "word": "mud",
        "definition": "vt. 弄脏；用泥涂 vi. 钻入泥中 n. 泥；诽谤的话；无价值的东西"
    },
    {
        "word": "muddy",
        "definition": "adj. 泥泞的；模糊的；混乱的 vt. 使污浊；使沾上泥；把…弄糊涂 vi. 变得泥泞；沾满烂泥"
    },
    {
        "word": "mug",
        "definition": "n. 杯子；脸；苦读者 vi. 扮鬼脸，做怪相 vt. 行凶抢劫"
    },
    {
        "word": "mule",
        "definition": "n. 骡；倔强之人，顽固的人；杂交种动物"
    },
    {
        "word": "multiple",
        "definition": "adj. 多重的；多样的；许多的 n. 倍数； 并联"
    },
    {
        "word": "multiply",
        "definition": "vt. 乘；使增加；使繁殖；使相乘 vi. 乘；繁殖；增加 adv. 多样地；复合地 adj. 多层的；多样的"
    },
    {
        "word": "multiplication",
        "definition": "n.  乘法；增加"
    },
    {
        "word": "municipal",
        "definition": "adj. 市政的，市的；地方自治的"
    },
    {
        "word": "municipality",
        "definition": "n. 市民；市政当局；自治市或区"
    },
    {
        "word": "murder",
        "definition": "vt. 谋杀，凶杀 n. 谋杀，凶杀 vi. 杀人，犯杀人罪"
    },
    {
        "word": "murderous",
        "definition": "adj. 杀人的，残忍的；凶残的；蓄意谋杀的"
    },
    {
        "word": "muscle",
        "definition": "n. 肌肉；力量 vt. 加强；使劲搬动；使劲挤出 vi. 使劲行进"
    },
    {
        "word": "muscular",
        "definition": "adj. 肌肉的；肌肉发达的；强健的"
    },
    {
        "word": "museum",
        "definition": "n. 博物馆"
    },
    {
        "word": "mushroom",
        "definition": "n. 蘑菇，伞菌；蘑菇形物体；暴发户 adj. 蘑菇的；蘑菇形的；迅速生长的 vi. 迅速增加；采蘑菇；迅速生长"
    },
    {
        "word": "music",
        "definition": "n. 音乐，乐曲"
    },
    {
        "word": "musical",
        "definition": "adj. 音乐的；悦耳的 n. 音乐片"
    },
    {
        "word": "musician",
        "definition": "n. 音乐家"
    },
    {
        "word": "must",
        "definition": "aux. 必须，一定；可以，应当；很可能 n. 绝对必要的事物；未发酵葡萄汁"
    },
    {
        "word": "mutual",
        "definition": "adj. 共同的；相互的，彼此的"
    },
    {
        "word": "my",
        "definition": "pron. 我的 int. 哎呀（表示惊奇等）；喔唷"
    },
    {
        "word": "myself",
        "definition": "pron. 我自己；我亲自；我的正常的健康状况和正常情绪"
    },
    {
        "word": "mystery",
        "definition": "n. 秘密，谜；神秘，神秘的事物；推理小说，推理剧；常作 mysteries 秘技，秘诀"
    },
    {
        "word": "mysterious",
        "definition": "adj. 神秘的；不可思议的；难解的"
    },
    {
        "word": "myth",
        "definition": "n. 神话；虚构的人，虚构的事"
    },
    {
        "word": "mythical",
        "definition": "adj. 神话的；虚构的"
    },
    {
        "word": "mythology",
        "definition": "n. 神话；神话学；神话集"
    },
    {
        "word": "nail",
        "definition": "vt. 钉；使固定；揭露 n.  指甲；钉子"
    },
    {
        "word": "naked",
        "definition": "adj. 裸体的；无装饰的；无证据的；直率的"
    },
    {
        "word": "name",
        "definition": "n. 名称，名字；姓名；名誉 vt. 命名，任命；指定；称呼；提名；叫出 adj. 姓名的；据以取名的"
    },
    {
        "word": "namely",
        "definition": "adv. 也就是；即是；换句话说"
    },
    {
        "word": "nap",
        "definition": "n. 小睡，打盹儿；细毛；孤注一掷 vt. 使拉毛 vi. 小睡；疏忽"
    },
    {
        "word": "napkin",
        "definition": "n. 餐巾；餐巾纸；尿布"
    },
    {
        "word": "narrate",
        "definition": "vt. 叙述；给…作旁白 vi. 叙述；讲述"
    },
    {
        "word": "narration",
        "definition": "n. 叙述，讲述；故事"
    },
    {
        "word": "narrative",
        "definition": "n. 叙述；故事；讲述 adj. 叙事的，叙述的；叙事体的"
    },
    {
        "word": "narrator",
        "definition": "n. 叙述者；解说员"
    },
    {
        "word": "narrow",
        "definition": "adj. 狭窄的，有限的；勉强的；精密的；度量小的 n. 海峡；狭窄部分，隘路 vt. 使变狭窄 vi. 变窄"
    },
    {
        "word": "narrowly",
        "definition": "adv. 仔细地；勉强地；狭窄地；严密地"
    },
    {
        "word": "nasty",
        "definition": "adj. 下流的；肮脏的；脾气不好的；险恶的 n. 令人不快的事物 性的吸引力"
    },
    {
        "word": "nation",
        "definition": "n. 国家；民族；国民"
    },
    {
        "word": "national",
        "definition": "adj. 国家的；国民的；民族的；国立的 n. 国民"
    },
    {
        "word": "nationality",
        "definition": "n. 国籍，国家；民族；部落"
    },
    {
        "word": "nationalist",
        "definition": "n. 民族主义者；国家主义者；民族独立主义者 adj. 民族主义的（等于nationalistic）；国家主义的；民族独立主义的"
    },
    {
        "word": "nationalism",
        "definition": "n. 民族主义；国家主义；民族特性"
    },
    {
        "word": "nationwide",
        "definition": "adj. 全国范围的；全国性的 adv. 在全国"
    },
    {
        "word": "native",
        "definition": "adj. 本国的；土著的；天然的；与生俱来的；天赋的 n. 本地人；土产；当地居民"
    },
    {
        "word": "nature",
        "definition": "n. 自然；性质；本性；种类"
    },
    {
        "word": "natural",
        "definition": "adj. 自然的；物质的；天生的；不做作的 n. 自然的事情；白痴；本位音"
    },
    {
        "word": "naturally",
        "definition": "adv. 自然地 自然而然地 轻而易举 天生地 大方地"
    },
    {
        "word": "naughty",
        "definition": "adj. 顽皮的，淘气的；不听话的；没规矩的；不适当的；下流的"
    },
    {
        "word": "navy",
        "definition": "n. 海军 深蓝色的"
    },
    {
        "word": "naval",
        "definition": "adj. 海军的；军舰的"
    },
    {
        "word": "near",
        "definition": "adj. 近的；亲近的；近似的 adv. 近；接近 prep. 靠近；近似于"
    },
    {
        "word": "nearly",
        "definition": "adv. 差不多，几乎；密切地"
    },
    {
        "word": "nearby",
        "definition": "adj. 附近的，邻近的 adv. 在附近 prep. 在…附近"
    },
    {
        "word": "neat",
        "definition": "adj. 灵巧的；整洁的；优雅的；齐整的；未搀水的；平滑的"
    },
    {
        "word": "necessary",
        "definition": "adj. 必要的；必需的；必然的 n. 必需品"
    },
    {
        "word": "necessarily",
        "definition": "adv. 必要地；必定地，必然地"
    },
    {
        "word": "necessity",
        "definition": "n. 需要；必然性；必需品"
    },
    {
        "word": "necessitate",
        "definition": "vt. 使成为必需，需要；迫使"
    },
    {
        "word": "neck",
        "definition": "n. 脖子；衣领；海峡 vi. 搂著脖子亲吻；变狭窄 vt. 使变细；与…搂著脖子亲吻"
    },
    {
        "word": "necklace",
        "definition": "n. 项链"
    },
    {
        "word": "need",
        "definition": "n. 需要，要求；缺乏；必要之物 vt. 需要 vi. 需要"
    },
    {
        "word": "needy",
        "definition": "adj. 贫困的；贫穷的；生活艰苦的"
    },
    {
        "word": "needle",
        "definition": "n. 针；指针；刺激；针状物 vi. 缝纫；做针线 vt. 刺激；用针缝"
    },
    {
        "word": "negate",
        "definition": "vt. 否定；取消；使无效 vi. 否定；否认；无效 n. 对立面；反面"
    },
    {
        "word": "negation",
        "definition": "n. 否定，否认；拒绝"
    },
    {
        "word": "negative",
        "definition": "adj.  负的；消极的；否定的；阴性的 n. 否定；负数； 底片 vt. 否定；拒绝"
    },
    {
        "word": "neglect",
        "definition": "vt. 疏忽，忽视；忽略 n. 疏忽，忽视；怠慢"
    },
    {
        "word": "neglectful",
        "definition": "adj. 疏忽的；忽略的；不小心的"
    },
    {
        "word": "negotiate",
        "definition": "vt. 谈判，商议；转让；越过 vi. 谈判，交涉"
    },
    {
        "word": "negotiation",
        "definition": "n. 谈判；转让；顺利的通过"
    },
    {
        "word": "negotiable",
        "definition": "adj. 可通过谈判解决的；可协商的"
    },
    {
        "word": "neighbor",
        "definition": "n. 邻居 adj. 邻近的 vi. 友好；毗邻而居 vt. 邻接"
    },
    {
        "word": "neighbour",
        "definition": "n. n. 邻居;同胞；仁慈的人 vt. 邻接 vi. 住在邻近；毗邻；友善，和睦 adj. 邻居的；邻近的"
    },
    {
        "word": "neighborhood",
        "definition": "n. 附近；街坊；接近；街区"
    },
    {
        "word": "neighbourhood",
        "definition": "n. 邻近；周围；邻居关系；附近一带"
    },
    {
        "word": "neither",
        "definition": "conj. 也不；既不 adv. 两个都不；既不……也不 adj. 两者都不的 pron. 两者都不"
    },
    {
        "word": "nephew",
        "definition": "n. 侄子；外甥"
    },
    {
        "word": "nerve",
        "definition": "n. 神经；勇气； 叶脉 vt. 鼓起勇气"
    },
    {
        "word": "nervous",
        "definition": "adj. 神经的；紧张不安的；强健有力的"
    },
    {
        "word": "nest",
        "definition": "n. 巢，窝；安乐窝；温床 vt. 筑巢；嵌套 vi. 筑巢；找鸟巢"
    },
    {
        "word": "net",
        "definition": "n. 网；网络；净利；实价 vi. 编网 vt. 得到；净赚；用网捕 adj. 纯粹的；净余的"
    },
    {
        "word": "network",
        "definition": "n. 网络；广播网；网状物"
    },
    {
        "word": "networking",
        "definition": "n. 计算机网络的设计；一种互助性的网络体系 v. 交流（network的ing形式）；联络"
    },
    {
        "word": "neutral",
        "definition": "adj. 中立的，中性的；中立国的；非彩色的 n. 中立国；中立者；非彩色；齿轮的空档"
    },
    {
        "word": "neutrality",
        "definition": "n. 中立；中性；中立立场"
    },
    {
        "word": "neutralize",
        "definition": "vt. 抵销；使…中和；使…无效；使…中立 vi. 中和；中立化；变无效"
    },
    {
        "word": "neutralise",
        "definition": "vt. 中和；使中立；使无效 vi. 中和"
    },
    {
        "word": "never",
        "definition": "adv. 从未；决不"
    },
    {
        "word": "nevertheless",
        "definition": "adv. 然而，不过；虽然如此 conj. 然而，不过"
    },
    {
        "word": "new",
        "definition": "adj. 新的，新鲜的；更新的；初见的 adv. 新近"
    },
    {
        "word": "news",
        "definition": "n. 新闻，消息；新闻报导"
    },
    {
        "word": "newspaper",
        "definition": "n. 报纸 报社 旧报纸"
    },
    {
        "word": "next",
        "definition": "adv. 然后；下次；其次 adj. 下一个的；其次的；贴近的 n. 下一个 prep. 靠近；居于…之后"
    },
    {
        "word": "nice",
        "definition": "adj. 精密的；美好的；细微的；和蔼的"
    },
    {
        "word": "nicety",
        "definition": "n. 精密；美好；细节；拘泥细节"
    },
    {
        "word": "nickel",
        "definition": "n. 镍；镍币；五分镍币 vt. 镀镍于"
    },
    {
        "word": "niece",
        "definition": "n. 外甥女，侄女"
    },
    {
        "word": "night",
        "definition": "n. 夜晚，晚上；黑暗，黑夜 adj. 夜晚的，夜间的"
    },
    {
        "word": "nightly",
        "definition": "adj. 夜间的；每夜的 adv. 每夜"
    },
    {
        "word": "nightmare",
        "definition": "n. 恶梦；梦魇般的经历 adj. 可怕的；噩梦似的"
    },
    {
        "word": "nine",
        "definition": "n. 九，九个 num. 九；九个 adj. 九的，九个的"
    },
    {
        "word": "nineteen",
        "definition": "num. 十九"
    },
    {
        "word": "ninety",
        "definition": "n. 九十 adj. 九十的；九十岁的 num. 九十"
    },
    {
        "word": "ninth",
        "definition": "num. 第九 adj. 第九的；九分之一的 n. 九分之一"
    },
    {
        "word": "no",
        "definition": "adv. 不 adj. 没有；不是 n. 不；否决票 abbr. 数字（number）；元素锘（nobelium）的符号"
    },
    {
        "word": "noble",
        "definition": "adj. 高尚的；贵族的；惰性的；宏伟的 n. 贵族 vt. 抓住；逮捕"
    },
    {
        "word": "nobility",
        "definition": "n. 贵族；高贵；高尚"
    },
    {
        "word": "nobody",
        "definition": "pron. 无人，没有人；没有任何人 n. 无名小卒；小人物"
    },
    {
        "word": "nod",
        "definition": "n. 点头；打盹；摆动 vt. 点头；点头表示 vi. 点头；打盹；摆动"
    },
    {
        "word": "noise",
        "definition": "n.  噪音；响声；杂音 vt. 谣传 vi. 发出声音；大声议论"
    },
    {
        "word": "noisy",
        "definition": "adj. .嘈杂的；喧闹的；聒噪的"
    },
    {
        "word": "none",
        "definition": "pron. 没有人；一个也没有；没有任何东西 adj. 没有的，一点没有的 adv. 决不，一点也不"
    },
    {
        "word": "nonsense",
        "definition": "n. 胡说；废话 adj. 荒谬的 int. 胡说！"
    },
    {
        "word": "noodle",
        "definition": "n. 面条；笨蛋"
    },
    {
        "word": "noon",
        "definition": "n. 中午；正午；全盛期"
    },
    {
        "word": "nor",
        "definition": "conj. 也不；也不是 adv. 也不；也没有"
    },
    {
        "word": "norm",
        "definition": "n. 标准，规范"
    },
    {
        "word": "normal",
        "definition": "adj. 正常的；正规的，标准的 n. 正常；标准；常态"
    },
    {
        "word": "normally",
        "definition": "adv. 正常地；通常地，一般地"
    },
    {
        "word": "normalize",
        "definition": "vt. 使正常化；使规格化，使标准化"
    },
    {
        "word": "normalise",
        "definition": "vt. （使）正常化; （使）恢复友好状态"
    },
    {
        "word": "normalization",
        "definition": "n. 正常化；标准化；正规化；常态化"
    },
    {
        "word": "normalisation",
        "definition": "n. normalise的变形"
    },
    {
        "word": "north",
        "definition": ""
    },
    {
        "word": "northern",
        "definition": "adj. 北部的；北方的 n. 北部方言"
    },
    {
        "word": "northeast",
        "definition": "adj. 东北的；向东北的；来自东北的 n. 东北 adv. 向东北；来自东北"
    },
    {
        "word": "northeastern",
        "definition": "adj. 在东北的；东北方的；来自东北的"
    },
    {
        "word": "northwest",
        "definition": "adj. 西北的；向西北的；来自西北的 n. 西北 adv. 在西北；向西北；来自西北"
    },
    {
        "word": "northwestern",
        "definition": "adj. 来自西北的；西北方的；在西北部的"
    },
    {
        "word": "nose",
        "definition": "n. 鼻子；嗅觉；突出的部分；探问 vt. 嗅；用鼻子触 vi. 小心探索着前进；探问"
    },
    {
        "word": "nosy",
        "definition": "adj. 好管闲事的；爱追问的；大鼻子的"
    },
    {
        "word": "not",
        "definition": "adv. 表示否定，不 n. “非”（计算机中逻辑运算的一种）"
    },
    {
        "word": "note",
        "definition": "n. 笔记；音符；票据；注解；纸币；便笺；照会；调子 vt. 注意；记录；注解"
    },
    {
        "word": "notation",
        "definition": "n. 符号；乐谱；注释；记号法"
    },
    {
        "word": "notable",
        "definition": "adj. 值得注意的，显著的；著名的 n. 名人，显要人物"
    },
    {
        "word": "notebook",
        "definition": "n. 笔记本，笔记簿；手册"
    },
    {
        "word": "nothing",
        "definition": "neg. 没什么；毫不 n. 无；零；不关紧要之事 adv. 毫不；决不 pron. 无事；无物 int. 什么也没有"
    },
    {
        "word": "notice",
        "definition": "n. 通知，布告；注意；公告 vt. 通知；注意到；留心 vi. 引起注意"
    },
    {
        "word": "noticeable",
        "definition": "adj. 显而易见的，显著的；值得注意的"
    },
    {
        "word": "notify",
        "definition": "vt. 通告，通知；公布"
    },
    {
        "word": "notification",
        "definition": "n. 通知；通告； 告示"
    },
    {
        "word": "notion",
        "definition": "n. 概念；见解；打算"
    },
    {
        "word": "notional",
        "definition": "adj. 概念性的；想像的；抽象的；不切实际的"
    },
    {
        "word": "noun",
        "definition": "n. 名词"
    },
    {
        "word": "nourish",
        "definition": "vt. 滋养；怀有；使健壮"
    },
    {
        "word": "nourishment",
        "definition": "n. 食物；营养品；滋养品"
    },
    {
        "word": "novel",
        "definition": "adj. 新奇的；异常的 n. 小说"
    },
    {
        "word": "novelist",
        "definition": "n. 小说家"
    },
    {
        "word": "novelty",
        "definition": "n. 新奇；新奇的事物；新颖小巧而廉价的物品"
    },
    {
        "word": "November",
        "definition": "n. 十一月"
    },
    {
        "word": "now",
        "definition": "adv. 现在；如今；立刻 adj. 现在的 n. 现在；目前 conj. 由于；既然"
    },
    {
        "word": "nowadays",
        "definition": "adv. 现今；时下 n. 当今"
    },
    {
        "word": "nowhere",
        "definition": "adv. 无处；任何地方都不；毫无结果 n. 无处；任何地方；无名之地 adj. 不存在的；毫无结果的；不知名的"
    },
    {
        "word": "nuclear",
        "definition": "adj. 原子能的； 细胞核的；中心的；原子核的"
    },
    {
        "word": "nucleus",
        "definition": "n. 核，核心；原子核"
    },
    {
        "word": "nude",
        "definition": "adj. 裸的，裸体的；无装饰的；与生俱有的 n. 裸体；裸体画"
    },
    {
        "word": "nudity",
        "definition": "n. 裸露；裸体像"
    },
    {
        "word": "nuisance",
        "definition": "n. 讨厌的人；损害；麻烦事；讨厌的东西"
    },
    {
        "word": "number",
        "definition": "n. 数；（杂志等的）期；号码；数字；算术 vi. 计入；总数达到 vt. 编号；计入；数…的数目；使为数有限"
    },
    {
        "word": "numerous",
        "definition": "adj. 许多的，很多的"
    },
    {
        "word": "nurse",
        "definition": "vt. 看护，护理；照顾；培养；给…喂奶 vi. 照料，护理；喂奶；当保姆 n. 护士；奶妈，保姆"
    },
    {
        "word": "nursery",
        "definition": "n. 苗圃；托儿所；温床"
    },
    {
        "word": "nut",
        "definition": "n. 螺母，螺帽；坚果；难对付的人，难解的问题 vi. 采坚果"
    },
    {
        "word": "nutrition",
        "definition": "n. 营养，营养学；营养品"
    },
    {
        "word": "nutrient",
        "definition": "n. 营养物；滋养物 adj. 营养的；滋养的"
    },
    {
        "word": "obese",
        "definition": "adj. 肥胖的，过胖的"
    },
    {
        "word": "obesity",
        "definition": "n. 肥大，肥胖"
    },
    {
        "word": "obey",
        "definition": "vt. 服从，听从；按照……行动 vi. 服从，顺从；听话"
    },
    {
        "word": "obedient",
        "definition": "adj. 顺从的，服从的；孝顺的"
    },
    {
        "word": "obedience",
        "definition": "n. 顺从；服从；遵守"
    },
    {
        "word": "object",
        "definition": "n. 目标；物体；客体；宾语 vt. 提出…作为反对的理由 vi. 反对；拒绝"
    },
    {
        "word": "objection",
        "definition": "n. 异议，反对；缺陷，缺点；妨碍；拒绝的理由"
    },
    {
        "word": "objective",
        "definition": "adj. 客观的；目标的；宾格的 n. 目的；目标； 物镜；宾格"
    },
    {
        "word": "oblige",
        "definition": "vt. 迫使；强制；赐，施恩惠；责成；义务 vi. 帮忙；施恩惠"
    },
    {
        "word": "obligation",
        "definition": "n. 义务；职责；债务"
    },
    {
        "word": "obliged",
        "definition": "adj. 必须的；感激的；有责任的 v. 要求；约束；施恩惠（oblige的过去分词）"
    },
    {
        "word": "obligatory",
        "definition": "adj. 义务的；必须的；义不容辞的"
    },
    {
        "word": "observe",
        "definition": "vt. 庆祝 vt. 观察；遵守；说；注意到；评论 vi. 观察；说；注意到；评论"
    },
    {
        "word": "observation",
        "definition": "n. 观察；监视；观察报告"
    },
    {
        "word": "observer",
        "definition": "n. 观察者； 观测者；遵守者"
    },
    {
        "word": "observant",
        "definition": "adj. 善于观察的；机警的；严格遵守的"
    },
    {
        "word": "obstacle",
        "definition": "n. 障碍，干扰；妨害物"
    },
    {
        "word": "obtain",
        "definition": "vi. 获得；流行 vt. 获得"
    },
    {
        "word": "obtainment",
        "definition": "n. 取得"
    },
    {
        "word": "obvious",
        "definition": "adj. 明显的；显著的；平淡无奇的"
    },
    {
        "word": "obviously",
        "definition": "adv. 明显地 显然地"
    },
    {
        "word": "occasion",
        "definition": "n. 时机，机会；场合；理由 vt. 引起，惹起"
    },
    {
        "word": "occasional",
        "definition": "adj. 偶然的；临时的；特殊场合的"
    },
    {
        "word": "occasionally",
        "definition": "adv. 偶尔；间或"
    },
    {
        "word": "occupation",
        "definition": "n. 职业；占有；消遣；占有期"
    },
    {
        "word": "occupational",
        "definition": "adj. 职业的；占领的"
    },
    {
        "word": "occupy",
        "definition": "vt. 占据，占领；居住；使忙碌"
    },
    {
        "word": "occupancy",
        "definition": "n. 居住；占有；占用"
    },
    {
        "word": "occupant",
        "definition": "n. 居住者；占有者"
    },
    {
        "word": "occur",
        "definition": "vi. 发生；出现；存在"
    },
    {
        "word": "occurrence",
        "definition": "n. 发生；出现；事件；发现"
    },
    {
        "word": "ocean",
        "definition": "n. 海洋；大量；广阔"
    },
    {
        "word": "oceanic",
        "definition": "adj. 海洋的；海洋产出的；在海洋中生活的；广阔无垠的"
    },
    {
        "word": "o'clock",
        "definition": "abbr. …点钟（等于of the clock）"
    },
    {
        "word": "October",
        "definition": "n.  十月"
    },
    {
        "word": "odd",
        "definition": "adj. 奇数的；古怪的；剩余的；临时的；零散的 n. 奇数；怪人；奇特的事物"
    },
    {
        "word": "oddity",
        "definition": "n. 奇异；古怪；怪癖"
    },
    {
        "word": "odds",
        "definition": "n. 几率；胜算；不平等；差别"
    },
    {
        "word": "odor",
        "definition": "n. 气味；名声"
    },
    {
        "word": "odour",
        "definition": "n. 气味；声誉"
    },
    {
        "word": "odorous",
        "definition": "adj. 香的；有气味的；难闻的"
    },
    {
        "word": "of",
        "definition": "prep. 关于；属于；…的；由…组成的"
    },
    {
        "word": "off",
        "definition": "prep. 离开；脱落 adv. 切断；走开 adj. 远离的；空闲的"
    },
    {
        "word": "offend",
        "definition": "vt. 冒犯；使…不愉快 vi. 违反；进攻；引起不舒服"
    },
    {
        "word": "offense",
        "definition": "n. 犯罪，过错；进攻；触怒；引起反感的事物"
    },
    {
        "word": "offence",
        "definition": "n. 犯罪；违反；过错；攻击"
    },
    {
        "word": "offensive",
        "definition": "adj. 攻击的；冒犯的；无礼的；讨厌的 n. 攻势；攻击"
    },
    {
        "word": "offender",
        "definition": "n. 罪犯；冒犯者；违法者"
    },
    {
        "word": "offer",
        "definition": "vt. 提供；出价；试图 n. 提议；出价；意图；录取通知书 vi. 提议；出现；献祭；求婚"
    },
    {
        "word": "offering",
        "definition": "n. 提供；祭品；奉献物；牲礼 v. 提供（offer的ing形式）"
    },
    {
        "word": "office",
        "definition": "n. 办公室；政府机关；官职；营业处"
    },
    {
        "word": "officer",
        "definition": "n. 军官，警官；公务员，政府官员；船长 vt. 指挥"
    },
    {
        "word": "official",
        "definition": "adj. 官方的；正式的；公务的 n. 官员；公务员；高级职员"
    },
    {
        "word": "often",
        "definition": "adv. 常常，时常"
    },
    {
        "word": "oftentimes",
        "definition": "adv. 时常地"
    },
    {
        "word": "oil",
        "definition": "n. 油；石油；油画颜料 vt. 加油；涂油；使融化 vi. 融化；加燃油"
    },
    {
        "word": "oily",
        "definition": "adj. 油的；油质的；油滑的；油腔滑调的"
    },
    {
        "word": "okay",
        "definition": "adv. 可以；对；很好地 adj. 可以；对；不错 n. 同意，批准 int. 好；行"
    },
    {
        "word": "old",
        "definition": "adj. 陈旧的，古老的；年老的 n. 古时"
    },
    {
        "word": "old-fashioned",
        "definition": "adj. 老式的；过时的；守旧的"
    },
    {
        "word": "Olympic",
        "definition": "adj. 奥林匹斯山的，奥林匹亚的；奥林匹克的"
    },
    {
        "word": "Olympics",
        "definition": ""
    },
    {
        "word": "Olympiad",
        "definition": ""
    },
    {
        "word": "omit",
        "definition": "vt. 省略；遗漏；删除；疏忽"
    },
    {
        "word": "omission",
        "definition": "n. 疏忽，遗漏；省略；冗长"
    },
    {
        "word": "on",
        "definition": "adv. 向前地；作用中，行动中；继续着 prep. 向，朝……；关于；在……之上；在……时候 adj. 开着的；发生着的，正在进行中"
    },
    {
        "word": "once",
        "definition": "adv. 一次；曾经 conj. 一旦 n. 一次，一回"
    },
    {
        "word": "one",
        "definition": "pron. 一个人；任何人 adj. 一的；唯一的 n. 一 num. 一；一个"
    },
    {
        "word": "oneself",
        "definition": "pron. 自己；亲自"
    },
    {
        "word": "ongoing",
        "definition": "adj. 不间断的，进行的；前进的 n. 前进；行为，举止"
    },
    {
        "word": "onion",
        "definition": "n. 洋葱；洋葱头"
    },
    {
        "word": "online",
        "definition": "adj. 联机的；在线的 adv. 在线地"
    },
    {
        "word": "only",
        "definition": "adv. 只，仅仅；不料 adj. 唯一的，仅有的；最合适的 conj. 但是；不过；可是"
    },
    {
        "word": "onto",
        "definition": "prep. 在…之上；对…了解；映射到…上 adj. 映射的；自身的；映成的"
    },
    {
        "word": "onward",
        "definition": "adj. 向前的；前进的 adv. 向前；在前面"
    },
    {
        "word": "open",
        "definition": "adj. 公开的；敞开的；空旷的；坦率的；营业着的 vi. 开始；展现 vt. 公开；打开 n. 公开；空旷；户外"
    },
    {
        "word": "opener",
        "definition": "n.  开启工具；开启的人"
    },
    {
        "word": "opening",
        "definition": "n. 开始；机会；通路；空缺的职位 adj. 开始的 v. 开放（open的ing形式）；打开；公开"
    },
    {
        "word": "openly",
        "definition": "adv. 公开地；公然地；坦率地"
    },
    {
        "word": "opera",
        "definition": "n. 歌剧；歌剧院；歌剧团"
    },
    {
        "word": "operate",
        "definition": "vi. 运转；动手术；起作用 vt. 操作；经营；引起；对…开刀"
    },
    {
        "word": "operation",
        "definition": "n. 操作；经营； 手术； 运算"
    },
    {
        "word": "operational",
        "definition": "adj. 操作的；运作的"
    },
    {
        "word": "operator",
        "definition": "n. 经营者；操作员；话务员；行家"
    },
    {
        "word": "opinion",
        "definition": "n. 意见；主张"
    },
    {
        "word": "opportunity",
        "definition": "n. 时机，机会"
    },
    {
        "word": "oppose",
        "definition": "vt. 反对；对抗，抗争 vi. 反对"
    },
    {
        "word": "opposition",
        "definition": "n. 反对；反对派；在野党；敌对"
    },
    {
        "word": "opponent",
        "definition": "n. 对手；反对者；敌手 adj. 对立的；敌对的"
    },
    {
        "word": "opposite",
        "definition": "adj. 相反的；对面的；对立的 n. 对立面；反义词 prep. 在…的对面 adv. 在对面"
    },
    {
        "word": "opt",
        "definition": "vi. 选择"
    },
    {
        "word": "option",
        "definition": "n.  选项；选择权；买卖的特权"
    },
    {
        "word": "optional",
        "definition": "adj. 可选择的，随意的 n. 选修科目"
    },
    {
        "word": "optimism",
        "definition": "n. 乐观；乐观主义"
    },
    {
        "word": "optimistic",
        "definition": "adj. 乐观的；乐观主义的"
    },
    {
        "word": "optimist",
        "definition": "n. 乐观主义者；乐天派"
    },
    {
        "word": "or",
        "definition": "conj. 或，或者；还是"
    },
    {
        "word": "oral",
        "definition": "n. 口试 adj. 口头的，口述的"
    },
    {
        "word": "orange",
        "definition": "adj. 橙色的；橘色的 n. 橙；橙色；桔子"
    },
    {
        "word": "orbit",
        "definition": "n. 轨道；眼眶；势力范围；生活常规 vi. 盘旋；绕轨道运行 vt. 绕…轨道而行"
    },
    {
        "word": "orbital",
        "definition": "adj. 轨道的；眼窝的"
    },
    {
        "word": "orchestra",
        "definition": "n. 管弦乐队；乐队演奏处"
    },
    {
        "word": "order",
        "definition": "n. 命令；顺序；规则； 定单 vt. 命令；整理；定购 vi. 命令；定货"
    },
    {
        "word": "orderly",
        "definition": "adj. 有秩序的；整齐的；值班的 n. 勤务兵；传令兵；护理员 adv. 顺序地；依次地"
    },
    {
        "word": "ordinary",
        "definition": "adj. 普通的；平凡的；平常的 n. 普通；平常的人（或事）"
    },
    {
        "word": "ore",
        "definition": "n. 矿；矿石"
    },
    {
        "word": "organ",
        "definition": "n.  器官；机构；风琴；管风琴；嗓音"
    },
    {
        "word": "organic",
        "definition": "adj.  有机的；组织的；器官的；根本的"
    },
    {
        "word": "organism",
        "definition": "n. 有机体；生物体；微生物"
    },
    {
        "word": "organize",
        "definition": "vt. 组织；使有系统化；给予生机；组织成立工会等 vi. 组织起来；成立组织"
    },
    {
        "word": "organise",
        "definition": "vi. 组织起来；组织工会 vt. 组织（等于organize）；有机化；给予生机"
    },
    {
        "word": "organization",
        "definition": "n. 组织；机构；体制；团体"
    },
    {
        "word": "organisation",
        "definition": "n. 组织；团体（等于organization）"
    },
    {
        "word": "organizational",
        "definition": "adj. 组织的；编制的"
    },
    {
        "word": "organisational",
        "definition": "组织的"
    },
    {
        "word": "orient",
        "definition": "vt. 使适应；确定方向；使朝东 n. 东方；东方诸国 adj. 东方的 vi. 向东"
    },
    {
        "word": "orientation",
        "definition": "n. 方向；定向；适应；情况介绍；向东方"
    },
    {
        "word": "oriental",
        "definition": "adj. 东方的；东方人的 n. 东方人"
    },
    {
        "word": "origin",
        "definition": "n. 起源；原点；出身；开端"
    },
    {
        "word": "original",
        "definition": "n. 原件；原作；原物；原型 adj. 原始的；最初的；独创的；新颖的"
    },
    {
        "word": "originality",
        "definition": "n. 创意；独创性，创造力；原始；新奇"
    },
    {
        "word": "originate",
        "definition": "vt. 引起；创作 vi. 发源；发生；起航"
    },
    {
        "word": "ornament",
        "definition": "n. 装饰； 装饰物；教堂用品 vt. 装饰，修饰"
    },
    {
        "word": "ornamental",
        "definition": "adj. 装饰的，装饰性的 n. 观赏植物；装饰品"
    },
    {
        "word": "orphan",
        "definition": "adj. 孤儿的；无双亲的 n. 孤儿 vt. 使成孤儿"
    },
    {
        "word": "orphanage",
        "definition": "n. 孤儿院；孤儿身份"
    },
    {
        "word": "other",
        "definition": "adj. 其他的，另外的 pron. 另外一个"
    },
    {
        "word": "otherwise",
        "definition": "adv. 否则；另外；在其他方面 adj. 另外的；其他方面的；原本，本来 conj. 其他；如果不；然后"
    },
    {
        "word": "ought to",
        "definition": "modalv. 应该；应当；（表示期望或可能发生的事）应该；（表示劝告或建议）应该 v. 应该  理应；应然；应该要"
    },
    {
        "word": "ounce",
        "definition": "n. 盎司；少量；雪豹"
    },
    {
        "word": "our",
        "definition": "pron. 我们的"
    },
    {
        "word": "ours",
        "definition": "pron. 我们的"
    },
    {
        "word": "ourselves",
        "definition": "pron. 我们自己；我们亲自"
    },
    {
        "word": "out",
        "definition": "adv. 出现；在外；出局；出声地；不流行地 adj. 外面的；出局的；下台的 n. 出局 prep. 向；离去 vi. 出来；暴露 vt. 使熄灭；驱逐"
    },
    {
        "word": "outbreak",
        "definition": "n. （战争的）爆发；（疾病的）发作 vi. 爆发"
    },
    {
        "word": "outcome",
        "definition": "n. 结果，结局；成果"
    },
    {
        "word": "outdated",
        "definition": "adj. 过时的；旧式的 v. 使过时（outdate的过去式和过去分词）"
    },
    {
        "word": "outdoor",
        "definition": "adj. 户外的；露天的；野外的（等于out-of-door）"
    },
    {
        "word": "outdoors",
        "definition": "adv. 在户外 n. 户外 adj. 户外的（等于outdoor）"
    },
    {
        "word": "outer",
        "definition": "adj. 外面的，外部的；远离中心的 n. 环外命中"
    },
    {
        "word": "outgoing",
        "definition": "adj. 对人友好的，开朗的；出发的，外出的；即将离职的；乐于助人的 n. 外出；流出；开支 v. 超过；优于（outgo的ing形式）"
    },
    {
        "word": "outing",
        "definition": "n. 远足；短途旅游；体育比赛 adj. 远足适用的 v. 出来；暴露（out的ing形式）"
    },
    {
        "word": "outlet",
        "definition": "n. 出口，排放孔； 电源插座；销路；发泄的方法；批发商店"
    },
    {
        "word": "outline",
        "definition": "n. 轮廓；大纲；概要；略图 vt. 概述；略述；描画…轮廓"
    },
    {
        "word": "outlook",
        "definition": "n. 展望；观点；景色 vt. 比……好看；用目光压倒 vi. 朝外看"
    },
    {
        "word": "output",
        "definition": "n. 输出，输出量；产量；出产 vt. 输出"
    },
    {
        "word": "outset",
        "definition": "n. 开始；开端"
    },
    {
        "word": "outside",
        "definition": "adj. 外面的，外部的；外来的 n. 外部；外观 adv. 在外面，向外面；在室外 prep. 在…范围之外"
    },
    {
        "word": "outsider",
        "definition": "n. 外人；无取胜希望者"
    },
    {
        "word": "outskirts",
        "definition": "n. 市郊，郊区"
    },
    {
        "word": "outstanding",
        "definition": "adj. 杰出的；显著的；未解决的；未偿付的 n. 未偿贷款"
    },
    {
        "word": "outward",
        "definition": "adj. 向外的；外面的；公开的；外服的；肉体的 adv. 向外（等于outwards）；在外；显而易见地 n. 外表；外面；物质世界"
    },
    {
        "word": "outwards",
        "definition": "adv. 向外地"
    },
    {
        "word": "oval",
        "definition": "adj. 椭圆的；卵形的 n. 椭圆形；卵形"
    },
    {
        "word": "oven",
        "definition": "n. 炉，灶；烤炉，烤箱"
    },
    {
        "word": "over",
        "definition": "adv. 结束；越过；从头到尾 prep. 越过；在…之上；遍于…之上 adj. 结束的；上面的 vt. 越过"
    },
    {
        "word": "overall",
        "definition": "adj. 全部的；全体的；一切在内的 adv. 全部地；总的说来 n. 工装裤；罩衫"
    },
    {
        "word": "overcoat",
        "definition": "n. 大衣，外套"
    },
    {
        "word": "overcome",
        "definition": "vt. 克服；胜过 vi. 克服；得胜"
    },
    {
        "word": "overdue",
        "definition": "adj. 过期的；迟到的；未兑的"
    },
    {
        "word": "overhead",
        "definition": "adv. 在头顶上；在空中；在高处 adj. 高架的；在头上的；在头顶上的 n. 天花板； 经常费用；间接费用；吊脚架空层"
    },
    {
        "word": "overhear",
        "definition": "vt. 无意中听到；偷听 vi. 无意中听到；偷听到"
    },
    {
        "word": "overlook",
        "definition": "vt. 忽略；俯瞰；远眺；检查；高耸于…之上 n. 忽视；眺望"
    },
    {
        "word": "overnight",
        "definition": "adv. 通宵；突然；昨晚 adj. 晚上的；通宵的；前夜的 n. 头天晚上；一夜的逗留 vt. 连夜快递 vi. 过一夜"
    },
    {
        "word": "overseas",
        "definition": "adv. 在海外，海外 adj. 海外的，国外的"
    },
    {
        "word": "oversee",
        "definition": "vt. 监督；审查；俯瞰；偷看到，无意中看到"
    },
    {
        "word": "oversight",
        "definition": "n. 监督，照管；疏忽"
    },
    {
        "word": "overtake",
        "definition": "vt. 赶上；压倒；突然来袭 vi. 超车"
    },
    {
        "word": "overthrow",
        "definition": "n. 推翻；倾覆；瓦解 vt. 推翻；打倒；倾覆"
    },
    {
        "word": "overtime",
        "definition": "n.  加班时间；延长时间；加时赛 adj. 超时的；加班的 vt. 使超过时间 adv. 加班地"
    },
    {
        "word": "overwhelm",
        "definition": "vt. 淹没；压倒；受打击；覆盖；压垮"
    },
    {
        "word": "overwhelming",
        "definition": "adj. 压倒性的；势不可挡的 v. 压倒；淹没（overwhelm的ing形式）；制服"
    },
    {
        "word": "overwhelmingly",
        "definition": "adv. 压倒性地；不可抵抗地"
    },
    {
        "word": "owe",
        "definition": "vt. 欠；感激；应给予；应该把……归功于 vi. 欠钱"
    },
    {
        "word": "owing to",
        "definition": "conj. 由于；因为 prep. 因为；由于  归因于；由于…的原因；多亏"
    },
    {
        "word": "own",
        "definition": "vt. 拥有；承认 vi. 承认 adj. 自己的；特有的 n. 自己的"
    },
    {
        "word": "owner",
        "definition": "n.  所有者；物主"
    },
    {
        "word": "ownership",
        "definition": "n. 所有权；物主身份"
    },
    {
        "word": "ox",
        "definition": "n. 牛；公牛"
    },
    {
        "word": "oxygen",
        "definition": "n.  氧气， 氧"
    },
    {
        "word": "ozone",
        "definition": "n.  臭氧；新鲜的空气"
    },
    {
        "word": "pace",
        "definition": "n. 一步；步速；步伐；速度 vi. 踱步；缓慢而行 vt. 踱步于；用步测"
    },
    {
        "word": "pack",
        "definition": "n. 包装；一群；背包；包裹；一副 vt. 包装；压紧；捆扎；挑选；塞满 vi. 挤；包装货物；被包装；群集"
    },
    {
        "word": "package",
        "definition": "n. 包，包裹；套装软件， 程序包 adj. 一揽子的 vt. 打包；将…包装"
    },
    {
        "word": "packet",
        "definition": "n. 数据包，信息包；小包，小捆 vt. 包装，打包"
    },
    {
        "word": "pad",
        "definition": "n. 衬垫；护具；便笺簿；填补 vi. 步行；放轻脚步走 vt. 填补；走"
    },
    {
        "word": "paddy",
        "definition": "n. 稻田（复数paddies）；爱尔兰人；Patrick（男子名）和Patricia（女子名）的昵称"
    },
    {
        "word": "page",
        "definition": "n. 页；记录；大事件，时期；男侍者 vt. 给…标页码 vi. 翻书页，浏览"
    },
    {
        "word": "pain",
        "definition": "n. 疼痛；努力 vt. 使…痛苦；使…烦恼 vi. 感到疼痛；引起疼痛"
    },
    {
        "word": "painful",
        "definition": "adj. 痛苦的；疼痛的；令人不快的"
    },
    {
        "word": "paint",
        "definition": "vt. 油漆；绘画；装饰；涂色于；描绘；（用语言，文字等）描写；擦脂粉等 vi. 油漆；描绘；绘画；化妆 n. 油漆；颜料，涂料；绘画作品；胭脂等化妆品；色彩，装饰"
    },
    {
        "word": "painting",
        "definition": "n. 绘画；油画；着色 v. 绘画（paint的ing形式）；涂色于"
    },
    {
        "word": "painter",
        "definition": "n. 画家；油漆匠"
    },
    {
        "word": "pair",
        "definition": "n. 一对，一双，一副 vt. 把…组成一对"
    },
    {
        "word": "palace",
        "definition": "n. 宫殿；宅邸；豪华住宅"
    },
    {
        "word": "pale",
        "definition": "n. 前哨；栅栏；范围 adj. 苍白的；无力的；暗淡的 vt. 使失色；使变苍白；用栅栏围 vi. 失色；变苍白；变得暗淡"
    },
    {
        "word": "palm",
        "definition": "n. 手掌；棕榈树；掌状物 vt. 将…藏于掌中"
    },
    {
        "word": "pan",
        "definition": "n. 平底锅；盘状的器皿；淘盘子，金盘，秤盘 vi. 淘金；在淘洗中收获金子 vt. 淘金；在浅锅中烹调（食物）；严厉的批评"
    },
    {
        "word": "panda",
        "definition": "n. 熊猫；猫熊"
    },
    {
        "word": "panel",
        "definition": "n. 仪表板；嵌板；座谈小组，全体陪审员 vt. 嵌镶板"
    },
    {
        "word": "panic",
        "definition": "n. 恐慌，惊慌；大恐慌 adj. 恐慌的；没有理由的 vt. 使恐慌 vi. 十分惊慌"
    },
    {
        "word": "pants",
        "definition": "n. 裤子"
    },
    {
        "word": "paper",
        "definition": "n. 纸；论文；文件；报纸 adj. 纸做的 vt. 用纸糊；用纸包装 vi. 贴糊墙纸；发交通违章传票"
    },
    {
        "word": "paperback",
        "definition": "n. 平装本；廉价本 adj. 纸面装订的；纸面平装本书籍的 vt. 以平装本出版"
    },
    {
        "word": "parade",
        "definition": "n. 游行；阅兵；炫耀；行进；阅兵场 vt. 游行；炫耀；列队行进 vi. 游行；炫耀；列队行进"
    },
    {
        "word": "paradox",
        "definition": "n. 悖论，反论；似非而是的论点；自相矛盾的人或事"
    },
    {
        "word": "paradoxical",
        "definition": "adj. 矛盾的；诡论的；似非而是的"
    },
    {
        "word": "paragraph",
        "definition": "n. 段落；短评；段落符号 vt. 将…分段"
    },
    {
        "word": "parallel",
        "definition": "n. 平行线；对比 adj. 平行的；类似的，相同的 vt. 使…与…平行"
    },
    {
        "word": "parcel",
        "definition": "n. 包裹，小包 vt. 打包；捆扎"
    },
    {
        "word": "pardon",
        "definition": "n. 原谅；赦免；宽恕 vt. 原谅；赦免；宽恕"
    },
    {
        "word": "parent",
        "definition": "n. 父亲（或母亲）；父母亲；根源"
    },
    {
        "word": "parental",
        "definition": "adj. 父母亲的，父母的；亲代的，亲本的"
    },
    {
        "word": "parenting",
        "definition": "n. 父母对子女的养育 v. 教养（parent的ing形式）；做…的父亲或母亲"
    },
    {
        "word": "park",
        "definition": "n. 公园； 停车场 vt. 停放；放置；寄存 vi. 停放车辆"
    },
    {
        "word": "parking",
        "definition": "n. 停车 adj. 停车的 v. 停车（park的ing形式）"
    },
    {
        "word": "parliament",
        "definition": "n. 议会，国会"
    },
    {
        "word": "parliamentary",
        "definition": "adj. 议会的；国会的；议会制度的"
    },
    {
        "word": "part",
        "definition": "n. 部分；角色；零件；一些；片段 adj. 部分的 vt. 分离；分配；分开 adv. 部分地 vi. 断裂；分手"
    },
    {
        "word": "partial",
        "definition": "adj. 局部的；偏爱的；不公平的"
    },
    {
        "word": "partially",
        "definition": "adv. 部分地；偏袒地"
    },
    {
        "word": "participate",
        "definition": "vi. 参与，参加；分享 vt. 分享；分担 "
    },
    {
        "word": "participation",
        "definition": "n. 参与；分享；参股"
    },
    {
        "word": "participant",
        "definition": "n. 参与者；关系者 adj. 参与的；有关系的"
    },
    {
        "word": "particle",
        "definition": "n. 颗粒； 质点；极小量；小品词"
    },
    {
        "word": "particular",
        "definition": "n. 详细说明；个别项目 adj. 特别的；详细的；独有的；挑剔的"
    },
    {
        "word": "particularly",
        "definition": "adv. 特别地，独特地；详细地，具体地；明确地，细致地"
    },
    {
        "word": "partly",
        "definition": "adv. 部分地；在一定程度上"
    },
    {
        "word": "partner",
        "definition": "n. 伙伴；合伙人；配偶 vt. 使合作；与…合伙 vi. 合伙；合股；成为搭档"
    },
    {
        "word": "partnership",
        "definition": "n. 合伙； 合伙企业；合作关系；合伙契约"
    },
    {
        "word": "party",
        "definition": "n. 政党，党派；聚会，派对；当事人  vi. 参加社交聚会 "
    },
    {
        "word": "pass",
        "definition": "n. 及格；经过；护照；途径；传球 vt. 通过；经过；传递 vi. 经过；传递；变化；终止"
    },
    {
        "word": "passage",
        "definition": "n. 一段（文章）；走廊；通路"
    },
    {
        "word": "passenger",
        "definition": "n. 旅客；乘客；过路人；碍手碍脚的人"
    },
    {
        "word": "passion",
        "definition": "n. 激情；热情；酷爱；盛怒"
    },
    {
        "word": "passionate",
        "definition": "adj. 热情的；热烈的，激昂的；易怒的"
    },
    {
        "word": "passive",
        "definition": "n. 被动语态 adj. 被动的，消极的；被动语态的"
    },
    {
        "word": "passport",
        "definition": "n. 护照，通行证；手段"
    },
    {
        "word": "password",
        "definition": "n. 密码；口令"
    },
    {
        "word": "past",
        "definition": "n. 过去；往事 prep. 越过；晚于 adj. 过去的；结束的 adv. 过；经过"
    },
    {
        "word": "paste",
        "definition": "n. 面团，膏；糊状物， 浆糊 vt. 张贴，裱糊；用浆糊粘"
    },
    {
        "word": "pastime",
        "definition": "n. 娱乐，消遣"
    },
    {
        "word": "pat",
        "definition": "n. 轻拍；小块；轻拍声 adj. 恰好的；熟练的；合适的 vt. 轻拍 adv. 恰好；熟记地 vi. 轻拍"
    },
    {
        "word": "patch",
        "definition": "n. 眼罩；斑点；碎片；小块土地 vi. 打补丁 vt. 修补；解决；掩饰"
    },
    {
        "word": "patent",
        "definition": "n. 专利权；执照；专利品 adj. 专利的；新奇的；显然的 vt. 授予专利；取得…的专利权"
    },
    {
        "word": "path",
        "definition": "n. 道路；小路；轨道"
    },
    {
        "word": "patient",
        "definition": "n. 病人；患者 adj. 有耐心的，能容忍的"
    },
    {
        "word": "patience",
        "definition": "n. 耐性，耐心；忍耐，容忍"
    },
    {
        "word": "pattern",
        "definition": "n. 模式；图案；样品 vt. 模仿；以图案装饰 vi. 形成图案"
    },
    {
        "word": "pause",
        "definition": "n. 暂停；间歇 vi. 暂停，停顿，中止；踌躇"
    },
    {
        "word": "pave",
        "definition": "vt. 铺设；安排；作铺设之用"
    },
    {
        "word": "pavement",
        "definition": "n. 人行道 路面"
    },
    {
        "word": "paw",
        "definition": "n. 爪子；手 vt. 抓，扒；亲昵地抚摸 vi. 用爪子抓；翻找"
    },
    {
        "word": "pay",
        "definition": "n. 工资，薪水；付款；报答 vt. 支付，付；偿还，补偿；给予 vi. 付款；偿还 adj. 收费的；需付费的"
    },
    {
        "word": "payment",
        "definition": "n. 付款，支付；报酬，报答；偿还；惩罚，报应"
    },
    {
        "word": "payroll",
        "definition": "n. 工资单；在册职工人数；工资名单"
    },
    {
        "word": "pea",
        "definition": "n. 豌豆"
    },
    {
        "word": "peace",
        "definition": "n. 和平；平静；和睦；秩序"
    },
    {
        "word": "peaceful",
        "definition": "adj. 和平的，爱好和平的；平静的"
    },
    {
        "word": "peach",
        "definition": "n. 桃子；桃树；桃红色；受人喜欢的人（或物） adj. 桃色的；用桃子制成的 vt. 告发 vi. 告密"
    },
    {
        "word": "peak",
        "definition": "n. 山峰；最高点；顶点；帽舌 adj. 最高的；最大值的 vt. 使达到最高点；使竖起 vi. 消瘦；到达最高点；变憔悴"
    },
    {
        "word": "peanut",
        "definition": "n. 花生"
    },
    {
        "word": "pear",
        "definition": "n.  梨树；梨子"
    },
    {
        "word": "pearl",
        "definition": "n. 珍珠；珍珠色；杰出者；珍品 adj. 镶珍珠的；珍珠状的 vt. 使成珠状；用珍珠装饰；使呈珍珠色 vi. 采珍珠；成珍珠状"
    },
    {
        "word": "peasant",
        "definition": "n. 农民；乡下人"
    },
    {
        "word": "peculiar",
        "definition": "n. 特权；特有财产 adj. 特殊的；独特的；奇怪的；罕见的"
    },
    {
        "word": "peculiarity",
        "definition": "n. 特性；特质；怪癖；奇特"
    },
    {
        "word": "pedestrian",
        "definition": "n. 行人；步行者 adj. 徒步的；缺乏想像力的"
    },
    {
        "word": "peer",
        "definition": "vt. 封为贵族；与…同等 vi. 凝视，盯着看；窥视 n. 贵族；同等的人；同龄人"
    },
    {
        "word": "pen",
        "definition": "n. 钢笔；作家；围栏 vt. 写；关入栏中"
    },
    {
        "word": "penalty",
        "definition": "n. 罚款，罚金；处罚"
    },
    {
        "word": "penalize",
        "definition": "vt. 处罚；处刑；使不利"
    },
    {
        "word": "penalise",
        "definition": "vt. 对…予以惩罚; 使处于不利地位"
    },
    {
        "word": "pencil",
        "definition": "n. 铅笔；笔状物 vt. 用铅笔写；用眉笔涂 vi. 成铅笔状"
    },
    {
        "word": "penetrate",
        "definition": "vi. 渗透；刺入；看透 vt. 渗透；穿透；洞察"
    },
    {
        "word": "penetration",
        "definition": "n. 渗透；突破；侵入；洞察力"
    },
    {
        "word": "penny",
        "definition": "n. （美）分；便士"
    },
    {
        "word": "pension",
        "definition": "n. 退休金，抚恤金；津贴；膳宿费 vt. 发给养老金或抚恤金"
    },
    {
        "word": "pensioner",
        "definition": "n. 领养老金者；领取抚恤金者"
    },
    {
        "word": "people",
        "definition": "n. 人；人类；民族；公民 vt. 居住于；使住满人"
    },
    {
        "word": "pepper",
        "definition": "n. 胡椒；辣椒；胡椒粉 vt. 加胡椒粉于；使布满"
    },
    {
        "word": "per",
        "definition": "prep. 每；经；按照；每一"
    },
    {
        "word": "perceive",
        "definition": "vt. 察觉，感觉；理解；认知 vi. 感到，感知；认识到"
    },
    {
        "word": "perception",
        "definition": "n. 知觉； 感觉；看法；洞察力；获取"
    },
    {
        "word": "perceptive",
        "definition": "adj. 感知的，知觉的；有知觉力的"
    },
    {
        "word": "percent",
        "definition": "n. 百分比，百分率；部分；百分数 adj. 百分之…的 adv. 以百分之…地"
    },
    {
        "word": "percentage",
        "definition": "n. 百分比；百分率，百分数"
    },
    {
        "word": "perfect",
        "definition": "n. 完成式 adj. 完美的；最好的；精通的 vt. 使完美；使熟练"
    },
    {
        "word": "perfection",
        "definition": "n. 完善；完美"
    },
    {
        "word": "perform",
        "definition": "vt. 执行；完成；演奏 vi. 执行，机器运转；表演"
    },
    {
        "word": "performance",
        "definition": "n. 性能；绩效；表演；执行；表现"
    },
    {
        "word": "performer",
        "definition": "n. 演出者；执行者；演奏者"
    },
    {
        "word": "perhaps",
        "definition": "n. 假定；猜想；未定之事 adv. 或许；（表示不确定）也许；（用于粗略的估计）或许；（表示勉强同意或其实不赞成）也许；可能"
    },
    {
        "word": "peril",
        "definition": "n. 危险；冒险 vt. 危及；置…于险境"
    },
    {
        "word": "perilous",
        "definition": "adj. 危险的，冒险的"
    },
    {
        "word": "period",
        "definition": "n. 周期，期间；时期；月经；课时；（语法学）句点，句号 adj. 某一时代的"
    },
    {
        "word": "periodic",
        "definition": "adj. 周期的；定期的"
    },
    {
        "word": "periodical",
        "definition": "n. 期刊；杂志 adj.  周期的；定期的"
    },
    {
        "word": "permanent",
        "definition": "n. 烫发（等于permanent wave） adj. 永久的，永恒的；不变的"
    },
    {
        "word": "permanence",
        "definition": "n. 持久；永久"
    },
    {
        "word": "permit",
        "definition": "n. 许可证，执照 vt. 许可；允许 vi. 许可；允许"
    },
    {
        "word": "permission",
        "definition": "n. 允许，许可"
    },
    {
        "word": "permissible",
        "definition": "adj. 可允许的；获得准许的"
    },
    {
        "word": "permissive",
        "definition": "adj. 许可的；自由的；宽容的；（两性关系）放纵的"
    },
    {
        "word": "persevere",
        "definition": "vi. 坚持；不屈不挠；固执己见（在辩论中）"
    },
    {
        "word": "perseverance",
        "definition": "n. 坚持不懈；不屈不挠 n. 耐性；毅力"
    },
    {
        "word": "persist",
        "definition": "vi. 存留，坚持；持续，固执 vt. 坚持说，反复说"
    },
    {
        "word": "persistent",
        "definition": "adj. 固执的，坚持的；持久稳固的"
    },
    {
        "word": "persistence",
        "definition": "n. 持续；固执；存留；坚持不懈；毅力"
    },
    {
        "word": "person",
        "definition": "n. 人；身体；容貌，外表；人称"
    },
    {
        "word": "personal",
        "definition": "n. 人事消息栏；人称代名词 adj. 个人的；身体的；亲自的"
    },
    {
        "word": "personally",
        "definition": "adv. 亲自地；当面；个别地；就自己而言"
    },
    {
        "word": "personality",
        "definition": "n. 个性；品格；名人"
    },
    {
        "word": "personnel",
        "definition": "n. 人事部门；全体人员 adj. 人员的；有关人事的"
    },
    {
        "word": "perspective",
        "definition": "n. 观点；远景；透视图 adj. 透视的"
    },
    {
        "word": "persuade",
        "definition": "vt. 说服，劝说；使某人相信；劝某人做（不做）某事 adj. 空闲的，有闲的 vi. 说服；被说服"
    },
    {
        "word": "persuasion",
        "definition": "n. 说服；说服力；信念；派别"
    },
    {
        "word": "persuasive",
        "definition": "adj. 有说服力的；劝诱的，劝说的"
    },
    {
        "word": "pessimism",
        "definition": "n. 悲观，悲观情绪；厌世主义"
    },
    {
        "word": "pessimistic",
        "definition": "adj. 悲观的，厌世的；悲观主义的"
    },
    {
        "word": "pessimist",
        "definition": "n. 悲观主义者"
    },
    {
        "word": "pet",
        "definition": "n. 宠物；生气；受宠爱的人 adj. 宠爱的 vt. 宠爱 vi. 生气；爱抚"
    },
    {
        "word": "petroleum",
        "definition": "n. 石油"
    },
    {
        "word": "petty",
        "definition": "adj. 琐碎的；小气的；小规模的"
    },
    {
        "word": "phase",
        "definition": "n. 月相 n. （月亮的）盈亏 n. 时期"
    },
    {
        "word": "phenomenon",
        "definition": "n. 现象；奇迹；杰出的人才"
    },
    {
        "word": "philosophy",
        "definition": "n. 哲学；哲理；人生观"
    },
    {
        "word": "philosophical",
        "definition": "adj. 哲学的（等于philosophic）；冷静的"
    },
    {
        "word": "philosopher",
        "definition": "n. 哲学家；哲人"
    },
    {
        "word": "photo",
        "definition": "n. 照片"
    },
    {
        "word": "photograph",
        "definition": "n. 照片，相片 vt. 为…拍照；使深深印入 vi. 拍照；在照片上显得"
    },
    {
        "word": "photographic",
        "definition": "adj. 摄影的；逼真的；（尤指记忆）详细准确的"
    },
    {
        "word": "photographer",
        "definition": "n. 摄影师；照相师"
    },
    {
        "word": "photography",
        "definition": "n. 摄影；摄影术"
    },
    {
        "word": "phrase",
        "definition": "n. 短语, 习语, 措辞, 乐句 vt. 措词, 将(乐曲)分成乐句"
    },
    {
        "word": "phrasal",
        "definition": "adj. 短语的；习惯用语的，成语的"
    },
    {
        "word": "physical",
        "definition": "n. 体格检查 adj.  物理的；身体的；物质的；根据自然规律的，符合自然法则的"
    },
    {
        "word": "physician",
        "definition": "n.  医师；内科医师"
    },
    {
        "word": "physics",
        "definition": "n. 物理学；物理现象"
    },
    {
        "word": "physicist",
        "definition": "n. 物理学家；唯物论者"
    },
    {
        "word": "piano",
        "definition": "n. 钢琴"
    },
    {
        "word": "pianist",
        "definition": "n. 钢琴家；钢琴演奏者"
    },
    {
        "word": "pick",
        "definition": "n. 选择；鹤嘴锄；挖；掩护 vi. 挑选；采摘；挖 vt. 拾取；精选；采摘；掘"
    },
    {
        "word": "picky",
        "definition": "adj. 挑剔的；吹毛求疵的"
    },
    {
        "word": "picnic",
        "definition": "n. 野餐 vi. 去野餐"
    },
    {
        "word": "picture",
        "definition": "n. 照片，图画；影片；景色；化身 vt. 画；想像；描写"
    },
    {
        "word": "picturesque",
        "definition": "adj. 独特的；生动的；别致的；图画般的"
    },
    {
        "word": "pie",
        "definition": "n. 馅饼；饼图；爱说话的人 vt. 使杂乱"
    },
    {
        "word": "piece",
        "definition": "n. 块；件；篇；硬币 vt. 修补；接合；凑合"
    },
    {
        "word": "pierce",
        "definition": "vt. 刺穿；洞察；响彻；深深地打动 vi. 进入；透入"
    },
    {
        "word": "pig",
        "definition": "n. 猪；猪肉 vi. 生小猪；像猪一样过活 n. 警察（俚语，带有攻击性）"
    },
    {
        "word": "pigeon",
        "definition": "n. 鸽子"
    },
    {
        "word": "pile",
        "definition": "n. 堆；大量；建筑群 vt. 累积；打桩于 vi. 挤；堆积；积累"
    },
    {
        "word": "pill",
        "definition": "n. 药丸；弹丸，子弹；口服避孕药 vt. 把…制成丸剂；使服用药丸；抢劫，掠夺（古语） vi. 做成药丸；服药丸"
    },
    {
        "word": "pillar",
        "definition": "n. 柱子，柱形物；栋梁；墩 vt. 用柱支持"
    },
    {
        "word": "pillow",
        "definition": "n. 枕头 vt. 垫；枕于…；使…靠在 vi. 枕着头；靠在枕上"
    },
    {
        "word": "pilot",
        "definition": "n. 飞行员；领航员 adj. 试点的 v. 驾驶；领航；试用"
    },
    {
        "word": "pin",
        "definition": "n. 大头针，别针，针；栓；琐碎物 vt. 钉住；压住；将……用针别住"
    },
    {
        "word": "pinch",
        "definition": "n. 匮乏；少量；夹痛 vt. 捏；勒索；使苦恼；掐掉某物，修剪 vi. 夹痛；节省"
    },
    {
        "word": "pine",
        "definition": "n.  松树；凤梨，菠萝 adj. 松木的；似松的 vt. 为…悲哀；哀悼 vi. 渴望，痛苦；憔悴"
    },
    {
        "word": "pink",
        "definition": "n. 粉红色；化身，典范；石竹花；头面人物 adj. 粉红的；比较激进的；石竹科的；脸色发红的 vt. 扎，刺，戳；使…变粉红色；使…面红耳赤 vi. 变粉红色"
    },
    {
        "word": "pint",
        "definition": "n. 品脱；一品脱的量；一品脱牛奶或啤酒"
    },
    {
        "word": "pioneer",
        "definition": "n. 先锋；拓荒者 vt. 开辟；倡导；提倡 vi. 作先驱"
    },
    {
        "word": "pipe",
        "definition": "n. 管；烟斗；笛 vt. 用管道输送；尖声唱；用管乐器演奏 vi. 吹笛；尖叫"
    },
    {
        "word": "pirate",
        "definition": "n. 海盗；盗版；侵犯专利权者 vt. 掠夺；翻印；剽窃 vi. 做海盗；从事劫掠"
    },
    {
        "word": "piracy",
        "definition": "n. 海盗行为；剽窃；著作权侵害；非法翻印"
    },
    {
        "word": "pistol",
        "definition": "n. 手枪；信号枪 vt. 用手枪射击"
    },
    {
        "word": "pit",
        "definition": "n. 矿井；深坑；陷阱；（物体或人体表面上的）凹陷；（英国剧场的）正厅后排；正厅后排的观众 vt. 使竞争；窖藏；使凹下；去…之核；使留疤痕 vi. 凹陷；起凹点"
    },
    {
        "word": "pitch",
        "definition": "n. 沥青；音高；程度；树脂；倾斜；投掷；球场 vt. 投；掷；定位于；用沥青涂；扎营；向前倾跌 vi. 倾斜；投掷；搭帐篷；坠落"
    },
    {
        "word": "pity",
        "definition": "n. 怜悯，同情；遗憾 vt. 对……表示怜悯；对……感到同情"
    },
    {
        "word": "pizza",
        "definition": "n. 比萨饼（一种涂有乳酪核番茄酱的意大利式有馅烘饼）"
    },
    {
        "word": "place",
        "definition": "n. 地方；住所；座位 vt. 放置；任命；寄予 vi. 名列前茅；取得名次"
    },
    {
        "word": "placement",
        "definition": "n. 布置；定位球；人员配置"
    },
    {
        "word": "plague",
        "definition": "n. 瘟疫；灾祸；麻烦；讨厌的人 vt. 折磨；使苦恼；使得灾祸"
    },
    {
        "word": "plain",
        "definition": "n. 平原；无格式；朴实无华的东西 adj. 平的；简单的；朴素的；清晰的 adv. 清楚地；平易地"
    },
    {
        "word": "plan",
        "definition": "n. 计划；平面图 vt. 计划；设计；打算 vi. 计划；打算"
    },
    {
        "word": "planning",
        "definition": "n. 规划；计划编制 v. 计划；设计；预期（plan的ing形式）"
    },
    {
        "word": "planner",
        "definition": "n. 计划者，规划师"
    },
    {
        "word": "plane",
        "definition": "n. 飞机；平面；程度，水平 adj. 平的；平面的 vt. 刨平；用刨子刨；掠过水面 vi. 刨；乘飞机旅行；翱翔"
    },
    {
        "word": "planet",
        "definition": "n. 行星"
    },
    {
        "word": "planetary",
        "definition": "adj. 行星的"
    },
    {
        "word": "plant",
        "definition": "n. 工厂，车间；植物；设备；庄稼 vt. 种植；培养；栽培；安置 vi. 种植"
    },
    {
        "word": "plantation",
        "definition": "n. 栽植；殖民；大农场 adj. 适用于种植园或热带、亚热带国家的"
    },
    {
        "word": "plastic",
        "definition": "n. 塑料制品；整形；可塑体 adj. 塑料的；（外科）造型的；可塑的"
    },
    {
        "word": "plate",
        "definition": "n. 碟；金属板；金属牌；感光底片 vt. 电镀；给…装甲"
    },
    {
        "word": "platform",
        "definition": "n. 平台；月台，站台；坛；讲台"
    },
    {
        "word": "play",
        "definition": "n. 游戏；比赛；剧本 vt. 游戏；扮演；演奏；播放；同…比赛 vi. 演奏；玩耍；上演；参加比赛"
    },
    {
        "word": "player",
        "definition": "n. 运动员，比赛者；游戏者，做游戏的人；演奏者，表演者；演员；播放器"
    },
    {
        "word": "playground",
        "definition": "n. 运动场，操场；游乐场"
    },
    {
        "word": "please",
        "definition": "int. 请（礼貌用语） vt. 使喜欢；使高兴，使满意 vi. 讨人喜欢；令人高兴"
    },
    {
        "word": "pleasure",
        "definition": "n. 快乐；希望；娱乐；令人高兴的事 vt. 使高兴；使满意 vi. 高兴；寻欢作乐"
    },
    {
        "word": "pleasant",
        "definition": "adj. 令人愉快的，舒适的；讨人喜欢的，和蔼可亲的"
    },
    {
        "word": "pleasing",
        "definition": "v. 取悦（please的现在分词） adj. 令人愉快的；讨人喜欢的；合意的"
    },
    {
        "word": "pledge",
        "definition": "n. 保证，誓言；抵押；抵押品，典当物 vt. 保证，许诺；用……抵押；举杯祝……健康"
    },
    {
        "word": "plenty",
        "definition": "n. 丰富，大量；充足 adj. 足够的，很多的 adv. 足够"
    },
    {
        "word": "plentiful",
        "definition": "adj. 丰富的；许多的；丰饶的；众多的"
    },
    {
        "word": "plot",
        "definition": "n. 情节；图；阴谋 vt. 密谋；绘图；划分；标绘 vi. 密谋；策划；绘制"
    },
    {
        "word": "plough",
        "definition": "n. 犁；耕地（等于plow） vi. 用犁耕田；开路 vt. 犁；耕"
    },
    {
        "word": "plow",
        "definition": "n.  犁；似犁的工具；北斗七星 vt.  犁；耕；开路 vi.  犁；耕地；破浪前进；开路"
    },
    {
        "word": "plug",
        "definition": "n. 插头；塞子；栓 vt. 插入；塞住；接插头 vi. 塞住；用插头将与电源接通"
    },
    {
        "word": "plunge",
        "definition": "n. 投入；跳进 vt. 使陷入；使投入；使插入 vi. 突然地下降；投入；陷入；跳进"
    },
    {
        "word": "plural",
        "definition": "n. 复数 adj. 复数的"
    },
    {
        "word": "plus",
        "definition": "prep. 加，加上 n. 正号，加号；好处；附加额 adj. 正的；附加的"
    },
    {
        "word": "pocket",
        "definition": "n. 口袋；钱；容器 adj. 小型的，袖珍的；金钱上的 vt. 隐藏；忍受；将…放入衣袋 vi. 形成袋或囊"
    },
    {
        "word": "podcast",
        "definition": "n. 播客"
    },
    {
        "word": "poem",
        "definition": "n. 诗"
    },
    {
        "word": "poetry",
        "definition": "n. 诗；诗意，诗情；诗歌艺术"
    },
    {
        "word": "poet",
        "definition": "n. 诗人"
    },
    {
        "word": "poetic",
        "definition": "n. 诗学，诗论 adj. 诗的，诗歌的；诗意的；诗人的"
    },
    {
        "word": "point",
        "definition": "n. 要点；得分；标点； 尖端 vt. 指向；弄尖；加标点于 vi. 表明；指向"
    },
    {
        "word": "pointless",
        "definition": "adj. 无意义的；钝的；不尖的；不得要领的"
    },
    {
        "word": "poison",
        "definition": "n. 毒药，毒物；酒；有毒害的事物； 抑制剂 adj. 有毒的 vt. 污染；使中毒，放毒于；败坏；阻碍 vi. 放毒，下毒"
    },
    {
        "word": "poisonous",
        "definition": "adj. 有毒的；恶毒的；讨厌的"
    },
    {
        "word": "pole",
        "definition": ""
    },
    {
        "word": "polar",
        "definition": "n. 极面；极线 adj. 极地的；两极的；正好相反的"
    },
    {
        "word": "police",
        "definition": "n. 警察，警方；治安 adj. 警察的；有关警察的 vt. 监督；管辖；维持治安；为…配备警察"
    },
    {
        "word": "policeman",
        "definition": "n. 警察，警员； 淀帚（橡皮头玻璃搅棒）"
    },
    {
        "word": "policy",
        "definition": "n. 政策，方针；保险单"
    },
    {
        "word": "polish",
        "definition": ""
    },
    {
        "word": "polite",
        "definition": "adj. 有礼貌的，客气的；文雅的；上流的；优雅的"
    },
    {
        "word": "politeness",
        "definition": "n. 有礼貌；优雅"
    },
    {
        "word": "politics",
        "definition": "n. 政治，政治学；政治活动；政纲"
    },
    {
        "word": "political",
        "definition": "adj. 政治的；党派的"
    },
    {
        "word": "politician",
        "definition": "n. 政治家，政客"
    },
    {
        "word": "poll",
        "definition": "n. 投票；民意测验；投票数；投票所 adj. 无角的；剪过毛的；修过枝的 vt. 投票；剪短；对…进行民意测验；获得选票 vi. 投票"
    },
    {
        "word": "pollster",
        "definition": "n. 民意测验专家，民意调查人；整理民意测验结果的人"
    },
    {
        "word": "pollute",
        "definition": "vt. 污染；玷污；败坏"
    },
    {
        "word": "pollution",
        "definition": "n. 污染 污染物"
    },
    {
        "word": "pollutant",
        "definition": "n. 污染物"
    },
    {
        "word": "pond",
        "definition": "n. 池塘 vt. 筑成池塘 vi. 筑成池塘"
    },
    {
        "word": "pool",
        "definition": "n. 联营；撞球；水塘；共同资金 vt. 合伙经营 vi. 联营，合伙经营"
    },
    {
        "word": "poor",
        "definition": "adj. 贫穷的；可怜的；贫乏的；卑鄙的"
    },
    {
        "word": "poverty",
        "definition": "n. 贫困；困难；缺少；低劣"
    },
    {
        "word": "pop",
        "definition": "abbr. 卖点广告（Point of Purchase）"
    },
    {
        "word": "popular",
        "definition": "adj. 流行的，通俗的；受欢迎的；大众的；普及的"
    },
    {
        "word": "popularity",
        "definition": "n. 普及，流行；名气；受大众欢迎"
    },
    {
        "word": "population",
        "definition": "n. 人口； 种群， 群体；全体居民"
    },
    {
        "word": "populous",
        "definition": "adj. 人口稠密的；人口多的"
    },
    {
        "word": "populate",
        "definition": "vt. 居住于；构成人口；移民于；殖民于"
    },
    {
        "word": "pork",
        "definition": "n. 猪肉 vt. 与女子性交"
    },
    {
        "word": "port",
        "definition": "n. 港口，口岸；（计算机的）端口；左舷；舱门 vt. 持（枪）；左转舵 vi. 转向左舷"
    },
    {
        "word": "portable",
        "definition": "n. 手提式打字机 adj. 手提的，便携式的；轻便的"
    },
    {
        "word": "porter",
        "definition": "n. 门房；服务员；行李搬运工；守门人"
    },
    {
        "word": "portion",
        "definition": "n. 部分；一份；命运 vt. 分配；给…嫁妆"
    },
    {
        "word": "pose",
        "definition": "vi. 摆姿势；佯装；矫揉造作 vt. 造成，形成；摆姿势；装模作样；提出…讨论 n. 姿势，姿态；装模作样"
    },
    {
        "word": "posture",
        "definition": "n. 姿势；态度；情形 vt. 作…的姿势 vi. 摆姿势"
    },
    {
        "word": "position",
        "definition": "n. 位置，方位；职位，工作；姿态；站位 vt. 安置；把……放在适当位置"
    },
    {
        "word": "positive",
        "definition": "n. 正数； 正片 adj. 积极的； 正的， 阳性的；确定的，肯定的；实际的，真实的；绝对的"
    },
    {
        "word": "possess",
        "definition": "vt. 控制；使掌握；持有；迷住；拥有，具备"
    },
    {
        "word": "possession",
        "definition": "n. 拥有；财产；领地；自制；着迷"
    },
    {
        "word": "possessive",
        "definition": "n. 所有格 adj. 占有的；所有的；所有格的；占有欲强的"
    },
    {
        "word": "possible",
        "definition": "n. 可能性；合适的人；可能的事物 adj. 可能的；合理的；合适的"
    },
    {
        "word": "possibility",
        "definition": "n. 可能性；可能发生的事物"
    },
    {
        "word": "possibly",
        "definition": "adv. 可能地；也许；大概"
    },
    {
        "word": "post",
        "definition": "n. 岗位；邮件；标杆 vt. 张贴；公布；邮递；布置 vi. 快速行进"
    },
    {
        "word": "postage",
        "definition": "n. 邮资，邮费"
    },
    {
        "word": "postman",
        "definition": "n. 邮递员；邮差"
    },
    {
        "word": "postcard",
        "definition": "n. 明信片"
    },
    {
        "word": "poster",
        "definition": "n. 海报，广告；招贴"
    },
    {
        "word": "postpone",
        "definition": "vt. 使…延期；把…放在次要地位；把…放在后面 vi. 延缓，延迟；延缓发作"
    },
    {
        "word": "postponement",
        "definition": "n. 延期；延缓"
    },
    {
        "word": "pot",
        "definition": "n. 壶；盆；罐 vt. 把…装罐；射击；节略 vi. 随手射击"
    },
    {
        "word": "potato",
        "definition": "n.  土豆， 马铃薯"
    },
    {
        "word": "potential",
        "definition": "n. 潜能；可能性； 电势 adj. 潜在的；可能的；势的"
    },
    {
        "word": "potentiality",
        "definition": "n. 潜力；可能性"
    },
    {
        "word": "pound",
        "definition": "n. 英镑；重击，重击声；兽栏；拘留所 vt. 捣烂；敲打；监禁，拘留 vi. 连续重击，猛击"
    },
    {
        "word": "pour",
        "definition": "n. 倾泻；流出；骤雨 vt. 灌，注；倒；倾泻；倾吐 vi. 倾泻；涌流；斟茶"
    },
    {
        "word": "powder",
        "definition": "n. 粉；粉末； 火药；尘土 vt. 使成粉末；撒粉；搽粉于 vi. 搽粉；变成粉末"
    },
    {
        "word": "power",
        "definition": "n. 力量，能力；电力，功率；政权，势力； 幂 adj. 借影响有权势人物以操纵权力的 vt. 激励；供以动力；使…有力量 vi. 快速前进"
    },
    {
        "word": "powerful",
        "definition": "adj. 强大的；强有力的 adv. 很；非常"
    },
    {
        "word": "practise",
        "definition": "vi. 练习，实践；实施，实行；从事 vt. 练习，实践；实施，实行"
    },
    {
        "word": "practice",
        "definition": "n. 实践；练习；惯例 vt. 练习；实习；实行 vi. 练习；实习；实行"
    },
    {
        "word": "practicable",
        "definition": "adj. 可用的；行得通的；可实行的"
    },
    {
        "word": "practical",
        "definition": "adj. 实际的；实用性的"
    },
    {
        "word": "practicality",
        "definition": "n. 实用性，实际性；实际，实例"
    },
    {
        "word": "praise",
        "definition": "n. 赞扬；称赞；荣耀；崇拜 vt. 赞美，歌颂；表扬 vi. 赞美；赞扬"
    },
    {
        "word": "pray",
        "definition": "vi. 祈祷；请；恳求 vt. 祈祷；恳求；央求"
    },
    {
        "word": "prayer",
        "definition": "n. 祈祷，祷告；恳求；祈祷文"
    },
    {
        "word": "prater",
        "definition": " 多嘴的人，空谈者"
    },
    {
        "word": "preach",
        "definition": "n. 说教 vt. 说教；讲道；鼓吹；传道；反复灌输 vi. 说教；讲道；鼓吹；宣扬"
    },
    {
        "word": "preacher",
        "definition": "n. 牧师；传教士；鼓吹者"
    },
    {
        "word": "precaution",
        "definition": "n. 预防，警惕；预防措施 vt. 警惕；预先警告"
    },
    {
        "word": "precautionary",
        "definition": "adj. 预防的；留心的；预先警戒的"
    },
    {
        "word": "precious",
        "definition": "adj. 宝贵的；珍贵的；矫揉造作的"
    },
    {
        "word": "precise",
        "definition": "adj. 精确的；明确的；严格的"
    },
    {
        "word": "precision",
        "definition": "n. 精度， 精密度；精确 adj. 精密的，精确的"
    },
    {
        "word": "precisely",
        "definition": "adv. 精确地；恰恰"
    },
    {
        "word": "predict",
        "definition": "vi. 作出预言；作预料，作预报 vt. 预报，预言；预知"
    },
    {
        "word": "prediction",
        "definition": "n. 预报；预言"
    },
    {
        "word": "predictable",
        "definition": "adj. 可预言的"
    },
    {
        "word": "preface",
        "definition": "n. 前言；引语 vt. 为…加序言；以…开始 vi. 作序"
    },
    {
        "word": "prefer",
        "definition": "vt. 更喜欢；宁愿；提出；提升 vi. 喜欢；愿意"
    },
    {
        "word": "preferable",
        "definition": "adj. 更好的，更可取的；更合意的"
    },
    {
        "word": "preference",
        "definition": "n. 偏爱，倾向；优先权"
    },
    {
        "word": "preferential",
        "definition": "adj. 优先的；选择的；特惠的；先取的"
    },
    {
        "word": "pregnant",
        "definition": "adj. 怀孕的；富有意义的"
    },
    {
        "word": "pregnancy",
        "definition": "n. 怀孕；丰富，多产；意义深长"
    },
    {
        "word": "prejudice",
        "definition": "n. 偏见；侵害 vt. 损害；使有偏见"
    },
    {
        "word": "preliminary",
        "definition": "n. 准备；预赛；初步措施 adj. 初步的；开始的；预备的"
    },
    {
        "word": "premier",
        "definition": "n. 总理，首相 adj. 第一的；最初的"
    },
    {
        "word": "prepare",
        "definition": "vt. 准备；使适合；装备；起草 vi. 预备；做好思想准备"
    },
    {
        "word": "preparation",
        "definition": "n. 预备；准备"
    },
    {
        "word": "preparatory",
        "definition": "n. 预科；预备学校 adj. 预备的"
    },
    {
        "word": "preposition",
        "definition": "n. 介词；前置词"
    },
    {
        "word": "prescribe",
        "definition": "vt. 规定；开处方 vi. 规定；开药方"
    },
    {
        "word": "prescription",
        "definition": "n. 药方；指示；惯例 adj. 凭处方方可购买的"
    },
    {
        "word": "present",
        "definition": "n. 现在；礼物；瞄准 adj. 现在的；出席的 vt. 提出；介绍；呈现；赠送 vi. 举枪瞄准"
    },
    {
        "word": "presence",
        "definition": "n. 存在；出席；参加；风度；仪态"
    },
    {
        "word": "presentation",
        "definition": "n. 展示；描述，陈述；介绍；赠送"
    },
    {
        "word": "presently",
        "definition": "adv. （美）目前；不久"
    },
    {
        "word": "preserve",
        "definition": "n. 保护区；禁猎地；加工成的食品 vt. 保存；保护；维持；腌；禁猎"
    },
    {
        "word": "preservation",
        "definition": "n. 保存，保留"
    },
    {
        "word": "preservative",
        "definition": "n. 防腐剂；预防法；防护层 adj. 防腐的；有保存力的；有保护性的"
    },
    {
        "word": "president",
        "definition": "n. 总统；董事长；校长；主席"
    },
    {
        "word": "presidency",
        "definition": "n. 总统（或董事长、会长、大学校长等）的职位（任期）；管辖；支配"
    },
    {
        "word": "presidential",
        "definition": "adj. 总统的；首长的；统辖的"
    },
    {
        "word": "press",
        "definition": "n. 压；按；新闻；出版社； 印刷机 vt. 压；按；逼迫；紧抱 vi. 压；逼；重压"
    },
    {
        "word": "pressure",
        "definition": "n. 压力；压迫， 压强 vt. 迫使；密封；使……增压"
    },
    {
        "word": "pressing",
        "definition": "n. 压；冲压件 v. 压；按；熨烫衣物（press的ing形式） adj. 紧迫的；迫切的；恳切的"
    },
    {
        "word": "pretend",
        "definition": "vt. 假装，伪装，模拟 adj. 假装的 vi. 假装，伪装，佯装"
    },
    {
        "word": "pretense",
        "definition": "n. 借口；虚假；炫耀；自吹（等于pretence）"
    },
    {
        "word": "pretence",
        "definition": "n. 假装；借口；虚伪"
    },
    {
        "word": "pretty",
        "definition": "n. 有吸引力的事物（尤指饰品）；漂亮的人 adj. 漂亮的；可爱的；优美的 adv. 相当地；颇"
    },
    {
        "word": "prevail",
        "definition": "vi. 盛行，流行；战胜，获胜"
    },
    {
        "word": "prevalence",
        "definition": "n. 流行；普遍；广泛"
    },
    {
        "word": "prevalent",
        "definition": "adj. 流行的；普遍的，广传的"
    },
    {
        "word": "prevent",
        "definition": "vt. 预防，防止；阻止 vi. 妨碍，阻止"
    },
    {
        "word": "prevention",
        "definition": "n. 预防；阻止；妨碍"
    },
    {
        "word": "preventive",
        "definition": "n. 预防药；预防法 adj. 预防的，防止的"
    },
    {
        "word": "preview",
        "definition": "n. 预览；试映；事先查看 vt. 预览；预演；事先查看"
    },
    {
        "word": "previous",
        "definition": "adj. 以前的；早先的；过早的 adv. 在先；在…以前"
    },
    {
        "word": "price",
        "definition": "n. 价格；价值；代价 vt. 给……定价；问……的价格"
    },
    {
        "word": "priceless",
        "definition": "n. 非卖品 adj. 无价的；极贵重的；非常有趣的"
    },
    {
        "word": "pride",
        "definition": "n. 自豪；骄傲；自尊心 vt. 使得意，以…自豪 vi. 自豪"
    },
    {
        "word": "proud",
        "definition": "adj. 自豪的；得意的；自负的"
    },
    {
        "word": "priest",
        "definition": "n. 牧师；神父；教士 vt. 使成为神职人员；任命…为祭司"
    },
    {
        "word": "primary",
        "definition": "n. 原色；最主要者 adj. 主要的；初级的；基本的"
    },
    {
        "word": "primarily",
        "definition": "adv. 首先；主要地，根本上"
    },
    {
        "word": "prime",
        "definition": "n. 初期；青年；精华；全盛时期 adj. 主要的；最好的；基本的 vt. 使准备好；填装 vi. 作准备 adv. 极好地"
    },
    {
        "word": "primitive",
        "definition": "n. 原始人 adj. 原始的，远古的；简单的，粗糙的"
    },
    {
        "word": "prince",
        "definition": "n. 王子，国君；亲王；贵族"
    },
    {
        "word": "princess",
        "definition": "n. 公主；王妃；女巨头"
    },
    {
        "word": "principal",
        "definition": "adj. 主要的；资本的 n. 首长；校长；资本；当事人"
    },
    {
        "word": "principle",
        "definition": "n. 原理，原则；主义，道义；本质，本义；根源，源泉"
    },
    {
        "word": "print",
        "definition": "n. 印刷业；印花布；印刷字体；印章；印记 vt. 印刷；打印；刊载；用印刷体写；在…印花样 vi. 印刷；出版；用印刷体写"
    },
    {
        "word": "printer",
        "definition": "n.  打印机；印刷工；印花工"
    },
    {
        "word": "printing",
        "definition": "n. 印刷；印刷术"
    },
    {
        "word": "prior",
        "definition": "adj. 优先的；在先的，在前的 adv. 在前，居先"
    },
    {
        "word": "priority",
        "definition": "n. 优先；优先权； 优先次序；优先考虑的事"
    },
    {
        "word": "prison",
        "definition": "n. 监狱；监禁；拘留所 vt. 监禁，关押"
    },
    {
        "word": "prisoner",
        "definition": "n. 囚犯，犯人；俘虏；刑事被告"
    },
    {
        "word": "private",
        "definition": "n. 列兵；二等兵 adj. 私人的；私有的；私下的"
    },
    {
        "word": "privacy",
        "definition": "n. 隐私；秘密；隐居；隐居处"
    },
    {
        "word": "privatize",
        "definition": "vt. 使私有化；使归私有"
    },
    {
        "word": "privatise",
        "definition": "vt. 使私有化"
    },
    {
        "word": "privatization",
        "definition": "n. 私有化"
    },
    {
        "word": "privatisation",
        "definition": "n. 私有化，非国营化（将国营企业转为民营）"
    },
    {
        "word": "privilege",
        "definition": "n. 特权；优待 vt. 给与…特权；特免"
    },
    {
        "word": "privileged",
        "definition": "adj. 享有特权的；有特别恩典的 v. 给予…特权；免除（privilege的过去分词）"
    },
    {
        "word": "prize",
        "definition": "n. 奖品；奖赏；战利品 adj. 获奖的 vt. 珍视；捕获；估价"
    },
    {
        "word": "probable",
        "definition": "n. 很可能的事；大有希望的候选者 adj. 很可能的；可信的"
    },
    {
        "word": "probability",
        "definition": "n. 可能性；机率； 或然率"
    },
    {
        "word": "probably",
        "definition": "adv. 大概；或许；很可能"
    },
    {
        "word": "problem",
        "definition": "n. 难题；引起麻烦的人 adj. 成问题的；难处理的"
    },
    {
        "word": "problematic",
        "definition": "adj. 问题的；有疑问的；不确定的"
    },
    {
        "word": "procedure",
        "definition": "n. 程序，手续；步骤"
    },
    {
        "word": "proceed",
        "definition": "vi. 开始；继续进行；发生；行进 n. 收入，获利"
    },
    {
        "word": "proceedings",
        "definition": "n. 诉讼；行动（proceeding的复数形式）；会议记录；议程"
    },
    {
        "word": "process",
        "definition": "n. 过程，进行；方法，步骤；作用；程序；推移 adj. 经过特殊加工（或处理）的 vt. 处理；加工 vi. 列队前进"
    },
    {
        "word": "processor",
        "definition": "n.  处理器；处理程序；加工者"
    },
    {
        "word": "procession",
        "definition": "n. 队伍，行列；一列，一排；列队行进 vt. 沿著……行进 vi. 列队行进"
    },
    {
        "word": "proclaim",
        "definition": "vt. 宣告，公布；声明；表明；赞扬"
    },
    {
        "word": "proclamation",
        "definition": "n. 公告；宣布；宣告；公布"
    },
    {
        "word": "produce",
        "definition": "n. 农产品，产品 vt. 生产；引起；创作；生育，繁殖 vi. 生产，创作"
    },
    {
        "word": "production",
        "definition": "n. 成果；产品；生产；作品"
    },
    {
        "word": "productive",
        "definition": "adj. 能生产的；生产的，生产性的；多产的；富有成效的"
    },
    {
        "word": "productivity",
        "definition": "n. 生产力；生产率；生产能力"
    },
    {
        "word": "product",
        "definition": "n. 产品；结果； 乘积；作品"
    },
    {
        "word": "profession",
        "definition": "n. 职业，专业；声明，宣布，表白"
    },
    {
        "word": "professional",
        "definition": "n. 专业人员；职业运动员 adj. 专业的；职业的；职业性的"
    },
    {
        "word": "professor",
        "definition": "n. 教授；教师；公开表示信仰的人"
    },
    {
        "word": "proficient",
        "definition": "n. 精通；专家，能手 adj. 熟练的，精通的"
    },
    {
        "word": "proficiency",
        "definition": "n. 精通，熟练"
    },
    {
        "word": "profit",
        "definition": "n. 利润；利益 vt. 有益于 vi. 获利；有益"
    },
    {
        "word": "profitable",
        "definition": "adj. 有利可图的；赚钱的；有益的"
    },
    {
        "word": "profound",
        "definition": "adj. 深厚的；意义深远的；渊博的"
    },
    {
        "word": "program",
        "definition": "n. 程序；计划；大纲 vt. 用程序指令；为…制订计划；为…安排节目 vi. 编程序；安排节目；设计电脑程式"
    },
    {
        "word": "programme",
        "definition": "n. 计划，规划；节目；程序 vt. 规划；拟…计划 vi. 编程序；制作节目"
    },
    {
        "word": "progress",
        "definition": "n. 进步，发展；前进 vi. 前进，进步；进行"
    },
    {
        "word": "progressive",
        "definition": "n. 改革论者；进步分子 adj. 进步的；先进的"
    },
    {
        "word": "progression",
        "definition": "n. 前进；连续"
    },
    {
        "word": "prohibit",
        "definition": "vt. 阻止，禁止"
    },
    {
        "word": "prohibition",
        "definition": "n. 禁止；禁令；禁酒；诉讼中止令"
    },
    {
        "word": "prohibitive",
        "definition": "adj. 禁止的，禁止性的；抑制的；（费用，价格等）过高的；类同禁止的"
    },
    {
        "word": "project",
        "definition": "n. 工程；计划；事业 vt. 设计；计划；发射；放映 vi. 设计；计划；表达；投射"
    },
    {
        "word": "projector",
        "definition": "n.  投影仪；放映机；探照灯；设计者"
    },
    {
        "word": "projection",
        "definition": "n. 投射；规划；突出；发射；推测"
    },
    {
        "word": "prominent",
        "definition": "adj. 突出的，显著的；杰出的；卓越的"
    },
    {
        "word": "prominence",
        "definition": "n. 突出；显著；突出物；卓越"
    },
    {
        "word": "promise",
        "definition": "n. 许诺，允诺；希望 vt. 允诺，许诺；给人以…的指望或希望 vi. 许诺；有指望，有前途"
    },
    {
        "word": "promising",
        "definition": "v. 许诺，答应（promise的现在分词形式） adj. 有希望的，有前途的"
    },
    {
        "word": "promote",
        "definition": "vi. 成为王后或其他大于卒的子 vt. 促进；提升；推销；发扬"
    },
    {
        "word": "promotion",
        "definition": "n. 提升， 晋升；推销，促销；促进；发扬，振兴"
    },
    {
        "word": "prompt",
        "definition": "n. 提示；付款期限；DOS命令：改变DOS系统提示符的风格 adj. 敏捷的，迅速的；立刻的 vt. 提示；促进；激起；（给演员）提白 adv. 准时地"
    },
    {
        "word": "pronoun",
        "definition": "n. 代词"
    },
    {
        "word": "pronounce",
        "definition": "vt. 发音；宣判；断言 vi. 发音；作出判断"
    },
    {
        "word": "pronunciation",
        "definition": "n. 发音；读法"
    },
    {
        "word": "proof",
        "definition": "n. 证明；证据；校样；考验；验证；试验 adj. 防…的；不能透入的；证明用的；耐…的 vt. 试验；校对；使不被穿透"
    },
    {
        "word": "proper",
        "definition": "adj. 适当的；本身的；特有的；正派的 adv. 完全地"
    },
    {
        "word": "property",
        "definition": "n. 性质，性能；财产；所有权"
    },
    {
        "word": "proportion",
        "definition": "n. 比例，占比；部分；面积；均衡 vt. 使成比例；使均衡；分摊"
    },
    {
        "word": "proportional",
        "definition": "n.  比例项 adj. 比例的，成比例的；相称的，均衡的"
    },
    {
        "word": "propose",
        "definition": "vi. 建议；求婚；打算 vt. 建议；打算，计划；求婚"
    },
    {
        "word": "proposal",
        "definition": "n. 提议，建议；求婚"
    },
    {
        "word": "proposition",
        "definition": "n.  命题；提议；主题；议题 vt. 向…提议；向…求欢"
    },
    {
        "word": "prose",
        "definition": "n. 散文；单调 adj. 散文的；平凡的；乏味的 vt. 把…写成散文 vi. 写散文；乏味地讲话"
    },
    {
        "word": "prospect",
        "definition": "n. 前途；预期；景色 vt. 勘探，勘察 vi. 勘探，找矿"
    },
    {
        "word": "prospective",
        "definition": "n. 预期；展望 adj. 未来的；预期的"
    },
    {
        "word": "protect",
        "definition": "vt. 保护，防卫；警戒"
    },
    {
        "word": "protection",
        "definition": "n. 保护；防卫；护照"
    },
    {
        "word": "protective",
        "definition": "adj. 防护的；关切保护的；保护贸易的"
    },
    {
        "word": "protein",
        "definition": "n. 蛋白质；朊 adj. 蛋白质的"
    },
    {
        "word": "protest",
        "definition": "n. 抗议 adj. 表示抗议的；抗议性的 vt. 抗议；断言 vi. 抗议；断言"
    },
    {
        "word": "prove",
        "definition": "vi. 证明是 vt. 证明；检验；显示"
    },
    {
        "word": "proverb",
        "definition": "n. 谚语，格言；众所周知的人或事"
    },
    {
        "word": "proverbial",
        "definition": "adj. 谚语的；众所周知的；谚语式的"
    },
    {
        "word": "provide",
        "definition": "vt. 提供；规定；准备；装备 vi. 规定；抚养；作准备"
    },
    {
        "word": "provision",
        "definition": "n. 规定；条款；准备； 供应品 vt. 供给…食物及必需品"
    },
    {
        "word": "provided",
        "definition": "conj. 假如；倘若 v. 提供；给予（provide的过去式）"
    },
    {
        "word": "province",
        "definition": "n. 省；领域；职权"
    },
    {
        "word": "provincial",
        "definition": "n. 粗野的人；乡下人；外地人 adj. 省的；地方性的；偏狭的"
    },
    {
        "word": "provoke",
        "definition": "vt. 驱使；激怒；煽动；惹起"
    },
    {
        "word": "provocation",
        "definition": "n. 挑衅；激怒；挑拨"
    },
    {
        "word": "provocative",
        "definition": "n. 刺激物，挑拨物；兴奋剂 adj. 刺激的，挑拨的；气人的"
    },
    {
        "word": "psychology",
        "definition": "n. 心理学；心理状态"
    },
    {
        "word": "psychological",
        "definition": "adj. 心理的；心理学的；精神上的"
    },
    {
        "word": "psychologist",
        "definition": "n. 心理学家，心理学者"
    },
    {
        "word": "pub",
        "definition": "n. 酒馆；客栈"
    },
    {
        "word": "public",
        "definition": "n. 公众；社会；公共场所 adj. 公众的；政府的；公用的；公立的"
    },
    {
        "word": "publicize",
        "definition": "vt. 宣传；公布"
    },
    {
        "word": "publicise",
        "definition": "vt. 宣传，宣扬；公布，颂"
    },
    {
        "word": "publicity",
        "definition": "n. 宣传，宣扬；公开；广告；注意"
    },
    {
        "word": "publicly",
        "definition": "adv. 公然地；以公众名义"
    },
    {
        "word": "publish",
        "definition": "vi. 出版；发行；刊印 vt. 出版；发表；公布"
    },
    {
        "word": "publication",
        "definition": "n. 出版；出版物；发表"
    },
    {
        "word": "pull",
        "definition": "n. 拉，拉绳；拉力，牵引力；拖 vt. 拉；拔；拖 vi. 拉，拖；拔"
    },
    {
        "word": "pulse",
        "definition": "n.  脉冲；脉搏 vt. 使跳动 vi. 跳动，脉跳"
    },
    {
        "word": "pump",
        "definition": "n. 泵，抽水机；打气筒 vt. 打气；用抽水机抽… vi. 抽水"
    },
    {
        "word": "punch",
        "definition": "n. 冲压机；打洞器；钻孔机 vt. 开洞；以拳重击 vi. 用拳猛击"
    },
    {
        "word": "punctual",
        "definition": "adj. 准时的，守时的；精确的"
    },
    {
        "word": "punctuality",
        "definition": "n. 严守时间；正确；规矩"
    },
    {
        "word": "punish",
        "definition": "vt. 惩罚；严厉对待；贪婪地吃喝 vi. 惩罚"
    },
    {
        "word": "punishment",
        "definition": "n. 惩罚；严厉对待，虐待"
    },
    {
        "word": "pupil",
        "definition": "n. 学生； 瞳孔；未成年人"
    },
    {
        "word": "purchase",
        "definition": "n. 购买；紧握；起重装置 vt. 购买；赢得 vi. 购买东西"
    },
    {
        "word": "pure",
        "definition": "adj. 纯的；纯粹的；纯洁的；清白的；纯理论的"
    },
    {
        "word": "purity",
        "definition": "n.  纯度；纯洁；纯净；纯粹"
    },
    {
        "word": "purify",
        "definition": "vt. 净化；使纯净 vi. 净化；变纯净"
    },
    {
        "word": "purple",
        "definition": "n. 紫色；紫袍 adj. 紫色的；帝王的；华而不实的 vt. 使成紫色 vi. 变成紫色"
    },
    {
        "word": "purpose",
        "definition": "n. 目的；用途；意志 vt. 决心；企图；打算"
    },
    {
        "word": "purposeful",
        "definition": "adj. 有目的的；有决心的"
    },
    {
        "word": "purse",
        "definition": "n. (女士)手提袋；(国家、家庭、团体等的) 财力 vt. （嘴巴）皱起，使缩拢；撅嘴"
    },
    {
        "word": "pursue",
        "definition": "vi. 追赶；继续进行 vt. 继续；从事；追赶；纠缠"
    },
    {
        "word": "pursuit",
        "definition": "n. 追赶，追求；职业，工作"
    },
    {
        "word": "push",
        "definition": "n. 推，决心；大规模攻势；矢志的追求 vi. 推进；增加；努力争取 vt. 推动，增加；对…施加压力，逼迫；按；说服"
    },
    {
        "word": "pushy",
        "definition": "adj. 有进取心的；爱出风头的；有冲劲的；固执己见的"
    },
    {
        "word": "put",
        "definition": "n. 掷；笨蛋；投击；怪人 adj. 固定不动的 vi. 出发；击；航行；发芽 vt. 放；表达；移动；安置；赋予"
    },
    {
        "word": "puzzle",
        "definition": "n. 谜；难题；迷惑 vt. 使…困惑；使…为难；苦思而得出 vi. 迷惑；冥思苦想"
    },
    {
        "word": "puzzlement",
        "definition": "n. 迷惑；费解"
    },
    {
        "word": "quake",
        "definition": "vi. 震动；颤抖 n. 地震；颤抖"
    },
    {
        "word": "qualify",
        "definition": "vi. 取得资格，有资格 vt. 限制；使具有资格；证明…合格"
    },
    {
        "word": "qualification",
        "definition": "n. 资格；条件；限制；赋予资格"
    },
    {
        "word": "quality",
        "definition": "n. 质量， 品质；特性；才能 adj. 优质的；高品质的；<英俚>棒极了"
    },
    {
        "word": "qualitative",
        "definition": "adj. 定性的；质的，性质上的"
    },
    {
        "word": "quantify",
        "definition": "vt. 量化；为…定量；确定数量 vi. 量化；定量"
    },
    {
        "word": "quantification",
        "definition": "n.  定量，量化"
    },
    {
        "word": "quantity",
        "definition": "n. 量，数量；大量；总量"
    },
    {
        "word": "quantitative",
        "definition": "adj. 定量的；量的，数量的"
    },
    {
        "word": "quarrel",
        "definition": "n. 吵架；反目；怨言；争吵的原因；方头凿 vi. 吵架；争论；挑剔"
    },
    {
        "word": "quarrelsome",
        "definition": "adj. 喜欢吵架的；好争论的"
    },
    {
        "word": "quarter",
        "definition": "num. 四分之一 n. 四分之一；地区；季度；一刻钟；两角五分；节 vt. 将…四等分；供某人住宿 vi. 住宿；驻扎"
    },
    {
        "word": "quarterly",
        "definition": "n. 季刊 adj. 季度的，按季度的；一年四次的 adv. 按季度， 一季一次地；纵横四分地"
    },
    {
        "word": "queen",
        "definition": "n. 女王，王后；（纸牌中的）皇后；（蜜蜂等的）蜂王 vt. 使…成为女王或王后 vi. 做女王"
    },
    {
        "word": "question",
        "definition": "n. 问题，疑问；询问；疑问句 vt. 询问；怀疑；审问 vi. 询问；怀疑；审问"
    },
    {
        "word": "questionnaire",
        "definition": "n. 问卷；调查表"
    },
    {
        "word": "queue",
        "definition": "n. 队列；长队；辫子 vt. 将…梳成辫子；使…排队 vi. 排队；排队等候"
    },
    {
        "word": "quick",
        "definition": "n. 核心；伤口的嫩肉 adj. 快的；迅速的，敏捷的；灵敏的 adv. 迅速地，快"
    },
    {
        "word": "quiet",
        "definition": "n. 安静；和平 adj. 安静的；安定的；不动的；温顺的 vt. 使平息；安慰 vi. 平静下来"
    },
    {
        "word": "quit",
        "definition": "n. 离开； 退出 vt. 离开；放弃；停止；使…解除 adj. 摆脱了…的；已经了结的 vi. 离开；辞职；停止"
    },
    {
        "word": "quite",
        "definition": "adv. 很；相当；完全"
    },
    {
        "word": "quiz",
        "definition": "n. 考查；恶作剧；课堂测验 vt. 挖苦；张望；对…进行测验"
    },
    {
        "word": "quota",
        "definition": "n. 配额；定额；限额"
    },
    {
        "word": "quote",
        "definition": "n. 引用 vi. 报价；引用；引证 vt. 报价；引述；举证"
    },
    {
        "word": "quotation",
        "definition": "n.  报价单；引用语；引证"
    },
    {
        "word": "rabbit",
        "definition": "n. 兔子，野兔 vt. 让…见鬼去吧 vi. 猎兔"
    },
    {
        "word": "race",
        "definition": "n. 属，种；种族，人种；家庭，门第 vt. 使参加比赛；和…竞赛；使急走，使全速行进 vi. 比速度，参加竞赛；全速行进"
    },
    {
        "word": "racial",
        "definition": "adj. 种族的；人种的"
    },
    {
        "word": "racism",
        "definition": "n. 种族主义，种族歧视；人种偏见"
    },
    {
        "word": "racist",
        "definition": "n. 种族主义者 种族主义的"
    },
    {
        "word": "rack",
        "definition": "n.  齿条；架子；拷问台 vt. 折磨；榨取 vi. 变形；随风飘；小步跑"
    },
    {
        "word": "radar",
        "definition": "n.  雷达，无线电探测器"
    },
    {
        "word": "radical",
        "definition": "n. 基础；激进分子； 原子团； 根数 adj. 激进的；根本的；彻底的"
    },
    {
        "word": "radio",
        "definition": "n. 收音机；无线电广播设备 vt. 用无线电发送 vi. 用无线电进行通信"
    },
    {
        "word": "rag",
        "definition": "n. 破布；碎屑 vt. 戏弄；责骂 vi. 变破碎；穿着讲究"
    },
    {
        "word": "ragged",
        "definition": "adj. 衣衫褴褛的；粗糙的；参差不齐的；锯齿状的；刺耳的；不规则的"
    },
    {
        "word": "raggedly",
        "definition": "adv. 粗糙地；破烂地"
    },
    {
        "word": "rage",
        "definition": "n. 愤怒；狂暴，肆虐；情绪激动 vi. 大怒，发怒；流行，风行"
    },
    {
        "word": "raging",
        "definition": "adj. 愤怒的，狂暴的 v. 发怒，恼火（rage的现在分词）"
    },
    {
        "word": "raid",
        "definition": "n. 袭击；突袭；搜捕；抢劫 vt. 袭击，突袭 vi. 对…进行突然袭击"
    },
    {
        "word": "rail",
        "definition": "n. 铁轨；扶手；横杆；围栏 vt. 铺铁轨；以横木围栏 vi. 抱怨；责骂"
    },
    {
        "word": "railway",
        "definition": "n. （英）铁路；轨道；铁道部门 vi. 乘火车旅行"
    },
    {
        "word": "railroad",
        "definition": "n. 铁路；铁路公司 vt. 由铁道运输；铺设铁路；以捏造不实之罪使入狱 vi. 在铁路工作；乘火车旅行；筑铁路"
    },
    {
        "word": "rain",
        "definition": "n. 雨；下雨；雨天；雨季 vt. 大量地给；使大量落下 vi. 下雨；降雨"
    },
    {
        "word": "rainy",
        "definition": "adj. 下雨的；多雨的"
    },
    {
        "word": "rainbow",
        "definition": "n. 彩虹；五彩缤纷的排列；幻想 adj. 五彩缤纷的；彩虹状的 vt. 使呈彩虹状；如彩虹般装饰 vi. 呈彩虹状"
    },
    {
        "word": "raincoat",
        "definition": "n. （美）雨衣"
    },
    {
        "word": "raise",
        "definition": "n. 高地；上升；加薪 vt. 提高；筹集；养育；升起 vi. 上升"
    },
    {
        "word": "rally",
        "definition": "n. 集会；回复；公路赛车会 vt. 团结；集合；恢复健康、力量等 vi. 团结；重整；恢复；（网球等）连续对打"
    },
    {
        "word": "range",
        "definition": "n. 范围；幅度；排；山脉 vt. 漫游；放牧；使并列；归类于；来回走动 vi. （在...内）变动；平行，列为一行；延伸；漫游；射程达到"
    },
    {
        "word": "rank",
        "definition": "n. 排；等级；军衔；队列 adj. 讨厌的；恶臭的；繁茂的 vt. 排列；把…分等 vi. 列为；列队"
    },
    {
        "word": "rapid",
        "definition": "n. 急流；高速交通工具，高速交通网 adj. 迅速的，急促的；飞快的；险峻的"
    },
    {
        "word": "rapidity",
        "definition": "n. 迅速，急速；速度；险峻"
    },
    {
        "word": "rare",
        "definition": "adj. 稀有的；稀薄的；半熟的 adj. 杰出的；极度的；非常好的 adv. 非常；极其 vi. 用后腿站起；渴望"
    },
    {
        "word": "rarely",
        "definition": "adv. 很少地；难得；罕有地"
    },
    {
        "word": "rarity",
        "definition": "n. 罕见；珍贵；珍品（需用复数）；稀薄"
    },
    {
        "word": "rat",
        "definition": "n. 鼠；卑鄙小人，叛徒 vi. 捕鼠；背叛，告密"
    },
    {
        "word": "rate",
        "definition": "n. 比率，率；速度；价格；等级 vt. 认为；估价；责骂 vi. 责骂；被评价"
    },
    {
        "word": "rating",
        "definition": "n. 等级；等级评定；额定功率 v. 对…评价（rate的ing形式）"
    },
    {
        "word": "rather",
        "definition": "adv. 宁可，宁愿；相当 int. 当然啦（回答问题时用）"
    },
    {
        "word": "ratio",
        "definition": "n. 比率，比例"
    },
    {
        "word": "rational",
        "definition": "n. 有理数 adj. 合理的；理性的"
    },
    {
        "word": "raw",
        "definition": "n. 擦伤处 adj. 生的；未加工的；阴冷的；刺痛的；擦掉皮的；无经验的；（在艺术等方面）不成熟的 vt. 擦伤"
    },
    {
        "word": "ray",
        "definition": "n. 射线；光线；鳐形目(Rajiformes)鱼 vt. 放射；显出 vi. 放射光线；浮现"
    },
    {
        "word": "reach",
        "definition": "n. 范围；延伸；河段；横风行驶 vi. 达到；延伸；伸出手；传开 vt. 达到；影响；抵达；伸出"
    },
    {
        "word": "react",
        "definition": "vi. 反应；影响；反抗；起反作用 vt. 使发生相互作用；使起化学反应"
    },
    {
        "word": "reaction",
        "definition": "n. 反应，感应；反动，复古；反作用"
    },
    {
        "word": "reactionary",
        "definition": "n. 反动分子；反动派；保守派 adj. 保守的，反动的；反动主义的；反对改革的"
    },
    {
        "word": "read",
        "definition": "n. 阅读；读物 adj. 有学问的 vi. 读；读起来 vt. 阅读；读懂，理解"
    },
    {
        "word": "reading",
        "definition": "n. 阅读，朗读；读物；读数 v. 阅读（read的ing形式） adj. 阅读的"
    },
    {
        "word": "reader",
        "definition": "n. 读者；阅读器；读物"
    },
    {
        "word": "ready",
        "definition": "n. 现款；预备好的状态 adj. 准备好；现成的；迅速的；情愿的；快要…的 vt. 使准备好 adv. 迅速地；预先"
    },
    {
        "word": "readily",
        "definition": "adv. 容易地；乐意地；无困难地"
    },
    {
        "word": "real",
        "definition": "n. 现实；实数 adj. 实际的；真实的；实在的 adv. 真正地；确实地"
    },
    {
        "word": "really",
        "definition": "adv. 实际上，事实上；真正地，真实地；真的吗？（表语气）"
    },
    {
        "word": "reality",
        "definition": "n. 现实；实际；真实"
    },
    {
        "word": "realistic",
        "definition": "adj. 现实的；现实主义的；逼真的；实在论的"
    },
    {
        "word": "realism",
        "definition": "n. 现实主义；实在论；现实主义的态度和行为"
    },
    {
        "word": "realize",
        "definition": "vt. 实现；认识到；了解；将某物卖得，把(证券等)变成现钱；变卖"
    },
    {
        "word": "realise",
        "definition": "vt. 实现, 认识到, 体会到, 了解, 认清, 使显得逼真, 变卖财产为现钱"
    },
    {
        "word": "realization",
        "definition": "n. 实现；领悟"
    },
    {
        "word": "realisation",
        "definition": "n. 认识，领会; 实现"
    },
    {
        "word": "realm",
        "definition": "n. 领域，范围；王国"
    },
    {
        "word": "reap",
        "definition": "vt. 收获，获得；收割 vi. 收割，收获"
    },
    {
        "word": "rear",
        "definition": "n. 后面；屁股；后方部队 adj. 后方的；后面的；背面的 vt. 培养；树立；栽种 adv. 向后；在后面 vi. 暴跳；高耸"
    },
    {
        "word": "reason",
        "definition": "n. 理由；理性；动机 vt. 说服；推论；辩论 vi. 推论；劝说"
    },
    {
        "word": "reasonable",
        "definition": "adj. 合理的，公道的；通情达理的"
    },
    {
        "word": "rebel",
        "definition": "n. 反叛者；叛徒 adj. 反抗的；造反的 vi. 反叛；反抗；造反"
    },
    {
        "word": "rebellion",
        "definition": "n. 叛乱；反抗；谋反；不服从"
    },
    {
        "word": "rebellious",
        "definition": "adj. 反抗的；造反的；难控制的"
    },
    {
        "word": "recall",
        "definition": "n. 召回；回忆；撤消 vt. 召回；回想起，记起；取消"
    },
    {
        "word": "receive",
        "definition": "vt. 收到；接待；接纳 vi. 接收"
    },
    {
        "word": "receipt",
        "definition": "n. 收到；收据；收入 vt. 收到"
    },
    {
        "word": "recipient",
        "definition": "n. 容器，接受者；容纳者 adj. 容易接受的，感受性强的"
    },
    {
        "word": "receptive",
        "definition": "adj. 善于接受的；能容纳的"
    },
    {
        "word": "receiver",
        "definition": "n. 接收器；接受者；收信机；收款员，接待者"
    },
    {
        "word": "recent",
        "definition": "adj. 最近的；近代的"
    },
    {
        "word": "recently",
        "definition": "adv. 最近；新近"
    },
    {
        "word": "reception",
        "definition": "n. 接待；接收；招待会；感受；反应"
    },
    {
        "word": "receptionist",
        "definition": "n. 接待员；传达员"
    },
    {
        "word": "recession",
        "definition": "n. 衰退；不景气；后退；凹处"
    },
    {
        "word": "recite",
        "definition": "vt. 背诵；叙述；列举 vi. 背诵；叙述"
    },
    {
        "word": "recitation",
        "definition": "n. 背诵；朗诵；详述；背诵的诗"
    },
    {
        "word": "reckon",
        "definition": "vi. 估计；计算；猜想，料想 vt. 测算，估计；认为；计算"
    },
    {
        "word": "recognize",
        "definition": "vt. 认出，识别；承认 vi. 确认，承认；具结"
    },
    {
        "word": "recognise",
        "definition": "vt. 认出；承认，认可；识别"
    },
    {
        "word": "recognition",
        "definition": "n. 识别；承认，认出；重视；赞誉；公认"
    },
    {
        "word": "recommend",
        "definition": "vt. 推荐，介绍；劝告；使受欢迎；托付 vi. 推荐；建议"
    },
    {
        "word": "recommendation",
        "definition": "n. 推荐；建议；推荐信"
    },
    {
        "word": "record",
        "definition": "n. 档案，履历；唱片；最高纪录 adj. 创纪录的 vt. 记录，记载；标明；将...录音 vi. 记录；录音"
    },
    {
        "word": "recorder",
        "definition": "n. 录音机；记录器；记录员；八孔直笛"
    },
    {
        "word": "recording",
        "definition": "n. 录音；唱片 v. 录音；记录；录像（record的ing形式） adj. 记录的；记录用的"
    },
    {
        "word": "recover",
        "definition": "n. 还原至预备姿势 vt. 恢复；弥补；重新获得 vi. 恢复；胜诉；重新得球"
    },
    {
        "word": "recovery",
        "definition": "n. 恢复，复原；痊愈；重获"
    },
    {
        "word": "recreation",
        "definition": "n. 娱乐；消遣；休养"
    },
    {
        "word": "recreational",
        "definition": "adj. 娱乐的，消遣的；休养的"
    },
    {
        "word": "recruit",
        "definition": "n. 招聘；新兵；新成员 vi. 复原；征募新兵；得到补充；恢复健康 vt. 补充；聘用；征募；使…恢复健康"
    },
    {
        "word": "recruitment",
        "definition": "n. 补充；征募新兵"
    },
    {
        "word": "recycle",
        "definition": "n. 再生；再循环；重复利用 vt. 使再循环；使…重新利用 vi. 重复利用"
    },
    {
        "word": "recyclable",
        "definition": "adj. 可回收利用的；可再循环的"
    },
    {
        "word": "red",
        "definition": "n. 红色，红颜料；赤字 adj. 红色的；红肿的，充血的"
    },
    {
        "word": "reduce",
        "definition": "vi. 减少；缩小；归纳为 vt. 减少；降低；使处于；把…分解"
    },
    {
        "word": "reduction",
        "definition": "n. 减少；下降；缩小；还原反应"
    },
    {
        "word": "refer",
        "definition": "vt. 涉及；委托；归诸于；使…求助于 vi. 参考；涉及；提到；查阅"
    },
    {
        "word": "reference",
        "definition": "n. 参考，参照；涉及，提及；参考书目；介绍信；证明书 vt. 引用 vi. 引用"
    },
    {
        "word": "refine",
        "definition": "vt. 精炼，提纯；改善；使…文雅"
    },
    {
        "word": "refinery",
        "definition": "n. 精炼厂；提炼厂；冶炼厂"
    },
    {
        "word": "refinement",
        "definition": "n. 精制；文雅； 提纯"
    },
    {
        "word": "reflect",
        "definition": "vt. 反映；反射，照出；表达；显示;反省 vi. 反射，映现；深思"
    },
    {
        "word": "reflection",
        "definition": "n. 反射；沉思；映象"
    },
    {
        "word": "reflective",
        "definition": "adj. 反射的；反映的；沉思的"
    },
    {
        "word": "reform",
        "definition": "n. 改革，改良；改正 adj. 改革的；改革教会的 vt. 改革，革新；重新组成 vi. 重组；改过"
    },
    {
        "word": "reformation",
        "definition": "n. 革新；改善"
    },
    {
        "word": "reformist",
        "definition": "n. 改革者；改革主义者 adj. 改良主义的；改良运动的"
    },
    {
        "word": "refrain",
        "definition": "n. 叠句，副歌；重复 vi. 节制，克制；避免；制止"
    },
    {
        "word": "refresh",
        "definition": "vt. 更新；使……恢复；使……清新；消除……的疲劳 vi. 恢复精神；喝饮料，吃点心；补充给养"
    },
    {
        "word": "refreshment",
        "definition": "n. 点心；起提神作用的东西；精力恢复"
    },
    {
        "word": "refrigerator",
        "definition": "n. 冰箱，冷藏库"
    },
    {
        "word": "fridge",
        "definition": "n. 电冰箱"
    },
    {
        "word": "refrigeration",
        "definition": "n. 制冷；冷藏； 冷却"
    },
    {
        "word": "refuse",
        "definition": "n. 垃圾；废物 vi. 拒绝 vt. 拒绝；不愿；抵制"
    },
    {
        "word": "refusal",
        "definition": "n. 拒绝；优先取舍权；推却；取舍权"
    },
    {
        "word": "regard",
        "definition": "n. 注意；尊重；问候；凝视 vi. 注意，注重；注视 vt. 注重，考虑；看待；尊敬；把…看作；与…有关"
    },
    {
        "word": "regarding",
        "definition": "prep. 关于，至于"
    },
    {
        "word": "regardless",
        "definition": "adj. 不管的；不顾的；不注意的 adv. 不顾后果地；不管怎样，无论如何；不惜费用地"
    },
    {
        "word": "region",
        "definition": "n. 地区；范围；部位"
    },
    {
        "word": "regional",
        "definition": "adj. 地区的；局部的；整个地区的"
    },
    {
        "word": "register",
        "definition": "n. 登记；注册；记录；寄存器；登记簿 vt. 登记；注册；记录；挂号邮寄；把…挂号；正式提出 vi. 登记；注册；挂号"
    },
    {
        "word": "registration",
        "definition": "n. 登记；注册；挂号"
    },
    {
        "word": "registrar",
        "definition": "n. 登记员；注册主任；专科住院医师"
    },
    {
        "word": "regret",
        "definition": "n. 遗憾；抱歉；悲叹 vi. 感到后悔；感到抱歉 vt. 后悔；惋惜；哀悼"
    },
    {
        "word": "regrettable",
        "definition": "adj. 令人遗憾的；可惜的；可悲的；抱歉的"
    },
    {
        "word": "regretful",
        "definition": "adj. 后悔的，遗憾的；惋惜的"
    },
    {
        "word": "regular",
        "definition": "n. 常客；正式队员；中坚分子 adj. 定期的；有规律的；合格的；整齐的；普通的 adv. 定期地；经常地"
    },
    {
        "word": "regularity",
        "definition": "n. 规则性；整齐；正规；匀称"
    },
    {
        "word": "regulate",
        "definition": "vt. 调节，规定；控制；校准；有系统的管理"
    },
    {
        "word": "regulation",
        "definition": "n. 管理；规则；校准 adj. 规定的；平常的"
    },
    {
        "word": "regulatory",
        "definition": "adj. 管理的；控制的；调整的"
    },
    {
        "word": "regulator",
        "definition": "n. 调整者；监管者；校准器"
    },
    {
        "word": "reinforce",
        "definition": "n. 加强；加固物；加固材料 vt. 加强，加固；强化；补充 vi. 求援；得到增援；给予更多的支持"
    },
    {
        "word": "reinforcement",
        "definition": "n. 加固；增援；援军；加强"
    },
    {
        "word": "reject",
        "definition": "n. 被弃之物或人；次品 vt. 拒绝；排斥；抵制；丢弃"
    },
    {
        "word": "rejection",
        "definition": "n. 抛弃；拒绝；被抛弃的东西；盖帽"
    },
    {
        "word": "relate",
        "definition": "vt. 叙述；使…有联系 vi. 涉及；认同；符合；与…有某种联系"
    },
    {
        "word": "relation",
        "definition": "n. 关系；叙述；故事；亲属关系"
    },
    {
        "word": "relationship",
        "definition": "n. 关系；关联"
    },
    {
        "word": "relative",
        "definition": "n. 亲戚；相关物； 关系词；亲缘植物 adj. 相对的；有关系的；成比例的"
    },
    {
        "word": "relativity",
        "definition": "n. 相对论；相关性；相对性"
    },
    {
        "word": "relax",
        "definition": "vi. 放松，休息；松懈，松弛；变从容；休养 vt. 放松；使休息；使松弛；缓和；使松懈"
    },
    {
        "word": "relaxation",
        "definition": "n. 放松；缓和；消遣"
    },
    {
        "word": "relay",
        "definition": "n.  继电器；接替，接替人员；驿马 vt. 转播；使接替；分程传递 vi. 转播；接替"
    },
    {
        "word": "release",
        "definition": "n. 释放；发布；让与 vt. 释放；发射；让与；允许发表"
    },
    {
        "word": "relevant",
        "definition": "adj. 相关的；切题的；中肯的；有重大关系的；有意义的，目的明确的"
    },
    {
        "word": "relevance",
        "definition": "n. 关联；适当；中肯"
    },
    {
        "word": "relieve",
        "definition": "vt. 解除，减轻；使不单调乏味；换…的班；解围；使放心"
    },
    {
        "word": "relief",
        "definition": "n. 救济；减轻，解除；安慰；浮雕"
    },
    {
        "word": "religion",
        "definition": "n. 宗教；宗教信仰"
    },
    {
        "word": "religious",
        "definition": "n. 修道士；尼姑 adj. 宗教的；虔诚的；严谨的；修道的"
    },
    {
        "word": "reluctant",
        "definition": "adj. 不情愿的；勉强的；顽抗的"
    },
    {
        "word": "reluctance",
        "definition": "n.  磁阻；勉强；不情愿"
    },
    {
        "word": "rely",
        "definition": "vi. 依靠；信赖"
    },
    {
        "word": "reliance",
        "definition": "n. 信赖；信心；受信赖的人或物"
    },
    {
        "word": "reliable",
        "definition": "n. 可靠的人 adj. 可靠的；可信赖的"
    },
    {
        "word": "remain",
        "definition": "n. 遗迹；剩余物，残骸 vi. 保持；依然；留下；剩余；逗留；残存"
    },
    {
        "word": "remainder",
        "definition": "n.  余数，残余；剩余物；其余的人 adj. 剩余的；吃剩的 vt. 廉价出售；削价出售 vi. 廉价出售；削价出售"
    },
    {
        "word": "remark",
        "definition": "n. 注意；言辞 vt. 评论；觉察 vi. 谈论"
    },
    {
        "word": "remarkable",
        "definition": "adj. 卓越的；非凡的；值得注意的"
    },
    {
        "word": "remedy",
        "definition": "n. 补救；治疗；赔偿 vt. 补救；治疗；纠正"
    },
    {
        "word": "remedial",
        "definition": "adj. 治疗的；补救的；矫正的"
    },
    {
        "word": "remember",
        "definition": "vi. 记得，记起 vt. 记得；牢记；纪念；代…问好"
    },
    {
        "word": "remembrance",
        "definition": "n. 回想，回忆；纪念品；记忆力"
    },
    {
        "word": "remind",
        "definition": "vt. 提醒；使想起"
    },
    {
        "word": "reminder",
        "definition": "n. 暗示；提醒的人/物；催单"
    },
    {
        "word": "remote",
        "definition": "n. 远程 adj. 遥远的；偏僻的；疏远的"
    },
    {
        "word": "remove",
        "definition": "n. 移动；距离；搬家 vt. 移动，迁移；开除；调动 vi. 移动，迁移；搬家"
    },
    {
        "word": "removal",
        "definition": "n. 免职；移动；排除；搬迁"
    },
    {
        "word": "render",
        "definition": "n. 打底；交纳；粉刷 vt. 致使；提出；实施；着色；以…回报 vi. 给予补偿"
    },
    {
        "word": "rendering",
        "definition": "n. 翻译；表现；表演；描写；打底；（建筑物等）透视图 vt. 致使；表演；打底（render的ing形式） vi. 给予补偿（render的ing形式）"
    },
    {
        "word": "renew",
        "definition": "vt. 使更新；续借；续费；复兴；重申 vi. 更新；重新开始"
    },
    {
        "word": "renewal",
        "definition": "n. 更新，恢复；复兴；补充；革新；续借；重申"
    },
    {
        "word": "renewable",
        "definition": "n. 再生性能源 adj. 可再生的；可更新的；可继续的"
    },
    {
        "word": "renovate",
        "definition": "vt. 更新；修复；革新；刷新"
    },
    {
        "word": "renovation",
        "definition": "n. 革新；修理；恢复活力"
    },
    {
        "word": "rent",
        "definition": "n. 租金 vt. 出租；租用；租借 vi. 租；出租"
    },
    {
        "word": "rental",
        "definition": "n. 租金收入，租金；租赁 adj. 租赁的；收取租金的"
    },
    {
        "word": "repair",
        "definition": "n. 修理，修补；修补部位 vt. 修理；恢复；补救，纠正 vi. 修理；修复"
    },
    {
        "word": "reparable",
        "definition": "adj. 可修缮的；可补偿的；可挽回的"
    },
    {
        "word": "repay",
        "definition": "vt. 回报；报复；付还 vi. 偿还；报答；报复"
    },
    {
        "word": "repayment",
        "definition": "n. 偿还； 付还"
    },
    {
        "word": "repeat",
        "definition": "n. 重复；副本 vi. 重做；重复发生 vt. 重复；复制；背诵"
    },
    {
        "word": "repetition",
        "definition": "n. 重复；背诵；副本"
    },
    {
        "word": "repetitive",
        "definition": "adj. 重复的"
    },
    {
        "word": "repeatedly",
        "definition": "adv. 反复地；再三地；屡次地"
    },
    {
        "word": "replace",
        "definition": "vt. 取代，代替；替换，更换；归还，偿还；把…放回原处"
    },
    {
        "word": "replacement",
        "definition": "n. 更换；复位；代替者；补充兵员"
    },
    {
        "word": "reply",
        "definition": "n. 回答； 答辩 vt. 回答；答复 vi. 回答； 答辩；回击"
    },
    {
        "word": "report",
        "definition": "n. 报告；报道；成绩单 vt. 报告；报导；使报到 vi. 报告；报到；写报导"
    },
    {
        "word": "reporter",
        "definition": "n. 记者"
    },
    {
        "word": "represent",
        "definition": "vt. 代表；表现；描绘；回忆；再赠送 vi. 代表；提出异议"
    },
    {
        "word": "representation",
        "definition": "n. 代表；表现；表示法；陈述"
    },
    {
        "word": "representative",
        "definition": "n. 代表；典型；众议员 adj. 典型的，有代表性的；代议制的"
    },
    {
        "word": "reproduce",
        "definition": "vt. 复制；再生；生殖；使…在脑海中重现 vi. 复制；繁殖"
    },
    {
        "word": "reproduction",
        "definition": "n. 繁殖，生殖；复制；复制品"
    },
    {
        "word": "reproductive",
        "definition": "adj. 生殖的；再生的；复制的"
    },
    {
        "word": "republic",
        "definition": "n. 共和国；共和政体"
    },
    {
        "word": "republican",
        "definition": "n. 共和党人 adj. 共和党的 共和的"
    },
    {
        "word": "reputation",
        "definition": "n. 名声，名誉；声望"
    },
    {
        "word": "request",
        "definition": "n. 请求；需要 vt. 要求，请求"
    },
    {
        "word": "require",
        "definition": "vt. 需要；要求；命令"
    },
    {
        "word": "requirement",
        "definition": "n. 要求；必要条件；必需品"
    },
    {
        "word": "rescue",
        "definition": "n. 营救；援救；解救 vt. 营救；援救"
    },
    {
        "word": "research",
        "definition": "n. 研究；调查 vt. 研究；调查 vi. 研究；调查 "
    },
    {
        "word": "researcher",
        "definition": "n. 研究员"
    },
    {
        "word": "resemble",
        "definition": "vt. 类似，像"
    },
    {
        "word": "resemblance",
        "definition": "n. 相似；相似之处；相似物；肖像"
    },
    {
        "word": "resent",
        "definition": "vt. 怨恨；愤恨；厌恶"
    },
    {
        "word": "resentment",
        "definition": "n. 愤恨，怨恨"
    },
    {
        "word": "reserve",
        "definition": "n. 储备，储存；自然保护区；预备队；缄默； 储备金 vt. 储备；保留；预约 vi. 预订"
    },
    {
        "word": "reservation",
        "definition": "n. 预约，预订；保留"
    },
    {
        "word": "reserved",
        "definition": "adj. 保留的，预订的；缄默的，冷淡的，高冷的；包租的"
    },
    {
        "word": "reside",
        "definition": "vi. 住，居住；属于"
    },
    {
        "word": "residence",
        "definition": "n. 住宅，住处；居住"
    },
    {
        "word": "resident",
        "definition": "n. 居民；住院医生 adj. 居住的；定居的"
    },
    {
        "word": "residential",
        "definition": "adj. 住宅的；与居住有关的"
    },
    {
        "word": "resign",
        "definition": "n. 辞去职务 vi. 辞职 vt. 辞职；放弃；委托；使听从"
    },
    {
        "word": "resignation",
        "definition": "n. 辞职；放弃；辞职书；顺从"
    },
    {
        "word": "resist",
        "definition": "n.  抗蚀剂；防染剂 vt. 抵抗；忍耐，忍住 vi. 抵抗，抗拒；忍耐"
    },
    {
        "word": "resistance",
        "definition": "n. 阻力；电阻；抵抗；反抗；抵抗力"
    },
    {
        "word": "resistant",
        "definition": "n. 抵抗者 adj. 抵抗的，反抗的；顽固的"
    },
    {
        "word": "resolve",
        "definition": "n. 坚决；决定要做的事 vt. 决定；溶解；使…分解；决心要做… vi. 解决；决心；分解"
    },
    {
        "word": "resolution",
        "definition": "n.  分辨率；决议；解决；决心"
    },
    {
        "word": "resolute",
        "definition": "adj. 坚决的；果断的"
    },
    {
        "word": "resort",
        "definition": "n. 凭借，手段；度假胜地；常去之地 vi. 求助，诉诸；常去；采取某手段或方法"
    },
    {
        "word": "resource",
        "definition": "n. 资源，财力；办法；智谋"
    },
    {
        "word": "resourceful",
        "definition": "adj. 资源丰富的；足智多谋的；机智的"
    },
    {
        "word": "respect",
        "definition": "n. 尊敬，尊重；方面；敬意 vt. 尊敬，尊重；遵守"
    },
    {
        "word": "respectable",
        "definition": "n. 可敬的人 adj. 值得尊敬的；人格高尚的；相当数量的"
    },
    {
        "word": "respectful",
        "definition": "adj. 恭敬的；有礼貌的"
    },
    {
        "word": "respective",
        "definition": "adj. 分别的，各自的"
    },
    {
        "word": "respectively",
        "definition": "adv. 分别地；各自地，独自地"
    },
    {
        "word": "respond",
        "definition": "n. 应答；唱和 vi. 回答；作出反应；承担责任 vt. 以…回答"
    },
    {
        "word": "response",
        "definition": "n. 响应；反应；回答"
    },
    {
        "word": "responsive",
        "definition": "adj. 响应的；应答的；回答的"
    },
    {
        "word": "respondent",
        "definition": "n.  被告；应答者 adj. 回答的；应答的"
    },
    {
        "word": "responsible",
        "definition": "adj. 负责的，可靠的；有责任的"
    },
    {
        "word": "responsibility",
        "definition": "n. 责任，职责；义务"
    },
    {
        "word": "rest",
        "definition": "n. 休息，静止；休息时间；剩余部分；支架 vt. 使休息，使轻松；把…寄托于 vi. 休息；静止；依赖；安置"
    },
    {
        "word": "restaurant",
        "definition": "n. 餐馆； 饭店"
    },
    {
        "word": "restore",
        "definition": "vi. 恢复；还原 vt. 恢复；修复；归还"
    },
    {
        "word": "restoration",
        "definition": "n. 恢复；复位；王政复辟；归还"
    },
    {
        "word": "restrain",
        "definition": "vt. 抑制，控制；约束；制止"
    },
    {
        "word": "restraint",
        "definition": "n. 抑制，克制；约束"
    },
    {
        "word": "restrict",
        "definition": "vt. 限制；约束；限定"
    },
    {
        "word": "restriction",
        "definition": "n. 限制；约束；束缚"
    },
    {
        "word": "restrictive",
        "definition": "n. 限制词 adj. 限制的；限制性的；约束的"
    },
    {
        "word": "result",
        "definition": "n. 结果；成绩；答案；比赛结果 vi. 结果；导致；产生"
    },
    {
        "word": "resultant",
        "definition": "n. 合力；结果； 生成物 adj. 结果的；合成的"
    },
    {
        "word": "resume",
        "definition": "n. 摘要； 履历，简历 vi. 重新开始，继续 vt. 重新开始，继续；恢复，重新占用"
    },
    {
        "word": "resumption",
        "definition": "n. 恢复；重新开始；取回；重获；恢复硬币支付"
    },
    {
        "word": "résumé",
        "definition": ""
    },
    {
        "word": "retail",
        "definition": "n. 零售 adj. 零售的 vt. 零售；转述 adv. 以零售方式 vi. 零售"
    },
    {
        "word": "retailer",
        "definition": "n. 零售商；传播的人"
    },
    {
        "word": "retain",
        "definition": "vt. 保持；雇；记住"
    },
    {
        "word": "retention",
        "definition": "n. 保留；扣留，滞留；记忆力；闭尿"
    },
    {
        "word": "retell",
        "definition": "vt. 复述；再讲；重述"
    },
    {
        "word": "retelling",
        "definition": "n. 复述；复述法 v. 复述；再讲（retell的ing形式）"
    },
    {
        "word": "retire",
        "definition": "n. 退休；退隐；退兵信号 vi. 退休；撤退；退却 vt. 退休；离开；收回"
    },
    {
        "word": "retirement",
        "definition": "n. 退休，退役"
    },
    {
        "word": "retired",
        "definition": "adj. 退休的；退役的；幽闭的 v. 退休（retire的过去分词）"
    },
    {
        "word": "retreat",
        "definition": "n. 撤退；休息寓所；撤退 vt. 退（棋）；使后退 vi. 撤退；退避；向后倾"
    },
    {
        "word": "return",
        "definition": "vi. 返回；报答 adj. 报答的；回程的；返回的 vt. 返回；报答 n. 返回；归还；回球"
    },
    {
        "word": "reunite",
        "definition": "vi. 重聚；再结合；再联合 vt. 使重聚；使再结合；使再联合"
    },
    {
        "word": "reunification",
        "definition": "n. 重新统一；重新团结"
    },
    {
        "word": "reunion",
        "definition": "n. 重聚；（班级或学校的）同学会，同窗会"
    },
    {
        "word": "reveal",
        "definition": "n. 揭露；暴露；门侧，窗侧 vt. 显示；透露；揭露；泄露"
    },
    {
        "word": "revelation",
        "definition": "n. 启示；揭露；出乎意料的事；被揭露的真相"
    },
    {
        "word": "revenue",
        "definition": "n. 税收，国家的收入；收益"
    },
    {
        "word": "reverse",
        "definition": "n. 背面；相反；倒退；失败 adj. 反面的；颠倒的；反身的 vt. 颠倒；倒转 vi. 倒退；逆叫"
    },
    {
        "word": "reversal",
        "definition": "n. 逆转； 反转； 撤销"
    },
    {
        "word": "reversible",
        "definition": "adj. 可逆的；可撤消的；可反转的 n. 双面布料"
    },
    {
        "word": "review",
        "definition": "n. 回顾；复习；评论；检讨；检阅 vt. 回顾；检查；复审 vi. 回顾；复习功课；写评论"
    },
    {
        "word": "reviewer",
        "definition": "n. 评论者，评论家"
    },
    {
        "word": "revise",
        "definition": "n. 修订；校订 vi. 修订；校订；复习功课 vt. 修正；复习；校订"
    },
    {
        "word": "revision",
        "definition": "n.  修正；复习；修订本"
    },
    {
        "word": "revolution",
        "definition": "n. 革命；旋转；运行；循环"
    },
    {
        "word": "revolutionary",
        "definition": "n. 革命者 adj. 革命的；旋转的；大变革的"
    },
    {
        "word": "revolve",
        "definition": "n. 旋转；循环；旋转舞台 vt. 使…旋转；使…循环；反复考虑 vi. 旋转；循环出现；反复考虑"
    },
    {
        "word": "reward",
        "definition": "n.  报酬；报答；酬谢 vt.  奖励；奖赏"
    },
    {
        "word": "rewarding",
        "definition": "adj. 有益的，值得的；有报酬的，报答的"
    },
    {
        "word": "rhythm",
        "definition": "n. 节奏；韵律"
    },
    {
        "word": "rhythmic",
        "definition": "n. 韵律论（等于rhythmics） adj.  有节奏的（等于rhythmical）；间歇的；合拍的"
    },
    {
        "word": "rib",
        "definition": "n. 肋骨；排骨；肋状物 vt. 戏弄；装肋于"
    },
    {
        "word": "ribbon",
        "definition": "n. 带；缎带；（勋章等的）绶带；带状物；勋表 vt. 把…撕成条带；用缎带装饰 vi. 形成带状"
    },
    {
        "word": "rice",
        "definition": "n. 稻；米饭 vt. 把…捣成米糊状"
    },
    {
        "word": "rich",
        "definition": "adj. 富有的；肥沃的；昂贵的 adj. 油腻的，含有很多脂肪"
    },
    {
        "word": "rid",
        "definition": "vt. 使摆脱；使去掉"
    },
    {
        "word": "riddle",
        "definition": "n. 谜语；粗筛；谜一般的人、东西、事情等 vt. 解谜；给...出谜；充满于 vi. 出谜"
    },
    {
        "word": "ride",
        "definition": "n. 骑；乘坐；交通工具；可供骑行的路；（乘坐汽车等的）旅行；乘骑；（乘车或骑车的）短途旅程；供乘骑的游乐设施 vi. 骑马；乘车；依靠；漂浮 vt. 骑；乘；控制；（骑马、自行车等）穿越；搭乘；飘浮"
    },
    {
        "word": "rider",
        "definition": "n. 骑手；附文；扶手"
    },
    {
        "word": "ridicule",
        "definition": "n. 嘲笑；笑柄；愚弄 vt. 嘲笑；嘲弄；愚弄"
    },
    {
        "word": "ridiculous",
        "definition": "adj. 可笑的；荒谬的"
    },
    {
        "word": "rifle",
        "definition": "n. 步枪；来复枪 vt. 用步枪射击；抢夺；偷走"
    },
    {
        "word": "right",
        "definition": "n. 正确；右边；正义 adj. 正确的；直接的；右方的 vt. 纠正 adv. 正确地；恰当地；彻底地 vi. 复正；恢复平稳"
    },
    {
        "word": "ring",
        "definition": "n. 戒指；铃声，钟声；拳击场；环形物 vi. 按铃；敲钟；回响；成环形 vt. 按铃；包围；敲钟；套住"
    },
    {
        "word": "riot",
        "definition": "n. 暴乱；放纵；蔓延 vt. 浪费，挥霍 vi. 骚乱；放荡"
    },
    {
        "word": "riotous",
        "definition": "adj. 暴乱的；狂欢的；不受约束的；放荡的；茂盛的"
    },
    {
        "word": "rip",
        "definition": "n. 裂口，裂缝 vi. 裂开，被撕裂 vt. 撕；锯"
    },
    {
        "word": "ripe",
        "definition": "adj. 熟的，成熟的；时机成熟的 vt. 搜查；调查 vi. 进行搜查"
    },
    {
        "word": "ripen",
        "definition": "vt. 使成熟 vi. 成熟"
    },
    {
        "word": "rise",
        "definition": "n. 上升；高地；增加；出现 vt. 使…飞起；使…浮上水面 vi. 上升；增强；起立；高耸"
    },
    {
        "word": "risk",
        "definition": "n. 风险；危险；冒险 vt. 冒…的危险"
    },
    {
        "word": "risky",
        "definition": "adj. 危险的；冒险的；（作品等）有伤风化的"
    },
    {
        "word": "rival",
        "definition": "n. 对手；竞争者 adj. 竞争的 vt. 与…竞争；比得上某人 vi. 竞争"
    },
    {
        "word": "rivalry",
        "definition": "n. 竞争；对抗；竞赛"
    },
    {
        "word": "river",
        "definition": "n. 河，江"
    },
    {
        "word": "road",
        "definition": "n. 公路，马路；道路；手段 adj. （美）巡回的 vt. （狗）沿臭迹追逐（猎物）"
    },
    {
        "word": "roar",
        "definition": "n. 咆哮；吼；轰鸣 vi. 咆哮；吼叫；喧闹 vt. 咆哮；呼喊；使……轰鸣"
    },
    {
        "word": "roast",
        "definition": "n. 烤肉；烘烤 adj. 烘烤的；烤过的 vt. 烤，焙；烘，烘烤；暴露于某种热力下以得温暖 vi. 烤；烘"
    },
    {
        "word": "rob",
        "definition": "vt. 抢劫；使…丧失；非法剥夺 vi. 抢劫；掠夺"
    },
    {
        "word": "robbery",
        "definition": "n. 抢劫，盗窃；抢掠"
    },
    {
        "word": "robot",
        "definition": "n. 机器人；遥控设备，自动机械；机械般工作的人"
    },
    {
        "word": "robotic",
        "definition": "n. 机器人学 adj. 机器人的，像机器人的；自动的"
    },
    {
        "word": "rock",
        "definition": "n. 岩石；摇滚乐；暗礁 vt. 摇动；使摇晃 vi. 摇动；摇晃"
    },
    {
        "word": "rocky",
        "definition": "adj. 岩石的，多岩石的；坚如岩石的；摇晃的；头晕目眩的"
    },
    {
        "word": "rocket",
        "definition": "n. 火箭 vt. 用火箭运载 vi. 飞驰，飞快地移动；迅速增加"
    },
    {
        "word": "rod",
        "definition": "n. 棒；惩罚；枝条；权力"
    },
    {
        "word": "role",
        "definition": "n. 角色；任务"
    },
    {
        "word": "roll",
        "definition": "n. 卷，卷形物；名单；摇晃 vt. 卷；滚动，转动；辗 vi. 卷；滚动；转动；起伏，摇晃"
    },
    {
        "word": "roller",
        "definition": "n.  滚筒； 滚轴；辊子；滚转机"
    },
    {
        "word": "romance",
        "definition": "n. 传奇；浪漫史；风流韵事；冒险故事 vi. 虚构；渲染；写传奇"
    },
    {
        "word": "romantic",
        "definition": "n. 浪漫的人 adj. 浪漫的；多情的；空想的 vt. 使…浪漫化"
    },
    {
        "word": "roof",
        "definition": "n. 屋顶；最高处，顶部；最高限度 vt. 给…盖屋顶，覆盖"
    },
    {
        "word": "room",
        "definition": "n. 房间；空间；余地；机会；房间里所有的人 vt. 为…提供住处；租房，合住；投宿，住宿；留…住宿 vi. 居住；住宿"
    },
    {
        "word": "root",
        "definition": "n. 根；根源；词根；祖先 vt. 生根，固定；根源在于 vi. 生根；根除"
    },
    {
        "word": "rope",
        "definition": "n. 绳，绳索 vt. 捆，绑 vi. 拧成绳状"
    },
    {
        "word": "rose",
        "definition": "n. 玫瑰；粉红色；蔷薇（花）；粉红色的葡萄酒 adj. 玫瑰花的；玫瑰色的；粉红色的；带有玫瑰香味的 vt. 使成玫瑰色，使（面颊）发红；使有玫瑰香味 vi. 起义( rise的过去式)；升起；（数量）增加；休会"
    },
    {
        "word": "rosy",
        "definition": "adj. 蔷薇色的，玫瑰红色的；美好的；乐观的；涨红脸的"
    },
    {
        "word": "rough",
        "definition": "n. 艰苦；高低不平的地面；未经加工的材料；粗糙的部分 adj. 粗糙的；粗略的；粗野的；艰苦的；未经加工的 vt. 使粗糙；粗暴对待；草拟 adv. 粗糙地；粗略地；粗暴地 vi. 举止粗野"
    },
    {
        "word": "roughly",
        "definition": "adv. 粗糙地；概略地"
    },
    {
        "word": "round",
        "definition": "n. 圆；循环；一回合；圆形物 prep. 附近；绕过；大约；在…周围 adj. 圆的；完全的；大概的；肥胖的 vt. 完成；围捕；绕行；弄圆 adv. 在周围；迂回地；朝反方向；挨个 vi. 进展；变圆；环行；发胖"
    },
    {
        "word": "rouse",
        "definition": "n. 觉醒；奋起 vt. 唤醒；激起，使振奋；惊起 vi. 醒来；奋起"
    },
    {
        "word": "route",
        "definition": "n. 路线；航线；通道 vt. 按某路线发送"
    },
    {
        "word": "routine",
        "definition": "n.  程序；日常工作；例行公事 adj. 日常的；例行的"
    },
    {
        "word": "row",
        "definition": "n. 行，排；划船；街道；吵闹 vt. 划船；使……成排 vi. 划船；争吵"
    },
    {
        "word": "royal",
        "definition": "n. 王室；王室成员 adj. 皇家的；盛大的；女王的；高贵的；第一流的"
    },
    {
        "word": "royalty",
        "definition": "n. 皇室；版税；王权；专利税"
    },
    {
        "word": "rub",
        "definition": "n. 摩擦；障碍；磨损处 vt. 擦；摩擦；惹怒 vi. 擦；摩擦；擦破"
    },
    {
        "word": "rubber",
        "definition": "n. 橡胶；橡皮；合成橡胶；按摩师 adj. 橡胶制成的 vt. 涂橡胶于；用橡胶制造 vi. 扭转脖子看；好奇地引颈而望"
    },
    {
        "word": "rubbish",
        "definition": "n. 垃圾，废物；废话 adj. 毫无价值的"
    },
    {
        "word": "rude",
        "definition": "adj. 粗鲁的；无礼的；狂暴的；未开化的"
    },
    {
        "word": "rug",
        "definition": "n. 小地毯；毛皮地毯；男子假发"
    },
    {
        "word": "ruin",
        "definition": "n. 废墟；毁坏；灭亡 vt. 毁灭；使破产 vi. 破产；堕落；被毁灭"
    },
    {
        "word": "ruinous",
        "definition": "adj. 破坏性的，毁灭性的；零落的"
    },
    {
        "word": "rule",
        "definition": "n. 统治；规则 vt. 统治；规定；管理；裁决；支配 vi. 统治；管辖；裁定"
    },
    {
        "word": "ruler",
        "definition": "n. 尺；统治者； 划线板，划线的人"
    },
    {
        "word": "ruling",
        "definition": "n. 统治，支配；裁定 adj. 统治的；主要的；支配的；流行的，普遍的"
    },
    {
        "word": "rumor",
        "definition": "n. 谣言；传闻 vt. 谣传；传说"
    },
    {
        "word": "rumour",
        "definition": "n. 谣言 vt. 传闻"
    },
    {
        "word": "run",
        "definition": "n. 奔跑；赛跑；趋向；奔跑的路程 vt. 管理，经营；运行；参赛 vi. 经营；奔跑；运转"
    },
    {
        "word": "runner",
        "definition": "n. 跑步者；走私者；推销员；送信人"
    },
    {
        "word": "running",
        "definition": "n. 运转；赛跑；流出 v. 跑；运转（run的ing形式）；行驶 adj. 连续的；流动的；跑着的；运转着的"
    },
    {
        "word": "runway",
        "definition": "n. 跑道；河床；滑道"
    },
    {
        "word": "rural",
        "definition": "adj. 农村的，乡下的；田园的，有乡村风味的"
    },
    {
        "word": "rush",
        "definition": "n. 冲进；匆促；急流；灯心草 adj. 急需的 vt. 使冲；突袭；匆忙地做；飞跃 vi. 冲；奔；闯；赶紧；涌现"
    },
    {
        "word": "sack",
        "definition": "n. 麻布袋；洗劫 vt. 解雇；把……装入袋；劫掠"
    },
    {
        "word": "sacrifice",
        "definition": "n. 牺牲；祭品；供奉 vt. 牺牲；献祭；亏本出售 vi. 献祭；奉献"
    },
    {
        "word": "sacrificial",
        "definition": "adj. 牺牲的；献祭的"
    },
    {
        "word": "sad",
        "definition": "adj. 难过的；悲哀的，令人悲痛的；凄惨的，阴郁的（形容颜色）"
    },
    {
        "word": "sadness",
        "definition": "n. 悲哀"
    },
    {
        "word": "sadden",
        "definition": "vt. 使悲伤，使难过；使黯淡 vi. 悲哀；悲痛"
    },
    {
        "word": "safe",
        "definition": "n. 保险箱；冷藏室；纱橱 adj. 安全的；可靠的；平安的"
    },
    {
        "word": "safety",
        "definition": "n. 安全；保险；安全设备；保险装置；安打"
    },
    {
        "word": "sail",
        "definition": "n. 帆，篷；航行 vi. 航行；启航，开船 vt. 航行"
    },
    {
        "word": "sailing",
        "definition": "n. 航行，航海；启航；航海术 v. 航行，起航（sail的现在分词形式） adj. 航行的"
    },
    {
        "word": "sailor",
        "definition": "n. 水手，海员；乘船者"
    },
    {
        "word": "saint",
        "definition": ""
    },
    {
        "word": "sake",
        "definition": "n. 目的；利益；理由；日本米酒"
    },
    {
        "word": "salad",
        "definition": "n. 色拉；尤指莴苣"
    },
    {
        "word": "salary",
        "definition": "n. 薪水 vt. 给...加薪；给...薪水"
    },
    {
        "word": "sale",
        "definition": "n. 销售；出售；拍卖；销售额；廉价出售"
    },
    {
        "word": "salesman",
        "definition": "n. 推销员；售货员"
    },
    {
        "word": "salt",
        "definition": "n. 盐；风趣，刺激性 adj. 咸水的；含盐的，咸味的；盐腌的；猥亵的 vt. 用盐腌；给…加盐；将盐撒在道路上使冰或雪融化"
    },
    {
        "word": "salty",
        "definition": "adj. 咸的；含盐的"
    },
    {
        "word": "same",
        "definition": "adj. 相同的；同一的；上述的（通常与the连用）；无变化的 adv. 同样地（通常与the连用） pron. 同样的事物或人（通常与the连用）"
    },
    {
        "word": "sample",
        "definition": "n. 样品；样本；例子 adj. 试样的，样品的；作为例子的 vt. 取样；尝试；抽样检查"
    },
    {
        "word": "sand",
        "definition": "n. 沙；沙地；沙洲；沙滩；沙子 vt. 撒沙于；以沙掩盖；用砂纸等擦平或磨光某物；使撒沙似地布满；给…掺沙子 vi. 被沙堵塞"
    },
    {
        "word": "sandwich",
        "definition": "n. 三明治；夹心面包 vt. 夹入；挤进；把...做成三明治"
    },
    {
        "word": "satellite",
        "definition": "n. 卫星；人造卫星；随从；卫星国家"
    },
    {
        "word": "satisfy",
        "definition": "vi. 令人满意；令人满足 vt. 满足；说服，使相信；使满意，使高兴"
    },
    {
        "word": "satisfaction",
        "definition": "n. 满意，满足；赔偿；乐事；赎罪"
    },
    {
        "word": "satisfactory",
        "definition": "adj. 满意的；符合要求的；赎罪的"
    },
    {
        "word": "Saturday",
        "definition": "n. 星期六"
    },
    {
        "word": "sauce",
        "definition": "n. 酱油；沙司；调味汁 vt. 使增加趣味；给…调味"
    },
    {
        "word": "sausage",
        "definition": "n. 香肠；腊肠；装香肠的碎肉"
    },
    {
        "word": "save",
        "definition": "prep. 除...之外 n. 救援 vi. 节省；挽救 vt. 节省；保存；储蓄；解救"
    },
    {
        "word": "saving",
        "definition": "n. 节约；挽救；存款 prep. 考虑到；除...之外 adj. 节约的；挽救的；补偿的；保留的"
    },
    {
        "word": "say",
        "definition": "vt. 讲；说明；例如；声称；假设；指明 vi. 讲；表示；念；假定；背诵"
    },
    {
        "word": "saying",
        "definition": "n. 话；谚语；言论 v. 说（say的ing形式）"
    },
    {
        "word": "scale",
        "definition": "n. 规模；比例；鳞；刻度；天平；数值范围 vt. 测量；攀登；刮鳞；依比例决定 vi. 衡量；攀登；剥落；生水垢"
    },
    {
        "word": "scan",
        "definition": "n. 扫描；浏览；审视；细看 vt. 扫描；浏览；细看；详细调查；标出格律 vi. 扫描；扫掠"
    },
    {
        "word": "scanner",
        "definition": "n.  扫描仪；扫描器；光电子扫描装置"
    },
    {
        "word": "scandal",
        "definition": "n. 丑闻；流言蜚语；诽谤；公愤"
    },
    {
        "word": "scandalous",
        "definition": "adj. 可耻的；诽谤性的"
    },
    {
        "word": "scar",
        "definition": "n. 创伤；伤痕 vt. 伤害；给留下伤痕 vi. 结疤；痊愈"
    },
    {
        "word": "scarce",
        "definition": "adj. 缺乏的，不足的；稀有的 adv. 仅仅；几乎不；几乎没有"
    },
    {
        "word": "scarcity",
        "definition": "n. 不足；缺乏"
    },
    {
        "word": "scarcely",
        "definition": "adv. 几乎不，简直不；简直没有"
    },
    {
        "word": "scare",
        "definition": "n. 恐慌；惊吓；惊恐 vt. 惊吓；把…吓跑 adj. （美）骇人的 vi. 受惊"
    },
    {
        "word": "scary",
        "definition": "adj. （事物）可怕的；恐怖的；吓人的；（人）提心吊胆的；引起惊慌的；胆小的"
    },
    {
        "word": "scatter",
        "definition": "n. 分散；散播，撒播 vt. 使散射；使散开，使分散；使散播，使撒播 vi. 分散，散开；散射"
    },
    {
        "word": "scene",
        "definition": "n. 场面；情景；景象；事件"
    },
    {
        "word": "scenery",
        "definition": "n. 风景；景色；舞台布景"
    },
    {
        "word": "scenic",
        "definition": "n. 风景胜地；风景照片 adj. 风景优美的；舞台的；戏剧的"
    },
    {
        "word": "scent",
        "definition": "n. 气味；嗅觉；痕迹；察觉能力 vt. 闻到；发觉；使充满…的气味；循着遗臭追踪 vi. 发出…的气味；有…的迹象；嗅着气味追赶"
    },
    {
        "word": "schedule",
        "definition": "n. 时间表；计划表；一览表 vt. 安排，计划；编制目录；将……列入计划表"
    },
    {
        "word": "scheme",
        "definition": "n. 计划；组合；体制；诡计 vt. 计划；策划 vi. 搞阴谋；拟订计划"
    },
    {
        "word": "scholar",
        "definition": "n. 学者；奖学金获得者"
    },
    {
        "word": "scholarly",
        "definition": "adj. 博学的；学者风度的；学者派头的"
    },
    {
        "word": "scholarship",
        "definition": "n. 奖学金；学识，学问"
    },
    {
        "word": "scholastic",
        "definition": "adj. 学校的；学者的；学术的（等于scholastical） n. 学者；学生；墨守成规者；经院哲学家"
    },
    {
        "word": "school",
        "definition": "n. 学校；学院；学派；鱼群 vt. 教育"
    },
    {
        "word": "schooling",
        "definition": "n. 学校教育；学费 v. 教育（school的ing形式）；培养"
    },
    {
        "word": "science",
        "definition": "n. 科学；技术；学科；理科"
    },
    {
        "word": "scientific",
        "definition": "adj. 科学的，系统的"
    },
    {
        "word": "scientist",
        "definition": "n. 科学家"
    },
    {
        "word": "scissors",
        "definition": "n. 剪刀；剪式跳法 v. 剪开；删除（scissor的第三人称单数）"
    },
    {
        "word": "scold",
        "definition": "n. 责骂；爱责骂的人 vt. 骂；责骂 vi. 责骂；叱责"
    },
    {
        "word": "scope",
        "definition": "n. 范围；余地；视野；眼界；导弹射程 vt. 审视"
    },
    {
        "word": "score",
        "definition": "n. 分数；二十；配乐；刻痕 vt. 获得；评价；划线，刻划；把…记下 vi. 得分；记分；刻痕"
    },
    {
        "word": "scout",
        "definition": "n. 搜索，侦察；侦察员；侦察机 vt. 侦察；跟踪，监视；发现 vi. 侦察；巡视；嘲笑"
    },
    {
        "word": "scratch",
        "definition": "n. 擦伤；抓痕；刮擦声；乱写 adj. 打草稿用的；凑合的；碰巧的 vt. 抓；刮；挖出；乱涂 vi. 抓；搔；发刮擦声；勉强糊口；退出比赛"
    },
    {
        "word": "scream",
        "definition": "n. 尖叫声；尖锐刺耳的声音；极其滑稽可笑的人 vi. 尖叫；呼啸；发出尖锐刺耳的声音；令人触目惊心 vt. 尖声喊叫；大叫大嚷着要求"
    },
    {
        "word": "screen",
        "definition": "n. 屏，幕；屏风 vt. 筛；拍摄；放映；掩蔽 vi. 拍电影"
    },
    {
        "word": "screw",
        "definition": "n. 螺旋；螺丝钉；吝啬鬼 vt. 旋，拧；压榨；强迫 vi. 转动，拧"
    },
    {
        "word": "script",
        "definition": "n. 脚本；手迹；书写用的字母 vt. 把…改编为剧本 vi. 写电影脚本"
    },
    {
        "word": "scripture",
        "definition": "n. （大写）圣经；手稿；（大写）圣经的一句"
    },
    {
        "word": "sea",
        "definition": "n. 海；海洋；许多；大量"
    },
    {
        "word": "seal",
        "definition": "n. 密封；印章；海豹；封条；标志 vt. 密封；盖章 vi. 猎海豹"
    },
    {
        "word": "search",
        "definition": "n. 搜寻；探究，查究 vt. 搜索；搜寻；调查；搜查；探求 vi. 搜寻；调查；探求"
    },
    {
        "word": "season",
        "definition": "n. 时期；季节；赛季 vt. 给…调味；使适应 vi. 变得成熟；变干燥"
    },
    {
        "word": "seasonal",
        "definition": "adj. 季节的；周期性的；依照季节的"
    },
    {
        "word": "seat",
        "definition": "n. 座位；所在地；职位 vt. 使…坐下；可容纳…的；使就职"
    },
    {
        "word": "second",
        "definition": "num. 第二 n. 秒；第二名；瞬间；二等品 adj. 第二的；次要的；附加的 vt. 支持 adv. 第二；其次；居第二位"
    },
    {
        "word": "secondary",
        "definition": "n. 副手；代理人 adj. 第二的；中等的；次要的；中级的"
    },
    {
        "word": "second-hand",
        "definition": "adj. 旧的，二手的 adv. 间接地，第二手地"
    },
    {
        "word": "secret",
        "definition": "n. 秘密；秘诀；机密 adj. 秘密的；机密的"
    },
    {
        "word": "secrecy",
        "definition": "n. 保密；秘密；隐蔽"
    },
    {
        "word": "secretive",
        "definition": "adj. 秘密的；偷偷摸摸的；促进分泌的"
    },
    {
        "word": "secretary",
        "definition": "n. 秘书；书记；部长；大臣"
    },
    {
        "word": "secretarial",
        "definition": "adj. 秘书的；书记的；部长的"
    },
    {
        "word": "section",
        "definition": "n. 截面；部分；部门；地区；章节 vt. 把…分段；将…切片；对…进行划分 vi. 被切割成片；被分成部分"
    },
    {
        "word": "sector",
        "definition": "n. 部门；扇形，扇区；象限仪；函数尺 vt. 把…分成扇形"
    },
    {
        "word": "secure",
        "definition": "vt. 保护；弄到；招致；缚住 adj. 安全的；无虑的；有把握的；稳当的 vi. 获得安全；船抛锚；停止工作"
    },
    {
        "word": "security",
        "definition": "n. 安全；保证；证券；抵押品 adj. 安全的；保安的；保密的"
    },
    {
        "word": "see",
        "definition": "vi. 看；看见；领会 vt. 看见；理解；领会"
    },
    {
        "word": "seed",
        "definition": "n. 种子；根据；精液；萌芽；子孙；原由 vt. 播种；结实；成熟；去…籽 vi. 播种；（植物）结实"
    },
    {
        "word": "seedling",
        "definition": "n. 秧苗，幼苗；树苗"
    },
    {
        "word": "seek",
        "definition": "vt. 寻求；寻找；探索；搜索 vi. 寻找；探索；搜索"
    },
    {
        "word": "seem",
        "definition": "vi. 似乎；像是；装作"
    },
    {
        "word": "seeming",
        "definition": "n. 外观 adj. 表面上的"
    },
    {
        "word": "seemingly",
        "definition": "adv. 看来似乎；表面上看来"
    },
    {
        "word": "segment",
        "definition": "n. 段；部分 vt. 分割 vi. 分割"
    },
    {
        "word": "segmental",
        "definition": "adj. 部分的"
    },
    {
        "word": "seize",
        "definition": "vt. 抓住；夺取；理解；逮捕 vi. 抓住；利用；（机器）卡住"
    },
    {
        "word": "seizure",
        "definition": "n. 没收；夺取；捕获；（疾病的）突然发作"
    },
    {
        "word": "seldom",
        "definition": "adv. 很少，不常"
    },
    {
        "word": "select",
        "definition": "n. 被挑选者；精萃 adj. 精选的；挑选出来的；极好的 vt. 挑选；选拔 vi. 挑选"
    },
    {
        "word": "selection",
        "definition": "n. 选择，挑选；选集；精选品"
    },
    {
        "word": "selective",
        "definition": "adj. 选择性的 讲究的 有选择地 有选择性地 仔细挑选地"
    },
    {
        "word": "self",
        "definition": "n. 自己，自我；本质；私心 adj. 同一的 vt. 使自花授精；使近亲繁殖 vi. 自花授精"
    },
    {
        "word": "selfish",
        "definition": "adj. 自私的；利己主义的"
    },
    {
        "word": "selfless",
        "definition": "adj. 无私的；不考虑自己的"
    },
    {
        "word": "sell",
        "definition": "n. 销售；失望；推销术 vt. 销售；推销；出卖；欺骗 vi. 卖；出售；受欢迎；有销路"
    },
    {
        "word": "semester",
        "definition": "n. 学期；半年"
    },
    {
        "word": "seminar",
        "definition": "n. 讨论会，研讨班"
    },
    {
        "word": "senate",
        "definition": "n. 参议院，上院；（古罗马的）元老院"
    },
    {
        "word": "senator",
        "definition": "n. 参议员；（古罗马的）元老院议员；评议员，理事"
    },
    {
        "word": "send",
        "definition": "n. 上升运动 vi. 派人；寄信 vt. 发送，寄；派遣；使进入；发射"
    },
    {
        "word": "senior",
        "definition": "n. 上司；较年长者；毕业班学生 adj. 高级的；年长的；地位较高的；年资较深的，资格较老的"
    },
    {
        "word": "seniority",
        "definition": "n. 长辈；老资格；前任者的特权"
    },
    {
        "word": "sense",
        "definition": "n. 感觉，功能；观念；道理；理智 vt. 感觉到；检测"
    },
    {
        "word": "sensible",
        "definition": "n. 可感觉到的东西; 敏感的人; adj. 明智的; 通情达理的; 合乎情理的; 意识到的，能感觉到的;"
    },
    {
        "word": "sensor",
        "definition": "n. 传感器"
    },
    {
        "word": "sensitive",
        "definition": "adj. 敏感的；感觉的； 灵敏的；感光的；易受伤害的；易受影响的 n. 敏感的人；有灵异能力的人"
    },
    {
        "word": "sensitivity",
        "definition": "n. 敏感；敏感性；过敏"
    },
    {
        "word": "sentence",
        "definition": "n.  句子，命题；宣判，判决 vt. 判决，宣判"
    },
    {
        "word": "separate",
        "definition": "n. .分开；抽印本 adj. 单独的；分开的；不同的；各自的； vt. 使分离；使分开；使分居 vi. 分开；隔开；分居"
    },
    {
        "word": "separation",
        "definition": "n. 分离，分开；间隔，距离； 分居；缺口"
    },
    {
        "word": "separatist",
        "definition": "n. 分离主义者；独立派 adj. 分离主义者的"
    },
    {
        "word": "September",
        "definition": "n. 九月"
    },
    {
        "word": "sequence",
        "definition": "n.  序列；顺序；续发事件 vt. 按顺序排好"
    },
    {
        "word": "sequential",
        "definition": "adj. 连续的；相继的；有顺序的"
    },
    {
        "word": "series",
        "definition": "n. 系列，连续； 串联；级数；丛书"
    },
    {
        "word": "serious",
        "definition": "adj. 严肃的，严重的；认真的；庄重的；危急的"
    },
    {
        "word": "servant",
        "definition": "n. 仆人，佣人；公务员；雇工"
    },
    {
        "word": "serve",
        "definition": "n. 发球，轮到发球 vi. 服役，服务；适合，足够；发球；招待，侍候 vt. 招待，供应；为…服务；对…有用；可作…用"
    },
    {
        "word": "service",
        "definition": "n. 服务，服侍；服役；仪式 adj. 服务性的；耐用的；服现役的 vt. 维修，检修；保养"
    },
    {
        "word": "serving",
        "definition": "n. 服务；上菜；一份食物 v. 服务（serve的ing形式） adj. 用于上菜的"
    },
    {
        "word": "session",
        "definition": "n. 会议；（法庭的）开庭；（议会等的）开会；学期；讲习会"
    },
    {
        "word": "set",
        "definition": "n.  集合；一套；布景； 装置 adj. 固定的；规定的；固执的 vi. (日,月)落沉；凝固；结果 vt. 树立；点燃；点缀；"
    },
    {
        "word": "setback",
        "definition": "n. 挫折；退步；逆流"
    },
    {
        "word": "setting",
        "definition": "n. 环境；安装；布置； 沉落 v. 放置；沉没；使…处于某位置（set的ing形式）"
    },
    {
        "word": "settle",
        "definition": "n. 有背长椅 vi. 解决；定居；沉淀；下陷 vt. 解决；安排；使…定居"
    },
    {
        "word": "settlement",
        "definition": "n. 解决，处理； 结算；沉降；殖民"
    },
    {
        "word": "seven",
        "definition": "num. 七个，七 n. 七个，七 adj. 七的；七个的"
    },
    {
        "word": "seventeen",
        "definition": "n. 十七，十七个 num. 十七 adj. 十七岁的；十七的，十七个的"
    },
    {
        "word": "seventy",
        "definition": "n. 七十；七十个；七十岁；七十年代 num. 七十 adj. 七十的；七十个的；七十岁的"
    },
    {
        "word": "several",
        "definition": "adj. 几个的；各自的 pron. 几个；数个"
    },
    {
        "word": "severe",
        "definition": "adj. 严峻的；严厉的；剧烈的；苛刻的"
    },
    {
        "word": "severity",
        "definition": "n. 严重；严格；猛烈"
    },
    {
        "word": "sew",
        "definition": "vt. 缝合，缝上；缝纫 vi. 缝纫，缝"
    },
    {
        "word": "sex",
        "definition": "n. 性；性别；性行为；色情 vt. 引起…的性欲；区别…的性别"
    },
    {
        "word": "sexy",
        "definition": "adj. 性感的；迷人的；色情的"
    },
    {
        "word": "sexual",
        "definition": "adj. 性的；性别的；有性的"
    },
    {
        "word": "shade",
        "definition": "n. 树荫；阴影；阴凉处；遮阳物；（照片等的）明暗度；少量、些微；细微的差别 vt. 使阴暗；使渐变；为…遮阳；使阴郁；掩盖 vi. （颜色、色彩等）渐变"
    },
    {
        "word": "shady",
        "definition": "adj. 成荫的；阴暗的；名声不好的"
    },
    {
        "word": "shadow",
        "definition": "n. 阴影；影子；幽灵；庇护；隐蔽处 adj. 影子内阁的 vt. 遮蔽；使朦胧；尾随；预示 vi. 渐变；变阴暗"
    },
    {
        "word": "shake",
        "definition": "n. 摇动；哆嗦 vt. 动摇；摇动；震动；握手 vi. 动摇；摇动；发抖"
    },
    {
        "word": "shaky",
        "definition": "adj. 摇晃的；不可靠的；不坚定的"
    },
    {
        "word": "shall",
        "definition": "aux. 应；会；将；必须"
    },
    {
        "word": "shallow",
        "definition": "n.  浅滩 adj. 浅的；肤浅的 vt. 使变浅 vi. 变浅"
    },
    {
        "word": "shame",
        "definition": "n. 羞耻，羞愧；憾事，带来耻辱的人 vt. 使丢脸，使羞愧"
    },
    {
        "word": "shameful",
        "definition": "adj. 可耻的；不体面的；不道德的；猥亵的"
    },
    {
        "word": "shameless",
        "definition": "adj. 无耻的；不要脸的；伤风败俗的"
    },
    {
        "word": "shape",
        "definition": "n. 形状；模型；身材；具体化 vt. 形成；塑造，使成形；使符合 vi. 形成；成形；成长"
    },
    {
        "word": "share",
        "definition": "n. 份额；股份 vt. 分享，分担；分配 vi. 共享；分担"
    },
    {
        "word": "sharp",
        "definition": "n. 尖头；骗子；内行 adj. 急剧的；锋利的；强烈的；敏捷的；刺耳的 vt. 磨快；把音调升高 adv. 急剧地；锐利地；突然地 vi. 打扮；升音演奏"
    },
    {
        "word": "sharpen",
        "definition": "vt. 削尖；磨快；使敏捷；加重 vi. 尖锐；变锋利"
    },
    {
        "word": "shave",
        "definition": "vi. 剃须，剃毛 vt. 剃，削去；修剪；切成薄片；掠 n. 刮脸，剃胡子；修面；<口>侥幸逃过，幸免；剃刀，刮刀"
    },
    {
        "word": "shaver",
        "definition": "n. 理发师；电动剃刀"
    },
    {
        "word": "she",
        "definition": "n. 女人；雌性动物 pron. 她（主格）；它（用来指雌性动物或国家、船舶、地球、月亮等）"
    },
    {
        "word": "shed",
        "definition": "n. 小屋，棚；分水岭 vt. 流出；摆脱；散发；倾吐 vi. 流出；脱落；散布"
    },
    {
        "word": "sheep",
        "definition": "n. 羊，绵羊；胆小鬼"
    },
    {
        "word": "sheer",
        "definition": "n. 偏航；透明薄织物 adj. 绝对的；透明的；峻峭的；纯粹的 vt. 使偏航；使急转向 adv. 完全；陡峭地 vi. 偏航"
    },
    {
        "word": "sheet",
        "definition": "n. 薄片，纸张；薄板；床单 adj. 片状的 vt. 覆盖；盖上被单；使成大片 vi. 成片流动；大片落下"
    },
    {
        "word": "shelf",
        "definition": "n. 架子；搁板；搁板状物；暗礁"
    },
    {
        "word": "shell",
        "definition": "n. 壳，贝壳；炮弹；外形 vt. 剥皮；炮轰 vi. 剥落；设定命令行解释器的位置"
    },
    {
        "word": "shelter",
        "definition": "n. 庇护；避难所；遮盖物 vt. 保护；使掩蔽 vi. 躲避，避难"
    },
    {
        "word": "shift",
        "definition": "n. 移动；变化；手段；轮班 vt. 转移；改变；替换 vi. 移动；转变；转换"
    },
    {
        "word": "shine",
        "definition": "vt. 照射，擦亮；把…的光投向；（口）通过擦拭使…变得有光泽或光 vi. 发出光；反射光，闪耀；出类拔萃，表现突出；露出；照耀；显露；出众 n. 光亮，光泽；好天气；擦亮；晴天；擦皮鞋；鬼把戏或诡计"
    },
    {
        "word": "shiny",
        "definition": "adj. 有光泽的，擦亮的；闪耀的；晴朗的；磨损的"
    },
    {
        "word": "ship",
        "definition": "n. 船；舰；太空船 vt. 运送，乘船；以船运送 vi. 上船；乘船旅行；当船员"
    },
    {
        "word": "shipping",
        "definition": "n.  船舶，船舶吨数；海运；运送 v. 运送，乘船（ship的ing形式）"
    },
    {
        "word": "shipment",
        "definition": "n. 装货；装载的货物"
    },
    {
        "word": "shirt",
        "definition": "n. 衬衫；汗衫，内衣"
    },
    {
        "word": "shit",
        "definition": "n. 屎；粪 vi. 拉屎 vt. 欺骗；在…拉屎 int. 狗屁；呸"
    },
    {
        "word": "shiver",
        "definition": "n. 颤抖，战栗；碎片 vi. 颤抖；哆嗦；打碎 vt. 颤抖；打碎"
    },
    {
        "word": "shock",
        "definition": "n. 休克；震惊；震动；打击；禾束堆 adj. 浓密的；蓬乱的 vt. 使休克；使震惊；使震动；使受电击；把…堆成禾束堆 vi. 感到震惊；受到震动；堆成禾束堆"
    },
    {
        "word": "shoe",
        "definition": "n. 鞋；蹄铁；外胎 vt. 给……穿上鞋；穿……鞋"
    },
    {
        "word": "shoot",
        "definition": "n. 射击；摄影；狩猎；急流 vt. 射击，射中；拍摄；发芽；使爆炸；给…注射 vi. 射击；发芽；拍电影"
    },
    {
        "word": "shop",
        "definition": "n. 商店；店铺 vt. 购物 vi. 购物；买东西"
    },
    {
        "word": "shopping",
        "definition": "n. 购物，买东西 v. 购物（shop的ing形式）"
    },
    {
        "word": "shore",
        "definition": "n. 海滨；支柱 vt. 支撑，使稳住；用支柱撑住"
    },
    {
        "word": "short",
        "definition": "n. 短；缺乏；短路；短裤 adj. 短的；不足的；矮的，低的 adv. 不足；突然；唐突地"
    },
    {
        "word": "shortage",
        "definition": "n. 缺乏，缺少；不足"
    },
    {
        "word": "shorts",
        "definition": "n. 短裤"
    },
    {
        "word": "shortcoming",
        "definition": "n. 缺点；短处"
    },
    {
        "word": "shortly",
        "definition": "adv. 立刻；简短地；唐突地"
    },
    {
        "word": "shot",
        "definition": "n. 发射；炮弹；射手；镜头 v. 射击（shoot的过去式和过去分词） adj. 用尽的；破旧的；杂色的，闪光的"
    },
    {
        "word": "should",
        "definition": "aux. 应该；就；可能；将要"
    },
    {
        "word": "shoulder",
        "definition": "n. 肩，肩膀；肩部 vi. 用肩推挤，用肩顶 vt. 肩负，承担"
    },
    {
        "word": "shout",
        "definition": "n. 呼喊；呼叫 vi. 呼喊；喊叫；大声说 vt. 呼喊；大声说"
    },
    {
        "word": "show",
        "definition": "n. 显示；表演；炫耀 vt. 显示；说明；演出；展出 vi. 显示；说明；指示"
    },
    {
        "word": "showy",
        "definition": "adj. 艳丽的；炫耀的；显眼的"
    },
    {
        "word": "shower",
        "definition": "n. 淋浴；（倾泻般出现的）一阵，一大批；阵雨 vt. 大量地给予；把……弄湿 vi. 淋浴；下阵雨"
    },
    {
        "word": "shrimp",
        "definition": "n. 虾；小虾；矮小的人 adj. 有虾的；虾制的 vi. 捕虾"
    },
    {
        "word": "shrink",
        "definition": "vi. 收缩；畏缩 n. 收缩；畏缩；<俚>精神病学家 vt. 使缩小，使收缩"
    },
    {
        "word": "shrug",
        "definition": "n. 耸肩 vi. 耸肩 vt. 耸肩，耸肩表示"
    },
    {
        "word": "shut",
        "definition": "n. 关闭 adj. 关闭的；围绕的 vi. 关上；停止营业 vt. 关闭；停业；幽禁"
    },
    {
        "word": "shuttle",
        "definition": "n. 航天飞机；穿梭；梭子；穿梭班机、公共汽车等 vt. 使穿梭般来回移动；短程穿梭般运送 vi. 穿梭往返"
    },
    {
        "word": "shy",
        "definition": "n. 投掷；惊跳 adj. 害羞的；畏缩的，胆怯的 vi. 投；畏缩；惊退；厌恶 vt. 投；乱掷"
    },
    {
        "word": "shyness",
        "definition": "n. 羞怯"
    },
    {
        "word": "shyly",
        "definition": "adv. 害羞地；羞怯地；胆怯地；小心地"
    },
    {
        "word": "sick",
        "definition": "adj. 厌恶的；病态的；不舒服；渴望的；恶心的 ；生病的 n. 病人 vt. 使狗去咬；呕吐；追击"
    },
    {
        "word": "sicken",
        "definition": "vt. 使患病；使恶心；使嫌恶 vi. 生病；变厌腻"
    },
    {
        "word": "side",
        "definition": "n. 方面；侧面；旁边 adj. 旁的，侧的 vt. 同意，支持 vi. 支持；赞助；偏袒"
    },
    {
        "word": "sideways",
        "definition": "adj. 向侧面的；一旁的 adv. 向侧面地；向一旁"
    },
    {
        "word": "siege",
        "definition": "n. 围攻；包围；围城；不断袭击；长期努力 vt. 围攻；包围"
    },
    {
        "word": "sigh",
        "definition": "n. 叹息，叹气 vt. 叹息，叹气 vi. 叹息，叹气"
    },
    {
        "word": "sight",
        "definition": "n. 视力；景象；眼界；见解 adj. 见票即付的；即席的 vt. 看见；瞄准 vi. 瞄准；观看"
    },
    {
        "word": "sightseeing",
        "definition": "n. 观光；游览 v. 观光（sightsee的ing形式）；游览 adj. 观光的；游览的"
    },
    {
        "word": "sign",
        "definition": "n. 迹象；符号；记号；手势；指示牌 vt. 签署；示意 vi. 签署；签名"
    },
    {
        "word": "signature",
        "definition": "n. 署名；签名；信号"
    },
    {
        "word": "signal",
        "definition": "n. 信号；暗号；导火线 adj. 显著的；作为信号的 vt. 标志；用信号通知；表示 vi. 发信号"
    },
    {
        "word": "significant",
        "definition": "n. 象征；有意义的事物 adj. 重大的；有效的；有意义的；值得注意的；意味深长的"
    },
    {
        "word": "significance",
        "definition": "n. 意义；重要性；意思"
    },
    {
        "word": "silent",
        "definition": "n. 无声电影 adj. 沉默的；寂静的；无记载的"
    },
    {
        "word": "silence",
        "definition": "n. 沉默；寂静；缄默；不谈；无声状态 vt. 使沉默；使安静；压制；消除噪音 int. 安静！；别作声！"
    },
    {
        "word": "silicon",
        "definition": "n.  硅；硅元素"
    },
    {
        "word": "silk",
        "definition": "n. 丝绸；蚕丝；丝织物 adj. 丝的；丝绸的；丝制的 vi. （玉米）处于长须的阶段中"
    },
    {
        "word": "silky",
        "definition": "adj. 丝的；柔滑的；温和的；丝绸一样的"
    },
    {
        "word": "silver",
        "definition": "n. 银；银器；银币；银质奖章；餐具；银灰色 adj. 银的；含银的；有银色光泽的；口才流利的；第二十五周年的婚姻 vt. 镀银；使有银色光泽 vi. 变成银色"
    },
    {
        "word": "silvery",
        "definition": "adj. 银色的；清脆的；银铃一般的；似银的"
    },
    {
        "word": "similar",
        "definition": "n. 类似物 adj. 相似的"
    },
    {
        "word": "similarity",
        "definition": "n. 类似；相似点"
    },
    {
        "word": "simple",
        "definition": "n. 笨蛋；愚蠢的行为；出身低微者 adj. 简单的；单纯的；天真的"
    },
    {
        "word": "simplicity",
        "definition": "n. 朴素；简易；天真；愚蠢"
    },
    {
        "word": "simplify",
        "definition": "vt. 简化；使单纯；使简易"
    },
    {
        "word": "simply",
        "definition": "adv. 简单地；仅仅；简直；朴素地；坦白地"
    },
    {
        "word": "sin",
        "definition": "n. 罪恶；罪孽；过失 vt. 犯罪 vi. 犯罪；犯过失"
    },
    {
        "word": "since",
        "definition": "conj. 因为；由于；既然；自…以来；自…以后 prep. 自…以来；自…以后 adv. 后来"
    },
    {
        "word": "sincere",
        "definition": "adj. 真诚的；诚挚的；真实的"
    },
    {
        "word": "sincerity",
        "definition": "n. 真实，诚挚"
    },
    {
        "word": "sing",
        "definition": "n. 演唱；鸣声；呼啸声 vt. 唱；用诗赞颂；唱着使 vi. 唱歌；歌颂；鸣叫；呼号"
    },
    {
        "word": "singer",
        "definition": "n. 歌手，歌唱家"
    },
    {
        "word": "single",
        "definition": "n. 一个；单打；单程票 adj. 单一的；单身的；单程的 vt. 选出 vi. 击出一垒安打"
    },
    {
        "word": "singular",
        "definition": "n. 单数 adj. 单数的；单一的；非凡的；异常的"
    },
    {
        "word": "singularity",
        "definition": "n. 奇异；奇点；突出；稀有"
    },
    {
        "word": "sink",
        "definition": "n. 水槽；洗涤槽；污水坑 vi. 下沉；消沉；渗透 vt. 使下沉；挖掘；使低落"
    },
    {
        "word": "sip",
        "definition": "n. 抿；小口喝；单列直插式组件 vt. 啜 vi. 啜饮"
    },
    {
        "word": "sir",
        "definition": "n. 先生；（用于姓名前）爵士；阁下；（中小学生对男教师的称呼）先生；老师"
    },
    {
        "word": "sister",
        "definition": "n. 姐妹；（称志同道合者）姐妹；修女；护士 adj. 姐妹般的；同类型的"
    },
    {
        "word": "sit",
        "definition": "vi. 坐；位于 vt. 使就座"
    },
    {
        "word": "sitting",
        "definition": "n. 入席，就坐；开庭；孵卵；坐着的一段时间 v. 坐；坐落（sit的ing形式） adj. 坐着的；孵卵中的；在任期中的"
    },
    {
        "word": "site",
        "definition": "n. 地点；位置；场所 vt. 设置；为…选址"
    },
    {
        "word": "situation",
        "definition": "n. 情况；形势；处境；位置"
    },
    {
        "word": "situate",
        "definition": "adj. 位于…的 vt. 使位于；使处于"
    },
    {
        "word": "six",
        "definition": "num. 六，六个 n. 六，六个"
    },
    {
        "word": "sixteen",
        "definition": "num. 十六 adj. 十六的，十六个的"
    },
    {
        "word": "sixty",
        "definition": "num. 六十；六十个"
    },
    {
        "word": "size",
        "definition": "n. 大小；尺寸 adj. 一定尺寸的 vt. 依大小排列 vi. 可比拟"
    },
    {
        "word": "sizable",
        "definition": "adj. 相当大的；大小相当的"
    },
    {
        "word": "skate",
        "definition": "n. 溜冰；冰鞋 vi. 滑冰；滑过"
    },
    {
        "word": "skating",
        "definition": "n. 溜冰，滑冰 v. 滑冰（skate的ing形式）"
    },
    {
        "word": "skeleton",
        "definition": "n. 骨架，骨骼；纲要；骨瘦如柴的人 adj. 骨骼的；骨瘦如柴的；概略的"
    },
    {
        "word": "sketch",
        "definition": "n. 素描；略图；梗概 vt. 画素描或速写 vi. 画素描或速写"
    },
    {
        "word": "sketchy",
        "definition": "adj. 写生风格的；写生的；概略的"
    },
    {
        "word": "ski",
        "definition": "n. 滑雪橇 vi. 滑雪 adj. 滑雪（用）的"
    },
    {
        "word": "skiing",
        "definition": "n. 滑雪运动；滑雪术 v. 滑雪（ski的ing形式）"
    },
    {
        "word": "skill",
        "definition": "n. 技能，技巧；本领，技术"
    },
    {
        "word": "skilful",
        "definition": "adj. 灵巧的; 熟练的; 技术好的"
    },
    {
        "word": "skillful",
        "definition": "adj. 熟练的；巧妙的"
    },
    {
        "word": "skilled",
        "definition": "adj. 熟练的；有技能的；需要技能的"
    },
    {
        "word": "skin",
        "definition": "n. 皮肤；外皮 vt. 剥皮 vi. 愈合；长皮"
    },
    {
        "word": "skinny",
        "definition": "n. 机密情报；内部消息；小道消息 adj. 皮的；皮包骨的；紧身的；小气的"
    },
    {
        "word": "skip",
        "definition": "n. 跳跃；跳读 vt. 跳过；遗漏 vi. 跳跃；跳绳；遗漏；跳读"
    },
    {
        "word": "skirt",
        "definition": "n. 裙子 vt. 绕过，回避；位于…边缘 vi. 沿边走，绕开；环绕"
    },
    {
        "word": "sky",
        "definition": "n. 天空；顶点 vt. 把…投向空中；把…挂得过高 vi. 踢或击高空球；把桨叶翘得过高；飞涨"
    },
    {
        "word": "skyline",
        "definition": "n. 地平线；空中轮廓线；架空索 vt. 天空映衬出…的轮廓"
    },
    {
        "word": "skyscraper",
        "definition": "n. 摩天楼，超高层大楼；特别高的东西"
    },
    {
        "word": "slap",
        "definition": "n. 掴；侮辱；掌击；拍打声 vt. 拍击；侮辱；掌击；掴…的耳光 vi. 掴；拍击 adv. 直接地；猛然地；恰好"
    },
    {
        "word": "slave",
        "definition": "n. 奴隶；从动装置 vi. 苦干；拼命工作"
    },
    {
        "word": "slavery",
        "definition": "n. 奴役；奴隶制度；奴隶身份"
    },
    {
        "word": "sleep",
        "definition": "n. 睡眠 vi. 睡，睡觉"
    },
    {
        "word": "sleepy",
        "definition": "adj. 欲睡的；困乏的；不活跃的"
    },
    {
        "word": "sleepiness",
        "definition": "n. 睡意，瞌睡；想睡"
    },
    {
        "word": "sleeve",
        "definition": "n.  套筒， 套管；袖子， 袖套 vt. 给……装袖子；给……装套筒"
    },
    {
        "word": "slender",
        "definition": "adj. 细长的；苗条的；微薄的"
    },
    {
        "word": "slice",
        "definition": "n. 薄片；部分；菜刀，火铲 vt. 切下；把…分成部分；将…切成薄片 vi. 切开；割破"
    },
    {
        "word": "slide",
        "definition": "n. 滑动；幻灯片；滑梯；雪崩 vt. 滑动；使滑动；悄悄地迅速放置 vi. 滑动；滑落；不知不觉陷入"
    },
    {
        "word": "slight",
        "definition": "n. 怠慢；轻蔑 adj. 轻微的，少量的；脆弱的；细长的；不重要的 vt. 轻视，忽略；怠慢"
    },
    {
        "word": "slightly",
        "definition": "adv. 些微地，轻微地；纤细地"
    },
    {
        "word": "slim",
        "definition": "adj. 苗条的；修长的；微小的；差的 vt. 使…体重减轻；使…苗条 vi. 减轻体重；变细"
    },
    {
        "word": "slip",
        "definition": "n. 滑，滑倒；片，纸片；错误；下跌；事故 abbr. 串行线路接口协议，是旧式的协议（Serial Line Interface Protocol） adj. 滑动的；有活结的；活络的 vt. 使滑动；滑过；摆脱；塞入；闪开 vi. 滑动；滑倒；犯错；失足；减退"
    },
    {
        "word": "slippery",
        "definition": "adj. 滑的；狡猾的；不稳定的"
    },
    {
        "word": "slipper",
        "definition": "n. 拖鞋 vt. 用拖鞋打"
    },
    {
        "word": "slogan",
        "definition": "n. 标语；呐喊声"
    },
    {
        "word": "slope",
        "definition": "n. 斜坡；倾斜；斜率；扛枪姿势 vt. 倾斜；使倾斜；扛 vi. 倾斜；逃走"
    },
    {
        "word": "slow",
        "definition": "adj. 慢的；减速的；迟钝的 vt. 放慢；阻碍 vi. 变慢；变萧条 adv. 慢慢地；迟缓地"
    },
    {
        "word": "small",
        "definition": "n. 小件物品；矮小的人 adj. 少的，小的；微弱的；几乎没有的；不重要的；幼小的 adv. 小小地；卑鄙地"
    },
    {
        "word": "smart",
        "definition": "adj. 聪明的；巧妙的；敏捷的；厉害的；潇洒的；剧烈的；时髦的"
    },
    {
        "word": "smartphone",
        "definition": "n. 智能手机"
    },
    {
        "word": "smash",
        "definition": "n. 破碎；扣球；冲突；大败 vt. 粉碎；使破产；溃裂 adj. 了不起的；非常轰动的；出色的 vi. 粉碎；打碎"
    },
    {
        "word": "smell",
        "definition": "n. 气味，嗅觉；臭味 vt. 嗅，闻；察觉到；发出…的气味 vi. 嗅，闻；有…气味"
    },
    {
        "word": "smelly",
        "definition": "adj. 有臭味的，发臭的"
    },
    {
        "word": "smile",
        "definition": "n. 微笑；笑容；喜色 vt. 微笑着表示 vi. 微笑"
    },
    {
        "word": "smog",
        "definition": "n. 烟雾"
    },
    {
        "word": "smoggy",
        "definition": "adj. 烟雾弥漫的"
    },
    {
        "word": "smoke",
        "definition": "n. 烟；抽烟；无常的事物 vt. 吸烟；抽 vi. 冒烟，吸烟；抽烟；弥漫"
    },
    {
        "word": "smoky",
        "definition": "adj. 冒烟的；烟熏味的；熏着的；呛人的；烟状的"
    },
    {
        "word": "smooth",
        "definition": "n. 平滑部分；一块平地 adj. 顺利的；光滑的；平稳的 vt. 使光滑；消除（障碍等）；使优雅；缓和 adv. 光滑地；平稳地；流畅地 vi. 变平静；变平滑"
    },
    {
        "word": "snack",
        "definition": "n. 小吃，快餐；一份，部分 vi. 吃快餐，吃点心"
    },
    {
        "word": "snake",
        "definition": "n. 蛇；阴险的人 vt. 拉（木材等）；迂回前进 vi. 迂回前进"
    },
    {
        "word": "snow",
        "definition": "n. 雪，积雪；下雪 vt. 使纷纷落下；使变白 vi. 降雪"
    },
    {
        "word": "snowy",
        "definition": "adj. 下雪的，多雪的；被雪覆盖的；洁白无瑕的"
    },
    {
        "word": "so",
        "definition": "conj. 所以；因此 adv. 如此，这么；确是如此 pron. 这样"
    },
    {
        "word": "soak",
        "definition": "n. 浸；湿透；大雨 vi. 浸泡；渗透 vt. 吸收，吸入；沉浸在（工作或学习中）；使……上下湿透"
    },
    {
        "word": "soap",
        "definition": "n. 肥皂 vt. 将肥皂涂在……上；对……拍马屁（俚语） vi. 用肥皂擦洗"
    },
    {
        "word": "soar",
        "definition": "n. 高飞；高涨 vi. 高飞；高耸；往上飞舞"
    },
    {
        "word": "so-called",
        "definition": "adj. 所谓的；号称的"
    },
    {
        "word": "soccer",
        "definition": "n. 英式足球，足球"
    },
    {
        "word": "society",
        "definition": "n. 社会；交往；社团；社交界"
    },
    {
        "word": "social",
        "definition": "n. 联谊会；联欢会 adj. 社会的，社交的；群居的"
    },
    {
        "word": "socialize",
        "definition": "vt. 使社会化；使社会主义化；使适应社会生活 vi. 交际；参与社交"
    },
    {
        "word": "socialise",
        "definition": "vt. 使社会化；使社会主义化 vi. 参加社交活动；发生社交往来（等于socialize）"
    },
    {
        "word": "sociable",
        "definition": "n. 联谊会 adj. 社交的；好交际的；友善的"
    },
    {
        "word": "socialism",
        "definition": "n. 社会主义"
    },
    {
        "word": "socialist",
        "definition": "n. 社会主义者；社会党党员 adj. 社会主义的"
    },
    {
        "word": "sociology",
        "definition": "n. 社会学；群体生态学"
    },
    {
        "word": "sociologist",
        "definition": "n. 社会学家"
    },
    {
        "word": "sock",
        "definition": "vt. 重击；给……穿袜 n. 短袜；一击 adv. 正着地；不偏不倚地 adj. 非常成功的"
    },
    {
        "word": "soda",
        "definition": "n. 苏打；碳酸水"
    },
    {
        "word": "sofa",
        "definition": "n. 沙发；长椅"
    },
    {
        "word": "soft",
        "definition": "n. 柔性；柔软的东西；柔软部分 adj. 软的，柔软的；温柔的，温和的；软弱的；笨的 adv. 柔软地；温和地"
    },
    {
        "word": "soften",
        "definition": "vt. 使温和；使缓和；使变柔软 vi. 减轻；变柔和；变柔软"
    },
    {
        "word": "software",
        "definition": "n. 软件"
    },
    {
        "word": "soil",
        "definition": "n. 土地；土壤；国家；粪便；务农；温床 vt. 弄脏；污辱 vi. 变脏"
    },
    {
        "word": "solar",
        "definition": "n. 日光浴室 adj. 太阳的；日光的；利用太阳光的；与太阳相关的"
    },
    {
        "word": "soldier",
        "definition": "n. 军人； 兵蚁；懒汉；一片烤面包 vi. 当兵；磨洋工；坚持干；假称害病"
    },
    {
        "word": "sole",
        "definition": "n. 鞋底；脚底；基础；鳎目鱼 adj. 唯一的；单独的；仅有的 vt. 触底；上鞋底"
    },
    {
        "word": "solely",
        "definition": "adv. 单独地，唯一地"
    },
    {
        "word": "solemn",
        "definition": "adj. 庄严的，严肃的；隆重的，郑重的"
    },
    {
        "word": "solemnity",
        "definition": "n. 严肃；庄严；一本正经"
    },
    {
        "word": "solid",
        "definition": "n. 固体；立方体 adj. 固体的；可靠的；立体的；结实的；一致的"
    },
    {
        "word": "solidity",
        "definition": "n. 坚硬，坚固；体积；固体性"
    },
    {
        "word": "solidify",
        "definition": "vt. 团结；凝固 vi. 团结；凝固"
    },
    {
        "word": "solve",
        "definition": "vt. 解决；解答；溶解 vi. 作解答"
    },
    {
        "word": "solution",
        "definition": "n. 解决方案；溶液；溶解；解答"
    },
    {
        "word": "solvent",
        "definition": "n. 溶剂；解决方法 adj. 有偿付能力的；有溶解力的"
    },
    {
        "word": "soluble",
        "definition": "adj.  可溶的，可溶解的；可解决的"
    },
    {
        "word": "some",
        "definition": "adj. 一些；某个；大约；相当多的 pron. 一些；若干；其中的一部分；（数量不确切时用）有些人 adv. 非常；相当；<美>稍微"
    },
    {
        "word": "somebody",
        "definition": "n. 大人物；重要人物 pron. 有人；某人"
    },
    {
        "word": "somehow",
        "definition": "adv. 以某种方法；莫名其妙地"
    },
    {
        "word": "someone",
        "definition": "pron. 有人，某人"
    },
    {
        "word": "something",
        "definition": "n. 重要的人；值得重视的事 adj. 大约；有点象 adv. 非常；有点；大约 pron. 某事；某物"
    },
    {
        "word": "sometime",
        "definition": "adj. 以前的；某一时间的 adv. 改天；来日；在某一时候"
    },
    {
        "word": "sometimes",
        "definition": "adv. 有时，间或"
    },
    {
        "word": "somewhat",
        "definition": "n. 几分；某物 adv. 有点；多少；几分；稍微"
    },
    {
        "word": "somewhere",
        "definition": "n. 某个地方 adv. 在某处；到某处"
    },
    {
        "word": "son",
        "definition": "n. 儿子；孩子（对年轻人的称呼）；男性后裔"
    },
    {
        "word": "song",
        "definition": "n. 歌曲；歌唱；诗歌；鸣声"
    },
    {
        "word": "soon",
        "definition": "adv. 快；不久，一会儿；立刻；宁愿"
    },
    {
        "word": "sophisticated",
        "definition": "adj. 复杂的；精致的；久经世故的；富有经验的 v. 使变得世故；使迷惑；篡改（sophisticate的过去分词形式）"
    },
    {
        "word": "sophistication",
        "definition": "n. 复杂；诡辩；老于世故；有教养"
    },
    {
        "word": "sore",
        "definition": "n. 溃疡，痛处；恨事，伤心事 adj. 疼痛的，痛心的；剧烈的，极度的；恼火的，发怒的；厉害的，迫切的"
    },
    {
        "word": "sorrow",
        "definition": "n. 悲伤；懊悔；伤心事 vt. 为…悲痛 vi. 懊悔；遗憾；感到悲伤"
    },
    {
        "word": "sorrowful",
        "definition": "adj. 悲伤的，伤心的"
    },
    {
        "word": "sorry",
        "definition": "adj. 遗憾的；对不起的，抱歉的 int. 对不起，抱歉（表示委婉的拒绝等）"
    },
    {
        "word": "sort",
        "definition": "n. 种类；方式；品质 vt. 将…分类；将…排序；挑选出某物 vi. 分类；协调；交往"
    },
    {
        "word": "soul",
        "definition": "n. 灵魂；心灵；精神；鬼魂 adj. 美国黑人文化的"
    },
    {
        "word": "sound",
        "definition": "n. 声音，语音；噪音；海峡；吵闹；听力范围； 探条 adj. 健全的，健康的；合理的；可靠的；有效彻底的 vt. 听（诊）；测量，测…深；使发声；试探；宣告 vi. 听起来；发出声音；回响；测深 adv. 彻底地，充分地"
    },
    {
        "word": "soup",
        "definition": "n. 汤，羹；马力 vt. 加速；增加马力"
    },
    {
        "word": "sour",
        "definition": "n. 酸味；苦事 adj. 酸的；发酵的；刺耳的；酸臭的；讨厌的 vt. 使变酸；使失望 vi. 发酵；变酸；厌烦"
    },
    {
        "word": "source",
        "definition": "n. 来源；水源；原始资料"
    },
    {
        "word": "south",
        "definition": "n. 南方，南边；南部 adj. 南的，南方的 adv. 在南方，向南方"
    },
    {
        "word": "southern",
        "definition": "n. 南方人 adj. 南的；南方的"
    },
    {
        "word": "southeast",
        "definition": "n. 东南；东南地区 adj. 东南的；来自东南的 adv. 来自东南"
    },
    {
        "word": "southeastern",
        "definition": "adj. 东南方的；朝东南的"
    },
    {
        "word": "southwest",
        "definition": "n. 西南方 adj. 西南的 adv. 往西南；来自西南"
    },
    {
        "word": "southwestern",
        "definition": "adj. 西南部的；向西南的；来自西南的"
    },
    {
        "word": "souvenir",
        "definition": "n. 纪念品；礼物 vt. 把…留作纪念"
    },
    {
        "word": "sow",
        "definition": "n. 母猪 vt. 播种；散布；使密布 vi. 播种"
    },
    {
        "word": "space",
        "definition": "n. 空间；太空；距离 vt. 隔开 vi. 留间隔"
    },
    {
        "word": "spacious",
        "definition": "adj. 宽敞的，广阔的；无边无际的"
    },
    {
        "word": "spatial",
        "definition": "adj. 空间的；存在于空间的；受空间条件限制的"
    },
    {
        "word": "spaceship",
        "definition": "n.  宇宙飞船"
    },
    {
        "word": "spacecraft",
        "definition": "n.  宇宙飞船，航天器"
    },
    {
        "word": "spade",
        "definition": "n. 铁锹，铲子 vt. 铲；把……弄实抹平 vi. 铲"
    },
    {
        "word": "span",
        "definition": "n. 跨度，跨距；范围 vt. 跨越；持续；以手指测量"
    },
    {
        "word": "spare",
        "definition": "n. 剩余；备用零件 vt. 节约，吝惜；饶恕；分出，分让 adj. 多余的；瘦的；少量的 vi. 饶恕，宽恕；节约"
    },
    {
        "word": "sparingly",
        "definition": "adv. 节俭地；保守地；爱惜地"
    },
    {
        "word": "spark",
        "definition": "n. 火花；朝气；闪光 vt. 发动；鼓舞；求婚 vi. 闪烁；发火花；求婚"
    },
    {
        "word": "sparkle",
        "definition": "n. 闪耀；火花；活力 vt. 使闪耀；使发光 vi. 闪耀；发泡；活跃"
    },
    {
        "word": "speak",
        "definition": "vi. 说话；演讲；表明；陈述 vt. 讲话；发言；讲演"
    },
    {
        "word": "speaker",
        "definition": "n. 演讲者；扬声器；说话者；说某种语言的人"
    },
    {
        "word": "special",
        "definition": "n. 特使，特派人员；特刊；特色菜；专车；特价商品 adj. 特别的；专门的，专用的"
    },
    {
        "word": "specialize",
        "definition": "vi. 专门从事；详细说明；特化 vt. 使专门化；使适应特殊情况；详细说明"
    },
    {
        "word": "specialise",
        "definition": "vt. 使专门化；限定…的范围；深入（等于specialize） vi. 专门研究（等于specialize）"
    },
    {
        "word": "specialization",
        "definition": "n. 专门化；特殊化；特化作用"
    },
    {
        "word": "specialisation",
        "definition": "n. 特殊化，专门化，特化作用"
    },
    {
        "word": "specialist",
        "definition": "n. 专家；专门医师 adj. 专家的；专业的"
    },
    {
        "word": "species",
        "definition": "n.  物种；种类 adj. 物种上的"
    },
    {
        "word": "specific",
        "definition": "n. 特性；细节；特效药 adj. 特殊的，特定的；明确的；详细的； 具有特效的"
    },
    {
        "word": "specifically",
        "definition": "adv. 特别地；明确地"
    },
    {
        "word": "specify",
        "definition": "vt. 指定；详细说明；列举；把…列入说明书"
    },
    {
        "word": "specification",
        "definition": "n. 规格；说明书；详述"
    },
    {
        "word": "specimen",
        "definition": "n. 样品，样本；标本"
    },
    {
        "word": "speculate",
        "definition": "vi. 推测；投机；思索 vt. 推断"
    },
    {
        "word": "speculation",
        "definition": "n. 投机；推测；思索；投机买卖"
    },
    {
        "word": "speculative",
        "definition": "adj. 投机的；推测的；思索性的"
    },
    {
        "word": "speech",
        "definition": "n. 演讲；讲话； 语音；演说"
    },
    {
        "word": "speechless",
        "definition": "adj. 说不出话的；哑的；非言语所能表达的"
    },
    {
        "word": "speed",
        "definition": "n. 速度，速率；迅速，快速；昌盛，繁荣 vt. 加快…的速度；使成功，使繁荣 vi. 超速，加速；加速，迅速前行；兴隆"
    },
    {
        "word": "speedy",
        "definition": "adj. 快的；迅速的；敏捷的"
    },
    {
        "word": "speeding",
        "definition": "n. 超速行驶 v. 促进（speed的ing形式） adj. 高速行驶的"
    },
    {
        "word": "spell",
        "definition": "n. 符咒；一段时间；魅力 vi. 拼字；轮替 vt. 拼，拼写；意味着；招致；拼成；迷住；轮值"
    },
    {
        "word": "spelling",
        "definition": "n. 拼写；拼字；拼法 v. 拼写；意味着（spell的ing形式）；迷住"
    },
    {
        "word": "spend",
        "definition": "n. 预算 vt. 度过，消磨（时光）；花费；浪费；用尽 vi. 花钱；用尽，耗尽"
    },
    {
        "word": "spending",
        "definition": "n. 花费；开销 v. 花费；度过（spend的现在分词形式）"
    },
    {
        "word": "sphere",
        "definition": "n. 范围；球体 adj. 球体的 vt. 包围；放入球内；使…成球形"
    },
    {
        "word": "spherical",
        "definition": "adj. 球形的，球面的；天体的"
    },
    {
        "word": "spill",
        "definition": "n. 溢出，溅出；溢出量；摔下；小塞子 vi. 溢出，流出；摔下；涌流 vt. 使溢出，使流出；使摔下"
    },
    {
        "word": "spin",
        "definition": "n. 旋转；疾驰 vi. 旋转；纺纱；吐丝；晕眩 vt. 使旋转；纺纱；编造；结网"
    },
    {
        "word": "spirit",
        "definition": "n. 精神；心灵；情绪；志气；烈酒 vt. 鼓励；鼓舞；诱拐"
    },
    {
        "word": "spiritual",
        "definition": "n. 圣歌（尤指美国南部黑人的） adj. 精神的，心灵的"
    },
    {
        "word": "spit",
        "definition": "n. 唾液 vi. 吐痰；吐口水；发出劈啪声 vt. 吐，吐出；发出；发射"
    },
    {
        "word": "spite",
        "definition": "n. 不顾；恶意；怨恨 vt. 刁难；使恼怒"
    },
    {
        "word": "splash",
        "definition": "n. 飞溅的水；污点；卖弄 vt. 溅，泼；用...使液体飞溅 vi. 溅湿；溅开"
    },
    {
        "word": "splendid",
        "definition": "adj. 辉煌的；灿烂的；极好的；杰出的"
    },
    {
        "word": "splendor",
        "definition": "n. 光彩；壮丽；显赫"
    },
    {
        "word": "splendour",
        "definition": "n. 显赫（等于splendor）；光彩壮丽"
    },
    {
        "word": "split",
        "definition": "n. 劈开；裂缝 adj. 劈开的 vt. 分离；使分离；劈开；离开；分解 vi. 离开；被劈开；断绝关系"
    },
    {
        "word": "spoil",
        "definition": "n. 次品；奖品 vt. 溺爱；糟蹋；破坏；掠夺 vi. 掠夺；变坏；腐败"
    },
    {
        "word": "spokesman",
        "definition": "n. 发言人；代言人"
    },
    {
        "word": "spokeswoman",
        "definition": "n. 女代言人，女代言人"
    },
    {
        "word": "spokesperson",
        "definition": "n. 发言人；代言人"
    },
    {
        "word": "sponsor",
        "definition": "n. 赞助者；主办者；保证人 vt. 赞助；发起"
    },
    {
        "word": "sponsorship",
        "definition": "n. 赞助；发起；保证人的地位；教父母身份"
    },
    {
        "word": "spontaneous",
        "definition": "adj. 自发的；自然的；无意识的"
    },
    {
        "word": "spontaneity",
        "definition": "n. 自发性；自然发生"
    },
    {
        "word": "spoon",
        "definition": "n. 匙，勺子；一杓的量 vt. 用匙舀；使成匙状 vi. 轻轻向上击"
    },
    {
        "word": "spoonful",
        "definition": "n. 一匙；一匙的量"
    },
    {
        "word": "sport",
        "definition": "n. 运动；游戏；娱乐；运动会；玩笑 adj. 运动的 vt. 游戏；参加体育运动；夸耀 vi. 游戏"
    },
    {
        "word": "sportsman",
        "definition": "n. 运动员；运动家；冒险家"
    },
    {
        "word": "sportswoman",
        "definition": "n. 女运动家；女运动员"
    },
    {
        "word": "spot",
        "definition": "n. 地点；斑点 adj. 现场的；现货买卖的 vt. 认出；弄脏；用灯光照射 vi. 沾上污渍；满是斑点 adv. 准确地；恰好"
    },
    {
        "word": "spouse",
        "definition": "n. 配偶 vt. 和…结婚"
    },
    {
        "word": "spray",
        "definition": "n. 喷雾；喷雾器；水沫 vt. 喷射 vi. 喷"
    },
    {
        "word": "spread",
        "definition": "n. 传播；伸展 adj. 伸展的 vt. 传播，散布；展开；伸展；铺开 vi. 传播；伸展"
    },
    {
        "word": "spring",
        "definition": "n. 春天；弹簧；泉水；活力；跳跃 adj. 春天的 vt. 使跳起；使爆炸；突然提出；使弹开 vi. 生长；涌出；跃出；裂开"
    },
    {
        "word": "spur",
        "definition": "n. 鼓舞，刺激；马刺；山坡 vt. 激励，鞭策；给…装踢马刺 vi. 骑马疾驰；给予刺激"
    },
    {
        "word": "spy",
        "definition": "n. 间谍；密探 vt. 侦察；发现；暗中监视 vi. 侦察；当间谍"
    },
    {
        "word": "square",
        "definition": "n. 平方；广场；正方形 adj. 平方的；正方形的；直角的；正直的 vt. 使成方形；与…一致 vi. 一致；成方形 adv. 成直角地"
    },
    {
        "word": "squeeze",
        "definition": "n. 压榨；紧握；拥挤；佣金 vt. 挤；紧握；勒索 vi. 压榨"
    },
    {
        "word": "stable",
        "definition": "n. 马厩；牛棚 adj. 稳定的；牢固的；坚定的 vt. 赶入马房 vi. 被关在马厩"
    },
    {
        "word": "stability",
        "definition": "n. 稳定性；坚定，恒心"
    },
    {
        "word": "stabilize",
        "definition": "vt. 使稳固，使安定 vi. 稳定，安定"
    },
    {
        "word": "stabilise",
        "definition": "vt. 使…坚固；使…安定；装稳定器（等于stablize） vi. 稳定；安定"
    },
    {
        "word": "stack",
        "definition": "n. 堆；堆叠 vt. 使堆叠；把…堆积起来 vi. 堆积，堆叠"
    },
    {
        "word": "stadium",
        "definition": "n. 体育场；露天大型运动场"
    },
    {
        "word": "staff",
        "definition": "n. 职员；参谋；棒；支撑 adj. 职员的；行政工作的 vt. 供给人员；给…配备职员 vi. 雇用工作人员"
    },
    {
        "word": "stage",
        "definition": "n. 阶段；舞台；戏剧；驿站 vt. 举行；上演；筹划 vi. 举行；适于上演；乘驿车旅行"
    },
    {
        "word": "stain",
        "definition": "n. 污点；瑕疵；着色剂 vt. 沾污；败坏；给…着色 vi. 污染；被沾污；被染污"
    },
    {
        "word": "stainless",
        "definition": "adj. 不锈的；纯洁的，未被玷污的；无瑕疵的"
    },
    {
        "word": "stair",
        "definition": "n. 楼梯，阶梯；梯级"
    },
    {
        "word": "staircase",
        "definition": "n. 楼梯"
    },
    {
        "word": "stake",
        "definition": "n. 桩，棍子；赌注；火刑；奖金 vt. 资助，支持；系…于桩上；把…押下打赌 vi. 打赌"
    },
    {
        "word": "stale",
        "definition": "n. 尿 adj. 陈腐的；不新鲜的 vt. 使变旧；变得不新鲜 vi. 变陈旧；撒尿；变得不新鲜"
    },
    {
        "word": "stamp",
        "definition": "n. 邮票；印记；标志；跺脚 vt. 铭记；标出；盖章于…；贴邮票于…；用脚踩踏 vi. 跺脚；捣碎；毁掉"
    },
    {
        "word": "stand",
        "definition": "n. 站立；立场；看台；停止 vi. 站立；位于；停滞 vt. 使站立；忍受；抵抗"
    },
    {
        "word": "standard",
        "definition": "n. 标准；水准；旗；度量衡标准 adj. 标准的；合规格的；公认为优秀的"
    },
    {
        "word": "standardize",
        "definition": "vt. 使标准化；用标准检验"
    },
    {
        "word": "standardise",
        "definition": "vt. 使…符合标准；使…标准化；使…统一"
    },
    {
        "word": "standardization",
        "definition": "n. 标准化； 规格化；校准"
    },
    {
        "word": "standardisation",
        "definition": "n. 标准化"
    },
    {
        "word": "standpoint",
        "definition": "n. 立场；观点"
    },
    {
        "word": "staple",
        "definition": "n. 主要产品；订书钉；主题；主食 adj. 主要的，大宗生产的；常用的；纺织纤维的 vt. 把…分级；钉住"
    },
    {
        "word": "star",
        "definition": "n. 星，恒星；明星；星形物 adj. 明星的，主角的；星形的 vt. 用星号标于；由…主演，由…担任主角 vi. 担任主角"
    },
    {
        "word": "starry",
        "definition": "adj. 布满星星的；闪闪发光的；星光照耀的；星形的"
    },
    {
        "word": "stare",
        "definition": "n. 凝视；注视 vt. 凝视，盯着看 vi. 凝视，盯着看；显眼"
    },
    {
        "word": "start",
        "definition": "n. 开始；起点 vt. 开始；启动 vi. 出发"
    },
    {
        "word": "starter",
        "definition": "n. 起动机；发令员；第一道菜；发射装置；发起者；参加比赛者，上场队员"
    },
    {
        "word": "startle",
        "definition": "n. 惊愕；惊恐 vt. 使吓一跳；使惊奇 vi. 惊吓；惊跳；惊奇"
    },
    {
        "word": "starve",
        "definition": "vi. 饿死；挨饿；渴望 vt. 使饿死；使挨饿"
    },
    {
        "word": "starvation",
        "definition": "n. 饿死；挨饿；绝食"
    },
    {
        "word": "state",
        "definition": "n. 国家；州；情形 adj. 国家的；州的；正式的 vt. 规定；声明；陈述"
    },
    {
        "word": "statement",
        "definition": "n. 声明；陈述，叙述；报表，清单"
    },
    {
        "word": "statesman",
        "definition": "n. 政治家；国务活动家"
    },
    {
        "word": "station",
        "definition": "n. 车站；驻地；地位；身份 vt. 配置；安置；驻扎"
    },
    {
        "word": "stationary",
        "definition": "n. 不动的人；驻军 adj. 固定的；静止的；定居的；常备军的"
    },
    {
        "word": "statistic",
        "definition": "n. 统计数值 adj. 统计的，统计学的"
    },
    {
        "word": "statistical",
        "definition": "adj. 统计的；统计学的"
    },
    {
        "word": "statue",
        "definition": "n. 雕像，塑像 vt. 以雕像装饰"
    },
    {
        "word": "status",
        "definition": "n. 地位；状态；情形；重要身份"
    },
    {
        "word": "stay",
        "definition": "n. 逗留；停止；支柱 vi. 停留；坚持；暂住；停下 vt. 坚持；暂住；抑制"
    },
    {
        "word": "steady",
        "definition": "n. 关系固定的情侣；固定支架 adj. 稳定的；不变的；沉着的 vt. 使稳定；稳固；使坚定 adv. 稳定地；稳固地 vi. 稳固"
    },
    {
        "word": "steadily",
        "definition": "adv. 稳定地；稳固地；有规则地"
    },
    {
        "word": "steak",
        "definition": "n. 牛排；肉排；鱼排"
    },
    {
        "word": "steal",
        "definition": "n. 偷窃；便宜货；偷垒；断球 vt. 剽窃；偷偷地做；偷窃 vi. 窃取；偷偷地行动；偷垒"
    },
    {
        "word": "steam",
        "definition": "n. 蒸汽；精力 adj. 蒸汽的 vt. 蒸，散发；用蒸汽处理 vi. 蒸，冒水汽"
    },
    {
        "word": "steamy",
        "definition": "adj. 蒸汽的；雾重的，潮湿的；充满蒸汽的"
    },
    {
        "word": "steamer",
        "definition": "n. 轮船；蒸汽机；蒸笼"
    },
    {
        "word": "steel",
        "definition": "n. 钢铁；钢制品；坚固 adj. 钢制的；钢铁业的；坚强的 vt. 钢化；使冷酷"
    },
    {
        "word": "steep",
        "definition": "n. 峭壁；浸渍 adj. 陡峭的；不合理的；夸大的；急剧升降的 vt. 泡；浸；使…充满 vi. 泡；沉浸"
    },
    {
        "word": "steer",
        "definition": "vt. 控制，引导；驾驶 vi. 驾驶，掌舵；行驶 n. 阉牛"
    },
    {
        "word": "stem",
        "definition": "n. 干；茎；船首；血统 vt. 阻止；除去…的茎；给…装柄 vi. 阻止；起源于某事物；逆行"
    },
    {
        "word": "step",
        "definition": "n. 步，脚步；步骤；步伐；梯级 vt. 走，迈步 vi. 踏，踩；走"
    },
    {
        "word": "stick",
        "definition": "n. 棍；手杖；呆头呆脑的人 vi. 坚持；伸出；粘住 vt. 刺，戳；伸出；粘贴"
    },
    {
        "word": "sticky",
        "definition": "adj. 粘的；粘性的"
    },
    {
        "word": "stiff",
        "definition": "adj. 呆板的；坚硬的；严厉的；拘谨的 adv. 僵硬地；彻底地 n. 死尸；令人讨厌者；流通票据；劳动者 vt. 诈骗；失信"
    },
    {
        "word": "stiffen",
        "definition": "vt. 使变硬；使粘稠 vi. 变硬；变猛烈；变粘"
    },
    {
        "word": "still",
        "definition": "conj. 仍然；但是；尽管如此 n. 寂静；剧照；蒸馏室 adj. 静止的，不动的；寂静的，平静的；不起泡的 adv. 仍然；更；静止地 vt. 蒸馏；使…静止；使…平静下来 vi. 静止；平静；蒸馏"
    },
    {
        "word": "stimulate",
        "definition": "vi. 起刺激作用；起促进作用 vt. 刺激；鼓舞，激励"
    },
    {
        "word": "stimulation",
        "definition": "n. 刺激；激励，鼓舞"
    },
    {
        "word": "stimulus",
        "definition": "n. 刺激；激励；刺激物"
    },
    {
        "word": "stimulant",
        "definition": "n.  兴奋剂；刺激物；酒精饮料 adj. 激励的；使人兴奋的"
    },
    {
        "word": "sting",
        "definition": "n. 刺痛；讽刺，刺激；刺毛 vt. 刺；驱使；使…苦恼；使…疼痛 vi. 刺痛；被刺痛；感到剧痛"
    },
    {
        "word": "stir",
        "definition": "n. 搅拌；轰动 vi. 搅动；传播；走动 vt. 搅拌；激起；惹起"
    },
    {
        "word": "stock",
        "definition": "n. 股份，股票；库存；血统；树干；家畜 adj. 存货的，常备的；平凡的 vt. 进货；备有；装把手于… vi. 囤积；办货；出新芽"
    },
    {
        "word": "stocking",
        "definition": "n. 长袜"
    },
    {
        "word": "stomach",
        "definition": "n. 胃；腹部；胃口 vt. 忍受；吃下 vi. 忍受"
    },
    {
        "word": "stone",
        "definition": "n. 石头；结石； 宝石 adj. 石的，石制的 vt. 向扔石块；用石头铺"
    },
    {
        "word": "stony",
        "definition": "adj. 无情的；多石的；石头的"
    },
    {
        "word": "stool",
        "definition": "n. 凳子；粪便；厕所 vt. 引诱，诱捕 vi. 长新枝；分檗"
    },
    {
        "word": "stop",
        "definition": "n. 停止；车站；障碍；逗留 vi. 停止；中止；逗留；被塞住 vt. 停止；堵塞；断绝"
    },
    {
        "word": "stoppage",
        "definition": "n. 停止；故障；罢工；堵塞；扣留"
    },
    {
        "word": "store",
        "definition": "n. 商店；储备，贮藏；仓库 vt. 贮藏，储存"
    },
    {
        "word": "storage",
        "definition": "n. 存储；仓库；贮藏所"
    },
    {
        "word": "storm",
        "definition": "n. 暴风雨；大动荡 vt. 猛攻；怒骂 vi. 起风暴；横冲直撞；狂怒咆哮"
    },
    {
        "word": "stormy",
        "definition": "adj. 暴风雨的；猛烈的；暴躁的"
    },
    {
        "word": "story",
        "definition": "n. 故事；小说；新闻报道；来历；假话 vt. 用历史故事画装饰 vi. 说谎"
    },
    {
        "word": "storey",
        "definition": "n.  楼层；叠架的一层"
    },
    {
        "word": "stove",
        "definition": "n. 火炉；窑；温室 vt. 用火炉烤"
    },
    {
        "word": "straight",
        "definition": "n. 直；直线；直男，直女，异性恋者 adj. 直的；连续的；笔直的；正直的；整齐的；异性恋的 adv. 直接地；不断地；立即；坦率地"
    },
    {
        "word": "straighten",
        "definition": "vt. 整顿；使…改正；使…挺直；使…好转 vi. 变直；好转"
    },
    {
        "word": "straightforward",
        "definition": "adj. 简单的；坦率的；明确的；径直的 adv. 直截了当地；坦率地"
    },
    {
        "word": "strain",
        "definition": "n. 张力；拉紧；负担；扭伤；血缘 vt. 拉紧；滥用；滤去；竭力 vi. 拉紧；尽力 n. （植物、动物的）品种；种类"
    },
    {
        "word": "strange",
        "definition": "adj. 奇怪的；陌生的；外行的 adv. 奇怪地；陌生地，冷淡地"
    },
    {
        "word": "stranger",
        "definition": "n. 陌生人；外地人；局外人"
    },
    {
        "word": "strap",
        "definition": "n. 带；皮带；磨刀皮带；鞭打 vt. 用带捆绑；用皮条抽打；约束 vi. 精力旺盛地工作；受束缚"
    },
    {
        "word": "strategy",
        "definition": "n. 战略，策略"
    },
    {
        "word": "strategic",
        "definition": "adj. 战略上的，战略的"
    },
    {
        "word": "straw",
        "definition": "n. 稻草；吸管；一文不值的东西 adj. 稻草的；无价值的"
    },
    {
        "word": "stream",
        "definition": "n. 溪流；流动；潮流；光线 vt. 流出；涌出；使飘动 vi. 流；涌进；飘扬"
    },
    {
        "word": "street",
        "definition": "n. 街道 adj. 街道的"
    },
    {
        "word": "stress",
        "definition": "n. 压力；强调；紧张；重要性；重读 vt. 强调；使紧张；加压力于；用重音读"
    },
    {
        "word": "stressful",
        "definition": "adj. 紧张的；有压力的"
    },
    {
        "word": "stretch",
        "definition": "vt. 伸展,张开；（大量地）使用，消耗（金钱，时间）；使竭尽所能；使全力以赴； n. 伸展，延伸 vi. 伸展；足够买（或支付）"
    },
    {
        "word": "strict",
        "definition": "adj. 严格的；绝对的；精确的；详细的"
    },
    {
        "word": "stride",
        "definition": "n. 大步；步幅；进展 vt. 跨过；大踏步走过；跨坐在… vi. 跨；跨过；大步行走"
    },
    {
        "word": "strike",
        "definition": "n. 罢工；打击；殴打 vi. 打，打击；罢工；敲，敲击；抓；打动；穿透 vt. 打，击；罢工；撞击，冲击；侵袭；打动；到达"
    },
    {
        "word": "striking",
        "definition": "v. 打（strike的ing形式） adj. 显著的，突出的，惊人的；打击的；罢工的"
    },
    {
        "word": "string",
        "definition": "n. 线，弦，细绳；一串，一行"
    },
    {
        "word": "strip",
        "definition": "n. 带；条状；脱衣舞 vt. 剥夺；剥去；脱去衣服 vi. 脱去衣服"
    },
    {
        "word": "stripe",
        "definition": "n. 条纹，斑纹；种类 vt. 加条纹于…"
    },
    {
        "word": "strive",
        "definition": "vi. 努力；奋斗；抗争"
    },
    {
        "word": "stroke",
        "definition": "n. （游泳或划船的）划；中风；（打、击等的）一下；冲程；（成功的）举动；尝试；轻抚 vt. （用笔等）画；轻抚；轻挪；敲击；划尾桨；划掉；（打字时）击打键盘 vi. 击球；作尾桨手，指挥划桨；（打字时）击打键盘"
    },
    {
        "word": "strong",
        "definition": "adj. 坚强的；强壮的；牢固的；擅长的 adv. 强劲地；猛烈地"
    },
    {
        "word": "strength",
        "definition": "n. 力量；力气；兵力；长处"
    },
    {
        "word": "strengthen",
        "definition": "vt. 加强；巩固 vi. 变强；变坚挺"
    },
    {
        "word": "structure",
        "definition": "n. 结构；构造；建筑物 vt. 组织；构成；建造"
    },
    {
        "word": "structural",
        "definition": "adj. 结构的；建筑的"
    },
    {
        "word": "struggle",
        "definition": "n. 努力，奋斗；竞争 vt. 使劲移动；尽力使得 vi. 奋斗，努力；挣扎"
    },
    {
        "word": "student",
        "definition": "n. 学生；学者"
    },
    {
        "word": "studio",
        "definition": "n. 工作室； 演播室；画室；电影制片厂"
    },
    {
        "word": "study",
        "definition": "n. 学习，研究；课题；书房；学问 vt. 学习；考虑；攻读；细察 vi. 研究；用功"
    },
    {
        "word": "stuff",
        "definition": "n. 东西；材料；填充物；素材资料 vt. 塞满；填塞；让吃饱 vi. 吃得过多"
    },
    {
        "word": "stuffy",
        "definition": "adj. 闷热的；古板的；不通气的"
    },
    {
        "word": "stuffing",
        "definition": "n. 填料，填塞物"
    },
    {
        "word": "stupid",
        "definition": "n. 傻瓜，笨蛋 adj. 愚蠢的；麻木的；乏味的"
    },
    {
        "word": "stupidity",
        "definition": "n. 愚蠢；糊涂事"
    },
    {
        "word": "style",
        "definition": "n. 风格；时尚；类型；字体 vt. 设计；称呼；使合潮流 vi. 设计式样；用刻刀作装饰画"
    },
    {
        "word": "stylish",
        "definition": "adj. 时髦的；现代风格的；潇洒的"
    },
    {
        "word": "subject",
        "definition": "n. 主题；科目； 主语；国民 adj. 服从的；易患…的；受制于…的 vt. 使…隶属；使屈从于…"
    },
    {
        "word": "subjective",
        "definition": "adj. 主观的；个人的；自觉的"
    },
    {
        "word": "submit",
        "definition": "vi. 提交；服从 vt. 使服从；主张；呈递"
    },
    {
        "word": "submission",
        "definition": "n. 投降；提交（物）；服从；（向法官提出的）意见；谦恭"
    },
    {
        "word": "submissive",
        "definition": "adj. 顺从的；服从的；柔顺的"
    },
    {
        "word": "subsequent",
        "definition": "adj. 后来的，随后的"
    },
    {
        "word": "substance",
        "definition": "n. 物质；实质；资产；主旨"
    },
    {
        "word": "substantial",
        "definition": "n. 本质；重要材料 adj. 大量的；实质的；内容充实的"
    },
    {
        "word": "substitute",
        "definition": "n. 代用品；代替者 vi. 替代 vt. 代替"
    },
    {
        "word": "substitution",
        "definition": "n. 代替； 置换；代替物"
    },
    {
        "word": "subtract",
        "definition": "vt. 减去；扣掉"
    },
    {
        "word": "subtraction",
        "definition": "n.  减法；减少；差集"
    },
    {
        "word": "suburb",
        "definition": "n. 郊区；边缘"
    },
    {
        "word": "suburban",
        "definition": "n. 郊区居民 adj. 郊区的，城郊的；土气的；见闻不广的"
    },
    {
        "word": "subway",
        "definition": "n. 地铁；地道 vi. 乘地铁"
    },
    {
        "word": "succeed",
        "definition": "vi. 成功；继承；继任；兴旺 vt. 继承；接替；继…之后"
    },
    {
        "word": "successor",
        "definition": "n. 继承者；后续的事物"
    },
    {
        "word": "succession",
        "definition": "n. 连续；继位；继承权； 演替"
    },
    {
        "word": "successive",
        "definition": "adj. 连续的；继承的；依次的；接替的"
    },
    {
        "word": "success",
        "definition": "n. 成功，成就；胜利；大获成功的人或事物"
    },
    {
        "word": "successful",
        "definition": "adj. 成功的；一帆风顺的"
    },
    {
        "word": "such",
        "definition": "adj. 这样的，如此的"
    },
    {
        "word": "suck",
        "definition": "n. 吮吸 vt. 吸吮；吸取 vi. 吸吮；糟糕；巴结"
    },
    {
        "word": "sudden",
        "definition": "n. 突然发生的事 adj. 突然的，意外的；快速的"
    },
    {
        "word": "suddenly",
        "definition": "adv. 突然地；忽然"
    },
    {
        "word": "suffer",
        "definition": "vi. 遭受，忍受；受痛苦；经验；受损害 vt. 遭受；忍受；经历"
    },
    {
        "word": "suffering",
        "definition": "n. 受难；苦楚 v. 受苦；蒙受（suffer的ing形式） adj. 受苦的；患病的"
    },
    {
        "word": "sufficient",
        "definition": "adj. 足够的；充分的"
    },
    {
        "word": "sugar",
        "definition": "n. 糖；食糖；甜言蜜语 vt. 加糖于；粉饰 vi. 形成糖"
    },
    {
        "word": "suggest",
        "definition": "vt. 提议，建议；启发；使人想起；显示；暗示"
    },
    {
        "word": "suggestion",
        "definition": "n. 建议；示意；微量，细微的迹象"
    },
    {
        "word": "suggestive",
        "definition": "adj. 暗示的；提示的；影射的"
    },
    {
        "word": "suit",
        "definition": "n. 诉讼；恳求；套装，西装；一套外衣 vt. 适合；使适应 vi. 合适；相称"
    },
    {
        "word": "suitable",
        "definition": "adj. 适当的；相配的"
    },
    {
        "word": "suitcase",
        "definition": "n.  手提箱；衣箱"
    },
    {
        "word": "sum",
        "definition": "n. 金额；总数 vt. 总结；合计 vi. 概括"
    },
    {
        "word": "summary",
        "definition": "n. 概要，摘要，总结 adj. 简易的；扼要的"
    },
    {
        "word": "summarize",
        "definition": "vt. 总结；概述 vi. 作总结；作概括"
    },
    {
        "word": "summarise",
        "definition": "vt. 总结，概述"
    },
    {
        "word": "summer",
        "definition": "n. 夏季；全盛时期 adj. 夏季的 vi. 避暑；过夏天"
    },
    {
        "word": "summit",
        "definition": "n. 顶点；最高级会议；最高阶层 adj. 最高级的；政府首脑的"
    },
    {
        "word": "sun",
        "definition": "n. 太阳 vt. 使晒 vi. 晒太阳"
    },
    {
        "word": "sunny",
        "definition": "adj. 阳光充足的，和煦的；快活的；性情开朗的"
    },
    {
        "word": "Sunday",
        "definition": "n. 星期日；礼拜日"
    },
    {
        "word": "sunlight",
        "definition": "n. 日光"
    },
    {
        "word": "sunrise",
        "definition": "n. 日出；黎明"
    },
    {
        "word": "sunset",
        "definition": "n. 日落，傍晚"
    },
    {
        "word": "sunshine",
        "definition": "n. 阳光；愉快；晴天；快活"
    },
    {
        "word": "super",
        "definition": "n. 特级品，特大号；临时雇员 adj. 特级的；极好的"
    },
    {
        "word": "superb",
        "definition": "adj. 极好的；华丽的；宏伟的"
    },
    {
        "word": "superficial",
        "definition": "adj. 表面的；肤浅的 ；表面文章的；外表的；（人）浅薄的"
    },
    {
        "word": "superior",
        "definition": "n. 上级，长官；优胜者，高手；长者 adj. 上级的；优秀的，出众的；高傲的"
    },
    {
        "word": "superiority",
        "definition": "n. 优越，优势；优越性"
    },
    {
        "word": "supermarket",
        "definition": "n. 超级市场；自助售货商店"
    },
    {
        "word": "supervise",
        "definition": "vt. 监督，管理；指导 vi. 监督，管理；指导"
    },
    {
        "word": "supervision",
        "definition": "n. 监督，管理"
    },
    {
        "word": "supervisor",
        "definition": "n. 监督人， 管理人；检查员"
    },
    {
        "word": "supper",
        "definition": "n. 晚餐，晚饭；夜宵"
    },
    {
        "word": "supplement",
        "definition": "vt. 增补，补充 n. 增补，补充；补充物；增刊，副刊"
    },
    {
        "word": "supplementary",
        "definition": "n. 补充者；增补物 adj. 补充的；追加的"
    },
    {
        "word": "supply",
        "definition": "n. 供给，补给；供应品 vt. 供给，提供；补充 vi. 供给；替代"
    },
    {
        "word": "supplier",
        "definition": "n. 供应厂商，供应国；供应者"
    },
    {
        "word": "support",
        "definition": "n. 支持，维持；支援，供养；支持者，支撑物 vt. 支持，支撑，支援；扶持，帮助；赡养，供养"
    },
    {
        "word": "supportive",
        "definition": "adj. 支持的；支援的；赞助的"
    },
    {
        "word": "supporter",
        "definition": "n. 支持者；拥护者"
    },
    {
        "word": "suppose",
        "definition": "conj. 假使…结果会怎样 vt. 假设；认为；让（虚拟语气）；推想 vi. 猜想；料想"
    },
    {
        "word": "supposition",
        "definition": "n. 假定；推测；想像；见解"
    },
    {
        "word": "supposedly",
        "definition": "adv. 可能；按照推测；恐怕"
    },
    {
        "word": "supreme",
        "definition": "n. 至高；霸权 adj. 最高的；至高的；最重要的"
    },
    {
        "word": "supremacy",
        "definition": "n. 霸权；至高无上；主权；最高地位"
    },
    {
        "word": "sure",
        "definition": "adj. 确信的；可靠的；必定的 adv. 当然；的确"
    },
    {
        "word": "surf",
        "definition": "vi. 作冲浪运动 vt. 在…冲浪 n. 海浪，拍岸浪"
    },
    {
        "word": "surfing",
        "definition": "n. 冲浪游戏 v. 冲浪（surf的ing形式）"
    },
    {
        "word": "surface",
        "definition": "n. 表面；表层；外观 adj. 表面的，肤浅的 vt. 使浮出水面；使成平面 vi. 浮出水面"
    },
    {
        "word": "surge",
        "definition": "n. 汹涌；大浪，波涛；汹涌澎湃；巨涌 v. 汹涌；起大浪，蜂拥而来"
    },
    {
        "word": "surgery",
        "definition": "n. 外科；外科手术；手术室；诊疗室"
    },
    {
        "word": "surgical",
        "definition": "n. 外科手术；外科病房 adj. 外科的；手术上的"
    },
    {
        "word": "surgeon",
        "definition": "n. 外科医生"
    },
    {
        "word": "surname",
        "definition": "n. 姓，姓氏；绰号，别名 vt. 给…起别名；给…姓氏"
    },
    {
        "word": "surplus",
        "definition": "n. 剩余； 顺差；盈余；过剩 adj. 剩余的；过剩的"
    },
    {
        "word": "surprise",
        "definition": "n. 惊奇，诧异；突然袭击 adj. 令人惊讶的 vt. 使惊奇；奇袭"
    },
    {
        "word": "surrender",
        "definition": "n. 投降；放弃；交出；屈服 vt. 使投降；放弃；交出；听任 vi. 投降；屈服；自首"
    },
    {
        "word": "surround",
        "definition": "n. 围绕物 vt. 围绕；包围 adj. 环绕立体声的"
    },
    {
        "word": "surroundings",
        "definition": "n. 环境；周围的事物"
    },
    {
        "word": "survey",
        "definition": "n. 调查；测量；审视；纵览 vt. 调查；勘测；俯瞰 vi. 测量土地"
    },
    {
        "word": "survive",
        "definition": "vi. 幸存；活下来 vt. 幸存；生还；幸免于；比...活得长"
    },
    {
        "word": "survival",
        "definition": "n. 幸存，残存；幸存者，残存物"
    },
    {
        "word": "survivor",
        "definition": "n. 幸存者；生还者；残存物"
    },
    {
        "word": "suspect",
        "definition": "n. 嫌疑犯 adj. 可疑的；不可信的 vi. 怀疑；猜想 vt. 怀疑；猜想"
    },
    {
        "word": "suspend",
        "definition": "vt. 延缓，推迟；使暂停；使悬浮 vi. 悬浮；禁赛"
    },
    {
        "word": "suspension",
        "definition": "n. 悬浮；暂停；停职"
    },
    {
        "word": "suspense",
        "definition": "n. 悬念；悬疑；焦虑；悬而不决"
    },
    {
        "word": "suspicion",
        "definition": "n. 怀疑；嫌疑；疑心；一点儿 vt. 怀疑"
    },
    {
        "word": "suspicious",
        "definition": "adj. 可疑的；怀疑的；多疑的"
    },
    {
        "word": "sustain",
        "definition": "vt. 维持；支撑，承担；忍受；供养；证实"
    },
    {
        "word": "sustainable",
        "definition": "adj. 可以忍受的；足可支撑的；养得起的；可持续的"
    },
    {
        "word": "sustainability",
        "definition": "n. 持续性；永续性；能维持性"
    },
    {
        "word": "swallow",
        "definition": "n. 燕子；一次吞咽的量 vt. 忍受；吞没 vi. 吞下；咽下"
    },
    {
        "word": "sway",
        "definition": "n. 影响；摇摆；统治 vt. 影响；统治；使摇动 vi. 影响；摇摆"
    },
    {
        "word": "swear",
        "definition": "n. 宣誓；诅咒 vt. 发誓；咒骂 vi. 发誓，宣誓；诅咒"
    },
    {
        "word": "sweat",
        "definition": "n. 汗；水珠；焦急；苦差使 vt. 使出汗；流出；使干苦活；剥削；藉出汗减轻；焦急地期待 vi. 出汗；辛苦工作；懊恼；结水珠"
    },
    {
        "word": "sweater",
        "definition": "n. 毛线衣，运动衫；大量出汗的人，发汗剂"
    },
    {
        "word": "sweep",
        "definition": "n. 打扫，扫除；范围；全胜 vt. 扫除；猛拉；掸去 vi. 扫，打扫；席卷；扫视；袭击"
    },
    {
        "word": "sweet",
        "definition": "n. 糖果；乐趣；芳香；宝贝 adj. 甜的；悦耳的；芳香的；亲切的 （俚）酷毙了"
    },
    {
        "word": "swell",
        "definition": "n. 肿胀；隆起 vt. 使膨胀；使隆起 adj. 漂亮的；一流的 vi. 膨胀；肿胀；隆起"
    },
    {
        "word": "swift",
        "definition": "n. 褐雨燕 adj. 快的；迅速的；敏捷的；立刻的 adv. 迅速地 n. 苹果公司开创的新款编程语言，应用于iOS 8及以上的应用程序"
    },
    {
        "word": "swim",
        "definition": "n. 游泳；漂浮；眩晕 adj. 游泳时穿戴的 vi. 游泳；漂浮；浸；眩晕 vt. 游过；使浮起"
    },
    {
        "word": "swimming",
        "definition": "n. 游泳；目眩 adj. 游泳的；游泳用的；善于游泳的；晕眩的 v. 游泳；漂浮；旋转（swim的ing形式）"
    },
    {
        "word": "simmer",
        "definition": "vt. 炖 vi. 炖；内心充满；即将爆发 n. 炖；即将沸腾的状态；即将发作"
    },
    {
        "word": "swing",
        "definition": "n. 摇摆；摆动；秋千；音律；涨落 adj. 旋转的；悬挂的；强节奏爵士音乐的 vt. 使旋转；挥舞；悬挂 vi. 摇摆；转向；悬挂；大摇大摆地行走"
    },
    {
        "word": "swipe",
        "definition": "n. 猛击；尖刻的话 vt. 猛击；偷窃；刷…卡 vi. 猛打；大口喝酒"
    },
    {
        "word": "switch",
        "definition": "n. 开关；转换；鞭子 vi. 转换；抽打；换防 vt. 转换；用鞭子等抽打"
    },
    {
        "word": "sword",
        "definition": "n. 刀，剑；武力，战争"
    },
    {
        "word": "symbol",
        "definition": "n. 象征；符号；标志"
    },
    {
        "word": "symbolic",
        "definition": "adj. 象征的；符号的；使用符号的"
    },
    {
        "word": "symbolical",
        "definition": "adj. 象征的；符号的"
    },
    {
        "word": "sympathy",
        "definition": "n. 同情；慰问；赞同"
    },
    {
        "word": "sympathetic",
        "definition": "n. 交感神经；容易感受的人 adj. 同情的；交感神经的；共鸣的；赞同的；和谐的；合意的"
    },
    {
        "word": "sympathize",
        "definition": "vi. 同情，怜悯；支持"
    },
    {
        "word": "sympathise",
        "definition": "vi. 同情，支持"
    },
    {
        "word": "symptom",
        "definition": "n.  症状；征兆"
    },
    {
        "word": "system",
        "definition": "n. 制度，体制；系统；方法"
    },
    {
        "word": "systematic",
        "definition": "adj. 系统的；体系的；有系统的； 分类的；一贯的，惯常的"
    },
    {
        "word": "systematically",
        "definition": "adv. 有系统地；有组织地"
    },
    {
        "word": "table",
        "definition": "n. 桌子；表格；平地层 vt. 制表；搁置；嵌合 adj. 桌子的"
    },
    {
        "word": "tablet",
        "definition": "n. 碑；药片；写字板；小块；平板电脑 vt. 用碑牌纪念；将(备忘录等)写在板上；将…制成小片或小块"
    },
    {
        "word": "tackle",
        "definition": "n. 滑车；装备；用具；扭倒 vi. 扭倒；拦截抢球 vt. 处理；抓住；固定；与…交涉"
    },
    {
        "word": "tag",
        "definition": "n. 标签；名称；结束语；附属物 vt. 尾随，紧随；连接；起浑名；添饰 vi. 紧随"
    },
    {
        "word": "tail",
        "definition": "n. 尾巴；踪迹；辫子；燕尾服 adj. 从后面而来的；尾部的 vt. 尾随；装上尾巴 vi. 跟踪；变少或缩小"
    },
    {
        "word": "tailor",
        "definition": "n. 裁缝 vt. 剪裁；使合适 vi. 做裁缝"
    },
    {
        "word": "take",
        "definition": "vi. 拿；获得 vt. 拿，取；采取；接受（礼物等）；买，花费；耗费（时间等） n. 捕获量；看法；利益，盈益；（入场券的）售得金额"
    },
    {
        "word": "takeoff",
        "definition": "起飞 开始 起跳 起跳的，起飞的"
    },
    {
        "word": "tale",
        "definition": "n. 故事；传说；叙述；流言蜚语"
    },
    {
        "word": "talent",
        "definition": "n. 才能；天才；天资"
    },
    {
        "word": "talented",
        "definition": "adj. 有才能的；多才的"
    },
    {
        "word": "talk",
        "definition": "n. 谈话；演讲；空谈 vi. 谈话；说闲话 vt. 说；谈话；讨论"
    },
    {
        "word": "talkative",
        "definition": "adj. 饶舌的；多话的；多嘴的；爱说话的"
    },
    {
        "word": "tall",
        "definition": "adj. 高的；长的；过分的；夸大的 adv. 夸大地"
    },
    {
        "word": "tame",
        "definition": "adj. 驯服的；平淡的；乏味的；顺从的 vt. 驯养；使变得平淡；制服 vi. 变得驯服"
    },
    {
        "word": "tangible",
        "definition": "n. 有形资产 adj. 有形的；切实的；可触摸的"
    },
    {
        "word": "tank",
        "definition": "n. 坦克；水槽；池塘 vt. 把…贮放在柜内；打败 vi. 乘坦克行进"
    },
    {
        "word": "tap",
        "definition": "n. 水龙头；轻打 vt. 轻敲；轻打；装上嘴子 vi. 轻拍；轻击；轻叩 vt. 采用，利用"
    },
    {
        "word": "tape",
        "definition": "n. 胶带；磁带；带子；卷尺 vt. 录音；用带子捆扎；用胶布把…封住 vi. 用磁带录音"
    },
    {
        "word": "target",
        "definition": "n. 目标；靶子 vt. 把……作为目标；规定……的指标；瞄准某物"
    },
    {
        "word": "task",
        "definition": "n. 工作，作业；任务 vt. 分派任务"
    },
    {
        "word": "taste",
        "definition": "n. 味道；品味；审美 vt. 尝；体验 vi. 尝起来；有…的味道"
    },
    {
        "word": "tasty",
        "definition": "adj. 美味的；高雅的；有趣的 n. 可口的东西；引人入胜的东西"
    },
    {
        "word": "tax",
        "definition": "n. 税金；重负 vt. 向…课税；使负重担"
    },
    {
        "word": "taxation",
        "definition": "n. 课税，征税；税款"
    },
    {
        "word": "taxi",
        "definition": "n. 出租汽车 vt. 使滑行；用出租车送 vi. 乘出租车；滑行"
    },
    {
        "word": "tea",
        "definition": "n. 茶叶；茶树；茶点 vt. 给…沏茶 vi. 喝茶；进茶点"
    },
    {
        "word": "teach",
        "definition": "vt. 教；教授；教导 vi. 教授；讲授；当老师"
    },
    {
        "word": "teacher",
        "definition": "n. 教师；导师"
    },
    {
        "word": "teaching",
        "definition": "n. 教学；教义 v. 教学；教导（teach的ing形式）"
    },
    {
        "word": "team",
        "definition": "n. 队；组 vt. 使合作 vi. 合作"
    },
    {
        "word": "tear",
        "definition": "vi. 流泪, 撕破 n. 眼泪, （撕破的）洞或裂缝, 撕扯 vt. 撕掉, 扯下, 扰乱"
    },
    {
        "word": "technical",
        "definition": "adj. 工艺的，科技的；技术上的；专门的"
    },
    {
        "word": "technician",
        "definition": "n. 技师，技术员；技巧纯熟的人"
    },
    {
        "word": "technique",
        "definition": "n. 技巧，技术；手法"
    },
    {
        "word": "technology",
        "definition": "n. 技术；工艺；术语"
    },
    {
        "word": "tech",
        "definition": "n. 技术学院或学校 abbr. 技术（technology）；技术员（technician）"
    },
    {
        "word": "technological",
        "definition": "adj. 技术的；工艺的"
    },
    {
        "word": "tedious",
        "definition": "adj. 沉闷的；冗长乏味的"
    },
    {
        "word": "teen",
        "definition": "n. 青少年（等于teenager）；愤怒；悲哀 adj. 十几岁的（等于teenaged）"
    },
    {
        "word": "teenager",
        "definition": "n. 十几岁的青少年；十三岁到十九岁的少年"
    },
    {
        "word": "telecommunications",
        "definition": "n. 通讯行业：服务类型变更，缴纳话费，账户总览等所有业务均可通过移动设备完成"
    },
    {
        "word": "telephone",
        "definition": "n. （美）电话；电话机；电话耳机 vt. 打电话给… vi. 打电话"
    },
    {
        "word": "phone",
        "definition": "n. 电话；耳机，听筒 vt. 打电话 vi. 打电话"
    },
    {
        "word": "telescope",
        "definition": "n. 望远镜；缩叠式旅行袋 vi. 套叠；变短 vt. 压缩；使套叠"
    },
    {
        "word": "telescopic",
        "definition": "adj. 望远镜的； 远视的；套管式伸缩的；眼力好的；有先见之明的"
    },
    {
        "word": "television",
        "definition": "n. 电视，电视机；电视业"
    },
    {
        "word": "TV",
        "definition": "abbr. 电视（television）"
    },
    {
        "word": "tell",
        "definition": "vt. 告诉，说；辨别；吩咐；断定 vi. 讲述；告发，泄密；识别"
    },
    {
        "word": "telling",
        "definition": "n. 命令；叙述；吐露真情 v. 告诉；讲述（tell的ing形式）；命令 adj. 有效的；生动的；显著的"
    },
    {
        "word": "teller",
        "definition": "n. （美）出纳员；讲述者；讲故事者；计票员"
    },
    {
        "word": "temper",
        "definition": "n. 脾气；（钢等）回火；性情；倾向 vt. 使回火；锻炼；调和；使缓和 vi. 回火；调和"
    },
    {
        "word": "temperature",
        "definition": "n. 温度；体温；气温；发烧"
    },
    {
        "word": "temple",
        "definition": "n. 庙宇；寺院；神殿；太阳穴"
    },
    {
        "word": "temporary",
        "definition": "n. 临时工，临时雇员 adj. 暂时的，临时的"
    },
    {
        "word": "temporarily",
        "definition": "adv. 临时地，临时"
    },
    {
        "word": "ten",
        "definition": "num. 十个，十"
    },
    {
        "word": "tend",
        "definition": "vt. 照料，照管 vi. 趋向，倾向；照料，照顾"
    },
    {
        "word": "tendency",
        "definition": "n. 倾向，趋势；癖好"
    },
    {
        "word": "tender",
        "definition": "n. 偿付，清偿；看管人；小船 adj. 温柔的；柔软的；脆弱的；幼稚的；难对付的 vt. 提供，偿还；使…变嫩；使…变柔软 vi. 投标；变柔软"
    },
    {
        "word": "tennis",
        "definition": "n. 网球（运动）"
    },
    {
        "word": "tense",
        "definition": "n. 时态 adj. 紧张的；拉紧的 vt. 变得紧张；使拉紧 vi. 拉紧，变得紧张"
    },
    {
        "word": "tension",
        "definition": "n. 张力，拉力；紧张，不安；电压 vt. 使紧张；使拉紧"
    },
    {
        "word": "tent",
        "definition": "n. 帐篷；住处；帷幕 vt. 用帐篷遮盖；使在帐篷里住宿 vi. 住帐蓬；暂时居住"
    },
    {
        "word": "term",
        "definition": "n. 术语；学期；期限；条款；(代数式等的)项 vt. 把…叫做"
    },
    {
        "word": "terminal",
        "definition": "n. 末端；终点；终端机；极限 adj. 末端的；终点的；晚期的"
    },
    {
        "word": "terrible",
        "definition": "adj. 可怕的；很糟的；令人讨厌的 adv. 很，非常"
    },
    {
        "word": "terribly",
        "definition": "adv. 非常；可怕地；极度地"
    },
    {
        "word": "terrific",
        "definition": "adj. 极好的；极其的，非常的；可怕的"
    },
    {
        "word": "territory",
        "definition": "n. 领土，领域；范围；地域；版图"
    },
    {
        "word": "territorial",
        "definition": "n. 地方自卫队士兵 adj. 领土的；区域的；土地的；地方的"
    },
    {
        "word": "terror",
        "definition": "n. 恐怖；恐怖行动；恐怖时期；可怕的人"
    },
    {
        "word": "terrify",
        "definition": "vt. 恐吓；使恐怖；使害怕"
    },
    {
        "word": "terrorism",
        "definition": "n. 恐怖主义；恐怖行动；恐怖统治"
    },
    {
        "word": "terrorist",
        "definition": "n. 恐怖主义者，恐怖分子"
    },
    {
        "word": "test",
        "definition": "n. 试验；检验 vt. 试验；测试 vi. 试验；测试"
    },
    {
        "word": "text",
        "definition": "n.  文本；课文；主题 vt. 发短信"
    },
    {
        "word": "textbook",
        "definition": "n. 教科书，课本"
    },
    {
        "word": "textile",
        "definition": "n. 纺织品，织物 adj. 纺织的"
    },
    {
        "word": "than",
        "definition": "conj. 比（用于形容词、副词的比较级之后）；除…外（用于other等之后）；与其…（用于 rather等之后）；一…就（用于 no sooner等之后） prep. 比；超过"
    },
    {
        "word": "thank",
        "definition": "n. 感谢 vt. 感谢 int. 谢谢"
    },
    {
        "word": "thankful",
        "definition": "adj. 感谢的；欣慰的"
    },
    {
        "word": "Thanksgiving",
        "definition": ""
    },
    {
        "word": "that",
        "definition": "conj. 因为；以至于 adj. 那；那个 pron. 那；那个 adv. 那么；那样"
    },
    {
        "word": "the",
        "definition": "art. 这；那 adv. 更加（用于比较级，最高级前）"
    },
    {
        "word": "theater",
        "definition": "n. 电影院，戏院，剧场；戏剧；手术室"
    },
    {
        "word": "theatre",
        "definition": "n. 电影院，戏院；戏剧；阶梯式讲堂"
    },
    {
        "word": "theatrical",
        "definition": "adj. 戏剧性的；剧场的，戏剧的；夸张的；做作的"
    },
    {
        "word": "theft",
        "definition": "n. 盗窃；偷；赃物"
    },
    {
        "word": "their",
        "definition": "pron. 他们的，她们的；它们的"
    },
    {
        "word": "theirs",
        "definition": "pron. 他们的；她们的；它们的"
    },
    {
        "word": "them",
        "definition": "pron. 他们；它们；她们"
    },
    {
        "word": "theme",
        "definition": "n. 主题；主旋律；题目 adj. 以奇想主题布置的"
    },
    {
        "word": "themselves",
        "definition": "pron. 他们自己；他们亲自"
    },
    {
        "word": "then",
        "definition": "conj. 然后，当时 n. 那时 adv. 然后；那么；于是；当时；此外"
    },
    {
        "word": "theory",
        "definition": "n. 理论；原理；学说；推测"
    },
    {
        "word": "theoretical",
        "definition": "adj. 理论的；理论上的；假设的；推理的"
    },
    {
        "word": "therapy",
        "definition": "n. 治疗，疗法"
    },
    {
        "word": "therapist",
        "definition": "n. 临床医学家；治疗学家"
    },
    {
        "word": "therapeutic",
        "definition": "n. 治疗剂；治疗学家 adj. 治疗的；治疗学的；有益于健康的"
    },
    {
        "word": "therapeutical",
        "definition": "adj. 治疗（学）的"
    },
    {
        "word": "there",
        "definition": "n. 那个地方 adv. 在那里；在那边；在那点上 int. 你瞧"
    },
    {
        "word": "thereby",
        "definition": "adv. 从而，因此；在那附近；在那方面"
    },
    {
        "word": "therefore",
        "definition": "adv. 因此；所以"
    },
    {
        "word": "thermometer",
        "definition": "n. 温度计；体温计"
    },
    {
        "word": "these",
        "definition": "adj. 这些的 pron. 这些"
    },
    {
        "word": "thesis",
        "definition": "n. 论文；论点"
    },
    {
        "word": "they",
        "definition": "pron. 他们；它们；她们"
    },
    {
        "word": "thick",
        "definition": "n. 最拥挤部分；活动最多部分；事物的粗大浓密部分 adj. 厚的；浓的；粗大的 adv. 密集地；浓浓地，厚厚地"
    },
    {
        "word": "thief",
        "definition": "n. 小偷，贼"
    },
    {
        "word": "thin",
        "definition": "n. 细小部分 adj. 薄的；瘦的；稀薄的；微弱的 vt. 使瘦；使淡；使稀疏 vi. 变薄；变瘦；变淡 adv. 稀疏地；微弱地"
    },
    {
        "word": "thing",
        "definition": "n. 事情；东西；事物；情况"
    },
    {
        "word": "think",
        "definition": "n. 想；想法 adj. 思想的 vi. 想；认为 vt. 想；认为；想起；想像；打算"
    },
    {
        "word": "thinking",
        "definition": "n. 思考；思想；想法；意见；见解 v. 思考（think的现在分词） adj. 思考的；思想的；有理性的；好思考的"
    },
    {
        "word": "third",
        "definition": "num. 第三；三分之一 adj. 第三的；三分之一的"
    },
    {
        "word": "thirst",
        "definition": "n. 渴望；口渴；热望 vi. 渴望；口渴"
    },
    {
        "word": "thirsty",
        "definition": "adj. 口渴的，口干的；渴望的，热望的"
    },
    {
        "word": "thirteen",
        "definition": "n. 十三；十三岁；十三个 num. 十三 adj. 十三的；十三个的"
    },
    {
        "word": "thirty",
        "definition": "num. 三十 n. 三十年代 adj. 三十个的"
    },
    {
        "word": "this",
        "definition": "adj. 这；本；这个；今 pron. 这；这个；这里 adv. 这样地；这么"
    },
    {
        "word": "thorough",
        "definition": "adj. 彻底的；十分的；周密的"
    },
    {
        "word": "those",
        "definition": "adj. 那些的 pron. 那些（that的复数）"
    },
    {
        "word": "though",
        "definition": "conj. 虽然；尽管 prep. 但 adv. 可是，虽然；不过；然而"
    },
    {
        "word": "thought",
        "definition": "n. 思想；思考；想法；关心 v. 想，思考；认为（think的过去式和过去分词）"
    },
    {
        "word": "thoughtful",
        "definition": "adj. 深思的；体贴的；关切的"
    },
    {
        "word": "thousand",
        "definition": "n. 一千；一千个；许许多多 adj. 成千的；无数的"
    },
    {
        "word": "thread",
        "definition": "n. 线；螺纹；思路；衣服；线状物；玻璃纤维；路线 vt. 穿过；穿线于；使交织 vi. 通过；穿透过"
    },
    {
        "word": "threat",
        "definition": "n. 威胁，恐吓；凶兆"
    },
    {
        "word": "threaten",
        "definition": "vt. 威胁；恐吓；预示 vi. 威胁；可能来临"
    },
    {
        "word": "three",
        "definition": "num. 三 n. 三，三个 adj. 三的，三个的"
    },
    {
        "word": "thrive",
        "definition": "vi. 繁荣，兴旺；茁壮成长"
    },
    {
        "word": "throat",
        "definition": "n. 喉咙；嗓子，嗓音；窄路 vt. 开沟于；用喉音说"
    },
    {
        "word": "through",
        "definition": "prep. 通过；穿过；凭借 adj. 直达的；过境的；完结的 adv. 彻底；从头至尾"
    },
    {
        "word": "throughout",
        "definition": "prep. 贯穿，遍及 adv. 自始至终，到处；全部"
    },
    {
        "word": "throw",
        "definition": "n. 投掷；冒险 vt. 投；抛；掷 vi. 抛；投掷"
    },
    {
        "word": "thrust",
        "definition": "n.  推力；刺 vt. 插；插入；推挤 vi. 插入；用向某人刺去；猛然或用力推"
    },
    {
        "word": "thumb",
        "definition": "n. 拇指 vt. 翻阅；以拇指拨弄；作搭车手势；笨拙地摆弄 vi. 用拇指翻书页；竖起拇指要求搭车"
    },
    {
        "word": "thunder",
        "definition": "n. 雷；轰隆声；恐吓 vt. 轰隆地发出；大声喊出 vi. 打雷；怒喝"
    },
    {
        "word": "thunderous",
        "definition": "adj. 像打雷的，隆轰隆响的；多雷的，强有力的"
    },
    {
        "word": "Thursday",
        "definition": "n. 星期四"
    },
    {
        "word": "thus",
        "definition": "conj. 因此 n. 乳香 adv. 因此；从而；这样；如此"
    },
    {
        "word": "tick",
        "definition": "n. 滴答声；扁虱；记号；赊欠 vt. 标记号于；滴答地记录 vi. 发出滴答声；标以记号"
    },
    {
        "word": "ticket",
        "definition": "vt. 加标签于；指派；对…开出交通违规罚单"
    },
    {
        "word": "tide",
        "definition": "n. 趋势，潮流；潮汐 vt. 随潮漂流"
    },
    {
        "word": "tidal",
        "definition": "adj. 潮汐的；潮的，有关潮水的；定时涨落的"
    },
    {
        "word": "tidy",
        "definition": "n. 椅子的背罩 adj. 整齐的；相当大的 vi. 整理；收拾 vt. 整理；收拾；弄整齐"
    },
    {
        "word": "tie",
        "definition": "n. 领带；平局；鞋带；领结；不分胜负 vi. 打结；不分胜负；被用带（或绳子等）系住 vt. 系；约束；打结；与…成平局"
    },
    {
        "word": "tiger",
        "definition": "n. 老虎；凶暴的人"
    },
    {
        "word": "tigress",
        "definition": "n. 雌虎；凶悍的女人"
    },
    {
        "word": "tight",
        "definition": "adj. 紧的；密封的；绷紧的；麻烦的；严厉的；没空的；吝啬的 adv. 紧紧地；彻底地"
    },
    {
        "word": "tighten",
        "definition": "vt. 变紧；使变紧 vi. 绷紧；变紧"
    },
    {
        "word": "till",
        "definition": "prep. 直到 conj. 直到...为止 n.  冰碛；放钱的抽屉；备用现金 vt. 耕种；犁 vi. 耕种；耕耘"
    },
    {
        "word": "timber",
        "definition": "n. 木材；木料"
    },
    {
        "word": "time",
        "definition": "n. 时间；时代；次数；节拍；倍数 adj. 定时的；定期的；分期的 vt. 计时；测定…的时间；安排…的速度"
    },
    {
        "word": "timely",
        "definition": "adj. 及时的；适时的 adv. 及时地；早"
    },
    {
        "word": "timing",
        "definition": "n. 定时；调速；时间选择 v. 为…安排时间；测定…的时间（time的ing形式）"
    },
    {
        "word": "tin",
        "definition": "n. 锡；罐头，罐；马口铁 adj. 锡制的 vt. 涂锡于；给…包马口铁"
    },
    {
        "word": "tiny",
        "definition": "adj. 微小的；很少的"
    },
    {
        "word": "tip",
        "definition": "n. 小费；尖端；小建议，小窍门；轻拍 vt. 给小费；倾斜；翻倒；装顶端 vi. 给小费；翻倒；倾覆"
    },
    {
        "word": "tire",
        "definition": "n. 轮胎；头饰 vt. 使…疲倦；使…厌烦 vi. 疲劳；厌倦"
    },
    {
        "word": "tired",
        "definition": "v. 疲倦；对…腻烦（tire的过去分词形式） adj. 疲倦的；厌倦的，厌烦的"
    },
    {
        "word": "tiring",
        "definition": "adj. 累人的；麻烦的；无聊的；引起疲劳的 v. 厌倦；使劳累（tire的ing形式）；感到疲倦"
    },
    {
        "word": "tireless",
        "definition": "adj. 不知疲倦的；不疲劳的"
    },
    {
        "word": "tiresome",
        "definition": "adj. 烦人的，无聊的；令人讨厌的"
    },
    {
        "word": "tissue",
        "definition": "n. 组织；纸巾；薄纱；一套 vt. 饰以薄纱；用化妆纸揩去"
    },
    {
        "word": "title",
        "definition": "n. 冠军；标题；头衔；权利；字幕 adj. 冠军的；标题的；头衔的 vt. 加标题于；赋予头衔；把…称为"
    },
    {
        "word": "to",
        "definition": "prep. 到；向；（表示时间、方向）朝…方向 adv. 向前；（门等）关上"
    },
    {
        "word": "toast",
        "definition": "n. 干杯；烤面包；接受敬酒的人；（在某领域）广受赞誉的人 vt. 向…祝酒，为…干杯 vi. 烤火，取暖；使暖和；烘烤（面包片等）"
    },
    {
        "word": "tobacco",
        "definition": "n. 烟草，烟叶；烟草制品；抽烟"
    },
    {
        "word": "today",
        "definition": "n. 今天；现今 adv. 今天；现今"
    },
    {
        "word": "toe",
        "definition": "n. 脚趾；足尖 vt. 用脚尖走；以趾踏触 vi. 动脚尖；用足尖跳舞"
    },
    {
        "word": "together",
        "definition": "adj. 新潮的；情绪稳定的，做事有效率的 adv. 一起；同时；相互；连续地；总共"
    },
    {
        "word": "toilet",
        "definition": "n. 厕所，盥洗室；梳妆，打扮 vt. 给…梳妆打扮 vi. 梳妆，打扮"
    },
    {
        "word": "token",
        "definition": "n. 表征；代币；记号 adj. 象征的；表意的；作为对某事的保证的 vt. 象征；代表"
    },
    {
        "word": "tolerate",
        "definition": "vt. 忍受；默许；宽恕"
    },
    {
        "word": "tolerance",
        "definition": "n. 公差；宽容；容忍；公差"
    },
    {
        "word": "tolerant",
        "definition": "adj. 宽容的；容忍的；有耐药力的"
    },
    {
        "word": "tolerable",
        "definition": "adj. 可以的；可容忍的"
    },
    {
        "word": "toll",
        "definition": "vt. 征收；敲钟 n. 通行费；代价；钟声；伤亡人数 vi. 鸣钟；征税"
    },
    {
        "word": "tomato",
        "definition": "n. 番茄，西红柿"
    },
    {
        "word": "tomorrow",
        "definition": "n. 明天；未来 adv. 明天；未来地（等于to-morrow）"
    },
    {
        "word": "ton",
        "definition": "n. 吨；很多，大量"
    },
    {
        "word": "tonnage",
        "definition": "n. 吨位，载重量；船舶总吨数，排水量"
    },
    {
        "word": "tone",
        "definition": "n. 语气；色调；音调；音色 vt. 增强；用某种调子说 vi. 颜色调和；呈现悦目色调"
    },
    {
        "word": "tongue",
        "definition": "n. 舌头；语言 vt. 舔；斥责；用舌吹 vi. 说话；吹管乐器"
    },
    {
        "word": "tonight",
        "definition": "n. 今晚 adv. 在今晚"
    },
    {
        "word": "too",
        "definition": "adv. 太；也；很；还；非常；过度"
    },
    {
        "word": "tool",
        "definition": "n. 工具，用具；器械，机床；手段 vt. 用工具给……加工 vi. 使用工具；用机床装备工厂"
    },
    {
        "word": "tooth",
        "definition": "n. 牙齿 vt. 给……装齿 vi. 啮合"
    },
    {
        "word": "top",
        "definition": "n. 顶部，顶端；上部；首席；陀螺 adj. 最高的，顶上的；头等的 vt. 超越，超过；给…加盖；达到…的顶端 vi. 高出，超越；结束；达到顶点"
    },
    {
        "word": "topic",
        "definition": "n. 主题（等于theme）；题目；一般规则；总论"
    },
    {
        "word": "topical",
        "definition": "adj. 局部的；论题的；时事问题的；局部地区的"
    },
    {
        "word": "torch",
        "definition": "n. 火把，火炬；手电筒；启发之物 vt. 用火炬点燃 vi. 像火炬一样燃烧"
    },
    {
        "word": "torture",
        "definition": "n. 折磨；拷问；歪曲 vt. 折磨；拷问；歪曲"
    },
    {
        "word": "toss",
        "definition": "n. 投掷；摇荡；投掷的距离；掷币赌胜负 vt. 投掷；使…不安；突然抬起；使…上下摇动；与…掷币打赌 vi. 辗转；被乱扔；颠簸；掷钱币决定某事"
    },
    {
        "word": "total",
        "definition": "n. 总数，合计 adj. 全部的；完全的；整个的 vt. 总数达 vi. 合计"
    },
    {
        "word": "touch",
        "definition": "n. 接触；触觉；格调；少许 vt. 接触；触动；使轻度受害 vi. 触摸；涉及；接近；提到"
    },
    {
        "word": "tough",
        "definition": "n. 恶棍 adj. 艰苦的，困难的；坚强的，不屈不挠的；坚韧的，牢固的；强壮的，结实的 vt. 坚持；忍受，忍耐 adv. 强硬地，顽强地"
    },
    {
        "word": "tour",
        "definition": "n. 旅游，旅行；巡回演出 vt. 旅行，在……旅游；在……作巡回演出 vi. 旅行，旅游；作巡回演出"
    },
    {
        "word": "tourism",
        "definition": "n. 旅游业；游览"
    },
    {
        "word": "tourist",
        "definition": "n. 旅行者，观光客 adj. 旅游的 vt. 在旅行参观 vi. 旅游；观光 adv. 坐旅游车厢；坐经济舱"
    },
    {
        "word": "toward",
        "definition": "prep. 向；对于；为了；接近 adj. 即将来到的，进行中的"
    },
    {
        "word": "towards",
        "definition": "prep. 朝，向；对于；有助于"
    },
    {
        "word": "towel",
        "definition": "n. 毛巾，手巾； 纸巾 vi. 用毛巾擦干身体 vt. 用毛巾擦"
    },
    {
        "word": "tower",
        "definition": "n. 塔；高楼；堡垒 vi. 高耸；超越"
    },
    {
        "word": "town",
        "definition": "n. 城镇，市镇；市内商业区"
    },
    {
        "word": "township",
        "definition": "n. 镇区；小镇"
    },
    {
        "word": "toy",
        "definition": "n. 玩具；小装饰品；不值钱的东西 adj. 作为玩具的；玩物似的 vi. 玩弄；调情；随随便便地对待"
    },
    {
        "word": "trace",
        "definition": "n. 痕迹，踪迹；微量； 迹线；缰绳 vt. 追踪，查探；描绘；回溯 vi. 追溯；沿路走"
    },
    {
        "word": "track",
        "definition": "n. 轨道；足迹，踪迹；小道 vt. 追踪；通过；循路而行；用纤拉 vi. 追踪；走；留下足迹"
    },
    {
        "word": "tractor",
        "definition": "n. 拖拉机；牵引机"
    },
    {
        "word": "trade",
        "definition": "n. 贸易，交易；行业；职业 vt. 用…进行交换 vi. 交易，买卖；以物易物"
    },
    {
        "word": "trademark",
        "definition": "n. 商标 标志"
    },
    {
        "word": "tradition",
        "definition": "n. 惯例，传统；传说"
    },
    {
        "word": "traditional",
        "definition": "adj. 传统的；惯例的"
    },
    {
        "word": "traffic",
        "definition": "n. 交通；运输；贸易； 通信量 vt. 用…作交换；在…通行 vi. 交易，买卖"
    },
    {
        "word": "trafficking",
        "definition": "n. 非法交易（尤指毒品买卖） vi. 交易（traffic的现在分词）"
    },
    {
        "word": "tragedy",
        "definition": "n. 悲剧；灾难；惨案"
    },
    {
        "word": "tragic",
        "definition": "adj. 悲剧的；悲痛的，不幸的"
    },
    {
        "word": "tragically",
        "definition": "adv. 悲剧地；悲惨地"
    },
    {
        "word": "trail",
        "definition": "n. 小径；痕迹；尾部；踪迹；一串，一系列 vt. 追踪；拖；蔓延；落后于 vi. 飘出；蔓生；垂下；拖曳"
    },
    {
        "word": "trailer",
        "definition": "n. 拖车； 预告片；追踪者 vt. 用拖车载运 vi. 乘拖车式活动房屋旅行"
    },
    {
        "word": "train",
        "definition": "n. 火车；行列；长队；裙裾 v. 培养；训练；瞄准"
    },
    {
        "word": "trainer",
        "definition": "n. 助理教练；训练员；驯马师；飞行练习器；运动鞋"
    },
    {
        "word": "trainee",
        "definition": "n. 练习生，实习生；受训者；新兵；训练中的动物"
    },
    {
        "word": "training",
        "definition": "n. 训练；培养；瞄准；整枝 v. 训练；教养（train的ing形式）"
    },
    {
        "word": "tram",
        "definition": "n. 电车轨道；煤车 vt. 用煤车运载 vi. 乘电车"
    },
    {
        "word": "transaction",
        "definition": "n. 交易；事务；办理；会报，学报"
    },
    {
        "word": "transcript",
        "definition": "n. 成绩单；抄本，副本；文字记录"
    },
    {
        "word": "transfer",
        "definition": "n. 转让；转移；传递；过户 vt. 使转移；调任 vi. 转让；转学；换车"
    },
    {
        "word": "transference",
        "definition": "n. 转移；转让；调任"
    },
    {
        "word": "transform",
        "definition": "vt. 改变，使…变形；转换 vi. 变换，改变；转化"
    },
    {
        "word": "transformation",
        "definition": "n.  转化；转换；改革；变形"
    },
    {
        "word": "transit",
        "definition": "n. 运输；经过 vt. 运送 vi. 经过"
    },
    {
        "word": "translate",
        "definition": "vt. 翻译；转化；解释；转变为；调动 vi. 翻译"
    },
    {
        "word": "translation",
        "definition": "n. 翻译；译文；转化；调任"
    },
    {
        "word": "translator",
        "definition": "n. 译者；翻译器"
    },
    {
        "word": "transmit",
        "definition": "vt. 传输；传播；发射；传达；遗传 vi. 传输；发射信号"
    },
    {
        "word": "transmission",
        "definition": "n. 传动装置， 变速器；传递；传送；播送"
    },
    {
        "word": "transmitter",
        "definition": "n.  发射机， 发报机；传达人"
    },
    {
        "word": "transparent",
        "definition": "adj. 透明的；显然的；坦率的；易懂的"
    },
    {
        "word": "transparency",
        "definition": "n. 透明，透明度；幻灯片；有图案的玻璃"
    },
    {
        "word": "transplant",
        "definition": "n. 移植；移植器官；被移植物；移居者 vt. 移植；迁移；使移居 vi. 移植；迁移；移居"
    },
    {
        "word": "transplantation",
        "definition": "n. 移植；迁移；移民"
    },
    {
        "word": "transport",
        "definition": "n. 运输；运输机；狂喜；流放犯 vt. 运输；流放；使狂喜"
    },
    {
        "word": "transportation",
        "definition": "n. 运输；运输系统；运输工具；流放"
    },
    {
        "word": "trap",
        "definition": "n. 陷阱；圈套； 存水湾 vt. 诱捕；使…受限制；使…陷入困境 vi. 设陷阱"
    },
    {
        "word": "trash",
        "definition": "n. 垃圾；废物 vt. 丢弃；修剪树枝"
    },
    {
        "word": "travel",
        "definition": "n. 旅行；游历；漫游 vt. 经过；在…旅行 vi. 旅行；行进；步行；交往"
    },
    {
        "word": "tray",
        "definition": "n. 托盘；文件盒；隔底匣；（无线电的）发射箱"
    },
    {
        "word": "treasure",
        "definition": "n. 财富，财产；财宝；珍品 vt. 珍爱；珍藏"
    },
    {
        "word": "treat",
        "definition": "n. 请客；款待 vi. 探讨；请客；协商 vt. 治疗；对待；探讨；视为"
    },
    {
        "word": "treatment",
        "definition": "n. 治疗，疗法；处理；对待"
    },
    {
        "word": "treaty",
        "definition": "n. 条约，协议；谈判"
    },
    {
        "word": "tree",
        "definition": "n. 树；木料；树状物 vt. 把...赶上树 vi. 爬上树；逃上树"
    },
    {
        "word": "tremble",
        "definition": "n. 颤抖；战栗；摇晃 vi. 发抖；战栗；焦虑；摇晃 vt. 使挥动；用颤抖的声音说出"
    },
    {
        "word": "tremendous",
        "definition": "adj. 极大的，巨大的；惊人的；极好的"
    },
    {
        "word": "trend",
        "definition": "n. 趋势，倾向；走向 vt. 使…趋向 vi. 趋向，伸向"
    },
    {
        "word": "trial",
        "definition": "n. 试验；审讯；努力；磨炼 adj. 试验的；审讯的"
    },
    {
        "word": "triangle",
        "definition": "n. 三角（形）；三角关系；三角形之物；三人一组"
    },
    {
        "word": "triangular",
        "definition": "adj. 三角的， 三角形的；三人间的"
    },
    {
        "word": "trick",
        "definition": "n. 诡计；恶作剧；窍门；花招；骗局；欺诈 adj. 特技的；欺诈的；有决窍的 vt. 欺骗；哄骗；装饰；打扮 vi. 哄骗；戏弄"
    },
    {
        "word": "tricky",
        "definition": "adj. 狡猾的；机警的"
    },
    {
        "word": "trifle",
        "definition": "n. 琐事；蛋糕；少量 vt. 浪费；虚度 vi. 开玩笑；闲混；嘲弄"
    },
    {
        "word": "trigger",
        "definition": "n. 扳机； 触发器；制滑机 vt. 引发，引起；触发 vi. 松开扳柄"
    },
    {
        "word": "trip",
        "definition": "n. 旅行；绊倒；差错 vt. 绊倒；使犯错 vi. 绊倒；远足；犯错误；轻快地走"
    },
    {
        "word": "triple",
        "definition": "n. 三倍数；三个一组 adj. 三倍的；三方的 vt. 使成三倍 vi. 增至三倍"
    },
    {
        "word": "triumph",
        "definition": "n. 胜利，凯旋；欢欣 vi. 获得胜利，成功"
    },
    {
        "word": "triumphant",
        "definition": "adj. 成功的；得意洋洋的；狂欢的"
    },
    {
        "word": "trolley",
        "definition": "n. 手推车；（美）有轨电车（等于trolley car）；（英）无轨电车（等于trolleybus）；空中吊运车 vt. 用手推车运 vi. 乘电车"
    },
    {
        "word": "troop",
        "definition": "vt. 把（骑兵）编成骑兵连 vi. 群集；成群而行；结队 n. 军队；组；群；多数"
    },
    {
        "word": "trouble",
        "definition": "n. 麻烦；烦恼；故障；动乱 vt. 麻烦；使烦恼；折磨 vi. 费心，烦恼"
    },
    {
        "word": "troublesome",
        "definition": "adj. 麻烦的；讨厌的；使人苦恼的"
    },
    {
        "word": "trousers",
        "definition": "n. 裤子，长裤"
    },
    {
        "word": "truck",
        "definition": "n. 卡车；交易；手推车 adj. （美）运货汽车的 vt. 交易；以卡车运输 vi. 驾驶卡车；以物易物"
    },
    {
        "word": "TRUE",
        "definition": "n. 真实；准确 adj. 真实的；正确的 vt. 装准 adv. 真实地；准确地"
    },
    {
        "word": "truly",
        "definition": "adv. 真实地，不假；真诚地"
    },
    {
        "word": "trunk",
        "definition": "n. 树干；躯干；象鼻；汽车车尾的行李箱 adj. 干线的；躯干的；箱子的 vt. 把…放入旅行箱内"
    },
    {
        "word": "trust",
        "definition": "n. 信任，信赖；责任；托拉斯 vt. 信任，信赖；盼望；赊卖给 vi. 信任，信赖；依靠"
    },
    {
        "word": "trustee",
        "definition": "n. 受托人；托管人 vt. 移交（财产或管理权）给受托人"
    },
    {
        "word": "truth",
        "definition": "n. 真理；事实；诚实；实质"
    },
    {
        "word": "truthful",
        "definition": "adj. 真实的；诚实的"
    },
    {
        "word": "try",
        "definition": "n. 尝试；努力；试验 vt. 试图，努力；试验；审判；考验 vi. 尝试；努力；试验"
    },
    {
        "word": "trying",
        "definition": "v. 尝试（try的ing形式）；试验 adj. 难受的；难堪的；费劲的；令人厌烦的"
    },
    {
        "word": "tube",
        "definition": "n. 管；电子管；隧道；电视机 vt. 使成管状；把…装管；用管输送 vi. 乘地铁；不及格"
    },
    {
        "word": "Tuesday",
        "definition": "n. 星期二"
    },
    {
        "word": "tuition",
        "definition": "n. 学费；讲授"
    },
    {
        "word": "tumor",
        "definition": "n. 肿瘤；肿块；赘生物"
    },
    {
        "word": "tumour",
        "definition": "n.  瘤；肿瘤；肿块"
    },
    {
        "word": "tune",
        "definition": "n. 曲调；和谐；心情 vt. 调整；使一致；为…调音 vi.  调谐；协调"
    },
    {
        "word": "tunnel",
        "definition": "n. 隧道；坑道；洞穴通道 vt. 挖；在…打开通道；在…挖掘隧道 vi. 挖掘隧道；打开通道"
    },
    {
        "word": "turkey",
        "definition": "n. 土耳其（横跨欧亚两洲的国家）"
    },
    {
        "word": "turn",
        "definition": "n. 转弯；变化；(损害或有益于别人的)行为，举动，举止 vi. 转向；转变；转动 vt. 转动，使旋转；转弯；翻过来；兑换"
    },
    {
        "word": "tutor",
        "definition": "n. 导师；家庭教师；助教 vt. 辅导；约束 vi. 当家庭教师；（美）在家庭教师指导下学习"
    },
    {
        "word": "tutorial",
        "definition": "n. 个别指导 adj. 辅导的；家庭教师的，个别指导的"
    },
    {
        "word": "twelve",
        "definition": "num. 十二；十二个 n. 十二；十二个 adj. 十二的；十二个的"
    },
    {
        "word": "twelfth",
        "definition": "n. 第十二；月的第十二日 adj. 第十二的，第十二个的；十二分之一的"
    },
    {
        "word": "twenty",
        "definition": "num. 二十 n. 二十；二十年代 adj. 二十的"
    },
    {
        "word": "twentieth",
        "definition": "n. 二十分之一 num. 第二十 adj. 第二十的；二十分之一的"
    },
    {
        "word": "twice",
        "definition": "adv. 两次；两倍"
    },
    {
        "word": "twin",
        "definition": "n. 双胞胎中一人 adj. 双胞胎的 vt. 使成对 vi. 成对；生双胞胎"
    },
    {
        "word": "twist",
        "definition": "n. 扭曲；拧；扭伤 vt. 捻；拧；扭伤；编织；使苦恼 vi. 扭动；弯曲"
    },
    {
        "word": "two",
        "definition": "num. 二 n. 两个 adj. 两个的"
    },
    {
        "word": "type",
        "definition": "n. 类型，品种；模范；样式 vt. 打字；测定（血等）类型 vi. 打字"
    },
    {
        "word": "typist",
        "definition": "n. 打字员，打字者"
    },
    {
        "word": "typewriter",
        "definition": "n. 打字机"
    },
    {
        "word": "typical",
        "definition": "adj. 典型的；特有的；象征性的"
    },
    {
        "word": "tyre",
        "definition": "n.  轮胎；轮箍 vt. 装轮胎于"
    },
    {
        "word": "ugly",
        "definition": "adj. 丑陋的；邪恶的；令人厌恶的"
    },
    {
        "word": "ugliness",
        "definition": "n. 丑陋，丑陋之物"
    },
    {
        "word": "ultimate",
        "definition": "n. 终极；根本；基本原则 adj. 最终的；极限的；根本的"
    },
    {
        "word": "ultimately",
        "definition": "adv. 最后；根本；基本上"
    },
    {
        "word": "umbrella",
        "definition": "n. 雨伞；保护伞；庇护；伞形结构"
    },
    {
        "word": "uncertain",
        "definition": "adj. 无常的；含糊的；靠不住的；迟疑不决的"
    },
    {
        "word": "uncertainty",
        "definition": "n. 不确定，不可靠"
    },
    {
        "word": "uncle",
        "definition": "n. 叔叔；伯父；伯伯；舅父；姨丈；姑父"
    },
    {
        "word": "uncover",
        "definition": "vt. 发现；揭开；揭露 vi. 发现；揭示；揭去盖子"
    },
    {
        "word": "under",
        "definition": "prep. 低于，少于；在...之下 adj. 下面的；从属的 adv. 在下面；在下方"
    },
    {
        "word": "underdeveloped",
        "definition": "adj. 不发达的"
    },
    {
        "word": "underestimate",
        "definition": "n. 低估 vt. 低估；看轻"
    },
    {
        "word": "undergo",
        "definition": "vt. 经历，经受；忍受"
    },
    {
        "word": "undergraduate",
        "definition": "n. 大学生；大学肄业生 adj. 大学生的"
    },
    {
        "word": "underground",
        "definition": "n. 地下；地铁；地道；地下组织；秘密活动；先锋派团体 adj. 地下的；秘密的；先锋派的 adv. 在地下；秘密地"
    },
    {
        "word": "underline",
        "definition": "n. 下划线；下期节目预告 vt. 强调；在…下面划线；预告"
    },
    {
        "word": "undermine",
        "definition": "vt. 破坏，渐渐破坏；挖掘地基"
    },
    {
        "word": "underneath",
        "definition": "prep. 在…的下面；在…的形式下；在…的支配下 n. 下面；底部 adj. 下面的；底层的 adv. 在下面；在底下"
    },
    {
        "word": "understand",
        "definition": "vi. 理解；懂得；熟悉 vt. 理解；懂；获悉；推断；省略"
    },
    {
        "word": "understanding",
        "definition": "n. 谅解，理解；理解力；协议 v. 理解；明白（understand的ing形式） adj. 了解的；聪明的；有理解力的"
    },
    {
        "word": "undertake",
        "definition": "vt. 承担，保证；从事；同意；试图"
    },
    {
        "word": "undertaking",
        "definition": "n. 事业；企业；保证；殡仪业 v. 同意；担任；许诺（undertake的ing形式）"
    },
    {
        "word": "underwear",
        "definition": "n. 内衣物"
    },
    {
        "word": "undo",
        "definition": "vt. 取消；解开；破坏；扰乱 vi. 撤消"
    },
    {
        "word": "undoubtedly",
        "definition": "adv. 确实地，毋庸置疑的"
    },
    {
        "word": "uneasy",
        "definition": "adj. 不舒服的；心神不安的；不稳定的"
    },
    {
        "word": "unemployed",
        "definition": "adj. 失业的；未被利用的"
    },
    {
        "word": "unemployment",
        "definition": "n. 失业；失业率；失业人数"
    },
    {
        "word": "uniform",
        "definition": "n. 制服 adj. 统一的；一致的；相同的；均衡的；始终如一的 vt. 使穿制服；使成一样"
    },
    {
        "word": "uniformity",
        "definition": "n. 均匀性；一致；同样"
    },
    {
        "word": "union",
        "definition": "n. 联盟，协会；工会；联合"
    },
    {
        "word": "unique",
        "definition": "n. 独一无二的人或物 adj. 独特的，稀罕的； 唯一的，独一无二的"
    },
    {
        "word": "unit",
        "definition": "n. 单位，单元；装置； 部队；部件"
    },
    {
        "word": "unite",
        "definition": "vi. 团结；联合；混合 vt. 使…混合；使…联合；使…团结"
    },
    {
        "word": "unity",
        "definition": "n. 团结；一致；联合；个体"
    },
    {
        "word": "universe",
        "definition": "n. 宇宙；世界；领域"
    },
    {
        "word": "universal",
        "definition": "n. 一般概念；普通性 adj. 普遍的；通用的；宇宙的；全世界的；全体的"
    },
    {
        "word": "university",
        "definition": "n. 大学；综合性大学；大学校舍"
    },
    {
        "word": "unless",
        "definition": "conj. 除非，如果不 prep. 除…之外"
    },
    {
        "word": "until",
        "definition": "prep. 在…以前；到…为止 conj. 在…以前；直到…时"
    },
    {
        "word": "up",
        "definition": "prep. 在…之上；向…的较高处 n. 上升；繁荣 adj. 涨的；起床的；向上的 adv. 起来；上涨；向上"
    },
    {
        "word": "update",
        "definition": "n. 更新；现代化 vt. 更新；校正，修正；使现代化"
    },
    {
        "word": "upgrade",
        "definition": "n. 升级；上升；上坡 vt. 使升级；提升；改良品种 adj. 向上的 adv. 往上"
    },
    {
        "word": "upload",
        "definition": "vt. 上传"
    },
    {
        "word": "upon",
        "definition": "prep. 根据；接近；在…之上"
    },
    {
        "word": "upper",
        "definition": "adj. 上面的，上部的；较高的"
    },
    {
        "word": "upright",
        "definition": "n. 垂直；竖立 adj. 正直的，诚实的；垂直的，直立的；笔直的；合乎正道的"
    },
    {
        "word": "upset",
        "definition": "n. 混乱；翻倒；颠覆 adj. 心烦的；混乱的；弄翻的 vt. 使心烦；颠覆；扰乱 vi. 翻倒"
    },
    {
        "word": "upstairs",
        "definition": "n. 楼上 adj. 楼上的 adv. 在楼上，向楼上；上楼；往楼上"
    },
    {
        "word": "up-to-date",
        "definition": "adj. 最新的，最近的；现代的，新式的"
    },
    {
        "word": "upward",
        "definition": "adj. 向上的；上升的 adv. 向上"
    },
    {
        "word": "upwards",
        "definition": "adv. 向上；在上部；向上游"
    },
    {
        "word": "urban",
        "definition": "adj. 城市的；住在都市的"
    },
    {
        "word": "urbanize",
        "definition": "vt. 使都市化；使文雅"
    },
    {
        "word": "urbanise",
        "definition": "v. 使都市化, 使文雅"
    },
    {
        "word": "urbanization",
        "definition": "n. 都市化；文雅化"
    },
    {
        "word": "urbanisation",
        "definition": "n. 城市化（等于urbanization）"
    },
    {
        "word": "urge",
        "definition": "n. 强烈的欲望，迫切要求；推动力 vi. 强烈要求 vt. 力劝，催促；驱策，推进"
    },
    {
        "word": "urgent",
        "definition": "adj. 紧急的；急迫的"
    },
    {
        "word": "urgency",
        "definition": "n. 紧急；催促；紧急的事"
    },
    {
        "word": "us",
        "definition": "pron. 我们"
    },
    {
        "word": "usage",
        "definition": "n. 使用；用法；惯例"
    },
    {
        "word": "use",
        "definition": "n. 使用；用途；发挥 vt. 利用；耗费 vi. 使用，运用"
    },
    {
        "word": "user",
        "definition": "n. 用户 n. 使用者"
    },
    {
        "word": "useful",
        "definition": "adj. 有用的，有益的；有帮助的"
    },
    {
        "word": "useless",
        "definition": "adj. 无用的；无效的"
    },
    {
        "word": "used",
        "definition": "v. 用（use的过去式）；（used to）过去常做 adj. 习惯的；二手的，使用过的"
    },
    {
        "word": "usual",
        "definition": "adj. 通常的，惯例的；平常的"
    },
    {
        "word": "usually",
        "definition": "adv. 通常，经常"
    },
    {
        "word": "utility",
        "definition": "n. 实用；效用；公共设施；功用 adj. 实用的；通用的；有多种用途的"
    },
    {
        "word": "utilize",
        "definition": "vt. 利用"
    },
    {
        "word": "utilise",
        "definition": "vt. 使用（等于utilize）；利用"
    },
    {
        "word": "utilization",
        "definition": "n. 利用，使用"
    },
    {
        "word": "utilisation",
        "definition": "n. 使用（等于utilization）；利用"
    },
    {
        "word": "utmost",
        "definition": "n. 极限；最大可能 adj. 极度的；最远的"
    },
    {
        "word": "utter",
        "definition": "adj. 完全的；彻底的；无条件的 vt. 发出，表达；发射"
    },
    {
        "word": "utterly",
        "definition": "adv. 完全地；绝对地；全然地；彻底地，十足地"
    },
    {
        "word": "vacant",
        "definition": "adj. 空虚的；空的；空缺的；空闲的；茫然的"
    },
    {
        "word": "vacancy",
        "definition": "n. 空缺；空位；空白；空虚"
    },
    {
        "word": "vacation",
        "definition": "n. 假期；（房屋）搬出 vi. 休假，度假"
    },
    {
        "word": "vacuum",
        "definition": "n. 真空；空间；真空吸尘器 adj. 真空的；利用真空的；产生真空的 vt. 用真空吸尘器清扫"
    },
    {
        "word": "vague",
        "definition": "adj. 模糊的；含糊的；不明确的；暧昧的"
    },
    {
        "word": "vain",
        "definition": "adj. 徒劳的；自负的；无结果的；无用的"
    },
    {
        "word": "vanity",
        "definition": "n. 虚荣心；空虚；浮华；无价值的东西"
    },
    {
        "word": "valid",
        "definition": "adj. 有效的；有根据的；合法的；正当的"
    },
    {
        "word": "validate",
        "definition": "vt. 证实，验证；确认；使生效"
    },
    {
        "word": "validity",
        "definition": "n.  有效性；正确；正确性"
    },
    {
        "word": "valley",
        "definition": "n. 山谷；流域；溪谷"
    },
    {
        "word": "value",
        "definition": "n. 值；价值；价格；重要性；确切涵义 vt. 评价；重视；估价"
    },
    {
        "word": "valuable",
        "definition": "n. 贵重物品 adj. 有价值的；贵重的；可估价的"
    },
    {
        "word": "van",
        "definition": "n. 先锋；厢式货车；增值网 vt. 用车搬运"
    },
    {
        "word": "vanish",
        "definition": "n. 弱化音 vi. 消失；突然不见；成为零 vt. 使不见，使消失"
    },
    {
        "word": "vapor",
        "definition": "n. 蒸汽；烟雾 vt. 使……蒸发；使……汽化 vi. 蒸发；吹牛；沮丧"
    },
    {
        "word": "vapour",
        "definition": "n. 蒸气（等于vapor）；水蒸气"
    },
    {
        "word": "various",
        "definition": "adj. 各种各样的；多方面的"
    },
    {
        "word": "variety",
        "definition": "n. 多样；种类；杂耍；变化，多样化"
    },
    {
        "word": "vary",
        "definition": "vi. 变化；变异；违反 vt. 改变；使多样化；变奏"
    },
    {
        "word": "variation",
        "definition": "n. 变化； 变异，变种"
    },
    {
        "word": "variable",
        "definition": "n.  变量；可变物，可变因素 adj. 变量的；可变的；易变的，多变的；变异的， 畸变的"
    },
    {
        "word": "variant",
        "definition": "n. 变体；转化 adj. 不同的；多样的"
    },
    {
        "word": "vast",
        "definition": "n. 浩瀚；广阔无垠的空间 adj. 广阔的；巨大的；大量的；巨额的"
    },
    {
        "word": "vegetable",
        "definition": "n. 蔬菜；植物；植物人 adj. 蔬菜的；植物的"
    },
    {
        "word": "vegetarian",
        "definition": "n. 素食者；食草动物 adj. 素食的"
    },
    {
        "word": "vehicle",
        "definition": "n.  车辆；工具；交通工具；运载工具；传播媒介；媒介物"
    },
    {
        "word": "veil",
        "definition": "n. 面纱；面罩；遮蔽物；托词 vt. 遮蔽；掩饰；以面纱遮掩；用帷幕分隔 vi. 蒙上面纱；出现轻度灰雾"
    },
    {
        "word": "vendor",
        "definition": "n. 卖主；小贩；供应商； 自动售货机"
    },
    {
        "word": "venture",
        "definition": "n. 企业；风险；冒险 vt. 敢于 vi. 冒险；投机"
    },
    {
        "word": "verb",
        "definition": "n. 动词；动词词性；动词性短语或从句 adj. 动词的；有动词性质的；起动词作用的"
    },
    {
        "word": "verbal",
        "definition": "n. 动词的非谓语形式 adj. 口头的；言语的；动词的；照字面的"
    },
    {
        "word": "verify",
        "definition": "vt. 核实；查证"
    },
    {
        "word": "verification",
        "definition": "n. 确认，查证；核实"
    },
    {
        "word": "version",
        "definition": "n. 版本；译文；倒转术"
    },
    {
        "word": "versus",
        "definition": "prep. 对；与...相对；对抗"
    },
    {
        "word": "vertical",
        "definition": "n. 垂直线，垂直面 adj. 垂直的，直立的； 头顶的，顶点的"
    },
    {
        "word": "very",
        "definition": "adv. 非常，很；完全 adj. 恰好是，正是；甚至；十足的；特有的"
    },
    {
        "word": "vessel",
        "definition": "n. 船，舰； 脉管，血管；容器，器皿"
    },
    {
        "word": "veteran",
        "definition": "n. 老兵；老手；富有经验的人；老运动员 adj. 经验丰富的；老兵的"
    },
    {
        "word": "veto",
        "definition": "n. 否决权 vt. 否决；禁止 vi. 否决；禁止"
    },
    {
        "word": "via",
        "definition": "prep. 渠道，通过；经由"
    },
    {
        "word": "victim",
        "definition": "n. 受害人；牺牲品；牺牲者"
    },
    {
        "word": "victimize",
        "definition": "vt. 使受害；使牺牲；欺骗"
    },
    {
        "word": "victory",
        "definition": "n. 胜利；成功；克服"
    },
    {
        "word": "victorious",
        "definition": "adj. 胜利的；凯旋的"
    },
    {
        "word": "video",
        "definition": "n.  视频；录像，录像机；电视 adj. 视频的；录像的；电视的 v. 录制"
    },
    {
        "word": "view",
        "definition": "n. 观察；视野；意见；风景 vt. 观察；考虑；查看"
    },
    {
        "word": "viewpoint",
        "definition": "n. 观点，看法；视角"
    },
    {
        "word": "vigor",
        "definition": "n.  活力，精力"
    },
    {
        "word": "vigorous",
        "definition": "adj. 有力的；精力充沛的"
    },
    {
        "word": "village",
        "definition": "n. 村庄；村民；（动物的）群落"
    },
    {
        "word": "villager",
        "definition": "n. 乡村居民，村民"
    },
    {
        "word": "vinegar",
        "definition": "n. 醋"
    },
    {
        "word": "violate",
        "definition": "vt. 违反；侵犯，妨碍；亵渎"
    },
    {
        "word": "violation",
        "definition": "n. 违反；妨碍，侵害；违背；强奸"
    },
    {
        "word": "violent",
        "definition": "adj. 暴力的；猛烈的"
    },
    {
        "word": "violence",
        "definition": "n. 暴力；侵犯；激烈；歪曲"
    },
    {
        "word": "violin",
        "definition": "n. 小提琴；小提琴手"
    },
    {
        "word": "violinist",
        "definition": "n. 小提琴演奏者，小提琴家"
    },
    {
        "word": "virtual",
        "definition": "adj.  虚拟的；实质上的，事实上的（但未在名义上或正式获承认）"
    },
    {
        "word": "virtually",
        "definition": "adv. 事实上，几乎；实质上"
    },
    {
        "word": "virtue",
        "definition": "n. 美德；优点；贞操；功效"
    },
    {
        "word": "virtuous",
        "definition": "adj. 善良的；有道德的；贞洁的；正直的；有效力的"
    },
    {
        "word": "virus",
        "definition": "n.  病毒；恶毒；毒害"
    },
    {
        "word": "visa",
        "definition": "n. 签证 vt. 签发签证"
    },
    {
        "word": "visible",
        "definition": "n. 可见物；进出口贸易中的有形项目 adj. 明显的；看得见的；现有的；可得到的"
    },
    {
        "word": "visibility",
        "definition": "n. 能见度，可见性；能见距离；明显性"
    },
    {
        "word": "vision",
        "definition": "n. 视力；美景；眼力；幻象；想象力；幻视（漫威漫画旗下超级英雄） vt. 想象；显现；梦见"
    },
    {
        "word": "visionary",
        "definition": "n. 空想家；梦想者；有眼力的人 adj. 梦想的；幻影的"
    },
    {
        "word": "visit",
        "definition": "n. 访问；参观；逗留 vt. 访问；参观；视察 vi. 访问；暂住；闲谈"
    },
    {
        "word": "visitor",
        "definition": "n. 访问者，参观者；视察者；候鸟"
    },
    {
        "word": "visual",
        "definition": "adj. 视觉的，视力的；栩栩如生的"
    },
    {
        "word": "visualize",
        "definition": "vt. 形象，形象化；想像，设想 vi. 显现"
    },
    {
        "word": "visualise",
        "definition": "vt. 使…可见；使…具体化（等于visualize） vi. 想象；显现"
    },
    {
        "word": "vital",
        "definition": "adj. 至关重要的；生死攸关的；有活力的"
    },
    {
        "word": "vitality",
        "definition": "n. 活力，生气；生命力，生动性"
    },
    {
        "word": "vitamin",
        "definition": "n.  维生素； 维他命"
    },
    {
        "word": "vivid",
        "definition": "adj. 生动的；鲜明的；鲜艳的"
    },
    {
        "word": "vocabulary",
        "definition": "n. 词汇；词表；词汇量"
    },
    {
        "word": "vocation",
        "definition": "n. 职业；天职；天命；神召"
    },
    {
        "word": "vocational",
        "definition": "adj. 职业的，行业的"
    },
    {
        "word": "voice",
        "definition": "n. 声音；嗓音；发言权；愿望 vt. 表达；吐露"
    },
    {
        "word": "volcano",
        "definition": "n. 火山"
    },
    {
        "word": "volcanic",
        "definition": "n. 火山岩 adj. 火山的；猛烈的；易突然发作的"
    },
    {
        "word": "volleyball",
        "definition": "n. 排球"
    },
    {
        "word": "volt",
        "definition": "n. 伏特（电压单位）；环骑；闪避"
    },
    {
        "word": "voltage",
        "definition": "n.  电压"
    },
    {
        "word": "volume",
        "definition": "n. 量；体积；卷；音量；大量；册 adj. 大量的 vt. 把…收集成卷 vi. 成团卷起"
    },
    {
        "word": "voluminous",
        "definition": "adj. 大量的；多卷的，长篇的；著书多的"
    },
    {
        "word": "volunteer",
        "definition": "n. 志愿者；志愿兵 adj. 志愿的 vt. 自愿 vi. 自愿"
    },
    {
        "word": "voluntary",
        "definition": "n. 志愿者；自愿行动 adj. 自愿的；志愿的；自发的；故意的"
    },
    {
        "word": "vote",
        "definition": "n. 投票，选举；选票；得票数 vi. 选举，投票 vt. 提议，使投票；投票决定；公认"
    },
    {
        "word": "voter",
        "definition": "n. 选举人，投票人；有投票权者"
    },
    {
        "word": "voyage",
        "definition": "n. 航行；航程；旅行记 vt. 飞过；渡过 vi. 航行；航海"
    },
    {
        "word": "vulnerable",
        "definition": "adj. 易受攻击的，易受…的攻击；易受伤害的；有弱点的"
    },
    {
        "word": "vulnerability",
        "definition": "n. 易损性；弱点"
    },
    {
        "word": "wage",
        "definition": "n. 工资；代价；报偿 vt. 进行；开展 vi. 进行；发动；从事"
    },
    {
        "word": "wagon",
        "definition": "n. 货车，四轮马车 vt. 用运货马车运输货物"
    },
    {
        "word": "waggon",
        "definition": "n. 四轮运货马车；运货车"
    },
    {
        "word": "waist",
        "definition": "n. 腰，腰部"
    },
    {
        "word": "wait",
        "definition": "n. 等待；等候 vi. 等待；耽搁；伺候用餐 vt. 等候；推迟；延缓"
    },
    {
        "word": "waiter",
        "definition": "n. 服务员，侍者"
    },
    {
        "word": "waitress",
        "definition": "n. 女服务员；女侍者 vi. 做女服务生"
    },
    {
        "word": "wake",
        "definition": "n. 尾迹；守夜；守丧 vt. 叫醒；激发 vi. 醒来；唤醒；警觉"
    },
    {
        "word": "waken",
        "definition": "vt. 唤醒；使觉醒 vi. 醒来；觉醒"
    },
    {
        "word": "walk",
        "definition": "n. 步行，走；散步 vi. 走，步行；散步 vt. 散步；走过"
    },
    {
        "word": "wall",
        "definition": "n. 墙壁，围墙；似墙之物 adj. 墙壁的 vt. 用墙围住，围以墙"
    },
    {
        "word": "wallet",
        "definition": "n. 钱包，皮夹"
    },
    {
        "word": "wander",
        "definition": "vi. 徘徊；漫步；迷路；离题 vt. 游荡，漫游"
    },
    {
        "word": "want",
        "definition": "n. 需要；缺乏；贫困；必需品 vt. 需要；希望；应该；缺少 vi. 需要；缺少"
    },
    {
        "word": "war",
        "definition": "n. 战争，斗争；军事，战术；冲突，对抗，竞争 vi. 打仗，作战；对抗"
    },
    {
        "word": "ward",
        "definition": "n. 病房；保卫；监视 vt. 避开；保卫；守护"
    },
    {
        "word": "ware",
        "definition": "n. 陶器，器皿；制品；器具；货物 vt. 留心；小心"
    },
    {
        "word": "warehouse",
        "definition": "n. 仓库；货栈；大商店"
    },
    {
        "word": "warfare",
        "definition": "n. 战争；冲突"
    },
    {
        "word": "warm",
        "definition": "n. 取暖；加热 adj. 温暖的；热情的 vt. 使…兴奋；使…温暖；使…感兴趣 vi. 同情；激动；变温暖"
    },
    {
        "word": "warmth",
        "definition": "n. 温暖；热情；激动"
    },
    {
        "word": "warn",
        "definition": "vt. 警告，提醒；通知 vi. 发出警告，发出预告"
    },
    {
        "word": "warning",
        "definition": "n. 警告；预兆；预告 v. 警告（warn的ing形式） adj. 警告的；引以为戒的"
    },
    {
        "word": "warrior",
        "definition": "n. 战士，勇士；鼓吹战争的人"
    },
    {
        "word": "wary",
        "definition": "adj. 谨慎的；机警的；惟恐的；考虑周到的"
    },
    {
        "word": "wash",
        "definition": "n. 洗涤；洗的衣服；化妆水；冲积物 vt. 洗涤；洗刷；冲走；拍打 vi. 洗澡；被冲蚀"
    },
    {
        "word": "washing",
        "definition": "n. 洗涤；洗涤剂；要洗的衣物 v. 洗；使受洗礼（wash的ing形式） adj. 洗涤用的，清洗用的"
    },
    {
        "word": "waste",
        "definition": "n. 浪费；废物；荒地；损耗；地面风化物 adj. 废弃的；多余的；荒芜的 vt. 浪费；消耗；使荒芜 vi. 浪费；变消瘦；挥霍钱财"
    },
    {
        "word": "wasteful",
        "definition": "adj. 浪费的，不经济的；奢侈的"
    },
    {
        "word": "watch",
        "definition": "n. 手表；监视；守护；值班人 vt. 观察；注视；看守；警戒 vi. 观看，注视；守侯，看守"
    },
    {
        "word": "watchful",
        "definition": "adj. 注意的；警惕的；警醒的"
    },
    {
        "word": "water",
        "definition": "n. 水；海水；雨水；海域，大片的水 vt. 使湿；供以水；给…浇水 vi. 加水；流泪；流口水"
    },
    {
        "word": "waterproof",
        "definition": "n. 防水材料 vt. 使防水 adj. 防水的，不透水的"
    },
    {
        "word": "watertight",
        "definition": "adj. 水密的；不漏水的；无懈可击的"
    },
    {
        "word": "wave",
        "definition": "n. 波动；波浪；高潮；挥手示意；卷曲 vt. 卷（烫）发；向…挥手示意；使成波浪形 vi. 波动；起伏；挥手示意；摇动；呈波形"
    },
    {
        "word": "wavy",
        "definition": "adj. 多浪的；波动起伏的"
    },
    {
        "word": "wax",
        "definition": "n. 蜡；蜡状物 adj. 蜡制的；似蜡的 vt. 给…上蜡 vi. 月亮渐满；增大"
    },
    {
        "word": "way",
        "definition": "n. 方法；道路；方向；行业；习惯 adj. 途中的 adv. 大大地；远远地"
    },
    {
        "word": "we",
        "definition": "pron. 我们（主格）；笔者，本人（作者或演讲人使用）；朕，寡人"
    },
    {
        "word": "weak",
        "definition": "adj.  疲软的；虚弱的；无力的；不牢固的"
    },
    {
        "word": "weaken",
        "definition": "vt. 减少；使变弱；使变淡 vi. 变弱；畏缩；变软弱"
    },
    {
        "word": "weakness",
        "definition": "n. 弱点；软弱；嗜好"
    },
    {
        "word": "wealth",
        "definition": "n. 财富；大量；富有"
    },
    {
        "word": "wealthy",
        "definition": "n. 富人 adj. 富有的；充分的；丰裕的"
    },
    {
        "word": "weapon",
        "definition": "n. 武器，兵器"
    },
    {
        "word": "wear",
        "definition": "n. 衣物；磨损；耐久性 v. 穿着；用旧；耗损；面露"
    },
    {
        "word": "weather",
        "definition": "n. 天气；气象；气候；处境 vt. 经受住；使风化；侵蚀；使受风吹雨打 adj. 露天的；迎风的 vi. 风化；受侵蚀；经受风雨"
    },
    {
        "word": "weave",
        "definition": "vi. 纺织；编成；迂回行进 vt. 编织；编排；使迂回前进 n. 织物；织法；编织式样"
    },
    {
        "word": "web",
        "definition": "n. 网；卷筒纸；蹼；织物；圈套 vt. 用网缠住；使中圈套 vi. 形成网"
    },
    {
        "word": "webcast",
        "definition": "n. 网络广播；网络直播；网路广播"
    },
    {
        "word": "website",
        "definition": "n. 网站（全球资讯网的主机站）"
    },
    {
        "word": "wed",
        "definition": "vt. 与...结婚；娶；嫁 vi. 结婚；娶；嫁"
    },
    {
        "word": "wedding",
        "definition": "n. 婚礼，婚宴；结婚；结合 v. 与…结婚（wed的ing形式）"
    },
    {
        "word": "Wednesday",
        "definition": "n. 星期三"
    },
    {
        "word": "weed",
        "definition": "n. 杂草，野草；菸草 vt. 除草；铲除 vi. 除草"
    },
    {
        "word": "weekly",
        "definition": "n. 周刊 adj. 每周的；周刊的；一周一次的 adv. 每周一次；逐周"
    },
    {
        "word": "weekday",
        "definition": "n. 平日，普通日；工作日"
    },
    {
        "word": "weekend",
        "definition": "n. 周末，周末休假；周末聚会 adj. 周末的，周末用的 vi. 度周末"
    },
    {
        "word": "weep",
        "definition": "n. 哭泣；眼泪；滴下 vt. 哭泣；流泪；悲叹；流出或渗出液体 vi. 哭泣；流泪；哀悼；滴落；渗出液体"
    },
    {
        "word": "weigh",
        "definition": "n. 权衡；称重量 vt. 权衡；考虑；称…重量 vi. 重量为…；具有重要性；成为…的重荷；起锚"
    },
    {
        "word": "weight",
        "definition": "n. 重量，重力；负担；砝码；重要性 vt. 加重量于，使变重"
    },
    {
        "word": "weird",
        "definition": "n. （苏格兰）命运；预言 adj. 怪异的；不可思议的；超自然的"
    },
    {
        "word": "welcome",
        "definition": "n. 欢迎 vt. 欢迎 adj. 受欢迎的 int. 欢迎"
    },
    {
        "word": "welfare",
        "definition": "n. 福利；幸福；福利事业；安宁 adj. 福利的；接受社会救济的"
    },
    {
        "word": "well",
        "definition": "n. 井；源泉 adj. 良好的；健康的；适宜的 adv. 很好地；充分地；满意地；适当地 v. 涌出"
    },
    {
        "word": "well-being",
        "definition": "n. 幸福；康乐"
    },
    {
        "word": "well-known",
        "definition": "adj. 著名的；众所周知的；清楚明白的"
    },
    {
        "word": "well-off",
        "definition": "adj. 富裕的；顺利的，走运的；繁荣昌盛的"
    },
    {
        "word": "west",
        "definition": "n. 西；西方；西部 adj. 西方的；朝西的 adv. 在西方；向西方；自西方"
    },
    {
        "word": "western",
        "definition": "n. 西方人；西部片，西部小说 adj. 西方的，西部的；有西方特征的"
    },
    {
        "word": "westerner",
        "definition": "n. 西方人，欧美人；美国西部的人"
    },
    {
        "word": "wet",
        "definition": "n. 雨天；湿气 adj.  潮湿的；有雨的 vt. 弄湿 vi. 变湿"
    },
    {
        "word": "whale",
        "definition": "n. 鲸；巨大的东西 vt. 猛揍；使惨败 vi. 捕鲸"
    },
    {
        "word": "what",
        "definition": "pron. 什么；多么；多少 adv. 到什么程度，在哪一方面 adj. 什么；多么；何等 int. 什么；多么"
    },
    {
        "word": "whatever",
        "definition": "conj. 无论什么 adj. 不管什么样的 pron. 无论什么；诸如此类"
    },
    {
        "word": "whatsoever",
        "definition": "pron. 无论什么"
    },
    {
        "word": "wheat",
        "definition": "n. 小麦；小麦色"
    },
    {
        "word": "wheel",
        "definition": "n. 车轮；方向盘；转动 vt. 转动；使变换方向；给…装轮子 vi. 旋转；突然转变方向；盘旋飞行"
    },
    {
        "word": "when",
        "definition": "conj. 考虑到；既然；当…时；在…时；如果 n. 时间，时候；日期；场合 adv. 什么时候，何时；（用于时间的表达方式之后）在那时；其时；当时 pron. 那时；什么时侯"
    },
    {
        "word": "whenever",
        "definition": "conj. 每当；无论何时 adv. 不论何时；随便什么时候"
    },
    {
        "word": "where",
        "definition": "conj. 在…的地方 n. 地点 adv. 在哪里 pron. 哪里"
    },
    {
        "word": "wherever",
        "definition": "conj. 无论在哪里；无论什么情况下 adv. 无论什么地方；究竟在哪里"
    },
    {
        "word": "whereas",
        "definition": "conj. 然而；鉴于；反之"
    },
    {
        "word": "whether",
        "definition": "conj. 是否；不论 pron. 两个中的哪一个"
    },
    {
        "word": "which",
        "definition": "adj. 哪一个；哪一些 pron. 哪/那一个；哪/那一些"
    },
    {
        "word": "whichever",
        "definition": "adj. 无论哪个；无论哪些 pron. 任何一个；无论哪个"
    },
    {
        "word": "while",
        "definition": "conj. 虽然；然而；当……的时候 n. 一会儿；一段时间 vt. 消磨；轻松地度过"
    },
    {
        "word": "whilst",
        "definition": "conj. 同时；时时，有时；当…的时候"
    },
    {
        "word": "whip",
        "definition": "n. 鞭子；抽打；车夫； 搅拌器 vt. 抽打；煽动；搅打（蛋，奶油）；彻底击败 vi. 抽打；急走；拍击"
    },
    {
        "word": "whisky",
        "definition": "n. 威士忌酒 adj. 威士忌酒的"
    },
    {
        "word": "whisper",
        "definition": "n. 私语；谣传；飒飒的声音 vi. 耳语；密谈；飒飒地响 vt. 低声说出"
    },
    {
        "word": "whistle",
        "definition": "n. 口哨；汽笛；呼啸声 vt. 吹口哨；鸣汽笛"
    },
    {
        "word": "white",
        "definition": "n. 白色；洁白；白种人 adj. 白色的；白种的；纯洁的"
    },
    {
        "word": "who",
        "definition": "pron. 谁；什么人"
    },
    {
        "word": "whoever",
        "definition": "pron. 无论谁；任何人 n. 《爱谁谁》（电影名）"
    },
    {
        "word": "whole",
        "definition": "n. 整体；全部 adj. 完整的；纯粹的"
    },
    {
        "word": "wholly",
        "definition": "adv. 完全地；全部；统统"
    },
    {
        "word": "whom",
        "definition": "pron. 谁（who的宾格）"
    },
    {
        "word": "whose",
        "definition": "pron. 谁的（疑问代词）"
    },
    {
        "word": "why",
        "definition": "int. 哎呀！什么？ adv. 为什么"
    },
    {
        "word": "wide",
        "definition": "n. 大千世界 adj. 广泛的；宽的，广阔的；张大的；远离目标的 adv. 广泛地；广阔地；充分地"
    },
    {
        "word": "width",
        "definition": "n. 宽度；广度"
    },
    {
        "word": "widen",
        "definition": "vt. 放宽 vi. 变宽"
    },
    {
        "word": "widespread",
        "definition": "adj. 普遍的，广泛的；分布广的"
    },
    {
        "word": "widow",
        "definition": "n. 寡妇；孀妇 vt. 使成寡妇"
    },
    {
        "word": "widower",
        "definition": "n. 鳏夫"
    },
    {
        "word": "wife",
        "definition": "n. 妻子，已婚妇女；夫人"
    },
    {
        "word": "wild",
        "definition": "n. 荒野 adj. 野生的；野蛮的；狂热的；荒凉的 adv. 疯狂地；胡乱地"
    },
    {
        "word": "wilderness",
        "definition": "n. 荒地；大量，茫茫一片"
    },
    {
        "word": "wildlife",
        "definition": "n. 野生动植物 adj. 野生动植物的"
    },
    {
        "word": "will",
        "definition": "n. 意志；决心；情感；遗嘱；意图；心愿 vt. 决心要；遗赠；用意志力使 vi. 愿意；下决心 aux. 将；愿意；必须"
    },
    {
        "word": "willing",
        "definition": "adj. 乐意的；自愿的；心甘情愿的 v. 决心；用意志力驱使；将（财产等）遗赠某人（will的现在分词）"
    },
    {
        "word": "willingness",
        "definition": "n. 乐意；心甘情愿；自动自发"
    },
    {
        "word": "willpower",
        "definition": "n. 意志力；毅力"
    },
    {
        "word": "win",
        "definition": "n. 赢；胜利 vt. 赢得；在…中获胜；劝诱 vi. 赢；获胜；成功"
    },
    {
        "word": "winner",
        "definition": "n. 胜利者"
    },
    {
        "word": "wind",
        "definition": "vi. 缠绕；上发条；吹响号角 n. 风；呼吸；气味；卷绕 vt. 缠绕；上发条；使弯曲；吹号角；绕住或缠住某人"
    },
    {
        "word": "windy",
        "definition": "adj. 多风的，有风的；腹胀的；吹牛的"
    },
    {
        "word": "window",
        "definition": "n. 窗；窗口；窗户"
    },
    {
        "word": "wine",
        "definition": "n. 酒，葡萄酒；紫红色 vt. 请…喝酒 vi. 喝酒"
    },
    {
        "word": "winery",
        "definition": "n. 酿酒厂；葡萄酒酿造厂（复数wineries）"
    },
    {
        "word": "wing",
        "definition": "n. 翼；翅膀；飞翔；派别；侧厅，耳房，厢房 vt. 使飞；飞过；空运；增加…速度；装以翼 vi. 飞行"
    },
    {
        "word": "winter",
        "definition": "n. 冬季；年岁；萧条期 adj. 冬天的；越冬的 vi. 过冬"
    },
    {
        "word": "wipe",
        "definition": "n. 擦拭；用力打 vi. 擦；打 vt. 擦；消除；涂上"
    },
    {
        "word": "wire",
        "definition": "n. 电线；金属丝；电报 vt. 拍电报；给…装电线 vi. 打电报"
    },
    {
        "word": "wireless",
        "definition": "n. 无线电 adj. 无线的；无线电的 vt. 用无线电报与…联系；用无线电报发送 vi. 打无线电报；打无线电话"
    },
    {
        "word": "wise",
        "definition": "adj. 明智的；聪明的；博学的 vt. 使知道；教导 vi. 了解"
    },
    {
        "word": "wisdom",
        "definition": "n. 智慧，才智；明智；学识；至理名言"
    },
    {
        "word": "wish",
        "definition": "n. 希望；祝福；心愿 vt. 祝愿；渴望；向…致问候语 vi. 愿望；需要"
    },
    {
        "word": "wit",
        "definition": "n. 智慧；才智；智力 v. <古>知道；即"
    },
    {
        "word": "witty",
        "definition": "adj. 诙谐的；富于机智的"
    },
    {
        "word": "with",
        "definition": "prep. 用；随着；支持；和…在一起"
    },
    {
        "word": "withdraw",
        "definition": "vt. 撤退；收回；撤消；拉开 vi. 撤退；离开"
    },
    {
        "word": "withdrawal",
        "definition": "n. 撤退，收回；提款；取消；退股"
    },
    {
        "word": "within",
        "definition": "prep. 在…之内 n. 里面 adv. 在内部"
    },
    {
        "word": "without",
        "definition": "prep. 没有；超过；在…外面 n. 外部；外面 adv. 户外；在外面；没有或不显示某事物"
    },
    {
        "word": "withstand",
        "definition": "vt. 抵挡；禁得起；反抗 vi. 反抗"
    },
    {
        "word": "witness",
        "definition": "n. 证人；目击者；证据 vt. 目击；证明；为…作证 vi. 作证人"
    },
    {
        "word": "wolf",
        "definition": "n. 狼；色狼；残忍贪婪之人 vt. 大吃；狼吞虎咽地吃"
    },
    {
        "word": "woman",
        "definition": "n. 妇女；女性；成年女子"
    },
    {
        "word": "wonder",
        "definition": "n. 惊奇；奇迹；惊愕 adj. 奇妙的；非凡的 vi. 怀疑；想知道；惊讶 vt. 怀疑；惊奇；对…感到惊讶"
    },
    {
        "word": "wonderful",
        "definition": "adj. 极好的，精彩的，绝妙的；奇妙的；美妙；胜；神妙"
    },
    {
        "word": "wood",
        "definition": "n. 木材；木制品；树林 vt. 植林于；给…添加木柴 vi. 收集木材"
    },
    {
        "word": "wooden",
        "definition": "adj. 木制的；僵硬的，呆板的"
    },
    {
        "word": "wool",
        "definition": "n. 羊毛；毛线；绒线；毛织品；毛料衣物"
    },
    {
        "word": "woolen",
        "definition": "n. 毛织品 adj. 羊毛的；羊毛制的"
    },
    {
        "word": "woollen",
        "definition": "n. 毛织品 adj. 羊毛制的"
    },
    {
        "word": "word",
        "definition": "n.  单词；话语；消息；诺言；命令 vt. 用言辞表达"
    },
    {
        "word": "wording",
        "definition": "n.  措辞；用语；语法 v. 用词语表达；讲话（word的ing形式）"
    },
    {
        "word": "work",
        "definition": "n. 工作； 功；产品；操作；职业；行为；事业；工厂；著作；文学、音乐或艺术作品 vt. 使工作；操作；经营；使缓慢前进 vi. 工作；运作；起作用"
    },
    {
        "word": "worker",
        "definition": "n. 工人；劳动者；职蚁"
    },
    {
        "word": "workforce",
        "definition": "n. 劳动力；工人总数，职工总数"
    },
    {
        "word": "workout",
        "definition": "n. 锻炼；练习；试验"
    },
    {
        "word": "workshop",
        "definition": "n. 车间；研讨会；工场；讲习班"
    },
    {
        "word": "world",
        "definition": "n. 世界；领域；世俗；全人类；物质生活"
    },
    {
        "word": "worldwide",
        "definition": "adj. 全世界的 adv. 在世界各地"
    },
    {
        "word": "worm",
        "definition": "n. 虫，蠕虫；蜗杆；螺纹；小人物 vt. 使蠕动；给除虫；使缓慢前进 vi. 慢慢前进；蠕行"
    },
    {
        "word": "worry",
        "definition": "n. 担心；烦恼；撕咬 vi. 担心；烦恼；撕咬 vt. 担心；发愁；折磨"
    },
    {
        "word": "worried",
        "definition": "adj. 担心的"
    },
    {
        "word": "worse",
        "definition": "n. 更坏的事；更恶劣的事 adj. 更坏的；更差的；更恶劣的（bad的比较级）；（病情）更重的（ill的比较级） adv. 更糟；更坏；更恶劣地；更坏地"
    },
    {
        "word": "worship",
        "definition": "n. 崇拜；礼拜；尊敬 vt. 崇拜；尊敬；爱慕 vi. 拜神；做礼拜"
    },
    {
        "word": "worst",
        "definition": "n. 最坏；最坏的时候 adj. 最差的，最坏的；最不利的；效能最低的 adv. 最坏地；最不利地"
    },
    {
        "word": "worth",
        "definition": "n. 价值；财产 adj. 值…的"
    },
    {
        "word": "worthless",
        "definition": "adj. 无价值的；不值钱的；卑微的"
    },
    {
        "word": "worthwhile",
        "definition": "adj. 值得做的，值得花时间的"
    },
    {
        "word": "worthy",
        "definition": "n. 杰出人物；知名人士 adj. 值得的；有价值的；配得上的，相称的；可尊敬的；应…的"
    },
    {
        "word": "worthiness",
        "definition": "n. 值得；相当；有价值"
    },
    {
        "word": "would",
        "definition": "aux. 将，将要；愿意 v. will的过去式"
    },
    {
        "word": "wound",
        "definition": "n. 创伤，伤口 vt. 使受伤 vi. 受伤，伤害"
    },
    {
        "word": "wrap",
        "definition": "n. 外套；围巾 vt. 包；缠绕；隐藏；掩护 vi. 包起来；缠绕；穿外衣"
    },
    {
        "word": "wrapping",
        "definition": "n. 包装纸，包装材料 v. 裹住（wrap的ing形式） adj. 包装用的"
    },
    {
        "word": "wreck",
        "definition": "n. 破坏；失事；残骸；失去健康的人 vt. 破坏；使失事；拆毁 vi. 失事；营救失事船只"
    },
    {
        "word": "wreckage",
        "definition": "n. （失事船或飞机等的）残骸；（船只等的）失事"
    },
    {
        "word": "wrinkle",
        "definition": "n. 皱纹 vi. 起皱 vt. 使起皱纹"
    },
    {
        "word": "wrist",
        "definition": "n. 手腕；腕关节 vt. 用腕力移动"
    },
    {
        "word": "write",
        "definition": "vi. 写，写字；写作，作曲；写信 vt. 写，书写；写信给；著述"
    },
    {
        "word": "writer",
        "definition": "n. 作家；作者"
    },
    {
        "word": "writing",
        "definition": "n. 书写；作品；著作； 笔迹 v. 书写（write的ing形式）"
    },
    {
        "word": "wrong",
        "definition": "n. 坏事；不公正 adj. 错误的；失常的；不适当的 vt. 委屈；无理地对待；诽谤 adv. 错误地；邪恶地，不正当地"
    },
    {
        "word": "x-ray",
        "definition": "n. 射线；射线照片 adj. X光的；与X射线有关的 vt. 用X光线检查 vi. 使用X光"
    },
    {
        "word": "yard",
        "definition": "n. 院子；码（英制中丈量长度单位，1码=3英尺）；庭院；帆桁 vt. 把…关进或围在畜栏里"
    },
    {
        "word": "year",
        "definition": "n. 年；年度；历年；年纪；一年的期间；某年级的学生"
    },
    {
        "word": "yearly",
        "definition": "n. 年刊；年鉴 adj. 每年的 adv. 每年；一年一次"
    },
    {
        "word": "yell",
        "definition": "n. 喊声，叫声 vi. 大叫，叫喊 vt. 喊叫着说"
    },
    {
        "word": "yellow",
        "definition": "n. 黄色；黄种人；黄色颜料 adj. 黄色的；黄皮肤的 vt. 使变黄或发黄 vi. 变黄或发黄"
    },
    {
        "word": "yes",
        "definition": "n. 是（表示肯定） adv. 是, 是的"
    },
    {
        "word": "yeah",
        "definition": "adv. 是 int. 是"
    },
    {
        "word": "yesterday",
        "definition": "n. 昨天；往昔 adv. 昨天"
    },
    {
        "word": "yet",
        "definition": "conj. 但是；然而 adv. 还；但是；已经"
    },
    {
        "word": "yield",
        "definition": "n. 产量；收益 vt. 屈服；出产，产生；放弃 vi. 屈服，投降"
    },
    {
        "word": "yoga",
        "definition": "n. 瑜珈（意为“结合”，指修行）；瑜珈术 n. 联想可360°翻转的超轻薄笔记本电脑"
    },
    {
        "word": "yoghurt",
        "definition": "n. 酸奶（等于yoghourt）；酸乳酪"
    },
    {
        "word": "you",
        "definition": "pron. 你；你们"
    },
    {
        "word": "young",
        "definition": "n. 年轻人；（动物的）崽，仔 adj. 年轻的；初期的；没有经验的"
    },
    {
        "word": "youngster",
        "definition": "n. 年轻人；少年"
    },
    {
        "word": "your",
        "definition": "pron. 你的，你们的"
    },
    {
        "word": "yours",
        "definition": "pron. 你（们）的东西；你的责任；你的家属；来信，尊函 adj. 你（们）的（东西）；信末署名前用语"
    },
    {
        "word": "yourself",
        "definition": "pron. 你自己"
    },
    {
        "word": "yourselves",
        "definition": "pron. 你们自己；你们本人（yourself的复数）"
    },
    {
        "word": "youth",
        "definition": "n. 青年；青春；年轻；青少年时期"
    },
    {
        "word": "youthful",
        "definition": "adj. 年轻的；早期的"
    },
    {
        "word": "zero",
        "definition": "num. 零 n. 零点，零度"
    },
    {
        "word": "zone",
        "definition": "  地带、地区（德语）"
    },
    {
        "word": "zoo",
        "definition": "n. 动物园; <美俚>（铁路货车的最后一节）守车; <美俚>核粒子园"
    },
    {
        "word": "zoology",
        "definition": "n. 动物学，动物学课程; （某一地区的）全部动物，（某种动物的）动物特性"
    },
    {
        "word": "zoological",
        "definition": "adj. 动物的，动物学的 n. 动物园"
    }
];

    // 获取原本的标题
    const originalTitle = document.title;

    // 随机选择一个单词和释义
    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    // 更新页面标题为随机单词和释义
    function updateTitleWithWord() {
        const { word, definition } = getRandomWord();
        document.title = `${word} - ${definition}`;
    }

    // 恢复原本的标题
    function restoreOriginalTitle() {
        document.title = originalTitle;
    }

    // 检查当前选项卡状态并更新标题
    function checkTabState() {
        if (document.visibilityState === 'visible') {
            updateTitleWithWord();
        } else {
            restoreOriginalTitle();
        }
    }

    // 监听选项卡激活事件
    document.addEventListener('visibilitychange', checkTabState);

    // 初始化
    checkTabState();
})();
