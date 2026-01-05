// ==UserScript==
// @name        Lovely Lofter
// @namespace   Nb-Illuminar
// @description   Filter unwanted posts on Lofter timeline.
// @match     http://www.lofter.com/*
// @include     http://www.lofter.com/*
// @author    Nb
// @license     MIT
// @version     0.6.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21317/Lovely%20Lofter.user.js
// @updateURL https://update.greasyfork.org/scripts/21317/Lovely%20Lofter.meta.js
// ==/UserScript==


/**
 * Created by Kevin/Nb on 30/6/2015.
 * Updated on 2/7/2015.
 *
 * Lovely Lofter tag filter.
 * Ver 0.6.1, released under MIT Licence.
 */


// root namespace for utilities
var utilities = {

    // constants
    _PAGE_LOADED: false,
    _SESSION_LOG: [],
    _VERSION: '0.6.1',
    _BUILD: '1L9R11',


    local_debug: false,

    last_operation: Date.now(),


    // get body
    get_body: function () {
        return document.getElementsByTagName('body')[0];
    },


    // get envrionment information
    get_environment: function () {
        return {
            java_enabled: navigator.javaEnabled(),
            language: navigator.language,
            supported_mime_types: navigator.mimeTypes,
            online_state: navigator.onLine,
            plugins: navigator.plugins,
            user_agent: navigator.userAgent,
            browser: navigator.appName,
            browser_internal_name: navigator.appCodeName,
            browser_version: navigator.appVersion,
            cookie_enabled: navigator.cookieEnabled,
            platform: navigator.platform
        }
    },


    // get meta information about the script itself
    get_script_meta: function () {
        return {
            version: utilities._VERSION,
            build: utilities._BUILD
        }
    },


    // get current time and date
    // in the format of YYYY.MM.DD HH:MM:SS
    get_date_and_time: function () {
        var datetime = new Date();
        var date_string = '';
        var time_string = '';

        date_string += String(datetime.getFullYear());
        date_string += '.';

        var month = datetime.getMonth() + 1;
        var day = datetime.getDate();
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        var second = datetime.getSeconds();

        if (month < 10) {
            date_string += '0';
        }
        date_string += String(month);
        date_string += '.';

        if (day < 10) {
            date_string += '0';
        }
        date_string += String(day);

        if (hour < 10) {
            time_string += '0';
        }
        time_string += String(hour);
        time_string += ':';

        if (minute < 10) {
            time_string += '0';
        }
        time_string += String(minute);
        time_string += ':';

        if (second < 10) {
            time_string += '0';
        }
        time_string += String(second);

        return ''.concat(date_string, ' ', time_string);
    },


    // log agent
    // save the log into session feedback pool and
    // output to the console as normal as well
    log: function (info) {
        this._SESSION_LOG.push({
            time: this.get_date_and_time(),
            url: location.href,
            log: info
        });
        console.log(info);
    },


    // get all log of this session
    // stored in the log agent
    get_session_log: function () {
        var script_meta = this.get_script_meta();
        var script_string = [
            'Lovely Lofter 過濾工具版本',
            [script_meta.version, '@', script_meta.build].join(''),
            '\n'
        ].join('\n');

        var env_info = this.get_environment();
        var env_string = [
            '瀏覽器', env_info.browser, '\n',
            '瀏覽器版本', env_info.browser_version, '\n',
            '瀏覽器內部名稱', env_info.browser_internal_name, '\n',
            'User-Agent 字串', env_info.user_agent, '\n',
            '平臺', env_info.platform, '\n',
            '語言', env_info.language, '\n',
            'Cookie 啓用狀態', env_info.cookie_enabled == true ? '已啓用' : '未啓用', '\n',
            'Java 啓用狀態', env_info.java_enabled == true ? '已啓用' : '未啓用', '\n',
            '網絡連線狀態', env_info.online_state == true ? '已連線' : '未連線', '\n',
            '支援的 MIME 類型', (function () {
                var mime_type_string = [];
                for (var i = 0; i < env_info.supported_mime_types.length; i++) {
                    var mime_type = env_info.supported_mime_types[i];
                    mime_type_string.push([
                        mime_type.type, ' >> ', mime_type.description
                    ].join(''));
                }
                return mime_type_string.join('\n');
            })(), '\n'
        ].join('\n');

        var log_pool = [];
        for (var i = 0; i < this._SESSION_LOG.length; i++) {
            var log_entry = this._SESSION_LOG[i];
            log_pool.push(
                [log_entry.time, log_entry.url, String(log_entry.log), '\n'].join('\n')
            )
        }

        return [script_string, env_string, log_pool.join('\n')].join('\n')
    }
};


