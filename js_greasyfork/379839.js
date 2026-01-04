// ==UserScript==
// @name         排除 豆瓣小组 关键字
// @namespace    chinaq
// @version      0.26
// @description  搜索页排除豆瓣小组包含指定关键字的链接。
// @author       shaoqi
// @match        *://www.douban.com/group/*
// @match        *://www.wsy.com/search*
// @match        *://sell.paipai.com/auction-list/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379839/%E6%8E%92%E9%99%A4%20%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%20%E5%85%B3%E9%94%AE%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/379839/%E6%8E%92%E9%99%A4%20%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%20%E5%85%B3%E9%94%AE%E5%AD%97.meta.js
// ==/UserScript==
var isWsy, isDouban, isDbd, host, rentStart, rentEnd, dbdFilterCheck, keywords;
(function () {
    'use strict';

    // Your code here...
    var isInit = true;

    let form = '<div style="position:fixed;right:0;top:10%;width:300px;height:300px;" id="divFilter"><div><input type="text" id="keyword" placeholder="输入需要排除的关键字"/><input type="button" id="addKey" value="添加"/></div><div id="divWord"  style="width:300px;height:250px;border:1px solid #c4dbfe"></dvi></div>';
    $('body').append(form);
    var $divWord = $('#divWord');
    var domain = window.location.host;
    if (domain == 'www.wsy.com') {
        isWsy = true;
        host = 'wsy';
    } else if (domain == 'www.douban.com') {
        isDouban = true;
        host = 'douban';
        let divRentRange = '<div>租金范围：<input type="text" id="rentStart" style="width:40px" value="1"/>~<input style="width:40px" type="text" id="rentEnd" value="9999"/><input type="button" id="addRent" value="确定"/></div>';
        $('#divFilter').prepend(divRentRange);
        rentStart = getSessionStorage('rentStart');
        rentEnd = getSessionStorage('rentEnd');
        if (rentStart) {
            $("#rentStart").val(rentStart);
        } else {
            rentStart = $("#rentStart").val();
        }
        if (rentEnd) {
            $("#rentEnd").val(rentEnd);
        } else {
            rentEnd = $("#rentEnd").val();;
        }
    } else if (domain == 'sell.paipai.com') {
        isDbd = true;
        host = 'dbd';
        let divFilterCheck = '<div><input type="checkbox" id="dbdFilterCheck" title="开启过滤"/>开启过滤</div>';
        $('#divFilter').prepend(divFilterCheck);
        dbdFilterCheck = getSessionStorage('dbdFilterCheck');
        if (dbdFilterCheck == 'true') {
            $('#dbdFilterCheck').prop('checked', true);
        }
        $('#dbdFilterCheck').click(function () {
            dbdFilterCheck = $(this).prop("checked") ? true : false;
            setSessionStorage('dbdFilterCheck', dbdFilterCheck);
        })
    }
    keywords = localStorage.getItem(host);
    console.log(keywords);
    if (keywords) {
        keywords = JSON.parse(keywords);
        let label = "";
        for (var i = 0; i < keywords.length; i++) {
            label += getLabel(keywords[i]);
        }
        $divWord.append(label);
        filterDiv();
    }

    $('#addKey').click(function () {
        let word = $('#keyword').val();
        if (!word) {
            return;
        }
        if (!keywords) {
            keywords = new Array();
        }
        console.log(keywords);
        $divWord.append(getLabel(word));
        keywords.push(word);
        setStorage(keywords);
        filterDiv();
        $('#keyword').val('');
    });
    //添加租金返回
    $('#addRent').click(function () {
        rentStart = $('#rentStart').val();
        rentEnd = $('#rentEnd').val();
        setSessionStorage('rentStart', rentStart);
        setSessionStorage('rentEnd', rentEnd);
        location.reload();
    });


    $('#divWord').on("click", 'span', function () {
        let $span = $(this);
        let $label = $span.text();
        log($label);
        for (var i = 0; i < keywords.length; i++) {
            if ($label == keywords[i]) {
                $span.remove();
                keywords.splice(i, 1);
                setStorage(keywords);
                break;
            }
        }
        location.reload();
    })


    // Object.defineProperty(XMLHttpRequest.prototype,"status",{
    //     get: function(status) {
    //         console.log({
    //             url: this.responseURL,
    //             data: this.response
    //         })
    //     }
    // })

})();


function parseRent(str) {
    //房租正则
    let regRent = /\d+/g;
    let money = str.match(regRent);
    if (money) {
        for (let m in money) {
            if (str.indexOf(money[m] + '米') > -1) {
                continue;
            }
            let mon = Number(money[m]);
            if ((mon > 500 && mon < 10000))
                return mon;
        }
    }
    return 0;
}

