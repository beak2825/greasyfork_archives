// ==UserScript==
// @name         天津干部学习
// @version      2025.10.30.1
// @license      Apache-2.0
// @namespace    https://greasyfork.org/
// @description  【❤全自动刷课❤】功能可自由配置，只需将视频添加到播放列表，后续刷课由系统自动完成
// @author       八珍豆腐皮
// @match        https://www.tjgbpx.gov.cn/*

// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/512929/%E5%A4%A9%E6%B4%A5%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/512929/%E5%A4%A9%E6%B4%A5%E5%B9%B2%E9%83%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function initStyles() {
    let style = document.createElement("style");
    style.appendChild(document.createTextNode(`.autoPlayBox {    padding: 5px 10px;}.autoPlayBox .title {    color: blue;}.autoPlayBox label {    margin-right: 6px;}.autoPlayBox label input {    margin-left: 4px;}.canPlaylist {    width: 300px;    height: 500px;    position: fixed;    top: 100px;    background: rgba(255, 255, 255, 1);    right: 80px;    border: 1px solid #c1c1c1;    overflow-y: auto;}.canPlaylist .oneClick {    margin: 0 auto;    width: 100%;    border: none;    padding: 6px 0;    background: linear-gradient(180deg, #4BCE31, #4bccf2);    height: 50px;    border-radius: 5px;    color: #FFF;    font-weight: bold;    letter-spacing: 4px;    font-size: 18px;}.canPlaylist .item {    border-bottom: 1px solid #c1c1c1;    padding: 8px;    line-height: 150%;    border-bottom: 1px solid #c1c1c1;    margin-bottom: 3px;}.canPlaylist .item .title {    font-size: 13px;    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;}.canPlaylist .item .status {    font-size: 12px;    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;    color: #c90000;}.canPlaylist .item .addBtn {    color: #FFF;    background-color: #4bccf2;    border: none;    padding: 5px 10px;    margin-top: 4px;}.canPlaylist .item .addBtn.remove {    background-color: #fd1952;}.dragBox {    padding: 5px 10px;}.dragBox .title {    color: blue;}.dragBox .remark {    font-size: 12px;    color: #fc1818;}.dragBox label {    margin-right: 6px;}.dragBox label input {    margin-left: 4px;}.multiSegmentBox {    position: fixed;    right: 255px;    top: 0;    width: 250px;    height: 280px;    background-color: #FFF;    z-index: 9999;    border: 1px solid #ccc;    font-size: 12px;}.multiSegmentBox .tip {    border-bottom: 1px solid #ccc;    padding: 5px;    font-weight: bold;    color: red;}.multiSegmentBox .item {    font-size: 14px;}.multiSegmentBox label {    margin-right: 3px;}.multiSegmentBox label input {    margin-left: 2px;}.muteBox {    padding: 5px 10px;}.muteBox .title {    color: blue;}.muteBox .remark {    font-size: 12px;    color: #fc1818;}.muteBox label {    margin-right: 6px;}.muteBox label input {    margin-left: 4px;}.controllerBox {    position: fixed;    right: 0;    top: 0;    width: 250px;    height: 280px;    background-color: #FFF;    z-index: 9999;    border: 1px solid #ccc;    overflow-y: auto;    font-size: 12px;}.controllerBox .linksBox {    display: flex;    flex-wrap: wrap;    justify-content: space-between;    height: 30px;    line-height: 30px;    font-weight: bold;    border-bottom: 1px dotted;}.playlistBox {    position: fixed;    right: 0;    top: 290px;    width: 250px;    height: 450px;    background-color: #FFF;    z-index: 9999;    border: 1px solid #ccc;    overflow-y: auto;}.playlistBox .oneClear {    width: 100%;    border: none;    padding: 6px 0;    background: linear-gradient(180deg, #4BCE31, #4bccf2);    height: 50px;    border-radius: 5px;    color: #FFF;    font-weight: bold;    letter-spacing: 4px;    font-size: 18px;    cursor: pointer;    margin-bottom: 5px;}.playlistBox .playlistItem {    display: flex;    justify-content: space-between;    align-items: center;    margin-bottom: 5px;}.playlistBox .playlistItem .child_title {    font-size: 13px;    white-space: nowrap;    overflow: hidden;    text-overflow: ellipsis;    width: 180px;}.playlistBox .playlistItem .child_remove {    color: #FFF;    background-color: #fd1952;    border: none;    padding: 5px 10px;    cursor: pointer;}.speedBox {    padding: 5px 10px;}.speedBox .title {    color: blue;}.speedBox .remark {    font-size: 12px;    color: #fc1818;}.speedBox label {    margin-right: 6px;}.speedBox label input {    margin-left: 4px;}`));
    document.head.appendChild(style);
})();

