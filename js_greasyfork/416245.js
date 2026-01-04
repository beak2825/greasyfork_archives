// ==UserScript==
// @name         Overmind Helper
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  try to take over the world!
// @author       You
// @include      /^https?://.*overmind\.hz\.netease\.com/.*$
// @grant        none
// @license      WTF
// @downloadURL https://update.greasyfork.org/scripts/416245/Overmind%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/416245/Overmind%20Helper.meta.js
// ==/UserScript==

// ---------------------------------------------------------------------------------------------

var saveRecentSprints = function(){
    console.log('saveRecentSprints');
    setTimeout(function(){
        hideRecentSprients();

        var title = document.getElementsByClassName("m-header")[0].textContent.split("/")[1];
        var recentSprintsJson = window.localStorage.getItem("recentSprints");
        if (recentSprintsJson == null) {
            recentSprintsJson = "{}";
            window.localStorage.setItem("recentSprints", recentSprintsJson);
        }

        var recentSprints = JSON.parse(recentSprintsJson);
        if (recentSprints[title] == null) {
            recentSprints[title] = location.href;
            recentSprintsJson = JSON.stringify(recentSprints);
            window.localStorage.setItem("recentSprints", recentSprintsJson);
        }
    }, 1000);
};

var showRecentSprints = function(){
    console.log('showRecentSprints');
    setTimeout(function(){
        hideRecentSprients();

        var recentSprintsJson = window.localStorage.getItem("recentSprints");
        if (recentSprintsJson == null) {
            recentSprintsJson = "{}";
            window.localStorage.setItem("recentSprints", recentSprintsJson);
        }
        var recentSprints = JSON.parse(recentSprintsJson);

        var recent = document.createElement('div');
        recent.setAttribute("id", "myRecentSprints");
        var container = document.getElementById("container");
        container.insertBefore(recent, container.children[1]);

        var title = document.createElement('div');
        title.setAttribute("style", "margin-left: 20px; padding-top 20px;");
        title.innerHTML = "<span>最近使用&nbsp;<a id=\"clearMyRecentSprints\">[清空]</a></span>";
        recent.appendChild(title);

        document.getElementById("clearMyRecentSprints").addEventListener('click',function(){
            window.localStorage.removeItem("recentSprints");
            hideRecentSprients();
            showRecentSprints();
		}, false)

        var list = document.createElement('ol');
        list.setAttribute("style", "margin-left: 20px;");
        recent.appendChild(list);
        for(var sprint in recentSprints) {
            var item = document.createElement('li');
            item.innerHTML="<a href=\"" + recentSprints[sprint] + "\">" + sprint + "</a>";
            list.appendChild(item);
        }

     }, 1000);
};

var hideRecentSprients = function() {
    console.log('hideRecentSprients');
    var recent = document.getElementById("myRecentSprints");
    if (recent != null) {
        recent.parentElement.removeChild(recent);
    }
};

var refreshRecentSprints = function() {
    if (location.pathname.includes("/sprint/todo/")) {
        hideRecentSprients();
        saveRecentSprints();
    } else if(location.pathname.includes("/sprint/list")) {
        hideRecentSprients();
        showRecentSprints();
    } else {
        hideRecentSprients();
    }
};

// ---------------------------------------------------------------------------------------------

var saveRecentViews = function(){
    console.log('saveRecentViews');
    setTimeout(function(){
        hideRecentViews();

        var title = document.getElementsByClassName("ant-breadcrumb")[0].textContent.split("/")[1];

        var recentViewsJson = window.localStorage.getItem("recentViews");
        if (recentViewsJson == null) {
            recentViewsJson = "{}";
            window.localStorage.setItem("recentViews", recentViewsJson);
        }

        var recentViews = JSON.parse(recentViewsJson);
        if (recentViews[title] == null) {
            recentViews[title] = location.href;
            recentViewsJson = JSON.stringify(recentViews);
            window.localStorage.setItem("recentViews", recentViewsJson);
        }
    }, 1000);
};

