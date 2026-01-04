// ==UserScript==
// @name         Stylish（Userstyles.org）美化
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  隐藏广告，页面汉化（部分完成）
// @author       AN drew
// @match        https://userstyles.org/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407425/Stylish%EF%BC%88Userstylesorg%EF%BC%89%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407425/Stylish%EF%BC%88Userstylesorg%EF%BC%89%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

function getUTC8 (datetime) {
    let month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return (datetime.getFullYear() + "/" + month + "/" + date );
}

function conversion(installs){
    let f = parseFloat(installs);
    if(installs.indexOf('k') > -1 || installs.indexOf('K') > -1)
    {
        if(f>0 && f<10)
            return f*1000;
        else
            return new Number(f*0.1).toFixed(2)+'万';
    }
    else if(installs.indexOf('m') > -1 || installs.indexOf('M') > -1)
    {
        if(f>0 && f<100)
            return new Number(f*100).toFixed(2)+'万';
        else if(f>=100 && f<1000)
            return new Number(f*0.01).toFixed(2)+'亿';
    }
    else return installs;
}

(function() {
    'use strict';

    let translation = new Map();
    translation.set('Home','首页');
    translation.set('home','首页');
    translation.set("Editor's Choice",'精选样式');
    translation.set('Most Popular','最热样式');
    translation.set('Most Popular Styles','最热样式');
    translation.set('Newest Styles','最新样式');
    translation.set('Recently Updated','近期更新');
    translation.set('TOP STYLED SITES','样式排行榜');
    translation.set('Baidu','百度');
    translation.set('Baidu Themes & Skins','百度');
    translation.set('Qq','腾讯');
    translation.set('Qq Themes & Skins','腾讯');
    translation.set('Google','谷歌');
    translation.set('Google Themes & Skins','谷歌');
    translation.set('Sina','新浪');
    translation.set('Sina Themes & Skins','新浪');
    translation.set('Weibo','微博');
    translation.set('Weibo Themes & Skins','微博');
    translation.set('Taobao','淘宝');
    translation.set('Taobao Themes & Skins','淘宝');
    translation.set('Youku','优酷');
    translation.set('Youku Themes & Skins','优酷');
    translation.set('Youtube','油管');
    translation.set('Youtube Themes & Skins','油管');
    translation.set('Yahoo','雅虎');
    translation.set('Yahoo Themes & Skins','雅虎');
    translation.set('Wikipedia','维基百科');
    translation.set('Wikipedia Themes & Skins','维基百科');
    translation.set('STYLE TYPES','样式类型');
    translation.set('Site Styles','网页样式');
    translation.set('Website Themes & Skins','网页样式');
    translation.set('Android Styles','手机样式');
    translation.set('Global Styles','全局样式');
    translation.set('Global Themes & Skins','全局样式');
    translation.set('Website','网页');
    translation.set('Android','手机');
    translation.set('Create New Style','新建样式');
    translation.set('Create Style','新建样式');
    translation.set('FORUM','论坛');
    translation.set('My Account','个人中心');
    translation.set('Account','个人中心');
    translation.set('Styles','我的样式');
    translation.set('Create new style','新建样式');
    translation.set('Change details','修改个人信息');
    translation.set('Change login methods','修改密码');
    translation.set('Change login methods','修改密码');
    translation.set('Create a widget displaying my styles','生成展示代码');
    translation.set('Discussions on my styles','我的样式讨论');
    translation.set('Logout','退出');
    translation.set('Edit','编辑');
    translation.set('Delete','删除');
    translation.set('Stats','统计');
    translation.set('Style type','样式类型');
    translation.set('Updated','更新时间');
    translation.set('Installs (week)','周安装量');
    translation.set('Installs (total)','总安装量');
    translation.set('Average rating','平均评分');
    translation.set('Most recent discussion','最近讨论');
    translation.set('EYE PROTECT','护眼模式');
    translation.set('DARK BACKGROUND','夜间模式');
    translation.set('CUSTOM BACKGROUND','自定义背景');
    translation.set('HOT ENTRIES','热门样式');
    translation.set('Customize any website to make it look andfeel anyway you want.','将任意网站变成你想要的样子');
    translation.set('Install for Chrome','安装Chrome插件');
    translation.set('See More','更多');
    translation.set('Weekly Installs','周安装量');
    translation.set('Rating','评分');
    translation.set('Discussions','讨论');
    translation.set('WEB','网页');
    translation.set('Web','网页');
    translation.set('ANDROID','手机');
    translation.set('Contact','联系我们');
    translation.set('Help','帮助');
    translation.set('Terms of use','使用条款');
    translation.set('Privacy Policy','隐私政策');
    translation.set('Copyright Notice','版权声明');
    translation.set('All Categories','所有分类');
    translation.set('by','作者: ');
    translation.set('Share this style','分享:');
    translation.set('Information:','样式简介');
    translation.set('Author','作者');
    translation.set('License','开源协议');
    translation.set('Date Created','创建时间');
    translation.set('Last Updated','更新时间');
    translation.set('Installs this week','周安装量');
    translation.set('Total installs','总安装量');
    translation.set('Applies to:','适配网站');
    translation.set('Description:','样式描述');
    translation.set('Notes from latest update:','更新说明');
    translation.set('Archive this Style','删除样式');
    translation.set('Stats','统计');
    translation.set('Edit','编辑');
    translation.set('Install Style','安装样式');
    translation.set('Please wait...','代码加载中，请稍候...');
    translation.set('Discussion:','讨论');
    translation.set('Send Feedback','发送反馈');
    translation.set('Display name','用户名');
    translation.set('E-mail','邮箱');
    translation.set('Display e-mail?','是否公开邮箱');
    translation.set('About you','个人简介');
    translation.set('Homepage','个人网站');
    translation.set('PayPal e-mail','PayPal支付邮箱');
    translation.set('Default License','默认开源协议');
    translation.set('Which type of style do you want to create?','您想创建哪种类型的样式?');
    translation.set('Web Style','网页样式');
    translation.set('Android Style','手机样式');
    translation.set('Create a style for any website using CSS and share it with the Stylish community.\n','为任意网站创建CSS样式，并与Stylish社区分享。');
    translation.set('Create an Android style using a visual editor and share it with Stylish’s app users.','使用可视化编辑器创建手机样式，并与Stylish APP用户分享。');
    translation.set('Create Web Style','创建网页样式');
    translation.set('Create Android Style','创建手机样式');
    translation.set('Name','样式名称');
    translation.set('Description','样式描述');
    translation.set('Additional Info (Optional)','更新说明（可选）');
    translation.set('CSS','CSS代码');
    translation.set('Example URL (Optional)','示例链接（可选）');
    translation.set('Style Settings (Optional)','样式设置（可选）');
    translation.set('New Drop-Down Setting','下拉式设置');
    translation.set('New Color Setting','颜色设置');
    translation.set('New Text Setting','文本设置');
    translation.set('New Image Setting','图片设置');
    translation.set('Primary Screenshot','封面图片');
    translation.set('Additional Screenshots (Optional)','附加图片（可选）');
    translation.set('Customize Settings','自定义设置');
    translation.set('To customize, click Custom Settings before installing','请先点击左边"自定义设置"按钮进行设置，设置完成后再安装样式');
    translation.set('LOG IN','登录');
    translation.set(' or ',' 或 ');
    translation.set('SIGN UP','注册');
    translation.set('Log in with:','登录方式');
    translation.set('Yahoo!','雅虎');
    translation.set('User name/password','用户名密码登录');
    translation.set('Log in with my userstyles.org user name and password:','请输入用户名和密码');
    translation.set('Log in with my OpenID:','请输入OpenID');
    translation.set('Back','返回');
    translation.set('Create account','注册');
    translation.set('Create a userstyles.org account:','注册');
    translation.set('Lost password','忘记密码');
    translation.set('User name','用户名');
    translation.set('Email','电子邮箱');
    translation.set('Password','密码');
    translation.set('Confirm password','确认密码');
    translation.set('Optional, lets you recover your password','可选填，找回密码时使用');
    translation.set('Enter the e-mail address you used to sign up to reset your password. If you didn\'t provide an e-mail address when signing up, you\'re screwed.','请输入您的电子邮箱以重置密码（如果注册时没有填写电子邮箱，那您的账号凉凉了）');
    translation.set('If you provided that e-mail address when you created your userstyles.org account, you should be receiving an e-mail now.','邮件发送成功，请到您的邮箱重置密码!');
    translation.set('Read tips on making user styles.','提交CSS样式前，请先阅读<a href="https://userstyles.org/help/coding" target="_blank">CSS样式编写指南</a>');
    translation.set(`To specify which URLs will have the style applied, use
    the Mozilla
      @-moz-document format. If you're using Chrome, you can use the "To Mozilla Format" button to generate the
    code.
  `,'请使用Mozilla的<a href="https://github.com/JasonBarnabe/stylish/wiki/Applying-styles-to-specific-sites" target="_blank">@-moz-document</a>规则指定样式应用到哪些URL。如果是Chrome浏览器，可以使用“To Mozilla Format”按钮来生成代码。');
    translation.set('Styles for sites with adult content are not allowed.','禁止为成人网站提交CSS样式');
    translation.set('Styles adding adult content to sites are not allowed.','禁止在CSS样式中添加成人内容');
    translation.set("Do not post other people's content without their permission.",'不得提交他人未授权的CSS样式');




    GM_addStyle(`.PageContent li{ height:30px }
.author-styles tr th:not(:first-child), .author-styles tr td:not(:first-child){width:70px; height:40px; text-align:center}
#middle_install{margin-top: 34px!important;}
.form-controls label{font-size:20px}
b.translate{font-size:18px}
.PageContent ul li{height:50px}
`);

    setInterval(function(){
        $(".overlay_background").hide();
        $(".android_button_button").hide();
        $(".android_button_banner").hide();
        $("#top_android_button").hide();
        $(".fallbackDiv").parent().hide();
        $(".GoogleActiveViewElement").hide();
        $(".walking").hide();
        $(".flags").hide();


        !$('.input_text_search').hasClass('translate') && $('.input_text_search').attr('placeholder','输入关键词搜索样式').addClass('translate');
        !$('.author-styles th:first-child').hasClass('translate') && $('.author-styles th:first-child').text('样式名称').addClass('translate');
        !$('#as_userscript > a').hasClass('translate') && $('#as_userscript > a').text('转换为UserScript脚本安装').addClass('translate');
        !$('#donation_button .bold').hasClass('translate') && $('#donation_button .bold').text('捐赠').addClass('translate');
        !$('#login > p').hasClass('translate') && $('#login > p').html('登录参与讨论，发布你自己的样式。<a href="/login/policy">隐私政策</a>').addClass('translate');
        !$('#remember-openid + label').hasClass('translate') && $('#remember-openid + label').text('记住我').addClass('translate');
        !$('#remember-normal + label').hasClass('translate') && $('#remember-normal + label').text('记住我').addClass('translate');
        !$('#remember-create + label').hasClass('translate') && $('#remember-create + label').text('记住我').addClass('translate');
        !$('#openid+input').hasClass('translate') && $('#openid+input').attr('value','登录').addClass('translate');
        !$('#keep+input').hasClass('translate') && $('#keep+input').attr('value','登录').addClass('translate');
        !$('#password-create > table > tbody > tr:nth-child(6) > td > input[type=submit]:nth-child(2)').hasClass('translate') && $('#password-create > table > tbody > tr:nth-child(6) > td > input[type=submit]:nth-child(2)').attr('value','注册').addClass('translate');
        !$('body > div.PageContent > form > input[type=submit]:nth-child(5)').hasClass('translate') && $('body > div.PageContent > form > input[type=submit]:nth-child(5)').attr('value','提交').addClass('translate');

        if($('#style_info > div.text_style_page > ul >b').length > 0)
        {
            if(!$('#style_info > div.text_style_page > ul > b').hasClass('translate'))
            {
                $('#style_info > div.text_style_page > ul > b').get(0).childNodes[1].textContent='代码贡献者';
            }
            $('#style_info > div.text_style_page > ul > b').addClass('translate')
        }

        if($('#button_middle  div.css_close').length > 0)
        {
            $('#button_middle  div.no-select').text('显示CSS代码');
        }
        else if($('#button_middle  div.css_open').length > 0)
        {
            $('#button_middle  div.no-select').text('隐藏CSS代码');
        }

        $(".adContainer").each(function(){
            if($(this).parent().hasClass("us-stylecard--short") || $(this).parent().hasClass("us-stylecard--long"))
                $(this).parent().hide();
            else
                $(this).hide();
        })

        $('.us-updated').each(function(){
            if( !$(this).hasClass('format'))
            {
                let date1 = $(this).text().substring($(this).text().indexOf('Updated: ')+'Updated: '.length);
                let t = date1.split('/');
                let year =  2000+parseInt(t[2]);
                let month =  t[0];
                let day = t[1];
                $(this).text('更新时间：'+year+'/'+month+'/'+day);
                $(this).addClass('format');
            }
        });
        $('.us-username').each(function(){
            if( !$(this).hasClass('translate'))
            {
                let by = this.childNodes[0];
                by.textContent='作者: ';
                $(this).addClass('translate');
            }
        })
        $('.PageContent ul li a').each(function(){
            if( !$(this).hasClass('translate'))
            {
                $(this).text(translation.get($(this).text()));
                $(this).addClass('translate');
            }
        })
        $('.PageContent ul li').each(function(){
            if( !$(this).hasClass('translate'))
            {
                $(this).html(translation.get($(this).text()));
                $(this).addClass('translate');
            }
        })
        let del_a = $('body > div.PageContent > ul > li:nth-child(6) a');
        if(del_a.text()=='delete it')
        {
            let del_href = del_a.attr('href')
            $('body > div.PageContent > ul > li:nth-child(6)').html('如果您决定不再保留CSS样式，请<a href="'+del_href+'" target="_blank">删除</a>而不是清空它。删除后，样式不会出现在搜索结果中，但已安装用户仍可通过链接访问。')
        }


        $('.navigation-title, .navigation-category, .type_search_option, .PageContent li a, .author-styles td a, .author-styles th,#view-responsive .category_title div, #create_new_style span, #fourm_link a, .loggedIn, .PageContent h2, #middle_install, #install_button_homepage, .see_more span, .StylesCategory h1, .us-downloads .text, .us-rating .text, .us-discussions .text, .fzKkUK, .footer_link a, .by-author, #share_div > div:nth-child(1), #headline, #information_key_left, #information_key, #install_style_button > div:nth-child(2),  #button_middle + div, #send_feedback_button > div:nth-child(2), .author-styles td, .form-controls label, .white_button, .main_title, .subtitle, .cta, #archive_style_button, .customize_button_text, .title_setting, #installStyleButton, #account span, .login-option-explanation, .btn-auth, #password-login p a, #password-create .text-label, #password-create span, .login-navigation, body > div.PageContent > form > p, body > div.PageContent > p, .logIn').each(function(){
            if( !$(this).hasClass('translate'))
            {
                $(this).text(translation.get($(this).text()));
                $(this).addClass('translate');
            }
        })
        $('.type_search_text').each(function(){
            $(this).text(translation.get($(this).text()));
        })
        $('#title_div h1').each(function(){
            if($(this).text().indexOf('Themes & Skins for "') > -1)
            {
                let title = $(this).text();
                let s =title.replace('Themes & Skins for "','');
                s=s.substring(0,s.length-1);
                $(this).text(s);
            }
            if( !$(this).hasClass('translate'))
            {
                $(this).text(translation.get($(this).text()));
                $(this).addClass('translate');
            }
        })
        $('.author-styles td:nth-child(3), #discussions > div  #discussion_date').each(function(){
            if( !$(this).hasClass('format'))
            {
                $(this).text(getUTC8(new Date($(this).text())));
                $(this).addClass('format');
            }
        })
        $('#left_information div:nth-of-type(3) #infomation_value_left,#left_information div:nth-of-type(4) #infomation_value_left').each(function(){
            if( !$(this).hasClass('format'))
            {
                $(this).text(getUTC8(new Date($(this).text())));
                $(this).addClass('format');
            }
        })
        $('#new-setting input').each(function(){
            if( !$(this).hasClass('translate'))
            {
                $(this).attr('value',translation.get($(this).attr('value')));
                $(this).addClass('translate');
            }
        })
        $('#center_information #information_value, #right_information #information_value').each(function(){
            if( !$(this).hasClass('format'))
            {
                $(this).text(conversion(($(this).text())));
                $(this).addClass('format');
            }
        })

        $('#iframe').height(3500);
    },1)
})();