function filterDiv() {
    if (!keywords) {
        return;
    }
    if (isWsy) {
        $("div.item-c").each(function (i) {
            let $div = $(this);
            var title = $div.find("a img.lazy").prop('alt');
            for (var k = 0; k < keywords.length;) {
                if (title.indexOf(keywords[k++]) > -1) {
                    $div.hide();
                }
            }
        });
    } else if (isDouban) {
        let regEmoji = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        $("table.olt tr:gt(0)").each(function (i) {
            let $div = $(this);
            //删除回应大于30的数据
            let comments = 0;
            //区分我的小组页面 和具体小组页回应字段
            let $tdReply = $div.find("td:eq(1)");
            if ($tdReply.hasClass('.td-reply')) {
                comments = $tdReply.text();
            } else {
                comments = $div.find("td:nth-child(3)").text();
            }
            if (parseInt(comments) > 30) {
                $div.hide();
                return true;
            }
            let $divA = $div.find("td:eq(0) a");
            let title = $divA.prop('title');

            if (title.match(/求\S*房/) || title.match(/1\d{10}/) || title.match(regEmoji)) {
                log(title + "-" + $divA.prop('href'));
                $div.hide();
                return true;
            } else if (title.length < 5) {
                log(title + "-" + $divA.prop('href'));
                $div.hide();
                return true;
            }

            for (let k = 0; k < keywords.length;) {
                if (title.indexOf(keywords[k++]) > -1) {
                    log(title + "-" + $divA.prop('href'));
                    $div.hide();
                }
            }
            let rent = parseRent(title);
            log((rent && (rent < rentStart || rent > rentEnd)) + '--------' + rent);
            //过滤月租不在指定区间内的
            if (rent && (rent < rentStart || rent > rentEnd)) {
                log(title + "-" + $divA.prop('href'));
                $div.hide();
                return true;
            }

            //新标签打开
            $divA.attr('target', '_blank');
            //完整显示标题
            $divA.text($divA.attr('title'));
        });
    } else if (isDbd) {
        $("div.gl-i-wrap").each(function (i) {
            let $div = $(this);
            dbdFilter($div);
        });
    }
    isInit = false;
}

//夺宝岛div过滤
function dbdFilter($div) {
    if (dbdFilterCheck != 'true') {
        return;
    }
    let title = $div.find("div.p-img a").prop('title');
    let spanTxt = $div.find("div.p-label span").text();
    if (spanTxt.indexOf('自营') == -1) {
        $div.parent().hide();
        return true;
    }
    for (let k = 0; k < keywords.length; k++) {
        if (title.indexOf(keywords[k]) == -1) {
            $div.parent().hide();
            return true;
        }
    }
}

function setStorage(obj) {
    localStorage.setItem(host, JSON.stringify(obj));
}

function setSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}

function getLabel(word) {
    return '<span class="label" style="margin:0px 2px 0px 2px;background-color:#F2F1D7;cursor:pointer">' + word + '</span>'
}

function log(obj) {
    console.log(obj);
}

window.onload = function () {
    log(host);
    if (isDbd) {
        //DOMNodeInserted   
        // $('#plist').on('DOMNodeInserted', function (e) {
        //     let $div = $(e.target).find('div');
        //     dbdFilter($div);
        //     console.log('DOMNodeInserted11');
        // });

        //点击翻页，触发过滤
        // $('ul.el-pager').on('click', function (e) {
        //     log('点击后过滤222');
        //     setTimeout(() =>
        //         filterDiv()
        //         , 800);
        // })


        filterDiv();
        // document.onkeydown = chang_page;
    } else if (isDouban) {
        document.onkeydown = chang_page;
    }
}


function chang_page(event) {
    log(event.keyCode);
    if (event.keyCode == 37 || event.keyCode == 33) {
        //方向左键
        document.querySelector('#content > div > div.article > div.paginator > span.prev > a').click()
    } else if (event.keyCode == 39 || event.keyCode == 34) {
        //方向右键
        // $('#content > div > div.article > div.paginator > span.next > a')[0].click();
        document.querySelector('div.paginator > span.next > a').click()
    } else if (event.keyCode == 13 && $('#keyword').is(':focus')) {
        $('#addKey').click();
    }
}

function observerDiv() {
    //选择一个需要观察的节点
    // var targetNode = document.getElementsById('plist');
    let name = '#plist';
    var targetNode = $(name)[0];
    log(name);

    // 设置observer的配置选项
    var config = { childList: true, subtree: true };

    // 当节点发生变化时的需要执行的函数
    var callback = function (mutationsList, observer) {
        log(mutationsList);
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
                if (mutation.target = 'ul.gl-wrap') {
                    for (let node of mutation.addedNodes) {
                        //  log(node.innerText);
                    }
                }
            }
            else if (mutation.type == 'subtree') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback);

    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, config);
}