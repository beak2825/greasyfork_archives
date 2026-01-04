// ==UserScript==
// @name           Reworks Oracle for Epicmafia as script
// @namespace      https://greasyfork.org/en/users/159342-cleresd
// @description    Reworks Oracle for Epicmafia as script. Originally created by lailai. Add rehost button, autorefresh ability and game search ability.
// @version        1.06
// @match          https://epicmafia.com/*
// @exclude        https://epicmafia.com/game*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/35727/Reworks%20Oracle%20for%20Epicmafia%20as%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/35727/Reworks%20Oracle%20for%20Epicmafia%20as%20script.meta.js
// ==/UserScript==

GM_addStyle(`
/* head additional */

._orcDropdownContent {
    display: none;
    position: absolute;
    background-color: #eee;
    min-width: 160px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    z-index: 5;
    font-size: 85%;
    border: 1px solid #cd88d3;
}

._orcDropdownContent a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    float: left;
}

.sel:hover ._orcDropdownContent {
    display: none;
}

._orcDropdownContent a:hover {
    background-color: #ccc;
}

li:hover ._orcDropdownContent {
    display: block;
}

/* auto refresh button */

._oracle_icon {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHfK4NRGMc/22iyieLChbQ0uxoxtbhRtoSS1kwZbrZ3v9Q2b+/7SsutcqsocePXBX8Bt8q1UkRKyp1r4ga9nndTk+w5Pef5nO85z9M5zwF7LK8U9Lo+KBQNLToW8szG5zzOJxx04qILX0LR1ZFIZJKa9n6LzYrXPVat2uf+NVcqrStgaxAeVlTNEB4XnlwxVIu3hNuUXCIlfCLs1+SCwjeWnqzws8XZCn9arMWiYbC3CHuyvzj5i5WcVhCWl+Mt5JeVn/tYL3GnizPTErvEO9CJMkYIDxOMEiZIP0MyB+khQK+sqJHfV86fYklyFZlVSmgskiWHgV/UZamelpgRPS0jT8nq/9++6pmBQKW6OwT1j6b52g3OTfjaMM2PA9P8OgTHA5wXq/lL+zD4JvpGVfPuQfManF5UteQ2nK1D+72a0BJlySFuz2Tg5Ria4tB6BY3zlZ797HN0B7FV+apL2NkFn5xvXvgGa+9n6Oaaag8AAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFCSURBVDiNY2QgAnw6e/4/Mp/P2JARmzqsgvgMwmcgTsPa086gGJKdzkzQQCZiDGJgYGCYOvMvLnvhgIUYgwJleKCs76QZhmkAAjzbyskg5f0dzkYHKN6EuQqbQdjAjaYbKL7ACDN8BuFzFYZhlbNMsMauBucXBqmYrwwMgv8Y+Pb9ZZCK+cqw/skXDHUoYYbsbJjibO2jDJ8YGBgYGGwYGBgYGD6xHWVg2MzAwMBgjWEg3CUwg5AVZFfgTtNTOxDBBfMREy6DCIGjZzdjiGFNtNhsRwZRoZuwiqOEWaAMD4brPj+8D2enl1zGMAA50uAMbCkfBuIiHzDwGrshXObYy2Bt7IthIBMhgxgYGFAMYmBgYFi2vxiFD9OPN8wYGKAx+uY2VnH02GbC5yp8SQObGpwuQ1aEHqtRjr0YMdqeduY/AAVIe2d8BtH4AAAAAElFTkSuQmCC);
    height: 19px;
    width: 19px;
    display: inline-block;
    position: relative;
    top: 1px;
}

#_oAutoRefreshWrap {
    display: inline-block;
    border: 1px solid #cd88d3;
    padding: 0 2px 2px 2px;
    margin-left: 2px;
}

#_oAutoRefreshWrap::before {
    content: '';
    position: absolute;
    right: 48px;
    top: 9px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #c788d3;
}

#_oAutoRefreshWrap ._oracle_icon {
    top: 3px;
    left: -4px;
}

/* auto rehost */

._oRehost {
    margin-left: 5px;
    border: 1px solid #c788d3;
    padding: 5px 5px 4px 5px;
    color: #c788d3;
    font-size: 12px;
}

._oRehost:hover {
    background-color: #c788d3;
    color: white;
}

/* other */

select[name='siterule_id'] {
    margin: 10px 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}`);

// It needs to auto refresh games' list
let lastActivity = Date.now();
$('body').mousemove(e => lastActivity = Date.now());

$("#header_inner").find("ul li:eq(0)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/game/new">Create game</a>
        <a href="https://epicmafia.com/setup">Find setup</a>
        <a href="https://epicmafia.com/lobby/rules">Rules</a>
    ` );

$("#header_inner").find("ul li:eq(1)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/message">Inbox</a>
        <a href="https://epicmafia.com/family">Family</a>
        <a href="https://epicmafia.com/addon">Buy</a>
    ` );

