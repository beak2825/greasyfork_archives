// ==UserScript==
// @name         job-hunting
// @namespace    https://github.com/lastsunday/job-hunting-tampermonkey/
// @version      1.6.1
// @description  协助找工作，方便职位的浏览
// @author       lastsunday
// @license      MIT
// @match        https://we.51job.com/pc/search*
// @match        https://www.zhipin.com/web/geek/job*
// @match        https://www.zhaopin.com/*
// @match        https://www.lagou.com/wn/*
// @match        https://www.liepin.com/*
// @connect      kjxb.org
// @connect      aiqicha.baidu.com
// @connect      tool.chinaz.com
// @connect      whois.chinaz.com
// @connect      icp.aizhan.com
// @connect      job.me88.top
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @compatible   firefox Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Tampermonkey
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @require      https://unpkg.com/jquery
// @require      https://unpkg.com/dayjs
// @downloadURL https://update.greasyfork.org/scripts/498159/job-hunting.user.js
// @updateURL https://update.greasyfork.org/scripts/498159/job-hunting.meta.js
// ==/UserScript==

//app css
const appCss = `
.__boss_time_tag,
.__zhipin_time_tag,
.__zhilian_time_tag,
.__liepin_time_tag {
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(229, 248, 248);
  color: #00a6a7;
  padding: 0 8px;
  font-size: 14px;
  border-radius: 0 0 0 4px;
  text-align: right;
}
/* 
.__zhipin_time_tag {
    position: absolute;
    right: 0;
    top: 0;
    background: #426eff;
    color: white;
    padding: 0 8px;
    font-size: 14px;
    border-radius: 0 0 0 4px;
} */

.__job51_time_tag {
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(229, 248, 248);
  color: #00a6a7;
  padding: 0 8px;
  font-size: 14px;
  border-radius: 0 0 0 4px;
  text-align: right;
}

.__jobsdb_time_tag {
  position: absolute;
  right: 0;
  background: rgba(229, 248, 248);
  color: #00a6a7;
  padding: 0 8px;
  font-size: 14px;
  border-radius: 0 0 0 4px;
  text-align: right;
  margin-right: 57px;
  margin-top: 10px;
}

/*for jbsdb job item*/
div[data-search-sol-meta] {
  display: flex;
}

/* 与BOSS直聘的筛选器样式 .condition-filter-select .current-select 保持一致*/
.__boss_filter.condition-filter-select .current-select::after {
  content: unset;
}
.__boss_filter.condition-filter-select .current-select {
  padding-right: 12px;
}
.__boss_filter_result-hidden {
  display: none;
}

.__is_outsourcing_or_training {
}

.__rencent_update {
  color: red;
}

.__time_tag_base_text_font {
  color: white;
  font-size: 12px;
  line-height: 18px;
}

.echo-like .echo-like__icon {
}

.echo-like__count {
}

.__company_info_search {
  display: flex;
  padding: 5px;
  font-size: 14px;
  color: #414a60;
  flex-wrap: wrap;
}

.__company_info_quick_search {
  display: flex;
  font-size: 14px;
  color: #414a60;
  padding: 8px;
  flex-direction: column;
  background-color: lightgoldenrodyellow;
  border-radius: 10px;
}

.__company_info_quick_search_item {
  display: flex;
  padding: 2px;
  align-items: baseline;
  a {
    padding-right: 10px;
    font-size: 14px;
    color: blue;
  }

  a:hover {
    background-color: yellowgreen;
    color: white;
  }
}

.__company_info_quick_search_item > div {
  display: flex;
  align-items: inherit;
  padding-right: 10px;
}

.__company_info_quick_search_item_label {
  font-weight: 600;
  align-self: baseline;
}

.__company_info_quick_search_item_value {
  flex: 1;
}

.__company_info_quick_search_button {
  background-color: mediumblue;
  color: white;
  padding: 1px 8px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
}

.__company_info_other_channel {
  justify-content: end;
}

.__BOSS_function_panel {
  padding-left: 10px;
  padding-bottom: 10px;
  margin-right: 10px;
}

.__51JOB_function_panel {
  margin-left: -10px;
  margin-top: 5px;
  margin-right: 12px;
}

.__ZHILIAN_function_panel {
  margin-left: -10px;
}

.__LAGOU_function_panel {
  padding-left: 17px;
  margin-right: 10px;
}

.__JOBSDB_function_panel {
  display: flex;
  flex-direction: column;
  position: relative;
}

.__LIEPIN_function_panel {
}

.__comment_wrapper {
  display: flex;
  justify-content: end;
  font-size: 14px;
  color: #414a60;
}

.__BOSS_comment_wrapper {
  padding-right: 10px;
  padding-bottom: 10px;
}

.__51JOB_comment_wrapper {
}

.__ZHILIAN_comment_wrapper {
}

.__LAGOU_comment_wrapper {
  padding-right: 10px;
  padding-bottom: 5px;
}

.__JOBSDB_comment_wrapper {
  padding-right: 25px;
}

.__LIEPIN_comment_wrapper {
  padding-right: 25px;
}

.__logo_in_function_panel {
  position: absolute;
  right: 0;
  bottom: 0px;
  width: 20px;
}

.__first_browse_time {
  font-size: 14px;
  color: #414a60;
}

.__LIEPIN_job_item {
  position: relative;
  background-color: white;
  padding: 10px;
  margin: 10px;
}

.__website_value_success {
  background-color: yellowgreen;
  color: white;
  font-size: 12px;
}

.__website_value_error {
  background-color: red;
  color: white;
  font-size: 12px;
}

.__website_value_loading {
  background-color: black;
  color: white;
  font-size: 12px;
}

.__ZHILIAN_job_item {
  position: relative;
  padding-left: 20px;
  padding-bottom: 10px;
}
`;

