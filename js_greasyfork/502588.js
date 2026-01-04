// ==UserScript==
// @name         增加人物“出演”完整显示
// @version      0.2
// @description  在角色详情页面增加“出演”列表，并显示完整出演条目，优化原详情页面样式
// @author       kedvfu
// @include     http*://bgm.tv/character/*
// @include     http*://chii.in/character/*
// @include     http*://bangumi.tv/character/*
// @license MIT
// @namespace https://greasyfork.org/users/1302565
// @downloadURL https://update.greasyfork.org/scripts/502588/%E5%A2%9E%E5%8A%A0%E4%BA%BA%E7%89%A9%E2%80%9C%E5%87%BA%E6%BC%94%E2%80%9D%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502588/%E5%A2%9E%E5%8A%A0%E4%BA%BA%E7%89%A9%E2%80%9C%E5%87%BA%E6%BC%94%E2%80%9D%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    const performLi = $(`<li><a href="javascript:void(0)" id="performListBtn">出演</a></li>`);
    const api = "https://api.bgm.tv/v0";
    const characterId = parseInt(location.href.match(/\/character\/(\d+)/)[1]);
    const columnCrtB = $("#columnCrtB");
    const performList = $(`<div id="columnCrtC" class="column" style="display: none;"><h2 class="subtitle">出演</h2><ul class="browserList" id="performList"></ul></div>`)
    const columnCrtCStyle = `
    #columnCrtC {
        margin-top: 10px;
        width: 720px;
    }`
    const collapseBtn = $(`<div id="collapseBtn">收起</div>`);
    const collapseBtnStyle = `
    #collapseBtn {
        width: 100%;
        height: 20px;
        margin: 3px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: #ddd;
        transition: all 0.3s ease-in-out;
    }
    #collapseBtn:hover {
        background-color: #ddd;
        color: #333;
        transition: all 0.3s ease-in-out;
    }
    `
    const currentPageBtn = $(".navTabs .focus");
    const currentPerformList = $("#columnCrtB > .browserList");
    let loaded = false;
    let expanded = true

    function collapseList() {
        const items = currentPerformList.find("> li");
        if (expanded) {
            items.slice(0).animate({opacity: 0}, 200, function () {
                $(this).slideUp(300, function () {
                    $(this).prop('disabled', false);
                });
            });
        } else {
            items.slice(0).slideDown(300, function() {
                $(this).css('opacity', 0).show().animate({ opacity: 1 }, 200, function() {
                    $(this).prop('disabled', false);
                });
            });
        }
        expanded =!expanded;
        collapseBtn.text(expanded? "收起" : "展开")
    }

    function addPerformList() {
        columnCrtB.hide();
        columnCrtC.show();
        performListBtn.addClass("focus")
        currentPageBtn.removeClass("focus");
        currentPageBtn.attr("href", "javascript:void(0)")
        if (!loaded) {
            $.getJSON(`${api}/characters/${characterId}/subjects`).done(function (data) {
                let odd = true;
                for (let i = 0; i < data.length; i++) {
                    const subject = data[i];
                    const staff = subject.staff;
                    const name = subject.name;
                    const name_cn = subject.name_cn;
                    const image = subject.image.replace("pic/cover/l/", "pic/cover/g/")
                    const type = subject.type;
                    const id = subject.id;
                    odd = !odd;
                    const li = $(`
<li class="item ${odd ? 'odd' : 'even'} clearit">
    <div class="innerLeftItem ll">
        <a href="/subject/${id}" title="${name} / ${name_cn}"
           class="subjectCover cover ll">
            <img src="${image}" alt="${name}"
                 class="cover">
        </a>
        <div class="inner">
            <h3>
                <span class="ico_subject_type subject_type_${type} ll"></span>
                <a class="l" href="/subject/${id}">${name}</a></h3>
            <span class="badge_job">${staff}</span> <small class="grey">${name_cn}</small></div>
    </div>
    <ul class="innerRightList rr" id="rightList_${id}">
    </ul>
</li>
                    `);
                    performListShow.append(li);
                }

            }).done(function () {
                $.getJSON(`${api}/characters/${characterId}/persons`).done(function (data2) {
                    for (let i = 0; i < data2.length; i++) {
                        const person = data2[i];
                        const personImage = person.images.large.replace("pic/crt/l/", "pic/crt/s/");
                        const personName = person.name;
                        const personId = person.id;
                        const subjectId = person.subject_id;
                        const personLi = $(`
    <li class="clearit">
        <a href="/person/${personId}" title="${personName}" class="subjectCover avatar rr">
            <img src="${personImage}" width="32" alt="${personName}" class="avatar">
        </a>
        <div class="inner">
            <h3><a class="l" href="/person/${personId}">${personName}</a></h3>
            <small class="grey">CV</small>
        </div>
    </li>
                    `);
                        $(`#rightList_${subjectId}`).append(personLi);
                    }

                });
                loaded = true;
            });
        }
    }

    function backToCurrentPage() {
        performListBtn.removeClass("focus")
        currentPageBtn.addClass("focus");
        columnCrtB.show();
        columnCrtC.hide();
    }

    collapseBtn.on("click", collapseList)
    currentPerformList.before(collapseBtn)
    performLi.on("click", addPerformList)
    $(".navTabs").append(performLi);
    columnCrtB.after(performList)
    $("head").append(`<style>${columnCrtCStyle}</style><style>${collapseBtnStyle}</style>`)
    currentPageBtn.on("click", backToCurrentPage)

    const columnCrtC = $("#columnCrtC");
    const performListShow = $("#performList");
    const performListBtn = $("#performListBtn");

    if (currentPageBtn.text() === "概览") {
        loaded = true;
        performListShow.append(currentPerformList.clone())
    }
})();