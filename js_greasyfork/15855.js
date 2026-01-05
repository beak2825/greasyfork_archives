// ==UserScript==
// @name         maddawgjav.net排版脚本
// @namespace    http://greasyfork.org/zh-CN/users/25794
// @version      2.1.4
// @description  maddawgjav.net网站重新排版，浏览图片内容更方便，你懂的
// @author       Hobby

// @match        http://maddawgjav.net/*
// @match        http://www.imagebam.com/image/*?url=maddawgjav.net
// @run-at       document-start

// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.imagebam.com
// @connect      pixhost.org

// @license      GPL version 3
// @encoding     utf-8

// @compatible   Chrome_47 + Tampermonkey + 脚本_2.1.2 测试通过

// @copyright    hobby 2016-01-02

// 交流QQ群：273406036
// 内地用户推荐Chrome + Tampermonkey（必须扩展） + XX-Net(代理) + Proxy SwitchyOmega（扩展）的环境下配合使用。

// v2.1.4 增加推荐链接
// v2.1.3 推荐blogjav.net脚本 https://greasyfork.org/zh-CN/scripts/18454
// v2.1.2 修改了一些bug
// v2.1.1 修改了一些bug
// v2.1.0 做了已经加载过的内容大图增加缓存优化，看过的大图重新查看时加载更快了。
// v2.0.2 修复了扩展Tampermonkey更新版本导致的问题，以及其他bug的修复。
// v2.0.1 修复了定位帖子问题，优化了局部排版。
// v2.0.0 重大更新！！增加快捷查找女优番号、女优名的常用外链网站的跳转地址。收藏内容的效率，谁用谁知道！
// v1.2.8 内容大图增加鼠标点击提示效果
// v1.2.7 针对内容大图来自pixhost.org网站做统一展示及统一操作习惯
// v1.2.6 增加脚本适应兼容性,解决目前发现脚本失效问题
// v1.2.5 修复了部分页面出现异常导致插件失效问题
// v1.2.4 修改了网站代码更新导致插件失效的问题
// v1.2.3 做了最低分辨率1280x800的排版适配调整，及修复发现的bug
// v1.2.2 增加放大图片后关闭内容大图，自动定位到下一个帖子的封面大图上，增加自动一次性批量加载页面所有内容大图。
// v1.2.1 做了一些细节排版调整和优化
// v1.2.0 修改内容大图显示加载方式，当点击内容大图时才实时加载并显示出大图。
// v1.1.0 性能优化，加载速度大幅提升。
// v1.0.0 针对maddawgjav.net网站的支持，支持方便浏览图片

// @downloadURL https://update.greasyfork.org/scripts/15855/maddawgjavnet%E6%8E%92%E7%89%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/15855/maddawgjavnet%E6%8E%92%E7%89%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//过滤文字单词的数组
var filterWordsArray = new Array(
    'H0930','C0930','ガチん娘！','HEYZO','Muramura','一本道','Pacopacomama','天然むすめ','カリビアンコム プレミアム','カリビアンコム','PPV','Real Street Angels','41Ticket',
    'GALAPAGOS','Mesubuta','1000人斬り','Tokyo Hot','AV志向','アジア天国','キャットウォーク ポイズン','G-AREA','Honnamatv','ABBY','エッチな4610','Zipang','Real-diva','H4610',
    '金8天国','av9898','エッチな4610','エッチな0930','15-daifuku','Mywife-No','ハメる','The 変態','人妻斬り','娘姦白書','1919gogo','HEYZO','ハメ撮りケンちゃん','HEYZO','HEYZO',
    '\\[FHD\\]','\\[HD\\]'
);

//不过滤用于判断截取字符位置的单词
var wordsArray = new Array(
    'S-Cute','Asiatengoku','Real-diva','Jukujo-club','\[julesjordan\]','\[colette\]','Mywife-No','Roselip','Zipang','HEYZO','1919gogo','\[DDF\] ','\[Wow\]','\[21members\]','Blacked','\[sexart\]','Heyzo'
);