const trainingData = [
  "森迪信息科技",
  "鼎育软件",
  "麦菲尔膜",
  "高科(北京)",
  "闪克信息技术",
  "金睿云数据",
  "邦飞科技",
  "达内",
  "贝立美科技",
  "谢尔科技",
  "诚迅网络科技",
  "蜗牛创想",
  "蓝色曙光信息技术",
  "蓉渝云科技",
  "莫等闲教育",
  "荣新广育科技",
  "荣新中关村IT",
  "英才软件职业",
  "腾瑞恒信网络科技",
  "联成科大信息技术",
  "红糖科技",
  "神骏网络科技",
  "硅谷高科",
  "睿远商务信息咨询",
  "睿峰科技",
  "百年有为科技",
  "百单网",
  "登客网互联网科技",
  "瑞恒创想信息科技",
  "狮子座",
  "牛牛牛",
  "爱尚智观科技",
  "火山石网络",
  "清睿创新科技",
  "深圳市花花网网络",
  "深圳市奕非网络",
  "深圳市大森网云",
  "深圳市一览网络股份",
  "海文信息",
  "海德智和科技",
  "法赛特科技",
  "河北融海行房地产经纪",
  "沈阳茵特",
  "汇益商务信息咨询",
  "汇智动力",
  "汇新优科科技",
  "汇众益智科技",
  "武汉时光机科技",
  "武创信息科技",
  "欣阳科技",
  "森迪信息科技",
  "株式会社",
  "朗沃信息技术",
  "暮光时代科技",
  "智游网络",
  "智慧创想科技",
  "晶美莱特",
  "晟司科技",
  "晋佑科技",
  "旅烨网络科技",
  "新华电脑",
  "掌宝合力科技",
  "拾得科技",
  "拜纳睿",
  "才秀人人科技",
  "成都莫等闲教育",
  "成都翡翠科技",
  "成都旭祥科技",
  "成都宜简投资",
  "成都和禹网络",
  "成都博睿斯科网络",
  "成都华炜云商",
  "成都伟韧",
  "慧与信息技术",
  "恒安瑞达科技",
  "怪狗软件",
  "御雪网络科技",
  "广州留余香信息",
  "广州流氓兔网络",
  "广州七锦宫网络",
  "广东溢达科技",
  "广东樱雪科技",
  "巴人互动成都网络科技",
  "川软信息",
  "川汇科技",
  "尚观科技",
  "尚学堂",
  "安腾尚美软件",
  "学盟英才",
  "奕非网络",
  "奇美拉科技",
  "奇点物流",
  "奇佳科技",
  "天雄瑞科",
  "天纵科技",
  "天科同创科技",
  "天时利教育科技",
  "多迪",
  "四川金明科技",
  "四川格睿泰思信息科技",
  "四川复兴教育",
  "嘉宇三鑫",
  "君飞环保",
  "双维商贸",
  "博通科技",
  "博朗云软科技",
  "博为峰软件",
  "南充和胜网络",
  "卓维信息技术",
  "卓睿信息技术",
  "卓新智趣",
  "卓新思创科技",
  "华软高科",
  "华育网科技",
  "华育国际",
  "华育信息技术",
  "华夏天网智能科技",
  "华信智原科技",
  "华为高科",
  "华为云集",
  "北京金睿云",
  "北京邮电大学“互联网+”人才培养基地",
  "北京托普云数据",
  "北京成文科技",
  "北京博朗云",
  "北京博朗云软",
  "北京中科软云",
  "动听音乐文化传播",
  "创立信息科技有限责任公司",
  "创想天空",
  "创享源信息技术",
  "兴学信息技术",
  "修远堂科技",
  "佰国科技",
  "伟韧科技",
  "会圆宝科技",
  "优才创智",
  "优才创智科技",
  "众软科技",
  "众软信息科技",
  "互动无限科技",
  "云软高科",
  "云软互联",
  "云知学科技",
  "云图风墨信息",
  "乐胜科技",
  "久远银海软件股份",
  "中软",
  "中航云天",
  "中科软云数据",
  "中科合迅科技",
  "中睿天成企业管理咨询",
  "中卓信息技术",
  "中关村软件",
  "中关新才",
  "东软",
  "世纪云鼎信息",
  "世纪云创",
  "上海同百实业",
  "成都寰宇思创科技有限公司",
  "开网科技(北京)有限公司成都分公司",
  "中科富盈(北京)科技有限公司",
  "华为云软(北京）科技有限公司",
  "云汇高科（北京）科技有限公司",
  "成都智育互动科技有限公司",
  "成都汇能创科科技有限公司",
  "四川育道科技有限公司",
  "成都兄弟连教育咨询有限公司",
  "优越教育",
  "成都国信安信息产业基地有限公司",
  "成都蓉橙智睿",
  "成都闪客信息技术",
  "北京钧鼎世纪科技有限公司",
  "四川蜀泰化工科技有限公司",
  "成都智云汇通科技有限公司",
  "金指创亿（北京）科技有限公司",
  "四川智游网络科技有限公司",
  "四川智游网络科技有限公司",
  "四川狮子座互联网科技有限公司",
  "慧与信息技术成都有限公司",
  "成都三个字信息技术有限公司",
  "成都暮光时代科技有限公司",
  "中软创新（北京）科技有限公司",
  "成都寰宇思创科技有限公司",
  "成都优才创智",
  "巴人互动成都网络科技有限公司",
  "中软国际教育",
  "中软软件职业培训学校",
  "成都米可科技有限公司",
  "云软高科(成都)分公司",
  "中软物联（北京）科技有限公司",
  "成都华育信息技术职业技能培训学校",
  "四川天纵科技有限公司",
  "四川新华电脑学校",
  "博创华宇（北京）科技有限公司",
  "成都五月花劳动职业技能培训学校",
  "北京中青中关村软件人才基地",
  "北京数通国软信息技术有限公司成都分公司",
  "博创华宇",
  "蜗牛创想",
  "新华集团",
  "北京千锋互联科技有限公司",
  "成都博为峰软件技术有限公司",
  "中软开创",
  "成都达内科技有限公司青羊分公司",
  "华为高科（北京）软件有限公司",
  "北京荣新广育科技有限公司",
  "成都汇智动力信息技术有限公司",
  "成都糖果时代科技有限公司",
  "华信智原教育技术有限公司",
  "中关村大学生就业实训基地",
  "成都尚学堂科技有限公司",
  "成都微银众筹数据信息技术服务有限公司",
  "四川众信互联科技有限公司",
  "北京瞻前科技发展中心（瞻前科技）",
  "上海华杰职业技能培训有限公司",
  "成都达内科技",
  "成都国信安信息产业基地有限公司",
  "深圳市易民科技有限公司",
  "深圳市新果教育发展有限公司",
  "深圳市蓝音网络传媒有限公司",
  "深圳市瑞之图装饰设计有限公司",
  "深圳亚美兹设计研究院有限公司",
  "圣名圣点设计（深圳）有限公司",
  "深圳鸿讯计算机系统有限公司",
  "深圳市星乐软件有限公司",
  "深圳诺达思科技开发有限公司",
  "深圳慧思远科技开发有限公司",
  "深圳初炼影视传媒有限公司",
  "深圳市华大智创科技有限公司",
  "深圳诺达思科技开发有限公司",
  "深圳合众艾特信息技术有限公司",
  "深圳蓝海星空信息技术有限公司",
  "深圳鑫创信息技术有限公司",
  "深圳堉云信息科技有限公司",
  "深圳深软智能设备有限公司",
  "深圳市治网络科技有限公司",
  "深圳市中深软通科技有限公司",
  "深圳市程序猿教育科技有限公司",
  "深圳市荣盛合纵科技有限公司",
  "深圳市诚至软件有限公司",
  "深圳腾尚时代信息科技有限公司",
  "深圳市沃达创科有限公司",
  "深圳径舟科技开发有限公司",
  "深圳凌岳软件科技有限公司",
  "深圳市智联云谷科技有限公司",
  "深圳市云联天下科技有限公司",
  "深圳市尚天观科技有限公司",
  "启辰星创（深圳）网络科技有限公司",
  "慧学国际科技发展(深圳)有限公司",
  "深圳市协卓软件有限公司",
  "深圳市大方网络科技有限公司",
  "深圳市坚盛网络科技有限公司",
  "深圳市通天智达网络科技有限公司",
  "深圳市哈哈网络科技有限公司",
  "深圳市创星博网络科技有限公司",
  "深圳市普达源网络科技有限公司",
  "北京才秀人人科技有限公司",
  "深圳市坚盛网络科技有限公司",
  "深圳市诚与成网络科技有限公司",
  "深圳市威尔讯达科技有限公司",
  "深圳市翔聚佳和科技有限公司",
  "深圳市洁丽保鑫科技有限公司",
  "深圳市众亿通信息科技有限公司",
  "深圳市哈哈网络科技有限公司",
  "深圳市内达倾泉科技有限公司",
  "深圳市申南道网络科技有限公司",
  "深圳市新龙暴宇科技有限公司",
  "深圳市民宇游戏网络科技有限公司",
  "深圳市万度网络技术开发有限公司",
  "深圳市天瑞地安网络科技有限公司",
  "深圳市濠汇网络科技有限公司",
  "深圳壹柒捌网络科技开发有限公司",
  "深圳市佑博网络科技有限公司",
  "深圳市实端利鑫网络科技有限公司",
  "深圳市利宇宝利科技有限公司",
  "深圳市若辰科技有限公司",
  "深圳市哈哈网络科技有限公司",
  "深圳市一二招聘有限公司",
  "深圳市万鹏利通网络科技有限公司",
  "深圳市振讯网络科技有限公司",
  "深圳市恐龙谷网络科技有限公司",
  "深圳市瑞安制造网络科技有限公司",
  "深圳市海纳云游网络科技有限公司",
  "深圳市腾极讯科网络科技有限公司",
  "深圳市汇一道科技股份有限公司",
  "深圳市创意阁网络科技有限公司",
  "深圳市百利度康科技有限公司",
  "深圳市红鸟网络科技股份有限公司",
  "深圳市宇蓝宝泉网络科技有限公司",
  "深圳赛优软件设计有限公司",
  "深圳中星信息技术服务有限公司",
  "深圳惠科软件设计有限公司",
  "深圳市掌娱炫动信息技术有限公司",
  "广州中星集团有限公司深圳分公司",
  "深圳市泽林信息咨询有限公司",
  "深圳市汇特通网络科技有限公司",
  "深圳市大方网络科技有限公司",
  "深圳市民宇游戏网络科技有限公司",
  "深圳市益迅网络科技有限公司",
  "深圳市汇一道科技股份有限公司",
  "深圳市方特网络科技有限公司",
  "深圳市振讯网络科技有限公司",
  "深圳市远力网络科技有限公司",
  "深圳市民宇游戏网络科技有限公司",
  "深圳市蚁视网络科技有限公司",
  "深圳市智盈网络科技有限公司",
  "深圳市若辰科技有限公司",
  "深圳市哈哈网络科技有限公司",
  "深圳燕赵游戏网络科技有限公司",
  "深圳市天之腾科技有限公司",
  "深圳市鲲鹏网云科技有限公司",
  "深圳前海保百业互联科技有限公司",
  "深圳市博思创信息技术有限公司",
  "深圳市音伴尔科技有限公司",
  "深圳市华达世正科技有限公司",
  "深圳市谨信科技有限公司",
  "深圳市川石信息技术有限公司",
  "深圳市紫川软件有限公司",
  "深圳市华大智创科技有限公司",
  "深圳市皓诚网络科技有限公司",
  "深圳市时空数通科技有限公司",
  "深圳市汇欣腾达科技有限公司",
  "深圳市云联时空科技有限公司",
  "深圳市互联安达科技有限公司",
  "深圳市海通易达科技有限公司",
  "深圳市中企科创科技服务有限公司",
  "深圳市启航之星科技有限公司",
  "深圳市恩泽汇科技开发有限公司",
  "深圳市王络天下科技有限公司",
  "深圳市普晴科技有限公司",
  "深圳市泽林信息咨询有限公司",
  "深圳市华晨灏科技有限公司",
  "深圳思天下科技有限公司",
  "深圳百锤炼科技有限公司",
  "深圳哲芒科技有限公司",
  "深圳市它石信息科技有限公司",
  "深圳市鹏城互联科技有限公司",
  "深圳市鹏城互联科技有限公司",
  "深圳市前海云技术商学院有限公司",
  "深圳市一风行科技有限公司",
  "深圳市鑫精良科技有限公司",
  "深圳市宜众软件技术有限公司",
  "深圳市众软信息技术有限公司",
  "深圳市森竹科技有限公司",
  "深圳凌威信息技术有限公司",
  "深圳市中软易动科技有限公司",
  "深圳市安盛信息技术有限公司",
  "深圳七七元素科技有限公司",
  "深圳市文思联合网络技术有限公司",
  "深圳市狮子座信息技术有限公司",
  "深圳市畅享软件科技有限公司",
  "深圳市海枫科技有限公司",
  "速橙科技有限公司",
  "深圳市智蛙科技有限公司",
  "深圳云和数据信息技术有限公司",
  "深圳理方科技有限公司",
  "深圳市科唯网络科技有限公司",
  "深圳市斯密达网络科技开发有限公司",
  "深圳丰巢网络科技有限公司",
  "深圳市道云汇网络科技开发有限公司",
  "深圳洛萨科技有限公司",
  "深圳语风科技有限公司",
  "深圳七啸科技有限公司",
  "深圳市逸翔科技有限公司",
  "深圳市国信安信息科技有限公司",
  "北京华育光大科技发展有限公司",
  "深圳市瑞滋德科技有限公司",
  "深圳市丰泽高科信息技术有限公司",
  "深圳市新一代信息技术研究院",
  "深圳市华科网讯科技有限公司",
  "深圳市新一代信息技术研究院",
  "深圳英亚途科技有限公司",
  "深圳市武大新研科技有限公司",
  "深圳市易事派克科技有限公司",
  "深圳市华达世正科技有限公司",
  "深圳市普华博大科技有限公司",
  "深圳市嘀嘀达科技有限公司",
  "深圳云凌国际信息技术有限公司",
  "深圳市培睿教育科技有限公司",
  "深圳市人人上信息科技有限公司",
  "卓新智趣(北京)科技股份有限公司深圳分公司",
  "深圳市中软卓越教育科技有限公司",
  "深圳卓维信息技术有限公司",
  "深圳中软国际有限公司",
  "深圳市华维信息技术有限公司",
  "深圳市华讯技术服务有限公司",
  "北京亨隆伟业信息咨询有限责任公司深圳分公司",
  "深圳华育网科技发展有限公司",
  "深圳华育网科技发展有限公司",
  "深圳市宜众软件技术有限公司",
  "深圳逻辑思维软件有限公司",
  "深圳市鑫南豪网络科技有限公司",
  "深圳市佑谷暴网络科技有限公司",
  "深圳市宋福运网络科技有限公司",
  "深圳市伟泰安鑫网络科技有限公司",
  "深圳市洁宇网客网络科技有限公司",
  "深圳市慧极科技有限公司",
  "凌阳科技(深圳)有限公司",
  "深圳市海纳计算机科技有限公司",
  "深圳市资信利通科技有限公司",
  "深圳市门道信息咨询有限公司",
  "深圳二四六信息技术有限公司",
  "深圳国信安信息产业基地有限公司",
  "深圳尔雅赛诺信息技术有限公司",
  "深圳市提速度科技有限公司",
  "深圳文豆网络科技有限公司",
  "深圳市兴海韵通信息技术有限公司",
  "深圳思密特网络科技有限公司",
  "深圳易逐浪科技有限公司",
  "西安迪欧软件有限公司深圳分公司",
  "诺博源软件科技有限公司",
  "广州多迪网络科技有限公司深圳福田分公司",
  "广州多迪网络科技有限公司深圳宝安分公司",
  "广东晶美莱特科技有限公司",
  "广州流氓兔网络科技有限公司",
  "深圳市无忧互联科技有限公司",
  "广东华夏天网智能科技有限公司",
  "广东溢达科技有限公司",
  "广东樱雪科技有限公司",
  "广州流氓兔网络科技有限公司",
  "广东晶美莱特科技有限公司",
  "广州多迪网络科技有限公司深圳龙华分公司",
  "深圳博为峰信息技术有限公司",
  "深圳市科大信息技术有限公司",
  "深圳市泽林信息咨询有限公司",
  "深圳市起航创势科技有限公司",
  "武汉佰钧成技术有限责任公司深圳分公司",
  "深圳市新边界网络科技有限公司",
  "深圳市云游天下科技有限公司",
  "深圳市宝斯富通科技有限公司",
  "深圳市瑞合科技有限公司",
  "深圳曙之光教育咨询文化有限公司",
  "深圳市智联云谷科技有限公司",
  "深圳博睿同创信息技术有限公司",
  "深圳盛思科教文化有限公司",
  "深圳火星星际传播有限公司",
  "深圳市泰泽技术有限公司",
  "腾诚软件开发（深圳）有限公司",
  "腾诚软件开发（深圳）有限公司",
  "深圳市汇通合力科技有限公司",
  "深圳市炫彩星文化传媒有限公司",
  "深圳云天团电子商务有限公司",
  "深圳恩颂科技开发有限公司",
  "深圳市深嵌科技有限公司",
  "深圳市名瑞德国际金融服务有限公司",
  "深圳市深企互赢科技有限公司",
  "深圳市韵味世达科技有限公司",
  "深圳达内为上软件有限公司",
  "深圳市华辰软件开发科技有限公司",
  "深圳市博士天云软件开发有限公司",
  "深圳市极速传奇软件开发有限公司",
  "深圳市诺嘉冠科电子有限公司",
  "深圳前海星粤文化科技有限公司",
  "深圳市睿思源信息技术有限公司",
  "前海宝莉美（深圳）国际咨询服务有限公司",
  "深圳市大众万兴网络科技有限公司",
  "深圳市一二人力资源服务有限公司",
  "深圳市中科鸿图信息有限公司",
  "深圳市点时创新科技有限公司",
  "北京清大九鼎科技发展有限公司深圳分公司",
  "深圳市梦幻组合科技有限公司",
  "深圳市鸿程信息技术有限公司",
  "深圳瑞元信息技术有限公司",
  "广州多迪网络科技有限公司",
  "广州粤嵌通信科技股份有限公司",
  "广州市舜然网络科技有限公司",
  "广州市中拓信息科技有限公司",
  "广州市宏龙网络科技有限公司",
  "广州中星集团有限公司",
  "广州文豆网络科技有限公司",
  "广州文豆网络科技有限公司",
  "广州文豆网络科技有限公司",
  "广州文豆网络科技有限公司",
  "广州文豆网络科技有限公司",
  "广州森迪信息科技有限公司",
  "广东溢达科技有限公司",
  "广东晋佑科技股份有限公司",
  "广州神骏网络科技有限公司",
  "广东麦菲尔膜科技有限公司",
  "广州百单网互联网科技有限公司",
  "广东红松网络信息技术有限公司",
  "四川晟司科技发展有限公司",
  "四川海德智和科技有限公司",
  "四川红糖科技有限公司",
  "四川天纵科技有限公司",
  "成都谢尔科技有限公司",
  "成都乐胜科技有限公司",
  "成都闪克信息技术有限公司",
  "成都汇智动力信息技术有限公司",
  "成都蜗牛创想科技有限公司",
  "成都中软卓越信息技术有限公司",
  "成都互动无限科技有限公司",
  "成都蓝源信息技术有限公司",
  "成都国信安信息产业基地有限公司",
  "成都国嵌教育",
  "成都睿峰科技有限公",
  "武汉市华信智原科技有限公司",
  "上海清泽信息技术有限公司  ",
  "上海青业计算机科技有限公司 ",
  "上海游爱数码科技有限公司 ",
  "上海哈恩计算机科技有限公司 ",
  "上海昆童信息技术有限公司",
  "上海四域信息    ",
  "杰普软件科技有限公司",
  "上海沛鸿网络     ",
  "上海交大志盟",
  "上海启明软件",
  "上海海同信息 ",
  "上海子睿软件",
  "海同百实业",
  "上海升斯电子科技有限公司 ",
  "上海启明软件股份有限公司",
  "上海时盈信息科技有限公司     ",
  "上海积鼎信息科技  ",
  "上海凡狄信息技术有限公司",
  "上海微动信息科技有限公司  ",
  "上海索漫计算机科技有限公司 ",
  "上海致骋互联网科技有限公司",
  "上海万美软件科技有限公司",
  "上海万美软件科技有限公司",
  "上海挚品互联网科技有限公司",
  "北京亨隆伟业信息咨询有限责任公司",
  "北京艺耘诺布投资管理公司",
  "北京中金付通科技发展有限公司",
  "北京荣新广育科技有限公司",
  "中青中关村软件人才基地",
  "北京百测技术咨询有限公司",
  "中青中关村软件人才基地",
  "北京德润教育",
  "莱茵环球教育科技(北京)有限公司",
  "卓新智趣(北京)科技股份有限公司",
  "北京完美空间教育科技有限公司",
  "北京翡翠教育科技有限公司",
  "AAA教育集团",
  "国信清软科技有限公司",
  "中软国际有限公司",
  "完美空间游戏动漫学院(卓新思创)",
  "尚德机构",
  "云创科技",
  "上嵌基地",
  "信盈达公司",
  "深圳致聘互联网科技有限公司",
  "深圳兰石国际有限公司",
  "AADHK公司",
  "深圳金卡弗投资管理有限公司",
  "深圳市阿卡索资讯股份有限公司",
  "南京易博信息技术有限公司",
  "湖南创智龙博信息科技股份有限公司",
];

function isTraining(brandName) {
  return (
    trainingData.filter(
      (item) => item.includes(brandName) || brandName.includes(item)
    ).length > 0
  );
}