$("#header_inner").find("ul li:eq(2)").append ( `
    <div class="_orcDropdownContent">
        <a href="https://epicmafia.com/moderator">Moderators</a>
        <a href="https://epicmafia.com/report">Reports</a>
    ` );

if ($(".ll-refresh").length) {
    insertAutoRefresh();
    insertRehost();
    insertSearch();
}

if ($("#nav").find("li.sel a").text() === "Round") {
    $("#subnav").append(`<li><a href="/lobby/rules" style="color: #c788d3">Rules</a></li>`);
}

function insertRehost() {
    let $body = $("body");
    let rehostButtonHtml = `<div class="_oRehost" data-name="mafia_gamerow">Re</div>`;
    $body.on("mouseenter", ".gamerow.mafia_gamerow, .gamerow.dicewars_gamerow, .gamerow.snakes_gamerow", e => {
        $(e.currentTarget).find('.gamesetup').parent().before(rehostButtonHtml);
        //$(e.currentTarget).find(".gamesetup").parent().before();
    });
    $body.on("mouseleave", ".gamerow", e => {
        $(e.currentTarget).find("._oRehost").remove();
    });
    $body.on("click", "._oRehost", e => {
        $(e.currentTarget).text("Rehosting");

        const $gameRow = $(e.currentTarget).parents(".gamerow");
        const type = $gameRow[0].classList[2].split('_')[0];
        const numPlayers = $gameRow.find('.players').children().length;
        const isGoldHeart = $gameRow.find("img[src='/images/goldlives.png'],img[src='/images/broken_goldlives.png']").length !== 0;
        const isRedHeart = $gameRow.find("img[src='/images/lives.png'],img[src='/images/broken_lives.png']").length !== 0;
        let isPassword = $gameRow.find("img[src='/images/lock.png']").length !== 0 ? 1 : 0;
        let password = '';
        const rank = isGoldHeart ? 2 : (isRedHeart ? 1 : 0);

        const gid = $gameRow.attr("data-gid");
        if (isPassword) {
            $('#pop').removeClass('hide');
            $('#pop_').removeClass('hide');
            $('#pop_warn').css('display', 'none');
            $('#password').attr('placeholder', 'Leave empty to no password');
            $('#password').next().click(() => {
                $('#pop_').addClass('hide');
                $('#pop').addClass('hide');
                $('#pop_warn').css('display', '');
                password = $('#password').val();
                if (!password) {
                    isPassword = 0;
                }
                rehost(gid, type, rank, isPassword, password, numPlayers);
                return true;
            });
        }
        else {
            rehost(gid, type, rank, isPassword, password, numPlayers);
        }
    });
}

function rehost(gid, type, rank, isPassword, password, numPlayers) {
    if (type === 'mafia') {
        rehostMafiaGame(gid, rank, isPassword, password)
    } else if (type === 'dicewars' || type === 'snakes') {
        isPassword = !!isPassword;
        rehostCustomGame(type, numPlayers, isPassword, password)
    }
}

function rehostMafiaGame(gid, rank, isPassword, password) {
    $.get(`https://epicmafia.com/game/${gid}/info`, data => {
        const setup =data[1].data.match(/\/setup\/[0-9]+/)[0].split("/")[2];

        $.get(`https://epicmafia.com/game/add/mafia?` +
            `setupid=${setup}&ranked=${rank}&add_password=${isPassword}&password=${password}`,
            d => {
                if (d[1].table) {
                    let location = `game/${d[1].table}`;
                    location += isPassword ? `?password=${d[1].password}` : ``;
                    GM_setValue('_oGameSrcFirstConf', location);
                    GM_setValue('_oGameSrcSecondConf', location);
                    GM_setValue('_oGameSrcCh', location);
                    document.location = location;

                } else {
                    alert(d[1].msg || d[1]);
                }
            })
    });
}

function rehostCustomGame(type, numPlayers, isPassword, password) {
    $.get(`https://epicmafia.com/game/add/${type}?` +
        `numplayers=${numPlayers}&add_password=${isPassword}&password=${password}`,
        d => {
            if (d[1].game_id) {
                let location = `game/${d[1].game_id}`;
                location += isPassword ? `?password=${d[1].password}` : ``;
                GM_setValue('_oGameSrcFirstConf', location);
                GM_setValue('_oGameSrcSecondConf', location);
                GM_setValue('_oGameSrcCh', location);
                document.location = location;
            } else {
                alert(d[1].msg || d[1]);
            }
        })
}

