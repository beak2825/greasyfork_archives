// ==UserScript==
// @name               轻小说文库+ （重制）
// @namespace          Wenku8+_re
// @version            0.1.5.4
// @description        轻小说文库+的重置，写好了就作为一个更新直接发上去，所以到时候记得改name、namespace和描述
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://www.wenku8.net/*
// @match              http*://www.wenku8.cc/*
// @match              http*://wenku8.net/*
// @match              http*://wenku8.cc/*
// @connect            wenku8.com
// @connect            wenku8.net
// @connect            wenku8.cc
// @connect            777743.xyz
// @connect            p.sda1.dev
// @connect            image.sogou.com
// @connect            *
// @require            https://update.greasyfork.org/scripts/456034/1526615/Basic%20Functions%20%28For%20userscripts%29.js
// @require            https://update.greasyfork.org/scripts/449583/1334125/ConfigManager.js
// @require            https://greasyfork.org/scripts/471280-url-encoder/code/URL%20Encoder.js?version=1247074
// @require            https://greasyfork.org/scripts/460385-gm-web-hooks/code/script.js?version=1221394
// @require            https://greasyfork.org/scripts/445697-greasy-fork-api/code/Greasy%20Fork%20API.js?version=1055543
// @require            https://fastly.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require            https://fastly.jsdelivr.net/npm/tippy.js@6.3.7/dist/tippy.umd.min.js
// @require            https://fastly.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
// @require            https://fastly.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.8/lib/sortable.js
// @require            https://fastly.jsdelivr.net/gh/vkiryukhin/vkBeautify@0a238953acf12ac2f366fd63998514e1ac9db042/vkbeautify.js
// @require            https://fastly.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js
// @require            https://fastly.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @resource           tippy-css       https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/dist/tippy.css
// @resource           alertify-css    https://fastly.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css
// @resource           alertify-theme  https://fastly.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css
// @icon               data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD/igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//rlB//3HaP/858P//OfD//znw//858P//OfD//znw//858P//OfD//zitv/91Y///dWP//3Vj//9y3X//cdo//3HaP/9x2j//cdo//zitv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//znw//858P//OfD//znw//9x2j//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6cN//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//3ZnP//ogD//6IA//+iAP//ogD//sJb//3HaP/83qn//OfD//zeqf//pw3//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+rGv/90IL//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//cdo//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//OfD//znw//858P//OfD//znw//858P//6IA//+iAP/84rb//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//rQ0//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//3Vj//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//6wJ///ogD//6sa//3HaP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//+iAP//ogD//rQ0//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//zitv/+vk7//6IA//+iAP//ogD//6IA//+iAP/+tDT//OfD//znw//858P//OfD//znw//858P//rAn//+iAP//ogD//ct1//3HaP/+tDT//rQ0//6+Tv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//ct1//7CW///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//65Qf//ogD//6IA//3HaP/9x2j//6cN//+iAP//ogD//r5O//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//60NP/9x2j//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//OfD//65Qf//ogD//6cN//znw//858P//6IA//+iAP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP/858P//cdo//+iAP//ogD//dWP//3Vj///pw3//6IA//7CW//858P//rQ0//+iAP/92Zz//OfD//3Ldf/+tDT//OK2//znw//858P//N6p//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//7CW///ogD//6IA//6+Tv//ogD//6IA//6+Tv/91Y///6IA//+iAP/+vk7//OfD//+iAP//ogD//6IA//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//dWP//+iAP//ogD//6IA//+iAP//ogD//OK2//+rGv//ogD//6IA//3ZnP/858P//6IA//+iAP//qxr//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//sJb//+iAP//pw3//rQ0//+iAP//ogD//OfD//znw//+wlv//6IA//+iAP//ogD//6cN//3ZnP/+vk7//6IA//+iAP/90IL//OfD//60NP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//84rb//rAn//+iAP//ogD//6IA//+iAP/+sCf//rQ0//+iAP//ogD//6IA//+iAP/9x2j//OfD//65Qf//ogD//rAn//znw//858P//rQ0//+iAP/+uUH//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//r5O//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/9x2j//6IA//+iAP/9x2j//OfD//6+Tv//ogD//6IA//znw//84rb//6IA//+iAP/84rb//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//+nDf//ogD//6cN//60NP/+vk7//ct1//znw//+wlv//6IA//+iAP/858P//OK2//+iAP//ogD//dmc//znw///pw3//6IA//6wJ//83qn//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//+iAP//ogD//dmc//znw//858P//OfD//znw///pw3//6IA//+nDf/83qn//dmc//+nDf//ogD//6sa//znw//92Zz//6IA//+iAP/858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//N6p//3HaP/+sCf//6IA//+iAP//ogD//6IA//+iAP//qxr//dmc//3ZnP//pw3//6IA//6+Tv/858P//dmc//+iAP//ogD//OfD//znw//9x2j//sJb//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/+vk7//OfD//znw//91Y///OK2//znw//858P//dWP//3Vj//9x2j//rlB//+nDf//pw3//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//3Ldf//ogD//6IA//+iAP//ogD//6IA//60NP/+tDT//cdo//zitv/+tDT//rQ0//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/83qn//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//dmc//+iAP/+sCf//OfD//znw//858P//dWP//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//zeqf/858P//OfD//znw//858P//rQ0//60NP/+tDT//rQ0//60NP/9x2j//cdo//3HaP/91Y///dWP//zeqf/858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_xmlhttpRequest
// @grant              GM_getResourceText
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/472035/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B%20%EF%BC%88%E9%87%8D%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472035/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B%20%EF%BC%88%E9%87%8D%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-assign */

/* global require FuncInfo isWenkuFunction Messager FL_listFunctions FL_getFunction FL_enableFunction FL_disableFunction FL_loadSetting FL_getDebug FL_exportConfig FL_importConfig FL_postMessage FL_recieveMessage */
/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global ConfigManager $URL GMXHRHook GMDLHook GreasyFork upgradeConfigV2 */
/* global tippy alertify Sortable vkbeautify Darkmode CryptoJS*/

/* 开发进度
[x]: 已完成
[-]: 正在施工
[?]: 等待测试
[o]: 待完善
[ ]: 待开发
[D]: 暂时搁置，后期计划开发
*: 代表相对于旧版有bug修复/优化/新功能

[x] 功能加载器
  [x] 加载功能
  [x] 启用/禁用功能
  [x] 功能存储隔离
  [x] 账号存储隔离
  [o] 功能日志记录
[o] 设置界面*
  [o] 功能设置
    [x] 独立功能管理界面
      [x] 界面框架
      [x] 启用/停用
      [o] 存储管理
        [x] 查看存储
        [x] 修改存储
        [x] 导出存储
        [x] 导入存储
        [x] 恢复出厂设置
    [o] 功能设置界面框架
      [x] 功能设置界面
      [x] 功能设置界面表格对齐
  [x] 脚本设置
    [x] 设置界面
    [x] 检查更新
    [x] 自动检查更新
    [x] 导出配置
    [x] 导入配置
    [x] 导出日志
    [ ] 跨账号配置迁移
  [x] 防止设置界面同时打开多次
[x] wenku8.cc域名支持
[o] 在线阅读解锁
  [ ] 兼容haoa的轻小说文库下载
[x] 下载解锁
  [x] 下载panel
  [x] 下载页面*
  [x] “本书公告”
  [x] 繁体版页面支持
  [x] 不用iframe
[x] 下载增强*
  [x] txt*
  [x] txtfull*
  [x] jar*
  [x] umd*
  [x] 繁体版页面支持
  [x] 修复文库下载带html字符编码问题*
    [x] txt分卷
    [x] txt全本
[x] 全部插图下载
[ ] 多格式下载器
  [ ] 下载器框架
  [ ] txt全本
  [ ] txt分卷
  [ ] epub全本
  [ ] epub分卷
  [ ] 插图
[o] 单章节下载*
  [x] 文本下载
  [o] 图片下载
    [D] 下载失败时，点击最终提示信息框，可显示详细下载状态信息
  [x] 繁体版页面支持
[x] 书架增强
  [x] 书架整合
  [x] 书架重命名
  [x] 自动推书界面整合
    [x] 自动推书界面
    [x] 自动推书功能未启用时不显示其界面
    [x] 提示框优化
      [x] 实时显示自动推书总次数
      [x] 相同书的提示框合并显示*
[o] 自动推书
    [o] 点击显示推书详情
[o] 页面美化*
  [x] 通用页面美化*
    [x] 背景图
    [x] 半透明遮罩层
    [x] 遮罩层高斯模糊
    [x] 兼容深色模式，深色模式和浅色模式分别存储两套遮罩颜色、模糊程度、不透明度
  [o] 书评页面美化
    [x] 书评页面内容宽度平齐*
    [D] 书评页面美化后保留美化前scroll状态
  [o] 阅读页美化*
    [x] 阅读页美化正文居中(可选)*
    [x] 双击alertify和SidePanel不再自动滚屏*
    [D] 阅读页美化正文宽度可调*
  [x] 繁体版页面支持
  [D] 页面内调节面板，实时应用修改
[x] 阅读增强
  [x] 更多字体颜色
  [x] 更多字体大小
  [x] 更多字体
  [x] 繁体版页面支持
  [x] 翻页键支持
[x] 去广告
  [x] 繁体版页面支持
[x] 未登录自动跳转首页
[o] 图床*
  [o] 图床加载框架
    [x] 基础框架
    [x] 图床自动选择机制
      [x] 上传时评分排序
      [x] 上传后记录结果
    [x] 图床返回url自动encodeURI
    [D] 用户手动选择图床机制
  [x] 设置图片上传组件
    [x] 选择图片
    [x] 上传图片
    [x] 清空图片
  [o] 图床
    [x] 搜狗图床
    [D] 360图床
    [x] 流浪图床
[x] 稍后再读*
  [x] 首页稍后再读书籍列表*
  [x] 书介绍页加入/移出按钮
  [x] 用户手动顺序调整*
  [x] 繁体版页面支持
  [x] 首页点击X移除稍后再读*
[x] 书籍信息复制
[x] 书籍tag跳转
[o] 侧边栏
  [x] 侧边栏框架
  [o] 侧边栏默认svg*
    [D] svg一直展示到fa显示出来再隐藏
[x] 深色模式*
  [x] 主页
  [x] 书架
  [x] 书页
  [x] 阅读
  [x] 目录
  [x] 评论
    [x] bbcode
  [x] 评论编辑
  [x] 评论列表
  [x] 排行榜
  [x] tags
  [x] 书评吐槽
  [x] 用户页面
    [x] 用户主页
    [x] 用户面板
    [x] 用户编辑
    [x] 修改密码
    [x] 设置头像
    [x] 用户好友
    [x] 用户链接
    [x] 短消息
      [x] 收件箱
      [x] 发件箱
      [x] 写新消息
  [x] 登录页面
  [x] 跳转api页面
  [x] 设置界面
  [x] UBBEditor menu
  [x] 右上角提示框
  [x] 文库dialog弹窗
  [x] 其他页面
    [x] https://www.wenku8.net/other/jubao.php
    [x] https://www.wenku8.net/other/help.php
  [x] tippy适配
  [x] 页面美化适配
[D] 在线阅读历史记录
[o] 账号切换
  [x] 顶栏账号切换
  [x] 账号自动录入
  [x] 账号管理
[o] 书评草稿
  [x] 书评草稿自动保存和加载
  [x] 书评草稿管理
[o] 书评增强
  [x] 引用
    [x] 引用
    [x] 仅引用楼号
  [D] @
  [x] 链接图片增强*
    [x] 支持https链接
    [x] 自动encodeuri
    [x] 格式检查
  [x] 本地图片插入
    [x] 界面点击上传
    [x] 拖动上传
    [x] 粘贴上传
    [x] 插入图片保持光标位置*
  [x] 自适应高度的编辑器*
  [x] 书评回复标题
  [o] 书评下载保存
    [x] 基本书评下载
    [x] BBCode书评下载
    [x] json格式导出*
    [D] 保存书评为带图片的格式*
  [o] 书评收藏*
    [x] 收藏/取消收藏
    [o] 首页展示
      [o] 防止文本溢出
    [x] 拖动调整顺序
    [ ] “更多”按钮和管理界面
    [ ] 备注
    [x] 默认收藏：文库导航姬
    [ ] 默认收藏：脚本反馈贴
  [x] 换页不刷新*
  [x] 页面内书评编辑
    [x] UBBEditor编辑器支持*
    [x] 应用UBBEditor增强功能*
  [x] 链接跳转
  [D] 旧版页面[img]*.(jpg|png)[/img]加载*
  [x] 繁体版页面支持
  [x] 自动刷新*
  [x] 页面回复后仍在当前页面*
    [x] 后台提交回复并根据文库返回页面热更新当前页面
      [x] 返回没有重定向的错误页面，显示错误信息并保留编辑器内容
      [x] 返回带重定向的书评编辑成功页面，更新页面内容到当前page
      [x] 返回书评第一页，更新页面内容到last page
  [x] Ctrl+Enter提交表单
    [x] Ctrl+Enter提交表单
    [x] Command+Enter提交表单
    [x] 去除Windows+Enter提交表单
    [x] 按钮提示文本
  [x] 表单格式检查
    [x] 不要空回复
    [x] 内容长度≥7
[ ] tag搜索
[x] 脚本执行时间提前
[-] X浏览器支持
[ ] 旧版配置自动导入
[ ] 回调代码Promise化
*/

(function __MAIN__() {
	'use strict';

	// Constances
	const CONST = {
		TextAllLang: {
			DEFAULT: 'zh-CN',
			'zh-CN': {
				Loader: {
					CheckerError: 'Checker Error',
					CheckerInvalid: 'Checker Invalid'
				}
			}
		},
		Config_Ruleset: {
			'version-key': 'config-version',
			'ignores': ["LOCAL-CDN"],
			'defaultValues': {
				//'config-key': {},
				funcs: {},
				debug: []
			},
			'updaters': {
				/*'config-key': [
					function() {
						// This function contains updater for config['config-key'] from v0 to v1
					},
					function() {
						// This function contains updater for config['config-key'] from v1 to v2
					}
				]*/
			},
			'globalUpdaters': [
				// ver_0: old v1.x script config
				function(config) {
					//config
					return { OLD_CONFIG: config }
				}
			]
		}
	};

	// Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

	// Functions
	const Functions = [
		// Test
		{
			name: '测试函数',
			description: '用于调试功能加载器以及脚本环境是否正常',
			id: 'test',
			system: false,
			data: {
				load: false,
				storage: false,
				manager: false,
				makeerror: false,
				errortype: 'setTimeout',
				log: [],
				allowdebug: unsafeWindow.isPY_DNG && unsafeWindow.userscriptDebugging,
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				}
			},
			checker: {
				type: 'switch',
				value: true
			},
			func: function() {
				//['message', 'success', 'warning', 'error'].forEach(type => alertify.notify(type, type, 0)); // alertify notifier test

				// Function load
				if (FuncInfo.data.load) {
					DoLog(LogLevel.Success, '测试函数启动了！');
				}

				// Basic storage
				if (FuncInfo.data.storage) {
					GM_setValue('test', true);
					DoLog(`读取test存储项的结果为${GM_getValue('test', 'default text')}`);
					DoLog(`读取unset存储项的结果为${GM_getValue('unset', 'default text')}`);
				}

				// Config Manager
				if (FuncInfo.data.manager) {
					const CM = new ConfigManager(FuncInfo.data.Config_Ruleset);
					const CONFIG = CM.Config;
					GM_setValue('testobj', {prop: 'value'});
					DoLog(`Object.keys(CONFIG).length = ${Object.keys(CONFIG).length}`);
					DoLog(`Object.keys(CONFIG.testobj) = ${Object.keys(CONFIG.testobj)}`);
				}

				// Error dealing
				if (FuncInfo.data.makeerror) {
					switch (FuncInfo.data.errortype) {
						case 'error':
							Err('An error occured!');
							break;
						case 'setTimeout':
							setTimeout(function() {Err('An error occured!')}, 0);
							break;
						case 'setTimeout_arrow':
							setTimeout(() => Err('An error occured!'), 0);
							break;
					}
				}
				if (FuncInfo.data.log && FuncInfo.data.log.length) {
					FuncInfo.data.log.forEach(v => console.log(v));
				}

				// Debug object
				if (FuncInfo.data.allowdebug) {
					Object.defineProperty(unsafeWindow, 'wd', {
						get: function() {
							// Leave a reference here so debugger a will be able to access them
							[require, FuncInfo, isWenkuFunction, Messager, FL_listFunctions, FL_getFunction, FL_enableFunction, FL_disableFunction, FL_loadSetting, FL_postMessage, FL_recieveMessage];
							[LogLevel, DoLog, Err, $, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent, copyProp, copyProps, parseArgs, escJsStr, replaceText, getUrlArgv, dl_browser, dl_GM, AsyncManager];
							[ConfigManager, $URL, GreasyFork];
							[tippy, alertify, Sortable, vkbeautify, Darkmode, CryptoJS];

							debugger;
							return 'wenku8+ debugger: just hit "wd" and return';
						},
						configurable: true,
						enumerable: false,
					});
				}

				return {
					log() {DoLog('Debug function log')},
					number: 1,
					boolean: true,
					'null': null,
					'NaN': NaN,
					'undefined': undefined,
					arr: [0, 1, 2],
					obj: {}
				}
			}
		},

		// Common Style
		{
			name: 'CommonStyle',
			description: '基本组件 - 样式管理器',
			id: 'CommonStyle',
			system: true,
			checker: {
				type: 'switch',
				value: false
			},
			func: function() {
				const Assets = {
					ClassName: {
						Button: 'plus_button',
						Text: 'plus_text',
						TextLight: 'plus_text_light',
						Disabled: 'plus_disabled'
					},
					Color: {
						Text: 'rgb(30, 100, 220)',
						TextLight: 'rgb(70, 150, 230)',
						Button: 'rgb(0, 160, 0)',
						ButtonHover: 'rgb(0, 100, 0)',
						ButtonFocus: 'color: rgb(0, 100, 0)',
						ButtonDisabled: 'rgba(150, 150, 150)',
					}
				};
				// Add assets style
                detectDom('head').then(head => {
                    Assets.ElmStyle = addStyle(
                        `.${Assets.ClassName.Text} {color: ${Assets.Color.Text} !important;}` +
                        `.${Assets.ClassName.TextLight} {color: ${Assets.Color.TextLight} !important;}` +
                        `.${Assets.ClassName.Button} {color: ${Assets.Color.Button} !important; fill: ${Assets.Color.Button} !important; cursor: pointer !important; user-select: none;}` +
                        `.${Assets.ClassName.Button}:hover {color: ${Assets.Color.ButtonHover} !important; fill: ${Assets.Color.ButtonHover} !important;}` +
                        `.${Assets.ClassName.Button}:focus {${Assets.Color.ButtonFocus} !important; fill: ${Assets.Color.ButtonFocus} !important;}` +
                        `.${Assets.ClassName.Button}.${Assets.ClassName.Disabled} {color: ${Assets.Color.ButtonDisabled} !important; fill: ${Assets.Color.ButtonDisabled} !important; cursor: not-allowed !important;}` +
                        `.tippy-box[data-theme~="wenku_tip"] {background-color: #f0f7ff;color: black;border: 1px solid #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="top"]>.tippy-arrow::before {border-top-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="left"]>.tippy-arrow::before {border-left-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="right"]>.tippy-arrow::before {border-right-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="bottom"]>.tippy-arrow::before {border-bottom-color: #a3bee8;}`
                        , 'plus-commonstyle-assets'
                    );
                    // Add common style
                    addStyle(`#dialog{z-index: 1600 !important;} #mask{z-index: 1500 !important;}`, 'plus-commonstyle-style');
                });
				return Assets;
			}
		},

		// FontAwesome
		{
			name: 'FontAwesome',
			description: '基本组件 - FontAwesome(图标)',
			id: 'FontAwesome',
			system: true,
			func: function() {
				const urls = [
					'https://fastly.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css',
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
					'https://bowercdn.net/c/Font-Awesome-6.4.0/css/all.min.css',
					'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css',
				];
				const timeout = 15 * 1000;

				let i = 0, loaded = false, tid;
				const link = $$CrE({
					tagName: 'link',
					props: {
						href: urls[i],
						rel: 'stylesheet'
					},
					listeners: [
						['error', changeSource],
						['load', onload]
					]
				});
				tid = setTimeout(changeSource, timeout);
				detectDom('head').then(head => head.appendChild(link));

				return {link, get loaded() {return loaded;}}

				function changeSource() {
					if (++i < urls.length) {
						clearTimeout(tid);
						tid = setTimeout(changeSource, timeout);
						link.href = urls[i];
					} else {
						Err('FontAwesome loading error');
					}
				}

				function onload(e) {
					clearTimeout(tid);
					loaded = true;
					FL_postMessage('FontAwesomeLoaded');
				}
			}
		},

		// Alertify
		{
			name: 'alertify',
			description: '基本组件 - alertify(对话框/信息栏)',
			id: 'alertify',
			system: true,
			func: function() {
                detectDom('head').then(head => {
                    addStyle(GM_getResourceText('alertify-css'), 'plus-alertify-css');
                    addStyle(GM_getResourceText('alertify-theme'), 'plus-alertify-theme');
                });
                $AEL(unsafeWindow, 'load', e => {
                    alertify.set('notifier','position', 'top-right');
                });
			}
		},

		// Tippy
		{
			name: 'tippy',
			description: '基本组件 - tippy(浮动提示框)',
			id: 'tippy',
			system: true,
			func: function() {
                detectDom('head').then(head => {
                    addStyle(GM_getResourceText('tippy-css'), 'plus-tippy-css');
                });
			}
		},

		// Utils
		{
			name: '常用函数库',
			description: '脚本常用函数库',
			id: 'utils',
			system: true,
			checker: {
				type: 'switch',
				value: false
			},
			func: function() {
				return {getLang, getDocument, parseDocument, downloadText, setPageUrl, htmlEncode, htmlDecode, detectDom, randstr, randint, insertText, openDialog, refreshPage, testChecker, submitForm, formEncode, loadFuncs, encrypt, decrypt, getOS, getTime, deepClone};

				// Get language: 0 for simplyfied chinese and others, 1 for traditional chinese
				function getLang() {
					const match = document.cookie.match(/(; *)?jieqiUserCharset=(.+?)( *;|$)/);
					const nvgtLang = ({'zh-CN': 0, 'zh-TW': 1})[navigator.language] || 0;
					return match && match[2] ? (match[2].toLowerCase() === 'big5' ? 1 : 0) : nvgtLang;
				}

				// Download and parse a url page into a html document(dom).
				// when xhr onload: callback.apply(null, [dom, ...args])
				// Usage: getDocument({url, callback[, onerror][, args]}) | getDocument(url, callback) | getDocument(url, callback, args) | getDocument(url, callback, onerror, args)
				function getDocument() {
                    let useCallback = true, resolve = null;
					const [url, callback, onerror, args] = parseArgs([...arguments], [
						function(args, defaultValues) {
							const arg = args[0];
                            if (typeof arg === 'string') {
                                useCallback = false;
                                return [arg, ...defaultValues.slice(1)];
                            } else {
                                useCallback = true;
                                return ['url', 'callback', 'onerror', 'args'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i]);
                            }
						},
						[1, 2],
						[1, 2, 4],
						[1, 2, 3, 4]
					], ['', function() {}, logError, []]);

					GM_xmlhttpRequest({
						method       : 'GET',
						url          : url,
						responseType : 'blob',
						timeout      : 15 * 1000,
						onload       : function(response) {
							const htmlblob = response.response;
							parseDocument(htmlblob, dom => {
                                const newargs = [dom].concat(args);
                                useCallback ? callback.apply(null, newargs) : resolve(dom);
                            });
						},
						onerror      : onerror,
						ontimeout    : onerror
					});

                    if (!useCallback) {
                        return new Promise((rs, rj) => resolve = rs);
                    }

					function logError(e) {
						DoLog(LogLevel.Error, 'getDocument: Request Error');
						DoLog(LogLevel.Error, e, 'error');
					}
				}

				function parseDocument(htmlblob, callback, args=[]) {
					const reader = new FileReader();
					reader.onload = function(e) {
						const htmlText = reader.result;
						const dom = new DOMParser().parseFromString(htmlText, 'text/html');
						args = [dom].concat(args);
						callback.apply(null, args);
						//callback(dom, htmlText);
					}
					const charset = ['GBK', 'BIG5'][getLang()];
					reader.readAsText(htmlblob, charset);
				}

				// Save text to textfile
				function downloadText(text, name) {
					if (!text || !name) {return false;};

					// Get blob url
					const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
					const url = URL.createObjectURL(blob);

					// Create <a> and download
					const a = $CrE('a');
					a.href = url;
					a.download = name;
					a.click();
				}

				// Change location.href without reloading using history.pushState/replaceState
				// Usage: setPageUrl(url) | setPageUrl(win, url) | setPageUrl(win, url, push)
				function setPageUrl() {
					const [win, url, push] = parseArgs([...arguments], [
						[2],
						[1,2],
						[1,2,3]
					], [window, '', false]);
					return win.history[push ? 'pushState' : 'replaceState']({modified: true, ...history.state}, '', url);
				}

				// Encode text into html text format
				function htmlEncode(text) {
					const span = $CrE('div');
					span.innerText = text;
					return span.innerHTML;
				}

				// Decode html format text into pure text
				function htmlDecode(text) {
					const span = $CrE('div');
					span.innerHTML = text;
					return span.innerText;
				}

				// Returns a random string
				function randstr(length=16, cases=true, aviod=[]) {
					const all = 'abcdefghijklmnopqrstuvwxyz0123456789' + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
					while (true) {
						let str = '';
						for (let i = 0; i < length; i++) {
							str += all.charAt(randint(0, all.length-1));
						}
						if (!aviod.includes(str)) {return str;};
					}
				}

				function randint(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}

				// Insert into <textarea>
				function insertText(textarea, text, focus=true) {
					const pre_text = textarea.value.substring(0, textarea.selectionStart);
					const after_text = textarea.value.substring(textarea.selectionEnd);
					const curPos = {
						start: {
							atBegin: textarea.selectionStart === 0,
							atEnd: textarea.selectionStart === textarea.value.length,
							atNewLine: /[\r\n]/.test(textarea.value.charAt(textarea.selectionStart-1)), // this excludes the first line
							atWhitespace: /\t/.test(textarea.value.charAt(textarea.selectionStart-1))
						},
						end: {
							atBegin: textarea.selectionEnd === 0,
							atEnd: textarea.selectionEnd === textarea.value.length,
							atNewLine: /[\r\n]/.test(textarea.value.charAt(textarea.selectionEnd)),
						},
					};
					const textWithWhitespace = `${(curPos.start.atBegin || curPos.start.atNewLine || curPos.start.atWhitespace) ? '' : ' '}${text}${((curPos.start.atBegin || curPos.start.atNewLine || curPos.start.atWhitespace) && text.length === 0) ? '' : ' '}`;
					const position = textarea.selectionStart + textWithWhitespace.length;
					textarea.value = `${pre_text}${textWithWhitespace}${after_text}`;

					// Set selection position
					setTimeout(e => {
						const [scrollTop, scrollLeft] = [textarea.scrollTop, textarea.scrollLeft];
						focus && textarea.scrollIntoView();
						focus && textarea.focus();
						textarea.setSelectionRange(position, position);
						[textarea.scrollTop, textarea.scrollLeft] = [scrollTop, scrollLeft]
					}, 0);
				}

				// My openDialog, modified from original wenku8's openDialog, with onload and mask support, and NO CACHE unless showing images
				function openDialog(url, onload){
					!document.getElementById("mask") && unsafeWindow.showMask();
					const [dialogs, Ajax, displayDialog] = [unsafeWindow.dialogs, unsafeWindow.Ajax, unsafeWindow.displayDialog];
					if(url.match(/\.(gif|jpg|jpeg|png|bmp)$/ig)){
						dialogs[url]='<img src="'+url+'" class="imgdialog" onclick="closeDialog()" style="cursor:pointer" />';
						displayDialog(dialogs[url]);
					}else{
						Ajax.Request(url,{onLoading:function(){dialogs[url]=this.response; displayDialog('Loading...');}, onComplete:function(){dialogs[url]=this.response; displayDialog(this.response);typeof onload === 'function' && onload();}});
					}
				}

				// Refresh page without submitting forms again
				function refreshPage() {
					if (unsafeWindow.top.location.href.includes('#')) {
						unsafeWindow.top.location.reload();
					} else {
						unsafeWindow.top.location.href = unsafeWindow.top.location.href;
					}
				}

				// Check whether current page url matches FuncInfo.checker rule
				// This code is copy and modified from FunctionLoader.check
				function testChecker(checker) {
					if (!checker) {return true;}
					const values = Array.isArray(checker.value) ? checker.value : [checker.value]
					return values.some(value => {
						switch (checker.type) {
							case 'regurl': {
								return !!location.href.match(value);
							}
							case 'func': {
								try {
									return value();
								} catch (err) {
									DoLog(LogLevel.Error, CONST.Text.Loader.CheckerError);
									DoLog(LogLevel.Error, err);
									return false;
								}
							}
							case 'switch': {
								return value;
							}
							case 'starturl': {
								return location.href.startsWith(value);
							}
							case 'startpath': {
								return location.pathname.startsWidth(value);
							}
							default: {
								DoLog(LogLevel.Error, CONST.Text.Loader.CheckerInvalid);
								return false;
							}
						}
					});
				}

				// Ajax submit form
				// onload(blob_response) | onerror(err_instance)
				// The form serializing algorithm inside this function is not fully implemented yet. See comments in code.
				function submitForm(form, onload, onerror) {
					const data = serializeFormData(form);
					GM_xmlhttpRequest({
						method: 'POST',
						url: form.getAttribute('action'),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						responseType: 'blob',
						data: data,
						onload: resp => typeof onload === 'function' && onload(resp),
						onerror: err => typeof onerror === 'function' && onerror(err),
						ontimeout: err => typeof onerror === 'function' && onerror(err),
					});

					// Serialize form with GBK encoding
					// Supports string data only
					// This is not fully implemented. See https://url.spec.whatwg.org/#concept-urlencoded-serializer and https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm for further implementation
					function serializeFormData(form) {
						const data = new FormData(form);
						let string = '';
						for (const [key, value] of data) {
							string += `&${formEncode(key)}=${formEncode(value)}`;
						}
						return string;
					}
				}

				function formEncode(str) {
					return $URL.encode(normalizeLinefeeds(str));

					// Code from https://github.com/jimmywarting/FormData/ (MIT License)
					function normalizeLinefeeds(value) {
						return value.replace(/\r?\n|\r/g, '\r\n')
					}
				}

				// Load all function-objs provided in funcs asynchronously, and merge return values into one return obj
				// funcobj: {[checker], [detectDom], func}
				function loadFuncs(oFuncs) {
					const returnObj = {};

					oFuncs.forEach(oFunc => {
						if (!oFunc.checker || testChecker(oFunc.checker)) {
							if (oFunc.detectDom) {
								detectDom({
                                    selector: oFunc.detectDom,
                                    callback: e => execute(oFunc)
                                });
							} else {
								setTimeout(e => execute(oFunc), 0);
							}
						}
					});

					return returnObj;

					function execute(oFunc) {
						setTimeout(e => {
							const rval = oFunc.func(returnObj) || {};
							copyProps(rval, returnObj);
						}, 0);
					}
				}

				// Encrypt given text with key using AES-GCM (See https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/encrypt)
				// Returns: Encrypted string
				function encrypt(text, secret) {
					return CryptoJS.AES.encrypt(text, secret).toString();
				}

				// Decrypt given ArrayBuffer with key and iv using AES-GCM
				// Returns: Promise(text)
				function decrypt(ciphertext, secret) {
					const bytes  = CryptoJS.AES.decrypt(ciphertext, secret);
					const originalText = bytes.toString(CryptoJS.enc.Utf8);
					return originalText;
				}

				function getOS() {
					const info = (navigator.platform || navigator.userAgent).toLowerCase();
					const test = (s) => (info.includes(s));
					const map = {
						'Windows': ['window', 'win32', 'win64', 'win86'],
						'Mac': ['mac', 'os x'],
						'Linux': ['linux']
					}
					for (const [sys, strs] of Object.entries(map)) {
						if (strs.some(test)) {
							return sys;
						}
					}
					return 'Null';
				}

				// Get a time text like 1970-01-01 00:00:00
				// if dateSpliter provided false, there will be no date part. The same for timeSpliter.
				function getTime() {
					const [time, dateSpliter, timeSpliter] = parseArgs([...arguments], [
						[1],
						[2, 3],
						[1, 2, 3]
					], [new Date().getTime(), '-', ':']);

					const d = new Date(time);
					let fulltime = '';
					dateSpliter && (fulltime += [d.getFullYear().toString().padStart(4, '0'), (d.getMonth() + 1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')].join(dateSpliter));
					dateSpliter && timeSpliter && (fulltime += ' ');
					timeSpliter && (fulltime += [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(timeSpliter));
					return fulltime;
				}

				// Deep copy an object
				function deepClone(obj) {
					/* No need for structuredClone
					if (typeof structuredClone === 'function') {
						return structuredClone(obj);
					}
					*/

					let newObj = typeof obj === 'object' && obj !== null ? (Array.isArray(obj) ? [] : {}) : obj;
					if (obj && typeof obj === "object") {
						for (let key in obj) {
							if (obj.hasOwnProperty(key)) {
								newObj[key] = (obj && typeof obj[key] === 'object') ? deepClone(obj[key]) : obj[key];
							}
						}
					}
					return newObj;
				}
			}
		},

		// Dialog
		{
			name: '对话框',
			description: '基础对话框功能，用于构建对话框式界面',
			id: 'dialog',
			system: true,
			checker: {
				type: 'switch',
				value: false
			},
			func: function() {
				addStyle('.dialog-mask {position: fixed;left: 0;top: 0;width: 100vw;height: 100vh;overflow: hidden;background: #FFFFFF20;z-index: 100;}.dialog-container {position: fixed;left: 0;top: 0;width: 100vw;height: 100vh;overflow: hidden;background: #00000000;z-index: 101;display: flex;align-items: center;justify-content: center;}.dialog-main {border-radius: 5px;background: #FFFFFF;box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.50);padding: 2vh 2vw;width: fit-content;}.plus-darkmode .dialog-main {background: #222222;}', 'plus-dialog');
				class dialog {
					#elements;
					#showing;

					constructor(content) {
						const elements = this.#elements = {};
						elements.mask = $$CrE({
							tagName: 'div',
							classes: 'dialog-mask'
						});
						elements.container = $$CrE({
							tagName: 'div',
							classes: 'dialog-container'
						});
						elements.main = $$CrE({
							tagName: 'div',
							classes: 'dialog-main'
						});
						elements.container.appendChild(elements.main);
						[elements.mask, elements.container].forEach(elm => document.body.appendChild(elm));

						if (typeof content === 'string') {
							elements.main.innerHTML = content;
						} else if (content instanceof HTMLElement) {
							elements.main.appendChild(content);
						}
						content ? this.show() : this.hide();
					}

					show() {
						['mask', 'container'].forEach(name => this.#elements[name].style.removeProperty('display'));
						this.#showing = true;
					}

					hide() {
						['mask', 'container'].forEach(name => this.#elements[name].style.display = 'none');
						this.#showing = false;
					}

					get elements() {
						return Object.assign({}, this.#elements);
					}

					get showing() {
						return this.#showing;
					}

					set showing(visible) {
						if (typeof visible === 'boolean') {
							visible ? this.show() : this.hide();
						}
						return this.#showing;
					}
				}

				return dialog;
			}
		},

		// SidePanel
		{
			name: '侧边工具栏',
			description: '基本组件 - 工具栏按钮管理器',
			id: 'SidePanel',
			system: true,
			func: function() {
				const utils = require('utils');
				const CONST = {
					CSS: {
						Sidepanel: '#sidepanel-panel {background-color: #00000000;z-index: 4000;}.sidepanel-button {font-size: 2vmin;color: #1E64DC;fill: #1E64DC;background-color: #FDFDFD;}.sidepanel-button:hover, .sidepanel-button.low-opacity:hover {opacity: 1;color: #FDFDFD;background-color: #1E64DC;}.sidepanel-button.low-opacity{opacity: 0.4 }.sidepanel-button>:is(i[class^="fa-"],svg) {line-height: 3vmin;width: 3vmin;height: 3vmin;}.sidepanel-button[class*="tooltip"]:hover::after {font-size: 0.9rem;top: calc((5vmin - 25px) / 2);}.sidepanel-button[class*="tooltip"]:hover::before {top: calc((5vmin - 12px) / 2);}.sidepanel-button.accept-pointer{pointer-events:auto;}',
						DefaultSVG: '.default-fa-spin {-webkit-animation-name: default-fa-spin;animation-name: default-fa-spin;-webkit-animation-duration: var(--fa-animation-duration,2s);animation-duration: var(--fa-animation-duration,2s);-webkit-animation-iteration-count: var(--fa-animation-iteration-count,infinite);animation-iteration-count: var(--fa-animation-iteration-count,infinite);-webkit-animation-timing-function: var(--fa-animation-timing,linear);animation-timing-function: var(--fa-animation-timing,linear);}@-webkit-keyframes default-fa-spin {0% {-webkit-transform: rotate(0deg);transform: rotate(0deg) }to {-webkit-transform: rotate(1turn);transform: rotate(1turn) }}@keyframes default-fa-spin {0% {-webkit-transform: rotate(0deg);transform: rotate(0deg) }to {-webkit-transform: rotate(1turn);transform: rotate(1turn) }}',
					},
					SVG: {
						DefaultSVG: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>'
					}
				};
				return sideFunctions();

				// Side functions area
				function sideFunctions() {
					const SPanel = new SidePanel();
					SPanel.create();
					SPanel.setPosition('bottom-right');
                    detectDom('head').then(head => {
                        addStyle(CONST.CSS.Sidepanel, 'plus-sidepanel-css');
                        addStyle(CONST.CSS.DefaultSVG, 'plus-sidepanel-defaultsvg');
                    });

					commonButtons();
					return SPanel;

					function commonButtons() {
						// Button show/hide-all-buttons
						const btnShowHide = SPanel.add({
							faicon: 'fa-solid fa-down-left-and-up-right-to-center',
							className: 'accept-pointer',
							tip: '隐藏面板',
							onclick: (function() {
								let hidden = false;
								return (e) => {
									hidden = !hidden;
									btnShowHide.faicon.className = 'fa-solid ' + (hidden ? 'fa-up-right-and-down-left-from-center' : 'fa-down-left-and-up-right-to-center');
									btnShowHide.classList[hidden ? 'add' : 'remove']('low-opacity');
									SPanel.setTooltip(btnShowHide, (hidden ? '显示面板' : '隐藏面板'));
									SPanel.elements.panel.style.pointerEvents = hidden ? 'none' : 'auto';
									for (const button of SPanel.elements.buttons) {
										if (button === btnShowHide) {continue;}
										//button.style.display = hidden ? 'none' : 'block';
										button.style.pointerEvents = hidden ? 'none' : 'auto';
										button.style.opacity = hidden ? '0' : '1';
									}
								};
							}) ()
						});

						// Button scroll-to-bottom
						const btnDown = SPanel.add({
							faicon: 'fa-solid fa-angle-down',
							tip: '转到底部',
							onclick: e => {
								const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

								for (const elm of elms) {
									elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, elm.scrollHeight);
								}
							}
						});

						// Button scroll-to-top
						const btnUp = SPanel.add({
							faicon: 'fa-solid fa-angle-up',
							tip: '转到顶部',
							onclick: e => {
								const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

								for (const elm of elms) {
									elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, 0);
								}
							}
						});

						// Darkmode (old version)
						/*
					const btnDarkmode = SPanel.add({
						faicon: 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon'),
						tip: '明暗切换',
						onclick: (e) => {
							DMode.toggle();
							btnDarkmode.faicon.className = 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon');
						}
					});
					*/

						// Refresh page
						const btnRefresh = SPanel.add({
							faicon: 'fa-solid fa-rotate-right',
							tip: '刷新页面',
							onclick: e => utils.refreshPage()
						});
					}
				}

				// Side-located control panel
				// Requirements: FontAwesome, tippy.js, addStyle
				// Use 'new' keyword
				function SidePanel() {
					// Public SP
					const SP = this;
					const elms = SP.elements = {};

					// Private _SP
					// keys start with '_' shouldn't be modified
					const _SP = {
						_id: {
							css: 'sidepanel-style',
							usercss: 'sidepanel-style-user',
							panel: 'sidepanel-panel'
						},
						_class: {
							button: 'sidepanel-button'
						},
						_directions: ['left', 'right', 'top', 'bottom']
					};

                    detectDom('head').then(head => {
                        addStyle('#sidepanel-panel {position: fixed; background-color: #00000000; padding: 0.5vmin; line-height: 3.5vmin; height: auto; display: flex; transition-duration: 0.3s; z-index: 9999999999;} #sidepanel-panel.right {right: 3vmin;} #sidepanel-panel.bottom {bottom: 3vmin; flex-direction: column-reverse;} #sidepanel-panel.left {left: 3vmin;} #sidepanel-panel.top {top: 3vmin; flex-direction: column;} .sidepanel-button {padding: 1vmin; margin: 0.5vmin; font-size: 3.5vmin; border-radius: 10%; text-align: center; color: #00000088; background-color: #FFFFFF88; box-shadow:3px 3px 2px #00000022; user-select: none; transition-duration: inherit;} .sidepanel-button:hover {color: #FFFFFFDD; background-color: #000000DD;}', 'plus-sidepanel');
                    });
					SP.create = function() {
						// Create panel
						const panel = elms.panel = $CrE('div');
						panel.id = _SP._id.panel;
						SP.setPosition('bottom-right');
						detectDom({
                            selector: 'body',
                            callback: e => document.body.appendChild(panel)
                        });

						// Prepare buttons
						elms.buttons = [];
					}

					// Insert a button to given index
					// details = {index, text, faicon, id, tip, className, onclick, listeners}, all optional
					// listeners = [..[..args]]. [..args] will be applied as button.addEventListener's args
					// faicon = 'fa-icon-name-classname fa-icon-style-classname', this arg stands for a FontAwesome icon to be inserted inside the botton
					// Returns the button(HTMLDivElement), including button.faicon(HTMLElement/HTMLSpanElement in firefox, <i>) if faicon is set
					SP.insert = function(details) {
						const index = details.index;
						const text = details.text;
						const faicon = details.faicon;
						const id = details.id;
						const tip = details.tip;
						const className = details.className;
						const onclick = details.onclick;
						const listeners = details.listeners || [];

						const button = $CrE('div');
						text && (button.innerHTML = text);
						id && (button.id = id);
						tip && setTooltip(button, tip);
						className && (button.className = className);
						onclick && (button.onclick = onclick);
						if (faicon) {
							// Show default svg before FontAwesome loaded
							button.innerHTML = CONST.SVG.DefaultSVG;
							button.children[0].classList.add('default-fa-spin');

							// Show faicon when FontAwesome loaded
							FL_recieveMessage('FontAwesomeLoaded', function() {
								// Remove default svg
								[...button.children].forEach(child => child.remove());

								// Show faicon
								const i = $CrE('i');
								i.className = faicon;
								button.faicon = i;
								button.appendChild(i);
							}, 'FontAwesome', true);
						}
						for (const listener of listeners) {
							$AEL(button, ...listener);
						}
						button.classList.add(_SP._class.button);

						elms.buttons = insertItem(elms.buttons, button, index);
						index < elms.buttons.length ? elms.panel.insertBefore(button, elms.panel.children[index]) : elms.panel.appendChild(button);
						return button;
					}

					// Append a button
					SP.add = function(details) {
						details.index = elms.buttons.length;
						return SP.insert(details);
					}

					// Remove a button
					SP.remove = function(arg) {
						let index, elm;
						if (arg instanceof HTMLElement) {
							elm = arg;
							index = elms.buttons.indexOf(elm);
						} else if (typeof(arg) === 'number') {
							index = arg;
							elm = elms.buttons[index];
						} else if (typeof(arg) === 'string') {
							elm = $(elms.panel, arg);
							index = elms.buttons.indexOf(elm);
						}

						elms.buttons = delItem(elms.buttons, index);
						elm.remove();
					}

					// Show entire panel
					SP.show = function() {
						elms.panel.style.removeProperty('display');
					}

					// Hide entire panel
					SP.hide = function() {
						elms.panel.style.display = 'none';
					}

					// Sets the display position by texts like 'right-bottom'
					SP.setPosition = function(pos) {
						const poses = _SP.direction = pos.split('-');
						const avails = _SP._directions;

						// Available check
						if (poses.length !== 2) {return false;}
						for (const p of poses) {
							if (!avails.includes(p)) {return false;}
						}

						// remove all others
						for (const p of avails) {
							elms.panel.classList.remove(p);
						}

						// add new pos
						for (const p of poses) {
							elms.panel.classList.add(p);
						}

						// Change tooltips' direction
						elms.buttons && elms.buttons.forEach(setTooltipDirection);
					}

					// Gets the current display position
					SP.getPosition = function() {
						return _SP.direction.join('-');
					}

					SP.setTooltip = setTooltip;
					SP.setTooltipDirection = setTooltipDirection;

					// Append a style text to document(<head>) with a <style> element
					// Replaces existing id-specificed <style>s
					function spAddStyle(css, id) {
						const style = document.createElement("style");
						id && (style.id = id);
						style.textContent = css;
						for (const elm of $All('#'+id)) {
							elm.parentElement && elm.parentElement.removeChild(elm);
						}
						document.head.appendChild(style);
					}

					// Set a tooltip to the element
					function setTooltip(elm, text, direction='auto') {
						elm._tippy ? elm._tippy.setContent(text) : tippy(elm, {
							content: text,
							theme: 'wenku_tip',
							arrow: true,
							hideOnClick: false
						});

						setTooltipDirection(elm, direction);
					}

					function setTooltipDirection(elm, direction='auto') {
						direction === 'auto' && (direction = _SP.direction.includes('left') ? 'right' : 'left');
						if (!_SP._directions.includes(direction)) {Err('setTooltip: invalid direction');}

						// Tippy direction
						if (!elm._tippy) {
							DoLog(LogLevel.Error, 'SidePanel.setTooltipDirection: Given elm has no tippy instance(elm._tippy)');
							Err('SidePanel.setTooltipDirection: Given elm has no tippy instance(elm._tippy)');
						}
						elm._tippy.setProps({
							placement: direction
						});
					}

					// Del an item from an array using its index. Returns the array but can NOT modify the original array directly!!
					function delItem(arr, index) {
						arr = arr.slice(0, index).concat(arr.slice(index+1));
						return arr;
					}

					// Insert an item into an array using given index. Returns the array but can NOT modify the original array directly!!
					function insertItem(arr, item, index) {
						arr = arr.slice(0, index).concat(item).concat(arr.slice(index));
						return arr;
					}
				}
			}
		},

		// SettingPanel
		{
			name: 'SettingPanel',
			description: '基本组件 - 设置类窗口',
			id: 'SettingPanel',
			system: true,
			checker: {
				type: 'switch',
				value: true
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');
				const CONST = {
					Text: {
						Saved: '已保存',
						Reset: '已恢复到修改前',
						Boolean: ['否', '是'],
						Operations: '操作',
						Operation: {
							edit: '编辑',
							delete: '删除'
						}
					}
				};
				const SettingOptionElements = {
					'string': {
						createElement: function() {const e = $CrE('input'); e.style.width = 'calc(100% - 6px - 1ex)'; return e;},
						setValue: function(val) {this.element.value = val;},
						getValue: function() {return this.element.value;},
					},
					'number': {
						createElement: function() {const e = $CrE('input'); e.type = 'number'; e.style.width = 'calc(100% - 6px - 1ex)'; return e;},
						setValue: function (val) {this.element.value = val;},
						getValue: function() {return this.element.value;},
					},
					'boolean': {
						createElement: function() {const e = $CrE('input'); e.type = 'checkbox'; return e;},
						setValue: function(val) {this.element.checked = val;},
						getValue: function(data) {return this.element.checked ? (this.hasOwnProperty('data') ? this.data.checked : true) : (data ? this.data.unchecked : false);},
					},
					'select': {
						createElement: function() {const e = $CrE('select'); this.hasOwnProperty('data') && this.data.forEach((d) => {const o = $CrE('option'); o.innerText = d; e.appendChild(o)}); return e;},
						setValue: function(val) {Array.from(this.element.children).find((opt) => (opt.value === val)).selected = true;},
						getValue: function() {return this.element.value;},
					}
				}

				// initialize
				alertify.dialog('setpanel', function factory(){
					return {
						// The dialog startup function
						// This will be called each time the dialog is invoked
						// For example: alertify.myDialog( data );
						main:function(){
							// Split arguments
							let content, header, buttons, onsave, onreset, onclose;
							switch (arguments.length) {
								case 1:
									switch (typeof arguments[0]) {
										case 'string':
											content = arguments[0];
											break;
										case 'object':
											arguments[0].hasOwnProperty('content') && (content = arguments[0].content);
											arguments[0].hasOwnProperty('header')  && (header = arguments[0].header);
											arguments[0].hasOwnProperty('buttons') && (buttons = arguments[0].buttons);
											arguments[0].hasOwnProperty('onsave')  && (onsave = arguments[0].onsave);
											arguments[0].hasOwnProperty('onreset') && (onreset = arguments[0].onreset);
											arguments[0].hasOwnProperty('onclose') && (buttons = arguments[0].onclose);
											break;
										default:
											Err('Arguments invalid', 1);
									}
									break;
								case 2:
									content = arguments[0];
									header = arguments[1];
									break;
								case 3:
									content = arguments[0];
									header = arguments[1];
									buttons = buttons[2];
									break;
							}

							// Prepare dialog
							this.resizeTo('80%', '80%');
							content && this.setContent(content);
							header  && this.setHeader(header);
							onsave  && this.set('onsave', onsave);
							onreset && this.set('onreset', onreset);
							onclose && this.set('onclose', onclose);

							// Choose & show selected button groups
							const btnGroups = {
								// Close button only
								basic: [[1, 0]],

								// Save & reset button
								saver: [[0, 0], [1, 1]]
							};
							const group = btnGroups[buttons || 'basic'];
							const divs = ['auxiliary', 'primary'];
							divs.forEach((div) => {
								Array.from(this.elements.buttons[div].children).forEach((btn) => {
									btn.style.display = 'none';
								});
							});
							group.forEach((button) => {
								this.elements.buttons[divs[button[0]]].children[button[1]].style.display = '';
							});

							return this;
						},
						// The dialog setup function
						// This should return the dialog setup object ( buttons, focus and options overrides ).
						setup:function(){
							return {
								/* buttons collection */
								buttons:[{
									/* button label */
									text: '恢复到修改前',

									/*bind a keyboard key to the button */
									key: undefined,

									/* indicate if closing the dialog should trigger this button action */
									invokeOnClose: false,

									/* custom button class name  */
									className: alertify.defaults.theme.cancel,

									/* custom button attributes  */
									attrs: {},

									/* Defines the button scope, either primary (default) or auxiliary */
									scope:'auxiliary',

									/* The will conatin the button DOMElement once buttons are created */
									element: undefined
								},{
									/* button label */
									text: '关闭',

									/*bind a keyboard key to the button */
									key: undefined,

									/* indicate if closing the dialog should trigger this button action */
									invokeOnClose: true,

									/* custom button class name  */
									className: alertify.defaults.theme.ok,

									/* custom button attributes  */
									attrs: {},

									/* Defines the button scope, either primary (default) or auxiliary */
									scope:'primary',

									/* The will conatin the button DOMElement once buttons are created */
									element: undefined
								},{
									/* button label */
									text: '保存',

									/*bind a keyboard key to the button */
									key: undefined,

									/* indicate if closing the dialog should trigger this button action */
									invokeOnClose: false,

									/* custom button class name  */
									className: alertify.defaults.theme.ok,

									/* custom button attributes  */
									attrs: {},

									/* Defines the button scope, either primary (default) or auxiliary */
									scope:'primary',

									/* The will conatin the button DOMElement once buttons are created */
									element: undefined
								}],

								/* default focus */
								focus:{
									/* the element to receive default focus, has differnt meaning based on value type:
										number:     action button index.
										string:     querySelector to select from dialog body contents.
										function:   when invoked, should return the focus element.
										DOMElement: the focus element.
										object:     an object that implements .focus() and .select() functions.
									*/
									element: 0,

									/* indicates if the element should be selected on focus or not*/
									select: true

								},
								/* dialog options, these override the defaults */
								options: {
									title: 'Setting Panel',
									modal: true,
									basic: false,
									frameless: false,
									pinned: false,
									movable: true,
									moveBounded: false,
									resizable: true,
									autoReset: false,
									closable: true,
									closableByDimmer: true,
									maximizable: false,
									startMaximized: false,
									pinnable: false,
									transition: 'fade',
									padding: true,
									overflow: true,
									/*
									onshow:...,
									onclose:...,
									onfocus:...,
									onmove:...,
									onmoved:...,
									onresize:...,
									onresized:...,
									onmaximize:...,
									onmaximized:...,
									onrestore:...,
									onrestored:...
									*/
								}
							};
						},
						// This will be called once the dialog DOM has been created, just before its added to the document.
						// Its invoked only once.
						build:function(){

							// Do custom DOM manipulation here, accessible via this.elements

							// this.elements.root           ==> Root div
							// this.elements.dimmer         ==> Modal dimmer div
							// this.elements.modal          ==> Modal div (dialog wrapper)
							// this.elements.dialog         ==> Dialog div
							// this.elements.reset          ==> Array containing the tab reset anchor links
							// this.elements.reset[0]       ==> First reset element (button).
							// this.elements.reset[1]       ==> Second reset element (button).
							// this.elements.header         ==> Dialog header div
							// this.elements.body           ==> Dialog body div
							// this.elements.content        ==> Dialog body content div
							// this.elements.footer         ==> Dialog footer div
							// this.elements.resizeHandle   ==> Dialog resize handle div

							// Dialog commands (Pin/Maximize/Close)
							// this.elements.commands           ==> Object containing  dialog command buttons references
							// this.elements.commands.container ==> Root commands div
							// this.elements.commands.pin       ==> Pin command button
							// this.elements.commands.maximize  ==> Maximize command button
							// this.elements.commands.close     ==> Close command button

							// Dialog action buttons (Ok, cancel ... etc)
							// this.elements.buttons                ==>  Object containing  dialog action buttons references
							// this.elements.buttons.primary        ==>  Primary buttons div
							// this.elements.buttons.auxiliary      ==>  Auxiliary buttons div

							// Each created button will be saved with the button definition inside buttons collection
							// this.__internal.buttons[x].element

						},
						// This will be called each time the dialog is shown
						prepare:function(){
							// Do stuff that should be done every time the dialog is shown.
						},
						// This will be called each time an action button is clicked.
						callback:function(closeEvent){
							//The closeEvent has the following properties
							//
							// index: The index of the button triggering the event.
							// button: The button definition object.
							// cancel: When set true, prevent the dialog from closing.
							const myEvent = utils.deepClone(closeEvent);
							switch (closeEvent.index) {
								case 0: {
									// Reset button
									closeEvent.cancel = myEvent.cancel = true;
									myEvent.save = false;
									myEvent.reset = true;
									const onreset = this.get('onreset');
									typeof onreset === 'function' && onreset(myEvent);
									break;
								}
								case 1: {
									// Close button
									// Do something here if need
									break;
								}
								case 2: {
									// Save button
									closeEvent.cancel = myEvent.cancel = true;
									myEvent.save = true;
									myEvent.reset = false;
									const onsave = this.get('onsave');
									typeof onsave === 'function' && onsave(myEvent);
								}
							}
							myEvent.save && this.get('saver').call(this);
							myEvent.reset && this.get('reseter').call(this);
							closeEvent.cancel = myEvent.cancel;
						},
						// To make use of AlertifyJS settings API, group your custom settings into a settings object.
						settings:{
							onsave: function() {},
							onreset: function() {},
							options: [], // SettingOption array
							saver: function() {
								this.get('options').forEach(o => o.save());
							},
							reseter: function() {
								this.get('options').forEach(o => o.reset());
							}
						},
						// AlertifyJS will invoke this each time a settings value gets updated.
						settingUpdated:function(key, oldValue, newValue){
							// Use this to respond to specific setting updates.
							const _this = this;
							['onsave', 'onreset', 'saver', 'reseter'].includes(key) && check('function');
							['options'].includes(key) && check(Array);

							function rollback() {
								_this.set(key, oldValue);
							}

							function check(type) {
								valid(oldValue, type) && !valid(newValue, type) && rollback();
							}

							function valid(value, type) {
								return ({
									'string': () => (typeof value === type),
									'function': () => (value instanceof type)
								})[typeof type]();
							}
						},
						// listen to internal dialog events.
						hooks:{
							// triggered when the dialog is shown, this is seperate from user defined onshow
							onshow: function() {
								this.resizeTo('80%', '80%');
							},
							// triggered when the dialog is closed, this is seperate from user defined onclose
							onclose: function() {
								const onclose = this.get('onclose');
								typeof onclose === 'function' && onclose();
							},
							// triggered when a dialog option gets updated.
							// IMPORTANT: This will not be triggered for dialog custom settings updates ( use settingUpdated instead).
							onupdate: function() {
							}
						}
					}
				}, true);

				return {
					easyStorage,
					easySettings,
					SettingPanel,
					SettingOption,
					optionAvailable,
					isOption,
					registerElement,
				};

				// Storage management panel for structured data like [{prop1, prop2, ...}, ...]
				// details: {String path, String key, [title|panel],
				//     props: {'prop1': {type: 'string'/'number'/'time'/'boolean', name, [editable], [listeners], [styles], [oncreate]}}},
				//     operations: [{type: 'delete'/'edit', [text]}, ...]
				function easyStorage(details, CM) {
					!optionAvailable('storage') && register();

					const CONFIG = CM.Config;
					const panel = details.panel || new SettingPanel({
						buttons: 'saver',
						header: details.title || ''
					}, CM);

					const option = new SettingOption({ type: 'storage', data: { details, panel }, path: details.path }, CM);
					panel.alertifyBox.get('options').push(option);
					panel.appendTable(option.data.table);

					function register() {
						registerElement('storage', {
							createElement() {
								this.data = {...this.data};
								const panel = this.data.panel;
								const details = this.data.details;

								const colCount = Object.keys(details.props).length + details.operations.length;
								const table = new panel.PanelTable();
								this.data.table = table;
								makeHeader(this);

								return table.element;
							},
							setValue(val) {
								this.data.data = val;
								this.data.table.rows.slice().forEach(row => row.remove());
								makeHeader(this);
								makeRows(this, val);
							},
							getValue() {
								return this.data.data;
							}
						});

						function makeHeader(Option) {
							const panel = Option.data.panel;
							const table = Option.data.table;
							const details = Option.data.details;

							const colCount = Object.keys(details.props).length + details.operations.length;
							table.appendRow({
								blocks: [{
									isHeader: true,
									colSpan: colCount,
									innerText: details.title,
								}]
							});
							table.appendRow({
								blocks: [
									...Object.values(details.props).map(p => ({
										innerText: p.name,
										width: p.width || Math.floor(100 / colCount).toString() + '%',
										style: { 'text-align': 'center' }
									})),
									{ innerText: CONST.Text.Operations, colSpan: details.operations.length, style: { 'text-align': 'center' } },
								]
							});
						}

						function makeRows(Option, storageArr) {
							const panel = Option.data.panel;
							const table = Option.data.table;
							const details = Option.data.details;

							for (const item of storageArr) {
								const row = new panel.PanelRow();

								// Properties
								for (const [p, prop] of Object.entries(details.props)) {
									const block = new panel.PanelBlock({
										innerText: {
											string: v => v,
											number: v => v.toString(),
											time: v => utils.getTime(v),
											boolean: v => CONST.Text.Boolean[+v]
										}[prop.type](item[p]),
										style: { 'text-align': 'center', ...(prop.styles || {}) },
										listeners: (prop.listeners || []).map(listener => {
											const lis = [...listener];
											const func = lis[1];
											lis[1] = function() { func.apply(this, [item[details.key], ...arguments]); }
											return lis;
										})
									});
									typeof prop.oncreate === 'function' && prop.oncreate(item[details.key], block);
									row.appendBlock(block);
								}

								// Operations
								details.operations.map(op => $$CrE({
									tagName: 'span',
									props: { innerText: op.text || CONST.Text.Operation[op.type] },
									classes: [CommonStyle.ClassName.Button],
									listeners: [['click', e => {
										const items = Option.data.data;
										const index = items.findIndex(it => it[details.key] === item[details.key]);
										({
											delete: e => {
												items.splice(index, 1);
												row.remove();
												table.element.dispatchEvent(new Event('change'));
											},
											edit: e => { /* Edit function here */ console.log(`edit ${item[details.key]}`); },
											func: () => Option.data.data = op.func(e, items, index)
										})[op.type]();
									}]]
								})).forEach(span => row.appendBlock({ children: [span], style: { 'text-align': 'center' } }));

								table.appendRow(row);
							}
						}
					}
				}

				// Creates a simple SettingPanel in a few code (or append tables to given settingpanel)
				// details: {Array areas, [title, panel]} or area; area: {title, itmes: [{text, path, type}]}
				function easySettings(details, CM) {
					details = details.areas ? details : {areas: [details], title: details.title};
					const panel = details.panel || new SettingPanel({
						buttons: 'saver',
						header: details.title
					}, CM);

					for (const area of details.areas) {
						const table = new panel.PanelTable({
							rows: area.title ? [{
								blocks: [{
									isHeader: true,
									colSpan: 2,
									innerText: area.title,
								}]
							}] : []
						});
						for (const item of area.items) {
							const option = {};
							copyProps(item, option, ['type', 'path', 'checker', 'children']);
							table.appendRow({
								blocks: [{
									innerText: item.text
								}, {
									options: [option]
								}]
							});
						}
						panel.appendTable(table);
					}

					return panel;
				}

				// A table-based setting panel using alertify-js
				// For wenku8++ only version
				// Use 'new' keyword
				// Usage:
				/*
					var panel = new SettingPanel({
						buttons: 0,
						header: '',
						className: '',
						id: '',
						name: '',
						tables: [
							{
								className: '',
								id: '',
								name: '',
								rows: [
									{
										className: '',
										id: '',
										name: '',
										blocks: [
											{
												isHeader: false,
												width: '',
												height: '',
												innerHTML / innerText: ''
												colSpan: 1,
												rowSpan: 1,
												className: '',
												id: '',
												name: '',
												options: [SettingOption, ...]
												children: [HTMLElement, ...]
											},
											...
										]
									},
									...
								]
							},
							...
						]
					});
				*/
				function SettingPanel(details={}, CM=null) {
					const SP = this;
					SP.insertTable = insertTable;
					SP.appendTable = appendTable;
					SP.removeTable = removeTable;
					SP.remove = remove;
					SP.PanelTable = PanelTable;
					SP.PanelRow = PanelRow;
					SP.PanelBlock = PanelBlock;

					// <div> element
					const elm = $CrE('div');
					copyProps(details, elm, ['id', 'name', 'className']);
					elm.classList.add('settingpanel-container');

					// Make alerity box
					const box = SP.alertifyBox = alertify.setpanel({
						onsave: function() {
							alertify.notify(CONST.Text.Saved);
						},
						onreset: function() {
							alertify.notify(CONST.Text.Reset);
						},
						buttons: details.hasOwnProperty('buttons') ? details.buttons : 'basic'
					});
					clearChildNodes(box.elements.content);
					box.elements.content.appendChild(elm);
					box.elements.content.style.overflow = 'auto';
					box.setHeader(details.header);
					box.setting({
						maximizable: true,
						overflow: true
					});
					details.onclose && box.setting('onclose', details.onclose);
					!box.isOpen() && box.show();

					// Configure object
					let css='', usercss='';
					SP.element = elm;
					SP.tables = [];
					SP.length = 0;
					copyProps(details, SP, ['id', 'name']);
					Object.defineProperty(SP, 'css', {
						configurable: false,
						enumerable: true,
						get: function() {
							return css;
						},
						set: function(_css) {
							addStyle(_css, 'settingpanel-css');
							css = _css;
						}
					});
					Object.defineProperty(SP, 'usercss', {
						configurable: false,
						enumerable: true,
						get: function() {
							return usercss;
						},
						set: function(_usercss) {
							addStyle(_usercss, 'settingpanel-usercss');
							usercss = _usercss;
						}
					});
					SP.css = `.settingpanel-table {border-spacing: 0px; border-collapse: collapse; width: 100%; margin: 2em 0;} .settingpanel-block {border: 1px solid ${CommonStyle.Color.Text}; text-align: center; vertical-align: middle; padding: 3px; text-align: left;} .settingpanel-header {font-weight: bold;} td.settingpanel-block:nth-of-type(1):is(:not([colspan]),[colspan="1"]){width: 30%;}`;

					// Create tables
					if (details.tables) {
						for (const table of details.tables) {
							if (table instanceof PanelTable) {
								appendTable(table);
							} else {
								appendTable(new PanelTable(table));
							}
						}
					}

					// Insert a Panel-Row
					// Returns Panel object
					function insertTable(table, index) {
						// Insert table
						!(table instanceof PanelTable) && (table = new PanelTable(table));
						index < SP.length ? elm.insertBefore(table.element, elm.children[index]) : elm.appendChild(table.element);
						insertItem(SP.tables, table, index);
						table.id !== undefined && (SP.children[table.id] = table);
						SP.length++;

						// Set parent
						table.parent = SP;
					}

					// Append a Panel-Row
					// Returns Panel object
					function appendTable(table) {
						return insertTable(table, SP.length);
					}

					// Remove a Panel-Row
					// Returns Panel object
					function removeTable(index) {
						const table = SP.tables[index];
						SP.element.removeChild(table.element);
						removeItem(SP.rows, index);
						return SP;
					}

					// Remove itself from parentElement
					// Returns Panel object
					function remove() {
						SP.element.parentElement && SP.parentElement.removeChild(SP.element);
						return SP;
					}

					// Panel-Table object
					// Use 'new' keyword
					function PanelTable(details={}) {
						const PT = this;
						PT.insertRow = insertRow;
						PT.appendRow = appendRow;
						PT.removeRow = removeRow;
						PT.remove = remove

						// <table> element
						const elm = $CrE('table');
						copyProps(details, elm, ['id', 'name', 'className']);
						elm.classList.add('settingpanel-table');

						// Configure
						PT.element = elm;
						PT.rows = [];
						PT.length = 0;
						copyProps(details, PT, ['id', 'name']);

						// Append rows
						if (details.rows) {
							for (const row of details.rows) {
								if (row instanceof PanelRow) {
									insertRow(row);
								} else {
									insertRow(new PanelRow(row));
								}
							}
						}

						// Insert a Panel-Row
						// Returns Panel-Table object
						function insertRow(row, index) {
							// Insert row
							!(row instanceof PanelRow) && (row = new PanelRow(row));
							index < PT.length ? elm.insertBefore(row.element, elm.children[index]) : elm.appendChild(row.element);
							insertItem(PT.rows, row, index);
							PT.length++;

							// Set parent
							row.parent = PT;
							return PT;
						}

						// Append a Panel-Row
						// Returns Panel-Table object
						function appendRow(row) {
							return insertRow(row, PT.length);
						}

						// Remove a Panel-Row
						// Returns Panel-Table object
						function removeRow(index) {
							const row = PT.rows[index];
							PT.element.removeChild(row.element);
							removeItem(PT.rows, index);
							return PT;
						}

						// Remove itself from parentElement
						// Returns Panel-Table object
						function remove() {
							PT.parent instanceof SettingPanel && PT.parent.removeTable(PT.tables.indexOf(PT));
							return PT;
						}
					}

					// Panel-Row object
					// Use 'new' keyword
					function PanelRow(details={}) {
						const PR = this;
						PR.insertBlock = insertBlock;
						PR.appendBlock = appendBlock;
						PR.removeBlock = removeBlock;
						PR.remove = remove;

						// <tr> element
						const elm = $CrE('tr');
						copyProps(details, elm, ['id', 'name', 'className']);
						elm.classList.add('settingpanel-row');

						// Configure object
						PR.element = elm;
						PR.blocks = [];
						PR.length = 0;
						copyProps(details, PR, ['id', 'name']);

						// Append blocks
						if (details.blocks) {
							for (const block of details.blocks) {
								if (block instanceof PanelBlock) {
									appendBlock(block);
								} else {
									appendBlock(new PanelBlock(block));
								}
							}
						}

						// Insert a Panel-Block
						// Returns Panel-Row object
						function insertBlock(block, index) {
							// Insert block
							!(block instanceof PanelBlock) && (block = new PanelBlock(block));
							index < PR.length ? elm.insertBefore(block.element, elm.children[index]) : elm.appendChild(block.element);
							insertItem(PR.blocks, block, index);
							PR.length++;

							// Set parent
							block.parent = PR;
							return PR;
						};

						// Append a Panel-Block
						// Returns Panel-Row object
						function appendBlock(block) {
							return insertBlock(block, PR.length);
						}

						// Remove a Panel-Block
						// Returns Panel-Row object
						function removeBlock(index) {
							const block = PR.blocks[index];
							PR.element.removeChild(block.element);
							removeItem(PR.blocks, index);
							return PR;
						}

						// Remove itself from parent
						// Returns Panel-Row object
						function remove() {
							PR.parent instanceof PanelTable && PR.parent.removeRow(PR.parent.rows.indexOf(PR));
							return PR;
						}
					}

					// Panel-Block object
					// Use 'new' keyword
					function PanelBlock(details={}) {
						const PB = this;
						PB.remove = remove;

						// <td> element
						const elm = $CrE(details.isHeader ? 'th' : 'td');
						copyProps(details, elm, ['innerText', 'innerHTML', 'colSpan', 'rowSpan', 'id', 'name', 'className']);
						copyProps(details, elm.style, ['width', 'height']);
						details.style && copyProps(details.style, elm.style);
						elm.classList.add('settingpanel-block');
						details.isHeader && elm.classList.add('settingpanel-header');
						details.listeners && details.listeners.forEach(listener => $AEL(elm, ...listener))

						// Configure object
						PB.element = elm;
						copyProps(details, PB, ['id', 'name']);

						// Append to parent if need
						details.parent instanceof PanelRow && (PB.parent = details.parent.appendBlock(PB));

						// Append SettingOptions if exist
						if (details.options) {
							(CM ? details.options : details.options.filter(isOption)).map((o) => (isOption(o) ? o : new SettingOption(o, CM))).forEach(function(option) {
								SP.alertifyBox.get('options').push(option);
								elm.appendChild(option.element);
							});
						}

						// Append child elements if exist
						if (details.children) {
							for (const child of details.children) {
								elm.appendChild(child);
							}
						}

						// Remove itself from parent
						// Returns Panel-Block object
						function remove() {
							PB.parent instanceof PanelRow && PB.parent.removeBlock(PB.parent.blocks.indexOf(PB));
							return PB;
						}
					}

					function insertItem(arr, item, index) {
						arr.splice(index, 0, item);
						return arr;
					}
					function removeItem(arr, index) {
						arr.splice(index, 1);
						return arr;
					}
					function MakeReadonlyObj(val) {
						return isObject(val) ? new Proxy(val, {
							get: function(target, property, receiver) {
								return MakeReadonlyObj(target[property]);
							},
							set: function(target, property, value, receiver) {},
							has: function(target, prop) {}
						}) : val;

						function isObject(value) {
							return ['object', 'function'].includes(typeof value) && value !== null;
						}
					}
				}

				// details = {path='config path', type='config type', data='option data'}
				function SettingOption(details={}, CM) {
					const SO = this;
					SO.save = save;
					SO.reset = reset;

					// Initialize ConfigManager
					!CM && Err('SettingOption requires a ConfigManager instance');
					const CONFIG = CM.Config;

					// Get args
					const options = ['path', 'type', 'checker', 'data', 'autoSave'];
					copyProps(details, SO, options);

					// Get first available type if multiple types provided
					Array.isArray(SO.type) && (SO.type = SO.type.find((t) => (optionAvailable(t))));
					!optionAvailable(SO.type) && Err('Unsupported Panel-Option type: ' + details.type);

					// Create element
					const original_value = CM.getConfig(SO.path);
					const SOE = {
						create: SettingOptionElements[SO.type].createElement.bind(SO),
						get: SettingOptionElements[SO.type].getValue.bind(SO),
						set: v => SettingOptionElements[SO.type].setValue.call(SO, utils.deepClone(v)),
					}
					SO.element = SOE.create();
					SOE.set(original_value);

					// Bind change-checker-saver
					SO.element.addEventListener('change', function(e) {
						if (SO.checker) {
							if (SO.checker(e, SOE.get())) {
								SO.autoSave && save();
							} else {
								// Reset value
								reset();

								// Do some value-invalid reminding here
							}
						} else {
							SO.autoSave && save();
						}
					});

					function save() {
						CM.setConfig(SO.path, SOE.get());
					}

					function reset(save=false) {
						SOE.set(original_value);
						save && CM.setConfig(SO.path, original_value);
					}
				}

				// Check if an settingoption type available
				function optionAvailable(type) {
					return Object.keys(SettingOptionElements).includes(type);
				}

				// Register SettingOption element
				function registerElement(name, obj) {
					const formatOkay = typeof obj.createElement === 'function' && typeof obj.setValue === 'function' && typeof obj.getValue === 'function';
					const noConflict = !SettingOptionElements.hasOwnProperty(name);
					const okay = formatOkay && noConflict;
					okay && (SettingOptionElements[name] = obj);
					return okay;
				}

				function isOption(obj) {
					return obj instanceof SettingOption;
				}

				function clearChildNodes(elm) {[...elm.childNodes].forEach(el => el.remove());}
			}
		},

		// MouseTip
		{
			name: '鼠标提示框',
			description: '兼容与扩充文库自带的鼠标跟随提示框',
			id: 'mousetip',
			system: true,
			func: function() {
				let tipready = tipcheck();
				detectDom('head').then(head => addStyle('#tips {z-index: 10000;}', 'plus_mousetip'));
				tipscroll();
				tipiframe();
				const return_value = {
					get tipready() {return tipready},
					settip: settip,
					showtip: showtip,
					hidetip: hidetip
				};
				return return_value;

				// Check if tipobj is ready, if not, then make it
				function tipcheck() {
					DoLog('checking tipobj...');
					if (typeof unsafeWindow.tipobj === 'object' && unsafeWindow.tipobj !== null) {
						DoLog('tipobj ready');
						return true;
					} else {
						if (typeof(tipinit) === 'function') {
							unsafeWindow.tipinit();
							DoLog('tipinit executed');
							return true;
						} else {
							if (!$('a[href*="/themes/wenku8/theme.js"]')) {
								loadTipScript();
							} else {
								DoLog(LogLevel.Error, 'tip init error: theme script exist but tipobj and tipinit missing');
							}
							return false;
						}
					}

					async function loadTipScript() {
						const s = $CrE('script');
						s.src = `https://${location.host}/themes/wenku8/theme.js`;
						(await detectDom('head')).appendChild(s);

						$AEL(s, 'load', e => {
							tipready = true;
							if (document.readyState === 'loading') {
								// Wait for tipinit triggered
								$AEL(unsafeWindow, 'load', tipscroll);
							} else {
								// Too late, call tipinit manually
								unsafeWindow.tipinit();
								tipscroll();
							}
							DoLog('theme script loaded');
						});

						DoLog('theme script appended');
					}
				}

				// New tipobj movement method. Makes sure the tipobj stay close with the mouse.
				function tipscroll() {
					if (!tipready) {return false;}

					DoLog('tipscroll executed. ');
					unsafeWindow.tipobj.style.position = 'fixed';
				}

				function tipiframe() {
					$AEL(unsafeWindow, 'mousemove', tipmoveplus);
					return true;

					function tipmoveplus(e) {
						// Move
						if (unsafeWindow.tipobj) {
							unsafeWindow.tipobj.style.left = e.clientX + unsafeWindow.tipx + 'px';
							unsafeWindow.tipobj.style.top = e.clientY + unsafeWindow.tipy + 'px';
						}

						// Call parent
						if (unsafeWindow !== unsafeWindow.parent) {
							const parent = unsafeWindow.parent;
							const doc = parent.document;
							const iframe = [...$All(doc, 'iframe')].find(ifr => ifr.contentDocument === document);
							const clientRect = iframe.getClientRects()[0];
							const topevt = new CustomEvent('mousemove');
							topevt.clientX = clientRect.left + e.clientX;
							topevt.clientY = clientRect.top + e.clientY;
							parent.dispatchEvent(topevt);
						}
					}
				}

				// show & hide tip when mouse in & out. accepts tip as a string or a function that returns the tip string
				function settip(elm, tip) {
					elm[{'string': 'tiptitle', 'function': 'tipgetter'}[typeof(tip)]] = tip;
					elm.removeEventListener('mouseover', showtip);
					elm.removeEventListener('mouseout', hidetip);
					$AEL(elm, 'mouseover', showtip, {capture: true});
					$AEL(elm, 'mouseout', hidetip, {capture: true});
				}

				function showtip(e) {
					if (!tipready) {return false;}

					switch (typeof e) {
						case 'object': {
							if (e[Symbol.toStringTag] === 'MouseEvent') {
								const elm = e.currentTarget;
								if (elm.tiptitle || elm.tipgetter) {
									const tip = elm.tiptitle || elm.tipgetter();
									tipready && unsafeWindow.tipshow(tip);
								}
							}
							break;
						}
						case 'string': {
							unsafeWindow.tipshow(e);
							break;
						}
					}
				}

				function hidetip() {
					tipready && unsafeWindow.tiphide();
				}
			}
		},

		// AndriodAPI
		{
			name: '安卓API',
			description: '文库安卓API，用于获取网页端没有的资源',
			id: 'AndroidAPI',
			system: true,
			checker: {
				type: 'switch',
				value: false
			},
			func: function() {
				return new AndroidAPI();

				// Android API set
				function AndroidAPI() {
					const AA = this;
					const DParser = new DOMParser();

					const encode = AA.encode = function(str) {
						return '&appver=1.13&request=' + btoa(str) + '&timetoken=' + (new Date().getTime());
					};

					const request = AA.request = function(details) {
						const url = details.url;
						const type = details.type || 'text';
						const callback = details.callback || function() {};
						const args = details.args || [];
						GM_xmlhttpRequest({
							method: 'POST',
							url: 'http://app.wenku8.com/android.php',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; unknown Build/NZH54D)'
							},
							data: encode(url),
							onload: function(e) {
								let result;
								switch (type) {
									case 'xml':
										result = DParser.parseFromString(e.responseText, 'text/xml');
										break;
									case 'text':
										result = e.responseText;
										break;
								}
								callback.apply(null, [result].concat(args));
							},
							onerror: function(e) {
								Err('Request error while requesting "' + url + '"');
							}
						});
					};

					// aid, lang, callback, args
					AA.getNovelShortInfo = function(details) {
						const aid = details.aid;
						const lang = details.lang;
						const callback = details.callback || function() {};
						const args = details.args || [];
						const url = 'action=book&do=info&aid=' + aid + '&t=' + lang;
						request({
							url: url,
							callback: callback,
							args: args,
							type: 'xml'
						});
					}

					// aid, lang, callback, args
					AA.getNovelIndex = function(details) {
						const aid = details.aid;
						const lang = details.lang;
						const callback = details.callback || function() {};
						const args = details.args || [];
						const url = 'action=book&do=list&aid=' + aid + '&t=' + lang;
						request({
							url: url,
							callback: callback,
							args: args,
							type: 'xml'
						});
					};

					// aid, cid, lang, callback, args
					AA.getNovelContent = function(details) {
						const aid = details.aid;
						const cid = details.cid;
						const lang = details.lang;
						const callback = details.callback || function() {};
						const args = details.args || [];
						const url = 'action=book&do=text&aid=' + aid + '&cid=' + cid + '&t=' + lang;
						request({
							url: url,
							callback: callback,
							args: args,
							type: 'text'
						});
					};

					// Requires user logged in with AndroidAPI, which is not implemented yet
					AA.getUserInfo = function(details) {
						const callback = details.callback || function() {};
						const args = details.args || [];
						const url = 'action=userinfo';
						request({
							url: url,
							callback: callback,
							args: args,
							type: 'xml'
						});
					}
				}
			}
		},

		// Settings
		{
			name: '设置',
			description: '基本组件 - 设置',
			id: 'settings',
			system: true,
			CONST: {
				Number: {
					GFScriptID: 416310,
				},
				Text: {
					SettingsOfUserscript: '脚本自身设置',
					SettingsOfFunctions: '脚本功能设置',
					ScriptVersion: '版本号',
					CheckUpdate: '检查更新',
					ClickMeToCheck: '点我检查更新',
					ExportDebugInfo: '导出调试包',
					ExportConfig: '导出配置',
					ImportConfig: '导入配置',
					ClickMeToExport: '点我导出',
					ClickMeToImport: '点我导入',
					ImportSuccess: '导入成功',
					ImportFailed: '导入失败，错误码: {ErrorCode}',
					Settings: '设置',
					Function: '功能',
					Operation: '操作',
					ShowSystemFuncs: '显示系统组件',
					HideSystemFuncs: '隐藏系统组件',
					SystemFunc: '[系统组件]',
					NonSystemFunc: '[功能模块]',
					DisableFunction: '停用此功能',
					FunctionDisabled: '功能 {FuncName} 已停用',
					EnableFunction: '启用此功能',
					FunctionEnabled: '功能 {FuncName} 已启用',
					FunctionManagement: '管理此功能',
					FunctionSettings: '功能设置',
					RememberSaving: '修改设置/恢复设置后记得点击保存哦:)',
					NoSetting: '此功能没有设置项！',
					FunctionDetail: '<span class="{CT}">名称：</span><span data-key="name"></span></br> <span class="{CT}">描述：</span><span data-key="description"></span></br> <span class="{CT}">ID：</span><span data-key="id"></span></br> <span class="{CT}">系统组件：</span><span data-key="system" use-false-while-empty></span></br> <span class="{CT}">是否已启用：</span><span data-key="enabled"></span></br> ',
					FunctionDetail_EmptyItem: '无',
					Boolean: {
						'true': '是',
						'false': '否'
					},
					ManageWindow: {
						Header: '功能管理',
						EnableTitle: '启用',
						StorageTitle: '存储',
						Save: '保存',
						Reload: '重新载入',
						Export: '导出配置',
						Import: '导入配置',
						Reset: '恢复出厂配置',
						SystemFunc: '[系统组件]',
						NonSystemFunc: '[功能模块]',
						SysAlert: '系统组件的配置仅供查看',
						StorageAlert: '注意：大多数功能的设置都可以通过[功能设置]（而不是这里的[管理此功能]）进行直观的修改，需要直接在此处进行的手动修改几乎不存在！直接修改功能模块的配置存储很有可能会导致未知的错误，除非你明确的知道你要改什么，否则就不要修改！</br>确定仍然要进行手动修改？',
						StorageSaved: '配置存储已保存',
						StorageEdit: '启用编辑',
						StorageFormatError: '配置存储格式不正确，请检查修正后再保存',
						StorageResetConfirm: '真的要恢复出厂配置吗？</br>如果恢复出厂配置，所有此功能的用户设置都需要重新手动设置。</br>此功能一般用于排除bug，建议您先导出配置进行备份后再恢复出厂配置，并且推荐您在恢复出厂配置后对相关页面先刷新再使用。'
					},
					CheckingUpdate: `${GM_info.script.name}: 正在检查更新...`,
					UpdateFound: {
						Main: `${GM_info.script.name}: 有新版本啦！`,
						View: '[点击 查看 更新]',
						Install: '[点击 安装 更新]'
					},
					UpdateInfo: {
						Header: `${GM_info.script.name} v{version}`,
						Install: '安装',
						Close: '关闭'
					}
				},
				Faicon: {
					Info: 'fa-solid fa-circle-info'
				},
				CSS: {
					Common: '.plus_system:not(.plus_system_show) {display: none;}',
					Manager: '.plus_func_dialog:not(#a) {height: 80vh;min-width: 80vw;}.plus_func_titleblock {display: flex;}.plus_func_icon {height: 50px;}.plus_func_namearea {flex-grow: 1;position: relative;margin-left: 10px;display: flex;flex-direction: column;}.plus_func_nameline {}.plus_func_nameline>* {margin-right: 5px;}.plus_func_name {font-size: 30px;}.plus_func_version {font-size: 20px;}.plus_func_system {font-size: 10px;}.plus_func_descline {font-size: 10px;position: absolute;bottom: 0;}.plus_func_descline>* {margin-right: 3px;}.plus_func_sysalert {margin-top: 5px;color: #f66a13;background-color: #f5eba4;font-size: 15px;line-height: 23px;text-align: center;}.plus_func_block {margin-top: 5px;border-top: 1px solid lightgrey;display: flex;}.plus_func_blocktitle {padding: 1em;text-align: left;vertical-align: top;display: table-cell;width: calc(50px - 2em);}.plus_func_blockcontent {padding: 1em 0;text-align: left;vertical-align: top;display: table-cell;flex-grow: 1;}.plus_func_block [disabled] {cursor: not-allowed;}.plus_func_storageeditor {width: 100%;height: 300px;resize: vertical;}.plus_func_storagebuttons {margin-top: 5px;}.plus_func_storagebuttons>* {margin-right: 10px;padding: 1px 10px;}.plus_func_editlabel {float: right;margin: unset;padding: unset;}.plus_func_editcheckbox {vertical-align: middle;margin-right: 0.3em;}.plus_func_edittext {vertical-align: middle;}'
				},
				Resouces: {
					DefaultIcon: {
						type: 'image',
						value: 'data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD/igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//rlB//3HaP/858P//OfD//znw//858P//OfD//znw//858P//OfD//zitv/91Y///dWP//3Vj//9y3X//cdo//3HaP/9x2j//cdo//zitv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//znw//858P//OfD//znw//9x2j//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6cN//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//3ZnP//ogD//6IA//+iAP//ogD//sJb//3HaP/83qn//OfD//zeqf//pw3//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+rGv/90IL//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//cdo//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//OfD//znw//858P//OfD//znw//858P//6IA//+iAP/84rb//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//rQ0//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//3Vj//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//6wJ///ogD//6sa//3HaP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//+iAP//ogD//rQ0//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//zitv/+vk7//6IA//+iAP//ogD//6IA//+iAP/+tDT//OfD//znw//858P//OfD//znw//858P//rAn//+iAP//ogD//ct1//3HaP/+tDT//rQ0//6+Tv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//ct1//7CW///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//65Qf//ogD//6IA//3HaP/9x2j//6cN//+iAP//ogD//r5O//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//60NP/9x2j//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//OfD//65Qf//ogD//6cN//znw//858P//6IA//+iAP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP/858P//cdo//+iAP//ogD//dWP//3Vj///pw3//6IA//7CW//858P//rQ0//+iAP/92Zz//OfD//3Ldf/+tDT//OK2//znw//858P//N6p//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//7CW///ogD//6IA//6+Tv//ogD//6IA//6+Tv/91Y///6IA//+iAP/+vk7//OfD//+iAP//ogD//6IA//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//dWP//+iAP//ogD//6IA//+iAP//ogD//OK2//+rGv//ogD//6IA//3ZnP/858P//6IA//+iAP//qxr//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//sJb//+iAP//pw3//rQ0//+iAP//ogD//OfD//znw//+wlv//6IA//+iAP//ogD//6cN//3ZnP/+vk7//6IA//+iAP/90IL//OfD//60NP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//84rb//rAn//+iAP//ogD//6IA//+iAP/+sCf//rQ0//+iAP//ogD//6IA//+iAP/9x2j//OfD//65Qf//ogD//rAn//znw//858P//rQ0//+iAP/+uUH//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//r5O//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/9x2j//6IA//+iAP/9x2j//OfD//6+Tv//ogD//6IA//znw//84rb//6IA//+iAP/84rb//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//+nDf//ogD//6cN//60NP/+vk7//ct1//znw//+wlv//6IA//+iAP/858P//OK2//+iAP//ogD//dmc//znw///pw3//6IA//6wJ//83qn//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//+iAP//ogD//dmc//znw//858P//OfD//znw///pw3//6IA//+nDf/83qn//dmc//+nDf//ogD//6sa//znw//92Zz//6IA//+iAP/858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//N6p//3HaP/+sCf//6IA//+iAP//ogD//6IA//+iAP//qxr//dmc//3ZnP//pw3//6IA//6+Tv/858P//dmc//+iAP//ogD//OfD//znw//9x2j//sJb//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/+vk7//OfD//znw//91Y///OK2//znw//858P//dWP//3Vj//9x2j//rlB//+nDf//pw3//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//3Ldf//ogD//6IA//+iAP//ogD//6IA//60NP/+tDT//cdo//zitv/+tDT//rQ0//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/83qn//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//dmc//+iAP/+sCf//OfD//znw//858P//dWP//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//zeqf/858P//OfD//znw//858P//rQ0//60NP/+tDT//rQ0//60NP/9x2j//cdo//3HaP/91Y///dWP//zeqf/858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
						crossOrigin: false,
					},
				},
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						//'config-key': {},
						lastupdate: '0000-00-00',
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				}
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const SPanel = require('SidePanel');
				const SettingPanel = require('SettingPanel');
				const mousetip = require('mousetip');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				const UFManager = new UserFunctionManager();
				SPanel.insert({
					index: 1,
					faicon: 'fa-solid fa-gear',
					tip: CONST.Text.Settings,
					onclick: UFManager.show
				});

				return {checkUpdate, userCheckUpdate};

				// Module manager user interface
				function UserFunctionManager() {
					const UMM = this;
					const moduleSettingFuncs = {};
					UMM.showing = false;

					initWindow();

					UMM.show = show;
					UMM.showFuncSettings = showFuncSettings;

					function show() {
						//box.set('message', 'No implemented yet!').show();
						if (UMM.showing) {return false;}

						const functions = FL_listFunctions();

						// Make panel
						const SetPanel = new SettingPanel.SettingPanel({
							header: CONST.Text.Settings,
							tables: [],
							onclose: e => UMM.showing = false
						});
						UMM.showing = true;

						// Title - Userscript Settings
						SetPanel.element.appendChild($$CrE({
							tagName: 'h1',
							props: { innerText: CONST.Text.SettingsOfUserscript }
						}));

						SetPanel.appendTable({
							rows: [{
								blocks: [{
									innerText: CONST.Text.ScriptVersion
								}, {
									innerText: `v${GM_info.script.version}`
								}]
							}, {
								blocks: [{
									innerText: CONST.Text.CheckUpdate
								}, {
									innerText: CONST.Text.ClickMeToCheck,
									style: { cursor: 'pointer' },
									listeners: [['click', e => userCheckUpdate()]]
								}]
							}, {
								blocks: [{
									innerText: CONST.Text.ExportDebugInfo
								}, {
									innerText: CONST.Text.ClickMeToExport,
									style: { cursor: 'pointer' },
									listeners: [['click', e => {
										utils.downloadText(JSON.stringify({
											version: GM_info.script.version,
											GM_info: GM_info,
											platform: navigator.platform,
											userAgent: navigator.userAgent,
											time: new Date().getTime(),
											debug: FL_getDebug()
										}), `${GM_info.script.name}-debug.json`);
									}]]
								}]
							}, {
								blocks: [{
									innerText: CONST.Text.ExportConfig
								}, {
									innerText: CONST.Text.ClickMeToExport,
									style: { cursor: 'pointer' },
									listeners: [['click', e => FL_exportConfig()]]
								}]
							}, {
								blocks: [{
									innerText: CONST.Text.ImportConfig
								}, {
									innerText: CONST.Text.ClickMeToImport,
									style: { cursor: 'pointer' },
									listeners: [['click', e => FL_importConfig(err => {
										if (!err) {
											// err === 0
											alertify.success(CONST.Text.ImportSuccess);
										} else {
											// err > 0
											alertify.error(replaceText(CONST.Text.ImportFailed, { '{ErrorCode}': err }));
										}
									})]]
								}]
							}]
						});

						// Title - Function Manager
						SetPanel.element.appendChild($$CrE({
							tagName: 'h1',
							props: { innerText: CONST.Text.SettingsOfFunctions }
						}));

						// Make table
						const table = new SetPanel.PanelTable({});

						// Make header
						table.appendRow({
							blocks: [{
								isHeader: true,
								colSpan: 1,
								width: '70%',
								style: {'text-align': 'center'},
								innerText: CONST.Text.Function,
							},{
								isHeader: true,
								colSpan: 3,
								width: '30%',
								style: {'text-align': 'center'},
								innerText: CONST.Text.Operation,
							}]
						});

						// Make module rows
						// get all funcs
						const funcs = functions.map(id => FL_getFunction(id));
						// insert system funcs into the ending
						funcs.filter(f => f.system).forEach(f => funcs.push(funcs.splice(funcs.indexOf(f), 1)[0]));
						// insert those funcs with settings into the beginning
						funcs.filter(f => f.setting).forEach(f => funcs.splice(funcs.findIndex(f => !f.setting), 0, ...funcs.splice(funcs.indexOf(f), 1)));
						for (const func of funcs) {
							const id = func.id;
							/*
							const btnEnable = makeBtn({
								text: CONST.Text.EnableFunction,
								onclick: function (e) {
									FL_enableFunction(id);
									enableBtn(btnDisable);
									disableBtn(btnEnable);
								},
								disabled: func.enabled,
								alt: CONST.Text.FunctionEnabled
							});
							const btnDisable = makeBtn({
								text: CONST.Text.DisableFunction,
								onclick: function(e) {
									FL_disableFunction(id);
									enableBtn(btnEnable);
									disableBtn(btnDisable);
								},
								disabled: !func.enabled,
								alt: CONST.Text.FunctionDisabled
							});
							*/
							const btnManage = makeBtn({
								text: CONST.Text.FunctionManagement,
								onclick: function(e) {
									return manageFunc(id);
								}
							});
							const btnSetting = makeBtn({
								text: CONST.Text.FunctionSettings,
								onclick: function(e) {
									return showFuncSettings(id) ? 0 : 1;
								},
								disabled: typeof func.setting !== 'function',
								alt: [CONST.Text.RememberSaving, CONST.Text.NoSetting]
							});
							const row = new SetPanel.PanelRow({
								blocks: [
									// Function info
									{
										colSpan: 1,
										rowSpan: 1,
										children: [
											(() => {
												const icon = $CrE('i');
												icon.className = CONST.Faicon.Info;
												icon.style.marginRight = '0.5em';
												icon.classList.add(CommonStyle.ClassName.Text);

												tippy(icon, {
													content: makeContent(),
													theme: 'wenku_tip',
													onTrigger: (instance, event) => {
														instance.setContent(makeContent());
													}
												});
												return icon;

												function makeContent() {
													const func = FL_getFunction(id);
													const tip = $CrE('div');
													tip.innerHTML = replaceText(CONST.Text.FunctionDetail, {'{CT}': CommonStyle.ClassName.TextLight, '{CB}': CommonStyle.ClassName.Button});
													[...tip.children].forEach((elm) => {
														const name = elm.dataset.key;
														if (name) {
															const value = func.hasOwnProperty(name) ? func[name] : (elm.hasAttribute('use-false-while-empty') ? false : CONST.Text.FunctionDetail_EmptyItem);
															elm.innerText = ({
																string: (s) => (s),
																boolean: (b) => (CONST.Text.Boolean[b.toString()]),
															})[typeof value](value);
														}
													});

													return tip;
												}
											}) (),
											(() => {
												const span = $CrE('span');
												span.innerText = func.system ? CONST.Text.SystemFunc : CONST.Text.NonSystemFunc;
												span.style.marginRight = '0.5em';
												return span;
											}) (),
											(() => {
												const span = $CrE('span');
												span.innerText = func.name;
												return span;
											}) (),
										],
									},

									/*
									// Enable function
									{
										colSpan: 1,
										rowSpan: 1,
										width: '15%',
										style: {'text-align': 'center'},
										children: [btnEnable]
									},

									// Diable function
									{
										colSpan: 1,
										rowSpan: 1,
										width: '15%',
										style: {'text-align': 'center'},
										children: [btnDisable]
									},
									*/

									// Module management
									{
										colSpan: 1,
										rowSpan: 1,
										width: '15%',
										style: {'text-align': 'center'},
										children: [btnManage],
									},

									// Module settings
									{
										colSpan: 1,
										rowSpan: 1,
										width: '15%',
										style: {'text-align': 'center'},
										children: [btnSetting]
									}
								]
							});

							// Only show non-system functions by default
							func.system && row.element.classList.add('plus_system');

							// Append to table
							table.appendRow(row);
						}

						// row to show/hide system funcs
						const sysBtn = {
							icon: (() => {
								const icon = $$CrE({
									tagName: 'i',
									classes: ['fa-solid', 'fa-angle-down', CommonStyle.ClassName.Text],
									styles: {
										'margin-right': '0.5em'
									}
								});
								return icon;
							}) (),
							span: (() => {
								const span = $$CrE({
									tagName: 'span',
									props: {
										innerText: CONST.Text.ShowSystemFuncs
									}
								});
								return span;
							}) ()
						}
						const sysrow = new SetPanel.PanelRow({
							blocks: [
								{
									colSpan: 3,
									rowSpan: 1,
									children: [sysBtn.icon, sysBtn.span]
								}
							]
						});
						$AEL(sysrow.element, 'click', (function() {
							let show = false;
							return function(e) {
								// Change icon
								const [rm, add] = show ? ['fa-angle-up', 'fa-angle-down'] : ['fa-angle-down', 'fa-angle-up'];
								sysBtn.icon.classList.remove(rm);
								sysBtn.icon.classList.add(add);

								// Change text
								sysBtn.span.innerText = show ? CONST.Text.ShowSystemFuncs : CONST.Text.HideSystemFuncs;

								// Show / Hide
								[...$All('.plus_system')].forEach(tr => {
									(show ? tr.classList.remove : tr.classList.add).call(tr.classList, 'plus_system_show');
								});

								// Reverse flag
								show = !show;
							}
						}) ());
						sysrow.element.classList.add(CommonStyle.ClassName.Button);
						table.appendRow(sysrow);

						// Append table
						SetPanel.appendTable(table);

						function makeBtn(details) {
							// Get arguments
							let text, onclick, disabled, alt;
							text = details.text;
							onclick = details.onclick;
							disabled = details.disabled;
							alt = details.alt;

							const span = $CrE('span');
							span.innerText = text;
							onclick && span.addEventListener('click', _onclick);
							span.classList.add(CommonStyle.ClassName.Button);
							disabled && span.classList.add(CommonStyle.ClassName.Disabled);
							span.disabled = disabled;

							return span;

							function _onclick() {
								const disabled = span.disabled;
								const result = !disabled && onclick ? onclick.call(this, arguments) : 0;
								const alt_content = alt && (Array.isArray(alt) ? alt[result] : alt);
								!disabled && ![null, false].includes(result) && alt_content && alertify.message(alt_content);
							}
						}

						function disableBtn(span) {
							span.disabled = true;
							span.classList.add(CommonStyle.ClassName.Disabled);
						}

						function enableBtn(span) {
							span.disabled = false;
							span.classList.remove(CommonStyle.ClassName.Disabled);
						}
					}

					function showFuncSettings(id) {
						const setter = FL_getFunction(id).setting;
						if (typeof setter === 'function') {
							FL_loadSetting(id);
							return true;
						} else {
							return false;
						}
					}

					function manageFunc(idorfunc) {
						// Make panel
						//alertify.alert('not implemented yet!');
						const [id, func] = isWenkuFunction(idorfunc) ? [idorfunc.id, idorfunc] : [idorfunc, FL_getFunction(idorfunc)];
						alertify.funcmanager(func);
					}

					function initWindow() {
                        detectDom('head').then(head => {
                            addStyle(CONST.CSS.Common, 'plus-settings-common');
                            addStyle(CONST.CSS.Manager, 'plus-settings-manager');
                        });
						/*!alertify.installer && alertify.dialog('installer', function() {
							return{
								main: function(){
									let content, oninstall, oncancel;
									switch (arguments.length) {
										case 1: {
											const val = arguments[0];
											if (typeof val === 'object' && !(val instanceof HTMLElement)) {
												content = val.content;
												oninstall = val.oninstall;
												oncancel = val.oncancel;
											} else if (typeof val === 'string' || val instanceof HTMLElement) {
												[content] = arguments;
											} else {
												Err('Invalid argument type', 1);
											}
											break;
										}
										case 2:
											[content, oninstall] = arguments;
											break;
										case 3:
											[content, oninstall, oncancel] = arguments;
											break;
										default:
											Err('Invalid argument length', 1);
									}
									this.set('content', content);
									this.set('oninstall', oninstall);
									this.set('oncancel', oncancel);
								},
								setup: function(){
									return {
										buttons:[{
											text: CONST.Text.Cancel,
											scope: 'auxiliary',
											action: 'cancel', // This is a custom attribute
											key: 27 // Esc
										}, {
											text: CONST.Text.InstallModule,
											scope: 'primary',
											action: 'install', // This is a custom attribute
											key: 65 // Enter
										}],
										focus: {element: 0}
									};
								},
								prepare: function(){
									this.setContent(this.get('content'));
								},
								callback: function(closeEvent) {
									const listenerName = 'on' + closeEvent.button.action;
									const listener = this.get(listenerName);
									return typeof listener === 'function' ? listener(closeEvent) : true;
								},
								settings: {
									content: undefined,
									oninstall: undefined,
									oncancel: undefined
								}
							}
						}, true);*/
						/* 窗口设计
						参照Tampermonky设置界面，每一个大功能设置分类就一个块，从上到下罗列开来
						--------------------
						||图标|  名称.版本  ||
						||图标|    描述    ||
						--------------------
						| 启用 | [ ]        |
						--------------------
						|     |------------|
						| 存  ||    JS    ||
						| 储  ||    ON    ||
						|     |------------|
						--------------------

						*/
						!alertify.funcmanager && alertify.dialog('funcmanager', function() {
							return {
								// Accept every alertify.funcmanager call
								main: function(func) {
									const elements = this.elements;
									this.func = func;

									// Icon
									const icon = func.icon || {type: 'image', value: GM_info.script.icon};
									switch (icon.type) {
										case 'image': {
											const img = $$CrE({
												tagName: 'img',
												props: {
													src: icon.value,
												},
												classes: 'plus_func_icon'
											});
											[...elements.iconarea.children].forEach(n => n.remove())
											elements.iconarea.appendChild(img);
											break;
										}
										case 'faicon': {
											const i = $$CrE({
												tagName: 'i',
												classes: icon.value
											});
											[...elements.iconarea.children].forEach(n => n.remove())
											elements.iconarea.appendChild(i);
										}
									}

									// Name
									elements.name.innerText = func.name;

									// System
									elements.system.innerText = func.system ? CONST.Text.ManageWindow.SystemFunc : CONST.Text.ManageWindow.NonSystemFunc;

									// Version
									elements.version.innerText = `v${func.version || '0.1'}`;

									// Description
									elements.description.innerText = func.description || `功能：${func.name}`;

									// System alert
									elements.sysalert.style.display = func.system ? '' : 'none';

									// Enable
									const enable = elements.enablecheckbox;
									enable.checked = func.enabled;
									enable.disabled = func.system;

									// Storage
									const editor = elements.storageeditor;
									editor.value = vkbeautify.json(func.storage, 2);
									editor.disabled = true;

									// Stoarge buttons
									elements.storagesave.disabled = true;
									elements.storagereload.disabled = false;
									elements.storageexport.disabled = false;
									elements.storageimport.disabled = true;
									elements.storageedit.checked = false;
									elements.storageedit.disabled = func.system;
									elements.storageeditlabel.style.display = func.system ? 'none' : '';
								},

								// Custom buttons
								setup: function() {
									return {
										buttons: [{
											text: '确认',
											key: 27, // esc, see https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode#%E9%94%AE%E7%A0%81%E5%80%BC
											invokeOnClose: true,
											className: alertify.defaults.theme.ok,
											scope: 'primary'
										}],
										focus: {
											element: 0,
											select: true
										}
									}
								},

								// Build standard function manager dom structure
								build: function() {
									const _this = this;
									const elements = this.elements;
									const container = elements.content;

									// Dialog
									elements.dialog.classList.add('plus_func_dialog');

									// Header
									elements.header.innerText = CONST.Text.ManageWindow.Header;

									// Title area
									const titleblock = elements.titleblock = $$CrE({
										tagName: 'div',
										styles: {
											'border-width': '5px 0 0 0',
										}
									});
									titleblock.classList.add('plus_func_titleblock');
									container.appendChild(titleblock);

									// Icon
									const iconarea = elements.iconarea = $CrE('div');
									titleblock.appendChild(iconarea);

									// Name area
									const namearea = elements.namearea = $CrE('div');
									namearea.classList.add('plus_func_namearea');
									titleblock.appendChild(namearea);

									// Name line
									const nameline = $CrE('div');
									nameline.classList.add('plus_func_nameline');
									namearea.appendChild(nameline);

									// Name
									const name = elements.name = $CrE('span');
									name.classList.add('plus_func_name');
									nameline.appendChild(name);

									// Version
									const version = elements.version = $CrE('span');
									version.classList.add('plus_func_version');
									nameline.appendChild(version);

									// Description line
									const descline = $CrE('div');
									descline.classList.add('plus_func_descline');
									namearea.appendChild(descline);

									// System
									const system = elements.system = $CrE('span');
									system.classList.add('plus_func_system');
									descline.appendChild(system);

									// Description
									const description = elements.description = $CrE('span');
									description.classList.add('plus_func_description');
									descline.appendChild(description);

									// System alert
									const sysalert = elements.sysalert = $CrE('div');
									sysalert.innerText = CONST.Text.ManageWindow.SysAlert;
									sysalert.classList.add('plus_func_sysalert');
									container.appendChild(sysalert);

									// Enable block
									const enableblock = elements.enableblock = $CrE('div');
									enableblock.classList.add('plus_func_block');
									container.appendChild(enableblock);

									// Enable title
									const enabletitle = elements.enabletitle = $$CrE({
										tagName: 'div',
										props: {
											innerText: CONST.Text.ManageWindow.EnableTitle
										},
										classes: 'plus_func_blocktitle'
									});
									enableblock.appendChild(enabletitle);

									// Enable centent
									const enablecontent = elements.enablecontent = $$CrE({
										tagName: 'div',
										classes: 'plus_func_blockcontent'
									});
									enableblock.appendChild(enablecontent);

									// Enable checkbox
									const enablecheckbox = elements.enablecheckbox = $$CrE({
										tagName: 'input',
										props: {
											type: 'checkbox',
										},
										classes: 'plus_func_enablecheckbox',
										listeners: [['change', function(e) {
											_this.func.enabled = enablecheckbox.checked;
											alertify.success(replaceText(enablecheckbox.checked ? CONST.Text.FunctionEnabled : CONST.Text.FunctionDisabled, {'{FuncName}': _this.func.name}));
										}]]
									});
									enablecontent.appendChild(enablecheckbox);

									// Storage block
									const storageblock = elements.storageblock = $CrE('div');
									storageblock.classList.add('plus_func_block');
									container.appendChild(storageblock);

									// Storage title
									const storagetitle = elements.storagetitle = $$CrE({
										tagName: 'div',
										props: {
											innerText: CONST.Text.ManageWindow.StorageTitle
										},
										classes: 'plus_func_blocktitle'
									});
									storageblock.appendChild(storagetitle);

									// Storage content
									const storagecontent = elements.storagecontent = $$CrE({
										tagName: 'div',
										classes: 'plus_func_blockcontent',
										/*listeners: [['click', function(e) {
											// storageeditor cannot listen mouse click events while it's disabled
											if (e.target === storageeditor && storageeditor.disabled && !_this.func.system) {
												alertify.confirm(CONST.Text.ManageWindow.Header, CONST.Text.ManageWindow.StorageAlert, function() {
													storageeditor.disabled = false;
													//storageeditor.focus() // Do not focus directly, no focus will gain!
													setTimeout(e => storageeditor.focus(), 0); // focus with a setTimeout is okay
													storageedit.checked = true;
												}, e => {});
											}
										}]]*/
									});
									storageblock.appendChild(storagecontent);

									// Storage editor
									const storageeditor = elements.storageeditor = $$CrE({
										tagName: 'textarea',
										prop: {
											disabled: true
										},
										classes: 'plus_func_storageeditor'
									});
									storagecontent.appendChild(storageeditor);

									// Storage buttons
									const storagebuttons = elements.storagebuttons = $$CrE({
										tagName: 'div',
										classes: 'plus_func_storagebuttons'
									});
									storagecontent.appendChild(storagebuttons);

									// Storage save button
									const storagesave = elements.storagesave = $$CrE({
										tagName: 'button',
										props: {
											innerText: CONST.Text.ManageWindow.Save
										},
										classes: 'plus_func_storagesave',
										listeners: [['click', function(e) {
											try {
												const storage = JSON.parse(storageeditor.value);
												Object.keys(_this.func.storage).forEach(k => delete _this.func.storage[k])
												copyProps(storage, _this.func.storage);
												alertify.success(CONST.Text.ManageWindow.StorageSaved);
											} catch(err) {
												alertify.error(CONST.Text.ManageWindow.StorageFormatError);
											}
										}]]
									});
									storagebuttons.appendChild(storagesave);

									// Storage reload button
									const storagereload = elements.storagereload = $$CrE({
										tagName: 'button',
										props: {
											innerText: CONST.Text.ManageWindow.Reload
										},
										classes: 'plus_func_storagereload',
										listeners: [['click', function(e) {
											storageeditor.value = vkbeautify.json(_this.func.storage, 2);
										}]]
									});
									storagebuttons.appendChild(storagereload);

									// Storage export button
									const storageexport = elements.storageexport = $$CrE({
										tagName: 'button',
										props: {
											innerText: CONST.Text.ManageWindow.Export
										},
										classes: 'plus_func_storagereload',
										listeners: [['click', function(e) {
											utils.downloadText(JSON.stringify(_this.func.storage), `${GM_info.script.name}-${_this.func.id}-config.json`);
											storageeditor.value = vkbeautify.json(_this.func.storage, 2);
										}]]
									});
									storagebuttons.appendChild(storageexport);

									// Storage import button
									const storageimport = elements.storageimport = $$CrE({
										tagName: 'button',
										props: {
											innerText: CONST.Text.ManageWindow.Import
										},
										classes: 'plus_func_storagereload',
										listeners: [['click', function(e) {
											if (!storageeditor.disabled) {
												const input = $$CrE({
													tagName: 'input',
													props: { type: 'file' },
													listeners: [['change', e => {
														try {
															const file = input.files[0];
															const reader = new FileReader();
															reader.onload = e => {
																_this.func.storage = JSON.parse(reader.result);
																storageeditor.value = vkbeautify.json(_this.func.storage, 2);
															}
															reader.onerror = err => { throw err; };
															reader.readAsText(file);
														} catch(err) {
															DoLog(LogLevel.Warning, 'Import error');
															DoLog(LogLevel.Warning, err, 'warn');
														}
													}]]
												});
												input.click();
											}
											/*
											utils.downloadText(JSON.stringify(_this.func.storage), `${GM_info.script.name}-${_this.func.id}-config.json`);
											storageeditor.value = vkbeautify.json(_this.func.storage, 2);
											*/
										}]]
									});
									storagebuttons.appendChild(storageimport);

									const storagereset = elements.storagereset = $$CrE({
										tagName: 'button',
										props: {
											innerText: CONST.Text.ManageWindow.Reset
										},
										classes: 'plus_func_storagereset',
										listeners: [['click', function(e) {
											alertify.confirm(CONST.Text.ManageWindow.Header, CONST.Text.ManageWindow.StorageResetConfirm, function() {
												_this.func.storage = {};
												storageeditor.value = vkbeautify.json(_this.func.storage, 2);
											}, e => {});
										}]]
									});
									storagebuttons.appendChild(storagereset);

									// Storage edit checkbox
									const storageedit = elements.storageedit = $$CrE({
										tagName: 'input',
										props: {
											type: 'checkbox'
										},
										classes: 'plus_func_editcheckbox',
										listeners: [['change', (function() {
											let firstChecked = false;
											return function(e) {
												if (_this.func.system) {
													storageedit.checked = false;
													return;
												}
												if (storageedit.checked) {
													if (!firstChecked) {
														alertify.confirm(CONST.Text.ManageWindow.Header, CONST.Text.ManageWindow.StorageAlert, function() {
															firstChecked = true;
															enable();
														}, e => { storageedit.checked = false; });
													} else {
														enable();
													}
												} else {
													disable();
												}

												function disable() {
													[storagesave, storageimport, storageeditor].forEach(btn => btn.disabled = true);
												}

												function enable() {
													[storagesave, storageimport, storageeditor].forEach(btn => btn.disabled = false);
													//storageeditor.focus() // Do not focus directly, no focus will gain!
													setTimeout(e => storageeditor.focus(), 0); // focus with a setTimeout is okay
												}
											};
										})()]]
									});
									const storageedittext = elements.storageedittext = $$CrE({
										tagName: 'span',
										classes: 'plus_func_edittext',
										props: { innerText: CONST.Text.ManageWindow.StorageEdit }
									});
									const storageeditlabel = elements.storageeditlabel = $$CrE({
										tagName: 'label',
										classes: 'plus_func_editlabel',
									});
									storageeditlabel.appendChild(storageedit);
									storageeditlabel.appendChild(storageedittext);
									storagebuttons.appendChild(storageeditlabel);
								}
							}
						});
					}
				}

				// Check userscript update and returns a Promise({info, hasUpdate})
				async function checkUpdate(autoInstall=true) {
					const GF = new GreasyFork();

					alertify.message(CONST.Text.CheckingUpdate);
					const info = await GF.get().script().info(CONST.Number.GFScriptID);
					CONFIG.lastupdate = utils.getTime('-', false);

					if (versionNewer(info.version, GM_info.script.version)) {
						autoInstall && info.action('install', { id: CONST.Number.GFScriptID });
						return {info, hasUpdate: true};
					} else {
						return {info, hasUpdate: false};
					}

					function versionNewer(v1, v2) {
						if ([v1, v2].some(v => !/(\d\.?)+/.test(v))) {
							Err('versionNewer: all version strings should only contain number and dot(.), and have no consecutive dots.');
						}

						[v1, v2] = [v1, v2].map(v => v.split('.').map(s => parseInt(s, 10)));
						for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
							if (v1[i] > v2[i]) {
								return true;
							}
						}
						if (v1.length > v2.length) {
							return true;
						}
						return false;
					}
				}

				// Check userscript update and provide update GUI for user if update exists
				// Returns a Promise(statusNumber), statusNumber = -1: User refuse to update; 0: No update found; 1: User clicked 'install' button in GUI
				async function userCheckUpdate() {
					checkUpdate(false).then(update => new Promise((resolve, reject) => {
						const GF = new GreasyFork();
						if (!update.hasUpdate) {
							resolve(0);
						}

						const message = $$CrE({ tagName: 'div', props: { innerText: CONST.Text.UpdateFound.Main } });
						const btnView = $$CrE({
							tagName: 'span',
							props: { innerText: CONST.Text.UpdateFound.View },
							classes: [CommonStyle.ClassName.Button],
							listeners: [['click', view]]
						});
						const btnInstall = $$CrE({
							tagName: 'span',
							props: { innerText: CONST.Text.UpdateFound.Install },
							classes: [CommonStyle.ClassName.Button],
							listeners: [['click', install]]
						});
						[$CrE('br'), btnView, $CrE('br'), btnInstall].forEach(elm => message.appendChild(elm));
						alertify.message(message);

						function view() {
							console.log('autoupdate: view update');

							const dp = new DOMParser();
							const doc = dp.parseFromString(update.info.additionalInfo[0].html, 'text/html');
							const updateInfo = $(doc, 'div[name="update-info"]');
							const box = alertify.confirm(updateInfo ? updateInfo : doc.body, install, e => resolve(-1));
							box.setHeader(replaceText(CONST.Text.UpdateInfo.Header, {'{version}': update.info.version}));
							box.set('labels', {ok: CONST.Text.UpdateInfo.Install, cancel: CONST.Text.UpdateInfo.Close});
							box.set('overflow', true);
						}

						function install() {
							GF.action('install', { id: CONST.Number.GFScriptID });
							resolve(1);
						}
					}));
				}
			},
			alwaysRun: function() {
				const settings = require('settings');
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');
				const GF = new GreasyFork();
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				!todayUpdated() && settings.userCheckUpdate();

				function todayUpdated() {
					return utils.getTime('-', false) === CONFIG.lastupdate;
				}
			}
		},

		// WenkuBlockGUI
		{
			name: 'WenkuBlockGUI',
			description: '基本组件 - 提供文库风格的界面元素支持',
			id: 'WenkuBlockGUI',
			system: true,
			checker: {
				type: 'switch',
				value: false
			},
			func: function() {
				const mousetip = require('mousetip');
				const CONST = {
					Text: {
						DefaultTitle: '操作区域'
					},
					CSS: {
						ClassName: {
							List: 'plus_list',
							ListButton: 'plus_list_input',
							ListItem: 'plus_list_item'
						},
						Style: {
							PlusList: '.plus_list>ul {list-style: none; text-align: center; padding: 0px; margin: 0px;} .plus_list {position: absolute; z-index: 999; background-color: #f5f5f5; float: left; clear: both; overflow-y: auto; overflow-x: visible;} .plus_list_input {display: block; list-style: outside none none; margin: 0px; border: 0;} .plus_list_item {border: 0px; cursor: pointer; padding: 0 0.5em; border: 1px solid rgb(204, 204, 204); background-color: buttonface;}',
						}
					}
				};

                detectDom('head').then(head => {
                    Object.keys(CONST.CSS.Style).forEach(key => addStyle(CONST.CSS.Style[key], key));
                });

				return {
					makeStandardBlock,
					makeBookcaseBlock,
					makeIndexCenterToplistBlock,
					makeIndexRightToplistBlock,
					PlusList
				};

				// Create a standard block structure
				function makeStandardBlock() {
					const block = $$CrE({tagName: 'div', classes: ['block']});
					const blocktitle = $$CrE({tagName: 'div', classes: ['blocktitle']});
					const blockcontent = $$CrE({tagName: 'div', classes: ['blockcontent']});
					block.appendChild(blocktitle);
					block.appendChild(blockcontent);
					return {block, blocktitle, blockcontent};
				}

				// Bookcase-left block
				function makeBookcaseBlock(detail) {
					const block = makeStandardBlock();

					// Title
					block.blocktitle.appendChild($$CrE({
						tagName: 'span',
						props: {'innerText': detail.title || ''},
						classes: ['txt']
					}));
					block.blocktitle.appendChild($$CrE({
						tagName: 'span',
						classes: ['txtr']
					}));

					// Content links
					const ul = $$CrE({
						tagName: 'ul',
						classes: ['ulitem']
					});
					for (const objLink of detail.links || []) {
						const li = $CrE('li');
						const a = $$CrE({
							tagName: 'a',
							props: {
								'href': objLink.href || 'javascript: void(0);',
								'innerText': objLink.text || '',
								...objLink.props || {}
							},
							styles:  objLink.styles || {},
							classes: objLink.classes || [],
							listeners: objLink.listeners || []
						});
						objLink.hasOwnProperty('key') && (block[objLink.key] = a);
						li.appendChild(a);
						ul.appendChild(li);
					}
					block.blockcontent.appendChild(ul);

					return block;
				}

				// Index page center books toplist block
				// '本周会员推荐榜'
				function makeIndexCenterToplistBlock(detail) {
					const block = makeStandardBlock();

					// Title
					block.blocktitle.innerText = detail.title || '';

					// Content books
					const container = $$CrE({tagName: 'div', styles: {'height': '155px'}});
					block.blockcontent.appendChild(container);
					block.items = [];
					for (const book of detail.books) {
						const b_container = $$CrE({
							tagName: 'div',
							styles: {
								cssText: 'float: left; text-align: center; width: 95px; height: 155px; overflow: hidden;'
							}
						});
						container.appendChild(b_container);

						const imgLink = $$CrE({
							tagName: 'a',
							props: {
								href: book.url,
								target: '_blank'
							}
						});
						mousetip.settip(imgLink, book.name);
						b_container.appendChild(imgLink);

						const img = $$CrE({
							tagName: 'img',
							props: {src: book.cover},
							attrs: {
								border: 0,
								width: 90,
								height: 127
							}
						});
						imgLink.appendChild(img);

						b_container.appendChild($CrE('br'));

						const nameLink = $$CrE({
							tagName: 'a',
							props: {
								innerText: book.name,
								href: book.url,
								target: '_blank'
							}
						});
						b_container.appendChild(nameLink);

						block.items.push({ ...book, b_container, imgLink, img, nameLink });
					}

					return block;
				}

				// '最受关注'
				function makeIndexRightToplistBlock(detail) {
					const block = makeStandardBlock();

					// Title
					block.blocktitle.appendChild($$CrE({
						tagName: 'span',
						props: {
							innerText: detail.title || '',
						},
						classes: ['txt']
					}));
					block.blocktitle.appendChild($$CrE({
						tagName: 'span',
						classes: ['txtr']
					}));

					// Content
					const ul = $$CrE({
						tagName: 'ul',
						classes: ['ultop']
					});
					block.blockcontent.appendChild(ul);

					block.items = [];
					for (const link of detail.links) {
						const li = $$CrE({
							tagName: 'li',
							styles: {
								overflow: 'hidden'
							}
						});
						const a = $$CrE({
							tagName: 'a',
							props: {
								innerText: link.text,
								href: link.url,
								target: '_blank',
							}
						});
						mousetip.settip(a, link.text);
						li.appendChild(a);
						ul.appendChild(li);
						block.items.push({ ...link, li, a });
					}

					return block;
				}

				// Create a list gui like reviewshow.php##FontSizeTable
				// list = {display: '', id: '', parentElement: <*>, insertBefore: <*>, list: [{value: '', onclick: Function, tip: ''/Function}, ...], visible: bool, onshow: Function(bool shown), onhide: Function(bool hidden)}
				// structure: {div: <div>, ul: <ul>, list: [{li: <li>, button: <input>}, ...], visible: list.visible, show: Function, hide: Function, append: Function({...}), remove: Function(index), clear: Function, onshow: list.onshow, onhide: list.onhide}
				// Use 'new' keyword
				function PlusList(list) {
					const PL = this;

					// Make list
					const div = PL.div = document.createElement('div');
					const ul = PL.ul = document.createElement('ul');
					div.classList.add(CONST.CSS.ClassName.List);
					div.appendChild(ul);
					list.display && (div.style.display = list.display);
					list.id && (div.id = list.id);
					list.parentElement && list.parentElement.insertBefore(div, list.insertBefore ? list.insertBefore : null);

					PL.list = [];
					for (const item of list.list) {
						appendItem(item);
					}

					// Attach properties
					let onshow = list.onshow ? list.onshow : function() {};
					let onhide = list.onhide ? list.onhide : function() {};
					let visible = list.visible;
					let maxheight;
					PL.create = createItem;
					PL.append = appendItem;
					PL.insert = insertItem;
					PL.remove = removeItem;
					PL.clear = removeAll;
					PL.show = showList;
					PL.hide = hideList;
					Object.defineProperty(PL, 'onshow', {
						get: function() {return onshow;},
						set: function(func) {
							onshow = func ? func : function() {};
						},
						configurable: false,
						enumerable: true
					});
					Object.defineProperty(PL, 'onhide', {
						get: function() {return onhide;},
						set: function(func) {
							onhide = func ? func : function() {};
						},
						configurable: false,
						enumerable: true
					});
					Object.defineProperty(PL, 'visible', {
						get: function() {return visible;},
						set: function(bool) {
							if (typeof(bool) !== 'boolean') {return false;};
							visible = bool;
							bool ? showList() : hideList();
						},
						configurable: false,
						enumerable: true
					});
					Object.defineProperty(PL, 'maxheight', {
						get: function() {return maxheight;},
						set: function(num) {
							if (typeof(num) !== 'number') {return false;};
							maxheight = num;
						},
						configurable: false,
						enumerable: true
					});

					// Apply configurations
					div.style.display = list.visible === true ? '' : 'none';

					// Functions
					function appendItem(item) {
						const listitem = createItem(item);
						ul.appendChild(listitem.li);
						PL.list.push(listitem);
						return listitem;
					}

					function insertItem(item, index, insertByNode=false) {
						const listitem = createItem(item);
						const children = insertByNode ? ul.childNodes : ul.children;
						const elmafter = children[index];
						ul.insertBefore(item.li, elmafter);
						inserttoarr(PL.list, listitem, index);
					}

					function createItem(item) {
						const listitem = {
							remove: () => {removeItem(listitem);},
							li: document.createElement('li'),
							button: document.createElement('input')
						};
						const li  = listitem.li;
						const btn = listitem.button;
						btn.type = 'button';
						btn.classList.add(CONST.CSS.ClassName.ListButton);
						li.classList.add(CONST.CSS.ClassName.ListItem);
						item.value && (btn.value = item.value);
						item.onclick && btn.addEventListener('click', item.onclick);
						item.tip && mousetip.settip(li, item.tip);
						item.tip && mousetip.settip(btn, item.tip);
						li.appendChild(btn);
						return listitem;
					}

					function removeItem(itemorindex) {
						// Get index
						let index;
						if (typeof(itemorindex) === 'number') {
							index = itemorindex;
						} else if (typeof(itemorindex) === 'object') {
							index = PL.list.indexOf(itemorindex);
						} else {
							return false;
						}
						if (index < 0 || index >= PL.list.length) {
							return false;
						}

						// Remove
						const li = PL.list[index];
						ul.removeChild(li.li);
						delfromarr(PL.list, index);
						return li;
					}

					function removeAll() {
						const length = PL.list.length;
						for (let i = 0; i < length; i++) {
							removeItem(0);
						}
					}

					function showList() {
						if (visible) {return false;};
						onshow(false);
						div.style.display = '';
						onshow(true);
						visible = true;
					}

					function hideList() {
						if (!visible) {return false;};
						onhide(false);
						div.style.display = 'none';
						mousetip.hidetip();
						onhide(true);
						visible = false;
					}

					// Support functions
					// Del an item from an array by provided index, returns the deleted item. MODIFIES the original array directly!!
					function delfromarr(arr, delIndex) {
						if (delIndex < 0 || delIndex > arr.length-1) {
							return false;
						}
						const deleted = arr[delIndex];
						for (let i = delIndex; i < arr.length-1; i++) {
							arr[i] = arr[i+1];
						}
						arr.pop();
						return deleted;
					}

					// Insert an item to an array by its provided index, returns the item itself. MODIFIES the original array directly!!
					function inserttoarr(arr, item, index) {
						if (index < 0 || index > arr.length-1) {
							return false;
						}
						for (let i = arr.length; i > index; i--) {
							arr[i] = arr[i-1];
						}
						arr[index] = item;
						return item;
					}
				}
			}
		},

		// Imager
		{
			name: '图床',
			description: '提供图床上传图片接口，方便用户上传图片',
			id: 'imager',
			system: true,
			checker: {
				type: 'switch',
				value: true
			},
			STOP: false,
			CONST: {
				Text: {
					/*ImageOnly: '您提供的文件无法被识别为图片',
					ImageUploadError: '图片上传失败',
					ClicktoPaste: '点击需要粘贴图片的位置，或者点击其他位置/esc取消',*/
					StatusText: {
						empty: '拖放图片到这里或者单击选择图片',
						waiting: '等待上传',
						uploading: '正在上传',
						uploaded: '上传成功',
						error: '上传失败'
					},
					ScriptTitle: GM_info.script.name,
					OneImageOnly: '每次请选择仅一张图片',
					ImageOnly: '您提供的文件并没有可识别的图片格式</br>请尝试jpg、jpeg、png等常用格式的图片',
					ConnectRequired_Title: '需要网络权限',
					ConnectRequired: `${GM_info.script.name}在为您上传图片时出现了错误</br>原因：缺乏网络权限</br></br>您需要允许对图床网站的网络访问权限，${GM_info.script.name}才能够使用此图片或者访问图床</br></br>您可以在弹出的Tampermonkey页面中点击“允许一次”或者“临时允许”来临时允许${GM_info.script.name}访问此图片或者访问图床，或者点击“总是允许全部域名”永久允许${GM_info.script.name}访问您提供的图片或图床以避免以后再次弹出确认`,
					UploadError: '图片上传失败',
					CoverText: '拖放上传图片',
					UploaderHoverText: '拖放上传图片 或 单击选择图片',
					ClickToClear: '清除已上传图片'
				},
				Imagers: [{
					id: 'p.sda1.dev',
					upload: {
						request: {
							url: 'https://p.sda1.dev/api_dup$backendid$/v1/upload_noform?ts=$time$&rand=$random$&filename=$filename$&batch_size=1',
							replacers: {
								'$backendid$': () => parseInt(Math.random() * 1000000007) % 10
							},
							data: {
								type: 'file'
							},
							responseType: 'json',
							onerror: (err, callback) => GM_xmlhttpRequest({
								method: 'GET',
								url: 'https://p.sda1.dev/assets/css/thumb.css',
								timeout: 5 * 1000,
								onload: err => callback(true),
								onerror: err => callback(false),
								ontimeout: err => callback(false),
							})
						},
						response: {
							type: 'func',
							func: response => new URL(response.response.data.url).href,
							valid: response => typeof response.response === 'object' && response.response !== null && response.response.data && response.response.data.url
						}
					},
					features: ['custom-filename', 'custom-extention']
				}, {
					id: 'sougou',
					upload: {
						request: {
							url: 'https://image.sogou.com/pic/upload_pic.jsp',
							headers: {
								//'Content-Type': 'multipart/form-data' // NO this header manually! this will overwrite Content-Type with Boundary value missing
							},
							data: {
								type: 'form',
								value: 'pic_path'
							}
						},
						response: {
							type: 'url',
							valid: response => typeof response.response === 'string' && /https?:\/\//.test(response.response),
						}
					},
				}],
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						//'config-key': {},
						stat: {}
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				}
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const SettingPanel = require('SettingPanel');
				const mousetip = require('mousetip');

				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				const UPLOADER = new Uploader();

				// <image-selector> custom element
				registerElement();

				SettingPanel.registerElement('image', {
					createElement: function() {
						const uploader = $CrE('image-uploader');
						$AEL(uploader, 'error', err => {
							alertify.error(CONST.Text.UploadError);
						});
						return uploader;
					},
					setValue: function(val) {
						// when val accepted, it means we're reading an uploaded url from storage
						// So val is url
						this.element.url = val;
					},
					getValue: function() {
						return this.element.url;
					},
				});

				return {upload};

				function upload() {
					UPLOADER.upload.apply(this, arguments);
				}

				// Image uploader
				/*
					UPLOADER.upload(file, onload, onerror=e=>{}, retry=3)
						onload => onload(url)
						onerror => onerror()
					UPLOADER.uploadByImager(file, imager, onload, onerror)
						onload => onload(url)
						onerror => onerror()
				*/
				function Uploader() {
					const UP = this;
					UP.upload = upload;
					UP.uploadByImager = uploadByImager;
					init();

					function upload(file, onload, onerror=e=>{}, features=[]) {
						const imager_ids = getSortedImagers(features);
						let index = 0, retry = 3, imagerRetried = imager_ids.map(i => false);
						uploadByImager(file, imager_ids[0], onload, autoRetry);

						function autoRetry(err) {
							const imager = CONST.Imagers.find(i => i.id === imager_ids[index]);
							if (isConnectErr(err)) {
								// @connect not allowed
								onerror();
								return false;
							} else if (imager.upload.request.onerror && !imagerRetried[index]) {
								let timeouted = false, retrying = false;
								imagerRetried[index] = true;

								// Imager has an error handler, handle the error
								// and give it a chance to retry before change to another imager
								imager.upload.request.onerror(err, success => {
									if (success && !timeouted) {
										retrying = true;
										uploadByImager(file, imager_ids[index], onload, autoRetry)
									} else {
										autoRetry();
									}
								});

								// We give imager's error handler 5 seconds to finish its task
								// If it doesn't finish its task in time, just go ahead
								setTimeout(e => {
									if (!retrying) {
										timeouted = true;
										autoRetry();
									}
								}, 5* 1000);
							} else if (--retry > 0 && ++index < imager_ids.length) {
								uploadByImager(file, imager_ids[index], onload, autoRetry);
							} else {
								onerror();
							}
						}
					}

					function uploadByImager(file, imager_id, onload, onerror) {
						const imager = CONST.Imagers.find(i => i.id === imager_id);
						const req = imager.upload.request;
						const res = imager.upload.response;

						const headers = req.headers || {};
						const responseType = req.responseType || 'text';
						const data = ({
							'file': () => file,
							'form': () => {
								const formdata = new FormData();
								formdata.set(req.data.value, file);
								return formdata;
							},
							checker: url => !!url
						})[req.data.type]();

						// Construct request url
						const url = makeUrl(req.url, req.replacers);

						// Request
						GM_xmlhttpRequest({
							method: 'POST',
							url: url,
							headers: {...headers}, // headers should be object, use {...headers} insteadof headers to validate
							responseType, data,
							onerror: handleError,
							ontimeout: handleError,
							onload: dealResponse
						});

						// Response
						function dealResponse(response) {
							if (!res.valid(response)) {
								handleError(response);
								return false;
							}

							let url = ({
								'url': response => response.responseText,
								'func': response => res.func(response)
							})[res.type](response);
							url = new URL(url).href;

							record(imager_id, true);

							onload(url);
						}

						function handleError(err) {
							isConnectErr(err) ?
								alertify.alert(CONST.Text.ConnectRequired_Title, CONST.Text.ConnectRequired) :
								record(imager_id, false);

							onerror.apply(this, arguments);
						}

						function makeUrl(url, _replacers={}) {
							const replacers = {
								'$filename$': () => (encodeURIComponent(file.name)),
								'$random$': () => (Math.random().toString()),
								'$time$': () => ((new Date()).getTime().toString()),
								..._replacers
							};
							const replaceObj = {};
							for (let [mark, func] of Object.entries(replacers)) {
								replaceObj[mark] = func();
							}
							return replaceText(url, replaceObj);;
						}
					}

					function getSortedImagers(features=[]) {
						const stat = CM.getConfig('stat');
						const total = stat.total;
						delete stat.total;

						// filter requested features
						CONST.Imagers.forEach(imager => {
							features.some(f => !imager.features || !imager.features.includes(f)) && delete stat[imager.id];
						});

						return Object.values(stat).map(imager => ({
							id: imager.id,
							score: score(imager)
						})).sort((i1, i2) => (i2.score - i1.score)).map(imager => imager.id);

						function score(imager) {
							// Whether last three uploads successed takes 0.4 point
							// Last three upload takes 0.25, 0.1, 0.05 points in order
							const lastScore = [0.25, 0.1, 0.05].reduce((score, n, index) => {
								return score + n * (imager.last[index] ? 1 : 0);
							}, 0);

							// Whether imager stat record is enough takes 0.2 point
							const numScore = (imager.all / total.all) >= (1 / CONST.Imagers.length) ? 0.2 : 0;

							// Success rate takes 0.4 point
							const sucScore = imager.all ? (imager.success / imager.all) * 0.4 : 0;

							// Sum up all three scores
							return lastScore + numScore + sucScore;
						}
					}

					function record(imager_id, success) {
						if (typeof imager_id !== 'string') {
							Err(`Uploader.record: imager_id should be a string, not ${typeof success}`, 1);
						}
						if (!CONST.Imagers.some(i => i.id === imager_id)) {
							Err(`Uploader.record: imager_id(${imager_id}) not found`, 1);
						}
						if (typeof success !== 'boolean') {
							Err(`Uploader.record: success should be a boolean, not ${typeof success}`, 1);
						}

						[imager_id, 'total'].forEach(key => {
							CONFIG.stat[key].all++;
							CONFIG.stat[key][success ? 'success' : 'fail']++;
						});

						CONFIG.stat[imager_id].last.unshift(success);
						CONFIG.stat[imager_id].last.pop();
					}

					function isConnectErr(err) {
						return typeof err === 'object' && err !== null && typeof err.error === 'string' && err.error.startsWith('Refused to connect to ');
					}

					function init() {
						for (const imager of CONST.Imagers) {
							if (!CONFIG.stat[imager.id]) {
								CONFIG.stat[imager.id] = {
									id: imager.id, // Imager id
									last: [false, false, false],   // Whether last three upload successed
									success: 0,    // Total success count
									fail: 0,       // Total fail count
									all: 0,        // Total uploads count
								};
							}
							if (!CONFIG.stat.total) {
								CONFIG.stat.total = {
									success: 0,    // Total success count for all imagers
									fail: 0,       // Total fail count for all imagers
									all: 0,        // Total uploads count for all imagers
								};
							}
						}
					}
				}

				// New solution
				function registerElement() {
					// ImageUploader custom element
					/* ImageUploader design:
					<image-uploader>
						shadowroot (closed):
							<div id='wrapper'>
								<div id='image'>
									<span id='closebtn'></span>
									<img id='img' src>
									<br id='br'>
									<span id='placeholder' class='empty local uploaded error'>状态提示文本（无图片，未上传，上传成功，上传失败）</span>
								</div>
								<div id='cover'>拖入时提示文本，覆盖在整个element最上层显示</div>
							</div>
							<style>CSS Here</style>
					</image-uploader>

					Methods:
					[x] ImageUploader.prototype.upload:    Upload user-selected image
					[?] ImageUploader.prototype.clear:     Clear user-selected image
					[x] ImageUploader.prototype.load(url): download image blob from url and <set> to ImageUploader.prototype.image

					Properties:
					[x] ImageUploader.prototype.image: <get/set> image file/blob
					[x] ImageUploader.prototype.url: <get/set> uploaded image url
						[x] [onset]: set url property and img.src directly (act as this url is an uploaded image url)
						[x] [onupload]: set uploaded url to ImageUploader.prototype.url
					[x] ImageUploader.prototype.status: <get> upload status, 'uploaded'/'uploading'/'error'/'waiting'/'empty'
					[x] ImageUploader.prototype.autoUpload: <get/set> whether upload user selected images automatically

					Events:
					[?] error: triggers on upload error
					[?] load: triggers on upload finish

					Behaviors:
					[x] handle drag & drop
						[x] dragover: show cover
						[x] dragleave: hide cover
						[x] drop: auto set image and upload if ImageUploader.prototype.autoUpload === true

					Apperence:
					[x] CSS
					*/
					class ImageUploader extends HTMLElement {
						#elements = {};
						#image = {};
						#url = '';
						#status = 'empty';
						#autoUpload = true;
						#UPLOADER = new Uploader();

						constructor() {
							// Always call super() first
							super();

							// Const
							const CSS_ImageUploader = `#wrapper{cursor: pointer; position: relative;} #closebtn{position: absolute; right: 0; top: 0; width: 1em; height: 1em; font-size: 2em; text-align: center; border: 1px dashed rgba(0,0,0,0);} #closebtn:hover,#closebtn:focus{border: 1px dashed rgba(0,0,0,0.3);} #img{width: 100%; height: 100%;} #placeholder{text-align: center;} #cover{position: absolute; left: 0; top: 0; width: calc(100% - 20px); height: calc(100% - 20px); z-index: 1; background-color: rgba(255, 255, 255, 0.8); border: 10px grey dashed; pointer-events: none;} #covertext{position: absolute; top: calc(50% + 10px); left: 50%; margin-top: -0.5em; margin-left: -3em; font-size: 30px;}`;

							// Save this
							const _this = this;

							// Element references
							const elements = this.#elements;

							// Shadowroot
							elements.shadow = this.attachShadow({mode: 'closed'});

							// Wrapper
							elements.wrapper = $CrE('div');
							elements.wrapper.id = 'wrapper';
							elements.shadow.appendChild(elements.wrapper);
							mousetip.settip(elements.wrapper, CONST.Text.UploaderHoverText);

							// Img container
							elements.imgContainer = $CrE('div');
							elements.imgContainer.id = 'imgContainer';
							elements.wrapper.appendChild(elements.imgContainer);

							// Close button
							elements.closebtn = $CrE('span');
							elements.closebtn.id = 'closebtn';
							elements.closebtn.classList.add(CommonStyle.ClassName.Button);
							elements.closebtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
							elements.imgContainer.appendChild(elements.closebtn);
							$AEL(elements.closebtn, 'click', e => {
								e.stopPropagation();
								_this.clear();
							});
							mousetip.settip(elements.closebtn, CONST.Text.ClickToClear);

							// Img
							elements.img = $CrE('img');
							elements.img.id = 'img';
							elements.imgContainer.appendChild(elements.img);
							$AEL(elements.img, 'load', e => elements.imgContainer.style.removeProperty('display'));
							$AEL(elements.img, 'error', e => elements.imgContainer.style.display = 'none');

							// br
							elements.br = $CrE('br');
							elements.br.id = 'br';
							elements.imgContainer.appendChild(elements.br);

							// Placeholder
							elements.placeholder = $CrE('div');
							elements.placeholder.id = 'placeholder';
							elements.wrapper.appendChild(elements.placeholder);

							// Cover
							elements.cover = $CrE('div');
							elements.cover.id = 'cover';
							elements.cover.style.display = 'none';
							elements.wrapper.appendChild(elements.cover);

							// Cover text
							elements.covertext = $CrE('div');
							elements.covertext.id = 'covertext';
							elements.covertext.innerText = CONST.Text.CoverText;
							elements.cover.appendChild(elements.covertext);

							// Style
							elements.style = $CrE('style');
							elements.style.innerHTML = CSS_ImageUploader;
							elements.shadow.appendChild(elements.style);
							elements.shadow.appendChild(CommonStyle.ElmStyle.cloneNode(true));

							// Drag & drop
							$AEL(elements.wrapper, 'dragover', e => {
								// Preventdefault to allow drop
								e.preventDefault();

								// Display text hint on placeholder when dragover
								elements.placeholder.innerText = CONST.Text.CoverText;

								// Display cover when dragover && img shown
								if (elements.img.src && elements.img.width && elements.img.height) {
									const cover = elements.cover;
									cover.style.removeProperty('display');
								}
							});
							$AEL(elements.wrapper, 'drop', e => {
								// Preventdefault
								e.preventDefault();

								// Recover text hint on placeholder
								_this.#setStatus(_this.#status);

								// Hide cover when drop
								elements.cover.style.display = 'none';

								// Handle dropped data
								const items = e.dataTransfer.items;
								if (items.length > 1 && items[0].type !== 'text/uri-list') {
									alertify.alert(CONST.Text.ScriptTitle, CONST.Text.OneImageOnly);
									return false;
								}
								const item = items[0];
								if (item.kind !== 'file' && item.kind !== 'string') {
									// item is in DataTransferItem format, not directly a file or a string
									// Check whether item data is a file or a urilist, return if not
									return false;
								}
								if (item.type.split('/')[0] === 'image') {
									// Drag & drop image file
									const file = item.getAsFile();
									_this.image = file;
									_this.#autoUpload && _this.upload();
								} else if (item.type === 'text/uri-list') {
									// Drag & drop web image ([{type: 'text/uri-list'}, {type: 'text/html'}])
									item.getAsString(str => {
										if (!/^https?:\/\/[ \S]/.test(str) && !str.startsWith('blob:')) {
											alertify.alert(CONST.Text.ScriptTitle, CONST.Text.ImageOnly);
											return false;
										}
										_this.load(str);
									});
								}
							});
							$AEL(elements.wrapper, 'dragleave', e => {
								// Preventdefault
								e.preventDefault();

								// Recover text hint on placeholder
								_this.#setStatus(_this.#status);

								// Hide cover when drop
								elements.cover.style.display = 'none';
							});

							// Click to select
							$AEL(elements.wrapper, 'click', e => {
								const input = $$CrE({
									tagName: 'input',
									props: {
										type: 'file'
									}
								});
								$AEL(input, 'change', e => {
									const file = input.files[0];
									if (file.type.split('/')[0] !== 'image') {
										alertify.alert(CONST.Text.ScriptTitle, CONST.Text.ImageOnly);
										return false;
									}
									_this.image = file;
									_this.#autoUpload && _this.upload();
								});
								input.click();
							});

							this.#setStatus('empty');
						}

						get image() {
							return this.#image.image || null;
						}

						set image(val) {
							if (isBlobFile(val)) {
								const image = this.#image;

								// Revoke old object url
								image.objurl && URL.revokeObjectURL(image.objurl);

								// Save new image and object url
								image.image = val;
								image.objurl = URL.createObjectURL(val);

								// Set image src
								this.#elements.img.src = image.objurl;

								// Update status
								this.#setStatus('waiting');
							}
							return val;

							function isBlobFile(val) {
								return typeof val.toString === 'function' && ['[object Blob]', '[object File]'].includes(val.toString());
							}
						}

						get url() {
							return this.#url;
						}

						set url(val) {
							if ((typeof val !== 'string' || !val.match(/(https?:\/\/|data:\/\/)/)) && val) {
								return val;
							}
							if (!val) {
								val = '';
							}
							this.#url = val;
							this.#elements.img.src.startsWith('blob:') && URL.revokeObjectURL(this.#elements.img.src);
							this.#elements.img.src = val;
							this.#setStatus('empty');

							return val;
						}

						get autoUpload() {
							return this.#autoUpload;
						}

						set autoUpload(val) {
							this.#autoUpload = typeof val === 'boolean' ? val : this.#autoUpload;
							return val;
						}

						get status() {
							return this.#status;
						}

						clear() {
							this.#image = {};
							this.#url = '';
							this.#setStatus('empty');
							this.#elements.img.src = '';
						}

						load(url) {
							GM_xmlhttpRequest({
								method: 'GET',
								url: url,
								responseType: 'blob',
								onload: res => {
									const blob = res.response;
									this.image = blob;
									this.#autoUpload && this.upload();
								},
								onerror: err => {
									typeof err.error === 'string' && err.error.startsWith('Refused to connect to ') &&
										alertify.alert(CONST.Text.ConnectRequired_Title, CONST.Text.ConnectRequired);
								},
							});
						}

						upload() {
							const _this = this;
							this.#setStatus('uploading');
							this.#upload(function onload(url) {
								_this.#elements.img.src.startsWith('blob:') && URL.revokeObjectURL(_this.#elements.img.src);
								_this.#elements.img.src = url;
								_this.#url = url;
								_this.#setStatus('uploaded');
								_this.dispatchEvent(new Event('load'));
							}, function onerror() {
								_this.#setStatus('error');
								_this.dispatchEvent(new Event('error'));
							})
						}

						#upload(onload, onerror) {
							const image = this.#image;
							this.#url = null;

							if (!image) {
								return false;
							}

							const file = new File([image.image], `image.${getExtname(image.image.type)}`);
							this.#UPLOADER.upload(file, onload, onerror);

							function getExtname(...args) {
								const map = {
									'image/png': 'png',
									'image/jpg': 'jpg',
									'image/gif': 'gif',
									'image/bmp': 'bmp',
									'image/jpeg': 'jpeg',
									'image/webp': 'webp',
									'image/tiff': 'tiff',
									'image/vnd.microsoft.icon': 'ico',
									'default': 'jpg'
								};
								return map[args.find(a => map[a]) || 'default'];
							}
						}

						#setStatus(status) {
							const STATUSES = ['empty', 'waiting', 'uploading', 'uploaded', 'error'];
							const TEXT = CONST.Text.StatusText;
							const list = this.#elements.placeholder.classList;
							STATUSES.forEach(s => {
								s === status && !list.contains(s) && list.add(s);
								s !== status && list.contains(s) && list.remove(s);
							});
							this.#elements.placeholder.innerText = TEXT[status];
							this.#status = status;
						}
					}

					window.customElements.define('image-uploader', ImageUploader);
				}
			}
		},

		// ChapterUnlocker
		{
			name: '在线阅读解锁',
			description: '技术测试',
			id: 'ChapterUnlocker',
			system: false,
			checker: {
				type: 'func',
				value: () => {
					return (location.pathname.startsWith('/novel/') || location.pathname.match(/\/modules\/article\/reader.php/)) && unsafeWindow.chapter_id !== '0'
				}
			},
			func: function() {
				const AndroidAPI = require('AndroidAPI');
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');
				const TEXT_GUI_NOVEL_FILLING = `</br><span class=${escJsStr(CommonStyle.ClassName.Text)}>[轻小说文库+] 正在获取章节内容...</span>`;

                (async function() {
                    const footlink = await detectDom('#footlink');

                    // Check whether needs filling
                    if ($('#contentmain>span')) {
                        if ($('#contentmain>span').innerText.trim() !== 'null') {
                            return false;
                        }
                    } else {return false;}

                    // prepare
                    const content = $('#content');
                    content.innerHTML = TEXT_GUI_NOVEL_FILLING;
                    const charset = utils.getLang();

                    // Get content xml
                    AndroidAPI.getNovelContent({
                        aid: unsafeWindow.article_id,
                        cid: unsafeWindow.chapter_id,
                        lang: charset,
                        callback: function(text) {
                            const imgModel = '<div class="divimage"><a href="{U}" target="_blank"><img src="{U}" border="0" class="imagecontent"></a></div>';

                            // Trim whitespaces
                            text = text.trim();

                            // Get images like <!--image-->http://pic.wenku8.com/pictures/0/716/24406/11588.jpg<!--image-->
                            const imgUrls = text.match(/<!--image-->[^<>]+?<!--image-->/g) || [];

                            // Parse <img> for every image url
                            let html = '';
                            for (const url of imgUrls) {
                                const index = text.indexOf(url);
                                const src = utils.htmlEncode(url.match(/<!--image-->([^<>]+?)<!--image-->/)[1]);
                                html += utils.htmlEncode(text.substring(0, index)).replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '</br>');
                                html += imgModel.replaceAll('{U}', src);
                                text = text.substring(index + url.length);
                            }
                            html += utils.htmlEncode(text);

                            // Set content
                            content.innerHTML = html;
                        }
                    });
                }) ();

				return true;
			}
		},

		// DownloadUnlocker
		{
			name: '下载解锁',
			description: '技术测试',
			id: 'DownloadUnlocker',
			system: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/packshow\.php\?/
				]
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');

				const CONST = {
					Text: {
						AnnounceText: '解锁功能加载完毕，仅供技术测试',
						PackshowInit: '正在初始化下载页面，请稍候...',
						PackshowInitTitle: '初始化...',
						PackshowTitle: {
							txt: '{N} 轻小说TXT下载 - 轻小说文库',
							txtfull: '{N} 轻小说TXT全本下载 - 轻小说文库',
							umd: '{N} 轻小说UMD电子书下载 - 轻小说文库',
							jar: '{N} 轻小说JAR电子书下载 - 轻小说文库',
						},
						PackshowReady: '初始化下载页面成功',
						UnkownValue: '未知'
					},
					URL: {
						BookIntro: `https://${location.host}/book/{A}.htm`
					},
					DomRes: {
						DownloadPanel: {
							title: ['《{Name}》小说TXT、UMD、JAR电子书下载', '《{Name}》小說TXT、UMD、JAR電子書下載'],
							style: 'width:820px;height:35px;margin:0px auto;padding:0px;',
							links: [{
								style: 'width:210px; float:left; text-align:center;',
								url: `https://${location.host}/modules/article/packshow.php?id={AID}&type=txt`,
								text: ['TXT简繁分卷', 'TXT簡繁分卷']
							}, {
								style: 'width:210px; float:left; text-align:center;',
								url: `https://${location.host}/modules/article/packshow.php?id={AID}&type=txtfull`,
								text: ['TXT简繁全本', 'TXT簡繁全本']
							}, {
								style: 'width:210px; float:left; text-align:center;',
								url: `https://${location.host}/modules/article/packshow.php?id={AID}&type=umd`,
								text: ['UMD分卷下载', 'UMD分卷下載']
							}, {
								style: 'width:190px; float:left; text-align:center;',
								url: `https://${location.host}/modules/article/packshow.php?id={AID}&type=jar`,
								text: ['JAR分卷下载', 'JAR分卷下載']
							}]
						}
					}
				};

				const functions = [{
					checker: {
						type: 'regurl',
						value: [
							/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
							/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php/
						]
					},
					detectDom: '.main.m_foot',
					func: function() {
						const DPM = new DownloadPanelManager(CONST.DomRes.DownloadPanel);

						function DownloadPanelManager(detail) {
							const DPM = this;

							const L = utils.getLang();
							const content = $('#content');
							const aid = getAID();
							const name = $('#content table table b').innerText;
							const panel = $('#content fieldset>legend>b') || makePanel();

							function makePanel() {
								const board = $(content, 'table:nth-of-type(2) td:nth-of-type(2) .hottext:nth-of-type(2)');
								board.className = CommonStyle.ClassName.Text;
								board.innerText = CONST.Text.AnnounceText

								const container = $CrE('div');
								const fieldset = $CrE('fieldset');
								fieldset.style.cssText = detail.style;
								container.appendChild(fieldset);

								const legend = $CrE('legend');
								const b = $CrE('b');
								b.innerText = replaceText(detail.title[L], {'{AID}': aid, '{Name}': name});
								legend.appendChild(b);
								fieldset.appendChild(legend);

								for (const link of detail.links) {
									const div = $CrE('div');
									const a = $CrE('a');
									div.style.cssText = link.style;
									a.href = replaceText(link.url, {'{AID}': aid, '{Name}': name});
									a.innerText = link.text[L];
									div.appendChild(a);
									fieldset.appendChild(div);
								}

								$('#content>div:first-child').insertAdjacentElement('beforeend', container);

								return container;
							}

							function getAID() {
								const m1 = location.pathname.split('/').pop().match(/\d+/);
								return m1 ? m1[0] : getUrlArgv('id');
							}
						}
					}
				}, {
					checker: {
						type: 'regurl',
						value: /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/packshow\.php\?/
					},
					detectDom: '.blocknote, .main.m_foot',
					func: function(returnValue) {
						if ($All('.block').length > 1) {
							FL_postMessage('PackshowReady');
							return {packshowReady: true};
						}

						let xmlInfo, xmlIndex;
						const AndroidAPI = require('AndroidAPI');
						const AM = new AsyncManager();
						const aid = getUrlArgv('id');
						const type = getUrlArgv('type');
						const lang = utils.getLang();

						// Soft alert
						const block_loading = $('.blockcontent>:first-child');
						block_loading.innerText = `\n\n${CONST.Text.PackshowInit}\n\n\n`;
						block_loading.classList.add(require('CommonStyle').ClassName.Text);
						block_loading.style.fontSize = '2em';
						block_loading.style.textAlign = 'center';
						$('.blocktitle').innerText = CONST.Text.PackshowInitTitle;
						document.title = CONST.Text.PackshowInitTitle;

						// Load model page
						const url = location.href.replace(/([\?&]id=)\d+/, '$11');
						utils.getDocument(url, doc => {
							const div = $('.block').parentElement.parentElement;
							div.style.display = 'none';
							for (const elm of [...doc.body.children]) {
								document.body.insertBefore(elm, div);
							}
							div.remove();
							$('#plus-api-beautify')?.remove();
							AM.finish();
						});
						AM.add();

						// Load shortInfo
						AndroidAPI.getNovelShortInfo({
							aid, lang,
							callback: xml => {
								xmlInfo = xml;
								AM.finish();
							}
						});
						AM.add();

						// Load index
						AndroidAPI.getNovelIndex({
							aid, lang,
							callback: xml => {
								xmlIndex = xml;
								AM.finish();
							}
						});
						AM.add();

						AM.onfinish = fetchFinish;
						AM.finishEvent = true;

						function fetchFinish() {
							// Elements
							const content = $(document, '#content');
							const table = $(content, 'table');
							const tbody = $(table, 'tbody');

							// Data
							const name = $(xmlInfo, 'data[name="Title"]').childNodes[0].nodeValue;
							const lastupdate = $(xmlInfo, 'data[name="LastUpdate"]').getAttribute('value');
							const aBook = $(table, 'caption>a:first-child');
							const charsets = ['gbk', 'utf-8', 'big5', 'gbk', 'utf-8', 'big5'];
							const innerTexts = [
								['简体(G)', '简体(U)', '繁体(U)', '简体(G)', '简体(U)', '繁体(U)'],
								['簡體(G)', '簡體(U)', '繁體(U)', '簡體(G)', '簡體(U)', '繁體(U)']
							][lang];

							// Set Title
							document.title = replaceText(CONST.Text.PackshowTitle[type], {'{N}': name});

							// Set book
							aBook.innerText = name;
							aBook.href = replaceText(CONST.URL.BookIntro, {'{A}': aid});

							// Load book index
							loadIndex();

							// Soft alert
							alertify.success(CONST.Text.PackshowReady);
							block_loading.innerText = `\n\n${CONST.Text.PackshowReady}\n\n\n`;

							// callback
							FL_postMessage('PackshowReady');
							returnValue.packshowReady = true;

							// Book index loader
							function loadIndex() {
								switch (type) {
									case 'txt':
										loadIndex_txt();
										break;
									case 'txtfull':
										loadIndex_txtfull();
										break;
									case 'umd':
										loadIndex_umd();
										break;
									case 'jar':
										loadIndex_jar();
										break;
								}
							}

							// Book index loader for type txt
							function loadIndex_txt() {
								// Clear tbody trs
								for (const tr of $All(table, 'tr+tr')) {
									tbody.removeChild(tr);
								}

								// Make new trs
								for (const volume of $All(xmlIndex, 'volume')) {
									const tr = makeTr(volume);
									tbody.appendChild(tr);
								}

								function makeTr(volume) {
									const tr = $CrE('tr');
									const [tdName, td1, td2] = [$CrE('td'), $CrE('td'), $CrE('td')];
									const a = Array(6);
									const vid = volume.getAttribute('vid');
									const vname = volume.childNodes[0].nodeValue;

									// init tds
									tdName.classList.add('odd');
									td1.classList.add('even');
									td2.classList.add('even');
									td1.align = td2.align = 'center';

									// Set volume name
									tdName.innerText = vname;

									// Make <a> links
									for (let i = 0; i < a.length; i++) {
										a[i] = $CrE('a');
										a[i].target = '_blank';
										a[i].href = 'http://dl.wenku8.com/packtxt.php?aid=' + aid +
											'&vid=' + vid +
											(i >= 3 ? '&aname=' + $URL.encode(name) : '') +
											(i >= 3 ? '&vname=' + $URL.encode(vname) : '') +
											'&charset=' + charsets[i];
										a[i].innerText = innerTexts[i];
										(i < 3 ? td1 : td2).appendChild(a[i]);
									}

									// Insert whitespace textnode
									for (const i of [1, 2, 4, 5]) {
										(i < 3 ? td1 : td2).insertBefore(document.createTextNode('\n'), a[i]);
									}

									tr.appendChild(tdName);
									tr.appendChild(td1);
									tr.appendChild(td2);

									return tr;
								}
							}

							// Book index loader for type txtfull
							function loadIndex_txtfull() {
								const tr = $(tbody, 'tr+tr');
								const tds = Array.prototype.map.call(tr.children, (elm) => (elm));

								tds[0].innerText = lastupdate;
								tds[1].innerText = CONST.Text.UnkownValue;
								for (const a of $All(tds[2], 'a')) {
									a.href = a.href.replace(/id=\d+/, 'id='+aid).replace(/fname=[^&]+/, 'fname='+$URL.encode(name));
								}
							}

							// Book index loader for type umd
							function loadIndex_umd() {
								const tr = $(tbody, 'tr+tr');
								const tds = Array.from(tr.children);

								tds[0].innerText = tds[1].innerText = CONST.Text.UnkownValue;
								tds[2].innerText = lastupdate;
								tds[3].innerText = $(xmlIndex, 'volume:first-child').childNodes[0].nodeValue + '—' + $(xmlIndex, 'volume:last-child').childNodes[0].nodeValue;
								const as = [].concat(Array.from($All(tds[4], 'a'))).concat(Array.from($All(table, 'caption>a+a')));
								for (const a of as) {
									a.href = a.href.replace(/id=\d+/, 'id='+aid);
								}
							}

							// Book index loader for type jar
							function loadIndex_jar() {
								// Currently type jar is the same as type umd
								loadIndex_umd();
							}
						}
					}
				}];

				return utils.loadFuncs(functions);
			}
		},

		// Download Enhance
		{
			name: '下载增强',
			description: '下载界面增强，提供一键下载全部分卷、快捷切换下载服务器等小功能',
			id: 'DownloadEnhance',
			system: false,
			checker: {
				type: 'regurl',
				value: /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/packshow\.php\?/
			},
			func: function() {
				const DownloadUnlocker = require('DownloadUnlocker');
				const CommonStyle = require('CommonStyle');
				const mousetip = require('mousetip');
				const utils = require('utils');

				const CONST = {
					Text: {
						CheckHeader: '全选',
						DownloadAllChecked: '下载全部选中项，请点击右侧按钮：',
						NothingHere: '-- Nothing Here --',
						DIYDownloadHeader: '自定义名称格式下载',
						SetdownloadFormatTip: '点击设置下载文件的名称格式',
						SetdownloadFormatTitle: '自定义下载名称格式 - {TYPE}',
						SetdownloadFormatMessage: '下载{TYPE}时使用以下格式命名文件，以下标识符将会替换为对应的内容：</br>{SM}: 书名</br>{JM}: 卷名</br>{KZM}：文件扩展名(如"txt"/"umd"等，不含".")</br>{ID}: 文库的小说id</br>注：根据下载类型的不同，某些标识符可能不会被替换（比如下载TXT全本时，不存在分卷，所以{JM}不会被替换）',
						PleaseSelect: '请先在左边勾选需要下载的章节，</br>再点击批量下载按钮</br>最上面的复选框可以进行全选',
						DownloadStatus_Queued: '(排队中)',
						DownloadStatus_Downloading: '(下载中)',
						DownloadStatus_Finished: '(已下载)',
						DownloadStatus_Error: '(下载失败，请重试)',
						ServerChangerTip: '点击切换到此下载服务器',
						ServerChanged: '已切换到{Server}',
						DownloadType: {
							txt: 'TXT分卷',
							txtfull: 'TXT全本',
							umd: 'UMD电子书',
							jar: 'JAR电子书'
						}
					},
					Config_Ruleset: {
						'version-key': 'config-version',
						'ignores': ["LOCAL-CDN"],
						'defaultValues': {
							//'config-key': {},
							downloadFormat: {
								txt: '{SM} {JM}.{KZM}',
								txtfull: '{SM}.{KZM}',
								umd: '{SM}.{KZM}',
								jar: '{SM}.{KZM}',
								'config-version': 2
							}
						},
						'updaters': {
							/*'config-key': [
								function() {
									// This function contains updater for config['config-key'] from v0 to v1
								},
								function() {
									// This function contains updater for config['config-key'] from v1 to v2
								}
							]*/
							downloadFormat: [
								function(downloadFormat) {
									return {
										txt: downloadFormat.txt,
										txtfull: '{SM}.{KZM}'
									};
								},
								function(downloadFormat) {
									return {
										...downloadFormat,
										umd: '{SM}.{KZM}',
										jar: '{SM}.{KZM}'
									};
								}]
						}
					}
				};

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				CM.updateAllConfigs();

				detectDom({ selector: '.main.m_foot', callback: enhance});

				function enhance() {
					const doc = DownloadUnlocker.iframe ? DownloadUnlocker.iframe.contentDocument : document;
					return {
						'txt': enhance_txt,
						'txtfull': ehance_txtfull,
						'jar': enhance_jar,
						'umd': enhance_umd
					}[getUrlArgv('type')](doc);
				}

				function enhance_txt(doc) {
					const content = $(doc, '#content');
					const header = $(content, 'tr:first-child');

					// Header
					const thChecker = $CrE('th');
					thChecker.innerText = CONST.Text.CheckHeader;
					thChecker.style.textAlign = 'center';
					header.insertAdjacentElement('afterbegin', thChecker);

					const thDownload = $CrE('th');
					const text = $CrE('span');
					const nameSetting = $CrE('i');
					text.innerText = CONST.Text.DIYDownloadHeader;
					nameSetting.className = 'fa-solid fa-gear';
					nameSetting.style.marginLeft = '0.3em';
					nameSetting.style.cursor = 'pointer';
					mousetip.settip(nameSetting, CONST.Text.SetdownloadFormatTip);
					$AEL(nameSetting, 'click', setDownloadFormat.bind(null, 'txt'));
					thDownload.appendChild(text);
					thDownload.appendChild(nameSetting);
					header.appendChild(thDownload);

					const widths = ['5%', '35%', '20%', '20%', '20%'];
					[...$All(content, 'tr:first-child>th')].forEach((th, i) => {
						th.style.width = widths[i];
					});

					// Row
					for (const tr of $All(content, 'tbody>tr:not(:first-child)')) {
						// Batch checker
						const cTd = $CrE('td');
						const checker = $CrE('input');
						checker.type = 'checkbox';
						cTd.style.textAlign = 'center';
						cTd.style.cursor = checker.style.cursor = 'pointer';
						$AEL(cTd, 'click', e => e.srcElement === cTd && checker.click());
						cTd.appendChild(checker);
						tr.insertAdjacentElement('afterbegin', cTd);

						// Download display
						const tdName = tr.children[1];
						const vtitle = $CrE('span');
						vtitle.innerText = tdName.innerText;
						tdName.innerHTML = '';
						tdName.appendChild(vtitle);
						const dltext = $CrE('span');
						dltext.style.marginLeft = '0.3em';
						tdName.appendChild(dltext);

						// Download button
						const td = tr.children[2].cloneNode(true);
						[...td.children].forEach(a => {
							a.classList.add(CommonStyle.ClassName.Button);
							$AEL(a, 'click', e => {
								e.preventDefault();
								dltext.innerText = CONST.Text.DownloadStatus_Queued;

								downloadAndUnserielize({
									url: a.href,
									name: replaceText(CONFIG.downloadFormat.txt, {
									'{SM}': $(content, 'caption>a').innerText,
									'{JM}': tdName.children[0].innerText,
									'{KZM}': 'txt',
									'{ID}': getUrlArgv('id')
								}),
									encoding: getUrlArgv(a.href, 'charset'),
									options: {
										onloadstart: function() {
											dltext.innerText = CONST.Text.DownloadStatus_Downloading;
										},
										onload: function() {
											dltext.innerText = CONST.Text.DownloadStatus_Finished;
										},
										onerror: function() {
											dltext.innerText = CONST.Text.DownloadStatus_Error;
										}
									}
								});
							});
						});
						tr.appendChild(td);
					}

					// Batch download
					const getAllCheckbox = () => [...$All(content, 'tbody>tr:not([plus_batch])>td>input[type="checkbox"]')];
					const batchTr = $CrE('tr');
					batchTr.setAttribute('plus_batch', '');
					for (let i = 0; i < 5; i++) {
						const td = $CrE('td');
						td.style.textAlign = 'center';
						switch (i) {
							case 0: {
								const allcheck = $CrE('input');
								allcheck.type = 'checkbox';
								td.style.cursor = allcheck.style.cursor = 'pointer';
								$AEL(allcheck, 'change', e => {
									getAllCheckbox().forEach(box => {box.checked = allcheck.checked});
								});
								$AEL(td, 'click', e => e.srcElement === td && allcheck.click());
								td.appendChild(allcheck);

								const tbody = $(content, 'tbody');
								$AEL(tbody, 'change', e => {
									allcheck.checked = getAllCheckbox().every(input => input.checked);
								});
								break;
							}
							case 1: {
								td.innerText = CONST.Text.DownloadAllChecked;
								td.classList.add('odd');
								td.style.removeProperty('text-align');
								td.classList.add(CommonStyle.ClassName.Text);
								break;
							}
							case 2:
							case 3: {
								td.classList.add('even');
								td.style.color = 'grey';
								td.innerText = CONST.Text.NothingHere;
								break;
							}
							case 4: {
								td.classList.add('even');
								[...$(content, 'tbody>tr:last-child>td:last-child').children].forEach((_a, i) => {
									const a = _a.cloneNode(true);
									a.href = 'javascript:void(0);';
									a.target = 'self';
									$AEL(a, 'click', e => {
										e.preventDefault();
										const trs = [...$All(content, 'tbody>tr:not(:first-child):not([plus_batch])')].filter(tr => $(tr, 'input[type="checkbox"]').checked);
										if (trs.length) {
											trs.forEach(tr => $(tr, `td:last-child>a:nth-of-type(${i+1})`).click());
										} else {
											alertify.message(CONST.Text.PleaseSelect);
										}
										/*
										[...$All(content, 'tbody>tr:not(:first-child):not([plus_batch])')].forEach(tr => {
											if ($(tr, 'input[type="checkbox"]').checked) {
												$(tr, `td:last-child>a:nth-of-type(${i+1})`).click();
											}
										});
										*/
									});
									td.appendChild(document.createTextNode(' '));
									td.appendChild(a);
								});
								break;
							}
						}
						batchTr.appendChild(td);
					}
					$(content, 'tbody>tr:first-child').insertAdjacentElement('afterend', batchTr);

					// Sever changer
					serverChanger();
				}

				function ehance_txtfull(doc) {
					const content = $(doc, '#content');

					const td = $(content, 'tbody td:last-child');
					td.appendChild($CrE('br'));
					td.appendChild(document.createTextNode(CONST.Text.DIYDownloadHeader));
					const diyBtn = $CrE('i');
					diyBtn.className = 'fa-solid fa-gear';
					mousetip.settip(diyBtn, CONST.Text.SetdownloadFormatTip);
					diyBtn.style.marginLeft = '0.3em';
					diyBtn.style.cursor = 'pointer';
					$AEL(diyBtn, 'click', setDownloadFormat.bind(null, 'txtfull'));
					td.appendChild(diyBtn);
					td.appendChild(document.createTextNode('（'));
					const text = [['简体(G)', '简体(U)', '繁体(U)'], ['簡體(G)', '簡體(U)', '繁體(U)']][utils.getLang()];
					[1, 3, 5].forEach((n, i) => {
						const _a = $(td, `a:nth-child(${n})`);
						const a = $CrE('a');
						a.href = 'javascript: void(0);';
						a.innerText = text[i];
						a.classList.add(CommonStyle.ClassName.Button);
						$AEL(a, 'click', e => {
							e.preventDefault();
							downloadAndUnserielize({
								url: _a.href,
								name: replaceText(CONFIG.downloadFormat.txtfull, {
									'{SM}': $(content, 'caption>a').innerText,
									'{KZM}': 'txt',
									'{ID}': getUrlArgv('id')
								}),
								encoding: getUrlArgv(_a.href, 'type').replace(/^txt$/, 'gbk'),
							});
						});
						td.appendChild(a);
						n < 5 && td.appendChild(document.createTextNode(' '));
					});
					td.appendChild(document.createTextNode('）'));

					// Sever changer
					serverChanger();
				}

				function enhance_jar(doc) {
					const content = $(doc, '#content');

					// DIY name download
					const th = $CrE('th');
					th.innerText = CONST.Text.DIYDownloadHeader;
					$(doc, 'tbody>:first-child').appendChild(th);
					const setting = $CrE('i');
					setting.className = 'fa-solid fa-gear';
					mousetip.settip(setting, CONST.Text.SetdownloadFormatTip);
					setting.style.marginLeft = '0.3em';
					setting.style.cursor = 'pointer';
					$AEL(setting, 'click', setDownloadFormat.bind(null, 'jar'));
					th.appendChild(setting);
					const td = $CrE('td');
					td.align = 'center';
					$(doc, 'tbody>:last-child').appendChild(td);
					const _td = td.previousElementSibling;

					const widths = [5, 5, 9, 41, 20, 20].map(num => `${num}%`);
					[...$All(doc, 'table th')].forEach((th, i) => th.width = widths[i]);

					[...$All(_td, 'a')].forEach((a, i, arr) => {
						const dlBtn = $CrE('span');
						dlBtn.classList.add(CommonStyle.ClassName.Button);
						dlBtn.innerText = a.innerText;
						$AEL(dlBtn, 'click', e => dl_GM({
							url: $(_td, `a:nth-child(${i+1})`).href,
							name: replaceText(CONFIG.downloadFormat.jar, {
								'{SM}': $(content, 'caption>a').innerText,
								'{KZM}': ['jar', 'jad'][i],
								'{ID}': getUrlArgv('id')
							})
						}));
						td.appendChild(dlBtn);

						i < arr.length && td.appendChild(doc.createTextNode(' '));
					});

					// Sever changer
					serverChanger();
				}

				function enhance_umd(doc) {
					const content = $(doc, '#content');

					// DIY name download
					const th = $CrE('th');
					th.innerText = CONST.Text.DIYDownloadHeader;
					$(doc, 'tbody>:first-child').appendChild(th);
					const setting = $CrE('i');
					setting.className = 'fa-solid fa-gear';
					mousetip.settip(setting, CONST.Text.SetdownloadFormatTip);
					setting.style.marginLeft = '0.3em';
					setting.style.cursor = 'pointer';
					$AEL(setting, 'click', setDownloadFormat.bind(null, 'umd'));
					th.appendChild(setting);
					const td = $CrE('td');
					td.align = 'center';
					$(doc, 'tbody>:last-child').appendChild(td);
					const _td = td.previousElementSibling;

					const widths = [5, 5, 9, 41, 20, 20].map(num => `${num}%`);
					[...$All(doc, 'table th')].forEach((th, i) => th.width = widths[i]);

					[...$All(_td, 'a')].forEach((a, i, arr) => {
						const dlBtn = $CrE('span');
						dlBtn.classList.add(CommonStyle.ClassName.Button);
						dlBtn.innerText = a.innerText;
						$AEL(dlBtn, 'click', e => dl_GM({
							url: $(_td, `a:nth-child(${i+1})`).href,
							name: replaceText(CONFIG.downloadFormat.jar, {
								'{SM}': $(content, 'caption>a').innerText,
								'{KZM}': ['umd'][i],
								'{ID}': getUrlArgv('id')
							})
						}));
						td.appendChild(dlBtn);

						i < arr.length && td.appendChild(doc.createTextNode(' '));
					});

					// Sever changer
					serverChanger();
				}

				function setDownloadFormat(type) {
					alertify.prompt(replaceText(CONST.Text.SetdownloadFormatTitle, {'{TYPE}': CONST.Text.DownloadType[type]}), replaceText(CONST.Text.SetdownloadFormatMessage, {'{TYPE}': CONST.Text.DownloadType[type]}), CONFIG.downloadFormat[type], (e, val) => CM.setConfig(`downloadFormat/${type}`, val), function() {});
				}

				function serverChanger() {
					// Sever changer
					const doc = DownloadUnlocker.iframe ? DownloadUnlocker.iframe.contentDocument : document;
					const content = $(doc, '#content');
					for (const b of $All(doc, '#content>b')) {
						const host = b.innerText;
						const matcher = /dl(\d+)?\.wenku8\.com/;
						if (host.match(matcher)) {
							b.classList.add(CommonStyle.ClassName.Button);
							$AEL(b, 'click', e => {
								[...$All(content, 'a[href]')].filter(a => a.href.match(matcher)).forEach(a => a.href = a.href.replace(matcher, host));
								mousetip.showtip(replaceText(CONST.Text.ServerChanged, {'{Server}': host}));
							});
							mousetip.settip(b, CONST.Text.ServerChangerTip);
						}
					}
				}

				// Args: url, name, encoding, options || <object>details
				// Encoding must be one of follows: 'utf-8'(and alias like 'utf8', 'UTF-8', 'UTF8' ...), 'gbk', 'big5'
				function downloadAndUnserielize() {
					let [url, name, encoding, options] = parseArgs([...arguments], [
						function(args, defaultValues) {
							const arg = args[0];
							return ['url', 'name', 'encoding', 'options'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i]);
						},
						[1, 2],
						[1, 2, 3],
						[1, 2, 3, 4]
					], ['', 'text.txt', 'utf-8', {}]);
					encoding = encoding.toLowerCase();
					const xhrOptions = {
						method: 'GET', url,
						responseType: 'blob',
						onload: function(response) {
							const reader = new FileReader();
							reader.onload = function() {
								let text = reader.result;
                                const matches = text.match(/&#\d{1,6};/g);
                                if (matches) {
                                    for (const match of matches) {
                                        text = text.replace(match, utils.htmlDecode(match));
                                    }
                                }
								const buf = encoding.replace('-', '') === 'utf8' ? new TextEncoder().encode(text) : $URL[encoding].encodeBuffer(text);
								const blob = new Blob([buf], { type: 'text/plain' });
								const objurl = URL.createObjectURL(blob);
								dl_browser(objurl, name);
								setTimeout(e => URL.revokeObjectURL(objurl));
							}
							reader.readAsText(response.response, encoding);
						},
					};
					for (const [key, value] of Object.entries(options)) {
						if (typeof value === 'function' && typeof xhrOptions[key] === 'function') {
							// Call both originalCallback and userCallback if userCallback provided
							const [originalCallback, userCallback] = [xhrOptions[key], value];
							xhrOptions[key] = function() {
								originalCallback.apply(this, arguments);
								return userCallback.apply(this, arguments);
							}
						} else {
							// Overwrite other properties
							xhrOptions[key] = value;
						}
					}
					GM_xmlhttpRequest(xhrOptions);
				}
			}
		},

		// Image batch download
		// 现在是全部插图下载，预计要做成一个小说多格式自定义下载器
		{
			name: '插图批量下载',
			description: '批量下载插图',
			id: 'ImageBatchDownloader',
			system: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm([\?#][\s\S]*)?$/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php([\?#][\s\S]*)?$/,
				]
			},
			CONST: {
				Text: {
					DownloadAllImages: '全部插图下载',
					Image: ['插图', '插圖']
				}
			},
			func: function() {
				const CONST = FuncInfo.CONST;
				const AndroidAPI = require('AndroidAPI');
				const utils = require('utils');

				const aid = getUrlArgv('id') || location.pathname.match(/\/book\/(\d+)\.htm/)[1];
				const lang = utils.getLang();

				const container = $$CrE({
					tagName: 'div',
					styles: {
						float: 'left',
						'text-align': 'center'
					}
				});
				const btn = $$CrE({
					tagName: 'a',
					props: {
						innerText: CONST.Text.DownloadAllImages,
						href: 'javascript: void(0);'
					},
					listeners: [['click', e => dlAllImgs()]]
				});
				container.appendChild(btn);

				detectDom({
                    selector: '#content>div:nth-child(3)',
                    callback: async e => {
                        const fieldset = (await detectDom('legend+div[style^="width"]')).parentElement;
                        fieldset.appendChild(container);
                        Array.from($All(fieldset, 'div')).forEach(div => div.style.width = '164px');
                    }
				});

				function dlAllImgs() {
					DoLog('Download All Images');
					AndroidAPI.getNovelIndex({
						aid, lang,
						callback: xml => {
							[AndroidAPI, aid, lang];

							/*
							const box = alertify.
							for (const volumn of $All(xml, 'volumn')) {
								for (const chapter of $All(volumn, 'chapter')) {
									//
								}
							}
							*/

							// Simply downloads all images
							let dl = 0, all = 0;
							const update = () => btn.innerText = `${CONST.Text.DownloadAllImages}(${dl}/${all})`;
							for (const chapter of $All(xml, 'chapter')) {
								const cid = chapter.getAttribute('cid');
								AndroidAPI.getNovelContent({
									aid, cid, lang,
									callback: text => {
										const imgurls = Array.from(text.matchAll(/<!--image-->([^<>]+?)<!--image-->/g)).map(match => match[1]);
										imgurls.forEach((url, i) => {
											const bookName = $('table table span>b').innerText;
											const volumnName = chapter.parentNode.firstChild.nodeValue;
											const num = (i+1).toString().padStart(imgurls.length.toString().length, '0');
											const ext = url.match(/\.([^\/]+)$/) ? url.match(/\.([^\/]+)$/)[1] : 'jpg';
											const name = `${bookName}_${volumnName} ${CONST.Text.Image[lang]}_${num}.${ext}`;
											dl_GM({
												url, name,
												onload: e => update(++dl) // this argument has no effect, just need to increase dl lol
											});
										});
										all += imgurls.length;
									}
								});
							}
							update();
						}
					});
				}
			}
		},

		// Beautifier
		{
			name: '页面美化',
			description: '自定义页面背景图',
			id: 'beautifier',
			system: false,
			Config_Ruleset: {
				'version-key': 'config-version',
				'ignores': ["LOCAL-CDN"],
				'defaultValues': {
					//'config-key': {},
					common: {
						enable: false,
						image: null,
						cover: {
							light: {
								opacity: 70,
								color: 'white',
								blur: 0,
							},
							dark: {
								opacity: 5,
								color: 'white',
								blur: 5,
							}
						}
					},
					novel: {
						enable: false,
						image: null,
						center: false,
						'config-version': 1
					},
					review: {
						enable: false,
						image: null,
						textScale: 100
					},
					image: null,
				},
				'updaters': {
					/*'config-key': [
						function() {
							// This function contains updater for config['config-key'] from v0 to v1
						},
						function() {
							// This function contains updater for config['config-key'] from v1 to v2
						}
					]*/
					novel: [
						function(novel) {
							// add prop 'center' to novel
							return {...novel, center: false};
						}
					]
				}
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');

				const CONST = {
					Text: {
						CommonBeautify: '通用页面美化',
						NovelBeautify: '阅读页面美化',
						ReviewBeautify: '书评页面美化',
						DefaultBeautify: '默认页面美化图片',
						Enable: '启用',
						BackgroundImage: '背景图片',
						AlertTitle: '页面美化设置',
						InvalidImageUrl: '图片链接格式错误</br>仅仅接受http/https/data链接',
						textScale: '文字大小缩放'
					},
					ClassName: {
						BgImage: 'plus-cbty-image',
						BgCover: 'plus-cbty-cover',
						CSSCommon: 'plus-beautifier-common',
						CSSNovel: 'plus-beautifier-novel',
						CSSReview: 'plus-beautifier-review',
					},
					CSS: {
						Common: ':not(.plus-cbty)>:is(.plus-cbty-image, .plus-cbty-cover) {display: none;}.plus-cbty .plus-cbty-image {position: fixed;top: 0;left: 0;z-index: -2;width: 100vw;height: 100vh;}.plus-cbty .plus-cbty-cover {position: fixed;top: 0;left: calc((100vw - 960px) / 2);z-Index: -1;width: 960px;height: 100vh;backdrop-filter: blur([CoverBlur-Light]px);}.plus-cbty.plus-darkmode .plus-cbty-cover {backdrop-filter: blur([CoverBlur-Dark]px);}.plus-cbty .plus-cbty-cover::before {content: "";position: absolute;top: 0;right: 0;left: 0;bottom: 0;z-index:-1;background-color: [CoverColor-Light];opacity: [CoverOpacity-Light];}.plus-cbty.plus-darkmode .plus-cbty-cover::before {background-color: [CoverColor-Dark];opacity: [CoverOpacity-Dark];}body.plus-cbty {overflow: auto;margin: 0;}body.plus-cbty>:is(.main, table.css) {position: relative;margin-left: calc((100vw - 960px) / 2);}.plus-cbty :is(.textarea, .text) {background-color: rgba(255,255,255,0.9);}.plus-cbty #headlink{background-color: rgba(255,255,255,0.1);}.plus-cbty:is(.plus-darkmode, :not(.plus-darkmode)) :is(table.grid td, .odd, .even, .blockcontent) {background-color: transparent !important;}.plus-cbty:is(.plus-darkmode, :not(.plus-darkmode)) :is(.pagelink, .pagelink strong, .pagelink a:hover) {background-color: transparent;}.DoNotUse.plus-cbty:is(.plus-darkmode, :not(.plus-darkmode)) :is(.main.m_top, .nav, .navinner, .navlist, .nav li, .nav a.current, .nav a:hover, .nav a:active):not(#NotAElement>#NotAElement) {background: transparent;}.plus-cbty #mask {width: 100vw !important;height: 100vh !important;}.plus-cbty :is(.blocktitle, .nav, a) {user-select: none;}',
						Novel: 'body.plus-cbty {width: 100vw;height: 100vh;overflow: overlay;margin: 0px;background-color: rgba(255,255,255,0.7);}.plus-cbty #contentmain {overflow-y: auto;height: calc(100vh - [H]);min-width: 0px;max-width: [W];}.plus-cbty :is(#adv1, #adtop, #headlink, #footlink, #adbottom) {overflow: overlay;min-width: 0px;max-width: 100vw;}.plus-cbty :is(#adv900, #adv5) {max-width: 100vw;}.plus-cbty #contentmain {scrollbar-color: rgba(0,0,0,0.4) rgba(255,255,255,0.3);}.plus-cbty img.imagecontent{width:100% }.plus-cbty #contentmain::-webkit-scrollbar-thumb {background-color: rgba(0,0,0,0.4);}.plus-cbty #contentmain::-webkit-scrollbar {background-color: rgba(255,255,255,0.3);}',
						Review: '.plus-cbty #content > table > tbody > tr > td {background-color: transparent;overflow: auto;}.plus-cbty:is(.plus-darkmode, :not(.plus-darkmode)) :is(table.grid th, form[name="frmreview"] caption, input[type="checkbox"]::after) {background-color: transparent;}.plus-cbty #content {height: 100vh;overflow: auto;}.plus-cbty :is(.m_top, .m_head, .main.nav, .m_foot) {display: none;}.plus-cbty .main {margin-top: 0px;}.plus-cbty #content>table>tbody>tr{font-size: [S]%;line-height: 100%;}.plus-cbty :is(.jieqiQuote, .jieqiCode, .jieqiNote) {font-size: inherit;}.plus-cbty #content>table>tbody>tr>td:nth-of-type(2) {overflow-wrap: anywhere;}.plus-cbty #content>table>tbody>tr>td:nth-of-type(2) a {user-select: auto;}.plus-cbty .jieqiQuote *{overflow-wrap:break-word;max-width:calc(937px / 100 * 80);}.plus-cbty form[name="frmreview"]{position:relative;}'
					}
				};

				// Config
				const CM = new ConfigManager(FuncInfo.Config_Ruleset);
				const CONFIG = CM.Config;
				CM.updateAllConfigs();

				// Beautifier pages
				detectDom({
                    selector: 'body',
                    callback: function() {
                        const API = getAPI();
                        if (/\.(jpe?g|png|webp|gif|bmp|txt|js|css)/.test(location.pathname)) {
                            // Stop running in image, code, or pure text papes
                            return false;
                        } else if ((API[0] === 'novel' || location.pathname.match(/\/modules\/article\/reader.php/)) && unsafeWindow.chapter_id !== '0') {
                            CONFIG.novel.enable && (document.readyState !== 'loading' ? novel() : $AEL(document, 'DOMContentLoaded', e => novel()));
                        } else if (API.join('/') === 'modules/article/reviewshow.php') {
                            //CONFIG.review.enable && (document.readyState !== 'loading' ? review() : $AEL(window, 'load', e => review()));
                            CONFIG.review.enable && detectDom('.main.m_foot', e => review());
                        } else {
                            CONFIG.common.enable && common();
                        }
                    }
				});

				return {};

				// Beautifier for all wenku pages
				function common(from='common') {
					const src = (CONFIG[from] && CONFIG[from].image) || CONFIG.image;

					if (src) {
						const img = $CrE('img');
						img.src = src;
						img.classList.add(CONST.ClassName.BgImage);
						document.body.appendChild(img);
					}

					const cover = $CrE('div');
					cover.classList.add(CONST.ClassName.BgCover);
					document.body.appendChild(cover);

					document.body.classList.add('plus-cbty');
					addStyle(replaceText(CONST.CSS.Common, {
						'[CoverBlur-Light]': CONFIG.common.cover.light.blur.toString(),
						'[CoverOpacity-Light]': (CONFIG.common.cover.light.opacity / 100).toString(),
						'[CoverColor-Light]': CONFIG.common.cover.light.color.toString(),
						'[CoverBlur-Dark]': CONFIG.common.cover.dark.blur.toString(),
						'[CoverOpacity-Dark]': (CONFIG.common.cover.dark.opacity / 100).toString(),
						'[CoverColor-Dark]': CONFIG.common.cover.dark.color.toString(),
					}), CONST.ClassName.CSSCommon);
					return true;
				}

				// Novel reading page
				function novel() {
					common('novel');

					const src = CONFIG.novel.image || CONFIG.image;
					const usedHeight = getRestHeight();
					const contentWidth = CONFIG.novel.center ? '958px' : '100vw';

					addStyle(CONST.CSS.Novel
						 .replaceAll('[BGI]', src)
						 .replaceAll('[H]', usedHeight)
						 .replaceAll('[W]', contentWidth),
						 CONST.ClassName.CSSNovel
					);

					document.ondblclick = beautiful_beginScroll;
					document.onmousedown = beautiful_stopScroll;
					unsafeWindow.scrolling = beautiful_scrolling;

					// Get rest height without #contentmain
					function getRestHeight() {
						let usedHeight = 0;
						['adv1', 'adtop', 'headlink', 'footlink', 'adbottom'].forEach((id) => {
							const node = $('#'+id);
							if (node instanceof Element && node.id !== 'contentmain') {
								const cs = getComputedStyle(node);
								['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTop', 'borderBottom'].forEach((style) => {
									const reg = cs[style].match(/([\.\d]+)px/);
									reg && (usedHeight += parseInt(reg[1], 10));
								});
							};
						});
						usedHeight = usedHeight.toString() + 'px';
						return usedHeight;
					}

					// Prevent dblclick-selecting text while dblclick start scrolling
					function beautiful_beginScroll(e) {
						// filter alertify and sidepanel
						let elm = e.target;
						const FORBID = {
							classes: ['alertify'],
							ids: ['sidepanel-panel']
						};
						while (elm = elm.parentElement) {
							if ([...elm.classList].some(cls => FORBID.classes.includes(cls)) || FORBID.ids.includes(elm.id)) {
								return;
							}
						}

						unsafeWindow.timer = setInterval(beautiful_scrolling, 300 / unsafeWindow.speed);
						$('#contentmain').style.userSelect = 'none';
					}
					function beautiful_stopScroll() {
						clearInterval(unsafeWindow.timer);
						$('#contentmain').style.userSelect = '';
					}

					// Mouse dblclick scroll with beautifier applied
					function beautiful_scrolling() {
						var contentmain = $('#contentmain');
						var currentpos = contentmain.scrollTop || 0;
						contentmain.scrollTo(0, ++currentpos);
						var nowpos = contentmain.scrollTop || 0;
						if(currentpos != nowpos) unsafeWindow.clearInterval(unsafeWindow.timer);
					}
				}

				// Review reading page
				function review() {
					common('review');

					const src = CONFIG.review.image || CONFIG.image;
					const textScale = CONFIG.review.textScale;
					const main = $('#content');
					const recScrollY = e => {
						//scrollY = unsafeWindow.scrollY - ['.main.m_top', '.main.m_head', '.main.nav'].reduce((height, selector) => height + $(selector).scrollHeight, 0);
						scrollY = $('html').scrollTop - ['.main.m_top', '.main.m_head', '.main.nav'].reduce((height, selector) => height + $(selector).scrollHeight, 0);
					};
					let scrollY = 0;
					recScrollY();
					$AEL(window, 'scroll', recScrollY);
					addStyle(CONST.CSS.Review
							 .replaceAll('[BGI]', src)
							 .replaceAll('[S]', textScale.toString())
							 , CONST.ClassName.CSSReview);
					main.scrollTo(0, scrollY); // Cannot record scrollY correctly (always finds window.scrollY = 0 when recording), so stop this feature for a while
					window.removeEventListener('scroll', recScrollY);
					//hookPosition();
					// 2023-06-21 With new CSS specified form[name="frmreview"]{position:relative;}, there's no need to hook UBBEditor.GetPosotion anymore

					// Deletable
					function hookPosition() {
						if (typeof unsafeWindow.UBBEditor !== 'object') {
							hookPosition.wait = hookPosition.wait ? hookPosition.wait : 0;
							if (++hookPosition.wait > 50) {return false;}
							hookPosition.wait % 10 === 0 && DoLog('hookPosition: UBBEditor not loaded, waiting...');
							setTimeout(hookPosition, 500);
							return false;
						}
						unsafeWindow.UBBEditor.GetPosition = function (obj) {
							var r = new Array();
							r.x = obj.offsetLeft;
							r.y = obj.offsetTop;
							while (obj = obj.offsetParent) {
								if (unsafeWindow.$(obj).getStyle('position') == 'absolute' || unsafeWindow.$(obj).getStyle('position') == 'relative') break;
								r.x += obj.offsetLeft;
								r.y += obj.offsetTop;
							}
							r.x -= main.scrollLeft;
							r.y -= main.scrollTop;
							return r;
						}
					}
				}

				function getAPI() {
					return location.pathname.replace(/^\//, '').split('/');
				}
			},
			setting: function setter() {
				const SettingPanel = require('SettingPanel');
				const CONST = {
					Text: {
						CommonBeautify: '通用页面美化',
						NovelBeautify: '阅读页面美化',
						ReviewBeautify: '书评页面美化',
						DefaultBeautify: '默认页面美化图片',
						Enable: '启用',
						BackgroundImage: '背景图片',
						AlertTitle: '页面美化设置',
						InvalidImageUrl: '图片链接格式错误</br>仅仅接受http/https/data链接',
						CenterText: '保持正文文字居中',
						textScale: '文字大小缩放',
						CoverColorLight: '遮罩层颜色',
						CoverOpacityLight: '遮罩层不透明度',
						CoverBlurLight: '遮罩层背景模糊',
						CoverColorDark: '遮罩层颜色(深色模式)',
						CoverOpacityDark: '遮罩层不透明度(深色模式)',
						CoverBlurDark: '遮罩层背景模糊(深色模式)',
					}
				}

				const CM = new ConfigManager(FuncInfo.Config_Ruleset);
				CM.updateAllConfigs();

				const SetPanel = new SettingPanel.easySettings({
					title: CONST.Text.AlertTitle,
					areas: [{
						title: CONST.Text.CommonBeautify,
						items: [{
							text: CONST.Text.Enable,
							path: 'common/enable',
							type: 'boolean'
						}, {
							text: CONST.Text.BackgroundImage,
							path: 'common/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}, {
							text: CONST.Text.CoverColorLight,
							path: 'common/cover/light/color',
							type: ['string']
						}, {
							text: CONST.Text.CoverOpacityLight,
							path: 'common/cover/light/opacity',
							type: ['number'],
							children: $$CrE({
								tagName: 'span',
								props: { innerText: '%' }
							})
						}, {
							text: CONST.Text.CoverBlurLight,
							path: 'common/cover/light/blur',
							type: ['number']
						}, {
							text: CONST.Text.CoverColorDark,
							path: 'common/cover/dark/color',
							type: ['string']
						}, {
							text: CONST.Text.CoverOpacityDark,
							path: 'common/cover/dark/opacity',
							type: ['number'],
							children: $$CrE({
								tagName: 'span',
								props: { innerText: '%' }
							})
						}, {
							text: CONST.Text.CoverBlurDark,
							path: 'common/cover/dark/blur',
							type: ['number']
						}]
					}, {
						title: CONST.Text.NovelBeautify,
						items: [{
							text: CONST.Text.Enable,
							path: 'novel/enable',
							type: 'boolean'
						}, {
							text: CONST.Text.BackgroundImage,
							path: 'novel/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}, {
							text: CONST.Text.CenterText,
							path: 'novel/center',
							type: 'boolean'
						}]
					}, {
						title: CONST.Text.ReviewBeautify,
						items: [{
							text: CONST.Text.Enable,
							path: 'review/enable',
							type: 'boolean'
						}, {
							text: CONST.Text.BackgroundImage,
							path: 'review/image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}, {
							text: CONST.Text.textScale,
							path: 'review/textScale',
							type: 'number',
							children: $$CrE({
								tagName: 'span',
								props: { innerText: '%' }
							})
						}]
					}, {
						title: CONST.Text.DefaultBeautify,
						items: [{
							text: CONST.Text.BackgroundImage,
							path: 'image',
							type: ['image', 'string'],
							checker: imageUrlChecker,
						}]
					}]
				}, CM);

				/*
				const Panel = SettingPanel.SettingPanel;
				const _SetPanel = new Panel({
					buttons: 'saver',
					header: CONST.Text.AlertTitle,
					tables: [{
						rows: [{
							blocks: [{
								isHeader: true,
								colSpan: 2,
								innerText: CONST.Text.CommonBeautify
							}]
						},{
							blocks: [{
								innerText: CONST.Text.Enable
							},{
								options: [{
									path: 'common/enable',
									type: 'boolean'
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.BackgroundImage
							},{
								options: [{
									path: 'common/image',
									type: ['image', 'string'],
									checker: imageUrlChecker,
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverColorLight
							},{
								options: [{
									path: 'common/cover/light/color',
									type: ['string']
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverOpacityLight
							},{
								options: [{
									path: 'common/cover/light/opacity',
									type: ['number']
								}],
								children: [(() => {
									const span = $CrE('span');
									span.innerText = '%';
									return span;
								}) ()]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverBlurLight
							},{
								options: [{
									path: 'common/cover/light/blur',
									type: ['number']
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverColorDark
							},{
								options: [{
									path: 'common/cover/dark/color',
									type: ['string']
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverOpacityDark
							},{
								options: [{
									path: 'common/cover/dark/opacity',
									type: ['number']
								}],
								children: [(() => {
									const span = $CrE('span');
									span.innerText = '%';
									return span;
								}) ()]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CoverBlurDark
							},{
								options: [{
									path: 'common/cover/dark/blur',
									type: ['number']
								}]
							}]
						}]
					},{
						rows: [{
							blocks: [{
								isHeader: true,
								colSpan: 2,
								innerText: CONST.Text.NovelBeautify
							}]
						},{
							blocks: [{
								innerText: CONST.Text.Enable
							},{
								options: [{
									path: 'novel/enable',
									type: 'boolean'
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.BackgroundImage
							},{
								options: [{
									path: 'novel/image',
									type: ['image', 'string'],
									checker: imageUrlChecker,
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.CenterText
							},{
								options: [{
									path: 'novel/center',
									type: 'boolean'
								}]
							}]
						}]
					},{
						rows: [{
							blocks: [{
								isHeader: true,
								colSpan: 2,
								innerText: CONST.Text.ReviewBeautify
							}]
						},{
							blocks: [{
								innerText: CONST.Text.Enable
							},{
								options: [{
									path: 'review/enable',
									type: 'boolean'
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.BackgroundImage
							},{
								options: [{
									path: 'review/image',
									type: ['image', 'string'],
									checker: imageUrlChecker,
								}]
							}]
						},{
							blocks: [{
								innerText: CONST.Text.textScale
							},{
								options: [{
									path: 'review/textScale',
									type: 'number'
								}],
								children: [(() => {
									const span = $CrE('span');
									span.innerText = '%';
									return span;
								}) ()]
							}]
						}]
					},{
						rows: [{
							blocks: [{
								isHeader: true,
								colSpan: 2,
								innerText: CONST.Text.DefaultBeautify
							}]
						},{
							blocks: [{
								innerText: CONST.Text.BackgroundImage
							},{
								options: [{
									path: 'image',
									type: ['image', 'string'],
									checker: imageUrlChecker,
								}]
							}]
						}]
					}]
				}, CM);
				*/

				function imageUrlChecker(e, value) {
					if (value && !value.match(/.+:/)) {
						alertify.alert(CONST.Text.AlertTitle, CONST.Text.InvalidImageUrl);
						return false;
					}
					e.target.value = value || null;
					return true;
				}

				function opacityChecker(e, value) {
					return value >= 0 && value <= 100
				}
			},
		},

		// AdBlock
		{
			name: '广告拦截',
			description: '去除书籍目录页面和章节阅读页面的横幅广告',
			id: 'adblock',
			system: false,
			checker: {
				type: 'regurl',
				value: [
					// Reading page
					/^https?:\/\/www\.wenku8\.(net|cc)\/novel\//,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reader\.php/,

					// .h_banner
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/index\.php/,
				]
			},
			func: function() {
				const utils = require('utils');

				const rulepages = [{
					checker: {
						type: 'regurl',
						value: [
							/^https?:\/\/www\.wenku8\.(net|cc)\/novel\//,
							/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reader.php/,
						]
					},
					rules: [{
						type: 'selector',
						value: '#adv900'
					}, {
						type: 'selector',
						value: '#adv300'
					}, /*{
						type: 'selector',
						value: '#adbottom'
					},*/ {
						type: 'selector',
						value: '#adv1'
					},/* {
						type: 'selector',
						value: '#adtop'
					}*/]
				}, {
					checker: {
						type: 'regurl',
						value: [
							/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
							/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php/,
							/^https?:\/\/www\.wenku8\.(net|cc)\/index\.php/,
						]
					},
					rules: [{
						type: 'selector',
						value: '.main.m_head>.h_banner>*'
					}]
				}];

				for (const page of rulepages) {
					if ((!page.checker || utils.testChecker(page.checker))) {
						for (const rule of page.rules) {
							deal(rule);
						}
					}
				}

				function deal(rule) {
					({
						'selector': async function(selector) {
							(await detectDom(selector)).remove()
							//$(selector) && [...$All(selector)].forEach(elm => elm.remove());
						}
					})[rule.type](rule.value);
				}
			}
		},

		// Reader Enhance
		{
			name: '阅读增强',
			description: '在线阅读页面优化',
			id: 'ReaderEnhance',
			system: false,
			checker: {
				type: 'func',
				value: () => {
					return location.pathname.startsWith('/novel/') && location.pathname.split('/').pop() !== 'index.htm';
				}
			},
			func: function() {
				const SidePanel = require('SidePanel');

				const CONST = {
					Text: {
						PreviousChapter: '上一章',
						NextChapter: '下一章'
					},
					FontSizes: [8,10,12,14,16,18,24,30,36,42,48,54,60,70,80,90,100],
					FontColors: {
						'暗白': '#C8C8C8'
					}
				};

				// Wait till wenku8 script loaded, so detectDom is not enough
				$AEL(window, 'load', e => CSMwork());
				hotkeyJumppage();

				function CSMwork() {
					const CSM = new ConfigSetManager();
					CSM.install();

					sideButtons();
					moreFontColors();
					moreFontSizes();
					fontChanger();
					unsafeWindow.loadSet();

					function sideButtons() {
						SidePanel.insert({
							index: 2,
							faicon: 'fa-solid fa-chevron-left',
							tip: CONST.Text.PreviousChapter,
							onclick: e => $('#foottext>a:nth-of-type(3)').click()
						});
						SidePanel.insert({
							index: 2,
							faicon: 'fa-solid fa-chevron-right',
							tip: CONST.Text.NextChapter,
							onclick: e => $('#foottext>a:nth-of-type(4)').click()
						});
					}

					function moreFontColors() {
						const select = $('#txtcolor');

						// make options
						for (const [name, color] of Object.entries(CONST.FontColors)) {
							const option = $$CrE({
								tagName: 'option',
								props: {
									innerText: name,
									value: color
								}
							});
							select.appendChild(option);
						}
					}

					function moreFontSizes() {
						const select = $('#fonttype');
						const options = [...select.children];

						// make options
						for (const size of CONST.FontSizes) {
							const strSize = `${size}px`;
							const oriOption = options.find(o => o.value === strSize);
							if (oriOption) {
								// modify old option text
								oriOption.innerText = `${strSize}(${oriOption.innerText})`;
							} else {
								// make new option
								const option = $CrE('option');
								option.innerText = option.value = strSize;
								options.push(option);
							}
						}

						// sort options
						const getSizeNum = o => Math.floor(o.value.match(/\d+/)[0]);
						options.sort((o1, o2) => getSizeNum(o1) - getSizeNum(o2));

						// append to select
						options.forEach(o => select.appendChild(o));
					}

					// Provide font changer
					function fontChanger() {
						// Button
						const bcolor = $('#bcolor');
						const txtfont = $CrE('select');
						txtfont.id = 'txtfont';
						txtfont.addEventListener('change', e => CSM.ConfigSets.txtfont.set());
						bcolor.insertAdjacentElement('afterend', txtfont);
						bcolor.insertAdjacentText('afterend', '\t\t\t  字体选择');

						// Provided fonts
						const FONTS = [{"name":"默认","value":"unset"}, {"name":"微软雅黑","value":"Microsoft YaHei"},{"name":"黑体","value":"SimHei"},{"name":"微软正黑体","value":"Microsoft JhengHei"},{"name":"宋体","value":"SimSun"},{"name":"仿宋","value":"FangSong"},{"name":"新宋体","value":"NSimSun"},{"name":"细明体","value":"MingLiU"},{"name":"新细明体","value":"PMingLiU"},{"name":"楷体","value":"KaiTi"},{"name":"标楷体","value":"DFKai-SB"}]
						for (const font of FONTS) {
							const option = $CrE('option');
							option.innerText = font.name;
							option.value = font.value;
							txtfont.appendChild(option);
						}

						// Function
						CSM.ConfigSets.txtfont = {
							type: 'select',
							cookie: 'txtfont',
							default: 'unset',
							element: txtfont,
							effect: value => $('#content').style['font-family'] = value
						};
						CSM.initSet(CSM.ConfigSets.txtfont);

						// Load saved font
						CSM.ConfigSets.txtfont.load();
					}
				}

				function ConfigSetManager() {
					const CSM = this;
					CSM.initSet = initSet;
					CSM.saveSet = saveSet;
					CSM.loadSet = loadSet;
					CSM.install = install;

					// Config sets
					CSM.ConfigSets = {
						'bcolor': {
							type: 'select',
							cookie: 'bcolor',
							default: '#f6f6f6',
							element: unsafeWindow.bcolor,
							effect: value => document.bgColor = value
						},
						'txtcolor': {
							type: 'select',
							cookie: 'txtcolor',
							default: '#000000',
							element: unsafeWindow.txtcolor,
							effect: value => $('#content').style.color = value
						},
						'fonttype': {
							type: 'select',
							cookie: 'fonttype',
							default: '16px',
							element: unsafeWindow.fonttype,
							effect: value => $('#content').style.fontSize = value
						},
						'scrollspeed': {
							type: 'input',
							cookie: 'scrollspeed',
							default: 5,
							element: unsafeWindow.scrollspeed,
							effect: value => unsafeWindow.setSpeed()
						}
					};

					// Init Config sets
					for (const set of Object.values(CSM.ConfigSets)) {
						initSet(set);
					}

					function initSet(set) {
						set.get = () => ({'select': () => set.element.value, 'input': () => set.element.value})[set.type]();
						set.set = () => set.effect(set.get());
						set.save = () => unsafeWindow.setCookies(set.cookie, set.get());
						set.load = () => ({
							'select': () => {
								const savedVal = unsafeWindow.ReadCookies(set.cookie) || set.default;
								const index = [...set.element.options].findIndex(o => o.value === savedVal);
								set.element.selectedIndex = index;
								set.set();
							},
							'input': () => set.element.value = unsafeWindow.ReadCookies(set.cookie) || set.default
						})[set.type]();
					}

					function saveSet() {
						for (const [name, set] of Object.entries(CSM.ConfigSets)) {
							set.save();
						}
					};

					function loadSet() {
						for (const [name, set] of Object.entries(CSM.ConfigSets)) {
							set.load();
						}
					};

					function install() {
						Object.defineProperty(unsafeWindow, 'saveSet', {
							configurable: false,
							enumerable: true,
							value: CSM.saveSet,
							writable: false
						});
						Object.defineProperty(unsafeWindow, 'loadSet', {
							configurable: false,
							enumerable: true,
							value: CSM.loadSet,
							writable: false
						});
					};
				}

				// Make sure hotkey jumppage works
				function hotkeyJumppage() {
					$AEL(document, 'keydown', e => unsafeWindow.jumpPage && unsafeWindow.jumpPage());
				}
			}
		},

		// Bookcase Manager
		{
			name: '书架管理器',
			description: '书架功能增强',
			id: 'BookcaseManager',
			system: false,
			checker: {
				type: 'regurl',
				value: /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/bookcase.php(\?[\s\S]*)?$/,
			},
			func: function() {
				const autovote = FL_getFunction('autovote').enabled ? require('autovote') : null;
				const WenkuBlockGUI = require('WenkuBlockGUI');
				const mousetip = require('mousetip');
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');
				const CONST = {
					Text: {
						RemoveConfirm: '确实要将选中书目移出书架么？',
						RemoveConfirm_Title: '移出书架',
						EnterName: '设置此书架的名称为：',
						EnterName_Title: '设置名称',
						RenameHint: '双击我，为我取个好听的名字吧(ˊᗜˋ*)..',
						Moveto: '移动到 {NAME}',
						Autovote: '自动推书',
						VoteNow: '立即推书',
						TodayVoted: '今日已推书',
						TodayNotVoted: '今日尚未推书'
					},
					DomRes: {
						BookcaseWidth: ['3%', '19%', '9%', '25%', '20%', '9%', '5%', '10%']
					},
					Config_Ruleset: {
						'version-key': 'config-version',
						'ignores': ["LOCAL-CDN"],
						'defaultValues': {
							//'config-key': {},
							bookcaseNames: ['默认书架', '第1组书架', '第2组书架', '第3组书架', '第4组书架', '第5组书架']
						},
						'updaters': {
							/*'config-key': [
								function() {
									// This function contains updater for config['config-key'] from v0 to v1
								},
								function() {
									// This function contains updater for config['config-key'] from v1 to v2
								}
							]*/
						}
					}
				};
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				const observer = detectDom({
                    selector: '#checkform',
                    callback: async function() {
                        observer.disconnect();
                        await mergeBookcase();
                        nameBookcase();
                        autovoteGUI();
                    }
				});

				async function mergeBookcase(onAllMerged) {
					const curform = $('#checkform');
					const cur_classid = getFormClassid(curform);
					const AM = new AsyncManager();
					dealform(curform);
                    await Promise.all([0,1,2,3,4,5].map(async classid => {
                        if (classid === cur_classid) { return Promise.resolve(); }
						const url = `https://${location.host}/modules/article/bookcase.php?classid=${classid}${utils.getLang() ? '&charset=big5' : ''}`;
						const oDom = await utils.getDocument(url);
						const form = $(oDom, '#checkform');
                        dealform(form);
						insertform(form);
                    }));

					function dealform(form) {
						form.onsubmit = check_confirm.bind(null, form);
					}

					function insertform(form) {
						const content = $('#content')
						const forms = [...$All(content, '#checkform'), form];
						forms.sort((f1, f2) => getFormClassid(f1) - getFormClassid(f2));
						forms.forEach(f => content.appendChild(f));
					}

					function check_confirm(form, e) {
						if (e.submitter.name !== 'btnsubmit') {return false;}
						const checknum = [...$All(form, 'input[name="checkid[]"]')].filter(input => input.checked).length;
						if (checknum == 0) {
							alertify.alert('请先选择要操作的书目！');
							return false;
						}
						const newclassid = $(form, '#newclassid');
						if (newclassid.value == -1) {
							alertify.confirm(CONST.Text.RemoveConfirm_Title, CONST.Text.RemoveConfirm, form.submit.bind(form), function() {});
							return false;
						} else {
							return true;
						}
					}
				}

				function nameBookcase() {
					const content = $('#content')
					for (const form of $All(content, '#checkform')) {
						deal(form);
					}

					function deal(form) {
						const titlebar = $(form, '.gridtop');
						const classid = getFormClassid(form);

						// Hide select
						$(form, 'select[name="classlist"]').style.display = 'none';

						// Display name
						titlebar.childNodes[0].nodeValue = CONFIG.bookcaseNames[classid];

						// Display name in select#newclassid
						[...$(form, '#newclassid').children].forEach(option => {
							const classid = Math.floor(option.value);
							if (classid >= 0) {
								option.innerText = replaceText(CONST.Text.Moveto, {'{NAME}': CONFIG.bookcaseNames[classid]});
							}
						});

						// Edit
						$AEL(titlebar, 'dblclick', function() {
							titlebar.style.userSelect = 'none';
							alertify.prompt(CONST.Text.EnterName_Title, CONST.Text.EnterName, CONFIG.bookcaseNames[classid], function(e, value) {
								CONFIG.bookcaseNames[classid] = value;
								titlebar.childNodes[0].nodeValue = value;
								titlebar.style.removeProperty('user-select');
							}, function() {
								titlebar.style.removeProperty('user-select');
							});
						});

						// Edit hint
						mousetip.settip(titlebar, CONST.Text.RenameHint);
					}
				}

				function autovoteGUI() {
					if (!autovote) {return false;}

					// Edit header tr
					for (const headTr of $All('tr[align="center"]')) {
						// Add vote column
						const th = $CrE('th');
						th.innerText = CONST.Text.Autovote;
						headTr.appendChild(th);

						// Modify width
						for (let i = 0; i < headTr.children.length; i++) {
							headTr.children[i].setAttribute('width', CONST.DomRes.BookcaseWidth[i]);
						}
					}

					// Edit book tr
					for (const bookTr of $All('#checkform tbody tr:not([align="center"]):not(:last-child)')) {
						const bookInfo = getBookInfo(bookTr);
						const td = $CrE('td');
						const input = $CrE('input');
						input.type = 'number';
						input.inputmode = 'numeric';
						input.style.width = '85%';
						input.setAttribute('form', '');
						input.value = autovote.getVoteNum(bookInfo.aid);
						$AEL(input, 'change', saveAutovotes.bind(input, bookInfo));
						td.style.textAlign = 'center';
						td.appendChild(input);
						bookTr.appendChild(td);
					}

					// add autovote block
					const left = $('#left');
					$(left, '.block:last-child').remove();
					const block = WenkuBlockGUI.makeBookcaseBlock({
						title: CONST.Text.Autovote,
						links: [{
							text: autovote.todayVoted() ? CONST.Text.TodayVoted : CONST.Text.TodayNotVoted,
							classes: CommonStyle.ClassName.Text,
							styles: {'cursor': 'default'}
						},{
							text: CONST.Text.VoteNow,
							listeners: [
								['click', e => autovote.checkRun(true)]
							],
							classes: CommonStyle.ClassName.Button
						}]
					});
					left.appendChild(block.block);

					function saveAutovotes(bookInfo, e) {
						const vote = Math.floor(this.value);
						vote >= 0 && autovote.setAutoVote({...bookInfo, vote});
						this.value = autovote.getVoteNum(bookInfo.aid);
					}

					function getBookInfo(bookTr) {
						return {
							aid: getUrlArgv($(bookTr.children[1], 'a[href*="readbookcase.php"]').href, 'aid'),
							name: $(bookTr.children[1], 'a[href*="readbookcase.php"]').innerText,
							author: $(bookTr, 'a[href*="authorarticle.php"]').innerText,
						}
					}
				}

				function getFormClassid(form) {
					return Math.floor($(form, 'select[name="classlist"]').value);
				}
			}
		},

		// Autovote
		{
			name: '自动推书',
			description: '每日自动按照设定好的次数和书籍完成[推一下]任务',
			id: 'autovote',
			system: false,
			checker: {
				type: 'switch',
				value: true
			},
			func: function() {
				const CONST = {
					URL: {
						Vote: `https://${location.host}/modules/article/uservote.php?id={AID}`
					},
					Text: {
						ConfirmTitle: '手动运行自动推书',
						ConfirmRepeatVote: '今天已运行过自动推书了，是否还要再次运行自动推书？',
						VoteTitle: '自动推书',
						VoteStart: '正在自动推书...',
						VoteFinish: '自动推书完毕，共完成{FINISH}次推书任务, 失败{ERROR}次</br>点击这里显示详情',
						VoteOverflow: '注意：当前设置的自动推书总数量({ALL})超出了账号每日最多推书数量({MAX})',
						VoteSaved: '已保存：每日推荐 {NAME} {NUM}次<br>当前总推荐次数为 {ALL} 次',
						VoteDeleted: '已设置：不再每日推荐 {NAME}<br>当前总推荐次数为 {ALL} 次',
						VoteNumLessThanZero: '不可设置每日推荐次数为负数！',
					},
					Config_Ruleset: {
						'version-key': 'config-version',
						'ignores': ["LOCAL-CDN"],
						'defaultValues': {
							//'config-key': {},
							autovotes: {},
							lastrun: '0000-00-00',
						},
						'updaters': {
							/*'config-key': [
								function() {
									// This function contains updater for config['config-key'] from v0 to v1
								},
								function() {
									// This function contains updater for config['config-key'] from v1 to v2
								}
							]*/
						}
					}
				}
				const utils = require('utils');

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				checkRun();
				return {todayVoted, checkRun, setAutoVote, getVoteInfo, getVoteNum};

				function checkRun(userConfirm=false) {
					if (!todayVoted()) {
						run();
					} else if (userConfirm) {
						alertify.confirm(CONST.Text.ConfirmTitle, CONST.Text.ConfirmRepeatVote, run, function() {});
					}
				}

				function todayVoted() {
					return utils.getTime('-', false) === CONFIG.lastrun;
				}

				function run() {
					const autovotes = CM.getConfig('autovotes');
					const all = Object.keys(autovotes).length;
					if (all) {
						const AM = new AsyncManager();
						let finish = 0, error = 0, results = [];
						alertify.notify(CONST.Text.VoteStart);

						for (const voteObj of Object.values(autovotes)) {
							const url = replaceText(CONST.URL.Vote, {'{AID}': voteObj.aid});
							for (let i = 0; i < voteObj.vote; i++) {
								request(url, e => {
									utils.parseDocument(e.response, oDoc => {
										try {
											results.push({
												voteObj,
												title: $(oDoc, '.blocktitle').innerText,
												content: $(oDoc, '.blockcontent>div:first-child').innerText
											});
											finish++; AM.finish();
										} catch(err) {
											error++; AM.finish();
										}
									});
								}, e => { error++; AM.finish(); });
								AM.add();
							}
						}

						AM.onfinish = function() {
							const message = replaceText(CONST.Text.VoteFinish, {'{FINISH}': finish, '{ERROR}': error});
							const box = alertify.success(message, undefined, clicked => {
								if (clicked) {
									const content = results.map(r => `[${r.voteObj.name}]<br>${r.title}<br>${r.content}`).join('<br><br>');
									alertify.alert(CONST.Text.VoteTitle, content);
								}
							});
							CONFIG.lastrun = utils.getTime('-', false);
						}
						AM.finishEvent = true;
					}
				}

				function setAutoVote(voteObj) {
					if (voteObj.vote > 0) {
						CONFIG.autovotes[voteObj.aid] = voteObj;
						notify(replaceText(CONST.Text.VoteSaved, { '{NAME}': voteObj.name, '{NUM}': voteObj.vote , '{ALL}': total() }));
					} else if (voteObj.vote === 0) {
						delete CONFIG.autovotes[voteObj.aid];
						notify(replaceText(CONST.Text.VoteDeleted, { '{NAME}': voteObj.name, '{ALL}': total() }));
					} else {
						alertify.warning(CONST.Text.VoteNumLessThanZero);
					}

					function notify(content) {
						if (setAutoVote.box) {
							setAutoVote.box.setContent(content);
							clearTimeout(setAutoVote.timer);
						} else {
							setAutoVote.box = alertify.message(content, 0);
						}
						setAutoVote.timer = setTimeout(() => {
							setAutoVote.box.dismiss();
							delete setAutoVote.box;
						}, 5000);
					}

					function total() {
						return Object.values(CONFIG.autovotes).reduce((all, obj) => all + obj.vote, 0);
					}
				}

				function getVoteInfo(aid) {
					return CONFIG.autovotes[aid];
				}

				function getVoteNum(aid) {
					const voteInfo = CONFIG.autovotes[aid];
					return voteInfo ? voteInfo.vote : 0;
				}

				function request(url, onload, onerror, retry=3) {
					tryReq(retry);

					function tryReq(retry=3) {
						GM_xmlhttpRequest({
							method: 'GET', url,
							responseType: 'blob',
							timeout: 15 * 1000,
							ontimeout: retry > 0 ? e => tryReq(retry-1) : onerror,
							onerror: retry > 0 ? e => tryReq(retry-1) : onerror,
							onload: onload
						});
					}
				}
			},
			setting: function() {
				window.open(`https://${location.host}/modules/article/bookcase.php`);
			}
		},

		// ReadingPlan
		{
			name: '稍后再读',
			description: '本地稍后再读',
			id: 'ReadingPlan',
			system: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/index\.php\/?/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php/
				]
			},
			func: function() {
				const WenkuBlockGUI = require('WenkuBlockGUI');
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');

				const CONST = {
					Text: {
						EmptyHint: '-- 稍后再读的书籍会显示在这里 --',
						IndexTitle: '稍后再读(拖动调整顺序)',
						ConfirmRemoval: '确定要将《<a href="{url}" class="{Class_Button}">{name}</a>》从稍后再读移除吗？',
						ReaditLater: '稍后再读',
						DontReaditLater: '移出稍后再读',
						Added: '已加入稍后再读',
						Removed: '已从稍后再读中移除',
						MoreThanDisplay: '您已经在稍后再读里面放了{N}本书了！</br>尽管稍后再读理论上可以存放无数本书，但是首页最多只能展示前10本哦～'
					},
					CSS: {
						Index: '.plus_rp_item {position: absolute; top: 0; right: 0; font-size: 2em; border: 1px dashed rgba(0,0,0,0); width: 1em; height: 1em;} .plus_rp_item:hover {border: 1px dashed rgba(0,0,0,0.3);}'
					},
					Config_Ruleset: {
						'version-key': 'config-version',
						'ignores': ["LOCAL-CDN"],
						'defaultValues': {
							//'config-key': {},
							books: [/*{
								aid: 1,
								name: '文学少女',
								url: 'https://www.wenku8.net/book/1.htm',
								cover: 'https://img.wenku8.com/image/1/1973/1973s.jpg'
								// array的排列顺序就是用户手动排列的顺序，默认由旧到新（新加书籍放后面）
							}*/]
						},
						'updaters': {
							/*'config-key': [
								function() {
									// This function contains updater for config['config-key'] from v0 to v1
								},
								function() {
									// This function contains updater for config['config-key'] from v1 to v2
								}
							]*/
						}
					}
				};

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				const functions = [{
					checker: {
						type: 'regurl',
						value: /^https?:\/\/www\.wenku8\.(net|cc)\/index\.php\/?/
					},
					func: function() {
						// Make block
						const block = WenkuBlockGUI.makeIndexCenterToplistBlock({
							title: CONST.Text.IndexTitle,
							books: CM.getConfig('books').filter((book, i) => i < 10)
						});

						// Top-right remove button
						for (const item of block.items) {
							item.b_container.style.position = 'relative';
							item.b_container.appendChild($$CrE({
								tagName: 'i',
								classes: ['fa-solid', 'fa-xmark', CommonStyle.ClassName.Button, 'plus_rp_item'],
								listeners: [['click', function(e) {
									alertify.confirm(
										replaceText(CONST.Text.ConfirmRemoval, {
											'{url}': item.url, '{name}': item.name,
											'Class_Button': CommonStyle.ClassName.Button
										}),
										function onok() {
											CONFIG.books.splice(CONFIG.books.findIndex(b => b.aid === item.aid), 1);
											block.items.splice(block.items.findIndex(b => b.aid === item.aid), 1);
											item.b_container.remove();
											alertify.success(CONST.Text.Removed);
										}
									)
								}]]
							}));
						}

						// Drag-drop to move books
						const sortable = new Sortable.default(block.blockcontent.children[0], {
							draggable: 'div'
						});
						sortable.on('sortable:sorted', function(e) {
							const div = e.dragEvent.data.originalSource;
							const books = moveItem(CM.getConfig('books'), e.oldIndex, e.newIndex);
							CONFIG.books = books;
							/* Wrong coding:
							The following code CANNOT WORK! Because CONFIG.books[index] saves the path that
							contains index, and always gives the current value of this path in GM_storage.
							As we know, moveItem removes arr[from] and then inserts it to arr[to], and
							as moveItem inserts(using arr.splice) CONFIG.books[oldIndex] into newIndex,
							the proxy for CONFIG.books[oldIndex]'s path is currently pointing to
							the new value at CONFIG.books[oldIndex], which is the next book of the
							dragging one! Tempermonkey will look into its(the next book's) props, and save
							them into disk, at CONFIG.books[newIndex], which should be storing the dragging
							book's properties.
							To avoid this from happenning, we get the pure object using CM.getConfig, sort it
							using moveItem, and then save it to GM_storage manually, just like code above.

							The wrong code is written below:
							moveItem(CONFIG.books, e.oldIndex, e.newIndex);
							*/
						});

						// Display hint while no books in reading plan
						if (!CONFIG.books.length) {
							const hint = $CrE('div');
							hint.innerText = CONST.Text.EmptyHint;
							hint.style.color = 'grey';
							hint.style.fontSize = '1.2em';
							block.blockcontent.style.display = 'flex';
							block.blockcontent.style.alignItems = 'center';
							block.blockcontent.style.justifyContent = 'center';
							block.blockcontent.appendChild(hint);
						}

						// Make container
						const container = $CrE('div');
						container.classList.add('main');
						container.appendChild(block.block);

						// Append to dom
						detectDom({
                            selector: '#left',
                            callback: left => document.body.insertBefore(container, left.parentElement.nextElementSibling)
						});

						// CSS
						detectDom({
                            selector: 'head',
                            callback: head => addStyle(CONST.CSS.Index, 'plus-readingplan-index-css')
						})
					}
				}, {
					checker: {
						type: 'regurl',
						value: [
							/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm/,
							/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php/
						]
					},
					detectDom: '.main.m_foot',
					func: function() {
						const aid = getUrlArgv($('a[href*="/modules/article/uservote.php?"]').href, 'id');
						const btn = makeBtn();
						installBtn(btn);
						refreshBtn(btn);

						function makeBtn() {
							const btn = $CrE('span');
							btn.classList.add(CommonStyle.ClassName.Button);
							$AEL(btn, 'click', toggle);
							return btn;
						}

						function toggle() {
							const book = CONFIG.books.findIndex(book => book.aid == aid);
							if (book >= 0) {
								CONFIG.books.splice(book, 1);
								alertify.success(CONST.Text.Removed);
							} else {
								CONFIG.books.push({
									aid,
									name: $('#content table table b').innerText,
									url: location.href,
									cover: $('#content>div:first-child>table:nth-of-type(2) img').src
								});
								CONFIG.books.length > 10 && alertify.notify(replaceText(CONST.Text.MoreThanDisplay, {'{N}': CONFIG.books.length.toString()}));
								alertify.success(CONST.Text.Added);
							}
							refreshBtn(btn);
						}

						function refreshBtn(btn) {
							const text = CONFIG.books.some(book => book.aid == aid) ? CONST.Text.DontReaditLater : CONST.Text.ReaditLater;
							btn.innerText = text;
						}

						function installBtn(btn) {
							$('#content table table b').insertAdjacentElement('afterend', btn);
							btn.insertAdjacentText('beforebegin', '[');
							btn.insertAdjacentText('afterend', ']');
							return btn;
						}
					}
				}];

				return utils.loadFuncs(functions);

				function moveItem(arr, from, to) {
					const item = arr.splice(from, 1)[0];
					arr.splice(to, 0, item);
					return arr;
				}
			}
		},

		// Apipage Enhance
		{
			name: 'api页面增强',
			description: 'api页面增强',
			id: 'ApiEnhance',
			system: false,
			checker: {
				type: 'starturl',
				value: [
					`https://${location.host}/modules/article/addbookcase.php`,
					`https://${location.host}/modules/article/packshow.php`
				]
			},
			func: function() {
				const utils = require('utils');
				const CONST = {
					CSS: {
						Beautify: 'body>div:not([class*="ajs-"],[class*="alertify-"]) {display: flex; align-items: center; justify-content: center;}'
					}
				};

				document.readyState !== 'loading' ? work() : $AEL(document, 'DOMContentLoaded', work);

				function work() {
					if ($All('.block').length > 1) {
						return {};
					}
					addStyle(CONST.CSS.Beautify, 'plus-api-beautify');

					const functions = [{
						checker: {
							type: 'regurl',
							value: /\/addbookcase\.php/
						},
						detectDom: '.blocknote',
						func: function() {
							// Append link to bookcase page
							addBottomButton({
								href: `https://${location.host}/modules/article/bookcase.php`,
								innerHTML: '管理书架'
							});
						}
					}];

					return utils.loadFuncs(functions);
				}

				// Add a bottom-styled botton into bottom line, to the first place
				function addBottomButton(details) {
					const aClose = $('a[href="javascript:window.close()"]');
					const bottom = aClose.parentElement;
					const a = $CrE('a');
					const t1 = document.createTextNode('[');
					const t2 = document.createTextNode(']');
					const blank = $CrE('span');
					blank.innerHTML = ' ';
					blank.style.width = '0.5em';
					a.href = details.href;
					a.innerHTML = details.innerHTML;
					a.onclick = details.onclick;
					[blank, t2, a, t1].forEach((elm) => {bottom.insertBefore(elm, bottom.childNodes[0]);});
				}
			}
		},

		// Meta copy
		{
			name: '书籍信息复制',
			id: 'MetaCopy',
			description: '复制书籍信息：文库、作者、状态、最后更新、字数',
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm([\?#][\s\S]*)?$/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php([\?#][\s\S]*)?$/,
				]
			},
			func: function() {
				const CONST = {
					Text: {
						Copy: '[复制]',
						Copied: '已复制',
					}
				};

				const CommonStyle = require('CommonStyle');
				const mousetip = require('mousetip');
				const utils = require('utils');

				detectDom({ selector: '#content>div:first-of-type>table+div:nth-child(2)', callback: e => work() });
				function work() {
					const metas = $All('#content>div:first-child>table:first-child>tbody>tr>td:not([colspan])');
					for (const meta of metas) {
					const data = meta.innerText.split('：')[1];
					const copy = $$CrE({
						tagName: 'span',
						props: {
							innerText: CONST.Text.Copy
						},
						styles: {
							'margin-left': '0.5em'
						},
						classes: CommonStyle.ClassName.Button,
						listeners: [['click', () => {
							copyText(data);
							mousetip.showtip(CONST.Text.Copied);
						}]]
					});
					mousetip.settip(copy, data);
					meta.appendChild(copy);
				}
				}

				// Copy text to clipboard (needs to be called in an user event)
				function copyText(text) {
					// Create a new textarea for copying
					const newInput = $CrE('textarea');
					document.body.appendChild(newInput);
					newInput.value = text;
					newInput.select();
					document.execCommand('copy');
					document.body.removeChild(newInput);
				}
			}
		},

		// Tag button
		{
			name: '书籍tag跳转',
			description: '书籍页面点击书籍tag跳转到对应的tag页面',
			id: 'TagButton',
			STOP: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm([\?#][\s\S]*)?$/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php([\?#][\s\S]*)?$/,
				]
			},
			CONST: {
				URL: {
					Tags: `https://${location.host}/modules/article/tags.php?t={tags}`
				}
			},
			func: function() {
				const CONST = FuncInfo.CONST;
				const CommonStyle = require('CommonStyle');
				const mousetip = require('mousetip');
				const utils = require('utils');
				detectDom({ selector: '#content>div:first-of-type>table+div:nth-child(5)', callback: e => work() });

				function work() {
					const b = $('td[width="48%"]>.hottext:first-child>b');
					const text = b.innerText.split(/[︰：]/)[1];
					b.innerText = b.innerText.replace(text, '');

					text.split(' ').forEach((tag, i) => {
						i > 0 && b.insertAdjacentText('beforeend', ' ');
						b.appendChild($$CrE({
							tagName: 'a',
							props: {
								innerText: tag,
								href: replaceText(CONST.URL.Tags, { '{tags}': $URL.encode(tag) }),
								target: '_blank'
							},
							classes: [CommonStyle.ClassName.Button]
						}));
					});
				}
			}
		},

		// Single chapter download
		{
			name: '单章节下载',
			description: '单章节下载',
			id: 'ChapterDownload',
			checker: {
				type: 'func',
				value: () => {
					return (location.pathname.startsWith('/novel/') || location.pathname.match(/\/modules\/article\/reader.php/)) && !location.href.includes('index.htm');
				}
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const SidePanel = require('SidePanel');
				const utils = require('utils');

				const CONST = {
					Text: {
						DownloadChapter: '下载本章',
						DownloadStatus: '下载中({Fin}/{All})',
						AllImagesDownloaded: '全部图片下载完毕',
						ImageDownloadDone: '图片下载已完成</br>成功：{Suc} 张</br>失败：{Fail} 张</br>下载失败的图片分别是第 {Fail_No} 张</br>所有下载失败的图片均已经过3次自动重试',
						Downloaded: '已下载',
						ImageDownloadError: '第 {N} 张图片下载失败',
					}
				};

				detectDom({ selector: '#footlink', callback: e => work() });
				function work() {
					const headlink = $('#headlink');
					const linkleft = $('#linkleft');
					const linkright = $('#linkright');
					headlink.style.position = 'relative';
					linkright.style.position = 'absolute';
					linkright.style.right = '0';
					linkright.style.width = 'unset';

					const dlBtn = $$CrE({
						tagName: 'span',
						props: {
							innerText: CONST.Text.DownloadChapter,
							id: 'plus-chapter-dl'
						},
						classes: CommonStyle.ClassName.Button,
						listeners: [['click', download]]
					});
					linkright.lastElementChild.insertAdjacentHTML('afterend', ' | ');
					linkright.insertBefore(dlBtn, linkright.lastChild);

					SidePanel.insert({
					index: 2,
					tip: CONST.Text.DownloadChapter,
					faicon: 'fa-solid fa-download',
					onclick: download
				});
				}

				function download() {
					dText();
					dImg();
				}

				function dText() {
					const title = $('#title').innerText;
					const text = $('#content').innerText;
					const filename = title + '.txt';
					text.trim().length > 0 && !$('#title').innerText.includes(text.trim()) && utils.downloadText(text, filename);
				}

				function dImg() {
					if (!$('.divimage')) {return false;}

					const imgs = [...$All('.divimage img')];
					const title = $('#title').innerText;
					const AM = new AsyncManager();
					let finished = 0, failed = 0, fails = [];
					imgs.forEach((img, i) => {
						AM.add();
						dl(img, i);
					});
					AM.onfinish = onfinish;
					AM.finishEvent = true;

					function dl(img, index, r=3) {
						const onfail = (err, reason) => r ? dl(img, index, r-1) : fail(err, reason);
						const ext = (() => {
							const str = img.src.split('.').pop();
							const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
							return str && exts.includes(str.toLowerCase()) ? str : 'jpg';
						}) ();
						dl_GM({
							url: img.src,
							name: `${title}_${(index+1).toString().padStart('0', imgs.length.toString().length)}.${ext}`,
							onload: function() {
								$('#plus-chapter-dl').innerText = replaceText(CONST.Text.DownloadStatus, {
									'{Fin}': (++finished).toString(),
									'{All}': imgs.length
								});
								AM.finish();
							},
							onerror: err => onfail(err, 'onerror'),
							ontimeout: err => onfail(err, 'ontimeout'),
						});

						function fail(err, reason) {
							failed++;
							fails.push({img, index, err, reason});
							DoLog(LogLevel.Error, [`Image download error: ${reason}`, err]);
							alertify.error(replaceText(CONST.Text.ImageDownloadError, {
								'{N}': (index + 1).toString()
							}));
							AM.finish();
						}
					}

					function onfinish() {
						const all = imgs.length;
						if (finished === all) {
							alertify.success(CONST.Text.AllImagesDownloaded);
							setTimeout(e => $('#plus-chapter-dl').innerText = CONST.Text.Downloaded, 3000);
						} else if (finished + failed === all) {
							alertify.notify(replaceText(CONST.Text.ImageDownloadDone, {
								'{Suc}': finished.toString(),
								'{Fail}': failed.toString(),
								'{Fail_No}': fails.map(f => (f.index+1).toString()).join(',')
							}));
						}
					}
				}
			}
		},

		// Darkmode
		{
			name: '深色模式',
			description: '可单独开关、可跟随系统配置的深色模式',
			id: 'darkmode',
			CONST: {
				Text: {
					Toggle: '切换浅色/深色模式',
					AlertTitle: `深色模式设置`,
					autoMatchOsTheme: '深色模式自动跟随系统配置'
				},
				PageCSS: [
					// Sidepanel
					{
						id: 'sidepanel',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode .sidepanel-button {background-color: #333333;color: #6f9ff1;fill: #6f9ff1;}.plus-darkmode .sidepanel-button:hover {background-color: #6f9ff1;color: #333333;fill: #333333;}'
					},

					// Mouse tip
					{
						id: 'mousetip',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode #tips {background-color: #333333;color: white;border: 1px solid #0d548b;}'
					},

					// Common style darkend
					{
						id: 'commonstyle',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode .plus_text {color: #6f9ff1 !important;}.plus-darkmode .plus_button.plus_disabled {color: #888888;}'
					},

					// .block
					{
						id: 'block',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode :is(#left, #right, *) .blockcontent {background-color: #222222;}.plus-darkmode :is(#left, #right, *) .blocknote {background-color: #282828;}.plus-darkmode :is(#left, #right, #centers, *) :is(.blocktitle, .blocktitle *, .ultop li) {color: #6f9ff1;}.plus-darkmode :is(#left, #right, #centers, *) .blocktitle>:is(.txt, .txtr) {background-color: #383838;line-height: 27px;padding-top: 0;}.plus-darkmode .block {border: 1px solid #0d548b;}.plus-darkmode :is(.blocktitle, .blockcontent, .blocknote) {border: none;}.plus-darkmode .block :is(.ultop li, .ultops li) {border-bottom: 1px dashed #0d548b;}'
					},

					// header and footer
					{
						id: 'headfoot',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode :is(.main.m_top, .nav, .navinner, .navlist, .nav li, :is(#left, #right, #centers, *) :is(.blocktitle, .blocktitle *)) {background: #333333;}.plus-darkmode :is(.nav a.current, .nav a:hover, .nav a:active) {background: #444444;}.plus-darkmode .m_foot {border-top: 1px dashed #0d548b;border-bottom: 1px dashed #0d548b;}'
					},

					// elements (input textarea .button scrollbar, etc)
					{
						id: 'element',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode {color: #C8C8C8;background-color: #222222;}.plus-darkmode :is(.even, .odd) {background-color: #222222;}.plus-darkmode table.grid td {background-color: #222222 !important;}.plus-darkmode :is(input:not([type]:not([type="text"], [type="number"], [type="file"], [type="password"])), textarea, .plus_list_item, button) {background-color: #333333;color: #DDDDDD;}.plus-darkmode :is(.button, input[type="button"]) {color: #C8C8C8;background-color: #333333;}.plus-darkmode select {color: #AAAAAA;background-color: #333333;}.plus-darkmode :is(.hottext, a.hottext) {color: #f36d55;}.plus-darkmode :is(.button, select, textarea, input:not(.plus_list_item>input, .UBB_ColorList input), .plus_list_item):not(:disabled) {border: 2px solid #0d548b;}.plus-darkmode :is(input, textarea, button):disabled {border: 2px solid #444444;}.plus-darkmode a {color: #AAAAAA;}.plus-darkmode a:hover {color: #4a8dff;}.plus-darkmode a:is(.ultop li a, .poptext, a.poptext, .ultops li a) {color: #f36d55;}.plus-darkmode :is(table.grid caption, .gridtop, table.grid th, .head) {border: 1px solid #0d548b;background: #333333;color: #6f9ff1;}.plus-darkmode :is(table.grid, table.grid td) {border: 1px solid #0d548b;}.plus-darkmode input[type="checkbox"]::after {background-color: #333333;}.plus-darkmode :is(.pagelink, .pagelink a:hover) {background-color: #333333;color: #6f9ff1;}.plus-darkmode .pagelink strong {background-color: #444444;}.plus-darkmode .pagelink em {border-right: 1px solid #0d548b;}.plus-darkmode .pagelink kbd {border-left: 1px solid #0d548b;}.plus-darkmode .pagelink {border: 1px solid #0d548b;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement) {scrollbar-color: #444444 #333333;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement):hover {scrollbar-color: #484848 #333333;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar {background-color: #333333;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar-corner {background-color: #333333;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar-thumb, .plus-darkmode *:not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar-button {background-color: #444444;}:is(.plus-darkmode, .plus-darkmode *):not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar-thumb:hover, .plus-darkmode *:not(#NotAElement>#NotAElement>#NotAElement>#NotAElement)::-webkit-scrollbar-button:hover {background-color: #484848;}'
					},

					// dialog
					{
						id: 'dialog',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode #dialog {color: #C8C8C8;background-color: #222222;border: 5px solid #0d548b;}.plus-darkmode #dialog a[onclick="closeDialog()"] {border: 1px solid #0d548b !important;outline: thin solid #0d548b !important;}'
					},

					// alertify
					{
						id: 'alertify',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode .alertify :is(.ajs-dialog, .ajs-header, .ajs-footer) {background-color: #222222;}.plus-darkmode .alertify :is(.ajs-header, .ajs-body) {color: #C8C8C8;}.plus-darkmode .alertify .ajs-header {border-bottom: 1px solid #333333;}.plus-darkmode .alertify .ajs-footer {border-top: 1px solid #333333;}.plus-darkmode .alertify .ajs-footer .ajs-buttons .ajs-button.ajs-cancel {color: #C8C8C8;}.plus-darkmode .plus_func_block {border-top: 1px solid #333333;}.plus-darkmode .plus_func_sysalert {background-color: #40331f;color: #cd8c32;}.plus-darkmode .alertify-notifier .ajs-message {border: 1px solid #0d548b;}.plus-darkmode .ajs-message{background-color: #222222;color: #C8C8C8;}.plus-darkmode .ajs-message.ajs-success {background-color: #1f6a01;}.plus-darkmode .ajs-message.ajs-warning {background-color: #5f4e05;}.plus-darkmode .ajs-message.ajs-error {background-color: #730808;}'
					},

					// replyarea
					{
						id: 'replyarea',
						checker: {
							type: 'starturl',
							value: [
								// Page: reviews list
								`https://${location.host}/modules/article/reviews.php`,

								// Page: review
								`https://${location.host}/modules/article/reviewshow.php`,

								// Page: review edit
								`https://${location.host}/modules/article/reviewedit.php`,

								// Page: book
								`https://${location.host}/book`,
								`https://${location.host}/modules/article/articleinfo.php`,
							]
						},
						css: '.plus-darkmode form[name="frmreview"] caption {background: #333333;color: #6f9ff1;border: 1px solid #0d548b;}'
					},

					// index.php
					{
						id: 'index',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\/index\.php([\?#][\s\S]*)?$/
						},
						css: 'body.plus-darkmode, .plus-darkmode :is(:is(#left, #right, #centers) .blockcontent, .blockcontent, .odd, .even) {background-color: #222222;color: #C8C8C8;}.plus-darkmode :is(#left, #right, #centers, *) :is(.blocktitle, .blocktitle *) a {color: #AAAAAA;}a[href^="http://tieba.baidu.com"] {color: #4a8dff !important;}',
					},

					// Book
					{
						id: 'book',
						checker: {
							type: 'regurl',
							value: [
								/^https?:\/\/www\.wenku8\.(net|cc)\/book\/\d+\.htm([\?#][\s\S]*)?$/,
								/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/articleinfo\.php([\?#][\s\S]*)?$/,
							]
						},
						css: 'body.plus-darkmode, .plus-darkmode :is(:is(#left, #right, #centers) .blockcontent, .blockcontent, .odd, .even) {background-color: #222222;color: #C8C8C8;}.plus-darkmode table.grid td {background-color: #222222 !important;}.plus-darkmode table.grid:not(form table) tr:first-of-type>td:nth-of-type(2n+1) {background-color: #333333 !important;}.plus-darkmode table.grid:not(form table, #content .main>table:first-of-type) tr:first-of-type>td:first-of-type {color: #6f9ff1;}.plus-darkmode fieldset {border: 2px solid #0d548b;}.plus-darkmode :is(table.grid, table.grid td, table.grid caption, .gridtop) {border: 1px solid #0d548b;}'
					},

					// Book index
					{
						id: 'bookindex',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\/novel\/\d+\/\d+\/index\.htm([\?#][\s\S]*)?$/
						},
						css: 'body.plus-darkmode, .plus-darkmode :is(.css, .vcss, .ccss) {background-color: #222222;color: #C8C8C8;}.plus-darkmode #headlink {border-bottom: 1px solid #0d548b;border-top: 1px solid #0d548b;}.plus-darkmode :is(.css, .vcss, .ccss) {border: 1px solid #0d548b;border-collapse: collapse;}'
					},

					// Novel
					{
						id: 'novel',
						checker: {
							type: 'func',
							value: () => {
								return location.pathname.startsWith('/novel/') && location.pathname.split('/').pop() !== 'index.htm';
							}
						},
						css: '.plus-darkmode a {color: #4a8dff;} .plus-darkmode #content {color: rgb(200, 200, 200) !important;}'
					},

					// Reviewshow
					{
						id: 'reviewshow',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php\/?/
						},
						css: 'body.plus-darkmode, .plus-darkmode :is(:not(*)) {background-color: #222222;color: #C8C8C8;}.plus-darkmode table.grid td {background-color: #222222;}.plus-darkmode :is(#content table.grid hr, #content>table:nth-of-type(2) th, #pagelink) {border: 1px solid #0d548b;}.plus-darkmode :is(.jieqiQuote, .jieqiCode, .jieqiNote) {background-color: #282828;color: #6f9ff1;border: 1px solid #0d548b;}'
					},

					// Beautifier
					{
						id: 'beautifier',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: ''
					},

					// tippy
					{
						id: 'tippy',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: '.plus-darkmode .tippy-box[data-theme~="wenku_tip"] {background-color: #282828;color: #C3C3C3;border: 1px solid #0d548b;}.plus-darkmode .tippy-box[data-theme~="wenku_tip"][data-placement^="top"]>.tippy-arrow::before {border-top-color: #0d548b;}.plus-darkmode .tippy-box[data-theme~="wenku_tip"][data-placement^="left"]>.tippy-arrow::before {border-left-color: #0d548b;}.plus-darkmode .tippy-box[data-theme~="wenku_tip"][data-placement^="right"]>.tippy-arrow::before {border-right-color: #0d548b;}.plus-darkmode .tippy-box[data-theme~="wenku_tip"][data-placement^="bottom"]>.tippy-arrow::before {border-bottom-color: #0d548b;}'
					},

					// frmreview
					{
						id: 'frmreview',
						checker: {
							type: 'starturl',
							value: [
								// Page: reviews list
								`https://${location.host}/modules/article/reviews.php`,

								// Page: review
								`https://${location.host}/modules/article/reviewshow.php`,

								// Page: review edit
								`https://${location.host}/modules/article/reviewedit.php`,

								// Page: book
								`https://${location.host}/book`,
								`https://${location.host}/modules/article/articleinfo.php`,
							]
						},
						css: '.plus-darkmode .UBB_FontSizeList li {border: 1px solid #0d548b;}.plus-darkmode .UBB_ColorList :is(table, table td) {border: 1px solid #0d548b;}.plus-darkmode .UBB_ColorList {background-color: #222222;}'
					},

					/* Template
					{
						id: '',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\//
						},
						css: ''
					},
					*/
				],
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						darkmode: false,
						autoMatchOsTheme: false,
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			STOP: false,
			func: function() {
				// Stop running in image, code, or pure text papes
				if (/\.(jpe?g|png|webp|gif|bmp|txt|js|css)/.test(location.pathname)) {
					return false;
				}

				const SPanel = require('SidePanel');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				/* Darkmode.js doing pretty bad with background image beautifier on, so stop using it
				// Uses darkmode.js
				// See https://github.com/sandoche/Darkmode.js
				const options = {
					saveInCookies: false, // default: true,
					label: '', // default: ''
					autoMatchOsTheme: false // default: true // This doesn't work in my computer, use my own code instead
				}

				detectDom('body', function() {
					const darkmode = new Darkmode(options);
					const button = SPanel.insert({
						index: 2,
						faicon: 'fa-solid fa-circle-half-stroke',
						tip: CONST.Text.Toggle,
						onclick: e => darkmode.toggle()
					});
					if (CONFIG.autoMatchOsTheme) {
						const match = window.matchMedia('(prefers-color-scheme: dark)');
						$AEL(match, 'change', followOsTheme);
						followOsTheme(match);
					}

					function followOsTheme(e) {
						e.matches && !darkmode.isActivated() && darkmode.toggle();
						return e.matches;
					}
				});
				*/

				// Append css
                detectDom('head').then(head => {
                    CONST.PageCSS.filter(cssObj => utils.testChecker(cssObj.checker))
                        .forEach(cssObj => addStyle(cssObj.css, `plus-darkmode-${cssObj.id}`));
                });

				// Side Panel toggle button
				const button = SPanel.insert({
					index: 2,
					faicon: 'fa-solid fa-circle-half-stroke',
					tip: CONST.Text.Toggle,
					onclick: e => toggle()
				});

				// Follow os theme
				detectDom({
                    selector: 'body',
                    callback: function() {
                        if (CONFIG.autoMatchOsTheme) {
                            const match = window.matchMedia('(prefers-color-scheme: dark)');
                            $AEL(match, 'change', followOsTheme);
                            followOsTheme(match);
                        } else {
                            CONFIG.darkmode !== isActivated() && toggle();
                        }
                    }
				});

				function followOsTheme(mediaMatch) {
					const isOsDarkmode = mediaMatch.matches;
					isOsDarkmode !== isActivated() && toggle();
					return isOsDarkmode;
				}

				function toggle() {
					document.body.classList[isActivated() ? 'remove' : 'add']('plus-darkmode');
					CONFIG.darkmode = isActivated();
				}

				function isActivated() {
					return document.body.classList.contains('plus-darkmode');
				}
			},
			setting: function setter() {
				const SettingPanel = require('SettingPanel');
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				CM.updateAllConfigs();

				SettingPanel.easySettings({
					title: CONST.Text.AlertTitle,
					items: [{
						text: CONST.Text.autoMatchOsTheme,
						path: 'autoMatchOsTheme',
						type: 'boolean'
					}]
				}, CM);
			}
		},

		// ReviewEnchance
		{
			name: '书评吐槽增强',
			description: '书评吐槽页面提供引用回复、页面内编辑回帖内容、页面自动刷新等等增强功能',
			id: 'ReviewEnhance',
			STOP: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php\/?/,
				]
			},
			CONST: {
				Text: {
					Quote: '引用',
					QuoteNum: ['或者，', '仅引用序号'],
					AutoRefresh_Off: '自动刷新',
					AutoRefresh: '自动刷新({t}秒)',
					FloorContentModified: '(内容已更新)',
					ReplyErrorTitle: '回复发生错误',
					DownloadFormat: '保存格式:',
					FormatTip: '纯文本：</br>目前所提供的几种格式中，一般而言最适合阅读的格式。但是，这种格式仅能保存文本内容。</br></br>BBCODE格式：</br>即文库评论的代码格式，相当于引用楼层时自动填入回复框的内容。保存为此格式可以一定程度上在保持可阅读性的同时，保留排版及多媒体信息。</br></br>JSON格式：</br>一种方便程序读取的格式，包含所有脚本能够获取到的文本、排版和多媒体信息。</br>需要注意的是，这种格式一般来讲不适合直接阅读。',
					DownloadPost: '下载本贴(共{N}页)',
					DownloadingPost: '正在下载({finished}/{all})',
					DownloadFailed: '下载失败，请重试',
					DownloadSuccess: '下载完毕',
					DownloadFormats: {
						text: {
							name: '纯文本',
							ext: 'txt'
						},
						bbcode: {
							name: 'BBCODE格式',
							ext: 'txt'
						},
						json: {
							name: 'JSON',
							ext: 'json'
						}
					},
					DownloadTemplate: {
						Template: `轻小说文库 书评吐槽 [ID: {Review ID}]\n主题：{Review Title}\n保存自：{Review URL}\n保存时间：{Download Time}\n保存格式：{Format}\nBy ${GM_info.script.name} Ver. ${GM_info.script.version} author ${GM_info.script.author}\n\n\n\n\n\n{Floor Content}`,
						FloorTemplate: `[{FloorNum}#] [{Username} {UserID}]{Floor Title} [{Time}]\n{Floor Content}`,
						FloorTitleTemplate: ` [{Title}]`,
						FloorDelimiter: '\n\n\n\n———— - ———— - ———— - ————\n',
					}
				},
				Number: {
					RefreshInterval: 20 // time by second
				},
				URL: {
					ReviewShow: `https://${location.host}/modules/article/reviewshow.php?rid={RID}&page={Page}`
				},
				Selector: {
					Floor: '#content>table:not(:is(:last-of-type, :first-of-type, :nth-of-type(2), :nth-last-of-type(2):nth-last-child(2)))',
					FloorA: 'tbody>tr>td:nth-of-type(2)>div:nth-of-type(2)>a[href^="#yid"]',
					PagesTable: '#content>table:is(:last-of-type:not(:last-child),:nth-last-of-type(2):nth-last-child(2))',
					PagesTr: '#content>table:is(:last-of-type:not(:last-child),:nth-last-of-type(2):nth-last-child(2))>tbody>tr',
					ReplyTable: '#content>form>table',
					FloorContent: 'hr+div',
					FloorTitle: 'tbody>tr>td:nth-of-type(2)>div:first-of-type>strong',
					FloorTitleRight: 'tbody>tr>td:nth-of-type(2)>div:nth-of-type(2)'
				},
				CSS: {
					Common: '#content>table:not(:is(:last-of-type, :first-of-type, :nth-of-type(2), :nth-last-of-type(2):nth-last-child(2)))>tbody>tr>td:last-of-type>:is(div:nth-of-type(1),div:nth-of-type(2)) {width: unset !important;}'
				},
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						downloadFormat: 'bbcode',
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const ReplyAreaEnhance = require('ReplyAreaEnhance');
				const mousetip = require('mousetip');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				const STORAGE = {}; // Public storage for all functions

				// Function for the page.
				// This shouldn't rely on any floor elements, because floor elements might be removed or modified
				const basicFuncs = [
					function css() {
						addStyle(CONST.CSS.Common, 'plus_review_css');
					},
					function linkJump() {
						const content = $('#content');
						$AEL(content, 'click', function(e) {
							const links = [...$All(content, 'table>tbody>tr>td:nth-of-type(2)>div:nth-of-type(2)>a[href^="#yid"]')];
							const getYID = a => a.href.match(/#yid\d+/)[0];
							const linkObjs = links.map(a => ({ a, yid: getYID(a) }));
							const isReplyLink = elm => elm.tagName === 'A' && elm.pathname === '/modules/article/reviewshow.php' &&
								  elm.host === location.host && elm.href.includes('#yid') && !links.includes(elm);
							if (isReplyLink(e.target)) {
								const a = e.target;
								const linkObj = linkObjs.find(obj => obj.yid === getYID(a));
								if (linkObj) {
									destroyEvent(e);
									linkObj.a.click();
								}
							}
						})
					},
					function autoRefresh() {
						let timer, t=1;

						// GUI
						const container = $$CrE({
							tagName: 'td',
							styles: {
								'text-align': 'left'
							}
						});
						const checkbox = $$CrE({
							tagName: 'input',
							props: {
								type: 'checkbox'
							},
							styles: {
								'vertical-align': 'middle',
							},
							listeners: [['change', function(e) {
								checkbox.checked ? start() : stop();
							}]]
						});
						const text = $$CrE({
							tagName: 'span',
							props: {
								innerText: CONST.Text.AutoRefresh_Off
							},
							styles: {
								'margin-left': '1em',
								'vertical-align': 'middle',
								'cursor': 'default',
							},
							listeners: [['click', function(e) {
								checkbox.click();
							}]]
						});
						container.appendChild(checkbox);
						container.appendChild(text);
						$(CONST.Selector.PagesTr).insertAdjacentElement('afterbegin', container);

						function start() {
							// When start, set current waiting time to 1s
							// Not 0s, in order to avoid someone frequently refreshing by clicking the checkbox again and again
							t = 1;
							timer = setInterval(countdown, 1000);
							text.innerText = replaceText(CONST.Text.AutoRefresh, {'{t}': t.toString()});
						}

						function stop() {
							text.innerText = CONST.Text.AutoRefresh_Off;
							clearInterval(timer);
						}

						function countdown() {
							if (--t < 0) {
								refresh();
								t = CONST.Number.RefreshInterval;
							}
							text.innerText = replaceText(CONST.Text.AutoRefresh, {'{t}': t.toString()});
						}
					},
					function replyInPage() {
						FL_recieveMessage('ReplySent', dealResponse, 'ReplyAreaEnhance');
						FL_recieveMessage('ReplyFailed', data => refresh(), 'ReplyAreaEnhance');

						function dealResponse(data) {
							const blob = data.response.response;
							const dom = utils.parseDocument(blob, function(dom) {
								const redirector = $(dom.head, 'meta[http-equiv="refresh"]');
								if (dom.body.childElementCount === 1 && !redirector) {
									// Error page
									const closeBtn = $(dom, 'a[href="javascript:window.close()"]');
									closeBtn.href = 'javascript: void(0);';
									$AEL(closeBtn, 'click', e => altbox.close());
									const altbox = alertify.alert(CONST.Text.ReplyErrorTitle, $(dom, '.block'));

									// Refresh with current page when reply returns an error
									refresh(getUrlArgv({
										url: location.href,
										name: 'page',
										defaultValue: '1'
									}));
								} else if (dom.body.childElementCount === 1 && redirector) {
									// Reply modification successed
									data.form.reset();
									$('#dialog') && unsafeWindow.closeDialog();

									// Refresh with current page when reply returns an error
									refresh(getUrlArgv({
										url: location.href,
										name: 'page',
										defaultValue: '1'
									}));
								} else {
									// Reply send successed
									data.form.reset();

									// Refresh to last page while successfully sent a new reply
									refresh();
								}
							});
						}
					},
					function reviewDownload() {
						// Adjust element width
						[...$All('#content>table:first-of-type td td')].forEach(td => td.style.width = 'unset');

						// Make button
						const container = $CrE('span');
						const formatText = $$CrE({
							tagName: 'span',
							props: {
								innerText: CONST.Text.DownloadFormat
							},
							styles: {
								'vertical-align': 'middle',
								'margin-right': '1em',
								'padding-left': '0.5em',
								'cursor': 'default',
							}
						});
						const formatChooser = $$CrE({
							tagName: 'select',
							styles: {
								'vertical-align': 'middle',
								'margin-right': '0.5em',
							},
							listeners: [['change', e => CONFIG.downloadFormat = formatChooser.value]]
						});
						const button = $$CrE({
							tagName: 'span',
							classes: [CommonStyle.ClassName.Button],
							props: {
								innerText: replaceText(CONST.Text.DownloadPost, {'{N}': $('#pagelink .last').innerText})
							},
							styles: {
								'vertical-align': 'middle',
							},
							listeners: [['click', e => download(formatChooser.value)]]
						});
						for (const [value, prop] of Object.entries(CONST.Text.DownloadFormats)) {
							formatChooser.appendChild($$CrE({
								tagName: 'option',
								props: {
									value: value,
									innerText: prop.name
								}
							}));
						}
						formatChooser.value = CONFIG.downloadFormat;
						//mousetip.settip(formatText, CONST.Text.FormatTip);
						//mousetip.settip(formatChooser, CONST.Text.FormatTip);
						tippy(container, {
							content: $$CrE({
								tagName: 'div',
								props: {
									innerHTML: CONST.Text.FormatTip
								},
							}),
							theme: 'wenku_tip',
							placement: 'bottom',
						});
						[formatText, formatChooser, button].forEach(elm => container.appendChild(elm));
						$('#content>table:first-of-type td td:last-of-type').appendChild(container);

						function download(format) {
							// Temporarily use current document's last page text as maxPage
							let maxPage = parseInt($('#pagelink .last').innerText, 10);
							let finished = 0;

							// Set button text
							button.innerText = replaceText(CONST.Text.DownloadingPost, {'{finished}': '0', '{all}': maxPage.toString()});

							// Get review's id
							const rid = getUrlArgv('rid');

							// Result json object
							const review = {
								rid,
								title: '',
								floors: [],
							};

							// Request all review pages
							const AM = new AsyncManager();
							for (let page = 1; page <= maxPage; page++) {
								getPage(AM, rid, page, downloadFailed);
							}

							// When all request finished, merge result
							AM.onfinish = e => {
								output(format);
								button.innerText = CONST.Text.DownloadSuccess;
							}
							AM.finishEvent = true;

							// Request specified page of specified review and concat all floors' data, with AM task management
							function getPage(AM, rid, page, onerror, retryCount=3) {
								// Append AM task
								AM.add();

								// Request specified page of specified review
								const url = replaceText(CONST.URL.ReviewShow, {'{RID}': getUrlArgv('rid'), '{Page}': page.toString()})
								utils.getDocument({url, callback: function(doc) {
									// Append floors' json into review.floors
									const data = getPageData(doc);
									review.floors.push.apply(review.floors, data);

									// Update button text
									button.innerText = replaceText(CONST.Text.DownloadingPost, {'{finished}': (++finished).toString(), '{all}': maxPage.toString()});

									// Finish AM task
									AM.finish();
								}, onerror: retry});

								function retry(err) {
									if (--retryCount > 0) {
										DoLog(`Review download: Retrying ${url}, retryCount=${retryCount}`);
										getPage(AM, rid, page, onerror, retryCount);
									} else {
										if (typeof onerror === 'function') {
											// onerror shouldn't throw any error. onerror first then finish task
											onerror(err);
											AM.finish();
										} else {
											// No onerror, just finish task then throw the error
											AM.finish();
											Err(`Review download: download failed after all retrying.`);
										}
									}
								}
							}

							// Returns an array of floors' data
							function getPageData(doc) {
								// Record realtime pages count
								maxPage = parseInt($('#pagelink .last').innerText, 10);

								// Parse floors' json
								const floors = parseFloors(doc);
								const data = floors.map(floor => jsonFloor(floor));

								return data;
							}

							// Returns a json of a floor's data
							// Return: {username, userid, title, time, floorNum, contentText, contentBBCode}
							function jsonFloor(floor) {
								const userA = $(floor, '.avatar+br+strong>a');
								const username = userA.innerText;
								const userid = getUrlArgv(userA.href, 'uid');
								const title = $(floor, CONST.Selector.FloorTitle).innerText;
								const time = $(floor, CONST.Selector.FloorTitleRight).innerText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];
								const floorNum = parseInt($(floor, CONST.Selector.FloorA).innerText.match(/\d+/)[0], 10);
								const contentText = $(floor, CONST.Selector.FloorContent).innerText;
								const contentBBCode = getFloorContent($(floor, CONST.Selector.FloorContent));
								return {username, userid, title, time, floorNum, contentText, contentBBCode};
							}

							// Output in specified format
							function output(format) {
								// Sort floors
								review.floors.sort((f1, f2) => f1.floorNum - f2.floorNum);

								// Set review title as first floor's title
								review.title = review.floors[0].title;

								// Get blob and filename in format
								const blob = ({
									text: outputText,
									bbcode: outputBBCode,
									json: outputJson,
								})[format]();
								const filename = `${review.rid} - ${review.title}(${CONST.Text.DownloadFormats[format].name}).${CONST.Text.DownloadFormats[format].ext}`;

								// Output blob
								const url = URL.createObjectURL(blob);
								$$CrE({
									tagName: 'a',
									attrs: {
										href: url,
										download: filename
									}
								}).click();
								setTimeout(e => URL.revokeObjectURL(url), 0);

								function outputText() {
									const floorText = review.floors.map(floordata => replaceText(CONST.Text.DownloadTemplate.FloorTemplate, {
										'{FloorNum}': floordata.floorNum,
										'{Username}': floordata.username,
										'{UserID}': floordata.userid,
										'{Time}': floordata.time,
										'{Floor Title}': floordata.title ? replaceText(CONST.Text.DownloadTemplate.FloorTitleTemplate, {'{Title}': floordata.title}) : '',
										'{Floor Content}': floordata.contentText
									})).join(CONST.Text.DownloadTemplate.FloorDelimiter);
									const text = replaceText(CONST.Text.DownloadTemplate.Template, {
										'{Review ID}': review.rid,
										'{Review Title}': review.title,
										'{Review URL}': replaceText(CONST.URL.ReviewShow, {'{RID}': rid, '{Page}': 1}),
										'{Download Time}': new Date().toLocaleString(),
										'{Format}': format,
										'{Floor Content}': floorText,
									});
									const blob = new Blob([text], {
										type: 'text/plain',
										endings: 'native'
									});
									return blob;
								}

								function outputBBCode() {
									const floorText = review.floors.map(floordata => replaceText(CONST.Text.DownloadTemplate.FloorTemplate, {
										'{FloorNum}': floordata.floorNum,
										'{Username}': floordata.username,
										'{UserID}': floordata.userid,
										'{Time}': floordata.time,
										'{Floor Title}': floordata.title ? replaceText(CONST.Text.DownloadTemplate.FloorTitleTemplate, {'{Title}': floordata.title}) : '',
										'{Floor Content}': floordata.contentBBCode
									})).join(CONST.Text.DownloadTemplate.FloorDelimiter);
									const text = replaceText(CONST.Text.DownloadTemplate.Template, {
										'{Review ID}': review.rid,
										'{Review Title}': review.title,
										'{Review URL}': replaceText(CONST.URL.ReviewShow, {'{RID}': rid, '{Page}': 1}),
										'{Download Time}': new Date().toLocaleString(),
										'{Format}': format,
										'{Floor Content}': floorText,
									});
									const blob = new Blob([text], {
										type: 'text/plain',
										endings: 'native'
									});
									return blob;
								}

								function outputJson() {
									const blob = new Blob([JSON.stringify(review)], {
										type: 'text/plain',
										endings: 'transparent'
									});
									return blob;
								}
							}

							function downloadFailed(err) {
								alertify.error(CONST.Text.DownloadFailed);
								DoLog(LogLevel.Error, ['downloadFailed', err])
							}
						}
					},
					function pageChangeInPage() {
						// Clicking #pagelink>a
						$AEL(document, 'click', e => {
							const elm = e.target;
							if ([...$All('#pagelink>a')].includes(elm)) {
								e.preventDefault();
								refresh(getUrlArgv({
									url: elm.href,
									name: 'page',
									defaultValue: '1'
								}));
							}
						});

						// Input pagenum and hit enter
						// Deal <input> everytime <input> refreshed
						detectDom({
							selector: '#pagelink [name="page"]',
							callback: input => {
								input.type = 'number';
								input.style.width = '10ex'; // 6ex(maxlength=6) + 4ex(increase/decrease button)
								input.onkeydown = e => {};
								$AEL(input, 'keydown', e => {
									if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
										refresh(input.value, 10);
									}
								});
							}
						});
					}
				];

				// Functions for every floor <table>
				// These will be executed for every floor <table> once, containing all in html and add via refreshing
				// These may be executed without floors inserted into current dom
				const floorFuncs = [
					function floorQuote(floor, doc) {
						// '本帖已经超过允许回复时间'
						if (!$('#pcontent')) {
							return false;
						}

						const floorA = $(floor, CONST.Selector.FloorA);
						const button = $$CrE({
							tagName: 'span',
							classes: [CommonStyle.ClassName.Button],
							listeners: [['click', quote]],
							props: {
								innerText: CONST.Text.Quote
							}
						});
						const tip_panel = $$CrE({
							tagName: 'div',
							props: {
								innerText: CONST.Text.QuoteNum[0]
							}
						});
						const btn = $$CrE({
							tagName: 'span',
							props: {
								innerText: CONST.Text.QuoteNum[1]
							},
							classes: [CommonStyle.ClassName.Button],
							listeners: [['click', quoteNum]]
						});
						tip_panel.appendChild(btn);
						const panel = tippy(button, {
							content: tip_panel,
							theme: 'wenku_tip',
							placement: 'top',
							interactive: true,
						});
						floorA.insertAdjacentElement('beforebegin', button);
						floorA.insertAdjacentHTML('beforebegin', ' | ');

						function quote() {
							const bbcode = `${getFloorLink(floor)} [quote]${getFloorContent($(floor, CONST.Selector.FloorContent))}[/quote]`;
							insert(bbcode);
						}

						function quoteNum() {
							const bbcode = getFloorLink(floor);
							insert(bbcode);
						}

						// Insert into <textarea id='pcontent'>
						function insert(bbcode, focus=true) {
							const textarea = $('#pcontent:not(#dialog #pcontent)');
							utils.insertText(textarea, bbcode, focus);
						}
					},
					function editInPage(floor, doc) {
						const editBtn = $(floor, `a[href^="https://${location.host}/modules/article/reviewedit.php?yid="]`);
						editBtn && editBtn.addEventListener('click', (e) => {
							e.preventDefault();

							utils.openDialog(e.target.href + '&ajax_gets=jieqi_contents');
						})
					},
					function scaleimgs(floor, doc) {
						const w = $('#content').clientWidth * 0.8 - 3 - 3; // td.width = "80%", .even {padding: 3px;}, table.grid {padding: 3px;}
						[...$All(floor, '.divimage>img')].forEach(img => {
							const loaded = img.width && img.height;
							const myOnload = e => {
								img.resized = img.width > w;
								img.width = img.resized ? w : img.width;
							}
							loaded ? myOnload() : img.onload = myOnload;
							img.onmouseover = e => img.resized && (img.style.cursor = 'pointer');
						});
					}
				];

				// Do not load functions when required by other modules and not running in reviewshow page
				if (utils.testChecker(FuncInfo.checker)) {
					detectDom({
                        selector: '.main.m_foot',
                        callback: function() {
                            loadBasicFuncs(basicFuncs);
                            loadFloorFuncs(floorFuncs);
                        }
					});
				}
				return {refresh};

				// Refresh current page without reload
				// Argument: pageOrDom: page number (string or number) or a document
				function refresh(pageOrDom='last') {
					if (typeof pageOrDom === 'string' || typeof pageOrDom === 'number') {
						const page = pageOrDom;
						utils.getDocument(
							replaceText(CONST.URL.ReviewShow, {'{RID}': getUrlArgv('rid'), '{Page}': page.toString()}),
							applyDocument
						);
					} else {
						const dom = pageOrDom;
						applyDocument(dom);
					}

					function applyDocument(dom) {
						loadFloorFuncs(floorFuncs, dom);

						// Record scroll status
						const scrollStatus = [window.scrollY, $('#content').scrollTop];

						// Get floors' info
						const oldInfos = parseFloors(document).map(floor => info(floor));
						const newInfos = parseFloors(dom).map(floor => info(floor));

						// Get all floors' info that should stay in page and remove unreserved old floors from page
						// Fill newInfos directly first, then use oldInfos to replace same-floor-infos
						const reservedInfos = [...newInfos];
						oldInfos.forEach(old_info => {
							const sameNew = reservedInfos.findIndex(new_info => isSameFloor(new_info, old_info).same);
							const yidsameNewInfo = reservedInfos.find(new_info => isSameFloor(new_info, old_info).yid);
							if (sameNew >= 0) {
								reservedInfos.push(old_info);
								reservedInfos.splice(sameNew, 1);
							} else {
								old_info.floor.remove();
								if (yidsameNewInfo) {
									const titleRight = $(yidsameNewInfo.floor, CONST.Selector.FloorTitleRight);
									titleRight.insertAdjacentHTML('afterbegin', ' | ');
									titleRight.insertAdjacentElement('afterbegin', $$CrE({
										tagName: 'span',
										classes: [CommonStyle.ClassName.Text],
										props: {
											innerText: CONST.Text.FloorContentModified
										}
									}));
								}
							}
						});
						reservedInfos.sort((info1, info2) => info1.num_yid - info2.num_yid);

						// Insert new floors that do not currently exist in page and sort all floors in page
						reservedInfos.forEach(info => appendFloor(info.floor));

						// Update page url
						const page = $(dom, '#pagestats').innerText.match(/(\d+)\/\d+/)[1];
						const url = replaceText(CONST.URL.ReviewShow, {'{RID}': getUrlArgv('rid'), '{Page}': page.toString()})
						utils.setPageUrl(url);

						// Update #pagelink
						const newPagelink = $(dom, '#pagelink');
						const oldPagelink = $('#pagelink');
						const parent = oldPagelink.parentElement;
						// Remove old first, to aviod #pagelink dealers misgot the old one
						oldPagelink.remove();
						// Append new #pagelink
						parent.appendChild(newPagelink);

						// Recover scroll status
						[window.scrollY, $('#content').scrollTop] = scrollStatus;
					}

					// Get floor info, returns {floor, yid, str_yid, num_yid, title, content}
					function info(floor) {
						const yid = $(floor, CONST.Selector.FloorA).href.match(/#(yid\d+)/)[1];
						const str_yid = yid;
						const num_yid = parseInt(str_yid.replace('yid', ''), 10);
						const title = $(floor, CONST.Selector.FloorTitle).innerHTML;
						const content = getFloorContent($(floor, CONST.Selector.FloorContent));
						return {floor, yid, str_yid, num_yid, title, content};
					}

					// Compare whether two floors/infos are completely or partly same
					// Returns: {same, yid, title, content}
					function isSameFloor(ft1, ft2) {
						const getInfo = ft => ft.toString() === '[object HTMLTableElement]' ? info(ft) : ft;
						const [info1, info2] = [getInfo(ft1), getInfo(ft2)];
						const yid = info1.yid === info2.yid;
						const title = info1.title === info2.title;
						const content = info1.content === info2.content;
						const same = yid && title && content
						return {same, yid, title, content};
					}

					// Append a floor into the bottom of page
					function appendFloor(floor) {
						$(CONST.Selector.PagesTable).insertAdjacentElement('beforebegin', floor);
					}
				}

				// Get floor content by BBCode format (content only, no title)
				// Argv: <div> content element
				function getFloorContent(contentEle, original=false) {
					const subNodes = contentEle.childNodes;
					let content = '';

					for (const node of subNodes) {
						const type = node.nodeName;
						switch (type) {
							case '#text':
								// Prevent 'Quote:' repeat
								content += node.data.replace(/^\s*Quote:\s*$/, ' ');
								break;
							case 'IMG':
								// wenku8 has forbidden [img] tag for secure reason (preventing CSRF)
								//content += '[img]S[/img]'.replace('S', node.src);
								content += original ? '[img]S[/img]'.replace('S', node.src) : ' S '.replace('S', node.src);
								break;
							case 'A':
								content += '[url=U]T[/url]'.replace('U', node.getAttribute('href')).replace('T', getFloorContent(node));
								break;
							case 'BR':
								// no need to add \n, because \n will be preserved in #text nodes
								//content += '\n';
								break;
							case 'DIV':
								if (node.classList.contains('jieqiQuote')) {
									content += getTagedSubcontent('quote', node);
								} else if (node.classList.contains('jieqiCode')) {
									content += getTagedSubcontent('code', node);
								} else if (node.classList.contains('divimage')) {
									content += getFloorContent(node, original);
								} else {
									content += getFloorContent(node, original);
								}
								break;
							case 'CODE': content += getFloorContent(node, original); break; // Just ignore
							case 'PRE':  content += getFloorContent(node, original); break; // Just ignore
							case 'SPAN': content += getFontedSubcontent(node); break; // Size and color
							case 'P':    content += getFontedSubcontent(node); break; // Text Align
							case 'B':    content += getTagedSubcontent('b', node); break;
							case 'I':    content += getTagedSubcontent('i', node); break;
							case 'U':    content += getTagedSubcontent('u', node); break;
							case 'DEL':  content += getTagedSubcontent('d', node); break;
							default:     content += getFloorContent(node, original); break;
								/*
									case 'SPAN':
										subContent = getFloorContent(node);
										size = node.style.fontSize.match(/\d+/) ? node.style.fontSize.match(/\d+/)[0] : '';
										color = node.style.color.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);
										break;
									*/
						}
					}
					return content;

					function getTagedSubcontent(tag, node) {
						const subContent = getFloorContent(node, original);
						return '[{T}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{S}', subContent);
					}

					function getFontedSubcontent(node) {
						let tag, value;

						let strSize = node.style.fontSize.match(/\d+/);
						let strColor = node.style.color;
						let strAlign = node.align;
						strSize = strSize ? strSize[0] : null;
						strColor = strColor ? rgbToHex.apply(null, strColor.match(/\d+/g)) : null;

						tag = tag || (strSize  ? 'size'  : null);
						tag = tag || (strColor ? 'color' : null);
						tag = tag || (strAlign ? 'align' : null);
						value = value || strSize || null;
						value = value || strColor || null;
						value = value || strAlign || null;

						const subContent = getFloorContent(node, original);
						if (tag && value) {
							return '[{T}={V}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{V}', value).replaceAll('{S}', subContent);
						} else {
							return subContent;
						}

						function rgbToHex(r, g, b) {return ((r << 16) | (g << 8) | b).toString(16).padStart('0', 6);}
					}
				}

				// Get link bbcode points to given floor
				// Argv: <table> floor element
				function getFloorLink(floor) {
					const floorA = $(floor, 'a[href^="#yid"]');
					return `[url=${floorA.href}]${floorA.innerText}[/url]`;
				}

				// func() for each func
				function loadBasicFuncs(basicFuncs) {
					basicFuncs.forEach(func => loadWithWrapper(func));
				}

				// func(floor, doc) for each floor and floorFunc
				function loadFloorFuncs(floorFuncs, doc=document) {
					const floors = parseFloors(doc);
					floorFuncs.forEach(func => {
						floors.forEach(floor => loadWithWrapper(func, floor, doc));
					});
				}

				// Get all floor <table> as an array
				function parseFloors(doc=document) {
					const content = $(doc, '#content');
					const tables = $All(doc, CONST.Selector.Floor);
					return [...tables];
				}

				function loadWithWrapper(func, ...args) {
					setTimeout(function() {
						/* This will lose erroor stack information
						try {
							func.apply(null, args);
						} catch (err) {
							Err(err);
						}
						*/
						func.apply(null, args);
					}, 0);
				}
			}
		},

		// Reply area enhance
		{
			name: '编辑器增强',
			description: '发帖/回帖 输入框功能增强，提供本地图片快速插入等小功能',
			id: 'ReplyAreaEnhance',
			STOP: false,
			checker: {
				type: 'starturl',
				value: [
					// Page: reviews list
					`https://${location.host}/modules/article/reviews.php`,

					// Page: review
					`https://${location.host}/modules/article/reviewshow.php`,

					// Page: review edit
					`https://${location.host}/modules/article/reviewedit.php`,

					// Page: book
					`https://${location.host}/book`,
					`https://${location.host}/modules/article/articleinfo.php`,
				]
			},
			CONST: {
				Text: {
					InsertWebImage: '插入网图链接',
					SelectLocalImage: '选择本地图片',
					IWItip: '直接插入网络图片的链接地址',
					SLItip: '选择本地图片上传到第三方图床，然后再插入图床提供的图片链接</br>您也可以直接拖拽图片到输入框，或者Ctrl+V直接粘贴您剪贴板里面的图片</br></br>上传图片请遵守法律以及图床使用规定</br><span style="color: orange;">请<span style="color: red;">不要滥用</span>（你知道什么样算是滥用，包括但不限于上传违反法律/图床规定的图片、短时间大量上传图片等），如果因此出现问题，<span style="color: red;">开发者不对用户的这种恶意行为负责</span>，出现此种情况开发者只能选择<span style="color: red;">关闭此功能</span></span>',
					InputImageURL: '请输入图片路径，支持https以及包含中文和特殊符号的链接',
					DefaultInputURL: 'https://',
					ProtocolMissing: '请输入完整的图片路径！',
					ExtensionInvalid: '图片的链接需要以.jp(e)g/.png/.gif/.bmp等常见图片扩展名结尾',
					ImageOnly: '抱歉，您选择的图片格式无法识别</br>（建议选择jpeg/png格式的图片）',
					Uploading: '正在上传图片…',
					UploadSuccess: '图片上传成功',
					UploadError: '图片上传失败',
					ErrorMarkerID: '上传失败',
					SubmitBtnHotkey: '(Ctrl+Enter)',
					alertTitle: '书评吐槽',
					NoEmptySubmit: '请不要提交空的评论',
					ContentTooShort: '回复内容太短，至少需要7个字节</br>（通常来讲，一个汉字占两个字节，一个数字/字母/普通符号占一个字节）',
					ReplyFailed: '发送失败，请重试',
					DraftInited: '书评草稿初始化完毕',
					DraftLoaded: '成功加载了于{time}编辑的草稿',
					DraftSaved: '编辑框内容已于{time}保存到草稿',
					DraftCleared: '已清空草稿',
					AlertTitle: '编辑器增强',
					DraftSetting: '书评草稿',
					Expires: '草稿保存时间（天）',
					StorageSetting: {
						SettingTitle: '草稿管理',
						title: '标题',
						content: '内容',
						time: '上次编辑时间',
						Edit: '打开'
					}
				},
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						draftexpires: 31,
						drafts: []
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			func: function() {
				const WenkuBlockGUI = require('WenkuBlockGUI');
				const imager = require('imager');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				let ubbCode = '';

				detectDom({
					selector: 'form[name="frmreview"]',
					callback: form => enhance(form),
				});
				return {enhance};

				// Enhance a UBBEditor
				// Arguments: form
				function enhance(form) {
					if (form.matches('#dialog form') && !$(form, '#UBB_Menu')) {
						// in dialog and no menu exist, load UBBEditor
						loadUBBEditor(UBBEditor => work(form, UBBEditor));
					} else {
						// Directly in page, wait for UBBEditor
						detectDom(form, '#UBB_Menu', menu => work(form, unsafeWindow.UBBEditor))
					}

					function work(form, UBBEditor) {
						const textarea = $(form, 'textarea[name="pcontent"]');
						const ptitle = $(form, 'input[name="ptitle"]') || makeptitle();

						imgSelector();
						extensiveEditor();
						editorDrafts();
						hotkeyReply();
						onsubmitEnhance();

						// Broadcast: a new UBBEditor has created (Not used yet)
						FL_postMessage('UBBEditorCreated', {form, UBBEditor});

						// Provide image inputs
						function imgSelector() {
							// Imager menu
							const menu = $(form, '#UBB_Menu');
							const elmImage = $(form, '#menuItemInsertImage');
							const imagers = new WenkuBlockGUI.PlusList({
								id: 'plus_imager',
								list: [
									{value: CONST.Text.InsertWebImage, tip: CONST.Text.IWItip, onclick: insertWebpic},
									{value: CONST.Text.SelectLocalImage, tip: CONST.Text.SLItip, onclick: pickfile}
								],
								parentElement: menu.parentElement,
								insertBefore: $(form, '#SmileListTable'),
								visible: false,
								onshow: onshow
							});
							elmImage.onclick = (e) => {
								e.stopPropagation();
								imagers.show();
							};
							$AEL(document, 'click', imagers.hide);

							// drag-drop & copy-paste
							textarea.addEventListener('paste', pictureGot);
							textarea.addEventListener('dragenter', destroyEvent);
							textarea.addEventListener('dragover', destroyEvent);
							textarea.addEventListener('drop', pictureGot);

							function onshow() {
								imagers.div.style.left = UBBEditor.GetPosition(elmImage).x + 'px';
								imagers.div.style.top = UBBEditor.GetPosition(elmImage).y + 20 + 'px';
							}

							function pickfile() {
								const fileinput = $CrE('input');
								fileinput.type = 'file';
								fileinput.addEventListener('change', pictureGot);
								fileinput.click();
							}

							function pictureGot(e) {
								// Get picture file
								const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
								if (!input.files || input.files.length === 0) {return false;};
								const file = input.files[0];
								const mimetype = file.type;
								const name = file.name;

								// Pasting an unrecognizable file is not a mistake
								// Maybe the user just wants to paste the filename here
								// Otherwise getting an unrecognizable file is a mistake
								if (!mimetype || mimetype.split('/')[0] !== 'image') {
									if (!e.clipboardData && !window.clipboardData) {
										destroyEvent(e);
										alertify.error(CONST.Text.ImageOnly);
									}
									return false;
								} else {
									destroyEvent(e);
								}

								// Insert picture marker
								const id = utils.randstr(16, true, textarea.value);
								const marker = replaceText('[image_uploading={ID} name={NAME}]', {
									'{ID}': id,
									'{NAME}': name
								});
								utils.insertText(textarea, marker);

								// Upload
								alertify.notify(CONST.Text.Uploading);
								imager.upload(file, function onload(url) {
									// Calculate selection position changes
									const [posStart, posEnd] = [textarea.selectionStart, textarea.selectionEnd].map(
										pos => calcPosition(pos, textarea.value.indexOf(marker), marker.length, url.length)
									);

									// Just replace but not replaceAll, because replaceAll make calculation selection position changes much more difficult
									textarea.value = textarea.value.replace(marker, url);

									// Apply selection position changes
									setTimeout(e => textarea.setSelectionRange(posStart, posEnd));

									// Show success
									alertify.success(CONST.Text.UploadSuccess);
								}, function onerror(err) {
									textarea.value = textarea.value.replace(marker, marker.replace(id, CONST.Text.ErrorMarkerID));
									alertify.error(CONST.Text.UploadError);
									DoLog(LogLevel.Error, ['Reply area enhance - pictureGot: Image upload error', err]);
								}, ['custom-extention']);

								// Calculate selection start/end with current position and text modification
								function calcPosition(curPos, textStart, oldLen, newLen) {
									const textEnd = textStart + oldLen;
									if (curPos < textStart) {
										// Selection position is not affected by text modification
										return curPos;
									} else if (curPos >= textStart && curPos <= textEnd) {
										// Selection position is somewhere inside old text - just set position to the end of new text
										return textStart + newLen;
									} else if (curPos > textEnd) {
										// Selection position is completly affected, move position with length modification
										return curPos + newLen - oldLen;
									}
									// NO WAY, CODE SHOULDNT BE HERE
									Err('calcPosition: Unexpected execution');
									return 0;
								}
							}

							function insertWebpic() {
								alertify.prompt(CONST.Text.alertTitle, CONST.Text.InputImageURL, CONST.Text.DefaultInputURL, function onok(e, val) {
									if (!/^https?:\/\//.test(val)) {
										alertify.alert(CONST.Text.alertTitle, CONST.Text.ProtocolMissing);
										return false;
									}
									if (!/\.(jpe?g|png|gif|bmp)$/.test(val)) {
										alertify.confirm(CONST.Text.alertTitle, CONST.Text.ExtensionInvalid);
										return false;
									}
									const url = new URL(val).href;
									utils.insertText(textarea, url);
								}, function oncancel() {});
							}
						}

						// Provide #ptitle if doesn't exist by default
						function makeptitle() {
							if (!$(form, 'input[name="ptitle"]')) {
								const html = '<tr>\n    <td class="odd" width="25%">标题</td>\n    <td class="even"><input type="text" class="text" name="ptitle" id="ptitle" size="60" maxlength="60" value=""></td>\n  </tr>'
								$(form, 'caption+tbody').insertAdjacentHTML('afterbegin', html);
							}
							return $(form, 'input[name="ptitle"]');
						}

						// Textarea auto expand (A HUGE MOUNTAIN OF SHIT CODE)
						// 你真的要点开看这里的代码吗？在这里放一双没有看过这代码的眼睛先（👀）
						// 如果想要了解其原理，可以参照 https://luszy.com/archives/383.html
						// 虽然但是，这段代码他能跑🏃🏻🏃🏻🏃🏻！！！
						function extensiveEditor() {
							if (![...$All('#dialog form')].includes(form)) {
								const cstyle = getComputedStyle(textarea);
								// Create elements
								const container = $$CrE({
									tagName: 'div',
									styles: {
										position: 'relative',
										'min-width': `${textarea.clientWidth}px`,
										'min-height': `${textarea.clientHeight}px`,
										'max-width': '650px',
										width: 'fit-content',
										height: 'fit-content',
										display: 'flow-root',
									}
								});
								const placeholder = $$CrE({
									tagName: 'div',
									styles: {
										visibility: 'hidden',
										'max-width': '650px',
										'max-height': '60vh',
										'overflow-y': 'scroll',
										...['white-space', 'word-wrap', 'font', 'padding', 'margin', 'border'].reduce((style, prop) => {
											style[prop] = cstyle[prop];
											return style;
										}, {}),
									}
								});
								// Adjust textarea's style
								textarea.style.width = `calc(100% - ${cstyle['border-left-width']} - ${cstyle['border-right-width']})`;
								textarea.style.height = `calc(100% - ${cstyle['border-top-width']} - ${cstyle['border-bottom-width']})`;
								textarea.style.top = textarea.style.left = '0';
								textarea.style.position = 'absolute';
								textarea.style.resize = 'none';
								textarea.style['overflow-y'] = 'scroll';
								textarea.style['max-width'] = '650px';
								textarea.style['max-height'] = '60vh';
								// Modify innerText while textarea.value changes
								const writeValue = e => {
									setTimeout(e => {
										placeholder.innerText = textarea.value;
										textarea.value.endsWith('\n') && (placeholder.innerHTML += ' ');
									}, 0);
								}
								$AEL(textarea, 'input', writeValue);
								$AEL(textarea.form, 'reset', writeValue);
								Object.defineProperty(textarea, 'value', {
									get: Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').get,
									set: function(val) {
										const rval = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.apply(this, arguments);
										writeValue();
										return rval;
									},
									enumerable: true,
									configurable: true
								})
								writeValue();
								// Modify DOM
								textarea.insertAdjacentElement('afterend', container);
								container.appendChild(textarea);
								container.appendChild(placeholder);
							}
						}

						// Drafting
						function editorDrafts() {
							// No drafts for in-dialog forms
							if (form.matches('#dialog form')) {
								return false;
							}

							// Draft status text
							const text = $$CrE({
								tagName: 'span',
								props: { innerText: CONST.Text.DraftInited },
								styles: { 'margin-left': '0.5em' }
							});
							const container = $(form, 'table:not(table table)>tbody>tr:last-of-type>td:last-of-type');
							[...container.childNodes].filter(node => node.nodeName === '#text').forEach(node => node.remove());
							container.appendChild(text);

							// form properties, for recognizing different forms
							const props = [...$All(form, 'input[type="hidden"]')].reduce((obj, input) => ((obj[input.name] = obj[input.value], obj)), {});
							props.formaction = form.getAttribute('action');
							const key = Object.keys(props).sort().map(prop => `${prop}=${props[prop]}`).join(',');

							// Save draft when change fires, or every 30 seconds passed
							[textarea, ptitle].forEach(elm => ['change', 'blur'].forEach(evt => $AEL(elm, evt, e => saveDraft())));
							setInterval(saveDraft, 30 * 1000);

							// Load previous draft from config
							loadDraft();

							function loadDraft() {
								const draft = CONFIG.drafts.find(d => d.key === key);
								if (draft) {
									ptitle.value = draft.title;
									textarea.value = draft.content;
									text.innerText = replaceText(CONST.Text.DraftLoaded, {
										'{time}': utils.getTime(draft.time)
									});
								}
							}

							function saveDraft() {
								const i = CONFIG.drafts.findIndex(d => d.key === key);
								if (!ptitle.value && !textarea.value) {
									if (i >= 0) {
										CONFIG.drafts.splice(i, 1);
										text.innerText = CONST.Text.DraftCleared;
									}
									return false;
								}

								const draft = i >= 0 ? CM.getConfig(`drafts/${i}`) : {key};
								draft.title = ptitle.value;
								draft.content = textarea.value;
								draft.time = new Date().getTime();
								draft.url = location.href;
								i >= 0 ? CM.setConfig(`drafts/${i}`, draft) : CONFIG.drafts.push(draft);

								text.innerText = replaceText(CONST.Text.DraftSaved, {
									'{time}': utils.getTime(draft.time)
								});
							}
						}

						// Reply with hotkey
						function hotkeyReply() {
							const submitBtn = $(form, '[type="submit"]');
							submitBtn.value = submitBtn.value.trim() + ' ' + CONST.Text.SubmitBtnHotkey;
							submitBtn.style.padding = '0.4em 0.8em';
							submitBtn.style.height = '100%';
							$AEL(form, 'keydown', e => {
								if (e.key === 'Enter' && (utils.getOS() !== 'Windows' ? (e.metaKey || e.ctrlKey) : e.ctrlKey)) {
									submitBtn.click();
								}
							});
						}

						// onsubmit enhance
						function onsubmitEnhance() {
							$AEL(form, 'submit', function(e) {
								// Do not submit empty form
								if (!textarea.value) {
									alertify.alert(CONST.Text.alertTitle, CONST.Text.NoEmptySubmit);
									e.preventDefault();
									return false;
								}

								// Content length check (≥7)
								if (utils.formEncode(textarea.value).replaceAll(/%[0-9ABCDEF]{2}/g, '%').length < 7) {
									alertify.alert(CONST.Text.alertTitle, CONST.Text.ContentTooShort);
									e.preventDefault();
									return false;
								}

								// Reply without page reload while in reviewshow page
								if (utils.testChecker(FL_getFunction('ReviewEnhance').checker)) {
									e.preventDefault();
									utils.submitForm(form, function onload(response) {
										FL_postMessage('ReplySent', {response, form, UBBEditor});
									}, function onerror(err) {
										FL_postMessage('ReplyFailed', {err, form, UBBEditor});
										DoLog(LogLevel.Error, ['Send review reply err', err]);
										alertify.alert(CONST.Text.alertTitle, CONST.Text.ReplyFailed);
									});
								}
							});
						}
					}

					// Loadin UBBEditor with callback(UBBEditor)
					function loadUBBEditor(callback, retry=3) {
						const textarea = $(form, '#pcontent');
						const id = textarea.id = 'pcontent-' + utils.randstr(4); //id shouldn't contain '"' and '\'

						// Cache ubbCode
						if (!ubbCode) {
							GM_xmlhttpRequest({
								method: 'GET',
								url: `https://${location.host}/scripts/ubbeditor_gbk.js`,
								responseType: 'blob',
								onload: response => {
									const blob = response.response;
									const reader = new FileReader();
									$AEL(reader, 'load', e => {
										ubbCode = reader.result;
										loadin();
									});
									$AEL(reader, 'error', err => {
										Err('ReplyAreaEnhance: loadUBBEditor reader error');
									});
									reader.readAsText(blob, ['gbk', 'big5'][utils.getLang()]);
								},
								onerror: e => --retry ? loadUBBEditor(retry) : Err('ReplyAreaEnhance: loadUBBEditor xhr error')
							});
						} else {
							loadin();
						}

						function loadin() {
							const hideeve = 'function hideeve(){form.querySelector("#"+ubb_subdiv).style.display = "none";}'
							const code = `${ubbCode};\n${hideeve}\nUBBEditor.Create('${id}'); cb(UBBEditor);`;
							const func = Function('form', 'cb', code);
							setTimeout(e => func(form, callback), 0);
						}
					}
				}
			},
			alwaysRun: function() {
				const utils = require('utils');
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				CM.updateAllConfigs();

				const time = new Date().getTime();
				const expires = t => (time - t) >= CONFIG.draftexpires * 24 * 60 * 60 * 1000;
				const drafts = CM.getConfig('drafts').filter(d => !expires(d.time));
				CM.setConfig('drafts', drafts);
			},
			setting: function setter() {
				const SettingPanel = require('SettingPanel');
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				CM.updateAllConfigs();

				const panel = new SettingPanel.easySettings({
					title: CONST.Text.AlertTitle,
					areas: [{
						title: CONST.Text.DraftSetting,
						items: [{
							text: CONST.Text.Expires,
							path: 'draftexpires',
							type: 'number'
						}],
					}]
				}, CM);

				new SettingPanel.easyStorage({
					title: CONST.Text.StorageSetting.SettingTitle,
					path: 'drafts',
					key: 'key',
					panel,
					props: {
						title: {
							type: 'string',
							name: CONST.Text.StorageSetting.title
						},
						content: {
							type: 'string',
							name: CONST.Text.StorageSetting.content
						},
						time: {
							type: 'time',
							name: CONST.Text.StorageSetting.time
						}
					},
					operations: [{
						type: 'func',
						text: CONST.Text.StorageSetting.Edit,
						func: (e, items, index) => {
							window.open(items[index].url);
							return items;
						}
					}, {type: 'delete'}]
				}, CM);
			}
		},

		// Index block folding
		{
			name: '首页版块折叠',
			description: '为首页所有版块提供具有记忆性的折叠/展开',
			id: 'IndexFolding',
			STOP: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/index\.php([\?#][\s\S]*)?$/
				]
			},
			CONST: {
				Text: {
					Fold: '折叠',
					Unfold: '展开',
					ResetTitle: `${GM_info.script.name}-首页版块折叠 功能提示`,
					ResetTip: `由于文库首页新增了以往没有的版块，现在首页各个板块的折叠/展开状态需要您重新设置。`,
				},
				CSS: '.block.fold>.blockcontent {display: none;}.block>.blocktitle>.plus-fold {float: right;padding-right: 7px;cursor: pointer;}',
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						fold: {}
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			func: function() {
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
                detectDom('head').then(head => addStyle(CONST.CSS, 'plus-indexfolding'));

				// Deal each blocks once they loaded
				detectDom({
					// Detect blocktitle so when we call dealBlock we have blocktitle loaded
					selector: '.block>.blocktitle',
					callback: blocktitle => dealBlock(blocktitle.parentElement)
				});

				function dealBlock(block) {
					if ($(block, '.blocktitle>.plus-fold')) {
						return false;
					}

					// 'fold' class on .block
					const id = $(block, '.blocktitle').innerText;
					const blockfold = CONFIG.fold[id] || (CONFIG.fold[id] = false);

					// recorded: true - fold, false - not fold; unrecorded: undefined - not fold
					// repeating classList.add would not cause multiple same class on one elm, removing class that doesn't exist occurs no error
					block.classList[blockfold ? 'add' : 'remove']('fold');

					// Folding button
					const blocktitle = $(block, '.blocktitle');
					const button = $$CrE({
						tagName: 'span',
						props: {
							innerText: blockfold ? CONST.Text.Unfold : CONST.Text.Fold
						},
						classes: ['plus-fold'],
						styles: {
							'line-height': `${blocktitle.clientHeight}px`
						},
						listeners: [['click', e => {
							const newfold = !block.classList.contains('fold');
							block.classList[newfold ? 'add' : 'remove']('fold');
							button.innerText = newfold ? CONST.Text.Unfold : CONST.Text.Fold;
							CONFIG.fold[id] = newfold;
						}]]
					});
					$(block, '.blocktitle').appendChild(button);
				}
			}
		},

		// Review collection
		{
			name: '书评收藏',
			description: '收藏特定书评在文库首页展示',
			id: 'ReviewCollection',
			STOP: false,
			checker: {
				type: 'regurl',
				value: [
					/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php\/?/,
					/^https?:\/\/www\.wenku8\.(net|cc)\/index\.php([\?#][\s\S]*)?$/,
				]
			},
			CONST: {
				Text: {
					ReviewCollection: '书评收藏',
					StarButton: '加入/取消收藏此书评',
					AlertTitle: '书评收藏'
				},
				URL: {
					ReviewShow: `https://${location.host}/modules/article/reviewshow.php?rid={rid}`
				},
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						reviews: [{
							rid: '228884',
							title: '主题：文库导航姬'
						}],
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			func: function() {
				const WenkuBlockGUI = require('WenkuBlockGUI');
				const SPanel = require('SidePanel');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;

				const functions = [{
					checker: {
						type: 'regurl',
						value: /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php\/?/
					},
					func: returnValue => {
						const starBtn = SPanel.insert({
							index: 3,
							faicon: `${CONFIG.reviews.some(r => r.rid === getUrlArgv('rid')) ? 'fa-solid' : 'fa-regular'} fa-star`,
							tip: CONST.Text.StarButton,
							onclick: e => {
								const rid = getUrlArgv('rid');
								const star = CONFIG.reviews.findIndex(r => r.rid === rid);
								starBtn.faicon.className = `${star >= 0 ? 'fa-regular' : 'fa-solid'} fa-star`;
								star >= 0 ? CONFIG.reviews.splice(star, 1) : CONFIG.reviews.push({
									rid, title: $('#content>table th>strong:not(table table strong)').innerText
								});
							}
						});
					}
				}, {
					checker: {
						type: 'regurl',
						value: /^https?:\/\/www\.wenku8\.(net|cc)\/index\.php([\?#][\s\S]*)?$/,
					},
					detectDom: '.main.m_foot',
					func: returnValue => {
						const block = WenkuBlockGUI.makeIndexRightToplistBlock({
							title: CONST.Text.ReviewCollection,
							links: CONFIG.reviews.map(r => ({
								url: replaceText(CONST.URL.ReviewShow, {'{rid}': r.rid}),
								text: r.title
							}))
						});
						$('#left').appendChild(block.block);

						// Drag-drop to move books
						const sortable = new Sortable.default(block.blockcontent.children[0], {
							draggable: 'li'
						});
						sortable.on('sortable:sorted', function(e) {
							const div = e.dragEvent.data.originalSource;
							const reviews = moveItem(CM.getConfig('reviews'), e.oldIndex, e.newIndex);
							CONFIG.reviews = reviews;
							/* Wrong coding:
							The following code CANNOT WORK! Because CONFIG.books[index] saves the path that
							contains index, and always gives the current value of this path in GM_storage.
							As we know, moveItem removes arr[from] and then inserts it to arr[to], and
							as moveItem inserts(using arr.splice) CONFIG.books[oldIndex] into newIndex,
							the proxy for CONFIG.books[oldIndex]'s path is currently pointing to
							the new value at CONFIG.books[oldIndex], which is the next book of the
							dragging one! Tempermonkey will look into its(the next book's) props, and save
							them into disk, at CONFIG.books[newIndex], which should be storing the dragging
							book's properties.
							To avoid this from happenning, we get the pure object using CM.getConfig, sort it
							using moveItem, and then save it to GM_storage manually, just like code above.

							The wrong code is written below:
							moveItem(CONFIG.reviews, e.oldIndex, e.newIndex);
							*/
						});
					}
				}];

				function moveItem(arr, from, to) {
					const item = arr.splice(from, 1)[0];
					arr.splice(to, 0, item);
					return arr;
				}

				return utils.loadFuncs(functions);
			}
		},

		// Account switching
		{
			name: '账号快捷切换',
			description: '顶栏快速切换账号',
			id: 'AccountSwitcher',
			STOP: false,
			global: true,
			checker: {
				type: 'switch',
				value: true
			},
			CONST: {
				Text: {
					Heading: '切换账号：',
					Empty: '未添加任何账号',
					NotLoggedin: '未登录',
					AddNewAccount: '[+] 添加账号',
					SaveAccount: `保存账号到 ${GM_info.script.name}`,
					LoginErrorTitle: '登录错误',
					LoginError: '登录错误，请检查您的网络后重试',
					AlertTitle: '账号快捷切换',
					SaveAccountWhenLogin: '登录时自动保存账号',
					AccountSetting: {
						SettingTitle: '账号管理',
						Username: '账号',
						Password: '密码(已加密，点击查看)',
					}
				},
				Data: {
					Login: '&username={username}&password={password}&usecookie={usecookie}&action=login'
				},
				URL: {
					LoginPage: `https://${location.host}/login.php?ajax_gets=jieqi_contents`,
					Login: `https://${location.host}/login.php?do=submit`
				},
				Config_Ruleset: {
					'version-key': 'config-version',
					'ignores': ["LOCAL-CDN"],
					'defaultValues': {
						saveAccounts: true,
						secret: '', // secret to encrypt & decrypt account passwords
						accounts: [/*{
							username: '用户名 明文',
							password: '密码 密文'
						}*/]
					},
					'updaters': {
						/*'config-key': [
							function() {
								// This function contains updater for config['config-key'] from v0 to v1
							},
							function() {
								// This function contains updater for config['config-key'] from v1 to v2
							}
						]*/
					}
				},
			},
			func: function() {
				const utils = require('utils');
				const CONST = FuncInfo.CONST;
				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				detectDom({ selector: '.main.m_top .fr', callback: e => work() });
				if (!CONFIG.secret) {CONFIG.secret = utils.randstr()}

				function work() {
					accountSwitcher();
					accountSaver();
				}

				function accountSwitcher() {
					const curUsername = getCurUsername();
					const ACCADDKEY = `AddAccount_${utils.randstr()}`;
					const fl = $('.main.m_top .fl');
					const select = $$CrE({
						tagName: 'select',
						listeners: [['change', e => {
							if (select.value === ACCADDKEY) {
								newAccount();
								Array.from(select.children).find(opt => opt.value === curUsername).selected = true;
							} else if (select.value) {
								switchTo(select.value);
							}
						}]]
					});
					if (CONFIG.accounts.length > 0) {
						CONFIG.accounts.forEach(acc => select.appendChild($$CrE({
							tagName: 'option',
							props: {
								value: acc.username,
								innerText: acc.username,
								selected: acc.username === curUsername,
							}
						})));
						if (!curUsername) {
							select.insertAdjacentElement('afterbegin', $$CrE({
								tagName: 'option',
								props: {
									innerText: CONST.Text.NotLoggedin,
									selected: true
								}
							}));
						}
					} else {
						select.appendChild($$CrE({
							tagName: 'option',
							props: {
								innerText: CONST.Text.Empty
							}
						}));
					}
					select.appendChild($$CrE({
						tagName: 'option',
						props: {
							value: ACCADDKEY,
							innerText: CONST.Text.AddNewAccount
						}
					}));
					fl.insertAdjacentText('beforeend', CONST.Text.Heading);
					fl.appendChild(select);
				}

				// Record new account
				function newAccount() {
					utils.openDialog(CONST.URL.LoginPage);
				}

				// Switch to an exist account
				function switchTo(username) {
					const password = utils.decrypt(CONFIG.accounts.find(acc => acc.username === username).password, CONFIG.secret);

					GM_xmlhttpRequest({
						method: 'POST',
						url: CONST.URL.Login,
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						data: replaceText(CONST.Data.Login, {
							'{username}': utils.formEncode(username),
							'{password}': utils.formEncode(password),
							'{usecookie}': utils.formEncode('315360000'), // '有效期：保存一年'
						}),
						responseType: 'blob',
						onload: response => {
							utils.parseDocument(response.response, onAccountSwitched, response);
						},
						onerror: err => alertify.error(CONST.Text.LoginError),
						ontimeout: err => alertify.error(CONST.Text.LoginError)
					});
				}

				// Save account for every login form
				function accountSaver() {
					detectDom({
                        selector: 'form[name="frmlogin"]',
                        callback: form => {
                            // Whether-to-save checkbox
                            const checkbox = $$CrE({
                                tagName: 'input',
                                props: {
                                    type: 'checkbox',
                                    checked: CONFIG.saveAccounts
                                },
                                classes: ['plus-saveaccount'],
                                styles: { 'vertical-align': 'middle' },
                                listeners: [['change', e => {
                                    CONFIG.saveAccounts = checkbox.checked;
                                }]]
                            });
                            const span = $$CrE({
                                tagName: 'span',
                                props: { innerText: CONST.Text.SaveAccount },
                                styles: { 'vertical-align': 'middle' }
                            });
                            const label = $$CrE({
                                tagName: 'label',
                                props: { innerText: CONST.Text.SaveAccount },
                                styles: { 'text-align': 'center' }
                            });
                            const tr = $$CrE({
                                styles: {
                                    'text-align': 'center',
                                }
                            });
                            label.insertAdjacentElement('afterbegin', checkbox);
                            tr.appendChild(label);
                            $(form, 'tbody').appendChild(tr);

                            // Submit with ajax
                            $AEL(form, 'submit', e => {
                                e.preventDefault();

                                utils.submitForm(form, function onload(response) {
                                    const blob = response.response;
                                    utils.parseDocument(blob, onAccountSwitched, response);
                                }, function onerror(err) {
                                    alertify.error(CONST.Text.LoginError);
                                    Err(err);
                                });
                            });
                        }
					});
				}

				function onAccountSwitched(dom, response) {
					const redirector = $(dom.head, 'meta[http-equiv="refresh"]');
					if (dom.body.childElementCount === 1 && !redirector) {
						// Error page
						[...$All(dom, 'a[href^="javascript:"]')].forEach(button => {
							button.href = 'javascript: void 0;';
							$AEL(button, 'click', e => altbox.close());
						});
						const altbox = alertify.alert(CONST.Text.LoginErrorTitle, $(dom, '.block'));
					} else if (dom.body.childElementCount === 1 && redirector) {
						// Login successed
						// Set cookie for xbrowser
						if (window.mbrowser) {
							response.responseHeaders.split('\n').filter(str => str).map(str => str.split(/\s*:\s*/, 2)).filter(arr => arr[0].toLowerCase() === 'set-cookie').forEach(arr => document.cookie = arr[1]);
						}

						// Save account
						const form = $('form[name="frmlogin"]');
						if (form && $(form, '.plus-saveaccount').checked) {
							const username = $(form, 'input[name="username"]').value;
							const password = utils.encrypt($(form, 'input[name="password"]').value, CONFIG.secret);

							CONFIG.accounts.every(acc => acc.username !== username) && CONFIG.accounts.push({ username, password });
						}

						if ($('#dialog')) {
							// Login in dialog
							unsafeWindow.closeDialog();
							utils.refreshPage();
						} else {
							// Login in page or switcher
							const url = redirector.content.match(/url=([^;]+)/)[1];
							location.href = url;
						}
					} else {
						// Returned something that isn't an api page
						// Shouldn't be here
					}
				}

				function getCurUsername() {
					const match = $URL.decode(document.cookie).match(/[;,]\s*jieqiUserName=([0-9a-zA-Z]+)[;,]/);
					const curUsername = match ? match[1] : null;
					return curUsername;
				}
			},
			setting: function setter() {
				const SettingPanel = require('SettingPanel');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;

				const CM = new ConfigManager(CONST.Config_Ruleset);
				const CONFIG = CM.Config;
				CM.updateAllConfigs();

				const panel = new SettingPanel.easySettings({
					title: CONST.Text.AlertTitle,
					items: [{
						text: CONST.Text.SaveAccountWhenLogin,
						path: 'saveAccounts',
						type: 'boolean'
					}]
				}, CM);

				SettingPanel.easyStorage({
					title: CONST.Text.AccountSetting.SettingTitle,
					path: 'accounts',
					key: 'username',
					panel,
					props: {
						username: {
							type: 'string',
							name: CONST.Text.AccountSetting.Username
						},
						password: {
							type: 'string',
							name: CONST.Text.AccountSetting.Password,
							styles: { cursor: 'default' },
							listeners: [['click', function(username, e) {
								if (!e.isTrusted) { return false; }
								const password = utils.decrypt(CONFIG.accounts.find(acc => acc.username === username).password, CONFIG.secret);
								this.innerText = password;
							}]],
							oncreate: function(username, block) {
								block.element.innerText = '***';
							}
						}
					},
					operations: [{type: 'delete'}]
				}, CM);
			}
		},

		// Old Config Importer
		{
			name: '旧版配置导入',
			description: '从1.x.x.x版本的旧版脚本自动导入旧配置',
			id: 'Old-Config-Importer',
			STOP: true,
			checker: {
				type: '',
				value: []
			},
			CONST: {},
			func: function() {},
			setting: function() {}
		},

		// Toy box
		{
			name: '小功能集合',
			description: '一些小功能，如未登录时www.wenku8.net自动跳转到www.wenku8.net/index.php等等',
			id: 'toybox',
			system: true,
			STOP: false,
			checker: {
				type: 'switch',
				value: true
			},
			CONST: {
				Text: {
					RunningTip: `${GM_info.script.name} 正在运行，版本 ${GM_info.script.version}`
				}
			},
			func: function() {
				const CommonStyle = require('CommonStyle');
				const utils = require('utils');
				const CONST = FuncInfo.CONST;

				const functions = [
					// https://www.wenku8.net/ 跳转到 https://www.wenku8.net/index.php
					// 通常来说网页会自动跳转，但是如果不登录就不会，所以帮未登录用户跳一下
					{
						toyid: 'IndexJump',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\/?$/
						},
						func: e => location.href = `https://${location.host}/index.php`
					},

					// 没有www.开头时，跳转到www.开头的同网址
					// 无www.开头的证书对不上，www.开头的证书正常，跳转过来降安全风险，同时为其他FunctionModule提供便利
					{
						toyid: 'wwwJump',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/wenku8\.(net|cc)\/?/
						},
						func: e => location.href = location.href.replace(/^https?:\/\/wenku8\.(net|cc)(\/?)/, 'https://www.wenku8.$1$2')
					},

					// http页面跳转到https（这种情况通常在旧版浏览器中出现）
					{
						toyid: 'httpsJump',
						checker: {
							type: 'regurl',
							value: /^http:\/\/www\.wenku8\.(net|cc)\/?/
						},
						func: e => location.href = location.href.replace(/^http:\/\//, 'https://')
					},

					// 首页显示一个正在运行的文字提示
					{
						toyid: 'runningText',
						checker: {
							type: 'regurl',
							value: /^https?:\/\/www\.wenku8\.(net|cc)\/index\.php([\?#][\s\S]*)?$/
						},
						detectDom: '#right',
						func: e => {
							const board = $('#centers>.block:first-of-type>.blockcontent');
							board.appendChild($CrE('br'));
							board.appendChild($$CrE({
								tagName: 'span',
								props: {
									innerText: CONST.Text.RunningTip
								},
								classes: [CommonStyle.ClassName.Text]
							}));
						}
					},

					// 兼容 haoa 的 轻小说文库下载
					{
						toyid: 'wenku8HaoaCompat',
						detectDom: 'body',
						func: e => {
							// Our script requires user's browser to be the latest, at least String.prototype.replaceAll exists
							if (String.prototype.replaceAll.toString() !== 'function replaceAll() { [native code] }') {
								const ifr = $$CrE({
									tagName: 'iframe',
									props: { srcdoc: '<html></html>' },
									styles: {
										border: '0',
										padding: '0',
										width: '0',
										height: '0',
										position: 'fixed',
										'pointer-events': 'none'
									}
								});
								document.body.appendChild(ifr);
								String.prototype.replaceAll = ifr.contentWindow.String.prototype.replaceAll;
							} else {
								const replaceAll = String.prototype.replaceAll;
								Object.defineProperty(String.prototype, 'replaceAll', {
									get: e => replaceAll,
									set: e => true
								});
							}
						}
					}
				];

				return utils.loadFuncs(functions);;
			}
		},

		// Function Module Model
		/*
		{
			name: 'XXXX',
			description: 'Xxxx',
			id: 'XxXx',
			STOP: true,
			checker: {
				type: '',
				value: []
			},
			CONST: {},
			func: function() {},
			setting: function() {}
		},
		*/
	];

	main();
	function main() {
		GMXHRHook(5);

		const FuncLoader = new FunctionLoader(Functions);
		typeof upgradeConfigV2 === 'function' && upgradeConfigV2();
		FuncLoader.GlobalProvides = {
			GM_xmlhttpRequest, GM_getResourceText,
			LogLevel, DoLog, Err,
			$, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent,
			copyProp, copyProps, parseArgs, escJsStr, replaceText,
			getUrlArgv, dl_browser, dl_GM,
			AsyncManager,
			ConfigManager, $URL,
			GreasyFork,
			tippy, alertify, Sortable, vkbeautify, Darkmode, CryptoJS
		};
		FuncLoader.loadAll();
	}

	function FunctionLoader(functions) {
		// function DoLog() {}
		// Arguments: level=LogLevel.Info, logContent, logger='log'
		const [LogLevel, DoLog] = (function() {
			const LogLevel = {
				None: 0,
				Error: 1,
				Success: 2,
				Warning: 3,
				Info: 4,
			};

			return [LogLevel, DoLog];
			function DoLog() {
				// Get window
				const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

				const LogLevelMap = {};
				LogLevelMap[LogLevel.None] = {
					prefix: '',
					color: 'color:#ffffff'
				}
				LogLevelMap[LogLevel.Error] = {
					prefix: '[Error]',
					color: 'color:#ff0000'
				}
				LogLevelMap[LogLevel.Success] = {
					prefix: '[Success]',
					color: 'color:#00aa00'
				}
				LogLevelMap[LogLevel.Warning] = {
					prefix: '[Warning]',
					color: 'color:#ffa500'
				}
				LogLevelMap[LogLevel.Info] = {
					prefix: '[Info]',
					color: 'color:#888888'
				}
				LogLevelMap[LogLevel.Elements] = {
					prefix: '[Elements]',
					color: 'color:#000000'
				}

				// Current log level
				DoLog.logLevel = (win.isPY_DNG && win.userscriptDebugging) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

				// Log counter
				DoLog.logCount === undefined && (DoLog.logCount = 0);

				// Get args
				let [level, logContent, logger] = parseArgs([...arguments], [
					[2],
					[1,2],
					[1,2,3]
				], [LogLevel.Info, 'DoLog initialized.', 'log']);

				// Write storage log
				systemLog(isWenkuFunction(this) ? this.id : null, Object.keys(LogLevel)[Object.values(LogLevel).indexOf(level)], logContent, logger);

				// Log to console
				let msg = '%c' + LogLevelMap[level].prefix + (typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + (isWenkuFunction(this) ? `[${this.id}]` : '') + (LogLevelMap[level].prefix ? ' ' : '');
				let subst = LogLevelMap[level].color;

				switch (typeof(logContent)) {
					case 'string':
						msg += '%s';
						break;
					case 'number':
						msg += '%d';
						break;
					default:
						msg += '%o';
						break;
				}

				// Log to console when log level permits
				if (level <= DoLog.logLevel) {
					if (++DoLog.logCount > 512) {
						console.clear();
						DoLog.logCount = 0;
					}
					console[logger](msg, subst, logContent);
				}
			}
		}) ();

		const FL = this;
		FL.Messager = new Messager();
		FL.DefaultProvides = {window, unsafeWindow, GM_info, require, isWenkuFunction, Messager: FL.Messager};
		FL.CodeProvides = {ConfigManager};
		FL.GrantFuncs = {
			FL_listFunctions(id) {
				return functions.map(objFunc => objFunc.id);
			},
			FL_getFunction(id) {
				const objFunc = functions.find(objFunc => objFunc.id === id);
				return objFunc ? objFunc : null;
			},
			FL_disableFunction(id) {
				const objFunc = functions.find(objFunc => objFunc.id === id);
				objFunc && CM.setConfig(`funcs/${id}/enabled`, false);
			},
			FL_enableFunction(id) {
				const objFunc = functions.find(objFunc => objFunc.id === id);
				objFunc && CM.setConfig(`funcs/${id}/enabled`, true);
			},
			FL_loadSetting(id) {
				const objFunc = functions.find(objFunc => objFunc.id === id);
				loadSetting(objFunc);
			},
			FL_getDebug() {
				return CM.getConfig('debug');
			},
			FL_exportConfig(filename='export.json') {
				const url = URL.createObjectURL(new Blob([ JSON.stringify({
					type: 'config',
					time: new Date().getTime(),
					data: CM.getConfig('funcs')
				}) ], { type: 'application/json' }));
				dl_browser(url, filename);
				setTimeout(() => URL.revokeObjectURL(url));
			},
			FL_importConfig(callback) {
				$$CrE({
					tagName: 'input',
					props: { type: 'file' },
					listeners: [['change', e => {
						const file = e.target.files[0];
						const reader = new FileReader();
						reader.onload = e => {
							let json;
							try {
								json = JSON.parse(reader.result);
							} catch(err) {
								callback(1); // File is not valid json
								return;
							}
							if (json?.type !== 'config' || !json.data) {
								callback(2); // Json is not valid config export
							}
							CM.setConfig('funcs', json.data);
							callback(0);
						};
						reader.readAsText(file);
					}]]
				}).click();
			},
			FL_postMessage(name, data=null, target=null) {
				const id = isWenkuFunction(this) ? this.id : null;
				FL.Messager.postMessage(name, data, id, target);
			},
			FL_recieveMessage(name, func, source=null, read_history=false) {
				const id = isWenkuFunction(this) ? this.id : null;
				FL.Messager.recieveMessage(name, func, source, id, read_history);
			}
		};
		FL.BindProvides = {DoLog, ...FL.GrantFuncs};
		FL.GlobalProvides = {};
		FL.returnValues = {};
		FL.load = load;
		FL.loadSetting = loadSetting;
		FL.executeAs = executeAs;
		FL.loadAll = loadAll;

		const CM = new ConfigManager(CONST.Config_Ruleset);
		const CONFIG = CM.Config;

		initStorage();
		initFunctions();
		initDebug();
		if (CONST.Config_Ruleset.globalUpdaters) {
			//CM.updateGlobal();
		}

		// Prepare storage structure
		function initStorage() {
			for (const objFunc of functions) {
				const userStorageKey = getUserStorageKey();
				// Function config
				!CONFIG.funcs.hasOwnProperty(objFunc.id) && (CONFIG.funcs[objFunc.id] = {
					enabled: true,
					storage: {},
				});

				// User config
				!objFunc.global && !CONFIG.funcs[objFunc.id].storage.hasOwnProperty(userStorageKey) && (CONFIG.funcs[objFunc.id].storage[userStorageKey] = {});
			}
		}

		// Pre-deal all objFunc
		/* set Symbol.toStringTag to 'Wenku8+_Function'
		   add storage object getter and setter
		*/
		function initFunctions() {
			for (const objFunc of functions) {
				deal(objFunc);
			}

			function deal(objFunc) {
				objFunc[Symbol.toStringTag] = 'Wenku8+_Function';
				for (const prop of Object.keys(CONFIG.funcs[objFunc.id])) {
					reflectProperty(CONFIG.funcs[objFunc.id], objFunc, prop);
				}
			}
		}

		// Prepare debug storage
		function initDebug() {
			const iframe = unsafeWindow !== unsafeWindow.top;
			const parent = iframe ? unsafeWindow.top.performance.timeOrigin : null;
			CONFIG.debug.push({
				timeOrigin: performance.timeOrigin,
				iframe, parent,
				console: []
			});

			// fill tab info when dom content loaded
			document.readyState === 'complete' ? saveTab() : $AEL(document, 'readystatechange', saveTab);
			function saveTab() {
				if (document.readyState === 'complete') {
					const DebugStore = CONFIG.debug.find(d => d.timeOrigin === performance.timeOrigin);
					if (DebugStore) {
						DebugStore.title = document.title;
						DebugStore.url = location.href;
					}
				}
			}

			// Catch window errors
			$AEL(unsafeWindow, 'error', function(e) {
				DoLog(LogLevel.Error, 'Global error catched');
				systemLog('window.onerror', 'Error', e.error, 'thrown error');
			});
		}

		function isWenkuFunction(obj) {
			return typeof obj === 'object' && obj !== null && obj.toString() === '[object Wenku8+_Function]';
		}

		// Load an objFunc
		function load(objFunc) {
			objFunc.STOP && Err('Cannot load an objFunc whose STOP sign is true');

			// Check if already loaded
			if (FL.returnValues.hasOwnProperty(objFunc.id)) {
				return FL.returnValues[objFunc.id];
			}

			// Call wrapper and save return value
			const return_value = executeAs(objFunc.func, objFunc);
			FL.returnValues[objFunc.id] = return_value;
			return return_value;
		}

		// Check whether an objFunc should be loaded automatically
		function check(objFunc) {
			if (!objFunc.enabled) {return false;}
			if (objFunc.STOP) {return false;}
			const checker = objFunc.checker;
			if (!checker) {return true;}
			const values = Array.isArray(checker.value) ? checker.value : [checker.value]
			return values.some(value => {
				switch (checker.type) {
					case 'regurl': {
						return !!location.href.match(value);
					}
					case 'func': {
						try {
							return value();
						} catch (err) {
							DoLog(LogLevel.Error, CONST.Text.Loader.CheckerError);
							DoLog(LogLevel.Error, err);
							return false;
						}
					}
					case 'switch': {
						return value;
					}
					case 'starturl': {
						return location.href.startsWith(value);
					}
					case 'startpath': {
						return location.pathname.startsWidth(value);
					}
					default: {
						DoLog(LogLevel.Error, CONST.Text.Loader.CheckerInvalid);
						return false;
					}
				}
			});
		}

		function loadSetting(objFunc) {
			typeof objFunc.setting === 'function' && executeAs(objFunc.setting, objFunc);
		}

		// Execute func on behalf of objFunc
		function executeAs(func, objFunc) {
			// Make wrapper
			const wrapperCode = wrapFuncCode(func);
			const storage = CM.makeSubStorage(`funcs/${objFunc.id}/storage/${objFunc.global ? '' : getUserStorageKey()}`);
			const BindProvides = bindProvides();
			const provides = {...FL.DefaultProvides, ...FL.GlobalProvides, ...BindProvides, ...storage, FuncInfo: objFunc};
			const wrapper = Function.apply(null, Object.keys(provides).concat(wrapperCode));

			// Execute
			return wrapper.apply(null, Object.values(provides));

			function wrapFuncCode(func) {
				let wrapperCode = `
					try {
						return (${func.toString()})();
					} catch (err) {
						DoLog(LogLevel.Error, \`Function ${escJsStr(objFunc.id)} error\`);
						if (unsafeWindow.isPY_DNG && unsafeWindow.userscriptDebugging) {
							// Thrown error contains error stacks in eval scope
							throw err;
						} else {
							// console.error only contains error stacks in outer(loader) scope
							DoLog(LogLevel.Error, err, 'error');
						}
					}
				`;
				for (const [pname, pfunc] of Object.entries(FL.CodeProvides)) {
					wrapperCode = `var ${pname} = ${pfunc.toString()};\n` + wrapperCode;
				}
				return wrapperCode;
			}

			function bindProvides() {
				const BindProvides = {...FL.BindProvides};
				for (const [name, func] of Object.entries(BindProvides)) {
					BindProvides[name] = func.bind(objFunc);
				}
				return BindProvides;
			}
		}

		function require(id) {
			const objFunc = functions.find(objFunc => objFunc.id === id);
			objFunc.STOP && Err('Required objFunc\'s STOP sign shouldn\'t be true');
			return load(objFunc);
		}

		// Log to storage
		function systemLog(id, level, content, logger) {
			const timestamp = (new Date()).getTime();
			content = convert(content);

			const DebugStore = CONFIG.debug.find(d => d.timeOrigin === performance.timeOrigin);
			if (DebugStore) {
				DebugStore.console.push({id, level, content, logger, timestamp});
				DebugStore.console.length > 100 && DebugStore.console.splice(0, DebugStore.console.length - 100);
				DebugStore.spliced = true;
			}

			if (CONFIG.debug.length > 10) {
				CONFIG.debug.splice(0, CONFIG.debug.length - 10);
			}

			// convert content into storage-acceptable value
			function convert(content) {
				// Errors
				if (content instanceof Error) {
					const obj = {};
					copyProps(content, obj, ['name', 'message', 'stack']);
					return obj;
				}

				// Special values
				const specialVals = [null, undefined, NaN, Infinity];
				const specialNames = ['null', 'undefined', 'NaN', 'Infinity'];
				if (specialVals.includes(content)) {
					return specialNames[specialVals.indexOf(content)];
				}

				// Other
				return content;
			}
		}

		// Check and load all objFuncs that should be loaded
		function loadAll() {
			for (const objFunc of functions) {
				if (!objFunc.STOP) {
					// Execute objFunc.alwaysRun if exist.
					/* The name "alwaysRun" is given by AI. See these pics if u'r interested (Chinese conversation)
					https://p.sda1.dev/12/b991a6513bce3ae95180d6a5503f3694/截屏2023-07-26 下午5.16.53.jpg
					https://p.sda1.dev/12/cad9eaa7b265e21367a76c028fd6208c/截屏2023-07-26 下午5.17.08.jpg
					*/
					typeof objFunc.alwaysRun === 'function' && executeAs(objFunc.alwaysRun, objFunc);

					// Execute objFunc.func if checker passed
					check(objFunc) && load(objFunc);
				}
			}
		}

		function getUserStorageKey() {
			return getUserID() || 'Guest';
		}

		function getUserID() {
			const match = $URL.decode(document.cookie).match(/jieqiUserId=(\d+)/);
			const id = match && match[1] ? Math.floor(match[1]) : null;
			return isNaN(id) ? null : id;
		}

		function defineGetter(obj, prop, getter) {
			defineProperty(obj, prop, getter, v => true);
		}

		function reflectProperty(from, to, prop) {
			defineProperty(to, prop, () => from[prop], v => {from[prop] = v});
		}

		function defineProperty(obj, prop, getter, setter) {
			Object.defineProperty(obj, prop, {
				get: getter,
				set: setter,
				configurable: false,
				enumerable: true,
			});
		}

		function Messager() {
			const M = this;
			const listeners = Object.create(null);
			const history = {};

			M.recieveMessage = recieveMessage;
			M.postMessage = postMessage;

			function recieveMessage(name, func, poster_id=null, listener_id=null, read_history=false) {
				// Register listener
				const listener = {func, poster_id, listener_id};
				if (name in listeners) {
					listeners[name].push(listener);
				} else {
					listeners[name] = [listener];
				}

				// Read history messages
				if (read_history && history[name]) {
					const messages = history[name];
					for (const message of messages) {
						const correctPoster = !poster_id || message.poster_id === poster_id;
						const correctListener = !message.listener_id || message.listener_id === listener_id;
						correctPoster && correctListener && setTimeout(e => listener.func(message.data), 0);
					}
				}
			}

			function postMessage(name, data=null, poster_id=null, listener_id=null) {
				// Post to recievers
				if (name in listeners) {
					for (const listener of listeners[name]) {
						const correctPoster = !listener.poster_id || listener.poster_id === poster_id;
						const correctListener = !listener_id || listener.listener_id === listener_id;
						correctPoster && correctListener && listener.func(data);
					}
				}

				// Save in history messages
				!history[name] && (history[name] = []);
				history[name].push({name, data, poster_id, listener_id});
			}
		}
	}
})();