var showRecentViews = function() {
    console.log('showRecentViews');
    setTimeout(function(){
        hideRecentViews();

        var recentViewsJson = window.localStorage.getItem("recentViews");
        if (recentViewsJson == null) {
            recentViewsJson = "{}";
            window.localStorage.setItem("recentViews", recentViewsJson);
        }
        var recentViews = JSON.parse(recentViewsJson);

        var recent = document.createElement('div');
        recent.setAttribute("id", "myRecentViews");
        var container = document.getElementById("container");
        container.insertBefore(recent, container.children[1]);

        var title = document.createElement('div');
        title.setAttribute("style", "margin-left: 20px; padding-top 20px;");
        title.innerHTML = '<span>最近使用&nbsp;<a id="clearMyRecentViews">[清空]</a></span>';
        recent.appendChild(title);

        document.getElementById("clearMyRecentViews").addEventListener('click',function(){
            window.localStorage.removeItem("recentViews");
            hideRecentViews();
            showRecentViews();
		}, false)

        var list = document.createElement('ol');
        list.setAttribute("style", "margin-left: 20px;");
        recent.appendChild(list);
        for(var view in recentViews) {
            var item = document.createElement('li');
            item.innerHTML="<a href=\"" + recentViews[view] + "\">" + view + "</a>";
            list.appendChild(item);
        }

     }, 1000);
};

var hideRecentViews = function() {
    console.log('hideRecentViews');
    var recent = document.getElementById("myRecentViews");
    if (recent != null) {
        recent.parentElement.removeChild(recent);
    }
};

var refreshRecentViews = function() {
    if (location.pathname.includes("/viewManage/detail/")) {
        hideRecentViews();
        saveRecentViews();
    } else if(location.pathname.includes("/viewManage/list")) {
        hideRecentViews();
        showRecentViews();
    } else {
        hideRecentViews();
    }
};

// ---------------------------------------------------------------------------------------------

var saveRecentVersions = function(){
    console.log('saveRecentVersions');
    setTimeout(function(){
        hideRecentVersions();

        var title = document.getElementsByClassName("ant-breadcrumb")[0].textContent.split("/")[1];

        var recentVersionJson = window.localStorage.getItem("recentVersions");
        if (recentVersionJson == null) {
            recentVersionJson = "{}";
            window.localStorage.setItem("recentVersions", recentVersionJson);
        }

        var recentVersions = JSON.parse(recentVersionJson);
        if (recentVersions[title] == null) {
            recentVersions[title] = location.href;
            recentVersionJson = JSON.stringify(recentVersions);
            window.localStorage.setItem("recentVersions", recentVersionJson);
        }
    }, 1000);
};

var showRecentVersions = function() {
    console.log('showRecentVersions');
    setTimeout(function(){
        hideRecentVersions();

        var recentVersionsJson = window.localStorage.getItem("recentVersions");
        if (recentVersionsJson == null) {
            recentVersionsJson = "{}";
            window.localStorage.setItem("recentVersions", recentVersionsJson);
        }
        var recentVersions = JSON.parse(recentVersionsJson);

        var recent = document.createElement('div');
        recent.setAttribute("id", "myRecentVersions");
        var container = document.getElementById("container").children[0].children[0];
        container.insertBefore(recent, container.children[1]);

        var title = document.createElement('div');
        title.setAttribute("style", "margin-left: 20px; padding-top 20px;");
        title.innerHTML = '<span>最近使用&nbsp;<a id="clearMyRecentVersions">[清空]</a></span>';
        recent.appendChild(title);

        document.getElementById("clearMyRecentVersions").addEventListener('click',function(){
            window.localStorage.removeItem("recentVersions");
            hideRecentVersions();
            showRecentVersions();
		}, false)

        var list = document.createElement('ol');
        list.setAttribute("style", "margin-left: 20px;");
        recent.appendChild(list);
        for(var version in recentVersions) {
            var item = document.createElement('li');
            item.innerHTML="<a href=\"" + recentVersions[version] + "\">" + version + "</a>";
            list.appendChild(item);
        }

     }, 1000);
};