function insertAutoRefresh() {
    let autoRefresh = GM_getValue('_oAutoRefreshBox') === undefined ? true : GM_getValue('_oAutoRefreshBox');

    $(".ll-refresh").after(`<div id="_oAutoRefreshWrap" class="tt" data-title="Auto-refresh">
			<input type="checkbox" id="_oAutoRefreshBox" ${autoRefresh ? "checked" : ""}/>
			<label for="_oAutoRefreshBox"><i class="_oracle_icon"></i></label>
		</div>`);

    $("#_oAutoRefreshBox").change(e => {
        autoRefresh = e.target.checked;
        GM_setValue('_oAutoRefreshBox', autoRefresh);
    });

    setTimeout(function run() {
        let isNeedRefresh = autoRefresh
            && $('.pagenav .grey.smallfont').text() === "Page 1";
        let isJustRefresh = document.hasFocus()
            && (Date.now() - lastActivity < 5 * 60 * 1000)
            && $('.ll-gamelist.sel').length === 1;
        let isGameSearchEnable = autoRefresh
            && (Date.now() - lastActivity < 30 * 60 * 1000)
            && !($("#_oGameSearchNone")[0].checked);
        if (isNeedRefresh) {
            if (isGameSearchEnable || isJustRefresh)
                $('.icon-refresh').click();
            if (isGameSearchEnable) {
                searchGame();
            }
        }
        setTimeout(run, 2200);
    }, 10);

    $(document).focus(() => {
        if (autoRefresh) {
            $('.icon-refresh').click();
        }
    });

}

function getOpenGames($_oGameSearchOption) {
    let $openGames = [];
    let isRankedGamesChecked = $('#_oGameRankedRedHeart')[0].checked;
    let isCompetitionGamesChecked = $('#_oGameRankedGoldHeart')[0].checked;
    let doNotSearch = !$_oGameSearchOption[0].checked;
    if (doNotSearch) { // prepare
        if (isRankedGamesChecked) {
            $openGames = $('.gamerow.join > .gameoptions > .randimg > img[src="/images/lives.png"]').parent().parent().parent();
        } else if (isCompetitionGamesChecked) {
            let $goldLives = $('.gamerow.join > .gameoptions > .randimg > img[src="/images/goldlives.png"]').parent().parent().parent();
            $openGames = isRankedGamesChecked ? $openGames.add($goldLives) : $goldLives;
        } else {
            $openGames = $('.gamerow.join > .gameoptions > .randimg > img[src="/images/lock.png"], .gamerow.join > .gameoptions > .randimg > img[src="/images/cam.png"]')
                .parent().parent().parent();
            $openGames = $openGames.add($('.gamerow.join > .gameoptions > .randimg:empty').parent().parent());
        }
    }
    return $openGames;
}
function searchGame() {
    let $_oGameSearchOption = $("input[name=_oGameSearchOption]:radio");
    let $openGames = getOpenGames($_oGameSearchOption);

    if ($openGames.length) {
        searchGameBy();
    }

    function searchGameBy() {
        let searchByGameType = $_oGameSearchOption[1].checked;
        let searchByGameSetup = $_oGameSearchOption[2].checked;
        let searchByHostId = $_oGameSearchOption[3].checked;
        if (searchByGameType) {
            let _oGameType = $('#_oGameTypeSelect').val();
            openGameByType($openGames, _oGameType);
        } else if (searchByGameSetup) {
            let _oGameSetups = $('#_oGameSetupId').val().replace(/\s/g, '').split(',');
            openGameBySetup($openGames, _oGameSetups);
        } else if (searchByHostId) {
            let _oGameCreators = $('#_oGameCreatorId').val().replace(/\s/g, '').split(',');
            openGameByCreator($openGames, _oGameCreators);
        }
    }
}

