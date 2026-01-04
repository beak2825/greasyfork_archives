// ==UserScript==
// @name        hipda 论坛热度高亮 + 只显示最近一天的帖子
// @description 参考论友 wu-lamplamp的 hipda 论坛热度高亮+top 按钮修复修改
// @description 0.80适配论坛新域名
// @description 0.70修改 又该jquery镜像地址,优化部分逻辑
// @description 0.60修改 一周的帖子太多，只查看一天的帖子。如果12点之前，则还可以查看前一天的帖子。
// @description 0.50增加 单条帖子的屏蔽按钮  X
// @description 0.40修正 因帖子在列表不同的翻页的url不同, 而造成的查看过的页面重新出现的bug。
// @description 0.30修正 bs版 查看过的帖子在列表中隐藏的功能无效的问题
// @description 0.20增加查看过的帖子在列表中隐藏的功能
// @description 0.10保留论坛高亮功能 去除top按钮功能 增加只显示最近一周的帖子帖子的功能
// @description 修改界面宽度,放大标题字体
// @namespace   www.91mdz.com
// @include     https://www.hi-pda.com/forum/forumdisplay.php?*
// @include     https://www.4d4y.com/forum/forumdisplay.php?*
// @version     0.8.0
// @require     https://cdn.staticfile.org/jquery/1.12.1/jquery.min.js
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/39972/hipda%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE%20%2B%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%9C%80%E8%BF%91%E4%B8%80%E5%A4%A9%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/39972/hipda%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE%20%2B%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%9C%80%E8%BF%91%E4%B8%80%E5%A4%A9%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

var now_time = new Date();
var day_count = 2;
//12点之后，只看当天的帖子
if ( now_time.getHours() > 12 )
{
    day_count = day_count - 1;
}
var hide_space = day_count * 24 * 60 * 60 * 1000;

//是点击否查看过的帖子隐藏
var click_hide = true;

var jq = jQuery.noConflict();

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
};

var loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
           #postlist{border: 1px solid #ccc;}
            #nav, #nav a {
               color: #000000;
            }
            body{
               background:#fff;
            }
            .postauthor .profile, .postbottom {
               display:none;
            }
            .t_msgfontfix {
               min-height:0px !important;
            }
            body{
               margin: 0 auto;
                width: 90%;
                font-size: 16px;
            }
            .wrap, #nav{
               width:100%;
            }
            a:visited{
                  color:#aaa;
            }
            div#header div.wrap h2{
                  display:none;
            }
            .main{border:1px #ccc solid;}
          */
    });
    var head = document.querySelector('head');
    head.appendChild(style);
};

function checkLink( url )
{
	return localStorage.getItem( url ) > 0;
}

function saveLink( url )
{
	localStorage.setItem( url, 1 );
}

function onLinkClick( obj )
{
    var id = obj.currentTarget.id;
	saveLink( id );

    if( click_hide )
    {
        jq( obj.currentTarget ).hide();
    }
}

loadCss();

jq( dispost );
function dispost(){
    jq('tbody').each(function () {
        var create_time = new Date(jq('.author em', this).text());
        create_time = Date.parse(create_time);

        var num = parseInt(jq('.nums strong', this).text());
        if( (now_time - create_time ) < hide_space )
        {
            if (num > 100)
            {
                jq(this).css('background', '#FFEBEB');
            }
            else if (num > 50)
            {
                jq(this).css('background', '#FFCDCD');
            }
            else if (num > 20)
            {
                jq(this).css('background', '#FFEBEB');
            }
        }
        else
        {
            jq( this ).hide();
        }

        var id = this.id;
        if ( id )
        {
            if( checkLink( id ) )
            {
               jq( this ).hide();
            }
            else
            {
                var link = jq('.subject span a', this)[0];
                jq(link).attr('target', '_blank');
                jq(this).click(onLinkClick);
            }
        }
    });
}
