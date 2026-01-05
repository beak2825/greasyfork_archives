// ==UserScript==
// @name     			WebM Inline Player (ru)
// @version     		1.1.1
// @author     			Faberman
// @namespace			WebM Inline Player by Faberman
// @description     	Автоматически заменяет ссылки на WebM-видео на встроенный плеер
// @include     		http://*
// @include     		https://*
// @exclude				*.4chan.org/*
// @exclude				*.reddit.com/*
// @require           	https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require				https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant              	GM_getValue
// @grant             	GM_setValue
// @grant              	GM_log
// @grant          		GM_xmlhttpRequest
// @grant          		GM_registerMenuCommand
// @grant          		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5092/WebM%20Inline%20Player%20%28ru%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5092/WebM%20Inline%20Player%20%28ru%29.meta.js
// ==/UserScript==

;(function($,window,document,undefined){var Scroller=function(videos){this.init(videos);};Scroller.prototype.init=function(videos){this.data=[];videos.each($.proxy(function(i,elem){this.add($(elem));},this));videos.on('loadedmetadata',$.proxy(function(){this.scrolled();},this));};Scroller.prototype.add=function($elem){var t=$elem.offset().top;this.data.push({$elem:$elem,});};Scroller.prototype.scrolled=function(){var $window=$(window);var t=$window.scrollTop();var b=t+$window.innerHeight();$.each($.map(this.data,function(obj,i){var h=obj.$elem.innerHeight();var top=obj.$elem.offset().top;var bottom=top+h;var p=0;if(top<=b&&bottom>=t){if(bottom>b){p=(b-top)/h;}else if(top<t){p=(bottom-t)/h;}else{p=1;}}
return{p:p,t:top,node:obj.$elem[0]};}).sort(function(a,b){if(a.p>b.p){return-1;}else if(a.p<b.p){return 1;}
if(a.t<b.t){return-1;}else if(a.t>b.t){return 1;}
return 0;}),function(i,obj){if(i===0&&obj.p==1.0){obj.node.play();}else{obj.node.pause();}});};Scroller.prototype.resized=function(){$.each(this.data,function(i,obj){obj.top=obj.$elem.offset().top;obj.bottom=obj.top+obj.$elem.height();});this.scrolled();};Scroller.prototype.listen=function(){var $window=$(window);$window.on('scroll',$.proxy(function(){if(this.data.length===0){return false;}
this.scrolled();},this));$window.on('resize',$.proxy(function(){if(this.data.length===0){return false;}
this.resized();},this));};$.fn.scrollplay=function(){var scroller=new Scroller(this);scroller.listen();return this;};})(jQuery,window,document);

var cfgFrame = "bottom: auto; background: #f0f0f0; border: 1px solid #cacaca; width: 470px; height: 470px; margin: 0 auto; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;" + "max-height: 95%; max-width: 95%; opacity: 1;" + "overflow: auto; padding: 10px; position: fixed;" + "z-index: 999; display: block;";

var cssHeaderLogo = "url('data:image/png;base64,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')";

var cfgCss = [
"#Config_Logo {background-image:" + cssHeaderLogo + "; background-repeat: no-repeat; 	background-position: center;}",
"#GM_config {background: #f0f0f0;}",
//	"#GM_config_section_header_0 {height: 23px; line-height: 23px; vertical-align: middle;}",
"#GM_config .section_header {font-weight: bold; background: none repeat scroll 0% 0% #333; border-style: none !important; margin-bottom: 15px !important; margin-top: 15px !important;}",
//	"#GM_config .config_var {margin: 0px 0px 15px;}",
"#GM_config .field_label {font-size: 14px !important; font-family: 'Segoe UI', 'Droid Sans Fallback', 'Tahoma', sans-serif; color: #303942;}",
"#GM_config .radio_label {font-size: 14px !important; margin-right: 20px !important;}",
"#GM_config_HideControls_field_label {margin-left: 6px !important;}",
"#GM_config_Loop_field_label {margin-left: 6px !important;}",
"#GM_config_Mute_field_label {margin-left: 6px !important;}",
//	"#GM_config_Width_field_label {margin-right: 20px !important;}",
//	"#GM_config_Height_field_label {margin-right: 15px !important;}",
//	"#GM_config_HideControls_var {border-bottom: 1px solid #DADADA; padding-bottom: 15px;}",
//	"#GM_config_Mute_var {border-bottom: 1px solid #DADADA; padding-bottom: 15px;}",
//	"#GM_config_Height_var {border-bottom: 1px solid #DADADA; padding-bottom: 15px;}",
"#GM_config_buttons_holder {text-align: center;}", "#GM_config .saveclose_buttons {cursor: pointer;}",
"#GM_config_section_header_0 {}",
"#GM_config .section_header_holder {text-align: center; margin-top: 0 !important;}",
"#GM_config_Loop_var, #GM_config_Mute_var, #GM_config_Width_var, #GM_config_Height_var {display: inline-block; margin: 0 7%!important;}",
"#GM_config_HideControls_var {margin-bottom: 15px !important;}",
"#GM_config_PlayMode_var {margin-bottom: 10px !important;}",
"#GM_config_section_header_1, #GM_config_section_header_3 {font-size: 3px !important; color: #aaa !important; background: none repeat scroll 0% 0% #aaa !important}"
].join("\n");