var hideRecentVersions = function() {
    console.log('hideRecentVersions');
    var recent = document.getElementById("myRecentVersions");
    if (recent != null) {
        recent.parentElement.removeChild(recent);
    }
};

var refreshRecentVersions = function() {
    if (location.pathname.includes("/versions/list/") && location.pathname.includes("/base")) {
        hideRecentVersions();
        saveRecentVersions();
    } else if(location.pathname.includes("/versions/list")) {
        hideRecentVersions();
        showRecentVersions();
    } else {
        hideRecentVersions();
    }
};

// ---------------------------------------------------------------------------------------------

var viewPresetOfMoyi = '{"title":{"fixed":"left","initHide":true,"show":true,"order":0},"status":{"initHide":true,"show":true,"order":7},"assignee":{"initHide":true,"show":true,"order":9},"reporter":{"initHide":true,"show":true,"order":8},"verifier":{"initHide":true,"show":true,"order":10},"businessAreaDTO":{"initHide":true,"show":false,"order":24},"relatedMouleId":{"initHide":true,"show":true,"order":11},"relateTargetDTOS":{"initHide":true,"show":false,"order":26},"relateProjectDTOS":{"initHide":true,"show":false,"order":27},"priority":{"initHide":true,"show":false,"order":28},"sprintDTO":{"initHide":true,"show":true,"order":29},"versionDTOS":{"initHide":true,"show":true,"order":30},"dueDate":{"initHide":true,"show":false,"order":31},"planStartTime":{"initHide":true,"show":false,"order":32},"planSubmitTestTime":{"initHide":true,"show":false,"order":33},"planReleaseTime":{"initHide":true,"show":false,"order":34},"createdAt":{"initHide":true,"show":false,"order":35},"updatedAt":{"initHide":true,"show":false,"order":36},"originalEstimate":{"initHide":true,"show":false,"order":37},"timeSpent":{"initHide":true,"show":false,"order":38},"customfield_448":{"initHide":true,"show":false,"order":39},"customfield_449":{"initHide":true,"show":false,"order":40},"customfield_450":{"initHide":true,"order":41},"customfield_451":{"initHide":true,"order":1},"customfield_452":{"initHide":true,"show":false,"order":42},"customfield_453":{"initHide":true,"show":false,"order":43},"customfield_454":{"initHide":true,"show":false,"order":44},"customfield_677":{"initHide":true,"show":false,"order":45},"customfield_678":{"initHide":true,"order":5},"customfield_679":{"initHide":true,"order":46,"show":false},"customfield_680":{"initHide":true,"order":4},"customfield_681":{"initHide":true,"order":47,"show":false},"customfield_20210312181835":{"initHide":true,"show":false,"order":48},"customfield_20210420152825":{"initHide":true,"order":25,"show":false},"customfield_20210511102801":{"initHide":true,"show":false,"order":49},"customfield_447":{"initHide":true,"order":12,"show":false},"customfield_20210621140646":{"show":false,"order":13},"customfield_20210713191842":{"order":14},"customfield_20210713191904":{"order":16},"customfield_20210713191947":{"order":15},"customfield_20210713192003":{"order":17},"customfield_20210713192029":{"order":18},"customfield_20210713192039":{"order":20},"customfield_20210713192050":{"order":22},"customfield_20210713192105":{"order":19},"customfield_20210713192114":{"order":21},"customfield_20210713192127":{"order":23},"customfield_20210723104210":{"show":false,"order":6},"customfield_20210723104150":{"order":3},"customfield_20210803192443":{"show":false,"order":50},"customfield_20210817161931":{"order":2}}';
var viewPresetOfLook = '{"title":{"fixed":"left","initHide":true,"show":true,"order":0},"status":{"initHide":true,"show":true,"order":3},"assignee":{"initHide":true,"show":false,"order":11},"reporter":{"initHide":true,"show":true,"order":5},"verifier":{"initHide":true,"show":false,"order":7},"businessAreaDTO":{"initHide":true,"show":true,"order":6},"relatedMouleId":{"initHide":true,"show":true,"order":15},"relateTargetDTOS":{"initHide":true,"show":true,"order":8},"relateProjectDTOS":{"initHide":true,"show":false,"order":17},"priority":{"initHide":true,"show":true,"order":4},"sprintDTO":{"initHide":true,"order":18,"show":false},"versionDTOS":{"initHide":true,"show":false,"order":23},"dueDate":{"initHide":true,"show":false,"order":24},"planStartTime":{"initHide":true,"show":false,"order":25},"planSubmitTestTime":{"initHide":true,"show":true,"order":21},"planReleaseTime":{"initHide":true,"show":true,"order":22},"createdAt":{"initHide":true,"show":false,"order":26},"updatedAt":{"initHide":true,"show":false,"order":27},"originalEstimate":{"initHide":true,"show":false,"order":28},"timeSpent":{"initHide":true,"show":false,"order":30},"customfield_448":{"initHide":true,"order":9},"customfield_449":{"initHide":true,"order":31,"show":false},"customfield_450":{"initHide":true,"order":16},"customfield_451":{"initHide":true,"order":32,"show":false},"customfield_452":{"initHide":true,"order":33,"show":false},"customfield_453":{"initHide":true,"order":34,"show":false},"customfield_454":{"initHide":true,"order":10},"customfield_677":{"initHide":true,"order":12},"customfield_678":{"initHide":true,"order":20},"customfield_679":{"initHide":true,"order":19},"customfield_680":{"initHide":true,"order":14},"customfield_681":{"initHide":true,"order":13},"customfield_20210312181835":{"initHide":true,"show":false,"order":36},"customfield_20210420152825":{"initHide":true,"order":29},"customfield_20210511102801":{"initHide":true,"order":1,"fixed":"left"},"customfield_20210621140646":{"initHide":true,"order":35},"customfield_20210713191842":{"initHide":true,"order":39},"customfield_20210713191904":{"initHide":true,"order":37},"customfield_20210713191947":{"initHide":true,"order":40},"customfield_20210713192003":{"initHide":true,"order":38},"customfield_20210713192029":{"initHide":true,"order":43},"customfield_20210713192039":{"initHide":true,"order":41},"customfield_20210713192050":{"initHide":true,"order":45},"customfield_20210713192105":{"initHide":true,"order":44},"customfield_20210713192114":{"initHide":true,"order":42},"customfield_20210713192127":{"initHide":true,"order":46},"customfield_447":{"initHide":true,"order":47},"customfield_20210723104150":{"initHide":true,"order":48,"show":false},"customfield_20210723104210":{"initHide":true,"order":49,"show":false},"customfield_20210803192443":{"show":false,"order":2}}';
var viewPresetOfKSong = '{"title":{"fixed":"left","initHide":true,"show":true,"order":0},"status":{"initHide":true,"show":true,"order":1},"assignee":{"initHide":true,"show":true,"order":3},"reporter":{"initHide":true,"show":true,"order":2},"verifier":{"initHide":true,"show":false,"order":8},"businessAreaDTO":{"initHide":true,"show":false,"order":10},"relatedMouleId":{"initHide":true,"show":true,"order":5},"relateTargetDTOS":{"initHide":true,"show":false,"order":11},"relateProjectDTOS":{"initHide":true,"show":false,"order":15},"priority":{"initHide":true,"show":false,"order":13},"sprintDTO":{"initHide":true,"show":false,"order":14},"versionDTOS":{"initHide":true,"show":false,"order":16},"dueDate":{"initHide":true,"show":false,"order":12},"planStartTime":{"initHide":true,"show":false,"order":7},"planSubmitTestTime":{"initHide":true,"order":48},"planReleaseTime":{"initHide":true,"show":true,"order":49},"createdAt":{"initHide":true,"show":false,"order":17},"updatedAt":{"initHide":true,"show":false,"order":18},"originalEstimate":{"initHide":true,"show":false,"order":9},"timeSpent":{"initHide":true,"show":false,"order":19},"customfield_448":{"initHide":true,"show":false,"order":20},"customfield_449":{"initHide":true,"show":false,"order":21},"customfield_450":{"initHide":true,"show":false,"order":22},"customfield_451":{"initHide":true,"show":false,"order":23},"customfield_452":{"initHide":true,"show":false,"order":24},"customfield_453":{"initHide":true,"show":false,"order":25},"customfield_454":{"initHide":true,"show":false,"order":26},"customfield_677":{"initHide":true,"show":false,"order":27},"customfield_678":{"initHide":true,"show":false,"order":28},"customfield_679":{"initHide":true,"show":false,"order":29},"customfield_680":{"initHide":true,"show":false,"order":30},"customfield_681":{"initHide":true,"show":false,"order":31},"customfield_20210312181835":{"initHide":true,"show":false,"order":32},"customfield_20210420152825":{"initHide":true,"order":6},"customfield_20210511102801":{"initHide":true,"order":4},"customfield_20210621140646":{"initHide":true,"order":33},"customfield_20210713191842":{"initHide":true,"order":34},"customfield_20210713191904":{"initHide":true,"order":35},"customfield_20210713191947":{"initHide":true,"order":40},"customfield_20210713192003":{"initHide":true,"order":41},"customfield_20210713192029":{"initHide":true,"order":37},"customfield_20210713192039":{"initHide":true,"order":36},"customfield_20210713192050":{"initHide":true,"order":38},"customfield_20210713192105":{"initHide":true,"order":42},"customfield_20210713192114":{"initHide":true,"order":43},"customfield_20210713192127":{"initHide":true,"order":44,"show":false},"customfield_447":{"initHide":true,"order":39},"customfield_20210723104150":{"initHide":true,"show":false,"order":45},"customfield_20210723104210":{"initHide":true,"show":false,"order":46},"customfield_20210803192443":{"initHide":true,"show":false,"order":47}}';
var viewPresetOfIChat = '{"title":{"fixed":"left","initHide":true,"show":true,"order":1},"status":{"initHide":true,"show":true,"order":9},"assignee":{"initHide":true,"show":true,"order":11},"reporter":{"initHide":true,"show":true,"order":10},"verifier":{"initHide":true,"show":true,"order":12},"businessAreaDTO":{"initHide":true,"show":false,"order":26},"relatedMouleId":{"initHide":true,"show":true,"order":13},"relateTargetDTOS":{"initHide":true,"show":false,"order":28},"relateProjectDTOS":{"initHide":true,"show":false,"order":29},"priority":{"initHide":true,"show":false,"order":30},"sprintDTO":{"initHide":true,"show":true,"order":31},"versionDTOS":{"initHide":true,"show":true,"order":32},"dueDate":{"initHide":true,"show":false,"order":33},"planStartTime":{"initHide":true,"show":false,"order":34},"planSubmitTestTime":{"initHide":true,"show":false,"order":35},"planReleaseTime":{"initHide":true,"show":false,"order":36},"createdAt":{"initHide":true,"show":false,"order":37},"updatedAt":{"initHide":true,"show":false,"order":38},"originalEstimate":{"initHide":true,"show":false,"order":39},"timeSpent":{"initHide":true,"show":false,"order":40},"customfield_448":{"initHide":true,"order":41,"show":false},"customfield_449":{"initHide":true,"show":false,"order":42},"customfield_450":{"initHide":true,"order":43,"show":false},"customfield_451":{"initHide":true,"order":1},"customfield_452":{"initHide":true,"show":false,"order":44},"customfield_453":{"initHide":true,"show":false,"order":45},"customfield_454":{"initHide":true,"show":false,"order":46},"customfield_677":{"initHide":true,"show":false,"order":47},"customfield_678":{"initHide":true,"order":8},"customfield_679":{"initHide":true,"order":6},"customfield_680":{"initHide":true,"order":7},"customfield_681":{"initHide":true,"order":5},"customfield_20210312181835":{"initHide":true,"show":false,"order":48},"customfield_20210420152825":{"initHide":true,"order":27,"show":false},"customfield_20210511102801":{"initHide":true,"show":false,"order":49},"customfield_447":{"initHide":true,"order":14,"show":false},"customfield_20210621140646":{"show":false,"order":15},"customfield_20210713191842":{"order":16},"customfield_20210713191904":{"order":18},"customfield_20210713191947":{"order":17},"customfield_20210713192003":{"order":19},"customfield_20210713192029":{"order":20},"customfield_20210713192039":{"order":22},"customfield_20210713192050":{"order":24},"customfield_20210713192105":{"order":21},"customfield_20210713192114":{"order":23},"customfield_20210713192127":{"order":25},"customfield_20210723104210":{"order":3},"customfield_20210723104150":{"order":4},"customfield_20210803192443":{"show":false,"order":50},"customfield_20210817161931":{"order":2,"show":false},"serialNumber":{"fixed":"left","initHide":true,"show":false,"order":0},"customfield_20211011194012":{"initHide":true,"show":false,"order":51},"customfield_20211018192857":{"initHide":true,"show":false,"order":52},"customfield_20210804100128":{"initHide":true,"show":false,"order":53},"customfield_20210804100105":{"initHide":true,"show":false,"order":54},"customfield_20210804100046":{"initHide":true,"show":false,"order":55},"customfield_20210804095956":{"initHide":true,"show":false,"order":56},"customfield_20210804095940":{"initHide":true,"show":false,"order":57},"customfield_20210804095922":{"initHide":true,"show":false,"order":58},"customfield_20211115195142":{"initHide":true,"show":false,"order":59},"customfield_20211101141615":{"initHide":true,"show":false,"order":60},"customfield_20211013180816":{"initHide":true,"show":false,"order":61}}';