function insertSearch() {
    let insertHtml = `
    <div>
        <!--Header-->
        <h2 class="separator vm">Search game when auto-refresh is on</h2>
        <!--Settings-->
        <input type="radio" id="_oGameSearchNone" name="_oGameSearchOption" checked>Don't search game<br>
        <input type="radio" name="_oGameSearchOption" value="_oGameSearchByType">
        <label for="_oGameTypeSelect">Game type:</label><br>
            <select id="_oGameTypeSelect">
				<option value="mafia">mafia</option>
            	<option value="dicewars">dicewars</option>
            	<option value="liarsdice">liarsdice</option>
            	<option value="acrotopia">acrotopia</option>
				<option value="battlegrounds">battlegrounds</option>
				<option value="battleships">battleships</option>
				<option value="boggle">boggle</option>
				<option value="cheat">cheat</option>
				<option value="checkers">checkers</option>
				<option value="chess">chess</option>
				<option value="chinese">chinese</option>
				<option value="concentration">concentration</option>
				<option value="connect4">connect4</option>
				<option value="crackcode">crackcode</option>
				<option value="crazyeights">crazyeights</option>
				<option value="dotsboxes">dotsboxes</option>
				<option value="drawit">drawit</option>
				<option value="ghost">ghost</option>
				<option value="go">go</option>
				<option value="hearts">hearts</option>
				<option value="hex">hex</option>
				<option value="jotto">jotto</option>
				<option value="mancala">mancala</option>
				<option value="ratscrew">ratscrew</option>
				<option value="reversi">reversi</option>
				<option value="snakes">snakes</option>
				<option value="stackit">stackit</option>
				<option value="texas">texas</option>
				<option value="tira">tira</option>
			</select><br>
        <label for="_oGameRankedRedHeart"><img src="/images/lives.png">(Ranked)</label>
			    <input type="checkbox" id="_oGameRankedRedHeart" name="redHeart" value="redHeart"><br>
		    <label for="_oGameRankedGoldHeart"><img src="/images/goldlives.png">(Competition)</label>
			    <input type="checkbox" id="_oGameRankedGoldHeart" name="goldHeart" value="goldHeart"><br>
        <input type="radio" name="_oGameSearchOption" value="_oGameSearchBySetup">
        <label for="_oGameSetupId">Setup ids:</label><br>
            <input id="_oGameSetupId" type="text" value="1375880"><br>
		<input type="radio" name="_oGameSearchOption" value="_oGameSearchByCreator">
        <label for="_oGameCreatorId">Creator ids:</label><br>
            <input id="_oGameCreatorId" type="text" value="656967"><br>
	</div>`;
    $('#lobbyinfo_box').before(insertHtml);

    $( "#_oGameSetupId" ).val(GM_getValue('_oGameSetupId') || '');
    $( "#_oGameCreatorId" ).val(GM_getValue('_oGameCreatorId') || '');
    $("#_oGameRankedRedHeart").prop("checked", GM_getValue('_oGameRankedRedHeart') || false);
    $("#_oGameRankedGoldHeart").prop("checked", GM_getValue('_oGameRankedGoldHeart') || false);
    $( "#_oGameSetupId" ).change((e) => {
        GM_setValue('_oGameSetupId', e.target.value);
    });
    $( "#_oGameCreatorId" ).change((e) => {
        GM_setValue('_oGameCreatorId', e.target.value);
    });
    $( "#_oGameRankedRedHeart" ).change((e) => {
        GM_setValue('_oGameRankedRedHeart', e.target.checked);
    });
    $( "#_oGameRankedGoldHeart" ).change((e) => {
        GM_setValue('_oGameRankedGoldHeart', e.target.checked);
    });
}

function openGameByType($openGames, _oGameType) {
    $openGames.each((_, row) => {
        if (row.classList.contains(_oGameType + '_gamerow')) {
            // let gameId = row.getAttribute('data-gid');
            // document.location = `game/${gameId}`;
            $(row).find('.sitdown > a')[0].click();
            $('#_oGameSearchNone')[0].click();
            return false;
        }
    });
}

async function openGameBySetup($gameRows, _oGameSetups) {
    let rowsLength = $gameRows.length;
    for (let i = 0; i < rowsLength; i++) {
        let data = await _openGameBySetup($gameRows[i]);
        let setup =  data[1].data !== undefined ? data[1].data.match(/\/setup\/[0-9]+/)[0].split("/")[2] : '';
        console.log(_oGameSetups, setup);
        if (_oGameSetups.indexOf(setup) !== -1) {
            console.log("found game = " + setup);
            let gameId = $gameRows.eq(i).attr('data-gid');
            document.location = `game/${gameId}`;
            // $gameRows[i].querySelector('a').click();
            // $gameRows[i].querySelector('.sitdown > a').click();
            /*$gameRows.eq(i).find('.sitdown > a').each((_, e) => {
                if (e.textContent === "Join game")
                    e.click();
            });
            $gameRows.eq(i).find('.sitdown > a').click();*/
            $('#_oGameSearchNone')[0].click();
            break;
        }
    }
}

function _openGameBySetup(gameRow) {
    const gid = gameRow.getAttribute("data-gid");
    return Promise.resolve($.get(`https://epicmafia.com/game/${gid}/info`));
}

function openGameByCreator($openGames, _oGameCreators) {
    $openGames.find('.pull_right > .creator > a').each((_, creator) => {
        let creatorId = creator.getAttribute('data-uid');
        if (_oGameCreators.indexOf(creatorId) !== -1) {
            $(creator).parents('.gamerow').find('.sitdown > a')[0].click();
            $('#_oGameSearchNone')[0].click();
        }
    });
}