//多文字过滤的月份字典定义,前为替换前字符，后为替换后字符
var replaceMonth = {
    "January" : "一月"
    , "February" : "二月"
    , "March": "三月"
    , "April" : "四月"
    , "May": "五月"
    , "June" : "六月"
    , "July": "七月"
    , "August" : "八月"
    , "September": "九月"
    , "October" : "十月"
    , "November": "十一月"
    , "December": "十二月"
};

//添加样式可覆盖原有css样式
GM_addStyle('#wrapper {margin: 0;width: initial;}');
GM_addStyle('#sidebar-border {position: absolute;float: left;width: 220px;background: #f2f2f2;border: 1px solid #ccc;}');
GM_addStyle('#sidebar {overflow: hidden;width: 220px;border: 1px solid #fff;padding: 0px;}');
GM_addStyle('#content {overflow: hidden;float: left;width: initial;padding: 0;margin-left: 223px;}');
GM_addStyle('.entry img {margin: auto;}');
GM_addStyle('.entry p {margin: 0 0 5px 0;}');
GM_addStyle('.post-info-top {border-top: 1px solid #ddd;line-height: 15px;color: #999;height: 15px;margin: 0 0 0;padding: 0 0;}');
GM_addStyle('.post-info-date {background-position: 0 -40px;float: right;}');

$("#footer-inside").remove();