window.listenerId_courses = null;

function autoPlay(value) {
    if (value !== undefined) {
        GM_setValue('autoPlay', value);
        return value;
    }

    return GM_getValue('autoPlay', true);
}

function mute(value) {
    if (value !== undefined) {
        GM_setValue('mute', value);
        return value;
    }

    return GM_getValue('mute', true);
}

function drag(value) {
    if (attrset !== undefined) {
        attrset.ifCanDrag = 1;
    }

    if (value) {
        GM_setValue('drag', value);
        return value;
    }

    return GM_getValue('drag', 5);
}

function speed(value) {
    /* if (attrset !== undefined) {
        attrset.playbackRate = 1;
    }*/

    if (value) {
        GM_setValue('speed', value);
        return value;
    }

    return GM_getValue('speed', 1);
}

function playMode(value) {
    if (value !== undefined) {
        GM_setValue('playMode', value);
        return value;
    }

    return GM_getValue('playMode', 'loop');
}
function addCourse(course) {
    let courses = coursesList();
    if (courseAdded(course.sectionId)) {
        notification(`课程 ${course.sectionName} 已经在播放列表中。`);
        return false;
    }
    courses.push({...course, url: course.getUrl()});
    coursesList(courses);
    return true;
}

function removeCourse(sectionId) {
    let courses = coursesList();

    for (let i = courses.length - 1; i >= 0; i--) {
        if (courses[i].sectionId != sectionId) {
            continue;
        }
        courses.splice(i, 1);
    }

    coursesList(courses);
}

function courseAdded(sectionId) {
    let courses = coursesList();
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].sectionId == sectionId) {
            return true;
        }
    }
    return false;
}

function coursesList(value) {
    if (value) {
        if (!Array.isArray(value)) {
            notification("保存课程数据失败，数据格式异常。");
            return [];
        }
        return GM_setValue('courses', value);
    }

    let courses = GM_getValue('courses', []);
    if (!Array.isArray(courses)) {
        return [];
    }
    return courses;
}
function interceptFetch(callback) {
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        const result = originalFetch(url, options);
        result.then(res => {
            callback(url, res, options);
        });
        return result;
    }
}

function interceptsXHR(callback) {
    const open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.addEventListener('readystatechange', function () {
            callback(url, this.response, method, this.readyState);
        });
        open.apply(this, arguments);
    };
}
function notification(content) {
    GM_notification({
        text: content,
        title: "自动刷课",
    });
}

function currentPageType() {
    const match = /#\/(specialClass\/detail|specialClass\/courseDetail|course\/list|detail|course\/detail)\/.*/.exec(window.location.href);
    const currentPage = match ? match[1] : null; // 如果没有匹配到，则 currentPage 为 null

    switch (currentPage) {
        case "course/list":
            return 1; // 表示当前页面是 course/list 网络选课界面
        case "specialClass/detail":
            return 1; // 表示当前页面是 specialClass/detail选课界面
        case "specialClass/courseDetail":
            return 2; // 表示当前页面是 specialClass/courseDetail 播放界面
        case "detail":
            return 2; // 表示当前页面是 detail 网络选课播放界面
        case "course/detail":
            return 2; // 表示当前页面是 course/detail 网络选课播放界面
        default:
            return 0; // 表示当前页面既不是 course/list 也不是 specialClass/detail
    }

}
function createAutoPlayOption() {
    let box = document.createElement('div');
    box.classList.add('autoPlayBox');

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = '自动播放';
    box.appendChild(title);

    let options = [
        {text: "是", value: true},
        {text: "否", value: false}
    ]

    options.forEach(option => {
        let label = document.createElement('label');
        label.innerText = option.text;
        box.appendChild(label);
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = 'autoPlay';
        input.value = option.value;
        input.checked = autoPlay() === option.value;
        input.onclick = function () {
            autoPlay(option.value);
        };
        label.appendChild(input);
    });

    return box;
}

