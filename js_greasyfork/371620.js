// ==UserScript==
// @name         北邮人bt.byr.cn单页种子按类型排序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在rank数组中修改类型出现的前后顺序，排在前的类型在种子列表中会集中排在前面。
// @description  各字符对应类型为{'.c_animes'：动漫；'.c_docs'：资料；'.c_tvseries'：剧集；'.c_movies'：电影；'.c_arts'：综艺；'.c_games'：游戏'；.c_softwares'：软件；'.c_sports'：体育；'.c_records'：纪录}
// @author       北科_Magicliu
// @match        https://bt.byr.cn/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371620/%E5%8C%97%E9%82%AE%E4%BA%BAbtbyrcn%E5%8D%95%E9%A1%B5%E7%A7%8D%E5%AD%90%E6%8C%89%E7%B1%BB%E5%9E%8B%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/371620/%E5%8C%97%E9%82%AE%E4%BA%BAbtbyrcn%E5%8D%95%E9%A1%B5%E7%A7%8D%E5%AD%90%E6%8C%89%E7%B1%BB%E5%9E%8B%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head;
    var allTable;
    var allTableA=new Array(10);
    var rank=new Array('.c_animes','.c_docs','.c_tvseries','.c_movies','.c_arts','.c_games','.c_softwares','.c_sports','.c_records');
    head=$('#outer > table > tbody > tr > td > table > tbody > tr:nth-child(1)');
    allTable=head.nextAll();
    $.each(rank,function(i,item){allTableA[9-i]=allTable.find('img').filter(item).parent().parent().parent();});
    $.each(allTableA,function(i,item){head.after(item);});
})();