// ==UserScript==
// @name         Topread_manhua
// @namespace    manhua
// @version      1.0.11
// @description  漫画模式
// @match        http://*/*
// @match        https://*/*
// @author       garth
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/461986/Topread_manhua.user.js
// @updateURL https://update.greasyfork.org/scripts/461986/Topread_manhua.meta.js
// ==/UserScript==
! function() {
    var config = {
        zhdx: '18',
        zhcz: '14',
        zhbj: '10',
        djkh: true,
        cszt: '#FCFCFC',
        ztss: ['#FCFCFC', '#F7F1E7', '#DEEFDB', '#393B38'],
        ztss_color: ['#333333', '#333333', '#333333', '#B2B2B2'],
        ztcolor: '#333333',
    };
    var domain_config = [{
        domain: 'topc1.com',
        src: 'src',
        title: '.title',
        tag: 'img'
    }, {
        domain: 'acg456.com',
        src: 'src',
        tag: 'img',
        title: '.comic_view_top',
        next_link: '',
        list_img: 'picAy',
    }, {
        domain: '0dmh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye',
        img_content: '#images',
    }, {
        domain: 'aizhanxin.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'data-type',
        img_content: '.image-content',
    }, {
        domain: 'guashuoshuo.com',
        src: 'src',
        tag: 'img',
        title: '.comic-title'
    }, {
        domain: 'dmhua8.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit'
    }, {
        domain: 'xlsmh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: '',
    }, {
        domain: 'qimaomh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: '',
    }, {
        domain: 'shuanglilock.com.cn',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_link: '',
    }, {
        domain: 'qdhaiding.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter',
    }, {
        domain: 'budingmh.net',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter',
        img_content: '#mainView',
    }, {
        domain: 'mhxqiu3.com',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_link: '',
    }, {
        domain: '9mqz.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter',
    }, {
        domain: 'cuiman.com',
        src: 'data-original',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter',
    }, {
        domain: 'g-lens.com',
        src: 'data-echo',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter',
    }, {
        domain: 'ysimg.com',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_link: '',
    }, {
        domain: 'wuxiqrjx.com',
        src: 'src',
        tag: 'img',
        title: '.chapter-title',
        next_link: ''
    }, {
        domain: '55dmh.com',
        src: 'src',
        tag: 'img',
        title: '.title',
        next_link: ''
    }, {
        domain: 'shangchef.com',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_link: ''
    }, {
        domain: 'bybcar.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        next_link: ''
    }, {
        domain: 'nnhem.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        next_link: ''
    }, {
        domain: 'kjfw.org',
        src: 'data-original',
        tag: 'img',
        title: '.view-fix-top-bar-title',
        next_link: ''
    }, {
        domain: 'kanmeiziba.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        next_link: ''
    }, {
        domain: 'tengyachem.com',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_link: ''
    }, {
        domain: 'jszysq.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'biqumh.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'ghmh.com.cn',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'bftiger.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'lamyt.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: '36manhua.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'gdzhongju.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'ailanmude.com',
        src: 'src',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'baozimh.org',
        src: 'data-src',
        tag: 'img',
        title: '.last',
        next_link: ''
    }, {
        domain: 'yemancomic.com',
        src: 'src',
        tag: 'img',
        title: '.center-title',
        next_link: ''
    }, {
        domain: 'xinxinyi.com',
        src: 'data-original',
        tag: 'img',
        title: '.comic-name'
    }, {
        domain: 'kukuc.co',
        src: 'src',
        title: '.title',
        tag: 'img',
        next_url_rule: '下一页',
    }, {
        domain: 'zhjyu.net',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye',
    }, {
        domain: 'imitui.com',
        src: 'data-src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'url'
    }, {
        domain: '6mh67.com',
        src: 'data-original',
        tag: 'img',
        title: '.title'
    }, {
        domain: 'gufengmh.com',
        src: 'src',
        tag: 'img',
        title: '.subHeader',
        next_js: 'id'
    }, {
        domain: 'mhkami.com',
        src: 'data-src',
        tag: 'img',
        title: '.center-title'
    }, {
        domain: 'xmanhua.com',
        src: 'data-src',
        tag: 'img',
        title: '.top-title'
    }, {
        domain: 'hi191.com',
        src: 'data-original',
        tag: 'img',
        title: '.view-fix-top-bar-title'
    }, {
        domain: 'ihhmh.com',
        src: 'src',
        tag: 'img',
        title: '.txtA',
        next_link: 'xiayiye'
    }, {
        domain: 'mangabz.com',
        src: 'data-src',
        tag: 'img',
        title: '.top-title',
        next_link: 'bottom-bar-tool'
    }, {
        domain: 'qiman59.com',
        src: 'data-original',
        tag: 'img',
        title: '.read-pos'
    }, {
        domain: 'dushimh.com',
        src: 'data-src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'url'
    }, {
        domain: 'fffdm.com',
        src: 'src',
        tag: 'img',
        title: '.text-xl',
        next_js: '',
        next_link: 'xiayiye'
    }, {
        domain: 'renrendongman.com',
        src: 'data-original',
        tag: 'img',
        title: '.view-fix-top-bar-title',
        next_js: '',
        next_link: ''
    }, {
        domain: 'roumh.com',
        src: 'data-original',
        tag: 'img',
        title: '.read_h1',
        next_js: '',
        next_link: '.s_page2'
    }, {
        domain: 'feixuemh.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        next_js: ''
    }, {
        domain: 'txydd.com',
        src: 'src',
        tag: 'img',
        title: '#js_staticChapter',
        next_js: '',
        next_link: '.page-next',
    }, {
        domain: 'haoman6.com',
        src: 'data-ecp',
        tag: 'img',
        title: '.comic-name',
        next_js: '',
        next_link: '.next-chapter',
    }, {
        domain: 'dongman.la',
        src: 'data-src',
        tag: 'img',
        title: '.mdui-typo-title',
        next_js: '',
        next_link: '',
    }, {
        domain: 'manmanapp.com',
        src: 'data-original',
        tag: 'img',
        title: '.title',
        next_js: '',
        next_link: '',
    }, {
        domain: 'udm123.com',
        src: 'src',
        tag: 'img',
        title: '.title',
        next_js: '',
        next_link: '',
    }, {
        domain: 'pipimanhua.net',
        src: 'data-original',
        tag: 'img',
        title: '.view-fix-top-bar-title',
        next_js: '',
        next_link: '',
    }, {
        domain: '6mh66.com',
        src: 'data-original',
        tag: 'img',
        title: '.read-pos'
    }, {
        domain: 'acgz1.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye'
    }, {
        domain: 'haoman8.com',
        src: 'data-echo',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'gjmrk.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'pinmh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'yulumh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'yichmh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'gulumh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'qianmh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'lianaimh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'xuemh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'manhua188.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'qmiaomh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'bukamh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'yilumh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'qimhua.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'duoximh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'diyamh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'dodomh.com',
        src: 'data-src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye'
    }, {
        domain: 'xuermh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'imoemh.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye'
    }, {
        domain: 'zuimh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye'
    }, {
        domain: 'gllmh.com',
        src: 'src',
        tag: 'img',
        title: '.ftbold',
        next_link: 'xiayiye'
    }, {
        domain: 'haoman6.cc',
        src: 'data-echo',
        tag: 'img',
        title: '.comic-name',
        next_link: '.next-chapter'
    }, {
        domain: 'mh160.cc',
        src: 'data-original',
        tag: 'img',
        title: '.BarTit',
        next_link: ''
    }, {
        domain: 'jswvip.net',
        src: 'original',
        tag: 'img',
        title: '.ex-h4',
        next_link: '.nav-next'
    }, {
        domain: 'mhua5.com',
        src: 'src',
        tag: 'img',
        title: '.comic-title',
        next_link: '.next-chapter'
    }, {
        domain: 'mhxqiu2.com',
        src: 'src',
        tag: 'img',
        title: '.chapter_title',
        next_link: ''
    }, {
        domain: 'qiximh3.com',
        src: 'data-original',
        tag: 'img',
        title: '.chapter_title',
        next_link: ''
    }, {
        domain: 'kumw7.com',
        src: 'src',
        tag: 'img',
        title: '.title',
        next_link: ''
    }, {
        domain: 'komiic.com',
        src: 'data-src',
        tag: 'img',
        title: '.Header__middle',
        next_link: ''
    }, {
        domain: 'zely.cn',
        src: 'src',
        tag: 'img',
        title: '.chaptername_title',
        next_link: '.main_control_next',
        list_img: 'zely',
    }, {
        domain: 'mhxin.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'manhua101.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'guoguomh.com',
        src: 'data-src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'colamh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'gougoumh.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'manhua166.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'szssjg.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'otzyx.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'manhua11.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'ikmhua.com',
        src: 'src',
        tag: 'img',
        title: '.title3 span',
        next_link: 'xiayiye',
        list_img: '',
    }, {
        domain: 'isanyin.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: 'xiaye',
        list_img: '',
    }, {
        domain: 'manben.com',
        src: 'data-src',
        tag: 'img',
        title: '#title',
        next_link: '.readTipForm'
    }, {
        domain: 'ythuiju.com',
        src: 'src',
        tag: 'img',
        title: '.title',
        next_link: '.top_next',
        list_img: 'chapter_list_all'
    }, {
        domain: 'imanhuaw.net',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_link: '',
        list_img: 'imanhuaw',
        next_js: 'imanhuaw'
    }, {
        domain: 'kuimh.com',
        src: 'data-echo',
        tag: 'img',
        title: '.view-fix-top-bar-title',
        next_link: '',
        list_img: ''
    }, {
        domain: 'pufei6.top',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'url',
        list_img: 'chapterImages'
    }, {
        domain: 'ymh1234.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'url',
        list_img: 'chapterImages'
    }, {
        domain: 'mhkan.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'url',
        list_img: 'chapterImages'
    }, {
        domain: 'aiguoman.com',
        src: 'data-original',
        tag: 'img',
        title: '',
        next_link: ''
    }, {
        domain: 'manhuabar2.com',
        src: 'data-original',
        tag: 'img',
        title: '.BarTit',
        next_link: '',
        list_img: 'imgsarr'
    }, {
        domain: 'rouman5.com',
        src: 'src',
        tag: 'img',
        title: '.id_chapterName__Idh7W',
        next_link: '',
        list_img: '__NEXT_DATA__'
    }, {
        domain: 'eap399.com',
        src: 'src',
        tag: 'img',
        title: '.headline',
        next_link: '',
        list_img: ''
    }, {
        domain: 'godamanga.com',
        src: 'data-src',
        tag: 'img',
        title: '.stk-block-heading__text',
        img_content: ''
    }, {
        domain: 'yydsmanga.com',
        src: 'data-src',
        tag: 'img',
        title: '.center-title',
        img_content: ''
    }, {
        domain: 'whxbkjx.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        img_content: '#cp_img'
    }, {
        domain: 'ldzhihe.com',
        src: 'data-src',
        tag: 'img',
        title: '.h1',
        img_content: '#cp_img'
    }, {
        domain: 'masseychina.cn',
        src: 'data-src',
        tag: 'img',
        title: '.chapter-title',
        img_content: '#readerContainer'
    }, {
        domain: 'macmanhua.com',
        src: 'data-src',
        tag: 'img',
        title: '.title3',
        img_content: ''
    }, {
        domain: 'manhuaba123.com',
        src: 'src',
        tag: 'img',
        title: '.titleBar',
        img_content: '#cp_img'
    }, {
        domain: 'xianmanwang.com',
        src: 'src',
        tag: 'img',
        title: '.titleBar',
        img_content: '#cp_img'
    }, {
        domain: 'xcmh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: 'bengou.co',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: 'imanhuaw.cc',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: '96mh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: '97mh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: '98mh.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: 'couhan.com',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }, {
        domain: 'manhuadq.cn',
        src: 'src',
        tag: 'img',
        title: '.BarTit',
        next_js: 'f_qTcms_Pic_nextUrl_Href',
        img_content: '#commicBox',
    }];

    var host_url = top_domain(window.location.host);
    var img_src = '';
    var top_title = '';
    var top_tag = '';
    var top_next_js = '';
    var top_next_link = '';
    var top_list_img = '';
    var top_img_content = '';
    for (let i = 0; i < domain_config.length; i++) {
        if (host_url == domain_config[i].domain) {
            img_src = domain_config[i].src;
            top_tag = domain_config[i].tag;
            top_title = domain_config[i].title;
            top_next_js = domain_config[i].next_js || '';
            top_next_link = domain_config[i].next_link || '';
            top_list_img = domain_config[i].list_img || '';
            top_img_content = domain_config[i].img_content || '';
            break;
        }
    }
    if (!img_src) {
        return;
    }

    var zhdx = config.zhdx; /*20为字体初始大小*/
    var zhcz = config.zhcz; /*6为字行差值，该值与字体大小之和作为行高*/
    var zhbj = config.zhbj; /*4为显示边距*/
    var djkh = config.djkh; /*段落之间是否空行，0否1是*/
    var cszt = config.cszt; /*初始主题，主题格式：背景色-字体颜色。单独颜色值则为背景色且字体为黑色*/
    var ztcolor = config.ztcolor;
    var ztss_color = config.ztss_color.join(';'); /*主题对应字体颜色 */
    var ztss = config.ztss.join(';'); /*本脚本所有主题集，主题之间“;”隔开*/
    var $ = function(e) { return document.querySelector(e) },
        ydcss = "text-align:center !important;font-size:26px;font-weight:blod;width:60px;height:60px;line-height:60px;text-align:center;float:right;position:fixed;right:10px;top:30%;color:#fff;background:#000000;cursor:pointer;position:fixed !important;z-index:9999999999 !important;box-shadow:0px 1px 1px #000;border-radius:50%;",
        ydms_menu = "display:none;text-align:center;height:40px;bottom:0px;left:0px;right:0px;border-radius:10px;position:fixed !important;z-index:9998 !important;",
        ydms_ul = "display:flex;flex-direction:row;justify-content: space-around;list-style:none;width:100%;background-color:#fff;color:#fff;padding:0;margin:0;height:40px;",
        ydms_li = 'line-height:25px;display:flex;align-items:center;justify-content:center;',
        ymds_li_a = "text-decoration:none;color:#fff;";
    if (!$("#toptxtydmanhua")) {
        var ydan = document.createElement("span");
        ydan.id = "toptxtydmanhua";
        ydan.innerHTML = "漫";
        ydan.style.cssText = ydcss;
        ydan.addEventListener("click", function() { top_entrance_cartoon_read() });
        $("body").appendChild(ydan);
    }

    function top_domain(url) {
        var domain = url.replace(/^(https?:\/\/)?([^\/?]+)/i, '$2');
        var matches = domain.match(/([^.]+).(com.cn|org.cn|net.cn|gov.cn|ac.cn|[^.]{2,5})$/i);
        return matches ? matches[0] : domain;
    }

    var $ = function(e) { return document.querySelector(e) },
        dqurl = location.href,
        ksqy = document.documentElement.clientHeight,
        img_src = img_src,
        xsztys = ztss,
        xsztys_color = ztss_color,
        mrzt = cszt,
        tzhcz = zhcz,
        mrztcolor = ztcolor,
        pbkh = djkh;
    var list_img = [];
    var list_js_img = [];
    var old_list_img = [];
    var old_title = "";
    var top_title = top_title;
    var top_tag = top_tag;
    var top_next_js = top_next_js;
    var top_next_link = top_next_link;
    var top_list_img = top_list_img;
    var top_img_content = top_img_content;
    var host_url = host_url;
    var is_retry = false;
    var nexturl = dqurl,
        listurl = "",
        list_url_array = [],
        nextt = "",
        zhcz = parseInt(tzhcz),
        xsnr, tcdzt, tztdx, tzthg, fysz, khwb;
    pbkh ? khwb = "</p><p>" : khwb = "</p><p>";

    function szztdx(e) {
        $("body").style.fontSize = e + "px";
        if ($(".wbt")) { $(".wbt").style.fontSize = e + 6 + "px"; };
        tztdx = e;
        tzthg = e * 1 + zhcz;
        fysz = ksqy - tzthg;
        $("body").style.lineHeight = tzthg + "px"
    };

    function top_load_html(e) {
        console.log(e);
        e = e ? e.replace('#', '?') : '';
        if (list_url_array.indexOf(e) > -1) {
            return;
        }
        $("#top_comic").innerHTML += "<div class='loading'></div>";
        list_url_array.push(e);
        dqurl = e;
        var html = "";
        window.frames.document["XXX_iframe"].document.write("");
        window.frames.document["XXX_iframe"].document.close();
        document.getElementById("XXX_iframe").contentWindow.location.reload(true);
        var ifr = document.getElementById("XXX_iframe");
        //ifr.src = dqurl;
        ifr.contentWindow.location.replace(dqurl);
        ifr.onload = function() {
            if (window.frames.document["XXX_iframe"].document === undefined) {
                setTimeout(replace_topiframehtml, 1000)
            } else {
                replace_topiframehtml();
            }

        }
    }

    function szzt(o, ocolor) {
        var t = o.split("-");
        $("body").style.backgroundColor = t[0], $("body").style.color = ocolor
    }

    function replace_topiframehtml() {
        $("#topiframehtml").innerHTML = window.frames.document["XXX_iframe"].document.body.innerHTML;
        nextt = top_title && window.frames.document["XXX_iframe"].document.body.querySelector(top_title) ? window.frames.document["XXX_iframe"].document.body.querySelector(top_title).innerText : '';
        if (!nextt) {
            nextt = window.frames.document["XXX_iframe"].document.title;
            nextt = nextt.substr(0, nextt.indexOf("_") > 0 ? nextt.indexOf("_") : nextt.indexOf("-") > 0 ? nextt.indexOf("-") : nextt.length);
        }
        nextt = nextt.indexOf("（") > -1 ? nextt.substr(0, nextt.indexOf("（")) : nextt;
        nextt = nextt.indexOf("(") > -1 ? nextt.substr(0, nextt.indexOf("(")) : nextt;
        if (top_next_js == 'url') {
            var top_tt = window.frames.document["XXX_iframe"].window.nextChapterData.url;
            top_next_innerhtml(top_tt);
        } else if (top_next_js == 'id') {
            var top_tt = window.frames.document["XXX_iframe"].window.pageUrl + window.frames.document["XXX_iframe"].window.nextChapterData.id + '.html';
            top_next_innerhtml(top_tt);
        } else if (top_next_js == 'f_qTcms_Pic_nextUrl_Href') {
            var top_tt = window.frames.document["XXX_iframe"].window.f_qTcms_Pic_nextUrl_Href();
            if (top_tt != '#') {
                top_tt = window.location.origin + '/' + top_tt;
                top_next_innerhtml(top_tt);
            }
        }
        if (top_list_img) {
            if (top_list_img == 'chapter_list_all') {
                var top_tt = window.location.origin + window.frames.document["XXX_iframe"].window.__cr.data.nexturl;
                top_next_innerhtml(top_tt);
                list_js_img = window.frames.document["XXX_iframe"].window.__cr.chapter_list_all
            } else if (top_list_img == 'chapterImages') {
                var list_t = window.frames.document["XXX_iframe"].window.chapterImages;
                list_js_img = [];
                for (let i = 0; i < list_t.length; i++) {
                    if (list_t[i] !== undefined && list_t[i].indexOf('https:') > -1) {
                        list_js_img.push(list_t[i]);
                    } else {
                        var t_url = window.frames.document["XXX_iframe"].window.SinConf.resHost[0].domain[0] + '/' + window.frames.document["XXX_iframe"].window.chapterPath + '/' + list_t[i];
                        list_js_img.push(t_url);
                    }
                }
            } else if (top_list_img == 'imanhuaw') {
                var top_tt = window.location.origin + window.frames.document["XXX_iframe"].window.qTcms_Pic_nextArr;
                top_next_innerhtml(top_tt);
                list_js_img = window.frames.document["XXX_iframe"].window.qTcms_S_m_murl.split("$qingtiandy$");
            } else if (top_list_img == 'imgsarr') {
                list_js_img = window.frames.document["XXX_iframe"].window.G_zc.imgsarr;
            } else if (top_list_img == 'zely') {
                list_js_img = window.frames.document["XXX_iframe"].window.sign.split(",");
            } else if (top_list_img == 'picAy') {
                list_js_img = window.frames.document["XXX_iframe"].window.picAy;
            } else if (top_list_img == '__NEXT_DATA__') {
                const list = window.frames.document["XXX_iframe"].window.__NEXT_DATA__.props.pageProps.images;
                for (let i = 0; i < list.length; i++) {
                    list_js_img.push(list[i].src);
                }
            }
        }
        zltxt();
    }

    function top_next_innerhtml(top_tt) {
        $("#topiframehtml").innerHTML += '<a href="' + top_tt + '" class="top_next">下一章</a>';
    }

    function get_nexturl() {
        if (top_next_link == 'data-type') {
            var s = $("#topiframehtml"),
                u = s.querySelectorAll("li");
            l = u.length;
            for (var c = l - 1; c >= 0; c--) {
                var i = u[c],
                    a = i.innerText,
                    f = i.dataset.type;
                if (a == '下页' && f) {
                    nexturl = f;
                    break;
                }
            }
        } else {
            var s = $("#topiframehtml"),
                u = s.querySelectorAll("a");
            if (top_next_link == '.next-chapter' || top_next_link == '.btn-nextChapter') {
                nexturl = window.location.origin + document.querySelector(top_next_link).getAttribute('_href');
            } else if (top_next_link == '.nav-next') {
                nexturl = s.querySelector(top_next_link)[0].href;
            } else if (top_next_link == '.bottom-bar-tool') {
                nexturl = s.querySelector(top_next_link) ? s.querySelector(top_next_link)[1].href : '';
            } else if (top_next_link && top_next_link != 'xiayiye' && top_next_link != 'xiaye') {
                nexturl = s.querySelector(top_next_link) ? s.querySelector(top_next_link).href : '';
            } else {
                l = u.length,
                    x = /\u4e0b\u4e00\u9875|\u4e0b\u9875|\u4e0b\u8282|\u4e0b\u4e00\u9801|\u4e0b1\u9875|\u4e0b\u7bc7|\u4e0b\u4e00\u7bc7|\u4e0b\u7ae0|\u4e0b\u9801|\u4e0b\u4e00\u7ae0|\u4e0b\u7ae0|\u4e0b\u4e00\u8bdd|\u4e0b\u8bdd|NEXT/;
                if (l > 0) {
                    nexturl = '';
                    if (top_next_link == 'xiayiye' || top_next_link == 'xiaye') {
                        for (var c = l - 1; c >= 0; c--) {
                            var i = u[c],
                                a = i.innerText,
                                f = i.href;
                            if ((a == '下一页' || a == '下页') && f) {
                                nexturl = f;
                                break;
                            }
                        }
                    }
                    if (!nexturl) {
                        for (var c = l - 1; c >= 0; c--) {
                            var i = u[c],
                                a = i.innerText,
                                f = i.href;
                            if (f && x.test(a) && -1 == f.indexOf("#") && f.indexOf("javascript") == -1) {
                                nexturl = f;
                                break;
                            }
                        }
                    }
                }
            }
        }
        nexturl = window.window.location.origin + '/' == nexturl ? '' : nexturl;
        if (!nexturl) {
            finish_loading(true);
        }
    }

    function zltxt() {
        function e(e) { e.style.display = "none" }

        function n() {
            for (var n = ["div", "span", "p"], t = 0; t < n.length; t++) {
                var r = s.querySelectorAll(n[t]);
                if (r.length > 0)
                    for (var o = 0; o < r.length; o++) r[o].innerText.replace(/\\s+/g, "").length < 8 && e(r[o])
            }
        }

        function t(n) {
            var t = s.querySelectorAll(n);
            if (t.length > 0)
                for (var r = 0; r < t.length; r++) e(t[r])
        }

        function r(n) { s.querySelector(n) && e(s.querySelector(n)) }

        function o() {
            xsnr = ("\\n\\n" + xsnr).replace(/\\r|\\n/g, "\\n\\n").replace(/\\n\\s+/g, khwb), window.screen.height >= document.documentElement.scrollHeight && show_image(1)
        }
        if (!$("#ydms_ul").innerText) {
            var s = $("#topiframehtml"),
                u = s.querySelectorAll("a"),
                l = u.length,
                lx = /\u76ee\u5f55|\u8fd4\u56de\u76ee\u5f55|\u76ee\u9304|\u8fd4\u56de\u76ee\u9304|\u8fd4\u56de\u8be6\u60c5|\u7ae0\u7bc0\u5217\u8868|\u7ae0\u8282\u5217\u8868|\u5217\u8868/;
            get_nexturl();
            if (l > 0)
                for (var c = l - 1; c >= 0; c--) {
                    var i = u[c],
                        a = i.innerText,
                        f = i.href;
                    if (lx.test(a) && -1 == f.indexOf("#")) { listurl = f; break }
                    listurl = ""
                };
            var html_str = "";
            if (listurl) {
                html_str += "<li class=" + "ydms_li" + " ><a href=" + listurl + "><img src=" + "https://file.zhenxiangpa.com/browser/icon/list.svg" + " width=30 height=23></a></li>";
            }
            html_str += "<li class=" + "ydms_li" + " onclick=" + "location.reload();window.scrollTo(0,0);" + " ><img src=" + "https://file.zhenxiangpa.com/browser/icon/close.svg" + " width=30 height=20></li>";
            if (!$(".ydms_li")) { $("#ydms_ul").innerHTML += html_str; }
        }! function() { r("#foot"), t("footer"), r("#footer"), r(".footer"), t("iframe"), t("form"), t("input"), t("table"), t("tbody"), t("tr"), t("td"), t("ul"), t("li"), t("img"), t("font"), t("b"), t("a") }(),
        collect_img();
        o();
        top_loading_more();
    }

    function collect_img() {
        if (top_list_img) {
            var list = list_js_img;
        } else {
            if (top_img_content) {
                var list = $("#topiframehtml").querySelector(top_img_content).querySelectorAll(top_tag);
            } else {
                var list = $("#topiframehtml").querySelectorAll(top_tag);
            }
        }
        for (let i = 0; i < list.length; i++) {
            if (top_list_img) {
                var img_std = {};
                img_std.src = list[i];
                if (old_list_img.indexOf(img_std.src) != -1) {
                    continue;
                }
                img_std.height = 0;
                list_img.push(img_std);
                old_list_img.push(img_std.src);
                continue;
            }
            if (list[i].offsetWidth > 200 || list[i].width > 200 || list[i].width == 1 || list[i].offsetHeight > 200 || list[i].height > 200 || list[i].complete == false) {
                var img_std = {};
                img_std.src = list[i].src;
                if (img_src != 'src') {
                    var _img_src = img_src.replace('data-', '');
                    /*if(list[i].dataset[_img_src] === undefined){
                        continue;
                    }*/
                    img_std.src = list[i].dataset[_img_src] || list[i].src;
                }
                if (img_std.src.indexOf('2mzx.com') > -1 || img_std.src.indexOf('undefined') > -1 || old_list_img.indexOf(img_std.src) != -1) {
                    continue;
                }

                old_list_img.push(img_std.src);
                img_std.width = list[i].offsetWidth || list[i].width;
                img_std.height = list[i].offsetHeight || list[i].height;
                list_img.push(img_std);
            }
        }
    }

    function remove_img() {
        var list_img = $("#top_comic").querySelectorAll('img');
        var list_title = $("#top_comic").querySelectorAll('.wbt');
        var count_img = list_img.length;
        if (list_title.length >= 3) {
            let heightToRemove = 0;
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            for (let i = 0; i < list_img.length; i++) {
                if (list_img[i].className == 'img_display') {
                    heightToRemove += list_img[i].offsetHeight;
                    list_img[i].remove();
                    break;
                }
                heightToRemove += list_img[i].offsetHeight;
                list_img[i].remove();
                count_img--;
            }
            heightToRemove += list_title[0].offsetHeight;
            list_title[0].remove();
            const newScrollTop = Math.max(0, scrollTop - heightToRemove);
            const newViewportTop = newScrollTop + viewportHeight;
            const newViewportBottom = newViewportTop + viewportHeight;
            window.scrollTo(0, newScrollTop);
        }
    }

    function finish_loading(e) {
        if (e && !$('.endwbt')) {
            $("#top_comic").innerHTML += "<div class=\'wbt endwbt\'>已加载完全部章节或者获取下一章失败,请返回原网页查看</div>";
        }
        var list_load = $("#top_comic").querySelectorAll('.loading');
        for (let i = 0; i < list_load.length; i++) {
            list_load[i].remove();
        }
    }

    function show_image(p = 2) {
        var ifr_url = document.getElementById("XXX_iframe").src;
        if (list_img.length <= 0) {
            if (is_retry && dqurl != nexturl) {
                finish_loading(false);
                setTimeout("top_load_html(nexturl)", 2e3)
            }
            if ($("#topiframehtml").innerText == 'loading') {
                replace_topiframehtml();
            }
            is_retry = true;
            return;
        }
        is_retry = false;
        dqurl != "" && ifr_url != dqurl && dqurl != location.href;
        if (nextt != old_title) {
            document.title = nextt;
            var t = "<div class=\'wbt\'>END</div>";
            //nextt = 为标题
            $("#top_comic").innerHTML += t.replace(/END/, nextt);
            if ($("#top_comic").querySelectorAll('.wbt').length > 1) {
                $("#top_comic").innerHTML += '<img style="display:none" src="" class="img_display" width="0" height="0">';
            }
        }
        if (list_img.length <= 0) {
            return;
        }
        if ($('.endwbt')) {
            $('.endwbt').remove();
        }

        if ($("#loading_failure")) {
            $("#loading_failure").remove();
            $("#ydms_menu").style.display = "none";
        }
        let imgHTML = '';
        for (let i = 0; i < list_img.length; i++) {
            const src = list_img[i].src;
            if (src.indexOf('.html') > -1 || src.indexOf('loading.gif') > -1 || !src) {
                continue;
            }
            imgHTML += '<img style="display:inline" src="' + src + '" data-src="' + src + '" width="100%" height="auto" class="img_show" alt="loading fail" onerror="this.style.height = ' + "'50px'" + ';">';
        }
        $("#top_comic").insertAdjacentHTML('beforeend', imgHTML);
        old_title = nextt;
        remove_img();
        if (!nexturl || nexturl == dqurl) {
            finish_loading(true);
        } else {
            finish_loading(false);
        }
        $("#top_comic").innerHTML += "<p></p>", xsnr = '', list_img = [], "" != nexturl ? setTimeout(top_load_html(nexturl), 2e3) : ($("#top_comic").innerHTML += t, dqurl = "")
    }

    function top_loading_more() {
        var e = window.pageYOffset || document.documentElement.scrollTop || $("body").scrollTop;
        window.screen.height < document.documentElement.scrollHeight && e + 4 * window.screen.height > document.documentElement.scrollHeight && list_img && show_image('1');
    }

    function top_value(name, value) { localStorage.setItem(name, value); };

    function yctcd() { "1" == tcdzt && ($("#ydms_menu").style.display = "none", tcdzt = 0) };

    function top_entrance_cartoon_read() {
        if (!img_src) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://app.topc1.com/apply/comic?domain=' + host_url);
            xhr.send();
            return;
        }
        var list_charset = $("head").innerHTML.match(/<meta.*charset.*?=.*?([^"]+).*?>/i);
        var charset_str = list_charset && list_charset.length > 0 ? list_charset[1] : '';
        var wybm = charset_str,
            wyt = `<head><meta charset="' + wybm + '"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><style type="text/css">body{text-align:center;word-wrap:break-word;}body,p,div{padding:0;margin:0;}#top_comic p{padding:8px ' + zhbj + 'px;text-align:justify;margin:0;text-indent:2em;}.wbt{color:#fff;background-color:#373737;font-size:' + (parseInt(zhdx) + 6) + 'px;text-align:center;height:40px;line-height:40px;font-size:14px;}
            .loading {
            position: relative;
            width: 20px;
            height: 20px;
            margin:10px auto;
            }

            .loading:before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #ccc;
            border-color: #ccc transparent #ccc transparent;
            animation: loading 1.2s linear infinite;
            }

            @keyframes loading {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
            }</style><title></title>`;
        wyt += '</head><body><iframe src="" name="XXX_iframe" id="XXX_iframe" sandbox="allow-same-origin allow-popups allow-scripts" style="top: 0px; left: 0px; z-index: -1; opacity: 0; width: 100%; height: 100000px; overflow: hidden; position: fixed; pointer-events: none;"></iframe><div id="ydms_menu" class="nav"><ul id="ydms_ul"></ul></div><div></div><div id="topiframehtml" style="width:100%;height:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:none;"></div><div id="top_comic" class="nav"></div><br>';
        wyt += `</div><style type="text/css">#ydms_menu{display:none;text-align:center;height:40px;bottom:0px;left:0px;right:0px;border-radius:10px;position:fixed !important;z-index:9998 !important;}#ydms_ul{display:flex;flex-direction:row;justify-content: space-around;list-style:none;width:100%;background-color:#fff;color:#fff;padding:0;margin:0;height:40px;}.ydms_li{line-height:25px;display:flex;align-items:center;justify-content:center;}.ydms_li a{text-decoration:none;color:#fff;}.ydms_li img{display:block !important}</style></body>`;
        $("html").innerHTML = wyt;
        var startY = 0;
        var endY = 0;
        szzt(mrzt, mrztcolor);
        szztdx(zhdx);
        top_load_html(dqurl);
        document.addEventListener("scroll", top_loading_more);
        $("#top_comic").addEventListener("click", function(e) { if (e.clientY > window.screen.availHeight / 2 - 160 && e.clientY < window.screen.availHeight / 2 + 160) { $("#ydms_menu").style.display == "none" ? $("#ydms_menu").style.display = "block" : $("#ydms_menu").style.display = "none" } else { e.clientY < window.screen.availHeight / 2 ? window.scrollBy(0, -fysz) : (window.scrollBy(0, fysz), yctcd()) } });
        document.addEventListener("touchstart", function(e) { startY = e.changedTouches[0].clientY });
        document.addEventListener("touchmove", function(e) {
            endY = e.changedTouches[0].clientY;
            endY - startY > 0 ? ($("#ydms_menu").style.display = "block", tcdzt = 1) : yctcd()
        });
        setTimeout(function() {
            if (!$("#top_comic").innerText) {
                $("#top_comic").innerHTML += "<div class='wbt' id='loading_failure'>由于网络等多种原因，请退出重新进入或继续等待</div>";
                $("#ydms_menu").style.display = "block";
            }
        }, 4500);
    }
}();