function removeAutoPlayOption() {
    let autoPlayBox = document.getElementsByClassName("autoPlayBox");
    while (autoPlayBox.length > 0) {
        autoPlayBox[0].remove();
    }
}

function createCanPlaylist() {
    let playlist = document.createElement("div");
    playlist.id = "canPlaylist";
    playlist.className = "canPlaylist";

    let oneClick = document.createElement("button");
    oneClick.innerText = "一键添加";
    oneClick.type = "button";
    oneClick.className = "oneClick";
    oneClick.onclick = function () {
        const items = playlist.getElementsByClassName("item");
        for (let item of items) {
            const buttons = item.getElementsByTagName("button");
            for (let button of buttons) {
                if (button.innerText === "从播放列表移除") {
                    continue;
                }
                button.click();
            }
        }
    }
    playlist.appendChild(oneClick);
    playlist.addEventListener("clear", function () {
        let elementsByClassName = playlist.getElementsByClassName("item");
        for (let i = elementsByClassName.length - 1; i >= 0; i--) {
            elementsByClassName[i].remove();
        }
    });

    playlist.addEventListener("refresh", function () {
        let elements = playlist.getElementsByClassName("item");
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const buttonElement = element.getElementsByTagName("button")[0];
            const statusElement = element.getElementsByClassName("status")[0];
            let added = courseAdded(buttonElement.getAttribute("data-sectionId"));
            buttonElement.innerText = added ? "从播放列表移除" : "添加到播放列表";
            buttonElement.className = added ? "addBtn remove" : "addBtn";
        }
    });

    playlist.addEventListener("refreshStatus", function (data) {
        let elements = playlist.getElementsByClassName("item");
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const titleElement = element.querySelector(`[id='${data.detail.resId}']`);
            if(titleElement != null){
                element.remove();
            }
        }
    });

    playlist.addEventListener("append", function (data) {
        if(ifExistInPlayist(data.detail.sectionId)){
            return;
        }
        let child = document.createElement("div");
        child.className = "item";
        this.appendChild(child);

        let title = document.createElement("p");
        title.innerText = data.detail.sectionName;
        title.id = data.detail.sectionId;
        title.title = title.innerText;
        title.className = "title";
        child.appendChild(title);

        let status = document.createElement("p");
        status.innerText = data.detail.study_status;
        status.title = status.innerText;
        status.className = "status";
        child.appendChild(status);

        let added = courseAdded(data.detail.sectionId);
        let addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.innerText = added ? "从播放列表移除" : "添加到播放列表";
        addBtn.className = added ? "addBtn remove" : "addBtn";
        addBtn.setAttribute("data-sectionId", data.detail.sectionId);
        addBtn.onclick = function () {
            if (this.innerText === "从播放列表移除") {
                removeCourse(data.detail.sectionId);
            } else {
                addCourse(data.detail);
            }
        };
        child.appendChild(addBtn);
    });

    document.body.appendChild(playlist);
    return playlist;
}

function removeCanPlaylist(){
    let canPlaylist = document.getElementsByClassName("canPlaylist");
    while (canPlaylist.length > 0) {
        canPlaylist[0].remove();
    }
}

function ifExistInPlayist(id){
    let elements = document.getElementById("canPlaylist").getElementsByClassName("item");
    if(elements.length == 0){
        return false;}
    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        let titleElement = element.getElementsByClassName("title")[0];
        if(id == titleElement.getAttribute("id")){
            return true;}
    }
    return false;
}

