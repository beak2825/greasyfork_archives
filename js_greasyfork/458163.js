// ==UserScript==
// @name                脑壳小助手
// @namespace           https://www.naokr.com/user/87670
// @version             20230322.5
// @description         基于多条件隐藏题目和问答, 加强题单功能, 折叠评论区, 隐藏可能剧透的信息等
// @author              乱撞的小鹿
// @run-at              document-end
// @match               *://*.naokr.com/*
// @require             https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @license             GPL-3
// @downloadURL https://update.greasyfork.org/scripts/458163/%E8%84%91%E5%A3%B3%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458163/%E8%84%91%E5%A3%B3%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';

// ----------------------- 以下是自定义配置 -----------------------

// 修改时，注意使用英文半角双引号、英文半角逗号

// 屏蔽的题型，默认不屏蔽任何题型
// 以屏蔽开放讨论、推理故事、知识百科、哲学顿悟4种题型为例子，这样写：var blocked_question_types = ["讨论", "推理故事", "知识百科", "哲学顿悟"]
var blocked_question_types = []
// 屏蔽的出题者，填写其数字id，这里以作者自己和脑壳小助手为例
var blocked_author_ids = ["87670", "2"]
// 是否屏蔽限时问题，true是屏蔽，false是不屏蔽
var block_limited_time_question = true;

// ---------------- 自定义配置结束 以下部分不要乱改 ---------------

(async function () {
    if (/^https?:\/\/(www|m).naokr.com\/question((\?.*)|(\/?$))/ig.test(location.href)) {
        add_hide_buttons_to_all_elements("#question-list .question-item", ".user-name", "blocked_post_ids", function(ele){
            return ele.find(".list-item-title ").attr('href').replace(/.*question\/(\d+)\/?$/, "$1");
        });
        await execute_all_hide_features_on_question_section();
    }
    else if (/^https?:\/\/(www|m).naokr.com\/question\/\d+\/?/ig.test(location.href)) {
        add_spoiler_to_sensitive_info();
        toggle_comment_section_on_queston_section();
        toggle_quiz_actions_sidebar();
        mark_if_has_been_answered_before();
        add_multi_choice_question_warning();
        add_single_hide_button_to_page(".page-detail-info-items", window.location.href.replace(/.*question\/(\d+)\/?$/, "$1"),
            "blocked_post_ids");
        add_collections_dialog_monitor();
    }
    else if (/^https?:\/\/(www|m).naokr.com\/ask((\?.*)|(\/?$))/ig.test(location.href)) {
        add_hide_buttons_to_all_elements("#ask-list > .ask-item", ".list-footer-item:last-child",
            "blocked_ask_ids", function(ele){
                return ele.find(".list-item-title").attr('href').replace(/.*ask\/(\d+)\/?$/, "$1");
        });
        await excute_hide_features_on_ask_section();
    }
    else if (/^https?:\/\/(www|m).naokr.com\/ask\/\d+\/?/ig.test(location.href)) {
        toggle_comment_section_on_ask_section();
        add_single_hide_button_to_page(".page-detail-info-items > :last-child",
            window.location.href.replace(/.*ask\/(\d+)\/?$/, "$1"), "blocked_ask_ids");
    }
    else if (/^https?:\/\/(www|m).naokr.com\/collection\/\d+/ig.test(location.href)) {
        GM_addStyle(".addon-filter-note { \
            padding: 2rem; \
        }");
        var collection_id = location.href.replace(/^https?:\/\/(www|m).naokr.com\/collection\/(\d+)/ig, "$2");
        if (await check_if_str_is_in_env_list(collection_id, "have_read_collection_ids")) {
            excute_actions_on_collection_page();
        } else {
            add_single_filter_button_to_list_page('.collection-questions h5', excute_actions_on_collection_page);
        }
        add_various_buttons_on_collection_page();
    }
    else if (/^https?:\/\/(www|m).naokr.com\/user\/\d+\/collections\/following/ig.test(location.href)) {
        GM_addStyle(".addon-filter-note { \
            display: inline-flex; \
            align-items: center; \
            padding: var(--naokr-nav-link-padding-y) var(--naokr-nav-link-padding-x); \
        }")
        add_single_filter_button_to_list_page('.user-content .nav-tabs-simple', excute_actions_on_collections_list_in_userspace);
    }
    else if (/^https?:\/\/(www|m).naokr.com\/user\/\d+\/collections\/created/ig.test(location.href)) {
        await load_more_until_to_the_end("#collection-list", "#load-more-collections a");
        await sort_collections_by_edit_time('#collection-list', (el) => {
            return $(el).attr("href").replace(/.*collection\/(\d+).*/, "$1");
        });
    }
})();

