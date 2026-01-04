// ==UserScript==
// @name         1024浏览助手
// @author       zxf10608
// @version      5.1
// @icon      	 https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/1024logo.ico
// @namespace    https://greasyfork.org/users/9280
// @description  支持自定义屏蔽1024广告、屏蔽反广告检测、显示游客站内搜索框、图片延迟加载、修改图片显示尺寸和排列方式、种子链接转磁力链接、取消外链跳转、屏蔽指定回复等。
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/398240-gm-config-zh-cn/code/GM_config_zh-CN.js
// @require      https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.7.0/dist/lazyload.min.js
// @require      https://cdn.jsdelivr.net/npm/spotlight.js@0.7.8/dist/spotlight.bundle.min.js
// @homepageURL  https://greasyfork.org/zh-CN/scripts/398915
// @include      http*://*/htm_data/*.html
// @include      http*://*/htm_mob/*.html
// @include      http*://*/read.php?fid=*
// @include      http*://*/thread0806.php*
// @include      http*://*t66y.com/*
// @include      http*://picbaron.com/*
// @include      http*://img599.net/*
// @include      http*://www.rmdown.com/*
// @include      http*://download.bbcb.tw/*
// @include      http*://www.imgbabes.com/*
// @include      http*://motelppp.com/*
// @include      http*://imgsto.com/*.html
// @include      http*://www.viidii.info/?action=image*
// @include      /https?://c\w\.\w+\.(icu|xyz|com)/index\.php/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      rmdown.com
// @connect      t66y.com
// @connect      *
// @run-at       document-end
// @compatible   chrome
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/398915/1024%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398915/1024%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var newVersion = 'v5.1';
    if (typeof GM_config == 'undefined') {
        alert('1024浏览助手：GM_config库文件加载失败，脚本无法正常使用，请刷新网页重新加载！');
		return;
    } else {
        console.log('1024浏览助手：相关库文件加载成功');
    };

    function config() {
		var windowCss = '#Cfg .nav-tabs {margin: 20 2} #Cfg .config_var textarea{width: 310px; height: 50px;} #Cfg .inline {padding-bottom:0px;} #Cfg .config_header a:hover {color:#1e90ff;} #Cfg .config_var {margin-left: 10%;margin-right: 10%;} #Cfg input[type="checkbox"] {margin: 3px 3px 3px 0px;} #Cfg input[type="text"] {width: 53px;} #Cfg {background-color: lightblue;} #Cfg .reset_holder {float: left; position: relative; bottom: -1em;} #Cfg .saveclose_buttons {margin: .7em;} #Cfg .section_desc {font-size: 10pt;}';
        GM_registerMenuCommand('设置', opencfg);

        function opencfg() {
			GM_config.open();
        };
        GM_config.init(
	{
            id: 'Cfg',
            title: GM_config.create('a', {
                href: 'https://greasyfork.org/zh-CN/scripts/398915',
                target: '_blank',
                textContent: '1024浏览助手',
                title: '作者：zxf10608 版本：' + newVersion + ' 点击访问主页'
            }),
            isTabs: true,
            skin: 'tab',
            css: windowCss,
            frameStyle: 
	    {
				height: '555px',
				width: '433px',
                zIndex: '2147483648',
            },
            fields: 
	    {
                jpgMain: 
		{
                    section: ['图片优化', '修改图片显示样式'],
                    label: '图片排列方式',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['平铺', '单列', '双列'],
                    'default': '平铺'
                },
                jpgShow: 
		{
                    label: '图片显示尺寸',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['缩略图', '中等图', '大图'],
                    'default': '缩略图'
                },
                jpgNewtab: 
		{
                    label: '图片新标签后台打开',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                jpg_Origin: 
		{
                    label: '显示图片引用来源',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                gallery: 
		{
                    label: '开启相册预览模式',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                jpg_Load: 
		{
                    label: '开启图片延迟加载',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                close_JpgMain: 
		{
                    label: '关闭优化，仅快速打开图片跳转',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                reminder: 
		{
                    label: '温馨提示',
                    labelPos: 'right',
                    type: 'button',
                    click: function() {
                        alert('1、修改显示尺寸仅支持引用自“img599.net”的图片，大图需消耗更多带宽和内存。\n 2、当图片显示异常，请开启“关闭优化，仅快速打开图片跳转”，恢复图片原始样式。');
                    }
                },
                adBlockMain: 
		{
                    section: ['广告屏蔽', '页面重新排版，文字和图片整体上移'],
                    label: '屏蔽1024超链接及图片广告',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                adBack: 
		{
                    label: '屏蔽反广告检测及横条广告',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                adOther: 
		{
                    label: '屏蔽第三方网站广告总开关',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                    line: 'start',
                },
                ad_img599: 
		{
                    label: 'img599图库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                ad_PicBaron: 
		{
                    label: 'PicBaron图库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                ad_imgbabes: 
		{
                    label: 'imgbabes图库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                ad_rmdown: 
		{
                    label: 'rmdown下载库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                ad_motelppp: 
		{
                    label: 'motelppp下载库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                ad_bbcb: 
		{
                    label: 'bbcb下载库',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                    line: 'end',
                },
                reminder2:
		{
                    label: '温馨提示',
                    labelPos: 'right',
                    type: 'button',
                    click: function() {
					alert('广告种类繁多，且经常更新，不保证100%屏蔽，如有广告遗漏，请留言反馈。');
                    }
                },
                torrentMain: 
		{
                    section: ['种子转换', '种子链接转换，均保留原始链接。'],
                    label: '种子链接转为',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['磁力超链接', '磁力纯文本', '不做改动'],
                    'default': '磁力超链接'
                },
                torrentPlace: 
		{
                    label: '磁力链接位置',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['贴内标题后', '全部图片前', '全部图片后'],
                    'default': '全部图片前'
                },
                torrentRepeat: 
		{
                    label: '移除重复种子链接',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                torrentDown: 
		{
                    label: '开启种子快捷下载',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                magnetCopy: 
		{
                    label: '显示磁力链接复制按钮',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
				magnetShow:
				{
					label: '开启磁力链接快捷显示',
					labelPos: 'right',
					type: 'checkbox',
					default: true,
				},
                Other_hide: 
		{
                    section: ['其他设置', '优化浏览体验'],
                    label: '隐藏楼主信息栏',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                threadOpen_background: 
		{
                    label: '主题帖后台打开',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                font_Color: 
		{
                    label: '贴内字体改为蓝色',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                tourist_Search: 
		{
                    label: '显示游客站内搜索框',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                go_Top: 
		{
                    label: '显示返回顶部按钮',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: true,
                },
                wide_Screen: 
		{
                    label: '默认开启宽屏显示',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                show_Update: 
		{
                    label: '更新后弹出更新日志',
                    labelPos: 'right',
                    type: 'checkbox',
                    default: false,
                },
                threadShow: 
		{
                    label: '主题帖图片预览',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['单图', '双图', '关闭'],
                    'default': '单图'
                },
                hide_Reply: 
		{
                    label: '所有回复',
                    labelPos: 'left',
                    type: 'select',
                    'options': ['默认折叠', '默认展开'],
                    'default': '默认展开'
                },
                blackTxt: 
		{
                    'label': '屏蔽包含以下关键词回复',
                    'type': 'textarea',
                    'default': '1024|谢|支持|收藏|分享'
                },
            },

			events:
			{
				save: function() {
					GM_config.close();
					location.reload();
				}
			},
		});
	};
	config();
	var G = GM_config;
	var localHref = window.location.href;
	var dataLink= 'img[data-link$=".jpg"],img[data-link$=".jpeg"],img[data-link$=".png"],img[data-link$=".bmp"],img[data-link$=".gif"]';
	var torrentHref = 'a[href*="rmdown"],a[href*="bbcb"],a[href*="motelppp"],a[href*="365shares"],a[href*="qqxbt"],a[href*="busdown"],a[href*="gueizu"],a[href*="3wpan"],a[href*="bvmqkla.de/x"],a[href*="fijidown"],a[href*="finedac"],a[href*="xtvbt"]';
	
    function AjaxCall(href, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: href,
            onload: function(data, status) {
                if (data.readyState == 4 && data.status == 200) {
                    var htmlTxt = data.responseText;
                    callback(null, htmlTxt);
                };
            },
            onerror: function(error) {
                callback(error);
            },
            ontimeout: function(error) {
                callback(error);
            },
        });
    };
	function download(Link,fileName){
		GM_download({
			url: Link,
			name: fileName,
			onload: function () {
				var txt = fileName+' 下载完成。';
				Popup(txt);
			},
			onerror: function () {
				alert('下载失败');
			},
			ontimeout: function () {
				alert('下载超时');
			},
		});
	};
	function Popup(txt){
		GM_notification({
			title:'1024浏览助手：',
			text:txt,
			timeout:3000,
		});	
	};

	$('body').on('click','.zcopy,.mag1', function() {
		if($(this).is('[data-href]')){
			var link = $(this).data('href')
		}else{
			var link = $(this).attr('href')
		};
		GM_setClipboard(link);
		var txt = '磁力链接复制完成。';
		Popup(txt);
		return false;
	});
	$('body').on('click','.rmdown', function(){
		if (G.get('torrentDown')){
			var torrentLink = $(this).attr('href');
			AjaxCall(torrentLink,function(error,htmlTxt) {
				if (error) {
				  console.log(torrentLink+'异步加载请求失败！');  
				  return
				  };
				var reff_value = $(htmlTxt).find('input[name="reff"]').val();
				var ref_value = $(htmlTxt).find('input[name="ref"]').val();
				GM_openInTab('http://www.rmdown.com/download.php?reff='+reff_value+'&ref='+ref_value);
			});
			return false;
		};
	});
	$('body').append(`
	<script>
		function updateJpg(img){
			if (/img599|pic599|yudaotu/.test(img.src)){
				img.src=img.src.replace('.md.jpg','.jpg');
			}else if(/imagetwist/.test(img.src)){
				img.src=img.src.replace('/i/','/th/');
			};
			img.onerror=null; 
		};
	</script>`); 
	if ( localHref.match(/htm_(data|mob)\S*\.html|read\.php\?fid=/) != null ){
        var ready = function() {
            $('.tpc_content:eq(0)').addClass('CL1024');
            $('.CL1024 img').addClass('oldJpg');
            $('.CL1024 a[target="_blank"],.CL1024 a[style^="cursor"]').addClass('oldTorrent');
            if (!G.get('close_JpgMain')) {
                var src1 = $('script').text().match(/img\[([a-z-]+)\]/)[1]
            } else {
                var src1 = '6666'
            };
					
			var newHtml= $('.CL1024').html().
							replace(/&(amp;)?z/gi,'').
							replace(/https?\S+\?(https?)/gi,'$1').
							replace(/\s*&nbsp;\s*/gi,''). 
							replace(/<\/?b>/gi,'').
							replace(/_{4,}/g,'.').
							replace(/={4,}/g,'').
							replace(new RegExp(src1,'g'),'src2');
			$('.CL1024').html(newHtml);
        };
        ready();
        var color2 = G.get('font_Color') ? 'color:blue' : '';
        if (localHref.match(/\/[0-9]{4}\/(7|8|16|21)\//) != null) {
            var other_thread = true
        } else {
            var other_thread = false
        }; 
	if (G.get('adBlockMain')) {
            $('.CL1024').prevAll().remove('br');
            $('.CL1024 .image-big,blockquote,b').not('[class^="f"]').contents().unwrap();
            if (!other_thread) {
				$('.CL1024 [class^="f"]').each(function(){
					if($(this).text().length>80){
						$(this).children('span').remove();
						$(this).contents().unwrap();
					}else if($(this).find('img').length>0){
						$(this).remove();
					};
				});
                $('.CL1024').contents().filter(function() {
                    return this.nodeType == 3
                }).wrap('<p style=' + color2 + '></p>');
			    
                $('p:first').prevAll().not(torrentHref + dataLink).remove();
				$('.CL1024 br,.CL1024 img[src2$=".gif"],.CL1024 a[onclick],.CL1024 a[href*="bitspirit"],.image-big-text,.quote,.t_like').not(torrentHref+dataLink).remove(); 
                $('.CL1024 span').not('[class^="f"]').contents().unwrap();
                $('.oldTorrent').each(function() {
					if( $(this).is(torrentHref) 
						|| $(this).prev().find('*').addBack().is('img') 
						|| $(this).next().find('*').addBack().is('img')){
							return;
                    };
                    $(this).remove()
                })
            }
        };
        if (G.get('adBack')) {
            var adName = $('script').text().match(/r\w+S/)[0];
            $('body').append('<script>function ' + adName + ' (){}</script>');
            $('.tips,.sptable_do_not_remove,#footer').remove()
        };
        $(document).ready(function(){
			if (typeof $('.tpc_content:eq(0)').html() == 'undefined' || $('.CL1024').height() < 200) {
				alert('1024浏览助手：屏蔽1024广告或屏蔽反广告检测异常，请关闭该功能，恢复正常浏览。')
			};
		});
        if (G.get('wide_Screen')) {
            var w = '100%';
            $('#header,#main').css('max-width', w)
        } else {
            var w = '1024px'
		};
		if (G.get('jpg_Origin') && !G.get('close_JpgMain')){
            var txt = 'img599.net|pic599.net|kccdk.com|imagetwist.com|bvmqkla.de|picbaron.com|imgbabes.com|www.xoimg.club|www.privacypic.com|img250|img300.picturelol.com|p9.fijipic.xyz/'.split('|');
            for (var i = 0; i < txt.length; i++) {
				if($('.oldJpg:eq(-1),.oldJpg:eq(1)').is('[src]') || $('.oldJpg:eq(-1),.oldJpg:eq(1)').attr('src2').indexOf(txt[i]) == -1){
					var Gallery = '未知图库';
					break;
                } else {
					var Gallery = txt[i]+'图库';
				};
            };
            $('.oldJpg:first').before('<p style=' + color2 + '>【图片引用】：' + Gallery + ' </p>')
        };
        var jpg = function() {
            var jpgCover = !$('.oldJpg:first').is('[data-link]') ? true : false;
            $('.oldJpg').each(function(i) {
				if ($(this).is('[src]')){
					var $El=$(this).parent();
					var srclink=$(this).attr('src');
					var jpglink=$El.attr('href');
				}else{
                var src2 = $(this).attr('src2');
                if (!$(this).is('[data-link]')) {
                    $(this).attr('data-link', src2);
                    $(this).after('&nbsp;', '<br>')
                };
                if ($(this).attr('data-link').indexOf('kccdk') != -1) {
                    var newlink = src2.replace(/(.*)thumbs\/(.*)\.(th|md)\.jpg/, '$1$2.jpeg');
                    $(this).attr('src2', newlink);
                    $(this).attr('data-link', newlink)
                };
                if (src2.indexOf('bvmqkla.de') != -1) {
                    $(this).attr('data-link', src2)
                };
                if (src2.indexOf('imagetwist.com') != -1) {
                    var newlink = src2.replace('/th/', '/i/');
                    $(this).attr('data-link', newlink)
                };
                if ($(this).attr('data-link').indexOf('/i/?i=u/') != -1) {
                    var newlink = src2.replace('i/?i=', '');
                    $(this).attr('data-link', newlink)
                };
                if ($(this).attr('data-link').match(/img599|pic599|yudaotu/) != null) {
                    $(this).attr('data-link', src2.replace(/\.(th|md)\.jpg/, '.jpg'));
                    if (G.get('jpgShow') == '中等图') {
                        $(this).attr('src2', src2.replace(/(\.th)?\.jpg/, '.md.jpg'))
                    } else if (G.get('jpgShow') == '大图') {
                        $(this).attr('src2', $(this).attr('data-link'));
                        $(this).after('&nbsp;')
                    }
                };
					var $El=$(this);
					var srclink=$(this).attr('src2');
                var jpglink = $(this).attr('data-link');
				};
                if (G.get('jpg_Load') && i > 1) {
					var jpgLocal = 'https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/loading00.gif';
					var jpgLoad = srclink; 	

                } else {
							var jpgLocal= srclink;
							var jpgLoad = '0';
                };
				$El.replaceWith('<a href='+jpglink+' target="_blank" class="newJpg"> <img src='+jpgLocal+' data-original='+jpgLoad+' onerror="javascript:updateJpg(this);" alt="图片加载失败" title="点击查看原图" class="newImg" style="cursor:pointer;max-width:'+w+'"></a>');
            });
            if (G.get('jpgNewtab')) {
                $('.CL1024').on('click', '.newJpg', function() {
                    GM_openInTab($(this).attr('href'));
                    return false
                })
            };
            if (G.get('jpgMain') == '双列' && jpgCover) {
                $('.newJpg:even').after('<br>')
            } else if (G.get('jpgMain') == '双列') {
                $('.newJpg:odd').after('<br>')
            } else if (G.get('jpgMain') == '单列') {
                $('.newJpg').after('&nbsp;', '<br>')
            }
        };
        if (!G.get('close_JpgMain')) {
            jpg()
        } else {
            $('.oldJpg').after('&nbsp;')
        }; 
	if (G.get('jpg_Load') && !G.get('close_JpgMain')) {
            var load_error = function(element) {
                console.log("图片延迟加载失败!", element.getAttribute("data-original"))
            };
            var load_finish = function() {
                console.log("所有图片延迟加载完成")
            };
            var lazyLoadInstance = new LazyLoad({
                elements_selector: 'img[src$="loading00.gif"]',
                data_src: 'original',
                threshold: 100,
                callback_error: load_error,
                callback_finish: load_finish
            })
        };
        var gallery = function() {
            if (typeof(Spotlight) == 'undefined') {
                alert('Spotlight库加载失败，相册预览模式无法使用！')
				return;
            };
            $('.newImg').attr('title', '点击相册预览');
            $('.newJpg').addClass('spotlight');
			$('.newJpg').attr({'data-title':false,'data-play':2000});
			
			
			Spotlight.init();
			var button = Spotlight.addControl("download2", function(e){
				var Link = $('.spl-pane>img').attr('src');
                    var fileName = Link.split('/').slice(-1).toString();
				 download(Link,fileName);
				 console.log('下载成功');
				return false;
            });
			GM_addStyle(`.spl-download2{background-image:url(https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/download00.svg);background-size:20px}`);

			
        };
        if (G.get('gallery') && !G.get('close_JpgMain')) {
            if ($('.newJpg').length > 2) {
                var url = $('.newJpg:eq(1)').attr('href')
            } else {
                var url = $('.newJpg:eq(-1)').attr('href')
            };
            var jpgBig = /^((?!picbaron).)*(jpe?g|png|bmp)$/;
            if (jpgBig.test(url)) {
                gallery();
                console.log('已开启相册预览模式')
            } else {
                console.log('该页面不支持相册预览模式')
            }
        };
        if (G.get('torrentRepeat')) {
            for (var i = 0; i < $('.oldTorrent').length; i++) {
                var Link1 = $('.oldTorrent').eq(i).attr('href');
                $('.oldTorrent').eq(i).attr('own', '1');
                $('.oldTorrent').each(function() {
                    var Link2 = $(this).attr('href');
                    if (Link1 == Link2 && !$(this).is('[own]')) {
                        $(this).remove()
                    }
                })
            }
        };
        var magnet2 = function() {
            if (G.get('adBlockMain')) torrentHref = '.oldTorrent';
			var t=0;
            $(torrentHref).each(function() {
                var torrentLink = $(this).attr('href');
                var txt = $(this).text().replace(/(點擊|点击)(進入|进入)(下載|下载)\s?/g, '');
                $(this).remove();
                $('.newJpg,.oldJpg').last().nextAll().not('a,br').remove();
                if (torrentLink.indexOf('rmdown') != -1) {
						t++
						if(t == 1){
						var hash = torrentLink.replace(/(.*)hash=(2[0-9]{2})?(\w{40})/,'$3');
                    var magnetLink = 'magnet:?xt=urn:btih:' + hash;
                    GM_setValue('magnet', magnetLink);
                    GM_setValue('torrent', torrentLink);
						};
                } else if (torrentLink.indexOf('bbcb') != -1 && G.get('torrentDown')) {
                    var bbcbLink = torrentLink.replace(/(.*)list\.php\?name=(\w+)/, '$1down.php/$2.torrent');
                    var otherTorrent = '<a href=' + bbcbLink + ' class="newTorrent">备用种子下载</a>'
                } else {
                    var otherTorrent = '<a href=' + torrentLink + ' class="newTorrent otherTorrent">其他种子 ' + txt + '</a><br>'
					};
				if (G.get('torrentPlace') == '全部图片前'){
                    setTimeout(function() {
                        $('.newJpg,.oldJpg').first().before(otherTorrent)
                    }, 10)
                } else if (G.get('torrentPlace') == '全部图片后') {
                    $('.newJpg,.oldJpg').last().after(otherTorrent)
                } else {
                    $('.CL1024').prepend(otherTorrent)
                }
            });
            var magnetLink = GM_getValue('magnet') || '0';
            var torrentLink = GM_getValue('torrent') || '0';
			var hashMagnet ='',hashTorrent ='';
			
            GM_setValue('magnet', '0');
            GM_setValue('torrent', '0');
            if (magnetLink != 0) {
                if (G.get('torrentMain') == '磁力纯文本') {
                    var hashMagnet = '<p>' + magnetLink + '</p>'
                } else {
                    var hashMagnet = '<a href=' + magnetLink + ' class="newTorrent newMagnet">磁力链接</a><a href="javascript: void(0);" class="zcopy" data-href=' + magnetLink + ' style="display:none;" title="复制磁力链接">&nbsp;复制</a><br>'
                }
            };
            if (torrentLink != 0) {
                var hashTorrent = '<a href=' + torrentLink + ' class="newTorrent rmdown">种子下载</a><br>'
            };
            if (G.get('torrentPlace') == '全部图片前') {
                $('.newJpg,.oldJpg').first().before(hashMagnet, hashTorrent)
            } else if (G.get('torrentPlace') == '全部图片后') {
                $('.newJpg,.oldJpg').last().after('<br>', hashMagnet, hashTorrent)
            } else {
					$('.CL1024').prepend(hashMagnet,hashTorrent);
			};
			if (G.get('magnetCopy')) $('.zcopy').show();

            if (!other_thread) {
                $('[class^="f"]').remove()
            } else {
				$('[class^="f"]').filter('a[target="_blank"],:contains(種子),:contains(种子),:contains(大圖),:contains(图片連結),:contains(AD)').remove();//删除残余链接
            };
            setTimeout(function() {
                if ($('.otherTorrent').length == 1) {
                    $('.otherTorrent').text('备用种子下载')
                };
				$('.newTorrent,.zcopy').attr('target','_blank').css({'cursor':'pointer','color':'#2f5fa1'});//统一添加属性
			}, 80);
        };
        if (G.get('torrentMain') != '不做改动' && !other_thread) {
            magnet2()
        } else if (G.get('adBlockMain')) {
            $('.oldTorrent').before('<br>').after('<br>')
        };
        if (G.get('Other_hide')) {
            $('th:eq(0),.r_two:eq(0)').hide();
            $('.CL1024,.tiptop:eq(0),.tipad:eq(0),h4').css('padding', '0px 115px')
        };
        if (G.get('adBlockMain')) {
            window.onload = function() {
                $('.CL1024 img').each(function() {
                    var w = $(this).width();
                    var h = $(this).height();
				   if( w > 850 && h < 350){
						$(this).remove();
					};
				});
			};
        };
        $('.t.t2:gt(0)').each(function() {
            var blackList = G.get('blackTxt');
            if ($(this).find('.tpc_content').text().match(new RegExp(blackList, 'g')) != null) {
                $(this).remove()
            }
        });
        var reply = function() {
            var replyClass = '.t.t2:gt(0),.t:last,td[align="left"]:last';
            if (G.get('hide_Reply') == '默认展开') {
                var txt = '折叠回复'
            } else {
                var txt = '展开回复';
                $(replyClass).hide()
            };
            $('.tipad:eq(0)').append('<button class="reply" style="cursor:pointer;">' + txt + '</button>');
            $('.reply').click(function() {
                if ($('.reply').text() == "展开回复") {
                    $('.reply').text("折叠回复")
                } else {
                    $('.reply').text("展开回复")
                };
                $(replyClass).slideToggle('fast');
                return false
            })
        };
        reply();
        if (G.get('go_Top')) {
			$('body').append('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/gotop.png" class="goTop" style="position:fixed; width:50px; bottom:10px; right:10px; cursor:pointer; display:none;" title="返回顶部">');
            $(".goTop").click(function() {
				$('html,body').animate({scrollTop:'0px'},'slow');
            });
            $(window).scroll(function() {
                var s = $(window).scrollTop();
                if (s > 500) {
                    $(".goTop").fadeIn(600)
                } else {
					$(".goTop").fadeOut(600);
        };
        });

        };

        var oldVer = GM_getValue('version') || '';
        if (G.get('show_Update') && oldVer != newVersion) {
			var txt='1024浏览助手 '+newVersion+' 更新日志：\n更新日期：2022年4月25日 \n1、优化“种子转换”功能；\n2、更新部分依赖库；\n3、修复已知bug。';
            setTimeout(function() {
				alert(txt);
            }, 2000);
			GM_setValue('version',newVersion);
    };

	
			};
	
	if (document.title.indexOf('草榴社區') != -1 && G.get('tourist_Search')){
		$.ajaxSetup({cache: true});
        var cx = '017632740523370213667:kcbl-j-fmok';
        $.getScript('https://cse.google.com/cse.js?cx=' + cx, function() {
			$('.gsrch').css({'width':'300px','height':'50px','float':'right','margin':'5px -39px 0 0'});
			setTimeout(function(){
				$('.gsc-control-cse').css({'background-color':'#0F7884','border':'0px'});
				
			},50);
        }).fail(function() {
            alert('显示游客站内搜索框失败！请挂代理再开启！')
        });
        $('.banner').append('<div class="gsrch"><gcse:search></gcse:search></div>')
    };
    if (localHref.indexOf('www.viidii.info/?action=image') != -1 && G.get('close_JpgMain')) {
        $('.al').remove();
        var newlink = $('.bglink').attr('href');
        window.location.href = newlink
    };
    if (localHref.indexOf('thread0806.php') != -1) {
        $('.tal a').each(function() {
            var Link = $(this).attr('href');
            var newlink = 'https://' + location.host + '/' + Link;
            $(this).attr('data-href', newlink);
            if (G.get('threadOpen_background')) {
                $(this).click(function() {
                    GM_openInTab(newlink);
                    return false
                })
            }
        });
		function delAttr(e){
			$.each(e.attributes, function() {
				if(this.specified  && /\w{9}/.test(this.name) && this.value.length==0){
					e.removeAttribute(this.name);
				};
			});
		};
		var show = function (){
            var trigger;
			$('body').append('<img class="imgshow"><br><img class="imgshow1">');
			$('.imgshow,.imgshow1').attr('style','position:absolute; border:1px solid gray; display:none;');
			$('.tal a').hover(function (e){
				var thiz = $(this);
                trigger = setTimeout(function() {
                    if (thiz.is('[data-src]')) {
                        $('.imgshow').attr('src', thiz.attr('data-src'));
                        if (thiz.is('[data-src1]')) {
							$('.imgshow1').attr('src',thiz.attr('data-src1'));
                        };
						$('.imgshow,.imgshow1').attr('onerror','javascript:updateJpg(this);');
                    } else {
								var link = thiz.attr('data-href');
								AjaxCall(link,function(error,htmlTxt){
                            if (error) {
									  console.log(link+'异步加载请求失败'); 
									  alert('图片预览/磁力链接显示失败，请确认网络畅通！');
                                return
                            };
                            var srcName = htmlTxt.match(/img\[([a-z-]+)\]/)[1];
									var newhtml=htmlTxt.replace(new RegExp(srcName,'g'),'src');
                            var link = [];
									$(newhtml).find('.tpc_content:eq(0) img[src]').each(function(e){
										var url=$(this).attr('src');
										if (!/gif|tinypic|alicdn|51688|imgs02|bvmqkla|ax21pics/.test(url)){//排除广告图
											if(/img599|pic599/.test(url)){
                                        url = url.replace(/(\.th)?\.jpg/, '.md.jpg');
											}else if(/imagetwist/.test(url)){
                                        url = url.replace('/th/', '/i/');
											}else if(/kccdk/.test(url)){
                                        url = url.replace(/(.*)thumbs\/(.*)\.(th|md)\.jpg/, '$1$2.jpeg');
                                    };
                                    link.push(url);
                                };
                            });
									if(G.get('magnetShow')){
										$(newhtml).find('.tpc_content:eq(0) a[href*="rmdown"]').each(function(e){
											var hash=$(this).attr('href').replace(/(.*)hash=(2[0-9]{2})?(\w{40})/,'$3');
											var magnet='magnet:?xt=urn:btih:'+hash;
											thiz.after('<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/magnet00.png" class="mag1" href='+magnet+' title="磁力链接，点击复制\n'+magnet+'" target="_blank" style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;">');
											return false;
										});
									};
                            var L = link.length - 1;
                            thiz.attr('data-src', link[0]); 
                            $('.imgshow').attr('src', link[0]);

                            if (L > 0 && G.get('threadShow') == '双图') { 
                                thiz.attr('data-src1', link[L]);
                                $('.imgshow1').attr('src', link[L]);
                            };
                            $('.imgshow,.imgshow1').attr('onerror', 'javascript:updateJpg(this);'); 
                        });
                    };

					delAttr($('.imgshow')[0]);
					delAttr($('.imgshow1')[0]);
					if(G.get('threadShow')!='关闭'){
                    setTimeout(function() {
                        var t = thiz.offset().top - $(window).scrollTop(); 
                        var h = $(window).height() * 0.5; 
                        var num = t > h ? '-100%' : '0';
						$('.imgshow').css({top:e.pageY,left:e.pageX,transform:'translate(-101%,'+num+')'}).fadeIn('slow');
						$('.imgshow1').css({top:e.pageY,left:e.pageX,transform:'translateY('+num+')'}).fadeIn('slow');
                    }, 600);
					};
                }, 400);
            }, function() { 
                clearTimeout(trigger); 
                $('.imgshow,.imgshow1').removeAttr('src onerror').fadeOut('slow'); 
				delAttr($('.imgshow')[0]);
				delAttr($('.imgshow1')[0]);
            });
        };

		if(G.get('threadShow')!='关闭' || G.get('magnetShow')){
			show();
        };
    };

    if (G.get('adOther')) {

        if (localHref.indexOf('img599.net') != -1 && G.get('ad_img599')) {
            
            $('.google-ad2_fixed,a[target="_blank"]').remove();
        };

        if (location.host.indexOf('picbaron.com') != -1 && G.get('ad_PicBaron')) {
            
            $(document).ready(function() {
                
                $('form').submit(); 
                setTimeout(function() {
                    var newlink = $('.pic').attr('src');
                    window.location.href = newlink;
                }, 1000);
            });

        };

        if (localHref.indexOf('www.rmdown.com') != -1 && G.get('ad_rmdown')) {
           
            $('a[target="_blank"]').hide();
            $('#foo1ter').css('display', ''); 
        };

        if (localHref.indexOf('download.bbcb.tw') != -1 && G.get('ad_bbcb')) {
            
            $('a[target="_blank"],.tm-footer').hide();
            $('.uk-button').removeAttr('onclick'); 
        };

        if (localHref.indexOf('motelppp.com') != -1 && G.get('ad_motelppp')) {
            $('#countdown').attr('class', 'countdown end'); 
            $('#btnDownload').removeAttr('disabled').removeClass('disabled-btn');
            $('img[src$=".gif"]').hide();
        };

        if (localHref.indexOf('www.imgbabes.com') != -1 && G.get('ad_imgbabes')) {
            
            $(':submit').click(); 
            $('a[target="_blank"],#transparentbg').hide();
            var newlink = $('img[src$=".jpg"]').attr('src');
			window.location.href = newlink; 
		};
		if (localHref.indexOf('imgsto.com') != -1){
			$(document).ready(function(){
				$('form').submit();
				setTimeout(function(){
					var newlink = $('.pic').attr('src');
					window.location.href = newlink;
				}, 1000);
			});
		};
	};
})();