// ==UserScript==
// @name 从Baidu Bing等搜索引擎结果中屏蔽恶意网站（基于AC制作的脚本修改）
// @namespace Blockljbaidubing
// @include /^https?\:\/\/www.baidu.[^\/]+/
// @include /^https?\:\/\/[\w]+.bing.[^\/]+/
// @include /^https?\:\/\/www.so.com+/
// @include /^https?\:\/\/www.youdao.com/
// @include /^https?:\/\/www.sogou.com/
// @include /^https?:\/\/search.disconnect.me/
// @author       jim
// @version 0.8.0.1803155
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.

// @grant note 2018.1.21 重新调整所有规则，从本版本开始，以互联网权威规则为基础，以经过严格审查的规则为辅，大幅提升可靠性 
// @grant note 2017.6.5 (说明:本脚本基于AC的“AC- 从 Google Baidu Bing 等搜索引擎结果中屏蔽自定义网站”，新增了大量恶意网站网址，主体部分与原脚本相同)
// @grant note 2017.6.5（说明：由于google搜索的过滤功能有更好的扩展“personal blocklist”，本脚本不支持google搜索的过滤）
// @grant note 2017.6.5 @zzhjim个人修正了：去除谷歌、合入personal Blocklist 170605的数据(以下均为原作者AC的更新日志)
// @grant note 2017.4.14 更新了：根据反馈，处理了chrome上的MutationObserver的问题，还是换回了DOMinsert，反正能用
// @grant note 2016.2.6 更新了：根据反馈，增加了新的搜索点：Disconnect.ME搜索点，建立了一个简单的搜索结果
// @grant note 2015.11.22 更新了：采用了新的事件触发MutationObserver，替代之前经常被出触发的DOMinsert事件，大大减少了触发的情况，减轻了浏览器负担
// @grant note 2015.11.21 更新了：之前由于偷懒，所以简单的写了些大部分功能，这次基本上是完善了总的功能，应该不会有漏网之鱼了，如果出现问题请及时反馈邮箱1353464539@qq.com，如果没有问题的话应该来说这是最后一版了，除非以后代码失效了我会进行修改的
// @grant note 2015.11.4 更新了：谷歌干掉搜索结果留下的空白--注意先备份以前的修改
// @grant note 2015.10.31-4 一定程度上再次调整了卡顿的几率，同时加入函数tryto_del_specificEle(url_d, spec_d, spec_f_d, index_d)，还有删除了百度的软件推广
// @grant note 2015.10.31-3 看来都不喜欢卡饭，我就直接写好了不要www.kafan.cn好了，之前只是针对www.kafan.cn/topic
// @grant note 2015.10.31-2 修正了(因修改谷歌页面卡顿)导致的百度卡死情况,蛋疼的百度在某个f13标签卡死了
// @grant note 2015.10.31 更新处理谷歌页面卡顿的情况-求测试和反馈

// @downloadURL https://update.greasyfork.org/scripts/30518/%E4%BB%8EBaidu%20Bing%E7%AD%89%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E6%81%B6%E6%84%8F%E7%BD%91%E7%AB%99%EF%BC%88%E5%9F%BA%E4%BA%8EAC%E5%88%B6%E4%BD%9C%E7%9A%84%E8%84%9A%E6%9C%AC%E4%BF%AE%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/30518/%E4%BB%8EBaidu%20Bing%E7%AD%89%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E6%81%B6%E6%84%8F%E7%BD%91%E7%AB%99%EF%BC%88%E5%9F%BA%E4%BA%8EAC%E5%88%B6%E4%BD%9C%E7%9A%84%E8%84%9A%E6%9C%AC%E4%BF%AE%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==