GM_addStyle(" \
    .addon-hide-button { \
        display: inline-flex; \
        font-size: 0.75rem; \
        padding: 0.25rem 0.25rem; \
        background-color: #66BD72 !important; \
        color: rgb(255, 255, 255); \
        line-height: 1; \
        border-radius: 2px; \
        max-width: 8rem; \
        white-space: nowrap; \
        overflow: hidden; \
        text-overflow: ellipsis; \
    } \
    #addon-blocked-post-ids, \
    .ask-item-footer > .list-footer-items:last-child .addon-hide-button { \
        display: none; \
    } \
");

async function add_single_filter_button_to_list_page(click_position_selector, async_callback) {
    $(click_position_selector).bind("click", async function() {
        await async_callback();
    });
}

function add_single_hide_button_to_page(position_selector, ele_id, env_name) {
    var hide_button = $('<span><a class="addon-hide-button" href="javascript:void(0)">隐</a></span>');
    hide_button.insertAfter(position_selector);
    hide_button.click(async function () {
        $('.addon-hide-button').remove();
        await save_unique_ele_id_to_env_list(ele_id, env_name)
    })
}

function add_hide_buttons_to_all_elements(ele_selector, position_selector_in_ele, env_name, get_id_callback){
    $(ele_selector).each((index, el) => {
        var ele = $(el);
        var insert_location = ele.find(position_selector_in_ele);
        var hide_button = $('<span><a class="addon-hide-button" href="javascript:void(0)">隐</a> &nbsp; </span>');
        hide_button.insertAfter(insert_location);
        hide_button.click(async function () {
            var ele_id = get_id_callback(ele);
            ele.remove();
            await save_unique_ele_id_to_env_list(ele_id, env_name);
        });
    });
}

async function save_unique_ele_id_to_env_list(ele_id, env_name) {
    var blocked_ele_ids = await GM.getValue(env_name, [] )
    blocked_ele_ids.push(ele_id)
    GM.setValue(env_name, [...new Set(blocked_ele_ids)] )
}

function save_unique_multi_ids_to_env(append_list, old_list, env_name) {
    old_list = old_list.concat(append_list);
    GM.setValue(env_name, [...new Set(old_list)] )
}

async function check_if_str_is_in_env_list(str, env_name) {
    var env_list = await GM.getValue(env_name, [] );
    return env_list.includes(str)
}

function load_more_until_to_the_end(observe_target_node, load_more_button_selector, note_location = "") {
    if (note_location != "") {
        $(note_location).html($(note_location).html() + "<span class='addon-filter-note'>↱ 正在加载全部条目 ↲</span>");
    }
    return new Promise(resolve => {
        let list_observer = new MutationObserver(callback);
        list_observer.observe(document.querySelector(observe_target_node), {
            childList: true
        });

        function callback(mutations) {
            console.log("观察器已被触发1次");
            setTimeout(function() {
                var button = $(load_more_button_selector)[0];
                if (/加载更多/.test(button.textContent)) {
                    button.click();
                    console.log("已点击 加载更多按钮 1次")
                }
                if (/已加载全部/.test(button.textContent)) {
                    console.log("已加载到最末端")
                    list_observer.disconnect();
                    if (note_location != "") {
                        $(note_location).html($(note_location).html().replace(/↱.*?↲/, "↱ 加载完成 ↲"));
                    }
                    resolve();
                }
            }, 100);
        }

        callback();
    })
}

function url_get_webpage(url) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: 'document',
            onload: resolve
        });
    })
}

