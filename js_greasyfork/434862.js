// ==UserScript==
// @name       【龙笑天下】博客网站留言评论信息自动填充
// @namespace    https://www.ilxtx.com/automatically-fill-in-personal-information.html
// @version      2.2.0
// @description  博客网站留言评论自动填写个人信息方法
// @author       龙笑天
// @namespace     https://greasyfork.org/zh-CN/users/831228
// @homepage      https://greasyfork.org/zh-CN/scripts/434862
// @include     http://*/*
// @include     https://*/*
// @exclude    *://*/wp-admin/*
// @exclude    *://*/admin/*
// @exclude    *://*.aliyun.com/*
// @exclude    *://myssl.com*
// @exclude    *://*.alipay.com/*
// @exclude    *://*.taobao.com/*
// @exclude    *://*.alimama.com/*
// @exclude    *://*.tmall.com/*
// @exclude    *://*.qq.com/*
// @exclude    *://*.tencent.com/*
// @exclude    *://*.qcloud.com/*
// @exclude    *://*.tenpay.com/*
// @exclude    *://*.baidu.com/*
// @exclude    *://*.bing.com/*
// @exclude    *://*.iqiyi.com/*
// @exclude    *://*.jd.com/*
// @exclude    *://*.meituan.com/*
// @exclude    *://*.cloudflare.com/*
// @exclude    *://*.yundun.com/*
// @exclude    *://github.com/*
// @exclude    *://weibo.com/*
// @exclude    *://*.sina.com.cn/*
// @exclude    *://*.youku.com/*
// @exclude    *://*.bilibili.com/*
// @exclude    *://*.acfun.cn/*
// @exclude    *://douban.com/*
// @exclude    *://*.jd.com/*
// @exclude    *://*.huya.com/*
// @exclude    *://*.douyin.com/*
// @exclude    *://*.douyu.com/*
// @exclude    *://*.sohu.com/*
// @exclude    *://*.letv.com/*
// @exclude    *://*.toutiao.com/*
// @exclude    *://*.ixigua.com/*
// @exclude    *://*.kafan.cn/*
// @exclude    *://*.163.com/*
// @exclude    *://*.126.com/*
// @exclude    *://*.hupu.com/*
// @exclude    *://*.qidian.com/*
// @exclude    *://*.mi.com/*
// @exclude    *://*.360.cn/*
// @exclude    *://*.icbc.com.cn/*
// @exclude    *://*.ccb.com/*
// @exclude    *://*.abchina.com/*
// @exclude    *://*.cmbchina.com/*
// @exclude    *://*.boc.cn/*
// @exclude    *://*.bankcomm.com/*
// @exclude    *://*.psbc.com/*
// @exclude    *://*.pingan.com/*
// @exclude    *://*.citicbank.com/*
// @exclude    *://*.cib.com.cn/*
// @exclude    *://*.spdb.com.cn/*
// @exclude    *://*.cebbank.com/*
// @exclude    *://*.cmbc.com.cn/*
// @exclude    *://*.cgbchina.com.cn/*
// @exclude    *://*.unionpay.com/*
// @exclude    *://*.chinalife.com.cn/*
// @exclude    *://*.citi.com/*
// @exclude    *://*.hsbc.com/*
// @exclude    *://*.sc.com/*
// @exclude    *://*.google.com/*
// @exclude    *://*.google.hk/*
// @exclude    *://*.google.cn/*
// @exclude    *://*.apple.com/*
// @exclude    *://*.youtube.com/*
// @exclude    *://*.facebook.com/*
// @exclude    *://twitter.com/*
// @exclude    *://*.qianxin.com/*
// @exclude    *://*.mail-tester.com/*
// @exclude    *://*.openai.com/*
// @exclude    *://*.godaddy.com/*
// @exclude    *://*.lowendtalk.com/*
// @exclude    *://*.racknerd.com/*
// @exclude    *://*.colocrossing.com/*
// @exclude    *://*.namecheap.com/*
// @exclude    *://*.namesilo.com/*
// @exclude    *://*.expireddomains.net/*
// @exclude    *://*.mailu.io/*
// @exclude    *://*.amazon.cn/*
// @exclude    *://*.amazon.com/*
// @exclude    *://*.qiniu.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEX///////98f4EveJQEdKAAcakAcacAc6J7f4F/f4BtfYMnd5YDc6ENdJ43eJNRe4tLeo5wfoMzeJMAcqMcdppdfIhffIhce4knd5cbdppHeo4fdpoFc6JBeZAAc6MAcqUAc6QEc6IgdppvfoMTdZ1Jeo0Gc6EAcqQBdKFKeo0UdZ2Ef35vfYMcdZwfdZoAc6EAdKEAdKIZdZsZdZwHc6F+f38WdJ0cdZoCdKELdJ9Ve4t4foESdJ4ddpp7foAyeJQZdZoAcaQAc6UBc6JgfId/f3+Df355f4BGeo98foCJf31ufoNYe4lhfIcJc6EOdZ0PdJ4/eZAgdpk9eZEid5gNdZ4MdZ4QdZ4md5cld5cCdKBUe4qCf34YdZt9f4BmfYY0d5Qhdpgud5Y+eZAddpkBc6FnfYVofYZXe4pufYOGgH1jfYdwfYOEgH6FgH5rfYQAdKABc6Ard5U6eZFefIgud5QMdJ5Meo0DdKABc6NHeY58f4AfdpkCc6FpfYUGdJ8Fc6Bce4gRc6A3eJIBcqUod5Z7f4ABdKAedplGeo5Ieo1ifYcxeJMmdpkAcKlQe4xbe4gAcaUHc593f4GBgH9mfIYEc6EEc6AAc6AAcqIDc6B3foIAcagAcaZTe4sVdZsyeJMCc6ILdJ4weJRIeo54f4EkdpcWdZt9fn89eZAcdpmBf39ReotofYVlfIZtfYQCc6B9f38veJVAeo9Se4tbe4kXdZt9foAgdpiAf34DdJ8wd5ROe4xgfIgBcqNRe4wFc6FLeo02eJMLdJ18f39Neowmd5YPdJ0AcqFcfIg/eZFAeZBbfIhAeY9vfYQmdpcfdpgYdptFeo8IdJ8cdZkFdKBrfYU4eJIDc6IVdJ0bdZtMe40XdpsUdZxZfIoKdJ8edppbfIkud5UCc6NVfIqOgHtUe4sAcqZae4kueJVWe4pPeowpd5aCgH8AAAIBAQAOAABicRgZ9oD//gAAdOkAAAAAAAL2aAAAABkAAAAAABgAgAAAAAAAAAAAAAAAAACw+0DzAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAIzSURBVHjafVO/ixNBFP6KvUxzqSaNXJjNHUdmsZlZED1BQd1eRfyBC1cE3D5pQg4MBlH2KmEtEhMSjlwjXJVKDotDuEJbEcE7FIsr/DecN7Orq0Qfy/DtezPfe/O9eUDJvJUKY5UVD8tttVqg6uqSMK+V/87xv8JrdToo/IYxXxDV+kY5Xt8EmpIFuTHZBM43f8cJShVozXQYmkUHShrXhSJeu4hL0guY3gp0QB/T7LLxX7lalI9r19UNocOGYMYaQqvIBqK8fuDmrdu4IwLcrd67/wAPmYpdSNh12/20WFzkZCpxwObIsS+0lswy8nankIEcXSjLEynd2yH0eCfRqk/oCQbAU+CZKyUNU76bo7al8Gl5AWQvXWKt1ZDQSKlX44kBFWCKmdHIFrvHO2FK+uART3UyB/YzYtfmMuw1+WUaJuLA3i4JY7NVcMpCGxKryFxpx4BEabUwtRhmaVP0pMuRqpHdsCs6bB9VJikFFRmP31jmPj+ELV++NTEZZ1SkueZRklgKFXO0MkLvOrRhcmT5ujhmW/bcHvMwchryAd5/YMckFOkoY9Ul96wFuZgTyp5DTKSTGjUMVepS45DHPO8w7w9xULRb5swYqIR9tOgT1ZV7DalcfC4a0mauj0aEL8WTO8Ept438ahriWt3yT3FSKz9a/5tZxm16tN9tOc5devYk91nPPPr4zPo26+XB2FinNZ4JMzjyh9Vq7b+jt82XTGf0a2S96B/zjalvbPqH6yfbenh4ag/oaAAAAABJRU5ErkJggg==
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434862/%E3%80%90%E9%BE%99%E7%AC%91%E5%A4%A9%E4%B8%8B%E3%80%91%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E7%95%99%E8%A8%80%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/434862/%E3%80%90%E9%BE%99%E7%AC%91%E5%A4%A9%E4%B8%8B%E3%80%91%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E7%95%99%E8%A8%80%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';


    /////////// 评论信息配置 ///////////

    // 您的昵称
    var dr_gm_comment_author_name = '您的昵称';
    // 您的邮箱
    var dr_gm_comment_author_email = '您的邮箱';
    // 您的网址
    var dr_gm_comment_author_url = '您的网址';

    /////////// 评论信息配置 ///////////


    // 开启debug   true/false
    var dr_gm_debug = false;


    // 评论信息缺失不执行
    if ( dr_gm_comment_author_name==='' || dr_gm_comment_author_email==='' ) { return; }
    // 只能在顶层窗口中执行
    if ( window.top !== window.self ) { return; }


    // 开始执行
    setTimeout(dr_init, 1500);


    // 填充评论框
    function dr_js_autofill_commentinfos() {
        var lauthor = ["input#author","input[name='comname']","input#inpName","input[name='author']","input#ds-dialog-name","input#name","input[name='name']","input[name='nick']","input#comment_author", ".comment-form input[placeholder='昵称(必填)']","input.atk-name"],
        lmail =["input#mail","input#email","input[name='commail']","input#inpEmail","input[name='email']","input#ds-dialog-email","input[name='mail']","input#comment_email", ".comment-form input[type='email']","input.atk-email"],
        lurl =["input#url","input[name='comurl']","input#inpHomePage","input#ds-dialog-url","input[name='url']","input[name='website']","input#website","input[name='link']","input#comment_url", ".comment-form input[type='url']","input.atk-link"];

        for (var i = 0; i < lauthor.length; i++) {
            var author = document.querySelector(lauthor[i]);
            if (author != null) {
                author.value = dr_gm_comment_author_name;
                author.dispatchEvent(new Event('input'));
                author.dispatchEvent(new Event('change'));
                break;
            }
        }
        for (var j = 0; j < lmail.length; j++) {
            var mail = document.querySelector(lmail[j]);
            if (mail != null) {
                mail.value = dr_gm_comment_author_email;
                mail.dispatchEvent(new Event('input'));
                mail.dispatchEvent(new Event('change'));
                break;
            }
        }
        for (var k = 0; k < lurl.length; k++) {
            var url = document.querySelector(lurl[k]);
            if (url != null) {
                url.value = dr_gm_comment_author_url;
                url.dispatchEvent(new Event('input'));
                url.dispatchEvent(new Event('change'));
                break;
            }
        }
        return ! 1;
    }


    // init
    function dr_init(){
        var filled = false;

        var obj = dr_get_type();
        if ( dr_gm_debug ) {
            console.log( '【龙笑天下】GM脚本填充评论信息:', obj );
        }

        if( obj && obj.fill ){
            dr_js_autofill_commentinfos();
            filled = true;
        }
        console.log( '【龙笑天下】GM脚本填充评论信息'+( filled?'成功':'失败' )+':', obj.type );
    }
    // 判断评论程序类型
    function dr_get_type(){
        var obj = null;

        obj = dr_is_wordpress();
        if( obj ){
            return obj;
        }

        obj = dr_is_twikoojs();
        if( obj ){
            return obj;
        }

        obj = dr_is_artalkjs();
        if( obj ){
            return obj;
        }

        obj = dr_is_valinejs();
        if( obj ){
            return obj;
        }

        obj = dr_is_walinejs();
        if( obj ){
            return obj;
        }

        obj = dr_is_typecho();
        if( obj ){
            return obj;
        }

        obj = dr_is_zblog();
        if( obj ){
            return obj;
        }

        obj = dr_is_emlog();
        if( obj ){
            return obj;
        }

        return false;
    }


    // 检测评论程序
    // wordpress
    function dr_is_wordpress(){
        var ck_class = false,
           ck_meta = null,
           ck_resources = null,
           ck_includes = null,
           ck_api = null;

        // 检查body上的class
        var ck_body_obj = document.body;
        if( !ck_body_obj.classList.contains('logged-in') && ( ck_body_obj.classList.contains('wp-singular') || ck_body_obj.classList.contains('single') || ck_body_obj.classList.contains('page') ) ){
            ck_class = true;
        }

        // 检查meta生成器标签
        ck_meta = document.querySelector('meta[name="generator"][content*="WordPress"]');

        // 检测路径的资源引用
        ck_resources = document.querySelectorAll(`
            link[href*="/wp-content/"],
            script[src*="/wp-content/"],
            img[src*="/wp-content/"],
            style[src*="/wp-content/"]
        `);

        // 检测路径的资源引用
        ck_includes = document.querySelectorAll(`
            script[src*="/wp-includes/"],
            link[href*="/wp-includes/"]
        `);

        // 检测WordPress REST API
        ck_api = document.querySelector('link[href*="/wp-json/"]');

        // 综合判断
        var ret = ck_meta!== null ||
               ck_resources.length>0 ||
               ck_includes.length>0 ||
               ck_api!== null;

        if( dr_gm_debug ){
            console.log( '===== wordpress begin =====' );
            console.log( 'ck_class:', ck_class );
            console.log( 'ck_meta:', ck_meta );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_includes:', ck_includes );
            console.log( 'ck_api:', ck_api );
            console.log( 'ret:', ret );
            console.log( '===== wordpress end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'wordpress', fill:ck_class&&ret};
        }
        return false;
    }
    // typecho
    function dr_is_typecho(){
        // 检查meta生成器标签
        var ck_meta = document.querySelector('meta[name="generator"][content*="Typecho"]');

        // 检测路径的资源引用
        var ck_resources = document.querySelectorAll(`
            link[href*="/usr/themes/"],
            link[href*="/usr/plugins/"],
            script[src*="/usr/themes/"],
            script[src*="/usr/plugins/"]
        `);

        // 检查特有的全局变量
        var ck_var = typeof window.Typecho !== 'undefined';

        // 综合判断
        var ret = ck_meta !== null ||
               ck_resources.length > 0 ||
               ck_var;

        if( dr_gm_debug ){
            console.log( '===== typecho begin =====' );
            console.log( 'ck_meta:', ck_meta );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_var:', ck_var );
            console.log( 'ret:', ret );
            console.log( '===== typecho end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'typecho', fill:ret};
        }
        return false;
    }
    // ZBlog
    function dr_is_zblog() {
        // 检查meta生成器标签
        var ck_meta = document.querySelector('meta[name="generator"][content*="Z-Blog"]');

        // 检测路径的资源引用
        var ck_resources = document.querySelectorAll(`
            link[href*="/zb_users/"],
            link[href*="/zb_system/"],
            script[src*="/zb_users/"],
            script[src*="/zb_system/"]
        `);

        // 检查全局变量
        var ck_var = typeof window.ZBlog !== 'undefined';

        // 综合判断
        var ret = ck_meta !== null ||
               ck_resources.length > 0 ||
               ck_var;

        if( dr_gm_debug ){
            console.log( '===== zblog begin =====' );
            console.log( 'ck_meta:', ck_meta );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_var:', ck_var );
            console.log( 'ret:', ret );
            console.log( '===== zblog end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'zblog', fill:ret};
        }
        return false;
    }
    // Emlog
    function dr_is_emlog() {
        // 检查meta生成器标签
        var ck_meta = document.querySelector('meta[name="generator"][content*="Emlog"]');

        // 检测路径的资源引用
        var ck_resources = document.querySelectorAll(`
            link[href*="/content/templates/"],
            link[href*="/content/plugins/"],
            script[src*="/content/templates/"]
        `);

        // 4. 检查特有的全局变量
        var ck_var = typeof window.emlog !== 'undefined';

        // 综合判断
        var ret = ck_meta !== null ||
               ck_resources.length > 0 ||
               ck_var;

        if( dr_gm_debug ){
            console.log( '===== emlog begin =====' );
            console.log( 'ck_meta:', ck_meta );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_var:', ck_var );
            console.log( 'ret:', ret );
            console.log( '===== emlog end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'emlog', fill:ret};
        }
        return false;
    }
    // twikoo.js
    function dr_is_twikoojs() {
        // 检测路径的资源引用
        var ck_resources = document.querySelectorAll(`
            script[src*="twikoo.min.js"],
            script[src*="twikoo.js"],
            script[src*="twikoo.all.min.js"],
            script[src*="twikoo.all.js"],
            script[src*="jsdelivr.net/npm/twikoo/"],
            script[src*="unpkg.com/twikoo"],
            script[src*="staticfile.org/twikoo/"]
        `);

        // 检测容器元素
        var ck_container = document.querySelector('#twikoo-wrap');

        // 检测全局对象
        var ck_var = typeof window.twikoo !== 'undefined';

        // 综合判断
        var ret = ck_resources.length > 0 ||
               ck_container!==null ||
               ck_var;

        if( dr_gm_debug ){
            console.log( '===== twikoo.js begin =====' );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_container:', ck_container );
            console.log( 'ck_var:', ck_var );
            console.log( 'ret:', ret );
            console.log( '===== twikoo.js end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'twikoo.js', fill:ret};
        }
        return false;
    }
    // artalk.js
    function dr_is_artalkjs() {
        // 检测script标签引用
        var ck_resources = Array.from(document.scripts).some(script => {
            return script.src.includes('artalk.js') ||
                   script.src.includes('artalk.min.js') ||
                   script.src.includes('artalk/dist/') ||
                   script.src.includes('jsdelivr.net/npm/artalk');
        });

        // 检测容器元素
        var ck_container = document.querySelector('#artalk-wrap');

        // 检测全局对象
        var ck_var = typeof window.Artalk !== 'undefined';

        // 检测初始化代码特征
        var ck_initcode = document.documentElement.innerHTML.includes('Artalk.init({');

        // 综合判断
        var ret = ck_resources ||
               ck_container !== null ||
               ck_var ||
               ck_initcode;

        if( dr_gm_debug ){
            console.log( '===== artalk.js begin =====' );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_container:', ck_container );
            console.log( 'ck_var:', ck_var );
            console.log( 'ck_initcode:', ck_initcode );
            console.log( 'ret:', ret );
            console.log( '===== artalk.js end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'artalk.js', fill:ret};
        }
        return false;
    }
    // valine.js
    function dr_is_valinejs() {
        // 检测script标签引用
        var ck_resources = document.querySelectorAll(`
            script[src*="/Valine.min.js"],
            script[src*="/Valine.js"],
            script[src*="/waline.min.js"],
            script[src*="/waline.js"]
        `);

        // 检测容器元素
        var ck_container = document.querySelector('#vcomments');

        // 检测全局对象
        var ck_var = typeof window.Valine !== 'undefined';

        // 检测初始化代码特征
        var ck_initcode = document.documentElement.innerHTML.includes('new Valine({');

        // 综合判断
        var ret = ck_resources.length>0 ||
               ck_container !== null ||
               ck_var ||
               ck_initcode;

        if( dr_gm_debug ){
            console.log( '===== valine.js begin =====' );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_container:', ck_container );
            console.log( 'ck_var:', ck_var );
            console.log( 'ck_initcode:', ck_initcode );
            console.log( 'ret:', ret );
            console.log( '===== valine.js end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'valine.js', fill:ret};
        }
        return false;
    }
    // waline.js
    function dr_is_walinejs() {
        // 检测路径的资源引用
        var ck_resources = document.querySelectorAll(`
            link[href*="/waline.css"],
            script[src*="/waline.js"],
            script[src*="/waline.min.js"],
            script[src*="/waline.umd.js"]
        `);

        // 检测容器元素
        var ck_container = document.querySelector('#waline-comments');

        // 检测全局对象
        var ck_var = typeof window.Waline !== 'undefined';

        // 检测初始化代码特征
        var ck_initcode = document.documentElement.innerHTML.includes('Waline.init({');

        // 综合判断
        var ret = ck_resources.length>0 ||
               ck_container !== null ||
               ck_var ||
               ck_initcode;

        if( dr_gm_debug ){
            console.log( '===== waline.js begin =====' );
            console.log( 'ck_resources:', ck_resources );
            console.log( 'ck_container:', ck_container );
            console.log( 'ck_var:', ck_var );
            console.log( 'ck_initcode:', ck_initcode );
            console.log( 'ret:', ret );
            console.log( '===== waline.js end =====' );
        }

        // 返回
        if ( ret ) {
            return {type:'waline.js', fill:ret};
        }
        return false;
    }

})();
