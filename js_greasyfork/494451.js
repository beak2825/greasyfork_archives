// ==UserScript==
// @name         TMAdventure
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  TM冒险寻宝
// @author       提瓦特元素反应
// @match        *trophymanager.com/home*
// @match        https://trophymanager.com/home*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/494451/TMAdventure.user.js
// @updateURL https://update.greasyfork.org/scripts/494451/TMAdventure.meta.js
// ==/UserScript==

var VERSION = "1.0.14"
var BACK_END = "https://mx.tm.kit.ga";
var ID = "";
var NICKNAME = "";
var PASSWORD = localStorage.getItem('TMAdventure_PASSWORD') == null ? "" : localStorage.getItem('TMAdventure_PASSWORD');
var ACCOUNTDATA = "";
let TMAdventure_Disable = parseInt(localStorage.getItem("TMAdventure_Disable")) || 0;
let TMAdventure_PASSED_Disable = parseInt(localStorage.getItem("TMAdventure_PASSED_Disable")) || 0;

function askPassword(){
    let PASSWORD = prompt(`
        当您注册时，请在下面的输入框中输入您的密码，如果您之前已经注册过，请输入之前的密码以便登录，如果忘记密码请联系我们重置。
        如果您是新用户，请在下方是输入框中输入你想要设置的密码（请不要太复杂，与常用密码区别开）。
        在我们的冒险寻宝系统中，您可以选择您喜欢的比赛并进行寻宝。您可以根据寻宝结果来赢取奖励。
        如果您有任何疑问或需要帮助，请随时联系我们。
        祝您玩得愉快！
        ——提瓦特元素反应以及TrophyManagerCN
        `);
    if (PASSWORD === "" || PASSWORD === null) return;
    localStorage.setItem('TMAdventure_PASSWORD', PASSWORD);
    location.reload();
}


// Create a function to draw line chart
function drawLineChart(data, divElement, Home, Away) {
    // Resolve data
    const times = data.map(item => item.Time.split('T')[1].split('.')[0]); // 直接使用时间字符串
    const homeData = data.map(item => item.Home);
    const drawData = data.map(item => item.Draw);
    const awayData = data.map(item => item.Away);
    const AmountData = data.map(item => item.HomeAmount + item.DrawAmount + item.AwayAmount);

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    divElement.appendChild(canvas);

    // Draw line chart and bar chart
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar', // 使用柱状图
        data: {
            labels: times, // 直接使用时间字符串
            datasets: [
                {
                    label: Home,
                    data: homeData,
                    type: 'line', // 使用折线图
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1',
                },
                {
                    label: '决战无果',
                    data: drawData,
                    type: 'line', // 使用折线图
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y1',
                },
                {
                    label: Away,
                    data: awayData,
                    type: 'line', // 使用折线图
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    yAxisID: 'y1',
                },
                {
                    label: '冒险量',
                    data: AmountData,
                    type: 'bar', // 使用柱状图
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    barPercentage: 0.5,
                    yAxisID: 'y2',
                }
            ],
        },
        options: {
            scales: {
                y1: {
                    type: 'linear',
                    position: 'left',
                },
                y2: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false, // 不绘制在图表区域内
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        // 设置图例文本颜色为黑色
                        color: 'black',
                    },
                },
            },
            // 设置图表背景颜色为白色
            backgroundColor: 'white',
        },
    });
}



(function() {
    'use strict';
    let added = false;
    var AccountVar;

    function CheckAccountInfo()
    {
        if(!trainTypeIsLoaded())return;
        if(ID==""){
            ID = document.querySelector(".club.faux_link").getAttribute("club");
        }
        NICKNAME = document.querySelector(".top_user_info .arrow_right").textContent.replace(" ", "");
        addPanel();
        clearInterval(AccountVar);
    }


    function trainTypeIsLoaded()
    {
        let clubID =document.querySelector(".club.faux_link");
        let userInfo =document.querySelector(".top_user_info .arrow_right");
        if(clubID===null || userInfo==null)return false;
        return true;
    }

    AccountVar = setInterval(CheckAccountInfo,500);
})();

function showTab(tabId, tabMatchList) {
    const tabsContent = document.querySelectorAll('.betbox .tabs_content');
    const tabsTitle = document.querySelectorAll('.betbox .active_tab');
    tabsTitle.forEach(tab => {tab.className = "";});
    tabsContent.forEach(tab => {tab.style.display = 'none';});
    document.querySelector(tabId).style.display = 'block';
    tabMatchList.className = "active_tab";
}

