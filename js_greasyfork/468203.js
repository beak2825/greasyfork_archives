// ==UserScript==
// @name         Liquipedia Team Catcher
// @namespace    https://greasyfork.org/scripts/468203-liquipedia-team-catcher/
// @version      0.9
// @description  复制出队伍信息的JSON，到DotaTerminal中处理
// @author       monat151
// @match        https://liquipedia.net/dota2/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/468203/Liquipedia%20Team%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/468203/Liquipedia%20Team%20Catcher.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let _map_team2img
    let _map_region2img
    let _need_update_team2imgmap = false
    let _need_update_region2imgmap = false
    let retry_count = 0

    setTimeout(() => {
        if (!document.getElementById("Participants")) {
            return;
        }
        generateButtonUi();
    }, 100);

    const generateButtonUi = () => {
        try {
            const participant = document.getElementById("Participants").parentElement;
            const copy_cell = document.createElement("span");
            copy_cell.className = 'mw-editsection';
            const left_sb = document.createElement("span");
            left_sb.className = 'mw-editsection-bracket'
            left_sb.innerHTML = '['
            const clicker = document.createElement("a");
            clicker.href = 'javascript:void(0);'
            clicker.title = '将参赛战队以JSON格式复制,从而可以进一步操作'
            clicker.innerHTML = '复制到NGA'
            clicker.addEventListener("click", async () => {
                getTable();
            });
            const right_sb = document.createElement("span");
            right_sb.className = 'mw-editsection-bracket'
            right_sb.innerHTML = ']'
            copy_cell.appendChild(left_sb);
            copy_cell.appendChild(clicker);
            copy_cell.appendChild(right_sb);
            participant.appendChild(copy_cell)
        } catch (e) {
            if (retry_count < 30) {
                console.warn("generate failed. Retrying...");
                retry_count++;
                setTimeout(() => {
                    generateButtonUi();
                }, 50);
            } else {
                console.error(
                    'generate failed and retry count goes to its limit. Use "window.selfdef_copyToNga_Statistics" to call.'
                );
                window.selfdef_copyToNga_TeamTable = getTable;
            }
        }
    };

    const getMaps = () => {
        // var a = JSON.parse(`{ "GG":{"_100x100":"[img]1.1[/img]", "_12x12":"[img]1.2[/img]"}}`)
        // console.log(a)
        // console.log(a['GG'])
        // console.log(a['un'])
        _map_team2img = JSON.parse(`{ "GG":{"_100x100":"[img]1.1[/img]", "_12x12":"[img]1.2[/img]"}}`)
    }
    const addNewTeamImage = async (team_image_src, upload_15x_12_only = false) => {
        // Download Image.
        // TODO

        // Modify Image To Specific Size.
        // TODO to100x100;60x25;30x12

        // Upload Images To Nga.
        // TODO

        // Get Images' NgaUrl, And Return the Object.
        // TODO
        return upload_15x_12_only ? '[img]15x12src[/img]' : {
            _100x100: '', _60x25: '', _30x12: ''
        }
    }
    const fixPage = async () => {
        const teamtips = document.getElementsByClassName('mw-customtoggle')
        for (let i1=teamtips.length-1; i1>=0; i1--) {
            teamtips[i1].parentElement.remove()
        }
        const playerChampions = document.getElementsByClassName('fas fa-fw fa-trophy-alt')
        for (let i2=playerChampions.length-1; i2>=0; i2--) {
            playerChampions[i2].remove()
        }
        const playerOriTeams = document.getElementsByClassName('team-template-team-part')
        for (let i3=playerOriTeams.length-1; i3>=0; i3--) {
            playerOriTeams[i3].remove()
        }
    }
    const getTable = async () => {
        // Get params that is necessary.
        getMaps()

        // Remove certain elements from page
        await fixPage()

        // Process Page Info To Objects.
        const blocks = document.getElementsByClassName("template-box");
        const team_info_array = [];
        for (let i = 0; i < blocks.length; i++) {
            try {
                const team_info = handleGetTeamInfo(blocks[i]);
                if (team_info && team_info.team_players.length > 1) team_info_array.push(team_info);
            } catch (e) {
                // console.log('invalid block:',blocks[i],e)
            }
        }
        const team_count = team_info_array.length
        console.warn("team_info_array:", team_info_array);
        console.log(`get ${blocks.length} blocks, filtered ${team_count} team_info_objects.`)

        const json = JSON.stringify(team_info_array)
        GM_setClipboard(json)
        alert('复制成功!请到Winform程式中进行下一步操作。')

        /*
    // Divide To Groups.
    const each_line_teamcount =
      team_count % 6 === 0 ? 6 :
        team_count % 4 < team_count % 6 ? 4 : 6
    let total_linecount = team_count / each_line_teamcount
    if (team_count % each_line_teamcount > 0) {
      total_linecount++
    }
    const team_trs = []
    for (let i = 0; i < total_linecount; i++) {
      const tr = []
      for (let j = 0; j < each_line_teamcount; j++) {
        const array_loc = i * each_line_teamcount + j
        if (array_loc >= team_count) {
          tr.push(null)
        } else {
          tr.push(team_info_array[array_loc])
        }
      }
      team_trs.push(tr)
    }
    console.log('team_trs:', team_trs)

    // Generate BBSCodes.
    let bbs_code = `[table]`
    team_trs.forEach((row) => {
      bbs_code += `[tr]`
      row.forEach((team) => {
        bbs_code += `[td]`
        if (team === null) {
          bbs_code += generateTableCell('-')
        } else {
          const team_image = getTeamImage(team)
          let cell_content = team.team_name
          team.team_players.forEach((player) => {
            const description = getPlayerDescription(player)
            cell_content += '\n' + description
          })
          bbs_code += generateTableCell(cell_content)
        }
        bbs_code += `[/td]`
      })
      bbs_code += `[/tr]`
      bbs_code += `[tr][td colspan=${each_line_teamcount}][/td][/tr]`
    })
    bbs_code += `[/table]`

    console.log(bbs_code)
    GM_setClipboard(bbs_code)
    alert('复制成功')
    */
    };
    const getPlayerDescription = (player) => {
        let result = ''
        if (player.player_position === 'C') {
            result += '[b]教练:[/b] '
        } else {
            result += '[b]' + player.player_position + '号位:[/b] '
        }
        const region_img = getRegionImage(player.player_country, player.player_country_image_src)
        result += region_img + ' '
        result += player.player_name
        return result
    }
    const getRegionImage = (player_country, player_country_image_src) => {
        return player_country
        // if (_map_region2img[player_country]) {
        //     return _map_region2img[player_country]
        // } else {
        //     const _upload = await addNewTeamImage(player_country_image_src, true)
        //     _need_update_region2imgmap = true
        //     return _upload
        // }
    }
    const getTeamImage = (team_info) => {
        return "img here"
        // if (_map_team2img[team_info.team_name]) {
        //     return _map_team2img[team_info.team_name]
        // } else {
        //     const _upload = await addNewTeamImage(team_info.team_image_src)
        //     _need_update_team2imgmap = true
        //     return _upload
        // }
    }
    const generateTableCell = (content, align = 'center') => { return `[align=${align}]${content}[/align]` }
    const handleGetTeamInfo = (block) => {
        const totale = block.children[0].children[0];
        const teamBlock = getTeamBlock(totale)
        const teammate_table = teamBlock.children[0];
        const teaminfo_table = getTeamInfoBlock(totale);
        const teammates = getTeammates(teamBlock);

        const team_name = getBlockInnerText(totale);
        const team_image_src = getBlockDeepChild(teaminfo_table)?.src ?? '';
        const team_region = getBlockInnerText(teaminfo_table.children[0].children[1]);

        if (!team_name) return null // 筛掉非队伍模块
        const teammateBlockStyle = teammate_table?.style?.display?.toString() ?? 'null'
        console.log('team:', team_name, '; teaminfo_table:', teaminfo_table)
        if (teammateBlockStyle.match('none')) return null // 筛掉被折叠的队伍(一般为弃赛)

        const team_players = [];
        for (let i = 0; i < teammates.length; i++) {
            const line = teammates[i];
            console.log('line:', line)
            const player_position = getBlockInnerText(line);
            const detail = line.children[1];
            const player_country_image = getBlockDeepChild(detail);
            const player_country_image_src = player_country_image?.src ?? '';
            const player_country = player_country_image?.alt ?? '';
            const player_name = getBlockInnerText(detail?.children[1]);
            if (player_name) {
                team_players.push({
                    player_position: player_position,
                    player_country: player_country,
                    player_country_image_src: player_country_image_src,
                    player_name: player_name,
                });
            }
        }

        const team_info = {
            team_name: team_name,
            team_image_src: team_image_src,
            team_region: team_region,
            team_players: team_players,
        };
        return team_info;
    };
    const getTeamBlock = (totale) => {
        const results = [];
        const blocks = getAllElements(totale);
        blocks.forEach(block => {
            if (block && block.className === 'wikitable wikitable-bordered list') {
                results.push(block)
            }
        });
        return results[results.length-1];
        // if (document.location.href.match('The_International')) {
        //     const target = totale.children[1]
        //     for (let i = target.children.length - 1; i >= 0; i--) {
        //         const child = target.children[i]
        //         if (child && child.className === 'wikitable wikitable-bordered list') {
        //             return child
        //         }
        //     }
        //     return null
        // } else {
        //     return totale.children[totale.children.length - 1]
        // }
    }
    const getTeamInfoBlock = (totale) => {
        const results = [];
        const blocks = getAllElements(totale);
        blocks.forEach(block => {
            if (block && block.className === 'wikitable wikitable-bordered logo') {
                results.push(block)
            }
        });
        return results[results.length-1];
        // if (document.location.href.match('The_International')) {
        //     const target = totale.children[1]
        //     for (let i = target.children.length - 1; i >= 0; i--) {
        //         const child = target.children[i]
        //         if (child && child.className === 'wikitable wikitable-bordered logo') {
        //             return child
        //         }
        //     }
        //     return null
        // } else {
        //     return getTeamBlock(totale).children[1]
        // }
    }
    const getTeammates = (teamBlock) => {
        return teamBlock.children[0].children
        // if (document.location.href.match('The_International')) {
        //     return teamBlock.children[0].children
        // } else {
        //     return teamBlock.children[0].children[0].children
        // }
    }
    const getBlockInnerText = (block) => {
        return getBlockDeepChild(block)?.innerHTML ?? ''
    };
    const getBlockDeepChild = (block) => {
        let _block = block
        while (_block?.children && _block?.children[0]) {
            _block = _block.children[0]
        }
        return _block
    };
    const getAllElements = (block) => {
        const result = [];
        result.push(block);
        if (block?.children?.length) {
            for (let i = 0; i< block.children.length; i++) {
                getAllElements(block.children[i]).forEach(element => { result.push(element) });
            }
        }
        return result;
    };
})();