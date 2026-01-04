// ==UserScript==
// @name         Pixiv小工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @icon		http://www.pixiv.net/favicon.ico
// @description  try to take over the world!
// @author       You
// @include      *://www.pixiv.net/*
// @match        *://www.pixiv.net/bookmark.php?*
// @match        *://www.pixiv.net/bookmark_detail.php?*
// @match        http://www.pixiv.net/

// @require https://code.jquery.com/jquery-migrate-3.0.0.min.js

// @run-at document-end

// @grant none1
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31152/Pixiv%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/31152/Pixiv%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = '';

    //增大管理收藏的复选框点击有效范围
    $('.image-item .input-container').click(function (e){
        // console.log('点击有效范围checked');
        // console.log(e.target);
        // console.log(this);
        if(e.target!=this){
            // console.log('true执行checked');
            return true;
        }
        // console.log('false执行checked');
        var _cb = $(this).find('input[type=checkbox]');
        _cb.prop('checked', !_cb.prop('checked'));
        // e.stopPropagation();
        // e.preventDefault();
    });

    //每行开头添加勾选本行
    var rowNum = 4;
    //alert($('._image-items').length);
    // var rowFirstHeight = [];
    // var _maxHeight = 0;
    // $('._image-items .image-item').each(function(i, ele){
    //     if(_maxHeight < $(this).height()){
    //         _maxHeight = $(this).height();
    //     }
    //     if((i + 1)%rowNum === 0){
    //         rowFirstHeight[rowFirstHeight.length] = _maxHeight;
    //         _maxHeight = 0;
    //     }
    // });
    //alert(rowFirstHeight);
    var rowCheckbox = $('<div>').css({
        height: '20px',
        width: '20px',
        position: 'absolute',
        left: '-20px',
        'background-color': 'rgba(0,0,0,0.1)'
    });
    css +=
        '.rowCheckbox {' +
        'height: 100%;' +
        'width: 100%;' +
        '}';
    var _checkbox = $('<input>')
    .prop('type', 'checkbox')
    .addClass('rowCheckbox')
    .appendTo(rowCheckbox);

    //$('.display_editable_works').prepend(rowCheckbox);
    // :contains(checkbox)
    $('._image-items .image-item .input-container').parent('.image-item').each(function(i, ele){
        // $('._image-items .image-item').each(function(i, ele){
        //console.log('index:' + i + '=' + i%rowNum);
        if(i%rowNum === 0){
            var rc = rowCheckbox.clone();
            $(this).prepend(rc);
            rc.click(function(e){
                // console.log(e.target==this);
                var _cb = $(this).find('input[type=checkbox]');
                // console.log(_cb.get(0));
                var _f = _cb.prop('checked');
                console.log(_f);
                if(e.target==this){
                    //不是直接点击复选框时需要手动改变
                    _f = !_f;
                    _cb.prop('checked', _f);
                }
                var _imgLi = $(this).parent('li.image-item');
                // console.log(_imgLi.get(0));
                // console.log(_imgLi.add(_imgLi.nextAll().slice(0, rowNum - 1)));
                // console.log(_imgLi.add(_imgLi.nextAll().slice(0, rowNum - 1)).find('.input-container input[type=checkbox]'));
                _imgLi.add(_imgLi.nextAll().slice(0, rowNum - 1))
                    .find('input[type=checkbox]')
                    .prop('checked', _f);
            });
        }
    });

    css += 
        '/* 额外添加样式 */' +

        '.fast_click-ul {' +
        'position: relative;' +
        '}' +
        '.fast_click-ul .image-item {' +
        // 'background-color: rgba(96, 188, 242, 0.22)' +
        '}' +

        '.fast_click-ul .ranking-item {' +
        // 'background-color: rgba(96, 188, 242, 0.22)' +
        '}' +

        '.fast_click-ul .fastClickDiv {' +
        'display: block;' +
        '}' +

        '.fastClickDiv {' +
        'display: none;' +
        'position: absolute;' +
        'height: 100%;' +
        'width: 100%;' +
        'left: 0px;' +
        'z-index: 99;' +
        // 'background-color: rgba(0, 0, 0, 0.1);' +
        'background-color: rgba(96, 188, 242, 0.22);' +
        '}';

    //console.log(unsafeWindow);
    GM_registerMenuCommand('快速点击',function(){
        //$('._image-items .image-item').toggleClass('fast_click');
        //console.log($('._image-items .image-item').length);
        //console.log($('._image-items .image-item:not(fast_click)').length);
        //console.log($('._image-items .image-item.fast_click').length);
        //$('._image-items .image-item:not(fast_click)').css( 'background-color', 'rgba(96, 188, 242, 0.22)');
        //$('._image-items .image-item.fast_click').css( 'background-color', '');
        console.log("快速选择-状态更改");
        toggle_fastClick();
    },'fast_click');
    GM_registerMenuCommand('相似列表',function(){
        //alert(window.location.href);
        //alert(window.location.href.match(/id=(\d*)[^\d]*/));
        window.location.href = "https://www.pixiv.net/bookmark_add.php?id=" + window.location.href.match(/id=(\d*)[^\d]*/)[1];
    },'similar_list');
    $(document).keydown(function(e){
        // console.log(e.which);
        // console.log(e.altKey);
        // e.shiftKey、e.ctrlKey
        // alt + s 热键触发
        if(e.altKey && e.keyCode == 83){
            toggle_fastClick();
        }
    });
    function toggle_fastClick(){
        $('._image-items').toggleClass('fast_click-ul');
        $('.ranking-items').toggleClass('fast_click-ul');
        items3.toggleClass('fast_click-ul');
    }

    var fastClickDiv = $('<div>').addClass('fastClickDiv');

    //列表快速点击模式
    //$('#illust-recommend')
    $('._image-items').each(function(i, ele){
        console.log('_image-item:' + i);
        $(this).on('DOMNodeInserted', function(e) {
            //动态加载内容时触发
            // console.log('element now contains: ' + $(e.target).html());
            var ele;
            if($(e.target).hasClass('fastClickDiv')){
                // continue;
                return true;
            }else if($(e.target).hasClass('image-item')){
                ele = e.target;
            }else{
                ele = $(e.target).parent('.image-item').get(0);
            }
            fastClick_imageItemsBuild(ele);
        });
        $(this).find('.image-item').each(function(i, ele){
            // console.log('image-item:' + i);
            fastClick_imageItemsBuild(ele);
        });
    });
    function fastClick_imageItemsBuild(ele){
        // console.log(ele);
        if(!ele || $(ele).find('.fastClickDiv').length > 0){
            return false;
        }
        var _fcd = fastClickDiv.clone();
        $(ele).prepend(_fcd);
        _fcd.click(function(e){
            console.log('fastClickDiv>>>');
            // console.log($(this).parent('.image-item').find('_one-click-bookmark'));
            var _imgLi = $(this).parent('.image-item');
            var _cb = _imgLi.find('input[type=checkbox]');
            if(_cb.length > 0){
                _cb.prop('checked', !_cb.prop('checked'));
            }else{
                _imgLi.find('._one-click-bookmark:not(.on)').click();
            }
        });
    }
    //附加拖蓝模
    
    window.onselect = function() {
//         alert('window');
    };
    window.onSelect = function() {
//         alert('window');
    };
    //alert(window.onselect);
    $('._image-items').on('select', '.image-item .fastClickDiv', function(e){
//         alert(this.html());
    });
    $('._image-items').on('select', '.image-item', function(e){
//         alert(this.html());
    });
    $('._image-items').on('select', '.image-item img', function(e){
//         alert(this.html());
    });
    
    //     ranking-items
    // ranking-item
    $('.ranking-items').each(function(i, ele){
        console.log('_ranking-item:' + i);
        $(this).find('.ranking-item').each(function(i, ele){
            // console.log('ranking-item:' + i);
            fastClick_imageItemsBuild2(ele);
        });
        $(this).on('DOMNodeInserted', function(e) {
            //动态加载内容时触发
            // console.log('element now contains: ' + $(e.target).html());
            // console.log('element now contains: ');
            // console.log(e.target);
            var ele;
            if($(e.target).hasClass('fastClickDiv')){
                // continue;
                return true;
            }else if($(e.target).hasClass('ranking-item')){
                // console.log('element now contains: hasClass');
                // console.log(e.target);
                ele = e.target;
            }else{
                // console.log('element now contains: not hasClass');
                // console.log(e.target);
                // ele = $(e.target).parent('.ranking-item').get(0);
            }
            fastClick_imageItemsBuild(ele);
        });
    });

    // 让jquery动态绑定
    $('.ranking-items').on('click', '.ranking-item .fastClickDiv', function(e){
        console.log('fastClickDiv>>>');
        console.log(this);
        console.log($(this).parent('.ranking-item').get(0));
        // console.log($(this).parent('.ranking-item').find('_one-click-bookmark'));
        var _imgLi = $(this).parent('.ranking-item');
        var _cb = _imgLi.find('input[type=checkbox]');
        if(_cb.length > 0){
            _cb.prop('checked', !_cb.prop('checked'));
        }else{
            _imgLi.find('._one-click-bookmark:not(.on)').click();
        }
    });
    function fastClick_imageItemsBuild2(ele){
        // console.log(ele);
        if(!ele || $(ele).find('.fastClickDiv').length > 0){
            return false;
        }
        var _fcd = fastClickDiv.clone();
        $(ele).prepend(_fcd);
        //         此方式自动新加载的内容点击时this无法使用
        // _fcd.click(function(e){
        //     console.log('fastClickDiv>>>');
        //     console.log(this);
        //     console.log($(this).parent('.ranking-item').get(0));
        //     // console.log($(this).parent('.ranking-item').find('_one-click-bookmark'));
        //     var _imgLi = $(this).parent('.ranking-item');
        //     var _cb = _imgLi.find('input[type=checkbox]');
        //     if(_cb.length > 0){
        //         _cb.prop('checked', !_cb.prop('checked'));
        //     }else{
        //         _imgLi.find('._one-click-bookmark:not(.on)').click();
        //     }
        // });
    }

    css +=
        '/* 额外添加样式 */' +

        '._7IVJuWZ {' +
        'position: relative;' +
        // 'background-color: rgba(96, 188, 242, 0.22);' +
        'width: 200px;' +
        'max-height: 272px;' +
        '}';
    var itemClass3 = "_7IVJuWZ";
    var items3 = $('section.column-search-result #js-mount-point-search-result-list div');
    // var items3 = $('#js-mount-point-search-result-list div:eq(0)');
    // var items3 = $('section.column-search-result');
    // console.log('itemClass3-' + itemClass3);
    // console.log(items3);
    $('section.column-search-result').on('DOMNodeInserted', function(e) {
        items3 = $('#js-mount-point-search-result-list div:eq(0)');
        if(items3.length < 1){
            console.log('items3未完成加载');
            return false;
        }else if(items3.find('> div').length > 0){
            console.log('items3完成加载');
            // this.off('DOMNodeInserted');
            // $('section.column-search-result').
            // $('section.column-search-result').unbind();
            $('section.column-search-result').off('DOMNodeInserted');
            fastClick_searchList();
            return true;
        }
    });
    function fastClick_searchList(){

    items3.each(function(i, ele){
        console.log('items:-' + i);
        $(this).find('> div:not(._premium-lead-popular-d-body)').each(function(i, ele){
            console.log('item:-' + i);
            // console.log(ele);
            fastClick_searchListBuild(ele);
        });
        $(this).on('DOMNodeInserted', function(e) {
            //动态加载内容时触发
            // console.log('element now contains: ');
            // console.log(e.target);
            var ele;
            if($(e.target).hasClass('fastClickDiv')){
                // continue;
                return true;
            }else if($(e.target).hasClass(itemClass3)){
                // console.log('element now contains: hasClass');
                // console.log(e.target);
                ele = e.target;
            }else{
                // console.log('element now contains: not hasClass');
            }
            fastClick_searchListBuild(ele);
        });
    });
    console.log('items3:jquery委托点击事件');
    // 让jquery动态绑定
    // items3.on('click', '._one-click-bookmark', function(e){
    //     // 不论事件函数添加顺序都可停止冒泡
    //     e.stopPropagation();
    //     // return false;
    // });
    items3.on('click', '.' + itemClass3, function(e){
        // console.log('fastClickDiv>>>');
        // console.log(this);
        // console.log(e.target);
        if($(e.target).hasClass('_one-click-bookmark')){
            // 收藏按钮应该也是委托在上册，所以不能中断
            return true;
        }
        var _imgLi = $(this);
        var _cb = _imgLi.find('input[type=checkbox]');
        if(_cb.length > 0){
            _cb.prop('checked', !_cb.prop('checked'));
        }else{
            // console.log(_imgLi.find('._one-click-bookmark:not(.on)').get(0));
            _imgLi.find('._one-click-bookmark:not(.on)').click();
        }
    });
    }
    function fastClick_searchListBuild(ele){
        // console.log(ele);
        if(!ele || $(ele).find('.fastClickDiv').length > 0){
            return false;
        }
        var _fcd = fastClickDiv.clone();
        $(ele).prepend(_fcd);
    }

    //收藏星星
    var _bookmarkIcon = $('<div>')
    .prop('type', 'checkbox')
    .addClass('_one-click-bookmark js-click-trackable')
    .attr('data-click-category', 'abtest_www_one_click_bookmark')
    .attr('data-click-action', 'illust')
    .attr('data-click-label', 'id')
    .attr('data-type', 'illust')
    .attr('data-id', 'id')
    .attr('title', '添加收藏');
    console.log($('#illust-recommend ._image-items .image-item ._layout-thumbnail'));

    //右侧推荐列表
    //#illust-recommend
    $('#illust-recommend').on('DOMNodeInserted', function(e) {
        var items = $('#illust-recommend ._image-items .image-item ._layout-thumbnail');
        if(items.length < 1){
            console.log('推荐列表 未完成加载');
        // }else if(items.find('> div').length > 0){
        }else{
            console.log('推荐列表 完成加载');
            $(this).off('DOMNodeInserted');
            // $('#illust-recommend').off('DOMNodeInserted');

            items.each(function(i, ele){
                var img = $(this).find('img');
                var imgUrl = img.prop('src');
                // var imgUrlEnd = imgUrl.match(/(\d+)([^\/]*$)/g);
                var imgId = imgUrl.replace(/^.*\//g, '').replace(/_.*$/g, '');
                var b = _bookmarkIcon.clone();
                b.attr('data-click-label', imgId).attr('data-id', imgId);
                $(this).append(b);
            });
        }
    });

    //作品查看页的添加收藏按钮
    (function addPuls(){
        var add = $('.reaction-container .bookmark-container .add-bookmark');
        if(add.length < 1){
            return false;
        }
        // illust_id
        var illust_id = add.prop('href').replace(/^.*=/g, '');
        add.append(_bookmarkIcon.clone().attr('data-click-label', illust_id).attr('data-id', illust_id));
     })();

//     console.log('？？？');
    var TagTranslation = {

'タイツ' : '裤袜',
'パンスト' : '连裤袜',
'パンスト越しのパンツ' : '连裤袜',
'黒タイツ' : '黑色紧身衣',
'白タイツ' : '白色紧身衣',
'黒スト(ストッキング简写)' : '黑色丝袜',
'黒ストッキング' : '黑色丝袜',
'ニーソックス' : '膝袜',
'ソックス足裏' : '袜子脚底',
'足裏' : '脚底',
'パンスト' : '内裤',
'高品質パンツ' : '高品质裤子',
'ガールズ&パンツ' : '女孩和裤子',
'長手袋' : '？长筒手套',
'ドレス' : '一件衣服',
'ゴスロリ' : '哥特式服装',

'ブチ込みたい尻' : '胸闷屁股屁股',
'尻神様' : '上帝的屁股',
'揉みしだきたい尻' : '摩擦屁股飙升屁股',

'掴みシーツ' : '夹片？夹逼',
'潮吹き' : '喷',
'乳首ピアス' : '乳头耳环',
'首輪' : '项圈',
'調教' : '调教',

// 拘束
'乳出し' : '挤出来',
'乳上げ' : '哺乳',
'オナニー' : '手淫',
'マスターベーション' : '手淫',
'愛液' : '爱液',
'素股' : '股间性交',
'足コキ' : '足交',
'靴コキ' : '鞋交',
'お風呂' : '洗澡',
'胸膝位' : '乳房膝盖？跪着胸贴地',
'尿道' : '尿道',
'尿道責め' : '尿道折磨',
'アナルビーズ' : '肛门珠',
'乳内射精' : '乳交',
'馬乗りパイズリ' : '骑马乳交',
'着衣パイズリ' : '穿衣乳交',

'おっぱい' : '奶，乳房',
'極上の貧乳' : '精致的乳房',
'ロリ巨乳' : 'loli巨乳',
'胸がぱんぱかぱーん' : '乳房铅笔',
'ダイヤモンドバスト' : '钻石胸围',
'母乳' : '母乳',
'搾乳' : '搾乳',
'片乳' : '半乳',

'長髪' : '长发',
'黒髪ロング' : '黑长发',
'黒髪超ロング' : '很长的黑发',
'陰毛' : '阴毛',

'百合' : '百合',
'貝合わせ' : '配合一起',
'男の娘' : '男的女',
'女装' : '女装',
'女装オナニー' : '女装手淫',
'巨根' : '大鸡吧',
'dickgirl' : '爸爸女孩',
'futanari' : '扶他',
'ふたなり' : '雌雄同体',

'コンドーム' : '避孕套',
    }
//     console.log('原翻译的标签' + $('.tags-container .tags .tag a.text:has(.illust-tag-translation)').length);
    $('.tags-container .tags .tag a.text:not(:has(.illust-tag-translation))').each(function(i, ele){
//         var tagText = $(ele).find('a.text');
        var tagObj = $(ele);
        var tagText = $(ele).html();
//         console.log(i + tagText);
        var translationText;
        if(TagTranslation[tagText]){
            translationText = TagTranslation[tagText];
        }else {
            $.each(TagTranslation, function(key, value){
                if(tagText.search(key) != -1){
                    translationText = tagText.replace(key, value);
                    return false;
                }
            });
        }
        if(translationText){
//             console.log('翻译标签+' + translationText);
            tagObj.append($('<span>').addClass('illust-tag-translation').html(translationText));
        }
    })

    /** 最后添加额外的样式 **/
    GM_addStyle(css);
})();