function createDragOption() {
    let box = document.createElement('div');
    box.classList.add('dragBox');

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = '拖动';
    box.appendChild(title);

    let options = [
        {text: "还原", value: 5},
        {text: "启用", value: 1}
    ]

    options.forEach(option => {
        let label = document.createElement('label');
        label.innerText = option.text;
        box.appendChild(label);
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = 'drag';
        input.value = option.value;
        input.checked = drag() === option.value;
        input.onclick = function () {
            drag(option.value);
        };
        label.appendChild(input);
    });

    let remark = document.createElement('p');
    remark.classList.add('remark');
    remark.innerText = '注意：慎用此功能，后台可能会检测播放数据。';
    box.appendChild(remark);

    return box;
}
function removeDragOption(){
    let DragOption = document.getElementsByClassName("dragBox");
    while (DragOption.length > 0) {
        DragOption[0].remove();
    }
}

function createMultiSegmentBox() {
    let box = document.createElement("div");
    box.className = "multiSegmentBox";
    document.body.appendChild(box);

    let tip = document.createElement("div");
    tip.innerHTML = "此功能只适用个别地区。无法使用的就不要使用了。<br/>网站会定期上传学习进度非必要别使用此功能。";
    tip.className = "tip";
    box.appendChild(tip);

    let options = [
        {text: "正常", value: 0},
        {text: "二段播放", value: 3, title: "将视频分为二段：开始，结束各播放90秒"},
        {text: "三段播放", value: 1, title: "将视频分为三段：开始，中间，结束各播放90秒"},
        {text: "秒播", value: 2, title: "将视频分为两段:开始，结束各播放一秒"}
    ];

    options.forEach(option => {
        let label = document.createElement('label');
        label.innerText = option.text;
        box.appendChild(label);
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = 'playMode';
        input.value = option.value;
        input.checked = playMode() === option.value;
        input.onclick = function () {
            playMode(option.value);
        };
        label.appendChild(input);
    });
}

function removeMultiSegmentBox(){
    let multiSegmentBox = document.getElementsByClassName("multiSegmentBox");
    while (multiSegmentBox.length > 0) {
        multiSegmentBox[0].remove();
    }
}

function timeHandler(t) {
    let videoDuration = parseInt(player.getMetaDate().duration);
    if (playMode() === 1) {
        if (videoDuration <= 270) {
            return;
        }
        const videoMiddleStart = (videoDuration / 2) - 45;
        const videoMiddleEnd = (videoDuration / 2) + 45;
        const videoEndStart = videoDuration - 90;
        if (t > 90 && t < videoMiddleStart) {
            player.videoSeek(videoMiddleStart);
            return;
        }
        if (t > videoMiddleEnd && t < videoEndStart) {
            player.videoSeek(videoEndStart);
            return;
        }
        return;
    }
    if (playMode() === 2) {
        if (t > 1 && t < videoDuration - 1) {
            player.videoSeek(videoDuration - 1);
        }
        return;
    }
    if (playMode() === 3) {
        if (videoDuration <= 180) {
            return;
        }
        if (t > 90 && t < videoDuration - 90) {
            player.videoSeek(videoDuration - 90);
        }
    }
}
function createMuteOption() {
    let box = document.createElement('div');
    box.classList.add('muteBox');

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = '静音';
    box.appendChild(title);

    let options = [
        {text: "是", value: true},
        {text: "否", value: false}
    ]

    options.forEach(option => {
        let label = document.createElement('label');
        label.innerText = option.text;
        box.appendChild(label);
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = 'mute';
        input.value = option.value;
        input.checked = mute() === option.value;
        input.onclick = function () {
            mute(option.value);
        };
        label.appendChild(input);
    });

    let remark = document.createElement('p');
    remark.classList.add('remark');
    remark.innerText = '注意：受浏览器策略影响，不静音，视频可能会出现不会自动播放';
    box.appendChild(remark);

    return box;
}

function removeMuteOption(){
    let muteBox = document.getElementsByClassName("muteBox");
    while (muteBox.length > 0) {
        muteBox[0].remove();
    }
}

