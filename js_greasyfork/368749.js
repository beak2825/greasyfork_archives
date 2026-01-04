// ==UserScript==
// @name        Leave Steam Group
// @description 可批量退出Steam组，可方便退出封禁的组。
// @namespace   http://steamcn.com/t215640-1-1
// @include     https://steamcommunity.com/id/*/groups*
// @include     https://steamcommunity.com/profiles/*/groups*
// @version     20190904
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368749/Leave%20Steam%20Group.user.js
// @updateURL https://update.greasyfork.org/scripts/368749/Leave%20Steam%20Group.meta.js
// ==/UserScript==

// Styles
$J("head").append(`<style>
    #group-gid {
        border-radius: 3px;
        border: 1px solid rgba( 0, 0, 0, 0.3);
        box-shadow: 1px 1px 0px rgba( 255, 255, 255, 0.2);
        color: #fff;
        outline: none;
        height: 24px;
        width: 250px;
        padding: 0px 6px;
        margin: 5px;
        background-color: #274e68;
    }
    .lsg-btn {
        margin: 0px 10px 0px 10px;
    }
    .group_block:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    .group-selected {
        background-color: rgba(255, 255, 255, 0.2);
    }
    .group-leaved {
        background-color: rgba(0, 255, 0, 0.2);
    }
    .group-error {
        background-color: rgba(255, 0, 0, 0.4);
    }
    </style> `);

$J(".title_bar").after(`
    <div style="margin-top:10px">
    <input id="group-gid" type="text" placeholder="输入组地址名或组gid">
    <a id="leave-gid" class="btnv6_blue_hoverfade btn_small lsg-btn"><span>退出此组</span></a>
	<span id="sel-left"></span>/<span id="sel-sum"></span>
    <a id="leave-selected" class="btnv6_blue_hoverfade btn_small lsg-btn"><span>退出所选组</span></a>
    <a id="inverse" class="btnv6_blue_hoverfade btn_small lsg-btn"><span>反选</span></a>
    <a id="sort-processed" class="btnv6_blue_hoverfade btn_small lsg-btn"><span>收纳已处理</span></a>
    <a id="feedback" class="btnv6_blue_hoverfade btn_small lsg-btn" href="https://steamcn.com/t215640-1-1" target="_blank"><span>反馈</span></a>
    </div>`);

$J("#search_results").on("click",".group_block",function () {
    $J(this).toggleClass("group-selected");
});

let loc = window.location.href;
let selLeft = 0;
let selSum = 0;
const url_post = loc.replace(/\/groups.*/, "/friends/action");

$J("#leave-gid").click(function () {
    const input_value = $J("#group-gid").val();
    let g_id;
    let g_url;
    let g_name;
    let g_xml;
    if (input_value.match(/\d{18}/)) {
        g_id = input_value.match(/\d{18}/);
        g_xml = "https://steamcommunity.com/gid/" + g_id[0] + "/memberslistxml/?xml=1";
    } else if (input_value.match(/groups\/([\w-]+)/)) {
        g_url = input_value.match(/groups\/([\w-]+)/);
        g_xml = "https://steamcommunity.com/groups/" + g_url[1] + "/memberslistxml/?xml=1";
    } else {
        g_url = input_value.match(/[\w-]+/);
        g_xml = "https://steamcommunity.com/groups/" + g_url[0] + "/memberslistxml/?xml=1";
    }
    $J.get(g_xml).done(function (response) {
        g_id = $J(response).find("groupID64")[0].textContent;
        g_url = $J(response).find("groupURL")[0].textContent;
        g_name = $J(response).find("groupName")[0].textContent;
        g_avatar = $J(response).find("avatarMedium")[0].textContent;
        if ($J("#group_"+g_id).length ===0){
            $J("#search_results").prepend(`
                <div id="group_${g_id}" class="group_block invite_row group-selected">
                        <div class="invite_row_left invite_row_content">
                            <div class="group_block_medium">
                                <div class="mediumHolder_default"><div class="avatarMedium"><a href="https://steamcommunity.com/groups/${g_url}"><img src="${g_avatar}"></a></div></div>
                            </div>
                            <div class="group_block_details">
                                <div class="ellipsis groupTitle">
                                    <a class="linkTitle" href="https://steamcommunity.com/groups/${g_url}">${g_name}</a></div>
                            </div>
                        </div>
                        <div class="actions">
                                            <a class="linkStandard" href="javascript:void(0)" onclick="ConfirmLeaveGroup( '${g_id}', &quot;${g_name}&quot;, '#group_${g_id}'  )">离开组</a>
                        </div>
                    </div>
            `);
        }
        if (window.confirm('您即将离开此组：\n' + g_name + '\n是否确定？')) {
            leaveGroupPost(g_id, "#group_" + g_id);
        }
    }).fail(function () {
        alert("https://steamcommunity.com 超时或脚本地址失效");
    });
});

let leave_selected_groups;
$J("#leave-selected").click(function () {
    let group_ids = [];
    let group_names = [];
    let dom_ids = [];
    $J(".group_block").each(function () {
        if ($J(this).hasClass("group-selected")) {
            //ConfirmLeaveGroup( '103582791461895448', &quot;Oy-Vey-Keys.com&quot;, '#group_32374040'  )
            const group_actions = $J(this).find(".actions > .linkStandard").attr("onclick").match(/^ConfirmLeaveGroup\( '(\d{18})', "(.*)", '(#group_\d+)'  \)$/);
            const group_id = group_actions[1];
            $J(this).attr("data-group-id", group_id);
            const group_name = group_actions[2];
            const dom_id = group_actions[3];
            group_ids.push(group_id);
            group_names.push(group_name);
            dom_ids.push(dom_id);
        }
    });
	selSum = selSum + group_ids.length;
	$J("#sel-sum").text(selSum);
    leave_selected_groups = leaveGroups();
    if (window.confirm('您即将离开所选的组：\n' + group_names.join("\n") + '\n\n是否确定？')) {
        leave_selected_groups.next();
    }

    function* leaveGroups() {
        for (let i = 0; i < group_ids.length; i++) {
            yield leaveGroupPost(group_ids[i], dom_ids[i]);
        }
    }
});

$J("#inverse").click(function(){
    $J(".group_block:not(.group-leaved,.group-error),.group_block.group-selected").each(function(){
        $J(this).toggleClass("group-selected");
    });
});

function leaveGroupPost(steamids, dom_id) {
    $J.post(url_post, {
        action: "leave_group",
        ajax: "1",
        sessionid: g_sessionID,
        steamid: g_steamID,
        "steamids[]": steamids,
        timeout: 5000
    }).done(function (response) {
        tagGroupBlock(response, dom_id);
		selLeft = selLeft +1;
		$J("#sel-left").text(selLeft);
    }).fail(function () {
        leaveGroupPost(steamids, dom_id);
    });
}

let count = -1;
function tagGroupBlock(res, dom_id) {
    if (res.success == true) {
        $J(dom_id).css("order", count).removeClass("group-selected group-error").addClass("group-leaved");
    } else if (res.success == false) {
        $J(dom_id).css("order", count).removeClass("group-selected").addClass("group-error");
    }
    if (dom_id.length < 24) {
        leave_selected_groups.next();
    }
    count--;
}

$J("#sort-processed").click(function () {
    $J(".group-leaved,.group-error").each(function () {
        $J(this).css("order", 1);
    });
});