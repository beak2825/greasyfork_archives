// ==UserScript==
// @name         半次元获取原图
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  获取半次元原图脚本，如果您觉得有用请为我点个赞支持一下！谢谢您的鼓励！
// @author       ReLU_加一
// @match        https://bcy.net/item/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390830/%E5%8D%8A%E6%AC%A1%E5%85%83%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/390830/%E5%8D%8A%E6%AC%A1%E5%85%83%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    version 0.2 更新于2019.10.11
    第二版增加了对另一种格式的图片url的适配，具有更好的兼容性！
    第一版只支持这种：
    https://p9-bcy.byteimg.com/img/banciyuan/user/222119/item/c0rhb/sg15gaembix1x9cjrqcpm5izs1isxkoq.jpg~tplv-banciyuan-w650.image
    第二版还支持这种：
    https://p9-bcy.byteimg.com/img/banciyuan/a7045f6b554d4ad19f60aa312cae3bff~tplv-banciyuan-w650.image

    version 0.3 更新于2019.10.24
    感谢Kuro Aozaki的反馈！！！
    采用替换~noop.image的方式实现新版环境下提取无水印大图，解决了新版的水印问题！
    +增加了png格式图片的匹配
    */

    /*
    碎碎念发牢骚...
    这个脚本于19年10月6日完成，之前我都是用python写个爬虫来获取半次元原图的，结果半次元越改越复杂...
    前两天突然遇到个好看的小姐姐，想下载原图时发现之前写的爬虫不管用了，一气之下新写了一个能用的python爬虫脚本。
    不过新脚本操作起来比较复杂，还需要安装大多数人电脑上并没有的插件，不太方便。
    因此为了造福各位绅士，我又花了一天时间学了一点javascript写了这个油猴脚本...我太难了...js语言真的让人头大...
    写完之后发现才不到10行...花了一天写的...哭了...
    写完看到已经有大佬写过了...又哭了...
    */

    var zz = /<div class="img-wrap-inner"><img src="(https:\/\/.*?~tplv-banciyuan-w650.image)"><\/div>/g;
	var zz2 = /user\/.+?\.(jpg|png|jpeg)/
    var zz_t2 = /(https:\/\/.*?)~tplv-banciyuan/;

	var n = $("body").html().match(zz);
    var m1 = n[0].match(zz2); // 检测图片url格式
    var imgwraps = $("div.img-wrap");
    var img;
	for (var i=0;i<n.length;i++)
	{
        if(m1!=null)
        {
            img = "https://img-bcy-qn.pstatp.com/" + n[i].match(zz2)[0];
        }
        else
        {
            var img_head = n[i].match(zz_t2)[1];
            img = img_head + '~noop.image';
        }
        $(imgwraps[i]).append('<div style="height:15px;font-size:15px"><a href="'+img+'" target="_blank">查看原图</a></div>');
	}

})();