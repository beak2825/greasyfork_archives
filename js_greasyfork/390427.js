// ==UserScript==
// @name         Tencent Cloud VPC CNS Manager
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  generate resolv for specify vpc
// @author       mayue
// @match        https://console.cloud.tencent.com/cns/detail/unity-genesis-test.com/records*
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/390427/Tencent%20Cloud%20VPC%20CNS%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/390427/Tencent%20Cloud%20VPC%20CNS%20Manager.meta.js
// ==/UserScript==


//let g_tk = seajs.require("util").getACSRFToken(); //csrf-code
let g_tk = "";
let s_key = "";
let vpc_id = "vpc-j5ja2wqo";
let domain = "unity-genesis-test.com";


let target = 0;
let succ = 0;
let fail = 0;

function begin_counter(total) {
    target = total;
    succ = 0;
    fail = 0;
}

function check(result) {
    let output_container = document.querySelector("#output_container");
    if (result === "succ") {
        succ += 1;
    }
    if (result === "fail") {
        fail += 1;
    }
    let output = "succ:" + succ + "/" + target;
    output += "fail:" + fail + "/" + target;
    output_container.textContent = output;
    // if (succ + fail === target) {
    //     location.reload();
    // }
    if (succ === target) {
        location.reload();
    }
}

function getSessionKey() {
    let cookie = document.cookie;
    let begin = cookie.indexOf("skey");
    let end = cookie.substring(begin).indexOf(";");
    return cookie.substring(begin + 5, begin + end);
}


function getACSRFToken() {
    if (g_tk === "") {
        let skey = getSessionKey();
        console.log("session key:", skey);
        for (var t = 5381, n = 0, i = skey.length; n < i; ++n) t += (t << 5) + skey.charCodeAt(n);
        g_tk = 2147483647 & t
    }
    return g_tk;
}


function resolv_instances(response) {
    console.log("total instance: " + response.TotalCount);
    let instance_count = response.InstanceSet.length;
    if (response.TotalCount != instance_count) {
        console.log("reponse instance count conflict");
    }
    begin_counter(instance_count);
    for (let i = 0; i < instance_count; i++) {
        let sub_domain = response.InstanceSet[i].InstanceName;
        let vpc_ip = response.InstanceSet[i].PrivateIpAddresses[0];
        console.log(sub_domain, vpc_ip);
        create_resolv(sub_domain, vpc_ip);
    }
}

function get_and_resolv_instances() {

    let vpc_id_container = document.querySelector("#input_container");
    vpc_id = vpc_id_container.value;
    let data = {
        "serviceType": "cvm",
        "action": "DescribeInstances",
        "data": {
            "filters": [{
                "name": "vpc-id",
                "values": [vpc_id]
            }],
            "limit": 50,
            "offset": 0,
            "Version": "2017-03-12"
        },
        "regionId": "4"
    };
    let url = "https://iaas.cloud.tencent.com/cgi/capi?i=cvm/DescribeInstances&uin=10001035325";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);
            let response = JSON.parse(xhr.response);
            console.log(response.code);
            if (xhr.status == 200 && response.code == 0) {
                console.log("get instance succ");
                resolv_instances(response.data.Response);
            } else {
                console.log("get instance err");
            }
        }
    }
    xhr.open("post", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.setRequestHeader("X-CsrfCode", getACSRFToken());
    xhr.send(JSON.stringify(data));
}


function get_all_resolv() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);
            let response = JSON.parse(xhr.response);
            console.log(response.status.code);
            if (xhr.status == 200 && response.status.code == 0) {
                console.log("get succ");
            } else {
                console.log("get err");
            }
        }
    }
    let url = "https://wss.cloud.tencent.com/dns/api/record/get_vpc_record_list?g_tk=" + getACSRFToken() + "&domain=" + domain + "&keyword=&record_type=all&q_project_id=-1&isPrivate=true&_=1568968430159";
    xhr.open("get", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
}

function delete_all() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);
            let response = JSON.parse(xhr.response);
            console.log(response.status.code);
            if (xhr.status == 200 && response.status.code == 0) {
                console.log("get succ");
                delete_resolvs(response.result.records);
            } else {
                console.log("get err");
            }
        }
    }
    let url = "https://wss.cloud.tencent.com/dns/api/record/get_vpc_record_list?g_tk=" + getACSRFToken() + "&domain=" + domain + "&keyword=&record_type=all&q_project_id=-1&isPrivate=true&_=1568968430159";
    xhr.open("get", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
}

function delete_resolvs(records) {
    console.log("record to delete: " + records.length);
    let count = records.length;
    begin_counter(count);
    for (let i = 0; i < count; i++) {
        delete_resolv(records[i].id);
    }
}

