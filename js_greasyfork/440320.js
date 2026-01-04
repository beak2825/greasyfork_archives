// ==UserScript==
// @name         SCBOY论坛增强黑名单
// @namespace    *://www.scboy.cc/
// @version      1.2.5
// @description  过滤页面中黑名单用户的主题和回复
// @author       RustyHare
// @match        *://*.scboy.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440320/SCBOY%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440320/SCBOY%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==


var mode = GM_getValue("mode");
var menu = ""
//remove删除，highlight高亮
var usr = GM_getValue("blusr");
var kwd = GM_getValue("blkwd");
var tag = GM_getValue("bltag");
var messageRemoval = GM_getValue("msgrm");
var liveTag = GM_getValue("lvtg");



if (typeof (usr) == "undefined") {
    usr = [];
    GM_setValue("blusr", usr);
}
if (typeof (kwd) == "undefined") {
    kwd = [];
    GM_setValue("blkwd", kwd);
}
if (typeof (tag) == "undefined") {
    tag = [];
    GM_setValue("bltag", tag);
}
if (typeof (messageRemoval) == "undefined") {
    messageRemoval = "read";
    GM_setValue("msgrm", "read");
}
if (typeof (liveTag) == "undefined") {
    GM_setValue("lvtg", "remove");
}

//remove删除，read已读隐藏




function forumCleaning() {


    var threads = $("a.xs-thread-a");
    for (var i = 0; i < threads.length; i++) {
        for (var j = 0; j < kwd.length; j++) {
            if (threads[i].innerText.indexOf(kwd[j]) != -1) {
                if (mode == "remove") {
                    threads[i].parentElement.parentElement.parentElement.style.display = "none";;
                } else {
                    threads[i].parentElement.parentElement.parentElement.style.backgroundColor = "yellow";
                }
                //这个是三层
            }
        }
    }
    var threads = $("li.media.thread");
    for (var i = 0; i < threads.length; i++) {
        let n = threads[i].querySelector("div.small.mt-1").querySelector("span").innerText;
        if (usr.indexOf(n) != -1) {
            if (mode == "remove") {
                threads[i].style.display = "none";;
            } else {
                threads[i].style.backgroundColor = "yellow";
            }
        }
    }
    var tags = $("a.badge");
    for (var i = 0; i < tags.length; i++) {
        if (tag.indexOf(tags[i].innerText) != -1) {
            if (mode == "remove") {
                tags[i].parentElement.parentElement.parentElement.style.display = "none";;
            } else {
                tags[i].parentElement.parentElement.parentElement.style
                    .backgroundColor = "yellow";
            }
        }
    }
    if (liveTag == "remove") {
        var live = document.querySelectorAll("div.item");

        for (var i = 0; i < live.length; i++) {
            if (live[i].children[0].innerText == "魔兽争霸3") {
                live[i].style.display = "none";
                break;
            }
        }
    }
}