var cfgTitle = document.createElement('div');
cfgTitle.id = "Config_Logo";
cfgTitle.style.cssText = "margin:0 auto; height: 80px;";

var fieldDefs = {
    'PlayMode': {
        'label': 'Воспроизводить видео:',
        'section': ['Настройки'],
        'type': 'radio',
        'options': ['По клику', 'При наведении курсора', 'Автоматически'],
        'default': 'По клику'
    },
    'HideControls': {
        'label': 'Скрывать элементы управления плеером',
        'labelPos': 'right',
        'type': 'checkbox',
        'title': 'В режимах "По клику" и "Автоматически" (щёлкните на любую область видео для старта/остановки воспроизведения)',
        'default': false
    },
    'Loop': {
        'label': 'Зацикливать видео',
        'section': ['Default behavior'],
        //		'labelPos': 'right',
        'type': 'checkbox',
        'default': false
    },
    'Mute': {
        'label': 'Отключить звук',
        //		'labelPos': 'right',
        'type': 'checkbox',
        'default': false
    },
    'Width': {
        'label': 'Ширина:',
        'section': ['Размеры плеера'],
        'type': 'int',
        'size': 5,
        'title': 'Ограничить максимальную ширину плеера',
        'default': 500
    },
    'Height': {
        'label': 'Высота:',
        'type': 'int',
        'size': 5,
        'title': 'Ограничить максимальную высоту плеера',
        'default': 500
    },
    'Hidden': {
        'type': 'hidden',
        'section': ['Hidden'],
        'default': ''
    }
};

GM_config.init({
    id: 'GM_config',
    title: cfgTitle,
    fields: fieldDefs,
    css: cfgCss,
    events: {
        'open': function(doc) {
            var config = this;
            doc.getElementById(config.id + '_saveBtn').textContent = "Сохранить";
            doc.getElementById(config.id + '_closeBtn').textContent = "Закрыть";
            doc.getElementById(config.id + '_resetLink').textContent = "Сбросить настройки";
        },
        'save': function() {
            configSave();
        }
    }
});

function configSave() {
    GM_config.close();
    location.reload();
}

function showOptions() {
    GM_config.open();
    GM_config.frame.setAttribute('style', cfgFrame);
}

GM_registerMenuCommand('Настроить WebM Inline Player', showOptions);

(function showWebM() {

    var video_links = document.querySelectorAll('a'),
        url, video;

    for (var i = 0; i < video_links.length; i++) {
        url = video_links[i].href;
        if (video_links[i].href.match(/\.webm$/i)) {
            video = document.createElement('video');
            video.src = url;
            video.loop = GM_config.get('Loop');
            video.muted = GM_config.get('Mute');
            video.style.maxWidth = GM_config.get('Width') + 'px';
            video.style.maxHeight = GM_config.get('Height') + 'px';
            video.preload = "metadata";

            video_links[i].parentNode.replaceChild(video, video_links[i]);

            video.addEventListener('ended', function() {
                this.currentTime = 0;
            });

            if (GM_config.get('PlayMode') == 'По клику' || GM_config.get('PlayMode') == 'Автоматически') {
                video.controls = true;
            }

            if (GM_config.get('HideControls') == true || GM_config.get('PlayMode') == 'On Mouseover') {
                video.controls = false;
            }

            if (GM_config.get('HideControls') == true) {
                video.addEventListener('click', function(event) {
                    if (this.paused) {
                        this.play();
                    } else {
                        this.pause();
                    }
                });
            }

            if (GM_config.get('PlayMode') == 'При наведении курсора') {
                video.addEventListener('mouseover', function(event) {
                    this.play();
                });
                video.addEventListener('mouseout', function(event) {
                    this.pause();
                });
            }

        }
    }

    if (GM_config.get('PlayMode') == 'Автоматически') {
        $('video').scrollplay();
    }

})();