function delete_resolv(record_id) {
    let data = "";
    data += "domain=" + domain;
    data += "&record_id=" + record_id;
    data += "&isPrivate=true";

    let xhr = new XMLHttpRequest();
    xhr.record_id = record_id;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);

            let response = JSON.parse(xhr.response);
            console.log(response.status.code);
            if (xhr.status == 200 && response.status.code == 0) {
                console.log("delete succ:" + xhr.record_id);
                check("succ");
            } else {
                console.log("delete fail:" + xhr.record_id);
                check("fail");
            }
        }
    }
    let url = "https://wss.cloud.tencent.com/dns/api/record/remove_vpc_record?g_tk=" + getACSRFToken();
    xhr.open("post", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}




function create_resolv(sub_domain, vpc_ip) {
    let data = "";
    data += "domain=" + domain;
    data += "&sub_domain=" + sub_domain;
    data += "&record_type=A";
    data += "&record_line=%E9%BB%98%E8%AE%A4";
    data += "&ttl=600";
    data += "&q_project_id=-1";
    data += "&value=" + vpc_ip;
    data += "&mx=5";

    let xhr = new XMLHttpRequest();
    xhr.sub_domain = sub_domain;
    xhr.vpc_ip = vpc_ip;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);

            let response = JSON.parse(xhr.response);
            console.log(response.status.code);
            if (xhr.status == 200 && response.status.code == 0) {
                console.log("create succ:" + xhr.sub_domain + "\t" + xhr.vpc_ip);
                check("succ");
            } else {
                console.log("create fail:" + xhr.sub_domain + "\t" + xhr.vpc_ip);
                check("fail");
            }
        }
    }
    let url = "https://wss.cloud.tencent.com/dns/api/record/create_vpc_record?g_tk=" + getACSRFToken();
    xhr.open("post", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function update_resolv(sub_domain, vpc_ip, record_id) {
    let data = "";
    data += "domain=" + domain;
    data += "&sub_domain=" + sub_domain;
    data += "&record_type=A";
    data += "&record_line=%E9%BB%98%E8%AE%A4";
    data += "&ttl=600";
    data += "&q_project_id=-1";
    data += "&value=" + vpc_ip;
    data += "&mx=5";
    data += "&record_id=" + record_id;

    let xhr = new XMLHttpRequest();
    xhr.sub_domain = sub_domain;
    xhr.vpc_ip = vpc_ip;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);

            let response = JSON.parse(xhr.response);
            console.log(response.status.code);
            if (xhr.status == 200 && response.status.code == 0) {
                console.log("update succ:" + xhr.sub_domain + "\t" + xhr.vpc_ip);
                check("succ");
            } else {
                console.log("update fail:" + xhr.sub_domain + "\t" + xhr.vpc_ip);
                check("fail");
            }
        }
    }
    let url = "https://wss.cloud.tencent.com/dns/api/record/update_vpc_record?g_tk" + getACSRFToken();
    xhr.open("post", url, true);
    xhr.withCredentials = true
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function wait_and_init_ui() {
    if (init_ui() == false) {
        window.setTimeout(wait_and_init_ui, 1000);
    }
}

function init_ui() {
    console.log("init_ui");
    var p_node = document.querySelector("div.newstyle-paddingbox div.newstyle-main div.tc-15-action-panel span");
    if (p_node == null) {
        p_node = document.querySelector("div.tc-15-action-panel span");
    }
    if (p_node == null) {
        return false;
    }

    var span = document.createElement("span");
    var sub_net = document.createElement("input");
    sub_net.type = "text";
    sub_net.id = "input_container";
    sub_net.className = "tc-15-input-text search-input";
    sub_net.placeholder = "vpc_id";
    sub_net.value = vpc_id;
    span.append(sub_net);
    p_node.append(span);

    var button = document.createElement('button');
    button.className = "tc-15-btn m";
    button.textContent = "添加vpc的全部cvm";
    button.onclick = get_and_resolv_instances;
    //container.style = 'background-color:#eeeeee;display: -webkit-flex; display: flex; flex-direction: column;';
    p_node.append(button);
    //p_node.insertBefore(button, p_node.lastElementChild);
    //p_node.insertBefore(button, p_node.children[2]);


    var button_delete_all = document.createElement('button');
    button_delete_all.className = "tc-15-btn m weak";
    button_delete_all.textContent = "删除全部";
    button_delete_all.onclick = delete_all;
    p_node.append(button_delete_all);


    var output = document.createElement("span");
    output.id = "output_container";
    p_node.append(output);


    let href_reg = /console.cloud.tencent.com\/cns\/detail\/([a-zA-Z0-9.\-_]+)\/records\/1/;
    domain = location.href.match(href_reg)[1];
    return true;
}

(function() {
    'use strict';
    wait_and_init_ui();

})();