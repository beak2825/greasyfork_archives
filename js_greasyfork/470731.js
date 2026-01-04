// ==UserScript==
// @name         PKU-Hole snapshoter
// @author       WindMan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT License
// @description  PKU-Hole snapshoter tool
// @match        https://treehole.pku.edu.cn/web/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/470731/PKU-Hole%20snapshoter.user.js
// @updateURL https://update.greasyfork.org/scripts/470731/PKU-Hole%20snapshoter.meta.js
// ==/UserScript==


function needcache(url, request) {
    if (request.status != 200) {
        return false;
    }

    if (
        (url.includes("api/pku_hole")) ||          // example: https://treehole.pku.edu.cn/api/pku_hole?page=1&limit=25
        (url.includes("api/follow_v2")) ||         // example: https://treehole.pku.edu.cn/api/follow_v2?page=1&limit=25
        (url.includes("api/pku_comment_v3/")) ||   // example: https://treehole.pku.edu.cn/api/pku_comment_v3/xxxxxxxxx?limit=10
        (url.includes("api/pku/"))                 // example: https://treehole.pku.edu.cn/api/pku/xxxxxxx
    ) {
        return true;
    }
    return false;
}

function fix_hole(pid, text) {
    let temp = {
        "pid": pid,
        "text": text,
        "type": "text",
        "timestamp": 32515708440,
        "reply": 0,
        "likenum": 0,
        "extra": 0,
        "anonymous": 1,
        "is_top": 0,
        "label": 0,
        "status": 0,
        "is_comment": 1,
        "tag": "backup",
        "is_follow": 0,
        "is_protect": 0,
        "image_size": [
            0,
            0
        ],
        "label_info": null
    }
    return temp;
}

function fix_single_hole(data_, pid) {
    let data = {
        "pid": pid,
        "text": "DELETED",
        "type": "text",
        "timestamp": 32515708440,
        "reply": 0,
        "likenum": 0,
        "extra": 0,
        "anonymous": 1,
        "url": "",
        "is_top": 0,
        "label": 0,
        "status": 0,
        "is_comment": 1,
        "tag": "",
        "is_follow": 0,
        "image_size": [
            0,
            0
        ],
        "label_info": null
    };
    if (data_ != null) {
        data = data_;
    }
    let temp = {
        "code": 20000,
        "data": data,
        "message": "success",
        "success": true,
        "timestamp": 32515708440
    }
    return temp;
}

function fix_comment_page(pid, data, page, next, last, total, prev, limit) {
    pid = pid.toString();
    last = last.toString();
    if (prev) {
        prev = prev.toString();
    }
    let next_page_url = null;
    let prev_page_url = null;

    if (next != null) {
        next_page_url = "http:\/\/treehole.pku.edu.cn\/api\/pku_comment_v3\/" + pid + "?page=" + next;
    }
    if (prev != null) {
        prev_page_url = "http://treehole.pku.edu.cn/api/pku_comment_v3/" + pid + "?page=" + prev;
    }
    let temp = {
        "code": 20000,
        "data": {
            "current_page": page,
            "data": data,
            "first_page_url": "http:\/\/treehole.pku.edu.cn\/api\/pku_comment_v3\/" + pid + "?page=1",
            "from": (page - 1) * 15 + 1,
            "last_page": Number(last),
            "last_page_url": "http:\/\/treehole.pku.edu.cn\/api\/pku_comment_v3\/" + pid + "?page=" + last,
            "next_page_url": next_page_url,
            "path": "http:\/\/treehole.pku.edu.cn\/api\/pku_comment_v3\/" + pid,
            "per_page": limit,
            "prev_page_url": prev_page_url,
            "to": page * 15,
            "total": total
        },
        "message": "success",
        "success": true,
        "timestamp": 32515708440
    }
    return temp;
}

function store_into_storage(key, value) { // 未来会换成indexedDB
    localStorage.setItem(key, value);
}

function update_comment_list(pid, comment_data) {
    let comment_list = localStorage.getItem("comment_" + pid.toString());
    let comment_set = new Set()
    if (comment_list) {
        comment_set = new Set(JSON.parse(comment_list));
    }
    comment_data.forEach(function (element) {
        comment_set.add(element.cid);
    });
    let comment_array = Array.from(comment_set);
    comment_array.sort((a, b) => a.cid - b.cid);
    console.log("cache comment list: ", pid);
    store_into_storage("comment_" + pid.toString(), JSON.stringify(comment_array));
}

async function cache_(url, request) {
    let response_json = JSON.parse(request.response);

    if (url.includes("api/pku_hole") || url.includes("follow_v2")) {
        let response_data = response_json.data.data;
        response_data.forEach(function (element) {
            store_into_storage("pid_" + element.pid.toString(), JSON.stringify(element));
            console.log("cache pid: ", element.pid);
        });
    } else if (url.includes("pku_comment_v3")) {
        let pid = Number(url.split("pku_comment_v3/")[1].split("?")[0]);
        if (response_json.code == 20000) {
            let response_data = response_json.data.data;
            update_comment_list(pid, response_data);
            response_data.forEach(function (element) {
                store_into_storage("cid_" + element.cid.toString(), JSON.stringify(element));
                console.log("cache cid: ", element.cid);
            });
        }
    }
}