async function sort_collections_by_edit_time(list_container_selector, get_collection_id_func) {
    var list = document.querySelector(list_container_selector);
    var last_modi_time_of_collections_obj = await GM.getValue("last_modi_time_of_collections", {});
    [...list.children]
        .sort( (a, b) => {
            var a_id = get_collection_id_func(a);
            var b_id = get_collection_id_func(b);
            var a_last_modi_time = last_modi_time_of_collections_obj[a_id] || 0;
            var b_last_modi_time = last_modi_time_of_collections_obj[b_id] || 0;
            return b_last_modi_time - a_last_modi_time;
        })
        .forEach(node=>list.appendChild(node));
}

function handleSpoiler(evt) {
    const wrapper = evt.currentTarget;
    wrapper.classList.toggle("addon-spoiler-hidden");
    console.l
    return false
}

async function execute_all_hide_features_on_question_section() {
    var blocked_post_ids = await GM.getValue("blocked_post_ids", [])
    print_post_ids_from_env_list(blocked_post_ids);

    $("#question-list .question-item").each((index, el) => {
        var post = $(el);
        var tags = post.find(".question-tags").text();
        var author_id = post.find(".user-name a").attr('href').replace(/.*user\/(\d+)\/?$/, "$1");
        var question_excerpt = post.find('.question-item-excerpt').text();
        var post_id = post.find(".list-item-title").attr('href').replace(/.*question\/(\d+)\/?$/, "$1");

        if ( blocked_question_types.some(type => tags.includes(type))
            || blocked_author_ids.indexOf(author_id) != -1
            || ( block_limited_time_question && question_excerpt.search(/内完成答题/ig) != -1 )
            || blocked_post_ids.indexOf(post_id) != -1
        ) {
            post.remove();
        }
    })
}

function print_post_ids_from_env_list(blocked_post_ids) {
    var blocked_post_ids_div = '<div id="addon-blocked-post-ids" style="margin: var(--spacer) var(--spacer)">' +
        '<span style="font-size: .75rem; padding: 0.25rem 0.25rem; background-color: #39f; color: #fff; border-radius: 2px;">' +
        blocked_post_ids.length + '</span><input value=' + blocked_post_ids +
        ' onMouseOver="this.select()" style="margin-left: 10px; font-size: 0.75rem;"></input>' + '</div>';
    $(".toolbar").after(blocked_post_ids_div);
}

async function import_post_ids_to_env_list(imported_post_ids_array) {
    var blocked_post_ids = await GM.getValue("blocked_post_ids", [] )
    var new_blocked_post_ids = [...new Set( blocked_post_ids.concat(imported_post_ids_array.map(String)) )]
    GM.setValue("blocked_post_ids", new_blocked_post_ids )
}

function toggle_comment_section_on_queston_section() {
    var toggle_button_selector = ""
    if ( window.location.href.match(/^https?:\/\/m.naokr.com\/.*/) != null ) {
        toggle_button_selector = ".question-comments .section-title"
    } else {
        toggle_button_selector = "#question-comments .block-header"
    }

    $(toggle_button_selector).click(function() {
        $('.question-comments #comment-list').slideToggle()
        $('.question-comments #load-more-comments').slideToggle()
    });
    $(toggle_button_selector).click();
}

function add_spoiler_to_sensitive_info() {
    $('.page-detail-info-item:last-child').bind("click", handleSpoiler);
    $('.page-detail-info-item:last-child').click();
    $('.question-tags [class^="question-tag bg-question-category"]').bind("click", handleSpoiler);
    $('.question-tags [class^="question-tag bg-question-category"]').click();
    $('.quiz-result-poft').bind("click", handleSpoiler);
    $('.quiz-result-poft').click();
    GM_addStyle(" \
        .addon-spoiler-hidden { \
            background-color: #868e96 !important; \
            cursor: pointer !important; \
            border-radius: 3px !important; \
            color: #868e96 !important; \
        } \
        .addon-spoiler-hidden img { \
            opacity: 0; \
        } \
        .addon-spoiler-hidden > a { \
            color: #868e96 !important; \
        }"
    );
}

function toggle_quiz_actions_sidebar() {
    $('.sidebar-quiz-actions .sidebar-content').slideToggle()
    $('.sidebar-quiz-actions .sidebar-footer').slideToggle()
    $('.sidebar-quiz-actions .sidebar-header').click(function() {
        $('.sidebar-quiz-actions .sidebar-content').slideToggle()
        $('.sidebar-quiz-actions .sidebar-footer').slideToggle()
    })
}