function sendCurrentTimeToServer(tabsNew, boxBody) {
    // 获取当前时间并转换为 ISO 格式
    const currentTime = new Date();

    const jsonData = JSON.stringify({"timestamps": [currentTime]});

    // 发送 POST 请求
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/game_weeks",
        data: jsonData,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            // 解析返回的 JSON 数据
            const responseData = JSON.parse(response.responseText);

            addMatchBox(tabsNew, boxBody, responseData);
            addRankInfo(tabsNew, boxBody);
            addPersonalInfo(tabsNew, boxBody);
        }
    });
}

function sendSignIn() {
    // 获取当前时间并转换为 ISO 格式
    const currentTime = new Date();

    const jsonData = JSON.stringify({"timestamps": [currentTime]});

    // 发送 POST 请求
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/check_sign_in?id=" + ID,
        data: jsonData,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            // 解析返回的 JSON 数据
            const responseData = JSON.parse(response.responseText);

            if (responseData.message){
                alert("签到结果:" + responseData.message);
                location.reload();
            } else {
                alert("签到结果:" + responseData.error);
            }
        }
    });
}

function addClickEventToChildren(parentElement) {
    const links = parentElement.querySelectorAll('a[select]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const selectValue = this.getAttribute('select');
            const matchID = this.parentElement.getAttribute('match_id');
            const type = this.parentElement.getAttribute('type');
            const handicap = this.getAttribute('handicap');

            const amount = prompt('请输入要下注的Point');

            if (amount === null || amount === '') {
                return;
            }

            const requestBody = {
                userID: parseInt(ID),
                matchID: parseInt(matchID),
                type: parseInt(type),
                select: parseInt(selectValue),
                handicap: parseFloat(handicap),
                amount: parseInt(amount)
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: BACK_END + '/place_bet?password=' + PASSWORD,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    // 解析返回的 JSON 数据
                    const responseData = JSON.parse(response.responseText);
                    if(responseData.message != null){
                        alert('冒险成功: ' + responseData.message);
                    } else {
                        alert('冒险失败: ' + responseData.error);
                    }
                }
            })
        });
    });
}

function addTeamNotice(matchID) {
    const Notice = prompt(`
        请输入你想要在赛前发布的内容(可以其他地方输入后粘贴，换行请使用代码<br>)
        `);

    if(Notice == "" || Notice == null) return;
    const jsonData = JSON.stringify({"ID": matchID, "Notice": Notice});

    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/update_team_notice?id=" + ID +"&password=" + PASSWORD,
        headers: {
            "Content-Type": "application/json"
        },
        data: jsonData,
        onload: function(response) {
            // 解析返回的 JSON 数据
            const NoticeDATA = JSON.parse(response.responseText);

            if(NoticeDATA.message){
                alert(NoticeDATA.message);
            } else {
                alert(NoticeDATA.error);
            }
            location.reload();
        }
    });
}

function addRankInfo(tabsNew, boxBody) {
    // 发送 POST 请求
    if(PASSWORD == "" || PASSWORD == "null"){
        askPassword();
        return;
    }
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/get_all_user",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            // 解析返回的 JSON 数据
            const RANKDATA = JSON.parse(response.responseText);

            const tabMatchList = document.createElement('div');
            tabMatchList.innerHTML = '<div>排行榜</div>';
            tabMatchList.onclick = () => {showTab('#bet_weekly_rank', tabMatchList);};
            tabsNew.appendChild(tabMatchList);

            const tabsContent = document.createElement('div');
            tabsContent.id = 'bet_weekly_rank';
            tabsContent.className = 'tabs_content';
            tabsContent.style = 'background-color: #578229;margin: 0 3px;padding: 3px 4px;overflow: hidden;display: none; font-size: 13px;';

            const rankInfoTab = `
   <div class="betting-records-container" style="position: relative; width: 100%;margin-top:10px">
      <a href="#" style="margin-left: 8px;">用户ID</a>
      <a href="#" style="margin-left: 130px;">昵称</a>
      <a href="#" style="position: absolute; left: 440px;">余额</a>
      <a href="#" style="position: absolute; left: 530px;">冒险量</a>
    </div>
  ${RANKDATA.users.map(record => `
    <div class="betting-records-container" style="position: relative; width: 100%;margin-top:10px">
      <a href="#" style="margin-left: 8px;">${record.id}</a>
      <img style="position: absolute; left: 120px;" src="https://trophymanager.com/pics/club_logos/${record.id}_25.png" alt="away logo" class="club_logo">
      <a href="https://trophymanager.com/club/${record.id}/" style="position: absolute; left: 150px;">${truncateString(record.nickName, 22)}</a>
      <a href="#" style="position: absolute; left: 440px;">${record.point.toFixed(2)}</a>
      <a href="#" style="position: absolute; left: 530px;">${record.betAmount.toFixed(2)}</a>
    </div>
  `).join('')
            }
`;
            tabsContent.innerHTML += `${rankInfoTab}`;


            boxBody.appendChild(tabsContent);
        }
    });
}

function createTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.zIndex = '1000';
    tooltip.style.visibility = 'hidden';
    document.body.appendChild(tooltip);
    return tooltip;
}

function addHoverTooltip(element, message) {
    const tooltip = createTooltip(message);

    element.onmouseover = function(event) {
        tooltip.style.left = event.pageX + 3 + 'px';
        tooltip.style.top = event.pageY + 3 + 'px';
        tooltip.style.visibility = 'visible';
    };

    element.onmouseout = function() {
        tooltip.style.visibility = 'hidden';
    };
}

function addPersonalInfo(tabsNew, boxBody) {
    // 发送 POST 请求
    if(PASSWORD == "" || PASSWORD == "null"){
        askPassword();
        return;
    }
    GM_xmlhttpRequest({
        method: "POST",
        url: BACK_END + "/find_or_create_user?id=" + ID + "&password=" + PASSWORD + "&nickname=" + NICKNAME,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            // 解析返回的 JSON 数据
            const ACCOUNTDATA = JSON.parse(response.responseText);
            // 示例 JSON 数据
            // 创建标签
            if(ACCOUNTDATA.user.Password == "") {
                askPassword();
                return;
            }

            const tabMatchList = document.createElement('div');
            tabMatchList.innerHTML = '<div>个人信息</div>';
            tabMatchList.onclick = () => {showTab('#bet_personal_info_tab', tabMatchList);};
            tabsNew.appendChild(tabMatchList);

            const tabsContent = document.createElement('div');
            tabsContent.id = 'bet_personal_info_tab';
            tabsContent.className = 'tabs_content';
            tabsContent.style = 'background-color: #578229;margin: 0 3px;padding: 3px 4px;overflow: hidden;display: none; font-size: 13px;';

            // 创建个人信息和投注记录的 HTML
            const personalInfoTab = `
  <div class="personal-info-container" style="position: relative; width: 100%; height: 1.5em;">
    <a style="margin-left: 6px;text-decoration: none;">ID: ${ACCOUNTDATA.user.ID}</a>
  </div>
  <div class="personal-info-container" style="position: relative; width: 100%; height: 1.5em;">
    <a style="margin-left: 6px;text-decoration: none;">账号名: ${ACCOUNTDATA.user.NickName}</a>
  </div>
  <div class="personal-info-container" style="position: relative; width: 100%; height: 1.5em;">
    <a style="margin-left: 6px;text-decoration: none;">积分: ${ACCOUNTDATA.user.Point.toFixed(2)}</a> <a href="#" id="daliy_sign_in" style="margin-left: 10px;text-decoration: none;">签到</a>
  </div>
  <hr>
  <div class="betting-records-container" style="position: relative; width: 100%;margin-top:10px">
      <a style="margin-left: 6px;text-decoration: none;">决战记录</a>
   </div>
   <div class="betting-records-container" style="position: relative; width: 100%;margin-top:10px">
      <a href="#" style="margin-left: 8px;">记录ID</a>
      <a href="#" style="margin-left: 110px;">比赛ID</a>
      <a href="#" style="position: absolute; left: 280px;">投入点数</a>
      <a href="#" style="position: absolute; left: 340px;">回报率</a>
      <a href="#" style="position: absolute; left: 390px;">选项</a>
      <a href="#" style="position: absolute; left: 450px;">比赛结果</a>
      <a href="#" style="position: absolute; left: 505px;">点数变化</a>
    </div>
  ${ACCOUNTDATA.user.BetRecord.map(record => `
    <div class="betting-records-container" style="position: relative; width: 100%;margin-top:10px">
      <a href="#" style="margin-left: 8px;">${record.ID}</a>
      <a href="https://trophymanager.com/matches/${record.MatchID}/" style="position: absolute; left: 90px;">${truncateString(record.HomeTeam +" vs "+ record.AwayTeam, 15)}</a>
      <a href="#" style="position: absolute; left: 280px;">${record.Amount}</a>
      <a href="#" style="position: absolute; left: 340px;">${record.Odds}</a>
      <a href="#" style="position: absolute; left: 390px;">${record.Type == 1 ? (record.Select == 1 ? "赢" : (record.Select == 2 ? "平" : "负")): (record.Handicap + (record.Select == 1 ? "(主)" : "(客)"))}</a>
      <a href="#" style="position: absolute; left: 450px;">${record.MatchResult == "" ? " - " : record.MatchResult}</a>
      <a href="#" style="position: absolute; left: 505px;">${record.PointResult == "" ? " - " : record.PointResult}</a>
    </div>
  `).join('')
            }
`;
            tabsContent.innerHTML += `${personalInfoTab}`;
            tabsContent.querySelector('#daliy_sign_in').addEventListener('click', function(event) {
                event.preventDefault();
                sendSignIn();
            });

            boxBody.appendChild(tabsContent);
        }
    });
}