var showViewPresetConfig = function() {
    console.log('showViewTableConfig');
    setTimeout(function(){
        if (document.getElementById("viewPresetConfig") == null) {
            var preset = document.createElement('div');
            preset.setAttribute("id", "viewPresetConfig");
            preset.setAttribute("style", "margin-top: 14px; color: white; position: absolute; left: 500px;");
            preset.innerHTML ='<span>视图列预设:&nbsp;<a id="applyViewPresetOfMoyi">[心遇]</a>&nbsp;<a id="applyViewPresetOfLook">[直播]</a>&nbsp;<a id="applyViewPresetOfKSong">[K歌]</a>&nbsp;<a id="applyViewPresetOfIChat">[因乐交友]</a></span>'

            var anchor = document.getElementsByClassName("g-page")[0].children[0]
            anchor.insertBefore(preset, anchor.children[2]);

            document.getElementById("applyViewPresetOfMoyi").addEventListener('click',function(){
                applyViewPreset(viewPresetOfMoyi);
            }, false)
            document.getElementById("applyViewPresetOfLook").addEventListener('click',function(){
                applyViewPreset(viewPresetOfLook);
            }, false)
            document.getElementById("applyViewPresetOfKSong").addEventListener('click',function(){
                applyViewPreset(viewPresetOfKSong);
            }, false)
            document.getElementById("applyViewPresetOfIChat").addEventListener('click',function(){
                applyViewPreset(viewPresetOfIChat);
            }, false)
        }
     }, 1000);
};

