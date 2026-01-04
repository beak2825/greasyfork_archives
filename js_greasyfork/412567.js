// ==UserScript==
// @name         rm
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       iku
// @include      https://redmine.ticketplan.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412567/rm.user.js
// @updateURL https://update.greasyfork.org/scripts/412567/rm.meta.js
// ==/UserScript==

var $ = window.jQuery;
let stp = setTimeout(step1, 100)
let a = new Date
let c = a.getMonth()+1
let b = 11
let d = c > b

function step1() {
    var createZ = document.createElement ('div');
    createZ.innerHTML = '<button id="tm3_SearchBttn" type="button">Создать задачу</button>';
    createZ.setAttribute ('id', 'tm1_btnContainer');
    createZ.style.cssText=`z-index: 10100; padding: 0px 0px;`
    document.querySelector('#top-menu > ul > div').after (createZ)
    var srchBtn3 = document.getElementById ("tm3_SearchBttn");
    let aws3 = srchBtn3.addEventListener ("click", ButtonClickAction3); //AFTERTRAN.thr_pg_aproove_tr
    function ButtonClickAction3 (zEvent)
    {
        window.location="https://redmine.ticketplan.info/issues/new"
    }

    var zNode1 = document.createElement ('div');
    zNode1.innerHTML = '<button id="tm2_SearchBttn" type="button">Посмотреть назначенные</button>';
    zNode1.setAttribute ('id', 'tm1_btnContainer');
    zNode1.style.cssText=`z-index: 10100; padding: 0px 0px;`
    document.querySelector('#top-menu > ul > div').after (zNode1)
    var srchBtn2 = document.getElementById ("tm2_SearchBttn");
    let aws2 = srchBtn2.addEventListener ("click", ButtonClickAction2); //AFTERTRAN.thr_pg_aproove_tr
    function ButtonClickAction2 (zEvent)
    {
        window.location="https://redmine.ticketplan.info/issues?utf8=%E2%9C%93&set_filter=1&sort=id%3Adesc&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=assigned_to_id&op%5Bassigned_to_id%5D=%3D&v%5Bassigned_to_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=project&c%5B%5D=tracker&c%5B%5D=status&c%5B%5D=subject&c%5B%5D=relations&c%5B%5D=assigned_to&group_by=&t%5B%5D="
    }

    if (window.location.toString().includes("/issues/new") === true) {
        if (document.querySelector('div#content > h2') !==null) {
            if (d) {console.log(); return}
            //document.querySelector('#issue_project_id').value = '32'
            var zNode = document.createElement ('div');
            zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Эксплуатация, Наблюдатели ВС, Назначить на Максима </button>';
            zNode.setAttribute ('id', 'tm1_btnContainer');
            zNode.style.cssText=``
    document.querySelector('div#content > h2').append(zNode)
            var srchBtn = document.getElementById ("tm1_SearchBttn");
            let aws = srchBtn.addEventListener ("click", ButtonClickAction);
            function ButtonClickAction (zEvent)
            {
                $("select#issue_project_id").val('32').change()
                let stp = setTimeout(step2, 500)
                function step2() {
                    // назначить на макса document.querySelector('#issue_assigned_to_id').value = '54'
                    $('#watchers_inputs').append('<label id=\"issue_watcher_user_ids_59\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"59\" checked=\"checked\" /> Александр С. (ВС)<\/label><label id=\"issue_watcher_user_ids_72\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"72\" checked=\"checked\" /> Сергей С. (ВС)<\/label><label id=\"issue_watcher_user_ids_75\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"75\" checked=\"checked\" /> Ольга Т<\/label><label id=\"issue_watcher_user_ids_131\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"131\" checked=\"checked\" /> Andrey U<\/label><label id=\"issue_watcher_user_ids_136\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"136\" checked=\"checked\" /> Игорь К.<\/label><label id=\"issue_watcher_user_ids_217\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"217\" checked=\"checked\" /> Виктория Букш<\/label>');
                    srchBtn.removeEventListener("click", ButtonClickAction);
                }
            }
        }
        else {return step1()}
    }
}