const outsourceData = [
  "润建股份",
  "CDC软件",
  "NTTDATA",
  "万国数据服务",
  "三维天地",
  "上海中信信息发展",
  "上海中软华腾软件系统有限公司",
  "上海佩航航空科技",
  "上海复深蓝软件股份公司",
  "上海彧求信息科技有限公司",
  "上海微创软件",
  "上海微创软件股份有限公司",
  "上海思芮",
  "上海易宝软件有限公司",
  "上海易立德信息技术股份有限公司",
  "上海晟欧",
  "上海汉得信息技术股份有限公司",
  "上海汉朔信息科技",
  "上海浩方",
  "上海海万信息科技股份有限公司",
  "上海海隆",
  "上海艾融软件股份有限公司",
  "世纪恒通",
  "东南融通",
  "东软集团",
  "中信网科",
  "中兴软件",
  "中博研究院",
  "中和软件",
  "中国信息技术",
  "中恒博瑞",
  "中电金信(原文思海辉)",
  "中电金信/文思海辉(北京）",
  "中盈蓝海",
  "中科创达软件",
  "中科软",
  "中科软(根据评论添加)",
  "中网在线",
  "中讯软件",
  "中诚签",
  "中软",
  "中软国际",
  "久雅科技",
  "乌鸫科技（杭州）",
  "九城关贸",
  "九洲财务",
  "云和恩墨",
  "云腾未来（贵州）",
  "亚信科技",
  "亚信联创",
  "京北方",
  "人瑞集团",
  "亿力吉奥",
  "亿达信息（大连）",
  "众信易成",
  "佰钧成",
  "信必优",
  "信雅达",
  "健友生化",
  "元拓科技",
  "先进数通",
  "全速创想（杭州）",
  "凌志软件",
  "凯捷咨询(中国)有限公司",
  "创博国际",
  "前海泰坦科技（深圳）有限公司",
  "北京云核网络",
  "北京云核网络股份有限公司",
  "北京华胜天成",
  "北京华路时代",
  "北京天景隆",
  "北京尖峰",
  "北京开运联合",
  "北京护航",
  "北京新思软件技术有限公司",
  "北京点点企服",
  "北京百胜扬软件技术有限公司",
  "北京长亮合度信息技术有限公司",
  "北信源",
  "北方科诚",
  "北明软件",
  "北银金科",
  "千方科技",
  "华拓数码",
  "华苏科技",
  "华路时代",
  "华通科技",
  "华道数据处理",
  "卓望信息",
  "南京云昇",
  "南京昊亦源",
  "南京星空在线",
  "南京绛门信息科技股份有限公司",
  "南京迈特望",
  "南京银行消费金融中心",
  "南京麦思伦",
  "南天信息",
  "南威软件",
  "博彦科技",
  "博悦科创",
  "博朗软件",
  "印孚瑟斯技术（中国）有限公司",
  "合肥凯捷",
  "同和信息",
  "启明软件",
  "和仁科技",
  "咚瓜科技",
  "四川准达信息（四川）",
  "四川汉科",
  "四方精创（深圳）",
  "国睿科技",
  "在信汇通",
  "复深蓝软件开发",
  "大宇宙信息",
  "大展信息科技（深圳）有限公司",
  "大展科技",
  "大汉软件",
  "大连华信",
  "大连文思海辉信息技术有限公司",
  "大连斯锐信息技术公司",
  "天津喜鹊共享科技",
  "天阳科技",
  "奥博杰天",
  "宇信易诚",
  "宇信科技",
  "安硕信息",
  "安硕信息技术",
  "宏智科技",
  "富基融通",
  "富士通信息",
  "小草互联",
  "山东北明全程物流",
  "屹通信息科技",
  "广州凯泽利（部分外包）",
  "广州源创信息",
  "广州赛意信息科技股份有限公司",
  "广州迅维连锁",
  "广联达（北京）",
  "开运联合",
  "彩讯科技",
  "得逸信息",
  "微创软件",
  "德科信息",
  "德科信息（深圳）",
  "恒宝",
  "恒生电子",
  "慧博云通",
  "慧博云通（北京）",
  "懿华软件",
  "拓保软件",
  "拓维信息",
  "据说已不是外包）",
  "文思海辉",
  "斯凯",
  "斯特沃克（ThoughtWork）",
  "新大陆软件",
  "新宇软件",
  "新聚思",
  "新致软件",
  "方天科技",
  "日电卓越",
  "时代银通（杭州）",
  "时空云科技有限公司",
  "明略科技",
  "易宝软件（深圳）",
  "易思博",
  "易立德（上海）",
  "易联达（北京）",
  "易诚互动（北京）",
  "晟峰软件",
  "普联软件",
  "智慧盾",
  "朗新科技",
  "杭州端点科技",
  "杭州颐和",
  "柯莱特",
  "根据评论添加)",
  "武大吉奥",
  "武汉佰钧成技术",
  "武汉软帝联合科技",
  "永新视博",
  "汇信金服",
  "汉克时代",
  "汉克时代（北京）",
  "汉得信息（上海）",
  "江苏天鼎",
  "江苏慧世联网络科技",
  "江苏欧索软件",
  "江苏润和软件",
  "江苏红网",
  "江苏鸿信",
  "法本信息",
  "泛亚信息技术",
  "泰豪科技股份",
  "泰豪软件",
  "泽佳科技（北京泽佳科益科技有限公司）",
  "浙大网新Insigma（杭州）（请注意",
  "浙江大华",
  "浙江希优",
  "浩鲸智能",
  "浩鲸科技",
  "浩鲸科技(阿里外包",
  "浪潮",
  "浪潮集团",
  "海万科技",
  "海云数据",
  "海通安恒（广东）",
  "海隆软件",
  "润和",
  "润杨金融",
  "深圳兴融联科技有限公司",
  "深圳四方精创资讯股份有限公司",
  "深圳四方精创资讯股份有限公司北京分公司",
  "深圳大展信息科技",
  "深圳宝润兴业",
  "深圳市先进数通融安信息技术",
  "深圳市博奥特科技有限公司",
  "深圳市布雷泽科技有限公司",
  "深圳市德科信息技术有限公司",
  "深圳市易思博软件技术有限公司",
  "深圳市法本信息技术股份有限公司",
  "深圳市紫川软件有限公司",
  "深圳市金卫信",
  "深圳市长亮保泰信息科技有限公司",
  "深圳市长亮核心科技有限公司",
  "深圳市长亮科技股份有限公司",
  "深圳市雁联计算系统有限公司",
  "深圳市集益创新信息技术有限公司",
  "深圳德科信息技术",
  "深圳思特顺",
  "深圳怡化电脑",
  "深圳拓保",
  "深圳易宝",
  "深圳智慧盾(华付信息)",
  "深圳索信达数据技术有限公司",
  "深圳网新新思",
  "深圳银兴科技开发有限公司",
  "深圳雁联技术",
  "深圳青桐盛夏科技",
  "深圳鹏开信息技术有限公司",
  "爱思爱",
  "特力惠",
  "猎宝网",
  "瑞友云智科技",
  "瑞祥科技",
  "申朴信息",
  "百微科技",
  "盈达信息",
  "盛唐科技",
  "盛安德",
  "睿信天和",
  "睿至大数据",
  "知迪",
  "矩立信息",
  "石化盈科",
  "神州信息",
  "神州数码",
  "神州泰岳（北京神州泰岳软件股份有限公司）",
  "福瑞博德",
  "科大国创软件股份公司",
  "科蓝软件",
  "立思辰科技",
  "第一线安莱",
  "精锐动力",
  "索迪斯",
  "紫川软件",
  "紫金支点",
  "纬创软件",
  "经纬国际",
  "绛门科技",
  "维恩贝特",
  "绿和生活通",
  "编码王",
  "网新博创",
  "网新新思（深圳）",
  "联合信息",
  "联想利泰（北京）",
  "联迪恒星",
  "致远宣大",
  "艾斯克雷",
  "艾融（上海）",
  "英极软件开发(大连)",
  "药明康德",
  "蓝凌软件",
  "融航信息",
  "裕宁科技",
  "西安华炎信息科技有限公司",
  "西安炎兴",
  "讯方技术（深圳）",
  "诚迈科技",
  "诺赛软件",
  "赛意信息（广州）",
  "赛科斯",
  "赛迪通",
  "赢时胜（北京）",
  "软通动力",
  "通动力信息",
  "通邮集团",
  "金斯瑞",
  "金桥信息（上海）",
  "金现代",
  "金色华勤",
  "金证股份",
  "银丰新融",
  "长亮科技",
  "阿米德",
  "音泰思",
  "顶尖传承",
  "顶点软件",
  "领雁科技（北京）",
  "风云科技",
  "马衡达信息技术（上海）有限公司",
  "高伟达",
  "麦亚信",
  "麦思伦",
  "麦肯锡",
  "鼎捷软件（上海）",
  "日电卓越软件",
  "神州数码通用软件",
  "开目佰钧成",
  "ST 新海",
  "天源迪科",
  "塔塔",
  "海南钦诚",
  "信必优Symbio",
  "成都信必优信息技术有限公司",
  "上海仁联",
  "中电金信",
  "极联股份",
  "启迪万众",
];

function isOutsource(brandName) {
  return (
    outsourceData.filter(
      (item) => item.includes(brandName) || brandName.includes(item)
    ).length > 0
  );
}