var applyViewPreset = function(preset) {
    try {
        window.localStorage.setItem("1/viewDetail/list", preset);
        location.reload();
    } catch (error) {
        console.error(error);
    }
};

var refreshViewPresetConfig = function() {
    if (location.pathname.includes("/viewManage/detail/")) {
        showViewPresetConfig();
    }
};

// ---------------------------------------------------------------------------------------------

var extendProjectMenu = function() {
    try {
        var menu = document.getElementsByClassName("g-page")[0].children[0].children[0].children[1].children[0];
        menu.setAttribute("style", "width: 200px;");
        menu.addEventListener('click',function(){
            setTimeout(function(){
                var items = document.getElementsByClassName("ant-cascader-menu");
                for(var item of items) {
                    item.setAttribute("style", "height: 400px;");
                }
            }, 500);
        }, false)
    } catch (error) {
        console.error(error);
    }
};

// ---------------------------------------------------------------------------------------------

var showMaxTestPlanConfig = function() {
    console.log('showMaxTestPlanConfig');
    setTimeout(function(){
        if (document.getElementById("maxTestPlanConfig") == null) {
            var preset = document.createElement('div');
            preset.setAttribute("id", "maxTestPlanConfig");
            preset.setAttribute("style", "margin-top: 14px; color: white; position: absolute; left: 500px;");
            preset.innerHTML ='<span><a id="maxTestPlan">[最大化“测试计划”]&nbsp;(刷新页面可恢复)</a></span>';

            var anchor = document.getElementsByClassName("g-page")[0].children[0];
            anchor.insertBefore(preset, anchor.children[2]);

            document.getElementById("maxTestPlan").addEventListener('click',function(){
                console.log('showMaxTestPlanConfig, maxTestPlan');
                document.getElementById("maxTestPlanConfig").style.display = "none";
                var gPage = document.getElementsByClassName("g-page")[0];
                gPage.children[0].children[0].style.display = "none";
                gPage.children[0].children[1].children[0].style.position = "static";
                document.getElementsByClassName("ant-layout-sider")[0].style.display = "none";
                var omPageContainer = document.getElementsByClassName("om-page-container")[0];
                omPageContainer.children[0].children[0].style.display = "none";
                omPageContainer.getElementsByClassName("ant-tabs-nav")[0].style.display = "none";
                var tabPanel = omPageContainer.getElementsByClassName("ant-tabs-tabpane")[0];
                tabPanel.children[0].children[0].style.display = "none";
                tabPanel.children[0].children[1].style.display = "none";
            }, false);
        }
     }, 1000);
};

var hideMaxTestPlanConfig = function() {
    console.log('hideMaxTestPlanConfig');
    setTimeout(function(){
        var maxTestPlanConfig = document.getElementById("maxTestPlanConfig");
        if (maxTestPlanConfig) {
            maxTestPlanConfig.remove();
        }
     }, 1000);
};


var refreshMaxTestPlanConfig = function() {
    if (location.pathname.includes("/testing/plan")) {
        showMaxTestPlanConfig();
    } else {
        hideMaxTestPlanConfig();
    }
};


// ---------------------------------------------------------------------------------------------

(function() {
    'use strict';

    setTimeout(function(){

        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{
            window.dispatchEvent(new Event('locationchange'))
        });

        window.addEventListener('locationchange', function(){
            console.log('location changed!');
            refreshRecentSprints();
            refreshRecentViews();
            refreshRecentVersions();
            refreshViewPresetConfig();
            refreshMaxTestPlanConfig();
        });

        refreshRecentSprints();
        refreshRecentViews();
        refreshRecentVersions();
        extendProjectMenu();
        refreshViewPresetConfig();
        refreshMaxTestPlanConfig();

    }, 1000);


})();
