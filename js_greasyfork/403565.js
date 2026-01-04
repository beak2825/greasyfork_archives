// ==UserScript==
// @name         PAWS - NNB
// @namespace    https://www.tornpaws.uk/
// @version      1.6
// @description  Display NNB on OC page.
// @author       lonerider543, TinyGodzilla
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403565/PAWS%20-%20NNB.user.js
// @updateURL https://update.greasyfork.org/scripts/403565/PAWS%20-%20NNB.meta.js
// ==/UserScript==

const targetNode = document.getElementById('faction-crimes')
const config = { attributes: true, childList: true, subtree: true };

var execute = true;

const callback = function(mutationsList, observer) {
    if (!execute) return;
    add_NNB()
};

var open = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
    this.addEventListener("readystatechange", function(event) {
    if (this.readyState == 4) {
        let page = this.responseURL.substring(this.responseURL.indexOf('torn.com/') + 'torn.com/'.length, this.responseURL.indexOf('.php'));
        if (page == 'factions') {
            let responseText = this.responseText
            if (responseText.startsWith('<div class="faction-crimes-wrap ">')) {
                execute = true
            }
        }
    }}, false);
    open.call(this, method, uri, async, user, pass);
};

function add_NNB() {
    console.log('EXECUTE')
    execute = false;

    let assigned_player_ids = [];
    let unassigned_player_ids = [];

    $('.organize-wrap li.member > a').each(function() {
        let name_string = $(this).text();
        let player_id = name_string.substring(name_string.indexOf('[') + 1, name_string.indexOf(']'));
        assigned_player_ids.push(player_id);
    })

    $('.scrollbar-wrap .viewport').eq(0).find('li.member > a').each(function() {
        let name_string = $(this).text();
        let player_id = name_string.substring(name_string.indexOf('[') + 1, name_string.indexOf(']'));
        unassigned_player_ids.push(player_id);
    })

    let req_data = {
        'key': 'l33th4ck3r'
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.tornpaws.uk/nnb/",
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(req_data),
        synchronous: true,
        onload : function(res) {
            console.log(res);
            let nnb_data = res.responseText;
            console.log(nnb_data);
            let nnb_obj = JSON.parse(nnb_data);
            console.log(nnb_obj);

            $('li.level').attr('style', 'width: 80px !important');
            $('li.stat').attr('style', 'width: 60px !important');

            $('.organize-wrap .details-list ul.title > li.level')
                .after(
                '<li class="ce" style="width: 40px !important; text-align: right;"><span class="d-hide">CE</span><span class="t-hide">CE</span><div class="t-delimiter white"></div></li>'
                )
                .after(
                '<li class="nnb" style="width: 40px !important; text-align: right;"><span class="d-hide">NNB</span><span class="t-hide">NNB</span><div class="t-delimiter white"></div></li>'
                );

            $('.scrollbar-wrap ul.item > li.level').not(".viewport li.level")
                .after(
                '<li class="ce" style="width: 40px !important; text-align: right;"><span class="d-hide">CE</span><span class="t-hide">CE</span><div class="t-delimiter white"></div></li>'
                )
                .after(
                '<li class="nnb" style="width: 40px !important; text-align: right;"><span class="d-hide">NNB</span><span class="t-hide">NNB</span><div class="t-delimiter white"></div></li>'
                );

            assigned_player_ids.forEach(function(item, index) {
                let nnb;
                if (nnb_obj.nnb.hasOwnProperty(item)) {
                    let nnb = nnb_obj.nnb[item]['nnb'];
                    if (nnb == -1) nnb = '';
                    let ce = nnb_obj.nnb[item]['crimeexp'];
                $('.organize-wrap .details-list ul.item > li.level').eq(index)
                    .after(
                    `<li class="ce" style="width: 40px !important; text-align: right;"><span class="d-hide">#${ce}</span><span class="t-hide">#${ce}</span><div class="t-delimiter white"></div></li>`
                    )
                    .after(
                    `<li class="nnb" style="width: 40px !important; text-align: right;"><span class="d-hide">${nnb}</span><span class="t-hide">${nnb}</span><div class="t-delimiter white"></div></li>`
                    );
            }})

            unassigned_player_ids.forEach(function(item, index) {
                let nnb;
                let ce;
                if (nnb_obj.nnb.hasOwnProperty(item)) {
                    nnb = nnb_obj.nnb[item]['nnb'];
                    if (nnb == -1) nnb = '';
                    ce = '#' + nnb_obj.nnb[item]['crimeexp'];
                } else {
                    nnb = '';
                    ce = '';
                }
                $('.crimes-list .viewport').each(function() {
                    $(this).find('li.level').eq(index)
                        .after(
                        `<li class="ce" style="width: 40px !important; text-align: right;"><span class="d-hide">${ce}</span><span class="t-hide">${ce}</span><div class="t-delimiter white"></div></li>`
                        )
                        .after(
                        `<li class="nnb" style="width: 40px !important; text-align: right;"><span class="d-hide">${nnb}</span><span class="t-hide">${nnb}</span><div class="t-delimiter white"></div></li>`
                        );
                })
            })
        }
    });

    $(function(){
        $("<style>")
        .text(".organize-wrap .nnb{width:79px !important; text-align:right} .details-list li.level{width:175px !important} .scrollbar-wrap ul.item > li.offences{width:90px !important} .scrollbar-wrap .nnb{width:53px !important}")
        .appendTo($("body"));
    });
}

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);