(function () {
  console.log("[setup] CustomEvent");
  if (typeof window.unsafeWindow.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }
  CustomEvent.prototype = window.unsafeWindow.Event.prototype;
  window.unsafeWindow.CustomEvent = CustomEvent;
})();
(function () {
  "use strict";
  console.log("[setup] appcss");
  let appStyleTag = document.createElement("style");
  appStyleTag.innerHTML = appCss;
  document.getElementsByTagName("head")[0].appendChild(appStyleTag);

  console.log("[setup] ajax proxy");
  //拦截Ajax
  function ajaxEventTrigger(event) {
    let ajaxEvent = new CustomEvent(event, { detail: this });
    window.unsafeWindow.dispatchEvent(ajaxEvent);
  }

  let oldXHR = window.unsafeWindow.XMLHttpRequest;
  if (!oldXHR)
    return console.error("不支持 XMLHttpRequest！ 请更换最新的 chrome 浏览器");

  function newXHR() {
    let realXHR = new oldXHR();

    realXHR.addEventListener(
      "abort",
      function () {
        ajaxEventTrigger.call(this, "ajaxAbort");
      },
      false
    );
    realXHR.addEventListener(
      "error",
      function () {
        ajaxEventTrigger.call(this, "ajaxError");
      },
      false
    );
    realXHR.addEventListener(
      "load",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoad");
      },
      false
    );
    realXHR.addEventListener(
      "loadstart",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoadStart");
      },
      false
    );
    realXHR.addEventListener(
      "progress",
      function () {
        ajaxEventTrigger.call(this, "ajaxProgress");
      },
      false
    );
    realXHR.addEventListener(
      "timeout",
      function () {
        ajaxEventTrigger.call(this, "ajaxTimeout");
      },
      false
    );
    realXHR.addEventListener(
      "loadend",
      function () {
        ajaxEventTrigger.call(this, "ajaxLoadEnd");
      },
      false
    );
    realXHR.addEventListener(
      "readystatechange",
      function () {
        ajaxEventTrigger.call(this, "ajaxReadyStateChange");
      },
      false
    );

    let send = realXHR.send;
    realXHR.send = function (...arg) {
      send.apply(realXHR, arg);
      realXHR.body = arg[0];
      ajaxEventTrigger.call(realXHR, "ajaxSend");
    };

    let open = realXHR.open;
    realXHR.open = function (...arg) {
      open.apply(realXHR, arg);
      realXHR.method = arg[0];
      realXHR.orignUrl = arg[1];
      realXHR.async = arg[2];
      ajaxEventTrigger.call(realXHR, "ajaxOpen");
    };

    let setRequestHeader = realXHR.setRequestHeader;
    realXHR.requestHeader = {};
    realXHR.setRequestHeader = function (name, value) {
      realXHR.requestHeader[name] = value;
      setRequestHeader.call(realXHR, name, value);
    };
    return realXHR;
  }
  newXHR.prototype = oldXHR.prototype;
  window.unsafeWindow.XMLHttpRequest = newXHR;
  window.unsafeWindow.addEventListener("ajaxGetData", function (e) {
    const data = e?.detail;
    if (!data) return;
    const responseURL = data?.responseURL;
    //逻辑主入口
    // boss 直聘接口
    if (responseURL.indexOf("/search/joblist.json") !== -1) {
      handler.boss.handle(data?.response);
    }
    // 智联招聘接口
    if (responseURL.indexOf("/search/positions") !== -1) {
      handler.zhilian.build().handle(data?.response);
    }
    // 前程无忧接口
    if (responseURL.indexOf("/api/job/search-pc") !== -1) {
      handler.job51.handle(data?.response);
    }
    // 拉勾网接口
    if (responseURL.indexOf("/jobs/v2/positionAjax.json") !== -1) {
      /**
       * Question: 接口响应是加密的，为什么这里拿到的是解密后的？
       * 拉勾的加密是自己重写了 XMLHttpRequest，在 send 前进行加密，接受到响应后解密，再派发事件出去
       * 由于拉勾的重写在 proxyAjax 之前运行，所以这里拿到的是解密后的数据
       */
      handler.lagou.build().handle(data?.response);
    }
    // liepin
    if (
      responseURL.indexOf("/api/com.liepin.searchfront4c.pc-search-job") !== -1
    ) {
      handler.liepin.handle(data?.response);
    }
  });

  window.unsafeWindow.addEventListener("proxyScriptLoaded", async function (e) {
    if (location.host === "www.zhaopin.com") {
      // 智联招聘首次打开
      const data = e?.detail?.zhipin?.initialState;
      handler.zhilian.build().handleFirstTimeOpen(data || {});
    }

    if (location.host === "www.lagou.com") {
      // 拉勾首次打开
      const data = e?.detail?.lagou?.initialState;
      handler.lagou.build().handleFirstTimeOpen(data || {});
    }
  });
  // 监听页面的ajax
  window.unsafeWindow.addEventListener("ajaxReadyStateChange", function (e) {
    let xhr = e.detail;
    const data = {
      response: xhr?.response,
      responseType: xhr?.responseType,
      responseURL: xhr?.responseURL ? xhr.responseURL : xhr?.orignUrl,
      status: xhr?.status,
      statusText: xhr?.statusText,
      readyState: xhr?.readyState,
      withCredentials: xhr?.withCredentials,
    };
    if (xhr?.readyState == 4 && xhr?.status == 200) {
      // 直接给 xhr，app.js 收不到。
      let event = new CustomEvent("ajaxGetData", { detail: data });
      window.unsafeWindow.dispatchEvent(event);
    }
  });

  console.log("[setup] util");
  //util
  // 转换时间
  function convertTimeToHumanReadable(dateTime) {
    let date = dayjs(dateTime);
    let curDate = dayjs();

    // 计算时间差共有多少个分钟
    let minC = curDate.diff(date, "minute", true);
    // 计算时间差共有多少个小时
    let hourC = curDate.diff(date, "hour", true);
    // 计算时间差共有多少个天
    let dayC = curDate.diff(date, "day", true);
    // 计算时间差共有多少个周
    let weekC = curDate.diff(date, "week", true);
    // 计算时间差共有多少个月
    let monthC = curDate.diff(date, "month", true);

    if (minC < 5) {
      return `刚刚`;
    } else if (minC < 60) {
      return `1小时内`;
    } else if (hourC < 24) {
      return `1天内`;
    } else if (dayC < 7) {
      return `${parseInt(dayC)}天内`;
    } else if (monthC < 1) {
      return `${parseInt(Math.ceil(weekC))}周内`;
    } else if (monthC <= 2) {
      return `2个月内`;
    } else if (monthC <= 3) {
      return `3个月内`;
    } else {
      return "超出3个月";
    }
  }

  function convertTimeOffsetToHumanReadable(dateTime) {
    let date = dayjs(dateTime);
    let curDate = dayjs();

    // 计算时间差共有多少个分钟
    let minC = curDate.diff(date, "minute", true);
    // 计算时间差共有多少个小时
    let hourC = curDate.diff(date, "hour", true);
    // 计算时间差共有多少个天
    let dayC = curDate.diff(date, "day", true);
    // 计算时间差共有多少个月
    let monthC = curDate.diff(date, "month", true);
    // 计算时间差共有多少个年
    let yearC = curDate.diff(date, "year", true);

    if (minC < 1) {
      return `刚刚`;
    } else if (minC < 60) {
      return `${parseInt(minC)}分钟前`;
    } else if (hourC < 24) {
      return `${parseInt(hourC)}小时前`;
    } else if (monthC < 1) {
      return `${parseInt(dayC)}天前`;
    } else if (yearC < 1) {
      return `${parseInt(monthC)}月前`;
    } else {
      return `${parseInt(yearC)}年前`;
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  // 下划线转换驼峰
  function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }
  // 驼峰转换下划线
  function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  /**
   * 随机等待
   * @param {*} delayTime 等待时间，单位ms
   * @param {*} randomRange 随机时间范围，单位ms
   * @returns
   */
  function randomDelay(delayTime, randomRange) {
    return new Promise((r) =>
      setTimeout(r, delayTime + getRandomInt(randomRange))
    );
  }

  function convertEmptyStringToNull(value) {
    if (isNumeric(value)) {
      return value;
    }
    if (value) {
      if (isEmpty(value) || isBlank(value)) {
        return null;
      } else {
        return value;
      }
    } else {
      return null;
    }
  }

  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const isEmpty = (str) => !str?.length;

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  function makeGetRequest(url, method = "GET", data = null) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: method,
        data: data,
        onload: function (response) {
          resolve(response);
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  function autoFillHttp(url) {
    if (
      url.substr(0, 7).toLowerCase() == "http://" ||
      url.substr(0, 8).toLowerCase() == "https://"
    ) {
      return url;
    } else {
      return "http://" + url;
    }
  }

  function getDomain(url) {
    if (url) {
      return url
        .replace("http://", "")
        .replace("https://", "")
        .replace("www.", "")
        .replace("/", "");
    }
    return url;
  }

  function convertDateStringToDateObject(text) {
    return dayjs(text).isValid() ? dayjs(text).toDate() : null;
  }

  console.log("[setup] common");
  //common
  const JOB_STATUS_DESC_NEWEST = { key: "最新", label: "最新", order: 0 };
  const JOB_STATUS_DESC_RECRUITING = {
    key: "招聘中",
    label: "招聘中",
    order: 1,
  };
  const JOB_STATUS_DESC_UNKNOW = { label: "未知", order: 2 };

  const PLATFORM_BOSS = "BOSS";
  const PLATFORM_51JOB = "51JOB";
  const PLATFORM_ZHILIAN = "ZHILIAN";
  const PLATFORM_LAGOU = "LAGOU";
  const PLATFORM_JOBSDB = "JOBSDB";
  const PLATFORM_LIEPIN = "LIEPIN";
  /**
   * 爱企查
   */
  const PLATFORM_AIQICHA = "AIQICHA";

  console.log("[setup] common render");
  //common render
  function renderTimeTag(divElement, jobDTO, { jobStatusDesc, platform } = {}) {
    if (jobDTO == null || jobDTO == undefined) {
      throw new Error("jobDTO is required");
    }
    //对发布时间的处理
    if (platform && platform == PLATFORM_BOSS) {
      let statusTag = null;
      //jobStatusDesc
      if (jobStatusDesc) {
        statusTag = document.createElement("span");
        let statusToTimeText = "";
        if (jobStatusDesc == JOB_STATUS_DESC_NEWEST) {
          statusToTimeText = "一周内";
          statusTag.innerHTML = "【 " + statusToTimeText + "发布❔】";
          statusTag.title =
            "当前招聘状态【" +
            jobStatusDesc.label +
            "】，招聘状态：最新：代表一周内发布；招聘中：代表发布时间超过一周";
        } else {
          statusTag.innerHTML = "【发布时间未知】";
        }
        statusTag.classList.add("__time_tag_base_text_font");
        divElement.appendChild(statusTag);
      }
    } else if (platform && platform == PLATFORM_LIEPIN) {
      //refreshTime
      let refreshTime = jobDTO.jobFirstPublishDatetime;
      if (refreshTime) {
        let refreshTimeTag = document.createElement("span");
        let refreshTimeHumanReadable = convertTimeToHumanReadable(refreshTime);
        refreshTimeTag.innerHTML += "【" + refreshTimeHumanReadable + "更新】";
        refreshTimeTag.classList.add("__time_tag_base_text_font");
        divElement.appendChild(refreshTimeTag);
      }
    } else {
      //firstPublishTime
      let firstPublishTime = jobDTO.jobFirstPublishDatetime;
      if (firstPublishTime) {
        let firstPublishTimeTag = document.createElement("span");
        let firstPublishTimeHumanReadable = convertTimeToHumanReadable(
          firstPublishTime
        );
        firstPublishTimeTag.innerHTML +=
          "【" + firstPublishTimeHumanReadable + "发布】";
        firstPublishTimeTag.classList.add("__time_tag_base_text_font");
        divElement.appendChild(firstPublishTimeTag);
      }
    }
    if (jobDTO.hrActiveTimeDesc) {
      let hrActiveTimeDescTag = document.createElement("span");
      hrActiveTimeDescTag.innerHTML = "【HR-" + jobDTO.hrActiveTimeDesc + "】";
      hrActiveTimeDescTag.classList.add("__time_tag_base_text_font");
      divElement.appendChild(hrActiveTimeDescTag);
    }
    //显示职位介绍
    divElement.title = jobDTO.jobDescription;
    //companyInfo
    let companyInfoTag = null;
    let companyInfoText = getCompanyInfoText(jobDTO.jobCompanyName);
    if (companyInfoText !== "") {
      companyInfoTag = document.createElement("span");
      companyInfoTag.innerHTML = companyInfoText;
      companyInfoTag.classList.add("__time_tag_base_text_font");
      divElement.appendChild(companyInfoTag);
    }

    divElement.classList.add("__time_tag_base_text_font");

    //为time tag染色
    if (jobDTO.hrActiveTimeDesc && platform == PLATFORM_BOSS) {
      //根据hr活跃时间为JobItem染色
      let now = dayjs();
      let hrActiveDatetime = now.subtract(
        convertHrActiveTimeDescToOffsetTime(jobDTO.hrActiveTimeDesc),
        "millisecond"
      );
      divElement.style = getRenderTimeStyle(hrActiveDatetime);
    } else {
      divElement.style = getRenderTimeStyle(
        jobDTO.jobFirstPublishDatetime ?? null,
        jobStatusDesc
      );
    }
  }

  function setupSortJobItem(node) {
    if (!node) return;
    node.style = "display:flex;flex-direction: column;";
    //for zhilian
    const jobListItemList = node.querySelectorAll(".joblist-item");
    if (jobListItemList && jobListItemList.length > 0) {
      for (let i = 0; i < jobListItemList.length; i++) {
        let item = jobListItemList[i];
        item.classList.add("__ZHILIAN_job_item");
      }
    }
    const paginationNode = node.querySelector(".pagination");
    if (paginationNode) {
      paginationNode.style = "order:99999;";
    }
  }

  function createLoadingDOM(brandName, styleClass) {
    const div = document.createElement("div");
    div.classList.add(styleClass);
    div.classList.add("__loading_tag");
    renderTimeLoadingTag(div, brandName);
    return div;
  }

  function hiddenLoadingDOM() {
    let loadingTagList = document.querySelectorAll(".__loading_tag");
    if (loadingTagList) {
      loadingTagList.forEach((item) => {
        item.style = "visibility: hidden;";
      });
    }
  }

  function renderTimeLoadingTag(divElement, brandName) {
    let timeText = "【正查找发布时间⌛︎】";
    let text = timeText;
    text += getCompanyInfoText(brandName);
    divElement.style = getRenderTimeStyle();
    divElement.classList.add("__time_tag_base_text_font");
    divElement.innerHTML = text;
  }

  function getCompanyInfoText(brandName) {
    let text = "";
    const isOutsourceBrand = isOutsource(brandName);
    const isTrainingBrand = isTraining(brandName);
    if (isOutsourceBrand) {
      text += "【疑似外包公司】";
    }
    if (isTrainingBrand) {
      text += "【疑似培训机构】";
    }
    if (isOutsourceBrand || isTrainingBrand) {
      text += "⛅";
    } else {
      text += "☀";
    }
    return text;
  }

  function getRenderTimeStyle(lastModifyTime, jobStatusDesc) {
    let offsetTimeDay;
    if (jobStatusDesc) {
      if (JOB_STATUS_DESC_NEWEST == jobStatusDesc) {
        offsetTimeDay = 7; // actual <7
      } else {
        offsetTimeDay = -1;
      }
    } else {
      if (lastModifyTime) {
        offsetTimeDay = dayjs().diff(dayjs(lastModifyTime), "day");
      } else {
        lastModifyTime = -1;
      }
    }
    return (
      "background-color: " + getTimeColorByOffsetTimeDay(offsetTimeDay) + ";"
    );
  }

  function getTimeColorByOffsetTimeDay(offsetTimeDay) {
    if (offsetTimeDay >= 0) {
      if (offsetTimeDay <= 7) {
        return "yellowgreen";
      } else if (offsetTimeDay <= 14) {
        return "green";
      } else if (offsetTimeDay <= 28) {
        return "orange";
      } else if (offsetTimeDay <= 56) {
        return "red";
      } else {
        return "gray";
      }
    } else {
      return "black";
    }
  }

  function renderSortJobItem(list, getListItem, { platform }) {
    const idAndSortIndexMap = new Map();
    //设置一个标识id,renderSortCustomId
    list.forEach((item, index) => {
      item.renderSortCustomId = index;
    });
    const sortList = JSON.parse(JSON.stringify(list));
    //sort firstBrowseDatetime
    sortList.sort((o1, o2) => {
      return (
        dayjs(o2.firstBrowseDatetime ?? null).valueOf() -
        dayjs(o1.firstBrowseDatetime ?? null).valueOf()
      );
    });
    //handle hr active time
    if (platform == PLATFORM_BOSS || platform == PLATFORM_LIEPIN) {
      sortList.forEach((item) => {
        let hrActiveTimeOffsetTime = convertHrActiveTimeDescToOffsetTime(
          item.hrActiveTimeDesc
        );
        item.hrActiveTimeOffsetTime = hrActiveTimeOffsetTime;
      });
      sortList.sort((o1, o2) => {
        return o1.hrActiveTimeOffsetTime - o2.hrActiveTimeOffsetTime;
      });
    }
    if (platform == PLATFORM_BOSS) {
      sortList.sort((o1, o2) => {
        if (o2.jobStatusDesc && o1.jobStatusDesc) {
          return o1.jobStatusDesc.order - o2.jobStatusDesc.order;
        } else {
          return 0;
        }
      });
    } else {
      //sort firstPublishTime
      sortList.sort((o1, o2) => {
        return (
          dayjs(o2.jobFirstPublishDatetime ?? null).valueOf() -
          dayjs(o1.jobFirstPublishDatetime ?? null).valueOf()
        );
      });
    }
    sortList.forEach((item, index) => {
      idAndSortIndexMap.set(item.renderSortCustomId, index);
    });
    list.forEach((item, index) => {
      const dom = getListItem(index);
      let targetDom;
      if (platform) {
        if (PLATFORM_JOBSDB == platform) {
          targetDom = dom.parentNode.parentNode;
        } else {
          targetDom = dom;
        }
      } else {
        targetDom = dom;
      }
      let styleString =
        "order:" + idAndSortIndexMap.get(item.renderSortCustomId) + ";";
      targetDom.style = styleString;
    });
  }

  function renderFunctionPanel(
    list,
    getListItem,
    { platform, getCompanyInfoFunction } = {}
  ) {
    list.forEach((item, index) => {
      const dom = getListItem(index);
      let targetDom;
      if (platform) {
        if (PLATFORM_JOBSDB == platform) {
          targetDom = dom.parentNode.parentNode;
        } else {
          targetDom = dom;
        }
      } else {
        targetDom = dom;
      }
      let functionPanelDiv = document.createElement("div");
      functionPanelDiv.classList.add(`__${platform}_function_panel`);
      targetDom.append(functionPanelDiv);
      functionPanelDiv.onclick = (event) => {
        event.stopPropagation();
      };
      functionPanelDiv.appendChild(
        createCompanyInfo(item, {
          getCompanyInfoFunction: getCompanyInfoFunction,
        })
      );
    });
  }

  function createCompanyInfo(item, { getCompanyInfoFunction } = {}) {
    const dom = document.createElement("div");
    dom.className = "__company_info_quick_search";
    let mainChannelDiv = document.createElement("div");
    let otherChannelDiv = document.createElement("div");
    let quickSearchButton = document.createElement("div");
    quickSearchButton.className = "__company_info_quick_search_button";
    quickSearchButton.innerHTML = "🔎点击快速查询公司信息";
    let fixValidHummanButton = document.createElement("a");
    fixValidHummanButton.className = "__company_info_quick_search_button";
    fixValidHummanButton.target = "_blank";
    fixValidHummanButton.ref = "noopener noreferrer";
    let quickSearchButtonLoading = document.createElement("div");
    quickSearchButtonLoading.className = "__company_info_quick_search_button";
    const quickSearchHandle = async (event) => {
      if (mainChannelDiv.contains(fixValidHummanButton)) {
        mainChannelDiv.removeChild(fixValidHummanButton);
      }
      quickSearchButtonLoading.innerHTML = `🔎正查询公司全称⌛︎`;
      mainChannelDiv.removeChild(quickSearchButton);
      mainChannelDiv.appendChild(quickSearchButtonLoading);
      let companyName = item.jobCompanyName;
      fixValidHummanButton.innerHTML =
        "一直查询失败？点击该按钮去尝试解除人机验证吧！";
      if (getCompanyInfoFunction) {
        let targetCompanyName = await getCompanyInfoFunction(
          item.jobCompanyApiUrl
        );
        if (targetCompanyName) {
          companyName = targetCompanyName;
        } else {
          fixValidHummanButton.innerHTML = `找不到【${companyName}】的全称，点击该按钮去看看有没有相关记录`;
        }
      }
      const decode = encodeURIComponent(companyName);
      const url = `https://aiqicha.baidu.com/s?q=${decode}`;
      fixValidHummanButton.href = url;
      otherChannelDiv.innerHTML = "";
      try {
        quickSearchButtonLoading.innerHTML = `🔎正查询【${companyName}】⌛︎`;
        await asyncRenderCompanyInfo(mainChannelDiv, companyName);
        mainChannelDiv.removeChild(quickSearchButtonLoading);
      } catch (e) {
        mainChannelDiv.removeChild(quickSearchButtonLoading);
        quickSearchButton.innerHTML = `🔎查询【${companyName}】失败，点击重新查询`;
        mainChannelDiv.appendChild(quickSearchButton);
        mainChannelDiv.appendChild(fixValidHummanButton);
      } finally {
        otherChannelDiv.appendChild(createCompanyReputation(companyName));
        otherChannelDiv.appendChild(createSearchCompanyLink(companyName));
      }
    };
    quickSearchButton.onclick = quickSearchHandle;
    mainChannelDiv.appendChild(quickSearchButton);
    dom.appendChild(mainChannelDiv);
    dom.appendChild(otherChannelDiv);
    if (getCompanyInfoFunction) {
      //for boss
      //skip
    } else {
      //自动查询公司信息
      quickSearchHandle();
    }
    return dom;
  }

  const AIQICHA_PAGE_DATA_MATCH = /window.pageData = (?<data>\{.*\})/;

  async function asyncRenderCompanyInfo(div, keyword) {
    try {
      let companyInfo = await getCompanyInfoByAiqicha(keyword);
      if (companyInfo) {
        let companyInfoDetail = await getCompanyInfoDetailByAiqicha(
          companyInfo.pid
        );
        let companyDetail = companyInfoDetail;
        companyDetail.selfRiskTotal = companyInfo?.risk?.selfRiskTotal;
        companyDetail.unionRiskTotal = companyInfo?.risk?.unionRiskTotal;
        companyDetail.sourceUrl = `https://aiqicha.baidu.com/company_detail_${companyDetail.pid}`;
        let company = handleAiqichaData(companyDetail);
        div.appendChild(createCompanyInfoDetail(company));
      } else {
        throw "company search fail";
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  function createCompanyInfoDetail(company) {
    let contentDiv = $("<div></div>");
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`)
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">公司名：</div><div class="__company_info_quick_search_item_value">${company.companyName}</div></div>`
          )
        )
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">成立时间：</div><div>
            ${dayjs(company.companyStartDate).format(
              "YYYY-MM-DD"
            )}(${convertTimeOffsetToHumanReadable(
              dayjs(company.companyStartDate)
            )})
            </div></div>`
          )
        )
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">经营状态：</div>${company.companyStatus}</div>`
          )
        )
    );
    let websiteElement = null;
    if (company.companyWebSite && company.companyWebSite.length > 1) {
      websiteElement = `<a href="${autoFillHttp(
        company.companyWebSite
      )}" target = "_blank"; ref = "noopener noreferrer">${company.companyWebSite
        }</a>`;
    } else {
      websiteElement = "-";
    }
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`)
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">法人：</div>${company.companyLegalPerson}</div>`
          )
        )
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">统一社会信用代码：</div>${company.companyUnifiedCode}</div>`
          )
        )
    );
    let websiteStatusElement = $(`<div></div>`);
    renderWebsiteStatus(websiteStatusElement[0], company.companyWebSite);
    let websiteWhoisElement = $(`<div></div>`);
    renderWebsiteWhois(websiteWhoisElement[0], company.companyWebSite);
    let websiteIpcElement = $(`<div></div>`);
    renderWebsiteIpc(websiteIpcElement[0], company.companyWebSite);
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`).append(
        $(
          `<div><div class="__company_info_quick_search_item_label">官网：</div>${websiteElement}</div>`
        ),
        $(
          `<div><div class="__company_info_quick_search_item_label">状态：</div></div>`
        ).append(websiteStatusElement),
        $(
          `<div><div class="__company_info_quick_search_item_label">建站时间：</div></div>`
        ).append(websiteWhoisElement),
        $(`<div></div>`).append(websiteIpcElement)
      )
    );
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`)
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">社保人数：</div>${company.companyInsuranceNum ?? "-"
            }</div>`
          )
        )
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">自身风险数：</div>${company.companySelfRisk}</div>`
          )
        )
        .append(
          $(
            `<div><div class="__company_info_quick_search_item_label">关联风险数：</div>${company.companyUnionRisk}</div>`
          )
        )
    );
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`).append(
        $(
          `<div><div class="__company_info_quick_search_item_label">地址：</div><div class="__company_info_quick_search_item_value">${company.companyAddress}</div></div>`
        )
      )
    );
    contentDiv.append(
      $(`<div class="__company_info_quick_search_item"></div>`).append(
        $(
          `<div><div class="__company_info_quick_search_item_label">数据来源：</div><div class="__company_info_quick_search_item_value"><a href="${company.sourceUrl}" target = "_blank"; ref = "noopener noreferrer">${company.sourceUrl}</a></div></div>`
        )
      )
    );
    return contentDiv[0];
  }

  async function renderWebsiteIpc(element, website) {
    try {
      element.onclick = null;
      element.textContent = "备案信息检测中⌛︎";
      element.className = "__website_value_loading";
      if (website.length <= 1) {
        //找不到网址，会显示-符号
        element.textContent = "";
        element.className = "";
      } else {
        let url = `https://icp.aizhan.com/${encodeURIComponent(
          getDomain(website)
        )}/`;
        const response = await makeGetRequest(url);
        const result = response.responseText;
        let firstMatchArray = result.match(
          /<table class="table">[\s\S]*<tr><td class="thead">主办单位名称<\/td><td>.*[<\td>]?/
        );
        if (firstMatchArray && firstMatchArray.length > 0) {
          let groups = firstMatchArray[0]
            ?.replaceAll("\n", "")
            ?.replaceAll("\t", "")
            ?.replaceAll(" ", "")
            ?.replaceAll("&nbsp;", "")
            ?.match(
              /<tr>(?<name>.*?)<\/tr><tr>(?<type>.*?)<\/tr><tr>(?<ipc>.*?)<\/tr>/
            )?.groups;
          if (groups) {
            let name = groups.name.match(/<td>(?<name>.*)<a/).groups.name;
            let type = groups.type.match(/<td>(?<type>.*)<\/td>/).groups.type;
            let ipc = groups.ipc.match(/<span>(?<ipc>.*)<\/span>/).groups.ipc;
            element.textContent = "";
            element.className = "";
            element.className = "__company_info_quick_search_item";
            element.title = name;
            let rootElement = $(element);
            rootElement.append(
              $(
                `<div><div class="__company_info_quick_search_item_label">网站备案：</div><div class="__company_info_quick_search_item_value">${ipc}</div></div>`
              ),
              $(
                `<div><div class="__company_info_quick_search_item_label">单位性质：</div><div class="__company_info_quick_search_item_value">${type}</div></div>`
              )
            );
            return;
          }
        }
        clearAllChildNode(element);
        element.className = "";
        let syncDataButton = document.createElement("div");
        syncDataButton.className = "__company_info_quick_search_button";
        syncDataButton.textContent = "🔎未找到备案信息，点击到工信部核实";
        syncDataButton.onclick = () => {
          window.open("https://beian.miit.gov.cn/#/Integrated/recordQuery");
        };
        element.appendChild(syncDataButton);
      }
    } catch (e) {
      console.error(e);
      element.onclick = (event) => {
        renderWebsiteIpc(element, website);
      };
      element.textContent = "备案信息检测失败，点击重新检测";
      element.className = "__website_value_loading";
    }
  }

  async function renderWebsiteWhois(element, website) {
    try {
      element.onclick = null;
      element.textContent = "检测中⌛︎";
      element.className = "__website_value_loading";
      if (website.length <= 1) {
        //找不到网址，会显示-符号
        element.textContent = "-";
        element.className = "";
      } else {
        let url = `https://whois.chinaz.com/${encodeURIComponent(website)}`;
        const response = await makeGetRequest(url);
        const result = response.responseText;
        let groups = result.match(
          /注册时间[\s\S]*<\/div>[\s\S]*<div item-value>(?<registDate>.*)<\/div>[\s\S]*/
        )?.groups;
        if (groups && groups.registDate) {
          let date = dayjs(
            groups.registDate
              .replaceAll("年", "-")
              .replaceAll("月", "-")
              .replaceAll("日", "")
          );
          element.textContent = convertTimeOffsetToHumanReadable(date);
          element.title = date.format("YYYY-MM-DD");
          element.className = "";
        } else {
          element.textContent = "未找到";
          element.clasName = "__website_value_error";
        }
      }
    } catch (e) {
      console.error(e);
      element.onclick = (event) => {
        renderWebsiteWhois(element, website);
      };
      element.textContent = "检测失败，点击重新检测";
      element.className = "__website_value_loading";
    }
  }

  async function renderWebsiteStatus(element, website) {
    try {
      element.onclick = null;
      element.textContent = "检测中⌛︎";
      element.className = "__website_value_loading";
      if (website.length <= 1) {
        //找不到网址，会显示-符号
        element.textContent = "-";
        element.className = "";
      } else {
        let url = `https://tool.chinaz.com/pagestatus/?url=${encodeURIComponent(
          autoFillHttp(website)
        )}`;
        const response = await makeGetRequest(url);
        const result = response.responseText;
        let groups = result.match(
          /<!--IcpMain02-begin-->[\s\S]*返回状态码[\s\S]*<span>(?<stateCode>.*)<\/span>[\s\S]*<!--IcpMain02-end-->/
        )?.groups;
        if (groups && groups.stateCode) {
          element.textContent = "可访问";
          element.style = "background-color:yellowgreen;color:white;";
        } else {
          element.textContent = "不可访问";
          element.style = "background-color:red;color:white;";
        }
      }
    } catch (e) {
      console.error(e);
      element.onclick = (event) => {
        renderWebsiteStatus(element, website);
      };
      element.textContent = "不可访问";
      element.className = "__website_value_loading";
    }
  }

  async function getCompanyInfoByAiqicha(keyword) {
    const decode = encodeURIComponent(keyword);
    const url = `https://aiqicha.baidu.com/s?q=${decode}`;
    const response = await makeGetRequest(url);
    const result = response.responseText;
    let data = JSON.parse(result.match(AIQICHA_PAGE_DATA_MATCH).groups["data"]);
    let resultList = data.result.resultList;
    for (let i = 0; i < resultList.length; i++) {
      let companyInfo = resultList[i];
      if (isCompanyNameSame(companyInfo.titleName, keyword)) {
        return companyInfo;
      }
    }
    return null;
  }

  /**
   * 公司名对比，将中文括号进行替换英文括号，然后进行对比
   * @param {*} name1
   * @param {*} name2
   * @returns
   */
  function isCompanyNameSame(name1, name2) {
    return (
      name1.replaceAll("（", "(").replaceAll("）", ")") ==
      name2.replaceAll("（", "(").replaceAll("）", ")")
    );
  }

  async function getCompanyInfoDetailByAiqicha(pid) {
    const url = `https://aiqicha.baidu.com/company_detail_${pid}`;
    const response = await makeGetRequest(url);
    const result = response.responseText;
    let data = JSON.parse(result.match(AIQICHA_PAGE_DATA_MATCH).groups["data"]);
    let companyInfoDetail = data.result;
    return companyInfoDetail;
  }

  function createSearchCompanyLink(keyword) {
    const decode = encodeURIComponent(keyword);
    const dom = document.createElement("div");
    const internetDiv = document.createElement("div");
    internetDiv.className =
      "__company_info_quick_search_item __company_info_other_channel";
    let internetLabelDiv = document.createElement("div");
    internetLabelDiv.className = "__company_info_quick_search_item_label";
    internetLabelDiv.innerHTML = " - 互联网渠道";
    internetDiv.appendChild(
      createATagWithSearch(`https://aiqicha.baidu.com/s?q=${decode}`, "爱企查")
    );
    internetDiv.appendChild(
      createATagWithSearch(
        `https://www.xiaohongshu.com/search_result?keyword=${decode}`,
        "小红书"
      )
    );
    internetDiv.appendChild(
      createATagWithSearch(
        `https://maimai.cn/web/search_center?type=feed&query=${decode}&highlight=true`,
        "脉脉"
      )
    );
    internetDiv.appendChild(
      createATagWithSearch(`https://www.bing.com/search?q=${decode}`, "必应")
    );
    internetDiv.appendChild(
      createATagWithSearch(
        `https://www.google.com/search?q=${decode}`,
        "Google"
      )
    );
    internetDiv.appendChild(internetLabelDiv);
    dom.appendChild(internetDiv);
    const govDiv = document.createElement("div");
    govDiv.className =
      "__company_info_quick_search_item __company_info_other_channel";
    let govLabelDiv = document.createElement("div");
    govLabelDiv.className = "__company_info_quick_search_item_label";
    govLabelDiv.innerHTML = "- 政府渠道";
    govDiv.appendChild(
      createATagWithSearch(
        `https://beian.miit.gov.cn/#/Integrated/recordQuery`,
        "工信部"
      )
    );
    govDiv.appendChild(
      createATagWithSearch(
        `https://www.creditchina.gov.cn/xinyongxinxixiangqing/xyDetail.html?keyword=${decode}`,
        "信用中国"
      )
    );
    govDiv.appendChild(
      createATagWithSearch(
        `https://www.gsxt.gov.cn/corp-query-homepage.html`,
        "企业信用"
      )
    );
    govDiv.appendChild(
      createATagWithSearch(`http://zxgk.court.gov.cn/zhzxgk/`, "执行信息")
    );
    govDiv.appendChild(
      createATagWithSearch(`https://wenshu.court.gov.cn/`, "裁判文书")
    );
    govDiv.appendChild(
      createATagWithSearch(`https://xwqy.gsxt.gov.cn/`, "个体私营")
    );
    govDiv.appendChild(govLabelDiv);
    dom.appendChild(govDiv);
    return dom;
  }

  function createCompanyReputation(keyword) {
    const dom = document.createElement("div");
    dom.className = "__company_info_quick_search_item";
    let labelDiv = document.createElement("div");
    labelDiv.className = "__company_info_quick_search_item_label";
    labelDiv.textContent = "公司风评检测：";
    dom.appendChild(labelDiv);
    const ruobilinDiv = document.createElement("div");
    dom.appendChild(ruobilinDiv);
    asyncRenderRuobilin(ruobilinDiv, keyword);
    const itJobBlackListDiv = document.createElement("div");
    dom.appendChild(itJobBlackListDiv);
    asyncRenderITJobBlackList(itJobBlackListDiv, keyword);
    return dom;
  }

  async function asyncRenderRuobilin(div, keyword) {
    div.title = "信息来源:跨境小白网（若比邻网）https://kjxb.org/";
    const decode = encodeURIComponent(keyword);
    const url = `https://kjxb.org/?s=${decode}&post_type=question`;
    const loaddingTag = createATag(
      "📡",
      url,
      "若比邻黑名单(检测中⌛︎)",
      (event) => {
        clearAllChildNode(div);
        asyncRenderRuobilin(div, keyword);
      }
    );
    div.appendChild(loaddingTag);
    renderCompanyReputationColor(loaddingTag, "black");
    try {
      const result = await makeGetRequest(url);
      let hyperlinks = $(result.responseText).find(".ap-questions-hyperlink");
      clearAllChildNode(div);
      if (hyperlinks && hyperlinks.length > 0) {
        //存在于若比邻黑名单
        const count = hyperlinks.length;
        let tag = createATag("📡", url, `若比邻黑名单(疑似${count}条记录)`);
        div.appendChild(tag);
        renderCompanyReputationColor(tag, "red");
      } else {
        //不存在
        let tag = createATag("📡", url, "若比邻黑名单(无记录)");
        div.appendChild(tag);
        renderCompanyReputationColor(tag, "yellowgreen");
      }
    } catch (e) {
      clearAllChildNode(div);
      const errorDiv = createATag(
        "📡",
        url,
        "若比邻黑名单(检测失败，点击重新检测)",
        (event) => {
          clearAllChildNode(div);
          asyncRenderRuobilin(div, keyword);
        }
      );
      errorDiv.href = "javaScript:void(0);";
      errorDiv.target = "";
      div.appendChild(errorDiv);
      renderCompanyReputationColor(errorDiv, "black");
    }
  }

  async function asyncRenderITJobBlackList(div, keyword) {
    div.title = "信息来源:互联网企业黑名单 https://job.me88.top/";
    const decode = encodeURIComponent(keyword);
    const url = `https://job.me88.top/index.php/search/=${decode}`;
    const loaddingTag = createATag(
      "📡",
      url,
      "互联网企业黑名单(检测中⌛︎)",
      (event) => {
        clearAllChildNode(div);
        asyncRenderITJobBlackList(div, keyword);
      }
    );
    div.appendChild(loaddingTag);
    renderCompanyReputationColor(loaddingTag, "black");
    try {
      const result = await makeGetRequest(url);
      let hyperlinks = $(result.responseText).find("div[class=\"post-box paddingall\"]");
      clearAllChildNode(div);
      if (hyperlinks && hyperlinks.length > 0) {
        //存在于黑名单
        const count = hyperlinks.length;
        let tag = createATag("📡", url, `互联网企业黑名单(疑似${count}条记录)`);
        div.appendChild(tag);
        renderCompanyReputationColor(tag, "red");
      } else {
        //不存在
        let tag = createATag("📡", url, "互联网企业黑名单(无记录)");
        div.appendChild(tag);
        renderCompanyReputationColor(tag, "yellowgreen");
      }
    } catch (e) {
      clearAllChildNode(div);
      const errorDiv = createATag(
        "📡",
        url,
        "互联网企业黑名单(检测失败，点击重新检测)",
        (event) => {
          clearAllChildNode(div);
          asyncRenderITJobBlackList(div, keyword);
        }
      );
      errorDiv.href = "javaScript:void(0);";
      errorDiv.target = "";
      div.appendChild(errorDiv);
      renderCompanyReputationColor(errorDiv, "black");
    }
  }

  function clearAllChildNode(div) {
    div.innerHTML = "";
  }

  function renderCompanyReputationColor(div, color) {
    div.style = `background-color:${color};color:white`;
  }

  function createATagWithSearch(url, label) {
    return createATag("🔎", url, label);
  }

  function createATag(emoji, url, label, callback) {
    let aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    aTag.ref = "noopener noreferrer";
    aTag.text = emoji + label;
    aTag.addEventListener("click", (event) => {
      if (callback) {
        callback(event);
      }
      event.stopPropagation();
    });
    return aTag;
  }

  const ACTIVE_TIME_MATCH = /(?<num>[0-9\.]*)/;

  function convertHrActiveTimeDescToOffsetTime(hrActiveTimeDesc) {
    //按偏移量按毫秒算
    let offsetTime;
    const halfYear = 86400000 * 30 * 6;
    const oneYear = 86400000 * 30 * 6 * 2;
    if (hrActiveTimeDesc) {
      let coefficient;
      if (
        hrActiveTimeDesc.includes("刚刚") ||
        hrActiveTimeDesc.includes("当前")
      ) {
        offsetTime = 0;
      } else if (
        hrActiveTimeDesc.includes("分") ||
        hrActiveTimeDesc.includes("时") ||
        hrActiveTimeDesc.includes("日") ||
        hrActiveTimeDesc.includes("周") ||
        hrActiveTimeDesc.includes("月")
      ) {
        if (hrActiveTimeDesc.includes("分")) {
          coefficient = 60000;
        } else if (hrActiveTimeDesc.includes("时")) {
          coefficient = 3600000;
        } else if (hrActiveTimeDesc.includes("日")) {
          coefficient = 86400000;
        } else if (hrActiveTimeDesc.includes("周")) {
          coefficient = 86400000 * 7;
        } else {
          coefficient = 86400000 * 30;
        }
        let groups = hrActiveTimeDesc.match(ACTIVE_TIME_MATCH).groups;
        if (groups) {
          let num = groups.num;
          if (num) {
            offsetTime = Number.parseInt(num) * coefficient;
          } else {
            //没有数字，只有本字，如：本周
            offsetTime = 1 * coefficient;
          }
        }
      } else if (hrActiveTimeDesc.includes("半年前")) {
        offsetTime = halfYear;
      } else if (hrActiveTimeDesc.includes("近半年")) {
        offsetTime = halfYear + 86400000;
      } else {
        offsetTime = oneYear;
      }
    } else {
      offsetTime = oneYear;
    }
    return offsetTime;
  }
  console.log("[setup] data handle");
  //data handle

  class Job {
    jobId;
    jobPlatform;
    jobUrl;
    jobName;
    jobCompanyName;
    jobLocationName;
    jobAddress;
    jobLongitude;
    jobLatitude;
    jobDescription;
    jobDegreeName;
    jobYear;
    jobSalaryMin;
    jobSalaryMax;
    jobSalaryTotalMonth;
    jobFirstPublishDatetime;
    bossName;
    bossCompanyName;
    bossPosition;
    createDatetime;
    updateDatetime;
  }

  class Company {
    /**
     * 编号
     */
    companyId;
    /**
     * 公司名
     */
    companyName;
    /**
     * 公司描述
     */
    companyDesc;
    /**
     * 成立时间
     */
    companyStartDate;
    /**
     * 经营状态
     */
    companyStatus;
    /**
     * 法人
     */
    companyLegalPerson;
    /**
     * 统一社会信用代码
     */
    companyUnifiedCode;
    /**
     * 官网
     */
    companyWebSite;
    /**
     * 社保人数
     */
    companyInsuranceNum;
    /**
     * 自身风险数
     */
    companySelfRisk;
    /**
     * 关联风险数
     */
    companyUnionRisk;
    /**
     * 地址
     */
    companyAddress;
    /**
     * 经营范围
     */
    companyScope;
    /**
     * 纳税人识别号
     */
    companyTaxNo;
    /**
     * 所属行业
     */
    companyIndustry;
    /**
     * 工商注册号
     */
    companyLicenseNumber;
    /**
     * 经度
     */
    companyLongitude;
    /**
     * 维度
     */
    companyLatitude;
    /**
     * 数据来源地址
     */
    sourceUrl;
    /**
     * 数据来源平台
     */
    sourcePlatform;
    /**
     * 数据来源记录编号
     */
    sourceRecordId;
    /**
     * 数据来源更新时间
     */
    sourceRefreshDatetime;
    createDatetime;
    updateDatetime;
  }

  const SALARY_MATCH = /(?<min>[0-9\.]*)(?<minUnit>\D*)(?<max>[0-9\.]*)(?<maxUnit>\D*)(?<month>\d*)/;
  const JOB_YEAR_MATCH = /(?<min>[0-9\.]*)\D*(?<max>[0-9\.]*)/;

  async function getJobs(list, platform) {
    let jobs;
    if (PLATFORM_51JOB == platform) {
      jobs = handle51JobData(list);
    } else if (PLATFORM_BOSS == platform) {
      jobs = handleBossData(list);
    } else if (PLATFORM_ZHILIAN == platform) {
      jobs = handleZhilianData(list);
    } else if (PLATFORM_LAGOU == platform) {
      jobs = handleLagouData(list);
    } else if (PLATFORM_JOBSDB == platform) {
      jobs = handleJobsdb(list);
    } else if (PLATFORM_LIEPIN == platform) {
      jobs = handleLiepin(list);
    } else {
      //skip
    }
    return jobs;
  }

  function genId(id, platform) {
    return platform + "_" + id;
  }

  function getJobIds(list, platform) {
    let result = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let jobId;
      if (PLATFORM_51JOB == platform) {
        jobId = item.jobId;
      } else if (PLATFORM_BOSS == platform) {
        jobId = item.value.zpData.jobInfo.encryptId;
      } else if (PLATFORM_ZHILIAN == platform) {
        jobId = item.jobId;
      } else if (PLATFORM_LAGOU == platform) {
        jobId = item.positionId;
      } else if (PLATFORM_JOBSDB == platform) {
        jobId = item.id;
      } else if (PLATFORM_LIEPIN == platform) {
        jobId = item.job.jobId;
      } else {
        //skip
      }
      result.push(genId(jobId, platform));
    }
    return result;
  }

  function handleLiepin(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      const {
        jobId,
        link,
        title,
        dq,
        requireEduLevel,
        requireWorkYears,
        salary,
        refreshTime,
        jobDesc, //访问详情页面而来的
      } = item.job;
      const { compName } = item.comp;
      const { recruiterName, recruiterTitle } = item.recruiter;
      job.jobId = genId(jobId, PLATFORM_LIEPIN);
      job.jobPlatform = PLATFORM_LIEPIN;
      job.jobUrl = link;
      job.jobName = title;
      job.jobCompanyName = compName;
      job.jobLocationName = dq;
      job.jobAddress = dq;
      job.jobLongitude = "";
      job.jobLatitude = "";
      job.jobDescription = jobDesc;
      job.jobDegreeName = requireEduLevel;
      //handle job year
      let jobYearGroups = requireWorkYears?.match(JOB_YEAR_MATCH)?.groups;
      if (jobYearGroups) {
        job.jobYear = jobYearGroups.min;
      } else {
        //skip
      }
      //handle salary
      //TODO salary content was complex,not handle all situation
      if (salary) {
        let targetSalary = salary.replaceAll(",", "").replaceAll("$", "");
        let groups = targetSalary.match(SALARY_MATCH)?.groups;
        if (groups) {
          let coefficient;
          let minUnitCoefficient;
          let maxUnitCoefficient;
          if (salary.includes("per hour")) {
            //一天8小时工作5天
            coefficient = 1 * 8 * 5;
          } else {
            coefficient = 1;
          }
          if (groups?.minUnit.includes("k")) {
            minUnitCoefficient = 1000;
          } else {
            if (
              groups?.minUnit.includes("-") &&
              groups?.maxUnit.includes("k")
            ) {
              minUnitCoefficient = 1000;
            } else {
              minUnitCoefficient = 1;
            }
          }
          if (groups?.maxUnit.includes("k")) {
            maxUnitCoefficient = 1000;
          } else {
            maxUnitCoefficient = 1;
          }
          job.jobSalaryMin =
            Number.parseInt(groups?.min) * coefficient * minUnitCoefficient;
          job.jobSalaryMax =
            Number.parseInt(groups?.max) * coefficient * maxUnitCoefficient;
        } else {
          //skip
        }
      }
      if (salary.endsWith("薪")) {
        let groups = salary.match(SALARY_MATCH)?.groups;
        job.jobSalaryTotalMonth = groups.month;
      } else {
        job.jobSalaryTotalMonth = "";
      }
      //暂未找到首次发布时间，用更新时间代替
      job.jobFirstPublishDatetime = refreshTime;
      job.bossName = recruiterName;
      job.bossCompanyName = compName;
      job.bossPosition = recruiterTitle;
      jobs.push(job);
    }
    return jobs;
  }

  function handleJobsdb(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      const { id, jobUrl, title, jobDetail, listingDate, salary } = item;
      const { description: companyFullName } = item.advertiser;
      const { countryCode: city, label: positionAddress } = item.jobLocation;
      job.jobId = genId(id, PLATFORM_JOBSDB);
      job.jobPlatform = PLATFORM_JOBSDB;
      job.jobUrl = jobUrl;
      job.jobName = title;
      job.jobCompanyName = companyFullName;
      job.jobLocationName = city;
      job.jobAddress = positionAddress;
      job.jobLongitude = "";
      job.jobLatitude = "";
      job.jobDescription = jobDetail;
      job.jobDegreeName = "";
      job.jobYear = "";
      //handle salary
      //TODO salary content was complex,not handle all situation
      let targetSalary = salary.replaceAll(",", "").replaceAll("$", "");
      let groups = targetSalary.match(SALARY_MATCH)?.groups;
      if (groups) {
        let coefficient;
        let minUnitCoefficient;
        let maxUnitCoefficient;
        if (salary.includes("per hour")) {
          //一天8小时工作5天
          coefficient = 1 * 8 * 5;
        } else {
          coefficient = 1;
        }
        if (groups?.minUnit.includes("k")) {
          minUnitCoefficient = 1000;
        } else {
          minUnitCoefficient = 1;
        }
        if (groups?.maxUnit.includes("k")) {
          maxUnitCoefficient = 1000;
        } else {
          maxUnitCoefficient = 1;
        }
        job.jobSalaryMin =
          Number.parseInt(groups?.min) * coefficient * minUnitCoefficient;
        job.jobSalaryMax =
          Number.parseInt(groups?.max) * coefficient * maxUnitCoefficient;
      } else {
        //skip
      }
      job.jobSalaryTotalMonth = null;
      job.jobFirstPublishDatetime = listingDate;
      job.bossName = "";
      job.bossCompanyName = companyFullName;
      job.bossPosition = null;
      jobs.push(job);
    }
    return jobs;
  }

  function handleLagouData(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      const {
        positionId,
        positionName,
        companyFullName,
        city,
        positionAddress,
        longitude,
        latitude,
        positionDetail,
        education,
        workYear,
        salary,
        publisherId,
        createTime,
      } = item;
      job.jobId = genId(positionId, PLATFORM_LAGOU);
      job.jobPlatform = PLATFORM_LAGOU;
      job.jobUrl = "https://www.lagou.com/wn/jobs/" + positionId + ".html";
      job.jobName = positionName;
      job.jobCompanyName = companyFullName;
      job.jobLocationName = city;
      job.jobAddress = positionAddress;
      job.jobLongitude = longitude;
      job.jobLatitude = latitude;
      job.jobDescription = positionDetail;
      job.jobDegreeName = education;
      //handle job year
      let jobYearGroups = workYear.match(JOB_YEAR_MATCH)?.groups;
      if (jobYearGroups) {
        job.jobYear = jobYearGroups.min;
      } else {
        //skip
      }
      //handle salary
      let groups = salary.match(SALARY_MATCH)?.groups;
      if (groups) {
        //unit is K,1K = 1000
        job.jobSalaryMin = Number.parseInt(groups?.min) * 1000;
        job.jobSalaryMax = Number.parseInt(groups?.max) * 1000;
      } else {
        //skip
      }
      job.jobSalaryTotalMonth = null;
      job.jobFirstPublishDatetime = createTime;
      job.bossName = publisherId;
      job.bossCompanyName = companyFullName;
      job.bossPosition = null;
      jobs.push(job);
    }
    return jobs;
  }

  function handleZhilianData(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      const {
        jobId,
        positionUrl,
        name,
        companyName,
        workCity,
        streetName,
        jobSummary,
        education,
        workingExp,
        salaryReal,
        firstPublishTime,
        salaryCount,
      } = item;
      const { staffName, hrJob } = item.staffCard;
      job.jobId = genId(jobId, PLATFORM_ZHILIAN);
      job.jobPlatform = PLATFORM_ZHILIAN;
      job.jobUrl = positionUrl;
      job.jobName = name;
      job.jobCompanyName = companyName;
      job.jobLocationName = workCity;
      job.jobAddress = streetName;
      job.jobLongitude = null;
      job.jobLatitude = null;
      job.jobDescription = jobSummary;
      job.jobDegreeName = education;
      //handle job year
      let jobYearGroups = workingExp.match(JOB_YEAR_MATCH)?.groups;
      if (jobYearGroups) {
        job.jobYear = jobYearGroups.min;
      } else {
        //skip
      }
      //handle salary
      let groups = salaryReal.match(SALARY_MATCH)?.groups;
      if (groups) {
        job.jobSalaryMin = Number.parseInt(groups?.min);
        job.jobSalaryMax = Number.parseInt(groups?.max);
      } else {
        //skip
      }
      //handle salary month
      let groupsSalaryCount = salaryCount.match(/(?<count>\d*)/)?.groups;
      job.jobSalaryTotalMonth = groupsSalaryCount.count;
      job.jobFirstPublishDatetime = firstPublishTime;
      job.bossName = staffName;
      job.bossCompanyName = companyName;
      job.bossPosition = hrJob;
      jobs.push(job);
    }
    return jobs;
  }

  function handleBossData(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      let zpData = item.value.zpData;
      const { brandName } = zpData.brandComInfo;
      const { name, brandName: bossBranchName, title } = zpData.bossInfo;
      const {
        encryptId,
        jobName,
        locationName,
        address,
        longitude,
        latitude,
        postDescription,
        degreeName,
        experienceName,
        salaryDesc,
        jobStatusDesc,
        jobUrl,
      } = zpData.jobInfo;
      job.jobId = genId(encryptId, PLATFORM_BOSS);
      job.jobPlatform = PLATFORM_BOSS;
      job.jobUrl = jobUrl;
      job.jobName = jobName;
      job.jobCompanyName = brandName;
      job.jobLocationName = locationName;
      job.jobAddress = address;
      job.jobLongitude = longitude;
      job.jobLatitude = latitude;
      job.jobDescription = postDescription;
      job.jobDegreeName = degreeName;
      //handle job year
      let jobYearGroups = experienceName.match(JOB_YEAR_MATCH)?.groups;
      if (jobYearGroups) {
        job.jobYear = jobYearGroups.min;
      } else {
        //skip
      }
      //handle salary
      let groups = salaryDesc.match(SALARY_MATCH)?.groups;
      if (groups) {
        let coefficient;
        if (salaryDesc.includes("元") && salaryDesc.includes("天")) {
          //一个月算20天工作日，一般一周5天，有些特殊的6天工作
          coefficient = 1 * 20;
        } else if (salaryDesc.includes("元")) {
          coefficient = 1;
        } else {
          coefficient = 1000;
        }
        job.jobSalaryMin = Number.parseInt(groups?.min) * coefficient;
        job.jobSalaryMax = Number.parseInt(groups?.max) * coefficient;
        job.jobSalaryTotalMonth = groups?.month;
      } else {
        //skip
      }
      if (jobStatusDesc == JOB_STATUS_DESC_NEWEST.key) {
        //招聘状态为最新，则代表一周内发布的职位。记录入库的时间设置取今天零点。
        job.jobFirstPublishDatetime = dayjs(new Date()).startOf("day");
      } else {
        job.jobFirstPublishDatetime = null;
      }
      job.bossName = name;
      job.bossCompanyName = bossBranchName;
      job.bossPosition = title;
      jobs.push(job);
    }
    return jobs;
  }

  function handle51JobData(list) {
    let jobs = [];
    for (let i = 0; i < list.length; i++) {
      let job = new Job();
      let item = list[i];
      const {
        jobId,
        jobHref,
        jobName,
        fullCompanyName,
        jobAreaString,
        lat,
        lon,
        jobDescribe,
        degreeString,
        jobSalaryMin,
        jobSalaryMax,
        hrName,
        hrPosition,
        confirmDateString,
        provideSalaryString,
        workYearString,
      } = item;
      job.jobId = genId(jobId, PLATFORM_51JOB);
      job.jobPlatform = PLATFORM_51JOB;
      job.jobUrl = jobHref;
      job.jobName = jobName;
      job.jobCompanyName = fullCompanyName;
      job.jobLocationName = jobAreaString;
      job.jobAddress = jobAreaString;
      job.jobLongitude = lon;
      job.jobLatitude = lat;
      job.jobDescription = jobDescribe;
      job.jobDegreeName = degreeString;
      if (workYearString.endsWith("无需经验")) {
        job.jobYear = 0;
      } else {
        let groups = workYearString.match(/(?<min>[0-9\.]*)/)?.groups;
        job.jobYear = groups.min;
      }
      job.jobSalaryMin = jobSalaryMin;
      job.jobSalaryMax = jobSalaryMax;
      if (provideSalaryString.endsWith("薪")) {
        let groups = provideSalaryString.match(SALARY_MATCH)?.groups;
        job.jobSalaryTotalMonth = groups.month;
      } else {
        job.jobSalaryTotalMonth = "";
      }
      job.jobFirstPublishDatetime = confirmDateString;
      job.bossName = hrName;
      job.bossCompanyName = fullCompanyName;
      job.bossPosition = hrPosition;
      jobs.push(job);
    }
    return jobs;
  }

  function handleAiqichaData(source) {
    let company = new Company();
    company.companyName = companyNameConvert(source.entName);
    company.companyDesc = source.describe;
    company.companyStartDate = convertDateStringToDateObject(source.startDate);
    company.companyStatus = source.openStatus;
    company.companyLegalPerson = source.legalPerson;
    company.companyUnifiedCode = source.unifiedCode;
    company.companyWebSite = source.website;
    company.companyInsuranceNum = source?.insuranceInfo?.insuranceNum;
    company.companySelfRisk = source.selfRiskTotal;
    company.companyUnionRisk = source.unionRiskTotal;
    company.companyAddress = source.addr;
    company.companyScope = source.scope;
    company.companyTaxNo = source.taxNo;
    company.companyIndustry = source.industry;
    company.companyLicenseNumber = source.licenseNumber;
    company.companyLongitude = source?.geoInfo?.lng;
    company.companyLatitude = source?.geoInfo.lat;
    company.sourceUrl = source.sourceUrl;
    company.sourcePlatform = PLATFORM_AIQICHA;
    company.sourceRecordId = source.pid;
    company.sourceRefreshDatetime = convertDateStringToDateObject(
      source.refreshTime
    );
    return company;
  }

  /**
   * 转换公司名称，中文括号转为英文括号
   * @param {string} name
   * @returns
   */
  function companyNameConvert(name) {
    return name.replaceAll("（", "(").replaceAll("）", ")");
  }

  console.log("[setup] handler");
  //handler
  const handler = {
    job51: {
      handle: function (responseText) {
        try {
          const data = JSON.parse(responseText);
          mutationContainer().then((node) => {
            setupSortJobItem(node);
            parseData(data?.resultbody?.job?.items || [], getListByNode(node));
          });
        } catch (err) {
          console.error("解析 JSON 失败", err);
        }

        // 获取职位列表节点
        function getListByNode(node) {
          const children = node?.children;
          return function getListItem(index) {
            return children?.[index];
          };
        }

        // 监听 positionList-hook 节点，判断职位列表是否被挂载
        function mutationContainer() {
          return new Promise((resolve, reject) => {
            const dom = document.querySelector(".joblist");
            const observer = new MutationObserver(function (childList, obs) {
              const isAdd = (childList || []).some((item) => {
                return item?.addedNodes?.length > 0;
              });
              return isAdd ? resolve(dom) : reject("未找到职位列表");
            });

            observer.observe(dom, {
              childList: true,
              subtree: false,
            });
          });
        }

        // 解析数据，插入时间标签
        async function parseData(list, getListItem) {
          list.forEach((item, index) => {
            const dom = getListItem(index);
            const { companyName } = item;
            let loadingLastModifyTimeTag = createLoadingDOM(
              companyName,
              "__job51_time_tag"
            );
            dom.appendChild(loadingLastModifyTimeTag);
          });

          let jobDTOList = await getJobs(list, PLATFORM_51JOB);
          list.forEach((item, index) => {
            const dom = getListItem(index);
            let tag = createDOM(jobDTOList[index]);
            dom.appendChild(tag);
          });
          hiddenLoadingDOM();
          renderSortJobItem(jobDTOList, getListItem, {
            platform: PLATFORM_51JOB,
          });
          renderFunctionPanel(jobDTOList, getListItem, {
            platform: PLATFORM_51JOB,
          });
        }

        function createDOM(jobDTO) {
          const div = document.createElement("div");
          div.classList.add("__job51_time_tag");
          renderTimeTag(div, jobDTO);
          return div;
        }
      },
    },
    boss: {
      handle: function (responseText) {
        try {
          const data = JSON.parse(responseText);
          mutationContainer().then((node) => {
            setupSortJobItem(node);
            parseBossData(data?.zpData?.jobList || [], getListByNode(node));
            onlineFilter();
          });
          return;
        } catch (err) {
          console.error("解析 JSON 失败", err);
        }

        // 获取职位列表节点
        function getListByNode(node) {
          const children = node?.children;
          return function getListItem(index) {
            return children?.[index];
          };
        }

        // 监听 search-job-result 节点，判断职位列表是否被挂载
        function mutationContainer() {
          return new Promise((resolve, reject) => {
            const dom = document.querySelector(".search-job-result");
            const observer = new MutationObserver(function (childList, obs) {
              (childList || []).forEach((item) => {
                const { addedNodes } = item;
                if (addedNodes && addedNodes.length > 0) {
                  addedNodes.forEach((node) => {
                    const { className } = node;
                    if (className === "job-list-box") {
                      observer.disconnect();
                      resolve(node);
                    }
                  });
                }
              });
              return reject("未找到职位列表");
            });

            observer.observe(dom, {
              childList: true,
              subtree: false,
            });
          });
        }

        function convertJobStatusDesc(statusText) {
          if (statusText == JOB_STATUS_DESC_NEWEST.key) {
            return JOB_STATUS_DESC_NEWEST;
          } else if (statusText == JOB_STATUS_DESC_RECRUITING.key) {
            return JOB_STATUS_DESC_RECRUITING;
          } else {
            return JOB_STATUS_DESC_UNKNOW;
          }
        }

        // 解析数据，插入时间标签
        function parseBossData(list, getListItem) {
          const apiUrlList = [];
          const urlList = [];
          list.forEach((item, index) => {
            const { brandName, securityId } = item;
            const dom = getListItem(index);
            //apiUrl
            let pureJobItemDetailApiUrl =
              "https://www.zhipin.com/wapi/zpgeek/job/detail.json?securityId=" +
              securityId;
            apiUrlList.push(pureJobItemDetailApiUrl);
            //jobUrl
            const jobItemDetailUrl = dom
              .querySelector(".job-card-body")
              .querySelector(".job-card-left").href;
            const url = new URL(jobItemDetailUrl);
            let pureJobItemDetailUrl = url.origin + url.pathname;
            urlList.push(pureJobItemDetailUrl);

            let loadingLastModifyTimeTag = createLoadingDOM(
              brandName,
              "__boss_time_tag"
            );
            dom.appendChild(loadingLastModifyTimeTag);
          });
          const promiseList = apiUrlList.map(async (url, index) => {
            const DELAY_FETCH_TIME = 75; //ms
            const DELAY_FETCH_TIME_RANDOM_OFFSET = 50; //ms
            await randomDelay(
              DELAY_FETCH_TIME * index,
              DELAY_FETCH_TIME_RANDOM_OFFSET
            ); // 避免频繁请求触发风控
            const response = await fetch(url);
            const result = await response.json();
            return result;
          });

          Promise.allSettled(promiseList)
            .then(async (jsonList) => {
              let jobDTOList = [];
              jsonList.forEach((item, index) => {
                item.value.zpData.jobInfo.jobUrl = urlList[index];
              });

              jobDTOList = await getJobs(jsonList, PLATFORM_BOSS);
              const lastModifyTimeList = [];
              const jobStatusDescList = [];
              jsonList.forEach((item, index) => {
                lastModifyTimeList.push(
                  dayjs(item.value?.zpData?.brandComInfo?.activeTime)
                );
                let jobStatus = convertJobStatusDesc(
                  item.value?.zpData?.jobInfo?.jobStatusDesc
                );
                jobStatusDescList.push(jobStatus);
                //额外针对BOSS平台，为后面的排序做准备
                jobDTOList[index].jobStatusDesc = jobStatus;
                jobDTOList[
                  index
                ].jobCompanyApiUrl = `https://www.zhipin.com/gongsi/${item.value?.zpData?.brandComInfo?.encryptBrandId}.html`;
                let hrActiveTimeDesc =
                  item.value?.zpData?.bossInfo?.activeTimeDesc;
                //额外针对BOSS平台，为后面的排序做准备
                jobDTOList[index].hrActiveTimeDesc = hrActiveTimeDesc;
              });

              list.forEach((item, index) => {
                const dom = getListItem(index);
                let tag = createDOM(
                  jobDTOList[index],
                  jobStatusDescList[index]
                );
                dom.appendChild(tag);
              });
              hiddenLoadingDOM();
              renderSortJobItem(jobDTOList, getListItem, {
                platform: PLATFORM_BOSS,
              });
              renderFunctionPanel(jobDTOList, getListItem, {
                platform: PLATFORM_BOSS,
                getCompanyInfoFunction: async function (url) {
                  const response = await makeGetRequest(url);
                  const result = response.responseText;
                  const MATCH_COMPANY = /企业名称：<\/span>(?<data>.*)<\/li>/;
                  const groups = result.match(MATCH_COMPANY)?.groups;
                  if (groups) {
                    return groups["data"];
                  } else {
                    return null;
                  }
                },
              });
            })
            .catch((error) => {
              console.error(error);
              hiddenLoadingDOM();
            });
        }

        function createDOM(jobDTO, jobStatusDesc) {
          const div = document.createElement("div");
          div.classList.add("__boss_time_tag");
          renderTimeTag(div, jobDTO, {
            jobStatusDesc: jobStatusDesc,
            platform: PLATFORM_BOSS,
          });
          return div;
        }

        function onlineFilter() {
          const bfEle = document.querySelector(
            ".__boss_filter.condition-filter-select"
          );
          if (bfEle) {
            _console("1. bfEle 已经存在");
            // 先移除选中样式
            bfEle.classList.remove("is-select");
          } else {
            // 不存在则创建并添加到DOM树中
            try {
              createFilter();
            } catch (error) {
              _console("新增筛选出错", error);
            }
          }
        }

        function _console() {
          console.log(...arguments);
        }

        // 创建filter过滤招聘人在线的job
        function createFilter() {
          _console("2. bfEle 不存在，执行添加");

          let newFilterNode = document.createElement("div");
          newFilterNode.innerHTML = `<div class="current-select">
        <span class="placeholder-text">招聘人在线</span>
    </div>`;
          newFilterNode.classList.add(
            "condition-filter-select",
            "__boss_filter"
          );

          // 绑定点击事件
          newFilterNode.addEventListener("click", function (e) {
            e.stopPropagation();

            let filterEle = e.currentTarget;
            const isSelected = filterEle.classList.contains("is-select");
            if (isSelected) {
              filterEle.classList.remove("is-select");
            } else {
              filterEle.classList.add("is-select");
            }
            Array.from(
              document.querySelectorAll(".search-job-result .job-card-wrapper")
            ).map((node) => {
              const isOnline =
                node.getElementsByClassName("boss-online-tag").length !== 0;
              if (isSelected) {
                node.classList.remove("__boss_filter_result-hidden");
              } else {
                !isOnline && node.classList.add("__boss_filter_result-hidden");
              }
            });
          });

          // 插入到父元素 .search-condition-wrapper 最后一个元素之前
          let parentNode = document.querySelector(".search-condition-wrapper");

          if (parentNode !== null) {
            let lastChild = parentNode.lastChild;
            parentNode.insertBefore(newFilterNode, lastChild);
          } else {
            _console("3. parentNode 不存在，无法插入filter");
          }
        }
      },
    },
    zhilian: {
      build: function () {
        // 获取职位列表节点
        function getListByNode(node) {
          const children = node?.children;
          return function getListItem(index) {
            return children?.[index];
          };
        }

        // 监听 positionList-hook 节点，判断职位列表是否被挂载
        function mutationContainer() {
          return new Promise((resolve, reject) => {
            const dom = document.querySelector(".positionlist__list");
            const observer = new MutationObserver(function (childList) {
              const isAdd = (childList || []).some((item) => {
                return item?.addedNodes?.length > 0;
              });
              return isAdd ? resolve(dom) : reject("未找到职位列表");
            });

            observer.observe(dom, {
              childList: true,
              subtree: false,
            });
          });
        }

        // 解析数据，插入时间标签
        async function parseZhilianData(list, getListItem) {
          list.forEach((item, index) => {
            const dom = getListItem(index);
            const { companyName } = item;
            let loadingLastModifyTimeTag = createLoadingDOM(
              companyName,
              "__zhilian_time_tag"
            );
            dom.appendChild(loadingLastModifyTimeTag);
          });

          let jobDTOList = await getJobs(list, PLATFORM_ZHILIAN);
          list.forEach((item, index) => {
            const dom = getListItem(index);
            let tag = createDOM(jobDTOList[index]);
            dom.appendChild(tag);
          });
          hiddenLoadingDOM();
          renderSortJobItem(jobDTOList, getListItem, {
            platform: PLATFORM_ZHILIAN,
          });
          renderFunctionPanel(jobDTOList, getListItem, {
            platform: PLATFORM_ZHILIAN,
          });
        }

        function createDOM(jobDTO) {
          const div = document.createElement("div");
          div.classList.add("__zhilian_time_tag");
          renderTimeTag(div, jobDTO);
          return div;
        }
        return {
          handle: function (responseText) {
            try {
              const data = JSON.parse(responseText);
              mutationContainer().then((node) => {
                setupSortJobItem(node);
                parseZhilianData(data?.data?.list || [], getListByNode(node));
              });
            } catch (err) {
              console.error("解析 JSON 失败", err);
            }
          },
          handleFirstTimeOpen: async function (data) {
            const dom = document.querySelector(".positionlist__list");
            setupSortJobItem(dom);
            const children = dom?.children;
            const { positionList = [] } = data;
            if (!children || !positionList || positionList.lenth === 0) return;
            positionList.forEach((item, index) => {
              const dom = children?.[index];
              const { companyName } = item;
              let loadingLastModifyTimeTag = createLoadingDOM(
                companyName,
                "__zhilian_time_tag"
              );
              dom.appendChild(loadingLastModifyTimeTag);
            });
            let jobDTOList = await getJobs(positionList, PLATFORM_ZHILIAN);
            positionList.forEach((item, index) => {
              const dom = children?.[index];
              if (!dom) return;

              let tag = createDOM(jobDTOList[index]);
              dom.appendChild(tag);
            });
            hiddenLoadingDOM();
            renderSortJobItem(
              jobDTOList,
              (index) => {
                return children?.[index];
              },
              { platform: PLATFORM_ZHILIAN }
            );
            renderFunctionPanel(
              jobDTOList,
              (index) => {
                return children?.[index];
              },
              { platform: PLATFORM_ZHILIAN }
            );
          },
        };
      },
    },
    lagou: {
      build: function () {
        function getListValue(data = {}) {
          return ["content", "positionResult", "result"].reduce(
            (value, key) => {
              return value ? value?.[key] : undefined;
            },
            data
          );
        }

        // 获取职位列表节点
        function getListByNode(node) {
          const children = node?.children;
          return function getListItem(index) {
            return children?.[index];
          };
        }

        // 监听节点，判断职位列表是否被挂载
        function mutationContainer() {
          return new Promise((resolve, reject) => {
            const dom = document.getElementById("jobList");
            // 首次刷新页面的时候会触发多次，所以加上 debounce
            const observer = new MutationObserver(
              debounce(function (childList) {
                // 拉勾的页面会触发多次，都是先删除 jobList 节点，再添加回去
                const isAdd = (childList || []).some((item) => {
                  return item?.addedNodes?.length > 0;
                });
                return isAdd
                  ? resolve(dom.querySelector(".list__YibNq"))
                  : reject("未找到职位列表");
              }, 1000)
            );

            observer.observe(dom, {
              childList: true,
              subtree: false,
            });
          });
        }

        // 解析数据，插入时间标签
        async function parseLaGouData(list, getListItem) {
          list.forEach((item, index) => {
            const dom = getListItem(index);
            const { companyShortName } = item;
            let loadingLastModifyTimeTag = createLoadingDOM(
              companyShortName,
              "__zhipin_time_tag"
            );
            dom.appendChild(loadingLastModifyTimeTag);
          });

          let jobDTOList = await getJobs(list, PLATFORM_LAGOU);
          list.forEach((item, index) => {
            const dom = getListItem(index);
            let tag = createDOM(jobDTOList[index]);
            dom.appendChild(tag);
          });
          hiddenLoadingDOM();
          renderSortJobItem(jobDTOList, getListItem, {
            platform: PLATFORM_LAGOU,
          });
          renderFunctionPanel(jobDTOList, getListItem, {
            platform: PLATFORM_LAGOU,
          });
        }

        function createDOM(jobDTO) {
          const div = document.createElement("div");
          div.classList.add("__zhipin_time_tag");
          renderTimeTag(div, jobDTO);
          return div;
        }

        return {
          handle: function (responseText) {
            try {
              const data = JSON.parse(responseText);
              mutationContainer().then((node) => {
                setupSortJobItem(node); // 添加 flex 样式，以便后续用 order 进行排序
                parseLaGouData(getListValue(data) || [], getListByNode(node));
              });
            } catch (err) {
              console.error("解析 JSON 失败", err);
            }
          },
          handleFirstTimeOpen: async function (data) {
            mutationContainer().then(async (dom) => {
              setupSortJobItem(dom);
              const children = dom?.children;
              const list = getListValue(data?.props?.pageProps?.initData) || [];
              // 这里可以查看具体job list信息
              // console.log(list);
              if (!children || !list || list.lenth === 0) return;
              list.forEach((item, index) => {
                const dom = children?.[index];
                const { companyShortName } = item;
                let loadingLastModifyTimeTag = createLoadingDOM(
                  companyShortName,
                  "__zhipin_time_tag"
                );
                dom.appendChild(loadingLastModifyTimeTag);
              });
              let jobDTOList = await getJobs(list, PLATFORM_LAGOU);
              list.forEach((item, index) => {
                const dom = children?.[index];
                if (!dom) return;

                let tag = createDOM(jobDTOList[index]);
                dom.appendChild(tag);
              });
              hiddenLoadingDOM();
              renderSortJobItem(
                jobDTOList,
                (index) => {
                  return children?.[index];
                },
                { platform: PLATFORM_LAGOU }
              );
              renderFunctionPanel(
                jobDTOList,
                (index) => {
                  return children?.[index];
                },
                { platform: PLATFORM_LAGOU }
              );
            });
          },
        };
      },
    },
    liepin: {
      handle: function (responseText) {
        try {
          const data = JSON.parse(responseText);
          mutationContainer().then((node) => {
            setupSortJobItem(node);
            parseData(data?.data?.data?.jobCardList || [], getListByNode(node));
          });
        } catch (err) {
          console.error("解析 JSON 失败", err);
        }

        // 获取职位列表节点
        function getListByNode(node) {
          const children = node?.children;
          return function getListItem(index) {
            return children?.[index];
          };
        }

        // 监听节点，判断职位列表是否被挂载
        function mutationContainer() {
          return new Promise((resolve, reject) => {
            const dom = document.querySelector(".content-left-section");
            let targetDeom = null;
            const observer = new MutationObserver(function (childList, obs) {
              const isAdd = (childList || []).some((item) => {
                let nodes = item?.addedNodes;
                if (nodes) {
                  for (let i = 0; i < nodes.length; i++) {
                    let nodeItem = nodes[i];
                    if (nodeItem.className == "job-list-box") {
                      targetDeom = nodeItem;
                      return nodeItem;
                    }
                  }
                  return false;
                } else {
                  return false;
                }
              });
              return isAdd ? resolve(targetDeom) : reject("未找到职位列表");
            });

            observer.observe(dom, {
              childList: true,
              subtree: false,
            });
          });
        }

        // 解析数据，插入时间标签
        async function parseData(list, getListItem) {
          const urlList = [];
          list.forEach((item, index) => {
            const dom = getListItem(index);
            const { link } = item.job;
            //apiUrl
            urlList.push(link);

            dom.classList.add("__LIEPIN_job_item");
            //某些职位不知什么原因不显示，现在把其显示出来
            let jobCard = dom.querySelector(".job-card-pc-container");
            if (jobCard.style.display == "none") {
              jobCard.style.display = "flex";
            }
            const { compName } = item.comp;
            let loadingLastModifyTimeTag = createLoadingDOM(
              compName,
              "__liepin_time_tag"
            );
            dom.appendChild(loadingLastModifyTimeTag);
          });
          const promiseList = urlList.map(async (url, index) => {
            const DELAY_FETCH_TIME = 75; //ms
            const DELAY_FETCH_TIME_RANDOM_OFFSET = 50; //ms
            await randomDelay(
              DELAY_FETCH_TIME * index,
              DELAY_FETCH_TIME_RANDOM_OFFSET
            ); // 避免频繁请求触发风控
            const response = await fetch(url);
            const result = await response.text();
            return result;
          });
          Promise.allSettled(promiseList)
            .then(async (jobDetailHtmlContentList) => {
              const hrActiveTimeDescList = [];
              jobDetailHtmlContentList.forEach((item, index) => {
                let jobDesc = null;
                let jobDescFilterTextList = item.value.match(
                  /<dd data-selector="job-intro-content">[\s\S]*?<\/dd>/g
                );
                if (jobDescFilterTextList && jobDescFilterTextList.length > 0) {
                  const jobDescGroups = jobDescFilterTextList[0].match(
                    /<dd data-selector="job-intro-content">(?<data>[\s\S]*)<\/dd>/
                  )?.groups;
                  if (jobDescGroups) {
                    jobDesc = jobDescGroups["data"];
                  }
                }
                list[index].job.jobDesc = jobDesc;
                let hrActiveTimeDesc = null;
                let hrActiveTimeDescGroups = item.value.match(
                  /<span class="online off">(?<data>.*)<\/span>/
                )?.groups;
                if (hrActiveTimeDescGroups) {
                  hrActiveTimeDesc = hrActiveTimeDescGroups["data"];
                }
                hrActiveTimeDescList.push(hrActiveTimeDesc);
              });
              let jobDTOList = await getJobs(list, PLATFORM_LIEPIN);
              list.forEach((item, index) => {
                const { compId } = item.comp;
                jobDTOList[
                  index
                ].jobCompanyApiUrl = `https://www.liepin.com/company/${compId}`;
                jobDTOList[index].hrActiveTimeDesc =
                  hrActiveTimeDescList[index];
                const dom = getListItem(index);
                let tag = createDOM(jobDTOList[index]);
                dom.appendChild(tag);
              });
              hiddenLoadingDOM();
              renderSortJobItem(jobDTOList, getListItem, {
                platform: PLATFORM_LIEPIN,
              });
              renderFunctionPanel(jobDTOList, getListItem, {
                platform: PLATFORM_LIEPIN,
                getCompanyInfoFunction: async function (url) {
                  const response = await fetch(url);
                  const result = await response.text();
                  //eg: ["企业全称</span></p><pclass=\"text\">长沙裕邦软件开发有限公司</p>"]
                  let firstFilterTextList = result
                    .replaceAll("\n", "")
                    .replaceAll(" ", "")
                    .match(/企业全称<\/span><\/p>.*?\/p>/g);
                  if (firstFilterTextList && firstFilterTextList.length > 0) {
                    const groups = firstFilterTextList[0].match(
                      /">(?<data>.*)<\/p>/
                    )?.groups;
                    if (groups) {
                      return groups["data"];
                    } else {
                      return null;
                    }
                  }
                  return null;
                },
              });
              finalRender(jobDTOList, { platform: PLATFORM_LIEPIN });
            })
            .catch((error) => {
              console.log(error);
              hiddenLoadingDOM();
            });
        }

        function createDOM(jobDTO) {
          const div = document.createElement("div");
          div.classList.add("__liepin_time_tag");
          renderTimeTag(div, jobDTO, { platform: PLATFORM_LIEPIN });
          return div;
        }
      },
    },
  };
})();
(function () {
  // 由于注入脚本的时候 DOMContentLoaded 已经触发，监听不到
  // proxy 脚本已加载，发送事件
  console.log("[setup] CustomEvent proxyScriptLoaded");
  let event = new CustomEvent("proxyScriptLoaded", {
    detail: {
      zhipin: {
        initialState: window.unsafeWindow.__INITIAL_STATE__,
      },
      lagou: {
        initialState: window.unsafeWindow.__NEXT_DATA__,
      },
    },
  });
  window.unsafeWindow.dispatchEvent(event);
})();