function createControllerBox() {
    let controllerBox = document.createElement('div');
    controllerBox.id = 'controllerBox';
    controllerBox.className = 'controllerBox';
    document.body.appendChild(controllerBox);

    let linksBox = document.createElement('div');
    linksBox.className = 'linksBox';
    controllerBox.appendChild(linksBox);

    controllerBox.appendChild(createAutoPlayOption());
    //controllerBox.appendChild(createDragOption());
    controllerBox.appendChild(createMuteOption());
    controllerBox.appendChild(createSpeedOption());

    return controllerBox;
}

function removeControllerBox(){
    let controllerBox = document.getElementsByClassName("controllerBox");
    while (controllerBox.length > 0) {
        controllerBox[0].remove();
    }
}

function playerInit() {
    let player = document.getElementsByTagName("video")[0];
    // let player =angular.element(document.getElementsByTagName('video')).scope().player;

    /*       let bigplaybutton=document.getElementsByClassName('ck-center-play');
        if(bigplaybutton.length !== 0){
            bigplaybutton[0].click;
            bigplaybutton[0].click();
        }*/


    if (mute()!==player.muted) {
        player.muted=mute();}
    if(player.playbackRate !=speed()){
        player.playbackRate=speed();
    }


    if (player.ended || (!player.ended && !player.paused)) {
        return;
    }

    //player.changeControlBarShow(true);
    //player.changeConfig('config', 'timeScheduleAdjust', drag());


    let bigplaybutton=document.getElementsByClassName('ck-center-play');
    if(bigplaybutton.length !== 0){
        bigplaybutton[0].click;
        bigplaybutton[0].click();
    }
    if (autoPlay()) {
        player.play();
    }

    //player.removeListener('ended', endedHandler);
    /*unsafeWindow.addListener('ended', function (event) {
            courseyunRecord();
            player.videoClear();
            $.ajax({
                url: '/videoPlay/takeRecord',
                data: {
                    studyCode: attrset.studyCode,
                    recordUrl: attrset.recordUrl,
                    updateRedisMap: attrset.updateRedisMap,
                    recordId: attrset.recordId,
                    sectionId: attrset.sectionId,
                    signId: attrset.signId,
                    isEnd: true,
                    businessId: attrset.businessId,
                },
                dataType: 'json',
                type: 'post',
                success: function (data) {
                    console.log('提交学习记录', data);
                    removeCourse(attrset.sectionId);
                    let courses = coursesList();
                    if (courses.length === 0) {
                        notification('所有视频已经播放完毕');
                    } else {
                        notification('即将播放下一个视频:' + courses[0].sectionName);
                        window.top.location.href = courses[0].url;
                    }
                },
            });
        });*/
    /*   player.addListener('ended', function (event) {
        var scope = angular.element(document.getElementsByTagName('video')).scope();
            scope.lastPlayTime = -1;
            if (scope.videoObj && scope.videoObj.duration) {
                if (scope.notuodong && scope.notuodong == 'true') {
                    if (scope.currPlayTime + 10 < scope.videoObj.time) {
                        scope.player.seek(scope.currPlayTime);
                        return;
                    }
                    if(scope.videoObj.time+1<scope.videoObj.duration){
                        return;
                    }
                }
                var obj = {totalTime: scope.videoObj.duration, time: scope.videoObj.duration};
                scope.$emit('videoProgress', obj);
            }
            var current_id = RegExp(/\/course\/detail\/(\d+)/).exec(window.location.href)[1];
            removeCourse(current_id);
            let courses = coursesList();
            if (courses.length === 0) {
                notification('所有视频已经播放完毕');
            } else {
                notification('即将播放下一个视频:' + courses[0].sectionName);
                window.top.location.href = courses[0].url;

            }

            //player.addListener('time', timeHandler);

        });*/
}