function mark_if_has_been_answered_before() {
    var answer_result = document.querySelector('.quiz-result-user');
    var insert_position = /:\/\/m\.naokr/i.test(location.href)? 
        ".question-rating > :last-child" : ".page-detail-author .page-detail-time"
    if (answer_result) {
        $(insert_position).after('<div  class="question-tag bg-question-type-4" \
            style="margin: 0 1.5rem; background-color: #FF0000 !important; border-radius: 4px;">已回答</div>');
    }
}

function add_multi_choice_question_warning() {
    var hint_node = $('.question-quiz-options .quiz-options-hint');
    if (hint_node) {
        hint_node.html(hint_node.html().replace("多选题", '<span class="question-tag bg-question-type-4" \
            style="margin: 0 0.2rem; background-color: #FF0000 !important;">多选题</span>'));
    }
}

async function excute_hide_features_on_ask_section() {
    var blocked_ask_ids = await GM.getValue("blocked_ask_ids", [])
    $("#ask-list > .ask-item").each((index, el) => {
        var ask = $(el);
        var ask_id = ask.find(".list-item-title").attr('href').replace(/.*ask\/(\d+)\/?$/, "$1");
        if ( blocked_ask_ids.indexOf(ask_id) != -1 ) {
            ask.remove();
        }
    })
}

function toggle_comment_section_on_ask_section() {
    var toggle_button_selector = "#ask-answers > .block-header > .block-title";
    $(toggle_button_selector).click(function() {
        $('#ask-answers > .block-body').slideToggle()
    });
    $(toggle_button_selector).click();
}

async function excute_actions_on_collection_page() {
    $('.collection-questions h5').unbind('click');
    await load_more_until_to_the_end('#question-list', '#load-more-questions a', '.collection-questions h5');
    await filter_all_questions_on_collection_page()
}