// root namespace of lovely lofter
var lovely_lofter = {
    // target tag list
    target_tag: [],

    // target auhtor list
    target_author: [],

    // target post pool
    target_post_pool: [],
    target_post_dummy_pool: [],

    // parse post from primitive HTML node
    parse_post: function (post_node) {
        var title_node = post_node.getElementsByClassName('tit')[0];
        var content_node = post_node.getElementsByClassName('txt')[1];
        var tag_node = post_node.getElementsByClassName('opta')[0];
        var author_node = post_node.getElementsByClassName('w-who')[0];
        var time_node = post_node.getElementsByClassName('isayc')[0];
        var raw_content_node = post_node.getElementsByClassName('cnt')[0];
        var comment_node = post_node.getElementsByClassName('m-cmt')[0];

        if (raw_content_node === undefined) {
            return null;
        }
        var image_node = raw_content_node.getElementsByTagName('img');

        // music post sometime has only one 'txt' node
        // at this time fallback to the first node
        if (content_node === undefined) {
            content_node = post_node.getElementsByClassName('txt')[0];
        }

        // if any of the necessary attributes of a post is not found
        // then the parse is failed and null is returned
        if (content_node === undefined || tag_node === undefined || author_node === undefined) {
            return null;
        } else {
            return {
                node: post_node,

                // image post may not have a title
                title: (function () {
                    if (title_node === undefined) {
                        return '';
                    } else {
                        return title_node.textContent;
                    }
                })(),

                content: content_node.textContent,

                content_raw: (function () {
                    var content_html = content_node.innerHTML;
                    if (content_html.indexOf('href') != -1) {
                        return content_html;
                    } else {
                        return '';
                    }
                })(),

                comment: (function () {
                    if (comment_node === undefined) {
                        return [];
                    }
                    var comment_nodes = comment_node.getElementsByClassName('cmthot');
                    var comment_pool = [];

                    for (var i = 0; i < comment_nodes.length; i++) {
                        var comment_user_node = comment_nodes[i].getElementsByClassName('cmtusr')[0];
                        var comment_string = '';

                        // parse comment user node
                        var comment_users = comment_user_node.getElementsByClassName('xtag');
                        var found_one_user = false;
                        var found_another_user = false;
                        for (var k = 0; k < comment_users.length; k++) {
                            if (!found_one_user) {
                                if (comment_users[k].hasAttribute('href')) {
                                    comment_string += comment_users[k].textContent;
                                    comment_string += ' ';
                                    found_one_user = true;
                                }
                            } else {
                                if (!found_another_user) {
                                    if (comment_users[k].hasAttribute('href')) {
                                        comment_string += '回复了 ';
                                        comment_string += comment_users[k].textContent;
                                        comment_string += ' ';
                                        found_another_user = true;
                                    }
                                }
                            }
                        }

                        // parse comment content
                        var comment_content = comment_nodes[i].children;
                        for (var l = 0; l < comment_content.length; l++) {
                            var xd = comment_content[l];
                            if (xd.tagName == 'SPAN' && xd.className == 'xtag') {
                                comment_string += comment_content[l].textContent;
                            }
                        }

                        comment_pool.push(comment_string);
                    }
                    return comment_pool;
                })(),

                tag: (function () {
                    var tag_node_list = tag_node.getElementsByClassName('opti');
                    var tag_list = [];
                    for (var i = 0; i < tag_node_list.length; i++) {
                        var current_tag = tag_node_list[i].getElementsByClassName('span')[0];
                        if (current_tag === undefined) {
                            tag_list.push(tag_node_list[i].textContent);
                        } else {
                            tag_list.push(tag_node_list[i].getElementsByTagName('span')[0].textContent);
                        }
                    }
                    return tag_list;
                })(),

                author: author_node.getElementsByTagName('a')[0].textContent,

                image: (function () {
                    var image_src_pool = [];
                    for (var i = 0; i < image_node.length; i++) {
                        var image = image_node[i];
                        var src = image.getAttribute('src');
                        if (src === undefined || src === null || image_src_pool.indexOf(src) != -1) {
                            continue;
                        }
                        image_src_pool.push(src);
                    }
                    return image_src_pool;
                })(),

                time: time_node.getAttribute('title').split('查看全文 - ')[1],

                origin: time_node.getAttribute('href')
            };
        }
    },

    // parse post from primitive HTML node
    parse_post_old: function (post_node) {
        var title_node = post_node.getElementsByClassName('tit')[0];
        var content_node = post_node.getElementsByClassName('txt')[1];
        var tag_node = post_node.getElementsByClassName('opta')[0];
        var author_node = post_node.getElementsByClassName('w-who')[0];

        // music post sometime has only one 'txt' node
        // at this time fallback to the first node
        if (content_node === undefined) {
            content_node = post_node.getElementsByClassName('txt')[0];
        }

        // if any of the necessary attributes of a post is not found
        // then the parse is failed and null is returned
        if (content_node === undefined || tag_node === undefined || author_node === undefined) {
            return null;
        } else {
            return {
                node: post_node,

                // image post may not have a title
                title: (function () {
                    if (title_node === undefined) {
                        return '';
                    } else {
                        return title_node.textContent;
                    }
                })(),

                content: content_node.textContent,

                tag: (function () {
                    var tag_node_list = tag_node.getElementsByClassName('opti');
                    var tag_list = [];
                    for (var i = 0; i < tag_node_list.length; i++) {
                        var current_tag = tag_node_list[i].getElementsByClassName('span')[0];
                        if (current_tag === undefined) {
                            tag_list.push(tag_node_list[i].textContent);
                        } else {
                            tag_list.push(tag_node_list[i].getElementsByTagName('span')[0].textContent);
                        }
                    }
                    return tag_list;
                })(),

                author: author_node.getElementsByTagName('a')[0].textContent
            };
        }
    },

    save_to_cloud: function () {
        utilities.log('Save to cloud requested on ' + Date.now());
        utilities.last_operation = Date.now();
        utilities.log('Session begin');
        utilities.log(lovely_lofter.target_post_pool);
        var counter = 0;
        for (var i = 0; i < lovely_lofter.target_post_pool.length; i++) {
            var post = lovely_lofter.target_post_pool[i];

            var form_data = new FormData();
            form_data.append('author', post.author);
            form_data.append('title', post.title);
            form_data.append('content', post.content);
            form_data.append('tag', JSON.stringify(post.tag));
            form_data.append('time', post.time);
            form_data.append('capture_time', utilities.get_date_and_time());
            form_data.append('image', JSON.stringify(post.image));
            form_data.append('content_raw', post.content_raw);
            form_data.append('comment', JSON.stringify(post.comment));
            form_data.append('origin', post.origin);

            var xml_request = new XMLHttpRequest();
            if (utilities.local_debug) {
                xml_request.open('POST', 'http://127.0.0.1:5000/api/cyan/lofter/archive/', true);
            } else {
                xml_request.open('POST', 'https://illuminar-estrellas.rhcloud.com/api/cyan/lofter/archive/', true);
            }

            xml_request.send(form_data);
            utilities.log('Saved *' + post.title + '*');
        }

        // clear the pool
        utilities.log('已分析 ' + lovely_lofter.target_post_pool.length + ' 篇文章，已保存 ' + counter + ' 篇文章。');
        lovely_lofter.target_post_pool = [];
        lovely_lofter.target_post_dummy_pool = [];
        utilities.last_operation = Date.now();
    }
};


