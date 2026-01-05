// ==UserScript==
// @name         BDWM bbs theme
// @namespace    https://github.com/SourceZh/BDWM-Theme-User-JS/
// @version      0.994
// @description  A simple script for BDWM bbs website theme.
// @author       DoubleZ
// @match        https://bbs.pku.edu.cn/*
// @match        https://www.bdwm.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24675/BDWM%20bbs%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/24675/BDWM%20bbs%20theme.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
	var src = [
		"/v2/uploads/logo_V0uDb1.gif", // 2024.06.07 纸飞机2
		"/v2/uploads/logo_ArQ00U.gif", // 2021.09.13 秋天来啦
		"/v2/uploads/logo_42sHEw.gif", // 2021.07.11 下大雨啦
		"/v2/uploads/logo_Mvcuun.gif", // 2021.07.06 来根雪糕
		"/v2/uploads/logo_scuIMw.gif", // 2021.06.18 格局打开
		"/v2/uploads/logo_JJTvix.gif", // 2021.05.31 ?位证
		"/v2/uploads/logo_9GSvWO.png", // 2021.04.01 北大有名
		"/v2/uploads/logo_fmJbmc.gif", // 2021.03.28 花开未名2
		"/v2/uploads/logo_OLpRft.gif", // 2021.03.24 花开未名
		"/v2/uploads/logo_5XlENc.gif", // 2021.01.06 期末满分
		"/v2/uploads/logo_P7HrOc.gif", // 2020.12.35 欢度双旦
		"/v2/uploads/logo_A7D5EW.jpg", // 2020.06.22 2020毕业快乐
		"/v2/uploads/logo_72M3dR.gif", // 2019.10.28 未名金秋
		"/v2/uploads/logo_kn3aSW.jpg", // 2019.04.11 看，星球！
		"/v2/uploads/logo_fkCvfO.gif", // 2019.01.19 跳动的音符
		"/v2/uploads/logo_HUiJYP.jpg", // 2018.11.18 糖葫芦
		"/v2/uploads/logo_gBi6FP.png", // 2018.09.17 开学快乐
		"/v2/uploads/logo_hZwsG2.jpg", // 2018.08.09 肥宅快乐月
		"/v2/uploads/logo_aY3JVL.jpg", // 2018.07.24 大雨，北京
		"/v2/uploads/logo_wS9hvo.gif", // 2018.06.16 世界杯开始啦~
		"/v2/uploads/logo_owYLKl.gif", // 2018.05.18 纸飞机
		"/v2/uploads/logo_4DQBX1.jpg", // 2018.05.06 给校长打Call
		"/v2/uploads/logo_IavQoq.gif", // 2018.04.16 so many 120    
		"/v2/uploads/logo_MnOp9H.gif", // 2018.04.14 120 moving
		"/v2/uploads/logo_Im39T5.jpg", // 2018.04.13 120
		"/v2/uploads/logo_bQwHl7.gif", // 2018.02.15 新年到，红包到    
		"/v2/uploads/logo_3ZQ38P.gif", // 2018.02.12 新风车，新气象    
		"/v2/uploads/logo_EqMF83.gif", // 2018.01.25 发糖
		"/v2/uploads/logo_Y82E2w.gif", // 2018.01.10 未名湖是个海洋，我们都在里面摸鱼
		"/v2/uploads/logo_nlCZ2u.gif", // 2018.01.08 期末满分，不存在的1
		"/v2/uploads/logo_Je8Upq.gif", // 2018.01.08 期末满分，不存在的2
		"/v2/uploads/logo_61Fg2G.gif", // 2017.12.26 元旦到，灯笼照
		"/v2/uploads/logo_PHPMZD.gif", // 2017.12.23 禁忌的圣诞帽
		"/v2/uploads/logo_OaWGYT.gif", // 2017.12.08 大雪将至
		"/v2/uploads/logo_owAUjB.gif", // 2017.12.02 又到了白色相簿的季节
		"/v2/uploads/logo_FLCYzX.gif", // 2017.11.11 光棍节你好光棍节再见
		"/v2/uploads/logo_ze9hjJ.png", // 2017.10.30 万圣节女巫
		"/v2/uploads/logo_jlem83.gif", // 2017.10.27 翻滚吧，月饼君
		"/v2/uploads/logo_pII925.gif", // 2017.09.29 欢度国庆&中秋
		"/v2/uploads/logo_A61R4E.gif", // 2017.08.15 懒惰的鸡腿
		"/v2/uploads/logo_TOIvA1.gif", // 2017.05.05 融化的冰淇淋
		"/v2/uploads/logo_OK8m2o.gif", // 2017.02.12 15的月亮16圆
		"/v2/uploads/logo_s9yX2c.gif", // 2017.01.20 鞭炮声里迎新年
		"/v2/uploads/logo_89AF6t.gif", // 2016.12.31 2017新年快乐
		"/v2/uploads/logo_Tn8pTJ.gif", // 2016.11.20 打嗝的雪人
		"/v2/uploads/logo_qmOATc.gif", // 2016.11.09 拒绝狗粮，从我做起
		"/v2/uploads/logo_tgfeWm.gif", // 摇晃的狐狸
		"/v2/uploads/logo_qFiW2O.gif", // 摇摆吧，月饼君
		"/v2/images/home/logo-rio2016.gif", // 为中国代表团加油
		"/v2/uploads/logo_qGZe5Y.png", // 欢迎新同学
		"/v2/uploads/logo_zrw8cY.gif"  // 祖国生快(67)
	];
	var num = Math.floor(Math.random() * src.length);
	$("#logo a img").attr("src", src[num]);
})();
