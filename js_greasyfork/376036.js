// ==UserScript==
// @name         讯邦oa系统-辅助
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  try to take over the world!
// @author       hury88
// @match        http://120.55.163.157/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376036/%E8%AE%AF%E9%82%A6oa%E7%B3%BB%E7%BB%9F-%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/376036/%E8%AE%AF%E9%82%A6oa%E7%B3%BB%E7%BB%9F-%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let div = document.createElement('div');

            div.innerHTML = `<div style="position: fixed;top: 20.5px; bottom: auto; left: 423px; right: auto;background: #fff;border: 1px solid #ced1d9;border-radius: 4px;box-shadow: 0 0 3px #ced1d9;color: black;word-break: break-all;display: block;width: 520px;padding: 10px 20px;z-index: 9999;">
                                  <a href="javascript:AddTag('我的任务', '/index.php/Task/Taskinfo/index.html', 'icon75');" class="ToolBtn"><span class="icon9"></span><b>我的任务</b></a>

                                  <a title="有未接受的任务时,自动提交接受,并弹出日志框填写日志" href="javascript:xbhr_clockout();" class="ToolBtn"><span class="icon49"></span><b>一键打卡</b></a>
                                  <a href="javascript:xbhr_AcceptAllWork();" class="ToolBtn"><span class="icon313"></span><b>一键接受</b></a>
                                  <a href="javascript:;" onclick="$('#searchBox').toggle().focus();" class="ToolBtn"><span class="icon300"></span><b>项目搜索</b></a>

                                  <a target="_blank" href="https://greasyfork.org/scripts/376036-%E8%AE%AF%E9%82%A6oa%E7%B3%BB%E7%BB%9F-%E8%BE%85%E5%8A%A9/code/%E8%AE%AF%E9%82%A6oa%E7%B3%BB%E7%BB%9F-%E8%BE%85%E5%8A%A9.user.js" class="ToolBtn"><b>更新脚本2.0.2</b></a>
                                  <a target="_blank" href="https://greasyfork.org/zh-CN/scripts/376036-%E8%AE%AF%E9%82%A6oa%E7%B3%BB%E7%BB%9F-%E8%BE%85%E5%8A%A9" class="ToolBtn"><b>脚本地址</b></a>




                             `;
    div.innerHTML += `
<style>
#searchBox {display:none}
#myInput {
    background-image: url('https://static.runoob.com/images/mix/searchicon.png'); /* 搜索按钮 */
    background-position: 10px 12px; /* 定位搜索按钮 */
    background-repeat: no-repeat; /* 不重复图片*/
    width: 100%;
    font-size: 16px; /* 加大字体 */
    padding: 12px 20px 12px 40px;
    border: 1px solid #ddd;
    margin-bottom: 12px;
}

#myUL {
    /* 移除默认的列表样式 */
    list-style-type: none;
    padding: 0;
    margin: 0;
    display:none;
    height:300px;
    overflow-y: scroll;
}

#myUL li a {
    border: 1px solid #ddd; /* 链接添加边框 */
    margin-top: -1px;
    background-color: #f6f6f6;
    padding: 12px;
    text-decoration: none;
    font-size: 18px;
    color: black;
    display: block;
    cursor: pointer;
}

#myUL li a.header {
    background-color: #e2e2e2;
    cursor: pointer;
}

#myUL li a:hover:not(.header) {
    background-color: #eee;
}
</style>
<div style="z-index: 999;position: absolute;right: 0;" id="searchBox">
  <input type="text" id="myInput" onkeyup="myFunction()" placeholder="搜索...">

  <ul id="myUL">
<li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=1" class="header">中国电力网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=14" class="header">蒸小皖维保系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=15" class="header">怎么办小程序</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=16" class="header">微商城</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=17" class="header">游戏贝壳APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=20" class="header">快找工APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=22" class="header">99回收-小米仓</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=24" class="header">苹果熟了</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=25" class="header">合信通--51拿去花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=26" class="header">珵美书房</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=27" class="header">游戏贝壳APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=28" class="header">庐阳区产（创）业服务中心APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=32" class="header">秒换钱</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=33" class="header">租了么</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=34" class="header">微菜市</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=35" class="header">周周无忧</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=36" class="header">融易借H5</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=37" class="header">回收站</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=38" class="header">券券熊APP-梦幻星缘</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=39" class="header">fdsghfghfdh</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=40" class="header">珵美书房</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=41" class="header">分享购-返利APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=42" class="header">统一基础版本开发框架V1.2.4</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=43" class="header">贷款超市基础版</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=45" class="header">米乐宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=46" class="header">闪电回收-闪电换钱</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=47" class="header">金虾米</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=48" class="header">小白盒子</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=49" class="header">新兰德证券咨询售后平台</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=50" class="header">规划人-二次改版</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=51" class="header">美丽优选</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=52" class="header">今日融</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=53" class="header">慧换钱</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=54" class="header">信用口袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=55" class="header">大唐白卡-七米之门</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=56" class="header">智慧合肥H5</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=57" class="header">Mimi借条-有米借条</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=59" class="header">【测试】生意人</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=65" class="header">test</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=66" class="header">test2</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=67" class="header">test3</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=68" class="header">郎星严选微商城</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=70" class="header">e代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=71" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=72" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=73" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=74" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=75" class="header">w11</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=76" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=77" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=79" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=80" class="header">任务分解项目【测试数据】</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=82" class="header">测试</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=85" class="header">测试6</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=90" class="header">億鉆鏈 EDCC2  (意钻链)</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=91" class="header">趣乐购-烂尾</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=92" class="header">e卡社区</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=93" class="header">E融资讯</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=94" class="header">测试数据</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=95" class="header">测试数据</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=96" class="header">易贷钱包APP--创诚</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=97" class="header">哪借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=98" class="header">众享金汇</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=99" class="header">智能速贷APP--创诚</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=100" class="header">怪就</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=101" class="header">快易宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=102" class="header">闪电易购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=103" class="header">诸葛白卡-纳（小）米工厂</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=104" class="header">现金快换-每日开仓</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=105" class="header">99回收-小米仓</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=106" class="header">51回收-面包工厂</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=107" class="header">极速换钱-米仓管家-安逸汇</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=108" class="header">手机白卡-多米云-趣乐换</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=109" class="header">商会网站</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=110" class="header">e时代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=111" class="header">小蚂蚁技术平台</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=112" class="header">小蚂蚁技术平台</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=113" class="header">讯邦OA2018</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=114" class="header">换钱花app</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=115" class="header">小白盒子</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=116" class="header">合信通</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=117" class="header">麻袋乾莊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=118" class="header">安时代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=119" class="header">大唐白卡资讯</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=120" class="header">多金白卡</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=121" class="header">光速微贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=122" class="header">秒到借款</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=123" class="header">万国房产</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=124" class="header">钱包闪借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=125" class="header">现金卡借贷款吧-花花伴侣</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=126" class="header">欢乐购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=127" class="header">宜速贷吧</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=128" class="header">现金易借-容易花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=129" class="header">中国中铁分包企业管理信息系统V3.0</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=130" class="header">海米购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=131" class="header">安徽兆尹信息科技股份有限公司官网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=133" class="header">临床试验稽查分享平台</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=134" class="header">味家app</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=135" class="header">肥先生-许多鲜</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=136" class="header">采货宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=137" class="header">星星之火</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=138" class="header">滴钱到-金易到</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=139" class="header">新农人app</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=140" class="header">安徽超远信息技术有限公司官网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=141" class="header">合肥宝光建材有限公司网站</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=142" class="header">合肥尚佑装饰官网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=143" class="header">折美人淘宝客APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=144" class="header">项目包名更改</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=146" class="header">众金</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=147" class="header">趣嗨购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=148" class="header">荔枝卡盟</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=149" class="header">乐乐钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=150" class="header">Java基础版本</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=151" class="header">今唐JTB</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=152" class="header">久昌快贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=153" class="header">下款王APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=154" class="header">结婚网app-暂停</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=155" class="header">天天贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=156" class="header">小灯芯</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=157" class="header">玖亿融</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=158" class="header">小蚂蚁推客</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=159" class="header">E时代技术平台</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=160" class="header">小米钱庄</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=161" class="header">小期贷APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=162" class="header">佳兴房产</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=163" class="header">秒回购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=164" class="header">启富商城</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=165" class="header">天台县文化礼堂</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=166" class="header">艾美链</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=167" class="header">叮当易换</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=168" class="header">一秒花app</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=169" class="header">宜融圈</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=170" class="header">提款机</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=171" class="header">依贝云APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=172" class="header">依贝云H5</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=173" class="header">鲸鱼回收</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=174" class="header">速借钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=175" class="header">一袋金</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=176" class="header">回收了</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=177" class="header">九城监狱管理局犯人心理查询页</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=178" class="header">小翎金服微信端</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=179" class="header">生产管理ERP管理系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=180" class="header">阿米丁借贷微信端</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=181" class="header">mimi借条</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=182" class="header">今日融</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=183" class="header">周周无忧</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=184" class="header">信邦借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=185" class="header">掌上人品</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=186" class="header">易换钱</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=187" class="header">聚谊仓</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=188" class="header">郎星名片小程序</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=189" class="header">丽格斯数码wap手机站</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=190" class="header">吉利福</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=191" class="header">豆芽推客</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=192" class="header">花卷贷-多宝贷-五斗米</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=193" class="header">众金通 - 项目烂尾</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=194" class="header">虾米购</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=195" class="header">瀚之海学历教育项目</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=196" class="header">三水应急</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=197" class="header">安徽超远信息改版</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=198" class="header">期贷宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=199" class="header">钱包来借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=200" class="header">创裕金服</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=201" class="header">极融易</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=202" class="header">彩虹钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=203" class="header">牛牛有钱（租了么复制）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=204" class="header">星火荷包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=205" class="header">救急宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=206" class="header">极速享借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=207" class="header">口袋速借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=208" class="header">有米花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=210" class="header">梦想易贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=211" class="header">道客APP</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=212" class="header">淮南矿业售电公司网站</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=213" class="header">快提贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=214" class="header">万利金融</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=216" class="header">CEOC</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=217" class="header">安慧软件官网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=218" class="header">金易到（滴钱到）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=219" class="header">米乐无忧</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=220" class="header">全民应急</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=221" class="header">来钱贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=222" class="header">虾米借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=223" class="header">春雨钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=224" class="header">易用e贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=225" class="header">讯邦借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=226" class="header">讯邦借贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=227" class="header">发你花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=228" class="header">易米金服（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=229" class="header">讯邦官网改版</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=230" class="header">融易借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=231" class="header">金锁钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=232" class="header">闪贷侠</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=233" class="header">蛋卷贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=234" class="header">周转钱包（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=235" class="header">王者智能信息管理系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=236" class="header">乐享贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=237" class="header">天鹰商城-暂停</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=238" class="header">91卡汇-小米花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=239" class="header">温瑞财富</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=240" class="header">i时代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=241" class="header">闪银花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=242" class="header">鱼钱宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=243" class="header">仟鑫时代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=244" class="header">哈喽钱包（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=245" class="header">袋鼠侠（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=246" class="header">万通钱包（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=247" class="header">全诚贷（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=248" class="header">王者智能计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=249" class="header">中财公路港</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=250" class="header">鑫鑫花（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=251" class="header">爱米借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=252" class="header">米宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=253" class="header">享趣花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=254" class="header">天投地产</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=255" class="header">有米花（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=256" class="header">如意贷（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=257" class="header">钱多多（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=258" class="header">浣熊普惠</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=259" class="header">星期贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=260" class="header">信借贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=261" class="header">黑米花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=262" class="header">小钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=263" class="header">壹秒借（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=264" class="header">壹秒借（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=265" class="header">豆得贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=266" class="header">聚财宝（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=267" class="header">超能贷（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=268" class="header">龙凤应急-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=269" class="header">秒易到-分秒易到-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=270" class="header">易米钱庄</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=271" class="header">金米金服-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=272" class="header">九州钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=273" class="header">优米微贷-王者（暂停）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=274" class="header">速速贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=275" class="header">速贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=276" class="header">拍拍钱贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=277" class="header">亿凡钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=278" class="header">招财猫-九招财猫-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=279" class="header">七秒金服</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=280" class="header">淘勺-牛宝宝</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=281" class="header">借贷邦-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=282" class="header">51用钱宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=283" class="header">金钱包-小金龟-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=284" class="header">好易借-王者（已暂停）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=285" class="header">易享花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=286" class="header">58联盟</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=287" class="header">如意白条</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=288" class="header">旺旺钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=289" class="header">金马贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=290" class="header">马上花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=291" class="header">捡钱花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=292" class="header">微支付钱庄</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=293" class="header">易融贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=294" class="header">融易花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=295" class="header">现金优品-贷你花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=296" class="header">鲁班7号-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=297" class="header">钱融</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=298" class="header">萤火虫-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=299" class="header">随你贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=300" class="header">都盈</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=301" class="header">来钱钱包-安讯贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=302" class="header">财亨通-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=303" class="header">小宝贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=304" class="header">青春e贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=305" class="header">E闪代</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=306" class="header">U享贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=307" class="header">贷来花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=308" class="header">钱莊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=309" class="header">欢乐花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=310" class="header">亿人贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=311" class="header">好速钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=312" class="header">好期贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=313" class="header">借钱周转</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=314" class="header">三借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=315" class="header">万花筒-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=316" class="header">友钱花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=317" class="header">来钱宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=318" class="header">宝泰钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=319" class="header">众樂宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=320" class="header">盛钱花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=321" class="header">银贷宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=322" class="header">易德金-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=323" class="header">E秒贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=324" class="header">魔力花花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=325" class="header">借无忧-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=326" class="header">便利通</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=327" class="header">贷多宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=328" class="header">普惠钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=329" class="header">闪讯钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=330" class="header">金芭克-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=331" class="header">嘉乐花-嘉乐金服-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=332" class="header">会员计费管理系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=333" class="header">花多多</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=334" class="header">金鹰贷-春卷贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=335" class="header">金瓜子</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=336" class="header">淘现金-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=337" class="header">久富钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=338" class="header">兔八哥-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=339" class="header">捷豹贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=340" class="header">财神钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=341" class="header">旺财钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=342" class="header">万金贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=343" class="header">网联金服-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=344" class="header">花呗花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=345" class="header">借呗贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=346" class="header">随意袋-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=347" class="header">阳光钱贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=348" class="header">阿得利</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=349" class="header">金钱豹-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=350" class="header">威森效果图</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=351" class="header">富有钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=352" class="header">美康</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=353" class="header">不愁花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=354" class="header">魔晶贷-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=355" class="header">钱仓</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=356" class="header">借借钱包-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=357" class="header">千金钱包-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=358" class="header">点点金</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=359" class="header">随心借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=360" class="header">统一基础版本开发框架V2.0.0</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=361" class="header">优选乾袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=362" class="header">大运花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=363" class="header">鑫胜钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=364" class="header">阿里钱袋-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=365" class="header">易秒钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=366" class="header">九州贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=367" class="header">米多多-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=368" class="header">久久花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=369" class="header">佘小宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=370" class="header">绝对借-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=371" class="header">789金卡</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=372" class="header">讯邦计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=373" class="header">友钱借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=374" class="header">贷多多-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=375" class="header">顺通钱包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=376" class="header">海诚金融-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=377" class="header">应急钱包-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=378" class="header">小贷宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=379" class="header">逍遥花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=380" class="header">安心借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=381" class="header">小七钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=382" class="header">蓝鲸-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=383" class="header">永恒钱包-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=384" class="header">速借宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=385" class="header">Hi淘</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=386" class="header">至尊智能AI系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=387" class="header">蒲公英-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=388" class="header">金葡萄-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=389" class="header">小荷包-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=390" class="header">优品易借-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=391" class="header">一诺钱包-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=392" class="header">秒借到-白鲨</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=393" class="header">香蕉贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=394" class="header">至尊宝-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=395" class="header">马上应急-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=396" class="header">极速贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=397" class="header">咕咕钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=398" class="header">闪e贷-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=399" class="header">易速花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=400" class="header">好易花-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=401" class="header">余贷宝-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=402" class="header">信心宝-王者（暂停）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=403" class="header">江雪科技</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=404" class="header">多多易袋-王者</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=405" class="header">花猫钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=406" class="header">钱庄</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=407" class="header">先借金服（王者）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=408" class="header">随便贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=409" class="header">多多米袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=410" class="header">Java生鲜系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=411" class="header">快钱速递</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=412" class="header">乐融资讯</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=413" class="header">爆米花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=414" class="header">至尊计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=415" class="header">艾柏效果图</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=416" class="header">胖胖钱包-比斗云</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=417" class="header">安徽消费网</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=418" class="header">来钱贷-新</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=419" class="header">来福袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=420" class="header">融信数据计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=421" class="header">超级花-银河AI</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=422" class="header">诸葛贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=423" class="header">私房菜收银系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=424" class="header">信用口袋1</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=425" class="header">钱山庄-刘斌</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=426" class="header">顺鑫贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=427" class="header">游啊游</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=428" class="header">金米袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=429" class="header">金融誉-易花钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=430" class="header">小麦鲜生</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=431" class="header">鱼花花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=432" class="header">电销分发系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=433" class="header">联联贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=434" class="header">iv故事</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=435" class="header">小猪有财-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=436" class="header">任性口袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=437" class="header">淘花花</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=438" class="header">金蚂蚁</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=439" class="header">阿里贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=440" class="header">莱卡钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=441" class="header">牛旺旺</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=450" class="header">鳄鱼钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=451" class="header">滴滴钱包-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=452" class="header">米易花-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=453" class="header">佩奇宝-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=454" class="header">云有钱-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=455" class="header">至尊袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=456" class="header">小海带-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=457" class="header">e袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=458" class="header">一品袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=459" class="header">银河计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=460" class="header">随意钱袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=461" class="header">比斗云计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=462" class="header">大口袋-至尊（暂停）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=463" class="header">享有钱-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=464" class="header">未来钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=465" class="header">金猪宝-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=466" class="header">金袋钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=467" class="header">今日秒借</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=468" class="header">星愿助手</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=469" class="header">金腰袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=470" class="header">金三角</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=471" class="header">汇丰聚财-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=472" class="header">应急花-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=473" class="header">极速帮-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=474" class="header">创富云信息管理系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=475" class="header">摇钱树--天宝AI（原银河AI2号）</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=476" class="header">329钱包</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=477" class="header">熊猫口袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=478" class="header">来钱贷计费系统</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=479" class="header">聚富米仓-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=480" class="header">大大钱包-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=481" class="header">至尊星耀-至尊星耀</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=482" class="header">佩奇钱袋</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=483" class="header">金盾电销分发</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=484" class="header">贵人贷</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=485" class="header">滴滴出钱-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=486" class="header">信口袋-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=487" class="header">顺心花-至尊</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=488" class="header">起点现金</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=489" class="header">贷超基础版本V2.0</a></li><li><a target="_blank" href="/index.php/Myproject/Project/detail/?ID=" class="header"></a></li>
  </ul>
</div>
</div>
`;
    //<a href="javascript:xbhr_clockin();" class="ToolBtn"><span class="icon9"></span><b>上班打卡(已自动)</b></a>
    //<a href="javascript:$.XB.open({ 'type':'add','openmode':'1', 'dialog': { 'url': '/index.php/Attendance/Worklog/edit/', 'title': '添加' } });" class="ToolBtn"><span class="icon7"></span><b>添加日志</b></a>
    //<a href="javascript:accept_startwork();" class="ToolBtn"><span class="icon313"></span><b>接受并且执行</b></a>
            document.body.appendChild(div);

    let scr = document.createElement('script');
    scr.innerHTML = `
function myFunction() {
    // 声明变量
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    ul.style.display = "block";

    // 循环所有列表，查找匹配项
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
       if(filter == '') {
         ul.style.display = "none";
       }
}

        function xbhr_alert(message) {
            $.messager.alert("提示",message);
            setTimeout(function(){
                $(".messager-body").window('close');
            }, 1500)
        }

        function xbhr_clockin() {
            $.post("/index.php/Attendance/Appraisal/clockin.html",{},function(data){
                if(data.result == 1) {
                    $.messager.alert("提示",data.message,"info",function(){
                        window.location.reload();
                    });
                }
                if(data.result == 0) {
                    xbhr_AcceptAllWork()
                    $.messager.alert("提示",data.message);
                    setTimeout(function(){
                        $(".messager-body").window('close');
                    }, 1500)
                }
            },"json");
        }
        function xbhr_clockout() {
             $.post("/index.php/Attendance/Appraisal/clockout.html",{},function(data){
                if(data.result == 1) {

                     AddTag("考勤信息", "/index.php/Attendance/Appraisal/index.html", "icon84");
                     xbhr_alert(data.message)
                }
                if(data.result == 0) {
                   //抱歉，你已经打过下班卡，不要重复打卡！
                   if(data.message == "抱歉，请先填写工作日志后打卡！") {
                       $.messager.alert("提示","如果你已填写, 请再次点击重新打卡","info",function(){
                           xbhr_clockout();
                       });
                       setTimeout(function(){
                           $.XB.open({ 'type':'add','openmode':'1', 'dialog': { 'url': '/index.php/Attendance/Worklog/edit/', 'title': '添加' } })
                       }, 500)
                   } else {
                       xbhr_alert(data.message)
                   }

                }
            },"json");
        }

    function xbhr_getAcceptwork() {
        $.post("/index.php/Task/Taskinfo/DataList",{
            Statuss: 1,
            Status: 1
        },function(data){
            if(data.total >= 1) {

                $.messager.alert("提示","有待接受的任务"+data.total+"个","info",function(){

                });
            } else {
                $.messager.alert("提示",'无待接受的任务', function(){

                });
                setTimeout(function(){
                    $(".messager-body").window('close');
                }, 1500)
            }
        },"json");
    }
    //获取所有接受的任务并自动接受
    var counter;

    function xbhr_Acceptwork(ID) {
        $.post("/index.php/Task/Taskinfo/acceptwork/",{
            ID: ID,
        },function(data){
            if(data.result == 1) {
                ++counter;
            }else if(data.result == 0) {

            }
        },"json");
    }
    function xbhr_AcceptAllWork() {
        $.post("/index.php/Task/Taskinfo/DataList",{
            Statuss: 1,
            Status: 1
        },function(data){
            if(data.total >= 1) {
                for (var i = 0; i < data.rows.length; i++) {
                    xbhr_Acceptwork(data.rows[i]["ID"]);
                };
                $.messager.alert("提示","成功接受"+data.total+"个任务","info",function(){
                    AddTag("我的任务", "/index.php/Task/Taskinfo/index.html", "icon75");
                });
            } else {
                $.messager.alert("提示",'无待接受的任务', function(){
                    setTimeout(function(){
                        $(".messager-body").window("close");
                    }, 1500)
                });
            }
        },"json");
    }

    function accept_startwork() {
        $.XB.open({ 'type':'acceptwork','openmode':'3', 'dialog': { 'url': 'acceptwork/', 'title': '接受任务' } });
        $(".messager-body").window("close");
        $.XB.open({ 'type':'startwork','openmode':'3', 'dialog': { 'url': 'startwork/', 'title': '开始执行' } })
    }
    function addLog() {

        $.XB.open({ 'type':'add','openmode':'1', 'dialog': { 'url': '/index.php/Attendance/Worklog/edit/', 'title': '添加' } })
    }


        //AddTag("我的任务", "/index.php/Task/Taskinfo/index.html", "icon75");
setTimeout(function(){
 //AddTag("考勤信息", "/index.php/Attendance/Appraisal/index.html", "icon84");
}, 2500)


`;
    document.body.appendChild(scr);

    function oxbhr_Acceptwork(ID) {
        $.post("/index.php/Task/Taskinfo/acceptwork/",{
            ID: ID,
        },function(data){
            if(data.result == 1) {

            }else if(data.result == 0) {

            }
        },"json");
    }
    function oxbhr_getAcceptwork() {
        $.post("/index.php/Task/Taskinfo/DataList",{
            Statuss: 1,
            Status: 1
        },function(data){
            if(data.total >= 1) {

                $.messager.alert("提示","有待接受的任务"+data.total+"个","info",function(){

                });
            } else {
                $.messager.alert("提示",'无待接受的任务', function(){
                    setTimeout(function(){
                        $(".messager-body").window('close');
                    }, 1500)
                });
            }
        },"json");
    }

    function xbhr_clockin() {
        $.post("/index.php/Attendance/Appraisal/clockin.html",{},function(data){
            console.log(data);
        },"json");
    }
    //自动打卡
    xbhr_clockin();
    //getAcceptwork();


    // Your code here...
})();
