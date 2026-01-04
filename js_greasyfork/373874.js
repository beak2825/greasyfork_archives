// ==UserScript==
// @name         ShoreTel Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a local phone book for you!
// @author       You
// @match        http://your.shortel.site.com:5449/*
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/373874/ShoreTel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373874/ShoreTel%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    function on_contact_clicked(e) {
        e= e || window.event;
        var target = e.target || e.srcElement;
        if (target.innerText.toLowerCase().trim() == 'call') {
            var input = document.evaluate('//*[@id="contacts"]/form/div/table/tbody/tr/td[1]/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var go = document.evaluate('//*[@id="contacts"]/form/div/table/tbody/tr/td[3]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var number = target.parentElement.getElementsByTagName('td')[1].innerText;
            input.value=number;
            go.click();
        } else if (target.innerText.toLowerCase().trim() == 'del') {
            var number = target.parentElement.getElementsByTagName('td')[1].innerText.trim();
            GM_deleteValue(number);
            fill_phone_book(pb);
        }
    }
    function fill_phone_book(pb) {
        if (!pb)
            pb = document.getElementById('PhoneBook');
        var rowCount = pb.rows.length;
        while(rowCount > 0) {
            rowCount--;
            console.log('deleting', rowCount);
            pb.deleteRow(rowCount)
        };
        var tr = document.createElement('tr');
        tr.addEventListener('click', function(event) {
            var inputs = prompt('UserName and Number, seperated by ;');
            inputs = inputs.split(';');
            if (inputs.length == 2) {
                var name = inputs[0].trim();
                var number = inputs[1].trim();
                GM_setValue(number, name);
                console.log(inputs);
            }
            fill_phone_book(pb);
        });
        var th = document.createElement('th');
        th.innerText="Name";
        tr.append(th);
        th = document.createElement('th');
        th.innerText="Number";
        tr.append(th);
        th = document.createElement('th');
        th.innerText="";
        tr.append(th);
        th = document.createElement('th');
        th.innerText="";
        tr.append(th);
        pb.append(tr);
        // fill phone book
        var obj_list = [];
        var number_list = GM_listValues();
        for (var i=0; i < number_list.length; i++) {
            var obj = {};
            obj.number = number_list[i];
            obj.name = GM_getValue(number_list[i])
            obj_list.push(obj)
        }
        obj_list.sort((a,b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0)
        for (var i=0; i < obj_list.length; i++) {
            console.log(obj_list[i]);
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.innerText=obj_list[i].name;
            tr.append(td);

            td = document.createElement('td');
            td.innerText=obj_list[i].number;
            td.setAttribute('style', 'padding:0 0 0 15px');
            tr.append(td);

            td = document.createElement('td');
            td.innerText='Call';
            td.setAttribute('style', 'padding:0 0 0 15px; cursor:pointer');
            tr.append(td);

            td = document.createElement('td');
            td.innerText='Del';
            td.setAttribute('style', 'padding:0 0 0 15px; cursor:pointer');
            tr.append(td);

            tr.addEventListener('click', function(e) {
                on_contact_clicked(e);
            });
            tr.addEventListener('mouseout', function(e) {
                this.classList.remove('yui-dt-highlighted');
            });
            tr.addEventListener('mouseover', function(e) {
                this.classList.add('yui-dt-highlighted');
            });

            pb.append(tr);
        }
    };
    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        // console.log(mutations, observer);
        // ...
        if (document.getElementById("call_manager")) {
            if (document.getElementById('PhoneBook'))
                return;
            var pb = document.createElement('table');
            pb.id = 'PhoneBook';

            fill_phone_book(pb);


            var target = document.getElementById("call_manager");
            target.append(pb);
        }
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true
        //...
    });
    var history_observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        // console.log(mutations, observer);
        // ...
        if (document.getElementById("history-menu")) {
            if (document.getElementsByClassName("datatable").length) {
                //console.log('inject history helper');
                var trs = document.getElementsByClassName('datatable')[0].getElementsByTagName('tr');
                for (var i=0; i < trs.length; i++) {
                    var tr = trs[i];
                    var tds = tr.getElementsByTagName('td');
                    if (tds.length) {
                        if (tds[0].innerText.startsWith('history')) {
                            var number = tds[3].innerText;
                            number = number.replace(/\s*/g,'');
                            number = number.replace(/.*(\d{11})/g,'$1');
                            var name = GM_getValue(number);
                            if (name) {
                                tds[2].getElementsByTagName('div')[0].innerText = name;
                                console.log(number +' ' + name);
                            } else {
                                console.log('No record for '+number+' '+name)
                            }
                        }
                    }
                }
            }
        }
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    history_observer.observe(document, {
        subtree: true,
        attributes: false,
        childList: true,
        //...
    });

})();