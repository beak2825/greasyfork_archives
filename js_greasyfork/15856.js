// ==UserScript==
// @name         javbest.net排版脚本
// @namespace    http://greasyfork.org/zh-CN/users/25794
// @version      1.1.2
// @description  javbest.net网站重新排版，浏览图片、搜索相关内容更方便，你懂的
// @author       Hobby
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @include      http://javbest.net*
// @grant        GM_xmlhttpRequest


// @copyright    hobby 2016-03-20

// 交流QQ群：273406036
// 内地用户推荐Chrome + XX-Net(代理) + Proxy SwitchyOmega（扩展）的环境下配合使用。

// v1.1.2 推荐blogjav.net脚本 https://greasyfork.org/zh-CN/scripts/18454
// V1.1.1 内容大图增加鼠标点击提示效果
// V1.1.0 修改排版，加入批量默认加载内容大图，点击内容缩略图可放大显示
// V1.0.0 针对javbest.net网站的支持，更新支持方便浏览图片

// @downloadURL https://update.greasyfork.org/scripts/15856/javbestnet%E6%8E%92%E7%89%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/15856/javbestnet%E6%8E%92%E7%89%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';



// 取文件名不带后缀
function GetFileNameNoExt(filepath) {
    if (filepath !== "") {
        var names = filepath.split("\\");
        var pos = names[names.length - 1].lastIndexOf(".");
        return names[names.length - 1].substring(0, pos);
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

// 获取全域名
function getHostName(url) {
    // scheme : // [username [: password] @] hostame [: port] [/ [path] [?
    // query] [# fragment]]*/
    var e = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)'), matches = e
    .exec(url);

    return matches ? matches[1] : url;
}

// 获取后缀域名
function getLastName(webName) {
    var array = webName.split(".");
    if(array.length === 3)
    {
        var a = webName.indexOf('.');
        var lastName = webName.substring(a + 1, webName.length);
        return lastName;
    }
    else if(array.length === 2)
    {
        return webName;
    }
}

//添加 CSS 样式
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//addGlobalStyle('p { font-size: large ! important; }');

// 获取AV片编码   num:拼接个数
function getAVCode(url,num) {
    var array = url.split('/');
    var s = array[array.length-2];
    var code_array = s.split('-');
    if(num === 2){
        return code_array[0]+'-'+code_array[1];
    }
    else if(num === 3){
        return code_array[0]+'-'+code_array[1]+'-'+code_array[2];
    }
    else{
        return code_array[0]+'-'+code_array[1];
    }
}

function getAVCodeToSearch(url,num) {
    var array = url.split('/');
    var s = array[array.length-2];
    var code_array = s.split('-');
    if(num === 2){
        return code_array[0]+' '+code_array[1];
    }
    else if(num === 3){
        return code_array[0]+' '+code_array[1]+' '+code_array[2];
    }
    else{
        return code_array[0]+' '+code_array[1];
    }
}

function showImg(i){
    url = i.src;
    width = i.width;
    height = i.height;
    var imgid = Math.random(),
        frameid = 'frameimg' + imgid;
    window['img'+imgid] = '<img id="img" src=\''+url+'?hobby\' />' +
        '<script>window.onload = function() {' +
        ' parent.document.getElementById(\''+frameid+'\').height = document.getElementById(\'img\').height+\'px\'; ' +
        ' parent.document.getElementById(\''+frameid+'\').width = document.getElementById(\'img\').width+\'px\'; ' +
        '}<'+'/script>';
    img_r = '<iframe id="'+frameid+'" src="javascript:parent[\'img'+imgid+'\'];" frameBorder="0" height="' +height+ '" scrolling="no" width="'+width+'"></iframe>';
    $(i).replaceWith(img_r);
}

function showImg2(i){
    url = i.src;
    width = 1280;
    height = 2691;
    var imgid = Math.random(),
        frameid = 'frameimg' + imgid;
    window['img'+imgid] = '<img id="img" src=\''+url+'?hobby\' />' +
        '<script>window.onload = function() {' +
        ' parent.document.getElementById(\''+frameid+'\').height = document.getElementById(\'img\').height+\'px\'; ' +
        ' parent.document.getElementById(\''+frameid+'\').width = document.getElementById(\'img\').width+\'px\'; ' +
        '}<'+'/script>';
    img_r = '<iframe id="'+frameid+'" src="javascript:parent[\'img'+imgid+'\'];" width="'+width+'" height="' +height+ '" frameBorder="0" scrolling="no" border="0" marginwidth="0" marginheight="0"></iframe>';
    $(i).replaceWith(img_r);
}

function add_search_link(Element,av_code,av_code_s){
    var search = document.createElement('a');
    search.href = 'http://sukebei.nyaa.eu/?page=search&cats=0_0&filter=0&term=' + av_code_s;
    search.target = '_blank';
    $(search).css('color','red');

    search.appendChild(document.createTextNode(decodeURIComponent(av_code) + ' in nyaa Torrent')); 
    Element.appendChild(search);

    Element.innerHTML = Element.innerHTML + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    var search = document.createElement('a');
    search.href = 'http://bitsnoop.com/search/all/' + av_code_s;
    search.target = '_blank';
    $(search).css('color','red');
    search.appendChild(document.createTextNode(decodeURIComponent(av_code) + ' in bitsnoop Torrent')); 
    Element.appendChild(search);

    Element.innerHTML = Element.innerHTML + '<br>';

    var search = document.createElement('a');
    search.href = 'http://www.dmm.co.jp/search/=/searchstr=' + av_code_s + '/';
    search.target = '_blank';
    $(search).css('color','red');
    search.appendChild(document.createTextNode(decodeURIComponent(av_code) + ' in dmm.co.jp')); 
    Element.appendChild(search);

    Element.innerHTML = Element.innerHTML + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    var search = document.createElement('a');
    search.href = 'http://www.baidu.com/s?wd=' + av_code;
    search.target = '_blank';
    $(search).css('color','red');
    search.appendChild(document.createTextNode(decodeURIComponent(av_code) + ' in baidu.com')); 
    Element.appendChild(search);

    Element.innerHTML = Element.innerHTML + '<br>';

    var search = document.createElement('a');
    search.href = 'http://www.google.co.jp/search?hl=ja&q=' + av_code;
    search.target = '_blank';
    $(search).css('color','red');
    search.appendChild(document.createTextNode(decodeURIComponent(av_code) + ' in google.jp')); 
    Element.appendChild(search);

    return Element;
}

function getCookie(name) {
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start == -1)
        return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1)
        end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
} 