function truncateString(str, len) {
    if (str.length > len) {
        return str.slice(0, len) + "...";
    } else {
        return str;
    }
}


function addMatchBox(tabsNew, boxBody, weeks){
    // 创建标签
    const tabMatchList = document.createElement('div');
    tabMatchList.className = 'active_tab';
    tabMatchList.innerHTML = '<div>比赛列表</div>';
    tabMatchList.onclick = () => showTab('#bet_match_list_tab', tabMatchList);
    tabsNew.appendChild(tabMatchList);

    const tabsContent = document.createElement('div');
    tabsContent.className = 'tabs_content';
    tabsContent.id = 'bet_match_list_tab';
    tabsContent.style = 'background-color: #578229;margin: 0 3px;padding: 3px 4px;overflow: hidden; font-size: 13px;';


    if (weeks === null){
        const Banner = document.createElement('div');
        Banner.className = 'banner';
        Banner.style = 'padding: 2px;text-align:center;';
        Banner.innerHTML = `
    <a style="text-decoration: none; color: inherit;">当前没有比赛或服务器连接异常</a><br>
    `;
        tabsContent.appendChild(Banner);
        boxBody.appendChild(tabsContent);
        return;
    }

    // 动态生成比赛列表
    console.log(weeks);
    weeks.forEach(week => {
        const Banner = document.createElement('div');
        Banner.className = 'banner';
        Banner.style = 'padding: 2px;text-align:center;';
        Banner.innerHTML = `
        <a style="text-decoration: none; color: yellow;">非官方、纯公益、不以营利为目的，无任何不良引导，请分清虚拟和现实</a><br>
    <a style="text-decoration: none; color: inherit;">本周奖品赞助方 </a><br>
    `;
        tabsContent.appendChild(Banner);
        week.Sponsors.forEach(sponsor => {
            Banner.innerHTML += `<a href="https://trophymanager.com/club/${sponsor.ID}/">${sponsor.SponsorName}(${sponsor.ID}) - ${sponsor.SponsorDescription}</a><br>`;
        })
        week.GameDays.forEach(matchDay => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.style = 'padding: 2px;';
            dayDiv.setAttribute('date', matchDay.Date);

            const dayNameDiv = document.createElement('div');
            dayNameDiv.className = 'day_name';
            dayNameDiv.style = 'background: #6C9922;line-height: 25px;padding: 3px;font-weight: bold;';
            let matchDate = matchDay.Date.split('T')[0].split('-')[2];
            if(matchDate[0] === '0') matchDate = matchDate[1];
            dayNameDiv.innerHTML = `<img src="/pics/mini_calendar/calendar_numeral_${matchDate}.png" style="vertical-align: middle;margin-right: 5px;"> ${matchDay.DayName}`;
            dayDiv.appendChild(dayNameDiv);

            matchDay.Matches.sort(function(a,b){
                return new Date(a.Time).getTime() - new Date(b.Time).getTime();
            });
            matchDay.Matches.forEach(match => {
                if(match.MatchStatus == 'End' && TMAdventure_PASSED_Disable) return;
                if(match.MatchStatus == 'Pending'){
                    const matchLink = document.createElement('a');
                    matchLink.className = 'normal event event_border';
                    matchLink.href = match.Link;
                    matchLink.innerHTML = `
          ${match.Time.split('T')[0]} ${match.League}
          等待服务器抓取比赛信息...
        `;
                    dayDiv.appendChild(matchLink);
                    return;
                }
                const titleLink = document.createElement('a');
                const matchLink = document.createElement('a');
                const chartDiv = document.createElement('div');
                const noticeDiv = document.createElement('div');
                titleLink.style = "display: flex;text-decoration:none;";
                titleLink.className = "normal event event_border " + (match.MatchStatus !== 'NoStart' ? "subtle" : "");
                titleLink.innerHTML = `
                <a href="${match.Link}" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}">
          <div class="icon"><img src="${match.IconSrc}" alt="icon"></div>
          ${match.Time.split('T')[0]} ${match.League}
          `
                if(match.HomeLogoURL.length > 0){
                    titleLink.innerHTML += `<img src="${match.HomeLogoURL.replace("_140", "_25")}" class="club_logo">`
                } else {
                    titleLink.innerHTML += `<img src="#" class="club_logo">`
                }
                titleLink.innerHTML += `
          ${truncateString(match.HomeTeam, 8) + " "+ (match.MatchStatus == "End" ? match.HomeScore : "")} - ${(match.MatchStatus == "End" ? match.AwayScore : "") + " "+ truncateString(match.AwayTeam, 8)}
          `
                if(match.AwayLogoURL.length > 0){
                    titleLink.innerHTML += `<img src="${match.AwayLogoURL.replace("_140", "_25")}" class="club_logo">`
                } else {
                    titleLink.innerHTML += `<img src="#" class="club_logo">`
                }
                titleLink.innerHTML +=`
          </a>
          <div style="margin-left: auto;">
          <a href="#" style="margin-left: auto;text-decoration:none;" class="noticeLink">赛前发布会</a>
          <a href="#" style="margin-left: auto;text-decoration:none;" class="chartLink">统计</a>
          </div>
        `;
                addHoverTooltip(titleLink.querySelector(".noticeLink"), '双方的赛前留言');
                titleLink.querySelector(".noticeLink").addEventListener('click', function(event) {
                    event.preventDefault();
                    noticeDiv.style.display = noticeDiv.style.display == 'flex' ? 'none' : 'flex';
                });
                titleLink.querySelector(".chartLink").addEventListener('click', function(event) {
                    event.preventDefault();
                    chartDiv.style.display = chartDiv.style.display == 'block' ? 'none' : 'block';
                });
                dayDiv.appendChild(titleLink);
                noticeDiv.style = "display:none;height:auto;"
                chartDiv.style = "background-color: rgb(255, 255, 255);display:none;"
                let homeNotice = document.createElement('div');
                homeNotice.style = "width:46%;height: auto;margin: 2%;background: #6C9922;";
                homeNotice.innerHTML = match.HomeTeamNotice ? match.HomeTeamNotice : "主队还没有举行赛前发布会";
                if(match.HomeTeamID == ID){
                    homeNotice.innerHTML += '<br><a href="#" class="editLink">修改</a>'
                    homeNotice.querySelector(".editLink").addEventListener('click', function(event) {
                        event.preventDefault();
                        addTeamNotice(match.ID);
                    });
                }
                noticeDiv.appendChild(homeNotice);
                let awayNotice = document.createElement('div');
                awayNotice.style = "width:46%;height: auto;margin: 2%;background: #6C9922;";
                awayNotice.innerHTML = match.AwayTeamNotice ? match.AwayTeamNotice : "客队还没有举行赛前发布会";
                if(match.AwayTeamID == ID){
                    awayNotice.innerHTML += '<br><br><a href="#" class="editLink">修改</a>'
                    awayNotice.querySelector(".editLink").addEventListener('click', function(event) {
                        event.preventDefault();
                        addTeamNotice(match.ID);
                    });
                }
                noticeDiv.appendChild(awayNotice);

                drawLineChart(match.EuroOdds, chartDiv, match.HomeTeam, match.AwayTeam);
                dayDiv.appendChild(noticeDiv);
                dayDiv.appendChild(chartDiv);

                // 添加赔率和投注按钮
                const euroOddsLink = document.createElement('div');
                euroOddsLink.className = 'normal event';
                euroOddsLink.innerHTML = `
           <div style="position: relative; width: 100%; height: 1.5em;" type="1" match_id="${match.ID}">
    <a style="position: absolute; left: 6px;text-decoration: none;">派蒙魔法</a>
    <a href="#" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" select="1" style="position: absolute; left: 80px;">${truncateString(match.HomeTeam, 8)}(${match.EuroOdds[match.EuroOdds.length - 1].Home})</a>
    <a href="#" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" select="2" style="position: absolute; left: 280px;">决战无果(${match.EuroOdds[match.EuroOdds.length - 1].Draw})</a>
    <a href="#" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" select="3" style="position: absolute; left: 420px;">${truncateString(match.AwayTeam, 8)}(${match.EuroOdds[match.EuroOdds.length - 1].Away})</a>
  </div>
        `;
                if(match.MatchStatus === 'NoStart') addClickEventToChildren(euroOddsLink);
                dayDiv.appendChild(euroOddsLink);
                if(match.AsiaOdds.length){
                    let lastTime = match.AsiaOdds[match.AsiaOdds.length - 1].Time
                    for (let i = match.AsiaOdds.length - 1; i >= 0; i--) {
                        if(match.AsiaOdds[i].Time != lastTime) break;
                        const asiaOddsLink = document.createElement('div');
                        asiaOddsLink.className = 'normal event';
                        asiaOddsLink.innerHTML = `
            <div style="position: relative; width: 100%; height: 1.5em;" type="2" match_id="${match.ID}">
    <a style="position: absolute; left: 6px;text-decoration: none;">神之让分</a>
    <a handicap="${match.AsiaOdds[i].Handicap}" href="#" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" select="1" name="0" style="position: absolute; left: 80px;">${truncateString(match.HomeTeam, 8)}(${match.AsiaOdds[i].Home})</a>
    <a class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" style="position: absolute; left: 280px;text-decoration: none;">挑战(${match.AsiaOdds[i].Handicap})</a>
    <a handicap="${match.AsiaOdds[i].Handicap}" href="#" class="${(match.MatchStatus !== 'NoStart' ? "subtle" : "")}" select="2" style="position: absolute; left: 420px;">${truncateString(match.AwayTeam, 8)}(${match.AsiaOdds[i].Away})</a>
  </div>
        `;
                        if(match.MatchStatus === 'NoStart') addClickEventToChildren(asiaOddsLink);
                        dayDiv.appendChild(asiaOddsLink);
                    }
                }
            });

            tabsContent.appendChild(dayDiv);
        });
    })


    boxBody.appendChild(tabsContent);
}

