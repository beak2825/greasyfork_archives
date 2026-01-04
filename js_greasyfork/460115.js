// ==UserScript==
// @name HS 系統
// @description HS 更新
// @license MIT
// @version  2.0.4
// @include *://3scasino.com/*
// @grant GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1028078
// @downloadURL https://update.greasyfork.org/scripts/460115/HS%20%E7%B3%BB%E7%B5%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/460115/HS%20%E7%B3%BB%E7%B5%B1.meta.js
// ==/UserScript==
var host;
var username;
var password;
var room;


//------分類(2023/2/14改版後，全部都去"全部遊戲"進入桌)---------
const TARGET_HALL = 'SEXY_HALL'; //性感 -> 改版後變成全部遊戲，但他們命名還是維持性感
//const TARGET_HALL = 'CLASSICBACCARAT_HALL'; //經典(棄用)
//const TARGET_HALL = 'QUICK_HALL'; //快速(棄用)
//----------------------------------

var RefreshObserver = null

var GoGroupFired = false;
var GoRoomFired = false;
InsertButton()
//"DOMContentLoaded"
window.addEventListener("DOMContentLoaded", function(event) {
    console.log(unsafeWindow.host)
    host = unsafeWindow.host;
    username = unsafeWindow.username;
    password = unsafeWindow.password;
    room = unsafeWindow.room;

    GoGroupFired = false;
    GoRoomFired = false;
    OnWebStateChanged()
});


function InsertButton() {
    var zNode = document.createElement('div');
    zNode.innerHTML = `<button id="myButton" type="button">Enter Room</button>`;
    zNode.setAttribute('id', 'myContainer');
    var first = document.body.firstChild;
    document.body.insertBefore(zNode, first);
    document.getElementById("myButton").addEventListener("click", ButtonClickAction, false);

}

function OnWebStateChanged() {
    if (RefreshObserver != null) {
        RefreshObserver.disconnect();
        RefreshObserver = null
    }
    RefreshObserver = new MutationObserver((mutations) => {
        mutations.forEach(function(mutation) {

            mutation.removedNodes.forEach(function(n) {
                if (n === undefined) {
                    return;
                }
            });
            try {
                if (GoRoomFired)
                    return;
                if (IsRoomFound(mutation) && GoRoomFired == false) {
                    GoRoomFired = true;
                    console.log('找到房間，兩秒後進入')

                    setTimeout(function() {
                        enterRoom();
                    }, 2000);
                    return;
                }
                mutation.addedNodes.forEach(function(nnn) {
                    if (nnn === undefined || nnn.classList === undefined) {
                        return;
                    }
                    if (GoGroupFired == false) {
                        GoGroupFired = true;
                        DelayGoTargetHall(TARGET_HALL, 2000);
                        return;
                    }
                })
            } catch (e) {
                console.log("E!!:" + e)
            }

        })
    })

    RefreshObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });
}

function IsRoomFound(node) {
    if (!(typeof node === 'object' && node !== null && 'getAttribute' in node.target))
        return false;
    var att = node.target.getAttribute('class')
    if (att == null)
        return false;
    return att.includes('tableItem') &&
        node.target.textContent.includes(' ' + room);
}

function DelayGoTargetHall(hall, delay) {
    setTimeout(function() {
        // 在經典要去目標分類
        console.log('進入目標分類:' + hall);
        const btn = document.querySelectorAll('[data-hallname="' + hall + '"]');
        var enterGroup = document.createEvent('HTMLEvents');
        enterGroup.initEvent('click', true, true);
        btn[0].dispatchEvent(enterGroup);
    }, delay);
}

// simulate click evnet
function enterRoom() {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, false);
    console.log("enter room: " + room);

    for (const div of document.querySelectorAll('div')) {
        if (div === undefined || div.classList === undefined) {
            continue;
        }
        if (div.classList != 'tableName') {
            continue;
        }
        if (div.textContent.includes(" " + room)) {
            div.dispatchEvent(evt);
            console.log("click room button: " + room);
            if (RefreshObserver != null) {
                RefreshObserver.disconnect();
                RefreshObserver = null
            }
            return;
        }
    }
}

function ButtonClickAction(zEvent) {
    console.log('hi: ' + host + ":10002/AjaxServer/Server.aspx?action=login&hyzh=" + username + "&pwd=" + password)
    GM.xmlHttpRequest({
        method: "GET",
        url: host + ":10002/AjaxServer/Server.aspx?action=login&hyzh=" + username + "&pwd=" + password,

        onload: function(response) {
            var loginResp = JSON.parse(response.responseText)
            if (loginResp["success"] == null)
                return;
            var result = loginResp["success"]
            if (result)
                window.location.href = host
        },
        onerror: function(error) {
            console.log("error!!")
            delay(5000);
            ButtonClickAction();

        }
    });
}