function setCookie(name, value, expires_days, domain, path, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    var expires;
    if (expires_days) {
        expires = expires_days * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '='
        + escape(value)
        + ((expires) ? ';expires=' + expires_date.toGMTString() : '')
        + // expires.toGMTString()
        ((path) ? ';path=' + path : '')
        + ((domain) ? ';domain=' + domain : '')
        + ((secure) ? ';secure' : '');
}

function deleteCookie(name, domain, path) {
    if (getCookie(name))
        document.cookie = name + '=' + ((path) ? ';path=' + path : '')
            + ((domain) ? ';domain=' + domain : '')
            + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
} 

function addSearchAvLink(imgObj,av_code,av_name){

    var div = document.createElement('div');
    div.id = "hobbyp0";
    av_code_s = av_code.replace('-',' ');
    div = add_search_link(div,av_code,av_code_s);

    div.innerHTML = div.innerHTML + '<br>';
    var p = document.createElement('p');
    $(p).css('color','blue');
    $(p).text("文件名 : " + decodeURIComponent(av_name));
    div.appendChild(p);

    $(div).css("font-size","12px");
    $(div).css("font-family","Verdana,Arial,Helvetica,sans-serif");

    document.body.appendChild(div);
    if(getUrl().indexOf('http://www.imagebam.com/image/') > -1 ){
        $("#hobbyp0").insertBefore("#banner_top");
    }
    else
    {
        $(imgObj).insertAfter("#hobbyp0");
    }
    $(document).attr("title",decodeURIComponent(av_name));
}

function getUrl(){
    var url = location.href;
    var n = url.lastIndexOf('/') + 1;
    url = url.substring(0, n);
    return url;
}
//debugger;

// 程序执行代码开始
// javbest.net网站;
var location = unsafeWindow.document.location;

if (location.href === "http://javbest.net/" || location.href.indexOf('javbest.net/page/') > -1 || location.href.indexOf('javbest.net/tag/') > -1 ||
    location.href.indexOf("http://javbest.net/category") > -1 || location.href.indexOf("javbest.net/?s=") > -1) {
    //TODO:javbest.net
    $("#content-bg").css('width','100%');  //2.0
    //$($(".all").get(0)).css('width','100%');
    //DIV移到最左边
    $("#sidebar").css('float','left');
    $("#sidebar").insertBefore("#left-side");

    $("#left-side").css('float','left');
    $("#left-side").css('width','');
    addGlobalStyle('.post-content {width: 1000px;color: #000000;font-family: "Arial",sans-serif;font-size: 15px;}');
    addGlobalStyle('.post-content img {max-width: none;text-align: center;}');
    addGlobalStyle('.post-content p {padding: 5px 0px 0px 0px;}');

    //$($(".post-content").get(0)).css('width','1000px');

    var img_array = $("div[class='left-side-padding'] a img");
    for (var index = 0; index < img_array.length; index++) {//
        var img = img_array[index];
        var web_name = getHostName(img.src);
        var lastName = getLastName(web_name);

        if(lastName === 'imgclick.net'){
            //debugger;
            $(img).css('width','71px');
            //img.src = img.src.replace('_t','');
            //var img = this.firstChild;
            $(img.parentElement).removeAttr("target");
            img.parentElement.href = "javascript:void(0);";
            //重新插入img新标签，在原img的前面
            img.insertAdjacentHTML('beforeBegin', '<img id="img'+ index +'" src="'+ img.src.replace('_t','') +'" border="0" style="width: 71px;" openflag="0">');
            var a_element = img.parentElement;
            //删除原img标签
            img.parentNode.removeChild(img);

            var imgN = $('#img'+index)[0];
            //新img标签增加onclick事件
            imgN.onclick = function(event){
                //debugger;
                event = event || window.event;
                //屏蔽到外部的onclick事件
                event.cancelBubble = true;

                if(this.getAttribute("openflag") !== '1'){ 
                    this.style.maxWidth = "none";
                    this.style.width = "";
                    this.setAttribute("openflag","1");
                }
                else{
                    //chrome浏览器必须使用71px才生效
                    this.style.width = "71px";
                    this.setAttribute("openflag","0");
                }
            };
        }
        else{
            $(img).css("max-width","none");
        }
    }
}

/**else if(location.hostname === 'imagetwist.com'){
    var img = document.body.getElementsByTagName("img")[0];
    var img_url = location.search.substring(1,location.search.length);
    img.src = img_url;
    if(location.href.indexOf('##@') <= -1){
        addSearchAvLink(img,img_url.split("?$@")[1],img_url.split("?$@")[2]);
    }
    showImg2(img);
}

else if(location.hostname === 'imgchili.com'){
    var img = document.body.getElementsByTagName("img")[0];
    var img_url = location.search.substring(1,location.search.length);
    img.src = img_url;
    showImg2(img);
    scaleonload();
}

else if (location.hostname === "javarchive.com"){
    var img_array = $(".post-content p a img");
    for (var index = 0; index < img_array.length; index++) {
        var img = img_array[index];
        img.src = img.src.replace('_thumb.png','.jpg');
        img.parentElement.href = img.src;
        img.parentElement.target = '_blank';
    }
}

else if(location.hostname === "sukebei.nyaa.eu"){
    var b_array = $("img[alt='Image']");
    //debugger;
    for (var index = 0; index < b_array.length; index++) {
        var a = b_array[index];
        var lastName = getLastName(getHostName(a.src));
        //a.parentElement.href = '#';
        if (lastName === 'imagetwist.com') {//防盗链，显示异常
            a.parentElement.target = '_blank';
            a.src = a.src.replace('th','i');
            showImg(a);
        }
        else if(lastName === 'imageporter.com' || lastName === 'imagekitty.com'|| lastName === 'imagecherry.com'){
            a.src = a.src.replace('_t','');
            showImg(a);
        }
        else if(lastName === 'imgchili.com'){
            if(a.src.indexOf("pl.jpg") > 0){
                a.src = a.src.replace('/t','/i');
                showImg(a);
            }
            else{//防盗链，显示异常
                a.parentElement.target = '_blank';
                //a.parentElement.href = "http://imgchili.com/theme/images/hotlink.png?" + a.src.replace('/t','/i');
            }
        }
        else if(lastName === 'imgrill.com' || lastName === 'imgonion.com'){
            a.src = a.src.replace('/small','/big');
            showImg(a);
        }
    }
}

else if(location.hostname === "www.avfantasy.com"){
    (function ($) {
        //debugger;
        var div = $(".TabbedPanelsContentGroup div")[0];
        var src = $("div[class='list-cover'] img")[0].src;
        var fileName = urlfilename(src);
        var av_code = fileName.replace('DVD1','');

        var a = document.createElement('a');
        a.href = '#title';
        var img = document.createElement('img');
        img.src = 'http://imgs02.avfantasy.com/new/screen_shot/' + fileName + '.jpg';
        img.border = '0';
        a.appendChild(img);

        $(div).prepend(a);

        var a_array = $(".list-cover a");
        for (var index = 0; index < a_array.length; index++) {
            var a1 = a_array[index];
            a1.target = '_blank';
        }
    })(jQuery);
}

else if(location.hostname === "www.hotavxxx.com"){
    var img_array = $("img[src*='imgchili.com']");
    for (var index = 0; index < img_array.length; index++) {
        var img = img_array[index];
        img.parentElement.href = "http://imgchili.com/theme/images/hotlink.png?" + img.src.replace('/t','/i');
    }
}

else if(location.hostname === "t66y.com"){
    var img_array = $("img[align='absmiddle']");
    for (var index = 0; index < img_array.length; index++) {
        var img = img_array[index];
        var a = img.parentElement;
        a.href = a.href.replace('http://www.viidii.com/?','').replace(new RegExp('______',"gm"),'.');
    }
    var img_array = $("img[align='top']");
    for (var index = 0; index < img_array.length; index++) {
        var img = img_array[index];
        var a = img.parentElement;
        a.href = a.href.replace('http://www.viidii.com/?','').replace(new RegExp('______',"gm"),'.');
    }
}

else if(location.hostname === "bfxzw.com"){
    $("#immeI").remove();
    $("form").removeAttr("onsubmit");
}

else if(location.hostname === "www.rmdown.com"){
    $($("input[type='submit']")[0]).removeAttr("onclick");
}

else if(location.hostname === "www.dmm.co.jp"){				
    //debugger;
    if($("li[class='first'] a")[0]){
        $("li[class='first'] a")[0].href = "http://www.dmm.co.jp/top/";
    }
    $("#welcome").remove();
}**/	