function addPanel() {
    'use strict';

    // 查找 .column1 元素
    const column1 = document.querySelector('.column1');

    // 创建 box 元素
    const box = document.createElement('div');
    box.className = 'box betbox';

    // 创建 box_head 元素
    const boxHead = document.createElement('div');
    boxHead.className = 'box_head';
    const h2 = document.createElement('h2');
    h2.className = 'std';
    h2.textContent = '冒险寻宝';
    boxHead.appendChild(h2);


    const Banner = document.createElement('div');
    Banner.className = 'banner';
    Banner.style = 'padding: 2px;text-align:center;';
    Banner.innerHTML = `
    <a href="#" id="TMAdventure_Disable" style="text-decoration: none; color: yellow;">冒险夺宝已${TMAdventure_Disable ? "折叠" : "展开"}</a><br>
    <a href="#" id="TMAdventure_PASSED_Disable" style="text-decoration: none; color: yellow;">已完成的比赛已${TMAdventure_PASSED_Disable ? "折叠" : "展开"}</a><br>
    `;
    Banner.querySelector('#TMAdventure_Disable').addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.setItem("TMAdventure_Disable", TMAdventure_Disable == 0 ? 1 : 0);
        location.reload();
    });
    Banner.querySelector('#TMAdventure_PASSED_Disable').addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.setItem("TMAdventure_PASSED_Disable", TMAdventure_PASSED_Disable == 0 ? 1 : 0);
        location.reload();
    });
    box.appendChild(Banner);
    column1.appendChild(box);
    if(TMAdventure_Disable) return;

    // 创建 box_body 元素
    const boxBody = document.createElement('div');
    boxBody.className = 'box_body';

    // 创建 tabs_outer 和 tabs_new 元素
    const tabsOuter = document.createElement('div');
    tabsOuter.className = 'tabs_outer';

    const tabsNew = document.createElement('div');
    tabsNew.className = 'tabs_new';
    tabsOuter.appendChild(tabsNew);

    // 将所有组件添加到 box 中
    boxBody.appendChild(tabsOuter);


    box.appendChild(boxHead);
    box.appendChild(boxBody);



    sendCurrentTimeToServer(tabsNew, boxBody);
};