// ==UserScript==
// @name         Faction Bank: Sort
// @namespace    http://lonerider543.pythonanywhere.com/
// @version      1.2.4
// @description  Sort Faction Bank Alphabetically
// @author       lonerider543
// @match        https://www.torn.com/factions.php*
// @downloadURL https://update.greasyfork.org/scripts/404049/Faction%20Bank%3A%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/404049/Faction%20Bank%3A%20Sort.meta.js
// ==/UserScript==

const targetNode = document.getElementById('mainContainer');
const config = {attributes: true, childList: true, subtree: true};

var execute = true;

var open = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
    this.addEventListener("readystatechange", function(event) {
    if (this.readyState == 4) {
        let page = this.responseURL.substring(this.responseURL.indexOf('torn.com/') + 'torn.com/'.length, this.responseURL.indexOf('.php'));
        if (page == 'factions') {
            let responseText = this.responseText
            if (responseText.startsWith('<div class="give-wrap">')) {
                execute = true
            }
        }
    }}, false);
    open.call(this, method, uri, async, user, pass);
};

Number.prototype.format_thousand_seperator = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

const getIndicesOf = (searchStr, str, caseSensitive) => {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

const main = () => {
    if (!execute) return;
    execute = false;

    var url = window.location.href;
    var split = url.split('&');
    if(split.length == 4)
    {
        var target_user = `${split[1].substring(11)} [${split[2].substring(9)}]`;
        var target_money = split[3].substring(7);

        setTimeout(() => {
            $('input#money-user').val(target_user);
            $('input.count').eq(0).val(target_money);
            $('input.count').eq(0).focus();
        }, 1500);
    }

    setTimeout(function(){
        var wrappers = $('.userlist-wrapper');
        wrappers.each(function(index, value) {
            var depositors = $(this).find('ul.user-info-list-wrap').children('li.depositor');
            depositors.sort(function ( a, b ) {
                try {
                    var aText = $('a.user.name > span', a).attr('title').toUpperCase();
                    var bText = $('a.user.name > span', b).attr('title').toUpperCase();

                    if ( aText < bText ) {
                        return -1;
                    }

                    if ( aText > bText ) {
                        return 1;
                    }

                    return 0;
                }
                catch {
                    return 0;
            }
            });

            $(wrappers[index]).find('ul.user-info-list-wrap').append(depositors);
        });
    }, 2000);
};

const edit = (mutationList, observer) => {
        if (mutationList.length > 20) {
            for (let test of mutationList) {
                if ($(test.target).get(0).className == "input-money-group no-max-value success") {
                    setTimeout(() => {
                        console.log($(test.target));
                        let target_mutation = $(test.target).get(0);

                        let original_value_display = target_mutation.children[0].defaultValue;

                        let target_parent = target_mutation.parentNode.parentNode.parentNode.parentNode;
                        let parent_class = target_parent.className;

                        if (parent_class == 'depositor' || parent_class == 'depositor inactive') {
                            target_parent.style.height = '75px';

                            let original_text = document.createTextNode('Original Balance: $' + parseInt(original_value_display).format_thousand_seperator())
                            let original_span = document.createElement('span');
                            let br_node = document.createElement('br');
                            let input_node = document.createElement('input');

                            input_node.className = 'pb-input';
                            original_span.className = 'pb-original';

                            original_span.appendChild(original_text);
                            target_parent.appendChild(original_span);

                            target_parent.appendChild(br_node);
                            target_parent.appendChild(input_node);

                            $(".pb-input").off("input");

                            $(".pb-input").on("input", function(){
                                let input_value = $(this).val()
                                let target_node = $(this).parent().find('input.input-money').eq(0);

                                let original_value = target_node[0].defaultValue;
                                let input_number = parseInt(input_value);
                                if (isNaN(input_number)) {
                                    input_number = 0;
                                }
                                let new_value = parseInt(original_value) + input_number;

                                target_node[0].value = new_value.format_thousand_seperator();
                            })
                        }
                    }, 500);
                    break;
                }
            }
        }
    if (mutationList.length == 24) {
        
    }
}

const observer = new MutationObserver(main);
observer.observe(targetNode, config);

setTimeout(function(){
    var node_list = [];
    var observer_list = [];

    const edit_config = {attributes: true, childList: true, subtree: true, attributeOldValue: true, characterData: true};


    $('.user-info-list-wrap').each(function(){
        node_list.push($(this));
        observer_list.push(new MutationObserver(edit));
    });

    for (var i in node_list) {
        observer_list[i].observe(node_list[i].get(0), edit_config);
    }

    $('body').on('DOMSubtreeModified', 'div.show', function(){
        let new_value = $(this)[0].children[0].innerText;

        let depositor = $(this)[0].parentNode.parentNode.parentNode;
        let original_node = $(depositor).find('.pb-original');
        if (original_node.length > 0) {
            let original_string = original_node[0].innerText;
            let old_value = original_string.substring(18, original_string.length);

            if (new_value != old_value) {
                original_node.text('Original Balance: ' + new_value);
                $(depositor).find('.pb-input').val('')
            }
        }
      });
}, 1000);