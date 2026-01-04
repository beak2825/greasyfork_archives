// ==UserScript==
// @name        52pojie 精品软件 只显示最近24小时的帖子 + 高热帖加亮
// @description 0.40 修正点击分类标签后,不生效的问题.感谢@lyscop的反馈
// @description 0.30 更换jquery镜像地址
// @description 0.20 修正有新贴回复提示时,显示异常的bug
// @description 0.10 只显示最近24小时发布的贴子.查看过的帖子隐藏,热门帖子高亮
// @namespace   www.91mdz.com
// @include     https://www.52pojie.cn/forum-16-*.html
// @include     https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=16*
// @version     0.4.0
// @require     https://cdn.staticfile.org/jquery/1.12.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422525/52pojie%20%E7%B2%BE%E5%93%81%E8%BD%AF%E4%BB%B6%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%9C%80%E8%BF%9124%E5%B0%8F%E6%97%B6%E7%9A%84%E5%B8%96%E5%AD%90%20%2B%20%E9%AB%98%E7%83%AD%E5%B8%96%E5%8A%A0%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/422525/52pojie%20%E7%B2%BE%E5%93%81%E8%BD%AF%E4%BB%B6%20%E5%8F%AA%E6%98%BE%E7%A4%BA%E6%9C%80%E8%BF%9124%E5%B0%8F%E6%97%B6%E7%9A%84%E5%B8%96%E5%AD%90%20%2B%20%E9%AB%98%E7%83%AD%E5%B8%96%E5%8A%A0%E4%BA%AE.meta.js
// ==/UserScript==

var now_time = new Date();
//查看小时以内的新发帖子
var hours_count = 24;
//是点击否查看过的帖子隐藏
var click_hide = true;

var hide_space = hours_count * 60 * 60 * 1000;
var jq = jQuery.noConflict();
var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
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

var loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
            .tl table{table-layout:auto}
          */
    });
    var head = document.querySelector('head');
    head.appendChild(style);
};

loadCss();
jq( dispost );
jq('.bm_c.cl.pbn').hide();
jq('.res-footer-note').hide();
function dispost(){
    jq('tbody').each(function () {
        var create_time = new Date(jq('em span', this).text());
        create_time = Date.parse(create_time);

        var num = parseInt(jq('.num em', this).text());
        if( (now_time - create_time ) < hide_space )
        {
             if (num > 1000)
            {
                jq(this).css('background', '#FFEBEB');
            }
            else if (num > 500)
            {
                jq(this).css('background', '#FFCDCD');
            }
            else if (num > 200)
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
                //console.log(link);
            }
            else
            {
                //console.log(link);
                jq(this).click(onLinkClick);
            }
        }
    });
}
