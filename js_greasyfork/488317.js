// ==UserScript==
// @name         强化1lou搜索
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  强化搜索界面，显示资源类型，强化标签名称
// @author       Kaze
// @match        https://www.1lou.me/search-*.htm
// @icon         https://www.1lou.me/upload/avatar/000/20918.png
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488317/%E5%BC%BA%E5%8C%961lou%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488317/%E5%BC%BA%E5%8C%961lou%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const cateListStr = `[{"tagTapName":"电影时间：","id":"425","name":"2024"},{"tagTapName":"电影时间：","id":"1","name":"2023"},{"tagTapName":"电影时间：","id":"5","name":"2022"},{"tagTapName":"电影时间：","id":"6","name":"2021"},{"tagTapName":"电影时间：","id":"7","name":"2020"},{"tagTapName":"电影时间：","id":"8","name":"2019"},{"tagTapName":"电影时间：","id":"9","name":"2018"},{"tagTapName":"电影时间：","id":"10","name":"2017"},{"tagTapName":"电影时间：","id":"11","name":"2016"},{"tagTapName":"电影时间：","id":"12","name":"2015"},{"tagTapName":"电影时间：","id":"13","name":"2014"},{"tagTapName":"电影时间：","id":"14","name":"2013"},{"tagTapName":"电影时间：","id":"15","name":"2012"},{"tagTapName":"电影时间：","id":"16","name":"2011"},{"tagTapName":"电影时间：","id":"17","name":"2010"},{"tagTapName":"电影时间：","id":"18","name":"2009"},{"tagTapName":"电影时间：","id":"19","name":"2008"},{"tagTapName":"电影时间：","id":"20","name":"2007"},{"tagTapName":"电影时间：","id":"21","name":"2006"},{"tagTapName":"电影时间：","id":"22","name":"2005"},{"tagTapName":"电影时间：","id":"23","name":"更早"},{"tagTapName":"电影时间：","id":"24","name":"系列"},{"tagTapName":"电影地区：","id":"2","name":"大陆"},{"tagTapName":"电影地区：","id":"26","name":"香港"},{"tagTapName":"电影地区：","id":"27","name":"台湾"},{"tagTapName":"电影地区：","id":"28","name":"日本"},{"tagTapName":"电影地区：","id":"29","name":"韩国"},{"tagTapName":"电影地区：","id":"30","name":"美国"},{"tagTapName":"电影地区：","id":"31","name":"欧美"},{"tagTapName":"电影地区：","id":"32","name":"泰国"},{"tagTapName":"电影地区：","id":"33","name":"越南"},{"tagTapName":"电影地区：","id":"34","name":"新加坡"},{"tagTapName":"电影地区：","id":"35","name":"马来西亚"},{"tagTapName":"电影地区：","id":"36","name":"印度"},{"tagTapName":"电影地区：","id":"37","name":"德国"},{"tagTapName":"电影地区：","id":"38","name":"英国"},{"tagTapName":"电影地区：","id":"39","name":"法国"},{"tagTapName":"电影地区：","id":"40","name":"丹麦"},{"tagTapName":"电影地区：","id":"41","name":"瑞典"},{"tagTapName":"电影地区：","id":"42","name":"巴西"},{"tagTapName":"电影地区：","id":"43","name":"加拿大"},{"tagTapName":"电影地区：","id":"44","name":"俄罗斯"},{"tagTapName":"电影地区：","id":"45","name":"意大利"},{"tagTapName":"电影地区：","id":"46","name":"比利时"},{"tagTapName":"电影地区：","id":"47","name":"爱尔兰"},{"tagTapName":"电影地区：","id":"48","name":"西班牙"},{"tagTapName":"电影地区：","id":"49","name":"墨西哥"},{"tagTapName":"电影地区：","id":"50","name":"澳大利亚"},{"tagTapName":"电影地区：","id":"51","name":"荷兰"},{"tagTapName":"电影地区：","id":"52","name":"多国"},{"tagTapName":"电影地区：","id":"701","name":"亚太"},{"tagTapName":"电影地区：","id":"53","name":"其它"},{"tagTapName":"电影类型：","id":"3","name":"动作"},{"tagTapName":"电影类型：","id":"55","name":"喜剧"},{"tagTapName":"电影类型：","id":"56","name":"爱情"},{"tagTapName":"电影类型：","id":"57","name":"恐怖"},{"tagTapName":"电影类型：","id":"58","name":"科幻"},{"tagTapName":"电影类型：","id":"59","name":"剧情"},{"tagTapName":"电影类型：","id":"60","name":"惊悚"},{"tagTapName":"电影类型：","id":"61","name":"奇幻"},{"tagTapName":"电影类型：","id":"62","name":"悬疑"},{"tagTapName":"电影类型：","id":"63","name":"犯罪"},{"tagTapName":"电影类型：","id":"64","name":"战争"},{"tagTapName":"电影类型：","id":"65","name":"历史"},{"tagTapName":"电影类型：","id":"66","name":"灾难"},{"tagTapName":"电影类型：","id":"67","name":"动画"},{"tagTapName":"电影类型：","id":"68","name":"纪录"},{"tagTapName":"电影类型：","id":"69","name":"短片"},{"tagTapName":"电影类型：","id":"70","name":"冒险"},{"tagTapName":"电影类型：","id":"71","name":"儿童"},{"tagTapName":"电影类型：","id":"72","name":"歌舞"},{"tagTapName":"电影类型：","id":"73","name":"丧尸"},{"tagTapName":"电影类型：","id":"74","name":"传记"},{"tagTapName":"电影类型：","id":"75","name":"西部"},{"tagTapName":"电影类型：","id":"76","name":"古装"},{"tagTapName":"电影类型：","id":"77","name":"武侠"},{"tagTapName":"电影类型：","id":"78","name":"家庭"},{"tagTapName":"电影类型：","id":"79","name":"校园"},{"tagTapName":"电影类型：","id":"80","name":"文艺"},{"tagTapName":"电影类型：","id":"81","name":"运动"},{"tagTapName":"电影类型：","id":"82","name":"青春"},{"tagTapName":"电影类型：","id":"83","name":"励志"},{"tagTapName":"电影类型：","id":"84","name":"人性"},{"tagTapName":"电影类型：","id":"85","name":"美食"},{"tagTapName":"电影类型：","id":"86","name":"女性"},{"tagTapName":"电影类型：","id":"87","name":"治愈"},{"tagTapName":"电影类型：","id":"88","name":"同性"},{"tagTapName":"电影类型：","id":"89","name":"合集"},{"tagTapName":"电影类型：","id":"90","name":"其它"},{"tagTapName":"电影类型：","id":"91","name":"整合"},{"tagTapName":"电影类型：","id":"92","name":"系列"},{"tagTapName":"电影类型：","id":"424","name":"yusuble"},{"tagTapName":"水印说明：","id":"4","name":"有水印"},{"tagTapName":"水印说明：","id":"94","name":"有广告"},{"tagTapName":"水印说明：","id":"95","name":"纯净版"},{"tagTapName":"上映时间：","id":"426","name":"2024"},{"tagTapName":"上映时间：","id":"96","name":"2023"},{"tagTapName":"上映时间：","id":"100","name":"2022"},{"tagTapName":"上映时间：","id":"101","name":"2021"},{"tagTapName":"上映时间：","id":"102","name":"2020"},{"tagTapName":"上映时间：","id":"103","name":"2019"},{"tagTapName":"上映时间：","id":"104","name":"2018"},{"tagTapName":"上映时间：","id":"105","name":"2017"},{"tagTapName":"上映时间：","id":"106","name":"2016"},{"tagTapName":"上映时间：","id":"107","name":"2015"},{"tagTapName":"上映时间：","id":"108","name":"2014"},{"tagTapName":"上映时间：","id":"109","name":"2013"},{"tagTapName":"上映时间：","id":"110","name":"2012"},{"tagTapName":"上映时间：","id":"111","name":"2011"},{"tagTapName":"上映时间：","id":"112","name":"2010"},{"tagTapName":"上映时间：","id":"113","name":"2009"},{"tagTapName":"上映时间：","id":"114","name":"2008"},{"tagTapName":"上映时间：","id":"115","name":"2007"},{"tagTapName":"上映时间：","id":"116","name":"2006"},{"tagTapName":"上映时间：","id":"118","name":"更 早"},{"tagTapName":"上映时间：","id":"119","name":"合 集"},{"tagTapName":"电视地区：","id":"97","name":"大陆"},{"tagTapName":"电视地区：","id":"129","name":"香港"},{"tagTapName":"电视地区：","id":"130","name":"台湾"},{"tagTapName":"电视地区：","id":"131","name":"韩国"},{"tagTapName":"电视地区：","id":"132","name":"日本"},{"tagTapName":"电视地区：","id":"133","name":"泰国"},{"tagTapName":"电视地区：","id":"134","name":"越南"},{"tagTapName":"电视地区：","id":"135","name":"新加坡"},{"tagTapName":"电视地区：","id":"136","name":"马来西亚"},{"tagTapName":"电视地区：","id":"137","name":"印度"},{"tagTapName":"电视地区：","id":"138","name":"美国"},{"tagTapName":"电视地区：","id":"139","name":"英国"},{"tagTapName":"电视地区：","id":"140","name":"法国"},{"tagTapName":"电视地区：","id":"141","name":"德国"},{"tagTapName":"电视地区：","id":"142","name":"丹麦"},{"tagTapName":"电视地区：","id":"143","name":"瑞典"},{"tagTapName":"电视地区：","id":"144","name":"巴西"},{"tagTapName":"电视地区：","id":"145","name":"比利时"},{"tagTapName":"电视地区：","id":"146","name":"爱尔兰"},{"tagTapName":"电视地区：","id":"147","name":"意大利"},{"tagTapName":"电视地区：","id":"148","name":"西班牙"},{"tagTapName":"电视地区：","id":"149","name":"加拿大"},{"tagTapName":"电视地区：","id":"150","name":"俄罗斯"},{"tagTapName":"电视地区：","id":"151","name":"墨西哥"},{"tagTapName":"电视地区：","id":"152","name":"澳大利亚"},{"tagTapName":"电视地区：","id":"153","name":"荷兰"},{"tagTapName":"电视地区：","id":"154","name":"多国"},{"tagTapName":"电视地区：","id":"702","name":"欧美"},{"tagTapName":"电视地区：","id":"155","name":"其它"},{"tagTapName":"电视地区：","id":"703","name":"亚太"},{"tagTapName":"影片类型：","id":"98","name":"剧情"},{"tagTapName":"影片类型：","id":"156","name":"喜剧"},{"tagTapName":"影片类型：","id":"157","name":"爱情"},{"tagTapName":"影片类型：","id":"158","name":"动作"},{"tagTapName":"影片类型：","id":"159","name":"奇幻"},{"tagTapName":"影片类型：","id":"160","name":"军旅"},{"tagTapName":"影片类型：","id":"161","name":"战争"},{"tagTapName":"影片类型：","id":"162","name":"武侠"},{"tagTapName":"影片类型：","id":"163","name":"悬疑"},{"tagTapName":"影片类型：","id":"164","name":"偶像"},{"tagTapName":"影片类型：","id":"165","name":"都市"},{"tagTapName":"影片类型：","id":"166","name":"历史"},{"tagTapName":"影片类型：","id":"167","name":"古装"},{"tagTapName":"影片类型：","id":"168","name":"科幻"},{"tagTapName":"影片类型：","id":"169","name":"情感"},{"tagTapName":"影片类型：","id":"170","name":"家庭"},{"tagTapName":"影片类型：","id":"171","name":"谍战"},{"tagTapName":"影片类型：","id":"172","name":"刑侦"},{"tagTapName":"影片类型：","id":"173","name":"惊悚"},{"tagTapName":"影片类型：","id":"174","name":"犯罪"},{"tagTapName":"影片类型：","id":"175","name":"恐怖"},{"tagTapName":"影片类型：","id":"176","name":"时装"},{"tagTapName":"影片类型：","id":"177","name":"真人"},{"tagTapName":"影片类型：","id":"178","name":"医务"},{"tagTapName":"影片类型：","id":"179","name":"歌舞"},{"tagTapName":"影片类型：","id":"180","name":"动画"},{"tagTapName":"影片类型：","id":"181","name":"纪录"},{"tagTapName":"影片类型：","id":"182","name":"经典"},{"tagTapName":"影片类型：","id":"183","name":"其它"},{"tagTapName":"更新状态：","id":"99","name":"追更"},{"tagTapName":"更新状态：","id":"185","name":"连载"},{"tagTapName":"更新状态：","id":"186","name":"全集"},{"tagTapName":"更新状态：","id":"187","name":"打包"},{"tagTapName":"更新状态：","id":"188","name":"单集"},{"tagTapName":"更新状态：","id":"189","name":"合集"},{"tagTapName":"更新状态：","id":"190","name":"断载"},{"tagTapName":"电影年份：","id":"427","name":"2024"},{"tagTapName":"电影年份：","id":"382","name":"2023"},{"tagTapName":"电影年份：","id":"383","name":"2022"},{"tagTapName":"电影年份：","id":"384","name":"2021"},{"tagTapName":"电影年份：","id":"385","name":"2020"},{"tagTapName":"电影年份：","id":"386","name":"2019"},{"tagTapName":"电影年份：","id":"387","name":"2018"},{"tagTapName":"电影年份：","id":"388","name":"2017"},{"tagTapName":"电影年份：","id":"389","name":"2016"},{"tagTapName":"电影年份：","id":"390","name":"2015"},{"tagTapName":"电影年份：","id":"391","name":"2014"},{"tagTapName":"电影年份：","id":"392","name":"2013"},{"tagTapName":"电影年份：","id":"393","name":"2012"},{"tagTapName":"电影年份：","id":"394","name":"2011"},{"tagTapName":"电影年份：","id":"395","name":"2010"},{"tagTapName":"电影年份：","id":"396","name":"2009"},{"tagTapName":"电影年份：","id":"397","name":"2008"},{"tagTapName":"电影年份：","id":"398","name":"2007"},{"tagTapName":"电影年份：","id":"399","name":"2006"},{"tagTapName":"电影年份：","id":"400","name":"更 早"},{"tagTapName":"电影年份：","id":"401","name":"合 集"},{"tagTapName":"电影地区：","id":"192","name":"大陆"},{"tagTapName":"电影地区：","id":"215","name":"香港"},{"tagTapName":"电影地区：","id":"216","name":"台湾"},{"tagTapName":"电影地区：","id":"217","name":"日本"},{"tagTapName":"电影地区：","id":"218","name":"韩国"},{"tagTapName":"电影地区：","id":"219","name":"泰国"},{"tagTapName":"电影地区：","id":"220","name":"越南"},{"tagTapName":"电影地区：","id":"221","name":"新加坡"},{"tagTapName":"电影地区：","id":"222","name":"马来西亚"},{"tagTapName":"电影地区：","id":"223","name":"印度"},{"tagTapName":"电影地区：","id":"224","name":"欧美"},{"tagTapName":"电影地区：","id":"225","name":"美国"},{"tagTapName":"电影地区：","id":"226","name":"英国"},{"tagTapName":"电影地区：","id":"227","name":"法国"},{"tagTapName":"电影地区：","id":"228","name":"德国"},{"tagTapName":"电影地区：","id":"229","name":"丹麦"},{"tagTapName":"电影地区：","id":"230","name":"瑞典"},{"tagTapName":"电影地区：","id":"231","name":"巴西"},{"tagTapName":"电影地区：","id":"232","name":"意大利"},{"tagTapName":"电影地区：","id":"233","name":"比利时"},{"tagTapName":"电影地区：","id":"234","name":"爱尔兰"},{"tagTapName":"电影地区：","id":"235","name":"西班牙"},{"tagTapName":"电影地区：","id":"236","name":"俄罗斯"},{"tagTapName":"电影地区：","id":"237","name":"墨西哥"},{"tagTapName":"电影地区：","id":"803","name":"加拿大"},{"tagTapName":"电影地区：","id":"238","name":"澳大利亚"},{"tagTapName":"电影地区：","id":"239","name":"荷兰"},{"tagTapName":"电影地区：","id":"699","name":"欧美"},{"tagTapName":"电影地区：","id":"240","name":"多国"},{"tagTapName":"电影地区：","id":"241","name":"其它"},{"tagTapName":"电影地区：","id":"704","name":"亚太"},{"tagTapName":"电影类型：","id":"193","name":"剧情"},{"tagTapName":"电影类型：","id":"242","name":"动作"},{"tagTapName":"电影类型：","id":"243","name":"爱情"},{"tagTapName":"电影类型：","id":"244","name":"恐怖"},{"tagTapName":"电影类型：","id":"245","name":"科幻"},{"tagTapName":"电影类型：","id":"246","name":"喜剧"},{"tagTapName":"电影类型：","id":"247","name":"惊悚"},{"tagTapName":"电影类型：","id":"248","name":"奇幻"},{"tagTapName":"电影类型：","id":"249","name":"悬疑"},{"tagTapName":"电影类型：","id":"250","name":"犯罪"},{"tagTapName":"电影类型：","id":"251","name":"战争"},{"tagTapName":"电影类型：","id":"252","name":"历史"},{"tagTapName":"电影类型：","id":"253","name":"灾难"},{"tagTapName":"电影类型：","id":"254","name":"动画"},{"tagTapName":"电影类型：","id":"255","name":"纪录"},{"tagTapName":"电影类型：","id":"256","name":"短片"},{"tagTapName":"电影类型：","id":"257","name":"儿童"},{"tagTapName":"电影类型：","id":"258","name":"歌舞"},{"tagTapName":"电影类型：","id":"259","name":"丧尸"},{"tagTapName":"电影类型：","id":"260","name":"传记"},{"tagTapName":"电影类型：","id":"261","name":"西部"},{"tagTapName":"电影类型：","id":"262","name":"古装"},{"tagTapName":"电影类型：","id":"263","name":"武侠"},{"tagTapName":"电影类型：","id":"264","name":"家庭"},{"tagTapName":"电影类型：","id":"265","name":"校园"},{"tagTapName":"电影类型：","id":"266","name":"文艺"},{"tagTapName":"电影类型：","id":"267","name":"运动"},{"tagTapName":"电影类型：","id":"268","name":"青春"},{"tagTapName":"电影类型：","id":"269","name":"励志"},{"tagTapName":"电影类型：","id":"270","name":"人性"},{"tagTapName":"电影类型：","id":"271","name":"美食"},{"tagTapName":"电影类型：","id":"272","name":"女性"},{"tagTapName":"电影类型：","id":"273","name":"治愈"},{"tagTapName":"电影类型：","id":"274","name":"同性"},{"tagTapName":"电影类型：","id":"275","name":"短片"},{"tagTapName":"电影类型：","id":"276","name":"合集"},{"tagTapName":"电影类型：","id":"277","name":"系列"},{"tagTapName":"电影类型：","id":"278","name":"其它"},{"tagTapName":"电影格式：","id":"194","name":"HDTV/HDrip"},{"tagTapName":"电影格式：","id":"280","name":"WEB-720P"},{"tagTapName":"电影格式：","id":"281","name":"WEB-1080P"},{"tagTapName":"电影格式：","id":"282","name":"WEB-4K"},{"tagTapName":"电影格式：","id":"283","name":"BDRRip-720P"},{"tagTapName":"电影格式：","id":"284","name":"BD-720P"},{"tagTapName":"电影格式：","id":"285","name":"BD-1080P"},{"tagTapName":"电影格式：","id":"286","name":"BD-4K"},{"tagTapName":"电影格式：","id":"287","name":"BD-Remux"},{"tagTapName":"电影格式：","id":"288","name":"BD-原盘"},{"tagTapName":"电影格式：","id":"289","name":"4K-Remux"},{"tagTapName":"电影格式：","id":"290","name":"4K-原盘"},{"tagTapName":"电影格式：","id":"291","name":"BD-3D"},{"tagTapName":"电影格式：","id":"292","name":"3D-原盘"},{"tagTapName":"电影格式：","id":"293","name":"其 它"},{"tagTapName":"剧集年份：","id":"428","name":"2024"},{"tagTapName":"剧集年份：","id":"294","name":"2023"},{"tagTapName":"剧集年份：","id":"298","name":"2022"},{"tagTapName":"剧集年份：","id":"299","name":"2021"},{"tagTapName":"剧集年份：","id":"300","name":"2020"},{"tagTapName":"剧集年份：","id":"301","name":"2019"},{"tagTapName":"剧集年份：","id":"302","name":"2018"},{"tagTapName":"剧集年份：","id":"303","name":"2017"},{"tagTapName":"剧集年份：","id":"304","name":"2016"},{"tagTapName":"剧集年份：","id":"305","name":"2015"},{"tagTapName":"剧集年份：","id":"306","name":"2014"},{"tagTapName":"剧集年份：","id":"307","name":"2013"},{"tagTapName":"剧集年份：","id":"308","name":"2012"},{"tagTapName":"剧集年份：","id":"309","name":"2011"},{"tagTapName":"剧集年份：","id":"310","name":"2010"},{"tagTapName":"剧集年份：","id":"311","name":"2009"},{"tagTapName":"剧集年份：","id":"312","name":"2008"},{"tagTapName":"剧集年份：","id":"313","name":"2007"},{"tagTapName":"剧集年份：","id":"314","name":"2006"},{"tagTapName":"剧集年份：","id":"315","name":"更早"},{"tagTapName":"剧集地区：","id":"295","name":"美国"},{"tagTapName":"剧集地区：","id":"318","name":"大陆"},{"tagTapName":"剧集地区：","id":"319","name":"香港"},{"tagTapName":"剧集地区：","id":"320","name":"台湾"},{"tagTapName":"剧集地区：","id":"321","name":"澳门"},{"tagTapName":"剧集地区：","id":"322","name":"日本"},{"tagTapName":"剧集地区：","id":"323","name":"韩国"},{"tagTapName":"剧集地区：","id":"324","name":"法国"},{"tagTapName":"剧集地区：","id":"325","name":"英国"},{"tagTapName":"剧集地区：","id":"326","name":"意大利"},{"tagTapName":"剧集地区：","id":"327","name":"西班牙"},{"tagTapName":"剧集地区：","id":"328","name":"德国"},{"tagTapName":"剧集地区：","id":"329","name":"泰国"},{"tagTapName":"剧集地区：","id":"700","name":"欧美"},{"tagTapName":"剧集地区：","id":"330","name":"其它"},{"tagTapName":"剧集地区：","id":"705","name":"亚太"},{"tagTapName":"剧集类型：","id":"296","name":"剧情"},{"tagTapName":"剧集类型：","id":"339","name":"儿童"},{"tagTapName":"剧集类型：","id":"340","name":"喜剧"},{"tagTapName":"剧集类型：","id":"341","name":"传记"},{"tagTapName":"剧集类型：","id":"342","name":"动作"},{"tagTapName":"剧集类型：","id":"343","name":"历史"},{"tagTapName":"剧集类型：","id":"344","name":"爱情"},{"tagTapName":"剧集类型：","id":"345","name":"战争"},{"tagTapName":"剧集类型：","id":"346","name":"科幻"},{"tagTapName":"剧集类型：","id":"347","name":"犯罪"},{"tagTapName":"剧集类型：","id":"348","name":"动画"},{"tagTapName":"剧集类型：","id":"349","name":"西部"},{"tagTapName":"剧集类型：","id":"350","name":"悬疑"},{"tagTapName":"剧集类型：","id":"351","name":"奇幻"},{"tagTapName":"剧集类型：","id":"352","name":"惊悚"},{"tagTapName":"剧集类型：","id":"353","name":"冒险"},{"tagTapName":"剧集类型：","id":"354","name":"恐怖"},{"tagTapName":"剧集类型：","id":"355","name":"灾难"},{"tagTapName":"剧集类型：","id":"356","name":"纪录"},{"tagTapName":"剧集类型：","id":"357","name":"短片"},{"tagTapName":"剧集类型：","id":"358","name":"古装"},{"tagTapName":"剧集类型：","id":"359","name":"情色"},{"tagTapName":"剧集类型：","id":"360","name":"运动"},{"tagTapName":"剧集类型：","id":"361","name":"同性"},{"tagTapName":"剧集类型：","id":"362","name":"戏曲"},{"tagTapName":"剧集类型：","id":"363","name":"音乐"},{"tagTapName":"剧集类型：","id":"364","name":"黑色电影"},{"tagTapName":"剧集类型：","id":"365","name":"歌舞"},{"tagTapName":"剧集类型：","id":"366","name":"真人秀"},{"tagTapName":"剧集类型：","id":"367","name":"家庭"},{"tagTapName":"剧集类型：","id":"368","name":"脱口秀"},{"tagTapName":"剧集类型：","id":"369","name":"其它"},{"tagTapName":"剧集格式：","id":"297","name":"HDTV/HDrip"},{"tagTapName":"剧集格式：","id":"370","name":"WEB-720P"},{"tagTapName":"剧集格式：","id":"371","name":"WEB-1080P"},{"tagTapName":"剧集格式：","id":"372","name":"WEB-4K"},{"tagTapName":"剧集格式：","id":"373","name":"BDRip-720P"},{"tagTapName":"剧集格式：","id":"374","name":"BD-720P"},{"tagTapName":"剧集格式：","id":"375","name":"BD-1080P"},{"tagTapName":"剧集格式：","id":"376","name":"BD-4K"},{"tagTapName":"剧集格式：","id":"377","name":"Remux"},{"tagTapName":"剧集格式：","id":"378","name":"蓝光原盘"},{"tagTapName":"剧集格式：","id":"379","name":"DIY蓝光原盘"},{"tagTapName":"剧集格式：","id":"380","name":"BD-3D"},{"tagTapName":"剧集格式：","id":"381","name":"其它"},{"tagTapName":"发布年份：","id":"431","name":"2024"},{"tagTapName":"发布年份：","id":"433","name":"2023"},{"tagTapName":"发布年份：","id":"434","name":"2022"},{"tagTapName":"发布年份：","id":"435","name":"2021"},{"tagTapName":"发布年份：","id":"436","name":"2020"},{"tagTapName":"发布年份：","id":"437","name":"2019"},{"tagTapName":"发布年份：","id":"438","name":"2018"},{"tagTapName":"发布年份：","id":"439","name":"2017"},{"tagTapName":"发布年份：","id":"698","name":"2016"},{"tagTapName":"发布年份：","id":"440","name":"2015"},{"tagTapName":"发布年份：","id":"441","name":"2014"},{"tagTapName":"发布年份：","id":"442","name":"2013"},{"tagTapName":"发布年份：","id":"443","name":"2012"},{"tagTapName":"发布年份：","id":"444","name":"2011"},{"tagTapName":"发布年份：","id":"445","name":"2010"},{"tagTapName":"发布年份：","id":"546","name":"2009"},{"tagTapName":"发布年份：","id":"547","name":"2008"},{"tagTapName":"发布年份：","id":"548","name":"2007"},{"tagTapName":"发布年份：","id":"549","name":"2006"},{"tagTapName":"发布年份：","id":"446","name":"更早"},{"tagTapName":"发布年份：","id":"447","name":"其它"},{"tagTapName":"发布年份：","id":"448","name":"合集"},{"tagTapName":"音乐地区：","id":"432","name":"内地"},{"tagTapName":"音乐地区：","id":"451","name":"港台"},{"tagTapName":"音乐地区：","id":"452","name":"欧美"},{"tagTapName":"音乐地区：","id":"453","name":"日韩"},{"tagTapName":"音乐地区：","id":"454","name":"多国"},{"tagTapName":"音乐地区：","id":"455","name":"台湾"},{"tagTapName":"音乐地区：","id":"456","name":"其它"},{"tagTapName":"音乐地区：","id":"457","name":"告示"},{"tagTapName":"音乐类型：","id":"449","name":"流行"},{"tagTapName":"音乐类型：","id":"458","name":"摇滚"},{"tagTapName":"音乐类型：","id":"459","name":"说唱"},{"tagTapName":"音乐类型：","id":"461","name":"电子"},{"tagTapName":"音乐类型：","id":"462","name":"乡村"},{"tagTapName":"音乐类型：","id":"463","name":"爵士"},{"tagTapName":"音乐类型：","id":"464","name":"民谣"},{"tagTapName":"音乐类型：","id":"465","name":"古典"},{"tagTapName":"音乐类型：","id":"466","name":"纯音"},{"tagTapName":"音乐类型：","id":"467","name":"经典"},{"tagTapName":"音乐类型：","id":"468","name":"原声"},{"tagTapName":"音乐类型：","id":"707","name":"测试"},{"tagTapName":"音乐类型：","id":"469","name":"新世纪"},{"tagTapName":"音乐类型：","id":"470","name":"DJ"},{"tagTapName":"音乐类型：","id":"471","name":"动漫"},{"tagTapName":"音乐类型：","id":"472","name":"其它"},{"tagTapName":"音乐类型：","id":"473","name":"合集"},{"tagTapName":"音乐分类：","id":"450","name":"音乐单曲"},{"tagTapName":"音乐分类：","id":"476","name":"MP3音乐"},{"tagTapName":"音乐分类：","id":"477","name":"无损音乐"},{"tagTapName":"音乐分类：","id":"478","name":"AAC音乐"},{"tagTapName":"音乐分类：","id":"479","name":"MV/LIVE"},{"tagTapName":"音乐分类：","id":"480","name":"演 唱 会"},{"tagTapName":"音乐分类：","id":"481","name":"高格音乐"},{"tagTapName":"音乐分类：","id":"482","name":"颁奖典礼"},{"tagTapName":"音乐分类：","id":"483","name":"音乐综艺"},{"tagTapName":"游戏分类：","id":"488","name":"个人原创"},{"tagTapName":"游戏分类：","id":"489","name":"转载游戏"},{"tagTapName":"下载方式：","id":"486","name":"BT下载"},{"tagTapName":"下载方式：","id":"493","name":"网盘下载"},{"tagTapName":"下载方式：","id":"494","name":"BT/网盘"},{"tagTapName":"版主专用：","id":"804","name":"BT之家1LOU站"},{"tagTapName":"版主专用：","id":"487","name":"版规"},{"tagTapName":"版主专用：","id":"495","name":"公告"},{"tagTapName":"版主专用：","id":"496","name":"活动"},{"tagTapName":"发布年份：","id":"497","name":"2024"},{"tagTapName":"发布年份：","id":"501","name":"2023"},{"tagTapName":"发布年份：","id":"502","name":"2022"},{"tagTapName":"发布年份：","id":"503","name":"2021"},{"tagTapName":"发布年份：","id":"504","name":"2020"},{"tagTapName":"发布年份：","id":"505","name":"2019"},{"tagTapName":"发布年份：","id":"506","name":"2018"},{"tagTapName":"发布年份：","id":"507","name":"2017"},{"tagTapName":"发布年份：","id":"508","name":"2016"},{"tagTapName":"发布年份：","id":"509","name":"2015"},{"tagTapName":"发布年份：","id":"510","name":"2014"},{"tagTapName":"发布年份：","id":"511","name":"2013"},{"tagTapName":"发布年份：","id":"512","name":"2012"},{"tagTapName":"发布年份：","id":"513","name":"2011"},{"tagTapName":"发布年份：","id":"514","name":"2010"},{"tagTapName":"发布年份：","id":"515","name":"2009"},{"tagTapName":"发布年份：","id":"516","name":"2008"},{"tagTapName":"发布年份：","id":"517","name":"2007"},{"tagTapName":"发布年份：","id":"518","name":"2006"},{"tagTapName":"发布年份：","id":"519","name":"跨年"},{"tagTapName":"发布年份：","id":"520","name":"更早"},{"tagTapName":"发布地区：","id":"498","name":"内地"},{"tagTapName":"发布地区：","id":"521","name":"港台"},{"tagTapName":"发布地区：","id":"522","name":"日韩"},{"tagTapName":"发布地区：","id":"523","name":"欧美"},{"tagTapName":"发布地区：","id":"524","name":"其它"},{"tagTapName":"综艺类型：","id":"499","name":"音乐"},{"tagTapName":"综艺类型：","id":"525","name":"晚会"},{"tagTapName":"综艺类型：","id":"526","name":"生活"},{"tagTapName":"综艺类型：","id":"527","name":"访谈"},{"tagTapName":"综艺类型：","id":"528","name":"游戏"},{"tagTapName":"综艺类型：","id":"529","name":"体育"},{"tagTapName":"综艺类型：","id":"530","name":"旅游"},{"tagTapName":"综艺类型：","id":"531","name":"时尚"},{"tagTapName":"综艺类型：","id":"532","name":"真人"},{"tagTapName":"综艺类型：","id":"533","name":"美食"},{"tagTapName":"综艺类型：","id":"534","name":"选秀"},{"tagTapName":"综艺类型：","id":"535","name":"搞笑"},{"tagTapName":"综艺类型：","id":"536","name":"纪实"},{"tagTapName":"综艺类型：","id":"537","name":"曲艺"},{"tagTapName":"综艺类型：","id":"538","name":"脱口秀"},{"tagTapName":"综艺类型：","id":"539","name":"其它"},{"tagTapName":"更新方式：","id":"500","name":"连载"},{"tagTapName":"更新方式：","id":"541","name":"全集"},{"tagTapName":"更新方式：","id":"542","name":"打包"},{"tagTapName":"更新方式：","id":"543","name":"单集"},{"tagTapName":"更新方式：","id":"544","name":"合集"},{"tagTapName":"更新方式：","id":"545","name":"断载"},{"tagTapName":"书集分类：","id":"550","name":"有声类"},{"tagTapName":"书集分类：","id":"554","name":"小说类"},{"tagTapName":"书集分类：","id":"555","name":"学习类"},{"tagTapName":"书集分类：","id":"556","name":"图书类"},{"tagTapName":"书集分类：","id":"557","name":"连环画"},{"tagTapName":"图书类型：","id":"551","name":"武侠玄幻"},{"tagTapName":"图书类型：","id":"559","name":"科幻恐怖"},{"tagTapName":"图书类型：","id":"560","name":"穿越架空"},{"tagTapName":"图书类型：","id":"561","name":"军事历史"},{"tagTapName":"图书类型：","id":"562","name":"推理探索"},{"tagTapName":"图书类型：","id":"563","name":"都市言情"},{"tagTapName":"图书类型：","id":"564","name":"官场职场"},{"tagTapName":"图书类型：","id":"565","name":"耽美同人"},{"tagTapName":"图书类型：","id":"566","name":"宗教哲学"},{"tagTapName":"图书类型：","id":"567","name":"教育科普"},{"tagTapName":"图书类型：","id":"568","name":"动漫漫画"},{"tagTapName":"图书类型：","id":"569","name":"生活文学"},{"tagTapName":"图书类型：","id":"570","name":"科技人文"},{"tagTapName":"图书类型：","id":"571","name":"经济管理"},{"tagTapName":"图书类型：","id":"572","name":"IT与网络"},{"tagTapName":"图书类型：","id":"573","name":"杂志素材"},{"tagTapName":"图书类型：","id":"574","name":"其它类型"},{"tagTapName":"图书类型：","id":"575","name":"合集打包"},{"tagTapName":"图书类型：","id":"576","name":"版块专用"},{"tagTapName":"文件格式：","id":"552","name":"TXT"},{"tagTapName":"文件格式：","id":"577","name":"PDF"},{"tagTapName":"文件格式：","id":"578","name":"DOC"},{"tagTapName":"文件格式：","id":"579","name":"CHM"},{"tagTapName":"文件格式：","id":"580","name":"MP3"},{"tagTapName":"文件格式：","id":"581","name":"视频"},{"tagTapName":"文件格式：","id":"582","name":"PDG"},{"tagTapName":"文件格式：","id":"583","name":"其它"},{"tagTapName":"下载方式：","id":"553","name":"BT/网盘"},{"tagTapName":"下载方式：","id":"584","name":"BT下载"},{"tagTapName":"下载方式：","id":"585","name":"网盘下载"},{"tagTapName":"图片分类：","id":"586","name":"美女"},{"tagTapName":"图片分类：","id":"589","name":"风景"},{"tagTapName":"图片分类：","id":"590","name":"动漫"},{"tagTapName":"图片分类：","id":"591","name":"动物"},{"tagTapName":"图片分类：","id":"592","name":"摄影"},{"tagTapName":"图片分类：","id":"593","name":"游戏"},{"tagTapName":"图片分类：","id":"594","name":"搞笑"},{"tagTapName":"图片分类：","id":"595","name":"体育"},{"tagTapName":"图片分类：","id":"596","name":"名车"},{"tagTapName":"图片分类：","id":"597","name":"人文"},{"tagTapName":"图片分类：","id":"598","name":"影视"},{"tagTapName":"图片分类：","id":"601","name":"创意"},{"tagTapName":"图片分类：","id":"602","name":"节日"},{"tagTapName":"图片分类：","id":"603","name":"美食"},{"tagTapName":"图片分类：","id":"604","name":"花卉"},{"tagTapName":"图片分类：","id":"605","name":"军事"},{"tagTapName":"图片分类：","id":"606","name":"插画"},{"tagTapName":"图片分类：","id":"607","name":"绘画"},{"tagTapName":"图片分类：","id":"608","name":"炫彩"},{"tagTapName":"图片分类：","id":"609","name":"建筑"},{"tagTapName":"图片分类：","id":"610","name":"月历"},{"tagTapName":"图片分类：","id":"611","name":"宽屏"},{"tagTapName":"图片分类：","id":"612","name":"手机"},{"tagTapName":"图片分类：","id":"613","name":"系统"},{"tagTapName":"图片分类：","id":"614","name":"设计"},{"tagTapName":"图片分类：","id":"615","name":"立体"},{"tagTapName":"图片分类：","id":"616","name":"其它"},{"tagTapName":"下载方式：","id":"587","name":"BT下载"},{"tagTapName":"下载方式：","id":"617","name":"网盘下载"},{"tagTapName":"下载方式：","id":"618","name":"BT/网盘"},{"tagTapName":"话题分类：","id":"786","name":"闲聊灌水"},{"tagTapName":"话题分类：","id":"788","name":"图文杂烩"},{"tagTapName":"话题分类：","id":"789","name":"时事资讯"},{"tagTapName":"话题分类：","id":"790","name":"影视娱乐"},{"tagTapName":"话题分类：","id":"791","name":"体育资讯"},{"tagTapName":"话题分类：","id":"792","name":"视频资讯"},{"tagTapName":"话题分类：","id":"793","name":"议论交流"},{"tagTapName":"版主专用：","id":"0","name":"全部"},{"tagTapName":"版主专用：","id":"796","name":"BT之家1LOU站"},{"tagTapName":"版主专用：","id":"787","name":"版规"},{"tagTapName":"版主专用：","id":"794","name":"活动"},{"tagTapName":"版主专用：","id":"795","name":"公告"},{"tagTapName":"分类：","id":"402","name":"举报"},{"tagTapName":"分类：","id":"406","name":"问题"},{"tagTapName":"分类：","id":"407","name":"建议"},{"tagTapName":"状态：","id":"0","name":"全部"},{"tagTapName":"状态：","id":"403","name":"跟进中"},{"tagTapName":"状态：","id":"408","name":"已解决"},{"tagTapName":"状态：","id":"409","name":"批 准"},{"tagTapName":"站务：","id":"0","name":"全部"},{"tagTapName":"站务：","id":"430","name":"BT之家1LOU站"},{"tagTapName":"站务：","id":"404","name":"公告"},{"tagTapName":"站务：","id":"410","name":"活动"},{"tagTapName":"管理：","id":"0","name":"全部"},{"tagTapName":"管理：","id":"405","name":"申请版主"},{"tagTapName":"求助类型：","id":"411","name":"求电影"},{"tagTapName":"求助类型：","id":"413","name":"求剧集"},{"tagTapName":"求助类型：","id":"802","name":"求动漫"},{"tagTapName":"求助类型：","id":"797","name":"求音乐"},{"tagTapName":"求助类型：","id":"798","name":"求游戏"},{"tagTapName":"求助类型：","id":"799","name":"求综艺"},{"tagTapName":"求助类型：","id":"800","name":"求图书"},{"tagTapName":"求助类型：","id":"801","name":"求美图"},{"tagTapName":"求助类型：","id":"414","name":"求其它"},{"tagTapName":"求助状态：","id":"412","name":"求助中"},{"tagTapName":"求助状态：","id":"422","name":"跟进中"},{"tagTapName":"求助状态：","id":"423","name":"已解决"}]`;
    let fetchBaseUrl = 'https://www.1lou.me/search-';
    let url = location.href;
    let notPageUrl = url.substring(0, url.lastIndexOf("-")); // 没有id的详情页链接
    let pageContent = []; // 获取到的JSON数据
    let container = null // 替换内容的div
    let cateList = JSON.parse(cateListStr); // 分类
    let maxPage = 3; // 最大页数
    let checkList = []; // 前台选中的分类
    function addStyle() {
        var style = $('<style>');
        style.attr('type', 'text/css');
        style.text(`
        .container .card:last-of-type .card-body{
            padding:0;
        }
        .container .card:last-of-type .card-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .kaze-checkbox-area{
            display: flex;
            /**flex-direction: column;**/
        }
        .kaze-checkbox-tag-area{
            display: flex;
            margin-left:6px;
        }
        .kaze-checkbox-area > div{
            margin-top:6px;
        }
        .kaze-checkbox-area > div,.kaze-checkbox-tag-area > div{
            display: flex;
            align-items: center;
            margin-right: 10px;
        }
        .kaze-checkbox-area > div > label,.kaze-checkbox-tag-area > div > label{
            margin-left: 4px;
            margin-bottom: 0;
        }
        .kaze-post-item{
            box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
            margin: 10px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e4e7ed;
        }
        .kaze-post-item-title{
            font-size: 16px;
        }
        .kaze-post-item-title-cate{
            background-color: #409eff;
            border-color: #409eff;
            color: #ffffff;
            line-height: 24px;
            height: 24px;
            padding: 3px 9px;
            border-radius: 4px;
        }
        .kaze-post-item-uploder {
            margin-top: 8px;
            font-size: 14px;
            color: #9f9f9f;
        }
        .kaze-post-item-uploder span:not(:first-child){
            margin-left: 20px;
        }
        .kaze-post-item-tag-area{
            margin-top: 8px;
            display: flex;
        }
        .kaze-post-item-tag-cate{
            color:#ff7b7b;
        }
        .kaze-post-item-tag{
            font-size: 14px;
            background-color:#ecf5ff;
            border-color: #d9ecff;
            color: #409eff;
            line-height: 24px;
            height: 24px;
            padding: 0 9px;
            margin-right: 6px;
            border-radius: 4px;
        }`);
        $('head').append(style);
    }

    /**
     * 替换搜索内容
     */
    function addKazeContainer() {
        container = $('<div id="kaze-container"></div>');
        $('.container .card-body').eq(1).html(container);
    }


    /**
     * 判定页数
     */
    function checkMaxPage() {
        if ($(".pagination").length == 0) {
            // 只有1页
            // 无结果
            maxPage = 1
            $(".card-header").append($(`<div class="kaze-page-now">正在抓取</div><div class="kaze-page-info">已抓取全部页面</div>`))
        } else {
            // 有结果且大于1页
            let resultMaxPage = $(".pagination .page-item").eq(-2)[0].innerText
            if (resultMaxPage <= maxPage) {
                maxPage = resultMaxPage;
                $(".card-header").append($(`<div class="kaze-page-now">正在抓取</div><div class="kaze-page-info">总页数小于${maxPage}页，已抓取全部页面</div>`))
            } else {
                $(".card-header").append($(`<div class="kaze-page-now">正在抓取</div><div class="kaze-page-info">总页数大于${maxPage}页，为保护服务器，仅抓取前${maxPage}页，更多内容请细化搜索词</div>`))
            }
        }
        $(".pagination").hide()
    }

    function generateUrl(i) {
        // url 拼接 https://www.1lou.me/search-关键词-页数.htm
        let searchText = $(".form-control").val()
        return `${fetchBaseUrl}${encodeURIComponent(searchText).replaceAll('%', '_')}-1-${i}.htm`
    }
    /**
     * 请求接口
     */
    async function fetchPages() {
        for (var i = 1; i <= maxPage; i++) {
            const response = await $.get(generateUrl(i));
            const data = JSON.parse(response);
            $(".kaze-page-now").html(`正在抓取第${i}页`)
            pageContent.push(...data.message);

            if (maxPage > 1) {
                // 休眠1秒的函数
                await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 1000));
            }
        }
        $(".kaze-page-now").html(``)
    }

    /**
     * 生成页面
     */
    async function fetchAndDisplayPages() {
        await fetchPages();
        setPage(pageContent);
        addCateCheckbox();
    }

    /**
    * 生成页面
    */
    function setPage(itemList) {
        container.html('')
        if (itemList.length > 0) {
            itemList.forEach(item => {
                const div = $('<div class="kaze-post-item"></div>');
                const title = $(`<div class="kaze-post-item-title""></div>`).html(`<span class="kaze-post-item-title-cate">${item.forumname}</span> <a target="_blank" href="thread-${item.tid}.htm">${item.subject}</a>`);
                const uploadTime = $('<div class="kaze-post-item-uploder"></div>').html(`<span>${item.username}</span><span>${item.create_date_fmt}</span><span>查看：${item.views}</span>`);

                const tagHtml = $('<div class="kaze-post-item-tag-area"></div>');

                const tagList = item.taglist.forEach(tag => {
                    let findObj = cateList.find(x => x.id == tag.tagid)
                    tagHtml.append($('<div class="kaze-post-item-tag"></div>').html(`<span class="kaze-post-item-tag-cate">${findObj ? findObj.tagTapName : ''}</span>${tag.name}`))
                });
                div.append(title, uploadTime, tagHtml);
                container.append(div);
            })
        } else {
            // 没有结果
            const div = $('<div class="kaze-post-item">没有结果，请更换搜索词</div>');
            container.append(div);
        }
    }

    /**
     * 添加分类筛选
     */
    function addCateCheckbox() {
        let allCateList = pageContent.map(x => { return { forumname: x.forumname, taglist: x.taglist } });
        const mergedData = [];
        for (const forum of allCateList) {
            // 查找是否存在相同的 forumname
            const existingForum = mergedData.find(f => f.forumname === forum.forumname);
            // 如果 forumname 不存在，则将其添加到 mergedData 中
            if (!existingForum) {
                mergedData.push({
                    forumname: forum.forumname,
                    taglist: forum.taglist,
                });
                continue;
            }
            // 将 forum.taglist 中的标签与 existingForum.taglist 合并
            const mergedTags = [...existingForum.taglist, ...forum.taglist];
            // 使用 Set 去除重复的标签
            const uniqueTags = new Set(mergedTags.map(tag => JSON.stringify(tag)));
            // 将去重后的标签列表更新到 existingForum 中
            existingForum.taglist = Array.from(uniqueTags).map(JSON.parse);
        }
        let checkboxArea = $('<div class="kaze-checkbox-area"></div>');
        // mergedData.forEach(cate => {
        //     const tagHtml = $('<div></div>');
        //     cate.taglist.forEach(tag => {
        //         tagHtml.append($(`<div>
        //                         <input class="kaze-checkbox" type="checkbox" kaze-data="${tag.name}" id="kaze-tag-${tag.name}" checked name="type"  />
        //                         <label for="kaze-tag-${tag.name}">${tag.name}</label>
        //                     </div>`))
        //     })
        //     checkboxArea.append($(`<div>
        //                             <input class="kaze-checkbox" type="checkbox" kaze-data="${cate.forumname}" id="kaze-cate-${cate.forumname}" checked name="type"  />
        //                             <label for="kaze-cate-${cate.forumname}">${cate.forumname}</label>：
        //                             <div class="kaze-checkbox-tag-area"> ${tagHtml.html()}</div>
        //                         </div>`));
        // })
        // $('.container .card-body').eq(0).append(checkboxArea);
        // $('.kaze-checkbox').change(function () {
        //     let ischeck = $(this).is(':checked')
        //     let name = $(this).attr('kaze-data');
        //     if (ischeck) {
        //         checkList.push(name)
        //     } else {
        //         checkList = checkList.filter(item => item !== name);
        //     }
        //     setPage(pageContent.filter(x => checkList.includes(x.forumname)))
        // });
        mergedData.forEach(cate => {
            checkList.push(cate.forumname)
            checkboxArea.append($(`<div>
                                <input class="kaze-checkbox" type="checkbox" kaze-data="${cate.forumname}" id="kaze-cate-${cate.forumname}" checked name="type"  />
                                <label for="kaze-cate-${cate.forumname}">${cate.forumname}</label>
                            </div>`));
        });
        $('.container .card-body').eq(0).append(checkboxArea);
        $('.kaze-checkbox').change(function () {
            debugger
            let ischeck = $(this).is(':checked')
            let name = $(this).attr('kaze-data');
            if (ischeck) {
                checkList.push(name)
            } else {
                checkList = checkList.filter(item => item !== name);
            }
            setPage(pageContent.filter(x => checkList.includes(x.forumname)))
        });
    }

    addStyle();
    addKazeContainer();
    checkMaxPage();
    fetchAndDisplayPages();
})();