// root namespace for lovely lofter filter
var lovely_lofter_filter = {

    // constants
    STORAGE_ID: 'lovely_lofter_filter',
    _LOCAL_SETTINGS: null,
    _LEGAL_SETTINGS_KEY: ['unwanted_tags', 'unwanted_authors', 'unwanted_keywords', 'show_notification'],


    // initialise local settings
    _initialise_local_settings: function () {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify({
            unwanted_tags: [],
            unwanted_authors: [],
            unwanted_keywords: [],
            show_notification: true
        }));
        utilities.log('本地設置已初始化。')
    },


    // load settings
    load_local_settings: function () {
        var local_settings_raw = localStorage.getItem(this.STORAGE_ID);
        if (!local_settings_raw) {
            this._initialise_local_settings();
        } else {
            try {
                var local_settings = JSON.parse(local_settings_raw);
                if (local_settings['show_notification'] === undefined || local_settings['unwanted_tags'] === undefined) {
                    utilities.log('本地設置不完整，需要重新初始化。');
                    this._initialise_local_settings();
                } else if (local_settings['unwanted_authors'] === undefined || local_settings['unwanted_keywords'] === undefined) {
                    utilities.log('本地設置版本過低，需要升級。');
                    local_settings['unwanted_authors'] = [];
                    local_settings['unwanted_keywords'] = [];
                    localStorage.setItem(this.STORAGE_ID, JSON.stringify(local_settings));
                    utilities.log('本地設置已升級。');
                }
            } catch (e) {
                utilities.log('本地設置已損毀，需要重新初始化。');
                this._initialise_local_settings();
            }
        }

        // local settings and frequently used items projection
        this._LOCAL_SETTINGS = JSON.parse(localStorage.getItem(this.STORAGE_ID));
        utilities.log('會話設置已自本地加載。');
    },


    // reload settings
    reload_local_settings: function () {
        this._LOCAL_SETTINGS = JSON.parse(localStorage.getItem(this.STORAGE_ID));
        utilities.log('會話設置已自本地重新加載。');
    },


    // save local settings
    save_local_settings: function () {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(this._LOCAL_SETTINGS));
        utilities.log('會話設置已儲存至本地。');
        this.reload_local_settings();
    },


    // update local settings
    update_local_settings: function (settings_key, settings_value) {
        if (this._LEGAL_SETTINGS_KEY.indexOf(settings_key) != -1) {
            this._LOCAL_SETTINGS[settings_key] = settings_value;
            utilities.log('會話設置已更新：' + settings_key + ' = ' + settings_value + '。');
            this.save_local_settings();
        }
    },


    // get local settings
    get_local_settings: function (settings_key) {
        return this._LOCAL_SETTINGS[settings_key];
    },


    // filter all posts on the page
    filter: function () {
        var filter_counter = 0;
        var post_node_list = document.getElementsByClassName('m-mlist');
        utilities.log('已啓用的過濾標籤：' + this.get_unwanted_tag_list());
        utilities.log('已啓用的過濾作者：' + this.get_unwanted_author_list());
        utilities.log('已啓用的過濾關鍵字：' + this.get_unwanted_keyword_list());
        var post_found_unwanted = false;

        for (var i = 0; i < post_node_list.length; i++) {
            try {
                post_found_unwanted = false;
                var post = lovely_lofter.parse_post(post_node_list[i]);

                // if this node does not contain a normal post to be parsed
                // like the title node of a tag page
                if (post === null) {
                    utilities.log('無法解析以下文章節點，其可能是保留節點：');
                    utilities.log(post_node_list[i]);
                    continue;
                }

                // utilities.log(post);

                // search for certain tag
                var current_tag_list = this.get_unwanted_tag_list();
                for (var j = 0; j < current_tag_list.length; j++) {
                    var unwanted_tag = current_tag_list[j];
                    if (post.tag.indexOf(unwanted_tag) != -1) {
                        utilities.log('已過濾文章 *' + post.title + '* 因其標註了 *' + unwanted_tag +
                            '*，作者 *' + post.author + '*。');
                        post.node.hidden = true;
                        post_found_unwanted = true;
                        filter_counter++;
                        break;
                    }
                }

                if (post_found_unwanted == false) {
                    var current_author_list = this.get_unwanted_author_list();
                    for (var k = 0; k < current_author_list.length; k++) {
                        var unwanted_author = current_author_list[k];
                        if (post.author === unwanted_author) {
                            utilities.log('已過濾文章 *' + post.title + '* 因其作者爲 *' + unwanted_author +
                                '*。');
                            post.node.hidden = true;
                            post_found_unwanted = true;
                            filter_counter++;
                            break;
                        }
                    }
                }


                if (post_found_unwanted == false) {
                    var current_keyword_list = this.get_unwanted_keyword_list();
                    for (var l = 0; l < current_keyword_list.length; l++) {
                        var unwanted_keyword = current_keyword_list[l];
                        if (post.content.indexOf(unwanted_keyword) != -1 || post.title.indexOf(unwanted_keyword) != -1) {
                            utilities.log('已過濾文章 *' + post.title + '* 因其包含關鍵字 *' + unwanted_keyword +
                                '*，作者 *' + post.author + '*。');
                            post.node.hidden = true;
                            post_found_unwanted = true;
                            filter_counter++;
                            break;
                        }
                    }
                }

                if (!post_found_unwanted) {
                    post.node.hidden = false;
                }

                // find out whether it is targeted
                if (lovely_lofter.target_post_dummy_pool.indexOf(post) == -1) {
                    if (lovely_lofter.target_author.indexOf(post.author) != -1) {
                        lovely_lofter.target_post_pool.push(post);
                        lovely_lofter.target_post_dummy_pool.push(post);
                        utilities.log("將保存文章 *" + post.title + '* 因其作者爲 *' + post.author + '*。')
                    } else {
                        for (var m = 0; m < post.tag.length; m++) {
                            if (lovely_lofter.target_tag.indexOf(post.tag[m]) != -1) {
                                lovely_lofter.target_post_dummy_pool.push(post);
                                lovely_lofter.target_post_pool.push(post);
                                utilities.log("將保存文章 *" + post.title + '* 因其標有 *' + post.tag[m] + '*，作者 *' +
                                post.author + '*。');
                                break;
                            }
                        }
                    }
                }
            }
            catch (e) {
                // record exception and notify user
                utilities.log('解析以下文章節點時發生未知錯誤：');
                utilities.log(e);
                utilities.log(post_node_list[i]);
            }
        }

        this.notify('頁面動態內容已刷新。共過濾了 ' + filter_counter + ' 篇文章。當前共啓用了 '
            + (this.get_unwanted_tag_list().length + this.get_unwanted_author_list().length + this.get_unwanted_keyword_list().length) + ' 個過濾規則。', 3000);
        utilities.log('處理完成。');
        lovely_lofter.save_to_cloud();
    },


    // notify something
    notify: function (notification, hide_delay) {
        // make sure that the notification can be initialised
        // and the notification content is always updated
        var notification_node = this.notification.get_notification();
        notification_node.text_node.textContent = notification;

        if (this.get_local_settings('show_notification')) {
            notification_node.node.hidden = false;

            if (hide_delay > 0) {
                setTimeout(function () {
                    notification_node.node.hidden = true;
                }, hide_delay);
            }
        }
    },


    // clear all local storage
    _clear_local_storage: function () {
        localStorage.removeItem(this.STORAGE_ID);
    },


    // get unwanted tag list
    get_unwanted_tag_list: function () {
        return lovely_lofter_filter.get_local_settings('unwanted_tags');
    },


    // add unwanted tag
    add_unwanted_tag: function (tag) {
        if (lovely_lofter_filter.get_unwanted_tag_list().indexOf(tag) != -1) return;

        var tag_list = lovely_lofter_filter.get_unwanted_tag_list();
        tag_list.push(tag);
        lovely_lofter_filter.update_local_settings('unwanted_tags', tag_list);

        return lovely_lofter_filter.get_unwanted_tag_list();
    },


    // remove unwanted tag
    remove_unwanted_tag: function (tag) {
        if (lovely_lofter_filter.get_unwanted_tag_list().indexOf(tag) == -1) return;

        var tag_list = lovely_lofter_filter.get_unwanted_tag_list();
        tag_list.splice(tag_list.indexOf(tag), 1);
        lovely_lofter_filter.update_local_settings('unwanted_tags', tag_list);

        return lovely_lofter_filter.get_unwanted_tag_list();
    },


    // clear unwanted tag
    clear_unwanted_tag: function () {
        lovely_lofter_filter.update_local_settings('unwanted_tags', []);
    },


    // get unwanted author list
    get_unwanted_author_list: function () {
        return lovely_lofter_filter.get_local_settings('unwanted_authors');
    },


    // add unwanted author
    add_unwanted_author: function (author) {
        if (lovely_lofter_filter.get_unwanted_author_list().indexOf(author) != -1) return;

        var author_list = lovely_lofter_filter.get_unwanted_author_list();
        author_list.push(author);
        lovely_lofter_filter.update_local_settings('unwanted_authors', author_list);

        return lovely_lofter_filter.get_unwanted_author_list();
    },


    // remove unwanted author
    remove_unwanted_author: function (author) {
        if (lovely_lofter_filter.get_unwanted_author_list().indexOf(author) == -1) return;

        var author_list = lovely_lofter_filter.get_unwanted_author_list();
        author_list.splice(author_list.indexOf(author), 1);
        lovely_lofter_filter.update_local_settings('unwanted_authors', author_list);

        return lovely_lofter_filter.get_unwanted_author_list();
    },


    // clear unwanted author
    clear_unwanted_author: function () {
        lovely_lofter_filter.update_local_settings('unwanted_authors', []);
    },


    // get unwanted keyword list
    get_unwanted_keyword_list: function () {
        return lovely_lofter_filter.get_local_settings('unwanted_keywords');
    },


    // add unwanted keyword
    add_unwanted_keyword: function (keyword) {
        if (lovely_lofter_filter.get_unwanted_keyword_list().indexOf(keyword) != -1) return;

        var keyword_list = lovely_lofter_filter.get_unwanted_keyword_list();
        keyword_list.push(keyword);
        lovely_lofter_filter.update_local_settings('unwanted_keywords', keyword_list);

        return lovely_lofter_filter.get_unwanted_keyword_list();
    },


    // remove unwanted keyword
    remove_unwanted_keyword: function (keyword) {
        if (lovely_lofter_filter.get_unwanted_keyword_list().indexOf(keyword) == -1) return;

        var keyword_list = lovely_lofter_filter.get_unwanted_keyword_list();
        keyword_list.splice(keyword_list.indexOf(keyword), 1);
        lovely_lofter_filter.update_local_settings('unwanted_keywords', keyword_list);

        return lovely_lofter_filter.get_unwanted_keyword_list();
    },


    // clear unwanted keyword
    clear_unwanted_keyword: function () {
        lovely_lofter_filter.update_local_settings('unwanted_keywords', []);
    },


    settings: {

        // constants
        _INITIALISED: false,
        _RE_FILTER_REQUIRED: false,


        // ui elements
        background_mask: null,
        settings_panel: null,


        // get filter target name
        get_filter_target_name: function () {
            var filter_target_value = lovely_lofter_filter.settings.filter_target_choice.value;
            return {
                'tag': '標籤',
                'author': '作者',
                'keyword': '關鍵字'
            }[filter_target_value];
        },


        // initialise the settings panel
        initialise_settings_panel: function () {      // create HTML elements
            var background_mask = document.createElement('div');
            var settings_panel = document.createElement('div');
            var settings_title = document.createElement('h6');
            var close_button = document.createElement('p');
            var tag_list_brief = document.createElement('p');
            var tag_list = document.createElement('select');
            var add_tag_button = document.createElement('button');
            var add_tag_input = document.createElement('input');
            var remove_tag_button = document.createElement('button');
            var clear_tag_button = document.createElement('button');
            var operation_hint = document.createElement('p');
            var about_info = document.createElement('p');
            var show_status_hint = document.createElement('input');
            var show_status_hint_hint = document.createElement('p');
            var feedback_button = document.createElement('p');
            var filter_target_choice = document.createElement('select');
            var filter_target_hint = document.createElement('p');


            background_mask.style.position = 'fixed';
            background_mask.style.top = '0%';
            background_mask.style.left = '0%';
            background_mask.style.width = '100%';
            background_mask.style.height = '100%';
            background_mask.style.backgroundColor = '#000000';
            background_mask.style.opacity = '0.75';
            background_mask.style.zIndex = '1000';
            background_mask.hidden = true;

            settings_panel.style.position = 'fixed';
            settings_panel.style.backgroundColor = '#DDDDDD';
            settings_panel.style.width = '50%';
            settings_panel.style.height = '70%';
            settings_panel.style.left = '25%';
            settings_panel.style.top = '15%';
            settings_panel.style.zIndex = '1001';
            settings_panel.hidden = true;

            settings_title.style.position = 'absolute';
            settings_title.style.top = '10%';
            settings_title.style.left = '10%';
            settings_title.style.fontSize = 'large';
            settings_title.textContent = '設定';

            close_button.style.position = 'absolute';
            close_button.style.top = '10%';
            close_button.style.left = '85%';
            close_button.style.fontSize = 'medium';
            close_button.style.cursor = 'pointer';
            close_button.textContent = '關閉';
            close_button.onclick = function () {
                lovely_lofter_filter.settings.close_settings_panel()
            };

            tag_list_brief.style.position = 'absolute';
            tag_list_brief.style.top = '20%';
            tag_list_brief.style.left = '10%';
            tag_list_brief.style.fontSize = 'large';

            tag_list.style.position = 'absolute';
            tag_list.style.top = '30%';
            tag_list.style.left = '10%';
            tag_list.style.height = '40%';
            tag_list.style.width = '37.5%';
            tag_list.style.textAlign = 'left';
            tag_list.style.fontSize = 'medium';
            tag_list.style.textAlign = 'center';
            tag_list.setAttribute('size', '15');

            add_tag_button.style.position = 'absolute';
            add_tag_button.style.top = '37.5%';
            add_tag_button.style.left = '57.5%';
            add_tag_button.style.width = '30%';
            add_tag_button.style.height = '5%';
            add_tag_button.textContent = '添加標籤';

            add_tag_input.style.position = 'absolute';
            add_tag_input.style.top = '30%';
            add_tag_input.style.left = '57.5%';
            add_tag_input.style.width = '30%';
            add_tag_input.style.height = '5%';
            add_tag_input.placeholder = '在此輸入要過濾的標籤';

            remove_tag_button.style.position = 'absolute';
            remove_tag_button.style.top = '45%';
            remove_tag_button.style.left = '57.5%';
            remove_tag_button.style.width = '30%';
            remove_tag_button.style.height = '5%';
            remove_tag_button.textContent = '刪除標籤';

            clear_tag_button.style.position = 'absolute';
            clear_tag_button.style.top = '57.5%';
            clear_tag_button.style.left = '57.5%';
            clear_tag_button.style.width = '30%';
            clear_tag_button.style.height = '5%';
            clear_tag_button.textContent = '清空標籤';

            operation_hint.style.position = 'absolute';
            operation_hint.style.left = '10%';
            operation_hint.style.top = '75%';
            operation_hint.style.fontSize = 'medium';

            about_info.style.position = 'absolute';
            about_info.style.left = '10%';
            about_info.style.top = '85%';
            about_info.style.textAlign = 'left';
            about_info.style.fontSize = 'small';
            about_info.innerHTML = 'Lovely Lofter 標籤過濾工具，由 Nb/Illuminar 編寫，以 MIT 許可證發佈。<br>當前版本 '
                + utilities._VERSION + '，需要 HTML5 支持。';

            show_status_hint.style.position = 'absolute';
            show_status_hint.style.left = '57.5%';
            show_status_hint.style.top = '67.5%';
            show_status_hint.setAttribute('type', 'checkbox');
            show_status_hint.setAttribute('value', 'true');

            show_status_hint_hint.style.position = 'absolute';
            show_status_hint_hint.style.left = '60%';
            show_status_hint_hint.style.top = '67%';
            show_status_hint_hint.style.fontSize = 'small';
            show_status_hint_hint.textContent = '顯示過濾提示';
            show_status_hint.onclick = function () {
                operation_hint.textContent = '關閉設定頁面後生效。';
            };

            feedback_button.style.position = 'absolute';
            feedback_button.style.left = '85%';
            feedback_button.style.top = '85%';
            feedback_button.style.fontSize = 'small';
            feedback_button.style.cursor = 'pointer';
            feedback_button.textContent = '反饋';
            feedback_button.onclick = function () {
                lovely_lofter_filter.settings.feedback.show_feedback_panel();
            };

            filter_target_choice.style.position = 'absolute';
            filter_target_choice.style.left = '67.5%';
            filter_target_choice.style.top = '20%';
            filter_target_choice.style.fontSize = 'medium';
            filter_target_choice.onchange = function () {
                lovely_lofter_filter.settings.refresh_unwanted_filter_info();
            };
            var target_list = ['標籤', '作者', '關鍵字'];
            var target_value_list = ['tag', 'author', 'keyword'];
            for (var i = 0; i < 3; i++) {
                var option = document.createElement('option');
                option.value = target_value_list[i];
                option.textContent = target_list[i];
                filter_target_choice.appendChild(option);
            }

            filter_target_hint.style.position = 'absolute';
            filter_target_hint.style.left = '57.5%';
            filter_target_hint.style.top = '20%';
            filter_target_hint.style.fontSize = 'medium';
            filter_target_hint.textContent = '顯示過濾';


            // bind actions
            add_tag_button.onclick = function () {
                var tag_to_add = add_tag_input.value;
                var func = {
                    'tag': lovely_lofter_filter.add_unwanted_tag,
                    'author': lovely_lofter_filter.add_unwanted_author,
                    'keyword': lovely_lofter_filter.add_unwanted_keyword
                }[lovely_lofter_filter.settings.filter_target_choice.value];
                func(tag_to_add);
                lovely_lofter_filter.settings.refresh_unwanted_filter_info();
                lovely_lofter_filter.settings._RE_FILTER_REQUIRED = true;
                operation_hint.textContent = '關閉設定頁面後生效。';
            };

            remove_tag_button.onclick = function () {
                var tag_to_remove = tag_list.value;
                var func = {
                    'tag': lovely_lofter_filter.remove_unwanted_tag,
                    'author': lovely_lofter_filter.remove_unwanted_author,
                    'keyword': lovely_lofter_filter.remove_unwanted_keyword
                }[lovely_lofter_filter.settings.filter_target_choice.value];
                func(tag_to_remove);
                lovely_lofter_filter.settings.refresh_unwanted_filter_info();
                lovely_lofter_filter.settings._RE_FILTER_REQUIRED = true;
                operation_hint.textContent = '關閉設定頁面後生效。';
            };

            clear_tag_button.onclick = function () {
                if (confirm('所有過濾' + lovely_lofter_filter.settings.get_filter_target_name() + '都將被刪除，確定要繼續嗎？')) {
                    var func = {
                        'tag': lovely_lofter_filter.clear_unwanted_tag,
                        'author': lovely_lofter_filter.clear_unwanted_author,
                        'keyword': lovely_lofter_filter.clear_unwanted_keyword
                    }[lovely_lofter_filter.settings.filter_target_choice.value];
                    func();
                }
                lovely_lofter_filter.settings.refresh_unwanted_filter_info();
                lovely_lofter_filter.settings._RE_FILTER_REQUIRED = true;
                operation_hint.textContent = '關閉設定頁面後生效。';
            };


            // bind this attributes
            this.background_mask = background_mask;
            this.settings_panel = settings_panel;
            this.tag_list_brief = tag_list_brief;
            this.tag_list = tag_list;
            this.operation_hint = operation_hint;
            this.show_status_hint = show_status_hint;
            this.filter_target_choice = filter_target_choice;
            this.add_tag_button = add_tag_button;
            this.add_tag_input = add_tag_input;
            this.remove_tag_button = remove_tag_button;
            this.clear_tag_button = clear_tag_button;


            // bind HTML elements
            utilities.get_body().appendChild(this.background_mask);
            utilities.get_body().appendChild(this.settings_panel);

            this.settings_panel.appendChild(settings_title);
            this.settings_panel.appendChild(close_button);
            this.settings_panel.appendChild(tag_list);
            this.settings_panel.appendChild(tag_list_brief);
            this.settings_panel.appendChild(add_tag_button);
            this.settings_panel.appendChild(add_tag_input);
            this.settings_panel.appendChild(remove_tag_button);
            this.settings_panel.appendChild(clear_tag_button);
            this.settings_panel.appendChild(operation_hint);
            this.settings_panel.appendChild(about_info);
            this.settings_panel.appendChild(show_status_hint);
            this.settings_panel.appendChild(show_status_hint_hint);
            this.settings_panel.appendChild(feedback_button);
            this.settings_panel.appendChild(filter_target_choice);
            this.settings_panel.appendChild(filter_target_hint);

            // refresh tag info
            this.refresh_unwanted_filter_info();

            this._INITIALISED = true;
        },


        // refresh ui names
        refresh_ui_name: function () {
            this.add_tag_button.textContent = '添加' + this.get_filter_target_name();
            this.remove_tag_button.textContent = '刪除' + this.get_filter_target_name();
            this.clear_tag_button.textContent = '清空' + this.get_filter_target_name();
        },


        // refresh unwanted tag list
        refresh_unwanted_filter_info: function () {

            // clear tag list
            var max_length = lovely_lofter_filter.settings.tag_list.childNodes.length;
            for (var i = 0; i < max_length; i++) {
                lovely_lofter_filter.settings.tag_list.removeChild(
                    lovely_lofter_filter.settings.tag_list.childNodes[0]
                );
            }

            var target_chosen = lovely_lofter_filter.settings.filter_target_choice.value;
            var tag_list = null;
            if (target_chosen === 'tag') {
                tag_list = lovely_lofter_filter.get_unwanted_tag_list();
            } else if (target_chosen === 'author') {
                tag_list = lovely_lofter_filter.get_unwanted_author_list();
            } else if (target_chosen === 'keyword') {
                tag_list = lovely_lofter_filter.get_unwanted_keyword_list();
            } else {
                tag_list = lovely_lofter_filter.get_unwanted_tag_list();
            }

            // reload tag list
            tag_list.forEach(function (tag) {
                var list_item = document.createElement('option');
                list_item.setAttribute('value', tag);
                list_item.textContent = tag;
                lovely_lofter_filter.settings.tag_list.appendChild(list_item);
            });

            // clear input value
            lovely_lofter_filter.settings.add_tag_input.value = '';
            lovely_lofter_filter.settings.add_tag_input.setAttribute('placeholder', '輸入要過濾的' + lovely_lofter_filter.settings.get_filter_target_name());

            // refresh ui names
            lovely_lofter_filter.settings.refresh_ui_name();

            // refresh brief
            lovely_lofter_filter.settings.tag_list_brief.textContent =
                '當前已啓用 ' + tag_list.length + ' 個過濾' + lovely_lofter_filter.settings.get_filter_target_name() + '。';

        },


        // show settings panel
        show_settings_panel: function () {
            if (!this._INITIALISED) {
                this.initialise_settings_panel();
            }

            this.refresh_unwanted_filter_info();
            this.show_status_hint.checked = lovely_lofter_filter.get_local_settings('show_notification');

            this.background_mask.hidden = false;
            this.settings_panel.hidden = false;
        },


        // close setting panel
        close_settings_panel: function () {
            if (lovely_lofter_filter.settings._RE_FILTER_REQUIRED) {
                lovely_lofter_filter.filter();
            }
            this.background_mask.hidden = true;
            this.settings_panel.hidden = true;
            this.operation_hint.textContent = '';

            // update show notification option
            lovely_lofter_filter.update_local_settings('show_notification', this.show_status_hint.checked);
        },


        feedback: {

            // constants
            _INITIALISED: false,

            // initialise the feedback panel
            initialise_feedback_panel: function () {
                var feedback_panel = document.createElement('div');
                var feedback_title = document.createElement('h6');
                var close_button = document.createElement('p');
                var feedback_hint = document.createElement('p');
                var session_log_list = document.createElement('textarea');

                feedback_panel.style.position = 'fixed';
                feedback_panel.style.backgroundColor = '#DDDDDD';
                feedback_panel.style.width = '50%';
                feedback_panel.style.height = '70%';
                feedback_panel.style.left = '25%';
                feedback_panel.style.top = '15%';
                feedback_panel.style.zIndex = '1003';
                feedback_panel.hidden = true;

                feedback_title.style.position = 'absolute';
                feedback_title.style.left = '10%';
                feedback_title.style.top = '10%';
                feedback_title.style.fontSize = 'medium';
                feedback_title.textContent = '調試日誌';

                feedback_hint.style.position = 'absolute';
                feedback_hint.style.left = '10%';
                feedback_hint.style.top = '17.5%';
                feedback_hint.style.textAlign = 'left';
                feedback_hint.style.fontSize = 'small';
                feedback_hint.innerHTML = '反饋時請將如下信息隨寄，以便尋找問題，謝謝。<br>請注意，調試信息中可能包含您本次會話中瀏覽過的網頁。';

                close_button.style.position = 'absolute';
                close_button.style.left = '85%';
                close_button.style.top = '10%';
                close_button.style.fontSize = 'medium';
                close_button.style.cursor = 'pointer';
                close_button.textContent = '關閉';
                close_button.onclick = function () {
                    lovely_lofter_filter.settings.feedback.close_feedback_panel();
                };

                session_log_list.style.position = 'absolute';
                session_log_list.style.left = '10%';
                session_log_list.style.top = '30%';
                session_log_list.style.height = '60%';
                session_log_list.style.width = '77.5%';
                session_log_list.setAttribute('readonly', 'true');

                this.feedback_panel = feedback_panel;
                this.session_log_list = session_log_list;

                utilities.get_body().appendChild(this.feedback_panel);

                this.feedback_panel.appendChild(feedback_title);
                this.feedback_panel.appendChild(close_button);
                this.feedback_panel.appendChild(session_log_list);
                this.feedback_panel.appendChild(feedback_hint);

                this._INITIALISED = true;
            },


            // refresh session log
            refresh_session_log: function () {
                this.session_log_list.value = utilities.get_session_log();
            },


            // show_feedback_panel
            show_feedback_panel: function () {
                if (!this._INITIALISED) {
                    this.initialise_feedback_panel();
                }
                lovely_lofter_filter.settings.background_mask.style.zIndex = '1002';
                this.refresh_session_log();
                this.feedback_panel.hidden = false;
            },


            // close feedback panel
            close_feedback_panel: function () {
                lovely_lofter_filter.settings.background_mask.style.zIndex = '1000';
                this.feedback_panel.hidden = true;
            }
        }
    },


    notification: {

        // constants
        NOTIFICATION_NODE_ID: 'lovely_lofter_notification',
        NOTIFICATION_TEXT_NODE_ID: 'lovely_lofter_notification_text',
        SETTINGS_TEXT_NODE_ID: 'lovely_lofter_settings',
        DEFAULT_NOTIFICATION: 'No post filtered',

        _INITIALISED: false,

        // HTML elements
        notification_node: null,
        notification_text_node: null,
        settings_entrance_node: null,
        mouse_over_node: null,


        // initialise notification
        initialise_notification: function () {

            // create HTML elements
            var notification_node = document.createElement('div');
            var notification_text_node = document.createElement('p');
            var settings_entrance_node = document.createElement('div');
            var mouse_over_node = document.createElement('div');

            // bind id
            notification_node.id = this.NOTIFICATION_NODE_ID;
            notification_text_node.id = this.NOTIFICATION_TEXT_NODE_ID;
            settings_entrance_node.id = this.SETTINGS_TEXT_NODE_ID;

            // bind elements
            notification_node.appendChild(notification_text_node);
            notification_node.appendChild(settings_entrance_node);

            // node style
            notification_node.style.position = 'fixed';
            notification_node.style.top = '0%';
            notification_node.style.backgroundColor = '#DDDDDD';
            notification_node.style.opacity = '0.85';
            notification_node.style.width = '100%';
            notification_node.style.height = '5%';
            notification_node.style.zIndex = '100';
            notification_node.hidden = true;

            mouse_over_node.style.position = 'fixed';
            mouse_over_node.style.top = '0%';
            mouse_over_node.style.opacity = '0';
            mouse_over_node.style.width = '100%';
            mouse_over_node.style.height = '7%';

            notification_text_node.style.fontSize = 'small';
            notification_text_node.style.textAlign = 'center';
            notification_text_node.style.paddingTop = '0.7%';

            settings_entrance_node.style.position = 'fixed';
            settings_entrance_node.style.top = '0%';
            settings_entrance_node.style.fontSize = 'small';
            settings_entrance_node.style.right = '10%';
            settings_entrance_node.style.paddingTop = '0.7%';
            settings_entrance_node.textContent = '設置';
            settings_entrance_node.style.zIndex = '150';
            settings_entrance_node.style.cursor = 'pointer';
            settings_entrance_node.onclick = function () {
                lovely_lofter_filter.settings.show_settings_panel()
            };

            // bind event
            notification_node.onmouseover = function () {
                notification_node.hidden = false;
            };
            notification_node.onmouseout = function () {
                notification_node.hidden = true;
            };

            mouse_over_node.onmouseover = function () {
                notification_node.hidden = false;
            };
            mouse_over_node.onmouseout = function () {
                notification_node.hidden = true;
            };

            utilities.get_body().appendChild(notification_node);
            utilities.get_body().appendChild(mouse_over_node);

            this.notification_node = notification_node;
            this.notification_text_node = notification_text_node;
            this.settings_entrance_node = settings_entrance_node;
            this.mouse_over_node = mouse_over_node;

            this._INITIALISED = true;
        },


        // get notification
        get_notification: function () {
            if (!this._INITIALISED) {
                this.initialise_notification();
            }

            return {
                node: this.notification_node,
                text_node: this.notification_text_node
            }
        }
    },


    // observer callback for responding the DOM mutation event
    observer: function (mutation_records, mutation_observer) {
        utilities.log('AJAX 動態內容加載完成，開始處理……');
        lovely_lofter_filter.filter();
    }
};


// register DOM mutation observer
var dom_mutation_observer = new MutationObserver(lovely_lofter_filter.observer);
dom_mutation_observer.observe(document.getElementById('main'), {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: true
});


// while loading posts
window.onload = function () {
    if (!!utilities._PAGE_LOADED) {
        lovely_lofter_filter.notify('等待 Lofter 加載文章……');
        utilities._PAGE_LOADED = true;
    }
    utilities.log('等待 AJAX 動態內容加載完成……');
};

utilities.log('Lovely Lofter 過濾工具，版本 ' + utilities._VERSION + '，核心腳本已載入。')
utilities.log('等待靜態頁面加載完成……');
lovely_lofter_filter.load_local_settings();