function find_cache_available(pid) {
    let value = localStorage.getItem("pid_" + pid.toString());
    if (value) {
        value = JSON.parse(value);
    }
    return value;
}

function modify_holeapi_page(response_json) {
    let response_data = response_json.data.data;
    let modified_data = []
    let missing_list = [];
    let last_pid = -1;
    response_data.sort((a, b) => b.pid - a.pid);
    response_data.forEach(function (element) {
        if (element.pid < last_pid - 1) {
            var start = element.pid + 1;
            var end = last_pid - 1;
            var part_range = Array.from({ length: end - start + 1 }, (_, index) => start + index).reverse();
            missing_list.concat(part_range);
            part_range.forEach(function (missed_pid) {
                let cache_seatch_res = find_cache_available(missed_pid);
                if (cache_seatch_res) {
                    cache_seatch_res.tag = "backup";
                    modified_data.push(cache_seatch_res);
                    console.log("backup found: ", missed_pid);
                } else {
                    modified_data.push(fix_hole(missed_pid, "DELETED"))
                    console.log("backup not found: ", missed_pid);
                }
            })
        }

        modified_data.push(element);
        last_pid = element.pid;

    });
    response_json.data.data = modified_data;
    let modifiedtext = JSON.stringify(response_json);
    return modifiedtext;
}

function modify_holeapi_hole(pid, response_json) {
    let response_data = response_json.data.data;
    if (response_data.length) {
        return null;
    }
    let modified_data = [];
    let cache_seatch_res = find_cache_available(pid);
    if (cache_seatch_res) {
        cache_seatch_res.tag = "backup";
        modified_data.push(cache_seatch_res);
        console.log("backup found: ", pid);
    } else {
        modified_data.push(fix_hole(pid, "DELETED"));
        console.log("backup not found: ", pid);
    }
    response_json.data.data = modified_data;
    let modifiedtext = JSON.stringify(response_json);
    return modifiedtext;
}

function modify_comment_page(pid, page, limit) {
    let comment_list_str = localStorage.getItem("comment_" + pid.toString());
    if (!comment_list_str) {
        return null;
    }
    let comment_list = JSON.parse(comment_list_str);
    if (page == null) {
        page = 1;
    }
    let next = null;
    let last = Math.ceil(comment_list.length / limit);
    let total = comment_list.length;
    let prev = null;
    if (page > 1) {
        prev = page - 1;
    }
    if (page * limit < comment_list.length) {
        next = page + 1;
    }
    let data = [];
    for (var i = (page - 1) * 15; i < page * 15; i++) {
        if (i >= comment_list.length) { break; }
        let comment_ = localStorage.getItem("cid_" + comment_list[i].toString());
        if (comment_ == null) {
            data.push([]);
        } else {
            let cid_cache = JSON.parse(comment_);
            cid_cache.tag = "backup";
            data.push(cid_cache);
        }

    }
    comment_page = fix_comment_page(pid, data, page, next, last, total, prev, limit);
    return comment_page;

}

function modify_single_hole(pid) {
    let cache_seatch_res = find_cache_available(pid);
    let fixed_hole = fix_single_hole(cache_seatch_res, pid);
    let modifiedtext = JSON.stringify(fixed_hole);
    return modifiedtext;

}

function update_response(url, request) {
    let response_json = JSON.parse(request.response);
    let modifiedtext;
    if (url.includes("api/pku_hole") && url.includes("page") && (!url.includes("keyword"))) {
        modifiedtext = modify_holeapi_page(response_json);
        Object.defineProperty(request, 'responseText', { value: modifiedtext });

    } else if (url.includes("api/pku_hole") && url.includes("pid")) {
        var pid = Number(url.split("pid=")[1]);
        modifiedtext = modify_holeapi_hole(pid, response_json);
        if (modifiedtext) {
            console.log("modified pid: ", pid);
            Object.defineProperty(request, 'responseText', { value: modifiedtext });
        }
    } else if (url.includes("pku_comment_v3")) {
        params = url.split("?")[1].split("&")
        let pid = Number(url.match(/comment_v3\/(\d+)\?/)[1]);
        let limit = Number(url.match(/limit=(\d+)/)[1]);
        let page = null;
        if (url.includes("page")) {
            page = Number(url.match(/page=(\d+)/)[1]);
        }
        if (response_json.code != 20000) {
            modifiedtext = modify_comment_page(pid, page, limit);
            if (modifiedtext) {
                Object.defineProperty(request, 'responseText', { value: modifiedtext });
            }
        }
    } else if (url.includes("/api/pku/")) {
        let pid = Number(url.split("/api/pku/")[1]);
        if (response_json.code != 20000) {
            modifiedtext = modify_single_hole(pid);
            if (modifiedtext) {
                Object.defineProperty(request, 'responseText', { value: modifiedtext });
            }
        }
    }

}

function handle_response(url, request) {
    if (!needcache(url, request)) {
        return;
    }
    cache_(url, request);
    update_response(url, request);
}

(function () {
    'use strict';
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (method == "GET") {
                    handle_response(url, this);
                }
            }
        });
        originalOpen.apply(this, arguments);
    };


})();