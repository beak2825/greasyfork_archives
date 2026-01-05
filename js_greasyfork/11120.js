// ==UserScript==
// @id             Snapster@vkopt
// @name           Snapster plugin for VkOpt
// @version        1.3
// @namespace      https://greasyfork.org/users/23
// @author         Pmmlabs@github
// @description    Плагин для VkOpt, добавляющий на сайт ВКонтакте веб-клиент Snapster
// @include        *vk.com*
// @run-at         document-end
// @icon           http://vk.com/images/chronicle/logotype.png
// @noframes
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11120/Snapster%20plugin%20for%20VkOpt.user.js
// @updateURL https://update.greasyfork.org/scripts/11120/Snapster%20plugin%20for%20VkOpt.meta.js
// ==/UserScript==

if (!window.vkopt_plugins) vkopt_plugins={};
(function(){
    var PLUGIN_ID = 'snapster';
    var PEOPLE_PHOTO_SIZE = 262; // Размер квадратных фоток-миниатюр в разделе "Люди"
    vkopt_plugins[PLUGIN_ID]={
        Name: 'Snapster web-client',
        css: '.quadro-photo {width: '+PEOPLE_PHOTO_SIZE+'px; height: '+PEOPLE_PHOTO_SIZE+'px;}' +
        '.hashtag {font-size:2em}' +
        '#snapster_add_table td:first-child {width:10%}' +
        '#snapster_add_table input {width:100%}',
        // СОБЫТИЯ
        init: function(){   // При подключении плагина к Вкопту
            // Добавление нового пункта меню в левое меню
            var menu=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
            menu.appendChild(vkCe('li',{'class':'vk_custom_item'},'<a onclick="return true;" onmousemove="vkMenuHide();" class="left_row vk_custom_link" href="/feed?section=snapster">' +
                '<span class="left_label inl_bl">Snapster</span></a>'));
            // Исправление работы кнопки "Назад"
            var original_popstate = data(window,'events').popstate.shift(); // оригинальный обработчик, который выкидывает на /feed , если section кастомная
            data(window, 'events').popstate.push(function () {
                var objLoc = nav.fromStr(location.href);
                if (objLoc.section == 'snapster' && (objLoc.sub!=nav.objLoc.sub || objLoc.hashtag!=nav.objLoc.hashtag))
                    vkopt_plugins[PLUGIN_ID].switchSection(objLoc.sub, objLoc.hashtag || null);
                else
                    original_popstate();
            });
            // Подгрузка записей при скролле
            if (cur.module=='feed')
                Inj.Start('Feed.showMore','if (cur.section=="snapster") return vkopt_plugins["'+PLUGIN_ID+'"].showMore();');
            //this.onLocation(nav.objLoc)
        },
        onLocation:       function(nav_obj){
            if (nav_obj[0]=='feed' && nav_obj.section=='snapster')
                this.UI(nav_obj.sub, nav_obj.hashtag || null);
        },
        // ПЕРЕМЕННЫЕ
        postTemplate: '<div id="post{post_id}" class="post post_photos post_photos{owner_id}_1" onmouseover="wall.postOver(\'{post_id}\')" onmouseout="wall.postOut(\'{post_id}\')">'+
        '<div class="post_table">'+
            '<div class="post_image">'+
                '<a class="post_image" href="/id{owner_id}"><img src="{avatar}" height="50" width="50"></a>'+
            '</div>'+
            '<div class="post_info">'+
                '<div class="wall_text">'+
                    '<div class="wall_text_name">'+
                        '{name_link}{verified} {friend_status}'+
                    '</div>'+
                    '<div class="wall_post_text">{text}</div>'+
                    '<div class="page_post_sized_thumbs clear_fix">'+
                        '<a href="/photo{photo_id}" onclick="return showPhoto(\'{photo_id}\', \'album{owner_id}_{aid}\', {}, event);" style="width: 537px; height: {height}px;" class="page_post_thumb_wrap page_post_thumb_last_row fl_l"><img src="{src_big}" width="{width}" class="page_post_thumb_sized_photo"></a>'+
                    '</div>{place}' +
                '</div>'+
                '<div class="post_full_like_wrap sm fl_r">'+
                    '<div class="post_full_like">'+
                        '<div class="post_like fl_r" onmouseover="wall.postLikeOver(\'{photoLike_id}\')" onmouseout="wall.postLikeOut(\'{photoLike_id}\')" onclick="vk_skinman.like(\'{photo_id}\'); event.cancelBubble = true;">'+
                            '<span class="post_like_link fl_l" id="like_link{photoLike_id}">Мне нравится</span><i id="like_icon{photoLike_id}"></i>'+
                            '<i class="post_like_icon sp_main  fl_l {mylike}" id="s_like_icon{photo_id}"></i>'+
                            '<span class="post_like_count fl_l" id="s_like_count{photo_id}">{likes}</span>'+
                        '</div>'+
                        '<div class="post_share fl_r" onmouseover="wall.postShareOver(\'{photoLike_id}\')" onmouseout="wall.postShareOut(\'{photoLike_id}\', event)" onclick="vkopt_plugins[\''+PLUGIN_ID+'\'].share(\'{photo_id}\',\'{post_id}\'); event.cancelBubble = true;">'+
                            '<span class="post_share_link fl_l" id="share_link{photoLike_id}">Поделиться</span>'+
                            '<i class="post_share_icon sp_main fl_l" id="share_icon{photoLike_id}"></i>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="replies">'+
                    '<div class="reply_link_wrap sm">'+
                        '<small class="feed_photos_num"><span class="rel_date">{date}</span></small>' +
                        ' | <a onclick="return nav.change({z: \'album{owner_id}_{aid}\'}, event);"  href="/album{owner_id}_{aid}">Альбом</a>'+
                        '{filter}'+
                    '</div>{comments}'+
                '</div>'+
            '</div>'+
        '</div>',
        peopleTemplate: '<div id="post{post_id}" class="post post_photos post_photos{owner_id}_1" onmouseover="wall.postOver(\'{post_id}\')" onmouseout="wall.postOut(\'{post_id}\')">'+
        '<div class="post_table">'+
            '<div class="post_image">'+
                '<a class="post_image" href="/id{owner_id}"><img src="{avatar}" height="50" width="50"></a>'+
            '</div>'+
            '<div class="post_info">'+
                '<div class="wall_text">'+
                    '<div class="wall_text_name">'+
                        '<a class="author" href="/id{owner_id}">{name}</a>{verified} {friend_status}'+
                    '</div>'+
                    '<div class="page_post_sized_thumbs clear_fix">'+
                        '<a href="/photo{photo_id1}" onclick="return showPhoto(\'{photo_id1}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big1}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id2}" onclick="return showPhoto(\'{photo_id2}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big2}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id3}" onclick="return showPhoto(\'{photo_id3}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big3}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id4}" onclick="return showPhoto(\'{photo_id4}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big4}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
        placeTemplate:'<div class="media_desc">' +
        '<a class="page_media_place clear_fix" href="feed?q=near%3A{lat}%2C{long}&section=photos_search" onclick="nav.go(this.href,event)" title="Искать фотографии рядом">' +
            '<span class="fl_l checkin_big"></span>' +
            '<div class="fl_l page_media_place_label" style="width:480px">{place}<br/>{lat},{long}</div>' +
        '</a></div>',
        next_from:0,
        friend_statuses: ['','в друзьях 1','ваш подписчик','в друзьях'],
        // ФУНКЦИИ
        UI: function(subsection, hashtag) {
            if (isVisible(ge('feed_empty'))) {  // делать интерфейс только если его еще нет, т.е. надпись "новостей нет" все еще видна.
                hide(ge('feed_empty'));
                geByTag('a',ge('l_nwsf'))[0].setAttribute('onclick','return true'); // Удаление аякса при щелчке на Новости в левом меню
                clearInterval(cur.updateInt); // Не обновлять ленту стандартными средствами feed
                // Удаление шапки
                var feed_news_bar = ge('feed_news_bar');
                var summary_tabs = geByClass('summary_tab', feed_news_bar);
                for (var i in summary_tabs)
                    feed_news_bar.removeChild(summary_tabs[i]);
                // Формирование шапки. Категории новостей.
                dApi.call('chronicle.getExplore', {}, function (r, response) {
                    response = response.concat(
                        { section: 'recommended', title: 'Рекомендации / Смесь из возможных друзей и популярных пользователей' }
                        , {section: 'people_list', title: 'Список людей / Заглушка для пустой ленты'}
                        , {section: 'feed', title: 'Лента'}
                        , {section: 'search', title: 'Поиск'}
                        , {section: 'messages', title: 'Сообщения'}
                        , {section: 'add', title: 'Добавить'}
                        , {section: 'feedback', title: 'Оповещения'}
                    );
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].section == 'hashtags')
                            vkopt_plugins[PLUGIN_ID].hashtags = response[i].hashtags;
                        feed_news_bar.appendChild(vkCe('div', {'class': 'fl_l summary_tab', 'id':'snapster_'+response[i].section},
                            '<a class="summary_tab2" title="'+response[i].title+'" href="feed?section=snapster&sub=' + response[i].section + '" onclick="if (!checkEvent(event)) {return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'' + response[i].section + '\');}"><div class="summary_tab3"><nobr>' + response[i].title.split('/')[0] + '</nobr></div></a>'));
                    }
                    // По умолчанию загружается "Популярное"
                    vkopt_plugins[PLUGIN_ID].switchSection(subsection || 'popular_country', hashtag);
                });
            }
        },
        share: function (photo_id, post_id) {   // Нажатие на "Поделиться"
            showBox('like.php', {
                act: 'publish_box',
                object: 'photo' + photo_id,
                list: 'feed1_' + post_id,
                to: 'mail'
            }, {stat: ['page.js', 'page.css', 'wide_dd.js', 'wide_dd.css', 'sharebox.js']});
        },
        filterInfo: function (oid, pid) {
            var box=vkAlertBox('',vkBigLdrImg);
            dApi.call('chronicle.getPreset', {
                owner_id: oid,
                photo_id: pid
            }, {
                ok: function (r, response) {
                    box.hide();
                    var html = '<table><tr><td>id:</td><td>'+response.id+'</td></tr>' +
                        '<tr><td>Название:</td><td>'+response.data.name+'</td></tr>' +
                        (response.data.app_version ? '<tr><td>Версия приложения:</td><td>'+response.data.app_version+'</td></tr>' : '') +
                        (response.data.date ?  '<tr><td>Дата:</td><td>'+dateFormat(response.data.date * 1000, "dd.mm.yyyy HH:MM:ss")+'</td></tr>' : '') +
                        '<tr><td>Владелец:</td><td><a href="/id'+response.owner_id+'">id'+response.owner_id+'</a></td></tr>' +
                        '<tr><td>Данные:<br><a id="snpstr_dt">(в консоль)</a></td><td style="max-height:200px;overflow-y:auto;display:block;">'+response.data.preset.toSource()+'</td></tr>' +
                        '</table>';
                    box = vkAlertBox('Информация о фильтре '+oid+'_'+pid, html);
                    ge('snpstr_dt').onclick = function () {
                        console.log(response.data.preset);
                    }
                }, error: function(r, error){
                    box.hide();
                    box = vkAlertBox('Информация о фильтре '+photo_id, 'Нет информации о фильтре<br><pre>'+error.error_msg+'</pre>');
                }
            });
        },
        showMore: function() {  // Подгрузка новых записей; замена для Feed.showMore
            if (cur.isFeedLoading) return;
            cur.isFeedLoading = true;
            show('show_more_progress');
            hide('show_more_link');
            this.switchSection(nav.objLoc.sub,nav.objLoc.hashtag,this.next_from);
        },
        processHashtags: function (text) {  // На самом деле не только теги, а еще смайлики и обращения
            if (window.Emoji && Emoji.emojiToHTML)
                text = Emoji.emojiToHTML(text,true) || text;
            return text.replace(/\[([^\|]+)\|([^\]]+)\]/g,'<a href="/$1">$2</a>')
                .replace(/(#[\wа-яА-Я]+)/g,'<a href="feed?section=snapster&sub=search&hashtag=$1" ' +
                'onclick="return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'search\',\'$1\');">$1</a>');
        },
        createNode: function(template, params){
            for (var i in params)
                template = template.replace(new RegExp('\{'+i+'\}','g'),params[i]);
            template = template.replace(/\{\w+\}/g,'');
            ge('feed_rows').appendChild(vkCe('div', {'class': 'feed_row'}, template));
        },
        switchSection: function(section, hashtag, next_from) {
            if (!ge('feed_rows')) location.reload();    // случай нажатия "назад" не с новостей
            show('feed_progress');
            cur.isFeedLoading = true;
            if (next_from===undefined) {
                ge('feed_rows').innerHTML = '';
                removeClass(geByClass('summary_tab_sel')[0], 'summary_tab_sel');    // переключение активной вкладки
                addClass('snapster_' + section, 'summary_tab_sel');
            }
            var postTemplate = this.postTemplate;
            var peopleTemplate = this.peopleTemplate;
            var fields = 'name,screen_name,photo_50,friend_status,verified';
            switch (section) {
                case 'hashtags':
                    if (hashtag) {
                        dApi.call('chronicle.getExploreSection', {
                            'section': 'hashtag',
                            'count': 30,
                            'start_from': next_from || 0,
                            //'title': title,
                            'fields': fields,
                            'hashtag': hashtag
                        }, vkopt_plugins[PLUGIN_ID].renderPosts);
                    } else {    // Популярные хэштеги
                        if (!next_from) for (var i = 0; i < this.hashtags.length; i++) {
                            var photo = this.hashtags[i].photo.top_photo;
                            var oid = photo.split('_')[0];
                            var pid = photo.split('_')[1];
                            this.createNode(postTemplate, {
                                owner_id: oid,
                                post_id: '1_' + oid,
                                photo_id: photo,
                                photoLike_id: oid + '_photo' + pid,
                                src_big: this.hashtags[i].photo.src,
                                name_link: '<a class="hashtag" href="feed?section=snapster&sub=hashtags&hashtag=' + this.hashtags[i].hashtag +
                                        '" onclick="return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'hashtags\',\'' + this.hashtags[i].hashtag +
                                        '\');">' + this.hashtags[i].hashtag + '</a>',
                                aid: 0,
                                avatar: '/images/chronicle/icon_' + (i % 5 + 1) + '.png', // В качестве аватара - картинка из набора иконок snapster
                                height: this.hashtags[i].photo.height * 537 / this.hashtags[i].photo.width,
                                width: 537
                            });
                        }
                        this.afterLoad('');
                    }
                    break;
                case 'people':
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        'start_from': next_from || 0,
                        //'count': count,
                        'fields': 'name,photo_50,friend_status,verified'
                    }, function (r, response) {
                        // Рендер постов-людей
                        for (var i = 0; i < response.items.length; i++) {
                            var item = response.items[i];
                            vkopt_plugins[PLUGIN_ID].createNode(peopleTemplate,{
                                    owner_id: item.profile.uid,
                                    post_id: '1_' + item.profile.uid + '_' + item.photos[0].created,
                                    photo_id1: item.photos[0].owner_id + '_' + item.photos[0].pid,
                                    photo_id2: item.photos[1].owner_id + '_' + item.photos[1].pid,
                                    photo_id3: item.photos[2].owner_id + '_' + item.photos[2].pid,
                                    photo_id4: item.photos[3].owner_id + '_' + item.photos[3].pid,
                                    src_big1: item.photos[0].src_big,
                                    src_big2: item.photos[1].src_big,
                                    src_big3: item.photos[2].src_big,
                                    src_big4: item.photos[3].src_big,
                                    name: item.profile.first_name+' '+item.profile.last_name,
                                    size: vkopt_plugins[PLUGIN_ID].PEOPLE_PHOTO_SIZE,
                                    avatar: item.profile.photo_50,
                                    friend_status: item.profile.friend_status ? '<span class="explain">('+vkopt_plugins[PLUGIN_ID].friend_statuses[item.profile.friend_status]+')</span>' : '',
                                    verified: item.profile.verified ? '<span class="vk_profile_verified"></span>' : ''
                            });
                        }
                        vkopt_plugins[PLUGIN_ID].afterLoad(response.next_from);
                    });
                    break;
                case 'people_list':
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        'start_from': next_from || 0,
                        //'count': 12,
                        'fields': fields+',photo_100,photo_200,photo_400_orig,sex,status,photo_id'
                    }, function (r, response) {
                         //Рендер постов-людей
                        for (var i = 0; i < response.profiles.length; i++) {
                            var item = response.profiles[i];
                            vkopt_plugins[PLUGIN_ID].createNode(postTemplate, {
                                    owner_id: item.uid,
                                    post_id: '1_' + item.uid,
                                    photo_id: item.photo_id || item.uid+'_0',
                                    photoLike_id: item.photo_id ? item.photo_id.replace('_','_photo') : item.uid+'_photo0',
                                    text: vkopt_plugins[PLUGIN_ID].processHashtags(item.status),
                                    src_big: item.photo_400_orig || item.photo_200 || item.photo_100 || item.photo_50,
                                    name_link: '<a class="author" href="/id'+item.uid+'">'+item.first_name+' '+item.last_name+'</a>',
                                    aid: '0',
                                    avatar: item.photo_50,
                                    friend_status: item.friend_status ? '<span class="explain">('+vkopt_plugins[PLUGIN_ID].friend_statuses[item.friend_status]+')</span>' : '',
                                    verified: item.verified ? '<span class="vk_profile_verified"></span>' : '',
                                    height: 300
                            });
                        }
                        vkopt_plugins[PLUGIN_ID].afterLoad(response.next_from);
                    });
                    break;
                case 'feed':
                    if (next_from === undefined) {
                        ge('feed_rows').appendChild(vkCe('div', {id: 'vk_snapster_own'}));
                        stManager.add(['ui_controls.js'],function() {
                            new Checkbox(ge("vk_snapster_own"), {
                                checked: window.vk_snapster_own,
                                label: 'Только из Snapster',
                                onChange: function (state) {
                                    window.vk_snapster_own = (state == 1);
                                    vkopt_plugins[PLUGIN_ID].switchSection(section);
                                }
                            });
                        });
                    }
                    dApi.call('chronicle.getFeed', {
                        'likes_count': 0,
                        'start_from': next_from || 0,
                        'count': 10,
                        'own': intval(window.vk_snapster_own),
                        'fields': fields,
                        'v': '5.13'
                    }, function (r, response) {
                        var profiles = {};  // Более удобный объект с профилями
                        for (var i = 0, profLen=response.profiles.length; i < profLen; i++)
                            profiles[response.profiles[i].id] = response.profiles[i];
                        // Рендер постов
                        for (var j = 0, itemsLen = response.items.length; j < itemsLen; j++) {
                            var item = response.items[j];
                            for (var i = 0, photosLen = item.photos.items.length; i < photosLen; i++) {
                                var photo = item.photos.items[i];
                                vkopt_plugins[PLUGIN_ID].createNode(postTemplate, {
                                    owner_id: item.source_id,
                                    post_id: '1_' + item.source_id + '_' + item.post_id,
                                    photo_id: photo.owner_id + '_' + photo.id,
                                    photoLike_id: photo.owner_id + '_photo' + photo.id,
                                    text: vkopt_plugins[PLUGIN_ID].processHashtags(photo.text),
                                    src_big: photo.sizes[photo.sizes.length-1].src,
                                    name_link: '<a class="author" href="/' + profiles[item.source_id].screen_name + '">' + profiles[item.source_id].first_name + ' ' + profiles[item.source_id].last_name + '</a>',
                                    date: dateFormat(photo.date * 1000, "dd.mm.yyyy HH:MM:ss"),
                                    aid: ((photo.album_id || '0000')+'').replace('-61','00000').replace('-62','0000').replace('-6','0').replace('-7','00').replace('-15','000'),
                                    likes: photo.likes ? photo.likes.count : '',
                                    mylike: photo.likes && photo.likes.user_likes ? 'my_like' : '',
                                    avatar: profiles[item.source_id].photo_50,
                                    verified: profiles[item.source_id].verified ? '<span class="vk_profile_verified"></span>' : '',
                                    place: photo.lat ? vkopt_plugins[PLUGIN_ID].placeTemplate.replace(/\{lat\}/g, photo.lat)
                                                                            .replace(/\{long\}/g, photo.long)
                                                                            .replace(/\{place\}/g, photo.place || ''):'',
                                    filter: photo.has_filter ? ' | <a onclick="vkopt_plugins[\'' + PLUGIN_ID + '\'].filterInfo(' + photo.owner_id + ',' + photo.id + ');">О фильтре</a>' : '',
                                    height: photo.sizes[photo.sizes.length-1].height * 537 / photo.sizes[photo.sizes.length-1].width,
                                    width: 537
                                });
                            }
                        }
                        vkopt_plugins[PLUGIN_ID].afterLoad(response.next_from || '');
                    });
                    break;
                case 'messages':
                    dApi.call('chronicle.getMessages', {}, function (r, response) {
                        stManager.add('im.css');    // Нужно для картиночки с таймером
                        var new_response = {items: [], profiles: response.profiles};
                        for (var i = 1, itemsLen = response[0]; i <= itemsLen; i++) { // Перегруппировка данных для использования функции рендера постов
                            if (response[i].timer)
                                response[i].photo.text = '<div class="im_row_attach" title="Самоудаляющаяся фотография"><div class="im_attach_chronicle"></div>' + response[i].timer + ' сек.</div>' + response[i].photo.text;
                            new_response.items[i - 1] = response[i].photo;
                        }
                        vkopt_plugins[PLUGIN_ID].renderPosts(r, new_response);
                    });
                    break;
                case 'feedback':
                    dApi.call('chronicle.getFeedback', {
                        'count': 20,
                        'start_from': next_from || 0,
                        'fields': fields
                    }, function (r, response) {
                        var profiles = {};  // Более удобный объект с профилями
                        for (var i = 0, profLen = response.profiles.length; i < profLen; i++)
                            profiles[response.profiles[i].uid] = response.profiles[i];
                        var new_response = {items: [], profiles: response.profiles};
                        for (var i = 0, itemsLen = response.items.length; i < itemsLen; i++) { // Перегруппировка данных для использования функции рендера постов
                            new_response.items[i] = response.items[i].photo || {};
                            new_response.items[i].created = response.items[i].date;
                            switch (response.items[i].type) {
                                case 'snap_received':
                                    var profile = profiles[response.items[i].users[0]];
                                    new_response.items[i].text = 'Входящее от ' +
                                        '<a class="author" href="/' + profile.screen_name + '">' + profile.first_name + ' ' + profile.last_name + '</a><br/>' +
                                        new_response.items[i].text;
                                    break;
                                case 'snap_sent':
                                    var profile = profiles[response.items[i].actions[0].user_id];
                                    new_response.items[i].text = 'Исходящее для ' +
                                        '<a class="author" href="/' + profile.screen_name + '">' + profile.first_name + ' ' + profile.last_name + '</a> (' + (response.items[i].actions[0].state == 'view' ? '' : 'не ') + 'прочитано)<br/>' +
                                        new_response.items[i].text;
                                    new_response.profiles.push({
                                        uid: response.items[i].photo.owner_id,
                                        first_name: 'Я',
                                        last_name: '',
                                        screen_name: 'id'+vk.id,
                                        photo_50: '/images/address_icon.gif'
                                    });
                                    break;
                                case 'follow':
                                case 'friend_accepted':
                                    var profile = profiles[response.items[i].users[0]];
                                    new_response.items[i].owner_id = response.items[i].users[0];
                                    new_response.items[i].height = 1;
                                    new_response.items[i].text = 'Новый подписчик: ' +
                                        '<a class="author" href="/' + profile.screen_name + '">' + profile.first_name + ' ' + profile.last_name + '</a> (type: ' + response.items[i].type + ')';
                                    break;
                                case 'comment_photo':
                                    new_response.items[i].owner_id = response.items[i].feedback_comment.from_id
                                        || response.items[i].feedback_comment.owner_id
                                        || response.items[i].feedback_comment.uid;
                                    new_response.items[i].width_override = 100;
                                    new_response.items[i].text = response.items[i].feedback_comment.text;
                                    break;
                                case 'like_photo':
                                    var profile = profiles[response.items[i].users[0]];
                                    new_response.items[i].text = 'Лайк от ' +
                                        '<a class="author" href="/' + profile.screen_name + '">' + profile.first_name + ' ' + profile.last_name + '</a><br/>';
                                    new_response.items[i].width_override = 100;
                                    break;
                                default:
                                    console.log(response.items[i]);
                                    new_response.items[i].text = 'default! see console!<br/>' + new_response.items[i].text;
                            }
                        }
                        vkopt_plugins[PLUGIN_ID].renderPosts(r, new_response);
                    });
                    break;
                case 'search':  // Поиск
                    if (next_from === undefined) {  // Не подгрузка. Создание поля для ввода поискового запроса.
                        ge('feed_rows').appendChild(vkCe('input', {
                            'type': 'text',
                            'class': 'text search',
                            'style': 'width: 95%',
                            'placeholder': IDL('mMaS'),
                            'value': hashtag || '',
                            'onkeyup': 'if (event.keyCode == 10 || event.keyCode == 13) vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'' + section + '\',val(this))'
                        }));
                    }
                    if (hashtag)    // hashtag - поисковый запрос
                        dApi.call('chronicle.search', {
                            'q': hashtag,
                            'start_from': next_from || 0,
                            'count': 10,
                            'fields': fields
                        }, vkopt_plugins[PLUGIN_ID].renderPosts);
                    else
                        vkopt_plugins[PLUGIN_ID].afterLoad('');
                    break;
                case 'add': //Добавить
                    if (vVersion < 232)
                        vkMsg("Добавление фотографий возможно только при использовании VkOpt версии 2.3.2 и выше", 7000);
                    var html = '<h2>' + IDL('add') + '</h2><table id="snapster_add_table">\
                        <tr><td>Описание:</td><td> <input type="text" class="text" id="snapster_add_caption" placeholder="Описание..."></td></tr>\
                        <tr><td>Фильтр:</td><td> <input type="text" class="text" id="snapster_add_filter" placeholder="В формате oid_fid"></td></tr>\
                        <tr><td>Получатели:</td><td> <input type="text" class="text" id="snapster_add_message" placeholder="id через запятую (для отправки личным сообщением)"></td></tr>\
                        <tr><td>Таймер:</td><td> <input type="text" class="text" id="snapster_add_timer" placeholder="Количество секунд (для самоуничтожающейся фотографии)"></td></tr>\
                        <tr><td>Файл:</td><td><input type="file" class="text" id="fakeupload"></td></table>\
                        <div id="snapster_add_invk"></div><div id="snapster_add_wall"></div>\
                        <center><button id="snapster_add_button" class="flat_button">Отправить</button></center>';
                    ge('feed_rows').appendChild(vkCe('div', {}, html));
                    stManager.add(['ui_controls.js'],function(){
                        new Checkbox(ge("snapster_add_wall"), {
                            checked: false,
                            label: 'Опубликовать на стене'
                        });
                        new Checkbox(ge("snapster_add_invk"), {
                            checked: true,
                            label: 'Добавить во ВКонтакте'
                        });
                    });
                    dApi.call('chronicle.getUploadServer', {}, function (r, response) {
                        ge('snapster_add_button').onclick = function () {
                            vkopt_plugins[PLUGIN_ID].submitFile(response.upload_url);
                        };
                        vkopt_plugins[PLUGIN_ID].afterLoad('');
                    });
                    break;
                default : //    'recommended', 'popular_country', other...
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        'count': 20,
                        'start_from': next_from || 0,
                        'fields': fields
                    }, vkopt_plugins[PLUGIN_ID].renderPosts);
                    break;
            }
            document.title = 'Snapster - '+section+(hashtag ? ' - '+hashtag : '');
            nav.setLoc({'0':'feed','section':'snapster','sub':section,'hashtag':hashtag});
            return false;
        },
        renderPosts: function (r, response) {   // Рендеринг постов в категориях "Популярное", "Рекомендации" и "Конкретный хештег"
            var profiles = {};  // Более удобный объект с профилями
            for (var i = 0, profLen = response.profiles.length; i < profLen; i++)
                profiles[response.profiles[i].uid] = response.profiles[i];
            // Рендер постов
            for (var i = 0, itemsLen = response.items.length; i < itemsLen; i++) {
                var item = response.items[i];
                // Комменты
                var comments = '';
                if (item.comments) {
                    comments = '<div class="clear"><div id="replies'+item.owner_id + '_' + item.pid+'">';
                    for (var j=item.comments.length-1;j>0;j--)
                        if (item.comments[j].text)
                            comments+='<div class="reply" style="padding:3px">'+
                                '<div class="reply_table">'+
                                    '<a class="reply_image" href="/id'+profiles[item.comments[j].uid].screen_name+'" style="margin:3px">'+
                                        '<img src="'+profiles[item.comments[j].uid].photo_50+'" class="reply_image" height="50" width="50">'+
                                    '</a>'+
                                    '<div class="reply_info">'+
                                        '<div class="reply_text">'+
                                            '<a class="author" href="/'+profiles[item.comments[j].uid].screen_name+'">'+profiles[item.comments[j].uid].first_name+' '+profiles[item.comments[j].uid].last_name+'</a>'+
                                                '<div class="wall_reply_text">'+vkopt_plugins[PLUGIN_ID].processHashtags(item.comments[j].text)+'</div>'+
                                        '</div>'+
                                        '<div class="info_footer sm">'+
                                                dateFormat(item.comments[j].date * 1000, "dd.mm.yyyy HH:MM")+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                    comments+='</div></div>';
                }
                if (item && typeof item == 'object') vkopt_plugins[PLUGIN_ID].createNode(vkopt_plugins[PLUGIN_ID].postTemplate, {
                    owner_id: item.owner_id,
                    post_id: '1_' + item.owner_id + '_' + item.created,
                    photo_id: item.owner_id + '_' + item.pid,
                    photoLike_id: item.owner_id + '_photo' + item.pid,
                    text: vkopt_plugins[PLUGIN_ID].processHashtags(item.text),
                    src_big: item.src_big || item.src || item.src_blur,
                    name_link: '<a class="author" href="/' + profiles[item.owner_id].screen_name + '">' + profiles[item.owner_id].first_name + ' ' + profiles[item.owner_id].last_name + '</a>',
                    date: dateFormat(item.created * 1000, "dd.mm.yyyy HH:MM:ss"),
                    aid: ((item.aid || '0000')+'').replace('-61','00000').replace('-62','0000').replace('-6','0').replace('-7','00').replace('-15','000'),
                    likes: item.likes ? item.likes.count : '',
                    mylike: item.likes && item.likes.user_likes ? 'my_like' : '',
                    avatar: profiles[item.owner_id].photo_50,
                    friend_status: profiles[item.owner_id].friend_status ? '<span class="explain">('+vkopt_plugins[PLUGIN_ID].friend_statuses[profiles[item.owner_id].friend_status]+')</span>' : '',
                    verified: profiles[item.owner_id].verified ? '<span class="vk_profile_verified"></span>' : '',
                    place: item.lat ? vkopt_plugins[PLUGIN_ID].placeTemplate.replace(/\{lat\}/g, item.lat)
                                                                            .replace(/\{long\}/g, item.long)
                                                                            .replace(/\{place\}/g, item.place || ''):'',
                    comments: comments,
                    filter: item.has_filter ? ' | <a onclick="vkopt_plugins[\''+PLUGIN_ID+'\'].filterInfo('+item.owner_id+','+item.pid+');">О фильтре</a>' : '',
                    height: (item.height || 537) * (item.width_override || 537) / (item.width || 537),
                    width: item.width_override || 537
                });
            }
            vkopt_plugins[PLUGIN_ID].afterLoad(response.next_from);
        },
        afterLoad: function(next_from) {
            hide('feed_progress');
            hide('show_more_progress');
            cur.isFeedLoading = false;
            if (next_from) {    // Если есть ещё
                this.next_from = next_from;
                show('show_more_link');
                hide('all_shown');
            } else {            // Если больше нет
                hide('show_more_link');
                show('all_shown');
            }
            cur.idleManager.isIdle=false; // для правильной работы обработчика события scroll
        },
        submitFile: function (server_url) {
            vkLdr.show();
            function toFormData(data) {
                var header = '--' + boundary + '\r\nContent-Disposition: form-data; name="file1"; filename="file1.jpg"\r\nContent-Type: image/jpeg\r\n\r\n';
                var footer = '\r\n--' + boundary + '--\r\n';
                var result = [];

                var str2bytes = function (str) {
                    for (var i = 0, strLen=str.length; i < strLen; i++) {
                        result.push(str.charCodeAt(i) & 0xff);
                    }
                };

                str2bytes(header);
                for (var i = 0, dataLen = data.length; i < dataLen; i++) {
                    result.push(data[i]);
                }
                str2bytes(footer);

                return result;
            }

            var file = ge('fakeupload').files[0];
            if (file) {
                var reader = new FileReader();
                var boundary = "--snapster.user.js--by--pmmlabs";
                reader.onload = function (e) {
                    vk_aj.ajax({
                            method: 'POST',
                            headers: {'Content-type': 'multipart/form-data; boundary=' + boundary},
                            url: server_url,
                            data: toFormData(new Uint8Array(e.target.result))
                        }, function (a) {
                            var saveInfo = JSON.parse(a.text);
                            dApi.call('chronicle.save', {
                                server: saveInfo.server,
                                hash: saveInfo.hash,
                                photos_list: saveInfo.photos_list,
                                caption: val(ge('snapster_add_caption')),
                                filter: val(ge('snapster_add_filter')),
                                //comment: 1,   // Что даёт? непонятно. Но что-то даёт.
                                wall: val(ge('snapster_add_wall')),
                                no_vk: intval(!val(ge('snapster_add_invk'))),
                                timer: val(ge('snapster_add_timer')),
                                mail: intval(!!val(ge('snapster_add_message'))),
                                mail_to: val(ge('snapster_add_message'))
                            }, function (r, response) {
                                vkLdr.hide();
                                if (response[0].is_mail)
                                    vkMsg('Фотография отправлена');
                                else
                                    showPhoto(response[0].owner_id + '_' + response[0].pid, 'album' + response[0].owner_id + '_' + response[0].aid, {});
                            });
                        }
                    );
                };
                reader.readAsArrayBuffer(file);
            } else
                vkMsg('Не выбран файл');
        }
    };
    if (window.vkopt_ready) vkopt_plugin_run(PLUGIN_ID);
})();