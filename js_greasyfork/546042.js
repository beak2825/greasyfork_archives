// Add a new tab for Alliance Online Status
Tabs.AllianceOnline = {
    tabLabel: 'Alliance Online',
    tabColor: 'purple',
    tabOrder: 999,
    tabDisabled: false,
    init: function(div) {
        // Get alliance member data from Seed
        var members = [];
        if (Seed && Seed.allianceDiplomacies && Seed.allianceDiplomacies.members) {
            for (var uid in Seed.allianceDiplomacies.members) {
                var member = Seed.allianceDiplomacies.members[uid];
                var player = Seed.players["u" + uid];
                members.push({
                    name: player ? player.n : member.name,
                    title: player ? player.t : '',
                    might: player ? player.m : '',
                    online: member.onlineStatus == 1 // 1 = online, 0 = offline
                });
            }
        }

        // Build the table
        var html = '<table id="allianceOnlineTable" class="xtab onlineStatus">';
        html += '<tr><th>Name</th><th>Title</th><th>Might</th><th>Status</th></tr>';
        for (var i = 0; i < members.length; i++) {
            var statusClass = members[i].online ? 'online' : 'offline';
            html += '<tr class="' + statusClass + '">';
            html += '<td>' + members[i].name + '</td>';
            html += '<td>' + members[i].title + '</td>';
            html += '<td>' + addCommas(members[i].might) + '</td>';
            html += '<td>' + (members[i].online ? 'Online' : 'Offline') + '</td>';
            html += '</tr>';
        }
        html += '</table>';
        div.innerHTML = html;
    }
};

// Add custom styles for the table
GM_addStyle(`
    #allianceOnlineTable {
        width: 100%;
        border-collapse: collapse;
        background: #f9f9f9;
        margin-top: 10px;
    }
    #allianceOnlineTable th, #allianceOnlineTable td {
        border: 1px solid #ccc;
        padding: 6px 12px;
        text-align: left;
    }
    #allianceOnlineTable th {
        background: #342819;
        color: #fff;
    }
    #allianceOnlineTable tr.online {
        background: #d4ffd4;
    }
    #allianceOnlineTable tr.offline {
        background: #ffd4d4;
    }
`);