document.addEventListener('DOMContentLoaded', function () {

    $("#sidebar-border").insertBefore("#content");

    // 过滤文字单词函数
    // param srcString 需过滤字符串
    // retunr 过滤后的字符串
    function filterWords(srcString){
        for(var i = 0; i < filterWordsArray.length ; i ++){
            srcString = srcString.replace(new RegExp(filterWordsArray[i],'ig'),"");
        }
        return srcString;
    }

    // 判断字符串是否包含单词字典
    // param srcString 需判断字符串
    // retunr true,false
    function hasWords(srcString){
        for(var i = 0; i < wordsArray.length ; i ++){
            if(wordsArray[i] !== ""){
                srcString = $.trim(srcString);
                if(srcString.split(" ")[0] === wordsArray[i]){
                    return true;
                }
            }
        }
        return false;
    }

    // 创建查找av番号的外链html内容元素P
    // param avCode av番号
    // return 外链html内容元素P
    function crtOutLink(avCode){
        var p = $(
            '<p style="text-align: center;color: blue;">'+
            '他站查找 ['+ avCode +']：'+
            '<a target="_blank" href="http://blogjav.net/?s='+ avCode +'" title="搜 '+ avCode +'" style="text-align: center;color: red;text-decoration: underline;">blogjav</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://javbest.net/?s='+ avCode +'" title="搜 '+ avCode +'" style="text-align: center;color: red;text-decoration: underline;">javbest</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://javpop.com/index.php?s='+ avCode +'" title="搜 '+ avCode +'" style="text-align: center;color: red;text-decoration: underline;">javpop</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '留种： '+
            '<a target="_blank" href="https://btso.pw/search/'+ avCode +'" title="搜 '+ avCode +'" style="text-align: center;color: red;text-decoration: underline;">btsow</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://sukebei.nyaa.se/?page=search&amp;cats=0_0&amp;filter=0&amp;term='+ avCode +'" title="搜 '+ avCode +'" style="text-align: center;color: red;text-decoration: underline;">sukebei.nyaa</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '推荐： '+
            '<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/18454" title="UserScript" style="text-align: center;color: red;text-decoration: underline;">blogjav.net脚本</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '</p>'
        )[0];
        return p;
    }

    // 创建查找av女优的外链html内容元素P
    // param womenName av女优名
    // return 外链html内容元素P
    function crtOutLinkByName(womenName){
        var p = $(
            '<p style="text-align: center;">'+
            '<a style="text-align: center;color: blue;text-decoration: none;">查找 ['+ womenName +']：</a>'+
            '<a target="_blank" href="http://maddawgjav.net/?s='+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;" rel="noreferrer">maddawjav</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://blogjav.net/?s='+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;" rel="noreferrer">blogjav</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://javbest.net/?s='+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;">javbest</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://javpop.com/index.php?s='+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;">javpop</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a style="text-align: center;color: blue;text-decoration: none;">查种：</a>'+
            '<a target="_blank" href="http://www.btio.pw/search/'+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;">btsow</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
            '<a target="_blank" href="http://sukebei.nyaa.se/?page=search&amp;cats=0_0&amp;filter=0&amp;term='+ womenName +'" title="搜 '+ womenName +'" style="text-align: center;color: red;text-decoration: underline;">sukebei.nyaa</a>'+
            '</p>'
        )[0];
        return p;
    }

    // 获取全域名
    function getHostName(url) {
        var e = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)'), matches = e.exec(url);
        return matches ? matches[1] : url;
    }

    // 获取后缀域名
    function getLastName(webName) {
        var array = webName.split(".");
        if(array.length === 3){
            var a = webName.indexOf('.');
            var lastName = webName.substring(a + 1, webName.length);
            return lastName;
        }
        else if(array.length === 2){
            return webName;
        }
    }

    function urlfilename(a) {
        var n1 = a.lastIndexOf('/') + 1;
        var n2 = a.lastIndexOf('.');
        a = a.substring(n1, n2);
        return a;
    }

    function urljpgid(a) {
        var n1 = a.lastIndexOf('/');
        var n2 = a.lastIndexOf('/')-9;
        a = a.substring(n1, n2);
        return a;
    }

    // 用于将原图替换目标图片，并且保持原图的显示宽高，显示目标图片为需要缓存的内容图片
    // param rawImg 原图对象
    // param rawImgW 原图宽度
    // param rawImgH 原图高度
    // param targetImgUrl 目标图url
    function replaceContImg(rawImg , rawImgW , rawImgH , targetImgUrl){
        var imgid = Math.random();
        var frameid = 'frameimg' + imgid;
        unsafeWindow['img'+imgid] = '<a href="javascript:void(0);" target="_blank"><img id="img" name="' + rawImgW + ','+rawImgH +'" src="'+targetImgUrl+'?hobby" style="max-width: ' + rawImgW + 'px; float: initial; clear: none;" title="点击可放大缩小 (图片正常时)"/></a>' +
            '<script>window.onload = function() {' +
            'var p_ifame = parent.document.getElementById(\''+frameid+'\');'+
            'var img = document.getElementById(\'img\');'+
            //'debugger;'+
            'p_ifame.name = img.naturalWidth+\',\'+img.naturalHeight; '+
            'img.style.width = (180/parseInt(img.naturalHeight))*parseInt(img.naturalWidth) + "px";'+
            'var tempH = ('+ rawImgW +'/parseInt(img.naturalWidth))*parseInt(img.naturalHeight);'+
            'if(tempH < '+ rawImgH +') img.style.height = tempH;'+
            'img.name = img.offsetWidth+\',\'+img.offsetHeight; '+
            'p_ifame.style.width = img.offsetWidth+"px";'+
            'p_ifame.style.height = img.offsetHeight+"px";'+
            //新img标签增加onclick事件
            'document.getElementById(\'img\').onclick = function(event){'+
            'event = event || window.event;'+
            //屏蔽到外部的onclick事件
            'event.cancelBubble = true;'+

            //debugger;
            'var p_ifame = parent.document.getElementById(\''+frameid+'\');'+
            //判断如果当前为关闭，需要展开
            'if(this.getAttribute("openFlag") !== \'1\'){ '+
            'p_ifame.style.maxWidth = "none";'+
            'p_ifame.style.maxHeight = "none";'+
            'p_ifame.style.width = p_ifame.name.split(",")[0]+"px";'+
            'p_ifame.style.height = p_ifame.name.split(",")[1]+"px";'+
            'p_ifame.style.clear = "both";'+
            //img的宽度设置
            'this.style.maxWidth = "none";'+
            'this.style.maxHeight = "none";'+
            'this.style.width = "";'+
            'this.style.height = "";'+
            //设置打开标识为1，已打开状态
            'this.setAttribute("openFlag","1");'+
            '}'+
            //当前展开，需要关闭
            'else{'+
            //chrome浏览器必须使用100px才生效
            'p_ifame.style.width = this.name.split(",")[0] + "px";'+
            'p_ifame.style.height = this.name.split(",")[1] + "px";'+
            'p_ifame.style.clear = "none";'+
            //img的宽度设置
            'this.style.width = this.name.split(",")[0];'+
            //设置打开标识为0，未打开状态
            'this.setAttribute("openFlag","0");'+
            //跳到本篇文章主题title的锚点
            'p_ifame.parentElement.parentElement.parentElement.scrollIntoView();'+
            //跳到标题的锚点
            //location.href = "#h-" + this.parentElement.parentElement.parentElement.nextElementSibling.id;
            //debugger;
            '}'+
            '};'+ //end onclick事件
            '}<'+'/script>';
        var targetImgIframe = '<iframe id="'+frameid+'" src="javascript:parent[\'img'+imgid+'\'];" scrolling="no" marginwidth="0" marginheight="0" style="max-width: none; float: left; clear: none;width:' + rawImgW +'px; height:' + rawImgH +'px;border: 1px solid #ddd;padding: 4px;"></iframe>';
        $(rawImg).replaceWith(targetImgIframe);
    }

    //删除帖子的第一张缩略图
    //param i:指定图片集合
    function delTOneImg(array){
        //帖子第一张主题图片集合
        var img_t_array = array;
        //帖子的第一张缩略图删除
        for (var index = 0; index < img_t_array.length; index++) {
            var img_t = img_t_array[index];
            //debugger;
            //主题图片靠左排版
            $(img_t).css('float','left');
            //帖子的第一张缩略图删除
            try{
                if(img_t.nextElementSibling.nextElementSibling.nextElementSibling.tagName === "A"){
                    $(img_t.nextElementSibling.nextElementSibling).remove();
                }
            }catch(e){}
        }
    }

    //以下同时替换多个字符串使用到的代码，如123-->abc,456-->xyz
    Array.prototype.each = function(trans) {
        for (var i=0; i<this.length; i++)
            this[i] = trans(this[i], i, this);
        return this;
    };
    Array.prototype.map = function(trans) {
        return [].concat(this).each(trans);
    };
    RegExp.escape = function(str) {
        return new String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    };
    function properties(obj) {
        var props = [];
        for (var p in obj) props.push(p);
        return props;
    }
    //过滤字典方法
    function filterDict(str,replacements){
        var regex = new RegExp(properties(replacements).map(RegExp.escape).join("|"), "g");
        str = str.replace(regex, function($0) { return replacements[$0]; });
        return str;
    }
    // end 替换多个字符串代码结束


    //debugger;
    var location = unsafeWindow.document.location;

    //子级iframe判断是否约定的Url
    if(typeof(location)!== "undefined" && location.href.indexOf('?url=maddawgjav.net') > -1){

        var jpg_id = urljpgid(location.pathname);
        var $jpg_id = $("#i"+jpg_id);
        var img_src = $jpg_id.attr("src");
        var img_pEle = $jpg_id[0].parentElement;
        //$jpg_id.remove();
        //debugger;
        $jpg_id.attr("src","http://maddawgjav.net/wp-content/themes/zbench.1.2.3/zbench/images/search-input-bg.gif");

        var $iframe = $(document.createElement("IFRAME"));
        $iframe.attr("width", "0");
        $iframe.attr("height", "0");
        //将问号后的.转换成%%  然后载入iframe的地址
        $iframe.attr("src", "http://maddawgjav.net/wp-login.php?"+img_src.replace(/\./g,"%%"));

        $(img_pEle).append($iframe);
    }
    //子级iframe的子级iframe判断是否约定的Url
    else if(typeof(location)!== "undefined" && location.href.indexOf('maddawgjav.net/wp-login.php') > -1){
        var jpg_id = urljpgid(location.search);
        var av_cd =$('#href'+jpg_id, window.parent.parent.document).get(0).parentElement.avcd;
        var av_name = $('#href'+jpg_id, window.parent.parent.document).get(0).parentElement.av_name;
        var href = location.search.substring(1,location.search.length).replace(/\%\%/g,".");
        $('#img'+jpg_id, window.parent.parent.document).attr("src",href );//"http://imagetwist.com/error.jpg?" +  + '??$@' + av_cd + "?$@" + av_name

        var $imgN = $($('#href'+jpg_id, window.parent.parent.document).get(0).firstElementChild);
        //debugger;
        //$hobbyimgN.src = href;
        $iframe = $('#iframe'+jpg_id, window.parent.parent.document);
        $iframe.attr("src", "");//释放资源
    }
    else{
        //debugger;


        //所有p标签的文字
        var p_tz_array = $("p[style='text-align: center']");
        var p_tz_array_2 = $("p[style='text-align: center;']");
        //debugger;
        for (var index = 0; index < p_tz_array.length; index++) {
            var p = p_tz_array[index];
            $(p).css('text-align','left');
        }
        for (var index = 0; index < p_tz_array_2.length; index++) {
            var p2 = p_tz_array_2[index];
            $(p2).css('text-align','left');
        }

        //上一页下一页默认弹出新页签处理
        var div_a_array = $("div[id='pagination'] a");
        //debugger;
        for (var index = 0; index < div_a_array.length; index++) {
            var page_a = div_a_array[index];
            $(page_a).attr('target','_blank');
        }

        //所有div帖子
        var div_tz_array = $("div[id^='post-']");
        for (var index = 0; index < div_tz_array.length; index++) {
            var div = div_tz_array[index];
            $(div).css('width','initial');
            $(div).find("img[class='alignnone']").parent("p[style='text-align: left;']").attr("id","h-"+div.id);
            $(div).find("img[class='alignnone aligncenter']").attr("id","h-"+div.id);

            // 包含日期的a元素
            var tz_date_a = $(div).find("span[class='post-info-date'] a")[0];
            // 替换a元素内容的月份文字
            tz_date_a.innerHTML = filterDict(tz_date_a.innerHTML,replaceMonth);

            // 获取文章的标题文字
            var titleStr = $(div).find("div[class='entry'] p[style='text-align: left;']")[0].innerHTML;
            // 过滤文字
            titleStr = filterWords(titleStr);
            // 获取av番号
            var code = ""
            //如果包含指定单词字符
            //debugger;
            if(hasWords(titleStr)){
                // 获取av番号
                code = titleStr.split(" ")[0] + " " + titleStr.split(" ")[1];
            }
            else{
                // 获取av番号
                code = titleStr.split(" ")[0];
            }
            // 将外链元素P插入帖子div元素内最后面
            if(code !== ""){
                $(div).append(crtOutLink(code));
            }
            else{
                $(div).append(crtOutLink(titleStr.split(" ")[1]));
            }



            // 如果存在文章内容
            //debugger;
            if($(div).find('p:contains(出演者)').length > 0){
                // 获取包含女优名称的文章内容的P元素
                var tz_content_p = $(div).find('p:contains(出演者)')[0];
                // 获取此P元素的文本
                var tz_content = tz_content_p.outerHTML;
                var cyz_start_idx = tz_content.indexOf('出演者');
                var cyz_end_index = tz_content.indexOf('<br>',cyz_start_idx);
                if(!(cyz_end_index > 0)){
                    cyz_end_index = tz_content.indexOf('</p>',cyz_start_idx);
                }
                //debugger;
                if(cyz_end_index > 0 & cyz_start_idx + 5 < cyz_end_index){
                    // 从P元素的文本中截取文章的女优名字
                    var names = tz_content.substring(cyz_start_idx + 5,cyz_end_index);

                    // 将创建的外链元素P插入到文章内容的P元素的前面
                    if(names !== '—-' & names.length > 0){
                        $(tz_content_p).before(crtOutLinkByName(names.split(" ")[0]));
                    }
                }
            }
        }

        //删除帖子的第一张缩略图
        delTOneImg($("img[class='alignnone']"));
        delTOneImg($("img[class='alignnone aligncenter']"));

        //所有p标签内图片
        var img_array = $("p[style='text-align: left;'] img");
        for (var index = 0; index < img_array.length; index++) {
            //TODO:foreach:2
            var img = img_array[index];
            var web_name = getHostName(img.src);
            var lastName = getLastName(web_name);
            //img元素没有title属性值时执行
            //if(typeof($(img).attr("title")) == "undefined" ){
            //    $(img).css("width","100px");
            //}

            $(img).css("max-width","none");
            //图片靠左排版
            $(img).css('float','left');
            //备份width
            img.name = "100";

            if (lastName === 'imagebam.com') {
                //TODO:javbest:imagebam.com
                var jpg_name = urlfilename(img.src);
                var jpg_id = jpg_name.substring(jpg_name.length-9,jpg_name.length);
                var url = 'http://www.imagebam.com/image/' + jpg_name ;// + "??$@" + av_cd + "?$@" + av_name
                //img.parentElement.href = url;
                img.parentElement.id = "href"+ jpg_id;
                img.id = "img"+ jpg_id;

                $(img.parentElement).attr("name",url);
                $(img.parentElement).attr("href","javascript:void(0);");
            }
            else if(lastName === 'pixhost.org'){
                $(img.parentElement).attr("href","javascript:void(0);");
                $(img.parentElement).attr("name",img.src.replace('thumbs','images').replace('t7','img7'));
                //img.src = img.src.replace('thumbs','images').replace('//t','//img');
                //showImg2(img);
            }
        }

        //所有内容大图数组对象
        var dimg_array = $("p[style='text-align: left;'] a img");
        for (var index = 0; index < dimg_array.length; index++) {
            //内容大图对象
            var dimg = dimg_array[index];
            //文章内容的DIV对象
            var div = $(dimg).parents('.entry')[0];
            //将dimg的父元素a整个追加到div元素内的最后（相当于移动）,实现的效果是内容大图都排在了文章文字的后面
            $(div).append(dimg.parentElement);
        }

        var dimg_array = $("div[class='entry'] a img");
        for (var index = 0; index < dimg_array.length; index++) {
            var dimg = dimg_array[index];
            //设置为原有小图的宽度
            dimg.name = '185,180';

            if(dimg.parentElement.name.indexOf('pixhost.org') > -1){
                var targetUrl = dimg.src.replace('thumbs','images').replace('//t','//img');
                replaceContImg(dimg,dimg.width,dimg.height,targetUrl);
                //showImg2(dimg);
            }
            else{
                //跨域名请求调用大图访问地址
                GM_xmlhttpRequest({
                    method: "GET",
                    //大图地址
                    url: dimg.parentElement.name,
                    headers: {
                        "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                        "Accept": "text/xml" // If not specified, browser defaults will be used.
                    },
                    onload: function(XMLHttpRequest) {
                        //alert("1111");
                        var bodyStr = XMLHttpRequest.responseText;
                        var new_img_src = bodyStr.substring(bodyStr.indexOf('<meta name="twitter:image" content="') + 36,bodyStr.indexOf('<meta name="twitter:url" content="')-9);
                        var n1 = new_img_src.lastIndexOf('/');
                        var n2 = new_img_src.lastIndexOf('/')-9;
                        var imgId = new_img_src.substring(n1, n2);
                        var img = document.getElementById('img'+ imgId);

                        //debugger;
                        //重新加载新img，替换原img
                        replaceContImg(img , img.name.split(",")[0] , img.name.split(",")[1] , new_img_src);
                    }
                });//end  GM_xmlhttpRequest
            }// end else
        }
    }
}, false);