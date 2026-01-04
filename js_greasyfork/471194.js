// ==UserScript==
// @name        易班考试
// @namespace   Violentmonkey Scripts
// @match       https://exam.yooc.me/group/*/exam/*
// @require     https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @grant       none
// @version     1.1
// @author      阿翔哦哦
// @description 引用：https://greasyfork.org/zh-CN/scripts/457443-%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95/code，理论上所有不限次数的考试都可以用，感谢@木木的代码及思路，此脚本无使用限制，易班官方修复前可用
// @downloadURL https://update.greasyfork.org/scripts/471194/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/471194/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 手动添加mate标签
    const addMeta = (name, content) => {
        const meta = document.createElement('meta');
        meta.content = content;
        meta.name = name;
        document.getElementsByTagName('head')[0].appendChild(meta);
    };

    addMeta(
        'http-equiv',
        'Content-Security-Policy',
    );
    addMeta('content', 'upgrade-insecure-requests');

    function my_replace(text) {
        text = text.replace(new RegExp(/( |	|[\r\n])|\s+|\s+$/g), "");
        return text;
    }

    var localStorage = window.localStorage;
    localStorage.clear()

    function set_value(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }

    function get_value(key) {
        if (localStorage) var v = localStorage.getItem(key);
        if (!v) {
            return;
        }
        return v;
    }

    // let local_str = get_value("tk");
    // if (typeof (local_str) !== "undefined") {
    //         tk = JSON.parse(local_str);
    //     } else {
    //         tk = JSON.parse("{}");
    //     }
    let tk;
    let id;
    let examuser_id;
    let hook_fetch = window.fetch;
    window.fetch = async function (...args) {
        if (args[0].indexOf("paper") !== -1) {
            id = args[0].slice(args[0].indexOf("yibanId=") + 8)
            examuser_id = args[0].slice(args[0].indexOf("examuserId=") + 11, args[0].indexOf("&"))
            return await hook_fetch(...args).then((oriRes) => {
                let hookRes = oriRes.clone()
                hookRes.text().then(res => {
                    /*res = my_replace(res);
                    let js = JSON.parse(res);
                    // decode_res(js);
                    js["id"] = id;
                    js["token"] = token;
                    get_answer(js);*/
                })
                return oriRes
            })
        }
        return hook_fetch(...args)
    }

    /*function get_answer(res) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'http://127.0.0.1:8000/', true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(JSON.stringify(res));
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                tk = JSON.parse(httpRequest.responseText);
                console.log(tk);
            }
        };
    }*/

    function decrypt(encrypt_str, yiban_id) {
        let decrypted = CryptoJS.AES.decrypt(encrypt_str, CryptoJS.enc.Utf8.parse(CryptoJS.MD5("yooc@admin" + yiban_id).toString().substring(8, 24)), {
            iv: CryptoJS.enc.Utf8.parse("42e07d2f7199c35d"),
            mode: CryptoJS.mode.CBC
        });

        return decrypted.toString(CryptoJS.enc.Utf8)
    }

    function get_question() {
        var res;
        let question_answer_dict = {}
        for (var i=0; i<localStorage.length; i++) {
            if (localStorage.key(i).startsWith("exam-paper")) {
                res = JSON.parse(my_replace(localStorage.getItem(localStorage.key(i))));
                break;
            }
        }
        if (res === undefined) {
            alert("找不到试卷，请刷新重试，或者检查是否开启缓存");
        } else {
            res = res["value"]["paper"]
            for(var i=0; i<res.length; i++) {
                for(var j=0; j<res[i]["subjects"].length; j++) {
                    let one_question = res[i]["subjects"][j];
                    let an_str = decrypt(one_question["answer"], id)
                    // console.log(an_str)
                    let result = JSON.parse(an_str);
                    let answer_list = []
                    if (result.length > 0) {
                        for(let l=0; l<result.length; l++) {
                            answer_list.push(my_replace(one_question['option'][parseInt(result[l])][0]))
                        }
                    }
                    question_answer_dict[my_replace(one_question['title'][0])] = answer_list
                }
            }

        }
        return question_answer_dict
    }

    function add_button() {
        if (!document.getElementsByTagName("ul").length > 0) {
            setTimeout(function () {
                add_button();
            }, 1000);
        }
        let ul = document.getElementsByTagName("ul");
        let bottom = ul[1];
        let last = bottom.getElementsByTagName("li")[0].children[0];
        let next = bottom.getElementsByTagName("li")[3].children[0];
        let jiaojuan_p = document.getElementsByClassName("pr-s")[0];
        let bt = document.createElement("button");
        bt.innerText = "冲！";
        let main = document.getElementsByTagName("main")[0];
        let h3 = main.getElementsByTagName("h3")[0];
        let has_done = false;
        bt.onclick = function () {
            let question_answer_dict = get_question(localStorage)
            if(!Object.keys(question_answer_dict).length) {
                alert("解密失败，请勿点击交卷，请刷新页面重试")
                return
            }
            let error_index_list = []
            let question_list = Object.keys(question_answer_dict)
            console.log(question_answer_dict)
            for(let i=0; i<question_list.length; i++) {
                let main = document.getElementsByTagName("main")[0];
                let h3 = main.getElementsByTagName("h3")[0];
                let title = my_replace(h3.textContent).split("分]")[1]
                let body = h3.parentElement.children[1].children[0];
                let ans_l = body.getElementsByTagName("li");
                console.log(title)
                let answers_list = question_answer_dict[title]

                if(answers_list === undefined || !answers_list.length) {
                    error_index_list.push(String(i+1))
                    next.click()
                    continue
                }

                for (let j=0; j<ans_l.length; j++) {
                    for(let k=0; k<answers_list.length; k++) {
                        let option = answers_list[k]
                        if (my_replace(ans_l[j].textContent).endsWith(option)) {
                            if (!ans_l[j].className.endsWith("_c")) {
                                ans_l[j].click()
                            }
                            break
                        }
                    }
                }

                next.click()
            }

            if (error_index_list.length > 0) {
                alert("以下题目解密失败：" + error_index_list.join(","))
            } else {
                alert("自动点击完成")
            }
        };
        jiaojuan_p.appendChild(bt);
    }

    window.onload = function () {
        add_button();
    }
})();