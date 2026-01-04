// ==UserScript==
// @name 	     Paparazzi TW
// @description TW script to move by chat commands
// @author 	You
// @version 	0.1
// @include 	https://*.the-west.*.*/game.php*
// @namespace    http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495976/Paparazzi%20TW.user.js
// @updateURL https://update.greasyfork.org/scripts/495976/Paparazzi%20TW.meta.js
// ==/UserScript==


(function () {

function RankingPlayerPrototype(playerInfo, stats, exp) {
    let getMetric = function(field1, field2) {
        if (stats[field1] && stats[field1][field2]) return parseInt(stats[field1][field2]);
    
        return 0;
    }; 
    this.name = playerInfo.playername;
    this.labels = {
        town: playerInfo.town ? playerInfo.town.name : 'Бомж',
        alliance: playerInfo.town && playerInfo.town.alliance_name ? playerInfo.town.alliance_name : 'Без альянса',
        class: playerInfo.className,
    };
    this.metrics = {
        experience: exp,
        works: getMetric('Общее','Выполнено работ'),
        quests_completed: getMetric('Общее','Пройденные квесты'),
        bonds_quests: getMetric('Общее','Получено облигаций за задания'),
        duels: getMetric('Дуэли','Проведено дуэлей в нападении'),
        duels_kills: getMetric('Дуэли','Лишено сознания противников'),
        duels_passed_outs: getMetric('Дуэли','Потеряно сознаний в дуэли'),
        duels_win: getMetric('Дуэли','Побед на дуэлях'),
        duels_lose: getMetric('Дуэли','Поражений'),
        duels_failed: getMetric('Дуэли','Сорвавшихся дуэлей'),
        duels_sheriff_set: getMetric('Шериф','Назначено наград "Живым или мертвым"'),
        duels_sheriff_set_killed: getMetric('Шериф','Поручено убийств'),
        duels_sheriff_get_killed: getMetric('Шериф','Разыскиваемые лица пойманы мертвыми'),
        duels_sheriff_sum: parseInt(stats['Шериф']['Сумма наград за голову'].slice(1)),
        duels_sheriff_get: getMetric('Шериф','Получено наград за головы'),
        duels_sheriff_get_dollars: parseInt(stats['Шериф']['Получено денег за головы'].slice(1)),
        duels_sheriff_get_dollars_sum: parseInt(stats['Шериф']['Сумма наград за голову'].slice(1)),
        duels_npc_win: getMetric('Дуэли с бандитами','Побед над бандитами'),
        duels_npc_lose: getMetric('Дуэли с бандитами','Поражений в схватках с бандитами'),
        duels_npc_exp: getMetric('Дуэли с бандитами','Накоплено опыта в поединках с бандитами'),
        deposit: parseInt(stats['Экономика']['Уплачено в банк'].slice(1)),
        craft: getMetric('Профессия','Изготовлено предметов'),
        building_points: getMetric('Строительство','Строительных очков'),
    };
    this.additionalMetrics = {
        banned: playerInfo.status == 'Под арестом' ? 1 : 0,
        x: playerInfo.x,
        y: playerInfo.y,
    };
};

RankingPlayerPrototype.prototype = {
    getUrl: function() {
        return `/metrics/job/ranking/world/${Game.worldName}/class/${this.labels.class}/ranking_player/${this.name}`
    },
    getBody: function() {
        const labels = `{town="${this.labels.town}",alliance="${this.labels.alliance}"}`;
        let body = '';
        for (const metric in this.metrics) {
            const metricName = `ranking_${metric}_count`;
            body += `# TYPE ${metricName} counter
${metricName} ${labels} ${this.metrics[metric]} 
`;
        }

        for (const metric in this.additionalMetrics) {
            const metricName = `ranking_${metric}`;
            body += `# TYPE ${metricName} gauge
${metricName} ${labels} ${this.additionalMetrics[metric]} 

`;
        }

        return body;
    }
};


let getPlayer = async function(playerId, exp) {
    let playerInfo = await AjaxAsync.remoteCallMode("profile", "init", {playerId: playerId});
    let stats =  (await AjaxAsync.remoteCall('achievement', 'get_statistic', { playerid: playerId })).stats;
    return new RankingPlayerPrototype(playerInfo, stats, exp);
}

let monRanking = async function() {
    let page = await AjaxAsync.remoteCallMode('ranking', 'get_data', { page: 1, tab: 'experience'});
    const pagesCount = page.pages;
    let currentPage = 0;
    while (pagesCount >= ++currentPage) {
        let page = await AjaxAsync.remoteCallMode('ranking', 'get_data', { page: currentPage, tab: 'experience'});
        let ranking = page.ranking;
        for (let i = 0; i < ranking.length; i++) {
            let player = await getPlayer(ranking[i].player_id, ranking[i].experience);
            pushGateway(player.getUrl(), player.getBody());
            await AjaxAsync.wait(2000);
        }
    } 
}

let basicAuth =  `Basic ${btoa("user:Biph[oseften5")}`
let baseUrl = `https://pushgateway.cthaeh.ru`;
let setMirror = function() {
    baseUrl = `https://pushgateway-mirror.cthaeh.ru:8443`
};
let pushGateway = function(relativeUrl, body) {
    fetch(baseUrl + relativeUrl, {method:'POST',
        headers: {
            'Authorization': basicAuth,
            'Content-Type': 'text/plain'
        },
        body: body,
        }).catch(e => {
            setMirror();
        })
};


    $(document).ready(function () {
        try {
            setInterval(monRanking, 1200000);
            setTimeout(monRanking, 1000);
        } catch (e) {
            console.log("exception occured");
        }
    });
})();