function playInit() {
    //removePauseBlur();
    createPlaylistBox();
    createControllerBox();
    //createMultiSegmentBox();

    window.listenerId_courses=GM_addValueChangeListener(
        'courses',
        function (name, oldValue, newValue, remote) {
            if(currentPageType() === 2){
                removePlaylistBox();
                createPlaylistBox();}
            else if(currentPageType() === 1){
                const element = document.getElementById("canPlaylist");
                if (element) {
                    element.dispatchEvent(new CustomEvent("refresh", {}));
                }

            }
        }
    );
    let startTime=Date.now();
    let refreshTimer = setTimeout(function(){
        let elapsedTime = Date.now() - startTime;
        console.log('player定时器执行，player加载耗时：' + elapsedTime + '毫秒');
        window.location.reload();
    }, 10000);//破网站有时候得刷新，人太多登不进去
    let checkPlayerTimer = setInterval(function () {
        let player = document.getElementsByTagName("video")[0];
        if (!player) return;
        clearInterval(checkPlayerTimer);

        let elapsedTime = Date.now() - startTime;
        console.log('player定时器执行，player加载耗时：' + elapsedTime + '毫秒');
        clearTimeout(refreshTimer);

        setTimeout(function () {
            GM_addValueChangeListener(
                'autoPlay',
                function (name, oldValue, newValue, remote) {
                    if (newValue) {
                        player.play();
                    }
                }
            );
            GM_addValueChangeListener(
                'mute',
                function (name, oldValue, newValue, remote) {
                    if (newValue) {
                        player.muted=true;
                    } else {
                        player.muted=false;
                    }
                }
            );
            GM_addValueChangeListener(
                'drag',
                function (name, oldValue, newValue, remote) {
                    player.changeConfig('config', 'timeScheduleAdjust', newValue);
                }
            );
            GM_addValueChangeListener(
                'speed',
                function (name, oldValue, newValue, remote) {
                    player.playbackRate(newValue);
                }
            );

            playerInit();

            setInterval(playerInit, 1000);
        }, 1000);

        player =angular.element(document.getElementsByTagName('video')).scope().player;
        player.removeListener('ended', endedHandler);
        player.addListener('ended', function (event) {
            var scope = angular.element(document.getElementsByTagName('video')).scope();
            scope.lastPlayTime = -1;
            if (scope.videoObj && scope.videoObj.duration) {
                if (scope.notuodong && scope.notuodong == 'true') {
                    if (scope.currPlayTime + 10 < scope.videoObj.time) {
                        scope.player.seek(scope.currPlayTime);
                        return;
                    }
                    if(scope.videoObj.time+1<scope.videoObj.duration){
                        return;
                    }
                }
                var obj = {totalTime: scope.videoObj.duration, time: scope.videoObj.duration};
                scope.$emit('videoProgress', obj);
            }
            var current_id = null;

            if(/specialClass/.test(window.location.href)){
                current_id = /\/courseDetail\/(\d+)/.exec(window.location.href)[1];
            }
            else{
                current_id = RegExp(/\/course\/detail\/(\d+)/).exec(window.location.href)[1];
            }
            removeCourse(current_id);
            let courses = coursesList();
            if (courses.length === 0) {
                notification('所有视频已经播放完毕');
                console.log('所有课程已经播放完毕');
            } else {
                //notification('即将播放下一个视频:' + courses[0].sectionName);
                console.log('已播完准备下一个界面');
                setTimeout(function() {
                    window.top.location.href = courses[0].url;
                }, 5000);
            }
            initRouter();
            //player.addListener('time', timeHandler);
        });

    }, 500);
}

function createPlaylistBox() {
    let playlistBox = document.createElement("div");
    playlistBox.id = "playlistBox";
    playlistBox.className = "playlistBox";
    document.body.appendChild(playlistBox);

    let oneClear = document.createElement("button");
    oneClear.innerText = "一键清空";
    oneClear.className = "oneClear";
    oneClear.onclick = function () {
        if (confirm("确定要清空播放列表么？")) {
            coursesList([]);
        }
    };
    playlistBox.appendChild(oneClear);

    const courses = coursesList();
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        let playlistItem = document.createElement("div");
        playlistItem.className = "playlistItem";
        playlistBox.appendChild(playlistItem);

        let childTitle = document.createElement("p");
        childTitle.innerText = course.sectionName;
        childTitle.title = childTitle.innerText;
        childTitle.className = "child_title";
        playlistItem.appendChild(childTitle);

        let childBtn = document.createElement("button");
        childBtn.innerText = "移除";
        childBtn.type = "button";
        childBtn.className = "child_remove";
        childBtn.onclick = function () {
            if (confirm("确定要删除这个视频任务么？")) {
                removeCourse(course.sectionId);
            }
        };
        playlistItem.appendChild(childBtn);
    }
}