function threadCleaning() {
    var ats = $("a.text-muted.font-weight-bold");
    for (var i = 0; i < ats.length; i++) {
        if (usr.indexOf(ats[i].innerText) != -1 || kwd.indexOf(ats[i].innerText) != -1) {
            if (ats[i].parentElement.parentElement.parentElement.nodeName == "DD") {
                if (mode == "remove") {
                    ats[i].parentElement.parentElement.parentElement.style.display = "none";
                } else {
                    ats[i].parentElement.parentElement.parentElement.style.backgroundColor = "yellow";
                }
            } else if (ats[i].parentElement.parentElement.parentElement.parentElement.parentElement.nodeName ==
                "LI") {
                if (mode == "remove") {
                    ats[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";;
                } else {
                    ats[i].parentElement.parentElement.parentElement.parentElement.parentElement.style
                        .backgroundColor = "yellow";
                }
            }
        }
    }
    if (liveTag == "remove") {
        var live = document.querySelectorAll("div.item");

        for (var i = 0; i < live.length; i++) {
            if (live[i].children[0].innerText == "魔兽争霸3") {
                live[i].style.display = "none";
                break;
            }
        }
    }

}

function liveTagCleaning() {
    // todo
}



//添加功能：对屏蔽的消息，已读并隐藏/删除
function messageCleaning(count) {

    var pages = Math.floor(count / 20) + 2;

    for (let i = 1; i < pages; i++) {
        $.get("https://www.scboy.cc/?my-notice-0-" + i.toString() + ".htm", function (e) {
            let hidden = document.createElement("DIV");
            hidden.style.display = "none";
            hidden.innerHTML = e;
            let lis = hidden.getElementsByClassName("notice");
            for (let j = 0; j < lis.length; j++) {
                let nid = lis[j].dataset.nid;
                try {
                    var username = lis[j].getElementsByClassName("username")[0].children[0].innerText;
                } catch (e) {
                    var username = lis[j].getElementsByClassName("username")[0].innerText;
                }
                if (usr.indexOf(username) != -1) {
                    if (messageRemoval == "read") {
                        $.post("https://www.scboy.cc/?my-notice.htm?act=readone&nid=" + nid.toString())
                    } else if (messageRemoval == "remove") {
                        $.post("https://www.scboy.cc/?my-notice.htm?act=delete&nid=" + nid.toString())
                    }

                }
            }
        })
    }
}

function messageHiding() {
    let lis = document.getElementsByClassName("notice");
    for (let i = 0; i < lis.length; i++) {
        let nid = lis[i].dataset.nid;
        try {
            var username = lis[i].getElementsByClassName("username")[0].children[0].innerText;
        } catch (e) {
            var username = lis[i].getElementsByClassName("username")[0].innerText;
        }
        if (usr.indexOf(username) != -1) {
            if (mode == "remove") {
                lis[i].style.display = "none";
            }
            else {
                lis[i].style.backgroundColor = "yellow"
            }

        }
    }
}


function main() {
    if (mode == "remove") {
        menu = "切换到高亮模式";
    } else {
        menu = "切换到屏蔽模式";
    }

    const oSwitchModeCMD = GM_registerMenuCommand(menu, function (e) {
        if (mode == "remove") {
            GM_setValue("mode", "highlight")
        } else {
            GM_setValue("mode", "remove")
        }
        window.location.reload()
    }, {
        accessKey: "a",
        autoClose: true
    });

    const oMenuCMD = GM_registerMenuCommand('管理屏蔽', function (e) {


        unsafeWindow.shusr = function () {
            let blusr = GM_getValue("blusr");
            let tbody = document.getElementById("RHBlackListTBody");
            tbody.innerHTML = `
			<tr>
				<th><input id="RHBlackListInput"></th>
				<th><button id="RHBlackListButtonAdd" class="btn" onclick="addusr()">添加</button></th>
			</tr>
			`;

            blusr.forEach(function (e) {
                let tr = document.createElement("TR");
                let thn = document.createElement("TH");
                thn.innerText = e;
                let thb = document.createElement("TH");
                thb.innerHTML = `<button class="close" onclick="delusr(event)">×</button>`;
                tr.appendChild(thn);
                tr.appendChild(thb);
                tbody.appendChild(tr);
            })


            document.getElementById("RHshusr").classList.remove("disabled");
            document.getElementById("RHshkwd").classList.add("disabled");
            document.getElementById("RHshtag").classList.add("disabled");
            document.getElementById("RHconfig").classList.add("disabled");
        }
        unsafeWindow.shkwd = function () {
            let blkwd = GM_getValue("blkwd");
            let tbody = document.getElementById("RHBlackListTBody");
            tbody.innerHTML = `
			<tr>
				<th><input id="RHBlackListInput"></th>
				<th><button id="RHBlackListButtonAdd" class="btn" onclick="addkwd()">添加</button></th>
			</tr>
			`;

            blkwd.forEach(function (e) {
                let tr = document.createElement("TR");
                let thn = document.createElement("TH");
                thn.innerText = e;
                let thb = document.createElement("TH");
                thb.innerHTML = `<button class="close" onclick="delkwd(event)">×</button>`;
                tr.appendChild(thn);
                tr.appendChild(thb);
                tbody.appendChild(tr);
            })


            document.getElementById("RHshusr").classList.add("disabled");
            document.getElementById("RHshkwd").classList.remove("disabled");
            document.getElementById("RHshtag").classList.add("disabled");
            document.getElementById("RHconfig").classList.add("disabled");
        }
        unsafeWindow.shtag = function () {
            let bltag = GM_getValue("bltag");
            let tbody = document.getElementById("RHBlackListTBody");
            tbody.innerHTML = `
			<tr>
				<th><input id="RHBlackListInput"></th>
				<th><button id="RHBlackListButtonAdd" class="btn" onclick="addtag()">添加</button></th>
			</tr>
			`;

            bltag.forEach(function (e) {
                let tr = document.createElement("TR");
                let thn = document.createElement("TH");
                thn.innerText = e;
                let thb = document.createElement("TH");
                thb.innerHTML = `<button class="close" onclick="deltag(event)">×</button>`;
                tr.appendChild(thn);
                tr.appendChild(thb);
                tbody.appendChild(tr);
            })


            document.getElementById("RHshusr").classList.add("disabled");
            document.getElementById("RHshkwd").classList.add("disabled");
            document.getElementById("RHshtag").classList.remove("disabled");
            document.getElementById("RHconfig").classList.add("disabled");
            // todo
        }


        unsafeWindow.addusr = function () {
            let rhinput = document.getElementById("RHBlackListInput");
            let blusr = GM_getValue("blusr");
            if (blusr.indexOf(rhinput.value) == -1 && rhinput.value.length > 0) {
                blusr.push(rhinput.value.toString().replaceAll(" ", ""))
            }
            GM_setValue("blusr", blusr)
            shusr();
        }
        unsafeWindow.delusr = function (e) {
            let blusr = GM_getValue("blusr");
            let i = blusr.indexOf(e.target.parentElement.parentElement.children[0].innerText)
            if (i > -1) {
                blusr.splice(i, 1);
                GM_setValue("blusr", blusr);
            }
            shusr();
        }



        unsafeWindow.addkwd = function () {
            let rhinput = document.getElementById("RHBlackListInput");
            let blkwd = GM_getValue("blkwd");
            if (blkwd.indexOf(rhinput.value) == -1 && rhinput.value.length > 0) {
                blkwd.push(rhinput.value.toString().replaceAll(" ", ""))
            }
            GM_setValue("blkwd", blkwd)
            shkwd();
        }
        unsafeWindow.delkwd = function (e) {
            let blkwd = GM_getValue("blkwd");
            let i = blkwd.indexOf(e.target.parentElement.parentElement.children[0].innerText)
            if (i > -1) {
                blkwd.splice(i, 1);
                GM_setValue("blkwd", blkwd);
            }
            shkwd();
        }

        unsafeWindow.addtag = function () {
            let rhinput = document.getElementById("RHBlackListInput");
            let bltag = GM_getValue("bltag");
            if (bltag.indexOf(rhinput.value) == -1 && rhinput.value.length > 0) {
                bltag.push(rhinput.value.toString().replaceAll(" ", ""))
            }
            GM_setValue("bltag", bltag)
            shtag();
        }
        unsafeWindow.deltag = function (e) {
            let bltag = GM_getValue("bltag");
            let i = bltag.indexOf(e.target.parentElement.parentElement.children[0].innerText)
            if (i > -1) {
                bltag.splice(i, 1);
                GM_setValue("bltag", bltag);
            }
            shtag();
        }

        unsafeWindow.setMsg = function (e) {
            GM_setValue("msgrm", e.target.value)
        }
        unsafeWindow.setWar3Live = function (e) {
            GM_setValue("lvtg", e.target.value)
        }

        unsafeWindow.rhconfig = function () {
            messageRemoval = GM_getValue("msgrm");
            let tbody = document.getElementById("RHBlackListTBody");
            tbody.innerHTML = `
			<tr>
				<th>
					对被屏蔽用户消息的处理：
				</th>
				<th>
					<select onchange="setMsg(event)" id="RHmsgset">

					</select>
				</th>
			</tr>
            <tr>
				<th>
					右侧直播栏目去掉war3区<span style="font-size:1px">反正没人看</span>：
				</th>
				<th>
					<select onchange="setWar3Live(event)" id="RHwar3set">

					</select>
				</th>
			</tr>
			`;

            let msgset = document.getElementById("RHmsgset");
            let opt1 = document.createElement("OPTION");
            opt1.value = "read";
            opt1.innerText = "已读并隐藏";
            let opt2 = document.createElement("OPTION");
            opt2.value = "remove";
            opt2.innerText = "直接删除";
            if (messageRemoval == "read") {
                msgset.appendChild(opt1);
                msgset.appendChild(opt2);
            } else {
                msgset.appendChild(opt2);
                msgset.appendChild(opt1);
            }

            let war3set = document.getElementById("RHwar3set");
            let opt3 = document.createElement("OPTION");
            opt3.value = "remove";
            opt3.innerText = "去掉";
            let opt4 = document.createElement("OPTION");
            opt4.value = "keep";
            opt4.innerText = "保留";
            if (liveTag == "remove") {
                war3set.appendChild(opt3);
                war3set.appendChild(opt4);
            } else {
                war3set.appendChild(opt4);
                war3set.appendChild(opt3);
            }


            document.getElementById("RHshusr").classList.add("disabled");
            document.getElementById("RHshkwd").classList.add("disabled");
            document.getElementById("RHshtag").classList.add("disabled");
            document.getElementById("RHconfig").classList.remove("disabled");
        }



        var dModalFrame = document.createElement("DIV");
        dModalFrame.className = "modal fade"
        dModalFrame.style.display = "none";
        dModalFrame.id = "RHBlackListModalFrame";
        dModalFrame.innerHTML = `
<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<span>编辑黑名单</span>
			<span>（直接关掉这个窗口就好awa所有改动是自动保存的）</span>
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		</div>
		<div class="modal-body">
			<div class="btn-group">
				<button type="button" class="btn btn-default" id="RHshusr" onclick="shusr()">屏蔽用户名</button>
				<button type="button" class="btn btn-default" id="RHshkwd" onclick="shkwd()">屏蔽关键词</button>
				<button type="button" class="btn btn-default" id="RHshtag" onclick="shtag()">屏蔽标签名</button>
				<button type="button" class="btn btn-default" id="RHconfig" onclick="rhconfig()">一点设置</button>
			</div>
			<div id="RHBlackListTable" style="max-height:300px;overflow-y:scroll;">
				<table class="table">
					<thead>
						<tr>
							<th style="width:80%"></th>
							<th style="width:20%"></th>
						</tr>
					</thead>
					<tbody id="RHBlackListTBody">

					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
		`



        document.body.appendChild(dModalFrame);
        shusr();
        $("#RHBlackListModalFrame").modal()

    }, {
        accessKey: "c",
        autoClose: true
    });


    let unreadCount = parseInt(document.getElementsByClassName("unread")[0].innerText);
    if (unreadCount > 0) {
        messageCleaning(unreadCount);
    }




    if (window.location.href.search("forum") > -1) {
        forumCleaning()
    } else if (window.location.href.search("thread") > -1) {
        threadCleaning()
        unsafeWindow.threadCleaning = threadCleaning;
    } else if (window.location.href.search("notice") > -1) {
        messageHiding()
    }

    if (typeof (unsafeWindow.showpage) == "function") {
        unsafeWindow.showpage = new Proxy(unsafeWindow.showpage, {
            apply: function(target, thisArg, argumentsList) {
                var result = target.apply(thisArg, argumentsList);
                setTimeout(function() {
                    unsafeWindow.threadCleaning();
                }, 50);

                return result;
            }
        });
    }

    if (typeof (unsafeWindow.showfloor) == "function") {
        unsafeWindow.showfloor = new Proxy(unsafeWindow.showfloor, {
            apply: function(target, thisArg, argumentsList) {
                var result = target.apply(thisArg, argumentsList);
                setTimeout(function() {
                    unsafeWindow.threadCleaning();
                }, 50);

                return result;
            }
        });
    }

    if (typeof (unsafeWindow.refresh_reply) == "function") {
        unsafeWindow.refresh_reply = new Proxy(unsafeWindow.refresh_reply, {
            apply: function(target, thisArg, argumentsList) {
                var result = target.apply(thisArg, argumentsList);
                setTimeout(function() {
                    unsafeWindow.threadCleaning();
                }, 50);

                return result;
            }
        });
    }


    if (typeof (unsafeWindow.createReplyElement) == "function") {
        unsafeWindow.createReplyElement = new Proxy(unsafeWindow.createReplyElement, {
            apply: function(target, thisArg, argumentsList) {
                var result = target.apply(thisArg, argumentsList);

                if (result && result.length > 0) {
                    var username = result.find('a.text-muted.font-weight-bold').text();
                    if (usr.indexOf(username) != -1) {
                        if (mode == "remove") {
                            result.hide();
                        } else {
                            result.css('backgroundColor', 'yellow');
                        }
                    }
                }

                return result;
            }
        });
    }

    if (typeof (unsafeWindow.floor_reply) == "function") {
        unsafeWindow.floor_reply = new Proxy(unsafeWindow.floor_reply, {
            apply: function(target, thisArg, argumentsList) {
                var result = target.apply(thisArg, argumentsList);
                setTimeout(function() {
                    unsafeWindow.threadCleaning();
                }, 50);

                return result;
            }
        });
    }

    if (document.getElementsByClassName("usercard-content").length > 0) {
        let card = document.getElementsByClassName("usercard-content")[0];

    }


}

if (window.addEventListener != null) {

    window.addEventListener("load", main, false);

} else if (window.attachEvent != null) {

    window.attachEvent("onload", main);

}