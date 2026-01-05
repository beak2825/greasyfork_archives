// ==UserScript==
// @name         LOWB Emotions in NGA 
// @namespace    https://greasyfork.org/zh-CN/scripts/29091-lowb-emotions-in-nga
// @version      1.0
// @icon         http://nga.178.com/favicon.ico
// @description  添加lowb表情包至NGA发帖框，所有表情为NGA舰区各群自制。
// @author       SkywalkerJi
// @include		 /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)/(read\.php|post\.php)/
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.js
// @downloadURL https://update.greasyfork.org/scripts/29091/LOWB%20Emotions%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/29091/LOWB%20Emotions%20in%20NGA.meta.js
// ==/UserScript==

//NGA舰区：http://nga.178.com/poi
//此脚本发布地址：NGA爽群

var jQ = jQuery.noConflict();

(function(){

    var sc = "\
    var LowbData = [\
		'./mon_201704/19/-9lddQ2g-jhz8K1oToS2i-1s.gif',\
		'./mon_201704/19/-9lddQ2g-393hK5T8S2m-22.jpg',\
		'./mon_201704/19/-9lddQ2g-8kleK5T8S2k-1u.gif',\
		'./mon_201704/19/-9lddQ2g-drefK2T8S1z-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-iz12KeT8S1z-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-2sx8K14ToS32-22.gif',\
		'./mon_201704/19/-9lddQ2g-85xoK1pToS2l-2a.gif',\
		'./mon_201704/19/-9lddQ2g-dci6K4T8S2h-1s.jpg',\
		'./mon_201704/19/-9lddQ2g-ii1zKwToS2k-2o.gif',\
		'./mon_201704/19/-9lddQ2g-2czsK2T8S1y-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-7skuKlToS32-22.gif',\
		'./mon_201704/19/-9lddQ2g-cz4bK4T8S2c-20.jpg',\
		'./mon_201704/19/-9lddQ2g-ixy8ZhToS32-22.gif',\
		'./mon_201704/19/-9lddQ2g-b3zyKeToS6o-6p.jpg',\
		'./mon_201704/19/-9lddQ2g-ibd3KqToS1z-1r.gif',\
		'./mon_201704/19/-9lddQ2g-21d7K5T8S1z-1r.gif',\
		'./mon_201704/19/-9lddQ2g-790fK5T8S1z-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-cdd4K2T8S2h-22.jpg',\
		'./mon_201704/19/-9lddQ2g-iex7K2T8S1z-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-2wxeZgToS32-22.gif',\
		'./mon_201704/19/-9lddQ2g-81wtK7T8S2i-1s.gif',\
		'./mon_201704/19/-9lddQ2g-dbb4K2T8S1z-1r.jpg',\
		'./mon_201704/19/-9lddQ2g-iih0K2T8S1z-1y.jpg',\
		'./mon_201704/19/-9lddQ2g-2bp6KtToS22-1t.gif',\
		'./mon_201704/19/-9lddQ2g-7j1rK4T8S2c-1l.jpg',\
		'./mon_201704/19/-9lddQ2g-ct0wKeToS4g-3w.gif',\
		'./mon_201704/19/-9lddQ2g-i6hqK3T8S39-3f.jpg',\
		'./mon_201704/19/-9lddQ2g-1wjpKsToS1z-1r.gif',\
		'./mon_201704/19/-9lddQ2g-7308K5T8S1u-1q.jpg',\
		'./mon_201704/19/-9lddQ2g-ldbbK1fToS32-2n.gif',\
    ];\
    function LOWB(e){\
        var n = e.target.nextSibling;\
        if(n.firstChild)\
            return;\
        var tmp = '';\
        for(i = 0; LowbData.length > i; i++){\
            tmp += '<img height=\"60px\" src=\"http://img.nga.178.com/attachments/' + LowbData[i] + '\" onclick=\"postfunc.addText(\\'[img]' + LowbData[i] + '[/img]\\');postfunc.dialog.w._.hide()\" \/>';\
        }\
        n.innerHTML = tmp;\
    }\
    ";

    jQ('head').append(jQ('<script type="text/javascript" />').html(sc));

    function go(){
        jQ("[title='插入表情']").click(function(){
            setTimeout(function(){
                jQ('.single_ttip2').find('div.div3').children('button[name="0"]').parent().append(jQ('<button name="中指" onclick="LOWB(event)">中指</button><div></div>'));
            },100);
        });
    }

    go();

    jQ('body').on("click","a[href^='/post.php']",function(){
        setTimeout(function(){
            go();
        },100);
    });

})();