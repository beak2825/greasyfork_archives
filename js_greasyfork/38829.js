// ==UserScript==
// @name         BGM NSFW
// @namespace    https://greasyfork.org/zh-CN/scripts/38829-bgm-nsfw
// @version      0.5
// @description  NSFW for bangumi
// @author       Vincent
// @include      /^https?:\/\/((bangumi|bgm)\.tv|chii.in)\/group\/topic\/\d+$/
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38829/BGM%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/38829/BGM%20NSFW.meta.js
// ==/UserScript==

GM_addStyle(`
.btn-nsfw {
    color: #AAAAAA;
    border-radius: 4px;
    padding: 0 4px;
    margin-left: 4px;
    cursor: pointer;
}
.btn-nsfw-cancel {
    color: #FFFFFF;
    background: #F09199;
    border-radius: 4px;
    padding: 0 4px;
    margin-left: 4px;
    cursor: pointer;
}
.post-nsfw {
    display: none !important;
}
`);

var nsfw_items = undefined;
var topic_id = null;

const DB_NAME = 'nsfw';
const DB_TOPIC_TABLE = 'topic';

var DB = {
    update: function() {
        this.action(function(objectStore) {
            objectStore.put(nsfw_items, topic_id);
        });
    },
    delete: function() {
        this.action(function(objectStore) {
            if (nsfw_items.length) {
                objectStore.put(nsfw_items, topic_id);
            } else {
                objectStore.delete(topic_id);
            }
        });
    },
    init: function () {
        this.action(function(objectStore) {
            var list = objectStore.get(topic_id);
            list.onsuccess = function(event) {
                if (list.result != undefined && list.result.length) {
                    nsfw_items = list.result;
                    item = $('#post_' + nsfw_items.join(', #post_'));
                    addNSFW(item);

                    item.children('div.re_info').append('<small class="btn-nsfw-cancel">NSFW</small>');
                };

                addNSFWBtn();
            }
        });
    },
    action: function(callback) {
        var connect = indexedDB.open(DB_NAME, 1);
        connect.onerror = function(event) {
            // 错误处理程序在这里。
        };

        connect.onupgradeneeded = function(event) {
            var objectStore = event.target.result.createObjectStore(DB_TOPIC_TABLE);
        };

        connect.onsuccess = function(event) {
            var transaction = event.target.result.transaction([DB_TOPIC_TABLE], "readwrite");
            var objectStore = transaction.objectStore(DB_TOPIC_TABLE);
            callback(objectStore);
        };
    }
};

(function() {
    topic_id = window.location.pathname.split('/')[3];
    DB.init();
})();

function addNSFWBtn() {
    $('#comment_list').on('mouseenter', 'div[id*=post_]', function () {
        if (!$(this).children('div.re_info').children('small.btn-nsfw, small.btn-nsfw-cancel').length) {
            $(this).children('div.re_info').append('<small class="btn-nsfw">NSFW</small>');
        }
    });
    $('#comment_list').on('mouseleave', 'div[id*=post_]', function () {
        $(this).children('div.re_info').children('small.btn-nsfw').remove();
    });

    // temp action
    $('#comment_list').on('click', 'small.btn-nsfw', function () {
        var item = $(this).parent().parent();

        addNSFW(item);
        storeNSFWLocalDB(item.prop('id').split('_')[1]);

        $(this).addClass('btn-nsfw-cancel');
        $(this).removeClass('btn-nsfw');
    });
    $('#comment_list').on('click', 'small.btn-nsfw-cancel', function () {
        var item = $(this).parent().parent();

        removeNSFW(item);
        cancelNSFWLocalDB(item.prop('id').split('_')[1]);

        $(this).addClass('btn-nsfw');
        $(this).removeClass('btn-nsfw-cancel');
    });
}

function addNSFW(item) {
    item.not('.row_reply').addClass('sub_reply_collapse');
    item.children('div.inner').children('div.cmt_sub_content').addClass('post-nsfw');
    item.children('div.inner').children('div.reply_content').children('div.message').addClass('post-nsfw');
}

function removeNSFW(item) {
    item.filter('.sub_reply_collapse').removeClass('sub_reply_collapse');
    item.children('div.inner').children('div.cmt_sub_content').removeClass('post-nsfw');
    item.children('div.inner').children('div.reply_content').children('div.message').removeClass('post-nsfw');
}

function storeNSFWLocalDB(post_id) {
    if (nsfw_items == undefined || nsfw_items == '') {
        nsfw_items = [];
    }
    if (nsfw_items.indexOf(post_id) == - 1) {
        // add to array
        nsfw_items.push(post_id);
        DB.update();
    }
}

function cancelNSFWLocalDB(post_id) {
    if (nsfw_items == undefined || nsfw_items == '') {
        nsfw_items = [];
    }
    if (nsfw_items.indexOf(post_id) != - 1) {
        // remove from array
        nsfw_items.splice(nsfw_items.indexOf(post_id), 1);
        if (nsfw_items.length) {
            DB.update();
        } else {
            DB.delete();
        }
    }
}
