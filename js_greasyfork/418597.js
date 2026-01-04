// ==UserScript==
// @name         网易美化
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  隐藏网易邮箱广告，隐藏网易新闻推荐、新闻内容居中显示
// @author       AN drew
// @match        *://*.163.com/*
// @match        *://*.126.com/*
// @match        *://*.yeah.net/*
// @exclude      https://music.163.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418597/%E7%BD%91%E6%98%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418597/%E7%BD%91%E6%98%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.host=='dy.163.com' || window.location.href.indexOf('www.163.com/news') > -1)
    {
        //内容居中
        GM_addStyle(`#contain{ display:flex; justify-content:center;}
#container{display:flex; justify-content:center;}
.post_columnad_top{ display: none!important;}
.post_columnad_mid{ display: none!important;}
.post_columnad_btm{ display: none!important;}
/*.post_body{margin-left:-170px;}*/
/*.post_statement{margin-left:-170px;}*/
/*#tie{margin-left:-170px;}*/
.post_content#content{padding-left:0px!important}`);

        setInterval(()=>{
            if(!$('.post_top').hasClass('post_top_fixed')) //分享按钮居左
            {
                $('.post_top').addClass('post_top_fixed');
            }

            $('.post_side').hide(); //隐藏侧边栏
            $('.newsapp-qrcode').hide(); //隐藏二维码
            $('.post_next').hide(); //隐藏下一篇
            $('.post_recommends').hide(); //隐藏推荐

            $('.ntes-nav-mobile-title').hide(); //隐藏移动端
            $('.ntes-nav-select-title-lofter').hide(); //隐藏严选
            $('.ntes-nav-select-title-money').hide(); //隐藏支付
            $('.ntes-nav-select-title-cart').hide(); //隐藏电商
        },1);
    }
    else
    {
        //隐藏网易广告
        GM_addStyle(`.gWel-bottom{ display: none!important;}
.post_columnad_top{ display: none!important;}
.post_columnad_mid{ display: none!important;}
.post_columnad_btm{ display: none!important;}
#module-float-ask-price {display: none!important;}
.houseJrtt {display: none!important;}
.commend-list {display: none!important;}
.post_side {display: none!important;}
.newsapp-qrcode {display: none!important;}
.post_next {display: none!important;}
.post_recommends {display: none!important;}
#epContentRight {display: none!important;}
.newsapp-qrcode {display: none!important;}
#post_recommend {display: none!important;}
.post_next_post_wrap {display: none!important;}
.ntes-nav-mobile-title {display: none!important;}
.ntes-nav-select-title-lofter {display: none!important;}
.ntes-nav-select-title-money {display: none!important;}
.ntes-nav-select-title-cart {display: none!important;}
.gallery-tie-right {display: none!important;}
.p-w-top {display: none!important;}
.related_article {display: none!important;}
.tN0.nui-closeable {display: none!important;}
.tI0.txt-info {display: none!important;} `);

        if(window.location.href.indexOf('auto.163.com') > -1) //汽车频道
        {
            //内容居中
            GM_addStyle(`.post_main{ margin-left:170px;}`);
        }
        else
        {
            //内容居中
            GM_addStyle(`#contain{ display:flex; justify-content:center;}
#container{display:flex; justify-content:center;}`);
        }

        if(window.location.href.indexOf('house.163.com') > -1) //房产频道
        {
            //评论居中
            GM_addStyle(`#post_comment_area{ margin-left:-170px;}`);
        }
        else if(window.location.href.indexOf('home.163.com') > -1) //家居频道
        {
            //内容居中、评论居中
            GM_addStyle(`.post_content#content{padding-left:0px!important}
#post_comment_area{ margin-left:-170px;}`);
        }
        else
        {
            //内容居中
            GM_addStyle(`.post_content#content{padding-left:0px!important}`);
        }

        //内容居中、评论居中
        GM_addStyle(`.post_content.post_area{ display:flex; justify-content:center;}
/*.post_body{margin-left:-170px;}*/
/*.post_statement{margin-left:-170px;}*/
/*#tie{margin-left:-170px;}*/
._xhi4tc4xf89 {display: none!important;}
#endText{margin-left:-170px;}
.gallery-tie-main{margin-right:0px;}`);

        if(window.location.href.indexOf('www.163.com/renjian') > -1)
        {
            GM_addStyle(`#endText{margin-left:0px;}`);
        }

        var parent = document.getElementById('epContentLeft');
        parent && parent.insertBefore(document.querySelector('.post_crumb'),parent.childNodes[0]); //移动目录树到epContentLeft

        if(document.querySelector('div.post_content.post_area.clearfix') && document.querySelector('div.post_content.post_area.clearfix').childNodes[3].className=='clearfix') //删除原先目录树所在clearfix
        {
            document.querySelector('div.post_content.post_area.clearfix').removeChild(document.querySelector('div.post_content.post_area.clearfix').childNodes[3])
        }

        setInterval(()=>{
            if(document.getElementsByClassName('post_topshare_wrap')[0] && document.getElementsByClassName('post_topshare_wrap')[0].className.indexOf('post_topshare_wrap_fixed') == -1) //分享按钮居左
            {
                document.getElementsByClassName('post_topshare_wrap')[0].className='post_topshare_wrap post_topshare_wrap_fixed';
            }
            if(document.querySelector('.post_top') && document.querySelector('.post_top').className.indexOf('post_top_fixed') == -1) //分享按钮居左
            {
                document.querySelector('.post_top').className='post_top post_top_fixed';
            }

            document.querySelector('.post_comment_toolbar.post_comment_toolbarfix') && (document.querySelector('.post_comment_toolbar.post_comment_toolbarfix').className='post_comment_toolbar'); //固定跟帖

        },1);
    }
})();