async function filter_all_questions_on_collection_page() {
    var answered_post_ids = await GM.getValue("answered_post_ids", [])
    var blocked_post_ids = await GM.getValue("blocked_post_ids", [])
    var answered_question_append_list = [];
    var question_nodes_list = document.querySelectorAll("#question-list > .question-item")
    $('.collection-questions h5').html($('.collection-questions h5').html().replace(/↱.*?↲/, "↱ 正在过滤问题 ↲"));
    await Promise.all(Array.from(question_nodes_list).map(async (post, index) => {
        var post_id = $(post).find(".list-item-title").attr('href').replace(/.*question\/(\d+)\/?$/, "$1");
        var author_id = $(post).find(".user-name a").attr('href').replace(/.*user\/(\d+)\/?$/, "$1");
        var question_excerpt = $(post).find('.question-item-excerpt').text();
        var tags = $(post).find(".question-tags").text();

        if ( answered_post_ids.indexOf(post_id) != -1
            || blocked_post_ids.indexOf(post_id) != -1
            || blocked_author_ids.indexOf(author_id) != -1
            || blocked_question_types.some(type => tags.includes(type))
            || ( block_limited_time_question && question_excerpt.search(/内完成答题/ig) != -1 )
        ) {
            post.remove();
        } else {
            var check_result = await check_if_question_is_answered_before(post_id)
            if (check_result) {
                post.remove();
                answered_question_append_list.push(post_id)
                console.log("问题" + post_id + "已移除：经请求检查")
            } else {
            }
        }
    }))
    $('.collection-questions h5').html($('.collection-questions h5').html().replace(/↱ .*? ↲/, "↱ 过滤问题完成 ↲")
        .replace(/(收录题目 \()\d+/, "$1" + document.querySelectorAll("#question-list > .question-item").length));
    save_unique_multi_ids_to_env(answered_question_append_list, answered_post_ids, "answered_post_ids");
}

async function check_if_question_is_answered_before(question_id) {
    var response = await url_get_webpage('https://www.naokr.com/question/' + question_id.toString())
    var parser = new DOMParser();
    var html_document = parser.parseFromString(response.responseText, "text/html");
    var answer_result = html_document.querySelector('.quiz-result-user');
    if (answer_result) {
        if (/一次通过/.test(answer_result.textContent)) return 1
        if (/回答正确/.test(answer_result.textContent)) return 2
        if (/回答错误/.test(answer_result.textContent)) return 3
    } else {
        return 0
    }
}

function add_various_buttons_on_collection_page() {
    var load_all_btn = $('<input type="button" value="载入全部"/>');
    $(".page-detail-footer-items:first-child").append(load_all_btn);
    load_all_btn.click(async function(event) {
        await load_more_until_to_the_end('#question-list', '#load-more-questions a', '.collection-questions h5');
    });
    var sort_by_correct_rate_btn = $('<input type="button" value="正确降序"/>');
    $(".page-detail-footer-items:first-child").append(sort_by_correct_rate_btn);
    sort_by_correct_rate_btn.click(function(event) {
        var list = document.querySelector('#question-list');
        [...list.children]
            .sort( (a, b) => {
                var get_collection_correct_rate = (post) => {
                    return parseInt($(post).find('.question-item-footer').text().replace(/[\s\S]*正确率\s+(\d+)%[\s\S]*/igm, "$1"));
                }
                var a_rate = get_collection_correct_rate(a) || 0;
                var b_rate = get_collection_correct_rate(b) || 0;
                return b_rate - a_rate;
            })
            .forEach(node=>list.appendChild(node));
    });
}

async function excute_actions_on_collections_list_in_userspace() {
    $('.user-content .nav-tabs-simple').unbind('click');
    await load_more_until_to_the_end('#collection-list', '#load-more-collections a', '.user-content .nav-tabs-simple');
    add_hide_buttons_to_all_elements("#collection-list > .collection-item-lite",
        ".list-footer-items > .list-footer-item:last-child", "have_read_collection_ids", function(ele) {
            return ele.attr('href').replace(/.*collection\/(\d+)\/?$/, "$1");
        })
    await excute_hide_features_to_all_collections_on_personal_page();
}

async function excute_hide_features_to_all_collections_on_personal_page() {
    $('.user-content .nav-tabs-simple').html($('.user-content .nav-tabs-simple').html().replace("正在加载全部条目", "正在过滤题目单"));
    var have_read_collection_ids = await GM.getValue("have_read_collection_ids", [])
    var count = 0;
    $("#collection-list > .collection-item-lite").each((index, el) => {
        var collection = $(el);
        var collection_id = collection.attr('href').replace(/.*collection\/(\d+)\/?$/, "$1");
        if ( have_read_collection_ids.indexOf(collection_id) != -1 ) {
            collection.remove();
            count++;
        }
    });
    $('.user-content .nav-tabs-simple').html($('.user-content .nav-tabs-simple').html().replace("正在过滤题目单...", "过滤完毕 已隐藏" + count + "个"));
}

function add_collections_dialog_monitor() {
    function callback(mutationList) {
        mutationList.forEach(async function(mutation) {
            switch (mutation.type) {
                case "attributes":
                    if (mutation.oldValue == "display: none;") {
                        await execute_tasks_to_collection_list();
                    }
                    break;
            }
        });
    }

    var collections_dialog_observer = new MutationObserver(callback);
    collections_dialog_observer.observe(document.querySelector("#load-more-collections a"), {
        attributeFilter: [ "style" ],
        attributes: true,
        attributeOldValue: true
    });
}

async function execute_tasks_to_collection_list() {
    await load_more_until_to_the_end('#dialog-collection-chooser .collection-list', '#load-more-collections a');
    trace_last_modi_time_of_collections();
    await sort_collections_by_edit_time('#dialog-collection-chooser .collection-list', (el) => {
        return $(el).find("button[data-url]").attr("data-url").replace(/.*collections\/(\d+)\/toggle/, "$1");
    });
}

function trace_last_modi_time_of_collections () {
    $('#dialog-collection-chooser .collection-list [data-action="collection-toggle"]').click(async function() {
        var id = $(this).attr("data-url").replace(/.*collections\/(\d+)\/toggle/, "$1");
        var last_modi_time_of_collections_obj = await GM.getValue("last_modi_time_of_collections", {});
        last_modi_time_of_collections_obj[id] = Date.now();
        GM.setValue("last_modi_time_of_collections", last_modi_time_of_collections_obj);
    })
}