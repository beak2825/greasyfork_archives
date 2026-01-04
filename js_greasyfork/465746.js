// ==UserScript==
// @name        Wanikani Kana Vocabulary Injector
// @namespace   rfindley
// @description Injects Kana Vocabulary into the Open Framework items for testing
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @version     1.0.0
// @author      Robin Findley
// @copyright   2023, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/465746/Wanikani%20Kana%20Vocabulary%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/465746/Wanikani%20Kana%20Vocabulary%20Injector.meta.js
// ==/UserScript==

window.doublecheck = {};

(function(gobj) {

    /* global wkof, Stimulus, WaniKani, importShim, $ */

    let script_name = 'Kana Vocabulary Injector';
    let wkof_version_needed = '1.1.3';

    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    function promise(){let a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

    wkof.include('ItemData');
    wkof.ready('ItemData').then(startup);

    function startup() {
        old_fetcher = wkof.ItemData.registry.sources.wk_items.fetcher;
        wkof.ItemData.registry.sources.wk_items.fetcher = new_fetcher;
    }

    let old_fetcher;
    let kana_items = [
        {
            "id": 9210,
            "object": "kana_vocabulary",
            "url": "https://api.wanikani.com/v2/subjects/9210",
            "data_updated_at": "2023-05-03T13:01:51.333012Z",
            "data": {
                "created_at": "2023-04-24T23:52:43.457614Z",
                "level": 8,
                "slug": "おやつ",
                "hidden_at": null,
                "document_url": "https://www.wanikani.com/vocabulary/おやつ",
                "characters": "おやつ",
                "meanings": [
                    {
                        "meaning": "Snack",
                        "primary": true,
                        "accepted_answer": true
                    }
                ],
                "auxiliary_meanings": [],
                "parts_of_speech": [
                    "noun"
                ],
                "meaning_mnemonic": "<reading>Oh yah! Two</reading> (<ja>おやつ</ja>) <vocabulary>snack</vocabulary>s, just for you. Imagine your two snacks. What are they? I bet they're delicious. Oh yah!\r\n\r\nYou can use <ja>おやつ</ja> to refer to a small amount of food eaten between meals, including candies and light meals like onigiri.",
                "context_sentences": [
                    {
                        "en": "Today I had a muffin for a snack.",
                        "ja": "今日はおやつにマフィンを食べた。"
                    },
                    {
                        "en": "Shall we take a snack break?",
                        "ja": "そろそろおやつにする？"
                    },
                    {
                        "en": "Kaori's snacks are always homemade!",
                        "ja": "カオリちゃんのおやつは、いつも手作りだよ！"
                    }
                ],
                "pronunciation_audios": [
                    {
                        "url": "https://files.wanikani.com/w4yp5o02betioucki05lp6x78quy",
                        "metadata": {
                            "gender": "male",
                            "source_id": 44757,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 2,
                            "voice_actor_name": "Kenichi",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/webm"
                    },
                    {
                        "url": "https://files.wanikani.com/qd82u8ijchzt196fiaoqxnv2ktmg",
                        "metadata": {
                            "gender": "male",
                            "source_id": 44757,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 2,
                            "voice_actor_name": "Kenichi",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/ogg"
                    },
                    {
                        "url": "https://files.wanikani.com/232ivelhhbvy5uhih0ozuyyxvjla",
                        "metadata": {
                            "gender": "male",
                            "source_id": 44757,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 2,
                            "voice_actor_name": "Kenichi",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/mpeg"
                    },
                    {
                        "url": "https://files.wanikani.com/8d1o3zi4nz6vdxyjyjgs47rmep6t",
                        "metadata": {
                            "gender": "female",
                            "source_id": 44698,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 1,
                            "voice_actor_name": "Kyoko",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/webm"
                    },
                    {
                        "url": "https://files.wanikani.com/dsri4976w1x9qm0zfm98ck7jqwge",
                        "metadata": {
                            "gender": "female",
                            "source_id": 44698,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 1,
                            "voice_actor_name": "Kyoko",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/mpeg"
                    },
                    {
                        "url": "https://files.wanikani.com/k1fdjcyvierz0ajmfjkxy0jjsabl",
                        "metadata": {
                            "gender": "female",
                            "source_id": 44698,
                            "pronunciation": "おやつ",
                            "voice_actor_id": 1,
                            "voice_actor_name": "Kyoko",
                            "voice_description": "Tokyo accent"
                        },
                        "content_type": "audio/ogg"
                    }
                ],
                "lesson_position": 0,
                "spaced_repetition_system_id": 1
            }
        }
    ];

    function new_fetcher(config, options) {
        let p = promise();
        old_fetcher(config, options).then(function(data) {
            kana_items.forEach((item) => {
                data[item.id] = item;
            });
            p.resolve(data);
        });
        return p;
    }

})(window.doublecheck);