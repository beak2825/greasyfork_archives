// ==UserScript==
// @name         Ban Bad Websites 标记/屏蔽机器翻译 SEO 垃圾网站
// @namespace    https://greasyfork.org/zh-CN/scripts/389721-ban-bad-websites
// @version      0.4.28
// @description  标记/禁用垃圾网站链接。主要针对机器翻译 Stack Overflow，爬虫采集站内容农场等 SEO 垃圾网站。
// @author       Phuker
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389721/Ban%20Bad%20Websites%20%E6%A0%87%E8%AE%B0%E5%B1%8F%E8%94%BD%E6%9C%BA%E5%99%A8%E7%BF%BB%E8%AF%91%20SEO%20%E5%9E%83%E5%9C%BE%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/389721/Ban%20Bad%20Websites%20%E6%A0%87%E8%AE%B0%E5%B1%8F%E8%94%BD%E6%9C%BA%E5%99%A8%E7%BF%BB%E8%AF%91%20SEO%20%E5%9E%83%E5%9C%BE%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

/*
Author:
https://github.com/Phuker/

Project GitHub Repo:
https://github.com/Phuker/BanBadWebsites

Greasy Fork:
https://greasyfork.org/zh-CN/scripts/389721

License:
GNU General Public License v3.0
*/

(function() {
    'use strict';

    // - - - - - - - - - - Start User Config - - - - - - - - - -

    // 突出显示目标超链接，改变链接的颜色、装饰线、边框、指针样式等
    var option_highlight_link = true;

    // 如果启用突出显示目标超链接，设置文字颜色
    // 示例：'red' '#CC0033' null
    var option_highlight_link_color = '#CC0033';

    // 如果启用突出显示目标超链接，设置背景色
    // 由于 CSS 的特性，有可能无法正确设置想要的区域
    // 示例：'red' '#CC0033' null
    var option_highlight_link_background_color = null;

    // 如果启用突出显示目标超链接，设置边框
    // 由于 CSS 的特性，有可能无法正确设置想要的区域
    // 示例：'solid 1px #CC0033'
    var option_highlight_link_border = null;

    // 如果启用突出显示目标超链接，设置下划线、上划线、贯穿删除线等样式
    // 由于 CSS 的特性，某些情况下无效
    // 示例：'line-through solid #CC0033'
    var option_highlight_text_decoration = null;


    // 使目标超链接无法点击
    // [不推荐] 垃圾网站有时候还有一定参考价值，必要时可能仍然需要点击访问
    var option_disable_link = false;


    // 隐藏目标超链接
    // [不推荐] 此脚本不是特定网站的针对性脚本，无法完美删除目标超链接，可能会导致网页显示错乱
    var option_remove_link = false;

    // - - - - - - - - - - End User config - - - - - - - - - -

    var hosts = {
        '爬虫采集 SEO 机器翻译垃圾网站': [
            'codeday.me',
            'code.i-harness.com',
            'djcxy.com',
            'voidcc.com',
            'itranslater.com',
            'kknews.cc',
            '1r1g.com',
            '1r1g.cn',
            'xbuba.com',
            'voidcn.com',
            'codenong.com',
            'helplib.com',
            'jishuwen.com',
            'androidcookie.com',
            'soinside.com',
            'kbase101.com',
            'bbsah.com',
            'cn.computer-clans.com',
            'uwenku.com',
            'ojit.com',
            'stackoverrun.com',
            'mlog.club',
            'it-swarm.net',
            'bullforyou.com',
            'it1352.com',
            'itkeyword.com',
            'kutu66.com',
            'stackovernet.com',
            'orcode.com',
            'qastack.cn',
            'chubuntu.com',
            'codebug.vip',
            'it-swarm.asia',
            'bugshoot.cn',
            'stackoom.com',
            'itdaan.com',
            'z4q7.com',
            'slowmotionvideoclips.com',
            'bayouseo.com',
            '4659855.com',
            'hotbarebaking.com',
            'rsfaf.com',
            'wanmeiyule2.com',
            'ksa-boy.com',
            'poolandspapartsmart.com',
            'reallifetucson.com',
            'fulucaijing.com',
            'luxury-condos-miami.com',
            'zkyshop.com',
            'thehesedlove.com',
            'dc120.com.cn',
            'kaicen.cn',
            'zhetiaohe.com',
            'codecocoa.com',
            'cctsuzhou.cn',
            'juhc66.cn',
            'artez.org.cn',
            'hyhome.com.cn',
            'bdqxgw.com',
            'colabug.com',
            'ohmyrss.com',
            'ups360.net',
            '3li.cc',
            '723g.com.cn',
            'xinhexinli.com',
            '585906.com',
            'baopen.xyz',
            'jrccn.cn',
            'africamv.com',
            'hotbak.net',
            'pai-hang-bang.com',
            'lanzhouyangsheng.com',
            '9999ktv.com',
            '52movs.com',
            'zsyawen.com',
            'pianshen.com',
            'zhipanyou.com',
            'bbsmax.com',
            'shuzhiduo.com',
            'codeqq.com',
            'mamicode.com',
            'bubuko.com',
            'feimao777.com',
            'geek-share.com',
            'daimajiaoliu.com',
            'dajiayouxi.com',
            'gedixinxi.com',
            'gushidazahui.com',
            'jiankangjiaoliu.com',
            'yuerxinde.com',
            'xuexidushu.com',
            'dnxxj.com',
            'tiyujiaoliu.com',
            'shishangjiaoliu.com',
            'shehuiwenhua.com',
            'naozhuanwan.com',
            'meirongjiaoliu.com',
            'yulejiaoliu.com',
            'crifan.com',
            'oox8.com',
            'qu02.com',
            'tongfengqu.com',
            'wntzx.cn',
            'dovov.com',
            'cocoachina.com',
            'coder.work',
            'dofe.com.cn',
            '0937car.cn',
            'ubuntuqa.com',
            'it-swarm.dev',
            'codingdict.com',
            'jingjiamitan.com',
            'zhezhier.com',
            'win10xiazai.com',
            'paradacreativa.es',
            'thinbug.com',
            'answer-id.com',
            'mos86.com',
            'jeepxie.net',
            'qqyouyan.com',
            'baobaoyuer.com',
            'cnpython.com',
            'routinepanic.com',
            '4008140202.com',
            'pythonheidong.com',
            'bugjia.net',
            'generacodice.it',
            'generacodice.com',
            '366service.com',
            'oomake.com',
            'itread01.com',
            'soblog.cc',
            'shangmayuan.com',
            'read01.com',
            'yuanmas.com',
            'someabcd.com',
            'mdeditor.tw',
            '1applehealth.com',
            'movervip.com',
            'glcopy.com',
            'howtoip.com',
            'copyan.com',
            'shxy888.com',
            'yiaisan.com',
            'pyerror.com',
            'sov5.cn',
            'manongjc.com',
            'javaer101.com',
            'debugger.wiki',
            'zhihesj.com',
            'wiwiku.com',
            'chowdera.com',
            'javahlw.com',
            'iter01.com',
            'icode9.com',
            'yunjuu.com',
            'jiucenglou.cn',
            'aspxhtml.com',
            'dtmao.cc',
            'zhishibo.com',
            'mashen.zone',
            'wyxbc.com',
            'taodudu.cc',
            'soolco.com',
            'allocmem.com',
            'itxueyuan.com',
            'itsharecircle.com',
            'jquery.online',
            'wangt.cc',
            'likecs.com',
            'cdmana.com',
            'admin5.com',
            'fajicy.com',
            'gan-ren.com',
            'zoukankan.com',
            'ddeevv.com',
            'fuyimokuai.com',
            'haowuliaoa.com',
            'haberindeks.com',
            'yixuebiancheng.com',
            'codingnote.cc',
            'javamana.com',
            'shangdixinxi.com',
            'sosozy.cn',
            'copyfuture.com',
            'debug8.com',
            'v2as.com',
            'yht7.com',
            'pythonmana.com',
            'dazhuanlan.com',
            'qdmana.com',
            'lsd365.com',
            'maiyewang.com',
            'secn.net',
            'yehe.org',
            'qishunwang.net',
            'w3xue.com',
            'zl.rs',
            'joyk.com',
            'pythonf.cn',
            'canmanuel.com',
            'shengqian001.com',
            'zgserver.com',
            'tujiebar.com',
            'codercto.com',
            'zhuaniphone.com',
            'babyitellyou.com',
            'loudoun-valley.com',
            'linuxadictos.com',
            'diglog.com',
            'adatiya.com',
            'bynss.com',
            'phpheidong.com',
            'zditect.com',
            'androidsis.com',
            'quish.tv',
            'tl80.cn',
            'wenjiangs.com',
            'cxymm.net',
            'pcpc.me',
            'eskere.club',
            'zhz.wiki',
            'portaldacalheta.pt',
            'lidihuo.com',
            'xy2401.com',
            'css8.cn',
            'etsoutdoors.com',
            'ubunlog.com',
            'hardreset.info',
            'gouma.org',
            '4k8k.xyz',
            'soydemac.com',
            'desdelinux.net',
            'joecomp.com',
            'itbaoku.cn',
            'howtoing.com',
            'icopy.site',
            'coderbridge.com',
            'it-swarm.cn',
            'twblogs.net',
            'wpata.com',
            'affde.com',
            'code-paper.com',
            'wenyanet.com',
            'websetnet.net',
            'ntcdoon.org',
            'mahwaqib.com',
            '91webs.cn',
            'bookset.io',
            'geeknb.com',
            'athabasca-foto.com',
            '11px.cn',
            'edwardsrailcar.com',
            'srcmini.com',
            'xknote.com',
            'huangxiaobo.org',
            'cxyzjd.com',
            'noobyard.com',
            'codeantenna.com',
            'yisoge.com',
            'its404.com',
            'xbfhb.com',
            'lehuotuan.com',
            'lsbin.com',
            '361shipin.com',
            'ngui.cc',
            'idushu.com',
            'betheme.net',
        ],
        '博彩垃圾网站': [
            'ceptchina.com',
            'cwptz.com',
            'danengtzs.com',
            'dzim.net',
            'lygzywl.com',
            'meihuijj.com',
            'rongtaihe1879.com',
            'seaolife.com',
            'stx160.com',
            'tiyiba.com',
            'winenine.com',
            'xiaoxtea.com',
            'zjwsrcw.com',
            '58pjy.com',
            '36511cp.com',
            'sdtasdb.com',
            'cairoibf.org',
            'macaodaily.com',
            '52365o.com',
            'wenliku.com',
            '36545622.com',
            '365888432.com',
            'chnweiyu.com',
            '2266601.com',
            'code5.cn',
            'yangzheng365.com',
            'nibaihe.cn',
            'yxwjlrm.cn',
            'yfkwzpc.cn',
            'weikuanxi.cn',
            'moviebukkake.com',
            'sbo511.com',
            '400sbc.com',
            '322cpw.com',
            '57mcp.com',
            'planetgammon.com',
            '5571100.com',
            'adipexdrugstore.com',
        ],
        '垃圾下载站': [
            'download.csdn.net',
            'manong5.com',
        ],
        '垃圾中文技术性网站': [
            'jb51.net',
            'www.csdn.net',
            'blog.csdn.net',
            'yq.aliyun.com',
        ]
    };

    var urls = {
        '机器翻译爬虫垃圾网站': [
            // http://www.imooc.com/wenda/detail/581525
            'https://www.imooc.com/wenda',
            'https://m.imooc.com/wenda',

            'https://cloud.tencent.com/developer/ask',  // https://cloud.tencent.com/developer/ask/69735
        ],
        '垃圾 SEO 网站': [
            'https://help.aliyun.com/wordpower/',
        ],
    }
    

    var cursor_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABj1BMVEX4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT4BlT////D56oEAAAAg3RSTlMAROOgDAAAAAyg40QARNX/+44LAACO+9VE4/////2QCwD//+Og+////5AK+6AMjv38k44MAAv//wD////8Cv+TCgAA/5MKAAAAAAALkP/8kAsAAAALkP3///2QCwAMjv3/jgyg+/////ug4////+NE1f/7jo77/9VEAETjoAwMoONEAJyONeEAAAABYktHRIRi0FpxAAAAB3RJTUUH4wEJAyMIrljkvAAAAOhJREFUGNNjYGBkYmZhZWNnZ2Pl4OTi5mHg5eMXEBQSFhERFhIV4xeXYJCUkpaRlZNXUJCXk5VRVFJmUFFVU9eQ1dTS0pTVUJfR1mHQ1dPXUNcwMDQ0AFKyRsYMJqZyQCkzc3MzIF9OiJXBQlhe08DM0srK0tpGU17YgoFdRMHW0NyqudnKzt7B0YkdScDZxdXN3YPB08vbB6LF188/IDCIITgkNAxiaHhEZFR0DENsXHwC1FqgSGISQ3JKahrMYeHpGZkMWdk5CKfn5OYx5BcUFhVDPFdSWlZewVBZVV1TC/F+XX1DYxMA6lI04KQBZEYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDEtMDlUMDM6MzU6MDgrMDg6MDDq0TSKAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA5VDAzOjM1OjA4KzA4OjAwm4yMNgAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc2MTA4Y0VIZwAAABF0RVh0VGh1bWI6OlNpemUANjcyN0L99mrAAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzExNy8xMTc1NzQ5LnBuZ54B8P8AAAAASUVORK5CYII=';

    // modified from PAC
    function dnsDomainIs(host, domain) {
        if(domain[0] === '.'){
            domain = domain.substr(1);
        }
        var idx = host.length - domain.length;
        return (host === domain) || (idx > 0 && host.lastIndexOf('.' + domain) == idx - 1);
    }

    function ban_link(link, type){
        if(link.hasAttribute('phuker-banned')){
            return
        } else {
            link.setAttribute('phuker-banned', 'yes');
            console.log('Ban Bad Website: ' + link.href + ' - ' + type);
        }
        
        if(option_highlight_link){
            link.setAttribute('title', type);
            link.style.cursor = 'url(' + cursor_img + '), not-allowed';
            if(option_highlight_link_color){
                link.style['color'] = option_highlight_link_color;
            }
            if(option_highlight_link_background_color){
                link.style['background-color'] = option_highlight_link_background_color;
            }
            if(option_highlight_link_border){
                link.style['border'] = option_highlight_link_border;
            }
            if(option_highlight_text_decoration){
                link.style['textDecoration'] = option_highlight_text_decoration;
            }
        }

        if(option_disable_link){
            link.style['pointerEvents'] = 'none';
            if(!option_highlight_text_decoration){
                link.style['textDecoration'] = 'none';
            }
        }

        if(option_remove_link){
            link.style['display'] = 'none';
        }
    }

    function process(link){
        for(let type in hosts){
            var h = hosts[type];
            for(let i = 0; i < h.length; i++){
                if(dnsDomainIs(link.hostname, h[i])){
                    ban_link(link, type)
                    return 
                }        
            }
        }
        for(let type in urls){
            var u = urls[type];
            for(let i = 0; i < u.length; i++){
                if(link.href.startsWith(u[i])){
                    ban_link(link, type)
                    return 
                }        
            }
        }
    }

    function ban_bad_websites(){
        var links = document.getElementsByTagName('a');
        for(var i = 0; i < links.length; i++){
            let link = links[i];
            if(!link.hasAttribute('phuker-banned')){
                process(link);
            }
        }
    }
    window.addEventListener('load', ban_bad_websites);
    setTimeout(ban_bad_websites, 3 * 1000);
    setTimeout(ban_bad_websites, 10 * 1000);
})();
