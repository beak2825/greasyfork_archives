// ==UserScript==
// @name         ds自用油猴脚本
// @namespace    http://tampermonkey.net/
// @version      20260116
// @description  try to take over the world!
// @author       ds
// @match        mmbiz.qpic.cn/*
// @match        mp.weixin.qq.com/*
// @match        *.bing.com/*
// @match        *.music.163.com/*
// @match        *.music.126.net/*
// @match        *.dribbble.com/*
// @match        *.jianshu.io/*
// @match        *.tmall.com/*
// @match        *.taobao.com/*
// @match        dl.zhutix.net/*
// @match        static.iyingdi.cn/*
// @match        static.iyingdi.com/*
// @match        wspic.iyingdi.cn/*
// @match        wspic.iyingdi.com/*
// @match        wsmedia.iyingdi.cn/*
// @match        tiebapic.baidu.com/*
// @match        *.zhimg.com/*
// @match        -images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/*
// @match        img.bosszhipin.com/*
// @match        img.yzcdn.cn/*
// @match        *.doubanio.com/*
// @match        img.xiaohongshu.com/*
// @match         *.xpccdn.com/*
// @match         www.deviantart.com/*
// @match         hentaiporns.net/*
// @match         *.wellcee.com/*
// @match         www.lgstatic.com/*
// @match         www.kanzhun.com/*
// @match         img.wbp5.com/*
// @match         www.sohu.com/*
// @match         *.zsxq.com/*
// @match         www.zhihu.com/people/*
// @match         www.cocomanga.com/*
// @match         *.badmintoncn.com/*
// @match         www.bilibili.com/*
// @match         files.getquicker.net/*
// @match         *.ziroom.com/*
// @match         cdn.sspai.com/*
// @match         *.acfun.cn/*
// @match         *.playgwent.com/*
// @match         item.m.jd.com/product/*
// @match         www.xiaohongshu.com/*
// @match         https://www.coolapk.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/392550/ds%E8%87%AA%E7%94%A8%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/392550/ds%E8%87%AA%E7%94%A8%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//将同类别功能的代码进行了分类
var url = document.location.toString();
var title = document.title;
var m = null;
var img = null;
var temp = null;
//---------类别一：添加下载按钮---------
//淘宝登录页背景图片下载-更新*3，如果是默认图的话就自动刷新
if ((m = url.match(/^(https?:\/\/login\.taobao\.com\/member\/login\.jhtml)(.*)$/i))) {
    img = document.getElementsByClassName("login-newbg")[0].style.backgroundImage.match(/url\("(.*)"\)/)[1];
    //Midnight Lizard夜间模式会将background里面的图片地址由png转成svg+xml格式
    if (img != "https://gtms01.alicdn.com/tps/i1/TB1GTCYLXXXXXcHXpXXcoeQ2VXX-2500-600.jpg") {
        window.open(img);
        document.querySelectorAll('a')[0].target = "_blank";
        document.querySelectorAll('a')[0].href = img;
        document.querySelectorAll('a')[0].download = img;
    } else {
        location.reload(); //重新加载当前页面，相当于F5刷新
    }
}
//必应背景图片下载-更新*6
//地址由https://cn.bing.com/换成了https://www.bing.com/?mkt=zh-CN，然后又换回来了
//网页由bing改版成了MicrosoftBing，界面发生了大变化，2021/08/10
else if ((m = url.match(/^(https?:\/\/.+\.bing\.com\/)(.*)$/i))) {
    setTimeout(function() {
        //在搜索框上方添加下载当前背景图片的按钮，并在搜索框内显示图片描述
        //只有将id改成est_cn或者est_en才跟原来的按钮样式一样，就算class一样但是自定义id的话会以普通的文字显示到下一行
        document.querySelectorAll('div#est_en.est_common.est_unselected')[0].insertAdjacentHTML('afterEnd', '<div id="est_en" class="est_common est_unselected"><a id="img_download" >下载背景</a></div>');
        document.querySelectorAll('div#est_en.est_common.est_unselected')[0].insertAdjacentHTML('afterEnd', '<div id="est_en" class="est_common est_unselected"><a id="img_update" >更新信息</a></div>');
        //document.querySelectorAll('#img_download')[0].insertAdjacentHTML('afterEnd', '<div class="est_common est_unselected"><a id="img_update" >更新信息</a></div>');
        //文件名用正则表达式提取英文名称再加上中文描述，就不会是默认保存的th.jpg了
        //https://cn.bing.com/th?id=OHR.FrederickSound_ZH-CN1838908749_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
        var nameE, nameC, img_info;
        //自动打开背景图片，点击更新会获取当前背景信息
        function img_update() {
            //获取信息
            img = document.querySelectorAll("a.downloadLink")[0].href.replace(/x1200/g, "x1080");
            nameC = document.querySelectorAll("a.title")[0].innerText;
            img = document.querySelectorAll('div.img_cont')[0].style.backgroundImage;
            //"url("/th?id=OHR.NahanniNP_ZH-CN2848117800_1920x1080.jpg&rf=LaDigue_1920x1080.jpg")"
            img = "https://cn.bing.com/" + img.match(/^(.*)(th\?id=.*)(&.*)$/i)[2];
            img_info = document.querySelectorAll('a.title')[0].innerText + " " + document.querySelectorAll('div#copyright')[0].innerText;
            nameE = img.match(/^.*th\?id=OHR\.(.+?_1920x1080).+$/i)[1] + "_" + img_info;
            document.querySelectorAll("input#sb_form_q.sb_form_q")[0].value = img_info;
            document.querySelectorAll("a#img_download")[0].href = img;
            document.querySelectorAll("a#img_download")[0].download = nameE;
            //下载
            let a = document.createElement('a') // 创建a标签
            let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
            e.initEvent('click', false, false) // 初始化事件对象
            a.href = img // 设置下载地址
            a.download = nameE // 设置下载文件名
            a.dispatchEvent(e)
            //alert('abc');
        }
        document.querySelectorAll('#img_update')[0].onclick = img_update;
        document.querySelectorAll('svg#bLogo.logo')[0].onclick = img_update;
    }, 1500);
}
//知乎用户头像下载-施工中
else if ((m = url.match(/^(https?:\/\/www\.zhihu\.com\/)(people|org)\/(.+)(\/.*)?$/i))) {
    img = document.querySelectorAll('img.Avatar.Avatar--large.UserAvatar-inner')[0].scr;
}
//网易云用户头像下载-施工中
else if ((m = url.match(/^(https?:\/\/music\.163\.com\/)(.*user\/home\?id=)(\d+)?$/i))) {
    //https://music.163.com/#/user/home?id=539490193
    var id=url.match(/(.*user\/home\?id=)(\d+)/)[2];
    var img_name=$('#j-name-wrap > span.tit.f-ff2.s-fc0.f-thide').innerText;
    var img_url=$('#ava > img').src.match(/(.*)(\?param=.+)/)[1];
    var filename='网易云id='+id+'@'+img_name;
    //alert(filename);
}
//deviantart图片添加下载按钮，未解决
else if ((m = url.match(/^(https?:\/\/www\.deviantart\.com\/)(.+)(\/art\/)(.+)$/i))) {
    var title_name = document.querySelectorAll('h1._2p6cd._1H4oq')[0].textContent;
    var img_info = m[2] + "-" + m[4];
    //document.querySelectorAll('h1._2p6cd._1H4oq')[0].value = "<a id=\"img_download\">" + title_name + "<\/a>";
    document.querySelectorAll('h1._2p6cd._1H4oq')[0].insertAdjacentHTML('afterEnd', '<a id="img_download"  class="_3USIK _1nd-h">∞download∞</a>');
    document.querySelectorAll("a#img_download")[0].href = document.querySelectorAll('img._1izoQ.vbgSM')[0].src;
    //[浅析 HTML5 中的 download 属性 - 知乎](https://zhuanlan.zhihu.com/p/58888918)
    //download属性目前仅适用于同源 URL，即如果需要下载的资源地址是跨域的，download属性就会失效，点击链接会变成导航预览。
    document.querySelectorAll("a#img_download")[0].download = img_info; //不会直接下载，而是在当前标签页打开图片，而且图片质量有时候不是最高
    //https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fe7ab27f-7530-4252-99ef-2baaf81b36fd/dcb28ug-3db9e14c-858d-4ceb-99ec-776fbb764742.png/v1/fill/w_1131,h_707,q_70,strp/a2_by_raikoart_dcb28ug-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD04MDAiLCJwYXRoIjoiXC9mXC9mZTdhYjI3Zi03NTMwLTQyNTItOTllZi0yYmFhZjgxYjM2ZmRcL2RjYjI4dWctM2RiOWUxNGMtODU4ZC00Y2ViLTk5ZWMtNzc2ZmJiNzY0NzQyLnBuZyIsIndpZHRoIjoiPD0xMjgwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.eTK6Ekelzrub20gN60SgE4DsJR2X3RrfcykWQHKG2io
    //https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fe7ab27f-7530-4252-99ef-2baaf81b36fd/dcb28ug-3db9e14c-858d-4ceb-99ec-776fbb764742.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZmU3YWIyN2YtNzUzMC00MjUyLTk5ZWYtMmJhYWY4MWIzNmZkXC9kY2IyOHVnLTNkYjllMTRjLTg1OGQtNGNlYi05OWVjLTc3NmZiYjc2NDc0Mi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.g2WCQP4U1o6XabpDP2BA9xOEVWj0rsrBQcUNtdeAzXQ
}
//---------类别二：长链接净化---------
//昆特牌卡组转英文
//https://www.playgwent.com/zh-cn/decks/870e80b93fb165f2a398e8f7f31ff25c
//https://www.playgwent.com/en/decks/870e80b93fb165f2a398e8f7f31ff25c
else if ((m = url.match(/^(https?:\/\/www\.playgwent\.com\/)(zh-cn)(\/decks\/.+)$/i))) {
//else if ((m = url.match(/^(https?:\/\/www\.playgwent\.com\/)((?!en))*(.+?)(\/decks\/.+)$/i))) {
    document.location = m[1] + 'en' + m[3];
}
//天猫淘宝链接净化-更新2
//https://detail.tmall.com/item.htm?spm=a1z10.3-b.w4011-4576207802.89.3ffe6c283xuI7K&id=606339945843&rn=251790cc7fcc948982bedb0906114d7a&abbucket=10&skuId=4422763215508
//https://detail.tmall.com/item.htm?id=606339945843
//https://item.taobao.com/item.htm?spm=a230r.1.14.353.5f8e796cvwOf7f&id=610677896919&ns=1&abbucket=19#detail
//https://item.taobao.com/item.htm?id=610677896919
else if ((m = url.match(/^(https?:\/\/.+\.(tmall|taobao)\.com\/item\.htm\?)(.*?&)(id=\d+)((&.*)?)$/i))) {
    document.location = m[1] + m[4];
}
else if ((m = url.match(/^(https?:\/\/.+\.(tmall|taobao)\.com\/item\.htm\?)((.*?&)?)(id=\d+)(&.*)$/i))) {
    document.location = m[1] + m[5];
}
//京东链接净化，手机版转网页版-更新2
//https://item.m.jd.com/product/44165271435.html
//https://item.jd.com/44165271435.html
else if ((m = url.match(/^(https?:\/\/item\.m\.jd\.com\/)(product\/)(\d+\.html)(.*)?$/i))) {
    document.location = 'https://item.jd.com/' + m[3];
}
//微信公众号网页链接净化
//https://mp.weixin.qq.com/s?__biz=MzI3NzkzNDcxOA==&mid=2247544667&idx=1&sn=d041d4bca03fee9a6c0c6045a048a1ea&chksm=eb5cc84adc2b415c28a1a92b7314cacc7e79d5c40e29fa42ac5c1c083f4901b435129c0bfd28&scene=27&subscene=10000&clicktime=1589133397&enterid=1589133397&ascene=0&devicetype=android-29&version=27000a11&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=A9yslC9du78Owb2jxmG5BxQ%3D&pass_ticket=V0k7CVUu2YqxifhjJyDxZc1KRlUK0lGVIPjDo1LF1UDQVcspE1OQCAyYVqyjNRB3&wx_header=1
//https://mp.weixin.qq.com/s?__biz=MzI3NzkzNDcxOA==&mid=2247544667&idx=1&sn=d041d4bca03fee9a6c0c6045a048a1ea
else if ((m = url.match(/^(https?:\/\/mp\.weixin\.qq\.com\/s\?__biz=)(.+)(&chksm=.+)$/i))) {
    document.location = m[1] + m[2];
}
//搜狐网页链接净化
//https://www.sohu.com/a/415410463_120446881?scm=1002.44003c.fe017c.PC_ARTICLE_REC&spm=smpc.content.fd-d.66.1598652755269JQIEDUj
//https://www.sohu.com/a/415410463_120446881
else if ((m = url.match(/^(https?:\/\/www\.sohu\.com\/)(a\/.*)(\?.*)$/i))) {
    document.location = m[1] + m[2];
}
//B站稍后再看还原原视频链接
//https://www.bilibili.com/medialist/play/watchlater/av381991096
//https://www.bilibili.com/medialist/play/watchlater/BV1qv4y1X7ty
//https://www.bilibili.com/video/av381991096
else if ((m = url.match(/^(https?:\/\/www\.bilibili\.com\/)(medialist\/play\/watchlater\/)(.+)$/i))) {
    document.location = m[1] + "video/" + m[3];
}
//B站稍后再看还原原视频链接-2
//https://www.bilibili.com/list/watchlater?bvid=BV11L41197d2
//https://www.bilibili.com/list/watchlater?bvid=BV11L41197d2&oid=438966130
//https://www.bilibili.com/video/BV11L41197d2
//B站稍后再看还原原视频链接-3，20250710更新
//https://www.bilibili.com/list/watchlater/?bvid=BV1M33Nz6EwD&oid=114769931537334&watchlater_cfg=%7B%22viewed%22%3A0,%22key%22%3A%22%22,%22asc%22%3Afalse%7D&spm_id_from=333.881.0.0
//https://www.bilibili.com/video/BV1M33Nz6EwD
else if ((m = url.match(/^(https?:\/\/www\.bilibili\.com\/)(list\/watchlater\/\?bvid=)(.+?)(&.+)$/i))) {
    document.location = m[1] + "video/" + m[3];
}
//B站视频链接净化
//https://www.bilibili.com/video/av387856322?spm_id_from=333.999.0.0&vd_source=5dc1858dc2dd1e9b307672fca76bc8ed
//https://www.bilibili.com/video/av387856322
else if ((m = url.match(/^(https?:\/\/www\.bilibili\.com\/)(([av|BV]).*)(\?.*)$/i))) {
    document.location = m[1] + m[2];
}
//小红书链接净化-20250206
//https://www.xiaohongshu.com/explore/6785d84f000000000100af86?app_platform=android&ignoreEngage=true&app_version=8.69.5&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CB3SZSM9U1hJA4cllF5qpyh2G-sY2CpMrAxBugknSk3og=&author_share=1&xhsshare=CopyLink&shareRedId=ODk5Qzg5Nzw2NzUyOTgwNjdJOTg6S0dL&apptime=1738774927&share_id=27efd1fc129c4a739944a909f3f39e10&share_channel=copy_link
//https://www.xiaohongshu.com/explore/6785d84f000000000100af86?xsec_token=CB3SZSM9U1hJA4cllF5qpyh2G-sY2CpMrAxBugknSk3og=
else if ((m = url.match(/^(https?:\/\/www\.xiaohongshu\.com\/)(explore\/.+\?)(.*&)(xsec_token=.+?)(&.*)$/i))) {
    document.location = m[1] + m[2] + m[4];
}
//酷安链接净化-20260116
//https://www.coolapk.com/feed/44043319?shareKey=OGU5ZWUwZjNkMzVkNjQwYWZjYTk~&shareUid=790904&shareFrom=com.coolapk.market_12.0.2
//https://www.coolapk.com/feed/44043319?shareKey=OGU5ZWUwZjNkMzVkNjQwYWZjYTk
else if ((m = url.match(/^(https?:\/\/www\.coolapk\.com\/)(feed\/.+\?shareKey=.+?)(~&.+)$/i))) {
    document.location = m[1] + m[2];
}
//---------类别三：网站内容显示优化---------
//看准网内容显示优化
else if ((m = url.match(/^(https?:\/\/www\.kanzhun\.com\/)(.*)$/i))) {
    window.addEventListener('load', (event) => {
        //需要全文展开的内容，直接展开能看到，并不需要限制在微信小程序里面才能看
        for (var i = 0; i < document.querySelectorAll('div.content').length; i++) {
            document.querySelectorAll('.content')[i].className = "";
        }
        //去除"手机浏览更不方便"的悬浮框
        var vanish = document.querySelectorAll('div.promotion')[0];
        vanish.parentNode.removeChild(vanish);
    });
}
//搜狐网内容显示优化
else if ((m = url.match(/^(https?:\/\/www\.sohu\.com\/)(.*)$/i))) {
    //去除：下方长得过分的的推荐阅读、右侧的10条24小时热文以及搜狐号推荐、右下角的浮动按钮
    var block = ["div.groom-read", "div#right-side-bar.sidebar.right", "div#float-btn.float-links"];
    for (var i = 0, len = block.length; i < len; i++) {
        var vanish = document.querySelectorAll(block[i])[0];
        vanish.parentNode.removeChild(vanish);
    }
    //自动点击展开全文，未实现
}
//cocomanga漫画看完一话后跳转知乎相应讨论
else if ((m = url.match(/^(https?:\/\/www\.cocomanga\.com\/)(10263\/1\/)(.*)$/i))) {
    //else if ((m = url.match(/^(https?:\/\/www\.cocomanga\.com\/)(10263\/1\/)(\d+)$/i))) {
    //10253对应漫画《一人之下》
    temp = document.querySelectorAll('div.mh_readend')[0].children[1];
    url = "https://www.zhihu.com/search?type=content&q=一人之下%20" + temp.title;
    temp.href = url;
    temp.target = '_new';
    document.querySelectorAll('strong')[0].insertAdjacentHTML('afterEnd', '【<a href="' + url + '" id="zhihu">知乎讨论</a>】');
    document.querySelectorAll('a#zhihu')[0].target = '_new';
}
//AcFun用户界面，添加头像下载功能
//https://www.acfun.cn/u/738929
else if ((m = url.match(/^(https?:\/\/www\.acfun\.cn\/)(u\/)(.+)$/i))) {
    temp = document.querySelectorAll('div.user-photo.live-avatar')[0];
    url = getComputedStyle(temp, "style").backgroundImage.replace('url(','').replace(')','').replace('"','');
    document.querySelectorAll('.text-overflow.name')[0].insertAdjacentHTML('afterEnd', '【<a id="img_download">头像下载</a>】');
    document.querySelectorAll('a#img_download')[0].href = url;
    document.querySelectorAll('a#img_download')[0].target = '_new';
}
//---------类别四：图片最优质量显示---------
//网易云音乐图片
//http://p1.music.126.net/vfg6pMhhKLfaGrlg_jTNug==/109951165143032375.jpg?param=45y45
//http://p1.music.126.net/9WhVdJQ-YUhbntumZ_0rkg==/109951164538295059.jpg?param=525x10000
//http://p1.music.126.net/hfvmL981yC30JTlkzOjm_Q==/7902190069431497.jpg?imageView=1&type=webp&thumbnail=80x0&quality=85&interlace=1
else if ((m = url.match(/^(https?:\/\/p\d?\.music\.126\.net\/.*==\/\d*(\.(jpg|jpeg|gif|png|bmp|webp))?)(\?.*)$/i))) {
    document.location = m[1];
}
//dribbble图片
//https://cdn.dribbble.com/users/729829/screenshots/8070547/dribbble_1x.png
//https://cdn.dribbble.com/users/2811827/screenshots/7999487/black_squares.png
else if ((m = url.match(/^(https?:\/\/.+\.dribbble\.com\/)([\w\-\/]+)(?:_\w{1,2})(\.(jpg|jpeg|gif|png|bmp|webp))$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//微信公众号网页图片
else if ((m = url.match(/^(https?:\/\/mmbiz.qpic.cn\/mmbiz_\w*\/.*\/640)(.+)$/i))) {
    document.location = m[1];
} //简书图片
//https://upload.jianshu.io/users/upload_avatars/10369183/1be8866e-5d8c-4930-9825-58d13e436fc3.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240
//https://upload-images.jianshu.io/upload_images/4219043-25c53c817bc61247.png?imageMogr2/auto-orient/strip|imageView2/2/w/768/format/webp
else if ((m = url.match(/^(https?:\/\/.+\.jianshu\.io\/)([\w\-\/]+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?imageMogr.*)$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//致美化-主题秀图片
//https://dl.zhutix.net/2020/05/457214a9be4b573bebb.jpg?x-oss-process=image/resize,w_500/format,jpg
else if ((m = url.match(/^(https?:\/\/dl\.zhutix\.net\/)(.+)(\?.*)$/i))) {
    document.location = m[1] + m[2];
}
//旅法师营地图片统一处理：static.iyingdi.cn、wspic.iyingdi.cn、wspic.iyingdi.com、wsmedia.iyingdi.cn、static.iyingdi.com
//http://static.iyingdi.cn/common/2018/12/02/e96af9ff-7012-4fdb-94f2-a60899a1e43b.png?x-oss-process=image/resize,w_720/format,jpg/watermark,image_Y29tbW9uL3dhdGVybWFyay5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8yMw,t_70,g_se,x_20,y_15
//https://static.iyingdi.com/common/2020/03/18/5aba1021-8f1f-44e6-9468-6800f0a4d245.png?x-oss-process=image/resize,w_720/format,jpg/watermark,image_Y29tbW9uL3dhdGVybWFyay5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8yMw,t_70,g_se,x_20,y_15
//http://wspic.iyingdi.cn/common/2018/12/04/1a517bc4-92b0-4cfc-b4d6-4f6a40f9d7cf.png?x-oss-process=image/resize,w_720/format,jpg/watermark,image_Y29tbW9uL3dhdGVybWFyay5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8yMw,t_70,g_se,x_20,y_15
//https://wspic.iyingdi.com/common/2020/02/21/b763c900-53cb-459c-882f-4a633b58653b.jpeg?x-oss-process=image/resize,w_720/format,jpg/watermark,image_Y29tbW9uL3dhdGVybWFyay5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8yMw,t_70,g_se,x_20,y_15
//https://wsmedia.iyingdi.cn/common/2018/12/13/83f424fc-7541-4f53-931b-dd1a8398ee83.png?x-oss-process=image/resize,w_720/format,jpg/watermark,image_Y29tbW9uL3dhdGVybWFyay5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8yMw,t_70,g_se,x_20,y_15
else if ((m = url.match(/^(https?:\/\/(static|wspic|wsmedia)\.iyingdi\.(cn|com)\/)(.+)(\?.*)$/i))) {
    document.location = m[1] + m[4];
}
//百度贴吧图片
//http://tiebapic.baidu.com/forum/w%3D580/sign=d3505db2d91b9d168ac79a69c3dfb4eb/559955084b36acaf8b4b59916bd98d1000e99ca8.jpg
//https://imgsrc.baidu.com/forum/pic/item/559955084b36acaf8b4b59916bd98d1000e99ca8.jpg
else if ((m = url.match(/^(https?:\/\/tiebapic\.baidu\.com\/)(.+sign=.+\/)(.+)$/i))) {
    document.location = "https://imgsrc.baidu.com/forum/pic/item/" + m[3];
    //alert("https://imgsrc.baidu.com/forum/pic/item/" + m[3]);
}
//知乎图片-更新*1
//https://pic4.zhimg.com/v2-209419022f1c20ea05381da3273f1c57_r.jpg
//https://pic4.zhimg.com/v2-209419022f1c20ea05381da3273f1c57_xl.jpg
//https://pic4.zhimg.com/80/v2-726fe7343ae6c2d2e0e26da3b9bdf4fd_720w.jpg
//https://pic1.zhimg.com/v2-8338f23143f65eb96fe302a59df9aacd_r.jpg?source=8673f162
/*
原作者的暂时停用了，图片会变成下载，而不是页面显示
//zhihu
else if( (m = url.match(/^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
	if(m[3]!="r") {
		document.location = m[1] + m[2] + "r" + m[4];
	}
}
*/
else if ((m = url.match(/^(1https?:\/\/pic.\.zhimg\.com\/)(.+_)(.+)(\..+?)(\?.*)?$/i))) {
    alert(m[5]);
    if (m[5] != "") {
        document.location = m[1] + m[2] + m[3] + m[4];
    }
    else {
        if (m[5] == null & m[3] != "r") {
            document.location = m[1] + m[2] + "r" + m[4];
        }
    }
}
//deviantart图片，有两种情况不好协调，未成功
//https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/004e5896-6d51-4da0-aed6-09f167eb80b5/dantbho-2e4f7309-851a-4383-8a46-3ff064cf2306.jpg/v1/fill/w_375,h_250,q_70,strp/the_witcher___triss_merigold_cosplay_by_dzikan_dantbho-250t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02ODMiLCJwYXRoIjoiXC9mXC8wMDRlNTg5Ni02ZDUxLTRkYTAtYWVkNi0wOWYxNjdlYjgwYjVcL2RhbnRiaG8tMmU0ZjczMDktODUxYS00MzgzLThhNDYtM2ZmMDY0Y2YyMzA2LmpwZyIsIndpZHRoIjoiPD0xMDI0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.UhK98dZFq07hRCAshoG03LwDYSsZoSBaE9Ln-Ss4-Ik
//https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/004e5896-6d51-4da0-aed6-09f167eb80b5/dantbho-2e4f7309-851a-4383-8a46-3ff064cf2306.jpg/v1/fill/w_1024,h_683,q_75,strp/the_witcher___triss_merigold_cosplay_by_dzikan_dantbho-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02ODMiLCJwYXRoIjoiXC9mXC8wMDRlNTg5Ni02ZDUxLTRkYTAtYWVkNi0wOWYxNjdlYjgwYjVcL2RhbnRiaG8tMmU0ZjczMDktODUxYS00MzgzLThhNDYtM2ZmMDY0Y2YyMzA2LmpwZyIsIndpZHRoIjoiPD0xMDI0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.UhK98dZFq07hRCAshoG03LwDYSsZoSBaE9Ln-Ss4-Ik
//https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/004e5896-6d51-4da0-aed6-09f167eb80b5/dar0zoy-03ef51d4-a2d9-4dcd-84d9-061f670b745f.jpg/v1/fill/w_233,h_350,q_70,strp/the_witcher_3__triss_merigold_cosplay_by_dzikan_dar0zoy-350t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0xMzUwIiwicGF0aCI6IlwvZlwvMDA0ZTU4OTYtNmQ1MS00ZGEwLWFlZDYtMDlmMTY3ZWI4MGI1XC9kYXIwem95LTAzZWY1MWQ0LWEyZDktNGRjZC04NGQ5LTA2MWY2NzBiNzQ1Zi5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.FOMqMc3h_DTPc4ns8F-Eo4zM5RVZ_CAMRj5HUKCOPtc
//https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/004e5896-6d51-4da0-aed6-09f167eb80b5/dar0zoy-03ef51d4-a2d9-4dcd-84d9-061f670b745f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMDA0ZTU4OTYtNmQ1MS00ZGEwLWFlZDYtMDlmMTY3ZWI4MGI1XC9kYXIwem95LTAzZWY1MWQ0LWEyZDktNGRjZC04NGQ5LTA2MWY2NzBiNzQ1Zi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.M0Nc1hyH7rDAbi1bE_uVmjgUexl78yMT6G-veE3I5vE
/*
else if ((m = url.match(/^(https?:\/\/images-wixmp-ed30a86b8c4ca887773594c2\.wixmp\.com\/)(.+?\.(jpg|jpeg|gif|png|bmp|webp))(.*)(\?token=.*)$/i))) {
        document.location = m[1] + m[2] + m[5];
}
*/
//boss直聘头像图片
//https://img.bosszhipin.com/beijin/upload/tmp/20200708/d39703b13c1c72ccd3520a338afb1144add2f893c84edf383baaf2eb7466f4ca_s.jpg?x-oss-process=image/resize,w_100,limit_0
//https://img.bosszhipin.com/beijin/upload/tmp/20200708/d39703b13c1c72ccd3520a338afb1144add2f893c84edf383baaf2eb7466f4ca.jpg
else if ((m = url.match(/^(https?:\/\/img\.bosszhipin\.com\/)(.+)(_\w)(\.(jpg|jpeg|gif|png|bmp|webp))(.*)$/i))) {
    document.location = m[1] + m[2] + m[4];
}
//有赞图片
//https://img.yzcdn.cn/upload_files/2020/07/13/Fjxbgw7kjl7z3LZOZouSiWS9hCLk.png!large.webp
//https://img.yzcdn.cn/upload_files/2020/07/13/Fjxbgw7kjl7z3LZOZouSiWS9hCLk.png!
else if ((m = url.match(/^(https?:\/\/img\.yzcdn\.cn\/)(.+\.(jpg|jpeg|gif|png|bmp|webp))(!.*)$/i))) {
    document.location = m[1] + m[2];
}
//豆瓣头像图片
//https://img9.doubanio.com/icon/u196757893-1.jpg
//https://img9.doubanio.com/icon/ul196757893-1.jpg
else if ((m = url.match(/^(https?:\/\/img\d*\.doubanio\.com\/)(icon\/u[a-z]?)(.+\.(jpg|jpeg|gif|png|bmp|webp))$/i))) {
    if (m[2] != "icon/ul") {
        document.location = m[1] + "icon/ul" + m[3];
    }
}
//豆瓣剧照-20260102，已失效，豆瓣对查看原始大图添加了验证措施。
//https://img9.doubanio.com/view/photo/l/public/p2871125275.webp
//https://img9.doubanio.com/view/photo/raw/public/p2871125275.jpg
// https://img1.doubanio.com/view/photo/l/public/p2923588678.webp
// https://nenya.doubanio.com/view/photo/xl/public/p2923588678.jpg?sa_cv=3c89839d7ece75c6149c74253ce18b85&sa_ct=6956a82b
// else if ((m = url.match(/^(https?:\/\/img\d*\.doubanio\.com\/)(view\/photo\/)(.+?)(\/.+)(\.(jpg|jpeg|gif|png|bmp|webp))$/i))) {
//     if (m[3] != "raw") {
//         document.location = m[1] + m[2] + "raw" + m[4] + ".jpg";
//     }
// }
//小红书头像图片
//https://img.xiaohongshu.com/avatar/5c7763eaac05f80001807561.jpg@80w_80h_90q_1e_1c_1x.jpg
//https://img.xiaohongshu.com/avatar/5c7763eaac05f80001807561.jpg
else if ((m = url.match(/^(https?:\/\/img\.xiaohongshu\.com\/)(.+\.(jpg|jpeg|gif|png|bmp|webp))(@.*)$/i))) {
    document.location = m[1] + m[2];
}
//新片场头像图片
//https://oss-xpc0.xpccdn.com/Upload/user/2018/07/105b44512457775.jpeg@290w_290h_1e_1c?id=618829641
//https://oss-xpc0.xpccdn.com/Upload/user/2018/07/105b44512457775.jpeg
else if ((m = url.match(/^(https?:\/\/oss-xpc\d\.xpccdn\.com\/)(.+\.(jpg|jpeg|gif|png|bmp|webp))(@.*)$/i))) {
    document.location = m[1] + m[2];
}
//hentaiporns图片
//https://hentaiporns.net/kaya1028-zero-two-cosplay-darling-in-the-franxx/
//https://hentaiporns.net/wp-content/uploads/2018/03/1195297-85e3be5agy1fon8r22xqsj20y41f4haj_1-150x150.jpg
//https://hentaiporns.net/wp-content/uploads/2018/03/1195297-85e3be5agy1fon8r22xqsj20y41f4haj_1.jpg
else if ((m = url.match(/^(https?:\/\/hentaiporns\.net\/)(.+)(-\d+x\d+)(\.(jpg|jpeg|gif|png|bmp|webp))$/i))) {
    document.location = m[1] + m[2] + m[4];
}
//wellcee唯心所寓图片
//https://qnimg1.wellcee.com/data/2020/03/17/15844511231538714?imageView2/1/w/200/h/200
//https://qnimg1.wellcee.com/data/2020/03/17/15844511231538714
else if ((m = url.match(/^(https?:\/\/qnimg\d*\.wellcee\.com\/)(.+)(\?.*)$/i))) {
    document.location = m[1] + m[2];
}
//拉勾网图床头像图片
//https://www.lgstatic.com/thumbnail_120x120/i/image/M00/1D/C0/Ciqc1F7i19GAcs6wAABIQfC6xZE425.png
//https://www.lgstatic.com/i/image/M00/1D/C0/Ciqc1F7i19GAcs6wAABIQfC6xZE425.png
else if ((m = url.match(/^(https?:\/\/www\.lgstatic\.com\/)(thumbnail_.+?\/)(.*)$/i))) {
    document.location = m[1] + m[3];
}
//外汇110图床头像图片
//https://img.wbp5.com/upload/images/fxchat/2020/08/05/165837444.jpg?x-oss-process=image/resize,h_60
//https://img.wbp5.com/upload/images/fxchat/2020/08/05/165837444.jpg
else if ((m = url.match(/^(https?:\/\/img\.wbp5\.com\/)(.+)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.*)$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//知识星球图片-未解决
//https://images.zsxq.com/Fo_2VBUYb_aM7G5da8Vg-HQ1yLUZ?imageMogr2/auto-orient/thumbnail/800x/format/jpg/blur/1x0/quality/75&e=1656604799&token=kIxbL07-8jAj8w1n4s9zv64FuZZNEATmlU_Vm6zD:IHPeCQANZyAc83-yibHe2Jphq68=
//https://images.zsxq.com/Fo_2VBUYb_aM7G5da8Vg-HQ1yLUZ?imageMogr2/auto-orient/quality/100!/ignore-error/1&e=1656604799&token=kIxbL07-8jAj8w1n4s9zv64FuZZNEATmlU_Vm6zD:r2pRbM0vmGXKelTnDITukhppU0I=
//https://images.zsxq.com/Fo_2VBUYb_aM7G5da8Vg-HQ1yLUZ?imageMogr2/auto-orient/quality/100!/ignore-error/1&e=1656604799&token=kIxbL07-8jAj8w1n4s9zv64FuZZNEATmlU_Vm6zD:U6qBnuhf4WllQPUgafD-_x61iYQ=
else if ((m = url.match(/^(https?:\/\/images\.zsxq\.com\/)(.+\?imageMogr2\/auto-orient)\/thumbnail.+(e=.+&token=.+)$/i))) {
    document.location = m[1] + m[2] + "/quality/100!/ignore-error/1&" + m[3];
}
//知识星球图片
//https://file.zsxq.com/456/7f/567f110a88ad09331848fac4d64e7aa6640029b190da1b7b7c9b42a9fa505d9a_min.jpg
//https://file.zsxq.com/456/7f/567f110a88ad09331848fac4d64e7aa6640029b190da1b7b7c9b42a9fa505d9a.jpg
else if ((m = url.match(/^(https?:\/\/file\.zsxq\.com\/)(.+)(_.+)(\.(jpg|jpeg|gif|png|bmp|webp))$/i))) {
    document.location = m[1] + m[2] + m[4];
}
//中羽在线图片
//https://qnimg.badmintoncn.com/pic/20220226/164588015634728_32.jpg?imageslim%7cimageView2/1/w/200/h/200
//https://qnimg.badmintoncn.com/pic/20220226/164588015634728_32.jpg
else if ((m = url.match(/^(https?:\/\/.*img\.badmintoncn\.com\/)(.+)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.*)$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//自如图片
//https://img.ziroom.com/pic/house_images/g2m4/M00/1C/96/ChAZYWIxriiAYP8_AAJLNeo8F7o363.jpg_C_800_600_Q100.jpg
//https://img.ziroom.com/pic/house_images/g2m4/M00/1C/96/ChAZYWIxriiAYP8_AAJLNeo8F7o363.jpg
else if ((m = url.match(/^(https?:\/\/.*img.*\.ziroom\.com\/)(.+?)(\.(jpg|jpeg|gif|png|bmp|webp))(.+)$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//quicker图片
//https://files.getquicker.net/_sitefiles/kb/2021/10/14/103507_414583_image.png?x-oss-process=image/resize,w_800
//https://files.getquicker.net/_sitefiles/kb/2021/10/14/103507_414583_image.png
else if ((m = url.match(/^(https?:\/\/files\.getquicker\.net\/)(.+?)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.+)$/i))) {
    document.location = m[1] + m[2] + m[3];
}
//sspai少数派图片
//https://cdn.sspai.com/2022/04/21/8af128be78aeea11ff1dddb8f37a25f9.png?imageMogr2/auto-orient/quality/95/thumbnail/!120x120r/gravity/Center/crop/120x120/interlace/1
//https://cdn.sspai.com/2022/04/21/8af128be78aeea11ff1dddb8f37a25f9.png
//https://cdn.sspai.com/2022/04/20/article/cd832de85fe408e4f23fe38705b4938f?imageView2/2/w/1120/q/40/interlace/1/ignore-error/1
//https://cdn.sspai.com/2022/04/20/article/cd832de85fe408e4f23fe38705b4938f
else if ((m = url.match(/^(https?:\/\/cdn\.sspai\.com\/)(.+?)(\?image.+)$/i))) {
    document.location = m[1] + m[2];
}
//AcFun图片
//https://tx-free-imgs.acfun.cn/newUpload/79951_fde7ff177fea4b98851eb28688264e3e.jpg?imageView2/5/w/299/h/299/q/75/ignore-error/1|imageslim
//https://tx-free-imgs.acfun.cn/newUpload/79951_fde7ff177fea4b98851eb28688264e3e.jpg
else if ((m = url.match(/^(https?:\/\/tx-free-imgs\.acfun\.cn\/)(.+?)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.+)$/i))) {
    document.location = m[1] + m[2] + m[3];
}