function removePlaylistBox() {
    let playlistBox = document.getElementsByClassName("playlistBox");
    while (playlistBox.length > 0) {
        playlistBox[0].remove();
    }
}

function createSpeedOption() {
    let box = document.createElement('div');
    box.classList.add('speedBox');

    let title = document.createElement('p');
    title.classList.add('title');
    title.innerText = '播放速度';
    box.appendChild(title);

    let options = [
        {text: "1x", value: 1},
        {text: "1.25x", value: 1.25},
        {text: "1.5x", value: 1.5},
        {text: "2x", value: 2}
    ]

    options.forEach(option => {
        let label = document.createElement('label');
        label.innerText = option.text;
        box.appendChild(label);
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = 'speed';
        input.value = option.value;
        input.checked = speed() === option.value;
        input.onclick = function () {
            speed(option.value);
        };
        label.appendChild(input);
    });

    let remark = document.createElement('p');
    remark.classList.add('remark');
    remark.innerText = '注意：慎用此功能，后台可能会检测播放数据。';
    box.appendChild(remark);

    return box;
}

function removeSpeedOption(){
    let speedBox = document.getElementsByClassName("speedBox");
    while (speedBox.length > 0) {
        speedBox[0].remove();
    }
}

let tempCourses = [];

function interceptsXHRCallback(url, response, method, readyState) {
    if (readyState !== 4) return;

    // url: /client/shop/productList
    if (url.includes("productList")) {
        let canPlaylist = document.getElementById("canPlaylist");
        if (canPlaylist === null) {
            canPlaylist = createCanPlaylist();
        }

        canPlaylist.dispatchEvent(new CustomEvent("clear", {}));
        tempCourses = [];

        const data = JSON.parse(response);
        data.data.forEach(item => {
            if(item.progressPercent == null||item.progressPercent == 100){return;}
            const courseDetail = new CourseDetail();
            //courseDetail.courseId = data.data.courseId;
            courseDetail.sectionId = item.id;
            courseDetail.sectionName = item.name;
            courseDetail.choosePart = "productlist";
            if(item.progressPercent == 100){courseDetail.study_status = "已学完";}
            else{courseDetail.study_status = "未学完";}
            // courseDetail.study_status = item.isOver;

            tempCourses.push(courseDetail);
            canPlaylist.dispatchEvent(new CustomEvent("append", {
                detail: courseDetail
            }));
        });
    }

    // url: /client/specialClass/getStaticSpClass
    if (url.includes("getStaticSpClass")) {
        let canPlaylist = document.getElementById("canPlaylist");
        if (canPlaylist === null) {
            canPlaylist = createCanPlaylist();
        }

        canPlaylist.dispatchEvent(new CustomEvent("clear", {}));
        tempCourses = [];

        const data = JSON.parse(response);
        data.data.resources.forEach(item => {
            const courseDetail = new CourseDetail();
            courseDetail.courseId = item.specialId;
            courseDetail.sectionId = item.resId;
            courseDetail.sectionName = item.courseName;
            courseDetail.choosePart = "specialClass";

            /*if(item.complete == 0){courseDetail.study_status = "未学完";}
            else{courseDetail.study_status = "已学完";}*/
            courseDetail.study_status = "未学完";

            tempCourses.push(courseDetail);
            canPlaylist.dispatchEvent(new CustomEvent("append", {
                detail: courseDetail
            }));
        });
    }

    // 处理 getPersonSpClass URL ,更新每门课是否学完的状态
    if (url.includes("getPersonSpClass")) {
        const data = JSON.parse(response);
        const personSpclassRes = data.data.personSpclassRes;
        let canPlaylist = document.getElementById("canPlaylist");
        personSpclassRes.forEach(item => {
            if (item.complete === 1 && currentPageType() === 1 && canPlaylist != null) {
                canPlaylist.dispatchEvent(new CustomEvent("refreshStatus", {
                    detail: item
                }));
            }
        });
    }
}

