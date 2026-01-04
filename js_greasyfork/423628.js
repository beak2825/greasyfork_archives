// ==UserScript==
// @name    修复《AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列》百度失效的问题
// @name:en    AC-baidu-google_sogou_bing_RedirectRemove_favicon_adaway_TwoLine
// @name:zh    AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列
// @name:ja    AC-baidu-重定向最適化Baiduの搜狗のGoogleのBing検索結果のリダイレクト除去+favicon
// @description  This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @description:en  1.bypass the redirect link at baidu\sogou\google\haosou; 2.remove ads at baidu; 3.add Favicon for each website; 4.render your own style; 5.counter; 6.Switch to handle all 7.Auto Pager
// @description:ja  1.迂回Baidu、Sogou、Google、Haosou検索検索結果の中の自分の遷移リンク; 2.Baiduの余分な広告を取り除く; 3.コメントを追加; 4.ページのカスタムCSP; 5.カウントを追加; 6.スイッチは以上の機能を選択します; 7.自動ページめくり.
// @author    AC
// @license    GPL-3.0-only
// @create     2015-11-25
// @run-at     document-start
// @version    20210415.0.0.1
// @connect    baidu.com
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @connect    bing.com
// @connect    duckduckgo.com
// @connect    dogedoge.com
// @connect    so.com
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://xueshu.baidu.com/s*
// @include    *://www.so.com/s?*
// @include    *://*.bing.com/*
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @include    *://*.zhihu.com/*
// @include    *://*duckduckgo.com/*
// @include    *://*.dogedoge.com/*
// @exclude    *://*.google*/sorry*
// @exclude    https://zhidao.baidu.com/*
// @exclude    https://*.zhidao.baidu.com/*
// @supportURL  https://ac.tujidu.com/
// @home-url   https://greasyfork.org/zh-TW/scripts/14178
// @home-url2  https://github.com/langren1353/GM_script
// @homepageURL  https://greasyfork.org/zh-TW/scripts/14178
// @copyright  2015-2020, AC
// @lastmodified  2021-02-10
// @feedback-url  https://github.com/langren1353/GM_script
// @note    2021.04-15-V24.22 谷歌输入框下移问题修复
// @note    2021.03-15-V24.21 最新谷歌浏览器百度滚动出现问题修复
// @note    2021.02-10-V24.20 修复谷歌部分失效的问题 && 修复由于BA失效导致的脚本无效的问题
// @note    2021.02-02-V24.19 数据本地缓存，一定程度上保证重装后数据不丢失 && 修复谷歌部分内容失效的问题
// @note    2020.12-29-V24.18 调整侧边栏功能效果，优化双列显示效果，处理duckduck的样式
// @note    2020.12-29-V24.17 调整谷歌、百度双列显示效果-各个分辨率；修复百度部分点击失效的问题；
// @note    2020.12-22-V24.16 调整代码-减少致命异常；修复谷歌双列问题
// @note    2020.12-19-V24.14 修复部分内核上百度多列显示的问题；修复谷歌多列的显示问题
// @note    2020.12-18-V24.13 修复favicon在知乎上的排版问题；修复Duck样式无效的问题；修复最新谷歌双列失效的问题 - 尝试修复部分用户翻页失效问题；修复计数器编号异常的问题；更名尝试修复实效问题
// @note    2020.10-19-V24.12 拦截时支持URL地址的匹配，调整favicon会影响标题文字选中的问题；修复谷歌拦截模式失效的问题，修复谷歌编号问题；修复必应图片偏右的问题
// @note    2020.09-29-V24.11 针对百度律师函内容对脚本进行调整，扩展“百度优化”已经永久下线
// @note    2020.09-27-V24.10 修复百度拦截模式的问题以及小地址尾注；修复好搜的拦截功能；修复部分样式问题
// @note    2020.09-12-V24.09 修复翻页失效的问题；更新部分样式内容
// @note    2020.09-11-V24.08 更换Vue的cdn地址，尽量加快数据的载入速度；为了兼容safari将百度的https地址替换为了http地址；修复favicon获取的问题；增加favicon动态刷新；修复部分样式问题
// @note    2020.08-06-V24.07 修复保存无效的问题；修复百度在单列居中的时候错位的问题
// @note    2020.08-05-V24.06 修复自定义偶尔打不开的问题；修复定时器可能会造成的失效的问题；修复当存在多个脚本可能造成的冲突问题
// @note    2020.08-03-V24.05 更新修复护眼模式的问题；修复扩展上偶尔失效的问题；旧Edge似乎经常有保存不生效的问题，测试不是我的原因
// @note    2020.08-02-V24.04 动态样式切换，多列效果一键切换，无需刷新 修复各种样式问题 修复必应翻页问题 测试兼容GM和VM.彻底不支持搜狗搜索--别问为什么，我还想多活几年
// @note    2020.07-27-V24.2&3 更换Vue为75团的地址 修复百度的lite模式切换无效的问题
// @note    2020.07-27-V24.01 更新支持Linux下的Firefox emm修复上次提交过于着急导致的样式未提交 更新支持DogeDoge多吉搜索-但不处理重定向
// @note    2020.07-26-V24.00 部分内容更换为Vue初始化，减少一定的资源占用 && 新增DuckGoGo的样式效果 - 考虑到DuckGoGo的特性，不对其进行广告过滤
// @note    2020.07-09-V23.33 修复bing的顶部切换错位的问题；增加ww1.baidu.com域；修复各种样式(百度、谷歌、好搜、必应)错位的问题
// @note    2020.04-24-V23.32 版本倒退：安全起见：默认关闭搜狗的自定义域名拦截功能和重定向功能-以后考虑更换方式；默认不开启重定向功能、默认不开启广告拦截功能；更新部分说明内容；同时也对部分支持不到位的，兼容不好的效果向大家说一声抱歉，之后我会更加努力让搜索结果更加方便查看和使用
// @note    2020.03-27-V23.31 修复google由于页面结构更新导致的block功能失效的问题，同时修复谷歌护眼模式也失效的问题。新增翻页的按钮事件，新增使用在线config，避免由于页面结构改动又需要重新提交脚本更新
// @note    2017.05.12 -> 2020.03-26 && V8.6 -> V23.30 各种各样的历史更新记录，从一个版本迭代到另一个版本
// @note    2017.05.12-V8.4 新增：默认屏蔽谷歌的安全搜索功能
// @note    2017.05.05-V8.3 修复include范围太小导致的百度知道的屏蔽问题
// @note    2017.05.04-V8.2 终于修复了百度知道图片替换了文字的这个大BUG; 顺便处理了superapi.zhidao.baidu.com; 新增谷歌搜索结果重定向去除
// @note    2017.05.04-V8.1 终于修复了百度知道图片替换了文字的这个大BUG，顺便处理了superapi.zhidao.baidu.com
// @note    2017.05.04-V8.0 终于修复了百度知道图片替换了文字的这个大BUG，待测试
// @note    2017.03.28-V7.6 修复在ViolentMonkey上的不支持的问题
// @note    2017.03.28-V7.5 尝试修复chrome上的问题
// @note    2017.03.21-V7.4 尝试处理Edge上不支持的问题，结果发现是Edge本身的TamperMonkey支持有问题
// @note    2017.03.19-V7.3 修复打开百度之后再次点击“百度一下”导致的无法更新重定向问题
// @note    2017.03.19-V7.2 未知原因chrome的MutationObserver无法使用了，继续回归以前的DOMNodeInserted
// @note    2017.02.17-V7.0 修复搜狗的搜索结果重定向问题+改个名字
// @note    2017.02.17-V6.9 修复搜狗的搜索结果重定向问题
// @note    2016.10.27-V6.7 修复了以前的重复请求，现在的请求数应该小了很多，网络也就不卡了，感觉萌萌哒
// @note    2016.04.24-V6.6 恢复以前的版本，因为兼容性问题
// @note    2015.12.01-V5.0 加入搜狗的支持，但是支持不是很好
// @note    2015.11.25-V2.0 优化，已经是真实地址的不再尝试获取
// @note    2015.11.25-V1.0 完成去掉百度重定向的功能
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM_getResourceUrl
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand
// @grant    unsafeWindow
// @namespace 1353464539@qq.com
// @downloadURL https://update.greasyfork.org/scripts/423628/%E4%BF%AE%E5%A4%8D%E3%80%8AAC-baidu-%E9%87%8D%E5%AE%9A%E5%90%91%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E6%90%9C%E7%8B%97%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2_favicon_%E5%8F%8C%E5%88%97%E3%80%8B%E7%99%BE%E5%BA%A6%E5%A4%B1%E6%95%88%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423628/%E4%BF%AE%E5%A4%8D%E3%80%8AAC-baidu-%E9%87%8D%E5%AE%9A%E5%90%91%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E6%90%9C%E7%8B%97%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2_favicon_%E5%8F%8C%E5%88%97%E3%80%8B%E7%99%BE%E5%BA%A6%E5%A4%B1%E6%95%88%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==
