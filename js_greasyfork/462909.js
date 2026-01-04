// ==UserScript==
// @name         建站脚本
// @namespace    phpcms.com
// @version      0.1.5
// @description  phpcms 建站脚本
// @author       wjk
// @match        *://*/*
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhechengren.cn
// @grant        GM_addStyle
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/462909/%E5%BB%BA%E7%AB%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462909/%E5%BB%BA%E7%AB%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  //与元数据块中的@grant值相对应，功能是生成一个style样式
  GM_addStyle(`
  #jianzhan .flex {
    display: flex;
    justify-content: space-between;
  }
  #jianzhan .flex * {
    width: 46% !important;
    text-align: center;
  }
  #jianzhan .block {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #jianzhan .block i {
    display: block;
    border: 1px solid pink;
    font-family: '黑体';
    padding: 0 5px;
    border-radius: 10px;
    margin: 0 3px;
  }
  #jianzhan {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid pink;
    width: 200px;
  }
  #jianzhan > ul {
    padding: 20px;
  }
  #jianzhan > ul > li {
    cursor: pointer;
  }
  #jianzhan > ul > li > span {
    display: block;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #000;
  }
  #jianzhan > ul > li ul {
    display: none;
    margin-top: 10px;
  }
  #jianzhan > ul > li ul li {
    line-height: 30px;
  }
  #jianzhan > ul > li ul li#f_caiji input {
    margin-bottom: 10px;
  }

  #jianzhan #t_lm .lm_two,
  #jianzhan #t_lm .link {
    display: block;
    width:100%;
  }
  #jianzhan #t_lm .lm_two {
    margin-bottom: 10px;
  }
  #jianzhan #t_lm .link {
    margin-bottom: 10px;
  }
  #jianzhan #t_lm div {
    display:flex;
    justify-content: space-between;
  }
  #jianzhan #t_lm i {
    margin:0 5px;
  }
  #jianzhan #t_lm .catid,
  #jianzhan #t_lm .number {
    flex:1;
    overflow: hidden;
    text-align: center;
  }
  #jianzhan #t_lm  span {
    border: 1px solid pink;
    padding: 5px;
    display: block;
    margin-top: 10px;
    text-align: center;
    border-radius: 10px;
    font-size: 14px;
  }
  #jianzhan .changedata .flex {
    margin-top: 10px;
  }
`)
  let dom = `<div id="jianzhan"><ul>
    <li>
      <span id="one">1-站点管理-添加站点</span>
    </li>
    <li>
      <span id="two">2-模型管理-添加模型</span>
      <ul>
        <li id="zdgl">
        <div class="block">
          <i> 字段管理 </i>
        </div>
        </li>
        <li id="xgzd">
          <span>修改字段</span>
          <div class="block">
            <i id="t_bt">标题</i>
            <i id="t_key">关键词</i>
            <i id="t_content">内容</i>
          </div>
        </li>
        <li id="jyzd">
          <span>禁用字段</span>
          <div class="block">
            <i id="t_posids">推荐位</i>
          </div>
        </li>
        <li id="tjzd">
          <span>添加字段</span>
          <div class="block">
            <i id="t_source">来源</i>
            <i id="t_link">来源链接</i>
            <i id="t_allrecommend">推荐位</i>
          </div>
        </li>
        <li id="tjzd">
          <span>修改排序</span>
          <div class="block">
            <i id="t_paixu">修改排序</i>
          </div>
        </li>
      </ul>
    </li>
    <li>
      <span id="three">3-管理栏目-添加栏目</span>
      <ul>
        <li id="t_lm">
          <input class='lm_two' type='text' value='' placeholder="父级catid值">
          <input class='link' type='text' value='' placeholder="域名尾部信息">
          <div>
            <input class='catid' type='text' value='' placeholder="开始catid">
            <i>——</i>
            <input class='number' type='text' value='' placeholder="结束catid">
          </div>
          <span>添加栏目链接</span>
        </li>
      </ul>
    </li>
    <li>
      <span id="four">4-角色管理</span>
      <ul>
        <li id="all_rw">手动选择软文权限</li>
        <li id="all_bj">手动选择编辑/业务编辑权限</li>
        <li id="all_rw_lm">手动选择软文栏目设置</li>
        <li id="all_bj_lm">手动选择编辑/业务编辑栏目设置</li>
        <!-- <li>------------------------</li>
        <li id="f_rwqx">软文权限设置</li>
        <li id="f_bjqx">编辑权限设置</li>
        <li id="f_ywbjqx">业务编辑权限设置</li>
        <li id="f_rwlm">软文栏目设置</li>
        <li id="f_bjlm">编辑栏目设置</li>
        <li id="f_ywbjlm">业务编辑栏目设置</li> -->
      </ul>
    </li>
    <li>
      <span id="five">5-采集管理</span>
      <ul>
      <!-- <li id="f_caiji">
          <div class='flex'>
            <span>当前栏目名称</span>
            <input class='name' type='text' placeholder='栏目名称'>
          </div>
          <div class='flex'>
            <span>结束栏目名称</span>
            <input class='last_name' type='text' placeholder='结束栏目名称'>
          </div>
          <div class='flex'>
            <span>发布次数</span>
            <input class='text' type='text' value='5' placeholder="发布次数">
          </div>
          <div class='flex'>
            <button>采集</button>
          </div>
        </li> -->
        <li id="f_caiji">
          <div class='flex'>
            <span>栏目名称</span>
            <input class='name' type='text' placeholder='栏目名称'>
          </div>
          <div class='flex'>
            <span>栏目id</span>
            <input class='number' type='text' placeholder='栏目id'>
          </div>
          <div class='flex'>
            <span>结束栏目id</span>
            <input class='last_number' type='text' placeholder='结束栏目id'>
          </div>
          <div class='flex'>
            <span>发布次数</span>
            <input class='text' type='text' value='10' placeholder="发布次数">
          </div>
          <div class='flex'>
            <span>延迟毫秒数</span>
            <input class='yanchi' type='text' value='7000' placeholder="延迟秒数">
          </div>
          <div class='flex'>
            <button>采集</button>
          </div>
        </li>
      </ul>
    </li>
    <li class="changedata">
      <span>修改栏目数据</span>
      <div class="flex">
        <span>当前修改父级栏目ID</span>
        <input class='catid' type='text' value='1'>
      </div>
      <div class="flex">
        <span>栏目数量</span>
        <input class='number' type='text' value='1'>
      </div>
      <div class="flex">
        <span>当前修改子级栏目ID</span>
        <input class='childcatid' type='text' value='1'>
      </div>
    </li>
  </ul>
</div>`
  // 添加DOM
  $('.objbody').append(dom)

  /**
   * 更改栏目数据
   */
  let one = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '人才|rencai',
    '客车|keche',
    '攻略|gonglue',
    '休闲|xiuxian',
    '春节|chunjie',
    '本地|bendi',
    '景点|jingdian',
    '赏花|shanghua',
    '踏青|taqing',
    '亲子游|qinziyou',
    '办事|banshi',
    '入户|ruhu',
    '公积金|gongjijin',
    '居住证|juzhuzheng',
    '社保|shebao',
    '查询|chaxun',
    '违章|weizhang',
    '网点|wangdian',
    '出入境|churujing',
    '护照|huzhao',
    '港澳通|gangaotong',
    '台湾通|taiwantong',
    '交通|jiaotong',
    '地铁|ditie',
    '公交|gongjiao',
    '地图|ditu',
    '限行|xianxing',
    '培训|peixun',
    '幼升小|youshengxiao',
    '小升初|xiaoshengchu',
    '划片|huapian',
    '补贴|butie',
    '银行|yinhang',
    '餐饮|canyin',
    '服务|fuwu',
    '服装|fuzhuang',
    '健康|jiankang',
    '建筑|jianzhu',
    '九价hpv|jiujiahpv',
    '消防|xiaofang',
    '美容|meirong',
    '媒体|meiti',
    '体育|tiyu',
    '计算机|jisuanji',
    '房地产|fangdichan',
  ]
  let two = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '疫情|yiqing',
    '人才|zhuti',
    '景区|jingqu',
    '历史|lishi',
    '文化|wenhua',
    '特产|techan',
    '小吃|xiaochi',
    '休闲|xiuxian',
    '攻略|gonglue',
    '美食|meishi',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
  ]
  let three = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '招聘|zhaopin',
    '便民|bianmin',
    '关注|guanzhu',
    '休闲|xiuxian',
    '娱乐|yule',
    '消费|xiaofei',
    '游玩|youwan',
    '景区|jingqu',
    '公园|gongyuan',
    '历史|lishi',
    '古迹|guji',
    '办事|banshi',
    '公积金|gongjijin',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '购物|gouwu',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '交通|jiaotong',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '机构|jigou',
    '银行|yinhang',
    '医院|yiyuan',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
    '赏花|shanghua',
    '踏青|taqing',
    '亲子游|qinziyou',
  ]

  let four = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '景点|jingdian',
    '攻略|gonglue',
    '美食|meishi',
    '指南|zhinan',
    '爬山|pashan',
    '休闲|xiuxian',
    '娱乐|yule',
    '办事|banshi',
    '养老|yanglao',
    '看病|kanbing',
    '入学|ruxue',
    '退休|tuixiu',
    '交通|jiaotong',
    '汽车|qiche',
    '火车|huoche',
    '公交|gongjiao',
    '话题|huati',
    '预约|yuyue',
    '护照|huzhao',
    '驾照|jiazhao',
    '资格证|zigezheng',
    '招聘|zhaopin',
    '机构|jigou',
    '医院|yiyuan',
    '学校|xuexiao',
    '银行|yinhang',
    '查询|chaxun',
    '违章|weizhang',
    '网点|wangdian',
    '办理|banli',
    '政策|zhengce',
    '务工|wugong',
    '公积金|gongjijin',
    '居住证|juzhuzheng',
  ]
  let five = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '休闲|xiuxian',
    '娱乐|yule',
    '预约|yuyue',
    '护照|huzhao',
    '驾照|jiazhao',
    '资格证|zigezheng',
    '招聘|zhaopin',
    '惠民|huimin',
    '周边|zhoubian',
    '美食|meishi',
    '爬山|pashan',
    '机构|jigou',
    '医院|yiyuan',
    '学校|xuexiao',
    '银行|yinhang',
    '公园|gongyuan',
    '元宵节|yuanxiaojie',
    '网点|wangdian',
    '办理|banli',
    '政策|zhengce',
    '务工|wugong',
    '公积金|gongjijin',
    '居住证|juzhuzheng',
    '办事|banshi',
    '看病|kanbing',
    '入学|ruxue',
    '退休|tuixiu',
    '交通|jiaotong',
    '汽车|qiche',
    '火车|huoche',
    '公交|gongjiao',
    '话题|huati',
  ]
  let six = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
    '历史|lishi',
    '文化|wenhua',
    '特产|techan',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '游玩|youwan',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '休闲|xiuxian',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '机构|jigou',
    '银行|yinhang',
    '娱乐|yule',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
  ]
  let seven = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '招聘|zhaopin',
    '便民|bianmin',
    '古迹|guji',
    '办事|banshi',
    '公积金|gongjijin',
    '机构|jigou',
    '银行|yinhang',
    '学校|xuexiao',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '休闲|xiuxian',
    '娱乐|yule',
    '消费|xiaofei',
    '游玩|youwan',
    '赏花|shanghua',
    '公园|gongyuan',
    '历史|lishi',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '交通|jiaotong',
    '美食|meishi',
    '小吃|xiaochi',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '餐饮|canyin',
    '消防|xiaofang',
  ]
  let eight = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '休闲|xiuxian',
    '娱乐|yule',
    '消费|xiaofei',
    '游玩|youwan',
    '赏花|shanghua',
    '公园|gongyuan',
    '古迹|guji',
    '招聘|zhaopin',
    '购物|gouwu',
    '美食|meishi',
    '小吃|xiaochi',
    '办事|banshi',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '交通|jiaotong',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '银行|yinhang',
    '学校|xuexiao',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
    '本地|bendi',
    '踏青|taqing',
    '亲子游|qinziyou',
  ]
  let nine = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '文化|wenhua',
    '特产|techan',
    '小吃|xiaochi',
    '名胜|mingsheng',
    '游玩|youwan',
    '攻略|gonglue',
    '美食|meishi',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '居住证|juzhuzheng',
    '社保|shebao',
    '公积金|gongjijin',
    '机构|jigou',
    '学校|xuexiao',
    '医院|yiyuan',
    '银行|yinhang',
    '娱乐|yule',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
  ]
  let ten = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '古迹|guji',
    '文化|wenhua',
    '特产|techan',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '小吃|xiaochi',
    '名胜|mingsheng',
    '攻略|gonglue',
    '美食|meishi',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '办事|banshi',
    '居住证|juzhuzheng',
    '公积金|gongjijin',
    '机构|jigou',
    '学校|xuexiao',
    '医院|yiyuan',
    '银行|yinhang',
    '娱乐|yule',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
  ]
  let shiyi = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '组织|zuzhi',
    '休闲|xiuxian',
    '娱乐|yule',
    '赏花|shanghua',
    '本地|bendi',
    '踏青|taqing',
    '亲子游|qinziyou',
    '便民|bianmin',
    '公园|gongyuan',
    '购物|gouwu',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '交通|jiaotong',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '机构|jigou',
    '银行|yinhang',
    '学校|xuexiao',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
  ]
  let shier = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '历史|lishi',
    '文化|wenhua',
    '特产|techan',
    '小吃|xiaochi',
    '休闲|xiuxian',
    '游玩|youwan',
    '攻略|gonglue',
    '美食|meishi',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '居住证|juzhuzheng',
    '社保|shebao',
    '公积金|gongjijin',
    '机构|jigou',
    '银行|yinhang',
    '娱乐|yule',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
  ]
  let shisan = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '特产|techan',
    '小吃|xiaochi',
    '休闲|xiuxian',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '游玩|youwan',
    '攻略|gonglue',
    '美食|meishi',
    '娱乐|yule',
    '电影|dianying',
    '餐饮|canyin',
    '消费|xiaofei',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '居住证|juzhuzheng',
    '机构|jigou',
    '银行|yinhang',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '媒体|meiti',
    '报道|baodao',
    '组织|zuzhi',
  ]
  let shisi = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '消费|xiaofei',
    '游玩|youwan',
    '景区|jingqu',
    '赏花|shanghua',
    '公园|gongyuan',
    '历史|lishi',
    '古迹|guji',
    '招聘|zhaopin',
    '便民|bianmin',
    '关注|guanzhu',
    '购物|gouwu',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '办事|banshi',
    '社保|shebao',
    '公积金|gongjijin',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '交通|jiaotong',
    '小学|xiaoxue',
    '初中|chuzhong',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '机构|jigou',
    '银行|yinhang',
    '学校|xuexiao',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
    '本地|bendi',
    '踏青|taqing',
    '亲子游|qinziyou',
  ]
  let shiwu = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '消费|xiaofei',
    '游玩|youwan',
    '景区|jingqu',
    '赏花|shanghua',
    '公园|gongyuan',
    '交通|jiaotong',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '限行|xianxing',
    '地图|ditu',
    '小吃|xiaochi',
    '办事|banshi',
    '公积金|gongjijin',
    '驾照|jiazhao',
    '出入境|churujing',
    '护照|huzhao',
    '港澳通|gangaotong',
    '台湾通|taiwantong',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '机构|jigou',
    '银行|yinhang',
    '医院|yiyuan',
    '学校|xuexiao',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
  ]
  let shiliu = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '关注|guanzhu',
    '消费|xiaofei',
    '游玩|youwan',
    '景区|jingqu',
    '赏花|shanghua',
    '公园|gongyuan',
    '历史|lishi',
    '古迹|guji',
    '购物|gouwu',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '办事|banshi',
    '社保|shebao',
    '公积金|gongjijin',
    '驾照|jiazhao',
    '结婚|jiehun',
    '户口|hukou',
    '过户|guohu',
    '交通|jiaotong',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '地铁|ditie',
    '公交|gongjiao',
    '大巴|daba',
    '机构|jigou',
    '银行|yinhang',
    '医院|yiyuan',
    '学校|xuexiao',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
    '出入境|churujing',
    '护照|huzhao',
    '港澳通|gangaotong',
    '台湾通|taiwantong',
  ]
  let shiqi = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '游玩|youwan',
    '攻略|gonglue',
    '美食|meishi',
    '小吃|xiaochi',
    '休闲|xiuxian',
    '餐饮|canyin',
    '消费|xiaofei',
    '体育|tiyu',
    '运动|yundong',
    '健身|jianshen',
    '锻炼|duanlian',
    '景区|jingqu',
    '历史|lishi',
    '文化|wenhua',
    '特产|techan',
    '主题|zhuti',
    '交通|jiaotong',
    '高铁|gaotie',
    '公交|gongjiao',
    '大巴|daba',
    '汽车|qiche',
    '火车|huoche',
    '飞机|feiji',
    '出租车|chuzuche',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高考|gaokao',
    '办事|banshi',
    '居住证|juzhuzheng',
    '社保|shebao',
    '公积金|gongjijin',
    '机构|jigou',
    '银行|yinhang',
  ]
  let shiba = [
    '生活指南|shenghuozhinan',
    '社保卡|shebaoka',
    '旅游|lvyou',
    '医疗|yiliao',
    '综合|zonghe',
    '活动|huodong',
    '民生|minsheng',
    '资讯|zixun',
    '要闻|yaowen',
    '最新|zuixin',
    '教育|jiaoyu',
    '天气|tianqi',
    '养老|yanglao',
    '金融|jinrong',
    '展览|zhanlan',
    '周边|zhoubian',
    '主题|zhuti',
    '热点|redian',
    '餐饮|canyin',
    '消防|xiaofang',
    '建筑|jianzhu',
    '办事|banshi',
    '社保|shebao',
    '公积金|gongjijin',
    '驾照|jiazhao',
    '消费|xiaofei',
    '游玩|youwan',
    '景区|jingqu',
    '赏花|shanghua',
    '关注|guanzhu',
    '公园|gongyuan',
    '历史|lishi',
    '古迹|guji',
    '招聘|zhaopin',
    '便民|bianmin',
    '购物|gouwu',
    '攻略|gonglue',
    '美食|meishi',
    '交通|jiaotong',
    '小学|xiaoxue',
    '初中|chuzhong',
    '高中|gaozhong',
    '考试|kaoshi',
    '中考|zhongkao',
    '高考|gaokao',
    '小升初|xiaoshengchu',
    '银行|yinhang',
    '医院|yiyuan',
    '学校|xuexiao',
    '本地|bendi',
    '踏青|taqing',
    '亲子游|qinziyou',
  ]
  let allData = [one, two, three, four, five, six, seven, eight, nine, ten, shiyi, shier, shisan, shisi, shiwu, shiliu, shiqi, shiba]
  function changedata() {
    /**
     * 获取到iframe 表单 找到所有tr (栏目数据是一个数组)
     * 循环数组 获取到要设置的栏目 点击修改
     * 使用定时器延迟操作
     * 重新获取页面 iframe 找到所有tr
     * 循环点击修改 需要更改栏目名称和英文目录
     * 点击确定修改下一个
     * 判断 index 是否等于设置的栏目数量
     * 等于就退出 不然就继续运行
     * */
    let all = $("iframe[name='right']")[0].contentWindow.document
    let arr = $(all).find('tbody tr')
    Array.prototype.forEach.call(arr, function (item, i) {
      if ($(item).find('input[type="text"]').val() == $('.changedata .catid').val()) {
        // 进入选项卡
        $(item).find('td:last-of-type a:first-of-type')[0].click()
        setTimeout(function () {
          let alltwo = $("iframe[name='right']")[0].contentWindow.document
          let arrtwo = $(alltwo).find('tbody tr')
          Array.prototype.forEach.call(arrtwo, function (item, index) {
            if ($(item).find('input[type="text"]').val() == $('.changedata .childcatid').val()) {
              // 进入选项卡
              $(item).find('td:nth-of-type(9) a:nth-of-type(3)')[0].click()
              setTimeout(function () {
                // 获取域名前缀
                let allthree = null
                allthree = $("iframe[name='right']")[0].contentWindow.document
                // let name = $(allthree).find('#catname').val().slice(-1)
                // if (name == '县' || name == '区' || name == '州' || name == '镇' || name == '乡') {
                //   return alert('可能修改县区了')
                // }
                if (!allthree.querySelector('#catname')) {
                  console.log('没有找到 即将重试')
                  align()
                  return
                } else {
                  console.log('查找到了')
                }
                console.log(i, index, allData[i][index].split('|'))
                console.log(allthree, $(allthree).find('#catname'), $(allthree).find('#catname').val())
                console.log(allthree.querySelector('#catname'))
                // 栏目名称
                $(allthree).find('#catname').val(allData[i][index].split('|')[0])
                // 英文目录
                $(allthree).find('#catdir').val(allData[i][index].split('|')[1])
                // 提交
                $(allthree).find('input[value="提交"]').click()
                allthree = null
                // 改变当前要修改的子级栏目
                let lastvalue = $(arrtwo[index + 1])
                  .find('input[type="text"]')
                  .val()
                $('.changedata .childcatid').val(lastvalue)
                setTimeout(function () {
                  $('.aui_main a').click()
                  setTimeout(function () {
                    console.log(index + 1, $('.changedata .number').val())
                    if (index + 1 == $('.changedata .number').val()) {
                      alert('修改完成')
                    } else {
                      changedata()
                    }
                  }, 2000)
                }, 1000)
              }, 2000)
            }
          })
        }, 1000)
      }
    })

    console.log(allData)
  }
  function align() {
    $('#_M4 a')[0].click()
    setTimeout(function () {
      $('#_MP43 a')[0].click()
      setTimeout(function () {
        changedata()
      }, 1000)
    }, 500)
  }
  $('.changedata span').click(function () {
    changedata()
  })
  // 鼠标经过展开选项
  $('#jianzhan > ul > li').click(function () {
    $('#jianzhan > ul > li ul').stop().hide()
    if ($(this).find('ul')) {
      $(this).find('ul').stop().show()
    }
  })
  /**
   * 站点管理
   */
  $('#one').click(function () {
    console.log('站点管理')
    $('#_M1 a')[0].click()
    setTimeout(function () {
      $('#_MP64 a')[0].click()
    }, 500)
    setTimeout(function () {
      let all = $("iframe[name='right']")[0].contentWindow.document
      let text = $(all).find('.subnav .add em').html()
      console.log(text)
      if (text == '添加站点') {
        let item = $(all).find('.subnav .add')
        console.log(item)
        item[0].click()
        $(all)
          .find('.aui_state_highlight')
          .click(function () {
            setTimeout(function () {
              location.reload()
            }, 1000)
          })
      }
    }, 1000)
  })
  /**
   * 模型管理
   */
  $('#two').click(function () {
    console.log('模型管理')
    $('#_M4 a')[0].click()
    setTimeout(function () {
      $('#_MP59 a')[0].click()
    }, 500)
  })
  /**
   * 模型管理---字段管理---跳转操作
   */
  $('#zdgl').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let item = $(all).find('tbody tr td:last-of-type a:first-of-type')
    item[0].click()
  })
  /**
   * 模型管理---字段管理----修改字段-----标题 修改为 800
   */
  $('#t_bt').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(3) td:nth-of-type(3)').html()
    if (text == '标题') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find('#field_maxlength').val('800')
        if ($(all).find('#field_maxlength').val() == '800') {
          alert('修改成功')
          $(all).find('.btn input').click()
        }
      }, 1000)
    }
  })
  /**
   * 模型管理---字段管理----修改字段-----关键词 修改为 400
   */
  $('#t_key').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(4) td:nth-of-type(3)').html()
    if (text == '关键词') {
      let item = $(all).find('tbody tr:nth-of-type(4) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find('#field_maxlength').val('400')
        if ($(all).find('#field_maxlength').val() == '400') {
          alert('修改成功')
          $(all).find('.btn input').click()
        }
      }, 1000)
    }
  })
  /**
   * 模型管理---字段管理----修改字段-----内容  是否保存远程图片： 否
   */
  $('#t_content').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(7) td:nth-of-type(3)').html()
    if (text == '内容') {
      console.log('进入内容详情页')
      let item = $(all).find('tbody tr:nth-of-type(7) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find('.table_form tbody tbody tr:nth-of-type(5) td:last-of-type input:last-of-type').click()
        if ($(all).find('.table_form tbody tbody tr:nth-of-type(5) td:last-of-type input:last-of-type').is(':checked')) {
          alert('选择成功')
          $(all).find('.btn input').click()
        }
      }, 1000)
    }
  })
  /**
   * 模型管理---字段管理----禁用字段-----推荐位
   */
  $('#t_posids').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(12) td:nth-of-type(3)').html()
    if (text == '推荐位') {
      let item = $(all).find('tbody tr:nth-of-type(12) td:last-of-type a:nth-of-type(2)')
      item[0].click()
    }
  })
  /**
   * 模型管理---字段管理----添加字段---- 来源 copyfrom 序号 8
   */
  $('#t_source').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('.subnav .add em').html()
    if (text == '添加字段') {
      let item = $(all).find('.subnav .add')
      item[0].click()
      setTimeout(function () {
        var all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find("option[value='text']").attr('selected', true)
        // 获取全局作用域
        var global = unsafeWindow[1]
        // 调用函数
        global.field_setting('text')
        setTimeout(function () {
          $(all).find('#field').val('copyfrom')
          $(all).find('#name').val('来源')
          $(all).find('#field_maxlength').val('0')
          all.documentElement.scrollTop = all.documentElement.scrollHeight
        }, 1000)
      }, 1000)
    }
  })

  /**
   * 模型管理---字段管理----添加字段---- 来源连接 copyfrom_url 序号 9
   */
  $('#t_link').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('.subnav .add em').html()
    if (text == '添加字段') {
      let item = $(all).find('.subnav .add')
      item[0].click()
      setTimeout(function () {
        let all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find("option[value='text']").attr('selected', true)
        // 获取全局作用域
        var global = unsafeWindow[1]
        // 调用函数
        global.field_setting('text')
        setTimeout(function () {
          $(all).find('#field').val('copyfrom_url')
          $(all).find('#name').val('来源连接')
          $(all).find('#field_maxlength').val('0')
          all.documentElement.scrollTop = all.documentElement.scrollHeight
        }, 1000)
      }, 1000)
      // 进行排序
    }
  })
  /**
   * 添加推荐位
   */
  $('#t_allrecommend').click(function () {
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('.subnav .add em').html()
    if (text == '添加字段') {
      let item = $(all).find('.subnav .add')
      item[0].click()
      setTimeout(function () {
        let all = $("iframe[name='right']")[0].contentWindow.document
        $(all).find("option[value='box']").attr('selected', true)
        // 获取全局作用域
        var global = unsafeWindow[1]
        // 调用函数
        global.field_setting('box')
        setTimeout(function () {
          $(all).find('#field_basic_table1').click()
          $(all).find('#field').val('allrecommend')
          $(all).find('#name').val('全部推荐位')
          let name = $('.tab_web a span').html()
          let isCN = name.includes('(中国')
          var pattern = /(.+?)\(/
          var result = pattern.exec(name)[1]
          let textContent = ''
          if (isCN) {
            textContent = `${result}头条推荐|1
${result}焦点图推荐|2
中国${result}头条推荐|3
中国${result}焦点图推荐|4
`
          } else {
            textContent = `${result}头条推荐|1
${result}焦点图推荐|2
`
          }
          // 选项列表
          $(all).find('#options').val(textContent)
          // 复选框
          $(all).find("input[name='setting[boxtype]'][value='checkbox']").click()
          // 每列宽度
          $(all).find('input[name="setting[width]"]').val('150')
          // 默认值
          $(all).find("input.input-text[name='setting[defaultvalue]']").val('0')
          // 是否作为筛选字段
          $(all).find('input[type="radio"][name="setting[filtertype]"][value="0"]').click()
          // 字符长度取值范围
          $(all).find('#field_maxlength').val('0')
        }, 1000)
      }, 1000)
      // 进行排序
    }
  })
  /**
   * 修改排序
   * 来源      copyfrom      序号 8
   * 来源连接  copyfrom_url  序号 9
   */
  $('#t_paixu').click(function () {
    var all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(1) td:nth-of-type(3)').html()
    let texttwo = $(all).find('tbody tr:nth-of-type(2) td:nth-of-type(3)').html()
    let textthree = $(all).find('tbody tr:nth-of-type(3) td:nth-of-type(3)').html()
    if (text == '来源连接') {
      let item = $(all).find('tbody tr:nth-of-type(1) td:first-of-type input')
      item.val('9')
    } else if (text == '来源') {
      let item = $(all).find('tbody tr:nth-of-type(1) td:first-of-type input')
      item.val('8')
    } else if (text == '全部推荐位') {
      let item = $(all).find('tbody tr:nth-of-type(1) td:first-of-type input')
      item.val('18')
    }
    if (texttwo == '来源') {
      let item = $(all).find('tbody tr:nth-of-type(2) td:first-of-type input')
      item.val('8')
    } else if (texttwo == '来源连接') {
      let item = $(all).find('tbody tr:nth-of-type(2) td:first-of-type input')
      item.val('9')
    } else if (texttwo == '全部推荐位') {
      let item = $(all).find('tbody tr:nth-of-type(2) td:first-of-type input')
      item.val('18')
    }
    if (textthree == '全部推荐位') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:first-of-type input')
      item.val('18')
    } else if (textthree == '来源') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:first-of-type input')
      item.val('8')
    } else if (textthree == '来源连接') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:first-of-type input')
      item.val('9')
    }
    $(all).find('.btn input').click()
  })

  /**
   * 管理栏目-添加栏目
   */
  $('#three').click(function () {
    console.log('管理栏目-添加栏目')
    $('#_M4 a')[0].click()
    setTimeout(function () {
      $('#_MP43 a')[0].click()
    }, 500)
  })
  /**
   * 管理栏目-添加二级域名
   */
  function addlink() {
    var all = $("iframe[name='right']")[0].contentWindow.document
    var arr = $(all).find('tbody tr')
    var number = $('#t_lm .number').val()
    Array.prototype.forEach.call(arr, function (item, index) {
      let activeID = $(item).find('input[type="text"]').val()
      if (activeID == $('.catid').val()) {
        // 进入选项卡
        $(item).find('td:nth-of-type(9) a:nth-of-type(2)')[0].click()
        setTimeout(function () {
          // 获取域名前缀
          var all = $("iframe[name='right']")[0].contentWindow.document
          let link_top = $(all).find('#catdir').val()
          $(all).find('#tab_setting_2').click()
          $(all)
            .find('#url')
            .val('http://' + link_top + $('.link').val())
          $(all).find('input[value="提交"]').click()
          $('.catid').val($('.catid').val() - 0 + 1)
          setTimeout(function () {
            $('.aui_main a').click()
            setTimeout(function () {
              console.log(activeID, number, activeID < number)
              if (activeID < number) {
                addlink()
              } else {
                // 更新栏目缓存
                $(all).find('#content-menu a:nth-of-type(5)').click()
                alert('添加完成')
              }
            }, 1000)
          }, 1000)
        }, 1000)
      }
    })
  }
  function cheadlanmu() {
    var all = $("iframe[name='right']")[0].contentWindow.document
    var arr = $(all).find('tbody tr')
    Array.prototype.forEach.call(arr, function (item, index) {
      if ($(item).find('input[type="text"]').val() == $('.catid').val()) {
        // 进入选项卡
        $(item).find('td:nth-of-type(9) a:nth-of-type(2)')[0].click()
        setTimeout(function () {
          // 获取域名前缀
          var all = $("iframe[name='right']")[0].contentWindow.document
          let optall = $(all).find('#show_html_ruleid option')
          Array.prototype.forEach.call(optall, function (item, indext) {
            if (item.value == '43') {
              item.selected = true
            }
          })

          $(all).find('input[value="提交"]').click()
          $('.catid').val($('.catid').val() - 0 + 1)
          setTimeout(function () {
            $('.aui_main a').click()
            setTimeout(function () {
              if (index < arr.length) {
                cheadlanmu()
              }
            }, 1000)
          }, 1000)
        }, 1000)
      }
    })
  }
  function addlinktwo() {
    var all = $("iframe[name='right']")[0].contentWindow.document
    var arr = $(all).find('tbody tr')
    Array.prototype.forEach.call(arr, function (item, i) {
      if ($(item).find('input[type="text"]').val() == $('.lm_two').val()) {
        // 进入选项卡
        $(item).find('td:last-of-type a:first-of-type')[0].click()
        setTimeout(function () {
          // 获取域名前缀
          var all = $("iframe[name='right']")[0].contentWindow.document
          var arrtwo = $(all).find('tbody tr')
          Array.prototype.forEach.call(arrtwo, function (item, index) {
            if ($(item).find('input[type="text"]').val() == $('.catid').val()) {
              // 进入选项卡
              $(item).find('td:nth-of-type(9) a:nth-of-type(3)')[0].click()
              setTimeout(function () {
                // 获取域名前缀
                var all = $("iframe[name='right']")[0].contentWindow.document
                let link_top = $(all).find('#catdir').val()
                $(all).find('#tab_setting_2').click()
                $(all)
                  .find('#url')
                  .val('http://' + link_top + $('.link').val())
                $(all).find('input[value="提交"]').click()
                $('.catid').val($('.catid').val() - 0 + 1)
                setTimeout(function () {
                  $('.aui_main a').click()
                  setTimeout(function () {
                    console.log(link_top, index, arrtwo.length, index < arrtwo.length)
                    if (index < arrtwo.length) {
                      addlinktwo()
                    }
                  }, 1000)
                }, 1000)
              }, 1000)
            }
          })
        }, 1000)
      }
    })
  }
  $('#t_lm span').on('click', function () {
    addlink() // 没有父级栏目
    //  cheadlanmu()
    //  addlinktwo()  // 有父级栏目
  })
  /**
   * 角色管理
   */
  $('#four').click(function () {
    console.log('角色管理')
    $('#_M1 a')[0].click()
    setTimeout(function () {
      $('#_MP50 a')[0].click()
    }, 500)
  })
  /**
   *  手动选择软文权限设置
   */
  $('#all_rw').on('click', function () {
    let zhandianname = $('.tab_web a span').html()
    setTimeout(function () {
      let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
      for (let i = 0; i < $(newifr).find('#site_list ul li em').length; i++) {
        if ($(newifr).find('#site_list ul li em')[i].innerHTML == zhandianname) {
          $(newifr).find('#site_list ul li em')[i].click()
          setTimeout(function () {
            let child = $(newifr).find('#role')[0].contentWindow.document
            // 模块 - 模块列表 - 友情链接 -全选
            $(child).find('#node-1512 input').click()
            $(child).find('#node-1513 input').click()
            $(child).find('#node-1514 input').click()
            $(child).find('#node-1515 input').click()
            $(child).find('#node-1516 input').click()
            $(child).find('#node-1517 input').click()
            $(child).find('#node-1518 input').click()
            $(child).find('#node-1519 input').click()
            // 内容 - 内容发布管理 - 管理内容 -全选
            $(child).find('#node-822 input').click()
            $(child).find('#node-899 input').click()
            $(child).find('#node-901 input').click()
            $(child).find('#node-1011 input').click()
            $(child).find('#node-1012 input').click()
            $(child).find('#node-1241 input').click()
            $(child).find('#node-1244 input').click()
            $(child).find('#node-1348 input').click()
            $(child).find('#node-1353 input').click()
            $(child).find('#node-1500 input').click()
            $(child).find('#node-1577 input').click()
            $(child).find('#node-1578 input').click()
            // 内容 - 内容发布管理 - artide_del - 关键词
            $(child).find('#node-1579 input').click()
            $(child).find('#node-1580 input').click()
            $(child).find('#node-1581 input').click()
            $(child).find('#node-1582 input').click()
            $(child).find('#node-1583 input').click()
            $(child).find('#node-1584 input').click()
            $(child).find('#node-1585 input').click()
            // 内容 - 发布管理 （全选  -  -- 取消一键清理数据）
            $(child).find('#node-873 input').click()
            $(child).find('#node-872 input').click()
            $(child).find('#node-877 input').click()
            $(child).find('#node-880 input').click()
            $(child).find('#node-905 input').click()
            $(child).find('#node-906 input').click()
            $(child).find('#node-1002 input').click()
            $(child).find('#node-1243 input').click()
            // 我的面板
            $(child).find('#node-10 input').click()
            $(child).find('#node-970 input').click()
            $(child).find('#node-971 input').click()
            $(child).find('#node-972 input').click()
            $(child).find('#node-1003 input').click()
            $(child).find('#node-1004 input').click()
            // 提交
            if ($(child).find('#node-10 input').is(':checked')) {
              $(child).find('#dosubmit').click()
            }
          }, 1000)
        }
      }
    }, 1500)
  })
  /**
   * 手动选择更新编辑
   */
  $('#all_bj').on('click', function () {
    let zhandianname = $('.tab_web a span').html()
    setTimeout(function () {
      let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
      for (let i = 0; i < $(newifr).find('#site_list ul li em').length; i++) {
        if ($(newifr).find('#site_list ul li em')[i].innerHTML == zhandianname) {
          $(newifr).find('#site_list ul li em')[i].click()
          setTimeout(function () {
            let child = $(newifr).find('#role')[0].contentWindow.document
            // 模块 - 模块列表 - 友情链接 - 前三个 - 添加-修改-删除
            let flag = false
            /**
             * 权限点击函数
             * @param {*} domtext 需要设置的名称
             * @param {*} name 需要判断的名称
             * @param {*} dom 需要点击的权限按钮
             */

            function itemClick(domtext, name, dom) {
              console.log($(child).find(domtext)[0].textContent)
              if (
                'newslist' == name ||
                'push_baidu' == name ||
                '批量生成HTML' == name ||
                '批量更新URL' == name ||
                $(child)
                  .find(domtext)[0]
                  .textContent.match(/[\u4e00-\u9fa5]/g)
                  .join('') == name
              ) {
                $(child).find(dom).click()
                flag = true
              } else {
                console.log('没有找到' + name)
                flag = false
              }
            }
            itemClick('#node-1513 td', '添加友情链接', '#node-1513 input')
            itemClick('#node-1514 td', '编辑友情链接', '#node-1514 input')
            itemClick('#node-1515 td', '删除友情链接', '#node-1515 input')
            // 内容 - 内容发布管理 - 管理内容 - 取下选择修改和删除 其他全选
            itemClick('#node-899 td', '添加内容', '#node-899 input')
            itemClick('#node-901 td', '审核内容', '#node-901 input')
            itemClick('#node-1012 td', '推送', '#node-1012 input')
            itemClick('#node-1241 td', '移动内容', '#node-1241 input')
            itemClick('#node-1244 td', '同时发布到其他栏目', '#node-1244 input')
            itemClick('#node-1353 td', '批量生成HTML', '#node-1353 input')
            itemClick('#node-1500 td', '排序', '#node-1500 input')
            itemClick('#node-1583 td', 'newslist', '#node-1583 input')
            itemClick('#node-1579 td', 'push_baidu', '#node-1579 input')
            // 内容 - 内容发布管理 - - 关键词 只选择批量生成HTML
            itemClick('#node-1595 td', '批量生成HTML', '#node-1595 input')
            // 内容 - 发布管理 批量更新内容页-批量更新URL-批量更新栏目页-生成首页
            itemClick('#node-905 td', '批量更新内容页', '#node-905 input')
            itemClick('#node-906 td', '批量更新URL', '#node-906 input')
            itemClick('#node-1002 td', '批量更新栏目页', '#node-1002 input')
            itemClick('#node-1243 td', '生成首页', '#node-1243 input')
            // 我的面板 全选
            itemClick('#node-10 td', '我的面板', '#node-10 input')
            itemClick('#node-970 td', '个人信息', '#node-970 input')
            itemClick('#node-971 td', '修改密码', '#node-971 input')
            itemClick('#node-972 td', '修改个人信息', '#node-972 input')
            itemClick('#node-1003 td', '生成操作', '#node-1003 input')
            itemClick('#node-1004 td', '生成首页', '#node-1004 input')
            // 提交
            if ($(child).find('#node-10 input').is(':checked') && flag) {
              $(child).find('#dosubmit').click()
            }
          }, 1000)
        }
      }
    }, 1500)
  })
  /**
   * 手动选择软文栏目设置
   */
  $('#all_rw_lm').on('click', function () {
    let zhandianname = $('.tab_web a span').html()
    setTimeout(function () {
      let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
      for (let i = 0; i < $(newifr).find('#site_list li em').length; i++) {
        if ($(newifr).find('#site_list li em')[i].innerHTML == zhandianname) {
          $(newifr).find('#site_list li em')[i].click()
          setTimeout(function () {
            let child = $(newifr).find('#role')[0].contentWindow.document
            for (let i = 0; i < $(child).find('tbody tr:last-of-type td input').length; i++) {
              if (i != 0) {
                $(child).find('tbody tr:last-of-type td input')[i].click()
              }
            }
            // 提交
            $(child).find('.btn input').click()
          }, 1000)
        }
      }
    }, 1500)
  })
  /**
   * 手动选择编辑/业务编辑栏目设置
   */
  $('#all_bj_lm').on('click', function () {
    let zhandianname = $('.tab_web a span').html()
    setTimeout(function () {
      let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
      for (let i = 0; i < $(newifr).find('#site_list li em').length; i++) {
        if ($(newifr).find('#site_list li em')[i].innerHTML == zhandianname) {
          $(newifr).find('#site_list li em')[i].click()
          setTimeout(function () {
            let child = $(newifr).find('#role')[0].contentWindow.document
            for (let i = 0; i < $(child).find('tbody tr:last-of-type td input').length; i++) {
              if (i != 0) {
                $(child).find('tbody tr:last-of-type td input')[i].click()
              }
            }
            // 提交
            $(child).find('.btn input').click()
          }, 1000)
        }
      }
    }, 1500)
  })
  /**
   * 角色管理--- 软文权限设置
   */
  $('#f_rwqx').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(1) td:nth-of-type(3)').html()
    if (text == '软文') {
      let item = $(all).find('tbody tr:nth-of-type(1) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list ul li em').length; i++) {
          if ($(newifr).find('#site_list ul li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list ul li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              // 模块 - 模块列表 - 友情链接 -全选
              $(child).find('#node-1512 input').click()
              $(child).find('#node-1513 input').click()
              $(child).find('#node-1514 input').click()
              $(child).find('#node-1515 input').click()
              $(child).find('#node-1516 input').click()
              $(child).find('#node-1517 input').click()
              $(child).find('#node-1518 input').click()
              $(child).find('#node-1519 input').click()
              // 内容 - 内容发布管理 - 管理内容 -全选
              $(child).find('#node-822 input').click()
              $(child).find('#node-899 input').click()
              $(child).find('#node-901 input').click()
              $(child).find('#node-1011 input').click()
              $(child).find('#node-1012 input').click()
              $(child).find('#node-1241 input').click()
              $(child).find('#node-1244 input').click()
              $(child).find('#node-1348 input').click()
              $(child).find('#node-1353 input').click()
              $(child).find('#node-1500 input').click()
              $(child).find('#node-1577 input').click()
              $(child).find('#node-1578 input').click()
              // 内容 - 内容发布管理 - artide_del - 关键词
              $(child).find('#node-1579 input').click()
              $(child).find('#node-1580 input').click()
              $(child).find('#node-1581 input').click()
              $(child).find('#node-1582 input').click()
              $(child).find('#node-1583 input').click()
              $(child).find('#node-1584 input').click()
              $(child).find('#node-1585 input').click()
              // 内容 - 发布管理 （全选  -  -- 取消一键清理数据）
              $(child).find('#node-873 input').click()
              $(child).find('#node-872 input').click()
              $(child).find('#node-877 input').click()
              $(child).find('#node-880 input').click()
              $(child).find('#node-905 input').click()
              $(child).find('#node-906 input').click()
              $(child).find('#node-1002 input').click()
              $(child).find('#node-1243 input').click()
              // 我的面板
              $(child).find('#node-10 input').click()
              $(child).find('#node-970 input').click()
              $(child).find('#node-971 input').click()
              $(child).find('#node-972 input').click()
              $(child).find('#node-1003 input').click()
              $(child).find('#node-1004 input').click()
              // 提交
              if ($(child).find('#node-10 input').is(':checked')) {
                $(child).find('#dosubmit').click()
              }
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 角色管理--- 业务编辑权限设置
   */
  $('#f_ywbjqx').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(5) td:nth-of-type(3)').html()
    if (text == '业务编辑') {
      let item = $(all).find('tbody tr:nth-of-type(5) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list ul li em').length; i++) {
          if ($(newifr).find('#site_list ul li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list ul li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              // 模块 - 模块列表 - 友情链接 -全选
              $(child).find('#node-1512 input').click()
              $(child).find('#node-1513 input').click()
              $(child).find('#node-1514 input').click()
              $(child).find('#node-1515 input').click()
              $(child).find('#node-1516 input').click()
              $(child).find('#node-1517 input').click()
              $(child).find('#node-1518 input').click()
              $(child).find('#node-1519 input').click()
              // 内容 - 内容发布管理 - 管理内容 -全选
              $(child).find('#node-822 input').click()
              $(child).find('#node-899 input').click()
              $(child).find('#node-901 input').click()
              $(child).find('#node-1011 input').click()
              $(child).find('#node-1012 input').click()
              $(child).find('#node-1241 input').click()
              $(child).find('#node-1244 input').click()
              $(child).find('#node-1348 input').click()
              $(child).find('#node-1353 input').click()
              $(child).find('#node-1500 input').click()
              $(child).find('#node-1577 input').click()
              $(child).find('#node-1578 input').click()
              // 内容 - 内容发布管理 - artide_del - 关键词
              $(child).find('#node-1579 input').click()
              $(child).find('#node-1580 input').click()
              $(child).find('#node-1581 input').click()
              $(child).find('#node-1582 input').click()
              $(child).find('#node-1583 input').click()
              $(child).find('#node-1584 input').click()
              $(child).find('#node-1585 input').click()
              // 内容 - 发布管理 （全选  -  -- 取消一键清理数据）
              $(child).find('#node-873 input').click()
              $(child).find('#node-872 input').click()
              $(child).find('#node-877 input').click()
              $(child).find('#node-880 input').click()
              $(child).find('#node-905 input').click()
              $(child).find('#node-906 input').click()
              $(child).find('#node-1002 input').click()
              $(child).find('#node-1243 input').click()
              // 我的面板
              $(child).find('#node-10 input').click()
              $(child).find('#node-970 input').click()
              $(child).find('#node-971 input').click()
              $(child).find('#node-972 input').click()
              $(child).find('#node-1003 input').click()
              $(child).find('#node-1004 input').click()
              // 提交
              if ($(child).find('#node-10 input').is(':checked')) {
                $(child).find('#dosubmit').click()
              }
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 角色管理 -- 编辑权限设置
   */
  $('#f_bjqx').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(3) td:nth-of-type(3)').html()
    if (text == '编辑' || text == '查看更新') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:last-of-type a:first-of-type')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list ul li em').length; i++) {
          if ($(newifr).find('#site_list ul li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list ul li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              // 模块 - 模块列表 - 友情链接 -全选
              $(child).find('#node-1512 input').click()
              $(child).find('#node-1513 input').click()
              $(child).find('#node-1514 input').click()
              $(child).find('#node-1515 input').click()
              $(child).find('#node-1516 input').click()
              $(child).find('#node-1517 input').click()
              $(child).find('#node-1518 input').click()
              $(child).find('#node-1519 input').click()
              // 内容 - 内容发布管理 - 管理内容 -全选
              $(child).find('#node-822 input').click()
              $(child).find('#node-899 input').click()
              $(child).find('#node-901 input').click()
              $(child).find('#node-1011 input').click()
              $(child).find('#node-1012 input').click()
              $(child).find('#node-1241 input').click()
              $(child).find('#node-1244 input').click()
              // $(child).find('#node-1348 input').click() 编辑取消删除内容
              $(child).find('#node-1353 input').click()
              $(child).find('#node-1500 input').click()
              $(child).find('#node-1577 input').click()
              $(child).find('#node-1578 input').click()
              // 内容 - 内容发布管理 - artide_del - 关键词
              $(child).find('#node-1579 input').click()
              $(child).find('#node-1580 input').click()
              $(child).find('#node-1581 input').click()
              $(child).find('#node-1582 input').click()
              $(child).find('#node-1583 input').click()
              $(child).find('#node-1584 input').click()
              $(child).find('#node-1585 input').click()
              // 内容 - 发布管理 （全选  -  -- 取消一键清理数据）
              $(child).find('#node-873 input').click()
              $(child).find('#node-872 input').click()
              $(child).find('#node-877 input').click()
              $(child).find('#node-880 input').click()
              $(child).find('#node-905 input').click()
              $(child).find('#node-906 input').click()
              $(child).find('#node-1002 input').click()
              $(child).find('#node-1243 input').click()
              // 我的面板
              $(child).find('#node-10 input').click()
              $(child).find('#node-970 input').click()
              $(child).find('#node-971 input').click()
              $(child).find('#node-972 input').click()
              $(child).find('#node-1003 input').click()
              $(child).find('#node-1004 input').click()
              // 提交
              if ($(child).find('#node-10 input').is(':checked')) {
                $(child).find('#dosubmit').click()
              }
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 角色管理 -- 软文栏目设置
   */
  $('#f_rwlm').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(1) td:nth-of-type(3)').html()
    if (text == '软文') {
      let item = $(all).find('tbody tr:nth-of-type(1) td:last-of-type a:nth-of-type(2)')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list li em').length; i++) {
          if ($(newifr).find('#site_list li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              for (let i = 0; i < $(child).find('tbody tr:last-of-type td input').length; i++) {
                if (i != 0) {
                  $(child).find('tbody tr:last-of-type td input')[i].click()
                }
              }
              // 提交
              $(child).find('.btn input').click()
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 角色管理 -- 业务编辑栏目设置
   */
  $('#f_ywbjlm').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(5) td:nth-of-type(3)').html()
    if (text == '业务编辑') {
      let item = $(all).find('tbody tr:nth-of-type(5) td:last-of-type a:nth-of-type(2)')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list li em').length; i++) {
          if ($(newifr).find('#site_list li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              for (let i = 0; i < $(child).find('tbody tr:last-of-type td input').length; i++) {
                if (i != 0) {
                  $(child).find('tbody tr:last-of-type td input')[i].click()
                }
              }
              // 提交
              $(child).find('.btn input').click()
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 角色管理 -- 编辑栏目设置
   */
  $('#f_bjlm').click(function () {
    let zhandianname = $('.tab_web a span').html()
    let all = $("iframe[name='right']")[0].contentWindow.document
    let text = $(all).find('tbody tr:nth-of-type(3) td:nth-of-type(3)').html()
    if (text == '编辑' || text == '查看更新') {
      let item = $(all).find('tbody tr:nth-of-type(3) td:last-of-type a:nth-of-type(2)')
      item[0].click()
      setTimeout(function () {
        let newifr = $("iframe[id='atrDialogIframe_edit']")[0].contentWindow.document
        for (let i = 0; i < $(newifr).find('#site_list li em').length; i++) {
          if ($(newifr).find('#site_list li em')[i].innerHTML == zhandianname) {
            $(newifr).find('#site_list li em')[i].click()
            setTimeout(function () {
              let child = $(newifr).find('#role')[0].contentWindow.document
              for (let i = 0; i < $(child).find('tbody tr:last-of-type td input').length; i++) {
                if (i > 1 || i <= 6) {
                  $(child).find('tbody tr:last-of-type td input')[i].click()
                }
              }
              // 提交
              $(child).find('.btn input').click()
            }, 1000)
          }
        }
      }, 1500)
    }
  })
  /**
   * 采集管理
   */
  $('#five').click(function () {
    console.log('采集管理')
    $('#_M4 a')[0].click()
    setTimeout(function () {
      $('#_MP957 a')[0].click()
    }, 500)
  })
  // 根据栏目ID进行采集
  function add_NumberCaiji() {
    let all = $("iframe[name='right']")[0].contentWindow.document
    var arr = $(all).find('tbody tr:nth-of-type(odd) input').splice(0, $('#f_caiji .text').val())
    arr.forEach(function (e) {
      e.click()
    })
    if ($(all).find('.btn input:nth-of-type(3)').val() == '导入选中') {
      $(all).find('.btn input:nth-of-type(3)').click()
    }
    setTimeout(function () {
      let all = $("iframe[name='right']")[0].contentWindow.document
      let optall = $(all).find('select[name="catid"] option')
      if (optall) {
        Array.prototype.forEach.call(optall, function (item, index) {
          if (item.value == $('#f_caiji .number').val()) {
            console.log(item.value, item.text)
            item.selected = true
            // 当前栏目名称
            $('#f_caiji .name').val(item.text)
            // 提交
            $(all).find('#dosubmit').click()
            setTimeout(function () {
              let all = $("iframe[name='right']")[0].contentWindow.document
              // 随便判断了 审核是否通过的字段
              if ($(all).find('input[name="content_status"]') && $(all).find('input[name="content_status"]').val() == '99') {
                $(all).find('.btn input').click()
                setTimeout(function () {
                  if (item.value == $('#f_caiji .last_number').val()) {
                    alert('采集完成')
                    return
                  } else {
                    console.log('继续')
                    // 顺序加一
                    $('#f_caiji .number').val(optall[index + 1].value)
                    add_NumberCaiji()
                  }
                }, $('#f_caiji .yanchi').val())
              }
            }, 1000)
          }
        })
      }
    }, 1000)
  }
  // 根据栏目名称进行采集 要求栏目名称不能重复
  function add_NameCaiji() {
    let all = $("iframe[name='right']")[0].contentWindow.document
    var arr = $(all).find('tbody tr:nth-of-type(odd) input').splice(0, $('#f_caiji .text').val())
    arr.forEach(function (e) {
      e.click()
      console.log(e)
    })
    if ($(all).find('.btn input:nth-of-type(3)').val() == '导入选中') {
      console.log('导入选中')
      $(all).find('.btn input:nth-of-type(3)').click()
    }
    setTimeout(function () {
      let all = $("iframe[name='right']")[0].contentWindow.document
      let optall = $(all).find('select[name="catid"] option')
      if (optall) {
        Array.prototype.forEach.call(optall, function (item, index) {
          if (item.text.match(/[\u4e00-\u9fa5]/g).join('') == $('#f_caiji .name').val()) {
            // console.log(item.text.match(/[\u4e00-\u9fa5]/g).join(''), $('#f_caiji .name').val())
            item.selected = true
            // 提交按钮
            $(all).find('#dosubmit').click()
            setTimeout(function () {
              let all = $("iframe[name='right']")[0].contentWindow.document
              // 随便判断了 审核是否通过的字段
              if ($(all).find('input[name="content_status"]') && $(all).find('input[name="content_status"]').val() == '99') {
                $(all).find('.btn input').click()
                setTimeout(function () {
                  if (item.text.match(/[\u4e00-\u9fa5]/g).join('') == $('#f_caiji .last_name').val()) {
                    alert('采集完成')
                    return
                  } else {
                    // 更新当前栏目名称
                    $('#f_caiji .name').val(optall[index + 1].text.match(/[\u4e00-\u9fa5]/g).join(''))
                    console.log('继续')
                    add_NameCaiji()
                  }
                }, 7000)
              }
            }, 1000)
          }
        })
      }
    }, 1000)
  }

  $('#f_caiji button').click(function () {
    add_NumberCaiji()
  })
})()