function interceptFetchCallback(url, response, options) {
    response.json().then(data => {
    });
}

function removeAll_Display(){
    removeAutoPlayOption();
    let canPlaylist = document.getElementById("canPlaylist");
    if(canPlaylist != null) canPlaylist.style.display = "none";
    //removeCanPlaylist();
    removeDragOption();
    removeMultiSegmentBox();
    removeMuteOption();
    removeControllerBox();
    removePlaylistBox();
    removeSpeedOption();

}

function initRouter() {


    if (currentPageType() === 1) {
        removeAll_Display();
        let canPlaylist = document.getElementById("canPlaylist");
        if (canPlaylist === null) {
            canPlaylist = createCanPlaylist();
        }
        canPlaylist.dispatchEvent(new CustomEvent("refresh", {}));
        canPlaylist.style.display = "block";
        /* if(window.listenerId_courses) {
                //GM_removeValueChangeListener(window.listenerId_courses);
            }*/
        window.listenerId_courses=GM_addValueChangeListener("courses", function (name, oldValue, newValue, remote) {
            if(currentPageType() === 1){
                const element = document.getElementById("canPlaylist");
                if (element) {
                    element.dispatchEvent(new CustomEvent("refresh", {}));
                }
            }
            else if(currentPageType() === 2){
                removePlaylistBox();
                createPlaylistBox();}
        });
        console.log("testListener");
    }
    else if (currentPageType() === 2) {
        removeAll_Display();
        playInit();
    }
    else if (currentPageType() == 0){
        removeAll_Display();
    }
}
class CourseDetail {
    constructor() {
        // this.trainplanId = "";
        this.courseId = "";
        this.choosePart = "";
        this.sectionId = "";
        this.sectionName = "";
        this.study_status = "";
    }

    getUrl() {
        //const platformId = RegExp(/platformId=(\d+)/).exec(window.location.href)[1];
        if(this.choosePart=="productlist"){
            return `https://www.tjgbpx.gov.cn/#/course/detail/${this.sectionId}////`;
        }
        else if(this.choosePart=="specialClass"){
            return `https://www.tjgbpx.gov.cn/#/specialClass/courseDetail/${this.sectionId}/${this.courseId}`;//、专题课程
        }
        //return `https://${window.location.host}/index.html#/v_video?platformId=${platformId}&trainplanId=${this.trainplanId}&courseId=${this.courseId}&sectionId=${this.sectionId}&sectionName=${encodeURI(this.sectionName)}`;
    }
}


(async function () {
    window.addEventListener('hashchange', function(){
        initRouter();});
    // 设置全局错误监听器
    /* unsafeWindow.onerror = function(message, source, lineno, colno, error) {
            // 检查错误消息是否与媒体播放中断相关
            if (message.includes('removed')){
                // 刷新页面
                // 延迟执行一段代码
                console.log('准备重启');
                setTimeout(function() {
                    window.location.reload();
                    //console.log(message);
                }, 5000);
                }
            else if(message.includes('404')){
                console.log('准备重启');
                setTimeout(function() {
                    window.location.reload();
                    //console.log(message);
                }, 5000);
                }
            else if(message.message.includes('muted')){
            console.log('muted message geted');
            }
            return false;
        };*/

    // 返回 false 以避免默认处理（即控制台错误日志）

    /*
        unsafeWindow.addEventListener('error', function(event) {
            // 检查错误信息是否包含 "404"
            if (event.message && event.message.includes('404')) {
                // 刷新页面
                console.log('准备重启');
                setTimeout(function() {
                    window.location.reload();
                    //console.log(message);
                }, 5000);
            }
        });
*/
    interceptsXHR(interceptsXHRCallback);
    interceptFetch(interceptFetchCallback);
    initRouter();
})();